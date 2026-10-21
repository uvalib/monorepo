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


def test_topic_free_follow_ups_are_left_to_the_model():
    # Decided 2026-10-17: production MiniMax looks these up on its own.
    assert not _needs_tools("Previous month?")


def test_questions_about_slack_history_are_not_forced():  # live eval: forced hours lookups looped
    for q in ["what did we decide in Slack about the LibCal hours change?",
              "find my Slack message about gate counts", "did anyone mention room bookings in slack?"]:
        assert not _needs_tools(q), q
    assert _needs_tools("when is Clemons open today?")


if __name__ == "__main__":
    test_plurals_stems_and_gate_counts_need_tools()
    test_acknowledgements_and_small_talk_do_not()
    test_topic_free_follow_ups_are_left_to_the_model()
    test_questions_about_slack_history_are_not_forced()
    print("ok")
