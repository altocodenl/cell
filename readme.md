# cell

## Why cell

cell is a [programming substrate](https://www.youtube.com/live/4GOeYylCMJI?t=2286s) based on a chain of four hypothesis:

1. **Data systems are essential to the creation of wealth and knowledge**. Data systems are representations of the real world. They are useful and powerful because they allow us to work with the real world in a systematic way that allows us to leverage computers.
2. **Understanding is the key to making good data systems**. Understanding is a representation of a data system inside a human mind. Understanding is the key to achieve ownership of a system and flow while building it. Ownership comes from being able to fix or change the system understanding the implications of what's going on. Flow comes from knowing what's going on and finding the way towards where the system should go next.
3. **Simplicity is the key to understanding a system**. Because complexity is exponential, no amount of brainpower can cut through it. The only way to make a system understandable is to make it simple. The aphorism "Keep it simple" is plain wrong. A system is not kept simple, it is *made* simple. The art of system building is to make it more useful while making it simpler.
4. **A programming substrate is the key to simplicity**. A substrate is a good set of primitives that allow you to build any general purpose data system.

cell tries to be a good enough substrate, so that you can:

1. Use a simple tool to build your systems.
2. Through simplicity, you understand your systems with ease.
3. Through understanding, your systems become really good and you really own them and enjoy working on them.
4. Through your ownership and flow, your work can better contribute to our collective human wealth and knowledge.

## AI can now code for us! Do we really need to understand what's going on?

I had written something else here. But it's January 2026 and am not so sure anymore that you need to look at the code of a system to get use out of it. Programming is now in great flux.

If you still want to look at it to get it directly (and not through a description of it that AI provides, or through an UI you directly see), then cell can be useful.

If cell works as a good programming substrate, it will be because it's a better description of a system than natural language.

And if it's compact enough, then perhaps you (or AI) can build systems with a lot of power in a few hundred lines instead of hundreds of thousands.

## How cell tackles the obstacles to understanding

Complexity is what makes it hard to understand a system. There are many sources of complexity in existing programming languages and frameworks that can be completely avoided. Rather than slap an AI editor on top of the same tools, cell reconsiders programming from first principles. In doing so, it removes the following sources of complexity:

1. Lack of a single, low-noise way to directly look at data.
2. Fragmentation of data into multiple places.
3. Inability to see code and data in the same place, intertwined.
4. An unnecessary diversity of ways to express straightforward logic.
5. Separateness between time and code (you must re-run to see changes) and between the parts of the system (the backend, the frontend, the database and the tests).

For each of these, cell provides:

1. A low-noise, general representation of data based on text (fourdata).
2. An unified dataspace where code and data, as well as external resources, can be represented.
3. Code is shown alongside data and every call has its response *right on top* of it.
4. Write any logic with *only five constructs* which you can understand in a few minutes.
5. An editor that constantly responds to your changes and which integrates service, interface and database. And which runs in your browser, with no installation required.

I'm currently recording myself while building cell. You can check out [the Youtube channel here](https://www.youtube.com/channel/UCEcfQSep8KzW7H2S0HBNj8g).

## Concepts

### Relationship to the spreadsheet

Cell is very much inspired by the [spreadsheet](https://en.wikipedia.org/wiki/Spreadsheet).

In essence, a spreadsheet is immensely powerful because it has three properties:

1. All of its data is contained in cells, each of them with an address. Each piece of data has an address.
2. A cell can reference another cell.
3. When a cell changes, all of the cells depending on it change as well.

These properties carry the following advantages:

1. Because each piece of data is in a cell, it's immediately addressable by any other part of the program. Then you don't have to build labyrinths to access parts of your state.
2. You can compose data and logic, like if they were legos.
3. You don't have to re-run everything all the time. The state is always fresh, always consistent. You get constant feedback for free.

Cell wants to go further in this direction. In cell:

1. Every piece of data has a path to it (its address).
2. Any piece of data can reference another one by path.
3. When a piece of data changes, all the pieces of data depending on it also change.

Cell intends to go beyond the spreadsheet in the following ways:

- Cells can be named meaningfully.
- Cells can be nested.
- The equivalent of the formula and the value of a cell can be seen at the same time.
- Cell can also be a service, a database and an interface maker.

These new features are built on top of the same mechanisms that make the spreadsheet possible in the first place: everything being referenceable and dependencies automatically updating.

### Comparison between cell and other programming languages

cell most resembles the following programming languages: [Tcl](https://en.wikipedia.org/wiki/Tcl), [J](https://en.wikipedia.org/wiki/J_(programming_language)) and other array languages and [lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)). To a lesser extent, [Forth](https://en.wikipedia.org/wiki/Forth_(programming_language)).

Like all of these languages, cell is [homoiconic](https://en.wikipedia.org/wiki/Homoiconicity). The languages above have almost no syntax; we can perhaps ay that cell has no syntax, apart from the syntax used to represent alf.

Like these languages, cell has text, number and list as first-class structures. Unlike them, it has native support for hashes. This is, in my opinion, the biggest advantage that cell has over lisp.

The main differences between cell and these languages is the embodiment of [pillars 2 and 3 of TODIS](https://github.com/altocodenl/todis?tab=readme-ov-file#the-five-pillars):
- All the data exists in a single dataspace that is fully addressable.
- The execution of the interpreter happens within this dataspace, so that intermediate results can be seen and manipulated.

The two decisions above make macros just like normal programming, by simply modifying the intermediate results of the interpreter.

Like Tcl with [Tk](https://en.wikipedia.org/wiki/Tk_(software)), the interface maker comes integrated with the language. Unlike the languages above, cell also comes integrated with a server to expose an API.

### For programmers coming from...

#### Erlang

No notion of processes. Errors are stopping values that bubble all the way up to the caller. The system is never broken and always runs.

#### Lisp

### Departures of cell from lisp

- No explicit parens, use instead lines to put multiple elements in a list or hash.
- Instead of just lists and atoms, there are lists and hashes, as well as numbers and text.
- Specify exactly how data looks like in terms of pretty-printing
- No parenthesis, but a couple of evaluation rules (still too few to be considered a proper full-blown syntax)
- Everything's quoted by default, you need to make calls explicitly
- Macros are simple data manipulation operations on sequences. The explicitness of @ allows this, because it can considered as data until it is expanded. Macros are done on paths. Macros are *only* about selectively unfreezing some definitions before they are frozen again.

#### Datomic

The table, attribute and value can be seen as the path. Transactions with timestamps can be added. I am still figuring out how to implement the "retract" notion, in that the previous value should start to be valid. This should be built on top and I'd like for a system like this to be part of the core.

#### Go

Rather than channels, we can have built in queues that can allow up to n processes in parallel.

For now, I don't see a need for explicit coroutines, but I need to review this again when we're further down the road.

#### Typed languages

Define types as validations. The requirements from the calls will bubble up on the editor (note: TODO) so you can see what's expected of you in a call. This is the essence of the value of a type system, from the perspective of human performance. As for computer performance, we'll deal with that when we build a fast way to operate on paths.

### Innovations of cell

- Programming as message-based three-way communication between the environment, the user and the LLM.
- Immediate integration of files and emails into the dataspace.
- Integrated language, database, service and interface.
- Two general purpose representations of data: text and datagrid.
- Storing discrete calls in a dialog gives us both commits and transactions in a single construct. This allows us to query the system's state at any specific moment. We can also examine how the system evolves over time by reviewing the sequence of interactions. The calls are the diffs of the system. If the `get` call takes a parameter, we can query any previous state. And if the `put` call can take a condition and perform multiple operations as a whole, we can have reified transactions. These insights grow from the work of Datomic (thanks Val Waeselynck for your [great explanation](https://vvvvalvalval.github.io/posts/2018-11-12-datomic-event-sourcing-without-the-hassle.html)!).
- A first-class [intermediate representation](https://en.wikipedia.org/wiki/Intermediate_representation): paths. Computation as rewriting of paths.

## Tour de cell

### Terminology

- path: a list of steps
- prefix: the left part of one or more paths. N paths can share a prefix.
- value (of a prefix): N paths that are to the right of one prefix, with the prefixes removed.
- key (of a prefix): the last step of a prefix.
- type (of a prefix): the type of the value of that prefix

### The editor

- The *main*: a main window that contains *cells*: smaller windows that show either text (fourdata) or graphical components.
- The *dialog*: a dialog window that combines the concept of a terminal with that of an LLM prompt, enabling a dialog between the user, an LLM and cell. Any message starting with @, whether it comes from the user or the LLM, is understood as a call to cell. Any message sent by the user that is not starting with a @ is sent to the LLM, which will then respond with other messages and possibly calls to cell. Calls to cell will control the interface as well as put data in the dataspace (actually, the interface is simply an interpretation of part of the dataspace, but we mention it as an important special case). cell won't output anything on the dialog, its results will be seen (optionally) in the main window.

In desktop, the main window will be 70% of the width of the screen, to 30% of the vertical stream of messages between user, LLM and cell.

In mobile, the interface will be modal, showing either the main or the dialog.

The LLM can be provided through an API token or offered as a service, but in the end, it doesn't really matter. What matters are the twin intelligences of user and LLM used to paint a picture of data in cell.

The key insight carried from the [shell](https://en.wikipedia.org/wiki/Shell_(computing)) is that the the calls sent to cell, whether they originate from the LLM or from the user, are indistinguishable.

An interesting development of this design is that programming becomes an act of communication with cell and the LLM. This taps into the social nature of language.

### The data representation: `fourdata`

Please see [here](https://github.com/altocodenl/TODIS?tab=readme-ov-file#pillar-1-single-representation-of-data).

In addition to what is specified in TODIS, the following clarification is necessary:

Text that contain white space characters (space, newline, tab, and the like) or double quotes (`"`) are considered *quoted texts*. A quoted text has the following rules:
1. They must be enclosed in double quotes.
2. Any double quote inside it must be prepended by a slash (`/`).
3. Any slash inside it must also be prepended by a slash (`/`).

Examples:

- `hello there` should be written as `"hello there"`
- `"laser" beams` should be written as `"/"laser beams/""`
- `/ is a slash` should be written as `"// is a slash"`.

Note that you can have non-quoted text with slashes. For example, `/foo` can simply be written as such.

### The language

Please see [here](https://github.com/altocodenl/TODIS?tab=readme-ov-file#pillar-3-call-and-response) and [here](https://github.com/altocodenl/TODIS?tab=readme-ov-file#pillar-4-logic-is-what-happens-between-call-and-response).

### Organization of a cell

```
access
api
   email
   http
cron
dialog
   - call
     from
     hide
     id
     ms
     to
editor (client side only, not persisted in the server)
   cursor
   expand
   search
file
rule
view
```

## Development notes

### 2026-02-17

Prompts:
- Hi! I'm building vibey. See please vibey.md, then vibey-server.js and vibey-client.js, then docs/hitit.md (backend tests) and docs/gotoB.md (frontend framework).
- Please run vibey-server and then the backend tests, debug that minimal flow 1 we have, reporting on what you see while you work.
- Please take the vibey client tests and the boot script and put it all in one file. If you're in node, run the pupeteer. If you're in the browser, run the c.test things. So we have one file, self-contained, for frontend tests.
- Fantastic, now make this single file vibey-test-client.js, delete the boot one and vibey-test.js, but keep the other server tests file (vibey-test-server).
- Great! Now please add the modifications I added on the flow 1 on vibey.md to the backend tests, then the frontend tests.
- Please change flow 1 so that the LLM knows to go one directory up to look for vibey.md when running it from the client
- Please implement tests for flow 2. Don't restart the server. Don't modify the client either.
- There's another agent working on the server, so please work in the frontend.
   - The tool uses have huge outputs: can you hide anything after a few lines? I think the issue is the unescaped `\n`, which should be escaped so that outputs look OK.
   - Also, could you put the timestamps and tokens used at the end of the box, not the beginning?
   - Let's make the gauges section show: time without ms (end time: 2026-02-17T14:28:29); how many seconds it took, rounded (2.5s or 0.2s), only cumulative tokens in ks (2.3kt in, 1.8kt out)
   - Remove the "end time" stating, just put the time. Also don't put the date if it's today's date. Also compact the token part to "3.3k+1.8k in/out"
   - Great! Now make the stdout/stderr of the tools look prettier, and auto-compact.
   - Please use local times, you were right about that.
   - Don't hide/show per key (stdout, stderr); rather, make it a general toggle of hide by default, show by clicking on expand (and allow to compress), use gotoB state to mark something as expanded with a good, unrepeatable prefix that depends on the dialog and the message.
   - Keep the expansion when switching between dialogs, it might be handy. Please make the expanded output look like the compressed output.
   - You're doing great. Please make sure we always autoscroll down when new things appear if we're already at the bottom, like in a terminal.
   - Please fix the tests :D
   - Thanks!! Please make it track how many seconds the response took for the LLM between the date and the tokens, like 3.5s for 3543 ms.
   - Also, let's make it "2.3kti + 1.2kto"
- Let's containerize this. Let's design how. Can you run in 2026 a docker inside a docker? I'd like vibey itself to run inside a docker, and then be able to spawn dockers inside for each project. Is that tenable?
- The problem I see with dockers for each project on the host is port contention, perhaps also name clashes. Also, I'd like that if you kill vibey, you also kill all that's inside of it. Is dind quirky?
- How quirky it is? What are the typical failure modes? Let's consider we're now, this is greenfield.
- No, the --privileged flag is a major speed bump. Let's do it flat instead, and do good housekeeping. Write me a quick list of things to do containerize, to tackle it tomorrow.


### 2026-02-16

Rather than build one app for everyone, build a platform so that people can build their own apps. It's exactly like Yegge says (https://gist.github.com/chitchcock/1281611):
"Our Google+ team took a look at the aftermarket and said: "Gosh, it looks like we need some games. Let's go contract someone to, um, write some games for us." Do you begin to see how incredibly wrong that thinking is now? The problem is that we are trying to predict what people want and deliver it for them."
"We don't get Platforms, and we don't get Accessibility. The two are basically the same thing, because platforms solve accessibility. A platform is accessibility."

vibey as a platform for vibe coding.

### Summary of where I am with vibey

- My journey with cell: understand/empower people to build their own systems through a simple programming substrate. But, given the current revolution, most people will never see code anymore: they will be vibe coding, writing and debugging in a natural language.
- What will empower most people to program is to have a good environment for vibe coding. The only thing more empowering (not to build, but to run their life) is something like openclaw, but, for me, the security implications of that are just too big to contemplate. Not that it is impossible. But I want to solve another problem. I want to help people build small systems, small applications.
- Offline vibey will provide a good interface, or a platform, for vibe coding locally:
   1. Through your browser (not the terminal, not another native app)
   2. The concept: everything is markdown. Your docs. The dialogs with the LLMs. Almost zero state outside the markdown.
   3. Containerized: so that the blast radius is reduced, with your local machine and also between apps.
- If vibey works locally, local is not the end of the road. Almost always, people need their apps that run in servers, not locally. A server makes your app available 1) everywhere; 2) anytime. This means that more people are going to be using a lot more cloud resources for themselves, with the apps they vibe code.
- There are a lot of tools out there to solve this problem. A few are really good. The proposal of vibey in the cloud, besides vibey itself, would be to provide:
   1. An annual subscription (30 USD?) that gives you access to key cloud providers priced at cost (Hetzner for VPS, Backblaze for files); calls to LLM APIs; email sending. You can also of course bring your own API keys or subscriptions.
   2. Automatic infra to: put projects (containers) onto servers, HTTPS (bring your DNS record), receive emails, vibey session cookies.
   3. No lock-in: the whole thing being open source, so you can always run the same thing yourself elsewhere.
- Interesting alternatives:
  - exe.dev: most like vibey, but with a different agent model and for devs.
     1. You buy underlying resources, and can create throwaway VMs on top of those resources.
     2. The VMs have a persistent disk.
     3. You can use a browser-based agent to interact with the VMs.
  - Val Town
     1. Excellent for tiny serverless/backend scripts and quick automations, especially JS/TS-first workflows.
     2. Less of a full “build your own app system” environment with local-first containers + portable infra path.
  - Replit
     1. Strongest all-in-one cloud coding product for broad users (editor, deploy, collaboration, AI help).
     2. Very locked-in.

Claude says:
- Conversion from local (free) to cloud (paid) — this is your funnel
- Time to first deployed app — this is your north star metric. If it's under 30 minutes, you win"
[I'd say it has to be three minutes]

Plan A:
- Make local vibey useful.
- Make vibey-as-a-service useful.
- Go back to work in cell.

=====

Alternative idea that I'm not considering for now: a place to store markdown and host client side js only, connect with your subscriptions, make little client side app with some persistence, no need to run anything else. just need a proxy for subscriptions and the client side app runs statically.

Vibey will have a vi-like mode in, because "vi" is in "vibey". It has to have a powerful editor as an opt-in.

Really curious to see if we can use documents as channels, so that LLMs can cooperate through them, like it was a slack channel.


Prompt header:
Hi! I'm building vibey. See please vibey.md, then vibey-server.js and vibey-client.js, then docs/hitit.md (backend tests) and docs/gotoB.md (frontend framework).

Prompts:
- Perfect. Now iterate running node vibey-server-test.js and fixing wherever needed the tests. Do not fix the server yet.
- Hi! There's another agent modifying the code. Can you go through flow #1 and check that the tests at vibey-server-test.js match it? No need to run it yet.
- Fantastic. Now please read again vibey.md, make sense of all the tool call conventions. The API is messy and it even looks inconsistent. Please use the schwas and an unified way to represent 1) user inputs; tool requests & authorizations; times and resources used per message. Put your output into a temporary file clean-convention.md
- Let's debug. I cannot even get a proper response to a "Hello". Please timeout your pupeteer to perhaps 1m, not more.
- Please make a pupeteer file that just opens the client and clicks on test, then listens to an alert and stops on it and reports it back to you. Do it as vibey-test-boot.js.
- The project deletion worked! Please don't jump to that project when clicking on the delete.
- There's another agent coding. Can you just run the tests for flow 1? The server is running.
- Please add a way to remove a project. Add the endpoint for that, the frontend logic. Also modify the readme in vibey.md. Don't restart the server yet.

Thinking that YOLO is correct: if you have guardrails in place (container, backups, limiting destructive calls to external resources), you just let the LLM do its thing and give it permission to fail. Like network packets, if one doesn't make it, you just retry. (Thanks Mario Zechner for letting me see this through pi!)

### 2026-02-13

"Thou shalt not make a machine in the likeness of a human mind." -- Orange Catholic Bible

https://mariozechner.at/posts/2025-11-30-pi-coding-agent/#toc_6
"pi-tui uses a simple retained mode approach. A Component is just an object with a render(width) method that returns an array of strings (lines that fit the viewport horizontally, with ANSI escape codes for colors and styling) and an optional handleInput(data) method for keyboard input. A Container holds a list of components arranged vertically and collects all their rendered lines. The TUI class is itself a container that orchestrates everything."

"pi does not have a dedicated sub-agent tool. When Claude Code needs to do something complex, it often spawns a sub-agent to handle part of the task. You have zero visibility into what that sub-agent does. It's a black box within a black box. Context transfer between agents is also poor. The orchestrating agent decides what initial context to pass to the sub-agent, and you generally have little control over that. If the sub-agent makes a mistake, debugging is painful because you can't see the full conversation."

Agents talking to each other by being able to see their dialogs. Perhaps even coordinating by stopping and talking to a common dialog and polling it? Can agents wait or do they need the server to re-prompt them? Maybe waiting can be a tool.

?? interesting things to test: agent coordination

How can we have tasks in markdown and still have incremental updates? The idea is to move completely off JSON, or anything backed by a DB, for the purposes of project management.

On surface tests:
- linear sequence!
- liskov substitute change possible, other changes break
- errors are also outputs, it's a matter of order!


### 2026-02-12

Prompts:
- The changes to fix the bug are ugly as sin. Can you not just set the value using gotoB as is done elsewhere? If you need examples, let me know.
- Add openai and claude accounts as providers because to do this with API calls is going to be an arm and a leg. There should be an accounts section outside, next to projects. The credentials should be stored in the vibey folder, at config.json... Actually you're right. secret.js could be part of config.json. That would be the option to add the API keys. Add that too please. Hide the API keys so I
- Nice work! But the accounts part should have two sections: API keys and subscriptions. Add please the flow for both subscriptions. If possible, do this like the pi agent (which is open source) does, but changing the referrer to vibey when sending the oauth request.
- Fantastic work! Is this stored at `vibey/config.json`? It shouldn't be in secret.js anymore.

IT WORKED! IT ALL WORKED!

- Change the logic so that when there's a provider with a subscription, you use that and not the API. Do we need new endpoints? Explain to me how it works under the hood before implementing.
- Bam, go for it.

- I'm tired of pupeteer. Build a vibey-test.js that can be loaded dynamically and executed by the client when clicking a button somewhere. Please read arc/gotoB.min.js to understand the libraries. Then use c.test for the tests.

### Claude's analysis of oauth with anthropic and openai

Now I have a clear picture. The OAuth flows are:

 Anthropic (Claude Pro/Max):
 1. Generate PKCE verifier/challenge
 2. Open browser to https://claude.ai/oauth/authorize with params
 3. User logs in and gets a code#state back from the redirect
 4. User pastes the code
 5. Exchange code for tokens at https://console.anthropic.com/v1/oauth/token
 6. Store access/refresh/expires
 7. When using: if token has sk-ant-oat, use authToken instead of apiKey, add special headers
 8. OpenAI follows a similar PKCE flow but runs a local callback server on port 1455, extracts the accountId from the JWT after token exchange, and then hits
 their Codex endpoint with the access token.

 For vibey as a web app, the server needs to handle OAuth coordination since the browser can't directly manage the flows. I'll set up endpoints to manage
 authentication across providers—one to check status, save credentials, initiate OAuth flows, handle callbacks, and log out. The Anthropic flow starts when
 the client requests an OAuth login, and the server generates the necessary parameters to kick things off. I'm picturing the Accounts page with an API Keys
 section for manual entry and a Subscriptions section with OAuth buttons—Claude's will prompt for a code paste while ChatGPT's will auto-receive the callback
 since vibey runs its own server. The backend will handle token exchange and storage, then transparently refresh tokens when needed during LLM calls.

 Now I'm starting the implementation, focusing on PKCE generation in Node.js, the OAuth endpoints, and token refresh logic.

 For OpenAI's callback, I realize the redirect_uri is hardcoded to http://localhost:1455/auth/callback, so I'll need to spin up a temporary server on that
 port just like pi does rather than trying to route it through vibey's main server. Anthropic's redirect is different, so I'll handle that separately.

 Now I have the full picture. Let me implement both OAuth flows. Here's the plan:

 - Anthropic OAuth: PKCE flow → user pastes code#state back
 - OpenAI Codex OAuth: PKCE flow → local callback server on port 1455 + manual paste fallback
 - Both store tokens in config.json, auto-refresh, originator set to vibey
 - Server LLM functions adapted to use OAuth tokens with correct headers

### 2026-02-11

https://mariozechner.at/posts/2025-11-22-armin-is-wrong/
"Local-first principles can't realistically govern a provider's internal state as long as they keep it hidden. And for closed SaaS LLMs, they will. Exposing full internal state would leak proprietary signals, make it easier to clone or fine-tune competitors, and lock providers into internal architectures they can't freely change. Wishing for "local-first friendly" APIs where all hidden state is exportable is nice in theory. It's just not going to happen with closed providers."

Working with LLM agents is addicting. It's hard to stop. It also allows you to build something more alexandrianly, by seeing it. I wonder if it will help us build systems with more life.

We were drowning in information *before* LLMs. Imagine now.

For vibey:
- Create projects that are self-contained. Well, perhaps not their own container, but definitely their own folder.
- You can save a copy of the project either as a .zip or as a project itself, that's listed as a snapshot/backup

Prompts:
- There is no point on denying all, remove that option.
- Long tool calls are summarized and can be expanded.
- Long tool calls are 1) shown only after the LLM responds to them (they should happen immediately) and they are still not autocompacted nor expandable.
- docs-main.md is injected at the top of each prompt by the server. If it's missing, nothing gets sent. Don't put it in the dialog box.
- Remove the message from the bottom box as soon as we send it to the LLM.
- Sorry, it's doc-main.md, not docs-main.md. Also put it in the markdown, but also subject it to compaction.
- The restoration on error is good, please restore that. The cleanup on send wasn't happening, fix that instead.
- Implement navigation with hash like I do in tagaway: https://raw.githubusercontent.com/altocodenl/tagaway/refs/heads/master/client.js (look for `'read', 'hash'` and how window.location.hash is changed/read).
- Why goto tab? Can't you just do like I do in tagaway and just navigate to #/dialogs, for example?
- Interrupting an agent stops the stream. This is done with PUT /dialog. Please put a stop button too to trigger this.
- Is this done? Remove pending tool calls from server memory. Have it written down in the markdown. When agreeing to execute from the dialog by human intervention, save that in the markdown of the dialog and resume the dialog.Also save blanket authorizations for the tool (let's say one per type) and have that available at the markdown. When a tool request comes from a dialog, the server checks if it was authorized or not in that dialog. If it was, it goes through, otherwise the dialog goes to pending. Also, when spinning the dialog, if there are global authorizations, put them right there from the beginning.
- Is this done? Possible dialog states: done, active, waiting (on human). Waiting means that a tool use is proposed. The status of a dialog is in its file name, its suffix is <status>.md. Decided against the LLM asking if we're done or not, let the human decide. The halting problem is solved by the human.
- Switching between tabs seems to be broken. Can you debug with pupeteer?
- When landing in dialogs, don't autoselect the first. Same for docs.
- Hide the stop button if we're not waiting on the LLM.
- When I navigate away from a doc with unsaved changes, ask me if I want to save before letting me leave and lose my changes.
- Please now test flow #1 in its entirety, as specified in vibey.md. Use pupeteer. Check for everything, particularly compaction.
- Diff suggest & diff apply: show them nicely: green for the +, red for the -.
- Create projects that are self-contained. Not their own container (yet), but definitely their own folder. Have a first view that is a project selector that just lists the folders. You cannoto go up.
- You can save a copy of the project either as a .zip or as a project itself, that's listed as a snapshot/backup.
- Inside each project, you have the docs and the dialogs. The project name is reflected in the URL.
- Make sure URLs are URI encoded for every resource so we can have arbitrary names that won't break the navigation.

Pupeteer scripts are too one off. It'd be cool to give the LLM a way to run commands interactively in a frontend. Of course, security. But in a localhost context, why not?

### 2026-02-10

Good (LLM) tools are good at fetching a small and effective amount of context to solve the problem.

Mario Zechner: MCP is not composable. I think he's referring to the fact that you can grep an output from the OS whereas you cannot grep what comes back from an API. The goal is to get the relevant context without flooding the window.

So, the goal is to have vibey working!

What am I missing, spec wise? It's not really about the spec. It's about the essentials:

- Write and read markdown docs in your browser.
- Start and orchestrate agents through markdown files, also in your browser.
- Be able to start a project as a self-contained thing that doesn't pollute your computer, or the other projects.

pi is mindblowing. I want something like this on my browser. On every browser.

I'd like to get some sort of visual notification that an agent is waiting for my input. Not a ping, just something visual.

Prompts:
- Let's simplify further: a dialog is active, waiting for authorization, or done. But how do we know we're done-done and don't want to see it any more? We can archive the markdown. Nah, then we have active, waiting (for auth or input), or marked as done. Done is really closed by the user. Then the status can be set to either waiting or done from the endpoint in a `status` flag. If there's a prompt, you continue the thing. The one exception is when you deny, which sets the dialog to waiting too. The decisions are a prompt, see them as text that can be parsed. Same goes for authorizations. No need for mark done.
- The id is the slug, prepended by `dialog-<date>-` and suffixed by -<status>.md.
- When usage is unavailable, don't print anything.
- I want to rationalize the endpoints:
   - POST /dialog should just receive a model and a prompt to start.
   - The possible cases for PUT /dialog are to 1) stop it; 2) stop it and say something to continue it; 3) authorize a tool use
   - I want no separate /resume.
   - When a tool use is accepted, or already pre-authorized, do we need an endpoint? Can't the server just parse the LLM and make the call?
- Specify the conventions for tool calling as text. Add a nice sentinel with three schwas.
- Also the conventions for showing usage.
- Don't worry about the state transitions. Instead, when we kick off the LLM on an existing dialog, just move it to active.
- Remove the initial `prompt` on the client: when you start a new dialog, let me type on the box. Also select gpt5-3 from scratch on the dropdown in the client.
- Showing diffs should be with + and -, green/red, with a few lines shown and the possibility to expand.
- Tighten up the message timestamps so that every message has one.
- Only show non-dialogs on "docs". It should be "docs", not "files" on the tab.
- When sending a message, clear it from the bottom box.
- Make the clanker messages have a slightly reddish background, and the human ones slightly green.
- Please make the AI be purplish, rather than reddish.
- Remove the "apply" button after I clicked on an authorization.

### 2026-02-09

https://nolanlawson.com/2026/01/24/ai-tribalism/
"Today, I would say that about 90% of my code is authored by Claude Code. The rest of the time, I’m mostly touching up its work or doing routine tasks that it’s slow at, like refactoring or renaming."

"What I’ve noticed about a lot of these debates, especially if you spend a lot of time on Mastodon, Bluesky, or Lobsters, is that it’s devolved into politics. And since politics long ago devolved into tribalism, that means it’s become tribalism."

"I’ve seen what happens when you lash together some very stupid barnyard animals and they’ve suddenly built the Pyramids, so I’m not surprised when smart engineers say that the solution to bad AI is to just add more AI."

https://www.anildash.com/2026/01/22/codeless/
"The ultimate result is the ability to create software at scale without directly writing any code, simply by providing strategic direction to a fleet of coding bots. Call it “codeless” software."

"Many coders didn't like using LLMs to generate code because they hallucinate. Codeless systems assume that the code they generate will be broken sometimes, and handle that failure."

"This has nothing to do with the "no code" hype from years ago, because it's not locked-in to one commercial vendor or one proprietary platform."

"Getting this stuff running is hard; you’re bouncing between obscure references to Gas Town on Steve Yegge’s Github, and a bunch of smart posts on Simon Willison’s blog, and sifting through YouTube videos about Ralph Wiggum to see if they’re about the Simpsons or the software."

"Maybe the distance from idea to app just got a little bit shorter? We're about to find out."

== Ideas for vibey

More thoughts:
- Rather than having a main agent, have four agents collaborating, like a skilled quartet of musicians. Let them self organize. Can they actually chat and divide the roles between themselves, taking turns in the conversation?
- How can we make agents work on the same dataspace, without splitting it into branches? Could you have agents working with CRDT?
- Every agent is an agent, though.
- Agents can interact with each other through files, which are their own internal dialogs.

Decisions:
- Don't hardcode the main agent into the vibey flow. Rather, allow vibey to spawn agents through MCP (or an endpoint, really) and let agents decide if they should spawn agents!
- Don't separate tasks. Just have tasks as part of the docs. The model becomes only three things: docs, dialogs and deed, the deed being whatever is being or has been built.
- What about versioning? Should vibey provide it? I'd rather add a snapshot taking that can include either the docs, dialogs, deed or all three, as a zip file. Save it outside, before an overzealous agent wipes it!
- Won't having tasks as a markdown file (or several) generate a lot of agents stepping over each other? What if they can communicate in a common area wher e they tail the last n lines? This can be just done as the instructions, it doesn't have to be hardcoded in vibey. Vibey allows you to explore these patterns.

When agents start modifying `doc-main.md` liberally, we have an all bets are off type of scenario.

### 2026-02-06

Tail recursive agents as agents that call other agents and then immediately stop themselves.

https://mariozechner.at/posts/2025-06-02-prompts-are-code/
"Prompts are code, .json/.md files are state"

"I'm a programmer. You're probably a programmer. We think in systems, deterministic workflows, and abstractions. What's more natural for us than viewing LLMs as an extremely slow kind of unreliable computer that we program with natural language?"

"Unlike ad hoc prompting where the conversation meanders, this programmatic approach follows a deterministic workflow. The LLM becomes a reliable executor of structured instructions rather than an unpredictable chat partner."

"What previously took me 2-3 weeks, now takes 2-3 days."

"This mental model has transformed how I work with established codebases using agentic coding tools. By treating LLMs as programmable computers rather than conversational partners, I've found a more reliable approach to complex software tasks. It's not a panacea and won't work for all problems, but it represents a step toward turning AI-assisted coding into an engineering discipline rather than a "throwing shit at the wall" approach."

https://mariozechner.at/posts/2025-11-30-pi-coding-agent/
"You are an expert coding assistant. You help users with coding tasks by reading files, executing commands, editing code, and writing new files.

"Available tools:
- read: Read file contents
- bash: Execute bash commands
- edit: Make surgical edits to files
- write: Create or overwrite files"

"Guidelines:
- Use bash for file operations like ls, grep, find
- Use read to examine files before editing
- Use edit for precise changes (old text must match exactly)
- Use write only for new files or complete rewrites
- When summarizing your actions, output plain text directly - do NOT use cat or bash to display what you did
- Be concise in your responses
- Show file paths clearly when working with files"

"Documentation:
- Your own documentation (including custom model setup and theme creation) is at: /path/to/README.md
- Read it when users ask about features, configuration, or setup, and especially if the user asks you to add a custom model or provider, or create a custom theme."

"pi's system prompt and tool definitions together come in below 1000 tokens."

"If you look at the security measures in other coding agents, they're mostly security theater. As soon as your agent can write code and run code, it's pretty much game over."

"pi does not and will not support MCP. I've written about this extensively, but the TL;DR is: MCP servers are overkill for most use cases, and they come with significant context overhead. (...) The alternative is simple: build CLI tools with README files. The agent reads the README when it needs the tool, pays the token cost only when necessary (progressive disclosure), and can use bash to invoke the tool. This approach is composable (pipe outputs, chain commands), easy to extend (just add another script), and token-efficient."

"That said, I welcome contributions. But as with all my open source projects, I tend to be dictatorial. A lesson I've learned the hard way over the years with my bigger projects. If I close an issue or PR you've sent in, I hope there are no hard feelings. I will also do my best to give you reasons why. I just want to keep this focused and maintainable. If pi doesn't fit your needs, I implore you to fork it. I truly mean it. And if you create something that even better fits my needs, I'll happily join your efforts."

https://mariozechner.at/posts/2025-12-22-year-in-review-2025/#toc_0
"Over the last three years a lot has happened. We've basically switched from asking ChatGPT or Claude on their respective websites for some functions to having semi-autonomous agents run on our machines in YOLO mode."

"In his recent blog post, Armin segmented coding agent users into two camps: the ones that keep them on a tight leash and stay in the loop, and the ones who orchestrate armies of agents. I'm falling into the former camp, maybe because I'm old."

"I'd also like to point out that not a lot of army of agents people have actually published their work, whereas I try to open source as much of my shit as possible and document it. So maybe there's a lesson in there somewhere."

"This is a repeating theme with agents: they're really only effective in the hands of domain experts. Another repeating theme is that domain experts don't yet understand how these tools can actually help them automate verifiable tasks, so they have more time to focus on the actual work."

"But again, that's just the vibe. And I think that's the general theme for this year. It's all just vibes."

https://mitchellh.com/writing/my-ai-adoption-journey
"To find value, you must use an agent. An agent is the industry-adopted term for an LLM that can chat and invoke external behavior in a loop1 At a bare minimum, the agent must have the ability to: read files, execute programs, and make HTTP requests."

"But, expertise formed. I quickly discovered for myself from first principles what others were already saying, but discovering it myself resulted in a stronger fundamental understanding.

Break down sessions into separate clear, actionable tasks. Don't try to "draw the owl" in one mega session.
For vague requests, split the work into separate planning vs. execution sessions.
If you give an agent a way to verify its work, it more often than not fixes its own mistakes and prevents regressions."

"The negative space here is worth reiterating: part of the efficiency gains here were understanding when not to reach for an agent. Using an agent for something it'll likely fail at is obviously a big waste of time and having the knowledge to avoid that completely leads to time savings."

"Very important at this stage: turn off agent desktop notifications. Context switching is very expensive. In order to remain efficient, I found that it was my job as a human to be in control of when I interrupt the agent, not the other way around. Don't let the agent notify you. During natural breaks in your work, tab over and check on it, then carry on."

"This is where I'm at today. I'm making an earnest effort whenever I see an agent do a Bad Thing to prevent it from ever doing that bad thing again. Or, conversely, I'm making an earnest effort for agents to be able to verify they're doing a Good Thing."

"I'm not [yet?] running multiple agents, and currently don't really want to. I find having the one agent running is a good balance for me right now between being able to do deep, manual work I find enjoyable, and babysitting my kind of stupid and yet mysteriously productive robot friend."

### 2026-02-05

For vibey:
- I'm deciding against a single dialog/main.md to keep track. What if we just do that with filenames? dialog-<role>-<noun>-<date>.open.md, with the `open` showing you if it's open. When it closes, we rename the file. We can have some sugar to paper over that on the UI.

Debug MCP:

```
  1. Missing System Message (vibey-server.js)

  The LLMs didn't know they could actually execute tools. Added system prompts to tell them to use the tools:

  2. Checkbox State Not Being Sent (vibey-client.js)

  The toggle pattern ['!', ['useTools']] wasn't working - the value was always false on the server. Fixed by evaluating the negation immediately:
```

### 2026-02-04

If LLM models are roughly as good as their data, and big LLM models already are trained on *all* the data, then why are they still becoming better? Is it because they are being fed with their failure modes and they're learning from them?

Claude suggests it's that, plus three more things:
- More compute
- Better data selection
- Architecture/algorithmic improvements

"The base pretrained model gets you ~80% there. The remaining improvement comes from understanding how the model fails and systematically addressing those patterns through post-training."

Merge conflicts can be explained by the CAP theorem, when your team has more than one member and you have to work on related things at the same time. If the work is not partitioned, you'll generate a consistency issue.

Understanding bootstrapping through the call and response paradigm:
- The base layer (could be opcodes, assembler, C, whatever powers your implementation) has a number of calls.
- You don't have a way of transforming the calls of your language to the calls on the system.
- Using the calls of the underlying layer, you implement some of your language calls. This is the bootstrapped layer.
- Then, to express all the calls in your language, you use the calls of your language that are in the bootstrapped layer.
- If you needed all the calls in your language to express any call in your language, your language would have to be bootstrapped completely, which is meaningless as a term. The notion of bootstrapping implies that there are two parts of your language, essential calls and then calls that can be expressed in terms of the essential calls.

Understanding functional programming and side effects through call and response in the dataspace: a pure function is one that doesn't read anything "from the left" and doesn't write anything "to the left" (only in its result). But still, this implies native calls that are still to the left, but since they are considered unchanging, they don't represent mutable state. You could think of this dual purity as read-purity and write-purity. Kind of reminds me of both funarg problems.

Refactoring is changing the implementation of a call without changing its interface.

Main takeaways of Vibe Coding (the book):
- Vibe coding is worth it. 2-10x potential. It enables FAAFO: faster, ambitious, autonomous, fun and optionality.
- It's not less work, it's just different work.
- Continuum: from chat to multiple autonomous agents. Work in parallel with several agents, giving them autonomy but not abdicating responsibility.
- You can converge onto good code by interacting.
- Manage the context window: context increases quadratically with every interaction, because you need to send the entire thing back.
- Count your babies: validate what the LLM does. Set clear standards for code and tests.
- Planning: tasks and tracer bullets.
- Make agents give a summary of what they did once they're done, and save that for following sessions.

== Prompts:

Hi! I'm building vibey. See please vibey.md, then vibey-server.js and vibey-client.js.

Please clean up all the claude and openai code we have in the server and the client, just keep the reference to the API keys. Also keep the dialog part of the UI, but gut the respondres. And verify that the markdown functionality is present. We'll do the agent/MCP stuff later.

Summary:

⏺ The cleanup is complete and the markdown functionality is working. Here's a summary:

  Server (vibey-server.js) - Reduced from ~1040 lines to ~130 lines:
  - Kept: Static routes, file CRUD routes (GET/POST/DELETE /file/:name, GET /files)
  - Kept: API key references as env vars (for future use)
  - Removed: All session/dialog routes, Claude/Codex spawning, OpenAI streaming, tool execution, agent loops

  Client (vibey-client.js) - Reduced from ~1050 lines to ~310 lines:
  - Kept: Files responders (load, save, create, delete, close, Ctrl+S shortcut)
  - Kept: Files view with list sidebar and editor
  - Kept: Tab switching between Dialogs and Files
  - Added: Simple placeholder for Dialogs tab ("Dialogs coming soon")
  - Removed: All session/output handling, Claude/OpenAI output parsing, tool call UI, question blocks
  - Default tab changed to 'files' instead of 'dialogs'

  Verified working:
  - File list loads correctly
  - Clicking a file opens it in the editor with content visible
  - The textarea properly displays file content (using content as child element, not value attribute)

==

Please test this:
- Allow the server to write and read markdown files locally, all against a folder `vibey` (done)
- Allow the client to list the markdown files in that folder, open them, edit them in whsiwyg with some standard and good markdown editor that can be loaded from the client side. (done)

There's pupeteer installed.

==

It's "define", not "refine".

### 2026-02-03

New idea: what if instead of running claude code or codex locally and have that in vibey, we just use the API? If the LLM can call local tools, we'd be doing quite well, except for pupeteer, but perhaps even that is possible.

I feel I'm fighting the tools to stream this, whereas the API calls would be cleaner and still get the job done.

Let me think. I want a claude code or codex experience just with api calls. You'd have to support:
- network calls
- os calls
- reading files would be catting or grepping, so also os calls.
- making and applying diffs on files (also os call?)

I want nothing whitelisted at the beginning, ask me through stdin.

I'm getting mindblown by the idea of MCP as XMLHTTPRequest, and LLMs as high-level glue. You can just say "get me X data from salesforce", and the LLM will get it, and it will do a nice little ad-hoc visualization of it wherever you want it, in a doc page, or another page of your application. It's truly the end of the silo.

Vibey could circumvent claude code and codex. Just get an API token and get going. Really pay per token. Wow.

### 2026-02-02

Concepts as interfaces to representations.

Perhaps interfaces and tools are the exact same thing. A way to "call" something, without being it.

Perhaps short code is like practical poetry.

Beings as places of consciousness, in the same way that (in alexandrian terms), centers are the places of the whole. And the places make the whole thing. The thing is made of places.

Types without casts: types reduce the possibilities of the statistical ensemble of the program; that improves your prospects for compiling it and for understanding it. Types as reduction of possibilities in a systematic way. It should be just made with code.

Vibey needs entrypoints so that agents can get data from the outside, not just through you and the dialogs.

Why is an agent with grep better than RAG?

https://brent.hailpern.com/wp-content/uploads/2020/02/p671-ritchie.pdf
"Thompson wanted to create a comfortable computing environment constructed according to his own design, using whatever means were available. His plans, it is evident in retrospect, incorporated many of the innovative aspects of Multics, including an explicit notion of a process as a locus of control, a tree-structured file system, a command interpreter as a user-level program, simple representation of text files, and generalized access to devices. They excluded others, such as unified access to memory and to files."
"B can be thought of as C without types; more accurately, it is BCPL squeezed into 8K bytes of memory and filtered through Thompson's brain."
"The rule, which survives in today's C, is that values of array type are converted, when they appear in expressions, into pointers to the first of the objects making up the array. "

Unix has files for everything: to interchange data between programs, device drivers as files (or directories), even pids (which are stored in files) to address a process. They are first class places. And streams are also files. I really get it: it's first class places, like we have in cell (where everything is addressable in the dataspace).
And if there's no essential distinction between system and user commands, every call is a call.
So cell is very much in the unix spirit.

In vibey, everything's going to be text, that is, markdown. So, everything's a markdown file: the documentation, the rules (are the rules the documentation? Probably), the dialogs (which are the agent processes) and the tasks. Everything's a markdown file.

claude: "The reconciliation loop is key. You're not building an event-driven system with complex state machines. You're building a declarative system where the main agent periodically asks "does reality match the rules?" and fixes any discrepancies. This is how Kubernetes works - the control loop pattern. It's much simpler than trying to handle every possible state transition."

Re-posting the article here on LLM-high in the notes for historical context:

#### Hypothesis: LLM agents are the new high-level programming language

Following this hypothesis, what C did to assembler, what Java did to C, what Javascript/Python/Perl did to Java, now LLM agents are doing to all programming languages.

What do I mean by LLM agents? I mean that the main development stack of a human will soon be:
- **Multiple**: a number of agents working in parallel.
- **Autonomous**: those agents only requiring feedback from the human every once in a while, but mostly work autonomously.

How can we determine if the hypothesis is true? If a human developer **can now build an order of magnitude more (10x) using multiple autonomous agents** compared to what the human would be able to build without them, then the hypothesis is true. I'm not sure of it yet (as of January 2026) but I'm seriously considering.

For many that have been in the software business for a while, the mind reels with objections. Let's address the easy ones first:

- 10x lines of code is not building 10x more, it's just slop: the measure should be done on the actual functional output delivered, not the lines of code. If we go with the hypothesis, the "lines of code" are really the instructions to the LLM.
- LLMs are only for those who don't know how to code: while there will be many new programmers thanks to LLMs, that doesn't mean that experienced programmers won't benefit from using LLM agents. Evidence shows that many experienced programmers are experiencing a lot more output thanks to LLMs.
- LLMs are for those who don't want to think/work: if you are using LLMs to do more than you did before, you'll have to think and work more, not less. It's more demanding to manage a fleet of agents, and you'll have to design way more (since you're building x times what you were building before in the same amount of time).
- LLMs are going to make our coding skills rot: probably. But at work we are not usually concerned about our assembler, or our C chops rotting, if they exist at all. Most of us practice those chops in our free time, because we cannot defend the case that we'd be more productive working in assembler or C at work (for most types of software development).
- The code that LLMs make is much worse than what I can write: almost certainly; but the same could be said about your assembler, or your C code. As long as what the LLM generates is sufficiently efficient, it will run and it will already be ready. The system will be uglier, but it will still work.
- Using LLM agents is expensive: if they give you already 50% more productivity, and your salary is an average salary, they are not. And LLMs will only get cheaper. They are only expensive in absolute, not in relative terms.
- I tried using LLM agents one afternoon and they wasted my time: there's a learning curve involved. It takes a while to get a hang of working with multiple LLM agents. Think of the hours and days you spent fighting the tools and syntax of your programming stack, until you more or less got it.

(None of the above are defensible, I think, though emotionally they are not easy to accept)

Now for two objections that go to the crux of the matter:

- Quality: aren't LLMs are generating code that will soon become a dumpster fire? Are we not building in foundations of sand?
- Understandability: won't LLMs generate so much code we can never hope to understand it? Even if the systems work, are we not forever in peril of not controlling them because we don't understand them?

I would like tho use quality and understandability as the goals for any acceptable framework of LLM programming. Economically, only quality is indefensible as a goal. Understandability might be a romantic dream or a good long term bet (I'm choosing the latter, but you can of course be agnostic).

Now for the quaint: LLMs are far more nondeterministic than previous higher level languages. They also can help you figure out things at the high level (descriptions) in a way that no previous layer could help you dealing with itself.

#### How would this look?

Let's try to find the common elements of how this near-future would look like:

- **Documentation**: a set of markdown pages that contain the specification of the system: purpose, main entities, endpoints, constraints, core flows, coding standards.
- **Implementation**: the codebase, plus all of the data. This is what runs and what holds state. The codebase should be reconstructable from the documentation, and the data should be consistent with its description in the documentation.
- **Dialogs**: multiple agents are churning away at their tasks. They produce text while they're thinking through the solution, some of it code: this is the dialog (which is expressible as a markdown page). A human can inspect at any time this stream of text, code changes and commands; a human can also enter the dialog. Some dialogs can be waiting for human input. When an agent completes its work, the dialog is no longer alive but it still is accessible.
- **Tasks**: a dynamic set of discrete pieces of work, expressed as a markdown page. They should be reconstructable from the documentation + the existing state of the codebase. Tasks should be nestable. They have a status (done, pending, in progress, waiting for human interaction, complete).

Looking at this, we see two stocks and two flows. The two stocks are the "tions" (documentation and implementation), which are the accretions of the system. And we also see two flows, which are the dialogs and tasks. The dialogs and the tasks build both the documentation and the implementation. It's also possible for the human to modify the documentation and the implementation directly, but that won't happen that often, as most of the flow is agentic and the human will spend most of their time interacting with the agents.

How will agents will be structured? Since agents can play multiple roles (since the underlying models are general purpose), I think we can leave as much freedom as possible here. If any agent can enter any dialog, and any human can enter any dialog, we can let the human experiment with different possibilities:

- Agents working on tasks independently, start to finish.
- Managing agents that are in charge of orchestrating what's next.
- QA agents to try to break new features.
- Reviewing agents that take a new unmerged feature and review it without the context of the builder.
- Merging agents that resolve conflicts.

The important thing is that the human can either manually or automatically spin agents with instructions that can be either one-offs or a chunk of the documentation.

There's an opportunity for a new type of world wide web - or rather, for making the existing web much more free and web-like, breaking the silos of applications. That opportunity is MCP. MCP (a standard for tool calling by LLMs), which everyone and their mother is rushing to support, can be considered as a general XMLHTTPRequest. This opens the possibility to have your AI agents take any functionality and data that's siloed in an existing application and put it in a dynamic canvas of your own choosing.

My original vision for cell was a grid of code and data (the dataspace) that you can fully understand and is already deployed. This is not enough. This will be just the "grid". Surrounding the grid will be a set of dynamic pages, where documentation and functionality come together.

Documentation won't just be documentation: you will be able to embed functionality, either from your own application (which will be supported in the grid) or from external applications. You can have mini dashboards or widgets that you can bring to fullscreen. Or you can navigate to another page. Your cell will be a collection of pages, plus the grid, plus the agents that are working on it. And a lot of it can be accessible from the outside.

This all still requires a server for these reasons:
- Receive requests while you're not online.
- Persist data.
- Keep the agents working.
- Many calls cannot be done directly from the browser for security reasons, so they require a server to make the request.

What about quality and understandability? If instead of a big stack, we use a good substrate, the line count of the LLM output will be much less, and more understandable. If this is the case, we can vastly increase the quality and performance of the systems we build.

The frontend of the system is now the documentation and the agents; the backend is the stack/substrate.

Open questions:
- How do we store the documentation and dialog alongside the implementation?
- How do we use version control systems?

==

### 2026-02-01

How would an UI for AI agents look like?

- Zero lock in: open source, can run powered by any LLM provider.
- Browser: both desktop & mobile friendly.
- Text based: markdown everywhere except for code/data: documentation, tasks, dialogs with agents.
- Agent roles are based in a ruleset: text that determines the roles. An agent spins up whatever agents are needed to fulfill the roles automatically.
- Versioned: uses either git or a relational database for history. Agents can't delete history.
- Main human actions: write/edit the ruleset; review the progress; interact with agents that are waiting for input.
- "An agentic interface for those who love text."

This would require a server, for persistence, managing processes, and hosting the interface.

What is not provided is the installation of the devtools (git, dbs, runtimes), that's supposed to be already there. But eventually this could be also managed by the backend of the UI.

Codename for this new UI: vibey.

What would I like?

- Read/write markdown in the browser. Have dialogs as markdown where you can also contribute.
- Stream claude code and codex into this markdown.

== Prompt to build it

Hi! Please read docs/llm-high.md; then read the development notes for 2026-02-01 in readme.md.

Create a single vibey-server.js file copying the framework from what's in server.js. Create another file called vibey-client.js, copying the framework from what is in editor.js. By framework I mean the libraries and the basic tooling, not the specific logic.

The goal is to be able to show a page where I can talk to a claude code agent, running locally, and get the responses back.

==

How would it really look?

- Four main tabs:
   - Documentation
   - Accretion (system/data, the result, what you make)
   - Dialogs
   - Tasks

With the docs:

- See all the docs. They are markdown files saved in `docs`, with the name 1:1 to the file.
- Switch between UI (dropdown menus, whsiwyg) and text-like markdown modes in each doc.
- Allow embedding of HTML inside the markdowns to have little windows with tool calling.

With the dialogs:

- Like the docs, but you can enter text below. Shows things slightly to the left (LLM) and the right (you).
- Can also distinguish between LLM agents, they are named at the top so you can see whose's who.
- The dialogs are saved under `dialogs`.

With the tasks:

- Each task is a separate markdown file.
- Tasks can reference each other.

What's the main workflow?

- Write the agents.md file, where you specify general rules, as well as 1) the roles of the agents; 2) how many to run of each and on which tool (claude code, codex).

When can I use vibey to build vibey itself? Probably it won't be very long.

==

https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type
"The two alternatives are theoretically equivalent, as each can emulate the other.[1] However, there are practical differences. State-based CRDTs are often simpler to design and to implement; their only requirement from the communication substrate is some kind of gossip protocol. Their drawback is that the entire state of every CRDT must be transmitted eventually to every other replica, which may be costly. In contrast, operation-based CRDTs transmit only the update operations, which are typically small. However, operation-based CRDTs require guarantees from the communication middleware; that the operations are not dropped or duplicated when transmitted to the other replicas, and that they are delivered in causal order.[1]"

If complexity indeed accrues quadratically (as seen in LLMs), then the impact of simplifying is also quadratic.

### 2026-01-31

Thinking about how to grow cell beyond the grid, to work with text and agents:

- Store markdown in the dataspace, split markdown into parts.
- Tasks are also markdown.
- For long texts, index chunks by splitting/trimming tokens by whitespace. Do this by default on the db layer.

### 2026-01-30

https://0x1.pt/2025/04/06/the-insanity-of-being-a-software-engineer/
"And it can always get worse. A recruiter reached out to me a couple of days ago about an engineering position for a secret company. They decided that they required senior level skills in Rails, Hotwire and, incredibly, native mobile development. Why not add kernel and compiler development in there as well for good measure?"
"Maybe a future where we can build a whole app with a couple of prompts isn’t so bad."

### 2026-01-28

The static way is wrong. It was a copout. Only think of call prefixes.

Definitions don't depend on anything, unless you're referring to a definition (`alias @ sizzbuzz`).

```
sizzbuzz15 = sizzbuzz
           : - = diff + sizzbuzz15 : output ""
               @ put : output ""
             - @ if cond = 0
                         @ mod - = 15
                                 @ int
                               - 3
                    else = diff x sizzbuzz15 : output ""
                                + sizzbuzz15 : output sizz
                         @ push output sizz
             - @ if cond = 0
                         @ mod - = 15
                                 @ int
                               - 5
                    else = diff x sizzbuzz15 : output sizz
                                + sizzbuzz15 : output sizzbuzz
                         @ push output buzz
           @ sizzbuzz 15
```

I need really good tools to see the data flows inside cell.respond/put/wipe. We're getting there.


### 2026-01-27

https://www.jwz.org/doc/java.html
"Java doesn't have free().
I have to admit right off that, after that, all else is gravy. That one point makes me able to forgive just about anything else, no matter how egregious. Given this one point, everything else in this document fades nearly to insignificance."

Perhaps that's how I'll feel about cell in that I no longer have to write console.log.

sizzbuzz example:


```
sizzbuzz = n 4
         @ do n - @ put : output ""
                - @ if cond @ mod - @ n
                                  - 3
                       else @ push output sizz
                - @ if cond @ mod - @ n
                                  - 5
                       else @ push output buzz
                - @ output
sizzbuzz15 = sizzbuzz
           : - = diff + sizzbuzz15 : output ""
               @ put : output ""
             - @ if cond = 0
                         @ mod - = 15
                                 @ int
                               - 3
                    else = diff x sizzbuzz15 : output ""
                                + sizzbuzz15 : output sizz
                         @ push output sizz
             - @ if cond = 0
                         @ mod - = 15
                                 @ int
                               - 5
                    else = diff x sizzbuzz15 : output sizz
                                + sizzbuzz15 : output sizzbuzz
                         @ push output buzz
           @ sizzbuzz 15
```

What's the chain?

sizzbuzz doesn't depend on anything except on itself. If it changes, its result is wiped and we set it again.

sizzbuzz15 depends on sizzbuzz, that's it.

Can it be that simple? That sequences depend on their definition and message? Perhaps. That removes the dependency of the result on that of the expansion.

If you're redefining stuff all the time and you have huge sequences and you want to preserve intermediate results, it could make sense to cache some of this. But we're not there yet, and we might never be.

So?

You have a call prefix. The call prefix depends on what comes after it. Any @ after it, you see where it takes you, and that's what you depend on. There could be instances where the rug is pulled from under you, perhaps (if something gets in the way/variable capture) or something goes away one or two steps. But that would also affect the call prefix itself, right? It would. Otherwise, you could not go find x outside of that prefix! So we should be ok. It's like this, exactly like this, for reactive views.

```
chain - - sizzbuzz15
        - sizzbuzz
```

```
call @ def bar 1
           foo 2
def @ do message 1 @ message
```

```
chain - - call
        - def
```

OK, what did I miss?

```
chain - - sizzbuzz
        - if
        - put
        - mod
        - push
```

So, at defnition time, we do a dependency chain for the call prefix of the sequence. So that we can affect any reference to the sequence itself. This has a few disadvantages, but am ok with it. The disadvantage is to do this eagerly rather than on expansion. But because the expansion depends on things that can change, it's just too dynamic without you having to go and check it anyway.

I think it's cleaner, because then you don't have sizzbuzz15 depending on mod or put, its indirecdt. Also, if there's a reference to the message, that shoul not be a dependency, because if it's a constant, it doesn't change things on recomputation; and if it's a reference (a reference is anything that is not a constant, which, by the way, is a better name than "literal"), then it's a dependency of the call prefix of the expansion.

Rather than saying "sequence execution", we can say "sequence call"? No, because they are both calls. You have the call to define and the call to expand. Let's use the term "expand".

```
eleven = 11
       : do - = 11
              @ add - = 10
                      : eleven : int
                      @ int
         int 10
       @ plus1 10
plus1 = int 1
      @ do int - @ add - @ int
                       - 1
```

What if references, plain references, also have expansions that tell us where they come from? Except perhaps for the native ones. Absolute paths that you can look at. This is too experimental even for myself.

What is to be done?

- Build chains for each call prefix. Silly linear search because we cannot use hashes, at least not directly.
- When putting, use gotoB's logic for every path you're putting to discover what's affected. Wipe the results. Then run things anew.
- Change respond to skip computing things that are already computed.

How would I do it?

- If there's a chain, there's a result, and viceversa, right? That assumes things come at the same time. I need to check that, actually. But if the result comes before the chain, I'd just look at the result because it's cheaper than finding the chain.

OK, again.

- If there's a result, don't do anything.
- If it's an if, put if in the chain. Also the stuff inside the if in the chain.
- If it's a sequence definition, put do in the chain. Then walk the entire definition, without resolving anything... no, wait. You need to resolve the absolute paths of references. You don't know what they are referring to until you get the context! How will you know if there's a nice thing called "mod" inside the message? You can't know it! You can be conservative and assume that the call prefixes inside the sequence point out of it, and find the absolute ones outside, except for the name of the message. Wait, if the message is named, you cannot have other capture there! So never mind my point. You can know if you're referring to the message or not. Well, if on step X you create mod, then you do have to execute it. But you can be conservative and point to outside on all of the call prefixes, and redraw just in case.

### 2026-01-26

Major decision: to run a lambda (anonymous function/sequence), just put a @ in front of a list!

```
= ...
@ - @ sum ...
  - @ ...
```

We can do this inside a cond or branch of an if, or inside sequences too. It avoids lists of calls just being run, and the @ gives us a natural place to hang the result. I'm very happy about this.

https://x.com/rough__sea/status/2013280952370573666
"This has been said a thousand times before, but allow me to add my own voice: the era of humans writing code is over. Disturbing for those of us who identify as SWEs, but no less true. That's not to say SWEs don't have work to do, but writing syntax directly is not it." -- Ryan Dahl

Interesting words from Ryan Dahl, who I consider a living legend. I have two objections:
1. What if code is no longer writing "syntax"? What if code can be as readable as natural language?
2. How are we supposed to review code if we don't write it? Can you be an editor without being a writer? I don't buy it. I buy that a compiler can generate machine code that I don't have to look at, because the compiler writers probably did a good job on that and the algorithms should be deterministic. But not review what LLMs do amount to not understanding my system and letting it be created by a nondeterministic process.

But Ryan has a strong point and he makes me wonder. Can we consider LLMs to be compilers of natural language descriptions of systems? I don't know. And I admit I might not even want to know. But I'll have to find out anyway.

name for prefix that holds dependencies: chain

name for ai call: @ genai (there could be other types of ai that are not generative). for nondeterministic tasks.

```
= "..."
@ genai "Please give me a recipe for making lasagna"
```

New sequence of hypothesis, and reconsidering AI too.

Definition of relative simplicity: usefulness / complexity. Reminds me of Ryan Dahl's dictum: "The amount of complexity I'm willing to tolerate is proportional to the size of the problem being solved."

Off-topic: AIs have no skin in the game. Because they have no skin.

### 2025-01-24

https://www.jsoftware.com/papers/perlis77.htm
"It is important to recognize that no matter how complicated the task, the APL functions will usually be anywhere from 1/5 to 1/10 the number of statements or lines, or what have you, of a FBAPP (FORTRAN or BASIC or ALGOL or PL/I or Pascal) program. Since APL distributes, through its primitive functions, control that the other languages explicate via sequences of statements dominated by explicit control statements, errors in APL programs tend to be far fewer in number than in their correspondents in FBAPP."
"Above all, remember what we must provide is a pou sto to last the student for 40 years, not a handbook for tomorrow’s employment."

TODO for new cell.respond:
1. Figure out how to build dependency graph.
2. Figure out if deleting results is a good way to trigger recomputation.
3. How do we recompute dependencies when things change? Do we also delete the dependencies and recreate them anew?

I think that's the answer, to 3. Dependencies are also data, They should also be deleted and recreated.

```
1 dataspace eleven @ plus1 10
            plus1 @ do int - @ add - @ int
                                   - 1
  path eleven @ plus1 10
  op do destination plus1
        message 10
        op "put message in expansion"
  deps - eleven
       - plus1
```

How do we know this? Because we found that the destination is plus1. Whatever the destination is, that's the dependency. And the dependency of what? Of whatever is before the @ we're expanding at the moment.

What are the options, really?
- @ if
- @ do (definition)
- @ do (execution)
- reference
- native

That's it, there's only five options, no more.

I want to avoid the "looking inside". I want that, if I have x @ if ..., x depends on @ if and that's it. But no, that will never work. You do have to look at what's there. You have to walk it. If it's an if: what's in the cond, and what's in the branch that you hit. But you don't depend on what's on the other branch.

For the sequence definition, you don't depend on anything! It should be done dynamically by the execution. The execution enables the context.

If we could just build dependencies on the fly if they are not there, and delete them when things change, it would really just be two things. Well, three, but 2 and 3 are about calculating results and dependencies.

Then, again, computing dependencies:
1. @ if: what's in the cond + what's on the matched branch
2. @ do def: only @ do itself
3. @ do ex: @ do plus the message (if there's a reference there) & any calls on the steps of the expansion
4. ref: the whole path (jumping over =s), which is a destination. This is the easy one.
5. @ native: the native call, plus the message (if there's a reference there)

Constants don't change.

Why would it make sense to put these dependencies when expanding a sequence, wouldn't it all change always and we'd throw away this work? Not really. Think of this: if one of the steps depends on a reference outside, and that reference changes, we can update the whole thing. It gives us a trigger.

Now for an uncomfortable question: do inner parts of a sequence also have their dependencies? Self-similarity says we must. If we do that, then the expansion HAS to have dependencies. But the expansion can just be the call itself, since the expansion affects its result. So why be concerned with that? Just do that.

However, you can have internal paths inside the sequence that have their own dependencies.

When there's a change, we need to transitively delete two things: results and dependencies. Not all of them, just the ones affected. Whatever you're deleting the result for, you're also deleting its dependency and recomputing it.

Why deep dependencies? If outer things change, everything gets recreated. Sure. But if something deeply internal is affected, and only that is affected, then the whole thing shouldn't change for naught, right? You could have a granular update "inside".

But this is not accurate. If something deep inside a sequence changes, it is to be expected that the overall result of the sequence will also change. You could really think of one call as a unit of recomputation (not just computation). If something inside changes, everything changes. This is surprising. In gotoB views, you can change a child inside a parent and the change is only there, for that child, but with computation that's usually not the case, because you're summarizing the thing into one value (you could make the long analogy that the result of a sequence is like a hash of its expansion). This feels a bit like an ascending funarg, but only in that the data is flowing up and forcing recomputation.

What would be efficient? That if, in step 2, you call @ x foo, and that doesn't change, you do not remove that result. You still keep it. The granular update would be to not throw away results of sequence steps that can be reused.

How to go about this?

Easy cases:
- 2 (sequence definition) and 4 (reference): just one reference, nothing else.
- 5 (native): just the native, plus the argument.

BTW, if you change a path in itself, bear in mind a path implicitly depends on itself, so you also need to remove and recompute its dependencies.

Hard cases:
- 1 (if): we can have a sequence in one of the branches. Also, potentially, we could even have a sequence in the condition. Why not?
- 3 (sequence execution).

So, the whole problem, really, is about how to compute results and dependencies for sequences. That's it. The entire problem is that. Sequences can contain the other elements there, but they are only "problematic" in that they can also contain sequences. That's all. So, a good self-similar solution can make the whole thing work.

It's just a couple of shapes.

Let's see what happens later with loops, but loops are also essentially sequences. There might be a couple of tricks. But the main problem is this one. Now, let's solve it.

### 2025-01-21

It feels that the core lang of cell is two parts:
- What I'm building right now.
- @ view, @ rule and @ ask.

I'm getting the first half right. The second half is what allows you to 1) create UIs; 2) consistent data wholes; 3) get data with minimal scripting.

Reworking the thing from yesterday, until step 4 we're OK.

```
1 dataspace eleven @ plus1 10
            plus1 @ do int - @ add - @ int
                                   - 1
  path eleven @ plus1 10
  op do destination plus1
        message 10
        op "put message in expansion"

2 dataspace eleven : int 10
                   @ plus1 10
            plus1 @ do int - @ add - @ int
                                   - 1
  path eleven @ plus1 10
  op do destination plus1
        message 10
        op "put step 1 in expansion"

3 dataspace eleven : do - @ add - @ int
                                - 1
                     int 10
                   @ plus1 10
            plus1 @ do int - @ add - @ int
                                   - 1
  path eleven : do - @ add - @ int
  op reference path eleven : int

4 dataspace eleven : do - @ add - = 10
                                  @ int
                     int 10
                   @ plus1 10
            plus1 @ do int - @ add - @ int
                                   - 1
  path eleven : do - @ add - = 10
  op native op add
            message - 10
                    - 1

5 dataspace eleven : do - = 11
                          @ add - = 10
                                  @ int
                     int 10
                   @ plus1 10
            plus1 @ do int - @ add - @ int
                                   - 1
  path eleven @ plus1 10
  op do destination plus1
        message 10
        op "take result from step 1 and put it as the overall result"

6 dataspace eleven = 11
                   : do - = 11
                          @ add - = 10
                                  @ int
                     int 10
                   @ plus1 10
            plus1 @ do int - @ add - @ int
                                   - 1
  path plus1 @ do int - @ add - @ int
  op do definition plus1

7 dataspace eleven = 11
                   : do - = 11
                          @ add - = 10
                                  @ int
                     int 10
                   @ plus1 10
            plus1 = int 1
                  @ do int - @ add - @ int
                                   - 1
  DONE 1
```

What are the dependencies? Let's just look at the paths that have calls.

```
7 dataspace eleven : do - @ add - = 10
                                  @ int
                   @ plus1 10
            plus1 @ do int - @ add - @ int
```

Taking just the call prefixes:

```
eleven : do 1
eleven : do 1 @ add 1
eleven
plus1
```

Dependencies:

```
deps - - eleven : do 1
       - add
       - eleven : int
     - - eleven
       - eleven :
       - plus1
```

I want to have granularity inside a call/sequence/function, I don't want to throw it all away on a change. It has to go through.

No, eleven doesn't depend on eleven :. It depends on what it calls. If there's a change to plus1, it should recompute. But its sequence will change depending on where eleven points itself.

Can I still have granularity?

```
deps - - eleven : do 1
       - add
       - eleven : int
       - eleven
     - - eleven
       - plus1
```

(remember, the first element of each deps item is the dependent, the rest are dependencies.)

Possible changes:

```
@ put eleven plus1 1100 // New message on eleven

@ put plus1 ... // Change definition on plus1

@ put add ... // Change definition of add
```

If eleven : do 1 is not a dependency of eleven, if add changes, how does that change float up? I'm really resisting batching the lookup of references. But perhaps there's no way around it. Because, in plus1, the definition is muted, we don't look into it. We only look at it on expansion time.

What is complicating things is to have : between @ and =. Otherwise, it would be a clean chain. But there's too much going on with the sequence.

Is the expansion a dependence or a dependency? It is both. I have to accept it. But how do we accept it without being circular?

```
deps - - eleven :
       - add
       - eleven
     - - eleven
       - plus1
       - eleven :
```

If I don't eagerly expand dependencies, then the outer call has to depend on the expansion so that a change in add would affect it. If it doesn't, add needs to be added to the list of dependencies of the call. We could do this at runtime, or rather, at expansion time.

```
deps - - eleven
       - add
       - plus1
```

This is the real dependency graph. How would we build it?

The first time we see eleven @ plus1 10, we create our first dep:

```
deps - - eleven
       - plus1
```

When we hit the moment of the expansion where we see a call to @ add, we resolve the absolute path (to be @ add, toplevel, in this case native because there's no add defined), so we now have:

```
deps - - eleven
       - plus1
       - add
```

How do we know not to add the call to @ int? Because it is a call to eleven : int. Since eleven is a prefix of that path, no need.

Now, what if we had this?

eleven @ plus1 @ value

Then, we'd really have to have these deps:

```
deps - - eleven
       - value
       - plus1
       - add
```

What would it be on sizzbuzz?

```
sizzbuzz @ do n - @ put : output ""
                - @ if cond @ mod - @ n
                                  - 3
                       else @ push output sizz
                - @ if cond @ mod - @ n
                                  - 5
                       else @ push output buzz
                - @ output
"sizzbuzz 15" @ sizzbuzz 15
```

```
deps - - "sizzbuzz 15"
       - sizzbuzz
       - put
       - if
       - mod
```

The idea and even vision of a value being valid until it is removed is very, very strong. There's no staleness: the moment that something is stale, it is removed, and then, the new results, like water flowing down, come up.

I am struggling with two things:

1. Figure out an algorithm that is self-similar (and doesn't really batch) when computing deps.
2. Figure out when, if a sequence changes, changes propagate properly.

To remind ourselves why this is worthwhile, let's look at [lith](https://github.com/fpereiro/lith) (or a part of it) if it was done in cell rather than in js.

```
html tags all @ list "!DOCTYPE HTML" LITERAL a abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption cite code col colgroup command datalist dd del details dfn div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link map mark menu meta meter nav noscript object ol optgroup option output p param pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr
          void @ list "!DOCTYPE HTML" area base br col command embed hr img input keygen link meta param source track wbr
     entiyify @ do text - @ loop do pair - @ put text @ replace from @ pair 1
                                                                to @ pair 2
                                                                v @ text
                                 paths 1
                                 v & &amp;
                                   < &lt;
                                   > &gt;
                                   "/"" &quot;
                                   ' &#39;
                                   ` &#96;
                        - @ text
     generate @ do input - @ put : output ""
                         - @ put : t @ type input
                         - @ if cond @ eq number @ t
                                do @ push p output
                                          v @ input
                         - @ if cond @ eq text @ t
                                do @ push p output
                                          v @ html entityify @ input
                         - @ if cond @ eq list @ t
                                do @ loop do item @ push p output
                                                         v @ html generate @ item
                                          v @ input
                         - @ if cond @ eq hash @ t
                                do - @ push p output
                                            v - <
                                              - , @ list @ input , 1
                                              - @ loop do attribute - if cond @ eq _ @ attribute 1
                                                                         do stop
                                                                    - stop - " "
                                                                           - @ lith entityify attribute 1
                                                                           - "=/""
                                                                           - @ lith entityify attribute 2
                                                                           - "/""
                                                       v @ list @ input , @ list @ input , 1
                                              - >
                                              - @ loop do @ lith generate
                                                        v @ input _
                                              - @ if cond @ contains p @ html tags void
                                                                     v , @ list @ input , 1
                                                     do stop - </
                                                             - , @ list @ input , 1
                                                             - >
                         - output
```

### 2025-01-20

Nested queries give you relational-like fetching! And if this is combined with @ rule, you can express relations, like saying that this field contains an id of one of the entities of the other kind.

Interesting to read about [fair-code](https://faircode.io/). It makes sense to move cell to that, perhaps with a threshold (below 1M ARR, you can offer hosted cell without paying anything).

The why of cell: understanding is the foundation for ownership & flow. Those are the two things we want! Ownership and flow. Ownership is trust, now and long term. Flow is about the energy you get, the happiness you have when using it. The magic.

https://bvisness.me/high-level/
"Low-level programming is not the goal unto itself. High-level programming—a new kind of high-level programming—is the goal, and low-level is how we get there."

Motivators for using cell: love & pride. Love for what you do, pride for what you do. It's difficult to love your system if the tools you use are constantly rotting, or not letting you see the plain beauty of what you're making.

This is a good test for no-op put. Make sure that the conditional with return `true` is executed and that it's that ! diff === '' condition that makes it true.

```
- SEQUENCE - c @ put call @ seq 2
                     seq @ do n - @ put foo @ n
                                - @ put bar 3

```

Instead of @ query, @ ask. This is shorter and more memorable.

Perhaps, when writing about code, I no longer need to do "..." or `...`, the @ is what makes it a call in the context of natural language.

Getting ready to redesign cell.respond. Let's take the classic:


```
eleven @ plus1 10
plus1 @ do int - @ add - @ int
                       - 1
```

Let's go through it. We can write it like this, like fourdata. See the execution path also in the dataspace, as a list of hashes.

Let's assume that we go with the system of no-result, we compute; a result, we skip.

```
1 dataspace eleven @ plus1 10
            plus1 @ do int - @ add - @ int
                                   - 1
  path eleven @ plus1 10
  op do destination plus1
        message 10
        op "put message in expansion"

2 dataspace eleven : int 10
                   @ plus1 10
            plus1 @ do int - @ add - @ int
                                   - 1
  path eleven @ plus1 10
  op do destination plus1
        message 10
        op "put step 1 in expansion"

3 dataspace eleven : do - @ add - @ int
                                - 1
                     int 10
                   @ plus1 10
            plus1 @ do int - @ add - @ int
                                   - 1
  path eleven : do - @ add - @ int
  op reference path eleven : int

4 dataspace eleven : do - @ add - = 10
                                  @ int
                     int 10
                   @ plus1 10
            plus1 @ do int - @ add - @ int
                                   - 1
  path eleven : do - @ add - = 10
  op native op add
            message - 10
                    - 1

5 dataspace eleven = 11
                   : do - = 11
                          @ add - = 10
                                  @ int
                     int 10
                   @ plus1 10
            plus1 @ do int - @ add - @ int
                                   - 1
  path plus1 @ do int - @ add - @ int
  op do definition plus1

6 dataspace eleven = 11
                   : do - = 11
                          @ add - = 10
                                  @ int
                     int 10
                   @ plus1 10
            plus1 = int 1
                  @ do int - @ add - @ int
                                   - 1
  DONE 1
```

When you're at a stopping value or the last step, put the value on the caller directly, don't do a re-entry. Why not when we are putting the message and the step? Because we might want to expand the message first? Maybe we could skip that re-entry too and go straight. Good one.

No, I like it like this. You put the message, it resolves (is responded) and then you put the first step of the sequence. It should still work anyway, but you avoid more back and forth and it's easier to trace it.

In this way, seen above, we only go through the thing five times. One per call prefix, except for the sequence call, which requires two (one for definition and one for first step). Every sequence would require N+1, where N is the number of steps in it.

Interesting that I use step for both a path and for sequence. I think it composes well.

### 2025-01-19

Not elements, but steps. Path "depth" is also a great name. Much better than index.

### 2025-01-16

Cell is for those that want to:

1. Build their own systems
2. Understand what they build

Why build your own systems?

Computer programs are strange and beautiful beasts. Like written words, like ideas. But can run very far. Practical magic.

Two main purposes: to reach others, and to think. They are a medium to reach others anywhere with internet and a phone/computer (with information, games, art); and a way to think, a sort of written language that harnesses the power of computers. A tool of thought (link notation as tool).

What stands in the way is the tremendous complexity of programming tools. To build your own system, you need a programming language, a text editor, a database and a server that runs it (including domains and email).

Cell massively simplifies the landscape by giving you an unified environment (or substrate) where all the core capabilities are there, in one place, in a simpler way. It is quite unfamiliar, but because it has AI integrated, you can hopefully learn it quickly.

Why understand your own systems?

Understanding as the key to ownership and flow.

You're not transforming or transmitting the symbols. The computer is doing that. Your value comes from understanding how those symbols should be transformed and transmitted.

### 2025-01-15

It's remarkable how computers that halted were the correct ones for Turing (because they calculated something), whereas now for us an errored/crashed state is when a computer is halted and stops responding. We now expect computers to always be on to communicate with us and respond, rather than calculate one thing and going back to sleep.

Is it about ownership or is it about ease?

Perhaps it's not even about a substrate. We only care if it's one thing or many only because many things are harder to grasp than one. But it could be just about surface.

Equation:
system power = what you can do / elements ^ 2

A few elements. Understand what you build.

Ownership as long-term convenience: it still works, you can still resume work on it, no vendor will lock you or price you out of it.

From understanding stems: ownership, speed, quality.

Yeah, it is not "own what you build". It is "understand what you build".

If life is cognition, and intelligent life is about cognition about cognition, then we could lay claim to intelligence being life squared.

Getting goosebumps about thinking that recalculation can be a mere question of removing the results that are stale, and about having a single call prefix per path that you need to resolve.

Coming back to [this article](https://jrcpl.us/contrib/2025/Scrappy):
"We did decide to focus on the niche variously known as “end-user programming”, “small computing”, “casual programming”, “home-cooked software”, “personal software”, and “software for one”. This is in contrast to typical software development frameworks and “no-code” development platforms which cater to professionals working on industrial-strength apps and websites. Another way of putting it is that we wanted to target that gap between going shopping for apps and having to hire someone to build bespoke solutions — or becoming a skilled programmer yourself."

"With today’s LLMs, you end up with pages of AI-generated code, even if it’s hidden away under a shiny UI, and you’re left helpless when something doesn’t work the way you intended."

https://xcancel.com/id_aa_carmack/status/1902088032519405919?s=46%20data
"There have been countless efforts to make software development “more visual”, but anything that isn’t a simple collection of human (and LLM!) readable text files continues to step on land mines."

Let's redesign cell.respond to use missing values to show when something should be recomputed.

Why is this possible here and not on a spreadsheet? Because we keep the formulas here and have a separate place for the values. But so do spreadsheets. The difference is then that you can see both of them at the same time. In normal programming languages, the "formulas" (code) gets transformed into values, so you cannot re-run the thing again reactively.

Let's do it with this example:


```
eleven @ plus1 10
plus1 @ do int - @ + - @ int
                     - 1
```

1. We start with the first path with a call:

```
eleven @ plus1 10
```

In this case, we can already determine that 1) `eleven` is the call prefix; 2) `plus1` is the hook after the call. But we want to have the absolute path to which we depend. In this case it is easy to see it is actually `plus1`, but if we walked up to find something nested, it would be different. So we need to resolve the absolute path, which means we need to use that flag in cell.get to get it.

Then:

2. We get the call prefix and the absolute path to the hook to which it points.

Now, why the hook and not more steps? Because if the hook changes, all bets are off. This will make us recompute things that we might not need, but there might be cases where we do need that. However, we did this already in gotoB. The solution is to depend on changes on any prefix of the dependency, but you can still store the full dependency. So let's do that, instead of getting the absolute path to the hook, let's get it to the hook plus whatever is there, if there's something, to be more precise.

```
depends - calls - eleven
          on plus1
```

3. Now, let's continue. The dataspace is now expanded.

```
eleven : int 10
       @ plus1 10
plus1 @ do int - @ + - @ int
                     - 1
```

The first call path is the same as before. We go into it again: we can simply skip the dependency if it exists.

Wait, the relationship could be always 1 to 1! This call prefix depends on this other path. Then it could be just pairs. Could it really be that simple? I think so, but let's see what happens with calls that have references (like the @ int one).

If it's 1:1 (one call prefix has one dependency) it's almost like SSA (static single assignment form). We can just have pairs of relationships.

```
pairs - - eleven
        - plus1
```

We cannot have this in a single hash because you might have things with different depths, right?

```
a
c d
```

Yes, it's not a consistent dataspace.

Let's just do pairs and be done for now. The first element is the dependent, the second is the dependency? No, let's make it a hash.

I cannot figure out good names. Let's make it pairs, at least for now.

4. Now the expansion looks like this:

```
eleven : do - @ + - @ int
                  - 1
         int 10
       @ plus1 10
plus1 @ do int - @ + - @ int
                     - 1
```

5. Now we have this path to expand:

```
eleven : do - @ + - @ int
```

Here, the left part of the path is:

```
eleven : do - @ + -
```

What's throwing me off here is that there's an @. But this is to be expected, really. There can be more than one call in one path. You just deal with it one at a time.

Here, we'll add this pair (note we resolve the dash in the path to a number, so we have it completely unambiguous):

```
pairs - - eleven
        - plus1
      - - eleven : do - @ + 1
        - eleven : int
```

Note there's no circularity here, but also this is no longer at the toplevel, dependent and dependency share a non-zero prefix.

It's cool to finally understand that that path is now resolved, another one will appear to deal with the left @.

6. Now we have to expand the overall step of the sequence.

Wait, what about the equals? Actually, that's implied, since on top of each @ there's an =. So no need to put it there, we just know.

```
eleven : do - = 11
              @ + - = 10
                    @ int
                  - 1
         int 10
       @ plus1 10
plus1 @ do int - @ + - @ int
                     - 1
```

Then, we have:

```
pairs - - eleven
        - plus1
      - - eleven : do 1 @ + 1
        - eleven : int
      - - eleven : do 1
        - eleven : do 1 @ +
```

On what does eleven : do 1 depend? It's not really coming from another reference, but rather from the mechanism of cell.do. Hmmm.

Let's think it through. The response of the step of a sequence depends on the message and the definition itself. Well, not the definition, the call itself. What we want is the chain not to be broken. We could say that `eleven : do 1` depends on `eleven : do 1 @ + 1`, because that's what depends on `@ int`. Can I just do this instead? `eleven : do 1 @ +`. It's not just `+`, it's `+` with that prefix. I think that would work just fine.

7. Then, finally, we have eleven already expanded:

```
eleven = 11
       : do - = 11
              @ + - = 10
                    @ int
                  - 1
         int 10
       @ plus1 10
plus1 @ do int - @ + - @ int
                     - 1
```

```
pairs - - eleven
        - plus1
      - - eleven : do 1 @ + 1
        - eleven : int
      - - eleven : do 1
        - eleven : do 1 @ +
```

I didn't add any extra pairs. There's only three, one per call prefix:

```
eleven : do - @ + - = 10
eleven : do - @ + - @ int
eleven @ plus1 10
```

This feels a bit strange, but it makes sense perhaps more deeply than what I see right now.

8. We now finally have to do `plus1`. But it really doesn't depend on anything else, except perhaps do. Which might as well, if you redefine do!

```
pairs - - eleven
        - plus1
      - - eleven : do 1 @ + 1
        - eleven : int
      - - eleven : do 1
        - eleven : do 1 @ +
      - - plus1
        - do
```

And that's really it.

I'm still not sure about +. Why don't we look for +?

Let's see a multiarg function. A native plus.

```
sum @ plus - 5
           - 4
plus m - @ + - @ m 1
             - @ m 2
```

Let's do the expansion:

```
sum = 9
    : do - @ + - = 5
                 @ m 1
               - = 4
                 @ m 2
      m - 5
        - 4
    @ plus - 5
           - 4
```

What would the pairs be?

```
pairs - - sum
        - plus
      - - sum : do 1 @ + 1
        - sum : m 1
      - - sum : do 1 @ + 2
        - sum : m 2
      - - sum : do 1
        - sum : m 1
        - sum : m 2
        - +
```

It definitely makes sense to say that `sum : do 1` has three dependencies: its two arguments and +. So, instead of pairs, we could have each call prefix depending on one or more elements.

Also, one more thing that is missing (from the first example too): how do we connect a change in sum to a change in everything else? Ah, that one we can do because if sum changes, sum is a prefix of others that start with sum, so if sum changes, the other ones change too. It doesn't have to match the full path (gotoB change behavior).

Thinking: when we wipe things, do we also go from the top to recalculate everything? That sounds a bit silly. Perhaps things have to be recalculated in the reverse order in which we wipe them, LIFO. No, the other way around! It's not the reverse order, it's starting from where you change something with put or wipe. Those paths that you put or wipe are the ones on which you start the recomputation. Probably path by path? Probably not, too inefficient. Do a mute placement, then clean up, then recalculate in the order of depth of what you cleaned up.

Depth means how many transitive jumps you made, not length of the paths.

claude: "Excel even has optimizations like only recalculating the "dirty" subgraph rather than the whole sheet, which is exactly what you're doing with the invalidation phase before recalculation.
The main difference is you're making the dependency structure explicit with your pairs/lists, whereas spreadsheets infer it from formula references. But the recalculation strategy is the same principle."

### 2025-01-14

We're going to start calling cell a programming *substrate* (not tool, not environment, not language). Its goal is to be a substrate, like the spreadsheet, like hypercard, like dbase (perhaps).

Emerging pattern: update dataspace, then run cell.respond.

Changes to wipe:
- Multi paths
- Call cell.respond
- Respond with a diff
- Mute mode

### 2025-01-12

I cannot do something like this:

```
- c @ wipe a
           c d
```

But I could do something like this

```
- c @ wipe - a
           - c d
```

The difference between put and wipe is that put takes a consistent set of paths, but wipe could presumably get different things that between themselves don't form a valid dataspace.

Interesting to consider two paths as a dataspace. Any consistent set of paths is a dataspace.

cell.get doesn't give you an absolute path, does it? It's always relative. But you don't get the absolute path that matched it. When it's found, the partial (or total) context path that was used gets removed completely.

What about inconsistent paths in the diff? Can we return them? I don't think so, because whatever we wipe, it is consistent with itself. Any subset of a valid dataspace is also a valid dataspace, if the subset takes entire paths.

### 2025-01-10

Had two ideas:
1. The query call can be much simpler than I thought. You can pass literals, and you can pass sequences that check whether that item matches or not. For example:

```
query - status
      - @ do int @ and - @ >= - @ int
                              - 200
                       - @ < - @ int
                             - 400

(or, with a helper)

query - status
      - @ do int @ range between - 200
                                 - 399
                         value @ int
```

By default, it is all at a relative depth, but the two you pass are expected to be next to each other.

- To mark what needs to be recalculated, just remove the results and recalculate! Rather than recalculating to see if things change, just explicitly remove what needs to change. When tracking dependents, if X changes, take all the call prefixes that directly point to them and remove their =s, and do this recursively. Then you can explicitly see what needs to happen again and what doesn't. This will send me back to the drawing board with cell.respond but that's OK.

### 2025-01-09

This is quite interesting, because we're really dealing with a side effect. Put responds with a result but it also changes something outside of that result. To make it idempotent, we need to make sure that whatever it wants to put, it's already put. Only in that case we can be sure we can move on. But that is given to us by the zerodiff! That should do it, so we're fine.

Push, however, is more tricky. Because it only tells you to add something, not to set it to something. So you have no way of knowing whether you "did it" or not yet. But we can also see the diff in it. It will never be zerodiff, though. So how can we know this? On re-entry, we'll just run this again. This is a big problem. What we can do is only to run it if it has no response on top. But this means that the call has to "sniff" its outside to know whether to run or not. And this may well be.

Who will remove the response of the push? If the message changes, the whole `do` is overwritten, so all good. If the step itself is changed, we put it anew, so, all good? We need to be sure of this, that the put really removes the result. And what if a step above changes? Then all steps below should be removed! All bets are off in that case. We cannot do a diff "in the middle", at least not without a LOT of analysis, and that analysis might be way more expensive than running the damn thing. So not.

Don't "push". "add". It's a clearer term. And left? ladd? leadd! Can be pronounced more distinctly.

TODO:
- Put with zero diff and no call to cell.respond if zerodiff.
- cell.do to wipe steps N and beyond (not just N) when N changes.
- cell.respond to ignore overwriting zerodiffs on put no-ops.
- Implement add. Make it "smell outside" and see if there's already a result. If so, don't push.

It's very interesting that cell.native might decide not to do a call with a side effect if there's a value already on that diff. This could really work. In sequences, it will work. But what about loose calls? It will be interesting to see. This could also work for things like HTTP calls, or DB calls (to external DBs, I mean). By having the values as part of the system, you can control whether something is fresh or not without putting a more explicit gate.

### 2025-01-07

More things on types:
- Types can be understood and implemented as assertions; assertions are calls that pass/fail. If code goes through an assertion, anything below it can be considered as passing the assertion.
- An abstract class can be seen simply as a partial list of assertions. What's partial is in the eye of the beholder, because anything that doesn't completely determine the data (down to the last character) could also be considered abstract, in that it allows different possibilities. Assertions provide information in the Shannon sense of limiting/cutting down possibilities.
- The whole OOP game can be seen as assertion or transformation (modification of state). They're both calls.
- Inheritance can be done with assertion calls making other assertion calls in turn. Or transformation calls making other transformation calls. But the mechanism in cell is explicit.There are no implicit calls through inheritance.
- When you're in C, without objects, you don't have clear places to put things, you only have a toplevel namespace and must make your own structs. OOP gives you places to put the data; but with a nestable dataspace, this is no longer necessary.

https://userpage.fu-berlin.de/~ram/pub/pub_jf47ht81Ht/doc_kay_oop_en
"- I thought of objects being like biological cells and/or individual computers on a network, only able to communicate with messages (so messaging came at the very beginning -- it took a while to see how to do messaging in a programming language efficiently enough to be useful)."

It seems that I'm just rediscovering/copying what Alan Kay was doing in 1966.

"  - I wanted to get rid of data. The B5000 almost did this via its almost unbelievable HW architecture. I realized that the cell/whole-computer metaphor would get rid of data, and that "<-" would be just another message token (it took me quite a while to think this out because I really thought of all these symbols as names for functions and procedures."

Well, maybe not so much. I actually want to get rid of the notion that anything in computing is not data.

"(I'm not against types, but I don't know of any type systems that aren't a complete pain, so I still like dynamic typing.)
OOP to me means only messaging, local retention and protection and hiding of state-process, and extreme late-binding of all things. It can be done in Smalltalk and in LISP. There are possibly other systems in which this is possible, but I'm not aware of them."

https://softwareengineering.stackexchange.com/a/163195 Linus Torvalds:
"git actually has a simple design, with stable and reasonably well-documented data structures. In fact, I'm a huge proponent of designing your code around the data, rather than the other way around, and I think it's one of the reasons git has been fairly successful […] I will, in fact, claim that the difference between a bad programmer and a good one is whether he considers his code or his data structures more important."

Data structures are calls! They're not just data. They are sections of the dataspace that respond to calls. This is beautiful. That's why they are so useful. They're not data at rest.
cell already makes data into data structures. You can run direct queries (equality based) on lists and hashes. Then, other structures can be built up with sequences and conditionals.

claude: "The dataspace isn't a pile of inert data - it's a space of responsive structures. You can see them (unlike hidden objects), but they're alive (unlike passive data)."

I don't think that redis' quality is orthogonal to its simplicity. I actually think they are so related to be almost indistinguishable. You cannot have quality at that level (I wager) without that level of simplicity.

The problem with natural language documentation is that it is not executable and thus represents a source of truth disconnected to the rest of the system. what execution allows (and therefore, where tests win) is that you can run them and, with great speed and little effort, know if things are as supposed to be or not.

Years of building frontend libraries got it through my thick skull that the entire system can recompute a part of it based on a change instead of doing the whole thing. So it's possible to think of assertions at every level only happening when they need to be, instead of having to somehow "cache" validations to avoid unnecessary computation.

The underlying bet:
- There is no metamathematics, just mathematics.
- There is no metadata, just data.
- There is no metaprogramming, just programming.
- There are no abstractions, just concretions at different levels. Spaces of possibilities with different shannon entropies (the amount of possible datums that fit an assertion).

Back to understanding cell.respond. Now that the first sequence is very clear, studying how the update happens.

When the update happens, we take it from the top. The first two call prefixes work with the existing definition. One is the native call, it hasn't changed, so we leave it. The second is the reference, it hasn't changed, and we leave it. When we hit the third call prefix, THEN we realize that the definition has changed and we update it!

```
(2026-01-07T20:05:27.544Z) respond path18:
eleven @ plus1 10
(2026-01-07T20:05:27.544Z) do 8:
contextPath 1 eleven
definitionPath 1 plus1
               2 @
               3 do
message 1 1 10
op execute
(2026-01-07T20:05:27.544Z) put 11:
diff + eleven : do 1 @ + 1 @ int
                         2 2
     x eleven : do 1 @ + 1 @ int
                         2 1
```

A bit of inefficiency: if the first call prefix is changed, when we re-enter, we check it again. But to not do this would require us to pass a flag saying ("I'm the first one and I just changed"). Don't like that at all.

I am needing a "mute" put or "mute" wipe that doesn't trigger cell.respond. It's very funny to see it like this. It's the exact same thing I encountered with gotoB (a frontend library).

Attacking fizzbuzz:
- Native should not return false, but rather an error if you send something to it that is not there. Well, shouldn't it default to [['']] instead? Yes, it should [CHANGE].
- Native needs to call put [DONE]
- Annotate that native returns true in the case of a put because we want to stop the outer recursive call to proceed with stuff.
- Native doesn't have push!
- But the cycle happens because put keeps on calling itself.
- Put needs to return a zero diff if it doesn't change any paths.
- We need a mute put, then. Call it mute. If returns a zero diff, proceed. Otherwise, return true to stop the outer? But no, in the case where there's a change, I don't want the inner put to be mute. I want it to be mute only conditionally, only if it doesn't change anything. But in that case, silly, just make put not call cell.respond. If there's no diff, what is there to update? So always treat the call to native put as a stopper for the outer respond? No, not either. When the diff is zero, don't return false, just keep on going. But wait! In that case, we'd be overwriting the diff from the previous result! This is highly, highly inconvenient! We need to monkey patch it in cell.respond.

Is it always correct to not overwrite a diff with nothing? I think so. We're treating put almost like a gotoB change event.

### 2025-01-06

Ideas on the why/how/what of cell:
- Speed should be a result, not the purpose.
- "Understand what you build".
- "Build on strong foundation"
- **"Own what you build"**
- The opposite of ownership is debt.
- Build without debt.
- Strong foundation one-two punch: understanding & flexibility.
- Reduce effort to understand; reduce effort to change the system.
- The two problems of tall stacks: huge effort to understand what's going on; and large effort to change the system.
- The curiousness of strength in software: a strong foundation is a flexible foundation.
- Make things as easy as possible to 1) understand and 2) change.
- Ownership: 1) understand the system, know what it does and how; 2) be able to change it without fear of breaking it.

https://datagubbe.se/endofciv/
"I have at times fought long and hard against introducing pointless complexity, resulting in some wins and some (well, sadly, mostly) losses. The sad truth is of course that when push comes to shove, I prefer not defaulting on my mortgage over not adding more software complexity. Yes, we programmers play a large role in this, but so does the market - and other, tangential stuff, too."

"I honestly believe that reducing workplace complexity would also, in the long run, reduce software complexity."

Thinking about class vs type

https://stackoverflow.com/a/25114770
"In type theory terms;
A type is an abstract interface.
Types generally represent nouns, such as a person, place or thing, or something nominalized,
A class represents an implementation of the type.
It is a concrete data structure and collection of subroutines"

In cell, the notion of abstraction is only an interface. Which is a call. A type is a class, which is the structure of what you expect something to be. This type or class is concrete in that it is implemented, but it conveys abstraction in that it has an interface. The interface is what you call, not the implementation. An interface gives you compression. But, in the end, it is all calls.

OK, back to debugging:
- How to debug faster:
   - Just run this test
   - Note a copy of the count variable so that recursive calls, when incrementing it, don't disturb it.
- Return `true` from cell.do execute to indicate that there was a call to cell.put and that nothing should be placed there by cell.respond.

Let's count the puts

1. Initial
2. Message
3. First/only step of the sequence
4. Reference
5. Native
6. Result on eleven
7. Definition

That's it! The eight is the one for the dialog. Returning true stopped unnecessary puts.

Now for fully understanding the paths being responded.

Every time there's a change we start over. Even with call prefix dependency tracking, this will be like this, only with less paths.

The essence of the bug was then:

- We were not sending a stopping value back from cell.do when it called cell.put.
- We were not taking this stopping value in respond and 1) not updating the dataspace; 2) bubbling it up.

See how the true final call (15) then wraps up the two recursive calls to definitions and they close without doing anything else.

```
(2026-01-06T20:43:27.369Z) respond 15:
plus1 @ do int 1 @ + 1 @ int
(2026-01-06T20:43:27.369Z) respond call 2:
newValue 1
path 1 eleven
     2 @
     3 plus1
     4 10
(2026-01-06T20:43:27.369Z) respond call 1:
newValue 1
path 1 eleven
     2 @
     3 plus1
     4 10
```

The pattern of returning `true` to stop outer recursive calls is key. We already had done it between cell.respond and cell.put, but now we completed the circle by also doing it with cell.do. This is solid.

### 2026-01-05

Let's continue debugging. The thing goes off the rails at 289

Found the issue. It took me forever!

```
(2026-01-05T21:27:14.102Z) respond 288:
eleven @ plus1 10
(2026-01-05T21:27:14.102Z) do:
contextPath 1 eleven
definitionPath 1 plus1
               2 @
               3 do
message 1 1 10
op execute
(2026-01-05T21:27:14.103Z) respond put 288:
eleven = ""
(2026-01-05T21:27:14.103Z) put:
diff + eleven = ""
     x eleven = 11
```

Why eleven @ is not properly looked up?

Ah, because @ plus1 now has a value so it's looked up. I need to add a way to shortcircuit this.

No, no shortcircuit. We need to actually execute it again to see if it should change. We're not doing this properly in do.

Am I losing it? How can a function executed once print twice, and different things to boot?

```
output? 56 {
  definitionPath: [ 'plus1', '@', 'do' ],
  contextPath: [ 'eleven' ],
  op: 'execute'
} [ [ 11 ] ]
output? 56 {
  definitionPath: [ 'plus1', '@', 'do' ],
  contextPath: [ 'eleven' ],
  op: 'execute'
} [ [ '' ] ]
```

Same counter! I can go nuts now.

It has to be a recursive call. But how?

Earlier calls already trigger the recursive call on eleven,

### 2026-01-03

Aim for those who want to understand? Or to scientists/entrepreneurs?

```
- respond eleven @ plus1 10
- execute context eleven
          message 1 10
          path plus1 @ do
- put + eleven : int 10

- respond eleven @ plus1 10
- execute context eleven
          path plus1 @ do
- put + eleven : do 1 @ + 1 @ int
                          2 1

- respond eleven : do 1 @ + 1 @ int
- reference context eleven : do 1
            path int
            value 10
- put + eleven : do 1 @ + 1 = 10

- respond eleven : do 1 @ + 1 = 10
- native op +
         value 1 = 10
               1 @ int
               2 1
- put + eleven : do 1 = 11

- respond eleven : do 1 @ + 1 = 10
- native op +
         value 1 = 10
               1 @ int
               2 1
- noop

- respond eleven : do 1 @ + 1 @ int
- reference contextPath eleven : do 1
            valuePath 1 int
- noop

- respond eleven @ plus1 10
- execute contextPath 1 eleven
          message 1 10
          path plus1 @ do
- diff + eleven = 11
```

What I'm re-learning:
- @ do (execute) will respond with empty text until it finishes.
- @ do (execute) will make its own puts directly when it is expanding (making an expansion).
- Those calls to @ put from @ do make respond go through those new paths again.
- Because the expansion goes above the @, when re-entering the dataspace to respond, we hit the expansion first (instead of the call). That's how the thing moves forward.
- Interesting that you can already execute something whose definition hasn't been responded to. For example, the response of plus1 itself would be `= 1`, but we don't need that to be there for us to actually compute the sequence. Because we just read what we need from @ do.

OK, so the sequence for the first path is done in 7 calls to respond:

1. Put the messge in the expansion
2. Put the first (and only) step of the sequence in the expansion
3. Resolve the reference on the first path of the first step of the sequence in the expansion.
4. Make the native call to +.
5. Re-enter and get a noop on the path with the call to +.
6. Re-enter and get a noop on the reference on the first path of the first step of the sequence in the expansion.
7. Hit again the original path (eleven @ plus1 10), execute and now get a result (the response of the last step of the sequence).

Clarification: a no-op is when the currentValue and the newValue are the same, no need to do anything, just proceed down the dataspace.

After this happens, the following happens:

8. Native no-op again.
9. Reference no-op again.
10. Execute no-op (for the first time).
11. Finally, we go and expand plus1.

```
respond plus1 @ do int 1 @ + 1 @ int
define contextPath plus1
       path plus1 @ do
put + plus1 = int 1
```

At this point, we'd be officially done. But we're going to go through the entire cycle again, but with no-ops. Let's see. Wait, there's a put below. Let's get surprised.

12. Native no-op for the third time.
13. Reference no-op for the third time.
14. Execute no-op for the second time.
15. Here we expect a no-op for the first time on the definition (plus1). But we get a call to replace `eleven 11` with `eleven ""`. This is wrong. But how?


The final dataspace will look like this:

```
eleven = 11
       : int 10
         do - = 11
              @ + - = 10
                    @ int
                  - 1
       @ plus1 10
plus1 = int 1
      @ do int - @ + - @ int
                     - 1
```

But here, there are only four paths that are "first calls", in that they have calls that have to be checked and stand for other paths with the same call prefix.

```
eleven : do - @ + - = 10      (native)
eleven : do - @ + - @ int     (reference)
eleven @ plus1 10             (execute sequence)
plus1 @ do int - @ + - @ int  (define sequence)
```

Why it should be 15 steps?

You start at execute sequence and add message (1). Then, add sequence (2). When we're here, all the "first calls" (or should we call them "call prefixes"?) are there.

At the end of step 2, all the call prefixes are there? No, it's just 3 call prefixes, because @ int is not expanded yet.

```
eleven : int 10
         do @ + - @ int
                  - 1
       @ plus1 10
plus1 @ do int - @ + - @ int
                     - 1
```

Then, what happens is:

```
eleven : int 10
         do @ + - = 10
                  @ int
                  - 1
       @ plus1 10
plus1 @ do int - @ + - @ int
                     - 1
```

After step 3, we do have all four call prefixes. Then, we respond to the first one with native (4), then get no-ops on native (5) and reference (6). Then we can respond to the third call prefix (7). Because there's a change, we go back to the top and get three no-ops (8-10). Then, we finally expand plus1 (11). Then, we go to the top again and hit four no-ops for all of the call prefixes (12-15). This should be the end of the response.

The mechanism of expansions (never mind the bug that we'll solve, I don't think this is a discovery, just a bug) is that the expansion of a call prefix can put other call prefixes on top. Once any of these hit a change, we just go back to the top. Even when we have dependencies, a simmilar mechanism will happen, only on a smaller amount of paths, and what's the "top" will depend on the dependencies.

### 2026-01-01

The diff responded by @ put or @ wipe can be gone when things change, but it stays always in the dialog.

I need to make wipe not delete the dialog. But I don't need it yet. Let's let that emerge.

I wonder if the diff returned by put should be with absolute or relative paths. Relative would be without the context path. But then, how would we really know what it replaced? I need to see it concretely.

We can use x instead of - for removed paths.

Wait, the sorting is useless if I do it on + and x. I need to make those as a list that is smartly sorted. But how nice would it look? Let's go without this sorting, perhaps the calls to put are small enough that we can track the changes. It's not about the challenge of writing the code. I don't like every item of the diff prepended by a -, it's a lot of noise.

Wait, the sorting is useless if I do it on + and x. I need to make those as a list that is smartly sorted. But how nice would it look?

With default sorting, + comes before x. Another git/myers convention broken. Let's see how it unfolds.

put is THE diff maker! It's 2026 and I've finally arrived to "first class edits".

I'm really liking absolute paths in the diffs responded by @ put. Also love how the dot goes away.

I can't wait to actually be able to program in cell. Like, really program.

Thinking about respond. Perhaps it's not that difficult after all, and I'm just needing some clarity.

- Everything to the left of the first @ is context. Absolute.
- Everything to the right of the last @ is pure value. It's what we set it to.
- The part between the first @ and the last @ is the trickiest. This determines the actual absolute path. This is the part that walks up.
- The @ on the leftmost @ do is considered the last @. Everything after it, including "do", is pure value. This is how cell.respond freezes calls.

How can the value we get in cell.respond be empty that we have to go look for @ do? Ah, it's because we pass a message that's presumably not defined in the path! foo might be defined, but foo 1 is not. That's why we try with @ do.

I'm thinking we should try from the left, not the right.

It shouldn't be over the entire value path, but rather -1, since the last item has to be the message.

```
eleven @ plus1 10
plus1 @ do int - @ + - @ int
                     - 1
```

How would the expansion happen?

Round 1: path 1

```
context eleven
target eleven
value @ plus1 10

Resolving value:
- Not an if or do
- Direct get:
   - `eleven plus1 10` finds nothing
   - `plus1 10` finds nothing
- Find a sequence:
   - `eleven plus1 @ do` finds nothing
   - `plus1 @ do` finds something!

definitionPath plus1 @ do
message 10
```

### 2025-12-31

https://www.tarsnap.com/open-source.html
"Tarsnap has a policy of contributing each year an amount equal to its gross profits for the month of December to support open source software."

Idea: user prompt as a bubble up that can be caught! But we need a continuation there. Do we also need continuations on stop? If you look at it as a value, you'd almost have to rewrite things. Could you just delete the errors (bubbling down) or even replace them with the override, so that the sequence can continue?

### 2025-12-30

=== Outline of a paper on cell:
- The three foundational ideas:
   - Building is like writing
      - Global communication
      - Tool of thought
      - Creating artifacts that stand on their own. System building is building a representation.
   - Understanding is the key to building
      - Understanding is building a representation of the system.
      - Outline of a theory of complexity defined against difficulty of understanding.
   - Understanding can be easier by removing the five obstacles
      - Low-noise way to look at data: fourdata. Compare to yaml, json, csv. Relate to autopoiesis in that the paths don't point to the data, they are the data.
      - Unified dataspace. Relate to the web.
      - Call and response. Relate to autopoiesis.
      - Five mechanisms for all logic: fivelogic
      - Overcome separateness of time/space and user/system
- Comparison of call and response with CSP and with actor model
- Comparison with Turing Machine: how is it different if the TM encodes the configurations also on the tape?

===

It's quite deep that the context path is only what's to the left of the first @, and not what's to the left of the @ you're processing. The first @ already sets you in relative waters. Is this the correct behavior?

claude:
"The unique columnar advantage is:
When your query touches 3 columns out of a 50-column table, you read 94% less data off disk. That's pure I/O win, regardless of filtering."
claude:
"The key insight is that paths are column selectors. When you have a collection of uniform structures and want to extract a specific field from all of them, you're doing exactly what columnar storage optimizes for."

"That's genuinely elegant - you've eliminated the row vs column storage tradeoff by making paths the storage primitive."

"in row-based storage, SELECT tells the database what to return, but the database still reads entire rows from disk."
"The exception is covering indexes - if you have an index that includes just the revenue column, the database can read from that index instead. But now you're maintaining separate storage structures, which is what columnar databases do systematically."

So, essentially, in cell everything is indexed then. If I'm storing paths independently and I can quickly access anything at value N, or anything with a prefix X, it's all reading from an index.

https://www.arxiv.org/pdf/2512.09762
"A path p is a possibly empty sequence of IDs denoting a path drilling into nested
records and lists. Paths can access both values and types. We separate the IDs in a
path with dots, and a single dot is the empty (top) path. A special element ID ∗ is
used to access the element type of a list type."
interesting echo.

https://stonetools.ghost.io/hypercard-mac/
"The first is the database functionality the program gives you for free. Open the Appointments or Addresses stacks, enter some information, and it will be available on next launch as searchable data. It's stored as a flat-file, nothing fancy, and it's easier than Superbase, which was already pretty easy.

The second is that after entering new data into a stack, you don't have to save; HyperCard saves automatically. It's happens so transparently it almost tricks you into thinking all apps behave this way, but no, Atkinson specifically hated the concept of saving. He thought that if you type data into your computer and yank the power plug, your data should be as close to perfect as possible."

"When you're back in present-day, wondering why a 20GB application can't afford the same flexibility as this 1MB dynamo, then you'll understand. "Why can't I change this? Why can't I make it mine?" Such questions will cut you in a dozen small ways every day, until you're nothing but scar tissue. Then you'll understand."

"HyperCard has basic and advanced tools for creating the three primary elements which compose a card: text, graphics, and buttons. These elements can exist on both background and/or foreground layers as you wish, keeping in mind that foreground elements get first dibs on reacting to user actions."

https://beyondloom.com/blog/sketchpad.html
"I see HyperCard differently. It certainly had event-based programming wired up to interactive buttons and fields, but there was something evasively softer and more pliable about it as a medium. It broke down the hard distinctions we tend to take for granted between programs and documents, developers and users."

Alan Kay, https://www.filfre.net/2016/09/the-freedom-to-associate/#comment-261229
"Thus HyperCard had the *two* things that are needed, not just the hyperlinking for browsing, but the automatically indexed searching that is absolutely necessary when you have a data base of more than 100 or so items (i.e. browsing mainly works when you have a sense of where you are going, and you need search as the larger covering mechanism)."

https://bits.logic.inc/p/2025-was-a-wild-decade
"We can do things today, in December 2025, that were still mostly science fiction in January. That should terrify and excite you in equal measure."

Overview of cell:
- Language
   - Storage: @ put
   - Fivelogic: @, @ if, @ do, @ loop, @ catch
   - Rule: @ rule
   - View: @ view
   - Other: @ access, @ cron
- Service
   - Host cell: normal data & files
   - API/email inbound/outbound
- DB
   - Run the language in the DB: consistency, persistence
   - Make queries fast.

Fivelogic should actually be sixlogic, because put is also essential! It's what you cannot implement in terms of the others. No, it's sevenlogic, because you need to wipe.

The main calls, ordered by length.

```
     @         @ do        @ if         @ put       @ loop       @ wipe     @ catch
|---------| |--------| |-----------| |----------| |---------| |---------| |----------|
 reference   sequence   conditional    storage     iteration     delete      error
    (0)         (2)         (2)          (3)          (4)         (4)         (5)
```

A few things for @ rule:
- It should be @ rule, not @ is. So that particle/wave (noun/verb) are the same word, like in `view`.
- What if rules are in relative scope, so that any @ rule calls only take effect on that part of the dataspace? Then, you avoid 1) having to have globals; 2) having to call @ rule directly and stopping explicitly. (Heck, this could also work for @ access). @ put then looks at the rules in scope on that prefix.
- Restating something I said earlier: when a rule is set, 1) if the existing data is not matching it, you'll see the errors on top of the rule call; 2) a put that brings new data that doesn't comply will not be let through and will be rejected with the relevant errors.
- Are rules a DSL? How much do we save (a la Forth threaded code) compared to plain fivelogic?
- Main checks are: type, eq (all types), match (text), range (number), length (list), keys (hash); has should be for multiple eq. Shorthand for nested structures? Maybe we can just use wildcards to jump over.
- Still have @ rule as a call.
- @ rule would "walk down" rather than up, the scope of the rule would affect paths that are inside of it, or perhaps at the same level.

Concerning @ view:
- Output is cell logic that is run directly on the view. This cell logic has two parts: 1) vfuns that respond with a representation of html; 2) responders that do things, these responders are really calls! If you want something static, it's just a vfun that doesn't read data, is just as is.

Prefixes are locations.

How would libraries work? It could start by being a cell that hosts some logic, and you simply bring it. You can reference it dynamically or you can bring it and then copy it to a static location. A curated set of libraries would be great.

Rather than calling things "entities", we can just call them "types". A type is a set of rules over the elements of a list. If the elements conform, they belong to that type.

TODO:
- Sevenlogic
- Rule
- View

I need to start definiing the non-fundamental calls (like push) to see if I can really do them. Off the top of my head, we also need type. We also need math and comparison.

```
fizzbuzz @ do n - @ put : output ""
                - @ if cond @ % - @ n
                                - 3
                       else @ push to output
                                   v fizz
                - @ if cond @ % - @ n
                                - 5
                       else @ push to output
                                   v buzz
                - @ output
```

### 2025-12-29

== Build and understand (talk & intro to cell)

Today I will talk about three things:

1. Building is like writing
2. Understanding is the key to building
3. Understanding can be easier if we remove five obstacles

=== Building is like writing

- By "build", I mean writing data systems.
- What are data (or info) systems? They are representations of the world. Very powerful: world wide reach, allows you to organize with computers.
- Building is as powerful as writing. Written language transcends time and space. And it becomes its own thing, it's own identity, something you refer to. Beyond the authors. The same happens with computer systems.
- Building: writing + computers.
- Why write? To reach others; and to think clearly.
- The same reasons apply to building: to reach others, and to think more clearly.
- Reading is great, but writing is better. Same with data systems: tapping (using digital systems) is good, building is better.

=== Understanding is the key to building

- Building is unlike writing in that you can build things without understanding them.
- The central problem in building is the difficulty in understanding what you're building.
- What is understanding? It is to have a good representation of the system in your head. Not just memorize, but actually know the relationships of the parts of the system.
- AI aggravates this problem: it builds for you without it understanding what it builds, nor you.
- Main contention: understanding is the key to a good system: reliability and long-term speed.
- Understanding is building a representation of the system in your head (which is funny, since a data system is itself a representation).
- Reliability: how much you can trust the system. Long-term speed: determines how nimbly you can change the system in the future. Both these properties determine how long until you decide to throw the old system away and build a new one. Longevity.
- A system is reliable only in proportion to how much its builders understand it.

=== Understanding can be easier

- Building will never be easier than writing. But it can be only as hard as writing.
- Currently, building is much harder than writing. The reason: obstacles to understanding the system.
- Five obstacles: bad data representation, fragmentation of the data, separation of calculation and result, multiplicity of logical forms, separateness of interface.
- By removing these obstacles, understanding becomes straightforward.

====

Instead of
1. Why build
2. Why understand

Do:
1. Building is as powerful as writing
2. Understanding is the key to building
3. Remove the obstacles to understanding what you build

https://docs.hyperclay.com/docs/docs-tldr-paste-in-llm/
Very interesting concept:
- Self-modifying HTML apps.
- Only adds persistence.
- Does rely on some libraries to make the JS manipulation easier.

Definitely interesting. Why I think cell is more powerful:
- Go beyond the low-levelness of HTML & JS rerendering.
- Be able to expose an API.
- Go beyond admin vs read-only (although that distinction is already great).

"Modern web development has become increasingly complex. What started as simple HTML pages now requires extensive toolchains, multiple programming languages, and distributed systems knowledge. Hyperclay returns to the original vision of the web—a place where anyone can create and share interactive content. It’s built on the belief that many applications don’t need industrial-scale infrastructure; they need simplicity and directness."

"By that point, I had built about 30 small web projects and come across the same problem over and over again: I could build useful frontend apps in hours, but making them persistent took months (user accounts, database, API routes, templating, state management, file handling, deployment, hosting)."

"I took a 4 year detour down the web-stack-framework-making-rabbit-hole because I thought JSON + HTML made a great combo, but I’ve since come around to the idea that pure HTML is a much more pleasurable stack to work with.

I take strong inspiration from Coda, Notion, Val.town, mmm.page, and LLM artifacts.

I think we’re entering a new era of personal, malleable computing where browsing the web feels more like interacting with real objects you can mold, and less like viewing static data locked in a UI you have no control over."

https://jrcpl.us/contrib/2025/Scrappy
"We wanted to explore a wider view of programming, beyond the form of writing code in text files. That feels outdated, even inhumane. At the same time, visual programming, typically in the form of blocks or nodes-and-wires, doesn’t scale well. We both believed that logical ideas are still best expressed in the form of code, but we wanted to reduce the amount of coding necessary. Alan Kay put it best: “simple things should be easy; complex things should be possible.”"
"We did decide to focus on the niche variously known as “end-user programming”, “small computing”, “casual programming”, “home-cooked software”, “personal software”, and “software for one”. This is in contrast to typical software development frameworks and “no-code” development platforms which cater to professionals working on industrial-strength apps and websites. Another way of putting it is that we wanted to target that gap between going shopping for apps and having to hire someone to build bespoke solutions — or becoming a skilled programmer yourself."

"In terms of interactive media authoring, the biggest success after HyperCard was arguably Adobe Flash. Like HyperCard, Flash provided a visual environment that enabled non-programmers to create interactive experiences. It had a scripting language called ActionScript, which was influenced by HyperCard’s own scripting language. Flash came to power everything from simple animations to complex games on the web in the late 1990s and 2000s. It worked across browsers and platforms, which is something HyperCard never achieved beyond the Apple ecosystem. But Flash suffered a similar fate, as it was never designed for mobile devices and touchscreens, and web technologies steadily became more capable of delivering rich interactive media."

"A few weeks later, ACM SIGPLAN (Special Interest Group on Programming Languages) held its SPLASH conference in California. We didn’t attend, but there was a very relevant keynote talk by Jonathan Edwards . He talked about “substrates”, namely Smalltalk, Lisp, and (yes!) HyperCard, in contrast to the tall “stack” of software layers used in typical modern-day software engineering projects. Surprisingly, he outlined some of the same exact design goals as our little project, the one that we started months earlier: keeping data persistent, being able to manipulate data and code graphically, unifying the concepts of “programming = using”. Needless to say, we started saying “substrate” a lot more."

"In his talk, Jonathan Edwards suggests that we focus on the gap between spreadsheets and “stack programming”. This is the same gap that we identified early in our project. Perhaps that’s the ultimate killer app of substrates: to serve the long tail that’s not otherwise being served. HyperCard clearly served the long tail well, although I think that’s partially because people didn’t have real alternatives during that time. Sometimes we forget how life was like in that era. Hardware was slow, operating systems crashed, and compilers cost money. There was no Google, Stack Overflow, or GitHub Copilot; there were books and CD-ROMs of technical documentation, often well-written but expensive and rare. For a normal person in the late 1980s and early 1990s, HyperCard was like an oasis in a desert. Today, there are more, different solutions out there that cater to the long tail."

You only need dot on initialization of the variable, not afterwards. Same with :. You could technically just do fine with :, but that assumes you're always inside a sequence. When are you not? Inside a cond, for example. Or if a put is suddenly inside somewhere. My gut tells me we need both : and .

### 2025-12-27

We could have multiple dots on put? Tes, we could. So dot mode is really per hook.

The core problem I have understanding cell.respond is that I'm mixing absolute (contextPath) and relative (targetPath) paths. I think I need to set it all in absolute terms. Resolve things relatively, but then operate absolutely.

### 2025-12-24

Still with the rewrite of cell.put.

Would it make sense to build the `seen` of what we're putting? It is usually less than what is there already in the dataspace. Then you sift through the dataspace and remove what clashes with that.

I'm thinking of the tricky cases:
- A path that is replaced with almost the exact same path except the last step.
- A long path that is replaced with a short path that is a prefix of it.

The second case would give you a type clash at the last element (well, next to last, since we get the types of proper prefixes). So that's taken care of. The only difficult case is the first, where types are perfectly consistent, there you need to look at the value. In that case, instead of looking at values, if we see that it is the last step and there's a seen, we also remove it since it will be replaced by the new types.

OK, let's rewrite the tests!

An interesting consequence is that there's no invalid message you can pass to put. If it is already valid fourdata, there's nothing that can come after the put that would be considered invalid.

I should really call "call" message in the context of the dialog? No, because the message is what comes to the right of the location. Call = location + message.

We're going from seven calls to cell.put to one in the refactor. This should definitely reduce the performance hit of cell.call.

### 2025-12-23

This x4 of cell is really falling into place in my mind and gut: logic, data, rules, views. That's the quadrivium. The trivium would be access, cron and surface (endpoint). The editor is everywhere, it's part of the whole thing. The parts that run are really four too: language, db, service and editor, but each of them provides multiple things of the quadrivium and trivium.

From The Art of the Metaobject Protocol:
"First, the access must be at an appropriately high level of abstraction (...) so that users aren't saddled with gratuitous (and non-portable) details."
But can't we design a general purpose system based on concrete things that have no unnecessary details?

"It is important to note, howeveer, that self-referentiality is not essential to the basic notion of a metaobject protocol."

"What reflection on its own doesn't provide, howeveer, is flexibility, incrementality, or ease of use. This is where object-oriented techniques come into their own."

My summary of OOP as presented here:
- A set of object types and operations on them (the protocol).
- A default behavior (default classes/methods).
- allow incremental adjustments from the default behavior (inheritance/specialization).

"Because these objects represent fragments of a program, they are given the special name of *metaobjects*. Second, individual decisions about the behavior of the language are encoded in a protocol operating on these metaobjects - a *metaobject protocol*."

"Most aspects of both its behavior and implementation remain unchanged, with just the instance representation strategy being adjusted."
The methods are overriden on instances of the objects, so you can specialize the code where you need.

Behavior vs implementation: interface vs logic; it shouldn't be any more than that.

"We begin with a (simplified) CLOS *sans* metaobject protocol, and gradually derive one for it."

"The most significant is that it is an interpreter rather than [sic] compiler-based implementation - that is, we have reduced complexity by neglecting performance."

Classes work at the configuration, meta level. They strike me as similar to types. What you work with at runtime is instances of classes.

We could also write a safe put, or even pass a safe flag to put, to get an error instead of a replacement when changing types.

OK, designing new put:

- Assumes that the paths are already internally consistent, which they are because they come through cell.call and are validated
- Each hook on put has to find its own context path. Could be a bit tricky, but I think it makes sense. It'd be arbitrary to use the first hook as hook for all of the same ones that are at the same level.
- So, find context path for each hook.
- Add respective context paths for all of the paths.
- For each path, for each step, check consistency with what exists. Lack of existence means you don't delete anything. A path that has the same prefix minus one and has a different last step can be replaced. Inconsistency means you remove wholesale a bunch of paths.
- After removing inconsistent paths, simply add the new ones.
- We don't need to validate the new dataspace because we remove inconsistencies rather than alert on them.
- Sort.
- Persist.

- Another idea: reuse the `seen` to find the context path for each hook. But that would require us to do this also for the context path. And the intermediate steps too. So no, we need to find the context first, then do the seen.

Tests to add tomorrow:

```
      - c @ put stereolab records 1 margerine
                                  2 jaunty

      - c @ put stereolab records 3 emperor
                total 3

      - c @
        r stereolab records 1 margerine
                            2 jaunty
                            3 emperor
          total 3
        tag "Upserting into a list"

      - c @ put stereolab records 1 mars

      - c @ stereolab records 1
        r mars
        tag "Single replace inside a list"

      - c @ put stereolab 1

      - c @
        r stereolab 1
          total 3
        tag "Replace hash with number"

      - c @ wipe

      - c @ put stereolab records 1 margerine
                                  2 jaunty
                                  3 emperor
                total 3

      - c @ put stereolab records yes!

      - c @
        r stereolab records yes!
          total 3
        tag "Replace list with text"

      - c @ wipe
```

### 2025-12-21

cell is for scientists and entrepreneurs! That is where I need to aim first. Why?
- Need to build their own systems.
- Pragmatic.
- Semi-technical.
- Need control and understanding over what they build.
- They don't have much patience or time for dealing with the accidental complexity of programming tools.

People in industry that resonate with scientists and entrepreneurs are also good initial users.

From Fogg's Tiny Habits:
- Help people do what they already want to do
- Help people feel successful

A basic version of cell could already:
- Replace Postman for calling APIs and seeing results.
- Having a DB and a FS to persist state.
- A tool for making dashboards.
- External AI integrations.

Seen from the outside, from the pragmatic view of someone building something, a cell is for four things:
- Holding data (both normal data and files/blobs).
- Running logic to transform data.
- Enforcing rules on data.
- Creating views out of data.

These are the big four.

Now, what doesn't fit in the above?
- Tests: they're not just rules, they are a combination of logic being run + rules on that. They could be their own fifth element.
- APIs/entrypoints: ways to access the data from outside of the cell.
- Access: perhaps these *can* be expresssed as rules! Or would it be too cumbersome?
A la yegge, what?
- logic
- data
- view
- rule

Perhaps I could call entrypoints as "surfaces".

From the [Rue language](https://rue-lang.dev/) I got the idea of writing a fibonacci function:

```
fib @ do n @ if cond @ < - @ n
                         - 1
             do @ n
             else @ + - @ fib @ _ - @ n
                                  - 1
                      - @ fib @ _ - @ n
                                  - 2
```

- Must express minus as underscore, not so pretty, but otherwise it cannot be disambiguated.
- Can pass a single implicit step to the sequence.
- If I write it with commas, we can have a single line per fib call in the else

```
             else @ + - @ fib @ _ , @ n , 1
                      - @ fib @ _ , @ n , 2
```

This is a matter of style, exactly like in natural (written or spoken) language.

From The Art of the Metaobject Protocol:
"The metaobject protocol, in contrast, is based on the idea that one can and should "open languages up," allowing users to adjust the design and implementation to suit their particular needs. In other words, users are encouraged to participate in the language design process."

"In traditional object-oriented languages, the terminology used for a polymorphic operation is *message*. (...) The CLOS term for message is *generic function*"

"the information needed to choose the best implementation strategy might be difficult or impossible for a compiler to extract from the program text, sinc e it depends on dynamic behavior, such as how many instances will be created, or how often their slots will be accessed. This is why efficiency is a challenge."
redis did this very well in providing fixed time/space constraints for its calls. I wonder if it's possible/necessary that cell can get these runtime properties from having all of the information at runtime.

"Rather than supplying the user with a fixed single point in the space of all language designs and implementations, we would instead support a region of possible designs within that overall space. This is the essence of the metaobject protocol approach."

But what if, like Redis, the underlying blocks are universal enough that they can allow users to build everything with them? The space of the system would be determined by those base calls, and the user would choose from there. This is not metaobject, but rather, simply, calls.

claude responds to the above with "cell's runtime omniscience". Made me laugh because it has a point. cell does seem to know everything about that cell because it doesn't throw away any information when compiling, interpreting or executing.

"There are two critical enabling technologies: reflective techniques make it possible to open up a language's implementation without revealing unnecessary implementation details or compromising portability; and object-oriented techniques allow the resulting model of the language's implementation and behavior to be locally and incrementally adjusted."
What if reflection is simply being able to see the source code in a tokenized way and act in consequence?

Should I respond with an error in cell.get if you're trying to access a numeric key on a hash (not just on the final prefix step, but on any), or a text key on a list? Let's see if it is useful. For now, I want it to always work. But let's see in practice.

### 2025-12-20

For functions that generate random quantities, like uuid: do we read their previous value in redraws? sometimes they should!

How do you separate data and code in a cell? The most basic way would be to put all data at the prefix (not path, prefix, because a path is just one list of steps) `data` and have it there. If you have multiple users, you can either store per entity, or (my preference) by user, under the id of each user, so their data is already separated.

On validation: rather than have a documentation format a la openapi, or a backus naur form, just write the validations in code. But make that code beautifully readable, and have the full power of code. The validations must be code. Merging typing and schemas and all the normative stuff into something readable that can be computed is like the prince of persia character merging with his shadow.

Maybe with @ is instead of @ check

```
@ is text foo
```

where `foo` is a path

More generally:
- @ is <type> <path>
- @ is <op> <operand> <path>

claude: "The unification hasn't been done because most languages don't have syntax that makes @ is text p foo read like a schema declaration while being a direct function call."

https://venturebeat.com/ai/anthropic-launches-enterprise-agent-skills-and-opens-the-standard
"Anthropic designed the system around what it calls "progressive disclosure." Each skill takes only a few dozen tokens when summarized in the AI's context window, with full details loading only when the task requires them. This architectural choice allows organizations to deploy extensive skill libraries without overwhelming the AI's working memory."
Basically, lazy loading of prompts and already defined pieces of code.

"The Skills approach is a philosophical shift in how the AI industry thinks about making AI assistants more capable. The traditional approach involved building specialized agents for different use cases — a customer service agent, a coding agent, a research agent. Skills suggest a different model: one general-purpose agent equipped with a library of specialized capabilities."

This is also very interesting. Specialization is extra context, but thinking remains general.

"The pattern echoes strategies that have reshaped the technology industry before. Companies from Red Hat to Google have discovered that open standards can be more valuable than proprietary technology — that the company defining how an industry works often captures more value than the company trying to own it outright."

https://www.businessinsider.com/claude-code-creator-vibe-coding-limits-boris-cherny-anthropic-2025-12
"It works well for "throwaway code and prototypes, code that's not in the critical path," he said."
"Cherny said the models are still "not great at coding."
"Cherny said it's "insane" to compare current tools to where AI coding was just a year ago, when it amounted to little more than type-ahead autocomplete. Now, it's a "completely different world," he said, adding that what excites him is how fast the models are improving."

Vibe coding has hard limits; but in one year we went from a glorified autocomplete to something else entirely.

Some ideas on Rust prompted by a [glorious video on C++](https://www.youtube.com/watch?v=7fGB-hjc2Gc) by Lazo Velko:
- Difficult to do metaprogramming.
- The borrow checker stands in the way of quick iteration. The language makes it harder to be flexible and not specify things when you're sketching.
- I was also surprised by the mention of it compiling slowly.

I went on the rabbit hole a bit. Interesting that [Zig doesn't use LLVM](https://news.ycombinator.com/item?id=44390972): "Basically, not depending on LLVM or LLD. The above is only possible because we invested years into making our own x86_64 backend and our own linker. You can see all the people ridiculing this decision 2 years ago https://news.ycombinator.com/item?id=36529456"

### 2025-12-19

The risk tackled by cell is in AI creating systems that we cannot understand.

Do I need the : on the push? The expansion takes place at `: do`. If you just look for `output`, it will be first seen at `: do N`, where `N` is the number of the step. But `output` is at `: output`. Then, you go to `: do`, it is also not there. But it is then at `:`, so the colon is not necessary!

But what about initialization? You can do it with either `.` or `:`, right? Actually, not with `.`, because it would be set at `: do N`, whereas you want things to be at colon.

```
fizzbuzz @ do n - @ put : output ""
                - @ if cond @ % - @ n
                                - 3
                       else @ push p output
                                   v fizz
                - @ if cond @ % - @ n
                                - 5
                       else @ push p output
                                   v buzz
                - @ output

fizzbuzz @ do n - @ put : output ""
                - @ loop do pair - @ if cond @ % - @ n
                                                 - @ pair v
                                        else @ push p output
                                                    v @ pair k
                         v fizz 3
                           buzz 5
                - @ output
```

OK, let's try using the one-step hook and see how much things break!

I see that we're walking up the context path, and matching that against the entire query path. That's not the single hook logic at all. With the existing logic, let's say our query path is `list 3`. If we don't find a list with a 3, we will keep going up!

```
inside list 1 no
            2 maybe
           = yes
       ref @ list 3
list 3 yes
```

But with the new logic:

```
inside list 1 no
            2 maybe
           = ""
       ref @ list 3
list 3 yes
```

I still think this is much more clear. It also makes reference and call consistent, in that by the single hook, we don't know or care (yet) what's the location of the call and what's the message. Just look for the hook!

How to implement this?
- When you find the first match of the hook, stop the iteration.
- Don't just return that path, also take all the paths with the same prefix.
- Slice the query path out of those paths.
- Whatever non-empty paths remain, that's what you need to return.

I still need the dot mode to not walk up.

Interesting corner case: when query path is empty, there's no hook. Bring everything. But mind the context path.

Wow, that went far, all the way to sequence! All the non-sequence tests work with the get with a single hook. So I was already implicitly using that test.

### 2025-12-16

We went from compiled to interpreted, but we're still running the code explicitly. Off/on, then it auto-shuts down.

The whole thing with p and v in @ put is about upserting vs overwriting. I just realized, if you are not overwriting nearby paths (that is, if you're upserting), then you don't need p! You just set the paths you have. For example, if you have:

```
stereolab records 1 margerine
                  2 jaunty
```

And then you do an upsert put like this:

```
@ put stereolab records 3 emperor
      total 3
```

Then you will end up with this:

```
stereolab records 1 margerine
                  2 jaunty
                  3 emperor
total 3
```

And if you do then

```
@ put stereolab records 1 mars
```

You'll have

```
stereolab records 1 mars
                  2 jaunty
                  3 emperor
total 3
```

Now, if you want to do this:

```
@ put stereolab 1
```

It will not work, because stereolab is a hash and you're making it into a number. However, what if we consider that if the type is changed, you're overwriting the whole thing?

Then, the above would do:

```
stereolab 1
total 3
```

Let's go to a situation where we have:

```
stereolab records 1 mars
                  2 jaunty
                  3 emperor
```

Then, if we do

```
@ put stereolab records yes!
```

Then we'll end up with

```
stereolab records yes!
```

So yes, change of type will overwrite whatever we need to overwrite. No need to pass p or v. And no need to wipe to be sure that you overwrote whatever you were setting. If you want to wipe, then you wipe, otherwise there's always an upsert, and if the type changes, we overwrite.
This also solves the multiput problem cleanly. Each top-level prefix you send to put is its own hook.
As long as what you send in the put is internally consistent, it will be applied.
The left-side/right-side separation was blocking me from seeing this pattern, which looks quite natural in retrospect.

Terminology:
- path: a list of steps
- prefix: the left part of one or more paths. N paths can share a prefix.
- value (of a prefix): N paths that are to the right of one prefix, with the prefixes removed.
- key (of a prefix): the last step of a prefix.
- type (of a prefix): the type of the value of that prefix

cell as a "personal server", in the original sense of "personal computer"? The cloud services haven't used that angle, perhaps because they are not trying to empower individuals to build, they're mainly focused on solving causes of headaches for companies.

cell is about empowering individuals to build.

claude: "So the Amiga's achievement was bringing enterprise-class multitasking to a consumer computer at around $1,300. Combined with its advanced graphics and sound, this made it feel remarkably sophisticated compared to contemporary home computers. But the underlying concepts and implementations had existed in larger systems for decades before."

A cleaner way to have sets would be to have lists where you have a push that is conditional to be unique. @ unipush (or @ upush)

https://byteofdev.com/posts/javascript-benchmarking-mess/
"Many of the same design decisions that made JavaScript (relatively) performant and portable make benchmarking significantly more difficult than it is in other languages. There are many more targets to benchmark, and you have much less control in each target."

https://byteofdev.com/posts/deep-dive-distributed-database/
"While not technically a database architecture, one of the most popular ways of reducing load on a database server while improving performance for common queries is a query cache. Traditionally, this has been implemented by custom caching layers, using in-memory databases such as Redis or Memcached. Servers in between the web server and database receive the queries before the database and store the result of the query in a cache. Then, if another identical query is sent, the result can be server from the cache instead of sending it to the database. These cache servers can be deployed across the globe without any consistency issues, as they do not handle writes. Additionally, because it is a simple (often in-memory) cache, the query itself is much faster."

Plan:
- Finish porting the tests to test.4tx
- Change put to not use p or v
- Change get and put to use a single hook
- Make fizzbuzz work

I'm not happy with how I'm structuring sequences. A sequence, really, is a list. I'm almost thinking of making it, by default, that the first step of any sequence is to set the message to a value, and every step comes after that. The question is, how do we reference this, or more precisely, where?

```
= ...
: 1 @ put . message value
  2
@ ...
```

But if you do this, you cannot put message in : because it is a list! Where is the space for the sequence to share data inside of it? It has to be at colon, therefore we need something like `do` (better than `seq`) inside colon.

Finding a problem with sparse lists in the test suite. If I give the test suite to cell.textToJS (like I do), sparse lists become [undefined, ...] and then I don't have the missing elements. An option is to ignore undefined when building lists. This could work.

With the porting of the tests, cell is about 1k lines and the tests are about 1.3k. I wonder if it will be a long term of "good" cell systems that the implementation and the test suite takes roughly the same amount of paths.

### 2025-12-15

Claude: "The deeper validation: When your test format is your data format, you can't fake clarity. If the format were genuinely awkward, writing these tests would expose it immediately. The fact that they're this readable suggests fourdata has achieved something real - it's comfortable expressing itself to itself."

Continuation as what makes a program into a function without free variables

https://en.wikipedia.org/wiki/Continuation-passing_style
"Expressing code in this form makes a number of things explicit which are implicit in direct style. These include: procedure returns, which become apparent as calls to a continuation; intermediate values, which are all given names; order of argument evaluation, which is made explicit; and tail calls, which simply call a procedure with the same continuation, unmodified, that was passed to the caller."
the s in astack is really a continuation!
"When the CPS function has computed its result value, it "returns" it by calling the continuation function with this value as the argument."
next (); callback!

== I get types now

OK, I finally get why type systems are so popular. Typescript, or any type system, is constantly running through ALL of your code! In a batch-and-queue programming language (like almost any programming language nowadays, really), this brings up a lot of potential issues, without you having to write thorough tests that test your system at runtime. The type system lets you determine the structure of things and to find inconsistencies.

To me, the cost paid is prohibitive, because these assertions about the system should be done with the full power of code, its same constructs (rather than a separate syntax) and at runtime. At runtime? Yes: if your system constantly runs and updates, like a spreadsheet, there's no repetitive command you need to invoke. The system is always up to date. Any anomalies are flagged as errors that you can see.

A good runtime system that allows assertions will also allow you to see what are the assertions that a value already passed, so you can really narrow it down when you're in a context. This runtime assertion system has all the benefits of a type system and none of its drawbacks, provided: 1) it's always there, not just when you run your system + a test; 2) it's integrated in the editor, so you can "see" the assertions at any point.

And, for the anarchists like me out there, that's what we miss out on when we're using javascript instead of typescript. We need an e2e suite to be constantly running against our system, and we still have to remember what x is at any point. Nothing less, nothing more.

==

Self-similarity as recursion: the different levels are built out of the same components. Failures of self-similarity multiply complexity. That's why type systems fail.

https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)
"The hexagonal architecture divides a system into several loosely-coupled interchangeable components, such as the application core, the database, the user interface, test scripts and interfaces with other systems. This approach is an alternative to the traditional layered architecture."
Sounds to me an awful lot like grouped sets of calls. Whether those calls are "business logic" (emphasis on those air quotes), persistence, notifications or admin is quite moot. It makes sense as an overall division of concerns, though I wouldn't separate persistence from business logic; and admin and notifications seem very related too.

Types try to be metamathematics, by describing it without being it. But the way forward is to make it math all the way up and down.

### 2025-12-12

Any explanation of a grammatical construct should start with an apology.

The do/else in @ if is like that of @ do and @ loop, except that it doesn't receive a message. And, for that reason, it doesn't have a :, and the actual definition gets expanded. But, why don't I have this in @ do and @ loop if I have a lambda? There's something not quite fitting here.
The thing is, where can I put the expansion for cell.do or cell.loop, if not right there? It has to go in :. @ is the call itself, no room there. = is the result. So it has to go in the middle. But why is this not the case for if?

```
@ if cond = 1
          @ not 1
     do = 1
        @ not 0
```

It is because do or else are fully free, you can put the entire expansion there and expand it. In cell.do:

```
f15 @ fizzbuzz 15
```

To the right of f15 you have fizzbuzz, the actual reference. If you had a reference to a sequence next to do, it'd be the same thing.

In any case, I'm not sure if you could have good lambdas in do or else without :. Because you'd have no way to reference other steps. I'm tempted to make it also have a : if it's more than just one call. More than one call: sequence. Just one call: reference. Could it really be just this simple? But references to a sequence also have an expansion.

Changing tack:

Testing cell.put with context path:
- cell.call (single entrypoint) calls cell.put with an empty path as context.
- We don't want to call cell.put directly, but rather do it through cell.call.
- Solution: test the context from within a sequence.
- We are not passing the context path in any call to cell.put, except for the couple of tests we're trying to rewrite right now.

Why not drop the context path altogether for cell.put? Well, we use it in cell.get. Many invocations to cell.get have a context path. Could we just use the context path more?

OK, we restored contexts to the calls to cell.put from inside cell.do. Now, we use the context path. It's found its good place, and we have symmetry with cell.get. The other calls to cell.put are either on cell.call (outermost) or one in cell.respond. That one is too sophisticated, does too much logic, to resort to the simple walking up of cell.put. At least for now; perhaps this will change when we refactor it into something simpler. There's no more other calls to cell.put.

BUT, we don't want to rely on cell.do to test cell.put, so we will just expose that context parameter in the tests. End of story!

It must be clear that without dot, there's no way, from inside a context, to set a new variable (note to self, come up with a better name than "variable"!) that is not at the top level! The dot is what prevents the walking up. There's no way we can do without it, unless we send silly calls with the entire prefix we are in to put, which is the equivalent of only being able to use absolute paths in a file system.

### 2025-12-11

What determines the type of a prefix is what the paths to its right are, or rather, we can just say its paths? Or its values, but those values are paths. If the paths are of length 1, the prefix actually only can have one path value, and it's either a text prefix or a number prefix. If the path values have a length of 2 or more, the type of the first step of each of them determines whether it is a hash prefix or a list prefix.

### 2025-12-10

Big questions:
- How does cell.respond behave? Not cell.do, or cell.native, just cell.respond.
- How do we build dependency graphs?

```
eleven : int 10
         do - int - @ + - @ int
                          - 1
       @ plus1 10
```

There are three calls inside eleven:
- eleven
- eleven : do 1 int 1
- eleven : do 1 int 1 @ + 1

- The first call (eleven) depends on plus1 only. It depends on the very first step to the right of the @.
- The second call depends on +. However, because it's a native call, that won't change. However, if you redefine it, it will, and you can redefine any call. So there's no skipping it. So, it depends on +. It also depends on int.
- The third call just depends on int.

I was going to say that the less nested calls that include a call depend on those calls and those calls only. That makes sense, but in the case of eleven (the outermost call), the dependencies are really against plus1, which is the one bringing the entire definition. So this already violates this principle.

If the cell is somewhat big, I need the dependencies. But if this is so hard to think about, then I can take a shortcut:
- Unrelated toplevel prefixes should not care about changes somewhere else.
- But then, why toplevel? What I care about is, from the moment you have an @, you have to recompute things. Why can't I just have a map of all the paths that affect a prefix that are NOT starting with that prefix? Now, that is interesting.

eleven depends on plus1
Things inside eleven : do - int - depend on things to its right, but that's just understood.

So, a rule would be:
- If something to your right changes, you need to re-evaluate also what happens to your left. There could be some false positives (unnecessary recalculations) doing this, but it's fine. It's probably more expensive just to keep these extensive dependency lists (not to mention that I cannot figure out how to do it).

So, the chain of dependencies can be just for non-obvious things looking to the left.

What's tripping me off is that the place to look for is dynamic, non-obvious, because the system walks up until it finds something with the step after the @! So, you don't know (unless you walk) where that dependency is. Well, it is somewhere in your prefix, and if you don't find it if you go all the way to the left, it's nowhere.

For practical purposes, what I need is to know that eleven depends on plus1, and recalculate eleven when plus1 changes. That's really it! And if something depends on eleven, change that as well.

We also need to prevent (with an error as a value, yeah) circular references.

If you have something like

```
fdynamic @ fizzbuzz @ value
```

Then, fdynamic depends on both fizzbuzz and value. Two important things:

- Instead of thinking in terms of toplevel or not, let's just think in terms of prefixes before the first @. These are the static parts (I don't even have to use quotes), so these are the ones where it makes sense to have dependency entries. What this shows is that we want to have a list of dependencies for each call that is the leftmost on its path. Not calls that have another call to their left (there's the problem with the =s, but those are results really and in any case the @ are replaced with =s, so it's either irrelevant or it doesn't even happen). These are the calls that need the dependency list!
- If those calls depend on something more "internal" that is defined internally, it doesn't matter because you're remaking the whole thing anyway, right? No, if that thing being referenced is to the left of the first call, it's outside, and, because there's no call, you know its value. So you know it. But what about referencing something that has a mere value?

```
fdynamic foo @ value
         yo @ fizzbuzz @ foo
```

In this case, fdynamic yo depends on fdynamic foo. So we have to look at the definitions inside to see to what they might resolve.

Why can't we generate dependency lists on the fly? Because we don't know who is referencing that who you just changed. That's the problem. If you don't know, or you forgot, you need to do a full pass from the top.

Let's go to a low effort solution:

- Track dependencies for first call prefixes only.
- For each first call, look at all the calls to its right; take all the first steps after them, make it into a distinct set, and assume that those are dependencies at the prefix level, and also at the prefix - 1 level, all the way up.

So:

```
eleven @ plus1 10
```

Dependency is eleven -> plus1

When you have the expansion:

```
eleven : int 10
         do - int - @ + - @ int
                          - 1
```

eleven : do 1 int 1 -> + and int. For all five walk ups (starting with the zeroth, the prefix itself) you have 5x2 = ten dependencies.

Really, we could just store + and int, the walk ups of the prefix are just given by the prefix itself. But, what happens when a change comes in from somewhere else?

If the change is in int, potentially we need to rework this call. But if it is in bar int, we won't. It's crazy how much the single step walk up (rather than multiple step walk up) is simplifying things for us.

Zoom out for a minute:
TODO:
- Fully define fizzbuzz (single fizzbuzz) and html generation/validation, make sure that get and put with single hook work with it.
- Modify get and put to use just the first step of the path as hook, rather than looking for a match everywhere. I want to see how much this breaks my tests, to see if there are good countercases.
- Reimplement cell.respond fully understanding the algorithm, including the commas.

Going back to fizzbuzz, the dependencies are none? No!

```
f15 @ fizzbuzz 15
```

f15 depends on fizzbuzz

```
fvalue @ fizzbuzz @ value
```

fvalue depends on fizzbuzz and value

OK, so how do these little lists help me to know when something has changed and has to be recalculated?

We have a bloody symbol table that is global. And it's the other way around, we store the steps that are being called, so it's a dependents graph, not dependencies.

```
dependents fizzbuzz - fvalue
                    - f15
           value - fvalue
```

Cleaning the dependency table shouldn't be difficult, which is something I was fearing: if the prefix changes, see if its still a dependent of where it is. But how do you quickly look that up? You also need a dependencies graph!

```
dependencies fvalue - fizzbuzz
                    - value
             f15 - fizzbuzz
```

You don't and cannot know the actual dependency path until you're actually executing. But you don't know whether you should re-execute, that's what we're building this responsive layer in the first place.

The dependents can only be single steps. The dependencies can be paths of length 1 or more.

```
calls fvalue @ fizzbuzz @ value
      f15 @ fizzbuzz 15
```

gives you:

```
dependents fizzbuzz - calls fvalue
                    - calls f15
           value - calls fvalue
dependencies calls fvalue - fizzbuzz
                          - value
                   f15 - fizzbuzz
```

I feel good about this. This can work.

I am just thinking about Earley's "combine like subparses". Is there anything like this available here? I'm also thinking about recursive calls: how do we not consider them to be circular dependencies? A low effort way of doing it is to track cycles in what triggers recalculations.

Why fizzbuzz execution got stuck:

```
(2025-12-10T21:15:21.612Z) putting:
p "fizzbuzz 15" : seq 2 =
v @ push p output
         v fizz
(2025-12-10T21:15:21.615Z) putting:
p "fizzbuzz 15" : seq 2 = =
v ""
```

I need to distinguish between "there is an empty text" vs there is nothing there.

I think this is the problematic line. I need to see if there's a path there that points to a "" step.
```
      if (currentValue.length === 0) {
```

Let's now go through it manually.

```
"fizzbuzz 15" @ fizzbuzz 15
```

```
"fizzbuzz 15" : n 15
                do - @ put p : output
                           v ""
```

```
"fizzbuzz 15" : n 15
                output ""
                     = ok
                do - @ put p : output
                           v ""
```

```
"fizzbuzz 15" : n 15
                output ""
                     = ok
                do - @ put p : output
                           v ""
                   - @
```

(I'll continue on the next session)

Off-topic: I think cell is a low-effort attempt to do the impossible.

### 2025-12-09

You want to build quickly. But you also want the speed to continue.

```
fizzbuzz @ do n - @ put p : output
                        v ""
                - @ if cond @ % - @ n
                                - 3
                       else @ push p output
                                   v fizz
                - @ if cond @ % - @ n
                                - 5
                       else @ push p output
                                   v buzz
                - @ output

(I'm doing the expansion by hand on the call below)

f15 = fizzbuzz
    : do - ""
      output fizzbuzz
    @ fizzbuzz 15
```

List of dependencies:

- p fizzbuzz
  v "Technically, this doesn't point anywhere else, just to itself, because the whole thing to its right is taken as a literal"

Wait, I need to do this with the expansion.

Loose idea: if you respond with "stop @ foo", are you freezing the @ foo? No, you're resolving the @ foo first. So there has to be a way to defuse the @. That's just by returning a definition, or rather, a sequence (interesting to think that definitions and sequences are the same, I think they are).

OK, stop everything. If I go with the single hook principle, can I still access the message? Yes, you can, as long as : is on the way out. Wait, it won't work. Yes, it will. Check this out:

```
: int 10
  seq - = 11
        @ + - = 10
              @ int
            - 1
```

On : seq 1 @ + 1 @, we're looking for int.
We try looking then for it in : seq 1 @ + 1, then on : seq 1 @ +, then on : seq 1 @, then on : seq 1, then on : seq, then on :. We find it on :. If : was behind an x, and that x was all the way out, then yes, we'd need to add an x there on the prefix. bBut not if it's on the way from the context to the general from the place where you make the call.

I need to do the expansion slower:

```
eleven : int 10
         do - int - @ + - @ int
                          - 1
       @ plus1 10
```

That's where we are when cell.respond kicks in.

### 2025-12-07

The message of cell, its why, is as important as its content/implementation. I haven't defined that well.

The axis of my work in programming is about understanding. Understanding as the key to everything we want: speed, ownership, control, reliability, flow, joy.

When I look nowadays at new AI powered editors (Cursor, Windsurf), I see impressive AI that autocompletes code that still has three types of braces (parenthesis, square brackets and curly brackets). This reminds me of Ford's "faster horse", but I need to understand the kernel of why.

claude: "Every AI coding tool - Cursor, Windsurf, Copilot - is making it faster to write the same complex code. We're making the code unnecessary in the first place."

I think it's the following: this AI coding wave is about "build systems quickly". If you are a skilled programmer, you can go much faster. If you are not skilled in programming, the AI can take your requirements and make them into code, very very quickly. This is really powerful, not a fad.

However, the limits to this process are hit quite quickly: you're building fast, but you're not understanding what you're building. If you're skilled, the AI will write a lot of code that you'll struggle to follow, because of its sheer amount. If you're not skilled in programming, you'll build something you understand only very superficially. In both cases, understanding is missing.

The why of cell is: "build and understand systems quickly". The requirement is build+understand, not just build, and the measure of success is still speed. Why speed? What about the tortoise and the hare? As I see it, if you understand the system quickly (instead of just building it quickly), there's no debt. You fully own, control and can rely on your system. If you quickly build and understand, you are a fast tortoise.

AI makes the understanding part more difficult, but doesn't cause it. What causes it is the complexity of software. The definition of complexity can be: whatever makes a system harder to build and understand.

Then, going back to the top:
- The why of cell: build and understand systems quickly.
- The how of cell: starting from first principles, eliminate sources of complexity: multiple and high noise data representations, fragmented dataspace, code and result being separate, proliferation of logical constructs, separateness between time and code & between user & system.
- The what of cell: data representation, unified dataspace, call/response, fivelogic, integrated editor & service.

- For those who already know how to program: it becomes easier to understand without losing speed.
- For those who don't know yet how to program: they can learn along because they can understand what the AI is doing.

Things that are not so important in themselves:
- Essential vs accidental complexity: you see this retrospectively only.
- Comparison to prose: this will also be an emergent property of removing accidental complexity.

#### A quick theory of system complexity

Rule 1: effort to add/change something in an existing system = size of the change * complexity of the system
Rule 2: complexity of the system = effort it requires to understand it
Rule 3: system complexity grows as the inverse exponential function of how much its builders understand the system * rate of effort

Clarifications:
- Effort = skill * time
- For small teams you generally can add effort towards the same addition/change, for large ones you generally cannot.
- Rule 1 might be tempered (or aggravated) by how acquainted or unacquainted a team is with their own system.
- Things to be done are either: additions or changes. In any case, it's about improving the system **without breaking what is already working in the system**.
- Rule 3 is necessarily more complex mathematically because it is what breaks linearity and brings in exponentiality.

Explanation:
- Why complexity is key? Because it determines the overall long-term/asymptotic effort of doing *anything* in a system.
- Understanding determines how quickly someone can fix problems since they are easy to find; and how quickly they can add features since it's clear how the new features can coexist with the existing ones without breaking them.
- Complexity tends to increase exponentially and can quickly dwarf enormous efforts, even of large teams composed of skilled people that spent a long time understanding the system.
- No training can dwarf large complexity either, because a sufficiently complex system cannot be understood. It can only be understood if it's simplified.
- Understanding gives you a reliable representation of what you understand. You don't just hold the elements of the system, but also all of their interrelations. I suspect there's a n^2 phenomenon here at play, where the effort of understanding is quadratic with the number of elements; this is also perhaps related to LLM attention training, which is also n^2 since it holds the relationship of any element against each of the other ones.
- Minimizing complexity is the only way to retain speed in the long term.
- Speed of development is a great metric, but not just the speed on the first week or month of the project. The speed that matters is that over the entire lifecycle of the system.

====

cell helps you build and understand systems quickly.
cell helps you quickly build and understand systems.
cell helps you quickly build systems that you can understand.

I pick the middle one.

Things I'm removing from the top

```
### Additional vibe goals

- Make information systems habitable.
- Provide a different everyday fabric of computation.
- Find a sweet spot between the low-level spreadsheets and programming languages, on one end, and big, clunky applications on the other.


The core understanding behind cell is this: originally, we developed computers to get the result of various mathematical calculations. But this is not the case anymore: most of our systems now are not concerned with calculations, but rather, with the management of data. More precisely, we use computers to store, communicate and transform data. In short, computers and programs are only valuable because they let us work with data. **The game is data.**

Cell attempts to make programming like natural language through two innovations:

- Putting the code in the same place as data (and with the same structure).
- Putting the result of each piece of code literally on top of the code that generated it.

It also helps that cell uses very few symbols, choosing instead to use regular letters and numbers. Things that can be pronounced are generally more memorable and graspable.

Here's an illustration:

= 15
@ plus10 5


### The seven problems

1. Different ways to represent data with text. High noise (syntax). Or imprecise and clunky graphical representations of code, which also use text.
2. Data being fragmented everywhere. Takes a long time to find where things are and more to make them reference each other cleanly.
3. Lack of visibility between inputs and outputs. Console log everywhere.
4. A panoply of ways to program, none of which are straightforward or procedural. Think OOP vs pure functional vs low-level programming with pointers.
5. Systems that you need to re-run.
6. 3-8 libraries and subsystems to do anything useful.
7. Facing the blank paper and having to read a lot to do anything. Drawing a blank in the middle of the process or getting stuck.

### The seven powerups

Cell employs seven powerups to make programming as easy (or hard) as writing prose:

1. **Fourdata**: a simple way to **represent data**. This allows you to look directly at any data that comes your way.
2. **Dataspace**: a single space **where all the data of your project exists**. Every part of your data has a meaningful location. Everything is organized in the same place.
3. **Dialog**: programming as a **conversation**: you write *calls* to the system, and the system responds back with some data. You can see both your call and the response as data.
4. **Fivelogic**: write any logic with **only five constructs** which you can understand in a few minutes.
5. **Reactive**: the system is **always up to date** and responds to your changes (just like a spreadsheet!).
6. **Integrated editor**: language, database, API and UI are in one editor that runs in your web browser.
7. **Generative AI**: automatic intelligence that can write code for you, interpret data, or even act on your behalf when someone else interacts with your data.
```

Side note: autopoietically speaking, any system is an information system.

### 2025-12-05

Impressive talk from Bret Victor, the first one (Inventing on Principle). The concept of having the expansions on the right is amazing, it is what I envisioned a couple of years earlier when wanting to see examples of execution next to each line of the function, only that he does it more clearly. I don't see how I can do that in cell right now, in the expansions, you can still read what happens, but you have to "go and look for it", rather than "it" being right there.

### 2025-12-03

I can really envision folks writing their own cells (if they ever like the original), much like Chuck Moore wanted a proliferation of underground forths. Hopefully the tools (both conceptual and executable) allow to do this in different levels.

- The eager vs lazy problem loses a lot of its weight in cell, because you have both the calls and the responses. So, for example, native calls like = can determine where a value came from (by checking for the @ below the =), so you can have the benefit of lazy evaluation, so to speak, by the calls being able to access cell's equivalent of the parse tree (which is the entire dataspace).

- I think the reasonable thing to do by default on loops is to pass key + value (which would be first step + what it points to), with simple values being considered a list of 1 item (except for "", which is a nonvalue that produces zero iterations (but an explicit list of `- ""` is iterated)).
- So you get k as input 1 and v as input 2. Or should we do it at `input p` and `input v`? Maybe that's better, for consistency.
- Instead of @ list, we can do @ paths? No, I like the idea based on the type, that paths are related to lists. But we do need 1 1, to get the first step of the first path.
- I find it interesting that default variables are the ones that flow up, rather than the here variables. Perhaps a better default in put is to do them "here"? But then you'd have to specify when you go up. I'm not really sure. I'd rather make walk up as default.

```
     generate @ do input - @ put p : output
                                 v ""
                         - @ put p : t
                                 v @ type @ input
                         - @ if cond @ eq number @ t
                                do @ push p output
                                          v @ input
                         - @ if cond @ eq text @ t
                                do @ push p output
                                          v @ html entityify @ input
                         - @ if cond @ eq list @ t
                                do @ loop do item @ push p output
                                                         v @ html generate @ item v
                                          v @ input
                         - @ if cond @ eq hash @ t
                                do - @ put p : tagname
                                           v , @ list @ input , 1 1
                                   - @ push p output
                                            v - <
                                              - @ tagname
                                              - @ loop do attribute - if cond @ eq _ @ attribute p
                                                                         do stop
                                                                    - stop - " "
                                                                           - @ lith entityify attribute p
                                                                           - "=/""
                                                                           - @ lith entityify attribute v
                                                                           - "/""
                                                       v @ input @ tagname
                                              - >
                                              - @ loop do @ lith generate
                                                        v @ input _
                                              - @ if cond @ contains p @ html tags void
                                                                     v @ tagname
                                                     do stop - </
                                                             - @ tagname
                                                             - >
                         - output
```

Let's do validate now.

- We need a double stop to make the loop stop, not just the inner function. Would this work? I think so, we're peeling one stop inside, then it comes up? No, it has to be part of what loop does. But by putting it as a value, I avoid having to have specialized aprts of the message on the call to @ loop, like I had in dale (dale.stop).
- Yeah, we can put comments in sequences without changing anything, without even quoting them.
- I can do @ + to concatenate texts.
- Note the repetition on the recursive call between the list and the hash. I'm wondering how I could make the latter reference the former.
- To @ join or to @ text? The latter feels more fundamental, because it's a type. But passing the with step is really nice too.

```
# Responds with empty text if input is valid
html validate @ do input - @ put p : t
                                 v @ type input
                         - @ if cond @ or - @ eq text @ t
                                          - @ eq number @ t
                                do stop ""
                         - @ if cond @ eq list @ t
                                do @ loop do item - @ put p : result
                                                          v @ html validate @ item
                                                  - if cond @ result
                                                       else stop stop @ result
                                          v @ input
                         - (If input is a hash, it must be a tag).
                         - @ if cond @ eq hash @ t
                                do - @ put p : tags
                                           v @ unique @ loop do item @ item p
                                                             v @ list @ input
                                   - @ if cond @ > 1 @ length @ unique
                                          do stop @ text v - "A hash has multiple tags but should only have one, found:"
                                                           - @ join v @ tags
                                                                    with " "
                                                         with " "
                                   - @ loop do item - @ if cond @ eq _ item p
                                                           do - @ put p : result
                                                                      v @ html validate @ item v
                                                              - if cond @ result
                                                                   else stop stop @ result
                                                           else - @ if cond @ match regexp - (begin)
                                                                                           - or - a-z
                                                                                                - _
                                                                                                - :
                                                                                            - range 0
                                                                                              or - a-z
                                                                                                 - _
                                                                                                 - :
                                                                                                 - 0-9
                                                                                                 - .
                                                                                                 - -
                                                                                                 - \u0080-\uffff
                                                                       else stop stop @ join @ - Attribute
                                                                                               - @ item p
                                                                                               - "is invalid; it should be a text that starts with an ASCII letter, underscore or colon, and be followed by letters, digits, underscores, colons, periods, dashes, extended ASCII characters, or any non-ASCII characters.
```

I'm doing 39 lines here (without the comment), whereas with lith it was 33 and it used dale and teishi to shorten things. It's like I have this power in cell out of the box.

I think some things will be cleaned up as I go with better native calls. The key is if the reference/sequence/conditional/loop really work. I think they do.

I'm a bit scared of the "this is it" realization, and that "this" is what will either work or not.

### 2025-12-02

> "Practically the first thing everyone tries in a game is jumping. If the game doesn't let you jump, then people enter a Fuck You mode that can be hard (possible, but hard) to overcome." -- Steve Yegge

- Jumping should be the first movement we should be able to do in the editor.
- Have skins in the editor, like winamp skins. Customizable looks.
- Standard colors: green & white; selected cell changes to blue background with a thick yellow border, so that the fovea is unmistakable.
- The commas on both sides look great. A bit repetitive, but much more clear. Put the result on top of the right comma. There has to be an even amount of commas in a path.
- Test put and get with single hook. I think it conceptually makes a ton of sense to simplify it like this. If there was no ambiguity between destination and message on a call, it'd be perhaps ok to try different lengths, but if we already have that, then single hook works all the way to reduce uncertainty of interpretation (never mind the implementation).
- Declarative is perhaps what concerns the interface: message vs response. You can do it with assertions on values, or on verifiable properties of the response vs the message. But that doesn't make it the implementation. Maybe there is something to declarative vs procedural: the interface is declarative and the implementation is procedural. But that works on every level.
- We can perhaps reach a concrete measure of complexity, by seeing what's the call count to implement something, and have calls all the way down to basic CPU operations. An equivalent interface can compare the complexity of two implementations by seeing which one is still correct (as per the assertions of the interface) and has the least amount of calls. But is that calls by definition or effective calls that get expanded on a range of inputs? The latter is roughly performance, and the former is about cyclomatic complexity or understandability.
- Are certain calls' implementations fully determined (and therefore, inferrable) from assertions on its interface? And perhaps some that are not? Would this perhaps reveal the hardness of the problem? I'm thinking in P/NP terms.

```
html entiyify @ seq text - @ loop do pair - @ put p text
                                                  v @ replace from @ pair 1
                                                              to @ pair 2
                                                              v @ text
                                  v & &amp;
                                    < &lt;
                                    > &gt;
                                    "/"" &quot;
                                    ' &#39;
                                    ` &#96;
                         - @ text
     generate @ seq input - @ put p : output
                                  v ""
                          - @ put p : t
                                  v @ type input
                          - @ if cond @ eq number t
                                 do @ push p output
                                           v @ input
                          - @ if cond @ eq text t
                                 do @ push p output
                                           v @ html entityify @ input
                          - @ if cond @ eq list t
                                 do @ loop do data @ push p output
                                                          v @ html generate @ data v
                                           v @ input
                          - @ if cond @ eq hash t
                                 do - @ push p output
                                             v - <
                                               - @ list @ input , 1
                                               - >
                                    - @ loop data @ input @ list @ input , 1
```

, also depends on the path itself? It doesn't go to the upper path? But this kind of thing can change if you remove an upper path. Isn't this dangerous? The alternative is to mark always with two commas:

```
                                 do - @ push p output
                                             v - <
                                               - , @ list @ input , 1
                                               - >
```

Then they really are parenthesis.

So, I just realized I'm doing my own, probably simpler version of the fizzbuzz problem: output for just one number, not all from 1 to n. I'll keep it like that.

TODO:
- Fully define fizzbuzz (single fizzbuzz) and html generation/validation, make sure that get and put with single hook work with it.
- Modify get and put to use just the first step of the path as hook, rather than looking for a match everywhere. I want to see how much this breaks my tests, to see if there are good countercases.
- Reimplement cell.respond fully understanding the algorithm, including the commas.

```
# No loop version
fizzbuzz @ do n - @ put p : output
                        v ""
                - @ if cond @ % - @ n
                                - 3
                       else @ push p output
                                   v fizz
                - @ if cond @ % - @ n
                                - 5
                       else @ push p output
                                   v buzz
                - @ output
```

```
# Loop version
fizzbuzz @ do n - @ put p : output
                        v ""
                - @ loop do path - @ if cond @ % - @ n
                                                 - @ path 2
                                        else @ push p output
                                                    v @ path 1
                         v fizz 3
                           buzz 5
                - @ output
```

Common names:
- v for the data (in put, loop)
- do for the sequence (in @ do, in loop, in cond)

```
html tags all @ list "!DOCTYPE HTML" LITERAL a abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption cite code col colgroup command datalist dd del details dfn div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link map mark menu meta meter nav noscript object ol optgroup option output p param pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr
          void @ list "!DOCTYPE HTML" area base br col command embed hr img input keygen link meta param source track wbr
     entiyify @ do text - @ loop do pair - @ put p text
                                                 v @ replace from @ pair 1
                                                             to @ pair 2
                                                             v @ text
                                 v & &amp;
                                   < &lt;
                                   > &gt;
                                   "/"" &quot;
                                   ' &#39;
                                   ` &#96;
                        - @ text
     generate @ do input - @ put p : output
                                 v ""
                         - @ put p : t
                                 v @ type input
                         - @ if cond @ eq number @ t
                                do @ push p output
                                          v @ input
                         - @ if cond @ eq text @ t
                                do @ push p output
                                          v @ html entityify @ input
                         - @ if cond @ eq list @ t
                                do @ loop do item @ push p output
                                                         v @ html generate @ item
                                          v @ input
                         - @ if cond @ eq hash @ t
                                do - @ push p output
                                            v - <
                                              - , @ list @ input , 1
                                              - @ loop do attribute - if cond @ eq _ @ attribute 1
                                                                         do stop
                                                                    - stop - " "
                                                                           - @ lith entityify attribute 1
                                                                           - "=/""
                                                                           - @ lith entityify attribute 2
                                                                           - "/""
                                                       v @ list @ input , @ list @ input , 1
                                              - >
                                              - @ loop do @ lith generate
                                                        v @ input _
                                              - @ if cond @ contains p @ html tags void
                                                                     v , @ list @ input , 1
                                                     do stop - </
                                                             - , @ list @ input , 1
                                                             - >
                         - output
```

- Commas are reminiscent of appositive phrases.
- The do in if doesn't have a message name, but the one from @ do or the one in @ loop do. It is interesting that we are not passing a direct message to the sequence in a conditional. It's already kind of there in cond.
- Push could autoflatten its inputs, why not?
- Still what gets passed into the "do" of a loop is a bit of an enigma. Do we get distinct values or are these still paths? Let's do it at "runtime".
- Interesting trick: to make a sequence just return a list without naming it, just put one item with "stop". But now that I think about it, we can just make it respond with the list, if the list only has one item!! But wait, I need the stop, otherwise the list would be considered a list of steps in the sequence. stop just does that, make it into a single step that has that value.
- Source of confusion: steps of a sequence go up/down, steps of a path go left/right.
- I'm really going against equality with two values on the same path, equality would have to have access to the path to see where the @s were placed, and I can think of corner cases. I'm not discarding it, but let's try without and see. Never mind, perhaps if we put one literal first and then one call, it's easy to distinguish it. If it's two calls/references, then already use a list. Another nice thing of using a list: you can check for equality of 3 or more things.
- Looping something that is "" should not iterate at all.

Next session: html validation.

### 2025-11-30

Idea: instead of if cond else, add support for notcond (not "ncond" because things have to be pronounceable). No, it doesn't look good. Let's keep what we have.

- Language
   - Sequence + reworked cell.get/put (including cell.respond)
   - Loop
   - Implement fizzbuzz & html validation/generation
- Upload
   - Single entrypoint at cell.call
   - Actual upload that stores the file in the dataspace
- Useful data handling
   - Count
   - Sum
   - Aggregate
   - Duplicates
- @ check
- @ api
   - Register api calls
   - Serve api calls
   - Send api calls through the service
- @ view
   - Serving the view
   - HTML generation
   - Auto-wiring of api calls to the messages that the views receive, as well as the references they do higher up.

I need a good, short manual that explains the language from scratch. It should be based on the editor, but there I'm torn because I'm also thinking about cell in pure text. The key is to see the equivalence/mapping between the editor and text.

Rough notes from the run:

- cell.respond: algorithm design. How would it work with dependencies?
- when we have a certain prefix on an @ and we checked its value, we can skip forward to the next path without that entire prefix: any calls to the right of that are already taken into account. also that is equivalent of the firstPath check we currently have, only faster.
- on every single put, if we have no dependencies, every single call (@) gets checked.
- calls on the right of a path are dependencies on things on the same path to its left. but not the only ones.
- each call has a prefix, this can identify it. then, our graph of dependencies can be called `graph` and be a list where on the left side you have the prefix of each call, and on the right side a list of one or more paths on which that call directly depends. it cannot be a hash because you can have things that are terminals and nonterminals at the same time. hey @ foo @ bar would have entries for key and key @ foo, and I cannot have a list at graph key and also a hash. so it should be a sorted list, the graph, for quick retrieval.
- commas are also calls, so they should also be in the graph.
- for dependencies, there are two things: determining the dependencies, and responding to their changes.
- is there a "combination of like subparses" mechanism here, a la earley?
- there could be changes that update a value but not the grpah of dependencies.
- instead of the prefix, I can speak of the path to a call. I can stop calling a path just the whole thing, or the whole thing minus the last step. I could instead talk about "complete paths".
- if you don't have a dependency graph, you have to go back to the top when you change something.
- if a comma doesn't have a matching @, we can put an error on top. no need to break it, or report a syntax error. this is much better than html being tolerant with errors: you just show where the error is without losing the functioning of the entire thing. not having syntax throw off the entire system is key.
- the single hook is key to simplify the understanding and the implementation of walking up. a call depends on whatever its hook depends. where it lands, then it's a matter of how you split between destination and message, but the dependency is still clearly there.
- When the message has a call too, then the call has two dependencies, the destination and the message. It has to be a list. Also, if a call depends on a list or a hash that has multiple calls inside (directly, not in a sequence, because the sequence puts everything in the =), then you also have multiple direct dependencies there.
- it's interesting that a sequence has a "masking" property that multiple dependencies are stuffed inside but only expressed through the sequence's result. Those are one step removed. This made me think of something obscure: if your definition depends on something that changes, do you re-run the sequence? The answer is yes, because the stripper will give you a different result for the sequence. So it also changes when you change the definition, not just the message you send. This makes sequences very, very dynamic, to a point that I haven't experienced yet in js.
- Interesting dualism: in the same way you have single and multiple data types, you also have literals and calls. literals are things that refer to themselves, calls that are stable because they point to themselves, whereas calls reference something else. calls are also represented as data in that the @ is also a literal, also its location.
- it's important to explain that cell is not just (or even mainly) its implementation, but a conceptual model that also works on paper or plain text. cell can always be represented with text. The editor gives you three things: jump, fold and run. Running is that the thing is actually live and executing, a machine. Jump allows you to move, both in numeric offsets (list-like) and search to value (hash-like). Fold/unfold allows you to show/hide parts of the dataspace that you're zooming in. These three things are movement verbs: jump, fold and run. This is not a coincidence.
- A good search with fold could be better that a custom search. Something you can quickly do by typing. If you want to store it, then you just write it in a part of the dataspace and see it there.

### 2025-11-28

The main calls, ordered by length.

```
     @         @ do        @ if         @ put       @ loop      @ catch
|---------| |--------| |-----------| |----------| |---------| |----------|
 reference   sequence   conditional    storage     iteration     error
    (0)         (2)         (2)          (3)          (4)         (5)
```

Store the sequence in `: do` instead of `: seq`.

Single "hook" on get and put. Simplifies the walking up. Then you need to walk left/right to separate destination from message, starting at n-1 and then walking it left.

"Walk" a step, "run" a program.

> "Music (and generally audio) can make or break a product. It's basically the moodsetter. To some extent: visuals = intellectual and audio = emotional." -- [Paul Van Der Valk](https://amp.dascene.net/detail.php?view=5673&detail=interview)

Crazy idea: put retro music on cell, as a moodsetter, like old games.

### 2025-11-26

OK, cracking towards the demo.

The impasse from a few (twenty?) episodes ago?
- I want to rewrite cell.call to basically run a program in the call, rather than call @ put separately.
- Calling @ put inside a sequence generated issues.
- I decided not to throw away the test suite to make sure that @ put still works, so I decided to rewrite the test suite in a better format.

Where are we now?
- The test suite is more than half rewritten, but not fully.
- I could just finish rewriting it, but I'm probably going to change the behavior of @ put, and of @ seq.
- cell.call is not rewritten yet and we do not support yet putting @ put inside a sequence.

So where do we start?

- @ put in isolation doesn't make sense. We need to implement it with the purpose of making it useful inside a sequence and a loop.
- Therefore, let's implement sequence and loop first, properly. With put supporting it.
- Tests; as long as we can test sequence and loop through cell.call (which we can), we're OK for now. Once the definition of @ put (and @) settles, we can rewrite the tests.

Proposed sequence:
- Implement no-loop version of fizzbuzz: write it, make it run, make it pass the tests. Modify @ put if necessary.
- Implement loop version of fizzbuzz.
- Implement html validation & html generation.
- Unified entrypoint with cell.call.
- With this solid base, rewrite all existing tests in the new format.
- Proceed from the upload down.

```
fizzbuzz @ do n - @ put p : output
                        v ""
                - @ if cond @ % - @ n
                                - 3
                       else @ push p output
                                   v fizz
                - @ if cond @ % - @ n
                                - 5
                       else @ push p output
                                   v buzz
                - @ output
```

```
fizzbuzz @ do n - @ put p : output
                        v ""
                - @ loop data fizz 3
                              buzz 5
                         do path - @ if cond @ % - @ n
                                                 - @ path 2
                                        else @ push p output
                                                    v @ path 1
                - @ output
```

Call it @ seq or @ do? Why do?
- Shorter.
- Easy to pronounce.
- Fits between "cond" and "else" on the if. In a loop it also goes well.

Why seq?
- It follows from "sequence".

Let's just go with do.

I need to get a grip on cell.respond, fast.
- If I had a dependency graph, I would only call cell.respond on the changed elements, which means: on the new elements themselves, as well as their dependents (things on which the new elements depend are not changed).
- But if I don't have a dependency graph, at least I can run it through all the paths. It should not run so many times, though.

For the entire test suite, it's somewhat reasonable to have 1k puts, 1.5k responds that have a reference to be resolved and 5k gets (although I think it could be lower). But 122k at the top of respond is just crazy. Do we have so much stuff that should not be expanded?
{ put: 973, 'respond top': 122511, get: 5082, 'respond call': 1550 }

On average, when cell.put iterates the dataspace and calls cell.respond on each path, there's on average 127 paths on the dataspace, which explains the 122k figure. How so many? I'm constantly wiping the dataspace. Maybe it is the dialog?

  'no dialog': 184565,
  'put -> respond times': 188985,
So only 4k calls to respond if we filter out the dialogs. But this is still very slow.

We spend most of our time in put, perhaps 2/3 of the test runtime.

  'put initialization': 40.0000000143296,
  'put after getting dataspace': 169.00000001323312,
  'put after walking': 778.0000000086417,
  'put after sorting': 1641.0000000068717,
  'put after validating': 2578.0000000056716,
  'put after putting to disk': 2692.000000005302

    'put initialization': 24.000000014490325,
  'put after getting dataspace': 106.00000001373114,
  'put after walking': 591.0000000094716,
  'put after sorting': 1208.0000000077716,
  'put after validating': 1871.0000000068517,
  'put after putting to disk': 1931.0000000065518

Walking is about 20%, sorting is a whopping 33-40%, validating is 20%.

So, put seems to be taking most of the time. We should call it way less than 1k times. We should also definitely improve the performance of the sorting function.

OK, mystery solved with performance: we need dependencies. But at least we now know where we're slow. Let's tackle the entire logic for cell.respond for fizzbuzz and come up with any possible improvements to the clarity of the whole thing.

### 2025-11-25

Any abstraction layer should be described succintly in what it provides (and therefore, what you'd have to either miss or build yourself if you didn't use it). If this description is not possible, then that's a show-stopping problem.

Coming back to yesterday's observation about parsing vs validating, what I'd really like to see is a set of assertions that are **expressible as data**, lists of them, actually. They could even be nested lists so that you could reuse parts of them. This barrage of assertions reduces the possibility space for any message that passes the assertion. And the validation is really a call with a message composed of 1) the rules; 2) the thing you're validating. By having this in a dynamic way, instead of (as in a static type system) a static type system with a different syntax from the rest of the language and a SingleLongCamelCasedName, I believe we can go much further.

Compiling should end, for most practical purposes. If the sequence of calls can be made not to waste anything, I bet that the principles of the Toyota Production System will show us that any batch-and-queue process (such as compiling) actually makes things more complex. I am particularly interested in places where this is obviously not true, and in particular **how**. They might yield very useful insights, or perhaps a glowing counterargument.

Thinking about the Von Neumann architecture, where code and data coexist, this is an unified dataspace. Something I heard on this talk by [John Ousterhout](https://www.youtube.com/watch?v=tqhVJouaE8k), however, suggests that approaches with separated data and code had the advantage of treating data in a more flexible way, whereas the typical way to do it with a VN architecture is to have the data strictly tailored to what one particular program expects. But, in cell, we can have everything in one dataspace, and have the data to be represented in a sufficient universal/standalone manner (four types) to be of use by different programs.

Also following John Ousterhout on TK design, in the UI, we'll have one dataspace per application (the whole thing), not one per widget.

Do I call them constraints, rules or validations? I would call them rules. Short and powerful. No, because I have no verb "to rule" in the sense of validating. Whereas with validation, you can have a validation (noun) and validate (verb). But we can say "check" as verb. The check function/call takes a number of rules. Or we can just call them checks? Let's just do check (verb) rules (noun).

Rethinking the demo:
- Start with data: CSV with list of sales; or CSV with list of books (choose your own adventure: money vs knowledge).
- Upload the data through the editor.
- Data is placed in the dataspace.
- Publishing path:
   - Make a dashboard:
      - Total entries
      - Amount sold/amount of pages (sum)
      - Top customers/top authors (sum with grouping)
   - Create API endpoints:
      - Get more data in with a POST (with rules)
      - Download all data with a GET
- Thinking path:
   - Use rules to find & clean up invalid data (repeated entries, invalid values)
   - Bring data from external APIs to get complementary data
   - Interact with the LLM to set interesting aggregations also within the editor

What's interesting about the above?
- You never leave your browser.
- You don't even have to sign up.
- You can see the dashboard as an overlay on the editor, so you don't leave your tab either (but you do show the standalone dashboard by clicking on a link that opens a new tab).
- You can see the results of each call on top of it.
- Besides the editor, you also have your UI and API there in your cell.
- What you do not need: a backend, a frontend or a database, whether it is remote or local.
- When you close your browser and you open it again, the data is still there.

What do I need to make this happen?
- Upload
   - Single entrypoint at cell.call
   - Actual upload that stores the file in the dataspace
- For everything else
   - Language
      - Sequence + reworked cell.get/put
      - Loop
      - Useful data handling
         - Count
         - Sum
         - Aggregate
         - Duplicates
   - @ check
   - @ api
      - Register api calls
      - Serve api calls
      - Send api calls through the service
   - @ view
      - Serving the view
      - HTML generation
      - Auto-wiring of api calls to the messages that the views receive, as well as the references they do higher up.

UI design:
- Each widget is its own space? Or all the widgets you define on the cell have a single view? No, it can't be that because you might want to have different views based on the same cell. Although the simplification, from a functional perspective, is tantalizing. Why do I want to have a single one? Because the user would get confused less. No, let's go with multiple views. We have a call @ view that gives you a view.
- Views can and should be nestable. If you define a view somewhere else on the cell, you should be able to refefence it and it will get inserted.
- OK, state management: the view will load. The HTML is fine. But what about the data that goes in the view call? The direct wiring (the state of the cell is the state of the UI) cannot work because 1) privacy/security; 2) multiple clients with diverging state at the same time.
- But how do we avoid having to make the same API endpoints for querying things? We can make the views register automatically (but visibly) api calls that are getters to what the view needs.
- This begets the question: are all views in the same place? And are all API endpoints in the same place? No, they can't be, because you want them to be where they should be. But then how do you keep track of what's there, because there has to be a unified directory of view and API resources on the cell. But the calls to @ view or @ api (we could call it @ api instead of @ http) can register something in a special part of the dataspace, which is `api` and `view` as a side-effect that can allow or block the setting of that view or api. But then you have full wiring happening naturally as part of your view creation. This could completely work.
- We could even bundle all that a view needs into a single API. That'd give you custom wiring.
- The call is @ view.

I don't think that checks should be enforced globally. Or do we? If you don't enforce them globally (well, on the cell as a whole), you need that all changes happen through a certain tunnel, like an API call. But then, internal data handling is done "on live wire" and if you want to do things internally, you can be breaking your own consistency. Hey, this is probably why databases have the schema so baked in. You want to be able to have freedom but not to break your own rules, especially because of typos or temporary carelessness. So yes, rules have to be enforced globally. So we have three global resources that can be called/set from anywhere:

- api
- rule
- view

(also we have access, cron and file, which we'll deal with later. Also dialog). So seven, six of which you set yourself.

Why these rules make sense? They replace the type system. You can also have them inside calls, for specific data. But the outermost ones work for every put: put will only go through if the rule is respected. This would be like if you had a put that you write yourself with a set of rules. The result is the same.

When setting rules that are not passed by what's already there, you see the errors on top of the rule itself (which is a call!). That's the post-hoc cleanup. And new bad data coming in won't be let through, and you'll see the error on the top of the put, and if you are bringing that bad data from an api call, the error from the put (if it's a global rule) goes as the response. It'd be cool to see that on the UI.

Claude: "Rules as ersatz type system - This is more flexible than traditional types because you can express domain constraints ("price must be positive", "customer email must be unique") that type systems can't naturally express. And unlike TypeScript (compile-time only), these are enforced at runtime where data actually lives."

### 2025-11-24

Interesting article on [Haskell](https://mrcjkb.dev/posts/2025-10-08-haskell-for-renewables.html). My takeaway:

> "In Haskell, types are a rigorous framework for representing real-world constraints directly in code."

The article references another article called [Parse, Don't Validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)

> Consider: what is a parser? Really, a parser is just a function that consumes less-structured input and produces more-structured output. By its very nature, a parser is a partial function.

This, to me, is exactly what validation means. You take a message (input) that can have many possibilities, and you reduce the number of possibilities. It is still large, but you have more information (in the Shannon sense, that information is what reduces the amount of possibilities). I'm not considering the possibilities to be infinite because the maximum number of characters for an input should be finite. Back to the main point: whether you call this parsing, or validating, you're referring to the same thing. I don't see any reason why this wouldn't be considered a validation. Validation can (and should) be done at runtime and as soon as the data comes in through the call boundary.

However, it is a great point that once you added information/restricted the set of possibilities about the message, have that available in the system later. cell should be able to keep track of those assertions.

Recursion requires a conditional, otherwise you'd keep on going forever. Unless you're building something that keeps on going forever, like a traditional Turing Machine. You could see U as a recursive function.

### 2025-11-22

If asked for the why of cell and I had to narrow it down to three points (as I was yesterday), I would say:

- Low-noise way to represent data and code (fourdata + fourtext, pillar 1).
- See the result on top of the query (call and response, pillar 3).
- The editor accessible through the browser and the service being automatically provided. This is actually stronger than the LLM component.

### 2025-11-19

Look at the other side: the common elements we use for most logic, for most transformation.

Logic is transformation!

The message going from call to call goes as is. It is not transformed, just transmitted. This is a strong assumption, or perhaps even an axiom. It makes sense that it would be the same on either side. This ties back (or is the same thing) as Shannon's definition of the fundamental problem of communication as reproduction of a message from one place to another.

Storage could be reduced to communication and transformation in this way: you communicate what goes in and you get back an acknowledgment (which is its own form of transformation). Then, with another message, you can get back what you sent originally (another transformation). But this pattern is so fundamental that it makes sense to consider storage as a leg of the tripod. But storage can be autopoietic, and actually is so. Those bits we send to it are not just stored in one place inside of it; the physical bits are usually in several places and might not even be contiguous. And these layers of internal representations can still be understood as calls.

What makes the TODIS paradigm autopoietic is that it lets each call have its own poiesis/construction. The message is the beginning, but what happens between the call and the response is a construction, also made of calls, in the call's own space.

If the call is breathing in and the response breathing out, there's a lot that happens in between; and it's not just the same air that comes out. It bears a relationship to the one that came in, but other things happen in the middle. And those other things also have to do with other patterns inside the space of the call.

What's considered external on the dataspace of the cell is what has no expansion, calls where you cannot see the poiesis (expansion as poiesis). This is the case for native calls (`+ 2 2`) or HTTP calls to an external API. But this is not always an obvious boundary. You could have, through access restrictions, only the ability to make a call but not see its expansion. So the visibility of the expansion is also relative; relative to what? To a part of the dataspace which can make those calls.

There's no real "outside" in this paradigm because: 1) it lays claim on being able to represent any communication/transformation sequence; 2) there's no entity beyond call, so there's deep symmetry/self-similarity. It is just relative to where you are and what the calls that you can access from a certain spot let you do, how they respond to you.

Streams are a problem for the call/response paradigm, because call and response requires finiteness. An open communication channel would have to be represented with a sequence of calls and responses that belong together. This is only for streams where you want to do something with the stream before it finishes flowing.

However: a stream can be a location to which you're constantly appending data. Every incoming chunk that comes is really a call, not a response. The response is the adding of the chunk to the location. Consuming the stream is also making calls to it to read, and probably also to chop off what's been read already. The setting up of the stream is done by one call which then adds the call that can be called by the calls coming from outside to push the chunks.

Terminology:
- A text is a single path with a single step where the value of that single step is a text.
- A number is a single path with a single step where the value of that single step is a number.
- A list is a sequence of paths where the value of the first step of each of the paths is a number.
- A hash is a sequence of paths where the value of the first step of each of the paths is a text.
- To shorten saying "has a value", we can just say is. So, the M step of the N path IS X.
- When we have a list or hash, we say it has N elements when its paths have N distinct values on the first step of each of its paths.
- A prefix is the left part of a path. It can have a length of 0 up to the length of the path minus 1.
- The value of a step of a path can only be one text or one number.
- The value of a prefix is the sequence of all paths that have that prefix, but with the prefix chopped off each of them.
- Two prefixes cannot have different values.
- The same prefix cannot have two paths whose M element are of different types, UNLESS the M element is the last element of each of those paths. This prevents inconsistent types. Every prefix has a value of one type only.

Let's reconsider pipes, again. Why do we need them? Yesterday's use case:

- We start with a hash with only one element.
- We want to get the value of this element. For that, we need to do `@ "<original hash>" "<value of the first step of the original hash>"
- Getting the value of the first step of the original hash can be obtained by either:
   - Making the hash into a list of paths, then getting the first step of the first path. `@ list @ input 1 1`.
   - Making a `@ keys` call that gives back a list of first steps of the paths of the hash. From there, we'd do `1`: `@ keys @ input 1`.
- Both have the same problem: we want to do `(@ list @ input) 1 1`, or `(@ keys @ input) 1`. But I have ruled out parenthesis. So what can we do?
- The solution I was thinking of was to write `@ list @ input , 1 1` or `@ keys @ input , 1`.
- How would it really work? We'd first resolve @ input, then @ list (or @ input and then @ keys), THEN do , 1.
- But how far left can this thing go? We could say that it only works for the current path, and it doesn't go "up". So it's really about doing things on the same line, which it really is, because this whole thing is to avoid clunky variable assignments.
- In this case, it would work. But what about:

```
                                    - @ loop data @ input @ list @ input , 1 1
```

In this case, I want `@ loop data @ input ((@ list @ input) 1 1)`. I don't need parenthesis around the outermost @ input because that goes right to left and we're fine.

With commas, we could do it like this?


```
                                    - @ loop data @ input , @ list @ input , 1 1
```

So commas would be resolved right to left. You start at the rightmost @ and resolve until you hit either the beginning or another comma to your left. Then, if there's a comma to your right, you do the reference of what's after that comma and put the value on top of it. Then, you keep on doing the same for more commas to the left.

Why not parenthesis? Because you cannot see the result on top! Do you put it on ( or on )? You could still put it on (. But I think this method of the commas is perhaps more elegant. It has that unary, forthy quality that comes from natural language.

Parenthesis would still work, but they are clunky because they are two. If we were to use them, we'd definitely put the result on top of (, not ). Still, I like the comma better.

Am I getting away with this?

The comma is apparently like Haskell's `$`.

### 2025-11-18

OK, HTML generation.

```
html entiyify @ seq text - @ loop data & &amp;
                                       < &lt;
                                       > &gt;
                                       "/"" &quot;
                                       ' &#39;
                                       ` &#96;
                                  do path - @ put p text
                                                  v @ replace from @ path 1
                                                              to @ path 2
                                                              v @ text
                         - @ text
     generate @ seq input - @ put p : output
                          - @ put p : t
                                  v @ type input
                          - @ if cond @ eq number t
                                 do @ push p output
                                           v @ input
                          - @ if cond @ eq text t
                                 do @ push p output
                                           v @ html entityify @ input
                          - @ if cond @ eq list t
                                 do @ loop data input
                                           do data @ push p output
                                                          v @ html generate @ data v
                          - @ if cond @ eq hash t
                                 do - @ push p output
                                             v - <
                                               - @ list @ input , 1
                                               - >
                                    - @ loop data @ input @ list @ input , 1
```

Why would any of this make sense? What will be different as soon as it works?

- The data is right there in your code.
- You have constant feedback on your calls, and you can unfold.
- The editor works in steps, not characters, so you are jumping around.

The price of this is not even the implementation (well, a little bit). But actually figuring out the meat and potatoes of the mechanisms that you use in sequences. Variable getting/setting, loops, match, slice, push. The works.

Let's do it.

What is enough to design so that we can then implement?
- HTML validation/generation.
- Spine of a web server.

Loops have cond / do / else. Should loops have data / do instead of data / seq? We can keep `seq` just for definition of sequences. The only reason I don't put seq for conditionals is that the s comes after e, so else would be there before do. Same goes for then. Nah, let's go with do. It's what we would say in natural language.

Replace shouold replace all instances, not the first one. I don't remember using the single-char replacement in replace ever.

We could even have the default that you respond with your message? Hmmm, no. Let's make it more explicit, at least for now. Yes, it has to be self-similar and you need to see where this response comes from.

Open problems with this scope:
- Cannot access an x above if you also define an x below. The x below blocks the x above (this also happens in js).
- Unintentional variable capture if you have a library in the middle of your code, between the high and the low, and they use the same variable names that you are using to access something "up". JS doesn't have this problem because of dynamic scope.

What's killing me with iteration sometimes is that I need to pass all the distinct prefixes in a grouped way. If we have, let's say, just three items, it would be:

```
1 a
2 b
3 9
```

And there, I need to get the second element of each. But what if we have this?

```
1 div cl a
      id b
2 b
3 9
```

It would make sense to iterate not on paths but on list elements. This would actually make more sense, at least some of the time. If I do this, then, if I'm iterating a list, I would only go n times, one per element of the list, instead of one per path. Then, k would be @ path 1, and v would be @ path 2 onwards. This could work. It also works for the simple case of simple elements on a list or a hash. This is totally car/cdr.

But wait! If we do this, then you can have MULTIPLE @ path 2s. In the example above, you don't, actually, you have one which then forks. But you could have this:

```
1 cl a
  id b
2 b
3 9
```

So, on the first iteration, what is @ path 2? Well, it could be a list. It could be a list where the first element is cl and the second one is id. Same goes for path 3. And you cannot confuse this with anything else, or rather, this is not ambiguous, because you know you're working with paths.

I'm about to retreat to iterating not on paths, but on k and v.

If the complex structure is a list, do you change anything by having it as paths? Yes, how you group them:

```
1 1 a
  2 b
  3 c
```

v is

```
- a
- b
- c
```

but path 2 would be

```
- 1
- 2
- 3
```

And path 3 would be

```
- a
- b
- c
```

Making path 2 pretty unnecessary, unless you have items that skip (sparse lists).

This is key. How we take away the grain of complex data is what makes iteration, and later, querying. Querying is, essentially, fast iteration + a DSL/shorthand.

Rather than k/v, we could have data, and you access it by data p (the key/prefix) and data v (the value, everything else). The debate between the new paradigm of paths that is conceptually unifying vs the traditional practicality of working with values is moot. What matters is to find the few use cases that can stand on themselves and see which way they will tilt the scales. This is the only thing that can and should determine the default for a loop. And in the cases where the secondary representation of the message passed to the loop call is useful, this can help us flesh it out in a better way.

The problem with not having parenthesis is that doing something like Object.keys (data) [0] is making me have to store a variable somewhere, so that I can then access it! This is not good.

Let's reconsider anew an unary opearator that splits things, for example, a comma.

```
@ list data , 1
```

The comma would make the call ignore the 1 for finding data, and would even call @ list with it (or nothing, if there's no data). Then, the comma would disappear. It's somehow balanced with the amount of calls. Then, after @ list data is resolved, we get its 1.

How is this expressed in the @? We would like to see the intermediate results: @ list data gives you a bunch of stuff, then you get 1? Or does comma operate in one go, and you just get that element? I'm leaning heavily towards the latter.

Maybe this could work. It's a sort of precedence indicator that builds some tension on the left until it gets resolved. It can just map to a single call, a single @.

Interesting chat with Claude. The comma could be almost considered a pipe.

OK, the problem with the comma is that we don't see the intermediate values, there's just too much going on. And, as with unix pipes, you can only see what comes out.

So what if a , is like an @, in that we see something on top of it?

```
@ list data , 1
```

expands to:

```
           - div
- - div
  - cl
  - a
- - div
  - id
  - b
@ list data , 1 1
```

Claude: "And here's the kicker: the visual feedback naturally limits abuse. If you do:
`@ list data , 1 , prop , 0 , name`
You'll see 5 results stacked up, and it'll be visually obvious you're doing something gnarly. The editor essentially says "look at this mess you're making" without forbidding it."

This cannot be just for reference, because a reference is a call. Self-similarity all the way, it has to be the same for everything. Because it is all the same, really, right? It's just calls. I'm of course with my hands on my head when writing this.

claude: "Your insight: Threading + mandatory visibility = debuggability without cognitive overhead."

What's new here, in the end?
- You can see any data with the same representation.
- You can make any call from the same space.
- All transformation is done in one way, through call & response.
- Every call has its result on top so you can see it.

I'm realizing that forth has pipes by default: you put data, then you call a word and the result is there and then you either add more data or put another word that takes the previous result. It's piped by default. You write it in the order in which it has to be executed. Words that are data simply don't execute anything, they just build up data/tension in the stack. It's beautiful.

claude: "In JS/C, intermediate state is hidden but addressable"
good point. Forth and APL don't have this, at least not at their best. They have great flow, but no way to get ahold of what's in the middle. You really have to run it in your head.

APL also has symbols that are not easily readable, which complicates it further.

Why not lisp, then? Is it the lack of in-built hashes?


```
                                    - @ loop data @ input @ list @ input , 1
```

I need to sleep on it. How to get the value that's behind the first step (key) of a hash?

### 2025-11-17

Again.

Two problems:
- Access paths: the second element of each path (attribute keys), but without repeating it to avoid extra validations? Also the third element of each path (attribute values).
- Regexes.

One way to do it would be to vanilla iterate the hash, where the key is only "seen" once per group, so no common prefixes are iterated twice.

But let's think about efficiency in context. The internal representation of the data is already as paths. If the operation is cheap, there's no point in skipping it? Let's go with something, now. So, we're iterating paths. We have two options: we either do the cheap operation, or we have an "unique" filter to apply the operation on things. This actually makes sense from a performance perspective, and it also clarifies the code, because it reflects that a certain step could have multiple values?

No, not really! In this case, each key has to have one text value! That's it! The only exception is `_`, which requires a recursive call. Then we can just iterate the hash.

Interesting idea I'm immediately discarding: an unary separator, like : or (better) , to distinguish what's the path to the sequence and what is the message. Or to split ambiguous elements in single line/path calls.

Problem for tomorrow: we need to pass the whole thing that belongs to `_`, not just a path!

```
html tags all @ list "!DOCTYPE HTML" LITERAL a abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption cite code col colgroup command datalist dd del details dfn div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link map mark menu meta meter nav noscript object ol optgroup option output p param pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr
          void @ list "!DOCTYPE HTML" area base br col command embed hr img input keygen link meta param source track wbr
     validate @ seq input - @ put p : t
                                  v @ type @ input
                          - @ if cond @ has l - number
                                              - text
                                            v @ t
                                 do 1
                          - @ if cond @ eq list @ t
                                 do @ loop data input
                                           seq @ html validate
                          - @ if cond @ eq hash @ t
                                 do - @ if cond @ has l @ html tags all
                                                      v @ list @ input 1 1
                                           else stop @ text - @ list @ input 1 1
                                                            - "is not a valid tag"
                                    - @ loop data input
                                             seq path - @ if cond @ eq _ @ path 1
                                                             do stop @ html validate @ input _
                                                      - @ if cond @ > @ len 2 @ path
                                                          do stop @ text - Attribute
                                                                         - @ path 1
                                                                         - "has a value that is not text:"
                                                                         - @ slice range 2
                                                                                   v @ path
                                                      - @ if cond @ < @ len 2 @ path
                                                          do stop @ text - Attribute
                                                                         - @ path 1
                                                                         - "has no value"
                                                      -  @ if cond @ not @ match regexp - (begin)
                                                                                        - or - a-z
                                                                                             - _
                                                                                             - :
                                                                                        - range 0
                                                                                          or - a-z
                                                                                             - _
                                                                                             - :
                                                                                             - 0-9
                                                                                             - .
                                                                                             - -
                                                                                             - \u0080-\uffff
                                                                                  v @ path 1
                                                              else stop @ text - Attribute
                                                                               - @ path 1
                                                                               - "start with an ASCII letter, underscore or colon, and be followed by letters, digits, underscores, colons, periods, dashes, extended ASCII characters, or any non-ASCII characters."


input1 div id z
           cl - a
              - b
              - "c d"
           _ p cl - u
               onclick @ s @ shine
               _ Hello!

{div: {id: 'z', cl: ['a', 'b', 'c'], _: {p: {cl: 'u', onclick: '@ s @ shine', _: 'Hello!'}}}}

['div', {id: 'z', class: ['a', 'b', 'c']}, ['p', {cl: 'u', onclick: '@ s @ shine'}, 'Hello!']]
```

I do need the underscore to go at the bottom, sorting wise...

### 2025-11-14

Having a single diff as response of put is a good reason to just pass one path to put. If you call it with multiple pahs, then you'd have to respond with multiple diffs. But that wouldn't be too bad either.

When you call a loop, its `seq` part gets expanded into a list. This is good. I just put the colon on each of these steps, so that the value of `path` is taken from there.

Now, for the hard question: is this expansion better than console.log? I think so, but only if you don't show me the whole thing and rather let me either unfold (expand) or search. I could go and look for what happens in the second iteration of the loop, or I could search for "buzz" and see where it appears in the expansion.

So yes.

A lot of repetition happens only with those results that get propagated (responded, really) upwards. But you don't necessarily see them unless you unfold them.

Is this a good language for thinking? That's an open question. If this is not a good language for thinking, I missed the mark.

The path ahead, immediately: build things with cell (can be just the design, we can implement later) and be highly demanding of it to be expressive, direct and comfortable for tackling anything that I would think of doing.

Case in point: HTML generation.

Let's tackle that one again.

```
html tags all @ list "!DOCTYPE HTML" LITERAL a abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption cite code col colgroup command datalist dd del details dfn div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link map mark menu meta meter nav noscript object ol optgroup option output p param pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr
          void "!DOCTYPE HTML" area base br col command embed hr img input keygen link meta param source track wbr
     validate @ seq input - @ put p : t
                                  v @ type @ input
                          - @ if cond @ has l - number
                                              - text
                                            v @ t
                                 do 1
                          - @ if cond @ eq list @ t
                                 do @ loop data input
                                           seq @ html validate
                          - @ if cond @ eq hash @ t
                                 do - @ if cond @ not @ has l @ html tags all
                                                            v @ list @ input 1 1
                                           do stop @ text - @ list @ input 1 1
                                                          - "is not a valid tag"






input1 div id z
           cl - a
              - b
              - "c d"
           _ p cl - u
               onclick @ s @ shine
               _ Hello!
```

A `do` inside `if` should be able to take a sequence. I'm bothered by the do/else in contrast to the `seq` when we define and the `seq` when we're inside a loop. This could be unified, perhaps.

These calls that take paths and make them into lists, or the other way around, or peel them, these will be the main mechanisms of (data) transformation in cell. That's what's shaping up now.

A path is also a list. Why not see it like this? When you get a value in a loop, you get either zero or more paths. Let's assume it's one or more.

If you get one path, and you know it, you just treat the path as a list. You can slice it and then send it to another call.

If you get multiple ones, you'd have to do double accessing to get one value.

So we need slice left-right over one or many, and also see how many we let through. But we can just pass paths around. The question is: can we deal with paths as values without having to convert back and forth? Because there's this "listy" representation and then the "data is there" representation. The rift is there more clearly for a hash. But maybe these are just my old ways of thinking, in js.

Come back to the ground. If you have a hash and then you do input 1, you'll get nothing, because 1 is a number, and hashes have texts as keys. So we do need to convert this data to a path. And by path, I mean to a list of paths.

Maybe, when you convert a hash to a list, what you do is you convert it to a list of paths and you work with the data in that format instead. It's not an "internal representation", it's just another, very useful way to loo at the data. That whas the whole thing. And by having a normal type (list) you don't have to add more operations just for that. It's all data, and you find the natural representation for it. Much better than going with timid accessors on objects. And there are not many cases! A number or a text, when converted to a list, they have just one element, because they are one path. The only multiple value (complex value) that is not a list is a hash. So this is the only place where you need to convert! That's it!

And you can take the hash, make it into a list, slice all the lists inside the list (the paths) removing the (say) first element, and then you changed the data and then you make it back into a hash! So you're just going back and forth from list to hash and back to list. It's all data. It's beautiful.

In the list representation, you reference positionally. In hashes, you reference by value. That's basically it. When you need to work positionally on the list (say, remove a prefix) you make it into a list; when you need to access by value, instead of iterating with an @ eq, you can make it into a hash and just bring that.

I'm interested in the situations where a list can be converted to a hash. This would make sense for sets? Yes, for sets, and the left steps would be the values and the right ones would be (perhaps) the positions. I am not sure where I would use this yet. What I would use is to take a list of paths that represent a hash and make it back into a hash. That, for certain we could use. So perhaps @ hash could take exactly that: a list of paths that actually represent a hash.

@ text can take a list and we can make it into a single text that separates them with single spaces. There are natural defaults for type conversion between values, there's a few practical, everyday usages for them. Much better than tricky and meaningless coercions.

### 2025-11-13

Let's allow literal dashes: if a dash in the context of a hash, we consider it to be a literal hash.

No, never mind. This requires sorting and comparing prefixes. I only want to allow it because it would be possible to express it without harming the main case, but now, implementation wise, it complicates things. So I will let it be like this, and a lone dash, at least for now, will always represent an unspecified index/step of a list.

The two big problems I'm facing now:

- The sequence problem.
- The loop problem.

The sequence problem is that I still don't know how sequences should be written and how their expansions should look. This is core.

The loop problem is exactly the same thing, but for loops.

References, conditionals look good. I also think catch will be straightforward. The difficulty lies with these two workhorses, sequence and iteration.

In the graph of a few days above, what belongs to the engine part and what to the language, if they're both in the center and only divided by a dotted line? In the engine goes everything that must run in the DB, for performance and consistency reasons; if it can go outside, it's the language.

Let's tackle again the problem of how a sequence really looks.

```
fizzbuzz @ seq n - @ put : output ""
                 - @ if cond @ % - @ n
                                 - 3
                        else @ push p output
                                    v fizz
                 - @ if cond @ % - @ n
                                 - 5
                        else @ push p output
                                    v buzz
                 - @ output
```

Or with a loop:

```
fizzbuzz @ seq n - @ put : output ""
                 - @ loop data fizz 3
                               buzz 5
                          seq path - @ if cond @ % - @ n
                                                   - @ path 2
                                          else @ push p output
                                                      v @ path 1
                 - @ output
```

In ES5 JS, I'd do:

```
var fizzbuzz = function (n) {
    var output = '';
    [['fizz', 3], ['buzz', 5]].forEach (function (v) {
        if (! (n % v [1])) output += v [0];
    });
    return output;
}
```

8 lines vs 7. Very close. Without indents, 142 chars vs 150. This has the same compression! cell takes up more real estate on the screen because it goes right more. There's more room (space) between characters.

An iterating function, instead of receiving k and v (where k is just the key and v is a value, probably nested). Wait, I just realized that k is car, and v is cdr. So we just pass the entire path, but only one path at a time. This won't always be useful. In this case (fizzbuzz iteration), it is.

Finding the first step when walking up on a get or put reminds me of falling and grabbing a ledge in Prince of Persia.

Let's tackle the expansions now. First, the non-loop version.

```
= fizzbuzz
: n 15
  output fizzbuzz
  s - = to ""
      @ put : output ""
              = 0
                    = 15
    - if cond @ % - @ n
                  - 3
              = from ""
                to fizz
         else @ push p output
                     v fizz
              = 0
                    = 15
    - if cond @ % - @ n
                  - 3
              = from fizz
                to fizzbuzz
         else @ push p output
                     v fizz
      = fizzbuzz
    - @ output
@ fizzbuzz 15
```

Now, let's do the loop version.

```
= fizzbuzz
: n 15
  output fizzbuzz
  s - = to ""
      @ put : output ""
              = 0
    - = - from ""
          to fizz
        - from fizz
          to fizzbuzz
      @ loop data fizz 3
                  buzz 5
             seq - = from ""
                     to fizz
                   : path fizz 3
                             = from ""
                               to fizz
                                   = 15
                   @ if cond @ % - @ n
                                   = 3
                                 - @ path 2
                             = from ""
                               to fizz
                        else @ push p output
                                      = fizz
                                    v @ path 1
                   : path fizz 3
                 - = from fizz
                     to fizzbuzz
                   : path buzz 5
                             = from fizz
                               to fizzbuzz
                                   = 15
                   @ if cond @ % - @ n
                                   = 5
                                 - @ path 2
                             = from fizz
                               to fizzbuzz
                        else @ push p output
                                      = buzz
                                    v @ path 1
                   : path buzz 5
      = fizzbuzz
    - @ output
@ fizzbuzz 15
```

The colon cannot be batched! You have to expand everything where it is! There's no point (I think) in putting the expansion of the loop in its :, just go in its definition and expand it! I'm not sure where the limit should be.

Interesting one: the if responds with whatever the do or else responded! It's one of the two. They are really two functions/sequences.

Words I need to substitute in my talking/writing:
- Function -> sequence
- Variable -> path
- Return -> respond

I think this is it: an iteration is a sequence, the same sequence over an over, but with different arguments. Express it as a sequence. After all, this is what it is.

Having the definition of the loop in the expansion feels a bit unnecessary. But maybe it works. After all, you do have it in the sequence, when you call it? Actually, no, you don't have the definition again.

We could do the expansion at seq path! Rather than have the definition again, just put the expansion there in seq.

Interesting difference: when iterating, we usually do NOT want to share the prefix, so we can set variables with the same names but different values. We're "inside" a function when iterating, but when we're going on a sequence we're doing line after line of code, like statement after statement. Perhaps this is a bad chair setting the shape of your spine, after all these years. When I need a variable to be shared by the loop, I set it outside. Perhaps we should explore whether we can have a common ground by default. Let's see.

To make the put respond with diffs is beautiful. It turns side effects into values.

Claude gets it: "This is why you're obsessing over the expansion format. It's not just debug output - it IS the execution model."

### 2025-11-12

I will never sort a number together with text in the context of paths, because they cannot go at the same level except as values. And as values, they are sorted by whatever prefix they have!

But I need that logic because the sorter goes before the validator, the validator looks up a little bit because things were sorted already.

Definition: a quoted number is a step that looks like a number but it is surrounded by quotes, and is therefore considered text. For example: "1.5"

### 2025-11-11

It's TCL, not forth nor lisp, that is the closest to what I'm looking for in cell.

The main problems I have right now in front of me is: make the language usable and expressive enough. Everything else can and must follow from that. Tackle the difficult parts first. The heart of the innovation, so to speak.

What works this far (as far as I'm concerned);
- Fourdata and fourtext (the data representation).
- The unified dataspace.
- The call and response model.

What's snagging me?
- How do we set variables in the tree?
- How do we avoid dynamic capture? Because we have no lexical scope. It is all runtime.

Let's go back to fizzbuzz:

```
fizzbuzz @ s n - @ put p : output
               - @ if cond @ % 3 @ n
                      else @ push p output
                                  v fizz
               - @ if cond @ % 5 @ n
                      else @ push p output
                                  v buzz
               - @ output
```

The only problem here is the initialization of output. When I run it (abridging the rest, just focusing on initializing output):

```
= fizzbuzz
: output <should go here>
  s - = ok
      @ put p : output
@ fizzbuzz 30
```

This will only work if 1) there's no : in the call itself; if put is a native call and has no expansion, then it will work. Otherwise, it won't. 2) that we only use the first step of the path to find a match, instead of the whole thing. Otherwise, we'd go up/left finding `: output` instead of just `:`.

1) can be circumvented by an `up` operator. It can either be `p up : output` or

```
p : output
up 1
```

I need to write more code. Otherwise I won't know.

Let's look at the implementation of lith, my old library for generating HTML for object literals, and reimplement it but with the new way of representing html in cell.

Let's try it without validation and without empty tags.

```
div id z
    cl - a
       - b
       - "c d"
    _ p cl - u
        onclick @ s @ shine
        _ Hello!

```
```
html tags @ list div p // Here, @ list breaks down the steps of a single path into a list. This is to avoid taking up so many lines, nothing else.
     generate @ s input : -

```

I'm hopelessly naked here. Even without validation, this is not possible now. What I need to do is:
- Initialize an output variable, or get it recursively. How would I do this? Ah, no need, you can simply return the outputs of nested calls and append them.
- Pick up the first step of input and put that as the tag. then iterate all the non _ elements and add the attributes, entityifying whatever you need to and appending it all. Special logic for classes. Then, jump on to _ by making a recursive call and appending its result to your output. Then, return the output.

Going again through [Antirez's TCL writeup](https://antirez.com/articoli/tclmisunderstood.html).

In TCL, calls are wrapped in brackets. In cell, they are prepended by an @.

`$a` is the same as `@ a` in cell.

`puts "Hello World"`: quoting is the same here.

`puts "Hello $a World [string length $b]"` not here: in this quote, variables and commands are substituted. The really literal quotes are `{Hello $a World}`.

Function definitions go between braces. There's an eval coming up that executes what's between curly brackets.

```
set a pu
set b ts
$a$b "Hello World"
```

```
a i
b f
c @ concat - @ a
           - @ b
@ = if
  @ c cond ...
      else ...
```

Not quite as elegant.

"If you are reading this article you already know what Eval is. The command eval {puts hello} will of course evaluate the code passed as argument, as happens in many other programming languages. In Tcl there is another beast, a command called uplevel that can evaluate code in the context of the calling procedure, or for what it's worth, in the context of the caller of the caller (or directly at the top level). What this means is that what in Lisp are macros, in Tcl are just simple procedures."

uplevel makes it "walk up", only that it's explicit and you control by how much.

There will be no explicit async in cell. Things that are taking some time will just take some time; when their results come in, further changes will be triggered.

The only problem is doing things sequentially. If you do only one thing at a time and a sequence is waiting for something slow to complete, the cell is blocked. This is sometimes desirable, if for example you are doing bank transactions. What i'm thinking of is a lock (actually queue) on a fraction of the dataspace, to allow other ops to continue.

Going back to the structure of the language: I'm paying dearly for removing parenthesis/brackets/braces. You cannot simply just surround a call with them and put them in the context of anohter clal. But you can put them side by side. So where's the limit? Perhaps there is none. This is just unfamiliar territory.

### 2025-11-10

Business model for cell as a service: zero ten ten.
- Free usage: with no account, 1MB cells with 7 day deletion. With account, up to 10MB with no deletion.
- 10 bucks per person per organization, or also for personal use (Personal use within an organization account is fine if the organization allows it).
- Other companies that directly offer cell as a service pay 10% of revenue as a license. This doesn't include companies which build a product on top of cell.

The seven primitive operators of lisp (according to pg in The Roots of Lisp), mapped to cell:
1. quote: no need. Instead we have @ to represent references.
2. atom: we have @ t (@ type) instead, to return the type, since there's four types instead of two (lisp has only atom and list).
3. eq: @ eq.
4/5. car/cdr: we just use numbers in a reference. We can use @ slice to get everything but the first element of a list.
6. cons: can be @ concat or @ push
7. cond: @ if

Then, the function notation:

- lambda: @ s (formerly @ do)

Helpers:
- null (can be @ eq ""
- and/not/or (all defined in terms of conditionals against the empty list; in cell, they would be against "" or 0).
- append
- pair
- assoc

"Lexical scope does not complicate the denition of eval very much but it may make compilers harder to write."

I wonder if what we already have, with walking up, is a good enough scoping mechanism. It is dynamic, but it is not liable to the typical pitfalls of dynamic scope.

- No global scope where setting x inside a nested structure sets it at the top level.
- A function defined elsewhere can access the free variables of the nested environment. That's a powerful feature. If the function doesn't want a free variable, it should define that internally and there won't be capture.
- A subtle assumption: utility sequences should not rely on free variables, and take everything they use in their message.

Change:
- Instead of @ do, I want to write @ s. "s" stands for "sequence". Perhaps it could also be @ seq.


The main calls, ordered by length.

     @         @ s         @ if         @ put       @ loop      @ catch
|---------| |--------| |-----------| |----------| |---------| |----------|
 reference   sequence   conditional    storage     iteration     error
    (0)         (1)         (2)          (3)          (4)         (5)

Idea: shortand for put. For example, `put . foo 3`. Basically, if there's no `v`, you assume that's `v`. This could work.

Something to remember: all the logic is in the colon, that is, in the expansion.

cell is all prefix, unlike forth. the call always comes first.

ideas for html generation (not all are new):
- Each element is a hash.
- The children go in _ and can be either another element or a list of elements.
- Use `cl` shorthand for class and allow to pass a list of texts.

For example:

```
div id z
    cl - a
       - b
       - "c d"
    _ p cl - u
        onclick @ s @ shine
        _ Hello!
```

Notice how you can pass a sequence to a handler and `@ s` freezes it.

Cell is special because it prepends every call with an @ rather than asking you to quote. So you can have the data right there. Lisp allows numbers only. Perhaps this is why it doesn't have hashes.

In tcl, everything's a string but there are parenthesis (brackets, actually). call is at the beginning. dispatch everything to the command. It uses variables, control structures and functions and i/o.

Structure of cell

```
|---------|----------|-----------
|         | language |          |
| editor  |----------| service  |
|         |  engine  |          |
|--------------------------------
```

OK, let's design the language in action.

fizzbuzz:
- Receives a number.
- If divisible by 3 and not by 5, returns "fizz".
- If divisible by 5 and not by 3, returns "buzz".
- If divisible by 3 and 5, returns "fizzbuzz".

```
fizzbuzz @ s n 1 @ if cond @ % 3 @ n
                      else @ push p . output
                                  v fizz
               2 @ if cond @ % 5 @ n
                      else @ push p . output
                                  v buzz
               3 @ . output
```

Let's look at the execution:

```
= ""
: n 4
  s 1 = ""
      @ if cond = 1
                @ % 3 = 4
                      @ n
           else @ push p . output
                       v fizz
    2 = ""
      @ if cond = 4
                @ % 5 = 4
                      @ n
           else @ push p . output
                       v buzz

    3 = ""
      @ . output
@ fizzbuzz 4
```

What if I don't use the colon, and just use `s` to show the sequence?
The two problems I'm having: have a "place" for intermediate values (including the message) which has to be a hash, and then having the sequence, which is a list!

Maybe we can do : s and put the sequence there.

We need dots on mere references to avoid going "up". Either that, or initialize the variable.

Maybe dots are mistakes. Maybe we need to initialize things explicitly to know where they hang in the tree. Everything is too dynamic. Is this speed bump going to become annoying? But what are the alternatives?

No, what we need is not dots. What we need is 1) to initialize explicitly; 2) to be able to go more than one up with an "up" operator. For example: `@ up output`. But let's add that one when we need it.

So, let's do this without dots:

```
fizzbuzz @ s n - @ put p . output
               - @ if cond @ % 3 @ n
                      else @ push p output
                                  v fizz
               - @ if cond @ % 5 @ n
                      else @ push p output
                                  v buzz
               - @ . output
= ""
: n 4
  output ""
  s 1 = to ""
      @ put p . output
    2 = ""
      @ if cond = 1
                @ % 3 = 4
                      @ n
           else @ push p output
                       v fizz
    2 = ""
      @ if cond = 4
                @ % 5 = 4
                      @ n
           else @ push p output
                       v buzz

    3 = ""
      @ . output
@ fizzbuzz 4

= fizzbuzz
: n 15
  output fizzbuzz
  s 1 = to ""
      @ put p . output
    2 = ""
      @ if cond = 1
                @ % 3 = 4
                      @ n
           else @ push p output
                       v fizz
    2 = ""
      @ if cond = 4
                @ % 5 = 4
                      @ n
           else @ push p output
                       v buzz

    3 = ""
      @ . output
@ fizzbuzz 4
```

Seeing a diff on every put really tells you what happened!

Wait, dot doesn't work. Or rather, put with dot. Because we need to do it at one up. If you are inside s 1, putting something "here" means in "s 1", whereas we want to do it outside those two, in :. Wait. We could write put p : output! That's the elegant solution. No need for a dot! But wait: it will try to find `: output` and won't find it (on initialization, right?). And then it will walk all the way up and then finally set : output there. Not so cool. And If I do `p :` and `v output 30` then I'm also overwriting everything. Not good.
It makes sense for put to walk up also when the path is more than one. No "only the first" silliness.

Wait, this should work. Find the colon, then find something else. But that something else wouldn't be there?

Solutions:
- Make the colon path be special inside a sequence (urgh)
- Pass a context path to put (:)
- Do a put that upserts instead of overwriting
- Change the logic so that the first element of p is first found; if that is found, then you found your anchor. This is not like get, where you walk up on the whole path.

What would be beautiful is to be able to just write:

```
fizzbuzz @ s n - @ put p : output
```

Let's go for a bit with that walking up logic that only uses the first element of the path to find an anchor. Then, it would work only if that call didn't have its own expansion! If it did, it would be snagged.

Yet another option is to somehow initialize output, but that violates the principle of the sequence doing its thing. No, it has to be solved here.

It'd be silly to have to say "up" already in a standard case like this. You want your expansion to have these top level variables of the expansion.

I wonder if there's a single proper mechanism for walking up, both for put and get. Is it "whole path", or "leading step"? Leading step has its virtues: you follow just one comparison, instead of having to look at the entire tree to see if there's a match. But this is pure "only the first" silliness. My question is: does it still make sense?

I need more test cases.

```
fizzbuzz @ s n - @ put p : output
               - @ if cond @ % 3 @ n
                      else @ push p output
                                  v fizz
               - @ if cond @ % 5 @ n
                      else @ push p output
                                  v buzz
               - @ . output
```

Add put to todis, because that's persistence. transform is sequence and conditional. communicate is reference.

### 2025-11-06

Clarifying this mystery:

- ct "/"multiline
       trickery/" some 2 /"calm
                         animal/""

But if I wrote it straight, it would be:

"multiline
 trickery" some 2 "calm
                   animal"

Let's see how the first one gets transformed step by step:

"/"multiline
  trickery/" some 2 /"calm
                    animal/""

Then

"multiline
 trickery" some 2 "calm
                   animal"

OK, that makes sense, but I still don't have a good rule for doing it, except putting as few indents as you can on each first line without triggering the error from the cell parser.

This is good enough. I could see the path of how one transforms to the other. And because it's reversible, we know it comes back correctly.

Moving on!

### 2025-11-04

          - c @ put v ned 1 a A C
                          2 b B D
                      quinella 1 a
                               2 b
                      ref @ ned @ quinella

          - c @ ref
            r = A C
              @ ned = 1 a
                      2 b
                    @ quinella

An alternative way to specify this would be to expect this:

              @ ref
              = A C
                B D
              @ ned = 1 a
                      2 b
                    @ quinella

But, for now, we don't need this multireference. It even seems that it's better to just implement multireference as a loop. Time will tell. We go with the above for now.

A mystery for the next session: how did we just go 5-10x slower when running the test suite? Is it really those regexes?

### 2025-11-03

When we make http requests, we can have a section of the dataspace dedicated to calls that are in flight. So, your variable references that part of the dataspace that is in flight. When the request ends, the result is put there and then it propagates to your variable.

Implementation note: the jumping over equals requires a value path, you cannot just pass a straight path to cell.do or cell.if. I'm not so sure about this though.

This sends cell onto a crash:

```
          - c @ put v closet sock
                      house @ room
                      room @ closet
```

But this doesn't, despite looking the same to me:

```
          - c @ put v foo bar
                      joo @ jip
                      jip @ foo
```

Why?

bar is sock
foo is closet
jip is room
joo is house

The first one is

```
b a
d c
c b
```

But the second one is sorted automatically to this

foo bar
jip @ foo
joo @ jip

So it really is

```
b a
c b
d c
```

The order matters.

This is how it get stuck. These are the put calls that come from cell.respond.

```
(2025-11-03T20:18:23.629Z) debug:
p house =
v @ closet
(2025-11-03T20:18:23.629Z) debug:
p house = =
v sock
(2025-11-03T20:18:23.630Z) debug:
p house =
v @ closet
(2025-11-03T20:18:23.630Z) debug:
p house = =
v sock
(2025-11-03T20:18:23.630Z) debug:
p house =
v @ closet
(2025-11-03T20:18:23.630Z) debug:
p house = =
v sock
(2025-11-03T20:18:23.630Z) debug:
p house =
v @ closet
(2025-11-03T20:18:23.630Z) debug:
p house = =
v sock
```

We start by setting house to @ closet. Why? Ah, because house = takes you to @ closet.

Then we set house = = to sock, because that's what closet references.

Then we set again house = to @ closet. So we are undoing what we just did.

How is this not the case in the other example? In any case, better to fix it here. Perhaps it is a matter of order of execution because of how things are spelled. Let's count by position.

bar (1) is sock (4)
foo (2) is closet (1)
jip (3) is room (3)
joo (4) is house (2)

More detail:

```
(2025-11-03T20:24:33.733Z) i have:
closet sock
house = @ closet
      @ room
room @ closet
(2025-11-03T20:24:33.734Z) to put:
p house = =
v sock

(2025-11-03T20:24:33.734Z) i have:
closet sock
house = = sock
        @ closet
      @ room
room @ closet
(2025-11-03T20:24:33.734Z) to put:
p house =
v @ closet

```

Interesting that we cannot even respond to room @ closet! We haven't even made it there and we are stuck. If this had a value, would it be different?

This does work

```
(2025-11-03T20:28:53.592Z) i have:
foo bar
jip @ foo
joo @ jip
(2025-11-03T20:28:53.592Z) to put:
p jip =
v bar
(2025-11-03T20:28:53.592Z) i have:
foo bar
jip = bar
    @ foo
joo @ jip
(2025-11-03T20:28:53.592Z) to put:
p joo =
v = bar
  @ foo
(2025-11-03T20:28:53.592Z) after:
foo bar
jip = bar
    @ foo
joo = = bar
      @ foo
    @ jip
(2025-11-03T20:28:53.592Z) after:
foo bar
jip = bar
    @ foo
joo = = bar
      @ foo
    @ jip
```

Note the double equals are on the bottom one, it is the one that is executed later.

OK, respond manually.

step 1 (already sorted):
closet sock
house @ room
room @ closet

step 2: expand second path
closet sock
house = @ closet
      @ room
room @ closet

step 3: expand new second path
closet sock
house = = sock
        @ closet
      @ room
room @ closet

We actually get here. We should now move to expanding the fifth and last path. So what's going on? Here's the crucial bit. We SHOULD do this now:

- Consider that house = @ closet has the correct value: = sock.

However, we instead determine that the correct value for house = should be (and here's the error): @ closet. Why we consider that it should be @ closet and not = sock?

Because room still didn't have its value expanded because we didn't get there yet. We assume that the value should be there already. How do we know that we are in the right and that value is still not expanded?

The telltale is that @ closet has nothing on top of it! It has no =. It should always have an =. So, we can make it so that if there's no equal on top of a call, we do not consider that value.

OK, it seems to work quite well. Let's cleanup. This is the draft that I'm throwing away:

```
   var currentValue  = cell.get (valuePath, contextPath, get);
   if (currentValue.length === 0) {

      var call = dale.stopNot (dale.times (valuePath.length - 1, valuePath.length - 2), undefined, function (k) {
         var value = cell.get (valuePath.slice (0, k).concat (['@', 'do']), contextPath, get);
         if (value.length) return {definitionPath: valuePath.slice (0, k).concat (['@', 'do']), message: valuePath.slice (-k)};
      });

      if (call) {
         currentValue = cell.do ('execute', call.definitionPath, contextPath, path.slice (0, - call.length), get, put);
      }
      else {
         var nativeResponse = cell.native (valuePath [0], path.slice (0, path.length - 3), contextPath, get);
         if (nativeResponse !== false) currentValue = nativeResponse;
      }
   }
```

### 2025-10-31

Why is cell.do special and cannot go with the normal flow of execution?
- Putting the message in :.
- Making that calls to put are done on :. But wait: we could do this from our own code, and point to : instead of .? This is an open question.
- Stopping responses (either early returns or errors).
- Once we get the response of the entire sequence, we put it at the top.

The updating of the sequence, rather than wholesale replacing, is to avoid infinite recurse. And even if it wasn't for infinite recurse, some calls could be expensive or rate-limited (http, email), so it makes sense to check before doing them again.

A sequence is made of steps, just like a path. And because it is a list, its steps are literally the steps of a path. But the sequence goes "down", whereas paths go "right".

Cell is an integrated dataspace for knowledge working.

### 2025-10-30

Do I need to "jump over equals" for the message to a call? I don't think so.

Why am I jumping over equals at all?

```
foo 10
reffoo = 10
       @ foo
```

### 2025-10-29

- First, use the entire value path to get a value. If you got one, great. If not, go to the next step and walk the split.
- Walk the split: split the entire value path into two, starting with most of the first step on its left, minus the last step. Append @ do to it and see if that points somewhere. If it does, you found a call. This is an execution.
- When you find a call, take all the paths that make it up and remove the left part of the value path from all of them so that you have a clean message.
- Until you find something, keep on walking the value up until n - 1, because it makes no sense to get an empty path - it'd bring everything.
(Honestly, we could also walk right to left and it'd be OK too). Yeah, let's do this.
- If you didn't get anything, make a call to cell.native.
- Inside cell.native
   - If you got a value, and it starts with do, this is a definition. Complete the definition by calling cell.call.
   - If you got a value, and it starts with if, this is a conditional. Complete the conditional by calling cell.if.

I'm trying to understand this pesky `prefix`. It is a modified `targetPath`, that has no = at the end, and suffixed with `@ <first step after the rightmost @>`.

I just (re)got something: because valuePath has no =s in it, we are always skipping to the results. That's why it also works for indirect definitions.

```
   var currentValue = cell.get (valuePath, contextPath, get);
```

By starting with the above, we let you redefine if or do at any level. That's all the forth you've got here.

(Side note: if function application wasn't written right to left, we'd do it the forth way: argument, function, function; instead, we do f (g (x)))

Silly! Just pass a path to the message when you're calling cell.call, or cell.if. BUT WAIT! This implies that it is all there in the dataspace. It wasn't like this before! But it can be like this now. Or is it? cell.do could not be called from the "outside", it was only through putting stuff. So this was always silly.

### 2025-10-28

No self reference! @, or any prefix of where you are, because otherwise it expands fractally and forever! Error: "No self-reference! cell is not an aleph".
I only realize it now. Very interesting.

This means that the call to get everything (`@`) has to go outside of the dataspace, a straight line to cell.get.

Also, an @ as the last step of a path is a literal, not a call. So it doesn't expand to the whole thing, and it also lets us have literal `@`s as last steps.

From Knuth's implementation of Adventure: "By the way, if you don't like |goto| statements, don't read this. (And don't read any other programs that simulate multistate systems.)"

Context path is just on the left; the intermediate value is the left hand, it is just what you overwrite. but what is the prefix for? the value path is what gives you the value itself. I need to fully internalize this.

- Context path: where you go get values. The frame of reference.
- Value path: where you're getting the result from. This is where the response is.
- Target path: the middle part of the path. Goes all the way from the left up to the rightmost at. Also with an = at the end. This is where we put the value we obtain.
- Prefix (path): the target path plus the rightmost at and the first step of the value path. What is this, really?

Interesting symmetry here:
```
   var previousValue = cell.get (targetPath, contextPath, get);

   var currentValue = cell.get (valuePath, contextPath, get);
```

What I don't get is that valuePath is supposed to be on the "right" and targetPath on the left. So how could those different places be later compared to see if the value changes?
Ah, I see: the target path should point to the previous value, it will be there at =. And the new value comes from @. So this is how things get updated. It makes sense.

I'm rewriting the entire logic of resolving calls. Three calls to resolve: reference, sequence, conditional.

An example to illustrate this part:

```
bar @ do ...
foo @ bar hello 1
```

In this case, when responding to the reference at `foo`, we'll first try to get `bar hello 1`. This will respond with nothing because there is nothing there.

So, we try to get `bar @ do`. In this case, we succeed. We found a call. The message will be `hello 1`.

If instead we had:

```
bar hello @ do ...
foo @ bar hello 1
```

We'd first try `@ bar hello 1`. Nothing; then, `bar @ do`: nothing. Then, `bar hello @ do`. That will work! The message will be `1`.

The problem with finding a call like this is that it could be a reference or a conditional. A reference, however, would be solved (I think) by the "jumping over equals" that we already do. Where is that? Here:

> The **value path** is everything to the right of `rightmostAt`. This is the right part of our assignment, where we're getting the value from. Note we actually remove any `=` from it; this allows us to "go get" the values of calls that have been responded already. Another way to call this "go get" is as "jumping over equals".

So we were just not implementing @ ifs that were elsewhere. This is significant evidence that the approach of cell.respond is flawed and has to be simpler.

Why am I walking at all? By walking, I mean `@ bar hello 1`, then `@ bar ...`, then `@ bar hello ...`. BTW, the last step should be unnecessary, because the last step was the first where we just got the whole thing!

So, why is walking necessary? To distinguish, within the value path, what's the path to the call and what's the message. That's why. The essential part here is the walking, trying with growing paths that go from left to right (and stop at the whole value path - 1, which is the original one we tried). The logic should be that if whatever comes starts with an @, we bring it? No. No? I'm not sure.

Let's try to invalidate that thought:

```
a 1
bar hello = 1
          @ a
foo @ bar hello 1
```

The question is, what is `foo =`? If we go with just straight comparison, we'll get "". There's no `bar hello 1`. If we try just bar, we'll get stuff! But this is not what we're getting, unless what came after bar was @. So we move on to `bar hello` and we find that it has an @ behind it. It points to a straight reference.

A reference, really, is a call without message. Yep, that is what I defined almost a year ago.

Because that reference doesn't take a message, the call cannot really resolve to a value, because we'd be ignoring the right part of the value path in `bar hello 1`. But what if we had this?

```
a @ do ...
bar hello = 1
          @ a
foo @ bar hello 1
```

In this case, it'd be meaningful to resolve this as a call to `a` with `1` as the message. Not just meaningful, but actually correct. So we cannot (also) just look for `bar hello @ do`. We need to see if that eventually leads to a result that yields a call to @ do or @ if.

How do you go deep and find the @ do or @ if that's the "rock bottom" of the call (or its absence?). You can just jump over equals. You jump over equals and if you find an @ do or @ if, you have your call. And the split you used on the value path determines what's the call and what's the message.

Wait, let's rewind a bit. The easy version was:
- Just a call to @ if. This is an execution of a conditional. (Interesting that a conditional has no definition).
- Or a call to @ do. This is just a definition, not an execution.
- Or a reference, take the whole thing. All good!

But if you have indirection, this won't work. You want to define calls that you will use elsewhere. That's where all of this machinery comes in. Not just indirection, but actually calling your definitions.

Let's go to the hairy part:
- No immediate if or do.
- No immediate reference.
- Then, walk the splits on the value path to find something. If that something, jumping over equals, leads you to an @ do or an @ if, you have a call.
- If you find nothing, try a native call. Native calls we don't walk because we just use the first step of the value path to identify the native call.

NB: confusingly enough, I also use the term "walking" in the definition of cell.get, when the function walks up the context path to find a value at its query path. The mechanisms are related, but the one of cell.get works with smaller context paths, whereas the walking in cell.respond works with growing segments of the value path.

Wait, why @ if? It doesn't make much sense to send a message to @ if, right? @ if has its cond, do, else. What'd be the purpose of having some part of the dataspace referencing @ if and then you passing cond/do/else? That makes no sense. Just write @ if directly. @ do is the only one that makes sense to refer to indirectly, because it's actual logic, including @ ifs inside of it. The only thing that makes sense to store elsewhere are sequences! Well, references too. The conditional, you just write. So, no need to handle indirects @ if.

Well, I almost seem to know what should happen. But what about overwriting do? You could have a definition of `do` outside everything, at the outermost. We should hit that before we hit the native one.

I think that rather than implementing this cell.call, we should go even deeper and really see what @ do is doing, both in definition and execution. Because that's the crux. If we figure out an elegant way to expand the paths (respond to calls), it's all there. We are not far.

### 2025-10-27

No separate endpoint for if and do, do it as a call that goes through cell.native! This allows also to overwrite if and do, if you want. It removes a lot of code I have in cell.do. Definitely the one for gathering the definition; and perhaps even the one for updating the sequence! That code would not exist. But wait: that assumes we don't stop. If we do stop, then yes, we cannot continue. So that code would have to "open" a step to make sure it runs after the previous one stabilizes. I need to think about this one.

Allow hashes and lists to native operators. the one you cannot do is two references, just one, and the reference has to be on your right. maybe it has to jump over =.

It is useful for me to memorize parts of the code that are crucial, so I have the flow in my head. Mental play.

It's so natural that the expansion of a sequence is not separate, but as part of the sequence!

Wipe can delete even the dialog. If you want to do everything but the dialog, we need to send an "except" value.

Write examples (with diagrams?) of how expansions work in cell.respond, makes it so much easier to understand. I could use the LLM for this.

Upcoming sequence of work:
- Rework entrypoint of native calls (if/do/put).
- Make all existing tests work.
- Test that the new cell.call works fine.
- Rework sequence so that it puts the expansions on each step, rather than on :. Use : only for common variables of the expansion, like the message.
- Rewrite all the existing tests.
- Literal dashes.
- Upload.
- Continue working on the demo flow.

Unrelated: perhaps because cell is not built with a context-free grammar (Backus/Naur), that's an implementation/material reason that makes the syntax look so different. Not that it would be impossible to do it with a traditional grammar, but perhaps not using one and just implementing the parsing in a high level language makes certain things more direct and others quite less so.
(I just learned that Python has a hand-written parser, which allows it to handle indentation).

OK, what should be the mechanism of cell.respond? Because put and get will just work in the dataspace, fully self-similar. So there's a walking up: try first reference, then do, then if. For each of these you walk up (cell.get does the walk up).

```
cell.call -> cell.put -> cell.respond -> cell.get
                                      -> cell.native -> cell.do
                                                     -> cell.if
                                                     -> other native calls
```

- Resolve references right to left.
- If you find a value (paths > 0) stop.
- If not, go to native.
- Native: detect an if, dispatch to it. detect a do definition; detect a do execution. Detect another native call. If nothing yields something, give up.
- If native gave nothing, there's nothing.

A reference is a call. What I mean is a reference to a sequence, which is a special type of call.

Three types of call: reference, sequence and conditional. A reference can point to a sequence or a conditional.

### 2025-10-23

As much as I want to have fun with engines, it feels like too much at this stage. I want to be able to run cell. And the current engine, although slow and based on text files, already works. Let's redo the tests, redo cell.call, allow for upload, implement loop, and then we can come back to having fun with engines.

We WILL run cell in IE6.

I never put a `put` in the dataspace yet!

> - The **context path** is everything to the left of `leftmostAt`. That is, everything that's not a reference, is our context.

Interesting that you could still have a reference on the left, but then, there'd be a line on top of that reference that'd be an =. And then, to the right of that line/path, you could have another reference. So you can have references on the left, but we only work on them on the paths/lines where they are resolved.

Interesting that when we put @ and = in the same dataspace, moving up in space is like moving forward in time, because you see what comes afterwards.

Do we want things to be frozen on the put, or not? On @ do, they are frozen. But on @ put, would we want to put references in the values, or even on the paths? Why not? Security shouldn't be an issue, because it should be properly handled. So, that only leaves practicality. If you put an @ put with an @ do, the @ do will be frozen, so you can create calls from it. But if @ do does not freeze them, why freeze them arbitrarily in @ put? Just treat it like something normal. So we can just treat @ put like any other not @ do call.

This hints at @ do being the only "freezing call". Ironic that the call to keep on going is the one that freezes references on the dataspace.

### 2025-10-22

Index everything! I thought I was the only nut to even propose this, but I got this from Claude: "Datomic is the big one. Rich Hickey's whole design philosophy was "storage is cheap, indexes are fast" - it maintains 4+ sort orders of the same datoms (EAVT, AEVT, AVET, VAET) to make different query patterns efficient. Very much "index everything.""

### 2025-10-21

I'm thinking on how cell should be modified so that we could just use the DB, rather than the file persistence. Because things would change.

put would be different: it wouldn't iterate through all values, but rather check whatever it gets.

I'm really excited to be able to query a significant amount of data from the editor and have quick queries that return stuff back.

Combining that with the idea of the "two numbers" which control automatic folding, we could be onto something.

Rehashing the idea here: one number to control, at the outermost level, how much you show on the y axis. Then another one to say how much you show given what you already expanded.

But I realize that's wrong: I will show all the first level keys; you can simply scroll down. Unfold is for things that are there. So I could perhaps just do with ONE number, which is: for the first level steps, how many paths you show for them? If N is 20, any first level path that expands to less than 20, you show everything. Maybe N should be 10, but the point is clear. Whatever you choose to unfold, it stays unfolded until you fold it again.

What about scrolling to the right? You can just move. Let's keep the folds on number of paths. Perhaps it could work and it'd be more than enough.

What about the implementation? Let's see it from zero:

cell.call:
   - parses; if invalid input, responds with error.
   - calls either get or put. Soon, after the rewrite, it will just call put in context, wait until it is done, then add an entry to the dialog. Maybe it should be put that adds things on the dialog? No, because recursive calls shouldn't add things on the dialog. Unless we tell put that "this is a top level entry". Then put can handle that inside the DB. That could work!
   - We can send the data to the DB as paths where each element is already unparsed. That saves work for Lua. At least I did that on the POC of last episode. But honestly, it'd be cleaner to just send fourtext. But do we want to reparse the whole thing? We could just send paths, regular paths, as stringified JSON.

cell.put:
   - Must squarely be inside the DB.
   - It should do its own validation. If that requires porting some of cell to Lua, it's OK. At least the data will come parsed.
   - Yeah, we need to rewrite it so that instead of going through the entire dataspace to find paths "of interest", it queries for prefixes. This is the currently filtering out line: `if (teishi.eq (leftSide, path.slice (0, leftSide.length))) return;`. This call should be done through cell.get. cell.get should efficiently get a prefix. I'm already thinking of making it a powerful query function, but what put needs really is to be able to get paths by prefix quickly.

cell.get:
   - Must squarely be inside the DB.
   - Needs to do the tricky bit of walking up too.
   - Doesn't need cell.put, so we're good there.
   - It should have a lower-level call that gets a prefix from the DB. The walking up logic can be done on the outermost part of the function.

cell.respond:
   - This is the one that worries me. It is quite big and complex. But it has to be in the DB! It has to run close to the data.
   - What we need for it to work efficiently is to track dependencies between parts of the cell. So that when X gets modified, we know to go to Y and Z. cell.respond needs to build and maintain a dependency graph. Let's bite the bullet and design it right now.
   - If a path with prefix X depends on a path Y, we store Y in a key with the dependencies of X. It could be a set of stringified paths. And we need it two ways: we also need to know that X is a dependent of Y. Do we go with the gotoB algorithm, where if a prefix of a prefix (say, the left part of Y) is changed, we consider Y to be changed? I think so, yes. Otherwise, you'd have to do it by value changed. Well, we could just do that. But you need to *check* if the value is changed if the prefix of the prefix is changed, so yes. The gotoB approach is the one that's proper here.
   - The only thing giving me pause is the memory footprint of the dependency keys. But let's see it in practice how much it'd be. It's either that or go full immediate mode and recompute the whole thing every time.

This is still parallel to the redesign of sequences, and actually getting loops done, and all of that. This would be just the engine. Putting the language on top of an engine that has persistence and performance (well, fourtext files have persistence too).

note: no more "until it stabilizes". Things update synchronously and one at a time. Once it's done, we do what we need to do. We do not lose sequence. We can't and shouldn't lose sequence.

I think it would be sound to do the rewrite in JS first, and always keep a pure JS implementation against fourtext. We can then perfect the tests (now, or later) and write the Lua/Redis implementation and (gasp) the postgres one too, as a port of the JS implementation. But the JS implementation needs to think about efficiency now, including dependencies, so that the port can be 1:1. And we can work with the existing tests to make sure things still work.

### 2025-10-20

More fun with engines. At some point I'll get back to those tests.

OK, so a proper put would:
- Overwrite things properly.
- Validate against what's in there already.
- The dedashing and sorting and even duplicates can be filtered out in JS. Actually, not the filtering out, because those could be there. The one thing we could do in JS to validate is to make sure there are no floats as keys.

Testing the put in redis:

with the data in:
used_memory:25810144
used_memory:25566336

250k?

used_memory:25835664
used_memory:25566864

Yeah, 250k. The raw JSON is about 12k. So we're looking at 20x. Steep. Does it go down if we keep on adding data that has similar values?

Beautiful. This has been my idea of a DB for a long time. Every value is indexed, always. If it costs 20x the memory, could it still be acceptable?

Numbers are so cheap in redis! It's crazy.

Memory analysis for cell "server":
Total bytes: 222627
Total keys: 2099
By prefix:
  server:children: 37712 bytes, 575 keys
  server:idCount: 48 bytes, 1 keys
  server:numbers: 688 bytes, 1 keys
  server:position: 30264 bytes, 5 keys
  server:step: 85792 bytes, 1089 keys
  server:texts: 37211 bytes, 1 keys
  server:value: 30912 bytes, 427 keys

With a 5mb JSON with a lot of non-repeated text, the factor is 8x. Promising.

This may work.

If you don't want something indexed, put it as a file! no speed bump to bring content of a file, jump over it, perhaps with `data` key.

Idea: editor accesses data piecemeal; think of a lot of data. To control folding. two numbers only: how many at first level you see all the way down (y axis) ); and how many depth in paths for each of them (less than 20 if unfolded, for example). If you unfold something that was folded, use the same constants to fold/unfold further. That's just two numbers and it allows you to have good defaults on the whole thing. You can then unfold wherever you want and the cell can remember that.

The editor shows only a little bit! Scans go all the way to redis/postgres.

### 2025-10-18

Thinking again about having "fun with engines" and working on the redis engine for cell. To store and query data really really quickly.

```
step:<id> - <value>
(list)    - <position in the path>
          - <parent id>

children:<id> - <id>
(set)         - ...

value:<value> - <id>
(set)         - ...

position:<id> - <id>
(set)         - ...

numbers - member <value>
(zset)    score <value>
        - ...

texts - member <value>
(zset)  score 0
      - ...

idCount <n>
(string)
```

The above is for just one cell. We can prepend every key with the cell name.

I like that the children are stored in sets. The entire idea is to use intersection of sets to quickly arrive to the data.

When using the query language, make `status` just stand for `status`. If you do `status*`, it will be texts that starts with `status`.

zsets give us quick ranges of numbers and texts that then can be resolved by looking up by value. These are the fast query ops.

Once we get all the steps that match, we reconstruct the entire set of paths.

Operations:
- Query
   - Get all
   - With parameters
- Delete
- Put
   - Straight addition
   - Addition and delete

### 2025-10-17

The three problems I see in type systems:
- Types use a different syntax than the rest of the language. Separateness.
- Types are less powerful than the programming language. No sequences; conditionals are only supported indirectly. You basically just have reference.
- The type system disappears at runtime.

Unexpectedly, I just realized that these are the same problems I experience with template systems. And these are the reasons I prefer to use neither types nor templates.

Unrelated: the dialog is the third part that makes dataspace changes possible. Think of it like action vs reaction: if you're trying to pull a weight in a vacuum, you can't because you have nothing to pull against. But if you have a floor, you push on the floor and the pushback from the floor allows you to pull on the weight. The dialog is the floor: you interact with it and through those interactions, the dataspace (outside of the dialog) changes.

### 2025-10-16

The tests can be the negative of an executable specification.

### 2025-10-15

https://ruudvanasseldonk.com/2023/01/11/the-yaml-document-from-hell
"I think the main reason that yaml is so prevalent despite its pitfalls, is that for a long time it was the only viable configuration format. Often we need lists and nested data, which rules out flat formats like ini. Xml is noisy and annoying to write by hand. But most of all, we need comments, which rules out json."
Why can't the comments be inside the data and just be ignored by what processes the data?

"Many of the problems with yaml are caused by unquoted things that look like strings but behave differently. This is easy to avoid: always quote all strings. (Indeed, you can tell that somebody is an experienced yaml engineer when they defensively quote all the strings.)"

### 2025-10-14

Expansions for @ do should go in each of the steps!! Rather than outside. We only need to put variables in :, including the message. But not seq. seq can go right there!

1 = ...
  @ foo

What memory allocation errors are to C, runtime exceptions are to very high level languages (JS/Python/Ruby). If the memory allocator or something fundamental fails, it makes sense that the process crashes because all bets are off. But checking a property of undefined making the entire process crash and wipe all the intermediate state that is nowhere persisted? That is nuts.

The issue can be solved by:
- Making exceptions simple values that are stopping. Unless something fundamental in the engine breaks, the process never breaks.
- All state is first class and persisted until cleaned. So there is no collateral damage of an error, which is typical on high level runtimes.

It's not even "let it crash" (like Erlang). Errors are not crashes.

I would say it's nuts that this is like this, but then again, we're in 2025 and we're still seeing a ton of high profile bugs coming from manual memory allocation in software that doesn't need to allocate its own memory. (I published the point [here](https://federicopereiro.com/sunsetting-crashes/)].

Rethinking multiline text coming from fourdata. When it starts, wherever it starts, indent it (and expect it to be indented) by as many spaces as you need to get to the non literal double quote that opens the multiline (quoted) text.

Test that doesn't work yet:

                  5 ct "/"multiline
                        trickery" some 2 /"calm
                        animal/""
                    r 1 1 "multiline
                           trickery"
                        2 some
                      3 2
                      4 "calm
                         animal"

If I was just writing it plainly:

```
"multiline
 trickery" some "calm
                 animal"
```

The way to do this would be to store the offset of that quote, and 1) expect that each line on the multiline text starts with that amount of space or more, otherwise there is a validation error; and 2) remove it.

And this solves the parsing issue with multiline paths in the middle!

```
how "it
     would" "be
             ?"
```

Do I really want this? I think so.

```
doc 1 md "Here goes my text:

          It was a fine day, honestly.
          <table><tr><td>foo</td></tr></table>
         "
      title "One doc"
```

Vs:

```
doc 1 md "Here goes my text:

It was a fine day, honestly.
<table><tr><td>foo</td></tr></table>
"
      title "One doc"
```

How to get the proper offset for inside multiline text? Take the current path and compute the width. For this, if it's a non-multiline, take the length + 1. If it is multiline, take the length of the first line of that multiline and do also plus 1 (for the quote at the beginning). Keep on going until the end. Then add one more for the quote that you are starting now.

You could have something like this:

```
this is a newline: "
                   "
```

The only semantic whitespace of fourtext is space.

Idea for tomorrow: how to use literal dashes: when the dash is in a hash, it's a literal, otherwise it's a placeholder for a number. Although I wonder if we need to make many lists of one, honestly.

### 2025-10-13

cell.call must return the whole thing: call, expansion and response. Later this can be modified if we're sending large amounts of data, perhaps through a variant of cell.call that omits things. This change also should be reflected in the tests.

A call without side effects is a call that doesn't make any changes outside of the dialog! Side-effects are just changes to the dataspace that are outside the dialog.

Perhaps real native calls are those that have no expansion.

Would it be possible to store and see all the expansions? I think so. The dialog would have to be pruned quite often, but that's fine. And new expansions overwrite old ones. This is then two challenges: a backend challenge (be able to scale to a certain amount of data) and a UI challenge (elegantly fold and unfold expansions).

It is interesting that a mere reference (@) and @ put do not have an expansion, just a result.

Does it make sense to respond with also the call? If you're doing calls to another cell, you'd have to jump over two equals:

```
= = result
  @ callToAnotherCell
@ callToAnotherCell
```

When would it make sense?

If you're sending over a boundary (to another cell): you always know the literal call you are sending. It's data. The call is data and you can see all the references resolved. (interesting point: we need a call to wipe the references when you're sending data over the wire so that you only have the results; this makes me think of macros).

Let's say you send a sequence:

```
@ do 1 ...
     2
```

It would make sense to get the expansion and the result, not the call itself. You have the call.

```
= ...
: ...
  seq 1 ...
      2 ...
@ do 1 ...
```

And if you send further data, instead of just one call?

```
foo 10
bar 20
@ do 1 @ foo
```

Then, in that case, it makes sense to respond with the whole thing. (side note: interesting to see in the above example that you could have @ and = at the toplevel, because the other toplevel prefixes are texts as well, the whole thing is a hash).

Then we go back to the original idea: if you send just one call, you get back = and : but not the call itself. If you send a hash or a list with more than one thing, you get the whole thing expanded.

We can just send literal calls to validate the parsing calls, everything coming before the parsed calls. Also, start with a newline because those are ignored and then the whole example can be aligned to the left.

### 2025-10-12

Perhaps the driver for adoption for a language is more libraries than the language itself. Then that begets the question: what makes library makers pick up a language and build libraries in it? I am particularly struck by the amount of useful libraries in Python.

When a long call is done (perhaps an HTTP or a DB call), what if the "from" is not the user that initiated the call, but actually "http" or "db" that responds with the result? It would be a more meaningful way to see who did the change. Of course, it comes from a call made by a user. But the response comes from http and db. It could be said that the user makes the call, http or db respond, and cell is in the middle. You could even query the dialog by it, to see responses coming from http or db.

chatgpt: "You’re making Cell a space of dialogue among agents, rather than a process owned by a single user."

Another way to display the view: full width above, then take a "developer console" from below and put the conversation bubbles left to right, with the last input box on the bottom right. This would allow to easily break the top part into two to see two different parts of the dataspace at the same time.

It would be interesting to see if the test suite could become more and more powerful as we go down, and actually allow constructs like loops (for example) after a certain point. The test suite as a negative impression of the bootstrapping of cell.

Even if you are able (as we will be soon) to send a program over the wire so that cell.call can run it and you get its expansion/response, could you run that program in a context? Like, specifically saying where it should run? Passing a context path as a parameter? This is intriguing, but I think it's wrong. If you don't have this ability, you need to put things in context, then get their results. This requires putting, rather than just sending a call that doesn't persist your program (except in the dialog). The problem with requesting a context is that "you haven't earned it". You need to have access to the context in order to run something. To have a second channel that injects code into a context without really putting it there feels complex, even dangerous. What you can do is simply to put and later wipe. We could even make a shorthand for that inside a call. But we need, I think, to have the foundation of all incoming calls always being executed at the outermost context/level, and only through access masks to be able to put and get inside certain places.

If we ever allow context as part of the message, then write the temp key where we run the call right there in the context. No second channels.

### 2025-10-09

The pattern for multi put: if you get a hash, wrap it in an array. If it's an array, iterate it. If the inner things are not objects with the required shape, respond with an error.

Iterate and respond with an error. Put + cell.respond only at the end

Big decision: rather than doing 1 2 3 4 (where the odds are paths and the evens are values), let's be more explicit and specify p and v. Slightly more typing, but way more clarity. I think it's going to be worth it, especially for those coding when tired (been doing quite some of that lately).

Actually, no. I was thinking: it'd be a mess to figure out if the calls of a multi put overlap with each other. Let's make multiput to be just calling put in sequence. The outermost can simply be a detection of an array and then, if it is, just call itself recursively, and return either the error or the ok.

Ah, because this decision in dale: return what === 'stop' ? result === second : result !== second;, I cannot do dale.stop against a complex key ([['ok']]). But dale goes before teishi and teishi.eq.

From cell.call, we cannot trigger any errors in cell.get. If there's nothing to get, there's nothing to get. But there's nothing invalid. Calling cell.get with context path is only done from cell.respond and cell.if, not from cell.call.

So, from the top, if we're testing through cell.call, we need to start by validating cell.put.

How restrictive it was to allow cell.call to only take one call! We can now send an entire program at once (well, I think soon). All by relaxing the restriction and putting the incoming data somewhere in the dataspace.

Do we really need multiput? Taking the loop example:

```
loop @ do m 1 @ put 1 p . current
                      v ""
                    2 p . output
                      v ""
                    3 p . "process one"
                      v @ do 1 p . current
                               v @ next current @ current
                                        v @ m v
                             2 @ if cond @ not @ current
                                    then respond @ output
                             3 @ push p . output
                                      v @ m do @ m v current
                             4 @ "process one"
            2 @ "process one"
```

Perhaps this is a good pattern to repeat: when you pass a list to certain calls, it's like making that call sequentially to each of the elements of the list.

However, this is really a map. Does it really have to be baked in?

```
loop do @ put
     v ...
```

No, I'm not going to do multiput. We can just use a loop later. I don't want things to be baked in in the main calls.

This was the implementation, straight on the top of the function:

```
   if (paths [0] && paths [0] [0] === 1) {
      var error;
      dale.stopNot (cell.pathsToJS (paths), undefined, function (v) {
         var result = cell.put (cell.JSToPaths (v), contextPath, get, put, updateDialog);
         if (! teishi.eq (result, [['ok']])) return error = result;
      });
      return error || [['ok']];
   }
```

Cell is not meta, it is self-similar (reaction to what claude said yesterday about tests being written in fourdata). This is the main property.

### 2025-10-07

A cell is a unit of consistency. You could have a monolith inside one cell, or one microservice per cell. If you wanted to split a monolith and keep it consistent, you could implement synchronization/blocking across cells.

If a cell is a unit of consistency, technically we need just one tmp key, for whatever we are processing at the moment.

The tests need to go in a separate file, at least the ones with cell.call (the other are more bootstrapping tests, although I could still express them as fourtext).

The fourtext extension should be .4tx , to keep more of a 1:1 naming. Fourdata is not just its text representation.

For new tests:
- Leave those that are above cell.call as is, inside JS, at least for now.
- Take the tests below and put them in a .4tx file.
- The file is a list of tests, each test being a hash with c (call), r (res) and t (tag describing the test).
- Any test that calls cell.get and cell.put directly, find a way to do it through cell.call (even if it's a bit more indirect), so there's a single interface.
- Rename "foo" and "bar" to more meaningful names and make them more varied, to easier identify the tests (although tags will also help with that).
- Commented out tests can be set to `off 1`.
- The frontend won't execute the tests, only the backend. Conditional fs.readFileSync on start for node inside cell.js.
- reset should be a call. It will clean everything and perhaps give out the amount of bytes and paths deleted. And reset should not put things, that should be done by put itself.

Lines that start with /* and are outside of a multiline text are comments! Therefore, ignored. The worst part of JSON, to me, is that it allows for no comments.
No, decided against it. Because then, when reading 4tx into cell and then writing it back out, the comments are lost. We are breaking the unification of the dataspace. Comments need to go inside the data and can simply be texts that are not executed.

Rather than saying "context path", I should just refer to a "prefix". A path is the whole thing, from left to right. A prefix is the left part of a path, where the left is either the first element, the whole thing minus the rightmost one, or something in the middle.

### 2025-10-06

Multi put should be just pairs of things, where the odds are paths and the evens are values.

```
loop @ do m 1 @ put 1 . current
                    2 ""
                    3 . output
                    4 ""
```

Great idea from ChatGPT: when demoing with data, use the same data for demoing both publishing and thinking.

I'm sensing that this query call that goes through to paths at arbitrary depth and with arbitrary predicates could replace a lot of loops. For sure it could replace them at query time, but perhaps even as a tool for transformation of them too.

Going back to cell.call, we are:
1. Parsing text into fourdata, and responding with an error if it is invalid.
2. Putting data into a temporary location in the dataspace.
3. Taking its result (or the whole thing, if there is no result) and responding with it.
4. Putting the whole thing into the dialog (we already do this).

Why a temporary place? Because we cannot do it in the dialog, the dialog is full of calls that should not be updated, you want to see what was responded in the moment. The dialog is the nonreactive piece of the dataspace which keeps history.

But just putting it won't do it. We have to wrap it into @ do, right? With no arguments.

Cases:
- @ do with just a single reference. It has a single =, you can just return that.

### 2025-10-05

there has to be a linear flow in the app, a way we do things. but how does it work in a spreadsheet? we bring data and then we work on it gradually. there are flows for searching for data, flows for creating new data. these flows/unfoldances are the core of what we do with the tool, and how we make it useful. I still don't understand them in cell.
if you put the intermediate steps in the dataspace, if the process goes into error, you can resume them. it's like programming in disk rather than ram, nonvolatile state. echoes of garbage collection, simply that you have rules for when you get rid of things. only that it's the other way around, you have to be explicit about it, like going more low level. but the benefit is huge for such a small price. nonvolatile programming.
the state is always living somewhere. you start by writing

A doubt: if Babylonian astronomy was based on collecting data and deriving patterns from the data for prediction, without trying to understand why those regularities happen, wouldn't TODIS be proposing a Babylonian approach to data, by just looking at it and working with it, without predicting it further? Well, the framework doesn't preclude thinking about why. But it asks that you start with data first, and from the data you find patterns and explanations. Theories without data and that don't fit at all the data can be understood to be useless and misguided. A sublime theoretical breakthrough has to match the data quite well. Looking at the data is just the beginning.

I think I have a good solution for loops. Simply, one recursive function.

State required:
1. Which element you are iterating (position).
2. The list of results to return.

That's it. The rest is the message passed to the loop call, or the surrounding context.

Sequence:
- Get the next element based on the previous one (if no previous, get the first).
- If no next element, respond with the value. (I forgot, do we need stop here? Let's check TODIS: it's `res`. Actually, it could just be respond, let's not make a `creat` just yet.). Actually, we don't need to respond early, because there's just one conditional here.
- Otherwise, call the sequence on that and push the value to the output. Then, call yourself.

Now, this is the fun part. We can simply set this recursive sequence inside :.

```
@ loop do v @ + - @ v
                - 1
       v @ list
```

How do we define loop with just @ do (and @ cond and plain @, of course)?

Let's use multiput to see it quicker

```
loop @ do m 1 @ put p1 . current
                    v1 ""
                    p2 . output
                    v2 ""
                    p3 . "process one"
                    v3 @ do 1 p . current
                              v @ next current @ current
                                       v @ m v
                            2 @ if cond @ not @ current
                                   then respond @ output
                            3 @ push p . output
                                     v @ m do @ m v current
                            4 @ "process one"
            2 @ "process one"
```

(Interesting note: support @ do calls without message, just by putting the list!).
(We also need a "next" call? It would be useful, especially for hashes)
(We'd need a special value for "out of bounds". But that goes completely against what I'm doing here. Ah, wait, it could be done on keys, rather than on values. But what if a hash has an empty text? Then I'd have to keep track of whether the empty text was seen. We could perhaps omit this for now.)
I would also need a call for exists? No, otherwise the @ next would give you "".

Pushes should be done without initialization! What would the operators be for hashes instead of lists? Definitely not push, that's a set. Set for lists is more cumbersome because you need to query the length. In hashes you don't care.

Would the locality of current and output work? I want them to be at the outermost level. Perhaps I need a conditional on top, otherwise they will be trapped in the nested expansions of the recursive calls.

I wonder if the dot not being a default is the right choice. Do we always want to put variables as far left as they will go? Yet, I feel the answer is yes. You need to make locals local, rather than go with another operator that makes them go left. If anyone ever cares about cell, this will eventually be controversial.

I think this would work. The recursive expansion would go right on step 4. But current and output would walk up. The only risk I see is that whatever is inside @ m do could perform a variable capture of sorts and compromises current and output. This could innocently and quickly happen with nested loops. You see there the benefit of keeping an opaque layer where the inner state of a loop is not referenced. But wait: in JS, doing this with free variables, it would work. Why can't it work here? When you define the nested loop, you would simply set those variables in more depth, so that it should work. The only possible variable capture would be with a call that looks for current and output without first setting them. Those could indeed use it. But those calls would be "wrong", unless they meant to do what they do. I'm OK with this. I think the gensym approach is wrong here, because we want the whole thing to be readable! Why did my loop stop? Now you know.

The key to all of this is twofold:
- Setting the two state variables at the toplevel of the expansion of the loop.
- Setting the logic of the loop as a recursive call, also at the toplevel of the loop, that calls itself until it is done.

Why this works:
- Nested loops set up new state variables that don't clash with the old ones. When referencing, @ walks up until it finds something, so it doesn't overshoot.
- The response from the innermost recursive step bubbles up. The `respond` is peeled off by @ do the first time it comes up, for the rest it is just the value of the last sequence, so it works.

As for no initialization of pushing, we need to initialize the state in a way that will be exactly at the toplevel of the loop. There's no going around this. We need to not overshoot, and we need to set it to some value. We could make it to create the list if it's set to "", because we need to set it to something and we do not have empty lists. Maybe "" really represents an empty "everything".

### 2025-10-02

How would the loop be? The idea of the last few days is that, rather than taking a list and generating a sequence for it, then executing it (the macro approach), we have a recursive piece of code that unfolds the loop as far as needed.

This unfoldance would be on both : and =. On = because results would be pushed. And on : because you want to see from where these results emerge. But where is this repetitive logic located? Because it is a step that calls itself.

```
list 1 2 3
= 2 3 4
@ loop do v @ + - @ v
                - 1
       v @ list
```

The interesting one is the second @ here; its expansion, really. But also perhaps its result.

```
            = ??
            : ??
@ loop do v @ + - @ v
                - 1
```

You put the expansion there. Interesting, you're really pushing expansions with that value (v) resolved. What's confusing above is that I write "v" twice.

But going back, the logic:
- Get next element.
- If no next element, return output
- If element, push call to the expansion.
- Get the value of that step you pushed to the expansion and push it to the output.

What about stopping values? If this somehow uses the logic of cell.do, then we don't need to do anything? Wait, we still would need to check. Unless we really write loop in a way that leverages cell.do.

It's interesting that what loop does is to push things to the expansion one at a time. It would need to keep track of where it is, unless it uses the length of the current expansion. That could be a clean way to do it, if there's an elegant conversion for hashes.

Things always get expanded so you need to use the special operators.

Could the loop just push to its own expansion? but you can't control the expansion, you have just one step. Wouldn't this require multiple evaluation? Or put your own call again on the sequence with the next one! Just copy it? but that's not pretty.

### 2025-10-01

You start by writing to the dataspace. How can you compute if the data is not there? That's why writing is first. And the response is also something written in the dataspace. To me, this is only natural in retrospective, but surprising.

How would the loop be unfolded one at a time? With a recursive piece of code that deals with the items one at a time.

Recursion as idempotence: you call the same piece of code but with different arguments, therefore getting different results. In that way, the function is a sort of configuration that calls itself until the job is done; it can do this because unlike a Turing Machine configuration, it can do a few things inside itself.

Macros with ,@ and sharp quote: they are positional, essentially the these macro operators are parenthesis that control replacement. This is positional, because you're counting jumps over parenthesis. What would be a hash equivalent of this (based on text, rather than on implicit numbers?). A bit like a label, unfreeze here.

### 2025-09-29

A tangent: instead of calling it a *reference*, we could just call it a *link*.

OK, let's support a list. First, the data. An example:

foo 10
result @ + 1 foo
           2 10

This is something we could send! It doesn't even need to be a call to @ do! It can just be data, or data with references. You could even send definitions.

- The put will not create a dialog entry.
- Read the value back when the put is done (which is easy, because it runs synchronously).
- Put it in the dialog.
- Delete /tmp-dddd

The above assumes that there is a value, a =. But what if there's just keys, instead of just a call? We could just put the whole thing there. Actually, @ do would not be the default case at all. You could ship definitions over the wire, inlined, but you could also use the existing definitions in context. This is exciting.

In short: we just send data, and because calls can be data, we're sending code to be executed, put in the dialog and then we return whatever was sent. But do we really want the whole thing back? Only if there's just one call. So, if you send:

@ "tome pim"

then you want to get

= "y haga pum"

But, when you send more data, how do we know what is result? You cannot know it. So we just have the whole thing.

Now, in the case of upload, which triggered this:

"- Make it an internal call": we don't need this! We just send the lambda.

So, the endpoint:
1) Takes raw data
2) Attemps to process it
3) Names it with an LLM
4) Sends the call to cell

What's in that call? Two things: put the file in files; 2) put "name" to a link to the data property of the file, but only if there's data.

A very interesting tangent: instead of calling it "reference", we could just call it "link".

Wait. I don't even need special logic for @ and @ put! And I even have the solution for the = vs the whole thing:
- When you get something into cell.call, whatever it is, parse it. If you can parse it as valid fourdata, then put it in a temp location. Wait for it to resolve. Then put it in the dialog. AND, if you return something with = at the top level, just show that in the response.

But how would the dialog look like if you send a list? It would be the list, and its expansion. And if you send a hash? Also the hash with the expansions.

Where would the entrypoints be? Actually, there's just one. No need to distinguish @ and @ put, right? As long as the general entrypoint can execute everything, we're good. This basically means we are calling @ do without any arguments. Lists as sequences without arguments, just as is. And they are rendered nontrivial by the context already present in the cell. This is true lambda, because you can send the context and the call together. It's incredibly libeating, it's all in one place.

- Interface to the entire system: cell.call.
- cell.call takes text as fourdata.
- It always responds with paths.
- If the text is not fourdata, it responds with an error.
- It always puts what it gets in a new, random key in the dataspace. It does it with put.
- When the put finishes, IF the toplevel has a @, then it responds with a =? No, not even, because we want the expansion too! So it always responds with everything. It's up to the editor to see just a part. You basically send a message and get the message back with other things too. Interesting. Makes perfect sense. The waste of bytes is small, unless you're sending in huge messages. But then, there can be a limit and we can abridge things, even quite aggressively.
- It makes sense. cell.call calls cell.put always. cell.put calls cell.respond. cell.respond calls cell.get and cell.do and cell.native and cell.cond where needed.

```
cell.call -> cell.put -> cell.respond -> cell.get
                                      -> cell.do
                                      -> cell.if
                                      -> cell.native
```

The four things that cell.respond calls are: the three essential elements of computation (reference, sequence, conditional) and native calls to provide operations that are given as primitives, so you don't have to create from scratch your primitives for math and comparison. I do wonder what those primitives should be if we wanted to have "lower level primitives". It's probably those copy-and-erase sequences from Turing's U.

Why does cell.call take text and returns paths? Yeah, it should return fourdata text.

Let's coin another term: fourtext.

And respond definitely must do work and change things and have state. But the state is explicit.

TODO:
- Have an unified interface through cell.call.
- Make cell.call return text, not paths. This would also improve the tests readability, perhaps.

### 2025-09-24

What is in an expansion (the :) can also be a call! It could be a call, with its own expansion, and then a response (=) that is then the expansion of the outer call.

Macros are still returning the whole thing. The pattern I'm having in mind is something akin to a turing machine, in that after every step, it looks at what to do.

A way to do this is as a recursive call that responds with one step, then is called again once that step is executed. So it is kind of like a coroutine. Or a continuation, except that the context is already there so there is no need to explicitly pass it.

What is intriguing is that there could be a stack of these things. But rather than a stack somewhere else, the stack is there by going into the expansions. But where would you store this one that steps on things one at a time?

The clear place to see this is a loop.

It might even possible to do it in a sequence too. The part of cell outside cell (in js) would be to jump to the generator of steps one at a time, and then let that one build the next one. Conditionals would have to be built in, but that's fine, because results of conditions are so obvious ("" and 0 are falsy, the rest is truthy) that there should be no doubt.

### 2025-09-22

Thinking of loops.

list 1 foo
     2 bar
     3 jip

loop v @ list
     do ...

Where do can be either a reference to a definition OR a lambda

= 1 "You say: foo"
  2 "You say: bar"
  2 "You say: jip"
@ loop do v 1 = 1 "You say: foo"
                2 "You say: bar"
                3 "You say: jip"
              : 1 = "You say: foo"
                  : v "foo"
                    seq 1 = "You say: foo"
                          @ + - "You say: "
                              - = foo
                                @ v
                        2 = "You say: bar"
                          @ + - "You say: "
                              - = bar
                                @ v
                        3 = "You say: jip"
                          @ + - "You say: "
                              - = jip
                                @ v
                  @ + - "You say: "
                        = foo
                      - @ v

              @ + - "You say: "
                  - @ v
         = 1 foo
           2 bar
           3 jip
       v @ list

(way to define multiple args, how to do it? you can set them as either 1, 2 in :)

If you're putting the steps of the sequences at the numbers, if you put positional numbers, they will be overrwitten! Also, how am I mixing hashes with numbers? No, they are in a sequence. But that means that message(s) can only be named with texts.

I have a problem: v changes value. So v has to be inside each of the steps somehow.

With expansion, 28 lines. Without expansion, 10.

@ loop do v 1 = 1 "You say: foo"
                2 "You say: bar"
                3 "You say: jip"
              : ...
              @ + - "You say: "
                  - @ v
         = 1 foo
           2 bar
           3 jip
       v @ list

Interesting: a reference has no expansion other than its result. How does this work with indirect references?

No, it is like this: inside each step, there is a @, a : and a =. each element in the loop is its own call.

pg onlisp
"A macro call is a list whose first element is the name of a macro."
in this, this is like a function.

in cell, I could just return an @ do. Where is the need to make this a macro? It is in the nonevaluation of things.
Evaluation as the jumping over equals, as well as the resolving/responding of calls.

Interesting that the first macro example is about setq, which is equivalent to put in cell.

In cell, macros will be the returning of functions where the right things are evaled or not in the dynamic definition, then you get the returned def with the proper context and then you just call it and then you get the result. Fully transparent. The only interesting part is that it freezes/unfreezes selectively.

So, basically, cell macros are functions that return functions and have to freeze/unfreeze things in a nonstandard way.
Yeah, commas are for turning off the quoting. It could be @@ in that you jump up one level and resolve right away. but it should not be global, it should only be one level in, so you can have combinations of freezing and unfreezing.

"Commas work no matter how deeply they appear within a nested list"
Yeah, but they have to go through levels of freezing/unfreezing, like stop stop. Perhaps it's @ @, instead of @@. This would make it context sensitive, but is it not? I need to figure out the proper defaults through writing.

"One comma counteracts the effect of one backquote, so commas must match backquotes."
yeah, exactly: levels of freezing with @ do and of unfreezing with @ @.

"Nested backquotes are only likely to be needed in macro-defining macros."

,@ splices things. Do I need this? Perhaps we need a splicing operator. The splicing would be a call in the middle of the thing? Yes, and it would generate its own =, in the middle. then, the engine can "jump over" the value and splice it? Not so sure.

"The object to be spliced must be a list, unless it occurs last."
This is just a speed bump. Just splice the atom and move on. And if it's nothing, don't splice anything. Bend it like redis.

"Comma-at tends to be used in macros which take an indeterminate number of
arguments and pass them on to functions or macros which also take an indetermi-
nate number of arguments. This situation commonly arises when implementing
implicit blocks. Common Lisp has several operators for grouping code into blocks,
including block, tagbody, and progn."
getting a labels feeling here.

I can see now how crippled lisp is by not having hashes (so that everything is annoyingly positional) and also by the fact that it has parenthesis rather than paths to organize nested data.

"To write the body of the macro,
turn your attention to the expansion. Start the body with a backquote. Now, begin
reading the expansion expression by expression. Wherever you find a parenthesis
that isn’t part of an argument in the macro call, put one in the macro definition.
So following the backquote will be a left parenthesis. For each expression in the
expansion
1. If there is no line connecting it with the macro call, then write down the
expression itself.
2. If there is a connection to one of the arguments in the macro call, write
down the symbol which occurs in the corresponding position in the macro
parameter list, preceded by a comma."

"The approach described in this section enables us to write the simplest
macros—those which merely shuffle their parameters. Macros can do a lot
more than that. Section 7.7 will present examples where expansions can’t be
represented as simple backquoted lists, and to generate them, macros become
programs in their own right."

"What we need is a way of seeing
the result after only one step of expansion. This is the purpose of the built-in
function macroexpand-1, shown in the second example; macroexpand-1 stops
after just one step, even if the expansion is still a macro call."
Here you see the problem with this un-self-similar approach. If the process of expansion is the same always, you can see the expansions happening at every level.

"If the expansion contains free variables, you may want to set
some variables first. In some systems, you will be able to copy the expansion and
paste it into the toplevel, or select it and choose eval from a menu. In the worst
case you can set a variable to the list returned by macroexpand-1, then call eval
on it:"
ad-hoc tools and long explanations are great pointers to what you can improve.

"Destructuring is usually seen in operators which create bindings, rather than do assignments."
what's the difference?

"It’s more
convenient to remember what defmacro does by imagining how it would be
defined.
There is a long tradition of such explanations in Lisp. The Lisp 1.5 Pro-
grammer’s Manual, first published in 1962, gives for reference a definition of ◦
eval written in Lisp. Since defmacro is itself a macro, we can give it the same
treatment"

(defmacro our-expander (name) ‘(get ,name ’expander))
(defmacro our-defmacro (name parms &body body)
(let ((g (gensym)))
‘(progn
(setf (our-expander ’,name)
#’(lambda (,g)
(block ,name
(destructuring-bind ,parms (cdr ,g)
,@body))))
’,name)))
(defun our-macroexpand-1 (expr)
(if (and (consp expr) (our-expander (car expr)))
(funcall (our-expander (car expr)) expr)
expr))

"It wouldn’t handle the &whole keyword
properly. And what defmacro really stores as the macro-function of its first
argument is a function of two arguments: the macro call, and the lexical envi-
ronment in which it occurs. However, these features are used only by the most
esoteric macros. If you worked on the assumption that macros were implemented
as in Figure 7.6, you would hardly ever go wrong. Every macro defined in this
book would work, for example."

"The definition in Figure 7.6 yields an expansion function which is a sharp-
quoted lambda-expression. That should make it a closure: any free symbols in the
macro definition should refer to variables in the environment where the defmacro
occurred."

"As of CLTL2, it is. But in CLTL1, macro expanders were defined in the null lexical
environment,5 so in some old implementations this definition of our-setq will
not work."
interesting that the first implementation put macros in a vacuum, whereas the later one put them in the lexical context of their definition. lexical macros.

"The more general approach to writing macros is to think about the sort of
expression you want to be able to use, what you want it to expand into, and then
write the program that will transform the first form into the second. Try expanding
an example by hand, then look at what happens when one form is transformed into
another. By working from examples you can get an idea of what will be required
of your proposed macro."

"On looking at the expansion, it is also clear that we can’t really use foo as
the loop label. What if foo is also used as a loop label within the body of the
do? Chapter 9 will deal with this problem in detail"
would we still have variable capture in cell?

"With the definition of this macro, we begin to see what macros can do. A
macro has full access to Lisp to build an expansion. The code used to generate
the expansion may be a program in its own right."
yeah, this is core.

"There are two different kinds of code associated with a macro definition: ex-
pander code, the code used by the macro to generate its expansion, and expansion
code, which appears in the expansion itself."
man, bad naming, too close together.

"The principles of style are different
for each. For programs in general, to have good style is to be clear and efficient.
These principles are bent in opposite directions by the two types of macro code:
expander code can favor clarity over efficiency, and expansion code can favor
efficiency over clarity."

"It’s in compiled code that efficiency counts most, and in compiled code the
macro calls have already been expanded. If the expander code was efficient, it
made compilation go slightly faster, but it won’t make any difference in how well
the program runs."
none of this in cell. it's all runtime, all interpreted, all dynamic. it's all the same and it all counts.

"Proponents of structured programming disliked goto for what it did to source
code. It was not machine language jump instructions that they considered
harmful—so long as they were hidden by more abstract constructs in source
code. Gotos are condemned in Lisp precisely because it’s so easy to hide them:
you can use do instead, and if you didn’t have do, you could write it. Of course,
if we’re going to build new abstractions on top of goto, the goto is going to have
to exist somewhere."

what would goto be? It would be to jump to a certain item in a sequence, perhaps modifying the context, and skipping the other ones. The way it is right now, this is not possible, if you call, you call the whole sequence. But if you're idempotent, you could call the whole thing.

"Similarly, setq is frowned upon because it makes it hard to see where a given
variable gets its value."

"Macros are often used to implement general-purpose utilities, which are then
called everywhere in a program. Something used so often can’t afford to be
inefficient. What looks like a harmless little macro could, after the expansion
of all the calls to it, amount to a significant proportion of your program. Such a
macro should receive more attention than its length would seem to demand. Avoid
consing especially. A utility which conses unnecessarily can ruin the performance
of an otherwise efficient program."

"If you redefine a function, other functions which call it will automatically get the
new version.6 The same doesn’t always hold for macros."
this is plain bad.

"It has been suggested that all the macros in a program be put in a separate file,
to make it easier to ensure that macro definitions are compiled first. That’s taking
things too far. It would be reasonable to put general-purpose macros like while
into a separate file, but general-purpose utilities ought to be separated from the
rest of a program anyway, whether they’re functions or macros."

"As for condition 7, it is possible to simulate closures with macros, using a
technique similar to the error described on page 37. But seeing as this is a low
hack, not consonant with the genteel tone of this book, we shall not go into details."

"CLTL2 introduced a new kind of macro into Common Lisp, the symbol-macro.
While a normal macro call looks like a function call, a symbol-macro “call” looks
like a symbol."
no need for this distinction, because we just do @ whatever, we don't have to wrap a call in parenthesis

"When do macros bring advantages? That is the subject of this chapter. Usually
the question is not one of advantage, but necessity. Most of the things we do with
macros, we could not do with functions. "

"in a function call, all the arguments are evaluated before
the function is even invoked.
When you do need a macro, what do you need from it? Macros can do two
things that functions can’t: they can control (or prevent) the evaluation of their
arguments, and they are expanded right into the calling context. Any application
which requires macros requires, in the end, one or both of these properties."
1) We can have a call that unfreezes or freezes reference
2) everything is expanded in the calling context already.

"Depending on where the argument is placed
in the macro’s expansion, it could be evaluated once, many times, or not at all.
Macros use this control in four major ways:"

"1. Transformation. The Common Lisp setf macro is one of a class of macros
which pick apart their arguments before evaluation. A built-in access func-
tion will often have a converse whose purpose is to set what the access
function retrieves."

"2. Binding. Lexical variables must appear directly in the source code. The first
argument to setq is not evaluated, for example, so anything built on setq
must be a macro which expands into a setq, rather than a function which
calls it."
the p in put is not evaled unless you put @ inside (interesting case, btw).

"3. Conditional evaluation. All the arguments to a function are evaluated."

"4. Multiple evaluation. Not only are the arguments to a function all evaluated,
they are all evaluated exactly once. We need a macro to define a construct
like do, where certain arguments are to be evaluated repeatedly."
This is because you want to implement loops by peeling the list one item at a time.

"It’s important to emphasize that the expansions thus appear in the lexical context
of the macro call, since two of the three uses for macros depend on that fact."
yep, in context. good, it also supports what we're doing already in general.

"5. Using the calling environment. A macro can generate an expansion con-
taining a variable whose binding comes from the context of the macro call. (...)
This kind of lexical intercourse is usually viewed more as a source of con-
tagion than a source of pleasure. Usually it would be bad style to write such
a macro."
so, no free variables in macros? That's lame. This moral prose around something technical is a red herring for cracks in the paradigm. You either don't put your hand in the fire because it is stupid, or there is something to it and then you should make it not like putting your hand on the fire.

"The ideal of functional programming applies as well to macros:
the preferred way to communicate with a macro is through its parameters.
Indeed, it is so rarely necessary to use the calling environment that most
of the time it happens, it happens by mistake. (See Chapter 9.) Of all the
macros in this book, only the continuation-passing macros (Chapter 20) and
some parts of the ATN compiler (Chapter 23) use the calling environment in
this way."

"6. Wrapping a new environment. A macro can also cause its arguments to
be evaluated in a new lexical environment. The classic example is let,
which could be implemented as a macro on lambda (page 144)."
this one is cool. It could help, for example, to load libraries. except that we don't need much of a macro to do this.

"7. Saving function calls. The third consequence of the inline insertion of
macroexpansions is that in compiled code there is no overhead associated
with a macro call."
this one is irrelevant.

"At compile-time we may not know the values of the arguments,
but we do know how many there are, so the call to length could just as well be
made then."
why would you now? How could you know it at compile time, if you could pass arbitrarily long lists at runtime? I don't get it.

"In earlier dialects of Lisp,
programmers took advantage of this property of macros to save function
calls at runtime. In Common Lisp, this job is supposed to be taken over by
functions declared inline.
By declaring a function to be inline, you ask for it to be compiled right
into the calling code, just like a macro."

"In some cases, the combined advantages of efficiency and close integration
with Lisp can create a strong argument for the use of macros. In the query
compiler of Chapter 19, the amount of computation which can be shifted forward
to compile-time is so great that it justifies turning the whole program into a
single giant macro. Though done for speed, this shift also brings the program
closer to Lisp: in the new version, it’s easier to use Lisp expressions—arithmetic
expressions, for example—within queries."
so it's not just about efficiency, somehow. it's about converting something into basic lisp so that you can then have the basic lisp enhanced when you use it. this hints at something syntactic.

"4. Functions are data, while macros are more like instructions to the compiler."
this is bullcrap (from a self-similarity perspective).
"Functions can be passed as arguments (e.g. to apply),returned by functions,
or stored in data structures. None of these things are possible with macros."
so basically, no funarg (up or down) or direct reference. lisp doesn't have first class macros!
Now, that's something to try: first class macros with 2-3 more operators on top of the base language.

"Debugging code which uses a lot of macros will not be as difficult as you
might expect."

"The closest thing to a general
description of macro use would be to say that they are used mainly for syntactic
transformations. This is not to suggest that the scope for macros is restricted.
Since Lisp programs are made from1 lists, which are Lisp data structures, “syn-
tactic transformation” can go a long way indeed."

"Made from, in the sense that lists are the input to the compiler. Functions are no longer made of
lists, as they used to be in some earlier dialects."

Thinking about how to implement loops that exit early. The length is not known. You could stop given a condition. It almost reminds of a Turing machine, where after each step, you check again what you should do next. Loops could be implemented as its own function than sidesteps @ do completely, but this would be wrong. If they were macros, they could be something that responds with an @ do just for one call, but then again, the expansion would look more nested than it has to be.
Another option, perhaps more intriguing, is that after each step, @ do calls a hook placed by @ loop. it would almost be a continuation: the context is already there.
What is really pulling me here is the toyota notion of no batching, and making it as you need it. rather than generate a loop by returning a sequence over 20 elements, why can't we unfold the sequence one at a time, and have entry points that bubble up? It's about having nested returns that then emit further code. You jump to the next as needed.

You don't have the inner workings of the loop if you do it in js, just the expansion but not why that expansion.

Macros are a batch, they pass over all and return a new sequence.
Continuation is one at a time, very turing like. Expand one at a time.
Would this even work for the normal @ do? Just the keep on going?
I imagine a stack of continuations (because you can't just have one), one returning something that the next one picks up. Then you see exactly why the loop that stops actually stopped, by looking at the conditional that made it stop.
You can still respond with many steps on a sequence. My main concern is the sheer nestedness of the expansions. But this approach would truly show you the expansion all the way down, and the only things outside of it would be the basic logic of reference, keeping on going to the next step and conditionals.
### 2025-09-18

The toplevel in cell has a more literal meaning: it means that you are making calls at the outermost level of the cell, in terms of context path. That means that, from the toplevel, the context path is empty.

Two ways to go about running code through the toplevel:
1: Send a lambda and also a message.
2: Just send the things you want to do, with the messages already built in.

For 2, just send a list.

1 @ upload file ...
           ...
2 @ set p civ2data
        v @ file civ2 data


How would the list be executed?

Before that, why do we need a special command? We want this list to be stored only in the dialog. That's what the entry is asking for. Just put this stuff in the dialog, and expand it.

However, we don't expand the stuff that goes in the dialog. So we need to run it.

A lazy way to do it: put it in a temporary key that is free: wait until all things are resolved. Then copy the result to the dialog and delete the key.

We can do it with just a list! If we send a list, we are going to put it in /tmp-dddd. Then we wait until things settle. Then we take the entire list (together with : and =) and put it in the dialog. End of story.

- The put will not create a dialog entry.
- Read the value back when the put is done (which is easy, because it runs synchronously).
- Put it in the dialog.
- Delete /tmp-dddd

Fun stuff: this list can even refer itself, without you knowing where it is in /tmp-dddd. You can actually do anything! You can define calls, do a lot of things, and it will all just happen. It's just another mechanism for running code that's the same mechanism as everywhere else. If you put an access mask around it, you have remote code execution, really. This is because sequences are lists. So, if you send a list (without telling me to put it anywhere) we are just going to run it. If we get an error, we stop, but that's also a value.

Unrelated: when overwriting an object in a loop, you see the expansion. but if the object is now changed, where would that be held? don't you lose it once it updates? Ah, no, it would only be "erased" if you set the output back to the input! this is an interesting way of removing your traces. if you program functionally in that you don't update things, then you will have the expansions. if you overwrite things, then on the circular loop, the expansion will be gone, assuming your modification is idempotent. and if it's not idempotent, it will either crash or runaway forever. So, overwriting means forgetting. If you keep references to the old things, then you will have the expansions that brought you there.

### 2025-09-16

Files can be stored at <cell name>-<file name without double dots (remove the first) or slashes/backslashes (outright remove them)>

Cron can be as simple as a call that happens every n time, and it also goes through the dialog, although the `from` is `cron`.

Cron can delete the dialog (or parts of it) for cleanup every N time, or move them to files and outside the dataspace. This would be a sort of log rotation.

I wonder if just seven toplevel keys (removing the editor, and putting it on the localstorage of the browser rather than saved on the cell, so that if you have multiple contributors they do not step on each other's toes) would be enough: access, cron, dialog, endpoints, files, rules, views. ACDEFRV.

For email: to have cell+cellname+someotherthing@altocode.nl could work. You could then have it sorted per cell and per call inside `endpoints email`

There are echoes of B.log in the dialog: every event (call) goes in there. The state is still kept as a snapshot, but you retain history if you want.

Access levels: read, append, write. Can be masked by prefix.

### 2025-09-15

Interesting that deleting the history is just deleting the dialog. But you keep the rest of the state. You just lose the history of how you got there.

Maybe I should move the cursor to localstorage.

The dialog should not expand! It should remain as is. It should be literal.

You interact with the language through its toplevel (cell.call). The toplevel is not just for a console, it's for everything.

Do we want to call cell.upload from the toplevel, from cell.respond? Or should that function call cell.call? No, the latter is backwards. We'd have multiple entries in the dialog with one "real" outside call. So we need to call arbitrary calls from the outside. I want to call @ upload file ... and this should really map to cell.upload.
Those are native mappings, so to speak.

Do we generate an id for the file if we save it somewhere else? Or do we just keep in in the dialog? No, it has to go to filespace! We'll use the name of the actual file to reference it from dataspace. There can still be an underlying id.

### 2025-09-14

Automatic trace id per call? Or just see the expansions? The expansions should do it.

When you only rerun what you need, there's way less logs/data being made anyway. Compare this with a normal runtime, where everything needs to be recreated so that you can hit the same bug.

The development process: do, verify. Even if ai does it, humans want to verify. And eventually (or perhaps soon), even ai can verify. But cell can make it easier for humans/ai to perform, because of how it encapsulates context in paths.

When doing LLM prompts, allow it to think things through and then return JSON at the end (with the call). Give it breathing room to work, E squares. We all need E squares. Let the LLM figure it out, then write the command.

The tools for working with data are still not great. I use vim which helps a lot, but there's so many obstacles. no good data representation, no good editor that is also programmable. this is where cell comes in.

hypothesis: you cannot build a hard consistency system on top of an eventually consistent system. but if you combine cells over the network, you can do eventaully consistent.
at the same time, cell is very consistent in that it retains consistency and cannot do without it.
if you want inconsistency or eventual consistency, split it into multiple cells and let them talk over the wire! **a cell is a unit of consistency**.

Masked diffs for views! You have access to a certain part of the dataspace, and you just call @. You have an access mask that filters out some data. Then, you don't need a mapping. You can just use the paths of the cell, but only access some, and you avoid the typical API mapping boilerplate.

Economics of cell:
- Free: cells deleted after 7 days, cell limit is 1MB dataspace, 10MB filespace.
- 100 to 1 ratio for big/slow/cheap. it's 1 cent per gb for disk (filespace), and 1 eur per gb for memory (dataspace).
- Paid plans give cell retention for >7 days, as well as cells of up to 1GB dataspace (with unlimited filespace up to the global limit).
- 10 bucks per person per organization. 10 bucks gives 10GB dataspace/1TB filespace.
- Organizations pool their space, as well as families. For families, dependents can create accounts for free and share in the space.
- Small organizations (<5 employees) can just use one account, or personal accounts.
- We reserve the right to enforce licenses. The idea is to only enforce established, profitable companies that are using cell and shirking paying for the licenses. Structural leniency towards individuals, early-stage startups, academia and non-profits. And even when enforcing, always be reasonable.
- The pricing model as a low, sustainable cost of digital infrastructure per human. An alternative that allows to pay for it without giving away our digital rights to companies or governments.
- The entire non-infrastructure cost of developing cell comes from the space not used by users. If everyone maxed out their dataspace/filespace, we'd have no margin. This sets incentives between user and company at odds. But, variable pricing is very unattractive. Being open about it is probably a better plan, definitely at the beginning.
- Infra costs: 50 buck Hetzner servers give you about 50GB of usable RAM and 5TB. That means that 1 buck gives you 1GB of RAM and 100GB of disk. The problem here is that there's no duplication in disk. We'd actually need to at least duplicate filespace (especially since dataspace will be backed up in filespace). Compression and deduplication of files might help here.

An api gives you portability. that means that you get something equivalent at a level, but below that level you have different things. that's like a language, or an interface.

logo for cell: a = and then a @ below it!
```
=
@
```

we can have references bound to time, to avoid updates. @ is implicitly @ latest. @@ could refer to a time. let's use time, and we can also refer to an entry in the dialog.
entries in the dialog: add a noun after the timestamp, that's the id!
files: reference the data of the file! instead of copying it over. the parsed goes in as an input to the call, as `data`, only for those that can be parsed. also have images, which is an example of something not parsed.

for folding: have a cap of how many rows and cols, and if you go over that, autofold whatever goes over that by programatically setting it. it is hardcoded and not dynamic, though. better would be to have an autofold property that then can be overriden, then you'd need to store the unfolded ones.

If you send @ do to cell at the toplevel, we are going to call that for you. why would you send a lambda/call if not to call it? And no need to prepend this with @ call.

The entrypoint to the entire cell (or should I say the interface) is the dialog. This is where things that run from the toplevel go in. Perhaps we could even have crons entering through the dialog as well, so you can see them happen. It's like unidirectional data flow in a retained mode UI: any change coming from anywhere goes in in the same cycle, through the same door.

This means that the entries to the dialgoue need to be done by cell.call. Take them out of the server.

It's pretty cool to be able to send lambda calls that get executed (IIFEs) over the wire.

You can then send three things through the dialog:
- Put
- Do (sequence that gets executed)
- Normal reference (to anything)

The language is like a service. For every call, there's a notion of time, a notion of who/identity.

### 2025-09-11

Let's make an assertion notation (executable) for expressing the structure.

Problem: we make a call that makes calls to put. For example, upload. We want to see the top level of the call, not the expansion. The expansion could be expanded if we wanted.

This means that upload should be a call. A system level call, a cell level call. It then calls put as part of its internal process. It can rely on JS for parsing but at least the mechanism of updating the dialogue and other parts should be internal.

Maybe this is even better than showing a diff. You see the expansion of each call you make, if you want. Although it would be cool to see diffs. Perhaps, the diff viewing can be another call. You pass two different moments (calls) and you get the diff in the middle! diff can be a call!

why file is a call? because it is stored as binary. you could infer it on the client.

### 2025-09-03

With cell functioning in a live system that performs chains of calls to outside systems, the finish of one call would trigger the next one (through recalculation, plus a conditional fence that doesn't activate until the previous is done).
And what's a bit mindblowing to me is that you can have diffs on the internal state of the system. You have perfect visibility with no added tooling, simply because all state is first class already.

When refreshing the cell, just ask for the diffs between the version you have and the latest one. Then, apply them. A further improvement would be that the server would give you a condensed diff, with only the necessary changes from where you are to the latest, without having to pass through intermediate things that have been in the meantime overriden.

`@ is` is a good call for assertions.

puts don't have expansion. They just add stuff. If our calls are puts, the expansion should be the diff.

### 2025-09-02

The approach of cell inside a JS/gotoB view function is absolutely tenable. The view only has to return html, and we can do that by returning something that maps to lith (a way that gotoB uses to represent HTML).

I also like the representation we used for HTML here in cell.

    <section id="catalog">
      <h2>Book Catalog</h2>
      <article>
        <h3>The Great Gatsby</h3>
        <p><strong>Author:</strong> F. Scott Fitzgerald</p>
        <p>A novel about wealth, love, and the American Dream in the 1920s.</p>
      </article>
      <article>
        <h3>1984</h3>
        <p><strong>Author:</strong> George Orwell</p>
        <p>A dystopian story of surveillance and totalitarianism.</p>
      </article>
    </section>

['section', {id: 'catalog'}, [
   ['h2', 'Book Catalog'],
   ['article', [
      ['h3', 'The Great Gatsby'],
      ['p', [['strong', 'Author:'], 'F. Scott Fitzgerald]],
      ['p', 'A novel about wealth, love, and the American Dream in the 1920s.'],
   ]],
   ['article', [
      ['h3', 1984],
      ['p', [['strong', 'Author:'], ['p', 'George Orwell']]],
      ['p', 'A dystopian story of surveillance and totalitarianism.']
   ]]
]]

section id catalog
        _ 1 h2 _ "Book Catalog"
          2 article _ 1 h3 _ "The Great Gatsby"
                      2 p _ 1 strong _ Author:
                            2 "F. Scott Fitzgerald
                      3 p _ "A novel about wealth, love, and the American Dream in the 1920s."
          3 article _ 1 h3 _ 1984
                      2 p _ 1 strong _ Author:
                            2 "George Orwell"
                      3 p _ "A dystopian story of surveillance and totalitarianism."

the HTML and lith versions have 13 lines. The cell version has 9.

Well, this looks clean! The only thing that is a bit more clunky than lith is to have to mark _ when you have content, to disambiguate the content from the attributes. But we can still have lithbags (mix of literals and elements) at the list level.

Maybe we shouldn't draw data grids on the right.

I should be in a hurry, but am not. Let's see if we can make the dialog more pretty.

I'm backing up the cell because the other day, the lack of queuing in saving the cell corrupted it and I lost it. And this is a good example of a dialog.

I'm going to stick with "dialogue", at least today. That spelling looks good.

White background is bad for the soul.

Things that are floating around in my mind:
- We need to return the diffs after calling put.
- When calling higher level calls that in turn call put, do we also associate them with that put and the diff? If so, how? If there's a concept of transaction, then it should be passed as part of the call. Or would it be a parallel path, like the second forth stack?

chatgpt: "Many looping constructs (DO ... LOOP, IF ... ELSE ... THEN) use the return stack internally to manage control flow."

I wonder if this manipulation is how you get macro-like behavior in forth. Apparently, that's only one way of doing it, then the distinction between immediate and compiled words give you the rest.

Next:
- Paste some data and don't even hit submit, that already gets it going.
- The upload is like that too: select the file, and as soon as you come back, it's uploading and then done.
- Then we can remove the upload from clipboard, since it's confusing to have two things. Also, we make it more about the textarea.

### 2025-09-01

When in the publishing tack, suggest making dashboard, or form, or table, just with the click of a button (UI inferred from DSL from the LLM, which comes from a hidden prompt).

Why do I write tests as instances, rather than in their generality? I would say that writing a converter form one to other would be to write the implementation/logic. But would it really be that? Is there a way, at least sometimes, to generate inputs and outputs without actually doing the implementation? But then, why would you need the implementation?
What if instead of generating it, you could determine properties? Or you could assert on properties. You'd still generate inputs. Then you could assert on properties of the output, but not fully specify the output. That could work.
What would be good about this is to write tests at a higher level of abstraction, while still being able to see them concretely. Write the generator of tests. And the relationships of inputs vs outputs, but without specifying the entire thing. This would be a true specification, instead of just a bad copy of the implementation.

Interesting angle: keep secrets in cell, but don't expose them in the frontend. you just expose calls and the frontend makes them. in the implementation of the call (or a reference it makes) you can have the secret.

For search: list distinct paths abridging parts, that's a cool one. the llm fires deterministic shots to compact the data into patterns, just like us humans!

### 2025-08-30

Basically, this week has been tough because, although I am very happy about how the editor is coming along, and how useful it could be to me and perhaps a few others, I have to admit: it is absolutely killing me to feel that nobody around me, most of them well-meaning, encouraging, smart people, nobody gets really what I'm doing. The gap is just too large. And it's been like this for a long time, not just with cell, but with essentially every project fully of my own that I choose to do.

This is not a hobby. This is my best work. My most general contribution.

So, how could I make bridges between what I'm building and others, in the sense of making something that could *actually* be useful to them, tomorrow?

And this rush is not because I need to fund, grow and sell the company. Some other day I will get into dissecting why that particular path is not for cell or altocode.

This comes from a need for this project not to be isolated from the rest of humanity. Starting with those humans around me. I'm not expecting to make everyone use cell, but if a few of those I come across don't even understand the point, then I'm failing them, and I am failing my own mission. Full stop. No comforting line of thought of "this will be understood in X decades" makes sense here. It would sure be nice to do something quite timeless, and I hope for it, but it has also to exist in the near present, in the minds of others, as something they can *use*.

What are the entrypoints for others into cell? How could they make it work?

I thought of a few things. The first is pasted below: let people create UIs from data, right away. That could be entrypoint #1: create UIs from data.

UIs from data, example:
- You paste some data from a spreadsheet with sentiment data.
- You create a dashboard out of it with chatgpt. You get the link right away, and you can also see it wysiwyg.
- You can password protect it too.
- You can make a form to submit entries too.
- Those entries are checked for sentiment by chatgpt.
- Then you can make a table to see things, with sorting and filtering.

It would be basically starting with the interface, all interface. The analysis and the API can come later.

The dashboard as an entry point. The same than back of the envelope financial calculations was that for visicalc.

I also think that UIs are mostly made of three things: dashboards, forms and tables. With some base models, plus a LLM, we could generate them dynamically from data. Two things are going to be tough and great to make: 1) a smoooooth experience where you have some data and a need and a browser, nothing else; 2) the implementation of a SPA in that link, in a way that it polls data.

The other entrypoint I'm thinking of is #2 send calls to APIs to figure out what data they return. Instead of postman, you go to cell. This would require our server to do these calls because CORS would kill us otherwise.

Another entrypoint: you don't share anything with anyone through interfaces, but you figure out data and organize it. But that's too general, too programm-y, to be what I'm looking for. Or perhaps not, but I need way more language for that, or more editor. Definitely more editor. And way more skill. Although... that assumes you'd do that yourself. But, like with the UIs, the LLM could do that for you.

(Side note: it is interesting how LLMs are also overwhelmed by data and need to run queries with code, just like us, to get a few data points. Like firing photons at a large object to get an outline).

(Another side note: what a strange and great thing it is to work with software, with computers. Even if it doesn't work, what a ride it has been so far.)

THe figuring out things entrypoint is also interesting. It could be API calls. It could be some messy data in a spreadsheet. It could be data in a relational database, for which we'd require a read connector.

To figure things out, the LLM should have some good tools to slice and dice data. Or rather, to query, filter, count.

Before we go: we could really outline these two scenarios as both sides of the use of cell, *in general*. Publishing and thinking. Yeah, I like the scientific angle. Because, at its best, whatever it is that we're doing here, with data, it can only be scientific.

Instead of publishing, sharing? No, you can also share your thoughts mid-way. Publishing is about being ready, or showing your ready side. Es la careta. And it has its place, it is as essential as the other half. You want that form to work. You want the dashboard to show reasonable data, to help you in an emergency, or to sound the alarm if there's one. We need that. And we also need the darker, freer space to think, to muse, to have rougher edges and unexpected connections. That's the space of thinking. Perhaps it is pondering. Yeah, pondering. Because you also think when you publish. Pondering is about taking time, going deeper. It is internal.

cell for publishing
cell for pondering

Not bad. This goes much deeper than saying API vs UI, solo vs social. Because it reflects the state of mind of the human(s) using it for something. I can almost see two columns, one in black with white text, another one in white background and black text, saying For Publishing and For Pondering

cell for publishing:
- Bring data from anywhere: Excel, API, DB, even AI.
- Create a dashboard to share the key points.
- Add a form so that others can share more data.
- Create a table for collaborators to analyze the data.

cell for thinking:
- Bring data from anywhere, or just start writing.
- Write powerful queries to understand data.
- Establish rules to clean data.
- Work with code, prose and data in the same place.

If those tables could have some pseudo-pivot tables (really, cell queries below), they'd be already half as powerful as the editor, but with way less surface.

Nah, pondering is too pompous. Let's go for thinking.

I like this.

OK, let's go with entrypoint #1: publishing. What do I need to make this happen in cell?

- Better upload of files: upload csv, xls (multiple sheets), upload json, paste csv, paste json
   - Make it through a cell call rather than a separate API endpoint in the service.
   - Store the original file in `files`
   - Peek at the data with a LLM to detect the type and get a good name to place it in the dataspace
   - Parse it deterministically
   - Goal: from input to data in the dataspace, with a nice name. Click on either upload (uploads right away) or paste+send.
- DB: will anyone be crazy/trusting enough to give us credentials to a relational db? perhaps.
   - We'd just have to get the type of db and the connection details, and then make the test call.
   - Then, we list the tables and get the schema, and get 10 rows of each, and put that in the dataspace.
   - We need to forbid the LLM from sending any updates, we could even filter them out deterministically because that's a disaster waiting to happen.
- API:
   - Make calls to third parties, the LLM can ask you for the details.
   - Put the result in the dataspace, with a LLM provided name.

- Create views:
   - By default, put them in views. Later, if you want to define outside, you can, and then you just link.
   - Each view has a path and it has a content. The content is a call that can make calls to other parts of the dataspace and it draws things. But really? I don't think so: you want a SPA, not the full cell. But that means that you need to expose an API.

Do we allow "raw access"? I think this is too much. Especially for iews like form, where you only want to share the rules. You cannot just let anyone access the entire cell.
What stands here in the way is the relationship between an APi call and a cell call.
Perhaps this could be the key: you let any calls in, but then you see how you serve them. Instead of definining custom API endpoints (which you can, later), you can use the main endpoint of the cell, which is a POST. You POST to a cell, a cell call. And (here's the key), you can expose things in the API section. Well, not in the API section. There should be another part of the cell to manage access.
If you grant access, they can get the stuff straight. or even put it.
Three levels of access: get, push and put. Put can wipe everything, it's like admin except that perhaps it doesn't have access to versions? But that's also a path! The key is that access is also at a path level, or rather at a prefix level. get and push are independent of each other. you can have both. and put includes everything.
For validating the form, you can grant read access to rules whatever. Then, the LLM can write code that sends calls from the client, and the server just serves those calls.
So it's also cell calls at the API level. The data interchange format is simple: fourdata as text, or fourdata as json. Perhaps it should be text. Am I emotionally ready to leave JSON? Perhaps. fourdata on the wire looks cleaner to me than JSON on the wire.
Getting rid of the work of writing mappings between http api calls and cell calls is key. You should be able to make cell calls from the client and get stuff back.

So, architecture of a frontend built by cell that is not the editor (and even the editor could be one of this, eventually):
- Loads up the core cell.
- Talks with the server using the id of cell and eventually passing cookies.
- Gets back data as fourdata, can parse it to JS.

Now, I am not yet going to rewrite gotoB (my frontend library) in cell. And, in any case, we need to run things in JS. So, how do we do this mapping?

- We have views, with one general view containing others.
- The views have dependencies on the state. These states come from queries.
- So there has to be a link between a place in the state and a cell call.
- And same goes for writes, although the writes are not to the state (well, in tables perhaps yes, for intermediate state and also perhaps for keeping state of the query). The writes have to become cell calls.
- Or, I could be lazy and just make the view depend on the entire dataspace. Not the entire dataspace of the cell at the editor, *but of the cell that the client gets* when it makes a @ get for everything. So, get will bring different subsets for different agents. It will bring less stuff, but it will bring all of it. No need to also do the bureaucracy/boilerplate of making n calls to get n pieces of state. Just give me what I need, all of it, and update it often enough.

Yeah, so, the frontend does a get every second and gets whatever it can get, and based on that, it redraws everything. the views depend on parts of the dataspace, the way it is organized in the cell itself, and this will just work beautifully. it can just be a subset. this could work for small applications, at least. when you need more, we'll see where it breaks.

There has also to be a bundle of gotoB + tachyons + cell. We can load this up in an iframe too to get the wysiwyg. And shrink it to 400x400 so you can see a scrollable preview, or perhaps even better a zoomed out preview that fits to screen that you can expand. Imagine writing a frontend without switching tabs or applications. For me, it'd be a first.

- Dashboard widget (prompting, really).
- Forms: you can define rules on data.
- Table widget (with sorting, pagination and filtering).

### 2025-08-28

How to create empty space? In a spreadsheet, the space is already there. That's usually not great, but it gets you started. Also, marginal note: in a spreadsheet, everything looks like an input. In cell, there's one place at a time that you are editing, the rest looks non-editable.

Also, another idea: when you are in a prefix (you are the cursor), dimly highlight all the paths that have that prefix.

It feels like operations are not on paths so much as on prefixes, which are left subpaths common to many paths.

And, if the cursor really selects a prefix, rather than just one path (just one line), you have automatic, almost explicit selection.

Thinking about tables: it would be great to see some data as regular tables. A table is really a list of hashes, where each row is the data of the hash, and the columns are the keys of each of the hashes (hopefully the same columns for all hashes). But this cannot be the core way in which we see the dataspace: nested tables are incredibly clunky. And, if you have a hash of hashes, it's two tables with one row each, one inside the other. It's not an efficient way to use space.

Lessons from visicalc:
- Commas for numbers.
- No shift or control keys.

Fold/unfold should work at any level!

### 2025-08-27

Ideas for implementing jumping around with quite some data (>100kb):
   - When scrolling down or up to put the cursor back on screen, have two "doors": areas of the screen through which the cursor appears. These should be near the top and near the bottom for y scroll, but not at the bottom or top. So, if you scroll down, don't suddenly put the cursor at the bottom (just a little bit, like the spreadsheet) or at the top (like a paginated jump), but towards the bottom, like a little jump that shows you the context of the cursor. Same with going up, instead of putting it completely up or at the bottom of the previous "screen", put it close to the bottom but not fully. So, basically, like spreadsheet scroll but with a buffer. More "arcade".
   - When going left or right, the logic should be the same.
   - Also, when scrolling, make sure that the far edge of the cursor is in. If scrolling up, take its bottom; if scrolling up, take its top.
   - When moving around in the screen, retain the scroll position, even if you go to a cell that's fully on the edge. I was going to say don't let cells to be cut by edges but that would remove the continuous nature of it, so never mind. But if you jump to those cut ones, they should be brought back into focus by the mechanism above. Perhaps, rather than a fixed margin, I just need to look to see if things are fully on screen.
   - How to redraw efficiently? Estimate how many paths can be shown on screen at one time, and keep 3X drawn on the DOM (the one showing, plus one buffer on each side - this does feel like an old game). The cursor gives you the offset. You still redraw the 3x, but it's perhaps 100-120 paths (600 divs or so) rather than tens or hundreds of thousands. That should be fast enough. Computing the position of the whole thing from scratch would be very heavy, and so would be putting the paths on screen to see how many fit; better to go with a good guess based on the screen parameters.
   - If this works well, we can put up with cells of up to 20-50mb in modern browsers in laptops. That would push the need for a thin client with constant server querying quite farther in the future. There's a lot of use to be had if we can deal with up to 10mb of data already.
   - How do we deal with the scrollbar? Do we get rid of it?

It's not "move around", but "find". You find by moving around, by searching and by folding/unfolding.

Undo and versions are part of making changes. Also a bit about finding, but mainly about writing. Also, it's "writing", not "making changes".

On search:
   - With the search box being text, we can still leverage paths: you're querying paths. If you enter `status 200`, you're looking for two contiguous steps. If you want them to match against only one step, then enter "status 200".
   - Assume partial match rather than full match, that's way more useful as a default.
   - Wildcards stand for any value of a step. A double wildcard stands for any value on one or more steps between those two, but not zero of them.
   - The question is, how do we go further? Because going further is basically code. You could presumably write a search in fourdata and you'd get the result. A sort of lambda query that then you could save if you wanted. This hints at having an area to store queries/searches.

Ops that are implied in the editor: saving (because everything is saved) and running (because everything runs continuously).

The editor is the interface to the language. The language is the interface to the service. The service is the interface to the database, but not only that (http, email). See it as vertical boxes supported by pillars between them.

It is key that outgoing calls are also in cell, not just the results but also the doing of them, from a service monitoring perspective. Abridged data has to be present in an admin area for abuse monitoring. Same for rate limiting: this data should be in cell and the ops should be efficient enough to actually support the real operations.

Cell engines (dbs):
- Disk
- Redis
- Postgres

Types are really properties, in the sense of property-based testing. Was thinking about this in the context of making the language tests more general: you could say <text a> and <text b>, and it could be embodied/executed by running the test n times with two different texts. For testing on properties, we need generators, and those can be either deterministic or random. In any case, the tests stand strong. I have to bite the bullet and add tests for the editor.

Fun discovery: when going up, down and left you can jump sometimes. When going right, you either move one or you stay in place because you're already at the edge.

### 2025-08-26

Logged like 3mb of data into cell today. Fourdata shows it cleanly.

At the same time, made me think that with a few mbs, the client will be unusable, and I need to query the server per "screen", so we can scroll and jump up and down. That would be quite a feat. And I need it to be continuous. And not in a plain text file.

And sending many almost concurrent requests basically broke it. I need to implement a queue per cell so that the fs.writeFile don't step on each other.

It really feels like programming the editor is like programming the movement of a game. A boring one, perhaps.

### 2025-08-25

 Add a diff in the cell, which can be coupled (but not inside) the dialogue. Add timestamp entries (the sortable, iso kind) plus -NOUN-NOUN, so we can recognize it. Store the diff as a set of - and +, perhaps using Myers.

Add wipe and edit commands, to modify things beyond get and put.

wipe takes a prefix. it can actually be wipe 1 in the put, instead of v! sure, but let's add wipe as a shorthand.

Start with everything showing, then hide at a step. when hiding at a step, hide everything after that prefix. to expand, go to the frozen and click enter to unhide, the frozen shows (...), without a number.

How would the diff look? we have calls and some of them generate diffs. we need an universal diff: - and +. Can do it per line, but it's better to think of it in terms of paths. there's a condensation, if you rename a prefix that has a lot of paths. then, you'd like to just see that rename. but isn't that too short? Perhaps you do want to see the call, there you see the rename, and then you just see the diff line by line, but with that github thing of highlighting what's different in the - and +. Some calls have diffs.

Mute calls are not shown in the dialogue but they should be in the dialogue.

Do we include the diff in the call? we link them. calls need a time and an id. the id should have also the name of the cell, so things can be portable.
in the diff, do we skip the : and =? I think not, you want to see how results change!

Show diff as cells but with some extra markup that will later be added as a ui macro.

Show graphical things built in in the =! as a 400x400 (adjustable to the screen), for example graphs or images. it's right there! you can see feedback from your text changes directly in the graph.

For edit: what about merging? do we allow it? Do we overwrite the old or the new? We pick a good default: auto merge and overwrite the target with those that you are renaming (if not, do it the other way around).

If you have foo bar 1 and foo jip 2, if you edit foo, you're editing all the foos. If you don't want to do that, you have to do a copy to a new name. You're basically editing on all prefixes, not just one, by default.

Implementing sublinear cell in redis:
- Consider each step to be represented by four things: an id, a value, a position (1, 2, ...) and the id of the parent. For example, the "bar" in foo bar would have value bar, position 2, and the parent id would be that of foo.
- What about naive indexing on redis? Take each column (row) that's not an id and make it into a set. For example: value:bar would be a set of all the ids (of steps) that have as value "bar". Or position:2 would be a set of all the steps that are in position 2. And children:ID would be the set of all the steps that are children of the step ID.
- The deeper idea is to sets like masks. I'd love a prefix mask where shorter and longer elements that have similar prefixes match, and this would be done inside redis without having to go to the Lua script.
- Example: look for "status 200", where those are two distinct steps, one next to each other. They are at any position, so ignore the position. You would start by looking those ids with status, then get all the 200 that have each of those ids as parent, then intersect for a result. I'm itching to find a pattern like that in Earley's parser where you "combine like subparses". Rather than starting from a point, you go through each of the search terms in parallel, gathering subresults in sets, and then you intersect until you get all the steps that match. Then, you linearly reconstruct the paths from the ids.

There's the "jumping search" and the "compacting search" -- the latter only shows you the paths that match your query, but without context except for the prefix. The jumping search shows you the whole thing and you just jump.

By default, things should be expanded, the cursors will help you jump around, because going down at level 2 should take you to the next distinct value at level 2!

#### 2025-08-20

General UX use cases for cell, they are three:
- Querying data:
   - Level 1: simple lookup of one value (linear read, read "next to it")
   - Level 2: lookup of one value involving query
   - Level 3: getting multiple values and processing them
- Writing data:
   - Level 1: putting structured data in without validations
   - Level 2: have validations that don't let bad data in with proper messages
   - Level 3: allow data in in a purgatory stage and then be able to do cleanup in versions
- Programming:
   - Level 1: references, native calls, conditionals, sequences, loops, errors
   - Level 2: macros
   - Level 3: integration with JS
- Orchestrating multiple threads:
   - Level 1: do things in parallel
   - Level 2: limit throughput
   - Level 3: error recovery (retry, give up)
Channels for each of the uses:
- 1: API
- 2: UI
- 3: editor

### 2025-08-14

New thought, coming from yesterday's session: in building cell, so far my metaphor has been to make data visible (well, at least some of the time; sometimes I focus on making programming like writing, because natural written language is very habitable and software desperately needs habitability).

If we have evolved from simians, we are made to work in a physical world, and are endowed with great visual cortexes, to find bananas we can see. If we can directly see data, we can engage a great deal of our brain in it.

But we also need hands. That's why I'm working on the editor. Because I feel that text editors, even powerful ones, limit us in levels of scale of jumping around, grasping, seeing, being able to do things with what we get so that we do something else.

I see cell as a tool for hand eye coordination when working with data. ChatGPT calls this "proprioceptive".

The hands we have with current editors (where text is inputted linearly, and doesn't usually offer levels of scale for jumping around) are daft. We have to copy and paste things manually, and the formatting breaks. We have a ton of data in a terminal and we cannot query it, or compress it, or search it. This is as much in the hand as it is in the eye.

Rather than a grid of turned off inputs like in the spreadsheet, just see data (no empty boxes, just meaning) and then move around and make it an input if you're editing. but almost nudging you to go out into normal mode and jump around. Jumping, like a game! Text suddenly has levels of structure that you cannot only see, but also manipulate (by, at the very least, changing your position (there's always a fovea, a "here I am"), then later more advanced manipulations).

Never mind: the cursor is not the eye, is the hand. And we have two hands, potentially even more. So we can have more than one cursor, optionally (start with one, but don't limit it to one). Then, if the cursors are far apart enough, that determines multiwindow automatically. Then you don't have to manually set windows to then have the cursors on them. It's like your eyes: they go to where your hands are. This is all directly inspired by the analogy of a monkey looking for bananas in a tree. And cursors are stronger than marks (in the vim sense).

The jumping around is key, I think play is essential and jumping is playing. We need to jump from datum to datum, like monkeys from branch to branch, but with levels of scale. ChatGPT says this is a "semantic parkour".

The textarea/input has too little structure! Herein lies a great opportunity for innovation.

Unrelated, but two more concepts:
- Errors as mere stopping values that bubble all the way up until the initial caller OR an error handler.
- Side effects as changes in the dataspace that are not in the response value. If something more than the = belonging to the @ of the call is changed, that's a side effect.

Two more:
- For solving the ascending funarg, I think we already need macros. Because any references from the sequence that you are responding won't be resolved. Although you could also ship it with some context. That would be a non-macro way to solve the problem, just ship context, ship scope. Basically, ship some data together with the definition, to be stuffed at :. That could work.

## General TODO

### Demo

- Language
   - Fix calling an alias (the expansion gets removed somehow, then the sequence is placed on a colon at the top)
   - Use missing results rather than existingValue === newValue to make updates. That is, remove results when a transitive dependency changes.
   - Test no-op put (that returns empty diff) and then execution continues
   - Skip over equals in put
   - cell.respond
      - Add dependents/dependencies to only recalculate what's necessary.
   - @ if
      - Pass lambdas in do/else
   - @ do
      - sizzbuzz (single return fizzbuzz)
      - html generation/validation
      - allow for multiple args (destructuring of lists or hashes) and no args (the sequence just there)
      - test two step calls
      - test stop
      - test nested calls
      - test recursive calls
      - test descending funarg (pass function)
      - test ascending funarg (return function)
      - Loop
   - cell.call
      - Single entrypoint
      - Convention: if you send a lambda (@ do) over the wire, you want us to call it.
   - @ catch
   - cell.native
      - count
      - sum
      - duplicates
      - push/lepush (left push)
      - pop, lepop
   - @ ask
      - ask path surrounded by implicit stars
      - ask path that can have a sequence (or a reference to a sequence) OR a validator
- Upload: upload that stores the file in the dataspace, as well as the data
   - Send a lambda call that does two things: 1) upload the file; 2) if data is not empty, set a link to it somewhere in the dataspace (name suggested by the llm).
- @ rule
   - type
   - equality
   - range (for numbers): >, <, >=, <=
   - match (for text): regex (more verbose and readable format for regexes: More open regex format with lists: literal, character class, backreference or lookahead)
   - any other logic, really, the full language is there
- @ view
   - Serving the view
   - HTML generation
   - Auto-wiring of api calls to the messages that the views receive, as well as the references they do higher up.
- @ api
   - Register api calls
   - Serve api calls
   - Send api calls through the service

### Publishing

- Bring data from anywhere:
   - Fixed prompt to ask you to enter data
   - Modes
      - Clipboard
      - Upload
      - API
      - AI (bring public data or invent sample data)
   - Parse
      - Spreadsheet
      - CSV
      - JSON
   - Ask AI to name the output
   - Save the file and have a reference to it from the cell (the metadata is in the cell)

- Prompt the making of a dashboard, a form or a table, with some buttons

- Dashboard (first view):
   - Set view.dashboard to

view dashboard @ do dataspace 1 div class main
                                    _ 1 p _ 1 "Foo is"
                                              = 1
                                            2 @ foo
                                    _ 2 p _ 1 "Bar is"
                                              = 2
                                            2 @ bar

- html with tachyons, gotob and cell
- bootstrap js that does the following:
   - gets the entire cell (the id is preloaded)
   - gets the view that it is in (the view name is preloaded)
   - gets the contents of the view, which requires evaluation
   - convert them to lith
   - puts a reactive view that depends on the dataspace (contents below)
   - put this function inside the reactive view
- Query every n seconds to refresh

- For the form:
   - Validation which defines rules

- For the table
   - Iteration for generating rows

Left out for now:
- Read from DB.
- Read DB dump.
- Access levels on data (for now, all is accessible all the time by everyone)

### Thinking

TODO

### More use cases

- Civ2 savegame analyzer
- Rent a crud
- Back tester for stocks
- Fitness companion for phone
- Library catalog: Upload a CSV with book data. Make queries on the data. Expose them through an interface that draws a table.
- Logs and alerts: Push logs. Create queries on them. When certain logs come in, send an email or a notification.
- Spreadsheet database: Upload an XLS with data. Create a schema with the LLM and expose it as a table with associated form in an UI.
- Admin: place a DB dump. Run queries to detect inconsistencies and derive a better schema. Show these tables in an admin. Expose the dump through an HTTP endpoint in your service to update this.
- Usage dashboard: requests per second, also per code, bytes flowing. See fun data in real time.

## Features

### Editor

- Find
   - Have a cursor [DONE]
   - Move it around with the keys [DONE]
   - Fold/unfold
   - Jumping search
   - Auto scroll to where the cursor is, if the cursor jumps
   - Copy (the cursor determines the selection)
   - Show images and graphs where the = is, as a large pseudo step (a la netscape)
   - Search input that calls the search call (see devnotes 2025-08-27)
   - Store searches in the dataspace and have quick retrieval
   - Table view with headers at top and rows on the left?
   - Fast scrolling with >100k (see devnotes 2025-08-27)
   - Get only the diff between your last refresh and the server version

- Write
   - Edit step [DONE]
   - Add
      - Add ground laterally (one step)
         - At the end
         - In the middle
      - Add ground at the bottom (remove step)
      - A way to create space that doesn't entail editing something already there. Sort of a blank space that you can create or go to with a click.
   - Remove
      - Join steps
      - Remove step
      - Remove path with all suffixes (show what would be deleted by highlighting, first delete shows you the extent of the deletion, second executes)
   - Support for quoted texts
   - Diffs
      - Give ids to calls
      - Make mute calls still be in the dialog but not shown
      - Rename dialogue to dialog [DONE]
   - Undo
   - Vim mode when editing long texts

- Editor tests
   - Noop
      - If the input/textarea on the right is selected, don't do anything on the left.
      - Select a cursor and also check that if the input/textarea on the right is selected, nothing moves.
   - Find
      - Click on a non selected step and see how the cursor jumps there.
      - Go to the left, don't do anything because you're already at position 1.
      - Go all the way to the right, one at a time, until you hit the last one.
      - When index is 4, go down twice and see how, in a path that has length 3 (foo soda wey) the cursor goes back to 3 instead of being out of bounds.
      - Be in position 1 of foo bar 1 jip and move down. See it skip to the next distinct position 1 (the something in something else).
      - Do the same going up, it should also jump up.
      - Go back up to an abridged path (like foo bar 2, you'll go to the 2 at position 3). When you go left, rather than going to the abridged, you jump up and left until foo bar (the previous path that has a nonabridged step at position 3).
      - Scroll down/up when jumping far enough (requires more than a screenful of data).
         - Jumping down: if the bottom of the step > bottom of the grid, jump enough so that the top of the step is N pixels (roughly one step tall) below the top of the grid. (jump to the "top door")
         - Jumping up: if the top of the step < top of the grid, jump enough so that the bottom of the step is N pixels above the bottom of the grid. (jump to the "bottom door").
         - Same with right & left.
      - When reloading the page, if the selected step is far down/right enough, autoscroll to it automatically.
      - The cursor should cast a dim light (green) on all paths that share its prefix up until the cursor.
   - Write
      - Click on a selected step and enter edit mode.
      - Change the value.
      - Exit it again with escape, this will not change the value.
      - Enter edit mode again with enter.
      - Change the value again.
      - Exit it again with enter, this will save the change and retain the cursor, but not editing it.
      - Enter edit mode again with enter and exit again with enter, retain the cursor.

### Language

- search (general call to get matching paths)
- replace (macro): @! as lisp commas that turn off the quoting so that references are resolved at define time
- wall (block walking up, but not down)
- diff: takes one or two points of the dialog and gives you a diff.
- access masks
- Recursive lambdas by referencing itself?
- @@: get at a point of the dataspace (query a la datomic). Takes a time or time+id as part of the message.

### Engine

- Sublinear search
   - Set from a path to all its following steps (just the next one)
   - Set from a step (by value) to all its prefixes

Cell engines (dbs):
- Disk (improve efficiency enough so that it's at least linear)
- Redis (with aof)
- Postgres

Implementing sublinear cell in redis:
- Consider each step to be represented by four things: an id, a value, a position (1, 2, ...) and the id of the parent. For example, the "bar" in foo bar would have value bar, position 2, and the parent id would be that of foo.
- What about naive indexing on redis? Take each column (row) that's not an id and make it into a set. For example: value:bar would be a set of all the ids (of steps) that have as value "bar". Or position:2 would be a set of all the steps that are in position 2. And children:ID would be the set of all the steps that are children of the step ID.
- The deeper idea is to sets like masks. I'd love a prefix mask where shorter and longer elements that have similar prefixes match, and this would be done inside redis without having to go to the Lua script.
- Example: look for "status 200", where those are two distinct steps, one next to each other. They are at any position, so ignore the position. You would start by looking those ids with status, then get all the 200 that have each of those ids as parent, then intersect for a result. I'm itching to find a pattern like that in Earley's parser where you "combine like subparses". Rather than starting from a point, you go through each of the search terms in parallel, gathering subresults in sets, and then you intersect until you get all the steps that match. Then, you linearly reconstruct the paths from the ids.
- The memory footprint would be softened by having data where a lot of the texts or numbers are the same, because then they would have the same entry. I wonder how much more memory this representation requires than an equivalent text representation.

For postgres:
- How is this implemented? Make a single table on a relational database, with 2000 columns, the odd ones text and the even ones number. For a path element at position m, store it in m\*2 if it's text and m\*2+1 if it is a number. perform queries accordingly.
- What do you get out of this?
   - ACID, because it's backed by a relational database.
   - Fast querying on arbitrary path elements.
   - Range and match tests.

Tackling consistency:
- run the sync code in the db within a transaction
- make async ops not have consistency requirements except for checking things when they are ready for sync again
- have one source of truth for every part of the dataspace and replicas for each of them, for backup purposes. but you can fragment it as much as you want.
- If you don't want this, you can build a consensus algorithm on top of it and consider equivalences in paths (if X and Y are equal nodes, you can make random calls to X or Y).

Vague but compelling: every change generates a new id. This can recompute the entire dataspace affected by it. This creates a snapshot. The latest versions are resolved lexically. This would be a sort of indexing on top of the database itself (instead of it being a linear performance call going backwards from the latest to the requested one through applying reverse diffs).

### Service

- Altocookies: login with email with link (no password) or oauth with providers that always provide email (google)
- Make a queue per cell to process calls. Take cb as argument.
- ai
- outbound http
- inbound email: automatic email inbox per cell
- domain
- Encrypted (password/passkey protected) export/import
- PWAs out of the box.
- Dashboard with 10^... values (exponent with two decimal points) for requests per second, weekly active users and and GBs in memory.

- To save versions, take a diff between the current and the previous, and express it as a diff applied in a moment.

## Annotated source code (fragments)

### cell.js

#### `cell.toNumberIfNumber`

This function takes text and, if it matches something that looks like a number, returns it as a JS number. Otherwise, it returns it as text.

A number is defined as an optional - followed by an optional one or more digits followed by an optional dot, follwed by a mandatory one or more digits, with nothing else before or after.

```js
cell.toNumberIfNumber = function (text) {
   if (text.match (/^-?(\d+\.)?\d+$/) !== null) return parseFloat (text);
   return text;
}
```

#### `cell.unparseElement`

`unparseElement` takes a value `v` that's either a number or text. We know it is a number or text because we only pass to it path elements, which by design can only be text or number. It will then return the text that, when parsed, becomes the element.

for example: a number `1` becomes `1`; a text `1` becomes `"1"`; a text ` ` becomes `" "`. In essence, the unparser adds back non-literal quotes and slashes that escape literal quotes.

```js
cell.unparseElement = function (v) {
```

But wait, how can `v` be `null`? I forgot to mention that, because we allow dashes as placeholders of the keys of lists, we need to account for when there's indentation below these dash placeholders. The only unambiguous way I found to do this (see `cell.textToPaths` below) is using `null`. In these cases, `null` will be a single space. Therefore, in this function, we return a single space. Moving on...

```js
   if (v === null) return ' ';
```

If the value is a number, it just returns it as text, but without quotes around it.

```js
   if (type (v) !== 'string') return v + '';
```

If this is an empty text, return two double quotes.

```js
   if (v.length === 0) return '""';
```

If the value is text, and the text "looks" like a number (can start with a minus, can have one or more digits before a dot with a dot (or no dot), and has a bunch of digits after that, and nothing else), we return it surrounded by double quotes.

```js
   if (v.match (/^-?(\d+\.)?\d+$/) !== null) return '"' + v + '"';
```

If there is a literal double quote or whitespace inside the element, the element must be surrounded with double quotes. Therefore, we need to do the following:

- Prepend every literal slash with another slash.
- Prepend every literal double quote with a slash.
- Surround the whole text with double quotes.

```js
   if (v.match ('"') || v.match (/\s/)) {
      return '"' + v.replace (/\//g, '//').replace (/"/g, '/"') + '"';
   }
```

Otherwise, we return the original text.

```js
      return v;
   }
```

#### `cell.textToPaths`

This function takes a `message`, which is text, and returns an array of paths. If it finds a parsing error, it will also return it as a list of paths with one path, where the first element of that path is the text `error`.

This is the main parsing function.

```js
cell.textToPaths = function (message) {
```

We will put the output `paths` here.

```js
   var paths = [];
```

A variable that tells us whether we are inside a multiline text, which starts as `false`. If it is not `false`, it will have a number, which represents the number of spaces that should be prepended to any lines inside the multiline text (besides the first line, which is already indented).

```js
   var insideMultilineText = false;
```

If our message is empty text, we just return an empty array of paths.

```js
   if (message === '') return paths;
```

We are going to split the message into lines. We are going to go through each of these lines and parse them.

If we encounter any error while parsing a line, we will stop the iteration and return the error.

```js
   var error = dale.stopNot (message.split ('\n'), undefined, function (line) {
```

We set variables for storing a new path (that will go into `paths`), we copy the original line into `originalLine` (since we will modify `line` as we progress the parsing), and we will make a reference to the last path already in `paths`.

```js
      var path = [], originalLine = line, lastPath = teishi.last (paths);
```

If we encounter an empty line, or a line that only contains whitespace, and we are **not inside multiline text**, we just ignore this line. This is useful in case we get a message that has empty lines in it, usually at the beginning or end. The allowance for spaces in the line is to be forgiving of trailing spaces.

```js
      if ((line.length === 0 || line.match (/^\s+$/)) && ! insideMultilineText) return;
```

This is a good moment to remark that most of the complexity of this function is about dealing with multiline text.

If the line starts with a space, and we are not inside multiline text, we deal with this indentation.

```js
      if (line [0] === ' ' && ! insideMultilineText) {
```

If there is no previous path in `paths`, `message` is invalid, because the first non-empty line of a message cannot be indented. We return an error and stop the iteration.

```js
         if (! lastPath) return 'The first line of the message cannot be indented';
```

Indentations are for *abridged* fourdata. For example:

```
unabridged:

foo bar 1
foo jip 2

abridged:

foo bar 1
    jip 2
```

We measure the length of the indentation.

```js
         var indentSize = line.match (/^ +/g) [0].length;
```

We keep track of how many matched spaces we've seen so far, starting at 0.

```js
         var matchedSpaces = 0;
```


What we need to do is to figure out how many elements of the `lastPath` the indentation on this line matches, so we can copy those over to the new path.

`lastPath` always will have elements. If before there were only empty lines, there would be no path element. Therefore, we know that `matchUpTo` will return something. The moment this iteration over the last path stops, we will find either an index or an error.

```js
         var matchUpTo = dale.stopNot (lastPath, undefined, function (v, k) {
```

We pass `v` through `unparseElement` in case it's text that looks like a number and therefore must be surrounded by double quotes. This is also necessary if the text had spaces or literal double quotes in it. We need this so that the length of this path element is restored and therefore matches the matched spaces.

The `+ 1` is there to also match the space after the path element.

```js
            matchedSpaces += cell.unparseElement (v).length + 1;
```

If by adding the length of this element from the last path (plus 1), we match the indent size, we return the index of this element of the last path.

```js
            if (matchedSpaces === indentSize) return k;
```

If we went over and matched more than we wanted to, the elements of the previous path are not lining together with those of this line. We return an error.

```js
            if (matchedSpaces > indentSize) return {error: 'The indent of the line `' + line + '` does not match that of the previous line.'};
```

If we haven't hit the indentSize, keep on going.

```js
         });
```
If we haven't found a match, we have more spaces here than length as text of the previous path. We return an error.

```js
         if (matchUpTo === undefined) return 'The indent of the line `' + line + '` does not match that of the previous line.';
```

And if the iteration returned an error, we just return it.

```js
         if (matchUpTo.error) return matchUpTo.error;
```

If we are here, we successfully matched our indentation with some elements of the previous path. We make `path` to be a copy of those elements from the previous path, using the `matchUpTo` index we obtained in the iteration we just finished.

However, a subtle point! If we have a dash on the previous path, we don't want to copy that, because if we add a dash, the `cell.dedasher` function will understand this to be a new element of a list, rather than belonging to the existing one. To mark these indentations that stand for belonging to the same (dashed) element of a list, we cover our noses and use `null`.

```js
         path = dale.go (lastPath.slice (0, matchUpTo + 1), function (v) {
            return v === '-' ? null : v;
         });
```

Note that, in the above loop, if there were already a previous `null`, we will also copy it over.

We chop off the indentation off the line.

```js
         line = line.slice (matchedSpaces);
```

```js
         if (line.length === 0) return 'The line `' + originalLine + '` has no data besides whitespace.';
```

We're done with indentation/abridged lines.

```js
      }
```

There are two types of double quotes (`"`):
- Literal double quotes, which are escaped by a slash. These really stand for themselves.
- Non-literal double quotes, which are there to surround text that has at least space, a new line, or a literal double quote.

This function takes text (more precisely, a text element from a path) and does two things:
- Gives the indexes of the first and (sometimes) the second non-literal double quotes on the text. If one of them is missing, we set its index to -1.
- Unescapes the non-literal double quotes from a portion of the text.

If we are not inside multiline text, we only call this function if `text` starts with a non-literal double quote. In this case we return the text between the first and second non-literal double quote (if the second one is missing, we give return all the text until the end).

If we are inside multiline text, we only look for the first non-literal double quote and return the unescaped text between the beginning of the text and the first non-literal quote.

Because of the way we use this function, if we are not inside multiline text, if there is a non-literal double quote in the text, it will *always* be at position 0. So you don't have to worry about input like `nevermind "foo"` happening, although the function, in practice, handles it (it'd just give you `foo` as text, ignoring `nevermind`).

```js
      var dequoter = function (text) {
```

We initialize our output to keep track of `start` and `end`. These are indexes. When they are at -1, they mean there is no start or no end.

```js
         var output = {start: -1, end: -1};
```

This utility function gives the index of the first non-literal double quote. This was a tricky function to write.

```js
         var findNonLiteralQuote = function (text) {
```

We iterate every character in text until we decide to stop if the internal function returns something that's not `undefined`.

```js
            var index = dale.stopNot (text.split (''), undefined, function (c, k) {
```

If we don't find a double quote, we go to the next character.

```js
               if (c !== '"') return;
```

We see how many slashes are before the double quote we just found.

```js
               var slashes = text.slice (0, k + 1).match (/\/{0,}"$/g);
```

Now for the tricky bit. If there's an even amount of slashes before the double quote (even 0), this is a non-literal double quote, therefore we return `k` and stop the iteration.

If there's an odd amount of slashes, it means that this double quote is escaped. For example, if there's a single slash before the quote, the quote is escaped. If there are two slashes before the quote, what we have is a literal slash, followed by a non-literal double quote (so in that case, we also return `k`). If there are three slashes before the quote, there's a literal slash, followed by a literal double quote. And so forth.

```js
               if ((slashes [0].length - 1) % 2 === 0) return k;
            });
```

If we didn't find a nonliteral quote, we return -1.

```js
            return index !== undefined ? index : -1;
         }
```

We now define `unescaper`, an utility function that takes `text` and also returns text. If `text` has a double quote (which must be a literal one, given the fact that we call this on text that is between non-literal double quotes), or if we are inside multiline text, we remove each slash from before a literal double quote, as well as removing every slash before a literal slash.

```js
         var unescaper = function (text) {
```

If we are outside multiline text and there are neither whitespace nor literal double quotes, we'll just return `text` as is.

```js
            if (! (text.match (/\s/) || text.match (/"/) || insideMultilineText)) return text;
```

Otherwise, believe it or not, we are going to do a validation: if the text has literal double quotes or whitespace, every literal slash has to be prepended by another slash. We are going to check for this, and if it's not the case, we will return an error.

We start by unslashing all the literal quotes.

```js
            text = text.replace (/\/"/g, '"');
```

We iterate through the characters of the text and note any slashes that don't come in pairs. I'm too lazy to explain how this works, except that I'll say: one slash washes the other.

```js
            var unmatchedSlash;
            dale.go (text.split (''), function (c, k) {
               if (c !== '/') return;
               unmatchedSlash = unmatchedSlash === k - 1 ? undefined : k;
            });
```

If there is an unmatched slash, we return an error.

```js
            if (unmatchedSlash !== undefined) return ['error', 'Unmatched slash in text with spaces or double quotes: `' + text + '`'];
```

Otherwise, we unslash all literal slashes and return that text. This finishes `unescaper`.

```js
            return text.replace (/\/\//g, '/');
         }
```

We set `output.start` to the index of the first non-literal quote.

```js
         output.start = findNonLiteralQuote (text);
```

If we are inside multiline text, we are already inside a single text surrounded by quotes. We take all the text up until the first non-literal quote, unescape it, and put it in `output.text`.

```js
         if (insideMultilineText) {
            if (output.start === -1) output.text = unescaper (text);
            else                     output.text = unescaper (text.slice (0, output.start));
         }
```

If we are not inside multiline text, we are looking for all the text up until the first non-literal quote.

If there is no quote, we set the entire output text to be the text.

```js
         else {
            if (output.start === -1) output.text = text;
```

If we are not inside multiline text and there is a non-literal quote, we try to find a second non-literal quote that closes the first one.

```js
            else {
               var match = findNonLiteralQuote (text.slice (output.start + 1));
```

If there is a second non-literal quote, we set `output.end` to its index plus one.

```js
               if (match !== -1) output.end = output.start + 1 + match;
```

We set the output text to be the text between the non-literal quotes, unescaped.

```js
               output.text = unescaper (text.slice (output.start + 1, output.end === -1 ? text.length : output.end))
            }
         }
```

If `output.text` is an array, it means that `unescaper` found an error. In this case, we return the second element of the error, which is text describing the error.

Otherwise, we return `output` and close dequoter.

```js
         if (type (output.text) === 'array') return output.text [1];
         return output;
      }
```

We are now ready to deal with whatever comes after the indentation (if there was any). We first deal with the case where we are inside multiline text.

What makes multiline text particularly interesting is that it *spans* lines. Therefore, our outermost loop, which goes over lines of text, could go through a few iterations and still be assembling a single path. That's why we deal with this case quite separately from the `while` loop we will write afterwards.

```js
      if (insideMultilineText) {
```

If we are inside multiline text, we'll validate that the line starts with at least n spaces (where n is `insideMultilineText`). The only exception is the when the line is empty (or when the line has just whipespace), to avoid people the trouble of indenting empty lines inside multiline text.

```js
         if ((line.length > 0 && line.match (/[^\s]/)) && ! line.match (new RegExp ('^ {' + insideMultilineText + '}'))) return 'Missing indentation in multiline text `' + originalLine + '`';
```

Now that we validated this indent, we remove it from this line. Note that this will never happen on the *first* line of multiline text, because we only have this flag on for the second and any subsequent lines. And in the case where the line is empty, we can still slice it with no consequence.

```js
         line = line.slice (insideMultilineText);
```

We run the `line` through `dequoted`. If there is no non-literal double quote, the entire line belongs to the last element of the last path. There already has to be a path with at least an element there, which was initialized by the beginning of the multiline text we are still processing.

Therefore, we just append the entire `line` (taking care to use `dequoted.text`, in case there are characters we need to unescape such as slashes and literal double quotes) into the last element of the last path, also taking care of adding the newline that we removed when we started to iterate each of the lines of the original text.

Note that if `dequoted` is text, it must be an error. In that case, we return it directly.

```js
         var dequoted = dequoter (line);
         if (type (dequoted) === 'string') return dequoted;
         if (dequoted.start === -1) {
            lastPath [lastPath.length - 1] += dequoted.text + '\n';
```

We `return` so that we can move on to process the next line.

```js
            return;
         }
```

If there is a non-literal double quote, we are going to close the last element of the last path. We start by appending to it the line up to the double quote.

We set `path` to `lastPath`, since if there are further elements in `line`, we want to add them to the path we are working on.

```js
         else {
            lastPath [lastPath.length - 1] += dequoted.text;
            path = lastPath;
```

Next, we chop off the beginning of the line, up until the first non-literal double quote. We check if there's a space after it. If there is not, we return an error. Otherwise, we remove the space and carry on.

```js
            if (line.length && line [0] !== ' ') return 'No space after a quote in line `' + originalLine + '`';
            line = line.slice (1);
```

We also unset the inside multiline text flag. This concludes the multiline text case.

```js
            insideMultilineText = false;
         }
      }
```

We now repeat an inner loop until there are no characters left on the line.

```js
      while (line.length) {
```

If there is still a space after removing the space after the previous path element, we return an error and stop the iteration. We are intolerant of double spaces in text.

```js
         if (line [0] === ' ') return 'The line `' + originalLine + '` has at least two spaces separating two elements.';
```

We first deal with the case where line starts with a non-literal double quote. We run the line through `dequoter`.

```js
         if (line [0] === '"') {
            var dequoted = dequoter (line);
```

If `dequoted` is text, it must be an error. In that case, we return it directly.

```
            if (type (dequoted) === 'string') return dequoted;
```

If there is no second non-literal double quote, we just opened a new multiline text! We need to calculate how many spaces the continuation lines should be indented. This indentation ensures that subsequent lines of the multiline text align one character to the right of the opening quote.

We use `dale.acc` to accumulate the total length, starting from 0. We iterate through all the elements of the current `path` that we've parsed so far.

```js
            if (dequoted.end === -1) {
               insideMultilineText = dale.acc (path, 0, function (a, v) {
```

We unparse the element to get its text representation, which will include quotes if necessary.

```js
                  v = cell.unparseElement (v);
```

If this element doesn't contain a newline, we just add its length plus one (for the space after it) to the accumulator.

```js
                  if (! v.match ('\n')) return a + v.length + 1;
```

If this element contains newlines (it's multiline text itself!), we only care about the length of the last line, since that's what determines the horizontal position where the next element starts. We add the length of the last line, plus one for the non-literal quote that follows it, plus one for the space after that quote.

```js
                  return a + teishi.last (v.split ('\n')).length + 1 + 1;
               }) + 1;
```

Finally, we add one more to account for the opening quote of the multiline text we're about to start. This total becomes the value of `insideMultilineText`, which is the number of spaces that continuation lines must be indented.

We push the entire dequoted text (plus a newline) to the path as a new element. We then set `line` to an empty text.

```js
               path.push (dequoted.text + '\n');
               line = '';
            }
```

If there *is* a second non-literal double quote, we start by pushing the text between them into the current path, as a new element.

Now, you may ask: what if `dequoted.text` is a number? We'd be adding it to the path as text! However, because it was prepended by a non-literal double quote, it *has* to be text.

```js
            else {
               path.push (dequoted.text);
```

We chop off the line up until the second non-literal double quote.

```js
               line = line.slice (dequoted.end + 1);
```

We check that the first character after the double quote is a space. If it's not a space, we return an error. Otherwise, we remove the space from the line.

```js
               if (line.length && line [0] !== ' ') return 'No space after a quote in line `' + originalLine + '`';
               line = line.slice (1);
            }
```

If we found one (or two) non-literal double quotes, we call `continue` so that we go to the top of the `while` loop.

```js
            continue;
         }
```

If we are here, there are no non-literal double quotes in `line`. We proceed to split it by spaces and get its first element.

```js
         var element = line.split (' ') [0];
```

If there's a whitespace character that's not space, we return an error, because those should have been enclosed between non-literal double quotes.

```js
         if (element.match (/\s/)) return 'The line `' + line + '` contains a space that should be contained within quotes.';
```

If there is a double quote in the element, we also return an error, because it was not properly escaped.

```js
         if (element.match (/"/)) return 'The line `' + line + '` has an unescaped quote.';
```

We push the `element` to our current path. Note that we convert it to a number if it's indeed a number (not surrounded by non-literal double quotes).

```js
         path.push (cell.toNumberIfNumber (element));
```

We chop off the line up until the end of `element`, plus one character. Unlike the previous two times we did this (one for multiline, one for being within quotes), we don't need to check if there's a space after `element` because we split the `line` by spaces in the first place.

```js
         line = line.slice (element.length + 1);
```

This closes the `while`. `line` is now empty.

```js
      }
```

We finish by adding `path` to `paths`. Most of the time, `path` will not be yet in `paths`. However, if we opened a multiline text in a previous line, `path` will be already in `paths`. Therefore, we check whether `path` is inside `paths` before adding it.

This is the last thing we do before closing the iterator function on each `line`.

```js
      if (! paths.includes (path)) paths.push (path);
   });
```

Outside of the loop that goes line by line, we check whether we got an `error`. If we do , we return it wrapped in a hash.

```js
   if (error) return [['error', error]];
```

If the flag that marks we are inside multiline text is still set, there's an error. We report it. Note that in this case, we remove the newline at the end of the last step of the last path, because if the following line (this one) didn't properly close the multiline text, it probably means that the error is contained solely in the previous line and the newline is just noise.

```js
   if (insideMultilineText) return [['error', 'Multiline text not closed: `' + teishi.last (teishi.last (paths)).replace (/\n$/, '') + '`']];
```

If we are here, the parsing was successful. We dedash (change dashes to numbers in lists) and sort the paths.

```js
   paths = cell.sorter (cell.dedasher (paths));
```

We validate the resulting paths. If we get an error, we return it; otherwise, we return the paths. This closes the function.

```js
   var error = cell.validator (paths);
   return error.length ? error : paths;
}
```

#### `cell.dedasher`

This function converts dashes (`-`) to numbers in paths. In fourdata, dashes are a syntactic convenience for writing list items without explicit indices. For example:

```
foo - bar
    - baz
```

Gets converted to:

```
foo 1 bar
foo 2 baz
```

The function takes `paths` and modifies them in place, also returning them.

```js
cell.dedasher = function (paths) {
```

We iterate through all paths.

```js
   dale.go (paths, function (path, pathIndex) {
```

For each path, we iterate through all its steps.

```js
      dale.go (path, function (step, stepIndex) {
```

If the step is `null`, it means we're dealing with indentation below a dash placeholder. These `null`s come from `cell.textToPaths`. In this case, we copy the corresponding step from the previous path. This handles cases like:

```
foo - bar 1
          2
```

Where the second line's `null` placeholder needs to inherit `foo` and the list index from the previous path.

Earlier, we said:

> However, a subtle point! If we have a dash on the previous path, we don't want to copy that, because if we add a dash, the `cell.dedasher` function will understand this to be a new element of a list, rather than belonging to the existing one. To mark these indentations that stand for belonging to the same (dashed) element of a list, we cover our noses and use `null`.

This is where we use it.

```js
         if (step === null) return paths [pathIndex] [stepIndex] = paths [pathIndex - 1] [stepIndex];
```

If the step is not a dash, there's nothing to dedash, so we skip it.

```js
         if (step !== '-') return;
```

If we're here, we have a dash that needs to be converted to a number. We get the previous path and determine if we're "continuing" an existing list. This is true when:
1. There is a previous path.
2. The prefix up to this step matches between current and previous path.
3. The corresponding step in the previous path is a number (not text).

```js
         var lastPath = paths [pathIndex - 1];

         var continuing = lastPath !== undefined && teishi.eq (lastPath.slice (0, stepIndex), path.slice (0, stepIndex)) && type (lastPath [stepIndex]) !== 'string';
```

If we're continuing, we increment from the previous path's index. Otherwise, this is the first item of a new list, so we set the step to 1.

```js
         paths [pathIndex] [stepIndex] = continuing ? lastPath [stepIndex] + 1 : 1;
      });
   });
```

We return the modified paths. This closes the function.

```js
   return paths;
}
```

#### `cell.sorter`

This function sorts an array of paths according to a specific ordering. The sorting rules are:

1. Numbers come before text.
2. Numbers are sorted numerically, smaller first.
3. For text, `=` comes before `:` (responses before expansions).
4. Other text is sorted lexicographically.

If two paths share the same prefix, the shorter one comes first.

```js
cell.sorter = function (paths) {
```

We define a helper function `compare` that compares two individual steps. It returns -1 if `v1` should come first, 1 if `v2` should come first, or 0 if they're equal.

```js
   var compare = function (v1, v2) {
```

If the values are identical, they're equal.

```js
      if (v1 === v2) return 0;
```

We determine the type of each value: either `'text'` or `'number'`.

```js
      var types = [type (v1) === 'string' ? 'text' : 'number', type (v2) === 'string' ? 'text' : 'number'];
```

If the types differ, numbers come first.

```js
      if (types [0] !== types [1]) return types [0] === 'number' ? -1 : 1;
```

If both are numbers, we sort numerically.

```js
      if (types [0] === 'number') return v1 - v2;
```

If both are text, we handle the special case of `=` and `:`. Responses (`=`) come before expansions (`:`).

```js
      if (v1 === '=' && v2 === ':') return -1;
      if (v1 === ':' && v2 === '=') return 1;
```

For all other text, we sort lexicographically. This closes the `compare` function.

```js
      return v1 < v2 ? -1 : 1;
   }
```

We now sort the paths using the native `sort` method with a custom comparator.

```js
   return paths.sort (function (a, b) {
```

We compare paths step by step, up to the length of the shorter path. We iterate through each index and compare the steps at that index. If we find a non-zero result, we stop and use that as our comparison result. If all compared steps are equal, `result` will be 0.

```js
      var result = dale.stopNot (dale.times (Math.min (a.length, b.length), 0), 0, function (k) {
         return compare (a [k], b [k]);
      }) || 0;
```

If `result` is non-zero, we use it. Otherwise, the shorter path comes first (this happens when one path is a prefix of the other). While there will never be two paths with the same prefix where one is just the prefix and the other one is the prefix plus one or more elements, this function is meant to be used on paths that haven't been checked for consistency yet: `cell.validator` expects its input to be sorted (since it makes its implementation easier), so this function needs to be able to deal with inconsistent paths.

This closes the sort comparator and the function.

```js
      return result !== 0 ? result : a.length - b.length;
   });
}
```

#### `cell.pathsToText`

This function takes an array of `paths` and returns text. This is the main unparsing function, the inverse of `cell.textToPaths`.

```js
cell.pathsToText = function (paths) {
```

We define a helper function `spaces` that returns a string of `n` spaces.

```js
   var spaces = function (n) {
      return Array (n).fill (' ').join ('');
   }
```

We will put the output lines here.

```js
   var output = [];
```

We define `pathToText`, a helper function that takes a single path and converts it to text. It also takes an optional `prefixIndent`, which is a string of spaces that will be prepended to continuation lines of multiline text. This is necessary when the path is abridged (has a common prefix with the previous path), so that multiline text continuation lines are indented correctly. This function has to handle multiline text elements within paths, which is the main source of complexity.

```js
   var pathToText = function (path, prefixIndent) {
```

We keep track of how many characters we've written on the current line. This is essential for properly indenting subsequent lines when we encounter multiline text.

```js
      var indentCount = 0;
```

We iterate through each step of the path.

```js
      return dale.go (path, function (step) {
```

We unparse the step, which converts it to its text representation. If it's a number, it becomes a string. If it's text that looks like a number or contains spaces or quotes, `unparseElement` will surround it with double quotes and escape any literal quotes or slashes.

```js
         step = cell.unparseElement (step);
```

If the step doesn't contain a newline, we just need to add its length plus one (for the space after it) to our indent count, and return the step as is.

```js
         if (! step.match (/\n/)) {
            indentCount += step.length + 1;
            return step;
         }
```

If we are here, the step contains newlines. We need to split it by newlines and handle each line separately.

```js
         return dale.go (step.split (/\n/), function (line, k) {
```

The first line doesn't need indentation, since it's on the same line as the previous elements of the path. However, we do need to account for the opening quote in our indent count.

```js
            if (k === 0) {
               indentCount++;
               return line;
            }
```

For subsequent lines (lines after the first), we need to indent them to align with the opening quote. We only make an exception for empty lines: for those, we don't bother adding enough spaces to align with the quote.

```js
            var indent = line.length === 0 ? '' : spaces (indentCount);
```

If this is the last line of the multiline text, we need to update `indentCount` to account for this line's length plus one (for the space after the closing quote). The closing quote is aligned with the opening quote, so we don't add it to the indent count.

```js
            if (k === step.split (/\n/).length - 1) {
               indentCount += line.length + 1;
            }
```

We return the indented line. If there's a `prefixIndent` (because this path is abridged), we prepend it to the line so that all continuation lines of multiline text are properly indented to account for the omitted common prefix.

```js
            return (prefixIndent || '') + indent + line;
```

We join all the lines of this multiline step with newlines.

```js
         }).join ('\n');
```

We join all the steps of the path with spaces. This concludes `pathToText`.

```js
      }).join (' ');
   }
```

Now we iterate through all the paths.

```js
   dale.go (paths, function (path, k) {
```

We find the common prefix between this path and the previous one. This allows us to use fourdata's abridgement feature, where we don't repeat the common prefix.

```js
      var commonPrefix = [];
```

If this is not the first path, we compare it with the previous path to find the common prefix.

```js
      if (k > 0) dale.stop (paths [k - 1], false, function (v, k) {
```

If the elements match, we add them to the common prefix and continue.

```js
         if (v === path [k]) commonPrefix.push (v);
```

If they don't match, we stop the iteration.

```js
         else return false;
      });
```

If there's no common prefix, we just add the path to the output as is and move on to the next path. We don't pass a second argument to `pathToText` since there's no prefix indentation needed.

```js
      if (commonPrefix.length === 0) return output.push (pathToText (path));
```

We convert the common prefix to text and create an indentation string of that length, plus one for the space that separates the common prefix from the rest of the path. We call `pathToText` here just to calculate the length of the prefix.

```js
      var prefixIndent = spaces (pathToText (commonPrefix).length + 1);
```

We add the indented path to the output. We slice off the common prefix from the path before converting it to text, and we pass `prefixIndent` as the second argument to `pathToText` so that any multiline text continuation lines in this path will be properly indented.

```js
      output.push (prefixIndent + pathToText (path.slice (commonPrefix.length), prefixIndent));
   });
```

We join all the lines with newlines and return the result. This finishes `cell.pathsToText`.

```js
   return output.join ('\n');
}
```

#### `cell.JSToPaths`

This function converts a javascript value to an array of paths. It's the inverse of `cell.pathsToJS`.

```js
cell.JSToPaths = function (v) {
```

We initialize `paths` as an empty array. This will accumulate all the paths as we recurse through `v`.

```js
   var paths = [];
```

We define a helper function `singleToFourdata` that converts a single (scalar) JS value to its fourdata equivalent.

```js
   var singleToFourdata = function (v) {
      var Type = type (v);
```

Integers, floats, and strings are kept as-is. The first two are numbers, the third is text.

```js
      if (teishi.inc (['integer', 'float', 'string'], Type)) return v;
```

Booleans become 1 (true) or 0 (false), so they become numbers.

```js
      if (Type === 'boolean') return v ? 1 : 0;
```

Dates become ISO strings, which are text.

```js
      if (Type === 'date') return v.toISOString ();
```

Regexes, functions, and infinity become their text representation.

```js
      if (teishi.inc (['regex', 'function', 'infinity'], Type)) return v.toString ();
```

Everything else (null, NaN, etc.) becomes empty text.

```js
      return '';
   }
```

We define a recursive function that walks through the value.

```js
   var recurse = function (v, path) {
```

We skip `undefined` values. This allows sparse arrays to be represented properly. Rather than having a path with `undefined` inside, this will indicate the absence of a path.

```js
      if (v === undefined) return; // Skip undefined paths to properly represent sparse arrays
```

If `v` is a simple value (not an object or array), we've hit the end of the path: we add a path with the converted value appended.

```js
      if (teishi.simple (v)) paths.push ([...path, singleToFourdata (v)]);
```

Otherwise, we iterate through the object/array and recurse. For arrays, we convert 0-based indices to 1-based (fourdata uses 1-based lists).

```js
      else                   dale.go (v, function (v2, k2) {
         recurse (v2, [...path, type (k2) === 'integer' ? k2 + 1 : k2]);
      });
   }
```

We start the recursion with an empty path.

```js
   recurse (v, [])
```

We sort the paths before returning. This closes the function.

```js
   return cell.sorter (paths);
}
```

#### `cell.pathsToJS`

This function converts an array of paths to a JavaScript value. It's the inverse of `cell.JSToPaths`.

```js
cell.pathsToJS = function (paths) {
```

If there are no paths, we return empty text.

```js
   if (paths.length === 0) return '';
```

If there's exactly one path with exactly one element, we return that element directly (a scalar value).

```js
   if (paths.length === 1 && paths [0].length === 1) return paths [0] [0];
```

We determine whether the output should be an object or array based on the first step of the first path. If it's text, we're building a hash; if it's a number, we're building a list.

```js
   var output = type (paths [0] [0]) === 'string' ? {} : [];
```

We iterate through all paths to build the output structure.

```js
   dale.go (paths, function (path) {
      var target = output;
```

For each path, we walk through its steps (except the last, which is the value).

```js
      dale.go (path, function (step, depth) {
```

If we're at the last element of the step, we can ignore it, since we're working "one step ahead" (see below).

```js
         if (depth + 1 === path.length) return;
```

We convert 1-indexed indices back to 0-indexed since javascript arrays are 0-indexed.

```js
         if (type (step) === 'integer') step = step - 1;
```

If we're not at the second-to-last step, we need to create intermediate structures (objects or arrays) as needed, then descend into them.

```js
         if (depth + 2 < path.length) {
            if (target [step] === undefined) target [step] = type (path [depth + 1]) === 'string' ? {} : [];
            target = target [step];
         }
```

If we're at the second-to-last step, the next step is the value, so we assign it.

```js
         else target [step] = path [depth + 1];
      });
   });
```

We return the built structure. This closes the function.

```js
   return output;
}
```

#### `cell.validator`

This function validates a set of paths. It takes `paths` as its sole argument. These paths must already be dedashed (by cell.dedasher) and sorted (by cell.sorter).

This function checks that:
1. Floats are only used as terminal values (not as keys)
2. No type mixing occurs (e.g., can't have both a list and hash at the same path)
3. No duplicate final values exist

```js
cell.validator = function (paths) {
```

We initialize a hash to track what type each path prefix has been assigned. The key will be the JSON stringification of the path prefix, and the value will be one of four types: `'hash'`, `'list'`, `'text'`, or `'number'`.

```js
   var seen = {};
```

We iterate through all paths, stopping at the first error. `dale.stopNot` will return `undefined` if no error is found, or the error message if one is found.

```js
   var error = dale.stopNot (paths, undefined, function (path) {
```

For each path, we check each step within it.

```js
      return dale.stopNot (path, undefined, function (v, k) {
```

**Rule 1: Floats can only be terminal values, never keys.**

If we find a float that's not at the end of the path (meaning it's being used as a key), we return an error. This is because floats should only represent final scalar values, not structural positions in the data hierarchy.

```js
         if (type (v) === 'float' && k + 1 < path.length) return 'A float can only be a final value, but path `' + cell.pathsToText ([path]) + '` uses it as a key.';
```

We now determine the type category of this step:
- `'hash'` if it's a string key (not final position)
- `'text'` if it's a string value (final position)
- `'list'` if it's a number key (not final position)
- `'number'` if it's a number value (final position)

The distinction between "key" and "value" is whether this step has more steps after it in the path.

```js
         var Type = type (v) === 'string' ? (k + 1 < path.length ? 'hash' : 'text') : (k + 1 < path.length ? 'list' : 'number');
```

We create a unique key for this path prefix by stringifying everything before the current step. For example, if our path is `['foo', 'bar', 1]` and we're at step `'bar'`, the `seenKey` would be `'["foo"]'`.

```js
         var seenKey = JSON.stringify (path.slice (0, k));
```

Is this the first time we've encountered this path prefix?

```js
         if (! seen [seenKey]) seen [seenKey] = Type;
```

If we've seen this path prefix before, we need to check for conflicts.

```js
         else {
```

**Rule 2: Type must match what we've seen before at this prefix.**

For example, if we have `['foo', 'bar']`, we can't later have `['foo', 1]` because `'foo'` would be both a hash (keyed by `'bar'`) and a list (keyed by `1`). This ensures structural consistency.

```js
            if (seen [seenKey] !== Type) return 'The path `' + cell.pathsToText ([path]) + '` is setting a ' + Type + ' but there is already a ' + seen [seenKey] + ' at path `' + cell.pathsToText ([path.slice (0, k)]) + '`';
```

**Rule 3: No duplicate terminal values.**

If this is a terminal value (either text or number), we cannot have it twice. For example, we can't have both `['foo', 'bar']` and `['foo', 'bar']` again. However, we *can* have `['foo', 'bar', 1]` and `['foo', 'bar', 2]` because these are list items, not terminal values.

```js
            if (Type === 'number' || Type === 'text') return 'The path `' + cell.pathsToText ([path]) + '` is repeated.';
         }
      });
   });
```

If an error was found, we return it as a path with `'error'` as the first step. Otherwise, we return an empty array to indicate the paths are valid.

```js
   return error ? [['error', error]] : [];
}
```

**Examples:**

Valid:
- `[['foo', 'bar']]` - Simple hash
- `[['foo', 'bar', 1]]` - Hash with numeric value
- `[['foo', 1, 'a'], ['foo', 2, 'b']]` - List with two items

Invalid:
- `[['foo', 'jip'], ['foo', 'bar', 1]]` - Error: `'foo'` can't be both a text value and a hash
- `[['foo', 'jip', 1], ['foo', 2, 2]]` - Error: `'foo'` can't be both a hash and a list
- `[['foo', 'bar'], ['foo', 'bar']]` - Error: Duplicate terminal value
- `[['foo', 3.14, 'bar']]` - Error: Float used as a key

#### `cell.call`

TODO

Three entrypoints:
- @ do
- @ put
- @ ... (reference to anything)

#### `cell.respond`

We now define `cell.respond`, a function that will be called by `cell.put` when an update takes place. This function expands calls, that is: it takes the response to any calls and puts them in the dataspace.

This function takes three arguments: a `path`, `get`, a storage-layer function that gives us the entire dataspace, and `put`, which is the same but for updating the dataspace.

```js
cell.respond = function (path, get, put) {
```

If there is no `@` in this path, there are no calls. Therefore, there's nothing to do, so we ignore this path. We also ignore paths that start with `dialog`, since those are internal bookkeeping and shouldn't trigger further expansions.

```js
   if (path.indexOf ('@') === -1 || path [0] === 'dialog') return;
```

We define two variables, each of them with an index. `leftmostAt` will have the index of the leftmost `@`. And `rightmostAt` will have the index of the rightmost `@`.

Note we reverse a copy of `path` so that we can search from the left, then do a bit of math to figure out what the actual index is coming from the right.

```js
   var leftmostAt  = path.indexOf ('@');
   var rightmostAt = path.length - 1 - teishi.copy (path).reverse ().indexOf ('@');
```

We go through the entire path, finding the leftmost `@` step that has a `do` step immediately after it. If we find it, we set `rightmostAt` to the index of that `@`.

Why do we do this? In effect, what we are doing is considering the leftmost `@ do` as the *first* thing we want to expand. We want to avoid expanding a definition here -- that's going to be the job of `cell.do`, which we'll call in a few lines.

An easier way to remember this is that if there is an `@ do` to the left of the rightmost `@`, we will instead consider that `@` before the `do` as the rightmost at. In effect, we're switching the rightmost at to the left. This only will affect the `targetPath` and the `valuePath` (see below).

```js
   dale.stopNot (path, undefined, function (v, k) {
      if (v === '@' && path [k + 1] === 'do') return rightmostAt = k;
   });
```

Three very important variables, all of them paths:

- The **context path** is everything to the left of `leftmostAt`. That is, everything that's not a reference, is our context.
- The **target path** is everything to the left of `rightmostAt`, plus an `=`. This is the common prefix of all the paths we are going to create or update. Think of it as the left part of our assignment. If the path we are looking at is `foo @ ...`, then we know that all the paths we will set are going to be of the shape `foo = ...`.
- The **value path** is everything to the right of `rightmostAt`. This is the right part of our assignment, where we're getting the value from. Note we actually remove any `=` from it; this allows us to "go get" the values of calls that have been responded already. Another way to call this "go get" is as "jumping over equals".


```js
   var contextPath = path.slice (0, leftmostAt);
   var targetPath  = path.slice (0, rightmostAt).concat ('=');
   var valuePath   = dale.fil (path.slice (rightmostAt + 1), '=', function (v) {return v});
```

Now, you may be asking: what happens when a path has *two* (or more) `@`s? How do we deal with these paths, if our logic just looks at the rightmost `@` only? The answer is the following: the rightmost `@` will get a new path on top of it that has an `=`. It is this path that will get the next-to-last rightmost `@` expanded. This can happen until all `@`s in one path get expanded, path by path, onto one that has only `=`s.

If we are here, we know we are dealing with a call. A call has a message that could have one or more paths. We don't want to execute this call for the second or subsequent paths with the same prefix of the same call, just for the first one. Therefore, we now write some logic to see if this path is indeed the first for its call.

To do this, we first take the prefix of the path, which is the target path without the `=` at its end, plus `@` and the first step of the `valuePath`.

```js
   var prefix = targetPath.slice (0, -1).concat (['@', valuePath [0]]);
```

We then get the entire dataspace and see what's the position of this path in all of them. This is currently extremely inefficient, but when we decide to improve `get`, we can also do this in a more efficient way.

```js
   var dataspace = get ();
   var index = dale.stopNot (dataspace, undefined, function (v, k) {
      if (teishi.eq (path, v)) return k;
   });
```

We only need to check if the previous path also matches this prefix. If there's no previous path, or if the previous path has a length smaller than that of the prefix, or if its prefix doesn't match the prefix we have here, then this is the first path for this call.

Actually, we shouldn't match the last step of the prefix: on a certain prefix that ends with a call (`@`), there should be only one call. If there are different calls, we'll catch that with a validation later. For now, we want to make sure that this path is the first one to have this prefix minus the last step.

```js
   var firstPath = index === 0 || dataspace [index - 1].length < prefix.length || ! teishi.eq (dataspace [index - 1].slice (0, prefix.length - 1), prefix.slice (0, -1));
```

If this is not the first path for this call, we return and do nothing else, to avoid unnecessary execution.

```js
   if (! firstPath) return;
```

We now detect if there are multiple calls with this prefix minus the last step. We iterate the dataspace:

```js
   var multipleCalls = dale.stopNot (dataspace.slice (index + 1), false, function (p) {
```

If this path of the dataspace doesn't match the entire prefix minus the last step, it's irrelevant: we continue iterating.

```js
      if (! teishi.eq (path.slice (0, rightmostAt + 1), p.slice (0, rightmostAt + 1))) return;
```

If it does match, it can either be a path that's part of the path we're responding to; or it can be a distinct, illegal call on this same prefix. If the latter is the case, we return `true`.

```js
      if (p [rightmostAt + 1] !== path [rightmostAt + 1]) return true;
   });
```

We get the previous value (the value at `targetPath`). A subtle and important detail: as context path, we pass `contextPath`, which is everything on this path that is not a reference.

```js
   var currentValue = cell.get (targetPath, contextPath, get);
```

We will now discover what the `newValue` (that is, a list of paths that will have the prefix of `targetPath`), should be.

We first deal with the case where there are multiple calls with the same prefix: the response in this case will be an error.

```js
   if (multipleCalls) {
      var newValue = [['error', 'Only one call per prefix is allowed']];
   }
```

Next, we deal with the case where there's an `if` at the beginning of `valuePath`. We do so by invoking `cell.if`. To this function, we pass the `prefix` (that is, the `targetPath`, minus the `=` at its end, plus a `@ if`). We also pass `contextPath`.

`cell.if` will return a list of paths that we store in `newValue`.

```js
   else if (valuePath [0] === 'if') {
      var newValue = cell.if (prefix, contextPath, get);
   }
```

If there's a `do` at the beginning of `valuePath`, this is a sequence definition. We then invoke `cell.do` and save the paths returned by it in `newValue`.

As for the arguments we pass to `cell.do`, we pass a `define` text to let it know this is a definition (not an execution). We also pass the `prefix` (like we did in the case of `cell.if`) except that it would be instead `foo @ do`. We also pass a `null` that is a placeholder for an argument we will only need when *executing* a call.

```js
   else if (valuePath [0] === 'do') {
      var newValue = cell.do ('define', prefix, contextPath, null, get);
   }
```

Otherwise, we just call `cell.get` directly.

```js
   else {
      var newValue = cell.get (valuePath, contextPath, get);
```

If we find that the current value is a call that has not been responded to yet, we will ignore its current value. How would we know this? If it is a call (because it starts with `@`) and it doesn't have an `=` as the first step of the first path, we know it hasn't been responded to yet. This is necessary when we're trying to respond to a call to a call, and the inner call hasn't been responded to yet. We have a test for this with the tag "Make a reference to a reference in order ba//dc//cb".

```js
      if (newValue [0] && newValue [0] [0] === '@') return;
```

Now for the interesting bit. If we get no paths from our call to `cell.get`, there could be a sequence call in the `valuePath`. So we are going to figure out if that's the case.

```js
      if (newValue.length === 0) {
```

Imagine that our `valuePath` is something like this: `bar 10`. Imagine that `bar` is a sequence, defined elsewhere, that takes a single number as its message. This could be a sequence call!

Now imagine that we have a path that is `bar cocktail 5`. We may have `bar cocktail` defined as a sequence (and we'd pass `5` as its message) or we may have `bar` as a sequence (and we'd pass `cocktail 5`) as a message. All we know is that, if any of these is a possible call, there has to be a valid point in which to split the left part from the right part.

So we are going to find out like this: we are going to iterate as many times as there are steps in `valuePath`. We start by getting the `valuePath`, chopping of n steps (starting with `n` as `1`), and concatenating `@ do` to that path. We then `cell.get` that path, using our `contextPath`.

We try with shorter paths first (making the destination as short as possible and the message as long as possible), then gradually lengthen the destination and shorten the message.

If we didn't get something, we just keep on trying until the iteration finishes.

If we did get something, that means that we found a prefix of `valuePath` where there's a sequence definition. We will consider that to be our `definitionPath` and consider whatever is to its right (in the `valuePath`) to be the `message`.

```js
         var call = dale.stopNot (dale.times (valuePath.length - 1, 1), undefined, function (k) {
            var value = cell.get (valuePath.slice (0, k).concat (['@', 'do']), contextPath, get);
            if (value.length) return {definitionPath: valuePath.slice (0, k).concat (['@', 'do']), message: valuePath.slice (k)};
         });
```

If there is indeed a call to a sequence in our `valuePath`, we invoke `cell.do`, passing the `definitionPath`, the `contextPath`, and the message (whatever is to the right of `definitionPath` inside `valuePath`.

First, we might need to change `prefix` to reflect the fact that `definitionPath` is more than three steps long. This could happen if we are invoking something available at `x y` (instead of just at `x`). In that case, the `y` should also be added to the prefix, so it can be removed from the message.

```js
         if (call) {
            if (call.definitionPath.length > 3) prefix = prefix.concat (call.definitionPath.slice (1).slice (0, -2));
```

We also need to collect all the paths inside the message, which could be many. For that, we iterate all the paths after path that have the same prefix as this one, and return whatever is after the prefix. This is the reason, by the way, for us updating the prefix just above.

Note we stop if we find a path that has a length that is less than this prefix, which already indicates this path doesn't have the same prefix.

```js
            call.message = [];
            dale.stop (dataspace.slice (index), undefined, function (v) {
               if (v.length < prefix.length) return;
               if (teishi.eq (v.slice (0, prefix.length), prefix)) return call.message.push (v.slice (prefix.length));
            });
```

OK, now we're ready. `cell.do` will return a set of paths that we will set on the `targetPath`. It will also directly set the expansion of `targetPath`, but it won't return it. We will cover that when we annotate `cell.do`.

```js
            newValue = cell.do ('execute', call.definitionPath, contextPath, call.message, get, put);
         }
```

If there's no call, we check to see if this is a native call. We get the message using the same mechanism we did in the previous block.

```js
         else {
            var message = [];
            dale.stop (dataspace.slice (index), undefined, function (v) {
               if (v.length < prefix.length) return;
               if (teishi.eq (v.slice (0, prefix.length), prefix)) return message.push (v.slice (prefix.length));
            });
```

Then we call `cell.native`, passing the first step of `valuePath` and the `message`. If we get something other than `false`, it means this is a native call, so we set the returned value to `newValue`. Otherwise, we won't modify `newValue` - if we made it this far without a `newValue`, this is really a reference to nowhere and it should be then responded with an empty text.

```js
            var nativeResponse = cell.native (valuePath [0], message, contextPath, get, put);
            if (nativeResponse !== false) newValue = nativeResponse;
         }
```

This concludes the case of neither `if` or `do`.

```js
      }
   }
```

It might be the case that a call to `cell.do` with `op: execute` has done a recursive call to `cell.put` (which in turn performs a recursive call to `cell.respond`!). In that case, the wise choice is to not update the dataspace, since the recursive calls have a more up to date version of the dataspace.

This will also be the case if we just made a call to put. If we did, and that call actually brought back a diff (which means that it called `cell.respond` recursively, we also return `true` to let the outer call to `cell.put` to stop iterating. (This is not exactly precise: if we wanted to be completely correct, we'd also check that the call to put updates something else than the dialog).

One subtle point: we cannot use the `newValue` being equal to `true` mechanism for `put`, because `put` returns a diff that we also want to return as a value. Whereas calls to `cell.do` don't need to do this.

```js
   if (newValue === true || (valuePath [0] === 'put' && ! teishi.eq (newValue, [['diff', '']]))) return true;
```

By now, we have a `newValue`. If we got no paths in `newValue`, we set it to a single path with a single empty text. This will allow us to have paths like `foo = ""`, which is more illustrative (and correct) thatn `foo =`.

```js
   if (newValue.length === 0) newValue = [['']];
```

If the previous value and the current value are the same, we don't have to do anything, so we return.

```js
   if (teishi.eq (currentValue, newValue)) return;
```

If we're here, we will update the dataspace. We do so by taking all the paths in `newValue`, prepending them with `targetPath` and passing them to `cell.put`. Note we pass an empty context path to put, since the "where" is already contained in the target path.

```js
   cell.put (dale.go (newValue, function (path) {
      return targetPath.concat (path);
   }), [], get, put);
```

We then return `true` to stop the iteration. What iteration, you may ask? Well, `cell.put` is calling `cell.respond` on each of the paths of the dataspace, one at a time. When one of these calls to `cell.respond` triggers a call to `cell.put`, we don't want the outer call to `cell.put` redoing all the work; we'll just leave that to the inner call to `cell.put`. Returning `true` is a way to stop the outer loop. This is only done for efficiency purposes.

```js
   return true;
```

This finishes the loop and the function.

```js
}
```

#### `cell.if`

We now define `cell.if`, the function that performs conditional logic. It takes three arguments:

- A `queryPath`, which is the path that contains the data for the if.
- A `contextPath`, which is the path of where we're currently standing.
- `get`, a storage-layer function that gives us the entire dataspace.

```js
cell.if = function (queryPath, contextPath, get) {
```

We get all the paths inside the `if` and store them in `paths`.

```js
   var paths = cell.get (queryPath, contextPath, get);
```

We find the top level keys inside `paths` and make sure they are just `cond`, `do` and `else`. If any key is here that is not among these, we return an error.

```js
   var topLevelKeys = dale.keys (cell.pathsToJS (paths)).sort ();
   if (teishi.v (['topLevelKeys', topLevelKeys, ['cond', 'do', 'else'], 'eachOf', teishi.test.equal], true) !== true) return [['error', 'An if call has to be a hash with keys `cond`, `do` and `else`.']];
```

We validate that there's a `cond` key; if there's not, we return an error.

```js
   if (topLevelKeys.indexOf ('cond') === -1) return [['error', 'An if call has to contain a `cond` key.']];
```

We get all the paths belonging to `cond`.

```js
   var cond = cell.get (queryPath.concat ('cond'), contextPath, get);
```

Now for a tricky one: we want to process what the result of `cond` was. We will take just the first path (which should be the first path of the actual value if there was no reference; if there was a reference, it should be the first path of its result (`=`)). We remove any `=` from it.

```js
   var result = dale.fil (cond [0], '=', function (v) {return v})
```

If we got no paths in `cond`, or the first path in `cond` (minus `=`) is a lone `0` or `''`, we consider the condition to be false. Otherwise, we consider it to be true.

```js
   var truthy = (cond.length === 0 || teishi.eq (result, [0]) || teishi.eq (result, [''])) ? false : true;
```

Depending on whether the condition is true or not, we call `cell.get` with `queryPath` plus `do` (or `queryPath` plus `else`), also passing the `contextPath` and `get`. We simply return its result.

This will also work if `do` or `else` are not present, because in these cases we will get an empty list of paths.

This closes the function.

```
   return cell.get (queryPath.concat (truthy ? 'do' : 'else'), contextPath, get);
}
```

#### `cell.do`

We now define `cell.do`, the function in charge of two things: 1) giving back the result (`=`) of the call to a sequence; 2) performing the expansion (`:`) of the call to a sequence.

As for the arguments:

- `op` can be either `'define'` or `'execute'`.
- `definitionPath` is the path where the sequence is defined, which we'll use to get its definition (which is, really, its value).
- `contextPath` is the context path, always.
- `message` is present only for the case when `op` is `'execute'`. It is the message sent in the call to the sequence.

```js
cell.do = function (op, definitionPath, contextPath, message, get, put) {
```

We start by getting the `definition` to the sequence. Note we pass the `contextPath`.

```js
   var definition = cell.get (definitionPath, contextPath, get);
```

If the definition is empty, we return an error.

```js
   if (definition.length === 0) return [['error', 'The definition of a sequence must contain a message name and at least one step.']];
```

We expect that every definition of a sequence has a single text step sandwiched between `@ do` and the list of steps of the sequence. For example: `@ do message_name 1 ...`.

We get the name of the message. If it's not text, we return an error.

```js
   var messageName = definition [0] [0];
   if (type (messageName) !== 'string') return [['error', 'The definition of a sequence must contain a textual name for its message.']];
```

We forbid `do` to be the name of the message. We already are going to use `do` to show the expansion of each step of the sequence, and we want to avoid overwriting it.

```js
   if (messageName === 'do') return [['error', 'The name of the message cannot be `do`.']];
```

We forbid that there should be multiple messages.

```js
   if (dale.keys (cell.pathsToJS (definition)).length !== 1) return [['error', 'The definition of a sequence can only contain a single name for its message.']];
```

The definition of a sequence has to start with a list that starts at step 1. We also check that the sequence has only consecutive steps. If any of these conditions is violated, we return an error.

```js
   if (definition [0] [1] !== 1) return [['error', 'The definition of a sequence must start with step number 1.']];
   var error = dale.stopNot (definition, undefined, function (path, k) {
      if (definition [k - 1] && path [1] - 1 > definition [k - 1] [1]) return [['error', 'The definition of a sequence cannot have non-consecutive steps.']];
   });
   if (error) return error;
```

If we're just defining the sequence, we return a single path that has two steps: the message name and the number of steps in the sequence.

```js
   if (op === 'define') return [[messageName, teishi.last (definition) [1]]];
```

If we are here, we are executing a sequence.

If we are executing a sequence, we need to do two things. We need to compute the expansion of this execution, and we need to return a value for its response. We are not going to do this at once, but by steps. This is not unlike the way that `cell.respond` gradually expands paths that have multiple calls.

We have already decided that the final value (response) to the execution will be returned, if we find it. We have also decided that any changes to the expansion will be performed not by returning those, but rather by calling `cell.put` directly. If we call `cell.put`, we will return `true` to indicate this to the caller so that they stop updating the dataspace.

If we think of our requirements for a `cell.do` execution, they are the following:
- Put the message in `:` using the message name and the actual value of it.
- Take the steps in the definition and expand them one at a time. If one of them responds with a path that starts with `stop` or `error`, we stop and don't go further.
- Take the value of the last step of the sequence and return that.

There are two more things that makes this even trickier:
- We must "wait" until any recursive calls (`@`s to the right, in our message or our steps) have results.
- The definition can be updated, so we need to ensure that we are using the latest one.

How are we going to tackle all of this? It took a while to figure out. Here it is:

- We consider the message to be a sort of step zero of the definition. Basically, we treat it like a step.
- We write a function `stripper` that takes the message, or a step of the sequence, and removes everything that's either an expansion or a response from it. This allows us to compare two sets of paths and decide whether the definition used is correct or stale.
- We run each of the steps (starting with the message) through the stripper and compare them to the definition. If one is different, we replace it with the one from the definition and stop - a later call will proceed with the work. When we stop, we return `true` to stop the caller from doing unnecessary work. Otherwise, we carry on.
- If we make it all the way to the end, or find a stopping value (`stop` or `error`), we have a response, so we return it.

Let's define `stripper`:

```js
   var stripper = function (paths) {
```

For a change, we have implemented this function quite efficiently. Because responses (`=`) and expansions (`:`) are before its calls (`@`), we can look ahead to see if there's a path that has the same prefix and an `@`, and if so we just filter out the path with `=` or `:`. Note we don't filter out paths with `=` or `:` that don't have those keys coming from calls (you might have literal colons or equals).

```js
      return dale.fil (paths, undefined, function (path, pathIndex) {
```

We track the index of the first equal or colon. If there's none, we don't ignore this path.

```js
         var firstEqualOrColon = dale.stopNot (path, undefined, function (v, k) {
            if (v === '=' || v === ':') return k;
         });
         if (firstEqualOrColon === undefined) return path;
```

We look ahead to find a path with a similar prefix plus an `@`. Note that we only look for paths after `pathIndex` -- we just look ahead.


```js
         var lookaheadCall = dale.stop (paths.slice (pathIndex), true, function (lookaheadPath) {
```

When comparing against the lookahead path, we slice the prefix plus one (which should be the `@`) and compare it to our own prefix plus the equal or colon concatenated with `@`.

```js
            return teishi.eq (lookaheadPath.slice (0, firstEqualOrColon + 1), path.slice (0, firstEqualOrColon).concat ('@'));
         });
```

if there's no lookahead call, we return this path. Otherwise, we don't and therefore, filter it out. This closes the outer loop and the function.

```js
         if (! lookaheadCall) return path;
      });
   }
```

We get the current expansion by getting what is now at `contextPath` plus `:`. From there, we remove `do` and just get the current message.

```js
   var currentExpansion = cell.get (contextPath.concat (':'), [], get);
   var currentMessage = dale.fil (currentExpansion, undefined, function (path) {
      if (path [0] !== 'do') return path;
   });
```

We compare the stripped current message with the stripped message we received as an argument.

```js
   if (! teishi.eq (stripper (currentMessage), stripper (dale.go (message, function (path) {
      return [messageName].concat (path);
   })))) {
```

If they are not the same, that can be because of two reasons:

1. This is the first time that this call is being responded.
2. The message name, or its value, changed.

In both cases, the required action is the same: we will then set `:` to the new message. We do this through a direct call to `cell.put`. Note we use the dot to indicate that this has to be done right here, instead of looking for a `:` up the chain if it doesn't exist. We also pass the `contextPath`.

One more detail: we also need to wipe whatever sequence was already there in the expansion. We do that first. Note we pass `mute` as the last argument to `cell.wipe` so that this wiping doesn't trigger a call to `cell.respond`.

```js
      cell.wipe ([['.', ':']], contextPath, get, put, 'mute');
      cell.put (dale.go (message, function (v) {
         return ['.', ':', messageName].concat (v);
      }), contextPath, get, put);
```

We then return `true` to indicate that a call to `cell.put` has happened; this will prevent the caller (`cell.respond`) from updating the dataspace; this makes this call almost tail recursive. This concludes the case where the message has changed.

```js
      return true;
   }
```

If we are here, we're ready to look at the steps of the sequence. We start by stripping the first step out of the paths of the definition, since they are all the message name, for which we no longer have use.

```js
   definition = dale.go (definition, function (v) {return v.slice (1)});
```

We also note the length of the sequence.

```js
   var sequenceLength = teishi.last (definition) [0];
```

We are ready to start iterating the steps of the sequence.

We will iterate up to n times, where `n` is the length of the sequence. We will use anything that's not `undefined` as a way to break out of the loop early - or not early, in case we're really done with the sequence.

We store the result of this iteration in `result`.

```js
   var result = dale.stopNot (dale.times (sequenceLength, 1), undefined, function (stepNumber) {
```

The current step is the step already stored at `contextPath` plus `: do <step number>`. It's "current" in the same way we earlier referred to `currentExpansion` vs `newExpansion`, not as in step `n - 1`.

```js
      var currentStep = cell.get ([':', 'do', stepNumber], contextPath, get);
```

We also get the new step from the definition, slicing the number from the front.

```js
      var newStep = dale.fil (definition, undefined, function (path) {
         if (path [0] === stepNumber) return path.slice (1);
      });
```

As with the message, we compare the previous step and the new step.

```js
      if (! teishi.eq (stripper (currentStep), stripper (newStep))) {
```

If we are here, the current step and the new one differ. If so, we start by removing any current steps that come after this. This is necessary in cases where a sequence is redefined to have less steps than before: without this provision, we'd have phantom steps in the sequence that are not removed from the dataspace.

The mechanism is to iterate the steps in the sequence; any step that is larger than the current one and not in an array of already `wiped` steps we keep, we proceed to wipe. We also wipe mutely, as we did earlier in this function.

```js
         var wiped = [];
         dale.go (cell.get ([':', 'do'], contextPath, get), function (path) {
            if (path [0] <= stepNumber || wiped.includes (path [0])) return;
            wiped.push (path [0]);
            cell.wipe ([':', 'do', path [0]], contextPath, get, put, 'mute');
         });
```

We now set the new step at `contextPath` plus `: do <step number>`. Note we do not use the dot, since `:` exists already because it was placed there when we set the message.

```js
         cell.put (dale.go (newStep, function (v) {
            return [':', 'do', stepNumber].concat (v);
         }), contextPath, get, put);
         return true;
      }
```

Note that in the body of the conditional above, we are returning the result of `cell.put`, which will stop the loop early because it's not `undefined`.

We will now get the value of this step. To do this, we need to:

- See if the value of the step contains a call.
- If it does, concatenate a `=` to its path, so we can get the proper value.
- If it doesn't, the step itself is the value.

```js
      var existingValuePath = contextPath.concat ([':', 'do', stepNumber]);
      if (teishi.last (newStep) [0] === '@') existingValuePath.push ('=');
      var existingValue = cell.get (existingValuePath, [], get);
```

If there's no value yet (because the call hasn't been expanded), just give up (by returning `true`) and come back later.

```js
      if (existingValue.length === 0) return true;
```

If we're here, there's an existing value already.

If that existing value is a stopping value (a hash with a key error or stop), or we are at the last step of the sequence, we return `existingValue`.

```js
      if (['error', 'stop'].includes (existingValue [0] [0]) || stepNumber === sequenceLength) {
          return existingValue;
      }
```

We close the iteration over the steps of the sequence, return `result` and close the function.

```js
   });

   return result;
}
```

#### `cell.native`

TODO

#### `cell.upload`

TODO

#### `cell.get`

We now define `cell.get`, which performs `reference` for us. It takes four arguments:

- A `queryPath`, which is the path of what we're looking for.
- A `contextPath`, which is the path of where we're currently standing. For calls that come from outside, this will be an empty list.
- `get`, a storage-layer function that gives us the entire dataspace.
- `absolute` is an argument that, if truthy, will not strip the `contextPath` from the result; rather, it will return the full paths.

```js
cell.get = function (queryPath, contextPath, get, absolute) {
```

We start by getting all the paths in the dataspace.

```js
   var dataspace = get ();
```

If the first step of `queryPath` is a dot, this has a special meaning: it means search *right here*, don't walk up. In this case, we will set a variable `dotMode` and remove the dot from `queryPath`.

```js
   var dotMode = queryPath [0] === '.';
   if (dotMode) queryPath = queryPath.slice (1);
```

We will try to find the first step of the `queryPath` at the longest (deepest) possible level in `contextPath`. This first step of `queryPath` is called the **hook**. The simplest case is when `contextPath` has length 0. In this case, we just go through the entire dataspace once and find any paths that start with the first step in `queryPath` (if `queryPath` is itself empty, we then match every single path in the dataspace!). These are the `matches` we get.

If `contextPath` has more than length 0, we start by finding all the paths that match it. We then shave off the `contextPath` as prefix from each of the matched paths and we go through all of them to find what matches the first step of `queryPath`. If there is no hook because `queryPath` is empty, we get everything that matches `contextPath`.

In this way, the function walks "up" the context path, removing steps from its end, and stopping when it finds one or more paths that match the query.

We will run a loop that stops on not `undefined` and runs at most the length of contextPath + 1 (the + 1 is to run it against an empty context path).

However, in dot mode, we will just run the loop one time, to prevent "walking up".

```js
   return dale.stopNot (dale.times (! dotMode ? contextPath.length + 1 : 1, contextPath.length, -1), undefined, function (k) {
```

We define `prefix` as the `contextPath` plus the hook of the `queryPath`. If there's no hook (because `queryPath` is empty), this prefix will just be the context path.

```js
      var prefix = contextPath.slice (0, k).concat (queryPath.slice (0, 1));
```

We go through the dataspace and stop the moment we find a path that has `prefix` as its prefix. Note we ignore paths that are shorter than prefix itself, because we slice each path on prefix's length, but not viceversa.

If we don't get any matches, we `return` and the outer loop continues.

```js
      if (! dale.stop (dataspace, true, function (path) {
         return teishi.eq (prefix, path.slice (0, prefix.length));
      })) return;
```

If we're here, our hook caught something. We now set `prefix` to context path plus query path (in full, not just the hook).

```js
      prefix = contextPath.slice (0, k).concat (queryPath);
```

We iterate the dataspace again and, for each path that matches the prefix, we remove the prefix from it and return what's left. Note that if `absolute` is truthy, we do not slice the returned paths by the prefix length, but instead return them in full.

This completes the inner loop.

```js
      return dale.fil (dataspace, undefined, function (path) {
         if (teishi.eq (prefix, path.slice (0, prefix.length)) && path.length > prefix.length) return absolute ? path : path.slice (prefix.length);
      });
```

We return the matches or an empty array (in case there were none). This closes the function.

```js
   }) || [];
}
```

#### `cell.put`

`cell.put` is the function that adds data to the dataspace. It takes a whopping five arguments.

- `paths`: the paths to write to the dataspace.
- `contextPath`: the path where we're currently standing. For calls that come from outside, this will be an empty list. The exact same as what `cell.get` receives.
- `get` and `put`: two functions that, when executed, either get the dataspace or update it. These are the storage-layer functions (`get` is the exact same function we pass to `cell.get` above).
- `updateDialog`: a flag that, if truthy, will allow to update the dialog. This is to protect the `dialog`, which is a special key. This will be replaced by a better validation mechanism later.

```js
cell.put = function (paths, contextPath, get, put, updateDialog) {
```

We start by validating that these paths are not setting, at the outermost level, anything that's not a hash. The dataspace itself, at its outermost level, has to be a hash because it contains keys such as `dialog`, which imply that the entire dataspace is a hash.

If the user tries to replace the entire dataspace with something that is not a hash, we'll respond with an error and be done.

```js
   if (paths.length && paths [0].length === 1 || type (paths [0] [0]) === 'integer') return [['error', 'Cannot set entire dataspace to something that is not a hash']];
```

Now for an interesting design decision: we assume that `paths` is already validated. All that we require from `paths` is that it is an internally consistent set of paths, that is, a set of paths that you could put anywhere in the dataspace (except perhaps for the toplevel). Since the calls to `cell.put` come from either `cell.call` (which validates its input when parsing it) or from `cell.respond` and `cell.do` (which should have no errors), we will not validate the paths.

We get the entire dataspace onto memory. Isn't inefficiency fun?

```js
   var dataspace = get ();
```

We now collect the "hooks" (the outermost keys of all paths) that we're going to update. When we write paths to the dataspace, each hook is the first step of each of those paths. The hook is where we're "hooking" the new data, exactly in the same way as hooks work for `cell.get`.

We iterate `paths` and for each one we extract the first step (unless we're in "dot mode", in which case we take the second step). `hooks` will take the shape of `{<hook (which is just a step)>: true/false}`, where `true` indicates dot mode and `false` indicates normal mode.

Why an object and not an array? We could potentially have multiple paths with the same prefix, so doing it like an object reduces unnecessary lookups ove ra long array later.

```js
   var hooks = dale.obj (paths, function (path) {
      var dotMode = path [0] === '.';
      return [JSON.stringify (path [dotMode ? 1 : 0]), dotMode];
   });
```

We now iterate the hooks to determine the context path for each one. The goal of this section is to set each of the entries of `hooks` to a context path where we can find that hook.

```js
   dale.go (hooks, function (dotMode, hook) {
```

 If a hook is in dot mode, we simply use the `contextPath` as-is.

```js
      if (dotMode) return hooks [hook] = contextPath;
```

If not in dot mode, we need to "walk up" to find where this hook already exists in the dataspace. We iterate backwards through the `contextPath`, starting from its full length down to 0. For each position, we create a prefix by taking that slice of `contextPath` and appending the hook. We then check if any path in the dataspace starts with this prefix. If we find a match, we return the prefix without the hook itself (just the context portion) and stop the iteration (since we found what we want).

```js
      var context = dale.stopNot (dale.times (contextPath.length, contextPath.length, -1), undefined, function (k) {
         var prefix = contextPath.slice (0, k).concat (JSON.parse (hook));
         if (! dale.stop (dataspace, true, function (path) {
            return teishi.eq (prefix, path.slice (0, prefix.length));
         })) return;
```

We return the context path without the hook.

```js
         return prefix.slice (0, -1);
      });
```

If `context` is present, we found a non-empty context path for that hook, so we set it in `hooks [hook]`. Otherwise, no match is found at any level, so we default to an empty `contextPath`.

```js
      hooks [hook] = context || [];
   });
```

We now expand each path by prepending its context path. We iterate `paths` and for each one, we look up its hook in `hooks` to get the context path, then concatenate it with the path itself. If in dot mode, we skip the leading `.` by taking `path.slice (1)`.

```js
   var error;
   paths = dale.go (paths, function (path) {
      var dotMode = path [0] === '.';
      path = hooks [JSON.stringify (path [dotMode ? 1 : 0])].concat (dotMode ? path.slice (1) : path);
```

We also check that we're not trying to write to `dialog` without the `updateDialog` flag. The dialog is protected from being overwritten by normal puts. This is the sole reason we have the `error` variable outside the iteration.

```js
      if (! updateDialog && path [0] === 'dialog') error = [['error', 'A dialog cannot be supressed by force.']];
      else return path;
   });
```

If we have an error because of trying to overwrite the error, we return early with an error.

```js
   if (error) return error;
```

We now build a `seen` object that tracks the type of every prefix in the paths we want to put. This will allow us to detect type conflicts with existing data.

```js
   var seen = {};
```

We iterate the paths: for each of them, we iterate each of the steps on each (except for the last). If a path has n steps, we iterate n-1 since we assume (actually, expect) that the overall type of the paths is a hash. This is so because the dataspace has top-level keys that are texts (such as `dialog`). Remember that these paths are now absolute paths and so must go directly into the dataspace.

```js
   dale.go (paths, function (path, index) {
      dale.go (path.slice (0, path.length - 1), function (step, k) {
```

We create a key that is the stringification of the path minus the last step.

```js
         var key = JSON.stringify (path.slice (0, k + 1));
         if (seen [key]) return;
```

For each prefix, we determine its type based on the next step. If the next step is text, the prefix is either `'text'` (if it's the last step) or `'hash'`. If the next step is a number, the prefix is either `'number'` or `'list'`.

```js
         var textStep = type (path [k + 1]) === 'string';
         var lastStep = k + 2 === path.length;
         seen [key] = textStep ? (lastStep ? 'text' : 'hash') : (lastStep ? 'number' : 'list');
      });
```

We also store the full path with its last value and index. This lets us check if a path already exists with the same value. The index refers to the position of this path on the list of paths to be put.

```js
      seen [JSON.stringify (path)] = [teishi.last (path), index];
   });
```

We now iterate the dataspace to determine which existing paths need to be removed. We initialize `removed` to track paths that will be deleted (for reporting in the diff output). We filter the dataspace: for each existing path, we check if it conflicts with what we're trying to put.

```js
   var removed = [];
   dataspace = dale.fil (dataspace, undefined, function (path) {
```

For each existing path, we iterate through its prefixes (all steps except the last). We use `stopNot` to stop either at the first conflict or the moment that this path's prefix is no longer in conflict with one of the seen paths; if we return `undefined`, the iteration keeps on going until the end.

```js
      var remove = dale.stopNot (path.slice (0, path.length - 1), undefined, function (step, k) {
```

We compute a key by taking a prefix of the path.

```js
         var key = JSON.stringify (path.slice (0, k + 1));
```

If this prefix hasn't been seen, we return `false`, since neither itself nor any path that has that prefix as prefix can represent a conflict for this put.

```js
         if (! seen [key]) return false;
```

If the prefix *was* seen, we need to determine what type the existing path expects at this prefix. We compute the type in exactly the same way we did when building `seen`: based on whether the next step is text or number, and whether it's the last step.

```js
         var textStep = type (path [k + 1]) === 'string';
         var lastStep = k + 2 === path.length;
         var t = textStep ? (lastStep ? 'text' : 'hash') : (lastStep ? 'number' : 'list');
```

If the type of the existing path doesn't match what we saw in the new paths, we have a conflict. We return `true` to signal that this path should be removed.

```js
         if (seen [key] !== t) return true;
```

If we're at the last step of this path we're iterating, we need special handling. We check if the existing path with this prefix also finishes here.

If that is the case, its `seen` key will be an array of the shape `[<last step>, <index>]`. If it's not an array, this is just a conflict, so we return `true`.

```js
         if (lastStep) {
            var newLastStep = seen [JSON.stringify (path)];
            if (type (newLastStep) !== 'array') return true;
```

If we're here, both the old and the new path end at this exact location. We compare the values: if they differ, we remove the existing path (return `true`). If they match, we mark the new path as `null` to avoid adding a duplicate.

```js
            if (newLastStep [0] !== path [k + 1]) return true;
            paths [newLastStep [1]] = null; // Remove the new path, leave the old
         }
      });
```

After checking all prefixes of an existing path, if `remove` is falsy we keep the path by returning it. Otherwise, we push it to `removed` (for the diff output) and return `undefined` to filter it out.

```js
      if (! remove) return path;
      else removed.push (path);
   });
```

We filter out any `null` entries from `paths` (these were duplicates of existing paths).

```js
   paths = dale.fil (paths, null, function (v) {return v});
```

If no paths were actually added, we return an empty diff early.

```js
   if (! paths.length) return [['diff', '']];
```

We add the new paths to the dataspace.

```js
   dataspace = dataspace.concat (paths);
```

Now the dataspace variable is updated. We sort it.

```js
   cell.sorter (dataspace);
```

We persist the changes.

```js
   put (dataspace);
```

We call `cell.respond` for each path in the dataspace, but only if the paths we're putting don't all start with `dialog` (the dialog can only be appended to or wiped, but never updated).

We skip calling `cell.respond` if `cell.respond` finds that changes should happen, it will call `cell.put` in turn. In that way, `cell.put` and `cell.respond` will call each other recursively until all the changes are propagated. The `true` that `cell.respond` returns is only to make things more efficient and avoid unnecessary calls.

We don't validate the dataspace after calling `cell.respond` because no expansion of a call should generate an incorrect result: every call defines a hash (because `@` is text), so putting a `=` on the same prefix will not change the type of the prefix. Because of this, the call to `cell.put` from inside `cell.respond` doesn't check for errors returned by `cell.put`.

```js
   if (! (paths [0] [0] === 'dialog' && teishi.last (paths) [0] === 'dialog')) {
      dale.stop (dataspace, true, function (path) {
         return cell.respond (path, get, put);
      });
   }
```

Finally, we return the diff. The diff contains all the paths that were added (prefixed with `+`) and all the paths that were removed (prefixed with `x`). This closes the function.

```js
   return dale.go (paths, function (path) {
      return ['diff', '+'].concat (path);
   }).concat (dale.go (removed, function (path) {
      return ['diff', 'x'].concat (path);
   }));
}
```

#### `cell.wipe`

`cell.wipe` is the function that removes data from the dataspace. It takes a main argument which is `paths`. When `paths` is empty, `cell.wipe` will remove all paths from the dataspace. If there is one path, `cell.wipe` will only remove from the dataspace the paths that have that path as a prefix. `cell.wipe` also takes a `contextPath`, which allows for "walking up" (just like we do in `cell.get` and `cell.put`).

Besides `paths` and `contextPath`, it also takes `get` and `put`: two functions that, when executed, either get the dataspace or update it. These are the storage-layer functions (`get` is the exact same function we pass to `cell.get` above).

Finally, it takes a `mute` flag, which when truthy will make the function *not* call `cell.respond`.

```js
cell.wipe = function (paths, contextPath, get, put, mute) {
```

As `paths`, we can either receive a list of prefixes to wipe, or just one prefix. If we get a list of prefixes (which means that we have more than one path and that the first step of the first path is a number, denoting that the overall `paths` data is a list), we strip away the first step of each path.

```js
   if (paths.length > 1 && type (paths [0] [0]) === 'integer') paths = dale.go (paths, function (path) {
      return path.slice (1);
   });
```

We get the entire dataspace onto memory. Remind me this if I ever call myself a real programmer.

```js
   var dataspace = get ();
```

We will keep track of all the paths we wiped. We do this with an object so that we can have fast lookup if there are many paths, although I wonder if stringifying JSON makes this slower than n comparisons of m steps.

```js
   var wiped = {};
```

We iterate all the paths we want to wipe. For each of them, we call `cell.get`, so we can have the `contextPath` as part of the query. Note we pass the `absolute` argument to `cell.get` so that we get full paths.

This is the sole reason for which `cell.get` takes that parameter. This behavior allows us to know exactly what we just wiped (since we cannot just know it from the `contextPath` + `path` because we might have walked up to find this wiped path.

```js
   dale.go (paths, function (path) {
      dale.go (cell.get (path, contextPath, get, 'absolute'), function (wipedPath) {
```

We put each of the wiped paths as keys on `wiped`.

```js
         wiped [JSON.stringify (wipedPath)] = true;
      });
   });
```

We iterate all paths in the dataspace. If a path is in our `wiped` hash, we filter it out (by returning `undefined`). Otherwise, we keep it.

```js
   dataspace = dale.fil (dataspace, undefined, function (path) {
      if (! wiped [JSON.stringify (path)]) return path;
   });
```

Now for the tricky bit. We might have left gaps in lists. So we fill them up. The logic is as follows:

- Iterate all paths.
- For each path, iterate all steps.
- For number steps that are not the last step of the path, take their prefix (without the number itself) and initialize a count.
- When finding a gap, update the step.
- The logic goes top down, left to right, so multiple gaps can be patched at the same time.

```js
   var listPrefixCount = {};

   dale.go (dataspace, function (path) {
      dale.go (path, function (v, k) {
```

We ignore text or rightmost steps.

```js
         if (type (v) === 'string' || k + 1 === path.length) return;
```

We get the current count or initialize it to 0. If the current count plus 1 is less than what the step is, we update the step directly in the path.

```js
         var currentCount = listPrefixCount [JSON.stringify (path.slice (0, k))] || 0;
         if (currentCount + 1 < v) path [k] = currentCount + 1;
```

We update the `listPrefixCount` entry. This concludes the logic for filling up gaps in lists.

```js
         listPrefixCount [JSON.stringify (path.slice (0, k))] = path [k];
      });
   });
```

If we wiped no paths, this is a no-op. We return an empty diff.

```js
   if (dale.keys (wiped).length === 0) return [['diff', '']];
```

If we're here, there were updates. We update the dataspace through `put`.

```js
   put (dataspace);
```

If the `mute` flag is not passed, we call `cell.respond` for each of the new paths, stopping if any call returns `true`. This is exactly the same thing we do at the end stage of `cell.put`, and for good reason: the pattern is the same.

```js
   if (! mute) dale.stop (dataspace, true, function (path) {
      return cell.respond (path, get, put);
   });
```

We now compute the diff and put it in `response`. We do it by iterating `wiped` and ignoring entries that start with `dialog`. `cell.wipe` can delete the dialog paths, but it doesn't include them in its diff.

```js
   var response = dale.fil (wiped, undefined, function (v, path) {
      path = JSON.parse (path);
      if (path [0] === 'dialog') return;
      return ['diff', 'x'].concat (path);
   });
```

If we only wiped dialog entries, we return an empty diff; otherwise, we return the diff we just built. This concludes the function.

```js
   return response.length > 0 ? response : [['diff', '']];
}
```

## Acknowledgments

[Kartik Agaram](http://akkartik.name) has provided extremely valuable insights and questions.

Leon Marshall has contributed the term "speak" to describe interactions between programs.

## License

cell is written by [Federico Pereiro](mailto:fpereiro@gmail.com) and released into the public domain.

