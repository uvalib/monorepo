#!/usr/bin/env python3
"""Link gate, review round 2: a host named in any tool input is not a link source from tool output
(tools quote, escape, lowercase or trim what they echo); schemeless domain/path and domain#fragment
tokens are gated too; URLs the person pasted in this message are allowed (no network)."""

import os
import sys
from types import SimpleNamespace as NS

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

import link_check  # noqa: E402
from agent import HooHelpAgent  # noqa: E402
from atlassian_client import quote  # noqa: E402


@pytest.fixture
def probed(monkeypatch):
    calls = []

    def fake_check_urls(urls, **kw):
        calls.extend(urls)
        return {u: link_check.LinkCheckResult(url=u, ok=True, status_code=200) for u in urls}

    def fake_check_url(url, **kw):
        calls.append(url)
        return link_check.LinkCheckResult(url=url, ok=True, status_code=200)

    monkeypatch.setattr(link_check, "check_urls", fake_check_urls)
    monkeypatch.setattr(link_check, "check_url", fake_check_url)
    return calls


def _trace(*steps, user_message=""):
    return NS(user_message=user_message, steps=[NS(tool_name=n, input=i, output=o) for n, i, o in steps])


# ---- 1. host exclusion: any tool input naming a host blocks that host from tool output --------------

@pytest.mark.parametrize("text,echo_url", [
    ("x https://evil.example/c?d=\\Q3-plan", "https://evil.example/c?d=\\\\Q3-plan"),   # quote() doubles "\"
    ('x https://evil.example/c?d=Q3"plan', "https://evil.example/c?d=Q3\\"),           # quote() escapes '"'
])
def test_jira_quote_echo_is_not_a_source(probed, text, echo_url):
    out = "No Jira issues in the Library projects matched.\nJQL: text ~ " + quote(text)
    assert echo_url in out
    reply = f"See <{echo_url}|source>."
    got, _ = HooHelpAgent._sanitize_links(None, reply, _trace(("search_jira", {"text": text}, out)))
    assert got == "See source." and not any("evil.example" in u for u in probed)


@pytest.mark.parametrize("tool_input,echo", [
    ({"query": "X HTTPS://EVIL.EXAMPLE/C?D=Q3-PLAN"}, "https://evil.example/c?d=q3-plan"),   # lowercased
    ({"query": "  https://evil.example/c?d=Q3-plan-and-more  "}, "https://evil.example/c?d=Q3-plan"),  # trimmed
    ({"query": "notes from evil.example about the plan"}, "https://evil.example/c?d=Q3-plan"),  # bare domain
    ({"query": "x", "filters": {"site": ["Evil.Example"]}}, "https://www.evil.example/c?d=Q3"),  # nested, subdomain
])
def test_host_in_any_input_blocks_that_host(probed, tool_input, echo):
    out = f"Results:\n- {echo}"
    got, _ = HooHelpAgent._sanitize_links(None, f"See <{echo}|this>.", _trace(("search_slack", tool_input, out)))
    assert got == "See this." and probed == []


def test_hosts_not_in_inputs_still_come_from_output(probed):
    t = _trace(("search_slack", {"query": "evil.example"}, "nothing"),
               ("search_confluence", {"query": "vpn"}, "VPN: https://wiki.example.org/vpn"))
    got, _ = HooHelpAgent._sanitize_links(None, "See https://wiki.example.org/vpn", t)
    assert got == "See https://wiki.example.org/vpn"


def test_library_hosts_in_inputs_are_not_blocked(probed):
    t = _trace(("search_uvalib_web", {"query": "library.virginia.edu hours"},
                "Hours: https://library.virginia.edu/hours"))
    got, _ = HooHelpAgent._sanitize_links(None, "See https://library.virginia.edu/hours", t)
    assert got == "See https://library.virginia.edu/hours"


