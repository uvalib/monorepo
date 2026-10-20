#!/usr/bin/env python3
"""Confluence and Jira tools: query building, allow-lists, formatting (fake API, no network)."""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from atlassian_client import AtlassianConfig, AtlassianError  # noqa: E402
from atlassian_tools import (  # noqa: E402
    TOOL_GET_ISSUE,
    TOOL_GET_PAGE,
    TOOL_SEARCH_CONFLUENCE,
    TOOL_SEARCH_JIRA,
    AtlassianTools,
    _reset_cache as _reset_atlassian_cache,
)
from identity import UserDirectory, _reset_cache  # noqa: E402

SITE = "https://virginia-its.atlassian.net"


class FakeApi:
    """Stands in for AtlassianClient: routes by path; records calls."""

    def __init__(self, routes=None, error=None):
        self.routes = routes or {}
        self.error = error
        self.calls = []

    def _answer(self, method, path, payload):
        self.calls.append((method, path, payload))
        if self.error:
            raise AtlassianError(self.error)
        for prefix, value in self.routes.items():
            if path == prefix or path.startswith(prefix):
                return value(payload) if callable(value) else value
        return {}

    def get(self, path, params=None):
        return self._answer("GET", path, params or {})

    def post(self, path, json):
        return self._answer("POST", path, json)

    def last_params(self):
        return self.calls[-1][2]


class FakeSlack:
    def __init__(self, users):
        self.users = users

    def users_info(self, user):
        return {"user": {"id": user, **self.users[user]}}

    def users_list(self, cursor=None, limit=200):
        return {"members": [], "response_metadata": {"next_cursor": ""}}


def hit(page_id="123", space="LIB", title="Gate counts", excerpt="the @@@hl@@@camera@@@endhl@@@ fix",
        ancestors=("Assessment", "Data")):
    return {"content": {"id": page_id, "type": "page", "title": title,
                        "space": {"key": space, "name": "Library" if space == "LIB" else space},
                        "ancestors": [{"title": a} for a in ancestors],
                        "history": {"lastUpdated": {"when": "2026-10-01T12:00:00.000Z",
                                                    "by": {"displayName": "Pat Doe"}}},
                        "_links": {"webui": f"/spaces/{space}/pages/{page_id}/Gate+counts"}},
            "title": title, "excerpt": excerpt}


def search_response(hits, total=None):
    return {"results": hits, "start": 0, "limit": 5, "size": len(hits),
            "totalSize": len(hits) if total is None else total}


def tools(spaces=("LIB", "DEV"), projects=("LIB",), conf_routes=None, jira_routes=None, conf_error=None,
          jira_error=None, users=None, asker="U1"):
    _reset_cache()
    _reset_atlassian_cache()
    cfg = AtlassianConfig(site=SITE, cloud_id="c", token_type="scoped", email="svc@x", token="t",
                          confluence_spaces=list(spaces), jira_projects=list(projects))
    conf = FakeApi(conf_routes or {"/rest/api/search": search_response([hit()])}, error=conf_error)
    jira = FakeApi(jira_routes or {}, error=jira_error)
    slack = FakeSlack(users or {"U1": {"real_name": "Pat Doe", "profile": {"email": "pat@virginia.edu"}}})
    t = AtlassianTools(cfg, asker_id=asker, directory=UserDirectory(slack), confluence=conf, jira=jira)
    return t, conf, jira


# ---- Confluence ----------------------------------------------------------------

def test_confluence_cql_is_built_and_constrained():  # RF3
    t, conf, _ = tools()
    t.search_confluence('gate "count" OR x', space="lib", updated_after="2026-09-01")
    cql = conf.last_params()["cql"]
    assert cql == ('siteSearch ~ "gate \\"count\\" OR x" AND type = page AND space IN ("LIB", "DEV") '
                   'AND space = "LIB" AND lastmodified >= "2026-09-01"')


def test_confluence_label_and_paging_params():
    t, conf, _ = tools()
    t.search_confluence("hours", label="policy", limit=3, page=2)
    p = conf.last_params()
    assert p["cql"].endswith('AND label = "policy"')
    assert p["limit"] == 3 and p["start"] == 3


def test_disallowed_space_refused_without_http():
    t, conf, _ = tools()
    assert t.search_confluence("x", space="HR") == "That isn't in the Library's Confluence spaces (allowed: LIB, DEV)."
    assert conf.calls == []


def test_bad_date_is_plain_sentence():
    t, conf, _ = tools()
    assert "YYYY-MM-DD" in t.search_confluence("x", updated_after="last week")
    assert conf.calls == []


def test_hits_outside_allow_list_dropped():  # RF1
    t, _, _ = tools(conf_routes={"/rest/api/search": search_response([hit(), hit("9", space="HR", title="Payroll")])})
    out = t.search_confluence("gate")
    assert "Gate counts" in out and "Payroll" not in out


