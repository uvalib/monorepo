# HooHelp Slack Bot (`slack-bot-hoo-help`)

Intelligent Slack bot for the University of Virginia (UVA) Library system.

- **Agent LLM:** Amazon Bedrock MiniMax M2.5 (`minimax.minimax-m2.5`) via Converse + MCP tools
- **Slack formatting:** in code — agent mrkdwn cleanup, markdown tables → Slack table block, hours/occupancy cards and image carousels from tool output. An optional Gemma 4 31B Block Kit rewrite pass exists behind `SLACK_LLM_FORMAT=true` (off by default)
- **Tools:** Public AgentCore MCP Gateway (occupancy, Virgo catalog, knowledge bases) plus **in-process Wikipedia** tools (`wikipedia_search`, `wikipedia_get_page`)
- **Delivery:** Slack **Events API** → API Gateway HTTP API → **AWS Lambda** (SAM)

---

## Architecture

```
Slack Events API
      │  POST /slack/events  (signed, url_verification + events)
      ▼
API Gateway HTTP API
      │
      ▼
Lambda (Bolt process_before_response + lazy listeners)
      │  1) ack within ~3s
      │  2) async self-invoke for agent work
      ▼
Bedrock Converse (MiniMax M2.5)  +  AgentCore MCP Gateway tools
      │
      ▼
slack_format.py (mrkdwn cleanup + Block Kit from tool output;
                 optional Gemma 4 31B rewrite when SLACK_LLM_FORMAT=true)
      │
      ▼
Slack Web API (chat.postMessage / chat.update)
```

Lambda is request-driven and scales to zero when idle. Socket Mode is not used.

**Production Events URL:**

```text
https://8zia6ty95a.execute-api.us-east-1.amazonaws.com/prod/slack/events
```

---

## Capabilities & Tools

Through the public AgentCore Gateway, HooHelp uses tools across three backend MCP runtimes:

1. **Occupancy & Hours** (`OccupancyReportingRuntime`)
2. **Virgo 4 Catalog Search** (`VirgoCatalogRuntime`)
3. **Bedrock Knowledge Bases** (`BedrockKBRuntime`)

---

## Project layout

```
slack-bot-hoo-help/
  template.yaml       # SAM: Lambda + HTTP API + IAM
  samconfig.toml      # Deploy defaults (no secrets)
  requirements.txt
  src/
    app.py            # Lambda handler + Bolt Events API
    agent.py          # Bedrock tool-calling loop
    gateway_mcp_client.py
    requirements.txt  # Used by `sam build` (CodeUri)
  test_bot_locally.py # Agent + gateway only (no Slack)
  README.md
```

---

## Prerequisites

- AWS CLI credentials with rights to deploy CloudFormation / Lambda / API Gateway / IAM
- [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) (`sam --version`)
- Slack app with bot token + signing secret
- Bedrock model access for Nova Pro in `us-east-1`

---

## Secrets (SSM)

Slack credentials are **not** SAM parameters (those get wiped if you redeploy
without re-passing them). They live in SSM SecureString:

| Path | Value |
|------|--------|
| `/hoohelp/slack/bot-token` | `xoxb-...` |
| `/hoohelp/slack/signing-secret` | signing secret |

```bash
# One-time / rotation (from local .env — never commit)
set -a && source .env && set +a
aws ssm put-parameter --name /hoohelp/slack/bot-token \
  --type SecureString --value "$SLACK_BOT_TOKEN" --overwrite
aws ssm put-parameter --name /hoohelp/slack/signing-secret \
  --type SecureString --value "$SLACK_SIGNING_SECRET" --overwrite
```

SSM value changes apply on the next Lambda cold start (runtime fetch) — no
redeploy required after rotating secrets.

## Deploy (SAM)

```bash
cd apps/slack-bot-hoo-help
scripts/deploy.sh          # offline regression evals → sam build → sam deploy
scripts/deploy.sh --live   # also runs the live evals and asks before deploying
```

`deploy.sh` stops if the offline evals fail, and always runs `sam build` (a bare
`sam deploy` re-ships whatever is in `.aws-sam/build`). Set `PYTHON` to a venv
with the bot's dependencies if `python3` doesn't have them. Plain
`sam build && sam deploy` still works and is safe for Slack tokens.

After deploy, SAM prints **`SlackEventsUrl`**.

## Regression evals (`evals/`)

Two tiers, built from real (scrubbed) questions in session traces:

