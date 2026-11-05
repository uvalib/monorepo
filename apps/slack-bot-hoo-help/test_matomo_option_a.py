"""Option A: Hoo Helper only reads a stored, pre-processed automated-sessions segment.

No stored segment means no segment call at all, and a strong warning instead of a split.
"""
import datetime
import os
import sys
import threading

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

import matomo_tools  # noqa: E402
from matomo_client import MatomoError, MatomoTimeout  # noqa: E402
from matomo_report import AUTOMATED_SEGMENT  # noqa: E402
from matomo_tools import (  # noqa: E402
    TOOL_PAGE, TOOL_TOP_PAGES, TOOL_TRAFFIC, TOOL_VIRGO_ITEMS, MatomoTools,
)

TODAY = datetime.date(2026, 11, 5)
SITES = [{"idsite": 10, "name": "Library CMS", "main_url": "http://www.library.virginia.edu"},
         {"idsite": 39, "name": "Virgo 4-prod", "main_url": "https://v4.lib.virginia.edu"}]
WARN_VIRGO = ("⚠ Likely automated sessions can't be separated for this period, so these totals include "
              "automated traffic. On a sample day automated sessions were 94% of Virgo activity and 98% of "
              "article-page views — don't treat these numbers as human use.")
WARN_OTHER = ("⚠ Likely automated sessions can't be separated for this period, so these totals include "
              "automated traffic.")
NOT_SEPARATED = "automated sessions not separated"
OTHERS_NOTE = ("Per-page and per-item figures without automated sessions are approximate and may still "
               "include some automated views (Matomo groups less-viewed pages into “Others” separately "
               "for each report); totals are exact.")
IGNORE_WARN_VIRGO = ("⚠ These totals include likely automated sessions. On a sample day automated sessions "
                     "were 94% of Virgo activity and 98% of article-page views — don't treat these numbers "
                     "as human use.")

VISITS = {"nb_visits": 1000, "nb_uniq_visitors": 800, "nb_actions": 5000, "bounce_rate": "40%",
          "bounce_count": 400, "sum_visit_length": 125000, "avg_time_on_site": 125}
ACTIONS = {"nb_pageviews": 4000, "nb_searches": 300, "nb_downloads": 20, "nb_outlinks": 70}
AUTO = {"nb_visits": 100, "nb_actions": 2500, "bounce_count": 0, "sum_visit_length": 100000}
PREV_VISITS = {"nb_visits": 500, "nb_uniq_visitors": 400, "nb_actions": 2000, "bounce_rate": "50%",
               "bounce_count": 250, "sum_visit_length": 50000}
PREV_AUTO = {"nb_visits": 50, "nb_actions": 1000, "bounce_count": 0, "sum_visit_length": 25000}
OCT = {"start_date": "2026-10-01", "end_date": "2026-10-31"}
CMP = {**OCT, "compare_start_date": "2026-09-01", "compare_end_date": "2026-09-30"}
OCT_LABEL, SEP_LABEL = "2026-10-01 to 2026-10-31", "2026-09-01 to 2026-09-30"


class Client:
    """Script keyed by (method, segment, period start); a missing segment entry raises."""

    def __init__(self, script, stored=True, stored_def=AUTOMATED_SEGMENT):
        self.script = script
        self.stored = stored
        self.stored_def = stored_def
        self.calls = []
        self.segment_lists = 0

    def sites(self):
        return SITES

    def stored_segment(self, definition, idsite=None):
        self.segment_lists += 1
        if isinstance(self.stored, Exception):
            raise self.stored
        assert definition == AUTOMATED_SEGMENT
        return {"definition": self.stored_def, "auto_archive": "1"} if self.stored else None

    def api(self, method, /, **params):
        self.calls.append((method, params))
        start = params["date"].split(",")[0]
        for key in ((method, params.get("segment"), start), (method, params.get("segment"))):
            if key in self.script:
                r = self.script[key]
                break
        else:
            raise AssertionError(f"unexpected call {method} {params}")
        if callable(r) and not isinstance(r, Exception):
            r = r(params)
        if isinstance(r, Exception):
            raise r
        return r


class Clock:
    def __init__(self):
        self.t = 1000.0

    def __call__(self):
        return self.t


def make(script, stored=True, clock=None, gateway=None, **kw):
    c = Client(script, stored=stored, **kw)
    t = MatomoTools(c, today=lambda: TODAY, clock=clock or Clock(),
                    gateway_call=gateway or (lambda n, a: "Tool Error: none"))
    return t, c


