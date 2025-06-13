# cell

> Your data and your logic, together at last.

## Introduction

Cell is a tool that allows you to create [data systems](https://github.com/altocodenl/todis) (think spreadsheets, apps, pages) with ease. Particularly if you don't consider yourself to be a programmer.

Cell allows you to allow you to transform your data into a system that perfectly fits your needs.

I'm currently recording myself while building cell. You can check out [the Youtube channel here](https://www.youtube.com/channel/UCEcfQSep8KzW7H2S0HBNj8g).

## Do we still need programming tools? Can't we just ask AI to create systems for us?

My contention is: if you want to build data systems using AI, you need to do three things:

1. **Host** the system. The system has to be accessible on a continuous basis and its data has to be both secured and backed-up.
2. **Control** the system. AIs, like humans, are fallible and inconsistent. It is very important to have rigid parts in the system that enforce constraints.
3. **Understand** the system. AIs, also like humans, get lost in a system when it becomes too complex. Having an approach that minimizes complexity can help both human and AI to understand the system and keep it maintainable and scalable.

Cell intends to make the hosting, control and understanding of your system to be as easy as possible -- even if you're not a programmer. So that you can build your systems with confidence. This simplicity comes from seven powerups.

## The seven powerups

Cell employs seven powerups to make programming as easy as possible:

1. **Fourdata**: a simple way to **represent data with text**. This allows you to look directly at any data.
2. **Dataspace**: a single space **where all the data of your project exists**. Every part of your data has a meaningful location.
3. **Dialogue**: programming as a **conversation**: you write *calls* to the system, and the system responds back with some data. You can see both your call and the response as data.
4. **Fivelogic**: write any logic with **only five constructs** which you can understand in a few minutes.
5. **Reactive**: the system is **always up to date** and responds to your changes (just like a spreadsheet!).
6. **Integrated editor**: language, database, API and UI are in one editor that runs in your web browser.
7. **Generative AI**: automatic intelligence that can write code for you, interpret data, or even act on your behalf when someone else interacts with your data.

## Use cases

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

This function takes a value `v` that's either a number or text. We know it is a number or text because we only pass to it path elements, which by design can only be text or number. It will then return the text that, when parsed, becomes the element.

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

If the value is text, and the text "looks" like a number (can start with a minus, can have one or more digits before a dot with a dot (or no dot), and has a bunch of digits after that), we return it surrounded by double quotes.

```js
   if (v.match (/^-?(\d+\.)?\d+/) !== null) return '"' + v + '"';
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

This function takes a `message`, which is text, and returns an array of paths. If it finds a parsing error, it will also return it as a list of paths with one path, where the first element of that path is the text `error`.

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

// LONG UNCOMMENTED FRAGMENT

We now define `cell.respond`, a function that will be called by `cell.put` when an update takes place. This function expands calls, that is: it takes the response to any calls and puts them in the dataspace.

This function takes just two arguments: `get`, a storage-layer function that gives us the entire dataspace, and `put`, which is the same but for updating the dataspace.

```js
cell.respond = function (get, put) {
```

We get the entire dataspace.

```js
   var dataspace = get ();
```

The outermost structure of the function is a loop that goes over each `path` on the dataspace and stops at the first change it finds. We will use `true` to signal that a change has happened, as our way to stop.

```js
   dale.stop (dataspace, true, function (path) {
```

We find the indexes of all the steps that are equal to `@` in the path.

```js
      var at = dale.fil (path, undefined, function (v, k) {
         if (v === '@') return k;
      });
```

If there are none, we ignore this path and keep on going.

```js
      if (at.length === 0) return;
```

We will work on the `@`s, right to left. We start a while loop.

```js
      while (at.length) {
```

We get the index of the rightmost `@` and remove it from the list.

```js
         var rightmostAt = at.pop ();
```

We set a `queryPath` to be the prefix (everything to the left) of the rightmost at.

```js
         var queryPath = path.slice (0, rightmostAt);
```

We get the current value of the query path plus an `=`. We pass that to `cell.get`.

```js
         var currentValue = cell.get (queryPath.concat ('='), [], get);
```

We get the desired value of the suffix (everything to the right of the `@`). Note we remove any `=` from this path. This will be our query path. The reason we remove `=`s from this path is that we want to "jump over" any equals to get the result of something. This is necessary for indirect references.

Now, a tricky thing: the context path for this call to `get` will be our query path! This is a bit mind-bending, but it makes sense. We want the reference (that is after the `@`) to be resolved in the context of `queryPath`!

```js
         var desiredValue = cell.get (dale.fil (path.slice (rightmostAt + 1), '=', function (v) {return v}), queryPath, get);
```

If the existing value and the desired value are the same, we skip this `@` and restart at the top of the `while` loop.

```js
         if (teishi.eq (previousValue, currentValue)) continue;
```

If we are here, we are going to call `cell.put` with the desired value. We start by determining where these new values will be set: in the `queryPath`, appended with an `=`. However, if `queryPath` already ends with `=`, we don't append one.

```js
         if (teishi.last (queryPath) !== '=') queryPath.push ('=');
```

We create `pathsToPut`, with the paths that we will pass to `cell.put`.

```js
         var pathsToPut = [
            ['p'].concat (queryPath),
         ];
```

We iterate the paths in `desiredValue`, prepend them with `v` and add them to `pathsToPush`.


```js
         dale.go (desiredValue, function (path) {
            pathsToPut.push (['v'].concat (path));
         });
```

We call `cell.put` with `pathsToPut` as `paths` and an empty context path. We then return `true` to stop the iteration.

```js
         cell.put (pathsToPut, [], get, put);
         return true;
```

This closes the while, the outer loop and the function.

```js
      }
   });
}
```

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

`put` is the function that adds data to the dataspace. It takes a whopping five arguments.

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

We call `cell.respond` in case some reference needs to be updated. If `cell.respond` finds that changes should happen, it will call `cell.put`. In that way, `cell.put` and `cell.respond` will call each other recursively until all the changes are propagated.

We don't validate the dataspace after calling `cell.respond` because no expansion of a call should generate an incorrect result: every call defines a hash (because `@` is text), so putting a `=` on the same prefix will not change the type of the prefix. Because of this, the call to `cell.put` from inside `cell.respond` doesn't check for errors returned by `cell.put`.

```js
   cell.respond (get, put);
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
