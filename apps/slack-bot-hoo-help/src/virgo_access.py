"""
virgo_access.py — parse Virgo get_item_details text and classify an item's access type.

The access type is a provisional rule (pool plus the host of the access link) until the
annual-report definitions are settled. Item text is untrusted: callers must make it safe
before showing it.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import List, Optional
from urllib.parse import parse_qs, urlparse

ACCESS_TYPES = ("physical (UVA collection)", "UVA digital", "licensed e-resource",
                "licensed (EDS)", "HathiTrust", "unknown")

LICENSED_HOSTS = (
    "proxy1.library.virginia.edu", "ebookcentral.proquest.com", "serialssolutions.com",
    "kanopy.com", "ebscohost.com", "jstor.org", "oreilly.com", "sciencedirect.com",
    "springer.com", "wiley.com", "tandfonline.com", "taylorfrancis.com",
)
UVA_DIGITAL_HOSTS = (
    "avalon.lib.virginia.edu", "iiif.lib.virginia.edu", "libra2.lib.virginia.edu",
    "libraetd.lib.virginia.edu", "search.lib.virginia.edu",
)
_NO_LIBRARY = ("", "—", "UVA Library")


@dataclass
class ItemDetails:
    title: str = ""
    format: str = ""
    library: str = ""
    location: str = ""
    access_urls: List[str] = field(default_factory=list)


def _clean(value: str) -> str:
    value = value.strip()
    return "" if value in ("—", "-", "–") else value


_TITLE = re.compile(r"^#\s*Item Record:\s*(.*)$", re.M)
_URL = re.compile(r"https?://[^\s<>\[\]()]+", re.I)


def _field(text: str, name: str) -> List[str]:
    return [m.group(1) for m in re.finditer(rf"^\s*-\s*\*\*{re.escape(name)}\*\*:[ \t]*(.*)$", text, re.M)]


def parse_item_details(text: str) -> ItemDetails:
    text = text or ""
    m = _TITLE.search(text)
    first = lambda name: _clean((_field(text, name) or [""])[0])  # noqa: E731
    urls: List[str] = []
    for line in _field(text, "Access online"):
        urls += _URL.findall(line)
    return ItemDetails(title=_clean(m.group(1)) if m else "", format=first("Format"),
                       library=first("Library"), location=first("Location / shelf"),
                       access_urls=urls)


def _host_matches(host: str, suffixes) -> bool:
    host = (host or "").lower().rstrip(".")
    return any(host == s or host.endswith("." + s) for s in suffixes)


def _hosts(url: str) -> List[str]:
    """The outer host plus, for a proxy login URL, the host inside its url= parameter."""
    try:
        parsed = urlparse(url)
        hosts = [parsed.hostname or ""]
        for inner in parse_qs(parsed.query).get("url", []):
            hosts.append(urlparse(inner).hostname or "")
        return hosts
    except ValueError:
        return []


def classify_access(pool: str, details: Optional[ItemDetails]) -> str:
    if pool == "articles":
        return "licensed (EDS)"
    if pool == "hathitrust":
        return "HathiTrust"
    if pool == "images":
        return "UVA digital"
    if pool != "uva_library" or details is None:
        return "unknown"
    hosts = [h for u in details.access_urls for h in _hosts(u)]
    if any(_host_matches(h, LICENSED_HOSTS) for h in hosts):
        return "licensed e-resource"
    if any(_host_matches(h, UVA_DIGITAL_HOSTS) for h in hosts):
        return "UVA digital"
    if not details.access_urls and details.library not in _NO_LIBRARY:
        return "physical (UVA collection)"
    return "unknown"
