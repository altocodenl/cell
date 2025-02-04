// *** SETUP ***

var B = window.B;

// *** MAIN FUNCTIONS ***

var escapeForRegex = function (text) {
   var toEscape = ['-', '[', ']', '{', '}', '(', ')', '|', '+', '*', '?', '.', '/', '\\', '^', '$'];
   return text.replace (new RegExp ('[' + toEscape.join ('\\') + ']', 'g'), '\\$&');
}

var receive = function (message) {
   var parsedMessage = parse (message);

   if (parsedMessage.error) return alert (parsedMessage.error);

   var result;

   // {get: [...]}
   if (parsedMessage.get) result = get (parsedMessage.get);
   // {put: [...]}
   if (parsedMessage.put) result = put (parsedMessage.put);

   return result;
}

// It validates and it parses
var parse = function (message) {
   // Check it out, a one line lexer!
   message = message.trim ().split (/\s/);

   if (message.length === 0) return {error: 'Message is empty'};

   if (message [0] [0] !== '@') return {error: 'Call must start with "@"'};

   if (message [0] !== '@') return {error: 'Call must start with "@" and have a space after it'};

   if (message [1] === 'get') return {get: message.slice (2)};

   if (message [1] === 'put') return {put: message.slice (2)};
}

var get = function (message) {
   var dataspace = localStorage.getItem ('cell');
   if (dataspace === null) dataspace = '';

   if (message.length === 0) return dataspace;

   var matchedElements = 0;
   var matchFound = false;

   var output = [];

   dale.stop (dataspace.split ('\n'), false, function (line) {
      if (matchFound) {
         var indent = Array (message.join (' ').length + 1).fill ().map (function () {return ' '});
         if (line.match (new RegExp ('^' + indent))) output.push (line.replace (indent, ''));
         return false;
      }

      if (! matchFound) {
         line = line.trim ().split (/\s/);

         dale.stop (line, false, function (v, k) {
            if (v !== message [k]) return false;
            matchedElements++;
         });
         if (matchedElements === message.length) {
            matchFound = true;
            output.push (line.replace (new RegExp ('^' + message.join (' '), '')));
         }
      }
   });

   return output.join ('\n');
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
]);

var view = function () {
   return B.view ('dataspace', function (dataspace) {
      return ['div', [
         ['h1', 'Cell'],
         ['pre', dataspace]
      ]];
   });
}

B.call ('initialize', []);

B.mount ('body', view);
