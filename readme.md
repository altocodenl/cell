# cell

> Your data and your logic, together at last.

## Introduction

Cell is a tool that allows you to create [data systems](https://github.com/altocodenl/todis) (think spreadsheets, apps, pages) with great ease. Particularly if you don't consider yourself to be a programmer.

The purpose of cell is to empower you to transform your data into a system that perfectly fits your needs and that you can change at any time.

I'm currently recording myself while building cell. You can check out [the Youtube channel here](https://www.youtube.com/channel/UCEcfQSep8KzW7H2S0HBNj8g).

## How is cell different to what's out there?

Cell employs seven powerups to make programming as easy as possible:

1. A simple way to represent data with text. This allows you to look directly at your data.
2. A single *dataspace* where all the data of your project lives. Every part of your data has a meaningful location.
3. Programming as a conversation: you write *calls* to the system, and the system responds back with some data. You can see both your call and the response as data.
4. Write any logic with only five constructs which you can understand in a few minutes.
5. The system is always up to date and respond to your changes (just like a spreadsheet!).
6. Everything is integrated: language, database, API and UI are in one place: your web browser.
7. Generative AI that can write code for you, interpret data, or even act on your behalf when someone else interacts with your data.

## What can I do with cell?

1. Understand an existing system or design a new one.
2. Define the logic of a system.
3. Create interfaces for a system.
4. Test a system.

The intention of cell, much like [Forth](https://en.wikipedia.org/wiki/Forth_(programming_language)) or [Lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)), is to be adaptable to any programming context.

## Relationship to the spreadsheet

Cell is very much inspired by the [electronic spreadsheet](https://en.wikipedia.org/wiki/Spreadsheet).

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

**DEAR READER: cell is currently vaporware; everything below this message has to undergo intense work to be worthy of standing by itself. Below are very roughly sketched areas. They are quite unreadable. If they don't make sense to you, it's likely because they don't make sense at all, yet.**

## The cell interface

- The *main*: a main window that contains *cells*: smaller windows that show either text (fourdata) or graphical components.
- The *dialogue*: a dialogue window that combines the concept of a terminal with that of an LLM prompt, enabling a dialogue between the user, an LLM and cell. Any message starting with @, whether it comes from the user or the LLM, is understood as a call to cell. Any message sent by the user that is not starting with a @ is sent to the LLM, which will then respond with other messages and possibly calls to cell. Calls to cell will control the interface as well as put data in the dataspace (actually, the interface is simply an interpretation of part of the dataspace, but we mention it as an important special case). cell won't output anything on the dialogue, its results will be seen (optionally) in the main window.

In desktop, the main window will be 70% of the width of the screen, to 30% of the vertical stream of messages between user, LLM and cell.

In mobile, the interface will be modal, showing either the main or the dialog.

The LLM can be provided through an API token or offered as a service, but in the end, it doesn't really matter. What matters are the twin intelligences of user and LLM used to paint a picture of data in cell.

The key insight carried from the [shell](https://en.wikipedia.org/wiki/Shell_(computing)) is that the the calls sent to cell, whether they originate from the LLM or from the user, are indistinguishable.

An interesting development of this design is that programming becomes an act of communication with cell and the LLM. This taps into the social nature of language.

## The data representation: `fourdata`

The starting point of any digital information system is information, or data. We program computers because they're able to store extremely large amounts of data, transform it extremely quickly and with extremely low error rates, and transmit data exceedingly quickly. Programming can and should only be concerned with data.

To talk about data, we're going to establish a common representation to understand and express data. There are many ways to go about this, but we're going to choose the simplest possible one that allows us to move forward.

In cell, there are only four data types:

1. Number
2. Text
3. List
4. Hash

The first two, number and text, are the *single* data types. That means that they represent a *single value*. For example:

```
1234
```

```
Hi
```

A list is a sequence of values. The list is the first *multiple* data type, because it can hold *multiple* values inside itself -- zero or more values, to be precise. These values can be of any type. For example:

```
1 1234
2 Hi
```

Note that each value in a list has a position. In the list above, `1234` comes first, and then comes `Hi`. This list, that has two values, also has two *keys*: `1` and `2`. `1` takes you to the first value, `1234`, while `2` takes you to the second value, `Hi`. Keys are how you can refer to a specific value inside a list. The keys of all lists are always positive integers.

The four and last data type is the *hash*. Like a list, it can hold multiple values. However, its keys are not numbers, but texts.

```
name Odd
age 32
```

Because there are only four types of data in this representation, we call it `fourdata`.

Tables are a common way to represent data. For example, the hash we just saw can be expressed in **table format**:

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

Note in the example above that we added a new key to the hash, called `messages`. `messages` takes us to a list of two values, which we saw earlier.

If we want to express something that could be either "yes" or "no", or "true" or "false", we can simply use `0` or `1`. `0` represents "no", while `1` represents "yes".

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

While tables are a common way to look at data, cell uses text to represent data. Text takes up less space and is easier to input, whether in a computer, a notebook or a blackboard. Also, for large datasets, text is easier to read than a table.

Here's a way to represent the data above in **text format**:

```
users 1 age 32
users 1 messages 1 1234
users 1 messages 2 Hi
users 1 name Odd
users 1 online 1
users 2 age 38
users 2 messages 1 "Hi, Odd!"
users 2 name Eoin
users 2 online 0
```

A bit blockish, but quite compact! There's a few things that are worth noting about the line representation above:

- There is one line per single value.
- The keys of multiple values go from left to right, for example: `users 1 name`, `users 1 age`.
- The value is the rightmost element in each line.
- When representing a hash, the lines for each of its keys are alphabetically sorted. In the example above, `age` comes before any other line for a user hash because it starts with `a`.

The representation above can be improved by replacing the repeated elements with whitespace. This is the **abridged text format** format.

```
users 1 age 32
        messages 1 1234
                 2 Hi
        name Odd
        online 1
      2 age 38
        messages 1 "Hi, Odd!"
        name Eoin
        online 0
```

This abridged text format will be *the* way in which we represent data in cell. From now on, you can consider fourdata and this text representation to be indistinguishable.

### [ASIDE FOR EXPERIENCED PROGRAMMERS] alf vs JSON

*If you don't have much programming experience yet, you can skip this section.*

The combination of fourdata and alf is quite radical. If you come from using JSON as a data representation format, here's what you cannot directly represent in alf:

1. `true|false`
2. `null`
3. Empty arrays
4. Empty objects

We saw earlier that booleans can be represented as `0` and `1`. As for `null`, it can be represented by the *absence* of a certain key in a hash; but inside a list, it has to be represented with something else, such as the text `null` or an empty string.

The impossibility of representing empty arrays (with lists) or empty objects (with hashes) is a much more radical departure. However, I consider it a virtue. There are no empty "boxes" anywhere; if you are expecting a "box" (multiple data type, either list or hash) and it is absent, then you can treat it like an empty list or hash in your code. But there's no need to burden the data representation with that.

Other notable properties of alf:
- A 1:1 mapping between a data line and each single value.
- Fully deterministic
   - The order of keys in hashes is always alphabetical.
   - The notation fully determines how much data (and in which order) goes on each line, leaving neither room nor need for [pretty printing](https://en.wikipedia.org/wiki/Prettyprint).
- The use of indentation without a fixed amount of spaces, but rather using the length of the keys to push values to the right.
- Low noise: no quoting of texts that are evidently texts, no special characters except for whitespace to separate keys and values.
- Sparse arrays can happen naturally by skipping the missing entries. For example, `[null, 'hello']` maps to a single entry: `2 hello`.

You can still use JSON instead of alf to represent fourdata. For example, the last example of the previous section could be written as:

```json
{
    "users": [
       {
           "name": "Odd",
           "age": 32,
           "messages": [
              1234,
              "Hi"
           ],
           "online": true
       }, {
           "name": "Eoin",
           "age": 38,
           "messages": [
              "Hi, Odd!"
           ],
           "online": false
       }
    ]
}
```

Still, alf is more compact and has considerably less noise (less quotes, no colons, no commas, no square or curly brackeets), only requiring quotes around `Hi, Odd!` since that text contains space.

```
users 1 age 32
        messages 1 1234
                 2 Hi
        name Odd
        online 1
      2 age 38
        messages 1 "Hi, Odd!"
        name Eoin
        online 0
```

While you can use the tools provided by cell to generate alf from JSON or viceversa, it is useful to be able to write it by hand. If you do, here are the main points:

- Sort hash keys alphabetically.
- Stringify texts that contain a double quote, a whitespace character or look like a number (texts that start like a number start with either a digit or a dash followed by a digit).
- Stringify empty strings.
- Stringify keys of hashes that look like a number.

## The language

TODO: everything :)

Because alf is completely deterministic, and we write code in alf, there's no pretty printing or indentation conventions that are optional. All the code looks the same!

texts that have an @ in front are calls. They don't have to be terminal values. The interpreter goes from right to left resolving references. Functions are references too. No precedence rules needed. Though, you could define @( and @) if you wanted.

References are calls, they are the most basic type of call.

@ is reactive! If the value at it changes, things are re-run. This also goes for functions, if their definitions are changed, they are re-run.

create responders as soon as you have well formed calls. have them in dataspace themselves, in their own data representation based in fourdata.

@done to be done, rather than "return". add a value next ot it.

fluent hash style: as long as you don't need parenthesis, you can add multiple things right to left. the responses will be shown call by call.

See the expansions of the references.

how calls can be:
- 1:1
- 1:many in sequence (middleware)
- 1:many fork and wait
- 1:many, no wait

call, responder, expansion, result
sequence, cond, loop
stdout & stderr

call receives a verb and one or more arguments. if you pass a single hash, the reference to the arguments will be shrunk from `1 foo` to `foo`.

validation of arguments with conditional return/throw.

Side effects as change in state that is not in the transformation itself.

context and scope are the same thing. It is referring to data with relative paths rather than absolute ones. And not literally relative ones, but with a more sophisticated mechanism of going "up" the chain until you find something.
Reference is also a call.

Reactivity event system is just doing it through those calls through the event system. push vs pull.


definition:
```
entityify 1 @if cond @not @prod
                then @validate type text
                               value @text
            2 @replace text @text
                       with 1 & &amp;
                            2 < &lt;
                            3 < &gt;
                            4 \" &quot;
                            5 ' &#39;
```

successful execution:

```
result1 call 1 @entityify text &salamin;
             2 call @if cond call @not call @prod
                                       res ""
                             res 1
               res call @validate type text
                                  value call @text
                                        res &salamin;
                   res 1
             3 call @replace text call @text
                                  res &salamin;
                             with 1 & &amp;
                                  2 < &lt;
                                  3 < &gt;
                                  4 \" &quot;
                                  5 ' &#39;
               res &amp;salamin;
```

unsuccessful execution:
```
result1 call 1 @entityify text foo bar
             2 call @if cond call @not call @prod
                                       res ""
                             res 1
               res call @validate type text
                                  value call @text
                                        res foo bar
                   res error 1 "Expected text but instead got hash"
                             2 foo bar
```

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
