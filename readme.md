# cell

cell is a programming environment for anyone who wants to work with data.

## Why

Programming is currently much harder than writing prose. Reading programs is also much harder than reading prose.

The goal of cell is to make programming easier, so that it is only as demanding as writing prose. By making programming more accessible to more writers and readers, we hope to empower more humans to create and own their own [information systems](https://github.com/altocodenl/todis).

### Additional vibe goals

- Make information systems habitable.
- Provide a different everyday fabric of computation.
- Find a sweet spot between the low-level spreadsheets and programming languages, on one end, and big, clunky applications on the other.

### Do we still need programming tools? Can't we just ask AI to create systems for us?

My contention is: if you want to build data systems using AI, you need to do three things:

1. **Host** the system. The system has to be accessible on a continuous basis and its data has to be both secured and backed-up.
2. **Structure** the system. AIs, like humans, are fallible and inconsistent. It is very important to have solid parts in the system that uphold important constraints.
3. **Understand** the system. AIs, also like humans, get lost in a system when it becomes too complex. Having an approach that minimizes complexity can help both human and AI to understand the system and keep it maintainable and scalable.

Cell intends to make the hosting, control and understanding of your system to be as easy as possible -- even if you're not a programmer. So that you can build your systems with confidence.

## How

The core understanding behind cell is this: originally, we developed computers to get the result of various mathematical calculations. But this is not the case anymore: most of our systems now are not concerned with calculations, but rather, with the management of data. More precisely, we use computers to store, communicate and transform data. In short, computers and programs are only valuable because they let us work with data. **The game is data.**

Cell attempts to make programming like natural language through two innovations:

- Putting the code in the same place as data (and with the same structure).
- Putting the result of each piece of code literally on top of the code that generated it.

It also helps that cell uses very few symbols, choosing instead to use regular letters and numbers. Things that can be pronounced are generally more memorable and graspable.

Here's an illustration:

```
= 15
@ plus10 5
```

I'm currently recording myself while building cell. You can check out [the Youtube channel here](https://www.youtube.com/channel/UCEcfQSep8KzW7H2S0HBNj8g).

### The seven problems

1. Different ways to represent data with text. High noise (syntax).
2. Data being fragmented everywhere. Takes a long time to find where things are and more to make them reference each other cleanly.
3. Lack of visibility between inputs and outputs. Console log everywhere.
4. A panoply of ways to program, none of which are straightforward or procedural. Think OOP vs pure functional vs low-level programming with pointers.
5. Systems that you need to re-run.
6. 3-8 libraries and subsystems to do anything useful.
7. Facing the blank paper and having to read a lot to do anything.

### The seven powerups

Cell employs seven powerups to make programming as easy (or hard) as writing prose:

1. **Fourdata**: a simple way to **represent data**. This allows you to look directly at any data that comes your way.
2. **Dataspace**: a single space **where all the data of your project exists**. Every part of your data has a meaningful location. Everything is organized in the same place.
3. **Dialog**: programming as a **conversation**: you write *calls* to the system, and the system responds back with some data. You can see both your call and the response as data.
4. **Fivelogic**: write any logic with **only five constructs** which you can understand in a few minutes.
5. **Reactive**: the system is **always up to date** and responds to your changes (just like a spreadsheet!).
6. **Integrated editor**: language, database, API and UI are in one editor that runs in your web browser.
7. **Generative AI**: automatic intelligence that can write code for you, interpret data, or even act on your behalf when someone else interacts with your data.

## TODO

## Use cases

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
      - When reloading the page, if the selected element is far down/right enough, autoscroll to it automatically.
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

- Text to paths [DONE]
   - Dedash
   - Sort
   - Validate
- Paths to text [DONE]
- JS to paths & paths to JS [DONE]
- Reference (cell.get) [DONE]
- Storage (cell.put) [DONE]
   - [TODO] Experiment with put without v: just assume it is v. Also put without v, assume it is "". This is for initialization. And always return the old value and the new value. If the old value was nothing (not even an empty text), just return one value? No, because it could be ambiguous with some lists. Return a list with one item. So we have a diff. Or better: from and to.
   - [TODO] Give back a diff of paths instead of "ok"
- Entrypoint (cell.call) -- must rework.
   - Have an unified interface through cell.call.
   - Make cell.call return text, not paths. This would also improve the tests readability, perhaps.
- Rewrite all the existing tests and add new ones for anything untested.
- Sequence (cell.s)
   - Rename to s
   - Figure out how the expansion looks
   - Rework sequence so that it puts the expansions on each step, rather than on :. Use : only for common variables of the expansion, like the message.
   - Check if when redefining a sequence, and the redefinition has less steps than the original one, the extra steps of the previous expansion are also removed.
   - Allow early response with `response`
   - allow for multiple args (destructuring of lists) and no args (the sequence just there)
   - test fizzbuzz (http://localhost:2315/#/river-chair-phone)
   - test two step calls
   - test stop
   - test nested calls
   - test recursive calls
   - test descending funarg (pass function)
   - test ascending funarg (return function)
- Loops (cell.loop)



- Upload
   - Send a lambda call that does two things: 1) upload the file; 2) if data is not empty, set a link to it somewhere in the dataspace (name suggested by the llm).
   - Convention: if you send a lambda (@ do) over the wire, you want us to call it.
