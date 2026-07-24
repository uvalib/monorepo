"""
kb_helper.py — AWS Bedrock Knowledge Base Retrieval Helper

Retrieves relevant document chunks and metadata from AWS Bedrock Knowledge Bases:
- uvalib-web-knowledge-base (N2B734PGWU): UVA Library website pages, policies, and guides.
- virgo-image-suggestions-knowledge-base (J34YBBVTGA): Virgo visual media / digital images.
- virgo-item-suggestions-knowledge-base (UMMEKLDTPR): Virgo item recommendations.
- virgo-suggestions-knowledge-base (ANITQDQQXN): Author suggestions from the catalog.
"""

from __future__ import annotations

import logging
import re
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import quote

import boto3

logger = logging.getLogger(__name__)

KB_MAP = {
    "uvalib_web": {
        "id": "N2B734PGWU",
        "name": "uvalib-web-knowledge-base",
        "description": "UVA Library website pages, policies, collections, and research guides.",
    },
    "virgo_image_suggestions": {
        "id": "J34YBBVTGA",
        "name": "virgo-image-suggestions-knowledge-base",
        "description": "Virgo visual media and image search suggestions.",
    },
    "virgo_item_suggestions": {
        "id": "UMMEKLDTPR",
        "name": "virgo-item-suggestions-knowledge-base",
        "description": "Virgo item recommendations and catalog suggestions.",
    },
    "virgo_suggestions": {
        "id": "ANITQDQQXN",
        "name": "virgo-suggestions-knowledge-base",
        "description": "Author suggestions from the catalog.",
    },
}

# Public IIIF image service + Virgo image item pages
IIIF_IMAGE_TMPL = "https://iiif.lib.virginia.edu/iiif/{ident}/full/!{size},{size}/0/default.jpg"
VIRGO_IMAGE_ITEM_TMPL = "https://search.lib.virginia.edu/sources/images/items/{ident}"
VIRGO_CATALOG_TMPL = "https://search.lib.virginia.edu/catalog/{ident}"

_bedrock_client = None

# KB ids treated as image/visual collections
IMAGE_KB_IDS = {"J34YBBVTGA"}


def get_bedrock_client():
    """Lazy initialize boto3 bedrock-agent-runtime client."""
    global _bedrock_client
    if _bedrock_client is None:
        _bedrock_client = boto3.client("bedrock-agent-runtime", region_name="us-east-1")
    return _bedrock_client


def resolve_kb_id(kb_identifier: str) -> Tuple[str, str]:
    """Resolve a KB ID or alias name to (kb_id, display_name)."""
    norm = kb_identifier.lower().strip()
    if norm in KB_MAP:
        return KB_MAP[norm]["id"], KB_MAP[norm]["name"]

    for k, info in KB_MAP.items():
        if info["id"].lower() == norm or info["id"].upper() == kb_identifier.upper():
            return info["id"], info["name"]
        if norm in info["name"].lower():
            return info["id"], info["name"]

    return kb_identifier, kb_identifier


def query_knowledge_base(
    kb_identifier: str,
    query: str,
    max_results: int = 5,
) -> Dict[str, Any]:
    """Query Bedrock Agent Runtime retrieve API."""
    kb_id, kb_name = resolve_kb_id(kb_identifier)
    client = get_bedrock_client()

    max_results = max(1, min(20, max_results))

    try:
        response = client.retrieve(
            knowledgeBaseId=kb_id,
            retrievalQuery={"text": query},
            retrievalConfiguration={
                "vectorSearchConfiguration": {
                    "numberOfResults": max_results,
                }
            },
        )
        return {
            "kb_id": kb_id,
            "kb_name": kb_name,
            "query": query,
            "results": response.get("retrievalResults", []),
        }
    except Exception as e:
        logger.error("Error querying Bedrock KB %s: %s", kb_id, e)
        raise RuntimeError(
            f"Failed to retrieve from Knowledge Base '{kb_name}' ({kb_id}): {e}"
        )


