"""
citation_blocks.py — check_citations results as Slack tables.

The tool's markdown table becomes Slack table blocks of TABLE_ROWS rows each; split_messages
sends each in its own message (Slack allows one table per message). Citation and catalog text
goes only into plain-text cells; notes are escaped.
"""

from __future__ import annotations

from typing import Any, Dict, List

from slack_blocks import context_mrkdwn, header_block, parse_markdown_table, table_block

TABLE_ROWS = 25
CITATION_CELL = 120
AUTHOR_CELL = 60
SHOWN = ("#", "Author", "Title", "UVA has it?", "Match", "Location / call number", "Virgo link",
         "Other editions or works by author")  # the full Citation stays in files


def _escape(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def _short(text: str, width: int = CITATION_CELL) -> str:
    return text if len(text) <= width else text[: width - 1].rstrip() + "…"


def _item_id(url: str) -> str:
    return url.rsplit("/items/", 1)[-1] if "/items/" in url else url


def citation_blocks(output: str) -> List[Dict[str, Any]]:
    """Blocks for one check_citations result, or [] (error or nothing to show)."""
    text = (output or "").strip()
    if not text or text.startswith("Error"):
        return []
    head = text.splitlines()[0].strip()
    headers, rows = parse_markdown_table(text)
    if not headers or not rows:
        return []
    cols = [headers.index(h) for h in SHOWN if h in headers]
    shown = []
    for r in rows:
        cells = {h: (r[headers.index(h)] if headers.index(h) < len(r) else "") for h in SHOWN if h in headers}
        if "Author" in cells:
            cells["Author"] = _short(cells["Author"], AUTHOR_CELL)
        for h in ("Title", "Citation", "Other editions or works by author"):
            if h in cells:
                cells[h] = _short(cells[h])
        if "Virgo link" in cells:
            cells["Virgo link"] = _item_id(cells["Virgo link"])
        shown.append([cells[h] for h in SHOWN if h in headers])
    headers = [headers[i] for i in cols]
    blocks: List[Dict[str, Any]] = [{**header_block(head), "block_id": "citations_report"}]
    for n, start in enumerate(range(0, len(shown), TABLE_ROWS), 1):
        table = table_block(headers, shown[start:start + TABLE_ROWS])
        if table:
            blocks.append({**table, "block_id": f"citations_table_{n}"})
    after = text.split(headers[0], 1)[-1]
    notes = [ln.strip() for ln in after.splitlines() if ln.strip() and not ln.strip().startswith("|")]
    if notes:
        blocks.append(context_mrkdwn(_escape("\n".join(notes))))
    return blocks
