#!/usr/bin/env python3
"""GitHub tools: allow-list, uvalib scope, rendering, redaction, factory (fake client, no network)."""

import base64
import json
import logging
import os
import re
import sys
from datetime import datetime, timezone

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

import github_tools  # noqa: E402
from github_auth import GitHubAuthError  # noqa: E402
from github_mcp import GitHubMCPError  # noqa: E402
from github_tools import ALLOWED_TOOLS, TOOL_PREFIX, GitHubTools, github_tools_for_env  # noqa: E402

SUFFIX = " (GitHub, uvalib repos, read-only)"
REDACTED = "[redacted credential]"
TOKEN = "ghs_LIVETOKEN" + "q" * 30

_KEY = rsa.generate_private_key(public_exponent=65537, key_size=2048)
PRIVATE_PEM = _KEY.private_bytes(
    serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()).decode()


def _tool(name):
    return {"name": name, "description": f"GitHub's {name}.",
            "inputSchema": {"type": "object", "properties": {"owner": {"type": "string"}},
                            "required": ["owner"]}}


def _text(t, is_error=None):
    out = {"content": [{"type": "text", "text": t}]}
    if is_error is not None:
        out["isError"] = is_error
    return out


def _file(text=None, blob=None, mime="text/plain; charset=utf-8", repo="virgo4-client", path="src/app.js",
          ref_part="sha/73ddeb4f"):
    mid = f"{ref_part}/" if ref_part else ""
    res = {"uri": f"repo://uvalib/{repo}/{mid}contents/{path}", "mimeType": mime}
    if text is not None:
        res["text"] = text
    if blob is not None:
        res["blob"] = blob
    return {"content": [{"type": "text", "text": "successfully downloaded text file (SHA: abc123)"},
                        {"type": "resource", "resource": res}]}


class FakeClient:
    def __init__(self, tools=None, result=None, error=None):
        self.tools = tools if tools is not None else [_tool(n) for n in sorted(ALLOWED_TOOLS)]
        self.result = result if result is not None else _text("{}")
        self.error = error
        self.calls = []

    def list_tools(self):
        return self.tools

    def call_tool(self, name, args):
        self.calls.append((name, dict(args)))
        if self.error:
            raise self.error
        return self.result


def _gh(**kw):
    c = FakeClient(**kw)
    return GitHubTools(c), c


# ---- exposure --------------------------------------------------------------

def test_only_allowed_tools_exposed_with_prefix_and_suffix():
    tools, _ = _gh(tools=[_tool(n) for n in sorted(ALLOWED_TOOLS)]
                   + [_tool("list_repository_collaborators"), _tool("create_issue")])
    specs = tools.tool_specs()
    names = {s["toolSpec"]["name"] for s in specs}
    assert names == {TOOL_PREFIX + n for n in ALLOWED_TOOLS}
    assert len(ALLOWED_TOOLS) == 21 and "list_repository_collaborators" not in ALLOWED_TOOLS
    for s in specs:
        spec = s["toolSpec"]
        base = spec["name"][len(TOOL_PREFIX):]
        assert spec["description"] == f"GitHub's {base}." + SUFFIX
        assert spec["inputSchema"]["json"]["properties"]["owner"] == {"type": "string"}
    assert TOOL_PREFIX == "GitHub___"
    assert tools.handles("GitHub___search_code")
    assert not tools.handles("GitHub___create_issue")
    assert not tools.handles("GitHub___list_repository_collaborators")
    assert not tools.handles("search_code")


def test_tool_specs_survive_list_failure():
    c = FakeClient()
    c.list_tools = lambda: (_ for _ in ()).throw(GitHubMCPError("boom", "GitHub is busy; try again in a minute."))
    assert GitHubTools(c).tool_specs() == []


def test_unlisted_tool_call_refused_without_calling_github():
    tools, c = _gh()
    for name in ("GitHub___create_issue", "GitHub___list_repository_collaborators", "create_issue",
                 "search_code", "GitHub___"):
        out = tools.call(name, {"owner": "uvalib", "repo": "x"})
        assert "isn't available" in out or "not available" in out, out
    assert c.calls == []


# ---- scope -----------------------------------------------------------------

def test_owner_must_be_uvalib():
    tools, c = _gh()
    tools.call("GitHub___list_issues", {"owner": "UVALib", "repo": "virgo4-client"})
    assert c.calls == [("list_issues", {"owner": "uvalib", "repo": "virgo4-client"})]
    c.calls.clear()
    for bad in ("torvalds", "uvalib-archive", "", None, 7, ["uvalib"], "uvalib/x"):
        out = tools.call("GitHub___list_issues", {"owner": bad, "repo": "linux"})
        assert "uvalib" in out
    assert c.calls == []


def test_owner_defaulted_when_missing():
    tools, c = _gh()
    tools.call("GitHub___list_issue_types", {})
    assert c.calls == [("list_issue_types", {"owner": "uvalib"})]


def test_repo_given_as_owner_slash_name_is_split():
    tools, c = _gh()
    tools.call("GitHub___get_file_contents", {"repo": "uvalib/virgo4-client", "path": "README.md"})
    assert c.calls == [("get_file_contents", {"owner": "uvalib", "repo": "virgo4-client", "path": "README.md"})]
    c.calls.clear()
    tools.call("GitHub___get_file_contents", {"owner": "uvalib", "repo": "UVALib/virgo4-client"})
    assert c.calls[0][1]["owner"] == "uvalib" and c.calls[0][1]["repo"] == "virgo4-client"
    c.calls.clear()
    for bad in ({"repo": "torvalds/linux"}, {"owner": "uvalib", "repo": "other/x"},
                {"repo": "uvalib/a/b"}, {"repo": "../x"}, {"repo": 5}, {"repo": "x y"}):
        tools.call("GitHub___get_file_contents", bad)
    assert c.calls == []


