#!/usr/bin/env python3
"""search_slack / read_slack_thread tools (fake Slack client, no network)."""

import os
import sys
from datetime import datetime
from zoneinfo import ZoneInfo

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from slack_sdk.errors import SlackApiError  # noqa: E402

from identity import UserDirectory, _reset_cache  # noqa: E402
from slack_search import TOOL_READ_THREAD, TOOL_SEARCH, SlackSearchTools  # noqa: E402

TZ = ZoneInfo("America/New_York")
PERMALINK = "https://uvalib.slack.com/archives/C1/p1760461440000100"

USERS = {"U1": "Pat Doe", "U2": "Jordan Lee", "UASK": "Sam Asker"}
CHANNELS = {
    "C1": {"id": "C1", "name": "assessment", "is_private": False},
    "C2": {"id": "C2", "name": "web-team", "is_private": False},
    "G1": {"id": "G1", "name": "secret", "is_private": True, "is_group": True},
}


def hit(user, channel_id, channel_name, ts, text, permalink=PERMALINK):
    return {"author_user_id": user, "author_name": USERS.get(user, user), "channel_id": channel_id,
            "channel_name": channel_name, "message_ts": ts, "content": text, "permalink": permalink}


DEFAULT_HITS = [
    hit("U1", "C1", "assessment", "1760461440.000100", "We decided LibCal hours sync nightly."),
    hit("U2", "C2", "web-team", "1760375040.000200", "LibCal widget is fixed."),
]


class Fake:
    def __init__(self, hits=None, error=None, status=200, channel_info=None, replies=None, replies_error=None):
        self.replies_error = replies_error
        self.hits = DEFAULT_HITS if hits is None else hits
        self.error = error
        self.status = status
        self.channel_info = channel_info
        self.replies = replies or [
            {"user": "U1", "text": "Should LibCal hours sync nightly?", "ts": "1760461440.000100"},
            {"user": "U2", "text": "yes, agreed with <@U1>", "ts": "1760461500.000200"},
        ]
        self.log = []

    def calls(self, method):
        return [p for m, p in self.log if m == method]

    def last(self, method):
        return self.calls(method)[-1]

    def api_call(self, api_method, params=None, **kw):
        self.log.append((api_method, dict(params or {})))
        if self.error:
            resp = {"ok": False, "error": self.error}
            raise SlackApiError(f"The request to the Slack API failed. ({self.error})", _Resp(resp, self.status))
        return {"ok": True, "results": {"messages": list(self.hits)}}

    def conversations_info(self, channel):
        self.log.append(("conversations.info", {"channel": channel}))
        if self.channel_info is not None:
            return {"channel": {"id": channel, "name": "x", **self.channel_info}}
        if channel not in CHANNELS:
            raise SlackApiError("channel_not_found", _Resp({"ok": False, "error": "channel_not_found"}, 200))
        return {"channel": CHANNELS[channel]}

    def conversations_list(self, types="public_channel", limit=200, cursor=None, exclude_archived=False):
        self.log.append(("conversations.list", {}))
        return {"channels": [c for c in CHANNELS.values() if not c["is_private"]],
                "response_metadata": {"next_cursor": ""}}

    def conversations_replies(self, channel, ts, limit=50, inclusive=True):
        self.log.append(("conversations.replies", {"channel": channel, "ts": ts}))
        if self.replies_error:
            raise SlackApiError(self.replies_error, _Resp({"ok": False, "error": self.replies_error}, 200))
        return {"messages": self.replies}

    def chat_getPermalink(self, channel, message_ts):
        return {"permalink": f"https://uvalib.slack.com/archives/{channel}/p{message_ts.replace('.', '')}"}

    def users_info(self, user):
        if user not in USERS:
            raise RuntimeError("user_not_found")
        return {"user": {"id": user, "real_name": USERS[user], "profile": {}}}

    def users_list(self, cursor=None, limit=200):
        return {"members": [{"id": u, "real_name": n, "profile": {}} for u, n in USERS.items()],
                "response_metadata": {"next_cursor": ""}}


class _Resp(dict):
    """Enough of SlackResponse for SlackApiError: item access + status_code."""

    def __init__(self, data, status_code):
        super().__init__(data)
        self.status_code = status_code


class Flag:
    called = False

    def __call__(self):
        self.called = True


def tools(action_token="tok", on_expired=None, **fake_kw):
    _reset_cache()
    fake = Fake(**fake_kw)
    t = SlackSearchTools(fake, action_token=action_token, asker_id="UASK", directory=UserDirectory(fake),
                         on_token_expired=on_expired or (lambda: None))
    return t, fake