def _meta_get(metadata: Dict[str, Any], *keys: str, default: str = "") -> str:
    for k in keys:
        if k in metadata and metadata[k] not in (None, ""):
            return str(metadata[k])
    # case-insensitive fallback
    lower = {str(k).lower(): v for k, v in metadata.items()}
    for k in keys:
        if k.lower() in lower and lower[k.lower()] not in (None, ""):
            return str(lower[k.lower()])
    return default


def _normalize_iiif_id(raw_id: str) -> str:
    """Normalize identifiers like uva-lib:2153989 or uva-lib_2153989."""
    if not raw_id:
        return ""
    rid = raw_id.strip()
    # From s3 key: uva-lib_2153989.jpg
    m = re.search(r"(uva-lib|tsm|tsb)[_:](\d+)", rid, re.IGNORECASE)
    if m:
        prefix = m.group(1).lower()
        if prefix == "tsm":
            return f"tsm:{m.group(2)}"
        if prefix == "tsb":
            return f"tsb:{m.group(2)}"
        return f"uva-lib:{m.group(2)}"
    if ":" in rid:
        return rid
    return rid


def _image_urls_for_id(iiif_id: str) -> Tuple[str, str, str]:
    """Return (thumbnail_url, fullish_url, virgo_page_url)."""
    if not iiif_id:
        return "", "", ""
    # IIIF path segment can use unencoded colon
    thumb = IIIF_IMAGE_TMPL.format(ident=iiif_id, size=800)
    large = IIIF_IMAGE_TMPL.format(ident=iiif_id, size=1600)
    page = VIRGO_IMAGE_ITEM_TMPL.format(ident=iiif_id)
    return thumb, large, page


def _extract_image_fields(item: Dict[str, Any]) -> Dict[str, Any]:
    """Pull title / ids / image URLs from a Bedrock retrieval result."""
    metadata = item.get("metadata") or {}
    if not isinstance(metadata, dict):
        metadata = {}

    content = (item.get("content") or {}).get("text", "") or ""
    score = item.get("score")
    location = item.get("location") or {}

    title = _meta_get(metadata, "title", default="")
    collection = _meta_get(metadata, "collection", default="")
    holding = _meta_get(metadata, "location", default="")
    notes = _meta_get(metadata, "notes", default="")
    subject = _meta_get(metadata, "subject", default="")
    mime = _meta_get(metadata, "x-amz-bedrock-kb-source-file-mime-type", default="")
    modality = _meta_get(metadata, "x-amz-bedrock-kb-source-file-modality", default="")

    iiif_id = _normalize_iiif_id(
        _meta_get(metadata, "iiif_id", "id", default="")
    )
    if not iiif_id:
        # Fall back to S3 object key
        s3_uri = ""
        if location.get("type") == "S3":
            s3_uri = (location.get("s3Location") or {}).get("uri", "")
        iiif_id = _normalize_iiif_id(s3_uri)

    thumb, large, virgo_page = _image_urls_for_id(iiif_id)
    is_image = (
        modality.upper() == "IMAGE"
        or mime.startswith("image/")
        or bool(iiif_id and (thumb or virgo_page))
    )

    return {
        "title": title or (content[:80] if content else iiif_id or "Untitled image"),
        "collection": collection,
        "holding_location": holding,
        "notes": notes,
        "subject": subject,
        "iiif_id": iiif_id,
        "image_url": thumb,
        "image_url_large": large,
        "virgo_url": virgo_page or (VIRGO_CATALOG_TMPL.format(ident=iiif_id) if iiif_id else ""),
        "score": score,
        "content": content.strip(),
        "is_image": is_image,
        "source_uri": (
            (location.get("s3Location") or {}).get("uri", "")
            if location.get("type") == "S3"
            else (location.get("webLocation") or {}).get("url", "")
        ),
    }


def _title_relevance_boost(title: str, query: str) -> float:
    """Small boost when query tokens appear in the title (helps drop demolition false-friends)."""
    if not title or not query:
        return 0.0
    t = title.lower()
    tokens = [w for w in re.split(r"\W+", query.lower()) if len(w) > 2]
    if not tokens:
        return 0.0
    hits = sum(1 for w in tokens if w in t)
    return 0.05 * hits


