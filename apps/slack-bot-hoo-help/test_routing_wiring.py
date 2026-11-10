"""Router Phase 2, part 4: wiring behind ENABLE_ROUTING, the route in traces, token totals in eval reports."""
import json
import os
import re
import sys
from types import SimpleNamespace

os.environ.setdefault("SLACK_BOT_TOKEN", "xoxb-test")
os.environ.setdefault("SLACK_SIGNING_SECRET", "test")
HERE = os.path.dirname(__file__)
sys.path.insert(0, os.path.join(HERE, "src"))


def run_query(monkeypatch, text, routing):
    import app
    from session_trace import SessionTrace
    from test_virgo_links import Client
    seen = {}

    class Agent:
        bedrock_runtime, model_id = None, "m"

        def process_message(self, q, **kw):
            seen.update(kw)
            return SimpleNamespace(text="ok", trace=SessionTrace(request_id="r1", user_message=q))

        def _sanitize_links(self, t, trace, **kw):
            return t, []
    built = []
    monkeypatch.setenv("ENABLE_ROUTING", "true" if routing else "false")
    monkeypatch.setattr(app, "agent", Agent())
    monkeypatch.setattr(app, "get_bot_identity", lambda c: ("UBOT", "B1"))
    monkeypatch.setattr(app, "slack_tools_for_event", lambda *a, **k: (None, []))
    monkeypatch.setattr(app, "_gateway_is_v2", lambda: True)
    monkeypatch.setattr(app, "_matomo_tools", lambda: built.append("matomo") or None)
    monkeypatch.setattr(app, "atlassian_tools_for_event", lambda *a, **k: built.append("atlassian") or None)
    monkeypatch.setattr(app, "citation_tools_for_env", lambda **k: built.append("citations") or None)
    event = {"type": "message", "channel": "D1", "channel_type": "im", "user": "U1", "text": text, "ts": "9.0"}
    app.handle_user_query(event, lambda **k: None, Client(), known_history=[], known_meta={})
    return seen, built


def test_switch_off_is_all(monkeypatch):
    seen, built = run_query(monkeypatch, "what are the hours for fine arts today?", routing=False)
    assert seen["route"].source == "off" and seen["route"].is_all
    assert set(built) == {"matomo", "atlassian", "citations"}


def test_routed_turn_builds_fewer_tools(monkeypatch):
    seen, built = run_query(monkeypatch, "what are the hours for fine arts today?", routing=True)
    assert set(seen["route"].domains) == {"library"} and seen["route"].source == "rules"
    # every tool set is built (the route filters them), so more_tools can bring any back
    assert set(built) == {"matomo", "atlassian", "citations"}


def test_trace_records_route():
    from routing import Route
    from session_trace import SessionTrace
    t = SessionTrace(request_id="r1", user_message="q")
    t.route = {"domains": ["library"], "source": "rules", "more_tools": []}
    d = t.to_dict()
    assert d["route"] == {"domains": ["library"], "source": "rules", "more_tools": []}


def test_agent_sets_trace_route():
    from routing import Route
    from test_agent_context import make_agent
    a = make_agent()
    r = a.process_message("hi", route=Route(frozenset({"library"}), "rules"))
    assert r.trace.route == {"domains": ["library"], "source": "rules", "more_tools": []}


def test_template_switch():
    t = open(os.path.join(HERE, "template.yaml")).read()
    m = re.search(r"\n  EnableRouting:\n(?:    .*\n)+", t)
    assert m and 'Default: "false"' in m.group(0)
    assert "ENABLE_ROUTING: !Ref EnableRouting" in t
    assert "EnableRouting=true" in open(os.path.join(HERE, "samconfig.toml")).read()  # switched on 2026-11-09


def test_report_has_token_column(tmp_path):
    from evals.live import CaseResult, write_report
    rs = [CaseResult("a", True, [], seconds=3, tools=["x"], slack_text="t", input_tokens=13000),
          CaseResult("b", False, ["r"], seconds=4, tools=[], slack_text="t", input_tokens=7000)]
    p = tmp_path / "r.md"
    write_report(rs, str(p))
    text = p.read_text()
    assert "| case | result | seconds | input tokens | tools |" in text and "| a | PASS | 3 | 13,000 |" in text
    assert "1/2 passed · input tokens 20,000" in text


def test_chime_in_domains_survive_history_reload(monkeypatch):
    import app
    from session_trace import SessionTrace
    from test_virgo_links import Client
    seen = {}

    class Agent:
        bedrock_runtime, model_id = None, "m"

        def process_message(self, q, **kw):
            seen.update(kw)
            return SimpleNamespace(text="ok", trace=SessionTrace(request_id="r1", user_message=q))

        def _sanitize_links(self, t, trace, **kw):
            return t, []
    monkeypatch.setenv("ENABLE_ROUTING", "true")
    monkeypatch.setattr(app, "agent", Agent())
    monkeypatch.setattr(app, "get_bot_identity", lambda c: ("UBOT", "B1"))
    monkeypatch.setattr(app, "slack_tools_for_event", lambda *a, **k: (None, []))
    monkeypatch.setattr(app, "_gateway_is_v2", lambda: True)
    event = {"type": "message", "channel": "G1", "channel_type": "mpim", "user": "U1", "text": "hmm, any idea?",
             "ts": "9.0", "thread_ts": "1.0"}
    app.handle_user_query(event, lambda **k: None, Client(), known_meta={"route_domains": ["stats"]})
    assert set(seen["route"].domains) == {"stats"}
