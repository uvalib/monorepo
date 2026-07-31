# spaces_helper.py
"""
LibCal Spaces API — reservable space locations, categories, and items.

Uses the same LibCal system id / API key as hours_helper, but **space location
lids are different from building-hours calendar lids**.

Public docs: https://library.virginia.edu/spaces
API:
  GET /api/1.0/space/locations
  GET /api/1.0/space/categories/{lid}
  GET /api/1.0/space/items/{lid}
  GET /api/1.0/space/item/{id}?availability=...
  GET /api/1.0/space/seats/{lid}?availability=...
  GET /api/1.0/space/seat/{id}?availability=...

Note: At UVA, "seats" are used mainly for named Makerspace equipment (printers,
button makers). Study rooms use spaces/items, not seats.
"""

from __future__ import annotations

import os
import re
import time as time_module
from datetime import date, datetime, timedelta
from typing import Any
from zoneinfo import ZoneInfo

import requests

TZ = ZoneInfo("America/New_York")

# Reuse hours credentials when set
try:
    from hours_helper import LIBCAL_IID, LIBCAL_KEY
except Exception:  # pragma: no cover
    LIBCAL_IID = os.getenv("LIBCAL_IID", "863")
    LIBCAL_KEY = os.getenv(
        "LIBCAL_KEY", "e4b27d40b7099e8e392113da2f8bf30a"
    )

LIBCAL_BASE = os.getenv(
    "LIBCAL_BASE_URL", "https://cal.lib.virginia.edu/api/1.0"
).rstrip("/")

_USER_AGENT = "UVA-Library-MCP/1.0 (spaces_helper)"

# Cache: (expires_at, locations_list)
_locations_cache: tuple[float, list[dict]] | None = None
_categories_cache: dict[str, tuple[float, list[dict]]] = {}
_items_cache: dict[int, tuple[float, list[dict]]] = {}
_seats_cache: dict[int, tuple[float, list[dict]]] = {}
_CACHE_TTL_SEC = 3600.0
# Availability is more volatile — short cache only when no availability requested
_ITEM_DETAIL_CACHE_TTL_SEC = 300.0
_item_detail_cache: dict[str, tuple[float, list[dict]]] = {}
_seat_detail_cache: dict[str, tuple[float, dict]] = {}

# Free-text aliases → preferred match tokens for space location names
_SPACE_ALIASES: dict[str, str] = {
    "shannon": "Shannon",
    "main": "Shannon",
    "clemons": "Clemons",
    "georges": "Georges",
    "georgesstudentcenter": "Georges",
    "clemons2": "Georges",
    "brown": "Brown",
    "sel": "Brown",
    "science": "Brown",
    "scienceandengineering": "Brown",
    "clark": "Brown",
    "finearts": "Fine Arts",
    "fal": "Fine Arts",
    "music": "Music",
    "rmc": "Robertson Media Center",
    "robertson": "Robertson Media Center",
    "robertsonmediacenter": "Robertson Media Center",
    "mediacenter": "Robertson Media Center",
    "scholarslab": "Scholars' Lab",
    "scholars": "Scholars' Lab",
    "slab": "Scholars' Lab",
    "makerspace": "Makerspace",
    "harrison": "Harrison",
    "harrisonsmall": "Harrison",
    "small": "Harrison",
    "specialcollections": "Harrison",
}


def _strip_html(raw: str | None) -> str:
    if not raw:
        return ""
    text = re.sub(r"<br\s*/?>", "\n", raw, flags=re.I)
    text = re.sub(r"</p\s*>", "\n", text, flags=re.I)
    text = re.sub(r"<[^>]+>", "", text)
    text = (
        text.replace("&nbsp;", " ")
        .replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&#39;", "'")
        .replace("&rsquo;", "'")
        .replace("&ldquo;", '"')
        .replace("&rdquo;", '"')
    )
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


def _norm(s: str) -> str:
    return (
        (s or "")
        .lower()
        .replace("&", "and")
        .replace("/", "")
        .replace("'", "")
        .replace("’", "")
        .replace("-", "")
        .replace(" ", "")
    )


def _get(path: str, params: dict | None = None) -> Any:
    p = dict(params or {})
    p.setdefault("iid", LIBCAL_IID)
    p.setdefault("key", LIBCAL_KEY)
    url = f"{LIBCAL_BASE}/{path.lstrip('/')}"
    resp = requests.get(
        url,
        params=p,
        headers={"User-Agent": _USER_AGENT},
        timeout=20,
    )
    resp.raise_for_status()
    return resp.json()


def fetch_space_locations(force_refresh: bool = False) -> list[dict]:
    """
    Public + private space locations from GET /space/locations?details=1.
    Cached ~1 hour.
    """
    global _locations_cache
    now = time_module.time()
    if (
        not force_refresh
        and _locations_cache
        and _locations_cache[0] > now
    ):
        return _locations_cache[1]

    data = _get("space/locations", {"details": 1})
    if not isinstance(data, list):
        data = []
    _locations_cache = (now + _CACHE_TTL_SEC, data)
    return data


def public_space_locations() -> list[dict]:
    return [loc for loc in fetch_space_locations() if loc.get("public") == 1]


def resolve_space_location(location: str | int | None) -> dict | None:
    """
    Resolve free-text name or numeric space lid to a location dict.
    Returns None if not found.
    """
    if location is None or (isinstance(location, str) and not location.strip()):
        return None

    locs = fetch_space_locations()
    # Numeric lid
    try:
        lid = int(str(location).strip())
        for loc in locs:
            if int(loc.get("lid") or -1) == lid:
                return loc
    except (TypeError, ValueError):
        pass

    raw = str(location).strip()
    raw_key = _norm(raw)
    alias_token = _SPACE_ALIASES.get(raw_key)
    # Prefer alias token for matching (e.g. "main" → Shannon)
    key = _norm(alias_token) if alias_token else raw_key

    def _score(loc: dict) -> tuple:
        """Lower is better."""
        name = loc.get("name") or ""
        n = _norm(name)
        public = 0 if loc.get("public") == 1 else 1
        # Exact normalized match
        if n == key or n == raw_key:
            return (0, public, 0)
        # Name starts with query (Shannon Library vs Scholars' Lab (Shannon 308))
        if n.startswith(key) or n.startswith(raw_key):
            return (1, public, len(n))
        # Query is the first word of the LibCal name
        first = _norm(name.split("(")[0].split()[0] if name else "")
        if first and first == key:
            return (2, public, len(n))
        # Contains (weak) — avoid matching parenthetical "Shannon" in other names
        # when a stronger candidate exists
        if key in n or raw_key in n:
            # Penalize if match is only inside parentheses and key is short building name
            paren = re.search(r"\(([^)]+)\)", name)
            if paren and key in _norm(paren.group(1)) and key not in _norm(name.split("(")[0]):
                return (5, public, len(n))
            return (3, public, len(n))
        return (9, public, 999)

    ranked = sorted(locs, key=_score)
    best = ranked[0] if ranked else None
    if not best or _score(best)[0] >= 9:
        return None
    return best


