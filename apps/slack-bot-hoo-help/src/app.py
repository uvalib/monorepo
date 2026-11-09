"""
app.py — HooHelp Slack Bolt handler for AWS Lambda + Events API

Architecture notes:
- Slack requires a 200 within ~3 seconds for every Events API delivery.
- Long agent work (Bedrock + MCP tools) runs in Bolt *lazy listeners*.
- The AWS Lambda adapter acks quickly, then async re-invokes this same
  Lambda to run the lazy work (needs lambda:InvokeFunction on itself).
- Socket Mode is intentionally not used — Lambda is request-driven.

Thread follow-ups:
- First @mention (or DM) starts a reply thread.
- Later messages in that thread are answered even without a new @mention,
  when the bot already participated or was mentioned on the parent.
- Requires Slack event subscriptions: message.channels / message.groups
  (and history scopes) — see README.
"""

from __future__ import annotations

import json
import logging
import os
import re
import threading
import time
import uuid
from typing import Any, Dict, List, Optional, Tuple

from slack_bolt import App
from slack_bolt.adapter.aws_lambda import SlackRequestHandler

from agent import (TOO_SLOW_REPLY, AgentTurnResult, HooHelpAgent, drop_untrusted_block_urls, github_prompt_section,
                   reply_url_filter)
from link_check import drop_untrusted_urls, url_host
from bedrock_params import DEFAULT_AGENT_MODEL_ID, DEFAULT_FORMAT_MODEL_ID
from gateway_mcp_client import GatewayMCPClient
from action_tokens import ActionTokenStore
from identity import UserDirectory, identity_line, resolve_mentions
from atlassian_tools import atlassian_tools_for_event
from github_tools import github_tools_for_env
from matomo_tools import matomo_tools_for_env
from citation_check import citation_tools_for_env
from routing import GatedGitHubTools, route_question, wants_github
from local_tools import LocalTools
from slack_search import slack_tools_for_event
from session_trace import SessionTrace
from slack_blocks import blocks_plain_text, flatten_carousels, split_messages
import chime_in
from slack_format import format_for_slack, rewrite_urls_in_blocks
from attachments import build_file, citable_tables, file_context_line, file_format, requested_format
from tool_names import is_v2_toolset
from virgo_citations import MAX_ITEMS as MAX_CITED, virgo_ris
from virgo_links import add_virgo_links
from spreadsheet import tables_from_steps
from thread_context import (
    extract_thread_history,
    mention_handled_by_app_mention,
    unanswered_turns_line,
    should_ignore_message_event,
    strip_mention_prefix,
)

LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=LOG_LEVEL)
logger = logging.getLogger("HooHelpSlackBot")

GATEWAY_URL = os.environ.get(
    "GATEWAY_URL",
    "https://occupancy-reporting-gateway-mohw8c1jug.gateway.bedrock-agentcore.us-east-1.amazonaws.com/mcp",
)
BEDROCK_MODEL_ID = os.environ.get("BEDROCK_MODEL_ID", DEFAULT_AGENT_MODEL_ID)
SLACK_FORMAT_MODEL_ID = os.environ.get(
    "SLACK_FORMAT_MODEL_ID", DEFAULT_FORMAT_MODEL_ID
)


def _load_secret(env_key: str, ssm_path_env: str) -> str:
    """
    Load a secret from env (local/dev) or SSM SecureString (Lambda).

    Prefer env if set to a real-looking value so local `sam local` / tests work.
    """
    direct = os.environ.get(env_key, "").strip()
    if direct and direct not in (".", "...", "****", "CHANGEME") and len(direct) > 8:
        return direct

    ssm_path = os.environ.get(ssm_path_env, "").strip()
    if not ssm_path:
        logger.error("No %s and no %s configured", env_key, ssm_path_env)
        return ""

    try:
        import boto3

        ssm = boto3.client("ssm", region_name=os.environ.get("AWS_REGION", "us-east-1"))
        resp = ssm.get_parameter(Name=ssm_path, WithDecryption=True)
        value = (resp.get("Parameter") or {}).get("Value", "").strip()
        logger.info("Loaded %s from SSM path %s (len=%s)", env_key, ssm_path, len(value))
        return value
    except Exception as e:
        logger.error("Failed to load %s from SSM %s: %s", env_key, ssm_path, e)
        return ""


