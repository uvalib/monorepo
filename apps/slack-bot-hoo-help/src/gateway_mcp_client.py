"""
gateway_mcp_client.py — AgentCore MCP Gateway Client

Interacts with the public AWS AgentCore MCP Gateway over Streamable HTTP:
- Discovers active MCP tools via tools/list
- Executes tool calls via tools/call
- Converts MCP schemas into Amazon Bedrock Converse toolConfig format
"""

import logging
import time
from typing import Any, Dict, List, Optional

import requests

logger = logging.getLogger(__name__)

DEFAULT_GATEWAY_URL = (
    "https://occupancy-reporting-gateway-mohw8c1jug.gateway.bedrock-agentcore.us-east-1.amazonaws.com/mcp"
)


class GatewayMCPClient:

    def __init__(self, gateway_url: str = DEFAULT_GATEWAY_URL):
        self.gateway_url = gateway_url.rstrip("/")
        self._tools_cache: Optional[List[Dict[str, Any]]] = None
        self._tools_cache_at: float = 0.0
        # Gateway tool schemas can change (e.g. pagination fields). Don't pin
        # a Lambda container to a stale tools/list for the whole warm lifetime.
        self._tools_cache_ttl_s = 120.0

    def list_tools(self, force_refresh: bool = False) -> List[Dict[str, Any]]:
        """Fetch list of tools exposed on the AgentCore Gateway."""
        now = time.monotonic()
        cache_fresh = (
            self._tools_cache is not None
            and (now - self._tools_cache_at) < self._tools_cache_ttl_s
        )
        if cache_fresh and not force_refresh:
            return self._tools_cache

        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/list",
            "params": {},
        }
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream",
        }

        try:
            resp = requests.post(self.gateway_url, json=payload, headers=headers, timeout=15)
            resp.raise_for_status()
            data = resp.json()
            tools = data.get("result", {}).get("tools", [])
            self._tools_cache = tools
            self._tools_cache_at = time.monotonic()
            logger.info("Loaded %s tools from AgentCore Gateway (%s)", len(tools), self.gateway_url)
            return tools
        except Exception as e:
            logger.error("Failed to fetch tools from Gateway: %s", e)
            return self._tools_cache or []

    def call_tool(self, name: str, arguments: Dict[str, Any]) -> str:
        """Invoke a tool on the AgentCore Gateway via tools/call."""
        payload = {
            "jsonrpc": "2.0",
            "id": 2,
            "method": "tools/call",
            "params": {
                "name": name,
                "arguments": arguments or {},
            },
        }
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream",
        }

        try:
            resp = requests.post(self.gateway_url, json=payload, headers=headers, timeout=30)
            resp.raise_for_status()
            data = resp.json()

            if "error" in data:
                return f"Tool Error: {data['error'].get('message', 'Unknown error')}"

            result = data.get("result", {})
            content = result.get("content", [])

            text_snippets = []
            for item in content:
                if isinstance(item, dict) and item.get("type") == "text":
                    text_snippets.append(item.get("text", ""))

            if text_snippets:
                return "\n\n".join(text_snippets)

            if "structuredContent" in result and "result" in result["structuredContent"]:
                return str(result["structuredContent"]["result"])

            return str(result)
        except Exception as e:
            logger.error("Error calling tool '%s' on Gateway: %s", name, e)
            return f"Gateway Tool Invocation Error ({name}): {str(e)}"

    def get_bedrock_tool_config(self) -> Dict[str, Any]:
        """Convert MCP tools into Bedrock Converse API toolConfig format."""
        mcp_tools = self.list_tools()
        bedrock_tools = []

        for t in mcp_tools:
            raw_name = t.get("name", "")
            # Bedrock tool name: ^[a-zA-Z0-9_-]{1,64}$
            sanitized_name = raw_name.replace(":", "_")[:64]
            desc = t.get("description", "").strip() or f"Execute tool {sanitized_name}"
            input_schema = t.get("inputSchema", {})

            cleaned_schema = {
                "type": input_schema.get("type", "object"),
                "properties": input_schema.get("properties", {}),
            }
            if "required" in input_schema:
                cleaned_schema["required"] = input_schema["required"]

            bedrock_tools.append(
                {
                    "toolSpec": {
                        "name": sanitized_name,
                        # Bedrock toolSpec description max is 1024; keep the tail
                        # so pagination notes at the end of long MCP docs survive.
                        "description": desc[:1024] if len(desc) <= 1024 else (desc[:500].rstrip() + "\n…\n" + desc[-500:]),
                        "inputSchema": {"json": cleaned_schema},
                    }
                }
            )

        return {"tools": bedrock_tools}
