#!/usr/bin/env python3
"""Link gate: URLs reproduced from a Slack channel listing are data, never probed or swapped (no network)."""

import os
import sys
from types import SimpleNamespace

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

import link_check  # noqa: E402
from agent import HooHelpAgent  # noqa: E402

LISTING = ("### Links shared in #ai (2026-10-01 to 2026-10-21)\n\n| Date | Author | URL | Message |\n| --- | --- | --- | --- |\n"
           "| 2026-10-02 09:00 | Pat Doe | https://intranet.example.org/doc?a=1 | https://uvalib.slack.com/archives/C1/p1 |")
REPLY = "1 link: https://intranet.example.org/doc?a=1 (https://uvalib.slack.com/archives/C1/p1). Also https://other.example.org/x"


def _no_network(monkeypatch_calls):
    def fake_check_urls(urls, **kw):
        monkeypatch_calls.extend(urls)
        return {u: link_check.LinkCheckResult(url=u, ok=False, error="unreachable") for u in urls}

    def fake_check_url(url, **kw):
        monkeypatch_calls.append(url)
        return link_check.LinkCheckResult(url=url, ok=False, error="unreachable")

    real = link_check.check_urls, link_check.check_url
    link_check.check_urls, link_check.check_url = fake_check_urls, fake_check_url
    return real


def test_trusted_urls_are_not_checked_or_replaced():
    calls = []
    real = _no_network(calls)
    try:
        out, changes = link_check.sanitize_response_links(
            "see https://intranet.example.org/doc?a=1", trusted_urls=["https://intranet.example.org/doc?a=1"])
    finally:
        link_check.check_urls, link_check.check_url = real
    assert calls == [] and changes == [] and out == "see https://intranet.example.org/doc?a=1"


def test_agent_trusts_urls_from_list_slack_channel_output():  # review: a 50-link listing probed every URL
    calls = []
    real = _no_network(calls)
    trace = SimpleNamespace(steps=[SimpleNamespace(tool_name="list_slack_channel", output=LISTING)])
    try:
        HooHelpAgent._sanitize_links(None, REPLY, trace)
    finally:
        link_check.check_urls, link_check.check_url = real
    assert "https://intranet.example.org/doc?a=1" not in calls
    assert "https://uvalib.slack.com/archives/C1/p1" not in calls
    assert "https://other.example.org/x" in calls  # everything else is still checked


def test_github_links_from_github_tools_are_trusted():  # private repos 404 without a login
    calls = []
    real = _no_network(calls)
    out = ("### virgo4-client\nhttps://github.com/uvalib/virgo4-client/blob/main/README.md\n"
           "https://github.com/someoneelse/x/blob/main/a.md")
    trace = SimpleNamespace(steps=[SimpleNamespace(tool_name="GitHub___get_file_contents", output=out)])
    reply = ("README: https://github.com/uvalib/virgo4-client/blob/main/README.md and "
             "https://github.com/someoneelse/x/blob/main/a.md and https://other.example.org/x")
    try:
        HooHelpAgent._sanitize_links(None, reply, trace)
        other = SimpleNamespace(steps=[SimpleNamespace(tool_name="search_uvalib_web", output=out)])
        HooHelpAgent._sanitize_links(None, reply, other)
    finally:
        link_check.check_urls, link_check.check_url = real
    first = calls[:calls.index("https://other.example.org/x") + 1]
    assert "https://github.com/uvalib/virgo4-client/blob/main/README.md" not in first
    assert "https://github.com/someoneelse/x/blob/main/a.md" in first
    assert "https://other.example.org/x" in first
    assert "https://github.com/uvalib/virgo4-client/blob/main/README.md" in calls[len(first):]  # not from GitHub tool


def _sanitize_offline(text):
    real = _no_network([])
    try:
        return link_check.sanitize_response_links(text)
    finally:
        link_check.check_urls, link_check.check_url = real


def test_dead_bare_url_is_dropped_with_its_connector():  # review: "(link unavailable)" reached Slack
    out, changes = _sanitize_offline(
        "Contact Small Special Collections directly — they may know of materials I can't "
        "search: https://library.virginia.edu/nope or call 434-243-8539.")
    assert "link unavailable" not in out
    assert "nope" not in out
    assert out.endswith("materials I can't search or call 434-243-8539.")
    assert changes[0]["action"] == "removed" and changes[0]["url"] == "https://library.virginia.edu/nope"


