"""
github_tools.py — read-only GitHub tools for Hoo Helper, limited to the uvalib organization.

A filtered view of GitHub's hosted MCP server (github_mcp.py):
- only the allow-listed read tools reach the model, named GitHub___<tool>;
- every call is scoped to uvalib: owner is forced or checked, repo "uvalib/x" is split,
  searches get org:uvalib, and anything naming another owner (or that can't be parsed
  for one) is refused before GitHub is called; search hits from other owners are dropped;
- results are trimmed (files to 12,000 characters, lists to 20 items, binary files not
  shown), given github.com links, and credentials in them are redacted.

The factory switches the feature off (returns None) on any setup failure, so a broken
dependency or missing SSM parameter never takes Hoo Helper down. The private key and
tokens never appear in logs or tool output.
"""

from __future__ import annotations

import json
import logging
import os
import re
import threading
import time
from typing import Any, Callable, Dict, List, Optional, Tuple
from urllib.parse import quote, unquote

logger = logging.getLogger(__name__)

TOOL_PREFIX = "GitHub___"
DESCRIPTION_SUFFIX = " (GitHub, uvalib repos, read-only)"
ORG = "uvalib"

ALLOWED_TOOLS = frozenset({
    "get_commit", "get_file_contents", "get_label", "get_latest_release", "get_release_by_tag", "get_tag",
    "issue_read", "list_branches", "list_commits", "list_issue_fields", "list_issue_types", "list_issues",
    "list_pull_requests", "list_releases", "list_tags", "pull_request_read", "search_code", "search_commits",
    "search_issues", "search_pull_requests", "search_repositories",
})
SEARCH_TOOLS = frozenset({"search_code", "search_commits", "search_issues", "search_pull_requests",
                          "search_repositories"})

MAX_FILE_CHARS = 12_000
MAX_OUTPUT_CHARS = 20_000
MAX_ERROR_CHARS = 2_000
MAX_ITEMS = 20
MAX_FIELD_CHARS = 500  # per large field (body, patch, ...) of each listed item
TRIM_FIELDS = frozenset({"body", "patch", "diff", "fragment"})
MAX_TEXT_MATCHES = 3
PATH_ARGS = ("path", "sha", "tag", "name", "ref")
RETRY_AFTER_SEC = 600  # after a failed setup, stay off this long before trying again

MSG_UNAVAILABLE = "GitHub isn't available right now."
MSG_TOOL_REFUSED = "That GitHub tool isn't available to Hoo Helper."
MSG_OWNER_REFUSED = ("Hoo Helper can only read GitHub repos in the uvalib organization "
                     "(owner \"uvalib\", repo as a name like \"virgo4-client\").")
MSG_SEARCH_SCOPE_REFUSED = ("Hoo Helper can only search GitHub in the uvalib organization: leave out "
                            "org:/user:/repo:, or use repo:uvalib/<name>.")
MSG_SEARCH_BOOLEAN_REFUSED = ("Use plain search terms and qualifiers without OR, NOT, parentheses or "
                              "unbalanced quotes (searches are limited to uvalib).")
MSG_SEARCH_ISSUES_REPO = ("search_issues needs a repo: name it (repo:uvalib/<name>), or use list_issues on that "
                          "repo; for issues across all uvalib repos use search_pull_requests with is:issue in the query.")
MSG_SEARCH_UNCHECKED = ("GitHub's search reply couldn't be checked against the uvalib scope, so it isn't shown; "
                        "try a simpler search.")
MSG_DOTDOT_REFUSED = "Paths, refs and names can't contain a \"..\" segment."
MSG_EMPTY_SEARCH = "Give me something to search for."
MSG_BINARY = "(binary file, not shown)"
MSG_BAD_LINE_RANGE = "startLine and endLine must be whole numbers of 1 or more, with endLine at least startLine."

# Local paging for get_file_contents (GitHub's tool has no line range): stripped before the call.
LINE_RANGE_PROPS = {
    "startLine": {"type": "integer", "minimum": 1,
                  "description": "First line to show (1-based). Long files come in pages: the reply says which "
                                 "startLine to ask for next."},
    "endLine": {"type": "integer", "minimum": 1, "description": "Last line to show (inclusive)."},
}

