# processing.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta, timezone, time
from zoneinfo import ZoneInfo
from hours_helper import fetch_hours, parse_time, get_day_open_times
import camera_quirks

NY_TZ = ZoneInfo("America/New_York")


def merge_windows(windows):
    if not windows:
        return []
    windows = sorted(windows, key=lambda x: x[0])
    merged = [list(windows[0])]
    for start, end in windows[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return [(start, end) for start, end in merged]


def compute_reset_delta(series: pd.Series) -> pd.Series:
    diff = series.diff()
    delta = diff.where(diff >= 0, series)
    delta.iloc[0] = 0
    delta = delta.fillna(0)
    return delta


def raw_to_building_deltas(df: pd.DataFrame, serial_nos) -> pd.DataFrame:
    """
    Per-camera cumulative counters → building-level per-minute deltas.

    Applies temporary direction inversion. Callers should already have filtered
    rows to the target library (including date-aware hardware-swap attribution).
    """
    if df.empty:
        return pd.DataFrame(
            columns=[
                "created_at_utc",
                "delta_in",
                "delta_out",
                "raw_delta_in",
                "raw_delta_out",
                "adjustment_in",
                "adjustment_out",
                "reset_flag_in",
                "reset_flag_out",
            ]
        )

    # Temporary: invert in/out for misconfigured cameras (Shannon 401 east)
    df = camera_quirks.apply_direction_inversions(df)

    df = df[df["serial_no"].isin(serial_nos)].copy()
    if df.empty:
        return pd.DataFrame(
            columns=[
                "created_at_utc",
                "delta_in",
                "delta_out",
                "raw_delta_in",
                "raw_delta_out",
                "adjustment_in",
                "adjustment_out",
                "reset_flag_in",
                "reset_flag_out",
            ]
        )

    df["created_at"] = pd.to_datetime(df["created_at"], utc=True)
    df["minute_time"] = df["created_at"].dt.floor("min")

    # Compute per-device deltas
    df = df.sort_values(["serial_no", "minute_time", "created_at"])

    df["delta_in"] = df.groupby("serial_no", sort=False)["count_in"].transform(compute_reset_delta)
    df["delta_out"] = df.groupby("serial_no", sort=False)["count_out"].transform(compute_reset_delta)

    raw_delta_in = df.groupby("serial_no", sort=False)["count_in"].diff().fillna(0)
    raw_delta_out = df.groupby("serial_no", sort=False)["count_out"].diff().fillna(0)

    df["raw_delta_in"] = raw_delta_in
    df["raw_delta_out"] = raw_delta_out
    df["adjustment_in"] = np.where(raw_delta_in < 0, -raw_delta_in, 0)
    df["adjustment_out"] = np.where(raw_delta_out < 0, -raw_delta_out, 0)
    df["reset_flag_in"] = (raw_delta_in < 0).astype(int)
    df["reset_flag_out"] = (raw_delta_out < 0).astype(int)

    # Aggregate to building-level minutes
    building_df = (
        df.groupby("minute_time", sort=False)
        .agg(
            {
                "delta_in": "sum",
                "delta_out": "sum",
                "raw_delta_in": "sum",
                "raw_delta_out": "sum",
                "adjustment_in": "sum",
                "adjustment_out": "sum",
                "reset_flag_in": "sum",
                "reset_flag_out": "sum",
            }
        )
        .reset_index()
        .rename(columns={"minute_time": "created_at_utc"})
    )
    return building_df.sort_values("created_at_utc").reset_index(drop=True)


def finalize_building_occupancy(
    building_df: pd.DataFrame, library: str | None = None
) -> pd.DataFrame:
    """
    Building-level minute deltas → occupancy, daily segment resets, off-hours suppression.

    `library` selects the LibCal calendar (each building has its own hours).
    """
    if building_df.empty:
        raise ValueError("No metrics data found in database for the selected range.")

    building_df = building_df.copy()
    building_df["created_at_utc"] = pd.to_datetime(building_df["created_at_utc"], utc=True)
    building_df = building_df.sort_values("created_at_utc").reset_index(drop=True)

    # Collapse any duplicate minutes from chunk stitching
    metric_cols = [
        "delta_in",
        "delta_out",
        "raw_delta_in",
        "raw_delta_out",
        "adjustment_in",
        "adjustment_out",
        "reset_flag_in",
        "reset_flag_out",
    ]
    for col in metric_cols:
        if col not in building_df.columns:
            building_df[col] = 0
    building_df = (
        building_df.groupby("created_at_utc", sort=True)[metric_cols].sum().reset_index()
    )

    building_df["created_at_nyc"] = building_df["created_at_utc"].dt.tz_convert(NY_TZ)
    building_df["date"] = building_df["created_at_nyc"].dt.date
    building_df["time"] = building_df["created_at_nyc"].dt.time
    building_df["suppressed_in"] = 0
    building_df["suppressed_out"] = 0
    building_df["outside_buffer"] = False

    start_date = building_df["date"].min()
    end_date = building_df["date"].max()

    # Warm hours cache for this library's calendar over the entire range
    fetch_hours(
        start_date - timedelta(days=1),
        end_date + timedelta(days=1),
        library=library,
    )

    # Compute reset times (1 hour before opening) in NYC timezone
    reset_times_nyc = []
    buffer_windows_utc = []
    current_day = start_date
    while current_day <= end_date:
        day_info = get_day_open_times(current_day.isoformat(), library=library)
        open_times = day_info["open_times"]
        if day_info["opened"] == "Yes" and open_times != "Closed":
            first_period = open_times.split(", ")[0]
            first_start_str = first_period.split("-")[0]
            first_start_time = parse_time(first_start_str)
            reset_dt = datetime.combine(current_day, first_start_time, tzinfo=NY_TZ) - timedelta(
                hours=1
            )
            reset_dt = reset_dt.replace(second=0, microsecond=0)
            reset_times_nyc.append(reset_dt)

        if open_times != "Closed":
            periods = open_times.split(", ")
            for period in periods:
                if not period:
                    continue
                start_str, end_str = period.split("-")
                start_time = parse_time(start_str)
                if end_str == "24:00":
                    end_dt_local = datetime.combine(
                        current_day + timedelta(days=1), time(0, 0), tzinfo=NY_TZ
                    )
                else:
                    end_time = parse_time(end_str)
                    end_dt_local = datetime.combine(current_day, end_time, tzinfo=NY_TZ)
                start_dt_local = datetime.combine(current_day, start_time, tzinfo=NY_TZ)
                buffer_start = (start_dt_local - timedelta(hours=1)).astimezone(timezone.utc)
                buffer_end = (end_dt_local + timedelta(hours=1)).astimezone(timezone.utc)
                buffer_windows_utc.append((buffer_start, buffer_end))
        current_day += timedelta(days=1)

    buffer_windows_utc = merge_windows(buffer_windows_utc)

    if not reset_times_nyc:
        reset_times_nyc.append(
            building_df["created_at_nyc"].min().replace(second=0, microsecond=0)
        )

    reset_times_nyc = sorted(set(reset_times_nyc))
    reset_times_utc = [rt.astimezone(timezone.utc) for rt in reset_times_nyc]

    # Insert zero rows at resets to anchor segments
    building_df = building_df.set_index("created_at_utc")
    max_existing_timestamp = building_df.index.max()
    missing_resets = [
        rt_utc
        for rt_utc in reset_times_utc
        if rt_utc <= max_existing_timestamp and rt_utc not in building_df.index
    ]
    if missing_resets:
        zero_rows = pd.DataFrame(
            0,
            index=pd.DatetimeIndex(missing_resets, name="created_at_utc"),
            columns=[
                "delta_in",
                "delta_out",
                "raw_delta_in",
                "raw_delta_out",
                "adjustment_in",
                "adjustment_out",
                "reset_flag_in",
                "reset_flag_out",
            ],
        )
        building_df = pd.concat([building_df, zero_rows])

    building_df = building_df.sort_index().reset_index()
    building_df["created_at_nyc"] = building_df["created_at_utc"].dt.tz_convert(NY_TZ)
    building_df["date"] = building_df["created_at_nyc"].dt.date
    building_df["time"] = building_df["created_at_nyc"].dt.time
    building_df["suppressed_in"] = 0
    building_df["suppressed_out"] = 0
    building_df["outside_buffer"] = False

    # Assign segments and cumulative sums starting at zero
    reset_index = pd.DatetimeIndex(reset_times_nyc)
    created_at_index = pd.DatetimeIndex(building_df["created_at_nyc"])
    segment_positions = reset_index.searchsorted(created_at_index, side="right") - 1
    segment_positions = np.clip(segment_positions, 0, len(reset_index) - 1)
    building_df["segment"] = reset_index.take(segment_positions)
    building_df["segment_anchor"] = building_df["created_at_nyc"].isin(reset_times_nyc)

    segment_groups = building_df.groupby("segment")
    building_df["count_in"] = segment_groups["delta_in"].cumsum()
    building_df["count_out"] = segment_groups["delta_out"].cumsum()
    building_df["count_in"] -= segment_groups["count_in"].transform("first")
    building_df["count_out"] -= segment_groups["count_out"].transform("first")

    building_df["occupancy"] = building_df["count_in"] - building_df["count_out"]
    building_df["occupancy"] = building_df.groupby("segment")["occupancy"].transform(
        lambda s: s.clip(lower=0)
    )

    # End-of-day occupancy reconciliation for days that close (not 24h).
    # Directional sensor bias makes occupancy walk up (or down) over the day.
    # For closed-overnight buildings we linearly detrend each segment so the
    # last sample ends near zero, which keeps avg occupancy realistic without
    # changing in/out traffic totals. Skip segments that look 24h (never leave
    # a long buffer gap) or already end near zero.
    def _detrend_segment(occ: pd.Series) -> pd.Series:
        if len(occ) < 3:
            return occ
        end_val = float(occ.iloc[-1])
        if end_val <= 5:
            return occ
        # Linear ramp from 0 at start to end_val at end — subtract it
        n = len(occ)
        ramp = np.linspace(0.0, end_val, n)
        return (occ - ramp).clip(lower=0)

    building_df["occupancy"] = building_df.groupby("segment", group_keys=False)[
        "occupancy"
    ].transform(_detrend_segment)

    if buffer_windows_utc:
        created_utc = building_df["created_at_utc"].to_numpy()
        window_masks = [
            (created_utc >= start) & (created_utc <= end) for start, end in buffer_windows_utc
        ]
        if len(window_masks) == 1:
            inside_window = window_masks[0]
        else:
            inside_window = np.column_stack(window_masks).any(axis=1)
        inside_window = pd.Series(inside_window, index=building_df.index)
        outside_mask = ~inside_window
        building_df.loc[outside_mask, "suppressed_in"] = building_df.loc[outside_mask, "delta_in"]
        building_df.loc[outside_mask, "suppressed_out"] = building_df.loc[
            outside_mask, "delta_out"
        ]
        building_df.loc[outside_mask, "outside_buffer"] = True
        building_df.loc[
            outside_mask, ["delta_in", "delta_out", "count_in", "count_out", "occupancy"]
        ] = 0

    # Round numeric columns
    for col in [
        "delta_in",
        "delta_out",
        "count_in",
        "count_out",
        "occupancy",
        "raw_delta_in",
        "raw_delta_out",
        "adjustment_in",
        "adjustment_out",
        "suppressed_in",
        "suppressed_out",
        "reset_flag_in",
        "reset_flag_out",
    ]:
        building_df[col] = building_df[col].round().astype(int)

    return building_df


def process_occupancy_data(
    df: pd.DataFrame, serial_nos, library: str | None = None
) -> pd.DataFrame:
    """
    Transforms raw counts from the DB into building-level minute metrics with occupancy.

    Applies temporary camera quirks (direction inversion) before delta computation.
    Callers should already have filtered rows to the target library (including
    date-aware hardware-swap attribution via camera_quirks.filter_metrics_for_library).
    """
    if df.empty:
        raise ValueError("No metrics data found in database for the selected range.")

    building_df = raw_to_building_deltas(df, serial_nos)
    if building_df.empty:
        raise ValueError("No metrics data matches selected library serial numbers.")
    return finalize_building_occupancy(building_df, library=library)
