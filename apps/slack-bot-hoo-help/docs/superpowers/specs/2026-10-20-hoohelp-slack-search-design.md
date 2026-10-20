# Hoo Helper: Slack search and knowing who it's talking to — design

**Date:** 2026-10-20
**Status:** Draft for review
**Repo:** `monorepo/apps/slack-bot-hoo-help` only
**Related:** `mcp-server/docs/superpowers/specs/2026-10-20-staff-knowledge-sources-design.md`
(Confluence and Jira — **on hold**; Slack portion superseded by this spec)

## Purpose

Staff ask Hoo Helper things that were settled in Slack: "what did we decide about
LibCal hours?", "who asked about the Clemons camera?", "find Jordan's message
about the gate-count fix". Today Hoo Helper can't search Slack, and it doesn't
know who it is talking to — thread history reaches the model as unlabelled turns
and mentions stay as raw `<@U…>` ids.

This adds:

1. **Slack search** over public channels, plus reading the thread around a hit.
2. **Identity context**: the model knows who is asking, who said what in the
   thread, and who a mention refers to — so "my messages", "Alex's message" and
   "Jordan said this in #assessment" work.

Success looks like: those questions return the right message with a working
permalink and the right author; nothing from a private channel, group DM or DM
is ever returned; and an unmentioned follow-up in a channel thread searches Slack
when it can, and says it needs an @mention only when Slack would actually help.

## Decisions (from brainstorming)

| Decision | Choice |
|---|---|
| Source | Slack's Real-time Search API, `assistant.search.context`, with Hoo Helper's **existing bot token** |
| Not used | Slack MCP server (user tokens only → service user + refresh), our own archive knowledge base |
| Content | Public channels only. All workspace users are staff (no guests/external users) |
| `action_token` | Saved per thread when Hoo Helper is mentioned or DM'd; reused for unmentioned follow-ups until it expires; then Hoo Helper says Slack search needs a fresh @mention, if relevant |
| Identity | Asker's name, display name, title, pronouns (if set) and Slack id in the system prompt; speakers labelled in thread history; mentions resolved to names |
| Atlassian | Confluence/Jira design kept, **on hold** |

Verified 2026-10-20:

- Bot token scopes include `search:read.public`, `search:read.files`,
  `search:read.users`, `users:read`, `channels:history`, `groups:history`
  (app reinstalled after adding the search scopes).
- `assistant.search.info` → `{"ok":true,"is_ai_search_enabled":true}`: not
  blocked as Enterprise Grid, and semantic search is enabled.

From Slack's docs (Real-time Search API):

- `action_token` arrives in `app_mention`, `message.im`, `message.mpim`, and in
  `message.channels` **only when the app is mentioned**. Bot-token calls require it.
- `search:read.public` covers all public channels in the workspace; the bot need
  not be a member.
- Semantic search triggers on question-shaped queries with the default `score`
  sort; otherwise keyword search.
- Rate limits: roughly 10+ requests/minute per workspace and 10/minute per user.
- Token lifetime is not documented.

## Architecture

All changes are in the bot. No new gateway, runtime, or Terraform.

```
 Slack event ─► app.py ─► identity.py (users.info, cached) ─► system prompt line
     │                      thread_context.py (speaker labels, mention names)
     │
     ├─► action_tokens.py ─► DynamoDB hoohelp-action-tokens (save / reuse / expire)
     │
     └─► agent.py ─► tool list = gateway tools + local Slack tools
                         search_slack ──► assistant.search.context (bot token + action_token)
                         read_slack_thread ──► conversations.info + conversations.replies
```

Local tools sit alongside the gateway tools: `agent._dispatch_tool` sends
`search_slack` / `read_slack_thread` to `slack_search.py` and everything else to
`GatewayMCPClient`, as today. (A general multi-source router is deferred with the
Atlassian work; this is a two-branch dispatch.)

Gated by `ENABLE_SLACK_SEARCH` (default `false`). Identity context is
always on (it is useful without search and has no new permissions).