def test_search_request_is_public_messages_with_tokens():
    s, fake = tools(action_token="tok")
    s.search("what did we decide about LibCal hours?")
    p = fake.last("assistant.search.context")
    assert p["action_token"] == "tok"
    assert p["query"].startswith("what did we decide")
    assert p["channel_types"] == "public_channel"
    assert p["content_types"] == "messages"


def test_results_show_channel_author_date_permalink():
    s, _ = tools()
    out = s.search("libcal hours")
    assert "#assessment" in out and "Pat Doe (U1)" in out
    assert "https://uvalib.slack.com/archives/" in out
    assert "We decided LibCal hours sync nightly." in out
    assert "2025-10-14" in out  # 1760461440 in America/New_York


def test_long_messages_are_trimmed():
    s, _ = tools(hits=[hit("U1", "C1", "assessment", "1760461440.000100", "x" * 2000)])
    out = s.search("q")
    assert "x" * 400 not in out and "…" in out


def test_from_user_me_filters_to_asker():
    hits = [hit("U1", "C1", "assessment", "1760461440.000100", "not mine"),
            hit("UASK", "C1", "assessment", "1760461441.000100", "my message")]
    s, fake = tools(hits=hits)
    out = s.search("my message about hours", from_user="me")
    assert "my message" in out and "not mine" not in out
    assert int(fake.last("assistant.search.context")["limit"]) == 20


def test_from_user_by_name():
    s, _ = tools()
    out = s.search("libcal", from_user="Jordan Lee")
    assert "Jordan Lee (U2)" in out and "Pat Doe" not in out


def test_unknown_from_user_copy():
    s, _ = tools()
    assert s.search("x", from_user="nobody") == 'I couldn\'t find a Slack user named "nobody".'


def test_ambiguous_from_user_asks_which_one():
    s, _ = tools()
    import identity

    identity._PROFILES.clear()
    s.directory.client.users_list = lambda cursor=None, limit=200: {
        "members": [{"id": "U1", "real_name": "Pat Doe", "profile": {}},
                    {"id": "U9", "real_name": "Pat Smith", "profile": {}}],
        "response_metadata": {"next_cursor": ""}}
    assert s.search("x", from_user="Pat") == 'More than one person matches "Pat": Pat Doe, Pat Smith. Which one?'


def test_from_user_first_name():
    s, _ = tools()
    out = s.search("libcal", from_user="Jordan")
    assert "Jordan Lee (U2)" in out and "Pat Doe" not in out


def test_after_before_become_unix_timestamps():
    s, fake = tools()
    s.search("q", after="2026-10-01", before="2026-10-15")
    p = fake.last("assistant.search.context")
    assert int(p["after"]) == int(datetime(2026, 10, 1, tzinfo=TZ).timestamp())
    assert int(p["before"]) == int(datetime(2026, 10, 15, tzinfo=TZ).timestamp())


def test_bad_date_is_a_plain_sentence():
    s, _ = tools()
    out = s.search("q", after="last week")
    assert "YYYY-MM-DD" in out


def test_channel_filter_by_name_scopes_search():
    s, fake = tools()
    out = s.search("libcal", channel="#assessment")
    assert fake.last("assistant.search.context")["context_channel_id"] == "C1"
    assert "#assessment" in out and "#web-team" not in out


def test_private_or_unknown_channel_filter_refused():
    s, fake = tools()
    assert "public channels" in s.search("x", channel="G1")
    assert "couldn't find a public channel" in s.search("x", channel="#nope")
    assert not fake.calls("assistant.search.context")


def test_expired_token_calls_back_and_returns_copy():
    flag = Flag()
    s, _ = tools(action_token="tok", error="invalid_action_token", on_expired=flag)
    assert s.search("x") == "Slack search needs a fresh @mention in this thread."
    assert flag.called


def test_rate_limited_copy():
    s, _ = tools(error="ratelimited", status=429)
    assert s.search("x") == "Slack search is busy, try again in a minute."


def test_other_errors_are_plain_sentences():
    s, _ = tools(error="internal_error")
    assert s.search("x") == "Slack search didn't work just now (internal_error)."


def test_no_results():
    s, _ = tools(hits=[])
    assert "No public Slack messages" in s.search("zebra")


def test_no_token_hides_search_tool():
    s, _ = tools(action_token="")
    assert [t["toolSpec"]["name"] for t in s.tool_specs()] == [TOOL_READ_THREAD]
    s2, _ = tools(action_token="tok")
    assert [t["toolSpec"]["name"] for t in s2.tool_specs()] == [TOOL_SEARCH, TOOL_READ_THREAD]


