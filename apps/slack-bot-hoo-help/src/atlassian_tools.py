"""
atlassian_tools.py — read-only Confluence and Jira tools for Hoo Helper.

In-process tools (like slack_search.py). Queries are built here — the model never
writes CQL or JQL — and every query is limited to the Library's allow-listed
spaces and projects. Results are re-checked against the allow-list in code, so a
page or issue from elsewhere is never returned even if the API lets it through.
"""

from __future__ import annotations

import logging
import os
import re
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

from atlassian_client import (
    AtlassianClient,
    AtlassianConfig,
    AtlassianError,
    confluence_link,
    jira_link,
    quote,
)
from atlassian_format import adf_to_text, storage_to_markdown, strip_highlight

logger = logging.getLogger(__name__)

TOOL_SEARCH_CONFLUENCE = "search_confluence"
TOOL_GET_PAGE = "get_confluence_page"
TOOL_SEARCH_JIRA = "search_jira"
TOOL_GET_ISSUE = "get_jira_issue"

MAX_EXCERPT_CHARS = 300
_PAGE_ID = re.compile(r"/pages/(\d+)")
_DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
_SPACE_KEYS: Dict[str, str] = {}  # Confluence spaceId → key, per container


def _reset_cache() -> None:
    """Tests only."""
    _SPACE_KEYS.clear()


def _spec(name: str, description: str, properties: Dict[str, Any], required: List[str]) -> Dict[str, Any]:
    return {"toolSpec": {"name": name, "description": description,
                         "inputSchema": {"json": {"type": "object", "properties": properties, "required": required}}}}


def _trim(text: str, limit: int) -> str:
    text = " ".join((text or "").split())
    return text if len(text) <= limit else text[: limit - 1].rstrip() + "…"


def _day(value: str) -> str:
    return (value or "")[:10]


CONFLUENCE_SEARCH_DESC = (
    "Search the Library's Confluence spaces (documentation, procedures, how-tos). Use short keyword "
    "queries and try a second phrasing before giving up. Optional: space (key), label, "
    "updated_after (YYYY-MM-DD), limit, page. Cite each page's link."
)
CONFLUENCE_PAGE_DESC = (
    "Read a Library Confluence page (pass page_id from search_confluence, or a page URL). Long pages "
    "come in chunks: call again with the offset it gives."
)
JIRA_SEARCH_DESC = (
    "Search the Library's Jira projects for work items and their status. Optional: text, project (key), "
    "status (a status name, or 'open' / 'done'), assignee / reporter (a name, or 'me' for the person "
    "asking), issue_type, updated_after / created_after (YYYY-MM-DD), limit. Cite issue keys and links."
)
JIRA_ISSUE_DESC = "Get one Library Jira issue by key (e.g. LIB-123): status, people, description, latest comments."


