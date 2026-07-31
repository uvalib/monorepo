# main.py — AgentCore entrypoint for the Occupancy Reporting MCP server
# FastMCP streamable-http on 0.0.0.0:8000/mcp as required by AgentCore Runtime.

import logging
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from mcp.server.fastmcp import FastMCP
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
import db_helper as db
import processing as proc
import report_generator as rep
import camera_quirks
import hours_helper as hours
import spaces_helper as spaces
import equipment_helper as equipment

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("OccupancyReporting")

# json_response=True returns application/json instead of SSE, which is more
# reliable behind AgentCore's InvokeAgentRuntime / Gateway proxies.
mcp = FastMCP(
    "OccupancyReporting",
    host="0.0.0.0",
    stateless_http=True,
    json_response=True,
)


async def agentcore_sidecar_probe(request: Request, call_next):
    """
    AgentCore's sidecar probes POST /mcp/ (trailing slash) from 127.0.0.1
    without Authorization. Plain FastMCP only mounts /mcp, so /mcp/ becomes a
    307 redirect (or 405), the probe fails, and the microVM is marked unhealthy
    — real InvokeAgentRuntime traffic then 502s without ever hitting the app.

    Only short-circuit that local probe. Never intercept real MCP JSON-RPC
    (which has Authorization / non-loopback client / a jsonrpc body).
    """
    client_host = request.client.host if request.client else None
    if (
        request.method == "POST"
        and request.url.path == "/mcp/"
        and client_host in ("127.0.0.1", "::1")
        and not request.headers.get("authorization")
    ):
        return JSONResponse({"status": "ok"}, status_code=200)
    return await call_next(request)


async def ping_handler(request: Request):
    """Optional HTTP health endpoint used by some AgentCore health checks."""
    return JSONResponse({"status": "Healthy"}, status_code=200)


mcp.custom_route("/ping", methods=["GET", "POST"])(ping_handler)


def _resolve_library(mapping, lookup, library: str):
    norm_lib = library.lower().replace("&", "and").replace(" ", "")
    if norm_lib not in lookup:
        return None, (
            f"Error: Library '{library}' not found. "
            f"Available libraries: {', '.join(mapping.keys())}"
        )
    return lookup[norm_lib], None


