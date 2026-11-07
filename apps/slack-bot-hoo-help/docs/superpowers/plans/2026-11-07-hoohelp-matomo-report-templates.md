# Matomo Report Templates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Matomo answers come back in a fixed layout per report type (Slack tables and up to two charts built by code), including a new Virgo annual-report tool.

**Architecture:** `matomo_annual_report` (in `matomo_tools.py`) returns markdown with fixed `## ` sections. A new `matomo_blocks.py` parses each Matomo tool result into Block Kit, using the existing helpers in `slack_blocks.py`. `blocks_from_tool_steps` adds those blocks; `format_for_slack` keeps the model's short summary, but drops markdown tables from it, so tables aren't shown twice. This is the occupancy pattern.

**Tech Stack:** Python 3.12, Slack Block Kit (`table`, `data_visualization`), Matomo Reporting API (processed month/day reports only), pytest.

**Spec:** `docs/superpowers/specs/2026-11-06-hoohelp-matomo-report-templates-design.md`. Open questions are answered as follows:

1. The collections chart shows "UVA collection" kinds only; the table shows all kinds.
2. Libra ETD counts as a UVA collection.
3. The records table shows the top 20.

## Global Constraints

- At most **2** `data_visualization` blocks per message (`MAX_VIZ`), 20 categories, 20-character labels, 50-character titles, 99 table rows plus a header: use `bar_chart`, `line_chart`, `table_block` and `_unique_labels` from `slack_blocks.py`.
- Only processed reports: requests go through `MatomoTools._report` (which never sends `period=range`).
- No bot or automated-traffic warning anywhere (decision of 2026-11-06).
- Matomo text (collection names, page labels, titles) is untrusted. It goes only into `plain_text` / `raw_text` table cells and chart labels, never into mrkdwn, links or headers built from it.
- Annual report: Virgo (site 39) only; the previous fiscal year is always included; the top 20 records.
- Live evals: run only the affected cases (memory: the full suite at most once a day).
- Test venv: `/private/tmp/claude-505/-Users-dhc4z-workspace-monorepo-apps-slack-bot-hoo-help/99d64b49-f08c-4ffd-b297-9d203283e609/scratchpad/venv/bin/python`. Run `AWS_REGION=us-east-1 <venv> -m pytest -q . evals` from the app dir. Baseline: 885 passed.

## Review Focus

1. **Fiscal year still in progress** (FY27, capped at yesterday): the monthly table and chart cover only the months with data, for both years (like-for-like), never a cliff to 0. Owner: Task 1 (table) and Task 2 (chart).
2. **Matomo busy mid-report** (timeout or 504 on any section): the breaker must trip (the tool returns the busy error), not a half-report that hides the outage. Owner: Task 1.
3. **One section fails** (e.g. Events returns an ordinary Matomo error): that section says `Unavailable: …`, the other sections and their blocks still render. Owner: Tasks 1 and 2.
4. **Untrusted names**: a collection named `<https://evil|click> *bold*` shows as literal text in table and chart, not as a link or bold. Owner: Task 2.
5. **Long or duplicate collection names** in the chart are shortened to 20 characters and made unique; full names stay in the table. Owner: Task 2.

---

### Task 1: `matomo_annual_report` tool

**Files:**
- Modify: `src/matomo_tools.py`
  - add the tool constant, spec, `handles`/`call` dispatch and the `annual_report` method;
  - extract `_event_counts` from `virgo_collections`;
  - add helpers `_gap_ranges` and `_month_rows`.
- Test: `test_matomo_annual_report.py` (create)

