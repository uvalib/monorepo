# Hoo Helper Confluence and Jira Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoo Helper can search and read Confluence pages and Jira issues (live REST, read-only, Library spaces/projects only), including "assigned to me".

**Architecture:** Three new modules: `atlassian_format.py` (Confluence storage → markdown, Jira ADF → text), `atlassian_client.py` (config, auth, base URLs, HTTP + error mapping, human links), `atlassian_tools.py` (the four tools, query builders, allow-list checks, "me" lookup). A small `local_tools.py` combiner lets the agent receive Slack and Atlassian tools together. Wired in `app.handle_user_query` behind `EnableAtlassian`.

**Tech Stack:** Python 3.12, `requests`, slack-bolt, AWS SAM (SSM SecureString).

**Spec:** `apps/slack-bot-hoo-help/docs/superpowers/specs/2026-10-20-hoohelp-atlassian-tools-design.md`

## Global Constraints

- Branch `hoohelp-atlassian` in the monorepo. Commit **only explicit paths** under `apps/slack-bot-hoo-help/`; never `git add -A`, never `git stash`.
- Tests are plain scripts, pytest-compatible, with a `__main__` block that calls each test then prints `ok` (see `test_slack_search.py`). Run: `AWS_REGION=us-east-1 $V test_<name>.py` with the scratchpad venv (`python3 -m venv $V && $V/bin/pip -q install boto3 -r requirements.txt`). No network in unit tests: HTTP goes through a fake session object with `request(method, url, **kw)`.
- Site `https://virginia-its.atlassian.net`; cloud id `c417cfa5-aa30-4f3f-be7e-968c5845b5e9`.
- Base URLs — classic: Confluence `https://virginia-its.atlassian.net/wiki`, Jira `https://virginia-its.atlassian.net`; scoped: Confluence `https://api.atlassian.com/ex/confluence/<cloudId>/wiki`, Jira `https://api.atlassian.com/ex/jira/<cloudId>`. Human links always use the site URL (`/wiki…`, `/browse/KEY-1`).
- Auth: HTTP Basic `email:token` for both token types.
- SSM: `/hoohelp/atlassian/email`, `/hoohelp/atlassian/api-token`. Env: `ATLASSIAN_SITE`, `ATLASSIAN_CLOUD_ID`, `ATLASSIAN_TOKEN_TYPE` (`classic`|`scoped`, default `scoped`), `CONFLUENCE_SPACES`, `JIRA_PROJECTS` (comma-separated keys), `ENABLE_ATLASSIAN` (default `false`).
- Allow-lists are **required**: an empty list means that product's tools are not offered. Every CQL/JQL query is constrained to the allow-list; pages/issues outside it are refused even if the API returns them.
- The model never writes CQL/JQL. String values are escaped: `\` → `\\`, `"` → `\"`.
- Never log or output the API token or the asker's email. Logs may say `atlassian_me=matched|unmatched`, `auth_failed source=atlassian`.
- 10 s timeouts; 429 retried once after `Retry-After` (capped at 5 s).
- Exact copy: busy → `Confluence is busy, try again in a minute.` / `Jira is busy, try again in a minute.`; 401/403 → `Confluence isn't available right now.` / `Jira isn't available right now.`; me unmatched → `I couldn't match your Slack account to a Jira account.`; outside allow-list → `That isn't in the Library's Confluence spaces (allowed: A, B).` / `That isn't in the Library's Jira projects (allowed: X, Y).`
- No result text starts with "Tool Error:"; no stack traces.

## Review Focus

