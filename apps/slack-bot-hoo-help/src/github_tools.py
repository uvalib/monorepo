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
from typing import Any, Callable, Dict, List, Optional
from urllib.parse import quote

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
RETRY_AFTER_SEC = 600  # after a failed setup, stay off this long before trying again

MSG_UNAVAILABLE = "GitHub isn't available right now."
MSG_TOOL_REFUSED = "That GitHub tool isn't available to Hoo Helper."
MSG_OWNER_REFUSED = ("Hoo Helper can only read GitHub repos in the uvalib organization "
                     "(owner \"uvalib\", repo as a name like \"virgo4-client\").")
MSG_SEARCH_SCOPE_REFUSED = ("Hoo Helper can only search GitHub in the uvalib organization: leave out "
                            "org:/user:/repo:, or use repo:uvalib/<name>.")
MSG_SEARCH_BOOLEAN_REFUSED = ("Use plain search terms and qualifiers without OR or parentheses "
                              "(searches are limited to uvalib).")
MSG_EMPTY_SEARCH = "Give me something to search for."
MSG_BINARY = "(binary file, not shown)"

_REPO_NAME = re.compile(r"^[A-Za-z0-9._-]+$")
_SCOPE_WORD = re.compile(r"(?i)(org|user|owner|repo)\s*:")
_SCOPE_QUALIFIER = re.compile(r"(?i)(?<![\w-])(-?)(org|user|owner|repo)\s*:\s*(\"[^\"]*\"|[^\s\"]*)")

REDACTED = "[redacted credential]"
_NOT_REDACTED = r"(?!\[redacted credential\])"
_REDACTIONS = [
    (re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----.*?-----END [A-Z ]*PRIVATE KEY-----", re.S), REDACTED),
    # An unterminated key block (e.g. cut off by GitHub): redact everything after BEGIN.
    (re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----.*", re.S), REDACTED),
    (re.compile(r"gh[pousr]_[A-Za-z0-9_]{20,}"), REDACTED),
    (re.compile(r"AKIA[0-9A-Z]{16}"), REDACTED),
    # key = value: only the value goes; an optional closing quote covers JSON/YAML keys.
    (re.compile(r"(?i)((?:password|passwd|secret|api[_-]?key|token)[\"']?\s*[:=]\s*)" + _NOT_REDACTED + r"\S+"),
     r"\1" + REDACTED),
]


def redact(text: str) -> str:
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


def _scope_args(args: Dict[str, Any], *, search: bool) -> Dict[str, Any]:
    out = dict(args)
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
        out["query"] = _scope_query(out.get("query"))
    return out


def _scope_query(query: Any) -> str:
    if not isinstance(query, str) or not query.strip():
        raise _Refused(MSG_EMPTY_SEARCH)
    query = query.strip()
    if "(" in query or ")" in query or re.search(r"(?<!\S)OR(?!\S)", query):
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


def _render_json(data: Any, *, search: bool) -> str:
    notes: List[str] = []
    links: List[str] = []

    def cap_list(items: List[Any], total: Any) -> List[Any]:
        if search:
            items = [i for i in items if _owner_of(i) == ORG]
        shown = items[:MAX_ITEMS]
        total = total if isinstance(total, int) and not isinstance(total, bool) else len(items)
        if total > len(shown):
            notes.append(f"(showing {len(shown)} of {total}; ask for the next page for more)")
        links.extend(link for link in (_item_link(i) for i in shown) if link)
        return shown

    if isinstance(data, list):
        data = cap_list(data, None)
    elif isinstance(data, dict):
        total = data.get("total_count", data.get("totalCount"))
        lists = [k for k, v in data.items() if isinstance(v, list)]
        for k in lists:
            data[k] = cap_list(data[k], total if len(lists) == 1 else None)
        link = _uvalib_link(data.get("html_url"))
        if link:
            notes.append(f"Link: {link}")
    out = json.dumps(data, ensure_ascii=False)
    if notes:
        out += "\n\n" + "\n".join(notes)
    if links:
        out += "\n\nLinks:\n" + "\n".join(f"- {u}" for u in links)
    return out


def _render_text(text: str, *, search: bool) -> str:
    try:
        data = json.loads(text)
    except (ValueError, TypeError):
        return text
    if not isinstance(data, (dict, list)):
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


def _render_resource(res: Dict[str, Any], args: Dict[str, Any]) -> str:
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
    return f"{head}\n\n" + _cap(redact(text), MAX_FILE_CHARS, "; ask for a line range")


def render_result(result: Dict[str, Any], *, tool: str, args: Dict[str, Any]) -> str:
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
            parts.append(_render_resource(i["resource"], args))
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
        except Exception as e:  # GitHub down: no GitHub tools this turn, never a crash
            logger.warning("github tools/list failed: %s", type(e).__name__)
            return []
        specs = []
        for t in tools or []:
            name = t.get("name") if isinstance(t, dict) else None
            if name not in ALLOWED_TOOLS:
                continue
            schema = t.get("inputSchema")
            schema = dict(schema) if isinstance(schema, dict) else {"type": "object", "properties": {}}
            specs.append({"toolSpec": {
                "name": TOOL_PREFIX + name,
                "description": str(t.get("description") or name) + DESCRIPTION_SUFFIX,
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
            scoped = _scope_args(args, search=tool in SEARCH_TOOLS)
            result = self.client.call_tool(tool, scoped)
            return render_result(result if isinstance(result, dict) else {}, tool=tool, args=scoped)
        except _Refused as e:
            logger.info("github_refused tool=%s", tool)
            return str(e)
        except Exception as e:
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
        except Exception as e:  # any setup failure (ImportError included) switches GitHub off
            _FAILED_AT = time.monotonic()
            if not _WARNED:
                _WARNED = True
                logger.warning("github tools off: setup failed (%s)", type(e).__name__)
            else:
                logger.info("github tools still off (%s)", type(e).__name__)
            return None
