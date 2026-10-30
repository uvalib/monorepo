"""
tool_names.py — one map between the legacy gateway's tool names
(<Old>Runtime___<tool>, 44 tools) and the uvalib-mcp gateway's consolidated ones
(Catalog___ / Collections___ / Library___ / Site___ / Transit___, 22 tools), so
renderers, citations and evals work unchanged on either.

V2 mirrors the CALLS tables in the server's tools_v2.py files; legacy_leaf mirrors
the server's routing for the routes the renderers care about.
"""

from __future__ import annotations

import re
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


# --- system prompt rendered for whichever gateway is configured ---

def prompt_tool(legacy: str, v2: bool) -> str:
    """How the prompt names a legacy tool: the legacy leaf, or the v2 leaf plus its fixed args."""
    if not v2:
        return legacy
    full, fixed = V2[legacy]
    leaf = full.split("___")[-1]
    if not fixed:
        return leaf
    return leaf + " (" + ", ".join(f'{k}="{v}"' for k, v in fixed.items()) + ")"


# Prompt phrases whose wording differs per toolset, where naming tools one by one would read
# badly on v2 (several legacy tools become one v2 tool, or the arguments changed).
# key -> (legacy text, v2 text). The legacy text is today's prompt, word for word.
PHRASES: Dict[str, Tuple[str, str]] = {
    "library_tools": (
        "get_library_hours, get_libraries, list_library_entrances, get_entrance_traffic, get_occupancy_report, "
        "get_foot_traffic, get_space_categories, list_space_items, get_space_item, search_space_availability, "
        "get_space_search_filters, list_space_seats, get_space_seat, get_equipment_categories, "
        "get_equipment_category, list_equipment_items, get_equipment_item, list_event_calendars, list_events, "
        "get_event, search_events, get_walking_directions, get_accessible_routes_map",
        "get_library_hours, get_libraries, get_traffic, find_spaces, get_space, find_equipment, get_equipment, "
        "find_events, get_event, get_directions",
    ),
    "entrances": (
        "`list_library_entrances` — lists physical doorways, entrance sensors, and camera points for a library "
        "(or all libraries if omitted).",
        "`get_libraries` — after the library list, lists physical doorways, entrance sensors, and camera points "
        "for `library` (or all libraries if blank).",
    ),
    "traffic_by_period": ("get_traffic_by_period", 'get_traffic (kind="foot", period=...)'),
    "space_window": (
        "`search_space_availability` — **preferred** when the user gives a time window (“5–8pm at Shannon”, "
        "“2pm–4pm RMC”): needs location + date + time_start + time_end.",
        "`find_spaces` with `library` + `date` + `time_start` + `time_end` (HH:MM) — **preferred** when the user "
        "gives a time window (“5–8pm at Shannon”, “2pm–4pm RMC”); add `capacity` or `filters` when asked.",
    ),
    "space_list": (
        "`list_space_items` — rooms at a location; `availability=today` for batch free slots without a fixed "
        "window; optional category / only_available",
        "`find_spaces` with `library` + `date` (\"today\", \"tomorrow\" or YYYY-MM-DD) — rooms at a library with "
        "their free slots, without a fixed window; optional `category` / `only_available`",
    ),
    "space_filters": (
        "`get_space_categories` / `get_space_search_filters` — categories and amenity filters (accessible, power)",
        "`find_spaces` with just `library` (or nothing) — categories and amenity filters (accessible, power); "
        "pass filter ids as `filters`",
    ),
    "seat_tools": (
        "Most libraries have no seats; study rooms use item tools.",
        "Most libraries have no seats; for study rooms leave `kind` at its default (\"room\").",
    ),
    "equipment_categories": (
        "`get_equipment_categories` — kinds of equipment at a location (or all public)",
        "`find_equipment` with just `library` (or nothing) — kinds of equipment at a library (or all public)",
    ),
    "equipment_list": (
        "`list_equipment_items` — list gear at a location; optional category / availability",
        "`find_equipment` with `library` + `category` — the gear in that category at that library; optional "
        "`availability` (\"today\", \"tomorrow\" or YYYY-MM-DD) / `only_available`",
    ),
    "equipment_one": (
        "`get_equipment_category` / `get_equipment_item`",
        "`find_equipment` with just `category` / `get_equipment`",
    ),
    "events_list": (
        "`list_events` — upcoming events",
        "`find_events` with no `query` — upcoming events",
    ),
    "events_search": (
        "`search_events` — keyword search",
        "`find_events` with `query` — keyword search",
    ),
    "events_calendars": (
        "`list_event_calendars` — public calendar names and calids only",
        "every `find_events` result ends with the calendar names; pass one as `calendar`",
    ),
    "accessible_walk": (
        "`get_walking_directions(..., accessible=true)` **only** — do **not** also call "
        "`get_accessible_routes_map` (that PDF legend causes vague “marked ADA path” replies)",
        "`get_directions(..., accessible=\"true\")` — it adds the accessible-routes map after the steps; answer "
        "from the steps, not the map's legend (that PDF legend causes vague “marked ADA path” replies)",
    ),
    "accessible_map": (
        "`get_accessible_routes_map`",
        "`get_directions(..., accessible=\"true\")` and share the accessible-routes map at the end of its result",
    ),
    "bus_routes": (
        "`get_bus_locations` — where buses are now and how crowded; `list_bus_routes` / `get_bus_route` — "
        "what's running and a route's stops",
        "`get_bus_routes` — what's running (`running_only=true` for only the routes running now), or with "
        "`route` (e.g. \"Gold Line\"), that route's stops plus where its buses are now and how crowded",
    ),
    "catalog_tools": (
        "search_catalog, search_by_field, get_item_details",
        "search_catalog (`field` = keyword, title, author, subject, identifier, …), get_item_details",
    ),
    "site_suggestions": (
        "search_virgo_item_suggestions, search_virgo_suggestions (authors)",
        "get_suggestions (kind=\"items\" for related catalog items, kind=\"authors\" for authors)",
    ),
    "archives_tools": (
        "search_archives, search_archives_semantic, get_archival_record",
        "search_archives (`match` = \"words\" or \"meaning\"), get_archival_record",
    ),
    "archives_two_searches": (
        "Two searches. search_archives matches words",
        "Two kinds of search. search_archives (match=\"words\", the default) matches words",
    ),
    "archives_topic": (
        "search_archives_semantic (and search_archives for any names)",
        "search_archives with match=\"meaning\" (and a word search for any names)",
    ),
    "image_paging_args": ("`page`, `count` / `max_results`", "`page`, `count`"),
    "catalog_check": ("`search_by_field` / `search_catalog`", "`search_catalog` (field=`title` or `author`)"),
    "catalog_discovery": (
        "Use `search_catalog` for broader discovery.",
        "Use the default keyword search (no `field`) for broader discovery.",
    ),
}


def prompt_phrase(key: str, v2: bool) -> str:
    """A prompt phrase in the legacy or the v2 wording."""
    return PHRASES[key][1 if v2 else 0]


_PLACEHOLDER = re.compile(r"\{\{(tool|phrase):([a-z_]+)\}\}")
_RENAMED_ARG = re.compile(r"(?<=`)(" + "|".join(RENAMED_ARGS) + r")(?=`)|\b(" + "|".join(RENAMED_ARGS) + r")(?==)")


def render_prompt(template: str, v2: bool) -> str:
    """Fill {{tool:<legacy leaf>}} and {{phrase:<key>}}; on v2 also rename legacy arguments (`location` -> `library`)."""
    text = _PLACEHOLDER.sub(
        lambda m: prompt_tool(m.group(2), v2) if m.group(1) == "tool" else prompt_phrase(m.group(2), v2), template)
    if v2:
        text = _RENAMED_ARG.sub(lambda m: RENAMED_ARGS[m.group(0)], text)
    return text
