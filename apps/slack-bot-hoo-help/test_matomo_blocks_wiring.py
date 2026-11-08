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


# ---- final review fixes ------------------------------------------------------------

from test_matomo_blocks import COLLECTIONS, TOP_PAGES, TRAFFIC_COMPARE  # noqa: E402
from matomo_blocks import matomo_blocks_for_step  # noqa: E402


def _step(name, out):
    return SimpleNamespace(tool_name=name, output=out, status="success", input={})


def test_duplicate_labels_after_tidying_keep_their_values():
    dup = COLLECTIONS.replace("| Libra ETD Repository | 8,405 |", "| Hathi Trust Digital Library | 8,405 |")
    bar = [b for b in matomo_blocks_for_step("matomo_virgo_collections", dup, 2)
           if b["type"] == "data_visualization"][0]["chart"]
    labels = bar["axis_config"]["categories"]
    assert len(set(labels)) == 2
    assert [d["value"] for d in bar["series"][0]["data"]] == [51131.0, 8405.0]


def test_every_matomo_result_renders():
    text, blocks = format_for_slack("Traffic doubled; /hours leads.", use_llm=False,
                                    tool_steps=[_step("matomo_traffic", TRAFFIC_COMPARE),
                                                _step("matomo_top_pages", TOP_PAGES)])
    shown = visible_text(blocks)
    assert "/hours" in shown and "247,159" in shown
    assert sum(1 for b in blocks if b["type"] == "table") <= 1
    assert sum(1 for b in blocks if b.get("block_id") == "matomo_report") == 2


def test_occupancy_plus_matomo_one_table_block():
    blocks = blocks_from_tool_steps(occupancy_steps() + [annual_step()])
    assert sum(1 for b in blocks if b["type"] == "table") <= 1


def test_foot_traffic_charts_count_against_budget():
    case = json.load(open(os.path.join(HERE, "evals", "cases", "compare-shannon-clemons.json")))
    foot = [s for s in occupancy_steps() if "foot" in s.tool_name]
    blocks = blocks_from_tool_steps(foot + [annual_step()])
    assert sum(1 for b in blocks if b["type"] == "data_visualization") <= 2
    assert sum(1 for b in blocks if b["type"] == "table") <= 1