_REPO_NAME = re.compile(r"^[A-Za-z0-9._-]+$")
_SCOPE_WORD = re.compile(r"(?i)(org|user|owner|repo)\s*:")
_SCOPE_QUALIFIER = re.compile(r"(?i)(?<![\w-])(-?)(org|user|owner|repo)\s*:\s*(\"[^\"]*\"|[^\s\"]*)")

REDACTED = "[redacted credential]"
_NOT_REDACTED = r"(?!\[redacted credential\])"
_PEM_BEGIN = re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----")
_PEM_END = re.compile(r"-----END [A-Z ]*PRIVATE KEY-----")
# Every pattern is linear-time: fixed-length bodies, or anchored at the start of a run (lookbehind) so
# a failed match can't be retried from every position inside a long run.
_REDACTIONS = [
    (re.compile(r"gh[pousr]_[A-Za-z0-9_]{20,}"), REDACTED),
    (re.compile(r"github_pat_[A-Za-z0-9_]{22,}"), REDACTED),
    (re.compile(r"AKIA[0-9A-Z]{16}"), REDACTED),
    (re.compile(r"ASIA[0-9A-Z]{16}"), REDACTED),  # temporary (STS) AWS keys
    (re.compile(r"AIza[0-9A-Za-z_-]{35}"), REDACTED),  # Google API keys
    (re.compile(r"(?<![A-Za-z0-9-])xox[abposr]-[A-Za-z0-9-]{10,}"), REDACTED),  # Slack tokens
    # Slack incoming webhooks: the last segment is the secret.
    (re.compile(r"(https://hooks\.slack\.com/services/T[A-Z0-9]+/B[A-Z0-9]+/)[A-Za-z0-9]+"), r"\1" + REDACTED),
    # Slack workflow and trigger webhooks: everything after the team id is the secret.
    (re.compile(r"(https://hooks\.slack\.com/(?:workflows|triggers)/T[A-Z0-9]+/)[A-Za-z0-9/_-]+"), r"\1" + REDACTED),
    # JWTs (header.payload.signature).
    (re.compile(r"(?<![A-Za-z0-9_-])eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}"), REDACTED),
    # A password in a URL: scheme://user:PASS@host keeps everything but PASS.
    (re.compile(r"(?<![A-Za-z0-9+.-])([A-Za-z][A-Za-z0-9+.-]*://[^\s:/@]+:)" + _NOT_REDACTED + r"[^\s@/]+(?=@)"),
     r"\1" + REDACTED),
    # key = value where the key mentions a secret (AWS_SECRET_ACCESS_KEY=, "client_secret": ...): only the
    # value goes. An optional (JSON-escaped) closing quote covers JSON/YAML keys; a quoted value is
    # redacted whole, spaces included. Anchored at the start of a key-like run, so it stays linear.
    (re.compile(r"(?<![A-Za-z0-9_.-])(?=[A-Za-z0-9_.-]*?(?i:password|passwd|secret|token|key))"
                r"([A-Za-z0-9_.-]+(?:\\?[\"'])?\s*[:=]\s*)" + _NOT_REDACTED
                + r"(\\\".*?\\\"|\"[^\"\n]*\"|'[^'\n]*'|\S+)"),
     r"\1" + REDACTED),
]


def _redact_private_keys(text: str) -> str:
    """BEGIN … END PRIVATE KEY blocks; an unterminated block (e.g. cut off) is redacted to the end.
    One forward scan, so many BEGINs without an END stay linear."""
    out, pos = [], 0
    while True:
        begin = _PEM_BEGIN.search(text, pos)
        if not begin:
            out.append(text[pos:])
            return "".join(out)
        out.append(text[pos:begin.start()])
        out.append(REDACTED)
        end = _PEM_END.search(text, begin.end())
        if not end:
            return "".join(out)
        pos = end.end()


def redact(text: str) -> str:
    text = _redact_private_keys(text)
    for pattern, repl in _REDACTIONS:
        text = pattern.sub(repl, text)
    return text


def _cap(text: str, limit: int, note: str = "") -> str:
    if len(text) <= limit:
        return text
    more = len(text) - limit
    return text[:limit] + f"\n\n(truncated — {more} more characters{note})"


class _Refused(Exception):
    """A call outside uvalib (or ambiguous); the message is shown to the model."""


# ---- scope -------------------------------------------------------------------

def _check_owner(value: Any) -> str:
    if not isinstance(value, str) or value.strip().lower() != ORG:
        raise _Refused(MSG_OWNER_REFUSED)
    return ORG


