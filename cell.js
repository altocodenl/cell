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

   var result;

   if (parsedMessage.error) result = 'error "' + parsedMessage.error + '"';

   // {get: [...]}
   if (parsedMessage.get) result = get (parsedMessage.get);
   // {put: [...]}
   if (parsedMessage.put) result = put (parsedMessage.put);

   clog ('receive', message, result);
   put (['lastcall', ...message]);
   put (['lastres', ...result]);
}

// It validates and it parses
var parse = function (message) {
   // Check it out, a one line lexer!
   message = message.trim ().replace (/\s+/, ' ').split (/\s/);

   if (message.length === 0) return {error: 'Message is empty'};

   if (message [0] [0] !== '@') return {error: 'Call must start with "@"'};

   if (message [0] !== '@') return {error: 'Call must start with "@" and have a space after it'};

   if (message [1] === 'put') return {put: message.slice (2)};

   // If it's not a put, it is a get
   return {get: message.slice (1)};
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
         var indent = Array (message.join (' ').length + 1).fill ().join (' ') + ' ';
         if (line.match (new RegExp ('^' + indent))) output.push (line.replace (indent, ''));
         else return false;
      }

   });

   return output.join ('\n');
}

// For now: 1) single line calls; 2) no quotes!
var put = function (message) {
   var dataspace = localStorage.getItem ('cell');
   if (dataspace === null) dataspace = '';
   if (message.length === 0) dataspace = ''
   else {
      var existingLines = get (message).split ('\n');
      if (! existingLines.length) dataspace += '\n' + message.join (' ');
      else                        dataspace = dataspace.replace (existingLines, message.join (' '));
   }

   localStorage.setItem ('cell', dataspace);
   B.call ('set', 'dataspace', dataspace);

   return 'OK';
}

// *** RESPONDERS ***

B.mrespond ([
   ['initialize', [], function () {
      var dataspace = localStorage.getItem ('cell');
      if (dataspace === null) {
         dataspace = [
            'foo bar 1',
            '    jip 2',
            '    soda wey',
            'something else'
         ].join ('\n');
         localStorage.setItem ('cell', dataspace);
      }
      B.call ('set', 'dataspace', dataspace);
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
