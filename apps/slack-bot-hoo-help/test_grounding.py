"""Catalog answers must come from lookups (2026-11-09: "yes" to "continue with 26–35?" was answered
from memory, with invented holdings, call numbers and Virgo links)."""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from agent import _drop_unseen_item_links, _needs_tools, _ungrounded_catalog_claims  # noqa: E402
from test_agent_context import make_agent  # noqa: E402

OFFER = "Here are items 16–25. Want me to continue with items 26–35?"
INVENTED = ("Here's what I found for items 26–35:\n| 26 | Hurbon. *Voodoo* | Yes — Fine Arts Stacks, "
            "`BL2530.V6 H8713 1995` — <https://search.lib.virginia.edu/sources/uva_library/items/u1108985> |")


def thread(*turns):
    out = []
    for role, text in turns:
        out.append({"role": role, "content": [{"text": text}]})
    return out


LIST = thread(("user", "Here is my bibliography, 55 items: Alexis. Edouard Duval-Carrié. 1996. ..."),
              ("assistant", OFFER))


def test_yes_to_an_offer_to_keep_looking_needs_tools():
    for reply in ("Yes.", "yes", "yes please", "go ahead", "continue", "please do the next 10", "sure", "ok"):
        assert _needs_tools(reply, LIST), reply


def test_yes_without_an_offer_or_thanks_does_not():
    chat = thread(("user", "Tell me a fun fact about libraries"), ("assistant", "Libraries lend seeds too! Anything else?"))
    assert not _needs_tools("yes", chat)
    assert not _needs_tools("thanks", LIST)


def test_ungrounded_catalog_claims():
    assert _ungrounded_catalog_claims(INVENTED, ["the bibliography text"])
    assert not _ungrounded_catalog_claims(INVENTED, ["earlier: u1108985 at BL2530.V6 H8713 1995"])
    assert not _ungrounded_catalog_claims("The Fine Arts Library is open 9–11 today.", [])


class Bedrock:
    """1st reply: invented catalog results with no tool call; then a lookup; then the grounded answer."""

    def __init__(self):
        self.requests = []

    def converse(self, **kw):
        self.requests.append(kw)
        n = len(self.requests)
        if n == 1:
            return {"output": {"message": {"role": "assistant", "content": [{"text": INVENTED}]}},
                    "stopReason": "end_turn", "usage": {}}
        if n == 2:
            return {"output": {"message": {"role": "assistant", "content": [
                {"toolUse": {"toolUseId": "t1", "name": "get_library_hours", "input": {}}}]}},
                "stopReason": "tool_use", "usage": {}}
        return {"output": {"message": {"role": "assistant", "content": [{"text": "Item 26 isn't in the catalog."}]}},
                "stopReason": "end_turn", "usage": {}}


def test_invented_catalog_answer_forces_a_lookup():
    a = make_agent()
    a.bedrock_runtime = Bedrock()
    result = a.process_message("Yes.", conversation_history=thread(("user", "Is item 26 in Virgo? Hurbon, Voodoo"),
                                                                   ("assistant", "Shall I check it?")))
    assert a.bedrock_runtime.requests[1]["toolConfig"]["toolChoice"] == {"any": {}}
    assert result.text == "Item 26 isn't in the catalog."


def test_grounded_catalog_answer_is_not_forced():
    a = make_agent()
    a.bedrock_runtime = Bedrock()
    history = thread(("user", "list them again"), ("assistant", "26: u1108985, `BL2530.V6 H8713 1995`"))
    a.process_message("thanks, show that table again", conversation_history=history)
    assert len(a.bedrock_runtime.requests) == 1


def test_unseen_item_links_become_plain_text():
    known = ["...items/u2 ..."]
    text = ("See <https://search.lib.virginia.edu/sources/uva_library/items/u1|Voodoo> and "
            "[Spirit](https://search.lib.virginia.edu/sources/uva_library/items/u2) and "
            "https://search.lib.virginia.edu/sources/uva_library/items/u3")
    out = _drop_unseen_item_links(text, known)
    assert "items/u1" not in out and "Voodoo" in out
    assert "items/u2" in out
    assert "items/u3" not in out


def test_grounding_check_alone_forces_a_lookup():
    # "make that a chart" is not a lookup request, but the draft invents catalog records.
    a = make_agent()
    a.bedrock_runtime = Bedrock()
    a.process_message("make that a chart", conversation_history=thread(("user", "chart please"),
                                                                       ("assistant", "Here is the list.")))
    assert a.bedrock_runtime.requests[1]["toolConfig"]["toolChoice"] == {"any": {}}


def test_prompt_batches_list_lookups_and_forbids_unsourced_holdings():
    from test_agent_context import _rendered
    for v2 in (True, False):
        text = _rendered(v2)
        assert "up to 5 catalog calls in one step" in text
        assert "call check_citations once with all of them (up to 100)" in text
        assert "also search by its author and mention any other edition or translation" in text
        assert "Never state that UVA owns an item, or give a call number or Virgo link" in text