def fetch_space_categories(
    location_ids: list[int],
    *,
    details: bool = True,
    include_admin_only: bool = False,
    force_refresh: bool = False,
) -> list[dict]:
    """
    GET /space/categories/{id} for one or more space location lids.

    Returns list of {lid, name, categories: [...]}.
    """
    if not location_ids:
        return []

    lids_key = ",".join(str(int(x)) for x in location_ids)
    cache_key = f"{lids_key}|d={int(details)}|a={int(include_admin_only)}"
    now = time_module.time()
    if (
        not force_refresh
        and cache_key in _categories_cache
        and _categories_cache[cache_key][0] > now
    ):
        return _categories_cache[cache_key][1]

    params = {
        "details": 1 if details else 0,
        "admin_only": 1 if include_admin_only else 0,
    }
    data = _get(f"space/categories/{lids_key}", params)
    if not isinstance(data, list):
        data = []
    _categories_cache[cache_key] = (now + _CACHE_TTL_SEC, data)
    return data


def format_space_categories(
    location: str = "",
    *,
    public_only: bool = True,
    include_admin_only: bool = False,
) -> str:
    """
    Human-readable markdown for agents: space categories (kinds of reservable
    spaces) for one location or all public locations.
    """
    try:
        if location and str(location).strip():
            loc = resolve_space_location(location)
            if not loc:
                known = ", ".join(
                    f"{l.get('name')} (lid={l.get('lid')})"
                    for l in public_space_locations()
                )
                return (
                    f"Error: Space location '{location}' not found.\n"
                    f"Known public LibCal space locations: {known}\n"
                    "Note: space lids differ from building-hours LibCal ids."
                )
            lids = [int(loc["lid"])]
            header_scope = loc.get("name") or str(loc.get("lid"))
        else:
            pubs = public_space_locations()
            lids = [int(l["lid"]) for l in pubs if l.get("lid") is not None]
            header_scope = "all public locations"

        blocks = fetch_space_categories(
            lids,
            details=True,
            include_admin_only=include_admin_only,
        )
    except Exception as e:
        return f"Error: Failed to fetch LibCal space categories: {e}"

    lines = [
        "# UVA Library reservable space categories (LibCal)",
        f"* **Scope**: {header_scope}",
        f"* **Source**: LibCal Spaces API (`/space/categories/{{lid}}`)",
        f"* **Booking UI**: https://cal.lib.virginia.edu/spaces?lid={{space_lid}}",
        "* **Note**: These are **categories** (types of bookable spaces), not "
        "individual rooms. Space location lids are **not** the same as building "
        "hours calendar ids. Building open/closed → `get_library_hours`.",
        "",
    ]

    shown = 0
    for block in blocks:
        lid = block.get("lid")
        name = block.get("name") or f"Location {lid}"
        cats = list(block.get("categories") or [])
        if public_only:
            cats = [c for c in cats if c.get("public") == 1]
        if not include_admin_only:
            cats = [c for c in cats if not c.get("admin_only")]

        lines.append(f"## {name}")
        lines.append(f"- **Space location lid**: `{lid}`")
        lines.append(f"- **Book / browse**: https://cal.lib.virginia.edu/spaces?lid={lid}")
        if not cats:
            lines.append("- *(No public categories returned for this location.)*")
            lines.append("")
            continue

        lines.append(f"- **Public categories**: {len(cats)}")
        lines.append("")
        for cat in cats:
            cid = cat.get("cid")
            cname = cat.get("name") or f"Category {cid}"
            lines.append(f"### {cname}")
            lines.append(f"- **Category id (cid)**: `{cid}`")
            formid = cat.get("formid")
            if formid and int(formid) != 0:
                lines.append(f"- **Booking form id**: `{formid}`")
            desc = _strip_html(cat.get("description"))
            if desc:
                # Keep descriptions bounded for agent context
                if len(desc) > 800:
                    desc = desc[:800].rstrip() + "…"
                lines.append(f"- **Description**: {desc}")
            terms = _strip_html(cat.get("termsAndConditions"))
            if terms:
                if len(terms) > 800:
                    terms = terms[:800].rstrip() + "…"
                lines.append(f"- **Terms / policies**: {terms}")
            lines.append("")
            shown += 1
        lines.append("")

    if shown == 0:
        lines.append(
            "No public categories found. Try another location name, or omit "
            "`location` to list all public buildings."
        )
    else:
        lines.append(
            f"**Total public categories listed**: {shown}. "
            "To reserve, send patrons to the booking URL for that space location. "
            "For individual rooms and free times, use `list_space_items` then "
            "`get_space_item`."
        )

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Items (rooms / equipment) + item availability
# ---------------------------------------------------------------------------


def _flatten_items_payload(data: Any) -> list[dict]:
    """Normalize /space/items/{lid} or /space/item/{id} JSON into item dicts."""
    flat: list[dict] = []
    if not isinstance(data, list):
        return flat
    for block in data:
        if not isinstance(block, dict):
            continue
        if block.get("error"):
            continue
        if "items" in block and isinstance(block["items"], list):
            for it in block["items"]:
                if isinstance(it, dict) and it.get("id") is not None:
                    flat.append(it)
        elif block.get("id") is not None:
            flat.append(block)
    return flat


def fetch_space_items(
    location_lid: int,
    *,
    availability: str | None = None,
    category_id: int | None = None,
    visibility: str = "public",
    zone_id: int | None = None,
    bookable: int | None = None,
    page_size: int = 100,
    page_index: int = 0,
    force_refresh: bool = False,
) -> list[dict]:
    """
    GET /space/items/{lid} — bookable items at a space location.

    When availability is set (e.g. YYYY-MM-DD, next, next_only), each item includes
    free half-hour slots. Metadata-only responses are cached; availability is not.
    """
    lid = int(location_lid)
    avail = (availability or "").strip() or None
    vis = (visibility or "public").strip().lower() or "public"
    if vis not in ("public", "private", "admin_only"):
        vis = "public"

    params: dict[str, Any] = {
        "visibility": vis,
        "page_size": max(1, min(int(page_size or 100), 100)),
        "page_index": max(0, int(page_index or 0)),
    }
    if avail:
        params["availability"] = avail
    if category_id is not None:
        params["category_id"] = int(category_id)
    if zone_id is not None:
        params["zone_id"] = int(zone_id)
    if bookable is not None:
        params["bookable"] = int(bookable)

    # Cache only catalog-style metadata (no availability filter)
    cacheable = not avail and category_id is None and zone_id is None and page_index == 0
    now = time_module.time()
    if (
        cacheable
        and not force_refresh
        and lid in _items_cache
        and _items_cache[lid][0] > now
    ):
        return _items_cache[lid][1]

    data = _get(f"space/items/{lid}", params)
    items = _flatten_items_payload(data)
    if cacheable:
        _items_cache[lid] = (now + _CACHE_TTL_SEC, items)
    return items


