# Vibey (codename)

An agentic interface for those who love text.

Use text to run agents. From your browser.

## The concept

Think of a text-based agentic system as four things:

1. **Documentation**: a set of markdown pages that contain the specification of the system: purpose, main entities, endpoints, constraints, core flows, coding standards.
2. **What you're building**: if it's code, the codebase, plus all of the data. If you're selling something, an interface to your CRM. If you're writing a game, your game.
3. **Dialogs**: the stream of consciousness of each agent. Most dialogs are complete, a few are ongoing for those agents that are working/alive *now*. A human can inspect at any time this stream of text, code changes and commands; a human can also enter the dialog. Some dialogs can be waiting for human input. When an agent completes its work, the dialog is no longer alive but it still is accessible.
4. **Tasks**: a dynamic set of discrete pieces of work, expressed as markdown pages. They should be reconstructable from the documentation + the existing state of the codebase. Tasks should be nestable. They have a status (done, pending, in progress, waiting for human interaction, complete).

The first two things are stocks: things that accumulate with time. The last two are flows: changes that build the stocks.

The core of all this is one document, which is rules.md. This file contains:

- The instructions for the main agent that is in charge of spinning other agents.
- Instructions on where are the instructions to distribute to the other agents.
- What permissions to ask for a human and what not to ask for.
- Whether to use Claude Code, Codex, or whatever it is to spin an agent.

Rather than hardcoding or customizing an agentic mesh, just describe it. Every N seconds, an agent is spun with the role "main" so it can 1) read the rules; 2) see the current situation; 3) spin or turn off any agents to match the rules.

Vibey is not experimental. It is an experiment.

## How can everything be markdown?

Well, everything except what you're building (unless you're building the Next American Novel). The state of the agents is also expressed in markdown.

We need to sprinkle some versioning on this. We can either do it with git or by updating files with a timestamp (ugh). But we're vibe coding, so we can have fun now and deal with efficiency when we have more data points, which is more scientific anyway.

We take great inspiration from Unix's "everything is a file": here, everything is text, except for the artifacts that your agents build, which might be something else than text.

## How can everything be running from your browser?

Browsers are wonderfully plastic and powerful interfaces. At this stage, vibey-server will also run locally. But, in the future, it's possible to envision vibey as a service, so that you don't have to deal with the server, and just express the system you want in pure text.

## Spec

### Server: static assets

`GET /` serves an HTML shell that loads normalize.css, tachyons, gotoB, marked.js, and `vibey-client.js`. `GET /vibey-client.js` serves the client.

### Server: files

All files live in a local `vibey/` directory, created on startup if missing. Filenames must match `[a-zA-Z0-9_\-\.]+`, end in `.md`, no `..`.

- `GET /files` — list all `.md` files, sorted by mtime descending.
- `GET /file/:name` — read file. Returns `{name, content}`.
- `POST /file/:name` — write file. Body: `{content}`.
- `DELETE /file/:name` — delete file.

### Client: files

Left sidebar lists all files with + New and × delete. Right side is a textarea editor. Cmd+S saves. Tracks dirty state, warns on close with unsaved changes. Deleting the currently open file clears the editor immediately. Loading a file that no longer exists silently deselects it.

### Server: dialog

Dialogs are files named `dialog-{id}.md`. Format:

```
# Dialog
> Provider: claude | Model: claude-sonnet-4-20250514

## User
message

## Assistant
response
```

- `POST /chat` — Body: `{dialogId, provider, prompt, model?}`. Response: SSE stream. Loads dialog from file, parses `## User`/`## Assistant` sections into messages. Appends user message to file, then streams assistant response to file and browser simultaneously. Tools are always enabled. SSE event types: `chunk`, `tool_request`, `done`, `error`.
- `GET /dialog/:id` — messages and raw markdown.
- `GET /dialogs` — list dialog files with mtime.

Two implementations: Claude (Anthropic API, max_tokens 64000) and OpenAI. Both stream. Provider must be `claude` or `openai`. Server runs on port `CONFIG.vibeyPort` (default 3001).

### Client: dialogs

Left sidebar lists dialog files (those starting with `dialog-`). Right side is a chat view: messages parsed from the file, rendered as bubbles.

Input area: provider select (Claude/OpenAI), textarea (Cmd+Enter to send), Send button. During streaming, partial response shown with block cursor. Input disabled while streaming or while tool calls are pending.

### Server: tools for dialogs

The LLM always receives three tools:

- `run_command` — run a shell command (30s timeout, 1MB max output). Use for reading files (`cat`), listing directories (`ls`), HTTP requests (`curl`), git, and anything else the shell can do.
- `write_file` — create or overwrite a file. Takes `{path, content}`. Bypasses the shell so content with quotes, backticks, template literals, etc. is written cleanly.
- `edit_file` — surgical find-and-replace. Takes `{path, old_string, new_string}`. `old_string` must appear exactly once in the file; if it appears zero times or more than once, the tool returns an error asking for more context. The LLM should read the file first (`cat` via `run_command`) before editing.

