import logging
import os
import sys

import pytest
import requests

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from matomo_client import (  # noqa: E402
    ALLOWED_METHODS, MatomoAuthError, MatomoBusy, MatomoClient, MatomoError, MatomoTimeout,
)


class Resp:
    def __init__(self, status=200, body=None):
        self.status_code = status
        self._body = body if body is not None else {}

    def json(self):
        return self._body


class FakeHttp:
    def __init__(self, *script):
        self.script = list(script)
        self.calls = []

    def post(self, url, params=None, data=None, timeout=None):
        self.calls.append({"url": url, "params": dict(params or {}), "data": dict(data or {}), "timeout": timeout})
        item = self.script.pop(0) if len(self.script) > 1 else self.script[0]
        if isinstance(item, Exception):
            raise item
        return item


class Clock:
    def __init__(self):
        self.t = 1000.0

    def __call__(self):
        return self.t


def make(*script, clock=None):
    http = FakeHttp(*script)
    kw = {"clock": clock} if clock else {}
    return MatomoClient("T0K", http=http, **kw), http


def test_unlisted_method_never_sends():
    c, http = make(Resp())
    with pytest.raises(MatomoError):
        c.api("Live.getLastVisitsDetails")
    assert http.calls == []
    assert "VisitsSummary.get" in ALLOWED_METHODS


def test_token_only_in_body():
    c, http = make(Resp(200, {"nb_visits": 1}))
    c.api("VisitsSummary.get", idSite=39, period="day", date="2026-10-15")
    call = http.calls[0]
    assert call["data"] == {"token_auth": "T0K"}
    assert "T0K" not in call["url"]
    assert "T0K" not in repr(call["params"])
    assert call["params"]["module"] == "API"
    assert call["params"]["format"] == "JSON"
    assert call["params"]["method"] == "VisitsSummary.get"


def test_matomo_error_body():
    c, _ = make(Resp(200, {"result": "error", "message": "Invalid date"}))
    with pytest.raises(MatomoError) as e:
        c.api("VisitsSummary.get", idSite=1)
    assert str(e.value) == "Invalid date"


@pytest.mark.parametrize("status", [401, 403])
def test_auth_statuses(status):
    c, http = make(Resp(status))
    with pytest.raises(MatomoAuthError) as e:
        c.api("VisitsSummary.get", idSite=1)
    assert e.value.status == status
    assert len(http.calls) == 1  # never retried


def test_no_retry_on_5xx_busy_error():
    # A retry against an overloaded server only adds load.
    for status in (502, 503, 504):
        c, http = make(Resp(status), Resp(200, {"ok": 1}))
        with pytest.raises(MatomoBusy):
            c.api("VisitsSummary.get", idSite=1)
        assert len(http.calls) == 1
    c, http = make(Resp(500))
    with pytest.raises(MatomoError):
        c.api("VisitsSummary.get", idSite=1)


def test_retry_once_on_429():
    c, http = make(Resp(429), Resp(200, {"ok": 1}))
    assert c.api("VisitsSummary.get", idSite=1) == {"ok": 1}
    assert len(http.calls) == 2


def test_timeout():
    c, http = make(requests.exceptions.Timeout("slow"))
    with pytest.raises(MatomoTimeout):
        c.api("VisitsSummary.get", idSite=1)
    assert http.calls[0]["timeout"] == 30


def test_timeout_on_retry():
    c, http = make(Resp(429), requests.exceptions.Timeout("slow"))
    with pytest.raises(MatomoTimeout):
        c.api("VisitsSummary.get", idSite=1)
    assert len(http.calls) == 2


def test_result_cache_10_minutes():
    clock = Clock()
    c, http = make(Resp(200, {"a": 1}), clock=clock)
    c.api("VisitsSummary.get", idSite=1, period="day")
    c.api("VisitsSummary.get", period="day", idSite=1)  # param order irrelevant
    assert len(http.calls) == 1
    clock.t += 601
    c.api("VisitsSummary.get", idSite=1, period="day")
    assert len(http.calls) == 2


def test_sites_cached_1_hour():
    clock = Clock()
    body = [{"idsite": "39", "name": "Virgo", "main_url": "https://search.lib.virginia.edu", "extra": 1}]
    c, http = make(Resp(200, body), clock=clock)
    s = c.sites()
    assert s == [{"idsite": 39, "name": "Virgo", "main_url": "https://search.lib.virginia.edu"}]
    assert isinstance(s[0]["idsite"], int)
    c.sites()
    assert len(http.calls) == 1
    clock.t += 3601
    c.sites()
    assert len(http.calls) == 2
    assert http.calls[0]["params"]["method"] == "SitesManager.getSitesWithAtLeastViewAccess"


