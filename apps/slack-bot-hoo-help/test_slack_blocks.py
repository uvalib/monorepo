#!/usr/bin/env python3
"""Unit tests for hours/occupancy Block Kit builders (no Slack / Bedrock)."""

import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from slack_blocks import (
    MAX_VIZ,
    blocks_from_tool_steps,
    flatten_carousels,
    parse_foot_traffic,
    parse_hours,
    parse_image_hits,
    parse_occupancy,
    short_doorway,
    short_library,
)
from slack_format import format_for_slack

HOURS_SAMPLE = """### Hours: Clemons Library
* **Official name** (use this exact name in answers — do not invent expansions): **Clemons Library**
* **Canonical key**: `Clemons`
* **LibCal location id**: 3638
* **Date range**: 2026-09-05 to 2026-09-11
* **Source**: LibCal (published hours; no open/close buffer)
* **Time format**: 12-hour local (e.g. 1:00 PM–5:00 PM)

| Date | Day | Hours |
| :--- | :--- | :--- |
| 2026-09-05 | Sat | 9:00 AM–12:00 AM |
| 2026-09-06 | Sun | 10:00 AM–12:00 AM |
| 2026-09-07 | Mon | 8:00 AM–12:00 AM |
| 2026-09-08 | Tue | 8:00 AM–12:00 AM |
| 2026-09-09 | Wed | 8:00 AM–12:00 AM |
| 2026-09-10 | Thu | 8:00 AM–12:00 AM |
| 2026-09-11 | Fri | 8:00 AM–12:00 AM |

**Summary**: 7 open day(s), 0 closed day(s).
"""

HOURS_CLOSED = """### Hours: Fine Arts Library
* **Official name** (use this exact name in answers — do not invent expansions): **Fine Arts Library**
* **Canonical key**: `Fine Arts`

| Date | Day | Hours |
| :--- | :--- | :--- |
| 2026-07-25 | Sat | Closed |
| 2026-07-26 | Sun | Closed |

**Summary**: 0 open day(s), 2 closed day(s).
"""

OCCUPANCY_SAMPLE = """# Occupancy Report: Clemons (2026-08-25 to 2026-08-31)
Total for building over the period: in 9206, out 9980, combined 19186
Average daily: in 1315.14, out 1425.71, combined 2740.86, avg occupancy 35.84
Coverage summary:
  Open days included: 7 out of 7 days in range
Data quality summary:
  Confidence rating: High
Peak day:
  2026-08-30: in 1781, out 2096, avg occupancy 30.98
Peak hour (single day/hour segment):
  2026-08-30 Hour 15: in 303, out 303, avg occupancy 95.22
Average hourly:
  Hour 00: in 1.67, out 8.67, avg occupancy 0.00
  Hour 08: in 25.50, out 17.33, avg occupancy 5.69
  Hour 09: in 42.00, out 27.71, avg occupancy 13.59
  Hour 10: in 79.43, out 49.57, avg occupancy 39.05
  Hour 12: in 140.00, out 127.43, avg occupancy 77.47
  Hour 15: in 170.00, out 180.71, avg occupancy 80.34
  Hour 23: in 9.43, out 27.71, avg occupancy 0.00
Entrance & doorway breakdown (ingress / egress by access point):
| Entrance / Point | In (Entries) | Out (Exits) | Combined | % of Total |
| :--- | :--- | :--- | :--- | :--- |
| 001A- 4th Floor - Main Entrance Camera 1 | 2,456 | 5,345 | 7,801 | 40.4% |
| FiskeKimball-B8A44F4F195D | 1,656 | 2,228 | 3,884 | 20.1% |
| 001B - 4th Fl - Main Entrance Camera 2 | 1,822 | 1,224 | 3,046 | 15.8% |
| 001C - 4th Fl - Main Entrance Camera 3 | 2,325 | 457 | 2,782 | 14.4% |
| 001D - 4th Floor - Main Entrance Camera 4 | 754 | 407 | 1,161 | 6.0% |
| C113A staff Clemons connector corridor Clemons side | 112 | 105 | 217 | 1.1% |
| 004 - 3rd Floor - Emergency Exit | 16 | 125 | 141 | 0.7% |
| Axis-B8A44F07125E | 75 | 55 | 130 | 0.7% |

Average occupancy over the period: 35.84
"""

FOOT_SAMPLE = """### Foot Traffic Summary: Shannon
* **Date Range**: 2026-08-25 to 2026-08-31
* **Total Entries ("In" Traffic)**: 12,137
* **Total Exits ("Out" Traffic)**: 7,932
* **Total Combined Activity**: 20,069
* **Average Daily Entries**: 1,733.86
"""


class _Step:
    def __init__(self, tool_name, output, status="success"):
        self.tool_name = tool_name
        self.output = output
        self.status = status


