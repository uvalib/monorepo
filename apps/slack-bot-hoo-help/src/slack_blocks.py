"""
slack_blocks.py — Deterministic Block Kit builders for hours and occupancy.

Tool markdown is parsed here (not by the LLM) so tables and charts stay
faithful to MCP numbers. Slack limits that matter:

- table: 100 rows, 10k chars
- data_visualization: max 2 per message, 20 categories, 20-char labels
- pie: max 12 segments, values > 0
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass, field
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple

logger = logging.getLogger(__name__)

MAX_BLOCKS = 50
MAX_VIZ = 2
MAX_CHART_POINTS = 20
MAX_LABEL = 20
MAX_PIE_SEGMENTS = 12
MAX_TABLE_ROWS = 99  # plus header

_MD_TABLE_SEP = re.compile(r"^\|\s*:?-{3,}")
_HOURS_TITLE = re.compile(r"^###\s+Hours:\s*(.+?)\s*$", re.M)
_HOURS_OFFICIAL = re.compile(
    r"\*\*Official name\*\*[^*]*\*\*(.+?)\*\*", re.I
)
_OCC_TITLE = re.compile(
    r"^#\s+Occupancy Report:\s*(.+?)\s*\(([\d-]+)\s+to\s+([\d-]+)\)",
    re.M,
)
_OCC_TOTAL = re.compile(
    r"Total for building over the period:\s*in\s+([\d,.]+),\s*out\s+([\d,.]+),\s*combined\s+([\d,.]+)",
    re.I,
)
_OCC_AVG = re.compile(
    r"Average occupancy over the period:\s*([\d,.]+)",
    re.I,
)
_OCC_CONF = re.compile(r"Confidence rating:\s*(\w+)", re.I)
_OCC_PEAK_DAY = re.compile(
    r"Peak day:\s*\n\s*([\d-]+):\s*in\s+([\d,.]+),\s*out\s+([\d,.]+),\s*avg occupancy\s+([\d,.]+)",
    re.I,
)
_OCC_PEAK_HOUR = re.compile(
    r"Peak hour[^\n]*\n\s*[\d-]+\s+Hour\s+(\d{1,2}):",
    re.I,
)
_OCC_HOURLY = re.compile(
    r"^\s*Hour\s+(\d{1,2}):\s*in\s+([\d,.]+),\s*out\s+([\d,.]+),\s*avg occupancy\s+([\d,.]+)\s*$",
    re.M | re.I,
)
_FOOT_TITLE = re.compile(r"^###\s+Foot Traffic Summary:\s*(.+?)\s*$", re.M)
_FOOT_RANGE = re.compile(r"\*\*Date Range\*\*:\s*([\d-]+)\s+to\s+([\d-]+)", re.I)
_FOOT_IN = re.compile(r"Total Entries[^*]*\*\*:\s*([\d,.]+)", re.I)
_FOOT_OUT = re.compile(r"Total Exits[^*]*\*\*:\s*([\d,.]+)", re.I)
_FOOT_COMBINED = re.compile(r"Total Combined Activity\*\*:\s*([\d,.]+)", re.I)
_FOOT_AVG = re.compile(r"Average Daily Entries\*\*:\s*([\d,.]+)", re.I)

_LIB_SHORT = {
    "science & engineering": "SEL",
    "science and engineering": "SEL",
    "edgar shannon library": "Shannon",
    "clemons library": "Clemons",
    "fine arts library": "Fine Arts",
    "music library": "Music",
    "harrison institute / small special collections library": "Harrison",
    "harrison/small": "Harrison",
    "robertson media center (rmc)": "RMC",
    "scholars' lab": "Scholars Lab",
    "scholars lab": "Scholars Lab",
}


# ---------------------------------------------------------------------------
# Generic Block Kit atoms
# ---------------------------------------------------------------------------

def header_block(text: str, *, level: int = 2) -> Dict[str, Any]:
    return {
        "type": "header",
        "text": {"type": "plain_text", "text": text[:150], "emoji": True},
        "level": level,
    }


def section_mrkdwn(text: str) -> Dict[str, Any]:
    return {"type": "section", "text": {"type": "mrkdwn", "text": text[:3000]}}


def section_fields(pairs: Sequence[Tuple[str, str]]) -> Dict[str, Any]:
    fields = []
    for label, value in pairs[:5]:
        fields.append({"type": "mrkdwn", "text": f"*{label}*\n{value}"[:2000]})
    return {"type": "section", "fields": fields}


def context_mrkdwn(text: str) -> Dict[str, Any]:
    return {
        "type": "context",
        "elements": [{"type": "mrkdwn", "text": text[:2000]}],
    }


def divider_block() -> Dict[str, Any]:
    return {"type": "divider"}


def _raw_text(text: str) -> Dict[str, Any]:
    return {"type": "raw_text", "text": (text or " ")[:2000] or " "}


def _raw_number(value: float, text: Optional[str] = None) -> Dict[str, Any]:
    return {
        "type": "raw_number",
        "value": float(value),
        "text": text if text is not None else fmt_num(value),
    }


def table_block(
    headers: Sequence[str],
    rows: Sequence[Sequence[Any]],
    *,
    column_settings: Optional[List[Optional[Dict[str, Any]]]] = None,
    numeric_columns: Optional[Sequence[int]] = None,
) -> Optional[Dict[str, Any]]:
    """Build a Slack `table` block. `rows` cells are str or (number, display)."""
    if not headers or not rows:
        return None
    header_row = [_raw_text(str(h)) for h in headers]
    body: List[List[Dict[str, Any]]] = []
    for row in rows[:MAX_TABLE_ROWS]:
        cells: List[Dict[str, Any]] = []
        for cell in row:
            # Slack's message table does not reliably render raw_number cells
            # (they show up blank). Always use raw_text with a display string.
            if isinstance(cell, tuple) and len(cell) == 2:
                cells.append(_raw_text(str(cell[1])))
            else:
                cells.append(_raw_text(str(cell)))
        # Slack requires every row to have the same width
        while len(cells) < len(header_row):
            cells.append(_raw_text(" "))
        body.append(cells[: len(header_row)])
    if not body:
        return None
    block: Dict[str, Any] = {"type": "table", "rows": [header_row] + body}
    if column_settings:
        # Slack rejects JSON null here ("must provide an object") even though
        # the docs mention null to skip a column — use {} instead.
        block["column_settings"] = [
            cs if isinstance(cs, dict) else {} for cs in column_settings
        ]
    return block


def _viz_title(text: str) -> str:
    return (text or "Chart")[:50]


def _label(text: str) -> str:
    s = re.sub(r"\s+", " ", (text or "").strip())
    if len(s) <= MAX_LABEL:
        return s or "—"
    return s[: MAX_LABEL - 1].rstrip() + "…"


def _unique_labels(labels: Sequence[str]) -> List[str]:
    seen: Dict[str, int] = {}
    out: List[str] = []
    for raw in labels:
        base = _label(raw)
        n = seen.get(base, 0) + 1
        seen[base] = n
        if n == 1:
            out.append(base)
            continue
        suffix = f" {n}"
        out.append((base[: MAX_LABEL - len(suffix)] + suffix)[:MAX_LABEL])
    return out


def line_chart(
    title: str,
    series: Sequence[Tuple[str, Sequence[Tuple[str, float]]]],
    *,
    x_label: str = "",
    y_label: str = "",
) -> Optional[Dict[str, Any]]:
    return _xy_chart("line", title, series, x_label=x_label, y_label=y_label)


def bar_chart(
    title: str,
    series: Sequence[Tuple[str, Sequence[Tuple[str, float]]]],
    *,
    x_label: str = "",
    y_label: str = "",
) -> Optional[Dict[str, Any]]:
    return _xy_chart("bar", title, series, x_label=x_label, y_label=y_label)


def _xy_chart(
    kind: str,
    title: str,
    series: Sequence[Tuple[str, Sequence[Tuple[str, float]]]],
    *,
    x_label: str = "",
    y_label: str = "",
) -> Optional[Dict[str, Any]]:
    if not series:
        return None
    categories = _unique_labels([lab for lab, _ in series[0][1][:MAX_CHART_POINTS]])
    if len(categories) < 1:
        return None
    built = []
    used_names: set = set()
    for name, points in series[:12]:
        sname = _label(name)
        if sname in used_names:
            sname = _label(f"{name} 2")
        used_names.add(sname)
        by_label = {_label(lab): float(val) for lab, val in points}
        data = []
        for cat in categories:
            data.append({"label": cat, "value": float(by_label.get(cat, 0.0))})
        if len(data) < 1:
            continue
        built.append({"name": sname, "data": data})
    if not built:
        return None
    chart: Dict[str, Any] = {
        "type": kind,
        "series": built,
        "axis_config": {"categories": categories},
    }
    if x_label:
        chart["axis_config"]["x_label"] = x_label[:50]
    if y_label:
        chart["axis_config"]["y_label"] = y_label[:50]
    return {
        "type": "data_visualization",
        "title": _viz_title(title),
        "chart": chart,
    }


def pie_chart(title: str, segments: Sequence[Tuple[str, float]]) -> Optional[Dict[str, Any]]:
    cleaned = [(lab, float(val)) for lab, val in segments if float(val) > 0]
    if len(cleaned) < 2:
        return None
    if len(cleaned) > MAX_PIE_SEGMENTS:
        head = cleaned[: MAX_PIE_SEGMENTS - 1]
        rest = sum(v for _, v in cleaned[MAX_PIE_SEGMENTS - 1 :])
        cleaned = head + ([("Other", rest)] if rest > 0 else head)
    labels = _unique_labels([lab for lab, _ in cleaned])
    segs = [
        {"label": labels[i], "value": float(cleaned[i][1])}
        for i in range(len(cleaned))
    ]
    return {
        "type": "data_visualization",
        "title": _viz_title(title),
        "chart": {"type": "pie", "segments": segs},
    }


# ---------------------------------------------------------------------------
# Formatting helpers
# ---------------------------------------------------------------------------

def fmt_num(value: float) -> str:
    try:
        n = float(value)
    except (TypeError, ValueError):
        return str(value)
    if abs(n - round(n)) < 0.05:
        return f"{int(round(n)):,}"
    return f"{n:,.1f}"


def _parse_num(raw: str) -> float:
    return float(str(raw).replace(",", "").strip())


def hour_label(hour: int) -> str:
    h = int(hour) % 24
    if h == 0:
        return "12am"
    if h < 12:
        return f"{h}am"
    if h == 12:
        return "12pm"
    return f"{h - 12}pm"


def short_library(name: str) -> str:
    key = (name or "").strip().lower()
    if key in _LIB_SHORT:
        return _LIB_SHORT[key]
    return _label(name)


_DOOR_FILLER = re.compile(r"(?i)\b(camera|cam|floor|fl\.?|entrance)\b")


def short_doorway(name: str) -> str:
    """Fit a sensor/door name into Slack's 20-char chart label."""
    s = re.sub(r"\s+", " ", (name or "").strip())
    if not s:
        return "—"
    if re.match(r"^(axis|fiskekimball)\b", s, re.I):
        return _label(s.split("-", 1)[0])
    m = re.match(r"^([A-Za-z0-9]+)\s*[-–]?\s*(.*)$", s)
    if not m:
        return _label(s)
    code, rest = m.group(1), m.group(2)
    rest = _DOOR_FILLER.sub(" ", rest)
    rest = re.sub(r"[-,/]+", " ", rest)
    rest = re.sub(r"\s+", " ", rest).strip()
    extra = " ".join(rest.split()[:2])
    return _label(f"{code} {extra}".strip())


