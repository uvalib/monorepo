"""Load and validate eval case files; the shared per-case result type."""

from __future__ import annotations

import glob
import json
import os
from dataclasses import dataclass, field
from typing import Optional


class CaseError(ValueError):
    """A case file that can't be used; `path` names the file."""

    def __init__(self, path: str, message: str):
        super().__init__(f"{os.path.basename(path)}: {message}")
        self.path = path


@dataclass
class CaseResult:
    id: str
    passed: bool
    reasons: list[str]
    seconds: float = 0.0
    tools: list[str] = field(default_factory=list)
    slack_text: str = ""
    skipped: bool = False


def load_case(path: str) -> dict:
    try:
        with open(path) as fh:
            data = json.load(fh)
    except (OSError, json.JSONDecodeError) as e:
        raise CaseError(path, f"unreadable: {e}") from e
    if not isinstance(data, dict):
        raise CaseError(path, "top level must be an object")
    for key in ("id", "question"):
        if not isinstance(data.get(key), str) or not data[key].strip():
            raise CaseError(path, f"missing '{key}'")
    rec, live = data.get("recorded"), data.get("live")
    if not rec and not live:
        raise CaseError(path, "needs 'recorded' and/or 'live'")
    if rec is not None and (not isinstance(rec.get("steps"), list) or not isinstance(rec.get("final_text"), str)):
        raise CaseError(path, "'recorded' needs 'steps' (list) and 'final_text' (str)")
    data.setdefault("history", [])
    data["expect"] = data.get("expect") or {}
    return data


def load_cases(cases_dir: str, ids: Optional[list[str]] = None) -> list:
    """Cases (dicts) and CaseErrors, in file order; filtered to `ids` when given."""
    out: list = []
    for path in sorted(glob.glob(os.path.join(cases_dir, "*.json"))):
        try:
            c = load_case(path)
        except CaseError as e:
            if ids is None:
                out.append(e)
            continue
        if ids is None or c["id"] in ids:
            out.append(c)
    return out
