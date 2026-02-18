# Vibey (codename)

An agentic interface for those who love text.

Use text to coordinate agents. From your browser. Surrounded by a container.

## Vibey in a nutshell

1. **Everything is a document**: your description of what you're building. The dialogs with AI while building it. Views of your app or images are embedded. A document as the gateway to everything.
2. **In your browser**: allows to see not just text, but images, audio, and embed little apps in your documents.
3. **Containerized**: so that the blast radius is reduced, with your local machine and also between apps.

All you need is an AI provider and to install vibey locally.

## Vibey cloud in a nutshell

*WARNING: vaporware, will only build if Vibey itself makes sense*

1. **Automatic infra**: accessible anywhere with a browser; put projects (containers) onto servers, proxy traffic from/to your apps, HTTPS (bring your DNS record), receive emails, vibey session cookies.
2. **Aligned pricing**: An annual subscription (30 USD?) that gives you access to key cloud providers priced at cost (Hetzner for VPS, Backblaze for files); calls to LLM APIs; email sending. You can also of course bring your own API keys or subscriptions.
3. **Zero lock-in**: the whole thing being open source, so you can always run the same thing yourself elsewhere, also in the cloud.

All you need is an AI provider, no need to install anything.

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

We can also embed things in markdown: images, audio, even mini-windows with dynamic views. But each main center is a document, a page, built around text.

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

## Dockerization

- For local vibey (all we have now), all dockers run on the host. Each with its own data volume.
- For hosted vibey, since it's Ubuntu, we'll do docker inside docker.

## Test flows

Flow #1:

- I go to localhost:3001
- I appear on the projects tab.
- I create a new project.
- I appear on the Docs tab
- I go to the dialogs tab
- I open a new dialog, entering its name
- A file named dialog-<timestamp>-<name>-waiting.md is created, but I only see the name of the dialog. The status is shown as an appropriate icon. The entire name is seen, even if it makes the label larger.
- The dropdown for gpt5.3 is selected. I enter some text on the box below on the right (not a prompt window) and I send it and off the dialog goes. The request is to read the first 20 lines of vibey.md.
- I get a request to read the file and I authorize it.
- I get a LLM response. I can see tokens used, times of requests. The file sent is compacted, not shown fully. I can expand it (and re-contract it by clicking another button).
- I ask a question to the LLM which requires tool use (say a diff): please create a little dummy.js file with a console.log on it.
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

- I write in main.md that I want to create a little game on my browser. A tictactoe, for example. And that two agents should work on it. The game should be simple client side gotoB, provide docs/gotoB.md. Also use a simple express on port 4000 to serve the static file.
- I go to the dialogs tab.
- I start a new dialog to say "please start".
- The agent starts working, spawning another agent.

Flow #4:

- I open vibey, already with a project.
- I can delete the project.
- Any agents running in that project are stopped.
- The folder is deleted.


## TODO

Goal: be able to build vibey with vibey itself.

Hi! I'm building vibey. See please vibey.md, then vibey-server.js and vibey-client.js, then docs/hitit.md (backend tests) and docs/gotoB.md (frontend framework).

- Debug flow 3 in test-server.
- Implement flow 3 in test-client.
- Flow 4 in test-client and test-server.
- Show s taken properly in the UI.
- A fifth tool that is that the server stops agents after a certain size of the token window, after a message is responded. The server auto-calls that tool. I want this to be specified in main.md or one of the files referenced in it.

