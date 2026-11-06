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



def test_run_live_passes_local_tools_through():  # Confluence/Jira are local tools, not gateway tools
    marker = object()
    agent = RecordingAgent()
    live.run_live(LIVE, agent, local_tools=marker)
    assert agent.kwargs["local_tools"] is marker
    agent2 = RecordingAgent()
    live.run_live(LIVE, agent2)
    assert "local_tools" not in agent2.kwargs


def test_atlassian_env_comes_from_samconfig():
    from evals.run import production_atlassian_env

    with tempfile.NamedTemporaryFile("w", suffix=".toml", delete=False) as fh:
        fh.write('parameter_overrides = "EnableAtlassian=true ConfluenceSpaces=CC,sw JiraProjects=TDG,TS '
                 'BedrockModelId=m"\n')
    env = production_atlassian_env(fh.name)
    assert env == {"ENABLE_ATLASSIAN": "true", "CONFLUENCE_SPACES": "CC,sw", "JIRA_PROJECTS": "TDG,TS"}
    with tempfile.NamedTemporaryFile("w", suffix=".toml", delete=False) as fh2:
        fh2.write('parameter_overrides = "BedrockModelId=m"\n')
    assert production_atlassian_env(fh2.name)["ENABLE_ATLASSIAN"] == "false"

def test_live_combines_local_tool_sets():
    from evals import run

    class Set:
        def __init__(self, name):
            self.name = name

        def tool_specs(self):
            return [self.name]

        def handles(self, n):
            return n == self.name

        def call(self, n, a):
            return n

    assert run.combined_local_tools(None, None) is None
    both = run.combined_local_tools(Set("a"), Set("b"))
    assert both.tool_specs() == ["a", "b"] and both.handles("b")
    only = run.combined_local_tools(None, Set("b"))
    assert only.tool_specs() == ["b"]


def test_github_live_switch_from_samconfig_or_env():
    from evals.run import production_github_enabled

    with tempfile.NamedTemporaryFile("w", suffix=".toml", delete=False) as fh:
        fh.write('parameter_overrides = "EnableGitHub=true BedrockModelId=m"\n')
    with tempfile.NamedTemporaryFile("w", suffix=".toml", delete=False) as off:
        off.write('parameter_overrides = "EnableGitHub=false BedrockModelId=m"\n')
    assert production_github_enabled(fh.name, {}) is True
    assert production_github_enabled(off.name, {}) is False
    assert production_github_enabled(off.name, {"HOOHELP_EVAL_GITHUB": "1"}) is True
    assert production_github_enabled("/nonexistent", {}) is False


if __name__ == "__main__":
    test_live_pass_and_fail_reasons()
    test_live_exception_fails_case_and_report_still_written()
    test_report_states_guardrail()
    test_live_uses_production_model_from_samconfig()
    test_case_extra_context_loaded_and_validated()
    test_run_live_passes_extra_context()
    test_run_live_passes_local_tools_through()
    test_atlassian_env_comes_from_samconfig()
    test_live_combines_local_tool_sets()
    test_github_live_switch_from_samconfig_or_env()
    print("ok")


def test_gateway_url_flag_sets_env():
    from evals import run

    seen = {}
    real = run._live
    run._live = lambda cases, model=None, outcomes=None: seen.setdefault("url", os.environ.get("GATEWAY_URL")) and 0
    old = os.environ.pop("GATEWAY_URL", None)
    try:
        run.main(["--live", "--case", "catalog-heaven", "--gateway-url", "https://example.test/mcp"])
        assert seen["url"] == "https://example.test/mcp"
        assert run.gateway_client().gateway_url == "https://example.test/mcp"
    finally:
        run._live = real
        os.environ.pop("GATEWAY_URL", None)
        if old is not None:
            os.environ["GATEWAY_URL"] = old


def test_json_out_written():
    from evals import run

    path = os.path.join(tempfile.mkdtemp(), "out.json")
    assert run.main(["--offline", "--case", "catalog-heaven", "--json-out", path]) == 0
    assert json.load(open(path)) == {"catalog-heaven": "PASS"}


def test_live_tools_any_fails_when_tool_only_errored():
    class ErrTrace(FakeTrace):
        def __init__(self):
            super().__init__([])
            self.steps = [{"tool_name": "matomo_virgo_items", "status": "error", "input": {},
                           "output": "Error: Matomo returned HTTP 504"}]

    class ErrAgent(FakeAgent):
        def process_message(self, q, conversation_history=None):
            return type("R", (), {"text": self.text, "trace": ErrTrace()})()

    case = {"id": "m", "question": "q", "history": [], "expect": {},
            "live": {"tools_any": ["matomo_virgo_items"], "phrases_any": ["format"]}}
    r = live.run_live(case, ErrAgent("The tools appear to be unavailable; more information later.", []))
    assert not r.passed
    assert any("none of tools called" in x for x in r.reasons)
    assert any("none of phrases" in x for x in r.reasons)


def test_matomo_live_cases_have_no_bot_warning():
    cases = os.path.join(APP, "evals", "cases")
    fy = load_case(os.path.join(cases, "live-matomo-fy-so-far.json"))
    assert set(fy["live"]["phrases_any"]) >= {"2026-07-01", "July 1"}
    for name in ("live-matomo-virgo-october", "live-matomo-virgo-items"):
        c = load_case(os.path.join(cases, name + ".json"))
        assert "October" in c["live"]["phrases_any"], name
        assert {"isn't available right now", "94%"} <= set(c["live"]["forbid"]), name


def test_full_live_run_at_most_once_a_day(monkeypatch, tmp_path, capsys):
    # 2026-11-05: live cases cost real money (about $0.02–0.07 each); a full suite runs once a day.
    from datetime import date
    from evals import run

    calls = []
    monkeypatch.setattr(run, "_live", lambda cases, model=None, outcomes=None: calls.append(len(cases)) or 0)
    monkeypatch.setattr(run, "REPORTS_DIR", str(tmp_path))
    monkeypatch.setattr(run, "_today", lambda: date(2026, 11, 5))

    assert run.main(["--live"]) == 0 and len(calls) == 1          # first full run of the day
    assert (tmp_path / ".full-live-run-20261105").exists()
    assert run.main(["--live"]) == 2 and len(calls) == 1          # second is refused
    assert "already ran today" in capsys.readouterr().out
    assert run.main(["--live", "--force"]) == 0 and len(calls) == 2
    assert run.main(["--live", "--case", "hours-rmc"]) == 0 and len(calls) == 3  # targeted runs unaffected
    monkeypatch.setattr(run, "_today", lambda: date(2026, 11, 6))
    assert run.main(["--live"]) == 0 and len(calls) == 4          # a new day


def test_offline_and_targeted_runs_leave_no_marker(monkeypatch, tmp_path):
    from datetime import date
    from evals import run

    monkeypatch.setattr(run, "_live", lambda cases, model=None, outcomes=None: 0)
    monkeypatch.setattr(run, "REPORTS_DIR", str(tmp_path))
    monkeypatch.setattr(run, "_today", lambda: date(2026, 11, 5))
    run.main(["--live", "--case", "hours-rmc"])
    run.main(["--offline", "--case", "hours-rmc"])
    assert not list(tmp_path.glob(".full-live-run-*"))
