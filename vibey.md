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
- Allow the server to write and read markdown files locally, all against a folder `vibey`
- Allow the client to list the markdown files in that folder, open them, edit them in whsiwyg with some standard and good markdown editor that can be loaded from the client side.
- Have a server function that spins an agent, reads the vibey/rules.md, and spins whatever needs to be spun.
   - The function takes two arguments: 'claude' or 'codex' (agent), and the prompt. It returns the name of the file where the agent is spinning, which is generated from the convention above. The role is either `main` or `worker`.
- A main agent that has a no-op should not leave a file behind (perhaps it can delete its own file?)
- There will be no dialog-ROLE-RANDOM_NOUN-YYYY-MM-DD-HH-MM.md yet. One will be created when the agent spins for the first time.
- The main agent does an ls of the dialogs and does a grep to see if there's a <ENDED> at the end of the file (which marks the dialog as complete).
- The dialogs can also be opened as markdown, and you can also send messages to dialogs that are not ended.
- If a dialog receives a message from a human or another agent, it is also placed in its markdown file.
- Dialogs handle stdin when claude code or codex ask for options. They should be VERY tty-like, except that they're still markdown. Decisions registered look like text.
- Put timestamps on the chunks of the dialogs, so we know more or less where we are: remember, there's no state outside of the text files.




Hi! Suppose you don't have claude code, or codex. Can you have an MCP-like local experience where you send API calls to get inference, and the LLM makes the commands in your computer with your authorization?

Let me think. I want a claude code or codex experience just with api calls. You'd have to support:
- network calls
- os calls
- reading files would be catting or grepping, so also os calls.

Could you set it up so that we use the openai API and then the node server in vibey-server provides this mcp tooling? Is that even possible?

THe LLM response needs to be streamed, so we can see it live.

I want nothing whitelisted at the beginning, ask me through stdin.

That stdin should be compatible with what we have in vibey-client.js.

codex:
"If you want, I can do one of these next:

  1. Add “Other” to submit as tool output tied to the pending tool call.
  2. Add a model selector input in the UI.
  3. Add a “busy / streaming” indicator so it’s clear when the model is mid-stream."
