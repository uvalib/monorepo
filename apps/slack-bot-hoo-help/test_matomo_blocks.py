"""Block Kit templates for Matomo tool results (tables and up to two charts, built by code)."""
import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from matomo_blocks import MATOMO_BLOCK_ID, matomo_blocks_for_step  # noqa: E402
import test_matomo_annual_report as A  # noqa: E402


def annual(data=None, fy="FY26", fail=None):
    t, _, _ = A.make(data=data, fail=fail)
    return A.report(t, fy)


def types(blocks):
    return [b["type"] for b in blocks]


def charts(blocks):
    return [b for b in blocks if b["type"] == "data_visualization"]


def cells(block):
    return [[c["text"] for c in row] for row in block["rows"]]


def coll_data(rows):
    data = A.base_data()
    data[("Events.getAction", A.COLL)]["2025-08"] = [A.ev("COLLECTION_ITEM_VIEWED", n, v, v) for n, v in rows]
    return data


def test_annual_report_layout():
    b = matomo_blocks_for_step("matomo_annual_report", annual(), 2)
    # Slack allows one table block per message: collections is the table; records are preformatted.
    assert types(b) == ["header", "section", "data_visualization", "data_visualization", "table", "section",
                        "context"]
    assert b[0]["block_id"] == MATOMO_BLOCK_ID == "matomo_report"
    fields = [f["text"] for f in b[1]["fields"]]
    assert fields[0] == "*Visits*\n802,627 (FY25 44,741, +1693.9%)" and len(fields) == 4
    assert cells(b[4])[0] == ["Collection", "FY26 visits", "FY25 visits", "Item views", "Kind"]
    rec = b[5]["text"]["text"]
    assert rec.startswith("*Top records*\n```") and "Corks and Curls (u126747)" in rec and rec.endswith("```")
    line = charts(b)[0]["chart"]
    assert line["type"] == "line" and [s["name"] for s in line["series"]] == ["FY26", "FY25"]
    assert line["axis_config"]["categories"][0] == "Jul" and len(line["axis_config"]["categories"]) == 12
    assert [c["block_id"] for c in charts(b)] == ["matomo_chart_1", "matomo_chart_2"]
    assert b[0]["text"]["text"].startswith("Virgo annual report — FY26")


def test_annual_chart_uva_collections_only():
    data = coll_data([("Hathi Trust Digital Library", 900), ("Libra ETD Repository", 800),
                      ("Kanopy Online Video Collection", 700), ("Weatherly Library Fund", 600),
                      ("Holsinger Studio Collection", 500)])
    bar = charts(matomo_blocks_for_step("matomo_annual_report", annual(data), 2))[1]["chart"]
    assert bar["type"] == "bar" and bar["axis_config"]["categories"] == ["Libra ETD Repository", "Holsinger Studio Co…"]
    assert bar["series"][0]["data"][0]["value"] == 800.0


def test_viz_budget_respected():
    one = matomo_blocks_for_step("matomo_annual_report", annual(), 1)
    assert len(charts(one)) == 1 and charts(one)[0]["chart"]["type"] == "line"
    none = matomo_blocks_for_step("matomo_annual_report", annual(), 0)
    assert charts(none) == [] and types(none).count("table") == 1


def test_in_progress_year_chart_like_for_like():
    line = charts(matomo_blocks_for_step("matomo_annual_report", annual(fy="FY27"), 2))[0]["chart"]
    assert line["axis_config"]["categories"] == ["Jul", "Aug", "Sep", "Oct"]
    assert [s["name"] for s in line["series"]] == ["FY27", "FY26"]


def test_unavailable_section_still_renders_others():
    from matomo_client import MatomoError
    out = annual(fail={("Events.getAction", "month", A.COLL): MatomoError("Invalid segment")})
    b = matomo_blocks_for_step("matomo_annual_report", out, 2)
    # No collections table, so records get the one native table.
    assert types(b) == ["header", "section", "data_visualization", "table", "context"]
    assert "Unavailable: Invalid segment" in b[-1]["elements"][0]["text"]


def test_untrusted_names_plain():
    b = matomo_blocks_for_step("matomo_annual_report", annual(coll_data([("<https://evil|click> *bold*", 50)])), 2)
    table = [x for x in b if x["type"] == "table"][0]
    assert ["<https://evil/click> *bold*", "50", "0", "50", "UVA collection"] in cells(table)
    mrkdwn = [e["text"] for x in b if x["type"] == "context" for e in x["elements"]]
    mrkdwn += [x["text"]["text"] for x in b if x["type"] == "section" and "text" in x]
    assert not any("evil" in m for m in mrkdwn)


def test_untrusted_record_title_stays_literal_in_preformatted():
    from test_virgo_access import CORKS
    evil = CORKS.replace("Corks and Curls", "<https://evil.example|Click> <!channel> *x*")
    t, _, _ = A.make(gateway={"u126747": evil})
    rec = [x for x in matomo_blocks_for_step("matomo_annual_report", A.report(t), 2)
           if x["type"] == "section" and "text" in x][0]["text"]["text"]
    assert "<" not in rec and ">" not in rec and "&lt;!channel&gt;" in rec


def test_long_duplicate_labels():
    a = "University of Virginia Special Collection A"
    b2 = "University of Virginia Special Collection B"
    blocks = matomo_blocks_for_step("matomo_annual_report", annual(coll_data([(a, 90), (b2, 80)])), 2)
    bar = charts(blocks)[1]["chart"]
    cats = bar["axis_config"]["categories"]
    assert len(set(cats)) == 2 and all(len(c) <= 20 for c in cats)
    assert [d["value"] for d in bar["series"][0]["data"]] == [90.0, 80.0]
    table = [x for x in blocks if x["type"] == "table"][0]
    assert [a, "90", "0", "90", "UVA collection"] in cells(table)


