# HooHelp Regression Evals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A two-tier regression harness for HooHelp — offline replay of scrubbed real traces through today's formatting code (blocks deploys) and a live run of real questions through MiniMax + the gateway (writes a report).

**Architecture:** Pure check functions (`checks.py`) are shared by both tiers. `offline.py` replays a case's recorded tool steps and model answer through `format_for_slack` / spreadsheet code; `live.py` runs the question through `HooHelpAgent` and formats the same way. `run.py` is the CLI; `make_case.py` turns production traces into scrubbed case files; `scripts/deploy.sh` gates `sam build && sam deploy` on the offline tier.

**Tech Stack:** Python 3.12 stdlib + existing bot code in `src/` (`slack_format`, `spreadsheet`, `agent`, `gateway_mcp_client`), `openpyxl`, `boto3` (live only).

**Spec:** `apps/slack-bot-hoo-help/docs/superpowers/specs/2026-10-16-hoohelp-regression-evals-design.md`

## Global Constraints

- All paths below are relative to `apps/slack-bot-hoo-help/`. Eval modules put `../src` on `sys.path` the same way existing tests do (`sys.path.insert(0, <app>/src)`).
- Plain-Python test scripts printing `ok` (repo convention); no pytest. Run with the scratch venv that has bot deps: `V=/private/tmp/claude-505/-Users-dhc4z-workspace-monorepo-apps-slack-bot-hoo-help/99d64b49-f08c-4ffd-b297-9d203283e609/scratchpad/venv; AWS_REGION=us-east-1 $V/bin/python <script>`.
- Allowed block types: `header, section, divider, context, image, table, actions, card, carousel, data_visualization`. Limits: ≤ 50 blocks, ≤ 1 `table`, section text ≤ 3000 chars.
- Forbidden in posted output: `**`, `| :---`, `|---`, `<thinking`, `Media Outlets Policy`, `non-infringing information`, `Generate a polite, respectful`, `Unknown tool`, `Tool Error:`.
- "Not collapsed": ≥ 0.60 of distinctive answer words (lowercase words ≥ 5 letters, `<thinking>` stripped, minus stop list) appear in visible text; offline only; skipped when `expect.allow_condensed`.
- Offline: `format_for_slack(final_text, use_llm=False, tool_steps=steps)`; no link checker, no Slack. Exit 1 if any case fails.
- Live: sequential; exceptions FAIL the case and the run continues; report `evals/reports/live-YYYYMMDD-HHMMSS.md`; exit 0 regardless; missing AWS credentials → exit 2 before any case.
- `make_case.py`: drop Slack ids, `s3_uri`, `request_id`, `system_prompt_hash`; cap tool output at 20,000 chars; rebuild `history` from earlier traces with the same `slack.thread_ts`; warn on likely person names.
- History shape: `{"role": "user"|"assistant", "content": [{"text": str}]}`.
- `evals/reports/` is git-ignored; `logs/` stays git-ignored.

## Review Focus

