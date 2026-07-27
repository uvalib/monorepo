#!/usr/bin/env python3
"""Unit smoke tests for session_trace (no AWS / Bedrock required)."""

import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from session_trace import SessionTrace, normalize_trace_mode, system_prompt_hash


def test_normalize_mode():
    assert normalize_trace_mode("off") == "off"
    assert normalize_trace_mode("false") == "off"
    assert normalize_trace_mode("cloudwatch") == "cloudwatch"
    assert normalize_trace_mode("cw") == "cloudwatch"
    assert normalize_trace_mode("s3") == "s3"
    assert normalize_trace_mode("both") == "both"
    assert normalize_trace_mode("weird") == "cloudwatch"


def test_trace_roundtrip():
    t = SessionTrace(request_id="test-req-1")
    t.set_request(
        "What is Shannon's phone?",
        history_turns=0,
        model_id="us.amazon.nova-pro-v1:0",
        gateway_url="https://example.gateway/mcp",
        system_prompt="You are HooHelp.\n\nCurrent date context...",
        slack={"user_id": "U123", "channel_id": "C456"},
    )
    t.add_tool_step(
        tool_use_id="tu1",
        tool_name="OccupancyReportingRuntime___get_libraries",
        tool_input={},
        output="**Phone**: 434-924-3282\n" + ("x" * 100),
        latency_ms=120,
        iteration=1,
    )
    t.finish(final_text="Shannon Library: 434-924-3282", stop_reason="end_turn", iterations=2)
    t.set_slack_reply("*Shannon Library*: 434-924-3282")

    full = t.to_dict(full_outputs=True)
    assert full["event"] == "hoohelp_session_trace"
    assert full["request_id"] == "test-req-1"
    assert full["tools_used"] == ["OccupancyReportingRuntime___get_libraries"]
    assert "434-924-3282" in full["steps"][0]["output"]
    assert full["system_prompt_hash"] == system_prompt_hash(
        "You are HooHelp.\n\nCurrent date context..."
    )
    assert full["duration_ms"] is not None

    summary = t.to_dict(full_outputs=False)
    # Truncation only kicks in for long bodies; short phone answer is fine
    assert summary["tool_call_count"] == 1

    # emit with off should not raise
    os.environ["CONVERSATION_TRACE"] = "off"
    out = t.emit()
    assert out["emit_mode"] == "off"

    # JSON serializable
    json.dumps(full, default=str)
    print("test_session_trace: OK")


if __name__ == "__main__":
    test_normalize_mode()
    test_trace_roundtrip()