def segments(c):
    return [p.get("segment") for _, p in c.calls if p.get("segment")]


TRAFFIC = {("VisitsSummary.get", None): VISITS, ("Actions.get", None): ACTIONS,
           ("VisitsSummary.get", AUTOMATED_SEGMENT): AUTO}
CMP_TRAFFIC = {("VisitsSummary.get", None, "2026-10-01"): VISITS, ("Actions.get", None): ACTIONS,
               ("VisitsSummary.get", AUTOMATED_SEGMENT, "2026-10-01"): AUTO,
               ("VisitsSummary.get", None, "2026-09-01"): PREV_VISITS,
               ("VisitsSummary.get", AUTOMATED_SEGMENT, "2026-09-01"): PREV_AUTO}


# ---- A2/A4: no stored segment -> no segment call, strong warning -----------------

@pytest.mark.parametrize("mode", ["show", "exclude"])
def test_traffic_virgo_without_stored_segment(mode):
    t, c = make(TRAFFIC, stored=False)
    out = t.call(TOOL_TRAFFIC, {"site": "Virgo", "automated": mode, **OCT})
    lines = out.splitlines()
    assert lines[0] == f"Virgo 4-prod, {OCT_LABEL}; {NOT_SEPARATED}"
    assert lines[1] == WARN_VIRGO
    assert segments(c) == []
    assert "1,000" in out and "4,000" in out
    assert "Without automated" not in out and "Likely automated:" not in out


def test_traffic_virgo_default_without_stored_segment():
    t, c = make(TRAFFIC, stored=False)
    out = t.call(TOOL_TRAFFIC, {"site": "Virgo", **OCT})
    assert out.splitlines()[1] == WARN_VIRGO and segments(c) == []


@pytest.mark.parametrize("mode", ["show", "exclude"])
def test_traffic_other_site_warning_has_no_virgo_sentence(mode):
    t, c = make(TRAFFIC, stored=False)
    out = t.call(TOOL_TRAFFIC, {"site": "10", "automated": mode, **OCT})
    assert out.splitlines()[0].endswith(NOT_SEPARATED)
    assert out.splitlines()[1] == WARN_OTHER
    assert "Virgo" not in out and segments(c) == []


def test_ignore_makes_no_segment_lookup():
    t, c = make(TRAFFIC, stored=False)
    out = t.call(TOOL_TRAFFIC, {"site": "10", **OCT})
    assert "⚠" not in out and c.segment_lists == 0


def test_warning_comes_before_capped_note():
    t, _ = make(TRAFFIC, stored=False)
    out = t.call(TOOL_TRAFFIC, {"site": "Virgo", "start_date": "2026-10-01"})
    lines = out.splitlines()
    assert lines[1] == WARN_VIRGO and "capped" in lines[2]


def test_segment_list_failure_means_not_separated():
    t, c = make(TRAFFIC, stored=MatomoError("HTTP 504"))
    out = t.call(TOOL_TRAFFIC, {"site": "Virgo", **OCT})
    assert out.splitlines()[1] == WARN_VIRGO and segments(c) == []


def test_stored_definition_is_what_is_sent():
    stored = "visitDuration%3E%3D3600;actions%3E%3D1000"
    script = {**TRAFFIC, ("VisitsSummary.get", stored): AUTO}
    t, c = make(script, stored_def=stored)
    out = t.call(TOOL_TRAFFIC, {"site": "Virgo", **OCT})
    assert segments(c) == [stored] and "automated sessions shown separately" in out


def test_segment_error_is_not_separated_not_an_error():
    script = {**TRAFFIC, ("VisitsSummary.get", AUTOMATED_SEGMENT): MatomoError("Matomo returned HTTP 504")}
    t, _ = make(script)
    out = t.call(TOOL_TRAFFIC, {"site": "Virgo", **OCT})
    assert not out.startswith("Error") and out.splitlines()[1] == WARN_VIRGO


# ---- C: segment timeout 20 s, remembered 10 minutes, parallel --------------------

def test_segment_call_uses_20s_timeout_plain_calls_default():
    t, c = make(TRAFFIC)
    t.call(TOOL_TRAFFIC, {"site": "Virgo", **OCT})
    for _, p in c.calls:
        if p.get("segment"):
            assert p["timeout"] == 20
        else:
            assert "timeout" not in p


