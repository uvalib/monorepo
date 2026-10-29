# Hoo Helper GitHub (read-only, hosted MCP) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoo Helper answers questions about uvalib's code, issues and pull requests and its repo inventory, using GitHub's hosted MCP server read-only, through a GitHub App installation token.

**Architecture:**
- A token minter turns the App key from SSM into 1-hour installation tokens.
- A small streamable-HTTP MCP client talks to `https://api.githubcopilot.com/mcp/readonly`.
- A `GitHubTools` set exposes an allow-listed, uvalib-scoped, redacted view of its tools through the existing `LocalTools` mechanism, next to Slack, Confluence and Jira.

Off by default (`EnableGitHub=false`). Any failure removes the tools, never Hoo Helper.

**Tech Stack:** Python 3.12 on Lambda (arm64), with `requests`, `PyJWT`, `cryptography` and boto3 (SSM), SAM.

**Spec:** `apps/slack-bot-hoo-help/docs/superpowers/specs/2026-10-29-hoohelp-github-mcp-design.md`

## Global Constraints

- **SSM:** `/hoohelp/github/app-id` (String), `/hoohelp/github/installation-id` (String), `/hoohelp/github/private-key` (SecureString PEM).
- **App JWT:** RS256, `iat` = now − 60, `exp` = now + 540, `iss` = app id. Exchanged at `POST https://api.github.com/app/installations/{id}/access_tokens`.
- **Installation token:** cached until 5 minutes before `expires_at`.
- **MCP endpoint and headers:** URL `https://api.githubcopilot.com/mcp/readonly`. Headers:
  - `Authorization: Bearer <token>`
  - `X-MCP-Toolsets: repos,issues,pull_requests`
  - `X-MCP-Readonly: true`
  - `Accept: application/json, text/event-stream`
- **Timeouts and cache:** 20 s per HTTP call; `tools/list` cached 10 minutes.
- **Allow-list** (exact): `get_commit, get_file_contents, get_label, get_latest_release, get_release_by_tag, get_tag, issue_read, list_branches, list_commits, list_issue_fields, list_issue_types, list_issues, list_pull_requests, list_releases, list_tags, pull_request_read, search_code, search_commits, search_issues, search_pull_requests, search_repositories`. `list_repository_collaborators` is excluded.
- **Tool names and descriptions:** names are `GitHub___<tool>`; descriptions are GitHub's plus " (GitHub, uvalib repos, read-only)".
- **Org scope:**
  - `owner` must equal `uvalib`, case-insensitive.
  - Searches with no `org:`/`repo:`/`user:` get ` org:uvalib` appended.
  - A search naming another `org:`, `user:` or `repo:<other>/…` is refused.
- **Output caps:**
  - File text capped at 12,000 characters, with the note `(truncated — N more characters; ask for a line range)`.
  - Search and list results capped at 20 items.
- **Redaction:** replace `gh[pousr]_[A-Za-z0-9_]{20,}`, `AKIA[0-9A-Z]{16}`, `-----BEGIN [A-Z ]*PRIVATE KEY-----…-----END [A-Z ]*PRIVATE KEY-----`, and `(password|passwd|secret|api[_-]?key|token)\s*[:=]\s*\S+` (value part only) with `[redacted credential]`.
- **Error copy** (exact):
  - `GitHub isn't available right now.`
  - `GitHub is busy; try again in a minute.`
  - `GitHub didn't respond in time.`
- **Feature switch:** template parameter `EnableGitHub` (default `"false"`) gives env `ENABLE_GITHUB`. The SSM read policy covers `/hoohelp/github/*`.
- **Secrets:** the private key, JWTs and tokens never appear in logs, traces or tool output.
- **Tests:** run with the scratch venv (`$V/bin/python -m pytest -q <file>` with `AWS_REGION=us-east-1`). The repo convention is plain test files at the app root.
- **Commits:** explicit paths only. Deploys are a separate step that needs approval.

## Review Focus

