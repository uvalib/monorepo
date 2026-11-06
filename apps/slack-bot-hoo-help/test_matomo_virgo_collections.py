"""matomo_virgo_collections: Virgo collection and item views from Matomo events
(COLLECTION_ITEM_VIEWED, ITEM_DETAIL_VIEWED), the annual-report method."""
import datetime
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from matomo_tools import RANGE_NOTE, TOOL_VIRGO_COLLECTIONS, MatomoTools  # noqa: E402
from test_virgo_access import CORKS, KANOPY  # noqa: E402

TODAY = datetime.date(2026, 11, 5)
SITES = [{"idsite": 10, "name": "Library CMS", "main_url": "http://www.library.virginia.edu"},
         {"idsite": 39, "name": "Virgo 4-prod", "main_url": "https://v4.lib.virginia.edu"}]


def ev(action, name, visits, events):
    return {"label": f"{action} - {name}", "Events_EventAction": action, "Events_EventName": name,
            "nb_visits": visits, "nb_events": events, "sum_daily_nb_uniq_visitors": str(visits)}


COLL = "COLLECTION_ITEM_VIEWED"
ITEM = "ITEM_DETAIL_VIEWED"


class Client:
    def __init__(self, by_period):
        self.by_period = by_period
        self.calls = []

    def sites(self):
        return SITES

    def stored_segment(self, definition, idsite=None):
        raise AssertionError("events are never split by the segment")

    def api(self, method, /, **params):
        self.calls.append((method, params))
        assert method == "Events.getAction" and params["period"] != "range"
        assert params["flat"] == 1 and params["idSite"] == 39
        action = COLL if "COLLECTION" in params["filter_pattern"] else ITEM
        return self.by_period[(action, params["period"])]


def make(by_period, gateway=None):
    c = Client(by_period)
    calls = []

    def gw(name, args):
        calls.append(args)
        return (gateway or {}).get(args["item_id"], "Error: no record")
    return MatomoTools(c, today=lambda: TODAY, gateway_call=gw), c, calls


FY = {f"2025-{m:02d}": [] for m in range(7, 13)} | {f"2026-{m:02d}": [] for m in range(1, 7)}


def test_collections_fiscal_year_ranked_by_visits_with_kinds():
    m = dict(FY)
    m["2025-07"] = [ev(COLL, "University of Virginia Visual History Collection", 200, 900),
                    ev(COLL, "Weatherly Library Fund", 300, 400),
                    ev(COLL, "Kanopy Online Video Collection", 150, 160)]
    m["2025-08"] = [ev(COLL, "University of Virginia Visual History Collection", 100, 300),
                    ev(COLL, "Hathi Trust Digital Library", 250, 300),
                    ev(COLL, "Chiricahua and Mescalero Apache Texts", 10, 12)]
    t, c, _ = make({(COLL, "month"): m})
    out = t.call(TOOL_VIRGO_COLLECTIONS, {"fiscal_year": "FY26"})
    rows = [ln for ln in out.splitlines() if ln.startswith("| ") and not ln.startswith(("| Collection", "| ---"))]
    assert rows[0] == "| University of Virginia Visual History Collection | 300 | 1,200 | UVA collection |"
    assert rows[1] == "| Weatherly Library Fund | 300 | 400 | purchase fund |"
    assert rows[2] == "| Hathi Trust Digital Library | 250 | 300 | HathiTrust (external) |"
    assert rows[3] == "| Kanopy Online Video Collection | 150 | 160 | licensed |"
    assert rows[4].startswith("| Chiricahua and Mescalero Apache Texts | 10 |")
    assert out.splitlines()[0].startswith("Virgo 4-prod, 2025-07-01 to 2026-06-30")
    assert "⚠" not in out and "Matomo's numbers as reported" in out.splitlines()[0]  # no bot warning
    (_, p), = c.calls
    assert p["date"] == "2025-07-01,2026-06-01" and p["filter_pattern"] == "^COLLECTION_ITEM_VIEWED - "


def test_collections_limit():
    m = dict(FY)
    m["2025-07"] = [ev(COLL, f"Collection {i}", 100 - i, 100) for i in range(30)]
    t, _, _ = make({(COLL, "month"): m})
    out = t.call(TOOL_VIRGO_COLLECTIONS, {"fiscal_year": "FY26", "limit": 3})
    assert "| Collection 2 |" in out and "| Collection 3 |" not in out
    assert "more collections" in out


def test_items_with_details_and_others():
    m = dict(FY)
    m["2025-07"] = [ev(ITEM, "u126747", 600, 900), ev(ITEM, "kan1112973", 50, 60), ev(ITEM, "Others", 9999, 9999)]
    m["2025-08"] = [ev(ITEM, "u126747", 541, 882), ev(ITEM, "gone1", 70, 70)]
    t, _, calls = make({(ITEM, "month"): m}, gateway={"u126747": CORKS, "kan1112973": KANOPY})
    out = t.call(TOOL_VIRGO_COLLECTIONS, {"fiscal_year": "FY26", "report": "items"})
    assert "| Corks and Curls (`u126747`) | 1,141 | 1,782 | Journal/Magazine, Online | Ivy / 4th Floor" in out
    assert "| UVA digital |" in out and "| licensed e-resource |" in out
    assert "Others" not in out.split("Top items", 1)[1].split("\n", 2)[2].split("|")[1]
    assert "9,999 visits are grouped by Matomo as “Others”" in out
    assert {a["item_id"]: a.get("pool_id") for a in calls}["kan1112973"] == "uva_library"
    assert RANGE_NOTE in out


def test_items_without_details():
    m = dict(FY)
    m["2025-07"] = [ev(ITEM, "u1", 5, 6)]
    t, _, calls = make({(ITEM, "month"): m})
    out = t.call(TOOL_VIRGO_COLLECTIONS, {"fiscal_year": "FY26", "report": "items", "details": False})
    assert "| `u1` | 5 | 6 |" in out and calls == []


def test_bad_report():
    t, _, _ = make({})
    assert t.call(TOOL_VIRGO_COLLECTIONS, {"fiscal_year": "FY26", "report": "pools"}).startswith("Error:")


def test_tool_is_offered_and_untrusted():
    from agent import untrusted_source
    t, _, _ = make({})
    names = [s["toolSpec"]["name"] for s in t.tool_specs()]
    assert TOOL_VIRGO_COLLECTIONS in names and t.handles(TOOL_VIRGO_COLLECTIONS)
    assert untrusted_source(TOOL_VIRGO_COLLECTIONS) == "matomo"


def test_event_method_allowed():
    from matomo_client import ALLOWED_METHODS
    assert "Events.getAction" in ALLOWED_METHODS
