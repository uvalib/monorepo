#!/usr/bin/env python3
"""
setup_gateway.py

Ensures the AgentCore Gateway MCP target(s) point at the OccupancyReporting
and VirgoCatalog runtimes and re-syncs the tool catalog.

Gateway (already created):
  ID: occupancy-reporting-gateway-mohw8c1jug

Idempotent:
  - Creates the IAM role if missing (with permissions to invoke any runtime in the account)
  - Creates/updates gateway targets for OccupancyReporting and VirgoCatalog
"""

import json
import time
import sys
import boto3
from botocore.exceptions import ClientError

REGION = "us-east-1"
ACCOUNT = "115119339709"
GATEWAY_ID = "occupancy-reporting-gateway-mohw8c1jug"
ROLE_NAME = "occupancy-reporting-gateway-role"

# Known target configurations
TARGET_DEFS = {
    "OccupancyReportingRuntime": {
        "runtime_name": "OccupancyReporting_OccupancyReportingMCP",
        "default_id": "OccupancyReporting_OccupancyReportingMCP-89mI4QDaYX",
        "description": "AgentCore Runtime hosting the occupancy reporting and library hours MCP tools"
    },
    "VirgoCatalogRuntime": {
        "runtime_name": "VirgoCatalog_VirgoCatalogMCP",
        "default_id": None,  # Resolved dynamically from AWS list_agent_runtimes
        "description": "AgentCore Runtime hosting the UVA Library Virgo Catalog search MCP tools"
    }
}

iam = boto3.client("iam", region_name=REGION)
control = boto3.client("bedrock-agentcore-control", region_name=REGION)

# ── Step 1: Ensure IAM role exists ────────────────────────────────────────
trust_policy = {
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Principal": {"Service": "bedrock-agentcore.amazonaws.com"},
        "Action": "sts:AssumeRole",
        "Condition": {"StringEquals": {"aws:SourceAccount": ACCOUNT}}
    }]
}

inline_policy = {
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Action": ["bedrock-agentcore:InvokeAgentRuntime"],
        "Resource": [
            f"arn:aws:bedrock-agentcore:{REGION}:{ACCOUNT}:runtime/*",
        ],
    }]
}

try:
    print(f"Creating/updating IAM role: {ROLE_NAME}...")
    resp = iam.create_role(
        RoleName=ROLE_NAME,
        AssumeRolePolicyDocument=json.dumps(trust_policy),
        Description="Execution role for the occupancy-reporting & virgo-catalog AgentCore Gateway",
    )
    role_arn = resp["Role"]["Arn"]
    iam.put_role_policy(
        RoleName=ROLE_NAME,
        PolicyName="invoke-agentcore-runtimes",
        PolicyDocument=json.dumps(inline_policy),
    )
    print(f"  Role ARN: {role_arn}")
    print("  Waiting 10s for IAM propagation...")
    time.sleep(10)
except iam.exceptions.EntityAlreadyExistsException:
    role_arn = iam.get_role(RoleName=ROLE_NAME)["Role"]["Arn"]
    print(f"  Role already exists: {role_arn}")
    iam.put_role_policy(
        RoleName=ROLE_NAME,
        PolicyName="invoke-agentcore-runtimes",
        PolicyDocument=json.dumps(inline_policy),
    )


def list_all_runtimes():
    """Discover all deployed agentcore runtimes in the account."""
    runtimes = {}
    token = None
    try:
        while True:
            kwargs = {"maxResults": 50}
            if token:
                kwargs["nextToken"] = token
            resp = control.list_agent_runtimes(**kwargs)
            for r in resp.get("agentRuntimes") or resp.get("items") or resp.get("runtimes") or []:
                rid = r.get("agentRuntimeId") or r.get("runtimeId") or r.get("id")
                rname = r.get("agentRuntimeName") or r.get("name") or r.get("runtimeName")
                if rid:
                    runtimes[rid] = rname or rid
                    if rname:
                        runtimes[rname] = rid
                        # Match without project prefix if present (e.g. VirgoCatalog_VirgoCatalogMCP -> VirgoCatalogMCP)
                        if "_" in rname:
                            runtimes[rname.split("_", 1)[1]] = rid
            token = resp.get("nextToken")
            if not token:
                break
    except Exception as e:
        print(f"Warning: Failed to list runtimes via API: {e}")
    return runtimes


