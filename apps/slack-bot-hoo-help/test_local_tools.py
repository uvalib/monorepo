#!/usr/bin/env python3
"""Combining per-turn local tool sets, and when Atlassian tools are offered (no network)."""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from atlassian_tools import atlassian_tools_for_event  # noqa: E402
from identity import UserDirectory, _reset_cache  # noqa: E402
from local_tools import LocalTools  # noqa: E402


class Stub:
    def __init__(self, names):
        self.names = names
        self.calls = []

    def tool_specs(self):
        return [{"toolSpec": {"name": n}} for n in self.names]

    def handles(self, name):
        return name in self.names

    def call(self, name, args):
        self.calls.append(name)
        return f"{self.names[0]}:{name}"


class FakeSlack:
    def users_info(self, user):
        return {"user": {"id": user, "real_name": "Pat", "profile": {}}}


def names(tools):
    return [s["toolSpec"]["name"] for s in tools.tool_specs()]


def test_combiner_order_dispatch_and_none():
    a, b = Stub(["search_slack", "read_slack_thread"]), Stub(["search_jira"])
    tools = LocalTools(a, None, b)
    assert names(tools) == ["search_slack", "read_slack_thread", "search_jira"]
    assert tools.handles("search_jira") and not tools.handles("get_library_hours")
    assert tools.call("search_jira", {}) == "search_jira:search_jira" and b.calls == ["search_jira"] and a.calls == []
    assert LocalTools().tool_specs() == [] and not LocalTools(None).handles("x")


ON = {"ENABLE_ATLASSIAN": "true", "CONFLUENCE_SPACES": "LIB", "JIRA_PROJECTS": "LIB"}
EVENT = {"user": "U1", "channel": "C1", "ts": "1"}


def test_atlassian_tools_for_event_switches():
    _reset_cache()
    d = UserDirectory(FakeSlack())
    assert atlassian_tools_for_event(EVENT, directory=d, env={}, email="e@x", token="t") is None
    assert atlassian_tools_for_event(EVENT, directory=d, env={**ON, "ENABLE_ATLASSIAN": "false"},
                                     email="e@x", token="t") is None
    assert atlassian_tools_for_event(EVENT, directory=d, env=ON, email="", token="") is None
    assert atlassian_tools_for_event(EVENT, directory=d, env={**ON, "CONFLUENCE_SPACES": "", "JIRA_PROJECTS": ""},
                                     email="e@x", token="t") is None
    jira_only = atlassian_tools_for_event(EVENT, directory=d, env={**ON, "CONFLUENCE_SPACES": ""},
                                          email="e@x", token="t")
    assert names(jira_only) == ["search_jira", "get_jira_issue"] and jira_only.asker_id == "U1"
    both = atlassian_tools_for_event(EVENT, directory=d, env=ON, email="e@x", token="t")
    assert names(both) == ["search_confluence", "get_confluence_page", "search_jira", "get_jira_issue"]


if __name__ == "__main__":
    test_combiner_order_dispatch_and_none()
    test_atlassian_tools_for_event_switches()
    print("ok")