1. A Confluence search hit or Jira result whose space/project isn't allowed slips through because the API ignores the filter — results must be filtered again in code.
2. A page URL from another space (`/wiki/spaces/OTHER/pages/123/...`) passed to `get_confluence_page` — refused before the body is returned.
3. Query text containing `"`, `\`, `AND`, `OR`, `ORDER BY` — must stay inside the quoted literal (no query injection).
4. Missing or empty fields in API responses (no assignee, no description, deleted user, no ancestors) — output still renders.
5. Token rejected at runtime (401) — plain sentence, `auth_failed` logged once per call, no retry storm.

Each has its test in the owning task (marked **RF1–RF5**).

---

### Task 1: Converters

**Files:** Create `src/atlassian_format.py`; Test `test_atlassian_format.py`

**Interfaces — Produces:**
- `storage_to_markdown(xhtml: str, *, site: str) -> str`
- `adf_to_text(doc: Optional[dict]) -> str`
- `strip_highlight(text: str) -> str` — removes Confluence `@@@hl@@@` / `@@@endhl@@@` markers.

- [ ] **Step 1: Failing tests**

```python
def test_storage_headings_lists_links_tables():
    md = storage_to_markdown('<h2>Hours</h2><p>See <a href="/wiki/spaces/LIB/pages/1">this</a>.</p>'
                             '<ul><li>One</li><li>Two</li></ul>'
                             '<table><tr><th>Day</th><th>Open</th></tr><tr><td>Mon</td><td>8</td></tr></table>',
                             site="https://virginia-its.atlassian.net")
    assert "## Hours" in md and "- One" in md and "- Two" in md
    assert "[this](https://virginia-its.atlassian.net/wiki/spaces/LIB/pages/1)" in md
    assert "| Day | Open |" in md and "| Mon | 8 |" in md

def test_storage_macros_keep_text_drop_markup():
    md = storage_to_markdown('<ac:structured-macro ac:name="info"><ac:rich-text-body><p>Note this</p>'
                             '</ac:rich-text-body></ac:structured-macro>', site="https://x")
    assert "Note this" in md and "ac:" not in md

def test_adf_paragraphs_lists_mentions():
    doc = {"type": "doc", "content": [
        {"type": "paragraph", "content": [{"type": "text", "text": "Camera "},
                                          {"type": "mention", "attrs": {"text": "@Pat Doe"}}]},
        {"type": "bulletList", "content": [{"type": "listItem", "content": [
            {"type": "paragraph", "content": [{"type": "text", "text": "reboot"}]}]}]}]}
    assert adf_to_text(doc) == "Camera @Pat Doe\n- reboot"

def test_adf_none_and_unknown_nodes():          # RF4
    assert adf_to_text(None) == ""
    assert adf_to_text({"type": "doc", "content": [{"type": "mystery", "content": [{"type": "text", "text": "x"}]}]}) == "x"

def test_strip_highlight():
    assert strip_highlight("the @@@hl@@@camera@@@endhl@@@ fix") == "the camera fix"
