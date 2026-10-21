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
FAILED_LOOKUP_TTL_SECONDS = 60  # don't hammer users.info for one user while Slack is unhappy

# Shared by all UserDirectory instances so a warm Lambda container reuses lookups.
_PROFILES: Dict[str, Tuple[float, "UserInfo"]] = {}
_FAILED: Dict[str, float] = {}
# Emails are kept apart from UserInfo so they can never reach identity_line or the
# prompt; only account matching (Jira "me") reads them.
_EMAILS: Dict[str, str] = {}
_MEMBERS: Dict[str, Any] = {"expires": 0.0, "infos": []}

_MENTION = re.compile(r"<@([UW][A-Z0-9]+)(?:\|[^>]*)?>")
_USER_ID = re.compile(r"^[UW][A-Z0-9]*[0-9][A-Z0-9]*$")  # needs a digit, so "UVA" stays a name


def _reset_cache() -> None:
    """Tests only."""
    _PROFILES.clear()
    _FAILED.clear()
    _EMAILS.clear()
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
    # Deactivated users keep their names: their old messages still need an author.
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
        if _FAILED.get(user_id, 0) > time.time():
            return None
        try:
            user = (self.client.users_info(user=user_id) or {}).get("user") or {}
        except Exception as e:
            logger.warning("users.info failed for %s: %s", user_id, type(e).__name__)
            _FAILED[user_id] = time.time() + FAILED_LOOKUP_TTL_SECONDS
            return None
        info = _info_from_user({"id": user_id, **user})
        email = ((user.get("profile") or {}).get("email") or "").strip()
        if email:
            _EMAILS[user_id] = email
        _PROFILES[user_id] = (time.time() + self.ttl, info)
        return info

    def email(self, user_id: str) -> str:
        """Slack profile email, for matching accounts only — never put it in the prompt."""
        if user_id not in _EMAILS:
            self.get(user_id)
        return _EMAILS.get(user_id, "")

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

    def candidates(self, name: str) -> List[UserInfo]:
        """People matching a name: exact real/display name first, else a first-name match."""
        want = (name or "").strip().lstrip("@").strip().lower()
        if not want:
            return []

        def matches(pool: List[UserInfo]) -> List[UserInfo]:
            exact = [i for i in pool if want in (i.real_name.lower(), i.display_name.lower())]
            if exact:
                return exact
            return [i for i in pool if i.real_name and i.real_name.lower().split()[0] == want]

        cached = [info for _, info in _PROFILES.values() if info.user_id]
        found = matches(cached)
        if len(found) != 1:  # the cache may be partial; ask the full member list
            found = matches([i for i in self._members() if i.user_id]) or found
        unique = {i.user_id: i for i in found}
        return sorted(unique.values(), key=lambda i: i.label)

    def find(self, name_or_id: str) -> Optional[str]:
        """A Slack user id for an id, <@id>, or a name that matches exactly one person."""
        raw = (name_or_id or "").strip()
        m = _MENTION.fullmatch(raw)
        if m:
            return m.group(1)
        if _USER_ID.match(raw):
            return raw
        found = self.candidates(raw)
        return found[0].user_id if len(found) == 1 else None


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
    # No Slack id: the guardrail's PII filter reads ids like U90MC9HQV as passwords,
    # and the model never needs one ("me" is resolved in code).
    line = f"You're talking with {who}. "
    if info.pronouns:
        line += "Use their name naturally and sparingly and their stated pronouns."
    else:
        line += "Use their name naturally and sparingly. Their pronouns aren't set — don't guess; use they/them."
    # "whoami?" reads like "who are you?" to the model unless told otherwise.
    return line + (' If they ask "whoami", "who am I" or what you know about them, that\'s about them, '
                   "not about you: answer from this line.")


def resolve_mentions(text: str, directory: UserDirectory, *, skip_ids: Iterable[str] = ()) -> str:
    skip = set(skip_ids)

    def name(m: re.Match) -> str:
        uid = m.group(1)
        if uid in skip:
            return m.group(0)
        return f"@{directory.label(uid)}"

    return _MENTION.sub(name, text or "")