def resolve_category_id(location_lid: int, category: str | int | None) -> int | None:
    """Resolve category name or numeric cid for a location; None if not specified."""
    if category is None or (isinstance(category, str) and not str(category).strip()):
        return None
    try:
        return int(str(category).strip())
    except (TypeError, ValueError):
        pass
    key = _norm(str(category))
    try:
        blocks = fetch_space_categories([int(location_lid)], details=False)
    except Exception:
        return None
    best: tuple[int, int] | None = None  # score, cid
    for block in blocks:
        for cat in block.get("categories") or []:
            if cat.get("public") != 1:
                continue
            n = _norm(cat.get("name") or "")
            cid = cat.get("cid")
            if cid is None:
                continue
            if n == key:
                return int(cid)
            if key in n or n in key:
                score = 0 if n.startswith(key) else 1
                if best is None or score < best[0]:
                    best = (score, int(cid))
    return best[1] if best else None


def fetch_space_item(
    item_ids: list[int] | int,
    *,
    availability: str | None = None,
    force_refresh: bool = False,
) -> list[dict]:
    """
    GET /space/item/{id} with optional availability.

    availability: YYYY-MM-DD, "start,end", "next", "next_only", or None/"" for
    metadata only (LibCal omits free slots unless this param is set).
    """
    if isinstance(item_ids, int):
        ids = [item_ids]
    else:
        ids = [int(x) for x in item_ids]
    if not ids:
        return []

    id_path = ",".join(str(i) for i in ids)
    avail = (availability or "").strip()
    # Always pass an explicit date for free slots; bare calls omit availability
    params: dict[str, Any] = {}
    if avail:
        params["availability"] = avail

    cache_key = f"{id_path}|{avail or 'meta'}"
    now = time_module.time()
    # Only cache metadata (no availability) briefly; live free/busy stays fresh
    if (
        not force_refresh
        and not avail
        and cache_key in _item_detail_cache
        and _item_detail_cache[cache_key][0] > now
    ):
        return _item_detail_cache[cache_key][1]

    data = _get(f"space/item/{id_path}", params or None)
    items = _flatten_items_payload(data)
    if not avail:
        _item_detail_cache[cache_key] = (now + _ITEM_DETAIL_CACHE_TTL_SEC, items)
    return items


def resolve_space_item(
    item: str | int,
    *,
    location: str = "",
) -> dict | None:
    """
    Resolve numeric item id or room name (optionally scoped to a location).
    """
    # Numeric id
    try:
        iid = int(str(item).strip())
        # Prefer metadata fetch to confirm it exists
        found = fetch_space_item(iid, availability=None)
        if found:
            return found[0]
    except (TypeError, ValueError):
        pass

    name_key = _norm(str(item))
    if not name_key:
        return None

    # Search items under one location or all public
    search_locs: list[dict]
    if location and str(location).strip():
        loc = resolve_space_location(location)
        search_locs = [loc] if loc else []
    else:
        search_locs = public_space_locations()

    candidates: list[tuple[int, dict, dict]] = []  # score, item, loc
    for loc in search_locs:
        try:
            items = fetch_space_items(int(loc["lid"]))
        except Exception:
            continue
        for it in items:
            n = _norm(it.get("name") or "")
            if not n:
                continue
            if n == name_key:
                candidates.append((0, it, loc))
            elif n.startswith(name_key) or name_key in n:
                candidates.append((1, it, loc))
            else:
                # match room numbers like "318 C" vs "318c"
                digits = re.sub(r"[^a-z0-9]", "", name_key)
                nd = re.sub(r"[^a-z0-9]", "", n)
                if digits and digits in nd:
                    candidates.append((2, it, loc))
    if not candidates:
        return None
    candidates.sort(key=lambda t: (t[0], len(t[1].get("name") or "")))
    best_item = candidates[0][1]
    # Attach location for booking links
    best_item = dict(best_item)
    best_item["_location_lid"] = candidates[0][2].get("lid")
    best_item["_location_name"] = candidates[0][2].get("name")
    return best_item


def _parse_avail_iso(s: str) -> datetime | None:
    try:
        # 2026-07-30T17:00:00-04:00
        return datetime.fromisoformat(s)
    except Exception:
        return None


def _format_dt_12h(dt: datetime) -> str:
    hour = dt.hour % 12 or 12
    am_pm = "AM" if dt.hour < 12 else "PM"
    return f"{hour}:{dt.minute:02d} {am_pm}"


def merge_availability_slots(
    slots: list[dict] | None,
) -> list[tuple[datetime, datetime]]:
    """Merge adjacent free half-hour windows into continuous ranges."""
    if not slots:
        return []
    parsed: list[tuple[datetime, datetime]] = []
    for s in slots:
        a = _parse_avail_iso(str(s.get("from") or ""))
        b = _parse_avail_iso(str(s.get("to") or ""))
        if a and b and b > a:
            parsed.append((a, b))
    parsed.sort(key=lambda x: x[0])
    if not parsed:
        return []
    merged = [parsed[0]]
    for start, end in parsed[1:]:
        last_s, last_e = merged[-1]
        if start <= last_e + timedelta(seconds=1):
            merged[-1] = (last_s, max(last_e, end))
        else:
            merged.append((start, end))
    return merged


def _normalize_availability_arg(availability: str) -> str:
    """
    Map agent-friendly values to LibCal availability query.
    Empty → today's date (so free slots are returned).
    """
    raw = (availability or "").strip()
    if not raw or raw.lower() in ("today", "default"):
        return date.today().isoformat()
    low = raw.lower()
    if low in ("next", "next_only"):
        return low
    if low == "tomorrow":
        return (date.today() + timedelta(days=1)).isoformat()
    # "YYYY-MM-DD,YYYY-MM-DD" or single day
    if "," in raw:
        parts = [p.strip() for p in raw.split(",", 1)]
        try:
            d0 = datetime.strptime(parts[0], "%Y-%m-%d").date()
            d1 = datetime.strptime(parts[1], "%Y-%m-%d").date()
        except ValueError:
            return raw
        if d1 < d0:
            d0, d1 = d1, d0
        # LibCal max 31 days
        if (d1 - d0).days > 30:
            d1 = d0 + timedelta(days=30)
        return f"{d0.isoformat()},{d1.isoformat()}"
    try:
        datetime.strptime(raw, "%Y-%m-%d")
        return raw
    except ValueError:
        return raw


