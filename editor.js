// *** SETUP ***

var B    = window.B;
var cell = window.cell;

B.prod = true;

B.internal.timeout = 500;

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

window.addEventListener ('resize', function () {
   B.call ('change', 'dataspace');
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
   ['expand', 'path', function (x, prefix) {
      var expanded = cell.pathsToJS (cell.get (['expanded'], [], function () {return B.get ('dataspace') || []}));
      if (! expanded) expanded = [];
      expanded.push (prefix);

      B.call (x, 'send', 'call', cell.pathsToText (cell.JSToPaths ({'@': {put: {p: 'expanded', v: expanded}}})), true);
   }],
   ['fold', 'path', function (x, prefix) {
      var expanded = cell.pathsToJS (cell.get (['expanded'], [], function () {return B.get ('dataspace') || []}));
      expanded = dale.fil (expanded, prefix, function (v) {return v});
      if (expanded.length === 0) expanded = '';

      B.call (x, 'send', 'call', cell.pathsToText (cell.JSToPaths ({'@': {put: {p: 'expanded', v: expanded}}})), true);
   }],
   ['search', [], function (x, term) {
      B.call (x, 'send', 'call', cell.pathsToText (cell.JSToPaths ({'@': {put: {p: 'search', v: term}}})), true);
   }],
   ['send', 'call', function (x, call, mute) {

      if (call.trim ().length === 0) return;

      var cellName = window.location.hash.replace ('#/', '');

      B.call (x, 'set', 'loading', true);

      B.call (x, 'post', 'call/' + cellName, {}, {call: call, mute: mute}, function (x, error, rs) {
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
            views.cell (),
         ]],
         ['div', {
            class: 'fl w-40 pa2 bg-black overflow-auto',
            style: style ({'max-height': Math.round (window.innerHeight * 0.9) + 'px'}),
         }, [

            dale.go (dialogue, function (entry) {
               if (! entry) return;

               var classes = function (who) {
                  var output = 'code w-70 pa2 ba br3 mb2';
                  if (who === 'user') output += ' fr bg-white';
                  else                output += ' fl bg-dark-green near-white';
                  return output;
               }

               var parseIfValid = function (v) {
                  var parsed = cell.textToPaths (v);
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

views.datagrid = function (paths, fold) {

   var search = cell.pathsToJS (cell.get (['search'], [], function () {return B.get ('dataspace')}));
   if (search === '') search = undefined;

   if (fold && search === undefined) {

      var pathsPerPrefix = {};
      dale.go (paths, function (path) {
         if (! pathsPerPrefix [path [0]]) pathsPerPrefix [path [0]] = 0;
         pathsPerPrefix [path [0]]++;
      });
      var pathsPushedPerPrefix = dale.obj (pathsPerPrefix, function (v, k) {
         return [k, 0];
      });

      var foldedPaths = [];
      var maxWhenFolded = 3;

      var expanded = cell.pathsToJS (cell.get (['expanded'], [], function () {return B.get ('dataspace')})) || [];
      dale.go (paths, function (path) {

         if (expanded.includes (path [0])) {
            foldedPaths.push (path);
            pathsPerPrefix [path [0]]--;
            // If this is the last element of an unfolded path, put an object to fold it.
            if (pathsPerPrefix [path [0]] === 0) foldedPaths.push ({prefix: path [0], hide: true});
         }
         else {
            if (pathsPushedPerPrefix [path [0]] >= maxWhenFolded) return;

            foldedPaths.push (path);
            pathsPushedPerPrefix [path [0]]++;
            if (pathsPushedPerPrefix [path [0]] === maxWhenFolded && pathsPerPrefix [path [0]] > pathsPushedPerPrefix [path [0]]) {
               foldedPaths.push ({prefix: path [0], entries: pathsPerPrefix [path [0]]});
            }
         }
      });

      paths = foldedPaths;
   }
   // We only apply the search to the main, which uses folding
   if (fold && search !== undefined) {
      paths = dale.fil (paths, undefined, function (path) {
         if (JSON.stringify (path).toLowerCase ().match (search)) return path;
      });
   }

   return ['div', {
      class: 'w-100 overflow-x-auto code',
      style: style ({
         'max-height': Math.round (window.innerHeight * 0.8) + 'px',
         'white-space': 'nowrap',
      })
   }, dale.go (paths, function (path, k) {

      if (type (path) === 'object') {
         if (search !== undefined) return;
         if (path.entries) return ['div', {
            class: 'dib ws-normal ml3 mb3 bt bl br3 pa2 mw6 ws-normal light-blue pointer',
            onclick: B.ev ('expand', 'path', path.prefix)
         }, ['Expand all ', path.entries, ' paths...']];

         if (path.hide) return ['div', {
            class: 'dib ws-normal ml3 mb3 bt bl br3 pa2 mw6 ws-normal light-blue pointer',
            onclick: B.ev ('fold', 'path', path.prefix)
         }, ['Fold path']];
      }

      var abridge = 0;
      if (k > 0) dale.stop (path, true, function (v2, k2) {
         if (paths [k - 1] [k2] !== v2) return true;
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

         var searchMatch = search !== undefined && search.length > 1 && (element + '').toLowerCase ().match (search.toLowerCase ());

         var abridged = k < abridge;

         if (element === '') element = '""';

         var f1rst = k === 0;

         return ['div', {
            class: 'dib ws-normal bt bl br3 pa2 mw6 ws-normal overflow-auto' + (abridged ? ' o-20' : '') + (f1rst ? ' pointer' : '') + (searchMatch ? ' b underline' : ''),
            style: style ({
               'height': height
            }),
            onclick: f1rst ? B.ev ('fold', 'path', element) : '',
         }, element];
      })];
   })];
}

views.cell = function () {
   return B.view ('dataspace', function (dataspace) {

      var search = '';

      var paths = dale.fil (cell.get ([], [], function () {return dataspace}), undefined, function (v) {
         if (v [0] === 'dialogue') return; // Don't show the dialogue
         if (v [0] === 'expanded') return; // Don't show expanded
         if (v [0] === 'search') {
            search = v [1];
            return; // Don't show search, but set it to the local variable.
         }
         return v;
      });

      return ['div', {class: 'pa3 flex flex-column items-center'}, [

         ['div', {class: 'absolute top-0 left-0 ml2 mt2', style: 'width: 2.5rem; height: 2.5rem;'}, [
            ['div', {class: 'relative w-100 h-100'}, [
               ['div', {class: 'absolute top-0 left-0 w-100 h-100 flex items-center justify-center'}, [
                  ['span', {
                     class: 'f-headline fw4 black',
                     style: 'font-family: sans-serif;',
                  }, 'c']
               ]],
               ['div', {class: 'absolute top-0 left-0 w-100 h-100 flex items-center justify-center'}, [
                  ['span', {
                     class: 'f1 fw4 black',
                     style: 'font-family: sans-serif;',
                  }, 'ə']
               ]]
            ]]
         ]],
         ['input', {
            class: 'code w-50 pa3 ba br3 mb3 db center',
            onchange: B.ev ('search', [], {raw: 'this.value'}),
            oninput: B.ev ('search', [], {raw: 'this.value'}),
            value: search || '',
         }],
         views.datagrid (paths, true)
      ]];
   });
}

B.call ('initialize', []);

B.mount ('body', views.main);
