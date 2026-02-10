# Vibey (codename)

An agentic interface for those who love text.

Use text to coordinate agents. From your browser. Surrounded by a container.

## The concept

Think of a text-based agentic system as three things:

1. **Deed**: whatever final result you want to achieve. If it's code, the codebase, plus all of the data. If you're selling something, an interface to your CRM. If you're writing a game, your game.
2. **Docs**: a set of markdown pages that contain the specification of the deed: purpose, main entities, endpoints, constraints, core flows, coding standards. It also contains the list of things that need to be worked upon (ie: pending tasks).
3. **Dialogs**: the stream of consciousness of each agent. Most dialogs are complete, a few are ongoing for those agents that are working/alive *now*. A human can inspect at any time this stream of text, code changes and commands; a human can also enter the dialog. Some dialogs can be waiting for human input. When an agent completes its work, the dialog is no longer alive but it still is accessible.

The first two are stocks: things that accumulate with time. The last one is a flow: changes to the deed and the docs.

The core of all this is one doc, `doc-main.md.` This file contains:

- A description of the deed.
- Links to other docs.
- Instructions to agents that are picking up work. For example:
   - What permissions to ask for a human and what not to ask for.
   - Whether to use Claude Code, Codex, or whatever it is to spin an agent.
   - How many agents to spin at one time.
   - Standards of work and workflows.

Rather than hardcoding or customizing an agentic mesh, just describe it.

Vibey is not experimental. It is an experiment.

For the students of humanities stranded in the digital age: this is your chance to build a world with your words. Not cryptic commands, without the tens of hours of practice that are required to figure out misplaced semicolons. Describe your world and see it come to life, somewhat expensively.

## How can everything be markdown?

Well, everything except what you're building (unless you're building the Next American Novel). The state of the agents is also expressed in markdown.

What about versioning? You can save the project at any point and get out a zip file with a snapshot of the project at that time (docs only, docs + dialogs, everything).

We take great inspiration from Unix's "everything is a file": here, everything is text, except for the artifacts that your agents build, which might be something else than text.

## How can everything be running from your browser?

Browsers are wonderfully plastic and powerful interfaces. At this stage, vibey-server will also run locally. But, in the future, it's possible to envision vibey as a service, so that you don't have to deal with the server, and just express the system you want in pure text.

## Surrounded by a container?

Yes, so agents don't mess up your local environment too much.

## How does it look?

- Two tabs only:
   - Docs: lush markdown editing
   - Dialogs: lush visual of each dialog, with the possibility to interrupt it and converse with it.

Docs and dialogs are just markdown files in `vibey/`:
   - doc-<name>.md
   - dialog-<YYYYMMDD-HHMMSS (utc)>-<slug>-<status>.md

Note that the deed is missing; if it's code, go use your IDE, or just open your browser and use it, if it's running.

## Spec

### Server: static assets

`GET /` serves an HTML shell that loads normalize.css, tachyons, gotoB, marked.js, and `vibey-client.js`. `GET /vibey-client.js` serves the client.

### Server: files

All files live in a local `vibey/` directory, created on startup if missing. Filenames must match `[a-zA-Z0-9_\-\.]+`, end in `.md`, no `..`.

- `GET /files` — list all `.md` files, sorted by mtime descending.
- `GET /file/:name` — read file. Returns `{name, content}`.
- `POST /file/:name` — write file. Body: `{content}`.
- `DELETE /file/:name` — delete file.

### Server: dialogs (endpoints)

- `POST /dialog` — create a new dialog and run first turn. Body: `{provider, model?, prompt, slug?}`. Response: SSE.
  - Creates a file named `dialog-<YYYYMMDD-HHmmss>-<slug>-active.md`.
  - Stable `dialogId` is `<YYYYMMDD-HHmmss>-<slug>` (status is not part of the id).
  - Appends initial `## User` message, streams assistant (`chunk`), writes tool blocks.
  - If unauthorized tool requests remain, emits `tool_request`, sets status to `waiting`, ends stream.

- `PUT /dialog` — mutate or continue an existing dialog. Body: `{dialogId, status?, prompt?, decisions?, authorizations?}`.
  - `status` can be `waiting` or `done`.
  - If `prompt` is present, append as a user message and continue generation.
  - Whenever generation is kicked off on an existing dialog, server first sets status to `active`.
  - `decisions` is parseable text that maps tool-call IDs to approve/deny decisions.
  - `authorizations` is parseable text that records blanket authorizations (`> Authorized: <tool_name>` semantics).
  - If any tool decision is deny, resulting dialog status is `waiting`.
  - Response is SSE when generation continues; otherwise JSON.

