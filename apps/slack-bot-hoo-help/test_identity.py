#!/usr/bin/env python3
"""Who is Hoo Helper talking to? Slack user lookups and the identity line (no Slack API)."""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from identity import UserDirectory, UserInfo, _reset_cache, identity_line, resolve_mentions  # noqa: E402


class FakeClient:
    def __init__(self, users):
        self.users = users
        self.info_calls = 0
        self.list_calls = 0

    def users_info(self, user):
        self.info_calls += 1
        if user not in self.users:
            raise RuntimeError("user_not_found")
        return {"user": {"id": user, **self.users[user]}}

    def users_list(self, cursor=None, limit=200):
        self.list_calls += 1
        return {"members": [{"id": uid, **u} for uid, u in self.users.items()], "response_metadata": {"next_cursor": ""}}


class FailingClient:
    def __init__(self):
        self.info_calls = 0

    def users_info(self, user):
        self.info_calls += 1
        raise RuntimeError("ratelimited")

    def users_list(self, cursor=None, limit=200):
        raise RuntimeError("ratelimited")


def test_identity_line_full_profile():
    _reset_cache()
    info = UserInfo("U07ABC", "Pat Doe", "pat", "Assessment Librarian", "she/her", False)
    assert identity_line(info) == (
        "You're talking with Pat Doe (display name \"pat\"), Assessment Librarian, she/her — Slack id U07ABC. "
        "Use their name naturally and sparingly and their stated pronouns."
    )


def test_identity_line_without_pronouns_says_not_to_guess():
    _reset_cache()
    line = identity_line(UserInfo("U1", "Sam Lee", "", "", "", False))
    assert "Sam Lee" in line and "U1" in line
    assert "pronouns aren't set" in line and "they/them" in line


def test_identity_line_never_contains_email():
    _reset_cache()
    client = FakeClient({"U1": {"real_name": "Pat Doe", "profile": {"email": "pat@virginia.edu", "display_name": "pat"}}})
    line = identity_line(UserDirectory(client).get("U1"))
    assert "Pat Doe" in line
    assert "@virginia.edu" not in line


def test_lookup_is_cached():
    _reset_cache()
    client = FakeClient({"U1": {"real_name": "Pat Doe", "profile": {}}})
    d = UserDirectory(client)
    d.get("U1")
    UserDirectory(client).get("U1")
    assert client.info_calls == 1


def test_lookup_failure_returns_none_and_label_falls_back():  # RF5
    _reset_cache()
    d = UserDirectory(FailingClient())
    assert d.get("U9") is None
    assert d.label("U9") == "U9"
    assert identity_line(None) == ""


def test_label_falls_back_to_display_name_then_id():  # RF2
    _reset_cache()
    client = FakeClient({
        "U2": {"real_name": "", "profile": {"display_name": "jj"}},
        "U3": {"deleted": True, "real_name": "Gone Person", "profile": {"display_name": "gone"}},
    })
    d = UserDirectory(client)
    assert d.label("U2") == "jj"
    assert d.label("U3") == "Gone Person"  # review: departed staff keep their names
    assert UserDirectory(FakeClient({"U4": {"real_name": "", "profile": {}}})).label("U4") == "U4"


def test_resolve_mentions():
    _reset_cache()
    d = UserDirectory(FakeClient({"U1": {"real_name": "Pat Doe", "profile": {}}}))
    assert resolve_mentions("ask <@U1> or <@U1|pat>", d) == "ask @Pat Doe or @Pat Doe"
    assert resolve_mentions("<@UBOT> hi", d, skip_ids=["UBOT"]) == "<@UBOT> hi"


def test_find_accepts_ids_mentions_and_names():
    _reset_cache()
    d = UserDirectory(FakeClient({"U1": {"real_name": "Pat Doe", "profile": {"display_name": "pat"}}}))
    assert d.find("U1") == d.find("<@U1>") == d.find("@pat") == d.find("pat doe") == "U1"
    assert d.find("nobody") is None


def test_failed_lookup_is_not_retried_immediately():  # RF5: one bad user, many messages
    _reset_cache()
    client = FailingClient()
    d = UserDirectory(client)
    for _ in range(20):
        d.label("U9")
    assert client.info_calls == 1


def test_find_by_unique_first_name_and_reports_ambiguity():  # review: "Jordan's message"
    _reset_cache()
    d = UserDirectory(FakeClient({
        "U1": {"real_name": "Jordan Lee", "profile": {"display_name": "jlee"}},
        "U2": {"real_name": "Pat Doe", "profile": {}},
        "U3": {"real_name": "Pat Smith", "profile": {}},
    }))
    assert d.find("Jordan") == "U1"
    assert d.find("pat") is None
    assert [i.label for i in d.candidates("pat")] == ["Pat Doe", "Pat Smith"]
    assert [i.user_id for i in d.candidates("Jordan Lee")] == ["U1"]
    assert d.candidates("nobody") == []


def test_email_lookup_is_separate_from_userinfo():
    _reset_cache()
    d = UserDirectory(FakeClient({"U1": {"real_name": "Pat Doe", "profile": {"email": "pat@virginia.edu"}}}))
    assert d.email("U1") == "pat@virginia.edu"
    assert "virginia.edu" not in repr(d.get("U1"))
    assert "virginia.edu" not in identity_line(d.get("U1"))


def test_email_uses_cache_and_failure_is_empty():
    _reset_cache()
    client = FakeClient({"U1": {"real_name": "Pat Doe", "profile": {"email": "pat@virginia.edu"}}})
    d = UserDirectory(client)
    d.get("U1")
    assert d.email("U1") == "pat@virginia.edu" and client.info_calls == 1
    assert UserDirectory(FailingClient()).email("U9") == ""
    assert UserDirectory(FakeClient({"U2": {"real_name": "No Email", "profile": {}}})).email("U2") == ""


if __name__ == "__main__":
    test_identity_line_full_profile()
    test_identity_line_without_pronouns_says_not_to_guess()
    test_identity_line_never_contains_email()
    test_lookup_is_cached()
    test_lookup_failure_returns_none_and_label_falls_back()
    test_label_falls_back_to_display_name_then_id()
    test_resolve_mentions()
    test_find_accepts_ids_mentions_and_names()
    test_failed_lookup_is_not_retried_immediately()
    test_find_by_unique_first_name_and_reports_ambiguity()
    test_email_lookup_is_separate_from_userinfo()
    test_email_uses_cache_and_failure_is_empty()
    print("ok")