def _load_processed_for_library(engine, mapping, resolved_lib: str, start_date: str, end_date: str):
    """
    Fetch and process occupancy for one library, applying camera quirks:
    location overrides, date-aware hardware-swap attribution, direction inversion.

    Long ranges are loaded in parallel date chunks so each MySQL query stays
    bounded (avoids AgentCore/gateway timeouts on multi-month requests).
    Per-chunk building-minute deltas are stitched, then occupancy is finalized once.
    """
    import pandas as pd
    from concurrent.futures import ThreadPoolExecutor, as_completed
    from datetime import datetime, timedelta
    from zoneinfo import ZoneInfo

    ny = ZoneInfo("America/New_York")
    serials = db.resolve_library_serials(mapping, resolved_lib, start_date, end_date)
    range_start = datetime.strptime(start_date, "%Y-%m-%d").date()
    range_end = datetime.strptime(end_date, "%Y-%m-%d").date()
    range_days = (range_end - range_start).days + 1

    # Adaptive sampling: counters are cumulative, so coarser samples still
    # produce correct traffic totals (occupancy curves get less granular).
    # Tiers keep multi-month and annual windows under AgentCore/gateway budgets.
    #   ≤45d   → every minute (full resolution)
    #   46–120 → every 3 minutes
    #   121–200 → every 5 minutes
    #   201–400 → every 10 minutes  (semester / annual)
    #   >400   → every 15 minutes   (multi-year)
    if range_days > 400:
        sample_minutes = 15
    elif range_days > 200:
        sample_minutes = 10
    elif range_days > 120:
        sample_minutes = 5
    elif range_days > 45:
        sample_minutes = 3
    else:
        sample_minutes = 1

    # Precompute global id bounds once; chunks interpolate (see db_helper)
    lookback_start = range_start - timedelta(days=db.QUERY_LOOKBACK_DAYS)
    if lookback_start < db.TABLE_START_DATE:
        lookback_start = db.TABLE_START_DATE
    global_start_id = db.get_start_id(engine, lookback_start.isoformat())
    global_end_id = db.get_end_id(engine, end_date)
    span_days = max(1, (range_end - lookback_start).days + 3)
    ids_per_day = max(1, global_end_id - global_start_id) / span_days
    id_pad = int(db.AVG_IDS_PER_DAY * 2)

    chunks = list(db.iter_date_chunks(range_start, range_end, db.QUERY_CHUNK_DAYS))

    def _process_chunk(chunk_start, chunk_end):
        fetch_start = chunk_start - timedelta(days=db.QUERY_LOOKBACK_DAYS)
        if fetch_start < db.TABLE_START_DATE:
            fetch_start = db.TABLE_START_DATE
        day_offset = (fetch_start - lookback_start).days
        day_end_offset = (chunk_end - lookback_start).days + 2
        start_id = max(
            global_start_id,
            global_start_id + int(day_offset * ids_per_day) - id_pad,
        )
        end_id = min(
            global_end_id,
            global_start_id + int(day_end_offset * ids_per_day) + id_pad,
        )
        start_id = max(1, min(start_id, global_end_id))
        end_id = max(start_id, min(end_id, global_end_id))

        raw_df = db.query_raw_metrics(
            engine,
            start_id,
            chunk_end.isoformat(),
            serials,
            end_id=end_id,
            sample_minutes=sample_minutes,
        )
        if raw_df.empty:
            return None
        raw_df = camera_quirks.filter_metrics_for_library(raw_df, resolved_lib, mapping)
        if raw_df.empty:
            return None
        active = raw_df["serial_no"].unique().tolist()
        building = proc.raw_to_building_deltas(raw_df, active)
        if building.empty:
            return None
        created_nyc_dates = (
            pd.to_datetime(building["created_at_utc"], utc=True)
            .dt.tz_convert(ny)
            .dt.date
        )
        keep = (created_nyc_dates >= chunk_start) & (created_nyc_dates <= chunk_end)
        keep &= (created_nyc_dates >= range_start) & (
            created_nyc_dates <= range_end + timedelta(days=1)
        )
        building = building.loc[keep]
        return building if not building.empty else None

    building_parts = []
    if len(chunks) == 1:
        part = _process_chunk(*chunks[0])
        if part is not None:
            building_parts.append(part)
    else:
        # Cap concurrency on very long ranges to reduce MySQL disconnects
        workers = min(3 if range_days > 200 else 4, len(chunks))
        results = {}
        with ThreadPoolExecutor(max_workers=workers) as pool:
            futures = {
                pool.submit(_process_chunk, cs, ce): (cs, ce) for cs, ce in chunks
            }
            for fut in as_completed(futures):
                cs, ce = futures[fut]
                part = fut.result()
                if part is not None:
                    results[(cs, ce)] = part
        for cs, ce in chunks:
            if (cs, ce) in results:
                building_parts.append(results[(cs, ce)])

    if not building_parts:
        raise ValueError("No metrics data found in database for the selected range.")

    building_df = pd.concat(building_parts, ignore_index=True)
    return proc.finalize_building_occupancy(building_df, library=resolved_lib)


@mcp.tool()
def get_libraries() -> str:
    """
    List UVA Library locations and contact information (phone, email, address,
    web page) from the public Drupal library directory.

    Returns the six major UVA libraries (Shannon, Clemons, Science & Engineering,
    Fine Arts, Music, Harrison/Small) plus named spaces with their own hours
    calendars: RMC (Robertson Media Center) and Scholars' Lab. Spaces are not
    counted as separate libraries and do not have occupancy sensors.

    Use this tool for:
    - "how many libraries?" / list of libraries
    - phone number, email, address, or website for a library or space
    - confirming whether RMC / Scholars' Lab have hours via get_library_hours
    Do not invent contact details or use a generic Access Services page when a
    library-specific phone is listed here.
    """
    occupancy_names: list[str] = []
    try:
        engine = db.get_db_engine()
        mapping, _ = db.get_libraries_mapping(engine)
        occupancy_names = list(mapping.keys())
    except Exception as e:
        logger.warning("get_libraries: occupancy DB unavailable (%s); using static list", e)
    return hours.format_library_directory(occupancy_from_db=occupancy_names)


