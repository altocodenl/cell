# cell

> Your data and your logic, together at last.

## Introduction

Cell is a tool that allows you to create [data systems](https://github.com/altocodenl/todis) (think spreadsheets, apps, pages) with great ease. Particularly if you don't consider yourself to be a programmer.

The purpose of cell is to empower you to transform your data into a system that perfectly fits your needs and that you can change at any time.

I'm currently recording myself while building cell. You can check out [the Youtube channel here](https://www.youtube.com/channel/UCEcfQSep8KzW7H2S0HBNj8g).

## How is cell different to what's out there?

Cell employs seven powerups to make programming as easy as possible:

1. A simple way to **represent data with text**. This allows you to look directly at your data.
2. A single *dataspace* **where all the data of your project lives**. Every part of your data has a meaningful location.
3. Programming as a **conversation**: you write *calls* to the system, and the system responds back with some data. You can see both your call and the response as data.
4. Write any logic with **only five constructs** which you can understand in a few minutes.
5. The system is **always up to date** and responds to your changes (just like a spreadsheet!).
6. **Everything is integrated**: language, database, API and UI are in one place: your web browser.
7. **Generative AI** that can write code for you, interpret data, or even act on your behalf when someone else interacts with your data.

## Use cases

- Library catalog: Upload a CSV with book data. Make queries on the data. Expose them through an interface that draws a table.
- Logs and alerts: Push logs. Create queries on them. When certain logs come in, send an email or a notification.
- Spreadsheet database: Upload an XLS with data. Create a schema with the LLM and expose it as a table with associated form in an UI.
- Admin: place a DB dump. Run queries to detect inconsistencies and derive a better schema. Show these tables in an admin. Expose the dump through an HTTP endpoint in your service to update this.

## Relationship to the spreadsheet

see the results immediately
the data is always somewhere
text based but low noise

Cell is very much inspired by the [spreadsheet](https://en.wikipedia.org/wiki/Spreadsheet).

In essence, a spreadsheet is immensely powerful because it has three properties:

1. All of its data is contained in cells, each of them with an address.
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

## Innovations

- Programming as message-based three-way communication between the environment, the user and the LLM.
- Immediate integration of files and emails into the dataspace.
- Integrated language, database, service and interface.
- Four representations of data: text, datagrid, table (spreadsheet-like), and custom graphical views.

## The cell interface

- The *main*: a main window that contains *cells*: smaller windows that show either text (fourdata) or graphical components.
- The *dialogue*: a dialogue window that combines the concept of a terminal with that of an LLM prompt, enabling a dialogue between the user, an LLM and cell. Any message starting with @, whether it comes from the user or the LLM, is understood as a call to cell. Any message sent by the user that is not starting with a @ is sent to the LLM, which will then respond with other messages and possibly calls to cell. Calls to cell will control the interface as well as put data in the dataspace (actually, the interface is simply an interpretation of part of the dataspace, but we mention it as an important special case). cell won't output anything on the dialogue, its results will be seen (optionally) in the main window.

In desktop, the main window will be 70% of the width of the screen, to 30% of the vertical stream of messages between user, LLM and cell.

In mobile, the interface will be modal, showing either the main or the dialog.

The LLM can be provided through an API token or offered as a service, but in the end, it doesn't really matter. What matters are the twin intelligences of user and LLM used to paint a picture of data in cell.

The key insight carried from the [shell](https://en.wikipedia.org/wiki/Shell_(computing)) is that the the calls sent to cell, whether they originate from the LLM or from the user, are indistinguishable.

An interesting development of this design is that programming becomes an act of communication with cell and the LLM. This taps into the social nature of language.

## The data representation: `fourdata`

Please see [here](https://github.com/altocodenl/TODIS?tab=readme-ov-file#pillar-1-single-representation-of-data).

## The language

Please see [here](https://github.com/altocodenl/TODIS?tab=readme-ov-file#pillar-3-call-and-response) and [here](https://github.com/altocodenl/TODIS?tab=readme-ov-file#pillar-4-logic-is-what-happens-between-call-and-response).

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

- Project, with 8 hex identifiers
- Altocookies: login with email with link or oauth with providers that always provide email (google)
- Split screen 60/40, llm prompt on the right
- Recursive lambdas by referencing itself from inside the loop?
- Differ by non-abridged fourdata with nonlexicographic sorting of number keys, lines of rem, add & keep.
- PWAs out of the box.
- Encrypted dumps/restores
- Implementation of U and of pg's lisp interpreter.
- Self-hosting.

## Acknowledgments

[Kartik Agaram](http://akkartik.name) has provided extremely valuable insights and questions.

Leon Marshall has contributed the term "speak" to describe interactions between programs.

## License

cell is written by [Federico Pereiro](mailto:fpereiro@gmail.com) and released into the public domain.
