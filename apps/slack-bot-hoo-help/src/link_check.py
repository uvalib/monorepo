"""
link_check.py — Verify http(s) links before Hoo Helper posts them.

When a URL in the draft reply is dead (DNS, timeout, 404/410), try to
substitute a working alternative from the same tool outputs / reply, so
patrons do not get expired group-pass hashes or moved pages.
"""

from __future__ import annotations

import logging
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from typing import Dict, Iterable, List, Optional, Sequence, Tuple
from urllib.parse import parse_qs, urlparse

import requests

logger = logging.getLogger(__name__)

# Slack <https://example.com|label> or <https://example.com>
_SLACK_LINK = re.compile(
    r"<(https?://[^|>\s]+)(?:\|([^>]*))?>",
    re.I,
)
# Bare URLs (not already inside <...>)
_BARE_URL = re.compile(
    r"(?<![<|\"'(\[])(https?://[^\s<>\[\]\"']+)",
    re.I,
)

# Prefer these hosts when scoring replacements (library-owned stable pages)
_PREFERRED_HOST_FRAGMENTS = (
    "library.virginia.edu",
    "guides.lib.virginia.edu",
    "search.lib.virginia.edu",
    "cal.lib.virginia.edu",
    "iiif.lib.virginia.edu",
    "proxy1.library.virginia.edu",
    "proxy.its.virginia.edu",
)

# Auth / soft walls still mean "link works for a patron with access"
_OK_STATUS = set(range(200, 400)) | {401, 403}


@dataclass
class LinkCheckResult:
    url: str
    ok: bool
    status_code: Optional[int] = None
    final_url: str = ""
    error: str = ""


def extract_urls(text: str) -> List[str]:
    """Unique http(s) URLs from Slack mrkdwn and bare text, order preserved."""
    if not text:
        return []
    seen: set[str] = set()
    out: List[str] = []

    def _add(raw: str) -> None:
        u = _normalize_url(raw)
        if u and u not in seen:
            seen.add(u)
            out.append(u)

    # Mask Slack links so bare-URL pass does not pick up |label tails
    masked = text
    for m in _SLACK_LINK.finditer(text):
        _add(m.group(1))
        masked = masked.replace(m.group(0), " " * len(m.group(0)), 1)
    for m in _BARE_URL.finditer(masked):
        _add(m.group(1))
    return out


def _normalize_url(url: str) -> str:
    u = (url or "").strip()
    # Slack mrkdwn residue or trailing punctuation
    if "|" in u:
        u = u.split("|", 1)[0]
    u = u.rstrip(").,;]'\"")
    if not u.startswith(("http://", "https://")):
        return ""
    return u


def looks_ephemeral(url: str) -> bool:
    """
    Signed / time-bound access links (common in old news posts) often rot.
    Prefer stable guide/proxy URLs even when these still respond briefly.
    """
    try:
        p = urlparse(url)
        q = parse_qs(p.query)
    except Exception:
        return False
    keys = {k.lower() for k in q}
    if "timestamp" in keys and ("hash" in keys or "sig" in keys or "signature" in keys):
        return True
    if "ip_token" in keys or "expires" in keys:
        return True
    host = (p.netloc or "").lower()
    # Old ITS proxy hostname pattern with embedded grouppass tokens
    if "proxy01.its.virginia.edu" in host and "grouppass" in (p.path or "").lower():
        return True
    if "myaccount-nytimes" in host and "grouppass" in (p.path or "").lower():
        return True
    return False


def check_url(url: str, *, timeout: float = 6.0) -> LinkCheckResult:
    """HEAD then GET; treat 2xx/3xx/401/403 as usable."""
    url = _normalize_url(url)
    if not url:
        return LinkCheckResult(url=url, ok=False, error="empty")

    headers = {
        "User-Agent": "HooHelp-linkcheck/1.0 (+https://library.virginia.edu)",
        "Accept": "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
    }
    session = requests.Session()
    session.max_redirects = 8

    def _try(method: str) -> LinkCheckResult:
        try:
            resp = session.request(
                method,
                url,
                headers=headers,
                timeout=timeout,
                allow_redirects=True,
                stream=True,
            )
            # Drain minimally
            try:
                resp.close()
            except Exception:
                pass
            code = int(resp.status_code)
            ok = code in _OK_STATUS
            # Some servers return 405 on HEAD — caller will retry GET
            return LinkCheckResult(
                url=url,
                ok=ok,
                status_code=code,
                final_url=str(resp.url or url),
                error="" if ok else f"http_{code}",
            )
        except requests.exceptions.Timeout:
            return LinkCheckResult(url=url, ok=False, error="timeout")
        except requests.exceptions.SSLError as e:
            return LinkCheckResult(url=url, ok=False, error=f"ssl:{e}")
        except requests.exceptions.ConnectionError as e:
            return LinkCheckResult(url=url, ok=False, error=f"connection:{e}")
        except Exception as e:
            return LinkCheckResult(url=url, ok=False, error=str(e)[:200])

    head = _try("HEAD")
    if head.ok:
        return head
    if head.status_code in (405, 501, 403) or head.error.startswith("connection"):
        # Many CDNs disallow HEAD; connection blips — try GET
        get = _try("GET")
        if get.ok or head.error.startswith("connection"):
            return get
        # Prefer GET detail if HEAD was 405
        if head.status_code in (405, 501):
            return get
    # HEAD returned 404 etc.
    if head.status_code and head.status_code >= 400:
        # Confirm with GET once (some APIs lie on HEAD)
        get = _try("GET")
        return get
    return head


