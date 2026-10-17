#!/usr/bin/env python3
"""Tests for the regression-eval check functions and offline replay (no network)."""

import json
import os
import sys
import tempfile

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, APP)
sys.path.insert(0, os.path.join(APP, "src"))

from evals import checks  # noqa: E402
from evals import case, offline, run  # noqa: E402

SEC = lambda t: {"type": "section", "text": {"type": "mrkdwn", "text": t}}  # noqa: E731
TABLE = {"type": "table", "rows": [[{"type": "raw_text", "text": "Entrance"}], [{"type": "raw_text", "text": "73,469"}]]}


def test_universal_passes_clean_output():
    assert checks.universal("Hello *Clemons*", [SEC("Hello *Clemons*"), TABLE]) == []


def test_universal_limits():
    assert any("table" in r for r in checks.universal("x", [TABLE, TABLE]))
    assert any("3000" in r for r in checks.universal("x", [SEC("a" * 3001)]))
    assert any("50" in r for r in checks.universal("x", [SEC("a")] * 51))
    assert any("rich_text" in r for r in checks.universal("x", [{"type": "rich_text"}]))


def test_universal_forbidden_text():
    for bad in ["**bold**", "| :--- |", "<thinking>x</thinking>", "the Media Outlets Policy",
                "Tool Error: Unknown tool: x"]:
        assert checks.universal(bad, [SEC(bad)]), bad


def test_markdown_table_allowed_in_fallback_only():
    fallback = "Counts:\n| Entrance | In |\n| :--- | :--- |\n| Main | 73,469 |"
    assert checks.universal(fallback, [SEC("Counts:"), TABLE]) == []
    assert checks.universal("x", [SEC("| :--- |")])                    # raw table in a visible block fails
    assert checks.universal("leak: Media Outlets Policy", [SEC("ok")])  # leaks still caught in fallback


def test_visible_text_reaches_tables_fields_cards():   # Review Focus 1
    blocks = [TABLE, {"type": "section", "fields": [{"type": "mrkdwn", "text": "*Entries*\n544"}]},
              {"type": "card", "title": {"type": "plain_text", "text": "Rotunda"}}]
    vt = checks.visible_text(blocks)
    assert "73,469" in vt and "544" in vt and "Rotunda" in vt
    assert checks.phrases_all(vt, ["73,469", "Clemons"]) == ["missing phrase: 'Clemons'"]   # Review Focus 5
    assert checks.phrases_all("*Clemons* hours", ["Clemons hours"]) == []


def test_not_collapsed():
    answer = ("Faculty accessibility remediation services: contact lib-a11y, captioning through coaa, "
              "subject liaison librarians help locate accessible readings, video resources guide")
    assert checks.not_collapsed(answer, [SEC(answer)]) == []
    assert checks.not_collapsed(answer, [SEC("Accessibility remediation services. Contact lib-a11y.")])


def test_tools_any_and_phrases_any():
    assert checks.tools_any(["OccupancyReportingRuntime___get_traffic_by_period"], ["get_traffic_by_period"]) == []
    assert checks.tools_any(["X___get_foot_traffic"], ["get_traffic_by_period"])
    assert checks.phrases_any("gold line arriving", ["Silver", "Gold Line"]) == []
    assert checks.forbid("Main Library hours", ["main library"])


CASE = {"id": "synthetic-entrance", "category": "occupancy", "question": "Clemons gate counts April by entrance in Excel",
        "recorded": {"model": "m", "final_text": "Here are the counts:\n\n| Entrance | In |\n| :--- | :--- |\n| Main | 73,469 |",
                     "steps": [{"tool_name": "OccupancyReportingRuntime___get_entrance_traffic", "status": "success", "input": {},
                                "output": "### Entrance Traffic Breakdown: Clemons\n\n| Entrance | In (Entries) |\n| :--- | :--- |\n| Main | 73,469 |"}]},
        "expect": {"phrases": ["73,469"], "attachment": True}}


