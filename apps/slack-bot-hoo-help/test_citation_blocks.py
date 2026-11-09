"""check_citations, part 3: results as Slack tables (25 rows each), one per message."""
import os
import sys
from types import SimpleNamespace

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from citation_blocks import citation_blocks  # noqa: E402
from citation_check import TOOL_CHECK_CITATIONS  # noqa: E402
from slack_blocks import split_messages  # noqa: E402
from test_citation_check import RODMAN  # noqa: E402
from test_citation_tools import AUCTION, make  # noqa: E402


def output(cites):
    t, _ = make()
    return t.call(TOOL_CHECK_CITATIONS, {"citations": cites})


def types(blocks):
    return [b["type"] for b in blocks]


def test_55_citations_three_tables():
    b = citation_blocks(output([RODMAN] + [AUCTION] * 54))
    assert types(b) == ["header", "table", "table", "table", "context"]
    assert [len(x["rows"]) for x in b if x["type"] == "table"] == [26, 26, 6]
    assert b[0]["block_id"] == "citations_report"
    assert [x["block_id"] for x in b if x["type"] == "table"] == ["citations_table_1", "citations_table_2",
                                                                  "citations_table_3"]
    pieces = split_messages(b)
    assert len(pieces) == 3 and all(types(p).count("table") <= 1 for p in pieces)


def test_cells_plain_and_short():
    evil = "<https://evil|x> @channel *b* " + "y" * 200 + ". 2000."
    b = citation_blocks(output([evil, RODMAN]))
    table = [x for x in b if x["type"] == "table"][0]
    first = [c["text"] for c in table["rows"][1]]
    assert all(c["type"] == "raw_text" for c in table["rows"][1])
    assert len(first[1]) <= 120 and first[1].endswith("…")
    assert [c["text"] for c in table["rows"][2]][5] == "u877894"
    mrkdwn = [e["text"] for x in b if x["type"] == "context" for e in x["elements"]]
    assert not any("evil" in m for m in mrkdwn)


def test_summary_kept_tables_dropped():
    from evals.checks import visible_text
    from slack_format import format_for_slack
    step = SimpleNamespace(tool_name="check_citations", output=output([RODMAN, AUCTION]), status="success", input={})
    answer = "UVA has the Rodman book. The auction catalog isn't held.\n\n| # | Citation |\n| --- | --- |\n| 1 | x |"
    text, blocks = format_for_slack(answer, use_llm=False, tool_steps=[step])
    shown = visible_text(blocks)
    assert "UVA has the Rodman book." in shown
    assert not any(line.strip().startswith("|") for line in shown.splitlines())
    assert any(b.get("block_id") == "citations_report" for b in blocks)


def test_error_output_no_blocks():
    assert citation_blocks("Error: give the citations as a list of strings, one per citation.") == []
    assert citation_blocks("") == []
