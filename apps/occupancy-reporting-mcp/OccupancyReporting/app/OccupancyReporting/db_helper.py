# db_helper.py
import os
import time
from datetime import date, datetime, timedelta
from functools import lru_cache

import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import camera_quirks

load_dotenv()

# Get DB credentials from env
DB_HOST = os.getenv("DB_HOST", "rds-mysql8-production.internal.lib.virginia.edu")
DB_USER = os.getenv("DB_USER", "occupancy_ro")
DB_PASSWORD = os.getenv("DB_PASSWORD", "Kagaim3CaiXie1")
DB_NAME = os.getenv("DB_NAME", "occupancy")

# Table metadata
TABLE_START_DATE = date(2023, 10, 18)
AVG_IDS_PER_DAY = 58300

# Fetch raw metrics in windows this large (days). Keeps each query under
# AgentCore/gateway time budgets while still covering multi-month reports.
QUERY_CHUNK_DAYS = int(os.getenv("OCCUPANCY_QUERY_CHUNK_DAYS", "14"))
# Extra day(s) before each chunk so per-device counter deltas are continuous.
QUERY_LOOKBACK_DAYS = 1

# In-process caches (AgentCore keeps the process warm across invokes)
_ENGINE = None
_MAPPING_CACHE = None  # (expires_at, mapping, lookup)
_MAPPING_TTL_SEC = 300


def get_db_engine():
    global _ENGINE
    if _ENGINE is None:
        connection_url = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
        _ENGINE = create_engine(
            connection_url,
            pool_pre_ping=True,
            pool_recycle=1800,
            pool_size=6,
            max_overflow=4,
            connect_args={
                "connect_timeout": 30,
                "read_timeout": 180,
                "write_timeout": 60,
            },
        )
    return _ENGINE


def get_libraries_mapping(engine=None):
    """
    Queries the cameras table to build a mapping of:
    location_short -> list of serial numbers.
    Also returns a normalized name lookup dictionary.

    Applies temporary location overrides from camera_quirks (e.g. Clemons-side
    connector stored under Shannon). Hardware-swap date logic is applied later
    when resolving serials for a date range / filtering raw rows.

    Cached in-process for a few minutes to avoid a cameras-table round trip
    on every tool call.
    """
    global _MAPPING_CACHE
    now = time.time()
    if _MAPPING_CACHE and _MAPPING_CACHE[0] > now:
        return _MAPPING_CACHE[1], _MAPPING_CACHE[2]

    if engine is None:
        engine = get_db_engine()

    query = "SELECT serial_no, location_short FROM cameras"
    with engine.connect() as conn:
        df = pd.read_sql(query, conn)

    mapping = {}
    for _, row in df.iterrows():
        loc = row["location_short"].strip()
        serial = row["serial_no"].strip()
        if loc not in mapping:
            mapping[loc] = []
        mapping[loc].append(serial)

    # Temporary: reassign serials whose DB location_short is wrong
    mapping = camera_quirks.apply_location_overrides(mapping)

    normalized_lookup = {}
    for loc in mapping:
        # Build normalized keys for matching (e.g. 'clemons', 'shannon', 'music', 'fine arts', 'science & engineering')
        norm_key = loc.lower().replace("&", "and").replace(" ", "")
        normalized_lookup[norm_key] = loc

        # Add aliases
        if "science" in norm_key:
            normalized_lookup["science"] = loc
            normalized_lookup["sel"] = loc
            normalized_lookup["scienceandengineering"] = loc
            normalized_lookup["scienceengineering"] = loc
        if "fine" in norm_key and "art" in norm_key:
            normalized_lookup["finearts"] = loc
            normalized_lookup["fal"] = loc
            normalized_lookup["fiske"] = loc

    _MAPPING_CACHE = (now + _MAPPING_TTL_SEC, mapping, normalized_lookup)
    return mapping, normalized_lookup


def resolve_library_serials(mapping, library, start_date_str, end_date_str):
    """
    Serials to query for a library over a date range, accounting for hardware swaps.
    """
    start = datetime.strptime(start_date_str, "%Y-%m-%d").date()
    end = datetime.strptime(end_date_str, "%Y-%m-%d").date()
    return camera_quirks.serials_for_library(library, mapping, start, end)


def _estimate_id_for_date(target: date) -> int:
    if target <= TABLE_START_DATE:
        return 1
    days_since_start = (target - TABLE_START_DATE).days
    return max(1, days_since_start * AVG_IDS_PER_DAY)


