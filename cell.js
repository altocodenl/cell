// *** SETUP ***

var isNode = typeof exports === 'object';

if (isNode) var cell = exports;
else        var cell = {};

var dale   = isNode ? require ('dale')   : window.dale;
var teishi = isNode ? require ('teishi') : window.teishi;

var clog = console.log, type = teishi.type;

// *** MAIN FUNCTIONS ***

// The textToPaths takes text, presumably formatted as fourdata, and returns a list of paths.
// For example: `foo bar 1\n    jip 2` will become [['foo', 'bar', 1], ['foo', 'jip', 2]]

cell.toNumberIfNumber = function (text) {
   if (text.match (/^-?(\d+\.)?\d+/) !== null) return parseFloat (text);
   return text;
}

cell.textToPaths = function (message) {

   var unparseNumber = function (v) {
      if (type (v) !== 'string') return v + '';
      if (v.match (/^-?(\d+\.)?\d+/) !== null) return '"' + v + '"';
      return v;
   }

   var paths = [];
   var insideMultilineText = false;

   if (message === '') return paths;

   var error = dale.stopNot (message.split ('\n'), undefined, function (line) {

      var path = [], originalLine = line, lastPath = teishi.last (paths);

      if (line.length === 0 && ! insideMultilineText) return;

      if (line [0] === ' ' && ! insideMultilineText) {
         if (! lastPath) return 'The first line of the message cannot be indented';
         var indentSize = line.match (/^ +/g) [0].length;
         var matchedSpaces = 0;

         var matchUpTo = dale.stopNot (lastPath, undefined, function (v, k) {
            matchedSpaces += unparseNumber (v).length + 1;
            if (matchedSpaces === indentSize) return k;
            if (matchedSpaces > indentSize) return {error: 'The indent of the line `' + line + '` does not match that of the previous line.'};
         });
         if (matchUpTo === undefined) return 'The indent of the line `' + line + '` does not match that of the previous line.';
         if (matchUpTo.error) return matchUpTo.error;

         path = lastPath.slice (0, matchUpTo + 1);
         line = line.slice (matchedSpaces);

         if (line.length === 0) return 'The line `' + originalLine + '` has no data besides whitespace.';
      }

      var dequoter = function (text) {
         var output = {start: -1, end: -1};

         var unescapeLiteralQuotes = function (text) {
            //return text.replace (/[^\/]\/"/g, '"');
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
            if (output.start === -1) output.text = unescapeLiteralQuotes (text);
            else                     output.text = unescapeLiteralQuotes (text.slice (0, output.start));
         }

         else if (output.start === -1) output.text = text;
         else {
            match = text.slice (output.start + 1).match (findUnescapedQuote);
            if (match) output.end = match.index + output.start + 1;

            output.text = unescapeLiteralQuotes (text.slice (output.start + 1, output.end === -1 ? text.length : output.end + 1))
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
         if (line [0] === ' ') return 'The line `' + originalLine + '` has at least two spaces separating two elements.';

         if (line [0] === '"') {
            var dequoted = dequoter (line);
            if (dequoted.end !== -1) {
               path.push (dequoted.text);
               line = line.slice (dequoted.end + (dequoted.text === '' ? 1 : 2)); // Remove the quote. There's a special case for when the text is empty, because we are removing the second quote.
               // Check that the first element is a space, then remove it
               if (line.length && line [0] !== ' ') return 'No space after a quote in line `' + originalLine + '`';
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
         if (element.match (/\s/)) return 'The line `' + line + '` contains a space that is not contained within quotes.';
         if (element.match (/"/)) return 'The line `' + line + '` has an unescaped quote.';

         line = line.slice (element.length + 1); // Here we don't need to check that the last character sliced is a space, because we used spaces to split the line
         path.push (cell.toNumberIfNumber (element));
      }

      // This will be true if we just closed a multiline text on this line
      if (! paths.includes (path)) paths.push (path);
   });

   if (error) return {error: error};
   if (insideMultilineText) return {error: 'Multiline text not closed: `' + teishi.last (teishi.last (paths)) + '`'};
   return paths;
}

cell.dedotter = function (paths) {
   dale.go (paths, function (v, k) {
      dale.go (v, function (v2, k2) {
         if (v2 !== '.') return;
         var lastPath = paths [k - 1];
         var continuing;
         if (lastPath === undefined) continuing = false;
         else continuing = teishi.eq (lastPath.slice (0, k2), v.slice (0, k2)) && type (lastPath [k2]) !== 'string';

         if (! continuing) paths [k] [k2] = 1;
         else              paths [k] [k2] = lastPath [k2] + 1;
      });
   });
   return paths;
}

cell.sorter = function (paths) {

   var compare = function (v1, v2) {
      var types = [type (v1) === 'string' ? 'text' : 'number', type (v2) === 'string' ? 'text' : 'number'];
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

cell.validator = function (paths) {

   var seen = {};

   var error = dale.stopNot (paths, undefined, function (path) {

      return dale.stopNot (path, undefined, function (v, k) {
         if (type (v) === 'float' && k + 1 < path.length) return 'A float can only be a final value, but path `' + cell.pathsToText ([path]) + '` uses it as a key.';

         var Type = type (v) === 'string' ? (k + 1 < path.length ? 'hash' : 'text') : (k + 1 < path.length ? 'list' : 'number');

         var seenKey = JSON.stringify (path.slice (0, k));
         if (! seen [seenKey]) seen [seenKey] = Type;
         else {
            if (seen [seenKey] !== Type) return 'The path `' + cell.pathsToText ([path]) + '` is setting a ' + Type + ' but there is already a ' + seen [seenKey] + ' at path `' + cell.pathsToText ([path.slice (0, k)]) + '`';
            if (Type === 'number' || Type === 'text') return 'The path `' + cell.pathsToText ([path]) + '` is repeated.';
         }
      });
   });

   return error ? {error: error} : true;
}

cell.parser = function (message) {
   if (type (message) !== 'string') return {error: 'The message must be text but instead is ' + type (message)};

   var paths = cell.textToPaths (message);
   if (paths.error) return paths;
   paths = cell.sorter (cell.dedotter (paths));
   var error = cell.validator (paths);
   if (error !== true) return error;
   return paths;
}

cell.pathsToText = function (paths) {

   var quoter = function (text) {
      if (text.match (/^-?(\d+\.)?\d+/) !== null) return '"' + text + '"';
      if (text.match ('"') || text.match (/\s/)) return '"' + text.replace (/"/g, '/"') + '"';
      if (text.length === 0) return '""';
      return text;
   }

   var spaces = function (n) {
      return Array (n).fill (' ').join ('');
   }

   var output = [];

   var pathToText = function (path) {
      return dale.go (path, function (v) {
         return type (v) === 'string' ? quoter (v) : (v + '');
      }).join (' ');
   }

   dale.go (paths, function (path, k) {
      var commonPrefix = [];
      if (k > 0) dale.stop (paths [k - 1], false, function (v, k) {
         if (v === path [k]) commonPrefix.push (v);
         else return false;
      });
      path = path.slice (commonPrefix.length);
      var indent = spaces (pathToText (commonPrefix).length);
      output.push (indent + (indent.length > 0 ? ' ' : '') + pathToText (path));
   });

   return output.join ('\n');
}

cell.JSToPaths = function (v, paths) {

   paths = paths || [];

   var singleTo4 = function (v) {
      var Type = type (v);
      if (teishi.inc (['integer', 'float', 'string'], Type)) return v;
      if (Type === 'boolean') return v ? 1 : 0;
      if (Type === 'date') return v.toISOString ();
      if (teishi.inc (['regex', 'function', 'infinity'], Type)) return v.toString ();
      // Invalid values (nan, null, undefined) are returned as empty text
      return '';
   }

   var recurse = function (v, path) {
      if (teishi.simple (v)) paths.push ([...path, singleTo4 (v)]);
      else                   dale.go (v, function (v2, k2) {
         recurse (v2, [...path, type (k2) === 'integer' ? k2 + 1 : k2]);
      });
   }

   recurse (v, [])

   return cell.sorter (paths);
}

cell.pathsToJS = function (paths, output) {

   if (paths.length === 0) return {};

   if (paths.length === 1 && paths [0].length === 1) return paths [0] [0];

   var output = type (paths [0] [0]) === 'string' ? {} : [];

   dale.go (paths, function (path) {
      var target = output;
      dale.go (path, function (element, depth) {
         if (depth + 1 === path.length) return;
         if (type (element) === 'integer') element = element - 1;
         if (depth + 2 < path.length) {
            if (target [element] === undefined) target [element] = type (path [depth + 1]) === 'string' ? {} : [];
            target = target [element];
         }
         else target [element] = path [depth + 1];
      });
   });

   return output;
}

cell.call = function (message, get, put) {

   var paths = cell.parser (message);
   if (paths.error) return [['error', paths.error]];

   if (! paths.length) return [];

   if (paths [0] [0] !== '@') return [['error', 'The call must start with `@` but instead starts with `' + paths [0] [0] + '`']];
   var extraKey = dale.stopNot (paths, undefined, function (path) {
      if (path [0] !== '@') return path [0];
   });
   if (extraKey !== undefined) return [['error', 'The call must not have extra keys besides `@`, but it has a key `' + extraKey + '`']];

   if (paths [0] [1] === 'put') {
      var extraKey = dale.stopNot (paths, undefined, function (path) {
         if (path [1] !== 'put') return path [1];
      });
      if (extraKey !== undefined) return [['error', 'The call must not have a path besides `@ put`, but it has a path `@ ' + extraKey + '`']];

      return cell.put (dale.go (paths, function (path) {
         return path.slice (2);
      }), get, put);
   }

   if (paths.length > 1) return [['error', 'A get call cannot have multiple paths, but it has a path `' + paths [1].join (' ') + '`']];

   return cell.get (paths [0].slice (1), [], get);
}

cell.get = function (queryPath, contextPath, get) {
   var dataspace = get ();

   return dale.stopNot (dale.times (contextPath.length + 1, contextPath.length, -1), undefined, function (k) {

      var matches = dale.fil (dataspace, undefined, function (path) {
         if (contextPath.length && ! teishi.eq (contextPath.slice (0, k), path.slice (0, k))) return;
         path = path.slice (k);

         if (teishi.eq (queryPath, path.slice (0, queryPath.length)) && path.length > queryPath.length) return path.slice (queryPath.length);
      });

      if (matches.length > 0) return matches;

   }) || [];
}

cell.put = function (paths, get, put, updateDialogue) {

   var topLevelKeys = dale.keys (cell.pathsToJS (paths)).sort ();
   if (! teishi.eq (topLevelKeys, ['p', 'v'])) return [['error', 'A put call has to be a hash with path and value (`p` and `v`).']];

   var error = dale.stopNot (paths, undefined, function (path, k) {
      if ((path [0] % 2) === 1 && paths [k + 1] && paths [k + 1] [0] === path [0]) return 'A target value can only be a single path, but there is a multiple target value `' + cell.pathsToText ([paths [k + 1]]) + '`';
   });
   if (error) return [['error', error]];

   // We keep the pairs in case we want to implement multi put later
   var pairs = [];
   dale.go (paths, function (path) {
      if (path [0] === 'p') pairs.push ([path.slice (1), []]);
      else {
         teishi.last (pairs) [1].push (teishi.last (pairs) [0].concat (path.slice (1)));
      }
   });

   var dataspace = get ();

   error = dale.stopNot (pairs, undefined, function (v) {
      var leftSide = v [0];
      var rightSide = v [1];

      if (v [0] [0] === 'put') return 'I\'m sorry Dave, I\'m afraid I can\'t do that';
      if (v [0] [0] === 'dialogue' && ! updateDialogue) return 'A dialogue cannot be supressed by force.';

      dataspace = dale.fil (dataspace, undefined, function (path) {
         if (teishi.eq (leftSide, path.slice (0, leftSide.length))) return;
         return path;
      }).concat (rightSide);

      cell.sorter (dataspace);

      var validationError = cell.validator (dataspace);
      if (validationError !== true) return validationError.error;
   });

   if (error) return [['error', error]];

   put (dataspace);

   return [['ok']];
}

// *** TESTS ***

var test = function () {
   var start = teishi.time ();
   var dataspace = [];

   var errorFound = false === dale.stop ([
      {f: cell.textToPaths, input: '', expected: []},
      {f: cell.textToPaths, input: ' ', expected: {error: 'The first line of the message cannot be indented'}},
      {f: cell.textToPaths, input: '\t ', expected: {error: 'The line `\t ` contains a space that is not contained within quotes.'}},
      {f: cell.textToPaths, input: 'holding"out', expected: {error: 'The line `holding"out` has an unescaped quote.'}},
      {f: cell.textToPaths, input: ['"multiline', 'trickery" some 2 "calm', 'animal"'], expected: [['multiline\ntrickery', 'some', 2, 'calm\nanimal']]},
      {f: cell.textToPaths, input: ['a b', 'c'], expected: [['a', 'b'], ['c']]},
      {f: cell.textToPaths, input: ['foo bar 1', '   jip 2'], expected: {error: 'The indent of the line `   jip 2` does not match that of the previous line.'}},
      {f: cell.textToPaths, input: ['foo bar 1', '                        jip 2'], expected: {error: 'The indent of the line `                        jip 2` does not match that of the previous line.'}},
      {f: cell.textToPaths, input: ['foo bar 1', '          '], expected: {error: 'The line `          ` has no data besides whitespace.'}},
      {f: cell.textToPaths, input: ['foo bar 1', '    jip  2'], expected: {error: 'The line `    jip  2` has at least two spaces separating two elements.'}},
      {f: cell.textToPaths, input: ['foo bar 1', '    jip 2'], expected: [['foo', 'bar', 1], ['foo', 'jip', 2]]},
      {f: cell.textToPaths, input: ['foo bar 1', 'foo jip 2'], expected: [['foo', 'bar', 1], ['foo', 'jip', 2]]},
      {f: cell.textToPaths, input: ['foo bar 0.1', '    jip 2.75'], expected: [['foo', 'bar', 0.1], ['foo', 'jip', 2.75]]},
      {f: cell.textToPaths, input: ['foo 1 hey', '    2 yo'], expected: [['foo', 1, 'hey'], ['foo', 2, 'yo']]},
      {f: cell.textToPaths, input: 'something"foo" 1', expected: {error: 'The line `something"foo" 1` has an unescaped quote.'}},
      {f: cell.textToPaths, input: '"foo bar" 1', expected: [['foo bar', 1]]},
      {f: cell.textToPaths, input: '"foo" "bar" 1', expected: [['foo', 'bar', 1]]},
      {f: cell.textToPaths, input: '"/"foo/" /"bar/" 1"', expected: [['"foo" "bar" 1']]},
      {f: cell.textToPaths, input: '"foo bar"x1', expected: {error: 'No space after a quote in line `"foo bar"x1`'}},
      {f: cell.textToPaths, input: ['foo "bar', 'i am on a new line but I am still the same text" 1'], expected: [['foo', 'bar\ni am on a new line but I am still the same text', 1]]},
      {f: cell.textToPaths, input: 'foo "1" bar', expected: [['foo', '1', 'bar']]},
      {f: cell.textToPaths, input: ['"i am text', '', '', 'yep"'], expected: [['i am text\n\n\nyep']]},
      {f: cell.textToPaths, input: 'foo "bar"', expected: [['foo', 'bar']]},
      {f: cell.textToPaths, input: 'foo "bar yep"', expected: [['foo', 'bar yep']]},
      {f: cell.textToPaths, input: 'empty "" indeed', expected: [['empty', '', 'indeed']]},
      {f: cell.textToPaths, input: ['"just multiline', '', '"'], expected: [['just multiline\n\n']]},
      {f: cell.textToPaths, input: ['"The call must start with /"@/" but instead starts with /"w/""'], expected: [['The call must start with "@" but instead starts with "w"']]},
      {f: cell.textToPaths, input: ['dialogue "1" from user', '             message "@ foo"'], expected: [['dialogue', '1', 'from', 'user'], ['dialogue', '1', 'message', '@ foo']]},
      {f: cell.textToPaths, input: ['dialogue 2 from user', '           message "@ foo"'], expected: [['dialogue', 2, 'from', 'user'], ['dialogue', 2, 'message', '@ foo']]},
      // TODO: support this
      // {f: cell.textToPaths, input: ['" /"'], expected: [[' /']]},
      {f: cell.textToPaths, input: ['" /a"'], expected: [[' /a']]},

      {f: cell.dedotter, input: [['foo', '.', 'first'], ['foo', '.', 'second']], expected: [['foo', 1, 'first'], ['foo', 2, 'second']]},
      {f: cell.dedotter, input: [['foo', '.', 'first'], ['bar', '.', 'second']], expected: [['foo', 1, 'first'], ['bar', 1, 'second']]},
      {f: cell.dedotter, input: [['foo', 'klank', 'first'], ['foo', '.', 'second']], expected: [['foo', 'klank', 'first'], ['foo', 1, 'second']]},
      {f: cell.dedotter, input: [['foo', '.', 'first'], ['foo', '.', 'second'], ['foo', '.', 'third']], expected: [['foo', 1, 'first'], ['foo', 2, 'second'], ['foo', 3, 'third']]},
      {f: cell.sorter, input: [['foo', 'bar', 1], ['foo', 'bar', 2]], expected: [['foo', 'bar', 1], ['foo', 'bar', 2]]},
      {f: cell.sorter, input: [['foo', 'bar', 2], ['foo', 'bar', 1]], expected: [['foo', 'bar', 1], ['foo', 'bar', 2]]},
      {f: cell.sorter, input: [['foo', 'jip', 1], ['foo', 'bar', 1]], expected: [['foo', 'bar', 1], ['foo', 'jip', 1]]},
      {f: cell.sorter, input: [['foo', 'jip', 1], ['Foo', 'jip', 1]], expected: [['foo', 'jip', 1], ['Foo', 'jip', 1]]},
      {f: cell.sorter, input: [['Foo', 'jip', 1], ['foo', 'jip', 1]], expected: [['foo', 'jip', 1], ['Foo', 'jip', 1]]},
      {f: cell.sorter, input: [['foo', 'jip', 1], ['foo', 1, 1]], expected: [['foo', 1, 1], ['foo', 'jip', 1]]},
      {f: cell.sorter, input: [['foo', 'Jip', 1], ['foo', 1, 1]], expected: [['foo', 1, 1], ['foo', 'Jip', 1]]},
      {f: cell.validator, input: [['foo', 'jip']], expected: true},
      {f: cell.validator, input: [['foo', 'bar', 1]], expected: true},
      {f: cell.validator, input: [['foo', 'jip'], ['foo', 'bar', 1]], expected: {error: 'The path `foo bar 1` is setting a hash but there is already a text at path `foo`'}},
      {f: cell.validator, input: [['foo', 'mau5', 'jip'], ['foo', 'mau5', 'bar', 1]], expected: {error: 'The path `foo mau5 bar 1` is setting a hash but there is already a text at path `foo mau5`'}},
      {f: cell.validator, input: [['foo', 'jip', 1], ['foo', 2, 2]], expected: {error: 'The path `foo 2 2` is setting a list but there is already a hash at path `foo`'}},
      {f: cell.validator, input: [['foo', 'mau5', 'jip', 1], ['foo', 'mau5', 2, 2]], expected: {error: 'The path `foo mau5 2 2` is setting a list but there is already a hash at path `foo mau5`'}},
      {f: cell.validator, input: [['foo']], expected: true},
      {f: cell.validator, input: [[1]], expected: true},
      {f: cell.validator, input: [], expected: true},
      {f: cell.validator, input: [['foo'], [1]], expected: {error: 'The path `1` is setting a number but there is already a text at path ``'}},
      {f: cell.validator, input: [['foo', 'bar'], ['foo', 'jip']], expected: {error: 'The path `foo jip` is repeated.'}},
      {f: cell.parser, input: 1, expected: {error: 'The message must be text but instead is integer'}},
      {f: cell.parser, input: 'foo bar', expected: [['foo', 'bar']]},
      {f: cell.parser, input: 'foo 1', expected: [['foo', 1]]},
      {f: cell.parser, input: '. foo\n. bar', expected: [[1, 'foo'], [2, 'bar']]},
      {f: cell.parser, input: '1 foo\n1 jip', expected: {error: 'The path `1 jip` is repeated.'}},
      // For pathsToText, we use all the non-error test cases of textToPaths, but switching input with expected.
      {f: cell.pathsToText, expected: '', input: []},
      {f: cell.pathsToText, expected: ['"multiline', 'trickery" some 2 "calm', 'animal"'], input: [['multiline\ntrickery', 'some', 2, 'calm\nanimal']]},
      {f: cell.pathsToText, expected: ['a b', 'c'], input: [['a', 'b'], ['c']]},
      {f: cell.pathsToText, expected: ['foo bar 1', '    jip 2'], input: [['foo', 'bar', 1], ['foo', 'jip', 2]]},
      {f: cell.pathsToText, expected: ['foo bar 0.1', '    jip 2.75'], input: [['foo', 'bar', 0.1], ['foo', 'jip', 2.75]]},
      {f: cell.pathsToText, expected: ['foo 1 hey', '    2 yo'], input: [['foo', 1, 'hey'], ['foo', 2, 'yo']]},
      {f: cell.pathsToText, expected: '"foo bar" 1', input: [['foo bar', 1]]},
      {f: cell.pathsToText, expected: ['foo "bar', 'i am on a new line but I am still the same text" 1'], input: [['foo', 'bar\ni am on a new line but I am still the same text', 1]]},
      {f: cell.pathsToText, expected: 'foo "1" bar', input: [['foo', '1', 'bar']]},
      {f: cell.pathsToText, expected: ['"i am text', '', '', 'yep"'], input: [['i am text\n\n\nyep']]},
      {f: cell.pathsToText, expected: 'foo bar', input: [['foo', 'bar']]},
      {f: cell.pathsToText, expected: 'foo "bar yep"', input: [['foo', 'bar yep']]},
      {f: cell.pathsToText, expected: 'foo "bar yep"', input: [['foo', 'bar yep']]},
      {f: cell.pathsToText, expected: 'empty "" indeed', input: [['empty', '', 'indeed']]},
      {f: cell.pathsToText, expected: ['"just multiline', '', '"'], input: [['just multiline\n\n']]},
      {f: cell.pathsToText, expected: ['foo bar 1 jip', '        2 yes'], input: [['foo', 'bar', 1, 'jip'], ['foo', 'bar', 2, 'yes']]},
      {f: cell.call, input: 1, expected: [['error', 'The message must be text but instead is integer']]},
      {f: cell.call, input: '', expected: []},
      {f: cell.call, input: 'foo bar', expected: [['error', 'The call must start with `@` but instead starts with `foo`']]},
      {f: cell.call, input: '@ foo bar\nGroovies jip', expected: [['error', 'The call must not have extra keys besides `@`, but it has a key `Groovies`']]},
      {f: cell.call, input: '@ something is\n  another thing', expected: [['error', 'A get call cannot have multiple paths, but it has a path `@ something is`']]},
      {f: cell.call, input: '@ put something\nGroovies jip', expected: [['error', 'The call must not have extra keys besides `@`, but it has a key `Groovies`']]},
      {f: cell.call, input: '@ put something\n@ Groovies jip', expected: [['error', 'The call must not have a path besides `@ put`, but it has a path `@ Groovies`']]},
      {f: cell.call, input: '@ put something\n@ Groovies jip', expected: [['error', 'The call must not have a path besides `@ put`, but it has a path `@ Groovies`']]},
      {f: cell.call, input: '@ put foo bar 1\n@ put foo jip 2', expected: [['error', 'A put call has to be a hash with path and value (`p` and `v`).']]},
      {f: cell.call, input: '@ put 1 foo\n      2 bar', expected: [['error', 'A put call has to be a hash with path and value (`p` and `v`).']]},
      {f: cell.call, input: '@ put k foo\n      v bar', expected: [['error', 'A put call has to be a hash with path and value (`p` and `v`).']]},
      {f: cell.call, input: '@ put p foo\n      v bar\n      x jip', expected: [['error', 'A put call has to be a hash with path and value (`p` and `v`).']]},
      {reset: [
         ['foo', 'bar', 1, 'jip'],
         ['foo', 'bar', 2, 'joo'],
         ['foo', 'soda', 'wey'],
         ['something', 'else']
      ]},
      {f: cell.call, input: '@', expected: [
         ['foo', 'bar', 1, 'jip'],
         ['foo', 'bar', 2, 'joo'],
         ['foo', 'soda', 'wey'],
         ['something', 'else']
      ]},
      {f: cell.call, input: '@ foo', expected: [
         ['bar', 1, 'jip'],
         ['bar', 2, 'joo'],
         ['soda', 'wey'],
      ]},
      {f: cell.call, input: '@ foo bar', expected: [
         [1, 'jip'],
         [2, 'joo'],
      ]},
      {f: cell.call, input: '@ foo bar 1', expected: [
         ['jip'],
      ]},
      {f: cell.call, input: '@ foo bar 1 jip', expected: []},
      {f: cell.call, input: '@ no such thing', expected: []},
      {f: cell.call, input: '@ foo soda', expected: [
         ['wey']
      ]},
      {f: cell.call, input: '@ something', expected: [
         ['else']
      ]},
      {f: cell.call, input: '@ something else', expected: []},
      {reset: [
         ['foo', 10],
         ['inner', 'foo', 20],
         ['inner', 'jip', 'foo', 30],
      ]},
      {f: cell.get, query: ['foo'], context: [], expected: [
         [10]
      ]},
      {f: cell.get, query: ['foo'], context: ['foo'], expected: [
         [10]
      ]},
      {f: cell.get, query: ['bar'], context: ['foo'], expected: []},
      {f: cell.get, query: ['foo'], context: ['inner'], expected: [
         [20],
      ]},
      {f: cell.get, query: ['foo'], context: ['inner', 'jip'], expected: [
         [30],
      ]},
      {f: cell.get, query: ['foo'], context: ['inner', 'jip', 'foo'], expected: [
         [30],
      ]},

      // *** PUT ***

      {reset: []},
      {f: cell.call, input: ['@ put p foo', '@ put v bar'], expected: [['ok']]},
      {f: cell.call, input: '@', expected: [['foo', 'bar']]},
      {f: cell.call, input: '@ foo', expected: [['bar']]},
      {reset: [
         ['foo', 'bar', 1, 'jip'],
         ['foo', 'bar', 2, 'joo'],
      ]},
      {f: cell.call, input: ['@ put p foo bar', '@ put v hey'], expected: [['ok']]},
      {f: cell.call, input: '@ foo bar', expected: [['hey']]},
      {f: cell.call, input: ['@ put p foo', '@ put v 1'], expected: [['ok']]},
      {f: cell.call, input: '@ foo', expected: [[1]]},
      {f: cell.call, input: '@', expected: [['foo', 1]]},
      {reset: [
         ['foo', 'bar', 1, 'jip'],
         ['foo', 'bar', 2, 'joo'],
      ]},
      {f: cell.call, input: ['@ put p foo', '@ put v bar hey'], expected: [['ok']]},
      {f: cell.call, input: '@ foo', expected: [['bar', 'hey']]},
      {f: cell.call, input: '@ foo bar', expected: [['hey']]},
      {f: cell.call, input: '@ put p foo 2\n@ put v something', expected: [['error', 'The path `foo bar hey` is setting a hash but there is already a list at path `foo`']]},
      {reset: [
         ['foo', 'bar', 1, 'jip'],
         ['foo', 'bar', 2, 'joo'],
         ['foo', 'soda', 'wey'],
      ]},
      {f: cell.call, input: ['@ put p foo', '@ put v ""'], expected: [['ok']]},
      {f: cell.call, input: '@ foo', expected: [['']]},
      {reset: [
         ['foo', 'bar', 1, 'jip'],
         ['foo', 'bar', 2, 'joo'],
         ['foo', 'soda', 'wey'],
      ]},
      {f: cell.call, input: ['@ put p foo jup', '@ put v yea'], expected: [['ok']]},
      {f: cell.call, input: '@ foo', expected: [
         ['bar', 1, 'jip'],
         ['bar', 2, 'joo'],
         ['jup', 'yea'],
         ['soda', 'wey']
      ]},
      {f: cell.call, input: ['@ put p foo bar yes', '@ put v sir'], expected: [['error', 'The path `foo bar yes sir` is setting a hash but there is already a list at path `foo bar`']]},
      {f: cell.call, input: ['@ put p foo "\n\nbar"', '@ put v 1'], expected: [['ok']]},
      {f: cell.call, input: ['@ foo "\n\nbar"'], expected: [[1]]},

      {f: cell.call, input: ['@ put p put', '@ put v 1'], expected: [['error', 'I\'m sorry Dave, I\'m afraid I can\'t do that']]},
      {f: cell.call, input: ['@ put p dialogue', '@ put v 1'], expected: [['error', 'A dialogue cannot be supressed by force.']]},
      {f: cell.JSToPaths, input: {c: 'd', a: 'b'}, expected: [['a', 'b'], ['c', 'd']]},
      {f: cell.JSToPaths, input: [1, 2, 3], expected: [[1, 1], [2, 2], [3, 3]]},
      {f: cell.JSToPaths, input: {boo: [true, false], why: new Date ('2025-01-01T00:00:00.000Z')}, expected: [['boo', 1, 1], ['boo', 2, 0], ['why', '2025-01-01T00:00:00.000Z']]},
      {f: cell.JSToPaths, input: {foo: null, some: '', thing: parseInt ('!')}, expected: [['foo', ''], ['some', ''], ['thing', '']]},
      {f: cell.pathsToJS, input: [], expected: {}},
      {f: cell.pathsToJS, input: [['']], expected: ''},
      {f: cell.pathsToJS, input: [[1]], expected: 1},
      {f: cell.pathsToJS, input: [['bar', 1, 'jip'], ['bar', 2, 'joo'], ['jup', 'yea'], ['soda', 'wey']], expected: {bar: ['jip', 'joo'], jup: 'yea', soda: 'wey'}},
   ], false, function (test) {

      if (test.reset) return dataspace = test.reset;

      if (test.f === cell.textToPaths  && type (test.input)    === 'array') test.input    = test.input.join ('\n');
      if (test.f === cell.call         && type (test.input)    === 'array') test.input    = test.input.join ('\n');
      if (test.f === cell.pathsToText  && type (test.expected) === 'array') test.expected = test.expected.join ('\n');

      var get = function () {
         return dataspace;
      }
      var put = function (v) {
         dataspace = v;
      }

      if (test.f === cell.get)       var result = cell.get (test.query, test.context, get);
      else if (test.f === cell.put)  var result = cell.put (test.input, get, put);
      else if (test.f === cell.call) var result = cell.call (test.input, get, put);
      else                           var result = test.f (test.input);

      if (teishi.eq (result, test.expected)) return true;
      clog ('Test mismatch', {expected: test.expected, obtained: result});
      return false;
   });
   if (errorFound) clog ('A test did not pass');
   else clog ('All tests successful', (teishi.time () - start) + 'ms');
}

test ();
