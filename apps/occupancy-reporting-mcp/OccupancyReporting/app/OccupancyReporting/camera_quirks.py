"""
Temporary camera data quirks.

These correct known hardware/config issues without changing the occupancy DB.
Remove each hack once the corresponding DB records / camera configs are cleaned up.

Quirks:
1. Direction inversion — Shannon 401 east entrance reports in/out reversed.
2. Location overrides — cameras stored under Shannon in `cameras` that should
   count toward Clemons as their base (pre-swap / non-swapped) location.
3. Hardware swap — on 2026-06-17 Fine Arts (172.29.8.29) and the Clemons-system
   camera at Shannon IP **172.29.3.57** were physically swapped; IPs stayed with
   buildings, MACs moved. Date-aware attribution is required because `cameras`
   still maps serials to pre-cleanup locations.

   Not the swap: 172.29.3.52 / B8A44F5D3154 (`b8:a4:4f:5d:31:54`) — that unit is
   the C113A staff connector (static Clemons override only).

Evidence for (3): both serials went offline ~2026-06-16 evening and returned
2026-06-23 with exchanged traffic-volume patterns. Post-swap, 172.29.3.57 reports
as serial B8A44F4F195D (the former Fine Arts MAC).
"""

from __future__ import annotations

from datetime import date, datetime
from typing import Iterable

import pandas as pd

# ---------------------------------------------------------------------------
# 1. Direction inversion (in/out swapped at the camera)
# ---------------------------------------------------------------------------
# process-occupancy.py: "Swap count_in and count_out for b8:a4:4f:5d:59:9e
# (401 east entrance) due to direction inversion"
#
# March 2026 audit (keep this invert — without it Shannon net is ~-15k; with
# it ~+11k; both biased, invert is closer to balanced). Residual Shannon
# in/out imbalance is likely hardware miscounts at 401 east (people counted
# preferentially as one direction), not fixed by more software swaps.
#
# Clemons main-entrance cameras are individually skewed (e.g. ACCC8EF00DA0
# ~7.6:1 in/out, ACCC8EF00E27 ~0.5:1) but CANCEL at building level (~1% net).
# Do not invert individual Clemons lanes without on-site verification.
INVERT_DIRECTION_SERIALS = frozenset({
    "b8:a4:4f:5d:59:9e",  # Shannon 401 east entrance
})

# Cameras that report nothing (dead / not counting). Excluded from serial
# lists so they don't inflate "camera count" or waste query work. Re-check
# periodically — they may come back after maintenance.
EXCLUDE_SERIALS = frozenset({
    "b8:a4:4f:5d:59:76",  # Shannon 401 central (Lead camera) — zero March 2026
    "b8:a4:4f:5d:59:94",  # Shannon C215 public connector Shannon side — zero
    "b8:a4:4f:5d:32:c6",  # Shannon 129 door to dock — zero
    "b8:a4:4f:5d:5a:00",  # Shannon C172A fire exit — zero
})

# ---------------------------------------------------------------------------
# 2. Static location overrides (serial → base location_short)
# ---------------------------------------------------------------------------
# Base = location ignoring the hardware swap below. Swap logic then reassigns
# post-swap rows to the partner's base location.
#
# b8:a4:4f:5d:31:54 (B8A44F5D3154) — C113A staff Clemons connector, Clemons side
#   (DB has Shannon). NOT involved in the Fine Arts hardware swap; was never at
#   the swap IP 172.29.3.57 (nor the previously mis-documented 172.29.3.52).
# b8:a4:4f:5d:59:90 (B8A44F5D5990) — base/historical home is Clemons (DB has
#   Shannon). Pre-swap lived at 172.29.3.57; after the Fine Arts swap it lives
#   at Fine Arts (172.29.8.29).
LOCATION_OVERRIDES = {
    "b8:a4:4f:5d:31:54": "Clemons",
    "b8:a4:4f:5d:59:90": "Clemons",
}

