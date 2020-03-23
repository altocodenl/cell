# Cells

Cells is a simple and transparent programming interface.

## Purpose

Programming is an universal tool for problem solving. It is also a wonderful means for artistic expression. Programming allows you to harness the power of computers for creative purposes.

Programming is hard. Some difficulties are inherent to programming. Programming is inherently, essentially, unavoidably hard. Like writing, like playing an instrument. But a great deal of what makes programming hard is not essential to programming itself, but rather [accidental](https://en.wikipedia.org/wiki/No_Silver_Bullet). This accidental complexity turns a hard endeavor into an almost impossible task for most.

Cells attemps to do away with the accidental complexity of programming, while being as enlightening as possible about the essential complexity of programming. Instead of shielding users from the real problems, cells put users face to face with the problems, but equipped with tools to understand and solve them. The value of these tools is in their adaptability and universality.

Cells intends to be the simplest way to both learn how to program and to program real world useful applications, by everyone, for everyone. And if it can't reach that high point, it intends to pave the way for another tool to actually become that.

Cells accomplish this purpose through simplicity and transparency. Simplicity means a few concepts that together allow to program anything. Transparency means seeing through and not hiding the users from the hard issues of implementation. Anything that is hard but real, should be seen and understood.

Cells is the development of a few ideas that feel right and create their own space together.

## Axioms

Systems should be understandable.

Well-designed systems should last a very long time.

Everyone should have the tools to build their own systems.

Good programming should be as hard (but not harder) as good writing.

## Main ideas

Everything is data, including code.

Programming is about transforming data.

Data is the static. Programming is the dynamic.

Four types: text, number, list (numeric keys) and hash (textual keys).

All data is inside a hash that contains data.

All data is accessible unless explicitly forbidden by access rules.

Access/location paths are lists containing text and number.

Code is made of programs.

Programs take input and produce output.

Programs can be exposed to the network and also receive input and produce output.

Execution takes code plus a location. The location contains the input and is where the output will be placed, unless the program decides otherwise.

Execution creates two byproducts: the expansion of the code with data and the actual transformations to the input, which become the output.

The expansion of the code with data allows to see the execution of the code transparently, even as it happens.

Execution is not a single happening. It is, rather, a route (event listener). When its input data and code change, it is automatically re-executed.

Every action happens as the result of routes responding to incoming events. Cells is autopoietic.

The route space is the set of code that can be potentially be executed when there is an incoming event.

Routes can generate events themselves.

The shell for interacting with cells is simply some code that performs requests to certain routes.

Action is carried out in a sequential, deterministic, reproducible single thread.

Core programs are the ones given by cells, which you cannot change. They are the building blocks.

Two types of storage: data (small, fast) and files (large, slow).

Data is stored in a built-in database. The database is merely a set of programs for reading and writing data. By making data storage and retrieval an integral part of the language, everything happens on the same space. Your queries can be as involved as you want, and there's no need to manipulate the data before putting things or after the database in a separate layer.

Because all operations happen in the same data space, a read is also a write and a write is also a read. There is a single program for this operation, called *copy*.

Errors are a type of data.

The interface is web, through a web browser. The language is implemented as a server, reachable through HTTP. Applications can be mere extensions of the code. An API endpoint is a mere program.

There's no distinction between an external API call and an internal change triggered by another thing (like a timer).

Except the internals of the native functions, everything else happens in userspace.

Access is restricted programatically. There's no hardcoded sandbox. There is no true distinction between internal and external programs, except on how you choose to expose them.

Internally, there is no tokenizing, since programs are already structured data. And there's no parsing, just execution of the code done inside out. There's only code and literals.

While code is expressed sequentially by default, there is a function for executing code sequences paralelly, to allow for parallel execution where possible. This also allows for further conceptual clarity: independent things need not be in the same sequence.

## Fundamentals

### What is programming?

Programming is manipulating data: checking a user's identity, querying sales data, moving a file from place to place.

Programs are the dynamic aspect of data. And they can be represented as data. They can be written as data. A machine takes this special data called a program, and processes data from it.

### Values

There are four types of values:
- number. They are shown right aligned.
- text. They are shown left aligned.
- list. A list is a list where the keys are integers (1, 2, 3...).
- hash. A hash is a list where the keys are text.

Interestingly (and usefully) enough, you can place lists within lists.

### Locations & files

A location is a list. If start with /, it is absolute. Does not have to be flattened but it must resolve to it. You can put code inside as well.

no circular locations!

### Programming patterns

1. Do one thing after another: sequence
2. Sequences can hold subsequences: nestedness/recursiveness
3. Conditional: can discard or expand the sequence dynamically
4. Iteration: do the same thing for this piece of data (or this number of times)

### What makes cells different to programming languages?

- Graphical, yet fully powered.

- Inspired on the spreadsheet.

- Puts data first and can be considered a database.

- It has a single data space, like the web does.

- Its internal execution mechanism and storage area is part of the global object and is in userspace.

- Has a client/server architecture.

- Is built with events from the ground up.

### What does cells have in common with spreadsheets

- A single information space where all code and data are present.

- Code (formulas) is bound to a cell and that's where its result is shown.

- The result of a cell containing code can be used as data for other cells, as well as cells containing literal information.

- A cell is recalculated when its inputs (code or another cell) change.

### Things that cells does away with, and which will never be part of its core

- Extra built-in types, like booleans, null, undefined.

- Strict typing.

- Syntax.

- Statements (everything is an expression).

- Classes & object oriented programming.

You're however able to create any of these as a layer within cells.

## Acknowledgments

[Kartik Agaram](http://akkartik.name) has provided extremely valuable insights and questions.

Leon Marshall has contributed the term "speak" to describe interactions between programs.

## License

cells is written by [Altocode](https://altocode.nl) and released into the public domain.