def test_search_gets_org_uvalib():
    tools, c = _gh()
    tools.call("GitHub___search_code", {"query": "hold"})
    assert c.calls[-1] == ("search_code", {"query": "hold org:uvalib"})
    tools.call("GitHub___search_code", {"query": "hold repo:uvalib/x"})
    assert c.calls[-1] == ("search_code", {"query": "hold repo:uvalib/x"})
    tools.call("GitHub___search_repositories", {"query": "language:ruby ORG:UVALib"})
    assert c.calls[-1][1]["query"] == "language:ruby ORG:UVALib"
    tools.call("GitHub___search_pull_requests", {"query": "hold user:uvalib is:open"})
    assert c.calls[-1][1]["query"] == "hold user:uvalib is:open"
    tools.call("GitHub___search_pull_requests", {"query": "bump", "owner": "UVALib", "repo": "virgo4-client"})
    assert c.calls[-1] == ("search_pull_requests",
                           {"query": "bump org:uvalib", "owner": "uvalib", "repo": "virgo4-client"})


def test_search_other_org_refused():
    tools, c = _gh()
    for q in ("hold org:github", "hold user:x", "hold repo:other/x", "x repo:uvalib/a repo:other/b",
              "x -org:uvalib", "x org:\"github\"", "x org: github", "x owner:github", "x repo:uvalib",
              "x repo:uvalib/a,other/b", "a OR b", "(a org:uvalib)", "", None, 5,
              "func main NOT org:uvalib", "NOT hold", "a NOT b", 'say "hold', 'a "b" "c'):
        out = tools.call("GitHub___search_code", {"query": q})
        assert "uvalib" in out or "search" in out.lower(), (q, out)
    tools.call("GitHub___search_issues", {"query": "x", "owner": "github"})
    assert c.calls == []


def test_search_issues_needs_a_repo_not_org():
    # search_issues is semantic on GitHub's server: it rejects org:/user:/owner:, so it must name a repo.
    tools, c = _gh()
    tools.call("GitHub___search_issues", {"query": "login fails repo:uvalib/virgo4-client"})
    assert c.calls[-1] == ("search_issues", {"query": "login fails repo:uvalib/virgo4-client"})
    tools.call("GitHub___search_issues", {"query": "login fails", "owner": "UVALib", "repo": "virgo4-client"})
    assert c.calls[-1] == ("search_issues",
                           {"query": "login fails", "owner": "uvalib", "repo": "virgo4-client"})
    tools.call("GitHub___search_issues", {"query": "login fails", "repo": "uvalib/virgo4-client"})
    assert c.calls[-1][1] == {"query": "login fails", "owner": "uvalib", "repo": "virgo4-client"}
    n = len(c.calls)
    guidance = ("search_issues needs a repo: name it (repo:uvalib/<name>), or use list_issues on that repo; "
                "for issues across all uvalib repos use search_pull_requests with is:issue in the query.")
    for args in ({"query": "login fails"}, {"query": "login fails", "owner": "uvalib"},
                 {"query": "login fails org:uvalib"}, {"query": "login user:uvalib"}):
        assert tools.call("GitHub___search_issues", args) == guidance, args
    assert tools.call("GitHub___search_issues", {"query": "x repo:other/y"}) != guidance
    assert len(c.calls) == n


def test_search_fields_argument_stripped():
    tools, c = _gh()
    tools.call("GitHub___search_code", {"query": "hold", "fields": ["path"]})
    assert "fields" not in c.calls[-1][1]
    tools.call("GitHub___list_commits", {"owner": "uvalib", "repo": "x", "fields": ["sha"]})
    assert c.calls[-1][1]["fields"] == ["sha"]


def test_search_non_json_result_refused():
    tools, _ = _gh(result=_text("torvalds/linux: main.c matched"))
    out = tools.call("GitHub___search_code", {"query": "x"})
    assert "torvalds" not in out


def test_dotdot_path_segments_refused():
    tools, c = _gh()
    for key, value in (("path", "../secrets"), ("path", "a/../../b"), ("path", "%2e%2e/x"), ("path", "a/%2E%2E"),
                       ("path", "a/%252e%252e/b"), ("path", "..\\x"), ("ref", "../main"), ("sha", ".."),
                       ("tag", "v1/../../x"), ("name", "../x")):
        out = tools.call("GitHub___get_file_contents", {"owner": "uvalib", "repo": "x", key: value})
        assert ".." in out or "path" in out.lower(), (key, value, out)
    assert c.calls == []
    tools.call("GitHub___get_file_contents", {"owner": "uvalib", "repo": "x", "path": "a/..b/c..d/.x"})
    assert len(c.calls) == 1


def test_search_paging_note_after_filter():
    body = {"total_count": 900, "items": [{"path": f"{i}.go", "repository": "uvalib/a" if i % 2 else "other/b"}
                                          for i in range(30)]}
    tools, _ = _gh(result=_text(json.dumps(body)))
    out = tools.call("GitHub___search_code", {"query": "x"})
    assert "900" not in out and "of 30" not in out
    assert "showing 15" in out and "more available" in out


def test_search_results_from_other_owners_dropped():
    body = {"total_count": 3, "items": [
        {"name": "a.go", "path": "a.go", "repository": "uvalib/a"},
        {"name": "b.go", "path": "b.go", "repository": "torvalds/linux"},
        {"name": "c.go", "path": "c.go"},
    ]}
    tools, _ = _gh(result=_text(json.dumps(body)))
    out = tools.call("GitHub___search_code", {"query": "x"})
    assert "uvalib/a" in out and "torvalds" not in out and "c.go" not in out