1. **Building on a Mac for arm64 Lambda:** if `cryptography` is packaged as a Mac wheel, importing it fails at cold start. GitHub tools must then switch off, not crash Hoo Helper (Task 3 test), and the deploy must check that the packaged wheel is Linux aarch64 (Task 5).
2. **A huge or binary file from `get_file_contents`:** a person expects a short "binary file, not shown" or a truncated file with a note, never a megabyte dumped into the model (Task 3).
3. **The model passes `owner="UVALib"`, or a repo as `uvalib/virgo4-client` in the `repo` field:** this should still work, not be refused (Task 3).
4. **A search already scoped to `repo:uvalib/x`:** it must keep working. A search for `org:someoneelse` must be refused (Task 3).
5. **A warm container older than an hour:** the next call silently gets a fresh token, not a 401 error answer (Task 1 and Task 2).

---

### Task 1: Installation token minter

**Files:**
- Create: `src/github_auth.py`
- Test: `test_github_auth.py`
- Modify: `requirements.txt` (add `PyJWT>=2.8,<3` and `cryptography>=42,<46`)

**Interfaces:**
- Produces:
  - `GitHubAppCredentials(app_id: str, installation_id: str, private_key: str)`, a dataclass with `repr` hiding `private_key`.
  - `load_credentials(ssm_get: Callable[[str, bool], str]) -> GitHubAppCredentials | None`. Returns None if any parameter is missing or empty.
  - `InstallationTokenMinter(creds, *, http=requests, clock=time.time)` with `.token() -> str`.
  - `GitHubAuthError(Exception)`, whose message never contains secrets.

- [ ] **Step 1: Failing tests.** Use a fake `http` that records calls, and a generated RSA key (`cryptography`). Tests:
  - `test_jwt_claims_and_exchange`: one POST to `/app/installations/42/access_tokens`. The Authorization header's JWT decodes with the public key to `iss == "123"`, `exp - iat == 600`, `iat == now - 60`.
  - `test_token_cached_until_five_minutes_before_expiry`: with `expires_at` = now + 3600, a call at now + 3200 makes no new POST, and a call at now + 3301 makes one.
  - `test_exchange_failure_raises_without_secrets`: a 401 raises `GitHubAuthError`. The message contains the status and not the key, the JWT or "BEGIN".
  - `test_load_credentials_missing_returns_none`.
  - `test_repr_hides_key`.
- [ ] **Step 2:** Run `$V/bin/python -m pytest -q test_github_auth.py`. Expected: FAIL (no module).
- [ ] **Step 3:** Implement `src/github_auth.py` with PyJWT `jwt.encode(..., algorithm="RS256")`, and headers `Accept: application/vnd.github+json` and `X-GitHub-Api-Version: 2022-11-28`.
- [ ] **Step 4:** Run the tests. Expected: PASS.
- [ ] **Step 5:** Commit `feat(hoohelp): GitHub App installation token minter`.

### Task 2: GitHub MCP client

**Files:**
- Create: `src/github_mcp.py`
- Test: `test_github_mcp.py`

**Interfaces:**
- Consumes: `InstallationTokenMinter.token()` (Task 1), passed in as `token_provider: Callable[[], str]`. Add `.invalidate()` on the minter so a 401 can force a refresh.
- Produces:
  - `GitHubMCPClient(token_provider, *, invalidate=lambda: None, http=requests, url=GITHUB_MCP_URL, clock=time.monotonic)` with:
    - `.list_tools() -> list[dict]`
    - `.call_tool(name: str, args: dict) -> dict`, returning the MCP `result` with its `content` list
  - `GitHubMCPError(Exception)` with `.user_message`, one of the three error strings in Global Constraints.