- Native calls
   - Allow single paths with multiple values for native calls for shorter notation.
   - add validations
   - allow + for text, + - for lists/hashes (for lists, by value, for hashes, by key), % for intersection.
   - test each of them, also with multiple arguments
- More calls: edit, push, lepush (left add), pop, lepop
- error (catch)
- search (general call to get matching paths)
- replace (macro): @! as lisp commas that turn off the quoting so that references are resolved at define time
- wall (block walking up, but not down)
- check: validation function
   - type
   - equality
   - range (for numbers): >, <, >=, <=
   - match (for text): regex (more verbose and readable format for regexes: More open regex format with lists: literal, character class, backreference or lookahead)
   - any other logic, really, the full language is there
- diff: takes one or two points of the dialog and gives you a diff.
- access masks
- Recursive lambdas by referencing itself?
- Efficient recalculation in cell.respond
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
endpoints
   email
   http
files
rules
views
```

## Development notes

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
         if (element.match (/\s/)) return 'The line `' + line + '` contains a whitespace that should be contained within quotes.';
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
   return paths;
}
```

#### `cell.dedasher`

TODO

#### `cell.sorter`

TODO

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

TODO

#### `cell.pathsToJS`

TODO

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

If an error was found, we return it as a path with `'error'` as the first element. Otherwise, we return an empty array to indicate the paths are valid.

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

If there is no `@` in this path, there are no calls. Therefore, there's nothing to do, so we ignore this path.

```js
   if (path.indexOf ('@') === -1) return;
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

To do this, we first take the prefix of the path, which is the target path without the `=` at its end, plus `@` and the first element of the `valuePath`.

```js
   var prefix = targetPath.slice (0, -1).concat (['@', valuePath [0]]);
```

We then get all the paths and see what's the position of this path in all of them. This is currently extremely inefficient, but when we decide to improve `get`, we can also do this in a more efficient way.

```js
   var paths = get ();
   var index = dale.stopNot (paths, undefined, function (v, k) {
      if (teishi.eq (path, v)) return k;
   });
```

We only need to check if the previous path also matches this prefix. If there's no previous path, or if the previous path has a length smaller than that of the prefix, or if its prefix doesn't match the prefix we have here, then this is the first path for this call.

```js
   var firstPath = index === 0 || paths [index - 1].length < prefix.length || ! teishi.eq (paths [index - 1].slice (0, prefix.length), prefix);
```

If this is not the first path for this call, we return and do nothing else, to avoid unnecessary execution.

```js
   if (! firstPath) return;
