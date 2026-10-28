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
_ME: Dict[str, str] = {}  # Slack user id → Atlassian accountId, per container
_ISSUE_KEY = re.compile(r"^[A-Z][A-Z0-9_]+-\d+$")
ISSUE_FIELDS = ["summary", "status", "assignee", "updated", "issuetype", "priority"]


# Read restrictions on a page or any parent hide it from most staff. The Hoo Helper
# account can see restricted pages (it's in IT groups), so those never reach an answer.
_READ_RESTRICTIONS = ("restrictions.read.restrictions.group", "restrictions.read.restrictions.user")


def _has_read_restriction(item: Dict[str, Any]) -> bool:
    """True when restricted, or when the restriction data is missing (fail closed)."""
    rr = (((item.get("restrictions") or {}).get("read") or {}).get("restrictions"))
    if not isinstance(rr, dict):
        return True
    return any((rr.get(kind) or {}).get("results") for kind in ("group", "user"))


def _read_restricted(content: Dict[str, Any]) -> bool:
    if not isinstance(content, dict):
        return True
    ancestors = content.get("ancestors") or []
    return _has_read_restriction(content) or any(
        not isinstance(a, dict) or _has_read_restriction(a) for a in ancestors)


def _reset_cache() -> None:
    """Tests only."""
    _SPACE_KEYS.clear()
    _ME.clear()


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

    def _page_refusal(self) -> str:
        return "That page isn't available to Hoo Helper."

    def _space_refusal(self) -> str:
        return ("That space isn't one of the Library's Confluence spaces Hoo Helper can search; "
                "leave out the space to search all of them.")

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
            "expand": ",".join(["content.space", "content.history.lastUpdated", "content.ancestors",
                                *(f"content.{e}" for e in _READ_RESTRICTIONS),
                                *(f"content.ancestors.{e}" for e in _READ_RESTRICTIONS)]),
        })
        hits = []
        for r in data.get("results") or []:
            content = r.get("content") or {}
            if ((content.get("space") or {}).get("key") or "").upper() in allowed \
                    and not _read_restricted(content):
                hits.append((r, content))
        if not hits:
            return f'No Confluence pages in the Library spaces matched "{query}".'
        lines = [f'### Confluence search: "{query}" (Library spaces)', ""]
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
        # The v2 page doesn't carry restrictions; ask v1 first and never fetch a restricted body.
        meta = self.confluence.get(f"/rest/api/content/{page_id}", params={"expand": ",".join(
            [*_READ_RESTRICTIONS, *(f"ancestors.{e}" for e in _READ_RESTRICTIONS)])})
        if _read_restricted(meta):
            return self._page_refusal()
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

    # ---- Jira --------------------------------------------------------------

    def _project_refusal(self) -> str:
        return f"That isn't in the Library's Jira projects (allowed: {', '.join(self.cfg.jira_projects)})."

    def _users(self, query: str) -> List[Dict[str, Any]]:
        data = self.jira.get("/rest/api/3/user/search", params={"query": query, "maxResults": 10})
        users = data if isinstance(data, list) else []
        return [u for u in users if u.get("accountId") and u.get("active", True)
                and u.get("accountType", "atlassian") == "atlassian"]

    def _account_id(self, name_or_me: str) -> Tuple[Optional[str], str]:
        """(accountId, '') or (None, sentence for the model)."""
        want = name_or_me.strip()
        if want.lower() in ("me", "@me", "myself"):
            if self.asker_id in _ME:
                return _ME[self.asker_id], ""
            email = self.directory.email(self.asker_id) if self.asker_id else ""
            users = self._users(email) if email else []
            # user/search is fuzzy: take an exact (visible) email match, else only a single hit.
            exact = [u for u in users if (u.get("emailAddress") or "").lower() == email.lower()]
            pick = exact if exact else users
            if len(pick) != 1:
                logger.info("atlassian_me=unmatched")
                return None, "I couldn't match your Slack account to a Jira account."
            logger.info("atlassian_me=matched")
            _ME[self.asker_id] = pick[0]["accountId"]
            return _ME[self.asker_id], ""
        users = self._users(want)
        exact = [u for u in users if (u.get("displayName") or "").lower() == want.lower()]
        pick = exact if exact else users
        if len(pick) == 1:
            return pick[0]["accountId"], ""
        if not pick:
            return None, f'I couldn\'t find a Jira user named "{want}".'
        names = ", ".join(sorted({u.get("displayName") or u["accountId"] for u in pick})[:5])
        return None, f'More than one person matches "{want}": {names}. Which one?'

    def search_jira(self, text: str = "", project: str = "", status: str = "", assignee: str = "",
                    reporter: str = "", issue_type: str = "", updated_after: str = "",
                    created_after: str = "", limit: int = 10) -> str:
        allowed = self.cfg.jira_projects
        limit = max(1, min(int(limit or 10), 50))
        clauses = ["project IN (" + ", ".join(quote(k) for k in allowed) + ")"]
        if project.strip():
            key = project.strip().upper()
            if key not in allowed:
                return self._project_refusal()
            clauses.append(f"project = {quote(key)}")
        if text.strip():
            clauses.append(f"text ~ {quote(text.strip())}")
        st = status.strip()
        if st.lower() == "open":
            clauses.append("statusCategory != Done")
        elif st.lower() == "done":
            clauses.append("statusCategory = Done")
        elif st:
            clauses.append(f"status = {quote(st)}")
        for field, who in (("assignee", assignee), ("reporter", reporter)):
            if who.strip():
                account, problem = self._account_id(who)
                if problem:
                    return problem
                clauses.append(f"{field} = {quote(account)}")
        if issue_type.strip():
            clauses.append(f"issuetype = {quote(issue_type.strip())}")
        for field, value in (("updated", updated_after), ("created", created_after)):
            if value.strip():
                if not _DATE.match(value.strip()):
                    return "Dates must be YYYY-MM-DD."
                clauses.append(f"{field} >= {quote(value.strip())}")
        jql = " AND ".join(clauses) + " ORDER BY updated DESC"
        data = self.jira.post("/rest/api/3/search/jql", {"jql": jql, "maxResults": limit, "fields": ISSUE_FIELDS})
        issues = [i for i in data.get("issues") or []
                  if str(i.get("key") or "").split("-")[0].upper() in allowed]
        if not issues:
            return f"No Jira issues in the Library projects matched.\nJQL: {jql}"
        rows = ["| Key | Summary | Status | Assignee | Updated |", "| --- | --- | --- | --- | --- |"]
        links = []
        for i in issues:
            f = i.get("fields") or {}
            summary = (f.get("summary") or "").replace("|", "\\|")
            rows.append(f"| {i['key']} | {summary} | {(f.get('status') or {}).get('name') or ''} | "
                        f"{(f.get('assignee') or {}).get('displayName') or 'Unassigned'} | {_day(f.get('updated'))} |")
            links.append(f"{i['key']} — {jira_link(self.cfg, i['key'])}")
        return "\n".join(["### Jira issues", ""] + rows + ["", "Links:"] + links + ["", f"JQL: {jql}"])

    def get_jira_issue(self, key: str, max_comments: int = 10) -> str:
        key = (key or "").strip().upper()
        if not _ISSUE_KEY.match(key):
            return "Pass a Jira issue key like LIB-123."
        if key.split("-")[0] not in self.cfg.jira_projects:
            return self._project_refusal()
        data = self.jira.get(f"/rest/api/3/issue/{key}", params={"fields": ",".join(ISSUE_FIELDS + [
            "reporter", "created", "labels", "components", "issuelinks", "description", "project"])})
        f = data.get("fields") or {}
        # Jira follows moved issues: check the issue it returned, not just the key we asked for.
        key = str(data.get("key") or key).upper()
        project = str((f.get("project") or {}).get("key") or key.split("-")[0]).upper()
        if key.split("-")[0] not in self.cfg.jira_projects or project not in self.cfg.jira_projects:
            return self._project_refusal()
        name = lambda d: (d or {}).get("name") or ""  # noqa: E731
        person = lambda d: (d or {}).get("displayName") or ""  # noqa: E731
        lines = [f"# {key}: {f.get('summary') or '(no summary)'}",
                 f"Link: {jira_link(self.cfg, key)}",
                 f"- Type: {name(f.get('issuetype'))} · Status: {name(f.get('status'))} · Priority: {name(f.get('priority'))}",
                 f"- Assignee: {person(f.get('assignee')) or 'Unassigned'} · Reporter: {person(f.get('reporter'))}",
                 f"- Created: {_day(f.get('created'))} · Updated: {_day(f.get('updated'))}"]
        if f.get("labels"):
            lines.append("- Labels: " + ", ".join(f["labels"]))
        if f.get("components"):
            lines.append("- Components: " + ", ".join(name(c) for c in f["components"]))
        for link in f.get("issuelinks") or []:
            t = link.get("type") or {}
            if link.get("outwardIssue"):
                other, verb = link["outwardIssue"], t.get("outward") or "relates to"
            else:
                other, verb = link.get("inwardIssue") or {}, t.get("inward") or "relates to"
            if other.get("key"):
                lines.append(f"- {verb} {other['key']}: {(other.get('fields') or {}).get('summary') or ''}".rstrip(": "))
        lines += ["", "## Description", adf_to_text(f.get("description")) or "(no description)"]
        max_comments = max(0, min(int(max_comments or 10), 20))
        if max_comments:
            comments = self.jira.get(f"/rest/api/3/issue/{key}/comment",
                                     params={"orderBy": "-created", "maxResults": max_comments}).get("comments") or []
            if comments:
                lines += ["", "## Latest comments"]
                for c in comments:
                    lines.append(f"- {person(c.get('author'))} ({_day(c.get('created'))}): "
                                 f"{_trim(adf_to_text(c.get('body')), 500)}")
        return "\n".join(lines)


def atlassian_tools_for_event(event: Dict[str, Any], *, directory, env=None, email: str = "",
                              token: str = "", jira_token: str = "",
                              confluence_token: str = "") -> Optional[AtlassianTools]:
    """Confluence/Jira tools for this turn, or None when switched off or not configured."""
    env = os.environ if env is None else env
    if str(env.get("ENABLE_ATLASSIAN", "false")).strip().lower() != "true":
        return None
    cfg = AtlassianConfig.from_env(env, email=email, token=token, jira_token=jira_token,
                                   confluence_token=confluence_token)
    if not (cfg.confluence_enabled or cfg.jira_enabled):
        return None
    return AtlassianTools(cfg, asker_id=event.get("user") or "", directory=directory)
