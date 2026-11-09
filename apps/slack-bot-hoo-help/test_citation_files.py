"""check_citations, part 4: CSV/TSV/Excel files from code-built tables, also later in the thread."""
import csv
import io
import os
import sys
from types import SimpleNamespace

os.environ.setdefault("SLACK_BOT_TOKEN", "xoxb-test")
os.environ.setdefault("SLACK_SIGNING_SECRET", "test")
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from attachments import build_file, file_context_line, file_format  # noqa: E402
from citation_blocks import citation_blocks  # noqa: E402
from spreadsheet import SheetTable, tables_from_blocks, tables_from_steps  # noqa: E402
from test_citation_check import RODMAN  # noqa: E402
from test_citation_tools import AUCTION, make  # noqa: E402


def check_output(cites):
    t, _ = make()
    return t.call("check_citations", {"citations": cites})


def test_tsv_format_detected():
    assert file_format("as a TSV please") == "tsv"
    assert file_format("can I get a tab-separated file") == "tsv"
    assert file_format("csv please") == "csv"


def test_tsv_cells_clean():
    table = SheetTable("Citation check", ["#", "Citation"], [["1", "a\tb\nc"], ["2", "=HYPERLINK(x)"]], plain=True)
    content, name, _ = build_file("tsv", [table])
    assert name.endswith(".tsv")
    lines = content.decode("utf-8-sig").splitlines()
    assert lines == ["#\tCitation", "1\ta b c", "2\t'=HYPERLINK(x)"]


def test_same_turn_check_citations_file():
    long = RODMAN + " " + "x" * 200
    step = SimpleNamespace(tool_name="check_citations", output=check_output([long, AUCTION]), status="success",
                           input={})
    tables = tables_from_steps([step])
    assert len(tables) == 1 and tables[0].title == "Citation check" and tables[0].plain
    assert tables[0].headers == ["#", "Author", "Title", "Citation", "UVA has it?", "Match", "Location / call number",
                                 "Virgo link", "Other editions or works by author"]
    assert len(tables[0].rows[0][3]) > 200  # the full citation is in the file


def bot_msg(blocks, text="report"):
    return {"user": "UBOT", "bot_id": "B1", "text": text, "blocks": blocks, "ts": "2.0"}


def test_tables_from_blocks_joins_citation_tables_and_skips_model_tables():
    blocks = citation_blocks(check_output([RODMAN] + [AUCTION] * 30))
    model_table = {"type": "table", "rows": [[{"type": "raw_text", "text": "x"}], [{"type": "raw_text", "text": "y"}]]}
    tables = tables_from_blocks(blocks + [model_table])
    assert len(tables) == 1 and len(tables[0].rows) == 31 and tables[0].headers[0] == "#"


def test_later_turn_file_from_thread():
    from thread_context import extract_thread_history
    blocks = citation_blocks(check_output([RODMAN] + [AUCTION] * 30))
    model_table = {"type": "table", "rows": [[{"type": "raw_text", "text": "x"}], [{"type": "raw_text", "text": "y"}]]}

    class C:
        def conversations_replies(self, **kw):
            return {"messages": [{"user": "U1", "text": "check these", "ts": "1.0"},
                                 bot_msg(blocks[:3]), bot_msg(blocks[3:]),
                                 {"user": "U1", "text": "thanks", "ts": "3.0"},
                                 bot_msg([model_table], "my own table"),
                                 {"user": "U1", "text": "csv please", "ts": "9.0"}]}
    _, _, meta = extract_thread_history(C(), "D1", "1.0", bot_user_id="UBOT", bot_app_bot_id="B1", current_ts="9.0")
    assert len(meta["data_tables"]) == 1 and len(meta["data_tables"][0].rows) == 31


def test_attach_file_uses_thread_table():
    import app
    from test_virgo_links import Client
    blocks = citation_blocks(check_output([RODMAN, AUCTION]))

    class C(Client):
        def __init__(self):
            super().__init__()
            self.uploads = []

        def conversations_replies(self, **kw):
            return {"messages": [{"user": "U1", "text": "check these", "ts": "1.0"}, bot_msg(blocks),
                                 {"user": "U1", "text": "csv please", "ts": "9.0"}]}

        def files_upload_v2(self, **kw):
            self.uploads.append(kw)
            return {"ok": True}

    class PlainAgent:
        bedrock_runtime, model_id = None, "m"

        def process_message(self, text, **kw):
            from session_trace import SessionTrace
            return SimpleNamespace(text="Here's the CSV of the citation check.",
                                   trace=SessionTrace(request_id="r1", user_message=text))

        def _sanitize_links(self, text, trace, **kw):
            return text, []

    client = C()
    real = app.agent, app.get_bot_identity, app.slack_tools_for_event
    app.agent, app.get_bot_identity = PlainAgent(), (lambda c: ("UBOT", "B1"))
    app.slack_tools_for_event = lambda *a, **k: (None, [])
    try:
        event = {"type": "message", "channel": "D1", "channel_type": "im", "user": "U1", "text": "csv please",
                 "ts": "9.0", "thread_ts": "1.0"}
        app.handle_user_query(event, lambda **k: client.posts.append(k), client)
    finally:
        app.agent, app.get_bot_identity, app.slack_tools_for_event = real
    assert len(client.uploads) == 1
    up = client.uploads[0]
    assert up["filename"].endswith(".csv")
    rows = list(csv.reader(io.StringIO(up["content"].decode("utf-8-sig") if isinstance(up["content"], bytes)
                                       else up["content"])))
    assert rows[0][:4] == ["#", "Author", "Title", "UVA has it?"] and len(rows) == 3


def test_no_table_no_file_line():
    assert file_context_line("csv", available=False) == (
        "They want a CSV file, but there is no table from Hoo Helper's tools in this thread to build it from. "
        "Say so, and don't paste the data as CSV or TSV text.")
    assert "attached automatically" in file_context_line("csv")


def test_occupancy_tables_tagged():
    import json
    from slack_blocks import blocks_from_tool_steps
    here = os.path.dirname(__file__)
    case = json.load(open(os.path.join(here, "evals", "cases", "compare-shannon-clemons.json")))
    steps = [SimpleNamespace(**{k: s.get(k) for k in ("tool_name", "output", "status", "input")})
             for s in case["recorded"]["steps"]]
    tables = [b for b in blocks_from_tool_steps(steps) if b["type"] == "table"]
    assert tables and all(str(b.get("block_id", "")).startswith("data_table") for b in tables)
