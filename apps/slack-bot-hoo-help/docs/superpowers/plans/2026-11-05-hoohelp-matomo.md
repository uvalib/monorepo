# Hoo Helper Matomo Web Statistics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoo Helper answers read-only questions about Library website traffic from Matomo (`https://analytics.lib.virginia.edu/`), including Virgo item views cross-referenced with Virgo records, with likely automated sessions reported separately.

**Architecture:** A small Matomo client (allow-listed methods, token from SSM in the POST body, cache) feeds a `MatomoTools` LocalTools set, like the Atlassian and GitHub sets. Virgo item rows are enriched through the gateway's `get_item_details`. It is wired into `app.py`, switched by `ENABLE_MATOMO`, and covered by unit tests and live evals.

**Tech Stack:** Python 3.12, `requests`, boto3 (SSM), AWS SAM/Lambda, pytest.

**Spec:** `apps/slack-bot-hoo-help/docs/superpowers/specs/2026-11-05-hoohelp-matomo-design.md`

All paths below are relative to `apps/slack-bot-hoo-help/`. Tests run with:

- `AWS_REGION=us-east-1 <venv>/bin/python -m pytest -q . evals`. The venv is at `/private/tmp/claude-505/-Users-dhc4z-workspace-monorepo-apps-slack-bot-hoo-help/99d64b49-f08c-4ffd-b297-9d203283e609/scratchpad/venv`; recreate it with `requirements.txt` plus pytest, boto3 and python-dotenv if it's missing. Baseline: 657 passed.
- `<venv>/bin/python evals/run.py --offline` (baseline: 46 passed, 0 failed, 25 skipped).

New test files import from `src/` the way the existing ones do: `sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))`.

## Global Constraints

- **Read-only, aggregate only.** The client refuses any method not in `ALLOWED_METHODS`:
  - `SitesManager.getSitesWithAtLeastViewAccess`
  - `VisitsSummary.get`
  - `Actions.get`, `Actions.getPageUrls`, `Actions.getPageUrl`, `Actions.getEntryPageUrls`, `Actions.getExitPageUrls`, `Actions.getPageTitles`
- **Token handling.**
  - Read from SSM `/hoohelp/matomo/token` (SecureString), once per container.
  - Sent only as `token_auth` in the POST body.
  - Never in a URL, a log line, a trace or tool output.
- **Switch:** `ENABLE_MATOMO` (template parameter `EnableMatomo`, default `"false"`).
- **Automated sessions.** Constants `AUTOMATED_MIN_SECONDS = 3600`, `AUTOMATED_MIN_ACTIONS = 1000`, and `AUTOMATED_SEGMENT = "visitDuration>=3600;actions>=1000"`. Pass the segment as a normal request param and let `requests` encode it once.
- **Virgo:** Virgo is site `39`. For Virgo, `automated` defaults to `"show"`; for other sites it defaults to `"ignore"`. Allowed values are `show`, `exclude`, `ignore`.
- **Fiscal year:** July–June, named by the end year. `FY26` (or `2026`) = 2025-07-01..2026-06-30.
- **Dates:**
  - The end is capped at yesterday, America/New_York.
  - A whole calendar month uses `period=month&date=YYYY-MM-01`.
  - A whole calendar year uses `period=year&date=YYYY-01-01`.
  - Anything else uses `period=range&date=start,end`.
- **Limits and caching:**
  - Client timeout: 40 s per call, with one retry on 429 or 5xx.
  - Result cache: 10 min, keyed on method plus params.
  - Sites cache: 1 h.
  - Cross-reference: at most 20 items, 4 at a time, 20 s overall budget.
