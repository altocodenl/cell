// *** SETUP ***

var B = window.B;

var clog = console.log;

// *** DATASPACE ***

B.call ('set', 'dataspace', []);

var load = function () {
   var text = localStorage.getItem ('cell');
   if (text === null) text = '';
   B.call ('set', 'dataspace', parser (text));
}

var save = function () {
   localStorage.setItem ('cell', texter (B.get ('dataspace')));
}

// *** MAIN FUNCTIONS ***

// The pather takes text, presumably formatted as fourdata, and returns a list of paths.
// For example: `foo bar 1\n    jip 2` will become [['foo', 'bar', 1], ['foo', 'jip', 2]]

var pather = function (message) {

   var toNumberIfNumber = function (text) {
      if (text.match (/^-?(\d+\.)?\d+/) !== null) return parseFloat (text);
      return text;
   }

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

var texter = function (paths) {

   var quoter = function (text) {
      if (text.match (/^-?(\d+\.)?\d+/) !== null) return '"' + text + '"';
      if (text.match ('"') || text.match (/\s/)) return '"' + text.replace (/"/g, /\"/) + '"';
      if (text.length === 0) return '""';
      return text;
   }

   var spaces = function (n) {
      return Array (n).fill (' ').join ('');
   }

   var output = [];

   var pathToText = function (path) {
      return dale.go (path, function (v) {
         return teishi.type (v) === 'string' ? quoter (v) : (v + '');
      }).join (' ');
   }

   dale.go (paths, function (path, k) {
      var commonPrefix = [];
      if (k > 0) dale.stop (paths [k - 1], false, function (v, k) {
         if (v === path [k]) commonPrefix.push (v);
         return false;
      });
      path = path.slice (commonPrefix.length);
      var indent = spaces (pathToText (commonPrefix).length);
      output.push (indent + (indent.length > 0 ? ' ' : '') + pathToText (path));
   });

   return output.join ('\n');
}

var receive = function (message) {

   var paths = parser (message);
   if (paths.error) return [['error', paths.error]];

   if (! paths.length) return '';

   if (paths [0] [0] !== '@') return [['error', 'The call must start with "@" but instead starts with "' + paths [0] [0] + '"']];
   var extraKey = dale.stopNot (paths, undefined, function (path) {
      if (path [0] !== '@') return path [0];
   });
   if (extraKey !== undefined) return [['error', 'The call must not have extra keys besides "@", but it has a key "' + extraKey + '"']];

   if (paths [0] [1] === 'put') {
      var extraKey = dale.stopNot (paths, undefined, function (path) {
         if (path [1] !== 'put') return path [1];
      });
      if (extraKey !== undefined) return [['error', 'The call must not have a path besides "@ put", but it has a path "@ ' + extraKey + '"']];

      return put (dale.go (paths, function (path) {
         return path.slice (2);
      }));
   }

   if (paths.length > 1) return [['error', 'A get call cannot have multiple paths, but it has a path "' + paths [1].join (' ') + '"']];

   return get (paths [0].slice (1), []);
}

var get = function (queryPath, contextPath) {
   var dataspace = B.get ('dataspace');

   return dale.stopNot (dale.times (contextPath.length + 1, contextPath.length, -1), undefined, function (k) {

      var matches = dale.fil (dataspace, undefined, function (path) {
         if (contextPath.length && ! teishi.eq (contextPath.slice (0, k), path.slice (0, k))) return;
         path = path.slice (k);

         if (teishi.eq (queryPath, path.slice (0, queryPath.length)) && path.length > queryPath.length) return path.slice (queryPath.length);
      });

      if (matches.length > 0) return matches;

   }) || [];
}

var put = function (paths) {
   var dataspace = B.get ('dataspace');

   if (teishi.type (paths [0] [0]) !== 'integer') return [['error', 'A put call can only receive a list.']];
   if ((teishi.last (paths) [0] % 2) !== 0) return [['error', 'A put call can only receive a list with an even number of elements.']];

   var error = dale.stopNot (paths, undefined, function (path, k) {
      if ((path [0] % 2) === 1 && paths [k + 1] && paths [k + 1] [0] === path [0]) return 'A target value can only be a single path, but there is a multiple target value "' + texter ([paths [k + 1]]) + '"';
   });
   if (error) return [['error', error]];

   var pairs = [];
   dale.go (paths, function (path) {
      if ((path [0] % 2) === 1) pairs.push ([path.slice (1), []]);
      else {
         teishi.last (pairs) [1].push (teishi.last (pairs) [0].concat (path.slice (1)));
      }
   });

   error = dale.stopNot (pairs, undefined, function (v) {
      var leftSide = v [0];
      var rightSide = v [1];

      if (v [0] [0] === 'put') return 'I\'m sorry Dave, I\'m afraid I can\'t do that';

      dataspace = dale.fil (dataspace, undefined, function (path) {
         if (teishi.eq (leftSide, path.slice (0, leftSide.length))) return;
         return path;
      }).concat (rightSide);

      sorter (dataspace);

      var validationError = validator (dataspace);
      if (validationError !== true) return validationError.error;
   });

   if (error) return [['error', error]];

   B.call ('set', 'dataspace', dataspace);
   return [['ok']];
}

// *** TESTS ***

var test = function () {
   var start = teishi.time ();

   var originalDataspace = teishi.copy (B.get ('dataspace'));

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
      {f: parser, input: 1, expected: {error: 'The message must be text but instead is integer'}},
      {f: parser, input: 'foo bar', expected: [['foo', 'bar']]},
      {f: parser, input: 'foo 1', expected: [['foo', 1]]},
      {f: parser, input: '. foo\n. bar', expected: [[1, 'foo'], [2, 'bar']]},
      {f: parser, input: '1 foo\n1 jip', expected: {error: 'The path "1 jip" is repeated.'}},
      // For texter, we use all the non-error test cases of pather, but switching input with expected.
      {f: texter, expected: '', input: []},
      {f: texter, expected: ['"multiline', 'trickery" some 2 "calm', 'animal"'], input: [['multiline\ntrickery', 'some', 2, 'calm\nanimal']]},
      {f: texter, expected: ['a b', 'c'], input: [['a', 'b'], ['c']]},
      {f: texter, expected: ['foo bar 1', '    jip 2'], input: [['foo', 'bar', 1], ['foo', 'jip', 2]]},
      {f: texter, expected: ['foo bar 0.1', '    jip 2.75'], input: [['foo', 'bar', 0.1], ['foo', 'jip', 2.75]]},
      {f: texter, expected: ['foo 1 hey', '    2 yo'], input: [['foo', 1, 'hey'], ['foo', 2, 'yo']]},
      {f: texter, expected: '"foo bar" 1', input: [['foo bar', 1]]},
      {f: texter, expected: ['foo "bar', 'i am on a new line but I am still the same text" 1'], input: [['foo', 'bar\ni am on a new line but I am still the same text', 1]]},
      {f: texter, expected: 'foo "1" bar', input: [['foo', '1', 'bar']]},
      {f: texter, expected: ['"i am text', '', '', 'yep"'], input: [['i am text\n\n\nyep']]},
      {f: texter, expected: 'foo bar', input: [['foo', 'bar']]},
      {f: texter, expected: 'foo "bar yep"', input: [['foo', 'bar yep']]},
      {f: texter, expected: 'empty "" indeed', input: [['empty', '', 'indeed']]},
      {f: texter, expected: ['"just multiline', '', '"'], input: [['just multiline\n\n']]},
      {f: receive, input: 1, expected: [['error', 'The message must be text but instead is integer']]},
      {f: receive, input: '', expected: ''},
      {f: receive, input: 'foo bar', expected: [['error', 'The call must start with "@" but instead starts with "foo"']]},
      {f: receive, input: '@ foo bar\nGroovies jip', expected: [['error', 'The call must not have extra keys besides "@", but it has a key "Groovies"']]},
      {f: receive, input: '@ something is\n  another thing', expected: [['error', 'A get call cannot have multiple paths, but it has a path "@ something is"']]},
      {f: receive, input: '@ put something\nGroovies jip', expected: [['error', 'The call must not have extra keys besides "@", but it has a key "Groovies"']]},
      {f: receive, input: '@ put something\n@ Groovies jip', expected: [['error', 'The call must not have a path besides "@ put", but it has a path "@ Groovies"']]},
      {f: receive, input: '@ put something\n@ Groovies jip', expected: [['error', 'The call must not have a path besides "@ put", but it has a path "@ Groovies"']]},
      {f: receive, input: '@ put foo bar 1\n@ put foo jip 2', expected: [['error', 'A put call can only receive a list.']]},
      {f: receive, input: '@ put 1 foo bar', expected: [['error', 'A put call can only receive a list with an even number of elements.']]},
      {f: receive, input: '@ put 1 foo bar\n@ put 1 something else\n@ put 2 value', expected: [['error', 'A target value can only be a single path, but there is a multiple target value "1 something else"']]},
      {reset: [
         ['foo', 'bar', 1, 'jip'],
         ['foo', 'bar', 2, 'joo'],
         ['foo', 'soda', 'wey'],
         ['something', 'else']
      ]},
      {f: receive, input: '@', expected: [
         ['foo', 'bar', 1, 'jip'],
         ['foo', 'bar', 2, 'joo'],
         ['foo', 'soda', 'wey'],
         ['something', 'else']
      ]},
      {f: receive, input: '@ foo', expected: [
         ['bar', 1, 'jip'],
         ['bar', 2, 'joo'],
         ['soda', 'wey'],
      ]},
      {f: receive, input: '@ foo bar', expected: [
         [1, 'jip'],
         [2, 'joo'],
      ]},
      {f: receive, input: '@ foo bar 1', expected: [
         ['jip'],
      ]},
      {f: receive, input: '@ foo bar 1 jip', expected: [
      ]},
      {f: receive, input: '@ no such thing', expected: [
      ]},
      {f: receive, input: '@ foo soda', expected: [
         ['wey']
      ]},
      {f: receive, input: '@ something', expected: [
         ['else']
      ]},
      {f: receive, input: '@ something else', expected: [
      ]},
      {reset: [
         ['foo', 10],
         ['inner', 'foo', 20],
         ['inner', 'jip', 'foo', 30],
      ]},
      {f: get, query: ['foo'], context: [], expected: [
         [10]
      ]},
      {f: get, query: ['foo'], context: ['foo'], expected: [
         [10]
      ]},
      {f: get, query: ['bar'], context: ['foo'], expected: [
      ]},
      {f: get, query: ['foo'], context: ['inner'], expected: [
         [20],
      ]},
      {f: get, query: ['foo'], context: ['inner', 'jip'], expected: [
         [30],
      ]},
      {f: get, query: ['foo'], context: ['inner', 'jip', 'foo'], expected: [
         [30],
      ]},

      // *** PUT ***

      {reset: [
         ['foo', 'bar', 1, 'jip'],
         ['foo', 'bar', 2, 'joo'],
      ]},
      {f: receive, input: ['@ put . foo bar', '@ put . hey'], expected: [['ok']]},
      {f: receive, input: '@ foo bar', expected: [['hey']]},
      {f: receive, input: ['@ put . foo', '@ put . 1'], expected: [['ok']]},
      {f: receive, input: '@ foo', expected: [[1]]},
      {f: receive, input: '@', expected: [['foo', 1]]},
      {reset: [
         ['foo', 'bar', 1, 'jip'],
         ['foo', 'bar', 2, 'joo'],
      ]},
      {f: receive, input: ['@ put . foo', '@ put . bar hey'], expected: [['ok']]},
      {f: receive, input: '@ foo', expected: [['bar', 'hey']]},
      {f: receive, input: '@ foo bar', expected: [['hey']]},
      {f: receive, input: '@ put . foo 2\n@ put . something', expected: [['error', 'The path "foo bar hey" is setting a hash but there is already a list at path "foo"']]},
      {reset: [
         ['foo', 'bar', 1, 'jip'],
         ['foo', 'bar', 2, 'joo'],
         ['foo', 'soda', 'wey'],
      ]},
      {f: receive, input: ['@ put . foo', '@ put . ""'], expected: [['ok']]},
      {f: receive, input: '@ foo', expected: [['']]},
      {reset: [
         ['foo', 'bar', 1, 'jip'],
         ['foo', 'bar', 2, 'joo'],
         ['foo', 'soda', 'wey'],
      ]},
      {f: receive, input: ['@ put . foo jup', '@ put . yea'], expected: [['ok']]},
      {f: receive, input: '@ foo', expected: [
         ['bar', 1, 'jip'],
         ['bar', 2, 'joo'],
         ['jup', 'yea'],
         ['soda', 'wey']
      ]},
      {f: receive, input: ['@ put . foo bar yes', '@ put . sir'], expected: [['error', 'The path "foo bar yes sir" is setting a hash but there is already a list at path "foo bar"']]},
      {f: receive, input: ['@ put . foo "\n\nbar"', '@ put . 1'], expected: [['ok']]},
      {f: receive, input: ['@ foo "\n\nbar"'], expected: [[1]]},

      {f: receive, input: ['@ put . put', '@ put . 1'], expected: [['error', 'I\'m sorry Dave, I\'m afraid I can\'t do that']]},
   ], false, function (test) {

      if (test.reset) return B.call ('set', 'dataspace', test.reset);

      if (test.f === pather  && teishi.type (test.input)    === 'array') test.input = test.input.join ('\n');
      if (test.f === receive && teishi.type (test.input)    === 'array') test.input = test.input.join ('\n');
      if (test.f === texter  && teishi.type (test.expected) === 'array') test.expected = test.expected.join ('\n');

      if (test.f === get) var result = get (test.query, test.context);
      else                var result = test.f (test.input);

      if (teishi.eq (result, test.expected)) return true;
      clog ('Test mismatch', {expected: test.expected, obtained: result});
      return false;
   });
   if (errorFound) clog ('A test did not pass');
   else clog ('All tests successful', (teishi.time () - start) + 'ms');

   B.call ('set', 'dataspace', originalDataspace);
}

