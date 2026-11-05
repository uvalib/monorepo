import logging
import os
import sys

import pytest
import requests

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from matomo_client import (  # noqa: E402
    ALLOWED_METHODS, MatomoAuthError, MatomoClient, MatomoError, MatomoTimeout,
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


def test_retry_once_on_5xx_and_429():
    c, http = make(Resp(503), Resp(200, {"ok": 1}))
    assert c.api("VisitsSummary.get", idSite=1) == {"ok": 1}
    assert len(http.calls) == 2
    c, http = make(Resp(429), Resp(200, {"ok": 1}))
    assert c.api("VisitsSummary.get", idSite=1) == {"ok": 1}
    c, http = make(Resp(503), Resp(503))
    with pytest.raises(MatomoError):
        c.api("VisitsSummary.get", idSite=1)
    assert len(http.calls) == 2


def test_timeout():
    c, http = make(requests.exceptions.Timeout("slow"))
    with pytest.raises(MatomoTimeout):
        c.api("VisitsSummary.get", idSite=1)
    assert http.calls[0]["timeout"] == 40


def test_timeout_on_retry():
    c, http = make(Resp(503), requests.exceptions.Timeout("slow"))
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
    "You do not have permission",
])
def test_auth_message_in_200_body_is_auth_error(msg):
    c, _ = make(Resp(200, {"result": "error", "message": msg}))
    with pytest.raises(MatomoAuthError) as e:
        c.api("VisitsSummary.get", idSite=1)
    assert e.value.status == 401
    assert str(e.value) == msg


def test_other_error_body_not_auth():
    c, _ = make(Resp(200, {"result": "error", "message": "Invalid date"}))
    with pytest.raises(MatomoError) as e:
        c.api("VisitsSummary.get", idSite=1)
    assert not isinstance(e.value, MatomoAuthError)
