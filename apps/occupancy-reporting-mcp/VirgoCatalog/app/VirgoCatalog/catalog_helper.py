"""
catalog_helper.py — Virgo Library Catalog Search Helper

Interacts with UVA Library's Virgo 4 services:
- Guest Token Auth: https://search.lib.virginia.edu/authorize
- Search Web Service: https://search-ws.internal.lib.virginia.edu/api/search
- Solr Catalog Pool: https://pool-solr-ws-uva-library.internal.lib.virginia.edu/api/search
- Resource Detail: https://pool-solr-ws-uva-library.internal.lib.virginia.edu/api/resource/{id}
"""

import logging
import time
import requests
from typing import Dict, Any, Optional, List, Tuple

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
        logger.error(f"Failed to fetch Virgo guest authorization token: {e}")
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
        "keyword", "title", "author", "subject",
        "identifier", "journal_title", "series", "published"
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
        "location": None,
        "identifier": None,
        "availability": None,
        "other": []
    }

    authors = []
    formats = []

    for f in fields_list:
        ftype = f.get("type", "")
        fname = f.get("name", "")
        val = f.get("value", "")
        label = f.get("label", fname)

        if not val:
            continue

        if ftype == "title" or fname == "title":
            rec["title"] = val
        elif ftype == "subtitle" or fname == "subtitle":
            rec["subtitle"] = val
        elif ftype in ("author", "author-display") or "author" in fname:
            if val not in authors:
                authors.append(val)
        elif fname in ("format", "work_type", "medium"):
            if val not in formats:
                formats.append(val)
        elif fname in ("published_date", "publication_date", "year"):
            rec["published_date"] = val
        elif fname in ("published", "publisher", "publication"):
            rec["publisher"] = val
        elif fname in ("call_number", "call_number_display"):
            rec["call_number"] = val
        elif fname in ("location", "library_location", "library"):
            rec["location"] = val
        elif ftype == "identifier" or fname == "identifier":
            rec["identifier"] = val
        elif fname in ("availability", "availability_status"):
            rec["availability"] = val
        else:
            rec["other"].append((label, val))

    if authors:
        rec["author"] = "; ".join(authors)
    if formats:
        rec["format"] = ", ".join(formats)

    return rec


def search_catalog(
    query: str,
    field: str = "keyword",
    pool: str = "uva_library",
    start: int = 0,
    rows: int = 20
) -> Dict[str, Any]:
    """
    Query Virgo search API.
    If pool is 'uva_library' or specific pool, queries that pool or master search service.
    """
    token = get_guest_token()
    formatted_q = format_query(query, field)

    payload = {
        "query": formatted_q,
        "pagination": {"start": start, "rows": rows}
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }

    # Decide whether to query catalog pool solr endpoint or master search endpoint
    url = SOLR_POOL_URL if pool in ("uva_library", "solr", "catalog") else SEARCH_WS_URL

    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        return data
    except Exception as e:
        logger.error(f"Search request failed against {url}: {e}")
        # Retry once with fresh token
        token = get_guest_token()
        headers["Authorization"] = f"Bearer {token}"
        resp = requests.post(url, json=payload, headers=headers, timeout=15)
        resp.raise_for_status()
        return resp.json()


def get_item_details(pool_id: str, item_id: str) -> Dict[str, Any]:
    """Retrieve detailed item fields from Virgo resource API."""
    token = get_guest_token()
    headers = {
        "Authorization": f"Bearer {token}"
    }
    url = f"{SOLR_RESOURCE_URL}/{item_id}"
    try:
        resp = requests.get(url, headers=headers, timeout=15)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        logger.error(f"Item details request failed for {url}: {e}")
        raise RuntimeError(f"Failed to fetch item details for {item_id}: {e}")