SLACK_BOT_TOKEN = _load_secret("SLACK_BOT_TOKEN", "SLACK_BOT_TOKEN_SSM_PATH")
SLACK_SIGNING_SECRET = _load_secret("SLACK_SIGNING_SECRET", "SLACK_SIGNING_SECRET_SSM_PATH")

# Confluence/Jira service account — only read when the feature is switched on
ATLASSIAN_ENABLED = os.environ.get("ENABLE_ATLASSIAN", "false").strip().lower() == "true"
ATLASSIAN_EMAIL = _load_secret("ATLASSIAN_EMAIL", "ATLASSIAN_EMAIL_SSM_PATH") if ATLASSIAN_ENABLED else ""
# Scoped API tokens are issued per app: one for Jira, one for Confluence
ATLASSIAN_JIRA_TOKEN = (
    _load_secret("ATLASSIAN_JIRA_TOKEN", "ATLASSIAN_JIRA_TOKEN_SSM_PATH") if ATLASSIAN_ENABLED else ""
)
ATLASSIAN_CONFLUENCE_TOKEN = (
    _load_secret("ATLASSIAN_CONFLUENCE_TOKEN", "ATLASSIAN_CONFLUENCE_TOKEN_SSM_PATH") if ATLASSIAN_ENABLED else ""
)

# Do not call auth.test at import time — a bad token would crash every cold start
# (including health checks) with BoltError invalid_auth.
# process_before_response=True is required for the Lambda adapter so the
# HTTP response can be prepared before lazy listeners run (via async invoke).
bolt_app = App(
    token=SLACK_BOT_TOKEN or None,
    signing_secret=SLACK_SIGNING_SECRET or None,
    process_before_response=True,
    token_verification_enabled=False,
)

if not SLACK_BOT_TOKEN or not SLACK_BOT_TOKEN.startswith("xoxb-"):
    logger.error(
        "SLACK_BOT_TOKEN is missing or invalid (len=%s). "
        "Set SSM /hoohelp/slack/bot-token (SecureString).",
        len(SLACK_BOT_TOKEN),
    )
if not SLACK_SIGNING_SECRET or len(SLACK_SIGNING_SECRET) < 8:
    logger.error(
        "SLACK_SIGNING_SECRET is missing or invalid (len=%s). "
        "Set SSM /hoohelp/slack/signing-secret (SecureString).",
        len(SLACK_SIGNING_SECRET),
    )

# Slack search action tokens, saved per thread (DynamoDB; ACTION_TOKENS_TABLE)
action_token_store = ActionTokenStore()

agent = HooHelpAgent(
    gateway_client=GatewayMCPClient(gateway_url=GATEWAY_URL),
    model_id=BEDROCK_MODEL_ID,
)

# Cached from auth.test: Slack user id (U…) and bot id (B…)
_BOT_USER_ID: Optional[str] = None
_BOT_APP_BOT_ID: Optional[str] = None


def get_bot_identity(client) -> Tuple[Optional[str], Optional[str]]:
    """Return (bot_user_id, bot_app_bot_id), caching auth.test results."""
    global _BOT_USER_ID, _BOT_APP_BOT_ID
    if _BOT_USER_ID:
        return _BOT_USER_ID, _BOT_APP_BOT_ID
    try:
        auth = client.auth_test()
        _BOT_USER_ID = auth.get("user_id")
        # auth.test may include bot_id for bot tokens
        _BOT_APP_BOT_ID = auth.get("bot_id")
        logger.info(
            "Authenticated as bot user %s (%s) bot_id=%s",
            _BOT_USER_ID,
            auth.get("user"),
            _BOT_APP_BOT_ID,
        )
    except Exception as e:
        logger.warning("Could not fetch bot identity: %s", e)
    return _BOT_USER_ID, _BOT_APP_BOT_ID


def get_bot_user_id(client) -> Optional[str]:
    user_id, _ = get_bot_identity(client)
    return user_id


def _new_request_id(context: Any = None) -> str:
    """Prefer Lambda request id when available so traces match CloudWatch log streams."""
    if context is not None:
        rid = getattr(context, "aws_request_id", None)
        if rid:
            return str(rid)
    return str(uuid.uuid4())


