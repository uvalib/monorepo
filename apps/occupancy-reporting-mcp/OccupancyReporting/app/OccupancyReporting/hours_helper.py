# hours_helper.py
"""
LibCal hours integration — per-library calendars.

Each occupancy location has its own LibCal location id (from Drupal
field_libcal_id). Using a single calendar for all buildings was wrong:
e.g. Music/Fine Arts close Saturdays while Clemons stays open late.
"""

from __future__ import annotations

import os
from datetime import datetime, timedelta, time

import requests

# Global cache: (libcal_lid, date_str) -> list[(start, end)]
_hours_cache: dict[tuple[int, str], list[tuple[time, time]]] = {}

# Drupal / LibCal mapping for UVA Library locations with building hours.
# Source: https://www.library.virginia.edu/jsonapi/node/library (field_libcal_id).
# Occupancy cameras only exist for a subset (see OCCUPANCY_LIBRARIES).
LIBRARY_LIBCAL_IDS: dict[str, int] = {
    "Clemons": 3638,
    "Shannon": 2090,  # The Edgar Shannon Library
    "Science & Engineering": 3727,  # Charles L. Brown SEL
    "Music": 3804,
    "Fine Arts": 3805,
    "Harrison/Small": 4114,  # Harrison Institute / Small Special Collections
}

# Buildings with live occupancy / foot-traffic cameras (subset of above).
OCCUPANCY_LIBRARIES: frozenset[str] = frozenset(
    {
        "Clemons",
        "Shannon",
        "Science & Engineering",
        "Music",
        "Fine Arts",
    }
)

# Display names for patrons (canonical key → preferred label)
LIBRARY_DISPLAY_NAMES: dict[str, str] = {
    "Clemons": "Clemons Library",
    "Shannon": "Edgar Shannon Library",
    "Science & Engineering": "Charles L. Brown Science & Engineering Library",
    "Music": "Music Library",
    "Fine Arts": "Fine Arts Library",
    "Harrison/Small": "Harrison Institute / Small Special Collections Library",
}

# Normalized aliases → canonical key
_LIBRARY_ALIASES: dict[str, str] = {
    "clemons": "Clemons",
    "shannon": "Shannon",
    "edgarshannon": "Shannon",
    "main": "Shannon",
    "alderman": "Shannon",
    "science": "Science & Engineering",
    "scienceandengineering": "Science & Engineering",
    "scienceengineering": "Science & Engineering",
    "sel": "Science & Engineering",
    "brown": "Science & Engineering",
    "music": "Music",
    "finearts": "Fine Arts",
    "fal": "Fine Arts",
    "fiske": "Fine Arts",
    "harrison": "Harrison/Small",
    "harrisonsmall": "Harrison/Small",
    "harrisoninstitute": "Harrison/Small",
    "small": "Harrison/Small",
    "smallspecialcollections": "Harrison/Small",
    "specialcollections": "Harrison/Small",
}

LIBCAL_IID = os.getenv("LIBCAL_IID", "863")
LIBCAL_KEY = os.getenv(
    "LIBCAL_KEY", "e4b27d40b7099e8e392113da2f8bf30a"
)
LIBCAL_HOURS_URL = os.getenv(
    "LIBCAL_HOURS_URL",
    "https://cal.lib.virginia.edu/api/1.0/hours/{lids}?iid={iid}&key={key}&from={start}&to={end}",
)

# Default when library is unknown: Clemons (legacy behavior)
_DEFAULT_LIBRARY = "Clemons"


def parse_time(s: str) -> time:
    s = s.lower().replace(" ", "")
    if ":" in s:
        if "am" in s or "pm" in s:
            fmt = "%I:%M%p"
        else:
            fmt = "%H:%M"
    else:
        fmt = "%I%p"
    return datetime.strptime(s, fmt).time()


def normalize_library_name(library: str | None) -> str:
    """Map free-text library name to a canonical library key."""
    if not library:
        return _DEFAULT_LIBRARY
    raw = library.strip()
    if raw in LIBRARY_LIBCAL_IDS:
        return raw
    # Allow display names
    for canon, display in LIBRARY_DISPLAY_NAMES.items():
        if raw.lower() == display.lower():
            return canon
    key = (
        raw.lower()
        .replace("&", "and")
        .replace("/", "")
        .replace("–", "")
        .replace("-", "")
        .replace("'", "")
        .replace("’", "")
        .replace(" ", "")
    )
    if key in _LIBRARY_ALIASES:
        return _LIBRARY_ALIASES[key]
    # Partial contains match (prefer longer aliases)
    for alias, canon in sorted(_LIBRARY_ALIASES.items(), key=lambda x: -len(x[0])):
        if alias in key or key in alias:
            return canon
    return raw  # may still work if caller used exact cameras name


