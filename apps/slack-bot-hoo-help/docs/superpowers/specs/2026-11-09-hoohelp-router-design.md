# Hoo Helper: route each question to the prompt sections and tools it needs

Status: draft for review (2026-11-09)

## Goal

Send the model only the system-prompt sections and tool definitions a question needs, instead of all of them on every step, without answering worse. The aim is fewer input tokens (cost and latency) and less for the model to sift through. A smaller toolset also leaves fewer wrong tools to pick.

## Why

Measured on 2026-11-09:

- **Every model call sends about 21,000–27,000 input tokens** (median 27,500 across 131 calls over 5 days). A question takes 2–8 calls, and the same fixed bundle is resent each time.
- **The fixed bundle:**
  - The system prompt is about 7,400 tokens.
  - The tool definitions are about 13,200 tokens, plus the per-event Slack search tools:

| Tool group | Tools | ~Tokens |
| --- | ---: | ---: |
| GitHub | 21 | 6,080 |
| Library (hours, occupancy, spaces, events, directions) | 10 | 2,220 |
| Matomo | 7 | 1,260 |
| Catalog | 4 | 950 |
| Transit | 4 | 870 |
| Site / suggestions | 2 | 620 |
| Collections (archives) | 2 | 570 |
| Atlassian | 4 | 500 |
| Citation check | 1 | 160 |

- **Cost:** input tokens were about 60% of Hoo Helper's AWS cost.
- **GitHub alone is 46% of the tool tokens**, and few questions are about code.

## Decisions

1. **Domains, each a bundle** of prompt section(s) plus tool groups. The current prompt sections 1–10 already line up with tool groups:

| Domain | Prompt sections | Tools |
| --- | --- | --- |
| `library` | 1 (occupancy, hours, spaces, events, wayfinding) | Library |
| `catalog` | 2 (catalog), catalog guidelines | Catalog, citation check |
| `site` | 4 (website, policies, suggestions) | Site |
| `transit` | transit section | Transit |
| `archives` | 8 | Collections |
| `slack` | 6 | Slack search (when offered) |
| `atlassian` | 7 | Atlassian |
| `github` | 9 | GitHub |
| `stats` | 10 | Matomo |

2. **A core prompt is always sent** (about 1,500–2,000 tokens): who Hoo Helper is, Slack formatting, the grounding rules (no invented holdings or numbers, link rules, no bot caveats), the date and the file line. It's built from the same `SYSTEM_PROMPT_TEMPLATE` pieces, not rewritten.
3. **Routing happens once per question**, before the first model call. The same bundle is used for every step of that question.
4. **The router fails open.** When it's unsure, or errors, Hoo Helper sends everything, so no question is worse off than today.
5. **The model can widen the route itself.** A tiny `more_tools` tool (`domains: [...]`) adds a bundle for the rest of the turn. The model is told it exists, and what each domain covers, in one line per domain.

## Phases

### Phase 0: gate GitHub (small, ships first)

GitHub tools and prompt section 9 are offered only when the message or thread looks code-related:
- a keyword match (`github`, `repo`, `code`, `pull request`, `PR`, `commit`, `branch`, `issue` + `uvalib`, a `github.com/uvalib` link, file paths or extensions); or
- the thread has already used GitHub tools.

That saves about 6,000 tokens on most calls. It reuses the existing `ENABLE_GITHUB` wiring: `github_tools_for_env()` returns None for non-code turns. Measure with the live suite (GitHub cases must still pass).

### Phase 1: check Bedrock prompt caching for MiniMax

If Bedrock's prompt caching (cache points in Converse) works for `minimax.minimax-m2.5`, the core prompt and each bundle become cache prefixes, and repeated steps are billed at the cached-input rate. That stacks with routing.
- **Experiment:** one Converse call with a `cachePoint` after the system prompt, then the same call again. Read `usage.cacheReadInputTokens`.
- **If caching isn't supported,** routing alone carries the savings.

### Phase 2: the router

- **Keyword rules first.** Clear signals pick domains directly: hours/open/occupancy/busy → `library`; book/title/author/call number/Virgo/"does UVA have" or a pasted citation list → `catalog`; visits/pageviews/Matomo/annual report → `stats`; bus/route → `transit`; finding aid/papers/collection → `archives`; Jira/Confluence/ticket/page → `atlassian`; Slack/thread/channel → `slack`.
- **A small model call only when the rules find nothing or more than 3 domains.** Use a cheap Bedrock model, as the existing formatter does with Gemma. It returns JSON `{"domains": [...], "confident": true|false}`, with a 2-second timeout. A timeout or `confident: false` means everything is sent.
- **Follow-ups:** a short follow-up inherits the previous turn's domains, the same rule the existing `_needs_tools` uses. History is passed in so "previous month?" stays in `library`.
- **Logging:** the route is recorded in the session trace (`route: {domains, source: rules|model|fallback, more_tools: [...]}`), so misroutes show up in the log review.

## Components

- **`src/routing.py` (new):**
  - the domain table (prompt section keys, tool-name predicates);
  - `route(message, history) -> Route`;
  - the optional model call;
  - the `more_tools` tool.
- **`src/agent.py`:**
  - `_system_prompt` takes `domains` and renders the core plus the chosen sections;
  - `_merged_tool_config` filters gateway and local tools by domain;
  - the loop adds a bundle when `more_tools` is called.
- **`src/app.py`:** builds only the local tool sets for the chosen domains. This also avoids building GitHub and Atlassian clients for turns that don't use them.
- **Prompt template:** wrap sections in markers (e.g. `<!-- domain:catalog -->…<!-- /domain -->`) so rendering can select them. With all domains selected, the rendered prompt stays byte-identical to today's, which keeps the legacy-prompt test meaningful.

## Testing

- **Unit tests:**
  - the rules on a table of real questions from the log reviews, including multi-domain ones ("website traffic and its top pages", "hours and is Clemons busy");
  - fail-open on router errors and timeouts;
  - `more_tools` widening;
  - prompt rendering: all domains equals today's prompt, and a single domain contains the core plus that section;
  - tool filtering.
- **A routing eval:** run the existing offline and live cases with routing on, and report against routing off:
  - pass rate (it must not drop);
  - input tokens per call;
  - how often `more_tools` or the fallback fires.

  The full live suite runs once, per the live-eval budget, and is then used to decide whether to ship.
- **Phase 0 on its own:** the GitHub live cases plus a non-code sample, comparing token counts.

## Risks

- **Misroutes on mixed questions.** Mitigated by up to 3 domains, the fallback, `more_tools`, and trace logging. The eval measures it.
- **Latency of the model router:** 0.5–2 seconds when the rules can't decide, offset by smaller inputs on every following step.
- **The prompt drifting into per-domain copies.** Avoided by keeping one template, with section markers.

## Out of scope

- Different models per domain.
- Caching or reusing answers.
- Changing what each tool does.

## Open questions

1. Phase 0 (gating GitHub) is small and gives most of the tool savings. Ship it first, alone?
2. Which small model for the router fallback? The Gemma model already used for formatting, or another Bedrock option?
3. Should Slack search tools (per-event, used for "find that conversation") be routed too, or always offered when the event allows?
