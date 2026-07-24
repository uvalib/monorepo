"""
agent.py — HooHelp Bedrock Conversational Agent

Orchestrates multi-turn conversation loops with Amazon Bedrock Nova Pro:
- Formats system instructions and conversation context
- Executes tool calling loop with AgentCore Gateway MCP tools
- Returns a clean response formatted for Slack
"""

import logging
import os
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
from zoneinfo import ZoneInfo

import boto3

from gateway_mcp_client import GatewayMCPClient

logger = logging.getLogger(__name__)

TZ = ZoneInfo("America/New_York")

SYSTEM_PROMPT = """You are HooHelp, the helpful and friendly AI assistant for the University of Virginia (UVA) Library system.

You have access to real-time tools via an AgentCore MCP Gateway:
1. **Occupancy & Hours**: get_library_hours, get_libraries, get_occupancy_report, get_foot_traffic.
   - get_libraries lists major UVA Library locations (including Harrison/Small), not only camera buildings.
   - Occupancy/foot-traffic tools only cover Clemons, Shannon, SEL, Music, Fine Arts.
2. **Virgo Catalog (books/media records)**: search_catalog, search_by_field, get_item_details — use for circulating books, call numbers, checkout availability.
3. **Images / visual materials**: search_virgo_image_suggestions — use for photos, pictures, images, drawings, historic photographs.
4. **Other Knowledge Bases**: search_uvalib_web (policies/site), search_virgo_item_suggestions, search_virgo_suggestions (authors).

Guidelines:
- Always be polite, helpful, and concise.
- Choose the right tool for the question (hours → get_library_hours; images → image KB; books → catalog; policies → uvalib web).
- Format responses for Slack mrkdwn (NOT full Markdown):
  - Bold: *like this*  (single asterisks — never **double**)
  - Italic: _like this_
  - Code: `like this` for call numbers
  - Links MUST be Slack form: <https://example.com|label>  — never paste bare URLs
  - Put EACH bullet on its OWN line. Never put multiple • on the same line.
  - Use a blank line between sections.
- Never wrap your answer in XML/HTML tags. Do not emit <thinking>, <think>, <reasoning>, or similar tags.
- Do not narrate your internal reasoning to the user. Reply with the final answer only.
- Avoid raw JSON dumps; synthesize tool findings into helpful natural answers.
- NEVER invent library hours, dates, occupancy numbers, catalog holdings, or image links. If you need facts, call a tool.

Library HOURS / "when is X open" / "this weekend" questions:
- ALWAYS call `get_library_hours` before answering. Do not guess from memory.
- Convert relative dates using the **Current date context** below into YYYY-MM-DD for start_date/end_date.
  - "this weekend" / "weekend" → the Saturday–Sunday pair listed under Current date context
  - "today" → today's date; "tomorrow" → tomorrow's date
- Pass the specific library name (e.g. Fine Arts, Clemons, Shannon, Music, Science & Engineering).
- Report ONLY what the tool returns (including Closed). Do not substitute another library's hours.
- Quote the calendar dates from the tool in your answer (e.g. Saturday, July 25, 2026).

Image / photo / picture questions:
- ALWAYS call `search_virgo_image_suggestions` first (not the book catalog).
- Pass a focused visual query (e.g. "Rotunda fire" or "University of Virginia Rotunda on fire").
- Present the best matching images by title relevance (prefer "Rotunda fire" over unrelated demolitions).
- For each image, include in your reply:
  • Title
  • Image URL: (the https://iiif.lib.virginia.edu/... URL from the tool — required so Slack can show the picture)
  • Virgo page: (the search.lib.virginia.edu link)
  • Collection / repository when available
- Show up to 3–4 images. Never invent catalog IDs like u1234567 or uva_library item links for images.
- Do not substitute a random book/catalog record when the user asked for images.

Catalog / “do you have this book?” questions:
- Prefer `search_by_field` with field=`title` for known titles. Use `search_catalog` for broader discovery.
- Answer *where can they get it now?* Prefer the actual work (not criticism/study guides).
- Show at most ~4 on-shelf copies and ~2 online options. Dedupe near-identical shelf copies when possible.
- Prefer a short intro sentence, then grouped items. Slack will render these as visual cards, so keep fields clear:
  Use either ONE line per copy:
  • *Great Expectations* by Charles Dickens — Clemons, 3rd Floor Stacks — `PR4570.G7 1994` — Virgo record: https://search.lib.virginia.edu/sources/uva_library/items/u110023
  OR a tight field group (still fine — we reformat into cards):
  • *Great Expectations* by Charles Dickens
  • Location: Clemons, 3rd Floor Stacks
  • Call number: PR4570.G7 1994
  • Virgo record: https://search.lib.virginia.edu/sources/uva_library/items/u110023
- Group under headings when possible: *On shelf — ready to check out* / *Online* / *Request / checked out*
- Always include Virgo record URLs and online Access URLs as full https links.
- Special Collections = Reading Room use, not normal checkout — list separately if relevant.
"""