## Identity context (`src/identity.py`)

**Who is asking**
- `users.info` for the event's `user`, cached in-process (LRU, ~1 h TTL).
- Adds one system-prompt line, next to the date context:
  `You're talking with Pat Doe (display name "pat"), Assessment Librarian, she/her — Slack id U07ABC.`
  Fields: `real_name`, `display_name`, `title`, `pronouns` (only if set in the
  profile). **Email is never included**, even though `users:read.email` allows it.
- If the lookup fails, the line is omitted (no error to the user).
- The model is told to use the person's name naturally and sparingly, to use
  their stated pronouns, and, where pronouns aren't set, not to guess (they/them).

**Who said what (thread history)**
- `extract_thread_history` labels each human turn with the speaker:
  `[Pat Doe]: what about Clemons?`. Bot turns are unchanged. The current message
  is labelled the same way.
- Consecutive human turns from different people stay separate messages labelled
  by speaker (merged only if Bedrock requires alternating roles, keeping labels).

**Mentions**
- `<@U…>` in message text (history and current message, excluding the bot's own
  mention, which is already stripped) is rewritten to `@Real Name` via the same
  cache.

**Unchanged:** the group-thread judge (`chime_in.py`) still sees only
"Person A/B" — it doesn't need names. Guardrails unchanged.

## Slack search tools (`src/slack_search.py`)

**`search_slack(query, from_user="", channel="", after="", before="", limit=10)`**
- Calls `assistant.search.context` with the bot token and the thread's
  `action_token`; `channel_types=public_channel`, `content_types=messages`,
  default `score` sort. The description asks for question-shaped queries (to
  trigger semantic search) and at most 2–3 searches per answer.
- `from_user`: a name, `@name`, Slack id, or `me` (the asker). Resolved to a user
  id via the identity cache / `users.list` lookup. Applied as a search modifier
  (`from:<@U…>`) — **to verify**; fallback: request more results and filter by
  author id in the tool.
- `channel`: name or id → `context_channel_id` (public channels only; a private
  or unknown channel is refused with a plain sentence).
- `after` / `before`: `YYYY-MM-DD` → Unix timestamps.
- Per hit: channel name, author `Real Name (U…)`, date/time (America/New_York),
  message text trimmed to ~400 chars, permalink. Ends with a "more results" hint
  when there are more.

**`read_slack_thread(permalink_or_ts, channel="")`**
- Parses a Slack permalink (or takes channel + ts), then **requires**
  `conversations.info` to report a public channel (`is_private=false`, not an
  IM/MPIM; archived public channels are fine). The bot token has
  `groups:history`, so this check — not the token — is what keeps private
  channels out. Refusal is a plain sentence.
- `conversations.replies` for the thread; returns dated, speaker-labelled lines
  with mentions resolved, capped like other tool output, plus the permalink.

**System prompt note:** use `search_slack` for past discussions and decisions;
pass `from_user="me"` for "my messages"; cite the channel, author and permalink;
don't present a Slack message as official policy.

## `action_token` reuse (`src/action_tokens.py`)

