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


def restrictions(groups=(), users=()):
    return {"read": {"restrictions": {"group": {"results": [{"name": g} for g in groups]},
                                      "user": {"results": [{"accountId": u} for u in users]}}}}


OPEN = restrictions()


def hit(page_id="123", space="LIB", title="Gate counts", excerpt="the @@@hl@@@camera@@@endhl@@@ fix",
        ancestors=("Assessment", "Data"), own=OPEN, ancestor_restrictions=None):
    anc = [{"title": a, "restrictions": (ancestor_restrictions or {}).get(a, OPEN)} for a in ancestors]
    content = {"id": page_id, "type": "page", "title": title,
               "space": {"key": space, "name": "Library" if space == "LIB" else space},
               "ancestors": anc,
               "history": {"lastUpdated": {"when": "2026-10-01T12:00:00.000Z",
                                           "by": {"displayName": "Pat Doe"}}},
               "_links": {"webui": f"/spaces/{space}/pages/{page_id}/Gate+counts"}}
    if own is not None:
        content["restrictions"] = own
    return {"content": content, "title": title, "excerpt": excerpt}


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


def page_routes(page=PAGE, space_key="LIB", own=OPEN, ancestors=({"title": "Home", "restrictions": OPEN},)):
    v1 = {"id": page.get("id"), "ancestors": list(ancestors)}
    if own is not None:
        v1["restrictions"] = own
    return {"/api/v2/pages/": page, "/api/v2/spaces/": {"id": "98", "key": space_key, "name": "Library"},
            "/rest/api/content/": v1}


def test_page_by_id_and_url():
    t, conf, _ = tools(conf_routes=page_routes())
    out = t.get_confluence_page(f"{SITE}/wiki/spaces/LIB/pages/123/Gate+counts")
    v2 = next(c for c in conf.calls if c[1] == "/api/v2/pages/123")
    assert v2[2]["body-format"] == "storage"
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


def test_search_drops_pages_with_their_own_read_restriction():  # review 2026-10-28: IT-only pages
    t, _, _ = tools(conf_routes={"/rest/api/search": search_response([
        hit(), hit("7", title="Staff salaries", own=restrictions(groups=["lib-it-staff"]))])})
    out = t.search_confluence("gate")
    assert "Gate counts" in out and "Staff salaries" not in out


def test_search_drops_pages_under_a_restricted_parent():
    t, _, _ = tools(conf_routes={"/rest/api/search": search_response([
        hit("8", title="Desktop minutes", ancestors=("Home", "LIT Desktop Team"),
            ancestor_restrictions={"LIT Desktop Team": restrictions(users=["acct-1"])})])})
    assert "Desktop minutes" not in t.search_confluence("minutes")
    assert "No Confluence pages" in t.search_confluence("minutes")


def test_search_fails_closed_when_restrictions_are_missing():
    t, _, _ = tools(conf_routes={"/rest/api/search": search_response([hit(own=None)])})
    assert "Gate counts" not in t.search_confluence("gate")
    bare_ancestor = hit()
    bare_ancestor["content"]["ancestors"] = [{"title": "Home"}]
    t2, _, _ = tools(conf_routes={"/rest/api/search": search_response([bare_ancestor])})
    assert "Gate counts" not in t2.search_confluence("gate")


def test_search_asks_for_page_and_parent_restrictions():
    t, conf, _ = tools()
    t.search_confluence("gate")
    exp = conf.last_params()["expand"].split(",")
    for e in ("content.restrictions.read.restrictions.group", "content.restrictions.read.restrictions.user",
              "content.ancestors.restrictions.read.restrictions.group",
              "content.ancestors.restrictions.read.restrictions.user"):
        assert e in exp


def test_restricted_page_refused_without_its_body():
    secret = {**PAGE, "body": {"storage": {"value": "<p>SECRET BODY</p>"}}}
    for routes in (page_routes(secret, own=restrictions(groups=["lb-it-development"])),
                   page_routes(secret, ancestors=({"title": "Team", "restrictions": restrictions(users=["a"])},)),
                   page_routes(secret, own=None)):
        t, conf, _ = tools(conf_routes=routes)
        out = t.get_confluence_page("123")
        assert out == "That page isn't available to Hoo Helper.", out
        assert "SECRET BODY" not in out
        assert not any(c[1] == "/api/v2/pages/123" for c in conf.calls)  # body never fetched


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


# ---- Jira ----------------------------------------------------------------------

import io  # noqa: E402
import logging  # noqa: E402

ISSUE_ROW = {"key": "LIB-12", "fields": {"summary": "Clemons camera offline", "status": {"name": "In Progress"},
                                         "assignee": {"displayName": "Pat Doe"},
                                         "updated": "2026-10-15T10:00:00.000-0400",
                                         "issuetype": {"name": "Bug"}, "priority": {"name": "High"}}}
