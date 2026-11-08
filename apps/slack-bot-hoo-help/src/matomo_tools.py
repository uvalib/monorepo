"""
matomo_tools.py — Hoo Helper's read-only Matomo web-statistics tools.

Same tool_specs() / handles() / call() shape as the Atlassian and GitHub sets. Every result's
first line names the site, the dates and how automated sessions were handled. Matomo labels
(page URLs, titles) come from visitors, so URLs off the library hosts are shown as paths and
anything with markup is shown in code formatting.
"""

from __future__ import annotations

import datetime
import logging
import os
import re
import threading
import time
from concurrent.futures import ThreadPoolExecutor, wait as futures_wait
from typing import Any, Callable, Dict, List, Optional, Tuple
from zoneinfo import ZoneInfo

from link_check import is_library_url
from matomo_client import MatomoAuthError, MatomoBusy, MatomoClient, MatomoError, MatomoTimeout
from tool_names import gateway_name
from virgo_access import classify_access, parse_item_details, pool_for_item_id
from matomo_report import (
    AUTOMATED_MIN_ACTIONS, AUTOMATED_SEGMENT, VIRGO_SITE_ID, Period, archived_parts, resolve_period,
    resolve_site,
)

logger = logging.getLogger(__name__)

TOOL_SITES = "matomo_sites"
TOOL_TRAFFIC = "matomo_traffic"
TOOL_TOP_PAGES = "matomo_top_pages"
TOOL_PAGE = "matomo_page"
TOOL_VIRGO_ITEMS = "matomo_virgo_items"
TOOL_VIRGO_COLLECTIONS = "matomo_virgo_collections"
TOOL_ANNUAL_REPORT = "matomo_annual_report"

SSM_TOKEN_NAME = "/hoohelp/matomo/token"
RETRY_AFTER_SEC = 600
MAX_LIMIT = 50
DEFAULT_LIMIT = 10
SEGMENT_TIMEOUT_NOTE = ("Matomo is still preparing the automated-session breakdown for {when}; "
                        "ask again in about 10 minutes.")
# Only a stored, pre-processed (auto-archived) segment is ever used; these calls must stay short.
SEGMENT_TIMEOUT_SEC = 20
SEGMENT_RETRY_SEC = 600
# Without the automated split, numbers are given as Matomo reports them, with no warning: they are
# the numbers the Library has always reported, and automated access (intermediaries, harvesters)
# is part of how the content is used (2026-11-06).
NOT_SEPARATED = "Matomo's numbers as reported"
OTHERS_SPLIT_NOTE = ("Per-page and per-item figures without automated sessions are approximate and may still "
                     "include some automated views (Matomo groups less-viewed pages into “Others” separately "
                     "for each report); totals are exact.")
# After a timeout or 502/503/504, no Matomo request for BUSY_PAUSE_SEC: retries (by the model, or
# by another question) only add load to a struggling server.
BUSY_PAUSE_SEC = 300
OTHER_TIMEOUT = ("Matomo is overloaded or not responding, so Matomo lookups are paused for about 5 minutes. "
                 "Don't call Matomo tools again for this question; tell the user Matomo is busy and to "
                 "try again in a few minutes.")
UNAVAILABLE = "Matomo isn't available right now."
# Ranges are added up from monthly and daily reports (see archived_parts); each part keeps at
# least this many top rows so pages ranked lower in one month still count.
RANGE_ROWS = 500
RANGE_NOTE = ("These figures are added up from Matomo's monthly and daily reports. Matomo keeps only "
              "each month's top pages (the rest are grouped into “Others”), so lower-ranked pages may "
              "be undercounted.")
UNIQ_RANGE_NOTE = "Unique visitors can't be added up across months, so they aren't shown for this range."
AUTOMATED_MODES = ("show", "exclude", "ignore")
SORT_COLUMNS = {"pages": "nb_hits", "titles": "nb_hits",
                "entry": "entry_nb_visits", "exit": "exit_nb_visits"}
NOT_AVAILABLE_NOTE = ("Pageviews, searches, downloads, outlinks and unique visitors aren't "
                      "available without automated sessions.")
VIRGO_POOLS = ("uva_library", "articles", "hathitrust", "images")
POOL_NAMES = {"uva_library": "Catalog", "articles": "Articles", "hathitrust": "HathiTrust",
              "images": "Images"}
VIRGO_DEFAULT_LIMIT = 10
VIRGO_MAX_LIMIT = 20
VIRGO_BUDGET_SEC = 15.0
ANNUAL_COLLECTIONS = 15
ANNUAL_RECORDS = 20
COLLECTIONS_DEFAULT_LIMIT = 15
COLLECTIONS_MAX_LIMIT = 50
# Virgo's own tracking events (the annual-report method): the event name is the collection, or the item id.
EVENT_ACTIONS = {"collections": "COLLECTION_ITEM_VIEWED", "items": "ITEM_DETAIL_VIEWED"}
EVENTS_NOTE = ("Visits are sessions in which an item was viewed, counted per month and added up, so "
               "someone who comes back in another month counts again; item views count every view.")
KIND_NOTE = ("Kinds follow a provisional rule by collection name: purchase funds are bookplate funds "
             "(items bought with a fund), not collections.")
_LICENSED_COLLECTIONS = ("kanopy", "swank", "proquest", "viva ", "getty publications", "streaming content",
                         "alexander street", "films on demand")
_FUND = re.compile(r"\b(?:fund|endowment|monographs|serials)\b", re.I)
PROVISIONAL_NOTE = ("Access types follow a provisional rule (pool and access-link host) "
                    "pending the annual-report definitions.")
_ITEM_LABEL = re.compile(r"^(?:(?:[a-z][a-z0-9+.-]*://)?[^/?#\s]+)?/?sources/([^/\s]+)/items/(.*)$", re.I)
# How gateway_mcp_client and the agent report a failed call.
GATEWAY_ERROR_PREFIXES = ("Error", "Tool Error:", "Gateway Tool Invocation Error", "Tool Invocation Error")
_ITEM_ID = re.compile(r"^[A-Za-z0-9_.:-]{1,100}$")
REPORT_METHODS = {
    "pages": "Actions.getPageUrls",
    "entry": "Actions.getEntryPageUrls",
    "exit": "Actions.getExitPageUrls",
    "titles": "Actions.getPageTitles",
}


def _spec(name: str, description: str, properties: Dict[str, Any], required: List[str]) -> Dict[str, Any]:
    return {"toolSpec": {"name": name, "description": description,
                         "inputSchema": {"json": {"type": "object", "properties": properties, "required": required}}}}


def _today_ny() -> datetime.date:
    return datetime.datetime.now(ZoneInfo("America/New_York")).date()


# ---- formatting ----------------------------------------------------------------

def _num(value: Any) -> int:
    try:
        return int(round(float(value)))
    except (TypeError, ValueError):
        return 0


def _n(value: Any) -> str:
    return f"{_num(value):,}" if value is not None else "—"


def _mmss(value: Any) -> str:
    try:
        secs = int(round(float(value)))
    except (TypeError, ValueError):
        return "—"
    return f"{secs // 60}:{secs % 60:02d}"


def _pct_change(cur: Any, prev: Any) -> str:
    try:
        c, p = float(cur), float(prev)
    except (TypeError, ValueError):
        return "—"
    if p == 0:
        return "—"
    return f"{(c - p) / p * 100:+.1f}%"


def _rate(value: Any) -> str:
    if value in (None, ""):
        return "—"
    return str(value) if str(value).endswith("%") else f"{value}%"


def _code(text: str) -> str:
    text = " ".join(text.replace("`", "").split())
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    return "`" + text + "`"