def _current_date_context() -> str:
    """Absolute dates for relative phrases like 'this weekend' (UVA local time)."""
    now = datetime.now(TZ)
    today = now.date()

    # "This weekend" = upcoming Sat–Sun, or the current weekend if today is Sat/Sun
    if today.weekday() == 5:  # Saturday
        sat, sun = today, today + timedelta(days=1)
    elif today.weekday() == 6:  # Sunday
        sat, sun = today - timedelta(days=1), today
    else:
        sat = today + timedelta(days=(5 - today.weekday()))
        sun = sat + timedelta(days=1)

    tomorrow = today + timedelta(days=1)
    return (
        "Current date context (America/New_York — use these for tool date arguments):\n"
        f"- Now: {now.strftime('%A, %Y-%m-%d %H:%M %Z')}\n"
        f"- Today: {today.isoformat()} ({today.strftime('%A')})\n"
        f"- Tomorrow: {tomorrow.isoformat()} ({tomorrow.strftime('%A')})\n"
        f"- This weekend (Sat–Sun): {sat.isoformat()} ({sat.strftime('%A')}) "
        f"through {sun.isoformat()} ({sun.strftime('%A')})\n"
        "Pass these YYYY-MM-DD values to get_library_hours — never invent other weekend dates."
    )


class HooHelpAgent:

    def __init__(
        self,
        gateway_client: Optional[GatewayMCPClient] = None,
        model_id: Optional[str] = None,
        region_name: Optional[str] = None,
    ):
        self.gateway_client = gateway_client or GatewayMCPClient(
            gateway_url=os.environ.get(
                "GATEWAY_URL",
                "https://occupancy-reporting-gateway-mohw8c1jug.gateway.bedrock-agentcore.us-east-1.amazonaws.com/mcp",
            )
        )
        self.model_id = model_id or os.environ.get("BEDROCK_MODEL_ID", "us.amazon.nova-pro-v1:0")
        self.region_name = region_name or os.environ.get("AWS_REGION", "us-east-1")
        self.bedrock_runtime = boto3.client("bedrock-runtime", region_name=self.region_name)

    def _system_prompt(self) -> str:
        return SYSTEM_PROMPT + "\n\n" + _current_date_context()

    def process_message(
        self,
        user_message: str,
        conversation_history: Optional[List[Dict[str, Any]]] = None,
    ) -> str:
        """Process a user prompt through Bedrock Converse API with tool calling loop."""
        tool_config = self.gateway_client.get_bedrock_tool_config()

        messages = list(conversation_history) if conversation_history else []
        messages.append({"role": "user", "content": [{"text": user_message}]})

        system_instruction = [{"text": self._system_prompt()}]

        max_iterations = 8
        iteration = 0

        while iteration < max_iterations:
            iteration += 1

            try:
                converse_kwargs: Dict[str, Any] = {
                    "modelId": self.model_id,
                    "messages": messages,
                    "system": system_instruction,
                    "inferenceConfig": {
                        "temperature": 0.1,
                        "maxTokens": 2048,
                    },
                }
                if tool_config and tool_config.get("tools"):
                    converse_kwargs["toolConfig"] = tool_config

                response = self.bedrock_runtime.converse(**converse_kwargs)
                output_message = response["output"]["message"]
                stop_reason = response.get("stopReason")

                messages.append(output_message)

                if stop_reason == "end_turn":
                    final_texts = [
                        block["text"] for block in output_message.get("content", []) if "text" in block
                    ]
                    # Raw model text — Slack-facing cleanup happens in app via slack_format
                    return "\n\n".join(final_texts)

                if stop_reason == "tool_use":
                    tool_results_content = []

                    for block in output_message.get("content", []):
                        if "toolUse" not in block:
                            continue
                        t_req = block["toolUse"]
                        tool_use_id = t_req["toolUseId"]
                        tool_name = t_req["name"]
                        tool_input = t_req.get("input", {})

                        logger.info("[Tool Call] Invoking '%s' with args %s", tool_name, tool_input)
                        tool_output_str = self.gateway_client.call_tool(tool_name, tool_input)

                        tool_results_content.append(
                            {
                                "toolResult": {
                                    "toolUseId": tool_use_id,
                                    "content": [{"text": tool_output_str}],
                                    "status": "success",
                                }
                            }
                        )

                    messages.append({"role": "user", "content": tool_results_content})
                    continue

                logger.warning("Unexpected stop reason '%s' from Bedrock", stop_reason)
                final_texts = [
                    b["text"] for b in output_message.get("content", []) if "text" in b
                ]
                return "\n\n".join(final_texts) or "Done."

            except Exception as e:
                logger.error("Error in Bedrock converse loop: %s", e, exc_info=True)
                return f"Sorry, I encountered an error processing your request: {str(e)}"

        return "I completed the maximum processing steps. Please let me know if you'd like more information!"
