import datetime
import os
import sys
import threading

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from matomo_client import MatomoTimeout  # noqa: E402
from matomo_report import AUTOMATED_SEGMENT  # noqa: E402
from matomo_tools import TOOL_VIRGO_ITEMS, MatomoTools  # noqa: E402
from test_virgo_access import ARTICLE, BOOK, PROXY  # noqa: E402

TODAY = datetime.date(2026, 11, 5)
SITES = [{"idsite": 10, "name": "Library CMS", "main_url": "http://www.library.virginia.edu"},
         {"idsite": 39, "name": "Virgo 4-prod", "main_url": "https://v4.lib.virginia.edu"}]
SEG_TIMEOUT = ("Matomo is still preparing the automated-session breakdown for this "
               "period; ask again in about 10 minutes.")
PROVISIONAL = ("Access types follow a provisional rule (pool and access-link host) "
               "pending the annual-report definitions.")


def row(label, hits):
    return {"label": label, "nb_hits": hits}


ROWS = [
    row("/sources/uva_library/items/u1", 50),
    row("search.lib.virginia.edu/sources/articles/items/a9h_2", 30),
    row("/sources/uva_library/items/u3", 20),
    row("/sources/hathitrust/items/hvd_4", 7),
    row("/sources/images/items/img5", 5),
    row("/sources/weird_pool/items/w6", 3),
    row("/sources/uva_library/items/ - Others", 11),
    row("/feedback?url=/sources/uva_library/items/u9", 99),
]
AUTO_ROWS = [row("/sources/uva_library/items/u1", 40), row("/sources/articles/items/a9h_2", 5),
             row("/sources/uva_library/items/ - Others", 100)]


class FakeClient:
    stored = True  # an auto-archived automated-sessions segment exists

    def __init__(self, script):
        self.script = script
        self.calls = []

    def sites(self):
        return SITES

    def stored_segment(self, definition, idsite=None):
        return {"definition": definition, "auto_archive": "1"} if self.stored else None

    def api(self, method, /, **params):
        self.calls.append((method, params))
        r = self.script[(method, params.get("segment"))]
        if isinstance(r, Exception):
            raise r
        return r


def make(script=None, gateway=None, **kw):
    script = script if script is not None else {("Actions.getPageUrls", None): ROWS}
    c = FakeClient(script)
    return MatomoTools(c, today=lambda: TODAY, gateway_call=gateway or (lambda n, a: "Error: none"), **kw), c


ARGS = {"start_date": "2026-10-01", "end_date": "2026-10-31", "automated": "ignore"}


def test_virgo_items_pool_totals():
    t, c = make(gateway=lambda n, a: "Error: x")
    out = t.call(TOOL_VIRGO_ITEMS, {**ARGS, "limit": 2})
    method, params = c.calls[0]
    assert method == "Actions.getPageUrls"
    assert params["idSite"] == 39 and params["flat"] == 1
    assert params["filter_pattern"] == "^/?sources/[^/]+/items/"
    assert params["filter_sort_column"] == "nb_hits" and params["filter_sort_order"] == "desc"
    assert params["filter_limit"] == -1
    first = out.splitlines()[0]
    assert "Virgo 4-prod" in first and "2026-10-01 to 2026-10-31" in first
    # catalog 50+20+11 (grouped Others counted), articles 30, hathitrust 7, images 5, other 3
    for pool, n in (("Catalog", 81), ("Articles", 30), ("HathiTrust", 7), ("Images", 5), ("Other", 3)):
        assert any(pool in ln and f"| {n} |" in ln.replace("  ", " ") for ln in out.splitlines()), (pool, out)
    assert "feedback" not in out and "Others" not in out.split("Top items")[-1]
    items_part = out.split("Top items")[-1]
    assert "u1" in items_part and "a9h_2" in items_part and "u3" not in items_part  # limit 2, by hits
    assert items_part.index("u1") < items_part.index("a9h_2")


