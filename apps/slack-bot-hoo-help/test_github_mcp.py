#!/usr/bin/env python3
"""GitHub hosted-MCP streamable-HTTP client: session, SSE/JSON, caching, retries (fake HTTP, no network)."""

import json
import os
import sys

import requests

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from github_mcp import GitHubMCPClient, GitHubMCPError  # noqa: E402

TOKEN = "ghs_SECRETTOKEN" + "x" * 20


class FakeResp:
    def __init__(self, status=200, body=None, sse=False, headers=None, raw=None):
        self.status_code = status
        self.headers = dict(headers or {})
        if raw is not None:
            self.text = raw
        elif body is None:
            self.text = ""
        elif sse:
            self.headers.setdefault("Content-Type", "text/event-stream")
            self.text = "event: message\ndata: {\"ignored\": 1}\n\ndata: " + json.dumps(body) + "\n\n"
        else:
            self.headers.setdefault("Content-Type", "application/json")
            self.text = json.dumps(body)


def rpc_ok(result, i=1):
    return {"jsonrpc": "2.0", "id": i, "result": result}


class FakeHttp:
    """Scripted: `script` maps a call index (0-based) or callable(payload, headers)->FakeResp."""

    def __init__(self, handler):
        self.handler = handler
        self.calls = []

    def post(self, url, json=None, headers=None, timeout=None, **kw):
        self.calls.append({"url": url, "json": json, "headers": dict(headers or {}), "timeout": timeout})
        r = self.handler(len(self.calls) - 1, json, headers)
        if isinstance(r, Exception):
            raise r
        return r


def standard(session="sess-1", tools=None, call_result=None, sse=False):
    def handler(n, payload, headers):
        m = payload.get("method")
        if m == "initialize":
            return FakeResp(200, rpc_ok({"serverInfo": {"name": "github-mcp-server"}}), sse=sse,
                            headers={"Mcp-Session-Id": session})
        if m == "notifications/initialized":
            return FakeResp(202)
        if m == "tools/list":
            return FakeResp(200, rpc_ok({"tools": tools if tools is not None else [{"name": "get_commit"}]}), sse=sse)
        if m == "tools/call":
            return FakeResp(200, rpc_ok(call_result or {"content": [{"type": "text", "text": "hi"}], "isError": False}),
                            sse=sse)
        raise AssertionError(m)
    return handler


def client(http, **kw):
    return GitHubMCPClient(lambda: TOKEN, http=http, **kw)


def methods(http):
    return [c["json"]["method"] for c in http.calls]


def test_initialize_then_list_and_call_with_session_id():
    http = FakeHttp(standard())
    c = client(http)
    assert c.list_tools() == [{"name": "get_commit"}]
    res = c.call_tool("get_commit", {"owner": "uvalib"})
    assert res["content"][0]["text"] == "hi"
    assert methods(http) == ["initialize", "notifications/initialized", "tools/list", "tools/call"]
    init, note, lst, call = http.calls
    assert init["json"]["params"]["protocolVersion"] == "2025-03-26"
    assert init["json"]["params"]["clientInfo"] == {"name": "hoohelp", "version": "1"}
    assert "id" not in note["json"]
    assert "Mcp-Session-Id" not in init["headers"]
    for call_ in (note, lst, call):
        h = call_["headers"]
        assert h["Mcp-Session-Id"] == "sess-1"
        assert h["Authorization"] == f"Bearer {TOKEN}"
        assert h["X-MCP-Toolsets"] == "repos,issues,pull_requests"
        assert h["X-MCP-Readonly"] == "true"
        assert h["Accept"] == "application/json, text/event-stream"
    assert init["timeout"] == note["timeout"] == call["timeout"] == 20
    assert lst["timeout"] == 8  # tools/list runs at the start of every turn: fail fast
    assert call["json"]["params"] == {"name": "get_commit", "arguments": {"owner": "uvalib"}}
    assert call["url"] == "https://api.githubcopilot.com/mcp/readonly"


def test_sse_and_json_replies_parsed():
    for sse in (True, False):
        http = FakeHttp(standard(sse=sse))
        c = client(http)
        assert c.list_tools() == [{"name": "get_commit"}]
        assert c.call_tool("x", {})["isError"] is False


