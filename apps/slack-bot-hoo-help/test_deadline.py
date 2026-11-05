"""Hoo Helper always replies before the Lambda time limit (2026-11-05: a slow Matomo left a
question unanswered, and Lambda's automatic retry ran the whole question again)."""
import os
import re
import sys
import threading
import time

os.environ.setdefault("SLACK_BOT_TOKEN", "xoxb-test")
os.environ.setdefault("SLACK_SIGNING_SECRET", "test")
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

import agent as agent_mod  # noqa: E402
from test_agent_context import LoopingBedrock, make_agent  # noqa: E402


class SlowBedrock(LoopingBedrock):
    """Each model call takes 15 s on the fake clock."""

    def __init__(self, clock, **kw):
        super().__init__(**kw)
        self.clock = clock

    def converse(self, **kwargs):
        self.clock.t += 15
        return super().converse(**kwargs)


class Clock:
    def __init__(self):
        self.t = 1000.0

    def __call__(self):
        return self.t


def test_near_the_deadline_the_agent_wraps_up(monkeypatch):
    clock = Clock()
    monkeypatch.setattr(agent_mod, "_now", clock)
    a = make_agent()
    a.bedrock_runtime = SlowBedrock(clock, wrap_up_text="Here's what I found so far.")
    result = a.process_message("hours for every library?", deadline=clock.t + 50)
    assert result.text == "Here's what I found so far."
    assert len(a.bedrock_runtime.requests) == 3  # two lookup rounds, then the wrap-up
    assert result.trace.stop_reason == "deadline"


def test_past_the_deadline_the_agent_answers_without_a_model_call(monkeypatch):
    clock = Clock()
    monkeypatch.setattr(agent_mod, "_now", clock)
    a = make_agent()
    a.bedrock_runtime = SlowBedrock(clock)
    result = a.process_message("hours for every library?", deadline=clock.t + 5)
    assert result.text == agent_mod.TOO_SLOW_REPLY
    assert a.bedrock_runtime.requests == []


def test_no_deadline_keeps_the_step_limit():
    a = make_agent()
    a.bedrock_runtime = LoopingBedrock(wrap_up_text="done")
    assert a.process_message("hours for every library?").trace.stop_reason == "max_iterations"


def test_run_with_deadline_gives_up_on_a_stuck_answer():
    import app
    release = threading.Event()
    t0 = time.monotonic()
    assert app._run_with_deadline(lambda: release.wait(5) or "late", time.monotonic() + 0.2) is None
    assert time.monotonic() - t0 < 2
    release.set()
    assert app._run_with_deadline(lambda: "ok", time.monotonic() + 5) == "ok"
    assert app._run_with_deadline(lambda: "ok", None) == "ok"


def test_run_with_deadline_reraises():
    import app
    try:
        app._run_with_deadline(lambda: 1 / 0, time.monotonic() + 5)
    except ZeroDivisionError:
        pass
    else:
        raise AssertionError("expected the error")


def test_lambda_does_not_retry_a_timed_out_answer():
    text = open(os.path.join(os.path.dirname(__file__), "template.yaml")).read()
    fn = text.split("  HooHelpFunction:\n", 1)[1]
    fn = fn[:re.search(r"\n  \S", fn).start()]
    assert re.search(r"EventInvokeConfig:\n\s+MaximumRetryAttempts: 0", fn)


def test_stuck_answer_still_gets_a_slack_reply():
    import app
    from test_virgo_links import Agent, Client

    release = threading.Event()
    seen = {}

    class StuckAgent(Agent):
        def process_message(self, text, **kw):
            seen["deadline"] = kw.get("deadline")
            release.wait(5)
            return super().process_message(text, **kw)

    client = Client()
    real = (app.agent, app.get_bot_identity, app.slack_tools_for_event, app._INVOCATION_DEADLINE)
    app.agent, app.get_bot_identity = StuckAgent(), (lambda c: ("UBOT", "B1"))
    app.slack_tools_for_event = lambda *a, **k: (None, [])
    app._INVOCATION_DEADLINE = time.monotonic() + app.REPLY_RESERVE_SEC + 0.3
    try:
        event = {"type": "message", "channel": "D1", "channel_type": "im", "user": "U1",
                 "text": "top Virgo items for FY26?", "ts": "9.0"}
        app.handle_user_query(event, lambda **k: client.posts.append(k), client, known_history=[], known_meta={})
    finally:
        release.set()
        app.agent, app.get_bot_identity, app.slack_tools_for_event, app._INVOCATION_DEADLINE = real
    posted = " ".join(str(p.get("text", "")) + str(p.get("blocks", "")) for p in client.posts)
    assert "took longer than I can spend on one question" in posted
    assert seen["deadline"] is not None
