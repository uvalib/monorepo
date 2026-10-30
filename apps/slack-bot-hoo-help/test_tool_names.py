#!/usr/bin/env python3
"""Tool-name map between the legacy <Old>Runtime___ gateway and the uvalib-mcp gateway."""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

import pytest

from slack_blocks import blocks_from_tool_steps, image_hit_titles, tool_fallback_text
from spreadsheet import tables_from_steps
from test_slack_blocks import FOOT_SAMPLE, HOURS_SAMPLE, IMAGE_TOOL_SAMPLE, OCCUPANCY_SAMPLE
from test_spreadsheet import ENTRANCE_OUTPUT, PERIOD_OUTPUT
from tool_names import OLD_TARGET, RENAMED_ARGS, V2, gateway_name, is_v2_toolset, legacy_leaf

V2_TOOLS = {
    "Catalog___search_catalog", "Catalog___get_item_details", "Catalog___get_citations",
    "Catalog___list_image_collections",
    "Collections___search_archives", "Collections___get_archival_record",
    "Library___get_libraries", "Library___get_library_hours", "Library___find_spaces", "Library___get_space",
    "Library___find_equipment", "Library___get_equipment", "Library___find_events", "Library___get_event",
    "Library___get_traffic", "Library___get_directions",
    "Site___search_site", "Site___get_suggestions",
    "Transit___find_bus_trip", "Transit___find_bus_stops", "Transit___get_next_buses", "Transit___get_bus_routes",
}


def test_every_legacy_tool_mapped():
    assert len(V2) == 43
    assert "retrieve_knowledge_base" not in V2
    assert V2["get_foot_traffic"] == ("Library___get_traffic", {"kind": "foot"})
    assert V2["search_images"] == ("Catalog___search_catalog", {"source": "images"})
    assert V2["search_by_field"] == ("Catalog___search_catalog", {})
    assert V2["list_bus_routes"] == ("Transit___get_bus_routes", {})
    assert RENAMED_ARGS == {"location": "library"}


def test_v2_names_exist():
    assert len(V2_TOOLS) == 22
    assert {name for name, _ in V2.values()} <= V2_TOOLS
    assert set(V2) <= set(OLD_TARGET)


def test_legacy_leaf_routes():
    assert legacy_leaf("Library___get_traffic", {"kind": "foot"}) == "get_foot_traffic"
    assert legacy_leaf("Library___get_traffic", {"kind": "foot", "period": "week"}) == "get_traffic_by_period"
    assert legacy_leaf("Library___get_traffic", {}) == "get_occupancy_report"
    assert legacy_leaf("Library___get_traffic", {"kind": "occupancy"}) == "get_occupancy_report"
    assert legacy_leaf("Library___get_traffic", {"kind": "entrance"}) == "get_entrance_traffic"
    assert legacy_leaf("Catalog___search_catalog", {"source": "images"}) == "search_images"
    assert legacy_leaf("Catalog___search_catalog", {"field": "title"}) == "search_by_field"
    assert legacy_leaf("Catalog___search_catalog", {"field": "keyword", "query": "x"}) == "search_catalog"
    assert legacy_leaf("Catalog___search_catalog", None) == "search_catalog"
    assert legacy_leaf("Library___find_events", {"query": "poetry"}) == "search_events"
    assert legacy_leaf("Library___find_events", {}) == "list_events"
    assert legacy_leaf("Transit___get_bus_routes", {"route": "Gold Line"}) == "get_bus_route"
    assert legacy_leaf("Transit___get_bus_routes", {}) == "list_bus_routes"
    assert legacy_leaf("Collections___search_archives", {"match": "meaning"}) == "search_archives_semantic"
    assert legacy_leaf("Collections___search_archives", {}) == "search_archives"
    assert legacy_leaf("Site___get_suggestions", {}) == "search_virgo_item_suggestions"
    assert legacy_leaf("Site___get_suggestions", {"kind": "authors"}) == "search_virgo_suggestions"
    assert legacy_leaf("Site___get_suggestions", {"kind": "images"}) == "search_virgo_image_suggestions"
    assert legacy_leaf("Site___search_site", {}) == "search_uvalib_web"
    assert legacy_leaf("Library___get_library_hours", {}) == "get_library_hours"
    assert legacy_leaf("OccupancyReportingRuntime___get_foot_traffic", {}) == "get_foot_traffic"
    assert legacy_leaf("get_foot_traffic") == "get_foot_traffic"
    assert legacy_leaf("") == ""


ROUTED_V2 = {"get_traffic", "search_catalog", "find_events", "get_bus_routes", "search_archives", "get_suggestions",
             "search_site", "find_spaces", "get_space", "find_equipment"}

# arguments (beyond the fixed ones) that make a call route to each legacy leaf, as the server routes it
CALL_ARGS = {
    "get_traffic_by_period": {"period": "week"},
    "search_events": {"query": "poetry"},
    "get_bus_route": {"route": "Gold Line"},
    "search_by_field": {"field": "title"},
    "get_space_categories": {},
    "search_space_availability": {"library": "Clemons", "capacity": 4},
    "list_space_items": {"library": "Shannon", "category": "Study rooms"},
    "get_space_search_filters": None,  # rides along with get_space_categories
    "list_space_seats": {},
    "get_space_item": {}, "get_space_seat": {},
    "get_equipment_categories": {},
    "get_equipment_category": {"category": "Laptops"},
    "list_equipment_items": {"category": "Laptops", "library": "Clemons"},
    "list_event_calendars": None,  # rides along with find_events
    "get_bus_locations": None,  # rides along with get_bus_route
}
RIDES_ALONG = {leaf for leaf, args in CALL_ARGS.items() if args is None}


