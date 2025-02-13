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
      {call: '@ put foo bar hey', expected: 'OK'},
      {call: '@ foo bar', expected: 'hey'},
      {call: '@ foo', expected: ['bar hey', 'soda wey']},
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
   ], false, function (test) {
      if (test.reset) return B.call ('reset', [], test.reset);

      var result = receive (test.call);
      if (teishi.type (test.expected) === 'array') test.expected = test.expected.join ('\n');
      if (result === test.expected) return true;
      clog ('Test mismatch', {expected: test.expected, obtained: result});
      return false;
   });
   if (errorFound) clog ('A test did not pass');
   else clog ('All tests successful');

   B.call ('reset', [], [original]);
}

test ();
