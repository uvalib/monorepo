#!/usr/bin/env python3
"""When does a turn get Slack search? Flag, allow-list and action tokens (no Slack / AWS)."""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from action_tokens import ActionTokenStore  # noqa: E402
from identity import UserDirectory, _reset_cache  # noqa: E402
from slack_search import NO_TOKEN_LINE, slack_tools_for_event  # noqa: E402
from test_action_tokens import FakeTable  # noqa: E402

ON = {"ENABLE_SLACK_SEARCH": "true"}
MENTION = {"channel": "C1", "ts": "100", "user": "U1", "action_token": "tok"}
FOLLOWUP = {"channel": "C1", "thread_ts": "100", "ts": "105", "user": "U2"}


class FakeClient:
    def users_info(self, user):
        return {"user": {"id": user, "real_name": user, "profile": {}}}


def setup():
    _reset_cache()
    client = FakeClient()
    return client, UserDirectory(client), ActionTokenStore(FakeTable())


def names(tools):
    return [t["toolSpec"]["name"] for t in tools.tool_specs()]


def test_flag_off_means_no_tools():
    client, d, s = setup()
    assert slack_tools_for_event(MENTION, client, directory=d, store=s, env={}) == (None, [])
    assert slack_tools_for_event(MENTION, client, directory=d, store=s, env={"ENABLE_SLACK_SEARCH": "false"}) == (None, [])


def test_allow_list_limits_rollout():
    client, d, s = setup()
    env = {**ON, "SLACK_SEARCH_ALLOW": "C9, U7"}
    assert slack_tools_for_event({**MENTION, "channel": "C1", "user": "U1"}, client, directory=d, store=s, env=env)[0] is None
    assert slack_tools_for_event({**MENTION, "channel": "C9", "user": "U1"}, client, directory=d, store=s, env=env)[0] is not None
    assert slack_tools_for_event({**MENTION, "channel": "C1", "user": "U7"}, client, directory=d, store=s, env=env)[0] is not None


def test_mention_gets_search_and_followup_reuses_token():
    client, d, s = setup()
    tools, extra = slack_tools_for_event(MENTION, client, directory=d, store=s, env=ON)
    assert names(tools) == ["search_slack", "read_slack_thread", "list_slack_channel"] and extra == []
    tools, extra = slack_tools_for_event(FOLLOWUP, client, directory=d, store=s, env=ON)
    assert tools.action_token == "tok" and tools.asker_id == "U2" and extra == []


def test_no_token_adds_prompt_line_and_hides_search():
    client, d, s = setup()
    tools, extra = slack_tools_for_event(FOLLOWUP, client, directory=d, store=s, env=ON)
    assert extra == ["Slack search is unavailable in this thread until someone @mentions Hoo Helper again; "
                     "say so only if Slack history would help answer."]
    assert extra == [NO_TOKEN_LINE]
    assert names(tools) == ["read_slack_thread", "list_slack_channel"]


def test_expired_token_is_forgotten_for_the_thread():
    client, d, s = setup()
    tools, _ = slack_tools_for_event(MENTION, client, directory=d, store=s, env=ON)
    tools.on_token_expired()
    tools, extra = slack_tools_for_event(FOLLOWUP, client, directory=d, store=s, env=ON)
    assert extra == [NO_TOKEN_LINE]


if __name__ == "__main__":
    test_flag_off_means_no_tools()
    test_allow_list_limits_rollout()
    test_mention_gets_search_and_followup_reuses_token()
    test_no_token_adds_prompt_line_and_hides_search()
    test_expired_token_is_forgotten_for_the_thread()
    print("ok")