def test_round_trip():
    for leaf, (name, fixed) in V2.items():
        if leaf in RIDES_ALONG:
            continue
        args = {**fixed, **CALL_ARGS.get(leaf, {})}
        v2_leaf = name.split("___")[-1]
        expected = leaf if v2_leaf in ROUTED_V2 else v2_leaf  # a routed v2 tool must give back this legacy leaf
        assert legacy_leaf(name, args) == expected, leaf
    assert RIDES_ALONG == {"get_space_search_filters", "list_event_calendars", "get_bus_locations"}


def test_is_v2_toolset_mixed_is_legacy():
    assert not is_v2_toolset(["Catalog___search_catalog", "VirgoCatalogRuntime___search_images"])
    assert is_v2_toolset(["Catalog___search_catalog", "Library___get_traffic", "GitHub___search_code",
                          "x_amz_bedrock_agentcore_search"])
    assert is_v2_toolset(["x_amz_bedrock_agentcore_search", "Site___search_site", "Slack___x", "search_slack"])
    assert not is_v2_toolset([])
    assert not is_v2_toolset(["x_amz_bedrock_agentcore_search", "GitHub___search_code", "search_slack"])
    assert not is_v2_toolset(["OccupancyReportingRuntime___get_foot_traffic"])


def test_gateway_name():
    assert gateway_name("get_citations", True) == "Catalog___get_citations"
    assert gateway_name("get_citations", False) == "VirgoCatalogRuntime___get_citations"
    assert gateway_name("get_foot_traffic", False) == "OccupancyReportingRuntime___get_foot_traffic"
    assert gateway_name("search_archives", False) == "ArchivesSpaceRuntime___search_archives"
    assert gateway_name("search_uvalib_web", False) == "BedrockKBRuntime___search_uvalib_web"
    assert gateway_name("find_bus_trip", False) == "UVATransitRuntime___find_bus_trip"
    assert gateway_name("get_foot_traffic", True) == "Library___get_traffic"


class _Step:
    def __init__(self, tool_name, output, input=None, status="success"):
        self.tool_name = tool_name
        self.output = output
        self.input = input or {}
        self.status = status


def _v2(leaf, output, extra=None):
    name, fixed = V2[leaf]
    return _Step(name, output, {**fixed, **(extra or {})})


def _legacy(leaf, output):
    return _Step(OLD_TARGET[leaf] + "___" + leaf, output)


CASES = [
    ("get_library_hours", HOURS_SAMPLE, None),
    ("get_occupancy_report", OCCUPANCY_SAMPLE, None),
    ("get_foot_traffic", FOOT_SAMPLE, None),
    ("search_virgo_image_suggestions", IMAGE_TOOL_SAMPLE, None),
    ("search_images", IMAGE_TOOL_SAMPLE, None),
    ("get_traffic_by_period", PERIOD_OUTPUT, {"period": "day"}),
    ("get_entrance_traffic", ENTRANCE_OUTPUT, None),
]


@pytest.mark.parametrize("leaf,output,extra", CASES)
def test_renderers_same_on_v2(leaf, output, extra):
    old = [_legacy(leaf, output)]
    new = [_v2(leaf, output, extra)]
    assert blocks_from_tool_steps(new) == blocks_from_tool_steps(old)
    assert tool_fallback_text(new) == tool_fallback_text(old)
    assert image_hit_titles(new) == image_hit_titles(old)
    assert tables_from_steps(new) == tables_from_steps(old)
    if leaf in ("get_library_hours", "get_occupancy_report", "get_foot_traffic", "search_images",
                "search_virgo_image_suggestions"):
        assert blocks_from_tool_steps(new)  # not vacuous
    if leaf in ("get_traffic_by_period", "get_entrance_traffic"):
        assert tables_from_steps(new)


def test_rooms_eval_cases_pass_on_v2():
    import json
    import glob
    from evals import checks
    for path in glob.glob(os.path.join(os.path.dirname(__file__), "evals", "cases", "*rooms-shannon*.json")):
        wanted = json.load(open(path))["live"]["tools_any"]
        for call in ({"library": "Shannon", "category": "Study rooms", "date": "2026-10-30"},
                     {"library": "Shannon", "time_start": "17:00", "time_end": "20:00", "capacity": 6}):
            assert checks.tools_any([("Library___find_spaces", call)], wanted) == [], (path, call)


def test_find_spaces_equipment_and_space_routes():
    assert legacy_leaf("Library___find_spaces", {}) == "get_space_categories"
    assert legacy_leaf("Library___find_spaces", {"library": "Shannon"}) == "get_space_categories"
    assert legacy_leaf("Library___find_spaces", {"category": "x"}) == "get_space_categories"  # no library
    assert legacy_leaf("Library___find_spaces", {"library": "Shannon", "kind": "seat"}) == "list_space_seats"
    assert legacy_leaf("Library___find_spaces", {"library": "S", "filters": "a"}) == "search_space_availability"
    assert legacy_leaf("Library___find_spaces", {"library": "S", "date": "today"}) == "list_space_items"
    assert legacy_leaf("Library___get_space", {"kind": "seat"}) == "get_space_seat"
    assert legacy_leaf("Library___get_space", {}) == "get_space_item"
    assert legacy_leaf("Library___find_equipment", {}) == "get_equipment_categories"
    assert legacy_leaf("Library___find_equipment", {"category": "c"}) == "get_equipment_category"
    assert legacy_leaf("Library___find_equipment", {"category": "c", "library": "l"}) == "list_equipment_items"


def test_is_catalog_tool():
    from tool_names import is_catalog_tool
    assert is_catalog_tool("VirgoCatalogRuntime___search_catalog") and is_catalog_tool("Catalog___search_catalog")
    assert not is_catalog_tool("Collections___search_archives") and not is_catalog_tool("") and not is_catalog_tool(None)
