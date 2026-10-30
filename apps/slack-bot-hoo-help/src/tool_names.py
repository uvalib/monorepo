"""
tool_names.py — one map between the legacy gateway's tool names
(<Old>Runtime___<tool>, 44 tools) and the uvalib-mcp gateway's consolidated ones
(Catalog___ / Collections___ / Library___ / Site___ / Transit___, 22 tools), so
renderers, citations and evals work unchanged on either.

V2 mirrors the CALLS tables in the server's tools_v2.py files; legacy_leaf mirrors
the server's routing for the routes the renderers care about.
"""

from __future__ import annotations

from typing import Dict, Iterable, Optional, Tuple

_LIB = "Library___"

# legacy leaf -> (v2 full name, fixed arguments). retrieve_knowledge_base has no v2 tool.
V2: Dict[str, Tuple[str, dict]] = {
    # Library
    "get_libraries": (_LIB + "get_libraries", {}),
    "list_library_entrances": (_LIB + "get_libraries", {}),
    "get_library_hours": (_LIB + "get_library_hours", {}),
    "get_foot_traffic": (_LIB + "get_traffic", {"kind": "foot"}),
    "get_traffic_by_period": (_LIB + "get_traffic", {"kind": "foot"}),
    "get_occupancy_report": (_LIB + "get_traffic", {"kind": "occupancy"}),
    "get_entrance_traffic": (_LIB + "get_traffic", {"kind": "entrance"}),
    "get_space_categories": (_LIB + "find_spaces", {}),
    "search_space_availability": (_LIB + "find_spaces", {}),
    "list_space_items": (_LIB + "find_spaces", {}),
    "get_space_search_filters": (_LIB + "find_spaces", {}),
    "list_space_seats": (_LIB + "find_spaces", {"kind": "seat"}),
    "get_space_item": (_LIB + "get_space", {}),
    "get_space_seat": (_LIB + "get_space", {"kind": "seat"}),
    "get_equipment_categories": (_LIB + "find_equipment", {}),
    "get_equipment_category": (_LIB + "find_equipment", {}),
    "list_equipment_items": (_LIB + "find_equipment", {}),
    "get_equipment_item": (_LIB + "get_equipment", {}),
    "search_events": (_LIB + "find_events", {}),
    "list_events": (_LIB + "find_events", {}),
    "list_event_calendars": (_LIB + "find_events", {}),
    "get_event": (_LIB + "get_event", {}),
    "get_walking_directions": (_LIB + "get_directions", {}),
    "get_accessible_routes_map": (_LIB + "get_directions", {"accessible": "true"}),
    # Catalog
    "search_catalog": ("Catalog___search_catalog", {}),
    "search_by_field": ("Catalog___search_catalog", {}),
    "search_images": ("Catalog___search_catalog", {"source": "images"}),
    "get_item_details": ("Catalog___get_item_details", {}),
    "get_citations": ("Catalog___get_citations", {}),
    "list_image_collections": ("Catalog___list_image_collections", {}),
    # Collections
    "search_archives": ("Collections___search_archives", {}),
    "search_archives_semantic": ("Collections___search_archives", {"match": "meaning"}),
    "get_archival_record": ("Collections___get_archival_record", {}),
    # Site
    "search_uvalib_web": ("Site___search_site", {}),
    "search_virgo_item_suggestions": ("Site___get_suggestions", {"kind": "items"}),
    "search_virgo_suggestions": ("Site___get_suggestions", {"kind": "authors"}),
    "search_virgo_image_suggestions": ("Site___get_suggestions", {"kind": "images"}),
    # Transit
    "find_bus_trip": ("Transit___find_bus_trip", {}),
    "find_bus_stops": ("Transit___find_bus_stops", {}),
    "get_next_buses": ("Transit___get_next_buses", {}),
    "list_bus_routes": ("Transit___get_bus_routes", {}),
    "get_bus_route": ("Transit___get_bus_routes", {}),
    "get_bus_locations": ("Transit___get_bus_routes", {}),
}

# legacy argument -> v2 argument (Library tools only)
RENAMED_ARGS: Dict[str, str] = {"location": "library"}