def _format_item_free_windows(it: dict, *, max_windows: int = 6) -> list[str]:
    """Short free-window lines for batch item listings."""
    slots = it.get("availability")
    merged = merge_availability_slots(slots if isinstance(slots, list) else None)
    if not merged:
        return ["  - *No free slots* in this range"]
    lines: list[str] = []
    shown = 0
    by_day: dict[str, list[tuple[datetime, datetime]]] = {}
    for a, b in merged:
        la = a.astimezone(TZ) if a.tzinfo else a.replace(tzinfo=TZ)
        lb = b.astimezone(TZ) if b.tzinfo else b.replace(tzinfo=TZ)
        by_day.setdefault(la.date().isoformat(), []).append((la, lb))
    for day_key in sorted(by_day.keys()):
        day_name = datetime.strptime(day_key, "%Y-%m-%d").strftime("%a")
        for la, lb in by_day[day_key]:
            if shown >= max_windows:
                lines.append(
                    f"  - … +{sum(len(v) for v in by_day.values()) - shown} more window(s); "
                    "use `get_space_item` for the full schedule"
                )
                return lines
            lines.append(
                f"  - {day_key} ({day_name}) {_format_dt_12h(la)}–{_format_dt_12h(lb)}"
            )
            shown += 1
    return lines


def format_space_items(
    location: str,
    *,
    availability: str = "none",
    category: str = "",
    only_with_availability: bool = False,
) -> str:
    """
    List bookable items at a space location via GET /space/items/{lid}.

    availability: none | today | tomorrow | next | next_only | YYYY-MM-DD | start,end
    category: optional category name or cid filter
    only_with_availability: when True and availability is requested, hide items
    with no free slots
    """
    if not location or not str(location).strip():
        return (
            "Error: `location` is required (e.g. Shannon, RMC, Georges, Clemons, "
            "Brown, Fine Arts, Music, Makerspace, or a space lid like 1076)."
        )
    loc = resolve_space_location(location)
    if not loc:
        known = ", ".join(f"{l.get('name')} ({l.get('lid')})" for l in public_space_locations())
        return f"Error: Space location '{location}' not found. Known: {known}"

    lid = int(loc["lid"])
    avail_raw = (availability or "none").strip()
    if avail_raw.lower() in ("none", "meta", "off", "false", "0", ""):
        libcal_avail: str | None = None
        avail_label = "metadata only (no free/busy)"
    else:
        libcal_avail = _normalize_availability_arg(avail_raw)
        avail_label = libcal_avail

    cat_id = resolve_category_id(lid, category) if category else None
    if category and str(category).strip() and cat_id is None:
        return (
            f"Error: Category {category!r} not found at {loc.get('name')}. "
            "Call `get_space_categories` for valid category names/ids."
        )

    try:
        items = fetch_space_items(
            lid,
            availability=libcal_avail,
            category_id=cat_id,
            visibility="public",
            page_size=100,
        )
    except Exception as e:
        return f"Error: Failed to fetch space items for {loc.get('name')}: {e}"

    if only_with_availability and libcal_avail:
        items = [
            it
            for it in items
            if isinstance(it.get("availability"), list) and len(it.get("availability") or []) > 0
        ]

    lines = [
        f"# Reservable spaces: {loc.get('name')}",
        f"- **Space location lid**: `{lid}`",
        f"- **Book / browse**: https://cal.lib.virginia.edu/spaces?lid={lid}",
        f"- **API**: `GET /space/items/{lid}`",
        f"- **Availability query**: `{avail_label}`",
    ]
    if cat_id is not None:
        lines.append(f"- **Category filter**: `{category}` (cid `{cat_id}`)")
    lines.append(f"- **Count**: {len(items)} item(s)")
    lines.append("")
    if libcal_avail:
        lines.append(
            "Free times are **bookable** half-hour slots from LibCal (merged below). "
            "Use `get_space_item` for full policies on one room."
        )
    else:
        lines.append(
            "Use **item id** with `get_space_item`, or re-call with "
            "`availability=today` / a date range for free times on all rooms."
        )
    lines.append("")

    # Group by category name
    by_group: dict[str, list[dict]] = {}
    for it in items:
        g = it.get("groupName") or "Other"
        by_group.setdefault(str(g), []).append(it)

    open_count = 0
    for gname, group_items in sorted(by_group.items(), key=lambda x: x[0].lower()):
        lines.append(f"## {gname}")
        for it in sorted(group_items, key=lambda x: str(x.get("name") or "")):
            iid = it.get("id")
            name = it.get("name") or f"Item {iid}"
            cap = it.get("capacity")
            cap_s = f" · capacity {cap}" if cap not in (None, "") else ""
            has_free = bool(it.get("availability"))
            if has_free:
                open_count += 1
            free_flag = " · **has free slots**" if has_free and libcal_avail else ""
            lines.append(f"- **{name}** — item id `{iid}`{cap_s}{free_flag}")
            if libcal_avail:
                lines.extend(_format_item_free_windows(it))
        lines.append("")

    if not items:
        lines.append(
            "No bookable items returned for this location via the LibCal API "
            "(some areas may only book via forms or other systems, or none are free)."
        )
    elif libcal_avail:
        lines.append(
            f"**Summary**: {open_count} of {len(items)} item(s) have at least one free slot "
            f"for `{avail_label}`. Patrons must book in LibCal — this tool does not reserve."
        )
    return "\n".join(lines)


