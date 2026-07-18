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
    """
    serials = db.resolve_library_serials(mapping, resolved_lib, start_date, end_date)
    start_id = db.get_start_id(engine, start_date)
    raw_df = db.query_raw_metrics(engine, start_id, end_date, serials)
    # Drop rows whose serial belongs to another building on that day (post-swap)
    raw_df = camera_quirks.filter_metrics_for_library(raw_df, resolved_lib, mapping)
    active_serials = raw_df["serial_no"].unique().tolist() if not raw_df.empty else serials
    return proc.process_occupancy_data(raw_df, active_serials)


@mcp.tool()
def get_libraries() -> list[str]:
    """
    Returns a list of all libraries available in the database.
    """
    engine = db.get_db_engine()
    mapping, _ = db.get_libraries_mapping(engine)
    return list(mapping.keys())


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

    processed_df = _load_processed_for_library(engine, mapping, resolved_lib, start_date, end_date)
    metrics = rep.generate_report_metrics(processed_df, start_date, end_date)

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

    processed_df = _load_processed_for_library(engine, mapping, resolved_lib, start_date, end_date)
    metrics = rep.generate_report_metrics(processed_df, start_date, end_date, start_time, end_time)

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
