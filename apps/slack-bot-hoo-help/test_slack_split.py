"""Replies that need more than one table (or more than two charts) go out as several messages."""
import os
import sys
from types import SimpleNamespace

os.environ.setdefault("SLACK_BOT_TOKEN", "xoxb-test")
os.environ.setdefault("SLACK_SIGNING_SECRET", "test")
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from slack_blocks import (  # noqa: E402
    MAX_MESSAGES, blocks_plain_text, header_block, section_fields, split_messages, table_block,
)


def h(t):
    return header_block(t)


def sec(t):
    return {"type": "section", "text": {"type": "mrkdwn", "text": t}}


def tbl(*rows):
    return table_block(["Name", "Visits"], [list(r) for r in rows])


def viz(n):
    return {"type": "data_visualization", "title": f"c{n}", "chart": {"type": "pie", "segments": []}}


def ctx(t):
    return {"type": "context", "elements": [{"type": "mrkdwn", "text": t}]}


DIV = {"type": "divider"}


def types(piece):
    return [b["type"] for b in piece]


def test_one_message_within_limits():
    blocks = [h("Occupancy"), tbl(("Shannon", "5")), viz(1), viz(2)]
    assert split_messages(blocks) == [blocks]
    assert split_messages([]) == []


def test_split_at_second_table_carries_its_title():
    blocks = [h("Virgo annual report"), section_fields([("Visits", "1")]), viz(1), viz(2),
              tbl(("Visual History", "2,475")), sec("*Top records*"), tbl(("Corks and Curls", "1,141")),
              ctx("notes")]
    one, two = split_messages(blocks)
    assert types(one) == ["header", "section", "data_visualization", "data_visualization", "table"]
    assert types(two) == ["section", "table", "context"] and two[0]["text"]["text"] == "*Top records*"


def test_second_report_moves_with_its_header_and_drops_divider():
    blocks = [h("Traffic"), tbl(("Visits", "9")), DIV, h("Top pages"), tbl(("/hours", "100"))]
    one, two = split_messages(blocks)
    assert types(one) == ["header", "table"] and types(two) == ["header", "table"]


def test_third_chart_starts_a_new_message():
    pieces = split_messages([viz(1), viz(2), sec("x"), viz(3)])
    assert [types(p) for p in pieces] == [["data_visualization", "data_visualization"],
                                          ["section", "data_visualization"]]


def test_block_limit():
    pieces = split_messages([sec(str(i)) for i in range(120)])
    assert [len(p) for p in pieces] == [50, 50, 20]


def test_too_many_tables_fall_back_to_text_in_the_last_message():
    blocks = []
    for i in range(7):
        blocks += [h(f"Report {i}"), tbl((f"row{i}", str(i)))]
    pieces = split_messages(blocks)
    assert len(pieces) == MAX_MESSAGES == 4
    assert all(types(p).count("table") <= 1 for p in pieces)
    last = pieces[-1]
    pre = [b["text"]["text"] for b in last if b["type"] == "section"]
    assert any("row6" in t and t.startswith("```") for t in pre)


def test_preformatted_fallback_escapes_untrusted_cells():
    blocks = []
    for i in range(5):
        blocks.append(tbl((f"<https://evil|x> <!channel> {i}", "1")))
    last = split_messages(blocks)[-1]
    text = " ".join(b["text"]["text"] for b in last if b["type"] == "section")
    assert "<" not in text and "&lt;!channel&gt;" in text


def test_plain_text_of_a_message():
    text = blocks_plain_text([sec("*Top records*"), tbl(("Corks and Curls", "1,141")), ctx("note <x>")])
    assert "Top records" in text and "Corks and Curls | 1,141" in text and "note &lt;x&gt;" in text
    assert len(blocks_plain_text([sec("a" * 9000)])) <= 3000


# ---- posting -------------------------------------------------------------------------