def tool_leaf(name: str) -> str:
    if not name:
        return ""
    return name.split("___")[-1].strip()


def parse_markdown_table(text: str) -> Tuple[List[str], List[List[str]]]:
    """First GitHub-style markdown table in `text` → (headers, rows)."""
    if not text or "|" not in text:
        return [], []
    lines = []
    started = False
    for line in text.splitlines():
        s = line.strip()
        if s.startswith("|"):
            started = True
            lines.append(s)
        elif started:
            break
    if len(lines) < 2:
        return [], []
    def split_row(line: str) -> List[str]:
        parts = [p.strip() for p in line.strip().strip("|").split("|")]
        return parts

    header = split_row(lines[0])
    rows: List[List[str]] = []
    for line in lines[1:]:
        if _MD_TABLE_SEP.match(line.replace(" ", "")) or set(line.replace("|", "").strip()) <= set("-: "):
            continue
        row = split_row(line)
        if len(row) < len(header):
            row = row + [""] * (len(header) - len(row))
        rows.append(row[: len(header)])
    return header, rows


# ---------------------------------------------------------------------------
# Hours
# ---------------------------------------------------------------------------

@dataclass
class HoursSchedule:
    title: str
    official_name: str
    rows: List[Tuple[str, str, str]] = field(default_factory=list)


