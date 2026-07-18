# Occupancy Reporting MCP Server

An MCP (Model Context Protocol) server that exposes occupancy reporting and foot traffic analysis tools for all UVA Library locations. Deployed on AWS AgentCore Runtime and accessible through a public AgentCore Gateway endpoint.

---

## Public endpoint

```
https://occupancy-reporting-gateway-mohw8c1jug.gateway.bedrock-agentcore.us-east-1.amazonaws.com/mcp
```

No authentication required. Connect any MCP-compatible agent or client directly to this URL.

---

## Tools

### `get_libraries`
Lists all library locations available in the database.
- **Parameters**: none
- **Returns**: `list[str]`

### `get_foot_traffic`
Returns total entries, exits, and daily averages for a library over a date range.
- **Parameters**: `start_date` (YYYY-MM-DD), `end_date` (YYYY-MM-DD), `library` (e.g. `Clemons`, `Shannon`, `Science & Engineering`)
- **Returns**: `str` (Markdown summary)

### `get_occupancy_report`
Generates a full executive occupancy and data quality report including peak days/hours, hourly averages, and a data confidence rating.
- **Parameters**: `start_date`, `end_date`, `library`, `start_time` (default `"00:00"`), `end_time` (default `"24:00"`)
- **Returns**: `str` (Markdown report)

---

## Architecture

```
Agent / Client
    │  (no auth, HTTPS)
    ▼
AgentCore Gateway  (occupancy-reporting-gateway-mohw8c1jug)
    │  (SigV4, GATEWAY_IAM_ROLE)
    ▼
AgentCore Runtime  (OccupancyReporting_OccupancyReportingMCP-89mI4QDaYX)
    │  (VPC, private subnets, us-east-1)
    ▼
RDS MySQL  (rds-mysql8-production.internal.lib.virginia.edu)
```

- **Auth inbound to gateway**: none (`authorizerType: NONE`)
- **Auth gateway → runtime**: SigV4 via gateway execution role (`occupancy-reporting-gateway-role`)
- **Runtime auth**: SigV4 (default, no `authorizerConfiguration`)
- **Runtime network**: `uva-vpc-production`, private subnets `us-east-1a/b/c`
- **Security groups**: `ec2-rds-1` (MySQL outbound), `web-out-production` (HTTPS outbound for LibCal API)

---

## Camera data quirks (temporary)

The DB still has a few known hardware/config issues. The MCP applies corrections in
`OccupancyReporting/app/OccupancyReporting/camera_quirks.py` without mutating RDS.
Remove each hack once the corresponding records/configs are cleaned up.

| Quirk | What we do |
| :--- | :--- |
| Shannon 401 east entrance (`b8:a4:4f:5d:59:9e`) reports in/out reversed | Swap `count_in`/`count_out` before deltas |
| Staff Clemons-side connector (`b8:a4:4f:5d:31:54`) stored under Shannon | Always count as Clemons |
| `b8:a4:4f:5d:59:90` (`B8A44F5D5990`) stored under Shannon | Base/historical = Clemons; after **2026-06-17** swap = Fine Arts |
| Fine Arts (`B8A44F4F195D`) ↔ that Clemons camera physical swap on **2026-06-17** | Date-aware attribution: pre-swap FA↔Clemons homes; post-swap `B8A44F5D5990` is Fine Arts and `B8A44F4F195D` is Clemons |

Unit tests: `uv run python test_camera_quirks.py` from the app directory.

---

## Local development

### Requirements

- Python 3.10+ (required for MCP SDK)
- UVA VPN (`moresecure-vpn-pat-1.its.virginia.edu`) to reach the RDS database

### Setup

```bash
cd OccupancyReporting/app/OccupancyReporting
uv sync
```

### Environment variables

| Variable | Description |
| :--- | :--- |
| `DB_HOST` | RDS MySQL hostname |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | MySQL database name (`occupancy`) |

### Run the server locally

```bash
DB_HOST=rds-mysql8-production.internal.lib.virginia.edu \
DB_USER=occupancy_ro \
DB_PASSWORD=<password> \
DB_NAME=occupancy \
python OccupancyReporting/app/OccupancyReporting/main.py
```

Server starts on `http://0.0.0.0:8000`. Connect the MCP Inspector to `http://localhost:8000/mcp`.

### Smoke test

```bash
python test_mcp_locally.py
```

