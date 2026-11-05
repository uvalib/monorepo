import datetime
import logging
import os
import sys

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

import matomo_tools  # noqa: E402
from matomo_client import MatomoAuthError, MatomoError, MatomoTimeout  # noqa: E402
from matomo_report import AUTOMATED_SEGMENT  # noqa: E402
from matomo_tools import (  # noqa: E402
    TOOL_PAGE, TOOL_SITES, TOOL_TOP_PAGES, TOOL_TRAFFIC, TOOL_VIRGO_ITEMS,
    MatomoTools, matomo_tools_for_env,
)

TODAY = datetime.date(2026, 11, 5)
SITES = [
    {"idsite": 10, "name": "Library CMS", "main_url": "http://www.library.virginia.edu"},
    {"idsite": 39, "name": "Virgo 4-prod", "main_url": "https://v4.lib.virginia.edu"},
]
TIMEOUT_SEGMENT = ("Matomo is still preparing the automated-session breakdown for this "
                   "period; ask again in a few minutes.")
TIMEOUT_OTHER = "Matomo didn't respond in time; try a shorter range or ask again shortly."

VISITS = {"nb_visits": 1000, "nb_uniq_visitors": 800, "nb_actions": 5000,
          "bounce_rate": "40%", "avg_time_on_site": 125}
ACTIONS = {"nb_pageviews": 4000, "nb_searches": 300, "nb_downloads": 20, "nb_outlinks": 70}
AUTO = {"nb_visits": 100, "nb_actions": 2500}


class FakeClient:
    def __init__(self, script):
        self.script = script
        self.calls = []

    def sites(self):
        return SITES

    def api(self, method, /, **params):
        self.calls.append((method, params))
        key = (method, params.get("segment"))
        if key not in self.script:
            key = (method, None)
        r = self.script[key]
        if isinstance(r, Exception):
            raise r
        return r


def tools(script, **kw):
    c = FakeClient(script)
    return MatomoTools(c, today=lambda: TODAY, **kw), c


PLAIN = {("VisitsSummary.get", None): VISITS, ("Actions.get", None): ACTIONS}
VIRGO_SCRIPT = {**PLAIN, ("VisitsSummary.get", AUTOMATED_SEGMENT): AUTO}
OCT = {"site": "Virgo", "start_date": "2026-10-01", "end_date": "2026-10-31"}


def test_specs_and_handles():
    t, _ = tools({})
    specs = {s["toolSpec"]["name"]: s["toolSpec"] for s in t.tool_specs()}
    assert set(specs) == {TOOL_SITES, TOOL_TRAFFIC, TOOL_TOP_PAGES, TOOL_PAGE}
    for s in specs.values():
        assert s["inputSchema"]["json"]["type"] == "object"
        assert len(s["description"]) <= 600
    assert specs[TOOL_TRAFFIC]["inputSchema"]["json"]["properties"]["automated"]["enum"] == [
        "show", "exclude", "ignore"]
    assert all(t.handles(n) for n in (TOOL_SITES, TOOL_TRAFFIC, TOOL_TOP_PAGES, TOOL_PAGE, TOOL_VIRGO_ITEMS))
    assert not t.handles("other")
    t2, _ = tools({}, gateway_call=lambda n, a: "")
    assert TOOL_VIRGO_ITEMS in {s["toolSpec"]["name"] for s in t2.tool_specs()}
    assert t.call(TOOL_VIRGO_ITEMS, {}) == "Error: not available"


def test_sites_lists_ids_names_urls():
    t, _ = tools({})
    out = t.call(TOOL_SITES, {})
    assert "10" in out and "Library CMS" in out and "http://www.library.virginia.edu" in out
    assert "39" in out and "Virgo 4-prod" in out


def test_traffic_virgo_shows_breakdown():
    t, c = tools(VIRGO_SCRIPT)
    out = t.call(TOOL_TRAFFIC, OCT)
    first = out.splitlines()[0]
    assert "Virgo 4-prod" in first and "2026-10-01 to 2026-10-31" in first
    assert "automated sessions shown separately" in first
    for s in ("1,000", "800", "4,000", "300", "20", "70", "40%", "2:05"):
        assert s in out
    assert "100" in out and "50%" in out
    assert "hours-long sessions with 1,000+ actions" in out
    assert "900" in out and "2,500" in out  # without automated: visits, actions
    methods = [(m, p.get("segment")) for m, p in c.calls]
    assert ("VisitsSummary.get", None) in methods and ("Actions.get", None) in methods
    assert ("VisitsSummary.get", AUTOMATED_SEGMENT) in methods
    assert all(p["period"] == "month" and p["date"] == "2026-10-01" and p["idSite"] == 39
               for _, p in c.calls)


def test_traffic_other_site_ignores_by_default():
    t, c = tools(PLAIN)
    out = t.call(TOOL_TRAFFIC, {**OCT, "site": "Library CMS"})
    assert "Matomo's numbers as reported" in out.splitlines()[0]
    assert all(p.get("segment") is None for _, p in c.calls)