_SCHEME_URL = re.compile(r"^[a-z][a-z0-9+.-]*://[^/?#]*(.*)$", re.I | re.S)
_FILE_EXTS = ("html?|php|aspx?|jsp|pdf|js|css|png|jpe?g|gif|svg|ico|json|xml|txt|zip|csv|docx?|xlsx?|"
              "pptx?|mp[34]|webp|woff2?")
_DOMAIN_LIKE = re.compile(
    rf"(?<![a-z0-9-])(?:[a-z0-9-]+\.)+(?!(?:{_FILE_EXTS})(?![a-z0-9]))[a-z]{{2,24}}(?![a-z0-9-])", re.I)
OTHERS_LABEL = "Other pages (grouped by Matomo)"


def _suspicious(text: str) -> bool:
    return ("://" in text or "www." in text.lower() or "`" in text or "<" in text
            or ">" in text or "&" in text or bool(_DOMAIN_LIKE.search(text)))


def _display_label(label: Any) -> str:
    text = " ".join(str(label if label is not None else "").split())[:300]
    if text.endswith(" - Others"):
        directory = text[: -len(" - Others")].strip()
        if not directory:
            return OTHERS_LABEL
        shown = _code(directory) if _suspicious(directory) else directory
        return f"Other pages under {shown} (grouped by Matomo)"
    m = _SCHEME_URL.match(text)
    if m:
        rest = m.group(1)
        if is_library_url(text):
            return _code(text) if _suspicious(rest) else text
        text = rest if rest.startswith("/") else "/" + rest
    return _code(text) if _suspicious(text) else text


def _cell(text: Any) -> str:
    """Catalog text (title, format, library) for a table cell: as written, or in code formatting
    when it has markup or a URL. Unlike page labels, " - Others" means nothing here."""
    text = " ".join(str(text if text is not None else "").split())[:300]
    if not text:
        return "—"
    return (_code(text) if _suspicious(text) else text).replace("|", "/")


def _ratio(part: Any, whole: Any) -> Optional[str]:
    w = _num(whole)
    return f"{_num(part) / w * 100:.1f}%" if w > 0 else None


def _when(periods: List[Period], compare: bool) -> str:
    return " and ".join(p.label for p in periods) if compare else "this period"


# Count columns of an Actions report row that can be subtracted label by label.
_ROW_COUNTS = ("nb_hits", "nb_visits", "entry_nb_visits", "entry_bounce_count", "exit_nb_visits")


def _auto_counts(auto: Any) -> Dict[str, Dict[str, int]]:
    """Automated-session counts by row label."""
    autos: Dict[str, Dict[str, int]] = {}
    for r in auto if isinstance(auto, list) else []:
        if isinstance(r, dict):
            a = autos.setdefault(str(r.get("label")), {})
            for k in _ROW_COUNTS:
                a[k] = a.get(k, 0) + _num(r.get(k))
    return autos


def _subtract_rows(plain: Any, auto: Any, sort_key: str) -> List[dict]:
    """Rows without automated sessions: plain - automated per label (floored at 0), re-ranked by
    sort_key. Rates are recomputed from the counts; average time can't be and is left out."""
    autos = _auto_counts(auto)
    out: List[dict] = []
    for r in plain if isinstance(plain, list) else []:
        if not isinstance(r, dict):
            continue
        a = autos.get(str(r.get("label")), {})
        row: Dict[str, Any] = {"label": r.get("label")}
        for k in _ROW_COUNTS:
            if r.get(k) is not None:
                row[k] = max(_num(r.get(k)) - a.get(k, 0), 0)
        if r.get("entry_bounce_count") is not None:
            row["bounce_rate"] = _ratio(row.get("entry_bounce_count"), row.get("entry_nb_visits"))
        if r.get("exit_nb_visits") is not None:
            row["exit_rate"] = _ratio(row.get("exit_nb_visits"), row.get("nb_visits"))
        if _num(row.get(sort_key)) > 0:
            out.append(row)
    out.sort(key=lambda x: (-_num(x.get(sort_key)), str(x.get("label"))))
    return out


# Not additive across months and days: recomputed from summed counts, or dropped.
_RECOMPUTED = ("bounce_rate", "avg_time_on_site", "nb_actions_per_visit", "avg_time_on_page", "exit_rate")
_DROPPED = ("nb_uniq_visitors", "nb_users", "max_actions", "avg_time_generation", "avg_page_load_time")


_NUMERIC_TEXT = re.compile(r"-?\d+(?:\.\d+)?")


def _as_number(value: Any) -> Optional[float]:
    """An int/float, or a count Matomo sent as text ("7"); None for anything else."""
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return value
    if isinstance(value, str) and _NUMERIC_TEXT.fullmatch(value.strip()):
        text = value.strip()
        return float(text) if "." in text else int(text)
    return None


def _additive(key: str, value: Any) -> bool:
    return (_as_number(value) is not None
            and key not in _RECOMPUTED and key not in _DROPPED and "rate" not in key and "avg_" not in key)


def _div(part: Any, whole: Any) -> Optional[float]:
    return part / whole if isinstance(part, (int, float)) and whole else None


def _sum_into(total: Dict[str, Any], item: dict) -> None:
    for k, v in item.items():
        if _additive(k, v):
            total[k] = (_as_number(total.get(k)) or 0) + _as_number(v)
        elif k not in total and k not in _RECOMPUTED and k not in _DROPPED:
            total[k] = v


def _merge_parts(values: List[Any], sort_column: Optional[str] = None, limit: Any = None) -> Any:
    """One report from several months' and days' reports: counts summed, rates and averages
    recomputed from the sums, unique visitors dropped. Rows are matched by label and re-ranked."""
    if any(isinstance(v, list) and v for v in values):
        rows: Dict[str, Dict[str, Any]] = {}
        for v in values:
            for r in v if isinstance(v, list) else []:
                if isinstance(r, dict):
                    _sum_into(rows.setdefault(str(r.get("label")), {}), r)
        out = list(rows.values())
        for r in out:
            r["avg_time_on_page"] = _div(r.get("sum_time_spent"), r.get("nb_visits"))
            r["bounce_rate"] = _ratio(r.get("entry_bounce_count"), r.get("entry_nb_visits"))
            r["exit_rate"] = _ratio(r.get("exit_nb_visits"), r.get("nb_visits"))
        if sort_column:
            out.sort(key=lambda r: -_num(r.get(sort_column)))
        try:
            n = int(limit)
        except (TypeError, ValueError):
            n = -1
        return out[:n] if n > 0 else out
    total: Dict[str, Any] = {}
    for v in values:
        if isinstance(v, dict):
            _sum_into(total, v)
    if not total:
        return {}
    visits = total.get("nb_visits")
    if "bounce_count" in total:
        total["bounce_rate"] = _ratio(total["bounce_count"], visits)
    if "sum_visit_length" in total:
        total["avg_time_on_site"] = _div(total["sum_visit_length"], visits)
    if "nb_actions" in total:
        total["nb_actions_per_visit"] = _div(total["nb_actions"], visits)
    return total


def _metrics(visits: dict, actions: Optional[dict]) -> Dict[str, Any]:
    actions = actions or {}
    return {
        "visits": visits.get("nb_visits"),
        "uniq": visits.get("nb_uniq_visitors"),
        "pageviews": actions.get("nb_pageviews"),
        "searches": actions.get("nb_searches"),
        "downloads": actions.get("nb_downloads"),
        "outlinks": actions.get("nb_outlinks"),
        "bounce": visits.get("bounce_rate"),
        "avg": visits.get("avg_time_on_site"),
    }


def _year_earlier(d: datetime.date) -> datetime.date:
    try:
        return d.replace(year=d.year - 1)
    except ValueError:  # Feb 29
        return d.replace(year=d.year - 1, day=28)


def _long_date(d: datetime.date) -> str:
    return f"{d:%B} {d.day}, {d.year}"


