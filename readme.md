# cell

## Motivation

Programming is currently much harder than writing prose. Reading programs is also much harder than reading prose.

The goal of cell is to make programming easier, so that it is only as demanding as writing prose. By making programming more accessible to more writers and readers, we hope to empower more humans to create and own their own [information systems](https://github.com/altocodenl/todis).

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

## Do we still need programming tools? Can't we just ask AI to create systems for us?

My contention is: if you want to build data systems using AI, you need to do three things:

1. **Host** the system. The system has to be accessible on a continuous basis and its data has to be both secured and backed-up.
2. **Structure** the system. AIs, like humans, are fallible and inconsistent. It is very important to have solid parts in the system that maintain important constraints.
3. **Understand** the system. AIs, also like humans, get lost in a system when it becomes too complex. Having an approach that minimizes complexity can help both human and AI to understand the system and keep it maintainable and scalable.

Cell intends to make the hosting, control and understanding of your system to be as easy as possible -- even if you're not a programmer. So that you can build your systems with confidence.

## The seven powerups

Cell employs seven powerups to make programming as easy (or hard) as writing prose:

1. **Fourdata**: a simple way to **represent data with text**. This allows you to look directly at any data that comes your way.
2. **Dataspace**: a single space **where all the data of your project exists**. Every part of your data has a meaningful location.
3. **Dialogue**: programming as a **conversation**: you write *calls* to the system, and the system responds back with some data. You can see both your call and the response as data.
4. **Fivelogic**: write any logic with **only five constructs** which you can understand in a few minutes.
5. **Reactive**: the system is **always up to date** and responds to your changes (just like a spreadsheet!).
6. **Integrated editor**: language, database, API and UI are in one editor that runs in your web browser.
7. **Generative AI**: automatic intelligence that can write code for you, interpret data, or even act on your behalf when someone else interacts with your data.

## TODO

### Editor

- modal approach
- cursor that jumps to the next distinct element at the depth that you are.
- shrink to screen, no horizontal scroll, instead use ellipses
- quick search (macro?)
- table view?

### Language

- do
   - multiple paths in message for non-native call
   - native calls
      - remove eval from native calls
      - add validations
      - allow + for text, + - for lists/hashes (for lists, by value, for hashes, by key), % for intersection.
      - test each of them, also with multiple arguments
   - test nested calls
   - test recursive calls
   - test descending funarg (pass function)
   - test ascending funarg (return function)
- loop
- error (catch)
- query (general call to get matching paths)
- replace (macro)

### Database

- Sublinear get
   - Set from a path to all its following steps (just the next one)
   - Set from a step (by value) to all its prefixes

### Service

- ai
- outbound http
- email
- auth
- domain

## Illustrated use cases

- Civ2 analyzer
- Rent a crud
- Back tester for stocks
- Fitness companion for phone

## Other use cases

- Library catalog: Upload a CSV with book data. Make queries on the data. Expose them through an interface that draws a table.
- Logs and alerts: Push logs. Create queries on them. When certain logs come in, send an email or a notification.
- Spreadsheet database: Upload an XLS with data. Create a schema with the LLM and expose it as a table with associated form in an UI.
- Admin: place a DB dump. Run queries to detect inconsistencies and derive a better schema. Show these tables in an admin. Expose the dump through an HTTP endpoint in your service to update this.
- Usage dashboard: requests per second, also per code, bytes flowing. See fun data in real time.

## Relationship to the spreadsheet

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

## Innovations of cell

- Programming as message-based three-way communication between the environment, the user and the LLM.
- Immediate integration of files and emails into the dataspace.
- Integrated language, database, service and interface.
- Two general purpose representations of data: text and datagrid.
- Storing discrete calls in a dialog gives us both commits and transactions in a single construct. This allows us to query the system's state at any specific moment. We can also examine how the system evolves over time by reviewing the sequence of interactions. The calls are the diffs of the system. If the `get` call takes a parameter, we can query any previous state. And if the `put` call can take a condition and perform multiple operations as a whole, we can have reified transactions. These insights grow from the work of Datomic (thanks Val Waeselynck for your [great explanation](https://vvvvalvalval.github.io/posts/2018-11-12-datomic-event-sourcing-without-the-hassle.html)!).
- A first-class [intermediate representation](https://en.wikipedia.org/wiki/Intermediate_representation): paths. Computation as rewriting of paths.

## The cell editor

- The *main*: a main window that contains *cells*: smaller windows that show either text (fourdata) or graphical components.
- The *dialogue*: a dialogue window that combines the concept of a terminal with that of an LLM prompt, enabling a dialogue between the user, an LLM and cell. Any message starting with @, whether it comes from the user or the LLM, is understood as a call to cell. Any message sent by the user that is not starting with a @ is sent to the LLM, which will then respond with other messages and possibly calls to cell. Calls to cell will control the interface as well as put data in the dataspace (actually, the interface is simply an interpretation of part of the dataspace, but we mention it as an important special case). cell won't output anything on the dialogue, its results will be seen (optionally) in the main window.

In desktop, the main window will be 70% of the width of the screen, to 30% of the vertical stream of messages between user, LLM and cell.

In mobile, the interface will be modal, showing either the main or the dialog.

The LLM can be provided through an API token or offered as a service, but in the end, it doesn't really matter. What matters are the twin intelligences of user and LLM used to paint a picture of data in cell.

The key insight carried from the [shell](https://en.wikipedia.org/wiki/Shell_(computing)) is that the the calls sent to cell, whether they originate from the LLM or from the user, are indistinguishable.

An interesting development of this design is that programming becomes an act of communication with cell and the LLM. This taps into the social nature of language.

## The data representation: `fourdata`

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

## The language

Please see [here](https://github.com/altocodenl/TODIS?tab=readme-ov-file#pillar-3-call-and-response) and [here](https://github.com/altocodenl/TODIS?tab=readme-ov-file#pillar-4-logic-is-what-happens-between-call-and-response).

## Organization of a cell

```
dialogue
editor
   search
endpoints
   email
   http
rules
views
```

**DEAR READER: cell is currently vaporware; everything below this message has to undergo intense work to be worthy of standing by itself. Below are very roughly sketched areas. They are quite unreadable. If they don't make sense to you, it's likely because they don't make sense at all, yet.**

### The editor

It's going to be like a vim! only that you start in insert mode :)
Make the editor move per word, rather than by character. only in insert mode move by character.
Use keys E and R for expand and reduce.
Always a cursor pointing at data.
when you see the values only, you're compressing the part that does the computation, which extends down and to the right. it's like a macro, the resolving of it, but it's just code that runs through the data and gives you a part of it.

## Comparison between cell and other programming languages

cell most resembles the following programming languages: [Tcl](https://en.wikipedia.org/wiki/Tcl), [J](https://en.wikipedia.org/wiki/J_(programming_language)) and other array languages and [lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)). To a lesser extent, [Forth](https://en.wikipedia.org/wiki/Forth_(programming_language)).

Like all of these languages, cell is [homoiconic](https://en.wikipedia.org/wiki/Homoiconicity). The languages above have almost no syntax; we can perhaps ay that cell has no syntax, apart from the syntax used to represent alf.

Like these languages, cell has text, number and list as first-class structures. Unlike them, it has native support for hashes. This is, in my opinion, the biggest advantage that cell has over lisp.

The main differences between cell and these languages is the embodiment of [pillars 2 and 3 of TODIS](https://github.com/altocodenl/todis?tab=readme-ov-file#the-five-pillars):
- All the data exists in a single dataspace that is fully addressable.
- The execution of the interpreter happens within this dataspace, so that intermediate results can be seen and manipulated.

The two decisions above make macros just like normal programming, by simply modifying the intermediate results of the interpreter.

Like Tcl with [Tk](https://en.wikipedia.org/wiki/Tk_(software)), the interface maker comes integrated with the language. Unlike the languages above, cell also comes integrated with a server to expose an API.

## The database

TODO: everything :)

Four validations:
- type
- equality
- range for numbers
- match for text

More open regex format with lists: literal, character class, backreference or lookahead

How is this implemented? Make a single table on a relational database, with 2000 columns, the odd ones text and the even ones number. For a path element at position m, store it in m\*2 if it's text and m\*2+1 if it is a number. perform queries accordingly.

What do you get out of this?
- ACID, because it's backed by a relational database.
- Fast querying on arbitrary path elements.
- Range and match tests.

Tackling consistency:
- run the sync code in the db within a transaction
- make async ops not have consistency requirements except for checking things when they are ready for sync again
- have one source of truth for every part of the dataspace and replicas for each of them, for backup purposes. but you can fragment it as much as you want.
- If you don't want this, you can build a consensus algorithm on top of it and consider equivalences in paths (if X and Y are equal nodes, you can make random calls to X or Y).

Vague but compelling: every change generates a new id. This can recompute the entire dataspace affected by it. This creates a snapshot. The latest versions are resolved lexically.

## The service

TODO: everything :)

## The interface maker

Reactive connections to data sources (like server) to always have fresh data. You can avoid refreshing if it affects user experience, but still have the data ready.

PWAs out of the box.

Forms and reports just are interfaces.

TODO: everything :)

## Other stuff

### Ideas

- files
- automatic email by project
- local vs remote reference

macros: can be completely runtime, in the language. we can use `replace`, which takes a `target`, `what` and `with`. `@@` are like lisp commas, that turn off the quoting, so you can resolve references at define time.

### departures of cell from lisp

- Include hashes as a base type
- Specify exactly how data looks like in terms of pretty-printing
- No parenthesis, but a couple of evaluation rules (still too few to be considered a proper full-blown syntax)
- Everything's quoted by default, you need to make calls explicitly
- Macros are simple data manipulation operations on sequences. The explicitness of @ allows this, because it can considered as data until it is expanded.

## TODO

- Altocookies: login with email with link or oauth with providers that always provide email (google)
- Cloud: main implementation in redis, backup in postgres. Option to acknowledge writes only when they're also in postgres.
- Implement the editor in cell itself, so that it interacts with the cell server through the same mechanisms.
- Recursive lambdas by referencing itself from inside the loop?
- Diff by non-abridged fourdata with nonlexicographic sorting of number keys, lines of rem, add & keep.
- PWAs out of the box.
- Encrypted dumps/restores.
- Implementation of U and of pg's lisp interpreter.
- Self-hosting.

- Parsing issues I am playing dumb about:
   - Distinguishing literal dots in hashes.
   - Multiline texts in the middle of paths that then have one below that's indented up (or further) than the position of the multiline text in the previous path.

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

But wait, how can `v` be `null`? I forgot to mention that, because we allow dots as placeholders of the keys of lists, we need to account for when there's indentation below these dot placeholders. The only unambiguous way I found to do this (see `cell.textToPaths` below) is using `null`. In these cases, `null` will be a single space. Therefore, in this function, we return a single space. Moving on...

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

A flag that tells us whether we are inside a multiline text, which starts as `false`.

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

If we encounter an empty line, and we are not inside multiline text, we just ignore this line. This is useful in case we get a message that has empty lines in it, usually at the beginning or end.

```js
      if (line.length === 0 && ! insideMultilineText) return;
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

However, a subtle point! If we have a dot on the previous path, we don't want to copy that, because if we add a dot, the `cell.dedotter` function will understand this to be a new element of a list, rather than belonging to the existing one. To mark these indentations that stand for belonging to the same (dotted) element of a list, we cover our noses and use `null`.

```js
         path = dale.go (lastPath.slice (0, matchUpTo + 1), function (v) {
            return v === '.' ? null : v;
         });
```

Note that, in the above loop, if there were already a previous `null`, we will also copy it over.

We chop off the indentation off the line.

```js
         line = line.slice (matchedSpaces);
```

```js
         if (line.length === 0) return 'The line `' + originalLine + '` has no data besides whitespace';
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
               var slashes = text.slice (0, k + 1).match (/\/{0,}"$/);
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

If there is no second non-literal double quote, we just opened a new multilinte text! We set the flag.

```js
            if (dequoted.end === -1) {
               insideMultilineText = true;
```

Then, we push the entire dequoted text (plus a newline) to the path as a new element. We then set `line` to an empty text.


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
         if (element.match (/\s/)) return 'The line `' + line + '` contains a space that is not contained within quotes.';
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

If the flag that marks we are inside multiline text is still set, there's an error. We report it.

```js
   if (insideMultilineText) return [['error', 'Multiline text not closed: `' + teishi.last (teishi.last (paths)) + '`']];
```

If we are here, the parsing was successful. We return `paths` and close `textToPaths`.

```js
   return paths;
}
```

#### `cell.dedotter`

TODO

#### `cell.sorter`

TODO

#### `cell.pathsToText`

TODO

#### `cell.JSToPaths`

TODO

#### `cell.pathsToJS`

TODO

#### `cell.validator`

TODO

#### `cell.call`

TODO

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

```js
   dale.stopNot (path, undefined, function (v, k) {
      if (v === '@' && path [k + 1] === 'do') return rightmostAt = k;
   });
```

Three very important variables, all of them paths:

- The **context path** is everything to the left of `leftmostAt`. That is, everything that's not a reference, is our context.
- The **target path** is everything to the left of `rightmostAt`, plus an `=`. This is the common prefix of all the paths we are going to create or update. Think of it as the left part of our assignment. If the path we are looking at is `foo @ ...`, then we know that all the paths we will set are going to be of the shape `foo = ...`.
- The **value path** is everything to the right of `rightmostAt`. This is the right part of our assignment, where we're getting the value from. Note we actually remove any `=` from it; this allows us to "go get" the values of calls that have been responded already.


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

We only need to check if the previous path also matches this prefix. If there's no previous path, or if the previous path has a length than prefix, or if its prefix doesn't match the prefix we have here, then this is the first path for this call.

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

We first deal with the case where there's an `if` at the beginning of `valuePath`. We do so by invoking `cell.if`. To this function, we pass the `targetPath`, minus the `=` at its end, plus a `@ if`. So, for example, if `targetPath` is `foo =`, we will pass `foo @ if`. We also pass `contextPath`.

`cell.if` will return a list of paths that we store in `currentValue`.

```js
   if (valuePath [0] === 'if') {
      var currentValue = cell.if (targetPath.slice (0, -1).concat (['@', 'if']), contextPath, get);
   }
```

If there's a `do` at the beginning of `valuePath`, this is a sequence definition. We then invoke `cell.do` and save the paths returned by it in `currentValue`.

As for the arguments we pass to `cell.do`, we pass a `define` text to let it know this is a definition (not an execution). We also pass a modified `targetPath` (like we did to `cell.if`) except that it would be instead `foo @ do`. We also pass a `null` that is a placeholder for something we'll only need when `executing` a call.

```js
   else if (valuePath [0] === 'do') {
      var currentValue = cell.do ('define', targetPath.slice (0, -1).concat (['@', 'do']), contextPath, null, get);
   }
```

Otherwise, we just call `cell.get` directly.

```js
   else {
      var currentValue = cell.get (valuePath, contextPath, get);
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
               if (teishi.eq (v.slice (0, prefix.length), prefix)) {
                  call.message.push (v.slice (prefix.length));
                  return true;
               }
            });
```

OK, now we're ready. `cell.do` will return a set of paths that we will set on the `targetPath`. It will also directly set the expansion of `targetPath`, but it won't return it. We will cover that when we annotate `cell.do`.

```js
            currentValue = cell.do ('execute', call.definitionPath, contextPath, call.message, get, put);
         }
```

TODO: add annotated source code for native calls.

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
- `updateDialogue`: a flag that, if truthy, will allow to update the dialogue. This is to protect the `dialogue`, which is a special key. This will be replaced by a better validation mechanism later.

```js
cell.put = function (paths, contextPath, get, put, updateDialogue) {
```

We validate the `paths` in a very lazy way: we convert them to JS. If we don't get a hash (object) with keys `p` and `v`, we return an error. `p` is the path where we want to write, whereas `v` is the value that we will write to `p`. In more traditional terms, `p` is the left side of the assignment and `v` is the right side of the assignment. I guess that `put` really does is to provide `assignment`.

```js
   var topLevelKeys = dale.keys (cell.pathsToJS (paths)).sort ();
   if (! teishi.eq (topLevelKeys, ['p', 'v'])) return [['error', 'A put call has to be a hash with path and value (`p` and `v`).']];
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

We take the sole path inside `leftSide` and set `leftSide` to it.

```js
   leftSide = leftSide [0];
```

We forbid overwriting `put`.

```js
   if (leftSide [0] === 'put') return [['error', 'I\'m sorry Dave, I\'m afraid I can\'t do that']];
```

We forbid overwriting `dialogue` unless the `updateDialogue` flag is passed.

```js
   if (leftSide [0] === 'dialogue' && ! updateDialogue) return [['error', 'A dialogue cannot be supressed by force.']];
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

```js
   dataspace = dale.fil (dataspace, undefined, function (path) {
      if (teishi.eq (leftSide, path.slice (0, leftSide.length))) return;
      return path;
```

We will then push all the paths in `rightSide` to dataspace. However, before doing this, we will prepend `leftSide` to each of these `rightSide` paths.

```js
   }).concat (dale.go (rightSide, function (path) {
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

## Acknowledgments

[Kartik Agaram](http://akkartik.name) has provided extremely valuable insights and questions.

Leon Marshall has contributed the term "speak" to describe interactions between programs.

## License

cell is written by [Federico Pereiro](mailto:fpereiro@gmail.com) and released into the public domain.