def test_token_never_logged(caplog):
    caplog.set_level(logging.DEBUG)
    errors = []
    scenarios = [
        [Resp(200, {"x": 1})],
        [Resp(200, {"result": "error", "message": "Invalid date"})],
        [Resp(401)],
        [Resp(503), Resp(503)],
        [requests.exceptions.Timeout("slow")],
        [Resp(503), requests.exceptions.Timeout("slow")],
    ]
    for script in scenarios:
        c, _ = make(*script)
        try:
            c.api("VisitsSummary.get", idSite=1)
        except MatomoError as e:
            errors.append(str(e))
    c, _ = make(Resp())
    try:
        c.api("Nope.method")
    except MatomoError as e:
        errors.append(str(e))
    assert all("T0K" not in r.getMessage() for r in caplog.records)
    assert all("T0K" not in m for m in errors)
    assert caplog.records


def test_cache_capped_and_purged():
    clock = Clock()
    c, http = make(Resp(200, {"a": 1}), clock=clock)
    for i in range(250):
        c.api("VisitsSummary.get", idSite=i)
    assert len(c._cache) == 200
    # oldest dropped (refetched), newest kept
    n = len(http.calls)
    c.api("VisitsSummary.get", idSite=249)
    assert len(http.calls) == n
    c.api("VisitsSummary.get", idSite=0)
    assert len(http.calls) == n + 1
    clock.t += 601
    c.api("VisitsSummary.get", idSite=999)
    assert len(c._cache) == 1  # expired entries purged on write


@pytest.mark.parametrize("name", ["token_auth", "TOKEN_AUTH", "force_api_session", "module", "Format", "method"])
def test_reserved_params_refused(name):
    c, http = make(Resp())
    with pytest.raises(MatomoError):
        c.api("VisitsSummary.get", **{name: "T0K"})
    assert http.calls == []


@pytest.mark.parametrize("msg", [
    "You can't access this resource as it requires 'view' access for the website id = 39.",
    "token_auth is not valid",
    "Unable to authenticate you",
])
def test_auth_message_in_200_body_is_auth_error(msg):
    c, _ = make(Resp(200, {"result": "error", "message": msg}))
    with pytest.raises(MatomoAuthError) as e:
        c.api("VisitsSummary.get", idSite=1)
    assert e.value.status == 401
    assert str(e.value) == msg


@pytest.mark.parametrize("msg", [
    "Invalid date", "You do not have permission to do that", "The segment has no access to this report",
    "Archiving is not allowed for this segment",
])
def test_other_error_body_not_auth(msg):
    c, _ = make(Resp(200, {"result": "error", "message": msg}))
    with pytest.raises(MatomoError) as e:
        c.api("VisitsSummary.get", idSite=1)
    assert not isinstance(e.value, MatomoAuthError)


# ---- final fix round: stored segments, per-call timeout -------------------------

AUTO_DEF = "visitDuration>=3600;actions>=1000"


def _seg(definition, auto="1", only="0", **kw):
    return {"idsegment": "7", "name": "Automated", "definition": definition,
            "auto_archive": auto, "enable_only_idsite": only, **kw}


def test_segment_editor_getall_allowed_and_no_visitor_methods():
    assert "SegmentEditor.getAll" in ALLOWED_METHODS
    assert not any(m.startswith("Live.") for m in ALLOWED_METHODS)


def test_stored_segment_found_encoded_and_plain():
    for definition in (AUTO_DEF, "visitDuration%3E%3D3600;actions%3E%3D1000"):
        c, http = make(Resp(200, [_seg("pageUrl=@x"), _seg(definition)]))
        got = c.stored_segment(AUTO_DEF)
        assert got is not None and got["definition"] == definition
        assert http.calls[0]["params"]["method"] == "SegmentEditor.getAll"


@pytest.mark.parametrize("seg", [
    _seg(AUTO_DEF, auto="0"), _seg(AUTO_DEF, auto=0), _seg(AUTO_DEF, auto=""),
    _seg(AUTO_DEF + ";x==1"), _seg("visitDuration>=3600"), _seg(AUTO_DEF, only="10"),
])
def test_stored_segment_not_usable(seg):
    c, _ = make(Resp(200, [seg]))
    assert c.stored_segment(AUTO_DEF) is None


def test_stored_segment_site_scope():
    c, _ = make(Resp(200, [_seg(AUTO_DEF, only="39")]))
    assert c.stored_segment(AUTO_DEF, idsite=39) is not None
    assert c.stored_segment(AUTO_DEF, idsite=10) is None
    assert c.stored_segment(AUTO_DEF) is None  # site-only segment, no site asked
    for only in (0, "", None):
        c, _ = make(Resp(200, [_seg(AUTO_DEF, auto=1, only=only)]))
        assert c.stored_segment(AUTO_DEF, idsite=10) is not None