@mcp.tool()
def get_library_hours(
    library: str,
    start_date: str,
    end_date: str = "",
) -> str:
    """
    Get published open/closed hours for a UVA library or named space from LibCal.

    ALWAYS use this tool for hours / open-closed / "this weekend" / "when is X open"
    questions. Pass absolute dates as YYYY-MM-DD (convert "this weekend" / "today"
    using the current date — do not invent dates). Each building or space has its
    own calendar (e.g. Fine Arts often closed weekends while Clemons is open;
    RMC hours are not the same as Clemons; Scholars' Lab hours are not Shannon).

    Supported locations include major libraries and spaces: Clemons, Shannon,
    Science & Engineering, Fine Arts, Music, Harrison/Small, RMC (Robertson Media
    Center), Scholars' Lab (makerspace / SLAB).

    Returns a markdown table of daily hours (or Closed) for the range.

    :param library: Library or space name (e.g. Clemons, Shannon, RMC,
                    Scholars' Lab, Music, Fine Arts). Aliases: SEL, FAL, RMC,
                    Robertson Media Center, SLAB, makerspace also work.
    :param start_date: Start date (YYYY-MM-DD) — required absolute date
    :param end_date: End date (YYYY-MM-DD). Omit or leave empty for a single day.
    """
    # Prefer canonical name from cameras mapping when available; fall back to
    # hours_helper's LibCal map so hours work even if DB is briefly unreachable.
    resolved = hours.normalize_library_name(library)
    try:
        engine = db.get_db_engine()
        mapping, lookup = db.get_libraries_mapping(engine)
        resolved_db, err = _resolve_library(mapping, lookup, library)
        if resolved_db:
            resolved = resolved_db
        elif resolved not in hours.LIBRARY_LIBCAL_IDS:
            return err or f"Error: Library '{library}' not found."
    except Exception:
        if resolved not in hours.LIBRARY_LIBCAL_IDS:
            known = ", ".join(sorted(hours.LIBRARY_LIBCAL_IDS.keys()))
            return (
                f"Error: Library '{library}' not found and database unavailable. "
                f"Known LibCal libraries: {known}"
            )

    end = end_date.strip() if end_date else start_date
    return hours.format_hours_schedule(resolved, start_date, end)


@mcp.tool()
def get_space_categories(location: str = "") -> str:
    """
    List reservable **space categories** (kinds of bookable rooms/equipment) from
    LibCal Spaces for UVA Library locations.

    Use for questions like:
    - "What kinds of spaces can I reserve at Shannon / Clemons / RMC / Brown?"
    - "Does Fine Arts have group study rooms?"
    - "What are the booking rules for RMC studios?"
    - "Where do I reserve library spaces?"

    Returns public categories with descriptions and terms/policies when available,
    plus a LibCal booking URL per location. Categories are types of spaces
    (e.g. Group Study Rooms, Digital Media Lab Workstations) — not individual
    room free/busy availability.

    Space location lids from this tool are **not** the same as building-hours
    LibCal ids used by `get_library_hours`.

    :param location: Optional library/space name or numeric space location lid
                     (e.g. Shannon, Clemons, RMC, Brown, Georges, Fine Arts,
                     Music, Scholars' Lab, Makerspace, Harrison, or `1076`).
                     Omit or leave empty to list **all public** locations.
    """
    return spaces.format_space_categories(location or "")


