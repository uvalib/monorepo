"""
slack_listing.py — list a public channel's history for a date range.

Pages conversations.history (top-level messages only; thread replies would need
one call per thread) up to MAX_MESSAGES, and turns it into one table: links,
files, or messages. The table feeds both the model (first rows only) and file
attachments (all rows).
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime
from typing import Any, List, Optional
from zoneinfo import ZoneInfo

from identity import UserDirectory
from spreadsheet import SheetTable

TZ = ZoneInfo("America/New_York")
MAX_MESSAGES = 2000
PAGE_SIZE = 200
_SKIP_SUBTYPES = frozenset({"channel_join", "channel_leave", "channel_topic", "channel_purpose",
                            "channel_name", "pinned_item", "unpinned_item"})
_LINK = re.compile(r"<(https?://[^|>\s]+)(?:\|[^>]*)?>")
_WORKSPACE_URLS: dict = {}  # per container: client id → https://<workspace>.slack.com/

KIND_HEADERS = {
    "links": ["Date", "Author", "URL", "Message"],
    "files": ["Date", "Author", "File", "Link", "Message"],
    "all": ["Date", "Author", "Text", "Message"],
}
KIND_NOUNS = {"links": "links", "files": "files", "all": "messages"}


@dataclass
class Listing:
    table: SheetTable
    kind: str
    scanned: int
    capped: bool
    oldest: float
    latest: float


def extract_links(text: str) -> List[str]:
    """http(s) URLs in Slack's <url|label> markup (mentions, channels and mailto are skipped)."""
    return _LINK.findall(text or "")


def _day(ts: float) -> str:
    return datetime.fromtimestamp(ts, TZ).strftime("%Y-%m-%d")


def _when(ts: str) -> str:
    return datetime.fromtimestamp(float(ts), TZ).strftime("%Y-%m-%d %H:%M")


def _workspace_url(client) -> str:
    key = id(client)
    if key not in _WORKSPACE_URLS:
        try:
            _WORKSPACE_URLS[key] = str((client.auth_test() or {}).get("url") or "")
        except Exception:
            _WORKSPACE_URLS[key] = ""
    return _WORKSPACE_URLS[key] or "https://slack.com/"


def list_channel(client, channel_id: str, *, kind: str, oldest: float, latest: float,
                 directory: UserDirectory, author_id: str = "", channel_name: str = "") -> Listing:
    kind = kind if kind in KIND_HEADERS else "links"
    base = _workspace_url(client).rstrip("/")
    rows: List[List[str]] = []
    scanned, cursor, capped = 0, None, False
    batch: List[dict] = []
    while True:
        resp = client.conversations_history(channel=channel_id, oldest=str(int(oldest)), latest=str(int(latest)),
                                            limit=PAGE_SIZE, cursor=cursor, inclusive=True) or {}
        for msg in resp.get("messages") or []:
            if msg.get("subtype") in _SKIP_SUBTYPES:
                continue
            if scanned >= MAX_MESSAGES:
                capped = True
                break
            scanned += 1
            batch.append(msg)
        cursor = (resp.get("response_metadata") or {}).get("next_cursor")
        more = bool(cursor) and resp.get("has_more", True)
        if scanned >= MAX_MESSAGES and more:  # full, and Slack has more: don't fetch another page
            capped = True
        if capped or not more:
            break

    for msg in sorted(batch, key=lambda x: float(x.get("ts") or 0)):  # oldest first
        uid = msg.get("user") or ""
        if author_id and uid != author_id:
            continue
        who = directory.label(uid) if uid else (msg.get("username") or "bot")
        ts = str(msg.get("ts") or "")
        link = f"{base}/archives/{channel_id}/p{ts.replace('.', '')}"
        when = _when(ts) if ts else ""
        if kind == "links":
            for url in extract_links(msg.get("text") or ""):
                rows.append([when, who, url, link])
        elif kind == "files":
            for f in msg.get("files") or []:
                rows.append([when, who, str(f.get("name") or f.get("title") or "file"),
                             str(f.get("permalink") or ""), link])
        else:
            rows.append([when, who, " ".join((msg.get("text") or "").split()), link])

    label = f"#{channel_name}" if channel_name else channel_id
    title = f"{KIND_NOUNS[kind].capitalize()} in {label} ({_day(oldest)} to {_day(latest)})"
    return Listing(SheetTable(title, KIND_HEADERS[kind], rows), kind, scanned, capped, oldest, latest)


def _cell(value: str) -> str:
    return str(value).replace("|", "\\|")


def format_listing(listing: Listing, channel_name: str, limit: int = 50) -> str:
    noun = KIND_NOUNS[listing.kind]
    total = len(listing.table.rows)
    lines = [f"### {noun.capitalize()} shared in #{channel_name} ({_day(listing.oldest)} to {_day(listing.latest)})",
             f"_{total} {noun} in {listing.scanned} messages · thread replies aren't included._", ""]
    if listing.capped:
        lines += [f"_Stopped after the first {MAX_MESSAGES} messages; a shorter date range gets the rest._", ""]
    if total:
        headers = listing.table.headers
        lines.append("| " + " | ".join(headers) + " |")
        lines.append("|" + " --- |" * len(headers))
        lines += ["| " + " | ".join(_cell(v) for v in row) + " |" for row in listing.table.rows[:limit]]
        lines.append("")
    if total > limit:
        lines.append(f"Showing the first {limit} of {total}. The full list can be attached as a CSV, JSON or Excel "
                     "file — ask for one.")
    elif total:
        lines.append("This list can be attached as a CSV, JSON or Excel file — ask for one.")
    else:
        lines.append(f"No {noun} in that range.")
    return "\n".join(lines)
