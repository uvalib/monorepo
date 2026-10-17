# HooHelp regression evals — design

**Date:** 2026-10-16
**Status:** Draft for review
**Location:** `apps/slack-bot-hoo-help/evals/` (monorepo)

## Purpose

Catch HooHelp regressions before they reach Slack. The failures this session
found all shipped unnoticed: the Gemma formatter collapsing answers and tables
to one line (~a month in production), occupancy cards replacing the agent's
answer, the bot reading only the first page of gateway tools, and leaked
provider policy text. Every fix since was verified by hand.

Success: a deploy can't ship code that breaks formatting of real answers, and
before each deploy there is a readable report of how the live model + gateway
answer a representative set of real questions.

## Decisions (from brainstorming)

| Decision | Choice |
|---|---|
| Scope | Two tiers: **offline** replay of recorded traces through today's code, and **live** real questions through MiniMax + the gateway |
| Gating | Offline failures block the deploy; live tier writes a report for a human to review (never blocks) |
| Judging | Rule checks only — no LLM judge |
| Structure | Scrubbed JSON case files + a small plain-Python runner (repo convention; no pytest) |

## Layout

```
apps/slack-bot-hoo-help/
├─ evals/
│  ├─ cases/<id>.json     one case per file (~40)
│  ├─ checks.py           check functions: (inputs) → list[str] of failure reasons
│  ├─ offline.py          replay one case through today's formatting code
│  ├─ live.py             run one case's question through the real agent + gateway
│  ├─ run.py              CLI: --offline | --live [--case ID ...]
│  ├─ make_case.py        trace JSON → scrubbed case file
│  ├─ test_checks.py      known-good / known-bad examples for every universal check
│  └─ reports/            live reports (git-ignored)
└─ scripts/deploy.sh      evals --offline → sam build → sam deploy
```

## Case format

```json
{
  "id": "gate-counts-april-by-entrance",
  "category": "occupancy",
  "question": "I need gate counts for Clemons for April 2026, entries and exits separate",
  "history": [],
  "recorded": {
    "model": "minimax.minimax-m2.5",
    "steps": [{"tool_name": "OccupancyReportingRuntime___get_entrance_traffic",
               "status": "success", "input": {}, "output": "..."}],
    "final_text": "Here are the gate counts ..."
  },
  "expect": {
    "phrases": ["73,469", "76,224"],
    "forbid": [],
    "attachment": false,
    "allow_condensed": false
  },
  "live": {
    "tools_any": ["get_entrance_traffic", "get_traffic_by_period"],
    "phrases_any": ["Clemons"],
    "forbid": [],
    "max_seconds": 90
  }
}
```

- `history` uses the agent's `conversation_history` shape (Bedrock Converse
  messages: `{"role": "user"|"assistant", "content": [{"text": str}]}`), so
  thread follow-ups replay.
- `recorded` is optional (live-only cases, e.g. transit, have none);
  `live` is optional (offline-only cases). A case must have at least one.
- `expect` applies offline; `live` applies to the live tier. Tool names in
  `tools_any` are matched against the part after `___`.
- `expect.attachment: true` means the question asks for Excel/CSV and a
  table-producing tool ran, so an `.xlsx` must be built.

## Universal checks (every case, both tiers)

Run on the formatted output (`fallback_text`, `blocks`):

1. Slack limits: ≤ 50 blocks; ≤ 1 `table` block; every `section` text ≤ 3000
   chars; block types only from {header, section, divider, context, image,
   table, actions, card, carousel, data_visualization}.
2. No `**`, no raw markdown table rows (`| :---`, `|---`), no `<thinking`.
3. No leaked provider policy text (`Media Outlets Policy`,
   `non-infringing information`, `Generate a polite, respectful`).
4. No `Unknown tool` and no `Tool Error:` in the posted text.
5. Not collapsed (offline only, skipped when `allow_condensed`): ≥ 60 % of the
   distinctive words of the agent answer (lowercased words ≥ 5 letters, after
   stripping `<thinking>`, minus a small stop list) appear in the visible block
   text.

## Offline tier

`python evals/run.py --offline` — seconds, no network.

For each case with `recorded`:
1. Rebuild tool steps as dicts (the formatting code accepts dicts).
2. `format_for_slack(final_text, use_llm=False, tool_steps=steps)` — the
   production path with the LLM formatter off.
3. If `wants_spreadsheet(question)`: `tables_from_steps(steps)`; when
   `expect.attachment` is true, `build_xlsx` must produce a workbook that
   `openpyxl.load_workbook` opens with one sheet per table.
4. Universal checks + `expect.phrases` (all must appear in fallback text or
   visible block text) + `expect.forbid` (none may appear).

