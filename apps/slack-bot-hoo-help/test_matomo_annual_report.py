"""matomo_annual_report: the standard Virgo annual report for a fiscal year, against the year before."""
import datetime
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from matomo_client import MatomoError, MatomoTimeout  # noqa: E402
from matomo_tools import (  # noqa: E402
    OTHER_TIMEOUT, TOOL_ANNUAL_REPORT, MatomoTools, _gap_ranges,
)
from test_virgo_access import CORKS, KANOPY  # noqa: E402

D = datetime.date
TODAY = D(2026, 11, 7)
SITES = [{"idsite": 10, "name": "Library CMS", "main_url": "http://www.library.virginia.edu"},
         {"idsite": 39, "name": "Virgo 4-prod", "main_url": "https://v4.lib.virginia.edu"}]
COLL, ITEM = "^COLLECTION_ITEM_VIEWED - ", "^ITEM_DETAIL_VIEWED - "


def months(start, n):
    y, m = start
    out = []
    for _ in range(n):
        out.append(f"{y}-{m:02d}")
        y, m = (y + (m == 12), m % 12 + 1)
    return out


ALL_MONTHS = months((2024, 7), 28)  # FY25, FY26, FY27 to Oct


def ev(action, name, visits, events):
    return {"label": f"{action} - {name}", "Events_EventName": name, "nb_visits": visits, "nb_events": events}


def base_data():
    visits = {m: {"nb_visits": 100, "nb_actions": 500, "bounce_count": 10, "sum_visit_length": 1000}
              for m in ALL_MONTHS}
    visits["2025-11"] = {"nb_visits": 801527, "nb_actions": 1, "bounce_count": 1, "sum_visit_length": 1}
    visits["2024-11"] = {"nb_visits": 43641, "nb_actions": 1, "bounce_count": 1, "sum_visit_length": 1}
    actions = {m: {"nb_pageviews": 10, "nb_searches": 2, "nb_downloads": 1} for m in ALL_MONTHS}
    coll = {m: [] for m in ALL_MONTHS}
    coll["2025-08"] = [ev("COLLECTION_ITEM_VIEWED", "University of Virginia Visual History Collection", 2475, 10491),
                       ev("COLLECTION_ITEM_VIEWED", "Libra ETD Repository", 8405, 14955),
                       ev("COLLECTION_ITEM_VIEWED", "Hathi Trust Digital Library", 51131, 93392)]
    coll["2024-08"] = [ev("COLLECTION_ITEM_VIEWED", "University of Virginia Visual History Collection", 2284, 9302)]
    items = {m: [] for m in ALL_MONTHS}
    items["2025-09"] = [ev("ITEM_DETAIL_VIEWED", "u126747", 1141, 1782),
                        ev("ITEM_DETAIL_VIEWED", "kan1112973", 900, 950),
                        ev("ITEM_DETAIL_VIEWED", "Others", 5000, 5000)]
    return {("VisitsSummary.get", None): visits, ("Actions.get", None): actions,
            ("Events.getAction", COLL): coll, ("Events.getAction", ITEM): items}


class Client:
    def __init__(self, data, days=None, fail=None):
        self.data, self.days, self.fail = data, days or {}, fail or {}
        self.calls = []

    def sites(self):
        return SITES

    def stored_segment(self, definition, idsite=None):
        return None

    def api(self, method, /, **params):
        self.calls.append((method, params))
        key = (method, params.get("filter_pattern"))
        if (method, params["period"], params.get("filter_pattern")) in self.fail:
            raise self.fail[(method, params["period"], params.get("filter_pattern"))]
        if method in self.fail:
            raise self.fail[method]
        start, _, end = params["date"].partition(",")
        end = end or start
        if params["period"] == "day":
            d0, d1 = D.fromisoformat(start), D.fromisoformat(end)
            out = {}
            while d0 <= d1:
                out[d0.isoformat()] = self.days.get(d0.isoformat(), {"nb_visits": 5})
                d0 += datetime.timedelta(days=1)
            return out if "," in params["date"] else out[start]
        assert params["period"] == "month", params
        src = self.data[key]
        got = {m: v for m, v in src.items() if start[:7] <= m <= end[:7]}
        return got if "," in params["date"] else got[start[:7]]


def make(data=None, days=None, fail=None, gateway=None, gateway_on=True):
    c = Client(data or base_data(), days, fail)
    calls = []

    def gw(name, args):
        calls.append(args)
        return (gateway or {"u126747": CORKS, "kan1112973": KANOPY}).get(args["item_id"], "Error: no record")
    t = MatomoTools(c, today=lambda: TODAY, gateway_call=gw if gateway_on else None)
    return t, c, calls


def report(t, fy="FY26"):
    return t.call(TOOL_ANNUAL_REPORT, {"fiscal_year": fy})


def section(out, name):
    return out.split(f"## {name}\n", 1)[1].split("\n## ", 1)[0]


def rows(text):
    return [ln for ln in text.splitlines() if ln.startswith("| ") and not ln.startswith("| ---")][1:]


def test_sections_in_order_and_header():
    out = report(make()[0])
    assert out.splitlines()[0] == ("Virgo annual report — FY26 (July 1, 2025 – June 30, 2026), compared with "
                                   "FY25 (July 1, 2024 – June 30, 2025)")
    heads = [ln for ln in out.splitlines() if ln.startswith("## ")]
    assert heads == ["## Summary", "## Monthly visits", "## Top collections", "## Top records", "## Notes"]


