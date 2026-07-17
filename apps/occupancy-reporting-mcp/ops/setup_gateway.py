#!/usr/bin/env python3
"""
setup_gateway.py
Creates an AgentCore Gateway with no-auth inbound access, pointing at the
OccupancyReporting MCP runtime as an mcpServer target.

The gateway already exists (created in a prior run):
  ID: occupancy-reporting-gateway-mohw8c1jug

This script creates the MCP server target against that gateway and prints
the public endpoint URL.
"""

import json
import time
import boto3

REGION = "us-east-1"
ACCOUNT = "115119339709"
RUNTIME_ID = "OccupancyReporting_OccupancyReportingMCP-89mI4QDaYX"
RUNTIME_ARN = f"arn:aws:bedrock-agentcore:{REGION}:{ACCOUNT}:runtime/{RUNTIME_ID}"

ENCODED_ARN = RUNTIME_ARN.replace(":", "%3A").replace("/", "%2F")
RUNTIME_URL = (
    f"https://bedrock-agentcore.{REGION}.amazonaws.com"
    f"/runtimes/{ENCODED_ARN}/invocations"
)

# Gateway was already created — skip re-creation
GATEWAY_ID = "occupancy-reporting-gateway-mohw8c1jug"

ROLE_NAME = "occupancy-reporting-gateway-role"

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

# Hierarchical auth: InvokeAgentRuntime is evaluated against BOTH the
# runtime ARN and the runtime-endpoint ARN. The base runtime ARN alone
# is not enough — the endpoint path must be included (or use a trailing *).
inline_policy = {
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Action": ["bedrock-agentcore:InvokeAgentRuntime"],
        "Resource": [
            RUNTIME_ARN,
            f"{RUNTIME_ARN}/runtime-endpoint/*",
        ],
    }]
}

try:
    print(f"Creating IAM role: {ROLE_NAME}...")
    resp = iam.create_role(
        RoleName=ROLE_NAME,
        AssumeRolePolicyDocument=json.dumps(trust_policy),
        Description="Execution role for the occupancy-reporting AgentCore Gateway",
    )
    role_arn = resp["Role"]["Arn"]
    iam.put_role_policy(
        RoleName=ROLE_NAME,
        PolicyName="invoke-occupancy-runtime",
        PolicyDocument=json.dumps(inline_policy),
    )
    print(f"  Role ARN: {role_arn}")
    print("  Waiting 10s for IAM propagation...")
    time.sleep(10)
except iam.exceptions.EntityAlreadyExistsException:
    role_arn = iam.get_role(RoleName=ROLE_NAME)["Role"]["Arn"]
    print(f"  Role already exists: {role_arn}")

# ── Step 2: Create the MCP server target ──────────────────────────────────
print(f"\nCreating MCP server target on gateway {GATEWAY_ID}...")
target = control.create_gateway_target(
    gatewayIdentifier=GATEWAY_ID,
    name="OccupancyReportingRuntime",
    description="AgentCore Runtime hosting the occupancy reporting MCP tools",
    targetConfiguration={
        "mcp": {
            "mcpServer": {
                "endpoint": RUNTIME_URL,
            }
        }
    },
    credentialProviderConfigurations=[
        {
            "credentialProviderType": "GATEWAY_IAM_ROLE",
            "credentialProvider": {
                "iamCredentialProvider": {
                    "service": "bedrock-agentcore",
                    "region": REGION,
                }
            },
        }
    ],
)

print(f"  Target ID: {target['targetId']}")
print(f"  Status:    {target.get('status')}")

# ── Step 3: Print the public endpoint ─────────────────────────────────────
details = control.get_gateway(gatewayIdentifier=GATEWAY_ID)
gateway_url = details.get("gatewayUrl", "(not yet available — check console)")

print("\n" + "=" * 60)
print("GATEWAY READY")
print("=" * 60)
print(f"Gateway ID:   {GATEWAY_ID}")
print(f"Gateway URL:  {gateway_url}")
print(f"MCP endpoint: {gateway_url}/mcp")
print()
print("Give this URL to Hermes and Open Claw — no auth required.")
print()
print("Full gateway details:")
print(json.dumps(details, indent=2, default=str))