- **Tool names:** `matomo_sites`, `matomo_traffic`, `matomo_top_pages`, `matomo_page`, `matomo_virgo_items`.
- **Untrusted text:** all `matomo_*` results are wrapped with `untrusted source="matomo"`.
- **Every result's first line** names the site, the dates (`YYYY-MM-DD to YYYY-MM-DD`) and the automated-session handling.
- **Exact copy, fixed by the spec:**
  - Segment timeout: `Matomo is still preparing the automated-session breakdown for this period; ask again in a few minutes.`
  - Other timeout: `Matomo didn't respond in time; try a shorter range or ask again shortly.`
- **Never send Slack messages. Deploy only with the user's approval** (Task 6).

## Review Focus

1. **A question naming a site loosely** ("the library website", "Virgo", "guides", "lib.virginia.edu"). Expected: sensible resolution, or a clear list of sites; never the wrong site silently. Pinned by `test_resolve_site_loose_names` (Task 2).
2. **A range that crosses today or the fiscal year so far** ("FY26 so far"). Expected: the end is capped at yesterday and the answer states it. Pinned by `test_fiscal_year_so_far_capped` (Task 2).
3. **The automated-session report times out, but the plain report works.** Expected: the plain numbers plus the "still preparing" sentence, never an error. Pinned by `test_traffic_segment_timeout_falls_back` (Task 3).
4. **Matomo labels containing markup or instructions** (page titles, odd URLs). Expected: wrapped as untrusted, shown as text, and URLs not on library hosts shown as paths. Pinned by `test_matomo_results_are_untrusted` (Task 5) and `test_top_pages_show_paths_as_text` (Task 3).
5. **Virgo lookups slow or failing for some items.** Expected: the items are still listed and the answer counts the missing details. Pinned by `test_virgo_items_partial_details` (Task 4).

---

### Task 1: Matomo client

**Files:**
- Create: `src/matomo_client.py`
- Test: `test_matomo_client.py`

**Interfaces:**
- Produces:
  - `ALLOWED_METHODS: frozenset[str]`.
  - `class MatomoError(Exception)`, with the message being Matomo's own text.
  - `class MatomoAuthError(MatomoError)`, with `.status: int`.
  - `class MatomoTimeout(MatomoError)`.
  - `class MatomoClient(token: str, *, base_url: str = "https://analytics.lib.virginia.edu/index.php", http=None, clock=time.monotonic)`, with:
    - `api(method: str, **params) -> Any`;
    - `sites() -> list[dict]`, returning `idsite` (int), `name` and `main_url`.

- [ ] **Step 1: Write the failing tests.** Use a fake `http` object whose `.post(url, params=, data=, timeout=)` records calls and returns scripted responses.
  - `test_unlisted_method_never_sends`: `api("Live.getLastVisitsDetails")` raises `MatomoError`, and the fake recorded 0 calls.
  - `test_token_only_in_body`: after `api("VisitsSummary.get", idSite=39, period="day", date="2026-10-15")`:
    - the recorded `data == {"token_auth": "T0K"}`;
    - `"T0K"` is in neither the URL nor the params;
    - `params["module"] == "API"`, `params["format"] == "JSON"`, `params["method"] == "VisitsSummary.get"`.
  - `test_matomo_error_body`: the body `{"result":"error","message":"Invalid date"}` raises `MatomoError("Invalid date")`.
  - `test_auth_statuses`: HTTP 401 and 403 raise `MatomoAuthError` with `.status` equal to the HTTP status.
  - `test_retry_once_on_5xx_and_429`: 503 then 200 succeeds with 2 calls; 503, 503 raises `MatomoError` after 2 calls.
  - `test_timeout`: the fake raises `requests.exceptions.Timeout`, so the call raises `MatomoTimeout`, and the call's `timeout == 40`.
  - `test_result_cache_10_minutes`: the same call twice gives 1 request. With the clock advanced 601 s, there are 2.
  - `test_sites_cached_1_hour`: `sites()` twice gives 1 request; after 3601 s, there are 2. `idsite` is an `int`.
  - `test_token_never_logged`: with `caplog` at DEBUG through every path above, `"T0K"` appears in no record.