def _month_starts(period: Period) -> List[datetime.date]:
    """First days of the whole months in `period` (a month still in progress is left out)."""
    out: List[datetime.date] = []
    d = datetime.date(period.start.year, period.start.month, 1)
    while True:
        nxt = datetime.date(d.year + (d.month == 12), d.month % 12 + 1, 1)
        if nxt - datetime.timedelta(days=1) > period.end:
            return out
        out.append(d)
        d = nxt


def _gap_ranges(days: List[datetime.date]) -> List[str]:
    """Consecutive days as readable ranges: "Nov 9, 2025", "Nov 9–11, 2025",
    "Nov 30 – Dec 1, 2025", "Dec 31, 2025 – Jan 1, 2026"."""
    runs: List[List[datetime.date]] = []
    for d in sorted(set(days)):
        if runs and d - runs[-1][1] == datetime.timedelta(days=1):
            runs[-1][1] = d
        else:
            runs.append([d, d])
    out = []
    for a, b in runs:
        if a == b:
            out.append(f"{a:%b} {a.day}, {a.year}")
        elif (a.year, a.month) == (b.year, b.month):
            out.append(f"{a:%b} {a.day}–{b.day}, {a.year}")
        elif a.year == b.year:
            out.append(f"{a:%b} {a.day} – {b:%b} {b.day}, {a.year}")
        else:
            out.append(f"{a:%b} {a.day}, {a.year} – {b:%b} {b.day}, {b.year}")
    return out


class _Fail(Exception):
    """A user-facing failure; call() returns it as 'Error: <message>'."""


