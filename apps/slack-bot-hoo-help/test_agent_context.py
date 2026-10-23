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
                "stopReason": "end_turn", "usage": dict(getattr(self, "usage", {}))}


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


def test_trace_records_each_model_call():  # usage review: an 81 s answer, 77 s of it not in any tool
    agent, stub = make_agent(), StubLocalTools()
    agent.bedrock_runtime = StubBedrock(tool_use=("search_slack", {"query": "libcal"}))
    agent.bedrock_runtime.usage = {"inputTokens": 5000, "outputTokens": 900}
    turn = agent.process_message("what did we decide about libcal in slack?", local_tools=stub)
    calls = turn.trace.to_dict()["model_calls"]
    assert [c["iteration"] for c in calls] == [1, 2]
    assert [c["stop_reason"] for c in calls] == ["tool_use", "end_turn"]
    assert all(isinstance(c["latency_ms"], int) and c["latency_ms"] >= 0 for c in calls)
    assert calls[1]["input_tokens"] == 5000 and calls[1]["output_tokens"] == 900


def test_system_prompt_mentions_slack_search():
    from agent import SYSTEM_PROMPT

    assert "search_slack" in SYSTEM_PROMPT and 'from_user="me"' in SYSTEM_PROMPT


def test_system_prompt_routes_exhaustive_slack_lists_and_file_formats():  # trial: "all URLs in #ai"
    from agent import SYSTEM_PROMPT

    assert "list_slack_channel" in SYSTEM_PROMPT and "not a full export" in SYSTEM_PROMPT
    assert 'after="2010-01-01"' in SYSTEM_PROMPT  # trial: "ever" got the 30-day default
    assert "RIS" in SYSTEM_PROMPT and "Zotero" in SYSTEM_PROMPT  # trial: "can't do RIS"
    assert "catalog results as RIS" in SYSTEM_PROMPT
    assert "CSV" in SYSTEM_PROMPT and "JSON" in SYSTEM_PROMPT
    assert "attaches an .xlsx" not in SYSTEM_PROMPT


def test_system_prompt_catalog_alternate_titles_links_and_citations():  # trial: "do we have 1984?" said checked out
    from agent import SYSTEM_PROMPT

    assert "Nineteen eighty-four" in SYSTEM_PROMPT and "spelled-out" in SYSTEM_PROMPT
    assert "Virgo record link for every item" in SYSTEM_PROMPT  # so "those" can be pinned down later
    assert "get_citations(format=\"ris\")" in SYSTEM_PROMPT and "don't paste the RIS" in SYSTEM_PROMPT


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


def test_system_prompt_routes_archival_questions():
    from agent import SYSTEM_PROMPT

    assert "search_archives" in SYSTEM_PROMPT and "get_archival_record" in SYSTEM_PROMPT
    assert "finding aid" in SYSTEM_PROMPT and "reading room" in SYSTEM_PROMPT
    assert "archives.lib.virginia.edu" in SYSTEM_PROMPT
    assert "Couldn't search" in SYSTEM_PROMPT
    section = SYSTEM_PROMPT.split("Archival collections", 1)[1]
    assert "Virgo" in section.split("\n\nGuidelines:", 1)[0]  # published books go to the catalog


class LoopingBedrock:
    """Asks for get_library_hours every time; optionally answers once it's told to wrap up."""

    def __init__(self, wrap_up_text=None):
        self.requests = []
        self.wrap_up_text = wrap_up_text

    def converse(self, **kwargs):
        self.requests.append(kwargs)
        last = kwargs["messages"][-1]["content"]
        told_to_wrap_up = any("limit of lookups" in (b.get("text") or "") for b in last)
        if told_to_wrap_up and self.wrap_up_text is not None:
            return {"output": {"message": {"role": "assistant", "content": [{"text": self.wrap_up_text}]}},
                    "stopReason": "end_turn", "usage": {}}
        n = len(self.requests)
        return {"output": {"message": {"role": "assistant", "content": [
            {"toolUse": {"toolUseId": f"t{n}", "name": "get_library_hours", "input": {"library": "Clemons"}}}]}},
            "stopReason": "tool_use", "usage": {}}


def test_step_limit_wraps_up_with_what_was_found():  # trial: "I completed the maximum processing steps."
    agent = make_agent()
    agent.bedrock_runtime = LoopingBedrock(wrap_up_text="Clemons is open 8am–2am. I couldn't finish the rest.")
    result = agent.process_message("hours for every library for the next month?")
    assert result.text == "Clemons is open 8am–2am. I couldn't finish the rest."
    assert "maximum processing steps" not in result.text
    last_request = agent.bedrock_runtime.requests[-1]
    last_msg = last_request["messages"][-1]
    assert last_msg["role"] == "user"
    assert any("toolResult" in b for b in last_msg["content"])  # nudge rides along with the tool results
    roles = [m["role"] for m in last_request["messages"]]
    assert all(a != b for a, b in zip(roles, roles[1:]))  # Converse needs alternating roles
    assert result.trace.stop_reason == "max_iterations"


def test_step_limit_fallback_names_what_was_checked():
    agent = make_agent()
    agent.bedrock_runtime = LoopingBedrock(wrap_up_text=None)  # keeps asking for tools
    result = agent.process_message("hours for every library for the next month?")
    assert "maximum processing steps" not in result.text
    assert "get_library_hours" in result.text and "narrower" in result.text


class FailingBedrock:
    def __init__(self, exc):
        self.exc = exc

    def converse(self, **kwargs):
        raise self.exc


def test_errors_never_show_raw_exception_text():  # review: Slack got "…error processing your request: <boto error>"
    from botocore.exceptions import ClientError

    raw = ("An error occurred (ValidationException) when calling the Converse operation: "
           "messages.3.content.0: arn:aws:bedrock:us-east-1:115119339709:inference-profile/x")
    agent = make_agent()
    agent.bedrock_runtime = FailingBedrock(ClientError(
        {"Error": {"Code": "ValidationException", "Message": raw}}, "Converse"))
    result = agent.process_message("thanks!", request_id="1d0409af-dd71-4ea6-adcd-f9e79b1af616")
    assert "ValidationException" not in result.text and "arn:aws" not in result.text
    assert "1d0409af" in result.text  # reference code to find the trace
    assert result.trace.stop_reason == "error" and "ValidationException" in (result.trace.error or "")


def test_throttling_gets_a_try_again_message():
    from botocore.exceptions import ClientError, ReadTimeoutError

    for exc in (ClientError({"Error": {"Code": "ThrottlingException", "Message": "Too many requests"}}, "Converse"),
                ReadTimeoutError(endpoint_url="https://bedrock-runtime.us-east-1.amazonaws.com")):
        agent = make_agent()
        agent.bedrock_runtime = FailingBedrock(exc)
        text = agent.process_message("thanks!").text
        assert "try again in a minute" in text and "Throttling" not in text and "amazonaws" not in text


if __name__ == "__main__":
    test_trace_records_each_model_call()
    test_system_prompt_catalog_alternate_titles_links_and_citations()
    test_system_prompt_routes_exhaustive_slack_lists_and_file_formats()
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
    test_step_limit_wraps_up_with_what_was_found()
    test_step_limit_fallback_names_what_was_checked()
    test_errors_never_show_raw_exception_text()
    test_throttling_gets_a_try_again_message()
    print("ok")
