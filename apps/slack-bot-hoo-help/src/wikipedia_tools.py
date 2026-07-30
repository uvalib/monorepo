"""
wikipedia_tools.py — Local Wikipedia tools for HooHelp (not a separate MCP server).

Uses the public MediaWiki API (read-only). Exposed to Bedrock Converse as
in-process tools alongside the AgentCore gateway MCP tools.
"""

from __future__ import annotations

import logging
import re
from typing import Any, Dict, List, Optional
from urllib.parse import quote

import requests

logger = logging.getLogger(__name__)

USER_AGENT = "HooHelp/1.0 (UVA Library Slack assistant; https://library.virginia.edu)"
API_URL = "https://{lang}.wikipedia.org/w/api.php"
DEFAULT_LANG = "en"
MAX_SEARCH_RESULTS = 8
MAX_EXTRACT_CHARS = 12000

# Tool names registered with Bedrock (must match ^[a-zA-Z0-9_-]{1,64}$)
TOOL_SEARCH = "wikipedia_search"
TOOL_GET_PAGE = "wikipedia_get_page"

LOCAL_TOOL_NAMES = frozenset({TOOL_SEARCH, TOOL_GET_PAGE})


def bedrock_tool_specs() -> List[Dict[str, Any]]:
    """Bedrock Converse toolSpec entries for local Wikipedia tools."""
    return [
        {
            "toolSpec": {
                "name": TOOL_SEARCH,
                "description": (
                    "Search Wikipedia for articles. Use for external background facts: "
                    "authors, books, awards, historical events, and especially "
                    "New York Times bestseller / number-one book lists by year "
                    "(e.g. 'New York Times number-one books of 2025'). "
                    "Not for UVA Library hours, contacts, or Virgo holdings — use those tools instead. "
                    "Returns titles, page ids, and snippets; then call wikipedia_get_page for full content."
                )[:500],
                "inputSchema": {
                    "json": {
                        "type": "object",
                        "properties": {
                            "query": {
                                "type": "string",
                                "description": "Search query (article title keywords)",
                            },
                            "language": {
                                "type": "string",
                                "description": "Wikipedia language code (default en)",
                            },
                            "limit": {
                                "type": "integer",
                                "description": "Max results 1–8 (default 5)",
                            },
                        },
                        "required": ["query"],
                    }
                },
            }
        },
        {
            "toolSpec": {
                "name": TOOL_GET_PAGE,
                "description": (
                    "Fetch a Wikipedia page as plain text (intro + body extract). "
                    "Pass page_id from wikipedia_search, or a page title. "
                    "Use for NYT number-one / bestseller year lists, author bios, book background. "
                    "Cite the Wikipedia URL returned. For library availability of titles found, "
                    "follow up with Virgo catalog tools."
                )[:500],
                "inputSchema": {
                    "json": {
                        "type": "object",
                        "properties": {
                            "page_id": {
                                "type": "integer",
                                "description": "Wikipedia page id from search results",
                            },
                            "title": {
                                "type": "string",
                                "description": "Page title if page_id unknown",
                            },
                            "language": {
                                "type": "string",
                                "description": "Wikipedia language code (default en)",
                            },
                        },
                        "required": [],
                    }
                },
            }
        },
    ]


def is_local_tool(name: str) -> bool:
    return (name or "") in LOCAL_TOOL_NAMES


def call_local_tool(name: str, arguments: Optional[Dict[str, Any]] = None) -> str:
    args = arguments or {}
    if name == TOOL_SEARCH:
        return search(
            query=str(args.get("query") or ""),
            language=str(args.get("language") or DEFAULT_LANG),
            limit=int(args.get("limit") or 5),
        )
    if name == TOOL_GET_PAGE:
        page_id = args.get("page_id")
        title = args.get("title")
        return get_page(
            page_id=int(page_id) if page_id is not None and str(page_id).strip() != "" else None,
            title=str(title) if title else None,
            language=str(args.get("language") or DEFAULT_LANG),
        )
    return f"Unknown local tool: {name}"


def _session() -> requests.Session:
    s = requests.Session()
    s.headers.update({"User-Agent": USER_AGENT})
    return s


