"""
routing.py — which tools a question needs (router Phase 0: GitHub only).

The 21 GitHub tools are ~6,000 of the ~13,200 tool-definition tokens sent on every model call, for
a rare kind of question. They're offered when the message (or the thread) looks code-related;
otherwise one small enable_github_tools tool turns them on for the rest of the turn, so a missed
question costs one step, not a wrong answer. See docs/superpowers/specs/2026-11-09-hoohelp-router-design.md.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any, Dict, FrozenSet, List, Optional

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
