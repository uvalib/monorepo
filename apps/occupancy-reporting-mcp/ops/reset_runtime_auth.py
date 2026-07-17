import boto3, json, time

REGION = "us-east-1"
RUNTIME_ID = "OccupancyReporting_OccupancyReportingMCP-89mI4QDaYX"

c = boto3.client("bedrock-agentcore-control", region_name=REGION)
runtime = c.get_agent_runtime(agentRuntimeId=RUNTIME_ID)
runtime.pop("ResponseMetadata", None)

net_config = runtime["networkConfiguration"].copy()
if "networkModeConfig" in net_config:
    net_config["networkModeConfig"].pop("requireServiceS3Endpoint", None)

print("Resetting authorizerConfiguration to empty (SigV4 default)...")
resp = c.update_agent_runtime(
    agentRuntimeId=RUNTIME_ID,
    agentRuntimeArtifact=runtime["agentRuntimeArtifact"],
    roleArn=runtime["roleArn"],
    networkConfiguration=net_config,
    environmentVariables=runtime.get("environmentVariables", {}),
    # No authorizerConfiguration = SigV4 default
)
print("Status:", resp.get("status"))

for i in range(6):
    time.sleep(5)
    s = c.get_agent_runtime(agentRuntimeId=RUNTIME_ID)["status"]
    print(f"  [{(i+1)*5}s] {s}")
    if s == "READY":
        break

print("\nDone. Auth reset to SigV4 (empty).")
print("Now check if probes appear in logs when a request is made.")