- [ ] **Step 1: Failing tests.** Use a fake HTTP server object that returns JSON or SSE bodies and an `Mcp-Session-Id` header. Tests:
  - `test_initialize_then_list_and_call_with_session_id`: `initialize` is sent first, then `notifications/initialized`. Later requests carry `Mcp-Session-Id` and all four headers from Global Constraints.
  - `test_sse_and_json_replies_parsed`.
  - `test_tools_list_cached_ten_minutes`.
  - `test_session_lost_reinitializes_once`: a 404 on a session request gives one re-initialize, then success. A second loss raises.
  - `test_401_refreshes_token_once`: `invalidate` is called, the retry succeeds, and a second 401 raises with `GitHub isn't available right now.`
  - `test_429_and_5xx_retried_once_then_busy`.
  - `test_timeout_message`: `requests.Timeout` gives `GitHub didn't respond in time.`
  - `test_jsonrpc_error_returned_to_caller`: an `error` such as unknown tool comes back as `GitHubMCPError` with GitHub's message, and never contains the token.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement with `protocolVersion` `2025-03-26` and clientInfo `{"name": "hoohelp", "version": "1"}`. For SSE replies, use the last `data:` line.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit `feat(hoohelp): streamable-HTTP client for GitHub's hosted MCP server`.

### Task 3: GitHubTools (allow-list, scope, rendering, redaction, factory)

**Files:**
- Create: `src/github_tools.py`
- Test: `test_github_tools.py`

**Interfaces:**
- Consumes: `GitHubMCPClient` (Task 2), `load_credentials` and `InstallationTokenMinter` (Task 1).
- Produces:
  - `GitHubTools(client)` with `tool_specs() -> list` (Bedrock `toolSpec` dicts), `handles(name) -> bool` and `call(name, args) -> str`, the same shape as `AtlassianTools`.
  - `github_tools_for_env(env=os.environ, *, ssm_get=None, http=None) -> GitHubTools | None`.
  - `ALLOWED_TOOLS: frozenset[str]` and `TOOL_PREFIX = "GitHub___"`.

- [ ] **Step 1: Failing tests** with a fake client.
  - **Exposure:**
    - `test_only_allowed_tools_exposed_with_prefix_and_suffix`: the fake server offers the allow-list plus `list_repository_collaborators` and `create_issue`. Only the allow-list is exposed, as `GitHub___…`, with the description suffix.
    - `test_unlisted_tool_call_refused_without_calling_github`.
  - **Scope:**
    - `test_owner_must_be_uvalib`: `UVALib` is accepted and normalized, and `torvalds` is refused with no call.
    - `test_repo_given_as_owner_slash_name_is_split`: `repo="uvalib/virgo4-client"` becomes owner `uvalib`, repo `virgo4-client`.
    - `test_search_gets_org_uvalib`: `"hold"` becomes `"hold org:uvalib"`, and `"hold repo:uvalib/x"` is unchanged.
    - `test_search_other_org_refused`: `org:github`, `user:x` and `repo:other/x` are each refused.
  - **Rendering:**
    - `test_file_resource_rendered_and_capped`: a resource item with 30,000 characters gives 12,000 characters plus the exact truncation note with N = 18,000.
    - `test_binary_file_not_shown`: a resource with a non-text mime type or a blob gives `binary file, not shown` plus the link.
    - `test_lists_capped_at_20`, and `test_tool_error_text_passed_through`: a 404 or 403 `isError` result returns GitHub's own text, so the model can say the repo or file wasn't found (spec error table).
    - `test_links_added`: a file result includes `https://github.com/uvalib/<repo>/blob/<ref>/<path>`, and issues and PRs include their `html_url`.
  - **Redaction:** `test_credentials_redacted`. Each pattern in Global Constraints, inside a file and inside search text, becomes `[redacted credential]`, and the surrounding text is kept.
  - **Factory:**
    - `test_factory_off_missing_or_failing_returns_none`: `ENABLE_GITHUB` false gives None. Missing SSM gives None. A token failure gives None. An `ImportError` from `jwt`/`cryptography` gives None, logged once. Review Focus 1.
    - `test_no_secrets_in_logs`: capture the logs during a failing factory run and assert neither the key nor the token appears.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. Import `github_auth`/`github_mcp` lazily inside the factory, so an import failure stays contained.
- [ ] **Step 4:** Run, plus the full suite. Expected: PASS.
- [ ] **Step 5:** Commit `feat(hoohelp): GitHub tools — allow-listed, uvalib-scoped, redacted`.

### Task 4: Wiring, prompt, link trust, template, evals