def test_per_page_clamped():
    tools, c = _gh()
    tools.call("GitHub___list_commits", {"owner": "uvalib", "repo": "x", "perPage": 100})
    assert c.calls[-1][1]["perPage"] == 20


# ---- rendering -------------------------------------------------------------

def test_file_resource_rendered_and_capped():
    text = "a" * 30_000
    tools, _ = _gh(result=_file(text=text))
    out = tools.call("GitHub___get_file_contents", {"owner": "uvalib", "repo": "virgo4-client", "path": "src/app.js"})
    assert "a" * 12_000 in out and "a" * 12_001 not in out
    # One 30,000-character line can't be paged by lines: say how much is missing, offer no range.
    assert "18000 more characters" in out and "line range" not in out
    assert len(out) < 13_000


FILE_LINES = [f"{i:05d} " + "x" * 23 + "\n" for i in range(1, 1101)]  # 1,100 lines, 33,000 characters
FILE_TEXT = "".join(FILE_LINES)
FILE_ARGS = {"owner": "uvalib", "repo": "virgo4-client", "path": "src/app.js"}


def test_get_file_contents_schema_offers_line_range():
    tools, _ = _gh()
    spec = next(s["toolSpec"] for s in tools.tool_specs() if s["toolSpec"]["name"] == "GitHub___get_file_contents")
    props = spec["inputSchema"]["json"]["properties"]
    assert props["startLine"]["type"] == "integer" and props["endLine"]["type"] == "integer"
    assert "owner" in props
    other = next(s["toolSpec"] for s in tools.tool_specs() if s["toolSpec"]["name"] == "GitHub___list_issues")
    assert "startLine" not in other["inputSchema"]["json"]["properties"]


def test_large_file_readable_in_pages():
    assert len(FILE_TEXT) == 33_000
    tools, c = _gh(result=_file(text=FILE_TEXT))
    out = tools.call("GitHub___get_file_contents", dict(FILE_ARGS))
    assert "(lines 1–400 of 1100 shown; ask for startLine=401)" in out, out[-200:]
    got, start = [], 1
    for _ in range(10):
        args = dict(FILE_ARGS, startLine=start) if start > 1 else dict(FILE_ARGS)
        out = tools.call("GitHub___get_file_contents", args)
        body = out.split("\n\n", 1)[1]
        m = re.search(r"\n\n\(lines (\d+)–(\d+) of 1100 shown(?:; ask for startLine=(\d+))?\)$", body)
        assert m, body[-120:]
        got.append(body[:m.start()])
        assert int(m.group(1)) == start
        if not m.group(3):
            assert m.group(2) == "1100"
            break
        start = int(m.group(3))
    assert "".join(got) == FILE_TEXT
    for name, args in c.calls:
        assert "startLine" not in args and "endLine" not in args


def test_line_range_slices_after_redaction():
    text = "a\nkey: -----BEGIN PRIVATE KEY-----\nMIIsecret\n-----END PRIVATE KEY-----\nb\nc\n"
    tools, _ = _gh(result=_file(text=text))
    out = tools.call("GitHub___get_file_contents", dict(FILE_ARGS, startLine=3, endLine=4))
    assert "MIIsecret" not in out
    out = tools.call("GitHub___get_file_contents", dict(FILE_ARGS, startLine=2, endLine=2))
    assert "MIIsecret" not in out and REDACTED in out


def test_line_range_past_end_and_bad_values():
    tools, c = _gh(result=_file(text=FILE_TEXT))
    out = tools.call("GitHub___get_file_contents", dict(FILE_ARGS, startLine=5000))
    assert "1100 lines" in out and "5000" in out and "00001" not in out
    out = tools.call("GitHub___get_file_contents", dict(FILE_ARGS, startLine=10, endLine=12))
    assert "00010" in out and "00012" in out and "00013" not in out and "00009" not in out
    assert "(lines 10–12 of 1100 shown; ask for startLine=13)" in out
    for bad in ({"startLine": 0}, {"startLine": "x"}, {"startLine": 5, "endLine": 2}, {"endLine": -1},
                {"startLine": True}):
        n = len(c.calls)
        out = tools.call("GitHub___get_file_contents", dict(FILE_ARGS, **bad))
        assert "startLine" in out or "endLine" in out, (bad, out[:100])
        assert len(c.calls) == n
    for name, args in c.calls:
        assert "startLine" not in args and "endLine" not in args


def test_short_file_rendered_whole():
    tools, _ = _gh(result=_file(text="# Virgo\nhello"))
    out = tools.call("GitHub___get_file_contents", {"owner": "uvalib", "repo": "virgo4-client", "path": "README.md"})
    assert "# Virgo\nhello" in out and "truncated" not in out


def test_binary_file_not_shown():
    blob = base64.b64encode(b"\x89PNG" + b"\0" * 5000).decode()
    for result in (_file(blob=blob, mime="image/png", path="logo.png"),
                   _file(text="\x89PNG garbage", mime="image/png", path="logo.png"),
                   _file(blob=blob, mime="text/plain", path="logo.png")):
        tools, _ = _gh(result=result)
        out = tools.call("GitHub___get_file_contents", {"owner": "uvalib", "repo": "virgo4-client", "path": "logo.png"})
        assert "binary file, not shown" in out
        assert "https://github.com/uvalib/virgo4-client/blob/73ddeb4f/logo.png" in out
        assert blob[:40] not in out and "garbage" not in out
        assert len(out) < 1000