| Tier | Command | What it does |
|------|---------|--------------|
| Offline | `python evals/run.py --offline` | Replays each case's recorded tool output and model answer through today's formatting code (`format_for_slack`, Excel). Seconds, no network. **Exit 1 on any failure — blocks `deploy.sh`.** |
| Live | `python evals/run.py --live [--model ID]` | Sends cases with a `live` block to the real model + gateway (AWS creds from `.env`; ~10–15 min). Uses production's model (`BedrockModelId` in `samconfig.toml`), not `.env`'s `BEDROCK_MODEL_ID`, unless `--model` is given. Writes `evals/reports/live-*.md` with pass/fail, tools called and the full Slack text. Report only. |

Checks: Slack block limits (≤ 50 blocks, ≤ 1 table, ≤ 3000-char sections), no
raw markdown / `<thinking>` / leaked policy text / `Unknown tool` in what's
posted, answers not collapsed onto fewer words or lines, plus per-case expected
phrases, required block types (`expect.blocks`, e.g. `["table"]`), tools and
attachments. Phrases and collapse are checked against what Slack shows (the
blocks), not the notification fallback text. Run one case with `--case ID`.

Add a case when something goes wrong in Slack:

```bash
python evals/make_case.py logs/session-traces/2026/10/17/<id>.json --id my-case \
    --category occupancy --traces-dir logs/session-traces
```

It scrubs Slack ids and S3 paths, rebuilds thread history, and warns about
possible person names. Fill in `expect` (facts that must appear) and optionally
`live`, then run the offline tier.

---

## Slack app configuration

1. Open [api.slack.com/apps](https://api.slack.com/apps) → your HooHelp app.
2. Keep **Socket Mode** **Off**.
3. **Event Subscriptions** → **Enable Events** → set **Request URL** to `SlackEventsUrl`.
   - Slack will POST a `url_verification` challenge; Lambda/Bolt answers automatically.
4. Subscribe to bot events (**all of these for thread follow-ups**):
   - `app_mention` — @mentions in channels
   - `message.im` — DMs
   - `message.channels` — **required** for follow-ups in public channels without re-@mentioning
   - `message.groups` — **required** for follow-ups in private channels without re-@mentioning
5. **OAuth & Permissions** → ensure bot scopes include at least:
   - `app_mentions:read`
   - `chat:write`
   - `files:write` (Excel / CSV / JSON attachments when a question asks for a file)
   - `reactions:write` — bot adds :brain: on the user message while working (no “thinking…” reply)
   - `channels:history` / `groups:history` / `im:history` / `mpim:history` (thread context)
   - `channels:read` / `groups:read` as needed
6. Reinstall the app to the workspace if scopes or events changed.
7. **Invite the bot** to each channel where you want unmentioned thread follow-ups.
8. Smoke-test:
   - `@HooHelp when is Clemons open today?`
   - In the **reply thread** (no @mention): `what about RMC?`
   - Bot should answer using the same thread context.

### Thread follow-ups (how they work)

1. First answer is always posted **in a thread** under the user’s message.
2. Later messages in that thread are handled if:
   - the bot already replied in the thread, or
   - the parent (or an earlier message) @mentioned the bot.
3. Prior turns are loaded via `conversations.replies` and passed to Bedrock as history
   (pronouns / “what about X?”), while facts still come from MCP tools.
4. Without `message.channels` / `message.groups`, only new `@HooHelp` mentions are received.
5. **Group etiquette** (`src/chime_in.py`): when one person is talking with the bot, it answers
   every follow-up. Once two or more people are in the thread (or in a group DM), it replies to an
   unmentioned message only when addressed by name ("Hoo Helper, …"), when the person it just
   answered replies, or when a quick Gemma 3 12B check (`CHIME_IN_MODEL_ID`) judges the message
   is aimed at the assistant or is an unanswered library question. Unsure, error or timeout → silent.
   @mentions are always answered. Slackbot system notices are ignored. Skips are logged with a reason.
6. **Who's who** (`src/identity.py`): the model gets one line about the person asking (name, display
   name, title, pronouns only if set in their profile, Slack id — **never email**). Earlier human turns
   are labelled `[Name]: …` and `<@U…>` mentions become names. Lookups are cached for an hour.

### Slack search (`src/slack_search.py`)

Behind `EnableSlackSearch` (default `false`). Three in-process tools:

- `search_slack` — Slack's Real-time Search API (`assistant.search.context`) with the bot token,
  **public channels only**; optional `from_user` (a name or `me`), `channel`, `after` / `before`.
- `read_slack_thread` — the public thread around a hit (`conversations.replies`). It checks the
  channel is public first: the bot token also has `groups:history`, so this check is what keeps
  private channels, DMs and group DMs out.