def test_dead_links_in_angle_brackets_and_labels():
    out, _ = _sanitize_offline("See <https://b.example/y>. Read <https://c.example/z|the guide> first.")
    assert "link unavailable" not in out and "<>" not in out
    assert out == "See. Read the guide first."


def test_parenthesized_and_markdown_urls_are_checked():  # review: "(https://…)" links were never checked
    assert link_check.extract_urls("Ask the desk (https://a.example/x).") == ["https://a.example/x"]
    assert link_check.extract_urls("See [the guide](https://a.example/y).") == ["https://a.example/y"]
    out, changes = _sanitize_offline("Ask the desk (https://a.example/x).")
    assert out == "Ask the desk." and changes[0]["url"] == "https://a.example/x"


def test_balanced_parens_stay_in_the_url():
    wiki = "https://en.wikipedia.org/wiki/Monticello_(disambiguation)"
    assert link_check.extract_urls(f"see {wiki}.") == [wiki]
    assert link_check.extract_urls(f"(see {wiki})") == [wiki]
    assert link_check.extract_urls(f"({wiki})") == [wiki]


def test_drop_url_handles_parenthesized_form():
    assert link_check.drop_url("Ask the desk (https://a.example/x).", "https://a.example/x") == "Ask the desk."


def test_removed_url_is_dropped_cleanly_from_blocks():
    from slack_format import rewrite_urls_in_blocks

    blocks = [{"type": "section", "text": {"type": "mrkdwn",
               "text": "Call or visit <https://a.example/x|our page>, or see: https://b.example/y today"}}]
    out = rewrite_urls_in_blocks(blocks, [
        {"url": "https://a.example/x", "action": "removed", "replacement": None},
        {"url": "https://b.example/y", "action": "removed", "replacement": None},
    ])
    assert out[0]["text"]["text"] == "Call or visit our page, or see today"


def test_trace_records_link_changes():
    from session_trace import SessionTrace

    trace = SessionTrace(user_message="q")
    trace.link_changes = [{"url": "https://a.example/x", "action": "removed"}]
    assert trace.to_dict()["link_changes"] == [{"url": "https://a.example/x", "action": "removed"}]


if __name__ == "__main__":
    test_trusted_urls_are_not_checked_or_replaced()
    test_agent_trusts_urls_from_list_slack_channel_output()
    print("ok")


def test_reshaped_uvalib_links_for_repos_in_github_output_are_trusted():  # private repos 404 without login
    calls = []
    real = _no_network(calls)
    out = ("Links:\n- https://github.com/uvalib/hold-svc/blob/HEAD/svc/a.go — svc/a.go "
           "in https://github.com/uvalib/hold-svc")
    trace = SimpleNamespace(steps=[SimpleNamespace(tool_name="GitHub___search_code", output=out)])
    reply = ("See https://github.com/uvalib/hold-svc, https://github.com/uvalib/Hold-Svc/blob/main/svc/a.go#L120 "
             "and https://github.com/uvalib/other-repo/blob/main/x.go and https://github.com/uvalib/hold-svc-old "
             "and https://github.com/someone/hold-svc")
    try:
        text, _ = HooHelpAgent._sanitize_links(None, reply, trace)
    finally:
        link_check.check_urls, link_check.check_url = real
    assert "https://github.com/uvalib/hold-svc" not in calls
    assert "https://github.com/uvalib/Hold-Svc/blob/main/svc/a.go#L120" not in calls
    assert "https://github.com/uvalib/hold-svc," in text  # kept, not stripped
    assert "https://github.com/uvalib/Hold-Svc/blob/main/svc/a.go#L120" in text
    assert "https://github.com/uvalib/other-repo/blob/main/x.go" in calls  # not in this turn's output
    assert "https://github.com/uvalib/hold-svc-old" in calls
    assert "https://github.com/someone/hold-svc" in calls


def test_uvalib_dot_segments_are_not_a_repo():  # final re-review minor 1: github.com/uvalib/../other must not be trusted
    from agent import _uvalib_repo

    assert _uvalib_repo("https://github.com/uvalib/../torvalds/linux") is None
    assert _uvalib_repo("https://github.com/uvalib/./x") is None
    assert _uvalib_repo("https://github.com/uvalib/virgo4-client/blob/main/README.md#L3") == "virgo4-client"
