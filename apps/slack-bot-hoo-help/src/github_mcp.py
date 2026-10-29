"""
github_mcp.py — client for GitHub's hosted MCP server (streamable-HTTP transport).

Read-only access for Hoo Helper: initialize a session, list tools (cached), call tools.
Replies may be JSON or SSE; the Mcp-Session-Id header is echoed back on later requests.

The token comes from a callable and is never logged or put in exception messages.
"""

from __future__ import annotations

import json
import logging
import re
import threading
import time
from typing import Any, Callable, Dict, List, Optional

import requests

logger = logging.getLogger(__name__)

GITHUB_MCP_URL = "https://api.githubcopilot.com/mcp/readonly"
PROTOCOL_VERSION = "2025-03-26"
CLIENT_INFO = {"name": "hoohelp", "version": "1"}
TOOLSETS = "repos,issues,pull_requests"
TIMEOUT_SEC = 20
LIST_TIMEOUT_SEC = 8  # tools/list runs at the start of every turn: fail fast
TOOLS_CACHE_TTL_SEC = 600
LIST_BACKOFF_SEC = 300  # after a failed tools/list, don't try again for this long
MAX_PAGES = 20

MSG_UNAVAILABLE = "GitHub isn't available right now."
MSG_BUSY = "GitHub is busy; try again in a minute."
MSG_TIMEOUT = "GitHub didn't respond in time."


class GitHubMCPError(Exception):
    """A GitHub MCP failure. str(e) is a diagnostic; user_message is safe to show people."""

    def __init__(self, message: str, user_message: str = MSG_UNAVAILABLE, code: Optional[int] = None):
        super().__init__(message)
        self.user_message = user_message
        self.code = code


class _SessionLost(Exception):
    pass