_OLD_BY_NEW = {
    "Library": "OccupancyReportingRuntime",
    "Catalog": "VirgoCatalogRuntime",
    "Collections": "ArchivesSpaceRuntime",
    "Site": "BedrockKBRuntime",
    "Transit": "UVATransitRuntime",
}

# legacy leaf -> legacy target ("<Old>Runtime"); find_bus_trip / get_walking_directions live on one server each
OLD_TARGET: Dict[str, str] = {leaf: _OLD_BY_NEW[name.split("___")[0]] for leaf, (name, _) in V2.items()}
OLD_TARGET["retrieve_knowledge_base"] = "BedrockKBRuntime"

V2_PREFIXES = tuple(f"{p}___" for p in _OLD_BY_NEW)
_NOT_GATEWAY = ("GitHub___", "Slack___")  # local tool sets named like gateway tools
_SEARCH_TOOL = "x_amz_bedrock_agentcore_search"  # the gateway's own search tool


def is_v2_toolset(tool_names: Iterable[str]) -> bool:
    """True when the gateway's tools are the uvalib-mcp ones: at least one, and none from a legacy target.

    Local tools (no "___", GitHub___, Slack___) and the gateway search tool don't count either way."""
    seen = False
    for name in tool_names or []:
        if not isinstance(name, str) or "___" not in name or name.startswith(_NOT_GATEWAY) or name == _SEARCH_TOOL:
            continue
        if not name.startswith(V2_PREFIXES):
            return False
        seen = True
    return seen


def is_catalog_tool(name: str) -> bool:
    """True for a Virgo catalog tool on either gateway (VirgoCatalogRuntime___* or Catalog___*)."""
    name = name or ""
    return name.startswith("VirgoCatalogRuntime") or name.startswith("Catalog___")


def legacy_leaf(tool_name: str, tool_input: Optional[dict] = None) -> str:
    """The legacy tool name's leaf; for v2 names, the legacy leaf the server would have routed the call to."""
    leaf = (tool_name or "").split("___")[-1].strip()
    if not tool_name or not tool_name.startswith(V2_PREFIXES):
        return leaf
    args = tool_input if isinstance(tool_input, dict) else {}
    if leaf == "get_traffic":
        kind = args.get("kind") or "occupancy"
        if kind == "foot":
            return "get_traffic_by_period" if args.get("period") else "get_foot_traffic"
        return "get_entrance_traffic" if kind == "entrance" else "get_occupancy_report"
    if leaf == "find_spaces":
        if args.get("kind") == "seat":
            return "list_space_seats"
        if not args.get("library") or not any(
                args.get(k) for k in ("category", "date", "time_start", "time_end", "capacity", "filters")):
            return "get_space_categories"
        if any(args.get(k) for k in ("time_start", "time_end", "capacity", "filters")):
            return "search_space_availability"
        return "list_space_items"
    if leaf == "get_space":
        return "get_space_seat" if args.get("kind") == "seat" else "get_space_item"
    if leaf == "find_equipment":
        if not args.get("category"):
            return "get_equipment_categories"
        return "list_equipment_items" if args.get("library") else "get_equipment_category"
    if leaf == "search_catalog":
        if args.get("source") == "images":
            return "search_images"
        return "search_by_field" if (args.get("field") or "keyword") != "keyword" else "search_catalog"
    if leaf == "find_events":
        return "search_events" if args.get("query") else "list_events"
    if leaf == "get_bus_routes":
        return "get_bus_route" if str(args.get("route") or "").strip() else "list_bus_routes"
    if leaf == "search_archives":
        return "search_archives_semantic" if args.get("match") == "meaning" else "search_archives"
    if leaf == "get_suggestions":
        return {"authors": "search_virgo_suggestions", "images": "search_virgo_image_suggestions"}.get(
            args.get("kind") or "items", "search_virgo_item_suggestions")
    if leaf == "search_site":
        return "search_uvalib_web"
    return leaf


def gateway_name(legacy: str, v2: bool) -> str:
    """Full gateway name for a legacy leaf on the v2 or the legacy gateway."""
    if v2:
        return V2[legacy][0]
    return f"{OLD_TARGET[legacy]}___{legacy}"