@mcp.tool()
def list_space_items(
    location: str,
    availability: str = "none",
    category: str = "",
    only_available: str = "false",
) -> str:
    """
    List **individual reservable rooms/equipment** at a LibCal space location
    via GET /space/items/{location_lid}, with item ids and optional **batch
    free/busy** for every room.

    Use for:
    - "What study rooms are at Shannon?" (availability=none or omit)
    - "What's free at Georges / Shannon / RMC today?" (availability=today)
    - "Next open group study slot at Brown" (availability=next or next_only)
    - Filter to one category: category="Group Study Rooms" or a cid from
      get_space_categories

    Prefer this over calling get_space_item once per room when checking a whole
    building. For deep policy text on one room, follow up with get_space_item.

    :param location: Library/space name or space location lid (required),
                     e.g. Shannon, RMC, Georges, Brown, Clemons, Fine Arts, Music,
                     Makerspace, or `1076`.
    :param availability: `none` (catalog only), `today`, `tomorrow`, `YYYY-MM-DD`,
                         `start,end` (max 31 days), `next`, `next_only`.
                         Default `none`. For free times, prefer `today` or a short range.
    :param category: Optional category name or cid (from get_space_categories)
    :param only_available: If true/yes/1 and availability is set, hide items with
                           no free slots
    """
    only = str(only_available or "").strip().lower() in ("1", "true", "yes", "on")
    return spaces.format_space_items(
        location,
        availability=availability or "none",
        category=category or "",
        only_with_availability=only,
    )


@mcp.tool()
def get_space_item(
    item: str,
    availability: str = "today",
    location: str = "",
) -> str:
    """
    Get details and **free (bookable) times** for a LibCal space/equipment item
    via GET /space/item/{id}.

    Use for:
    - "Is Shannon 134 free tonight?"
    - "When is Clemons 202 available this week?"
    - "Next open slot for an RMC audio station?"

    Availability values:
    - `today` / `tomorrow` / empty → that day
    - `YYYY-MM-DD` single day
    - `YYYY-MM-DD,YYYY-MM-DD` range (max 31 days; keep short for answers)
    - `next` → next date with free time
    - `next_only` → first free timeslot only
    - `none` → metadata only (no free/busy)

    Returns capacity, description, policies, and merged free windows in 12-hour
    local time. Does **not** create a reservation — send patrons to the LibCal
    booking link.

    :param item: Numeric item id (from list_space_items) or room name (e.g. "318 C",
                 "134 - Conference Room"). Prefer id when known.
    :param availability: Date / range / next / next_only / none (default today)
    :param location: Optional building when resolving by name (e.g. Shannon)
    """
    return spaces.format_space_item(
        item,
        availability=availability or "today",
        location=location or "",
    )


@mcp.tool()
def get_space_search_filters() -> str:
    """
    List LibCal amenity **search filters** (e.g. Accessible, Power Available)
    via GET /space/search/filters.

    Use filter ids with `search_space_availability` when the user asks for
    accessible rooms or power/outlets.
    """
    return spaces.format_space_search_filters()


@mcp.tool()
def search_space_availability(
    location: str,
    date: str = "today",
    time_start: str = "",
    time_end: str = "",
    category: str = "",
    capacity_range: int = 0,
    filters: str = "",
) -> str:
    """
    Search for spaces **free during an explicit time window** at a location
    via GET /space/search/hourly/{location_lid}.

    Prefer this when the user gives start and end times, e.g.:
    - "Group study room at Shannon from 5pm to 8pm today"
    - "Is anything free at RMC between 2:00 and 4:00 tomorrow?"
    - "Accessible study room at Brown 10am–12pm"

    Returns **exact_matches** (free for the full window) and **other_matches**
    (free only for a partial/later window), with item ids and bookable intervals.

    For browsing all rooms' free slots without a specific window, use
    `list_space_items` with availability=today instead.
    Daily multi-day search is not used (UVA spaces are hourly).

    :param location: Building/space name or space lid (Shannon, RMC, Georges, …)
    :param date: today | tomorrow | YYYY-MM-DD
    :param time_start: Window start (HH:MM or 5pm / 17:00) — required
    :param time_end: Window end (HH:MM or 8pm) — required, same day, after start
    :param category: Optional category name or cid
    :param capacity_range: 0=all, or LibCal capacity filter 1–4 (admin ranges,
                           NOT exact seat count — avoid unless you know the mapping)
    :param filters: Optional amenity filter ids or names (comma-separated),
                    e.g. "545" or "Accessible,Power" from get_space_search_filters
    """
    return spaces.format_search_space_availability(
        location,
        date_str=date or "today",
        time_start=time_start or "",
        time_end=time_end or "",
        category=category or "",
        capacity_range=int(capacity_range or 0),
        filters=filters or "",
    )


