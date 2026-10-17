#!/usr/bin/env python3
"""Turn a HooHelp session trace into a scrubbed eval case.

  python evals/make_case.py logs/session-traces/2026/09/30/<id>.json --id gate-april \\
      [--category occupancy] [--traces-dir logs/session-traces] [--out-dir evals/cases]

Keeps the question, rebuilt thread history, tool steps (outputs capped) and the
model's answer; drops Slack ids, S3 paths and request metadata. Writes empty
`expect`/`live` templates to fill in by hand, and warns about likely person
names so a human decides whether the case can be committed.
"""

from __future__ import annotations

import argparse
import glob
import json
import os
import re
import sys

MAX_OUTPUT_CHARS = 20000
DEFAULT_OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cases")

# Capitalized words that are library/place/route/publication names, not people.
_NOT_NAMES = frozenset("""
Shannon Clemons Fine Arts Music Library Libraries Brown Science Engineering Harrison Small Special
Collections Robertson Media Center Scholars Lab Makerspace Virgo Gold Silver Purple Green Orange Line
Loop New York Times Rotunda Darden Law School Medical Charlottesville Downtown Mall Grounds Central
Parking Garage University Virginia UVA Atlantic Monthly Edgar Alderman Clark Hall Health Sciences
The Library's Hoo Helper HooHelp Excel Slack Wikipedia Google Maps Ask Librarian Digital Humanities
January February March April May June July August September October November December
Monday Tuesday Wednesday Thursday Friday Saturday Sunday
""".split())
_CAP_RUN = re.compile(r"\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b")


def likely_names(text: str) -> list[str]:
    """Runs of 2+ capitalized words none of which is a known place/library word."""
    found = []
    for m in _CAP_RUN.finditer(text or ""):
        words = m.group(0).split()
        if not any(w in _NOT_NAMES for w in words) and m.group(0) not in found:
            found.append(m.group(0))
    return found


def _thread_ts(trace: dict) -> str:
    return str((trace.get("slack") or {}).get("thread_ts") or "")


def build_history(trace: dict, traces: list[dict]) -> tuple[list[dict], list[str]]:
    """Earlier turns of the same Slack thread, in the agent's history format."""
    thread = _thread_ts(trace)
    earlier = sorted(
        (t for t in traces
         if thread and t is not trace and _thread_ts(t) == thread
         and str(t.get("started_at")) < str(trace.get("started_at"))),
        key=lambda t: str(t.get("started_at")),
    )
    history: list[dict] = []
    for t in earlier:
        history.append({"role": "user", "content": [{"text": t.get("user_message") or ""}]})
        history.append({"role": "assistant", "content": [{"text": t.get("slack_text") or t.get("final_text") or ""}]})
    warnings = []
    if not history and (trace.get("history_turns") or 0) > 0:
        warnings.append(
            f"trace had {trace['history_turns']} history turns but no earlier traces in its thread were found; "
            "write 'history' by hand"
        )
    return history, warnings


def scrub(trace: dict, history: list[dict], case_id: str, category: str) -> dict:
    steps = [
        {
            "tool_name": s.get("tool_name"),
            "status": s.get("status"),
            "input": s.get("input") or {},
            "output": str(s.get("output") or "")[:MAX_OUTPUT_CHARS],
        }
        for s in trace.get("steps") or []
    ]
    return {
        "id": case_id,
        "category": category,
        "question": trace.get("user_message") or "",
        "history": history,
        "recorded": {
            "model": trace.get("model_id") or "",
            "steps": steps,
            "final_text": trace.get("final_text") or "",
        },
        "expect": {"phrases": [], "forbid": [], "attachment": False, "allow_condensed": False},
        "live": None,
    }


def _load_traces(traces_dir: str) -> list[dict]:
    out = []
    for path in glob.glob(os.path.join(traces_dir, "**", "*.json"), recursive=True):
        try:
            with open(path) as fh:
                out.append(json.load(fh))
        except (OSError, json.JSONDecodeError):
            continue
    return out


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Make a scrubbed eval case from a session trace")
    ap.add_argument("trace")
    ap.add_argument("--id", required=True)
    ap.add_argument("--category", default="general")
    ap.add_argument("--traces-dir", default=None, help="where to look for earlier turns of the thread")
    ap.add_argument("--out-dir", default=DEFAULT_OUT)
    args = ap.parse_args(argv)

    with open(args.trace) as fh:
        trace = json.load(fh)
    out_path = os.path.join(args.out_dir, f"{args.id}.json")
    if os.path.exists(out_path):
        print(f"refusing to overwrite {out_path}", file=sys.stderr)
        return 1
    traces = _load_traces(args.traces_dir) if args.traces_dir else []
    history, warnings = build_history(trace, traces)
    case = scrub(trace, history, args.id, args.category)
    names = likely_names(f"{case['question']}\n{case['recorded']['final_text']}")
    if names:
        warnings.append(f"possible person names (keep only if public): {', '.join(names)}")
    os.makedirs(args.out_dir, exist_ok=True)
    with open(out_path, "w") as fh:
        json.dump(case, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    for w in warnings:
        print(f"warning: {w}", file=sys.stderr)
    print(out_path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