ME = [{"accountId": "557058:acc-123", "displayName": "Pat Doe", "active": True, "accountType": "atlassian"}]


def jira_routes(issues=None, users=None):
    return {"/rest/api/3/search/jql": {"issues": [ISSUE_ROW] if issues is None else issues},
            "/rest/api/3/user/search": ME if users is None else users}


def test_jira_jql_built_and_constrained():  # RF3
    t, _, jira = tools(jira_routes=jira_routes())
    t.search_jira(text='camera "door" ORDER BY x', status="open", updated_after="2026-10-01")
    body = jira.calls[-1][2]
    assert body["jql"] == ('project IN ("LIB") AND text ~ "camera \\"door\\" ORDER BY x" '
                           'AND statusCategory != Done AND updated >= "2026-10-01" ORDER BY updated DESC')
    assert body["maxResults"] == 10 and "summary" in body["fields"]


def test_jira_status_done_and_named_and_type():
    t, _, jira = tools(jira_routes=jira_routes())
    t.search_jira(status="done", issue_type="Bug", created_after="2026-01-01")
    assert 'statusCategory = Done AND issuetype = "Bug" AND created >= "2026-01-01"' in jira.calls[-1][2]["jql"]
    t.search_jira(status="In Review")
    assert 'status = "In Review"' in jira.calls[-1][2]["jql"]


def test_assignee_me_uses_email_lookup_and_never_shows_email():
    buf = io.StringIO()
    handler = logging.StreamHandler(buf)
    log = logging.getLogger("atlassian_tools")
    log.addHandler(handler)
    log.setLevel(logging.DEBUG)
    try:
        t, _, jira = tools(jira_routes=jira_routes())
        out = t.search_jira(assignee="me")
    finally:
        log.removeHandler(handler)
    lookup = [c for c in jira.calls if c[1] == "/rest/api/3/user/search"][0]
    assert lookup[2]["query"] == "pat@virginia.edu"
    assert 'assignee = "557058:acc-123"' in out
    assert "pat@virginia.edu" not in out
    assert "pat@virginia.edu" not in buf.getvalue() and "atlassian_me=matched" in buf.getvalue()


def test_me_unmatched_copy():
    t, _, jira = tools(jira_routes=jira_routes(users=[]))
    assert t.search_jira(assignee="me") == "I couldn't match your Slack account to a Jira account."
    t2, _, jira2 = tools(jira_routes=jira_routes(), users={"U1": {"real_name": "No Email", "profile": {}}})
    assert t2.search_jira(assignee="me") == "I couldn't match your Slack account to a Jira account."
    assert not [c for c in jira2.calls if c[1] == "/rest/api/3/search/jql"]


def test_me_requires_a_single_or_exact_email_match():  # review: fuzzy user/search took users[0]
    two = [{"accountId": "x1", "displayName": "Pat Doe-Smith", "active": True, "emailAddress": "pat@virginia.edu.old"},
           {"accountId": "x2", "displayName": "Pat Doe", "active": True, "emailAddress": "PAT@virginia.edu"}]
    t, _, _ = tools(jira_routes=jira_routes(users=two))
    assert 'assignee = "x2"' in t.search_jira(assignee="me")
    hidden = [{"accountId": "y1", "displayName": "A", "active": True}, {"accountId": "y2", "displayName": "B", "active": True}]
    t2, _, _ = tools(jira_routes=jira_routes(users=hidden))
    assert t2.search_jira(assignee="me") == "I couldn't match your Slack account to a Jira account."


def test_display_name_lookup_and_ambiguity():
    two = [{"accountId": "a1", "displayName": "Pat Doe", "active": True},
           {"accountId": "a2", "displayName": "Pat Smith", "active": True}]
    t, _, jira = tools(jira_routes=jira_routes(users=two))
    assert t.search_jira(reporter="Pat") == 'More than one person matches "Pat": Pat Doe, Pat Smith. Which one?'
    out = t.search_jira(reporter="Pat Smith")
    assert 'reporter = "a2"' in out
    t2, _, _ = tools(jira_routes=jira_routes(users=[]))
    assert t2.search_jira(assignee="Nobody") == 'I couldn\'t find a Jira user named "Nobody".'


def test_disallowed_project_refused_without_http():
    t, _, jira = tools(jira_routes=jira_routes())
    assert t.search_jira(project="hr") == "That isn't in the Library's Jira projects (allowed: LIB)."
    assert t.get_jira_issue("HR-4") == "That isn't in the Library's Jira projects (allowed: LIB)."
    assert jira.calls == []


def test_results_outside_allow_list_dropped():  # RF1
    other = {"key": "HR-7", "fields": {"summary": "Payroll", "status": {"name": "Open"}}}
    t, _, _ = tools(jira_routes=jira_routes(issues=[ISSUE_ROW, other]))
    out = t.search_jira(text="camera")
    assert "LIB-12" in out and "HR-7" not in out and "Payroll" not in out


