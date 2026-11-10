"""Citation-check follow-ups (2026-11-10: follow-ups re-searched one by one, counted differently, and one
invented 10 call numbers — the thread history never contained the check's table)."""
import os
import sys

os.environ.setdefault("SLACK_BOT_TOKEN", "xoxb-test")
os.environ.setdefault("SLACK_SIGNING_SECRET", "test")
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from agent import _ungrounded_catalog_claims  # noqa: E402
from citation_blocks import citation_blocks  # noqa: E402
from routing import route_by_rules  # noqa: E402
from slack_blocks import split_messages  # noqa: E402
from test_agent_context import make_agent  # noqa: E402
from test_citation_check import RODMAN  # noqa: E402
from test_citation_tools import AUCTION, make  # noqa: E402


# 1: thread history carries the code-built table, so follow-ups see the check's results
def test_history_includes_code_built_tables():
    from thread_context import extract_thread_history
    t, _ = make()
    out = t.call("check_citations", {"citations": [RODMAN, AUCTION]})
    pieces = split_messages(citation_blocks(out))
    msgs = [{"user": "U1", "text": "check these: ...", "ts": "1.0"}]
    msgs += [{"user": "UBOT", "bot_id": "B1", "text": "UVA has 1 of the 2.", "blocks": p, "ts": f"2.{i}"}
             for i, p in enumerate(pieces)]

    class C:
        def conversations_replies(self, **kw):
            return {"messages": msgs}
    history, _, _ = extract_thread_history(C(), "D1", "1.0", bot_user_id="UBOT", bot_app_bot_id="B1", current_ts="9.0")
    bot = " ".join(b["text"] for m in history if m["role"] == "assistant" for b in m["content"])
    assert "N6606.R62" in bot and "Citation check — 2 citations: 1 held" in bot and "UVA has 1 of the 2." in bot


# 2: invented call numbers are caught even when tools ran this turn
class Bedrock:
    def __init__(self, first, second="Rodman is at Fine Arts Stacks, `N6606.R62`."):
        self.requests, self.first, self.second = [], first, second

    def converse(self, **kw):
        self.requests.append(kw)
        n = len(self.requests)
        if n == 1:
            return {"output": {"message": {"role": "assistant", "content": [
                {"toolUse": {"toolUseId": "t1", "name": "get_library_hours", "input": {}}}]}},
                "stopReason": "tool_use", "usage": {}}
        text = self.first if n == 2 else self.second
        return {"output": {"message": {"role": "assistant", "content": [{"text": text}]}},
                "stopReason": "end_turn", "usage": {}}


def test_invented_call_numbers_get_one_correction_round():
    a = make_agent()
    a.bedrock_runtime = Bedrock("Alexis is Held — `N7432.2 .A44 2000` (Fine Arts).")
    r = a.process_message("show the chart again")
    assert len(a.bedrock_runtime.requests) == 3
    user_texts = [b.get("text", "") for m in a.bedrock_runtime.requests[2]["messages"] if m["role"] == "user"
                  for b in m["content"]]
    assert any("N7432.2 .A44 2000" in t and "don't appear in this turn's results" in t for t in user_texts)
    assert r.text == "Rodman is at Fine Arts Stacks, `N6606.R62`."


def test_grounded_answer_not_corrected():
    a = make_agent()
    a.bedrock_runtime = Bedrock("All good.")
    a.process_message("show the chart again")
    assert len(a.bedrock_runtime.requests) == 2


def test_ungrounded_uses_tool_outputs():
    assert not _ungrounded_catalog_claims("at `N6606.R62`", ["tool said N6606.R62"])
    assert _ungrounded_catalog_claims("at `N7432.2 .A44 2000`", ["tool said N6606.R62"])


# 3: prompt keeps follow-ups on the check's table
def test_prompt_citation_follow_ups():
    from test_agent_context import _rendered
    text = _rendered(True)
    assert "answer follow-ups about that list from its table" in text
    assert "call check_citations again" in text


# 4: "show me" alone isn't images
def test_show_me_alone_is_not_images():
    r = route_by_rules("you say you updated the chart? can you show me the chart, i'm not seeing it", [])
    assert r is None or "images" not in r.domains
    assert "images" in route_by_rules("show me photos of the Rotunda", []).domains