def _check_no_dotdot(args: Dict[str, Any]) -> None:
    for key in PATH_ARGS:
        value = args.get(key)
        if not isinstance(value, str):
            continue
        for _ in range(3):  # %2e%2e, %252e%252e
            value = unquote(value)
        if ".." in re.split(r"[/\\]", value):
            raise _Refused(MSG_DOTDOT_REFUSED)


def _scope_args(args: Dict[str, Any], *, tool: str) -> Dict[str, Any]:
    search = tool in SEARCH_TOOLS
    out = dict(args)
    _check_no_dotdot(out)
    if search:
        out.pop("fields", None)  # a fields subset can drop the owner fields the hit filter needs
    if "owner" in out:
        out["owner"] = _check_owner(out["owner"])
    if "repo" in out:
        repo = out["repo"]
        if not isinstance(repo, str):
            raise _Refused(MSG_OWNER_REFUSED)
        repo = repo.strip()
        if "/" in repo:
            owner, _, repo = repo.partition("/")
            _check_owner(owner)
        if not _REPO_NAME.match(repo) or repo in (".", ".."):
            raise _Refused(MSG_OWNER_REFUSED)
        out["repo"] = repo
        out["owner"] = ORG
    if not search:
        out["owner"] = ORG
    per_page = out.get("perPage")
    if isinstance(per_page, (int, float)) and not isinstance(per_page, bool) and per_page > MAX_ITEMS:
        out["perPage"] = MAX_ITEMS
    if search:
        out["query"] = _scope_query(out.get("query"), semantic=tool == "search_issues",
                                    repo_arg="repo" in out)
    return out


def _scope_query(query: Any, *, semantic: bool = False, repo_arg: bool = False) -> str:
    """The query limited to uvalib. semantic: GitHub's search_issues, which rejects org:/user:/owner:
    and so must be scoped by a repo (in the query, or the owner+repo arguments)."""
    if not isinstance(query, str) or not query.strip():
        raise _Refused(MSG_EMPTY_SEARCH)
    query = query.strip()
    if ("(" in query or ")" in query or query.count('"') % 2
            or re.search(r"(?<!\S)(?:OR|NOT)(?!\S)", query)):
        raise _Refused(MSG_SEARCH_BOOLEAN_REFUSED)
    qualifiers = list(_SCOPE_QUALIFIER.finditer(query))
    # Every "org:" / "repo:" ... in the text must be a qualifier we parsed (fail closed).
    if len(qualifiers) != len(_SCOPE_WORD.findall(query)):
        raise _Refused(MSG_SEARCH_SCOPE_REFUSED)
    for m in qualifiers:
        negated, kind, value = m.group(1), m.group(2).lower(), m.group(3).strip('"').strip()
        if negated:
            raise _Refused(MSG_SEARCH_SCOPE_REFUSED)
        if kind == "repo":
            owner, slash, name = value.partition("/")
            if owner.lower() != ORG or not slash or not _REPO_NAME.match(name) or name in (".", ".."):
                raise _Refused(MSG_SEARCH_SCOPE_REFUSED)
        elif value.lower() != ORG:
            raise _Refused(MSG_SEARCH_SCOPE_REFUSED)
    if semantic:
        kinds = {m.group(2).lower() for m in qualifiers}
        if kinds - {"repo"} or not (kinds or repo_arg):
            raise _Refused(MSG_SEARCH_ISSUES_REPO)
        return query
    return query if qualifiers else f"{query} org:{ORG}"


def _owner_of(item: Any) -> Optional[str]:
    """The owning account of a search hit, or None if it can't be told."""
    if not isinstance(item, dict):
        return None
    repo = item.get("repository")
    if isinstance(repo, str) and "/" in repo:
        return repo.split("/", 1)[0].lower()
    if isinstance(repo, dict):
        if isinstance(repo.get("full_name"), str) and "/" in repo["full_name"]:
            return repo["full_name"].split("/", 1)[0].lower()
        login = (repo.get("owner") or {}).get("login") if isinstance(repo.get("owner"), dict) else None
        if isinstance(login, str):
            return login.lower()
    if isinstance(item.get("full_name"), str) and "/" in item["full_name"]:
        return item["full_name"].split("/", 1)[0].lower()
    for key, prefix in (("repository_url", "https://api.github.com/repos/"), ("html_url", "https://github.com/")):
        url = item.get(key)
        if isinstance(url, str) and url.lower().startswith(prefix):
            return url[len(prefix):].split("/", 1)[0].lower()
    return None


