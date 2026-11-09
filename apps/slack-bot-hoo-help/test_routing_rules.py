"""Router Phase 2, part 2: keyword rules, follow-ups, tool filtering and more_tools."""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from routing import MORE_TOOLS, Route, route_by_rules, tool_domain  # noqa: E402
from test_agent_context import make_agent  # noqa: E402

TABLE = [
    ("what are the hours for fine arts today?", {"library"}),
    ("How busy is Clemons right now?", {"library"}),
    ("Does UVA have this book? Rodman, Selden. _The Miracle of Haitian Art_. 1974.", {"catalog"}),
    ("Give me the FY26 Virgo annual report", {"stats"}),
    ("Which Virgo collections were most accessed in FY26?", {"stats"}),
    ("next bus to the Rotunda", {"transit"}),
    ("what do we have in the Susan Oberman papers", {"archives", "catalog"}),
    ("Is there a Jira ticket about the annual report?", {"atlassian"}),
    ("I'm looking for a conversation where a user suggested cataloging something differently", {"slack"}),
    ("What's in the README of virgo4-client?", {"github"}),
    ("show me photos of the Lawn in snow", {"images"}),
    ("Where can I use a CD-Rom", {"site"}),
    ("Is Clemons busy and does it have The Miracle of Haitian Art?", {"library", "catalog"}),
    # 2026-11-09 routing comparison: these were misrouted
    ("Do we have the president's private correspondence from 2024?", {"catalog", "archives"}),
    ("do we have any nursing school records from the 1920s?", {"catalog", "archives"}),
    ("Do we have letters describing a cholera outbreak?", {"catalog", "archives"}),
    ("How crowded is the Gold Line right now?", {"library", "transit"}),
    ("How do I handle an Aeon print request?", {"site", "atlassian"}),
    ("Where's the doc on hold policies?", {"site", "atlassian"}),
]


def thread(*turns):
    return [{"role": r, "content": [{"text": t}]} for r, t in turns]


def test_rules_table():
    for q, want in TABLE:
        r = route_by_rules(q, [])
        assert r is not None and set(r.domains) == want and r.source == "rules", (q, r)
    assert route_by_rules("hello!", []) is None


def test_slack_always_with_channel_words():
    r = route_by_rules("what did the #ai channel say about hours", [])
    assert "slack" in r.domains


def test_pasted_citation_list_is_catalog():
    q = ("Does UVA have these?\n1. Rodman, Selden. Where Art Is Joy. 1988.\n"
         "2. Hurbon, Laënnec. Voodoo. 1995.\n3. Nicholls, David. From Dessalines to Duvalier. 1996.")
    assert set(route_by_rules(q, []).domains) == {"catalog"}


def test_over_three_is_none():
    assert route_by_rules("library hours, the next bus, whether we have the book Dune, and Virgo pageviews", []) is None


def test_follow_up_inherits():
    gate = thread(("user", "I need a gate count report for the Music library for June 2026"),
                  ("assistant", "In June 2026 the Music Library had 3,120 entries."))
    r = route_by_rules("previous month?", gate)
    assert set(r.domains) == {"library"} and r.source == "history"
    offer = thread(("user", "Does UVA have these? 1. Rodman, Where Art Is Joy, 1988. 2. Hurbon, Voodoo, 1995."),
                   ("assistant", "Item 1 isn't held. Want me to continue with item 2?"))
    r = route_by_rules("Yes.", offer)
    assert set(r.domains) == {"catalog"} and r.source == "history"


def test_tool_domain():
    assert tool_domain("Library___get_hours") == {"library"}
    assert tool_domain("Catalog___search_catalog") == {"catalog", "images"}
    assert tool_domain("Site___get_suggestions") == {"catalog", "images"}
    assert tool_domain("Site___search_site") == {"site"}
    assert tool_domain("matomo_traffic") == {"stats"}
    assert tool_domain("check_citations") == {"catalog"}
    assert tool_domain("enable_github_tools") == {"github"}


class Local:
    def __init__(self, names):
        self.names = names

    def tool_specs(self):
        return [{"toolSpec": {"name": n, "description": n, "inputSchema": {"json": {"type": "object"}}}}
                for n in self.names]

    def handles(self, name):
        return name in self.names

    def call(self, name, args):
        return f"{name} result"


class Gateway:
    gateway_url = "https://example.invalid/mcp"

    def get_bedrock_tool_config(self):
        return {"tools": [{"toolSpec": {"name": n, "description": n, "inputSchema": {"json": {"type": "object"}}}}
                          for n in ("Library___get_hours", "Catalog___search_catalog", "Site___get_suggestions",
                                    "Transit___find_bus_stops")]}

    def call_tool(self, name, args):
        return f"{name} result"


def names(cfg):
    return {t["toolSpec"]["name"] for t in cfg["tools"]}


def test_tool_filtering():
    a = make_agent()
    a.gateway_client = Gateway()
    local = Local(["check_citations", "matomo_traffic"])
    cfg = a._merged_tool_config(local, route=Route(frozenset({"catalog"}), "rules"))
    n = names(cfg)
    assert {"Catalog___search_catalog", "Site___get_suggestions", "check_citations", MORE_TOOLS} <= n
    assert not n & {"Library___get_hours", "matomo_traffic", "Transit___find_bus_stops"}
    assert {"Library___get_hours", "matomo_traffic"} <= names(a._merged_tool_config(local, route=Route.all()))
    assert MORE_TOOLS not in names(a._merged_tool_config(local, route=Route.all()))


def test_unrouted_tool_refused():
    a = make_agent()
    a.gateway_client = Gateway()
    out = a._dispatch_tool("matomo_traffic", {}, Local(["matomo_traffic"]),
                           route=Route(frozenset({"catalog"}), "rules"))
    assert out == ("Error: matomo_traffic isn't available for this question. Call more_tools with the "
                   "domain you need (stats).")


class Bedrock:
    def __init__(self):
        self.requests = []

    def converse(self, **kw):
        self.requests.append(kw)
        if len(self.requests) == 1:
            return {"output": {"message": {"role": "assistant", "content": [
                {"toolUse": {"toolUseId": "t1", "name": MORE_TOOLS, "input": {"domains": ["library"]}}}]}},
                "stopReason": "tool_use", "usage": {}}
        return {"output": {"message": {"role": "assistant", "content": [{"text": "done"}]}},
                "stopReason": "end_turn", "usage": {}}


def test_more_tools_widens_next_step():
    a = make_agent()
    a.gateway_client = Gateway()
    a.bedrock_runtime = Bedrock()
    result = a.process_message("is it open?", local_tools=Local([]), route=Route(frozenset({"catalog"}), "rules"))
    first, second = a.bedrock_runtime.requests
    assert "Library___get_hours" not in names(first["toolConfig"])
    assert "Library___get_hours" in names(second["toolConfig"])
    out = result.trace.steps[0].output
    assert "1. **Occupancy" in out and "2. **Virgo Catalog" not in out
