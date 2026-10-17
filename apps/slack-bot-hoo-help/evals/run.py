#!/usr/bin/env python3
"""HooHelp regression evals.

  python evals/run.py --offline [--case ID ...]   # replay recorded traces; exit 1 on any failure
  python evals/run.py --live [--case ID ...]      # real model + gateway; writes a report
"""

from __future__ import annotations

import argparse
import os
import sys

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, APP)

from evals.case import CaseError, load_cases  # noqa: E402

DEFAULT_CASES = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cases")


def _offline(cases: list) -> int:
    from evals.offline import run_offline

    passed = failed = skipped = 0
    for c in cases:
        if isinstance(c, CaseError):
            failed += 1
            print(f"FAIL {c}")
            continue
        r = run_offline(c)
        if r.skipped:
            skipped += 1
            print(f"SKIP {r.id}")
        elif r.passed:
            passed += 1
            print(f"PASS {r.id}")
        else:
            failed += 1
            print(f"FAIL {r.id}: " + "; ".join(r.reasons))
    print(f"\n{passed} passed, {failed} failed, {skipped} skipped")
    return 1 if failed else 0


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="HooHelp regression evals")
    mode = ap.add_mutually_exclusive_group(required=True)
    mode.add_argument("--offline", action="store_true")
    mode.add_argument("--live", action="store_true")
    ap.add_argument("--case", action="append", dest="cases", metavar="ID")
    ap.add_argument("--cases-dir", default=DEFAULT_CASES)
    args = ap.parse_args(argv)

    cases = load_cases(args.cases_dir, args.cases)
    if args.cases:
        found = {c["id"] for c in cases if isinstance(c, dict)}
        missing = [i for i in args.cases if i not in found]
        if missing:
            known = sorted(c["id"] for c in load_cases(args.cases_dir) if isinstance(c, dict))
            print(f"Unknown case id(s): {', '.join(missing)}\nKnown: {', '.join(known)}")
            return 2
    if args.offline:
        return _offline(cases)
    print("live tier not implemented")
    return 2


if __name__ == "__main__":
    sys.exit(main())
