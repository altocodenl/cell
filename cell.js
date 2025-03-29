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

// The pather takes text, presumably formatted as fourdata, and returns a list of paths.
// For example: `foo bar 1\n    jip 2` will become [['foo', 'bar', 1], ['foo', 'jip', 2]]
var pather = function (message) {

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

var dedotter = function (paths) {
   dale.go (paths, function (v, k) {
      dale.go (v, function (v2, k2) {
         if (v2 !== '.') return;
         var lastPath = paths [k - 1];
         var continuing;
         if (lastPath === undefined) continuing = false;
         else continuing = teishi.eq (lastPath.slice (0, k2), v.slice (0, k2)) && teishi.type (lastPath [k2]) !== 'string';

         if (! continuing) paths [k] [k2] = 1;
         else              paths [k] [k2] = lastPath [k2] + 1;
      });
   });
   return paths;
}

var sorter = function (paths) {

   var compare = function (v1, v2) {
      var types = [teishi.type (v1) === 'string' ? 'text' : 'number', teishi.type (v2) === 'string' ? 'text' : 'number'];
      // Numbers first.
      if (types [0] !== types [1]) return types [1] === 'text' ? -1 : 1;
      if (types [0] === 'number') return v1 - v2;

      // Sort uppercase and lowercase separately: aA bB cC. Lowercase goes up.
      return dale.stopNot (dale.times (Math.max (v1.length, v2.length), 0), 0, function (k) {
         var chars = [
            v1 [k] === undefined ? ' ' : v1 [k],
            v2 [k] === undefined ? ' ' : v2 [k]
         ];
         var cases = [
            chars [0] === chars [0].toUpperCase () ? 'upper' : 'lower',
            chars [1] === chars [1].toUpperCase () ? 'upper' : 'lower'
         ];
         if (cases [0] !== cases [1]) return cases [1] === 'upper' ? -1 : 1;
         return chars [0].charCodeAt (0) - chars [1].charCodeAt (0);
      }) || 0;

   }

   return paths.sort (function (a, b) {
      return dale.stopNot (dale.times (Math.max (a.length, b.length), 0), 0, function (k) {
         var elements = [
            a [k] === undefined ? '' : a [k],
            b [k] === undefined ? '' : b [k],
         ];
         return compare (elements [0], elements [1]);
      });
   });
}

var validator = function (paths) {

   var seen = {};

   var error = dale.stopNot (paths, undefined, function (path) {

      return dale.stopNot (path, undefined, function (v, k) {
         if (teishi.type (v) === 'float' && k + 1 < path.length) return 'A float can only be a final value, but path "' + path.join (' ') + '" uses it as a key.';

         var type = teishi.type (v) === 'string' ? (k + 1 < path.length ? 'hash' : 'text') : (k + 1 < path.length ? 'list' : 'number');

         var seenKey = JSON.stringify (path.slice (0, k));
         if (! seen [seenKey]) seen [seenKey] = type;
         else {
            if (seen [seenKey] !== type) return 'The path "' + path.join (' ') + '" is setting a ' + type + ' but there is already a ' + seen [seenKey] + ' at path "' + path.slice (0, k).join (' ') + '"';
            if (type === 'number' || type === 'text') return 'The path "' + path.join (' ') + '" is repeated.';
         }
      });
   });

   return error ? {error: error} : true;
}

var parser = function (message) {
   if (teishi.type (message) !== 'string') return {error: 'The message must be text but instead is ' + teishi.type (message)};

   var paths = pather (message);
   if (paths.error) return paths;
   paths = sorter (dedotter (paths));
   var error = validator (paths);
   if (error !== true) return error;
   return paths;
}

var call = function (message) {

   var paths = parser (message);
   if (paths.error) return paths;

   if (! paths.length) return '';

   if (paths [0] [0] !== '@') return {error: 'The call must start with `@`'};
   var extraKey = dale.stopNot (paths, undefined, function (path) {
      if (path [0] !== '@') return path [0];
   });
   if (extraKey !== undefined) return {error: 'The call must not have extra keys, but it has a key "' + extraKey + '"'};

   if (paths [0] [1] === 'put') {
      var extraKey = dale.stopNot (paths, undefined, function (path) {
         if (path [1] !== 'put') return path [1];
      });
      if (extraKey !== undefined) return {error: 'A `put` call must not have extra keys, but it has a key "' + extraKey + '"'};
      return put (dale.go (paths, function (path) {
         return path.slice (2);
      }));
   }

   if (paths.length > 1) return {error: 'A `get` call cannot have multiple paths, but it has a path "' + paths [1].join (' ') + '"'};

   return get (dale.go (paths, function (path) {
      return path.slice (1);
   }));
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
      {f: pather, input: '', expected: []},
      {f: pather, input: ' ', expected: {error: 'The first line of the message cannot be indented'}},
      {f: pather, input: '\t ', expected: {error: 'The line "\t " contains a space that is not contained within quotes.'}},
      {f: pather, input: 'holding"out', expected: {error: 'The line "holding"out" has an unescaped quote.'}},
      {f: pather, input: ['"multiline', 'trickery" some 2 "calm', 'animal"'], expected: [['multiline\ntrickery', 'some', 2, 'calm\nanimal']]},
      {f: pather, input: ['a b', 'c'], expected: [['a', 'b'], ['c']]},
      {f: pather, input: ['foo bar 1', '   jip 2'], expected: {error: 'The indent of the line "   jip 2" does not match that of the previous line.'}},
      {f: pather, input: ['foo bar 1', '                        jip 2'], expected: {error: 'The indent of the line "                        jip 2" does not match that of the previous line.'}},
      {f: pather, input: ['foo bar 1', '    jip  2'], expected: {error: 'The line "    jip  2" has at least two spaces separating two elements.'}},
      {f: pather, input: ['foo bar 1', '    jip 2'], expected: [['foo', 'bar', 1], ['foo', 'jip', 2]]},
      {f: pather, input: ['foo bar 0.1', '    jip 2.75'], expected: [['foo', 'bar', 0.1], ['foo', 'jip', 2.75]]},
      {f: pather, input: ['foo 1 hey', '    2 yo'], expected: [['foo', 1, 'hey'], ['foo', 2, 'yo']]},
      {f: pather, input: 'something"foo" 1', expected: {error: 'The line "something"foo" 1" has an unescaped quote.'}},
      {f: pather, input: '"foo bar" 1', expected: [['foo bar', 1]]},
      {f: pather, input: '"foo bar"x1', expected: {error: 'No space after a quote in line ""foo bar"x1"'}},
      {f: pather, input: ['foo "bar', 'i am on a new line but I am still the same text" 1'], expected: [['foo', 'bar\ni am on a new line but I am still the same text', 1]]},
      {f: pather, input: 'foo "1" bar', expected: [['foo', '1', 'bar']]},
      {f: pather, input: ['"i am text', '', '', 'yep"'], expected: [['i am text\n\n\nyep']]},
      {f: pather, input: 'foo "bar"', expected: [['foo', 'bar']]},
      {f: pather, input: 'foo "bar yep"', expected: [['foo', 'bar yep']]},
      {f: pather, input: 'empty "" indeed', expected: [['empty', '', 'indeed']]},
      {f: pather, input: ['"just multiline', '', '"'], expected: [['just multiline\n\n']]},
      {f: dedotter, input: [['foo', '.', 'first'], ['foo', '.', 'second']], expected: [['foo', 1, 'first'], ['foo', 2, 'second']]},
      {f: dedotter, input: [['foo', '.', 'first'], ['bar', '.', 'second']], expected: [['foo', 1, 'first'], ['bar', 1, 'second']]},
      {f: dedotter, input: [['foo', 'klank', 'first'], ['foo', '.', 'second']], expected: [['foo', 'klank', 'first'], ['foo', 1, 'second']]},
      {f: dedotter, input: [['foo', '.', 'first'], ['foo', '.', 'second'], ['foo', '.', 'third']], expected: [['foo', 1, 'first'], ['foo', 2, 'second'], ['foo', 3, 'third']]},
      {f: sorter, input: [['foo', 'bar', 1], ['foo', 'bar', 2]], expected: [['foo', 'bar', 1], ['foo', 'bar', 2]]},
      {f: sorter, input: [['foo', 'bar', 2], ['foo', 'bar', 1]], expected: [['foo', 'bar', 1], ['foo', 'bar', 2]]},
      {f: sorter, input: [['foo', 'jip', 1], ['foo', 'bar', 1]], expected: [['foo', 'bar', 1], ['foo', 'jip', 1]]},
      {f: sorter, input: [['foo', 'jip', 1], ['Foo', 'jip', 1]], expected: [['foo', 'jip', 1], ['Foo', 'jip', 1]]},
      {f: sorter, input: [['Foo', 'jip', 1], ['foo', 'jip', 1]], expected: [['foo', 'jip', 1], ['Foo', 'jip', 1]]},
      {f: sorter, input: [['foo', 'jip', 1], ['foo', 1, 1]], expected: [['foo', 1, 1], ['foo', 'jip', 1]]},
      {f: sorter, input: [['foo', 'Jip', 1], ['foo', 1, 1]], expected: [['foo', 1, 1], ['foo', 'Jip', 1]]},
      {f: validator, input: [['foo', 'jip']], expected: true},
      {f: validator, input: [['foo', 'bar', 1]], expected: true},
      {f: validator, input: [['foo', 'jip'], ['foo', 'bar', 1]], expected: {error: 'The path "foo bar 1" is setting a hash but there is already a text at path "foo"'}},
      {f: validator, input: [['foo', 'mau5', 'jip'], ['foo', 'mau5', 'bar', 1]], expected: {error: 'The path "foo mau5 bar 1" is setting a hash but there is already a text at path "foo mau5"'}},
      {f: validator, input: [['foo', 'jip', 1], ['foo', 2, 2]], expected: {error: 'The path "foo 2 2" is setting a list but there is already a hash at path "foo"'}},
      {f: validator, input: [['foo', 'mau5', 'jip', 1], ['foo', 'mau5', 2, 2]], expected: {error: 'The path "foo mau5 2 2" is setting a list but there is already a hash at path "foo mau5"'}},
      {f: validator, input: [['foo']], expected: true},
      {f: validator, input: [[1]], expected: true},
      {f: validator, input: [], expected: true},
      {f: validator, input: [['foo'], [1]], expected: {error: 'The path "1" is setting a number but there is already a text at path ""'}},
      {f: validator, input: [['foo', 'bar'], ['foo', 'jip']], expected: {error: 'The path "foo jip" is repeated.'}},
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

      if (test.f === pather && teishi.type (test.input) === 'array') test.input = test.input.join ('\n');

      var result = test.f (test.input);

      if (teishi.eq (result, test.expected)) return true;
      clog ('Test mismatch', {expected: test.expected, obtained: result});
      return false;

      /*
      if (test.reset) return B.call ('reset', [], test.reset);

      var result = test.call ? receive (test.call) : pather (teishi.type (test.pather) === 'array' ? test.pather.join ('\n') : test.pather);
      if (test.call && teishi.type (test.expected) === 'array') test.expected = test.expected.join ('\n');
      if (teishi.eq (result, test.expected)) return true;
      clog ('Test mismatch', {expected: test.expected, obtained: result});

      return false;
      */
   });
   if (errorFound) clog ('A test did not pass');
   else clog ('All tests successful');

   B.call ('reset', [], [original]);
}

test ();
