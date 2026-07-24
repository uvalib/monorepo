"""
slack_format.py — Format HooHelp replies for Slack.

Strategy:
1. Strip model chain-of-thought tags (cheap, deterministic).
2. Ask Bedrock to rewrite the answer as clean Slack mrkdwn (handles hours,
   catalog, images, occupancy without fragile regex classifiers).
3. Optionally attach Block Kit image blocks when public IIIF URLs are present.
4. Fall back to light local cleanup if the formatter call fails.
"""

from __future__ import annotations

import json
import logging
import os
import re
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# CoT stripping
# ---------------------------------------------------------------------------

_THINKING_PATTERNS = [
    re.compile(r"<thinking\b[^>]*>(.*?)</thinking\s*>", re.IGNORECASE | re.DOTALL),
    re.compile(r"<think\b[^>]*>(.*?)</think\s*>", re.IGNORECASE | re.DOTALL),
    re.compile(r"<reasoning\b[^>]*>(.*?)</reasoning\s*>", re.IGNORECASE | re.DOTALL),
    re.compile(r"<reflection\b[^>]*>(.*?)</reflection\s*>", re.IGNORECASE | re.DOTALL),
]
_ORPHAN_OPEN = re.compile(
    r"<(thinking|think|reasoning|reflection)\b[^>]*>.*$",
    re.IGNORECASE | re.DOTALL,
)

_IIIF_RE = re.compile(
    r"https?://iiif\.lib\.virginia\.edu/iiif/[^\s|>\]\)]+",
    re.IGNORECASE,
)
_MD_LINK = re.compile(r"\[([^\]]+)\]\((https?://[^)]+)\)")
_BARE_URL = re.compile(r"(?<![<\w\"'])(https?://[^\s|>]+)")

SLACK_FORMAT_SYSTEM = """You are a Slack message formatter for HooHelp (UVA Library assistant).

Rewrite the assistant's draft answer into a single Slack message using Slack mrkdwn ONLY.

Slack mrkdwn rules (strict):
- Bold: *like this*  (single asterisks — NEVER **double**)
- Italic: _like this_
- Inline code: `like this` (use for call numbers)
- Links MUST be: <https://example.com|label>  — never bare URLs when a label helps
- Bullets: put • at the start of its own line; never multiple • on one line
- Blank line between sections
- No HTML/XML, no <thinking> tags, no markdown tables, no headings with #

Content rules by answer type:

1) Library HOURS / schedules
   - Keep a short intro + simple bullet list of days and times from the draft
   - Keep the exact calendar dates from the draft (do not change July 25 into July 13, etc.)
   - If the draft says Closed, keep Closed; if it gives only an open time, do not invent a close time
   - Example shape (values must come from the draft):
     Fine Arts Library hours for this weekend (July 25–26, 2026):
     • *Saturday, July 25* — Closed
     • *Sunday, July 26* — Closed
   - Do NOT invent catalog cards, call numbers, "Available copies", authors, or Virgo links

2) BOOK / catalog / checkout answers
   - One line per copy when possible:
     • *Title* by Author — Location — `CALL NUMBER` — <virgo-url|Virgo>
   - Group under short labels if useful (*On shelf*, *Online*, *Request*)
   - At most ~5 print copies and ~2 online options
   - Only include facts present in the draft

3) IMAGE / photo answers
   - Prefer images that match the user's subject
   - For each image (max 4):
     • *Title*
     • Image URL: https://iiif.lib.virginia.edu/...
     • Virgo: <https://search.lib.virginia.edu/...|View in Virgo>
     • Collection if known
   - Keep the full https://iiif.lib.virginia.edu/... Image URL line so Slack can display the picture
   - Do NOT invent uva_library item IDs like u1234567

4) Occupancy / other
   - Clear plain prose + simple bullets; no catalog card structure

General:
- FAITHFULNESS IS CRITICAL: only restate facts present in the draft
- Do NOT invent or complete missing data (no guessed closing times, call numbers, links, titles, or images)
- If the draft says only "1:00 PM" with no end time, keep it as "1:00 PM" — do not add "– 5:00 PM"
- Be concise and readable on mobile Slack
- Output ONLY the final Slack message text (no preamble like "Here is the formatted version")
"""


