#!/usr/bin/env python3
"""
setup_gateway.py

Ensures the AgentCore Gateway MCP target points at the OccupancyReporting
runtime and re-syncs the tool catalog (needed after each runtime deploy when
tools are added/renamed).

Gateway (already created):
  ID: occupancy-reporting-gateway-mohw8c1jug

Idempotent:
  - Creates the IAM role if missing
  - Creates the gateway target if missing
  - Updates + synchronizes the target if it already exists
"""

import json
import time
import boto3
from botocore.exceptions import ClientError

REGION = "us-east-1"
ACCOUNT = "115119339709"
RUNTIME_ID = "OccupancyReporting_OccupancyReportingMCP-89mI4QDaYX"
RUNTIME_ARN = f"arn:aws:bedrock-agentcore:{REGION}:{ACCOUNT}:runtime/{RUNTIME_ID}"

ENCODED_ARN = RUNTIME_ARN.replace(":", "%3A").replace("/", "%2F")
RUNTIME_URL = (
    f"https://bedrock-agentcore.{REGION}.amazonaws.com"
    f"/runtimes/{ENCODED_ARN}/invocations"
)

GATEWAY_ID = "occupancy-reporting-gateway-mohw8c1jug"
TARGET_NAME = "OccupancyReportingRuntime"
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
# runtime ARN and the runtime-endpoint ARN.
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
    # Keep invoke policy current
    iam.put_role_policy(
        RoleName=ROLE_NAME,
        PolicyName="invoke-occupancy-runtime",
        PolicyDocument=json.dumps(inline_policy),
    )

TARGET_CONFIGURATION = {
    "mcp": {
        "mcpServer": {
            "endpoint": RUNTIME_URL,
        }
    }
}

CREDENTIAL_PROVIDER_CONFIGS = [
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


def find_target_by_name(name: str):
    """Return target summary dict or None."""
    token = None
    while True:
        kwargs = {"gatewayIdentifier": GATEWAY_ID, "maxResults": 50}
        if token:
            kwargs["nextToken"] = token
        resp = control.list_gateway_targets(**kwargs)
        for t in resp.get("items") or resp.get("targets") or []:
            # API may return name at top level or nested
            t_name = t.get("name") or t.get("targetName")
            if t_name == name:
                return t
        token = resp.get("nextToken")
        if not token:
            break
    return None


# ── Step 2: Create or update the MCP server target ────────────────────────
existing = find_target_by_name(TARGET_NAME)

if existing:
    target_id = existing.get("targetId") or existing.get("id")
    print(f"\nTarget '{TARGET_NAME}' already exists (id={target_id}).")
    print("Updating target configuration...")
    updated = control.update_gateway_target(
        gatewayIdentifier=GATEWAY_ID,
        targetId=target_id,
        name=TARGET_NAME,
        description="AgentCore Runtime hosting the occupancy reporting MCP tools",
        targetConfiguration=TARGET_CONFIGURATION,
        credentialProviderConfigurations=CREDENTIAL_PROVIDER_CONFIGS,
    )
    print(f"  Status: {updated.get('status')}")
else:
    print(f"\nCreating MCP server target on gateway {GATEWAY_ID}...")
    created = control.create_gateway_target(
        gatewayIdentifier=GATEWAY_ID,
        name=TARGET_NAME,
        description="AgentCore Runtime hosting the occupancy reporting MCP tools",
        targetConfiguration=TARGET_CONFIGURATION,
        credentialProviderConfigurations=CREDENTIAL_PROVIDER_CONFIGS,
    )
    target_id = created["targetId"]
    print(f"  Target ID: {target_id}")
    print(f"  Status:    {created.get('status')}")

# ── Step 3: Tool catalog ──────────────────────────────────────────────────
# This gateway target uses listingMode=DYNAMIC — tools are discovered live via
# tools/list on the runtime. SynchronizeGatewayTargets is not supported/needed.
target_details = control.get_gateway_target(
    gatewayIdentifier=GATEWAY_ID,
    targetId=target_id,
)
print(f"\nTarget status: {target_details.get('status')}")
print("  (Dynamic MCP target — tools refresh from runtime tools/list; no sync call needed.)")

# ── Step 4: Print the public endpoint ─────────────────────────────────────
details = control.get_gateway(gatewayIdentifier=GATEWAY_ID)
gateway_url = details.get("gatewayUrl", "(not yet available — check console)")
# gatewayUrl already ends with /mcp for this protocol
mcp_endpoint = gateway_url if gateway_url.rstrip("/").endswith("/mcp") else f"{gateway_url}/mcp"

print("\n" + "=" * 60)
print("GATEWAY READY")
print("=" * 60)
print(f"Gateway ID:   {GATEWAY_ID}")
print(f"Gateway URL:  {gateway_url}")
print(f"MCP endpoint: {mcp_endpoint}")
print(f"Target name:  {TARGET_NAME}")
print(f"Target ID:    {target_id}")
print()
print("After deploy: wait for the runtime to go READY, then tools/list will")
print("pick up new tools (e.g. get_library_hours) automatically.")
print()
print("Full gateway details:")
print(json.dumps(details, indent=2, default=str))
