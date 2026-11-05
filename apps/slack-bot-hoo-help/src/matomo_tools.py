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
from typing import Any, Callable, Dict, List, Optional
from zoneinfo import ZoneInfo

from link_check import is_library_url
from matomo_client import MatomoAuthError, MatomoClient, MatomoError, MatomoTimeout
from matomo_report import (
    AUTOMATED_MIN_ACTIONS, AUTOMATED_MIN_SECONDS, AUTOMATED_SEGMENT, VIRGO_SITE_ID, Period, resolve_period, resolve_site,
)

logger = logging.getLogger(__name__)

TOOL_SITES = "matomo_sites"
TOOL_TRAFFIC = "matomo_traffic"
TOOL_TOP_PAGES = "matomo_top_pages"
TOOL_PAGE = "matomo_page"
TOOL_VIRGO_ITEMS = "matomo_virgo_items"

SSM_TOKEN_NAME = "/hoohelp/matomo/token"
RETRY_AFTER_SEC = 600
MAX_LIMIT = 50
DEFAULT_LIMIT = 10
SEGMENT_TIMEOUT_NOTE = ("Matomo is still preparing the automated-session breakdown for this "
                        "period; ask again in a few minutes.")
OTHER_TIMEOUT = "Matomo didn't respond in time; try a shorter range or ask again shortly."
AUTOMATED_MODES = ("show", "exclude", "ignore")
# Matomo's own negation (OR of the complements) for "everything but automated sessions".
NOT_AUTOMATED_SEGMENT = f"visitDuration<{AUTOMATED_MIN_SECONDS},actions<{AUTOMATED_MIN_ACTIONS}"
SORT_COLUMNS = {"pages": "nb_hits", "titles": "nb_hits",
                "entry": "entry_nb_visits", "exit": "exit_nb_visits"}
NOT_AVAILABLE_NOTE = ("Pageviews, searches, downloads, outlinks and unique visitors aren't "
                      "available without automated sessions.")
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
        return OTHERS_LABEL
    m = _SCHEME_URL.match(text)
    if m:
        rest = m.group(1)
        if is_library_url(text):
            return _code(text) if _suspicious(rest) else text
        text = rest if rest.startswith("/") else "/" + rest
    return _code(text) if _suspicious(text) else text


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


class _Fail(Exception):
    """A user-facing failure; call() returns it as 'Error: <message>'."""


