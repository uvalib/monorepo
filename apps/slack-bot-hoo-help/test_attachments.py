#!/usr/bin/env python3
"""Which file a question asks for, and building xlsx / CSV / JSON from tables (no Slack)."""

import csv
import io
import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from attachments import build_file, file_format  # noqa: E402
from spreadsheet import SheetTable  # noqa: E402

LINKS = SheetTable("Links shared in #ai (2026-10-01 to 2026-10-21)", ["Date", "Author", "URL", "Message"],
                   [["2026-10-02", "Pat Doe", "https://example.org/a", "https://uvalib.slack.com/archives/C1/p1"],
                    ["2026-10-05", "Jordan Lee", "https://example.org/b,c", "https://uvalib.slack.com/archives/C1/p2"]])


def test_file_format_from_question():
    assert file_format("can you send that as a JSON file with dates?") == "json"
    assert file_format("export it as csv please") == "csv"
    assert file_format("Give me daily gate counts for Fine Arts in Excel") == "xlsx"
    assert file_format("as a spreadsheet") == "xlsx"
    assert file_format("what are the hours?") is None
    assert file_format("excel or json, whichever") == "json"  # explicit non-Excel format wins


def test_csv_quotes_commas_and_keeps_headers():
    data, filename, title = build_file("csv", [LINKS])
    rows = list(csv.reader(io.StringIO(data.decode("utf-8-sig"))))
    assert rows[0] == ["Date", "Author", "URL", "Message"]
    assert rows[2][2] == "https://example.org/b,c"
    assert filename.endswith(".csv") and filename.startswith("links-shared-in-ai")
    assert title == LINKS.title


def test_json_is_records_with_header_keys():
    data, filename, _ = build_file("json", [LINKS])
    doc = json.loads(data)
    assert doc["title"] == LINKS.title
    assert doc["rows"][0] == {"Date": "2026-10-02", "Author": "Pat Doe", "URL": "https://example.org/a",
                              "Message": "https://uvalib.slack.com/archives/C1/p1"}
    assert filename.endswith(".json")


def test_multiple_tables_json_is_a_list_and_csv_has_sections():
    other = SheetTable("Second", ["A"], [["1"]])
    doc = json.loads(build_file("json", [LINKS, other])[0])
    assert [t["title"] for t in doc] == [LINKS.title, "Second"]
    text = build_file("csv", [LINKS, other])[0].decode("utf-8-sig")
    assert LINKS.title in text and "Second" in text


def test_xlsx_still_builds():
    data, filename, _ = build_file("xlsx", [LINKS])
    assert data[:2] == b"PK" and filename.endswith(".xlsx")


# ---- app wiring: _attach_file (fake Slack client) ------------------------------
os.environ.setdefault("SLACK_BOT_TOKEN", "xoxb-test")
os.environ.setdefault("SLACK_SIGNING_SECRET", "test")
os.environ.setdefault("AWS_REGION", "us-east-1")
os.environ.setdefault("CONVERSATION_TRACE", "off")

GATE_STEP = {"tool_name": "OccupancyReportingRuntime___get_entrance_traffic", "status": "success",
             "output": "### Entrance Traffic Breakdown: Clemons\n\n| Entrance | In (Entries) |\n| :--- | :--- |\n| Main | 73,469 |"}


class Uploads:
    def __init__(self, error=None):
        self.files, self.posts, self.error = [], [], error

    def files_upload_v2(self, **kw):
        if self.error:
            raise RuntimeError(self.error)
        self.files.append(kw)

    def chat_postMessage(self, **kw):
        self.posts.append(kw)


class Trace:
    def __init__(self, steps):
        self.steps, self.error = steps, ""


def test_app_attaches_listing_as_json():
    import app
    client = Uploads()
    app._attach_file(client, "C9", "1.2", Trace([]), "json", [LINKS])
    assert len(client.files) == 1 and client.files[0]["filename"].endswith(".json")
    assert json.loads(client.files[0]["content"])["rows"][1]["URL"] == "https://example.org/b,c"
    assert client.files[0]["thread_ts"] == "1.2"


def test_app_csv_request_attaches_csv_not_excel():  # trial: "as a CSV" produced an .xlsx
    import app
    client = Uploads()
    app._attach_file(client, "C9", None, Trace([GATE_STEP]), "csv", [])
    assert client.files[0]["filename"].endswith(".csv")
    assert "73,469" in client.files[0]["content"].decode("utf-8-sig")


def test_app_nothing_to_attach_and_missing_scope_notice():
    import app
    client = Uploads()
    app._attach_file(client, "C9", None, Trace([]), "json", [])
    assert client.files == [] and client.posts == []
    client = Uploads(error="missing_scope")
    app._attach_file(client, "C9", None, Trace([]), "csv", [LINKS])
    assert "files:write" in client.posts[0]["text"] and "Excel" not in client.posts[0]["text"]


if __name__ == "__main__":
    test_file_format_from_question()
    test_csv_quotes_commas_and_keeps_headers()
    test_json_is_records_with_header_keys()
    test_multiple_tables_json_is_a_list_and_csv_has_sections()
    test_xlsx_still_builds()
    test_app_attaches_listing_as_json()
    test_app_csv_request_attaches_csv_not_excel()
    test_app_nothing_to_attach_and_missing_scope_notice()
    print("ok")