### TODO vi mode

 Vi mode applies to the docs editor textarea and the chat input textarea. It's a client-side concern only — no server changes.

 ### Settings (rename Accounts → Settings)

 Rename the accounts tab/route to settings. Add vi mode toggle:

 ```
   Settings
   ├── API Keys (existing)
   ├── Subscriptions (existing)
   └── Editor
       └── [x] Vi mode
 ```

 Persisted in vibey/config.json alongside accounts:

 ```json
   {
     "accounts": { ... },
     "editor": {
       "viMode": true
     }
   }
 ```

 New routes:
 - GET /settings → returns accounts + editor config (merge current GET /accounts)
 - POST /settings → saves accounts + editor config (merge current POST /accounts)

 ### Store shape

 ```js
   B.store = {
     // ...existing...
     viMode: true,          // from settings
     viState: {
       mode: 'normal',      // 'normal' | 'insert' | 'command'
       pending: '',         // partial command buffer: 'd' waiting for 'w', '3' waiting for 'j', etc.
       register: '',        // yanked text
       lastSearch: '',      // for n/N
       message: ''          // bottom bar: "-- INSERT --", ":w", "3 lines yanked"
     }
   }
 ```

 ### Modes

 ```
     NORMAL ──── i/a/o/O ────► INSERT
       ▲                          │
       └──────── Escape ──────────┘
       │
       : ────────────────────► COMMAND
       ▲                          │
       └──────── Escape/Enter ────┘
 ```

 Normal mode: cursor movement, operators, mode switches. Textarea is readonly.

 Insert mode: textarea is editable normally. Show -- INSERT -- in status bar.

 Command mode: a one-line input appears at the bottom of the editor. Supports :w (save), :q (close file), :wq (save + close).

 ### Keymap: Normal mode

 Essentials only — keep it small, extend later:

 ```
   Movement
     h/l         char left/right
     j/k         line down/up
     w/b         word forward/backward
     0/$         line start/end
     gg/G        file start/end
     Ctrl-d/u    half-page down/up



   Insert entry
     i           insert at cursor
     a           insert after cursor
     o           open line below, insert
     O           open line above, insert
     A           insert at end of line
     I           insert at start of line

   Editing (normal mode)
     x           delete char under cursor
     dd          delete line
     yy          yank line
     p           paste after cursor
     u           undo
     Ctrl-r      redo

   Search
     /           forward search (opens command bar with /)
     n/N         next/prev match

   Commands
     :           enter command mode
 ```

 ### Keymap: Insert mode

 ```
     Escape      back to normal
     All other   default textarea behavior (typing, arrows, etc.)
 ```

 ### Keymap: Command mode

 ```
     :w          save (calls B.call('save', 'file'))
     :q          close (calls B.call('close', 'file'))
     :wq         save then close
     :q!         close without save (discard dirty)
     Escape      cancel, back to normal
     Enter       execute command
 ```

 ### Implementation: viController

 One module, viController, that wraps textarea interaction:

 ```js
   var viController = {

     // Called on every keydown in the textarea
     handleKey: function (ev, textarea, store) {
       var mode = store.viState.mode;

       if (mode === 'normal')  return viController.normalKey(ev, textarea, store);
       if (mode === 'insert')  return viController.insertKey(ev, textarea, store);
       if (mode === 'command') return viController.commandKey(ev, textarea, store);
     },

     // Cursor manipulation via textarea.selectionStart / selectionEnd
     moveCursor: function (textarea, pos) {
       textarea.selectionStart = textarea.selectionEnd = pos;
     },

     // Get current line number, column, line content
     cursorInfo: function (textarea) {
       var val = textarea.value;
       var pos = textarea.selectionStart;
       var before = val.slice(0, pos);
       var lineNum = before.split('\n').length - 1;
       var lines = val.split('\n');
       var colNum = pos - before.lastIndexOf('\n') - 1;
       return {pos: pos, line: lineNum, col: colNum, lines: lines, text: val};
     },

     // Execute a normal-mode motion, return new cursor position
     motion: function (key, info) {
       // h/j/k/l/w/b/0/$/gg/G/ctrl-d/ctrl-u
       // Returns new pos (integer)
     },

     // Execute an operator (dd, yy, x, p)
     operator: function (key, textarea, info, register) {
       // Mutates textarea.value, returns {value, cursor, register}
     }
   };
 ```

 ### Integration with gotoB views

 The textarea in views.files gains a onkeydown handler that routes through vi:

 ```js
   ['textarea', {
     class: 'editor-textarea' + (viMode ? ' vi-active' : ''),
     readonly: viMode && viState.mode === 'normal',
     oninput: B.ev('set', ['currentFile', 'content']),
     onkeydown: viMode
       ? B.ev('vi', 'key', {raw: 'event'})
       : B.ev('keydown', 'editor', {raw: 'event'})
   }]
 ```

 New responders:

 ```js
   ['vi', 'key', function (x, ev) {
     var textarea = ev.target;
     var viState = B.get('viState');
     var result = viController.handleKey(ev, textarea, viState);

     if (result.mode)     B.call(x, 'set', ['viState', 'mode'], result.mode);
     if (result.pending !== undefined) B.call(x, 'set', ['viState', 'pending'], result.pending);
     if (result.register) B.call(x, 'set', ['viState', 'register'], result.register);
     if (result.message !== undefined) B.call(x, 'set', ['viState', 'message'], result.message);
     if (result.save)     B.call(x, 'save', 'file');
     if (result.close)    B.call(x, 'close', 'file');

     if (result.preventDefault) ev.preventDefault();
   }],
 ```

 ### Status bar

 A thin bar below the editor textarea:

 ```
   ┌─────────────────────────────────────┐
   │  (textarea content)                 │
   │                                     │
   ├─────────────────────────────────────┤
   │ -- INSERT --          Ln 42, Col 17 │  ← vi status bar
   └─────────────────────────────────────┘
 ```

 In command mode, the left side shows the command being typed:

 ```
   │ :wq                   Ln 42, Col 17 │
 ```

 CSS:

 ```js
   ['.vi-status', {
     display: 'flex',
     'justify-content': 'space-between',
     padding: '0.25rem 0.75rem',
     'background-color': '#0d0d1a',
     'font-family': 'Monaco, Consolas, monospace',
     'font-size': '12px',
     color: '#9aa4bf',
     'border-radius': '0 0 8px 8px'
   }]
 ```

 View:

 ```js
   viMode ? ['div', {class: 'vi-status'}, [
     ['span', viState.mode === 'insert'  ? '-- INSERT --' :
              viState.mode === 'command' ? ':' + (viState.pending || '') :
              ''],
     ['span', 'Ln ' + cursorLine + ', Col ' + cursorCol]
   ]] : ''
 ```

 ### Chat input: lighter vi

 The chat textarea gets vi too, but simpler:
 - Normal/insert modes only (no command mode — no :w for chat)
 - Escape → normal, i/a → insert
 - Movement keys in normal mode
 - Ctrl+Enter sends in both modes (override vi)

 ### What NOT to build (keep scope small)

 - No visual mode (v/V/Ctrl-v)
 - No macros (q/@ recording)
 - No marks (m/')
 - No registers beyond one (no "a/"b)
 - No . repeat
 - No ciw/diw text objects
 - No split/tabs (this isn't vim, it's a vi-flavored textarea)

 These can all be added later. The core — normal/insert/command, basic motions, dd/yy/p, :w/:q — is what makes it feel like vi.

 ### Order of work

 1. Rename Accounts → Settings, add viMode toggle + persistence
 2. Add viState to store, viController object
 3. Wire onkeydown routing in editor textarea
 4. Implement normal mode motions (h/j/k/l/w/b/0/$)
 5. Implement insert mode (Escape to exit)
 6. Implement dd, yy, x, p
 7. Implement command mode (:w, :q, :wq)
 8. Add status bar
 9. Wire chat input (lighter variant)
