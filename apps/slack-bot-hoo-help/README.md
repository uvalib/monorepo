# HooHelp Slack Bot (`slack-bot-hoo-help`)

Intelligent Slack bot for the University of Virginia (UVA) Library system.

- **LLM:** Amazon Bedrock Nova Pro (`us.amazon.nova-pro-v1:0`)
- **Tools:** Public AgentCore MCP Gateway (occupancy, Virgo catalog, knowledge bases)
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
Bedrock Converse (Nova Pro)  +  AgentCore MCP Gateway tools
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
4. Subscribe to bot events (at minimum):
   - `app_mention`
   - `message.im` (DMs)
   - `message.channels` and/or `message.groups` if you want unmentioned thread follow-ups in channels/private channels
5. **OAuth & Permissions** → ensure bot scopes include at least:
   - `app_mentions:read`
   - `chat:write`
   - `channels:history` / `groups:history` / `im:history` / `mpim:history` (as needed for threads/DMs)
6. Reinstall the app to the workspace if scopes changed.
7. Smoke-test: mention `@HooHelp` in a channel and DM the bot.

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
| `BEDROCK_MODEL_ID` | Lambda env | Bedrock model / inference profile |
| `StageName` | SAM parameter | API stage (`prod`) |
| `ShowModelReasoning` | SAM parameter | `true` to show muted CoT under answers |

`SLACK_APP_TOKEN` (`xapp-...`) is **not** used with Events API.
