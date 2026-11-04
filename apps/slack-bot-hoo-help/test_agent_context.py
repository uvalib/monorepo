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


def test_system_prompt_sends_doc_questions_to_confluence_even_for_policies():  # live: "doc on hold policies" → website
    from agent import SYSTEM_PROMPT

    assert "must call search_confluence, even when it also mentions a policy" in SYSTEM_PROMPT
    assert "search_uvalib_web (policies/site)" not in SYSTEM_PROMPT


def test_system_prompt_routes_descriptive_archives_questions_to_semantic_search():  # archives KB, phase 2
    from agent import SYSTEM_PROMPT

    assert "search_archives_semantic" in SYSTEM_PROMPT
    section = SYSTEM_PROMPT.split("**Archival collections", 1)[1].split("Guidelines:", 1)[0]
    assert "search_archives_semantic" in section
    assert "names, titles and identifiers" in section and "descriptive" in section
    assert "whole question" in section  # eval: keyword search needs key terms, semantic doesn't
    assert "nothing fits" in section  # eval: semantic always returns five, even for "2024 presidential letters"


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


def test_system_prompt_routes_code_questions_to_github():
    from agent import SYSTEM_PROMPT

    i = SYSTEM_PROMPT.index("9. **GitHub")
    section = SYSTEM_PROMPT[i:i + 2500]
    for name in ("search_code", "get_file_contents", "list_issues", "pull_request_read"):
        assert name in section
    assert "use Jira first" in section
    assert "never repeat a password, key or token" in section
    assert "search_pull_requests with is:issue in the query (search_issues needs a repo)" in section


def test_system_prompt_handles_half_remembered_authors():  # model comparison: every model missed "Heaven" by Kawakami
    from agent import SYSTEM_PROMPT

    assert "half-remember" in SYSTEM_PROMPT and "every author" in SYSTEM_PROMPT


def test_system_prompt_routes_archival_questions():
    from agent import SYSTEM_PROMPT

    assert "search_archives" in SYSTEM_PROMPT and "get_archival_record" in SYSTEM_PROMPT
    assert "finding aid" in SYSTEM_PROMPT and "reading room" in SYSTEM_PROMPT
    assert "archives.lib.virginia.edu" in SYSTEM_PROMPT
    assert "Couldn't search" in SYSTEM_PROMPT
    section = SYSTEM_PROMPT.split("8. **Archival collections", 1)[1].split("\n\nGuidelines:", 1)[0]
    assert "Virgo" in section  # published books go to the catalog


def test_system_prompt_archival_routing_from_staff_testing():  # trial: law papers → website search; "1820s" in query
    from agent import SYSTEM_PROMPT

    section = SYSTEM_PROMPT.split("8. **Archival collections", 1)[1].split("\n\nGuidelines:", 1)[0]
    assert '"papers of' in section.lower() and "before search_uvalib_web" in section
    assert "law" in section.lower() and "nursing" in section.lower()
    assert "year_from" in section and "not in the query" in section
    assert "alongside the catalog" in section


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


# --- prompt rendered per toolset (legacy gateway vs uvalib-mcp) ---

_FIXTURE = os.path.join(os.path.dirname(__file__), "test_fixtures", "system_prompt_legacy.txt")
_V2_NAMES = ["Library___get_library_hours", "Catalog___search_catalog", "Transit___get_bus_routes",
             "search_slack", "wikipedia_search", "GitHub___search_code"]
_LEGACY_NAMES = ["OccupancyReportingRuntime___get_library_hours", "VirgoCatalogRuntime___search_catalog"]


def _rendered(v2):
    agent = make_agent()
    return agent._system_prompt(tool_names=_V2_NAMES if v2 else _LEGACY_NAMES).split("\n\nCurrent date context", 1)[0]


def test_legacy_prompt_unchanged():
    with open(_FIXTURE, encoding="utf-8", newline="") as f:
        legacy = f.read()
    assert _rendered(False) == legacy
    agent = make_agent()
    assert agent._system_prompt().startswith(legacy)  # unknown toolset -> legacy
    assert agent._system_prompt(tool_names=["get_library_hours"]).startswith(legacy)