def get_start_id(engine, start_date_str):
    """
    Performs an optimized start ID lookup using day-based estimation to prevent full-table scans.
    """
    target_dt = datetime.strptime(start_date_str, "%Y-%m-%d").date()
    if target_dt <= TABLE_START_DATE:
        return 1

    est_id = _estimate_id_for_date(target_dt)
    # Apply a 20-day safety buffer (approx 1.1 million IDs)
    scan_start_id = max(1, est_id - 1100000)

    query = text(
        """
        SELECT id FROM rawmetrics
        WHERE id >= :scan_start_id AND created_at >= :start_dt
        ORDER BY id ASC LIMIT 1
    """
    )

    with engine.connect() as conn:
        result = conn.execute(
            query, {"scan_start_id": scan_start_id, "start_dt": start_date_str + " 00:00:00"}
        )
        row = result.fetchone()
        if row:
            return row[0]

    # Fallback to scanning from beginning if not found
    fallback_query = text(
        "SELECT id FROM rawmetrics WHERE created_at >= :start_dt ORDER BY id ASC LIMIT 1"
    )
    with engine.connect() as conn:
        result = conn.execute(fallback_query, {"start_dt": start_date_str + " 00:00:00"})
        row = result.fetchone()
        return row[0] if row else 1


def get_end_id(engine, end_date_str):
    """
    Upper-bound id for rows with created_at <= end of (end_date + 2 day buffer).
    Bounds the PK range scan so long queries don't walk the entire table.
    """
    # Match query_raw_metrics buffer: cover target end day fully (+2 days for TZ)
    end_dt = datetime.strptime(end_date_str, "%Y-%m-%d") + timedelta(days=2)
    end_dt_str = end_dt.strftime("%Y-%m-%d 00:00:00")
    target = end_dt.date()

    est_id = _estimate_id_for_date(target)
    # Scan a window ahead of the estimate; clamp at a generous ceiling
    scan_start_id = max(1, est_id - 1100000)

    query = text(
        """
        SELECT id FROM rawmetrics
        WHERE id >= :scan_start_id AND created_at > :end_dt
        ORDER BY id ASC LIMIT 1
    """
    )
    with engine.connect() as conn:
        result = conn.execute(query, {"scan_start_id": scan_start_id, "end_dt": end_dt_str})
        row = result.fetchone()
        if row:
            # First id strictly after the window → exclusive end; use inclusive id-1
            return max(1, row[0] - 1)
        # No rows after end_dt: use table max
        max_id = conn.execute(text("SELECT MAX(id) FROM rawmetrics")).scalar()
        return int(max_id or 1)


def query_raw_metrics(
    engine,
    start_id,
    end_date_str,
    serial_nos,
    end_id=None,
    sample_minutes: int = 1,
):
    """
    Queries the rawmetrics table for selected serial numbers.

    Uses a closed id range [start_id, end_id] on the primary key (fast range
    scan) and avoids ORDER BY so MySQL doesn't filesort multi-million-row
    results — callers sort in pandas after filtering.

    sample_minutes > 1 keeps roughly one reading per N minutes (MOD on minute).
    Counters are cumulative, so totals stay correct; occupancy resolution is coarser.
    Used automatically for multi-month ranges to stay under gateway timeouts.
    """
    if not serial_nos:
        return pd.DataFrame(columns=["serial_no", "count_in", "count_out", "created_at"])

    if end_id is None:
        end_id = get_end_id(engine, end_date_str)

    # Cover the target end day in full (add 2 days buffer for TZ / processing)
    end_dt = datetime.strptime(end_date_str, "%Y-%m-%d") + timedelta(days=2)
    end_dt_str = end_dt.strftime("%Y-%m-%d 00:00:00")

    sample_clause = ""
    if sample_minutes and sample_minutes > 1:
        sample_clause = "AND MOD(MINUTE(created_at), :sample_minutes) = 0"

    query = text(
        f"""
        SELECT serial_no, count_in, count_out, created_at
        FROM rawmetrics FORCE INDEX (PRIMARY)
        WHERE id >= :start_id
          AND id <= :end_id
          AND created_at <= :end_dt_str
          AND source = 'sum'
          AND serial_no IN :serials
          {sample_clause}
    """
    )

    params = {
        "start_id": int(start_id),
        "end_id": int(end_id),
        "end_dt_str": end_dt_str,
        "serials": tuple(serial_nos),
    }
    if sample_minutes and sample_minutes > 1:
        params["sample_minutes"] = int(sample_minutes)

    # Retries help annual reports survive transient MySQL disconnects under
    # parallel chunk load (common after several large sequential queries).
    last_err = None
    for attempt in range(3):
        try:
            with engine.connect() as conn:
                return pd.read_sql(query, conn, params=params)
        except Exception as e:
            last_err = e
            # Dispose pooled connections that may be dead
            try:
                engine.dispose()
            except Exception:
                pass
            time.sleep(0.5 * (attempt + 1))
    raise last_err


