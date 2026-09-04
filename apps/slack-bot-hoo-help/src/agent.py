"""
agent.py — HooHelp Bedrock Conversational Agent

Orchestrates multi-turn conversation loops with Amazon Bedrock (MiniMax M2.5):
- Formats system instructions and conversation context
- Executes tool calling loop with AgentCore Gateway MCP tools
- Returns a clean response formatted for Slack
- Records a SessionTrace for MCP development (prompts, tools, answers)
"""

import logging
import os
import re
import time
import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple
from zoneinfo import ZoneInfo

import boto3

from bedrock_params import DEFAULT_AGENT_MODEL_ID, inference_config_for_model, is_minimax
from gateway_mcp_client import GatewayMCPClient
from guardrails import (
    get_guardrail_config,
    log_guardrail_trace,
    message_for_guardrail_block,
)
from link_check import sanitize_response_links
from session_trace import SessionTrace
from wikipedia_tools import (
    bedrock_tool_specs as wikipedia_bedrock_tool_specs,
    call_local_tool as call_wikipedia_tool,
    is_local_tool as is_wikipedia_tool,
)

logger = logging.getLogger(__name__)

TZ = ZoneInfo("America/New_York")

# Occupancy / hours / holdings must never be answered from thread memory alone.
_FACTUAL_QUERY_RE = re.compile(
    r"\b("
    r"hours?|open|closed|occupancy|how busy|foot traffic|entrance|entries|exits|"
    r"catalog|call number|do you have|phone|email|address|event|reserv|"
    r"available|study room|compare|"
    r"photos?|images?|pictures?|drawings?|"
    r"more (to show|for me|photos?|images?|pictures?)|show me more"
    r")\b",
    re.I,
)
# Keep this bland: a stern "call tools now / that is not allowed" user turn
# is classified as PROMPT_ATTACK by the library Guardrail (HIGH on input).
_FORCE_TOOLS_NUDGE = (
    "Please look that up with the live library tools. For more photos, call "
    "search_virgo_image_suggestions with the same visual query and the next page "
    "(page=2, or page=3, etc.) when the earlier result listed another page. "
    "For occupancy or hours, call the tool again for each library named."
)

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
1. **Occupancy, Hours, Spaces, Equipment, Events, Wayfinding & Accessibility**: get_library_hours, get_libraries, list_library_entrances, get_entrance_traffic, get_occupancy_report, get_foot_traffic, get_space_categories, list_space_items, get_space_item, search_space_availability, get_space_search_filters, list_space_seats, get_space_seat, get_equipment_categories, get_equipment_category, list_equipment_items, get_equipment_item, list_event_calendars, list_events, get_event, search_events, get_walking_directions, get_accessible_routes_map.
   - get_libraries lists major UVA libraries (including Harrison/Small) plus spaces **RMC** and **Scholars' Lab**, with **phone, email, address, web page** from Drupal.
   - For phone/email/address questions, call `get_libraries` and use the library-specific Phone field — do not invent numbers or cite a generic Access Services page.
   - Hours also work for spaces with their own LibCal calendars: pass `RMC` or `Scholars' Lab` to get_library_hours — never substitute Clemons or Shannon hours for them.
   - **Occupancy, foot traffic & entrance doorways** (sensors cover Clemons, Shannon, SEL, Music, Fine Arts — not RMC or Scholars' Lab):
     - `list_library_entrances` — lists physical doorways, entrance sensors, and camera points for a library (or all libraries if omitted). Returns doorway names, camera serial numbers, and configuration notes.
     - `get_entrance_traffic` — **preferred** for doorway-level ingress (entries), egress (exits), and combined traffic breakdown for a date range (e.g. "which entrance at Shannon gets the most foot traffic?", "traffic through Clemons 4th floor doors last week"). Accepts an optional `entrance` keyword filter (e.g. "401 east", "Main Entrance").
     - `get_occupancy_report` — **comprehensive executive report** with peak days, peak hours, hourly patterns, averages, and entrance & doorway breakdown table.
     - `get_foot_traffic` — high-level building foot traffic summary (total in, out, combined, and average daily entries).
   - **Reservable spaces** (LibCal Spaces — space lids ≠ hours lids):
     - `search_space_availability` — **preferred** when the user gives a time window (“5–8pm at Shannon”, “2pm–4pm RMC”): needs location + date + time_start + time_end. Prefer **exact matches** over other/partial matches.
     - `list_space_items` — rooms at a location; `availability=today` for batch free slots without a fixed window; optional category / only_available
     - `get_space_item` — one room’s full details + free times
     - `get_space_categories` / `get_space_search_filters` — categories and amenity filters (accessible, power)
     - `list_space_seats` / `get_space_seat` — **named seats** (UVA: Makerspace printers/button makers like Big Bird, Kermit), not study chairs. Most libraries have no seats; study rooms use item tools.
     - Always include the LibCal booking URL; never invent availability; never claim you booked a room.
   - **Equipment / gear** (LibCal Equipment — cameras, chargers, light kits, makerspace tools; equipment item ids ≠ space item ids):
     - `get_equipment_categories` — kinds of equipment at a location (or all public); RMC is richest (reserve cameras + walk-up)
     - `list_equipment_items` — list gear at a location; optional category / availability
     - `get_equipment_category` / `get_equipment_item` — one category or one item (instructions, free slots)
     - Walk-up / “No Reservations” items are often first-come; reserve categories book in LibCal. Never claim you reserved gear.
   - **Events / programs** (LibCal Events — workshops, public programs, faculty sessions; event calids ≠ hours lids; **public calendars only**):
     - `list_events` — upcoming events (default public = Public Events + Faculty Programs); optional days/date
     - `search_events` — keyword search (title/description), e.g. “OER”, “digital humanities”, speaker name
     - `get_event` — full details for one event id (description, registration, series dates)
     - `list_event_calendars` — public calendar names and calids only
     - Always include the LibCal **event page** URL; never claim you registered someone.
   - **Walking directions** (wayfinding between libraries / Central Grounds):
     - `get_walking_directions` — **preferred** for “how do I get from A to B” / walking / accessible walking (includes Central Grounds Parking garage)
     - Uses UVA Library maps page prose when relevant (especially garage → libraries) plus campus map + Google Maps; may include floor-plan links
     - For accessible/ADA asks: `get_walking_directions(..., accessible=true)` **only** — do **not** also call `get_accessible_routes_map` (that PDF legend causes vague “marked ADA path” replies)
     - Reply with the tool’s **concrete steps** (roads, landmarks, turns) + Google Maps walking link; share the Library maps page when the tool includes it
     - Do **not** tell patrons to “follow the marked ADA/accessible path / Barrier Free Paths” — PDF legend language is not reliable outdoor signage
     - Optional: share the ADA map PDF as a visual reference, not as the directions
   - **Accessibility map only** (user wants the official ADA PDF, not turn-by-turn):
     - `get_accessible_routes_map`
2. **Virgo Catalog (books/media records)**: search_catalog, search_by_field, get_item_details — use for circulating books, call numbers, checkout availability.
3. **Images / visual materials**: search_virgo_image_suggestions — use for photos, pictures, images, drawings, historic photographs. Supports `count` and `page` parameters for pagination when users ask for more images or batches.
4. **Other Knowledge Bases**: search_uvalib_web (policies/site), search_virgo_item_suggestions, search_virgo_suggestions (authors). Supports `count` and `page` parameters for pagination.
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
- Prefer **stable** library links: Source URL pages, A-Z Databases (`https://guides.lib.virginia.edu/az.php`), LibGuides, and `proxy1.library.virginia.edu` login wrappers. Avoid pasting time-stamped / hashed group-pass URLs from old news posts (they expire). If the tool excerpt embeds a long proxy URL with `timestamp=`/`hash=`, prefer the article Source URL or A-Z Databases instead.

Multi-turn / thread follow-ups:
- You may receive prior user/assistant turns as conversation history. Use them for
  pronouns and short follow-ups ("what about Fine Arts?", "and tomorrow?", "the phone number?").
- Still call tools for any new factual claim (hours, holdings, occupancy, contacts).
- Occupancy / hours / traffic comparisons ALWAYS need fresh tool calls this turn —
  once per library named. Never reuse another library's counts from earlier in the thread
  (Clemons ≠ Shannon ≠ SEL). "Compare X, Y, and Z" is a new factual question even in a thread.
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
- ALWAYS call `search_virgo_image_suggestions` this turn (not the book catalog),
  even in a thread that already showed images. Never invent Image URLs or
  `https://iiif.lib.virginia.edu/...` placeholders.
- The image tool paginates (`page`, `count` / `max_results`). First request: page 1.
  If the user wants more, make **one** tool call this turn with the **same query**,
  the **same count**, and the **next page only** (2, then 3, …). Never fetch two
  pages in the same turn. Do not skip a page. Do not repeat page 1.
- If the tool says this is the last page / end of results, tell the user in
  English that those are all the images for that search and offer a different
  query. Do not invent JSON, schema fields, or switch languages.
- Pass a focused **visual** query (e.g. "angry cat", "Rotunda on fire", "Lawn snow"). Prefer 1–2 good queries over many near-duplicates.
- The image KB is multimodal: **rank / Relevance score and Image URL matter more than whether the title or Subjects contain the query words.**
  - Historic photos are often titled by person, place, or studio job (e.g. "Carr's Hill, President's House") even when the picture is an animal, object, or mood the user asked for.
  - **Do not hard-filter out top-ranked hits** just because title/notes/subjects omit "cat", "fire", etc. Lead with the highest-ranked Image URLs from the tool.
  - Use title and subjects as **captions and context**, not as a gate.
  - Soft title check only when two results are clearly different *subjects* (e.g. Rotunda *fire* vs an unrelated *demolition*) — then prefer the better subject match among similarly ranked hits.
- For each image, include in your reply:
  • Title (as given by the tool — even if imperfect)
  • Image URL: (the https://iiif.lib.virginia.edu/... URL from the tool — required so Slack can show the picture)
  • Virgo page: (the search.lib.virginia.edu link)
  • Collection / repository when available
- Show up to 3–4 images. Never invent catalog IDs like u1234567 or uva_library item links for images.
- Do not substitute a random book/catalog record when the user asked for images.
- If mood/expression terms (angry, confused, etc.) are not in metadata, still show strong visual matches and say captions may not describe mood.

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


def _content_text_and_thinking(content: Any) -> Tuple[str, str]:
    """Split Converse content into visible text vs reasoningContent (MiniMax)."""
    texts: List[str] = []
    thinking: List[str] = []
    if not isinstance(content, list):
        return "", ""
    for block in content:
        if not isinstance(block, dict):
            continue
        if block.get("text"):
            texts.append(str(block["text"]))
        rc = block.get("reasoningContent")
        if isinstance(rc, dict):
            rt = rc.get("reasoningText")
            if isinstance(rt, dict) and rt.get("text"):
                thinking.append(str(rt["text"]))
            elif isinstance(rc.get("text"), str) and rc["text"]:
                thinking.append(rc["text"])
    return "\n\n".join(texts).strip(), "\n\n".join(thinking).strip()


def _assistant_visible_text(content: Any) -> str:
    """User-facing draft plus optional <thinking> so Slack format can strip/show it."""
    text, thinking = _content_text_and_thinking(content)
    if thinking:
        return f"<thinking>\n{thinking}\n</thinking>\n\n{text}".strip()
    return text


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
        self.model_id = model_id or os.environ.get(
            "BEDROCK_MODEL_ID", DEFAULT_AGENT_MODEL_ID
        )
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

    def _sanitize_links(
        self,
        text: str,
        trace: SessionTrace,
        *,
        extra_candidates: Optional[List[str]] = None,
    ) -> Tuple[str, List[Dict[str, Any]]]:
        """
        Verify http(s) links in the draft reply. Replace broken or strongly
        ephemeral URLs with working alternatives from this turn's tool outputs
        (and any extra candidate texts).

        Returns (cleaned_text, change records).
        """
        if not text or "http" not in text.lower():
            return text, []
        if os.environ.get("HOOHELP_LINK_CHECK", "true").lower() in (
            "0",
            "false",
            "no",
            "off",
        ):
            return text, []

        candidates: List[str] = []
        for step in getattr(trace, "steps", None) or []:
            out = getattr(step, "output", None)
            if out:
                candidates.append(str(out))
        if extra_candidates:
            candidates.extend(extra_candidates)
        try:
            cleaned, changes = sanitize_response_links(
                text,
                candidate_texts=candidates,
                timeout=float(os.environ.get("HOOHELP_LINK_CHECK_TIMEOUT", "5")),
            )
        except Exception as e:
            logger.warning("Link sanitize failed; posting draft unchanged: %s", e)
            return text, []
        if changes:
            logger.info(
                "Link-check adjusted %s URL(s): %s",
                len(changes),
                [
                    f"{c.get('action')}:{c.get('url','')[:60]}→{(c.get('replacement') or '')[:60]}"
                    for c in changes
                ],
            )
        return cleaned, changes

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
        forced_tools = False
        force_tool_choice = False
        include_top_p = True

        while iteration < max_iterations:
            iteration += 1

            try:
                converse_kwargs: Dict[str, Any] = {
                    "modelId": self.model_id,
                    "messages": messages,
                    "system": system_instruction,
                    "inferenceConfig": inference_config_for_model(
                        self.model_id,
                        # MiniMax spends tokens on reasoningContent before text/toolUse.
                        max_tokens=4096,
                        temperature=0.1,
                        include_top_p=include_top_p,
                    ),
                }
                if tool_config and tool_config.get("tools"):
                    tc: Dict[str, Any] = dict(tool_config)
                    if force_tool_choice:
                        tc["toolChoice"] = {"any": {}}
                    converse_kwargs["toolConfig"] = tc
                if self.guardrail_config:
                    converse_kwargs["guardrailConfig"] = self.guardrail_config

                try:
                    response = self.bedrock_runtime.converse(**converse_kwargs)
                except Exception as conv_exc:
                    err = str(conv_exc)
                    if include_top_p and is_minimax(self.model_id) and (
                        "topP" in err
                        or "top_p" in err
                        or (
                            "ValidationException" in err
                            and "temperature" in err.lower()
                        )
                    ):
                        logger.warning(
                            "MiniMax rejected inferenceConfig with topP (%s); retrying without it",
                            conv_exc,
                        )
                        include_top_p = False
                        iteration -= 1
                        continue
                    if force_tool_choice:
                        logger.warning(
                            "Forced toolChoice failed (%s); retrying without it",
                            conv_exc,
                        )
                        force_tool_choice = False
                        continue
                    raise
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
                    if (
                        not trace.steps
                        and not forced_tools
                        and _FACTUAL_QUERY_RE.search(user_message or "")
                        and iteration < max_iterations
                    ):
                        logger.warning(
                            "Model answered without tools for factual query; forcing tool use request_id=%s",
                            trace.request_id,
                        )
                        forced_tools = True
                        force_tool_choice = True
                        messages.append(
                            {"role": "user", "content": [{"text": _FORCE_TOOLS_NUDGE}]}
                        )
                        continue
                    # Raw model text — Slack-facing cleanup + link-check in app.py
                    # MiniMax returns reasoningContent before text; skip it here.
                    text = _assistant_visible_text(output_message.get("content", []))
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
                text = _assistant_visible_text(output_message.get("content", [])) or "Done."
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