def check_urls(
    urls: Sequence[str],
    *,
    timeout: float = 6.0,
    max_workers: int = 6,
) -> Dict[str, LinkCheckResult]:
    unique = []
    seen: set[str] = set()
    for u in urls:
        n = _normalize_url(u)
        if n and n not in seen:
            seen.add(n)
            unique.append(n)
    if not unique:
        return {}

    results: Dict[str, LinkCheckResult] = {}
    workers = min(max_workers, len(unique))
    with ThreadPoolExecutor(max_workers=workers) as pool:
        futs = {pool.submit(check_url, u, timeout=timeout): u for u in unique}
        for fut in as_completed(futs):
            u = futs[fut]
            try:
                results[u] = fut.result()
            except Exception as e:
                results[u] = LinkCheckResult(url=u, ok=False, error=str(e)[:200])
    return results


def _host(url: str) -> str:
    try:
        return (urlparse(url).netloc or "").lower()
    except Exception:
        return ""


def _path(url: str) -> str:
    try:
        return (urlparse(url).path or "").lower()
    except Exception:
        return ""


def _tokens(url: str) -> set[str]:
    try:
        p = urlparse(url)
        blob = f"{p.netloc} {p.path} {p.query}".lower()
    except Exception:
        blob = url.lower()
    parts = re.split(r"[^a-z0-9]+", blob)
    return {t for t in parts if len(t) > 2}


def _topic_blob(url: str, tokens: set[str]) -> str:
    return f"{url.lower()} {' '.join(sorted(tokens))}"


def score_alternative(broken: str, candidate: str) -> float:
    """Higher is better. 0 = do not use."""
    if not candidate or candidate == broken:
        return 0.0
    if looks_ephemeral(candidate):
        return 0.05  # almost never prefer

    b_host, c_host = _host(broken), _host(candidate)
    b_tok, c_tok = _tokens(broken), _tokens(candidate)
    b_blob = _topic_blob(broken, b_tok)
    c_blob = _topic_blob(candidate, c_tok)
    score = 0.0

    if c_host and c_host == b_host:
        score += 3.0
    elif b_host and c_host and (
        c_host.endswith(b_host) or b_host.endswith(c_host)
    ):
        score += 1.5

    overlap = len(b_tok & c_tok)
    score += min(overlap, 8) * 0.4

    for frag in _PREFERRED_HOST_FRAGMENTS:
        if frag in c_host:
            score += 0.8
            break

    # Topic helpers for common library access links
    topic_keys = (
        ("nytimes", "newyorktimes", "new york times", "grouppass"),
        ("database", "az", "libguide", "libguides"),
        ("iiif", "virgo", "image"),
        ("libcal", "spaces", "equipment"),
    )
    for keys in topic_keys:
        b_hit = any(k.replace(" ", "") in b_blob.replace(" ", "") or k in b_blob for k in keys)
        c_hit = any(k.replace(" ", "") in c_blob.replace(" ", "") or k in c_blob for k in keys)
        if b_hit and c_hit:
            score += 2.0
            break

    # Same path prefix
    bp, cp = _path(broken), _path(candidate)
    if bp and cp and len(bp) > 5 and (bp.startswith(cp[:24]) or cp.startswith(bp[:24])):
        score += 0.5

    if c_host in ("www.nytimes.com", "nytimes.com") and (
        "nytimes" in b_blob or "newyorktimes" in b_blob
    ):
        score += 0.4  # weak fallback only

    return score


def pick_replacement(
    broken: str,
    healthy: Sequence[str],
    *,
    min_score: float = 2.0,
) -> Optional[str]:
    best: Optional[str] = None
    best_score = 0.0
    for cand in healthy:
        s = score_alternative(broken, cand)
        if s > best_score:
            best_score = s
            best = cand
    if best and best_score >= min_score:
        return best
    return None


