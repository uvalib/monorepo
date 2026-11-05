"""
matomo_client.py — read-only, aggregate-only client for the Library's Matomo.

Only methods in ALLOWED_METHODS are ever sent. The API token goes in the POST
body (`token_auth`) and nowhere else: never in the URL, a log line or an
exception message. Results are cached 10 minutes, the site list 1 hour.
"""

from __future__ import annotations

import logging
import time
from typing import Any, Callable, Dict, List, Optional, Tuple

import requests

logger = logging.getLogger(__name__)

DEFAULT_BASE_URL = "https://analytics.lib.virginia.edu/index.php"
TIMEOUT_SEC = 40
RESULT_TTL_SEC = 600
SITES_TTL_SEC = 3600
SITES_METHOD = "SitesManager.getSitesWithAtLeastViewAccess"

ALLOWED_METHODS = frozenset({
    SITES_METHOD,
    "VisitsSummary.get",
    "Actions.get",
    "Actions.getPageUrls",
    "Actions.getPageUrl",
    "Actions.getEntryPageUrls",
    "Actions.getExitPageUrls",
    "Actions.getPageTitles",
})


class MatomoError(Exception):
    """Matomo refused or failed; the message is Matomo's own text."""


class MatomoAuthError(MatomoError):
    def __init__(self, message: str, status: int):
        super().__init__(message)
        self.status = status


class MatomoTimeout(MatomoError):
    pass


class MatomoClient:
    def __init__(self, token: str, *, base_url: str = DEFAULT_BASE_URL, http=None,
                 clock: Callable[[], float] = time.monotonic):
        self._token = token
        self._base_url = base_url
        self._http = http if http is not None else requests.Session()
        self._clock = clock
        self._cache: Dict[Tuple, Tuple[float, Any]] = {}

    def _post(self, params: Dict[str, Any]):
        try:
            return self._http.post(self._base_url, params=params,
                                   data={"token_auth": self._token}, timeout=TIMEOUT_SEC)
        except requests.exceptions.Timeout:
            logger.warning("matomo timeout method=%s", params.get("method"))
            raise MatomoTimeout("Matomo did not respond in time") from None
        except requests.exceptions.RequestException as e:
            logger.warning("matomo request failed method=%s type=%s", params.get("method"), type(e).__name__)
            raise MatomoError("Could not reach Matomo") from None

    def _fetch(self, method: str, params: Dict[str, Any], ttl: int) -> Any:
        key = (method, tuple(sorted((k, str(v)) for k, v in params.items())))
        now = self._clock()
        hit = self._cache.get(key)
        if hit and now - hit[0] <= ttl:
            return hit[1]

        full = {**params, "module": "API", "format": "JSON", "method": method}
        resp = self._post(full)
        if resp.status_code == 429 or resp.status_code >= 500:
            logger.info("matomo retry method=%s status=%s", method, resp.status_code)
            resp = self._post(full)
        status = resp.status_code
        if status in (401, 403):
            raise MatomoAuthError(f"Matomo refused access (HTTP {status})", status)
        if status >= 400:
            raise MatomoError(f"Matomo returned HTTP {status}")
        try:
            body = resp.json()
        except ValueError:
            raise MatomoError("Matomo returned an unreadable response") from None
        if isinstance(body, dict) and body.get("result") == "error":
            raise MatomoError(str(body.get("message") or "Matomo error"))
        self._cache[key] = (now, body)
        logger.debug("matomo ok method=%s", method)
        return body

    def api(self, method: str, **params) -> Any:
        if method not in ALLOWED_METHODS:
            raise MatomoError(f"Method not allowed: {method}")
        return self._fetch(method, params, RESULT_TTL_SEC)

    def sites(self) -> List[dict]:
        raw = self._fetch(SITES_METHOD, {}, SITES_TTL_SEC)
        out = []
        for s in raw or []:
            try:
                out.append({"idsite": int(s["idsite"]), "name": s.get("name", ""),
                            "main_url": s.get("main_url", "")})
            except (KeyError, TypeError, ValueError):
                continue
        return out
