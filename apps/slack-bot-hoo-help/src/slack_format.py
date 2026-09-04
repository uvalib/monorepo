"""
slack_format.py — Format HooHelp replies for Slack.

Strategy:
1. Strip model chain-of-thought tags (cheap, deterministic).
2. Ask Bedrock to rewrite the answer as Slack Block Kit JSON (text + blocks).
   Invalid / non-JSON output falls back to mrkdwn in section blocks.
3. Attach deterministic tables/charts from hours and occupancy tool output,
   and image blocks when public IIIF URLs are present.
4. Fall back to light local cleanup if the formatter call fails.
"""

from __future__ import annotations

import json
import logging
import os
import re
from typing import Any, Dict, Iterable, List, Optional, Tuple

from slack_blocks import (
    MAX_BLOCKS,
    blocks_from_tool_steps,
    fmt_num,
    tool_fallback_text,
)

from bedrock_params import (
    DEFAULT_AGENT_MODEL_ID,
    DEFAULT_FORMAT_MODEL_ID,
    uses_bedrock_mantle,
)

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

FORMATTER_TOOL_NAME = "emit_slack_message"

# Gemma's constrained decoder rejects JSON Schema oneOf. Keep a single type per
# field; sanitizers already coerce strings into Slack text objects.
_BUTTON_SCHEMA: Dict[str, Any] = {
    "type": "object",
    "properties": {
        "type": {"type": "string", "enum": ["button"]},
        "text": {"type": "string"},
        "url": {"type": "string", "description": "https URL copied from the draft"},
        "style": {"type": "string", "enum": ["primary", "danger"]},
    },
    "required": ["text", "url"],
}

_IMAGE_SCHEMA: Dict[str, Any] = {
    "type": "object",
    "properties": {
        "type": {"type": "string", "enum": ["image"]},
        "image_url": {"type": "string"},
        "alt_text": {"type": "string"},
        "title": {"type": "string"},
    },
}

# Allowlist Block Kit template the formatter tool must fill.
SLACK_BLOCK_KIT_SCHEMA: Dict[str, Any] = {
    "type": "object",
    "additionalProperties": False,
    "required": ["text", "blocks"],
    "properties": {
        "text": {
            "type": "string",
            "description": "Slack mrkdwn fallback for notifications and a11y",
        },
        "blocks": {
            "type": "array",
            "maxItems": 20,
            "description": "Slack Block Kit blocks from the allowlist only",
            "items": {
                "type": "object",
                "required": ["type"],
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "header",
                            "section",
                            "divider",
                            "context",
                            "image",
                            "table",
                            "actions",
                            "card",
                            "carousel",
                        ],
                    },
                    "text": {"type": "string"},
                    "fields": {"type": "array", "items": {"type": "string"}},
                    "accessory": {
                        "type": "object",
                        "properties": {
                            "type": {"type": "string", "enum": ["button", "image"]},
                            "text": {"type": "string"},
                            "url": {"type": "string"},
                            "image_url": {"type": "string"},
                            "alt_text": {"type": "string"},
                            "style": {"type": "string", "enum": ["primary", "danger"]},
                        },
                    },
                    "elements": {"type": "array", "items": {"type": "object"}},
                    "rows": {
                        "type": "array",
                        "items": {
                            "type": "array",
                            "items": {"type": "string"},
                        },
                    },
                    "title": {"type": "string"},
                    "subtitle": {"type": "string"},
                    "body": {"type": "string"},
                    "subtext": {"type": "string"},
                    "hero_image": _IMAGE_SCHEMA,
                    "icon": _IMAGE_SCHEMA,
                    "actions": {"type": "array", "items": _BUTTON_SCHEMA},
                    "cards": {"type": "array", "items": {"type": "object"}},
                    "image_url": {"type": "string"},
                    "alt_text": {"type": "string"},
                    "level": {"type": "integer", "minimum": 1, "maximum": 4},
                },
            },
        },
    },
}

FORMATTER_TOOLS: List[Dict[str, Any]] = [
    {
        "type": "function",
        "function": {
            "name": FORMATTER_TOOL_NAME,
            "description": (
                "Emit the Slack Block Kit message. Always call this tool with the "
                "formatted payload. Do not reply with free-form text."
            ),
            "parameters": SLACK_BLOCK_KIT_SCHEMA,
        },
    }
]

FORMATTER_TOOL_CHOICE: Dict[str, Any] = {
    "type": "function",
    "function": {"name": FORMATTER_TOOL_NAME},
}