```

- [ ] **Step 2: Run** → `ModuleNotFoundError`.
- [ ] **Step 3: Implement** with `html.parser.HTMLParser` (stdlib; no new dependency). Unknown tags contribute their text. Collapse runs of blank lines.
- [ ] **Step 4: Run** → `ok`.
- [ ] **Step 5: Commit** both files: `feat(hoohelp): Confluence storage and Jira ADF converters`.

### Task 2: Atlassian client

**Files:** Create `src/atlassian_client.py`; Test `test_atlassian_client.py`

**Interfaces — Produces:**
- `@dataclass AtlassianConfig: site: str; cloud_id: str; token_type: str; email: str; token: str; confluence_spaces: List[str]; jira_projects: List[str]`
  - `AtlassianConfig.from_env(env=os.environ, *, email: str, token: str) -> AtlassianConfig` (keys upper-cased, blanks dropped)
  - properties `confluence_base`, `jira_base` (per Global Constraints), `confluence_enabled` (credentials + non-empty spaces), `jira_enabled`.
- `confluence_link(cfg, webui_path: str) -> str` → `site + "/wiki" + path`; `jira_link(cfg, key) -> str` → `site + "/browse/" + key`.
- `quote(value: str) -> str` → `"` + escaped + `"`.
- `class AtlassianError(Exception)` with `.user_message: str`.
- `class AtlassianClient(cfg, *, product: str, session=None, sleep=time.sleep)` (`product` is `"confluence"` or `"jira"`); `.get(path, params=None) -> dict`, `.post(path, json) -> dict`. Raises `AtlassianError` with the exact copy for 401/403/429/timeout; other HTTP errors → `"<Product> didn't respond as expected (HTTP <code>)."`.

- [ ] **Step 1: Failing tests** (fake session records calls; `FakeResponse(status, json, headers)`)

```python
def test_base_urls_classic_and_scoped():
    c = cfg(token_type="classic"); assert c.confluence_base == "https://virginia-its.atlassian.net/wiki"
    assert c.jira_base == "https://virginia-its.atlassian.net"
    s = cfg(token_type="scoped")
    assert s.confluence_base == "https://api.atlassian.com/ex/confluence/c417cfa5-aa30-4f3f-be7e-968c5845b5e9/wiki"
    assert s.jira_base == "https://api.atlassian.com/ex/jira/c417cfa5-aa30-4f3f-be7e-968c5845b5e9"
    assert jira_link(s, "LIB-1") == "https://virginia-its.atlassian.net/browse/LIB-1"

def test_from_env_requires_allow_lists():
    c = AtlassianConfig.from_env({"CONFLUENCE_SPACES": "lib, ,dev", "JIRA_PROJECTS": ""}, email="e@x", token="t")
    assert c.confluence_spaces == ["LIB", "DEV"] and c.confluence_enabled and not c.jira_enabled
    assert not AtlassianConfig.from_env({"CONFLUENCE_SPACES": "LIB"}, email="", token="").confluence_enabled

def test_quote_escapes():                       # RF3
    assert quote('a "b" \\ c') == '"a \\"b\\" \\\\ c"'

def test_basic_auth_and_timeout_sent():
def test_401_and_403_copy_and_log():            # RF5
    # raises AtlassianError("Jira isn't available right now."); log contains "auth_failed source=atlassian"; one HTTP call only
def test_429_retried_once_then_busy():
    # first 429 (Retry-After: 2) then 200 → returns json, sleep called with 2; two 429s → "Jira is busy, try again in a minute."
def test_timeout_is_busy_copy():
def test_token_never_logged():
```

- [ ] **Step 2: Run** → fail.
- [ ] **Step 3: Implement** (default session `requests.Session()`, `auth=(email, token)`, `timeout=10`, `Accept: application/json`). Retry-After cap 5 s.
- [ ] **Step 4: Run** → `ok`.
- [ ] **Step 5: Commit**: `feat(hoohelp): Atlassian REST client`.

### Task 3: Slack email lookup (never reaches the prompt)

**Files:** Modify `src/identity.py`; Test `test_identity.py`

**Interfaces — Produces:** `UserDirectory.email(user_id: str) -> str` — profile email from the cached `users.info` response, `""` on failure. Stored in a separate module cache (`_EMAILS`), **not** on `UserInfo`.

- [ ] **Step 1: Failing tests**

```python
def test_email_lookup_is_separate_from_userinfo():
    d = UserDirectory(FakeClient({"U1": {"real_name": "Pat Doe", "profile": {"email": "pat@virginia.edu"}}}))
    assert d.email("U1") == "pat@virginia.edu"
    assert "virginia.edu" not in repr(d.get("U1")) and "virginia.edu" not in identity_line(d.get("U1"))

