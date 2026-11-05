"""Ranges are answered from Matomo's pre-processed month and day reports, never period=range.

A range report (a fiscal year of Virgo page URLs) makes Matomo build an archive on request,
which overloaded the server on 2026-11-05.
"""
import datetime
import os
import sys

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from matomo_report import archived_parts, resolve_period  # noqa: E402
from matomo_tools import (  # noqa: E402
    RANGE_NOTE, RANGE_ROWS, TOOL_PAGE, TOOL_TOP_PAGES, TOOL_TRAFFIC, TOOL_VIRGO_ITEMS,
    UNIQ_RANGE_NOTE, MatomoTools,
)

D = datetime.date
TODAY = D(2026, 11, 5)
SITES = [{"idsite": 10, "name": "Library CMS", "main_url": "http://www.library.virginia.edu"},
         {"idsite": 39, "name": "Virgo 4-prod", "main_url": "https://v4.lib.virginia.edu"}]


def parts(start, end):
    return archived_parts(resolve_period(start, end, today=TODAY))


@pytest.mark.parametrize("start,end,want", [
    ("2026-10-01", "2026-10-31", [("month", "2026-10-01")]),
    ("2025-01-01", "2025-12-31", [("year", "2025-01-01")]),
    ("2025-07-01", "2026-06-30", [("month", "2025-07-01,2026-06-01")]),
    ("2026-07-01", "2026-11-04", [("month", "2026-07-01,2026-10-01"), ("day", "2026-11-01,2026-11-04")]),
    ("2025-06-20", "2026-06-30", [("day", "2025-06-20,2025-06-30"), ("month", "2025-07-01,2026-06-01")]),
    ("2026-10-15", "2026-11-04", [("day", "2026-10-15,2026-11-04")]),
    ("2026-09-10", "2026-11-03", [("day", "2026-09-10,2026-09-30"), ("month", "2026-10-01"),
                                  ("day", "2026-11-01,2026-11-03")]),
])
def test_archived_parts(start, end, want):
    assert parts(start, end) == want


def test_fiscal_year_is_twelve_months():
    assert archived_parts(resolve_period(fiscal_year="FY26", today=TODAY)) == [("month", "2025-07-01,2026-06-01")]


class Client:
    def __init__(self, by_period):
        self.by_period = by_period  # period -> {date key: report}
        self.calls = []

    def sites(self):
        return SITES

    def stored_segment(self, definition, idsite=None):
        return None

    def api(self, method, /, **params):
        self.calls.append((method, params))
        assert params["period"] != "range", "range reports make Matomo archive on request"
        return self.by_period[(method, params["period"])]


def make(by_period, gateway=None):
    c = Client(by_period)
    return MatomoTools(c, today=lambda: TODAY, automated_split=False,
                       gateway_call=gateway or (lambda n, a: "Tool Error: none")), c


def row(label, hits, visits, time_spent, entries=0, bounces=0, exits=0):
    return {"label": label, "nb_hits": hits, "nb_visits": visits, "sum_time_spent": time_spent,
            "entry_nb_visits": entries, "entry_bounce_count": bounces, "exit_nb_visits": exits,
            "avg_time_on_page": 999, "bounce_rate": "99%", "exit_rate": "99%"}


def test_traffic_range_adds_up_months_and_days():
    v1 = {"nb_visits": 100, "nb_uniq_visitors": 90, "nb_actions": 500, "bounce_count": 40,
          "sum_visit_length": 10000, "bounce_rate": "40%", "avg_time_on_site": 100}
    v2 = {"nb_visits": 300, "nb_uniq_visitors": 200, "nb_actions": 900, "bounce_count": 60,
          "sum_visit_length": 20000, "bounce_rate": "20%", "avg_time_on_site": 67}
    a = {"nb_pageviews": 50, "nb_searches": 5, "nb_downloads": 1, "nb_outlinks": 2}
    t, c = make({("VisitsSummary.get", "month"): {"2026-07": v1, "2026-08": [], "2026-09": v2, "2026-10": v1},
                 ("VisitsSummary.get", "day"): {"2026-11-01": v2, "2026-11-02": []},
                 ("Actions.get", "month"): {"2026-07": a, "2026-08": a, "2026-09": a, "2026-10": a},
                 ("Actions.get", "day"): {"2026-11-01": a, "2026-11-02": a}})
    out = t.call(TOOL_TRAFFIC, {"site": "Library CMS", "start_date": "2026-07-01", "end_date": "2026-11-02"})
    assert "Visits: 800" in out and "Pageviews: 300" in out
    assert "Bounce rate: 25.0%" in out  # (40+60+40+60) / 800
    assert "Average visit: 1:15" in out  # 60000 / 800 = 75 s
    assert "Unique visitors: —" in out and UNIQ_RANGE_NOTE in out
    assert {p["period"] for _, p in c.calls} == {"month", "day"}


