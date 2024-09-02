# cell

cell is a simple and transparent programming interface.

## Purpose

Programming is an universal tool for problem solving. It is also a wonderful means for artistic expression. Programming allows you to harness the power of computers for creative purposes.

Programming is hard. Some difficulties are inherent to programming. Programming is inherently, essentially, unavoidably hard. Like writing, like playing an instrument. But a great deal of what makes programming hard is not essential to programming itself, but rather [accidental](https://en.wikipedia.org/wiki/No_Silver_Bullet). This accidental complexity turns a hard endeavor into an almost impossible task for most, and a mostly vexatious endeavor for those who still program.

cell attemps to radically do away with the accidental complexity of programming, while shining a light on the essential complexity of programming. Instead of shielding users from the real problems, cell put users face to face with the problems they must face anyway, but equipped with tools to understand and solve them. The value of these tools is in their adaptability and universality.

cell intends to be the simplest way to both learn how to program and to program real world useful applications, by everyone, for everyone. And if it fails to reach that aspiration, it intends to pave the way for another tool to actually become that.

cell accomplishes everything it does through simplicity and transparency. Simplicity means that a few concepts, that can be understood in isolation, can be combined with some skill to program anything. Transparency means seeing through and not hiding the users from the hard issues of implementation. Anything that is hard but real, should be seen and understood.

*TODO: connect programming to disys.*

## Axioms

1. A digital information system (disys) is a system that uses computers to 1) store information; 2) transform information; 3) transmit information. Data is equal to information.
2. Disys can and should be understandable by those who make them and those who use them.
3. Well-designed disys should last a very long time (decades, at least).
4. Everyone should have the tools to build their own disys.
5. The making of disys (programming) should be as hard (but not harder) than writing.

## The data vocabulary

The starting point of any disys is information, or data. We program computers because they're able to store extremely large amounts of data, transform it extremely quickly and with extremely low error rates, and transmit data exceedingly quickly. So it is all about data.

To talk about data, we're going to set a vocabulary to understand and express data. There are many ways to go about this, but we're going to choose the simplest possible one that still allows us to move forward.

In cell, there are only four data types:

1. Number
2. Text
3. List
4. Hash

The first two, number and text, are *single* data types. That means that they represent a *single value*. For example:

```
1234
```

```
Hi
```

A list is a sequence of values. The list is the first *multiple* data type, because it can hold *multiple* values inside itself -- zero or more values, to be precise. These values can be of any type. For example:

```
1: 1234
2: Hi
```

Note that each value in a list has a position. In the list above, `1234` comes first, and then comes `Hi`. This list, that has two values, also has two *paths*: `1` and `2`. `1` takes you to the first value, `1234`, while `2` takes you to the second value, `Hi`. Paths are how you can get to a specific value inside a list. The paths of all lists are always numbers (integer numbers, to be more precise).

The last data type is hash. Like a list, it can hold multiple values. However, its paths are not numbers, but texts.

```
name: Odd
age: 32
```

Tables are a good way to represent data. For example, the hash we just saw can be expressed in this table:

<table>
   <tr>
      <th>Name</th>
      <th>Age</th>
   </tr>
   <tr>
      <td>Odd</td>
      <td>32</td>
   </tr>
</table>

Both lists and hashes can contain other multiple values (lists and hashes) inside it. For example:

<table>
   <tr>
      <th>Name</th>
      <th>Age</th>
      <th>Messages</th>
   </tr>
   <tr>
      <td>Odd</td>
      <td>32</td>
      <td>
         <table>
            <tr>
               <th>1</th>
               <th>2</th>
            </tr>
            <tr>
               <td>1234</td>
               <td>Hi</td>
            </tr>
         </table>
      </td>
   </tr>
</table>

Note in the example above that we added a new path to the hash, called `messages`. `messages` takes us to a list of two values, which we saw earlier.

If we want to express something that could be either "yes" or "no", or "true" or "false", we can simply use `0` or `1`.

<table>
   <tr>
      <th>Name</th>
      <th>Age</th>
      <th>Messages</th>
      <th>Online</th>
   </tr>
   <tr>
      <td>Odd</td>
      <td>32</td>
      <td>
         <table>
            <tr>
               <th>1</th>
               <th>2</th>
            </tr>
            <tr>
               <td>1234</td>
               <td>Hi</td>
            </tr>
         </table>
      </td>
      <th>
         1
      </th>
   </tr>