def test_email_uses_cache_and_failure_is_empty():
```

- [ ] **Step 2–4:** run → fail; implement (populate `_EMAILS` in `get` when the profile has an email; `email()` calls `get` if not cached; clear in `_reset_cache`); run → `ok`.
- [ ] **Step 5: Commit**: `feat(hoohelp): Slack email lookup for account matching`.

### Task 4: Confluence tools

**Files:** Create `src/atlassian_tools.py`; Test `test_atlassian_tools.py`

**Interfaces:**
- Consumes: Task 1 converters; Task 2 `AtlassianConfig`, `AtlassianClient`, `AtlassianError`, `quote`, `confluence_link`.
- Produces:
  - Constants `TOOL_SEARCH_CONFLUENCE = "search_confluence"`, `TOOL_GET_PAGE = "get_confluence_page"`, `TOOL_SEARCH_JIRA = "search_jira"`, `TOOL_GET_ISSUE = "get_jira_issue"`.
  - `class AtlassianTools(cfg, *, asker_id: str, directory, confluence=None, jira=None)` (clients injectable for tests); `.tool_specs()`, `.handles(name)`, `.call(name, args) -> str`. Specs include only the enabled products' tools.
  - `.search_confluence(query, space="", label="", updated_after="", limit=5, page=1) -> str`
  - `.get_confluence_page(page_id_or_url, max_chars=6000, offset=0) -> str`

Details:
- Search: `GET /rest/api/search` with `cql`, `limit`, `start=(page-1)*limit`, `excerpt=highlight`, `expand=content.space,content.history.lastUpdated,content.ancestors`. CQL: `siteSearch ~ <quote(query)> AND type = page AND space IN (<quoted allowed keys>)` + optional `AND space = <quote(KEY)>`, `AND label = <quote(label)>`, `AND lastmodified >= <quote(date)>`. `space` arg not allowed → refusal copy (no HTTP call). Hits re-filtered by `content.space.key` (RF1). `totalSize > start+limit` → `More results: page <n+1>.`
- Page: id from arg or `/pages/(\d+)` in a URL. `GET /api/v2/pages/{id}` with `body-format=storage`; space key via `GET /api/v2/spaces/{spaceId}` (cached); not allowed → refusal copy, body never returned (RF2). Output: title, space, link, then markdown chunk `[offset:offset+max_chars]` and `continues — call again with offset=<n>` when longer.

- [ ] **Step 1: Failing tests**

```python
def test_confluence_cql_is_built_and_constrained():
    t, conf = tools(spaces=["LIB", "DEV"])
    t.search_confluence('gate "count" OR x', space="lib", updated_after="2026-09-01")
    cql = conf.last_params()["cql"]
    assert cql == ('siteSearch ~ "gate \\"count\\" OR x" AND type = page AND space IN ("LIB", "DEV") '
                   'AND space = "LIB" AND lastmodified >= "2026-09-01"')        # RF3

def test_disallowed_space_refused_without_http():
    assert t.search_confluence("x", space="HR") == "That isn't in the Library's Confluence spaces (allowed: LIB, DEV)."
    assert conf.calls == []

def test_hits_outside_allow_list_dropped():         # RF1
def test_hit_formatting_title_space_breadcrumb_excerpt_link():
    # includes "Gate counts", "LIB", "Assessment › Data", "camera fix" (highlight stripped), site link
def test_more_results_hint():
def test_page_by_url_other_space_refused():          # RF2
    # api returns page with spaceId of "HR" → refusal copy; body text "SECRET BODY" not in output
