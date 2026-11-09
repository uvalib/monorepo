"""
citation_check.py — check a whole citation list against the Virgo catalog in one tool call.

The model passes the list; code searches (title, then author), decides each match and writes
the table, so every verdict, call number and link comes from a catalog result. (2026-11-09: a
55-citation check done by the model in batches stopped at the step limit, and "yes, continue"
batches were answered from memory with invented holdings.)
"""

from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass
from typing import List, Set

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
    surname = ""
    if author:
        surname = author.split(",")[0].strip() if "," in author else author.split()[-1]
    return Citation(text=text, author=author, surname=surname, title=_clean_title(title), year=year)


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