def test_hit_formatting_title_space_breadcrumb_excerpt_link():
    t, _, _ = tools()
    out = t.search_confluence("gate")
    assert "Gate counts" in out and "Library (LIB)" in out
    assert "Assessment › Data" in out
    assert "the camera fix" in out and "@@@" not in out
    assert "Pat Doe" in out and "2026-10-01" in out
    assert f"{SITE}/wiki/spaces/LIB/pages/123/Gate+counts" in out
    assert "page_id 123" in out


def test_more_results_hint_and_no_results():
    t, _, _ = tools(conf_routes={"/rest/api/search": search_response([hit()], total=12)})
    assert "More results: page 2." in t.search_confluence("gate")
    t2, _, _ = tools(conf_routes={"/rest/api/search": search_response([])})
    assert "No Confluence pages" in t2.search_confluence("zebra")


PAGE = {"id": "123", "title": "Gate counts", "spaceId": "98",
        "body": {"storage": {"value": "<h2>Method</h2><p>" + "word " * 40 + "</p>"}},
        "_links": {"webui": "/spaces/LIB/pages/123/Gate+counts"}}


def page_routes(page=PAGE, space_key="LIB"):
    return {"/api/v2/pages/": page, "/api/v2/spaces/": {"id": "98", "key": space_key, "name": "Library"}}


def test_page_by_id_and_url():
    t, conf, _ = tools(conf_routes=page_routes())
    out = t.get_confluence_page(f"{SITE}/wiki/spaces/LIB/pages/123/Gate+counts")
    assert conf.calls[0][1] == "/api/v2/pages/123"
    assert conf.calls[0][2]["body-format"] == "storage"
    assert "# Gate counts" in out and "## Method" in out
    assert f"{SITE}/wiki/spaces/LIB/pages/123/Gate+counts" in out
    assert "Gate counts" in t.get_confluence_page("123")


def test_page_by_url_other_space_refused():  # RF2
    page = {**PAGE, "body": {"storage": {"value": "<p>SECRET BODY</p>"}}}
    t, _, _ = tools(conf_routes=page_routes(page, space_key="HR"))
    out = t.get_confluence_page(f"{SITE}/wiki/spaces/HR/pages/123/Pay")
    assert out == "That isn't in the Library's Confluence spaces (allowed: LIB, DEV)."
    assert "SECRET BODY" not in out


def test_page_chunking_and_continue_hint():
    t, _, _ = tools(conf_routes=page_routes())
    first = t.get_confluence_page("123", max_chars=60)
    assert "continues — call again with offset=60" in first
    second = t.get_confluence_page("123", max_chars=60, offset=60)
    assert "word" in second


def test_page_missing_fields_render():  # RF4
    t, _, _ = tools(conf_routes=page_routes({"id": "5", "spaceId": "98"}))
    out = t.get_confluence_page("5")
    assert "Untitled page" in out and "(This page has no text.)" in out


def test_page_bad_reference():
    t, conf, _ = tools()
    assert "page id" in t.get_confluence_page("not a page")
    assert conf.calls == []


def test_specs_only_for_enabled_products():
    t, _, _ = tools(spaces=("LIB",), projects=())
    assert [s["toolSpec"]["name"] for s in t.tool_specs()] == [TOOL_SEARCH_CONFLUENCE, TOOL_GET_PAGE]
    t2, _, _ = tools(spaces=(), projects=("LIB",))
    assert [s["toolSpec"]["name"] for s in t2.tool_specs()] == [TOOL_SEARCH_JIRA, TOOL_GET_ISSUE]
    assert t2.handles(TOOL_SEARCH_JIRA) and not t2.handles(TOOL_SEARCH_CONFLUENCE)


def test_errors_are_plain_sentences():
    t, _, _ = tools(conf_error="Confluence isn't available right now.")
    assert t.call(TOOL_SEARCH_CONFLUENCE, {"query": "x"}) == "Confluence isn't available right now."
    assert t.call(TOOL_GET_PAGE, {"page_id_or_url": "123"}) == "Confluence isn't available right now."


def test_call_dispatch_and_no_tool_error_prefix():
    t, _, _ = tools()
    out = t.call(TOOL_SEARCH_CONFLUENCE, {"query": "gate"})
    assert "Gate counts" in out and not out.startswith("Tool Error")


if __name__ == "__main__":
    test_confluence_cql_is_built_and_constrained()
    test_confluence_label_and_paging_params()
    test_disallowed_space_refused_without_http()
    test_bad_date_is_plain_sentence()
    test_hits_outside_allow_list_dropped()
    test_hit_formatting_title_space_breadcrumb_excerpt_link()
    test_more_results_hint_and_no_results()
    test_page_by_id_and_url()
    test_page_by_url_other_space_refused()
    test_page_chunking_and_continue_hint()
    test_page_missing_fields_render()
    test_page_bad_reference()
    test_specs_only_for_enabled_products()
    test_errors_are_plain_sentences()
    test_call_dispatch_and_no_tool_error_prefix()
    print("ok")