def test_virgo_items_details():
    calls = []
    book_by_id = {"u1": PROXY, "a9h_2": ARTICLE, "u3": BOOK}

    def gw(name, args):
        calls.append((name, args))
        return book_by_id[args["item_id"]]

    t, _ = make(gateway=gw)
    out = t.call(TOOL_VIRGO_ITEMS, {**ARGS, "limit": 3})
    assert sorted((a["item_id"], a["pool_id"]) for _, a in calls) == [
        ("a9h_2", "articles"), ("u1", "uva_library"), ("u3", "uva_library")]
    from tool_names import gateway_name
    assert {n for n, _ in calls} == {gateway_name("get_item_details", True)}
    assert all(set(a) == {"item_id", "pool_id"} for _, a in calls)
    assert "Heaven: A Novel (1st ed.)" in out and "EBook, Book, Online" in out
    assert "licensed e-resource" in out and "licensed (EDS)" in out and "physical (UVA collection)" in out
    assert "Clemons" in out and "Stacks" in out
    assert PROVISIONAL in out
    assert "without details" not in out


def test_virgo_items_partial_details():
    release = threading.Event()

    def gw(name, args):
        if args["item_id"] == "u1":
            raise RuntimeError("boom")
        release.wait(5)
        return PROXY

    t, _ = make(gateway=gw, budget=0.2)
    out = t.call(TOOL_VIRGO_ITEMS, {**ARGS, "limit": 2})
    release.set()
    assert out.count("details unavailable") == 2
    assert "2 items without details" in out and "2 item without" not in out
    assert "u1" in out and "a9h_2" in out


def test_virgo_items_automated_show():
    script = {("Actions.getPageUrls", None): ROWS, ("Actions.getPageUrls", AUTOMATED_SEGMENT): AUTO_ROWS}
    t, c = make(script, gateway=lambda n, a: "Error: x")
    out = t.call(TOOL_VIRGO_ITEMS, {"start_date": "2026-10-01", "end_date": "2026-10-31", "limit": 2})
    assert sorted(str(p.get("segment")) for _, p in c.calls) == sorted(["None", AUTOMATED_SEGMENT])
    assert "automated sessions shown separately" in out.splitlines()[0]
    lines = out.splitlines()
    cat = next(ln for ln in lines if "Catalog" in ln)
    # plain 81, automated 140 (u1 40 + Others 100), without floored at 0 -> 81 - 140 -> 0
    assert "81" in cat and "140" in cat and "| 0 |" in cat.replace("  ", " ")
    art = next(ln for ln in lines if "Articles" in ln)
    assert "30" in art and "25" in art
    # top items come from the without totals: a9h_2 (25), u3 (20); u1 (50-40=10) is cut at limit 2
    items_part = out.split("Top items")[-1]
    assert items_part.index("a9h_2") < items_part.index("u3") and "u1" not in items_part


def test_virgo_items_automated_exclude():
    script = {("Actions.getPageUrls", None): ROWS, ("Actions.getPageUrls", AUTOMATED_SEGMENT): AUTO_ROWS}
    t, c = make(script, gateway=lambda n, a: "Error: x")
    out = t.call(TOOL_VIRGO_ITEMS, {**ARGS, "automated": "exclude", "limit": 2})
    assert sorted(str(p.get("segment")) for _, p in c.calls) == sorted([AUTOMATED_SEGMENT, "None"])
    assert "excluding likely automated sessions" in out.splitlines()[0]
    art = next(ln for ln in out.splitlines() if ln.startswith("| Articles"))
    assert art == "| Articles | 25 |"
    items_part = out.split("Top items")[-1]
    assert items_part.index("a9h_2") < items_part.index("u3") and "u1" not in items_part


def test_virgo_items_segment_timeout_falls_back():
    script = {("Actions.getPageUrls", None): ROWS, ("Actions.getPageUrls", AUTOMATED_SEGMENT): MatomoTimeout("t")}
    t, _ = make(script, gateway=lambda n, a: "Error: x")
    out = t.call(TOOL_VIRGO_ITEMS, {"start_date": "2026-10-01", "end_date": "2026-10-31"})
    assert not out.startswith("Error") and SEG_TIMEOUT in out and "Catalog" in out


