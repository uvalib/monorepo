# Router Phase 2: comparison results (2026-11-09)

## Runs

1. **Full live suite, routing on** (`live-20261109-160356`): 36/44 passed, 970,994 input tokens.
2. **The 8 failures plus 5 passing controls, routing off** (`live-20261109-160843`): 11/13 passed.
   - Two cases fail **with and without** routing, so they aren't routing problems: `live-hours-health-sciences` (the model picks the wrong library tool) and `live-jira-virgo4-recent` (a phrase is missing).
   - Six failures were **caused by routing**: 3 archives, 1 bus, 2 Confluence.
3. **After rule fixes, the six reran with routing on** (`live-20261109-161206`, `-161404`): all pass. `live-confluence-hold-policies` passed in one rerun and failed in another, so it's flaky.

## Input tokens on the same 13 cases

| Case | Routing on | Routing off | Change |
| --- | ---: | ---: | ---: |
| live-citation-check | 10,377 | 32,223 | −68% |
| live-lost-in-place | 11,713 | 33,554 | −65% |
| live-matomo-virgo-collections | 17,479 | 30,873 | −43% |
| rooms-shannon-5-8 | 13,607 | 31,480 | −57% |
| thread-previous-month | 13,269 | 31,113 | −57% |
| **All 13** | **240,267** | **486,409** | **−51%** |

Cases that pass both ways use 43–68% fewer input tokens. One misrouted case went the other way: `live-bus-gold-load` used +100%, because it widened the route with `more_tools` and then picked the wrong tool. After the rule fix it routes to transit directly.

## Misroutes and the rule fixes

| Question | Was routed to | Now routed to | Fix |
| --- | --- | --- | --- |
| "Do we have the president's private correspondence from 2024?" | catalog | archives, catalog | archives words: correspondence, letters, diaries, scrapbooks, oral histories, "records from the 1920s" |
| "do we have any nursing school records from the 1920s?" | catalog | archives, catalog | (same) |
| "Do we have letters describing a cholera outbreak?" | catalog | archives, catalog | (same) |
| "How crowded is the Gold Line right now?" | library | library, transit | transit: colour lines (Gold, Silver, …) |
| "How do I handle an Aeon print request?" | site | site, atlassian | staff-procedure words: doc, documentation, procedure, workflow, policies, "how do I handle", Aeon |
| "Where's the doc on hold policies?" | site | site, atlassian | (same) |

"Do we have …" now always adds catalog. When nothing else explains the question, it adds archives too.

## Decision

- **Token goal:** met, at −51% (the bar was −25%).
- **Pass rate:** the six routing-caused failures pass after the rule fixes. The two remaining failures fail the same way without routing.
- **Recommendation:** run **tomorrow's full live suite with `--routing on`**, as that day's one full run. If it reaches at least the routing-off pass rate (42/44, with the same two known failures), set `EnableRouting=true` and deploy, with approval.
- **Until then, routing stays off** (`EnableRouting=false`). Merging and deploying this branch changes nothing for users.

## Full routed run after the review fixes (2026-11-09, `live-20261109-164215`)

**41/44 passed; 904,429 input tokens (about 20,600 per case).**

| Failure | Also fails with routing off? | Notes |
| --- | --- | --- |
| live-hours-health-sciences | yes | The model's tool choice; known failure. |
| live-jira-virgo4-recent | yes | A phrase is missing; known failure. |
| live-confluence-aeon | no (passed once with routing off) | Routed correctly to Confluence, then hit the 8-step limit after many searches. It passed 3 of 4 routed runs today, and with routing off it used the most tokens of any case (89,269), so it's a long-search case at the edge of the step limit. |

**Result:** no misroutes remain. On the 13 cases run both ways today, routing used 51% fewer input tokens. A full routing-off run wasn't repeated today.
