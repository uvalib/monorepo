"""
routing.py — which tools a question needs (router Phase 0: GitHub only).

The 21 GitHub tools are ~6,000 of the ~13,200 tool-definition tokens sent on every model call, for
a rare kind of question. They're offered when the message (or the thread) looks code-related;
otherwise one small enable_github_tools tool turns them on for the rest of the turn, so a missed
question costs one step, not a wrong answer. See docs/superpowers/specs/2026-11-09-hoohelp-router-design.md.
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from typing import Any, Dict, FrozenSet, List, Optional

logger = logging.getLogger(__name__)

ENABLE_GITHUB_TOOL = "enable_github_tools"

# Router Phase 2: a question gets the prompt blocks and tools of at most 3 domains (see the design).
DOMAINS = ("library", "transit", "catalog", "images", "site", "archives", "wikipedia", "slack", "atlassian",
           "github", "stats")
MAX_DOMAINS = 3


@dataclass(frozen=True)
class Route:
    domains: FrozenSet[str]
    source: str  # "rules" | "model" | "history" | "fallback" | "off"

    @staticmethod
    def all(source: str = "fallback") -> "Route":
        return Route(frozenset(DOMAINS), source)

    @property
    def is_all(self) -> bool:
        return set(DOMAINS) <= set(self.domains)

_CODE = re.compile(
    r"(?i)\b(?:github|git|repos?|repositor(?:y|ies)|code(?:base)?|source code|readme|pull requests?|"
    r"commits?|branch(?:es)?|merged?|deploy(?:ed|ment)?|codebase|function|script|config(?:uration)? file|"
    r"logic|services?|project|python|ruby|golang|javascript|typescript|vue|terraform|dockerfile|ci)\b"
    r"|\bPRs?\b|\bGo services?\b|github\.com|\buvalib/"
    r"|\b[a-z][a-z0-9]*\d*-[a-z0-9-]*(?:client|service|ws|api|site|bot|app|server|ui|lib)\b"
    r"|\b[\w/-]+\.(?:py|js|ts|go|java|rb|ya?ml|tf|sh|vue|md)\b")
# "Logic"/"service"/"project" alone are common in library talk: they count with another code hint,
# or as the subject of "in our …" / "the … project" phrasing.
_WEAK = frozenset({"logic", "service", "services", "project", "merge", "merged", "function", "script",
                   "deploy", "deployed", "deployment", "ci"})
_STRONG_CONTEXT = re.compile(r"(?i)\b(?:our|the|this|that)\s+(?:\w+\s+){0,2}(?:project|services?|logic)\b"
                             r"|\blooking at the \w+ project\b")
_HISTORY_TURNS = 4


def _hits(text: str) -> List[str]:
    return [m.group(0).lower() for m in _CODE.finditer(text or "")]


def wants_github(message: str, history: Optional[List[Dict[str, Any]]] = None) -> bool:
    """Does this message (or the recent thread) look like a question about Library code or repos?"""
    hits = _hits(message)
    strong = [h for h in hits if h not in _WEAK]
    if strong:
        return True
    if hits and _STRONG_CONTEXT.search(message or ""):
        return True
    for msg in (history or [])[-_HISTORY_TURNS:]:
        text = " ".join(b.get("text", "") for b in msg.get("content") or [] if isinstance(b, dict))
        if "github.com/uvalib" in text or any(h not in _WEAK for h in _hits(text)):
            return True
    return False


class GatedGitHubTools:
    """The GitHub tool set behind a gate: when closed, only enable_github_tools is offered; calling
    it opens the gate for the rest of the turn and returns the GitHub guidance."""

    def __init__(self, inner: Any, *, enabled: bool, guidance: str = ""):
        self.inner, self.enabled, self.guidance = inner, enabled, guidance

    def tool_specs(self) -> List[Dict[str, Any]]:
        if self.enabled:
            return list(self.inner.tool_specs())
        return [{"toolSpec": {
            "name": ENABLE_GITHUB_TOOL,
            "description": ("Turn on the uvalib GitHub tools (code, repos, README, issues, pull requests, "
                            "commits) for this question. Call it when the question is about Library code or "
                            "a repo and the GitHub tools aren't listed."),
            "inputSchema": {"json": {"type": "object", "properties": {}}},
        }}]

    def handles(self, name: str) -> bool:
        return name == ENABLE_GITHUB_TOOL or (self.enabled and self.inner.handles(name))

    def call(self, name: str, args: Dict[str, Any]) -> str:
        if name == ENABLE_GITHUB_TOOL:
            self.enabled = True
            names = ", ".join(s["toolSpec"]["name"] for s in self.inner.tool_specs())
            return f"GitHub tools are on for this question: {names}.\n\n{self.guidance}".strip()
        return self.inner.call(name, args)



# ---- Phase 2: keyword rules, tool domains, more_tools ------------------------------------

MORE_TOOLS = "more_tools"

_LIBRARY_NAMES = (r"clemons|shannon|alderman|fine arts|music library|brown (?:library|science)|rmc|robertson|"
                  r"harrison|small special|special collections library|health sciences|law library|darden")
_RULES = {
    "library": re.compile(
        r"(?i)\b(?:hours?|open(?:s|ing)?|closed?|closing|busy|occupancy|crowded|gate counts?|foot traffic|"
        r"(?:study )?rooms?|study spaces?|reserve a room|equipment|events?|directions|accessib\w*|wayfinding|"
        r"" + _LIBRARY_NAMES + r")\b"),
    "transit": re.compile(r"(?i)\b(?:bus(?:es)?|routes?|uts|cat bus|bus stops?|shuttle|"
                          r"(?:gold|silver|orange|green|purple|blue|red|crimson|inner|outer) line)\b"),
    "catalog": re.compile(
        r"(?i)\b(?:books?|title|author|call numbers?|isbn|virgo record|checked out|available to borrow|"
        r"citations?|bibliograph\w*|reading list|(?:does|do) uva have|does the library have)\b"),
    "images": re.compile(r"(?i)\b(?:photos?|pictures?|images?|postcards?|show me)\b"),
    "site": re.compile(
        r"(?i)\b(?:polic(?:y|ies)|fines|overdue|printing|print|cd-?roms?|renew\w*|interlibrary loan|ill|guides?|"
        r"how do i|borrowing rules|docs?|documentation|procedures?|workflows?)\b"),
    "archives": re.compile(
        r"(?i)\b(?:papers|finding aids?|manuscripts?|archives?|archival|correspondence|letters|diar(?:y|ies)|"
        r"scrapbooks?|oral histor(?:y|ies)|(?:\w+ )?records from the (?:1[5-9]|20)\d0s)\b"),
    "wikipedia": re.compile(r"(?i)\b(?:wikipedia|bestsellers?|best-sellers?|award winners?|list of)\b"),
    "slack": re.compile(r"(?i)\b(?:slack|channel|thread|conversation)\b"),
    "atlassian": re.compile(
        r"(?i)\b(?:jira|confluence|tickets?|wiki pages?|docs?|documentation|procedures?|workflows?|"
        r"polic(?:y|ies)|how do i (?:handle|process)|aeon)\b"),
    "stats": re.compile(
        r"(?i)\b(?:visits|visitors|pageviews?|page views?|matomo|analytics|top pages|most (?:accessed|viewed|visited)|"
        r"web(?:site)? traffic|virgo (?:traffic|usage|stats|statistics)|fy\d{2}\b.*\breport|report\b.*\bfy\d{2}|"
        r"virgo annual report|annual report\b.*\bvirgo)"),
}
# Weak catalog phrases ("do we have …"): they don't count when an archives word names the material.
_WEAK_CATALOG = re.compile(r"(?i)\b(?:do we have|does \w+ have)\b")
_CITED_LINE = re.compile(r"\b(?:1[5-9]\d\d|20\d\d)\b")


def _rule_domains(text: str) -> set:
    found = {d for d, rx in _RULES.items() if rx.search(text or "")}
    if wants_github(text or "", []):
        found.add("github")
    if _WEAK_CATALOG.search(text or ""):
        # "Do we have …" is the catalog and/or special collections: give it both unless another
        # domain explains it (Clemons + "does it have" = a book).
        # Holdings can be in the catalog and in special collections: always the catalog, and the
        # archives too when nothing else explains the question.
        found |= {"catalog"} if found else {"catalog", "archives"}
    lines = [ln for ln in (text or "").splitlines() if ln.strip()]
    if sum(1 for ln in lines if _CITED_LINE.search(ln)) >= 3:
        found.add("catalog")  # a pasted citation list
    return found


def route_by_rules(message: str, history: Optional[List[Dict[str, Any]]] = None) -> Optional["Route"]:
    """Domains from keywords; a short follow-up (or "yes" to an offer) inherits the latest earlier user
    question that had any. None when nothing matches, or more than MAX_DOMAINS do."""
    from agent import _accepts_offer, _is_follow_up  # here: agent imports this module's users

    found = _rule_domains(message)
    source = "rules"
    words = re.findall(r"[a-z']+", (message or "").lower())
    if _is_follow_up(message, words) or _accepts_offer(message, history):
        # A follow-up keeps the latest question's domains, plus any of its own ("and for Shannon?"
        # after a pageviews question: stats and library). Only the latest question: an older one is stale.
        latest = next((m for m in reversed(history or []) if m.get("role") == "user"), None)
        text = " ".join(b.get("text", "") for b in (latest or {}).get("content") or [] if isinstance(b, dict))
        inherited = _rule_domains(text)
        if inherited and not found:
            source = "history"
        found = found | inherited
    if not found or len(found) > MAX_DOMAINS:
        return None
    return Route(frozenset(found), source)


_TOOL_DOMAINS = (
    ("Library___", {"library"}), ("Transit___", {"transit"}), ("Catalog___", {"catalog", "images"}),
    ("Site___get_suggestions", {"catalog", "images"}), ("Site___", {"site"}), ("Collections___", {"archives"}),
    ("wikipedia_", {"wikipedia"}), ("GitHub___", {"github"}), ("matomo_", {"stats"}),
)
_NAMED = {
    "search_slack": {"slack"}, "read_slack_thread": {"slack"}, "list_slack_channel": {"slack"},
    "search_confluence": {"atlassian"}, "get_confluence_page": {"atlassian"}, "search_jira": {"atlassian"},
    "get_jira_issue": {"atlassian"}, "check_citations": {"catalog"}, ENABLE_GITHUB_TOOL: {"github"},
}
# Always offered while routed: the ways to widen a route.
ALWAYS_OFFERED = frozenset({MORE_TOOLS, ENABLE_GITHUB_TOOL})


def tool_domain(name: str) -> set:
    """The domains a tool belongs to; an unknown tool belongs to all (it's never filtered out)."""
    if name in _NAMED:
        return set(_NAMED[name])
    for prefix, domains in _TOOL_DOMAINS:
        if name.startswith(prefix):
            return set(domains)
    return set(DOMAINS)


def more_tools_spec() -> Dict[str, Any]:
    return {"toolSpec": {
        "name": MORE_TOOLS,
        "description": ("Add tools for another topic when this question needs them and they aren't listed: "
                        "library (hours, occupancy, spaces, events, directions), transit (buses), catalog "
                        "(books, citations), images (photos), site (library website, policies), archives "
                        "(finding aids), wikipedia, slack, atlassian (Jira, Confluence), github (code), stats "
                        "(website and Virgo statistics)."),
        "inputSchema": {"json": {"type": "object", "properties": {
            "domains": {"type": "array", "items": {"type": "string", "enum": list(DOMAINS)}}},
            "required": ["domains"]}},
    }}


def domain_guidance(domains, v2: bool) -> str:
    """The prompt blocks for these domains (no core), handed over by more_tools."""
    from agent import SYSTEM_PROMPT_TEMPLATE
    from tool_names import render_prompt

    return render_prompt(SYSTEM_PROMPT_TEMPLATE, v2, domains=list(domains), blocks_only=True).strip()


# ---- Phase 2: the model fallback (the chime-in model) -----------------------------------

ROUTER_TIMEOUT_SEC = 3.0
ROUTER_SYSTEM = (
    "You route a question for a UVA Library assistant to the topics it needs. Topics: "
    "library (hours, occupancy, rooms, equipment, events, directions), transit (buses), catalog (books, "
    "media, citations, holdings), images (photos, pictures), site (library website, policies, services), "
    "archives (special collections finding aids), wikipedia (general lists, bestsellers), slack (past "
    "Slack conversations), atlassian (Jira tickets, Confluence pages), github (Library code, repos), "
    "stats (website and Virgo usage statistics). Reply with JSON only: "
    '{"domains": [up to 3 topic names], "confident": true or false}. When unsure, say confident false.')
_JSON = re.compile(r"\{.*\}", re.S)


def valid_domains(domains) -> Optional[List[str]]:
    """1–MAX_DOMAINS known domain names, or None."""
    if not isinstance(domains, list) or not domains or len(domains) > MAX_DOMAINS:
        return None
    if not all(isinstance(d, str) and d in DOMAINS for d in domains):
        return None
    return list(dict.fromkeys(domains))


def parse_json_answer(text: str) -> Optional[Dict[str, Any]]:
    import json

    m = _JSON.search(text or "")
    if not m:
        return None
    try:
        value = json.loads(m.group(0))
    except ValueError:
        return None
    return value if isinstance(value, dict) else None


def route_by_model(message: str, transcript=(), *, client=None, model_id: Optional[str] = None,
                   timeout: float = ROUTER_TIMEOUT_SEC) -> "Route":
    """The small model's route; everything (Route.all, "fallback") on any problem or doubt."""
    import os
    from concurrent.futures import ThreadPoolExecutor

    import chime_in

    model_id = model_id or os.environ.get("ROUTER_MODEL_ID", chime_in.DEFAULT_CHIME_IN_MODEL_ID)
    convo = "\n".join(f"{who}: {line}" for who, line in (transcript or [])[-4:])
    prompt = (f"Recent thread:\n{convo}\n\n" if convo else "") + f"Question: {message}"

    def ask() -> str:
        c = client or chime_in._bedrock_client()
        resp = c.converse(modelId=model_id, system=[{"text": ROUTER_SYSTEM}],
                          messages=[{"role": "user", "content": [{"text": prompt}]}],
                          **{**chime_in._request_settings(model_id), "inferenceConfig": {"maxTokens": 60, "temperature": 0}})
        blocks = resp.get("output", {}).get("message", {}).get("content", []) or []
        return " ".join(b.get("text", "") for b in blocks if isinstance(b, dict))

    pool = ThreadPoolExecutor(max_workers=1)
    try:
        answer = pool.submit(ask).result(timeout=timeout)
    except Exception as e:  # noqa: BLE001 — fail open
        logger.info("router model unavailable (%s); routing everything", type(e).__name__)
        return Route.all("fallback")
    finally:
        pool.shutdown(wait=False)
    data = parse_json_answer(answer)
    domains = valid_domains((data or {}).get("domains"))
    if not data or domains is None or data.get("confident") is not True:
        return Route.all("fallback")
    return Route(frozenset(domains), "model")


def route_question(message: str, history=None, *, transcript=(), hint=None, enabled: bool, v2: bool,
                   model=route_by_model) -> "Route":
    """The route for one question: off → everything; a valid hint from the chime-in call; keyword
    rules (with follow-ups); else the small model (which fails open)."""
    if not enabled or not v2:
        return Route.all("off")
    by_rules = route_by_rules(message, history)
    if by_rules is not None:
        return by_rules
    if hint is not None:
        # The chime-in call already asked the small model: use its domains, or everything.
        hinted = valid_domains(hint)
        return Route(frozenset(hinted), "model") if hinted else Route.all("fallback")
    return model(message, transcript)
