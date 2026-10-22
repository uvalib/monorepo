#!/usr/bin/env python3
"""Listing a public channel's history: paging, cap, links/files, formatting (fake Slack)."""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from identity import UserDirectory, _reset_cache  # noqa: E402
from slack_listing import MAX_MESSAGES, extract_links, format_listing, list_channel  # noqa: E402
from slack_search import TOOL_LIST_CHANNEL, SlackSearchTools  # noqa: E402

USERS = {"U1": "Pat Doe", "U2": "Jordan Lee"}


def m(ts, text, user="U1", **extra):
    return {"type": "message", "ts": ts, "user": user, "text": text, **extra}


class FakeSlack:
    def __init__(self, pages):
        self.pages = pages          # list of message lists, newest page first (as Slack returns)
        self.calls = []

    def conversations_history(self, channel, oldest=None, latest=None, limit=200, cursor=None, inclusive=True):
        self.calls.append({"channel": channel, "oldest": oldest, "latest": latest, "cursor": cursor, "limit": limit})
        i = int(cursor or 0)
        more = i + 1 < len(self.pages)
        return {"messages": self.pages[i], "has_more": more,
                "response_metadata": {"next_cursor": str(i + 1) if more else ""}}

    def auth_test(self):
        return {"url": "https://uvalib.slack.com/"}

    def users_info(self, user):
        return {"user": {"id": user, "real_name": USERS.get(user, user), "profile": {}}}

    def users_list(self, cursor=None, limit=200):
        return {"members": [], "response_metadata": {"next_cursor": ""}}


def directory(client):
    _reset_cache()
    return UserDirectory(client)


def test_extract_links_from_slack_markup():
    text = "see <https://example.org/a|the doc> and <https://example.org/b> not <@U1> or <#C9|ai> or <mailto:x@y.org|x>"
    assert extract_links(text) == ["https://example.org/a", "https://example.org/b"]
    assert extract_links("plain text") == []


def test_links_listing_pages_and_builds_rows():
    pages = [[m("1760461500.000100", "new <https://example.org/b>", "U2")],
             [m("1760461440.000100", "old <https://example.org/a|A> and <https://example.org/c>"),
              m("1760461400.000100", "", subtype="channel_join")]]
    client = FakeSlack(pages)
    listing = list_channel(client, "C1", kind="links", oldest=1760400000, latest=1760500000, directory=directory(client))
    assert [r[2] for r in listing.table.rows] == ["https://example.org/a", "https://example.org/c", "https://example.org/b"]
    assert listing.table.headers == ["Date", "Author", "URL", "Message"]
    assert listing.table.rows[0][1] == "Pat Doe"
    assert listing.table.rows[0][3] == "https://uvalib.slack.com/archives/C1/p1760461440000100"
    assert listing.scanned == 2 and not listing.capped  # join notice not counted
    assert client.calls[0]["oldest"] == "1760400000" and client.calls[1]["cursor"] == "1"


def test_files_and_all_kinds():
    pages = [[m("1760461440.000100", "slides", files=[{"name": "deck.pdf", "permalink": "https://uvalib.slack.com/files/U1/F1/deck.pdf"}]),
              m("1760461441.000100", "hello")]]
    client = FakeSlack(pages)
    files = list_channel(client, "C1", kind="files", oldest=0, latest=1760500000, directory=directory(client))
    assert files.table.headers == ["Date", "Author", "File", "Link", "Message"]
    assert files.table.rows[0][2:4] == ["deck.pdf", "https://uvalib.slack.com/files/U1/F1/deck.pdf"]
    everything = list_channel(client, "C1", kind="all", oldest=0, latest=1760500000, directory=directory(client))
    assert len(everything.table.rows) == 2 and everything.table.headers == ["Date", "Author", "Text", "Message"]


def test_from_user_filters_authors():
    pages = [[m("2.000001", "<https://b.org>", "U2"), m("1.000001", "<https://a.org>", "U1")]]
    client = FakeSlack(pages)
    listing = list_channel(client, "C1", kind="links", oldest=0, latest=3, author_id="U1", directory=directory(client))
    assert [r[2] for r in listing.table.rows] == ["https://a.org"]


def test_cap_stops_paging_and_says_so():
    page = [m(f"{1760461440 + i}.000100", f"<https://x.org/{i}>") for i in range(200)]
    client = FakeSlack([page] * 20)
    listing = list_channel(client, "C1", kind="links", oldest=0, latest=1770000000, directory=directory(client))
    assert listing.scanned == MAX_MESSAGES == 2000 and listing.capped
    assert len(client.calls) == 10