def extract_thinking(text: str) -> Tuple[str, str]:
    if not text:
        return "", ""
    thinking_parts: List[str] = []
    clean = text
    for pattern in _THINKING_PATTERNS:
        for match in pattern.finditer(clean):
            snippet = match.group(1).strip()
            if snippet:
                thinking_parts.append(snippet)
        clean = pattern.sub("", clean)
    clean = _ORPHAN_OPEN.sub("", clean)
    clean = re.sub(r"\n{3,}", "\n\n", clean).strip()
    return "\n\n".join(thinking_parts).strip(), clean


def _local_markdown_cleanup(text: str) -> str:
    """Minimal non-LLM cleanup used as fallback."""
    if not text:
        return text
    for ch in ("\u00a0", "\u202f", "\u2007", "\u2009", "\u200a"):
        text = text.replace(ch, " ")
    text = _MD_LINK.sub(r"<\2|\1>", text)
    text = re.sub(r"\*\*(.+?)\*\*", r"*\1*", text)
    text = re.sub(r"__(.+?)__", r"*\1*", text)
    text = re.sub(r"^#{1,6}\s+(.+)$", r"*\1*", text, flags=re.MULTILINE)
    text = re.sub(r"[ \t]+•[ \t]+", "\n• ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _bedrock_format_for_slack(
    answer: str,
    *,
    bedrock_client: Any,
    model_id: str,
) -> str:
    """Ask Bedrock to rewrite the answer as Slack mrkdwn."""
    # Keep prompt size bounded
    draft = answer.strip()
    if len(draft) > 12000:
        draft = draft[:12000].rstrip() + "\n…"

    resp = bedrock_client.converse(
        modelId=model_id,
        system=[{"text": SLACK_FORMAT_SYSTEM}],
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "text": (
                            "Reformat this HooHelp draft for Slack. "
                            "Output only the Slack message.\n\n"
                            f"--- DRAFT START ---\n{draft}\n--- DRAFT END ---"
                        )
                    }
                ],
            }
        ],
        inferenceConfig={
            "temperature": 0.0,
            "maxTokens": 1800,
        },
    )
    parts = []
    for block in resp.get("output", {}).get("message", {}).get("content", []):
        if "text" in block:
            parts.append(block["text"])
    out = "\n".join(parts).strip()
    # Guard against model wrapping in fences
    if out.startswith("```"):
        out = re.sub(r"^```(?:\w+)?\n?", "", out)
        out = re.sub(r"\n?```$", "", out).strip()
    return out


def _extract_image_entries(text: str) -> List[Dict[str, str]]:
    """
    Pull IIIF image URLs (and nearby titles) for Block Kit image blocks.
    Light post-pass only — formatting is owned by the LLM.
    """
    if not text or "iiif.lib.virginia.edu" not in text.lower():
        return []

    entries: List[Dict[str, str]] = []
    lines = text.splitlines()
    pending_title = ""

    for i, line in enumerate(lines):
        # Title candidates: bullets or *Title*
        t = line.strip()
        m_title = re.match(r"^[•\-\*]\s+\*?([^*\n]{3,120}?)\*?\s*$", t)
        if m_title and "http" not in m_title.group(1).lower():
            cand = m_title.group(1).strip()
            if not re.match(r"^(image url|virgo|collection|repository)\b", cand, re.I):
                pending_title = cand

        m_bold = re.match(r"^\*([^*\n]{3,120})\*\s*$", t)
        if m_bold and "http" not in m_bold.group(1).lower():
            pending_title = m_bold.group(1).strip()

        for url in _IIIF_RE.findall(line):
            url = url.rstrip(".,);>")
            title = pending_title
            # Look a few lines up if needed
            if not title:
                for prev in reversed(lines[max(0, i - 4) : i]):
                    p = re.sub(r"^[•\-\*\s]+", "", prev).strip().strip("*")
                    if p and "http" not in p.lower() and len(p) < 120:
                        if not re.match(
                            r"^(image url|virgo|collection|repository)\b", p, re.I
                        ):
                            title = p
                            break
            entries.append({"title": title or "Library image", "image_url": url})
            pending_title = ""

    # Dedupe by URL, cap
    seen = set()
    unique: List[Dict[str, str]] = []
    for e in entries:
        if e["image_url"] not in seen:
            seen.add(e["image_url"])
            unique.append(e)
    return unique[:4]


