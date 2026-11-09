# Citation Check Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Check a whole pasted bibliography (up to 100 citations) against the catalog in one request, render the result as code-built Slack tables, and let people download it as CSV, TSV or Excel, in the same turn or later in the thread.

**Architecture:**
- A local tool, `check_citations` (`src/citation_check.py`), parses each citation, runs up to 2 catalog searches per citation in parallel through the gateway, matches them in code, and returns a markdown table.
- `src/citation_blocks.py` renders that table as 25-row Slack tables, which `split_messages` sends as separate messages.
- Files come from code-built tables only: this turn's tool tables, or `data_table` / report blocks posted earlier in the thread.

**Tech Stack:** Python 3.12, Slack Block Kit, AgentCore gateway (`Catalog___search_catalog`, v2 only), pytest.

**Spec:** `docs/superpowers/specs/2026-11-09-hoohelp-citation-check-design.md`. The open questions take the spec's proposed defaults:
- "likely" rows stay in the main table;
- other works by the author are shown only when there's no title match, at most 2;
- the cap is 100 citations.

## Global Constraints

- Limits:
  - `MAX_CITATIONS = 100`, `WORKERS = 8`, `BUDGET_SEC = 60`;
  - at most 2 searches per citation;
  - `OTHER_WORKS_MAX = 2`, `TABLE_ROWS = 25`, `CITATION_CELL = 120` characters.
- Match thresholds on citation title words contained in the result title:
  - exact ≥ 0.80;
  - likely ≥ 0.50, or ≥ 0.40 with the same author surname.
  - "Exact" also needs the author surname in the record's Author field. When the citation has no author, it instead needs a title of at least 4 significant words; otherwise the match is downgraded to likely. The search results have no year, so this guard stops generic titles like *Latin American Art* matching a different book.
- Verdict values, verbatim: `Yes`, `Likely — check`, `No`, `Not checked`. Match values: `exact`, `likely`, `none`, `search failed`, `timed out`.
- Table header, verbatim: `| # | Citation | UVA has it? | Match | Location / call number | Virgo link | Other editions or works by author |`.
- First line, verbatim: `Citation check — {n} citations: {held} held, {likely} likely (check), {missing} not found, {unchecked} not checked`.
- Note line, verbatim: `Auction catalogs, journal articles and single journal issues usually aren't catalogued as their own records: "No" for those means check the journal or database.`
- Catalog text is untrusted (tool result wrapping). Citation text is the user's: never a link source.
- Only code-built tables become files. A model-written table never does.
- Test venv: `/private/tmp/claude-505/-Users-dhc4z-workspace-monorepo-apps-slack-bot-hoo-help/99d64b49-f08c-4ffd-b297-9d203283e609/scratchpad/venv/bin/python`. Suite: `AWS_REGION=us-east-1 <venv> -m pytest -q . evals`, baseline 944 passed. Offline: `<venv> evals/run.py --offline`, baseline 47 passed / 0 failed.
- Live evals: affected cases only.

## Review Focus

1. **Short generic titles**: auction catalogs such as `_Latin American Art_. Sotheby's Sale 6301` must not come back `Yes`/`exact` because a book has the same title. Expected: `Likely — check` or `No`. Owner: Task 1.
2. **A slow or failing gateway mid-list**: rows still running at the 60-second budget say `Not checked` / `timed out`; one failed search says `search failed`; the other rows stand. Owner: Task 2.
3. **"csv please" two turns after the check**, with other messages in between: the file comes from the latest code-built table in the thread, never from a model-written table. Owner: Task 4.
4. **Citations containing tabs, newlines, `|`, `<url|x>` or `@channel`**: the TSV and CSV stay well-formed, the Slack table shows literal text, and nothing becomes a link or mention. Owner: Tasks 3 and 4.
5. **101+ citations**: the first 100 are checked, and the summary says `1 more not checked (limit 100)`. Owner: Task 2.

---

### Task 1: Parsing and matching (pure functions)

**Files:**
- Create: `src/citation_check.py` (pure functions in this task)
- Test: `test_citation_check.py` (create)