# ---- rendering ---------------------------------------------------------------

_UVALIB_URL = "https://github.com/uvalib/"
_TEXT_MIMES = {
    "application/json", "application/xml", "application/javascript", "application/x-javascript",
    "application/yaml", "application/x-yaml", "application/toml", "application/x-sh", "application/sql",
    "application/graphql", "application/x-httpd-php", "application/ecmascript",
}


def _is_text_mime(mime: Any) -> bool:
    base = (mime or "").split(";")[0].strip().lower() if isinstance(mime, str) else ""
    return (not base or base.startswith("text/") or base in _TEXT_MIMES
            or base.endswith("+json") or base.endswith("+xml"))


def _uvalib_link(url: Any) -> Optional[str]:
    return url if isinstance(url, str) and url.lower().startswith(_UVALIB_URL) else None


def _item_link(item: Any) -> Optional[str]:
    if not isinstance(item, dict):
        return None
    link = _uvalib_link(item.get("html_url"))
    if link:
        return link
    repo, path = item.get("repository"), item.get("path")
    if isinstance(repo, dict):
        repo = repo.get("full_name")
    if isinstance(repo, str) and isinstance(path, str) and repo.lower().startswith(ORG + "/"):
        return f"https://github.com/{repo}/blob/HEAD/{quote(path, safe='/')}"
    return None


def _trim_value(value: Any) -> Any:
    if isinstance(value, str) and len(value) > MAX_FIELD_CHARS:
        # Redact first, so a cut can't leave a partial credential the patterns no longer match.
        value = redact(value)
        return value[:MAX_FIELD_CHARS].rstrip() + "…" if len(value) > MAX_FIELD_CHARS else value
    return value


def _trim_item(item: Any) -> Any:
    """Shorten the large free-text fields of one listed item."""
    if not isinstance(item, dict):
        return item
    out = {}
    for k, v in item.items():
        if k in TRIM_FIELDS:
            v = _trim_value(v)
        elif k == "text_matches" and isinstance(v, list):
            v = [_trim_item(m) for m in v[:MAX_TEXT_MATCHES]]
        out[k] = v
    return out


DROP_FIELDS = frozenset({"reactions", "performed_via_github_app"})


def _clean(value: Any, depth: int = 0) -> Any:
    """Drop fields that only add size: API URLs (every *_url but html_url), reactions, app details,
    user objects beyond login, labels beyond name."""
    if depth > 8:
        return value
    if isinstance(value, list):
        return [_clean(v, depth + 1) for v in value]
    if not isinstance(value, dict):
        return value
    out = {}
    for k, v in value.items():
        if k in DROP_FIELDS or (k.endswith("_url") and k != "html_url"):
            continue
        if k == "labels" and isinstance(v, list):
            v = [lab.get("name") if isinstance(lab, dict) else lab for lab in v]
        elif isinstance(v, dict) and isinstance(v.get("login"), str):
            v = v["login"]
        elif k == "assignees" and isinstance(v, list):
            v = [a.get("login") if isinstance(a, dict) else a for a in v]
        else:
            v = _clean(v, depth + 1)
        out[k] = v
    return out


def _short(text: Any, limit: int = 150) -> str:
    text = " ".join(str(text or "").split())
    return text if len(text) <= limit else text[:limit - 1].rstrip() + "…"


def _link_line(item: Any) -> Optional[str]:
    """One Links line: the URL plus what it is, so the list reads well even when the JSON is cut."""
    url = _item_link(item)
    if not url:
        return None
    number, title = item.get("number"), item.get("title")
    if isinstance(number, int) and not isinstance(number, bool):
        state = item.get("state")
        return (f"- {url} — #{number} {_short(title)}".rstrip()
                + (f" ({state})" if isinstance(state, str) and state else ""))
    repo, path = item.get("repository"), item.get("path")
    if isinstance(repo, dict):
        repo = repo.get("full_name")
    if isinstance(path, str) and isinstance(repo, str) and repo.lower().startswith(ORG + "/"):
        return f"- {url} — {path} in https://github.com/{repo}"
    full_name = item.get("full_name")
    if isinstance(full_name, str):
        desc = item.get("description")
        return f"- {url} — {full_name}" + (f": {_short(desc)}" if desc else "")
    sha = item.get("sha")
    if isinstance(sha, str):
        message = ((item.get("commit") or {}).get("message") if isinstance(item.get("commit"), dict) else "") or ""
        return f"- {url} — {sha[:7]} {_short(message.splitlines()[0] if message else '')}".rstrip()
    return f"- {url}"