def query_building_minute_deltas(
    engine,
    start_id: int,
    end_id: int,
    end_date_str: str,
    serial_nos,
    invert_serials=None,
):
    """
    Server-side counter deltas → building-level per-minute aggregates.

    Returns far fewer rows than query_raw_metrics (~1/N cameras), which is the
    main lever for multi-month MCP requests that otherwise time out transferring
    millions of raw readings.

    Direction inversion is applied in SQL for serials in invert_serials.
    Library/date filtering for hardware swaps should already be reflected in
    which serials are included for the window (or applied by the caller on
    a small raw subset). For the common case every listed serial counts for
    the whole window.
    """
    if not serial_nos:
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

    invert_serials = list(invert_serials or [])
    end_dt = datetime.strptime(end_date_str, "%Y-%m-%d") + timedelta(days=2)
    end_dt_str = end_dt.strftime("%Y-%m-%d 00:00:00")

    # Direction inversion applied before lag/diff (Shannon 401 east, etc.)
    if invert_serials:
        cin_expr = "CASE WHEN serial_no IN :invert THEN count_out ELSE count_in END"
        cout_expr = "CASE WHEN serial_no IN :invert THEN count_in ELSE count_out END"
    else:
        cin_expr = "count_in"
        cout_expr = "count_out"

    query = text(
        f"""
        SELECT
            minute_ts AS created_at_utc,
            SUM(delta_in) AS delta_in,
            SUM(delta_out) AS delta_out,
            SUM(raw_delta_in) AS raw_delta_in,
            SUM(raw_delta_out) AS raw_delta_out,
            SUM(adjustment_in) AS adjustment_in,
            SUM(adjustment_out) AS adjustment_out,
            SUM(reset_flag_in) AS reset_flag_in,
            SUM(reset_flag_out) AS reset_flag_out
        FROM (
            SELECT
                FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(created_at) / 60) * 60) AS minute_ts,
                CASE
                    WHEN prev_in IS NULL THEN 0
                    WHEN cin >= prev_in THEN cin - prev_in
                    ELSE cin
                END AS delta_in,
                CASE
                    WHEN prev_out IS NULL THEN 0
                    WHEN cout >= prev_out THEN cout - prev_out
                    ELSE cout
                END AS delta_out,
                CASE WHEN prev_in IS NULL THEN 0 ELSE cin - prev_in END AS raw_delta_in,
                CASE WHEN prev_out IS NULL THEN 0 ELSE cout - prev_out END AS raw_delta_out,
                CASE WHEN prev_in IS NOT NULL AND cin < prev_in THEN prev_in - cin ELSE 0 END AS adjustment_in,
                CASE WHEN prev_out IS NOT NULL AND cout < prev_out THEN prev_out - cout ELSE 0 END AS adjustment_out,
                CASE WHEN prev_in IS NOT NULL AND cin < prev_in THEN 1 ELSE 0 END AS reset_flag_in,
                CASE WHEN prev_out IS NOT NULL AND cout < prev_out THEN 1 ELSE 0 END AS reset_flag_out
            FROM (
                SELECT
                    serial_no,
                    created_at,
                    cin,
                    cout,
                    LAG(cin) OVER (PARTITION BY serial_no ORDER BY id) AS prev_in,
                    LAG(cout) OVER (PARTITION BY serial_no ORDER BY id) AS prev_out
                FROM (
                    SELECT
                        id,
                        serial_no,
                        created_at,
                        {cin_expr} AS cin,
                        {cout_expr} AS cout
                    FROM rawmetrics FORCE INDEX (PRIMARY)
                    WHERE id >= :start_id
                      AND id <= :end_id
                      AND created_at <= :end_dt_str
                      AND source = 'sum'
                      AND serial_no IN :serials
                ) oriented
            ) lagged
        ) deltas
        GROUP BY minute_ts
        ORDER BY minute_ts
    """
    )

    params = {
        "start_id": int(start_id),
        "end_id": int(end_id),
        "end_dt_str": end_dt_str,
        "serials": tuple(serial_nos),
    }
    if invert_serials:
        params["invert"] = tuple(invert_serials)

    with engine.connect() as conn:
        df = pd.read_sql(query, conn, params=params)

    if not df.empty:
        df["created_at_utc"] = pd.to_datetime(df["created_at_utc"], utc=True)
    return df


