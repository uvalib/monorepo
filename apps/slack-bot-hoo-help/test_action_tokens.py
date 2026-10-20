#!/usr/bin/env python3
"""Saving and reusing Slack action tokens per thread (no AWS)."""

import io
import logging
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from action_tokens import ActionTokenStore, conversation_key, token_from_event  # noqa: E402

NOW = 1_800_000_000.0


class FakeTable:
    def __init__(self):
        self.items = {}

    def put_item(self, Item):
        self.items[Item["key"]] = dict(Item)

    def get_item(self, Key):
        item = self.items.get(Key["key"])
        return {"Item": dict(item)} if item else {}

    def delete_item(self, Key):
        self.items.pop(Key["key"], None)


class FailingTable:
    def put_item(self, Item):
        raise RuntimeError("ProvisionedThroughputExceededException")

    def get_item(self, Key):
        raise RuntimeError("ResourceNotFoundException")

    def delete_item(self, Key):
        raise RuntimeError("ResourceNotFoundException")


class Clock:
    def __init__(self, t=NOW):
        self.t = t

    def __call__(self):
        return self.t


def store(table=None, clock=None):
    return ActionTokenStore(table if table is not None else FakeTable(), now=clock or Clock())


def test_conversation_keys():
    assert conversation_key({"channel": "C1", "ts": "100"}) == "C1#100"
    assert conversation_key({"channel": "C1", "thread_ts": "100", "ts": "105"}) == "C1#100"
    assert conversation_key({"channel": "D1", "channel_type": "im", "ts": "9"}) == "D1"
    assert conversation_key({"channel": "G1", "channel_type": "mpim", "thread_ts": "3", "ts": "9"}) == "G1"
    assert conversation_key({"ts": "9"}) is None


def test_token_from_event():
    assert token_from_event({"action_token": "a"}) == "a"
    assert token_from_event({"assistant_thread": {"action_token": "b"}}) == "b"
    assert token_from_event({}) == ""


def test_mention_saves_and_followup_reuses():
    s = store()
    assert s.resolve({"channel": "C1", "ts": "100", "user": "UA", "action_token": "tok-1"}) == "tok-1"
    # RF1: a different person following up in the same thread reuses it
    assert s.resolve({"channel": "C1", "thread_ts": "100", "ts": "105", "user": "UB"}) == "tok-1"


def test_not_reused_in_another_thread_or_channel():
    s = store()
    s.resolve({"channel": "C1", "ts": "100", "action_token": "tok-1"})
    assert s.resolve({"channel": "C1", "thread_ts": "200", "ts": "201"}) == ""
    assert s.resolve({"channel": "C2", "thread_ts": "100", "ts": "101"}) == ""


def test_dm_keyed_by_channel():
    s = store()
    s.resolve({"channel": "D1", "channel_type": "im", "ts": "1", "action_token": "tok-d"})
    assert s.resolve({"channel": "D1", "channel_type": "im", "ts": "9"}) == "tok-d"


def test_newer_token_replaces():
    s = store()
    s.resolve({"channel": "C1", "ts": "100", "action_token": "old"})
    s.resolve({"channel": "C1", "thread_ts": "100", "ts": "110", "action_token": "new"})
    assert s.resolve({"channel": "C1", "thread_ts": "100", "ts": "120"}) == "new"


def test_ttl_is_24h_and_expired_items_ignored():
    table, clock = FakeTable(), Clock()
    s = store(table, clock)
    s.resolve({"channel": "C1", "ts": "100", "action_token": "tok"})
    assert table.items["C1#100"]["expires_at"] == int(NOW + 24 * 3600)
    clock.t = NOW + 24 * 3600 + 1
    assert s.resolve({"channel": "C1", "thread_ts": "100", "ts": "200"}) == ""


def test_expire_deletes():
    table = FakeTable()
    s = store(table)
    s.resolve({"channel": "C1", "ts": "100", "action_token": "tok"})
    s.expire({"channel": "C1", "thread_ts": "100", "ts": "130"})
    assert "C1#100" not in table.items
    assert s.resolve({"channel": "C1", "thread_ts": "100", "ts": "140"}) == ""


def test_store_errors_mean_no_token():  # RF4
    s = store(FailingTable())
    assert s.resolve({"channel": "C1", "thread_ts": "1", "ts": "2"}) == ""
    assert s.resolve({"channel": "C1", "ts": "3", "action_token": "tok"}) == "tok"
    s.expire({"channel": "C1", "ts": "3"})  # must not raise


def test_no_table_configured_uses_event_token_only():
    s = ActionTokenStore(None, table_name="", now=Clock())
    assert s.resolve({"channel": "C1", "ts": "3", "action_token": "tok"}) == "tok"
    assert s.resolve({"channel": "C1", "thread_ts": "3", "ts": "4"}) == ""


def test_token_value_never_logged():
    buf = io.StringIO()
    handler = logging.StreamHandler(buf)
    log = logging.getLogger("action_tokens")
    log.addHandler(handler)
    old_level = log.level
    log.setLevel(logging.DEBUG)
    try:
        for s in (store(), store(FailingTable())):
            s.resolve({"channel": "C1", "ts": "100", "action_token": "tok-SECRET"})
            s.resolve({"channel": "C1", "thread_ts": "100", "ts": "101"})
            s.expire({"channel": "C1", "thread_ts": "100", "ts": "102"})
    finally:
        log.removeHandler(handler)
        log.setLevel(old_level)
    out = buf.getvalue()
    assert "action_token=" in out
    assert "tok-SECRET" not in out


if __name__ == "__main__":
    test_conversation_keys()
    test_token_from_event()
    test_mention_saves_and_followup_reuses()
    test_not_reused_in_another_thread_or_channel()
    test_dm_keyed_by_channel()
    test_newer_token_replaces()
    test_ttl_is_24h_and_expired_items_ignored()
    test_expire_deletes()
    test_store_errors_mean_no_token()
    test_no_table_configured_uses_event_token_only()
    test_token_value_never_logged()
    print("ok")