- `list_slack_channel` (`src/slack_listing.py`) — every link, file or message in one public channel
  for a date range (default the last 30 days), for "all the URLs shared in #ai" requests that
  search's best-20 matches can't answer. Pages `conversations.history` with the bot token only (no
  action token), up to 2,000 top-level messages (thread replies aren't included; the reply says so
  and suggests a shorter range when capped). Only channels Hoo Helper has been added to — it never
  joins on its own and suggests `/invite @Hoo Helper` instead. The model sees the count and the
  first 50 rows; the full table goes into any requested file.

Scopes it relies on: `search:read.public`, `users:read`, `channels:history`, `channels:read`.

**Files:** when the question says "CSV", "JSON", "Excel / spreadsheet" or "RIS / Zotero",
`src/attachments.py` builds that file from this turn's tool tables (Slack listings, gate-count
tables) and the app uploads it to the thread; a follow-up keeps the format asked for earlier in the
thread. Values come from tool data, never from the model's prose. RIS (for Zotero / EndNote import)
covers links and files only: one web-page record per link, titled from Slack's link preview when
there is one, with the date shared and a note linking back to the Slack message. Virgo catalog
results this turn go in the same file as full citations from Virgo's own citations service
(`citations-ws`, with Virgo's public guest token; `src/virgo_citations.py`), up to 50 items; if the
service fails for an item, a basic record is built from the search output instead.

Bot-token searches need an `action_token`, which Slack sends on @mentions, DMs and group DMs but
not on unmentioned thread follow-ups. `src/action_tokens.py` saves it per thread in the DynamoDB
table `hoohelp-action-tokens-<stage>` (24 h TTL) and reuses it for follow-ups until Slack rejects
it; then the model is told Slack search needs a fresh @mention and says so only when relevant.
The token is never logged — logs show `action_token=present|reused|missing|expired`.

`SlackSearchAllow` (comma-separated channel and/or user ids) limits Slack search to those while
testing; leave it empty for everyone.

Session traces now include Slack excerpts and display names (same bucket, access and retention);
`evals/make_case.py` warns when a trace used the Slack tools.

### Confluence and Jira (`src/atlassian_tools.py`)

Behind `EnableAtlassian` (default `false`). Read-only tools against
`https://virginia-its.atlassian.net` (UVA ITS's shared site):

- `search_confluence` / `get_confluence_page` — CQL `siteSearch`, v2 pages (storage → markdown).
- `search_jira` / `get_jira_issue` — JQL built in code (`assignee="me"` works), issue + comments.

**Library only:** the site is shared with other UVA units, so Hoo Helper reads only the space and
project keys in `ConfluenceSpaces` / `JiraProjects`. An empty list switches that product off. Every
query is limited to the list and results are re-checked in code.

**Setup:**
1. A service account (or dedicated user) that can browse the Library spaces and projects only,
   plus Jira's *Browse users and groups* permission (for "assigned to me").
2. API tokens for it — scoped (read-only) tokens are issued per app, so one for Jira and one for
   Confluence. For a classic token (`AtlassianTokenType=classic`), store the same token in both.
3. SSM SecureString: `/hoohelp/atlassian/email`, `/hoohelp/atlassian/jira-token`,
   `/hoohelp/atlassian/confluence-token`. Read only when `EnableAtlassian=true`; tokens are never
   logged. A product with no token (or an empty allow-list) is simply not offered.

**"Me":** the asker's Slack profile email is matched to their Atlassian account. The email is
kept out of the prompt, tool output and logs (logs say `atlassian_me=matched|unmatched`).
Rejected credentials log `auth_failed source=atlassian`.

Session traces include Confluence and Jira excerpts; `evals/make_case.py` warns about them.

---

## Local agent test (no Slack)

```bash
# Uses GATEWAY_URL / AWS credentials from environment or .env
python3 test_bot_locally.py
```

---

## Configuration reference

| Variable / Parameter | Where | Purpose |
|----------------------|-------|---------|
| `/hoohelp/slack/bot-token` | SSM SecureString | Bot token (`xoxb-...`) |
| `/hoohelp/slack/signing-secret` | SSM SecureString | Events API signing secret |
| `GATEWAY_URL` | Lambda env | Public MCP gateway URL |
| `BEDROCK_MODEL_ID` | Lambda env | Agent model (`minimax.minimax-m2.5`, Converse + MCP tools) |
| `SLACK_LLM_FORMAT` | Lambda env | `false` (default): agent mrkdwn is cleaned and laid out in code. `true`: extra Gemma Block Kit rewrite pass |
| `SLACK_FORMAT_MODEL_ID` | Lambda env | Formatter model when `SLACK_LLM_FORMAT=true` (`google.gemma-4-31b`, Mantle Chat Completions) |
| `StageName` | SAM parameter | API stage (`prod`) |
| `ShowModelReasoning` | SAM parameter | `true` to show muted CoT under answers |
| `ConversationTrace` / `CONVERSATION_TRACE` | SAM / Lambda env | `off` · `cloudwatch` · `s3` · `both` (default **both**) |
| `CONVERSATION_TRACE_BUCKET` | Lambda env | S3 bucket for full transcripts (set by SAM) |
| `TraceRetentionDays` | SAM parameter | S3 lifecycle expiry for traces (default 30) |
| `EnableGuardrails` / `BEDROCK_GUARDRAIL_*` | SAM / Lambda env | Bedrock Guardrails for library-safe Converse |
| `EnableSlackSearch` / `ENABLE_SLACK_SEARCH` | SAM / Lambda env | `true` to enable `search_slack` / `read_slack_thread` (default `false`) |
| `SlackSearchAllow` / `SLACK_SEARCH_ALLOW` | SAM / Lambda env | Optional comma-separated channel/user ids allowed Slack search (empty = all) |
| `ACTION_TOKENS_TABLE` | Lambda env | DynamoDB table for per-thread Slack action tokens (set by SAM) |
| `EnableAtlassian` / `ENABLE_ATLASSIAN` | SAM / Lambda env | `true` to enable the Confluence/Jira tools (default `false`) |
| `ConfluenceSpaces` / `JiraProjects` | SAM / Lambda env | Library space / project keys allowed (empty = that product off) |
| `AtlassianTokenType` | SAM parameter | `scoped` (default) or `classic` |
| `/hoohelp/atlassian/email`, `/hoohelp/atlassian/jira-token`, `/hoohelp/atlassian/confluence-token` | SSM SecureString | Service account email and per-product API tokens |

`SLACK_APP_TOKEN` (`xapp-...`) is **not** used with Events API.

---

## Bedrock Guardrails (library assistant)

SAM creates **`hoohelp-library-assistant-<stage>`** and a published version. Lambda
passes `guardrailConfig` on every Bedrock **Converse** call (the MiniMax agent loop).
The optional Gemma formatter (`SLACK_LLM_FORMAT=true`) runs on **bedrock-mantle**,
which does not support Guardrails; it only restyles already-guarded agent output
into Block Kit JSON.

| Policy | Library-assistant settings |
|--------|----------------------------|
| **Content filters** | Hate / sexual / violence / misconduct at **MEDIUM**; insults **LOW** in / **MEDIUM** out (frustrated patrons); **PROMPT_ATTACK** **HIGH** on input |
| **Profanity** | Managed word list blocked |
| **Denied topics** | Medical diagnosis/treatment advice; legal advice; cybercrime/malware; weapons how-to; self-harm methods (catalog research about those fields is not the target) |
| **Sensitive info** | Anonymize SSN, payment cards, bank numbers, passwords, AWS keys, PINs |

Blocked messaging points users back to library help and
[Ask a Librarian](https://www.library.virginia.edu/askalibrarian).

Disable temporarily: deploy with `EnableGuardrails=false`, or set Lambda
`BEDROCK_GUARDRAIL_ENABLED=false`.

Stack outputs: `GuardrailId`, `GuardrailVersion`, `GuardrailArn`.

---

## Session traces (MCP development)

Each Slack turn records a structured transcript:

- user message + Slack ids (user / channel / thread)
- system prompt **hash** (optional full prompt via `TRACE_INCLUDE_SYSTEM_PROMPT=true`)
- every tool call: name, args, result text, latency, status
- raw model answer + Slack-formatted reply
- duration and error fields

**CloudWatch** (always a short pointer when `s3`-only; truncated bodies for `cloudwatch`/`both`):

```
fields @timestamp, request_id, user_message, tools_used.0, duration_ms, s3_uri, error
| filter event = "hoohelp_session_trace"
| sort @timestamp desc
| limit 50
```

**S3** full JSON (when mode is `s3` or `both`):

```text
s3://hoohelp-session-traces-<stage>-<account>/traces/YYYY/MM/DD/<request_id>.json
```

Stack output `TraceBucketName` is printed after `sam deploy`.

Pull a local copy for MCP development (gitignored under `logs/`):

```bash
./scripts/sync-session-traces.sh           # → logs/session-traces/
./scripts/sync-session-traces.sh --dry-run
```
