#!/usr/bin/env python3
"""When must the agent call a tool before answering? (no Bedrock / network)"""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from agent import _needs_tools  # noqa: E402


def test_plurals_stems_and_gate_counts_need_tools():
    for q in ["can you show me all AI related events at the Library", "What are the gate counts for Shannon?",
              "entries for Clemons October 2025", "Can I reserve a room at Shannon?", "any workshops this week?"]:
        assert _needs_tools(q), q


def test_acknowledgements_and_small_talk_do_not():
    for q in ["that's the one, thank you!", "thanks!", "ok great", "Perfect, thanks"]:
        assert not _needs_tools(q), q
    assert not _needs_tools("what is the square root of 63?")
    assert not _needs_tools("what are you?")


def _thread(*user_turns):
    """History of user/assistant turns, the assistant reply being a plain answer."""
    out = []
    for q in user_turns:
        out.append({"role": "user", "content": [{"text": q}]})
        out.append({"role": "assistant", "content": [{"text": "Here are the numbers."}]})
    return out


def test_short_follow_ups_to_a_factual_question_need_tools():
    # 2026-11-03: MiniMax answered "Previous month?" from the thread with invented counts
    # about 1 time in 6, so the follow-up inherits the previous question's need for a lookup.
    gate = _thread("I need a gate count report for patrons using Music library last month")
    for q in ["Previous month?", "How about the Science Library?", "and September?",
              "same for Clemons", "what about last week?"]:
        assert _needs_tools(q, gate), q
    # Without history there's nothing to inherit.
    assert not _needs_tools("Previous month?")
    assert not _needs_tools("Previous month?", [])


def test_a_chain_of_follow_ups_inherits_from_the_question_that_started_it():
    # The live eval thread: a gate-count question, then "How about the Science Library?",
    # then "Previous month?" — the middle turn is itself a follow-up.
    chain = _thread("I need a gate count report for patrons using Music library last month",
                    "How about the Science Library?")
    assert _needs_tools("Previous month?", chain)
    assert not _needs_tools("and 64?", _thread("what is the square root of 63?", "and 63.5?"))


def test_follow_ups_inherit_from_the_latest_question_only():
    chat = _thread("when is Clemons open today?", "what is the square root of 63?")
    assert not _needs_tools("and 64?", chat)
    assert _needs_tools("and tomorrow?", _thread("what is the square root of 63?", "when is Clemons open today?"))


def test_acknowledgements_and_meta_follow_ups_are_still_not_forced():
    gate = _thread("What are the gate counts for Shannon?")
    for q in ["thanks!", "that's the one, thank you!", "what can I ask you?",
              "did anyone mention this in slack?"]:
        assert not _needs_tools(q, gate), q


def test_a_fresh_short_question_is_not_a_follow_up():
    gate = _thread("What are the gate counts for Shannon?")
    for q in ["what is the square root of 64?", "who wrote Moby Dick?"]:
        assert not _needs_tools(q, gate), q
    for q in ["Shannon?", "October", "next week?", "also Clemons", "or Fine Arts?", "for Brown?"]:
        assert _needs_tools(q, gate), q


def test_long_follow_ups_are_judged_on_their_own():
    gate = _thread("What are the gate counts for Shannon?")
    assert not _needs_tools("can you rewrite that answer as a short paragraph I can paste into my note to the dean please", gate)


def test_questions_about_slack_history_are_not_forced():  # live eval: forced hours lookups looped
    for q in ["what did we decide in Slack about the LibCal hours change?",
              "find my Slack message about gate counts", "did anyone mention room bookings in slack?"]:
        assert not _needs_tools(q), q
    assert _needs_tools("when is Clemons open today?")


def test_questions_about_the_assistant_are_not_forced():  # trial: forced retry tripped the guardrail
    for q in ["Can you give me details or documentation about what I can ask you about? What information do you have access to?",
              "what can I ask you?", "what kinds of things do you know about?", "what data do you have access to?"]:
        assert not _needs_tools(q), q
    assert _needs_tools("what are the hours for Clemons?")


if __name__ == "__main__":
    test_plurals_stems_and_gate_counts_need_tools()
    test_acknowledgements_and_small_talk_do_not()
    test_topic_free_follow_ups_are_left_to_the_model()
    test_questions_about_slack_history_are_not_forced()
    test_questions_about_the_assistant_are_not_forced()
    print("ok")