class AtlassianTools:
    def __init__(self, cfg: AtlassianConfig, *, asker_id: str, directory, confluence=None, jira=None):
        self.cfg = cfg
        self.asker_id = asker_id
        self.directory = directory
        self.confluence = confluence or AtlassianClient(cfg, product="confluence")
        self.jira = jira or AtlassianClient(cfg, product="jira")

    # ---- plumbing ------------------------------------------------------------

    def tool_specs(self) -> List[Dict[str, Any]]:
        specs: List[Dict[str, Any]] = []
        if self.cfg.confluence_enabled:
            specs.append(_spec(TOOL_SEARCH_CONFLUENCE, CONFLUENCE_SEARCH_DESC, {
                "query": {"type": "string"}, "space": {"type": "string"}, "label": {"type": "string"},
                "updated_after": {"type": "string"}, "limit": {"type": "integer"}, "page": {"type": "integer"},
            }, ["query"]))
            specs.append(_spec(TOOL_GET_PAGE, CONFLUENCE_PAGE_DESC, {
                "page_id_or_url": {"type": "string"}, "max_chars": {"type": "integer"},
                "offset": {"type": "integer"},
            }, ["page_id_or_url"]))
        if self.cfg.jira_enabled:
            specs.append(_spec(TOOL_SEARCH_JIRA, JIRA_SEARCH_DESC, {
                "text": {"type": "string"}, "project": {"type": "string"}, "status": {"type": "string"},
                "assignee": {"type": "string"}, "reporter": {"type": "string"},
                "issue_type": {"type": "string"}, "updated_after": {"type": "string"},
                "created_after": {"type": "string"}, "limit": {"type": "integer"},
            }, []))
            specs.append(_spec(TOOL_GET_ISSUE, JIRA_ISSUE_DESC, {
                "key": {"type": "string"}, "max_comments": {"type": "integer"},
            }, ["key"]))
        return specs

    def handles(self, name: str) -> bool:
        if name in (TOOL_SEARCH_CONFLUENCE, TOOL_GET_PAGE):
            return self.cfg.confluence_enabled
        if name in (TOOL_SEARCH_JIRA, TOOL_GET_ISSUE):
            return self.cfg.jira_enabled
        return False

    def call(self, name: str, args: Dict[str, Any]) -> str:
        args = args if isinstance(args, dict) else {}
        try:
            if name == TOOL_SEARCH_CONFLUENCE:
                return self.search_confluence(
                    str(args.get("query") or ""), space=str(args.get("space") or ""),
                    label=str(args.get("label") or ""), updated_after=str(args.get("updated_after") or ""),
                    limit=int(args.get("limit") or 5), page=int(args.get("page") or 1))
            if name == TOOL_GET_PAGE:
                return self.get_confluence_page(
                    str(args.get("page_id_or_url") or ""), max_chars=int(args.get("max_chars") or 6000),
                    offset=int(args.get("offset") or 0))
            if name == TOOL_SEARCH_JIRA:
                return self.search_jira(**{k: str(args.get(k) or "") for k in (
                    "text", "project", "status", "assignee", "reporter", "issue_type",
                    "updated_after", "created_after")}, limit=int(args.get("limit") or 10))
            if name == TOOL_GET_ISSUE:
                return self.get_jira_issue(str(args.get("key") or ""),
                                           max_comments=int(args.get("max_comments") or 10))
        except AtlassianError as e:
            return e.user_message
        except Exception as e:  # never hand the model a stack trace
            logger.warning("%s failed: %s", name, type(e).__name__)
            return "Confluence/Jira didn't respond as expected; try again in a minute."
        return f"Unknown Atlassian tool: {name}"

    # ---- Confluence ----------------------------------------------------------

    def _space_refusal(self) -> str:
        return f"That isn't in the Library's Confluence spaces (allowed: {', '.join(self.cfg.confluence_spaces)})."

    def search_confluence(self, query: str, space: str = "", label: str = "", updated_after: str = "",
                          limit: int = 5, page: int = 1) -> str:
        if not query.strip():
            return "Give me something to search for."
        limit = max(1, min(int(limit or 5), 20))
        page = max(1, int(page or 1))
        allowed = self.cfg.confluence_spaces
        clauses = [f"siteSearch ~ {quote(query)}", "type = page",
                   "space IN (" + ", ".join(quote(k) for k in allowed) + ")"]
        if space.strip():
            key = space.strip().upper()
            if key not in allowed:
                return self._space_refusal()
            clauses.append(f"space = {quote(key)}")
        if label.strip():
            clauses.append(f"label = {quote(label.strip())}")
        if updated_after.strip():
            if not _DATE.match(updated_after.strip()):
                return "Dates must be YYYY-MM-DD."
            clauses.append(f"lastmodified >= {quote(updated_after.strip())}")
        start = (page - 1) * limit
        data = self.confluence.get("/rest/api/search", params={
            "cql": " AND ".join(clauses), "limit": limit, "start": start, "excerpt": "highlight",
            "expand": "content.space,content.history.lastUpdated,content.ancestors",
        })
        hits = []
        for r in data.get("results") or []:
            content = r.get("content") or {}
            if ((content.get("space") or {}).get("key") or "").upper() in allowed:
                hits.append((r, content))
        if not hits:
            return f'No Confluence pages in the Library spaces matched "{query}".'
        lines = [f'### Confluence search: "{query}"', f"_Library spaces: {', '.join(allowed)}._", ""]
        for i, (r, content) in enumerate(hits, start + 1):
            title = strip_highlight(content.get("title") or r.get("title") or "Untitled page")
            sp = content.get("space") or {}
            crumbs = " › ".join(a.get("title", "") for a in content.get("ancestors") or [] if a.get("title"))
            updated = ((content.get("history") or {}).get("lastUpdated") or {})
            who = ((updated.get("by") or {}).get("displayName")) or ""
            lines.append(f"{i}. **{title}** — {sp.get('name') or sp.get('key')} ({sp.get('key')})"
                         + (f" · {crumbs}" if crumbs else ""))
            if updated.get("when") or who:
                lines.append(f"   Updated {_day(updated.get('when'))}" + (f" by {who}" if who else ""))
            excerpt = _trim(strip_highlight(r.get("excerpt") or ""), MAX_EXCERPT_CHARS)
            if excerpt:
                lines.append(f"   {excerpt}")
            webui = (content.get("_links") or {}).get("webui") or r.get("url") or ""
            lines.append(f"   Link: {confluence_link(self.cfg, webui)} (page_id {content.get('id')})")
        total = int(data.get("totalSize") or 0)
        if total > start + limit:
            lines.append(f"\nMore results: page {page + 1}.")
        return "\n".join(lines)

    def _space_key(self, space_id: str) -> str:
        if not space_id:
            return ""
        if space_id not in _SPACE_KEYS:
            data = self.confluence.get(f"/api/v2/spaces/{space_id}")
            _SPACE_KEYS[space_id] = (data.get("key") or "").upper()
        return _SPACE_KEYS[space_id]

    def get_confluence_page(self, page_id_or_url: str, max_chars: int = 6000, offset: int = 0) -> str:
        ref = (page_id_or_url or "").strip()
        m = _PAGE_ID.search(ref)
        page_id = m.group(1) if m else (ref if ref.isdigit() else "")
        if not page_id:
            return "Pass a Confluence page id (from search_confluence) or a page URL."
        data = self.confluence.get(f"/api/v2/pages/{page_id}", params={"body-format": "storage"})
        if self._space_key(str(data.get("spaceId") or "")) not in self.cfg.confluence_spaces:
            return self._space_refusal()
        title = data.get("title") or "Untitled page"
        body = ((data.get("body") or {}).get("storage") or {}).get("value") or ""
        text = storage_to_markdown(body, site=self.cfg.site) or "(This page has no text.)"
        max_chars = max(1, min(int(max_chars or 6000), 20000))
        offset = max(0, int(offset or 0))
        chunk = text[offset: offset + max_chars]
        link = confluence_link(self.cfg, (data.get("_links") or {}).get("webui") or f"/pages/{page_id}")
        out = [f"# {title}", f"Link: {link}", "", chunk]
        if offset + max_chars < len(text):
            out.append(f"\n(continues — call again with offset={offset + max_chars})")
        return "\n".join(out)

    # ---- Jira (Task 5) -------------------------------------------------------

    def search_jira(self, **kwargs) -> str:  # pragma: no cover - replaced in Task 5
        raise NotImplementedError

    def get_jira_issue(self, key: str, max_comments: int = 10) -> str:  # pragma: no cover
        raise NotImplementedError