- [ ] **Step 2: Run them and check they fail.** `pytest -q test_matomo_client.py`. Expected: FAIL, with no module named `matomo_client`.

- [ ] **Step 3: Implement** `src/matomo_client.py` with the interfaces above and the constants from Global Constraints. Use `requests.Session()` when `http` is None.

- [ ] **Step 4: Run** the full suite and check it passes.

- [ ] **Step 5: Commit** `src/matomo_client.py test_matomo_client.py` with the message `feat(hoohelp): read-only Matomo client (allow-listed methods, token in body, cache)`.

---

### Task 2: Sites, dates and constants

**Files:**
- Create: `src/matomo_report.py`
- Test: `test_matomo_report.py`

**Interfaces:**
- Produces:
  - Constants: `VIRGO_SITE_ID = 39`, `AUTOMATED_MIN_SECONDS`, `AUTOMATED_MIN_ACTIONS`, `AUTOMATED_SEGMENT`.
  - `@dataclass Period: period: str; date: str; start: datetime.date; end: datetime.date; capped: bool`, with a property `label -> "YYYY-MM-DD to YYYY-MM-DD"`.
  - `resolve_period(start_date: str = "", end_date: str = "", fiscal_year: str = "", *, today: datetime.date) -> Period`. Raises `ValueError` with a user-facing message.
  - `resolve_site(sites: list[dict], name_or_id: str) -> dict`. Raises `ValueError("Unknown site …; sites: <id> <name>, …")`.

- [ ] **Step 1: Write the failing tests.**
  - `test_fiscal_year`: `FY26` and `2026` both give start 2025-07-01, end 2026-06-30 and `period="range"`, with `today=2026-11-05`. `"FY 26"` and `"fy26"` work too.
  - `test_fiscal_year_so_far_capped`: `FY27` with `today=2026-11-05` gives end 2026-11-04 and `capped=True`, and the label ends with `2026-11-04`.
  - `test_whole_month_and_year`:
    - 2026-10-01..2026-10-31 gives `period="month"`, `date="2026-10-01"`;
    - 2025-01-01..2025-12-31 gives `period="year"`, `date="2025-01-01"`;
    - 2026-10-03..2026-10-20 gives `period="range"`, `date="2026-10-03,2026-10-20"`.
  - `test_bad_dates`:
    - start after end raises `ValueError`, with a message containing "before";
    - `"2026-13-01"` raises `ValueError`;
    - giving both fiscal_year and dates raises `ValueError`;
    - giving neither raises `ValueError`, with a message containing "dates or a fiscal year".
  - `test_resolve_site_loose_names`, with the 17 real sites from the exploration as a fixture:
    - `"39"` → 39; `"Virgo"` → 39; `"virgo 4-prod"` → 39; `"search.lib.virginia.edu"` → 39;
    - `"guides"` → 5 (Research Guides);
    - `"www.library.virginia.edu"` → 10 (Library CMS);
    - `"Library website"` → 10;
    - `"Tedium"` → 41;
    - `"nope"` raises `ValueError`, with a message listing `39 Virgo 4-prod`.

  Rules, in this order:
  1. a numeric id;
  2. an exact name, ignoring case;
  3. `virgo` → 39;
  4. `library website`, `library site` or `library cms` → 10;
  5. a URL host matching a site's `main_url` host, or `search.lib.virginia.edu` → 39;
  6. a single site whose name contains the query, ignoring case;
  7. otherwise an error.

- [ ] **Step 2: Run them and check they fail.**

- [ ] **Step 3: Implement** `src/matomo_report.py`.

- [ ] **Step 4: Run** the full suite and check it passes.

- [ ] **Step 5: Commit** with the message `feat(hoohelp): Matomo sites, fiscal-year dates and automated-session constants`.

---

### Task 3: MatomoTools — sites, traffic, top pages, one page

**Files:**
- Create: `src/matomo_tools.py`
- Test: `test_matomo_tools.py`

