"""
virgo_links.py — add the Virgo record link to each catalog item a reply names.

The model is told to link items but often doesn't, and without links a later
"those as RIS" can't be tied to the exact items shown. Before formatting, each
list line that names one of this turn's catalog results — by its call number,
or by a title no other result shares — gets " · [Virgo](record URL)". Lines that
already link Virgo, prose, and hidden reasoning are left alone; nothing is
guessed when a title is ambiguous.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any, Dict, Iterable, List, Optional

_HEADING = re.compile(r"^#{2,4}\s+(?:\d+\.\s+)?(.+?)\s*$")
_CALL = re.compile(r"^\s*-\s+\*\*Call number\*\*:\s*`?([^`]+?)`?\s*$")
_RECORD = re.compile(r"(https://search\.lib\.virginia\.edu/sources/uva_library/items/[A-Za-z0-9_.:-]+)")
_LIST_LINE = re.compile(r"^\s*(?:[•\-*]|\d+[.)])\s+")
_EMPHASIS = re.compile(r"\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_")
_THINKING = re.compile(r"(?s)<thinking>.*?</thinking>")


@dataclass
class CatalogRecord:
    item_id: str
    url: str
    title: str = ""
    call_number: str = ""


def _attr(step: Any, key: str) -> Any:
    return step.get(key) if isinstance(step, dict) else getattr(step, key, None)


def _norm(title: str) -> str:
    return " ".join(re.sub(r"[^\w\s-]", " ", (title or "").lower()).split())


def _base(title: str) -> str:
    """Title without its edition / version note: '1984 (Full screen version.)' → '1984'."""
    return _norm(re.sub(r"\([^)]*\)", " ", title or ""))


def catalog_records(steps: Optional[Iterable[Any]]) -> List[CatalogRecord]:
    """Catalog results (uva_library) in this turn's successful tool outputs, in order, no repeats."""
    records: List[CatalogRecord] = []
    seen = set()
    for step in steps or []:
        if _attr(step, "status") not in (None, "success"):
            continue
        if not str(_attr(step, "tool_name") or "").startswith("VirgoCatalogRuntime"):
            continue  # a Virgo link quoted in Jira or Slack isn't a catalog result
        title, call = "", ""
        for line in str(_attr(step, "output") or "").splitlines():
            heading = _HEADING.match(line)
            if heading:
                title, call = heading.group(1), ""
                continue
            call_m = _CALL.match(line)
            if call_m:
                call = call_m.group(1).strip()
                if not re.search(r"[A-Za-z0-9]{2}", call):  # "—" / "n/a" placeholders would match any line
                    call = ""
                continue
            rec = _RECORD.search(line)
            if rec and rec.group(1) not in seen:
                seen.add(rec.group(1))
                records.append(CatalogRecord(rec.group(1).rsplit("/", 1)[1], rec.group(1), title, call))
    return records


def _match(line: str, records: List[CatalogRecord], by_title: Dict[str, List[CatalogRecord]],
           by_base: Dict[str, List[CatalogRecord]]) -> Optional[CatalogRecord]:
    flat = " ".join(line.split())
    for rec in records:
        if rec.call_number and re.search(rf"(?<![\w.]){re.escape(' '.join(rec.call_number.split()))}(?!\w)", flat):
            return rec
    for m in _EMPHASIS.finditer(line):
        named = next(g for g in m.groups() if g)
        # "(1st ed.)" written out: match that exact title; a bare title must be unique among all editions
        candidates = by_title.get(_norm(named), []) if "(" in named else by_base.get(_base(named), [])
        if len(candidates) == 1:
            return candidates[0]
    return None


def add_virgo_links(text: str, steps: Optional[Iterable[Any]]) -> str:
    records = catalog_records(steps)
    if not records or not text:
        return text
    by_title: Dict[str, List[CatalogRecord]] = {}
    by_base: Dict[str, List[CatalogRecord]] = {}
    for rec in records:
        by_title.setdefault(_norm(rec.title), []).append(rec)
        by_base.setdefault(_base(rec.title), []).append(rec)
    linked = set()

    def link_lines(chunk: str) -> str:
        out = []
        for line in chunk.split("\n"):
            if _LIST_LINE.match(line) and "search.lib.virginia.edu" not in line:
                rec = _match(line, records, by_title, by_base)
                if rec and rec.item_id not in linked:
                    linked.add(rec.item_id)
                    line = f"{line.rstrip()} · [Virgo]({rec.url})"
            out.append(line)
        return "\n".join(out)

    pieces, last = [], 0
    for m in _THINKING.finditer(text):  # reasoning is never rewritten
        pieces += [link_lines(text[last:m.start()]), m.group(0)]
        last = m.end()
    pieces.append(link_lines(text[last:]))
    return "".join(pieces)
