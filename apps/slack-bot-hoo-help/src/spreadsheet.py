"""
spreadsheet.py — Excel (.xlsx) attachments for occupancy answers.

Built straight from the occupancy tools' markdown tables (never from the
model's prose), so numbers in the file match the tool output exactly.
app.py attaches the workbook when the user's message asks for Excel /
a spreadsheet / CSV and a table-producing tool ran this turn.
"""

from __future__ import annotations

import io
import re
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, Iterable, List, Optional

from slack_blocks import parse_markdown_table
from tool_names import legacy_leaf
from slack_format import split_markdown_tables

# Tools whose output tables are worth exporting (hours/spaces are not).
# Matomo reports: their tables become files too (collection names are untrusted text: plain cells).
MATOMO_TABLE_TOOLS = frozenset({"matomo_annual_report", "matomo_virgo_collections", "matomo_virgo_items",
                                "matomo_top_pages", "matomo_traffic"})
TABLE_TOOLS = frozenset(
    {"get_traffic_by_period", "get_entrance_traffic", "get_occupancy_report", "check_citations"}
) | MATOMO_TABLE_TOOLS
# Code-built Slack table blocks that may become files later in the thread (never the model's tables).
DATA_BLOCK_PREFIXES = ("data_table", "citations_table", "matomo_")

_WANTS = re.compile(r"(?i)\b(?:excel|spreadsheets?|xlsx|csv)\b")
_NUMBER = re.compile(r"^-?[\d,]+(?:\.\d+)?$")
_PERCENT = re.compile(r"^-?\d+(?:\.\d+)?%$")
_DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
_SHEET_BAD = re.compile(r"[\[\]:*?/\\]")


@dataclass
class SheetTable:
    title: str
    headers: List[str]
    rows: List[List[str]] = field(default_factory=list)
    # True for people's text (Slack listings): cells stay exact strings, never numbers or formulas.
    plain: bool = False
    source: str = ""  # where the rows came from, e.g. "#ai" (RIS notes)


def wants_spreadsheet(user_text: str) -> bool:
    return bool(_WANTS.search(user_text or ""))


def _step_attr(step: Any, key: str) -> Any:
    if isinstance(step, dict):
        return step.get(key)
    return getattr(step, key, None)


def tables_from_steps(steps: Optional[Iterable[Any]]) -> List[SheetTable]:
    tables: List[SheetTable] = []
    for step in steps or []:
        if _step_attr(step, "status") not in (None, "success"):
            continue
        if legacy_leaf(_step_attr(step, "tool_name") or "", _step_attr(step, "input")) not in TABLE_TOOLS:
            continue
        output = str(_step_attr(step, "output") or "")
        leaf = legacy_leaf(_step_attr(step, "tool_name") or "", _step_attr(step, "input"))
        if leaf == "check_citations":
            headers, rows = parse_markdown_table(output)
            if headers and rows:
                # People's text: cells stay exact strings, never numbers or formulas.
                tables.append(SheetTable("Citation check", headers, rows, plain=True))
            continue
        matomo = leaf in MATOMO_TABLE_TOOLS
        title = (output.splitlines() or [""])[0].strip() if matomo else ""
        for line in output.splitlines() if not matomo else []:
            if line.startswith("#"):
                title = line.lstrip("#").strip()
                break
        for kind, chunk in split_markdown_tables(output):
            if kind != "table":
                continue
            headers, rows = parse_markdown_table(chunk)
            if headers and rows:
                if matomo:
                    rows = [[c.replace("`", "") for c in r] for r in rows]
                tables.append(SheetTable(title or "HooHelp data", headers, rows, plain=matomo))
    return tables


def _cell_value(raw: str):
    s = (raw or "").strip().strip("*`")
    if _PERCENT.match(s):
        return float(s[:-1]) / 100, "0.0%"
    if _NUMBER.match(s):
        num = float(s.replace(",", ""))
        return (int(num) if num.is_integer() else num), "#,##0" if num.is_integer() else "#,##0.00"
    if _DATE.match(s):
        return datetime.strptime(s, "%Y-%m-%d"), "yyyy-mm-dd"
    return s, None