def test_timeout_remembered_for_ten_minutes():
    clock = Clock()
    script = {**TRAFFIC, ("VisitsSummary.get", AUTOMATED_SEGMENT): MatomoTimeout("t")}
    t, c = make(script, clock=clock)
    out = t.call(TOOL_TRAFFIC, {"site": "Virgo", **OCT})
    assert out.splitlines()[1] == WARN_VIRGO
    assert "still preparing the automated-session breakdown for this period; ask again in about 10 minutes." in out
    assert len(segments(c)) == 1
    clock.t += 599
    out = t.call(TOOL_TRAFFIC, {"site": "Virgo", **OCT})
    assert out.splitlines()[1] == WARN_VIRGO and len(segments(c)) == 1  # skipped straight to the warning
    # another period, or another site, is not affected
    t.call(TOOL_TRAFFIC, {"site": "Virgo", "start_date": "2026-09-01", "end_date": "2026-09-30"})
    assert len(segments(c)) == 2
    clock.t += 2
    t.call(TOOL_TRAFFIC, {"site": "Virgo", **OCT})
    assert len(segments(c)) == 3


def test_compare_segment_requests_run_in_parallel():
    both = threading.Barrier(2, timeout=2)

    def auto(value):
        def r(params):
            both.wait()  # deadlocks (BrokenBarrierError) unless the two run at once
            return value
        return r

    script = {**CMP_TRAFFIC, ("VisitsSummary.get", AUTOMATED_SEGMENT, "2026-10-01"): auto(AUTO),
              ("VisitsSummary.get", AUTOMATED_SEGMENT, "2026-09-01"): auto(PREV_AUTO)}
    t, c = make(script)
    out = t.call(TOOL_TRAFFIC, {"site": "Virgo", **CMP})
    assert not out.startswith("Error"), out
    assert "+100.0%" in out


def test_virgo_items_gateway_budget_is_15s():
    assert matomo_tools.VIRGO_BUDGET_SEC == 15.0
    t = MatomoTools(Client({}), today=lambda: TODAY, gateway_call=lambda n, a: "")
    assert t.budget == 15.0


# ---- F: compare mode labels each period's automated share -----------------------

def test_compare_shares_labelled_per_period():
    t, _ = make(CMP_TRAFFIC)
    out = t.call(TOOL_TRAFFIC, {"site": "Virgo", **CMP})
    assert f"Likely automated, {OCT_LABEL}: 100 visits, 50% of actions" in out
    assert f"Likely automated, {SEP_LABEL}: 50 visits, 50% of actions" in out


def test_compare_one_period_unavailable_names_it():
    script = {**CMP_TRAFFIC, ("VisitsSummary.get", AUTOMATED_SEGMENT, "2026-09-01"): MatomoTimeout("t")}
    t, _ = make(script)
    out = t.call(TOOL_TRAFFIC, {"site": "Virgo", **CMP})
    lines = out.splitlines()
    assert lines[0].endswith(NOT_SEPARATED)
    assert lines[1] == WARN_VIRGO.replace("this period", SEP_LABEL)
    assert f"still preparing the automated-session breakdown for {SEP_LABEL};" in out
    assert f"Likely automated, {OCT_LABEL}: 100 visits" in out
    assert f"Likely automated, {SEP_LABEL}" not in out
    assert "Without automated sessions" not in out


def test_compare_no_stored_segment_names_both_periods():
    t, c = make(CMP_TRAFFIC, stored=False)
    out = t.call(TOOL_TRAFFIC, {"site": "Virgo", **CMP})
    assert out.splitlines()[1] == WARN_VIRGO.replace("this period", f"{OCT_LABEL} and {SEP_LABEL}")
    assert segments(c) == []


# ---- A3: exclude = plain - automated ------------------------------------------

PAGE_ROWS = [
    {"label": "/a", "nb_hits": 100, "nb_visits": 80, "entry_nb_visits": 50, "entry_bounce_count": 20,
     "exit_nb_visits": 40, "avg_time_on_page": 30},
    {"label": "/b", "nb_hits": 90, "nb_visits": 70, "entry_nb_visits": 10, "entry_bounce_count": 5,
     "exit_nb_visits": 7},
    {"label": "/c", "nb_hits": 60, "nb_visits": 60},
    {"label": "/z/ - Others", "nb_hits": 50, "nb_visits": 50},
]
AUTO_PAGE_ROWS = [
    {"label": "/a", "nb_hits": 95, "nb_visits": 75, "entry_nb_visits": 45, "entry_bounce_count": 20,
     "exit_nb_visits": 39},
    {"label": "/b", "nb_hits": 100, "nb_visits": 100},  # more than plain: floored at 0
    {"label": "/gone", "nb_hits": 5, "nb_visits": 5},
]