def format_search_results_markdown(
    query: str,
    data: Dict[str, Any],
    pool_filter: str = "uva_library"
) -> str:
    """Format search API JSON response into markdown report."""
    lines = [f"# Virgo Catalog Search Results"]
    lines.append(f"**Query**: `{query}` | **Source/Pool**: `{pool_filter}`\n")

    # If direct pool result (from pool-solr-ws)
    if "group_list" in data or "pagination" in data:
        total = data.get("pagination", {}).get("total", 0)
        groups = data.get("group_list", [])
        lines.append(f"**Total Hits**: {total:,} item(s) found.\n")

        if not groups:
            lines.append("No records matched your search query.")
            return "\n".join(lines)

        lines.append("| # | Title | Author / Publisher | Format | Date | Call Number | Details |")
        lines.append("|---|---|---|---|---|---|---|")

        idx = 1
        for grp in groups:
            records = grp.get("record_list", [])
            if not records:
                continue
            rec_data = extract_record_fields(records[0].get("fields", []))
            title = rec_data["title"] or "Untitled"
            subtitle = f": {rec_data['subtitle']}" if rec_data.get("subtitle") else ""
            full_title = f"{title}{subtitle}".replace("|", "\\|")
            author = (rec_data["author"] or "N/A").replace("|", "\\|")
            fmt = rec_data["format"] or "N/A"
            date = rec_data["published_date"] or "N/A"
            call_no = rec_data["call_number"] or "N/A"
            item_id = rec_data["identifier"] or ""

            item_link = f"[View Record]({VIRGO_ITEM_BASE}/uva_library/items/{item_id})" if item_id else "N/A"
            lines.append(f"| {idx} | **{full_title}** | {author} | {fmt} | {date} | {call_no} | {item_link} |")
            idx += 1

        return "\n".join(lines)

    # Master search service result (from search-ws)
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

        lines.append(f"### Pool: `{pid}` ({ptotal:,} items)")
        if not groups:
            lines.append("_No items in this pool match._\n")
            continue

        lines.append("| # | Title | Author | Format | Year | Link |")
        lines.append("|---|---|---|---|---|---|")

        idx = 1
        for grp in groups:
            records = grp.get("record_list", [])
            if not records:
                continue
            rec_data = extract_record_fields(records[0].get("fields", []))
            title = (rec_data["title"] or "Untitled").replace("|", "\\|")
            author = (rec_data["author"] or "N/A").replace("|", "\\|")
            fmt = rec_data["format"] or "N/A"
            date = rec_data["published_date"] or "N/A"
            item_id = rec_data["identifier"] or ""
            link = f"[View]({VIRGO_ITEM_BASE}/{pid}/items/{item_id})" if item_id else "N/A"

            lines.append(f"| {idx} | **{title}** | {author} | {fmt} | {date} | {link} |")
            idx += 1
        lines.append("")

    return "\n".join(lines)


def format_item_details_markdown(item_id: str, data: Dict[str, Any]) -> str:
    """Format full item detail JSON into markdown."""
    fields_list = data.get("fields", [])
    rec = extract_record_fields(fields_list)

    title = rec["title"] or item_id
    lines = [f"# Item Record: {title}"]
    if rec["subtitle"]:
        lines.append(f"*{rec['subtitle']}*")
    lines.append("")

    if rec["author"]:
        lines.append(f"- **Author(s)**: {rec['author']}")
    if rec["format"]:
        lines.append(f"- **Format**: {rec['format']}")
    if rec["published_date"]:
        lines.append(f"- **Publication Date**: {rec['published_date']}")
    if rec["publisher"]:
        lines.append(f"- **Publisher**: {rec['publisher']}")
    if rec["call_number"]:
        lines.append(f"- **Call Number**: {rec['call_number']}")
    if rec["identifier"]:
        lines.append(f"- **Identifier**: `{rec['identifier']}`")

    lines.append(f"- **Virgo Catalog URL**: {VIRGO_ITEM_BASE}/uva_library/items/{item_id}\n")

    lines.append("## Complete Record Fields\n")
    lines.append("| Field Label | Value |")
    lines.append("|---|---|")

    for f in fields_list:
        lbl = f.get("label", f.get("name", ""))
        val = str(f.get("value", "")).replace("\n", " ").replace("|", "\\|")
        if lbl and val:
            lines.append(f"| **{lbl}** | {val} |")

    related = data.get("related", [])
    if related:
        lines.append("\n## Related Items\n")
        for rel in related:
            rel_rec = extract_record_fields(rel.get("fields", []))
            rtitle = rel_rec["title"] or "Related item"
            rauthor = f" by {rel_rec['author']}" if rel_rec["author"] else ""
            rid = rel_rec["identifier"] or ""
            rlink = f" ([View]({VIRGO_ITEM_BASE}/uva_library/items/{rid}))" if rid else ""
            lines.append(f"- **{rtitle}**{rauthor}{rlink}")

    return "\n".join(lines)