```

We get the previous value (the value at `targetPath`). A subtle and important detail: as context path, we pass `contextPath`, which is everything on this path that is not a reference.

```js
   var previousValue = cell.get (targetPath, contextPath, get);
```

We will now discover what the `currentValue` (that is, a list of paths that will have the prefix of `targetPath`), should be.

We first deal with the case where there's an `if` at the beginning of `valuePath`. We do so by invoking `cell.if`. To this function, we pass the `prefix` (that is, the `targetPath`, minus the `=` at its end, plus a `@ if`). We also pass `contextPath`.

`cell.if` will return a list of paths that we store in `currentValue`.

```js
   if (valuePath [0] === 'if') {
      var currentValue = cell.if (prefix, contextPath, get);
   }
```

If there's a `do` at the beginning of `valuePath`, this is a sequence definition. We then invoke `cell.do` and save the paths returned by it in `currentValue`.

As for the arguments we pass to `cell.do`, we pass a `define` text to let it know this is a definition (not an execution). We also pass the `prefix` (like we did in the case of `cell.if`) except that it would be instead `foo @ do`. We also pass a `null` that is a placeholder for an argument we will only need when *executing* a call.

```js
   else if (valuePath [0] === 'do') {
      var currentValue = cell.do ('define', prefix, contextPath, null, get);
   }
```

Otherwise, we just call `cell.get` directly.

```js
   else {
      var currentValue = cell.get (valuePath, contextPath, get);
```

If we find that the current value is a call that has not been responded to yet, we will ignore its current value. How would we know this? If it is a call (because it starts with `@`) and it doesn't have an `=` as the first step of the first path, we know it hasn't been responded to yet. This is necessary when we're trying to respond to a call to a call, and the inner call hasn't been responded to yet. We have a test for this with the tag "Make a reference to a reference in order ba//dc//cb".

```js
      if (currentValue [0] && currentValue [0] [0] === '@') return;
```

Now for the interesting bit. If we get no paths from our call to `cell.get`, there could be a sequence call in the `valuePath`. So we are going to figure out if that's the case.

```js
      if (currentValue.length === 0) {
```

Imagine that our `valuePath` is something like this: `bar 10`. Imagine that `bar` is a sequence, defined elsewhere, that takes a single number as its message. This could be a sequence call!

Now imagine that we have a path that is `bar cocktail 5`. We may have `bar cocktail` defined as a sequence (and we'd pass `5` as its message) or we may have `bar` as a sequence (and we'd pass `cocktail 5`) as a message. All we know is that, if any of these is a possible call, there has to be a valid point in which to split the left part from the right part.

So we are going to find out like this: we are going to iterate as many times as there are steps in `valuePath`. We start by getting the `valuePath`, chopping of n elements (starting with `n` as `1`), and concatenating `@ do` to that path. We then `cell.get` that path, using our `contextPath`.

If we didn't get something, we just keep on trying until the iteration finishes.

If we did get something, that means that we found a prefix of `valuePath` where there's a sequence definition. We will consider that to be our `definitionPath` and consider whatever is to its right (in the `valuePath`) to be the `message`.

```js
         var call = dale.stopNot (dale.times (valuePath.length, 1), undefined, function (k) {
            var value = cell.get (valuePath.slice (0, -k).concat (['@', 'do']), contextPath, get);
            if (value.length) return {definitionPath: valuePath.slice (0, -k).concat (['@', 'do']), message: valuePath.slice (-k)};
         });
```

If there is indeed a call to a sequence in our `valuePath`, we invoke `cell.do`, passing the `definitionPath`, the `contextPath`, and the message (whatever is to the right of `definitionPath` inside `valuePath`.

First, we might need to change `prefix` to reflect the fact that `definitionPath` is more than three steps long. This could happen if we are invoking something available at `x y` (instead of just at `x`). In that case, the `y` should also be added to the prefix, so it can be removed from the message.

```js
         if (call) {
            if (call.definitionPath.length > 3) prefix = prefix.concat (call.definitionPath.slice (1).slice (0, -2));
```

We also need to collect all the paths inside the message, which could be many. For that, we iterate all the paths after path that have the same prefix as this one, and return whatever is after the prefix. This is the reason, by the way, for us updating the prefix just above.

```js
            call.message = [];
            dale.stopNot (paths.slice (index), true, function (v) {
               if (v.length < prefix.length) return;
               if (teishi.eq (v.slice (0, prefix.length), prefix)) return call.message.push (v.slice (prefix.length));
            });
```

OK, now we're ready. `cell.do` will return a set of paths that we will set on the `targetPath`. It will also directly set the expansion of `targetPath`, but it won't return it. We will cover that when we annotate `cell.do`.

```js
            currentValue = cell.do ('execute', call.definitionPath, contextPath, call.message, get, put);
         }
```

If there's no call, we check to see if this is a native call. We get the message using the same mechanism we did in the previous block.

```js
         else {
            var message = [];
            dale.stop (paths.slice (index), undefined, function (v) {
               if (v.length < prefix.length) return;
               if (teishi.eq (v.slice (0, prefix.length), prefix)) return message.push (v.slice (prefix.length));
            });
```

Then we call `cell.native`, passing the first step of `valuePath` and the `message`. If we get something other than `false`, it means this is a native call, so we set the returned value to `currentValue`.

```js
            var nativeResponse = cell.native (valuePath [0], message);
            if (nativeResponse !== false) currentValue = nativeResponse;
         }
```

This concludes the case of neither `if` or `do`.

```js
      }
   }
