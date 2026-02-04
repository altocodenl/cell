# Vibey (codename)

An agentic interface for those who love text.

Use text to run agents.

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

## How does it look?

- Three tabs only:
   - Documentation
   - Dialogs
   - Tasks

Note that the "thing itself" is missing; if it's code, go use your IDE, or just open your browser and use it, if it's running.

Yeah, this can be done with files, not even directories:

- doc-<name>.md
- dialog-<YYYYMMDD-HHMMSS (utc)>-<role>.md
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

- Have a vibey-server.js (done)
- Have a vibey-client.js (done)
- Allow the server to write and read markdown files locally, all against a folder `vibey` (done)
- Allow the client to list the markdown files in that folder, open them, edit them in whsiwyg with some standard and good markdown editor that can be loaded from the client side. (done)
- Allow the server to start a dialog with an LLM (both claude and openai).
   - Have two implementation functions for this that are called by one function which chooses model and passes a prompt.
   - Make the function call streaming, so that we get text as soon as possible.
   - Increase the max_tokens of claude to something as big as possible.
   - Store the dialog so far as markdown, distinguishing who said what.
   - When the user writes something, send it to the remote LLM, also put it in the markdown.
- Allow the client to start a dialog with the LLM through the server, picking a provider and model, sending text, then showing the response.
   - List dialogs by listing all files, then filtering out those that start with `dialog-`
   - In my mind, we only need to send something to a dialog as something special that goes to the server, not the file. And, also, once we load it, we need to add quite some markup on top of all the ugly JSONs.
   - This should be done by getting the correct text file where the dialog is being stored.
   - Road not taken: use local Claude Code and Codex. Really fighting the tools there, trying to pretend to be a TTY when we're not one.
- When in a dialog, allow the remote LLM to run local commands through MCP.
- When in a dialog, allow the client to see the options whether to run the LLM MCP local command or not.

to define:

- Have a server function that spins an agent, reads the vibey/rules.md, and spins whatever needs to be spun.
   - The function takes two arguments: 'claude' or 'codex' (agent), and the prompt. It returns the name of the file where the agent is spinning, which is generated from the convention above. The role is either `main` or `worker`.
- A main agent that has a no-op should not leave a file behind (perhaps it can delete its own file?)
- There will be no dialog-ROLE-RANDOM_NOUN-YYYY-MM-DD-HH-MM.md yet. One will be created when the agent spins for the first time.
- The main agent does an ls of the dialogs and does a grep to see if there's a <ENDED> at the end of the file (which marks the dialog as complete).
- The dialogs can also be opened as markdown, and you can also send messages to dialogs that are not ended.
- If a dialog receives a message from a human or another agent, it is also placed in its markdown file.
- Dialogs handle stdin when claude code or codex ask for options. They should be VERY tty-like, except that they're still markdown. Decisions registered look like text.
- Put timestamps on the chunks of the dialogs, so we know more or less where we are: remember, there's no state outside of the text files.