def test_stored_segment_list_cached_one_hour():
    clock = Clock()
    c, http = make(Resp(200, [_seg(AUTO_DEF)]), clock=clock)
    c.stored_segment(AUTO_DEF)
    clock.t += 3500
    c.stored_segment(AUTO_DEF)
    assert len(http.calls) == 1
    clock.t += 200
    c.stored_segment(AUTO_DEF)
    assert len(http.calls) == 2


def test_stored_segment_odd_body():
    c, _ = make(Resp(200, {"weird": 1}))
    assert c.stored_segment(AUTO_DEF) is None
    c, _ = make(Resp(200, ["x", None, {"definition": None}]))
    assert c.stored_segment(AUTO_DEF) is None


def test_per_call_timeout():
    c, http = make(Resp(200, {"nb_visits": 1}))
    c.api("VisitsSummary.get", idSite=1, period="day", date="2026-10-01", timeout=20)
    assert http.calls[0]["timeout"] == 20
    assert "timeout" not in http.calls[0]["params"]
    c.api("VisitsSummary.get", idSite=2, period="day", date="2026-10-01")
    assert http.calls[1]["timeout"] == 30


# ---- re-review: thread-safe cache, stored_segment failure handling -------------

import threading  # noqa: E402


class LockCheckedDict(dict):
    """Fails the test if the cache is touched without the client's lock held."""

    def __init__(self, lock):
        super().__init__()
        self.lock = lock

    def _check(self):
        assert self.lock.locked(), "cache used without the lock"

    def get(self, *a):
        self._check()
        return super().get(*a)

    def items(self):
        self._check()
        return super().items()

    def __setitem__(self, k, v):
        self._check()
        super().__setitem__(k, v)

    def __delitem__(self, k):
        self._check()
        super().__delitem__(k)

    def pop(self, *a):
        self._check()
        return super().pop(*a)


def test_cache_only_used_under_lock():
    c, _ = make(Resp(200, [{"idsite": 1, "name": "a", "main_url": ""}]))
    c._cache = LockCheckedDict(c._lock)
    c.api("VisitsSummary.get", idSite=1)
    c.api("VisitsSummary.get", idSite=1)
    c.sites()
    c.stored_segment(AUTO_DEF)


def test_concurrent_stores_and_evictions():
    import sys
    old = sys.getswitchinterval()
    sys.setswitchinterval(1e-6)
    try:
        clock = Clock()
        c, _ = make(Resp(200, {"a": 1}), clock=clock)
        errors = []

        def worker(base):
            try:
                for i in range(400):
                    c.api("VisitsSummary.get", idSite=base * 1000 + i)
            except Exception as e:  # noqa: BLE001
                errors.append(repr(e))
        threads = [threading.Thread(target=worker, args=(n,)) for n in range(8)]
        for t in threads:
            t.start()
        for t in threads:
            t.join()
    finally:
        sys.setswitchinterval(old)
    assert errors == [] and len(c._cache) <= 200


def test_stored_segment_uses_segment_timeout_and_no_retry():
    c, http = make(Resp(504))
    assert c.stored_segment(AUTO_DEF) is None
    assert len(http.calls) == 1  # no 5xx retry
    assert http.calls[0]["timeout"] == 20


def test_stored_segment_failure_cached_ten_minutes():
    clock = Clock()
    c, http = make(requests.exceptions.Timeout(), Resp(200, [_seg(AUTO_DEF)]), clock=clock)
    assert c.stored_segment(AUTO_DEF) is None
    clock.t += 599
    assert c.stored_segment(AUTO_DEF) is None
    assert len(http.calls) == 1
    clock.t += 2
    assert c.stored_segment(AUTO_DEF) is not None
    assert len(http.calls) == 2


def test_stored_segment_not_found_rechecked_after_ten_minutes():
    clock = Clock()
    c, http = make(Resp(200, []), Resp(200, [_seg(AUTO_DEF)]), clock=clock)
    assert c.stored_segment(AUTO_DEF) is None
    clock.t += 599
    assert c.stored_segment(AUTO_DEF) is None
    assert len(http.calls) == 1
    clock.t += 2
    assert c.stored_segment(AUTO_DEF) is not None  # the admin added it
    assert len(http.calls) == 2
    clock.t += 3000
    assert c.stored_segment(AUTO_DEF) is not None and len(http.calls) == 2  # found: kept 1 hour


def test_stored_segment_auth_error_raises_and_is_not_cached():
    c, http = make(Resp(401), Resp(200, [_seg(AUTO_DEF)]))
    with pytest.raises(MatomoAuthError):
        c.stored_segment(AUTO_DEF)
    assert c.stored_segment(AUTO_DEF) is not None