#### Text conventions for `decisions` and `authorizations` (three-schwa sentinel)

Both fields use the same sentinel wrapper:

```
əəə
...lines...
əəə
```

`decisions` lines:

- Format: `<tool_call_id>: approve` or `<tool_call_id>: deny`
- Example:

```
əəə
toolu_abc123: approve
toolu_def456: deny
əəə
```

`authorizations` lines:

- Format: `allow <tool_name>` or `deny <tool_name>`
- Example:

```
əəə
allow run_command
allow edit_file
əəə
```

Parsing rules:
- Ignore blank lines.
- Ignore lines starting with `#`.
- Unknown lines are ignored (non-fatal).

No separate pending endpoint is needed. UI/server derive pending tool requests directly by parsing dialog markdown.

SSE event types: `chunk`, `tool_request`, `done`, `error`.

### Client: files

Left sidebar lists all files with + New and × delete. Right side is a textarea editor. Cmd+S saves. Tracks dirty state, warns on close with unsaved changes. Deleting the currently open file clears the editor immediately. Loading a file that no longer exists silently deselects it.

### Server: dialog

Dialogs are files named:

`dialog-<YYYYMMDD-HHmmss>-<slug>-<status>.md`

Where `<status>` is one of: `active`, `waiting`, `done`.

Core markdown format:

```
# Dialog
> Provider: claude | Model: claude-sonnet-4-20250514
> Started: 2026-02-10T20:11:00Z

## User
message

## Assistant
response
```

Two implementations: Claude (Anthropic API, max_tokens 64000) and OpenAI. Both stream. Provider must be `claude` or `openai`. Server runs on port `CONFIG.vibeyPort` (default 3001).

### Client: dialogs

Left sidebar lists dialog files (those starting with `dialog-`). Right side is a chat view: messages parsed from the file, rendered as bubbles.

Input area: provider select (Claude/OpenAI), textarea (Cmd+Enter to send), Send button. During streaming, partial response shown with block cursor. Input is disabled while streaming or while dialog state is `waiting` with pending tool decisions.

User messages are rendered optimistically (shown immediately when sent).

Message usage/tokens are shown only when returned by the provider response; if usage is unavailable, nothing is printed.

Usage is stored in markdown as metadata lines at the end of each assistant section:

```
> Usage: input=123 output=456 total=579
> Usage cumulative: input=1200 output=3400 total=4600
```

Only write these lines when provider usage is actually available.

### Server: tools for dialogs

The LLM always receives four tools:

- `run_command` — run a shell command (30s timeout, 1MB max output). Use for reading files (`cat`), listing directories (`ls`), HTTP requests (`curl`), git, and anything else the shell can do.
- `write_file` — create or overwrite a file. Takes `{path, content}`. Bypasses the shell so content with quotes, backticks, template literals, etc. is written cleanly.
- `edit_file` — surgical find-and-replace. Takes `{path, old_string, new_string}`. `old_string` must appear exactly once in the file; if it appears zero times or more than once, the tool returns an error asking for more context. The LLM should read the file first (`cat` via `run_command`) before editing.
- `launch_agent` — spawn another top-level dialog (flat structure, no subagent tree). Takes `{provider, model, prompt, slug?}` and is equivalent to `POST /dialog`.

Tool definitions are written once and converted to both Claude and OpenAI formats.

**No server-side state.** All tool-call state lives in dialog markdown. The server reconstructs pending requests, authorizations, and decisions by parsing markdown each request.

#### Markdown format for tool requests

When the LLM requests tools, they are written to dialog markdown as blocks inside the assistant section. Each block includes the tool name and provider tool-call ID:

```
---
Tool request: run_command [toolu_abc123]

    {"command": "ls"}

---
```

After approval and execution:

```
---
Tool request: run_command [toolu_abc123]

    {"command": "ls"}

Decision: approved
Result:

    {"success": true, "stdout": "file1.txt"}

---
```

After rejection:

```
---
Tool request: run_command [toolu_abc123]

    {"command": "ls"}

Decision: denied

---
```

A block with no `Decision:` is pending.

#### Blanket authorizations