def _render_json(data: Any, *, search: bool) -> str:
    notes: List[str] = []
    links: List[str] = []

    filtered = []

    def cap_list(items: List[Any], total: Any) -> List[Any]:
        kept = [i for i in items if _owner_of(i) == ORG] if search else items
        if len(kept) < len(items):
            filtered.append(True)
        shown = [_clean(_trim_item(i)) for i in kept[:MAX_ITEMS]]
        has_total = isinstance(total, int) and not isinstance(total, bool)
        if len(kept) < len(items):
            # Hits were dropped: GitHub's total no longer describes what's shown.
            if len(kept) > len(shown) or (has_total and total > len(items)):
                notes.append(f"(showing {len(shown)}; more available — ask for the next page)")
        else:
            total = total if has_total else len(items)
            if total > len(shown):
                notes.append(f"(showing {len(shown)} of {total}; more available — ask for the next page)")
        links.extend(line for line in (_link_line(i) for i in shown) if line)
        return shown

    if isinstance(data, list):
        data = cap_list(data, None)
    elif isinstance(data, dict):
        total = data.get("total_count", data.get("totalCount"))
        lists = [k for k, v in data.items() if isinstance(v, list)]
        for k in lists:
            data[k] = cap_list(data[k], total if len(lists) == 1 else None)
        if filtered:  # GitHub's total counts hits that were dropped
            data.pop("total_count", None)
            data.pop("totalCount", None)
        link = _uvalib_link(data.get("html_url"))
        if link:
            notes.append(f"Link: {link}")
        data = _clean(data)
    # Notes and links first: the overall cap may cut the end of the JSON, never these.
    head = list(notes)
    if links:
        head.append("Links:\n" + "\n".join(links))
    body = json.dumps(data, ensure_ascii=False)
    return "\n\n".join(head + [body])


def _render_text(text: str, *, search: bool) -> str:
    try:
        data = json.loads(text)
    except (ValueError, TypeError):
        data = None
    if not isinstance(data, (dict, list)):
        if search:  # the hit filter can't run on it
            raise _Refused(MSG_SEARCH_UNCHECKED)
        return text
    return _render_json(data, search=search)


_RESOURCE_URI = re.compile(r"^repo://(?P<owner>[^/]+)/(?P<repo>[^/]+)/(?:(?P<mid>.*?)/)?contents/(?P<path>.*)$")


def _ref_from(mid: str, args: Dict[str, Any]) -> str:
    for prefix in ("sha/", "refs/heads/", "refs/tags/"):
        if mid.startswith(prefix) and len(mid) > len(prefix):
            return mid[len(prefix):]
    for key in ("ref", "sha"):
        value = args.get(key)
        if isinstance(value, str) and value.strip():
            value = value.strip()
            for prefix in ("refs/heads/", "refs/tags/"):
                if value.startswith(prefix):
                    value = value[len(prefix):]
            return value
    return "HEAD"


def _pop_line_range(args: Dict[str, Any]) -> Tuple[Dict[str, Any], Optional[int], Optional[int]]:
    """Strip our local startLine/endLine from get_file_contents arguments and validate them."""
    args = dict(args)
    values = []
    for key in ("startLine", "endLine"):
        v = args.pop(key, None)
        if v is not None:
            if isinstance(v, bool) or not isinstance(v, (int, float)) or v != int(v) or v < 1:
                raise _Refused(MSG_BAD_LINE_RANGE)
            v = int(v)
        values.append(v)
    start, end = values
    if start is not None and end is not None and end < start:
        raise _Refused(MSG_BAD_LINE_RANGE)
    return args, start, end