def test_lists_capped_at_20():
    issues = [{"number": i, "title": f"t{i}", "html_url": f"https://github.com/uvalib/x/issues/{i}"}
              for i in range(50)]
    tools, _ = _gh(result=_text(json.dumps({"issues": issues, "totalCount": 50})))
    out = tools.call("GitHub___list_issues", {"owner": "uvalib", "repo": "x"})
    assert '"t19"' in out and '"t20"' not in out
    assert "20 of 50" in out
    prs = [{"number": i, "title": f"p{i}", "html_url": f"https://github.com/uvalib/x/pull/{i}"} for i in range(30)]
    tools, _ = _gh(result=_text(json.dumps(prs)))
    out = tools.call("GitHub___list_pull_requests", {"owner": "uvalib", "repo": "x"})
    assert '"p19"' in out and '"p20"' not in out
    items = [{"full_name": f"uvalib/r{i}", "html_url": f"https://github.com/uvalib/r{i}"} for i in range(40)]
    tools, _ = _gh(result=_text(json.dumps({"total_count": 40, "items": items})))
    out = tools.call("GitHub___search_repositories", {"query": "x"})
    assert "uvalib/r19" in out and "uvalib/r20" not in out


def test_big_items_keep_links_and_note():
    prs = [{"number": i, "title": f"p{i}", "body": "b" * 5000, "patch": "p" * 5000,
            "text_matches": [{"fragment": "f" * 5000}] * 5,
            "html_url": f"https://github.com/uvalib/x/pull/{i}"} for i in range(25)]
    for tool, payload, args in (
            ("list_pull_requests", prs, {"owner": "uvalib", "repo": "x"}),
            ("search_pull_requests", {"total_count": 25, "items": [dict(p, repository_url=
                "https://api.github.com/repos/uvalib/x") for p in prs]}, {"query": "bump"})):
        tools, _ = _gh(result=_text(json.dumps(payload)))
        out = tools.call("GitHub___" + tool, args)
        for i in range(20):
            assert f"- https://github.com/uvalib/x/pull/{i} — #{i} p{i}" in out, (tool, i)
        assert "more available" in out or "20 of 25" in out
        assert "b" * 501 not in out and "p" * 501 not in out and "f" * 501 not in out
        assert "…" in out
        assert out.index("Links:") < out.index('"title"')
    # The reviewer's case: 20 items with 5 KB bodies fit whole once trimmed.
    tools, _ = _gh(result=_text(json.dumps([{"number": i, "body": "b" * 5000,
                                             "html_url": f"https://github.com/uvalib/x/pull/{i}"}
                                            for i in range(20)])))
    out = tools.call("GitHub___list_pull_requests", {"owner": "uvalib", "repo": "x"})
    assert "truncated" not in out and out.count("https://github.com/uvalib/x/pull/") == 40


def test_trimmed_fields_redacted_first():
    tok = "ghp_" + "Z" * 40
    prs = [{"number": 1, "body": "x" * 490 + tok, "html_url": "https://github.com/uvalib/x/pull/1"}]
    tools, _ = _gh(result=_text(json.dumps(prs)))
    out = tools.call("GitHub___list_pull_requests", {"owner": "uvalib", "repo": "x"})
    assert "ghp_" not in out


def _links(out):
    return out.split("Links:\n", 1)[1].split("\n\n", 1)[0].splitlines()


def test_link_lines_describe_each_item():
    issues = [{"number": i, "title": f"Title {i}", "state": "open", "body": "b" * 20_000,
               "user": {"login": "lou", "id": 1, "avatar_url": "x", "type": "User"},
               "reactions": {"+1": 1, "url": "y"}, "labels": [{"name": "bug", "color": "f00", "id": 3}],
               "comments_url": "https://api.github.com/x", "repository_url": "https://api.github.com/repos/uvalib/x",
               "performed_via_github_app": {"id": 1}, "html_url": f"https://github.com/uvalib/x/issues/{i}"}
              for i in range(20)]
    tools, _ = _gh(result=_text(json.dumps({"issues": issues, "totalCount": 20})))
    out = tools.call("GitHub___list_issues", {"owner": "uvalib", "repo": "x"})
    lines = _links(out)
    assert lines == [f"- https://github.com/uvalib/x/issues/{i} — #{i} Title {i} (open)" for i in range(20)]
    data = json.loads(out.rsplit("\n\n", 1)[1])
    item = data["issues"][0]
    assert item["user"] == "lou" and item["labels"] == ["bug"]
    for k in ("reactions", "comments_url", "repository_url", "performed_via_github_app"):
        assert k not in item
    assert item["html_url"] == "https://github.com/uvalib/x/issues/0"

    # Search results keep the hit filter working even though *_url fields are dropped from the JSON.
    hits = issues + [dict(issues[0], repository_url="https://api.github.com/repos/other/y",
                          html_url="https://github.com/other/y/issues/1")]
    tools, _ = _gh(result=_text(json.dumps({"total_count": 21, "items": hits})))
    out = tools.call("GitHub___search_pull_requests", {"query": "x"})
    assert len(_links(out)) == 20 and "other/y" not in out

    code = {"total_count": 1, "items": [{"name": "a.go", "path": "svc/a.go", "repository": "uvalib/hold"}]}
    tools, _ = _gh(result=_text(json.dumps(code)))
    out = tools.call("GitHub___search_code", {"query": "hold"})
    assert _links(out) == ["- https://github.com/uvalib/hold/blob/HEAD/svc/a.go — svc/a.go "
                           "in https://github.com/uvalib/hold"]

    repos = {"total_count": 2, "items": [
        {"full_name": "uvalib/virgo4", "description": "Virgo 4", "html_url": "https://github.com/uvalib/virgo4"},
        {"full_name": "uvalib/bare", "description": None, "html_url": "https://github.com/uvalib/bare"}]}
    tools, _ = _gh(result=_text(json.dumps(repos)))
    out = tools.call("GitHub___search_repositories", {"query": "x"})
    assert _links(out) == ["- https://github.com/uvalib/virgo4 — uvalib/virgo4: Virgo 4",
                           "- https://github.com/uvalib/bare — uvalib/bare"]


