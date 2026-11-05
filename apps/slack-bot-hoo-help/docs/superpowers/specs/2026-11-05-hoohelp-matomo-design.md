# Hoo Helper: Matomo web statistics (read-only) — design

**Date:** 2026-11-05 · **Status:** draft for review · **App:** `apps/slack-bot-hoo-help`

## Goal

Staff can ask Hoo Helper about Library website traffic and get answers from the Library's
Matomo server (`https://analytics.lib.virginia.edu/`):

- **Traffic summaries:** "How many visits did Virgo get in October compared with September?"
- **Top pages:** "What were the most-viewed pages on the Library site last month?"
- **One page:** "How is the hours page doing this semester?"
- **Virgo items:** "Which catalog items were viewed most last month, and what formats are they?"

**Success:**
- These questions are answered from Matomo, for any site the token can see, with the period
  and filters stated.
- Nothing can be written to Matomo.
- No visitor-level data (visit logs, IP addresses, user IDs, site-search terms) ever reaches an
  answer.
- A Matomo outage or a missing token only removes these tools.

**Related, not in this project:** the annual-report job (a fiscal-year Virgo count split by
UVA collection vs licensed and by format). It waits on the Jira ticket's answers (last year's
method and numbers, definitions). This project's Virgo-items tool is the first piece of it and
lets us try the definitions.

## What exploration showed (read-only, 2026-11-05)

