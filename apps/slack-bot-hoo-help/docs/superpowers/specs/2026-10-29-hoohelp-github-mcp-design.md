# Hoo Helper: GitHub (read-only) through GitHub's hosted MCP server — design

**Date:** 2026-10-29 · **Status:** draft for review · **App:** `apps/slack-bot-hoo-help`

## Goal

Staff can ask Hoo Helper about the Library's code on GitHub (`github.com/uvalib`) and get
answers with links:
- **Find and read code:** "where is the Virgo hold logic?", "what does this config do?"
- **Issues and pull requests:** "open issues on virgo4-client", "what changed in the last PR to X?"
- **Repo inventory:** "which repos use Ruby?", "what's in uvalib?"

**Success:** those three kinds of question are answered from GitHub with correct links. Nothing
can be written to GitHub. A GitHub outage or missing credential only removes the GitHub tools;
it never breaks Hoo Helper.

## Decisions already made (2026-10-29)

| Question | Decision |
| --- | --- |
| Which repos | Every repo the GitHub App is installed on: all of uvalib, 406 repos today, private ones included |
| Identity | A GitHub App, `uvalib-hoo-helper`, installed on uvalib, with read-only Contents, Metadata, Issues and Pull requests |
| Questions | Code (find and read), issues and PRs, repo inventory. Not CI/Actions, releases-first questions, security alerts or users |
| Route | GitHub's **hosted** MCP server, called directly from Hoo Helper (not through our AgentCore gateway) |

**Private repos:** everything the App can read, any Hoo Helper user in Slack can see,
private repo source included. That is the intended scope.

## What the spike showed (read-only, 2026-10-29)

- The App's installation token (`ghs_…`, valid for 1 hour) is accepted by
  `https://api.githubcopilot.com/mcp/readonly`. No personal token or Copilot sign-in is needed.
- With `X-MCP-Toolsets: repos,issues,pull_requests`, the server offers 22 tools, all read:
  `get_commit, get_file_contents, get_label, get_latest_release, get_release_by_tag, get_tag,
  issue_read, list_branches, list_commits, list_issue_fields, list_issue_types, list_issues,
  list_pull_requests, list_releases, list_repository_collaborators, list_tags, pull_request_read,
  search_code, search_commits, search_issues, search_pull_requests, search_repositories`.
- A write tool (`create_issue`) is refused as "unknown tool".
- Calls returned real data from public and private repos.
- `get_file_contents` returns a short text line plus the file as a separate **resource** content item.

## Design

### Credentials

The App key is in SSM:
- `/hoohelp/github/app-id` (String)
- `/hoohelp/github/installation-id` (String)
- `/hoohelp/github/private-key` (SecureString, PEM)

The Lambda's role gets `ssm:GetParameter` on `/hoohelp/github/*`, plus decrypt through SSM. The key is
read once per container and kept in memory, never logged. A **token minter**:
- signs a 9-minute App JWT (RS256: iat = now − 60 s, exp = now + 540 s, iss = app id);
- exchanges it at `POST /app/installations/{id}/access_tokens`;
- caches the installation token until 5 minutes before it expires.

The private key and tokens never appear in logs, traces or tool output.

### GitHub MCP client (`github_mcp.py`, new)

A small client for MCP's streamable-HTTP transport, separate from the AgentCore gateway client
because the auth, URL and headers all differ.

- **Endpoint:** URL `https://api.githubcopilot.com/mcp/readonly`. Headers:
  - `Authorization: Bearer <installation token>`
  - `X-MCP-Toolsets: repos,issues,pull_requests`
  - `X-MCP-Readonly: true`
  - `Accept: application/json, text/event-stream`
- **Session:** `initialize` → `notifications/initialized` → `tools/list` and `tools/call`. It keeps the
  `Mcp-Session-Id` and re-initializes once if the server drops the session (404 or 400 on a session
  id). It parses both JSON and SSE replies.
- **Timeouts:** 20 s per call, under the Lambda's 120 s.
- **Errors:** a 401 refreshes the token once and retries; a second failure gives the error below.
  A 429 or 5xx is retried once. Anything else gives the error below.
- **Tool list cache:** `tools/list` is cached for 10 minutes per container.

### Tool exposure (`GitHubTools`, a LocalTools set)

The client is wrapped in the same `tool_specs()` / `handles()` / `call()` shape as the Slack and
Atlassian tools, and added to `LocalTools` in `app.py`.

- **Names** are `GitHub___<tool>`, and the description is GitHub's, with
  "(GitHub, uvalib repos, read-only)" added.