def test_traffic_exclude():
    t, _ = tools(VIRGO_SCRIPT)
    out = t.call(TOOL_TRAFFIC, {**OCT, "automated": "exclude"})
    assert "excluding likely automated sessions" in out.splitlines()[0]
    assert "900" in out and "2,500" in out
    assert "1,000" not in out


def test_traffic_compare():
    script = {**PLAIN, ("VisitsSummary.get", None): VISITS}
    t, c = tools(script)
    out = t.call(TOOL_TRAFFIC, {"site": "10", "start_date": "2026-10-01", "end_date": "2026-10-31",
                                "compare_start_date": "2026-09-01", "compare_end_date": "2026-09-30"})
    assert "2026-09-01 to 2026-09-30" in out and "2026-10-01 to 2026-10-31" in out
    assert "0%" in out  # identical data both periods
    assert any(p["date"] == "2026-09-01" for _, p in c.calls)


def test_traffic_compare_zero_previous_is_dash():
    class Two(FakeClient):
        def api(self, method, /, **params):
            r = super().api(method, **params)
            if params["date"] == "2026-09-01":
                return {k: 0 for k in r}
            return r
    c = Two(PLAIN)
    t = MatomoTools(c, today=lambda: TODAY)
    out = t.call(TOOL_TRAFFIC, {"site": "10", "start_date": "2026-10-01", "end_date": "2026-10-31",
                                "compare_start_date": "2026-09-01", "compare_end_date": "2026-09-30"})
    assert "—" in out


def test_traffic_segment_timeout_falls_back():
    script = {**VIRGO_SCRIPT, ("VisitsSummary.get", AUTOMATED_SEGMENT): MatomoTimeout("t")}
    t, _ = tools(script)
    out = t.call(TOOL_TRAFFIC, OCT)
    assert not out.startswith("Error")
    assert "1,000" in out and TIMEOUT_SEGMENT in out


def test_traffic_timeout():
    t, _ = tools({("VisitsSummary.get", None): MatomoTimeout("t"), ("Actions.get", None): ACTIONS})
    assert t.call(TOOL_TRAFFIC, OCT) == "Error: " + TIMEOUT_OTHER


def test_matomo_error_message_returned():
    t, _ = tools({("VisitsSummary.get", None): MatomoError("Bad thing"), ("Actions.get", None): ACTIONS})
    assert t.call(TOOL_TRAFFIC, OCT) == "Error: Bad thing"


ROWS = [{"label": "/a", "nb_hits": 1234, "nb_visits": 1000, "avg_time_on_page": 65, "bounce_rate": "20%",
         "exit_rate": "10%"}]


@pytest.mark.parametrize("report,method", [
    ("pages", "Actions.getPageUrls"), ("entry", "Actions.getEntryPageUrls"),
    ("exit", "Actions.getExitPageUrls"), ("titles", "Actions.getPageTitles")])
def test_top_pages(report, method):
    t, c = tools({(method, None): ROWS})
    out = t.call(TOOL_TOP_PAGES, {"site": "10", "start_date": "2026-10-01", "end_date": "2026-10-31",
                                  "report": report})
    (m, p), = c.calls
    assert m == method and p["flat"] == 1 and p["filter_limit"] == 10
    assert "Library CMS" in out.splitlines()[0] and "2026-10-01 to 2026-10-31" in out.splitlines()[0]
    assert "1,234" in out and "1,000" in out and "1:05" in out and "/a" in out


def test_top_pages_prefix_limit_more():
    rows = [{"label": f"/sources/uva_library/{i}", "nb_hits": 5, "nb_visits": 4} for i in range(3)]
    t, c = tools({("Actions.getPageUrls", None): rows})
    out = t.call(TOOL_TOP_PAGES, {"site": "10", "start_date": "2026-10-01", "end_date": "2026-10-31",
                                  "path_prefix": "/sources/uva_library/", "limit": 3})
    assert c.calls[0][1]["filter_pattern"] == "/sources/uva_library/"
    assert "more rows exist" in out
    t, c = tools({("Actions.getPageUrls", None): []})
    t.call(TOOL_TOP_PAGES, {"site": "10", "start_date": "2026-10-01", "end_date": "2026-10-31",
                            "limit": 500})
    assert c.calls[0][1]["filter_limit"] == 50


def test_top_pages_prefix_is_regex_escaped():
    t, c = tools({("Actions.getPageUrls", None): []})
    t.call(TOOL_TOP_PAGES, {"site": "10", "start_date": "2026-10-01", "end_date": "2026-10-31",
                            "path_prefix": "/a.b+c/"})
    assert c.calls[0][1]["filter_pattern"] == r"/a\.b\+c/"