def test_page_chunking_and_continue_hint():
def test_page_missing_fields_render():               # RF4
def test_specs_only_for_enabled_products():
def test_errors_are_plain_sentences():               # 401 → "Confluence isn't available right now."
```

- [ ] **Step 2–4:** run → fail; implement; run → `ok`.
- [ ] **Step 5: Commit**: `feat(hoohelp): search_confluence and get_confluence_page`.

### Task 5: Jira tools and "me"

**Files:** Modify `src/atlassian_tools.py`; Test `test_atlassian_tools.py`

**Interfaces — Produces:** `.search_jira(text="", project="", status="", assignee="", reporter="", issue_type="", updated_after="", created_after="", limit=10) -> str`, `.get_jira_issue(key, max_comments=10) -> str`, `._account_id(name_or_me: str) -> Tuple[Optional[str], str]` (id, or refusal/"which one?" sentence).

Details:
- `POST /rest/api/3/search/jql` with `{"jql", "maxResults": limit, "fields": ["summary","status","assignee","updated","issuetype","priority"]}`.
- JQL: `project IN (<quoted allowed>)` + `AND project = <quote>` + `AND text ~ <quote(text)>` + status (`open` → `statusCategory != Done`, `done` → `statusCategory = Done`, else `status = <quote>`) + `AND assignee = <accountId>` / `reporter = …` + `AND issuetype = <quote>` + `AND updated >= <quote(date)>` / `created >= …` + ` ORDER BY updated DESC`.
- `me`: `directory.email(asker_id)` → `GET /rest/api/3/user/search?query=<email>` → first active account's `accountId`; cached per asker for the container; log `atlassian_me=matched|unmatched`. Display names: `user/search?query=<name>`; 0 → `I couldn't find a Jira user named "<x>".`; >1 distinct → `More than one person matches "<x>": A, B. Which one?`.
- Output: markdown table `| Key | Summary | Status | Assignee | Updated |`, then `Links:` lines `KEY — <jira_link>`, then `JQL: <jql>`. Results re-filtered by issue key prefix ∈ allowed projects (RF1).
- Issue: `GET /rest/api/3/issue/{key}` (`fields=summary,issuetype,status,priority,assignee,reporter,created,updated,labels,components,issuelinks,description`) and `GET /rest/api/3/issue/{key}/comment` (`orderBy=-created`, `maxResults`). Key's project not allowed → refusal copy **before** any HTTP call.

- [ ] **Step 1: Failing tests**

```python
def test_jira_jql_built_and_constrained():           # RF3
    t, _, jira = tools(projects=["LIB"])
    t.search_jira(text='camera "door" ORDER BY x', status="open", updated_after="2026-10-01")
    assert jira.last_json()["jql"] == ('project IN ("LIB") AND text ~ "camera \\"door\\" ORDER BY x" '
                                       'AND statusCategory != Done AND updated >= "2026-10-01" ORDER BY updated DESC')

def test_assignee_me_uses_email_lookup_and_never_shows_email():
    out = t.search_jira(assignee="me")
    assert "assignee = acc-123" in out and "pat@virginia.edu" not in out
    # caplog / handler capture: "pat@virginia.edu" not in logs; "atlassian_me=matched" in logs

def test_me_unmatched_copy():
def test_display_name_ambiguous_asks():
def test_disallowed_project_refused_without_http():
def test_results_outside_allow_list_dropped():        # RF1
def test_issue_details_comments_links():
def test_issue_missing_assignee_description_render(): # RF4
def test_issue_other_project_refused_before_http():
```

- [ ] **Step 2–4:** run → fail; implement; run → `ok`.
- [ ] **Step 5: Commit**: `feat(hoohelp): search_jira and get_jira_issue with "me"`.

### Task 6: Wiring, prompt, infra, docs

**Files:** Create `src/local_tools.py`; Modify `src/app.py`, `src/agent.py` (`SYSTEM_PROMPT`), `template.yaml`, `evals/make_case.py`, `evals/test_make_case.py`, `README.md`; Test `test_local_tools.py`

**Interfaces — Produces:**
- `class LocalTools(*tool_sets)` — ignores `None`; `tool_specs()` concatenated in order; `handles`/`call` delegate to the first set that handles the name. `LocalTools()` with nothing → `tool_specs() == []`.
- `atlassian_tools_for_event(event, *, directory, env=os.environ, email="", token="") -> Optional[AtlassianTools]` in `atlassian_tools.py` — `None` unless `ENABLE_ATLASSIAN == "true"` and at least one product is enabled.