def test_v2_prompt_names_only_v2_tools():
    import re
    from tool_names import V2

    text = _rendered(True)
    for legacy, (full, _) in V2.items():
        if full.split("___")[-1] != legacy:
            assert not re.search(rf"\b{legacy}\b", text), legacy
    assert 'get_traffic (kind="foot")' in text
    assert 'search_catalog (source="images")' in text or 'get_suggestions (kind="images")' in text
    assert 'get_suggestions (kind="images")' in text


def test_v2_prompt_argument_guidance():
    text = _rendered(True)
    assert "search_catalog field=title" in text and "search_catalog field=author" in text
    assert "availability=today" not in text and "max_results" not in text
    assert "`library`" in text and "`date`" in text  # find_spaces arguments
    assert " location" not in text.split("**Reservable spaces**", 1)[1].split("**Walking directions**", 1)[0]
    assert 'match="meaning"' in text and 'period=' in text
    assert "running_only" in text
    # F3: restored guidance for "where are all the buses" and "send me the ADA map"
    assert "get_bus_routes (include_buses=True)" in text and "no `route`" in text
    assert 'get_directions (accessible="true")' in text and "with no places" in text
    assert "get_bus_locations" not in text and "get_accessible_routes_map" not in text
    # live eval live-archives-nursing: v2 only ever ran the meaning search for institutional history
    assert 'search_archives (match="words") before search_site' in text
    assert "When a question has both a name and a topic, run both kinds." in text
    assert "A meaning search always returns its closest matches" in text
    # no duplicated tool names in one list ("search_catalog, search_catalog")
    assert "search_catalog, search_catalog" not in text and "search_catalog` / `search_catalog" not in text


def test_no_placeholder_left():
    for v2 in (False, True):
        text = _rendered(v2)
        assert "{{" not in text and "}}" not in text


def test_prompt_tool():
    from tool_names import prompt_tool

    assert prompt_tool("get_foot_traffic", False) == "get_foot_traffic"
    assert prompt_tool("get_foot_traffic", True) == 'get_traffic (kind="foot")'
    assert prompt_tool("search_by_field", True) == "search_catalog"
    assert prompt_tool("get_accessible_routes_map", True) == 'get_directions (accessible="true")'
    assert prompt_tool("get_bus_locations", True) == "get_bus_routes (include_buses=True)"


def test_render_prompt_renames_legacy_arguments_on_v2():
    from tool_names import render_prompt

    t = "{{tool:list_space_items}} needs `location`; {{tool:get_space_item}}(location=Shannon); locations"
    assert render_prompt(t, False) == "list_space_items needs `location`; get_space_item(location=Shannon); locations"
    assert render_prompt(t, True) == "find_spaces needs `library`; get_space(library=Shannon); locations"


def test_process_message_renders_prompt_for_the_offered_gateway():
    agent = make_agent()

    def v2_tools():
        return {"tools": [{"toolSpec": {"name": "Library___get_traffic", "description": "traffic",
                                        "inputSchema": {"json": {"type": "object", "properties": {}}}}}]}

    agent.gateway_client.get_bedrock_tool_config = v2_tools
    agent.process_message("thanks!")
    system = agent.bedrock_runtime.requests[0]["system"][0]["text"]
    assert 'get_traffic (kind="foot")' in system and "get_foot_traffic" not in system
    agent = make_agent()
    agent.process_message("thanks!")
    assert "get_foot_traffic" in agent.bedrock_runtime.requests[0]["system"][0]["text"]


def test_search_tool_never_sent_to_bedrock():
    from gateway_mcp_client import GatewayMCPClient

    agent = make_agent()
    client = GatewayMCPClient("https://gw/mcp")
    client.list_tools = lambda force_refresh=False: [
        {"name": n, "description": "d", "inputSchema": {"type": "object", "properties": {}}}
        for n in ("Library___get_traffic", "x_amz_bedrock_agentcore_search", "Site___search_site")]
    agent.gateway_client = client
    agent.process_message("thanks!")
    req = agent.bedrock_runtime.requests[0]
    names = [t["toolSpec"]["name"] for t in req["toolConfig"]["tools"]]
    assert "Library___get_traffic" in names and "Site___search_site" in names
    assert "x_amz_bedrock_agentcore_search" not in names
    assert 'get_traffic (kind="foot")' in req["system"][0]["text"]  # still rendered as the v2 toolset


