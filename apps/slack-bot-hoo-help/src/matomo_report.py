"""Pure helpers for the Matomo tools: site lookup, period resolution, constants.

No network access here; callers pass `today` (America/New_York).
"""
import calendar
import datetime
import re
from dataclasses import dataclass
from urllib.parse import urlparse

VIRGO_SITE_ID = 39
AUTOMATED_MIN_SECONDS = 3600
AUTOMATED_MIN_ACTIONS = 1000
AUTOMATED_SEGMENT = (
    f"visitDuration>={AUTOMATED_MIN_SECONDS};actions>={AUTOMATED_MIN_ACTIONS}"
)

_LIBRARY_CMS_ID = 10
_LIBRARY_CMS_ALIASES = {"library website", "library site", "library cms"}
_VIRGO_HOST = "search.lib.virginia.edu"


@dataclass
class Period:
    period: str  # "month" | "year" | "range"
    date: str
    start: datetime.date
    end: datetime.date
    capped: bool

    @property
    def label(self) -> str:
        return f"{self.start.isoformat()} to {self.end.isoformat()}"


def _parse_date(value: str) -> datetime.date:
    try:
        return datetime.date.fromisoformat(value.strip())
    except (ValueError, AttributeError):
        raise ValueError(f"'{value}' is not a valid date; use YYYY-MM-DD.") from None


def _parse_fiscal_year(value: str) -> tuple[datetime.date, datetime.date]:
    m = re.fullmatch(r"(?:fy)?\s*(\d{4}|\d{2})", value.strip(), re.IGNORECASE)
    if not m:
        raise ValueError(f"'{value}' is not a fiscal year; use e.g. FY26.")
    year = int(m.group(1))
    if year < 100:
        year += 2000
    return datetime.date(year - 1, 7, 1), datetime.date(year, 6, 30)


def resolve_period(start_date: str = "", end_date: str = "", fiscal_year: str = "",
                   *, today: datetime.date) -> Period:
    has_dates = bool(start_date or end_date)
    if fiscal_year and has_dates:
        raise ValueError("Give either dates or a fiscal year, not both.")
    if fiscal_year:
        start, end = _parse_fiscal_year(fiscal_year)
    elif has_dates:
        if not start_date:
            raise ValueError("Give a start date along with the end date.")
        start = _parse_date(start_date)
        # A start with no end means "through yesterday".
        end = _parse_date(end_date) if end_date else today
        if start > end:
            raise ValueError("The start date must be before the end date.")
    else:
        raise ValueError("Give dates or a fiscal year.")

    yesterday = today - datetime.timedelta(days=1)
    capped = end > yesterday
    if capped:
        end = yesterday
    if start > end:
        raise ValueError(
            f"{start.isoformat()} hasn't happened yet; the latest data is "
            f"{yesterday.isoformat()}.")

    last_of_month = calendar.monthrange(start.year, start.month)[1]
    if start.day == 1 and end == datetime.date(start.year, start.month, last_of_month):
        return Period("month", start.isoformat(), start, end, capped)
    if start == datetime.date(start.year, 1, 1) and end == datetime.date(start.year, 12, 31):
        return Period("year", start.isoformat(), start, end, capped)
    return Period("range", f"{start.isoformat()},{end.isoformat()}", start, end, capped)


def archived_parts(period: Period) -> list[tuple[str, str]]:
    """The (period, date) requests that cover `period` from reports Matomo has already processed.

    A month or calendar year is one request. Any other range becomes whole months (one
    multi-date month request) plus the leftover days (multi-date day requests): Matomo builds a
    period=range report on request, which for big reports (a fiscal year of Virgo page URLs)
    can take minutes and overload the server.
    """
    if period.period != "range":
        return [(period.period, period.date)]
    start, end = period.start, period.end
    first_month = start if start.day == 1 else _next_month(start)
    end_of_end_month = datetime.date(end.year, end.month, calendar.monthrange(end.year, end.month)[1])
    last_month = datetime.date(end.year, end.month, 1) if end == end_of_end_month \
        else datetime.date(end.year, end.month, 1) - datetime.timedelta(days=1)
    last_month = datetime.date(last_month.year, last_month.month, 1)
    if first_month > last_month:
        return [("day", f"{start.isoformat()},{end.isoformat()}")]
    parts: list[tuple[str, str]] = []
    if start < first_month:
        parts.append(("day", f"{start.isoformat()},{(first_month - datetime.timedelta(days=1)).isoformat()}"))
    months = first_month.isoformat() if first_month == last_month \
        else f"{first_month.isoformat()},{last_month.isoformat()}"
    parts.append(("month", months))
    after = _next_month(last_month)
    if after <= end:
        parts.append(("day", f"{after.isoformat()},{end.isoformat()}"))
    return parts


def _next_month(d: datetime.date) -> datetime.date:
    return datetime.date(d.year + (d.month == 12), d.month % 12 + 1, 1)


def _host(value: str) -> str:
    value = value.strip().lower()
    parsed = urlparse(value if "//" in value else "//" + value)
    return (parsed.hostname or "").strip(".")


def _site_list(sites: list[dict]) -> str:
    return ", ".join(f"{s['idsite']} {s['name']}" for s in sites)


def resolve_site(sites: list[dict], name_or_id: str) -> dict:
    query = (name_or_id or "").strip()
    q = query.lower()
    by_id = {s["idsite"]: s for s in sites}

    def unknown() -> ValueError:
        return ValueError(f"Unknown site '{query}'; sites: {_site_list(sites)}")

    if not q:
        raise unknown()
    # 1. numeric id
    if q.isdigit() and int(q) in by_id:
        return by_id[int(q)]
    if q.isdigit():
        raise unknown()  # digits are only ever a site id
    # 2. exact name
    for s in sites:
        if s["name"].lower() == q:
            return s
    # 3. "virgo" means the production Virgo
    if q == "virgo" and VIRGO_SITE_ID in by_id:
        return by_id[VIRGO_SITE_ID]
    # 4. the library website
    if q in _LIBRARY_CMS_ALIASES and _LIBRARY_CMS_ID in by_id:
        return by_id[_LIBRARY_CMS_ID]
    # 5. URL host (search.lib.virginia.edu is Virgo; site 1 has no traffic)
    host = _host(q)
    if "." in host:
        if host == _VIRGO_HOST and VIRGO_SITE_ID in by_id:
            return by_id[VIRGO_SITE_ID]
        for s in sites:
            if _host(s.get("main_url") or "") == host:
                return s
    # 6. a single name containing the query
    matches = [s for s in sites if q in s["name"].lower()]
    if len(matches) == 1:
        return matches[0]
    if len(matches) > 1:
        raise ValueError(
            f"'{query}' matches more than one site: {_site_list(matches)}")
    raise unknown()
