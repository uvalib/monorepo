# Hoo Helper: check a whole citation list in one request, with a CSV/TSV download

Status: draft for review (2026-11-09)

## Goal

A librarian pastes a bibliography (up to 100 citations) and asks whether UVA has the items. Hoo Helper checks every citation in one request: no batching by hand, no "continue with 26–35". The answer is a table built from catalog results only, and the librarian can download it as CSV, TSV or Excel, in the same message or later in the thread.

## Why

- **2026-11-09:** a colleague checked 55 Haitian-art citations.
  - The model does one or two searches per citation, and has a limit of 8 steps per answer. So the colleague had to batch the list by hand, and four batches still stopped at the limit.
  - Items 26–55 were then "answered" from memory, with invented holdings, call numbers and links.
  - The colleague asked for a CSV four times. Hoo Helper could only paste raw text, and Slack then rejected that reply because it was too long.
- Raising the step limit doesn't solve it. 55 citations need about 80 searches. That's more than the 2-minute answer limit, and the search results would crowd the model's context. That costs more, and the model is more likely to lose track or invent results.
- The fixes already deployed (forced lookups, link grounding, author search) make small checks honest. This design makes large ones possible.

## Decisions

1. **A new local tool, `check_citations`.** The model passes the whole list in one call. The tool searches the catalog in parallel and returns one row per citation. The model only summarizes.
2. **Matching is done by code, not the model.** Every owned/not-owned verdict, call number and Virgo link in the table comes from a catalog result. When a match is uncertain, the row says so instead of guessing.
3. **The table is rendered by code**, like the Matomo reports: Slack table blocks, split across messages by `split_messages`. The model writes a 2–4 sentence summary and doesn't repeat the table.
4. **Files are built only from code-built tables**, never from the model's own markdown tables, so a download can't contain invented rows. A file can come from this turn's tool, or from the most recent code-built table posted earlier in the thread.

## `check_citations`

**Input:** `citations`, a list of strings (1–100), one per citation, as the person wrote them. The model splits a pasted list into items and keeps the person's numbering. An optional `start_number` (default 1) is used when the list continues an earlier numbering.

**Per citation:**

1. **Parse loosely:**
   - author surname: the text before the first period or comma;
   - title: the italic (`_…_`, `*…*`) or quoted part, or otherwise the segment after the author;
   - year: the first 4-digit year from 1500 to 2099.
2. **Title search:** `search_catalog` with `field=title` and the cleaned title.
3. **Matching** compares each result's normalized title words against the citation's:
   - **exact:** the citation's title words are at least 80% contained in the result title;
   - **likely — check:** at least 50% contained, or at least 40% with the same author surname and year;
   - **not found:** otherwise.
4. **Author search, when the title search finds nothing:** `search_catalog` with `field=author` and the surname.
   - A result that matches the title by the rules above is used as the match.
   - Otherwise the author's other holdings (at most 2 titles) go in an "Other editions or works by this author" column, so a translation or original edition (e.g. *Les Mystères du Vaudou* for Hurbon's *Voodoo*) is visible to the librarian, who decides.
5. **Searches:** at most 2 per citation; 8 run at a time; an overall time budget of 60 seconds. A citation not finished in time gets "not checked (timed out)", and the summary says how many.

**Output** (markdown, parsed by the renderer):

- First line: `Citation check — 55 citations: 18 held, 4 likely (check), 31 not found, 2 not checked`.
- A table: `| # | Citation | UVA has it? | Match | Location / call number | Virgo link | Other editions or works by author |`.
- Notes: auction catalogs, journal articles and single journal issues usually aren't catalogued as their own records, so "not found" for those means "check the journal or database".

**Safety:**
- Catalog text is untrusted, and is wrapped like other tool results.
- `check_citations` counts as a catalog tool: its Virgo links are trusted link sources, and its output is known text for the grounding check.
- Citation text comes from the user, so it is never treated as a link source.

