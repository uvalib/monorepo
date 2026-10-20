"""
slack_search.py — search public Slack history and read the thread around a hit.

In-process tools (like wikipedia_tools.py), built per turn because they need
that event's action_token:

  - search_slack: Slack's Real-time Search API (assistant.search.context) with
    the bot token + action_token, public channels only.
  - read_slack_thread: conversations.replies with the bot token. The bot token
    also has groups:history, so the public-channel check here is what keeps
    private channels, DMs and group DMs out.
"""

from __future__ import annotations

import logging
import os
import re
from datetime import datetime
from typing import Any, Callable, Dict, List, Optional, Tuple
from urllib.parse import parse_qs, urlparse
from zoneinfo import ZoneInfo

from identity import UserDirectory, resolve_mentions

logger = logging.getLogger(__name__)

TOOL_SEARCH = "search_slack"
TOOL_READ_THREAD = "read_slack_thread"

TZ = ZoneInfo("America/New_York")
MAX_HIT_CHARS = 400
MAX_THREAD_CHARS = 6000
FROM_USER_FETCH = 20  # filter by author in the tool (see plan rulings)

EXPIRED_TEXT = "Slack search needs a fresh @mention in this thread."
BUSY_TEXT = "Slack search is busy, try again in a minute."
PUBLIC_ONLY_TEXT = "I can only read public channels, not private channels, DMs or group DMs."

_PERMALINK = re.compile(r"/archives/([A-Z0-9]+)/p(\d{10})(\d{6})")
_logged_keys = False
_CHANNEL_IDS: Dict[str, str] = {}  # public channel name → id, per container

SEARCH_DESCRIPTION = (
    "Search public Slack channels for past discussions and decisions (public channels only — "
    "never private channels or DMs). Phrase the query as a question for best results, e.g. "
    "'what did we decide about LibCal hours?'. Optional: from_user (a name, @name, Slack id, or "
    "'me' for the person asking), channel (name or id), after / before (YYYY-MM-DD). Use at most "
    "2–3 searches per answer. In the answer, cite each message's channel, author and permalink; "
    "a Slack message is discussion, not official policy."
)
READ_THREAD_DESCRIPTION = (
    "Read the whole public Slack thread around a message. Pass a permalink from search_slack "
    "(or channel + ts). Public channels only."
)


def _spec(name: str, description: str, properties: Dict[str, Any], required: List[str]) -> Dict[str, Any]:
    return {"toolSpec": {"name": name, "description": description,
                         "inputSchema": {"json": {"type": "object", "properties": properties, "required": required}}}}


def _error_code(err: Exception) -> Tuple[str, Optional[int]]:
    resp = getattr(err, "response", None)
    code = ""
    try:
        code = (resp or {}).get("error") or ""
    except Exception:
        code = ""
    return str(code), getattr(resp, "status_code", None)


def _day_ts(value: str) -> int:
    return int(datetime.strptime(value.strip(), "%Y-%m-%d").replace(tzinfo=TZ).timestamp())


def _when(ts: str) -> str:
    try:
        return datetime.fromtimestamp(float(ts), TZ).strftime("%a %Y-%m-%d %-I:%M %p")
    except (TypeError, ValueError):
        return ""


def _trim(text: str, limit: int) -> str:
    text = " ".join((text or "").split())
    return text if len(text) <= limit else text[: limit - 1].rstrip() + "…"


def _is_public(channel: Dict[str, Any]) -> bool:
    """Fails closed: Slack must say is_private is False, and it mustn't be a DM / group DM."""
    return channel.get("is_private") is False and not any(
        channel.get(k) for k in ("is_im", "is_mpim", "is_group")
    )


def _hit_is_public(hit: Dict[str, Any]) -> bool:
    """Defence in depth on search hits (channel_types=public_channel should already ensure it)."""
    cid = str(hit.get("channel_id") or "")
    if cid.startswith(("D", "G")) or hit.get("is_private"):
        return False
    channel_type = hit.get("channel_type")
    return not channel_type or channel_type == "public_channel"


