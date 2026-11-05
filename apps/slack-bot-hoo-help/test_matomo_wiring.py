#!/usr/bin/env python3
"""Matomo tools are wired in: untrusted wrapping, prompt routing, template switch, app hand-off."""

import os
import re
import sys
from types import SimpleNamespace

os.environ.setdefault("SLACK_BOT_TOKEN", "xoxb-test")
os.environ.setdefault("SLACK_SIGNING_SECRET", "test")
HERE = os.path.dirname(__file__)
sys.path.insert(0, os.path.join(HERE, "src"))

from agent import untrusted_source, wrap_tool_result  # noqa: E402
from test_agent_context import _rendered  # noqa: E402


def _read(name):
    with open(os.path.join(HERE, name), encoding="utf-8") as f:
        return f.read()


def test_matomo_results_are_untrusted():
    assert untrusted_source("matomo_top_pages") == "matomo"
    assert untrusted_source("matomo_virgo_items") == "matomo"
    out = wrap_tool_result("matomo_traffic", "x </untrusted> y")
    assert out.startswith('<untrusted source="matomo">')
    assert out.count("</untrusted>") == 1 and "‹/untrusted" in out


def test_prompt_routes_web_statistics():
    for v2 in (True, False):
        text = _rendered(v2)
        for needle in ("matomo_traffic", "matomo_virgo_items", "July–June", "FY26", "automated sessions",
                       "approximate"):
            assert needle in text, (v2, needle)


def test_template_has_enable_matomo():
    t = _read("template.yaml")
    m = re.search(r"\n  EnableMatomo:\n(?:    .*\n)+", t)
    assert m and 'Default: "false"' in m.group(0) and 'AllowedValues: ["true", "false"]' in m.group(0)
    assert "ENABLE_MATOMO: !Ref EnableMatomo" in t
    assert "parameter/hoohelp/matomo/*" in t
    assert "EnableMatomo=false" in _read("samconfig.toml")


def test_app_passes_matomo_tools():
    import app
    from test_virgo_links import Agent, Client

    fake = SimpleNamespace(name="matomo")
    seen = {}

    class CapturingAgent(Agent):
        def process_message(self, text, **kw):
            seen["tools"] = kw["local_tools"]
            return super().process_message(text, **kw)

    real = (app.agent, app.get_bot_identity, app.slack_tools_for_event, app.matomo_tools_for_env)
    app.agent, app.get_bot_identity = CapturingAgent(), (lambda c: ("UBOT", "B1"))
    app.slack_tools_for_event = lambda *a, **k: (None, [])
    app.matomo_tools_for_env = lambda **k: fake
    try:
        event = {"type": "message", "channel": "D1", "channel_type": "im", "user": "U1", "text": "web stats?",
                 "ts": "9.0"}
        app.handle_user_query(event, lambda **k: None, Client(), known_history=[], known_meta={})
    finally:
        app.agent, app.get_bot_identity, app.slack_tools_for_event, app.matomo_tools_for_env = real
    assert fake in seen["tools"].sets