- **Save:** when an incoming event carries `action_token`, store it keyed by
  conversation — `channel#thread_root_ts` for channel threads (the thread root,
  or the message's own ts for a new top-level mention), the channel id for
  DMs/group DMs. A newer token replaces the old one.
- **Reuse:** for an event without a token, look up its conversation key.
- **Store:** new DynamoDB table `hoohelp-action-tokens-<stage>` (on-demand,
  server-side encryption, TTL attribute `expires_at` = save time + 24 h as a
  backstop since lifetime is undocumented). Lambda containers don't share memory,
  so in-process caching alone isn't enough.
- **Expiry:** Slack's rejection is the real signal. On a token error from
  `assistant.search.context` (exact code **to verify**), delete the item and
  return "Slack search needs a fresh @mention in this thread" for that call.
- **No usable token:** `search_slack` is left out of that turn's tool list and the
  system prompt gets one line — "Slack search is unavailable in this thread until
  someone @mentions Hoo Helper again; say so only if Slack history would help
  answer." `read_slack_thread` stays available (it uses only the bot token).
- **Handling:** the token is a credential — never logged, never written to session
  traces. Logs record only `action_token=present|reused|missing|expired`.

## Other bot changes

- `template.yaml`: the DynamoDB table; `dynamodb:GetItem/PutItem/DeleteItem` on
  that table only; env vars `ENABLE_SLACK_SEARCH`, `ACTION_TOKENS_TABLE`.
- `evals/make_case.py`: warn when a trace used `search_slack` /
  `read_slack_thread`, so a human decides before committing Slack content as an
  eval case. Existing name warnings already cover the new speaker labels.
- `README.md`: the feature, the flag, the scopes it relies on, and that session
  traces now include Slack excerpts and display names (same bucket, same access
  and retention).

## Error handling

| Situation | Behaviour |
|---|---|
| `users.info` fails | Identity line / label omitted; answer continues |
| No `action_token` for the thread | `search_slack` omitted; prompt line as above |
| `action_token` rejected | Item deleted; "needs a fresh @mention" result |
| Slack 429 | "Slack search is busy, try again in a minute" |
| Private / DM / unknown channel requested | Refused with a plain sentence |
| `from_user` not found | "I couldn't find a Slack user named …" |
| DynamoDB unavailable | Treated as "no saved token"; logged |

No result text starts with "Tool Error:"; no stack traces reach the model.

## Testing

**Unit**
- `identity`: prompt line fields (pronouns only when set, never email); cache
  hit/miss/TTL; lookup failure omits the line.
- `thread_context`: speaker labels on human turns, bot turns untouched, mentions
  resolved, bot mention still stripped.
- `action_tokens`: save on mention; reuse in the same thread; not reused in
  another thread or channel; DM keyed by channel; newer token replaces; rejected
  token deleted; TTL set; token value never appears in log output.
- `slack_search`: request shape (public only, bot token + action token);
  `from_user="me"` resolves to the asker; date conversion; result formatting with
  author and permalink; 429 message; `read_slack_thread` refuses private, IM and
  MPIM channels even when the token could read them.
- `agent`: `search_slack` absent from the tool list when there's no token, present
  when there is; the "needs an @mention" prompt line appears only without a token.

**Evals (offline replay, blocking)**
- "What did we decide about …" (Slack hit, cites channel/author/permalink).
- "Find my message about …" (`from_user="me"`).
- Multi-person thread: answer attributes earlier turns to the right person.
- Follow-up without mention and no token: mentions the @mention requirement for a
  Slack-history question, not for an hours question.
- Safety: "read my DMs" / "search #private-channel" → no private content, plain refusal.

**Manual rollout checks (staging, flag on)**
- A phrase that exists only in a private channel the bot is a member of is never
  returned by search or `read_slack_thread`.
- A brand-new public message is found.
- A follow-up in a mentioned thread reuses the token; log shows `reused`.
- The asker's name and pronouns appear correctly; nobody's email appears.

## Rollout

1. Deploy with `ENABLE_SLACK_SEARCH=false` (identity context goes live; check
   traces for correct names/labels).
2. Enable in staging; run the manual checks.
3. Enable in production; week one: review `action_token` present/reused/expired
   counts and search quality in traces; turn misses into eval cases.

## To verify during planning

- `assistant.search.context` response fields (permalink, channel, user, ts) and
  pagination cursor shape.
- Whether `from:<@U…>` works via `modifiers` / `term_clauses`, or needs the
  filter-in-tool fallback.
- Exact error code(s) for an expired or invalid `action_token`.
- `action_token` lifetime in practice (week-one counts).

## Out of scope (v1)

- Private channels, group DMs, DMs (bot-token search can't reach them anyway).
- Slack files and canvases (`search:read.files` is granted but unused for now).
- Posting, reacting, or any other write.
- Confluence and Jira (on hold — see the related spec).