def libcal_id_for_library(library: str | None) -> int:
    canon = normalize_library_name(library)
    if canon in LIBRARY_LIBCAL_IDS:
        return LIBRARY_LIBCAL_IDS[canon]
    # Fall back to Clemons with a clear default (legacy occupancy path)
    return LIBRARY_LIBCAL_IDS[_DEFAULT_LIBRARY]


def format_library_directory(occupancy_from_db: list[str] | None = None) -> str:
    """
    Human-readable directory of UVA Library locations for agents.

    Distinguishes the full library system from the occupancy-camera subset so
    "how many libraries?" does not omit Harrison/Small, Ivy, etc.
    """
    occ = set(occupancy_from_db or []) | set(OCCUPANCY_LIBRARIES)

    lines = [
        "# UVA Library locations",
        "",
        "There are multiple UVA Library buildings and service points. "
        "Do **not** answer “how many libraries?” with only the occupancy-camera list.",
        "",
        "## Major libraries & service points (with building hours in LibCal)",
        "",
    ]

    # Stable, patron-friendly order (libraries only — not media centers / labs / service points)
    order = [
        "Shannon",
        "Clemons",
        "Science & Engineering",
        "Fine Arts",
        "Music",
        "Harrison/Small",
    ]
    for i, key in enumerate(order, 1):
        display = LIBRARY_DISPLAY_NAMES.get(key, key)
        occ_note = " · live occupancy sensors" if key in occ else ""
        lines.append(f"{i}. **{display}** (`{key}`){occ_note}")

    lines.extend(
        [
            "",
            f"**Count**: {len(order)} libraries",
            "",
            "## Live occupancy / foot traffic",
            "Occupancy tools only cover buildings with cameras:",
            ", ".join(f"**{n}**" for n in sorted(occ)),
            "",
            "**Harrison/Small** supports hours lookups via `get_library_hours` "
            "but not occupancy counts.",
            "",
            "## Notes",
            "- Professional school libraries (Law, Darden, Health Sciences, JAG) are "
            "separate units and are not listed above.",
            "- Prefer the display names when talking to patrons; use canonical keys "
            "in tool arguments when needed.",
        ]
    )
    return "\n".join(lines)


def fetch_hours(start_date, end_date, library: str | None = None):
    """
    Fetch open intervals for [start_date, end_date] for a specific library.

    Returns dict: date_str -> list[(start_time, end_time)].
    Cached per (libcal_lid, date).
    """
    lid = libcal_id_for_library(library)

    # Check if all dates for this lid are cached
    all_cached = True
    curr = start_date
    while curr <= end_date:
        if (lid, curr.isoformat()) not in _hours_cache:
            all_cached = False
            break
        curr += timedelta(days=1)

    if all_cached:
        res = {}
        curr = start_date
        while curr <= end_date:
            res[curr.isoformat()] = list(_hours_cache[(lid, curr.isoformat())])
            curr += timedelta(days=1)
        return res

    open_intervals: dict[str, list[tuple[time, time]]] = {}
    current_start = start_date
    max_chunk_days = 31
    while current_start <= end_date:
        current_end = min(end_date, current_start + timedelta(days=max_chunk_days - 1))
        current_start_str = current_start.isoformat()
        current_end_str = current_end.isoformat()
        url = LIBCAL_HOURS_URL.format(
            lids=lid,
            iid=LIBCAL_IID,
            key=LIBCAL_KEY,
            start=current_start_str,
            end=current_end_str,
        )
        response = requests.get(url, timeout=30)
        if response.status_code != 200:
            raise ValueError(
                f"Failed to fetch hours for {library or lid} "
                f"{current_start_str} to {current_end_str}: {response.status_code}"
            )
        data = response.json()
        if not data:
            raise ValueError(
                f"No LibCal hours payload for lid={lid} ({library})"
            )

        # Match our lid in case API returns a list with parents/children
        loc = None
        for entry in data if isinstance(data, list) else [data]:
            if int(entry.get("lid", -1)) == int(lid):
                loc = entry
                break
        if loc is None:
            loc = data[0] if isinstance(data, list) else data

        dates_hours = loc.get("dates") or {}
        for date_str, date_info in dates_hours.items():
            status = date_info.get("status")
            date = datetime.strptime(date_str, "%Y-%m-%d").date()
            if status == "closed":
                open_intervals[date_str] = []
                _hours_cache[(lid, date_str)] = []
                continue
            if status == "24hours":
                iv = [(time(0, 0), time(23, 59, 59))]
                open_intervals[date_str] = iv
                _hours_cache[(lid, date_str)] = iv
                continue

            intervals: list[tuple[time, time]] = []
            for period in date_info.get("hours") or []:
                from_str = period.get("from", "")
                to_str = period.get("to", "")
                try:
                    from_time = parse_time(from_str)
                    to_time = parse_time(to_str)
                except Exception:
                    continue
                if from_time == time(0, 0) and to_time == time(0, 0):
                    intervals.append((time(0, 0), time(23, 59, 59)))
                    continue
                adjusted_to_time = to_time
                if to_time == time(0, 0):
                    adjusted_to_time = time(23, 59, 59)
                if adjusted_to_time >= from_time:
                    intervals.append((from_time, adjusted_to_time))
                else:
                    intervals.append((from_time, time(23, 59, 59)))
                    next_date = date + timedelta(days=1)
                    next_date_str = next_date.isoformat()
                    if next_date_str not in open_intervals:
                        open_intervals[next_date_str] = []
                    open_intervals[next_date_str].append((time(0, 0), to_time))
            open_intervals[date_str] = intervals
            _hours_cache[(lid, date_str)] = list(intervals)

        current_start = current_end + timedelta(days=1)

    # Ensure spillover keys are cached too
    for date_str, intervals in open_intervals.items():
        _hours_cache[(lid, date_str)] = list(intervals)

    return open_intervals


