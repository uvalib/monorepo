"""Live tier: real questions through the agent + gateway, with a markdown report."""

from __future__ import annotations

import os
import sys
import time
from datetime import datetime

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(APP, "src"))

from slack_format import format_for_slack  # noqa: E402

from evals import checks  # noqa: E402
from evals.case import CaseResult  # noqa: E402


def have_aws_credentials() -> bool:
    import boto3

    return boto3.Session().get_credentials() is not None


def run_live(case: dict, agent, local_tools=None) -> CaseResult:
    spec = case.get("live") or {}
    started = time.monotonic()
    try:
        kwargs = {"conversation_history": case.get("history") or []}
        if case.get("extra_context"):
            kwargs["extra_context"] = case["extra_context"]  # e.g. "Slack search is unavailable…"
        if local_tools is not None:
            kwargs["local_tools"] = local_tools  # Confluence/Jira, as production passes them
        result = agent.process_message(case["question"], **kwargs)
        seconds = time.monotonic() - started
        trace = result.trace
        tools = list(trace.tools_used())
        text, blocks = format_for_slack(result.text, use_llm=False, tool_steps=trace.steps)
    except Exception as e:  # one failing question must not stop the run
        return CaseResult(case["id"], False, [f"exception: {type(e).__name__}: {e}"],
                          seconds=time.monotonic() - started)
    shown = checks.visible_text(blocks)
    reasons = checks.universal(text, blocks)
    reasons += checks.tools_any(tools, spec.get("tools_any") or [])
    reasons += checks.phrases_any(shown, spec.get("phrases_any") or [])
    reasons += checks.forbid(shown, spec.get("forbid") or [])
    max_seconds = spec.get("max_seconds")
    if max_seconds and seconds > max_seconds:
        reasons.append(f"took {seconds:.0f} s (max {max_seconds})")
    stop = getattr(trace, "stop_reason", None)
    if stop and stop != "end_turn":
        reasons.append(f"stop_reason: {stop}")
    return CaseResult(case["id"], not reasons, reasons, seconds=seconds, tools=tools, slack_text=text)


def write_report(results: list[CaseResult], path: str) -> None:
    passed = sum(r.passed for r in results)
    lines = [
        f"# HooHelp live eval — {datetime.now():%Y-%m-%d %H:%M}",
        "",
        f"Model: `{os.environ.get('BEDROCK_MODEL_ID', 'default')}` · "
        f"Guardrail: {os.environ.get('BEDROCK_GUARDRAIL_ID') or 'off (production runs with one)'} · "
        f"{passed}/{len(results)} passed",
        "",
        "| case | result | seconds | tools |",
        "| :--- | :--- | ---: | :--- |",
    ]
    for r in results:
        tools = ", ".join(t.split("___")[-1] for t in r.tools) or "—"
        lines.append(f"| {r.id} | {'PASS' if r.passed else 'FAIL'} | {r.seconds:.0f} | {tools} |")
    for r in results:
        lines += ["", f"## {r.id} — {'PASS' if r.passed else 'FAIL'}"]
        if r.reasons:
            lines += [""] + [f"- {reason}" for reason in r.reasons]
        lines += ["", "```", r.slack_text or "(no answer)", "```"]
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w") as fh:
        fh.write("\n".join(lines) + "\n")