**Interfaces:**
- Consumes: Task 1 (`MatomoClient`, errors) and Task 2 (`resolve_period`, `resolve_site`, constants).
- Produces:
  - `TOOL_SITES = "matomo_sites"`, `TOOL_TRAFFIC = "matomo_traffic"`, `TOOL_TOP_PAGES = "matomo_top_pages"`, `TOOL_PAGE = "matomo_page"`, `TOOL_VIRGO_ITEMS = "matomo_virgo_items"`.
  - `class MatomoTools(client, *, gateway_call: Optional[Callable[[str, dict], str]] = None, v2: Callable[[], bool] = lambda: True, today: Callable[[], datetime.date] = <today in America/New_York>)`, with:
    - `tool_specs() -> list[dict]`, in the same Bedrock toolSpec shape as `atlassian_tools._spec`;
    - `handles(name) -> bool`;
    - `call(name, args) -> str`.
  - `matomo_tools_for_env(env=None, *, ssm_get=None, http=None, gateway_call=None, v2=None) -> Optional[MatomoTools]`. Same pattern as `github_tools_for_env`:
    - None when `ENABLE_MATOMO` isn't `"true"`, when the token is missing, or when the first `sites()` call raises `MatomoAuthError`;
    - logs `matomo tools off: …` once, and `matomo_auth_failed status=<n>` on 401/403;
    - retries setup after 10 minutes.

- [ ] **Step 1: Write the failing tests.** Use a fake client with scripted `api` results keyed on `(method, segment)`, and `today=2026-11-05`.
  - `test_specs_and_handles`: exactly the five tool names, all with object schemas, and `automated` has `enum ["show","exclude","ignore"]`. `matomo_virgo_items` is listed only when `gateway_call` is set, because it needs the catalog.
  - `test_sites_lists_ids_names_urls`.
  - `test_traffic_virgo_shows_breakdown`:
    - Virgo for October makes a `VisitsSummary.get` and an `Actions.get` without a segment, plus a `VisitsSummary.get` with `segment=AUTOMATED_SEGMENT`.
    - The first line contains `Virgo 4-prod`, `2026-10-01 to 2026-10-31` and `automated sessions shown separately`.
    - The text has the totals (visits, unique visitors, pageviews, site searches, downloads, outlinks, bounce rate, average visit), the automated visits and share of actions with the phrase `hours-long sessions with 1,000+ actions`, and the totals without them.
  - `test_traffic_other_site_ignores_by_default`: no segment call is made, and the first line says `Matomo's numbers as reported`.
  - `test_traffic_exclude`: `automated="exclude"` shows only the without-automated totals, and the first line says `excluding likely automated sessions`.
  - `test_traffic_compare`: comparison dates add a column with the % change. Division by zero shows `—`.
  - `test_traffic_segment_timeout_falls_back`: the segment call raises `MatomoTimeout`. The output has the plain numbers and contains the exact segment-timeout sentence.
  - `test_traffic_timeout`: the plain call raises `MatomoTimeout`. The output is the exact "other timeout" sentence, prefixed `Error: `.
  - `test_top_pages`:
    - `report` `pages`, `entry`, `exit` and `titles` map to `Actions.getPageUrls`, `getEntryPageUrls`, `getExitPageUrls` and `getPageTitles`, each with `flat=1` and `filter_limit=limit`;
    - `path_prefix="/sources/uva_library/"` adds `filter_pattern` (a regex-escaped prefix);
    - `limit` defaults to 10 and is capped at 50;
    - rows show pageviews (`nb_hits`), unique pageviews (`nb_visits`), average time and bounce or exit rate;
    - the result says `more rows exist` when Matomo returned `limit` rows.
  - `test_top_pages_show_paths_as_text`:
    - a label `https://evil.example/x?d=1` is shown as the path `/x?d=1`;
    - a label on `www.library.virginia.edu` stays a full URL;
    - a label containing backticks or `<` is shown inside code formatting.
  - `test_page`: `url_or_path="/hours"` on site 10 makes an `Actions.getPageUrl` call with `pageUrl` set to the site's `main_url` plus the path; a full URL is passed as given. An empty result gives `No Matomo data for <path> in <dates>.`
  - `test_unknown_site_and_bad_dates_are_errors`: they return `Error: …` with the `ValueError` message.
  - `test_for_env_paths`:
    - with `ENABLE_MATOMO` unset, the result is None;
    - a missing token gives None and one log line;
    - `MatomoAuthError(401)` gives None and logs `matomo_auth_failed status=401`;
    - success returns an instance whose client was built with the SSM token.

