#!/usr/bin/env python3
"""HooHelp regression evals.

  python evals/run.py --offline [--case ID ...]   # replay recorded traces; exit 1 on any failure
  python evals/run.py --live [--case ID ...]      # real model + gateway; writes a report
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, APP)
sys.path.insert(0, os.path.join(APP, "src"))

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


def production_atlassian_env(samconfig_path: str = SAMCONFIG) -> dict:
    """Production's Confluence/Jira switch and allow-lists, from samconfig's parameter_overrides."""
    try:
        text = open(samconfig_path).read()
    except OSError:
        text = ""

    def value(name: str) -> str:
        m = re.search(rf"\b{name}=([^\s\"']*)", text)
        return m.group(1) if m else ""
    return {"ENABLE_ATLASSIAN": value("EnableAtlassian") or "false",
            "CONFLUENCE_SPACES": value("ConfluenceSpaces"), "JIRA_PROJECTS": value("JiraProjects")}


def _atlassian_tools():
    """Confluence/Jira tools as production builds them (tokens from SSM), or None with a note."""
    try:
        import boto3
        from atlassian_tools import atlassian_tools_for_event

        ssm = boto3.client("ssm", region_name=os.environ.get("AWS_REGION", "us-east-1"))

        def secret(name: str) -> str:
            return ssm.get_parameter(Name=f"/hoohelp/atlassian/{name}", WithDecryption=True)["Parameter"]["Value"]
        tools = atlassian_tools_for_event({"user": ""}, directory=None, env=production_atlassian_env(),
                                          email=secret("email"), jira_token=secret("jira-token"),
                                          confluence_token=secret("confluence-token"))
    except Exception as e:  # live cases still run; Confluence/Jira cases will fail on tools_any
        print(f"Confluence/Jira tools unavailable for live evals: {type(e).__name__}")
        return None
    if tools is None:
        print("Confluence/Jira tools are switched off in samconfig.")
    return tools


def production_github_enabled(samconfig_path: str = SAMCONFIG, env=None) -> bool:
    """Live evals use GitHub when samconfig says EnableGitHub=true, or HOOHELP_EVAL_GITHUB=1 is set."""
    env = os.environ if env is None else env
    if str(env.get("HOOHELP_EVAL_GITHUB", "")).strip().lower() in ("1", "true", "yes"):
        return True
    try:
        text = open(samconfig_path).read()
    except OSError:
        return False
    m = re.search(r"\bEnableGitHub=([^\s\"']*)", text)
    return bool(m) and m.group(1).lower() == "true"


def _github_tools():
    """GitHub tools as production builds them (App credentials from SSM), or None with a note."""
    if not production_github_enabled():
        print("GitHub tools are switched off (samconfig EnableGitHub=false; set HOOHELP_EVAL_GITHUB=1 to try them).")
        return None
    try:
        from github_tools import github_tools_for_env

        tools = github_tools_for_env({"ENABLE_GITHUB": "true"})
    except Exception as e:  # live cases still run; GitHub cases will fail on tools_any
        print(f"GitHub tools unavailable for live evals: {type(e).__name__}")
        return None
    if tools is None:
        print("GitHub tools could not be set up for live evals (check SSM /hoohelp/github/*).")
    return tools


def production_matomo_enabled(samconfig_path: str = SAMCONFIG, env=None) -> bool:
    """Live evals use Matomo when samconfig says EnableMatomo=true, or HOOHELP_EVAL_MATOMO=1 is set."""
    env = os.environ if env is None else env
    if str(env.get("HOOHELP_EVAL_MATOMO", "")).strip().lower() in ("1", "true", "yes"):
        return True
    try:
        text = open(samconfig_path).read()
    except OSError:
        return False
    m = re.search(r"\bEnableMatomo=([^\s\"']*)", text)
    return bool(m) and m.group(1).lower() == "true"


def _matomo_tools(gateway=None):
    """Matomo tools as production builds them (token from SSM), or None with a note."""
    if not production_matomo_enabled():
        print("Matomo tools are switched off (samconfig EnableMatomo=false; set HOOHELP_EVAL_MATOMO=1 to try them).")
        return None
    try:
        from matomo_tools import matomo_tools_for_env

        gateway = gateway or gateway_client()
        tools = matomo_tools_for_env({"ENABLE_MATOMO": "true"}, gateway_call=gateway.call_tool)
    except Exception as e:  # live cases still run; Matomo cases will fail on tools_any
        print(f"Matomo tools unavailable for live evals: {type(e).__name__}")
        return None
    if tools is None:
        print("Matomo tools could not be set up for live evals (check SSM /hoohelp/matomo/*).")
    return tools


def combined_local_tools(*tool_sets):
    """One LocalTools over the tool sets that exist, or None when there are none."""
    from local_tools import LocalTools

    present = [t for t in tool_sets if t is not None]
    return LocalTools(*present) if present else None


def gateway_client():
    """Gateway client for the URL in GATEWAY_URL (set by --gateway-url), else the built-in default."""
    from gateway_mcp_client import DEFAULT_GATEWAY_URL, GatewayMCPClient

    return GatewayMCPClient(gateway_url=os.environ.get("GATEWAY_URL") or DEFAULT_GATEWAY_URL)


def _offline(cases: list, outcomes: dict | None = None) -> int:
    from evals.offline import run_offline

    passed = failed = skipped = 0
    for c in cases:
        if isinstance(c, CaseError):
            failed += 1
            print(f"FAIL {c}")
            continue
        r = run_offline(c)
        if outcomes is not None and not r.skipped:
            outcomes[r.id] = "PASS" if r.passed else "FAIL"
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
    ap.add_argument("--gateway-url", help="live tier: gateway MCP URL to test (sets GATEWAY_URL)")
    ap.add_argument("--json-out", metavar="PATH", help='write {case_id: "PASS"|"FAIL"} for this run')
    args = ap.parse_args(argv)
    if args.gateway_url:
        os.environ["GATEWAY_URL"] = args.gateway_url

    cases = load_cases(args.cases_dir, args.cases)
    if args.cases:
        found = {c["id"] for c in cases if isinstance(c, dict)}
        missing = [i for i in args.cases if i not in found]
        if missing:
            known = sorted(c["id"] for c in load_cases(args.cases_dir) if isinstance(c, dict))
            print(f"Unknown case id(s): {', '.join(missing)}\nKnown: {', '.join(known)}")
            return 2
    outcomes: dict = {}
    rc = _offline(cases, outcomes) if args.offline else _live(cases, args.model, outcomes)
    if args.json_out:
        with open(args.json_out, "w") as fh:
            json.dump(outcomes, fh, indent=2, sort_keys=True)
    return rc


def _live(cases: list, model: str | None = None, outcomes: dict | None = None) -> int:
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
    from datetime import datetime

    gateway = gateway_client()
    agent = HooHelpAgent(gateway_client=gateway)
    local_tools = combined_local_tools(_atlassian_tools(), _github_tools(), _matomo_tools(gateway))
    results = []
    for c in cases:
        if isinstance(c, CaseError):
            print(f"FAIL {c}")
            continue
        if not c.get("live"):
            continue
        r = live.run_live(c, agent, local_tools=local_tools)
        results.append(r)
        if outcomes is not None:
            outcomes[r.id] = "PASS" if r.passed else "FAIL"
        print(f"{'PASS' if r.passed else 'FAIL'} {r.id} ({r.seconds:.0f}s)" + ("" if r.passed else ": " + "; ".join(r.reasons)))
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "reports", f"live-{datetime.now():%Y%m%d-%H%M%S}.md")
    live.write_report(results, path)
    print(f"\n{sum(r.passed for r in results)}/{len(results)} passed — report: {path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