# ---------------------------------------------------------------------------
# 3. Hardware swap (date-aware location reassignment)
# ---------------------------------------------------------------------------
# Physical units exchanged on CAMERA_SWAP_DATE; building IPs kept their place:
#   Fine Arts IP 172.29.8.29  ↔  Clemons-system IP 172.29.3.57
#
# Pre-swap (serial → building, IP):
#   B8A44F4F195D          → Fine Arts  (172.29.8.29)
#   b8:a4:4f:5d:59:90     → Clemons    (172.29.3.57)
# Post-swap (effective from CAMERA_SWAP_DATE inclusive):
#   B8A44F4F195D          → Clemons    (now at 172.29.3.57)
#   b8:a4:4f:5d:59:90     → Fine Arts  (B8A44F5D5990 now at 172.29.8.29)
CAMERA_SWAP_DATE = date(2026, 6, 17)
CAMERA_SWAP_PAIRS = (
    ("B8A44F4F195D", "b8:a4:4f:5d:59:90"),
)


def normalize_serial(serial: str) -> str:
    """Normalize serial for comparison."""
    return (serial or "").strip()


def apply_location_overrides(mapping: dict[str, list[str]]) -> dict[str, list[str]]:
    """
    Reassign serials in a location_short → [serials] mapping per LOCATION_OVERRIDES.
    Also drops EXCLUDE_SERIALS (known-dead cameras).
    Returns a new mapping; does not mutate the input.
    """
    # Build serial → original location, preserving first-seen casing
    serial_meta: dict[str, tuple[str, str]] = {}  # norm → (original_serial, loc)
    for loc, serials in mapping.items():
        for s in serials:
            ns = normalize_serial(s)
            if ns in EXCLUDE_SERIALS:
                continue
            if ns not in serial_meta:
                serial_meta[ns] = (s, loc)

    # Apply overrides
    effective: dict[str, str] = {}
    for ns, (_, loc) in serial_meta.items():
        effective[ns] = LOCATION_OVERRIDES.get(ns, loc)

    # Rebuild lists; keep original library key order, then any new override targets
    ordered_locs: list[str] = list(mapping.keys())
    for new_loc in LOCATION_OVERRIDES.values():
        if new_loc not in ordered_locs:
            ordered_locs.append(new_loc)

    new_mapping: dict[str, list[str]] = {loc: [] for loc in ordered_locs}
    for ns, (original, _) in serial_meta.items():
        loc = effective[ns]
        if loc not in new_mapping:
            new_mapping[loc] = []
        new_mapping[loc].append(original)

    return {loc: serials for loc, serials in new_mapping.items() if serials}


def _swap_partner(serial: str) -> str | None:
    ns = normalize_serial(serial)
    for a, b in CAMERA_SWAP_PAIRS:
        if normalize_serial(a) == ns:
            return b
        if normalize_serial(b) == ns:
            return a
    return None


def _find_original_serial(mapping: dict[str, list[str]], normalized: str) -> str | None:
    for serials in mapping.values():
        for s in serials:
            if normalize_serial(s) == normalized:
                return s
    # Fall back to known swap pair casing
    for a, b in CAMERA_SWAP_PAIRS:
        if normalize_serial(a) == normalized:
            return a
        if normalize_serial(b) == normalized:
            return b
    return normalized


def base_location_for_serial(serial: str, mapping: dict[str, list[str]]) -> str | None:
    """Location for a serial after static overrides, ignoring hardware swap."""
    ns = normalize_serial(serial)
    if ns in LOCATION_OVERRIDES:
        return LOCATION_OVERRIDES[ns]
    for loc, serials in mapping.items():
        for s in serials:
            if normalize_serial(s) == ns:
                return loc
    return None


def effective_location_for_serial(
    serial: str,
    when: date | datetime,
    mapping: dict[str, list[str]],
) -> str | None:
    """
    Resolve the building a serial should count toward on a given date.
    Applies LOCATION_OVERRIDES and post-swap reassignment.
    """
    if isinstance(when, datetime):
        when = when.date()

    base = base_location_for_serial(serial, mapping)
    if base is None:
        return None

    if when < CAMERA_SWAP_DATE:
        return base

    partner = _swap_partner(serial)
    if partner is None:
        return base

    partner_base = base_location_for_serial(partner, mapping)
    return partner_base if partner_base is not None else base