**Interfaces:**
- Produces:
  - `@dataclass Citation(text: str, author: str, surname: str, title: str, year: str)`
  - `parse_citation(text: str) -> Citation`:
    - `author` is the text before the first period that isn't an initial, or "" when the citation starts with the title (italic or quoted);
    - `surname` is the part of `author` before the first comma, or its last word;
    - `title` is the italic (`_…_` or `*…*`) or quoted ("…", “…”) part, or otherwise the segment after the author up to the next `. `;
    - `year` is the first 4-digit year from 1500 to 2099.
  - `@dataclass Record(title: str, author: str, library: str, location: str, call_number: str, url: str, item_id: str)`
  - `parse_results(text: str) -> list[Record]`: parses `### n. Title` blocks with `**Library**`, `**Location / shelf**`, `**Call number**` (strip backticks), `**Author**`, `**Virgo record**` and `**Item ID**`.
  - `significant_words(text: str) -> set[str]`: accents stripped (NFKD), lowercase, punctuation removed; drops `the a an of and or de la le les du des el y in on for to with`.
  - `match(cite: Citation, rec: Record) -> str`: `"exact" | "likely" | "none"`. Containment is `max(contain(title), contain(main title before ":"))`, using the thresholds and the "exact" guard in Global Constraints.

- [ ] **Step 1: Write the failing tests.** In `test_citation_check.py`, use real citations from the 2026-11-09 thread:
  - `test_parse_author_title_year`:
    - `Rodman, Selden. _The Miracle of Haitian Art_. Garden City, NY: Doubleday, 1974.` gives surname `Rodman`, title `The Miracle of Haitian Art`, year `1974`;
    - `Hurbon, Laënnec. _Voodoo: Search for the Spirit_. Translated by Lory Frankel. New York: Harry N. Abrams, 1995.` gives surname `Hurbon` and year `1995`.
  - `test_parse_title_first_citation`: `_Latin American Art_. Sotheby's Sale 6301. November 1990.` gives author `""`, title `Latin American Art`, year `1990`.
  - `test_parse_quoted_article`: `Liu. "Highlights of Haitian Auction." _Haitian Art Newsletter_ Dec 1978.` gives title `Highlights of Haitian Auction`.
  - `test_parse_results`: on the recorded search output (a fixture string copied from a real `Catalog___search_catalog` result for "The Miracle of Haitian Art"), record 1 is `The Miracle of Haitian Art ([1st ed.])`, `Fine Arts`, `Fine Arts Stacks`, `N6606.R62`, `https://search.lib.virginia.edu/sources/uva_library/items/u877894`, `u877894`, author `Rodman, Selden`.
  - `test_match_exact_likely_none`:
    - Rodman against record 1 is `exact`;
    - Hurbon *Voodoo* against `Les Mystères du Vaudou` (author Hurbon) is `none`;
    - `Voodoo: Search for the Spirit` against `Voodoo` (author Hurbon) is `likely`.
  - `test_short_generic_title_not_exact` (Review Focus 1): the title-first `Latin American Art` against a record `Latin American Art` by another author is `likely`, not `exact`.
  - `test_accents_and_punctuation_ignored`: `Haïti et ses peintres` against `Haiti et ses peintres : de 1804 à 1980` (same surname) is `exact`.

- [ ] **Step 2: Run them to verify they fail.**
  Run: `AWS_REGION=us-east-1 <venv> -m pytest -q test_citation_check.py`
  Expected: ModuleNotFoundError `citation_check`.

- [ ] **Step 3: Implement the functions** in `src/citation_check.py`, using the signatures above.

- [ ] **Step 4: Run the tests to verify they pass**, then the full suite. Expected: all pass.

- [ ] **Step 5: Commit**
```bash
git add src/citation_check.py test_citation_check.py
git commit -m "feat(hoohelp): citation parsing and catalog matching for check_citations"
```

### Task 2: The `check_citations` tool, wired in

**Files:**
- Modify:
  - `src/citation_check.py`: add the `CitationTools` class;
  - `src/app.py`: add a `citation_tools_for_env()` instance to the `LocalTools(...)` in `handle_user_query`;
  - `src/agent.py`: the catalog guideline line, the `_UNTRUSTED_LOCAL` entry, and Virgo links from `check_citations` as trusted in `_link_sources`;
  - `test_fixtures/system_prompt_legacy.txt`: regenerate.
- Test: `test_citation_tools.py` (create)