def format_space_item(
    item: str,
    availability: str = "today",
    location: str = "",
) -> str:
    """
    Details + free availability for one space/equipment item.

    :param item: Item id or room name (e.g. 169211 or "318 C")
    :param availability: today | tomorrow | next | next_only | YYYY-MM-DD |
                         start,end (max 31 days). Use "none" for metadata only.
    :param location: Optional building scope when resolving by name
    """
    raw_item = (item or "").strip()
    if not raw_item:
        return "Error: `item` is required (numeric item id or room name)."

    # Resolve name → id if needed
    item_id: int | None = None
    resolved_meta: dict | None = None
    try:
        item_id = int(raw_item)
    except ValueError:
        resolved_meta = resolve_space_item(raw_item, location=location)
        if not resolved_meta:
            hint = f" at {location}" if location else ""
            return (
                f"Error: Could not find space item {raw_item!r}{hint}. "
                "Call `list_space_items` with a location (e.g. Shannon) to see "
                "item ids and names."
            )
        item_id = int(resolved_meta["id"])

    avail_arg = (availability or "today").strip()
    if avail_arg.lower() in ("none", "meta", "off", "false", "0"):
        libcal_avail: str | None = None
        avail_label = "metadata only (no free/busy)"
    else:
        libcal_avail = _normalize_availability_arg(avail_arg)
        avail_label = libcal_avail

    try:
        results = fetch_space_item(item_id, availability=libcal_avail)
    except Exception as e:
        return f"Error: Failed to fetch LibCal space item {item_id}: {e}"

    if not results:
        return f"Error: No data returned for space item id `{item_id}`."

    it = results[0]
    name = it.get("name") or f"Item {item_id}"
    loc_lid = (resolved_meta or {}).get("_location_lid")
    loc_name = (resolved_meta or {}).get("_location_name")
    # Reverse-lookup location when caller only passed a numeric item id
    if loc_lid is None:
        for pub in public_space_locations():
            try:
                for cand in fetch_space_items(int(pub["lid"])):
                    if int(cand.get("id") or -1) == int(item_id):
                        loc_lid = pub.get("lid")
                        loc_name = pub.get("name")
                        break
            except Exception:
                continue
            if loc_lid is not None:
                break

    lines = [
        f"# Space item: {name}",
        f"- **Item id**: `{it.get('id')}`",
    ]
    if loc_name or loc_lid:
        lines.append(f"- **Location**: {loc_name or ''} (space lid `{loc_lid}`)")
    if loc_lid:
        lines.append(f"- **Book**: https://cal.lib.virginia.edu/spaces?lid={loc_lid}")
    else:
        lines.append("- **Book**: https://cal.lib.virginia.edu/spaces")
    cap = it.get("capacity")
    if cap not in (None, ""):
        lines.append(f"- **Capacity**: {cap}")
    if it.get("groupName"):
        lines.append(f"- **Category**: {it.get('groupName')}")
    formid = it.get("formid")
    if formid and int(formid) != 0:
        lines.append(f"- **Booking form id**: `{formid}`")

    desc = _strip_html(it.get("description"))
    if desc:
        if len(desc) > 1000:
            desc = desc[:1000].rstrip() + "…"
        lines.append(f"- **Description**: {desc}")
    terms = _strip_html(it.get("termsAndConditions"))
    if terms:
        if len(terms) > 1000:
            terms = terms[:1000].rstrip() + "…"
        lines.append(f"- **Terms / policies**: {terms}")

    lines.append(f"- **Availability query**: `{avail_label}`")
    lines.append("")

    if libcal_avail is None:
        lines.append(
            "*Free/busy not requested.* Pass availability=`today`, a date "
            "`YYYY-MM-DD`, a range `start,end`, `next`, or `next_only`."
        )
    else:
        slots = it.get("availability")
        merged = merge_availability_slots(slots if isinstance(slots, list) else None)
        lines.append("## Free (bookable) times")
        if not merged:
            lines.append(
                "- **No free slots** returned for this range "
                "(fully booked, closed, or outside bookable hours)."
            )
        else:
            # Group by local date for readability
            by_day: dict[str, list[tuple[datetime, datetime]]] = {}
            for a, b in merged:
                # display in America/New_York if offset-aware
                la = a.astimezone(TZ) if a.tzinfo else a.replace(tzinfo=TZ)
                lb = b.astimezone(TZ) if b.tzinfo else b.replace(tzinfo=TZ)
                day_key = la.date().isoformat()
                by_day.setdefault(day_key, []).append((la, lb))
            for day_key in sorted(by_day.keys()):
                day_dt = datetime.strptime(day_key, "%Y-%m-%d").date()
                day_name = day_dt.strftime("%A")
                lines.append(f"### {day_key} ({day_name})")
                for la, lb in by_day[day_key]:
                    lines.append(
                        f"- {_format_dt_12h(la)}–{_format_dt_12h(lb)}"
                    )
                lines.append("")
            lines.append(
                f"*{len(merged)} open window(s) "
                f"(merged from {len(slots or [])} LibCal free slot(s)).*"
            )

    lines.extend(
        [
            "",
            "Patrons must complete reservations in LibCal (this tool does not book). "
            "Always prefer tool data over invented room status.",
        ]
    )
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Search: filters + hourly availability search
# ---------------------------------------------------------------------------

_filters_cache: tuple[float, list[dict]] | None = None


def parse_time_hhmm(value: str) -> str | None:
    """
    Parse agent-friendly times into LibCal HH:MM (24h).
    Accepts 17:00, 5:00 PM, 5pm, 5:30pm, etc.
    """
    raw = (value or "").strip()
    if not raw:
        return None
    s = raw.lower().replace(".", "").replace(" ", "")
    # already HH:MM or H:MM
    m = re.fullmatch(r"(\d{1,2}):(\d{2})(am|pm)?", s)
    if m:
        h, mi = int(m.group(1)), int(m.group(2))
        ap = m.group(3)
        if ap == "pm" and h < 12:
            h += 12
        if ap == "am" and h == 12:
            h = 0
        if 0 <= h <= 23 and 0 <= mi <= 59:
            return f"{h:02d}:{mi:02d}"
        return None
    m = re.fullmatch(r"(\d{1,2})(am|pm)", s)
    if m:
        h = int(m.group(1))
        ap = m.group(2)
        if ap == "pm" and h < 12:
            h += 12
        if ap == "am" and h == 12:
            h = 0
        if 0 <= h <= 23:
            return f"{h:02d}:00"
        return None
    m = re.fullmatch(r"(\d{1,2})", s)
    if m:
        h = int(m.group(1))
        if 0 <= h <= 23:
            return f"{h:02d}:00"
    return None


def parse_search_date(value: str) -> str | None:
    """Normalize today/tomorrow/YYYY-MM-DD to ISO date."""
    raw = (value or "").strip()
    if not raw or raw.lower() in ("today", "default"):
        return date.today().isoformat()
    if raw.lower() == "tomorrow":
        return (date.today() + timedelta(days=1)).isoformat()
    try:
        datetime.strptime(raw, "%Y-%m-%d")
        return raw
    except ValueError:
        return None


def fetch_space_search_filters(force_refresh: bool = False) -> list[dict]:
    """GET /space/search/filters — amenity filters (accessible, power, …)."""
    global _filters_cache
    now = time_module.time()
    if (
        not force_refresh
        and _filters_cache
        and _filters_cache[0] > now
    ):
        return _filters_cache[1]
    data = _get("space/search/filters")
    if not isinstance(data, list):
        data = []
    _filters_cache = (now + _CACHE_TTL_SEC, data)
    return data


def resolve_filter_ids(filters: str | list[int] | None) -> list[int]:
    """
    Resolve comma-separated filter names/ids to integer ids.
    Empty → [].
    """
    if filters is None or filters == "" or filters == []:
        return []
    if isinstance(filters, list):
        return [int(x) for x in filters]
    raw = str(filters).strip()
    if not raw:
        return []
    known = fetch_space_search_filters()
    by_name = {_norm(f.get("name") or ""): int(f["id"]) for f in known if f.get("id") is not None}
    by_id = {int(f["id"]): int(f["id"]) for f in known if f.get("id") is not None}
    out: list[int] = []
    for part in re.split(r"[,;|]+", raw):
        p = part.strip()
        if not p:
            continue
        try:
            fid = int(p)
            if fid in by_id or True:  # allow unknown numeric ids
                out.append(fid)
            continue
        except ValueError:
            pass
        key = _norm(p)
        # fuzzy: accessible, power, wheelchair, plug
        if key in by_name:
            out.append(by_name[key])
            continue
        for n, fid in by_name.items():
            if key in n or n in key:
                out.append(fid)
                break
        else:
            if "access" in key or "wheel" in key:
                for n, fid in by_name.items():
                    if "access" in n:
                        out.append(fid)
                        break
            elif "power" in key or "plug" in key or "outlet" in key:
                for n, fid in by_name.items():
                    if "power" in n or "plug" in n:
                        out.append(fid)
                        break
    # dedupe preserve order
    seen = set()
    uniq = []
    for x in out:
        if x not in seen:
            seen.add(x)
            uniq.append(x)
    return uniq


