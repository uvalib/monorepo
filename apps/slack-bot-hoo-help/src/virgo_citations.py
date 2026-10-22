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


def virgo_ris(steps: Optional[Iterable[Any]], *, call_tool: Optional[CallTool]) -> VirgoRis:
    found = catalog_items(steps)
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