```

By now, we have a `currentValue`. If we got no paths in `currentValue`, we set it to a single path with a single empty text. This will allow us to have paths like `foo = ""`, which is more illustrative (and correct) thatn `foo =`.

```js
   if (currentValue.length === 0) currentValue = [['']];
```

If the previous value and the current value are the same, we don't have to do anything, so we return.

```js
   if (teishi.eq (previousValue, currentValue)) return;
```

If we're here, we will update the dataspace. We create `pathsToPut`, with the paths that we will pass to `cell.put`.

```js
   var pathsToPut = [['p'].concat (targetPath)];
```

We iterate the paths in `currentValue`, prepend them with `v` and add them to `pathsToPush`.


```js
   dale.go (currentValue, function (path) {
      pathsToPut.push (['v'].concat (path));
   });
```

We call `cell.put` with `pathsToPut` as `paths` and an empty context path.

```js
   cell.put (pathsToPut, [], get, put);
```

We then return `true` to stop the iteration. What iteration, you may ask? Well, `cell.put` is calling `cell.respond` on each of the paths of the dataspace, one at a time. When one of these calls to `cell.respond` triggers a call to `cell.put`, we don't want the outer call to `cell.put` redoing all the work; we'll just leave that to the inner call to `cell.put`. Returning `true` is a way to stop the outer loop. This is only done for efficiency purposes.

```js
   return true;
```

This finishes the loop and the function.

```js
}
```

#### `cell.native`

TODO

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
   if (type (messageName) !== 'string') return [['error', 'The definition of a sequence must contain a name for its message.']];
```

We forbid `seq` to be the name of the message. We already are going to use `seq` to show the expansion of each step of the sequence, and we want to avoid overwriting it.

```js
   if (messageName === 'seq') return [['error', 'The name of the message cannot be `seq`.']];
```

We forbid that there should be multiple messages.

```js
   if (dale.keys (cell.pathsToJS (definition)).length !== 1) return [['error', 'The definition of a sequence can only contain a single name for its message.']];
```

The definition of a sequence has to start with a list that starts at element 1. We also check that the sequence has only consecutive steps. If any of these conditions is violated, we return an error.

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

If we are here, we are executing a sequence. We start by defining `output` to be a single path with a single step (an empty text).

```js
   var output = [['']];
```

If we are executing a sequence, we need to do two things. We need to compute the expansion of this execution, and we need to return a value for its response. We are not going to do this at once, but by steps. This is not unlike the way that `cell.respond` gradually expands paths that have multiple calls.

