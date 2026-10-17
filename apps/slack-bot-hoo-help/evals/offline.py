"""Offline tier: replay a case's recorded trace through today's formatting code."""

from __future__ import annotations

import os
import sys
from io import BytesIO

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(APP, "src"))

from slack_format import format_for_slack  # noqa: E402
from spreadsheet import build_xlsx, tables_from_steps, wants_spreadsheet  # noqa: E402

from evals import checks  # noqa: E402
from evals.case import CaseResult  # noqa: E402


def _attachment_reasons(case: dict, steps: list) -> list[str]:
    if not wants_spreadsheet(case["question"]):
        return ["expected attachment, but the question doesn't ask for Excel/CSV"]
    tables = tables_from_steps(steps)
    if not tables:
        return ["expected attachment, but no table-producing tool output"]
    from openpyxl import load_workbook

    wb = load_workbook(BytesIO(build_xlsx(tables)))
    if len(wb.sheetnames) != len(tables):
        return [f"workbook has {len(wb.sheetnames)} sheets for {len(tables)} tables"]
    return []


def run_offline(case: dict) -> CaseResult:
    rec = case.get("recorded")
    if not rec:
        return CaseResult(case["id"], True, [], skipped=True)
    text = ""
    try:
        steps = rec["steps"]
        text, blocks = format_for_slack(rec["final_text"], use_llm=False, tool_steps=steps)
        expect = case.get("expect") or {}
        reasons = checks.universal(text, blocks)
        if not expect.get("allow_condensed"):
            reasons += checks.not_collapsed(rec["final_text"], blocks)
            reasons += checks.structure_kept(rec["final_text"], blocks)
        reasons += checks.blocks_present(blocks, expect.get("blocks") or [])
        # Only what Slack shows counts: the fallback text always holds the full answer.
        shown = checks.visible_text(blocks)
        reasons += checks.phrases_all(shown, expect.get("phrases") or [])
        reasons += checks.forbid(shown, expect.get("forbid") or [])
        if expect.get("attachment"):
            reasons += _attachment_reasons(case, steps)
    except Exception as e:  # a broken case or replay must not stop the run
        reasons = [f"exception: {type(e).__name__}: {e}"]
    return CaseResult(case["id"], not reasons, reasons, slack_text=text)
