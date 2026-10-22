"""
virgo_citations.py — RIS (Zotero / EndNote) for the Virgo catalog items in this turn.

The citations themselves come from the Virgo MCP server's get_citations tool
(Virgo's own citations service), called here directly through the gateway so
the RIS never passes through the model. Any item it can't cite — or the whole
call, if the gateway fails — gets a basic record built from the search output,
so the file never silently drops items.
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass, field
from typing import Any, Callable, Dict, Iterable, List, Optional

logger = logging.getLogger(__name__)

TOOL_GET_CITATIONS = "VirgoCatalogRuntime___get_citations"
RECORD_URL = "https://search.lib.virginia.edu/sources/uva_library/items/"
MAX_ITEMS = 50  # same cap as get_citations
UNAVAILABLE_NOTE = "Virgo has no citation for this item right now; see the Virgo record."  # get_citations' marker

_RECORD = re.compile(r"https://search\.lib\.virginia\.edu/sources/(\w+)/items/([^\s)\]|>`*]+)")
_HEADING = re.compile(r"^#{2,4}\s+(?:\d+\.\s+)?(.+?)\s*$")
_FIELD = re.compile(r"^\s*-\s+\*\*(Format|Author)\*\*:\s*(.+?)\s*$")
_ID_LINE = re.compile(r"^ID  - (.+?)\s*$", re.M)
# In the bot's own replies: either record-link form, optionally as Slack <url|label> markup.
_ANSWER_LINK = re.compile(r"<?https://search\.lib\.virginia\.edu/(?:sources/(\w+)/)?items/([A-Za-z0-9_.:-]+)(?:\|([^>]*)>)?")
_REFERS_BACK = re.compile(r"(?i)\b(?:those|these|them|the above|that list|the same ones?)\b")
_FALLBACK_TYPES = (("video", "VIDEO"), ("dvd", "VIDEO"), ("map", "MAP"), ("music", "MUSIC"),
                   ("sound", "SOUND"), ("journal", "JFULL"), ("thesis", "THES"), ("book", "BOOK"))

CallTool = Callable[[str, Dict[str, Any]], str]


@dataclass
class CatalogItem:
    item_id: str
    title: str = ""
    author: str = ""
    format: str = ""


@dataclass
class FoundItems:
    items: List[CatalogItem] = field(default_factory=list)
    skipped_other: int = 0  # items from other Virgo sources (images, articles…)


@dataclass
class VirgoRis:
    content: bytes = b""
    cited: int = 0
    fallback: int = 0
    skipped_other: int = 0
    capped: bool = False


def _attr(step: Any, key: str) -> Any:
    return step.get(key) if isinstance(step, dict) else getattr(step, key, None)


def catalog_items(steps: Optional[Iterable[Any]]) -> FoundItems:
    """Catalog items (uva_library) linked in successful tool outputs, in order, without repeats."""
    found = FoundItems()
    seen, others = set(), set()
    for step in steps or []:
        if _attr(step, "status") not in (None, "success"):
            continue
        current = CatalogItem("")
        for line in str(_attr(step, "output") or "").splitlines():
            heading = _HEADING.match(line)
            if heading:
                current = CatalogItem("", title=heading.group(1))
                continue
            fld = _FIELD.match(line)
            if fld:
                setattr(current, fld.group(1).lower(), fld.group(2))
                continue
            for m in _RECORD.finditer(line):
                pool, item_id = m.group(1), m.group(2)
                if pool != "uva_library":
                    others.add((pool, item_id))
                elif item_id not in seen:
                    seen.add(item_id)
                    found.items.append(CatalogItem(item_id, current.title, current.author, current.format))
    found.skipped_other = len(others)
    return found


def refers_back(text: str) -> bool:
    """'those as RIS', 'export them': the items are the ones in the previous answer."""
    return bool(_REFERS_BACK.search(text or ""))


def items_from_history(history: Optional[Iterable[Dict[str, Any]]]) -> FoundItems:
    """Catalog items linked in the bot's most recent reply that links any."""
    for turn in reversed(list(history or [])):
        if turn.get("role") != "assistant":
            continue
        text = " ".join(str(p.get("text") or "") for p in turn.get("content") or [] if isinstance(p, dict))
        found, seen = FoundItems(), set()
        for m in _ANSWER_LINK.finditer(text):
            pool, item_id, label = m.group(1), m.group(2), m.group(3) or ""
            if pool not in (None, "uva_library") or item_id in seen:
                continue
            seen.add(item_id)
            found.items.append(CatalogItem(item_id, title=label.strip("*_ ").strip()))
        if found.items:
            return found
    return FoundItems()


