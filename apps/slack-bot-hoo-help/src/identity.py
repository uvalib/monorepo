"""
identity.py — who is Hoo Helper talking to?

Resolves Slack user ids to names (cached `users.info` / `users.list`) for:
  - one system-prompt line about the person asking,
  - speaker labels in thread history,
  - turning <@U…> mentions into names.

Email is never used, even though the bot token can read it. Pronouns are
included only when the person has set them in their profile.
"""

from __future__ import annotations

import logging
import re
import time
from dataclasses import dataclass
from typing import Any, Dict, Iterable, List, Optional, Tuple

logger = logging.getLogger(__name__)

DEFAULT_TTL_SECONDS = 3600

# Shared by all UserDirectory instances so a warm Lambda container reuses lookups.
_PROFILES: Dict[str, Tuple[float, "UserInfo"]] = {}
_MEMBERS: Dict[str, Any] = {"expires": 0.0, "infos": []}

_MENTION = re.compile(r"<@([UW][A-Z0-9]+)(?:\|[^>]*)?>")
_USER_ID = re.compile(r"^[UW][A-Z0-9]*[0-9][A-Z0-9]*$")  # needs a digit, so "UVA" stays a name


def _reset_cache() -> None:
    """Tests only."""
    _PROFILES.clear()
    _MEMBERS.update(expires=0.0, infos=[])


@dataclass
class UserInfo:
    user_id: str
    real_name: str
    display_name: str
    title: str
    pronouns: str
    is_bot: bool

    @property
    def label(self) -> str:
        return self.real_name or self.display_name or self.user_id


def _info_from_user(user: Dict[str, Any]) -> UserInfo:
    profile = user.get("profile") or {}
    uid = user.get("id") or ""
    if user.get("deleted"):
        return UserInfo(uid, "", "", "", "", bool(user.get("is_bot")))
    return UserInfo(
        user_id=uid,
        real_name=(user.get("real_name") or profile.get("real_name") or "").strip(),
        display_name=(profile.get("display_name") or "").strip(),
        title=(profile.get("title") or "").strip(),
        pronouns=(profile.get("pronouns") or "").strip(),
        is_bot=bool(user.get("is_bot")),
    )


class UserDirectory:
    def __init__(self, client, *, ttl_seconds: int = DEFAULT_TTL_SECONDS):
        self.client = client
        self.ttl = ttl_seconds

    def get(self, user_id: str) -> Optional[UserInfo]:
        if not user_id:
            return None
        hit = _PROFILES.get(user_id)
        if hit and hit[0] > time.time():
            return hit[1]
        try:
            user = (self.client.users_info(user=user_id) or {}).get("user") or {}
        except Exception as e:
            logger.warning("users.info failed for %s: %s", user_id, type(e).__name__)
            return None
        info = _info_from_user({"id": user_id, **user})
        _PROFILES[user_id] = (time.time() + self.ttl, info)
        return info

    def label(self, user_id: str) -> str:
        info = self.get(user_id)
        return info.label if info else user_id

    def _members(self) -> List[UserInfo]:
        if _MEMBERS["expires"] > time.time():
            return _MEMBERS["infos"]
        infos: List[UserInfo] = []
        cursor = None
        try:
            while True:
                resp = self.client.users_list(cursor=cursor, limit=200) or {}
                infos.extend(_info_from_user(m) for m in resp.get("members") or [])
                cursor = (resp.get("response_metadata") or {}).get("next_cursor")
                if not cursor:
                    break
        except Exception as e:
            logger.warning("users.list failed: %s", type(e).__name__)
            return infos
        _MEMBERS.update(expires=time.time() + self.ttl, infos=infos)
        for info in infos:
            _PROFILES[info.user_id] = (time.time() + self.ttl, info)
        return infos

    def find(self, name_or_id: str) -> Optional[str]:
        """A Slack user id for an id, <@id>, @name, real name or display name."""
        raw = (name_or_id or "").strip()
        m = _MENTION.fullmatch(raw)
        if m:
            return m.group(1)
        if _USER_ID.match(raw):
            return raw
        want = raw.lstrip("@").strip().lower()
        if not want:
            return None
        cached = [info for _, info in _PROFILES.values()]
        for pool in (cached, None):
            for info in pool if pool is not None else self._members():
                if want in (info.real_name.lower(), info.display_name.lower()) and info.user_id:
                    return info.user_id
        return None


def identity_line(info: Optional[UserInfo]) -> str:
    if info is None:
        return ""
    parts = [info.label]
    if info.display_name and info.display_name != info.label:
        parts[0] += f' (display name "{info.display_name}")'
    if info.title:
        parts.append(info.title)
    if info.pronouns:
        parts.append(info.pronouns)
    who = ", ".join(parts)
    line = f"You're talking with {who} — Slack id {info.user_id}. "
    if info.pronouns:
        return line + "Use their name naturally and sparingly and their stated pronouns."
    return line + "Use their name naturally and sparingly. Their pronouns aren't set — don't guess; use they/them."


def resolve_mentions(text: str, directory: UserDirectory, *, skip_ids: Iterable[str] = ()) -> str:
    skip = set(skip_ids)

    def name(m: re.Match) -> str:
        uid = m.group(1)
        if uid in skip:
            return m.group(0)
        return f"@{directory.label(uid)}"

    return _MENTION.sub(name, text or "")