# Set on each Lambda invocation so lazy listeners can correlate traces
_CURRENT_REQUEST_ID: Optional[str] = None
# time.monotonic() when this Lambda invocation times out (None outside Lambda)
_INVOCATION_DEADLINE: Optional[float] = None
# Left after the answer for formatting, link checks and posting to Slack.
REPLY_RESERVE_SEC = 10.0


def _run_with_deadline(fn, deadline: Optional[float]):
    """fn() if it finishes before `deadline` (time.monotonic()), else None. A late fn keeps
    running in its thread, but its result is never used; errors are re-raised."""
    if deadline is None:
        return fn()
    box: Dict[str, Any] = {}

    def work():
        try:
            box["result"] = fn()
        except BaseException as e:  # noqa: BLE001 — handed back to the caller below
            box["error"] = e

    worker = threading.Thread(target=work, daemon=True)
    worker.start()
    worker.join(max(deadline - time.monotonic(), 0.0))
    if worker.is_alive():
        return None
    if "error" in box:
        raise box["error"]
    return box["result"]


def handle_user_query(
    event,
    say,
    client,
    *,
    force_thread: bool = True,
    known_history: Optional[List[Dict[str, Any]]] = None,
    known_meta: Optional[Dict[str, Any]] = None,
) -> None:
    """
    Common handler for Slack app mentions, DMs, and thread follow-ups.

    Always replies in a thread (force_thread) so subsequent messages share context.
    """
    user_id = event.get("user")
    text = event.get("text") or ""
    channel_id = event.get("channel")
    thread_ts = event.get("thread_ts")
    ts = event.get("ts")
    # Prefer existing thread; otherwise start one on the triggering message
    reply_thread_ts = thread_ts or ts
    request_id = _CURRENT_REQUEST_ID or _new_request_id()

    bot_user_id, bot_app_bot_id = get_bot_identity(client)
    directory = UserDirectory(client)
    cleaned_text = resolve_mentions(
        strip_mention_prefix(text, bot_user_id), directory, skip_ids=[bot_user_id] if bot_user_id else []
    )

    if not cleaned_text:
        say(
            text=(
                "Hi! How can I help you today? Ask me about UVA library hours, "
                "occupancy, Virgo catalog searches, or library policies!"
            ),
            thread_ts=reply_thread_ts if force_thread else None,
            unfurl_links=False,
            unfurl_media=False,
        )
        return

    conversation_history: List[Dict[str, Any]] = list(known_history or [])
    history_meta: Dict[str, Any] = dict(known_meta or {})

    # Load prior turns when we are already inside a thread
    if not conversation_history and reply_thread_ts and channel_id:
        route_domains = history_meta.get("route_domains")  # from the group chime-in call
        conversation_history, _is_ours, history_meta = extract_thread_history(
            client,
            channel_id,
            reply_thread_ts,
            bot_user_id=bot_user_id,
            bot_app_bot_id=bot_app_bot_id,
            current_ts=ts,
            directory=directory,
        )
        if route_domains is not None:
            history_meta["route_domains"] = route_domains

    logger.info(
        "Received query from user %s in channel %s (thread %s): %r "
        "(history turns: %s, meta=%s) request_id=%s",
        user_id,
        channel_id,
        reply_thread_ts,
        cleaned_text,
        len(conversation_history),
        history_meta,
        request_id,
    )

    # Acknowledge work-in-progress with a :brain: reaction on the user's message
    # (no "thinking..." reply spam). Requires reactions:write bot scope.
    thinking_reaction = "brain"
    reacted = False
    if channel_id and ts:
        try:
            client.reactions_add(
                channel=channel_id,
                timestamp=ts,
                name=thinking_reaction,
            )
            reacted = True
        except Exception as err:
            # already_reacted is fine; other errors are non-fatal
            err_str = str(err)
            if "already_reacted" in err_str:
                reacted = True
            else:
                logger.warning(
                    "Could not add :%s: reaction on %s/%s: %s",
                    thinking_reaction,
                    channel_id,
                    ts,
                    err,
                )

    slack_context = {
        "user_id": user_id,
        "channel_id": channel_id,
        "thread_ts": reply_thread_ts,
        "message_ts": ts,
        "channel_type": event.get("channel_type"),
        "history_turns": len(conversation_history),
        "is_followup": bool(thread_ts) or len(conversation_history) > 0,
    }

    slack_tools, slack_lines = slack_tools_for_event(
        event, client, directory=directory, store=action_token_store
    )
    # "as a CSV" earlier in the thread still applies to "now all of them".
    file_fmt = requested_format(cleaned_text, conversation_history)
    # A file asked for in this message ("csv please") can come from the latest table Hoo Helper's
    # tools posted in the thread; a bare request with no such table can't be met.
    asks_file_now = bool(file_format(cleaned_text))
    thread_tables = (history_meta.get("data_tables") or []) if asks_file_now else []
    bare_request = asks_file_now and _bare_file_request(cleaned_text)
    # A citation check's Slack table shows short citations and record ids: rerun it for the full data.
    rerun_citations = bool(thread_tables) and thread_tables[-1].title == "Citation check"
    extra_context = [
        identity_line(directory.get(user_id)),
        unanswered_turns_line(history_meta.get("unanswered_turns") or []),
        file_context_line(file_fmt, available=bool(thread_tables) or not bare_request,
                          rerun_citations=rerun_citations),
    ] + slack_lines

    reply_deadline = (_INVOCATION_DEADLINE - REPLY_RESERVE_SEC) if _INVOCATION_DEADLINE else None
    # Router Phase 2 (routing.py, off unless ENABLE_ROUTING=true): the prompt blocks and tools this
    # question needs.
    route = route_question(
        cleaned_text, conversation_history,
        transcript=[(m.get("role") or "", _turn_text(m)) for m in conversation_history[-4:]],
        hint=(history_meta or {}).get("route_domains"),
        enabled=_routing_enabled(), v2=_gateway_is_v2())

    agent_kwargs: Dict[str, Any] = dict(
        conversation_history=conversation_history,
        request_id=request_id,
        slack_context=slack_context,
        extra_context=extra_context,
        route=route,
        local_tools=LocalTools(
            slack_tools,
            atlassian_tools_for_event(
                event,
                directory=directory,
                email=ATLASSIAN_EMAIL,
                jira_token=ATLASSIAN_JIRA_TOKEN,
                confluence_token=ATLASSIAN_CONFLUENCE_TOKEN,
            ),
            _gated_github(cleaned_text, conversation_history,
                          open_gate=None if route.is_all else "github" in route.domains),
            # Every tool set is built; the route filters what's offered, so more_tools can add any back.
            _matomo_tools(),
            citation_tools_for_env(gateway_call=getattr(getattr(agent, "gateway_client", None), "call_tool", None),
                                   v2=_gateway_is_v2, deadline=reply_deadline),
        ),
    )
    if reply_deadline is not None:
        agent_kwargs["deadline"] = reply_deadline
    # A tool call can block past the agent's own deadline checks; never leave the question unanswered.
    turn = _run_with_deadline(lambda: agent.process_message(cleaned_text, **agent_kwargs), reply_deadline)
    if turn is None:
        logger.warning("Answer not ready before the reply deadline request_id=%s", request_id)
        turn = AgentTurnResult(text=TOO_SLOW_REPLY, trace=SessionTrace(request_id=request_id))
    raw_response = turn.text
    # Link each catalog item the reply names, so "those" can be tied to exact items later.
    raw_response = add_virgo_links(raw_response, getattr(turn.trace, "steps", None))
    trace: SessionTrace = turn.trace

    # Bedrock formats the draft as Slack mrkdwn; hours/occupancy tool output
    # becomes tables/charts; image IIIF URLs become image blocks.
    fallback_text, blocks = format_for_slack(
        raw_response,
        bedrock_client=getattr(agent, "bedrock_runtime", None),
        model_id=getattr(agent, "model_id", None),
        tool_steps=getattr(trace, "steps", None),
        exclude_image_urls=history_meta.get("seen_image_urls") or [],
    )
    # Link gate: verify http(s) URLs; replace broken/ephemeral ones from tool outputs
    try:
        cleaned, link_changes = agent._sanitize_links(
            fallback_text,
            trace,
            extra_candidates=[raw_response] if raw_response else None,
        )
        if link_changes:
            # A dropped untrusted URL may carry data: the trace keeps only its host.
            trace.link_changes = [
                {**c, "url": "host:" + url_host(c.get("url") or "")} if c.get("reason") == "untrusted" else c
                for c in link_changes
            ]
        if cleaned != fallback_text:
            fallback_text = cleaned
            if link_changes:
                blocks = rewrite_urls_in_blocks(blocks, link_changes)
            if hasattr(trace, "final_text"):
                trace.final_text = fallback_text
    except Exception as link_err:
        logger.warning("Post-format link-check skipped: %s", type(link_err).__name__)
        try:
            fallback_text = drop_untrusted_urls(fallback_text, reply_url_filter(trace))[0]
        except Exception:
            fallback_text = "Sorry — something went wrong on my end while answering that. Please try again."
    # Block Kit carries URLs of its own (buttons, images Slack fetches): the same gate, failing closed.
    try:
        blocks = drop_untrusted_block_urls(blocks, trace)
    except Exception as block_err:
        logger.warning("Block link gate failed; posting text only: %s", type(block_err).__name__)
        blocks = []

    logger.info(
        "Formatted Slack reply (%s chars, %s blocks) tools=%s duration_ms=%s followup=%s",
        len(fallback_text),
        len(blocks),
        trace.tools_used(),
        trace.duration_ms,
        slack_context.get("is_followup"),
    )
    trace.set_slack_reply(fallback_text, blocks)

    try:
        pieces = split_messages(blocks) or [[]]
        if len(pieces) > 1:
            logger.info("Reply split into %s messages (Slack: one table, two charts per message)", len(pieces))
        _post_pieces(client, say, pieces, channel=channel_id,
                     thread_ts=reply_thread_ts if force_thread else None,
                     first_text=fallback_text, trace=trace)
        if file_fmt:
            _attach_file(
                client,
                channel_id,
                reply_thread_ts if force_thread else None,
                trace,
                file_fmt,
                # only the last listing: a retry with wider dates replaces the first try
                [l.table for l in getattr(slack_tools, "listings", None) or []][-1:],
                history=conversation_history,
                user_text=cleaned_text,
                thread_tables=thread_tables,
            )
    finally:
        if reacted and channel_id and ts:
            try:
                client.reactions_remove(
                    channel=channel_id,
                    timestamp=ts,
                    name=thinking_reaction,
                )
            except Exception as err:
                # no_reaction / already gone is fine
                if "no_reaction" not in str(err):
                    logger.debug(
                        "Could not remove :%s: reaction on %s/%s: %s",
                        thinking_reaction,
                        channel_id,
                        ts,
                        err,
                    )
        try:
            trace.emit()
        except Exception as emit_err:
            logger.error("Failed to emit session trace: %s", emit_err)


