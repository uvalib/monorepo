# Hoo Helper: Confluence and Jira tools — design

**Date:** 2026-10-20
**Status:** Draft for review
**Repo:** `monorepo/apps/slack-bot-hoo-help` only
**Supersedes:** the Confluence/Jira part of
`mcp-server/docs/superpowers/specs/2026-10-20-staff-knowledge-sources-design.md`
(private StaffAtlassian MCP server + IAM gateway — dropped)

## Purpose

Staff ask Hoo Helper things that live in Confluence and Jira: "where's the doc on
the gate-count corrections?", "is there a ticket for the Clemons camera?", "what's
assigned to me?". This adds four built-in tools so Hoo Helper can answer from live
Confluence and Jira data, alongside the MCP gateway tools and Slack search.

Success looks like: those questions return the right page or issue with a working
link and current status; "assigned to me" finds the asker's issues; nothing from a
space or project outside the allow-list can come back; and the tools disappear
cleanly when credentials are missing or rejected.

## Decisions (from brainstorming)

| Decision | Choice |
|---|---|
| Placement | **Built into Hoo Helper** (in-process tools, like `slack_search.py`). No MCP server, no private gateway, no Terraform |
| Why not MCP | Atlassian has its own MCP server; it isn't enabled for our site. If it is later, switch to it rather than maintain our own |
| Site | `https://virginia-its.atlassian.net` — UVA ITS's shared site (cloud id `c417cfa5-aa30-4f3f-be7e-968c5845b5e9`) |
| Access rule | Only content every Hoo Helper user could already see, enforced by a read-only service account **and a required allow-list** of spaces and projects (the site is shared with other UVA units) |
| Confluence | Live REST: CQL `siteSearch` for search, v2 pages for reading |
| Jira | Live REST: `POST /rest/api/3/search/jql`, issue + comments |
| "Me" in Jira | Asker's Slack email → Atlassian account id, for lookup only; never shown to the model or logged |
| Credentials | SSM SecureString under `/hoohelp/atlassian/`, like the Slack tokens |
| Writes | None (read-only) |

## Credentials and auth

SSM parameters (SecureString), read at cold start like the Slack secrets:

| Parameter | Value |
|---|---|
| `/hoohelp/atlassian/email` | Service account's email |
| `/hoohelp/atlassian/api-token` | API token (classic or scoped) |

Plain Lambda env (not secret): `ATLASSIAN_SITE=https://virginia-its.atlassian.net`,
`ATLASSIAN_CLOUD_ID=c417cfa5-aa30-4f3f-be7e-968c5845b5e9`,
`ATLASSIAN_TOKEN_TYPE=classic|scoped`, `CONFLUENCE_SPACES`, `JIRA_PROJECTS`
(comma-separated keys).

Both token types use HTTP Basic auth (`email:token`). They differ in base URL:

| Token | Confluence base | Jira base |
|---|---|---|
| Classic | `https://virginia-its.atlassian.net/wiki` | `https://virginia-its.atlassian.net` |
| Scoped | `https://api.atlassian.com/ex/confluence/<cloudId>/wiki` | `https://api.atlassian.com/ex/jira/<cloudId>` |

Links shown to people always use the site URL (`/wiki/spaces/…`, `/browse/KEY-1`),
whichever base the API calls used.

The token is never logged or written to traces. The Lambda role gets
`ssm:GetParameter` on the two paths only.

**Off switch:** `EnableAtlassian` (default `false`). With it on but credentials
missing, or `CONFLUENCE_SPACES` / `JIRA_PROJECTS` empty, the corresponding tools are
not offered (logged once at cold start). Confluence and Jira are independent: one
can be enabled without the other by leaving the other's allow-list empty.

## Tools (`src/atlassian_tools.py`)