def parse_hours(output: str) -> Optional[HoursSchedule]:
    if not output or "Hours:" not in output:
        return None
    title_m = _HOURS_TITLE.search(output)
    title = (title_m.group(1).strip() if title_m else "Library hours")
    official_m = _HOURS_OFFICIAL.search(output)
    official = official_m.group(1).strip() if official_m else title
    headers, rows = parse_markdown_table(output)
    if not rows:
        return None
    # Expect Date | Day | Hours
    parsed: List[Tuple[str, str, str]] = []
    for row in rows:
        date = row[0] if len(row) > 0 else ""
        day = row[1] if len(row) > 1 else ""
        hours = row[2] if len(row) > 2 else ""
        if date or hours:
            parsed.append((date, day, hours))
    if not parsed:
        return None
    return HoursSchedule(title=title, official_name=official, rows=parsed)


def hours_blocks(schedule: HoursSchedule) -> List[Dict[str, Any]]:
    name = schedule.official_name or schedule.title
    heading = f"{name} hours" if not name.lower().endswith("hours") else name
    table = table_block(
        ["Date", "Day", "Hours"],
        [(d, day, hrs) for d, day, hrs in schedule.rows],
        column_settings=[
            {},
            {},
            {"is_wrapped": True},
        ],
    )
    blocks: List[Dict[str, Any]] = [header_block(heading)]
    if table:
        blocks.append(table)
    blocks.append(context_mrkdwn("Source: LibCal published hours"))
    return blocks


def hours_mrkdwn(schedule: HoursSchedule) -> str:
    """Plain Slack mrkdwn list so hours survive if the table block is rejected."""
    name = schedule.official_name or schedule.title
    lines = [f"*{name}*"]
    for date, day, hrs in schedule.rows:
        label = ", ".join(p for p in (day, date) if p)
        lines.append(f"• *{label}* — {hrs}")
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Occupancy / foot traffic
# ---------------------------------------------------------------------------

@dataclass
class HourlyPoint:
    hour: int
    entries: float
    exits: float
    occupancy: float