def _types(blocks):
    return [b.get("type") for b in blocks]


def test_parse_hours():
    h = parse_hours(HOURS_SAMPLE)
    assert h is not None
    assert h.official_name == "Clemons Library"
    assert len(h.rows) == 7
    assert h.rows[0] == ("2026-09-05", "Sat", "9:00 AM–12:00 AM")
    closed = parse_hours(HOURS_CLOSED)
    assert closed is not None
    assert closed.rows[0][2] == "Closed"
    assert parse_hours("Error: Library 'RMC' not found.") is None


def test_parse_occupancy():
    r = parse_occupancy(OCCUPANCY_SAMPLE)
    assert r is not None
    assert r.library == "Clemons"
    assert r.start_date == "2026-08-25"
    assert r.total_in == 9206
    assert r.total_combined == 19186
    assert r.avg_occupancy == 35.84
    assert r.confidence == "High"
    assert r.peak_day == "2026-08-30"
    assert r.peak_hour == 15
    assert len(r.hourly) == 7
    assert r.hourly[4].hour == 12
    assert r.hourly[4].occupancy == 77.47
    assert len(r.doorways) == 8
    assert r.doorways[0].combined == 7801
    assert r.doorways[0].pct == 40.4


def test_parse_foot_traffic():
    ft = parse_foot_traffic(FOOT_SAMPLE)
    assert ft is not None
    assert ft.library == "Shannon"
    assert ft.entries == 12137
    assert ft.avg_daily_entries == 1733.86


def test_hours_blocks_from_steps():
    blocks = blocks_from_tool_steps(
        [_Step("OccupancyReportingRuntime___get_library_hours", HOURS_SAMPLE)]
    )
    types = _types(blocks)
    assert "header" in types
    assert "table" in types
    table = next(b for b in blocks if b["type"] == "table")
    assert len(table["rows"]) == 8  # header + 7 days
    assert table["rows"][1][0]["text"] == "2026-09-05"
    assert table["rows"][-1][2]["text"] == "8:00 AM–12:00 AM"
    for cs in table.get("column_settings") or []:
        assert isinstance(cs, dict), cs


def test_occupancy_charts_and_tables():
    blocks = blocks_from_tool_steps(
        [_Step("OccupancyReportingRuntime___get_occupancy_report", OCCUPANCY_SAMPLE)]
    )
    types = _types(blocks)
    viz = [b for b in blocks if b["type"] == "data_visualization"]
    tables = [b for b in blocks if b["type"] == "table"]
    assert types[0] == "header"
    assert "Clemons occupancy" in blocks[0]["text"]["text"]
    assert len(viz) == 2
    assert viz[0]["chart"]["type"] == "line"
    assert viz[1]["chart"]["type"] == "pie"
    assert len(viz[0]["chart"]["series"][0]["data"]) == 7
    assert all(len(p["label"]) <= 20 for p in viz[0]["chart"]["series"][0]["data"])
    pie_labels = [s["label"] for s in viz[1]["chart"]["segments"]]
    assert "Other" in pie_labels
    assert any(lab.startswith("001A") for lab in pie_labels)
    assert all(len(lab) <= 20 for lab in pie_labels)
    assert not any("…" in lab for lab in pie_labels if lab != "Other")
    assert len(tables) == 1  # doorway only — hourly pattern is the chart
    door = tables[0]
    assert door["rows"][1][1]["type"] == "raw_text"
    assert door["rows"][1][1]["text"]  # In column filled
    assert "Coverage summary" not in str(blocks)
    fields = next(b for b in blocks if b.get("fields"))
    assert any("9,206" in f["text"] for f in fields["fields"])


SHANNON_ZERO_OCC = """# Occupancy Report: Shannon (2026-09-04 to 2026-09-04)
Total for building over the period: in 899, out 672, combined 1571
Average daily: in 899.00, out 672.00, combined 1571.00, avg occupancy 0.00
Data quality summary:
  Confidence rating: Low
Peak day:
  2026-09-04: in 899, out 672, avg occupancy 0.00
Peak hour (single day/hour segment):
  2026-09-04 Hour 10: in 158, out 80, avg occupancy 0.00
Average hourly:
  Hour 07: in 5.00, out 9.00, avg occupancy 0.00
  Hour 08: in 45.00, out 23.00, avg occupancy 0.00
  Hour 09: in 86.00, out 29.00, avg occupancy 0.00
  Hour 10: in 158.00, out 80.00, avg occupancy 0.00
  Hour 11: in 226.00, out 98.00, avg occupancy 0.08
  Hour 12: in 188.00, out 130.00, avg occupancy 0.04
  Hour 13: in 156.00, out 107.00, avg occupancy 0.10
  Hour 14: in 35.00, out 20.00, avg occupancy 0.06
Entrance & doorway breakdown (ingress / egress by access point):
| Entrance / Point | In (Entries) | Out (Exits) | Combined | % of Total |
| :--- | :--- | :--- | :--- | :--- |
| 401 east entrance | 602 | 340 | 942 | 51.5% |
| 401 west entrance | 210 | 301 | 511 | 27.9% |

Average occupancy over the period: 0.00
"""