All return markdown in the style of the other tools and include each item's real
URL, so the link check keeps working. The model never writes CQL or JQL; queries are
built in code and every value is escaped (`\` and `"`). A space or project outside
the allow-list is refused with a sentence listing the allowed ones.

**`search_confluence(query, space="", label="", updated_after="", limit=5, page=1)`**
- CQL: `siteSearch ~ "<query>" AND type = page AND space IN (<allowed>)`, plus
  optional `space = …`, `label = …`, `lastmodified >= "<YYYY-MM-DD>"`.
- Per hit: title, space name, breadcrumb, last updated + by whom, excerpt
  (~300 chars, Atlassian's highlight markup stripped), URL, `page_id`. "More
  results: page 2" hint when there are more.

**`get_confluence_page(page_id_or_url, max_chars=6000, offset=0)`**
- Accepts a page id or a `/wiki/spaces/<KEY>/pages/<id>/…` URL.
- v2 `GET /api/v2/pages/{id}?body-format=storage`; storage XHTML → markdown
  (headings, paragraphs, lists, tables, links made absolute; macros dropped except
  their text). Chunked with "continues — call again with offset=N".
- Refuses a page whose space isn't allowed (checked from the page's `spaceId`).

**`search_jira(text="", project="", status="", assignee="", reporter="", issue_type="", updated_after="", created_after="", limit=10)`**
- JQL built from the arguments, always constrained `project IN (<allowed>)`;
  `ORDER BY updated DESC`.
- `status`: a real status name, or `open` → `statusCategory != Done`,
  `done` → `statusCategory = Done`.
- `assignee` / `reporter`: `me` (the asker, via email lookup), or a display name →
  account id (`/rest/api/3/user/search`). Several matches → "which one?" sentence.
- Output: table of key, summary, status, assignee, updated; a link per issue; the
  JQL used.

**`get_jira_issue(key, max_comments=10)`**
- Summary, type, status, priority, assignee, reporter, created/updated, labels,
  components, linked issues; description as text (ADF → text); latest comments
  (author, date, ~500 chars each); URL.
- Refuses an issue whose project isn't allowed.

**Shared:** 10 s timeouts; a 429 is retried once after `Retry-After` (max 5 s), then
"Confluence/Jira is busy, try again in a minute"; 401/403 → "Confluence/Jira isn't
available right now" and a `auth_failed source=atlassian` log line; other errors →
a plain sentence with the status code. Never "Tool Error:", never a stack trace.
Descriptions ask for short keyword queries and a second phrasing before giving up.

## "Me" lookup

- `identity.UserDirectory.email(user_id) -> str` reads the Slack profile email
  (cached with the profile). It is **not** part of `UserInfo`, so it can never reach
  `identity_line` or the prompt.
- `atlassian_tools` resolves the asker's email to an Atlassian `accountId` once per
  container (cache), via `GET /rest/api/3/user/search?query=<email>`; requires the
  service account to have the Jira "Browse users and groups" permission.
- If there's no email, no match, or the email isn't visible to the service account,
  `assignee="me"` returns "I couldn't match your Slack account to a Jira account" —
  the rest of the tool still works.
- The email is never logged, never put in tool output or traces; logs say only
  `atlassian_me=matched|unmatched`.

## Hoo Helper changes

- **Local tools:** the agent's `local_tools` currently takes one object
  (`SlackSearchTools`). Add a tiny `LocalTools` combiner in `src/local_tools.py`
  (`tool_specs` concatenated, `handles`/`call` delegated to the first that handles)
  so Slack and Atlassian tools travel together. `app.handle_user_query` builds
  `AtlassianTools(asker_id=…, directory=…)` when enabled.
- **System prompt:** a short block — Confluence for documentation and procedures,
  Jira for work items and status, Slack for discussions and decisions; cite links
  from tool results only; a Confluence page or Jira comment isn't official policy
  unless it says so.
- **`template.yaml`:** parameters `EnableAtlassian` (default `false`),
  `ConfluenceSpaces`, `JiraProjects`, `AtlassianTokenType` (default `scoped`); env
  vars above; SSM read on `/hoohelp/atlassian/email` and `/hoohelp/atlassian/api-token`.
- **`evals/make_case.py`:** the "keep only if fine to commit" warning also covers the
  four Atlassian tools.
- **README:** setup (service account, token, SSM, allow-lists, Browse-users
  permission), the switch, and that traces now include Confluence/Jira excerpts.

## Error handling

| Situation | Behaviour |
|---|---|
| `EnableAtlassian=false`, no credentials, or empty allow-list | Tools not offered |
| 401 / 403 | "Confluence/Jira isn't available right now"; `auth_failed` log |
| 429 / timeout | One retry (429 only), then "busy, try again" |
| Space / project / page / issue outside the allow-list | Refused, listing the allowed ones |
| `me` can't be matched | "I couldn't match your Slack account to a Jira account" |
| Unknown display name / several matches | "couldn't find" / "which one?" sentence |

## Testing

**Unit (no network; fake HTTP session)**
- CQL/JQL builders: escaping (quotes, backslashes), allow-list always applied,
  disallowed space/project refused, `open`/`done`, dates.
- Base URLs for classic vs scoped tokens; human links always use the site URL.
- Storage → markdown and ADF → text converters (fixtures).
- Page / issue outside the allow-list refused even when the API returns it.
- `me` lookup: matched, unmatched, no email; email never in output or logs.
- 401/403/429/timeout messages; nothing starts with "Tool Error".
- `LocalTools` combiner: specs concatenated; dispatch to the right tool set.
- Tools absent when disabled, unconfigured or allow-list empty.

**Evals (offline replay, blocking):** a Confluence answer (page link cited), a Jira
status answer (key + status + link), "assigned to me" (table of issues).

**Manual rollout checks:** a page in a non-allowed space and an issue in a
non-allowed project never come back; "assigned to me" works for the tester;
answers cite working links.

## Rollout

1. Service account + token (walkthrough at implementation time); values into SSM.
2. Choose the allow-lists (Library spaces and projects only).
3. Deploy with `EnableAtlassian=false`; then enable with the allow-lists; run the
   manual checks; live evals.

## To verify during planning

- Exact read-only scopes for a scoped token (Confluence: page/space read and CQL
  search; Jira: read work + read users) and that both products accept one token.
- `siteSearch` relevance on our spaces (fallback: `text ~`).
- Whether `user/search?query=<email>` returns accounts for UVA users given profile
  email visibility; fallback is display-name lookup only.
- v2 page body format best for conversion (`storage` assumed).

## Out of scope (v1)

- Writing (comments, transitions, page edits), attachments, Jira Service Management
  requests, Confluence blogs and whiteboards.
- Per-user permissions — answers come from the service account's view, limited by
  the allow-list.
- Atlassian's own MCP server (revisit if it's enabled for our site).
