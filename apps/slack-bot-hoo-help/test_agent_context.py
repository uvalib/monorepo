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
    def __init__(self):
        self.requests = []

    def converse(self, **kwargs):
        self.requests.append(kwargs)
        return {"output": {"message": {"role": "assistant", "content": [{"text": "You're welcome!"}]}},
                "stopReason": "end_turn", "usage": {}}


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


if __name__ == "__main__":
    test_system_prompt_includes_extra_context()
    test_system_prompt_without_extra_context_unchanged()
    test_process_message_sends_extra_context_to_the_model()
    print("ok")