@mcp.tool()
def get_equipment_categories(location: str = "") -> str:
    """
    List **equipment categories** from LibCal Equipment for UVA Library locations
    via GET /equipment/locations + /equipment/categories/{lid}.

    Use for questions like:
    - "What equipment can I borrow at RMC / Clemons / Makerspace?"
    - "Does RMC have reserve cameras vs walk-up gear?"
    - "What categories of equipment exist at Fine Arts?"

    Returns public categories (e.g. Reserve Cameras, Walk-Up Audio, In Library
    Use Items [No Reservations], General Equipment) with booking URLs.
    Equipment location lids often match space lids but **equipment item ids are
    not space item ids or seat ids**.

    Study rooms → get_space_categories / list_space_items.
    Named Makerspace 3D printers (Big Bird, Kermit) → list_space_seats.

    :param location: Optional name or equipment lid (RMC, Makerspace, Shannon,
                     Clemons, Brown, Fine Arts, Music, `241`). Empty = all public.
    """
    return equipment.format_equipment_categories(location or "")


@mcp.tool()
def get_equipment_category(
    category: str,
    location: str = "",
    availability: str = "none",
) -> str:
    """
    Details and items for one **equipment category** via
    GET /equipment/category/{cid}.

    Use when you already know a category (name or cid), e.g. Reserve Cameras,
    3D Printers (RMC Makerbots), Walk-Up Audio Equipment, Textiles.

    :param category: Category id or name
    :param location: Optional scope when resolving by name (strongly recommended
                     for short names like "3D Printers")
    :param availability: none | today | tomorrow | YYYY-MM-DD | start,end |
                         next | next_only
    """
    return equipment.format_equipment_category(
        category,
        location=location or "",
        availability=availability or "none",
    )


@mcp.tool()
def list_equipment_items(
    location: str,
    availability: str = "none",
    category: str = "",
    only_available: str = "false",
) -> str:
    """
    List **equipment items** at a LibCal equipment location via
    GET /equipment/items/{location_lid}, with item ids and optional batch free/busy.

    Use for:
    - "What cameras can I reserve at RMC?"
    - "List Makerspace equipment (Cameo, Cintiq, sewing machines)"
    - "What's free at RMC today?" (availability=today)
    - Filter: category="Reserve Cameras" or a cid from get_equipment_categories

    Many "No Reservations" / walk-up items show little free/busy — tell patrons
    they are first-come. Reserve categories (cameras, light kits) use LibCal booking.

    :param location: Required name or equipment lid (RMC, Makerspace, Clemons, …)
    :param availability: none | today | tomorrow | YYYY-MM-DD | start,end |
                         next | next_only
    :param category: Optional category name or cid
    :param only_available: If true, hide items with no free slots
    """
    only = str(only_available or "").strip().lower() in ("1", "true", "yes", "on")
    return equipment.format_equipment_items(
        location,
        availability=availability or "none",
        category=category or "",
        only_with_availability=only,
    )


@mcp.tool()
def get_equipment_item(
    item: str,
    availability: str = "today",
    location: str = "",
) -> str:
    """
    Get details and free times for one **equipment item** via
    GET /equipment/item/{id}.

    Use for a specific piece of gear, e.g. item id from list_equipment_items,
    "Cameo 4", "Canon C100 #1", "Cintiq graphics tablet". Includes description,
    instructions, terms, model, and free slots when bookable.

    Study rooms are not equipment — use get_space_item.
    Named Makerspace 3D printers (Big Bird) are often seats — try get_space_seat
    if get_equipment_item fails.

    :param item: Equipment item id or name
    :param availability: today | tomorrow | YYYY-MM-DD | start,end | next |
                         next_only | none
    :param location: Optional scope when resolving by name (e.g. RMC, Makerspace)
    """
    return equipment.format_equipment_item(
        item,
        availability=availability or "today",
        location=location or "",
    )


