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

### Server: projects

Projects are directories under `vibey/`.

- `GET /projects` - list project names.
- `POST /projects` - create project. Body: `{name}`.
- `DELETE /projects/:name` - delete a project directory recursively.
  - If any dialog streams are active for dialogs in that project, they are aborted before deletion.

### Client: projects

Projects tab lists all projects with + New and × delete.

- Clicking a project opens its Docs tab.
- Deleting asks for confirmation and removes the project from disk.
- If the deleted project is currently open, client state resets and navigation returns to `#/projects`.

### Server: files

All files live inside a project directory `vibey/<project>/`. Filenames must match `[a-zA-Z0-9_\-\.]+`, end in `.md`, no `..`.

- `GET /project/:project/files` - list all `.md` files, sorted by mtime descending.
- `GET /project/:project/file/:name` - read file. Returns `{name, content}`.
- `POST /project/:project/file/:name` - write file. Body: `{content}`.
- `DELETE /project/:project/file/:name` - delete file.

### Client: files

Left sidebar lists all files with + New and × delete. Right side is a textarea editor. Cmd+S saves. Tracks dirty state, warns on close with unsaved changes. Deleting the currently open file clears the editor immediately. Loading a file that no longer exists silently deselects it.

### Server: dialogs

- `POST /project/:project/dialog/new` — create a waiting dialog draft. Body: `{provider, model?, slug?}`.
- `POST /project/:project/dialog` — create a new dialog and run first turn. Body: `{provider, model?, prompt, slug?}`. Response: SSE.
  - Creates a file named `dialog-<YYYYMMDD-HHmmss>-<slug>-<status>.md`.
  - Stable `dialogId` is `<YYYYMMDD-HHmmss>-<slug>` (status is not part of the id).
  - Appends a `## User` message with canonical payload format, opens `## Assistant`, streams `chunk` events.
  - If unauthorized tool requests remain, emits `tool_request`, sets status to `waiting`, ends stream.

- `PUT /project/:project/dialog` — mutate or continue an existing dialog.
  - Canonical body: `{dialogId, status?, prompt?, control?}`.
  - Transitional compatibility: server may still accept `{decisions?, authorizations?}`; canonical input is `control`.
  - `status` can be `waiting` or `done`.
  - If `status` is set without `prompt` or `control`, it is a pure status change (interrupt/mark done).
  - If `prompt` is present, append as `## User` and continue generation.
  - Whenever generation is kicked off on an existing dialog, server first sets status to `active`.
  - Response is SSE when generation continues; otherwise JSON.
- `GET /project/:project/dialogs` — list dialog files with `{dialogId, status, filename, mtime}`.
- `GET /project/:project/dialog/:id` — load one dialog.

SSE event types: `chunk`, `tool_request`, `done`, `error`.

### Dialog markdown: canonical convention

Dialogs are files named:

`dialog-<YYYYMMDD-HHmmss>-<slug>-<status>.md`

Where `<status>` is one of: `active`, `waiting`, `done`.

Canonical section shape (for `User`, `Assistant`, `Tool Request`, `Authorization`, `Tool Result`):

```md
## <Role>
> Id: <id>
> Time: <start_iso> - <end_iso>
> Resources: in=<n> out=<n> total=<n> tools=<n> ms=<n>

əəə<type>
<payload>
əəə
```

Rules:
- Markdown remains source of truth.
- All parseable payloads use schwa wrappers.
- `Resources` is always present. If provider usage is unavailable, use zeros.
- For one-shot user input, `start == end`.

Canonical dialog header:

```md
# Dialog
> DialogId: 20260216-201100-read-vibey
> Provider: openai
> Model: gpt-5
> Status: waiting
> Started: 2026-02-16T20:11:00Z
```

Canonical user input:

```md
## User
> Id: msg_20260216_201100_u1
> Time: 2026-02-16T20:11:00Z - 2026-02-16T20:11:00Z
> Resources: in=0 out=0 total=0 tools=0 ms=0

əəəinput/markdown
Please read vibey.md and summarize it.
əəə
```

If UI sends structured input, use JSON instead:

```md
əəəinput/json
{"text":"Please read vibey.md and summarize it."}
əəə
```

Canonical assistant output:

```md
## Assistant
> Id: msg_20260216_201101_a1
> Time: 2026-02-16T20:11:01Z - 2026-02-16T20:11:14Z
> Resources: in=123 out=456 total=579 tools=1 ms=12982

əəəoutput/markdown
Summary goes here.
əəə
```

Optional cumulative line (if desired):

```md
> Resources cumulative: in=1200 out=3400 total=4600 tools=14 ms=248392
```

### Server: tools for dialogs

The LLM always receives four tools:

- `run_command` - run a shell command (30s timeout, 1MB max output). Use for reading files (`cat`), listing directories (`ls`), HTTP requests (`curl`), git, and anything else the shell can do.
- `write_file` - create or overwrite a file. Takes `{path, content}`. Bypasses the shell so content with quotes, backticks, template literals, etc. is written cleanly.
- `edit_file` - surgical find-and-replace. Takes `{path, old_string, new_string}`. `old_string` must appear exactly once in the file; if it appears zero times or more than once, the tool returns an error asking for more context. The LLM should read the file first (`cat` via `run_command`) before editing.
- `launch_agent` - spawn another top-level dialog (flat structure, no subagent tree). Takes `{provider, model, prompt, slug?}` and is equivalent to `POST /project/:project/dialog`.

Tool definitions are written once and converted to both Claude and OpenAI formats.

**No server-side state.** All tool-call state lives in dialog markdown. The server reconstructs pending requests, authorizations, and decisions by parsing markdown each request.

#### Tool request/result canonical blocks

Pending request:

```md
## Tool Request
> Id: toolu_abc123
> Parent: msg_20260216_201101_a1
> Time: 2026-02-16T20:11:02Z - 2026-02-16T20:11:02Z
> Resources: in=0 out=0 total=0 tools=0 ms=0
> Tool: run_command
> Status: pending

əəətool/input/json
{"command":"ls"}
əəə
```

Status values: `pending | approved | denied | error`.

Approved result:

```md
## Tool Result
> Id: toolu_abc123
> Parent: msg_20260216_201101_a1
> Time: 2026-02-16T20:11:03Z - 2026-02-16T20:11:04Z
> Resources: in=0 out=0 total=0 tools=1 ms=812
> Tool: run_command
> Status: approved

əəətool/result/json
{"success":true,"stdout":"file1.txt"}
əəə
```

Denied result:

```md
## Tool Result
> Id: toolu_abc123
> Parent: msg_20260216_201101_a1
> Time: 2026-02-16T20:11:03Z - 2026-02-16T20:11:03Z
> Resources: in=0 out=0 total=0 tools=0 ms=0
> Tool: run_command
> Status: denied

əəətool/result/json
{"success":false,"error":"Denied by user"}
əəə
```

#### Unified control text (schwa)

Use one control grammar for per-call decisions and blanket authorizations.

Canonical `PUT /project/:project/dialog` payload field: `control`.

```txt
əəəcontrol/v1
toolu_abc123 approve
toolu_def456 deny
allow run_command
deny write_file
əəə
```

Parsing rules:
- Ignore blank lines.
- Ignore lines starting with `#`.
- Unknown lines are ignored (non-fatal).

Persist the control action in dialog markdown:

```md
## Authorization
> Id: auth_20260216_201103_1
> Time: 2026-02-16T20:11:03Z - 2026-02-16T20:11:03Z
> Resources: in=0 out=0 total=0 tools=0 ms=0
> Scope: dialog

əəəcontrol/v1
toolu_abc123 approve
allow run_command
əəə
```

#### Tool-call flow

1. LLM emits tool calls. Server writes `Tool Request` sections.
2. Server parses current authorizations from markdown.
3. Authorized tools execute immediately.
4. Results are written as `Tool Result` sections and fed back to the LLM.
5. Unauthorized tools remain pending; dialog becomes `waiting`; stream emits `tool_request`.
6. Human sends `control` text (`əəəcontrol/v1 ... əəə`); server writes authorization/decision effects and continues.

No separate tool-execution endpoint is needed in normal flow.

#### Parsing dialog for provider messages

`parseDialog` reconstructs API history from markdown:
- `## User` / `## Assistant` sections become text messages.
- `## Tool Request` sections become assistant `tool_use`/`tool_calls` entries.
- `## Tool Result` sections become `tool_result`/`tool` messages.