def get_day_open_times(date_str: str, library: str | None = None):
    date = datetime.strptime(date_str, "%Y-%m-%d").date()
    prev_date = date - timedelta(days=1)
    next_date = date + timedelta(days=1)
    intervals = fetch_hours(prev_date, next_date, library=library)

    day_intervals = sorted(intervals.get(date_str, []), key=lambda x: x[0])
    prev_intervals = sorted(
        intervals.get(prev_date.isoformat(), []), key=lambda x: x[0]
    )
    next_intervals = sorted(
        intervals.get(next_date.isoformat(), []), key=lambda x: x[0]
    )

    # Machine-facing string for processing.py (must stay 24h + ASCII hyphen).
    # Human-facing 12h lives only in format_hours_schedule().
    if not day_intervals:
        open_times = "Closed"
    else:
        open_times_list = []
        for start, end in day_intervals:
            start_str = start.strftime("%H:%M")
            end_str = end.strftime("%H:%M") if end != time(23, 59, 59) else "24:00"
            open_times_list.append(f"{start_str}-{end_str}")
        if len(open_times_list) == 1 and open_times_list[0] == "00:00-24:00":
            open_times = "00:00-24:00"
        else:
            open_times = ", ".join(open_times_list)

    # Determine if opened (first open of a non-overnight stretch)
    opened = False
    if day_intervals and day_intervals[0][0] > time(0, 0):
        opened = True
    elif day_intervals and day_intervals[0][0] == time(0, 0):
        if prev_intervals and prev_intervals[-1][1] == time(23, 59, 59):
            opened = False
        else:
            opened = True
    else:
        opened = False

    closed = False
    if day_intervals and day_intervals[-1][1] < time(23, 59, 59):
        closed = True
    elif day_intervals and day_intervals[-1][1] == time(23, 59, 59):
        if next_intervals and next_intervals[0][0] == time(0, 0):
            closed = False
        else:
            closed = True
    else:
        closed = False

    return {
        "open_times": open_times,
        "opened": "Yes" if opened else "No",
        "closed": "Yes" if closed else "No",
        "library": normalize_library_name(library),
        "libcal_lid": libcal_id_for_library(library),
    }