def test_annual_report_posts_as_two_messages():
    import app
    import test_matomo_annual_report as A
    from session_trace import SessionTrace
    from test_virgo_links import Client

    t, _, _ = A.make()
    output = A.report(t)

    class ReportAgent:
        bedrock_runtime, model_id = None, "m"

        def process_message(self, text, **kw):
            trace = SessionTrace(request_id="r1", user_message=text)
            trace.add_tool_step(tool_use_id="t1", tool_name="matomo_annual_report", tool_input={"fiscal_year": "FY26"},
                                output=output, latency_ms=5, iteration=1)
            return SimpleNamespace(text="Visual History again leads the UVA collections.", trace=trace)

        def _sanitize_links(self, text, trace, **kw):
            return text, []

    client = Client()
    real = app.agent, app.get_bot_identity, app.slack_tools_for_event
    app.agent, app.get_bot_identity = ReportAgent(), (lambda c: ("UBOT", "B1"))
    app.slack_tools_for_event = lambda *a, **k: (None, [])
    try:
        event = {"type": "message", "channel": "D1", "channel_type": "im", "user": "U1",
                 "text": "FY26 Virgo annual report", "ts": "9.0"}
        app.handle_user_query(event, lambda **k: client.posts.append(k), client, known_history=[], known_meta={})
    finally:
        app.agent, app.get_bot_identity, app.slack_tools_for_event = real
    assert len(client.posts) == 2
    for p in client.posts:
        assert sum(1 for b in p["blocks"] if b["type"] == "table") <= 1
        assert p["thread_ts"] == "9.0" and p["unfurl_links"] is False
    assert "Corks and Curls" in client.posts[1]["text"]
    assert client.posts[0]["text"].startswith("Visual History again leads")


def test_failed_continuation_falls_back_to_text():
    import app
    from test_virgo_links import Client

    class Flaky(Client):
        def chat_postMessage(self, **kw):
            if len(self.posts) >= 1 and kw.get("blocks"):
                raise RuntimeError("invalid_blocks")
            return super().chat_postMessage(**kw)

    client = Flaky()
    said = []
    pieces = [[sec("first")], [sec("*Top records*"), tbl(("Corks and Curls", "1,141"))]]
    app._post_pieces(client, lambda **k: said.append(k), pieces, channel="D1", thread_ts="9.0",
                     first_text="first", trace=SimpleNamespace(error=None))
    assert len(client.posts) + len(said) == 2
    assert "Corks and Curls" in (client.posts[1:] or said)[0]["text"]


# ---- 2026-11-09 log review: replies Slack rejected ----------------------------------

def test_block_ids_unique_within_each_message():
    # Two Matomo traffic reports in one message both carried block_id matomo_report (invalid_blocks).
    from test_matomo_blocks import TRAFFIC_SINGLE
    from slack_blocks import blocks_from_tool_steps
    steps = [SimpleNamespace(tool_name="matomo_traffic", output=TRAFFIC_SINGLE, status="success", input={}),
             SimpleNamespace(tool_name="matomo_traffic", output=TRAFFIC_SINGLE.replace("2026-10", "2025-10"),
                             status="success", input={})]
    for piece in split_messages(blocks_from_tool_steps(steps)):
        ids = [b["block_id"] for b in piece if b.get("block_id")]
        assert len(ids) == len(set(ids)) and len(ids) >= 2


def test_long_section_split_under_3000():
    lines = "\n".join(f"{i}    Some citation title number {i}    Not found    -" for i in range(120))
    pieces = split_messages([sec("Here's the raw TSV:"), sec("```\n" + lines + "\n```")])
    texts = [b["text"]["text"] for p in pieces for b in p if b["type"] == "section"]
    assert all(len(t) <= 3000 for t in texts) and len(texts) >= 3
    code = [t for t in texts[1:]]
    assert all(t.startswith("```") and t.endswith("```") for t in code)
    assert "119    Some citation title number 119" in "".join(code)


def test_long_plain_section_split_on_lines():
    pieces = split_messages([sec("\n".join("word " * 20 for _ in range(60)))])
    texts = [b["text"]["text"] for p in pieces for b in p]
    assert all(len(t) <= 3000 for t in texts) and len(texts) == 3