def test_tools_list_follows_cursor():
    def handler(n, payload, headers):
        if payload["method"] == "tools/list":
            cur = payload["params"].get("cursor")
            if not cur:
                return FakeResp(200, rpc_ok({"tools": [{"name": "a"}], "nextCursor": "c2"}))
            return FakeResp(200, rpc_ok({"tools": [{"name": "b"}]}))
        return standard()(n, payload, headers)
    c = client(FakeHttp(handler))
    assert [t["name"] for t in c.list_tools()] == ["a", "b"]


def test_tools_list_cached_ten_minutes():
    now = [1000.0]
    http = FakeHttp(standard())
    c = client(http, clock=lambda: now[0])
    c.list_tools()
    now[0] += 599
    c.list_tools()
    assert methods(http).count("tools/list") == 1
    now[0] += 2
    c.list_tools()
    assert methods(http).count("tools/list") == 2


def test_session_lost_reinitializes_once():
    state = {"lost": 1}
    base = standard()

    def handler(n, payload, headers):
        if payload["method"] == "tools/call" and state["lost"]:
            state["lost"] -= 1
            return FakeResp(404, raw="session not found")
        return base(n, payload, headers)
    http = FakeHttp(handler)
    c = client(http)
    assert c.call_tool("x", {})["isError"] is False
    assert methods(http) == ["initialize", "notifications/initialized", "tools/call",
                             "initialize", "notifications/initialized", "tools/call"]

    state["lost"] = 5
    http2 = FakeHttp(handler)
    try:
        client(http2).call_tool("x", {})
    except GitHubMCPError as e:
        assert e.user_message == "GitHub isn't available right now."
    else:
        raise AssertionError("expected GitHubMCPError")
    assert methods(http2).count("initialize") == 2


def test_400_on_session_request_is_session_lost():  # live: a stale Mcp-Session-Id gets 400 text/plain
    state = {"lost": 1}
    base = standard()

    def handler(n, payload, headers):
        if payload["method"] == "tools/call" and state["lost"]:
            state["lost"] -= 1
            return FakeResp(400, raw="Invalid session ID", headers={"Content-Type": "text/plain"})
        return base(n, payload, headers)
    http = FakeHttp(handler)
    c = client(http)
    assert c.call_tool("x", {})["isError"] is False
    assert methods(http) == ["initialize", "notifications/initialized", "tools/call",
                             "initialize", "notifications/initialized", "tools/call"]
    state["lost"] = 5
    try:
        client(FakeHttp(handler)).call_tool("x", {})
    except GitHubMCPError as e:
        assert e.user_message == "GitHub isn't available right now."
    else:
        raise AssertionError("expected GitHubMCPError")


def test_400_without_session_is_not_retried():
    http = FakeHttp(lambda n, p, h: FakeResp(400, raw="bad request"))
    try:
        client(http).list_tools()
    except GitHubMCPError:
        pass
    else:
        raise AssertionError("expected GitHubMCPError")
    assert methods(http) == ["initialize"]


def _outage_client(now):
    state = {"down": False}
    base = standard()

    def handler(n, payload, headers):
        if state["down"] and payload["method"] == "tools/list":
            return requests.Timeout()
        return base(n, payload, headers)
    http = FakeHttp(handler)
    return client(http, clock=lambda: now[0]), http, state


def test_tools_list_outage_serves_last_good_list_and_backs_off():
    now = [1000.0]
    c, http, state = _outage_client(now)
    assert c.list_tools() == [{"name": "get_commit"}]
    state["down"] = True
    now[0] += 700  # cache expired
    slow = lambda: methods(http).count("tools/list")  # noqa: E731
    assert c.list_tools() == [{"name": "get_commit"}] and slow() == 2
    for _ in range(10):  # every turn in the next 5 minutes: no call at all
        now[0] += 29
        assert c.list_tools() == [{"name": "get_commit"}]
    assert slow() == 2
    now[0] += 11  # 300 s after the failure: one more try
    assert c.list_tools() == [{"name": "get_commit"}] and slow() == 3
    state["down"] = False
    now[0] += 301
    assert c.list_tools() == [{"name": "get_commit"}] and slow() == 4
    now[0] += 100  # healthy again: the normal 10-minute cache applies
    c.list_tools()
    assert slow() == 4