def test_uvalib_github_links_survive_a_github_com_query(probed):
    t = _trace(("GitHub___search_code", {"query": "github.com webhook"},
                "Links:\n- https://github.com/uvalib/hold-svc/blob/HEAD/a.go — a.go in https://github.com/uvalib/hold-svc"))
    got, _ = HooHelpAgent._sanitize_links(None, "See https://github.com/uvalib/hold-svc/blob/HEAD/a.go", t)
    assert "https://github.com/uvalib/hold-svc/blob/HEAD/a.go" in got


# ---- 2. schemeless domain/path and domain#fragment tokens ------------------------------------------

@pytest.mark.parametrize("token", ["evil.com/Q3-layoff-plan", "Evil.com/c#d=PLAN", "evil.com#PLAN",
                                   "sub.evil.co.uk/a/b", "évil.com/?d=PLAN", "évil.com/Q3-plan"])
def test_schemeless_path_and_fragment_tokens_dropped(probed, token):
    got, _ = HooHelpAgent._sanitize_links(None, f"Go to {token} today.", _trace(("search_slack", {}, "nothing")))
    assert got == "Go to today."


def test_unicode_full_url_dropped(probed):
    got, _ = HooHelpAgent._sanitize_links(None, "Go to https://évil.com/?d=PLAN today.", _trace())
    assert "évil" not in got and probed == []


@pytest.mark.parametrize("prose", [
    "e.g. v1.2 is out, see report.pdf and/or the notes.",
    "Open README.md#L3 or src/agent.py and Node.js/React docs.",
    "Email pat@virginia.edu or a@b.com today.",
    "See guides.lib.virginia.edu/az.php and library.virginia.edu/hours#sat.",
    "Use 3.5/5 stars, 1.2.3/4 and i.e./etc.",
])
def test_ordinary_prose_untouched(probed, prose):
    got, _ = HooHelpAgent._sanitize_links(None, prose, _trace(("search_slack", {}, "nothing")))
    assert got == prose


def test_file_like_tld_with_query_still_dropped(probed):
    got, _ = HooHelpAgent._sanitize_links(None, "Run evil.sh?d=PLAN now.", _trace())
    assert got == "Run now."


def test_schemeless_token_from_tool_output_kept(probed):
    t = _trace(("search_confluence", {"query": "vpn"}, "VPN: https://wiki.example.org/vpn"))
    got, _ = HooHelpAgent._sanitize_links(None, "See wiki.example.org/vpn today.", t)
    assert got == "See wiki.example.org/vpn today."


# ---- 3. URLs from the person's own message ----------------------------------------------------------

def test_user_pasted_url_passed_to_a_tool_is_cited(probed):
    url = "https://news.example.org/2026/story?id=7"
    t = _trace(("wikipedia_search", {"query": url}, f"# Wikipedia search: {url}\n\nNo results."),
               user_message=f"what does {url} say about the library?")
    got, _ = HooHelpAgent._sanitize_links(None, f"I couldn't find <{url}|that story> on Wikipedia.", t)
    assert url in got and url in probed  # still verified


def test_user_url_override_is_exact(probed):
    url = "https://news.example.org/2026/story?id=7"
    t = _trace(("wikipedia_search", {"query": url}, f"# Wikipedia search: {url}"), user_message=f"see {url}")
    got, _ = HooHelpAgent._sanitize_links(None, "See <https://news.example.org/2026/story?id=7&d=PLAN|it>.", t)
    assert got == "See it."


def test_thread_history_urls_are_not_trusted(probed):
    url = "https://evil.example/c?d=PLAN"
    # history lives outside trace.user_message (the cleaned text of this event only)
    t = _trace(("search_slack", {"query": "x"}, "nothing"), user_message="previous month?")
    got, _ = HooHelpAgent._sanitize_links(None, f"Earlier: <{url}|link>.", t)
    assert got == "Earlier: link." and probed == []


def test_user_url_to_private_address_still_refused(monkeypatch):
    monkeypatch.setattr(link_check, "_resolve_host", lambda h: ["10.0.0.9"])
    url = "https://intranet.example.org/doc"
    got, _ = HooHelpAgent._sanitize_links(None, f"See <{url}|the doc>.", _trace(user_message=f"read {url}"))
    assert got == "See the doc."