</table>

Hopefully, this hash, which itself contains a text, a number and a list, is understandable. What it needs now is a context. The data in there strongly hints towards a messaging system. Perhaps, the data of the system could look like this:

<table>
   <tr>
      <th>Users</th>
   </tr>
   <tr>
      <td>
         <table>
            <tr>
               <th>1</th>
            </tr>
            <tr>
               <td>
                  <table>
                     <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Messages</th>
                        <th>Online</th>
                     </tr>
                     <tr>
                        <td>Odd</td>
                        <td>32</td>
                        <td>
                           <table>
                              <tr>
                                 <th>1</th>
                                 <th>2</th>
                              </tr>
                              <tr>
                                 <td>1234</td>
                                 <td>Hi</td>
                              </tr>
                           </table>
                        </td>
                        <td>1</td>
                     </tr>
                  </table>
               </td>
            </tr>
         </table>
      </td>
   </tr>
</table>

Then, we could add another user.

<table>
   <tr>
      <th>Users</th>
   </tr>
   <tr>
      <td>
         <table>
            <tr>
               <th>1</th>
               <th>2</th>
            </tr>
            <tr>
               <td>
                  <table>
                     <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Messages</th>
                        <th>Online</th>
                     </tr>
                     <tr>
                        <td>Odd</td>
                        <td>32</td>
                        <td>
                           <table>
                              <tr>
                                 <th>1</th>
                                 <th>2</th>
                              </tr>
                              <tr>
                                 <td>1234</td>
                                 <td>Hi</td>
                              </tr>
                           </table>
                        </td>
                        <td>1</td>
                     </tr>
                  </table>
               </td>
               <td>
                  <table>
                     <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Messages</th>
                        <th>Online</th>
                     </tr>
                     <tr>
                        <td>Eoin</td>
                        <td>38</td>
                        <td>
                           <table>
                              <tr>
                                 <th>1</th>
                              </tr>
                              <tr>
                                 <td>Hi, Odd!</td>
                              </tr>
                           </table>
                        </td>
                        <td>0</td>
                     </tr>
                  </table>
               </td>
            </tr>
         </table>
      </td>
   </tr>
</table>

If we're designing in a notebook or a blackboard, we can use a shorthand for this data, since for most of us it is not fun to draw tables by hand. Here's a way to represent the table above in text format:


```
users 1 name Odd
users 1 age 32
users 1 messages 1 1234
users 1 messages 2 Hi
users 1 online 1
users 2 name Eoin
users 2 age 38
users 2 messages 1 "Hi, Odd!"
users 2 online 0
```

A bit messy, but quite compact! There's a few things that are worth noting about the text representation above:

- There is a single line per simple value.
- The paths of complex values are to the left and they expand to the right, for example: `users 1 name`.

If you don't like the repetition of the above representation, you can use empty spaces to represent what you omit:

```
users 1 name Odd
        age 32
        messages 1 1234
                 2 Hi
        online 1
      2 name Eoin
        age 38
        messages 1 "Hi, Odd!"
        online 0
```







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

Every action happens as the result of routes responding to incoming events. cell is autopoietic.

The route space is the set of code that can be potentially be executed when there is an incoming event.

Routes can generate events themselves.

The shell for interacting with cell is simply some code that performs requests to certain routes.

Action is carried out in a sequential, deterministic, reproducible single thread.

Core programs are the ones given by cell, which you cannot change. They are the building blocks.

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

Programs are data transformations. And they are themselves data.

Programs are the dynamic aspect of data. And they can be represented as data. They can be written as data. A machine takes this special data called a program, and processes data from it.

### Values

There are four types of values:
- number. They are shown right aligned.
- text. They are shown left aligned.
- list. A list is a list where the keys are integers (1, 2, 3...).
- hash. A hash is a list where the keys are text.
- function. The fifth type!

Interestingly (and usefully) enough, you can place lists within lists.

### Locations & files

A location is a list. If start with /, it is absolute. Does not have to be flattened but it must resolve to it. You can put code inside as well.

no circular locations!

### Programming patterns

