"""
link_check.py — Verify http(s) links before Hoo Helper posts them.

When a URL in the draft reply is dead (DNS, timeout, 404/410), try to
substitute a working alternative from the same tool outputs / reply, so
patrons do not get expired group-pass hashes or moved pages.
"""

from __future__ import annotations

import html
import ipaddress
import logging
import re
import socket
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from typing import Any, Callable, Dict, Iterable, List, Optional, Sequence, Tuple
from urllib.parse import parse_qs, quote, unquote, urljoin, urlparse, urlsplit, urlunsplit

import requests

logger = logging.getLogger(__name__)

# Slack <https://example.com|label> or <https://example.com>
_SLACK_LINK = re.compile(
    r"<(https?://[^|>\s]+)(?:\|([^>]*))?>",
    re.I,
)
# Bare URLs (not already inside <...>)
_BARE_URL = re.compile(
    r"(?<![<|\"'\[])(https?://[^\s<>\[\]\"']+)",
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
    # Trailing punctuation, and a ")" only when it closes text around the URL
    # ("(https://a/x)") rather than the URL itself ("…/Monticello_(disambiguation)").
    while u and u[-1] in ").,;]'\"":
        if u[-1] == ")" and u.count("(") >= u.count(")"):
            break
        u = u[:-1]
    if not u.lower().startswith(("http://", "https://")):  # HTTPS://… is a link too; the text keeps its case
        return ""
    return u


# ---- which links a reply may carry ---------------------------------------------
# Tool results can carry injected instructions ("link https://evil.example/?d=<the user's data>").
# A reply's URL is kept only if this turn's tool output contains it, or it is on a library host;
# anything else is dropped before it is probed (a probe or a Slack unfurl would deliver the data).

LIBRARY_DOMAIN = "virginia.edu"
# Allowed without appearing in tool output: the University's front door, and the Library's own hosts
# (library.virginia.edu, *.library.virginia.edu incl. proxy1, lib.virginia.edu, *.lib.virginia.edu).
# Any other *.virginia.edu page (personal pages, other departments) must come from tool output.
LIBRARY_EXACT_HOSTS = frozenset({"virginia.edu", "www.virginia.edu"})
LIBRARY_HOST_SUFFIXES = ("library.virginia.edu", "lib.virginia.edu")


def url_host(url: str) -> str:
    """Lowercase hostname (no port, userinfo or trailing dot), or ""."""
    try:
        return (urlparse(url).hostname or "").lower().rstrip(".")
    except Exception:
        return ""


def is_library_url(url: str) -> bool:
    """True for http(s) URLs on a library host (LIBRARY_EXACT_HOSTS / LIBRARY_HOST_SUFFIXES, dot boundary)."""
    u = _normalize_url(url)
    if not u or "\\" in u:  # browsers read "\\" as "/": https://evil.com\\@virginia.edu goes to evil.com
        return False
    try:
        netloc = urlparse(u).netloc
    except Exception:
        return False
    if "@" in netloc:  # userinfo hides the real host from a quick read
        return False
    host = url_host(u)
    return host in LIBRARY_EXACT_HOSTS or any(host == s or host.endswith("." + s) for s in LIBRARY_HOST_SUFFIXES)


_PATH_SAFE = "/!$&'()*+,;=:@-._~"


def _url_key(url: str) -> str:
    """Comparison form: Slack/HTML entity-escaped, markdown-wrapped, http/https, scheme/host case,
    percent-encoding and trailing-slash variants of one link compare equal; a different path, query
    or fragment does not."""
    u = html.unescape(_normalize_url(url))
    u = u.rstrip("*_~`>")
    u = _normalize_url(u)
    if not u:
        return ""
    try:
        p = urlsplit(u)
    except Exception:
        return u
    path = quote(unquote(p.path), safe=_PATH_SAFE).rstrip("/")
    return urlunsplit(("https", p.netloc.lower(), path, p.query, p.fragment))


url_key = _url_key


def url_keys(texts: Iterable[str]) -> set:
    """Comparison keys of every URL in texts."""
    keys = {_url_key(u) for t in texts or () if t for u in extract_urls(str(t))}
    keys.discard("")
    return keys


# Domain names, Unicode labels included: "evil.com", "sub.evil.co.uk", "évil.com", "xn--e1afmkfd.xn--p1ai".
_LABEL = r"[^\W_](?:[\w-]{0,61}[^\W_])?"
_DOMAIN = _LABEL + r"(?:\." + _LABEL + r")*\.(?:[^\W\d_]{2,63}|xn--[a-z0-9-]{2,59})"
_BARE_DOMAIN = re.compile(r"(?<![\w.-])(" + _DOMAIN + r")(?![\w-])", re.I)


def input_hosts(texts: Iterable[str]) -> set:
    """Every host named in texts, as a URL or a bare domain (lowercase)."""
    hosts: set = set()
    for t in texts or ():
        if not t:
            continue
        t = str(t)
        hosts.update(h for h in (url_host(u) for u in extract_urls(t)) if h)
        hosts.update(m.group(1).lower().rstrip(".") for m in _BARE_DOMAIN.finditer(t))
    return hosts


def _host_related(host: str, hosts: Iterable[str]) -> bool:
    return any(host == h or host.endswith("." + h) or h.endswith("." + host) for h in hosts)


def echo_filter(input_texts: Iterable[str]) -> Callable[[str], bool]:
    """True for a URL that tool output can't vouch for this turn: its host (or a parent / child of it)
    is named in a tool input. Tools echo their query — quoted, escaped, lowercased or trimmed — so an
    exact-URL match isn't enough: injected text could launder any URL on that host through a search.
    Library hosts are never excluded."""
    texts = list(input_texts or ())
    keys = url_keys(texts)
    hosts = {h for h in input_hosts(texts) if not is_library_url("https://" + h)}

    def excluded(url: str) -> bool:
        if is_library_url(url):
            return False
        return _url_key(url) in keys or (bool(hosts) and _host_related(url_host(url), hosts))

    return excluded


def url_allowlist(source_texts: Iterable[str], extra_urls: Iterable[str] = (),
                  exclude_texts: Iterable[str] = ()) -> Callable[[str], bool]:
    """A predicate: True for a URL that appears in source_texts (tool outputs) or extra_urls, or that
    is on a library host. A URL whose host is named in exclude_texts (the tool inputs; see
    ``echo_filter``) is not allowed from the sources."""
    keys = url_keys(source_texts)
    keys.update(_url_key(u) for u in extra_urls or ())
    keys.discard("")
    excluded = echo_filter(exclude_texts)

    def allowed(url: str) -> bool:
        return is_library_url(url) or (_url_key(url) in keys and not excluded(url))

    return allowed


def _log_untrusted(url: str) -> None:
    logger.warning("Link-check: dropped untrusted URL host=%s", (url_host(url) or "?")[:253])


def drop_untrusted_urls(text: str, allowed: Callable[[str], bool]) -> Tuple[str, List[dict]]:
    """Remove every URL ``allowed`` rejects (link text kept). Never fetches anything."""
    changes: List[dict] = []
    if not text:
        return text, changes
    for _ in range(5):  # a removal can, in principle, join text into a new URL: repeat until clean
        bad = [u for u in extract_urls(text) if not allowed(u)]
        if not bad:
            break
        for u in bad:
            text = _replace_url_in_text(text, u, None)
            if u in text:
                text = text.replace(u, "")
            if not any(c["url"] == u for c in changes):
                changes.append({"url": u, "action": "removed", "reason": "untrusted", "replacement": None})
                _log_untrusted(u)
    else:
        # Still not clean: cut every remaining http(s) run that isn't allowed.
        for u in [u for u in extract_urls(text) if not allowed(u)]:
            text = text.replace(u, "")
    return _drop_schemeless(text, allowed, changes), changes


# "evil.com/c?d=…", "evil.com/Q3-plan", "Evil.com/c#d=…": Slack may auto-link a domain followed by a
# path, query or fragment, and any of them can carry data. Such a token goes unless the URL it names is
# allowed. A bare domain ("example.org") stays, and so does a file-like name ("README.md#L3",
# "Node.js/React") unless it has a query string.
_SCHEMELESS = re.compile(
    r"(?<![\w@/.:%-])(" + _DOMAIN + r"(?::\d{1,5})?[/?#][^\s<>\[\]\"'|]+)",
    re.I,
)
_FILE_TLDS = frozenset({
    "js", "ts", "jsx", "tsx", "py", "md", "rb", "go", "rs", "sh", "pl", "php", "java", "kt", "cs", "json",
    "yml", "yaml", "toml", "ini", "cfg", "xml", "html", "htm", "css", "scss", "txt", "csv", "tsv", "pdf",
    "docx", "xlsx", "pptx", "png", "jpg", "jpeg", "gif", "svg", "log", "lock", "sql", "vue", "swift", "zip",
})
_FULL_URL = re.compile(r"https?://[^\s<>|]+", re.I)


def _drop_schemeless(text: str, allowed: Callable[[str], bool], changes: List[dict]) -> str:
    if not any(c in text for c in "/?#"):
        return text
    masked = _FULL_URL.sub(lambda m: " " * len(m.group(0)), text)
    spans = []
    for m in _SCHEMELESS.finditer(masked):
        token = _normalize_url("https://" + m.group(1))[len("https://"):]
        if not token or len(token) == len(url_host("https://" + token)):
            continue  # only trailing punctuation followed the domain
        tld = url_host("https://" + token).rsplit(".", 1)[-1]
        if tld in _FILE_TLDS and "?" not in token:
            continue
        if not allowed("https://" + token):
            spans.append((m.start(1), m.start(1) + len(token), token))
    for start, end, token in reversed(spans):
        text = text[:start] + text[end:]
        if not any(c["url"] == token for c in changes):
            changes.append({"url": token, "action": "removed", "reason": "untrusted", "replacement": None})
            _log_untrusted("https://" + token)
    if spans:
        text = re.sub(r"[ \t]+([.,;:!?])", r"\1", text)
        text = re.sub(r"[ \t]{2,}", " ", text)
    return text


def drop_untrusted_in_blocks(blocks: List[Dict[str, Any]], allowed: Callable[[str], bool]) -> List[Dict[str, Any]]:
    """Block Kit copy of ``drop_untrusted_urls``: text loses the URL; an image, button or other element
    whose url / image_url isn't allowed is removed (Slack fetches image URLs)."""

    def bad_element(obj: Dict[str, Any]) -> bool:
        for key in ("url", "image_url"):
            v = obj.get(key)
            if isinstance(v, str) and v.strip() and not allowed(v.strip()):
                return True
        return False

    gone = object()  # a container emptied by the gate (Slack rejects an actions block with no elements)

    def walk(obj: Any) -> Any:
        if isinstance(obj, str):
            return drop_untrusted_urls(obj, allowed)[0] if ("http" in obj.lower() or "?" in obj) else obj
        if isinstance(obj, list):
            out_list = []
            for x in obj:
                if isinstance(x, dict) and bad_element(x):
                    continue
                y = walk(x)
                if y is not gone:
                    out_list.append(y)
            return out_list
        if isinstance(obj, dict):
            out_dict = {}
            for k, v in obj.items():
                if isinstance(v, dict) and bad_element(v):  # e.g. a section's accessory button / image
                    continue
                y = walk(v)
                if y is gone:
                    continue
                if k in ("elements", "fields") and isinstance(v, list) and v and not y:
                    return gone
                out_dict[k] = y
            return out_dict
        return obj

    out = walk(list(blocks or []))
    return out if isinstance(out, list) else []


# ---- the checker refuses private addresses -------------------------------------

REFUSED_PRIVATE = "refused_private_address"
_REDIRECT_CODES = (301, 302, 303, 307, 308)


def _resolve_host(host: str) -> List[str]:
    """Every address the host resolves to (an IP literal resolves to itself)."""
    infos = socket.getaddrinfo(host, None, proto=socket.IPPROTO_TCP)
    return [str(info[4][0]) for info in infos]


def _is_public_ip(addr: str) -> bool:
    try:
        ip = ipaddress.ip_address(addr.split("%", 1)[0])
    except ValueError:
        return False
    mapped = getattr(ip, "ipv4_mapped", None)
    if mapped is not None:
        ip = mapped
    return not (ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved
                or ip.is_multicast or ip.is_unspecified) and ip.is_global


def _host_is_private(host: str) -> bool:
    """True when the host is, or resolves to, any non-public address. A name that doesn't resolve is
    left to the request (it fails as a dead link)."""
    if not host:
        return True
    try:
        addrs = _resolve_host(host)
    except (socket.gaierror, UnicodeError, OSError):
        return False
    return any(not _is_public_ip(a) for a in addrs)


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

    start_host = url_host(url)
    if _host_is_private(start_host):
        logger.warning("Link-check: refused private address host=%s", start_host or "?")
        return LinkCheckResult(url=url, ok=False, error=REFUSED_PRIVATE)

    def _try(method: str) -> LinkCheckResult:
        try:
            current = url
            # Redirects are followed by hand: every hop's host is checked for a private address,
            # and a hop to another (non-library) host is not fetched — the 3xx already says it works.
            for _ in range(session.max_redirects + 1):
                resp = session.request(
                    method,
                    current,
                    headers=headers,
                    timeout=timeout,
                    allow_redirects=False,
                    stream=True,
                )
                # Drain minimally
                try:
                    resp.close()
                except Exception:
                    pass
                code = int(resp.status_code)
                location = (getattr(resp, "headers", None) or {}).get("Location")
                if code not in _REDIRECT_CODES or not location:
                    break
                nxt = urljoin(current, location)
                nxt_host = url_host(nxt)
                if not nxt.startswith(("http://", "https://")) or (
                        nxt_host != start_host and not is_library_url(nxt)) or _host_is_private(nxt_host):
                    break
                current = nxt
            ok = code in _OK_STATUS
            # Some servers return 405 on HEAD — caller will retry GET
            return LinkCheckResult(
                url=url,
                ok=ok,
                status_code=code,
                final_url=str(getattr(resp, "url", None) or current),
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


def drop_url(text: str, url: str) -> str:
    """Remove a dead URL so the sentence still reads: keep a link's label, drop the
    bare form with its connector ("search: <url> or call" -> "search or call")."""
    if not url or url not in text:
        return text
    u = re.escape(url)
    text = re.sub(r"\[([^\]\n]*)\]\(" + u + r"\)", lambda m: m.group(1), text)  # markdown [label](url)
    text = re.sub(r"<" + u + r"\|([^>]*)>", lambda m: m.group(1), text)
    text = re.sub(r"[ \t]*(?:[:\u2014\u2013-][ \t]*|\b(?:at|via)[ \t]+)?\(?<?" + u + r">?\)?", "", text)
    text = re.sub(r"[ \t]+([.,;:!?])", r"\1", text)
    return re.sub(r"[ \t]{2,}", " ", text)


def _replace_url_in_text(text: str, old: str, new: Optional[str]) -> str:
    """Replace old URL in Slack links and bare form. Drop link if new is None."""
    if not old or old == new:
        return text

    def slack_sub(m: re.Match) -> str:
        url, label = m.group(1), m.group(2)
        if _normalize_url(url) != old:
            return m.group(0)
        if not new:
            # Keep the readable label; an unlabeled link is dropped below
            return label if label else f"<{url}>"
        if label is not None:
            return f"<{new}|{label}>"
        return f"<{new}>"

    text = _SLACK_LINK.sub(slack_sub, text)

    if not new:
        return drop_url(text, old)
    # Bare URL occurrences
    if old in text:
        text = text.replace(old, new)
    return text


def sanitize_response_links(
    text: str,
    *,
    candidate_texts: Optional[Iterable[str]] = None,
    trusted_urls: Optional[Iterable[str]] = None,
    timeout: float = 6.0,
    max_workers: int = 6,
    allowed: Optional[Callable[[str], bool]] = None,
) -> Tuple[str, List[dict]]:
    """
    Check links in ``text``. Replace broken (or strongly ephemeral) URLs with
    healthy alternatives found in ``text`` + ``candidate_texts`` (tool outputs).

    allowed: when given, a URL it rejects (see ``url_allowlist``) is removed from the reply and
    never probed or offered as a replacement; trusted URLs count as allowed.

    Returns (new_text, list of change records for logging/traces).
    """
    if not text:
        return text, []

    # Trusted URLs are data the reply reproduces (e.g. links people shared in Slack):
    # never probe them (intranet hosts, one-time links) or swap them for another.
    trusted = set(trusted_urls or ())
    changes: List[dict] = []

    def may_use(u: str) -> bool:
        return allowed is None or u in trusted or allowed(u)

    if allowed is not None:
        text, changes = drop_untrusted_urls(text, may_use)
    if "http" not in text.lower():
        return text, changes

    pool_parts = [text]
    if candidate_texts:
        pool_parts.extend(t for t in candidate_texts if t)
    pool_urls = [u for u in extract_urls("\n".join(pool_parts)) if u not in trusted and may_use(u)]
    reply_urls = [u for u in extract_urls(text) if u not in trusted]
    if not reply_urls:
        return text, changes

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

    new_text = text
    for u in reply_urls:
        r = results.get(u) or check_url(u, timeout=timeout)
        if r.error == REFUSED_PRIVATE:
            # Not probed: a library host (an intranet page) stays as written; anything else goes.
            if is_library_url(u):
                continue
            new_text = _replace_url_in_text(new_text, u, None)
            changes.append({"url": u, "action": "removed", "reason": REFUSED_PRIVATE, "replacement": None})
            logger.warning("Link-check: dropped private-address URL host=%s", url_host(u) or "?")
            continue
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