def test_summary_compares_previous_year():
    data = base_data()
    for m in months((2025, 7), 12):
        data[("VisitsSummary.get", None)][m] = {"nb_visits": 1000 if m == "2025-07" else 0}
    for m in months((2024, 7), 12):
        data[("VisitsSummary.get", None)][m] = {"nb_visits": 800 if m == "2024-07" else 0}
    s = section(report(make(data)[0]), "Summary")
    assert s.splitlines()[0] == "| Metric | FY26 | FY25 | Change |"
    assert "| Visits | 1,000 | 800 | +25.0% |" in s
    assert [r.split("|")[1].strip() for r in rows(s)] == ["Visits", "Pageviews", "Site searches", "Downloads"]


def test_monthly_rows_jul_to_jun():
    s = section(report(make()[0]), "Monthly visits")
    assert s.splitlines()[0] == "| Month | FY26 visits | FY25 visits |"
    r = rows(s)
    assert len(r) == 12 and r[0].startswith("| Jul |") and r[-1].startswith("| Jun |")
    assert "| Nov | 801,527 | 43,641 |" in r


def test_fiscal_year_in_progress_has_only_months_with_data():
    out = report(make()[0], "FY27")
    assert out.splitlines()[0].startswith("Virgo annual report — FY27 (July 1, 2026 – November 6, 2026), "
                                          "compared with FY26 (July 1, 2025 – November 6, 2025)")
    r = rows(section(out, "Monthly visits"))
    assert [x.split("|")[1].strip() for x in r] == ["Jul", "Aug", "Sep", "Oct"]
    assert section(out, "Monthly visits").splitlines()[0] == "| Month | FY27 visits | FY26 visits |"


def test_collections_have_previous_year_and_kind():
    s = section(report(make()[0]), "Top collections")
    assert s.splitlines()[0] == "| Collection | FY26 visits | FY25 visits | Item views | Kind |"
    assert "| University of Virginia Visual History Collection | 2,475 | 2,284 | 10,491 | UVA collection |" in s
    assert "| Libra ETD Repository | 8,405 | 0 | 14,955 | UVA collection |" in s
    assert rows(s)[0].startswith("| Hathi Trust Digital Library |")


def test_collections_at_most_15():
    data = base_data()
    data[("Events.getAction", COLL)]["2025-08"] = [ev("COLLECTION_ITEM_VIEWED", f"C{i}", 100 - i, 1)
                                                   for i in range(30)]
    assert len(rows(section(report(make(data)[0]), "Top collections"))) == 15


def test_records_top_20_with_details():
    data = base_data()
    data[("Events.getAction", ITEM)]["2025-10"] = [ev("ITEM_DETAIL_VIEWED", f"u9{i:02d}", 50 - i, 60)
                                                   for i in range(25)]
    t, _, calls = make(data)
    s = section(report(t), "Top records")
    assert s.splitlines()[0] == "| Record | Visits | Item views | Format | Access type |"
    assert len(rows(s)) == 20 and len(calls) <= 20
    assert "| Corks and Curls (`u126747`) | 1,141 | 1,782 | Journal/Magazine, Online | UVA digital |" in s


def test_notes_tracking_gaps_and_others():
    days = {d: [] for d in ("2025-11-09", "2025-11-10")}
    days["2025-11-11"] = {"nb_visits": 0}
    d = D(2025, 12, 27)
    while d <= D(2026, 1, 3):
        days[d.isoformat()] = []
        d += datetime.timedelta(days=1)
    notes = section(report(make(days=days)[0]), "Notes")
    lines = notes.splitlines()
    assert lines[0] == ("No visits were recorded on: Nov 9–11, 2025; Dec 27, 2025 – Jan 3, 2026 "
                        "(likely tracking gaps).")
    assert "5,000 record visits are grouped by Matomo as “Others” (it keeps only each month's top items)." in notes


def test_gap_ranges():
    assert _gap_ranges([]) == []
    assert _gap_ranges([D(2025, 11, 9)]) == ["Nov 9, 2025"]
    assert _gap_ranges([D(2025, 11, 9), D(2025, 11, 10), D(2025, 11, 11)]) == ["Nov 9–11, 2025"]
    assert _gap_ranges([D(2025, 11, 30), D(2025, 12, 1)]) == ["Nov 30 – Dec 1, 2025"]
    assert _gap_ranges([D(2025, 12, 31), D(2026, 1, 1), D(2026, 1, 5)]) == ["Dec 31, 2025 – Jan 1, 2026",
                                                                            "Jan 5, 2026"]


def test_failed_section_is_unavailable():
    t, _, _ = make(fail={("Events.getAction", "month", COLL): MatomoError("Invalid segment")})
    out = report(t)
    assert section(out, "Top collections") == "Unavailable: Invalid segment"
    assert "| Visits |" in section(out, "Summary")
    assert rows(section(out, "Top records"))


def test_busy_matomo_fails_whole_report():
    t, _, _ = make(fail={("Events.getAction", "month", ITEM): MatomoTimeout("t")})
    assert report(t) == "Error: " + OTHER_TIMEOUT


def test_no_range_requests_and_request_count():
    t, c, _ = make()
    report(t)
    assert all(p["period"] != "range" for _, p in c.calls)
    assert len(c.calls) <= 8


def test_tool_offered_and_bad_fiscal_year():
    t, _, _ = make(gateway_on=False)
    assert TOOL_ANNUAL_REPORT in [s["toolSpec"]["name"] for s in t.tool_specs()]
    assert section(report(t), "Top records") == "Unavailable: catalog lookups are not available"
    assert report(t, "2026x").startswith("Error:")
    assert t.call(TOOL_ANNUAL_REPORT, {}).startswith("Error:")
