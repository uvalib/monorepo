#!/usr/bin/env python3
"""Compare eval runs: compare.py old1.json new1.json [old2.json new2.json ...]

Each file is the --json-out of a run: {case_id: "PASS"|"FAIL"}. Pairs are (old, new).
Exit 1 when a case passed in every old run and failed in any new run (REGRESSION),
or when a case appears on only one side (missing). A case that failed in some old run
and fails in a new run is "flaky" (old mixed) or "failing both" (old all failed): reported, not fatal.
"""

from __future__ import annotations

import json
import sys


def _load(path: str) -> dict:
    with open(path) as fh:
        return json.load(fh)


def classify(old: list[str], new: list[str]) -> str:
    if not old or not new:
        return "missing"
    new_fail = "FAIL" in new
    if all(r == "PASS" for r in old):
        return "REGRESSION" if new_fail else "ok"
    if not new_fail:
        return "ok"
    return "failing both" if all(r == "FAIL" for r in old) else "flaky"


def main(argv: list[str] | None = None) -> int:
    argv = sys.argv[1:] if argv is None else argv
    if not argv or len(argv) % 2:
        print(__doc__)
        return 2
    olds, news = [], []
    for i in range(0, len(argv), 2):
        olds.append(_load(argv[i]))
        news.append(_load(argv[i + 1]))
    ids = sorted({k for run in olds + news for k in run})
    rows = []
    bad = False
    for cid in ids:
        old = [r[cid] for r in olds if cid in r]
        new = [r[cid] for r in news if cid in r]
        status = classify(old, new)
        bad = bad or status in ("REGRESSION", "missing")
        rows.append((cid, " ".join(old) or "-", " ".join(new) or "-", status))
    w = max([len(r[0]) for r in rows] + [4])
    wo = max([len(r[1]) for r in rows] + [3])
    wn = max([len(r[2]) for r in rows] + [3])
    print(f"{'case':<{w}}  {'old':<{wo}}  {'new':<{wn}}  status")
    for cid, o, n, s in rows:
        print(f"{cid:<{w}}  {o:<{wo}}  {n:<{wn}}  {s}")
    counts = {}
    for r in rows:
        counts[r[3]] = counts.get(r[3], 0) + 1
    print("\n" + ", ".join(f"{k}: {v}" for k, v in sorted(counts.items())))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
