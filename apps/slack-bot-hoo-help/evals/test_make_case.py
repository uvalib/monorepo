#!/usr/bin/env python3
"""Tests for turning session traces into scrubbed eval cases."""

import json
import os
import sys

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, APP)

from evals import make_case  # noqa: E402


def trace(ts, msg, reply, thread="111.1", turns=0, at="2026-09-30T12:00:00+00:00"):
    return {"started_at": at, "user_message": msg, "slack_text": reply, "final_text": reply, "history_turns": turns,
            "slack": {"user_id": "U1", "channel_id": "D1", "thread_ts": thread, "message_ts": ts},
            "model_id": "minimax.minimax-m2.5", "request_id": "r", "s3_uri": "s3://x", "system_prompt_hash": "h",
            "steps": [{"tool_name": "T___get_foot_traffic", "status": "success", "input": {"library": "Shannon"},
                       "output": "o" * 25000, "latency_ms": 5}]}


def test_scrub_drops_ids_and_caps_output():
    c = make_case.scrub(trace("1", "q", "a"), [], "id1", "occupancy")
    blob = json.dumps(c)
    for leaked in ("U1", "D1", "s3://", "request_id", "system_prompt_hash", "111.1"):
        assert leaked not in blob, leaked
    assert len(c["recorded"]["steps"][0]["output"]) == 20000
    assert c["expect"] == {"phrases": [], "forbid": [], "attachment": False, "allow_condensed": False}


def test_history_from_earlier_traces_in_thread():
    a = trace("1", "gate counts July", "July: 544", at="2026-09-30T12:00:00+00:00")
    b = trace("2", "Separate them by month", "…", turns=2, at="2026-09-30T12:05:00+00:00")
    other = trace("3", "unrelated", "x", thread="999.9", at="2026-09-30T12:01:00+00:00")
    hist, warns = make_case.build_history(b, [a, b, other])
    assert hist == [{"role": "user", "content": [{"text": "gate counts July"}]},
                    {"role": "assistant", "content": [{"text": "July: 544"}]}] and warns == []


def test_missing_history_warns_not_errors():   # Review Focus 4
    hist, warns = make_case.build_history(trace("2", "Previous month?", "x", turns=4), [])
    assert hist == [] and warns and "history" in warns[0]


def test_likely_names():
    assert make_case.likely_names("event with Doug Chestnut in September") == ["Doug Chestnut"]
    assert make_case.likely_names("Shannon Library and Clemons Library, Fine Arts") == []


def test_make_case_warns_on_slack_and_atlassian_tools():
    warning = "trace includes Slack, Confluence or Jira content — keep only if it's fine to commit"
    for tool in ("search_slack", "read_slack_thread", "search_confluence", "get_confluence_page",
                 "search_jira", "get_jira_issue"):
        assert make_case.slack_warning([{"tool_name": "x"}, {"tool_name": tool}]) == warning, tool
    assert make_case.slack_warning([{"tool_name": "T___get_foot_traffic"}]) is None


if __name__ == "__main__":
    test_scrub_drops_ids_and_caps_output()
    test_history_from_earlier_traces_in_thread()
    test_missing_history_warns_not_errors()
    test_likely_names()
    test_make_case_warns_on_slack_and_atlassian_tools()
    print("ok")
