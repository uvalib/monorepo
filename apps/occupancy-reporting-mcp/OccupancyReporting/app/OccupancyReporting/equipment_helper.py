# equipment_helper.py
"""
LibCal Equipment API — borrowable / in-library equipment locations, categories,
and items (cameras, chargers, makerspace tools, etc.).

Uses the same LibCal system id / API key as hours_helper and spaces_helper.
Equipment location lids often match space location lids at UVA (e.g. 241 RMC,
264 Makerspace, 1076 Shannon) but equipment and spaces are separate product
modules — do not mix equipment item ids with space item ids or seat ids.

Public UI: https://cal.lib.virginia.edu/equipment?lid={lid}
API:
  GET /api/1.0/equipment/locations
  GET /api/1.0/equipment/categories/{lid}
  GET /api/1.0/equipment/category/{cid}?availability=...
  GET /api/1.0/equipment/items/{lid}?availability=...
  GET /api/1.0/equipment/item/{id}?availability=...
"""

from __future__ import annotations

import os
import re
import time as time_module
from datetime import date, datetime, timedelta
from typing import Any
from zoneinfo import ZoneInfo

import requests

# Reuse credentials + formatting helpers from spaces
try:
    from hours_helper import LIBCAL_IID, LIBCAL_KEY
except Exception:  # pragma: no cover
    LIBCAL_IID = os.getenv("LIBCAL_IID", "863")
    LIBCAL_KEY = os.getenv(
        "LIBCAL_KEY", "e4b27d40b7099e8e392113da2f8bf30a"
    )

try:
    from spaces_helper import (
        TZ,
        _format_dt_12h,
        _norm,
        _normalize_availability_arg,
        _strip_html,
        merge_availability_slots,
    )
except Exception:  # pragma: no cover
    TZ = ZoneInfo("America/New_York")

    def _strip_html(raw: str | None) -> str:
        if not raw:
            return ""
        text = re.sub(r"<br\s*/?>", "\n", raw, flags=re.I)
        text = re.sub(r"</p\s*>", "\n", text, flags=re.I)
        text = re.sub(r"<[^>]+>", "", text)
        return re.sub(r"[ \t]+", " ", text).strip()

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

    def merge_availability_slots(slots):  # type: ignore[no-redef]
        return []

    def _normalize_availability_arg(availability: str) -> str:
        return (availability or date.today().isoformat()).strip() or date.today().isoformat()

    def _format_dt_12h(dt: datetime) -> str:
        hour = dt.hour % 12 or 12
        am_pm = "AM" if dt.hour < 12 else "PM"
        return f"{hour}:{dt.minute:02d} {am_pm}"


LIBCAL_BASE = os.getenv(
    "LIBCAL_BASE_URL", "https://cal.lib.virginia.edu/api/1.0"
).rstrip("/")

_USER_AGENT = "UVA-Library-MCP/1.0 (equipment_helper)"

_locations_cache: tuple[float, list[dict]] | None = None
_categories_cache: dict[str, tuple[float, list[dict]]] = {}
_items_cache: dict[str, tuple[float, list[dict]]] = {}
_item_detail_cache: dict[str, tuple[float, dict]] = {}
_CACHE_TTL_SEC = 3600.0
_ITEM_DETAIL_CACHE_TTL_SEC = 300.0

# Free-text aliases → preferred location name tokens (same family as spaces)
_EQUIP_ALIASES: dict[str, str] = {
    "shannon": "Shannon",
    "main": "Shannon",
    "alderman": "Shannon",
    "clemons": "Clemons",
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
    "scholarslab": "Makerspace",
    "scholars": "Makerspace",
    "slab": "Makerspace",
    "makerspace": "Makerspace",
    "tinkertank": "Makerspace",
}


def _get(path: str, params: dict | None = None) -> Any:
    p = dict(params or {})
    p.setdefault("iid", LIBCAL_IID)
    p.setdefault("key", LIBCAL_KEY)
    url = f"{LIBCAL_BASE}/{path.lstrip('/')}"
    resp = requests.get(
        url,
        params=p,
        headers={"User-Agent": _USER_AGENT},
        timeout=25,
    )
    resp.raise_for_status()
    return resp.json()


