#!/usr/bin/env python3
"""Atlassian REST client: config, base URLs, auth, retries, error copy (fake HTTP, no network)."""

import io
import logging
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

import requests  # noqa: E402

from atlassian_client import (  # noqa: E402
    AtlassianClient,
    AtlassianConfig,
    AtlassianError,
    confluence_link,
    jira_link,
    quote,
)

SITE = "https://virginia-its.atlassian.net"
CLOUD = "c417cfa5-aa30-4f3f-be7e-968c5845b5e9"


def cfg(token_type="scoped", spaces=("LIB",), projects=("LIB",), email="svc@virginia.edu", token="tok-SECRET"):
    return AtlassianConfig(site=SITE, cloud_id=CLOUD, token_type=token_type, email=email, token=token,
                           confluence_spaces=list(spaces), jira_projects=list(projects))


class FakeResponse:
    def __init__(self, status=200, data=None, headers=None):
        self.status_code = status
        self._data = data if data is not None else {}
        self.headers = headers or {}

    def json(self):
        return self._data


class FakeSession:
    def __init__(self, responses=None, raise_exc=None):
        self.responses = list(responses or [FakeResponse()])
        self.raise_exc = raise_exc
        self.calls = []

    def request(self, method, url, **kw):
        self.calls.append((method, url, kw))
        if self.raise_exc:
            raise self.raise_exc
        return self.responses.pop(0) if len(self.responses) > 1 else self.responses[0]


def capture_logs():
    buf = io.StringIO()
    handler = logging.StreamHandler(buf)
    log = logging.getLogger("atlassian_client")
    log.addHandler(handler)
    log.setLevel(logging.DEBUG)
    return buf, lambda: log.removeHandler(handler)


def test_base_urls_classic_and_scoped():
    c = cfg(token_type="classic")
    assert c.confluence_base == "https://virginia-its.atlassian.net/wiki"
    assert c.jira_base == "https://virginia-its.atlassian.net"
    s = cfg(token_type="scoped")
    assert s.confluence_base == f"https://api.atlassian.com/ex/confluence/{CLOUD}/wiki"
    assert s.jira_base == f"https://api.atlassian.com/ex/jira/{CLOUD}"
    assert jira_link(s, "LIB-1") == "https://virginia-its.atlassian.net/browse/LIB-1"
    assert confluence_link(s, "/spaces/LIB/pages/1/Gate") == "https://virginia-its.atlassian.net/wiki/spaces/LIB/pages/1/Gate"


def test_from_env_requires_allow_lists():
    env = {"CONFLUENCE_SPACES": "lib, ,dev", "JIRA_PROJECTS": "", "ATLASSIAN_SITE": SITE + "/",
           "ATLASSIAN_CLOUD_ID": CLOUD, "ATLASSIAN_TOKEN_TYPE": "classic"}
    c = AtlassianConfig.from_env(env, email="e@x", token="t")
    assert c.confluence_spaces == ["LIB", "DEV"] and c.confluence_enabled and not c.jira_enabled
    assert c.site == SITE and c.token_type == "classic"
    assert not AtlassianConfig.from_env({"CONFLUENCE_SPACES": "LIB"}, email="", token="").confluence_enabled
    assert AtlassianConfig.from_env({}, email="e", token="t").token_type == "scoped"


def test_quote_escapes():  # RF3
    assert quote('a "b" \\ c') == '"a \\"b\\" \\\\ c"'


def test_basic_auth_and_timeout_sent():
    session = FakeSession([FakeResponse(200, {"ok": 1})])
    client = AtlassianClient(cfg(), product="jira", session=session)
    assert client.post("/rest/api/3/search/jql", {"jql": "x"}) == {"ok": 1}
    method, url, kw = session.calls[0]
    assert method == "POST" and url == f"https://api.atlassian.com/ex/jira/{CLOUD}/rest/api/3/search/jql"
    assert kw["auth"] == ("svc@virginia.edu", "tok-SECRET") and kw["timeout"] == 10
    assert kw["json"] == {"jql": "x"}


def test_401_and_403_copy_and_log():  # RF5
    for status in (401, 403):
        session = FakeSession([FakeResponse(status)])
        buf, done = capture_logs()
        try:
            AtlassianClient(cfg(), product="jira", session=session).get("/rest/api/3/issue/LIB-1")
            raise AssertionError("no error")
        except AtlassianError as e:
            assert e.user_message == "Jira isn't available right now."
        finally:
            done()
        assert "auth_failed source=atlassian" in buf.getvalue()
        assert len(session.calls) == 1
    try:
        AtlassianClient(cfg(), product="confluence", session=FakeSession([FakeResponse(401)])).get("/x")
    except AtlassianError as e:
        assert e.user_message == "Confluence isn't available right now."


