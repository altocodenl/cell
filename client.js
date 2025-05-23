// *** SETUP ***

var B    = window.B;
var cell = window.cell;

var type = teishi.type;

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
   ['initialize', [], function (x) {
      B.call (x, 'read', 'hash');
   }],
   ['read', 'hash', {id: 'read hash'}, function (x) {
      var hash = window.location.hash.replace ('#/', '');
      if (hash === '') B.call (x, 'create', 'cell');
      else             B.call (x, 'retrieve', 'cell');
   }],
   ['report', 'error', function (x, error) {
      alert (error.responseText);
   }],
   [/^(get|post)$/, [], {match: H.matchVerb}, function (x, headers, body, cb) {
      var t = teishi.time ();

      c.ajax (x.verb, x.path [0], headers, body, function (error, rs) {
         B.call (x, 'ajax ' + x.verb, x.path [0], {t: Date.now () - t, code: error ? error.status : rs.xhr.status});
         if (cb) cb (x, error, rs);
      });
   }],
   ['create', 'cell', function (x) {
      B.call (x, 'post', 'new', {}, {}, function (x, error, rs) {
         if (error) return B.call (x, 'report', 'error', error);
         window.location.hash = '#/' + rs.body.name;
         B.call (x, 'set', 'dataspace', []);
      });
   }],
   ['send', 'call', function (x, call) {

      if (call.trim ().length === 0) return;

      var cellName = window.location.hash.replace ('#/', '');

      B.call (x, 'post', 'call/' + cellName, {}, {call: call}, function (x, error, rs) {
         if (error) return B.call (x, 'report', 'error', error);

         B.call (x, 'retrieve', 'cell');
         B.call (x, 'rem', [], 'call');
      });

   }],
   ['retrieve', 'cell', function (x) {

      var cellName = window.location.hash.replace ('#/', '');

      B.call (x, 'post', 'call/' + cellName, {}, {call: '@', mute: true}, function (x, error, rs) {
         if (error) return B.call (x, 'report', 'error', error);
         B.call (x, 'set', 'dataspace', rs.body.response);
      });
   }],
   ['upload', 'clipboard', async function (x) {
      var file = await navigator.clipboard.readText ();

      var cellName = window.location.hash.replace ('#/', '');

      B.call ('post', 'file/' + cellName, {}, {file: file, name: 'clipboard-' + (Math.random () + '').slice (3, 6), mime: 'text/plain'}, function (x, error, rs) {
         if (error) return B.call (x, 'report', 'error', error);
         B.call (x, 'retrieve', 'cell');
      });
   }],
]);

// *** VIEWS ***

var views = {};

views.css = [
   ['body', {'padding-left, padding-top': 30, height: 100}],
];

views.main = function () {

   return B.view ([['dataspace'], ['call']], function (dataspace, call) {
      var dialogue = cell.pathsToJS (cell.get (['dialogue'], [], function () {return B.get ('dataspace') || []}));

      call = call || '';
      return ['div', [
         ['style', views.css],
         ['div', {class: 'main fl w-60 bg-dark-green near-white pa2'}, [
            views.cell ([]),
         ]],
         ['div', {class: 'dialogue fl w-40 pa2 bg-black'}, [

            dale.go (dialogue, function (entry) {

               var classes = function (who) {
                  var output = 'code w-70 pa2 ba br3 mb2';
                  if (who === 'user') output += ' fr bg-white';
                  else                output += ' fl bg-dark-green near-white';
                  return output;
               }

               var parseIfValid = function (v) {
                  var parsed = cell.parser (v);
                  return type (parsed) === 'array' ? parsed : v;
               }

               var call = parseIfValid (entry ['@']);

               return [
                  type (call) === 'array' ? ['div', {class: classes (entry.from)}, views.datagrid (call)] : ['textarea', {class: classes, readonly: true, value: call, rows: call.split ('\n').length}, call],
                  ['div', {class: classes (entry.to)}, entry ['='] !== undefined ? views.datagrid (cell.JSToPaths (entry ['='])) : views.datagrid ([['""']])],
               ];
            }),

            // New message
            ['textarea', {
               class: 'code w-70 pa2 ba br3 mb2 fr',
               onchange: B.ev ('set', 'call'),
               oninput: B.ev ('set', 'call'),
               autofocus: true,
               value: call,
            }],
            ['button', {class: 'w-100', onclick: B.ev ('send', 'call', call)}, 'Submit'],
            ['button', {onclick: B.ev ('upload', 'clipboard')}, 'Upload from clipboard'],
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
      var paths = dale.fil (cell.get (path, [], function () {return dataspace}), undefined, function (v) {
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
