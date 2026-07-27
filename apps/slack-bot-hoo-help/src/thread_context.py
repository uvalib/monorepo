"""
thread_context.py — Slack thread history + participation for multi-turn HooHelp.

Used so the bot can answer follow-ups in threads it is already in (with or
without a new @mention), and so Bedrock receives a valid alternating history.
"""

from __future__ import annotations

import logging
import re
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

# System / noise subtypes we never treat as user questions
_IGNORE_SUBTYPES = frozenset(
    {
        "bot_message",
        "message_changed",
        "message_deleted",
        "channel_join",
        "channel_leave",
        "channel_topic",
        "channel_purpose",
        "channel_name",
        "channel_archive",
        "channel_unarchive",
        "group_join",
        "group_leave",
        "group_topic",
        "group_purpose",
        "group_name",
        "group_archive",
        "group_unarchive",
        "file_comment",
        "pinned_item",
        "unpinned_item",
        "ekm_access_denied",
        "thread_broadcast",  # also posted in channel; parent thread reply is enough
    }
)

_THINKING_MARKERS = (
    "*HooHelp is thinking...*",
    "HooHelp is thinking...",
)

# Max prior turns (user+assistant pairs roughly) to send to Bedrock
DEFAULT_MAX_HISTORY_MESSAGES = 20


def strip_mention_prefix(text: str, bot_user_id: Optional[str] = None) -> str:
    """Remove leading <@BOT> (and other leading mentions) from message text."""
    if not text:
        return ""
    cleaned = text.strip()
    # Strip any leading user mentions (bot or otherwise)
    while True:
        m = re.match(r"^<@([A-Z0-9]+)>(\s*|:?\s*)", cleaned)
        if not m:
            break
        cleaned = cleaned[m.end() :].strip()
    # Slack sometimes uses <!subteam...> etc. — leave those
    return cleaned


def text_mentions_bot(text: str, bot_user_id: Optional[str]) -> bool:
    if not text or not bot_user_id:
        return False
    return f"<@{bot_user_id}>" in text


def is_from_our_bot(
    message: Dict[str, Any],
    *,
    bot_user_id: Optional[str],
    bot_app_bot_id: Optional[str] = None,
) -> bool:
    """True if this Slack message was posted by our HooHelp bot."""
    if not message:
        return False
    m_user = message.get("user")
    m_bot = message.get("bot_id")
    if bot_user_id and m_user and m_user == bot_user_id:
        return True
    if bot_app_bot_id and m_bot and m_bot == bot_app_bot_id:
        return True
    # Some posts only set bot_id; if we know our user id, also match app_id paths
    # where username is set and user is missing — treat bot_id-only as bot only
    # when we already know this thread is ours is handled separately.
    return False


def should_ignore_message_event(event: Dict[str, Any]) -> bool:
    """Skip edits, joins, other bots, and non-user message noise."""
    if event.get("bot_id"):
        return True
    # app_bot messages sometimes set bot_profile without bot_id on rare payloads
    if event.get("bot_profile") and not event.get("user"):
        return True
    subtype = event.get("subtype")
    if subtype and subtype in _IGNORE_SUBTYPES:
        return True
    # message_changed etc. already covered; allow file_share with text
    if subtype and subtype not in (None, "", "file_share", "me_message"):
        # Unknown subtype — be conservative for follow-ups
        logger.debug("Ignoring message subtype=%s", subtype)
        return True
    return False


def sanitize_bedrock_history(
    history: List[Dict[str, Any]],
    *,
    max_messages: int = DEFAULT_MAX_HISTORY_MESSAGES,
) -> List[Dict[str, Any]]:
    """
    Bedrock Converse requires:
      - roles alternate user / assistant
      - first message is user
      - content is non-empty text blocks
    Merge consecutive same-role turns and drop leading assistant turns.
    """
    cleaned: List[Dict[str, Any]] = []
    for msg in history:
        role = msg.get("role")
        if role not in ("user", "assistant"):
            continue
        parts = []
        for block in msg.get("content") or []:
            if isinstance(block, dict) and block.get("text"):
                t = str(block["text"]).strip()
                if t and not any(m in t for m in _THINKING_MARKERS):
                    parts.append(t)
        if not parts:
            continue
        text = "\n".join(parts).strip()
        if not text:
            continue
        if cleaned and cleaned[-1]["role"] == role:
            # Merge consecutive same role
            prev = cleaned[-1]["content"][0]["text"]
            cleaned[-1] = {
                "role": role,
                "content": [{"text": f"{prev}\n{text}"}],
            }
        else:
            cleaned.append({"role": role, "content": [{"text": text}]})

    # Must start with user
    while cleaned and cleaned[0]["role"] != "user":
        cleaned.pop(0)

    # Trim to last N messages, still starting with user
    if len(cleaned) > max_messages:
        cleaned = cleaned[-max_messages:]
        while cleaned and cleaned[0]["role"] != "user":
            cleaned.pop(0)

    # If we end on user, drop trailing user turns so the new question can append
    # (caller always appends the current user message)
    while cleaned and cleaned[-1]["role"] == "user":
        cleaned.pop()

    return cleaned


