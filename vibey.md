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

## How can everything be markdown?

Well, everything except what you're building (unless you're building the Next American Novel). The state of the agents is also expressed in markdown.

We need to sprinkle some versioning on this. We can either do it with git or by updating files with a timestamp (ugh). But we're vibe coding, so we can have fun now and deal with efficiency when we have more data points, which is more scientific anyway.

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

Note that the "thing itself" is missing; if it's code, go use your IDE, or just open your browser and use it, if it's running.

For the students of humanities stranded in the digital age: this is your chance to build a world with your words. Not cryptic commands, without the tens of hours of practice that are required to figure out misplaced semicolons. Describe your world and see it come to life, somewhat expensively.

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

- `POST /dialog` — Body: `{dialogId, provider, prompt, model?}`. Response: SSE stream. Loads dialog from file, parses `## User`/`## Assistant` sections into messages. Appends user message to file, then streams assistant response to file and browser simultaneously. Tools are always enabled. SSE event types: `chunk`, `tool_request`, `done`, `error`.

Two implementations: Claude (Anthropic API, max_tokens 64000) and OpenAI. Both stream. Provider must be `claude` or `openai`. Server runs on port `CONFIG.vibeyPort` (default 3001).

### Client: dialogs

Left sidebar lists dialog files (those starting with `dialog-`). Right side is a chat view: messages parsed from the file, rendered as bubbles.

Input area: provider select (Claude/OpenAI), textarea (Cmd+Enter to send), Send button. During streaming, partial response shown with block cursor. Input disabled while streaming or while tool calls are pending.

### Server: tools for dialogs

The LLM always receives four tools:

- `run_command` — run a shell command (30s timeout, 1MB max output). Use for reading files (`cat`), listing directories (`ls`), HTTP requests (`curl`), git, and anything else the shell can do.
- `write_file` — create or overwrite a file. Takes `{path, content}`. Bypasses the shell so content with quotes, backticks, template literals, etc. is written cleanly.
- `edit_file` — surgical find-and-replace. Takes `{path, old_string, new_string}`. `old_string` must appear exactly once in the file; if it appears zero times or more than once, the tool returns an error asking for more context. The LLM should read the file first (`cat` via `run_command`) before editing.
- `launch_agent` - the equivalent of making a call to spawn a new dialog. Uses the same endpoint as the user does for starting a dialog.

Tool definitions are written once and converted to both Claude and OpenAI formats.

**No server-side state.** All tool call state lives in the dialog markdown. The server reconstructs pending state by parsing the dialog file each time. The in-memory `pendingToolCalls` object does not exist.

#### Markdown format for tool requests

When the LLM requests tools, they are written to the dialog file as blocks within the assistant section. Each block includes the tool name and its API-assigned ID (needed to continue the conversation with the provider):

```
---
Tool request: run_command [toolu_abc123]

    {"command": "ls"}

---
```

After a human approves and the tool executes:

```
---
Tool request: run_command [toolu_abc123]

    {"command": "ls"}

Decision: approved
Result:

    {"success": true, "stdout": "file1.txt"}

---
```

Or denied:

```
---
Tool request: run_command [toolu_abc123]

    {"command": "ls"}

Decision: denied

---
```

A tool request block with no `Decision:` line is **pending** — this is how the server knows the dialog is waiting.

#### Blanket authorizations

Authorizations are user actions. They appear inline in the dialog flow, at the point where the human granted them:

```
> Authorized: run_command
```

This means: from this point on in this dialog, `run_command` tool calls are auto-executed without asking. One authorization per tool type.

When a new dialog is spun up (including by `launch_agent`), global authorizations from `doc-main.md` are written at the start of the dialog, so the agent begins with those permissions already granted.

#### Tool call flow