def _post_note(client, channel_id, thread_ts, text) -> None:
    try:
        client.chat_postMessage(channel=channel_id, thread_ts=thread_ts, text=text,
                                unfurl_links=False, unfurl_media=False)
    except Exception:
        pass


def _upload(client, channel_id, thread_ts, trace, content, filename, title) -> None:
    try:
        client.files_upload_v2(
            channel=channel_id,
            thread_ts=thread_ts,
            content=content,
            filename=filename,
            title=title,
        )
        logger.info("Attached %s (%s bytes)", filename, len(content))
    except Exception as e:
        logger.error("File upload failed: %s", e)
        if not trace.error:
            trace.error = f"file_upload: {e}"
        if "missing_scope" in str(e):
            _post_note(client, channel_id, thread_ts,
                       "_I couldn't attach the file: the Slack app needs the `files:write` scope._")


_FILE_REQUEST_WORDS = frozenset(
    "csv tsv excel xlsx json ris zotero file files spreadsheet download please pls can could would i you "
    "me get give want need a an the as in it this that of yes yeah ok okay sure to send make export them "
    "those these thanks thank tab separated".split())


def _bare_file_request(text: str) -> bool:
    """Does the message only ask for a file ("csv please"), with nothing about what data to use?"""
    words = re.findall(r"[a-z']+", (text or "").lower())
    return bool(words) and all(w in _FILE_REQUEST_WORDS for w in words)


