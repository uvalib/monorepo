"""GatewayMCPClient: tools/list failure caching and the search tool kept out of the model's tool config."""
import logging

import pytest

import gateway_mcp_client as gmc
from gateway_mcp_client import GatewayMCPClient


class _Resp:
    def __init__(self, tools):
        self._tools = tools

    def raise_for_status(self):
        pass

    def json(self):
        return {"result": {"tools": self._tools}}


class _Net:
    def __init__(self):
        self.calls = 0
        self.fail = True
        self.tools = [{"name": "Library___get_traffic", "description": "t", "inputSchema": {"type": "object"}}]

    def post(self, url, json=None, headers=None, timeout=None):
        self.calls += 1
        if self.fail:
            raise RuntimeError("gateway down")
        return _Resp(self.tools)


@pytest.fixture
def net(monkeypatch):
    n = _Net()
    clock = {"t": 1000.0}
    monkeypatch.setattr(gmc.requests, "post", n.post)
    monkeypatch.setattr(gmc.time, "monotonic", lambda: clock["t"])
    n.clock = clock
    return n


def test_failure_cached_30s_then_retried(net, caplog):
    c = GatewayMCPClient("https://gw/mcp")
    with caplog.at_level(logging.ERROR):
        assert c.list_tools() == []
        assert net.calls == 1
        net.clock["t"] += 29
        assert c.list_tools() == [] and net.calls == 1  # within the window: no request
        assert c.list_tools(force_refresh=False) == [] and net.calls == 1
    assert len([r for r in caplog.records if r.levelno >= logging.ERROR]) == 1  # logged once per window
    net.clock["t"] += 2  # 31 s after the failure
    assert c.list_tools() == [] and net.calls == 2  # retried (and failed again)
    net.clock["t"] += 5
    assert c.list_tools() == [] and net.calls == 2


def test_success_clears_failure(net):
    c = GatewayMCPClient("https://gw/mcp")
    assert c.list_tools() == []
    net.fail = False
    net.clock["t"] += 31
    assert [t["name"] for t in c.list_tools()] == ["Library___get_traffic"]
    assert net.calls == 2
    net.fail = True
    net.clock["t"] += 200  # success cache expired; fails now -> last good list, no request for 30 s
    assert [t["name"] for t in c.list_tools()] == ["Library___get_traffic"] and net.calls == 3
    net.clock["t"] += 10
    assert [t["name"] for t in c.list_tools()] == ["Library___get_traffic"] and net.calls == 3
    net.fail = False
    net.clock["t"] += 25
    c.list_tools()
    assert net.calls == 4
    net.fail = True
    net.clock["t"] += 1000
    assert c._failed_at is None  # a success cleared the failure window


def test_force_refresh_bypasses_failure_window(net):
    c = GatewayMCPClient("https://gw/mcp")
    c.list_tools()
    c.list_tools(force_refresh=True)
    assert net.calls == 2


def test_search_tool_not_offered_to_the_model(net):
    net.fail = False
    net.tools = net.tools + [{"name": "x_amz_bedrock_agentcore_search", "description": "s",
                              "inputSchema": {"type": "object"}}]
    c = GatewayMCPClient("https://gw/mcp")
    names = [t["toolSpec"]["name"] for t in c.get_bedrock_tool_config()["tools"]]
    assert names == ["Library___get_traffic"]
