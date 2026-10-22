#!/usr/bin/env python3
"""What the agent tells the model each turn: extra context and per-turn local tools (no Bedrock / network)."""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from agent import HooHelpAgent  # noqa: E402


class StubGateway:
    gateway_url = "https://example.invalid/mcp"

    def __init__(self):
        self.calls = []

    def get_bedrock_tool_config(self):
        return {"tools": [{"toolSpec": {"name": "get_library_hours", "description": "hours",
                                        "inputSchema": {"json": {"type": "object", "properties": {}}}}}]}

    def call_tool(self, name, arguments):
        self.calls.append((name, arguments))
        return "gateway result"


class StubBedrock:
    def __init__(self, tool_use=None):
        self.requests = []
        self.tool_use = tool_use  # first reply asks for this tool, then the model answers

    def converse(self, **kwargs):
        self.requests.append(kwargs)
        if self.tool_use and len(self.requests) == 1:
            return {"output": {"message": {"role": "assistant", "content": [
                {"toolUse": {"toolUseId": "t1", "name": self.tool_use[0], "input": self.tool_use[1]}}]}},
                "stopReason": "tool_use", "usage": {}}
        return {"output": {"message": {"role": "assistant", "content": [{"text": "You're welcome!"}]}},
                "stopReason": "end_turn", "usage": {}}


class StubLocalTools:
    def __init__(self):
        self.calls = []

    def tool_specs(self):
        return [{"toolSpec": {"name": "search_slack", "description": "search",
                              "inputSchema": {"json": {"type": "object", "properties": {}}}}}]

    def handles(self, name):
        return name == "search_slack"

    def call(self, name, args):
        self.calls.append((name, args))
        return "stub result"


def make_agent():
    agent = HooHelpAgent.__new__(HooHelpAgent)  # skip boto3 / gateway construction
    agent.gateway_client = StubGateway()
    agent.bedrock_runtime = StubBedrock()
    agent.model_id = "minimax.minimax-m2.5"
    agent.region_name = "us-east-1"
    agent.guardrail_config = None
    agent.last_trace = None
    return agent


def test_system_prompt_includes_extra_context():
    agent = make_agent()
    p = agent._system_prompt(["You're talking with Pat Doe — Slack id U1."])
    assert p.endswith("You're talking with Pat Doe — Slack id U1.")
    assert "Current date context" in p


def test_system_prompt_without_extra_context_unchanged():
    agent = make_agent()
    assert agent._system_prompt() == agent._system_prompt([]) == agent._system_prompt([""])


def test_process_message_sends_extra_context_to_the_model():
    agent = make_agent()
    agent.process_message("thanks!", extra_context=["You're talking with Pat Doe — Slack id U1."])
    system = agent.bedrock_runtime.requests[0]["system"][0]["text"]
    assert "You're talking with Pat Doe — Slack id U1." in system


def test_local_tools_listed_first_and_dispatched_locally():
    agent, stub = make_agent(), StubLocalTools()
    cfg = agent._merged_tool_config(local_tools=stub)
    assert cfg["tools"][0]["toolSpec"]["name"] == "search_slack"
    assert agent._dispatch_tool("search_slack", {"query": "x"}, local_tools=stub) == "stub result"
    assert agent.gateway_client.calls == []
    assert agent._dispatch_tool("get_library_hours", {}, local_tools=stub) == "gateway result"


def test_no_local_tools_unchanged():
    from wikipedia_tools import bedrock_tool_specs as wiki_specs

    agent = make_agent()
    names = [t["toolSpec"]["name"] for t in agent._merged_tool_config()["tools"]]
    assert names == [t["toolSpec"]["name"] for t in wiki_specs()] + ["get_library_hours"]


def test_process_message_runs_local_tool_calls():
    agent, stub = make_agent(), StubLocalTools()
    agent.bedrock_runtime = StubBedrock(tool_use=("search_slack", {"query": "libcal decision"}))
    agent.process_message("what did we decide about libcal in slack?", local_tools=stub)
    assert stub.calls == [("search_slack", {"query": "libcal decision"})]
    assert agent.gateway_client.calls == []
    sent = [t["toolSpec"]["name"] for t in agent.bedrock_runtime.requests[0]["toolConfig"]["tools"]]
    assert sent[0] == "search_slack"


def test_system_prompt_mentions_slack_search():
    from agent import SYSTEM_PROMPT

    assert "search_slack" in SYSTEM_PROMPT and 'from_user="me"' in SYSTEM_PROMPT


def test_system_prompt_anchors_relative_dates_in_follow_ups():  # live eval thread-previous-month
    from agent import SYSTEM_PROMPT

    assert "relative to the period being discussed" in SYSTEM_PROMPT


def test_system_prompt_mentions_confluence_and_jira():
    from agent import SYSTEM_PROMPT

    assert "search_confluence" in SYSTEM_PROMPT and "search_jira" in SYSTEM_PROMPT
    assert 'assignee="me"' in SYSTEM_PROMPT


def test_system_prompt_handles_half_remembered_authors():  # model comparison: every model missed "Heaven" by Kawakami
    from agent import SYSTEM_PROMPT

    assert "half-remember" in SYSTEM_PROMPT and "every author" in SYSTEM_PROMPT


if __name__ == "__main__":
    test_system_prompt_includes_extra_context()
    test_system_prompt_without_extra_context_unchanged()
    test_process_message_sends_extra_context_to_the_model()
    test_local_tools_listed_first_and_dispatched_locally()
    test_no_local_tools_unchanged()
    test_process_message_runs_local_tool_calls()
    test_system_prompt_mentions_slack_search()
    test_system_prompt_anchors_relative_dates_in_follow_ups()
    test_system_prompt_mentions_confluence_and_jira()
    test_system_prompt_handles_half_remembered_authors()
    print("ok")