**Interfaces:**
- Consumes: Task 1's functions.
- Produces:
  - `TOOL_CHECK_CITATIONS = "check_citations"`
  - `class CitationTools(gateway_call: Callable[[str, dict], str], v2: Callable[[], bool], clock=time.monotonic, budget: float = BUDGET_SEC)`, with `tool_specs()` (empty unless `v2()`), `handles(name)` and `call(name, args) -> str`.
  - Args: `citations: list[str]` (required) and `start_number: int` (default 1).
  - Output: the first line; a blank line; the table (header row exactly as in Global Constraints, one row per citation, `#` = `start_number + i`); a blank line; the note line. Then, only when over the cap, `{k} more not checked (limit 100)`.
  - Row cells:
    - Location / call number: `{location}, {call_number}`.
    - Virgo link: the full URL.
    - Others: `{title} ({item_id}); …`, at most 2.
    - Cell text has `|` replaced by `/`, and newlines and tabs replaced by spaces.
  - `citation_tools_for_env(env=None, *, gateway_call=None, v2=None) -> Optional[CitationTools]`: off when `ENABLE_CITATION_CHECK` is `"false"`; on by default.

- [ ] **Step 1: Write the failing tests** in `test_citation_tools.py`, with a fake gateway keyed by `(field, query)` that returns recorded search texts:
  - `test_one_row_per_citation_and_summary`: 3 citations (Rodman held, Hurbon not found by title but found by author, an auction catalog with no hits):
    - first line `Citation check — 3 citations: 1 held, 0 likely (check), 2 not found, 0 not checked`;
    - the Rodman row has `Yes | exact | Fine Arts Stacks, N6606.R62 | https://search.lib.virginia.edu/sources/uva_library/items/u877894`;
    - the Hurbon row has `No | none |` and `Les Mystères du Vaudou (u…)` in its last cell.
  - `test_author_search_only_when_title_not_found`: the gateway is called with `field=author` only for Hurbon, and with at most 2 searches per citation.
  - `test_parallel_budget` (Review Focus 2): a fake gateway that sleeps 0.2 s per call, with `budget=0.3` and 20 citations: some rows say `Not checked | timed out` and the summary counts them; the whole call returns in under 2 s.
  - `test_search_failure_row`: an `Error: …` from the gateway for one citation gives `Not checked | search failed` for that row only.
  - `test_cap_100` (Review Focus 5): 101 citations give 100 rows and the line `1 more not checked (limit 100)`.
  - `test_start_number`: `start_number=26` numbers the first row `26`.
  - `test_cells_cleaned`: a citation with `|`, a tab and a newline gives one table row, with no extra cells.
  - `test_offered_only_on_v2_gateway`: `tool_specs()` is `[]` when `v2()` is False.
  - `test_untrusted_and_trusted_links`:
    - `agent.untrusted_source("check_citations")` is not None;
    - a Virgo record URL from a `check_citations` step output is in `_link_sources(trace)[1]` (trusted);
    - a URL that appears only in the step input is not.
  - In `test_grounding.py::test_prompt_batches_list_lookups_and_forbids_unsourced_holdings`, add the needle `"call check_citations once with all of them (up to 100)"`.

- [ ] **Step 2: Run them to verify they fail.** Expected: ImportError `CitationTools`.

- [ ] **Step 3: Implement.**
  - Searches go through `gateway_call("Catalog___search_catalog", {"query": …, "field": "title" | "author"})`, run in a `ThreadPoolExecutor(max_workers=WORKERS)`, with `concurrent.futures.wait(timeout=…)` against `budget`, and `shutdown(wait=False, cancel_futures=True)`.
  - The best record is the first one with `exact`, otherwise the first with `likely`. The author search runs only when the title search has no `exact` or `likely` match. Its records that match the title are treated as a title match; otherwise the first 2 records whose title doesn't match become "others".
  - Prompt line, added after the existing "To check a list of items" guideline: `- For a list of citations (a reading list or bibliography), call check_citations once with all of them (up to 100), keeping their numbering; then summarize in 2–4 sentences without repeating the table.`
  - Add `"check_citations": "catalog"` to `_UNTRUSTED_LOCAL` (or the equivalent untrusted mapping in `agent.py`).
  - In `_link_sources`, treat a `check_citations` step like a catalog tool for `https://search.lib.virginia.edu/sources/uva_library/items/` URLs.
  - Regenerate the legacy prompt fixture.

- [ ] **Step 4: Run the full suite and the offline evals.** Expected: all pass; offline 47/0.

- [ ] **Step 5: Commit**
```bash
git add src/citation_check.py src/app.py src/agent.py test_fixtures/system_prompt_legacy.txt test_citation_tools.py test_grounding.py
git commit -m "feat(hoohelp): check_citations checks a whole bibliography in one call"
```