def booking_url(location_lid: int | str | None = None) -> str:
    if location_lid is not None and str(location_lid).strip():
        return f"https://cal.lib.virginia.edu/equipment?lid={location_lid}"
    return "https://cal.lib.virginia.edu/equipment"


# ---------------------------------------------------------------------------
# Locations
# ---------------------------------------------------------------------------


def fetch_equipment_locations(force_refresh: bool = False) -> list[dict]:
    """GET /equipment/locations?details=1. Cached ~1 hour."""
    global _locations_cache
    now = time_module.time()
    if (
        not force_refresh
        and _locations_cache
        and _locations_cache[0] > now
    ):
        return _locations_cache[1]

    data = _get("equipment/locations", {"details": 1})
    if not isinstance(data, list):
        data = []
    _locations_cache = (now + _CACHE_TTL_SEC, data)
    return data


def public_equipment_locations() -> list[dict]:
    return [loc for loc in fetch_equipment_locations() if loc.get("public") == 1]


def resolve_equipment_location(location: str | int | None) -> dict | None:
    """Resolve free-text name or numeric equipment lid to a location dict."""
    if location is None or (isinstance(location, str) and not str(location).strip()):
        return None

    locs = fetch_equipment_locations()
    try:
        lid = int(str(location).strip())
        for loc in locs:
            if int(loc.get("lid") or -1) == lid:
                return loc
    except (TypeError, ValueError):
        pass

    raw = str(location).strip()
    raw_key = _norm(raw)
    alias_token = _EQUIP_ALIASES.get(raw_key)
    key = _norm(alias_token) if alias_token else raw_key

    def _score(loc: dict) -> tuple:
        name = loc.get("name") or ""
        n = _norm(name)
        public = 0 if loc.get("public") == 1 else 1
        if n == key or n == raw_key:
            return (0, public, 0)
        if n.startswith(key) or n.startswith(raw_key):
            return (1, public, len(n))
        first = _norm(name.split("(")[0].split()[0] if name else "")
        if first and first == key:
            return (2, public, len(n))
        if key in n or raw_key in n:
            return (3, public, len(n))
        return (9, public, 999)

    ranked = sorted(locs, key=_score)
    best = ranked[0] if ranked else None
    if not best or _score(best)[0] >= 9:
        return None
    return best


# ---------------------------------------------------------------------------
# Categories
# ---------------------------------------------------------------------------