- **Our own allow-list** (defence in depth, on top of `/readonly`): the 22 read tools above, minus
  `list_repository_collaborators`, which exposes people and access levels rather than code. A
  tool the server offers that isn't on the list is never shown to the model, so a new GitHub
  write tool can't appear by surprise.
- **Org scope:**
  - Calls that take `owner` must use `uvalib`; anything else is refused before calling GitHub.
  - For search tools, Hoo Helper adds `org:uvalib` to the query when the query names no `org:`/`repo:`.
  - Searches that name another org or repo are refused.
  - The App's installation already limits what it can read, so this keeps answers on topic rather
    than acting as the security boundary.
- **Results:**
  - The text and resource items are joined.
  - File contents are capped at 12,000 characters, with a "(truncated — N more characters; ask for a
    line range)" note.
  - Search and list results are capped at 20 items.
  - A GitHub link (repo, file at its ref, issue, PR) is added wherever the result gives one.
- **Switch:** `ENABLE_GITHUB` (template parameter `EnableGitHub`, default false). If it is off, an SSM
  value is missing, or the first token or `tools/list` call fails, the tools aren't offered for that
  turn, and that is logged once per container.

### Hoo Helper prompt

A short "GitHub (uvalib code)" section:
- **Code, repos and issues:**
  - Questions about code, a repo, a GitHub issue or a PR go to the GitHub tools.
  - Start with `search_code` or `search_repositories`; read a file with `get_file_contents`.
  - Issues and PRs use `list_issues`, `search_issues` and `pull_request_read`.
- **Jira overlap:** for "tickets" or work-item status in the Library's Jira projects, Jira comes
  first. Use GitHub issues when the question names GitHub or a repo.
- **Citing:** cite the GitHub link for every file, issue or PR mentioned, and quote code sparingly.
- **Private repos:** they are visible to everyone who can ask Hoo Helper. Never repeat a secret,
  password, key or token that appears in code; say that a credential appears there instead.

### Link check

GitHub links built from tool output (github.com/uvalib/…) are added to the link checker's
trusted list, as Virgo record links are. That way private-repo links, which return 404 without a
GitHub login, aren't removed from answers.

### Secret hygiene in answers

Before any GitHub tool output reaches the model, values that look like credentials are redacted.
That covers GitHub tokens (`gh[pousr]_…`), AWS access keys, private-key blocks, and
`password=`/`secret=` assignments. Each becomes `[redacted credential]` in that output only.
This is a best-effort guard, not a guarantee.

## Error handling

| Case | Behaviour |
| --- | --- |
| Feature off or a credential missing | GitHub tools not offered; logged once |
| Token exchange fails (App uninstalled, key revoked) | Tools not offered this turn; `github_auth_failed` logged with the status |
| 401 mid-turn | Refresh the token once and retry, then "GitHub isn't available right now." |
| 403 or 404 from a tool | Return the tool's own error text, so the model can say the repo or file wasn't found |
| 429 or 5xx | Retry once, then "GitHub is busy; try again in a minute." |
| Timeout | "GitHub didn't respond in time." |

## Testing

- **Unit tests,** with a fake MCP server and a fake token endpoint:
  - JWT claims and token caching with refresh before expiry;
  - session initialize and re-initialize;
  - JSON and SSE parsing;
  - allow-list filtering (an unlisted or write tool is never exposed);
  - owner and org scoping and the search `org:uvalib` rewrite;
  - resource-item handling and the 12,000-character cap;
  - credential redaction;
  - each row of the error table;
  - the feature-off and missing-SSM paths;
  - and that the key and tokens never appear in logs or traces.
- **Live evals,** wired like the Confluence and Jira ones:
  - "Where is the hold request logic in our Go services?" calls `GitHub___search_code` and cites a
    uvalib file link.
  - "What's in the README of virgo4-client?" calls `get_file_contents`.
  - "Which uvalib repos are written in Ruby?" calls `search_repositories`.
  - "Any open pull requests on virgo4-client?" calls `list_pull_requests` or `search_pull_requests`.
- **Offline eval:** one recorded GitHub answer, for formatting and links.
- **After deploy:** a live smoke test from Slack.

## Rollout

1. Deploy with `EnableGitHub=false`, then switch it on. Approve before each deploy.
2. Run the live evals with it on.
3. Announce it to staff with the example questions.

## Out of scope

- Writing anything to GitHub.
- Actions/CI, security alerts, Dependabot, users and orgs administration.
- Per-user GitHub permissions: answers use the App's view.
- Self-hosting the MCP server. That is the fallback (run the open-source `github-mcp-server --read-only`)
  only if the hosted endpoint stops accepting installation tokens.