def fetch_hourly_space_search(
    location_lid: int,
    *,
    date_str: str,
    time_start: str,
    time_end: str,
    category_id: int | None = None,
    zone_id: int | None = None,
    capacity_range: int = 0,
    filter_ids: list[int] | None = None,
    space_type: str = "space",
) -> dict:
    """
    GET /space/search/hourly/{lid}

    Returns {exact_matches: [...], other_matches: [...]}.
    """
    params: dict[str, Any] = {
        "date": date_str,
        "time_start": time_start,
        "time_end": time_end,
        "type": space_type if space_type in ("space", "seat") else "space",
        "capacity": max(0, min(int(capacity_range or 0), 4)),
    }
    if category_id is not None:
        params["category_id"] = int(category_id)
    if zone_id is not None:
        params["zone_id"] = int(zone_id)
    if filter_ids:
        # requests encodes list as filters=a&filters=b
        params["filters"] = [int(f) for f in filter_ids]

    data = _get(f"space/search/hourly/{int(location_lid)}", params)
    if not isinstance(data, dict):
        return {"exact_matches": [], "other_matches": []}
    return {
        "exact_matches": list(data.get("exact_matches") or []),
        "other_matches": list(data.get("other_matches") or []),
    }


def format_space_search_filters() -> str:
    try:
        filters = fetch_space_search_filters()
    except Exception as e:
        return f"Error: Failed to fetch space search filters: {e}"
    lines = [
        "# LibCal space search filters",
        "* **Source**: `GET /space/search/filters`",
        "* Pass filter **id**(s) to `search_space_availability` via `filters`.",
        "",
    ]
    if not filters:
        lines.append("No search filters configured in this LibCal system.")
        return "\n".join(lines)
    for f in filters:
        lines.append(
            f"- **{f.get('name')}** — id `{f.get('id')}`"
            + (f" · icon `{f.get('icon')}`" if f.get("icon") else "")
        )
    return "\n".join(lines)


def _format_match_row(match: dict) -> str:
    space = match.get("space") or {}
    cat = match.get("category") or {}
    name = space.get("name") or f"Item {space.get('id')}"
    iid = space.get("id")
    cap = space.get("capacity")
    cname = cat.get("name") or ""
    start = _parse_avail_iso(str(match.get("start") or ""))
    end = _parse_avail_iso(str(match.get("end") or ""))
    cap_s = f" · capacity {cap}" if cap not in (None, "") else ""
    cat_s = f" · {cname}" if cname else ""
    if start and end:
        la = start.astimezone(TZ) if start.tzinfo else start.replace(tzinfo=TZ)
        lb = end.astimezone(TZ) if end.tzinfo else end.replace(tzinfo=TZ)
        win = f"{_format_dt_12h(la)}–{_format_dt_12h(lb)}"
    else:
        win = f"{match.get('start')}–{match.get('end')}"
    return f"- **{name}** — item id `{iid}`{cap_s}{cat_s} · free **{win}**"


def format_search_space_availability(
    location: str,
    date_str: str = "today",
    time_start: str = "",
    time_end: str = "",
    category: str = "",
    capacity_range: int = 0,
    filters: str = "",
) -> str:
    """
    Search for spaces free during a time window (hourly search).

    Prefer this when the user gives an explicit start/end time.
    """
    if not location or not str(location).strip():
        return (
            "Error: `location` is required (e.g. Shannon, RMC, Georges, Brown, "
            "or a space lid)."
        )
    loc = resolve_space_location(location)
    if not loc:
        known = ", ".join(f"{l.get('name')} ({l.get('lid')})" for l in public_space_locations())
        return f"Error: Space location '{location}' not found. Known: {known}"

    day = parse_search_date(date_str)
    if not day:
        return f"Error: Invalid date {date_str!r}. Use today, tomorrow, or YYYY-MM-DD."

    ts = parse_time_hhmm(time_start)
    te = parse_time_hhmm(time_end)
    if not ts or not te:
        return (
            "Error: `time_start` and `time_end` are required "
            "(e.g. 17:00 and 20:00, or 5pm and 8pm)."
        )
    # LibCal may require start < end on same calendar day
    try:
        t0 = datetime.strptime(ts, "%H:%M")
        t1 = datetime.strptime(te, "%H:%M")
        if t1 <= t0:
            return (
                f"Error: time_end ({te}) must be after time_start ({ts}) "
                "on the same day."
            )
    except ValueError:
        return "Error: Invalid time format."

    lid = int(loc["lid"])
    cat_id = resolve_category_id(lid, category) if category else None
    if category and str(category).strip() and cat_id is None:
        return (
            f"Error: Category {category!r} not found at {loc.get('name')}. "
            "Call `get_space_categories` for valid names/ids."
        )

    filter_ids = resolve_filter_ids(filters)
    try:
        result = fetch_hourly_space_search(
            lid,
            date_str=day,
            time_start=ts,
            time_end=te,
            category_id=cat_id,
            capacity_range=int(capacity_range or 0),
            filter_ids=filter_ids or None,
        )
    except Exception as e:
        return f"Error: LibCal hourly space search failed: {e}"

    exact = result.get("exact_matches") or []
    other = result.get("other_matches") or []

    # Display times in 12h for the query summary
    def _disp(hhmm: str) -> str:
        h, m = map(int, hhmm.split(":"))
        return _format_dt_12h(datetime(2000, 1, 1, h, m, tzinfo=TZ))

    day_name = datetime.strptime(day, "%Y-%m-%d").strftime("%A")
    lines = [
        f"# Space availability search: {loc.get('name')}",
        f"- **Space location lid**: `{lid}`",
        f"- **Book / browse**: https://cal.lib.virginia.edu/spaces?lid={lid}",
        f"- **API**: `GET /space/search/hourly/{lid}`",
        f"- **Window**: {day} ({day_name}) {_disp(ts)}–{_disp(te)}",
    ]
    if cat_id is not None:
        lines.append(f"- **Category filter**: `{category}` (cid `{cat_id}`)")
    if filter_ids:
        lines.append(f"- **Amenity filters**: {filter_ids}")
    if int(capacity_range or 0) > 0:
        lines.append(
            f"- **Capacity range filter**: `{capacity_range}` "
            "(LibCal admin range 1–4, **not** exact seat count)"
        )
    lines.append("")
    lines.append(
        "**Exact matches** = free for the full requested window. "
        "**Other matches** = free for a partial/later window only."
    )
    lines.append("")

    lines.append(f"## Exact matches ({len(exact)})")
    if not exact:
        lines.append("- *(none for the full window)*")
    else:
        for m in exact:
            lines.append(_format_match_row(m if isinstance(m, dict) else {}))
    lines.append("")

    lines.append(f"## Other matches ({len(other)})")
    if not other:
        lines.append("- *(none)*")
    else:
        for m in other:
            lines.append(_format_match_row(m if isinstance(m, dict) else {}))
    lines.append("")

    if not exact and not other:
        lines.append(
            "No spaces matched. Try a different time window, date, or building. "
            "You can also use `list_space_items` with `availability=today` to browse free slots. "
            "For named Makerspace printers, try `list_space_seats` / `search_space_availability` "
            "with type seat (use list_space_seats + get_space_seat)."
        )
    else:
        lines.append(
            f"**Summary**: {len(exact)} exact · {len(other)} partial/other. "
            "Patrons must complete reservations in LibCal — this tool does not book."
        )
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Seats (UVA: named Makerspace equipment — not study-room chairs)
# ---------------------------------------------------------------------------


