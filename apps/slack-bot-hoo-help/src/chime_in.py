"""
chime_in.py — should HooHelp reply to an unmentioned message in a thread?

One person + the bot: always (as before). Two or more people talking: only
when the bot is addressed by name, when the person it just answered replies,
or when a small fast model judges the message is aimed at the assistant or is
an unanswered library question a reply would clearly help. When unsure — or
if the check errors or times out — stay silent.
(@mentions never reach this: app_mention always answers.)
"""

from __future__ import annotations

import functools
import logging
import os
import re
from dataclasses import dataclass, field
from typing import Any, Callable, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

DEFAULT_CHIME_IN_MODEL_ID = "us.anthropic.claude-haiku-5-5"
TRANSCRIPT_MESSAGES = 6
JUDGE_TIMEOUT_SEC = 3

_ADDRESSED = re.compile(r"(?i)\b(hoo\s*help(er)?|hey\s+bot|bot\s*,)")

JUDGE_SYSTEM = """You decide whether a library assistant ("Hoo Helper") should reply in a Slack thread where several people are talking.

Answer YES only if the LAST message is directed at the assistant, or asks a question about UVA Library services or data (hours, rooms, catalog, gate counts, events, policies, buses) that nobody has answered yet and a reply would clearly help.
Answer NO if people are talking to each other, making small talk, thanking someone, or already handling the question. When unsure, answer NO.
Reply with exactly one word: YES or NO."""

Judge = Callable[[List[Tuple[str, str]], str, str], bool]


@dataclass
class Snapshot:
    """What the decision needs from the thread, minus the current message."""

    participants: set = field(default_factory=set)          # human Slack user ids
    transcript: List[Tuple[str, str]] = field(default_factory=list)  # (user id or "bot", text)
    last_from_bot: bool = False
    bot_answered: Optional[str] = None  # user id of the human message right before the bot's last reply


def _is_bot(m: Dict[str, Any], bot_user_id: Optional[str], bot_app_bot_id: Optional[str]) -> bool:
    return bool(
        (bot_user_id and m.get("user") == bot_user_id)
        or (bot_app_bot_id and m.get("bot_id") == bot_app_bot_id)
    )


def snapshot_from_messages(
    messages: List[Dict[str, Any]],
    *,
    bot_user_id: Optional[str],
    bot_app_bot_id: Optional[str] = None,
    current_ts: Optional[str] = None,
) -> Snapshot:
    """Messages oldest → newest (Slack's replies order)."""
    snap = Snapshot()
    prior = [m for m in messages if not (current_ts and m.get("ts") == current_ts)]
    last_human: Optional[str] = None
    for m in prior:
        if _is_bot(m, bot_user_id, bot_app_bot_id):
            snap.transcript.append(("bot", m.get("text") or ""))
            snap.bot_answered = last_human
            continue
        if m.get("bot_id") or m.get("bot_profile") or not m.get("user"):
            continue  # other bots / system noise
        snap.participants.add(m["user"])
        snap.transcript.append((m["user"], m.get("text") or ""))
        last_human = m["user"]
    if prior:
        snap.last_from_bot = _is_bot(prior[-1], bot_user_id, bot_app_bot_id)
    snap.transcript = snap.transcript[-TRANSCRIPT_MESSAGES:]
    return snap


def _labelled(transcript: List[Tuple[str, str]], sender: str) -> Tuple[List[Tuple[str, str]], str]:
    """Replace Slack ids with Person A/B/… (no ids or names go to the model)."""
    labels: Dict[str, str] = {}

    def label(uid: str) -> str:
        if uid == "bot":
            return "Hoo Helper"
        if uid not in labels:
            labels[uid] = f"Person {chr(ord('A') + len(labels))}"
        return labels[uid]

    out = [(label(uid), text) for uid, text in transcript]
    return out, label(sender)


@functools.lru_cache(maxsize=1)
def _bedrock_client():
    """One client per process (creating one per check is slow on a cold start)."""
    import boto3
    from botocore.config import Config

    return boto3.client(
        "bedrock-runtime",
        region_name=os.environ.get("AWS_REGION", "us-east-1"),
        config=Config(read_timeout=JUDGE_TIMEOUT_SEC, connect_timeout=2, retries={"max_attempts": 1}),
    )


def haiku_judge(transcript: List[Tuple[str, str]], sender: str, text: str) -> bool:
    client = _bedrock_client()
    convo = "\n".join(f"{speaker}: {line}" for speaker, line in transcript)
    prompt = f"Thread so far:\n{convo}\n\nLAST message — {sender}: {text}\n\nShould Hoo Helper reply?"
    resp = client.converse(
        modelId=os.environ.get("CHIME_IN_MODEL_ID", DEFAULT_CHIME_IN_MODEL_ID),
        system=[{"text": JUDGE_SYSTEM}],
        messages=[{"role": "user", "content": [{"text": prompt}]}],
        # Haiku 5.5: sampling params are rejected, and thinking (on by default)
        # would spend the token budget before the one-word answer.
        inferenceConfig={"maxTokens": 256},
        additionalModelRequestFields={"thinking": {"type": "disabled"}, "output_config": {"effort": "low"}},
    )
    blocks = resp.get("output", {}).get("message", {}).get("content", []) or []
    answer = " ".join(b.get("text", "") for b in blocks if isinstance(b, dict)).strip().upper()
    return answer.startswith("YES")


def should_reply(text: str, sender: str, snap: Snapshot, *, judge: Judge = haiku_judge) -> Tuple[bool, str]:
    humans = set(snap.participants) | ({sender} if sender else set())
    if len(humans) <= 1:
        return True, "one-on-one"
    if _ADDRESSED.search(text or ""):
        return True, "addressed by name"
    if snap.last_from_bot and snap.bot_answered and snap.bot_answered == sender:
        return True, "reply to bot"
    transcript, who = _labelled(snap.transcript, sender)
    try:
        return (True, "judge: yes") if judge(transcript, who, text) else (False, "judge: no")
    except Exception as e:
        logger.warning("Chime-in judge failed (%s); staying silent", e)
        return False, f"judge error: {type(e).__name__}"
