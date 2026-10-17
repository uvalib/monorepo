"""Check functions shared by the offline and live eval tiers.

Every check returns a list of failure reasons; an empty list means it passed.
They inspect what Slack would actually show: the posted blocks plus the
fallback text.
"""

from __future__ import annotations

import re
from typing import Any

ALLOWED_BLOCK_TYPES = frozenset({
    "header", "section", "divider", "context", "image", "table",
    "actions", "card", "carousel", "data_visualization",
})
MAX_BLOCKS = 50
MAX_TABLES = 1
MAX_SECTION_CHARS = 3000

# Formatting markers: checked in visible blocks only (the fallback is Slack's
# notification copy and intentionally keeps the agent's markdown table).
FORBIDDEN_IN_BLOCKS: tuple[str, ...] = (
    "**",
    "| :---",
    "|---",
    "<thinking",
)
# Leaks and tool errors: checked in blocks and fallback text.
FORBIDDEN: tuple[str, ...] = (
    "Media Outlets Policy",
    "non-infringing information",
    "Generate a polite, respectful",
    "Unknown tool",
    "Tool Error:",
)

_STOP = frozenset({
    "about", "after", "their", "there", "these", "those", "which", "would",
    "could", "should", "while", "where", "other", "please", "information",
})
_THINKING = re.compile(r"(?is)<thinking>.*?</thinking>")
_WORD = re.compile(r"[a-z][a-z0-9'-]{4,}")


def _text_of(obj: Any) -> str:
    """Text from a Slack text object or a plain string."""
    if isinstance(obj, str):
        return obj
    if isinstance(obj, dict):
        return str(obj.get("text") or "")
    return ""


def visible_text(blocks: list[dict]) -> str:
    """Everything a person can read in the blocks, one chunk per line."""
    parts: list[str] = []

    def add_block(b: dict) -> None:
        btype = b.get("type")
        if btype in ("section", "header"):
            parts.append(_text_of(b.get("text")))
            parts.extend(_text_of(f) for f in b.get("fields") or [])
        elif btype == "context":
            parts.extend(_text_of(e) for e in b.get("elements") or [])
        elif btype == "table":
            for row in b.get("rows") or []:
                parts.append(" | ".join(_text_of(c) for c in row))
        elif btype == "card":
            parts.extend(_text_of(b.get(k)) for k in ("title", "subtitle", "body"))
        elif btype == "carousel":
            for el in b.get("elements") or []:
                add_block({**el, "type": "card"})
        elif btype == "image":
            parts.append(str(b.get("alt_text") or ""))
            parts.append(_text_of(b.get("title")))

    for b in blocks or []:
        if isinstance(b, dict):
            add_block(b)
    return "\n".join(p for p in parts if p)


def normalize(text: str) -> str:
    """Drop mrkdwn emphasis markers, collapse whitespace, lowercase."""
    return " ".join(re.sub(r"[*_`]", "", text or "").split()).lower()


def universal(fallback_text: str, blocks: list[dict]) -> list[str]:
    reasons: list[str] = []
    blocks = blocks or []
    if len(blocks) > MAX_BLOCKS:
        reasons.append(f"{len(blocks)} blocks (max {MAX_BLOCKS})")
    tables = sum(1 for b in blocks if b.get("type") == "table")
    if tables > MAX_TABLES:
        reasons.append(f"{tables} table blocks (max {MAX_TABLES})")
    for b in blocks:
        btype = b.get("type")
        if btype not in ALLOWED_BLOCK_TYPES:
            reasons.append(f"disallowed block type: {btype}")
        if btype == "section":
            n = len(_text_of(b.get("text")))
            if n > MAX_SECTION_CHARS:
                reasons.append(f"section text {n} chars (max {MAX_SECTION_CHARS})")
    in_blocks = visible_text(blocks).lower()
    shown = f"{fallback_text or ''}\n{in_blocks}".lower()
    for bad in FORBIDDEN_IN_BLOCKS:
        if bad.lower() in in_blocks:
            reasons.append(f"forbidden text: {bad!r}")
    for bad in FORBIDDEN:
        if bad.lower() in shown:
            reasons.append(f"forbidden text: {bad!r}")
    return reasons


def _distinctive_words(text: str) -> set[str]:
    clean = _THINKING.sub("", text or "").lower()
    return {w for w in _WORD.findall(clean) if w not in _STOP}


def not_collapsed(answer: str, blocks: list[dict], min_ratio: float = 0.6) -> list[str]:
    """Answer words must survive into the visible blocks (the fallback text always
    holds the whole answer, so it can't count as visible)."""
    words = _distinctive_words(answer)
    if not words:
        return []
    shown = visible_text(blocks).lower()
    kept = sum(1 for w in words if w in shown)
    ratio = kept / len(words)
    if ratio < min_ratio:
        return [f"collapsed: {kept}/{len(words)} answer words visible ({ratio:.2f} < {min_ratio:.2f})"]
    return []


def structure_kept(answer: str, blocks: list[dict], min_lines: int = 4, min_ratio: float = 0.5) -> list[str]:
    """A multi-line answer must still be multi-line in the posted sections
    (catches answers collapsed onto one line, which word checks can't see)."""
    lines = [l for l in _THINKING.sub("", answer or "").splitlines()
             if l.strip() and not l.strip().startswith("|")]
    if len(lines) < min_lines:
        return []
    shown = sum(
        len([l for l in _text_of(b.get("text")).splitlines() if l.strip()])
        for b in blocks or [] if b.get("type") == "section"
    )
    if shown < min_ratio * len(lines):
        return [f"structure lost: {shown} visible lines for a {len(lines)}-line answer"]
    return []


def blocks_present(blocks: list[dict], required: list[str]) -> list[str]:
    types = {b.get("type") for b in blocks or []}
    return [f"missing block type: {t}" for t in required or [] if t not in types]


def phrases_all(text: str, phrases: list[str]) -> list[str]:
    hay = normalize(text)
    return [f"missing phrase: {p!r}" for p in phrases or [] if normalize(p) not in hay]


def phrases_any(text: str, phrases: list[str]) -> list[str]:
    if not phrases:
        return []
    hay = normalize(text)
    if any(normalize(p) in hay for p in phrases):
        return []
    return [f"none of phrases present: {list(phrases)!r}"]


def forbid(text: str, phrases: list[str]) -> list[str]:
    hay = normalize(text)
    return [f"forbidden phrase present: {p!r}" for p in phrases or [] if normalize(p) in hay]


def tools_any(called: list[str], wanted: list[str]) -> list[str]:
    if not wanted:
        return []
    leaves = {c.split("___")[-1] for c in called or []}
    if leaves & set(wanted):
        return []
    return [f"none of tools called: {list(wanted)!r} (called: {sorted(leaves)!r})"]