def test_429_retried_once_then_busy():
    slept = []
    session = FakeSession([FakeResponse(429, headers={"Retry-After": "2"}), FakeResponse(200, {"ok": 1})])
    assert AtlassianClient(cfg(), product="jira", session=session, sleep=slept.append).get("/x") == {"ok": 1}
    assert slept == [2]
    session = FakeSession([FakeResponse(429, headers={"Retry-After": "60"}), FakeResponse(429)])
    slept = []
    try:
        AtlassianClient(cfg(), product="jira", session=session, sleep=slept.append).get("/x")
        raise AssertionError("no error")
    except AtlassianError as e:
        assert e.user_message == "Jira is busy, try again in a minute."
    assert slept == [5] and len(session.calls) == 2


def test_timeout_is_busy_copy():
    session = FakeSession(raise_exc=requests.Timeout("slow"))
    try:
        AtlassianClient(cfg(), product="confluence", session=session).get("/x")
        raise AssertionError("no error")
    except AtlassianError as e:
        assert e.user_message == "Confluence is busy, try again in a minute."


def test_other_http_errors_plain_sentence():
    try:
        AtlassianClient(cfg(), product="jira", session=FakeSession([FakeResponse(500)])).get("/x")
    except AtlassianError as e:
        assert e.user_message == "Jira didn't respond as expected (HTTP 500)."


def test_400_passes_on_atlassians_reason():  # review: one bad key broke every search silently
    resp = FakeResponse(400, {"errorMessages": ["The value 'TYPO' does not exist for the field 'project'."],
                              "errors": {}})
    try:
        AtlassianClient(cfg(), product="jira", session=FakeSession([resp])).post("/rest/api/3/search/jql", {})
        raise AssertionError("no error")
    except AtlassianError as e:
        assert e.user_message == "Jira rejected the request: The value 'TYPO' does not exist for the field 'project'."
    resp = FakeResponse(400, {"message": "Could not parse cql : siteSearch ~"})
    try:
        AtlassianClient(cfg(), product="confluence", session=FakeSession([resp])).get("/rest/api/search")
    except AtlassianError as e:
        assert e.user_message == "Confluence rejected the request: Could not parse cql : siteSearch ~"
    resp = FakeResponse(400, {"errors": {"issuetype": "Issue type 'Ticket' does not exist."}})
    try:
        AtlassianClient(cfg(), product="jira", session=FakeSession([resp])).post("/x", {})
    except AtlassianError as e:
        assert e.user_message == "Jira rejected the request: Issue type 'Ticket' does not exist."


def test_separate_tokens_per_product():  # Atlassian issues one scoped token per app
    c = AtlassianConfig.from_env({"CONFLUENCE_SPACES": "LIB", "JIRA_PROJECTS": "LIB"}, email="svc@x",
                                 token="", jira_token="jira-tok", confluence_token="")
    assert c.jira_enabled and not c.confluence_enabled
    assert c.token_for("jira") == "jira-tok"
    session = FakeSession([FakeResponse(200, {})])
    AtlassianClient(c, product="jira", session=session).get("/x")
    assert session.calls[0][2]["auth"] == ("svc@x", "jira-tok")
    both = AtlassianConfig.from_env({"CONFLUENCE_SPACES": "LIB", "JIRA_PROJECTS": "LIB"}, email="svc@x",
                                    token="shared", confluence_token="conf-tok")
    assert both.token_for("confluence") == "conf-tok" and both.token_for("jira") == "shared"
    assert both.confluence_enabled and both.jira_enabled


def test_token_never_logged():
    buf, done = capture_logs()
    try:
        for status in (200, 401, 429, 500):
            try:
                AtlassianClient(cfg(), product="jira", session=FakeSession([FakeResponse(status)]),
                                sleep=lambda s: None).get("/x")
            except AtlassianError:
                pass
    finally:
        done()
    assert "tok-SECRET" not in buf.getvalue()


if __name__ == "__main__":
    test_base_urls_classic_and_scoped()
    test_from_env_requires_allow_lists()
    test_quote_escapes()
    test_basic_auth_and_timeout_sent()
    test_401_and_403_copy_and_log()
    test_429_retried_once_then_busy()
    test_timeout_is_busy_copy()
    test_other_http_errors_plain_sentence()
    test_400_passes_on_atlassians_reason()
    test_separate_tokens_per_product()
    test_token_never_logged()
    print("ok")