def _page_lines(text: str, start: Optional[int], end: Optional[int]) -> str:
    """The requested lines of an (already redacted) file, at most MAX_FILE_CHARS, with a note on what
    was shown and which startLine comes next."""
    lines = text.splitlines(keepends=True)
    total = len(lines)
    first = start or 1
    if total == 0:
        return text
    if first > total:
        return f"(the file has {total} lines; startLine={first} is past the end)"
    chosen = lines[first - 1:min(end or total, total)]
    shown, size = [], 0
    for line in chosen:
        if size + len(line) > MAX_FILE_CHARS:
            break
        shown.append(line)
        size += len(line)
    if not shown:  # one line longer than the cap (minified code, data)
        line = chosen[0]
        more = len(line) - MAX_FILE_CHARS
        nxt = f"; ask for startLine={first + 1}" if first < total else ""
        return (line[:MAX_FILE_CHARS] + f"\n\n(line {first} of {total} shown only up to {MAX_FILE_CHARS} "
                f"characters; {more} more characters not shown{nxt})")
    last = first + len(shown) - 1
    body = "".join(shown)
    if first == 1 and last == total:
        return body
    nxt = f"; ask for startLine={last + 1}" if last < total else ""
    return body + f"\n\n(lines {first}–{last} of {total} shown{nxt})"


def _render_resource(res: Dict[str, Any], args: Dict[str, Any],
                     line_range: Tuple[Optional[int], Optional[int]] = (None, None)) -> str:
    m = _RESOURCE_URI.match(res.get("uri") or "") if isinstance(res.get("uri"), str) else None
    if m:
        if m.group("owner").lower() != ORG:
            raise _Refused(MSG_OWNER_REFUSED)
        repo, path, mid = m.group("repo"), m.group("path"), m.group("mid") or ""
    else:
        repo, path, mid = str(args.get("repo") or ""), str(args.get("path") or ""), ""
    path = path.lstrip("/")
    link = f"https://github.com/{ORG}/{quote(repo)}/blob/{quote(_ref_from(mid, args), safe='/')}/{quote(path, safe='/')}"
    head = f"File: {ORG}/{repo}/{path}\nLink: {link}"
    text = res.get("text")
    if res.get("blob") is not None or not isinstance(text, str) or not _is_text_mime(res.get("mimeType")):
        return f"{head}\n{MSG_BINARY}"
    # Redact the whole file first, then page by lines, then cap: a cut never splits a credential.
    return f"{head}\n\n" + _page_lines(redact(text), *line_range)


def render_result(result: Dict[str, Any], *, tool: str, args: Dict[str, Any],
                  line_range: Tuple[Optional[int], Optional[int]] = (None, None)) -> str:
    items = result.get("content") if isinstance(result, dict) else None
    items = items if isinstance(items, list) else []
    if result.get("isError"):
        text = "\n".join(i.get("text") for i in items if isinstance(i, dict) and isinstance(i.get("text"), str))
        return _cap(redact(text or "GitHub returned an error."), MAX_ERROR_CHARS)
    has_resource = any(isinstance(i, dict) and i.get("type") == "resource" for i in items)
    parts: List[str] = []
    for i in items:
        if not isinstance(i, dict):
            continue
        if i.get("type") == "resource" and isinstance(i.get("resource"), dict):
            parts.append(_render_resource(i["resource"], args, line_range))
        elif isinstance(i.get("text"), str):
            if has_resource and i["text"].startswith("successfully downloaded"):
                continue
            parts.append(_render_text(i["text"], search=tool in SEARCH_TOOLS))
    out = "\n\n".join(p for p in parts if p) or "(GitHub returned nothing.)"
    return _cap(redact(out), MAX_OUTPUT_CHARS)


# ---- tool set ----------------------------------------------------------------

