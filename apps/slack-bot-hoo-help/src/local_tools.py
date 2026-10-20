"""
local_tools.py — hand several per-turn tool sets (Slack search, Confluence/Jira)
to the agent as one object with tool_specs / handles / call.
"""

from __future__ import annotations

from typing import Any, Dict, List


class LocalTools:
    def __init__(self, *tool_sets: Any):
        self.sets = [t for t in tool_sets if t is not None]

    def tool_specs(self) -> List[Dict[str, Any]]:
        specs: List[Dict[str, Any]] = []
        for t in self.sets:
            specs.extend(t.tool_specs())
        return specs

    def handles(self, name: str) -> bool:
        return any(t.handles(name) for t in self.sets)

    def call(self, name: str, args: Dict[str, Any]) -> str:
        for t in self.sets:
            if t.handles(name):
                return t.call(name, args)
        return f"Unknown tool: {name}"