def test_search_spec_description_guides_the_model():
    s, _ = tools()
    desc = s.tool_specs()[0]["toolSpec"]["description"]
    for phrase in ("public channels", "question", "me", "YYYY-MM-DD", "2–3", "permalink"):
        assert phrase in desc, phrase


def test_handles_and_call_dispatch():
    s, _ = tools()
    assert s.handles(TOOL_SEARCH) and s.handles(TOOL_READ_THREAD) and not s.handles("get_library_hours")
    assert "#assessment" in s.call(TOOL_SEARCH, {"query": "libcal"})


def test_read_thread_refuses_private_im_mpim():  # RF3
    for info in ({"is_private": True}, {"is_im": True}, {"is_mpim": True}):
        s, fake = tools(channel_info=info)
        out = s.read_thread("https://uvalib.slack.com/archives/G1/p1700000000000100")
        assert "only read public channels" in out
        assert not fake.calls("conversations.replies")


def test_read_thread_fails_closed_when_channel_info_is_unclear():  # review: public check failed open
    s, fake = tools(channel_info={})
    assert "only read public channels" in s.read_thread(PERMALINK)
    assert not fake.calls("conversations.replies")


def test_read_thread_not_in_channel_copy():  # review: bot isn't a member of most public channels
    s, _ = tools(replies_error="not_in_channel")
    out = s.read_thread(PERMALINK)
    assert "channels Hoo Helper has been added to" in out
    assert not out.startswith("Tool Error")


def test_search_drops_hits_from_private_channels_or_dms():  # review: defence in depth
    hits = [hit("U1", "C1", "assessment", "1760461440.000100", "public one"),
            hit("U1", "G7", "secret", "1760461441.000100", "private group"),
            hit("U1", "D7", "dm", "1760461442.000100", "a dm"),
            {**hit("U1", "C8", "hidden", "1760461443.000100", "flagged private"), "is_private": True}]
    s, _ = tools(hits=hits)
    out = s.search("q")
    assert "public one" in out
    for leaked in ("private group", "a dm", "flagged private"):
        assert leaked not in out, leaked


def test_read_thread_parses_permalink_and_thread_ts():
    s, fake = tools()
    s.read_thread(PERMALINK)
    assert fake.last("conversations.replies") == {"channel": "C1", "ts": "1760461440.000100"}
    s.read_thread(PERMALINK + "?thread_ts=1760461000.000001&cid=C1")
    assert fake.last("conversations.replies")["ts"] == "1760461000.000001"


def test_read_thread_labels_speakers():
    s, _ = tools()
    out = s.read_thread(PERMALINK)
    assert "Pat Doe: Should LibCal hours sync nightly?" in out
    assert "Jordan Lee: yes, agreed with @Pat Doe" in out
    assert PERMALINK in out


def test_read_thread_bad_link():
    s, fake = tools()
    assert "Slack message link" in s.read_thread("not a link")
    assert not fake.calls("conversations.replies")


def test_no_result_text_starts_with_tool_error():
    outs = []
    for kw in ({}, {"error": "ratelimited", "status": 429}, {"error": "invalid_action_token"},
               {"error": "boom"}, {"hits": []}):
        s, _ = tools(**kw)
        outs.append(s.search("x"))
    s, _ = tools(channel_info={"is_im": True})
    outs.append(s.read_thread(PERMALINK))
    for out in outs:
        assert not out.startswith("Tool Error"), out
        assert "Traceback" not in out


if __name__ == "__main__":
    test_search_request_is_public_messages_with_tokens()
    test_results_show_channel_author_date_permalink()
    test_long_messages_are_trimmed()
    test_from_user_me_filters_to_asker()
    test_from_user_by_name()
    test_unknown_from_user_copy()
    test_ambiguous_from_user_asks_which_one()
    test_from_user_first_name()
    test_after_before_become_unix_timestamps()
    test_bad_date_is_a_plain_sentence()
    test_channel_filter_by_name_scopes_search()
    test_private_or_unknown_channel_filter_refused()
    test_expired_token_calls_back_and_returns_copy()
    test_rate_limited_copy()
    test_other_errors_are_plain_sentences()
    test_no_results()
    test_no_token_hides_search_tool()
    test_search_spec_description_guides_the_model()
    test_handles_and_call_dispatch()
    test_read_thread_refuses_private_im_mpim()
    test_read_thread_fails_closed_when_channel_info_is_unclear()
    test_read_thread_not_in_channel_copy()
    test_search_drops_hits_from_private_channels_or_dms()
    test_read_thread_parses_permalink_and_thread_ts()
    test_read_thread_labels_speakers()
    test_read_thread_bad_link()
    test_no_result_text_starts_with_tool_error()
    print("ok")