class MatomoTools:
    def __init__(self, client, *, gateway_call: Optional[Callable[[str, dict], str]] = None,
                 v2: Callable[[], bool] = lambda: True,
                 today: Callable[[], datetime.date] = _today_ny,
                 budget: float = VIRGO_BUDGET_SEC,
                 clock: Callable[[], float] = time.monotonic,
                 automated_split: bool = True):
        self.client = client
        # False: never look up or query the automated-sessions segment (every answer gets the
        # warning). Used until Matomo pre-processes the segment without browser-triggered archiving.
        self.automated_split = automated_split
        self.clock = clock
        self._disabled_at: Optional[float] = None
        self._busy_at: Optional[float] = None
        # (site, period, date, segment) -> (when, "timeout" | "error"), kept SEGMENT_RETRY_SEC
        self._segment_timeouts: Dict[tuple, tuple] = {}
        self._segment_lock = threading.Lock()
        self.budget = budget
        self.gateway_call = gateway_call
        self.v2 = v2
        self.today = today

    # ---- tool surface ------------------------------------------------------------

    def _disabled(self) -> bool:
        if self._disabled_at is None:
            return False
        if self.clock() - self._disabled_at < RETRY_AFTER_SEC:
            return True
        self._disabled_at = None
        return False

    def tool_specs(self) -> List[Dict[str, Any]]:
        if self._disabled():
            return []  # Matomo refused the token: offer nothing until the retry window passes
        site = {"type": "string", "description": "Site name or id, e.g. Virgo, Library CMS, 10, or a host"}
        start = {"type": "string", "description": "YYYY-MM-DD"}
        end = {"type": "string", "description": "YYYY-MM-DD (default: yesterday)"}
        fy = {"type": "string", "description": "Fiscal year July-June named by end year, e.g. FY26"}
        automated = {"type": "string", "enum": list(AUTOMATED_MODES),
                     "description": "Automated sessions: show separately (default for Virgo), "
                                    "exclude, or ignore (default for other sites)"}
        specs = [
            _spec(TOOL_SITES, "List the Library's Matomo sites (id, name, URL). Use to find a site id "
                              "or when a site name is unclear.", {}, []),
            _spec(TOOL_TRAFFIC,
                  "Website traffic for a site and period: visits, unique visitors, pageviews, site "
                  "searches, downloads, outlinks, bounce rate, average visit. Optional comparison "
                  "period with % change. For Virgo, likely automated sessions are shown separately.",
                  {"site": site, "start_date": start, "end_date": end, "fiscal_year": fy,
                   "compare_start_date": start, "compare_end_date": end, "automated": automated},
                  ["site"]),
            _spec(TOOL_TOP_PAGES,
                  "Most-viewed pages for a site and period. report: pages (default), entry, exit or "
                  "titles. Optional path_prefix (e.g. /sources/uva_library/), limit (default 10, max 50).",
                  {"site": site, "start_date": start, "end_date": end, "fiscal_year": fy,
                   "report": {"type": "string", "enum": list(REPORT_METHODS)},
                   "path_prefix": {"type": "string"}, "limit": {"type": "integer"},
                   "automated": automated},
                  ["site"]),
            _spec(TOOL_PAGE,
                  "How one page is doing: pageviews, unique pageviews, average time on page, entries "
                  "and exits. url_or_path is a path like /hours (on that site) or a full URL.",
                  {"site": site, "url_or_path": {"type": "string"}, "start_date": start,
                   "end_date": end, "fiscal_year": fy},
                  ["site", "url_or_path"]),
        ]
        specs.append(_spec(
            TOOL_ANNUAL_REPORT,
            "The standard Virgo annual report for a fiscal year (July–June), compared with the previous "
            "year: summary, monthly visits, top collections and top records. Use it for annual-report "
            "requests.",
            {"fiscal_year": fy},
            ["fiscal_year"]))
        specs.append(_spec(
            TOOL_VIRGO_COLLECTIONS,
            "Virgo collections (report=collections, default) or items (report=items) ranked by visits, "
            "from Virgo's own view events — the annual-report method. Collections are labelled UVA "
            "collection, licensed, HathiTrust or purchase fund; items get catalog title, format and "
            "access type.",
            {"start_date": start, "end_date": end, "fiscal_year": fy,
             "report": {"type": "string", "enum": list(EVENT_ACTIONS)},
             "limit": {"type": "integer"}, "details": {"type": "boolean"}},
            []))
        if self.gateway_call is not None:
            specs.append(_spec(
                TOOL_VIRGO_ITEMS,
                "Most-viewed Virgo items for a period, by pool, with title, format, location and "
                "access type from the catalog.",
                {"start_date": start, "end_date": end, "fiscal_year": fy,
                 "pool": {"type": "string"}, "limit": {"type": "integer"},
                 "automated": automated, "details": {"type": "boolean"}},
                []))
        return specs

    def handles(self, name: str) -> bool:
        return name in (TOOL_SITES, TOOL_TRAFFIC, TOOL_TOP_PAGES, TOOL_PAGE, TOOL_VIRGO_ITEMS,
                        TOOL_VIRGO_COLLECTIONS, TOOL_ANNUAL_REPORT)

    def call(self, name: str, args: Dict[str, Any]) -> str:
        args = args if isinstance(args, dict) else {}
        if self.handles(name) and self._disabled():
            return f"Error: {UNAVAILABLE}"
        if self.handles(name) and self._busy_at is not None:
            if self.clock() - self._busy_at < BUSY_PAUSE_SEC:
                return f"Error: {OTHER_TIMEOUT}"
            self._busy_at = None
        try:
            if name == TOOL_SITES:
                return self.sites()
            if name == TOOL_TRAFFIC:
                return self.traffic(args)
            if name == TOOL_TOP_PAGES:
                return self.top_pages(args)
            if name == TOOL_PAGE:
                return self.page(args)
            if name == TOOL_VIRGO_ITEMS:
                if self.gateway_call is None:
                    return "Error: not available"
                return self.virgo_items(args)
            if name == TOOL_VIRGO_COLLECTIONS:
                return self.virgo_collections(args)
            if name == TOOL_ANNUAL_REPORT:
                return self.annual_report(args)
        except (_Fail, ValueError) as e:
            return f"Error: {e}"
        except MatomoAuthError as e:
            self._disabled_at = self.clock()
            logger.warning("matomo_auth_failed status=%s", e.status)
            return f"Error: {UNAVAILABLE}"
        except (MatomoTimeout, MatomoBusy) as e:
            self._busy_at = self.clock()
            logger.warning("matomo busy (%s); Matomo calls paused %ss", type(e).__name__, BUSY_PAUSE_SEC)
            return f"Error: {OTHER_TIMEOUT}"
        except MatomoError as e:
            return f"Error: {e}"
        except Exception as e:  # never hand the model a stack trace
            logger.warning("%s failed: %s", name, type(e).__name__)
            return "Error: Matomo didn't respond as expected; try again in a minute."
        return f"Unknown Matomo tool: {name}"

    # ---- helpers -----------------------------------------------------------------

    def _site(self, args: Dict[str, Any]) -> dict:
        return resolve_site(self.client.sites(), str(args.get("site") or ""))

    def _period(self, args: Dict[str, Any], prefix: str = "") -> Period:
        return resolve_period(str(args.get(prefix + "start_date") or ""),
                              str(args.get(prefix + "end_date") or ""),
                              "" if prefix else str(args.get("fiscal_year") or ""),
                              today=self.today())

    def _mode(self, args: Dict[str, Any], site: dict) -> str:
        mode = str(args.get("automated") or "").strip().lower()
        if not mode:
            return "show" if site["idsite"] == VIRGO_SITE_ID else "ignore"
        if mode not in AUTOMATED_MODES:
            raise _Fail(f"automated must be one of: {', '.join(AUTOMATED_MODES)}.")
        return mode

    @staticmethod
    def _head(site: dict, period: Period, handling: str, suffix: str = "", warning: str = "") -> str:
        """First line (site, dates, automated-session handling), then any warning, then the cap note."""
        lines = [f"{site['name']}, {period.label}; {handling}{suffix}"]
        if warning:
            lines.append(warning)
        if period.capped:
            lines.append("The end date was capped at yesterday (the latest day with data).")
        return "\n".join(lines)

    def _stored_segment(self, site: dict) -> Optional[str]:
        """The stored, pre-processed automated-sessions segment to send, or None (then no segment
        call is made: an ad-hoc segment makes Matomo process data on request)."""
        try:
            seg = self.client.stored_segment(AUTOMATED_SEGMENT, idsite=site["idsite"])
        except MatomoAuthError:
            raise
        except MatomoError:
            return None
        if not isinstance(seg, dict) or not isinstance(seg.get("definition"), str):
            return None
        return seg["definition"]

    def _automated(self, site: dict, jobs: List[tuple]) -> List[tuple]:
        """Automated-sessions reports for jobs [(period, method, extra)], current and comparison in
        parallel. Each result is (status, data): "ok", "absent" (no stored segment), "timeout" or
        "error". A timeout or error is remembered for 10 minutes for that site, period and segment."""
        seg = self._stored_segment(site) if self.automated_split else None
        if seg is None:
            return [("absent", None)] * len(jobs)

        def run(job):
            period, method, extra = job
            key = (site["idsite"], period.period, period.date, seg)
            with self._segment_lock:
                now = self.clock()
                for k in [k for k, (t, _) in self._segment_timeouts.items() if now - t >= SEGMENT_RETRY_SEC]:
                    del self._segment_timeouts[k]
                if key in self._segment_timeouts:
                    return self._segment_timeouts[key][1], None
            try:
                got = self._report(site, period, method, segment=seg, timeout=SEGMENT_TIMEOUT_SEC, **extra)
            except MatomoAuthError:
                raise
            except MatomoError as e:
                kind = "timeout" if isinstance(e, MatomoTimeout) else "error"
                with self._segment_lock:
                    self._segment_timeouts[key] = (self.clock(), kind)
                logger.info("matomo segment unavailable site=%s period=%s (%s)",
                            site["idsite"], period.date, type(e).__name__)
                return kind, None
            return "ok", got

        if len(jobs) == 1:
            return [run(jobs[0])]
        with ThreadPoolExecutor(max_workers=2) as ex:
            return list(ex.map(run, jobs))

    def _split_notes(self, site: dict, results: List[tuple], periods: List[Period],
                     compare: bool) -> tuple:
        """("", timeout note) for the periods whose automated split isn't available; no warning."""
        timed = [p for (status, _), p in zip(results, periods) if status == "timeout"]
        note = SEGMENT_TIMEOUT_NOTE.format(when=_when(timed, compare)) if timed else ""
        return "", note

    def _report(self, site: dict, period: Period, method: str, **extra) -> Any:
        """One report for `period`; a range is added up from processed months and days,
        never requested as period=range (see archived_parts)."""
        if period.period != "range":
            return self.client.api(method, idSite=site["idsite"], period=period.period,
                                   date=period.date, **extra)
        part_extra = dict(extra)
        if _num(part_extra.get("filter_limit")) > 0:
            part_extra["filter_limit"] = max(_num(part_extra["filter_limit"]), RANGE_ROWS)
        values: List[Any] = []
        for p, d in archived_parts(period):
            got = self.client.api(method, idSite=site["idsite"], period=p, date=d, **part_extra)
            if "," in d:
                values += list(got.values()) if isinstance(got, dict) else []
            else:
                values.append(got)
        return _merge_parts(values, extra.get("filter_sort_column"), extra.get("filter_limit"))

    def _plain(self, site: dict, period: Period) -> tuple:
        visits = self._report(site, period, "VisitsSummary.get")
        actions = self._report(site, period, "Actions.get")
        return (visits if isinstance(visits, dict) else {}), (actions if isinstance(actions, dict) else {})

    # ---- tools -------------------------------------------------------------------

    def sites(self) -> str:
        sites = self.client.sites()
        if not sites:
            return "No Matomo sites are visible to this account."
        lines = [f"Matomo sites ({len(sites)}):"]
        lines += [f"- {s['idsite']}: {_code(s['name']) if '<' in s['name'] or '`' in s['name'] else s['name']}"
                  f" — {s['main_url'] or 'no URL'}" for s in sites]
        return "\n".join(lines)

    _ROWS = [("visits", "Visits"), ("uniq", "Unique visitors"), ("pageviews", "Pageviews"),
             ("searches", "Site searches"), ("downloads", "Downloads"), ("outlinks", "Outlinks"),
             ("bounce", "Bounce rate"), ("avg", "Average visit")]
    _WITHOUT_ROWS = [("visits", "Visits"), ("actions", "Actions"),
                     ("bounce", "Bounce rate"), ("avg", "Average visit")]

    @staticmethod
    def _without(visits: dict, auto: dict) -> Dict[str, Any]:
        v = _num(visits.get("nb_visits")) - _num(auto.get("nb_visits"))
        a = _num(visits.get("nb_actions")) - _num(auto.get("nb_actions"))
        out: Dict[str, Any] = {"visits": max(v, 0), "actions": max(a, 0), "bounce": None, "avg": None}
        if v > 0:
            if visits.get("bounce_count") is not None and auto.get("bounce_count") is not None:
                b = (_num(visits["bounce_count"]) - _num(auto["bounce_count"])) / v * 100
                out["bounce"] = f"{b:.1f}%"
            if visits.get("sum_visit_length") is not None and auto.get("sum_visit_length") is not None:
                out["avg"] = (float(visits["sum_visit_length"]) - float(auto["sum_visit_length"])) / v
        return out

    @staticmethod
    def _fmt(key: str, value: Any) -> str:
        return _mmss(value) if key == "avg" else _rate(value) if key == "bounce" else _n(value)

    def _table(self, rows, cur: dict, period: Period, prev: Optional[dict] = None,
               compare: Optional[Period] = None) -> List[str]:
        if prev is None:
            return [f"- {label}: {self._fmt(k, cur.get(k))}" for k, label in rows]
        lines = [f"| Metric | {period.label} | {compare.label} | Change |", "| --- | --- | --- | --- |"]
        for k, label in rows:
            change = "—" if k == "bounce" else _pct_change(cur.get(k), prev.get(k))
            lines.append(f"| {label} | {self._fmt(k, cur.get(k))} | {self._fmt(k, prev.get(k))} | {change} |")
        return lines

    def _gather(self, period: Period, plain: tuple, auto: Optional[dict]) -> dict:
        visits, actions = plain
        return {"visits": visits, "actions": actions, "auto": auto,
                "plain": _metrics(visits, actions),
                "without": self._without(visits, auto) if auto is not None else None}

    @staticmethod
    def _share_line(auto: dict, visits: dict, label: str = "") -> str:
        a_visits, a_actions = _num(auto.get("nb_visits")), _num(auto.get("nb_actions"))
        total_actions = _num(visits.get("nb_actions"))
        share = f"{a_actions / total_actions * 100:.0f}%" if total_actions else "—"
        where = f", {label}" if label else ""
        return (f"Likely automated{where}: {a_visits:,} visits, {share} of actions "
                f"(hours-long sessions with {AUTOMATED_MIN_ACTIONS:,}+ actions).")

    def traffic(self, args: Dict[str, Any]) -> str:
        site = self._site(args)
        period = self._period(args)
        mode = self._mode(args, site)
        compare = None
        if args.get("compare_start_date") or args.get("compare_end_date"):
            compare = self._period(args, "compare_")
        periods = [period] + ([compare] if compare is not None else [])

        plains = [self._plain(site, p) for p in periods]
        warning, note = "", ""
        if mode == "ignore":
            autos: List[Optional[dict]] = [None] * len(periods)
        else:
            results = self._automated(site, [(p, "VisitsSummary.get", {}) for p in periods])
            autos = [(d if isinstance(d, dict) else {}) if st == "ok" else None for st, d in results]
            warning, note = self._split_notes(site, results, periods, compare is not None)
        cur = self._gather(period, plains[0], autos[0])
        prev = self._gather(compare, plains[1], autos[1]) if compare is not None else None
        have_auto = all(a is not None for a in autos)

        if mode == "ignore":
            handling = "Matomo's numbers as reported"
        elif not have_auto:
            handling = NOT_SEPARATED
        elif mode == "exclude":
            handling = "excluding likely automated sessions"
        else:
            handling = "automated sessions shown separately"
        lines = [self._head(site, period, handling, warning=warning)]
        if compare is not None:
            lines.append(f"Compared with {compare.label}.")
            if compare.capped:
                lines.append("The comparison end date was capped at yesterday (the latest day with data).")

        def block(rows, key):
            return self._table(rows, cur[key], period, prev[key] if prev else None, compare)

        if mode == "exclude" and have_auto:
            lines += block(self._WITHOUT_ROWS, "without")
            lines.append(NOT_AVAILABLE_NOTE)
        else:
            lines += block(self._ROWS, "plain")
            for p, g in zip(periods, [cur] + ([prev] if prev else [])):
                if g["auto"] is not None:
                    lines.append(self._share_line(g["auto"], g["visits"], p.label if compare else ""))
            if have_auto and mode != "ignore":
                lines.append("Without automated sessions:")
                lines += block(self._WITHOUT_ROWS, "without")
            if any(p.period == "range" for p in periods):
                lines.append(UNIQ_RANGE_NOTE)
        if note:
            lines.append(note)
        return "\n".join(lines)

    def top_pages(self, args: Dict[str, Any]) -> str:
        site = self._site(args)
        period = self._period(args)
        mode = self._mode(args, site)
        report = str(args.get("report") or "pages").strip().lower()
        if report not in REPORT_METHODS:
            raise _Fail(f"report must be one of: {', '.join(REPORT_METHODS)}.")
        try:
            limit = int(args.get("limit") or DEFAULT_LIMIT)
        except (TypeError, ValueError):
            limit = DEFAULT_LIMIT
        limit = max(1, min(limit, MAX_LIMIT))
        # One extra row tells us whether more exist.
        extra: Dict[str, Any] = {"flat": 1, "filter_limit": limit + 1,
                                 "filter_sort_column": SORT_COLUMNS[report],
                                 "filter_sort_order": "desc"}
        prefix = str(args.get("path_prefix") or "").strip()
        if prefix:
            if report == "titles":
                raise _Fail("path_prefix filters page URLs; titles can't be filtered by path.")
            extra["filter_pattern"] = "^/?" + re.escape(prefix.lstrip("/"))
        warning, note = "", ""
        subtracted = False
        method = REPORT_METHODS[report]
        sort_key = SORT_COLUMNS[report]
        handling = "Matomo's numbers as reported"
        rows: Any = None
        autos: Optional[Dict[str, Dict[str, int]]] = None  # show mode: automated counts by label
        if mode != "ignore":
            # Automated rows over all rows Matomo keeps, so every shown label can be matched.
            every = {**extra, "filter_limit": -1}
            (status, auto), = self._automated(site, [(period, method, every)])
            if status != "ok":
                warning, note = self._split_notes(site, [(status, None)], [period], False)
                handling = NOT_SEPARATED
            elif mode == "exclude":
                # Without automated sessions = plain - automated, label by label, re-ranked.
                rows = _subtract_rows(self._report(site, period, method, **every), auto, sort_key)
                handling, subtracted = "excluding likely automated sessions", True
            else:
                autos, subtracted = _auto_counts(auto), True
                handling = "automated sessions shown separately"
        if rows is None:
            rows = self._report(site, period, method, **extra)
        rows = [r for r in rows if isinstance(r, dict)] if isinstance(rows, list) else []
        more = len(rows) > limit
        rows = rows[:limit]

        def without(r: dict) -> str:
            a = (autos or {}).get(str(r.get("label")), {})
            return f" {_n(max(_num(r.get(sort_key)) - a.get(sort_key, 0), 0))} |"

        lines = [self._head(site, period, handling, f"; report: {report}", warning)]
        if not rows:
            lines.append("No rows.")
        else:
            rate_name = "Exit rate" if report == "exit" else "Bounce rate"
            show_without = autos is not None
            if report in ("entry", "exit"):
                count_name, count_key = ("Entries", "entry_nb_visits") if report == "entry" \
                    else ("Exits", "exit_nb_visits")
            else:
                count_name, count_key = "Pageviews", "nb_hits"
            extra_head = f" {count_name} without automated |" if show_without else ""
            if report in ("entry", "exit"):
                head = f"| Page | {count_name} |{extra_head} {rate_name} | Pageviews | Unique pageviews | Avg time |"
            else:
                head = f"| Page | Pageviews |{extra_head} Unique pageviews | Avg time | {rate_name} |"
            lines.append(head)
            lines.append("|" + " --- |" * (head.count("|") - 1))
            for r in rows:
                rate = r.get("exit_rate") if report == "exit" else r.get("bounce_rate")
                label = _display_label(r.get("label")).replace("|", "/")
                cut = without(r) if show_without else ""
                if report in ("entry", "exit"):
                    lines.append(f"| {label} | {_n(r.get(count_key))} |{cut} {_rate(rate)} | {_n(r.get('nb_hits'))} | "
                                 f"{_n(r.get('nb_visits'))} | {_mmss(r.get('avg_time_on_page'))} |")
                else:
                    lines.append(f"| {label} | {_n(r.get('nb_hits'))} |{cut} {_n(r.get('nb_visits'))} | "
                                 f"{_mmss(r.get('avg_time_on_page'))} | {_rate(rate)} |")
        if more:
            lines.append(f"Showing the top {limit}; more rows exist. Ask for a larger limit "
                         f"(max {MAX_LIMIT}) or use a path_prefix to narrow.")
        if subtracted:
            lines.append(OTHERS_SPLIT_NOTE)
        if period.period == "range":
            lines.append(RANGE_NOTE)
        if note:
            lines.append(note)
        return "\n".join(lines)

    def page(self, args: Dict[str, Any]) -> str:
        site = self._site(args)
        period = self._period(args)
        target = str(args.get("url_or_path") or "").strip()
        if not target:
            raise _Fail("Give a page URL or path.")
        if "://" in target:
            url = target
        else:
            url = (site.get("main_url") or "").rstrip("/") + "/" + target.lstrip("/")
        data = self._report(site, period, "Actions.getPageUrl", pageUrl=url)
        row = data[0] if isinstance(data, list) and data else data if isinstance(data, dict) else None
        if not isinstance(row, dict) or not row.get("nb_hits"):
            return (self._head(site, period, "Matomo's numbers as reported") +
                    f"\nNo Matomo data for {target} in {period.label}.")
        shown = _code(target) if _suspicious(target) and "://" not in target else target
        handling, warning, note, auto_lines = "Matomo's numbers as reported", "", "", []
        if site["idsite"] == VIRGO_SITE_ID:
            (status, auto), = self._automated(site, [(period, "Actions.getPageUrl", {"pageUrl": url})])
            if status == "ok":
                arow = auto[0] if isinstance(auto, list) and auto else auto if isinstance(auto, dict) else {}
                a_hits = _num(arow.get("nb_hits")) if isinstance(arow, dict) else 0
                handling = "automated sessions shown separately"
                auto_lines = [f"- Likely automated pageviews: {a_hits:,}",
                              f"- Pageviews without automated sessions: {max(_num(row.get('nb_hits')) - a_hits, 0):,}"]
            else:
                warning, note = self._split_notes(site, [(status, None)], [period], False)
                handling = NOT_SEPARATED
        lines = [
            self._head(site, period, handling, f"; page: {shown}", warning),
            f"- Pageviews: {_n(row.get('nb_hits'))}",
            *auto_lines,
            f"- Unique pageviews: {_n(row.get('nb_visits'))}",
            f"- Average time on page: {_mmss(row.get('avg_time_on_page'))}",
            f"- Entries: {_n(row.get('entry_nb_visits'))}",
            f"- Exits: {_n(row.get('exit_nb_visits'))}",
        ]
        if note:
            lines.append(note)
        return "\n".join(lines)


    # ---- Virgo items ---------------------------------------------------------------

    @staticmethod
    def _tally(rows: Any) -> tuple:
        """(hits by pool, hits by (pool, item id)) from flat getPageUrls rows."""
        pools: Dict[str, int] = {}
        items: Dict[tuple, int] = {}
        for r in rows if isinstance(rows, list) else []:
            if not isinstance(r, dict):
                continue
            label = " ".join(str(r.get("label") or "").split())
            m = _ITEM_LABEL.match(label)
            if not m:
                continue
            pool, rest = m.group(1).lower(), m.group(2)
            hits = _num(r.get("nb_hits"))
            if label.endswith(" - Others") and rest.strip() == "- Others":
                pools[pool] = pools.get(pool, 0) + hits  # grouped summary: pool total only
                continue
            pools[pool] = pools.get(pool, 0) + hits
            if "/" in rest or not _ITEM_ID.match(rest):
                continue  # counted in the pool total, but can't be ranked or looked up
            items[(pool, rest)] = items.get((pool, rest), 0) + hits
        return pools, items

    @staticmethod
    def _collection_kind(name: str) -> str:
        low = name.lower()
        if "hathi" in low:
            return "HathiTrust (external)"
        if any(k in low for k in _LICENSED_COLLECTIONS):
            return "licensed"
        if _FUND.search(name):
            return "purchase fund"
        return "UVA collection"

    def virgo_collections(self, args: Dict[str, Any]) -> str:
        site = resolve_site(self.client.sites(), str(VIRGO_SITE_ID))
        period = self._period(args)
        report = str(args.get("report") or "collections").strip().lower()
        if report not in EVENT_ACTIONS:
            raise _Fail(f"report must be one of: {', '.join(EVENT_ACTIONS)}.")
        items = report == "items"
        default, cap = (VIRGO_DEFAULT_LIMIT, VIRGO_MAX_LIMIT) if items else \
            (COLLECTIONS_DEFAULT_LIMIT, COLLECTIONS_MAX_LIMIT)
        try:
            limit = int(args.get("limit") or default)
        except (TypeError, ValueError):
            limit = default
        limit = max(1, min(limit, cap))
        details_on = items and self.gateway_call is not None and \
            args.get("details", True) not in (False, "false", "False", 0)
        ranked, others = self._event_counts(site, period, EVENT_ACTIONS[report])
        more = len(ranked) > limit
        ranked = ranked[:limit]
        what = "Virgo item views" if items else "Virgo collection views"
        lines = [self._head(site, period, NOT_SEPARATED, f"; report: {what} (Virgo events)")]
        if not ranked:
            lines.append("No views in this period.")
        elif items:
            picks = [(pool_for_item_id(n) or "uva_library", n) for n, _ in ranked]
            details = self._lookup_details(picks) if details_on else {}
            lines.append("Top items:")
            if details_on:
                lines += ["| Item | Visits | Item views | Format | Library / location | Access type |",
                          "| --- | --- | --- | --- | --- | --- |"]
            else:
                lines += ["| Item | Visits | Item views |", "| --- | --- | --- |"]
            missing = 0
            for (name, (visits, events)), pick in zip(ranked, picks):
                base = f"{_n(visits)} | {_n(events)}"
                if not details_on:
                    lines.append(f"| {_code(name)} | {base} |")
                    continue
                d = details.get(pick)
                if d is None:
                    missing += 1
                    lines.append(f"| {_code(name)} | {base} | details unavailable | — | "
                                 f"{classify_access(pool_for_item_id(name) or '', None)} |")
                    continue
                where = " / ".join(x for x in (d.library, d.location) if x)
                lines.append(f"| {_cell(d.title)} ({_code(name)}) | {base} | {_cell(d.format)} | "
                             f"{_cell(where)} | {classify_access(pick[0], d)} |")
            if details_on:
                if missing:
                    lines.append(f"{missing} item{'s' if missing != 1 else ''} without details "
                                 "(not in the catalog now, or the lookup failed).")
                lines.append(PROVISIONAL_NOTE)
        else:
            lines += ["| Collection | Visits | Item views | Kind |", "| --- | --- | --- | --- |"]
            for name, (visits, events) in ranked:
                lines.append(f"| {_cell(name)} | {_n(visits)} | {_n(events)} | {self._collection_kind(name)} |")
            lines.append(KIND_NOTE)
        if more:
            lines.append(f"Showing the top {limit}; more {'items' if items else 'collections'} exist "
                         f"(max limit {cap}).")
        if others:
            lines.append(f"{others:,} visits are grouped by Matomo as “Others” (it keeps only each "
                         "month's top items), so lower-ranked items are undercounted.")
        lines.append(EVENTS_NOTE)
        if items and period.period == "range":
            lines.append(RANGE_NOTE)
        return "\n".join(lines)

    def _event_counts(self, site: dict, period: Period, action: str) -> Tuple[List[tuple], int]:
        """Virgo view events for `action`: ([(name, (visits, events))] ranked by visits, then
        events, then name; visits Matomo grouped as "Others")."""
        rows = self._report(site, period, "Events.getAction", flat=1, filter_limit=-1,
                            filter_pattern=f"^{action} - ", filter_sort_column="nb_visits",
                            filter_sort_order="desc")
        counts: Dict[str, List[int]] = {}
        others = 0
        for r in rows if isinstance(rows, list) else []:
            if not isinstance(r, dict):
                continue
            label = str(r.get("label") or "")
            name = str(r.get("Events_EventName") or label.split(" - ", 1)[-1]).strip()
            if not label.startswith(action) or not name:
                continue
            if name == "Others":
                others += _num(r.get("nb_visits"))
                continue
            c = counts.setdefault(name, [0, 0])
            c[0] += _num(r.get("nb_visits"))
            c[1] += _num(r.get("nb_events"))
        ranked = sorted(((n, (v, e)) for n, (v, e) in counts.items()), key=lambda kv: (-kv[1][0], -kv[1][1], kv[0]))
        return ranked, others

    # ---- annual report -------------------------------------------------------------

    def _report_by_part(self, site: dict, period: Period, method: str, **extra) -> Dict[str, Any]:
        """Like _report, but the month and day values keyed by date ("YYYY-MM" for months,
        "YYYY-MM-DD" for days), not added up."""
        if period.period != "range":
            parts = [(period.period, period.date)]
        else:
            parts = archived_parts(period)
        out: Dict[str, Any] = {}
        for p, d in parts:
            got = self.client.api(method, idSite=site["idsite"], period=p, date=d, **extra)
            if "," in d:
                if isinstance(got, dict):
                    out.update({str(k): v for k, v in got.items()})
            else:
                out[d[:7] if p == "month" else d] = got
        return out

    def annual_report(self, args: Dict[str, Any]) -> str:
        fy = str(args.get("fiscal_year") or "").strip()
        if not fy:
            raise _Fail("Give a fiscal year, e.g. FY26.")
        site = resolve_site(self.client.sites(), str(VIRGO_SITE_ID))
        cur = resolve_period(fiscal_year=fy, today=self.today())
        n = cur.start.year + 1
        label, prev_label = f"FY{n % 100:02d}", f"FY{(n - 1) % 100:02d}"
        # The year before over the same dates: a whole year, or the same stretch of a year in progress.
        prev_end = _year_earlier(cur.end)
        prev = resolve_period(_year_earlier(cur.start).isoformat(), prev_end.isoformat(), today=self.today())
        head = (f"Virgo annual report — {label} ({_long_date(cur.start)} – {_long_date(cur.end)}), compared with "
                f"{prev_label} ({_long_date(prev.start)} – {_long_date(prev.end)})")
        lines = [head]
        notes: List[str] = []
        state: Dict[str, Any] = {}
        periods = (("cur", cur), ("prev", prev))

        def add(title: str, build) -> None:
            lines.append(f"## {title}")
            try:
                lines.extend(build())
            except (MatomoTimeout, MatomoBusy, MatomoAuthError):
                raise  # the breaker and auth handling in call()
            except (MatomoError, ValueError, _Fail) as e:
                lines.append(f"Unavailable: {e}")

        def summary() -> List[str]:
            vis = {k: self._report_by_part(site, p, "VisitsSummary.get") for k, p in periods}
            state["visits"] = vis
            act = {k: _merge_parts(list(self._report_by_part(site, p, "Actions.get").values())) for k, p in periods}
            tot = {k: _merge_parts(list(vis[k].values())) for k, _ in periods}
            out = [f"| Metric | {label} | {prev_label} | Change |", "| --- | --- | --- | --- |"]
            for name, src, key in (("Visits", tot, "nb_visits"), ("Pageviews", act, "nb_pageviews"),
                                   ("Site searches", act, "nb_searches"), ("Downloads", act, "nb_downloads")):
                c, p = src["cur"].get(key), src["prev"].get(key)
                out.append(f"| {name} | {_n(c)} | {_n(p)} | {_pct_change(c, p)} |")
            return out

        def monthly() -> List[str]:
            vis = state.get("visits") or {k: self._report_by_part(site, p, "VisitsSummary.get") for k, p in periods}
            out = [f"| Month | {label} visits | {prev_label} visits |", "| --- | --- | --- |"]
            for first in _month_starts(cur):
                key, pkey = f"{first:%Y-%m}", f"{_year_earlier(first):%Y-%m}"
                c, p = vis["cur"].get(key), vis["prev"].get(pkey)
                out.append(f"| {first:%b} | {_n(c.get('nb_visits') if isinstance(c, dict) else 0)} | "
                           f"{_n(p.get('nb_visits') if isinstance(p, dict) else 0)} |")
            return out

        def collections() -> List[str]:
            action = EVENT_ACTIONS["collections"]
            ranked, _ = self._event_counts(site, cur, action)
            before = dict(self._event_counts(site, prev, action)[0])
            out = [f"| Collection | {label} visits | {prev_label} visits | Item views | Kind |",
                   "| --- | --- | --- | --- | --- |"]
            for name, (visits, events) in ranked[:ANNUAL_COLLECTIONS]:
                out.append(f"| {_cell(name)} | {_n(visits)} | {_n(before.get(name, (0, 0))[0])} | {_n(events)} | "
                           f"{self._collection_kind(name)} |")
            return out

        def records() -> List[str]:
            if self.gateway_call is None:
                raise _Fail("catalog lookups are not available")
            ranked, others = self._event_counts(site, cur, EVENT_ACTIONS["items"])
            if others:
                notes.append(f"{others:,} record visits are grouped by Matomo as “Others” "
                             "(it keeps only each month's top items).")
            ranked = ranked[:ANNUAL_RECORDS]
            picks = [(pool_for_item_id(name) or "uva_library", name) for name, _ in ranked]
            details = self._lookup_details(picks)
            out = ["| Record | Visits | Item views | Format | Access type |", "| --- | --- | --- | --- | --- |"]
            for (name, (visits, events)), pick in zip(ranked, picks):
                d = details.get(pick)
                title = f"{_cell(d.title)} ({_code(name)})" if d is not None else _code(name)
                fmt = _cell(d.format) if d is not None else "details unavailable"
                out.append(f"| {title} | {_n(visits)} | {_n(events)} | {fmt} | {classify_access(pick[0], d)} |")
            notes.append(PROVISIONAL_NOTE)
            return out

        def gaps() -> List[str]:
            got = self.client.api("VisitsSummary.get", idSite=site["idsite"], period="day",
                                  date=f"{cur.start.isoformat()},{cur.end.isoformat()}")
            empty = sorted(datetime.date.fromisoformat(k) for k, v in (got.items() if isinstance(got, dict) else [])
                           if not (isinstance(v, dict) and _num(v.get("nb_visits")) > 0))
            out = []
            if empty:
                out.append(f"No visits were recorded on: {'; '.join(_gap_ranges(empty))} (likely tracking gaps).")
            return out + notes[:1] + [KIND_NOTE] + notes[1:]

        add("Summary", summary)
        add("Monthly visits", monthly)
        add("Top collections", collections)
        add("Top records", records)
        add("Notes", gaps)
        return "\n".join(lines)

    def _lookup_details(self, picks: List[tuple]) -> Dict[tuple, Any]:
        """Catalog details for (pool, id) picks: 4 at a time inside the overall budget."""
        name = gateway_name("get_item_details", bool(self.v2()))

        def one(pick):
            try:
                text = self.gateway_call(name, {"item_id": pick[1], "pool_id": pick[0]})
            except Exception:  # noqa: BLE001 — a failed lookup is just missing details
                return None
            if not isinstance(text, str) or text.lstrip().startswith(GATEWAY_ERROR_PREFIXES):
                return None
            details = parse_item_details(text)
            return details if details.found else None

        out: Dict[tuple, Any] = {p: None for p in picks}
        if not picks:
            return out
        pool = ThreadPoolExecutor(max_workers=5)  # 20 annual-report records within the budget
        try:
            futures = {pool.submit(one, p): p for p in picks}
            done, _ = futures_wait(list(futures), timeout=max(self.budget, 0.0))
            for f in done:
                out[futures[f]] = f.result()
        finally:
            pool.shutdown(wait=False, cancel_futures=True)
        return out

    def virgo_items(self, args: Dict[str, Any]) -> str:
        site = resolve_site(self.client.sites(), str(VIRGO_SITE_ID))
        period = self._period(args)
        mode = self._mode(args, site)
        pool = str(args.get("pool") or "").strip().lower()
        if pool and pool not in VIRGO_POOLS:
            raise _Fail(f"pool must be one of: {', '.join(VIRGO_POOLS)}.")
        try:
            limit = int(args.get("limit") or VIRGO_DEFAULT_LIMIT)
        except (TypeError, ValueError):
            limit = VIRGO_DEFAULT_LIMIT
        limit = max(1, min(limit, VIRGO_MAX_LIMIT))
        details_on = args.get("details", True) not in (False, "false", "False", 0)

        extra: Dict[str, Any] = {
            "flat": 1, "filter_limit": -1, "filter_sort_column": "nb_hits", "filter_sort_order": "desc",
            "filter_pattern": f"^/?sources/{pool or '[^/]+'}/items/"}
        method = "Actions.getPageUrls"
        warning, note = "", ""
        auto = without = None  # (pool totals, item totals)
        if mode != "ignore":
            (status, auto_rows), = self._automated(site, [(period, method, extra)])
            if status == "ok":
                auto = self._tally(auto_rows)
            else:
                warning, note = self._split_notes(site, [(status, None)], [period], False)
        plain = self._tally(self._report(site, period, method, **extra))
        if auto is not None:
            wp = {k: max(v - auto[0].get(k, 0), 0) for k, v in plain[0].items()}
            wi = {k: max(v - auto[1].get(k, 0), 0) for k, v in plain[1].items()}
            without = (wp, wi)
        if mode == "ignore":
            handling = "Matomo's numbers as reported"
        elif without is None:
            handling = NOT_SEPARATED
        elif mode == "exclude":
            handling = "excluding likely automated sessions"
        else:
            handling = "automated sessions shown separately"

        shown = without if without is not None else plain
        lines = [self._head(site, period, handling, "; report: Virgo item views", warning)]

        def pool_label(key: str) -> str:
            return POOL_NAMES.get(key, "Other")

        show_both = mode == "show" and auto is not None
        groups: Dict[str, List[str]] = {}
        for src in (plain, auto) if show_both else (shown,):
            for key in src[0]:
                groups.setdefault(pool_label(key), [])
                if key not in groups[pool_label(key)]:
                    groups[pool_label(key)].append(key)

        def total(src, label):
            return sum(src[0].get(k, 0) for k in groups.get(label, []))

        labels = [lb for lb in [POOL_NAMES[k] for k in VIRGO_POOLS] + ["Other"] if lb in groups]
        if not labels:
            lines.append("No Virgo item views in this period.")
        else:
            if show_both:
                lines += ["| Pool | Views | Automated | Without automated |", "| --- | --- | --- | --- |"]
            else:
                head = "Views (without automated)" if without is not None else "Views"
                lines += [f"| Pool | {head} |", "| --- | --- |"]
            for lb in labels:
                if show_both:
                    lines.append(f"| {lb} | {_n(total(plain, lb))} | {_n(total(auto, lb))} | "
                                 f"{_n(total(without, lb))} |")
                else:
                    lines.append(f"| {lb} | {_n(total(shown, lb))} |")

        ranked = sorted(((hits, key) for key, hits in shown[1].items() if hits > 0),
                        key=lambda x: (-x[0], x[1]))[:limit]
        if ranked:
            picks = [key for _, key in ranked]
            details = self._lookup_details(picks) if details_on else {}
            lines.append("")
            lines.append("Top items" + (" (views without automated sessions)" if without is not None else "") + ":")
            if details_on:
                lines += ["| Item | Pool | Views | Format | Library / location | Access type |",
                          "| --- | --- | --- | --- | --- | --- |"]
            else:
                lines += ["| Item | Pool | Views |", "| --- | --- | --- |"]
            missing = 0

            for hits, (p, item_id) in ranked:
                base = f"{_code(item_id)} | {_code(p)} | {_n(hits)}"
                if not details_on:
                    lines.append(f"| {base} |")
                    continue
                d = details.get((p, item_id))
                if d is None:
                    missing += 1
                    lines.append(f"| {base} | details unavailable | — | {classify_access(p, None)} |")
                    continue
                where = " / ".join(x for x in (d.library, d.location) if x)
                lines.append(f"| {_cell(d.title)} ({_code(item_id)}) | {_code(p)} | {_n(hits)} | "
                             f"{_cell(d.format)} | {_cell(where)} | {classify_access(p, d)} |")
            if details_on:
                if missing:
                    lines.append(f"{missing} item{'s' if missing != 1 else ''} without details "
                                 "(the catalog lookup failed or timed out).")
                lines.append(PROVISIONAL_NOTE)
        if without is not None:
            lines.append(OTHERS_SPLIT_NOTE)
        if period.period == "range":
            lines.append(RANGE_NOTE)
        if note:
            lines.append(note)
        return "\n".join(lines)


