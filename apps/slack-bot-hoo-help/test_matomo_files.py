""""csv please" after a Matomo report (2026-11-10: no file — Matomo tables weren't tagged as code-built,
and Matomo tools weren't table-producing tools)."""
import os
import sys
from types import SimpleNamespace

os.environ.setdefault("SLACK_BOT_TOKEN", "xoxb-test")
os.environ.setdefault("SLACK_SIGNING_SECRET", "test")
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from matomo_blocks import matomo_blocks_for_step  # noqa: E402
from spreadsheet import tables_from_blocks, tables_from_steps  # noqa: E402
from slack_blocks import split_messages  # noqa: E402
from test_matomo_blocks import COLLECTIONS, annual  # noqa: E402


def test_matomo_tables_tagged():
    for name, out in (("matomo_virgo_collections", COLLECTIONS), ("matomo_annual_report", annual())):
        tables = [b for b in matomo_blocks_for_step(name, out, 2) if b["type"] == "table"]
        assert tables and all(str(b.get("block_id", "")).startswith("matomo_table") for b in tables), name


def test_thread_file_from_matomo_report():
    from thread_context import extract_thread_history
    pieces = split_messages(matomo_blocks_for_step("matomo_virgo_collections", COLLECTIONS, 2))
    msgs = [{"user": "U1", "text": "Which named etext collections were most used in FY26?", "ts": "1.0"}]
    msgs += [{"user": "UBOT", "bot_id": "B1", "text": "report", "blocks": p, "ts": f"2.{i}"} for i, p in enumerate(pieces)]
    msgs.append({"user": "U1", "text": "csv please", "ts": "9.0"})

    class C:
        def conversations_replies(self, **kw):
            return {"messages": msgs}
    _, _, meta = extract_thread_history(C(), "D1", "1.0", bot_user_id="UBOT", bot_app_bot_id="B1", current_ts="9.0")
    tables = meta["data_tables"]
    assert len(tables) == 1 and tables[0].headers[0] == "Collection"
    assert tables[0].rows[0][0] == "Hathi Trust Digital Library" and tables[0].plain
    assert tables[0].title.startswith("Virgo 4-prod, 2025-07-01 to 2026-06-30")


def test_annual_report_thread_tables():
    from thread_context import extract_thread_history
    pieces = split_messages(matomo_blocks_for_step("matomo_annual_report", annual(), 2))
    msgs = [{"user": "UBOT", "bot_id": "B1", "text": "r", "blocks": p, "ts": f"2.{i}"} for i, p in enumerate(pieces)]

    class C:
        def conversations_replies(self, **kw):
            return {"messages": [{"user": "U1", "text": "annual report", "ts": "1.0"}] + msgs}
    _, _, meta = extract_thread_history(C(), "D1", "1.0", bot_user_id="UBOT", bot_app_bot_id="B1", current_ts="9.0")
    heads = [t.headers[0] for t in meta["data_tables"]]
    assert heads == ["Collection", "Record"]


def test_same_turn_matomo_file():
    step = SimpleNamespace(tool_name="matomo_virgo_collections", output=COLLECTIONS, status="success", input={})
    tables = tables_from_steps([step])
    assert len(tables) == 1 and tables[0].headers == ["Collection", "Visits", "Item views", "Kind"]
    assert tables[0].plain and tables[0].title.startswith("Virgo 4-prod")
    annual_step = SimpleNamespace(tool_name="matomo_annual_report", output=annual(), status="success", input={})
    assert [t.headers[0] for t in tables_from_steps([annual_step])] == ["Metric", "Month", "Collection", "Record"]