def test_top_pages_range_merges_rows_and_reranks():
    m = {"2025-07": [row("/a", 10, 8, 80), row("/b", 50, 40, 400)],
         "2025-08": [row("/a", 60, 50, 1000), row("/c", 30, 30, 300)]}
    t, c = make({("Actions.getPageUrls", "month"): m})
    out = t.call(TOOL_TOP_PAGES, {"site": "Library CMS", "start_date": "2025-07-01", "end_date": "2025-08-31",
                                  "limit": 2})
    lines = [ln for ln in out.splitlines() if ln.startswith("| /")]
    assert lines[0].startswith("| /a | 70 | 58 | 0:19 |")  # 1080 s / 58 visits
    assert lines[1].startswith("| /b | 50 |")
    assert "more rows exist" in out and RANGE_NOTE in out
    (_, params), = c.calls
    assert params["filter_limit"] == RANGE_ROWS


def test_entry_rates_recomputed():
    m = {"2025-07": [row("/a", 10, 10, 0, entries=10, bounces=5, exits=2)],
         "2025-08": [row("/a", 30, 30, 0, entries=30, bounces=5, exits=8)]}
    t, _ = make({("Actions.getEntryPageUrls", "month"): m})
    out = t.call(TOOL_TOP_PAGES, {"site": "Library CMS", "start_date": "2025-07-01", "end_date": "2025-08-31",
                                  "report": "entry"})
    assert "| /a | 40 | 25.0% |" in out  # 10 bounces / 40 entries


def test_page_range():
    t, _ = make({("Actions.getPageUrl", "month"): {"2025-07": [row("/hours", 5, 4, 40, entries=2)],
                                                   "2025-08": [], "2025-09": [row("/hours", 7, 6, 60)]}})
    out = t.call(TOOL_PAGE, {"site": "Library CMS", "url_or_path": "/hours",
                             "start_date": "2025-07-01", "end_date": "2025-09-30"})
    assert "- Pageviews: 12" in out and "- Entries: 2" in out and "- Average time on page: 0:10" in out


def test_virgo_items_fiscal_year_uses_months():
    m = {"2025-07": [{"label": "sources/uva_library/items/u1", "nb_hits": 5}],
         "2025-08": [{"label": "sources/uva_library/items/u1", "nb_hits": 7},
                     {"label": "sources/articles/items/a9", "nb_hits": 3}]}
    m.update({f"2025-{k:02d}": [] for k in range(9, 13)})
    m.update({f"2026-{k:02d}": [] for k in range(1, 7)})
    t, c = make({("Actions.getPageUrls", "month"): m})
    out = t.call(TOOL_VIRGO_ITEMS, {"fiscal_year": "FY26", "details": False})
    assert "| `u1` | `uva_library` | 12 |" in out and "| `a9` | `articles` | 3 |" in out
    (_, params), = c.calls
    assert params["date"] == "2025-07-01,2026-06-01" and params["filter_limit"] == -1
    assert RANGE_NOTE in out


def test_single_month_unchanged():
    t, c = make({("VisitsSummary.get", "month"): {"nb_visits": 5, "nb_uniq_visitors": 4},
                 ("Actions.get", "month"): {"nb_pageviews": 9}})
    out = t.call(TOOL_TRAFFIC, {"site": "Library CMS", "start_date": "2026-10-01", "end_date": "2026-10-31"})
    assert "Unique visitors: 4" in out and UNIQ_RANGE_NOTE not in out
    assert [p["date"] for _, p in c.calls] == ["2026-10-01", "2026-10-01"]


def test_counts_sent_as_text_in_some_months_still_add_up():
    # Real Matomo: a field is an int in one month and a numeric string in another.
    m = {"2025-07": [{"label": "sources/uva_library/items/u1", "nb_hits": 5, "nb_hits_following_search": "2",
                      "sum_time_spent": 10, "nb_visits": 5, "url": "https://v4/u1"}],
         "2025-08": [{"label": "sources/uva_library/items/u1", "nb_hits": "7", "nb_hits_following_search": 3,
                      "sum_time_spent": "20", "nb_visits": 5, "url": "https://v4/u1"}]}
    m.update({f"2025-{k:02d}": [] for k in range(9, 13)})
    m.update({f"2026-{k:02d}": [] for k in range(1, 7)})
    t, _ = make({("Actions.getPageUrls", "month"): m})
    out = t.call(TOOL_VIRGO_ITEMS, {"fiscal_year": "FY26", "details": False})
    assert "| `u1` | `uva_library` | 12 |" in out
