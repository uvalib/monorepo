"""
github_auth.py — GitHub App installation tokens for Hoo Helper's read-only GitHub access.

The App's id, installation id and private key come from SSM (loaded in app.py). The
private key signs a short-lived RS256 JWT, which is exchanged for an installation token;
the token is cached until five minutes before it expires.

The private key, the JWT and the token are never logged, put in exception messages or
shown in repr.
"""

from __future__ import annotations

import logging
import threading
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Callable, Optional

import requests

logger = logging.getLogger(__name__)

API_BASE = "https://api.github.com"
API_VERSION = "2022-11-28"
TIMEOUT_SEC = 20
JWT_BACKDATE_SEC = 60
JWT_LIFETIME_SEC = 600  # exp - iat; GitHub allows at most 10 minutes
REFRESH_MARGIN_SEC = 300

SSM_APP_ID = "/hoohelp/github/app-id"
SSM_INSTALLATION_ID = "/hoohelp/github/installation-id"
SSM_PRIVATE_KEY = "/hoohelp/github/private-key"


class GitHubAuthError(Exception):
    """Token minting failed. The message never contains secrets."""


@dataclass
class GitHubAppCredentials:
    app_id: str
    installation_id: str
    private_key: str = field(repr=False)


def load_credentials(ssm_get: Callable[[str, bool], str]) -> Optional[GitHubAppCredentials]:
    """Read the three SSM parameters; None if any is missing or empty."""
    values = []
    for name, decrypt in ((SSM_APP_ID, False), (SSM_INSTALLATION_ID, False), (SSM_PRIVATE_KEY, True)):
        try:
            value = (ssm_get(name, decrypt) or "").strip()
        except Exception as e:  # missing parameter, no permission, ...
            logger.warning("github credentials unavailable: %s (%s)", name, type(e).__name__)
            return None
        if not value:
            logger.warning("github credentials unavailable: %s is empty", name)
            return None
        values.append(value)
    return GitHubAppCredentials(*values)


def _parse_expiry(value: str) -> float:
    return datetime.strptime(value, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc).timestamp()


class InstallationTokenMinter:
    def __init__(self, creds: GitHubAppCredentials, *, http=requests, clock: Callable[[], float] = time.time):
        self._creds = creds
        self._http = http
        self._clock = clock
        self._lock = threading.Lock()
        self._token: Optional[str] = None
        self._expires_at = 0.0

    def token(self) -> str:
        with self._lock:
            if self._token and self._clock() < self._expires_at - REFRESH_MARGIN_SEC:
                return self._token
            self._token, self._expires_at = self._exchange()
            return self._token

    def invalidate(self) -> None:
        """Drop the cached token so the next token() mints a new one (e.g. after a 401)."""
        with self._lock:
            self._token = None
            self._expires_at = 0.0

    def _app_jwt(self) -> str:
        import jwt  # imported lazily: a bad cryptography wheel must not break Hoo Helper's startup

        now = int(self._clock())
        claims = {"iat": now - JWT_BACKDATE_SEC, "exp": now - JWT_BACKDATE_SEC + JWT_LIFETIME_SEC,
                  "iss": self._creds.app_id}
        try:
            encoded = jwt.encode(claims, self._creds.private_key, algorithm="RS256")
        except Exception as e:
            logger.warning("github jwt signing failed: %s", type(e).__name__)
            raise GitHubAuthError("GitHub App JWT signing failed.") from None
        return encoded.decode() if isinstance(encoded, bytes) else encoded

    def _exchange(self):
        url = f"{API_BASE}/app/installations/{self._creds.installation_id}/access_tokens"
        headers = {
            "Authorization": f"Bearer {self._app_jwt()}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": API_VERSION,
        }
        try:
            resp = self._http.post(url, headers=headers, timeout=TIMEOUT_SEC)
        except requests.RequestException as e:
            logger.warning("github token exchange failed: %s", type(e).__name__)
            raise GitHubAuthError(f"GitHub token exchange failed ({type(e).__name__}).") from None
        if resp.status_code >= 300:
            logger.warning("auth_failed source=github status=%s", resp.status_code)
            raise GitHubAuthError(f"GitHub token exchange failed (HTTP {resp.status_code}).")
        try:
            body = resp.json() or {}
            return str(body["token"]), _parse_expiry(body["expires_at"])
        except (ValueError, KeyError, TypeError):
            raise GitHubAuthError("GitHub token exchange returned an unexpected response.") from None
