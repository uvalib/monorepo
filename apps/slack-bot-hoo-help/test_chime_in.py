#!/usr/bin/env python3
"""When should the bot speak up in a multi-person thread? (no Slack / Bedrock)"""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from chime_in import should_reply, snapshot_from_messages  # noqa: E402
from thread_context import should_ignore_message_event  # noqa: E402

BOT = "UBOT"


def msg(user, text, ts):
    return {"user": user, "text": text, "ts": ts}


def bot(text, ts):
    return {"user": BOT, "bot_id": "B1", "text": text, "ts": ts}


def snap(messages, current_ts="9"):
    return snapshot_from_messages(messages, bot_user_id=BOT, bot_app_bot_id="B1", current_ts=current_ts)


NEVER = lambda *a, **k: (_ for _ in ()).throw(AssertionError("judge should not be called"))  # noqa: E731
GROUP = [msg("UA", f"<@{BOT}> gate counts for Clemons last week?", "1"), bot("Clemons: 9,206 entries", "2"),
         msg("UB", "nice, did you finish the slides?", "3")]


def test_one_on_one_always_replies():
    s = snap([msg("UA", f"<@{BOT}> hours for Shannon?", "1"), bot("9–8", "2")])
    assert should_reply("and tomorrow?", "UA", s, judge=NEVER) == (True, "one-on-one")


def test_addressed_by_name_replies():
    for text in ["Hoo Helper, what about Shannon?", "hoohelp can you check RMC", "hey bot, is Clemons open?"]:
        ok, reason = should_reply(text, "UB", snap(GROUP), judge=NEVER)
        assert ok and reason == "addressed by name", text


def test_reply_from_the_person_the_bot_answered():
    s = snap([msg("UA", f"<@{BOT}> gate counts for Clemons?", "1"), msg("UB", "following", "2"),
              msg("UA", f"<@{BOT}> last week please", "3"), bot("Clemons: 9,206", "4")])
    assert should_reply("and the week before?", "UA", s, judge=NEVER) == (True, "reply to bot")


def test_group_chatter_uses_judge_and_defaults_to_silence():
    calls = []

    def judge(transcript, sender, text):
        calls.append((transcript, sender, text))
        return False

    assert should_reply("yes, sending them tonight", "UA", snap(GROUP), judge=judge) == (False, "judge: no")
    transcript = calls[0][0]
    assert [speaker for speaker, _ in transcript] == ["Person A", "Hoo Helper", "Person B"]
    assert calls[0][1] == "Person A"
    assert should_reply("what time does Shannon close?", "UA", snap(GROUP), judge=lambda *a: True) == (True, "judge: yes")


def test_judge_errors_stay_silent():
    def boom(*a):
        raise TimeoutError("slow")
    assert should_reply("hmm", "UA", snap(GROUP), judge=boom) == (False, "judge error: TimeoutError")


def test_slackbot_system_messages_ignored():
    assert should_ignore_message_event({"user": "USLACKBOT", "text": "You have been removed from #ai by <@U9>"})
    assert not should_ignore_message_event({"user": "UA", "text": "hello"})


def _judge_request(model_env=None):
    """Run llm_judge against a fake Bedrock client and return the request it sent."""
    import boto3
    import chime_in
    sent = {}

    class FakeBedrock:
        def converse(self, **kw):
            sent.update(kw)
            return {"output": {"message": {"content": [{"text": "YES"}]}}}

    real, old_env = boto3.client, os.environ.get("CHIME_IN_MODEL_ID")
    boto3.client = lambda *a, **k: FakeBedrock()
    chime_in._bedrock_client.cache_clear()
    if model_env is None:
        os.environ.pop("CHIME_IN_MODEL_ID", None)
    else:
        os.environ["CHIME_IN_MODEL_ID"] = model_env
    try:
        assert chime_in.llm_judge([("Person A", "hi")], "Person B", "is Clemons open?") is True
    finally:
        boto3.client = real
        chime_in._bedrock_client.cache_clear()
        if old_env is None:
            os.environ.pop("CHIME_IN_MODEL_ID", None)
        else:
            os.environ["CHIME_IN_MODEL_ID"] = old_env
    return sent