def serials_for_library(
    library: str,
    mapping: dict[str, list[str]],
    start: date | None = None,
    end: date | None = None,
) -> list[str]:
    """
    Serials that may contribute to `library` over [start, end] (inclusive).

    Includes swap partners when the range intersects the post-swap period so
    callers can fetch rows and then filter by effective location per timestamp.
    """
    if library not in mapping:
        return []

    serials = list(mapping[library])
    needed = {normalize_serial(s) for s in serials}

    range_end = end or date.max
    intersects_post_swap = range_end >= CAMERA_SWAP_DATE

    if intersects_post_swap:
        for a, b in CAMERA_SWAP_PAIRS:
            a_base = base_location_for_serial(a, mapping)
            b_base = base_location_for_serial(b, mapping)
            # Post-swap: a lives at b_base, b lives at a_base
            if b_base == library and normalize_serial(a) not in needed:
                original = _find_original_serial(mapping, normalize_serial(a))
                if original:
                    serials.append(original)
                    needed.add(normalize_serial(a))
            if a_base == library and normalize_serial(b) not in needed:
                original = _find_original_serial(mapping, normalize_serial(b))
                if original:
                    serials.append(original)
                    needed.add(normalize_serial(b))

    _ = start  # reserved for pre-swap-only fetch optimizations
    return serials


def apply_direction_inversions(df: pd.DataFrame) -> pd.DataFrame:
    """Swap count_in/count_out for cameras with inverted direction config."""
    if df.empty or "serial_no" not in df.columns:
        return df

    df = df.copy()
    mask = df["serial_no"].astype(str).map(normalize_serial).isin(INVERT_DIRECTION_SERIALS)
    if mask.any():
        df.loc[mask, ["count_in", "count_out"]] = df.loc[mask, ["count_out", "count_in"]].values
    return df


def filter_metrics_for_library(
    df: pd.DataFrame,
    library: str,
    mapping: dict[str, list[str]],
) -> pd.DataFrame:
    """
    Keep only rawmetrics rows whose serial counts toward `library` on that row's date.

    Expects a `created_at` column (tz-aware or naive timestamps).
    """
    if df.empty:
        return df

    df = df.copy()
    created = pd.to_datetime(df["created_at"], utc=True)
    # Use America/New_York calendar date for swap boundary (cameras live in ET)
    dates = created.dt.tz_convert("America/New_York").dt.date
    serials = df["serial_no"].astype(str)

    # Fast path: serials not involved in date-aware swaps use a static location
    swap_serials = set()
    for a, b in CAMERA_SWAP_PAIRS:
        swap_serials.add(normalize_serial(a))
        swap_serials.add(normalize_serial(b))

    base_locs = {s: base_location_for_serial(s, mapping) for s in serials.unique()}
    is_swap = serials.map(lambda s: normalize_serial(s) in swap_serials)

    # Non-swap rows: base location only
    keep = pd.Series(False, index=df.index)
    non_swap = ~is_swap
    if non_swap.any():
        keep.loc[non_swap] = serials.loc[non_swap].map(base_locs) == library

    # Swap rows: resolve per date (small subset)
    if is_swap.any():
        swap_idx = df.index[is_swap]
        for i in swap_idx:
            keep.at[i] = (
                effective_location_for_serial(serials.at[i], dates.at[i], mapping) == library
            )

    return df.loc[keep].reset_index(drop=True)


def all_serials_touching_libraries(
    libraries: Iterable[str],
    mapping: dict[str, list[str]],
    start: date | None = None,
    end: date | None = None,
) -> list[str]:
    """Union of serials_for_library across several libraries."""
    seen: set[str] = set()
    out: list[str] = []
    for lib in libraries:
        for s in serials_for_library(lib, mapping, start, end):
            ns = normalize_serial(s)
            if ns not in seen:
                seen.add(ns)
                out.append(s)
    return out