**Files:**
- Modify:
  - `src/app.py`: load `ENABLE_GITHUB`, and add `github_tools_for_env()` to the `LocalTools(...)` call next to the Slack and Atlassian tools.
  - `src/agent.py`: add a "GitHub (uvalib code)" prompt section. In `_sanitize_links`, trust `https://github.com/uvalib/…` URLs from `GitHub___` tool outputs.
  - `template.yaml`: add parameter `EnableGitHub`, env `ENABLE_GITHUB`, and the SSM policy line for `parameter/hoohelp/github/*`.
  - `samconfig.toml`: add `EnableGitHub=false`.
  - `evals/run.py`: build GitHub tools in `_live` the same way as `_atlassian_tools`, with the env from samconfig, and combine both into one `LocalTools`.
- Create:
  - `evals/cases/live-github-code-search.json`
  - `live-github-readme.json`
  - `live-github-ruby-repos.json`
  - `live-github-open-prs.json`
- Test: `test_agent_context.py`, `test_link_check.py`, `evals/test_live.py`

**Interfaces:**
- Consumes: `github_tools_for_env` (Task 3).

- [ ] **Step 1: Failing tests.**
  - **Prompt:** `test_system_prompt_routes_code_questions_to_github`. The section names `search_code`, `get_file_contents`, `list_issues` and `pull_request_read`, plus the Jira-first rule for "tickets" and the line about not repeating secrets.
  - **Links:** `test_github_links_from_github_tools_are_trusted`. A `GitHub___get_file_contents` step's URL isn't probed. Other URLs still are.
  - **Template:** `test_template_has_enable_github_and_ssm_policy`. Parse the YAML text.
  - **Evals:** `test_live_combines_local_tool_sets`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - **Prompt text:**
    - "Questions about code, a repo, or a GitHub issue or pull request in uvalib go to the GitHub tools. Find code with search_code or search_repositories, read files with get_file_contents, and use list_issues, search_issues, list_pull_requests and pull_request_read for issues and PRs."
    - "For tickets or work-item status in the Library's Jira projects, use Jira first; use GitHub issues when the question names GitHub or a repo."
    - "Cite the GitHub link for each file, issue or PR. Private repos are visible to everyone who can ask Hoo Helper: never repeat a password, key or token found in code; say a credential appears there instead."
  - **Live cases** (`tools_any`, `phrases_any`, `forbid` `["[redacted credential]", "isn't available right now"]`, `max_seconds` 60):
    - "Where is the hold request logic in our Go services?" with `["search_code"]` and `["github.com/uvalib/"]`.
    - "What's in the README of virgo4-client?" with `["get_file_contents"]` and `["virgo4-client"]`.
    - "Which uvalib repos are written in Ruby?" with `["search_repositories"]` and `["github.com/uvalib/"]`.
    - "Any open pull requests on virgo4-client?" with `["list_pull_requests", "search_pull_requests"]` and `["virgo4-client"]`.
- [ ] **Step 4:** Run the full suite and `evals/run.py --offline`. Expected: PASS, offline unchanged.
- [ ] **Step 5:** Run the 4 live cases with GitHub enabled, using `ENABLE_GITHUB=true` for the local run only. Expected: 4/4 PASS. Record the report path. Turn one answer into an offline case with `evals/make_case.py` and review the names it warns about.
- [ ] **Step 6:** Commit `feat(hoohelp): GitHub tools wired in (off by default); prompt, link trust, evals`.

### Task 5: Deploy (ask before each step)

- [ ] **Step 1:** `sam build`. Confirm the packaged `cryptography` is a Linux aarch64 build: `find .aws-sam/build -path '*cryptography*' -name '*.so' | head` shows `aarch64` or `manylinux` in the wheel tag or in `file` output. If it's a Mac build, rebuild with `sam build --use-container`. Review Focus 1.
- [ ] **Step 2 (ask):** Deploy with `EnableGitHub=false`. Expected: the existing offline and live evals are unchanged.
- [ ] **Step 3 (ask):** Set `EnableGitHub=true` in samconfig and deploy. Run the 4 live cases and a Slack smoke test ("Which uvalib repos are written in Ruby?"). Commit samconfig. Push after approval.
