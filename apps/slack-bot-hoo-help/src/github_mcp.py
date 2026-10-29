"""
github_mcp.py — client for GitHub's hosted MCP server (streamable-HTTP transport).

Read-only access for Hoo Helper: initialize a session, list tools (cached), call tools.
Replies may be JSON or SSE; the Mcp-Session-Id header is echoed back on later requests.

The token comes from a callable and is never logged or put in exception messages.
"""

from __future__ import annotations

import json
import logging
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
TOOLS_CACHE_TTL_SEC = 600
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

    # ---- public API -------------------------------------------------------

    def list_tools(self) -> List[Dict[str, Any]]:
        with self._lock:
            if self._tools is not None and (self._clock() - self._tools_at) < TOOLS_CACHE_TTL_SEC:
                return self._tools
            tools: List[Dict[str, Any]] = []
            cursor = None
            for _ in range(MAX_PAGES):
                result = self._request("tools/list", {"cursor": cursor} if cursor else {})
                tools.extend(result.get("tools", []))
                cursor = result.get("nextCursor")
                if not cursor:
                    break
            self._tools, self._tools_at = tools, self._clock()
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
        self._send(None, None, notification="notifications/initialized")
        self._initialized = True

    def _request(self, method: str, params: Dict[str, Any]) -> Dict[str, Any]:
        reinit_left = 1
        while True:
            self._ensure_session()
            try:
                return self._send(method, params)
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

    def _send(self, method, params, *, with_session: bool = True, notification: Optional[str] = None):
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
                                       timeout=TIMEOUT_SEC)
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
            if status == 404 and with_session and self._session_id:
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
            return self._unwrap(resp, token)

    def _unwrap(self, resp, token: str) -> Dict[str, Any]:
        try:
            data = _parse_body(resp)
        except ValueError:
            raise GitHubMCPError("GitHub MCP returned an unreadable reply", MSG_UNAVAILABLE) from None
        if not isinstance(data, dict):
            raise GitHubMCPError("GitHub MCP returned an unexpected reply", MSG_UNAVAILABLE)
        err = data.get("error")
        if err:
            msg = str(err.get("message", "unknown error")) if isinstance(err, dict) else str(err)
            code = err.get("code") if isinstance(err, dict) else None
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


def _parse_body(resp) -> Any:
    ctype = (_header(resp, "Content-Type") or "").lower()
    text = resp.text or ""
    if "text/event-stream" in ctype or text.lstrip().startswith(("data:", "event:", "id:")):
        last = None
        for line in text.splitlines():
            if line.startswith("data:"):
                last = line[5:].strip()
        if last is None:
            raise ValueError("no data line")
        return json.loads(last)
    return json.loads(text)
