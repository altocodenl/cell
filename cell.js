// *** SETUP ***

var isNode = typeof exports === 'object';

if (isNode) var cell = exports;
else        var cell = {};

var dale   = isNode ? require ('dale')   : window.dale;
var teishi = isNode ? require ('teishi') : window.teishi;

var clog = console.log, type = teishi.type;

var pretty = function (label, ftx) {
   teishi.clog (label, '\n' + ftx);
}

// *** MAIN FUNCTIONS ***

cell.toNumberIfNumber = function (text) {
   if (text.match (/^-?(\d+\.)?\d+$/) !== null) return parseFloat (text);
   return text;
}

cell.unparseElement = function (v) {
   if (v === null) return ' ';
   if (type (v) !== 'string') return v + '';
   if (v.length === 0) return '""';

   if (v.match (/^-?(\d+\.)?\d+$/) !== null) return '"' + v + '"';
   if (v.match ('"') || v.match (/\s/)) {
      return '"' + v.replace (/\//g, '//').replace (/"/g, '/"') + '"';
   }
   return v;
}

cell.textToPaths = function (message) {

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
            matchedSpaces += cell.unparseElement (v).length + 1;
            if (matchedSpaces === indentSize) return k;
            if (matchedSpaces > indentSize) return {error: 'The indent of the line `' + line + '` does not match that of the previous line.'};
         });
         if (matchUpTo === undefined) return 'The indent of the line `' + line + '` does not match that of the previous line.';
         if (matchUpTo.error) return matchUpTo.error;

         path = dale.go (lastPath.slice (0, matchUpTo + 1), function (v) {
            return v === '-' ? null : v;
         });
         line = line.slice (matchedSpaces);

         if (line.length === 0) return 'The line `' + originalLine + '` has no data besides whitespace.';
      }

      var dequoter = function (text) {

         var output = {start: -1, end: -1};

         var findNonLiteralQuote = function (text) {
            var index = dale.stopNot (text.split (''), undefined, function (c, k) {
               if (c !== '"') return;
               var slashes = text.slice (0, k + 1).match (/\/{0,}"$/g);
               if ((slashes [0].length - 1) % 2 === 0) return k;
            });
            return index !== undefined ? index : -1;
         }

         var unescaper = function (text) {
            if (! (text.match (/\s/) || text.match (/"/) || insideMultilineText)) return text;

            text = text.replace (/\/"/g, '"');
            var unmatchedSlash;
            dale.go (text.split (''), function (c, k) {
               if (c !== '/') return;
               unmatchedSlash = unmatchedSlash === k - 1 ? undefined : k;
            });
            if (unmatchedSlash !== undefined) return ['error', 'Unmatched slash in text with spaces or double quotes: `' + text + '`'];

            return text.replace (/\/\//g, '/');
         }

         output.start = findNonLiteralQuote (text);

         if (insideMultilineText) {
            if (output.start === -1) output.text = unescaper (text);
            else                     output.text = unescaper (text.slice (0, output.start));
         }
         else {
            if (output.start === -1) output.text = text;
            else {
               var match = findNonLiteralQuote (text.slice (output.start + 1));
               if (match !== -1) output.end = output.start + 1 + match;

               output.text = unescaper (text.slice (output.start + 1, output.end === -1 ? text.length : output.end))
            }
         }

         if (type (output.text) === 'array') return output.text [1];
         return output;
      }

      if (insideMultilineText) {

         if (line.length > 0 && ! line.match (new RegExp ('^ {' + insideMultilineText + '}'))) return 'Missing indentation in multiline text `' + originalLine + '`';
         line = line.slice (insideMultilineText);

         var dequoted = dequoter (line);
         if (type (dequoted) === 'string') return dequoted;
         if (dequoted.start === -1) {
            lastPath [lastPath.length - 1] += dequoted.text + '\n';
            return;
         }
         else {
            lastPath [lastPath.length - 1] += dequoted.text;
            path = lastPath;

            line = line.slice (dequoted.start + 1);
            if (line.length && line [0] !== ' ') return 'No space after a quote in line `' + originalLine + '`';
            line = line.slice (1);
            insideMultilineText = false;
         }
      }

      while (line.length) {
         if (line [0] === ' ') return 'The line `' + originalLine + '` has at least two spaces separating two elements.';

         if (line [0] === '"') {
            var dequoted = dequoter (line);
            if (type (dequoted) === 'string') return dequoted;
            if (dequoted.end === -1) {
               insideMultilineText = dale.acc (path, 0, function (a, v) {
                  v = cell.unparseElement (v);
                  if (! v.match ('\n')) return a + v.length + 1;
                  return a + teishi.last (v.split ('\n')).length + 1 + 1;
               }) + 1;

               path.push (dequoted.text + '\n');
               line = '';
            }
            else {
               path.push (dequoted.text);

               line = line.slice (dequoted.end + 1);
               if (line.length && line [0] !== ' ') return 'No space after a quote in line `' + originalLine + '`';
               line = line.slice (1);
            }
            continue;
         }

         var element = line.split (' ') [0];
         if (element.match (/\s/)) return 'The line `' + line + '` contains a space that is not contained within quotes.';
         if (element.match (/"/)) return 'The line `' + line + '` has an unescaped quote.';

         path.push (cell.toNumberIfNumber (element));
         line = line.slice (element.length + 1);
      }

      if (! paths.includes (path)) paths.push (path);
   });

   if (error) return [['error', error]];
   if (insideMultilineText) return [['error', 'Multiline text not closed: `' + teishi.last (teishi.last (paths)) + '`']];

   paths = cell.sorter (cell.dedasher (paths));
   var error = cell.validator (paths);
   return error.length ? error : paths;
}

cell.dedasher = function (paths) {
   dale.go (paths, function (v, k) {
      dale.go (v, function (v2, k2) {
         if (v2 === null) return paths [k] [k2] = paths [k - 1] [k2];

         if (v2 !== '-' && v !== null) return;
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

      // = goes before :
      if (v1 === '=' && v2 === ':') return -1;
      if (v1 === ':' && v2 === '=') return 1;

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

cell.pathsToText = function (paths) {

   var spaces = function (n) {
      return Array (n).fill (' ').join ('');
   }

   var output = [];

   var pathToText = function (path, prefixIndent) {
      var indentCount = 0;
      return dale.go (path, function (step) {
         step = cell.unparseElement (step);
         if (! step.match (/\n/)) {
            indentCount += step.length + 1;
            return step;
         }
         return dale.go (step.split (/\n/), function (line, k) {
            if (k === 0) {
               indentCount++;
               return line;
            }
            var indent = spaces (indentCount);
            if (k === step.split (/\n/).length - 1) {
               indentCount += line.length + 1;
            }
            return (prefixIndent || '') + indent + line;
         }).join ('\n');
      }).join (' ');
   }

   dale.go (paths, function (path, k) {
      var commonPrefix = [];
      if (k > 0) dale.stop (paths [k - 1], false, function (v, k) {
         if (v === path [k]) commonPrefix.push (v);
         else return false;
      });
      if (commonPrefix.length === 0) return output.push (pathToText (path));

      var prefixIndent = spaces (pathToText (commonPrefix).length + 1);
      output.push (prefixIndent + pathToText (path.slice (commonPrefix.length), prefixIndent));
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

   if (paths.length === 0) return '';

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

cell.JSToText = function (text) {
   return cell.pathsToText (cell.JSToPaths (text));
}

cell.textToJS = function (text) {
   return cell.pathsToJS (cell.textToPaths (text));
}

// Assumes that paths are dedashed and sorted!
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

   return error ? [['error', error]] : [];
}

cell.call = function (message, from, to, hide, get, put) {

   var startTime = new Date ();
   var callId = startTime.toISOString () + '-' + (Math.random () + '').slice (2, 6);

   var respond = function (response) {

      var dialog = cell.get (['dialog'], [], get, put);
      var length = dialog.length ? teishi.last (dialog) [0] : 0;

      // TODO: refactor with push and multiput
      cell.put ([
         ['p', 'dialog', length + 1, 'from'],
         ['v', from],
      ], [], get, put, true);
      cell.put ([
         ['p', 'dialog', length + 1, 'to'],
         ['v', to],
      ], [], get, put, true);
      cell.put ([
         ['p', 'dialog', length + 1, 'c'],
         ['v', message],
      ], [], get, put, true);
      if (response.length) cell.put ([
         ['p', 'dialog', length + 1, 'r'],
         ...dale.go (message === '@' ? [['[OMITTED]']] : response, function (v) {
            return ['v', ...v];
         }),
      ], [], get, put, true);
      cell.put ([
         ['p', 'dialog', length + 1, 'id'],
         ['v', callId],
      ], [], get, put, true);
      if (hide) cell.put ([
         ['p', 'dialog', length + 1, 'hide'],
         ['v', 1],
      ], [], get, put, true);
      cell.put ([
         ['p', 'dialog', length + 1, 'ms'],
         ['v', new Date ().getTime () - startTime.getTime ()],
      ], [], get, put, true);

      return cell.pathsToText (response);
   }

   // Note that even if the call is not valid, we still store it in the dialog!
   if (type (message) !== 'string') return respond ([['error', 'The message must be text but instead is ' + type (message)]]);

   var paths = cell.textToPaths (message);
   if (paths [0] && paths [0] [0] === 'error') return respond (paths);

   if (paths.length === 0) return respond ([]);

   /* TODO: new logic
   cell.put ([
      ['p', 'tmp', callId],
      ['v', paths]
   ], [], get, put, true);

   var response = cell.get (['tmp', callId], [], get);
   */

   if (paths [0] [0] !== '@') return respond ([['error', 'A single call must start with `@` but instead starts with `' + paths [0] [0] + '`']]);

   var extraKey = dale.stopNot (paths, undefined, function (path) {
      if (path [0] !== '@') return path [0];
   });
   if (extraKey !== undefined) return respond ([['error', 'The call must not have extra keys besides `@`, but it has a key `' + extraKey + '`']]);

   if (paths [0] [1] === 'put') {
      var extraKey = dale.stopNot (paths, undefined, function (path) {
         if (path [1] !== 'put') return path [1];
      });
      if (extraKey !== undefined) return respond ([['error', 'The call must not have a path besides `@ put`, but it has a path `@ ' + extraKey + '`']]);

      return respond (cell.put (dale.go (paths, function (path) {
         return path.slice (2);
      }), [], get, put));
   }

   if (paths [0] [1] === 'wipe') {
      return respond (cell.wipe (paths [0].slice (2), get, put));
   }

   // Neither a put nor a do, we can just call get to resolve the reference
   else {
      if (paths.length > 1) return respond ([['error', 'A get call cannot have multiple paths, but it has a path `' + paths [1].join (' ') + '`']]);

      return respond (cell.get (paths [0].slice (1), [], get));
   }
}

cell.respond = function (path, get, put) {

   if (path.indexOf ('@') === -1 || path [0] === 'dialog') return;

   var leftmostAt  = path.indexOf ('@');
   var rightmostAt = path.length - 1 - teishi.copy (path).reverse ().indexOf ('@');

   dale.stopNot (path, undefined, function (v, k) {
      if (v === '@' && path [k + 1] === 'do') return rightmostAt = k;
   });

   var contextPath = path.slice (0, leftmostAt);
   var targetPath  = path.slice (0, rightmostAt).concat ('=');
   var valuePath   = dale.fil (path.slice (rightmostAt + 1), '=', function (v) {return v});

   var prefix = targetPath.slice (0, -1).concat (['@', valuePath [0]]);
   var paths = get ();
   var index = dale.stopNot (paths, undefined, function (v, k) {
      if (teishi.eq (path, v)) return k;
   });
   var firstPath = index === 0 || paths [index - 1].length < prefix.length || ! teishi.eq (paths [index - 1].slice (0, prefix.length), prefix);
   if (! firstPath) return;

   var previousValue = cell.get (targetPath, contextPath, get);

   if (valuePath [0] === 'if') {
      var currentValue = cell.if (targetPath.slice (0, -1).concat (['@', 'if']), contextPath, get);
   }
   else if (valuePath [0] === 'do') {
      var currentValue = cell.do ('define', targetPath.slice (0, -1).concat (['@', 'do']), contextPath, null, get);
   }
   else {
      var currentValue = cell.get (valuePath, contextPath, get);
      if (currentValue.length === 0) {
         var call = dale.stopNot (dale.times (valuePath.length, 1), undefined, function (k) {
            var value = cell.get (valuePath.slice (0, -k).concat (['@', 'do']), contextPath, get);
            if (value.length) return {definitionPath: valuePath.slice (0, -k).concat (['@', 'do']), message: valuePath.slice (-k)};
         });

         if (call) {
            if (call.definitionPath.length > 3) prefix = prefix.concat (call.definitionPath.slice (1).slice (0, -2));

            call.message = [];
            dale.stop (paths.slice (index), undefined, function (v) {
               if (v.length < prefix.length) return;
               if (teishi.eq (v.slice (0, prefix.length), prefix)) return call.message.push (v.slice (prefix.length));
            });
            currentValue = cell.do ('execute', call.definitionPath, contextPath, call.message, get, put);
         }
         else {
            var message = [];
            dale.stop (paths.slice (index), undefined, function (v) {
               if (v.length < prefix.length) return;
               if (teishi.eq (v.slice (0, prefix.length), prefix)) return message.push (v.slice (prefix.length));
            });
            var nativeResponse = cell.native (valuePath [0], message);
            if (nativeResponse !== false) currentValue = nativeResponse;
         }
      }
   }

   if (currentValue.length === 0) currentValue = [['']];

   if (teishi.eq (previousValue, currentValue)) return;

   var pathsToPut = [['p'].concat (targetPath)];

   dale.go (currentValue, function (path) {
      pathsToPut.push (['v'].concat (path));
   });

   cell.put (pathsToPut, [], get, put);
   return true;
}

cell.native = function (call, message) {
   var nativeCalls = [
      '+', '-', '*', '/', '%', // Math
      'eq', '>', '<', '>=', '<=', // Comparison
      'and', 'or', 'not', // Logical
      'upload' // Organization
   ];

   if (nativeCalls.indexOf (call) === -1) return false;

   // Ignore definitions, jump to values
   var stripper = function (paths) {
      return dale.fil (paths, undefined, function (path) {
         if (path.indexOf ('@') !== -1) return;
         return dale.fil (path, undefined, function (v) {
            if (v !== '=') return v;
         });
      });
   }

   message = cell.pathsToJS (stripper (message))

   var types = [];
   dale.go (message, function (v) {
      var t = {float: 'number', integer: 'number', string: 'text', object: 'hash', array: 'list'} [type (v)];
      if (types.indexOf (t) === -1) types.push (t);
   });

   var round = function (n) {
      return Math.round (n * 1000000000) / 1000000000;
   }

   if (call === '+') {
      if (type (message) !== 'array') return [['error', 'Expecting a list.']];
      if (types.length > 1 && ! teishi.eq (types.sort, ['number', 'text'])) return [['error', 'Cannot mix these elements:', types.join (', ')]];

      if (types [0] === 'list') return cell.JSToPaths (dale.acc (message, function (a, b) {return a.concat (b)}));

      if (types [0] === 'hash') return cell.JSToPaths (dale.acc (message, function (a, b) {
         dale.go (b, function (v, k) {a [k] = b});
         return a;
      }));

      return [[dale.acc (message, function (a, b) {return a + b})]];
   }
   if (call === '-') {
      if (type (message) !== 'array') return [['error', 'Expecting a list.']];
      if (types [0] === 'text') return [['error', 'Operation not defined for text.']];
      if (types.length > 1) return [['error', 'Cannot mix these elements:', types.join (', ')]];

      if (types [0] === 'list') return cell.JSToPaths (dale.acc (message, function (a, b) {
         return dale.fil (a, undefined, function (v) {
            if (! dale.stop (b, true, function (v2) {
               return teishi.eq (v, v2);
            })) return v;
         });
      }));

      if (types [0] === 'hash') return cell.JSToPaths (dale.acc (message, function (a, b) {
         dale.go (b, function (v, k) {delete a [k]});
         return a;
      }));

      if (types [0] === 'number') return [[dale.acc (message, function (a, b) {return a - b})]];
   }
   if (call === '*' || call === '/') {
      if (type (message) !== 'array') return [['error', 'Expecting a list.']];
      if (types [0] !== 'number') return [['error', 'Operation only defined for number.']];

      return [[dale.acc (message, function (a, b) {return call === '*' ? a * b : a / b})]];
   }
   if (call === '%') {
      if (type (message) !== 'array') return [['error', 'Expecting a list.']];
      if (types [0] === 'text') return [['error', 'Operation not defined for text.']];

      // TODO; % for intersection of list and hash (values vs keys)

      if (types [0] === 'number') return [[dale.acc (message, function (a, b) {return a % b})]];
   }

   if (call === 'eq') {
      return [[dale.stop (message, false, function (v, k) {
         if (k === 0) return true;
         return teishi.eq (v, message [k - 1]);
      })] ? 1 : 0];
   }

   if (call === 'upload') {
      clog ('debug', message);
   }

   return [['']];
}

cell.if = function (queryPath, contextPath, get) {

   var paths = cell.get (queryPath, contextPath, get);

   var topLevelKeys = dale.keys (cell.pathsToJS (paths)).sort ();
   if (teishi.v (['topLevelKeys', topLevelKeys, ['cond', 'do', 'else'], 'eachOf', teishi.test.equal], true) !== true) return [['error', 'An if call has to be a hash with keys `cond`, `do` and `else`.']];
   if (topLevelKeys.indexOf ('cond') === -1) return [['error', 'An if call has to contain a `cond` key.']];

   var cond = cell.get (queryPath.concat ('cond'), contextPath, get);
   var result = dale.fil (cond [0], '=', function (v) {return v})
   var truthy = (cond.length === 0 || teishi.eq (result, [0]) || teishi.eq (result, [''])) ? false : true;

   return cell.get (queryPath.concat (truthy ? 'do' : 'else'), contextPath, get);
}

cell.do = function (op, definitionPath, contextPath, message, get, put) {

   var definition = cell.get (definitionPath, contextPath, get);

   if (definition.length === 0) return [['error', 'The definition of a sequence must contain a message name and at least one step.']];

   var messageName = definition [0] [0];

   if (type (messageName) !== 'string') return [['error', 'The definition of a sequence must contain a textual name for its message.']];

   if (messageName === 'seq') return [['error', 'The name of the message cannot be `seq`.']];

   if (dale.keys (cell.pathsToJS (definition)).length !== 1) return [['error', 'The definition of a sequence can only contain a single name for its message.']];

   if (definition [0] [1] !== 1) return [['error', 'The definition of a sequence must start with step number 1.']];
   var error = dale.stopNot (definition, undefined, function (path, k) {
      if (definition [k - 1] && path [1] - 1 > definition [k - 1] [1]) return [['error', 'The definition of a sequence cannot have non-consecutive steps.']];
   });
   if (error) return error;

   if (op === 'define') return [[messageName, teishi.last (definition) [1]]];

   var output = [['']];

   var stripper = function (paths) {
      return dale.fil (paths, undefined, function (path, pathIndex) {
         var firstEqualOrColon = dale.stopNot (path, undefined, function (v, k) {
            if (v === '=' || v === ':') return k;
         });
         if (firstEqualOrColon === undefined) return path;
         var lookaheadCall = dale.stop (paths.slice (pathIndex), true, function (lookaheadPath) {
            return teishi.eq (lookaheadPath.slice (0, firstEqualOrColon + 1), path.slice (0, firstEqualOrColon).concat ('@'));
         });
         if (! lookaheadCall) return path;
      });
   }

   var previousExpansion = cell.get (contextPath.concat (':'), [], get);
   var previousMessage = dale.fil (previousExpansion, undefined, function (path) {
      if (path [0] !== 'seq') return path;
   });

   if (! teishi.eq (stripper (previousMessage), stripper (dale.go (message, function (path) {
      return [messageName].concat (path);
   })))) {
      cell.put ([
         ['p'].concat (contextPath).concat (':'),
      ].concat (dale.go (message, function (v) {
         return ['v', messageName].concat (v);
      })), [], get, put);

      return output;
   }

   definition = dale.go (definition, function (v) {return v.slice (1)});
   var sequenceLength = teishi.last (definition) [0];

   dale.stopNot (dale.times (sequenceLength, 1), undefined, function (stepNumber) {

      var previousStep = cell.get (contextPath.concat ([':', 'seq', stepNumber]), [], get);

      var currentStep = dale.fil (definition, undefined, function (path) {
         if (path [0] === stepNumber) return path.slice (1);
      });

      if (! teishi.eq (stripper (previousStep), stripper (currentStep))) return cell.put ([
         ['p'].concat (contextPath).concat ([':', 'seq', stepNumber]),
      ].concat (dale.go (currentStep, function (v) {
         return ['v'].concat (v);
      })), [], get, put);

      var existingValuePath = contextPath.concat ([':', 'seq', stepNumber]);
      if (teishi.last (currentStep) [0] === '@') existingValuePath.push ('=');
      var existingValue = cell.get (existingValuePath, [], get);

      if (existingValue.length === 0) return true;

      if (['error', 'stop'].includes (existingValue [0] [0]) || stepNumber === sequenceLength) {
         output = existingValue;
         return true;
      }
   });

   return output;
}

cell.upload = function (name, mime, base64, data) {


   // inputs:
   // name
   // mime
   // base64 file
   // data (text, optional)

   // 1) put it in files
}

cell.get = function (queryPath, contextPath, get) {
   var dataspace = get ();

   var dotMode = queryPath [0] === '.';
   if (dotMode) queryPath = queryPath.slice (1);

   return dale.stopNot (dale.times (! dotMode ? contextPath.length + 1 : 1, contextPath.length, -1), undefined, function (k) {

      var matches = dale.fil (dataspace, undefined, function (path) {
         if (contextPath.length && ! teishi.eq (contextPath.slice (0, k), path.slice (0, k))) return;
         path = path.slice (k);

         if (teishi.eq (queryPath, path.slice (0, queryPath.length)) && path.length > queryPath.length) return path.slice (queryPath.length);
      });

      if (matches.length > 0) return matches;

   }) || [];
}

cell.put = function (paths, contextPath, get, put, updateDialog) {

   var topLevelKeys = dale.keys (cell.pathsToJS (paths)).sort ();
   if (! teishi.eq (topLevelKeys, ['p', 'v']) && ! teishi.eq (topLevelKeys, ['v'])) return [['error', 'A put call has to be a hash with a value (`v`) and an optional path (`p`).']];

   var leftSide = [], rightSide = [];
   dale.go (paths, function (path) {
      (path [0] === 'p' ? leftSide : rightSide).push (path.slice (1));
   });

   if (leftSide.length > 1) return [['error', 'Only one path can be put at the same time, but received multiple paths: ' + dale.go (leftSide, function (v) {return cell.pathsToText ([v])}).join (', ')]];

   leftSide = leftSide [0] || [];

   if (leftSide [0] === 'put') return [['error', 'I\'m sorry Dave, I\'m afraid I can\'t do that']];
   if (leftSide [0] === 'dialog' && ! updateDialog) return [['error', 'A dialog cannot be supressed by force.']];

   var dataspace = get ();

   if (leftSide [0] === '.') leftSide = contextPath.concat (leftSide.slice (1));
   else {
      var contextPathMatch = dale.stopNot (dale.times (contextPath.length, contextPath.length, -1), undefined, function (k) {
         var contextPathWithSuffix = contextPath.slice (0, k).concat (leftSide);
         var matches = dale.stop (dataspace, true, function (path) {
            return teishi.eq (contextPathWithSuffix, path.slice (0, contextPathWithSuffix.length));
         });
         if (matches) return contextPath.slice (0, k);
      });

      if (contextPathMatch !== undefined) leftSide = contextPathMatch.concat (leftSide);
   }

   dataspace = dale.fil (dataspace, undefined, function (path) {
      if (teishi.eq (leftSide, path.slice (0, leftSide.length))) return;
      return path;
   }).concat (dale.go (rightSide, function (path) {
      return leftSide.concat (path);
   }));

   cell.sorter (dataspace);

   var error = cell.validator (dataspace);
   if (error.length) return error;

   put (dataspace);

   dale.stop (dataspace, true, function (path) {
      return cell.respond (path, get, put);
   });

   return [['ok']];
}

cell.wipe = function (prefix, get, put) {

   var dataspace = get ();

   dataspace = dale.fil (dataspace, undefined, function (path) {
      if (prefix.length > path.length) return path;
      if (! teishi.eq (prefix, path.slice (0, prefix.length))) return path;
   });

   var listPrefixCount = {};
   dale.go (dataspace, function (path) {
      dale.go (path, function (v, k) {
         if (type (v) === 'string' || k + 1 === path.length) return;
         var currentCount = listPrefixCount [JSON.stringify (path.slice (0, k))] || 0;
         if (currentCount + 1 < v) path [k] = currentCount + 1;
         listPrefixCount [JSON.stringify (path.slice (0, k))] = path [k];
      });
   });

   put (dataspace);

   return ['ok'];
}

// *** TESTS ***

var test = function () {
   var start = teishi.time ();
   var dataspace = [];

   var errorFound = false === dale.stop ([

      // *** TEXT <-> PATHS ***

      ...dale.go ([
         ['', []],
         [' ', [['error', 'The first line of the message cannot be indented']]],
         ['\t ', [['error', 'The line `\t ` contains a space that is not contained within quotes.']]],
         ['holding"out', [['error', 'The line `holding"out` has an unescaped quote.']]],
         [['"multiline', ' trickery" some 2 "calm', '                   animal"'], [['multiline\ntrickery', 'some', 2, 'calm\nanimal']]],
         [['a b', 'c d'], [['a', 'b'], ['c', 'd']]],
         [['foo bar 1', '   jip 2'], [['error', 'The indent of the line `   jip 2` does not match that of the previous line.']]],
         [['foo bar 1', '                        jip 2'], [['error', 'The indent of the line `                        jip 2` does not match that of the previous line.']]],
         [['foo bar 1', '          '], [['error', 'The line `          ` has no data besides whitespace.']]],
         [['foo bar 1', '    jip  2'], [['error', 'The line `    jip  2` has at least two spaces separating two elements.']]],
         [['foo bar 1', '    jip 2'], [['foo', 'bar', 1], ['foo', 'jip', 2]]],
         [['foo bar 1', 'foo jip 2'], [['foo', 'bar', 1], ['foo', 'jip', 2]], {nonreversible: true}],
         [['foo bar 0.1', '    jip 2.75'], [['foo', 'bar', 0.1], ['foo', 'jip', 2.75]]],
         [['foo 1 hey', '    2 yo'], [['foo', 1, 'hey'], ['foo', 2, 'yo']]],
         ['something"foo" 1', [['error', 'The line `something"foo" 1` has an unescaped quote.']]],
         ['"foo bar" 1', [['foo bar', 1]]],
         ['"foo" "bar" 1', [['foo', 'bar', 1]], {nonreversible: true}],
         ['"/"foo/" /"bar/" 1"', [['"foo" "bar" 1']]],
         ['"foo bar"x1', [['error', 'No space after a quote in line `"foo bar"x1`']]],
         [['foo "bar', '     i am on a new line but I am still the same text" 1'], [['foo', 'bar\ni am on a new line but I am still the same text', 1]]],
         ['foo "1" bar', [['foo', '1', 'bar']]],
         ['foo "\t" bar', [['foo', '\t', 'bar']]],
         [['"i am text', ' ', ' ', ' yep"'], [['i am text\n\n\nyep']]],
         ['foo "bar"', [['foo', 'bar']], {nonreversible: true}],
         ['foo "bar yep"', [['foo', 'bar yep']]],
         ['date 2025-01-01', [['date', '2025-01-01']]],
         ['empty "" indeed', [['empty', '', 'indeed']]],
         [['"just multiline', ' ', ' "'], [['just multiline\n\n']]],
         [['"just multiline', ' ', ' "foo'], [['error', 'No space after a quote in line ` "foo`']]],
         [['"just multiline', ' //', ' /""'], [['just multiline\n/\n"']]],
         [['foo bar 1 jip', '        2 yes'], [['foo', 'bar', 1, 'jip'], ['foo', 'bar', 2, 'yes']]],
         ['"/""', [['"']]],
         ['" //"', [[' /']]],
         ['"///""', [['/"']]],
         ['" //" " ////" // " //a"', [[' /', ' //', '//', ' /a']]],
         ['"A single call must start with /"@/" but instead starts with /"w/""', [['A single call must start with "@" but instead starts with "w"']]],
         [['dialog "1" from user', '           message "@ foo"'], [['dialog', '1', 'from', 'user'], ['dialog', '1', 'message', '@ foo']]],
         [['dialog 2 from user', '         message "@ foo"'], [['dialog', 2, 'from', 'user'], ['dialog', 2, 'message', '@ foo']]],
         [['dialog " //" from user', '             message "@ foo"'], [['dialog', ' /', 'from', 'user'], ['dialog', ' /', 'message', '@ foo']]],
         [['dialog "" from user', '          message "@ foo"'], [['dialog', '', 'from', 'user'], ['dialog', '', 'message', '@ foo']]],
         ['" /"', [['error', 'Multiline text not closed: ` "\n`']]],
         ['" //"', [[' /']]],
         ['" ////"', [[' //']]],
         ['//', [['//']]],
         ['"//"', [['//']], {nonreversible: true}],
         ['" /a"', [['error', 'Unmatched slash in text with spaces or double quotes: ` /a`']]],
         [['" ', ' /a"'], [['error', 'Unmatched slash in text with spaces or double quotes: `/a`']]],
         ['" //a"', [[' /a']]],
         ['" ///a"', [['error', 'Unmatched slash in text with spaces or double quotes: ` ///a`']]],
         [['- foo bar', '  sub acu ', '  jip heh'], [[1, 'foo', 'bar'], [1, 'jip', 'heh'], [1, 'sub', 'acu']], {nonreversible: true}],
      ], function (test) {
         var output = [
            {f: cell.textToPaths, input: test [0], expected: test [1]},
         ];
         if (! (test [1] [0] && test [1] [0] [0] === 'error' || test [2])) output.push ({f: cell.pathsToText, input: test [1], expected: test [0]});
         return output;
      }).flat (),
      {f: cell.pathsToText, expected: ['- foo bar', '  jip heh', '  sub acu'], input: [['-', 'foo', 'bar'], [null, 'jip', 'heh'], [null, 'sub', 'acu']]},

      // *** TEXT <-> PATHS HELPERS ***

      {f: cell.dedasher, input: [['foo', '-', 'first'], ['foo', '-', 'second']], expected: [['foo', 1, 'first'], ['foo', 2, 'second']]},
      {f: cell.dedasher, input: [['foo', '-', 'first'], ['bar', '-', 'second']], expected: [['foo', 1, 'first'], ['bar', 1, 'second']]},
      {f: cell.dedasher, input: [['foo', 'klank', 'first'], ['foo', '-', 'second']], expected: [['foo', 'klank', 'first'], ['foo', 1, 'second']]},
      {f: cell.dedasher, input: [['foo', '-', 'first'], ['foo', '-', 'second'], ['foo', '-', 'third']], expected: [['foo', 1, 'first'], ['foo', 2, 'second'], ['foo', 3, 'third']]},
      {f: cell.dedasher, input: [['-', 'foo', 'bar'], [null, 'jip', 'heh'], [null, 'sub', 'acu']], expected: [[1, 'foo', 'bar'], [1, 'jip', 'heh'], [1, 'sub', 'acu']]},

      {f: cell.sorter, input: [['foo', 'bar', 1], ['foo', 'bar', 2]], expected: [['foo', 'bar', 1], ['foo', 'bar', 2]]},
      {f: cell.sorter, input: [['foo', 'bar', 2], ['foo', 'bar', 1]], expected: [['foo', 'bar', 1], ['foo', 'bar', 2]]},
      {f: cell.sorter, input: [['foo', 'jip', 1], ['foo', 'bar', 1]], expected: [['foo', 'bar', 1], ['foo', 'jip', 1]]},
      {f: cell.sorter, input: [['foo', 'jip', 1], ['Foo', 'jip', 1]], expected: [['foo', 'jip', 1], ['Foo', 'jip', 1]]},
      {f: cell.sorter, input: [['Foo', 'jip', 1], ['foo', 'jip', 1]], expected: [['foo', 'jip', 1], ['Foo', 'jip', 1]]},
      {f: cell.sorter, input: [['foo', 'jip', 1], ['foo', 1, 1]], expected: [['foo', 1, 1], ['foo', 'jip', 1]]},
      {f: cell.sorter, input: [['foo', 'Jip', 1], ['foo', 1, 1]], expected: [['foo', 1, 1], ['foo', 'Jip', 1]]},
      {f: cell.sorter, input: [[':', 'foo'], ['=', 'bar']], expected: [['=', 'bar'], [':', 'foo']]},
      {f: cell.sorter, input: [[':foo'], ['=bar']], expected: [[':foo'], ['=bar']]},

      {f: cell.validator, input: [['foo', 'jip']], expected: []},
      {f: cell.validator, input: [['foo', 'bar', 1]], expected: []},
      {f: cell.validator, input: [['foo', 'jip'], ['foo', 'bar', 1]], expected: [['error', 'The path `foo bar 1` is setting a hash but there is already a text at path `foo`']]},
      {f: cell.validator, input: [['foo', 'mau5', 'jip'], ['foo', 'mau5', 'bar', 1]], expected: [['error', 'The path `foo mau5 bar 1` is setting a hash but there is already a text at path `foo mau5`']]},
      {f: cell.validator, input: [['foo', 'jip', 1], ['foo', 2, 2]], expected: [['error', 'The path `foo 2 2` is setting a list but there is already a hash at path `foo`']]},
      {f: cell.validator, input: [['foo', 'mau5', 'jip', 1], ['foo', 'mau5', 2, 2]], expected: [['error', 'The path `foo mau5 2 2` is setting a list but there is already a hash at path `foo mau5`']]},
      {f: cell.validator, input: [['foo']], expected: []},
      {f: cell.validator, input: [[1]], expected: []},
      {f: cell.validator, input: [], expected: []},
      {f: cell.validator, input: [['foo'], [1]], expected: [['error', 'The path `1` is setting a number but there is already a text at path ``']]},
      {f: cell.validator, input: [['foo', 'bar'], ['foo', 'jip']], expected: [['error', 'The path `foo jip` is repeated.']]},
      // TODO: add a nonconsecutive list

      // *** PATHS <-> JS ***

      {f: cell.JSToPaths, input: {c: 'd', a: 'b'}, expected: [['a', 'b'], ['c', 'd']]},
      {f: cell.JSToPaths, input: [1, 2, 3], expected: [[1, 1], [2, 2], [3, 3]]},
      {f: cell.JSToPaths, input: {boo: [true, false], why: new Date ('2025-01-01T00:00:00.000Z')}, expected: [['boo', 1, 1], ['boo', 2, 0], ['why', '2025-01-01T00:00:00.000Z']]},
      {f: cell.JSToPaths, input: {foo: null, some: '', thing: parseInt ('!')}, expected: [['foo', ''], ['some', ''], ['thing', '']]},
      {f: cell.pathsToJS, input: [], expected: ''},
      {f: cell.pathsToJS, input: [['']], expected: ''},
      {f: cell.pathsToJS, input: [[1]], expected: 1},
      {f: cell.pathsToJS, input: [['bar', 1, 'jip'], ['bar', 2, 'joo'], ['jup', 'yea'], ['soda', 'wey']], expected: {bar: ['jip', 'joo'], jup: 'yea', soda: 'wey'}},

      // *** CALL ***

      /* TODO: remove
      {f: cell.call, input: 1, expected: [['error', 'The message must be text but instead is integer']]},
      {f: cell.call, input: '', expected: []},
      {f: cell.call, input: 'foo bar', expected: [['error', 'A single call must start with `@` but instead starts with `foo`']]},
      {f: cell.call, input: ['@ foo bar', 'Groovies jip'], expected: [['error', 'The call must not have extra keys besides `@`, but it has a key `Groovies`']]},
      {f: cell.call, input: ['@ something is', '  another thing'], expected: [['error', 'A get call cannot have multiple paths, but it has a path `@ something is`']]},
      {f: cell.call, input: ['@ put something', 'Groovies jip'], expected: [['error', 'The call must not have extra keys besides `@`, but it has a key `Groovies`']]},
      {f: cell.call, input: ['@ put something', '@ Groovies jip'], expected: [['error', 'The call must not have a path besides `@ put`, but it has a path `@ Groovies`']]},
      {f: cell.call, input: ['@ put foo bar 1', '@ put foo jip 2'], expected: [['error', 'A put call has to be a hash with path and value (`p` and `v`).']]},
      {f: cell.call, input: ['@ put 1 foo', '      2 bar'], expected: [['error', 'A put call has to be a hash with path and value (`p` and `v`).']]},
      {f: cell.call, input: ['@ put k foo', '      v bar'], expected: [['error', 'A put call has to be a hash with path and value (`p` and `v`).']]},
      {f: cell.call, input: ['@ put p foo', '      v bar', '      x jip'], expected: [['error', 'A put call has to be a hash with path and value (`p` and `v`).']]},
      {f: cell.call, input: ['@ put p foo', '      v bar', '      x jip'], expected: [['error', 'A put call has to be a hash with path and value (`p` and `v`).']]},

      // *** GET ***

      {reset: []},
      {f: cell.call, input: '@', expected: [
      ]},

      {f: cell.call, input: '@ foo', expected: [
      ]},

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

      // *** GET WITH CONTEXT ***

      {reset: [
         ['foo', 10],
         ['inner', 'foo', 20],
         ['inner', 'jip', 'foo', 30],
      ]},
      {f: cell.get, query: ['foo'], context: [], expected: [[10]]},
      {f: cell.get, query: ['foo'], context: ['foo'], expected: [[10]]},
      {f: cell.get, query: ['foo'], context: ['bar'], expected: [[10]]},
      {f: cell.get, query: ['bar'], context: ['foo'], expected: []},
      {f: cell.get, query: ['foo'], context: ['inner'], expected: [[20]]},
      {f: cell.get, query: ['foo'], context: ['inner', 'jip'], expected: [[30]]},
      {f: cell.get, query: ['foo'], context: ['inner', 'jip', 'foo'], expected: [[30]]},
      {f: cell.get, query: ['foo'], context: ['something', 'else', 'completely'], expected: [[10]]},

      // *** GET WITH DOT ***

      {reset: [
         ['foo', 10],
         ['inner', 'foo', 20],
      ]},
      {f: cell.get, query: ['.', 'foo'], context: [], expected: [[10]]},
      {f: cell.get, query: ['.', 'foo'], context: ['inner'], expected: [[20]]},
      {f: cell.get, query: ['.', 'inner', 'foo'], context: [], expected: [[20]]},
      {f: cell.get, query: ['.'], context: ['inner', 'foo'], expected: [[20]]},
      {f: cell.get, query: ['.', 'foo'], context: ['something', 'else', 'completely'], expected: []},
      */

      // *** PUT ***

      {reset: []},
      {f: cell.call, input: ['@ put p foo', '@ put v bar'], expected: [['ok']]},
      {f: cell.call, input: '@', expected: [
         ['dialog', 1, 'c', '@ put p foo\n@ put v bar'],
         ['dialog', 1, 'from', 'user'],
         ['dialog', 1, 'id', '<OMITTED>'],
         ['dialog', 1, 'ms', '<OMITTED>'],
         ['dialog', 1, 'r', 'ok'],
         ['dialog', 1, 'to', 'cell'],
         ['foo', 'bar']
      ], keepDialog: true},

      {reset: [
         ['foo', 'bar', 1, 'jip'],
         ['foo', 'bar', 2, 'joo'],
      ]},
      {f: cell.call, input: ['@ put p foo bar', '@ put v hey'], expected: [['ok']]},
      {f: cell.call, input: '@ foo', expected: [['bar', 'hey']]},
      {f: cell.call, input: ['@ put p foo', '@ put v 1'], expected: [['ok']]},
      {f: cell.call, input: '@ foo', expected: [[1]]},
      {reset: [
         ['foo', 'bar', 1, 'jip'],
         ['foo', 'bar', 2, 'joo'],
      ]},
      {f: cell.call, input: ['@ put p foo', '@ put v bar hey'], expected: [['ok']]},
      {f: cell.call, input: '@', expected: [['foo', 'bar', 'hey']]},
      {f: cell.call, input: ['@ put p foo 2', '@ put v something'], expected: [['error', 'The path `foo bar hey` is setting a hash but there is already a list at path `foo`']]},
      {f: cell.call, input: ['@ put p foo yup', '@ put v go'], expected: [['ok']]},
      {f: cell.call, input: '@', expected: [['foo', 'bar', 'hey'], ['foo', 'yup', 'go']]},
      {reset: [
         ['foo', 'bar', 1, 'jip'],
         ['foo', 'bar', 2, 'joo'],
         ['foo', 'soda', 'wey'],
      ]},
      {f: cell.call, input: ['@ put p foo', '@ put v ""'], expected: [['ok']]},
      {f: cell.call, input: '@ foo', expected: [['']]},
      {f: cell.call, input: '@', expected: [['foo', '']]},
      {f: cell.call, input: ['@ put p ""', '@ put v 1'], expected: [['ok']]},
      {f: cell.call, input: '@', expected: [['foo', ''], ['', 1]]},
      {f: cell.call, input: '@ ""', expected: [[1]]},
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
      {f: cell.call, input: ['@ put p foo "\n             \n             bar"', '@ put v 1'], expected: [['ok']]},
      {f: cell.call, input: ['@ foo "\n       \n       bar"'], expected: [[1]]},

      {f: cell.call, input: ['@ put p put', '@ put v 1'], expected: [['error', 'I\'m sorry Dave, I\'m afraid I can\'t do that']]},
      {f: cell.call, input: ['@ put p dialog', '@ put v 1'], expected: [['error', 'A dialog cannot be supressed by force.']]},
      {f: cell.call, input: ['@ put p foo bar jip', '@ put p foo oh yeah', '@ put v 1'], expected: [['error', 'Only one path can be put at the same time, but received multiple paths: foo bar jip, foo oh yeah']]},

      // *** PUT WITH CONTEXT PATH ***

      {reset: [
         ['foo', 'something'],
      ]},
      {f: cell.put, context: ['foo'], input: [['p', 'bar'], ['v', 1]], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [['bar', 1], ['foo', 'something']]},

      {reset: [
         ['foo', 'bar', 0],
      ]},
      {f: cell.put, context: ['foo'], input: [['p', 'bar'], ['v', 1]], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [['foo', 'bar', 1]]},

      {reset: [
         ['foo', 'bar', 1],
         ['foo', 'jip', 2],
         ['foo', 'something', 'else'],
      ]},
      {f: cell.put, context: ['foo', 'something', 'else'], input: [['p', 'bar'], ['v', 3]], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [['foo', 'bar', 3], ['foo', 'jip', 2], ['foo', 'something', 'else']]},

      // *** PUT WITH DOT ***

      {reset: [
         ['foo', 10],
         ['inner', 'foo', 20],
      ]},
      {f: cell.put, input: [['p', '.', 'foo'], ['v', 20]], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [['foo', 20], ['inner', 'foo', 20]]},
      {f: cell.put, input: [['p', '.', 'foo'], ['v', 20]], context: ['something', 'else'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [['foo', 20], ['inner', 'foo', 20], ['something', 'else', 'foo', 20]]},
      {f: cell.put, input: [['p', '.', 'foo'], ['v', 30]], context: ['inner'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [['foo', 20], ['inner', 'foo', 30], ['something', 'else', 'foo', 20]]},

      // *** RESPOND ***

      {reset: [
         ['foo', 10],
      ]},
      {f: cell.call, input: ['@ put p reffoo', '@ put v @ foo'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [['foo', 10], ['reffoo', '=', 10], ['reffoo', '@', 'foo']]},

      {f: cell.call, input: ['@ put p foo', '@ put v 20'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [['foo', 20], ['reffoo', '=', 20], ['reffoo', '@', 'foo']]},

      // Even if you overwrite the = keys, they will be overwritten again by cell.respond!
      {f: cell.call, input: ['@ put p reffoo =', '@ put v 30'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [['foo', 20], ['reffoo', '=', 20], ['reffoo', '@', 'foo']]},

      // A reference to nothing combined with an unrelated reference to something.
      {f: cell.call, input: ['@ put p a', '@ put v @ nil'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [['a', '=', ''], ['a', '@', 'nil'], ['foo', 20], ['reffoo', '=', 20], ['reffoo', '@', 'foo']]},

      {reset: [
         ['foo', 1],
         ['list', 1, 'bar'],
      ]},
      {f: cell.call, input: ['@ put p indirect', '@ put v @ list @ foo'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [['foo', 1], ['indirect', '=', 'bar'], ['indirect', '@', 'list', '=', 1], ['indirect', '@', 'list', '@', 'foo'], ['list', 1, 'bar']]},

      {reset: [
         ['aqualung', 'great'],
         ['score', 'great', 100]
      ]},
      {f: cell.call, input: ['@ put p rrref', '@ put v @ score @ aqualung'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [['aqualung', 'great'], ['rrref', '=', 100], ['rrref', '@', 'score', '=', 'great'], ['rrref', '@', 'score', '@', 'aqualung'], ['score', 'great', 100]]},

      {reset: [
         ['foo', 'bar'],
      ]},

      {f: cell.call, input: ['@ put p joo', '@ put v @ jip'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [['foo', 'bar'], ['joo', '=', ''], ['joo', '@', 'jip' ]]},
      {f: cell.call, input: ['@ put p jip', '@ put v @ foo'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [['foo', 'bar'], ['jip', '=', 'bar'], ['jip', '@', 'foo'], ['joo', '=', '=', 'bar'], ['joo', '=', '@', 'foo'], ['joo', '@', 'jip' ]]},

      {reset: [
         ['location', 'trompe', 1],
         ['pixies', 'trompe', 1, 'alec eiffel'],
         ['pixies', 'trompe', 2, 'mons'],
      ]},
      {f: cell.call, input: ['@ put p record', '@ put v @ pixies @ location'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [['location', 'trompe', 1], ['pixies', 'trompe', 1, 'alec eiffel'], ['pixies', 'trompe', 2, 'mons'], ['record', '=', 'alec eiffel'], ['record', '@', 'pixies', '=', 'trompe', 1], ['record', '@', 'pixies', '@', 'location']]},

      {reset: [
         ['foo', 1, 'bar'],
         ['foo', 2, 'jip'],
      ]},
      {f: cell.call, input: ['@ put p ref', '@ put v @ foo'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [['foo', 1, 'bar'], ['foo', 2, 'jip'], ['ref', '=', 1, 'bar'], ['ref', '=', 2, 'jip'], ['ref', '@', 'foo']]},
      {f: cell.call, input: ['@ put p foo', '@ put v bar'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [['foo', 'bar'], ['ref', '=', 'bar'], ['ref', '@', 'foo']]},

      {reset: [
         ['context', 'foo', 20],
         ['foo', 10],
      ]},
      {f: cell.call, input: ['@ put p context ref', '@ put v @ foo'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [['context', 'foo', 20], ['context', 'ref', '=', 20], ['context', 'ref', '@', 'foo'], ['foo', 10]]},

      {reset: [
         ['bar', 1, 'a', 'A', 'C'],
         ['bar', 2, 'b', 'B', 'D'],
         ['foo', 1, 'a'],
         ['foo', 2, 'b'],
      ]},
      // TODO: implement or forbid this
      //{f: cell.call, input: ['@ put p jip', '@ put v @ bar @ foo'], expected: [['ok']]},
      //{f: cell.call, input: ['@'], expected: [['bar', 1, 'a', 'A', 'C'], ['bar', 2, 'b', 'B', 'D'], ['foo', 1, 'a'], ['foo', 2, 'b'], ['jip', '=', 'A', 'C'], ['jip', '=', 'B', 'D'], ['jip', '@', 'bar', '=', 1, 'a'], ['jip', '@', 'bar', '=', 2, 'b'], ['jip', '@', 'bar', '@', 'foo']]},

      // *** COND ***

      {reset: []},
      {f: cell.call, input: ['@ put p result', '@ put v @ if cond @ count', '@ put v @ if do yes!', '@ put v @ if finally no!'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [
          ['result', '=', 'error', 'An if call has to be a hash with keys `cond`, `do` and `else`.'],
          ['result', '@', 'if', 'cond', '=', ''],
          ['result', '@', 'if', 'cond', '@', 'count'],
          ['result', '@', 'if', 'do', 'yes!'],
          ['result', '@', 'if', 'finally', 'no!']
      ]},

      {reset: []},
      {f: cell.call, input: ['@ put p result', '@ put v @ if do yes!', '@ put v @ if else no!'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [
          ['result', '=', 'error', 'An if call has to contain a `cond` key.'],
          ['result', '@', 'if', 'do', 'yes!'],
          ['result', '@', 'if', 'else', 'no!']
      ]},

      {reset: [
         ['count', 1],
      ]},
      {f: cell.call, input: ['@ put p result', '@ put v @ if cond @ count', '@ put v @ if do yes!', '@ put v @ if else no!'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [
          ['count', 1],
          ['result', '=', 'yes!'],
          ['result', '@', 'if', 'cond', '=', 1],
          ['result', '@', 'if', 'cond', '@', 'count'],
          ['result', '@', 'if', 'do', 'yes!'],
          ['result', '@', 'if', 'else', 'no!']
      ]},
      {f: cell.call, input: ['@ put p count', '@ put v 0'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [
          ['count', 0],
          ['result', '=', 'no!'],
          ['result', '@', 'if', 'cond', '=', 0],
          ['result', '@', 'if', 'cond', '@', 'count'],
          ['result', '@', 'if', 'do', 'yes!'],
          ['result', '@', 'if', 'else', 'no!']
      ]},

      {reset: [
         ['count', 1],
      ]},
      {f: cell.call, input: ['@ put p result', '@ put v @ if cond @ count', '@ put v @ if else no!'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [
          ['count', 1],
          ['result', '=', ''],
          ['result', '@', 'if', 'cond', '=', 1],
          ['result', '@', 'if', 'cond', '@', 'count'],
          ['result', '@', 'if', 'else', 'no!']
      ]},

      {reset: [
         ['count', 0],
         ['inner', 'count', 1],
      ]},
      {f: cell.call, input: ['@ put p inner result', '@ put v @ if cond @ count', '@ put v @ if else no!'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [
          ['count', 0],
          ['inner', 'count', 1],
          ['inner', 'result', '=', ''],
          ['inner', 'result', '@', 'if', 'cond', '=', 1],
          ['inner', 'result', '@', 'if', 'cond', '@', 'count'],
          ['inner', 'result', '@', 'if', 'else', 'no!']
      ]},
      {f: cell.call, input: ['@'], expected: [
          ['count', 0],
          ['inner', 'count', 1],
          ['inner', 'result', '=', ''],
          ['inner', 'result', '@', 'if', 'cond', '=', 1],
          ['inner', 'result', '@', 'if', 'cond', '@', 'count'],
          ['inner', 'result', '@', 'if', 'else', 'no!']
      ]},
      {reset: [
         ['count', 1],
      ]},
      {f: cell.call, input: ['@ put p result', '@ put v @ if cond @ count', '@ put v @ if do bar 1', '@ put v @ if do foo 2'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [
          ['count', 1],
          ['result', '=', 'bar', 1],
          ['result', '=', 'foo', 2],
          ['result', '@', 'if', 'cond', '=', 1],
          ['result', '@', 'if', 'cond', '@', 'count'],
          ['result', '@', 'if', 'do', 'bar', 1],
          ['result', '@', 'if', 'do', 'foo', 2],
      ]},

      // *** SEQUENCE ***

      {reset: []},
      {f: cell.call, input: ['@ put p ref', '@ put v @ invalid 1'], expected: [['ok']]},

      {f: cell.call, input: ['@ put p invalid', '@ put v @ do'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [
         ['invalid', '=', 'error', 'The definition of a sequence must contain a message name and at least one step.'],
         ['invalid', '@', 'do'],
         // Because there's nothing after the @ do, if we reference it (`@ invalid 1`) we won't get a definition, so there's no error either.
         ['ref', '=', ''],
         ['ref', '@', 'invalid', 1],
      ]},

      {f: cell.call, input: ['@ put p invalid', '@ put v @ do 1 1'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [
         ['invalid', '=', 'error', 'The definition of a sequence must contain a textual name for its message.'],
         ['invalid', '@', 'do', 1, 1],
         ['ref', '=', 'error', 'The definition of a sequence must contain a textual name for its message.'],
         ['ref', '@', 'invalid', 1],
      ]},

      {f: cell.call, input: ['@ put p invalid', '@ put v @ do seq 1 1'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [
         ['invalid', '=', 'error', 'The name of the message cannot be `seq`.'],
         ['invalid', '@', 'do', 'seq', 1, 1],
         ['ref', '=', 'error', 'The name of the message cannot be `seq`.'],
         ['ref', '@', 'invalid', 1],
      ]},

      {f: cell.call, input: ['@ put p invalid', '@ put v @ do foo 1', '@ put v @ do bar 2'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [
         ['invalid', '=', 'error', 'The definition of a sequence can only contain a single name for its message.'],
         ['invalid', '@', 'do', 'bar', 2],
         ['invalid', '@', 'do', 'foo', 1],
         ['ref', '=', 'error', 'The definition of a sequence can only contain a single name for its message.'],
         ['ref', '@', 'invalid', 1],
      ]},

      {f: cell.call, input: ['@ put p invalid', '@ put v @ do foo 2'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [
         ['invalid', '=', 'error', 'The definition of a sequence must start with step number 1.'],
         ['invalid', '@', 'do', 'foo', 2],
         ['ref', '=', 'error', 'The definition of a sequence must start with step number 1.'],
         ['ref', '@', 'invalid', 1],
      ]},

      {f: cell.call, input: ['@ put p invalid', '@ put v @ do foo 1 1', '@ put v @ do foo 3 3'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [
         ['invalid', '=', 'error', 'The definition of a sequence cannot have non-consecutive steps.'],
         ['invalid', '@', 'do', 'foo', 1, 1],
         ['invalid', '@', 'do', 'foo', 3, 3],
         ['ref', '=', 'error', 'The definition of a sequence cannot have non-consecutive steps.'],
         ['ref', '@', 'invalid', 1],
      ]},

      // Valid sum
      {reset: []},
      {f: cell.call, input: ['@ put p eleven', '@ put v @ plus1 10'], expected: [['ok']]},
      {f: cell.call, input: ['@ put p plus1', '@ put v @ do int 1 @ + - @ int', '@ put v @ do int 1 @ + - 1'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [
          ['eleven', '=', 11],
          ['eleven', ':', 'int', 10],
          ['eleven', ':', 'seq', 1, '=', 11],
          ['eleven', ':', 'seq', 1, '@', '+', 1, '=', 10],
          ['eleven', ':', 'seq', 1, '@', '+', 1, '@', 'int'],
          ['eleven', ':', 'seq', 1, '@', '+', 2, 1],
          ['eleven', '@', 'plus1', 10],
          ['plus1', '=', 'int', 1],
          ['plus1', '@', 'do', 'int', 1, '@', '+', 1, '@', 'int'],
          ['plus1', '@', 'do', 'int', 1, '@', '+', 2, 1],
      ]},

      // Update value, the sum should update
      {f: cell.call, input: ['@ put p plus1', '@ put v @ do int 1 @ + - @ int', '@ put v @ do int 1 @ + - 2'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [
          ['eleven', '=', 12],
          ['eleven', ':', 'int', 10],
          ['eleven', ':', 'seq', 1, '=', 12],
          ['eleven', ':', 'seq', 1, '@', '+', 1, '=', 10],
          ['eleven', ':', 'seq', 1, '@', '+', 1, '@', 'int'],
          ['eleven', ':', 'seq', 1, '@', '+', 2, 2],
          ['eleven', '@', 'plus1', 10],
          ['plus1', '=', 'int', 1],
          ['plus1', '@', 'do', 'int', 1, '@', '+', 1, '@', 'int'],
          ['plus1', '@', 'do', 'int', 1, '@', '+', 2, 2],
      ]},

      // Call to definition with a location of two steps
      {reset: []},
      {f: cell.call, input: ['@ put p eleven', '@ put v @ nested plus1 10'], expected: [['ok']]},
      {f: cell.call, input: ['@ put p nested plus1', '@ put v @ do int 1 @ + - @ int', '@ put v @ do int 1 @ + - 1'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [
          ['eleven', '=', 11],
          ['eleven', ':', 'int', 10],
          ['eleven', ':', 'seq', 1, '=', 11],
          ['eleven', ':', 'seq', 1, '@', '+', 1, '=', 10],
          ['eleven', ':', 'seq', 1, '@', '+', 1, '@', 'int'],
          ['eleven', ':', 'seq', 1, '@', '+', 2, 1],
          ['eleven', '@', 'nested', 'plus1', 10],
          ['nested', 'plus1', '=', 'int', 1],
          ['nested', 'plus1', '@', 'do', 'int', 1, '@', '+', 1, '@', 'int'],
          ['nested', 'plus1', '@', 'do', 'int', 1, '@', '+', 2, 1],
      ]},

      // Call with message with two paths
      {reset: []},
      {f: cell.call, input: ['@ put p def', '@ put v @ do message 1 @ message'], expected: [['ok']]},
      {f: cell.call, input: ['@ put p call', '@ put v @ def bar 1', '@ put v @ def foo 2'], expected: [['ok']]},
      {f: cell.call, input: ['@'], expected: [
         ['call', '=', 'bar', 1],
         ['call', '=', 'foo', 2],
         ['call', ':', 'message', 'bar', 1],
         ['call', ':', 'message', 'foo', 2],
         ['call', ':', 'seq',  1, '=', 'bar', 1],
         ['call', ':', 'seq',  1, '=', 'foo', 2],
         ['call', ':', 'seq', 1, '@', 'message'],
         ['call', '@', 'def', 'bar', 1],
         ['call', '@', 'def', 'foo', 2],
         ['def', '=', 'message', 1],
         ['def', '@', 'do', 'message', 1, '@', 'message']
      ]},

      // Call list
      {reset: []},
      //{f: cell.call, input: ['@ do', '@ put v @ do message 1 @ message'], expected: [['ok']]},

   ], false, function (test) {

      if (test.reset) return dataspace = cell.sorter (test.reset);

      if (test.f === cell.textToPaths  && type (test.input)    === 'array') test.input    = test.input.join ('\n');
      if (test.f === cell.call         && type (test.input)    === 'array') test.input    = test.input.join ('\n');
      if (test.f === cell.pathsToText  && type (test.expected) === 'array') test.expected = test.expected.join ('\n');
      if (test.f === cell.call) test.expected = cell.pathsToText (test.expected);

      var get = function () {
         return dataspace;
      }
      var put = function (v) {
         dataspace = v;
      }

      if (test.f === cell.get)       var result = cell.get (test.query, test.context, get);
      else if (test.f === cell.put)  var result = cell.put (test.input, test.context || [], get, put);
      else if (test.f === cell.call) var result = cell.call (test.input, 'user', 'cell', false, get, put);
      else                           var result = test.f (test.input);

      // Remove the dialog or omit id and ms
      if (test.f === cell.call) result = cell.pathsToText (dale.fil (cell.textToPaths (result), undefined, function (path) {
         if (path [0] !== 'dialog') return path;
         if (! test.keepDialog) return;
         if (['id', 'ms'].includes (path [path.length - 2])) return path.slice (0, -1).concat ('<OMITTED>');
         return path;
      }));

      if (teishi.eq (result, test.expected)) return true;
      clog ('Test mismatch', {input: test.input, expected: test.expected, obtained: result});
      pretty ('expected', test.expected);
      pretty ('result', result);
      return false;
   });

   var isNode = typeof exports === 'object';
   if (isNode) {
      var dataspace = [];
      var get = function () {
         return dataspace;
      }
      var put = function (v) {
         dataspace = v;
      }

      //var newTests = cell.textToJS (require ('fs').readFileSync ('test.4tx', 'utf8'));
      var newTests = [];
      dale.stop (newTests, false, function (suite) {
         clog ('\n' + dale.keys (suite) [0]);
         return dale.stop (suite [dale.keys (suite) [0]], false, function (test) {
            clog (Array (dale.keys (suite) [0].length).fill (' ').join (''), test.tag);
            if (test.c !== undefined) var result = cell.call (cell.JSToText (test.c), 'user', 'cell', false, get, put);
            else var result = cell.call (test.ct, 'user', 'cell', false, get, put);

            // Remove the dialog or omit id and ms
            result = cell.pathsToText (dale.fil (cell.textToPaths (result), undefined, function (path) {
               if (path [0] !== 'dialog') return path;
               if (! test.keepDialog) return;
               if (['id', 'ms'].includes (path [path.length - 2])) return path.slice (0, -1).concat ('<OMITTED>');
               return path;
            }));

            // The problem with testing like this is that r is sorted when we parse it. So we need to test sorting some other way.
            // Another limitation: we cannot test invalid fourtext because the tests won't parse otherwise
            if (test.r === undefined) return; // Some test steps have no assertions because they are just setting the ground for the next test. We don't do any assertions over those.
            if (result !== (teishi.simple (test.r) ? (test.r + '') : cell.JSToText (test.r))) {
               pretty ('expected', cell.JSToPaths (test.r));
               pretty ('result', cell.textToPaths (result));
               errorFound = true;
               return false
            }
         });
      });
   }

   if (errorFound) return clog ('A test did not pass');
   else clog ('All tests successful', (teishi.time () - start) + 'ms');
}

test ();