def test_top_pages_exclude_subtracts_per_label_and_reranks():
    script = {("Actions.getPageUrls", None): PAGE_ROWS, ("Actions.getPageUrls", AUTOMATED_SEGMENT): AUTO_PAGE_ROWS}
    t, c = make(script)
    out = t.call(TOOL_TOP_PAGES, {"site": "Virgo", "automated": "exclude", **OCT})
    assert "excluding likely automated sessions" in out.splitlines()[0]
    assert all(p["filter_limit"] == -1 for _, p in c.calls)
    rows = [ln for ln in out.splitlines() if ln.startswith("| /") or ln.startswith("| Other")]
    # re-ranked by pageviews without automated: Others 50, /c 60 -> /c, Others, /a 5; /b is 0 and dropped
    assert [r.split("|")[1].strip() for r in rows] == [
        "/c", "Other pages under /z/ (grouped by Matomo)", "/a"]
    a = next(r for r in rows if r.startswith("| /a "))
    assert a == "| /a | 5 | 5 | — | 0.0% |"  # bounce (20-20)/(50-45)
    assert OTHERS_NOTE in out
    assert "/gone" not in out and "/b " not in out


def test_top_pages_exclude_entry_report_rates():
    script = {("Actions.getEntryPageUrls", None): PAGE_ROWS,
              ("Actions.getEntryPageUrls", AUTOMATED_SEGMENT): AUTO_PAGE_ROWS}
    t, _ = make(script)
    out = t.call(TOOL_TOP_PAGES, {"site": "Virgo", "automated": "exclude", "report": "entry", **OCT})
    a = next(ln for ln in out.splitlines() if ln.startswith("| /a "))
    assert a == "| /a | 5 | 0.0% | 5 | 5 | — |"
    b = next(ln for ln in out.splitlines() if ln.startswith("| /b "))
    assert b.startswith("| /b | 10 | 50.0% |")


def test_top_pages_exclude_without_stored_segment_is_plain_with_warning():
    t, c = make({("Actions.getPageUrls", None): PAGE_ROWS}, stored=False)
    out = t.call(TOOL_TOP_PAGES, {"site": "Virgo", "automated": "exclude", "limit": 2, **OCT})
    lines = out.splitlines()
    assert lines[0].endswith(f"{NOT_SEPARATED}; report: pages") and lines[1] == WARN_VIRGO
    assert segments(c) == [] and c.calls[0][1]["filter_limit"] == 3
    assert "more rows exist" in out


def test_top_pages_exclude_more_rows_after_subtraction():
    rows = [{"label": f"/p{i}", "nb_hits": 10 + i, "nb_visits": 1} for i in range(5)]
    script = {("Actions.getPageUrls", None): rows, ("Actions.getPageUrls", AUTOMATED_SEGMENT): []}
    t, _ = make(script)
    out = t.call(TOOL_TOP_PAGES, {"site": "10", "automated": "exclude", "limit": 3, **OCT})
    assert "/p4" in out and "/p1" not in out and "more rows exist" in out


def test_virgo_items_exclude_by_subtraction():
    plain = [{"label": "/sources/uva_library/items/u1", "nb_hits": 50},
             {"label": "/sources/articles/items/a1", "nb_hits": 300},
             {"label": "/sources/uva_library/items/u2", "nb_hits": 20}]
    auto = [{"label": "/sources/articles/items/a1", "nb_hits": 295}]
    script = {("Actions.getPageUrls", None): plain, ("Actions.getPageUrls", AUTOMATED_SEGMENT): auto}
    t, _ = make(script)
    out = t.call(TOOL_VIRGO_ITEMS, {**OCT, "automated": "exclude", "details": False})
    assert "| Catalog | 70 |" in out and "| Articles | 5 |" in out
    items = out.split("Top items")[-1]
    assert items.index("u1") < items.index("u2") < items.index("a1")
    assert OTHERS_NOTE in out


@pytest.mark.parametrize("mode", ["show", "exclude"])
def test_virgo_items_without_stored_segment(mode):
    t, c = make({("Actions.getPageUrls", None): [{"label": "/sources/articles/items/a1", "nb_hits": 300}]},
                stored=False)
    out = t.call(TOOL_VIRGO_ITEMS, {**OCT, "automated": mode, "details": False})
    lines = out.splitlines()
    assert lines[0].endswith(f"{NOT_SEPARATED}; report: Virgo item views") and lines[1] == WARN_VIRGO
    assert segments(c) == [] and "| Articles | 300 |" in out


