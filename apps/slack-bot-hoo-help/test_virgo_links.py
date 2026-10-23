#!/usr/bin/env python3
"""Virgo record links added to catalog answers from this turn's tool output (no network)."""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from virgo_links import add_virgo_links, catalog_records  # noqa: E402

REC = "https://search.lib.virginia.edu/sources/uva_library/items/"
SEARCH_OUT = f"""## Matching items

### 1. 1984 (Full screen version.)
- **Call number**: `VIDEO.DVD07979`
- **Format**: Video, DVD
- **Virgo record**: {REC}u5099809

### 2. 1984
- **Call number**: `VIDEO.DVD11521`
- **Virgo record**: {REC}u4621004

### 3. Nineteen Eighty-Four (1st ed.)
- **Availability**: Available online
- **Virgo record**: {REC}u13248319

### 4. Nineteen Eighty-four
- **Call number**: `PR6029.R8 N49 2021`
- **Virgo record**: {REC}u9587135

### 5. Rotunda
- **Virgo page**: https://search.lib.virginia.edu/sources/images/items/uva-lib:1
"""
STEPS = [{"tool_name": "VirgoCatalogRuntime___search_by_field", "status": "success", "output": SEARCH_OUT}]


def test_catalog_records_from_tool_output():
    recs = catalog_records(STEPS)
    assert [r.item_id for r in recs] == ["u5099809", "u4621004", "u13248319", "u9587135"]  # catalog only
    assert recs[3].call_number == "PR6029.R8 N49 2021" and recs[2].title == "Nineteen Eighty-Four (1st ed.)"


def test_call_number_lines_get_their_link():
    answer = ("**Checked out:**\n• *Nineteen Eighty-four* — Shannon — `PR6029.R8 N49 2021`\n"
              "• *1984* (DVD) — Clemons — VIDEO.DVD11521\n")
    out = add_virgo_links(answer, STEPS)
    assert f"`PR6029.R8 N49 2021` · [Virgo]({REC}u9587135)" in out
    assert f"VIDEO.DVD11521 · [Virgo]({REC}u4621004)" in out


def test_unique_titles_get_links_ambiguous_ones_dont():
    answer = "• *Nineteen Eighty-Four (1st ed.)* — ebook, available online\n• *1984* — a DVD at Clemons\n"
    out = add_virgo_links(answer, STEPS)
    assert f"available online · [Virgo]({REC}u13248319)" in out
    assert "• *1984* — a DVD at Clemons\n" in out  # two items titled "1984": no guessing


def test_lines_already_linked_reasoning_and_prose_are_left_alone():
    answer = (f"<thinking>\n• PR6029.R8 N49 2021 is checked out\n</thinking>\n"
              f"• *Nineteen Eighty-four* — `PR6029.R8 N49 2021` — <{REC}u9587135|Virgo record>\n"
              "We have several copies of 1984 at Clemons.\n")
    assert add_virgo_links(answer, STEPS) == answer


def test_only_virgo_tool_output_counts():  # real trace: a Virgo link inside Jira comments became a "record"
    jira = [{"tool_name": "search_jira", "status": "success", "output": f"### Latest comments\n- see {REC}u1\n"}]
    assert catalog_records(jira) == []


def test_placeholder_call_numbers_never_match():  # real output: online items have "Call number: —"
    out = f"### 1. 1984: El Manga (1st ed.)\n- **Call number**: —\n- **Virgo record**: {REC}u777\n"
    steps = [{"tool_name": "VirgoCatalogRuntime___search_by_field", "status": "success", "output": out}]
    answer = "• *Animal Farm* — Shannon — checked out\n"
    assert add_virgo_links(answer, steps) == answer


def test_each_item_linked_once_and_no_catalog_output_means_no_change():
    answer = "• `PR6029.R8 N49 2021` at Shannon\n• again: `PR6029.R8 N49 2021`\n"
    out = add_virgo_links(answer, STEPS)
    assert out.count("[Virgo]") == 1
    assert add_virgo_links(answer, []) == answer


