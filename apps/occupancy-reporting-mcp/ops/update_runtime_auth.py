import boto3, json, time

REGION = "us-east-1"
RUNTIME_ID = "OccupancyReporting_OccupancyReportingMCP-89mI4QDaYX"
GATEWAY_ID = "occupancy-reporting-gateway-mohw8c1jug"

control = boto3.client("bedrock-agentcore-control", region_name=REGION)

# Get full current runtime config (needed for update — all required fields must be passed)
runtime = control.get_agent_runtime(agentRuntimeId=RUNTIME_ID)
runtime.pop("ResponseMetadata", None)

print("Current runtime status:", runtime.get("status"))
print("Current authorizerConfiguration:", runtime.get("authorizerConfiguration"))

# Update the runtime to accept OAuth tokens from our Cognito pool.
# The runtime will validate Bearer tokens against the Cognito JWKS endpoint.
# Allowed scope: occupancy-reporting-mcp/invoke (what Hermes client credentials produce)
# Strip requireServiceS3Endpoint — not modifiable on runtimes created after 2026-06-11
net_config = runtime["networkConfiguration"].copy()
if "networkModeConfig" in net_config and "requireServiceS3Endpoint" in net_config["networkModeConfig"]:
    del net_config["networkModeConfig"]["requireServiceS3Endpoint"]

print("\nUpdating runtime authorizerConfiguration to accept OAuth tokens...")
resp = control.update_agent_runtime(
    agentRuntimeId=RUNTIME_ID,
    agentRuntimeArtifact=runtime["agentRuntimeArtifact"],
    roleArn=runtime["roleArn"],
    networkConfiguration=net_config,
    authorizerConfiguration={
        "customJWTAuthorizer": {
            "discoveryUrl": (
                "https://cognito-idp.us-east-1.amazonaws.com/"
                "us-east-1_mrkVZwdeA/.well-known/openid-configuration"
            ),
            "allowedScopes": ["occupancy-reporting-mcp/invoke"],
            "allowedClients": ["3uuaqpphnu1vta1bap3n5uo6dk"],  # Hermes client
        }
    },
    environmentVariables=runtime.get("environmentVariables", {}),
)
print(f"Update response status: {resp.get('status')}")

# Wait for runtime to be READY
print("Waiting for runtime to return to READY...")
for i in range(12):
    time.sleep(10)
    status = control.get_agent_runtime(agentRuntimeId=RUNTIME_ID).get("status")
    print(f"  [{(i+1)*10}s] status: {status}")
    if status == "READY":
        break

# Verify auth config was applied
updated = control.get_agent_runtime(agentRuntimeId=RUNTIME_ID)
print("\nUpdated authorizerConfiguration:")
print(json.dumps(updated.get("authorizerConfiguration", {}), indent=2, default=str))

# Test runtime directly with a fresh OAuth token
print("\nTesting runtime directly with OAuth token...")
import urllib.request, urllib.error, urllib.parse

token_data = urllib.parse.urlencode({
    "grant_type": "client_credentials",
    "client_id": "3uuaqpphnu1vta1bap3n5uo6dk",
    "client_secret": "1djr8bij2i4nhb36b3mcmngnv0ugdo8f2uh12v1um9k7nmvep2c7",
    "scope": "occupancy-reporting-mcp/invoke"
}).encode()

with urllib.request.urlopen(urllib.request.Request(
    "https://bestsellers.auth.us-east-1.amazoncognito.com/oauth2/token",
    data=token_data,
    headers={"Content-Type": "application/x-www-form-urlencoded"},
    method="POST"
)) as r:
    bearer = json.loads(r.read())["access_token"]
    print(f"Got token: {bearer[:30]}...")

ACCOUNT = "115119339709"
RUNTIME_ARN = f"arn:aws:bedrock-agentcore:{REGION}:{ACCOUNT}:runtime/{RUNTIME_ID}"
ENCODED_ARN = RUNTIME_ARN.replace(":", "%3A").replace("/", "%2F")
RUNTIME_URL = f"https://bedrock-agentcore.{REGION}.amazonaws.com/runtimes/{ENCODED_ARN}/invocations"

req = urllib.request.Request(
    RUNTIME_URL,
    data=b'{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}',
    headers={
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
        "Authorization": f"Bearer {bearer}"
    },
    method="POST"
)
try:
    with urllib.request.urlopen(req) as r:
        print(f"Runtime response: {r.read().decode()[:500]}")
except urllib.error.HTTPError as e:
    print(f"HTTP {e.code}: {e.read().decode()[:300]}")
