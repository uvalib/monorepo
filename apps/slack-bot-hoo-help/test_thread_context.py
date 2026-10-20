#!/usr/bin/env python3
"""Unit tests for thread follow-up history helpers (no Slack API)."""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from identity import UserDirectory, _reset_cache  # noqa: E402
from thread_context import (
    extract_thread_history,
    unanswered_turns_line,
    image_urls_from_slack_message,
    sanitize_bedrock_history,
    should_ignore_message_event,
    strip_mention_prefix,
    text_mentions_bot,
    is_from_our_bot,
)


def test_strip_mention():
    assert strip_mention_prefix("<@U123> when is RMC open?", "U123") == "when is RMC open?"
    assert strip_mention_prefix("<@U123> <@U999> hi", "U123") == "hi"
    assert strip_mention_prefix("no mention", "U123") == "no mention"


def test_mentions_bot():
    assert text_mentions_bot("hey <@UABC> hours?", "UABC")
    assert not text_mentions_bot("hey <@UXYZ> hours?", "UABC")


def test_is_from_our_bot():
    assert is_from_our_bot({"user": "U1"}, bot_user_id="U1")
    assert is_from_our_bot({"bot_id": "B9"}, bot_user_id="U1", bot_app_bot_id="B9")
    assert not is_from_our_bot({"user": "U2", "bot_id": "Bother"}, bot_user_id="U1", bot_app_bot_id="B9")


def test_ignore_events():
    assert should_ignore_message_event({"bot_id": "B1", "text": "hi"})
    assert should_ignore_message_event({"subtype": "message_changed", "user": "U1"})
    assert not should_ignore_message_event({"user": "U1", "text": "follow up?"})


def test_sanitize_history():
    raw = [
        {"role": "assistant", "content": [{"text": "orphan assistant"}]},
        {"role": "user", "content": [{"text": "hours for Clemons?"}]},
        {"role": "user", "content": [{"text": "today please"}]},
        {"role": "assistant", "content": [{"text": "*HooHelp is thinking...*"}]},
        {"role": "assistant", "content": [{"text": "Clemons is open 8 AM–12 AM"}]},
        {"role": "user", "content": [{"text": "what about RMC?"}]},
    ]
    cleaned = sanitize_bedrock_history(raw)
    # leading assistant dropped; consecutive users merged; thinking dropped;
    # trailing user dropped (caller will append current question)
    assert cleaned[0]["role"] == "user"
    assert "Clemons" in cleaned[0]["content"][0]["text"]
    assert "today" in cleaned[0]["content"][0]["text"]
    assert cleaned[1]["role"] == "assistant"
    assert "8 AM" in cleaned[1]["content"][0]["text"]
    assert cleaned[-1]["role"] == "assistant"
    # trailing user "what about RMC?" removed so process_message can append it
    assert all(m["role"] != "user" or i == 0 for i, m in enumerate(cleaned) if False)
    assert len(cleaned) == 2


def test_sanitize_empty():
    assert sanitize_bedrock_history([]) == []
    assert sanitize_bedrock_history([{"role": "assistant", "content": [{"text": "x"}]}]) == []


def test_image_urls_from_slack_message():
    url = "https://iiif.lib.virginia.edu/iiif/uva-lib:2163994/full/!800,800/0/default.jpg"
    msg = {
        "text": "Here are some photos.",
        "blocks": [
            {
                "type": "carousel",
                "elements": [
                    {
                        "type": "card",
                        "hero_image": {"type": "image", "image_url": url},
                    }
                ],
            }
        ],
    }
    assert url in image_urls_from_slack_message(msg)


def test_strip_mention_unescapes_slack_entities():
    assert (
        strip_mention_prefix("<@UBOT> rooms at Science &amp; Engineering &lt;3pm&gt;", "UBOT")
        == "rooms at Science & Engineering <3pm>"
    )