def _post_one(client, kwargs: Dict[str, Any], trace) -> bool:
    """chat_postMessage, retrying with the newest block types removed; True when it posted."""
    blocks = kwargs.get("blocks") or []
    try:
        client.chat_postMessage(**kwargs)
        return True
    except Exception as e:
        logger.error("Failed to send Slack response with blocks: %s", e)
        if not trace.error:
            trace.error = f"slack_send: {e}"
    # Newest block types first: drop charts, then flatten carousel → image blocks.
    no_viz = [b for b in blocks if b.get("type") != "data_visualization"]
    retries = []
    if no_viz and no_viz != blocks:
        retries.append(("without charts", no_viz))
    flat = flatten_carousels(no_viz or blocks)
    if flat != (no_viz or blocks):
        retries.append(("carousel flattened to images", flat))
    for label, retry_blocks in retries:
        try:
            client.chat_postMessage(**{**kwargs, "blocks": retry_blocks})
            logger.warning("Posted Slack reply %s", label)
            return True
        except Exception as e_retry:
            logger.error("Retry %s also failed: %s", label, e_retry)
    return False


def _post_pieces(client, say, pieces, *, channel, thread_ts, first_text: str, trace) -> None:
    """Post a reply that may span several messages (see split_messages). The first carries the
    answer text; each later one its own plain text, which thread history reads back. A message
    whose blocks Slack refuses is sent as text, so nothing is silently lost."""
    for i, piece in enumerate(pieces):
        text = first_text if i == 0 else (blocks_plain_text(piece) or "(continued)")
        kwargs = {
            "channel": channel,
            "thread_ts": thread_ts,
            "text": text,
            "blocks": piece,
            # No link previews: a preview fetches the URL from Slack's servers (and shows its page).
            "unfurl_links": False,
            "unfurl_media": False,
        }
        if _post_one(client, kwargs, trace):
            continue
        try:
            say(text=text, thread_ts=thread_ts, unfurl_links=False, unfurl_media=False)
        except Exception as e2:
            logger.error("Fallback Slack send also failed: %s", e2)
            trace.error = f"slack_send_fallback: {e2}"
        if i == 0:
            return  # the answer itself didn't go out with blocks; don't post its continuations