def test_offline_replay_passes_and_builds_attachment():
    r = offline.run_offline(CASE)
    assert r.passed, r.reasons


def test_offline_reports_missing_phrase():
    bad = {**CASE, "expect": {"phrases": ["99,999"]}}
    r = offline.run_offline(bad)
    assert not r.passed and "missing phrase: '99,999'" in r.reasons


def test_live_only_case_skipped_offline():   # Review Focus 2
    r = offline.run_offline({"id": "live-only", "question": "q", "live": {"tools_any": []}, "history": [], "expect": {}})
    assert r.skipped and r.passed


def test_load_case_errors_and_cli_exit_codes():
    d = tempfile.mkdtemp()
    json.dump(CASE, open(os.path.join(d, "ok.json"), "w"))
    open(os.path.join(d, "broken.json"), "w").write("{nope")
    loaded = case.load_cases(d)
    assert sum(isinstance(x, case.CaseError) for x in loaded) == 1
    assert run.main(["--offline", "--cases-dir", d]) == 1                       # broken case fails the run
    os.remove(os.path.join(d, "broken.json"))
    assert run.main(["--offline", "--cases-dir", d]) == 0
    assert run.main(["--offline", "--cases-dir", d, "--case", "nope"]) == 2


# ---- Mutation tests: the gate must fail when the posted message is broken.
import slack_format  # noqa: E402

CASES_DIR = os.path.join(APP, "evals", "cases")


def _failures_with(attr, replacement):
    original = getattr(slack_format, attr)
    setattr(slack_format, attr, replacement(original))
    try:
        results = [offline.run_offline(c) for c in case.load_cases(CASES_DIR) if isinstance(c, dict)]
    finally:
        setattr(slack_format, attr, original)
    return [r.id for r in results if not r.passed and not r.skipped]


def test_gate_fails_when_prose_dropped():   # final review #1
    def drop(orig):
        return lambda mrkdwn, images, extra_blocks=None, llm_blocks=None: orig("Here you go.", images, extra_blocks, llm_blocks)
    assert len(_failures_with("_build_blocks", drop)) >= 20


def test_gate_fails_when_tool_blocks_dropped():   # final review #2
    assert len(_failures_with("blocks_from_tool_steps", lambda orig: (lambda *a, **k: []))) >= 3


def test_gate_fails_when_answer_collapsed_to_one_line():   # final review #3
    def collapse(orig):
        return lambda text: " ".join(orig(text).split())
    assert len(_failures_with("_local_markdown_cleanup", collapse)) >= 10


def test_case_types_validated():   # final review #4
    d = tempfile.mkdtemp()
    bad = [{**CASE, "id": "s", "expect": {"phrases": "73,469"}},
           {**CASE, "id": "k", "expect": {"phrase": ["x"]}},
           {**CASE, "id": "r", "recorded": []},
           {**CASE, "id": "l", "live": {"tools_any": "find_bus_trip"}}]
    for c in bad:
        path = os.path.join(d, c["id"] + ".json")
        json.dump(c, open(path, "w"))
        try:
            case.load_case(path)
            assert False, c["id"]
        except case.CaseError:
            pass


TESTS = [
    test_universal_passes_clean_output,
    test_universal_limits,
    test_universal_forbidden_text,
    test_markdown_table_allowed_in_fallback_only,
    test_visible_text_reaches_tables_fields_cards,
    test_not_collapsed,
    test_tools_any_and_phrases_any,
    test_offline_replay_passes_and_builds_attachment,
    test_offline_reports_missing_phrase,
    test_live_only_case_skipped_offline,
    test_load_case_errors_and_cli_exit_codes,
    test_gate_fails_when_prose_dropped,
    test_gate_fails_when_tool_blocks_dropped,
    test_gate_fails_when_answer_collapsed_to_one_line,
    test_case_types_validated,
]

if __name__ == "__main__":
    for fn in TESTS:
        fn()
    print("ok")
