# Occupancy Reporting MCP Server

An official Model Context Protocol (MCP) server that exposes occupancy reporting and foot traffic analysis tools for all UVA Library locations.

This server is designed to run in AWS AgentCore or any standard MCP client host (e.g., Claude Desktop).

---

## 🚀 Features

* **Dynamic Location Discovery**: Queries the database on startup to identify all available library locations and their associated camera serial numbers automatically.
* **Intelligent DB Range Scanning**: Performs estimated primary-key lookups to query millions of rows in seconds without full table scans.
* **Operating Hours Integration**: Fetches real-time library schedules from the LibCal API, aligning occupancy estimations with actual staffed opening windows.
* **Robust Data Cleansing**: Automatically handles hardware/counter resets and suppresses off-hours traffic anomalies.
* **Standardized MCP Tools**: Exposes clean, agent-friendly tools returning both structured metrics and pre-formatted executive Markdown reports.

---

## 🛠️ Requirements

* **Python 3.10+** (Required for pattern matching support used by the Anthropic MCP SDK)
* **Access to UVA Secure VPN** (`moresecure-vpn-pat-1.its.virginia.edu`) to connect to the production RDS database.

---

## ⚙️ Configuration

The server reads database credentials from environment variables. You can configure them locally via a `.env` file or pass them directly when running the container/process:

| Environment Variable | Description | Default Value |
| :--- | :--- | :--- |
| `DB_HOST` | RDS MySQL Hostname | `rds-mysql8-production.internal.lib.virginia.edu` |
| `DB_USER` | MySQL Username | `occupancy_ro` |
| `DB_PASSWORD` | MySQL Password | `Kagaim3CaiXie1` |
| `DB_NAME` | MySQL Database Name | `occupancy` |

---

## 📦 Setup & Installation

1. Navigate to the project directory:
   ```bash
   cd apps/occupancy-reporting-mcp
   ```

2. Create a virtual environment using Python 3.10:
   ```bash
   /opt/homebrew/Cellar/python@3.10/3.10.18/Frameworks/Python.framework/Versions/3.10/Resources/Python.app/Contents/MacOS/Python -m venv .venv --system-site-packages
   ```

3. Install required database drivers and libraries:
   ```bash
   .venv/bin/pip install pymysql
   ```

---

## 🧪 Testing Locally

To confirm the database connection and processing pipeline are fully operational before hosting the MCP server:
```bash
.venv/bin/python test_mcp_locally.py
```
This utility script will query the database, list discovered libraries, and verify occupancy metric computations for the last 7 days.

---

## 🔌 Running the MCP Server

The server communicates via standard input/output (`stdio`).

Start the server using:
```bash
.venv/bin/python server.py
```