test ();

// *** RESPONDERS ***

B.mrespond ([
   ['change', 'dataspace', function (x) {
      save ();
   }],
   ['initialize', [], function (x) {
      load ();
      if (B.get ('dataspace').length === 0) B.call (x, 'set', 'dataspace', [
         ['foo', 'bar', 1, 'jip'],
         ['foo', 'bar', 2, 'joo'],
         ['foo', 'soda', 'wey'],
         ['something', 'else']
      ]);
   }],
   ['send', 'call', function (x, call) {
      var response = receive (call);
      var dialogue = receive ('@ dialogue');
      var length = 0;
      if (dialogue.length) length = teishi.last (dialogue) [0];
      put ([
         [1, 'dialogue', length + 1, 'from'],
         [2, 'user'],
         [3, 'dialogue', length + 1, 'message'],
         [4, call],
         [5, 'dialogue', length + 2, 'from'],
         [6, 'cell'],
         [7, 'dialogue', length + 2, 'message'],
         [8, texter (response)],
      ]);

      B.call (x, 'rem', [], 'call');
   }],
]);

// *** VIEWS ***

var views = {};

views.css = [
   ['body', {'padding-left, padding-top': 30, height: 100}]
];

views.main = function () {

   return B.view ([['dataspace'], ['call']], function (dataspace, call) {
      var dialogue = [];
      dale.go (get (['dialogue'], []), function (v) {
         if (v [1] === 'from') dialogue.push ({from: v [2]});
         else teishi.last (dialogue).message = v [2];
      });
      call = call || '';
      return ['div', [
         ['style', views.css],
         ['div', {class: 'main fl w-60 bg-dark-green near-white pa2'}, [
            views.cell ([]),
         ]],
         ['div', {class: 'dialogue fl w-40 pa2 bg-black'}, [
            dale.go (dialogue || [], function (item) {
               var classes = 'code w-70 pa2 ba br3 mb2';
               if (item.from === 'user') classes += ' fr';
               else                      classes += ' fl bg-dark-green near-white';
               return ['textarea', {class: classes, readonly: true, value: item.message, rows: item.message.split ('\n').length}, item.message];
            }),
            ['textarea', {
               class: 'code w-70 pa2 ba br3 mb2 fr',
               onchange: B.ev ('set', 'call'),
               oninput: B.ev ('set', 'call'),
               autofocus: true,
               value: call,
            }],
            ['button', {class: 'w-100', onclick: B.ev (['send', 'call', call])}, 'Submit'],
         ]],
      ]];
   });
}

views.cell = function (path) {
   return B.view ('dataspace', function (dataspace) {
      var response = get (path, []);
      return ['div', [
         ['h3', 'Location: ' + (texter (path) || 'all')],
         ['pre', texter (response)]
      ]];
   });
}

B.call ('initialize', []);

B.mount ('body', views.main);
