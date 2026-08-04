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