def find_target_by_name(name: str):
    """Return target summary dict or None."""
    token = None
    while True:
        kwargs = {"gatewayIdentifier": GATEWAY_ID, "maxResults": 50}
        if token:
            kwargs["nextToken"] = token
        resp = control.list_gateway_targets(**kwargs)
        for t in resp.get("items") or resp.get("targets") or []:
            t_name = t.get("name") or t.get("targetName")
            if t_name == name:
                return t
        token = resp.get("nextToken")
        if not token:
            break
    return None


def setup_target(target_name: str, runtime_id: str, description: str):
    runtime_arn = f"arn:aws:bedrock-agentcore:{REGION}:{ACCOUNT}:runtime/{runtime_id}"
    encoded_arn = runtime_arn.replace(":", "%3A").replace("/", "%2F")
    runtime_url = f"https://bedrock-agentcore.{REGION}.amazonaws.com/runtimes/{encoded_arn}/invocations"

    target_config = {
        "mcp": {
            "mcpServer": {
                "endpoint": runtime_url,
            }
        }
    }
    cred_configs = [
        {
            "credentialProviderType": "GATEWAY_IAM_ROLE",
            "credentialProvider": {
                "iamCredentialProvider": {
                    "service": "bedrock-agentcore",
                    "region": REGION,
                }
            },
        }
    ]

    existing = find_target_by_name(target_name)
    if existing:
        target_id = existing.get("targetId") or existing.get("id")
        print(f"\nTarget '{target_name}' already exists (id={target_id}).")
        print("Updating target configuration...")
        updated = control.update_gateway_target(
            gatewayIdentifier=GATEWAY_ID,
            targetId=target_id,
            name=target_name,
            description=description,
            targetConfiguration=target_config,
            credentialProviderConfigurations=cred_configs,
        )
        print(f"  Status: {updated.get('status')}")
    else:
        print(f"\nCreating MCP server target '{target_name}' on gateway {GATEWAY_ID}...")
        created = control.create_gateway_target(
            gatewayIdentifier=GATEWAY_ID,
            name=target_name,
            description=description,
            targetConfiguration=target_config,
            credentialProviderConfigurations=cred_configs,
        )
        target_id = created["targetId"]
        print(f"  Target ID: {target_id}")
        print(f"  Status:    {created.get('status')}")


# ── Step 2: Resolve runtime IDs and update gateway targets ───────────────────
runtimes_map = list_all_runtimes()

for target_name, tdef in TARGET_DEFS.items():
    runtime_id = tdef["default_id"]
    if not runtime_id:
        rname = tdef["runtime_name"]
        runtime_id = runtimes_map.get(rname)

    if not runtime_id:
        print(f"\nSkip target '{target_name}': Runtime not found yet (deploy project first).")
        continue

    setup_target(target_name, runtime_id, tdef["description"])

# ── Step 3: Print summary ──────────────────────────────────────────────────
details = control.get_gateway(gatewayIdentifier=GATEWAY_ID)
gateway_url = details.get("gatewayUrl", "(not yet available — check console)")
mcp_endpoint = gateway_url if gateway_url.rstrip("/").endswith("/mcp") else f"{gateway_url}/mcp"

print("\n" + "=" * 60)
print("GATEWAY SYNC COMPLETE")
print("=" * 60)
print(f"Gateway ID:   {GATEWAY_ID}")
print(f"Gateway URL:  {gateway_url}")
print(f"MCP endpoint: {mcp_endpoint}")
print("=" * 60)

