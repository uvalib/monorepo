#!/usr/bin/env python3
"""HooHelp regression evals.

  python evals/run.py --offline [--case ID ...]   # replay recorded traces; exit 1 on any failure
  python evals/run.py --live [--case ID ...]      # real model + gateway; writes a report
"""

from __future__ import annotations

import argparse
import os
import re
import sys

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, APP)

from evals.case import CaseError, load_cases  # noqa: E402

DEFAULT_CASES = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cases")
SAMCONFIG = os.path.join(APP, "samconfig.toml")


def production_model_id(samconfig_path: str = SAMCONFIG) -> str | None:
    """BedrockModelId from samconfig's parameter_overrides — the model production runs."""
    try:
        text = open(samconfig_path).read()
    except OSError:
        return None
    m = re.search(r"\bBedrockModelId=([^\s\"']+)", text)
    return m.group(1) if m else None


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
    ap.add_argument("--model", help="live tier: model id (default: production's BedrockModelId from samconfig.toml)")
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
    return _live(cases, args.model)


def _live(cases: list, model: str | None = None) -> int:
    try:
        from dotenv import load_dotenv

        load_dotenv(os.path.join(APP, ".env"))
    except ImportError:
        pass
    from evals import live

    # Test what production runs: .env may point at a different local model.
    model = model or production_model_id()
    if model:
        os.environ["BEDROCK_MODEL_ID"] = model
    if not live.have_aws_credentials():
        print("No AWS credentials found (.env or environment); live tier needs Bedrock + gateway access.")
        return 2
    sys.path.insert(0, os.path.join(APP, "src"))
    from agent import HooHelpAgent
    from gateway_mcp_client import GatewayMCPClient
    from datetime import datetime

    agent = HooHelpAgent(gateway_client=GatewayMCPClient())
    results = []
    for c in cases:
        if isinstance(c, CaseError):
            print(f"FAIL {c}")
            continue
        if not c.get("live"):
            continue
        r = live.run_live(c, agent)
        results.append(r)
        print(f"{'PASS' if r.passed else 'FAIL'} {r.id} ({r.seconds:.0f}s)" + ("" if r.passed else ": " + "; ".join(r.reasons)))
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "reports", f"live-{datetime.now():%Y%m%d-%H%M%S}.md")
    live.write_report(results, path)
    print(f"\n{sum(r.passed for r in results)}/{len(results)} passed — report: {path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
