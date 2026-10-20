# Hoo Helper Slack Search and Identity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoo Helper can search public Slack history (and read the thread around a hit), and knows who it is talking to and who said what in a thread.

**Architecture:** Bot-only change. `identity.py` resolves Slack users (cached `users.info`) for a system-prompt line, speaker labels and mention names. `slack_search.py` adds two in-process tools (like `wikipedia_tools.py`) that call `assistant.search.context` and `conversations.replies` with the bot token; `action_tokens.py` saves the per-thread `action_token` in DynamoDB so unmentioned follow-ups can search. `agent.process_message` gains per-turn extra context and per-turn local tools.

**Tech Stack:** Python 3.12, slack-bolt / slack_sdk `WebClient`, boto3 (DynamoDB, Bedrock Converse), AWS SAM.

**Spec:** `apps/slack-bot-hoo-help/docs/superpowers/specs/2026-10-20-hoohelp-slack-search-design.md`

## Global Constraints

- Branch `hoohelp-slack-search` in the monorepo. Commit **only explicit paths** under `apps/slack-bot-hoo-help/`; never `git add -A`, never `git stash` (other apps have uncommitted work).
- Tests are plain scripts that are also pytest-compatible (see `test_chime_in.py`): `sys.path.insert(0, …/src)`, `def test_*`, and an `if __name__ == "__main__":` block calling each test then `print("ok")`. Run with a venv:
  `V=<scratchpad>/venv; python3 -m venv $V && $V/bin/pip -q install boto3 -r requirements.txt` then `AWS_REGION=us-east-1 $V/bin/python test_<name>.py` → last line `ok`.
- No network in unit tests: Slack calls go through a fake client object, DynamoDB through a fake table.
- Public channels only. `read_slack_thread` must check the channel via `conversations.info` (`is_private` false, not `is_im` / `is_mpim`) because the bot token has `groups:history`.
- **Email is never put in the prompt**, even though `users:read.email` is granted. Pronouns only when set in the profile.
- The `action_token` value is never logged, never written to session traces; logs record only `action_token=present|reused|missing|expired`.
- Tool result text never starts with "Tool Error:" and never contains a stack trace.
- Feature flag `ENABLE_SLACK_SEARCH` (default `false`). Identity context is always on.
- DynamoDB table `hoohelp-action-tokens-<stage>`, TTL attribute `expires_at` = save time + 24 h.
- Slack search defaults: `channel_types=public_channel`, `content_types=messages`, default `score` sort; result text trimmed to ~400 chars; permalink always included.
- Exact copy for the no-token system-prompt line: `Slack search is unavailable in this thread until someone @mentions Hoo Helper again; say so only if Slack history would help answer.`
- Exact copy for an expired token result: `Slack search needs a fresh @mention in this thread.`
- Exact copy for a 429: `Slack search is busy, try again in a minute.`

## Rulings (decisions this plan makes where the spec is silent or the code disagrees)