def test_search_output_table_links_and_jql():
    t, _, _ = tools(jira_routes=jira_routes())
    out = t.search_jira(text="camera")
    assert "| Key | Summary | Status | Assignee | Updated |" in out
    assert "| LIB-12 | Clemons camera offline | In Progress | Pat Doe | 2026-10-15 |" in out
    assert "LIB-12 — https://virginia-its.atlassian.net/browse/LIB-12" in out
    assert "JQL: project IN" in out
    t2, _, _ = tools(jira_routes=jira_routes(issues=[]))
    assert "No Jira issues" in t2.search_jira(text="zebra")


ADF = {"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Door 3 camera reboots."}]}]}
ISSUE = {"key": "LIB-12", "fields": {
    "summary": "Clemons camera offline", "issuetype": {"name": "Bug"}, "status": {"name": "In Progress"},
    "priority": {"name": "High"}, "assignee": {"displayName": "Pat Doe"}, "reporter": {"displayName": "Jordan Lee"},
    "created": "2026-10-01T09:00:00.000-0400", "updated": "2026-10-15T10:00:00.000-0400",
    "labels": ["cameras"], "components": [{"name": "Occupancy"}], "description": ADF,
    "issuelinks": [{"type": {"outward": "blocks"}, "outwardIssue": {"key": "LIB-9", "fields": {"summary": "Gate report"}}}]}}
COMMENTS = {"comments": [{"author": {"displayName": "Jordan Lee"}, "created": "2026-10-14T08:00:00.000-0400",
                          "body": {"type": "doc", "content": [{"type": "paragraph", "content": [
                              {"type": "text", "text": "Replaced the power supply."}]}]}}]}


def test_issue_details_comments_links():
    t, _, jira = tools(jira_routes={"/rest/api/3/issue/LIB-12/comment": COMMENTS, "/rest/api/3/issue/LIB-12": ISSUE})
    out = t.get_jira_issue("lib-12")
    for s in ("LIB-12", "Clemons camera offline", "In Progress", "High", "Pat Doe", "Jordan Lee",
              "Door 3 camera reboots.", "Replaced the power supply.", "blocks LIB-9", "cameras", "Occupancy",
              "https://virginia-its.atlassian.net/browse/LIB-12"):
        assert s in out, s
    comment_call = [c for c in jira.calls if c[1].endswith("/comment")][0]
    assert comment_call[2]["orderBy"] == "-created" and comment_call[2]["maxResults"] == 10


def test_issue_missing_assignee_description_render():  # RF4
    bare = {"key": "LIB-3", "fields": {"summary": "Bare", "status": {"name": "Open"}}}
    t, _, _ = tools(jira_routes={"/rest/api/3/issue/LIB-3/comment": {}, "/rest/api/3/issue/LIB-3": bare})
    out = t.get_jira_issue("LIB-3")
    assert "Unassigned" in out and "(no description)" in out


def test_moved_issue_outside_allow_list_refused():  # review: Jira follows moved issues
    moved = {"key": "ITS-999", "fields": {**ISSUE["fields"], "summary": "SECRET MOVED",
                                           "project": {"key": "ITS"}}}
    t, _, _ = tools(jira_routes={"/rest/api/3/issue/LIB-5/comment": COMMENTS, "/rest/api/3/issue/LIB-5": moved})
    out = t.get_jira_issue("LIB-5")
    assert out == "That isn't in the Library's Jira projects (allowed: LIB)."
    assert "SECRET MOVED" not in out


def test_issue_moved_within_library_uses_returned_key():
    moved = {"key": "LIB-77", "fields": {**ISSUE["fields"], "project": {"key": "LIB"}}}
    t, _, _ = tools(jira_routes={"/rest/api/3/issue/LIB-77/comment": COMMENTS, "/rest/api/3/issue/LIB-5": moved})
    out = t.get_jira_issue("LIB-5")
    assert out.startswith("# LIB-77:") and "browse/LIB-77" in out


def test_bad_issue_key():
    t, _, jira = tools()
    assert "issue key" in t.get_jira_issue("camera")
    assert jira.calls == []


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
    test_jira_jql_built_and_constrained()
    test_jira_status_done_and_named_and_type()
    test_assignee_me_uses_email_lookup_and_never_shows_email()
    test_me_unmatched_copy()
    test_me_requires_a_single_or_exact_email_match()
    test_display_name_lookup_and_ambiguity()
    test_disallowed_project_refused_without_http()
    test_results_outside_allow_list_dropped()
    test_search_output_table_links_and_jql()
    test_issue_details_comments_links()
    test_issue_missing_assignee_description_render()
    test_moved_issue_outside_allow_list_refused()
    test_issue_moved_within_library_uses_returned_key()
    test_bad_issue_key()
    print("ok")
