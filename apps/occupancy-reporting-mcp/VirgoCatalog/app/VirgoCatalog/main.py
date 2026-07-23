# main.py — AgentCore entrypoint for the Virgo Library Catalog Search MCP server
# FastMCP streamable-http on 0.0.0.0:8000/mcp as required by AgentCore Runtime.

import logging
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from mcp.server.fastmcp import FastMCP
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
import catalog_helper as cat

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("VirgoCatalog")

# json_response=True returns application/json instead of SSE, which is more
# reliable behind AgentCore's InvokeAgentRuntime / Gateway proxies.
mcp = FastMCP(
    "VirgoCatalog",
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


@mcp.tool()
def search_catalog(
    query: str,
    pool: str = "uva_library",
    start: int = 0,
    rows: int = 20
) -> str:
    """
    Search the UVA Library catalog or external Virgo pools for books, journals,
    manuscripts, audio, video, articles, and digital collections.

    Parameters:
    - query: Search keyword or phrase (e.g., 'clemons library', 'python programming', 'virginia history').
    - pool: Target search pool. Options: 'uva_library' (default - UVA Library Catalog books/media/archives),
      'all' (master search across catalog, articles, images, hathitrust, jmrl, worldcat),
      'articles', 'images', 'hathitrust', 'jmrl', 'worldcat'.
    - start: Pagination offset (default 0).
    - rows: Number of search results to return (default 20, max 100).
    """
    try:
        data = cat.search_catalog(query, field="keyword", pool=pool, start=start, rows=rows)
        return cat.format_search_results_markdown(query, data, pool_filter=pool)
    except Exception as e:
        logger.error(f"Error executing search_catalog: {e}")
        return f"Error executing catalog search for '{query}': {str(e)}"


@mcp.tool()
def search_by_field(
    query: str,
    field: str = "title",
    pool: str = "uva_library",
    start: int = 0,
    rows: int = 20
) -> str:
    """
    Search the UVA Library catalog targeting a specific metadata field.

    Parameters:
    - query: Search term for the specified field (e.g., 'Huckleberry Finn', 'Tolkien', 'Civil War').
    - field: Target field to search. Supported fields: 'title', 'author', 'subject',
      'identifier' (call number/ISBN/record ID), 'journal_title', 'series', 'published'.
    - pool: Target search pool ('uva_library' default, or 'all', 'articles', 'images', etc.).
    - start: Pagination offset (default 0).
    - rows: Number of results (default 20).
    """
    try:
        data = cat.search_catalog(query, field=field, pool=pool, start=start, rows=rows)
        return cat.format_search_results_markdown(f"{field}:{query}", data, pool_filter=pool)
    except Exception as e:
        logger.error(f"Error executing search_by_field: {e}")
        return f"Error executing field search ({field}='{query}'): {str(e)}"


@mcp.tool()
def get_item_details(
    item_id: str,
    pool_id: str = "uva_library"
) -> str:
    """
    Retrieve full record details, field metadata, call number, publisher, and availability
    for a specific Virgo catalog item.

    Parameters:
    - item_id: The item identifier or record ID (e.g., 'u321111', 'u4521098').
    - pool_id: The source pool identifier ('uva_library' default, 'images', 'hathitrust', 'jmrl', 'worldcat').
    """
    try:
        data = cat.get_item_details(pool_id, item_id)
        return cat.format_item_details_markdown(item_id, data)
    except Exception as e:
        logger.error(f"Error fetching item details: {e}")
        return f"Error retrieving item details for '{item_id}': {str(e)}"


if __name__ == "__main__":
    import uvicorn

    logging.basicConfig(level=logging.INFO)
    app = mcp.streamable_http_app()
    # Disable slash redirects so /mcp vs /mcp/ is explicit (probe middleware handles /mcp/).
    app.router.redirect_slashes = False
    app.add_middleware(BaseHTTPMiddleware, dispatch=agentcore_sidecar_probe)
    uvicorn.run(app, host="0.0.0.0", port=8000)

