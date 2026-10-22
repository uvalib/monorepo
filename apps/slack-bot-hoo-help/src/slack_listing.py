"""
slack_listing.py — list a public channel's history for a date range.

Pages conversations.history (top-level messages only; thread replies would need
one call per thread) up to MAX_MESSAGES, and turns it into one table: links,
files, or messages. The table feeds both the model (first rows only) and file
attachments (all rows).
"""

from __future__ import annotations

import html
import re
from dataclasses import dataclass
from datetime import datetime
from typing import Any, List, Optional
from zoneinfo import ZoneInfo

from identity import UserDirectory, resolve_mentions
from spreadsheet import SheetTable

TZ = ZoneInfo("America/New_York")
MAX_MESSAGES = 2000
PAGE_SIZE = 200
_SKIP_SUBTYPES = frozenset({"channel_join", "channel_leave", "channel_topic", "channel_purpose",
                            "channel_name", "pinned_item", "unpinned_item"})
_LINK = re.compile(r"<(https?://[^|>\s]+)(?:\|[^>]*)?>")
_CHANNEL_REF = re.compile(r"<#[CG][A-Z0-9]+\|([^>]*)>")
_SPECIAL = re.compile(r"<!(here|channel|everyone)(?:\|[^>]*)?>")
_AUTH: dict = {}  # per container: client id → (client, auth.test: workspace url, team id)

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
    covered_from: float = 0.0  # when capped: the oldest message kept (Slack pages newest first)


def extract_links(text: str) -> List[str]:
    """http(s) URLs in Slack's <url|label> markup (mentions, channels and mailto are skipped)."""
    return [html.unescape(url) for url in _LINK.findall(text or "")]


def plain_text(text: str, directory: UserDirectory) -> str:
    """Slack mrkdwn as a person reads it: names for mentions, #channel, bare URLs, & < > unescaped."""
    text = resolve_mentions(text or "", directory)
    text = _CHANNEL_REF.sub(lambda m: f"#{m.group(1)}", text)
    text = _SPECIAL.sub(lambda m: f"@{m.group(1)}", text)
    text = _LINK.sub(lambda m: m.group(1), text)
    return html.unescape(" ".join(text.split()))


def _day(ts: float) -> str:
    return datetime.fromtimestamp(ts, TZ).strftime("%Y-%m-%d")


def _when(ts: str) -> str:
    return datetime.fromtimestamp(float(ts), TZ).strftime("%Y-%m-%d %H:%M")


def _auth(client) -> dict:
    key = id(client)
    hit = _AUTH.get(key)
    if hit is None or hit[0] is not client:  # ids are reused once a client is freed
        try:
            auth = dict(client.auth_test() or {})
        except Exception:
            auth = {}
        hit = _AUTH[key] = (client, auth)
    return hit[1]


def _workspace_url(client) -> str:
    return str(_auth(client).get("url") or "") or "https://slack.com/"


def workspace_team(client) -> str:
    """The bot's own workspace (team) id, or '' when auth.test didn't say."""
    return str(_auth(client).get("team_id") or "")


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
            rows.append([when, who, plain_text(msg.get("text") or "", directory), link])

    covered_from = min(float(x.get("ts") or 0) for x in batch) if capped and batch else oldest
    label = f"#{channel_name}" if channel_name else channel_id
    title = f"{KIND_NOUNS[kind].capitalize()} in {label} ({_day(covered_from)} to {_day(latest - 1)})"
    return Listing(SheetTable(title, KIND_HEADERS[kind], rows, plain=True), kind, scanned, capped, oldest, latest,
                   covered_from)


def _cell(value: str) -> str:
    return str(value).replace("|", "\\|")


def format_listing(listing: Listing, channel_name: str, limit: int = 50) -> str:
    noun = KIND_NOUNS[listing.kind]
    total = len(listing.table.rows)
    start = listing.covered_from or listing.oldest
    lines = [f"### {noun.capitalize()} shared in #{channel_name} ({_day(start)} to {_day(listing.latest - 1)})",
             f"_{total} {noun} in {listing.scanned} messages · thread replies aren't included._", ""]
    if listing.capped:
        lines += [f"_Stopped at {MAX_MESSAGES} messages, so this covers {_day(start)} to {_day(listing.latest - 1)}; "
                  f"older messages (from {_day(listing.oldest)}) weren't fetched. Ask for a range ending "
                  f"{_day(start - 86400)} to get them._", ""]
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
