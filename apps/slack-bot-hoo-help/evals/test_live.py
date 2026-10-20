#!/usr/bin/env python3
"""Tests for the live eval tier using fake agents (no network)."""

import os
import sys
import tempfile

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, APP)

import json  # noqa: E402

from evals import live  # noqa: E402
from evals.case import CaseError, load_case  # noqa: E402


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


def test_report_states_guardrail():   # final review #5
    path = os.path.join(tempfile.mkdtemp(), "r.md")
    os.environ.pop("BEDROCK_GUARDRAIL_ID", None)
    live.write_report([], path)
    assert "Guardrail: off" in open(path).read()
    os.environ["BEDROCK_GUARDRAIL_ID"] = "abc123"
    live.write_report([], path)
    assert "Guardrail: abc123" in open(path).read()
    os.environ.pop("BEDROCK_GUARDRAIL_ID")


def test_live_uses_production_model_from_samconfig():
    d = tempfile.mkdtemp()
    path = os.path.join(d, "samconfig.toml")
    open(path, "w").write('[default.deploy.parameters]\nparameter_overrides = "StageName=prod BedrockModelId=minimax.minimax-m2.5 X=1"\n')
    from evals import run
    assert run.production_model_id(path) == "minimax.minimax-m2.5"
    assert run.production_model_id(os.path.join(d, "missing.toml")) is None


class RecordingAgent:
    def __init__(self):
        self.kwargs = None

    def process_message(self, q, **kwargs):
        self.kwargs = kwargs
        return type("R", (), {"text": "ok", "trace": FakeTrace([])})()


def _write_case(data):
    fd, path = tempfile.mkstemp(suffix=".json")
    with os.fdopen(fd, "w") as fh:
        json.dump(data, fh)
    return path


def test_case_extra_context_loaded_and_validated():
    base = {"id": "x", "question": "q?", "live": {"phrases_any": ["a"]}}
    assert load_case(_write_case({**base, "extra_context": ["line one"]}))["extra_context"] == ["line one"]
    assert load_case(_write_case(base)).get("extra_context") is None
    for bad in ("line", [1], [""]):
        try:
            load_case(_write_case({**base, "extra_context": bad}))
            raise AssertionError(f"accepted {bad!r}")
        except CaseError as e:
            assert "extra_context" in str(e)


def test_run_live_passes_extra_context():
    agent = RecordingAgent()
    live.run_live({**LIVE, "extra_context": ["Slack search is unavailable"]}, agent)
    assert agent.kwargs["extra_context"] == ["Slack search is unavailable"]
    agent2 = RecordingAgent()
    live.run_live(LIVE, agent2)
    assert "extra_context" not in agent2.kwargs


if __name__ == "__main__":
    test_live_pass_and_fail_reasons()
    test_live_exception_fails_case_and_report_still_written()
    test_report_states_guardrail()
    test_live_uses_production_model_from_samconfig()
    test_case_extra_context_loaded_and_validated()
    test_run_live_passes_extra_context()
    print("ok")
