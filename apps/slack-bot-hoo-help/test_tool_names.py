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


# legacy leaves legacy_leaf routes to (the rest map to a v2 tool of the same leaf, or have no renderer)
ROUTED = {
    "get_foot_traffic", "get_traffic_by_period", "get_occupancy_report", "get_entrance_traffic",
    "search_catalog", "search_by_field", "search_images", "search_events", "list_events",
    "get_bus_route", "list_bus_routes", "search_archives", "search_archives_semantic",
    "search_virgo_item_suggestions", "search_virgo_suggestions", "search_virgo_image_suggestions",
    "search_uvalib_web",
}

ROUTED_V2 = {"get_traffic", "search_catalog", "find_events", "get_bus_routes", "search_archives",
             "get_suggestions", "search_site"}


def test_round_trip():
    for leaf, (name, fixed) in V2.items():
        args = dict(fixed)
        if leaf == "get_traffic_by_period":
            args["period"] = "week"  # the period is a call argument, not a fixed one
        if leaf in ("search_events",):
            args["query"] = "poetry"
        if leaf == "get_bus_route":
            args["route"] = "Gold Line"
        if leaf == "search_by_field":
            args["field"] = "title"
        if leaf in ROUTED:
            assert legacy_leaf(name, args) == leaf, leaf
        elif name.split("___")[-1] not in ROUTED_V2:  # e.g. list_event_calendars rides along with find_events
            assert legacy_leaf(name, args) == name.split("___")[-1], leaf


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
