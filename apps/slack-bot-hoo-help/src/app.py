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
import uuid
from typing import Any, Dict, List, Optional, Tuple

from slack_bolt import App
from slack_bolt.adapter.aws_lambda import SlackRequestHandler

from agent import HooHelpAgent
from gateway_mcp_client import GatewayMCPClient
from session_trace import SessionTrace
from slack_format import format_for_slack
from thread_context import (
    extract_thread_history,
    should_ignore_message_event,
    strip_mention_prefix,
    text_mentions_bot,
)

LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=LOG_LEVEL)
logger = logging.getLogger("HooHelpSlackBot")

GATEWAY_URL = os.environ.get(
    "GATEWAY_URL",
    "https://occupancy-reporting-gateway-mohw8c1jug.gateway.bedrock-agentcore.us-east-1.amazonaws.com/mcp",
)
BEDROCK_MODEL_ID = os.environ.get("BEDROCK_MODEL_ID", "us.anthropic.claude-sonnet-5")


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


def handle_user_query(
    event,
    say,
    client,
    *,
    force_thread: bool = True,
    known_history: Optional[List[Dict[str, Any]]] = None,
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
    cleaned_text = strip_mention_prefix(text, bot_user_id)

    if not cleaned_text:
        say(
            text=(
                "Hi! How can I help you today? Ask me about UVA library hours, "
                "occupancy, Virgo catalog searches, or library policies!"
            ),
            thread_ts=reply_thread_ts if force_thread else None,
        )
        return

    conversation_history: List[Dict[str, Any]] = list(known_history or [])
    history_meta: Dict[str, Any] = {}

    # Load prior turns when we are already inside a thread
    if not conversation_history and reply_thread_ts and channel_id:
        conversation_history, _is_ours, history_meta = extract_thread_history(
            client,
            channel_id,
            reply_thread_ts,
            bot_user_id=bot_user_id,
            bot_app_bot_id=bot_app_bot_id,
            current_ts=ts,
        )

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

    turn = agent.process_message(
        cleaned_text,
        conversation_history=conversation_history,
        request_id=request_id,
        slack_context=slack_context,
    )
    raw_response = turn.text
    trace: SessionTrace = turn.trace

    # Bedrock formats the draft as Slack mrkdwn; image IIIF URLs become image blocks
    fallback_text, blocks = format_for_slack(
        raw_response,
        bedrock_client=getattr(agent, "bedrock_runtime", None),
        model_id=getattr(agent, "model_id", None),
    )
    logger.info(
        "Formatted Slack reply (%s chars, %s blocks) tools=%s duration_ms=%s followup=%s",
        len(fallback_text),
        len(blocks),
        trace.tools_used(),
        trace.duration_ms,
        slack_context.get("is_followup"),
    )
    trace.set_slack_reply(fallback_text)

    try:
        client.chat_postMessage(
            channel=channel_id,
            thread_ts=reply_thread_ts if force_thread else None,
            text=fallback_text,
            blocks=blocks,
        )
    except Exception as e:
        logger.error("Failed to send Slack response with blocks: %s", e)
        if not trace.error:
            trace.error = f"slack_send: {e}"
        try:
            say(
                text=fallback_text,
                thread_ts=reply_thread_ts if force_thread else None,
            )
        except Exception as e2:
            logger.error("Fallback Slack send also failed: %s", e2)
            trace.error = f"slack_send_fallback: {e2}"
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


# ---------------------------------------------------------------------------
# Bolt listeners — ack fast, work in lazy listeners (Lambda async re-invoke)
# ---------------------------------------------------------------------------


def _ack(ack):
    ack()


def _lazy_app_mention(event, say, client):
    """@HooHelp in a channel or thread — always answer (and stay in the thread)."""
    handle_user_query(event, say, client, force_thread=True)


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

    # Top-level @mentions also emit app_mention — skip so we don't answer twice.
    # Thread follow-ups that @mention us are also handled by app_mention.
    if text_mentions_bot(text, bot_user_id):
        logger.debug("Skipping message event with @mention (app_mention handles it)")
        return

    channel_type = event.get("channel_type")
    thread_ts = event.get("thread_ts")
    channel_id = event.get("channel")
    ts = event.get("ts")

    # Direct messages (no app_mention for plain DMs without @)
    if channel_type in ("im", "mpim"):
        handle_user_query(event, say, client, force_thread=True)
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
        )
        if is_our_thread:
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
    global _CURRENT_REQUEST_ID
    _CURRENT_REQUEST_ID = _new_request_id(context)

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
                }
            ),
        }

    return _slack_handler.handle(event, context)