We have already decided that the final value (response) to the execution will be returned in `output`. We have also decided that any changes to the expansion will be performed not by returning those, but rather by calling `cell.put` directly.

If we think of our requirements for a `cell.do` execution, they are the following:
- Put the message in `:` using the message name and the actual value of it.
- Take the steps in the definition and expand them one at a time. If one of them responds with a path that starts with `stop` or `error`, we stop and don't go further.
- Take the value of the last step of the sequence and return that as `output`.

There are two more things that makes this even trickier:
- We must "wait" until any recursive calls (`@`s to the right, in our message or our steps) have results.
- The definition can be updated, so we need to ensure that we are using the latest one.

How are we going to tackle all of this? It took a while to figure out. Here it is:

- We consider the message to be a sort of step zero of the definition. Basically, we treat it like a step.
- We write a function `stripper` that takes the message, or a step of the sequence, and removes everything that's either an expansion or a response from it. This allows us to compare two sets of paths and decide whether the definition used is correct or stale.
- We run each of the steps (starting with the message) through the stripper and compare them to the definition. If one is different, we replace it with the one from the definition and stop - a later call will proceed with the work. When we stop, we return that empty `output` we defined above. Otherwise, we carry on.
- If we make it all the way to the end, or find a stopping value (`stop` or `error`), we have a response, so we return `output`.

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

We get the previous expansion by getting what's currently at `contextPath` plus `:`. From there, we remove `seq` and just get the previous message.

```js
   var previousExpansion = cell.get (contextPath.concat (':'), [], get);
   var previousMessage = dale.fil (previousExpansion, undefined, function (path) {
      if (path [0] !== 'seq') return path;
   });
```

We compare the stripped previous message with the stripped message we received as an argument.

```js
   if (! teishi.eq (stripper (previousMessage), stripper (dale.go (message, function (path) {
      return [messageName].concat (path);
   })))) {
```

If they are not the same, that can be because of two reasons:

1. This is the first time that this call is being responded.
2. The message name, or its value, changed.

In both cases, the required action is the same: we will then set `contextPath` plus `:` to the new message. We do this through a direct call to `cell.put`.

```js
      cell.put ([
         ['p'].concat (contextPath).concat (':'),
      ].concat (dale.go (message, function (v) {
         return ['v', messageName].concat (v);
      })), [], get, put);
```

We then return `output` (which will be a single path with an empty text) and close the case where the message has changed.

