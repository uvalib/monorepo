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
from typing import List, Optional, Tuple

from spreadsheet import SheetTable, build_xlsx, spreadsheet_filename

_JSON = re.compile(r"(?i)\bjson\b")
_CSV = re.compile(r"(?i)\bcsv\b")
_XLSX = re.compile(r"(?i)\b(?:excel|spreadsheets?|xlsx)\b")
_FORMULA_START = ("=", "+", "-", "@", "\t", "\r")


def file_format(user_text: str) -> Optional[str]:
    """'json' | 'csv' | 'xlsx' when the question asks for a file, else None."""
    text = user_text or ""
    if _JSON.search(text):
        return "json"
    if _CSV.search(text):
        return "csv"
    if _XLSX.search(text):
        return "xlsx"
    return None


def _records(table: SheetTable) -> List[dict]:
    return [dict(zip(table.headers, row)) for row in table.rows]


def _csv_row(table: SheetTable, row: List[str]) -> List[str]:
    if not table.plain:
        return row
    # Excel runs CSV cells that start like a formula; people's text gets a leading quote.
    return ["'" + v if str(v).startswith(_FORMULA_START) else v for v in row]


def build_file(fmt: str, tables: List[SheetTable]) -> Tuple[bytes, str, str]:
    """(content, filename, title) for the requested format."""
    title = tables[0].title if tables else "HooHelp data"
    stem = spreadsheet_filename(tables).rsplit(".", 1)[0]
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
