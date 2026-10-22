"""
attachments.py — the file a question asks for ("as a CSV", "JSON", "in Excel")
built from tables the tools produced (gate counts, Slack channel listings).

Files come from tool data, never from the model's prose, so values match exactly.
"""

from __future__ import annotations

import csv
import io
import json
import re
from typing import Any, Dict, Iterable, List, Optional, Tuple

from spreadsheet import SheetTable, build_xlsx, spreadsheet_filename

_JSON = re.compile(r"(?i)\bjson\b")
_CSV = re.compile(r"(?i)\bcsv\b")
_XLSX = re.compile(r"(?i)\b(?:excel|spreadsheets?|xlsx)\b")
_RIS = re.compile(r"(?i)\b(?:ris|zotero|citation\s+file)\b")
_FORMULA_START = ("=", "+", "-", "@", "\t", "\r")


# A format word that's the subject, not a request: "list the JSON files", "links about Excel".
_TOPIC_BEFORE = re.compile(r"(?i)\b(?:about|regarding|re:?|mentioning|discussing|on how to use)\s+(?:the\s+|an?\s+)?$")
_TOPIC_AFTER = re.compile(r"(?i)^\s*(?:files|documents|docs|schemas?|pars(?:ing|er)|formulas?|macros|tips|tricks|"
                          r"questions|help|workshops?|training|class(?:es)?|sessions?|slides|issues|errors|skills)\b")


def _requested(pattern: "re.Pattern[str]", text: str) -> bool:
    for m in pattern.finditer(text):
        if not (_TOPIC_BEFORE.search(text[: m.start()]) or _TOPIC_AFTER.match(text[m.end():])):
            return True
    return False


def file_format(user_text: str) -> Optional[str]:
    """'ris' | 'json' | 'csv' | 'xlsx' when the question asks for a file, else None."""
    text = user_text or ""
    for fmt, pattern in (("ris", _RIS), ("json", _JSON), ("csv", _CSV), ("xlsx", _XLSX)):
        if _requested(pattern, text):
            return fmt
    return None


FORMAT_NAMES = {"ris": "RIS (Zotero)", "json": "JSON", "csv": "CSV", "xlsx": "Excel"}


def requested_format(user_text: str, history: Optional[Iterable[Dict[str, Any]]] = None) -> Optional[str]:
    """The file this message asks for, else the latest one a person asked for earlier in the thread.

    "as a CSV" … "now all the links ever" still means a CSV.
    """
    fmt = file_format(user_text)
    if fmt:
        return fmt
    for turn in reversed(list(history or [])):
        if turn.get("role") != "user":
            continue
        text = " ".join(str(part.get("text") or "") for part in turn.get("content") or [] if isinstance(part, dict))
        fmt = file_format(text)
        if fmt:
            return fmt
    return None


def file_context_line(fmt: Optional[str]) -> str:
    """One system-prompt line so the model never claims a file that won't come (or denies one that will)."""
    if not fmt:
        return ("No file will be attached to this reply (they haven't asked for one), so don't say one is "
                "attached. For long lists, offer the full list as a CSV, JSON, Excel or RIS (Zotero) file — it won't be "
                "attached unless they ask.")
    if fmt == "ris":
        return ("They want a RIS (Zotero) file: it is attached automatically, built from this turn's citable "
                "results — Virgo catalog searches (one full citation per item) and list_slack_channel links or "
                "files. It holds every catalog item the searches return this turn (up to 50), not a subset you "
                "choose — to narrow it, search more narrowly. Call the tool for the items they want in this turn "
                "(re-run the catalog search for \"those books\"), then say the file is attached and how many "
                "results it covers.")
    return (f"They want a {FORMAT_NAMES[fmt]} file: it is attached automatically, built from this turn's "
            "table tools (list_slack_channel, gate counts). Call the tool for the data they want in this turn, "
            "then say the file is attached.")


def _records(table: SheetTable) -> List[dict]:
    return [dict(zip(table.headers, row)) for row in table.rows]


def _csv_row(table: SheetTable, row: List[str]) -> List[str]:
    if not table.plain:
        return row
    # Excel runs CSV cells that start like a formula; people's text gets a leading quote.
    return ["'" + v if str(v).startswith(_FORMULA_START) else v for v in row]


def _ris_columns(table: SheetTable) -> Optional[Tuple[int, int, Optional[int]]]:
    """(url, title, preview-title) column indexes for tables of links or files, else None."""
    h = table.headers
    if "URL" in h:
        return h.index("URL"), h.index("URL"), (h.index("Title") if "Title" in h else None)
    if "File" in h and "Link" in h:
        return h.index("Link"), h.index("File"), None
    return None


def citable_tables(tables: List[SheetTable]) -> List[SheetTable]:
    """Tables RIS can describe: links or files (gate counts aren't citations)."""
    return [t for t in tables if _ris_columns(t)]


def _ris_line(tag: str, value: str) -> str:
    return f"{tag}  - {' '.join(str(value).split())}"


def build_ris(tables: List[SheetTable]) -> bytes:
    """RIS (Zotero / EndNote import): one ELEC record per link or file, CRLF line endings."""
    lines: List[str] = []
    for table in citable_tables(tables):
        url_i, title_i, preview_i = _ris_columns(table)
        h = table.headers
        for row in table.rows:
            url = row[url_i]
            title = (row[preview_i] if preview_i is not None else "") or row[title_i] or url
            when = row[h.index("Date")] if "Date" in h else ""
            who = row[h.index("Author")] if "Author" in h else ""
            message = row[h.index("Message")] if "Message" in h else ""
            lines.append(_ris_line("TY", "ELEC"))
            lines.append(_ris_line("TI", title))
            lines.append(_ris_line("UR", url))
            if when[:10].count("-") == 2:
                lines.append(_ris_line("DA", when[:10].replace("-", "/")))
            where = f" in {table.source}" if table.source else ""
            note = f"Shared{where} by {who} on {when}".rstrip() + (f". Slack message: {message}" if message else "")
            lines.append(_ris_line("N1", note))
            lines.append("ER  - ")
            lines.append("")
    return "\r\n".join(lines).encode("utf-8")


def build_file(fmt: str, tables: List[SheetTable]) -> Tuple[bytes, str, str]:
    """(content, filename, title) for the requested format."""
    if fmt == "ris":
        tables = citable_tables(tables)
    title = tables[0].title if tables else "HooHelp data"
    stem = spreadsheet_filename(tables).rsplit(".", 1)[0]
    if fmt == "ris":
        return build_ris(tables), f"{stem}.ris", title
    if fmt == "json":
        docs = [{"title": t.title, "rows": _records(t)} for t in tables]
        payload = docs[0] if len(docs) == 1 else docs
        return json.dumps(payload, indent=2, ensure_ascii=False).encode("utf-8"), f"{stem}.json", title
    if fmt == "csv":
        buf = io.StringIO()
        writer = csv.writer(buf)
        for i, table in enumerate(tables):
            if len(tables) > 1:
                if i:
                    writer.writerow([])
                writer.writerow([table.title])
            writer.writerow(table.headers)
            writer.writerows(_csv_row(table, row) for row in table.rows)
        # BOM so Excel opens UTF-8 names correctly
        return buf.getvalue().encode("utf-8-sig"), f"{stem}.csv", title
    return build_xlsx(tables), f"{stem}.xlsx", title