def fetch_equipment_categories(
    location_ids: list[int],
    *,
    details: bool = True,
    include_admin_only: bool = False,
    force_refresh: bool = False,
) -> list[dict]:
    """
    GET /equipment/categories/{id} for one or more equipment location lids.
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
    data = _get(f"equipment/categories/{lids_key}", params)
    if not isinstance(data, list):
        data = []
    _categories_cache[cache_key] = (now + _CACHE_TTL_SEC, data)
    return data


def resolve_equipment_category_id(
    location_lid: int,
    category: str,
) -> int | None:
    """Resolve category name or cid at a location."""
    if not category or not str(category).strip():
        return None
    raw = str(category).strip()
    try:
        return int(raw)
    except ValueError:
        pass

    key = _norm(raw)
    blocks = fetch_equipment_categories([int(location_lid)], details=True)
    cats = []
    for block in blocks:
        cats.extend(block.get("categories") or [])
    candidates: list[tuple[int, dict]] = []
    for c in cats:
        n = _norm(c.get("name") or "")
        if not n:
            continue
        if n == key:
            candidates.append((0, c))
        elif key in n or n.startswith(key):
            candidates.append((1, c))
    if not candidates:
        return None
    candidates.sort(key=lambda t: (t[0], len(t[1].get("name") or "")))
    cid = candidates[0][1].get("cid")
    return int(cid) if cid is not None else None


def fetch_equipment_category(
    category_id: int,
    *,
    availability: str | None = None,
    details: bool = True,
    include_admin_only: bool = False,
) -> dict | None:
    """
    GET /equipment/category/{cid} — category metadata + items.
    Note: availability on this endpoint also forces details=true in LibCal.
    """
    cid = int(category_id)
    avail = (availability or "").strip() or None
    params: dict[str, Any] = {
        "details": 1 if details else 0,
        "admin_only": 1 if include_admin_only else 0,
    }
    if avail:
        params["availability"] = avail
        params["details"] = 1

    data = _get(f"equipment/category/{cid}", params)
    if isinstance(data, list) and data and isinstance(data[0], dict):
        if data[0].get("error"):
            return None
        return data[0]
    if isinstance(data, dict) and data.get("cid") is not None:
        return data
    return None


def format_equipment_categories(
    location: str = "",
    *,
    public_only: bool = True,
    include_admin_only: bool = False,
) -> str:
    """Markdown: equipment categories for one location or all public locations."""
    try:
        if location and str(location).strip():
            loc = resolve_equipment_location(location)
            if not loc:
                known = ", ".join(
                    f"{l.get('name')} (lid={l.get('lid')})"
                    for l in public_equipment_locations()
                )
                return (
                    f"Error: Equipment location '{location}' not found.\n"
                    f"Known public LibCal equipment locations: {known}\n"
                    "Note: equipment lids often match space lids but equipment "
                    "item ids are not space item ids."
                )
            lids = [int(loc["lid"])]
            header_scope = loc.get("name") or str(loc.get("lid"))
        else:
            pubs = public_equipment_locations()
            lids = [int(l["lid"]) for l in pubs if l.get("lid") is not None]
            header_scope = "all public locations"

        blocks = fetch_equipment_categories(
            lids,
            details=True,
            include_admin_only=include_admin_only,
        )
    except Exception as e:
        return f"Error: Failed to fetch LibCal equipment categories: {e}"

    lines = [
        "# UVA Library equipment categories (LibCal)",
        f"* **Scope**: {header_scope}",
        f"* **Source**: LibCal Equipment API (`/equipment/categories/{{lid}}`)",
        f"* **Booking UI**: https://cal.lib.virginia.edu/equipment?lid={{equipment_lid}}",
        "* **Note**: These are **equipment categories** (cameras, chargers, "
        "makerspace tools, walk-up vs reserve), not study rooms. Study rooms → "
        "`list_space_items`. Named Makerspace 3D printers → `list_space_seats`.",
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
        lines.append(f"- **Equipment location lid**: `{lid}`")
        lines.append(f"- **Book / browse**: {booking_url(lid)}")
        if not cats:
            lines.append("- *(No public equipment categories for this location.)*")
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
            # Heuristic: name often says "No Reservations"
            if "no reservation" in (cname or "").lower():
                lines.append(
                    "- **Reservations**: typically **walk-up / no booking** "
                    "(confirm on the LibCal page)"
                )
            elif formid and int(formid) != 0:
                lines.append("- **Reservations**: bookable via LibCal form")
            terms = _strip_html(cat.get("termsAndConditions"))
            if terms:
                if len(terms) > 600:
                    terms = terms[:600].rstrip() + "…"
                lines.append(f"- **Terms / policies**: {terms}")
            lines.append("")
            shown += 1
        lines.append("")

    if shown == 0:
        lines.append(
            "No public equipment categories found. Try another location "
            "(RMC has the richest reserve/walk-up equipment sets)."
        )
    else:
        lines.append(
            f"**Total public categories listed**: {shown}. "
            "Browse items with `list_equipment_items(location=…)` or "
            "`get_equipment_category` / `get_equipment_item`."
        )
    return "\n".join(lines)


def format_equipment_category(
    category: str,
    *,
    location: str = "",
    availability: str = "none",
) -> str:
    """Details + items for one equipment category via GET /equipment/category/{cid}."""
    raw = (category or "").strip()
    if not raw:
        return (
            "Error: `category` is required (category id or name, e.g. "
            "'Reserve Cameras', '3D Printers', or a cid like 489)."
        )

    loc = resolve_equipment_location(location) if location and str(location).strip() else None
    cid: int | None = None
    try:
        cid = int(raw)
    except ValueError:
        # Need a location to resolve name
        search_lids: list[int] = []
        if loc:
            search_lids = [int(loc["lid"])]
        else:
            search_lids = [
                int(p["lid"]) for p in public_equipment_locations() if p.get("lid")
            ]
        for lid in search_lids:
            found = resolve_equipment_category_id(lid, raw)
            if found is not None:
                cid = found
                if not loc:
                    loc = next(
                        (p for p in public_equipment_locations() if int(p["lid"]) == lid),
                        None,
                    )
                break

    if cid is None:
        return (
            f"Error: Could not resolve equipment category {raw!r}. "
            "Pass a cid, or a name with `location` (e.g. location='RMC', "
            "category='Reserve Cameras'). Use `get_equipment_categories`."
        )

    avail_raw = (availability or "none").strip()
    if avail_raw.lower() in ("none", "meta", "off", "false", "0", ""):
        libcal_avail: str | None = None
        avail_label = "metadata only (no free/busy)"
    else:
        libcal_avail = _normalize_availability_arg(avail_raw)
        avail_label = libcal_avail

    try:
        detail = fetch_equipment_category(cid, availability=libcal_avail, details=True)
    except Exception as e:
        return f"Error: Failed to fetch equipment category {cid}: {e}"

    if not detail:
        return f"Error: No data for equipment category id `{cid}`."

    cname = detail.get("name") or f"Category {cid}"
    items = list(detail.get("items") or [])
    lines = [
        f"# Equipment category: {cname}",
        f"- **Category id (cid)**: `{detail.get('cid')}`",
    ]
    if loc:
        lines.append(
            f"- **Location**: {loc.get('name')} (equipment lid `{loc.get('lid')}`)"
        )
        lines.append(f"- **Book / browse**: {booking_url(loc.get('lid'))}")
    else:
        lines.append(f"- **Book / browse**: {booking_url()}")
    if detail.get("public") is not None:
        lines.append(f"- **Public**: {bool(detail.get('public'))}")
    formid = detail.get("formid")
    if formid and int(formid) != 0:
        lines.append(f"- **Booking form id**: `{formid}`")
    terms = _strip_html(detail.get("termsAndConditions"))
    if terms:
        if len(terms) > 800:
            terms = terms[:800].rstrip() + "…"
        lines.append(f"- **Terms / policies**: {terms}")
    lines.append(f"- **Availability query**: `{avail_label}`")
    lines.append(f"- **Items**: {len(items)}")
    lines.append("")

    open_count = 0
    for it in sorted(items, key=lambda x: str(x.get("name") or "")):
        iid = it.get("id")
        name = it.get("name") or f"Item {iid}"
        has_free = bool(it.get("availability"))
        if has_free:
            open_count += 1
        free_flag = " · **has free slots**" if has_free and libcal_avail else ""
        model = it.get("model") or ""
        model_s = f" · model {model}" if model else ""
        lines.append(f"- **{name}** — equipment item id `{iid}`{model_s}{free_flag}")
        if libcal_avail:
            lines.extend(_format_equip_free_windows(it, max_windows=4))
    lines.append("")

    if libcal_avail:
        lines.append(
            f"**Summary**: {open_count} of {len(items)} item(s) have free slots for "
            f"`{avail_label}`. Use `get_equipment_item` for full instructions. "
            "This tool does not reserve equipment."
        )
    else:
        lines.append(
            "Use item ids with `get_equipment_item`, or re-call with "
            "`availability=today` / a date for free times."
        )
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Items
# ---------------------------------------------------------------------------


def fetch_equipment_items(
    location_lid: int,
    *,
    availability: str | None = None,
    category_id: int | None = None,
    visibility: str = "public",
    page_size: int = 100,
    page_index: int = 0,
    force_refresh: bool = False,
) -> list[dict]:
    """GET /equipment/items/{lid}."""
    lid = int(location_lid)
    avail = (availability or "").strip() or None
    vis = (visibility or "public").strip().lower() or "public"
    params: dict[str, Any] = {
        "page_size": max(1, min(int(page_size or 100), 100)),
        "page_index": max(0, int(page_index or 0)),
        "visibility": vis,
    }
    if avail:
        params["availability"] = avail
    if category_id is not None:
        params["category_id"] = int(category_id)

    cacheable = (
        not avail
        and category_id is None
        and page_index == 0
        and vis == "public"
    )
    cache_key = f"{lid}|{vis}|{page_index}|{page_size}"
    now = time_module.time()
    if (
        cacheable
        and not force_refresh
        and cache_key in _items_cache
        and _items_cache[cache_key][0] > now
    ):
        return _items_cache[cache_key][1]

    data = _get(f"equipment/items/{lid}", params)
    items: list[dict] = []
    if isinstance(data, list):
        for block in data:
            if isinstance(block, dict) and block.get("id") is not None:
                items.append(block)
    elif isinstance(data, dict) and data.get("id") is not None:
        items.append(data)

    if cacheable:
        _items_cache[cache_key] = (now + _CACHE_TTL_SEC, items)
    return items


def fetch_equipment_item(
    item_id: int | str,
    *,
    availability: str | None = None,
    force_refresh: bool = False,
) -> dict | None:
    """GET /equipment/item/{id}."""
    sid = str(item_id).strip()
    avail = (availability or "").strip() or None
    params: dict[str, Any] = {}
    if avail:
        params["availability"] = avail

    cache_key = f"{sid}|{avail or 'meta'}"
    now = time_module.time()
    if (
        not force_refresh
        and not avail
        and cache_key in _item_detail_cache
        and _item_detail_cache[cache_key][0] > now
    ):
        return _item_detail_cache[cache_key][1]

    try:
        data = _get(f"equipment/item/{sid}", params or None)
    except requests.HTTPError as e:
        if getattr(e.response, "status_code", None) in (400, 404):
            return None
        raise

    item: dict | None = None
    if isinstance(data, list) and data and isinstance(data[0], dict):
        if data[0].get("error"):
            return None
        item = data[0]
    elif isinstance(data, dict) and data.get("id") is not None:
        item = data

    if item and not avail:
        _item_detail_cache[cache_key] = (now + _ITEM_DETAIL_CACHE_TTL_SEC, item)
    return item


def resolve_equipment_item(
    item: str | int,
    *,
    location: str = "",
) -> dict | None:
    """Resolve equipment item id or name (e.g. Cameo 4, Canon C100 #1)."""
    try:
        iid = int(str(item).strip())
        found = fetch_equipment_item(iid, availability=None)
        if found:
            return found
    except (TypeError, ValueError):
        pass

    name_key = _norm(str(item))
    if not name_key:
        return None

    if location and str(location).strip():
        loc = resolve_equipment_location(location)
        search_lids = [int(loc["lid"])] if loc else []
    else:
        search_lids = [
            int(p["lid"]) for p in public_equipment_locations() if p.get("lid")
        ]

    candidates: list[tuple[int, dict, dict]] = []  # score, item, loc
    for lid in search_lids:
        try:
            loc = next(
                (p for p in fetch_equipment_locations() if int(p.get("lid") or -1) == lid),
                {"lid": lid, "name": str(lid)},
            )
            items = fetch_equipment_items(lid, availability=None, page_size=100)
        except Exception:
            continue
        for it in items:
            n = _norm(it.get("name") or "")
            if not n:
                continue
            if n == name_key:
                candidates.append((0, it, loc))
            elif name_key in n or n.startswith(name_key):
                candidates.append((1, it, loc))
            else:
                tokens = [t for t in re.split(r"[^a-z0-9]+", name_key) if t]
                if tokens and all(t in n for t in tokens):
                    candidates.append((2, it, loc))
    if not candidates:
        return None
    candidates.sort(key=lambda t: (t[0], len(t[1].get("name") or "")))
    best_item, best_loc = candidates[0][1], candidates[0][2]
    # Attach location hints for formatters
    out = dict(best_item)
    out["_location_lid"] = best_loc.get("lid")
    out["_location_name"] = best_loc.get("name")
    return out


def _format_equip_free_windows(it: dict, *, max_windows: int = 6) -> list[str]:
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
                    "use `get_equipment_item` for the full schedule"
                )
                return lines
            lines.append(
                f"  - {day_key} ({day_name}) {_format_dt_12h(la)}–{_format_dt_12h(lb)}"
            )
            shown += 1
    return lines