1. Do one thing after another: sequence
2. Sequences can hold subsequences: nestedness/recursiveness
3. Conditional: can discard or expand the sequence dynamically
4. Iteration: do the same thing for this piece of data (or this number of times)

### What makes cell different to programming languages?

- Graphical, yet fully powered.

- Inspired on the spreadsheet.

- Puts data first and can be considered a database.

- It has a single data space, like the web does.

- Its internal execution mechanism and storage area is part of the global object and is in userspace.

- Has a client/server architecture.

- Is built with events from the ground up.

### What does cell have in common with spreadsheets

- A single information space where all code and data are present.

- Code (formulas) is bound to a cell and that's where its result is shown.

- The result of a cell containing code can be used as data for other cell, as well as cell containing literal information.

- A cell is recalculated when its inputs (code or another cell) change.

### Things that cell does away with, and which will never be part of its core

- Extra built-in types, like booleans, null, undefined.

- Strict typing.

- Syntax.

- Statements (everything is an expression).

- Classes & object oriented programming.

You're however able to create any of these as a layer within cell.

## An autopoietic theory of computation (loose ideas)

Autopoietic theory of computation:
- Starts with events. Why events + listeners instead of function calls? It works in UIs, and it works in servers. It might work everywhere.
- Event listeners allow you to match 0 or n to your call. 0 is comfortable for developing (no "function is undefined" errors). But the key is n. n allows you to have a sequence of functions reacting to a said and going in succession, passing control. Core assumption that we cover below: things happen one at a time.
- Wildcard verbs allow you to track a lot of things and specify access.
- The reactive elements become possible when you listen not just to a verb, but a given path. By specifying event listeners with path, you can make them be triggered only with certain arguments - if the path is the first argument, then the listener would match conditionally on it.
- Don't "command", "say" instead. Autopoetic. Respond. Internally triggered. Call & respond, following Gleick's description in first chapter of The Information.
- Listeners decide whether they want to respond. Overall order is determined before, by first come. But it's core that they themselves decide, and that they can call each other through the same mechanism. It is self-similar, and it scales.
- Initial listeners bootstrap the system. In that way, you can have a self-modifying structure that can still remain secure and understandable. Strong echoes of how a language can be extended from its primitives, but instead concerning access.
- Said statements trigger an internal *ping pang*: the structure says things to itself from within the boundary.
- Surface to listen, then internal area of execution. And concurrency has two options: when listening to something, do you do the whole thing internally (assuming it stops, but if it doesn't, then it's valid too) and listen only after you're done with everything and no more things are triggered? Or do you keep listening to things and you have multiple execution threads? Whatever you choose must be understandable, the guarantees of what happens or what doesn't. It makes sense to have n threads per n cpus, but the modification of data should have guarantees. But then, where do they lie? What if we had elegant locks? We could put all the guarantees we wanted without demanding things. The system would still be responsive to tell us what's going on where. And we could scale as best as possible, within reason.
- If you want a consistent system that runs parallely, things that concern a certain unit of consistency must be run sequentially. Unrelated things can run in parallel without a problem. If data must be consistent and it can only exist in one state at a time, the process must be either sequential or be sequentialized after the fact with eventual consistency. This is a hard limit. Parallel systems are hard to understand because of the potential combinatorial possibilities of reducing parallel sequences related to one concern into a single thread.
- Authentication can be passed along. It's up to the listener to decide to serve or not the request, or pass control along.
- Surface of the system also responds with data. That's communication. Same mechanism, in reverse.
- Like receptors and substances. But receptors operate in parallel to a great extent and by aggregation; the systems done with cell are very simple, things happen mostly one at a time because that's how we understand them, and things either happen or not, we don't work usually with bounds. But the analogy stands.
- Autopoiesis as compatible yet diametrally opposed to the cybernetic paradigm of computation (input/output). The focus is on what happens inside the boundary; also it goes beyond epistemologically by pointing to the self-constructed (*poiesis*) representation of reality that takes place inside the boundary, whereas cybernetics assumes an external reality.

## Acknowledgments

[Kartik Agaram](http://akkartik.name) has provided extremely valuable insights and questions.

Leon Marshall has contributed the term "speak" to describe interactions between programs.

## License

cell is written by [Altocode](https://altocode.nl) and released into the public domain.