Queries the database, lists libraries, and verifies occupancy metric computations for the last 7 days.

### Claude Desktop (local)

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "occupancy-reporting": {
      "command": "/path/to/python3.10",
      "args": ["/path/to/OccupancyReporting/app/OccupancyReporting/main.py"],
      "env": {
        "DB_HOST": "rds-mysql8-production.internal.lib.virginia.edu",
        "DB_USER": "occupancy_ro",
        "DB_PASSWORD": "<password>",
        "DB_NAME": "occupancy"
      }
    }
  }
}
```

---

## Deploying to AWS AgentCore

### Prerequisites

- AWS CLI configured (`115119339709`, `us-east-1`)
- Node.js (for AgentCore CLI): `npm install -g @aws/agentcore`
- Docker running

### Deploy

```bash
cd OccupancyReporting
agentcore validate
agentcore deploy
```

The CLI builds the Docker image via CodeBuild, pushes to ECR, and updates the runtime. Takes ~5 minutes.

**Important:** `agentcore deploy` resets `authorizerConfiguration` to empty (SigV4 default) — this is the correct state. Do not re-add the `credentials` array to `agentcore.json` as it injects a `CREDENTIAL_NAME` env var that breaks the AgentCore sidecar health probe.

### After deploy — resync the gateway target

The gateway target needs to re-sync its tool catalog after each deploy:

```bash
cd ..
python ops/setup_gateway.py
```

Or use the AWS Console: AgentCore → Gateways → `occupancy-reporting-gateway-mohw8c1jug` → Targets → Synchronize.

### Test the deployment

```bash
# Direct runtime invocation (SigV4 via your IAM credentials)
python ops/test_invocation.py

# Through the public gateway (no auth)
curl -s -X POST \
  "https://occupancy-reporting-gateway-mohw8c1jug.gateway.bedrock-agentcore.us-east-1.amazonaws.com/mcp" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

---

## Cognito / OAuth (future)

The Cognito pool `us-east-1_mrkVZwdeA` (hosted at `bestsellers.auth.us-east-1.amazoncognito.com`) has three app clients configured for future use:

| Client | Type | Use |
| :--- | :--- | :--- |
| `occupancy-reporting-mcp-human` (`2s7er4nlmm6fdgj6nbkeio24fv`) | Authorization Code, no secret | Claude / browser users (requires UVA ITS to register the Cognito SP with Shibboleth) |
| `occupancy-reporting-mcp-hermes` (`3uuaqpphnu1vta1bap3n5uo6dk`) | Client Credentials | Hermes agent |

A resource server `occupancy-reporting-mcp` with scope `occupancy-reporting-mcp/invoke` is configured in the pool.

To get a machine token (Hermes):
```bash
HERMES_CLIENT_SECRET=<secret> source ops/setup_cognito.sh hermes
```

SP registration with UVA ITS is required before the human/Claude browser flow will work:
- **SP Entity ID**: `urn:amazon:cognito:sp:us-east-1_mrkVZwdeA`
- **ACS URL**: `https://bestsellers.auth.us-east-1.amazoncognito.com/saml2/idpresponse`

---

## Project structure

```
occupancy-reporting-mcp/
├── OccupancyReporting/              # AgentCore project
│   ├── agentcore/                   # CLI config, CDK stack, credentials
│   │   ├── agentcore.json           # Runtime spec (entrypoint, VPC, env vars)
│   │   └── .env.local               # Secrets (not committed) — DB_PASSWORD
│   └── app/OccupancyReporting/      # Python source
│       ├── main.py                  # FastMCP server entrypoint
│       ├── db_helper.py             # RDS connection and query helpers
│       ├── processing.py            # Occupancy data processing pipeline
│       ├── report_generator.py      # Report formatting and metrics
│       ├── hours_helper.py          # LibCal API integration
│       ├── Dockerfile               # ARM64 Python 3.10-slim container
│       └── pyproject.toml           # Dependencies
├── ops/                             # Operational scripts
│   ├── setup_cognito.sh             # Cognito app client / token management
│   ├── setup_gateway.py             # Create/recreate the AgentCore gateway target
│   ├── update_runtime_auth.py       # Set OAuth auth on the runtime (advanced)
│   ├── reset_runtime_auth.py        # Reset runtime to SigV4 (default/working state)
│   └── test_invocation.py           # Test runtime directly via SigV4
├── test_mcp_locally.py              # Local smoke test
└── README.md
```