# ---- G: matomo_page on Virgo; catalog cells -------------------------------------

PAGE = [{"label": "x", "nb_hits": 100, "nb_visits": 80, "avg_time_on_page": 30,
         "entry_nb_visits": 4, "exit_nb_visits": 2}]


def test_page_virgo_shows_automated_hits():
    script = {("Actions.getPageUrl", None): PAGE,
              ("Actions.getPageUrl", AUTOMATED_SEGMENT): [{"label": "x", "nb_hits": 70, "nb_visits": 10}]}
    t, c = make(script)
    out = t.call(TOOL_PAGE, {"site": "Virgo", "url_or_path": "/sources/uva_library/items/u1", **OCT})
    assert "automated sessions shown separately" in out.splitlines()[0]
    assert "- Likely automated pageviews: 70" in out
    assert "- Pageviews without automated sessions: 30" in out
    seg_call = [p for _, p in c.calls if p.get("segment")][0]
    assert seg_call["pageUrl"] == "https://v4.lib.virginia.edu/sources/uva_library/items/u1"


def test_page_virgo_without_stored_segment_warns():
    t, c = make({("Actions.getPageUrl", None): PAGE}, stored=False)
    out = t.call(TOOL_PAGE, {"site": "Virgo", "url_or_path": "/x", **OCT})
    lines = out.splitlines()
    assert lines[0].startswith(f"Virgo 4-prod, {OCT_LABEL}; {NOT_SEPARATED}") and lines[1] == WARN_VIRGO
    assert segments(c) == [] and "- Pageviews: 100" in out


def test_page_other_site_unchanged():
    t, c = make({("Actions.getPageUrl", None): PAGE}, stored=False)
    out = t.call(TOOL_PAGE, {"site": "10", "url_or_path": "/hours", **OCT})
    assert "⚠" not in out and c.segment_lists == 0


def test_catalog_cells_plain_escaped_not_display_label():
    record = ("# Item Record: Quarterly Report - Others\n- **Format**: Journal - Others\n"
              "- **Library**: Clemons\n")
    evil = "# Item Record: Visit https://evil.com/x <b>now</b>\n- **Format**: Book\n"
    rows = [{"label": "/sources/uva_library/items/u1", "nb_hits": 5},
            {"label": "/sources/uva_library/items/u2", "nb_hits": 4}]
    by_id = {"u1": record, "u2": evil}
    t, _ = make({("Actions.getPageUrls", None): rows}, gateway=lambda n, a: by_id[a["item_id"]])
    out = t.call(TOOL_VIRGO_ITEMS, {**OCT, "automated": "ignore"})
    assert "| Quarterly Report - Others (`u1`) |" in out and "| Journal - Others |" in out
    assert "grouped by Matomo" not in out
    line = next(ln for ln in out.splitlines() if "u2" in ln)
    assert "`Visit https://evil.com/x &lt;b&gt;now&lt;/b&gt;`" in line and "<b>" not in line


# ---- re-review --------------------------------------------------------------

def test_remembered_error_repeats_warning_not_preparing_note():
    clock = Clock()
    script = {**TRAFFIC, ("VisitsSummary.get", AUTOMATED_SEGMENT): MatomoError("Matomo returned HTTP 504")}
    t, c = make(script, clock=clock)
    for _ in range(2):
        out = t.call(TOOL_TRAFFIC, {"site": "Virgo", **OCT})
        assert out.splitlines()[1] == WARN_VIRGO and "still preparing" not in out
    assert len(segments(c)) == 1


def test_remembered_timeout_repeats_preparing_note():
    clock = Clock()
    script = {**TRAFFIC, ("VisitsSummary.get", AUTOMATED_SEGMENT): MatomoTimeout("t")}
    t, c = make(script, clock=clock)
    t.call(TOOL_TRAFFIC, {"site": "Virgo", **OCT})
    clock.t += 300
    out = t.call(TOOL_TRAFFIC, {"site": "Virgo", **OCT})
    assert len(segments(c)) == 1
    assert out.splitlines()[1] == WARN_VIRGO
    assert out.splitlines()[-1] == ("Matomo is still preparing the automated-session breakdown for this "
                                    "period; ask again in about 10 minutes.")