Markdown is the source of truth. Restart-safe by design.

### Client: dialogs

Left sidebar lists dialog files (those starting with `dialog-`). Right side is a chat view: messages parsed from the file, rendered as bubbles.

Input area: provider select (Claude/OpenAI), textarea (Cmd+Enter to send), Send button. During streaming, partial response shown with block cursor. Input is disabled while streaming or while dialog state is `waiting` with pending tool decisions.

User messages are rendered optimistically (shown immediately when sent).

Message resources/tokens are shown from each section's `> Resources:` metadata line.

### Client: tools for dialogs

When `tool_request` arrives, a panel shows each unauthorized tool call (name + summarized input). Large file payloads are redacted in UI (markdown remains full-fidelity).

User approves/denies by tool-call ID, optionally sets "Always allow" per tool type, then sends one `PUT /project/:project/dialog` with parseable `control` text wrapped in schwas.

Canonical control payload:

```txt
əəəcontrol/v1
toolu_abc123 approve
allow edit_file
əəə
```

Server writes authorization/decision outcomes in canonical markdown sections and continues.

#### Diff rendering for `edit_file`

When an `edit_file` tool call is displayed (pending or decided), the client renders a unified diff of `old_string` → `new_string`:

- Lines starting with `-` are shown in red (removed).
- Lines starting with `+` are shown in green (added).
- Context lines (unchanged) are shown in gray.

By default, only 3 context lines around each change are visible. A "Show full diff" toggle expands to all lines. This is purely a client rendering concern - the markdown stores the full `old_string` and `new_string` as-is.

#### Bootstrapping

There is no orchestration loop. To get the system going, the user starts a single dialog. That first agent reads `doc-main.md` and decides what to do - including spawning more agents via the `launch_agent` tool if needed. Each spawned agent is a flat, independent dialog that can itself spawn further agents.

## TODO

Goal: be able to build vibey with vibey itself.

Hi! I'm building vibey. See please vibey.md, then vibey-server.js and vibey-client.js, then vibey-test.js.

Please read the stack of libraries I use at `arch/gotoB.min.js` (it's not minified). That'll give you a style too.

The flows to implement:

Flow #1:

- I go to localhost:3001
- I appear on the projects tab.
- I create a new project.
- I appear on the Docs tab
- I go to the dialogs tab
- I open a new dialog, entering its name
- A file named dialog-<timestamp>-<name>-waiting.md is created, but I only see the name of the dialog. The status is shown as an appropriate icon. The entire name is seen, even if it makes the label larger.
- The dropdown for gpt5.3 is selected. I enter some text on the box below on the right (not a prompt window) and I send it and off the dialog goes. The request is to read vibey.md.
- I get a request to read the file and I authorize it.
- I get a LLM response. I can see tokens used, times of requests. The file sent is compacted, not shown fully. I can expand it (and re-contract it by clicking another button).
- I ask a question to the LLM which requires tool use (say a diff): please add a console.log at the top of vibey-server.js.
- The LLM asks for it and I need to authorize it. I authorize it once.
- The diff is applied. I can see it with a green background.

Flow #2:

- I appear on the Docs tab
- I click on main.md (which is, under the hood, doc-main.md).
- I can have a good editing experience of the file.
- I can save my changes.
- If I leave before saving my changes, I'm warned and can stay and then save.
- I can make more changes and discard them.

Flow #3:

- I write in main.md that I want to create a little game on my browser. A tictactoe, for example. And that two agents should work on it.
- I go to the dialogs tab.
- I start a new dialog to say "please start".
- The agent starts working, spawning another agent.

Flow #4:

- I open vibey, already with a project.
- I can delete the project.
- Any agents running in that project are stopped.
- The folder is deleted.

TODO:

- To get the ball rolling, just start one dialog and let agents spawn other agents based on the instructions. No need for a loop. When they start, agents can figure out what's necessary, if they need to spawn more or not. One agent reading main.md can decide to spawn more agents as tool calling.
- The fourth tool call being the spwaning of an agent! Specify which provider & model. It is just like a call to `POST /project/:project/dialog`. No subagent, the structure is flat. Whatever every agent gets, this one also gets, plus what the spawning action sent (`POST /project/:project/dialog` should support sending an initial prompt).