def fallback_record(item: CatalogItem) -> str:
    fmt = item.format.lower()
    ty = next((code for word, code in _FALLBACK_TYPES if word in fmt), "GEN")
    lines = [f"TY  - {ty}", f"TI  - {item.title or item.item_id}"]
    for author in [a.strip() for a in item.author.split(";") if a.strip()][:5]:
        lines.append(f"AU  - {author}")
    lines += [f"ID  - {item.item_id}", f"UR  - {RECORD_URL}{item.item_id}", "ER  - "]
    return "\r\n".join(lines)


def _records_by_id(ris: str) -> Dict[str, str]:
    """get_citations RIS → {item id: record}, leaving out the ones it marked unavailable."""
    records = {}
    for chunk in (ris or "").replace("\r\n", "\n").split("ER  - "):
        chunk = chunk.strip()
        m = _ID_LINE.search(chunk)
        if not chunk.startswith("TY  - ") or not m or UNAVAILABLE_NOTE in chunk:
            continue
        records[m.group(1)] = "\r\n".join(chunk.split("\n") + ["ER  - "])
    return records


def _model_citations(steps: Iterable[Any]) -> Optional[tuple]:
    """(item ids, RIS reply) from the model's own get_citations(format='ris') call this turn, if any."""
    picked = None
    for step in steps:
        if not str(_attr(step, "tool_name") or "").endswith("get_citations") or _attr(step, "status") not in (None, "success"):
            continue
        args = _attr(step, "input") or {}
        if str(args.get("format") or "ris").lower() != "ris":
            continue
        ids = [i for i in re.split(r"[\s,]+", str(args.get("item_ids") or "")) if i]
        ids = [(_ANSWER_LINK.search(i).group(2) if _ANSWER_LINK.search(i) else i) for i in ids]
        picked = (list(dict.fromkeys(ids)), str(_attr(step, "output") or ""))  # the last call wins
    return picked


def virgo_ris(steps: Optional[Iterable[Any]], *, call_tool: Optional[CallTool],
              history: Optional[Iterable[Dict[str, Any]]] = None, user_text: str = "") -> VirgoRis:
    """RIS for the catalog items meant, in this order of trust:
    1. the model's own get_citations(format='ris') call this turn (it resolves "those" best);
    2. for "those" (or when nothing was searched), the items linked in the previous answer;
    3. this turn's catalog search results."""
    steps = list(steps or [])
    found = catalog_items(steps)
    previous = items_from_history(history)
    known = {i.item_id: i for i in previous.items + found.items}
    chosen = _model_citations(steps)
    if chosen and chosen[0]:
        ids, reply = chosen
        result = VirgoRis(skipped_other=found.skipped_other, capped=len(ids) > MAX_ITEMS)
        items = [known.get(i) or CatalogItem(i) for i in ids[:MAX_ITEMS]]
        cited = _records_by_id(reply)
        records = [cited.get(item.item_id) or fallback_record(item) for item in items]
        result.cited, result.fallback = len(records), sum(1 for item in items if item.item_id not in cited)
        result.content = ("\r\n".join(records) + "\r\n").encode("utf-8")
        return result
    if previous.items and (refers_back(user_text) or not found.items):
        found = previous
    result = VirgoRis(skipped_other=found.skipped_other)
    items = found.items[:MAX_ITEMS]
    result.capped = len(found.items) > MAX_ITEMS
    if not items:
        return result
    cited: Dict[str, str] = {}
    if call_tool is not None:
        try:
            reply = call_tool(TOOL_GET_CITATIONS, {"item_ids": ",".join(i.item_id for i in items), "format": "ris"})
            cited = _records_by_id(reply)
            if not cited:
                logger.warning("get_citations gave no records: %s", str(reply)[:120])
        except Exception as e:
            logger.warning("get_citations failed: %s", type(e).__name__)
    records = [cited.get(item.item_id) or fallback_record(item) for item in items]
    result.cited = len(records)
    result.fallback = sum(1 for item in items if item.item_id not in cited)
    result.content = ("\r\n".join(records) + "\r\n").encode("utf-8")
    return result