def format_equipment_items(
    location: str,
    *,
    availability: str = "none",
    category: str = "",
    only_with_availability: bool = False,
) -> str:
    """List equipment items at a location via GET /equipment/items/{lid}."""
    if not location or not str(location).strip():
        return (
            "Error: `location` is required (e.g. RMC, Makerspace, Clemons, Shannon, "
            "Brown, Fine Arts, Music, or an equipment lid like 241)."
        )
    loc = resolve_equipment_location(location)
    if not loc:
        known = ", ".join(
            f"{l.get('name')} ({l.get('lid')})" for l in public_equipment_locations()
        )
        return f"Error: Equipment location '{location}' not found. Known: {known}"

    lid = int(loc["lid"])
    avail_raw = (availability or "none").strip()
    if avail_raw.lower() in ("none", "meta", "off", "false", "0", ""):
        libcal_avail: str | None = None
        avail_label = "metadata only (no free/busy)"
    else:
        libcal_avail = _normalize_availability_arg(avail_raw)
        avail_label = libcal_avail

    cat_id = resolve_equipment_category_id(lid, category) if category else None
    if category and str(category).strip() and cat_id is None:
        return (
            f"Error: Equipment category {category!r} not found at {loc.get('name')}. "
            "Call `get_equipment_categories` for valid category names/ids."
        )

    try:
        items = fetch_equipment_items(
            lid,
            availability=libcal_avail,
            category_id=cat_id,
            visibility="public",
            page_size=100,
        )
    except Exception as e:
        return f"Error: Failed to fetch equipment items for {loc.get('name')}: {e}"

    if only_with_availability and libcal_avail:
        items = [
            it
            for it in items
            if isinstance(it.get("availability"), list)
            and len(it.get("availability") or []) > 0
        ]

    lines = [
        f"# Equipment items: {loc.get('name')}",
        f"- **Equipment location lid**: `{lid}`",
        f"- **Book / browse**: {booking_url(lid)}",
        f"- **API**: `GET /equipment/items/{lid}`",
        f"- **Availability query**: `{avail_label}`",
    ]
    if cat_id is not None:
        lines.append(f"- **Category filter**: `{category}` (cid `{cat_id}`)")
    lines.append(f"- **Count**: {len(items)} item(s)")
    lines.append("")
    lines.append(
        "These are **LibCal equipment** items (cameras, chargers, makerspace tools), "
        "not study rooms. Study rooms → `list_space_items`. "
        "Named Makerspace 3D printers as seats → `list_space_seats`."
    )
    lines.append("")

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
            has_free = bool(it.get("availability"))
            if has_free:
                open_count += 1
            free_flag = " · **has free slots**" if has_free and libcal_avail else ""
            model = it.get("model") or ""
            model_s = f" · model {model}" if model else ""
            lines.append(f"- **{name}** — item id `{iid}`{model_s}{free_flag}")
            if libcal_avail:
                lines.extend(_format_equip_free_windows(it))
        lines.append("")

    if not items:
        lines.append(
            "No public equipment items returned for this location "
            "(some catalogs only list static/no-reservation gear, or none are free)."
        )
    elif libcal_avail:
        lines.append(
            f"**Summary**: {open_count} of {len(items)} item(s) have at least one free slot "
            f"for `{avail_label}`. Patrons book in LibCal — this tool does not reserve."
        )
    return "\n".join(lines)


