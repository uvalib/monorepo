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


if __name__ == "__main__":
    test_trusted_urls_are_not_checked_or_replaced()
    test_agent_trusts_urls_from_list_slack_channel_output()
    print("ok")