Skipped offline: the link checker (HTTP) and posting to Slack.
Output: one `PASS id` / `FAIL id: reason; reason` line per case, summary
count, exit code 1 if any case failed.

## Live tier

`python evals/run.py --live` — ~10–15 min, needs AWS credentials (`.env`).

For each case with `live`, sequentially:
1. `HooHelpAgent(gateway_client=GatewayMCPClient()).process_message(question,
   conversation_history=history)`.
2. Format exactly as offline.
3. Universal checks (minus "not collapsed") + `live.tools_any` (at least one
   called) + `live.phrases_any` (at least one present, case-insensitive) +
   `live.forbid` + duration ≤ `max_seconds` + `stop_reason == "end_turn"`.
4. Exceptions (timeout, gateway error, Bedrock throttle) → that case FAILs with
   the exception text; the run continues.

Writes `evals/reports/live-YYYYMMDD-HHMMSS.md`: summary table (case, result,
seconds, tools called) then per case the question, failure reasons, and the
full Slack text. Exit code 0 regardless of failures (report-only); prints the
report path. Missing AWS credentials → exit 2 before any case runs.

## Deploy wrapper

`scripts/deploy.sh [--live]`:
1. `python evals/run.py --offline` — stop on failure.
2. With `--live`: run the live tier and print the report path, then pause for
   confirmation (`Continue with deploy? [y/N]`).
3. `sam build && sam deploy` (always builds, so a stale `.aws-sam/build` can't
   ship again).

## Cases

Starting set (~40), drawn from the 245 traces in `logs/session-traces/`,
covering every failure mode fixed this session:

| Category | Examples |
|---|---|
| Gate counts | April by entrance (table), month totals, "Excel format" (attachment), daily breakdown, multi-library week |
| Occupancy | "how full is Clemons now", Shannon vs Clemons comparison, raw-report dump (allow_condensed) |
| Rooms / equipment | Shannon 5–8 pm, RMC cameras, Makerspace printers, Janice |
| Hours / directions | RMC today, Special Collections, Shannon → Brown, garage → Fine Arts |
| Catalog / images | Lost in Place, 1984, Heaven, Rotunda photos, dogs |
| Policy / site | ILL, accessibility remediation, NYT access |
| Threads | "Previous month?", "Separate them by month", "How about the Science Library?" |
| Off-topic | weather, square root, Claude vs Gemini |
| Transit (live-only) | Shannon → Darden, Clemons → JPJ, "how full is the Gold Line" |
| New tools (live-only) | daily counts via `get_traffic_by_period`, Health Sciences hours |

## Scrubbing (`make_case.py`)

`python evals/make_case.py <trace.json> --id <id> [--category C] [--traces-dir logs/session-traces]` writes
`evals/cases/<id>.json` with `question`, `history` (see below), `recorded.model`, `recorded.steps`
(`tool_name`, `status`, `input`, `output` capped at 20,000 chars), and
`recorded.final_text`. It drops Slack user/channel/thread ids, `s3_uri`,
`request_id`, and `system_prompt_hash`. It prints a warning when the question
or answer contains a likely person name (two consecutive capitalized words
not in a library/place allow-list) so a human decides whether to keep the case.
`expect`/`live` are written as empty templates to fill in by hand.

History: traces store only `history_turns`, not the turns. `make_case.py`
rebuilds `history` from earlier traces in the same `--traces-dir` that share the
trace's `slack.thread_ts` and started before it, in time order: each earlier
trace contributes `{"role": "user", "content": [{"text": user_message}]}` then
`{"role": "assistant", "content": [{"text": slack_text}]}`. If `history_turns`
> 0 but no earlier traces are found, it warns so the history can be written by hand.

## Error handling

- Invalid or incomplete case file → that case FAILs with the parse error.
- An exception inside a check → that case FAILs with the exception, run continues.
- Unknown `--case` id → exit 2 with the list of known ids.

## Testing the harness

`evals/test_checks.py` (plain script, prints `ok`): for each universal check,
one passing and one failing input — two table blocks, a 3001-char section,
`**bold**`, a `| :--- |` row, leaked policy text, `Unknown tool`, and a
collapsed answer (long agent answer vs one-sentence blocks). Plus one
end-to-end offline replay of a small synthetic case.

## Maintenance

- New production failure → `make_case.py` on its trace, fill `expect`, commit.
- Intended output change → update affected cases' `expect`. Checks assert facts
  and properties, not exact text, so most edits need no case changes.
- `logs/` stays git-ignored; only scrubbed cases are committed.

## Out of scope

LLM-judged quality; CI integration (GitHub Actions) — the deploy wrapper is the
gate for now; load/performance testing; Slack-side rendering checks.