- [ ] **Step 2: Run them and check they fail.**

- [ ] **Step 3: Implement** `src/matomo_tools.py`. Number format: `f"{n:,}"`. Average times as `m:ss`. Keep `matomo_virgo_items` as a stub returning `Error: not available` until Task 4, so specs and handles stay complete.

- [ ] **Step 4: Run** the full suite and check it passes.

- [ ] **Step 5: Commit** with the message `feat(hoohelp): Matomo tools — sites, traffic, top pages, one page`.

---

### Task 4: Virgo items and the catalog cross-reference

**Files:**
- Create: `src/virgo_access.py`
- Modify: `src/matomo_tools.py` (`matomo_virgo_items`)
- Test: `test_virgo_access.py`, `test_matomo_virgo_items.py`

**Interfaces:**
- Consumes:
  - Task 3 `MatomoTools(gateway_call=, v2=)`;
  - `tool_names.gateway_name("get_item_details", v2) -> str`.
- Produces:
  - `ACCESS_TYPES = ("physical (UVA collection)", "UVA digital", "licensed e-resource", "licensed (EDS)", "HathiTrust", "unknown")`.
  - `LICENSED_HOSTS: tuple[str, ...]` (host suffixes): `proxy1.library.virginia.edu`, `ebookcentral.proquest.com`, `serialssolutions.com`, `kanopy.com`, `ebscohost.com`, `jstor.org`, `oreilly.com`, `sciencedirect.com`, `springer.com`, `wiley.com`, `tandfonline.com`, `taylorfrancis.com`.
  - `UVA_DIGITAL_HOSTS`: `avalon.lib.virginia.edu`, `iiif.lib.virginia.edu`, `libra2.lib.virginia.edu`, `libraetd.lib.virginia.edu`, `search.lib.virginia.edu`.
  - `@dataclass ItemDetails: title: str; format: str; library: str; location: str; access_urls: list[str]`.
  - `parse_item_details(text: str) -> ItemDetails`. It reads the `# Item Record: <title>` heading and the `- **Format**:`, `- **Library**:`, `- **Location / shelf**:` and `- **Access online**:` lines, in the shape `get_item_details` returns today. `—` counts as empty.
  - `classify_access(pool: str, details: Optional[ItemDetails]) -> str`, one of `ACCESS_TYPES`.