def test_top_pages_show_paths_as_text():
    rows = [{"label": "https://evil.example/x?d=1", "nb_hits": 1, "nb_visits": 1},
            {"label": "https://www.library.virginia.edu/hours", "nb_hits": 1, "nb_visits": 1},
            {"label": "a `b` <script>", "nb_hits": 1, "nb_visits": 1}]
    t, _ = tools({("Actions.getPageUrls", None): rows})
    out = t.call(TOOL_TOP_PAGES, {"site": "10", "start_date": "2026-10-01", "end_date": "2026-10-31"})
    assert "/x?d=1" in out and "evil.example" not in out
    assert "https://www.library.virginia.edu/hours" in out
    assert "<" not in out.replace("`<", "").replace("<`", "") or "`" in out
    line = [ln for ln in out.splitlines() if "script" in ln][0]
    assert "<script>" in line and line.index("`") < line.index("<script>")


def test_page():
    t, c = tools({("Actions.getPageUrl", None): [
        {"label": "hours", "nb_hits": 10, "nb_visits": 8, "avg_time_on_page": 30,
         "entry_nb_visits": 4, "exit_nb_visits": 2}]})
    out = t.call(TOOL_PAGE, {"site": "10", "url_or_path": "/hours",
                             "start_date": "2026-10-01", "end_date": "2026-10-31"})
    assert c.calls[0][1]["pageUrl"] == "http://www.library.virginia.edu/hours"
    assert "10" in out and "0:30" in out
    t.call(TOOL_PAGE, {"site": "10", "url_or_path": "https://x.example/p",
                       "start_date": "2026-10-01", "end_date": "2026-10-31"})
    assert c.calls[1][1]["pageUrl"] == "https://x.example/p"


def test_page_no_data():
    t, _ = tools({("Actions.getPageUrl", None): []})
    out = t.call(TOOL_PAGE, {"site": "10", "url_or_path": "/hours",
                             "start_date": "2026-10-01", "end_date": "2026-10-31"})
    assert out == "No Matomo data for /hours in 2026-10-01 to 2026-10-31."


def test_unknown_site_and_bad_dates_are_errors():
    t, _ = tools({})
    assert t.call(TOOL_TRAFFIC, {**OCT, "site": "nope"}).startswith("Error: Unknown site")
    out = t.call(TOOL_TRAFFIC, {"site": "Virgo", "start_date": "bad"})
    assert out.startswith("Error: ") and "valid date" in out


def test_capped_end_is_stated():
    t, _ = tools(PLAIN)
    out = t.call(TOOL_TRAFFIC, {"site": "10", "fiscal_year": "FY26"})
    assert "2026-06-30" in out
    t, _ = tools(PLAIN)
    out = t.call(TOOL_TRAFFIC, {"site": "10", "start_date": "2026-10-01"})
    assert "2026-11-04" in out and "yesterday" in out.lower()


# ---- for_env ----------------------------------------------------------------

@pytest.fixture(autouse=True)
def _reset():
    matomo_tools._reset_cache()
    yield
    matomo_tools._reset_cache()


def test_for_env_off():
    assert matomo_tools_for_env({}, ssm_get=lambda n, d: "x") is None


def test_for_env_missing_token(caplog):
    def ssm(n, d):
        raise LookupError("nope")
    with caplog.at_level(logging.INFO):
        assert matomo_tools_for_env({"ENABLE_MATOMO": "true"}, ssm_get=ssm) is None
    assert any("matomo tools off" in r.message for r in caplog.records)


def test_for_env_auth_failure(caplog, monkeypatch):
    class Bad:
        def __init__(self, token, **kw):
            pass

        def sites(self):
            raise MatomoAuthError("denied", 401)
    monkeypatch.setattr(matomo_tools, "MatomoClient", Bad)
    with caplog.at_level(logging.INFO):
        assert matomo_tools_for_env({"ENABLE_MATOMO": "true"}, ssm_get=lambda n, d: "tok") is None
    assert any("matomo_auth_failed status=401" in r.message for r in caplog.records)
    assert not any("tok" == r.message for r in caplog.records)


def test_for_env_success_and_retry_window(monkeypatch):
    seen = {}

    class Good:
        def __init__(self, token, **kw):
            seen["token"] = token

        def sites(self):
            return SITES
    monkeypatch.setattr(matomo_tools, "MatomoClient", Good)
    asked = []

    def ssm(n, d):
        asked.append((n, d))
        return "sekret"
    t = matomo_tools_for_env({"ENABLE_MATOMO": "true"}, ssm_get=ssm)
    assert isinstance(t, MatomoTools) and seen["token"] == "sekret"
    assert asked == [("/hoohelp/matomo/token", True)]
    assert matomo_tools_for_env({"ENABLE_MATOMO": "true"}, ssm_get=ssm) is t
    assert len(asked) == 1


def test_for_env_retries_after_ten_minutes(monkeypatch):
    clock = [1000.0]
    monkeypatch.setattr(matomo_tools.time, "monotonic", lambda: clock[0])
    calls = []

    def ssm(n, d):
        calls.append(1)
        raise LookupError("x")
    env = {"ENABLE_MATOMO": "true"}
    assert matomo_tools_for_env(env, ssm_get=ssm) is None
    clock[0] += 60
    assert matomo_tools_for_env(env, ssm_get=ssm) is None
    assert len(calls) == 1
    clock[0] += 600
    matomo_tools_for_env(env, ssm_get=ssm)
    assert len(calls) == 2