**Interfaces:**
- Produces:
  - `TOOL_ANNUAL_REPORT = "matomo_annual_report"`
  - `MatomoTools.annual_report(args: dict) -> str`; args: `fiscal_year` (required)
  - `MatomoTools._event_counts(site, period, action) -> tuple[list[tuple[str, tuple[int, int]]], int]`: ranked `(name, (visits, events))` and the "Others" visits. `virgo_collections` must use it, with its output unchanged.
  - `_gap_ranges(days: list[datetime.date]) -> list[str]`
  - `MatomoTools._report_by_part(site, period, method, **extra) -> dict[str, Any]`: like `_report`, but returns the per-month/per-day values keyed by date (no merging); `_report` stays as is.
  - Notes section lines, in order (each only when it applies): the tracking-gap line (below); `"{n:,} record visits are grouped by Matomo as “Others” (it keeps only each month's top items)."`; `KIND_NOTE`; `PROVISIONAL_NOTE`.
  - Section headings, exactly, in this order: `## Summary`, `## Monthly visits`, `## Top collections`, `## Top records`, `## Notes`.
  - First line: `Virgo annual report — FY26 (July 1, 2025 – June 30, 2026), compared with FY25 (July 1, 2024 – June 30, 2025)`.
  - Table headers (Task 2 parses these):
    - `| Metric | FY26 | FY25 | Change |`, with rows Visits, Pageviews, Site searches, Downloads;
    - `| Month | FY26 visits | FY25 visits |`, with labels `Jul` … `Jun`;
    - `| Collection | FY26 visits | FY25 visits | Item views | Kind |`, top 15;
    - `| Record | Visits | Item views | Format | Access type |`, top 20.
  - A failed section's body is one line: `Unavailable: <message>`.

- [ ] **Step 1: Write the failing tests** in `test_matomo_annual_report.py`. Use a fake client keyed by `(method, period, filter_pattern-or-None)` that returns month-keyed dicts, like `test_matomo_ranges.Client`, plus a gateway dict for item details (reuse `CORKS` and `KANOPY` from `test_virgo_access`). Tests:
  - `test_sections_in_order_and_header`: the headings appear in the order above, and the first line matches exactly for `fiscal_year="FY26"`.
  - `test_summary_compares_previous_year`: FY26 visits 1,000 and FY25 800 give the row `| Visits | 1,000 | 800 | +25.0% |` (use the existing `_pct_change` format).
  - `test_monthly_rows_jul_to_jun`: 12 rows, `Jul` first, `Jun` last; `| Nov | 801,527 | 43,641 |` from the month dicts.
  - `test_fiscal_year_in_progress_has_only_months_with_data` (Review Focus 1): with `TODAY=2026-11-07` and `FY27`, the rows are Jul–Oct only, and the FY26 column shows the same four months.
  - `test_collections_have_previous_year_and_kind`: the row `| University of Virginia Visual History Collection | 2,475 | 2,284 | 10,491 | UVA collection |`; Libra ETD is kind `UVA collection`; at most 15 rows.
  - `test_records_top_20_with_details`: 25 item rows produce 20 table rows; Corks and Curls shows `Journal/Magazine, Online | UVA digital`; the gateway is called at most 20 times.
  - `test_notes_tracking_gaps`: days with `nb_visits` 0 or `[]` on 2025-11-09..11 and 2025-12-27..2026-01-03 give the note `No visits were recorded on: Nov 9–11, 2025; Dec 27, 2025 – Jan 3, 2026 (likely tracking gaps).`
  - `test_gap_ranges` covers a single day (`Nov 9, 2025`), a run within a month, a run across months, and an empty list (`[]`).
  - `test_failed_section_is_unavailable` (Review Focus 3): `MatomoError("Invalid segment")` on the Events call gives `## Top collections\nUnavailable: Invalid segment`, and Summary still has numbers.
  - `test_busy_matomo_fails_whole_report` (Review Focus 2): `MatomoTimeout` on any call means `call(TOOL_ANNUAL_REPORT, …)` returns `"Error: " + OTHER_TIMEOUT`.
  - `test_no_range_requests_and_request_count`: no call has `period == "range"`, and there are at most 8 Matomo calls.
  - `test_tool_offered_and_bad_fiscal_year`: `TOOL_ANNUAL_REPORT` is in `tool_specs()` (always offered; records need `gateway_call`, otherwise the records section says `Unavailable: catalog lookups are not available`), and `fiscal_year="2026x"` returns `Error:`.

- [ ] **Step 2: Run them to verify they fail**
  Run: `AWS_REGION=us-east-1 <venv> -m pytest -q test_matomo_annual_report.py`
  Expected: ImportError for `TOOL_ANNUAL_REPORT`.

