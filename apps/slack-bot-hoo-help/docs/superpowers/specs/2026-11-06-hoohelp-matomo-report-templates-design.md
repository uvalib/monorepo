# Hoo Helper: standard Matomo report templates with Slack charts

Status: draft for review (2026-11-06)

## Goal

When someone asks Hoo Helper for a Matomo report, the answer comes back in a fixed, recognisable layout for that type of report, with Slack charts where a chart helps. The layout is the same every time, so this year's annual report can be compared line by line with last year's.

## Why

- The annual-report request (Jira) is answered each year by hand from Matomo, with a different shape each time. A fixed template makes it repeatable and auditable.
- Today the model rewrites Matomo tables into its own prose and tables. The numbers are right, but the layout varies from answer to answer, and long tables are hard to read in Slack.
- Hoo Helper already renders occupancy and foot-traffic answers as Slack charts and tables built by code from the tool output (`src/slack_blocks.py`, `blocks_from_tool_steps`). Matomo reports should work the same way.

## Decisions

1. **Templates live in code, not in the prompt.** Code turns each Matomo tool result into Block Kit tables and charts, as it does for occupancy. The model writes only a short summary (2–4 sentences: what stands out, what changed) and does not repeat the tables.
2. **The numbers come from the tool output only.** The renderer parses the tool's markdown tables; the model never retypes a number that ends up in a chart or table.
3. **One new tool, `matomo_annual_report`**, returns all the annual-report sections in one result, in a fixed order. The other report types reuse the existing tools, each with a fixed layout.
4. **Numbers are shown as Matomo reports them**, with no bot warning (decision of 2026-11-06). Notes about the data (tracking gaps, items Matomo groups as "Others") stay as footnotes.
5. **Only processed reports are requested** (monthly and daily parts, never `period=range`), so a report costs a handful of fast requests.

## Report types and layouts

Slack limits: at most **2 charts per message**, 20 categories per chart, 20-character labels, 50-character titles, 100 table rows. Long names are shortened in charts and shown in full in the table below.

| Asked for | Tool | Layout |
| --- | --- | --- |
| Annual report / "FY26 Virgo report" | `matomo_annual_report` (new) | See below: summary table, monthly line chart, collections bar chart and table, records table, notes |
| Traffic for a period, with a comparison | `matomo_traffic` | Comparison table; bar chart of visits and pageviews, this period against the comparison |
| Traffic for one period | `matomo_traffic` | Fields block (visits, pageviews, searches, average visit); no chart |
| Most-viewed collections | `matomo_virgo_collections` (collections) | Bar chart of the top 10 by visits; table of the top 15 with visits, item views and kind |
| Most-viewed records | `matomo_virgo_collections` (items) or `matomo_virgo_items` | Table: title, visits, format, access type; no chart |
| Top pages, entry or exit pages | `matomo_top_pages` | Table; no chart |
| One page | `matomo_page` | Fields block |

Only the first Matomo result in a turn that has a template is rendered as blocks; others stay in the model's text. Occupancy and Matomo never share a message in practice; if they do, the chart budget (2) goes to whichever renders first.

### Annual report template (`matomo_annual_report`)

Input: `fiscal_year` (e.g. `FY26`; July–June). Site: Virgo (39) only in this version. The previous fiscal year is always included for comparison.

Sections, in this order:

1. **Header**: "Virgo annual report — FY26 (July 1, 2025 – June 30, 2026), compared with FY25".
2. **Summary table**: visits, pageviews, searches, downloads; FY26, FY25, change %.
3. **Monthly visits (line chart)**: two series, FY26 and FY25, with x-axis labels Jul … Jun.
4. **Top collections (bar chart)**: the top 10 collections of kind "UVA collection" by visits. Licensed, HathiTrust and purchase-fund rows are left out of the chart, because the report highlights UVA's own collections.
5. **Collections table**: the top 15 of all kinds, with FY26 visits, FY25 visits, item views and kind.
6. **Top records table**: the top 10 records by visits (Virgo view events), with title, format and access type from the catalog.
7. **Notes (context block)**:
   - days with no recorded visits (tracking gaps, e.g. Nov 9–11, 2025);
   - how many visits Matomo grouped as "Others";
   - that kinds and access types follow a provisional rule.

Matomo requests: about 8, all from processed monthly or daily reports:

- `VisitsSummary.get` and `Actions.get` for both years (month multi-date);
- `Events.getAction` for collections in both years, and for items in FY26;
- `VisitsSummary.get` by day for FY26, to find the tracking gaps.

There are also up to 10 catalog lookups for the records, within the existing 15-second budget.

Tool output format: markdown with one `## <Section>` heading per section and a markdown table under each. The renderer parses it by heading. The model sees the same text, so it can still answer follow-ups from it.

## Components

- **`src/matomo_tools.py`**: `matomo_annual_report` tool (spec, handler, sections), reusing `_report`, `virgo_collections` helpers and `_lookup_details`. A section that fails says "unavailable" and the rest still render. The busy breaker applies.
- **`src/matomo_blocks.py`** (new): parsers and block builders for each Matomo tool result, using the chart and table helpers in `slack_blocks.py`. Kept apart from `slack_blocks.py`, which is already 1,200+ lines.
- **`src/slack_blocks.py`**: `blocks_from_tool_steps` calls the Matomo renderer for Matomo steps and shares the chart budget.
- **`src/agent.py`**: the prompt routes annual-report questions to `matomo_annual_report`. When a Matomo answer has tables and charts, it says to write a short summary and not repeat the tables.

Matomo text is untrusted: collection names and page labels go into table cells and chart labels as plain text only, never as links or mrkdwn.

## Testing

- Unit tests:
  - the annual-report sections, order, and previous-year comparison (fake client);
  - each renderer, for the blocks it produces from a recorded tool output: chart types, the 2-chart budget, label shortening, table rows;
  - a failed section;
  - untrusted text in labels.
- Offline eval: a recorded annual-report trace renders blocks.
- Live eval: "Give me the FY26 Virgo annual report" → `matomo_annual_report` is called, and the answer names FY26 and FY25. Run only this case and the Matomo cases (see the live-eval budget).

## Out of scope (this version)

- Annual reports for other sites (Library website).
- CSV or spreadsheet export of the report. The existing attachment feature could add this later.
- Bot-traffic filtering in the report. The segments only have data from July 2026 (raw logs are kept 3 months); they could become an optional column in FY27.

## Open questions

1. The collections chart shows only "UVA collection" kinds, and the table shows every kind. Is that the split the report wants?
2. Should Libra ETD count as a UVA collection in the chart? (It currently does, and it ranks first.)
3. Records: the top 10, or the top 20?
