#!/usr/bin/env python3
"""Unit tests for guardrails helpers (no AWS required)."""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from guardrails import (
    DEFAULT_BLOCKED_MESSAGE,
    extract_text_from_message,
    get_guardrail_config,
    message_for_guardrail_block,
)


def test_disabled_without_id():
    os.environ.pop("BEDROCK_GUARDRAIL_ID", None)
    os.environ["BEDROCK_GUARDRAIL_ENABLED"] = "true"
    assert get_guardrail_config() is None


def test_enabled_with_id():
    os.environ["BEDROCK_GUARDRAIL_ID"] = "abc123"
    os.environ["BEDROCK_GUARDRAIL_VERSION"] = "2"
    os.environ["BEDROCK_GUARDRAIL_ENABLED"] = "true"
    os.environ["BEDROCK_GUARDRAIL_TRACE"] = "enabled"
    cfg = get_guardrail_config()
    assert cfg == {
        "guardrailIdentifier": "abc123",
        "guardrailVersion": "2",
        "trace": "enabled",
    }


def test_force_disable():
    os.environ["BEDROCK_GUARDRAIL_ID"] = "abc123"
    os.environ["BEDROCK_GUARDRAIL_ENABLED"] = "false"
    assert get_guardrail_config() is None


def test_blocked_message_fallback():
    assert message_for_guardrail_block({}) == DEFAULT_BLOCKED_MESSAGE
    msg = {"content": [{"text": "Custom blocked text"}]}
    assert message_for_guardrail_block(output_message=msg) == "Custom blocked text"


def test_extract_text():
    assert extract_text_from_message({"content": [{"text": "a"}, {"text": "b"}]}) == "a\n\nb"


if __name__ == "__main__":
    test_disabled_without_id()
    test_enabled_with_id()
    test_force_disable()
    test_blocked_message_fallback()
    test_extract_text()
    print("test_guardrails: OK")