def test_unparseable_text_still_capped_and_redacted():
    text = "line ghp_" + "A" * 30 + " end\n" + "z" * 50_000
    tools, _ = _gh(result=_text(text))
    out = tools.call("GitHub___list_commits", {"owner": "uvalib", "repo": "x"})
    assert REDACTED in out and "ghp_" not in out and "line " in out and " end" in out
    assert len(out) < 21_000 and "truncated" in out


def test_tool_error_text_passed_through():
    msg = ("failed to resolve git reference: failed to get repository info: "
           "GET https://api.github.com/repos/uvalib/nope: 404 Not Found []")
    tools, _ = _gh(result=_text(msg, is_error=True))
    out = tools.call("GitHub___get_file_contents", {"owner": "uvalib", "repo": "nope", "path": "README.md"})
    assert "404 Not Found" in out
    tools, _ = _gh(result=_text("403 Resource not accessible by integration", is_error=True))
    assert "403 Resource not accessible" in tools.call("GitHub___list_issues", {"owner": "uvalib", "repo": "x"})


def test_client_errors_mapped():
    tools, _ = _gh(error=GitHubMCPError(f"HTTP 503 {TOKEN}", "GitHub is busy; try again in a minute."))
    assert tools.call("GitHub___list_issues", {"owner": "uvalib", "repo": "x"}) == \
        "GitHub is busy; try again in a minute."
    tools, _ = _gh(error=GitHubMCPError("unknown tool 'x'", "GitHub isn't available right now.", code=-32602))
    assert "unknown tool" in tools.call("GitHub___list_issues", {"owner": "uvalib", "repo": "x"})
    tools, _ = _gh(error=GitHubAuthError("GitHub token exchange failed (HTTP 401)."))
    assert tools.call("GitHub___list_issues", {"owner": "uvalib", "repo": "x"}) == "GitHub isn't available right now."
    tools, _ = _gh(error=RuntimeError(TOKEN))
    out = tools.call("GitHub___list_issues", {"owner": "uvalib", "repo": "x"})
    assert out == "GitHub isn't available right now." and TOKEN not in out


def test_links_added():
    tools, _ = _gh(result=_file(text="hello", path="docs/a b.md"))
    out = tools.call("GitHub___get_file_contents", {"owner": "uvalib", "repo": "virgo4-client", "path": "docs/a b.md"})
    assert "https://github.com/uvalib/virgo4-client/blob/73ddeb4f/docs/a%20b.md" in out
    tools, _ = _gh(result=_file(text="hello", ref_part="refs/heads/main", path="README.md"))
    out = tools.call("GitHub___get_file_contents", {"owner": "uvalib", "repo": "virgo4-client", "path": "README.md"})
    assert "https://github.com/uvalib/virgo4-client/blob/main/README.md" in out
    tools, _ = _gh(result=_file(text="hello", ref_part="", path="README.md"))
    out = tools.call("GitHub___get_file_contents",
                     {"owner": "uvalib", "repo": "virgo4-client", "path": "README.md", "ref": "refs/heads/dev"})
    assert "https://github.com/uvalib/virgo4-client/blob/dev/README.md" in out
    issue = {"number": 58, "title": "Bump", "html_url": "https://github.com/uvalib/virgo4-client/issues/58"}
    tools, _ = _gh(result=_text(json.dumps(issue)))
    out = tools.call("GitHub___issue_read", {"method": "get", "owner": "uvalib", "repo": "virgo4-client",
                                             "issue_number": 58})
    assert "Link: https://github.com/uvalib/virgo4-client/issues/58" in out
    prs = [{"number": 58, "html_url": "https://github.com/uvalib/virgo4-client/pull/58"}]
    tools, _ = _gh(result=_text(json.dumps(prs)))
    out = tools.call("GitHub___list_pull_requests", {"owner": "uvalib", "repo": "virgo4-client"})
    assert "https://github.com/uvalib/virgo4-client/pull/58" in out.split("Links:")[1]
    code = {"total_count": 1, "items": [{"name": "a.go", "path": "svc/a.go", "repository": "uvalib/hold"}]}
    tools, _ = _gh(result=_text(json.dumps(code)))
    out = tools.call("GitHub___search_code", {"query": "hold"})
    assert "https://github.com/uvalib/hold/blob/HEAD/svc/a.go" in out


def test_file_from_other_owner_refused():
    res = _file(text="secret stuff")
    res["content"][1]["resource"]["uri"] = "repo://torvalds/linux/sha/abc/contents/README"
    tools, _ = _gh(result=res)
    out = tools.call("GitHub___get_file_contents", {"owner": "uvalib", "repo": "virgo4-client", "path": "README"})
    assert "secret stuff" not in out


# ---- redaction -------------------------------------------------------------

