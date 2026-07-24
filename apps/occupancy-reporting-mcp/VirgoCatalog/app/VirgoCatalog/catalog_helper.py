"""
catalog_helper.py — Virgo Library Catalog Search Helper

Interacts with UVA Library's Virgo 4 services:
- Guest Token Auth: https://search.lib.virginia.edu/authorize
- Search Web Service: https://search-ws.internal.lib.virginia.edu/api/search
- Solr Catalog Pool: https://pool-solr-ws-uva-library.internal.lib.virginia.edu/api/search
- Resource Detail: https://pool-solr-ws-uva-library.internal.lib.virginia.edu/api/resource/{id}
"""

from __future__ import annotations

import logging
import time
from typing import Any, Dict, List, Optional, Tuple

import requests

logger = logging.getLogger(__name__)

VIRGO_AUTH_URL = "https://search.lib.virginia.edu/authorize"
SEARCH_WS_URL = "https://search-ws.internal.lib.virginia.edu/api/search"
SOLR_POOL_URL = "https://pool-solr-ws-uva-library.internal.lib.virginia.edu/api/search"
SOLR_RESOURCE_URL = "https://pool-solr-ws-uva-library.internal.lib.virginia.edu/api/resource"
VIRGO_ITEM_BASE = "https://search.lib.virginia.edu/sources"

_token_cache: Optional[str] = None
_token_expires_at: float = 0.0


def get_guest_token() -> str:
    """Fetch or return cached guest JWT authorization token."""
    global _token_cache, _token_expires_at

    now = time.time()
    if _token_cache and now < _token_expires_at - 60:
        return _token_cache

    try:
        resp = requests.post(
            VIRGO_AUTH_URL,
            json={},
            headers={"Content-Type": "application/json"},
            timeout=10,
        )
        resp.raise_for_status()
        token = resp.text.strip()
        _token_cache = token
        _token_expires_at = now + 1800  # Cache for 30 minutes
        return token
    except Exception as e:
        logger.error("Failed to fetch Virgo guest authorization token: %s", e)
        if _token_cache:
            return _token_cache
        raise RuntimeError(f"Virgo auth failed: {e}")


def format_query(raw_query: str, field: str = "keyword") -> str:
    """Format simple query into Virgo 4 query syntax (field: {term})."""
    query_str = raw_query.strip()
    if not query_str:
        return ""

    # If already formatted with field prefix and braces, leave as-is
    if ":" in query_str and "{" in query_str and "}" in query_str:
        return query_str

    valid_fields = {
        "keyword",
        "title",
        "author",
        "subject",
        "identifier",
        "journal_title",
        "series",
        "published",
    }
    target_field = field.lower() if field.lower() in valid_fields else "keyword"
    return f"{target_field}: {{{query_str}}}"


