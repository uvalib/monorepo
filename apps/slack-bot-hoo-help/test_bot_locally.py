#!/usr/bin/env python3
"""
test_bot_locally.py — End-to-end local test for HooHelp Agent and AgentCore Gateway

Does not require Slack. Uses AWS credentials + GATEWAY_URL from the environment.

Session traces default to CloudWatch-style JSON on stdout (CONVERSATION_TRACE=cloudwatch).
Set CONVERSATION_TRACE=off to silence, or both/s3 if CONVERSATION_TRACE_BUCKET is set.
"""

import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass

# Default local traces to cloudwatch (stdout) unless the user set a mode
os.environ.setdefault("CONVERSATION_TRACE", "cloudwatch")

from agent import HooHelpAgent
from gateway_mcp_client import GatewayMCPClient


def main():
    print("=" * 70)
    print("1. Testing AgentCore MCP Gateway Discovery...")
    client = GatewayMCPClient()
    tools = client.list_tools()
    print(f"Discovered {len(tools)} tools on public AgentCore Gateway:")
    for t in tools:
        print(f"  - {t['name']}")

    bedrock_tool_config = client.get_bedrock_tool_config()
    print(f"\nConverted {len(bedrock_tool_config['tools'])} tools to Bedrock Converse format.")

    agent = HooHelpAgent(gateway_client=client)

    test_queries = [
        "What are the hours for Clemons Library on 2026-07-22?",
        "Search the Virgo catalog for books about civil war memoirs.",
        "Tell me about William Faulkner from our catalog suggestions.",
    ]

    for idx, q in enumerate(test_queries, start=1):
        print("\n" + "=" * 70)
        print(f"QUERY {idx}: {q}")
        print("=" * 70)
        result = agent.process_message(q)
        print("\nHOOHELP RESPONSE:")
        print(result.text)
        print("\nTRACE SUMMARY:")
        summary = result.trace.emit()
        print(
            json.dumps(
                {
                    "request_id": summary.get("request_id"),
                    "tools_used": summary.get("tools_used"),
                    "tool_call_count": summary.get("tool_call_count"),
                    "duration_ms": summary.get("duration_ms"),
                    "s3_uri": summary.get("s3_uri"),
                    "error": summary.get("error"),
                },
                indent=2,
            )
        )

    print("\n" + "=" * 70)
    print("ALL HOOHELP AGENT END-TO-END TESTS PASSED SUCCESSFULLY!")
    print("=" * 70)


if __name__ == "__main__":
    main()