**Errors:**
- A failed search makes that row say "search failed".
- Matomo-style busy handling doesn't apply. If the gateway is down, the tool returns one error line, as the other gateway tools do.
- More than 100 citations: the tool checks the first 100 and says how many are left.

## Rendering

- **New `src/citation_blocks.py`:** a header block with the first line, then the table as Slack table blocks of at most 25 rows each (Slack also caps a table at 10,000 characters). Each block is tagged `block_id` `citations_report…`.
  - Long citations are cut to 120 characters in the table; the file has them in full.
  - Virgo links show as the record ID (plain text in the table cell).
- **`split_messages`** puts each table block in its own message. 55 citations come to about 3 messages, within the 4-message cap.
- **`format_for_slack`** treats `citations_report` blocks the way it treats Matomo blocks: it keeps the model's summary and drops its markdown tables.

## Files (CSV, TSV, Excel)

- **TSV becomes a format.** `file_format` recognises "tsv" / "tab-separated", and `FORMAT_NAMES` gets `"tsv": "TSV"`.
- **Same turn:** `check_citations` joins the table-producing tools (`TABLE_TOOLS`), so "check these and give me a CSV" attaches the file built from the tool's table: full citations, full links.
- **A later turn** ("csv please", "I want to download the csv"):
  - When no table tool ran in this turn, the file is built from the most recent code-built table in the thread.
  - Code-built tables are the ones carrying a code `block_id`: `citations_report`, `matomo_report`, or the occupancy and gate-count tables, which get a `data_table` id.
  - The thread reader keeps those blocks from earlier bot messages.
  - Model-written tables have no such id and are never exported.
  - If there's no code-built table in the thread, `file_context_line` tells the model no file can be made, so it says that rather than pasting raw CSV.
- **Excel:** the existing `build_xlsx` from the same tables.
- **The prompt** tells the model never to paste CSV or TSV as text when a file can be attached.

## Prompt

Add one line to the catalog guidelines:

> For a list of citations (a reading list or bibliography), call check_citations once with all of them (up to 100), keeping their numbering; then summarize in 2–4 sentences without repeating the table.

The existing "up to 5 catalog calls in one step" line stays, for when the tool isn't offered.

## Testing

- **Unit tests:**
  - parsing (author, title, year) on the 55 real citations from the 2026-11-09 thread (scrubbed);
  - matching thresholds: exact, likely, not found;
  - the author fallback and "other works";
  - the parallel budget and timeouts with a slow fake gateway;
  - 100+ citations;
  - the output format;
  - the renderer: 25-row tables, `block_id`s, and the split into messages;
  - untrusted text in citations and titles;
  - files: same turn, later turn from thread blocks, never from model tables, and TSV escaping (tabs and newlines in cells).
- **Offline eval:** a recorded `check_citations` trace renders tables, and a "csv please" follow-up attaches a file.
- **Live evals** (affected cases only):
  - a 10-citation list (Rodman *Miracle of Haitian Art* held; Hurbon *Voodoo* not found, with *Les Mystères du Vaudou* as another work; an auction catalog not found) calls `check_citations` once and finishes under 60 seconds;
  - "csv please" in the same thread attaches a CSV.

## Out of scope

- Checking other libraries or WorldCat, and interlibrary-loan links.
- Article-level checks in the articles (EDS) pool: journal articles stay "check the journal or database".
- Reading an attached .docx or .pdf bibliography. Pasted text only in this version; attachments could follow.
- PDF of a thread.

## Open questions

1. **Match thresholds:** 80% for "exact" and 50% for "likely" are a starting guess. Should "likely" rows be shown in the table, or listed separately for review?
2. **"Other works by this author":** useful for spotting translations, but noisy for prolific authors. Keep it at 2 titles, or show it only when no title match exists, as proposed?
3. **The 100-citation cap:** is that enough for a typical bibliography?