def test_force_tools_nudge_per_toolset():
    import re
    from agent import _FORCE_TOOLS_NUDGE, _force_tools_nudge
    from tool_names import V2

    legacy = (
        "Please look that up with the live library tools. For more photos, call "
        "search_virgo_image_suggestions with the same visual query and the next page "
        "(page=2, or page=3, etc.) when the earlier result listed another page. "
        "For occupancy or hours, call the tool again for each library named."
    )
    assert _FORCE_TOOLS_NUDGE == _force_tools_nudge(False) == legacy
    v2 = _force_tools_nudge(True)
    for name, (full, _) in V2.items():
        if full.split("___")[-1] != name:
            assert not re.search(rf"\b{name}\b", v2), name
    assert 'call get_suggestions (kind="images") with the same visual query and the next page (page=2' in v2


def test_process_message_forced_retry_names_v2_tools():
    agent = make_agent()
    agent.gateway_client.get_bedrock_tool_config = lambda: {"tools": [{"toolSpec": {
        "name": "Site___get_suggestions", "description": "s",
        "inputSchema": {"json": {"type": "object", "properties": {}}}}}]}
    agent.process_message("What are Clemons hours today?")
    sent = [b.get("text", "") for r in agent.bedrock_runtime.requests for m in r["messages"]
            for b in m["content"] if isinstance(b, dict)]
    nudges = [t for t in sent if t.startswith("Please look that up")]
    assert nudges and all('get_suggestions (kind="images")' in t for t in nudges)
    assert not any("search_virgo_image_suggestions" in t for t in sent)


def test_process_message_forces_a_lookup_for_a_thread_follow_up():
    # 2026-11-03: "Previous month?" after a gate-count answer was answered from the thread
    # with invented counts; the forced retry now covers short follow-ups to factual questions.
    def nudges(history):
        agent = make_agent()
        agent.process_message("Previous month?", conversation_history=history)
        sent = [b.get("text", "") for r in agent.bedrock_runtime.requests for m in r["messages"]
                for b in m["content"] if isinstance(b, dict)]
        return [t for t in sent if t.startswith("Please look that up")]

    gate = [{"role": "user", "content": [{"text": "gate count report for Music library last month"}]},
            {"role": "assistant", "content": [{"text": "Music had 689 entries in June."}]}]
    history = list(gate)
    assert nudges(history)
    assert history == gate  # the caller's history isn't modified
    assert not nudges([])

class SkipsToolsThenLooksUp:
    """Answers without tools, calls a tool when forced, then answers."""

    def __init__(self):
        self.requests = []

    def converse(self, **kwargs):
        self.requests.append(kwargs)
        n = len(self.requests)
        if n == 2:
            return {"output": {"message": {"role": "assistant", "content": [
                {"toolUse": {"toolUseId": "t1", "name": "get_library_hours", "input": {"library": "Clemons"}}}]}},
                "stopReason": "tool_use", "usage": {}}
        return {"output": {"message": {"role": "assistant", "content": [{"text": "Clemons is open 7am-2am."}]}},
                "stopReason": "end_turn", "usage": {}}


def test_forced_tool_choice_applies_to_one_request_only():
    # 2026-11-03: once forced, every later request also said "any tool", so the model could
    # never answer and looped to the step limit (thread-previous-month, ~200 s).
    agent = make_agent()
    agent.bedrock_runtime = SkipsToolsThenLooksUp()
    result = agent.process_message("What are Clemons hours today?")
    choices = [(r.get("toolConfig") or {}).get("toolChoice") for r in agent.bedrock_runtime.requests]
    assert choices == [None, {"any": {}}, None]
    assert result.text == "Clemons is open 7am-2am."
    assert result.trace.stop_reason == "end_turn"

if __name__ == "__main__":
    test_system_prompt_archival_routing_from_staff_testing()
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
    test_system_prompt_routes_code_questions_to_github()
    test_system_prompt_handles_half_remembered_authors()
    test_step_limit_wraps_up_with_what_was_found()
    test_step_limit_fallback_names_what_was_checked()
    test_errors_never_show_raw_exception_text()
    test_throttling_gets_a_try_again_message()
    print("ok")