def test_near_zero_occupancy_uses_entries_chart():
    """Don't plot a 0–0.08 'occupancy' line when the building clearly had traffic."""
    blocks = blocks_from_tool_steps(
        [_Step("get_occupancy_report", SHANNON_ZERO_OCC)]
    )
    takeaway = next(b for b in blocks if b.get("type") == "section" and b.get("text"))
    assert "899" in takeaway["text"]["text"]
    assert "avg occupancy" not in takeaway["text"]["text"].lower()
    fields = next(b for b in blocks if b.get("fields"))
    field_blob = " ".join(f["text"] for f in fields["fields"])
    assert "899" in field_blob
    assert "Avg occupancy" not in field_blob
    viz = [b for b in blocks if b["type"] == "data_visualization"]
    assert viz[0]["chart"]["type"] == "bar"
    assert "entries" in str(viz[0].get("title", "")).lower()
    ctx = next(b for b in blocks if b.get("type") == "context")
    assert "omitted" in ctx["elements"][0]["text"].lower()


def test_occupancy_viz_cap_on_compare():
    shannon = OCCUPANCY_SAMPLE.replace("Clemons", "Shannon").replace("9206", "12137")
    blocks = blocks_from_tool_steps(
        [
            _Step("get_occupancy_report", OCCUPANCY_SAMPLE),
            _Step("get_occupancy_report", shannon),
        ]
    )
    viz = [b for b in blocks if b["type"] == "data_visualization"]
    assert len(viz) <= MAX_VIZ
    assert viz[0]["chart"]["type"] == "bar"
    table = next(b for b in blocks if b["type"] == "table")
    assert len(table["rows"]) == 3  # header + 2 libraries


def test_skip_error_and_foot_when_occupancy_present():
    blocks = blocks_from_tool_steps(
        [
            _Step("get_library_hours", "Error: Library 'Nope' not found."),
            _Step("get_occupancy_report", OCCUPANCY_SAMPLE),
            _Step("get_foot_traffic", FOOT_SAMPLE),
        ]
    )
    headers = [b["text"]["text"] for b in blocks if b.get("type") == "header"]
    assert any("occupancy" in h.lower() for h in headers)
    assert not any("hours" in h.lower() for h in headers)
    assert not any("foot traffic" in h.lower() for h in headers)


def test_foot_traffic_only():
    blocks = blocks_from_tool_steps([_Step("get_foot_traffic", FOOT_SAMPLE)])
    assert any(b.get("type") == "header" for b in blocks)
    fields = next(b for b in blocks if b.get("fields"))
    assert any("12,137" in f["text"] for f in fields["fields"])


def test_occupancy_replaces_llm_dump():
    dump = (
        "Occupancy Report for Clemons Library\n"
        "Coverage summary:\nOpen days included: 6 out of 7\n"
        "Average hourly:\n  Hour 08: in 25\n"
    )
    text, blocks = format_for_slack(
        dump,
        use_llm=False,
        tool_steps=[_Step("get_occupancy_report", OCCUPANCY_SAMPLE)],
    )
    assert "Coverage summary" not in text
    assert "Average hourly" not in text
    blob = str(blocks)
    assert "Coverage summary" not in blob
    assert any(b.get("type") == "data_visualization" for b in blocks)
    assert "avg occupancy" in text.lower() or "8,356" in text or "9,206" in text


def test_format_for_slack_attaches_hours_table():
    text, blocks = format_for_slack(
        "*Clemons Library* is open all week.",
        use_llm=False,
        tool_steps=[_Step("get_library_hours", HOURS_SAMPLE)],
    )
    assert "Clemons" in text
    assert "9:00 AM–12:00 AM" in text
    assert any(b.get("type") == "table" for b in blocks)
    assert not any(b.get("type") == "section" for b in blocks)
    table = next(b for b in blocks if b.get("type") == "table")
    assert None not in (table.get("column_settings") or [])


