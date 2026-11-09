"""
citation_check.py — check a whole citation list against the Virgo catalog in one tool call.

The model passes the list; code searches (title, then author), decides each match and writes
the table, so every verdict, call number and link comes from a catalog result. (2026-11-09: a
55-citation check done by the model in batches stopped at the step limit, and "yes, continue"
batches were answered from memory with invented holdings.)
"""

from __future__ import annotations

import logging
import os
import re
import time
import unicodedata
from concurrent.futures import ThreadPoolExecutor, wait as futures_wait
from dataclasses import dataclass, field
from typing import Any, Callable, Dict, List, Optional, Set

logger = logging.getLogger(__name__)

TOOL_CHECK_CITATIONS = "check_citations"
SEARCH_TOOL = "Catalog___search_catalog"  # v2 gateway (uvalib-mcp)
MAX_CITATIONS = 100
WORKERS = 8
BUDGET_SEC = 60.0
OTHER_WORKS_MAX = 2
# Another work by the author is shown only when its title shares a word's consonant outline with
# the citation's (cognates: voodoo/vaudou "vd", spirit/esprit "sprt", peintres "pntrs"). Letter
# likeness was too noisy on real data (spirit/saint scored above voodoo/vaudou).
MIN_WORD = 5
HEADER = ("| # | Citation | UVA has it? | Match | Location / call number | Virgo link | "
          "Other editions or works by author |")
NOTE = ('Auction catalogs, journal articles and single journal issues usually aren\'t catalogued as their own '
        'records: "No" for those means check the journal or database.')
_GATEWAY_ERRORS = ("Error", "Tool Error", "Gateway Tool Invocation Error", "Tool Invocation Error")

EXACT, LIKELY, LIKELY_WITH_AUTHOR = 0.80, 0.50, 0.40
MIN_WORDS_WITHOUT_AUTHOR = 4  # results carry no year: a short title alone can't be "exact"
STOPWORDS = frozenset("the a an of and or de la le les du des el y in on for to with".split())

_YEAR = re.compile(r"\b(1[5-9]\d\d|20\d\d)\b")
_QUOTED = re.compile(r"[\"“]([^\"”]+)[\"”]")
_ITALIC = re.compile(r"(?<![\w])_([^_]+)_(?![\w])|\*([^*]+)\*")
_FIELD = re.compile(r"^\s*-\s*\*\*([^*]+)\*\*:\s*(.*)$", re.M)
_HEADING = re.compile(r"^### \d+\.\s*(.*)$", re.M)


@dataclass
class Citation:
    text: str
    author: str
    surname: str
    title: str
    year: str
    given: str = ""  # the author's first name, when the citation has "Surname, Given"


@dataclass
class Record:
    title: str
    author: str
    library: str
    location: str
    call_number: str
    url: str
    item_id: str


def _clean_title(text: str) -> str:
    return " ".join(text.replace("_", " ").replace("*", " ").split()).strip(" .,;:")


def _author_end(text: str) -> int:
    """End of the author part: the first ". " that doesn't follow an initial (J. Smith)."""
    for m in re.finditer(r"\.\s", text):
        token = text[: m.start()].split()[-1] if text[: m.start()].split() else ""
        if len(token.strip(",")) == 1 and token[:1].isupper():
            continue
        return m.start()
    return -1


def parse_citation(text: str) -> Citation:
    text = " ".join((text or "").split())
    year_m = _YEAR.search(text)
    year = year_m.group(1) if year_m else ""
    starts_with_title = text[:1] in "_*\"“"
    author = ""
    rest = text
    if not starts_with_title:
        end = _author_end(text)
        if end > 0:
            author, rest = text[:end].strip(), text[end + 1:].strip()
    quoted = _QUOTED.search(rest)
    italic = _ITALIC.search(rest)
    if quoted and (not italic or quoted.start() < italic.start()):
        title = quoted.group(1)
    elif italic:
        title = italic.group(1) or italic.group(2)
    else:
        end = _author_end(rest)
        title = rest[:end] if end > 0 else rest
    surname = given = ""
    if author:
        if "," in author:
            surname, _, rest_name = author.partition(",")
            surname = surname.strip()
            given = (rest_name.split() or [""])[0].strip(".,")
        else:
            surname = author.split()[-1]
    return Citation(text=text, author=author, surname=surname, title=_clean_title(title), year=year, given=given)


