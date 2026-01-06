// *** SETUP ***

var isNode = typeof exports === 'object';

if (isNode) var cell = exports;
else        var cell = {};

var dale   = isNode ? require ('dale')   : window.dale;
var teishi = isNode ? require ('teishi') : window.teishi;

var clog = console.log, type = teishi.type;

var pretty = function (label, data) {
   if (type (data) === 'object') data = cell.JSToPaths (data);
   if (type (data) === 'array') {
      if (type (data [0]) !== 'array') data = [data];
      data = cell.pathsToText (data);
   }
   teishi.clog (label, '\n' + data);
}

var counters = {};
var count = function (what, n) {
   if (! counters [what]) counters [what] = 0;
   counters [what] += (n || 1);
   clog (counters);
}

// *** PARSING FUNCTIONS ***

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

      if ((line.length === 0 || line.match (/^\s+$/)) && ! insideMultilineText) return;

      if (line [0] === ' ' && ! insideMultilineText) {
         if (! lastPath) return 'The first line of the message cannot be indented: `' + line + '`.';
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

         if ((line.length > 0 && line.match (/[^\s]/)) && ! line.match (new RegExp ('^ {' + insideMultilineText + '}'))) return 'Missing indentation in multiline text `' + originalLine + '`';
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
         if (element.match (/\s/)) return 'The line `' + line + '` contains a space that should be contained within quotes.';
         if (element.match (/"/)) return 'The line `' + line + '` has an unescaped quote.';

         path.push (cell.toNumberIfNumber (element));
         line = line.slice (element.length + 1);
      }

      if (! paths.includes (path)) paths.push (path);
   });

   if (error) return [['error', error]];
   if (insideMultilineText) return [['error', 'Multiline text not closed: `' + teishi.last (teishi.last (paths)).replace (/\n$/, '') + '`']];

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
      if (v1 === v2) return 0;
      var types = [type (v1) === 'string' ? 'text' : 'number', type (v2) === 'string' ? 'text' : 'number'];
      if (types [0] !== types [1]) return types [1] === 'text' ? -1 : 1;
      if (types [0] === 'number') return v1 - v2;

      if (v1 === '=' && v2 === ':') return -1;
      if (v1 === ':' && v2 === '=') return 1;

      return v1 < v2 ? -1 : 1;
   }

   return paths.sort (function (a, b) {
      var result = dale.stopNot (dale.times (Math.min (a.length, b.length), 0), 0, function (k) {
         return compare (a [k], b [k]);
      }) || 0;
      return result !== 0 ? result : a.length - b.length;
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

   return error ? [['error', error]] : [];
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
            var indent = line.length === 0 ? '' : spaces (indentCount);
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

// *** JS HELPERS ***

cell.JSToPaths = function (v, paths) {

   paths = paths || [];

   var singleTo4 = function (v) {
      var Type = type (v);
      if (teishi.inc (['integer', 'float', 'string'], Type)) return v;
      if (Type === 'boolean') return v ? 1 : 0;
      if (Type === 'date') return v.toISOString ();
      if (teishi.inc (['regex', 'function', 'infinity'], Type)) return v.toString ();
      return '';
   }

   var recurse = function (v, path) {
      if (v === undefined) return; // Skip undefined paths to properly represent sparse arrays
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

// *** ENTRYPOINT ***

cell.call = function (message, from, to, hide, get, put) {

   var startTime = new Date ();
   var callId = startTime.toISOString () + '-' + (Math.random () + '').slice (2, 6);

   var respond = function (response) {

      var dialog = cell.get (['dialog'], [], get, put);
      var length = dialog.length ? teishi.last (dialog) [0] : 0;

      cell.put ([
         ['dialog', length + 1, 'from', from],
         ['dialog', length + 1, 'to', to],
         ['dialog', length + 1, 'c', message],
         ...dale.go (message === '@' ? [['dialog', length + 1, 'r', '[OMITTED]']] : response, function (path) {
            return ['dialog', length + 1, 'r', ...path];
         }),
         ['dialog', length + 1, 'id', callId],
         ['dialog', length + 1, 'hide', 1],
         ['dialog', length + 1, 'ms', new Date ().getTime () - startTime.getTime ()],
      ], [], get, put, true);

      return cell.pathsToText (response);
   }

   // Note that even if the call is not valid, we still store it in the dialog!
   if (type (message) !== 'string') return respond ([['error', 'The message must be text but instead is ' + type (message)]]);

   var paths = cell.textToPaths (message);
   if (paths [0] && paths [0] [0] === 'error') return respond (paths);

   if (paths.length === 0) return respond (paths);

   /*
   cell.put ([
      ['p', 'tmp'],
      ...dale.go (paths, function (path) {
         return ['v'].concat (path);
      }),
   ], [], get, put);

   pretty ('debug everything after put', cell.get ([], [], get));

   // Filter out paths starting with @ since that's what came on the original call
   var response = dale.fil (cell.get (['tmp'], [], get), undefined, function (path) {
      if (path [0] !== '@') return path;
   });

   pretty ('debug response', response);

   return respond (response);
   */

   // Temporary expedient: mirror back the data when there's no call
   if (paths [0] [0] !== '@') return respond (paths);

   ///*
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
   //*/
}

// var cr = 0, cd = 0, cp = 0;

// *** RESPOND ***

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
   var dataspace = get ();
   var index = dale.stopNot (dataspace, undefined, function (v, k) {
      if (teishi.eq (path, v)) return k;
   });
   var firstPath = index === 0 || dataspace [index - 1].length < prefix.length || ! teishi.eq (dataspace [index - 1].slice (0, prefix.length - 1), prefix.slice (0, -1));
   if (! firstPath) return;

   /*
   cr++;
   var id = cr;
   pretty ('dataspace ' + id, dataspace);
   pretty ('respond ' + id, path);
   //pretty ('respond', cell.JSToPaths ({path, contextPath, targetPath, valuePath}));
   */

   var multipleCalls = dale.stopNot (dataspace.slice (index + 1), false, function (p) {
      if (! teishi.eq (path.slice (0, rightmostAt + 1), p.slice (0, rightmostAt + 1))) return;
      if (p [rightmostAt + 1] !== path [rightmostAt + 1]) return true;
   });

   var currentValue = cell.get (targetPath, contextPath, get);

   if (multipleCalls) {
      var newValue = [['error', 'Only one call per prefix is allowed']];
   }
   else if (valuePath [0] === 'if') {
      var newValue = cell.if (prefix, contextPath, get);
   }
   else if (valuePath [0] === 'do') {
      var newValue = cell.do ('define', prefix, contextPath, null, get);
   }
   else {
      var newValue = cell.get (valuePath, contextPath, get);

      if (newValue [0] && newValue [0] [0] === '@') return;

      // if (newValue.length) pretty ('reference ' + id, {valuePath, contextPath});

      if (newValue.length === 0) {
         var call = dale.stopNot (dale.times (valuePath.length - 1, 1), undefined, function (k) {
            var value = cell.get (valuePath.slice (0, k).concat (['@', 'do']), contextPath, get);
            if (value.length) return {definitionPath: valuePath.slice (0, k).concat (['@', 'do']), message: valuePath.slice (k)};
         });

         if (call) {
            if (call.definitionPath.length > 3) prefix = prefix.concat (call.definitionPath.slice (1).slice (0, -2));

            call.message = [];
            dale.stop (dataspace.slice (index), undefined, function (v) {
               if (v.length < prefix.length) return;
               if (teishi.eq (v.slice (0, prefix.length), prefix)) return call.message.push (v.slice (prefix.length));
            });
            newValue = cell.do ('execute', call.definitionPath, contextPath, call.message, get, put);
            //pretty ('respond call ' + id, {path, newValue});
         }
         else {
            var message = [];
            dale.stop (dataspace.slice (index), undefined, function (v) {
               if (v.length < prefix.length) return;
               if (teishi.eq (v.slice (0, prefix.length), prefix)) return message.push (v.slice (prefix.length));
            });
            var nativeResponse = cell.native (valuePath [0], message);
            if (nativeResponse !== false) newValue = nativeResponse;
            //pretty ('respond native call ' + id, newValue);
         }
      }
   }

   if (newValue === true) return true;
   if (newValue.length === 0) newValue = [['']];

   if (teishi.eq (currentValue, newValue)) return;

   /*
   pretty ('respond put ' + id, dale.go (newValue, function (path) {
      return targetPath.concat (path);
   }));
   */

   cell.put (dale.go (newValue, function (path) {
      return targetPath.concat (path);
   }), [], get, put);

   return true;
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

   /*
   cd++;
   var id = cd;
   pretty ('do ' + id, {op, definitionPath, contextPath, message});
   */

   var definition = cell.get (definitionPath, contextPath, get);

   if (definition.length === 0) return [['error', 'The definition of a sequence must contain a message name and at least one step.']];

   var messageName = definition [0] [0];
   if (type (messageName) !== 'string') return [['error', 'The definition of a sequence must contain a textual name for its message.']];

   if (messageName === 'do') return [['error', 'The name of the message cannot be `do`.']];

   if (dale.keys (cell.pathsToJS (definition)).length !== 1) return [['error', 'The definition of a sequence can only contain a single name for its message.']];

   if (definition [0] [1] !== 1) return [['error', 'The definition of a sequence must start with step number 1.']];
   var error = dale.stopNot (definition, undefined, function (path, k) {
      if (definition [k - 1] && path [1] - 1 > definition [k - 1] [1]) return [['error', 'The definition of a sequence cannot have non-consecutive steps.']];
   });
   if (error) return error;

   if (op === 'define') return [[messageName, teishi.last (definition) [1]]];

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
      if (path [0] !== 'do') return path;
   });

   if (! teishi.eq (stripper (previousMessage), stripper (dale.go (message, function (path) {
      return [messageName].concat (path);
   })))) {
      cell.put (dale.go (message, function (v) {
         return ['.', ':', messageName].concat (v);
      // TODO: wipe do properly
      }).concat ([['.', ':', 'do', '']]), contextPath, get, put);

      return true;
   }

   definition = dale.go (definition, function (v) {return v.slice (1)});
   var sequenceLength = teishi.last (definition) [0];

   var result = dale.stopNot (dale.times (sequenceLength, 1), undefined, function (stepNumber) {

      var previousStep = cell.get (contextPath.concat ([':', 'do', stepNumber]), [], get);

      var currentStep = dale.fil (definition, undefined, function (path) {
         if (path [0] === stepNumber) return path.slice (1);
      });

      if (! teishi.eq (stripper (previousStep), stripper (currentStep))) {
         cell.put (dale.go (currentStep, function (v) {
            return [':', 'do', stepNumber].concat (v);
         }), contextPath, get, put);
         return true;
      }

      var existingValuePath = contextPath.concat ([':', 'do', stepNumber]);
      if (teishi.last (currentStep) [0] === '@') existingValuePath.push ('=');
      var existingValue = cell.get (existingValuePath, [], get);

      if (existingValue.length === 0) return true;

      if (['error', 'stop'].includes (existingValue [0] [0]) || stepNumber === sequenceLength) {
         //pretty ('do condition ' + id, existingValue);
         return existingValue;
      }
   });

   //pretty ('do output ' + id, {definitionPath, contextPath, op, result});
   return result;
}

cell.native = function (call, message, contextPath, get) {
   var nativeCalls = [
      'if', 'do', // Conditional & sequence
      '+', '-', '*', '/', '%', // Math
      'eq', '>', '<', '>=', '<=', // Comparison
      'and', 'or', 'not', // Logical
      'upload' // Organization
   ];

   if (nativeCalls.indexOf (call) === -1) return false;

   //pretty ('native', {call, message, contextPath});

   /*
   if (call === 'do') return cell.do ('define', messagePath, contextPath, null, get);
   if (call === 'if') return cell.if (messagePath, contextPath, get);

   message = cell.pathsToJS (stripper (cell.get (messagePath, contextPath, get)))
   */

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

cell.upload = function (name, mime, base64, data) {


   // inputs:
   // name
   // mime
   // base64 file
   // data (text, optional)

   // 1) put it in files
}

// *** REFERENCE & STORE ***

cell.get = function (queryPath, contextPath, get) {
   var dataspace = get ();

   var dotMode = queryPath [0] === '.';
   if (dotMode) queryPath = queryPath.slice (1);

   return dale.stopNot (dale.times (! dotMode ? contextPath.length + 1 : 1, contextPath.length, -1), undefined, function (k) {

      var prefix = contextPath.slice (0, k).concat (queryPath.slice (0, 1));

      if (! dale.stop (dataspace, true, function (path) {
         return teishi.eq (prefix, path.slice (0, prefix.length));
      })) return;

      prefix = contextPath.slice (0, k).concat (queryPath);

      return dale.fil (dataspace, undefined, function (path) {
         if (teishi.eq (prefix, path.slice (0, prefix.length)) && path.length > prefix.length) return path.slice (prefix.length);
      });

   }) || [];
}

cell.put = function (paths, contextPath, get, put, updateDialog) {

   if (paths.length && paths [0].length === 1 || type (paths [0] [0]) === 'integer') return [['error', 'Cannot set entire dataspace to something that is not a hash']];

   var dataspace = get ();

   var hooks = dale.obj (paths, function (path) {
      var dotMode = path [0] === '.';
      return [JSON.stringify (path [dotMode ? 1 : 0]), dotMode];
   });

   dale.go (hooks, function (dotMode, hook) {
      if (dotMode) return hooks [hook] = contextPath;
      var context = dale.stopNot (dale.times (contextPath.length, contextPath.length, -1), undefined, function (k) {
         var prefix = contextPath.slice (0, k).concat (JSON.parse (hook));
         if (! dale.stop (dataspace, true, function (path) {
            return teishi.eq (prefix, path.slice (0, prefix.length));
         })) return;
         return prefix.slice (0, -1);
      });
      hooks [hook] = context || [];
   });

   var error;
   paths = dale.go (paths, function (path) {
      var dotMode = path [0] === '.';
      path = hooks [JSON.stringify (path [dotMode ? 1 : 0])].concat (dotMode ? path.slice (1) : path);
      if (! updateDialog && path [0] === 'dialog') error = [['error', 'A dialog cannot be supressed by force.']];
      else return path;
   });
   if (error) return error;

   var seen = {};
   dale.go (paths, function (path) {
      dale.go (path.slice (0, path.length - 1), function (step, k) {
         var key = JSON.stringify (path.slice (0, k + 1));
         if (seen [key]) return;

         var textStep = type (path [k + 1]) === 'string';
         var lastStep = k + 2 === path.length;
         seen [key] = textStep ? (lastStep ? 'text' : 'hash') : (lastStep ? 'number' : 'list');
      });
   });

   var removed = [];
   dataspace = dale.fil (dataspace, undefined, function (path) {
      if (hooks [JSON.stringify (path [0])] === -1) return path;
      var remove = dale.stop (path.slice (0, path.length - 1), true, function (step, k) {
         var key = JSON.stringify (path.slice (0, k + 1));
         if (! seen [key]) return;

         var textStep = type (path [k + 1]) === 'string';
         var lastStep = k + 2 === path.length;
         var t = textStep ? (lastStep ? 'text' : 'hash') : (lastStep ? 'number' : 'list');

         if (seen [key] !== t || lastStep) return true;
      });
      if (! remove) return path;
      else removed.push (path);
   }).concat (paths);

   cell.sorter (dataspace);
   put (dataspace);

   /*
   cp++;
   var id = cp;
   pretty ('put ' + cp, dale.go (paths, function (path) {
      return ['diff', '+'].concat (path);
   }).concat (dale.go (removed, function (path) {
      return ['diff', 'x'].concat (path);
   })));
   */

   if (! (paths [0] [0] === 'dialog' && teishi.last (paths) [0] === 'dialog')) {
      dale.stop (dataspace, true, function (path) {
         return cell.respond (path, get, put);
      });
   }

   return dale.go (paths, function (path) {
      return ['diff', '+'].concat (path);
   }).concat (dale.go (removed, function (path) {
      return ['diff', 'x'].concat (path);
   }));
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

   return [['ok']];
}

// *** TESTS ***

if (isNode && process.argv [2] === 'test') (function () {
   var start = teishi.time ();

   try {
      var newTests = cell.textToJS (require ('fs').readFileSync ('test.4tx', 'utf8'));
      if (newTests.error) return clog (newTests.error);

   }
   catch (error) {
      return clog ('Missing test file (test.4tx)', error);
   }

   var dataspace = [];
   var get = function () {return dataspace}
   var put = function (v) {dataspace = v}
   var errorFound;

   dale.stop (newTests, false, function (suite) {
      if (type (suite) === 'string') return;
      clog ('\n' + dale.keys (suite) [0]);
      return dale.stop (suite [dale.keys (suite) [0]], false, function (test) {
         if (test.tag) clog (Array (dale.keys (suite) [0].length).fill (' ').join (''), test.tag);

         // text.ct has text that might or might not be proper fourtext
         if (test.ct !== undefined) {
            var response = cell.call (test.ct, 'user', 'cell', false, get, put);
            if (test.r === undefined) test.r = test.ct;
         }
         // text.js has JSON that has to be converted to fourdata
         if (test.js !== undefined) {
            var response = cell.JSToText (JSON.parse (test.js));
         }
         // test.cjs has a call that has to be converted to JSON and compared with r, which is stringified JSON
         if (test.cjs !== undefined) {
            test.r = JSON.stringify (JSON.parse (test.r));
            var response = JSON.stringify (cell.textToJS (test.cjs));
            if (test.r !== response) {
               pretty ('response', response);
               pretty ('expected', test.r);
               errorFound = true;
               return false;
            }
            return;
         }
         // test.c has a call that is valid fourtext
         if (test.c !== undefined) {
            // test.context is only present in a few calls to cell.put
            if (test.context) {
               var call = dale.go (cell.JSToPaths (test.c), function (p) {return p.slice (2)});
               var response = cell.pathsToText (cell.put (call, test.context, get, put));
            }
            else {
               var response = cell.call (cell.JSToText (test.c), 'user', 'cell', false, get, put);
            }
         }

         // Some test steps have no assertions because they are just setting the ground for the next test. We don't make any assertions over those.
         if (test.r === undefined) return;

         // Remove the dialog or omit id and ms
         response = cell.pathsToText (dale.fil (cell.textToPaths (response), undefined, function (path) {
            if (path [0] !== 'dialog') return path;
            if (! test.keepDialog) return;
            if (['id', 'ms'].includes (path [path.length - 2])) return path.slice (0, -1).concat ('<OMITTED>');
            return path;
         }));

         // If we're not testing for JSON (t.cjs) and the expected response is not text (it could be number or a list of paths), make it into text.
         if (type (test.r) !== 'string') test.r = cell.JSToText (test.r);
         if (! teishi.eq (response, test.r)) { // We use teishi.eq to compare two objects if this is a test.cjs
            pretty ('expected', test.r);
            pretty ('response', response);
            errorFound = true;
            return false
         }
      });
   });

   if (errorFound) return clog ('A test did not pass');
   else clog ('All tests successful', (teishi.time () - start) + 'ms');
}) ();