@dataclass
class DoorwayRow:
    name: str
    entries: float
    exits: float
    combined: float
    pct: Optional[float] = None


@dataclass
class OccupancyReport:
    library: str
    start_date: str = ""
    end_date: str = ""
    total_in: Optional[float] = None
    total_out: Optional[float] = None
    total_combined: Optional[float] = None
    avg_occupancy: Optional[float] = None
    confidence: Optional[str] = None
    peak_day: Optional[str] = None
    peak_hour: Optional[int] = None
    hourly: List[HourlyPoint] = field(default_factory=list)
    doorways: List[DoorwayRow] = field(default_factory=list)


@dataclass
class FootTraffic:
    library: str
    start_date: str = ""
    end_date: str = ""
    entries: Optional[float] = None
    exits: Optional[float] = None
    combined: Optional[float] = None
    avg_daily_entries: Optional[float] = None


def parse_occupancy(output: str) -> Optional[OccupancyReport]:
    if not output or "Occupancy Report:" not in output:
        return None
    title_m = _OCC_TITLE.search(output)
    library = title_m.group(1).strip() if title_m else "Library"
    start = title_m.group(2) if title_m else ""
    end = title_m.group(3) if title_m else ""
    report = OccupancyReport(library=library, start_date=start, end_date=end)
    tot = _OCC_TOTAL.search(output)
    if tot:
        report.total_in = _parse_num(tot.group(1))
        report.total_out = _parse_num(tot.group(2))
        report.total_combined = _parse_num(tot.group(3))
    avg = _OCC_AVG.search(output)
    if avg:
        report.avg_occupancy = _parse_num(avg.group(1))
    conf = _OCC_CONF.search(output)
    if conf:
        report.confidence = conf.group(1)
    peak_day = _OCC_PEAK_DAY.search(output)
    if peak_day:
        report.peak_day = peak_day.group(1)
    peak_hour = _OCC_PEAK_HOUR.search(output)
    if peak_hour:
        report.peak_hour = int(peak_hour.group(1))
    for m in _OCC_HOURLY.finditer(output):
        report.hourly.append(
            HourlyPoint(
                hour=int(m.group(1)),
                entries=_parse_num(m.group(2)),
                exits=_parse_num(m.group(3)),
                occupancy=_parse_num(m.group(4)),
            )
        )
    if "Entrance & doorway" in output or "doorway breakdown" in output.lower():
        # Parse the doorway markdown table (not the hours-style Date/Day table)
        idx = output.lower().find("entrance")
        chunk = output[idx:] if idx >= 0 else output
        headers, rows = parse_markdown_table(chunk)
        header_l = [h.lower() for h in headers]
        if rows and any("entrance" in h or "point" in h for h in header_l):
            for row in rows:
                name = row[0]
                try:
                    entries = _parse_num(row[1]) if len(row) > 1 else 0.0
                    exits = _parse_num(row[2]) if len(row) > 2 else 0.0
                    combined = _parse_num(row[3]) if len(row) > 3 else entries + exits
                except ValueError:
                    continue
                pct = None
                if len(row) > 4:
                    try:
                        pct = _parse_num(row[4].replace("%", ""))
                    except ValueError:
                        pct = None
                report.doorways.append(
                    DoorwayRow(
                        name=name,
                        entries=entries,
                        exits=exits,
                        combined=combined,
                        pct=pct,
                    )
                )
    if not report.hourly and report.total_in is None and not report.doorways:
        return None
    return report


def parse_foot_traffic(output: str) -> Optional[FootTraffic]:
    if not output or "Foot Traffic Summary" not in output:
        return None
    title_m = _FOOT_TITLE.search(output)
    ft = FootTraffic(library=(title_m.group(1).strip() if title_m else "Library"))
    rng = _FOOT_RANGE.search(output)
    if rng:
        ft.start_date, ft.end_date = rng.group(1), rng.group(2)
    m_in = _FOOT_IN.search(output)
    if m_in:
        ft.entries = _parse_num(m_in.group(1))
    m_out = _FOOT_OUT.search(output)
    if m_out:
        ft.exits = _parse_num(m_out.group(1))
    m_c = _FOOT_COMBINED.search(output)
    if m_c:
        ft.combined = _parse_num(m_c.group(1))
    m_avg = _FOOT_AVG.search(output)
    if m_avg:
        ft.avg_daily_entries = _parse_num(m_avg.group(1))
    if ft.entries is None and ft.combined is None:
        return None
    return ft


def _hourly_capped(points: Sequence[HourlyPoint]) -> List[HourlyPoint]:
    pts = list(points)
    if len(pts) <= MAX_CHART_POINTS:
        return pts
    # Prefer hours with traffic; keep chronological order
    ranked = sorted(pts, key=lambda p: -(p.entries + p.exits + p.occupancy))
    keep = {id(p) for p in ranked[:MAX_CHART_POINTS]}
    return [p for p in pts if id(p) in keep][:MAX_CHART_POINTS]