def parse_results(text: str) -> List[Record]:
    """Records from a Catalog search_catalog result ("### n. Title" blocks)."""
    out: List[Record] = []
    heads = list(_HEADING.finditer(text or ""))
    for i, h in enumerate(heads):
        body = text[h.end(): heads[i + 1].start() if i + 1 < len(heads) else len(text)]
        fields = {k.strip(): v.strip() for k, v in _FIELD.findall(body)}
        out.append(Record(
            title=h.group(1).strip(),
            author=fields.get("Author", ""),
            library=fields.get("Library", ""),
            location=fields.get("Location / shelf", ""),
            call_number=fields.get("Call number", "").strip("`"),
            url=fields.get("Virgo record", ""),
            item_id=fields.get("Item ID", "").strip("`"),
        ))
    return out


def significant_words(text: str) -> Set[str]:
    plain = "".join(c for c in unicodedata.normalize("NFKD", text or "") if not unicodedata.combining(c))
    return {w for w in re.findall(r"[a-z0-9]+", plain.lower()) if w not in STOPWORDS}


def _outlines(title: str) -> Set[str]:
    return {o for o in (re.sub(r"[aeiouy]", "", w) for w in significant_words(title)
                        if len(w) >= MIN_WORD and not w.isdigit()) if len(o) >= 2}


def related_titles(a: str, b: str) -> bool:
    """Do two titles share a word's consonant outline? Catches a translation's cognates
    ('Voodoo' / 'Vaudou') and shared words, not chance letter overlaps."""
    return bool(_outlines(a) & _outlines(b))


def _contained(part: Set[str], whole: Set[str]) -> float:
    return len(part & whole) / len(part) if part else 0.0


def match(cite: Citation, rec: Record) -> str:
    """"exact" | "likely" | "none": the citation's title words contained in the record's title.
    "exact" also needs the author's surname in the record (or, without an author, a title of 4+
    significant words); a match on the main title alone (before ":") is at most "likely"."""
    words = significant_words(cite.title)
    if not words:
        return "none"
    title_words = significant_words(rec.title)
    full = _contained(words, title_words)
    main = _contained(significant_words(cite.title.split(":")[0]), title_words)
    surname = significant_words(cite.surname)
    author_ok = bool(surname) and surname <= significant_words(rec.author)
    if full >= EXACT:
        if (cite.surname and author_ok) or (not cite.surname and len(words) >= MIN_WORDS_WITHOUT_AUTHOR):
            return "exact"
        return "likely"
    if full >= LIKELY or main >= EXACT or (full >= LIKELY_WITH_AUTHOR and author_ok):
        return "likely"
    return "none"



# ---- the tool -------------------------------------------------------------------------

class _SearchFailed(Exception):
    pass


@dataclass
class _Row:
    verdict: str = "Not checked"
    match: str = "timed out"
    location: str = ""
    link: str = ""
    others: List[str] = field(default_factory=list)


_VERDICTS = {"exact": "Yes", "likely": "Likely — check", "none": "No"}


def _cell(text: str) -> str:
    return " ".join(str(text or "").replace("|", "/").split()) or "—"