SECRETS = [
    ("ghp_" + "A1b2" * 6, "before ", " after"),
    ("gho_" + "x" * 25, "before ", " after"),
    ("ghu_" + "y" * 25, "before ", " after"),
    ("ghs_" + "z_9" * 8, "before ", " after"),
    ("ghr_" + "R" * 40, "before ", " after"),
    ("github_pat_11ABCDEFG0" + "a1B2c3" * 10, "before ", " after"),
    ("AKIAABCDEFGHIJKLMNOP", "aws ", " end"),
    (PRIVATE_PEM.strip(), "key:\n", "\nafter"),
    ("-----BEGIN RSA PRIVATE KEY-----\nMIIabc\n-----END RSA PRIVATE KEY-----", "x\n", "\ny"),
]
KV = [("AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG", "AWS_SECRET_ACCESS_KEY="),
      ("SECRET_KEY_BASE: 9f8e7d6c5b", "SECRET_KEY_BASE: "), ("db_password='p@ss word'", "db_password="),
      ('api_key: "two words here"', "api_key: "), ("GITHUB_TOKEN=abc123", "GITHUB_TOKEN="),
      ("password = hunter2", "password = "), ("passwd: s3cr3t", "passwd: "), ("SECRET=abc", "SECRET="),
      ("api_key: k-123", "api_key: "), ("apikey=k1", "apikey="), ("api-key = zz", "api-key = "),
      ("token: tok123", "token: ")]


def _assert_redacted(out, secret, before, after):
    assert REDACTED in out
    assert secret not in out
    assert before.strip() in out and after.strip() in out


def test_credentials_redacted():
    for secret, before, after in SECRETS:
        tools, _ = _gh(result=_file(text=before + secret + after))
        out = tools.call("GitHub___get_file_contents", {"owner": "uvalib", "repo": "virgo4-client", "path": "x"})
        _assert_redacted(out, secret, before, after)
        body = {"total_count": 1, "items": [{"path": "x", "repository": "uvalib/a",
                                             "text_matches": [{"fragment": before + secret + after}]}]}
        tools, _ = _gh(result=_text(json.dumps(body)))
        out = tools.call("GitHub___search_code", {"query": "x"})
        assert REDACTED in out and secret not in out and json.dumps(secret)[1:-1] not in out
    for text, keep in KV:
        value = text[len(keep):]
        tools, _ = _gh(result=_file(text=f"start\n{text}\nend"))
        out = tools.call("GitHub___get_file_contents", {"owner": "uvalib", "repo": "virgo4-client", "path": "x"})
        assert keep + REDACTED in out and value not in out and "start" in out and "end" in out
        tools, _ = _gh(result=_text(json.dumps({"total_count": 1, "items": [
            {"path": "x", "repository": "uvalib/a", "text_matches": [{"fragment": text}]}]})))
        out = tools.call("GitHub___search_code", {"query": "x"})
        assert REDACTED in out and value not in out


def test_unterminated_private_key_redacted():
    pem_head = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASC\n"
    tools, _ = _gh(result=_file(text="config\n" + pem_head + "a" * 20_000))
    out = tools.call("GitHub___get_file_contents", {"owner": "uvalib", "repo": "virgo4-client", "path": "x"})
    assert "MIIEvQ" not in out and REDACTED in out and "config" in out


def test_json_quoted_password_value_redacted():
    tools, _ = _gh(result=_file(text='{"password": "hunter2", "user": "bob"}'))
    out = tools.call("GitHub___get_file_contents", {"owner": "uvalib", "repo": "virgo4-client", "path": "x"})
    assert "hunter2" not in out and "bob" in out


def test_json_quoted_keys_with_spaces_redacted():
    text = '{"client_secret": "a b c", "secretKey": "d e", "user": "bob"}'
    tools, _ = _gh(result=_file(text=text))
    out = tools.call("GitHub___get_file_contents", {"owner": "uvalib", "repo": "virgo4-client", "path": "x"})
    assert "a b c" not in out and "d e" not in out and "bob" in out
    # The same text inside a search fragment (JSON-escaped quotes in the rendered output).
    body = {"total_count": 1, "items": [{"path": "x", "repository": "uvalib/a", "text_matches": [{"fragment": text}]}]}
    tools, _ = _gh(result=_text(json.dumps(body)))
    out = tools.call("GitHub___search_code", {"query": "x"})
    assert "a b c" not in out and "d e" not in out and "bob" in out


I5 = [
    ("https://hooks.slack.com/services/T0ABC123/B0DEF456/aBcDeFgHiJkLmNoPqRsTuVwX", "aBcDeFgHiJkLmNoPqRsTuVwX"),
    ("xoxb-1234567890-0987654321-AbCdEfGhIjKl", "xoxb-1234567890"),
    ("xoxp-11111-22222-33333-abcdef", "xoxp-11111"),
    ("postgres://dbuser:Sup3rS3cret@db.example.org:5432/app", "Sup3rS3cret"),
    ("https://deploy:hunter2@git.example.org/repo.git", "hunter2"),
    ("eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U",
     "dozjgNryP4J3jVmNHl0w5N"),
    ("ASIAABCDEFGHIJKLMNOP", "ASIAABCDEFGHIJKLMNOP"),
    ("AIzaSyA1b2C3d4E5f6G7h8I9j0K_LmNoPqRsTuV", "AIzaSyA1b2C3d4E5f6G7h8I9j0K_LmNoPqRsTuV"),
]


def test_more_credential_shapes_redacted():
    for secret, leak in I5:
        text = f"before {secret} after"
        out = github_tools.redact(text)
        assert leak not in out and REDACTED in out and out.startswith("before ") and out.endswith(" after"), out
        tools, _ = _gh(result=_text(json.dumps({"total_count": 1, "items": [
            {"path": "x", "repository": "uvalib/a", "text_matches": [{"fragment": text}]}]})))
        out = tools.call("GitHub___search_code", {"query": "x"})
        assert leak not in out and REDACTED in out
    assert "db.example.org" in github_tools.redact("postgres://dbuser:Sup3rS3cret@db.example.org/app")
    for fine in ("https://github.com/uvalib/x", "http://localhost:8080/path", "see eyJhbGciOiJIUzI1NiJ9 only",
                 "ASIA is a continent"):
        assert github_tools.redact(fine) == fine