@pytest.mark.parametrize("tool,args", [
    (TOOL_TRAFFIC, {"site": "Virgo"}), (TOOL_TOP_PAGES, {"site": "Virgo"}), (TOOL_VIRGO_ITEMS, {"details": False}),
])
def test_virgo_ignore_warns(tool, args):
    script = {**TRAFFIC, ("Actions.getPageUrls", None): PAGE_ROWS}
    t, c = make(script)
    out = t.call(tool, {**args, "automated": "ignore", **OCT})
    lines = out.splitlines()
    assert "Matomo's numbers as reported" in lines[0]
    assert lines[1] == IGNORE_WARN_VIRGO
    assert segments(c) == [] and c.segment_lists == 0


def test_other_site_ignore_has_no_warning():
    t, _ = make({("Actions.getPageUrls", None): PAGE_ROWS})
    assert "⚠" not in t.call(TOOL_TOP_PAGES, {"site": "10", "automated": "ignore", **OCT})


def test_top_pages_virgo_show_with_stored_segment_adds_without_column():
    script = {("Actions.getPageUrls", None): PAGE_ROWS, ("Actions.getPageUrls", AUTOMATED_SEGMENT): AUTO_PAGE_ROWS}
    t, c = make(script)
    out = t.call(TOOL_TOP_PAGES, {"site": "Virgo", **OCT})
    lines = out.splitlines()
    assert lines[0] == f"Virgo 4-prod, {OCT_LABEL}; automated sessions shown separately; report: pages"
    assert "| Page | Pageviews | Pageviews without automated | Unique pageviews | Avg time | Bounce rate |" in out
    rows = [ln for ln in lines if ln.startswith("| /") or ln.startswith("| Other")]
    # ranked by plain pageviews; without = plain - automated (floored at 0)
    assert [r.split("|")[1].strip() for r in rows][:3] == ["/a", "/b", "/c"]
    assert rows[0].startswith("| /a | 100 | 5 | 80 |")
    assert rows[1].startswith("| /b | 90 | 0 | 70 |")
    assert rows[2].startswith("| /c | 60 | 60 | 60 |")
    assert OTHERS_NOTE in out
    assert [p.get("segment") for _, p in c.calls].count(AUTOMATED_SEGMENT) == 1


def test_top_pages_entry_show_without_column():
    script = {("Actions.getEntryPageUrls", None): PAGE_ROWS,
              ("Actions.getEntryPageUrls", AUTOMATED_SEGMENT): AUTO_PAGE_ROWS}
    t, _ = make(script)
    out = t.call(TOOL_TOP_PAGES, {"site": "Virgo", "report": "entry", **OCT})
    assert "| Page | Entries | Entries without automated | Bounce rate |" in out
    assert any(ln.startswith("| /a | 50 | 5 | ") for ln in out.splitlines())


def test_top_pages_virgo_show_without_stored_segment_warns():
    t, c = make({("Actions.getPageUrls", None): PAGE_ROWS}, stored=False)
    out = t.call(TOOL_TOP_PAGES, {"site": "Virgo", **OCT})
    lines = out.splitlines()
    assert lines[0].endswith(f"{NOT_SEPARATED}; report: pages") and lines[1] == WARN_VIRGO
    assert segments(c) == [] and "without automated" not in out


# ---- split switched off: no segment lookup or call, the warning instead --------

@pytest.mark.parametrize("mode", ["show", "exclude"])
def test_split_off_makes_no_segment_calls(mode):
    c = Client(TRAFFIC, stored=True)
    t = MatomoTools(c, today=lambda: TODAY, clock=Clock(), automated_split=False,
                    gateway_call=lambda n, a: "Tool Error: none")
    out = t.call(TOOL_TRAFFIC, {"site": "Virgo", "automated": mode, **OCT})
    assert out.splitlines()[1] == WARN_VIRGO
    assert segments(c) == [] and c.segment_lists == 0
    assert "1,000" in out


def test_split_switch_from_env(monkeypatch):
    seen = {}

    class Fake:
        def __init__(self, client, **kw):
            seen.update(kw)
    monkeypatch.setattr(matomo_tools, "MatomoTools", Fake)
    monkeypatch.setattr(matomo_tools, "MatomoClient", lambda token, **kw: object())
    for env, want in (({}, False), ({"MATOMO_AUTOMATED_SPLIT": "true"}, True)):
        matomo_tools._reset_cache()
        matomo_tools.matomo_tools_for_env({"ENABLE_MATOMO": "true", **env}, ssm_get=lambda n, d: "tok")
        assert seen["automated_split"] is want
    matomo_tools._reset_cache()