def location_has_seats(location_lid: int) -> bool:
    """True if /space/seats/{lid} returns data (not 'Seat not found')."""
    try:
        seats = fetch_space_seats(int(location_lid), availability=None)
        return bool(seats)
    except Exception:
        return False


def fetch_space_seats(
    location_lid: int,
    *,
    availability: str | None = None,
    space_id: int | None = None,
    category_id: int | None = None,
    zone_id: int | None = None,
    page_size: int = 100,
    page_index: int = 0,
    force_refresh: bool = False,
) -> list[dict]:
    """
    GET /space/seats/{lid}

    At UVA only Scholars' Lab Makerspace (264) currently returns seats.
    Other locations typically HTTP 400 "Seat not found".
    """
    lid = int(location_lid)
    avail = (availability or "").strip() or None
    params: dict[str, Any] = {
        "page_size": max(1, min(int(page_size or 100), 100)),
        "page_index": max(0, int(page_index or 0)),
    }
    if avail:
        params["availability"] = avail
    if space_id is not None:
        params["space_id"] = int(space_id)
    if category_id is not None:
        params["category_id"] = int(category_id)
    if zone_id is not None:
        params["zone_id"] = int(zone_id)

    cacheable = not avail and space_id is None and category_id is None and page_index == 0
    now = time_module.time()
    if (
        cacheable
        and not force_refresh
        and lid in _seats_cache
        and _seats_cache[lid][0] > now
    ):
        return _seats_cache[lid][1]

    try:
        data = _get(f"space/seats/{lid}", params)
    except requests.HTTPError as e:
        # 400 Seat not found when location has no seats
        status = getattr(e.response, "status_code", None)
        if status == 400:
            if cacheable:
                _seats_cache[lid] = (now + _CACHE_TTL_SEC, [])
            return []
        raise

    seats: list[dict] = []
    if isinstance(data, list):
        for block in data:
            if isinstance(block, dict) and block.get("id") is not None:
                seats.append(block)
    elif isinstance(data, dict) and data.get("id") is not None:
        seats.append(data)

    if cacheable:
        _seats_cache[lid] = (now + _CACHE_TTL_SEC, seats)
    return seats


def fetch_space_seat(
    seat_id: int,
    *,
    availability: str | None = None,
    force_refresh: bool = False,
) -> dict | None:
    """GET /space/seat/{id} with optional availability."""
    sid = int(seat_id)
    avail = (availability or "").strip() or None
    params: dict[str, Any] = {}
    if avail:
        params["availability"] = avail

    cache_key = f"{sid}|{avail or 'meta'}"
    now = time_module.time()
    if (
        not force_refresh
        and not avail
        and cache_key in _seat_detail_cache
        and _seat_detail_cache[cache_key][0] > now
    ):
        return _seat_detail_cache[cache_key][1]

    try:
        data = _get(f"space/seat/{sid}", params or None)
    except requests.HTTPError as e:
        if getattr(e.response, "status_code", None) == 400:
            return None
        raise

    seat: dict | None = None
    if isinstance(data, list) and data and isinstance(data[0], dict):
        if data[0].get("error"):
            return None
        seat = data[0]
    elif isinstance(data, dict) and data.get("id") is not None:
        seat = data

    if seat and not avail:
        _seat_detail_cache[cache_key] = (now + _ITEM_DETAIL_CACHE_TTL_SEC, seat)
    return seat


def resolve_space_seat(
    seat: str | int,
    *,
    location: str = "",
) -> dict | None:
    """Resolve seat id or equipment name (e.g. Big Bird, Kermit)."""
    try:
        sid = int(str(seat).strip())
        found = fetch_space_seat(sid, availability=None)
        if found:
            return found
    except (TypeError, ValueError):
        pass

    name_key = _norm(str(seat))
    if not name_key:
        return None

    if location and str(location).strip():
        loc = resolve_space_location(location)
        search_lids = [int(loc["lid"])] if loc else []
    else:
        # Prefer known seat-capable location(s); fall back to all public
        search_lids = []
        for pub in public_space_locations():
            try:
                if fetch_space_seats(int(pub["lid"]), availability=None):
                    search_lids.append(int(pub["lid"]))
            except Exception:
                continue
        if not search_lids:
            search_lids = [int(p["lid"]) for p in public_space_locations() if p.get("lid")]

    candidates: list[tuple[int, dict]] = []
    for lid in search_lids:
        try:
            seats = fetch_space_seats(lid, availability=None)
        except Exception:
            continue
        for s in seats:
            n = _norm(s.get("name") or "")
            if not n:
                continue
            if n == name_key:
                candidates.append((0, s))
            elif name_key in n or n.startswith(name_key):
                candidates.append((1, s))
            else:
                # "big bird" / "prusa xl" / "button"
                tokens = [t for t in re.split(r"[^a-z0-9]+", name_key) if t]
                if tokens and all(t in n for t in tokens):
                    candidates.append((2, s))
    if not candidates:
        return None
    candidates.sort(key=lambda t: (t[0], len(t[1].get("name") or "")))
    return candidates[0][1]