def test_redaction_linear_on_adversarial_text():
    import time
    texts = ["eyJ" * 30_000, "eyJ" + "a" * 50_000 + ".eyJ" + "b" * 50_000, "a://" * 20_000,
             "x://user:" * 10_000, "a:b@" * 20_000, "xoxb-" * 20_000, "-----BEGIN PRIVATE KEY-----" * 3_000,
             "https://hooks.slack.com/services/T" * 3_000, "AIza" * 25_000, "ghp_" * 25_000,
             "-----BEGIN RSA PRIVATE KEY-----\nabc\n" * 3_000]
    for t in texts:
        t0 = time.time()
        github_tools.redact(t)
        assert time.time() - t0 < 1, t[:20]


def test_assignment_after_plain_assignment_redacted():
    tools, _ = _gh(result=_file(text="opts a=password: hunter2 end"))
    out = tools.call("GitHub___get_file_contents", {"owner": "uvalib", "repo": "virgo4-client", "path": "x"})
    assert "hunter2" not in out and "end" in out


def test_redaction_linear_on_key_like_runs():
    import time
    t0 = time.time()
    github_tools.redact("key" * 20_000 + " " + "key." * 10_000 + " " + "a=" * 20_000)
    assert time.time() - t0 < 1


def test_descriptions_redacted():
    tool = _tool("search_code")
    tool["description"] = "Search code. token: ghp_" + "Q" * 30
    tools, _ = _gh(tools=[tool])
    desc = tools.tool_specs()[0]["toolSpec"]["description"]
    assert "ghp_" not in desc and REDACTED in desc


# ---- factory ---------------------------------------------------------------