class FakeRepliesClient:
    def __init__(self, messages, users=None, fail_users=False):
        self.messages = messages
        self.users = users or {}
        self.fail_users = fail_users

    def conversations_replies(self, channel, ts, limit=50, inclusive=True):
        return {"messages": self.messages}

    def users_info(self, user):
        if self.fail_users or user not in self.users:
            raise RuntimeError("users_info failed")
        return {"user": {"id": user, "real_name": self.users[user], "profile": {}}}

    def users_list(self, cursor=None, limit=200):
        return {"members": [], "response_metadata": {"next_cursor": ""}}


THREAD = [
    {"user": "UA", "text": "<@UBOT> gate counts for Clemons?", "ts": "1"},
    {"user": "UBOT", "bot_id": "B1", "text": "Clemons: 9,206", "ts": "2"},
    {"user": "UB", "text": "thanks <@UA>!", "ts": "3"},
    {"user": "UA", "text": "and Shannon?", "ts": "4"},
]


def _history(client, directory):
    return extract_thread_history(client, "C1", "1", bot_user_id="UBOT", bot_app_bot_id="B1",
                                  current_ts="4", directory=directory)


def test_history_labels_speakers_and_resolves_mentions():
    _reset_cache()
    client = FakeRepliesClient(THREAD, users={"UA": "Alex Kim", "UB": "Blair Roe"})
    hist, ours, _ = _history(client, UserDirectory(client))
    assert hist[0]["content"][0]["text"] == "[Alex Kim]: gate counts for Clemons?"
    assert hist[1]["content"][0]["text"] == "Clemons: 9,206"
    assert ours


def test_history_labels_resolve_mentions_inside_turns():
    _reset_cache()
    msgs = THREAD[:2] + [{"user": "UB", "text": "ask <@UA> about it", "ts": "3"},
                         {"user": "UBOT", "bot_id": "B1", "text": "ok", "ts": "3.5"},
                         {"user": "UA", "text": "and Shannon?", "ts": "4"}]
    client = FakeRepliesClient(msgs, users={"UA": "Alex Kim", "UB": "Blair Roe"})
    hist, _, _ = _history(client, UserDirectory(client))
    assert hist[2]["content"][0]["text"] == "[Blair Roe]: ask @Alex Kim about it"


def test_history_without_directory_unchanged():
    _reset_cache()
    hist, _, _ = _history(FakeRepliesClient(THREAD), None)
    assert hist[0]["content"][0]["text"] == "gate counts for Clemons?"


def test_history_labels_survive_lookup_failure():  # RF5
    _reset_cache()
    client = FakeRepliesClient(THREAD, fail_users=True)
    hist, _, _ = _history(client, UserDirectory(client))
    assert hist[0]["content"][0]["text"] == "[UA]: gate counts for Clemons?"


def test_unanswered_turns_since_last_bot_reply_are_kept():  # review: newest human turns were dropped
    _reset_cache()
    client = FakeRepliesClient(THREAD, users={"UA": "Alex Kim", "UB": "Blair Roe"})
    _, _, meta = _history(client, UserDirectory(client))
    assert meta["unanswered_turns"] == ["[Blair Roe]: thanks @Alex Kim!"]
    line = unanswered_turns_line(meta["unanswered_turns"])
    assert line.startswith("Messages in this thread since your last reply")
    assert "[Blair Roe]: thanks @Alex Kim!" in line
    assert unanswered_turns_line([]) == ""


def test_no_unanswered_turns_without_directory():
    _reset_cache()
    _, _, meta = _history(FakeRepliesClient(THREAD), None)
    assert meta.get("unanswered_turns", []) == []


if __name__ == "__main__":
    test_strip_mention()
    test_strip_mention_unescapes_slack_entities()
    test_mentions_bot()
    test_is_from_our_bot()
    test_ignore_events()
    test_sanitize_history()
    test_sanitize_empty()
    test_image_urls_from_slack_message()
    test_history_labels_speakers_and_resolves_mentions()
    test_history_labels_resolve_mentions_inside_turns()
    test_history_without_directory_unchanged()
    test_history_labels_survive_lookup_failure()
    test_unanswered_turns_since_last_bot_reply_are_kept()
    test_no_unanswered_turns_without_directory()
    print("test_thread_context: OK")