class CitationTools:
    """check_citations: the whole list in one call; catalog searches in parallel within a budget."""

    def __init__(self, gateway_call: Callable[[str, dict], str], v2: Callable[[], bool],
                 clock: Callable[[], float] = time.monotonic, budget: float = BUDGET_SEC):
        self.gateway_call, self.v2, self.clock, self.budget = gateway_call, v2, clock, budget

    def tool_specs(self) -> List[Dict[str, Any]]:
        if not self.v2():
            return []
        return [{"toolSpec": {
            "name": TOOL_CHECK_CITATIONS,
            "description": ("Check a list of citations (a reading list or bibliography, up to 100) against the "
                            "UVA catalog in one call: searches each by title, then by author, and returns a "
                            "table of whether UVA has it, location and call number, Virgo link and other "
                            "editions or works by the author."),
            "inputSchema": {"json": {"type": "object", "properties": {
                "citations": {"type": "array", "items": {"type": "string"},
                              "description": "One citation per item, as the person wrote it, in their order"},
                "start_number": {"type": "integer", "description": "Number of the first citation (default 1)"},
            }, "required": ["citations"]}},
        }}]

    def handles(self, name: str) -> bool:
        return name == TOOL_CHECK_CITATIONS

    def call(self, name: str, args: Dict[str, Any]) -> str:
        args = args if isinstance(args, dict) else {}
        cites = args.get("citations")
        if not isinstance(cites, list) or not [c for c in cites if isinstance(c, str) and c.strip()]:
            return "Error: give the citations as a list of strings, one per citation."
        cites = [c for c in cites if isinstance(c, str) and c.strip()]
        try:
            start = int(args.get("start_number") or 1)
        except (TypeError, ValueError):
            start = 1
        extra = max(len(cites) - MAX_CITATIONS, 0)
        cites = cites[:MAX_CITATIONS]
        rows = self._check_all([parse_citation(c) for c in cites])
        counts = {v: sum(1 for r in rows if r.verdict == v) for v in ("Yes", "Likely — check", "No", "Not checked")}
        lines = [f"Citation check — {len(cites)} citations: {counts['Yes']} held, {counts['Likely — check']} likely "
                 f"(check), {counts['No']} not found, {counts['Not checked']} not checked", "", HEADER,
                 "| --- | --- | --- | --- | --- | --- | --- |"]
        for i, (text, r) in enumerate(zip(cites, rows)):
            lines.append(f"| {start + i} | {_cell(text)} | {r.verdict} | {r.match} | {_cell(r.location)} | "
                         f"{_cell(r.link)} | {_cell('; '.join(r.others))} |")
        lines += ["", NOTE]
        if extra:
            lines.append(f"{extra} more not checked (limit {MAX_CITATIONS})")
        return "\n".join(lines)

    def _search(self, query: str, field_name: str) -> List[Record]:
        try:
            text = self.gateway_call(SEARCH_TOOL, {"query": query, "field": field_name})
        except Exception as e:  # noqa: BLE001 — one failed search fails one row
            raise _SearchFailed(type(e).__name__) from None
        if not isinstance(text, str) or text.lstrip().startswith(_GATEWAY_ERRORS):
            raise _SearchFailed("gateway error")
        return parse_results(text)

    def _check_one(self, cite: Citation) -> _Row:
        try:
            best, quality = self._best(cite, self._search(cite.title, "title") if cite.title else [])
            others: List[str] = []
            if best is None and cite.surname:
                by_author = self._search(cite.surname, "author")
                best, quality = self._best(cite, by_author)
                if best is None:
                    others = self._other_works(cite, by_author)
        except _SearchFailed:
            return _Row(match="search failed")
        if best is None:
            return _Row(verdict="No", match="none", others=others)
        location = ", ".join(x for x in (best.location or best.library, best.call_number) if x)
        return _Row(verdict=_VERDICTS[quality], match=quality, location=location, link=best.url)

    @staticmethod
    def _other_works(cite: Citation, records: List[Record]) -> List[str]:
        """Up to 2 related works by the same author (an original or translation, another edition)."""
        given = significant_words(cite.given)
        keep = [r for r in records
                if (not given or given <= significant_words(r.author)) and related_titles(cite.title, r.title)]
        return [f"{r.title} ({r.item_id})" if r.item_id else r.title for r in keep[:OTHER_WORKS_MAX]]

    @staticmethod
    def _best(cite: Citation, records: List[Record]):
        graded = [(match(cite, r), r) for r in records]
        for want in ("exact", "likely"):
            for quality, r in graded:
                if quality == want:
                    return r, quality
        return None, "none"

    def _check_all(self, cites: List[Citation]) -> List[_Row]:
        pool = ThreadPoolExecutor(max_workers=WORKERS)
        try:
            futures = [pool.submit(self._check_one, c) for c in cites]
            done, _ = futures_wait(futures, timeout=max(self.budget, 0.0))
            rows = []
            for f in futures:
                if f in done:
                    try:
                        rows.append(f.result())
                    except Exception:  # noqa: BLE001
                        rows.append(_Row(match="search failed"))
                else:
                    rows.append(_Row())
            unchecked = sum(1 for r in rows if r.match == "timed out")
            if unchecked:
                logger.warning("check_citations: %s of %s citations not checked in %ss", unchecked, len(cites),
                               self.budget)
            return rows
        finally:
            pool.shutdown(wait=False, cancel_futures=True)


def citation_tools_for_env(env=None, *, gateway_call=None, v2=None) -> Optional[CitationTools]:
    """The citation check for this turn, or None (switched off with ENABLE_CITATION_CHECK=false, or no gateway)."""
    env = os.environ if env is None else env
    if str(env.get("ENABLE_CITATION_CHECK", "true")).strip().lower() == "false" or gateway_call is None:
        return None
    return CitationTools(gateway_call, v2=v2 or (lambda: True))