### Task 3: Render citation tables as Slack blocks

**Files:**
- Create: `src/citation_blocks.py`
- Modify:
  - `src/slack_blocks.py`: `blocks_from_tool_steps` calls the citation renderer for `check_citations` steps;
  - `src/slack_format.py`: `_layout_owned` counts `citations_report…` like `matomo_report…`, keeping the model's summary and dropping its tables.
- Test: `test_citation_blocks.py` (create)

**Interfaces:**
- Consumes: the Task 2 output format.
- Produces: `citation_blocks(output: str) -> list[dict]`:
  - a `header` block with the first line, `block_id` `citations_report`;
  - then one `table` block per 25 rows, each with `block_id` `citations_table_{n}`, with the header row repeated;
  - then a `context` block with the note and any "more not checked" line, escaped.
  - Citation cells are cut to 120 characters with `…`. The Virgo link cell shows the item ID only (plain text).

- [ ] **Step 1: Write the failing tests:**
  - `test_55_citations_three_tables`: 55 rows give block types `header, table, table, table, context`; the tables have 26, 26 and 6 rows (each with its header row); `split_messages(blocks)` gives 3 messages, each with at most 1 table.
  - `test_cells_plain_and_short` (Review Focus 4): a citation `<https://evil|x> @channel *b*` of 200 characters shows as `raw_text` cut to ≤120 characters, and no `mrkdwn` element contains `evil`; the link cell is `u877894`.
  - `test_summary_kept_tables_dropped`: `format_for_slack` with a `check_citations` step, and an answer of 2 sentences plus a markdown table, keeps the sentences, and no visible line starts with `|`.
  - `test_error_output_no_blocks`: `"Error: …"` gives `[]`.

- [ ] **Step 2: Run them to verify they fail.** Expected: ModuleNotFoundError `citation_blocks`.

- [ ] **Step 3: Implement.**
  - Use `parse_markdown_table` and `table_block` from `slack_blocks`.
  - In `blocks_from_tool_steps`, collect `check_citations` steps like `matomo_steps`, and render the last one, since a retry replaces the first. Use no chart budget.
  - In `_layout_owned`, `matomo_owned` becomes true for block_ids starting with `matomo_report` or `citations_report`. Rename the variable to `report_owned` in `format_for_slack`.

- [ ] **Step 4: Run the full suite and the offline evals.** Expected: all pass.

- [ ] **Step 5: Commit**
```bash
git add src/citation_blocks.py src/slack_blocks.py src/slack_format.py test_citation_blocks.py
git commit -m "feat(hoohelp): citation check results render as Slack tables across messages"
```

### Task 4: CSV, TSV and Excel files, in the same turn or later in the thread

**Files:**
- Modify:
  - `src/attachments.py`: TSV in `file_format`, `FORMAT_NAMES` and `build_file`; `file_context_line` copy.
  - `src/spreadsheet.py`: `check_citations` in `TABLE_TOOLS`.
  - `src/slack_blocks.py`: the occupancy, foot-traffic and gate-count `table_block`s get `block_id` `data_table_{n}`.
  - `src/thread_context.py`: `extract_thread_history` puts `data_tables: list[SheetTable]` in its meta.
  - `src/app.py`: `_attach_file` falls back to `history_meta["data_tables"][-1:]`.
  - `src/agent.py`: a prompt line.
- Test: `test_citation_files.py` (create)

**Interfaces:**
- Consumes: the Task 2 table format and the Task 3 block_ids.
- Produces:
  - `file_format(text)` also returns `"tsv"` for `\btsv\b|tab[- ]separated`.
  - `build_file("tsv", tables)` returns `({stem}.tsv, …)`, with cells cleaned of tabs and newlines and formula-escaped like CSV.
  - `tables_from_blocks(blocks: list[dict]) -> list[SheetTable]` in `spreadsheet.py` turns `table` blocks into tables:
    - only blocks whose `block_id` starts with `data_table`, `citations_table`, or `matomo_`;
    - tables from consecutive `citations_table_*` blocks are joined into one table (header once);
    - the title comes from the nearest preceding header block.
  - `extract_thread_history(...)` meta key `"data_tables"`: `tables_from_blocks` over the bot's messages in the thread, oldest first.

