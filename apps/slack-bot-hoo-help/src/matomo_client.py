"""
matomo_client.py — read-only, aggregate-only client for the Library's Matomo.

Only methods in ALLOWED_METHODS are ever sent. The API token goes in the POST
body (`token_auth`) and nowhere else: never in the URL, a log line or an
exception message. Results are cached 10 minutes, the site and segment lists 1 hour.
"""

from __future__ import annotations

import logging
import threading
import time
from urllib.parse import unquote
from typing import Any, Callable, Dict, List, Optional, Tuple

import requests

logger = logging.getLogger(__name__)

DEFAULT_BASE_URL = "https://analytics.lib.virginia.edu/index.php"
TIMEOUT_SEC = 30
CACHE_MAX_ENTRIES = 200
# Params a caller may never set: they could put a credential in the URL or
# override the request framing.
RESERVED_PARAMS = frozenset({"token_auth", "force_api_session", "module", "format", "method"})
# Matomo reports auth problems as HTTP 200 with an error body; these phrases mark them.
AUTH_MESSAGE_MARKERS = ("token_auth", "authenticate", "requires 'view' access")
RESULT_TTL_SEC = 600
SITES_TTL_SEC = 3600
# The stored-segment list: short timeout, no retry; a failure or a missing segment is kept 10 minutes
# (so a segment the admin adds is picked up), a found one 1 hour.
SEGMENTS_TIMEOUT_SEC = 20
SEGMENTS_MISS_TTL_SEC = 600
SITES_METHOD = "SitesManager.getSitesWithAtLeastViewAccess"
# Lists stored segment definitions only (no visitor data).
SEGMENTS_METHOD = "SegmentEditor.getAll"

ALLOWED_METHODS = frozenset({
    SITES_METHOD,
    SEGMENTS_METHOD,
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


class MatomoBusy(MatomoError):
    """Matomo answered 502, 503 or 504: overloaded or down."""


class MatomoTimeout(MatomoError):
    pass


class MatomoClient:
    def __init__(self, token: str, *, base_url: str = DEFAULT_BASE_URL, http=None,
                 clock: Callable[[], float] = time.monotonic):
        self._token = token
        self._base_url = base_url
        self._http = http if http is not None else requests.Session()
        self._clock = clock
        self._cache: Dict[Tuple, Tuple[float, Any, int]] = {}
        # Tool calls run in parallel threads (comparison periods): every cache access holds this.
        self._lock = threading.Lock()
        self._segments: Optional[Tuple[float, Optional[list]]] = None  # (fetched at, list or None)

    def _post(self, params: Dict[str, Any], timeout: float = TIMEOUT_SEC):
        try:
            return self._http.post(self._base_url, params=params,
                                   data={"token_auth": self._token}, timeout=timeout)
        except requests.exceptions.Timeout:
            logger.warning("matomo timeout method=%s", params.get("method"))
            raise MatomoTimeout("Matomo did not respond in time") from None
        except requests.exceptions.RequestException as e:
            logger.warning("matomo request failed method=%s type=%s", params.get("method"), type(e).__name__)
            raise MatomoError("Could not reach Matomo") from None

    def _request(self, method: str, params: Dict[str, Any], timeout: Optional[float] = None,
                 retry: bool = True) -> Any:
        full = {**params, "module": "API", "format": "JSON", "method": method}
        timeout = TIMEOUT_SEC if timeout is None else timeout
        resp = self._post(full, timeout)
        # Only a rate limit is retried: a retry against an overloaded server (5xx) adds load.
        if retry and resp.status_code == 429:
            logger.info("matomo retry method=%s status=%s", method, resp.status_code)
            resp = self._post(full, timeout)
        status = resp.status_code
        if status in (401, 403):
            raise MatomoAuthError(f"Matomo refused access (HTTP {status})", status)
        if status in (502, 503, 504):
            raise MatomoBusy(f"Matomo returned HTTP {status}")
        if status >= 400:
            raise MatomoError(f"Matomo returned HTTP {status}")
        try:
            body = resp.json()
        except ValueError:
            raise MatomoError("Matomo returned an unreadable response") from None
        if isinstance(body, dict) and body.get("result") == "error":
            message = str(body.get("message") or "Matomo error")
            if any(m in message.lower() for m in AUTH_MESSAGE_MARKERS):
                # Matomo sends no HTTP auth status here; report 401 so callers
                # that switch off on auth failures treat it the same way.
                raise MatomoAuthError(message, 401)
            raise MatomoError(message)
        logger.debug("matomo ok method=%s", method)
        return body

    def _fetch(self, method: str, params: Dict[str, Any], ttl: int,
               timeout: Optional[float] = None) -> Any:
        key = (method, tuple(sorted((k, str(v)) for k, v in params.items())))
        now = self._clock()
        with self._lock:
            hit = self._cache.get(key)
        if hit and now - hit[0] <= hit[2]:
            return hit[1]
        body = self._request(method, params, timeout)
        with self._lock:
            self._store(key, now, body, ttl)
        return body

    def _store(self, key: Tuple, now: float, body: Any, ttl: int) -> None:
        """Caller holds self._lock."""
        for k in [k for k, v in self._cache.items() if now - v[0] > v[2]]:
            del self._cache[k]
        self._cache.pop(key, None)
        self._cache[key] = (now, body, ttl)
        while len(self._cache) > CACHE_MAX_ENTRIES:
            del self._cache[next(iter(self._cache))]

    def api(self, method: str, /, *, timeout: Optional[float] = None, **params) -> Any:
        """One allow-listed report; `timeout` (seconds, per request) defaults to TIMEOUT_SEC."""
        if method not in ALLOWED_METHODS:
            raise MatomoError(f"Method not allowed: {method}")
        bad = sorted(k for k in params if k.lower() in RESERVED_PARAMS)
        if bad:
            raise MatomoError(f"Reserved parameter not allowed: {', '.join(bad)}")
        return self._fetch(method, params, RESULT_TTL_SEC, timeout)

    def stored_segment(self, definition: str, idsite: Optional[int] = None) -> Optional[dict]:
        """The stored segment with exactly this definition that Matomo pre-processes (auto_archive)
        for all sites or for `idsite`; None when there isn't one. Never triggers processing."""
        now = self._clock()
        with self._lock:
            cached = self._segments
        if cached is not None:
            age = now - cached[0]
            found = self._match_segment(cached[1], definition, idsite)
            if age < SEGMENTS_MISS_TTL_SEC or (found is not None and age < SITES_TTL_SEC):
                return found
        try:
            raw = self._request(SEGMENTS_METHOD, {}, SEGMENTS_TIMEOUT_SEC, retry=False)
        except MatomoAuthError:
            raise
        except MatomoError:
            raw = None  # failed: treated as no stored segment for 10 minutes
        with self._lock:
            self._segments = (now, raw if isinstance(raw, list) else None)
        return self._match_segment(raw if isinstance(raw, list) else None, definition, idsite)

    @staticmethod
    def _match_segment(raw: Optional[list], definition: str, idsite: Optional[int]) -> Optional[dict]:
        for seg in raw or []:
            if not isinstance(seg, dict) or not isinstance(seg.get("definition"), str):
                continue
            if unquote(seg["definition"]) != definition:
                continue
            if str(seg.get("auto_archive") or "0").strip() != "1":
                continue
            only = str(seg.get("enable_only_idsite") or "0").strip()
            if only == "0" or (idsite is not None and only == str(idsite)):
                return seg
        return None

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