class SlackSearchTools:
    def __init__(
        self,
        client,
        *,
        action_token: str,
        asker_id: str,
        directory: UserDirectory,
        on_token_expired: Callable[[], None] = lambda: None,
    ):
        self.client = client
        self.action_token = action_token or ""
        self.asker_id = asker_id
        self.directory = directory
        self.on_token_expired = on_token_expired

    # ---- tool plumbing -------------------------------------------------------

    def tool_specs(self) -> List[Dict[str, Any]]:
        specs = []
        if self.action_token:
            specs.append(_spec(TOOL_SEARCH, SEARCH_DESCRIPTION, {
                "query": {"type": "string", "description": "What to look for, ideally as a question"},
                "from_user": {"type": "string", "description": "Name, @name, Slack id, or 'me'"},
                "channel": {"type": "string", "description": "Public channel name or id"},
                "after": {"type": "string", "description": "YYYY-MM-DD"},
                "before": {"type": "string", "description": "YYYY-MM-DD"},
                "limit": {"type": "integer", "description": "Max results (default 10)"},
            }, ["query"]))
        specs.append(_spec(TOOL_READ_THREAD, READ_THREAD_DESCRIPTION, {
            "permalink_or_ts": {"type": "string", "description": "Slack permalink, or a message ts with channel"},
            "channel": {"type": "string", "description": "Channel id when passing a ts"},
        }, ["permalink_or_ts"]))
        return specs

    def handles(self, name: str) -> bool:
        return name in (TOOL_SEARCH, TOOL_READ_THREAD)

    def call(self, name: str, args: Dict[str, Any]) -> str:
        args = args if isinstance(args, dict) else {}
        try:
            if name == TOOL_SEARCH:
                return self.search(
                    str(args.get("query") or ""),
                    from_user=str(args.get("from_user") or ""),
                    channel=str(args.get("channel") or ""),
                    after=str(args.get("after") or ""),
                    before=str(args.get("before") or ""),
                    limit=int(args.get("limit") or 10),
                )
            if name == TOOL_READ_THREAD:
                return self.read_thread(str(args.get("permalink_or_ts") or ""), channel=str(args.get("channel") or ""))
        except Exception as e:  # never hand the model a stack trace
            logger.warning("%s failed: %s", name, type(e).__name__)
            return "Slack didn't respond as expected; try again in a minute."
        return f"Unknown Slack tool: {name}"

    # ---- helpers -------------------------------------------------------------

    def _public_channel(self, name_or_id: str) -> Tuple[Optional[str], str]:
        """(channel id, '') for a public channel, or (None, sentence to return)."""
        raw = name_or_id.strip().lstrip("#")
        channel_id = raw if re.fullmatch(r"[CG][A-Z0-9]+", raw) else _CHANNEL_IDS.get(raw.lower())
        if not channel_id:
            cursor = None
            while True:
                resp = self.client.conversations_list(types="public_channel", limit=200, cursor=cursor,
                                                      exclude_archived=False) or {}
                for c in resp.get("channels") or []:
                    _CHANNEL_IDS[str(c.get("name") or "").lower()] = c.get("id")
                cursor = (resp.get("response_metadata") or {}).get("next_cursor")
                if not cursor:
                    break
            channel_id = _CHANNEL_IDS.get(raw.lower())
        if not channel_id:
            return None, f'I couldn\'t find a public channel named "{name_or_id}".'
        try:
            info = (self.client.conversations_info(channel=channel_id) or {}).get("channel") or {}
        except Exception:
            return None, f'I couldn\'t find a public channel named "{name_or_id}".'
        if not _is_public(info):
            return None, PUBLIC_ONLY_TEXT
        return channel_id, ""

    def _channel_name(self, hit: Dict[str, Any]) -> str:
        name = hit.get("channel_name")
        if not name and isinstance(hit.get("channel"), dict):
            name = hit["channel"].get("name")
        if name:
            return str(name)
        cid = hit.get("channel_id") or (hit.get("channel") if isinstance(hit.get("channel"), str) else "")
        if cid:
            try:
                return str(((self.client.conversations_info(channel=cid) or {}).get("channel") or {}).get("name") or cid)
            except Exception:
                return str(cid)
        return "unknown channel"

    def _permalink(self, hit: Dict[str, Any], ts: str) -> str:
        if hit.get("permalink"):
            return str(hit["permalink"])
        cid = hit.get("channel_id")
        if cid and ts:
            try:
                return str((self.client.chat_getPermalink(channel=cid, message_ts=ts) or {}).get("permalink") or "")
            except Exception:
                return ""
        return ""

    # ---- tools ---------------------------------------------------------------

    def search(self, query: str, from_user: str = "", channel: str = "", after: str = "",
               before: str = "", limit: int = 10) -> str:
        global _logged_keys
        if not self.action_token:
            return EXPIRED_TEXT
        if not query.strip():
            return "Give me something to search for."
        limit = max(1, min(int(limit or 10), 20))

        author_id = ""
        if from_user.strip():
            if from_user.strip().lower() in ("me", "@me", "myself"):
                author_id = self.asker_id
            else:
                author_id = self.directory.find(from_user) or ""
                if not author_id:
                    people = self.directory.candidates(from_user)
                    if len(people) > 1:
                        names = ", ".join(p.label for p in people[:5])
                        return f'More than one person matches "{from_user}": {names}. Which one?'
            if not author_id:
                return f'I couldn\'t find a Slack user named "{from_user}".'

        params: Dict[str, Any] = {
            "query": query,
            "action_token": self.action_token,
            "channel_types": "public_channel",
            "content_types": "messages",
            "limit": FROM_USER_FETCH if author_id else limit,
        }
        try:
            if after.strip():
                params["after"] = _day_ts(after)
            if before.strip():
                params["before"] = _day_ts(before)
        except ValueError:
            return "Dates for after / before must be YYYY-MM-DD."

        channel_id = ""
        if channel.strip():
            channel_id, refusal = self._public_channel(channel)
            if refusal:
                return refusal
            params["context_channel_id"] = channel_id

        try:
            resp = self.client.api_call("assistant.search.context", params=params) or {}
        except Exception as e:
            code, status = _error_code(e)
            if "action_token" in code or code in ("invalid_auth_token", "token_expired"):
                self.on_token_expired()
                return EXPIRED_TEXT
            if status == 429 or code == "ratelimited":
                return BUSY_TEXT
            logger.warning("assistant.search.context failed: %s", code or type(e).__name__)
            return f"Slack search didn't work just now ({code or type(e).__name__})."

        results = resp.get("results") if isinstance(resp.get("results"), dict) else {}
        hits = list(results.get("messages") or resp.get("messages") or [])
        if hits and not _logged_keys:
            logger.info("slack_search result keys: %s", sorted(hits[0].keys()))
            _logged_keys = True

        def author_of(h: Dict[str, Any]) -> str:
            return str(h.get("author_user_id") or h.get("user") or "")

        hits = [h for h in hits if _hit_is_public(h)]
        if author_id:
            hits = [h for h in hits if author_of(h) == author_id]
        if channel_id:
            hits = [h for h in hits if (h.get("channel_id") or channel_id) == channel_id]
        hits = hits[:limit]
        if not hits:
            return f'No public Slack messages matched "{query}".'

        lines = [f'### Slack search: "{query}"', "_Public channels only._", ""]
        for i, h in enumerate(hits, 1):
            ts = str(h.get("message_ts") or h.get("ts") or "")
            uid = author_of(h)
            who = f"{self.directory.label(uid) if uid else (h.get('author_name') or 'unknown')}" + (f" ({uid})" if uid else "")
            text = resolve_mentions(str(h.get("content") or h.get("text") or ""), self.directory)
            lines.append(f"{i}. **#{self._channel_name(h)}** — {who} · {_when(ts)}")
            lines.append(f"   {_trim(text, MAX_HIT_CHARS)}")
            link = self._permalink(h, ts)
            if link:
                lines.append(f"   Link: {link}")
        return "\n".join(lines)

    def read_thread(self, permalink_or_ts: str, channel: str = "") -> str:
        ref = (permalink_or_ts or "").strip()
        m = _PERMALINK.search(ref)
        if m:
            channel_id, ts = m.group(1), f"{m.group(2)}.{m.group(3)}"
            thread_ts = (parse_qs(urlparse(ref).query).get("thread_ts") or [""])[0]
            ts = thread_ts or ts
        elif re.fullmatch(r"\d{10}\.\d{6}", ref) and channel.strip():
            channel_id, ts = channel.strip(), ref
        else:
            return "Pass a Slack message link (permalink) from search_slack, or a ts with its channel."

        try:
            info = (self.client.conversations_info(channel=channel_id) or {}).get("channel") or {}
        except Exception:
            return "I couldn't open that Slack channel."
        if not _is_public(info):
            return PUBLIC_ONLY_TEXT

        try:
            messages = (self.client.conversations_replies(channel=channel_id, ts=ts, limit=50, inclusive=True)
                        or {}).get("messages") or []
        except Exception as e:
            code, status = _error_code(e)
            if status == 429 or code == "ratelimited":
                return BUSY_TEXT
            if code == "not_in_channel":
                return (
                    "I can only open full threads in channels Hoo Helper has been added to; "
                    "the search result and its link are what I can share for this one."
                )
            return f"I couldn't read that Slack thread ({code or type(e).__name__})."

        name = info.get("name") or channel_id
        out = [f"### Slack thread in #{name}"]
        for msg in messages:
            if msg.get("subtype") in ("channel_join", "channel_leave"):
                continue
            uid = msg.get("user") or ""
            who = self.directory.label(uid) if uid else (msg.get("username") or "bot")
            text = resolve_mentions(msg.get("text") or "", self.directory)
            out.append(f"[{_when(str(msg.get('ts') or ''))}] {who}: {text}")
        link = ref if m else ""
        body = "\n".join(out)
        if len(body) > MAX_THREAD_CHARS:
            body = body[: MAX_THREAD_CHARS - 1] + "…\n(thread trimmed)"
        return body + (f"\nThread: {link}" if link else "")


NO_TOKEN_LINE = (
    "Slack search is unavailable in this thread until someone @mentions Hoo Helper again; "
    "say so only if Slack history would help answer."
)


def _search_allowed(event: Dict[str, Any], env) -> bool:
    if str(env.get("ENABLE_SLACK_SEARCH", "false")).strip().lower() != "true":
        return False
    allow = {x.strip() for x in str(env.get("SLACK_SEARCH_ALLOW", "") or "").split(",") if x.strip()}
    return not allow or event.get("channel") in allow or event.get("user") in allow


def slack_tools_for_event(event: Dict[str, Any], client, *, directory: UserDirectory, store, env=None):
    """(SlackSearchTools or None, extra system-prompt lines) for this Slack event."""
    env = os.environ if env is None else env
    if not _search_allowed(event, env):
        return None, []
    token = store.resolve(event)
    tools = SlackSearchTools(
        client,
        action_token=token,
        asker_id=event.get("user") or "",
        directory=directory,
        on_token_expired=lambda: store.expire(event),
    )
    return tools, ([] if token else [NO_TOKEN_LINE])
