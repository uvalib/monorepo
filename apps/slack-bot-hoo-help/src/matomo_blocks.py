"""
matomo_blocks.py — Block Kit templates for Matomo tool results.

Each Matomo report type gets a fixed layout built by code from the tool's text (tables and up
to two charts), like the occupancy cards in slack_blocks.py, so the numbers shown are the
tool's numbers. Matomo text (collection names, page labels) is untrusted: it only goes into
plain-text table cells, chart labels and headers, never into mrkdwn.
"""

from __future__ import annotations

import logging
import re
from typing import Any, Callable, Dict, List, Optional, Sequence, Tuple

from slack_blocks import (
    _unique_labels, bar_chart, context_mrkdwn, header_block, line_chart, parse_markdown_table,
    section_fields, table_block,
)

logger = logging.getLogger(__name__)

MATOMO_BLOCK_ID = "matomo_report"
CHART_ROWS = 10
TRAFFIC_FIELDS = ("Visits", "Pageviews", "Site searches", "Average visit")
_BULLET = re.compile(r"^-\s+([^:]+):\s*(.*)$")


def _plain(cell: str) -> str:
    """Tool cell text as plain text: no code backticks, entities decoded (raw_text shows it literally)."""
    text = (cell or "").replace("`", "")
    return text.replace("&lt;", "<").replace("&gt;", ">").replace("&amp;", "&").strip() or " "


