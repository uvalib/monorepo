"""Matomo results reach Slack as code-built tables and charts; the model's summary stays, its tables go."""
import json
import os
import sys
from types import SimpleNamespace

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from slack_format import _layout_owned, format_for_slack  # noqa: E402
from slack_blocks import blocks_from_tool_steps  # noqa: E402
import test_matomo_annual_report as A  # noqa: E402
from evals.checks import visible_text  # noqa: E402

HERE = os.path.dirname(__file__)
ANSWER = ("Visual History is again the most-viewed UVA collection. Item views doubled from FY25. "
          "Corks and Curls is the top record.\n\n| Collection | Visits |\n| --- | --- |\n| Visual History | 2,475 |")


def annual_step():
    t, _, _ = A.make()
    return SimpleNamespace(tool_name="matomo_annual_report", output=A.report(t), status="success",
                           input={"fiscal_year": "FY26"})


def occupancy_steps():
    case = json.load(open(os.path.join(HERE, "evals", "cases", "compare-shannon-clemons.json")))
    return [SimpleNamespace(**{k: s.get(k) for k in ("tool_name", "output", "status", "input")})
            for s in case["recorded"]["steps"]]


def test_matomo_blocks_appended_and_summary_kept():
    text, blocks = format_for_slack(ANSWER, use_llm=False, tool_steps=[annual_step()])
    assert any(b.get("block_id") == "matomo_report" for b in blocks)
    shown = visible_text(blocks)
    assert "Visual History is again the most-viewed UVA collection." in shown
    assert not any(line.strip().startswith("|") for line in shown.splitlines())


def test_matomo_chart_does_not_count_as_occupancy():
    blocks = blocks_from_tool_steps([annual_step()])
    assert _layout_owned(blocks) == (False, False, False, True)


def test_occupancy_still_owned():
    blocks = blocks_from_tool_steps(occupancy_steps())
    occ, _, _, matomo = _layout_owned(blocks)
    assert matomo is False and (occ or any(b["type"] == "table" for b in blocks))


def test_chart_budget_shared():
    blocks = blocks_from_tool_steps(occupancy_steps() + [annual_step()])
    assert sum(1 for b in blocks if b["type"] == "data_visualization") <= 2
    assert any(b.get("block_id") == "matomo_report" for b in blocks)


def test_formatter_skipped_for_matomo():
    class Boom:
        def converse(self, **kw):
            raise AssertionError("formatter model must not be called")
    text, blocks = format_for_slack(ANSWER, use_llm=True, tool_steps=[annual_step()], bedrock_client=Boom(),
                                    model_id="minimax.minimax-m2.5")
    assert any(b.get("block_id") == "matomo_report" for b in blocks)