1. **Phrases inside mrkdwn or tables**: an `expect.phrases` value like `73,469` appears only in a table cell, or `Clemons` appears as `*Clemons*` → must still match. Visible text includes table cells, section fields, context, card/carousel titles and bodies; matching strips `*`, `_`, `` ` ``. → tests in Task 1.
2. **Live-only case in the offline run** (no `recorded`): skipped, not failed, and not counted. → test in Task 2.
3. **Agent raises mid-run** (gateway timeout, Bedrock throttle): that case FAILs with the exception text, later cases still run, report still written. → test in Task 4.
4. **Thread trace without earlier traces available** (`history_turns` > 0, nothing matching `thread_ts`): case written with `history: []` and a warning, not an error. → test in Task 3.
5. **Case whose expected phrase isn't in the model's answer at all** (author typo): fails with a reason naming the missing phrase, so the case author sees it. → test in Task 1.

---

## File Structure

```
evals/__init__.py        empty
evals/checks.py          check functions (Task 1)
evals/test_checks.py     (Task 1, extended in 2)
evals/case.py            load/validate cases, CaseResult (Task 2)
evals/offline.py         offline replay (Task 2)
evals/run.py             CLI (Task 2 offline; Task 4 live)
evals/make_case.py       trace → case (Task 3)
evals/test_make_case.py  (Task 3)
evals/cases/*.json       (Task 5)
evals/live.py            live runner + report (Task 4)
evals/test_live.py       (Task 4)
scripts/deploy.sh        (Task 6)
.gitignore, README.md    (Task 6)
```

---

### Task 1: Check functions

**Files:**
- Create: `evals/__init__.py`, `evals/checks.py`
- Test: `evals/test_checks.py`

**Interfaces:**
- Produces (`evals/checks.py`):
  - `ALLOWED_BLOCK_TYPES: frozenset[str]`, `FORBIDDEN: tuple[str, ...]`
  - `visible_text(blocks: list[dict]) -> str` — all human-visible text: section text + fields, header, context elements, table cells, card title/body, carousel elements, image alt/title
  - `normalize(text: str) -> str` — strip `*`, `_`, `` ` ``, collapse whitespace, lowercase
  - `universal(fallback_text: str, blocks: list[dict]) -> list[str]`
  - `not_collapsed(answer: str, fallback_text: str, blocks: list[dict], min_ratio: float = 0.6) -> list[str]`
  - `phrases_all(text: str, phrases: list[str]) -> list[str]`, `phrases_any(text: str, phrases: list[str]) -> list[str]`, `forbid(text: str, phrases: list[str]) -> list[str]` — all compare `normalize`d text
  - `tools_any(called: list[str], wanted: list[str]) -> list[str]` — compares the part after `___`
  - Every function returns failure reasons (empty list = pass).

- [ ] **Step 1: Write the failing tests** in `evals/test_checks.py` (sys.path gets the app dir and `src/`):

```python
SEC = lambda t: {"type": "section", "text": {"type": "mrkdwn", "text": t}}
TABLE = {"type": "table", "rows": [[{"type": "raw_text", "text": "Entrance"}], [{"type": "raw_text", "text": "73,469"}]]}

def test_universal_passes_clean_output():
    assert checks.universal("Hello *Clemons*", [SEC("Hello *Clemons*"), TABLE]) == []

def test_universal_limits():
    assert any("table" in r for r in checks.universal("x", [TABLE, TABLE]))
    assert any("3000" in r for r in checks.universal("x", [SEC("a" * 3001)]))
    assert any("50" in r for r in checks.universal("x", [SEC("a")] * 51))
    assert any("rich_text" in r for r in checks.universal("x", [{"type": "rich_text"}]))

def test_universal_forbidden_text():
    for bad in ["**bold**", "| :--- |", "<thinking>x</thinking>", "the Media Outlets Policy",
                "Tool Error: Unknown tool: x"]:
        assert checks.universal(bad, [SEC(bad)]), bad

def test_visible_text_reaches_tables_fields_cards():   # Review Focus 1
    blocks = [TABLE, {"type": "section", "fields": [{"type": "mrkdwn", "text": "*Entries*\n544"}]},
              {"type": "card", "title": {"type": "plain_text", "text": "Rotunda"}}]
    vt = checks.visible_text(blocks)
    assert "73,469" in vt and "544" in vt and "Rotunda" in vt
    assert checks.phrases_all(vt, ["73,469", "Clemons"]) == ["missing phrase: 'Clemons'"]   # Review Focus 5
    assert checks.phrases_all("*Clemons* hours", ["Clemons hours"]) == []

def test_not_collapsed():
    answer = "Faculty accessibility remediation services: contact lib-a11y, captioning through coaa, subject liaison librarians help locate accessible readings, video resources guide"
    assert checks.not_collapsed(answer, "x", [SEC(answer)]) == []
    assert checks.not_collapsed(answer, "x", [SEC("Accessibility remediation services. Contact lib-a11y.")])

def test_tools_any_and_phrases_any():
    assert checks.tools_any(["OccupancyReportingRuntime___get_traffic_by_period"], ["get_traffic_by_period"]) == []
    assert checks.tools_any(["X___get_foot_traffic"], ["get_traffic_by_period"])
    assert checks.phrases_any("gold line arriving", ["Silver", "Gold Line"]) == []
    assert checks.forbid("Main Library hours", ["main library"])
```

- [ ] **Step 2: Run to verify it fails**

Run: `$V/bin/python evals/test_checks.py`
Expected: `ModuleNotFoundError: No module named 'evals.checks'` (or `checks`)

- [ ] **Step 3: Implement `evals/checks.py`**

Reason strings name the problem and value, e.g. `"2 table blocks (max 1)"`, `"section text 3001 chars (max 3000)"`, `"forbidden text: '**'"`, `"missing phrase: 'Clemons'"`, `"collapsed: 4/20 answer words visible (0.20 < 0.60)"`, `"none of tools called: ['get_traffic_by_period']"`. Stop list for `not_collapsed`: `about, after, their, there, these, those, which, would, could, should, while, where, other, please, information` plus words in the agent's own boilerplate if needed.

- [ ] **Step 4: Run to verify it passes**

Run: `$V/bin/python evals/test_checks.py`
Expected: `ok`

- [ ] **Step 5: Commit**

```bash
git add evals/__init__.py evals/checks.py evals/test_checks.py
git commit -m "feat(evals): shared check functions"
```

---

### Task 2: Case loading, offline replay, CLI (offline)

**Files:**
- Create: `evals/case.py`, `evals/offline.py`, `evals/run.py`
- Modify: `evals/test_checks.py` (add offline tests)

**Interfaces:**
- Consumes: Task 1 functions.
- Produces:
  - `evals/case.py`: `class CaseError(ValueError)`; `load_case(path: str) -> dict` (requires `id`, `question`, and `recorded` and/or `live`; `recorded` needs `steps: list` and `final_text: str`; defaults `history=[]`, `expect={}`); `load_cases(cases_dir: str, ids: list[str] | None = None) -> list[dict | CaseError]`; `@dataclass CaseResult(id: str, passed: bool, reasons: list[str], seconds: float = 0.0, tools: list[str] = field(default_factory=list), slack_text: str = "", skipped: bool = False)`
  - `evals/offline.py`: `run_offline(case: dict) -> CaseResult`
  - `evals/run.py`: `main(argv: list[str] | None = None) -> int`; flags `--offline`, `--live`, `--case ID` (repeatable), `--cases-dir` (default `evals/cases` beside run.py)

- [ ] **Step 1: Write the failing tests** (append to `evals/test_checks.py`; write a small synthetic case into a temp dir):

```python
CASE = {"id": "synthetic-entrance", "category": "occupancy", "question": "Clemons gate counts April by entrance in Excel",
        "recorded": {"model": "m", "final_text": "Here are the counts:\n\n| Entrance | In |\n| :--- | :--- |\n| Main | 73,469 |",
                     "steps": [{"tool_name": "OccupancyReportingRuntime___get_entrance_traffic", "status": "success", "input": {},
                                "output": "### Entrance Traffic Breakdown: Clemons\n\n| Entrance | In (Entries) |\n| :--- | :--- |\n| Main | 73,469 |"}]},
        "expect": {"phrases": ["73,469"], "attachment": True}}

def test_offline_replay_passes_and_builds_attachment():
    r = offline.run_offline(CASE)
    assert r.passed, r.reasons

def test_offline_reports_missing_phrase():
    bad = {**CASE, "expect": {"phrases": ["99,999"]}}
    r = offline.run_offline(bad)
    assert not r.passed and "missing phrase: '99,999'" in r.reasons

def test_live_only_case_skipped_offline():   # Review Focus 2
    r = offline.run_offline({"id": "live-only", "question": "q", "live": {"tools_any": []}, "history": [], "expect": {}})
    assert r.skipped and r.passed

def test_load_case_errors_and_cli_exit_codes():
    d = tempfile.mkdtemp()
    json.dump(CASE, open(os.path.join(d, "ok.json"), "w"))
    open(os.path.join(d, "broken.json"), "w").write("{nope")
    loaded = case.load_cases(d)
    assert sum(isinstance(x, case.CaseError) for x in loaded) == 1
    assert run.main(["--offline", "--cases-dir", d]) == 1                       # broken case fails the run
    os.remove(os.path.join(d, "broken.json"))
    assert run.main(["--offline", "--cases-dir", d]) == 0
    assert run.main(["--offline", "--cases-dir", d, "--case", "nope"]) == 2
```

- [ ] **Step 2: Run to verify it fails**

Run: `$V/bin/python evals/test_checks.py`
Expected: fails importing `offline` / `case` / `run`

- [ ] **Step 3: Implement `case.py`, `offline.py`, `run.py` (offline mode)**

`run_offline`: skip (passed, skipped) when no `recorded`; else format, then `universal` + `not_collapsed` (unless `allow_condensed`) + `phrases_all(expect.phrases)` + `forbid(expect.forbid)` over `fallback_text + "\n" + visible_text(blocks)`; when `expect.attachment` is true: `wants_spreadsheet(question)` must be true, `tables_from_steps(steps)` non-empty, and `openpyxl.load_workbook(BytesIO(build_xlsx(tables)))` must have `len(tables)` sheets. Any exception inside → FAIL with `"exception: <type>: <msg>"`. `run.py` prints `PASS id` / `FAIL id: r1; r2` / `SKIP id`, then `N passed, M failed, K skipped`; exit 1 on any failure (including `CaseError`), 2 for unknown `--case` ids (print known ids). `--live` is wired in Task 4 (until then: print "live tier not implemented" and return 2).

- [ ] **Step 4: Run to verify it passes**

Run: `$V/bin/python evals/test_checks.py`
Expected: `ok`

- [ ] **Step 5: Commit**

```bash
git add evals/case.py evals/offline.py evals/run.py evals/test_checks.py
git commit -m "feat(evals): case loading, offline replay, CLI"
```

---

### Task 3: Trace → case generator

**Files:**
- Create: `evals/make_case.py`
- Test: `evals/test_make_case.py`

**Interfaces:**
- Produces (`evals/make_case.py`):
  - `build_history(trace: dict, traces: list[dict]) -> tuple[list[dict], list[str]]` — (history, warnings)
  - `scrub(trace: dict, history: list[dict], case_id: str, category: str) -> dict` — case dict with empty `expect` (`{"phrases": [], "forbid": [], "attachment": false, "allow_condensed": false}`) and `live: null`
  - `likely_names(text: str) -> list[str]`
  - `main(argv: list[str] | None = None) -> int` — `make_case.py TRACE --id ID [--category C] [--traces-dir DIR] [--out-dir evals/cases]`; refuses to overwrite an existing case (exit 1)

- [ ] **Step 1: Write the failing tests**

```python
def trace(ts, msg, reply, thread="111.1", turns=0, at="2026-09-30T12:00:00+00:00"):
    return {"started_at": at, "user_message": msg, "slack_text": reply, "final_text": reply, "history_turns": turns,
            "slack": {"user_id": "U1", "channel_id": "D1", "thread_ts": thread, "message_ts": ts},
            "model_id": "minimax.minimax-m2.5", "request_id": "r", "s3_uri": "s3://x", "system_prompt_hash": "h",
            "steps": [{"tool_name": "T___get_foot_traffic", "status": "success", "input": {"library": "Shannon"},
                       "output": "o" * 25000, "latency_ms": 5}]}

def test_scrub_drops_ids_and_caps_output():
    c = make_case.scrub(trace("1", "q", "a"), [], "id1", "occupancy")
    blob = json.dumps(c)
    for leaked in ("U1", "D1", "s3://", "request_id", "system_prompt_hash", "111.1"):
        assert leaked not in blob, leaked
    assert len(c["recorded"]["steps"][0]["output"]) == 20000
    assert c["expect"] == {"phrases": [], "forbid": [], "attachment": False, "allow_condensed": False}

def test_history_from_earlier_traces_in_thread():
    a = trace("1", "gate counts July", "July: 544", at="2026-09-30T12:00:00+00:00")
    b = trace("2", "Separate them by month", "…", turns=2, at="2026-09-30T12:05:00+00:00")
    other = trace("3", "unrelated", "x", thread="999.9", at="2026-09-30T12:01:00+00:00")
    hist, warns = make_case.build_history(b, [a, b, other])
    assert hist == [{"role": "user", "content": [{"text": "gate counts July"}]},
                    {"role": "assistant", "content": [{"text": "July: 544"}]}] and warns == []

def test_missing_history_warns_not_errors():   # Review Focus 4
    hist, warns = make_case.build_history(trace("2", "Previous month?", "x", turns=4), [])
    assert hist == [] and warns and "history" in warns[0]

def test_likely_names():
    assert make_case.likely_names("event with Doug Chestnut in September") == ["Doug Chestnut"]
    assert make_case.likely_names("Shannon Library and Clemons Library, Fine Arts") == []
```

- [ ] **Step 2: Run to verify it fails**

Run: `$V/bin/python evals/test_make_case.py`
Expected: `ModuleNotFoundError`

- [ ] **Step 3: Implement `evals/make_case.py`**

`likely_names`: regex for two+ consecutive capitalized words, minus an allow-list containing every word in library/place/route names (Shannon, Clemons, Fine, Arts, Music, Library, Brown, Science, Engineering, Harrison, Small, Special, Collections, Robertson, Media, Center, Scholars, Lab, Virgo, Gold, Line, Silver, Purple, New, York, Times, Rotunda, Darden, Law, School, Medical, Charlottesville, Downtown, Mall, Grounds, Central, Parking, Garage, University, Virginia, UVA, Atlantic, Monthly) and month/day names. `main` prints each warning to stderr.

- [ ] **Step 4: Run to verify it passes**

Run: `$V/bin/python evals/test_make_case.py`
Expected: `ok`

- [ ] **Step 5: Commit**

```bash
git add evals/make_case.py evals/test_make_case.py
git commit -m "feat(evals): trace-to-case generator with scrubbing"
```

---

### Task 4: Live tier and report

**Files:**
- Create: `evals/live.py`
- Modify: `evals/run.py` (wire `--live`)
- Test: `evals/test_live.py`

**Interfaces:**
- Consumes: Task 1 checks, Task 2 `CaseResult`/`load_cases`.
- Produces (`evals/live.py`):
  - `run_live(case: dict, agent) -> CaseResult` — `agent.process_message(question, conversation_history=history)` returns an object with `.text` and `.trace` (`.steps`, `.stop_reason`, `.tools_used()`)
  - `write_report(results: list[CaseResult], path: str) -> None`
  - `have_aws_credentials() -> bool` — `boto3.Session().get_credentials() is not None`
- `run.py --live`: loads `.env` like `test_bot_locally.py` (python-dotenv if present), exits 2 without credentials, builds `HooHelpAgent(gateway_client=GatewayMCPClient())`, runs cases with a `live` block sequentially, writes `evals/reports/live-YYYYMMDD-HHMMSS.md`, prints its path, returns 0.

- [ ] **Step 1: Write the failing tests** with fake agents (no network):

```python
class FakeTrace:
    def __init__(self, tools, stop="end_turn"):
        self.steps = [{"tool_name": t, "status": "success", "output": ""} for t in tools]; self.stop_reason = stop
    def tools_used(self): return [s["tool_name"] for s in self.steps]

class FakeAgent:
    def __init__(self, text, tools, boom_on=None): self.text, self.tools, self.boom_on = text, tools, boom_on
    def process_message(self, q, conversation_history=None):
        if q == self.boom_on: raise TimeoutError("gateway read timed out")
        return type("R", (), {"text": self.text, "trace": FakeTrace(self.tools)})()

LIVE = {"id": "bus", "question": "Shannon to Darden?", "history": [], "expect": {},
        "live": {"tools_any": ["find_bus_trip"], "phrases_any": ["Gold Line"], "forbid": [], "max_seconds": 90}}

def test_live_pass_and_fail_reasons():
    ok = live.run_live(LIVE, FakeAgent("Take the *Gold Line* from Central Grounds Garage", ["UVATransitRuntime___find_bus_trip"]))
    assert ok.passed, ok.reasons
    bad = live.run_live(LIVE, FakeAgent("Walk there.", ["X___get_walking_directions"]))
    assert not bad.passed and len(bad.reasons) == 2

def test_live_exception_fails_case_and_report_still_written():   # Review Focus 3
    agent = FakeAgent("Gold Line", ["UVATransitRuntime___find_bus_trip"], boom_on="boom")
    results = [live.run_live({**LIVE, "id": "a", "question": "boom"}, agent), live.run_live(LIVE, agent)]
    assert not results[0].passed and "TimeoutError" in results[0].reasons[0] and results[1].passed
    path = os.path.join(tempfile.mkdtemp(), "r.md")
    live.write_report(results, path)
    text = open(path).read()
    assert "| a | FAIL" in text and "| bus | PASS" in text and "Gold Line" in text
```

- [ ] **Step 2: Run to verify it fails**

Run: `$V/bin/python evals/test_live.py`
Expected: `ModuleNotFoundError`

- [ ] **Step 3: Implement `evals/live.py` and wire `run.py --live`**

`run_live`: time the call; format with `format_for_slack(text, use_llm=False, tool_steps=trace.steps)`; reasons = `universal` + `tools_any` + `phrases_any` (if non-empty) + `forbid` + `"took N s (max M)"` + `"stop_reason: X"` when not `end_turn`; exceptions → one reason `"exception: <Type>: <msg>"`. Report: header with timestamp/model id, table `| case | result | seconds | tools |`, then per case `## <id>`, question, reasons, and the Slack text in a fenced block.

- [ ] **Step 4: Run to verify it passes**

Run: `$V/bin/python evals/test_live.py && $V/bin/python evals/test_checks.py`
Expected: `ok` twice

- [ ] **Step 5: Commit**

```bash
git add evals/live.py evals/run.py evals/test_live.py
git commit -m "feat(evals): live tier with markdown report"
```

---

### Task 5: Starting case set

**Files:**
- Create: `evals/cases/*.json` (~40)

**Interfaces:**
- Consumes: `make_case.py` (Task 3), `run.py --offline` (Task 2).

- [ ] **Step 1: Generate offline cases from traces** with `make_case.py` (traces in `logs/session-traces/`; find each by its question text). Prefer the latest trace for each question. At minimum:

| id | question (trace) | expect |
|---|---|---|
| `gate-april-by-entrance` | "I need Gate counts for Clemons for April 2026. I need entries and exits separate." | phrases `73,469`, `76,224`; attachment false |
| `gate-april-formatted-like-march` | "I need the gate counts for April 2026 formatted like the March results" | phrases `149,693` |
| `gate-excel-daily-july` | "Can you give me daily counts for July 2026 in an Excel format?" | attachment true; phrases `544` |
| `gate-daily-shannon-week` | "I wouId like each individual day, not the total…" | phrases `400`, `352`, `420` (Aug 3–5 entries) |
| `gate-12-weeks-max-iterations` | "For Shannon Library, give me the total entries and total exits for each of the last 12 complete weeks…" | allow_condensed (documents the old max-iterations failure; universal checks only) |
| `occupancy-clemons-now` | "How full is the clemons library right now?" (latest) | phrases `Clemons` |
| `occupancy-dump` | any trace whose `final_text` contains `Coverage summary:` | allow_condensed |
| `compare-shannon-clemons` | "compare foot traffic and peak hours between Shannon and Clemons last week" | phrases `Shannon`, `Clemons` |
| `rooms-shannon-5-8` | "Is there a group study room free at Shannon from 5pm to 8pm tomorrow?" | phrases `318` |
| `equip-rmc` | "What equipment can I borrow or reserve at RMC?" | phrases `Cameras` |
| `hours-rmc` | "When is RMC open today?" (Sonnet-era) | phrases `Robertson Media Center` |
| `accessibility-remediation` | "Where should faculty to go to find out the options for accessibility remeidation…" | phrases `lib-a11y` |
| `catalog-heaven` | "I'd like to see if "Heaven" by Natsuoko…" | phrases `Kawakami` |
| `images-rotunda` | "do you have any images of the rotunda that you can show me?" | phrases `Rotunda` |
| `thread-previous-month` | "Previous month?" | history rebuilt; phrases `11,229` |
| `offtopic-sqrt` | "what is the square root of 63?" | phrases `7.937` |

Fill to ~40 with one or two more per spec category (events, NYT access, directions, ILL/policy, vending machines, Makerspace printers, Atlantic follow-ups, off-topic weather). For each, set `expect.phrases` only to facts present in that trace's `final_text`. Resolve every `likely_names` warning by keeping the case only if the name is public staff/event info already on the library website (e.g. an event presenter); otherwise skip that trace.

- [ ] **Step 2: Add live-only cases** (hand-written JSON, no `recorded`):

| id | question | live |
|---|---|---|
| `live-bus-shannon-darden` | "How do I get from Shannon to Darden by bus?" | tools_any `find_bus_trip`; phrases_any `Gold Line`, `Silver Line` |
| `live-bus-clemons-jpj` | "Which bus goes from Clemons to JPJ?" | tools_any `find_bus_trip` |
| `live-bus-gold-load` | "How crowded is the Gold Line right now?" | tools_any `get_bus_locations`, `get_bus_route` |
| `live-daily-shannon` | "Daily gate counts for Shannon for October 5-11, 2026" | tools_any `get_traffic_by_period`; phrases_any `2026-10-07`, `Oct 7`, `October 7` |
| `live-hours-health-sciences` | "When is the Health Sciences library open today?" | tools_any `get_library_hours`; forbid `Science & Engineering Library` |
| `live-excel-fine-arts` | "Give me daily gate counts for Fine Arts for July 2026 in Excel" | tools_any `get_traffic_by_period` |
| `live-lost-in-place` | "Do we have Lost in Place by Mark Salzman?" | tools_any `search_by_field`, `search_catalog`; phrases_any `Lost in Place` |
| `live-rooms-shannon` | "Any group study rooms free at Shannon tomorrow 3-4pm?" | tools_any `search_space_availability`, `list_space_items` |
| `live-offtopic-weather` | "what will the weather be on thursday" | forbid `°` |

Also add a `live` block (tools_any + phrases_any) to ~8 offline cases (gate counts, rooms, hours, catalog, images, policy, events, thread) so the live set is 15–20.

- [ ] **Step 3: Run the offline tier**

Run: `$V/bin/python evals/run.py --offline`
Expected: every case `PASS` or `SKIP`; summary `0 failed`. A FAIL means either a wrong `expect` (fix the case) or a real formatter regression (stop and report it — do not weaken the case).

- [ ] **Step 4: Commit**

```bash
git add evals/cases
git commit -m "test(evals): starting regression case set"
```

---

### Task 6: Deploy wrapper and docs

**Files:**
- Create: `scripts/deploy.sh`
- Modify: `.gitignore` (add `evals/reports/`), `README.md` (Regression evals section)

- [ ] **Step 1: Write `scripts/deploy.sh`** (`set -euo pipefail`, cd to the app dir): run `python evals/run.py --offline` (stop on non-zero); with `--live`, run `python evals/run.py --live`, then `read -r -p "Continue with deploy? [y/N] "` and exit unless `y`; then `sam build && sam deploy`. Use `${PYTHON:-python3}` so a venv can be passed.

- [ ] **Step 2: Verify the gate without deploying**

Copy one case into a fresh temp dir, break its expected phrase, and run the offline tier against it:
`D=$(mktemp -d) && cp evals/cases/offtopic-sqrt.json $D/ && sed -i '' 's/7.937/9.999/' $D/offtopic-sqrt.json && $V/bin/python evals/run.py --offline --cases-dir $D; echo "exit=$?"`
Expected: `FAIL offtopic-sqrt: missing phrase: '9.999'` and `exit=1` — the same non-zero exit stops `scripts/deploy.sh` at its first step.

- [ ] **Step 3: README + .gitignore**

README section: what the two tiers do, `python evals/run.py --offline`, `--live` (needs `.env` AWS creds; ~10–15 min; report path), `make_case.py` usage for new failures, `scripts/deploy.sh [--live]` as the way to deploy.

- [ ] **Step 4: Run the live tier once** (needs AWS creds in `.env`)

Run: `$V/bin/python evals/run.py --live`
Expected: report path printed; open it and confirm every case has a result line. Failures are findings to report, not blockers.

- [ ] **Step 5: Commit**

```bash
git add scripts/deploy.sh .gitignore README.md
git commit -m "chore(evals): deploy wrapper gated on offline tier; docs"
```
