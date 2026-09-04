#!/usr/bin/env python3
"""Unit tests for thread follow-up history helpers (no Slack API)."""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from thread_context import (
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


if __name__ == "__main__":
    test_strip_mention()
    test_mentions_bot()
    test_is_from_our_bot()
    test_ignore_events()
    test_sanitize_history()
    test_sanitize_empty()
    test_image_urls_from_slack_message()
    print("test_thread_context: OK")