def _occupancy_range_label(report: OccupancyReport) -> str:
    if report.start_date and report.end_date and report.start_date != report.end_date:
        return f"{report.start_date}–{report.end_date}"
    return report.start_date or ""


def _traffic_total(report: OccupancyReport) -> float:
    return float(report.total_in or 0) + float(report.total_out or 0)


def occupancy_is_meaningful(
    avg_occupancy: Optional[float],
    *,
    hourly: Sequence[HourlyPoint] = (),
    traffic: float = 0.0,
) -> bool:
    """True when occupancy is a people-count, not a ~0 residual after a bad detrend."""
    max_hourly = max((p.occupancy for p in hourly), default=0.0)
    peak = max(float(avg_occupancy or 0.0), float(max_hourly))
    if peak >= 1.0:
        return True
    # Genuinely empty (no traffic) — 0 occupancy is honest.
    return peak <= 0.0 and traffic < 20


def occupancy_takeaway(report: OccupancyReport) -> str:
    """One- or two-sentence Slack mrkdwn summary (no dump of the tool report)."""
    rng = _occupancy_range_label(report)
    head = f"*{report.library}*"
    if rng:
        head += f" ({rng})"
    bits = []
    traffic = _traffic_total(report)
    show_occ = occupancy_is_meaningful(
        report.avg_occupancy, hourly=report.hourly, traffic=traffic
    )
    if report.avg_occupancy is not None and show_occ:
        bits.append(f"avg occupancy *{fmt_num(report.avg_occupancy)}*")
    if report.total_in is not None:
        bits.append(f"*{fmt_num(report.total_in)}* entries")
    if report.total_out is not None:
        bits.append(f"*{fmt_num(report.total_out)}* exits")
    sentence = f"{head}: " + ", ".join(bits) + "." if bits else f"{head}."
    extra = []
    if report.peak_day:
        pk = f"Peak *{report.peak_day}*"
        if report.peak_hour is not None:
            pk += f" at {hour_label(report.peak_hour)}"
        extra.append(pk)
    if report.confidence:
        extra.append(f"confidence *{report.confidence}*")
    if extra:
        sentence += " " + "; ".join(extra) + "."
    return sentence


def occupancy_blocks(
    reports: Sequence[OccupancyReport],
    *,
    viz_budget: int = MAX_VIZ,
) -> List[Dict[str, Any]]:
    if not reports:
        return []
    if len(reports) == 1:
        return _occupancy_single(reports[0], viz_budget=viz_budget)
    return _occupancy_compare(reports, viz_budget=viz_budget)


def _occupancy_single(report: OccupancyReport, *, viz_budget: int) -> List[Dict[str, Any]]:
    lib = report.library
    short = short_library(lib)
    rng = _occupancy_range_label(report)
    heading = f"{lib} occupancy" + (f" · {rng}" if rng else "")
    blocks: List[Dict[str, Any]] = [header_block(heading)]
    blocks.append(section_mrkdwn(occupancy_takeaway(report)))

    fields: List[Tuple[str, str]] = []
    if report.total_in is not None:
        fields.append(("Entries", fmt_num(report.total_in)))
    if report.total_out is not None:
        fields.append(("Exits", fmt_num(report.total_out)))
    traffic = _traffic_total(report)
    show_occ = occupancy_is_meaningful(
        report.avg_occupancy, hourly=report.hourly, traffic=traffic
    )
    if report.avg_occupancy is not None and show_occ:
        fields.append(("Avg occupancy", fmt_num(report.avg_occupancy)))
    if report.confidence:
        fields.append(("Confidence", report.confidence))
    if fields:
        blocks.append(section_fields(fields))

    viz_used = 0
    hourly = _hourly_capped(report.hourly)
    has_occ = occupancy_is_meaningful(
        report.avg_occupancy, hourly=hourly, traffic=traffic
    ) and max((p.occupancy for p in hourly), default=0.0) >= 1.0
    if viz_used < viz_budget and len(hourly) >= 2 and has_occ:
        chart = line_chart(
            f"{short} hourly occupancy"[:50],
            [("Occupancy", [(hour_label(p.hour), p.occupancy) for p in hourly])],
            x_label="Hour",
            y_label="People",
        )
        if chart:
            blocks.append(chart)
            viz_used += 1
    elif viz_used < viz_budget and len(hourly) >= 2:
        chart = bar_chart(
            f"{short} hourly entries"[:50],
            [("Entries", [(hour_label(p.hour), p.entries) for p in hourly])],
            x_label="Hour",
            y_label="Entries",
        )
        if chart:
            blocks.append(chart)
            viz_used += 1

    doorways = [d for d in report.doorways if d.combined > 0]
    ranked = sorted(doorways, key=lambda d: -d.combined)
    if viz_used < viz_budget and len(ranked) >= 2:
        top_n = min(6, MAX_PIE_SEGMENTS - 1)
        top = ranked[:top_n]
        rest = sum(d.combined for d in ranked[top_n:])
        segs = [(short_doorway(d.name), d.combined) for d in top]
        if rest > 0:
            segs.append(("Other", rest))
        pie = pie_chart(f"{short} traffic by door"[:50], segs)
        if pie:
            blocks.append(pie)
            viz_used += 1

    # Chart already shows the hourly pattern — table is doorway only, top doors.
    if ranked:
        shown = ranked[:8]
        table = table_block(
            ["Entrance", "In", "Out", "%"],
            [
                (
                    short_doorway(d.name),
                    fmt_num(d.entries),
                    fmt_num(d.exits),
                    f"{d.pct:.1f}%" if d.pct is not None else " ",
                )
                for d in shown
            ],
            column_settings=[
                {"is_wrapped": True},
                {"align": "right"},
                {"align": "right"},
                {"align": "right"},
            ],
        )
        if table:
            blocks.append(table)

    notes = []
    if report.confidence and report.confidence.lower() != "high":
        notes.append(f"Confidence: {report.confidence}")
    if not show_occ and traffic >= 20:
        notes.append("Occupancy estimate omitted (in/out counts don't support a people-in-building figure)")
    notes.append("Sensors: Clemons, Shannon, SEL, Music, Fine Arts — not RMC or Scholars' Lab")
    blocks.append(context_mrkdwn(" · ".join(notes)))
    return blocks