SLACK_FORMAT_SYSTEM = """You are a Slack Block Kit formatter for HooHelp (UVA Library assistant).

Rewrite the assistant's draft into a Slack message. Prefer native Block Kit layout
over a wall of bullets. Downstream code will VALIDATE your blocks and drop anything
invalid, then APPEND hours tables and occupancy charts from live tool data.

You MUST call the emit_slack_message tool with:
{
  "text": "plain Slack mrkdwn fallback for notifications",
  "blocks": [ /* Block Kit blocks */ ]
}
Do not reply with free-form text, markdown fences, or a JSON blob in the message body.
If the draft is a greeting or capability list, keep it as a short header + section.
Do NOT add library hours, a "Main Library" location, or any schedule that is not
in the draft. Never invent hours.

Allowed block types (only these): header, section, divider, context, image, table,
actions, card, carousel.

Mrkdwn inside section/context/card (strict):
- Bold: *like this*  (single asterisks — NEVER **double**)
- Italic: _like this_
- Inline code: `like this` (use for call numbers)
- Links: <https://example.com|label>
- No HTML/XML, no <thinking> tags, no markdown | tables | in section text

Block patterns to use:
- header: short title (plain text, ≤150 chars)
- section: body text, and/or fields (2-column facts: *Label*\\nvalue). Optional accessory:
  a link button {type:button, text:"Virgo", url:"https://..."} or an image
- table: rows as arrays of strings; first row is the header. Use for catalog copies,
  events, rooms, equipment — NOT for library hours or occupancy (code adds those)
- actions: link buttons only {type:button, text:"Open in Virgo", url:"https://..."}.
  Never invent action_id. Max 5 buttons. https URLs from the draft only
- image: {type:image, image_url:"https://iiif.lib.virginia.edu/...", alt_text:"Title"}
- context: small source / caveat line
- card / carousel: image results (hero_image + title + body + Virgo button). Max 4 cards
- divider: between groups

Do NOT emit: data_visualization, input, rich_text, file, video, alert.
Do NOT invent chart numbers. Occupancy charts are added in code.

Content rules by answer type:

1) Library HOURS / schedules
   - Code will attach a Date/Day/Hours table. Do NOT emit that table or list every day.
   - blocks: one header + one short section (who, date range, open vs closed).
   - Keep exact calendar dates and official names from the draft.
   - If the draft says Closed, keep Closed; do not invent a close time.
   - Never invent catalog cards or Virgo links on an hours answer.

2) BOOK / catalog / checkout
   - header with the work title; group with headers like "On shelf", "Online", "Request"
   - One section or table row per copy (max ~5 print, ~2 online): location, `CALL NUMBER`, status
   - Link button "Virgo" when the draft has a search.lib.virginia.edu URL
   - Only facts present in the draft

3) IMAGE / photo
   - Keep the draft's Image URLs (including top-ranked hits whose titles omit the query words)
   - Up to 4 cards or image blocks: title, iiif.lib.virginia.edu URL, Virgo button, collection
   - Do NOT invent catalog IDs like u1234567
   - Do NOT drop images because the title lacks the subject word

4) Occupancy / foot traffic
   - Code fully owns this layout (KPIs, chart, doorway table). Do NOT paste the
     tool report. Do NOT emit Coverage summary, Average hourly, doorway lists,
     or any table/chart. Output a one-sentence takeaway in "text" and empty blocks [].

5) Contacts / events / rooms / equipment / directions
   - Contacts: section fields (Phone, Email, Address) + website button
   - Events / rooms / gear: table or short sections + LibCal/event URL button
   - Directions: numbered section text + Maps/PDF link buttons; caveats in context

General:
- FAITHFULNESS IS CRITICAL: only restate facts present in the draft
- Do NOT invent or complete missing data (hours, call numbers, links, titles, names, images)
- Do NOT expand acronyms unless the draft already expands them
- If the draft says only "1:00 PM" with no end time, keep it as "1:00 PM"
- Be concise on mobile. At most ~20 blocks.
- Always call emit_slack_message. Never invent block types outside the allowlist.
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


# ---------------------------------------------------------------------------
# LLM Block Kit JSON → validated blocks
# ---------------------------------------------------------------------------

def _plain_text(text: Any, *, limit: int = 150) -> Optional[Dict[str, Any]]:
    s = str(text or "").strip()
    if not s:
        return None
    return {"type": "plain_text", "text": s[:limit], "emoji": True}


def _mrkdwn_text(text: Any, *, limit: int = 3000) -> Optional[Dict[str, Any]]:
    s = str(text or "").strip()
    if not s:
        return None
    s = _local_markdown_cleanup(s)
    if not s:
        return None
    return {"type": "mrkdwn", "text": s[:limit]}


def _coerce_text_obj(
    obj: Any, *, plain: bool = False, limit: int = 3000
) -> Optional[Dict[str, Any]]:
    if obj is None:
        return None
    if isinstance(obj, str):
        return _plain_text(obj, limit=limit) if plain else _mrkdwn_text(obj, limit=limit)
    if isinstance(obj, dict):
        raw = obj.get("text")
        if raw is None:
            return None
        want_plain = plain or obj.get("type") == "plain_text"
        return (
            _plain_text(raw, limit=limit)
            if want_plain
            else _mrkdwn_text(raw, limit=limit)
        )
    return None


def _https_url(value: Any) -> Optional[str]:
    url = str(value or "").strip()
    if url.startswith("http://"):
        url = "https://" + url[len("http://") :]
    if not url.startswith("https://"):
        return None
    if "..." in url or url.endswith("/"):
        return None
    return url[:3000]


def _sanitize_button(el: Any) -> Optional[Dict[str, Any]]:
    if not isinstance(el, dict):
        return None
    if el.get("type") not in (None, "button"):
        return None
    url = _https_url(el.get("url"))
    if not url:
        return None
    label = el.get("text") or el.get("label") or "Open"
    text_obj = _coerce_text_obj(label, plain=True, limit=75)
    if not text_obj:
        return None
    btn: Dict[str, Any] = {"type": "button", "text": text_obj, "url": url}
    if el.get("style") in ("primary", "danger"):
        btn["style"] = el["style"]
    return btn


def _sanitize_image_el(el: Any) -> Optional[Dict[str, Any]]:
    if isinstance(el, str):
        url = _https_url(el)
        if not url:
            return None
        return {"type": "image", "image_url": url, "alt_text": "Library image"}
    if not isinstance(el, dict):
        return None
    url = _https_url(el.get("image_url") or el.get("url"))
    if not url:
        return None
    alt = str(el.get("alt_text") or el.get("title") or "Library image")[:2000]
    out: Dict[str, Any] = {"type": "image", "image_url": url, "alt_text": alt or "Library image"}
    title = el.get("title")
    if isinstance(title, str) and title.strip():
        out["title"] = _plain_text(title, limit=2000)
    elif isinstance(title, dict) and title.get("text"):
        out["title"] = _plain_text(title.get("text"), limit=2000)
    return out


def _sanitize_header(block: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    text = _coerce_text_obj(
        block.get("text") or block.get("title"), plain=True, limit=150
    )
    if not text:
        return None
    out: Dict[str, Any] = {"type": "header", "text": text}
    level = block.get("level")
    if isinstance(level, int) and 1 <= level <= 4:
        out["level"] = level
    return out


def _sanitize_section(block: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    out: Dict[str, Any] = {"type": "section"}
    text = _coerce_text_obj(block.get("text"), plain=False, limit=3000)
    if text:
        out["text"] = text
    fields_in = block.get("fields") or []
    fields: List[Dict[str, Any]] = []
    if isinstance(fields_in, list):
        for f in fields_in[:10]:
            if isinstance(f, dict) and ("label" in f or "value" in f) and "text" not in f:
                label = str(f.get("label") or "").strip()
                value = str(f.get("value") or "").strip()
                blob = f"*{label}*\n{value}" if label else value
                coerced = _mrkdwn_text(blob, limit=2000)
            else:
                coerced = _coerce_text_obj(f, plain=False, limit=2000)
            if coerced:
                fields.append(coerced)
    if fields:
        out["fields"] = fields
    accessory = block.get("accessory")
    if isinstance(accessory, dict):
        if accessory.get("type") == "image" or accessory.get("image_url"):
            img = _sanitize_image_el(accessory)
            if img:
                img.pop("title", None)
                out["accessory"] = img
        else:
            btn = _sanitize_button(accessory)
            if btn:
                out["accessory"] = btn
    if "text" not in out and "fields" not in out:
        return None
    return out


def _sanitize_context(block: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    elements: List[Dict[str, Any]] = []
    raw = block.get("elements")
    if isinstance(raw, list):
        for el in raw[:10]:
            if isinstance(el, dict) and (
                el.get("type") == "image" or el.get("image_url")
            ):
                img = _sanitize_image_el(el)
                if img:
                    img.pop("title", None)
                    elements.append(img)
            else:
                t = _coerce_text_obj(
                    el if not isinstance(el, dict) else el,
                    plain=False,
                    limit=2000,
                )
                if t:
                    elements.append(t)
    elif isinstance(block.get("text"), str):
        t = _mrkdwn_text(block.get("text"), limit=2000)
        if t:
            elements.append(t)
    if not elements:
        return None
    return {"type": "context", "elements": elements}


def _sanitize_table(block: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    rows_in = block.get("rows")
    if not isinstance(rows_in, list) or len(rows_in) < 2:
        return None
    width = None
    rows: List[List[Dict[str, Any]]] = []
    for row in rows_in[:100]:
        if not isinstance(row, (list, tuple)):
            continue
        cells: List[Dict[str, Any]] = []
        for cell in row[:20]:
            if isinstance(cell, bool):
                cells.append({"type": "raw_text", "text": "true" if cell else "false"})
            elif isinstance(cell, (int, float)):
                cells.append(
                    {
                        "type": "raw_number",
                        "value": float(cell),
                        "text": fmt_num(float(cell)),
                    }
                )
            elif isinstance(cell, dict) and cell.get("type") == "raw_number":
                try:
                    val = float(cell.get("value"))
                except (TypeError, ValueError):
                    continue
                cells.append(
                    {
                        "type": "raw_number",
                        "value": val,
                        "text": str(cell.get("text") or fmt_num(val))[:2000],
                    }
                )
            else:
                if isinstance(cell, dict):
                    text = str(cell.get("text") or cell.get("value") or " ")
                else:
                    text = str(cell if cell is not None else " ")
                cells.append({"type": "raw_text", "text": (text[:2000] or " ")})
        if not cells:
            continue
        if width is None:
            width = len(cells)
        elif len(cells) < width:
            cells.extend({"type": "raw_text", "text": " "} for _ in range(width - len(cells)))
        rows.append(cells[:width])
    if not rows or len(rows) < 2:
        return None
    return {"type": "table", "rows": rows}


def _sanitize_actions(block: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    els = block.get("elements") or block.get("actions") or []
    if not isinstance(els, list):
        return None
    buttons = []
    for el in els:
        btn = _sanitize_button(el)
        if btn:
            buttons.append(btn)
        if len(buttons) >= 5:
            break
    if not buttons:
        return None
    return {"type": "actions", "elements": buttons}


def _sanitize_card(block: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    out: Dict[str, Any] = {"type": "card"}
    for key, limit in (("title", 150), ("subtitle", 150), ("body", 200), ("subtext", 200)):
        if key not in block:
            continue
        obj = _coerce_text_obj(block.get(key), plain=False, limit=limit)
        if obj:
            out[key] = obj
    hero = block.get("hero_image") or block.get("image")
    img = _sanitize_image_el(hero) if hero else None
    if img:
        img.pop("title", None)
        out["hero_image"] = img
    icon = block.get("icon")
    icon_el = _sanitize_image_el(icon) if icon else None
    if icon_el:
        icon_el.pop("title", None)
        out["icon"] = icon_el
    actions = block.get("actions") or []
    if isinstance(actions, list):
        btns = []
        for el in actions:
            btn = _sanitize_button(el)
            if btn:
                btns.append(btn)
            if len(btns) >= 3:
                break
        if btns:
            out["actions"] = btns
    if not any(k in out for k in ("hero_image", "title", "body", "actions")):
        return None
    return out


def _sanitize_carousel(block: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    els = block.get("elements") or block.get("cards") or []
    if not isinstance(els, list):
        return None
    cards = []
    for el in els[:10]:
        if not isinstance(el, dict):
            continue
        card = _sanitize_card(el)
        if card:
            cards.append(card)
    if not cards:
        return None
    return {"type": "carousel", "elements": cards}


def _sanitize_image_block(block: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    return _sanitize_image_el(block)


_SANITIZERS = {
    "header": _sanitize_header,
    "section": _sanitize_section,
    "divider": lambda _b: {"type": "divider"},
    "context": _sanitize_context,
    "image": _sanitize_image_block,
    "table": _sanitize_table,
    "actions": _sanitize_actions,
    "card": _sanitize_card,
    "carousel": _sanitize_carousel,
}


def sanitize_llm_blocks(blocks: Any) -> List[Dict[str, Any]]:
    """Coerce LLM Block Kit into a Slack-safe allowlist. Drops invalid items."""
    if not isinstance(blocks, list):
        return []
    out: List[Dict[str, Any]] = []
    for raw in blocks:
        if not isinstance(raw, dict):
            continue
        btype = str(raw.get("type") or "").strip()
        if btype == "data_visualization":
            logger.info("Dropping LLM data_visualization (occupancy charts are code-owned)")
            continue
        fn = _SANITIZERS.get(btype)
        if not fn:
            if btype:
                logger.info("Dropping unsupported LLM block type %s", btype)
            continue
        try:
            cleaned = fn(raw)
        except Exception:
            logger.warning("Failed to sanitize LLM %s block", btype, exc_info=True)
            continue
        if cleaned:
            out.append(cleaned)
        if len(out) >= 40:
            break
    return out


def _strip_json_fence(text: str) -> str:
    raw = (text or "").strip()
    if raw.startswith("```"):
        raw = re.sub(r"^```(?:json|JSON)?\s*\n?", "", raw)
        raw = re.sub(r"\n?```$", "", raw).strip()
    return raw


_CJK_RE = re.compile(r"[\u3400-\u9fff]")
_DERAILED_RE = re.compile(
    r"predicted_key|:{:title:|function\.arguments|tool_choice|"
    r"emit_slack_message|JSON-RPC|</?tool",
    re.I,
)


_HOURS_LABEL = re.compile(r"(?i)\b(hours?|open|closed|location)\b")
_GENERIC_WEEKLY = re.compile(
    r"(?i)mon(?:day)?\s*[-–to]+\s*fri|sat(?:urday)?\s+\d|sun(?:day)?\s+closed"
)
_FAKE_LIB = re.compile(r"(?i)\bmain library\b")


def _block_text_blob(block: Dict[str, Any]) -> str:
    parts: List[str] = []

    def walk(obj: Any) -> None:
        if isinstance(obj, dict):
            if "text" in obj and isinstance(obj["text"], str):
                parts.append(obj["text"])
            for v in obj.values():
                walk(v)
        elif isinstance(obj, list):
            for x in obj:
                walk(x)
        elif isinstance(obj, str):
            parts.append(obj)

    walk(block)
    return "\n".join(parts)


def looks_like_hours_block(block: Dict[str, Any]) -> bool:
    """True for schedule/location cards Gemma invents on greetings."""
    if not isinstance(block, dict):
        return False
    blob = _block_text_blob(block)
    if _FAKE_LIB.search(blob):
        return True
    btype = block.get("type")
    if btype == "header" and re.search(r"(?i)hours|locations?", blob):
        return True
    if btype == "section" and (
        _GENERIC_WEEKLY.search(blob) or _HOURS_LABEL.search(blob) and re.search(r"\d\s*[ap]m", blob, re.I)
    ):
        return True
    if btype == "table" and re.search(r"(?i)\bhours\b", blob) and re.search(r"(?i)\b(date|day)\b", blob):
        return True
    return False


def drop_unsourced_hours_blocks(
    blocks: Optional[List[Dict[str, Any]]],
    *,
    hours_from_tools: bool,
) -> List[Dict[str, Any]]:
    if not blocks:
        return []
    if hours_from_tools:
        return list(blocks)
    out: List[Dict[str, Any]] = []
    for b in blocks:
        if looks_like_hours_block(b):
            logger.info("Dropping unsourced LLM hours/location block")
            continue
        out.append(b)
    return out


def formatter_output_usable(text: str, blocks: Optional[List[Dict[str, Any]]] = None) -> bool:
    """Reject formatter output that left the Block Kit contract (CJK, truncated JSON)."""
    visible_parts = [text or ""]
    for b in blocks or []:
        if isinstance(b, dict):
            visible_parts.append(_block_text_blob(b))
    visible = "\n".join(visible_parts)
    if _CJK_RE.search(visible):
        return False
    if _DERAILED_RE.search(visible):
        return False
    vis = visible.rstrip()
    if re.search(r"(::\{|:\{\s*$|::\s*$|[{[\(\\]\s*$)", vis):
        return False
    if vis.count("{") != vis.count("}"):
        return False
    if vis.count("[") != vis.count("]"):
        return False
    return True


_BULLET_ITEM = re.compile(r"(?m)^\s*[•\-\*]\s+(.+)$")
_STOP_KEYS = frozenset(
    {
        "library",
        "things",
        "materials",
        "digital",
        "historic",
        "finding",
        "searching",
        "walking",
        "between",
        "buildings",
        "assistant",
        "slack",
    }
)


def formatter_preserves_draft(
    draft: str,
    formatted_text: str,
    blocks: Optional[List[Dict[str, Any]]],
) -> bool:
    """
    If the agent draft had a list, Slack-visible formatter output must keep
    most of those items. Gemma 31B has posted 'I can help you with things like:'
    and dropped the bullets (the JSON `text` field still looked complete).
    """
    items = [m.group(1) for m in _BULLET_ITEM.finditer(draft or "")]
    if len(items) < 3:
        return True
    if blocks:
        visible = "\n".join(_block_text_blob(b) for b in blocks)
    else:
        visible = formatted_text or ""
    vis = visible.lower()
    kept = 0
    checked = 0
    for item in items:
        words = [
            w
            for w in re.split(r"\W+", item.lower())
            if len(w) >= 5 and w not in _STOP_KEYS
        ]
        if not words:
            continue
        checked += 1
        if words[0] in vis:
            kept += 1
    if checked < 3:
        return True
    return kept >= max(2, (checked + 1) // 2)


def parse_formatter_payload(raw: str) -> Tuple[str, Optional[List[Dict[str, Any]]]]:
    """
    Parse formatter LLM output.

    Returns (fallback_text, blocks_or_None). blocks is None when the model
    returned plain mrkdwn instead of JSON.
    """
    if not raw or not raw.strip():
        return "", None
    text = _strip_json_fence(raw)
    blob = text
    if not blob.startswith("{"):
        idx = blob.find("{")
        if idx >= 0 and '"blocks"' in blob[idx : idx + 400]:
            blob = blob[idx:]
            # trim trailing prose after the JSON object
            try:
                json.loads(blob)
            except json.JSONDecodeError:
                end = blob.rfind("}")
                if end > 0:
                    blob = blob[: end + 1]
        else:
            return raw.strip(), None
    try:
        data = json.loads(blob)
    except json.JSONDecodeError:
        return raw.strip(), None
    if not isinstance(data, dict):
        return raw.strip(), None
    if "blocks" not in data and "text" not in data:
        return raw.strip(), None
    fallback = data.get("text") or data.get("mrkdwn") or ""
    fallback = str(fallback).strip()
    blocks = sanitize_llm_blocks(data.get("blocks"))
    if not blocks:
        return fallback or raw.strip(), None
    if not fallback:
        fallback = _fallback_text_from_blocks(blocks)
    return fallback, blocks


def _fallback_text_from_blocks(blocks: List[Dict[str, Any]]) -> str:
    parts: List[str] = []
    for b in blocks:
        if b.get("type") == "header":
            t = (b.get("text") or {}).get("text")
            if t:
                parts.append(str(t))
        elif b.get("type") == "section":
            t = (b.get("text") or {}).get("text")
            if t:
                parts.append(str(t))
        elif b.get("type") == "card":
            t = (b.get("title") or {}).get("text")
            if t:
                parts.append(str(t))
    return "\n\n".join(parts).strip() or "Hoo Helper reply"


def _image_urls_in_blocks(blocks: List[Dict[str, Any]]) -> set:
    urls: set = set()

    def add(url: Optional[str]) -> None:
        if url:
            urls.add(url)

    for b in blocks:
        btype = b.get("type")
        if btype == "image":
            add(b.get("image_url"))
        elif btype == "card":
            hero = b.get("hero_image") or {}
            add(hero.get("image_url"))
        elif btype == "carousel":
            for el in b.get("elements") or []:
                hero = (el or {}).get("hero_image") or {}
                add(hero.get("image_url"))
        elif btype == "section":
            acc = b.get("accessory") or {}
            add(acc.get("image_url"))
    return urls


def _format_user_prompt(draft: str) -> str:
    return (
        "Reformat this HooHelp draft for Slack Block Kit. "
        "Call emit_slack_message with keys text and blocks. "
        "Do not answer in free-form text.\n\n"
        f"--- DRAFT START ---\n{draft}\n--- DRAFT END ---"
    )


def _mantle_format_for_slack(answer: str, *, model_id: str) -> str:
    """Gemma (and other mantle-only models): lock output via tool_choice + JSON schema."""
    from bedrock_mantle import (
        chat_completions,
        extract_message_text,
        extract_tool_arguments,
    )

    draft = answer.strip()
    if len(draft) > 12000:
        draft = draft[:12000].rstrip() + "\n…"

    region = os.environ.get("AWS_REGION", "us-east-1")
    payload: Dict[str, Any] = {
        "model": model_id,
        "messages": [
            {"role": "system", "content": SLACK_FORMAT_SYSTEM},
            {"role": "user", "content": _format_user_prompt(draft)},
        ],
        "temperature": 1.0,
        "top_p": 0.95,
        "max_tokens": 1500,
        "reasoning_effort": "low",
        "tools": FORMATTER_TOOLS,
        "tool_choice": FORMATTER_TOOL_CHOICE,
    }
    try:
        resp = chat_completions(payload, region=region)
    except RuntimeError as e:
        if "tool_choice" in str(e).lower():
            payload = dict(payload)
            payload["tool_choice"] = "required"
            logger.warning("Named tool_choice rejected; retrying with required")
            resp = chat_completions(payload, region=region)
        else:
            raise
    tool_json = extract_tool_arguments(resp, FORMATTER_TOOL_NAME)
    if tool_json:
        logger.info("Gemma formatter locked via %s tool call", FORMATTER_TOOL_NAME)
        return tool_json
    fallback = extract_message_text(resp)
    if fallback:
        logger.warning(
            "Formatter %s did not call %s; using message content",
            model_id,
            FORMATTER_TOOL_NAME,
        )
        return fallback
    raise RuntimeError(f"empty mantle formatter output from {model_id}")


def _bedrock_format_for_slack(
    answer: str,
    *,
    bedrock_client: Any,
    model_id: str,
) -> str:
    """Ask Bedrock Converse to rewrite the answer as Slack Block Kit JSON."""
    # Keep prompt size bounded
    draft = answer.strip()
    if len(draft) > 12000:
        draft = draft[:12000].rstrip() + "\n…"

    from bedrock_params import inference_config_for_model

    converse_kwargs: Dict[str, Any] = {
        "modelId": model_id,
        "system": [{"text": SLACK_FORMAT_SYSTEM}],
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "text": _format_user_prompt(draft),
                    }
                ],
            }
        ],
        "inferenceConfig": inference_config_for_model(
            model_id, max_tokens=2500, temperature=0.0
        ),
        "toolConfig": {
            "tools": [
                {
                    "toolSpec": {
                        "name": FORMATTER_TOOL_NAME,
                        "description": (
                            "Emit the Slack Block Kit message. Always call this "
                            "tool with the formatted payload."
                        ),
                        "inputSchema": {"json": SLACK_BLOCK_KIT_SCHEMA},
                    }
                }
            ],
            "toolChoice": {"tool": {"name": FORMATTER_TOOL_NAME}},
        },
    }
    # Same guardrail as the agent when configured (library-safe outputs)
    try:
        from guardrails import get_guardrail_config, log_guardrail_trace

        gr = get_guardrail_config()
        if gr:
            converse_kwargs["guardrailConfig"] = gr
    except Exception:
        gr = None

    resp = bedrock_client.converse(**converse_kwargs)
    if gr:
        try:
            log_guardrail_trace(resp, context="slack_format")
        except Exception:
            pass
    if resp.get("stopReason") == "guardrail_intervened":
        # Fall back to local cleanup of the original draft rather than a blocked empty string
        logger.warning("Slack format call blocked by guardrail; using local cleanup")
        return _local_markdown_cleanup(draft)

    content = resp.get("output", {}).get("message", {}).get("content", []) or []
    for block in content:
        tool = block.get("toolUse") if isinstance(block, dict) else None
        if isinstance(tool, dict) and tool.get("name") == FORMATTER_TOOL_NAME:
            args = tool.get("input")
            if isinstance(args, dict):
                return json.dumps(args, ensure_ascii=False)
            if args:
                return str(args)
    parts = []
    for block in content:
        if isinstance(block, dict) and "text" in block:
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


def _short_image_intro(text: str) -> str:
    """One-line caption for image answers; strip IIIF/Virgo listing lines."""
    for line in (text or "").splitlines():
        s = line.strip().strip("*")
        if not s:
            continue
        low = s.lower()
        if "iiif.lib.virginia.edu" in low or "search.lib.virginia.edu" in low:
            continue
        if re.match(r"^(image url|virgo|collection|title)\b", s, re.I):
            continue
        if s.startswith("http"):
            continue
        if re.match(r"^\d+[.)]", s):
            continue
        return s[:300]
    return "Here are some images from the library collections."


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


def _append_images(
    blocks: List[Dict[str, Any]], images: List[Dict[str, str]]
) -> None:
    if not images:
        return
    existing = _image_urls_in_blocks(blocks)
    to_add = [
        img
        for img in images
        if (img.get("image_url") or "").startswith("http")
        and img.get("image_url") not in existing
    ]
    if not to_add:
        return
    if blocks:
        blocks.append({"type": "divider"})
    for idx, img in enumerate(to_add):
        title = img.get("title") or "Library image"
        url = img.get("image_url") or ""
        blocks.append(
            {
                "type": "image",
                "image_url": url[:3000],
                "alt_text": title[:2000],
                "title": {"type": "plain_text", "text": title[:2000], "emoji": True},
            }
        )
        if idx < len(to_add) - 1:
            blocks.append({"type": "divider"})


def _build_blocks(
    mrkdwn: str,
    images: List[Dict[str, str]],
    extra_blocks: Optional[List[Dict[str, Any]]] = None,
    llm_blocks: Optional[List[Dict[str, Any]]] = None,
) -> List[Dict[str, Any]]:
    blocks: List[Dict[str, Any]] = []
    if llm_blocks:
        blocks.extend(llm_blocks)
    elif mrkdwn:
        for chunk in _chunk_mrkdwn(mrkdwn):
            blocks.append(
                {"type": "section", "text": {"type": "mrkdwn", "text": chunk[:3000]}}
            )

    if extra_blocks:
        if blocks:
            blocks.append({"type": "divider"})
        blocks.extend(extra_blocks)

    _append_images(blocks, images)
    return blocks[:MAX_BLOCKS]


def _layout_owned(extra: List[Dict[str, Any]]) -> Tuple[bool, bool, bool]:
    occ_owned = any(
        b.get("type") == "data_visualization"
        or (
            b.get("type") == "header"
            and "occupancy"
            in str((b.get("text") or {}).get("text") or "").lower()
        )
        for b in extra
    )
    hours_owned = (not occ_owned) and any(
        b.get("type") == "header"
        and "hours" in str((b.get("text") or {}).get("text") or "").lower()
        for b in extra
    ) and any(b.get("type") == "table" for b in extra)
    img_owned = any(b.get("type") in ("carousel", "card") for b in extra)
    return occ_owned, hours_owned, img_owned


def format_for_slack(
    raw: str,
    *,
    show_reasoning: Optional[bool] = None,
    bedrock_client: Any = None,
    model_id: Optional[str] = None,
    use_llm: Optional[bool] = None,
    tool_steps: Optional[Iterable[Any]] = None,
    exclude_image_urls: Optional[Iterable[str]] = None,
) -> Tuple[str, List[Dict[str, Any]]]:
    """
    Prepare a model reply for Slack.

    Returns (fallback_text, blocks).
    The formatter LLM may return Block Kit JSON; hours/occupancy tool output
    still appends deterministic tables and charts.
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

    extra: List[Dict[str, Any]] = []
    fallback = ""
    if tool_steps:
        try:
            extra = blocks_from_tool_steps(
                tool_steps, exclude_image_urls=exclude_image_urls
            )
        except Exception as e:
            logger.warning("Hours/occupancy Block Kit skipped: %s", e)
            extra = []
        try:
            fallback = tool_fallback_text(tool_steps)
        except Exception:
            fallback = ""
    occ_owned, hours_owned, img_owned = _layout_owned(extra)
    # Hours / occupancy / image carousels are code-owned. Skip the formatter
    # LLM — it was adding 5–15s and then being discarded.
    skip_formatter = bool(occ_owned or hours_owned or img_owned)

    formatted = ""
    llm_blocks: Optional[List[Dict[str, Any]]] = None
    if use_llm and not skip_formatter:
        try:
            import boto3

            mid = model_id or os.environ.get(
                "BEDROCK_MODEL_ID", DEFAULT_AGENT_MODEL_ID
            )
            format_model = (
                os.environ.get("SLACK_FORMAT_MODEL_ID") or DEFAULT_FORMAT_MODEL_ID
            )
            if uses_bedrock_mantle(format_model):
                formatted = _mantle_format_for_slack(answer, model_id=format_model)
            else:
                client = bedrock_client or boto3.client(
                    "bedrock-runtime",
                    region_name=os.environ.get("AWS_REGION", "us-east-1"),
                )
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

    if formatted:
        parsed_text, parsed_blocks = parse_formatter_payload(formatted)
        if (
            parsed_blocks
            and formatter_output_usable(parsed_text, parsed_blocks)
            and formatter_preserves_draft(answer, parsed_text, parsed_blocks)
        ):
            formatted = _local_markdown_cleanup(parsed_text) if parsed_text else parsed_text
            llm_blocks = drop_unsourced_hours_blocks(
                parsed_blocks, hours_from_tools=hours_owned
            )
            logger.info("LLM Block Kit accepted (%s blocks)", len(llm_blocks))
        elif (
            formatter_output_usable(parsed_text or formatted)
            and parsed_blocks is None
            and formatter_preserves_draft(answer, parsed_text or formatted, None)
        ):
            # Plain mrkdwn from the formatter (no JSON) — still usable.
            formatted = _local_markdown_cleanup(parsed_text or formatted)
        else:
            logger.warning("Formatter output unusable; keeping agent draft")
            formatted = _local_markdown_cleanup(answer)
            llm_blocks = None
    else:
        formatted = _local_markdown_cleanup(answer)

    images = _extract_image_entries(formatted)
    seen_img = {i["image_url"] for i in images}
    for extra_img in _extract_image_entries(answer):
        if extra_img["image_url"] not in seen_img:
            images.append(extra_img)
            seen_img.add(extra_img["image_url"])
        if len(images) >= 4:
            break
    if extra:
        prose_mrkdwn = formatted
        if occ_owned:
            # Code owns occupancy layout. Drop the LLM paste of the raw report.
            formatted = fallback or formatted
            llm_blocks = None
            prose_mrkdwn = ""
        elif hours_owned:
            # Code owns the Date/Day/Hours table. Drop the LLM day-by-day list
            # so Slack does not show the same schedule twice.
            formatted = fallback or formatted
            llm_blocks = None
            prose_mrkdwn = ""
        elif img_owned:
            # Carousel owns the pictures. Drop LLM image listings / IIIF URLs so
            # Slack does not unfurl a second set of thumbnails.
            intro = _short_image_intro(formatted or answer)
            formatted = intro
            llm_blocks = None
            prose_mrkdwn = intro
            images = []
        elif fallback and not re.search(
            r"(?i)(?:\d{1,2}:\d{2}\s*[AP]M.+){2,}|• \*.+—", formatted or ""
        ):
            formatted = f"{formatted}\n\n{fallback}".strip() if formatted else fallback
            prose_mrkdwn = formatted
    else:
        prose_mrkdwn = formatted
    blocks = _build_blocks(
        prose_mrkdwn,
        images,
        extra_blocks=extra or None,
        llm_blocks=llm_blocks,
    )

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

    # Full Slack mrkdwn body for chat.postMessage `text=` (notifications/a11y)
    # and session traces. Do not slice mid-message — Slack allows large text fields
    # when blocks are also present (up to ~40k).
    return formatted, blocks[:MAX_BLOCKS]


def rewrite_urls_in_blocks(
    blocks: List[Dict[str, Any]],
    changes: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """Apply link-check replacements/removals inside Block Kit JSON."""
    if not blocks or not changes:
        return blocks
    mapping: Dict[str, str] = {}
    removed: List[str] = []
    for ch in changes:
        old = ch.get("url") or ""
        if not old:
            continue
        new = ch.get("replacement")
        if new:
            mapping[old] = new
        elif ch.get("action") == "removed":
            removed.append(old)

    def walk(obj: Any) -> Any:
        if isinstance(obj, str):
            for old, new in mapping.items():
                if old in obj:
                    obj = obj.replace(old, new)
            for old in removed:
                obj = obj.replace(old, "")
            return obj
        if isinstance(obj, list):
            return [walk(x) for x in obj]
        if isinstance(obj, dict):
            return {k: walk(v) for k, v in obj.items()}
        return obj

    return walk(blocks)