- **Server:** Matomo 5.14.2, reachable from the internet (the Hoo Helper Lambda isn't in a VPC).
  The token has view access to 17 sites and no admin rights.
- **Virgo is site 39, "Virgo 4-prod"** (`v4.lib.virginia.edu`; the live site at
  search.lib.virginia.edu reports here). Site 1, "Virgo 3", has no traffic.
- **Virgo is a single-page app.** It tracks events (e.g. `Results / ITEM_DETAIL_VIEWED`,
  `PDF_LINK_PRESENTED`) and site searches as well as pageviews, so "actions" includes all three.
- **Item pages name their pool in the URL:** `/sources/<pool>/items/<id>`, where the pool is
  `uva_library` (catalog), `articles` (EDS), `hathitrust`, `images`, `legacy`, `worldcat`.
  Article ids start with the EBSCO database code (`a9h_`, `edsjsr_`, `bth_`…).
- **Format isn't in Matomo:** no custom dimensions, and page titles are mostly "Virgo". It has to
  come from the Virgo record.
- **Sustained automated sessions.** On 2026-10-15:
  - 122 of 9,403 visits made 94% of all actions and 98% of article-page hits.
  - Those visits averaged 23.6 hours and kept up about 4 actions a minute.
  - They ran about 271,000 distinct searches, most in Virgo's field syntax (`title: {…}`).
  - They came from 113 desktop Chrome browsers, all US, all direct entry.
  - An idle Virgo tab sent nothing for 5+ minutes, so this isn't the app re-firing in open tabs.
  - Matomo's own bot filtering only catches clients that identify as bots; scripts in a real
    browser aren't caught.
  - Excluding these visits flips the pool picture: catalog item views outnumber article views
    about 18 to 1 instead of 1 to 20.
- **Speed:**
  - Plain reports are fast (under a second; Matomo pre-processes them).
  - A filtered (segmented) report is slow the first time for a period: 7 s for a month of a
    simple segment, and over 120 s for one day of a new two-part segment. After that it's
    cached and instant.

## Decisions

| Question | Decision |
| --- | --- |
| Sites | Every site the token can view, by Matomo's name; "Virgo" means site 39 |
| Who can ask | Anyone who can ask Hoo Helper (aggregate web statistics only) |
| Automated sessions | Defined as **visits lasting 60+ minutes with 1,000+ actions** (constants). Reported separately by default, not silently removed |
| Fiscal year | July–June, named by the year it ends: FY26 = 2025-07-01 to 2026-06-30 |
| Data level | Aggregate reports only, through an allow-list of API methods |

## Design

### Credentials and switch

- **Token:** `/hoohelp/matomo/token` (SecureString). It is read once per container and kept in
  memory. It is sent only as `token_auth` in the POST body, never in a URL, so it can't reach
  access logs or Hoo Helper's own logs.
- **IAM:** the Lambda role gets `ssm:GetParameter` on `/hoohelp/matomo/*`.
- **Switch:** `ENABLE_MATOMO` (template parameter `EnableMatomo`, default false). If it is off,
  the token is missing, or the first call fails with 401/403, the tools aren't offered; this is
  logged once per container.

### Client (`src/matomo_client.py`, new)

- `api(method, **params) -> Any`:
  - POSTs to `index.php?module=API&method=…&format=JSON`.
  - The method must be on the allow-list below; anything else raises before any request.
  - Timeout: 40 s per call.
  - One retry on 429/5xx.
  - A Matomo error body (`{"result": "error", "message": …}`) becomes a `MatomoError` with the
    message.
- **Allow-list (read-only, aggregate):**
  - `SitesManager.getSitesWithAtLeastViewAccess`
  - `VisitsSummary.get`
  - `Actions.get`, `Actions.getPageUrls`, `Actions.getPageUrl`, `Actions.getEntryPageUrls`,
    `Actions.getExitPageUrls`, `Actions.getPageTitles`
  - Deliberately excluded:
    - `Live.*` (visitor log), `UserId.*`, any `Users*`/`*Manager.add|update|delete`;
    - `Actions.getSiteSearchKeywords`, because search terms are what people typed.
- **Cache:** results are cached in-process for 10 minutes by (method, params).
- **Sites:** the site list is cached for 1 hour. `resolve_site(name_or_id)` matches an id, an
  exact name, a case-insensitive name or a URL host. "Virgo" maps to site 39. An unknown name
  gives an error listing the sites.

### Dates (`resolve_period`)

All tools take `start_date`/`end_date` (YYYY-MM-DD) or `fiscal_year` (e.g. "FY26" or "2026").

- The end is capped at yesterday: today is incomplete.
- A range is sent as `period=range&date=start,end`.
- A whole calendar month or year is sent as `period=month` or `period=year`, because those are
  pre-processed and fastest.
- Each answer states the exact dates used.

### Automated sessions

- Constants:
  - `AUTOMATED_MIN_SECONDS = 3600`
  - `AUTOMATED_MIN_ACTIONS = 1000`
  - Segment `visitDuration>=3600;actions>=1000` (URL-encoded once, as Matomo expects).
- For **Virgo**, `matomo_traffic` and `matomo_virgo_items` run the plain report and the
  automated-sessions report. The answer shows the totals, the automated share ("122 visits,
  94% of actions, look automated: hours-long sessions with 1,000+ actions"), and the totals
  without them. Other sites show the plain report unless asked (`automated="show"`).
- `automated` argument: `"show"` (default for Virgo), `"exclude"` (only the totals without
  automated sessions), `"ignore"` (plain Matomo numbers only; default for other sites).
- **Slow first use.** If the segment report times out (40 s), the answer gives the plain
  numbers and says: "Matomo is still preparing the automated-session breakdown for this
  period; ask again in a few minutes."
- **Recommendation for the Matomo admin (outside this code):** a stored, pre-processed segment
  with this definition makes these reports instant for any period. The spec's code works with
  or without it: it calls the same segment string either way.

### Tools (`src/matomo_tools.py`, a LocalTools set)

Same `tool_specs()` / `handles()` / `call()` shape as the Atlassian and GitHub sets. Names start
with `matomo_`.

| Tool | Arguments | Returns |
| --- | --- | --- |
| `matomo_sites` | — | id, name and URL of every site |
| `matomo_traffic` | `site`, dates, optional `compare_start_date`/`compare_end_date`, `automated` | Visits, unique visitors, pageviews, site searches (count only), downloads, outlinks, bounce rate, average visit time; the comparison with change in % when given; the automated breakdown per above |
| `matomo_top_pages` | `site`, dates, `report` (`pages` default, `entry`, `exit`, `titles`), optional `path_prefix`, `limit` (default 10, max 50), `automated` | Ranked rows: page (URL path or title), pageviews, unique pageviews, average time, bounce/exit rate |
| `matomo_page` | `site`, `url_or_path`, dates | That page's pageviews, unique pageviews, average time on page, entries, exits; "no data" when Matomo has none |
| `matomo_virgo_items` | dates, optional `pool`, `limit` (default 10, max 20), `automated`, `details` (default true) | Item-page views by pool (catalog, articles, HathiTrust, images, other); the top items with view counts and, when `details`, title, format, library/location and access type from the Virgo catalog tool |

**Output and limits:**
- Every result starts with a line naming the site, the dates and the automated-session
  handling.
- Rows are capped at the limit; the result says when more exist.
- Numbers are formatted with thousands separators.

### Virgo item cross-reference

- Item rows come from `Actions.getPageUrls` under `/sources/<pool>/items/` (flat, sorted by
  hits). The id is the last path segment.
- **Lookup:** for the top `limit` items (max 20), Hoo Helper calls the gateway's
  `get_item_details` (`Catalog___get_item_details` on uvalib-mcp; the name comes from
  `tool_names.gateway_name`) with `item_id` and `pool_id`.
  - The tool is reached through the agent's gateway client, passed into `MatomoTools`.
  - Calls run 4 at a time, with a 20 s budget overall. Items not looked up in time are listed
    without details, and the answer says so.
- **Access type**, a provisional rule to be confirmed by the ticket answers:
  - `articles` pool → **licensed (EDS)**.
  - `hathitrust` → **HathiTrust**.
  - `images` → **UVA digital collection**.
  - `uva_library` with an online access link:
    - proxy, Ebook Central, Serials Solutions, Kanopy and similar vendor hosts → **licensed
      e-resource**;
    - UVA hosts (Avalon, IIIF, Libra, search.lib images) → **UVA digital**.
  - `uva_library` with only a shelf location → **physical (UVA collection)**.
  - Otherwise → **unknown**.
  - The rule's host lists are constants in one place, and the answer names them as provisional.
- **Format** is the record's own Format field (e.g. "Book", "Video, DVD", "EBook, Book,
  Online"), shown as given. Grouping formats into text/video/… waits for the ticket.

### Hoo Helper prompt

A short "Website statistics (Matomo)" section:

- **Routing:** questions about website visits, pageviews, top pages or "how is page X doing"
  go to the Matomo tools. Virgo usage goes to `matomo_virgo_items` and `matomo_traffic` with
  site Virgo.
- **What to state:** always give the dates and the automated-session handling from the result.
  Never present plain Virgo totals as human use without the breakdown.
- **Fiscal years:** run July–June; FY26 = July 2025–June 2026.
- **"Unique visitors"** over a range longer than a month are approximate in Matomo. Say so
  when quoting them.

### Security and privacy

- Matomo results are **untrusted text**: page URLs and titles come from visitors and the pages
  themselves. They're wrapped like Slack and Confluence results (`source="matomo"`).
- The link rules from the security work apply: only links from tool output or library hosts,
  and no previews. Page paths are shown as text paths, not links, unless the page is on a
  library host.
- No visitor-level methods, no site-search terms, no IPs (see the allow-list).
- The token never appears in logs, traces or tool output. The session trace records the tool
  input (site, dates), not the request.

## Error handling

| Case | Behaviour |
| --- | --- |
| Feature off, or token missing | Tools not offered; logged once |
| 401/403 | Tools not offered for the container; `matomo_auth_failed` logged with the status |
| Unknown site | Error listing the sites |
| Dates invalid, reversed, or in the future | Error naming the problem; future end dates are capped |
| Segment report timeout | Plain numbers plus the "still preparing" note |
| Other timeout or 5xx after retry | "Matomo didn't respond in time; try a shorter range or ask again shortly." |
| Matomo error message | Returned as `Error: <Matomo's message>` |
| Virgo lookup fails for an item | Item listed without details; the count of missing details is stated |

## Testing

- **Unit tests, with a fake Matomo transport and a fake gateway:**
  - allow-list: an unlisted method never sends a request;
  - token only in the POST body, never in the URL or logs;
  - site resolution: id, name, host, "Virgo", unknown;
  - dates: FY26, a month, a range, a future end capped, a reversed range;
  - the automated breakdown: shown, excluded, ignored, and the segment-timeout fallback;
  - top pages with a path prefix and limits;
  - one page with no data;
  - Virgo items: pool totals from URLs, the cross-reference with partial failures and the time
    budget, and every access-type rule;
  - the untrusted wrapping;
  - the feature-off and missing-token paths.
- **Live evals** (behind `HOOHELP_EVAL_MATOMO=1`, like GitHub):
  - "How many visits did Virgo get in October 2026?" → `matomo_traffic`; the answer mentions
    automated sessions.
  - "Top 5 pages on the Library CMS site last month" → `matomo_top_pages`.
  - "Most-viewed Virgo catalog items in October 2026 and their formats" →
    `matomo_virgo_items` with details.
  - "How many visits did the Library website get in FY26 so far?" → the dates are stated as
    2025-07-01 to yesterday.
- **After deploy:** a Slack smoke test.

## Rollout

1. Deploy with `EnableMatomo=false`, then switch it on. Approve before each deploy.
2. Run the live evals.
3. Ask the Matomo admin about a stored, pre-processed automated-sessions segment.
4. Share findings with the ticket owner, with the Virgo-items tool as a way to check
   definitions.

## Out of scope

- The fiscal-year annual-report job and its final definitions (licensed vs UVA, format groups).
- Writing to Matomo (segments, goals, annotations), and visitor logs.
- Charts. Text tables only for now; the existing chart blocks could be added later.