def _chunk_mrkdwn(text: str, max_len: int = 2900) -> List[str]:
    if len(text) <= max_len:
        return [text]
    chunks: List[str] = []
    parts = re.split(r"\n\n+", text)
    buf = ""
    for part in parts:
        candidate = f"{buf}\n\n{part}".strip() if buf else part
        if len(candidate) <= max_len:
            buf = candidate
        else:
            if buf:
                chunks.append(buf)
            while len(part) > max_len:
                chunks.append(part[:max_len])
                part = part[max_len:]
            buf = part
    if buf:
        chunks.append(buf)
    return chunks or [text[:max_len]]


def _build_blocks(mrkdwn: str, images: List[Dict[str, str]]) -> List[Dict[str, Any]]:
    blocks: List[Dict[str, Any]] = []
    for chunk in _chunk_mrkdwn(mrkdwn):
        blocks.append(
            {"type": "section", "text": {"type": "mrkdwn", "text": chunk[:3000]}}
        )

    if images:
        blocks.append({"type": "divider"})
        for idx, img in enumerate(images):
            title = img.get("title") or "Library image"
            url = img.get("image_url") or ""
            if not url.startswith("http"):
                continue
            blocks.append(
                {
                    "type": "image",
                    "image_url": url[:3000],
                    "alt_text": title[:2000],
                    "title": {"type": "plain_text", "text": title[:2000], "emoji": True},
                }
            )
            if idx < len(images) - 1:
                blocks.append({"type": "divider"})

    return blocks[:50]


def format_for_slack(
    raw: str,
    *,
    show_reasoning: Optional[bool] = None,
    bedrock_client: Any = None,
    model_id: Optional[str] = None,
    use_llm: Optional[bool] = None,
) -> Tuple[str, List[Dict[str, Any]]]:
    """
    Prepare a model reply for Slack.

    Returns (fallback_text, blocks).
    """
    if show_reasoning is None:
        show_reasoning = os.environ.get("SHOW_MODEL_REASONING", "").lower() in (
            "1",
            "true",
            "yes",
            "on",
        )
    if use_llm is None:
        use_llm = os.environ.get("SLACK_LLM_FORMAT", "true").lower() in (
            "1",
            "true",
            "yes",
            "on",
        )

    thinking, answer = extract_thinking(raw or "")
    if not answer and thinking:
        answer = (
            "_I worked through this, but didn't produce a final answer. Please try again._"
        )
    if not answer:
        answer = "Sorry, I didn't get a usable answer back. Please try again."

    formatted = ""
    if use_llm:
        try:
            import boto3

            client = bedrock_client or boto3.client(
                "bedrock-runtime",
                region_name=os.environ.get("AWS_REGION", "us-east-1"),
            )
            mid = model_id or os.environ.get("BEDROCK_MODEL_ID", "us.amazon.nova-pro-v1:0")
            # Prefer a fast cheap model for formatting if configured
            format_model = os.environ.get("SLACK_FORMAT_MODEL_ID") or mid
            formatted = _bedrock_format_for_slack(
                answer, bedrock_client=client, model_id=format_model
            )
            if not formatted or len(formatted) < 3:
                raise RuntimeError("empty formatter output")
            logger.info(
                "LLM Slack format ok (%s → %s chars, model=%s)",
                len(answer),
                len(formatted),
                format_model,
            )
        except Exception as e:
            logger.warning("LLM Slack format failed, using local cleanup: %s", e)
            formatted = ""

    if not formatted:
        formatted = _local_markdown_cleanup(answer)

    # Light second cleanup (never reintroduce catalog classifiers)
    formatted = _local_markdown_cleanup(formatted)

    images = _extract_image_entries(formatted)
    blocks = _build_blocks(formatted, images)
    fallback = formatted[:500]

    if show_reasoning and thinking:
        reason = thinking.strip()
        if len(reason) > 1800:
            reason = reason[:1800].rstrip() + "…"
        blocks.append({"type": "divider"})
        blocks.append(
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": f":brain: *Reasoning*\n{_local_markdown_cleanup(reason)[:1900]}",
                    }
                ],
            }
        )

    return fallback, blocks[:50]