# ---- per-container instance --------------------------------------------------------

_INSTANCE: Optional[MatomoTools] = None
_FAILED_AT = 0.0
_WARNED = False
_LOCK = threading.Lock()


def _reset_cache() -> None:
    """Tests only."""
    global _INSTANCE, _FAILED_AT, _WARNED
    _INSTANCE, _FAILED_AT, _WARNED = None, 0.0, False


def _boto3_ssm_get(name: str, decrypt: bool) -> str:
    import boto3

    ssm = boto3.client("ssm", region_name=os.environ.get("AWS_REGION", "us-east-1"))
    return ssm.get_parameter(Name=name, WithDecryption=decrypt)["Parameter"]["Value"]


def matomo_tools_for_env(env=None, *, ssm_get=None, http=None, gateway_call=None,
                         v2=None) -> Optional[MatomoTools]:
    """Matomo tools for this container (switch on and token in SSM), or None. Makes no Matomo call:
    a token Matomo refuses switches the tools off from the first tool call (MatomoTools.call)."""
    global _INSTANCE, _FAILED_AT, _WARNED
    env = os.environ if env is None else env
    if str(env.get("ENABLE_MATOMO", "false")).strip().lower() != "true":
        return None
    with _LOCK:
        if _INSTANCE is not None:
            return _INSTANCE
        if _FAILED_AT and time.monotonic() - _FAILED_AT < RETRY_AFTER_SEC:
            return None
        try:
            token = (ssm_get or _boto3_ssm_get)(SSM_TOKEN_NAME, True)
            if not token:
                raise LookupError("Matomo token missing in SSM")
            # No Matomo call here: the first auth failure in a tool call switches the tools off.
            client = MatomoClient(token, http=http)
            kw: Dict[str, Any] = {"gateway_call": gateway_call,
                                  "automated_split": str(env.get("MATOMO_AUTOMATED_SPLIT", "false"))
                                  .strip().lower() == "true"}
            if v2 is not None:
                kw["v2"] = v2
            _INSTANCE = MatomoTools(client, **kw)
            logger.info("matomo tools on")
            return _INSTANCE
        except (KeyboardInterrupt, SystemExit):
            raise
        except BaseException as e:  # noqa: BLE001 — any setup failure switches Matomo off
            _FAILED_AT = time.monotonic()
            # Log the exception type only: messages could echo request details.
            if not _WARNED:
                _WARNED = True
                logger.warning("matomo tools off: setup failed (%s)", type(e).__name__)
            else:
                logger.info("matomo tools still off (%s)", type(e).__name__)
            return None