def extract_thread_history(
    client,
    channel_id: str,
    thread_ts: str,
    *,
    bot_user_id: Optional[str],
    bot_app_bot_id: Optional[str] = None,
    current_ts: Optional[str] = None,
    max_messages: int = DEFAULT_MAX_HISTORY_MESSAGES,
) -> Tuple[List[Dict[str, Any]], bool, Dict[str, Any]]:
    """
    Fetch thread replies and build Bedrock conversation history.

    Returns:
      (conversation_history, is_our_thread, meta)

    is_our_thread is True when our bot already posted in the thread, or the
    parent (or any prior message) @mentioned our bot — so unmentioned follow-ups
    should still be answered.
    """
    meta: Dict[str, Any] = {
        "fetched": False,
        "raw_count": 0,
        "history_count": 0,
        "is_our_thread": False,
        "reason": "",
    }
    try:
        resp = client.conversations_replies(
            channel=channel_id,
            ts=thread_ts,
            limit=50,
            inclusive=True,
        )
        messages = resp.get("messages") or []
        meta["fetched"] = True
        meta["raw_count"] = len(messages)
        if not messages:
            meta["reason"] = "empty_thread"
            return [], False, meta

        is_our_thread = False
        raw_history: List[Dict[str, Any]] = []

        for m in messages:
            m_ts = m.get("ts")
            # Skip the message we are currently answering (avoid duplicating it)
            if current_ts and m_ts == current_ts:
                # Still use it for participation? No — it's the new user message.
                # Participation based on prior + parent mention.
                if text_mentions_bot(m.get("text") or "", bot_user_id):
                    # Current message mentions us — our thread for this turn
                    # (handled via app_mention usually)
                    pass
                continue

            if is_from_our_bot(
                m, bot_user_id=bot_user_id, bot_app_bot_id=bot_app_bot_id
            ):
                is_our_thread = True
            elif text_mentions_bot(m.get("text") or "", bot_user_id):
                is_our_thread = True

            txt = strip_mention_prefix(m.get("text") or "", bot_user_id)
            if not txt:
                continue
            if any(marker in txt for marker in _THINKING_MARKERS):
                continue

            if is_from_our_bot(
                m, bot_user_id=bot_user_id, bot_app_bot_id=bot_app_bot_id
            ):
                role = "assistant"
            else:
                # Skip other bots in the thread
                if m.get("bot_id") or m.get("bot_profile"):
                    continue
                role = "user"

            raw_history.append({"role": role, "content": [{"text": txt}]})

        # Parent-only mention: first message @mentioned us even if bot has not
        # finished its first reply yet (or reply failed)
        parent = messages[0]
        if text_mentions_bot(parent.get("text") or "", bot_user_id):
            is_our_thread = True
        if is_from_our_bot(
            parent, bot_user_id=bot_user_id, bot_app_bot_id=bot_app_bot_id
        ):
            is_our_thread = True

        history = sanitize_bedrock_history(raw_history, max_messages=max_messages)
        meta["history_count"] = len(history)
        meta["is_our_thread"] = is_our_thread
        meta["reason"] = "ok" if is_our_thread else "bot_not_in_thread"
        return history, is_our_thread, meta

    except Exception as e:
        logger.warning(
            "Error fetching thread replies for channel %s ts %s: %s",
            channel_id,
            thread_ts,
            e,
        )
        meta["reason"] = f"fetch_error: {e}"
        return [], False, meta