def test_token_failure_during_tools_list_also_backs_off():
    now = [1000.0]
    minted = []

    def token():
        minted.append(1)
        if len(minted) > 3:
            raise RuntimeError("token exchange down")
        return TOKEN
    c = GitHubMCPClient(token, http=FakeHttp(standard()), clock=lambda: now[0])
    assert c.list_tools()
    now[0] += 700
    assert c.list_tools() == [{"name": "get_commit"}]
    n = len(minted)
    now[0] += 100
    assert c.list_tools() == [{"name": "get_commit"}] and len(minted) == n


def test_tools_list_outage_without_previous_list_backs_off():
    now = [1000.0]
    c, http, state = _outage_client(now)
    state["down"] = True
    for _ in range(5):
        try:
            c.list_tools()
        except GitHubMCPError as e:
            assert e.user_message == "GitHub didn't respond in time." or "isn't available" in e.user_message
        else:
            raise AssertionError("expected GitHubMCPError")
        now[0] += 50
    assert methods(http).count("tools/list") == 1
    now[0] += 100
    state["down"] = False
    assert c.list_tools() == [{"name": "get_commit"}]


def test_401_refreshes_token_once():
    invalidated = []
    tokens = {"cur": "ghs_OLD" + "a" * 20}
    NEW = "ghs_NEW" + "b" * 20
    base = standard()
    seen = {"n": 0}

    def inval():
        invalidated.append(1)
        tokens["cur"] = NEW

    def handler(n, payload, headers):
        if payload["method"] == "tools/list":
            seen["n"] += 1
            if seen["n"] == 1:
                return FakeResp(401, raw="bad credentials")
        return base(n, payload, headers)
    http = FakeHttp(handler)
    c = GitHubMCPClient(lambda: tokens["cur"], invalidate=inval, http=http)
    assert c.list_tools()
    assert invalidated == [1]
    lists = [x for x in http.calls if x["json"]["method"] == "tools/list"]
    assert lists[0]["headers"]["Authorization"] == "Bearer ghs_OLD" + "a" * 20
    assert lists[1]["headers"]["Authorization"] == f"Bearer {NEW}"

    invalidated.clear()
    c2 = client(FakeHttp(lambda n, p, h: FakeResp(401, raw="no")), invalidate=lambda: invalidated.append(1))
    try:
        c2.list_tools()
    except GitHubMCPError as e:
        assert e.user_message == "GitHub isn't available right now."
        assert TOKEN not in str(e)
    else:
        raise AssertionError("expected GitHubMCPError")
    assert invalidated == [1]


def test_404_on_initialized_notification_is_github_error():
    base = standard()

    def handler(n, payload, headers):
        if payload["method"] == "notifications/initialized":
            return FakeResp(404, raw="gone")
        return base(n, payload, headers)
    for call in (lambda c: c.list_tools(), lambda c: c.call_tool("x", {})):
        try:
            call(client(FakeHttp(handler)))
        except GitHubMCPError as e:
            assert e.user_message == "GitHub isn't available right now."
        else:
            raise AssertionError("expected GitHubMCPError")


def _sse_client(raw_body, request_result_marker="ok"):
    base = standard()

    def handler(n, payload, headers):
        if payload["method"] == "tools/call":
            body = raw_body.replace("__ID__", str(payload["id"]))
            return FakeResp(200, raw=body, headers={"Content-Type": "text/event-stream"})
        return base(n, payload, headers)
    return client(FakeHttp(handler))


def _evt(id_, text):
    return json.dumps({"jsonrpc": "2.0", "id": id_, "result": {"content": [{"type": "text", "text": text}]}})


def test_sse_picks_event_matching_request_id_not_last():
    notif = json.dumps({"jsonrpc": "2.0", "method": "notifications/message", "params": {}})
    other = _evt(9999, "wrong")
    body = "data: " + '{"jsonrpc":"2.0","id":__ID__,"result":{"content":[{"type":"text","text":"right"}]}}' + "\n\n" \
        + f"data: {other}\n\ndata: {notif}\n\n"
    res = _sse_client(body).call_tool("x", {})
    assert res["content"][0]["text"] == "right"


def test_sse_comment_keepalive_and_crlf_and_empty_trailing_data():
    msg = '{"jsonrpc":"2.0","id":__ID__,"result":{"content":[{"type":"text","text":"ok"}]}}'
    body = ": keepalive\r\n\r\nevent: message\r\ndata: " + msg + "\r\n\r\ndata:\r\n\r\n: ping\r\n\r\n"
    assert _sse_client(body).call_tool("x", {})["content"][0]["text"] == "ok"