- [ ] **Step 1: Write the failing tests.**
  - `test_parse_item_details`, with fixtures copied from three real outputs (abridged):
    - `u12618378` (Serials Solutions, "EBook, Book, Online");
    - `u13271543` (proxy and Ebook Central, call number present);
    - `a9h_59144255` (articles, Format line absent, so format is `""`).
  - `test_classify_access`:
    - `articles` → `licensed (EDS)`, whatever the details;
    - `hathitrust` → `HathiTrust`;
    - `images` → `UVA digital`;
    - `uva_library` with a proxy or serialssolutions URL → `licensed e-resource`;
    - `uva_library` with an Avalon URL → `UVA digital`;
    - `uva_library` with no access URL and a library other than `UVA Library` or `—` → `physical (UVA collection)`;
    - `uva_library` with details None → `unknown`;
    - any other pool → `unknown`.
  - `test_virgo_items_pool_totals`:
    - a fake `Actions.getPageUrls` (flat, `filter_pattern="/sources/[^/]+/items/"`) returns labels in two shapes, `/sources/uva_library/items/u1` and `search.lib.virginia.edu/sources/articles/items/a9h_2`;
    - the totals by pool (catalog, articles, HathiTrust, images, other) are summed from `nb_hits`;
    - the top items, within `limit`, are sorted by hits.
  - `test_virgo_items_details`:
    - with `gateway_call` faked, each top item gets exactly one call to `gateway_name("get_item_details", True)` with `{"item_id": id, "pool_id": pool}`;
    - each row shows title, format, library or location, access type and hits;
    - the result names the access rule as provisional, with the sentence `Access types follow a provisional rule (pool and access-link host) pending the annual-report definitions.`
  - `test_virgo_items_partial_details`: one gateway call raises and one sleeps past the budget (use an injectable budget in seconds and a fake clock). Both items are still listed with `details unavailable`, and the result says `2 items without details`.
  - `test_virgo_items_automated`: under `"show"` the pool totals appear plain and without automated sessions, from a second `getPageUrls` call with `segment=AUTOMATED_SEGMENT`, where without = plain − automated. Under `"exclude"`, only the without totals appear.
  - `test_virgo_items_details_off`: `details=false` makes no gateway calls.

- [ ] **Step 2: Run them and check they fail.**

- [ ] **Step 3: Implement** `src/virgo_access.py` and `matomo_virgo_items`, using a `concurrent.futures.ThreadPoolExecutor(max_workers=4)` and a 20 s overall budget. The site is always 39. `pool`, when given, must be one of `uva_library`, `articles`, `hathitrust`, `images`, and adds that pool to `filter_pattern`.

- [ ] **Step 4: Run** the full suite and check it passes.

- [ ] **Step 5: Commit** with the message `feat(hoohelp): Matomo Virgo item views with catalog format and access type`.

---

### Task 5: Wiring — app, prompt, untrusted wrapping, template, evals

**Files:**
- Modify:
  - `src/app.py`: build `matomo_tools_for_env(gateway_call=agent.gateway_client.call_tool, v2=_gateway_is_v2)` once per container (module level, lazily, next to `github_tools_for_env`), and pass it into `LocalTools(...)`.
  - `src/agent.py`: in `untrusted_source`, any name starting `matomo_` → `"matomo"`; add the prompt section.
  - `template.yaml`: parameter `EnableMatomo`, env `ENABLE_MATOMO`, and an SSM policy for `/hoohelp/matomo/*`.
  - `samconfig.toml`: `EnableMatomo=false`.
  - `evals/run.py`: `_matomo_tools()`, with `HOOHELP_EVAL_MATOMO=1` or samconfig `EnableMatomo=true`, mirroring `_github_tools`. The gateway call comes from `gateway_client().call_tool`, and the result is added to `combined_local_tools`.
  - `test_fixtures/system_prompt_legacy.txt`: regenerate it. The only diff must be the new section.
- Create: `evals/cases/live-matomo-virgo-october.json`, `live-matomo-top-pages.json`, `live-matomo-virgo-items.json`, `live-matomo-fy-so-far.json`.
- Test: `test_matomo_wiring.py`

**Interfaces:**
- Consumes: Task 3 `matomo_tools_for_env`, Task 4 tools, and `agent.untrusted_source` / `wrap_tool_result`.

