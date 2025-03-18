// *** SETUP ***

var B = window.B;

var clog = console.log;

// *** STYLE ***

var css = [
   ['body', {'padding-left': 30}]
];

// *** MAIN FUNCTIONS ***

var escapeForRegex = function (text) {
   var toEscape = ['-', '[', ']', '{', '}', '(', ')', '|', '+', '*', '?', '.', '/', '\\', '^', '$'];
   return text.replace (new RegExp ('[' + toEscape.join ('\\') + ']', 'g'), '\\$&');
}

var receive = function (message) {
   var parsedMessage = parse (message);

   var response;

   if (parsedMessage.error) response = 'error "' + parsedMessage.error + '"';

   // {get: [...]}
   if (parsedMessage.get) response = get (parsedMessage.get);
   // {put: [...]}
   if (parsedMessage.put) response = put (parsedMessage.put);

   //put (['lastcall', ...message]);
   //put (['lastres', ...response]);
   return response;
}

var toNumberIfNumber = function (v) {
   if (v.match (/^-?(\d+\.)?\d+/) !== null) return parseFloat (v);
   return v;
}

// The splitter takes a message that's text, presumably formatted as fourdata, and returns a list of lists: each of them a line of unabridged fourdata, inside JS arrays.
// For example: `foo bar 1\n    jip 2` will become [['foo', 'bar', 1], ['foo', 'jip', 2]]
/*
- Split the line by quotes (") that don't come in pairs. (the way to escape (or rather, write a literal quote) is to write "" (this comes from CSV, I think). If you have an even number, you don't have a multiline quote.
- I need to induce from something:
- No, don't split by quote. You want to mark the beginning and the end. What's before the beginning of a quote can be splitted by spaces, like we did before. When you enter a quote zone, you don't split by spaces until you're done by finding the closing quote. That's the way to see it. So, rather than split, we could just iterate the characters on the string and split in that way.
- Note: would we do trimming of double+ spaces? Yes, but between characters, because indentations have to be precise.
- If you end the line and you have a dangling quote, you then move to the next line and keep on adding to the text you're building (you're always building a text and when you're done, you push it to the splitted line) until you close the quote.
- If you didn't close the quote and you hit the end of the last line, report an error.
*/
// TODO; escape quotes
var splitter = function (message) {

   var paths = [];
   var insideMultilineText = false;

   if (message === '') return paths;

   // We stop at the first error.
   var error = dale.stopNot (message.split ('\n'), undefined, function (line) {

      var path = [], originalLine = line, lastPath = teishi.last (paths);

      if (line.length === 0 && ! insideMultilineText) return;

      if (line [0] === ' ' && ! insideMultilineText) {
         if (! lastPath) return 'The first line of the message cannot be indented';
         var indentSize = line.match (/^ +/g) [0].length;
         var matchedSpaces = 0;
         // lastPath always is nonzero in length, so there's no zero corner case
         var matchUpTo = dale.stopNot (lastPath, undefined, function (v, k) {
            // Converting v to text in case it is a number
            matchedSpaces += (v + '').length + 1;
            if (matchedSpaces === indentSize) return k;
            if (matchedSpaces > indentSize) return {error: 'The indent of the line "' + line + '" does not match that of the previous line.'};
            // If we haven't hit the indentSize, keep on going.
         });
         if (matchUpTo === undefined) return 'The indent of the line "' + line + '" does not match that of the previous line.';
         if (matchUpTo.error) return matchUpTo.error;
         // We store the "deabridged" part of the line, taking it from the last element of `paths`
         path = lastPath.slice (0, matchUpTo + 1);
         line = line.slice (matchedSpaces);

         if (line.length === 0) return 'The line "' + originalLine + '" has no data besides whitespace';
      }

      var dequoter = function (text) {
         var output = {start: -1, end: -1};

         var unescapeQuotes = function (text) {
            return text.replace (/\/"/g, '"');
         }

         var findUnescapedQuote = /(?:[^/])"/;

         if (text [0] === '"' && text [1] === '"') return {start: 0, end: 1, text: ''};

         if (text [0] === '"') output.start = 0;
         else {
            var match = text.match (findUnescapedQuote);
            if (match) output.start = match.index + 1;
         }

         if (insideMultilineText) {
            if (output.start === -1) output.text = unescapeQuotes (text);
            if (output.start === 0) output.text = '';
            if (output.start > 0) output.text = unescapeQuotes (text.slice (0, output.start));
         }

         else if (output.start === -1) output.text = text;
         else {
            match = text.slice (output.start + 1).match (findUnescapedQuote);
            if (match) output.end = match.index + output.start + 1;

            output.text = unescapeQuotes (text.slice (output.start + 1, output.end === -1 ? Infinity : (output.end + 1)))
         }

         return output;
      }

      if (insideMultilineText) {
         var dequoted = dequoter (line);
         if (dequoted.start === -1) {
            lastPath [lastPath.length - 1] += line + '\n';
            return;
         }
         else {
            lastPath [lastPath.length - 1] += dequoted.text;
            line = line.slice (dequoted.start + 2); // Remove the quote and the space after the quote
            path = lastPath;
            insideMultilineText = false;
         }
      }

      while (line.length) {
         if (line [0] === ' ') return 'The line "' + originalLine + '" has at least two spaces separating two elements.';

         if (line [0] === '"') {
            var dequoted = dequoter (line);
            if (dequoted.end !== -1) {
               path.push (dequoted.text);
               line = line.slice (dequoted.end + (dequoted.text === '' ? 1 : 2)); // Remove the quote. There's a special case for when the text is empty, because we are removing the second quote.
               // Check that the first element is a space, then remove it
               if (line.length && line [0] !== ' ') return 'No space after a quote in line "' + originalLine + '"';
               line = line.slice (1);
            }
            else {
               insideMultilineText = true;
               path.push (dequoted.text + '\n');
               line = '';
            }
            continue;
         }

         var element = line.split (' ') [0];
         if (element.match (/\s/)) return 'The line "' + line + '" contains a space that is not contained within quotes.';
         if (element.match (/"/)) return 'The line "' + line + '" has an unescaped quote.';

         line = line.slice (element.length + 1); // Here we don't need to check that the last character sliced is a space, because we used spaces to split the line
         path.push (toNumberIfNumber (element));
      }

      // This will be true if we just closed a multiline text on this line
      if (! paths.includes (path)) paths.push (path);
   });

   if (error) return {error: error};
   if (insideMultilineText) return {error: 'Multiline text not closed: "' + teishi.last (teishi.last (paths)) + '"'};
   return paths;
}

var sorter = function (unabridgedLines) {

   // sort by length 1, then by length 2, then by length 3, until you are done.
   // the problem is that JS sorting is not stable!
   // the trick for uppercase or lowercase: take each char and make it uppercase and lowercase, compare to see if it's equal or not to the original, to determine if it is lowercase.

   // Sort uppercase and lowercase separately: aA bB cC. Lowercase goes up.
   // Numbers first.
}

- Let's break convention. I don't want uppercase and lowercase sorted separately. So aAbBcC? Or AaBbCc? I'm thinkingn of what'd be more practical to "send things to the top", since cell doesn't allow you to sort things non-lexicographically. Let's go with aAbBcC, the more naked and real lowercase variables at the top, the corporate OOP-ish Class Names That Use Uppercase at the bottom.
- What about numbers and letters? Numbers first. So 0123456789, then aAbB. But numbers should be sorted by value, not lexicographically.

var validator = function (unabridgedLines) {
   // check that there's no mixture of hashes and lists
   // check that lists use only consecutive integers starting at 1
   // dot notation, modify unabridgedLines
   // check that there are no repeated keys in hashes or lists
}


// It validates and it parses
var parse = function (message) {
   // Check it out, a one line lexer!
   message = dale.fil (message.trim ().replace (/\s+/, ' ').split (/\s/), '', function (v) {return v});

   if (message.length === 0) return {error: 'Message is empty'};

   if (message [0] [0] !== '@') return {error: 'Call must start with `@`'};

   if (message [0] !== '@') return {error: 'Call must start with `@` and have a space after it'};

   if (message [1] === 'put') return {put: message.slice (2)};

   // If it's not a put, it is a get
   return {get: message.slice (1)};
}

var spaces = function (n) {
   return Array (n).fill (' ').join ('');
}

var prepend = function (prefix, lines) {

   lines = lines.split ('\n');

   dale.go (lines, function (v, k) {
      var linePrefix = k === 0 ? (prefix + ' ') : spaces (prefix.length + 1);
      lines [k] = linePrefix + v;
   });

   return lines.join ('\n');
}

var get = function (message) {
   var dataspace = localStorage.getItem ('cell');
   if (dataspace === null) dataspace = '';

   if (message.length === 0) return dataspace;

   var matchedElements = 0;
   var matchFound = false;

   var output = [];

   dale.stop (dataspace.split ('\n'), false, function (line) {

      if (! matchFound) {

         var matchedElementsBeforeLine = matchedElements;

         dale.stop (line.trim ().split (/\s/), false, function (v, k) {
            if (v !== message [k + matchedElementsBeforeLine]) return false;
            matchedElements++;
         });
         if (matchedElements === message.length) {
            matchFound = true;
            output.push (line.slice (message.join (' ').length + 1));
         }
         return;
      }

      if (matchFound) {
         var indent = spaces (message.join (' ').length + 1);
         if (line.match (new RegExp ('^' + indent))) output.push (line.replace (indent, ''));
         else return false;
      }

   });

   return output.join ('\n');
}

// For now: 1) single line calls; 2) no quotes!
var put = function (message) {
   var done = function (dataspace) {
      localStorage.setItem ('cell', dataspace);
      B.call ('set', 'dataspace', dataspace);
      return 'OK';
   }

   var dataspace = localStorage.getItem ('cell');
   if (dataspace === null) dataspace = '';
   if (message.length === 0) return done ('');

   // message of length 1 is considered as a delete
   if (message.length === 1) return done (dataspace.replace (prepend (message [0], get (message)), ''));

   // Three cases: no entry (append), entry (overwrite) or part of the path already exists

   // Match just before the "equal sign" (TODO: change detection of "equal sign" later to first fork)
   var existing = get (message.slice (0, -1));
   if (existing !== '') {
      existing = prepend (message.slice (0, -1).join (' '), existing);
      return done (dataspace.replace (existing, message.join (' ')));
   }

   // If there is not something existing with the full path before the equal sign, do two things:
   // 1) find where to put it
   // 2) figure out how much space to prepend it with (the space will be proportional to the amount of leftmost elements of the message that already exist). No, wait, if it's the first line, then it will be the one that starts with foo, and the previous line that started with foo will get moved down and have a space.
   // Also an interesting problem: mixing lists and hashes. Let's forbid it.

   dale.stop (dale.times (length - 2), true, function (v) {
      existing (get (message.slice (0, -1 - v)));
      return existing !== '';
   });

   if (existing) {
      // TODO: insertion respecting what's there, alphabetical sort
   }

   // Append, also mind alphabetical sort
   dataspace += '\n' + message.join (' ');
}

// *** RESPONDERS ***

B.mrespond ([
   ['reset', [], function (x, dataspace) {
      if (! dataspace) dataspace = [
         'foo bar 1 jip',
         '        2 joo',
         '    soda wey',
         'something else'
      ].join ('\n');
      else dataspace = dataspace.join ('\n');

      localStorage.setItem ('cell', dataspace);
      B.call ('set', 'dataspace', dataspace);
   }],
   ['initialize', [], function (x) {
      var dataspace = localStorage.getItem ('cell');
      if (dataspace === null) B.call (x, 'reset', []);
   }],
   ['send', 'call', function (x, call) {
      receive (call);
   }],
]);

var views = {};

views.main = function () {
   return B.view ([['dataspace'], ['call']], function (dataspace, call) {
      call = call || '';
      return ['div', [
         ['style', css],
         views.cell (''),
         ['textarea', {
            onchange: B.ev ('set', 'call'),
            oninput: B.ev ('set', 'call'),
            value: call,
         }],
         ['button', {onclick: B.ev (['send', 'call', call])}, 'Submit'],
      ]];
   });
}

views.cell = function (path) {
   return B.view ('dataspace', function (dataspace) {
      var response = get (path);
      return ['div', [
         ['h3', JSON.stringify (path)],
         ['pre', response]
      ]];
   });
}

B.call ('initialize', []);

B.mount ('body', views.main);

// *** TESTS ***

var test = function () {
   var original = localStorage.getItem ('cell');

   B.call ('reset', [], [
      'foo bar 1 jip',
      '        2 joo',
      '    soda wey',
      'something else'
   ]);


   var errorFound = false === dale.stop ([
      {splitter: '', expected: []},
      {splitter: ' ', expected: {error: 'The first line of the message cannot be indented'}},
      {splitter: '\t ', expected: {error: 'The line "\t " contains a space that is not contained within quotes.'}},
      {splitter: 'holding"out', expected: {error: 'The line "holding"out" has an unescaped quote.'}},
      {splitter: ['"multiline', 'trickery" some 2 "calm', 'animal"'], expected: [['multiline\ntrickery', 'some', 2, 'calm\nanimal']]},
      {splitter: ['a b', 'c'], expected: [['a', 'b'], ['c']]},
      {splitter: ['foo bar 1', '   jip 2'], expected: {error: 'The indent of the line "   jip 2" does not match that of the previous line.'}},
      {splitter: ['foo bar 1', '                        jip 2'], expected: {error: 'The indent of the line "                        jip 2" does not match that of the previous line.'}},
      {splitter: ['foo bar 1', '    jip  2'], expected: {error: 'The line "    jip  2" has at least two spaces separating two elements.'}},
      {splitter: ['foo bar 1', '    jip 2'], expected: [['foo', 'bar', 1], ['foo', 'jip', 2]]},
      {splitter: ['foo bar 0.1', '    jip 2.75'], expected: [['foo', 'bar', 0.1], ['foo', 'jip', 2.75]]},
      {splitter: ['foo 1 hey', '    2 yo'], expected: [['foo', 1, 'hey'], ['foo', 2, 'yo']]},
      {splitter: 'something"foo" 1', expected: {error: 'The line "something"foo" 1" has an unescaped quote.'}},
      {splitter: '"foo bar" 1', expected: [['foo bar', 1]]},
      {splitter: '"foo bar"x1', expected: {error: 'No space after a quote in line ""foo bar"x1"'}},
      {splitter: ['foo "bar', 'i am on a new line but I am still the same text" 1'], expected: [['foo', 'bar\ni am on a new line but I am still the same text', 1]]},
      {splitter: 'foo "1" bar', expected: [['foo', '1', 'bar']]},
      {splitter: ['"i am text', '', '', 'yep"'], expected: [['i am text\n\n\nyep']]},
      {splitter: 'foo "bar"', expected: [['foo', 'bar']]},
      {splitter: 'foo "bar yep"', expected: [['foo', 'bar yep']]},
      {splitter: 'empty "" indeed', expected: [['empty', '', 'indeed']]},
      {splitter: ['"just multiline', '', '"'], expected: [['just multiline\n\n']]},
      /*
      {call: '', expected: 'error "Message is empty"'},
      {call: ' ', expected: 'error "Message is empty"'},
      {call: '?', expected: 'error "Call must start with `@`"'},
      {call: '@foo', expected: 'error "Call must start with `@` and have a space after it"'},
      {call: '@', expected: [
         'foo bar 1 jip',
         '        2 joo',
         '    soda wey',
         'something else'
      ]},
      {call: '@ foo', expected: [
         'bar 1 jip',
         '    2 joo',
         'soda wey',
      ]},
      {call: '@ foo bar', expected: [
         '1 jip',
         '2 joo',
      ]},
      {call: '@ foo bar 1', expected: 'jip'},
      {call: '@ foo bar 1 jip', expected: ''},
      {call: '@ no such thing', expected: ''},
      {call: '@ foo soda', expected: 'wey'},
      {call: '@ something', expected: 'else'},
      {call: '@ something else', expected: ''},
      {reset: [
         'foo bar 1 jip',
         '        2 joo',
         '    soda wey'
      ]},

      // *** PUT ***

      {call: '@ put foo bar hey', expected: 'OK'},
      {call: '@ foo bar', expected: 'hey'},
      {call: '@ foo', expected: ['bar hey', 'soda wey']},
      /*
      {call: '@ put foo bar hey hey', expected: 'OK'},
      {call: '@ foo bar', expected: 'hey hey'},
      {reset: [
         'foo bar 1 jip',
         '        2 joo',
         '    soda wey'
      ]},
      {call: '@ put foo', expected: 'OK'},
      {call: '@ foo', expected: ''},
      {call: '@', expected: ''},
      {reset: [
         'foo bar 1 jip',
         '        2 joo',
         '    soda wey'
      ]},
      {call: '@ put', expected: 'OK'},
      {call: '@', expected: ''},
      {reset: [
         'foo bar 1 jip',
         '        2 joo',
         '    soda wey'
      ]},
      {call: '@ put foo jup yea', expected: 'OK'},
      /*
      {call: '@ foo', expected: [
         'bar 1 jip',
         'bar 2 joo',
         'jup yea',
         'soda wey'
      ]},
      // TODO: multiline
      {call: '@ put foo bar yes sir', expected: 'OK'},
      {call: [
         '@ put foo bar yes sir',
         '              no sir'
      ]},
      {call: '@ foo bar', expected: ['1 jip', '2 joo', '3 yes']}
      */
   ], false, function (test) {
      if (test.reset) return B.call ('reset', [], test.reset);

      var result = test.call ? receive (test.call) : splitter (teishi.type (test.splitter) === 'array' ? test.splitter.join ('\n') : test.splitter);
      if (test.call && teishi.type (test.expected) === 'array') test.expected = test.expected.join ('\n');
      if (teishi.eq (result, test.expected)) return true;
      clog ('Test mismatch', {expected: test.expected, obtained: result});

      return false;
   });
   if (errorFound) clog ('A test did not pass');
   else clog ('All tests successful');

   B.call ('reset', [], [original]);
}

test ();