@mcp.tool()
def list_space_seats(
    location: str = "Makerspace",
    availability: str = "today",
    only_available: str = "false",
) -> str:
    """
    List LibCal **seats** at a location via GET /space/seats/{location_lid}.

    At UVA, seats are used mainly for **named Scholars' Lab Makerspace equipment**
    (e.g. Big Bird Prusa XL, Kermit MK4S, button makers)—not study-room chairs.
    Most libraries return no seats; use list_space_items / search_space_availability
    for group study rooms.

    Use for:
    - "Which 3D printers can I reserve?"
    - "Is Big Bird free this week?"
    - "List Makerspace equipment by machine name"

    :param location: Default Makerspace; name or space lid (only locations with
                     seats configured will return data)
    :param availability: none | today | tomorrow | YYYY-MM-DD | start,end | next_only
    :param only_available: If true, hide seats with no free slots
    """
    only = str(only_available or "").strip().lower() in ("1", "true", "yes", "on")
    return spaces.format_space_seats(
        location or "Makerspace",
        availability=availability or "today",
        only_with_availability=only,
    )


@mcp.tool()
def get_space_seat(
    seat: str,
    availability: str = "today",
    location: str = "",
) -> str:
    """
    Get details and free times for one LibCal **seat** (named equipment)
    via GET /space/seat/{id}.

    Use for a specific Makerspace machine, e.g. Big Bird, Camilla, Kermit,
    or a seat id from list_space_seats. Includes equipment how-to text when present.

    Study rooms are not seats — use get_space_item instead.

    :param seat: Seat id or equipment name
    :param availability: today | tomorrow | YYYY-MM-DD | start,end | next_only | none
    :param location: Optional scope when resolving by name (e.g. Makerspace)
    """
    return spaces.format_space_seat(
        seat,
        availability=availability or "today",
        location=location or "",
    )


@mcp.tool()
def get_foot_traffic(start_date: str, end_date: str, library: str) -> str:
    """
    Get foot traffic totals (entries, exits, and combined) for a library in a date range.
    :param start_date: Start date (YYYY-MM-DD)
    :param end_date: End date (YYYY-MM-DD)
    :param library: Library name (e.g. Clemons, Shannon, Science & Engineering)
    """
    engine = db.get_db_engine()
    mapping, lookup = db.get_libraries_mapping(engine)

    resolved_lib, err = _resolve_library(mapping, lookup, library)
    if err:
        return err

    try:
        processed_df = _load_processed_for_library(engine, mapping, resolved_lib, start_date, end_date)
    except ValueError as e:
        return f"Error: {e}"

    metrics = rep.generate_report_metrics(
        processed_df, start_date, end_date, library=resolved_lib
    )

    if "error" in metrics:
        return f"Error: {metrics['error']}"

    return f"""### Foot Traffic Summary: {resolved_lib}
* **Date Range**: {start_date} to {end_date}
* **Total Entries ("In" Traffic)**: {metrics['total_in']:,}
* **Total Exits ("Out" Traffic)**: {metrics['total_out']:,}
* **Total Combined Activity**: {metrics['combined_total']:,}
* **Average Daily Entries**: {metrics['avg_daily_in']:,.2f}
"""


