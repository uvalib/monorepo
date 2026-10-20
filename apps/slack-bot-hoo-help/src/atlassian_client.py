"""
atlassian_client.py — read-only REST access to the Library's Confluence and Jira.

Config comes from Lambda env (site, cloud id, token type, allow-lists) plus the
service account's email and API token (SSM, loaded in app.py). Classic tokens call
the site directly; scoped tokens go through api.atlassian.com with the cloud id.
Links shown to people always use the site URL.

The API token is never logged.
"""

from __future__ import annotations

import logging
import os
import time
from dataclasses import dataclass, field
from typing import Any, Callable, Dict, List, Optional

import requests

logger = logging.getLogger(__name__)

DEFAULT_SITE = "https://virginia-its.atlassian.net"
DEFAULT_CLOUD_ID = "c417cfa5-aa30-4f3f-be7e-968c5845b5e9"
TIMEOUT_SEC = 10
MAX_RETRY_AFTER_SEC = 5
PRODUCT_NAMES = {"confluence": "Confluence", "jira": "Jira"}


def _keys(raw: str) -> List[str]:
    return [k.strip().upper() for k in (raw or "").split(",") if k.strip()]


@dataclass
class AtlassianConfig:
    site: str
    cloud_id: str
    token_type: str
    email: str
    token: str = field(repr=False)  # shared token (classic), fallback for both products
    confluence_spaces: List[str] = field(default_factory=list)
    jira_projects: List[str] = field(default_factory=list)
    # Scoped tokens are issued per app, so each product can have its own.
    jira_token: str = field(default="", repr=False)
    confluence_token: str = field(default="", repr=False)

    @classmethod
    def from_env(cls, env=None, *, email: str, token: str = "", jira_token: str = "",
                 confluence_token: str = "") -> "AtlassianConfig":
        env = os.environ if env is None else env
        token_type = (env.get("ATLASSIAN_TOKEN_TYPE") or "scoped").strip().lower()
        return cls(
            site=(env.get("ATLASSIAN_SITE") or DEFAULT_SITE).strip().rstrip("/"),
            cloud_id=(env.get("ATLASSIAN_CLOUD_ID") or DEFAULT_CLOUD_ID).strip(),
            token_type="classic" if token_type == "classic" else "scoped",
            email=email or "",
            token=token or "",
            confluence_spaces=_keys(env.get("CONFLUENCE_SPACES", "")),
            jira_projects=_keys(env.get("JIRA_PROJECTS", "")),
            jira_token=jira_token or "",
            confluence_token=confluence_token or "",
        )

    def token_for(self, product: str) -> str:
        specific = self.jira_token if product == "jira" else self.confluence_token
        return specific or self.token

    @property
    def confluence_enabled(self) -> bool:
        return bool(self.email and self.token_for("confluence") and self.confluence_spaces)

    @property
    def jira_enabled(self) -> bool:
        return bool(self.email and self.token_for("jira") and self.jira_projects)

    @property
    def confluence_base(self) -> str:
        if self.token_type == "classic":
            return f"{self.site}/wiki"
        return f"https://api.atlassian.com/ex/confluence/{self.cloud_id}/wiki"

    @property
    def jira_base(self) -> str:
        if self.token_type == "classic":
            return self.site
        return f"https://api.atlassian.com/ex/jira/{self.cloud_id}"


def confluence_link(cfg: AtlassianConfig, webui_path: str) -> str:
    path = webui_path or ""
    if path.startswith("http"):
        return path
    return f"{cfg.site}/wiki{path if path.startswith('/') else '/' + path}"


def jira_link(cfg: AtlassianConfig, key: str) -> str:
    return f"{cfg.site}/browse/{key}"


def quote(value: str) -> str:
    """A CQL/JQL string literal: backslashes and double quotes escaped."""
    return '"' + str(value).replace("\\", "\\\\").replace('"', '\\"') + '"'


def _reason(resp) -> str:
    """Atlassian's own explanation for a 400 (bad JQL/CQL, unknown project/status/type)."""
    try:
        data = resp.json() or {}
    except ValueError:
        return ""
    if not isinstance(data, dict):
        return ""
    parts = [str(m) for m in data.get("errorMessages") or []]
    parts += [str(v) for v in (data.get("errors") or {}).values()] if isinstance(data.get("errors"), dict) else []
    if data.get("message"):
        parts.append(str(data["message"]))
    return " ".join(p.strip() for p in parts if p.strip())[:300]


class AtlassianError(Exception):
    def __init__(self, user_message: str):
        super().__init__(user_message)
        self.user_message = user_message


class AtlassianClient:
    def __init__(self, cfg: AtlassianConfig, *, product: str, session=None,
                 sleep: Callable[[float], None] = time.sleep):
        self.cfg = cfg
        self.product = product
        self.name = PRODUCT_NAMES.get(product, product)
        self.base = cfg.confluence_base if product == "confluence" else cfg.jira_base
        self.session = session or requests.Session()
        self.sleep = sleep

    def get(self, path: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        return self._request("GET", path, params=params)

    def post(self, path: str, json: Dict[str, Any]) -> Dict[str, Any]:
        return self._request("POST", path, json=json)

    def _request(self, method: str, path: str, **kw) -> Dict[str, Any]:
        url = self.base + path
        for attempt in (1, 2):
            try:
                resp = self.session.request(
                    method, url, auth=(self.cfg.email, self.cfg.token_for(self.product)), timeout=TIMEOUT_SEC,
                    headers={"Accept": "application/json"}, **kw,
                )
            except requests.RequestException as e:
                logger.warning("%s %s %s failed: %s", self.name, method, path, type(e).__name__)
                raise AtlassianError(f"{self.name} is busy, try again in a minute.") from None
            status = resp.status_code
            if status in (401, 403):
                logger.warning("auth_failed source=atlassian product=%s status=%s", self.product, status)
                raise AtlassianError(f"{self.name} isn't available right now.")
            if status == 429:
                if attempt == 1:
                    try:
                        wait = float(resp.headers.get("Retry-After") or 1)
                    except ValueError:
                        wait = 1.0
                    self.sleep(min(max(wait, 0), MAX_RETRY_AFTER_SEC))
                    continue
                raise AtlassianError(f"{self.name} is busy, try again in a minute.")
            if status == 400:
                reason = _reason(resp)
                logger.warning("%s %s %s → HTTP 400: %s", self.name, method, path, reason)
                if reason:
                    raise AtlassianError(f"{self.name} rejected the request: {reason}")
            if status >= 400:
                logger.warning("%s %s %s → HTTP %s", self.name, method, path, status)
                raise AtlassianError(f"{self.name} didn't respond as expected (HTTP {status}).")
            try:
                return resp.json() or {}
            except ValueError:
                raise AtlassianError(f"{self.name} didn't respond as expected.") from None
        raise AtlassianError(f"{self.name} is busy, try again in a minute.")