def iter_date_chunks(start: date, end: date, chunk_days: int = QUERY_CHUNK_DAYS):
    """Yield inclusive (chunk_start, chunk_end) date pairs covering [start, end]."""
    if chunk_days < 1:
        chunk_days = 1
    current = start
    while current <= end:
        chunk_end = min(current + timedelta(days=chunk_days - 1), end)
        yield current, chunk_end
        current = chunk_end + timedelta(days=1)


def query_raw_metrics_chunked(
    engine,
    start_date_str: str,
    end_date_str: str,
    serial_nos,
    chunk_days: int = QUERY_CHUNK_DAYS,
    lookback_days: int = QUERY_LOOKBACK_DAYS,
    max_workers: int = 4,
):
    """
    Fetch raw metrics for a date range in bounded chunks (optionally in parallel).

    Yields (chunk_start, chunk_end, raw_df) where raw_df includes a short
    lookback before chunk_start so counter-delta math stays continuous at
    chunk boundaries. Callers should drop lookback rows after computing deltas.

    Uses two id lookups for the whole range (not per chunk) and interpolates
    chunk id windows from AVG_IDS_PER_DAY so multi-month reports don't pay
    O(chunks) start/end id scans.
    """
    from concurrent.futures import ThreadPoolExecutor, as_completed

    start = datetime.strptime(start_date_str, "%Y-%m-%d").date()
    end = datetime.strptime(end_date_str, "%Y-%m-%d").date()

    chunks = list(iter_date_chunks(start, end, chunk_days))
    if not chunks:
        return

    # Global id bounds with lookback on the first chunk
    global_fetch_start = chunks[0][0] - timedelta(days=lookback_days)
    if global_fetch_start < TABLE_START_DATE:
        global_fetch_start = TABLE_START_DATE
    global_start_id = get_start_id(engine, global_fetch_start.isoformat())
    global_end_id = get_end_id(engine, end.isoformat())

    # Interpolate per-chunk id windows from the overall span
    span_days = max(1, (end - global_fetch_start).days + 1)
    id_span = max(1, global_end_id - global_start_id)
    ids_per_day = id_span / span_days
    # Safety pad: ~2 days of ids so we don't clip edges when rate varies
    id_pad = int(AVG_IDS_PER_DAY * 2)

    def _fetch_one(chunk_start: date, chunk_end: date):
        fetch_start = chunk_start - timedelta(days=lookback_days)
        if fetch_start < TABLE_START_DATE:
            fetch_start = TABLE_START_DATE
        day_offset = (fetch_start - global_fetch_start).days
        day_end_offset = (chunk_end - global_fetch_start).days + 1
        start_id = max(1, global_start_id + int(day_offset * ids_per_day) - id_pad)
        end_id = min(global_end_id, global_start_id + int(day_end_offset * ids_per_day) + id_pad)
        # Clamp to global bounds
        start_id = max(global_start_id, start_id) if fetch_start == global_fetch_start else max(1, start_id)
        start_id = max(1, min(start_id, global_end_id))
        end_id = max(start_id, min(end_id, global_end_id))
        raw_df = query_raw_metrics(
            engine, start_id, chunk_end.isoformat(), serial_nos, end_id=end_id
        )
        return chunk_start, chunk_end, raw_df

    if len(chunks) == 1 or max_workers <= 1:
        for chunk_start, chunk_end in chunks:
            yield _fetch_one(chunk_start, chunk_end)
        return

    # Parallel fetch; yield in chronological order
    results = {}
    workers = min(max_workers, len(chunks))
    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {
            pool.submit(_fetch_one, cs, ce): (cs, ce) for cs, ce in chunks
        }
        for fut in as_completed(futures):
            cs, ce, raw_df = fut.result()
            results[(cs, ce)] = raw_df

    for chunk_start, chunk_end in chunks:
        yield chunk_start, chunk_end, results[(chunk_start, chunk_end)]