def _gated_github(text: str, history, open_gate=None):
    """GitHub tools for this turn: all of them for a code question, else only enable_github_tools.
    open_gate: the router's decision (None: decide from the message, as Phase 0 does)."""
    tools = github_tools_for_env()
    if tools is None:
        return None
    enabled = wants_github(text, history) if open_gate is None else open_gate
    return GatedGitHubTools(tools, enabled=enabled, guidance=github_prompt_section(_gateway_is_v2()))


def _routing_enabled() -> bool:
    return os.environ.get("ENABLE_ROUTING", "false").strip().lower() == "true"


def _turn_text(msg) -> str:
    return " ".join(b.get("text", "") for b in msg.get("content") or [] if isinstance(b, dict))


def _matomo_tools():
    """Matomo statistics tools (None unless ENABLE_MATOMO=true); the instance is cached per container."""
    gateway = getattr(agent, "gateway_client", None)
    return matomo_tools_for_env(gateway_call=getattr(gateway, "call_tool", None), v2=_gateway_is_v2)


def _gateway_is_v2() -> bool:
    """True when the gateway client listed the uvalib-mcp tool names (cached list; legacy on any doubt)."""
    try:
        return is_v2_toolset(t.get("name") or "" for t in agent.gateway_client.list_tools())
    except Exception:
        return False


