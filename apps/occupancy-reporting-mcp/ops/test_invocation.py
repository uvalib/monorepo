import boto3, json
from botocore.auth import SigV4Auth
from botocore.awsrequest import AWSRequest
from botocore.credentials import Credentials
import urllib.request

REGION = "us-east-1"
ACCOUNT = "115119339709"
RUNTIME_ID = "OccupancyReporting_OccupancyReportingMCP-89mI4QDaYX"
RUNTIME_ARN = f"arn:aws:bedrock-agentcore:{REGION}:{ACCOUNT}:runtime/{RUNTIME_ID}"
ENCODED_ARN = RUNTIME_ARN.replace(":", "%3A").replace("/", "%2F")
URL = f"https://bedrock-agentcore.{REGION}.amazonaws.com/runtimes/{ENCODED_ARN}/invocations"

body = json.dumps({"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}})

# Sign with SigV4 using our IAM credentials
session = boto3.Session()
creds = session.get_credentials().get_frozen_credentials()

request = AWSRequest(
    method="POST",
    url=URL,
    data=body.encode(),
    headers={
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
    }
)

SigV4Auth(creds, "bedrock-agentcore", REGION).add_auth(request)

print(f"Calling {URL}")
print("Headers:", dict(request.headers))

req = urllib.request.Request(
    URL,
    data=body.encode(),
    headers=dict(request.headers),
    method="POST"
)

import urllib.error
try:
    import socket
    socket.setdefaulttimeout(15)
    with urllib.request.urlopen(req) as r:
        print(f"HTTP {r.status}: {r.read().decode()[:500]}")
except urllib.error.HTTPError as e:
    print(f"HTTP {e.code}: {e.read().decode()[:500]}")
except Exception as e:
    print(f"Error: {type(e).__name__}: {e}")