def test_default_judge_is_gemma_with_plain_settings():  # model comparison: 30/30, ~3x faster than Haiku
    sent = _judge_request()
    assert sent["modelId"] == "google.gemma-3-12b-it"
    assert sent["inferenceConfig"]["temperature"] == 0
    assert 8 <= sent["inferenceConfig"]["maxTokens"] <= 64
    assert "additionalModelRequestFields" not in sent  # Claude-only fields


def test_claude_judge_keeps_claude_settings():
    sent = _judge_request("us.anthropic.claude-haiku-5-5")
    # Claude Haiku 5.5 rejects `temperature`, and thinks by default (spending maxTokens before the answer).
    assert "temperature" not in sent["inferenceConfig"] and "topP" not in sent["inferenceConfig"]
    assert sent["additionalModelRequestFields"] == {"thinking": {"type": "disabled"}, "output_config": {"effort": "low"}}
    assert sent["inferenceConfig"]["maxTokens"] >= 256


# ---- Wiring through app._lazy_message (fake Slack client, no network)
os.environ.setdefault("SLACK_BOT_TOKEN", "xoxb-test")
os.environ.setdefault("SLACK_SIGNING_SECRET", "test")
os.environ.setdefault("AWS_REGION", "us-east-1")
os.environ.setdefault("CONVERSATION_TRACE", "off")


class FakeClient:
    def __init__(self, thread, history=None):
        self.thread, self.history = thread, history or []

    def conversations_replies(self, **kw):
        return {"messages": self.thread}

    def conversations_history(self, **kw):
        return {"messages": list(reversed(self.history))}   # Slack returns newest first


def _run_lazy(event, client, judge_answer):
    import app
    import chime_in
    replied = []
    real = app.handle_user_query, app.get_bot_identity, chime_in.llm_judge
    app.handle_user_query = lambda *a, **k: replied.append(k)
    app.get_bot_identity = lambda c: (BOT, "B1")
    chime_in.llm_judge = lambda *a: judge_answer
    try:
        app._lazy_message(event, lambda **k: None, client)
    finally:  # later test files call the real handler
        app.handle_user_query, app.get_bot_identity, chime_in.llm_judge = real
    return replied


def test_group_thread_chatter_is_not_answered():
    thread = GROUP + [msg("UA", "yes, sending them tonight", "9")]
    ev = {"type": "message", "channel_type": "channel", "channel": "C1", "thread_ts": "1", "ts": "9",
          "user": "UA", "text": "yes, sending them tonight"}
    assert _run_lazy(ev, FakeClient(thread), judge_answer=False) == []
    assert len(_run_lazy(ev, FakeClient(thread), judge_answer=True)) == 1


def test_one_on_one_thread_still_answered():
    thread = [msg("UA", f"<@{BOT}> hours for Shannon?", "1"), bot("9–8", "2"), msg("UA", "and tomorrow?", "9")]
    ev = {"type": "message", "channel_type": "channel", "channel": "C1", "thread_ts": "1", "ts": "9",
          "user": "UA", "text": "and tomorrow?"}
    assert len(_run_lazy(ev, FakeClient(thread), judge_answer=False)) == 1


def test_group_dm_chatter_is_not_answered():
    history = [msg("UA", "lunch at noon?", "1"), msg("UB", "sure", "2"), msg("UA", "see you there", "9")]
    ev = {"type": "message", "channel_type": "mpim", "channel": "G1", "ts": "9", "user": "UA", "text": "see you there"}
    assert _run_lazy(ev, FakeClient([], history), judge_answer=False) == []
    assert len(_run_lazy({**ev, "text": "Hoo Helper, is Clemons open?"}, FakeClient([], history), judge_answer=False)) == 1


def test_one_on_one_dm_unchanged():
    ev = {"type": "message", "channel_type": "im", "channel": "D1", "ts": "9", "user": "UA", "text": "thanks"}
    assert len(_run_lazy(ev, FakeClient([]), judge_answer=False)) == 1


if __name__ == "__main__":
    test_one_on_one_always_replies()
    test_addressed_by_name_replies()
    test_reply_from_the_person_the_bot_answered()
    test_group_chatter_uses_judge_and_defaults_to_silence()
    test_judge_errors_stay_silent()
    test_slackbot_system_messages_ignored()
    test_default_judge_is_gemma_with_plain_settings()
    test_claude_judge_keeps_claude_settings()
    test_group_thread_chatter_is_not_answered()
    test_one_on_one_thread_still_answered()
    test_group_dm_chatter_is_not_answered()
    test_one_on_one_dm_unchanged()
    print("ok")