TRAFFIC_COMPARE = """Virgo 4-prod, 2026-10-01 to 2026-10-31; Matomo's numbers as reported
Compared with 2026-09-01 to 2026-09-30.
| Metric | 2026-10-01 to 2026-10-31 | 2026-09-01 to 2026-09-30 | Change |
| --- | --- | --- | --- |
| Visits | 247,159 | 118,391 | +108.8% |
| Unique visitors | — | — | — |
| Pageviews | 1,000 | 900 | +11.1% |
| Bounce rate | 40.0% | 41.0% | — |"""
TRAFFIC_SINGLE = """Library CMS, 2026-10-01 to 2026-10-31; Matomo's numbers as reported
- Visits: 1,000
- Unique visitors: 800
- Pageviews: 4,000
- Site searches: 300
- Downloads: 20
- Outlinks: 70
- Bounce rate: 40%
- Average visit: 2:05"""
COLLECTIONS = """Virgo 4-prod, 2025-07-01 to 2026-06-30; Matomo's numbers as reported; report: Virgo collection views (Virgo events)
| Collection | Visits | Item views | Kind |
| --- | --- | --- | --- |
| Hathi Trust Digital Library | 51,131 | 93,392 | HathiTrust (external) |
| Libra ETD Repository | 8,405 | 14,955 | UVA collection |
Kinds follow a provisional rule by collection name.
Visits are sessions in which an item was viewed."""
ITEMS = """Virgo 4-prod, 2025-07-01 to 2026-06-30; Matomo's numbers as reported; report: Virgo item views (Virgo events)
Top items:
| Item | Visits | Item views |
| --- | --- | --- |
| `u1` | 5 | 6 |"""
TOP_PAGES = """Library CMS, 2026-10-01 to 2026-10-31; Matomo's numbers as reported; report: pages
| Page | Pageviews | Unique pageviews | Avg time | Bounce rate |
| --- | --- | --- | --- | --- |
| /hours | 100 | 80 | 0:30 | 40% |"""
PAGE = """Library CMS, 2026-10-01 to 2026-10-31; Matomo's numbers as reported; page: /hours
- Pageviews: 12
- Unique pageviews: 10
- Average time on page: 0:10
- Entries: 2
- Exits: 3"""


def test_traffic_compare_and_single():
    b = matomo_blocks_for_step("matomo_traffic", TRAFFIC_COMPARE, 2)
    assert types(b) == ["header", "table", "data_visualization", "context"]
    bar = charts(b)[0]["chart"]
    assert bar["axis_config"]["categories"] == ["Visits", "Pageviews"]
    assert [s["name"] for s in bar["series"]] == ["2026-10-01 to 2026-…", "2026-09-01 to 2026-…"]
    assert bar["series"][0]["data"][0]["value"] == 247159.0
    s = matomo_blocks_for_step("matomo_traffic", TRAFFIC_SINGLE, 2)
    assert types(s) == ["header", "section"]
    assert [f["text"].split("\n")[0] for f in s[1]["fields"]] == ["*Visits*", "*Pageviews*", "*Site searches*",
                                                                  "*Average visit*"]


def test_collections_and_items():
    b = matomo_blocks_for_step("matomo_virgo_collections", COLLECTIONS, 2)
    assert types(b) == ["header", "data_visualization", "table", "context"]
    assert charts(b)[0]["chart"]["axis_config"]["categories"][0] == "Hathi Trust Digital…"
    i = matomo_blocks_for_step("matomo_virgo_collections", ITEMS, 2)
    assert types(i) == ["header", "table", "context"]
    assert cells(i[1])[1] == ["u1", "5", "6"]
    assert types(matomo_blocks_for_step("matomo_virgo_items", ITEMS, 2)) == ["header", "table", "context"]


def test_top_pages_and_page():
    assert types(matomo_blocks_for_step("matomo_top_pages", TOP_PAGES, 2)) == ["header", "table"]
    p = matomo_blocks_for_step("matomo_page", PAGE, 2)
    assert types(p) == ["header", "section"] and len(p[1]["fields"]) == 5


def test_non_matomo_and_error_outputs_empty():
    assert matomo_blocks_for_step("get_library_hours", TOP_PAGES, 2) == []
    assert matomo_blocks_for_step("matomo_traffic", "Error: Matomo isn't available right now.", 2) == []
    assert matomo_blocks_for_step("matomo_traffic", "", 2) == []
    assert matomo_blocks_for_step("matomo_sites", "Matomo sites (2):\n- 10: Library CMS", 2) == []


def test_blocks_are_valid_json():
    json.dumps(matomo_blocks_for_step("matomo_annual_report", annual(), 2))


def test_at_most_one_native_table():
    two = ITEMS.replace("Top items:", "| Pool | Views |\n| --- | --- |\n| Catalog | 9 |\nTop items:")
    b = matomo_blocks_for_step("matomo_virgo_items", two, 2)
    assert types(b).count("table") == 1 and "section" in types(b)
    for name, out in (("matomo_annual_report", annual()), ("matomo_traffic", TRAFFIC_COMPARE),
                      ("matomo_virgo_collections", COLLECTIONS), ("matomo_top_pages", TOP_PAGES)):
        assert types(matomo_blocks_for_step(name, out, 2)).count("table") <= 1, name