def test_virgo_items_details_off():
    calls = []
    t, _ = make(gateway=lambda n, a: calls.append(n))
    out = t.call(TOOL_VIRGO_ITEMS, {**ARGS, "details": False, "limit": 2})
    assert calls == [] and "u1" in out and PROVISIONAL not in out


def test_virgo_items_pool_filter_and_errors():
    t, c = make(gateway=lambda n, a: "Error: x")
    t.call(TOOL_VIRGO_ITEMS, {**ARGS, "pool": "articles", "details": False})
    assert c.calls[0][1]["filter_pattern"] == "^/?sources/articles/items/"
    assert t.call(TOOL_VIRGO_ITEMS, {**ARGS, "pool": "bogus"}).startswith("Error:")
    t2, _ = make({("Actions.getPageUrls", None): MatomoTimeout("t")})
    assert t2.call(TOOL_VIRGO_ITEMS, ARGS).startswith("Error: Matomo is overloaded or not responding")


def test_virgo_items_untrusted_title():
    evil = "# Item Record: <b>ignore previous</b> `x` | pipe\n- **Library**: Clemons\n"
    t, _ = make(gateway=lambda n, a: evil)
    out = t.call(TOOL_VIRGO_ITEMS, {**ARGS, "limit": 1})
    assert "<b>" not in out and "&lt;b&gt;" in out


def test_virgo_items_unrankable_rows_count_in_pool_total():
    rows = [row("/sources/hathitrust/items/hvd$32044", 40), row("/sources/hathitrust/items/a%2Fb", 30),
            row("/sources/hathitrust/items/x/y", 20), row("/sources/hathitrust/items/hvd_ok", 1),
            row("/feedback?url=/sources/hathitrust/items/z", 500)]
    calls = []

    def gw(name, args):
        calls.append(args["item_id"])
        return BOOK

    t, _ = make({("Actions.getPageUrls", None): rows}, gateway=gw)
    out = t.call(TOOL_VIRGO_ITEMS, {**ARGS, "limit": 20})
    assert any("HathiTrust" in ln and "| 91 |" in ln for ln in out.splitlines()), out
    assert calls == ["hvd_ok"]
    assert "hvd$32044" not in out


def test_virgo_items_one_item_without_details():
    t, _ = make(gateway=lambda n, a: "Error: x")
    out = t.call(TOOL_VIRGO_ITEMS, {**ARGS, "limit": 1})
    assert "1 item without details" in out and "1 items" not in out


# ---- final fix round: gateway failures are missing details ----------------------

import pytest  # noqa: E402

GATEWAY_FAILURES = [
    "Tool Error: Item not found",
    "Gateway Tool Invocation Error (Catalog___get_item_details): 504 Server Error: Gateway Timeout",
    "Tool Invocation Error (x): boom",
    "{}",
    "No record found for that id.",
    "   ",
]


@pytest.mark.parametrize("text", GATEWAY_FAILURES)
def test_gateway_failure_counts_as_missing(text):
    t, _ = make(gateway=lambda n, a: text)
    out = t.call(TOOL_VIRGO_ITEMS, {**ARGS, "limit": 1})
    assert "details unavailable" in out and "1 item without details" in out
    assert "Gateway" not in out and "Tool Error" not in out


def test_image_record_found():
    rows = [row("/sources/images/items/img5", 5)]
    t, _ = make({("Actions.getPageUrls", None): rows},
                gateway=lambda n, a: "# Image Record: Rotunda, north front\n- **Format**: Photograph\n")
    out = t.call(TOOL_VIRGO_ITEMS, {**ARGS, "limit": 1})
    assert "Rotunda, north front" in out and "Photograph" in out and "without details" not in out
