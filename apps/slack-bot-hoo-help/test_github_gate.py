"""Router Phase 0: GitHub tools (~6,000 tokens of 13,200) are offered only for code questions;
otherwise one small enable_github_tools tool turns them on when the model needs them."""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from routing import ENABLE_GITHUB_TOOL, GatedGitHubTools, wants_github  # noqa: E402
from test_agent_context import make_agent  # noqa: E402

CODE_QUESTIONS = [
    "What's in the README of virgo4-client?",
    "Looking at the bov project, how do I publish new minutes?",
    "Where is the hold request logic in our Go services?",
    "Any open pull requests on virgo4-client?",
    "Which uvalib repos are written in Ruby?",
    "check https://github.com/uvalib/virgo4-client/blob/main/src/main.js",
    "what changed in the last commit to the occupancy site?",
]
OTHER_QUESTIONS = [
    "what are the hours for fine arts today?",
    "Does UVA have this book? Rodman, Selden. _The Miracle of Haitian Art_. 1974.",
    "Give me the FY26 Virgo annual report",
    "Where can I use a CD-Rom",
    "I'm looking for a conversation where a user suggested cataloging something differently",
    "How busy is Clemons right now?",
    "Is there a Jira ticket about the annual report?",
]


def thread(*texts):
    return [{"role": r, "content": [{"text": t}]} for r, t in texts]


def test_wants_github_on_code_questions():
    for q in CODE_QUESTIONS:
        assert wants_github(q, []), q


def test_not_on_other_questions():
    for q in OTHER_QUESTIONS:
        assert not wants_github(q, []), q


def test_follow_up_in_a_github_thread():
    h = thread(("user", "What's in the README of virgo4-client?"),
               ("assistant", "See https://github.com/uvalib/virgo4-client README: it builds with npm."))
    assert wants_github("and how do I run it locally?", h)


class Inner:
    def __init__(self):
        self.calls = []

    def tool_specs(self):
        return [{"toolSpec": {"name": "GitHub___search_code", "description": "code",
                              "inputSchema": {"json": {"type": "object", "properties": {}}}}}]

    def handles(self, name):
        return name == "GitHub___search_code"

    def call(self, name, args):
        self.calls.append(name)
        return "code result"


def test_gate_off_offers_only_the_enable_tool():
    g = GatedGitHubTools(Inner(), enabled=False, guidance="9. **GitHub** guidance text")
    assert [s["toolSpec"]["name"] for s in g.tool_specs()] == [ENABLE_GITHUB_TOOL]
    assert not g.handles("GitHub___search_code")
    out = g.call(ENABLE_GITHUB_TOOL, {})
    assert "GitHub___search_code" in out and "guidance text" in out
    assert [s["toolSpec"]["name"] for s in g.tool_specs()] == ["GitHub___search_code"]
    assert g.handles("GitHub___search_code") and g.call("GitHub___search_code", {}) == "code result"


def test_gate_on_is_the_inner_tools():
    g = GatedGitHubTools(Inner(), enabled=True, guidance="")
    assert [s["toolSpec"]["name"] for s in g.tool_specs()] == ["GitHub___search_code"]


class Bedrock:
    def __init__(self):
        self.requests = []

    def converse(self, **kw):
        self.requests.append(kw)
        n = len(self.requests)
        if n == 1:
            return {"output": {"message": {"role": "assistant", "content": [
                {"toolUse": {"toolUseId": "t1", "name": ENABLE_GITHUB_TOOL, "input": {}}}]}},
                "stopReason": "tool_use", "usage": {}}
        return {"output": {"message": {"role": "assistant", "content": [{"text": "done"}]}},
                "stopReason": "end_turn", "usage": {}}


def test_enabled_tools_appear_on_the_next_step():
    from local_tools import LocalTools
    a = make_agent()
    a.bedrock_runtime = Bedrock()
    g = GatedGitHubTools(Inner(), enabled=False, guidance="")
    a.process_message("how is the bov thing published?", local_tools=LocalTools(g))
    names = lambda req: [t["toolSpec"]["name"] for t in req["toolConfig"]["tools"]]  # noqa: E731
    assert ENABLE_GITHUB_TOOL in names(a.bedrock_runtime.requests[0])
    assert "GitHub___search_code" in names(a.bedrock_runtime.requests[1])


def test_prompt_github_section_only_with_github_tools():
    a = make_agent()
    without = a._system_prompt(tool_names=["Library___get_hours", ENABLE_GITHUB_TOOL])
    with_ = a._system_prompt(tool_names=["Library___get_hours", "GitHub___search_code"])
    assert "**GitHub (uvalib code" not in without and "**GitHub (uvalib code" in with_