# ---- app wiring (fake Slack client + fake agent, no network) -------------------
os.environ.setdefault("SLACK_BOT_TOKEN", "xoxb-test")
os.environ.setdefault("SLACK_SIGNING_SECRET", "test")
os.environ.setdefault("AWS_REGION", "us-east-1")
os.environ.setdefault("CONVERSATION_TRACE", "off")

from types import SimpleNamespace  # noqa: E402


class Client:
    def __init__(self):
        self.posts = []

    def chat_postMessage(self, **kw):
        self.posts.append(kw)
        return {"ok": True, "ts": "2.0"}

    def reactions_add(self, **kw):
        pass

    def reactions_remove(self, **kw):
        pass

    def users_info(self, user):
        return {"user": {"id": user, "real_name": "Doug", "profile": {}}}

    def conversations_replies(self, **kw):
        return {"messages": []}


class Agent:
    bedrock_runtime, model_id = None, "m"

    def process_message(self, text, **kw):
        from session_trace import SessionTrace
        trace = SessionTrace(request_id="r1", user_message=text)
        trace.add_tool_step(tool_use_id="t1", tool_name="VirgoCatalogRuntime___search_by_field", tool_input={},
                            output=SEARCH_OUT, latency_ms=5, iteration=1)
        return SimpleNamespace(text="The print copy is checked out:\n• *Nineteen Eighty-four* — Shannon — "
                                    "`PR6029.R8 N49 2021`", trace=trace)

    def _sanitize_links(self, text, trace, **kw):
        return text, []


def test_catalog_answer_posted_with_virgo_links():
    import app
    client = Client()
    real = app.agent, app.get_bot_identity, app.slack_tools_for_event
    app.agent, app.get_bot_identity = Agent(), (lambda c: ("UBOT", "B1"))
    app.slack_tools_for_event = lambda *a, **k: (None, [])
    try:
        event = {"type": "message", "channel": "D1", "channel_type": "im", "user": "U1", "text": "do we have 1984?",
                 "ts": "9.0"}
        app.handle_user_query(event, lambda **k: client.posts.append(k), client, known_history=[], known_meta={})
    finally:
        app.agent, app.get_bot_identity, app.slack_tools_for_event = real
    posted = " ".join(str(p.get("text", "")) + str(p.get("blocks", "")) for p in client.posts)
    assert f"{REC}u9587135" in posted


def test_link_check_trusts_virgo_record_links_from_tool_output():
    import link_check
    from agent import HooHelpAgent
    calls = []
    real = link_check.check_urls, link_check.check_url
    link_check.check_urls = lambda urls, **kw: (calls.extend(urls), {})[1]
    link_check.check_url = lambda url, **kw: (calls.append(url), link_check.LinkCheckResult(url=url, ok=True))[1]
    try:
        trace = SimpleNamespace(steps=[SimpleNamespace(tool_name="VirgoCatalogRuntime___search_by_field", output=SEARCH_OUT)])
        HooHelpAgent._sanitize_links(None, f"• x · [Virgo]({REC}u9587135) and https://other.example.org/y", trace)
    finally:
        link_check.check_urls, link_check.check_url = real
    assert f"{REC}u9587135" not in calls and "https://other.example.org/y" in calls


if __name__ == "__main__":
    test_catalog_records_from_tool_output()
    test_call_number_lines_get_their_link()
    test_unique_titles_get_links_ambiguous_ones_dont()
    test_lines_already_linked_reasoning_and_prose_are_left_alone()
    test_only_virgo_tool_output_counts()
    test_placeholder_call_numbers_never_match()
    test_each_item_linked_once_and_no_catalog_output_means_no_change()
    test_catalog_answer_posted_with_virgo_links()
    test_link_check_trusts_virgo_record_links_from_tool_output()
    print("ok")