def _iso(epoch):
    return datetime.fromtimestamp(epoch, timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


class FakeResp:
    def __init__(self, status, body, headers=None):
        self.status_code = status
        self.headers = {"Content-Type": "application/json", **(headers or {})}
        self.text = json.dumps(body)
        self._body = body

    def json(self):
        return self._body


class FakeHttp:
    """Token exchange + MCP server. mcp='ok' | 'raise' | 'fail401'."""

    def __init__(self, mcp="ok", exchange_status=201):
        self.mcp = mcp
        self.exchange_status = exchange_status
        self.posts = []

    def post(self, url, json=None, headers=None, timeout=None, **kw):
        self.posts.append(url)
        if "access_tokens" in url:
            if self.exchange_status >= 300:
                return FakeResp(self.exchange_status, {"message": f"Bad credentials {TOKEN}"})
            return FakeResp(201, {"token": TOKEN, "expires_at": _iso(4_000_000_000)})
        if self.mcp == "raise":
            raise RuntimeError(f"exploded with {TOKEN} and {PRIVATE_PEM}")
        if self.mcp == "fail401":
            return FakeResp(401, {"message": TOKEN})
        method = (json or {}).get("method")
        if method == "initialize":
            return FakeResp(200, {"jsonrpc": "2.0", "id": json["id"], "result": {}}, {"Mcp-Session-Id": "s1"})
        if method is None or method.startswith("notifications/"):
            return FakeResp(202, {})
        if method == "tools/list":
            return FakeResp(200, {"jsonrpc": "2.0", "id": json["id"],
                                  "result": {"tools": [_tool("search_code"), _tool("create_issue")]}})
        return FakeResp(200, {"jsonrpc": "2.0", "id": json["id"], "result": _text("{}")})


SSM = {"/hoohelp/github/app-id": "123", "/hoohelp/github/installation-id": "42",
       "/hoohelp/github/private-key": PRIVATE_PEM}
ON = {"ENABLE_GITHUB": "true"}


def _ssm(values):
    def get(name, decrypt):
        if name not in values:
            raise KeyError(name)
        return values[name]
    return get


def test_factory_on_returns_tools():
    github_tools._reset_cache()
    tools = github_tools_for_env(ON, ssm_get=_ssm(SSM), http=FakeHttp())
    assert isinstance(tools, GitHubTools)
    assert [s["toolSpec"]["name"] for s in tools.tool_specs()] == ["GitHub___search_code"]
    # Same container: the same instance (token and tools cache kept).
    assert github_tools_for_env(ON, ssm_get=_ssm(SSM), http=FakeHttp()) is tools
    github_tools._reset_cache()


def test_factory_off_missing_or_failing_returns_none(caplog, monkeypatch):
    github_tools._reset_cache()
    called = []
    assert github_tools_for_env({}, ssm_get=lambda n, d: called.append(n)) is None
    assert github_tools_for_env({"ENABLE_GITHUB": "false"}, ssm_get=lambda n, d: called.append(n)) is None
    assert called == []
    github_tools._reset_cache()
    missing = dict(SSM)
    del missing["/hoohelp/github/private-key"]
    assert github_tools_for_env(ON, ssm_get=_ssm(missing), http=FakeHttp()) is None
    github_tools._reset_cache()
    assert github_tools_for_env(ON, ssm_get=_ssm(SSM), http=FakeHttp(exchange_status=401)) is None
    github_tools._reset_cache()
    assert github_tools_for_env(ON, ssm_get=_ssm(SSM), http=FakeHttp(mcp="fail401")) is None
    github_tools._reset_cache()
    assert github_tools_for_env(ON, ssm_get=lambda n, d: 1 / 0, http=FakeHttp()) is None

    # A broken cryptography / jwt wheel: switched off, logged once per container.
    github_tools._reset_cache()
    monkeypatch.setitem(sys.modules, "jwt", None)
    with caplog.at_level(logging.INFO):
        caplog.clear()
        assert github_tools_for_env(ON, ssm_get=_ssm(SSM), http=FakeHttp()) is None
        github_tools._FAILED_AT = 0.0  # pretend the retry window has passed
        assert github_tools_for_env(ON, ssm_get=_ssm(SSM), http=FakeHttp()) is None
    warnings = [r for r in caplog.records if r.levelno >= logging.WARNING and r.name == "github_tools"]
    assert len(warnings) == 1, [r.getMessage() for r in warnings]
    monkeypatch.delitem(sys.modules, "jwt")

    # github_auth itself fails to import.
    github_tools._reset_cache()
    monkeypatch.setitem(sys.modules, "github_auth", None)
    assert github_tools_for_env(ON, ssm_get=_ssm(SSM), http=FakeHttp()) is None
    github_tools._reset_cache()


class _Panic(BaseException):  # pyo3's PanicException derives from BaseException
    pass


def test_call_and_specs_contain_panics_but_not_interrupts():
    tools, _ = _gh(error=_Panic("rust"))
    assert tools.call("GitHub___list_issues", {"owner": "uvalib", "repo": "x"}) == "GitHub isn't available right now."
    c = FakeClient()
    c.list_tools = lambda: (_ for _ in ()).throw(_Panic("rust"))
    assert GitHubTools(c).tool_specs() == []
    for exc in (KeyboardInterrupt, SystemExit):
        tools, _ = _gh(error=exc())
        try:
            tools.call("GitHub___list_issues", {"owner": "uvalib", "repo": "x"})
        except exc:
            pass
        else:
            raise AssertionError("swallowed")
        c = FakeClient()
        c.list_tools = lambda e=exc: (_ for _ in ()).throw(e())
        try:
            GitHubTools(c).tool_specs()
        except exc:
            pass
        else:
            raise AssertionError("swallowed")


def test_factory_contains_panics_but_not_interrupts(monkeypatch):
    class PanicException(BaseException):  # what pyo3 raises from a broken cryptography build
        pass

    def boom(*a, **k):
        raise PanicException("rust panic")

    github_tools._reset_cache()
    monkeypatch.setattr(github_tools, "_build", boom)
    assert github_tools_for_env(ON, ssm_get=_ssm(SSM), http=FakeHttp()) is None
    for exc in (KeyboardInterrupt, SystemExit):
        github_tools._reset_cache()
        monkeypatch.setattr(github_tools, "_build", lambda *a, e=exc, **k: (_ for _ in ()).throw(e()))
        try:
            github_tools_for_env(ON, ssm_get=_ssm(SSM), http=FakeHttp())
        except exc:
            pass
        else:
            raise AssertionError(f"{exc.__name__} swallowed")
    github_tools._reset_cache()


def test_factory_logs_auth_failure_status(caplog):
    github_tools._reset_cache()
    with caplog.at_level(logging.INFO):
        caplog.clear()
        assert github_tools_for_env(ON, ssm_get=_ssm(SSM), http=FakeHttp(exchange_status=401)) is None
    lines = [r.getMessage() for r in caplog.records if r.name == "github_tools"]
    assert "github_auth_failed status=401" in lines, lines
    assert TOKEN not in caplog.text and "Bad credentials" not in caplog.text
    github_tools._reset_cache()


def test_factory_failure_not_retried_every_turn():
    github_tools._reset_cache()
    http = FakeHttp(mcp="raise")
    assert github_tools_for_env(ON, ssm_get=_ssm(SSM), http=http) is None
    n = len(http.posts)
    assert github_tools_for_env(ON, ssm_get=_ssm(SSM), http=http) is None
    assert len(http.posts) == n
    github_tools._reset_cache()


def test_no_secrets_in_logs(caplog):
    for http in (FakeHttp(mcp="raise"), FakeHttp(exchange_status=401), FakeHttp(mcp="fail401")):
        github_tools._reset_cache()
        with caplog.at_level(logging.DEBUG):
            caplog.clear()
            assert github_tools_for_env(ON, ssm_get=_ssm(SSM), http=http) is None
            text = caplog.text + "".join(str(r.args) for r in caplog.records)
        assert TOKEN not in text
        assert "BEGIN" not in text and PRIVATE_PEM.splitlines()[1] not in text
    github_tools._reset_cache()


def test_template_has_enable_github_and_ssm_policy():
    text = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "template.yaml")).read()
    m = re.search(r"\n  EnableGitHub:\n((?:    .*\n)+)", text)
    assert m, "EnableGitHub parameter missing"
    assert 'Default: "false"' in m.group(1) and 'AllowedValues: ["true", "false"]' in m.group(1)
    assert "ENABLE_GITHUB: !Ref EnableGitHub" in text
    assert "parameter/hoohelp/github/*" in text
    cfg = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "samconfig.toml")).read()
    assert "EnableGitHub=false" in cfg


if __name__ == "__main__":
    import pytest

    sys.exit(pytest.main([__file__, "-q"]))


def test_slack_workflow_and_trigger_webhooks_redacted():  # final re-review minor 4
    from github_tools import redact

    for kind in ("workflows", "triggers"):
        text = f"notify: https://hooks.slack.com/{kind}/T0ABCDEF1/A0BCDEF23/123456789012345678/abcDEF123ghiJKL456mno"
        out = redact(text)
        assert "abcDEF123ghiJKL456mno" not in out and "[redacted credential]" in out, out