IMAGE_TOOL_SAMPLE = """# Knowledge Base Retrieval Results
**Query**: `Rotunda snow`
Found **2** image hit(s):

## Image 1: Rotunda in snow
- **Title**: Rotunda in snow
- **Collection**: University of Virginia Visual History Collection
- **Image URL**: https://iiif.lib.virginia.edu/iiif/uva-lib:2167141/full/!800,800/0/default.jpg
- **Virgo page**: https://search.lib.virginia.edu/sources/images/items/uva-lib:2167141

## Image 2: Lawn snow
- **Title**: Lawn snow
- **Collection**: Visual History Collection
- **Image URL**: https://iiif.lib.virginia.edu/iiif/uva-lib:2167143/full/!800,800/0/default.jpg
- **Virgo page**: https://search.lib.virginia.edu/sources/images/items/uva-lib:2167143
"""


def test_image_carousel_from_tool():
    hits = parse_image_hits(IMAGE_TOOL_SAMPLE)
    assert len(hits) == 2
    assert hits[0]["title"] == "Rotunda in snow"
    assert "uva-lib:2167141" in hits[0]["image_url"]
    blocks = blocks_from_tool_steps(
        [_Step("BedrockKBRuntime___search_virgo_image_suggestions", IMAGE_TOOL_SAMPLE)]
    )
    assert blocks[0]["type"] == "carousel"
    assert len(blocks[0]["elements"]) == 2
    card = blocks[0]["elements"][0]
    assert card["hero_image"]["image_url"].startswith("https://iiif.")
    assert card["actions"][0]["url"].startswith("https://search.lib.virginia.edu")
    flat = flatten_carousels(blocks)
    assert any(b.get("type") == "image" for b in flat)
    assert not any(b.get("type") == "carousel" for b in flat)


def test_image_uses_first_page_with_new_hits():
    page3 = IMAGE_TOOL_SAMPLE
    page4 = IMAGE_TOOL_SAMPLE.replace("2167141", "2169999").replace(
        "2167143", "2168888"
    ).replace("Rotunda in snow", "Later page").replace("Lawn snow", "Even later")
    blocks = blocks_from_tool_steps(
        [
            _Step("search_virgo_image_suggestions", page3),
            _Step("search_virgo_image_suggestions", page4),
        ]
    )
    urls = json.dumps(blocks)
    assert "2167141" in urls
    assert "2169999" not in urls


def test_image_excludes_already_shown():
    shown = "https://iiif.lib.virginia.edu/iiif/uva-lib:2167141/full/!800,800/0/default.jpg"
    blocks = blocks_from_tool_steps(
        [_Step("BedrockKBRuntime___search_virgo_image_suggestions", IMAGE_TOOL_SAMPLE)],
        exclude_image_urls=[shown],
    )
    assert blocks[0]["type"] == "card"
    assert "2167143" in blocks[0]["hero_image"]["image_url"]
    assert "2167141" not in blocks[0]["hero_image"]["image_url"]


def test_image_answer_not_duplicated():
    listing = (
        "Here are photos of the Rotunda in the snow:\n\n"
        "*Rotunda in snow*\n"
        "Image URL: https://iiif.lib.virginia.edu/iiif/uva-lib:2167141/full/!800,800/0/default.jpg\n"
        "Virgo: https://search.lib.virginia.edu/sources/images/items/uva-lib:2167141\n"
    )
    text, blocks = format_for_slack(
        listing,
        use_llm=False,
        tool_steps=[
            _Step("BedrockKBRuntime___search_virgo_image_suggestions", IMAGE_TOOL_SAMPLE)
        ],
    )
    assert "iiif.lib.virginia.edu" not in text
    types = [b.get("type") for b in blocks]
    assert "carousel" in types
    assert "image" not in types
    assert types.count("carousel") == 1


def test_short_library():
    assert short_library("Science & Engineering") == "SEL"
    assert short_library("Clemons Library") == "Clemons"
    assert short_doorway("001A- 4th Floor - Main Entrance Camera 1") == "001A 4th Main"
    assert short_doorway("FiskeKimball-B8A44F4F195D") == "FiskeKimball"
    assert len(short_doorway("C113A staff Clemons connector corridor Clemons side")) <= 20


def main():
    tests = [
        test_parse_hours,
        test_parse_occupancy,
        test_parse_foot_traffic,
        test_hours_blocks_from_steps,
        test_occupancy_charts_and_tables,
        test_near_zero_occupancy_uses_entries_chart,
        test_occupancy_replaces_llm_dump,
        test_occupancy_viz_cap_on_compare,
        test_skip_error_and_foot_when_occupancy_present,
        test_foot_traffic_only,
        test_format_for_slack_attaches_hours_table,
        test_image_carousel_from_tool,
        test_image_uses_first_page_with_new_hits,
        test_image_excludes_already_shown,
        test_image_answer_not_duplicated,
        test_short_library,
    ]
    for fn in tests:
        fn()
        print(f"ok  {fn.__name__}")
    print(f"\n{len(tests)} tests passed")


if __name__ == "__main__":
    main()