def get_hours(start_date_str: str, end_date_str: str, library: str | None = None):
    """
    Open intervals with reporting buffers (−15 min start, +30 min end).
    """
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
    raw_intervals = fetch_hours(start_date, end_date, library=library)

    extended_intervals: dict[str, list] = {k: [] for k in raw_intervals}
    for date_str in list(raw_intervals.keys()):
        date = datetime.strptime(date_str, "%Y-%m-%d").date()
        for s, e in raw_intervals[date_str]:
            dt_s = datetime.combine(date, s)
            dt_e = datetime.combine(date, e)
            dt_new_s = dt_s - timedelta(minutes=15)
            dt_new_e = dt_e + timedelta(minutes=30)
            current_dt = dt_new_s
            while current_dt < dt_new_e:
                current_date_str = current_dt.date().isoformat()
                if current_date_str not in extended_intervals:
                    extended_intervals[current_date_str] = []
                day_end = datetime.combine(
                    current_dt.date(), time(23, 59, 59, 999999)
                )
                segment_end = min(day_end, dt_new_e)
                extended_intervals[current_date_str].append(
                    (current_dt.time(), segment_end.time())
                )
                current_dt = day_end + timedelta(microseconds=1)

    def merge_intervals(intervals):
        if not intervals:
            return []
        sorted_int = sorted(intervals, key=lambda x: x[0])
        merged = [sorted_int[0]]
        for current in sorted_int[1:]:
            last = merged[-1]
            if current[0] <= last[1]:
                merged[-1] = (last[0], max(last[1], current[1]))
            else:
                merged.append(current)
        return merged

    for date_str in extended_intervals:
        extended_intervals[date_str] = merge_intervals(extended_intervals[date_str])

    return extended_intervals


def is_open(date, t, open_intervals) -> bool:
    date_str = date.isoformat()
    if date_str not in open_intervals:
        return False
    for start, end in open_intervals[date_str]:
        if start <= t <= end:
            return True
    return False


def format_time_12h(t: time, *, midnight_as_end: bool = False) -> str:
    """
    Format a time for human/agent-facing hours copy (U.S. 12-hour).

    Examples: 09:00 → 9:00 AM, 13:00 → 1:00 PM, 17:00 → 5:00 PM
    For interval ends at 23:59:59 (LibCal all-day-to-midnight), use midnight_as_end
    to show 12:00 AM (next calendar day close).
    """
    if midnight_as_end and t == time(23, 59, 59):
        return "12:00 AM"
    # %-I is platform-specific; strip leading zero manually for portability
    hour = t.hour % 12 or 12
    am_pm = "AM" if t.hour < 12 else "PM"
    return f"{hour}:{t.minute:02d} {am_pm}"


def format_hours_schedule(
    library: str,
    start_date_str: str,
    end_date_str: str | None = None,
) -> str:
    """
    Human-readable markdown schedule for a library over a date range.

    Uses published LibCal hours (no reporting buffer). Defaults to a single day
    when end_date_str is omitted. Times are 12-hour (e.g. 1:00 PM–5:00 PM).
    """
    canon = normalize_library_name(library)
    if canon not in LIBRARY_LIBCAL_IDS:
        known = ", ".join(sorted(LIBRARY_LIBCAL_IDS.keys()))
        return f"Error: Library '{library}' has no LibCal calendar mapping. Known: {known}"

    if end_date_str is None or not str(end_date_str).strip():
        end_date_str = start_date_str

    try:
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
    except ValueError:
        return "Error: Dates must be YYYY-MM-DD."

    if end_date < start_date:
        return "Error: end_date must be on or after start_date."

    # Cap very long requests so agents don't pull years of calendars by accident
    max_days = 120
    if (end_date - start_date).days + 1 > max_days:
        return (
            f"Error: Date range too long (max {max_days} days for get_library_hours). "
            f"Requested {(end_date - start_date).days + 1} days."
        )

    lid = libcal_id_for_library(canon)
    try:
        raw = fetch_hours(start_date, end_date, library=canon)
    except Exception as e:
        return f"Error: Failed to fetch LibCal hours for {canon}: {e}"

    lines = [
        f"### Library Hours: {canon}",
        f"* **LibCal location id**: {lid}",
        f"* **Date range**: {start_date_str} to {end_date_str}",
        f"* **Source**: LibCal (published building hours; no open/close buffer)",
        f"* **Time format**: 12-hour local (e.g. 1:00 PM–5:00 PM)",
        "",
        "| Date | Day | Hours |",
        "| :--- | :--- | :--- |",
    ]

    open_days = 0
    closed_days = 0
    current = start_date
    while current <= end_date:
        date_str = current.isoformat()
        intervals = raw.get(date_str, [])
        day_name = current.strftime("%a")
        if not intervals:
            hours_str = "Closed"
            closed_days += 1
        else:
            open_days += 1
            parts = []
            for s, e in sorted(intervals, key=lambda x: x[0]):
                s_str = format_time_12h(s)
                e_str = format_time_12h(e, midnight_as_end=True)
                parts.append(f"{s_str}–{e_str}")
            hours_str = ", ".join(parts)
        lines.append(f"| {date_str} | {day_name} | {hours_str} |")
        current += timedelta(days=1)

    lines.extend(
        [
            "",
            f"**Summary**: {open_days} open day(s), {closed_days} closed day(s).",
        ]
    )
    return "\n".join(lines)