class MatomoTools:
    def __init__(self, client, *, gateway_call: Optional[Callable[[str, dict], str]] = None,
                 v2: Callable[[], bool] = lambda: True,
                 today: Callable[[], datetime.date] = _today_ny):
        self.client = client
        self.gateway_call = gateway_call
        self.v2 = v2
        self.today = today

    # ---- tool surface ------------------------------------------------------------

    def tool_specs(self) -> List[Dict[str, Any]]:
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
        return name in (TOOL_SITES, TOOL_TRAFFIC, TOOL_TOP_PAGES, TOOL_PAGE, TOOL_VIRGO_ITEMS)

    def call(self, name: str, args: Dict[str, Any]) -> str:
        args = args if isinstance(args, dict) else {}
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
                return "Error: not available"
        except (_Fail, ValueError) as e:
            return f"Error: {e}"
        except MatomoTimeout:
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
    def _head(site: dict, period: Period, handling: str) -> str:
        text = f"{site['name']}, {period.label}; {handling}"
        if period.capped:
            text += "\nThe end date was capped at yesterday (the latest day with data)."
        return text

    def _report(self, site: dict, period: Period, method: str, **extra) -> Any:
        return self.client.api(method, idSite=site["idsite"], period=period.period,
                               date=period.date, **extra)

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

    def _gather(self, site: dict, period: Period, mode: str) -> dict:
        visits, actions = self._plain(site, period)
        auto, timed_out = None, False
        if mode != "ignore":
            try:
                got = self._report(site, period, "VisitsSummary.get", segment=AUTOMATED_SEGMENT)
                auto = got if isinstance(got, dict) else {}
            except MatomoTimeout:
                timed_out = True
        return {"visits": visits, "actions": actions, "auto": auto, "timed_out": timed_out,
                "plain": _metrics(visits, actions),
                "without": self._without(visits, auto) if auto is not None else None}

    def traffic(self, args: Dict[str, Any]) -> str:
        site = self._site(args)
        period = self._period(args)
        mode = self._mode(args, site)
        compare = None
        if args.get("compare_start_date") or args.get("compare_end_date"):
            compare = self._period(args, "compare_")

        cur = self._gather(site, period, mode)
        prev = self._gather(site, compare, mode) if compare is not None else None
        note = SEGMENT_TIMEOUT_NOTE if cur["timed_out"] or (prev and prev["timed_out"]) else ""
        have_auto = cur["auto"] is not None and (prev is None or prev["auto"] is not None)

        if mode == "ignore":
            handling = "Matomo's numbers as reported"
        elif not have_auto:
            handling = "Matomo's numbers as reported; the automated-session breakdown is unavailable"
        elif mode == "exclude":
            handling = "excluding likely automated sessions"
        else:
            handling = "automated sessions shown separately"
        lines = [self._head(site, period, handling)]
        if compare is not None:
            lines.append(f"Compared with {compare.label}.")

        def block(rows, key):
            return self._table(rows, cur[key], period, prev[key] if prev else None, compare)

        if mode == "exclude" and have_auto:
            lines += block(self._WITHOUT_ROWS, "without")
            lines.append(NOT_AVAILABLE_NOTE)
        else:
            lines += block(self._ROWS, "plain")
            if have_auto:
                auto, visits = cur["auto"], cur["visits"]
                a_visits, a_actions = _num(auto.get("nb_visits")), _num(auto.get("nb_actions"))
                total_actions = _num(visits.get("nb_actions"))
                share = f"{a_actions / total_actions * 100:.0f}%" if total_actions else "—"
                lines.append(
                    f"Likely automated: {a_visits:,} visits, {share} of actions "
                    f"(hours-long sessions with {AUTOMATED_MIN_ACTIONS:,}+ actions).")
                lines.append("Without automated sessions:")
                lines += block(self._WITHOUT_ROWS, "without")
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
        note = ""
        if mode == "exclude":
            handling = "excluding likely automated sessions"
        elif mode == "show":
            handling = ("Matomo's numbers as reported, automated sessions included "
                        "(matomo_traffic shows the breakdown)")
        else:
            handling = "Matomo's numbers as reported"
        method = REPORT_METHODS[report]
        if mode == "exclude":
            try:
                rows = self._report(site, period, method, segment=NOT_AUTOMATED_SEGMENT, **extra)
            except MatomoTimeout:
                note = SEGMENT_TIMEOUT_NOTE
                handling = "Matomo's numbers as reported; the automated-session breakdown is unavailable"
                rows = self._report(site, period, method, **extra)
        else:
            rows = self._report(site, period, method, **extra)
        rows = [r for r in rows if isinstance(r, dict)] if isinstance(rows, list) else []
        more = len(rows) > limit
        rows = rows[:limit]
        lines = [self._head(site, period, handling) + f"; report: {report}"]
        if not rows:
            lines.append("No rows.")
        else:
            rate_name = "Exit rate" if report == "exit" else "Bounce rate"
            lines.append(f"| Page | Pageviews | Unique pageviews | Avg time | {rate_name} |")
            lines.append("| --- | --- | --- | --- | --- |")
            for r in rows:
                rate = r.get("exit_rate") if report == "exit" else r.get("bounce_rate")
                label = _display_label(r.get("label")).replace("|", "/")
                lines.append(f"| {label} | {_n(r.get('nb_hits'))} | {_n(r.get('nb_visits'))} | "
                             f"{_mmss(r.get('avg_time_on_page'))} | {_rate(rate)} |")
        if more:
            lines.append(f"Showing the top {limit}; more rows exist. Ask for a larger limit "
                         f"(max {MAX_LIMIT}) or use a path_prefix to narrow.")
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
        return "\n".join([
            self._head(site, period, "Matomo's numbers as reported") + f"; page: {shown}",
            f"- Pageviews: {_n(row.get('nb_hits'))}",
            f"- Unique pageviews: {_n(row.get('nb_visits'))}",
            f"- Average time on page: {_mmss(row.get('avg_time_on_page'))}",
            f"- Entries: {_n(row.get('entry_nb_visits'))}",
            f"- Exits: {_n(row.get('exit_nb_visits'))}",
        ])


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
    """Matomo tools for this container, or None when switched off or not working."""
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
            client = MatomoClient(token, http=http)
            client.sites()  # proves the token works
            kw: Dict[str, Any] = {"gateway_call": gateway_call}
            if v2 is not None:
                kw["v2"] = v2
            _INSTANCE = MatomoTools(client, **kw)
            logger.info("matomo tools on")
            return _INSTANCE
        except (KeyboardInterrupt, SystemExit):
            raise
        except BaseException as e:  # noqa: BLE001 — any setup failure switches Matomo off
            _FAILED_AT = time.monotonic()
            if isinstance(e, MatomoAuthError):
                logger.warning("matomo_auth_failed status=%s", e.status)
            # Log the exception type only: messages could echo request details.
            if not _WARNED:
                _WARNED = True
                logger.warning("matomo tools off: setup failed (%s)", type(e).__name__)
            else:
                logger.info("matomo tools still off (%s)", type(e).__name__)
            return None