### Hosting in Claude Desktop
To test the server within Claude Desktop, add the following to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "occupancy-reporting": {
      "command": "/Users/dhc4z/workspace/monorepo/apps/occupancy-reporting-mcp/.venv/bin/python",
      "args": ["/Users/dhc4z/workspace/monorepo/apps/occupancy-reporting-mcp/server.py"],
      "env": {
        "DB_HOST": "rds-mysql8-production.internal.lib.virginia.edu",
        "DB_USER": "occupancy_ro",
        "DB_PASSWORD": "Kagaim3CaiXie1",
        "DB_NAME": "occupancy"
      }
    }
  }
}
```

---

## 🛠️ MCP Tools Reference

### `get_libraries`
* **Parameters**: None
* **Returns**: `list[str]`
* **Description**: Lists all unique library short names defined in the `cameras` table.

### `get_foot_traffic`
* **Parameters**:
  * `start_date` (string, format `YYYY-MM-DD`): Start date.
  * `end_date` (string, format `YYYY-MM-DD`): End date.
  * `library` (string): Library name (e.g. `Clemons`, `Shannon`, `Science & Engineering`).
* **Returns**: `str`
* **Description**: Returns a quick summary of total visitor entries, exits, and daily averages.

### `get_occupancy_report`
* **Parameters**:
  * `start_date` (string, format `YYYY-MM-DD`): Start date.
  * `end_date` (string, format `YYYY-MM-DD`): End date.
  * `library` (string): Library name.
  * `start_time` (string, optional, default `"00:00"`): Filter starting time.
  * `end_time` (string, optional, default `"24:00"`): Filter ending time.
* **Returns**: `str`
* **Description**: Generates the complete executive occupancy analysis report (with average hourly tables, peak days/hours, and data confidence ratings).

---

## ☁️ Deploying to AWS AgentCore Runtime

### Prerequisites

- AWS CLI configured with appropriate permissions
- Node.js installed (for the AgentCore CLI)
- Docker installed and running
- `jq` installed (used by `setup_cognito.sh`)

Install the AgentCore CLI:

```bash
npm install -g @aws/agentcore
```

---

### Step 1: Set up Cognito authentication

This server uses the existing UVA Shibboleth-federated Cognito pool (`us-east-1_mrkVZwdeA`). Authentication goes through the Cognito Hosted UI → `virginia.edu` Shibboleth IdP → JWT. No new pool is needed.

Run the setup script to create a dedicated App Client for this MCP server:

```bash
source setup_cognito.sh
```

The script outputs and exports:
- `CLIENT_ID` — used during `agentcore create`
- `DISCOVERY_URL` — used during `agentcore create`

> **Note:** Because the pool uses Shibboleth federation, there is no programmatic username/password flow. Bearer tokens for invoking the deployed server must be obtained via the browser-based Authorization Code flow (the script prints a `HOSTED_UI_URL` you can use to test this manually). Tokens expire after 1 hour.

---

### Step 2: Scaffold the AgentCore project

From the `apps/occupancy-reporting-mcp` directory:

```bash
agentcore create --protocol MCP
```

When prompted, provide:
- **Project name**: `occupancy-reporting`
- **Discovery URL**: the value output by `setup_cognito.sh`
- **Client ID**: the value output by `setup_cognito.sh`

The CLI creates the `agentcore/agentcore.json` config (already present in this repo).

---

### Step 3: Deploy

```bash
agentcore deploy
```

This will:
1. Build and push a Docker image using the `Dockerfile` in this directory
2. Upload the artifact to S3
3. Create an AgentCore Runtime and deploy the container

After deployment you'll receive a Runtime ARN:

```
arn:aws:bedrock-agentcore:<region>:<account-id>:runtime/occupancy-reporting-<id>
```

Save this as `AGENT_ARN`:

```bash
export AGENT_ARN="arn:aws:bedrock-agentcore:us-east-1:123456789012:runtime/occupancy-reporting-abc123"
```

---

### Step 4: Invoke the deployed server

Test with a quick MCP client call:

```python
import asyncio, os
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

async def main():
    agent_arn   = os.environ["AGENT_ARN"]
    bearer_token = os.environ["BEARER_TOKEN"]
    encoded_arn = agent_arn.replace(":", "%3A").replace("/", "%2F")
    url = f"https://bedrock-agentcore.us-east-1.amazonaws.com/runtimes/{encoded_arn}/invocations?qualifier=DEFAULT"
    headers = {"authorization": f"Bearer {bearer_token}", "Content-Type": "application/json"}

    async with streamablehttp_client(url, headers, timeout=120, terminate_on_close=False) as (r, w, _):
        async with ClientSession(r, w) as session:
            await session.initialize()
            print(await session.list_tools())

asyncio.run(main())
```

Or use the MCP Inspector for a visual interface:

```bash
npx @modelcontextprotocol/inspector
```

Connect to:
```
https://bedrock-agentcore.<region>.amazonaws.com/runtimes/<ENCODED_ARN>/invocations?qualifier=DEFAULT
```
with header `Authorization: Bearer <BEARER_TOKEN>`.

---

### Environment variables (container)

The following must be set as environment variables on the AgentCore Runtime (configure via the AWS Console, CLI, or `agentcore.json`):

| Variable | Description |
| :--- | :--- |
| `DB_HOST` | RDS MySQL hostname |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password (use a secret) |
| `DB_NAME` | MySQL database name |

> **Network note:** The AgentCore Runtime must have VPC connectivity (or a VPN/Transit Gateway route) to reach `rds-mysql8-production.internal.lib.virginia.edu`. Configure the runtime's VPC settings accordingly during deployment.

---

### File reference

| File | Purpose |
| :--- | :--- |
| `Dockerfile` | Container image — Python 3.10-slim, runs `server.py --http` |
| `agentcore/agentcore.json` | AgentCore CLI config (entrypoint, protocol, env vars) |
| `setup_cognito.sh` | Creates the `occupancy-reporting-mcp` App Client in the existing UVA Shibboleth Cognito pool |