```js
      return output;
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

We will iterate up to n times, where `n` is the length of the sequence. We will use anything that's not `undefined` as a way to break out of the loop early.

```js
   dale.stopNot (dale.times (sequenceLength, 1), undefined, function (stepNumber) {
```

The previous step is the step already stored at `contextPath` plus `: seq <step number>`. It's "previous" in the same way we earlier referred to `previousExpansion` vs `currentExpansion`, not as in step `n - 1`.

```js
      var previousStep = cell.get (contextPath.concat ([':', 'seq', stepNumber]), [], get);
```

We also get the current step from the definition, slicing the number from the front.

```js
      var currentStep = dale.fil (definition, undefined, function (path) {
         if (path [0] === stepNumber) return path.slice (1);
      });
```

As with the message, we compare the previous step and the current step. If they differ, we set the current step at `contextPath` plus `: seq <step number>`.

```js
      if (! teishi.eq (stripper (previousStep), stripper (currentStep))) return cell.put ([
         ['p'].concat (contextPath).concat ([':', 'seq', stepNumber]),
      ].concat (dale.go (currentStep, function (v) {
         return ['v'].concat (v);
      })), [], get, put);
```

Note that in the body of the conditional above, we are returning the result of `cell.put`, which will stop the loop early because it's not `undefined`.

We will now get the value of this step. To do this, we need to:

- See if the value of the step contains a call.
- If it does, concatenate a `=` to its path, so we can get the proper value.
- If it doesn't, the step itself is the value.

```js
      var existingValuePath = contextPath.concat ([':', 'seq', stepNumber]);
      if (teishi.last (currentStep) [0] === '@') existingValuePath.push ('=');
      var existingValue = cell.get (existingValuePath, [], get);
```

If there's no value yet (because the call hasn't been expanded), just give up (by returning `true`) and come back later.

```js
      if (existingValue.length === 0) return true;
```

If we're here, there's an existing value already.

If that existing value is a stopping value (a hash with a key error or stop), or we are at the last step of the sequence, we set `output` to `existingValue`. We also return `true` to stop the sequence. We don't really need to return `true` if we are at the last step of the sequence, but since we're using a joint conditional to do the same if we find a stopping value, we just return `true` always anyway.

```js
      if (['error', 'stop'].includes (existingValue [0] [0]) || stepNumber === sequenceLength) {
         // We have a stopping value!
         output = existingValue;
         return true;
      }
```

We close the iteration over the steps of the sequence, return `output` and close the function.

```js
   });

   return output;
}
```

#### `cell.get`

We now define `cell.get`, which performs `reference` for us. It takes three arguments:

- A `queryPath`, which is the path of what we're looking for.
- A `contextPath`, which is the path of where we're currently standing. For calls that come from outside, this will be an empty list.
- `get`, a storage-layer function that gives us the entire dataspace.

```js
cell.get = function (queryPath, contextPath, get) {
```

We start by getting all the paths in the dataspace.

```js
   var dataspace = get ();
```

If the first element of `queryPath` is a dot, this has a special meaning: it means search *right here*, don't walk up. In this case, we will set a variable `dotMode` and remove the dot from `queryPath`.

```js
   var dotMode = queryPath [0] === '.';
   if (dotMode) queryPath = queryPath.slice (1);
```

We will try to find the `queryPath` at the deepest possible level in `contextPath`. The simplest case is when `contextPath` has length 0. In this case, we just go through the entire dataspace once and find any paths that start with the elements in `queryPath` (if `queryPath` is itself empty, we then match every single path in the dataspace!). These are the `matches` we get.

If `contextPath` has more than length 0, we start by finding all the paths that match it. We then shave off the `contextPath` as prefix from each of the matched paths and we go through all of them to find what matches with `queryPath`.

In this way, the function walks "up" the context path, removing elements from its end, and stopping when it finds one or more paths that match the query.

We will run a loop that stops on not `undefined` and runs at most the length of contextPath + 1 (the + 1 is to run it against an empty context path).

However, in dot mode, we will just run the loop one time, to prevent "walking up".

```js
   return dale.stopNot (dale.times (! dotMode ? contextPath.length + 1 : 1, contextPath.length, -1), undefined, function (k) {
```

We go through the dataspace and accumulate any paths that will match both the current context path and the query.

```js
      var matches = dale.fil (dataspace, undefined, function (path) {
```

If our context path has elements and those elements don't match with the prefix of this path we're iterating, we skip this path.

```js
         if (contextPath.length && ! teishi.eq (contextPath.slice (0, k), path.slice (0, k))) return;
```

We found a match for the context path! We remove its prefix.

```js
         path = path.slice (k);
```

If the path, minus the context prefix (which we sliced in the previous line), matches the query path, we return it. We only return paths for which there is a suffix after the query path.

This completes the inner loop.

```js
         if (teishi.eq (queryPath, path.slice (0, queryPath.length)) && path.length > queryPath.length) return path.slice (queryPath.length);
      });
```

If we found matching paths for this context path, we return them and stop the outer loop.

```js
      if (matches.length > 0) return matches;
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

We validate the `paths` in a very lazy way: we convert them to JS. If we don't get a hash (object) with keys `p` (optional) and `v` (mandatory), we return an error. `p` is the path where we want to write, whereas `v` is the value that we will write to `p`. In more traditional terms, `p` is the left side of the assignment and `v` is the right side of the assignment. I guess that `put` really does is to provide `assignment`.

`p` can be absent, in which case we'll default to an empty path. This allows you to write multiple values at the top level.

```js
   var topLevelKeys = dale.keys (cell.pathsToJS (paths)).sort ();
   if (! teishi.eq (topLevelKeys, ['p', 'v']) && ! teishi.eq (topLevelKeys, ['v'])) return [['error', 'A put call has to be a hash with a value (`v`) and an optional path (`p`).']];
```

We initialize two arrays, one for the "left side" of the assignment (the path that is inside the key `p`) and one for the "right side" (the values (paths) that will go on this path).

```js
   var leftSide = [], rightSide = [];
```

We iterate the paths. If the first element of one of these paths is `p`, we take out its first element (`p`) and push the rest as a new path onto `leftSide`. Otherwise, we also take out its first element and push it onto `rightSide`.

```js
   dale.go (paths, function (path) {
      (path [0] === 'p' ? leftSide : rightSide).push (path.slice (1));
   });
```

If there's more than one path in `leftSide`, we return an error. Inside a `put` call, we can only set one path at a time.

```js
   if (leftSide.length > 1) return [['error', 'Only one path can be put at the same time, but received multiple paths: ' + dale.go (leftSide, function (v) {return cell.pathsToText ([v])}).join (', ')]];
```

We take the sole path inside `leftSide` and set `leftSide` to it. If there's no `leftSide` because there was no `p`, we initialize it to an empty list.

```js
   leftSide = leftSide [0] || [];
```

We forbid overwriting `put`.

```js
   if (leftSide [0] === 'put') return [['error', 'I\'m sorry Dave, I\'m afraid I can\'t do that']];
```

We forbid overwriting `dialog` unless the `updateDialog` flag is passed.

```js
   if (leftSide [0] === 'dialog' && ! updateDialog) return [['error', 'A dialog cannot be supressed by force.']];
```

We get the entire dataspace onto memory. Isn't inefficiency fun?

```js
   var dataspace = get ();
```

As with `cell.get`, if the first step of `leftSide` is a dot, we will be in "dot mode", which is a mode that says we want to set things in the context we have instead of "walking up". In this case, we will set `leftSide` to be the context path plus left side, but removing the dot at the beginning of left side.

```js
   if (leftSide [0] === '.') leftSide = contextPath.concat (leftSide.slice (1));
```

Otherwise, we are now going to find a context path for which we get a match on `leftSide`. If `contextPath` is empty, this context path will also be empty. The interesting case is that for which `contextPath` is not empty.

This is best explained with an example. Let's say that `contextPath` is `['foo']`. And that `leftSide` is `['bar']`. If we find a `bar` inside `foo` (and we know we found one if we get one or more paths with that prefix), then the context path will be `['foo']`. Therefore, we will update the `bar` inside `foo`.

Now let's assume that there is no `bar` in `foo`. Then, if we get no matching paths inside `foo`, we will peel away the last element of the context path and get `[]`. Then, we'll set `bar` onto the general dataspace, without a prefix.

This peeling away is done one by one. This is what I refer to as "walking" up.

To implement this walking, we are going to iterate `contextPath.length` times. We will stop the iteration if we find that any prefix of `contextPath` gives us a match.

```js
   else {
      var contextPathMatch = dale.stopNot (dale.times (contextPath.length, contextPath.length, -1), undefined, function (k) {
```

We take the context path, remove the last k elements (we start at 0 the first time around) and concatenate the left side to it. This is our `contextPathWithSuffix`.

```js
         var contextPathWithSuffix = contextPath.slice (0, k).concat (leftSide);
```

We find one or more paths that start with this context path with suffix.


```js
         var matches = dale.stop (dataspace, true, function (path) {
            return teishi.eq (contextPathWithSuffix, path.slice (0, contextPathWithSuffix.length));
         });
```

If we found a match, this means that this context path plus the left side already exists. We now have the context path we will use, therefore we will return it.

```js
         if (matches.length) return contextPath.slice (0, k);
      });
```

If we found a context path that gets matches, then we will prepend the `leftSide` wtih it. Otherwise, we'll just put leave `leftSide` as is and put onto the general dataspace.

```js
      if (contextPathMatch !== undefined) leftSide = contextPathMatch.concat (leftSide);
    }
```

By now, `leftSide` has the absolute path where we want to set the value. To do this, we are going to re-create the dataspace by iterating through it. We first filter out any paths that start with `leftSide`.

We make an exception if `leftSide` is empty. In that case, we leave the paths as they exist. If we generate any inconsistencies, we'll detect them later when validating.

```js
   if (leftSide.length) dataspace = dale.fil (dataspace, undefined, function (path) {
      if (leftSide.length && teishi.eq (leftSide, path.slice (0, leftSide.length))) return;
      return path;
   });
```

We will then push all the paths in `rightSide` to dataspace. However, before doing this, we will prepend `leftSide` to each of these `rightSide` paths.

```js
   dataspace = dataspace.concat (dale.go (rightSide, function (path) {
      return leftSide.concat (path);
   }));
```

Now, the dataspace is updated. We sort it, then validate it.

```js
   cell.sorter (dataspace);
   var error = cell.validator (dataspace);
```

If we got an error, we will return that error. You might ask: what error could happen here? The one type of error that could happen is setting a certain path to a type X when it is already of a type Y (and you haven't fully re-setted the entire thing).

```js
   if (error.length) return error;
```

If we're here, then we are ready to persist these changes. We call `put` with the new `dataspace`.

```js
   put (dataspace);
```

We will now iterate the dataspace, running `cell.respond` of each of the paths, until we either finish iterating the paths or `cell.respond` returns `true`.

We call `cell.respond` in case some reference needs to be updated. If `cell.respond` finds that changes should happen, it will call `cell.put` in turn. In that way, `cell.put` and `cell.respond` will call each other recursively until all the changes are propagated. The `true` that `cell.respond` is only to make things more efficient and avoid unnecessary calls.

We don't validate the dataspace after calling `cell.respond` because no expansion of a call should generate an incorrect result: every call defines a hash (because `@` is text), so putting a `=` on the same prefix will not change the type of the prefix. Because of this, the call to `cell.put` from inside `cell.respond` doesn't check for errors returned by `cell.put`.

```js
   dale.stop (dataspace, true, function (path) {
      return cell.respond (path, get, put);
   });
```

We return `[['ok']]`. This closes the function.

```js
   return [['ok']];
}
```

#### `cell.wipe`

`cell.wipe` is the function that removes data from the dataspace. It takes a main argument which is `prefix`. When `prefix` is empty or undefined, `cell.wipe` will remove all paths from the dataspace. If it's defined and non-empty, `cell.wipe` will only remove from the dataspace the paths that start with that prefix.

Besides `prefix`, it also takes `get` and `put`: two functions that, when executed, either get the dataspace or update it. These are the storage-layer functions (`get` is the exact same function we pass to `cell.get` above).

```js
cell.wipe = function (prefix, get, put) {

   var dataspace = get ();
```

We iterate all paths in the dataspace; if a path is shorter than the prefix, we keep it (the prefix can only delete things that fully match it). If not, we compare the first n elements of the path with the prefix (where n is the length of the prefix) and if they are the same, we remove that path.

```js
   dataspace = dale.fil (dataspace, undefined, function (path) {
      if (prefix.length > path.length) return path;
      if (! teishi.eq (prefix, path.slice (0, prefix.length))) return path;
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


We update the dataspace through `put`, return OK and close the function.

```js
   put (dataspace);

   return ['ok'];
}
```

## Acknowledgments

[Kartik Agaram](http://akkartik.name) has provided extremely valuable insights and questions.

Leon Marshall has contributed the term "speak" to describe interactions between programs.

## License

cell is written by [Federico Pereiro](mailto:fpereiro@gmail.com) and released into the public domain.
