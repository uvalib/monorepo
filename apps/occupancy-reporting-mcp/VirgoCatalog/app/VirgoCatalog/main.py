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

    Results are sorted for patron usefulness and include:
    availability (On shelf / Online / Request), library building, shelf location,
    call number, online access URL when present, and Virgo record links.

    Parameters:
    - query: Search keyword or phrase (e.g., 'Catcher in the Rye', 'python programming').
    - pool: Target search pool. Options: 'uva_library' (default - UVA Library Catalog books/media/archives),
      'all' (master search across catalog, articles, images, hathitrust, jmrl, worldcat),
      'articles', 'images', 'hathitrust', 'jmrl', 'worldcat'.
    - start: Pagination offset (default 0).
    - rows: Number of search results to return (default 20, max 100). Prefer 10–20 for checkout questions.
    """
    try:
        rows = max(1, min(int(rows), 100))
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

    Prefer field='title' for known book titles (e.g. 'The Catcher in the Rye').
    Results include availability, library, shelf location, call number, and digital access URLs.

    Parameters:
    - query: Search term for the specified field (e.g., 'Huckleberry Finn', 'Tolkien', 'Civil War').
    - field: Target field to search. Supported fields: 'title', 'author', 'subject',
      'identifier' (call number/ISBN/record ID), 'journal_title', 'series', 'published'.
    - pool: Target search pool ('uva_library' default, or 'all', 'articles', 'images', etc.).
    - start: Pagination offset (default 0).
    - rows: Number of results (default 20).
    """
    try:
        rows = max(1, min(int(rows), 100))
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
    Retrieve full record details for a specific Virgo catalog item, leading with
    availability, library, shelf location, call number, and online access URL.

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


@mcp.prompt(
    name="catalog_research_template",
    description="Template for research inquiries in the Virgo catalog, combining topic/field searching with detailed item retrieval."
)
def catalog_research_template(topic: str, field: str = "keyword", pool: str = "uva_library") -> str:
    return (
        f"Please research the topic '{topic}' in the UVA Library Virgo catalog (search field: '{field}', pool: '{pool}').\n\n"
        "Follow these steps using the Virgo catalog tools:\n"
        f"1. Search for catalog items using `search_by_field(query='{topic}', field='{field}', pool='{pool}', rows=10)` (or `search_catalog` if field is keyword).\n"
        "2. Review the search results — note availability, library, shelf location, call number, and online access URLs.\n"
        "3. For top relevant items, call `get_item_details(item_id=..., pool_id=...)` if you need more metadata.\n"
        "4. Summarize with where the user can get the material (building + call number, or digital link)."
    )


@mcp.prompt(
    name="item_availability_lookup_template",
    description="Template for finding which library has a title, shelf location, call number, checkout status, and digital access."
)
def item_availability_lookup_template(item_id_or_title: str) -> str:
    return (
        f"Please check where the user can get '{item_id_or_title}' (checkout / online).\n\n"
        "Steps:\n"
        f"1. If '{item_id_or_title}' is an item ID (starts with 'u'), call `get_item_details(item_id='{item_id_or_title}')`.\n"
        f"2. If it is a title, call `search_by_field(query='{item_id_or_title}', field='title', rows=15)`.\n"
        "3. Answer with:\n"
        "   - Circulating copies currently **On shelf** (library building + location + call number)\n"
        "   - **Online** copies with the Access URL when available\n"
        "   - **Request / checked out** copies (mention request, not as available now)\n"
        "   - **Special Collections** separately (Reading Room use, not standard checkout)\n"
        "4. Prefer exact title matches to the work the user named over criticism/companion volumes when the user wants the book itself.\n"
        "5. Include Virgo record links for the best options."
    )



if __name__ == "__main__":
    import uvicorn

    logging.basicConfig(level=logging.INFO)
    app = mcp.streamable_http_app()
    # Disable slash redirects so /mcp vs /mcp/ is explicit (probe middleware handles /mcp/).
    app.router.redirect_slashes = False
    app.add_middleware(BaseHTTPMiddleware, dispatch=agentcore_sidecar_probe)
    uvicorn.run(app, host="0.0.0.0", port=8000)