Authorizations are written inline in markdown:

```
> Authorized: run_command
```

Meaning: from that point onward in that dialog, that tool type is auto-approved.

When a new dialog is created (including via `launch_agent`), global authorizations from `doc-main.md` are copied into the new dialog header.

#### Tool-call flow

1. LLM emits tool calls. Server writes tool blocks to markdown.
2. Server parses authorizations from markdown.
3. Authorized (or pre-authorized) tools are executed immediately by the server.
4. Execution results are written to markdown (`Decision: approved` + `Result:`), then fed back to the LLM to continue.
5. Unauthorized tools are left pending (no decision written), dialog status becomes `waiting`, and stream ends with `tool_request`.
6. Human sends parseable decisions text (wrapped with `əəə` sentinel, by tool-call ID); server writes decisions/results into markdown and continues.

No separate tool-execution endpoint is needed in normal flow: once approved, the server can execute directly from the pending block data in markdown.

#### Parsing dialog for provider messages

`parseDialog` reconstructs API history from markdown:
- `## User` / `## Assistant` sections become text messages.
- Tool request blocks become assistant `tool_use`/`tool_calls` entries.
- Decided tool blocks become `tool_result`/`tool` messages.

Markdown is the source of truth. Restart-safe by design.

#### Endpoints

Dialog endpoints are defined near the top of the Spec section (right after file endpoints), to keep API discovery in one place.

### Client: tools for dialogs

When `tool_request` arrives, a panel shows each unauthorized tool call (name + summarized input). Large file payloads are redacted in UI (markdown remains full-fidelity).

User approves/denies by tool-call ID, optionally sets “Always allow” per tool type, then sends one `PUT /dialog` with parseable `decisions` text (+ optional parseable `authorizations` text), both wrapped in the `əəə ... əəə` sentinel convention. Server writes decisions/authorizations in markdown and continues.

## TODO

Goal: be able to build vibey with vibey itself.

Hi! I'm building vibey. See please vibey.md, then vibey-server.js and vibey-client.js.

- Remove pending tool calls from server memory. Have it written down in the markdown. When agreeing to execute from the dialog by human intervention, save that in the markdown of the dialog and resume the dialog.Also save blanket authorizations for the tool (let's say one per type) and have that available at the markdown. When a tool request comes from a dialog, the server checks if it was authorized or not in that dialog. If it was, it goes through, otherwise the dialog goes to pending. Also, when spinning the dialog, if there are global authorizations, put them right there from the beginning.
- Show the message you send before you receive the answer (right now it appears when the response from the server is complete).
- Hide (from the UI, not the markdown) the content of the files sent in the client (just say what file you sent), to avoid clogging the frontend.
- Diff suggest & diff apply: show them nicely: green for the +, red for the -.
- Show the times of messages (start & end, not per chunk), also show how many tokens consumed at the end of each message (as per the API response, no guessing), this is fun. Also cumulative tokens used for that dialog. Everything stored in the markdown! No state in the server.
- The fourth tool call being the spwaning of an agent! Specify which provider & model. It is just like a call to POST /dialog. No subagent, the structure is flat. Whatever every agent gets, this one also gets, plus what the spawning action sent (POST /dialog should support sending an initial prompt).
- Be able to interrupt an agent. That puts them in the "waiting" state. This requires a separate endpoint. Then the dialog goes to waiting state. There has to be a rename command run by the main agent directly. The dialog is resumed by the user sending another message to the LLM. The file is autorenamed by the server, not the main agent, since the one interrupting is the server.
- Possible dialog states: done, active, waiting (on human). Waiting means that a tool use is proposed, or that the LLM considers that they still need mor e human input (they can specify this through a convention that's also in the markdown). The status of a dialog is in its file name, its suffix is <status>.md.
- I'm deciding against a single dialog/main.md to keep track. We just look at active dialogs to see what chats are happening.
- Stop creating bla.md dialogs, we always need the status.
- Allow a user to stop the stream of a dialog. Also to mark it as done.
- Format: dialog-<YYYYMMDD-HHmmss>-<slug>-<status>.md
- remove pendingToolCalls memory and reconstruct pending tool requests by parsing dialog markdown each time
- Introduce a pseudo-tool name like request_human_input
- To get the ball rolling, just start one dialog and let agents spawn other agents based on the instructions. No need for a loop. When they start, agents can figure out what's necessary, if they need to spawn more or not.
