"""
agent.py — HooHelp Bedrock Conversational Agent

Orchestrates multi-turn conversation loops with Amazon Bedrock (Claude Sonnet 5):
- Formats system instructions and conversation context
- Executes tool calling loop with AgentCore Gateway MCP tools
- Returns a clean response formatted for Slack
- Records a SessionTrace for MCP development (prompts, tools, answers)
"""

import logging
import os
import time
import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
from zoneinfo import ZoneInfo

import boto3

from bedrock_params import inference_config_for_model
from gateway_mcp_client import GatewayMCPClient
from guardrails import (
    get_guardrail_config,
    log_guardrail_trace,
    message_for_guardrail_block,
)
from session_trace import SessionTrace
from wikipedia_tools import (
    bedrock_tool_specs as wikipedia_bedrock_tool_specs,
    call_local_tool as call_wikipedia_tool,
    is_local_tool as is_wikipedia_tool,
)

logger = logging.getLogger(__name__)

TZ = ZoneInfo("America/New_York")

SYSTEM_PROMPT = """You are **Hoo Helper** (also written HooHelp / HooHelper), the UVA Library's AI assistant in Slack.

## Who you are (answer from this section — do not invent more)
- **Slack display name**: Hoo Helper
- **Short names patrons may use**: Hoo Helper, HooHelp, HooHelper, @Hoo Helper
- **Role**: Staff-facing AI assistant for the University of Virginia Library system in Slack (DMs and channel mentions).
- **What you do**: Answer questions about UVA Library hours and locations (including RMC and Scholars' Lab), contacts, Virgo catalog / checkout availability, images in library collections, study-space occupancy where sensors exist, and library website policies — using live tools, not guesswork.
- **What you are not**: Not a human librarian, not a replacement for Ask a Librarian for complex research consultations, not an official policy authority when tools return nothing.
- **How people reach you**: @mention in channels or open a DM in Slack. You reply in threads and can continue unmentioned follow-ups in threads you are already in.
- When someone asks "what is Hoo Helper?", "who are you?", "what can you do?", or similar: answer from **this identity section**. Do **not** call tools or search the web knowledge base for your own name (that search will miss you and confuse the answer).

You have access to real-time tools via an AgentCore MCP Gateway:
1. **Occupancy & Hours**: get_library_hours, get_libraries, get_occupancy_report, get_foot_traffic.
   - get_libraries lists major UVA libraries (including Harrison/Small) plus spaces **RMC** and **Scholars' Lab**, with **phone, email, address, web page** from Drupal.
   - For phone/email/address questions, call `get_libraries` and use the library-specific Phone field — do not invent numbers or cite a generic Access Services page.
   - Hours also work for spaces with their own LibCal calendars: pass `RMC` or `Scholars' Lab` to get_library_hours — never substitute Clemons or Shannon hours for them.
   - Occupancy/foot-traffic tools only cover Clemons, Shannon, SEL, Music, Fine Arts (not RMC or Scholars' Lab).
2. **Virgo Catalog (books/media records)**: search_catalog, search_by_field, get_item_details — use for circulating books, call numbers, checkout availability.
3. **Images / visual materials**: search_virgo_image_suggestions — use for photos, pictures, images, drawings, historic photographs.
4. **Other Knowledge Bases**: search_uvalib_web (policies/site), search_virgo_item_suggestions, search_virgo_suggestions (authors).
5. **Wikipedia (local tools, not the library site)**: wikipedia_search, wikipedia_get_page.
   - Use for external background: authors, books, awards, history, and **NYT / bestseller number-one lists by year** (e.g. search "New York Times number-one books of 2025", then get_page).
   - Wikipedia lists are community-maintained summaries (often #1-by-week), not a live official NYT feed — say that when relevant.
   - After you have titles from Wikipedia, use **Virgo catalog tools** to check UVA Library availability. Do not invent holdings.
   - Do **not** use search_uvalib_web for NYT bestseller lists or general world knowledge.

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
- **Ground every fact in tool output.** NEVER invent or guess:
  - official names or acronym expansions (e.g. do not invent what "RMC" stands for)
  - hours, dates, phone numbers, emails, addresses, occupancy counts
  - catalog holdings, call numbers, image titles/links, policies
  If the tool gives a display name (e.g. "### Hours: Robertson Media Center (RMC)"), use that name **exactly**. If you only know an acronym and the tool did not expand it, say "RMC" without expanding it — or call `get_libraries` / re-read the tool result.
- When citing knowledge-base sources, use only **Source URL** / Virgo / IIIF links that start with `http`. Never cite `s3://…` paths or vector-store object keys.

Multi-turn / thread follow-ups:
- You may receive prior user/assistant turns as conversation history. Use them for
  pronouns and short follow-ups ("what about Fine Arts?", "and tomorrow?", "the phone number?").
- Still call tools for any new factual claim (hours, holdings, occupancy, contacts).
- Do not assume the follow-up is about the same library unless the history clearly says so.
- Do not trust prior assistant turns for official names if a fresh tool result has the name — prefer the tool.

Library HOURS / "when is X open" / "this weekend" questions:
- ALWAYS call `get_library_hours` before answering. Do not guess from memory.
- Convert relative dates using the **Current date context** below into YYYY-MM-DD for start_date/end_date.
  - "this weekend" / "weekend" → the Saturday–Sunday pair listed under Current date context
  - "today" → today's date; "tomorrow" → tomorrow's date
- Pass the specific library **or space** name the user used (e.g. Fine Arts, Clemons, Shannon, RMC, Scholars' Lab, Music, Science & Engineering).
  Tool aliases accept: RMC, Robertson Media Center, SLAB, Scholars Lab, makerspace, SEL, FAL, etc.
- In your answer, use the **official display name from the tool heading** (e.g. *Robertson Media Center (RMC)*), not a guessed expansion of an acronym.
- Report ONLY the hours the tool returns (including Closed). Do not substitute another library's hours (RMC ≠ Clemons; Scholars' Lab ≠ Shannon).
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

Bestsellers / “books on the NYT list that the library has” questions:
- First use `wikipedia_search` + `wikipedia_get_page` for a recent year list (e.g. number-one books of this or last year).
- Extract concrete titles/authors from the page; then check each (or a short sample of ~5–8) with Virgo `search_by_field` / `search_catalog`.
- Present which titles appear available at UVA and which you could not find; link Virgo records. Do not invent shelf status.

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


@dataclass
class AgentTurnResult:
    """Text answer plus structured trace for the agent turn."""

    text: str
    trace: SessionTrace


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
        self.model_id = model_id or os.environ.get("BEDROCK_MODEL_ID", "us.anthropic.claude-sonnet-5")
        self.region_name = region_name or os.environ.get("AWS_REGION", "us-east-1")
        self.bedrock_runtime = boto3.client("bedrock-runtime", region_name=self.region_name)
        self.guardrail_config = get_guardrail_config()
        if self.guardrail_config:
            logger.info(
                "Bedrock Guardrails enabled id=%s version=%s",
                self.guardrail_config.get("guardrailIdentifier"),
                self.guardrail_config.get("guardrailVersion"),
            )
        else:
            logger.warning("Bedrock Guardrails disabled (no BEDROCK_GUARDRAIL_ID)")
        # Last completed turn (useful for callers that only need the text)
        self.last_trace: Optional[SessionTrace] = None

    def _system_prompt(self) -> str:
        return SYSTEM_PROMPT + "\n\n" + _current_date_context()

    def _merged_tool_config(self) -> Dict[str, Any]:
        """Gateway MCP tools plus in-process Wikipedia tools."""
        gateway_cfg = self.gateway_client.get_bedrock_tool_config() or {}
        tools = list(gateway_cfg.get("tools") or [])
        # Local tools first so the model sees them clearly among many gateway tools
        tools = wikipedia_bedrock_tool_specs() + tools
        return {"tools": tools}

    def _dispatch_tool(self, tool_name: str, tool_input: Dict[str, Any]) -> str:
        """Route to local library tools or the AgentCore MCP gateway."""
        if is_wikipedia_tool(tool_name):
            return call_wikipedia_tool(tool_name, tool_input if isinstance(tool_input, dict) else {})
        return self.gateway_client.call_tool(tool_name, tool_input)

    def process_message(
        self,
        user_message: str,
        conversation_history: Optional[List[Dict[str, Any]]] = None,
        *,
        request_id: Optional[str] = None,
        slack_context: Optional[Dict[str, Any]] = None,
    ) -> AgentTurnResult:
        """
        Process a user prompt through Bedrock Converse API with tool calling loop.

        Returns AgentTurnResult(text, trace). Callers that only need text can use
        ``result.text``; ``result.trace`` is ready for SessionTrace.emit().
        """
        system_prompt = self._system_prompt()
        history = list(conversation_history) if conversation_history else []
        trace = SessionTrace(request_id=request_id or str(uuid.uuid4()))
        trace.set_request(
            user_message,
            history_turns=len(history),
            model_id=self.model_id,
            gateway_url=getattr(self.gateway_client, "gateway_url", "") or "",
            system_prompt=system_prompt,
            slack=slack_context,
        )
        self.last_trace = trace

        tool_config = self._merged_tool_config()

        messages = history
        messages.append({"role": "user", "content": [{"text": user_message}]})

        system_instruction = [{"text": system_prompt}]

        max_iterations = 8
        iteration = 0

        while iteration < max_iterations:
            iteration += 1

            try:
                converse_kwargs: Dict[str, Any] = {
                    "modelId": self.model_id,
                    "messages": messages,
                    "system": system_instruction,
                    "inferenceConfig": inference_config_for_model(
                        self.model_id, max_tokens=2048, temperature=0.1
                    ),
                }
                if tool_config and tool_config.get("tools"):
                    converse_kwargs["toolConfig"] = tool_config
                if self.guardrail_config:
                    converse_kwargs["guardrailConfig"] = self.guardrail_config

                response = self.bedrock_runtime.converse(**converse_kwargs)
                log_guardrail_trace(response, context="agent")
                output_message = response.get("output", {}).get("message") or {
                    "role": "assistant",
                    "content": [],
                }
                stop_reason = response.get("stopReason")

                messages.append(output_message)

                if stop_reason == "guardrail_intervened":
                    text = message_for_guardrail_block(
                        response, output_message=output_message
                    )
                    logger.warning(
                        "Guardrail blocked turn request_id=%s iteration=%s",
                        trace.request_id,
                        iteration,
                    )
                    trace.finish(
                        final_text=text,
                        stop_reason="guardrail_intervened",
                        iterations=iteration,
                        error="guardrail_intervened",
                    )
                    return AgentTurnResult(text=text, trace=trace)

                if stop_reason == "end_turn":
                    final_texts = [
                        block["text"] for block in output_message.get("content", []) if "text" in block
                    ]
                    # Raw model text — Slack-facing cleanup happens in app via slack_format
                    text = "\n\n".join(final_texts)
                    trace.finish(
                        final_text=text,
                        stop_reason=stop_reason,
                        iterations=iteration,
                    )
                    return AgentTurnResult(text=text, trace=trace)

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
                        t0 = time.perf_counter()
                        tool_status = "success"
                        tool_error: Optional[str] = None
                        try:
                            tool_output_str = self._dispatch_tool(tool_name, tool_input)
                        except Exception as tool_exc:
                            tool_status = "error"
                            tool_error = str(tool_exc)
                            tool_output_str = f"Tool Invocation Error ({tool_name}): {tool_exc}"
                            logger.error("Tool '%s' raised: %s", tool_name, tool_exc)
                        latency_ms = int((time.perf_counter() - t0) * 1000)

                        # Surface error strings as status=error in the trace
                        if tool_status == "success" and tool_output_str.startswith(
                            (
                                "Tool Error:",
                                "Gateway Tool Invocation Error",
                                "Tool Invocation Error",
                                "Error:",
                            )
                        ):
                            tool_status = "error"
                            tool_error = tool_output_str[:500]

                        trace.add_tool_step(
                            tool_use_id=tool_use_id,
                            tool_name=tool_name,
                            tool_input=tool_input if isinstance(tool_input, dict) else {"value": tool_input},
                            output=tool_output_str,
                            latency_ms=latency_ms,
                            iteration=iteration,
                            status=tool_status,
                            error=tool_error,
                        )

                        tool_results_content.append(
                            {
                                "toolResult": {
                                    "toolUseId": tool_use_id,
                                    "content": [{"text": tool_output_str}],
                                    "status": "success" if tool_status == "success" else "error",
                                }
                            }
                        )

                    messages.append({"role": "user", "content": tool_results_content})
                    continue

                logger.warning("Unexpected stop reason '%s' from Bedrock", stop_reason)
                final_texts = [
                    b["text"] for b in output_message.get("content", []) if "text" in b
                ]
                text = "\n\n".join(final_texts) or "Done."
                trace.finish(
                    final_text=text,
                    stop_reason=stop_reason or "unexpected",
                    iterations=iteration,
                )
                return AgentTurnResult(text=text, trace=trace)

            except Exception as e:
                logger.error("Error in Bedrock converse loop: %s", e, exc_info=True)
                text = f"Sorry, I encountered an error processing your request: {str(e)}"
                trace.finish(
                    final_text=text,
                    stop_reason="error",
                    iterations=iteration,
                    error=str(e),
                )
                return AgentTurnResult(text=text, trace=trace)

        text = (
            "I completed the maximum processing steps. "
            "Please let me know if you'd like more information!"
        )
        trace.finish(
            final_text=text,
            stop_reason="max_iterations",
            iterations=iteration,
            error="max_iterations",
        )
        return AgentTurnResult(text=text, trace=trace)