def search(query: str, language: str = DEFAULT_LANG, limit: int = 5) -> str:
    q = (query or "").strip()
    if not q:
        return "Error: query is required."
    lang = _safe_lang(language)
    limit = max(1, min(int(limit or 5), MAX_SEARCH_RESULTS))

    try:
        resp = _session().get(
            API_URL.format(lang=lang),
            params={
                "action": "query",
                "list": "search",
                "srsearch": q,
                "srlimit": limit,
                "srprop": "snippet|titlesnippet|size|wordcount|timestamp",
                "format": "json",
            },
            timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        logger.error("Wikipedia search failed: %s", e)
        return f"Error: Wikipedia search failed: {e}"

    hits = (data.get("query") or {}).get("search") or []
    if not hits:
        return f"No Wikipedia results for {q!r} (lang={lang})."

    lines = [
        f"# Wikipedia search: {q}",
        f"Language: {lang} · Results: {len(hits)}",
        "",
        "Use `wikipedia_get_page` with a **page_id** (preferred) or **title** for full text.",
        "",
    ]
    for i, hit in enumerate(hits, 1):
        title = hit.get("title") or ""
        page_id = hit.get("pageid")
        snippet = _strip_html(hit.get("snippet") or "")
        url = f"https://{lang}.wikipedia.org/wiki/{quote(title.replace(' ', '_'), safe='()')}"
        lines.append(f"### {i}. {title}")
        lines.append(f"- **page_id**: {page_id}")
        lines.append(f"- **URL**: {url}")
        if snippet:
            lines.append(f"- **Snippet**: {snippet}")
        lines.append("")
    return "\n".join(lines)


def get_page(
    page_id: Optional[int] = None,
    title: Optional[str] = None,
    language: str = DEFAULT_LANG,
) -> str:
    lang = _safe_lang(language)
    if page_id is None and not (title or "").strip():
        return "Error: provide page_id or title."

    params: Dict[str, Any] = {
        "action": "query",
        "prop": "extracts|info",
        "explaintext": 1,
        "exsectionformat": "plain",
        "inprop": "url",
        "format": "json",
        "redirects": 1,
    }
    if page_id is not None:
        params["pageids"] = int(page_id)
    else:
        params["titles"] = (title or "").strip()

    try:
        resp = _session().get(API_URL.format(lang=lang), params=params, timeout=20)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        logger.error("Wikipedia get_page failed: %s", e)
        return f"Error: Wikipedia page fetch failed: {e}"

    pages = (data.get("query") or {}).get("pages") or {}
    if not pages:
        return "Error: No page returned from Wikipedia."

    page = next(iter(pages.values()))
    if page.get("missing") is not None or "pageid" not in page:
        return f"Error: Wikipedia page not found (page_id={page_id!r}, title={title!r})."

    page_title = page.get("title") or title or str(page_id)
    extract = (page.get("extract") or "").strip()
    url = page.get("fullurl") or (
        f"https://{lang}.wikipedia.org/wiki/"
        f"{quote(page_title.replace(' ', '_'), safe='()')}"
    )
    truncated = False
    if len(extract) > MAX_EXTRACT_CHARS:
        extract = extract[:MAX_EXTRACT_CHARS].rstrip() + "\n\n… [truncated]"
        truncated = True

    lines = [
        f"# Wikipedia: {page_title}",
        f"- **page_id**: {page.get('pageid')}",
        f"- **URL**: {url}",
        f"- **Language**: {lang}",
    ]
    if truncated:
        lines.append("- **Note**: extract truncated for length")
    lines.extend(
        [
            "",
            "Use titles from this page only as listed. For UVA Library availability, "
            "call Virgo catalog tools — do not invent holdings.",
            "",
            extract or "(No extract text.)",
        ]
    )
    return "\n".join(lines)


def _safe_lang(language: str) -> str:
    lang = (language or DEFAULT_LANG).strip().lower()
    if not re.fullmatch(r"[a-z]{2,10}", lang):
        return DEFAULT_LANG
    return lang


def _strip_html(raw: str) -> str:
    text = re.sub(r"<[^>]+>", "", raw or "")
    return re.sub(r"\s+", " ", text).strip()
