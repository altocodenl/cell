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

// The splitter takes a message that's text, and returns a list of lists: each of them a line of unabridged fourdata, inside JS arrays.
// For example: `foo bar 1\n    jip 2` will become [['foo', 'bar', 1], ['foo', 'jip', 2]]
/*
- Split the line by quotes (") that don't come in pairs. (the way to escape (or rather, write a literal quote) is to write "" (this comes from CSV, I think). If you have an even number, you don't have a multiline quote.
- I need to induce from something:
- No, don't split by quote. You want to mark the beginning and the end. What's before the beginning of a quote can be splitted by spaces, like we did before. When you enter a quote zone, you don't split by spaces until you're done by finding the closing quote. That's the way to see it. So, rather than split, we could just iterate the characters on the string and split in that way.
- Note: would we do trimming of double+ spaces? Yes, but between characters, because indentations have to be precise.
- If you end the line and you have a dangling quote, you then move to the next line and keep on adding to the text you're building (you're always building a text and when you're done, you push it to the splitted line) until you close the quote.
- If you didn't close the quote and you hit the end of the last line, report an error.
*/
var splitter = function (message) {
   var lines = [];
   var buffer = '';
   var insideQuotedText = false;

   if (message === '') return [];

   // We stop at the first error.
   var error = dale.stopNot (message.split ('\n'), undefined, function (line) {

      var deabridged = [];

      var previousLine = teishi.last (lines);

      if (line [0] === ' ') {
         if (! previousLine) return 'The first line of the message cannot be indented';
         var indentSize = line.match (/^ +/g) [0].length;
         var matchedSpaces = 0;
         // previousLine always is nonzero in length, so there's no zero corner case
         var matchUpTo = dale.stopNot (previousLine, undefined, function (v, k) {
            // Converting v to text in case it is a number
            matchedSpaces += (v + '').length + 1;
            if (matchedSpaces === indentSize) return k;
            if (matchedSpaces > indentSize) return {error: 'The indent of the line "' + line + '" does not match that of the previous line.'};
            // If we haven't hit the indentSize, keep on going.
         });
         if (matchUpTo === undefined) return 'The indent of the line "' + line + '" does not match that of the previous line.';
         if (matchUpTo.error) return matchUpTo.error;
         // We store the "deabridged" part of the line as the last element of `lines`
         deabridged = previousLine.slice (0, matchUpTo + 1);
         line = line.slice (matchedSpaces);
      }

      // no quotes for now
      if (line.match (/\s{2,}/)) return 'The line "' + line + '" contains two or more consecutive spaces to separate elements.';

      // forbid ""? No, but we need to represent it as "".
      // what about quoting things that don't have to be quoted? Give an error.
      //
      // found a quote. make sure it's not a literal quote: forward slash and quote.
      // foo ""
      // this is a double quote:    //"hello//"
      line = line.split (' ');

      if (line.length === 0) return 'The line "' + line + '" has no data besides whitespace';

      deabridged = deabridged.concat (dale.go (line, toNumberIfNumber));

      lines.push (deabridged);


      // bar whatever

      //var nextQuoteIndex = line.indexOf ('"');
   });

   if (error) return {error: error};
   return lines;
}

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
      {splitter: ['', []]},
      {splitter: [' ', {error: 'The first line of the message cannot be indented'}]},
      {splitter: ['\t ', {error: 'The line "\t " contains two or more consecutive spaces to separate elements.'}]},
      {splitter: ['a b\nc', [['a', 'b'], ['c']]]},
      {splitter: ['foo bar 1\n   jip 2', {error: 'The indent of the line "   jip 2" does not match that of the previous line.'}]},
      {splitter: ['foo bar 1\n                        jip 2', {error: 'The indent of the line "                        jip 2" does not match that of the previous line.'}]},
      {splitter: ['foo bar 1\n    jip  2', {error: 'The line "jip  2" contains two or more consecutive spaces to separate elements.'}]},
      {splitter: ['foo bar 1\n    jip 2', [['foo', 'bar', 1], ['foo', 'jip', 2]]]},
      {splitter: ['foo bar 0.1\n    jip 2.75', [['foo', 'bar', 0.1], ['foo', 'jip', 2.75]]]},
      {splitter: ['foo 1 hey\n    2 yo', [['foo', 1, 'hey'], ['foo', 2, 'yo']]]},
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

      if (test.splitter) {
         var result = splitter (test.splitter [0]);
         if (teishi.eq (result, test.splitter [1])) return true;
         clog ('Test mismatch', {expected: test.splitter [1], obtained: result});
      }
      else {
         var result = receive (test.call);
         if (teishi.type (test.expected) === 'array') test.expected = test.expected.join ('\n');
         if (result === test.expected) return true;
         clog ('Test mismatch', {expected: test.expected, obtained: result});
      }
      return false;
   });
   if (errorFound) clog ('A test did not pass');
   else clog ('All tests successful');

   B.call ('reset', [], [original]);
}

test ();
