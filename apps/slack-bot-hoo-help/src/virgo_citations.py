"""
virgo_citations.py — RIS (Zotero / EndNote) for the Virgo catalog items in this turn.

Virgo's own citations service (the one behind Virgo's "Cite" button) gives a full
RIS record per item. It needs Virgo's public guest token, the same one the
VirgoCatalog MCP server uses. If the service fails for an item, a basic record
is built from the search output so the file never silently drops items.
"""

from __future__ import annotations

import logging
import re
import time
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
from typing import Any, Callable, Iterable, List, Optional

import requests

logger = logging.getLogger(__name__)

AUTH_URL = "https://search.lib.virginia.edu/authorize"
CITATIONS_URL = "https://citations-ws.internal.lib.virginia.edu/format/ris"
RESOURCE_URL = "https://pool-solr-ws-uva-library.internal.lib.virginia.edu/api/resource/"
RECORD_URL = "https://search.lib.virginia.edu/sources/uva_library/items/"
MAX_ITEMS = 50
WORKERS = 4
TIMEOUT = 8
BUDGET_S = 20  # all citation requests together; the Lambda has 120 s for the whole turn

_RECORD = re.compile(r"https://search\.lib\.virginia\.edu/sources/(\w+)/items/([^\s)\]|>`*]+)")
_HEADING = re.compile(r"^#{2,4}\s+(?:\d+\.\s+)?(.+?)\s*$")
_FIELD = re.compile(r"^\s*-\s+\*\*(Format|Author)\*\*:\s*(.+?)\s*$")
_TAG = re.compile(r"^([A-Z][A-Z0-9])  - ?(.*)$")
_HTML_LINK = re.compile(r"<a\s[^>]*href=\"([^\"]+)\"[^>]*>.*?</a>", re.I)
_FALLBACK_TYPES = (("video", "VIDEO"), ("dvd", "VIDEO"), ("map", "MAP"), ("music", "MUSIC"),
                   ("sound", "SOUND"), ("journal", "JFULL"), ("thesis", "THES"), ("book", "BOOK"))


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


def _record_url(item_id: str) -> str:
    return RECORD_URL + item_id


def clean_record(ris: str, item_id: str) -> str:
    """One RIS record: HTML links in notes become a UR line; CRLF; always a UR and an ER."""
    lines, urls = [], []
    for raw in (ris or "").replace("\r\n", "\n").split("\n"):
        line = raw.rstrip()
        if not line:
            continue
        tag = _TAG.match(line)
        if tag and tag.group(1) == "N1" and _HTML_LINK.search(tag.group(2)):
            urls += _HTML_LINK.findall(tag.group(2))
            note = _HTML_LINK.sub("", tag.group(2)).strip()
            if note:
                lines.append(f"N1  - {note}")
            continue
        if tag and tag.group(1) == "UR":
            urls.append(tag.group(2))
            continue
        if tag and tag.group(1) == "ER":
            continue
        lines.append(line)
    if not urls:
        urls = [_record_url(item_id)]
    for url in dict.fromkeys(urls):
        lines.append(f"UR  - {url}")
    lines.append("ER  - ")
    return "\r\n".join(lines)


def fallback_record(item: CatalogItem) -> str:
    fmt = item.format.lower()
    ty = next((code for word, code in _FALLBACK_TYPES if word in fmt), "GEN")
    lines = [f"TY  - {ty}", f"TI  - {item.title or item.item_id}"]
    for author in [a.strip() for a in item.author.split(";") if a.strip()][:5]:
        lines.append(f"AU  - {author}")
    lines += [f"UR  - {_record_url(item.item_id)}", f"N1  - Virgo item {item.item_id}", "ER  - "]
    return "\r\n".join(lines)


def _service_fetcher(timeout: int = TIMEOUT) -> Callable[[str], str]:
    """A fetch(item_id) → RIS text using Virgo's guest token (fetched once per call)."""
    token = requests.post(AUTH_URL, timeout=timeout).text.strip()

    def fetch(item_id: str) -> str:
        resp = requests.get(CITATIONS_URL, params={"item": RESOURCE_URL + item_id},
                            headers={"Authorization": f"Bearer {token}"}, timeout=timeout)
        resp.raise_for_status()
        if "TY  -" not in resp.text:
            raise ValueError("not RIS")
        return resp.text

    return fetch


def virgo_ris(steps: Optional[Iterable[Any]], *, fetch: Optional[Callable[[str], str]] = None,
              budget_s: float = BUDGET_S, clock: Callable[[], float] = time.monotonic) -> VirgoRis:
    found = catalog_items(steps)
    result = VirgoRis(skipped_other=found.skipped_other)
    items = found.items[:MAX_ITEMS]
    result.capped = len(found.items) > MAX_ITEMS
    if not items:
        return result
    if fetch is None:
        try:
            fetch = _service_fetcher()
        except Exception as e:
            logger.warning("Virgo guest token failed: %s", type(e).__name__)
            fetch = None

    deadline = clock() + budget_s

    def one(item: CatalogItem) -> "tuple[str, bool]":
        if fetch is not None and clock() < deadline:
            try:
                return clean_record(fetch(item.item_id), item.item_id), False
            except Exception as e:
                logger.info("Virgo citation for %s failed: %s", item.item_id, type(e).__name__)
        return fallback_record(item), True

    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        records = list(pool.map(one, items))  # map keeps the search order
    result.cited = len(records)
    result.fallback = sum(1 for _, fell_back in records if fell_back)
    result.content = ("\r\n".join(rec for rec, _ in records) + "\r\n").encode("utf-8")
    return result