def test_format_shows_summary_first_rows_and_notes():
    page = [m(f"{1760461440 + i}.000100", f"<https://x.org/{i}>") for i in range(80)]
    client = FakeSlack([page])
    listing = list_channel(client, "C1", kind="links", oldest=1760400000, latest=1760500000, directory=directory(client))
    out = format_listing(listing, "ai", limit=50)
    assert "80 links in 80 messages" in out and "#ai" in out
    assert out.count("| https://x.org/") == 50
    assert "thread replies aren't included" in out
    assert "CSV, JSON or Excel" in out


# ---- the list_slack_channel tool (SlackSearchTools) ---------------------------

CHANNELS = {
    "C1": {"id": "C1", "name": "ai", "is_private": False, "is_member": True},
    "C2": {"id": "C2", "name": "web-team", "is_private": False, "is_member": False},
    "G1": {"id": "G1", "name": "secret", "is_private": True, "is_group": True, "is_member": True},
}


class FakeChannels(FakeSlack):
    def conversations_info(self, channel):
        if channel not in CHANNELS:
            raise RuntimeError("channel_not_found")
        return {"channel": CHANNELS[channel]}

    def conversations_list(self, types="public_channel", limit=200, cursor=None, exclude_archived=False):
        return {"channels": [c for c in CHANNELS.values() if not c["is_private"]],
                "response_metadata": {"next_cursor": ""}}


def tools(client, token=""):
    return SlackSearchTools(client, action_token=token, asker_id="U1", directory=directory(client))


def test_list_tool_offered_without_search_token():
    names = [s["toolSpec"]["name"] for s in tools(FakeChannels([[]])).tool_specs()]
    assert TOOL_LIST_CHANNEL in names and "search_slack" not in names
    t = tools(FakeChannels([[]]))
    assert t.handles(TOOL_LIST_CHANNEL)


def test_list_tool_lists_links_and_keeps_the_table():
    client = FakeChannels([[m("1760461440.000100", "see <https://example.org/a>")]])
    t = tools(client)
    out = t.call(TOOL_LIST_CHANNEL, {"channel": "#ai", "after": "2025-10-01", "before": "2025-10-31", "kind": "links"})
    assert "https://example.org/a" in out and "1 links in 1 messages" in out
    assert "(2025-10-01 to 2025-10-31)" in out and "2025-11-01" not in out  # the end is exclusive
    assert len(t.listings) == 1 and t.listings[0].table.rows[0][2] == "https://example.org/a"
    assert client.calls[0]["latest"] == "1761969600"  # end of 2025-10-31 EDT (before is inclusive)
    assert client.calls[0]["oldest"] == "1759291200"  # 2025-10-01 00:00 EDT


def test_list_tool_defaults_to_last_30_days():
    client = FakeChannels([[]])
    tools(client).call(TOOL_LIST_CHANNEL, {"channel": "ai"})
    span = int(client.calls[0]["latest"]) - int(client.calls[0]["oldest"])
    assert 30 * 86400 - 5 <= span <= 30 * 86400 + 5


def test_list_tool_refuses_private_and_unjoined_channels():
    client = FakeChannels([[]])
    t = tools(client)
    assert "public channels" in t.call(TOOL_LIST_CHANNEL, {"channel": "G1"})
    out = t.call(TOOL_LIST_CHANNEL, {"channel": "web-team"})
    assert "/invite @Hoo Helper" in out and client.calls == []
    assert "couldn't find" in t.call(TOOL_LIST_CHANNEL, {"channel": "nope"})
    assert t.listings == []


def test_list_tool_from_user_me_and_bad_dates():
    client = FakeChannels([[m("2.000001", "<https://b.org>", "U2"), m("1.000001", "<https://a.org>", "U1")]])
    t = tools(client)
    out = t.call(TOOL_LIST_CHANNEL, {"channel": "ai", "after": "1970-01-01", "before": "1970-01-02", "from_user": "me"})
    assert "https://a.org" in out and "https://b.org" not in out
    assert "YYYY-MM-DD" in t.call(TOOL_LIST_CHANNEL, {"channel": "ai", "after": "last week"})


def test_list_tool_not_in_channel_error_suggests_invite():
    class NotIn(FakeChannels):
        def conversations_history(self, **kw):
            raise RuntimeError("not_in_channel")
    assert "/invite @Hoo Helper" in tools(NotIn([[]])).call(TOOL_LIST_CHANNEL, {"channel": "ai"})


if __name__ == "__main__":
    test_extract_links_from_slack_markup()
    test_links_listing_pages_and_builds_rows()
    test_files_and_all_kinds()
    test_from_user_filters_authors()
    test_cap_stops_paging_and_says_so()
    test_format_shows_summary_first_rows_and_notes()
    test_list_tool_offered_without_search_token()
    test_list_tool_lists_links_and_keeps_the_table()
    test_list_tool_defaults_to_last_30_days()
    test_list_tool_refuses_private_and_unjoined_channels()
    test_list_tool_from_user_me_and_bad_dates()
    test_list_tool_not_in_channel_error_suggests_invite()
    print("ok")