def format_space_seats(
    location: str = "Makerspace",
    *,
    availability: str = "today",
    only_with_availability: bool = False,
) -> str:
    """List LibCal seats at a location (named Makerspace equipment at UVA)."""
    loc_query = (location or "Makerspace").strip() or "Makerspace"
    loc = resolve_space_location(loc_query)
    if not loc:
        known = ", ".join(f"{l.get('name')} ({l.get('lid')})" for l in public_space_locations())
        return f"Error: Space location '{location}' not found. Known: {known}"

    lid = int(loc["lid"])
    avail_raw = (availability or "today").strip()
    if avail_raw.lower() in ("none", "meta", "off", "false", "0"):
        libcal_avail: str | None = None
        avail_label = "metadata only (no free/busy)"
    else:
        libcal_avail = _normalize_availability_arg(avail_raw)
        avail_label = libcal_avail

    try:
        seats = fetch_space_seats(lid, availability=libcal_avail, page_size=100)
    except Exception as e:
        return f"Error: Failed to fetch seats for {loc.get('name')}: {e}"

    if not seats:
        return (
            f"# Seats: {loc.get('name')}\n"
            f"- **Space location lid**: `{lid}`\n"
            f"- **Result**: No LibCal **seats** at this location "
            f"(`GET /space/seats/{lid}` → empty / not configured).\n\n"
            "At UVA, seats are used mainly for **named Makerspace equipment** "
            "(3D printers, button makers). Study rooms and most libraries use "
            "**spaces** instead — try `list_space_items` or `search_space_availability`."
        )

    if only_with_availability and libcal_avail:
        seats = [
            s
            for s in seats
            if isinstance(s.get("availability"), list) and len(s.get("availability") or []) > 0
        ]

    lines = [
        f"# Seats (named equipment): {loc.get('name')}",
        f"- **Space location lid**: `{lid}`",
        f"- **Book / browse**: https://cal.lib.virginia.edu/spaces?lid={lid}",
        f"- **API**: `GET /space/seats/{lid}`",
        f"- **Availability query**: `{avail_label}`",
        f"- **Count**: {len(seats)} seat(s)",
        "",
        "These are LibCal **seats** (e.g. individual printers), not study-room chairs. "
        "Grouped products (3D Printers / Laser Cutter) may also appear under `list_space_items`.",
        "",
    ]

    open_count = 0
    for s in sorted(seats, key=lambda x: str(x.get("name") or "")):
        sid = s.get("id")
        name = s.get("name") or f"Seat {sid}"
        status = s.get("status") or ""
        st_s = f" · status {status}" if status else ""
        has_free = bool(s.get("availability"))
        if has_free:
            open_count += 1
        free_flag = " · **has free slots**" if has_free and libcal_avail else ""
        lines.append(f"- **{name}** — seat id `{sid}`{st_s}{free_flag}")
        if libcal_avail:
            # reuse window formatter (same slot shape as spaces)
            lines.extend(_format_item_free_windows(s, max_windows=5))
    lines.append("")

    if libcal_avail:
        lines.append(
            f"**Summary**: {open_count} of {len(seats)} seat(s) have free slots for "
            f"`{avail_label}`. Use `get_space_seat` for full equipment instructions. "
            "Booking is completed in LibCal."
        )
    else:
        lines.append(
            "Use seat ids with `get_space_seat`, or re-call with `availability=today` "
            "for free times."
        )
    return "\n".join(lines)


def format_space_seat(
    seat: str,
    availability: str = "today",
    location: str = "",
) -> str:
    """Details + free times for one LibCal seat (named equipment)."""
    raw = (seat or "").strip()
    if not raw:
        return "Error: `seat` is required (seat id or equipment name, e.g. Big Bird, Kermit)."

    resolved = resolve_space_seat(raw, location=location)
    if not resolved:
        return (
            f"Error: Could not find seat {raw!r}. "
            "At UVA seats are mainly Makerspace equipment — try "
            "`list_space_seats(location='Makerspace')` for names and ids. "
            "Study rooms use `list_space_items` / `get_space_item` instead."
        )

    seat_id = int(resolved["id"])
    avail_raw = (availability or "today").strip()
    if avail_raw.lower() in ("none", "meta", "off", "false", "0"):
        libcal_avail: str | None = None
        avail_label = "metadata only (no free/busy)"
    else:
        libcal_avail = _normalize_availability_arg(avail_raw)
        avail_label = libcal_avail

    try:
        detail = fetch_space_seat(seat_id, availability=libcal_avail) or resolved
    except Exception as e:
        return f"Error: Failed to fetch seat {seat_id}: {e}"

    name = detail.get("name") or f"Seat {seat_id}"
    # Find parent location for booking link
    loc_lid = None
    loc_name = None
    for pub in public_space_locations():
        try:
            for s in fetch_space_seats(int(pub["lid"]), availability=None):
                if int(s.get("id") or -1) == seat_id:
                    loc_lid = pub.get("lid")
                    loc_name = pub.get("name")
                    break
        except Exception:
            continue
        if loc_lid is not None:
            break

    lines = [
        f"# Seat (equipment): {name}",
        f"- **Seat id**: `{detail.get('id')}`",
    ]
    if loc_name or loc_lid:
        lines.append(f"- **Location**: {loc_name or ''} (space lid `{loc_lid}`)")
    if loc_lid:
        lines.append(f"- **Book**: https://cal.lib.virginia.edu/spaces?lid={loc_lid}")
    if detail.get("status"):
        lines.append(f"- **Status**: {detail.get('status')}")
    lines.append(f"- **Availability query**: `{avail_label}`")

    desc = _strip_html(detail.get("description"))
    if desc:
        if len(desc) > 1500:
            desc = desc[:1500].rstrip() + "…"
        lines.append(f"- **Description / how-to**: {desc}")

    lines.append("")
    if libcal_avail is None:
        lines.append(
            "*Free/busy not requested.* Pass availability=`today`, a date, range, or `next_only`."
        )
    else:
        slots = detail.get("availability")
        merged = merge_availability_slots(slots if isinstance(slots, list) else None)
        lines.append("## Free (bookable) times")
        if not merged:
            lines.append(
                "- **No free slots** in this range (in use, held, or outside bookable hours)."
            )
        else:
            by_day: dict[str, list[tuple[datetime, datetime]]] = {}
            for a, b in merged:
                la = a.astimezone(TZ) if a.tzinfo else a.replace(tzinfo=TZ)
                lb = b.astimezone(TZ) if b.tzinfo else b.replace(tzinfo=TZ)
                by_day.setdefault(la.date().isoformat(), []).append((la, lb))
            for day_key in sorted(by_day.keys()):
                day_name = datetime.strptime(day_key, "%Y-%m-%d").strftime("%A")
                lines.append(f"### {day_key} ({day_name})")
                for la, lb in by_day[day_key]:
                    lines.append(f"- {_format_dt_12h(la)}–{_format_dt_12h(lb)}")
                lines.append("")
            lines.append(
                f"*{len(merged)} open window(s) "
                f"(merged from {len(slots or [])} free slot(s)).*"
            )

    lines.extend(
        [
            "",
            "Patrons complete reservations in LibCal. This tool does not book equipment.",
        ]
    )
    return "\n".join(lines)
