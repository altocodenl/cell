// *** SETUP ***

var B    = window.B;
var cell = window.cell;

var type = teishi.type;

// *** DATASPACE ***

B.call ('set', 'dataspace', []);

var load = function () {
   var text = localStorage.getItem ('cell');
   if (text === null) text = '';
   var paths = cell.parser (text);
   if (paths.error) alert (paths.error);
   else B.call ('set', 'dataspace', paths);
}

var save = function () {
   localStorage.setItem ('cell', cell.pathsToText (B.get ('dataspace')));
}

// *** HELPERS ***

var H = {};

H.matchVerb = function (ev, responder) {
   return B.r.compare (ev.verb, responder.verb);
}

// *** RESPONDERS ***

window.addEventListener ('hashchange', function () {
   B.call ('read', 'hash', window.location.hash);
});

B.mrespond ([
   ['read', 'hash', {id: 'read hash'}, function (x) {
      var hash = window.location.hash.replace ('#/', '');
      if (hash === '') B.call (x, 'create', 'cell');
   }],
   ['create', 'cell', function (x) {
      B.call (x, 'post', 'new', {}, {}, function (x, error, rs) {
         if (error) return alert ('Error');
         window.location.hash = '#/' + rs.body.name;
      });
   }],
   [/^(get|post)$/, [], {match: H.matchVerb}, function (x, headers, body, cb) {
      var t = teishi.time ();

      c.ajax (x.verb, x.path [0], headers, body, function (error, rs) {
         B.call (x, 'ajax ' + x.verb, x.path [0], {t: Date.now () - t, code: error ? error.status : rs.xhr.status});
         if (cb) cb (x, error, rs);
      });
   }],
   ['change', 'dataspace', function (x) {
      save ();
   }],
   ['initialize', [], function (x) {
      B.call (x, 'read', 'hash');
      load ();
      if (B.get ('dataspace').length === 0) B.call (x, 'set', 'dataspace', [
         ['foo', 'bar', 1, 'jip'],
         ['foo', 'bar', 2, 'joo'],
         ['foo', 'soda', 'wey'],
         ['something', 'else']
      ]);
   }],
   ['send', 'call', function (x, call) {
      var response = cell.receive (call);
      var dialogue = cell.receive ('@ dialogue');
      var length = 0;
      if (dialogue.length > 1) length = teishi.last (dialogue) [0];

      cell.put ([
         [1, 'dialogue', length + 1, 'from'],
         [2, 'user'],
         [3, 'dialogue', length + 1, 'message'],
         [4, call],
         [5, 'dialogue', length + 2, 'from'],
         [6, 'cell'],
         [7, 'dialogue', length + 2, 'message'],
         ...dale.go (response, function (v) {
            return [8, ...v];
         }),
      ], true);

      B.call (x, 'rem', [], 'call');
   }],
]);

// *** VIEWS ***

var views = {};

views.css = [
   ['body', {'padding-left, padding-top': 30, height: 100}],
];

views.main = function () {

   return B.view ([['dataspace'], ['call']], function (dataspace, call) {
      var dialogue = [];
      if (cell.get (B.get ('dataspace'), ['dialogue'], []).length > 1) dale.go (cell.get (B.get ('dataspace'), ['dialogue'], []), function (v) {
         if (v [1] === 'from') dialogue.push ({from: v [2], message: []});
         else teishi.last (dialogue).message.push (v.slice (2));
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

               var message = item.from === 'user' ? item.message [0] [0] : item.message;
               if (type (message) === 'string') {
                  var parsedMessage = cell.parser (message);
                  if (type (parsedMessage) === 'array') message = parsedMessage;
               }

               if (type (message) === 'array') return ['div', {class: classes}, views.datagrid (message)];
               else return ['textarea', {class: classes, readonly: true, value: message, rows: message.split ('\n').length}, message];

            }),

            // New message
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

views.datagrid = function (paths) {
   return ['table', {class: 'collapse', style: 'font-family: monospace; font-size: 16px'}, dale.go (paths, function (path, k) {
      var abridge = 0;
      if (k > 0) dale.stop (path, true, function (v2, k2) {
         if (paths [k - 1] [k2] !== v2) return true;
         abridge++;
      });
      return ['tr', [
         dale.go (path, function (element, k) {
            var abridged = k < abridge;
            return ['td', {class: 'ba pa1'}, ['p', {class: 'ma0' + (abridged ? ' silver' : '')}, element]];
         }),
      ]];
   })]
}

views.cell = function (path) {
   return B.view ('dataspace', function (dataspace) {
      var paths = dale.fil (cell.get (dataspace, path, []), undefined, function (v) {
         if (v [0] === 'dialogue') return; // Don't show the dialogue
         return v;
      });

      return ['div', [
         ['h3', 'Location: ' + (cell.pathsToText (path) || 'all')],
         views.datagrid (paths)
      ]];
   });
}

B.call ('initialize', []);

B.mount ('body', views.main);