class GitHubTools:
    def __init__(self, client):
        self.client = client

    def tool_specs(self) -> List[Dict[str, Any]]:
        try:
            tools = self.client.list_tools()
        except (KeyboardInterrupt, SystemExit):
            raise
        except BaseException as e:  # noqa: BLE001 — GitHub down (or a pyo3 panic): no GitHub tools, never a crash
            logger.warning("github tools/list failed: %s", type(e).__name__)
            return []
        specs = []
        for t in tools or []:
            name = t.get("name") if isinstance(t, dict) else None
            if name not in ALLOWED_TOOLS:
                continue
            schema = t.get("inputSchema")
            schema = dict(schema) if isinstance(schema, dict) else {"type": "object", "properties": {}}
            if name == "get_file_contents":
                props = schema.get("properties")
                schema["properties"] = {**(props if isinstance(props, dict) else {}), **LINE_RANGE_PROPS}
            specs.append({"toolSpec": {
                "name": TOOL_PREFIX + name,
                "description": redact(str(t.get("description") or name)) + DESCRIPTION_SUFFIX,
                "inputSchema": {"json": schema},
            }})
        return specs

    def handles(self, name: str) -> bool:
        return isinstance(name, str) and name.startswith(TOOL_PREFIX) and name[len(TOOL_PREFIX):] in ALLOWED_TOOLS

    def call(self, name: str, args: Dict[str, Any]) -> str:
        if not self.handles(name):
            return MSG_TOOL_REFUSED
        tool = name[len(TOOL_PREFIX):]
        args = args if isinstance(args, dict) else {}
        try:
            start = end = None
            if tool == "get_file_contents":
                args, start, end = _pop_line_range(args)
            scoped = _scope_args(args, tool=tool)
            result = self.client.call_tool(tool, scoped)
            return render_result(result if isinstance(result, dict) else {}, tool=tool, args=scoped,
                                 line_range=(start, end))
        except _Refused as e:
            logger.info("github_refused tool=%s", tool)
            return str(e)
        except (KeyboardInterrupt, SystemExit):
            raise
        except BaseException as e:  # noqa: BLE001 — incl. a pyo3 panic on an hourly re-mint
            user_message = getattr(e, "user_message", None)
            if user_message is not None and getattr(e, "code", None) is not None:
                # A JSON-RPC error from GitHub (bad arguments, unknown tool): its own words help the model.
                return _cap(redact(str(e)), MAX_ERROR_CHARS)
            logger.warning("github %s failed: %s", tool, type(e).__name__)
            return user_message if isinstance(user_message, str) else MSG_UNAVAILABLE


# ---- factory -----------------------------------------------------------------

_LOCK = threading.Lock()
_INSTANCE: Optional[GitHubTools] = None
_FAILED_AT = 0.0
_WARNED = False


def _reset_cache() -> None:
    """Tests only."""
    global _INSTANCE, _FAILED_AT, _WARNED
    _INSTANCE, _FAILED_AT, _WARNED = None, 0.0, False


def _boto3_ssm_get(name: str, decrypt: bool) -> str:
    import boto3

    ssm = boto3.client("ssm", region_name=os.environ.get("AWS_REGION", "us-east-1"))
    return ssm.get_parameter(Name=name, WithDecryption=decrypt)["Parameter"]["Value"]


def _build(ssm_get: Callable[[str, bool], str], http) -> GitHubTools:
    import requests

    # Imported here so a broken jwt/cryptography wheel only switches GitHub off.
    from github_auth import InstallationTokenMinter, load_credentials
    from github_mcp import GitHubMCPClient

    creds = load_credentials(ssm_get)
    if creds is None:
        raise LookupError("GitHub App credentials missing in SSM")
    http = http or requests
    minter = InstallationTokenMinter(creds, http=http)
    client = GitHubMCPClient(minter.token, invalidate=minter.invalidate, http=http)
    client.list_tools()  # proves the key, the token exchange and the MCP session work
    return GitHubTools(client)


def github_tools_for_env(env=None, *, ssm_get=None, http=None) -> Optional[GitHubTools]:
    """GitHub tools for this container, or None when switched off or not working."""
    global _INSTANCE, _FAILED_AT, _WARNED
    env = os.environ if env is None else env
    if str(env.get("ENABLE_GITHUB", "false")).strip().lower() != "true":
        return None
    with _LOCK:
        if _INSTANCE is not None:
            return _INSTANCE
        if _FAILED_AT and time.monotonic() - _FAILED_AT < RETRY_AFTER_SEC:
            return None
        try:
            _INSTANCE = _build(ssm_get or _boto3_ssm_get, http)
            logger.info("github tools on")
            return _INSTANCE
        except (KeyboardInterrupt, SystemExit):
            raise
        except BaseException as e:  # noqa: BLE001 — any setup failure (ImportError, pyo3 PanicException) switches GitHub off
            _FAILED_AT = time.monotonic()
            status = re.search(r"\(HTTP (\d{3})\)", str(e)) if type(e).__name__ == "GitHubAuthError" else None
            if status:  # GitHubAuthError messages carry only the status, never secrets
                logger.warning("github_auth_failed status=%s", status.group(1))
            if not _WARNED:
                _WARNED = True
                logger.warning("github tools off: setup failed (%s)", type(e).__name__)
            else:
                logger.info("github tools still off (%s)", type(e).__name__)
            return None