def _occupancy_compare(
    reports: Sequence[OccupancyReport], *, viz_budget: int
) -> List[Dict[str, Any]]:
    blocks: List[Dict[str, Any]] = [header_block("Occupancy comparison")]
    rows = []
    for r in reports:
        rows.append(
            (
                r.library,
                (r.total_in or 0, fmt_num(r.total_in or 0)),
                (r.total_out or 0, fmt_num(r.total_out or 0)),
                (r.total_combined or 0, fmt_num(r.total_combined or 0)),
                (r.avg_occupancy or 0, fmt_num(r.avg_occupancy or 0)),
                r.confidence or "—",
            )
        )
    table = table_block(
        ["Library", "In", "Out", "Combined", "Avg occ.", "Conf."],
        rows,
        column_settings=[
            {"is_wrapped": True},
            {"align": "right"},
            {"align": "right"},
            {"align": "right"},
            {"align": "right"},
            {},
        ],
        numeric_columns=(1, 2, 3, 4),
    )
    if table:
        blocks.append(table)

    viz_used = 0
    if viz_used < viz_budget and len(reports) >= 2:
        series = [
            (
                "Entries",
                [(short_library(r.library), float(r.total_in or 0)) for r in reports],
            )
        ]
        chart = bar_chart("Entries by library", series, x_label="Library", y_label="Entries")
        if chart:
            blocks.append(chart)
            viz_used += 1
    if viz_used < viz_budget and any(
        occupancy_is_meaningful(r.avg_occupancy, hourly=r.hourly, traffic=_traffic_total(r))
        and (r.avg_occupancy or 0) >= 1
        for r in reports
    ):
        series = [
            (
                "Avg occupancy",
                [
                    (short_library(r.library), float(r.avg_occupancy or 0))
                    for r in reports
                ],
            )
        ]
        chart = bar_chart(
            "Average occupancy", series, x_label="Library", y_label="People"
        )
        if chart:
            blocks.append(chart)
            viz_used += 1
    blocks.append(
        context_mrkdwn(
            "Sensors: Clemons, Shannon, SEL, Music, Fine Arts — not RMC or Scholars' Lab"
        )
    )
    return blocks


def foot_traffic_blocks(
    summaries: Sequence[FootTraffic], *, viz_budget: int = MAX_VIZ
) -> List[Dict[str, Any]]:
    if not summaries:
        return []
    if len(summaries) == 1:
        ft = summaries[0]
        rng = ""
        if ft.start_date and ft.end_date:
            rng = f" · {ft.start_date}–{ft.end_date}"
        blocks: List[Dict[str, Any]] = [header_block(f"{ft.library} foot traffic{rng}")]
        fields: List[Tuple[str, str]] = []
        if ft.entries is not None:
            fields.append(("Entries", fmt_num(ft.entries)))
        if ft.exits is not None:
            fields.append(("Exits", fmt_num(ft.exits)))
        if ft.combined is not None:
            fields.append(("Combined", fmt_num(ft.combined)))
        if ft.avg_daily_entries is not None:
            fields.append(("Avg daily entries", fmt_num(ft.avg_daily_entries)))
        if fields:
            blocks.append(section_fields(fields))
        return blocks

    blocks = [header_block("Foot traffic comparison")]
    rows = []
    for ft in summaries:
        rows.append(
            (
                ft.library,
                (ft.entries or 0, fmt_num(ft.entries or 0)),
                (ft.exits or 0, fmt_num(ft.exits or 0)),
                (ft.combined or 0, fmt_num(ft.combined or 0)),
                (ft.avg_daily_entries or 0, fmt_num(ft.avg_daily_entries or 0)),
            )
        )
    table = table_block(
        ["Library", "In", "Out", "Combined", "Avg daily in"],
        rows,
        column_settings=[
            {"is_wrapped": True},
            {"align": "right"},
            {"align": "right"},
            {"align": "right"},
            {"align": "right"},
        ],
        numeric_columns=(1, 2, 3, 4),
    )
    if table:
        blocks.append(table)
    if viz_budget > 0:
        chart = bar_chart(
            "Entries by library",
            [
                (
                    "Entries",
                    [
                        (short_library(ft.library), float(ft.entries or 0))
                        for ft in summaries
                    ],
                )
            ],
            x_label="Library",
            y_label="Entries",
        )
        if chart:
            blocks.append(chart)
    return blocks