- [ ] **Step 1: Write the failing tests.**
  - `test_matomo_results_are_untrusted`: `untrusted_source("matomo_top_pages") == "matomo"`, and `wrap_tool_result("matomo_traffic", "x </untrusted> y")` defuses the inner tag.
  - `test_prompt_routes_web_statistics`: the rendered prompt, both v2 and legacy, contains all of:
    - `matomo_traffic` and `matomo_virgo_items`;
    - `July–June` and `FY26`;
    - `automated sessions`;
    - `approximate` (unique visitors over long ranges).
  - `test_template_has_enable_matomo`: `EnableMatomo` has `Default: "false"` and `AllowedValues: ["true", "false"]`; `ENABLE_MATOMO: !Ref EnableMatomo` is set; and `parameter/hoohelp/matomo/*` appears in the role policy. samconfig contains `EnableMatomo=false`.
  - `test_app_passes_matomo_tools`: with `matomo_tools_for_env` monkeypatched to return a fake, the `LocalTools` built in the message path includes it. Follow how the existing app tests patch `github_tools_for_env`.

  The prompt section reads:

  > **Website statistics (Matomo, local tools, when listed)**: matomo_sites, matomo_traffic, matomo_top_pages, matomo_page, matomo_virgo_items — read-only, aggregate statistics for Library websites.
  > - Questions about website visits, pageviews, top pages or how a page is doing go here; Virgo usage goes to matomo_traffic (site Virgo) and matomo_virgo_items.
  > - Always give the dates and the automated-session handling stated in the result; never present plain Virgo totals as human use without the automated-sessions line.
  > - Fiscal years run July–June: FY26 is July 2025–June 2026.
  > - Unique visitors over ranges longer than a month are approximate in Matomo; say so when you quote them.

  Keep the tone bland (guardrail).

- [ ] **Step 2: Run them and check they fail.**

- [ ] **Step 3: Implement the wiring.** The four eval cases, each with `"live"` checks and `max_seconds` of 90:

  | Case | Question | `tools_any` | `phrases_any` | `forbid` |
  | --- | --- | --- | --- | --- |
  | `live-matomo-virgo-october` | "How many visits did Virgo get in October 2026?" | `["matomo_traffic"]` | `["automated"]` | `["isn't available right now"]` |
  | `live-matomo-top-pages` | "What were the top 5 pages on the Library CMS site in October 2026?" | `["matomo_top_pages"]` | — | — |
  | `live-matomo-virgo-items` | "Which Virgo catalog items were viewed most in October 2026, and what formats are they?" | `["matomo_virgo_items"]` | `["Format", "format"]` | — |
  | `live-matomo-fy-so-far` | "How many visits did the Library website get in FY27 so far?" | `["matomo_traffic"]` | `["2026-07-01"]` | — |

- [ ] **Step 4: Run** the full suite and the offline evals, and check both pass.

- [ ] **Step 5: Commit** the listed paths with the message `feat(hoohelp): Matomo tools wired in (off by default), prompt, evals`.

---

### Task 6: Deploy and verify (stop for approval before each deploy)

- [ ] **Step 1: Live evals locally first** (no deploy): `HOOHELP_EVAL_MATOMO=1 AWS_REGION=us-east-1 BEDROCK_GUARDRAIL_ID=2fn87od0qscu BEDROCK_GUARDRAIL_VERSION=5 <venv>/bin/python evals/run.py --live --gateway-url https://uvalib-mcp-lbfsinhgdo.gateway.bedrock-agentcore.us-east-1.amazonaws.com/mcp --case live-matomo-virgo-october --case live-matomo-top-pages --case live-matomo-virgo-items --case live-matomo-fy-so-far`. Expected: 4/4. Read each answer, and confirm the automated-sessions line is present for Virgo.
- [ ] **Step 2: Ask the user.** Then `sam build && sam deploy --no-confirm-changeset` with `EnableMatomo=false`. Confirm the Lambda's IAM policy includes `/hoohelp/matomo/*`.
- [ ] **Step 3: Ask the user.** Then set `EnableMatomo=true` in `samconfig.toml`, deploy, check the logs for `matomo tools on` and no `matomo_auth_failed`, and commit `samconfig.toml`.
- [ ] **Step 4: Run the full live suite** on the new gateway. Expected: no regressions against the last run (33/33).
- [ ] **Step 5: Ask the user for a Slack smoke question.** Read the session trace and confirm a `matomo_*` call with the dates stated.
