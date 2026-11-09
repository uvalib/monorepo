"""Router Phase 2 final-review fixes (2026-11-09)."""
import os
import sys
from types import SimpleNamespace

os.environ.setdefault("SLACK_BOT_TOKEN", "xoxb-test")
os.environ.setdefault("SLACK_SIGNING_SECRET", "test")
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from routing import MORE_TOOLS, Route, route_by_rules, route_question  # noqa: E402
from test_routing_rules import Bedrock, Gateway, Local, names  # noqa: E402
from test_agent_context import make_agent  # noqa: E402


def thread(*turns):
    return [{"role": r, "content": [{"text": t}]} for r, t in turns]


# 1 (critical): every local tool set is built, so more_tools can bring any domain back
def test_all_local_tool_sets_built_when_routed(monkeypatch):
    from test_routing_wiring import run_query
    seen, built = run_query(monkeypatch, "what are the hours for fine arts today?", routing=True)
    assert set(seen["route"].domains) == {"library"}
    assert set(built) == {"matomo", "atlassian", "citations"}


def test_more_tools_brings_back_local_tools():
    class Widen(Bedrock):
        def converse(self, **kw):
            self.requests.append(kw)
            if len(self.requests) == 1:
                return {"output": {"message": {"role": "assistant", "content": [
                    {"toolUse": {"toolUseId": "t1", "name": MORE_TOOLS, "input": {"domains": "atlassian"}}}]}},
                    "stopReason": "tool_use", "usage": {}}
            return {"output": {"message": {"role": "assistant", "content": [{"text": "done"}]}},
                    "stopReason": "end_turn", "usage": {}}
    a = make_agent()
    a.gateway_client = Gateway()
    a.bedrock_runtime = Widen()
    r = a.process_message("hold policies doc", local_tools=Local(["search_confluence"]),
                          route=Route(frozenset({"site"}), "rules"))
    assert "search_confluence" not in names(a.bedrock_runtime.requests[0]["toolConfig"])
    assert "search_confluence" in names(a.bedrock_runtime.requests[1]["toolConfig"])  # string input accepted (#5)
    assert r.trace.route["more_tools"] == ["atlassian"]


# 2: keyword rules come before the chime-in hint
def test_rules_before_hint():
    r = route_question("Is Clemons busy and does it have The Miracle of Haitian Art?", [], hint=["library"],
                       enabled=True, v2=True, model=lambda *a, **k: Route.all())
    assert set(r.domains) == {"library", "catalog"} and r.source == "rules"
    r = route_question("any idea?", [], hint=["stats"], enabled=True, v2=True, model=lambda *a, **k: Route.all())
    assert set(r.domains) == {"stats"}


# 3: a follow-up with its own keyword keeps the earlier domains too
def test_follow_up_unions():
    h = thread(("user", "How many pageviews did the Clemons hours page get last month?"),
               ("assistant", "It had 4,210 pageviews in October."))
    r = route_by_rules("and for Shannon?", h)
    assert {"stats", "library"} <= set(r.domains)


# 4: only the latest question is inherited from
def test_inherit_latest_question_only():
    h = thread(("user", "Is Clemons open?"), ("assistant", "Yes, until 2 AM."),
               ("user", "Who is the subject librarian for history?"), ("assistant", "Pat Doe."))
    assert route_by_rules("and for chemistry?", h) is None


# 6: more_tools(github) opens the GitHub gate at once
def test_more_tools_github_opens_gate():
    from local_tools import LocalTools
    from routing import GatedGitHubTools
    from test_github_gate import Inner

    class Gh(Bedrock):
        def converse(self, **kw):
            self.requests.append(kw)
            if len(self.requests) == 1:
                return {"output": {"message": {"role": "assistant", "content": [
                    {"toolUse": {"toolUseId": "t1", "name": MORE_TOOLS, "input": {"domains": ["github"]}}}]}},
                    "stopReason": "tool_use", "usage": {}}
            return {"output": {"message": {"role": "assistant", "content": [{"text": "done"}]}},
                    "stopReason": "end_turn", "usage": {}}
    a = make_agent()
    a.gateway_client = Gateway()
    a.bedrock_runtime = Gh()
    gate = GatedGitHubTools(Inner(), enabled=False, guidance="")
    a.process_message("how is bov published?", local_tools=LocalTools(gate), route=Route(frozenset({"site"}), "rules"))
    assert "GitHub___search_code" in names(a.bedrock_runtime.requests[1]["toolConfig"])


# 7: the chime-in call ran (no valid domains) → no second small-model call
def test_no_second_model_call_after_chime_in():
    calls = []
    r = route_question("any idea?", [], hint=[], enabled=True, v2=True,
                       model=lambda *a, **k: calls.append(1) or Route(frozenset({"site"}), "model"))
    assert r.is_all and calls == []


# 8: routing off leaves traces as before
def test_trace_route_absent_when_off():
    a = make_agent()
    r = a.process_message("hi", route=Route.all("off"))
    assert not getattr(r.trace, "route", None)