1. LLM responds with tool calls → written to markdown as tool request blocks (with IDs, no decision yet).
2. Server scans the entire dialog for `> Authorized: <tool_name>` lines to build the set of authorized tools.
3. **Authorized tools**: auto-executed immediately. `Decision: approved` and `Result:` written to the markdown. No human interaction needed.
4. **If all tools were authorized**: the server loops — it reconstructs the message history from the updated markdown, calls the LLM again (which may request more tools, repeating this cycle).
5. **If any tool is unauthorized**: the server sends a `tool_request` SSE event to the client with only the unauthorized tool calls. The stream ends. The dialog is now in "waiting" state.
6. Human reviews the unauthorized tools. For each, they approve or deny. They may also grant blanket authorization (a checkbox or similar) → `> Authorized: <tool_name>` is written to the markdown at that point.
7. Client calls `POST /dialog/tool-result` with all decisions. Server writes everything to the markdown, reconstructs the full message history (including the already-auto-executed authorized tools), and continues the LLM conversation.

#### Parsing the dialog for API messages

`parseDialog` reconstructs the full API message history from the markdown. It handles:
- `## User` / `## Assistant` sections as text messages.
- Tool request blocks (with IDs and inputs) as `tool_use` entries in assistant messages.
- Decision + Result blocks as `tool_result` entries in user messages.
- Converts to the appropriate format per provider (Claude `tool_use`/`tool_result` vs OpenAI `tool_calls`/`tool` role messages).

The markdown is always the source of truth. The server can restart, crash, and recover — it just re-reads the file.

#### Endpoints

- `POST /dialog` — Body: `{dialogId, provider, prompt, model?}`. Response: SSE stream. Parses dialog from file into API messages. Appends user message to file. Calls LLM. Streams chunks to client and file simultaneously. If LLM requests tools: writes tool request blocks to file, checks authorizations, auto-executes authorized tools (writing decisions + results to file). If all tools authorized, loops back to the LLM. If any unauthorized, sends `tool_request` SSE event with those and ends the stream. SSE events: `chunk`, `tool_request`, `done`, `error`.

- `GET /dialog/pending/:dialogId` — Parses dialog markdown, finds tool request blocks with no `Decision:` line. Returns `{dialogId, toolCalls}` or 404 if none pending. Stateless — just reads the file.

- `POST /tool/execute` — Execute one tool. Body: `{toolName, toolInput}`. Completely stateless — just runs the tool and returns the result. Does not touch the dialog file.

- `POST /dialog/tool-result` — Submit decisions for pending tools and continue the conversation. Body: `{dialogId, toolResults[], authorizations?[]}`. Writes `> Authorized: <name>` lines for any newly granted authorizations. Writes `Decision:` and `Result:` into each pending tool request block. Then parses the full dialog markdown to reconstruct the API message history (including previously auto-executed tools), and continues the LLM conversation. Response: SSE stream (same event types as `POST /dialog`). May loop internally if the LLM requests more tools that are all authorized.

### Client: tools for dialogs

When `tool_request` SSE events arrive (only for unauthorized tools — authorized ones were already auto-executed by the server), a panel shows each tool's name and input. Each can be approved or denied individually; Approve All / Deny All also available. Each tool also has an "Always allow" checkbox that grants blanket authorization for that tool type.

On approve, tool executes via `POST /tool/execute`, result shown inline. Once all resolved, results and any new authorizations are submitted via `POST /dialog/tool-result` and streaming resumes.

## TODO

Goal: be able to build vibey with vibey itself.

Hi! I'm building vibey. See please vibey.md, then vibey-server.js and vibey-client.js. There's pupeteer available if you need it.

- ALSO EDIT DOCS:
   - POST /dialog to create new dialog.
   - When a dialog calls a tool:
      - If it's authorized, call it directly. The response of the tool is 1) written into the markdown; 2) sent back to the LLM to continue the dialog.
      - If it's not authorized yet, the dialog is moved to pending.
      - In both cases, the stream finishes since we're sending a new message.
      - If the request is rejected, the dialog is also placed as pending.
❯ When calling POST /dialog to resume, you need to send what you're approving, by id in case there are multiple requests.

Do we even need an endpoint for the tool? Can't it just be read from the md or the stream by the server?

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
-