- [ ] **Step 1: Write the failing tests** in `test_citation_files.py`:
  - `test_tsv_format_detected`: `file_format("as a TSV please")` is `"tsv"`; `file_format("tab-separated file")` is `"tsv"`.
  - `test_tsv_cells_clean` (Review Focus 4): a cell with a tab and a newline gives a well-formed TSV with one line per row; a cell starting `=` is escaped as CSV does.
  - `test_same_turn_check_citations_file`: `tables_from_steps` on a `check_citations` step gives one table with the 7 headers and full (uncut) citations.
  - `test_later_turn_file_from_thread` (Review Focus 3): the thread messages (fake `conversations_replies`) are a bot message with `citations_table_1` and `citations_table_2` blocks, then a user message, then a bot message with only prose and a model-written table block (no block_id). `history_meta["data_tables"]` has one joined citations table, and the model table is absent.
  - `test_attach_file_uses_thread_table`: `handle_user_query` with "csv please", no tools this turn, and that thread uploads a CSV whose rows are the citation rows. Use a fake client with `files_upload_v2` recording calls.
  - `test_no_table_no_file_line`: `file_context_line("csv")` with no tables available says no file can be made. Add a parameter `available: bool = True`; with `False` the copy is: `They want a CSV file, but there is no table from Hoo Helper's tools in this thread to build it from. Say so, and don't paste the data as CSV or TSV text.`
  - `test_occupancy_tables_tagged`: an occupancy table block from `occupancy_blocks` has `block_id` starting `data_table`.
- Prompt line, in the Slack formatting guidelines: `- Never paste CSV, TSV or JSON data as text: when someone wants a file, it is attached automatically from Hoo Helper's tables.` Add this needle to `test_matomo_wiring.py`'s prompt test.

- [ ] **Step 2: Run them to verify they fail.** Expected: the new tests fail.

- [ ] **Step 3: Implement.**
  - In `handle_user_query`, pass `available=bool(this turn's table tools or history_meta.get("data_tables"))` to `file_context_line`. "This turn's table tools" isn't known before the model runs, so pass `True` whenever the turn could produce one (`check_citations` or the occupancy tools offered). Only pass the `False` copy when the thread has no data tables and the message is a bare file request (`file_format(text)` and ≤ 6 words).
  - `_attach_file`: `tables = listing_tables + tables_from_steps(steps)`; if that's empty, use `(history_meta or {}).get("data_tables", [])[-1:]`.

- [ ] **Step 4: Run the full suite and the offline evals.** Expected: all pass.

- [ ] **Step 5: Commit**
```bash
git add src/attachments.py src/spreadsheet.py src/slack_blocks.py src/thread_context.py src/app.py src/agent.py test_fixtures/system_prompt_legacy.txt test_citation_files.py test_matomo_wiring.py
git commit -m "feat(hoohelp): CSV/TSV/Excel from code-built tables, also later in the thread"
```

### Task 5: Eval cases and a live check

**Files:**
- Create:
  - `evals/cases/citation-check-blocks.json` (offline)
  - `evals/cases/live-citation-check.json` (live)

- [ ] **Step 1: Write the offline case.** It has a recorded `check_citations` step: generate the output once from Task 2's tool with the fake gateway, and paste it in. Its `final_text` is a 2-sentence summary. `expect`: `{"blocks": ["header", "table"], "phrases": ["Citation check", "Rodman"], "allow_condensed": true}`.

- [ ] **Step 2: Write the live case.** The question is "Does UVA have these?" followed by 10 citations from the 2026-11-09 thread, numbered 1–10:
  - Rodman *Miracle of Haitian Art*;
  - Hurbon *Voodoo*;
  - Sotheby's Sale 6301;
  - and 7 others from items 1–25 that real searches found or didn't.

  `live`: `{"tools_any": ["check_citations"], "phrases_any": ["Mystères du Vaudou", "Mysteres du Vaudou"], "forbid": ["u1108985", "BL2530.V6 H8713"], "max_seconds": 75}`.

- [ ] **Step 3: Run the offline evals and the full suite.** Expected: offline 48 passed, 0 failed; suite all pass.

- [ ] **Step 4: Run only the affected live cases:** `live-citation-check`, `live-catalog-yes-continues-lookup`, `live-catalog-citation-other-edition`, `live-lost-in-place`.
  Expected: 4/4 pass; `live-citation-check` under 75 s.

- [ ] **Step 5: Commit**
```bash
git add evals/cases/citation-check-blocks.json evals/cases/live-citation-check.json
git commit -m "test(hoohelp): citation check eval cases (offline blocks, live)"
```

Deploy and push need the user's approval, after the final review.