def _attach_ris(client, channel_id, thread_ts, trace, tables, call_tool, history=None, user_text="", v2=False) -> None:
    """RIS from Slack link / file listings plus Virgo catalog items, in one file."""
    cite = citable_tables(tables)
    virgo = virgo_ris(getattr(trace, "steps", None), call_tool=call_tool, history=history, user_text=user_text, v2=v2)
    if not cite and not virgo.cited:
        if tables:
            _post_note(client, channel_id, thread_ts,
                       "_RIS is for citations (links, files and catalog items), so there's nothing to cite "
                       "here; I can attach this as a CSV or Excel file instead._")
        return
    if cite:
        content, filename, title = build_file("ris", cite)
    else:
        content, filename, title = b"", "virgo-catalog-citations.ris", "Virgo catalog citations"
    _upload(client, channel_id, thread_ts, trace, content + virgo.content, filename, title)
    notes = []
    if virgo.skipped_other:
        n = virgo.skipped_other
        notes.append(f"{n} result{'s' if n != 1 else ''} from another Virgo source (images, articles) "
                     f"{'aren' if n != 1 else 'isn'}'t a catalog item, so {'they' if n != 1 else 'it'}'s not in the file.")
    if virgo.capped:
        notes.append(f"Only the first {MAX_CITED} catalog items are in the file.")
    if notes:
        _post_note(client, channel_id, thread_ts, "_" + " ".join(notes) + "_")


def _attach_file(client, channel_id, thread_ts, trace, fmt, listing_tables, call_tool=None,
                 history=None, user_text="", thread_tables=None) -> None:
    """Upload this turn's tool tables (Slack listings, gate counts) as the file the user asked for.

    call_tool: a gateway tool caller (default: the bot's own) for Virgo citations in RIS files.
    """
    tables = list(listing_tables or []) + tables_from_steps(getattr(trace, "steps", None))
    if not tables and thread_tables:
        tables = list(thread_tables)[-1:]  # the latest table Hoo Helper's tools posted in the thread
    if fmt == "ris":
        if call_tool is None:
            call_tool = getattr(getattr(agent, "gateway_client", None), "call_tool", None)
        _attach_ris(client, channel_id, thread_ts, trace, tables, call_tool, history, user_text,
                    v2=_gateway_is_v2())
        return
    if not tables:
        logger.info("%s file requested but no table-producing tool ran", fmt)
        return
    try:
        content, filename, title = build_file(fmt, tables)
    except Exception as e:
        logger.error("Building the %s file failed: %s", fmt, e)
        if not trace.error:
            trace.error = f"file_build: {e}"
        return
    _upload(client, channel_id, thread_ts, trace, content, filename, title)


# ---------------------------------------------------------------------------
# Bolt listeners — ack fast, work in lazy listeners (Lambda async re-invoke)
# ---------------------------------------------------------------------------


def _chime_in(text: str, sender: str, snap):
    """Should Hoo Helper reply in a group thread? With routing on, the same small-model call also
    names the question's domains."""
    if _routing_enabled():
        return chime_in.should_reply_routed(text, sender, snap, judge=chime_in.llm_judge_and_route)
    ok, reason = chime_in.should_reply(text, sender, snap, judge=chime_in.llm_judge)
    return ok, reason, None


def _ack(ack):
    ack()


def _lazy_app_mention(event, say, client):
    """@HooHelp in a channel or thread — always answer (and stay in the thread)."""
    handle_user_query(event, say, client, force_thread=True)


def _group_dm_snapshot(client, channel_id, thread_ts, current_ts, bot_user_id, bot_app_bot_id):
    """Recent messages of a group DM (or its thread) for the chime-in decision."""
    try:
        if thread_ts:
            messages = client.conversations_replies(channel=channel_id, ts=thread_ts, limit=20).get("messages") or []
        else:
            # conversations_history returns newest first
            messages = list(reversed(client.conversations_history(channel=channel_id, limit=10).get("messages") or []))
    except Exception as e:
        logger.warning("Could not read group DM %s history: %s", channel_id, e)
        messages = []
    return chime_in.snapshot_from_messages(
        messages, bot_user_id=bot_user_id, bot_app_bot_id=bot_app_bot_id, current_ts=current_ts
    )