def format_equipment_item(
    item: str,
    availability: str = "today",
    location: str = "",
) -> str:
    """Details + free times for one equipment item via GET /equipment/item/{id}."""
    raw = (item or "").strip()
    if not raw:
        return (
            "Error: `item` is required (equipment item id or name, e.g. "
            "133978 or 'Cameo 4', 'Canon C100 #1')."
        )

    resolved = resolve_equipment_item(raw, location=location)
    if not resolved:
        return (
            f"Error: Could not find equipment item {raw!r}. "
            "Try `list_equipment_items(location='RMC')` or Makerspace/Clemons. "
            "Study rooms are not equipment — use `list_space_items` / `get_space_item`."
        )

    item_id = resolved.get("id")
    avail_raw = (availability or "today").strip()
    if avail_raw.lower() in ("none", "meta", "off", "false", "0"):
        libcal_avail: str | None = None
        avail_label = "metadata only (no free/busy)"
    else:
        libcal_avail = _normalize_availability_arg(avail_raw)
        avail_label = libcal_avail

    try:
        detail = fetch_equipment_item(item_id, availability=libcal_avail) or resolved
    except Exception as e:
        return f"Error: Failed to fetch equipment item {item_id}: {e}"

    name = detail.get("name") or f"Item {item_id}"
    loc_lid = resolved.get("_location_lid")
    loc_name = resolved.get("_location_name")
    if loc_lid is None:
        # Reverse-lookup across public locations
        for pub in public_equipment_locations():
            try:
                for cand in fetch_equipment_items(int(pub["lid"]), availability=None):
                    if int(cand.get("id") or -1) == int(item_id):
                        loc_lid = pub.get("lid")
                        loc_name = pub.get("name")
                        break
            except Exception:
                continue
            if loc_lid is not None:
                break

    lines = [
        f"# Equipment item: {name}",
        f"- **Item id**: `{detail.get('id')}`",
    ]
    if loc_name or loc_lid:
        lines.append(f"- **Location**: {loc_name or ''} (equipment lid `{loc_lid}`)")
    if loc_lid:
        lines.append(f"- **Book**: {booking_url(loc_lid)}")
    else:
        lines.append(f"- **Book**: {booking_url()}")
    if detail.get("groupName"):
        lines.append(
            f"- **Category**: {detail.get('groupName')} "
            f"(group id `{detail.get('groupId')}`)"
            if detail.get("groupId") is not None
            else f"- **Category**: {detail.get('groupName')}"
        )
    if detail.get("model"):
        lines.append(f"- **Model**: {detail.get('model')}")
    if detail.get("barcode"):
        lines.append(f"- **Barcode**: `{detail.get('barcode')}`")
    if detail.get("replacement_cost"):
        lines.append(f"- **Replacement cost**: {detail.get('replacement_cost')}")
    formid = detail.get("formid")
    if formid and int(formid) != 0:
        lines.append(f"- **Booking form id**: `{formid}`")

    for label, key, limit in (
        ("Description", "description", 1200),
        ("Instructions", "instructions", 1000),
        ("Terms / policies", "termsAndConditions", 800),
        ("Group terms", "groupTermsAndConditions", 600),
        ("Location terms", "locationTermsAndConditions", 600),
    ):
        text = _strip_html(detail.get(key))
        if text:
            if len(text) > limit:
                text = text[:limit].rstrip() + "…"
            lines.append(f"- **{label}**: {text}")

    img = (detail.get("image") or "").strip()
    if img:
        if img.startswith("//"):
            img = "https:" + img
        lines.append(f"- **Image**: {img}")

    lines.append(f"- **Availability query**: `{avail_label}`")
    lines.append("")

    if libcal_avail is None:
        lines.append(
            "*Free/busy not requested.* Pass availability=`today`, a date, range, "
            "`next`, or `next_only`."
        )
    else:
        slots = detail.get("availability")
        merged = merge_availability_slots(slots if isinstance(slots, list) else None)
        lines.append("## Free (bookable) times")
        if not merged:
            lines.append(
                "- **No free slots** in this range (in use, held, walk-up only, "
                "or outside bookable hours). Many walk-up items are first-come."
            )
        else:
            by_day: dict[str, list[tuple[datetime, datetime]]] = {}
            for a, b in merged:
                la = a.astimezone(TZ) if a.tzinfo else a.replace(tzinfo=TZ)
                lb = b.astimezone(TZ) if b.tzinfo else b.replace(tzinfo=TZ)
                by_day.setdefault(la.date().isoformat(), []).append((la, lb))
            for day_key in sorted(by_day.keys()):
                day_name = datetime.strptime(day_key, "%Y-%m-%d").strftime("%A")
                windows = ", ".join(
                    f"{_format_dt_12h(a)}–{_format_dt_12h(b)}" for a, b in by_day[day_key]
                )
                lines.append(f"- **{day_key} ({day_name})**: {windows}")
        lines.append("")
        lines.append(
            "Patrons must complete booking in LibCal — this tool does **not** reserve equipment."
        )
    return "\n".join(lines)
