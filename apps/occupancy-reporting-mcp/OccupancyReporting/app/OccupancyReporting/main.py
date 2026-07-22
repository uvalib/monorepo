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
def get_libraries() -> list[str]:
    """
    Returns a list of all libraries available in the database.
    """
    engine = db.get_db_engine()
    mapping, _ = db.get_libraries_mapping(engine)
    return list(mapping.keys())


@mcp.tool()
def get_library_hours(
    library: str,
    start_date: str,
    end_date: str = "",
) -> str:
    """
    Get published open/closed hours for a library from LibCal (per-building calendar).

    Useful to confirm which hours occupancy reports use for open-hours filtering
    and daily resets. Returns a markdown table of daily hours.

    :param library: Library name (e.g. Clemons, Shannon, Music, Fine Arts,
                    Science & Engineering). Aliases like SEL, FAL also work.
    :param start_date: Start date (YYYY-MM-DD)
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


if __name__ == "__main__":
    import uvicorn

    logging.basicConfig(level=logging.INFO)
    app = mcp.streamable_http_app()
    # Disable slash redirects so /mcp vs /mcp/ is explicit (probe middleware handles /mcp/).
    app.router.redirect_slashes = False
    app.add_middleware(BaseHTTPMiddleware, dispatch=agentcore_sidecar_probe)
    uvicorn.run(app, host="0.0.0.0", port=8000)