@mcp.tool()
def get_occupancy_report(
    start_date: str,
    end_date: str,
    library: str,
    start_time: str = "00:00",
    end_time: str = "24:00",
) -> str:
    """
    Get a full executive occupancy and quality report for a library in a date range.
    :param start_date: Start date (YYYY-MM-DD)
    :param end_date: End date (YYYY-MM-DD)
    :param library: Library name (e.g. Clemons, Shannon, Science & Engineering)
    :param start_time: Start time (HH:MM, default 00:00)
    :param end_time: End time (HH:MM, default 24:00)
    """
    engine = db.get_db_engine()
    mapping, lookup = db.get_libraries_mapping(engine)

    resolved_lib, err = _resolve_library(mapping, lookup, library)
    if err:
        return err

    try:
        processed_df = _load_processed_for_library(engine, mapping, resolved_lib, start_date, end_date)
    except ValueError as e:
        return f"Error: {e}"

    metrics = rep.generate_report_metrics(
        processed_df,
        start_date,
        end_date,
        start_time,
        end_time,
        library=resolved_lib,
    )

    if "error" in metrics:
        return f"Error: {metrics['error']}"

    rep_text = rep.format_report_as_markdown(resolved_lib, metrics, start_date, end_date)
    return f"""# Occupancy Report: {resolved_lib} ({start_date} to {end_date})
{rep_text}"""


@mcp.prompt(
    name="occupancy_analysis_template",
    description="Template for conducting a complete foot traffic and peak occupancy analysis for a UVA library over a date range."
)
def occupancy_analysis_template(library: str, start_date: str, end_date: str) -> str:
    return (
        f"Please analyze occupancy and foot traffic data for {library} between {start_date} and {end_date}.\n\n"
        "Follow these steps using the available tools:\n"
        f"1. Call `get_library_hours(library='{library}', start_date='{start_date}', end_date='{end_date}')` to verify scheduled open/closed hours.\n"
        f"2. Call `get_foot_traffic(library='{library}', start_date='{start_date}', end_date='{end_date}')` to retrieve total entries, exits, and daily averages.\n"
        f"3. Call `get_occupancy_report(library='{library}', start_date='{start_date}', end_date='{end_date}')` for detailed peak occupancy, hour-by-hour distribution, and data confidence metrics.\n\n"
        "Synthesize these findings into an executive summary highlighting peak utilization times and trends."
    )


@mcp.prompt(
    name="library_comparison_template",
    description="Template for comparing foot traffic, occupancy patterns, and utilization between two UVA library locations."
)
def library_comparison_template(library1: str, library2: str, start_date: str, end_date: str) -> str:
    return (
        f"Please compare occupancy and visitor activity between {library1} and {library2} for the period {start_date} to {end_date}.\n\n"
        "Steps to perform:\n"
        f"1. Retrieve foot traffic totals for {library1} using `get_foot_traffic(library='{library1}', start_date='{start_date}', end_date='{end_date}')`.\n"
        f"2. Retrieve foot traffic totals for {library2} using `get_foot_traffic(library='{library2}', start_date='{start_date}', end_date='{end_date}')`.\n"
        f"3. Obtain occupancy reports for both locations (`get_occupancy_report`).\n"
        "4. Compare peak hours, average daily entry volumes, and relative utilization percentages."
    )


@mcp.prompt(
    name="operating_hours_check_template",
    description="Template for looking up library operating schedules and confirming LibCal calendar hours."
)
def operating_hours_check_template(start_date: str, end_date: str, library: str = "Clemons") -> str:
    return (
        f"Please check the published operating schedule for {library} from {start_date} to {end_date}.\n\n"
        "Steps:\n"
        "1. Optionally list all available library locations using `get_libraries()`.\n"
        f"2. Fetch daily open/closed hours using `get_library_hours(library='{library}', start_date='{start_date}', end_date='{end_date}')`.\n"
        "3. Highlight any holiday or weekend closures in the schedule."
    )



if __name__ == "__main__":
    import uvicorn

    logging.basicConfig(level=logging.INFO)
    app = mcp.streamable_http_app()
    # Disable slash redirects so /mcp vs /mcp/ is explicit (probe middleware handles /mcp/).
    app.router.redirect_slashes = False
    app.add_middleware(BaseHTTPMiddleware, dispatch=agentcore_sidecar_probe)
    uvicorn.run(app, host="0.0.0.0", port=8000)
