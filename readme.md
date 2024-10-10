# cell

cell is a simple and transparent programming system. It is an implementation of the paradigm of [The Organization of Information Systems](https://github.com/altocodenl/todis). Concretely, cell is four things:

- A programming language: allows to express sequences of data transformations.
- A database: allows to validate and query information.
- An API: can expose surfaces to the network and can interact with other exposed surfaces.
- An interface maker: allows to create graphical interfaces to interact with data.

cell is all of those things not because it tries to be everything; rather, it does all of this because it explores the possibility that the best way to build information systems is to have an integrated system where language, database, service and interface spring from a common ground.

## Purpose

Programming is an universal tool for problem solving. It is also a wonderful means for artistic expression. Programming allows you to harness the power of computers for creative purposes.

Programming is hard. Some difficulties are inherent to programming. Programming is inherently, essentially, unavoidably hard. Like writing, like playing an instrument. But a great deal of what makes programming hard is not essential to programming itself, but rather [accidental](https://en.wikipedia.org/wiki/No_Silver_Bullet). This accidental complexity turns a hard endeavor into an almost impossible task for most, and a mostly vexatious endeavor for those who still program.

cell attemps to radically do away with the accidental complexity of programming, while shining a light on the essential complexity of programming. Instead of shielding users from the real problems, cell put users face to face with the problems they must face anyway, but equipped with tools to understand and solve them. The value of these tools is in their adaptability and universality.

cell intends to be the simplest way to both learn how to program and to program real world useful applications, by everyone, for everyone. And if it fails to reach that aspiration, it intends to pave the way for another tool to actually become that.

To understand more about the philosophy and purpose of cell, I encourage you to take a peek at [TODIS](https://github.com/altocodenl/todis). If you like what you see, then cell might be for you.

## The data vocabulary: `fourdata`

The starting point of any DIS is information, or data. We program computers because they're able to store extremely large amounts of data, transform it extremely quickly and with extremely low error rates, and transmit data exceedingly quickly. Programming can and should only be concerned with data.

To talk about data, we're going to establish a common vocabulary to understand and express data. There are many ways to go about this, but we're going to choose the simplest possible one that still allows us to move forward.

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

Note that each value in a list has a position. In the list above, `1234` comes first, and then comes `Hi`. This list, that has two values, also has two *paths*: `1` and `2`. `1` takes you to the first value, `1234`, while `2` takes you to the second value, `Hi`. Paths are how you can get to a specific value inside a list. The paths of all lists are always numbers (integer numbers, to be more precise).

The four and last data type is the *hash*. Like a list, it can hold multiple values. However, its paths are not numbers, but texts.

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

Note in the example above that we added a new path to the hash, called `messages`. `messages` takes us to a list of two values, which we saw earlier.

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

While tables are a standard way of looking at data, I much prefer to use text. Text takes up less space and is easier to input, whether in a computer, a notebook or a blackboard. Here's a way to represent the data above in **line format**:

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

A bit blockish, but quite compact! There's a few things that are worth noting about the line representation above:

- There is one line per single value.
- The paths of multiple values go from left to right, for example: `users 1 name`, `users 1 age`.
- The value is the rightmost element in each line.

If you don't like the repetition of the above representation, you can use empty spaces to represent what you omit. This is the **abridged line format** for fourdata (or alf).

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

This abridged line format of fourdata will be *the* way in which we represent data.

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
- The use of indentation without a fixed amount of spaces, but rather using the length of the keys to push values to the right.
- The fact that the notation fully determines how data looks like, leaving neither room nor need for pretty printing.
- The avoidance of over-quoting texts that are evidently texts and contain no spaces.
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

Still, alf is more compact and has considerably less noise, only requiring quotes around `Hi, Odd!` since that text contains space.

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

While you can use the facilities provided by cell to generate alf from JSON or viceversa, it is useful to be able to write it by hand. If you do, here are the main points:

- Sort hash keys alphabetically
- Stringify texts that contain a double quote, a whitespace character or start like a number (texts that start like a number start with either a digit or a dash followed by a digit).
- Stringify empty strings.
- Stringify keys of hashes that look like a number.

## The language

because alf is completely deterministic, and we write code in alf, there's no pretty printing or indentation conventions that are optional. All the code looks the same!

how calls can be:
- 1:1
- 1:many in sequence (middleware)
- 1:many fork and wait
- 1:many, no wait

call, responder, expansion, result
sequence, cond, loop
stdout & stderr

TODO: everything :)

## The database

TODO: everything :)

## The service

TODO: everything :)

## The interface maker

TODO: everything :)

## Acknowledgments

[Kartik Agaram](http://akkartik.name) has provided extremely valuable insights and questions.

Leon Marshall has contributed the term "speak" to describe interactions between programs.

## License

cell is written by [Federico Pereiro](mailto:fpereiro@gmail.com) and released into the public domain.