- [ ] **Step 3: Implement**, following the interfaces above.
  - Requests:
    - `VisitsSummary.get` and `Actions.get` for each FY. Ask for months via `_report` on a `Period("range", …)` for that FY; for the per-month table use the same multi-date month results, so add `_report_by_part` returning `{date_key: value}` without merging, and sum them for Summary.
    - `Events.getAction` with collection rows for both FYs (`_event_counts`), and item rows for the current FY.
    - `VisitsSummary.get` with `period=day` multi-date across the current FY, for the gaps.
  - Each section is built in its own `try`. `except (MatomoTimeout, MatomoBusy, MatomoAuthError): raise` so the breaker and auth handling in `call()` work. Any other `MatomoError` or `ValueError` becomes `Unavailable: <message>`.
  - Records use `_lookup_details` with picks `(pool_for_item_id(id) or "uva_library", id)`, `limit=20`. Raise `ThreadPoolExecutor(max_workers=…)` in `_lookup_details` from 4 to 5, so 20 lookups fit the 15-second budget.
  - The previous FY is `FY(n-1)`. Both periods go through `resolve_period`, so the current FY is capped at yesterday. Month rows only include months that end on or before the capped end; a partial last month is included only if it has data.
  - The tool spec description should say it gives the standard Virgo annual report for a fiscal year (July–June), compared with the previous year.

- [ ] **Step 4: Run the tests to verify they pass**, then the full suite.
  Run: `AWS_REGION=us-east-1 <venv> -m pytest -q . evals`
  Expected: all pass (885 + new).

- [ ] **Step 5: Commit**
```bash
git add src/matomo_tools.py test_matomo_annual_report.py
git commit -m "feat(hoohelp): matomo_annual_report tool (Virgo FY report vs previous year)"
```

### Task 2: Matomo Block Kit renderers

**Files:**
- Create: `src/matomo_blocks.py`
- Test: `test_matomo_blocks.py` (create)

**Interfaces:**
- Consumes: the Task 1 output format (headings and table headers above); the existing tool outputs of `matomo_traffic`, `matomo_virgo_collections`, `matomo_virgo_items`, `matomo_top_pages` and `matomo_page` (see `src/matomo_tools.py`); and these helpers from `slack_blocks`: `header_block`, `section_fields`, `context_mrkdwn`, `table_block`, `bar_chart`, `line_chart`, `parse_markdown_table`, `MAX_VIZ`.
- Produces:
  - `matomo_blocks_for_step(tool_name: str, output: str, viz_budget: int) -> list[dict]`: an empty list for a non-Matomo tool, an `Error:` output, or an output that can't be parsed.
  - `MATOMO_BLOCK_ID = "matomo_report"`: the first block of every result carries `block_id` `matomo_report`, and each chart carries `matomo_chart_<n>`. Task 3 uses these to recognise Matomo blocks.