- [ ] **Step 1: Failing tests** — combiner order and dispatch; `None` sets ignored; `atlassian_tools_for_event` off by flag / off with no credentials / Jira-only when only `JIRA_PROJECTS` set; `make_case.slack_warning` (rename not required) also warns for `search_confluence` etc. with wording `trace includes Slack, Confluence or Jira content — keep only if it's fine to commit`; agent prompt contains `search_confluence` and `search_jira`.
- [ ] **Step 2: Run** → fail.
- [ ] **Step 3: Implement.**
  - `app.py`: at import, `ATLASSIAN_EMAIL = _load_secret("ATLASSIAN_EMAIL", "ATLASSIAN_EMAIL_SSM_PATH")`, `ATLASSIAN_TOKEN = _load_secret("ATLASSIAN_API_TOKEN", "ATLASSIAN_TOKEN_SSM_PATH")` **only when** `ENABLE_ATLASSIAN == "true"` (so a disabled deploy never reads them). In `handle_user_query`: `local_tools=LocalTools(slack_tools, atlassian_tools_for_event(...))`.
  - `SYSTEM_PROMPT` block 7: Confluence for documentation and procedures; Jira for work items and status (`assignee="me"` for "my issues"); Slack for discussions; cite only links from tool results; a page or comment isn't official policy unless it says so.
  - `template.yaml`: parameters `EnableAtlassian` (`"false"`), `AtlassianTokenType` (`"scoped"`, AllowedValues `classic`/`scoped`), `ConfluenceSpaces` (`""`), `JiraProjects` (`""`); env `ENABLE_ATLASSIAN`, `ATLASSIAN_SITE: https://virginia-its.atlassian.net`, `ATLASSIAN_CLOUD_ID: c417cfa5-aa30-4f3f-be7e-968c5845b5e9`, `ATLASSIAN_TOKEN_TYPE`, `CONFLUENCE_SPACES`, `JIRA_PROJECTS`, `ATLASSIAN_EMAIL_SSM_PATH: /hoohelp/atlassian/email`, `ATLASSIAN_TOKEN_SSM_PATH: /hoohelp/atlassian/api-token`; add both SSM ARNs to the existing `ssm:GetParameter` statement.
  - `README.md`: "Confluence and Jira" section (service account, token types, SSM, allow-lists = Library only, Browse users permission, switch, traces) + config-table rows.
- [ ] **Step 4: Run** all unit tests + offline evals → pass; `sam validate --lint` → valid.
- [ ] **Step 5: Commit** listed files: `feat(hoohelp): wire Confluence and Jira tools behind EnableAtlassian`.

### Task 7: Eval cases

**Files:** Create `evals/cases/confluence-gate-count-doc.json`, `evals/cases/jira-camera-ticket.json`, `evals/cases/jira-assigned-to-me.json` (offline; invented content; site links under `https://virginia-its.atlassian.net`)

- [ ] **Step 1:** write the three cases with recorded steps in the exact output formats from Tasks 4–5 and answers citing links; `expect.phrases`: Confluence page title + "LIB"; issue key + status; two issue keys for "me".
- [ ] **Step 2: Run** `evals/run.py --offline` → all pass; confirm each case fails when an expected phrase is changed (one quick check).
- [ ] **Step 3: Commit**: `test(hoohelp): eval cases for Confluence and Jira`.

### Task 8: Rollout (needs the human)

- [ ] Walk the user through creating the token (service account or dedicated user; scoped read-only token preferred; Browse users permission) — they enter values into SSM themselves.
- [ ] Ask the user for the Library Confluence space keys and Jira project keys.
- [ ] Deploy with `EnableAtlassian=false` (**ask first**); then with it on plus the allow-lists (**ask first**).
- [ ] Manual checks with the user: a page in a non-Library space and an issue in a non-Library project never come back; "assigned to me" works; links open.
- [ ] Live evals; merge/push when asked.