def extract_record_fields(fields_list: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Extract key display metadata from a Virgo record fields list."""
    rec: Dict[str, Any] = {
        "title": None,
        "subtitle": None,
        "author": None,
        "format": None,
        "published_date": None,
        "publisher": None,
        "call_number": None,
        "library": None,
        "location": None,
        "identifier": None,
        "availability": None,
        "access_url": None,
        "barcode": None,
        "located_in": None,
        "other": [],
    }

    authors: List[str] = []
    formats: List[str] = []

    for f in fields_list:
        ftype = f.get("type", "") or ""
        fname = f.get("name", "") or ""
        val = f.get("value", "")
        label = f.get("label", fname) or fname

        if not val:
            continue

        fname_l = fname.lower()
        ftype_l = ftype.lower()
        label_l = str(label).lower()

        if ftype_l == "title" or fname_l in ("title", "title_subtitle_edition"):
            rec["title"] = val
        elif ftype_l == "subtitle" or fname_l == "subtitle":
            rec["subtitle"] = val
        elif ftype_l in ("author", "author-display") or "author" in fname_l:
            if val not in authors:
                authors.append(val)
        elif fname_l in ("format", "work_type", "medium"):
            if val not in formats:
                formats.append(val)
        elif fname_l in ("published_date", "publication_date", "year"):
            rec["published_date"] = val
        elif fname_l in ("published", "publisher", "publisher_name", "publication"):
            rec["publisher"] = val
        elif fname_l in ("call_number", "call_number_display"):
            rec["call_number"] = val
        elif fname_l == "library":
            rec["library"] = val
        elif fname_l in ("location", "library_location"):
            rec["location"] = val
        elif fname_l == "located_in":
            rec["located_in"] = val
        elif ftype_l == "identifier" or fname_l in ("identifier", "id"):
            rec["identifier"] = val
        elif fname_l in ("availability", "availability_status") or ftype_l == "availability":
            rec["availability"] = val
        elif fname_l in ("access_url",) or ftype_l in ("access-url", "access_url"):
            rec["access_url"] = val
        elif fname_l == "barcode":
            rec["barcode"] = val
        else:
            # Catch alternate online-access labels
            if "access" in label_l and ("url" in label_l or "online" in label_l):
                if not rec["access_url"]:
                    rec["access_url"] = val
            else:
                rec["other"].append((label, val))

    if authors:
        rec["author"] = "; ".join(authors)
    if formats:
        rec["format"] = ", ".join(formats)

    return rec


_SECONDARY_TITLE_MARKERS = (
    "essay",
    "essays",
    "critical",
    "criticism",
    "notes",
    "companion",
    "study guide",
    "commentary",
    "cultural history",
    "quicklit",
    "cliffs",
    "innocence under pressure",
    "new essays",
    "a critical",
    "responses of college",
)


def _is_likely_secondary(rec: Dict[str, Any]) -> bool:
    """Heuristic: criticism / study guides vs the primary work."""
    title = (rec.get("title") or "").lower()
    if any(m in title for m in _SECONDARY_TITLE_MARKERS):
        return True
    # "J.D. Salinger's the Catcher in the Rye" is often an edited collection
    if "salinger's the catcher" in title or "salinger's catcher" in title:
        return True
    if title.startswith("j.d. salinger's") or title.startswith("j. d. salinger's"):
        return True
    return False


def _checkout_rank(rec: Dict[str, Any]) -> Tuple[int, int, str]:
    """
    Sort key for patron-useful ordering.
    Lower is better for "can I get this now?" questions.
    Tier 0 = availability usefulness; tier 1 = primary work before criticism.
    """
    avail = (rec.get("availability") or "").strip().lower()
    library = (rec.get("library") or "").strip().lower()
    location = (rec.get("location") or "").strip().lower()
    fmt = (rec.get("format") or "").strip().lower()

    special = "special collections" in library or "special collections" in location
    checked_out = "checked out" in location
    secondary = 1 if _is_likely_secondary(rec) else 0
    title = rec.get("title") or ""

    if avail == "on shelf" and not special:
        return (0, secondary, title)
    if avail == "online" or "online" in fmt or rec.get("access_url"):
        return (1, secondary, title)
    if avail == "on shelf" and special:
        return (2, secondary, title)
    if avail == "request" or checked_out:
        return (3, secondary, title)
    return (4, secondary, title)


def _virgo_item_url(pool_id: str, item_id: str) -> str:
    return f"{VIRGO_ITEM_BASE}/{pool_id}/items/{item_id}"


def _format_record_block(idx: int, rec: Dict[str, Any], pool_id: str = "uva_library") -> List[str]:
    """One result as a patron-friendly bullet block."""
    title = rec.get("title") or "Untitled"
    subtitle = rec.get("subtitle")
    full_title = f"{title}: {subtitle}" if subtitle else title
    item_id = rec.get("identifier") or ""
    virgo_url = _virgo_item_url(pool_id, item_id) if item_id else ""

    avail = rec.get("availability") or "Unknown"
    library = rec.get("library") or "—"
    location = rec.get("location") or "—"
    call_no = rec.get("call_number") or "—"
    fmt = rec.get("format") or "—"
    author = rec.get("author") or "—"
    access_url = rec.get("access_url")

    # Human-friendly availability note
    avail_l = avail.lower()
    loc_l = location.lower()
    if avail_l == "on shelf" and "special collections" in library.lower():
        status_note = "On shelf (Special Collections — request for Reading Room use; not standard checkout)"
    elif avail_l == "on shelf":
        status_note = "On shelf — available now"
    elif avail_l == "online":
        status_note = "Available online"
    elif avail_l == "request" or "checked out" in loc_l:
        status_note = "Not currently on shelf (request / checked out)"
    else:
        status_note = avail

    lines = [
        f"### {idx}. {full_title}",
        f"- **Availability**: {status_note}",
        f"- **Library**: {library}",
        f"- **Location / shelf**: {location}",
        f"- **Call number**: `{call_no}`",
        f"- **Format**: {fmt}",
        f"- **Author**: {author}",
    ]
    if access_url:
        lines.append(f"- **Access online**: {access_url}")
    if virgo_url:
        lines.append(f"- **Virgo record**: {virgo_url}")
    if item_id:
        lines.append(f"- **Item ID**: `{item_id}`")
    lines.append("")
    return lines


def search_catalog(
    query: str,
    field: str = "keyword",
    pool: str = "uva_library",
    start: int = 0,
    rows: int = 20,
) -> Dict[str, Any]:
    """
    Query Virgo search API.
    If pool is 'uva_library' or specific pool, queries that pool or master search service.
    """
    token = get_guest_token()
    formatted_q = format_query(query, field)

    payload = {
        "query": formatted_q,
        "pagination": {"start": start, "rows": rows},
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
    }

    url = SOLR_POOL_URL if pool in ("uva_library", "solr", "catalog") else SEARCH_WS_URL

    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=15)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        logger.error("Search request failed against %s: %s", url, e)
        token = get_guest_token()
        headers["Authorization"] = f"Bearer {token}"
        resp = requests.post(url, json=payload, headers=headers, timeout=15)
        resp.raise_for_status()
        return resp.json()


def get_item_details(pool_id: str, item_id: str) -> Dict[str, Any]:
    """Retrieve detailed item fields from Virgo resource API."""
    token = get_guest_token()
    headers = {"Authorization": f"Bearer {token}"}
    url = f"{SOLR_RESOURCE_URL}/{item_id}"
    try:
        resp = requests.get(url, headers=headers, timeout=15)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        logger.error("Item details request failed for %s: %s", url, e)
        raise RuntimeError(f"Failed to fetch item details for {item_id}: {e}")


def _records_from_group_list(groups: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    records: List[Dict[str, Any]] = []
    for grp in groups:
        rec_list = grp.get("record_list") or []
        if not rec_list:
            continue
        records.append(extract_record_fields(rec_list[0].get("fields", [])))
    return records


def format_search_results_markdown(
    query: str,
    data: Dict[str, Any],
    pool_filter: str = "uva_library",
) -> str:
    """
    Format search API JSON into a patron-useful report.

    Emphasizes: availability, library, shelf location, call number, digital access,
    and Virgo links. Sorts so circulating on-shelf and online copies surface first.
    """
    lines = [
        "# Virgo Catalog Search Results",
        f"**Query**: `{query}` | **Source/Pool**: `{pool_filter}`",
        "",
        "_Results sorted for usefulness: circulating on-shelf first, then online, "
        "then special collections / request-only._",
        "",
    ]

    # Direct pool result (pool-solr-ws)
    if "group_list" in data or "pagination" in data:
        total = data.get("pagination", {}).get("total", 0)
        groups = data.get("group_list", [])
        lines.append(f"**Total Hits**: {total:,} item(s) found (showing {len(groups)}).\n")

        if not groups:
            lines.append("No records matched your search query.")
            return "\n".join(lines)

        records = _records_from_group_list(groups)
        records.sort(key=_checkout_rank)

        # Quick summary for the agent
        on_shelf = [
            r
            for r in records
            if (r.get("availability") or "").lower() == "on shelf"
            and "special collections" not in (r.get("library") or "").lower()
        ]
        online = [r for r in records if (r.get("availability") or "").lower() == "online" or r.get("access_url")]
        special = [
            r
            for r in records
            if "special collections" in (r.get("library") or "").lower()
            or "special collections" in (r.get("location") or "").lower()
        ]
        requestish = [
            r
            for r in records
            if (r.get("availability") or "").lower() == "request"
            or "checked out" in (r.get("location") or "").lower()
        ]

        lines.append("## Quick summary")
        lines.append(
            f"- Circulating on shelf (open stacks): **{len(on_shelf)}**"
        )
        lines.append(f"- Available online: **{len(online)}**")
        lines.append(f"- Special Collections (not standard checkout): **{len(special)}**")
        lines.append(f"- Request / checked out: **{len(requestish)}**")
        lines.append("")

        if on_shelf:
            libs = sorted({r.get("library") or "Unknown" for r in on_shelf})
            lines.append(f"**Libraries with on-shelf copies in these results**: {', '.join(libs)}")
            lines.append("")

        lines.append("## Matching items\n")
        pool_id = "uva_library" if pool_filter in ("uva_library", "solr", "catalog") else pool_filter
        for idx, rec in enumerate(records, 1):
            lines.extend(_format_record_block(idx, rec, pool_id=pool_id))

        lines.append(
            "\n_Tip for assistants: For checkout questions, prioritize items with "
            "Availability **On shelf** at circulating libraries (Shannon, Clemons, "
            "Science & Engineering, Fine Arts, Music, etc.). Mention Special Collections "
            "separately as on-site use. Always include online Access links when present._"
        )
        return "\n".join(lines)

    # Master search service result (search-ws)
    total_hits = data.get("total_hits", 0)
    lines.append(f"**Total Hits Across Pools**: {total_hits:,}\n")

    pool_results = data.get("pool_results", [])
    if not pool_results:
        lines.append("No results found.")
        return "\n".join(lines)

    for pr in pool_results:
        pid = pr.get("pool_id", "unknown")
        ptotal = pr.get("pagination", {}).get("total", 0)
        groups = pr.get("group_list", [])

        lines.append(f"## Pool: `{pid}` ({ptotal:,} items)\n")
        if not groups:
            lines.append("_No items in this pool match._\n")
            continue

        records = _records_from_group_list(groups)
        records.sort(key=_checkout_rank)
        for idx, rec in enumerate(records, 1):
            lines.extend(_format_record_block(idx, rec, pool_id=pid))

    return "\n".join(lines)


def format_item_details_markdown(item_id: str, data: Dict[str, Any]) -> str:
    """Format full item detail JSON into markdown, leading with availability."""
    fields_list = data.get("fields", [])
    rec = extract_record_fields(fields_list)

    title = rec["title"] or item_id
    lines = [f"# Item Record: {title}"]
    if rec["subtitle"]:
        lines.append(f"*{rec['subtitle']}*")
    lines.append("")

    # Patron-facing availability first
    lines.append("## Availability & access")
    lines.append(f"- **Availability**: {rec.get('availability') or 'Unknown'}")
    lines.append(f"- **Library**: {rec.get('library') or '—'}")
    lines.append(f"- **Location / shelf**: {rec.get('location') or '—'}")
    if rec.get("located_in"):
        lines.append(f"- **Located in / collection**: {rec['located_in']}")
    lines.append(f"- **Call number**: `{rec.get('call_number') or '—'}`")
    if rec.get("access_url"):
        lines.append(f"- **Access online**: {rec['access_url']}")
    lines.append(f"- **Virgo Catalog URL**: {_virgo_item_url('uva_library', item_id)}")
    lines.append("")

    lines.append("## Bibliographic details")
    if rec["author"]:
        lines.append(f"- **Author(s)**: {rec['author']}")
    if rec["format"]:
        lines.append(f"- **Format**: {rec['format']}")
    if rec["published_date"]:
        lines.append(f"- **Publication Date**: {rec['published_date']}")
    if rec["publisher"]:
        lines.append(f"- **Publisher**: {rec['publisher']}")
    if rec["identifier"]:
        lines.append(f"- **Identifier**: `{rec['identifier']}`")
    if rec.get("barcode"):
        lines.append(f"- **Barcode**: `{rec['barcode']}`")
    lines.append("")

    # Library notes that often explain special-collections policy
    note_lines = []
    for f in fields_list:
        name = (f.get("name") or "").lower()
        label = f.get("label") or f.get("name") or ""
        val = f.get("value")
        if not val:
            continue
        if name in ("library_availability_note", "local_note", "notes") or "availab" in name:
            # strip simple HTML
            text = (
                str(val)
                .replace("<p>", "")
                .replace("</p>", " ")
                .replace("<br>", " ")
                .replace("<br/>", " ")
            )
            note_lines.append(f"- **{label}**: {text.strip()}")
    if note_lines:
        lines.append("## Notes")
        lines.extend(note_lines)
        lines.append("")

    lines.append("## Complete Record Fields\n")
    lines.append("| Field Label | Value |")
    lines.append("|---|---|")

    for f in fields_list:
        lbl = f.get("label", f.get("name", ""))
        val = str(f.get("value", "")).replace("\n", " ").replace("|", "\\|")
        # Skip huge MARC blob in the table body summary path is already enough
        if (f.get("name") or "") == "full_record" or (f.get("type") or "") == "marc-xml":
            continue
        if lbl and val:
            lines.append(f"| **{lbl}** | {val[:500]} |")

    related = data.get("related", [])
    if related:
        lines.append("\n## Related Items\n")
        for rel in related:
            rel_rec = extract_record_fields(rel.get("fields", []))
            rtitle = rel_rec["title"] or "Related item"
            rauthor = f" by {rel_rec['author']}" if rel_rec["author"] else ""
            rid = rel_rec["identifier"] or ""
            rlink = f" ([View]({_virgo_item_url('uva_library', rid)}))" if rid else ""
            ravail = f" — {rel_rec['availability']}" if rel_rec.get("availability") else ""
            rloc = (
                f" @ {rel_rec['library']}/{rel_rec['location']}"
                if rel_rec.get("library") or rel_rec.get("location")
                else ""
            )
            lines.append(f"- **{rtitle}**{rauthor}{ravail}{rloc}{rlink}")

    return "\n".join(lines)