def _sheet_name(title: str, used: set) -> str:
    base = _SHEET_BAD.sub("", title.split("(")[0]).strip() or "Data"
    name = base[:31]
    n = 2
    while name in used:
        suffix = f" ({n})"
        name = base[: 31 - len(suffix)] + suffix
        n += 1
    used.add(name)
    return name


def _plain_cell(raw: str) -> str:
    from openpyxl.cell.cell import ILLEGAL_CHARACTERS_RE

    return ILLEGAL_CHARACTERS_RE.sub("", str(raw or ""))


def build_xlsx(tables: List[SheetTable]) -> bytes:
    from openpyxl import Workbook
    from openpyxl.styles import Font
    from openpyxl.utils import get_column_letter

    wb = Workbook()
    wb.remove(wb.active)
    used: set = set()
    for table in tables:
        ws = wb.create_sheet(_sheet_name(table.title, used))
        ws.append([table.title])
        ws["A1"].font = Font(bold=True, size=12)
        ws.append([])
        ws.append(table.headers)
        for cell in ws[3]:
            cell.font = Font(bold=True)
        widths = [len(h) for h in table.headers]
        for row in table.rows:
            values = []
            formats = []
            for raw in row:
                value, fmt = (_plain_cell(raw), None) if table.plain else _cell_value(raw)
                values.append(value)
                formats.append(fmt)
            ws.append(values)
            for cell, fmt in zip(ws[ws.max_row], formats):
                if fmt:
                    cell.number_format = fmt
                if table.plain:
                    cell.data_type = "s"  # "=..." from a Slack message is text, not a formula
            if row and str(row[0]).strip().lower() == "total":
                for cell in ws[ws.max_row]:
                    cell.font = Font(bold=True)
            widths = [max(w, len(str(r))) for w, r in zip(widths, row + [""] * len(widths))]
        for idx, width in enumerate(widths, start=1):
            ws.column_dimensions[get_column_letter(idx)].width = min(max(width + 2, 10), 60)
        ws.freeze_panes = "A4"
    buf = io.BytesIO()
    wb.save(buf)
    return buf.getvalue()


def spreadsheet_filename(tables: List[SheetTable]) -> str:
    title = tables[0].title if tables else "hoohelp-data"
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")[:80] or "hoohelp-data"
    return f"{slug}.xlsx"



def tables_from_blocks(blocks: Iterable[Dict[str, Any]]) -> List[SheetTable]:
    """Tables Hoo Helper's code posted (block_id data_table*, citations_table*, matomo_*), for a file
    asked for later in the thread. Consecutive citations_table blocks (one check split into messages)
    become one table. The model's own tables carry no such id and are never included."""
    tables: List[SheetTable] = []
    title = ""
    last_citations = False
    for b in blocks or []:
        if not isinstance(b, dict):
            continue
        if b.get("type") == "header":
            title = str((b.get("text") or {}).get("text") or "")
            continue
        bid = str(b.get("block_id") or "")
        if b.get("type") != "table" or not bid.startswith(DATA_BLOCK_PREFIXES):
            continue
        rows = [[str(c.get("text") or "") for c in row] for row in b.get("rows") or []]
        if len(rows) < 2:
            continue
        citations = bid.startswith("citations_table")
        if citations and last_citations and tables and tables[-1].headers == rows[0]:
            tables[-1].rows.extend(rows[1:])
        else:
            name = "Citation check" if citations else (title or "HooHelp data")
            tables.append(SheetTable(name, rows[0], rows[1:], plain=not bid.startswith("data_table")))
        if citations and "Virgo link" in rows[0]:
            # The Slack table shows record ids; files get the full Virgo link.
            col = rows[0].index("Virgo link")
            for row in tables[-1].rows:
                if col < len(row) and re.fullmatch(r"[\w.:-]+", row[col] or "") and row[col] != "—":
                    row[col] = f"https://search.lib.virginia.edu/sources/uva_library/items/{row[col]}"
        last_citations = citations
    return tables