def format_retrieval_markdown(data: Dict[str, Any]) -> str:
    """Format Bedrock KB retrieval results into clean markdown for the agent."""
    kb_name = data.get("kb_name", "Knowledge Base")
    kb_id = data.get("kb_id", "")
    query = data.get("query", "")
    results = data.get("results", []) or []

    is_image_kb = kb_id in IMAGE_KB_IDS or "image" in (kb_name or "").lower()

    lines = ["# Knowledge Base Retrieval Results"]
    lines.append(f"**Knowledge Base**: `{kb_name}` ({kb_id})")
    lines.append(f"**Query**: `{query}`")
    if is_image_kb:
        lines.append(
            "**Result type**: visual / image records. "
            "Prefer these for photo/image requests. "
            "Each hit includes an Image URL suitable for display and a Virgo page link."
        )
    lines.append("")

    if not results:
        lines.append("No matching information found in this Knowledge Base.")
        return "\n".join(lines)

    # Enrich + sort
    enriched = [_extract_image_fields(item) for item in results]
    for e in enriched:
        base = float(e["score"]) if e.get("score") is not None else 0.0
        e["_rank"] = base + _title_relevance_boost(e.get("title", ""), query)
    enriched.sort(key=lambda e: e["_rank"], reverse=True)

    image_hits = [e for e in enriched if e.get("is_image")]
    text_hits = [e for e in enriched if not e.get("is_image")]

    if is_image_kb or image_hits:
        lines.append(f"Found **{len(image_hits or enriched)}** image hit(s):\n")
        for idx, e in enumerate(image_hits or enriched, start=1):
            score = e.get("score")
            score_str = f"{score:.3f}" if isinstance(score, (int, float)) else "n/a"
            lines.append(f"## Image {idx}: {e['title']}")
            lines.append(f"- **Title**: {e['title']}")
            if e.get("iiif_id"):
                lines.append(f"- **Identifier**: `{e['iiif_id']}`")
            if e.get("collection"):
                lines.append(f"- **Collection**: {e['collection']}")
            if e.get("holding_location"):
                lines.append(f"- **Repository**: {e['holding_location']}")
            lines.append(f"- **Relevance score**: {score_str}")
            if e.get("image_url"):
                # Structured markers for the Slack formatter
                lines.append(f"- **Image URL**: {e['image_url']}")
            if e.get("virgo_url"):
                lines.append(f"- **Virgo page**: {e['virgo_url']}")
            if e.get("notes"):
                notes = re.sub(r"\s+", " ", e["notes"]).strip()
                if len(notes) > 400:
                    notes = notes[:400].rstrip() + "…"
                lines.append(f"- **Notes**: {notes}")
            if e.get("subject"):
                subj = re.sub(r"\s+", " ", e["subject"]).strip()
                if len(subj) > 240:
                    subj = subj[:240].rstrip() + "…"
                lines.append(f"- **Subjects**: {subj}")
            if e.get("content"):
                lines.append(f"- **Excerpt**: {e['content'][:500]}")
            lines.append("")

        lines.append(
            "_Assistant instructions: For image requests, present the most relevant "
            "titles (match the user's subject — e.g. rotunda *fire*, not demolition). "
            "Include the Image URL and Virgo page for each. Do NOT invent uva_library "
            "catalog item IDs (u123456); use the Identifier / Virgo page above._"
        )
        return "\n".join(lines)

    # Non-image / text KB formatting
    lines.append(f"Found **{len(text_hits or enriched)}** relevant excerpt(s):\n")
    for idx, e in enumerate(text_hits or enriched, start=1):
        score = e.get("score")
        score_str = f" (relevance: {score:.3f})" if isinstance(score, (int, float)) else ""
        source = e.get("source_uri") or e.get("virgo_url") or ""
        source_str = f" — Source: `{source}`" if source else ""
        lines.append(f"### Excerpt {idx}{score_str}{source_str}")
        if e.get("title") and e["title"] not in (e.get("content") or "")[:80]:
            lines.append(f"**{e['title']}**")
        body = e.get("content") or e.get("notes") or "(no text excerpt)"
        lines.append(f"{body}\n")

    return "\n".join(lines)