def test_sse_multiline_data_joined():
    body = 'data: {"jsonrpc":"2.0","id":__ID__,\ndata: "result":{"content":[{"type":"text","text":"multi"}]}}\n\n'
    assert _sse_client(body).call_tool("x", {})["content"][0]["text"] == "multi"


def test_sse_falls_back_to_last_result_when_id_absent():
    body = 'data: {"jsonrpc":"2.0","id":424242,"result":{"content":[{"type":"text","text":"fb"}]}}\n\n' \
           'data: {"jsonrpc":"2.0","method":"notifications/x"}\n\n'
    assert _sse_client(body).call_tool("x", {})["content"][0]["text"] == "fb"


def test_empty_token_does_not_mangle_error_message():
    base = standard()

    def handler(n, payload, headers):
        if payload["method"] == "tools/call":
            return FakeResp(200, {"jsonrpc": "2.0", "id": 3, "error": {"code": -1, "message": "boom"}})
        return base(n, payload, headers)
    try:
        GitHubMCPClient(lambda: "", http=FakeHttp(handler)).call_tool("x", {})
    except GitHubMCPError as e:
        assert str(e) == "boom"
    else:
        raise AssertionError("expected GitHubMCPError")


def test_429_and_5xx_retried_once_then_busy():
    for status in (429, 503):
        base = standard()
        seen = {"n": 0}

        def flaky(n, payload, headers, status=status, base=base, seen=seen):
            if payload["method"] == "tools/call":
                seen["n"] += 1
                if seen["n"] == 1:
                    return FakeResp(status, raw="slow down")
            return base(n, payload, headers)
        assert client(FakeHttp(flaky)).call_tool("x", {})["isError"] is False

        def always(n, payload, headers, status=status, base=base):
            if payload["method"] == "tools/call":
                return FakeResp(status, raw="slow down")
            return base(n, payload, headers)
        http = FakeHttp(always)
        try:
            client(http).call_tool("x", {})
        except GitHubMCPError as e:
            assert e.user_message == "GitHub is busy; try again in a minute."
        else:
            raise AssertionError("expected GitHubMCPError")
        assert methods(http).count("tools/call") == 2


def test_timeout_message():
    http = FakeHttp(lambda n, p, h: requests.Timeout("slow"))
    try:
        client(http).list_tools()
    except GitHubMCPError as e:
        assert e.user_message == "GitHub didn't respond in time."
    else:
        raise AssertionError("expected GitHubMCPError")


def test_connection_error_is_unavailable():
    http = FakeHttp(lambda n, p, h: requests.ConnectionError("boom"))
    try:
        client(http).list_tools()
    except GitHubMCPError as e:
        assert e.user_message == "GitHub isn't available right now."
    else:
        raise AssertionError("expected GitHubMCPError")


def test_jsonrpc_error_returned_to_caller():
    base = standard()

    def handler(n, payload, headers):
        if payload["method"] == "tools/call":
            return FakeResp(200, {"jsonrpc": "2.0", "id": 3, "error": {
                "code": -32602, "message": 'unknown tool "create_issue"'}})
        return base(n, payload, headers)
    try:
        client(FakeHttp(handler)).call_tool("create_issue", {})
    except GitHubMCPError as e:
        assert str(e) == 'unknown tool "create_issue"'
        assert e.code == -32602
        assert TOKEN not in str(e)
    else:
        raise AssertionError("expected GitHubMCPError")


def test_jsonrpc_error_message_echoing_token_is_scrubbed():
    base = standard()

    def handler(n, payload, headers):
        if payload["method"] == "tools/call":
            return FakeResp(200, {"jsonrpc": "2.0", "id": 3, "error": {"code": -1, "message": f"bad {TOKEN}"}})
        return base(n, payload, headers)
    try:
        client(FakeHttp(handler)).call_tool("x", {})
    except GitHubMCPError as e:
        assert TOKEN not in str(e) and TOKEN not in e.user_message
    else:
        raise AssertionError("expected GitHubMCPError")


if __name__ == "__main__":
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_") and callable(v)]
    for t in tests:
        t()
        print(f"ok  {t.__name__}")
    print(f"\nall {len(tests)} passed")