def _escape(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def _number(cell: str) -> float:
    m = re.search(r"-?\d[\d,]*(?:\.\d+)?", cell or "")
    return float(m.group(0).replace(",", "")) if m else 0.0


def _segments(text: str) -> List[Tuple[str, Any]]:
    """("table", (headers, rows)) and ("text", line) in order."""
    out: List[Tuple[str, Any]] = []
    group: List[str] = []

    def flush() -> None:
        if group:
            headers, rows = parse_markdown_table("\n".join(group))
            if headers:
                out.append(("table", (headers, rows)))
            group.clear()

    for line in text.splitlines():
        if line.strip().startswith("|"):
            group.append(line)
            continue
        flush()
        if line.strip():
            out.append(("text", line.strip()))
    flush()
    return out


def _tables(segs) -> List[Tuple[List[str], List[List[str]]]]:
    return [v for k, v in segs if k == "table"]


def _texts(segs) -> List[str]:
    return [v for k, v in segs if k == "text"]


def _table(headers: Sequence[str], rows: Sequence[Sequence[str]]) -> Optional[Dict[str, Any]]:
    return table_block([_plain(h) for h in headers], [[_plain(c) for c in r] for r in rows])


def _context(lines: Sequence[str]) -> List[Dict[str, Any]]:
    return [context_mrkdwn(_escape("\n".join(lines)))] if lines else []


class _Charts:
    """Hands out at most `budget` charts, each tagged matomo_chart_<n>."""

    def __init__(self, budget: int):
        self.budget, self.n = max(0, budget), 0

    def make(self, kind: str, title: str, series: Sequence[Tuple[str, Sequence[Tuple[str, float]]]],
             **axes) -> Optional[Dict[str, Any]]:
        if self.n >= self.budget or not series or not series[0][1]:
            return None
        # Labels made unique and short here, so long names sharing 20 characters keep their values.
        labels = _unique_labels([lab for lab, _ in series[0][1]])
        rename = {lab: labels[i] for i, (lab, _) in enumerate(series[0][1])}
        fixed = [(name, [(rename.get(lab, lab), val) for lab, val in pts]) for name, pts in series]
        chart = (line_chart if kind == "line" else bar_chart)(title, fixed, **axes)
        if chart is None:
            return None
        self.n += 1
        chart["block_id"] = f"matomo_chart_{self.n}"
        return chart


def _add(blocks: List[Dict[str, Any]], block: Optional[Dict[str, Any]]) -> None:
    if block:
        blocks.append(block)


# ---- report types -------------------------------------------------------------------

def _annual(text: str, charts: _Charts) -> List[Dict[str, Any]]:
    head, _, rest = text.partition("\n")
    sections: Dict[str, List[Tuple[str, Any]]] = {}
    for chunk in ("\n" + rest).split("\n## ")[1:]:
        name, _, body = chunk.partition("\n")
        sections[name.strip()] = _segments(body)
    notes: List[str] = []
    for name in ("Summary", "Monthly visits", "Top collections", "Top records", "Notes"):
        notes += _texts(sections.get(name, []))

    def first_table(name: str):
        t = _tables(sections.get(name, []))
        return t[0] if t else None

    summary, monthly = first_table("Summary"), first_table("Monthly visits")
    colls, records = first_table("Top collections"), first_table("Top records")
    line = bar = None
    if monthly:
        hdr, rows = monthly
        line = charts.make("line", "Monthly visits",
                           [(hdr[i].replace(" visits", ""), [(r[0], _number(r[i])) for r in rows]) for i in (1, 2)],
                           x_label="Month", y_label="Visits")
    if colls:
        hdr, rows = colls
        uva = [r for r in rows if r[-1].strip() == "UVA collection"][:CHART_ROWS]
        if uva:
            bar = charts.make("bar", "Top UVA collections", [("Visits", [(_plain(r[0]), _number(r[1])) for r in uva])],
                              y_label="Visits")
    blocks = [header_block(head.strip())]
    _add(blocks, _table(*summary) if summary else None)
    _add(blocks, line)
    _add(blocks, bar)
    _add(blocks, _table(*colls) if colls else None)
    _add(blocks, _table(*records) if records else None)
    return blocks + _context(notes)


def _traffic(text: str, charts: _Charts) -> List[Dict[str, Any]]:
    head, _, rest = text.partition("\n")
    segs = _segments(rest)
    tables = _tables(segs)
    blocks = [header_block(head.strip())]
    if tables:
        hdr, rows = tables[0]
        wanted = [r for r in rows if r[0] in ("Visits", "Pageviews")]
        _add(blocks, _table(hdr, rows))
        _add(blocks, charts.make("bar", "Visits and pageviews",
                                 [(hdr[i], [(r[0], _number(r[i])) for r in wanted]) for i in (1, 2)]))
        return blocks + _context(_texts(segs))
    pairs = dict(m.groups() for m in (_BULLET.match(t) for t in _texts(segs)) if m)
    fields = [(k, _escape(pairs[k])) for k in TRAFFIC_FIELDS if k in pairs]
    if not fields:
        return []
    return blocks + [section_fields(fields)]


def _page(text: str, charts: _Charts) -> List[Dict[str, Any]]:
    head, _, rest = text.partition("\n")
    pairs = [m.groups() for m in (_BULLET.match(t) for t in _texts(_segments(rest))) if m]
    if not pairs:
        return []
    return [header_block(head.strip()), section_fields([(k, _escape(v)) for k, v in pairs[:5]])]


def _collections(text: str, charts: _Charts) -> List[Dict[str, Any]]:
    head, _, rest = text.partition("\n")
    segs = _segments(rest)
    tables = _tables(segs)
    if not tables:
        return []
    blocks = [header_block(head.strip())]
    hdr, rows = tables[0]
    if hdr and hdr[0] == "Collection":
        _add(blocks, charts.make("bar", "Top collections",
                                 [("Visits", [(_plain(r[0]), _number(r[1])) for r in rows[:CHART_ROWS]])],
                                 y_label="Visits"))
    for t in tables:
        _add(blocks, _table(*t))
    return blocks + _context(_texts(segs))


def _tables_only(text: str, charts: _Charts) -> List[Dict[str, Any]]:
    head, _, rest = text.partition("\n")
    segs = _segments(rest)
    tables = _tables(segs)
    if not tables:
        return []
    blocks = [header_block(head.strip())]
    for t in tables:
        _add(blocks, _table(*t))
    return blocks + _context(_texts(segs))


_RENDERERS: Dict[str, Callable[[str, _Charts], List[Dict[str, Any]]]] = {
    "matomo_annual_report": _annual,
    "matomo_traffic": _traffic,
    "matomo_virgo_collections": _collections,
    "matomo_virgo_items": _tables_only,
    "matomo_top_pages": _tables_only,
    "matomo_page": _page,
}


def matomo_blocks_for_step(tool_name: str, output: str, viz_budget: int) -> List[Dict[str, Any]]:
    """Block Kit for one Matomo tool result, or [] (not a Matomo report, an error, or unparseable)."""
    render = _RENDERERS.get(tool_name or "")
    text = (output or "").strip()
    if render is None or not text or text.startswith("Error"):
        return []
    try:
        blocks = render(text, _Charts(viz_budget))
    except Exception:  # noqa: BLE001 — the model's text answer still stands
        logger.warning("Matomo Block Kit skipped for %s", tool_name, exc_info=True)
        return []
    if blocks:
        blocks[0]["block_id"] = MATOMO_BLOCK_ID
    return blocks
