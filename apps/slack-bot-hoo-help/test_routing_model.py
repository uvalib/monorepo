"""Router Phase 2, part 3: Gemma routes when the rules can't, in one call with the chime-in check."""
import os
import sys
import time

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

import chime_in  # noqa: E402
from routing import Route, route_by_model, route_question  # noqa: E402


class Client:
    def __init__(self, text=None, exc=None, delay=0.0):
        self.text, self.exc, self.delay, self.calls = text, exc, delay, 0

    def converse(self, **kw):
        self.calls += 1
        if self.delay:
            time.sleep(self.delay)
        if self.exc:
            raise self.exc
        return {"output": {"message": {"content": [{"text": self.text}]}}}


def test_model_json():
    r = route_by_model("is it busy and do you have Dune", [], client=Client('{"domains":["library","catalog"],"confident":true}'))
    assert set(r.domains) == {"library", "catalog"} and r.source == "model"


def test_model_junk_falls_back():
    for text in ("Sure! library", '{"domains":["bogus"],"confident":true}', '{"domains":["library"],"confident":false}',
                 '{"domains":["library","catalog","stats","site"],"confident":true}', ""):
        r = route_by_model("x", [], client=Client(text))
        assert r.is_all and r.source == "fallback", text
    assert route_by_model("x", [], client=Client(exc=RuntimeError("boom"))).is_all
    t0 = time.monotonic()
    r = route_by_model("x", [], client=Client('{"domains":["library"],"confident":true}', delay=1.0), timeout=0.2)
    assert r.is_all and time.monotonic() - t0 < 0.8


def test_route_question_order():
    calls = []

    def model(message, transcript, **kw):
        calls.append(message)
        return Route(frozenset({"site"}), "model")
    assert route_question("hours?", [], enabled=False, v2=True, model=model).source == "off"
    assert route_question("hours?", [], enabled=True, v2=False, model=model).source == "off"
    r = route_question("anything", [], hint=["stats"], enabled=True, v2=True, model=model)
    assert set(r.domains) == {"stats"} and r.source == "model" and calls == []
    r = route_question("what are the hours for fine arts today?", [], enabled=True, v2=True, model=model)
    assert r.source == "rules" and calls == []
    r = route_question("can you help me with something", [], enabled=True, v2=True, model=model)
    assert set(r.domains) == {"site"} and calls == ["can you help me with something"]
    # the chime-in call already asked the model: an invalid hint routes everything, no second call
    r = route_question("x", [], hint=["bogus"], enabled=True, v2=True, model=model)
    assert r.is_all and r.source == "fallback" and calls == ["can you help me with something"]


def test_combined_chime_in(monkeypatch):
    def run(text=None, exc=None):
        monkeypatch.setattr(chime_in, "_bedrock_client", lambda: Client(text, exc))
        return chime_in.llm_judge_and_route([("Person A", "hi")], "Person B", "when does Shannon close?")
    assert run('{"reply": true, "domains": ["library"]}') == (True, ["library"])
    assert run('{"reply": "yes"}') == (False, None)
    assert run(exc=TimeoutError()) == (False, None)
    assert run("YES") == (True, None)
    assert run('{"reply": true, "domains": ["bogus"]}') == (True, None)


def test_should_reply_routed_passes_domains():
    snap = chime_in.Snapshot(participants={"UA", "UB"}, transcript=[("UA", "hi"), ("UB", "hello")])
    ok, reason, domains = chime_in.should_reply_routed("what time does Shannon close?", "UA", snap,
                                                       judge=lambda *a: (True, ["library"]))
    assert (ok, domains) == (True, ["library"])
    assert chime_in.should_reply_routed("hmm", "UA", snap, judge=lambda *a: True)[2] is None
    assert chime_in.should_reply("what time does Shannon close?", "UA", snap,
                                 judge=lambda *a: (True, ["library"])) == (True, "judge: yes")
