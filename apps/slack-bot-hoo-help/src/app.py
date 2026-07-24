"""
app.py — HooHelp Slack Bolt handler for AWS Lambda + Events API

Architecture notes:
- Slack requires a 200 within ~3 seconds for every Events API delivery.
- Long agent work (Bedrock + MCP tools) runs in Bolt *lazy listeners*.
- The AWS Lambda adapter acks quickly, then async re-invokes this same
  Lambda to run the lazy work (needs lambda:InvokeFunction on itself).
- Socket Mode is intentionally not used — Lambda is request-driven.
"""

from __future__ import annotations

import json
import logging
import os
from typing import Any, Dict, List, Optional, Tuple

from slack_bolt import App
from slack_bolt.adapter.aws_lambda import SlackRequestHandler

from agent import HooHelpAgent
from gateway_mcp_client import GatewayMCPClient
from slack_format import format_for_slack

LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=LOG_LEVEL)
logger = logging.getLogger("HooHelpSlackBot")

GATEWAY_URL = os.environ.get(
    "GATEWAY_URL",
    "https://occupancy-reporting-gateway-mohw8c1jug.gateway.bedrock-agentcore.us-east-1.amazonaws.com/mcp",
)
BEDROCK_MODEL_ID = os.environ.get("BEDROCK_MODEL_ID", "us.amazon.nova-pro-v1:0")


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

BOT_USER_ID: Optional[str] = None


def get_bot_user_id(client) -> Optional[str]:
    """Fetch and cache bot user ID for thread participation checks."""
    global BOT_USER_ID
    if not BOT_USER_ID:
        try:
            auth = client.auth_test()
            BOT_USER_ID = auth.get("user_id")
            logger.info("Authenticated as bot user %s (%s)", BOT_USER_ID, auth.get("user"))
        except Exception as e:
            logger.warning("Could not fetch bot_user_id: %s", e)
    return BOT_USER_ID


def extract_thread_history(
    client, channel_id: str, thread_ts: str, bot_id: Optional[str]
) -> Tuple[List[Dict[str, Any]], bool]:
    """
    Fetch thread replies and build Bedrock conversation history.
    Returns (conversation_history, is_bot_participant).
    """
    try:
        resp = client.conversations_replies(channel=channel_id, ts=thread_ts, limit=50)
        messages = resp.get("messages", [])
        if not messages:
            return [], False

        is_bot_participant = False
        conversation_history: List[Dict[str, Any]] = []

        for m in messages[:-1]:
            m_user = m.get("user")
            m_bot = m.get("bot_id")
            if (m_user and bot_id and m_user == bot_id) or m_bot:
                is_bot_participant = True

            txt = m.get("text", "")
            if not txt or "*HooHelp is thinking...*" in txt:
                continue

            if txt.startswith("<@"):
                parts = txt.split(">", 1)
                if len(parts) > 1:
                    txt = parts[1].strip()

            role = "assistant" if ((m_user and bot_id and m_user == bot_id) or m_bot) else "user"
            conversation_history.append({"role": role, "content": [{"text": txt}]})

        parent_user = messages[0].get("user")
        if (parent_user and bot_id and parent_user == bot_id) or messages[0].get("bot_id"):
            is_bot_participant = True

        return conversation_history, is_bot_participant
    except Exception as e:
        logger.warning(
            "Error fetching thread replies for channel %s ts %s: %s",
            channel_id,
            thread_ts,
            e,
        )
        return [], False


def handle_user_query(event, say, client) -> None:
    """Common handler for Slack app mentions, DMs, and thread follow-ups."""
    user_id = event.get("user")
    text = event.get("text", "")
    channel_id = event.get("channel")
    thread_ts = event.get("thread_ts")
    ts = event.get("ts")
    reply_thread_ts = thread_ts or ts

    cleaned_text = text
    if text.startswith("<@"):
        parts = text.split(">", 1)
        if len(parts) > 1:
            cleaned_text = parts[1].strip()

    if not cleaned_text:
        say(
            text=(
                "Hi! How can I help you today? Ask me about UVA library hours, "
                "occupancy, Virgo catalog searches, or library policies!"
            ),
            thread_ts=reply_thread_ts,
        )
        return

    conversation_history: List[Dict[str, Any]] = []
    bot_id = get_bot_user_id(client)
    if thread_ts:
        conversation_history, _ = extract_thread_history(client, channel_id, thread_ts, bot_id)

    logger.info(
        "Received query from user %s in channel %s (thread %s): %r (history turns: %s)",
        user_id,
        channel_id,
        thread_ts,
        cleaned_text,
        len(conversation_history),
    )

    status_ts = None
    try:
        status_msg = say(text="*HooHelp is thinking...* :brain:", thread_ts=reply_thread_ts)
        status_ts = status_msg.get("ts") if isinstance(status_msg, dict) else None
    except Exception as err:
        logger.warning("Could not post initial thinking status: %s", err)

    raw_response = agent.process_message(cleaned_text, conversation_history=conversation_history)
    # Bedrock formats the draft as Slack mrkdwn; image IIIF URLs become image blocks
    fallback_text, blocks = format_for_slack(
        raw_response,
        bedrock_client=getattr(agent, "bedrock_runtime", None),
        model_id=getattr(agent, "model_id", None),
    )
    logger.info("Formatted Slack reply (%s chars, %s blocks)", len(fallback_text), len(blocks))

    try:
        if status_ts:
            client.chat_update(
                channel=channel_id,
                ts=status_ts,
                text=fallback_text,
                blocks=blocks,
            )
        else:
            client.chat_postMessage(
                channel=channel_id,
                thread_ts=reply_thread_ts,
                text=fallback_text,
                blocks=blocks,
            )
    except Exception as e:
        logger.error("Failed to send Slack response with blocks: %s", e)
        try:
            if status_ts:
                client.chat_update(channel=channel_id, ts=status_ts, text=fallback_text)
            else:
                say(text=fallback_text, thread_ts=reply_thread_ts)
        except Exception as e2:
            logger.error("Fallback Slack send also failed: %s", e2)


# ---------------------------------------------------------------------------
# Bolt listeners — ack fast, work in lazy listeners (Lambda async re-invoke)
# ---------------------------------------------------------------------------


def _ack(ack):
    ack()


def _lazy_app_mention(event, say, client):
    handle_user_query(event, say, client)


def _lazy_message(event, say, client):
    # Ignore bot messages and message subtypes (edits, joins, etc.) to prevent loops
    if event.get("bot_id") or event.get("subtype"):
        return

    # Top-level @mentions also emit app_mention — skip so we don't answer twice
    bot_id = get_bot_user_id(client)
    text = event.get("text") or ""
    if bot_id and f"<@{bot_id}>" in text:
        return

    channel_type = event.get("channel_type")
    thread_ts = event.get("thread_ts")
    channel_id = event.get("channel")

    # Direct messages (no app_mention event for plain DMs without @)
    if channel_type in ("im", "mpim"):
        handle_user_query(event, say, client)
        return

    # Thread follow-ups where the bot already participated (no new @mention)
    if thread_ts:
        _, is_bot_participant = extract_thread_history(client, channel_id, thread_ts, bot_id)
        if is_bot_participant:
            logger.info(
                "Bot is participant in thread %s — handling unmentioned follow-up.",
                thread_ts,
            )
            handle_user_query(event, say, client)


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