class GitHubMCPClient:
    def __init__(
        self,
        token_provider: Callable[[], str],
        *,
        invalidate: Callable[[], None] = lambda: None,
        http=requests,
        url: str = GITHUB_MCP_URL,
        clock: Callable[[], float] = time.monotonic,
    ):
        self._token_provider = token_provider
        self._invalidate = invalidate
        self._http = http
        self._url = url
        self._clock = clock
        self._lock = threading.RLock()
        self._session_id: Optional[str] = None
        self._initialized = False
        self._next_id = 0
        self._tools: Optional[List[Dict[str, Any]]] = None
        self._tools_at = 0.0
        self._list_failed_at: Optional[float] = None

    # ---- public API -------------------------------------------------------

    def list_tools(self) -> List[Dict[str, Any]]:
        """Cached 10 minutes. If a refresh fails, the last good list is served (or the error raised, when
        there is none) and GitHub isn't asked again for 5 minutes, so an outage costs one slow call."""
        with self._lock:
            now = self._clock()
            if self._tools is not None and (now - self._tools_at) < TOOLS_CACHE_TTL_SEC:
                return self._tools
            if self._list_failed_at is not None and (now - self._list_failed_at) < LIST_BACKOFF_SEC:
                if self._tools is not None:
                    return self._tools
                raise GitHubMCPError("GitHub MCP tools/list backing off after a failure", MSG_UNAVAILABLE)
            try:
                tools: List[Dict[str, Any]] = []
                cursor = None
                for _ in range(MAX_PAGES):
                    result = self._request("tools/list", {"cursor": cursor} if cursor else {},
                                           timeout=LIST_TIMEOUT_SEC)
                    tools.extend(result.get("tools", []))
                    cursor = result.get("nextCursor")
                    if not cursor:
                        break
            except Exception:  # incl. GitHubAuthError from the token provider
                self._list_failed_at = self._clock()
                if self._tools is not None:
                    logger.warning("github mcp tools/list failed; serving the last good list")
                    return self._tools
                raise
            self._tools, self._tools_at, self._list_failed_at = tools, self._clock(), None
            logger.info("Loaded %s tools from GitHub MCP", len(tools))
            return tools

    def call_tool(self, name: str, args: Dict[str, Any]) -> Dict[str, Any]:
        with self._lock:
            return self._request("tools/call", {"name": name, "arguments": args or {}})

    # ---- session ----------------------------------------------------------

    def _ensure_session(self) -> None:
        if self._initialized:
            return
        self._session_id = None
        self._send("initialize", {
            "protocolVersion": PROTOCOL_VERSION,
            "capabilities": {},
            "clientInfo": CLIENT_INFO,
        }, with_session=False)
        try:
            self._send(None, None, notification="notifications/initialized")
        except _SessionLost:
            logger.warning("github mcp session rejected at initialized notification")
            raise GitHubMCPError("GitHub MCP session rejected", MSG_UNAVAILABLE) from None
        self._initialized = True

    def _request(self, method: str, params: Dict[str, Any], *, timeout: float = TIMEOUT_SEC) -> Dict[str, Any]:
        reinit_left = 1
        while True:
            self._ensure_session()
            try:
                return self._send(method, params, timeout=timeout)
            except _SessionLost:
                self._initialized = False
                self._session_id = None
                if reinit_left == 0:
                    logger.warning("github mcp session lost twice")
                    raise GitHubMCPError("GitHub MCP session lost", MSG_UNAVAILABLE) from None
                reinit_left -= 1

    # ---- transport --------------------------------------------------------

    def _headers(self, token: str, with_session: bool) -> Dict[str, str]:
        h = {
            "Authorization": f"Bearer {token}",
            "X-MCP-Toolsets": TOOLSETS,
            "X-MCP-Readonly": "true",
            "Accept": "application/json, text/event-stream",
            "Content-Type": "application/json",
        }
        if with_session and self._session_id:
            h["Mcp-Session-Id"] = self._session_id
        return h

    def _send(self, method, params, *, with_session: bool = True, notification: Optional[str] = None,
              timeout: float = TIMEOUT_SEC):
        if notification:
            payload = {"jsonrpc": "2.0", "method": notification}
        else:
            self._next_id += 1
            payload = {"jsonrpc": "2.0", "id": self._next_id, "method": method, "params": params or {}}
        label = notification or method

        refreshed = False
        retried = False
        while True:
            token = self._token_provider()
            try:
                resp = self._http.post(self._url, json=payload, headers=self._headers(token, with_session),
                                       timeout=timeout)
            except requests.Timeout:
                logger.warning("github mcp %s timed out", label)
                raise GitHubMCPError("GitHub MCP request timed out", MSG_TIMEOUT) from None
            except requests.RequestException as e:
                logger.warning("github mcp %s failed: %s", label, type(e).__name__)
                raise GitHubMCPError(f"GitHub MCP request failed ({type(e).__name__})", MSG_UNAVAILABLE) from None

            status = resp.status_code
            if status == 401:
                if refreshed:
                    logger.warning("auth_failed source=github status=401 (after refresh)")
                    raise GitHubMCPError("GitHub MCP rejected the token (HTTP 401)", MSG_UNAVAILABLE)
                refreshed = True
                self._invalidate()
                continue
            # A stale Mcp-Session-Id: the spec says 404; GitHub's hosted server answers 400 text/plain.
            if status in (400, 404) and with_session and self._session_id:
                raise _SessionLost()
            if status == 429 or status >= 500:
                if retried:
                    logger.warning("github mcp %s busy: HTTP %s", label, status)
                    raise GitHubMCPError(f"GitHub MCP busy (HTTP {status})", MSG_BUSY)
                retried = True
                continue
            if status >= 300:
                logger.warning("github mcp %s failed: HTTP %s", label, status)
                raise GitHubMCPError(f"GitHub MCP request failed (HTTP {status})", MSG_UNAVAILABLE)

            if notification:
                return {}
            sid = _header(resp, "Mcp-Session-Id")
            if sid and method == "initialize":
                self._session_id = sid
            return self._unwrap(resp, token, payload["id"])

    def _unwrap(self, resp, token: str, req_id) -> Dict[str, Any]:
        try:
            data = _parse_body(resp, req_id)
        except ValueError:
            raise GitHubMCPError("GitHub MCP returned an unreadable reply", MSG_UNAVAILABLE) from None
        if not isinstance(data, dict):
            raise GitHubMCPError("GitHub MCP returned an unexpected reply", MSG_UNAVAILABLE)
        err = data.get("error")
        if err:
            msg = str(err.get("message", "unknown error")) if isinstance(err, dict) else str(err)
            code = err.get("code") if isinstance(err, dict) else None
            if token:
                msg = msg.replace(token, "[redacted]")
            raise GitHubMCPError(msg, MSG_UNAVAILABLE, code=code)
        result = data.get("result")
        return result if isinstance(result, dict) else {}


def _header(resp, name: str) -> Optional[str]:
    headers = getattr(resp, "headers", None) or {}
    for k, v in headers.items():
        if k.lower() == name.lower():
            return v
    return None


def _parse_body(resp, req_id) -> Any:
    ctype = (_header(resp, "Content-Type") or "").lower()
    text = resp.text or ""
    if "text/event-stream" not in ctype and not text.lstrip().startswith(("data:", "event:", "id:", ":")):
        return json.loads(text)
    messages = []
    for event in re.split(r"\n\n+", text.replace("\r\n", "\n").replace("\r", "\n")):
        lines = []
        for line in event.split("\n"):
            if line.startswith("data:"):
                v = line[5:]
                lines.append(v[1:] if v.startswith(" ") else v)
        data = "\n".join(lines).strip()
        if not data:
            continue
        try:
            messages.append(json.loads(data))
        except ValueError:
            continue
    for m in messages:
        if isinstance(m, dict) and m.get("id") == req_id and ("result" in m or "error" in m):
            return m
    for m in reversed(messages):
        if isinstance(m, dict) and ("result" in m or "error" in m):
            return m
    raise ValueError("no response event")
