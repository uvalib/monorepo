"""
action_tokens.py — keep Slack's search action_token for a whole thread.

Slack's Real-time Search API needs an action_token for bot-token searches. It
arrives on app_mention, DM and group-DM events, but not on unmentioned thread
follow-ups. We save it per conversation (channel thread, DM or group DM) and
reuse it until Slack rejects it, with a 24 h backstop TTL because Slack doesn't
document its lifetime.

The token is a credential: it is never logged. Logs say only
action_token=present|reused|missing|expired.
"""

from __future__ import annotations

import logging
import os
import time
from typing import Any, Callable, Dict, Optional

logger = logging.getLogger(__name__)

DEFAULT_TTL_SECONDS = 24 * 3600


def conversation_key(event: Dict[str, Any]) -> Optional[str]:
    channel = event.get("channel")
    if not channel:
        return None
    if event.get("channel_type") in ("im", "mpim"):
        return channel
    return f"{channel}#{event.get('thread_ts') or event.get('ts')}"


def token_from_event(event: Dict[str, Any]) -> str:
    return event.get("action_token") or (event.get("assistant_thread") or {}).get("action_token") or ""


class ActionTokenStore:
    def __init__(
        self,
        table: Any = None,
        *,
        table_name: Optional[str] = None,
        ttl_seconds: int = DEFAULT_TTL_SECONDS,
        now: Callable[[], float] = time.time,
    ):
        self._table = table
        self._table_name = os.environ.get("ACTION_TOKENS_TABLE", "") if table_name is None else table_name
        self.ttl = ttl_seconds
        self.now = now

    def _get_table(self):
        if self._table is None and self._table_name:
            import boto3

            self._table = boto3.resource(
                "dynamodb", region_name=os.environ.get("AWS_REGION", "us-east-1")
            ).Table(self._table_name)
        return self._table

    def resolve(self, event: Dict[str, Any]) -> str:
        """The token to search with for this event's conversation ('' if none)."""
        token = token_from_event(event)
        key = conversation_key(event)
        try:
            table = self._get_table()
            if token:
                if table is not None and key:
                    table.put_item(Item={"key": key, "token": token, "expires_at": int(self.now() + self.ttl)})
                logger.info("action_token=present")
                return token
            if table is None or not key:
                logger.info("action_token=missing")
                return ""
            item = (table.get_item(Key={"key": key}) or {}).get("Item")
            if item and int(item.get("expires_at") or 0) > self.now() and item.get("token"):
                logger.info("action_token=reused")
                return str(item["token"])
            logger.info("action_token=missing")
            return ""
        except Exception as e:
            logger.warning("action_token=missing (store error: %s)", type(e).__name__)
            return token

    def expire(self, event: Dict[str, Any]) -> None:
        """Slack rejected the token: forget it for this conversation."""
        key = conversation_key(event)
        logger.info("action_token=expired")
        try:
            table = self._get_table()
            if table is not None and key:
                table.delete_item(Key={"key": key})
        except Exception as e:
            logger.warning("Could not delete expired action_token (%s)", type(e).__name__)
