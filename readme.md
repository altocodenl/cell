# cell

cell is a simple and transparent programming system. It is an implementation of the paradigm of [The Organization of Information Systems](https://github.com/altocodenl/todis). Concretely, cell is four things:

- A programming language: allows to express sequences of data transformations.
- A database: allows to validate and query information.
- A service: can expose an API to the network and can interact with other APIs.
- An interface: allows to create graphical interfaces to interact with data.

This is the quadrivium: language, database, service and interface.

cell is all of those things not because it tries to be everything; rather, it does all of this because it explores the possibility that the best way to build information systems is to have an integrated system where language, database, service and interface spring from a common ground.

## Purpose

Programming is an universal tool for problem solving. It is also a wonderful means for artistic expression. Programming allows you to harness the power of computers for creative purposes.

Programming is hard. Some difficulties are inherent to programming. Programming is inherently, essentially, unavoidably hard. Like writing, like playing an instrument. But a great deal of what makes programming hard is not essential to programming itself, but rather [accidental](https://en.wikipedia.org/wiki/No_Silver_Bullet). This accidental complexity turns a hard endeavor into an almost impossible task for most, and a mostly vexatious endeavor for those who still program.

cell attemps to radically do away with the accidental complexity of programming, while shining a light on the essential complexity of programming. Instead of shielding users from the real problems, cell put users face to face with the problems they must face anyway, but equipped with tools to understand and solve them. The value of these tools is in their adaptability and universality.

cell intends to be the simplest way to both learn how to program and to program real world useful applications, by everyone, for everyone. And if it fails to reach that aspiration, it intends to pave the way for another tool to actually become that.

To understand more about the philosophy and purpose of cell, I encourage you to take a peek at [TODIS](https://github.com/altocodenl/todis). If you like what you see, then cell might be for you.

## The data representation: `fourdata`

The starting point of any digital information system is information, or data. We program computers because they're able to store extremely large amounts of data, transform it extremely quickly and with extremely low error rates, and transmit data exceedingly quickly. Programming can and should only be concerned with data.

To talk about data, we're going to establish a common vocabulary to understand and express data. There are many ways to go about this, but we're going to choose the simplest possible one that allows us to move forward.

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
1 1234
2 Hi
```

Note that each value in a list has a position. In the list above, `1234` comes first, and then comes `Hi`. This list, that has two values, also has two *keys*: `1` and `2`. `1` takes you to the first value, `1234`, while `2` takes you to the second value, `Hi`. Keys are how you can refer to a specific value inside a list. The keys of all lists are always positive integers.

The four and last data type is the *hash*. Like a list, it can hold multiple values. However, its keys are not numbers, but texts.

```
name Odd
age 32
```

Because there are only four types of data in this vocabulary, we call it `fourdata`.

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

Here's a way to represent the data above in **line fourdata** format:

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

The representation above can be improved by replacing the repeated elements with whitespace. This is the **abridged line fourdata** format (or alf).

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

Abridged line fourdata will be *the* way in which we represent data in cell.

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

## The service

TODO: everything :)

## The interface maker

Reactive connections to data sources (like server) to always have fresh data. You can avoid refreshing if it affects user experience, but still have the data ready.

TODO: everything :)

## Acknowledgments

[Kartik Agaram](http://akkartik.name) has provided extremely valuable insights and questions.

Leon Marshall has contributed the term "speak" to describe interactions between programs.

## License

cell is written by [Federico Pereiro](mailto:fpereiro@gmail.com) and released into the public domain.
