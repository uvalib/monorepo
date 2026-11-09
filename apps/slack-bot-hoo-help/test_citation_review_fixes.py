"""Final-review fixes for check_citations (2026-11-09)."""
import os
import sys
import time
from types import SimpleNamespace

os.environ.setdefault("SLACK_BOT_TOKEN", "xoxb-test")
os.environ.setdefault("SLACK_SIGNING_SECRET", "test")
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from citation_blocks import citation_blocks  # noqa: E402
from citation_check import TOOL_CHECK_CITATIONS, CitationTools, match, parse_citation, Record  # noqa: E402
from slack_blocks import split_messages  # noqa: E402
from test_citation_check import RODMAN  # noqa: E402
from test_citation_tools import AUCTION, Gateway, make, rows  # noqa: E402


def check(cites, **kw):
    t, _ = make(**kw)
    return t.call(TOOL_CHECK_CITATIONS, {"citations": cites})


# 1 (critical): a later "csv please" exports every row, with full Virgo links
def test_thread_tables_join_across_messages_with_full_links():
    from thread_context import extract_thread_history
    pieces = split_messages(citation_blocks(check([RODMAN] + [AUCTION] * 30)))
    assert len(pieces) == 2
    msgs = [{"user": "U1", "text": "check these", "ts": "1.0"}]
    msgs += [{"user": "UBOT", "bot_id": "B1", "text": "part", "blocks": p, "ts": f"2.{i}"} for i, p in enumerate(pieces)]
    msgs += [{"user": "U1", "text": "thanks", "ts": "3.0"}, {"user": "U1", "text": "csv please", "ts": "9.0"}]

    class C:
        def conversations_replies(self, **kw):
            return {"messages": msgs}
    _, _, meta = extract_thread_history(C(), "D1", "1.0", bot_user_id="UBOT", bot_app_bot_id="B1", current_ts="9.0")
    tables = meta["data_tables"]
    assert len(tables) == 1 and len(tables[0].rows) == 31
    link = tables[0].headers.index("Virgo link")
    assert tables[0].rows[0][link] == "https://search.lib.virginia.edu/sources/uva_library/items/u877894"


def test_file_line_asks_to_rerun_a_citation_check():
    from attachments import file_context_line
    line = file_context_line("csv", available=True, rerun_citations=True)
    assert "call check_citations again with the same citations" in line


# 2: the check's budget leaves time to answer before the reply deadline
def test_budget_respects_reply_deadline():
    t = CitationTools(Gateway(delay=0.3), v2=lambda: True, deadline=time.monotonic() + 25.5)
    t0 = time.monotonic()
    out = t.call(TOOL_CHECK_CITATIONS, {"citations": [f"A{i}, B. _T {i} x y z_. 2000." for i in range(40)]})
    assert time.monotonic() - t0 < 3 and "not checked" in out.splitlines()[0]


# 3: every check in a turn renders (rows 1–100 and 101–150), exact repeats once
def test_all_checks_in_a_turn_render():
    from slack_blocks import blocks_from_tool_steps
    t, _ = make()
    first = t.call(TOOL_CHECK_CITATIONS, {"citations": [AUCTION] * 3})
    second = t.call(TOOL_CHECK_CITATIONS, {"citations": [RODMAN], "start_number": 4})
    steps = [SimpleNamespace(tool_name="check_citations", output=o, status="success", input={})
             for o in (first, first, second)]
    blocks = blocks_from_tool_steps(steps)
    headers = [b for b in blocks if b.get("type") == "header"]
    assert len(headers) == 2
    cells = [r[0]["text"] for b in blocks if b["type"] == "table" for r in b["rows"][1:]]
    assert cells == ["1", "2", "3", "4"]


def test_prompt_prefers_check_citations():
    from test_agent_context import _rendered
    text = _rendered(True)
    assert "When check_citations isn't available, search several at once" in text


# 4: "Clemons June gate counts as csv" is not a bare file request
def test_bare_file_request():
    from app import _bare_file_request
    assert _bare_file_request("csv please")
    assert _bare_file_request("yes. I want to download the csv")
    assert not _bare_file_request("Clemons June gate counts as csv")


# 5: auction catalogs are at most "likely"
def test_auction_catalog_never_exact():
    c = parse_citation("_Latin American Paintings, Drawings and Sculpture_. Sotheby's Sale 6301. 1992.")
    r = Record(title="Latin American Paintings, Drawings and Sculpture", author="", library="", location="",
               call_number="", url="", item_id="")
    assert match(c, r) == "likely"
    c2 = parse_citation("Sotheby's. _Latin American Art_. Sale 6301. 1990.")
    r2 = Record(title="Latin American Art", author="Sotheby's", library="", location="", call_number="", url="",
                item_id="")
    assert match(c2, r2) == "likely"


# 6: a Virgo URL pasted in a citation is not a trusted link source
def test_citation_text_urls_not_trusted():
    from agent import _link_sources
    out = check(["Odd https://search.lib.virginia.edu/sources/uva_library/items/u999 citation. 2000.", RODMAN])
    trusted = _link_sources(SimpleNamespace(steps=[SimpleNamespace(tool_name="check_citations", output=out,
                                                                   input={})]))[1]
    assert not any("u999" in u for u in trusted) and any("u877894" in u for u in trusted)


# 7: no table block over Slack's per-table text cap
def test_tables_under_char_cap():
    long = "Author, A. _" + "Very long title words " * 20 + "_. 2000."
    from test_citation_tools import HURBON_AUTHOR
    blocks = citation_blocks(check([long] * 25))
    for b in blocks:
        if b["type"] == "table":
            assert sum(len(c["text"]) for row in b["rows"] for c in row) <= 9000


# 8: gateway down: one error line, not 100 failed rows
def test_gateway_down_one_error_line():
    class Down(Gateway):
        def __call__(self, name, args):
            return "Error: gateway unavailable"
    t = CitationTools(Down(), v2=lambda: True)
    out = t.call(TOOL_CHECK_CITATIONS, {"citations": [RODMAN, AUCTION]})
    assert out.startswith("Error:") and len(out.splitlines()) == 1