# ---------------------------------------------------------------------------
# Compose from agent tool steps
# ---------------------------------------------------------------------------

def _step_attr(step: Any, key: str, default: Any = None) -> Any:
    if hasattr(step, key):
        return getattr(step, key)
    if isinstance(step, dict):
        return step.get(key, default)
    return default


def _usable_output(step: Any) -> Optional[str]:
    status = (_step_attr(step, "status") or "success") or "success"
    if str(status).lower() not in ("success", "ok"):
        return None
    out = _step_attr(step, "output") or ""
    text = str(out).strip()
    if not text:
        return None
    if text.lower().startswith("error") or text.lower().startswith("tool error"):
        return None
    return text


_IIIF_HIT = re.compile(
    r"https://iiif\.lib\.virginia\.edu/iiif/[^\s|>\]\)\"']+",
    re.I,
)
_VIRGO_HIT = re.compile(
    r"https://search\.lib\.virginia\.edu/[^\s|>\]\)\"']+",
    re.I,
)


def parse_image_hits(output: str) -> List[Dict[str, str]]:
    """Pull title / collection / IIIF / Virgo records from image-KB tool markdown."""
    if not output or "iiif.lib.virginia.edu/iiif/" not in output.lower():
        return []
    hits: List[Dict[str, str]] = []
    pending_title = ""
    pending_collection = ""
    pending_virgo = ""
    for line in output.splitlines():
        hm = re.match(r"^##\s+Image\s+\d+:\s*(.+?)\s*$", line.strip(), re.I)
        if hm:
            pending_title = hm.group(1).strip()
        tm = re.search(r"\*\*Title\*\*:\s*(.+)$", line, re.I)
        if tm:
            pending_title = tm.group(1).strip()
        cm = re.search(r"\*\*Collection\*\*:\s*(.+)$", line, re.I)
        if cm:
            pending_collection = cm.group(1).strip()
        vm = _VIRGO_HIT.search(line)
        if vm:
            vurl = vm.group(0).rstrip(".,);>")
            if hits and not hits[-1].get("virgo"):
                hits[-1]["virgo"] = vurl
            else:
                pending_virgo = vurl
        for url in _IIIF_HIT.findall(line):
            url = url.rstrip(".,);>")
            if "..." in url or "/iiif/" not in url:
                continue
            hits.append(
                {
                    "title": pending_title or "Library image",
                    "collection": pending_collection,
                    "image_url": url,
                    "virgo": pending_virgo,
                }
            )
            pending_title = ""
            pending_collection = ""
            pending_virgo = ""
    seen = set()
    unique: List[Dict[str, str]] = []
    for h in hits:
        if h["image_url"] not in seen:
            seen.add(h["image_url"])
            unique.append(h)
    return unique[:8]


def image_blocks(
    hits: Sequence[Dict[str, str]],
    *,
    exclude_urls: Optional[Iterable[str]] = None,
) -> List[Dict[str, Any]]:
    """Carousel of cards (or a single card) with IIIF hero images."""
    skip = {u for u in (exclude_urls or []) if u}
    cards: List[Dict[str, Any]] = []
    for h in hits:
        url = h.get("image_url") or ""
        if not url.startswith("https://") or "..." in url:
            continue
        if url in skip or any(url.startswith(s.rstrip("/") ) for s in skip):
            continue
        # Same IIIF object, maybe different size request
        ident = url.split("/iiif/")[-1].split("/")[0] if "/iiif/" in url else ""
        if ident and any(ident in s for s in skip):
            continue
        if len(cards) >= 4:
            break
        title = (h.get("title") or "Library image")[:150]
        card: Dict[str, Any] = {
            "type": "card",
            "title": {"type": "mrkdwn", "text": title, "verbatim": False},
            "hero_image": {
                "type": "image",
                "image_url": url[:3000],
                "alt_text": title[:2000],
            },
        }
        coll = (h.get("collection") or "").strip()
        if coll:
            card["subtitle"] = {
                "type": "mrkdwn",
                "text": coll[:150],
                "verbatim": False,
            }
        virgo = h.get("virgo") or ""
        if virgo.startswith("https://"):
            card["actions"] = [
                {
                    "type": "button",
                    "text": {"type": "plain_text", "text": "View in Virgo", "emoji": True},
                    "url": virgo[:3000],
                }
            ]
        cards.append(card)
    if not cards:
        return []
    if len(cards) == 1:
        return cards
    return [{"type": "carousel", "elements": cards}]


