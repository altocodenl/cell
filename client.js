// *** SETUP ***

var B    = window.B;
var cell = window.cell;

var type = teishi.type;

var style = lith.css.style;

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
   ['expand', 'prefix', function (x, prefix) {
      var expanded = cell.pathsToJS (cell.get (['expanded'], [], function () {return B.get ('dataspace') || []}));
      if (teishi.eq (expanded, {})) expanded = [];
      expanded.push (prefix);

      B.call (x, 'send', 'call', cell.pathsToText (cell.JSToPaths ({'@': {put: {p: 'expanded', v: expanded}}})));
   }],
   ['send', 'call', function (x, call) {

      if (call.trim ().length === 0) return;

      var cellName = window.location.hash.replace ('#/', '');

      B.call (x, 'set', 'loading', true);

      B.call (x, 'post', 'call/' + cellName, {}, {call: call}, function (x, error, rs) {
         B.call (x, 'set', 'loading', false);

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

      B.call (x, 'set', 'loading', true);
      B.call ('post', 'file/' + cellName, {}, {file: file, name: 'clipboard-' + (Math.random () + '').slice (3, 6), mime: 'text/plain'}, function (x, error, rs) {
         B.call (x, 'set', 'loading', false);
         if (error) return B.call (x, 'report', 'error', error);
         B.call (x, 'retrieve', 'cell');
      });
   }],
   ['upload', 'files', function (x) {
      var input = c ('#file-upload');
      alert ('here');
      dale.go (input.files, function (file) {
         B.call (x, 'upload', 'file', file);
      });
   }],
   ['upload', 'file', function (x, file) {
      var reader = new FileReader ();

      reader.onloadend = function () {
         B.call (x, 'set', 'loading', true);
         // We send the file contents as base64
         var cellName = window.location.hash.replace ('#/', '');
         B.call ('post', 'file/' + cellName, {}, {file: reader.result, name: file.name, mime: file.type}, function (x, error, rs) {
            B.call (x, 'set', 'loading', false);
            if (error) return B.call (x, 'report', 'error', error);
            B.call (x, 'retrieve', 'cell');
         });
      };

      reader.onerror = function (error) {
         B.call (x, 'report', 'error', error);
      }

      reader.readAsDataURL (file);
   }],
]);

// *** VIEWS ***

var views = {};

views.css = [
   ['body', {'padding-left, padding-top': 30, height: 100}],
];

views.main = function () {

   return B.view ([['dataspace'], ['call'], ['loading']], function (dataspace, call, loading) {
      var dialogue = cell.pathsToJS (cell.get (['dialogue'], [], function () {return B.get ('dataspace') || []}));

      var spinny = ['span', {style: style ({
         border: '2px solid rgba(0,0,0,0.1)',
         'border-left-color': '#fff',
         'border-radius': '9999px',
         width: '1rem',
         height: '1rem',
         animation: 'spin 0.6s linear infinite',
         display: 'inline-block',
         'margin-left': '0.5rem'
      })}];

      call = call || '';
      return ['div', [
         ['style', views.css],
         ['style', '@keyframes spin {from { transform: rotate(0deg); } to   { transform: rotate(360deg); }}'],
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
            ['div', {class: 'flex flex-column w-100'}, [
               ['button', {
                  class: 'w-100 pv2 ph3 br2 bg-blue white hover-bg-dark-blue pointer shadow-1',
                  onclick: loading ? '' : B.ev ('send', 'call', call)
               }, loading ? spinny : 'Submit'],
               ['button', {
                  class: 'w-100 pv2 ph3 br2 bg-light-gray black hover-bg-moon-gray pointer shadow-1 mt2',
                  onclick: loading ? '' : B.ev ('upload', 'clipboard')
               }, loading ? spinny : 'Upload from clipboard'],
               ['input', {
                  class: 'w-100 pv2 ph3 br2 bg-light-gray black hover-bg-moon-gray pointer shadow-1 mt2',
                  id: 'file-upload', type: 'file', multiple: true,
               }],
               ['button', {
                  onclick: loading ? '' : B.ev ('upload', 'files')
               }, loading ? spinny : 'Upload files'],
            ]]
         ]],
      ]];
   });
}

views.datagrid = function (paths, expanded) {

   if (type (expanded) !== 'array') expanded = [];

   var leftmost = {};
   dale.go (paths, function (path) {
      if (! leftmost [path [0]]) leftmost [path [0]] = 0;
      leftmost [path [0]]++;
   });

   var foldedPaths = [];

   dale.go (paths, function (path) {
      if (expanded.includes (path [0])) return foldedPaths.push (path);

      if (! leftmost [path [0]]) return;

      foldedPaths.push (path);
      foldedPaths.push ({prefix: path [0], entries: leftmost [path [0]]});
      delete leftmost [path [0]];
   });

   return ['div', {
      class: 'w-100 overflow-x-auto code',
      style: style ({
         'max-height': Math.round (window.innerHeight * 0.8) + 'px',
         'white-space': 'nowrap',
      })
   }, dale.go (foldedPaths, function (path, k) {

      if (type (path) === 'object') return ['div', {
         class: 'dib ws-normal ml3 mb3 bt bl br3 pa2 mw6 ws-normal light-blue pointer',
         onclick: B.ev ('expand', 'prefix', path.prefix)
      }, ['See all ', path.entries, ' paths...']];

      var abridge = 0;
      if (k > 0) dale.stop (path, true, function (v2, k2) {
         if (foldedPaths [k - 1] [k2] !== v2) return true;
         abridge++;
      });

      var height = '';
      var maxLength = Math.max.apply (null, dale.go (path, function (element) {
         return (element + '').length;
      }));
      if (maxLength > 50) height = (Math.min (9, Math.floor (maxLength / 50)) + 2) + 'rem';

      return ['div', {
         class: 'cf',
         style: style ({
            'white-space': 'nowrap',
         }),
      }, dale.go (path, function (element, k) {
         var abridged = k < abridge;

         if (element === '') element = '""';

         return ['div', {
            class: 'dib ws-normal bt bl br3 pa2 mw6 ws-normal overflow-auto' + (abridged ? ' o-20' : ''),
            style: style ({
               'height': height
            })
         }, element];
      })];
   })];
}

views.cell = function (path) {
   return B.view ('dataspace', function (dataspace) {

      var expanded = cell.pathsToJS (cell.get (path, ['expanded'], function () {return dataspace}));

      var paths = dale.fil (cell.get (path, [], function () {return dataspace}), undefined, function (v) {
         if (v [0] === 'dialogue') return; // Don't show the dialogue
         return v;
      });

      return ['div', [
         ['h3', 'Location: ' + (cell.pathsToText (path) || 'all')],
         views.datagrid (paths, expanded)
      ]];
   });
}

B.call ('initialize', []);

B.mount ('body', views.main);