Layouts (the spec's table):

| Tool | Blocks |
| --- | --- |
| `matomo_annual_report` | 1. header (first line) 2. table of Summary 3. line chart "Monthly visits" with series FY26 and FY25 4. bar chart "Top UVA collections" (rows with Kind `UVA collection`, top 10, series "Visits") 5. table of collections 6. table of records 7. context with the Notes lines, plus any `Unavailable:` lines |
| `matomo_traffic` with a comparison table | header, table, bar chart "Visits and pageviews" (categories Visits and Pageviews; one series per period label) |
| `matomo_traffic` single period | header, `section_fields` (Visits, Pageviews, Site searches, Average visit) |
| `matomo_virgo_collections`, collections | header, bar chart "Top collections" (top 10 by visits, all kinds), table |
| `matomo_virgo_collections` items, or `matomo_virgo_items` | header, table |
| `matomo_top_pages` | header, table |
| `matomo_page` | header, `section_fields` |

The header text is the tool's first line, truncated to 150 characters (plain text). Footnote lines (any non-table line after the tables) go into one context block. If `viz_budget` is 0, charts are left out and the tables remain.

- [ ] **Step 1: Write the failing tests** in `test_matomo_blocks.py`, using recorded-style outputs written in the test (build the annual-report one from Task 1's `MatomoTools` with a fake client, so the format can't drift). Tests:
  - `test_annual_report_layout`: block types in order are `header, table, data_visualization, data_visualization, table, table, context`; the line chart has 2 series named `FY26` and `FY25`; the first block's `block_id` is `matomo_report`.
  - `test_annual_chart_uva_collections_only`: HathiTrust, licensed and purchase-fund rows are not in the bar chart's categories; Libra ETD is.
  - `test_viz_budget_respected`: `viz_budget=1` gives exactly one chart (the line chart); `viz_budget=0` gives none, and the tables remain.
  - `test_in_progress_year_chart_like_for_like` (Review Focus 1): FY27 output with Jul–Oct gives line-chart categories `["Jul","Aug","Sep","Oct"]`.
  - `test_unavailable_section_still_renders_others` (Review Focus 3): with `## Top collections\nUnavailable: x`, there's no collections chart or table, the summary table and line chart are present, and `Unavailable: x` is in the context.
  - `test_untrusted_names_plain` (Review Focus 4): the collection `<https://evil|click> *bold*` appears in the table as a `raw_text` cell with the literal text; no `mrkdwn` element contains `evil`.
  - `test_long_duplicate_labels` (Review Focus 5): two 40-character names that share their first 20 characters give two distinct chart labels of ≤20 characters; the table keeps the full names.
  - `test_traffic_compare_and_single`, `test_collections_and_items`, `test_top_pages_and_page`: block types per the layout table.
  - `test_non_matomo_and_error_outputs_empty`: `matomo_blocks_for_step("get_library_hours", …) == []`, and `"Error: …"` gives `[]`.

- [ ] **Step 2: Run them to verify they fail**
  Run: `AWS_REGION=us-east-1 <venv> -m pytest -q test_matomo_blocks.py`
  Expected: ModuleNotFoundError `matomo_blocks`.

- [ ] **Step 3: Implement `src/matomo_blocks.py`.**
  - Split the annual output on lines starting with `## `, then use `parse_markdown_table` for each section.
  - Numbers in cells such as `1,234` become floats for charts (strip commas); tables pass the cell text through unchanged.
  - Set `block_id` on the returned dicts after building them.
  - Use `numeric_columns` in `table_block` for the count columns.

- [ ] **Step 4: Run the tests to verify they pass**, then the full suite. Expected: all pass.

- [ ] **Step 5: Commit**
```bash
git add src/matomo_blocks.py test_matomo_blocks.py
git commit -m "feat(hoohelp): Block Kit templates for Matomo results (tables, charts)"
```

### Task 3: Wire into the Slack reply and the prompt

**Files:**
- Modify:
  - `src/slack_blocks.py`, in `blocks_from_tool_steps`: render the first Matomo step that gives blocks, using the chart budget left after occupancy.
  - `src/slack_format.py`: `_layout_owned` and `format_for_slack`.
  - `src/agent.py`, section 10 of the prompt.
  - `test_fixtures/system_prompt_legacy.txt`, regenerated with `_rendered(False)` as in `test_agent_context`.
  - `test_matomo_wiring.py`.
- Test: `test_matomo_blocks_wiring.py` (create)

**Interfaces:**
- Consumes: `matomo_blocks_for_step` and `MATOMO_BLOCK_ID` (Task 2), and `TOOL_ANNUAL_REPORT` (Task 1).
- Produces: `_layout_owned(extra) -> tuple[bool, bool, bool, bool]`, which is `(occ, hours, img, matomo)`. Update every caller in `slack_format.py`.

- [ ] **Step 1: Write the failing tests** in `test_matomo_blocks_wiring.py`. They call `format_for_slack(answer, use_llm=False, tool_steps=[step])`, where `step` is a `SimpleNamespace(tool_name=..., output=..., status="success")`:
  - `test_matomo_blocks_appended_and_summary_kept`: an answer of 3 sentences plus a markdown table gives blocks that contain the Matomo header (with `block_id` `matomo_report`) and the summary sentences; the visible text has no line starting with `|`.
  - `test_matomo_chart_does_not_count_as_occupancy`: `_layout_owned` on Matomo blocks returns `(False, False, False, True)`.
  - `test_occupancy_still_owned`: an existing occupancy step still gives `occ` True. Reuse an output from `evals/cases/compare-shannon-clemons.json`.
  - `test_chart_budget_shared`: occupancy (2 charts) plus a Matomo step gives at most 2 `data_visualization` blocks in total.
  - `test_formatter_skipped_for_matomo`: with `use_llm=True` and a Matomo step, no Bedrock client is called. Pass a `bedrock_client` that raises if used.
- In `test_matomo_wiring.py::test_prompt_routes_web_statistics`, add the needles `"matomo_annual_report"` and `"don't repeat the tables"`.

- [ ] **Step 2: Run them to verify they fail.** Expected: the new tests and the wiring test fail.

- [ ] **Step 3: Implement.**
  - `_layout_owned`: `occ` ignores blocks whose `block_id` starts with `matomo_`; `matomo` is True when any block's `block_id` is `matomo_report`.
  - In `format_for_slack`, when `matomo` is set, keep the agent answer with markdown table lines (`^\s*\|`) removed, `llm_blocks = None`, and the formatter skipped.
  - Prompt, section 10, add a line: `- Annual reports ("FY26 Virgo report", "the annual report numbers") go to matomo_annual_report. When Matomo results are shown as tables and charts, write a 2–4 sentence summary of what stands out and what changed; don't repeat the tables.`
  - Regenerate the legacy prompt fixture.

- [ ] **Step 4: Run the full suite** (including `<venv> evals/run.py --offline`). Expected: all pass; offline 46 passed / 0 failed.

- [ ] **Step 5: Commit**
```bash
git add src/slack_blocks.py src/slack_format.py src/agent.py test_fixtures/system_prompt_legacy.txt test_matomo_blocks_wiring.py test_matomo_wiring.py
git commit -m "feat(hoohelp): Matomo answers use code-built tables and charts; annual report routing"
```

### Task 4: Eval cases and a live check

**Files:**
- Create:
  - `evals/cases/matomo-annual-report-blocks.json` (offline)
  - `evals/cases/live-matomo-annual-report.json` (live)

**Interfaces:**
- Consumes: the Task 1 output and the Task 3 rendering.

- [ ] **Step 1: Write the offline case.** It has a `recorded` trace with one `matomo_annual_report` step; its output is generated once from Task 1 with the fake client in `test_matomo_annual_report.py`, then pasted in. The `final` answer is a 3-sentence summary plus a markdown table. The `expect` block:

  ```json
  {"blocks": ["table", "data_visualization", "header"], "phrases": ["Virgo annual report", "Top records"], "forbid": ["| Metric |"], "allow_condensed": true}
  ```

  Use the field names in `evals/case.py` (`EXPECT_FIELDS`).

- [ ] **Step 2: Write the live case.** Question: `Give me the FY26 Virgo annual report.` Fields: `tools_any: ["matomo_annual_report"]`, `phrases_any: ["FY26"]`, `forbid: ["isn't available right now", "overloaded or not responding", "took longer than I can spend", "94%"]`, `max_seconds: 90`.

- [ ] **Step 3: Run the offline evals and the full suite.**
  Run: `<venv> evals/run.py --offline` and `AWS_REGION=us-east-1 <venv> -m pytest -q . evals`
  Expected: offline 47 passed, 0 failed; suite all pass.

- [ ] **Step 4: Run only the affected live cases** (budget rule):
  Run: `SSL_CERT_FILE=$(<venv> -m certifi) AWS_REGION=us-east-1 BEDROCK_GUARDRAIL_ID=2fn87od0qscu BEDROCK_GUARDRAIL_VERSION=5 <venv> evals/run.py --live --gateway-url https://uvalib-mcp-lbfsinhgdo.gateway.bedrock-agentcore.us-east-1.amazonaws.com/mcp --case live-matomo-annual-report --case live-matomo-virgo-collections --case live-matomo-virgo-october`
  Expected: 3/3 pass; the annual report takes under 60 s.

- [ ] **Step 5: Commit**
```bash
git add evals/cases/matomo-annual-report-blocks.json evals/cases/live-matomo-annual-report.json
git commit -m "test(hoohelp): annual report eval cases (offline blocks, live)"
```

Deploy and push need the user's approval, after the final review.