def flatten_carousels(blocks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Replace carousel/card blocks with classic image blocks if Slack rejects carousel."""
    out: List[Dict[str, Any]] = []
    for b in blocks:
        btype = b.get("type")
        cards = []
        if btype == "carousel":
            cards = list(b.get("elements") or [])
        elif btype == "card":
            cards = [b]
        else:
            out.append(b)
            continue
        for card in cards:
            if not isinstance(card, dict):
                continue
            hero = card.get("hero_image") or {}
            url = hero.get("image_url") or ""
            title = ""
            t = card.get("title")
            if isinstance(t, dict):
                title = str(t.get("text") or "")
            elif isinstance(t, str):
                title = t
            title = title or "Library image"
            if url.startswith("https://"):
                out.append(
                    {
                        "type": "image",
                        "image_url": url[:3000],
                        "alt_text": title[:2000],
                        "title": {
                            "type": "plain_text",
                            "text": title[:2000],
                            "emoji": True,
                        },
                    }
                )
            actions = card.get("actions") or []
            if actions:
                out.append({"type": "actions", "elements": actions[:5]})
    return out[:MAX_BLOCKS]


def blocks_from_tool_steps(
    steps: Optional[Iterable[Any]],
    *,
    exclude_image_urls: Optional[Iterable[str]] = None,
) -> List[Dict[str, Any]]:
    """Turn hours / occupancy / foot-traffic / image tool outputs into Block Kit."""
    if not steps:
        return []
    hours: List[HoursSchedule] = []
    occupancy: List[OccupancyReport] = []
    foot: List[FootTraffic] = []
    image_pages: List[List[Dict[str, str]]] = []
    for step in steps:
        name = tool_leaf(_step_attr(step, "tool_name") or "")
        text = _usable_output(step)
        if not text:
            continue
        try:
            if name == "get_library_hours":
                parsed = parse_hours(text)
                if parsed:
                    hours.append(parsed)
            elif name == "get_occupancy_report":
                parsed_o = parse_occupancy(text)
                if parsed_o:
                    occupancy.append(parsed_o)
            elif name == "get_foot_traffic":
                parsed_f = parse_foot_traffic(text)
                if parsed_f:
                    foot.append(parsed_f)
            elif "image" in name:
                hits = parse_image_hits(text)
                if hits:
                    image_pages.append(hits)
        except Exception:
            logger.warning("Failed to parse %s tool output for Block Kit", name, exc_info=True)

    skip = {u for u in (exclude_image_urls or []) if u}

    def _unseen(hits: List[Dict[str, str]]) -> List[Dict[str, str]]:
        out: List[Dict[str, str]] = []
        for h in hits:
            url = h.get("image_url") or ""
            ident = url.split("/iiif/")[-1].split("/")[0] if "/iiif/" in url else ""
            if url in skip or (ident and any(ident in s for s in skip)):
                continue
            out.append(h)
        return out

    images: List[Dict[str, str]] = []
    for hits in image_pages:
        if _unseen(hits):
            images = hits
            break
    if not images and image_pages:
        images = image_pages[-1]

    blocks: List[Dict[str, Any]] = []
    for schedule in hours:
        if blocks:
            blocks.append(divider_block())
        blocks.extend(hours_blocks(schedule))

    viz_left = MAX_VIZ
    if occupancy:
        if blocks:
            blocks.append(divider_block())
        occ_blocks = occupancy_blocks(occupancy, viz_budget=viz_left)
        viz_left -= sum(1 for b in occ_blocks if b.get("type") == "data_visualization")
        blocks.extend(occ_blocks)
    elif foot:
        if blocks:
            blocks.append(divider_block())
        blocks.extend(foot_traffic_blocks(foot, viz_budget=max(0, viz_left)))

    if images:
        if blocks:
            blocks.append(divider_block())
        blocks.extend(image_blocks(images, exclude_urls=exclude_image_urls))

    return blocks[:MAX_BLOCKS]


def tool_fallback_text(steps: Optional[Iterable[Any]]) -> str:
    """Hours / occupancy as mrkdwn for chat.postMessage text= / send fallback."""
    if not steps:
        return ""
    parts: List[str] = []
    occ: List[OccupancyReport] = []
    for step in steps:
        name = tool_leaf(_step_attr(step, "tool_name") or "")
        text = _usable_output(step)
        if not text:
            continue
        if name == "get_library_hours":
            parsed = parse_hours(text)
            if parsed:
                parts.append(hours_mrkdwn(parsed))
        elif name == "get_occupancy_report":
            parsed_o = parse_occupancy(text)
            if parsed_o:
                occ.append(parsed_o)
    if len(occ) == 1:
        parts.append(occupancy_takeaway(occ[0]))
    elif occ:
        bits = [
            f"*{r.library}* {fmt_num(r.total_in or 0)} in, avg {fmt_num(r.avg_occupancy or 0)}"
            for r in occ
        ]
        parts.append("Occupancy: " + "; ".join(bits) + ".")
    return "\n\n".join(parts)
