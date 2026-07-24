# main.py — AgentCore entrypoint for the Bedrock Knowledge Bases MCP server
# FastMCP streamable-http on 0.0.0.0:8000/mcp as required by AgentCore Runtime.

import logging
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from mcp.server.fastmcp import FastMCP
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
import kb_helper as kb

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("BedrockKB")

# json_response=True returns application/json instead of SSE, which is more
# reliable behind AgentCore's InvokeAgentRuntime / Gateway proxies.
mcp = FastMCP(
    "BedrockKB",
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
def search_uvalib_web(
    query: str,
    max_results: int = 5
) -> str:
    """
    Search the UVA Library website Knowledge Base (uvalib-web-knowledge-base, ID: N2B734PGWU).

    Retrieves information on library services, policies, research guides, collections,
    staff contacts, and web documentation.

    Note: For building open/closed hours and schedule lookup, use the get_library_hours tool instead.

    Parameters:
    - query: Search query or question (e.g., 'borrowing policies', 'interlibrary loan', 'special collections access').
    - max_results: Maximum number of relevant document excerpts to return (default 5).
    """
    try:
        data = kb.query_knowledge_base("N2B734PGWU", query, max_results=max_results)
        return kb.format_retrieval_markdown(data)
    except Exception as e:
        logger.error(f"Error executing search_uvalib_web: {e}")
        return f"Error querying UVA Library Web Knowledge Base: {str(e)}"


@mcp.tool()
def search_virgo_image_suggestions(
    query: str,
    max_results: int = 5
) -> str:
    """
    Search UVA Library digital images / visual history (Virgo Image Knowledge Base J34YBBVTGA).

    USE THIS TOOL whenever the user asks for photos, pictures, images, illustrations,
    drawings, or visual materials (e.g. 'images of the Rotunda on fire', 'photos of the Lawn').
    Do NOT use the book catalog (search_catalog) as the primary tool for image requests.

    Returns ranked image hits with title, collection, repository, relevance score,
    public Image URL (IIIF JPEG for display), and Virgo page link.

    Parameters:
    - query: Visual search query (e.g., 'Rotunda fire', 'rotunda drawings', 'historic Charlottesville photos').
    - max_results: Maximum images to return (default 5, max 10 recommended).
    """
    try:
        max_results = max(1, min(int(max_results), 10))
        data = kb.query_knowledge_base("J34YBBVTGA", query, max_results=max_results)
        return kb.format_retrieval_markdown(data)
    except Exception as e:
        logger.error(f"Error executing search_virgo_image_suggestions: {e}")
        return f"Error querying Virgo Image Suggestions Knowledge Base: {str(e)}"


@mcp.tool()
def search_virgo_item_suggestions(
    query: str,
    max_results: int = 5
) -> str:
    """
    Search the Virgo Item Suggestions Knowledge Base (virgo-item-suggestions-knowledge-base, ID: UMMEKLDTPR).

    Retrieves item recommendations, related catalog materials, and item-level suggestions.

    Parameters:
    - query: Search keyword or item title (e.g., 'civil war memoirs', 'architecture dissertations').
    - max_results: Maximum number of item suggestions to return (default 5).
    """
    try:
        data = kb.query_knowledge_base("UMMEKLDTPR", query, max_results=max_results)
        return kb.format_retrieval_markdown(data)
    except Exception as e:
        logger.error(f"Error executing search_virgo_item_suggestions: {e}")
        return f"Error querying Virgo Item Suggestions Knowledge Base: {str(e)}"


@mcp.tool()
def search_virgo_suggestions(
    query: str,
    max_results: int = 5
) -> str:
    """
    Search the Virgo Author & Search Suggestions Knowledge Base (virgo-suggestions-knowledge-base, ID: ANITQDQQXN).

    Suggests relevant authors and creators from our catalog based on search queries.

    Parameters:
    - query: Author name or topic query (e.g., 'Faulkner', 'Edgar Allan Poe', 'Virginia historians').
    - max_results: Maximum number of author suggestions to return (default 5).
    """
    try:
        data = kb.query_knowledge_base("ANITQDQQXN", query, max_results=max_results)
        return kb.format_retrieval_markdown(data)
    except Exception as e:
        logger.error(f"Error executing search_virgo_suggestions: {e}")
        return f"Error querying Virgo Suggestions Knowledge Base: {str(e)}"


@mcp.tool()
def retrieve_knowledge_base(
    knowledge_base_id: str,
    query: str,
    max_results: int = 5
) -> str:
    """
    Retrieve document excerpts and relevant metadata from any specified AWS Bedrock Knowledge Base.

    Parameters:
    - knowledge_base_id: Target KB ID (e.g. 'N2B734PGWU', 'J34YBBVTGA', 'UMMEKLDTPR', 'ANITQDQQXN') or alias ('uvalib_web', 'virgo_image_suggestions', 'virgo_item_suggestions', 'virgo_suggestions').
    - query: Search query or text.
    - max_results: Maximum number of results to return (default 5).
    """
    try:
        data = kb.query_knowledge_base(knowledge_base_id, query, max_results=max_results)
        return kb.format_retrieval_markdown(data)
    except Exception as e:
        logger.error(f"Error executing retrieve_knowledge_base: {e}")
        return f"Error retrieving from Knowledge Base '{knowledge_base_id}': {str(e)}"


@mcp.prompt(
    name="library_policy_faq_template",
    description="Template for answering questions regarding UVA Library policies, services, borrowing rules, or staff contacts."
)
def library_policy_faq_template(query: str) -> str:
    return (
        f"Please answer the user's question regarding UVA Library services or policies: '{query}'.\n\n"
        "Steps to perform:\n"
        f"1. Query the UVA Library Web Knowledge Base using `search_uvalib_web(query='{query}', max_results=5)`.\n"
        "2. Review the retrieved excerpts and metadata.\n"
        "3. Provide a clear, well-structured response citing official policy or documentation sources where available."
    )


@mcp.prompt(
    name="visual_and_author_discovery_template",
    description="Template for discovering visual media, images, and author suggestions across Virgo Knowledge Bases."
)
def visual_and_author_discovery_template(query: str) -> str:
    return (
        f"Please find visual media, image suggestions, and related creators/authors for '{query}'.\n\n"
        "Steps to perform:\n"
        f"1. Search image suggestions via `search_virgo_image_suggestions(query='{query}')`.\n"
        f"2. Search author and creator suggestions via `search_virgo_suggestions(query='{query}')`.\n"
        f"3. Search item suggestions via `search_virgo_item_suggestions(query='{query}')`.\n"
        "4. Synthesize the recommendations into a guide with links/identifiers."
    )



if __name__ == "__main__":
    import uvicorn

    logging.basicConfig(level=logging.INFO)
    app = mcp.streamable_http_app()
    # Disable slash redirects so /mcp vs /mcp/ is explicit (probe middleware handles /mcp/).
    app.router.redirect_slashes = False
    app.add_middleware(BaseHTTPMiddleware, dispatch=agentcore_sidecar_probe)
    uvicorn.run(app, host="0.0.0.0", port=8000)
