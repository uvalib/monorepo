#!/usr/bin/env python3
"""Tests for the live eval tier using fake agents (no network)."""

import os
import sys
import tempfile

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, APP)

from evals import live  # noqa: E402


class FakeTrace:
    def __init__(self, tools, stop="end_turn"):
        self.steps = [{"tool_name": t, "status": "success", "output": ""} for t in tools]
        self.stop_reason = stop

    def tools_used(self):
        return [s["tool_name"] for s in self.steps]


class FakeAgent:
    def __init__(self, text, tools, boom_on=None):
        self.text, self.tools, self.boom_on = text, tools, boom_on

    def process_message(self, q, conversation_history=None):
        if q == self.boom_on:
            raise TimeoutError("gateway read timed out")
        return type("R", (), {"text": self.text, "trace": FakeTrace(self.tools)})()


LIVE = {"id": "bus", "question": "Shannon to Darden?", "history": [], "expect": {},
        "live": {"tools_any": ["find_bus_trip"], "phrases_any": ["Gold Line"], "forbid": [], "max_seconds": 90}}


def test_live_pass_and_fail_reasons():
    ok = live.run_live(LIVE, FakeAgent("Take the *Gold Line* from Central Grounds Garage", ["UVATransitRuntime___find_bus_trip"]))
    assert ok.passed, ok.reasons
    bad = live.run_live(LIVE, FakeAgent("Walk there.", ["X___get_walking_directions"]))
    assert not bad.passed and len(bad.reasons) == 2


def test_live_exception_fails_case_and_report_still_written():   # Review Focus 3
    agent = FakeAgent("Gold Line", ["UVATransitRuntime___find_bus_trip"], boom_on="boom")
    results = [live.run_live({**LIVE, "id": "a", "question": "boom"}, agent), live.run_live(LIVE, agent)]
    assert not results[0].passed and "TimeoutError" in results[0].reasons[0] and results[1].passed
    path = os.path.join(tempfile.mkdtemp(), "r.md")
    live.write_report(results, path)
    text = open(path).read()
    assert "| a | FAIL" in text and "| bus | PASS" in text and "Gold Line" in text


if __name__ == "__main__":
    test_live_pass_and_fail_reasons()
    test_live_exception_fails_case_and_report_still_written()
    print("ok")
