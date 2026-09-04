# HooHelp Slack Bot (`slack-bot-hoo-help`)

Intelligent Slack bot for the University of Virginia (UVA) Library system.

- **Agent LLM:** Amazon Bedrock MiniMax M2.5 (`minimax.minimax-m2.5`) via Converse + MCP tools
- **Formatter LLM:** Gemma 4 31B (`google.gemma-4-31b`) on Bedrock Mantle, `tool_choice` locked to the Block Kit JSON schema
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
Bedrock Mantle Chat Completions (Gemma 4 31B, Block Kit tool_choice)
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
sam build
sam deploy   # safe — does not take Slack tokens as CLI params
```

After deploy, SAM prints **`SlackEventsUrl`**.

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
| `SLACK_FORMAT_MODEL_ID` | Lambda env | Formatter model (`google.gemma-4-31b`, Mantle Chat Completions) |
| `StageName` | SAM parameter | API stage (`prod`) |
| `ShowModelReasoning` | SAM parameter | `true` to show muted CoT under answers |
| `ConversationTrace` / `CONVERSATION_TRACE` | SAM / Lambda env | `off` · `cloudwatch` · `s3` · `both` (default **both**) |
| `CONVERSATION_TRACE_BUCKET` | Lambda env | S3 bucket for full transcripts (set by SAM) |
| `TraceRetentionDays` | SAM parameter | S3 lifecycle expiry for traces (default 30) |
| `EnableGuardrails` / `BEDROCK_GUARDRAIL_*` | SAM / Lambda env | Bedrock Guardrails for library-safe Converse |

`SLACK_APP_TOKEN` (`xapp-...`) is **not** used with Events API.

---

## Bedrock Guardrails (library assistant)

SAM creates **`hoohelp-library-assistant-<stage>`** and a published version. Lambda
passes `guardrailConfig` on every Bedrock **Converse** call (the MiniMax agent loop).
The Gemma formatter runs on **bedrock-mantle**, which does not support Guardrails;
it only restyles already-guarded agent output into Block Kit JSON.

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