def _lazy_message(event, say, client):
    """
    DMs and unmentioned thread follow-ups.

    Channel follow-ups without @mention only arrive if the Slack app is
    subscribed to message.channels / message.groups and the bot is in the channel.
    """
    if should_ignore_message_event(event):
        return

    bot_user_id, bot_app_bot_id = get_bot_identity(client)
    text = event.get("text") or ""

    # Channel @mentions also emit app_mention — skip so we don't answer twice.
    # (DMs don't get app_mention, so a DM that mentions us is answered below.)
    if mention_handled_by_app_mention(event, bot_user_id):
        logger.debug("Skipping message event with @mention (app_mention handles it)")
        return

    channel_type = event.get("channel_type")
    thread_ts = event.get("thread_ts")
    channel_id = event.get("channel")
    ts = event.get("ts")

    # Direct messages (no app_mention for plain DMs without @)
    if channel_type == "im":
        handle_user_query(event, say, client, force_thread=True)
        return
    # Group DMs: several people — same etiquette as multi-person threads
    if channel_type == "mpim":
        snap = _group_dm_snapshot(client, channel_id, thread_ts, ts, bot_user_id, bot_app_bot_id)
        ok, reason, domains = _chime_in(text, event.get("user") or "", snap)
        if not ok:
            logger.info("Group DM %s: not replying (%s)", channel_id, reason)
            return
        handle_user_query(event, say, client, force_thread=True,
                          known_meta={"route_domains": domains} if domains is not None else None)
        return

    # Thread follow-ups in channels / private channels (no new @mention)
    if thread_ts and channel_id:
        history, is_our_thread, meta = extract_thread_history(
            client,
            channel_id,
            thread_ts,
            bot_user_id=bot_user_id,
            bot_app_bot_id=bot_app_bot_id,
            current_ts=ts,
            directory=UserDirectory(client),
        )
        if is_our_thread:
            snap = meta.get("snapshot") or chime_in.Snapshot()
            ok, reason, domains = _chime_in(text, event.get("user") or "", snap)
            if domains is not None:
                meta["route_domains"] = domains  # the chime-in call routed the question too
            if not ok:
                logger.info("Thread %s in %s: not replying (%s)", thread_ts, channel_id, reason)
                return
            logger.info(
                "Thread follow-up in %s thread %s (history=%s meta=%s)",
                channel_id,
                thread_ts,
                len(history),
                meta,
            )
            handle_user_query(
                event,
                say,
                client,
                force_thread=True,
                known_history=history,
                known_meta=meta,
            )
        else:
            logger.info(
                "Ignoring thread message in %s thread %s — not our thread (%s)",
                channel_id,
                thread_ts,
                meta.get("reason"),
            )
        return

    # Top-level channel message without @mention and without thread — ignore
    logger.debug(
        "Ignoring top-level channel message in %s (no @mention, no thread)",
        channel_id,
    )


bolt_app.event("app_mention")(ack=_ack, lazy=[_lazy_app_mention])
bolt_app.event("message")(ack=_ack, lazy=[_lazy_message])


# ---------------------------------------------------------------------------
# Lambda entrypoint
# ---------------------------------------------------------------------------

_slack_handler = SlackRequestHandler(app=bolt_app)


def handler(event, context):
    """
    AWS Lambda entrypoint.

    - API Gateway HTTP API events → SlackRequestHandler (Events API + url_verification)
    - GET /health → simple JSON health check (mapped in template.yaml)
    - Async self-invokes from Bolt lazy listeners are also handled here
    """
    global _CURRENT_REQUEST_ID, _INVOCATION_DEADLINE
    _CURRENT_REQUEST_ID = _new_request_id(context)
    remaining_ms = getattr(context, "get_remaining_time_in_millis", None)
    try:
        _INVOCATION_DEADLINE = time.monotonic() + remaining_ms() / 1000.0 if remaining_ms else None
    except Exception:  # noqa: BLE001 — no deadline is the old behaviour
        _INVOCATION_DEADLINE = None

    # Health check (API Gateway HTTP API v2 format)
    request_context = event.get("requestContext") or {}
    http_info = request_context.get("http") or {}
    method = (http_info.get("method") or event.get("httpMethod") or "").upper()
    path = http_info.get("path") or event.get("rawPath") or event.get("path") or ""

    if method == "GET" and path.rstrip("/").endswith("/health"):
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(
                {
                    "status": "Healthy",
                    "service": "slack-bot-hoo-help",
                    "model": BEDROCK_MODEL_ID,
                    "format_model": SLACK_FORMAT_MODEL_ID,
                }
            ),
        }

    return _slack_handler.handle(event, context)