- **No staging stack exists** (`samconfig.toml` has only `default`/prod). The spec's "enable in staging" becomes an allow-list: env `SLACK_SEARCH_ALLOW` (comma-separated channel ids and/or user ids). Empty = everyone (when the flag is on); set = only events in those channels or from those users. Cost if wrong: one env var to remove.
- **The current message is not labelled** with the speaker (the spec said it would be). `process_message`'s user text feeds the factual-query safety net, Excel detection and traces; a `[Name]:` prefix there is riskier than useful. The identity line already says who is asking. Cost if wrong: add the prefix in one place later.
- **`from_user` filters in the tool** (the spec's fallback) rather than relying on an undocumented `from:` modifier: request `limit=20`, keep hits whose author is that user, return up to the caller's `limit`. Cost if wrong: fewer hits for prolific users; the modifier can be tried later.
- **Unknown response fields:** `assistant.search.context` parsing tolerates missing keys, and the first successful search per container logs the sorted key names of one result (names only, no content) so the shape can be confirmed in week one.

## Review Focus

1. A thread where the bot was mentioned by one person and a different person follows up: the saved token is reused (keyed by thread, not by user).
2. A user with no `real_name` or a deactivated / bot user in thread history: labels fall back to display name, then the Slack id; never crash.
3. `read_slack_thread` given a permalink to a private channel the bot is in, or a DM link: refused, no `conversations.replies` call made.
4. DynamoDB throttled or missing table: treated as "no saved token", answer continues without Slack search.
5. `users.info` failing for every user (rate limit): no identity line, unlabelled history, answer still sent.

Each line has its test in the owning task (marked **RF1–RF5**).

---

### Task 1: User directory and identity line

**Files:**
- Create: `src/identity.py`
- Test: `test_identity.py`

**Interfaces:**
- Produces:
  - `class UserDirectory(client, *, ttl_seconds: int = 3600)` — wraps a Slack `WebClient`; module-level cache shared across instances (dict keyed by user id → `(expires, profile_dict)`), so a warm Lambda container reuses lookups.
  - `UserDirectory.get(user_id: str) -> Optional[UserInfo]`
  - `@dataclass UserInfo: user_id: str; real_name: str; display_name: str; title: str; pronouns: str; is_bot: bool` and property `label -> str` (real_name, else display_name, else user_id).
  - `UserDirectory.label(user_id: str) -> str` (falls back to the id).
  - `UserDirectory.find(name_or_id: str) -> Optional[str]` — accepts `U…` ids, `<@U…>`, `@name`, real or display name (case-insensitive); searches the cache first, then `users_list` (paged, cached for the TTL).
  - `identity_line(info: Optional[UserInfo]) -> str` — `""` when `info` is None.
  - `resolve_mentions(text: str, directory: UserDirectory, *, skip_ids: Iterable[str] = ()) -> str` — rewrites `<@U…>` and `<@U…|name>` to `@Label`.

- [ ] **Step 1: Write the failing tests** — fake client class with `users_info(user=…)` returning `{"user": {...}}` and counting calls; `users_list(cursor=…, limit=…)`.

```python
def test_identity_line_full_profile():
    info = UserInfo("U07ABC", "Pat Doe", "pat", "Assessment Librarian", "she/her", False)
    assert identity_line(info) == (
        "You're talking with Pat Doe (display name \"pat\"), Assessment Librarian, she/her — Slack id U07ABC. "
        "Use their name naturally and sparingly and their stated pronouns."
    )

def test_identity_line_without_pronouns_says_not_to_guess():
    line = identity_line(UserInfo("U1", "Sam Lee", "", "", "", False))
    assert "Sam Lee" in line and "U1" in line
    assert "pronouns aren't set" in line and "they/them" in line

def test_identity_line_never_contains_email():
    client = FakeClient({"U1": {"real_name": "Pat Doe", "profile": {"email": "pat@virginia.edu", "display_name": "pat"}}})
    assert "@virginia.edu" not in identity_line(UserDirectory(client).get("U1"))

def test_lookup_is_cached():
    client = FakeClient({"U1": {"real_name": "Pat Doe", "profile": {}}})
    d = UserDirectory(client); d.get("U1"); UserDirectory(client).get("U1")
    assert client.info_calls == 1

def test_lookup_failure_returns_none_and_label_falls_back():   # RF5
    d = UserDirectory(FailingClient())
    assert d.get("U9") is None and d.label("U9") == "U9" and identity_line(None) == ""

def test_label_falls_back_to_display_name_then_id():           # RF2
    client = FakeClient({"U2": {"real_name": "", "profile": {"display_name": "jj"}}, "U3": {"deleted": True, "profile": {}}})
    d = UserDirectory(client)
    assert d.label("U2") == "jj" and d.label("U3") == "U3"

def test_resolve_mentions():
    d = UserDirectory(FakeClient({"U1": {"real_name": "Pat Doe", "profile": {}}}))
    assert resolve_mentions("ask <@U1> or <@U1|pat>", d) == "ask @Pat Doe or @Pat Doe"
    assert resolve_mentions("<@UBOT> hi", d, skip_ids=["UBOT"]) == "<@UBOT> hi"

def test_find_accepts_ids_mentions_and_names():
    d = UserDirectory(FakeClient({"U1": {"real_name": "Pat Doe", "profile": {"display_name": "pat"}}}))
    assert d.find("U1") == d.find("<@U1>") == d.find("@pat") == d.find("pat doe") == "U1"
    assert d.find("nobody") is None
```

Clear the module cache between tests (expose `_reset_cache()` for tests).

- [ ] **Step 2: Run to verify failure** — `AWS_REGION=us-east-1 $V/bin/python test_identity.py` → `ModuleNotFoundError: identity`.
- [ ] **Step 3: Implement `src/identity.py`** per the Interfaces block. Profile fields: `user.real_name` or `profile.real_name`; `profile.display_name`; `profile.title`; `profile.pronouns`; `is_bot`; `deleted` users still get a `UserInfo` but with empty names (so label → id). Lookup errors are caught and logged at warning, returning None. The "not set" sentence: `Their pronouns aren't set — don't guess; use they/them.`
- [ ] **Step 4: Run** → `ok`.
- [ ] **Step 5: Commit**
```bash
git add apps/slack-bot-hoo-help/src/identity.py apps/slack-bot-hoo-help/test_identity.py
git commit -m "feat(hoohelp): Slack user directory and identity line"
```

### Task 2: Speaker labels in thread history; identity reaches the model

**Files:**
- Modify: `src/thread_context.py` (`extract_thread_history`)
- Modify: `src/agent.py` (`HooHelpAgent._system_prompt`, `process_message`)
- Modify: `src/app.py` (`handle_user_query`, `_lazy_message` follow-up path)
- Test: `test_thread_context.py`, new `test_agent_context.py` (no network; stub gateway client)

**Interfaces:**
- Consumes: `UserDirectory`, `identity_line`, `resolve_mentions` (Task 1).
- Produces:
  - `extract_thread_history(..., directory: Optional[UserDirectory] = None)` — when given, human turns become `[Label]: text` with mentions resolved (bot's own id skipped); bot turns unchanged. Without it, behaviour is exactly as today.
  - `HooHelpAgent.process_message(user_message, conversation_history=None, *, request_id=None, slack_context=None, extra_context: Optional[List[str]] = None, local_tools: Optional["LocalTools"] = None)` — `extra_context` lines are appended to the system prompt after the date context (blank-line separated). `local_tools` is wired in Task 5; accept and ignore it here.
  - `HooHelpAgent._system_prompt(extra_context: Optional[List[str]] = None) -> str`.

- [ ] **Step 1: Write failing tests**

```python
def test_history_labels_speakers_and_resolves_mentions():
    client = FakeRepliesClient([
        {"user": "UA", "text": "<@UBOT> gate counts for Clemons?", "ts": "1"},
        {"user": "UBOT", "bot_id": "B1", "text": "Clemons: 9,206", "ts": "2"},
        {"user": "UB", "text": "thanks <@UA>!", "ts": "3"},
        {"user": "UA", "text": "and Shannon?", "ts": "4"},
    ], users={"UA": "Alex Kim", "UB": "Blair Roe"})
    hist, ours, _ = extract_thread_history(client, "C1", "1", bot_user_id="UBOT", bot_app_bot_id="B1",
                                           current_ts="4", directory=UserDirectory(client))
    assert hist[0]["content"][0]["text"] == "[Alex Kim]: gate counts for Clemons?"
    assert hist[1]["content"][0]["text"] == "Clemons: 9,206"
    assert ours

def test_history_without_directory_unchanged():
    # same messages, directory=None → first turn text "gate counts for Clemons?"

def test_history_labels_survive_lookup_failure():   # RF5
    # directory over a client whose users_info raises → "[UA]: gate counts for Clemons?"

def test_system_prompt_includes_extra_context():
    agent = HooHelpAgent.__new__(HooHelpAgent)  # avoid boto3/gateway construction
    p = agent._system_prompt(["You're talking with Pat Doe — Slack id U1."])
    assert p.endswith("You're talking with Pat Doe — Slack id U1.")
    assert "Current date context" in p
```

(The trailing user turn "thanks @Alex Kim!" is dropped by `sanitize_bedrock_history`'s existing "drop trailing user turns" rule when it precedes the current message; don't change that rule.)

- [ ] **Step 2: Run to verify failure** (`TypeError: unexpected keyword 'directory'` / `extra_context`).
- [ ] **Step 3: Implement.** In `app.handle_user_query`: build `directory = UserDirectory(client)`; `asker = directory.get(user_id)`; resolve mentions in `cleaned_text` (skip the bot id); pass `directory` to `extract_thread_history`; pass `extra_context=[identity_line(asker)]` (omit empty strings) to `process_message`. In `_lazy_message`'s thread follow-up path, pass the same `directory` to its `extract_thread_history` call. Leave `chime_in` untouched.
- [ ] **Step 4: Run** `test_thread_context.py`, the agent test, `test_chime_in.py`, `test_slack_format.py` → each `ok`; `python evals/run.py --offline` → all pass.
- [ ] **Step 5: Commit** the four modified/test files by path: `feat(hoohelp): label thread speakers and tell the model who is asking`.

### Task 3: action_token store

**Files:**
- Create: `src/action_tokens.py`
- Test: `test_action_tokens.py`

**Interfaces:**
- Produces:
  - `conversation_key(event: dict) -> Optional[str]` — `im`/`mpim` (`channel_type`) → `channel`; otherwise `f"{channel}#{thread_ts or ts}"`; None without a channel.
  - `token_from_event(event: dict) -> str` — `event.get("action_token")` or `(event.get("assistant_thread") or {}).get("action_token")` or `""`.
  - `class ActionTokenStore(table=None, *, table_name: Optional[str] = None, ttl_seconds: int = 86400, now=time.time)` — `table` is a boto3 `Table`-like object (`get_item`, `put_item`, `delete_item`); default built from `ACTION_TOKENS_TABLE`.
  - `ActionTokenStore.resolve(event: dict) -> str` — if the event carries a token: `put_item({"key", "token", "expires_at": int(now()+ttl)})`, log `action_token=present`, return it. Else `get_item`; return the token if found and `expires_at > now()` (log `reused`), else `""` (log `missing`). Any store exception → log warning `action_token=missing (store error: <ExceptionType>)` and return the event token or `""`.
  - `ActionTokenStore.expire(event: dict) -> None` — `delete_item`, log `action_token=expired`; swallow errors.

- [ ] **Step 1: Write failing tests** with `FakeTable` (dict-backed) and a fixed clock.

```python
def test_mention_saves_and_followup_reuses():
    s = store(); t = s.resolve({"channel": "C1", "ts": "100", "action_token": "tok-1"})
    assert t == "tok-1"
    assert s.resolve({"channel": "C1", "thread_ts": "100", "ts": "105", "user": "UB"}) == "tok-1"   # RF1: other user

def test_not_reused_in_another_thread_or_channel():
    s = store(); s.resolve({"channel": "C1", "ts": "100", "action_token": "tok-1"})
    assert s.resolve({"channel": "C1", "thread_ts": "200", "ts": "201"}) == ""
    assert s.resolve({"channel": "C2", "thread_ts": "100", "ts": "101"}) == ""

def test_dm_keyed_by_channel():
    s = store(); s.resolve({"channel": "D1", "channel_type": "im", "ts": "1", "action_token": "tok-d"})
    assert s.resolve({"channel": "D1", "channel_type": "im", "ts": "9"}) == "tok-d"

def test_newer_token_replaces():
def test_ttl_is_24h_and_expired_items_ignored():
def test_expire_deletes():
def test_store_errors_mean_no_token():          # RF4
    s = ActionTokenStore(FailingTable())
    assert s.resolve({"channel": "C1", "thread_ts": "1", "ts": "2"}) == ""
    assert s.resolve({"channel": "C1", "ts": "3", "action_token": "tok"}) == "tok"

def test_token_value_never_logged():
    # capture logging for the module at DEBUG; run resolve/expire with "tok-SECRET"; assert "tok-SECRET" not in output
```

- [ ] **Step 2: Run to verify failure.**
- [ ] **Step 3: Implement `src/action_tokens.py`.** Lazily create the boto3 table only when `table` is None and the table name is set; with no name, `resolve` returns the event token and never stores (local runs).
- [ ] **Step 4: Run** → `ok`.
- [ ] **Step 5: Commit** both files: `feat(hoohelp): save and reuse Slack action tokens per thread`.

### Task 4: Slack search tools

**Files:**
- Create: `src/slack_search.py`
- Test: `test_slack_search.py`

**Interfaces:**
- Consumes: `UserDirectory` (Task 1), `ActionTokenStore.expire` (Task 3).
- Produces:
  - Constants `TOOL_SEARCH = "search_slack"`, `TOOL_READ_THREAD = "read_slack_thread"`.
  - `class SlackSearchTools(client, *, action_token: str, asker_id: str, directory: UserDirectory, on_token_expired: Callable[[], None] = lambda: None)`.
  - `.tool_specs() -> List[dict]` — Bedrock `toolSpec`s; `search_slack` only when `action_token` is non-empty; `read_slack_thread` always.
  - `.handles(name: str) -> bool`, `.call(name: str, args: dict) -> str`.
  - `.search(query, from_user="", channel="", after="", before="", limit=10) -> str`
  - `.read_thread(permalink_or_ts, channel="") -> str`

`search_slack` spec description must say: public channels only; phrase the query as a question for best results; `from_user` accepts a name, `@name`, a Slack id or `me`; `after`/`before` are `YYYY-MM-DD`; use at most 2–3 searches per answer; cite channel, author and permalink. `read_slack_thread` description: pass a permalink from `search_slack`.

- [ ] **Step 1: Write failing tests** — `FakeSlack` records calls; `api_call("assistant.search.context", params=…)` returns canned JSON; `conversations_info`, `conversations_replies`, `chat_getPermalink` canned; option to raise `SlackApiError` with a given error code / 429.

```python
def test_search_request_is_public_messages_with_tokens():
    s, fake = tools(action_token="tok"); s.search("what did we decide about LibCal hours?")
    p = fake.last("assistant.search.context")
    assert p["action_token"] == "tok" and p["query"].startswith("what did we decide")
    assert p["channel_types"] == "public_channel" and p["content_types"] == "messages"

def test_results_show_channel_author_date_permalink():
    out = s.search("libcal hours")
    assert "#assessment" in out and "Pat Doe (U1)" in out and "https://uvalib.slack.com/archives/" in out

def test_from_user_me_filters_to_asker():
def test_unknown_from_user_copy():
    assert s.search("x", from_user="nobody") == 'I couldn\'t find a Slack user named "nobody".'
def test_after_before_become_unix_timestamps():
def test_private_or_unknown_channel_filter_refused():
def test_expired_token_calls_back_and_returns_copy():
    s, fake = tools(action_token="tok", error="invalid_action_token", on_expired=flag)
    assert s.search("x") == "Slack search needs a fresh @mention in this thread." and flag.called
def test_rate_limited_copy():
    assert s.search("x") == "Slack search is busy, try again in a minute."
def test_no_token_hides_search_tool():
    assert [t["toolSpec"]["name"] for t in tools(action_token="")[0].tool_specs()] == ["read_slack_thread"]
def test_read_thread_refuses_private_im_mpim():                # RF3
    for info in ({"is_private": True}, {"is_im": True}, {"is_mpim": True}):
        s, fake = tools(channel_info=info)
        assert "only read public channels" in s.read_thread("https://uvalib.slack.com/archives/G1/p1700000000000100")
        assert not fake.calls("conversations.replies")
def test_read_thread_labels_speakers():
def test_no_result_text_starts_with_tool_error():
```

Permalink parsing: `/archives/<CHANNEL>/p<16 digits>` → ts `"<first 10>.<last 6>"`; `thread_ts` query param wins when present.

- [ ] **Step 2: Run to verify failure.**
- [ ] **Step 3: Implement.** `assistant.search.context` via `client.api_call("assistant.search.context", params={...})` (no first-class slack_sdk method assumed). Treat any `SlackApiError` whose error code contains `action_token` or is `invalid_auth_token`/`token_expired` as expired → `on_token_expired()`. 429 → busy copy. Other errors → `Slack search didn't work just now ({code}).` Parse results defensively from `results.messages` (or `messages`) with keys tried in order: channel (`channel_name` / `channel.name` / channel id → `conversations_info`), author (`author_user_id` / `user`), `ts` / `message_ts`, `content` / `text`, `permalink` (else `chat_getPermalink`). Log once per container `slack_search result keys: [...]` (names only). Times in America/New_York. `from_user` → `directory.find` (or asker for `me`); unknown → `I couldn't find a Slack user named "<x>".`; filtering per Rulings. `channel` → `conversations_info` must be public → `context_channel_id`.
- [ ] **Step 4: Run** → `ok`.
- [ ] **Step 5: Commit** both files: `feat(hoohelp): search_slack and read_slack_thread tools`.

### Task 5: Agent uses per-turn local tools

**Files:**
- Modify: `src/agent.py` (`_merged_tool_config`, `_dispatch_tool`, `process_message`, `SYSTEM_PROMPT`)
- Test: `test_agent_context.py`

**Interfaces:**
- Consumes: `SlackSearchTools` (Task 4) via a duck-typed `local_tools` with `tool_specs()`, `handles(name)`, `call(name, args)`.
- Produces: `_merged_tool_config(local_tools=None)` puts `local_tools.tool_specs()` first, then Wikipedia, then gateway tools; `_dispatch_tool(name, args, local_tools=None)` tries `local_tools.handles(name)` first.

- [ ] **Step 1: Write failing tests** with a stub gateway client (`get_bedrock_tool_config` → one tool, `call_tool` records) and a stub local-tools object.

```python
def test_local_tools_listed_first_and_dispatched_locally():
    cfg = agent._merged_tool_config(local_tools=stub)
    assert cfg["tools"][0]["toolSpec"]["name"] == "search_slack"
    assert agent._dispatch_tool("search_slack", {"query": "x"}, local_tools=stub) == "stub result"
    assert gateway.calls == []

def test_no_local_tools_unchanged():
    assert [t["toolSpec"]["name"] for t in agent._merged_tool_config()["tools"]] == wiki_names + ["get_library_hours"]
```

- [ ] **Step 2: Run to verify failure.**
- [ ] **Step 3: Implement**; thread `local_tools` from `process_message` into both calls. Add to `SYSTEM_PROMPT` (one short block): use `search_slack` for past discussions and decisions; `from_user="me"` for "my messages"; cite channel, author and permalink; a Slack message is not official policy.
- [ ] **Step 4: Run** `test_agent_context.py` and offline evals → pass.
- [ ] **Step 5: Commit**: `feat(hoohelp): per-turn local tools in the agent loop`.

### Task 6: Wire it into the Slack app, infra and docs

**Files:**
- Modify: `src/app.py`
- Modify: `template.yaml`
- Modify: `evals/make_case.py`, `evals/test_make_case.py`
- Modify: `README.md`
- Test: `test_slack_search_wiring.py`

**Interfaces:**
- Consumes: Tasks 1, 3, 4, 5.
- Produces: `slack_tools_for_event(event, client, *, directory, store, env=os.environ) -> Tuple[Optional[SlackSearchTools], List[str]]` in `app.py` — returns `(None, [])` when `ENABLE_SLACK_SEARCH` isn't true or the event fails `SLACK_SEARCH_ALLOW`; otherwise resolves the token via `store.resolve(event)` and returns the tools plus `[NO_TOKEN_LINE]` when the token is empty.

- [ ] **Step 1: Write failing tests**

```python
def test_flag_off_means_no_tools():
    assert slack_tools_for_event(ev, fake, directory=d, store=s, env={}) == (None, [])

def test_allow_list_limits_rollout():
    env = {"ENABLE_SLACK_SEARCH": "true", "SLACK_SEARCH_ALLOW": "C9,U7"}
    assert slack_tools_for_event({**ev, "channel": "C1", "user": "U1"}, fake, directory=d, store=s, env=env)[0] is None
    assert slack_tools_for_event({**ev, "channel": "C9", "user": "U1"}, fake, directory=d, store=s, env=env)[0] is not None

def test_no_token_adds_prompt_line_and_hides_search():
    tools, extra = slack_tools_for_event(followup_without_token, fake, directory=d, store=empty_store, env=on)
    assert extra == ["Slack search is unavailable in this thread until someone @mentions Hoo Helper again; say so only if Slack history would help answer."]
    assert [t["toolSpec"]["name"] for t in tools.tool_specs()] == ["read_slack_thread"]

def test_make_case_warns_on_slack_tools():   # in evals/test_make_case.py
```

- [ ] **Step 2: Run to verify failure.**
- [ ] **Step 3: Implement.**
  - `app.py`: module-level `ActionTokenStore()`; in `handle_user_query` call `slack_tools_for_event` (after the directory exists), pass `local_tools` and `extra_context = [identity line] + extra` to `process_message`; `on_token_expired=lambda: store.expire(event)`.
  - `template.yaml`: `AWS::DynamoDB::Table` `HooHelpActionTokens` (`TableName: !Sub "hoohelp-action-tokens-${StageName}"`, `BillingMode: PAY_PER_REQUEST`, key `key` (S), `TimeToLiveSpecification: {AttributeName: expires_at, Enabled: true}`, `SSESpecification: {SSEEnabled: true}`); policy statement `dynamodb:GetItem`, `PutItem`, `DeleteItem` on that table's ARN only; env `ACTION_TOKENS_TABLE: !Ref HooHelpActionTokens`, `ENABLE_SLACK_SEARCH: !Ref EnableSlackSearch` (new parameter, `AllowedValues: ["true","false"]`, default `"false"`), `SLACK_SEARCH_ALLOW: !Ref SlackSearchAllow` (default `""`).
  - `evals/make_case.py`: if any step's `tool_name` is `search_slack` or `read_slack_thread`, add warning `trace includes Slack messages — keep only if the content is fine to commit`.
  - `README.md`: a "Slack search" section — what it does, the flag and allow-list, scopes it relies on (`search:read.public`, `users:read`, `channels:history`), the action-token rule, that traces now include Slack excerpts and display names, and that email is never sent to the model.
- [ ] **Step 4: Run** the new test, `evals/test_make_case.py`, all existing `test_*.py` that ran green before, offline evals → pass; `sam validate --lint` → valid.
- [ ] **Step 5: Commit** the listed files by path: `feat(hoohelp): wire Slack search behind ENABLE_SLACK_SEARCH`.

### Task 7: Eval cases

**Files:**
- Modify: `evals/case.py` (allow optional top-level `extra_context: [str]`)
- Modify: `evals/live.py` (pass `extra_context` to `process_message`)
- Create: `evals/cases/slack-decision-libcal.json` (offline: recorded `search_slack` step + answer citing channel/author/permalink)
- Create: `evals/cases/live-slack-no-token-history.json`, `evals/cases/live-slack-no-token-hours.json`
- Test: `evals/test_live.py`, `evals/test_checks.py` (case loading)

- [ ] **Step 1: Write failing tests** — `load_case` accepts `extra_context` (list of strings) and rejects a non-list; `run_live` passes it through (stub agent records kwargs).
- [ ] **Step 2: Run to verify failure.**
- [ ] **Step 3: Implement** the schema/runner change and write the cases:
  - `slack-decision-libcal` (offline): recorded step `search_slack` with two realistic hits (invented channel `#web-team`, author `Pat Doe (U1)`, permalinks under `https://uvalib.slack.com/archives/`); `expect.phrases`: `["#web-team", "Pat Doe"]`; `expect.forbid`: `["Tool Error"]`. Content is invented, not copied from real Slack.
  - `live-slack-no-token-history`: question "what did we decide in Slack about the LibCal hours change?", `extra_context` = the no-token line; `live.phrases_any`: `["@mention", "mention me", "@Hoo Helper"]`.
  - `live-slack-no-token-hours`: question "when is Clemons open today?", same `extra_context`; `live.tools_any`: `["get_library_hours"]`; `live.forbid`: `["@mention"]`.
- [ ] **Step 4: Run** `python evals/run.py --offline` → all pass (including the new case); eval unit tests → `ok`. (Live tier is report-only; run it at the end of rollout.)
- [ ] **Step 5: Commit** the listed files: `test(hoohelp): eval cases for Slack search`.

### Task 8: Rollout (needs the human)

- [ ] Deploy with defaults (`ENABLE_SLACK_SEARCH=false`) via `scripts/deploy.sh` — **ask before deploying**. Check one trace: identity line present, speaker labels correct, no email.
- [ ] Ask the user for their test channel id and their user id, then redeploy with `EnableSlackSearch=true SlackSearchAllow=<ids>` (**ask first**).
- [ ] Manual checks with the user: a private-channel-only phrase never returned; a new public message found; a follow-up in a mentioned thread logs `action_token=reused`; a thread with no mention gets the note only when relevant; the `slack_search result keys` log line confirms the parsed fields.
- [ ] Run `python evals/run.py --live` and share the report.
- [ ] With the user's go-ahead, redeploy with `SlackSearchAllow=""` (everyone). Merge/push only when asked.