Tool definitions are written once and converted to both Claude and OpenAI formats.

Tool calls are not auto-executed. Instead:
1. Written to the dialog file as fenced blocks.
2. Stored in server memory keyed by dialog ID.
3. Sent to client via `tool_request` SSE event.

- `POST /tool/execute` — execute one tool. Body: `{toolName, toolInput}`.
- `GET /chat/pending/:dialogId` — get pending tool calls.
- `POST /chat/tool-result` — submit results and continue. Body: `{dialogId, toolResults[]}`. Response: SSE. Writes decisions to file, builds proper tool_use/tool_result format per provider, continues the LLM conversation (which may request more tools).

### Client: tools for dialogs

When tool requests arrive, a panel shows each tool's name and input. Each can be approved or denied individually; Approve All / Deny All also available. On approve, tool executes via `POST /tool/execute`, result shown inline. Once all resolved, results submitted via `POST /chat/tool-result` and streaming resumes.





## How does it look?

- Three tabs only:
   - Documentation
   - Dialogs
   - Tasks

Note that the "thing itself" is missing; if it's code, go use your IDE, or just open your browser and use it, if it's running.

Yeah, this can be done with files, not even directories:

- doc-<name>.md
- dialog-<YYYYMMDD-HHMMSS (utc)>-<role>.<status>.md
- task-<name>.md

For the students of humanities stranded in the digital age: this is your chance to build a world with your words. Not cryptic commands, without the tens of hours of practice that are required to figure out misplaced semicolons. Describe your world and see it come to life, somewhat expensively.

There has to be one main of each:

- One main doc, doc-main.md, which describes the project. And links to the other docs.
- One main dialog, that of the main agent currently running.
- One main task, which is updated by the main agent (perhaps).

## Moar notes

Fun thing: the main agent also has their own dialog. If another main agent is spun, it can check that there's already a main agent going, and just stop.

## TODO

Goal: be able to build vibey with vibey itself.

Hi! I'm building vibey. See please vibey.md, then vibey-server.js and vibey-client.js. There's pupeteer available if you need it.

- Show the message you send before you receive the answer (right now it appears when the response fro the server is complete).
- Hide (from the UI, not the markdown) the content of the files sent in the client (just say what file you sent), to avoid clogging the frontend.
- Diff suggest & diff apply: show them nicely: green for the +, red for the -.
- Show the times of messages (start & end, not per chunk), also show how many tokens consumed at the end of each message (as per the API response, no guessing), this is fun. Also cumulative tokens used for that dialog. Everything stored in the markdown! No state in the server.
- The fourth tool call being the spwaning of an agent! Specify which provider & model. It is just like a call to POST /chat. No subagent, the structure is flat. Whatever every agent gets, this one also gets, plus what the spawning action sent (POST /dialog should support sending an initial prompt).
- Be able to interrupt an agent. That puts them in the "waiting" state. This requires a separate endpoint. Then the dialog goes to waiting state. There has to be a rename command run by the main agent directly. The dialog is resumed by the user sending another message to the LLM. The file is autorenamed by the server, not the main agent, since the one interrupting is the server.
- Possible dialog states: done, active, waiting (on human). Waiting means that a tool use is proposed, or that the LLM considers that they still need mor e human input (they can specify this through a convention that's also in the markdown). The status of a dialog is in its file name, its suffix is <status>.md.
- I'm deciding against a single dialog/main.md to keep track. We just look at active dialogs to see what chats are happening.
- It should not be POST /chat, it should be POST /dialog, rename the endpoint we have
- Stop creating bla.md dialogs, we always need the status.
- Format: dialog-<role>-<slug>-<YYYYMMDD-HHmmss>.active.md
- remove pendingToolCalls memory and reconstruct pending tool requests by parsing dialog markdown each time
- introduce a pseudo-tool name like request_human_input
- Main agent spawner (inside vibey-server)
   - List active dialogs (any dialog that ends in `.active.md` or `.waiting.md`).
   - If there's an active or waiting dialog with role `main`, don't do anything.
   - Otherwise, launch main agent.
   - Do this every 5 seconds.
- Main agent loop
   - Read `vibey/main.md` to pick up instructions about agentic flow.
   - See the recently finished dialogs, update the todo list accordingly.
   - Read the todos (as specified in `docs/todo.md`) to see what should be done.
   - Based on what `main.md` says, spin other agents to start work.
   - The main loop is also a normal agent! If you catch it "just in time" you can even stop it.