def _replace_url_in_text(text: str, old: str, new: Optional[str]) -> str:
    """Replace old URL in Slack links and bare form. Drop link if new is None."""
    if not old or old == new:
        return text

    def slack_sub(m: re.Match) -> str:
        url, label = m.group(1), m.group(2)
        if _normalize_url(url) != old:
            return m.group(0)
        if not new:
            # Keep readable label without dead link
            return label if label else "(link unavailable)"
        if label is not None:
            return f"<{new}|{label}>"
        return f"<{new}>"

    text = _SLACK_LINK.sub(slack_sub, text)

    # Bare URL occurrences
    if old in text:
        text = text.replace(old, new if new else "(link unavailable)")
    return text


def sanitize_response_links(
    text: str,
    *,
    candidate_texts: Optional[Iterable[str]] = None,
    timeout: float = 6.0,
    max_workers: int = 6,
) -> Tuple[str, List[dict]]:
    """
    Check links in ``text``. Replace broken (or strongly ephemeral) URLs with
    healthy alternatives found in ``text`` + ``candidate_texts`` (tool outputs).

    Returns (new_text, list of change records for logging/traces).
    """
    if not text or "http" not in text.lower():
        return text, []

    pool_parts = [text]
    if candidate_texts:
        pool_parts.extend(t for t in candidate_texts if t)
    pool_urls = extract_urls("\n".join(pool_parts))
    reply_urls = extract_urls(text)
    if not reply_urls:
        return text, []

    # Always check reply URLs; also check pool candidates we might swap in
    to_check = list(dict.fromkeys(reply_urls + pool_urls))
    # Cap checks to keep latency reasonable
    if len(to_check) > 16:
        # Prioritize reply URLs, then preferred-host pool URLs
        rest = [u for u in to_check if u not in reply_urls]
        rest.sort(
            key=lambda u: (
                0 if any(f in _host(u) for f in _PREFERRED_HOST_FRAGMENTS) else 1,
                looks_ephemeral(u),
            )
        )
        to_check = list(dict.fromkeys(reply_urls + rest))[:16]

    logger.info("Link-check: verifying %s URL(s)…", len(to_check))
    results = check_urls(to_check, timeout=timeout, max_workers=max_workers)

    healthy: List[str] = []
    for u, r in results.items():
        if r.ok and not looks_ephemeral(u):
            healthy.append(u)
        elif r.ok and looks_ephemeral(u):
            # Usable only as last resort
            pass

    # Ephemeral-but-alive go to a secondary list
    healthy_ephemeral = [
        u for u, r in results.items() if r.ok and looks_ephemeral(u)
    ]

    changes: List[dict] = []
    new_text = text
    for u in reply_urls:
        r = results.get(u) or check_url(u, timeout=timeout)
        need_replace = (not r.ok) or looks_ephemeral(u)
        if not need_replace:
            continue

        replacement = pick_replacement(u, healthy)
        if not replacement and not r.ok:
            # Last resort: another ephemeral that still works (rare)
            replacement = pick_replacement(u, healthy_ephemeral, min_score=2.0)

        if not r.ok and not replacement:
            new_text = _replace_url_in_text(new_text, u, None)
            changes.append(
                {
                    "url": u,
                    "action": "removed",
                    "reason": r.error or f"http_{r.status_code}",
                    "replacement": None,
                }
            )
            logger.warning("Link-check: removed broken URL %s (%s)", u, r.error)
            continue

        if looks_ephemeral(u) and r.ok and not replacement:
            # Ephemeral still works and no better alt — leave it
            continue

        if replacement and replacement != u:
            new_text = _replace_url_in_text(new_text, u, replacement)
            changes.append(
                {
                    "url": u,
                    "action": "replaced",
                    "reason": r.error
                    or ("ephemeral" if looks_ephemeral(u) else f"http_{r.status_code}"),
                    "replacement": replacement,
                }
            )
            logger.info("Link-check: %s → %s (%s)", u, replacement, r.error or "ephemeral")
        elif not r.ok:
            new_text = _replace_url_in_text(new_text, u, None)
            changes.append(
                {
                    "url": u,
                    "action": "removed",
                    "reason": r.error or f"http_{r.status_code}",
                    "replacement": None,
                }
            )

    if changes:
        # If we removed a "direct group-pass" without replacement, nudge once
        removed_access = any(
            c["action"] == "removed"
            and ("grouppass" in c["url"].lower() or "nytimes" in c["url"].lower())
            for c in changes
        )
        has_az = "guides.lib.virginia.edu" in new_text or "A-Z" in new_text
        if removed_access and not has_az:
            new_text = (
                new_text.rstrip()
                + "\n\n_Some direct access links from older posts no longer work. "
                "Try the Library’s A-Z Databases list: "
                "<https://guides.lib.virginia.edu/az.php|A-Z Databases>._"
            )

    return new_text, changes
