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

var get = function (path, context, fallback) {
   var result = cell.pathsToJS (cell.get (path, context || [], function () {return B.get ('dataspace')}));
   return (result === '' && fallback) ? fallback : result;
}

// *** RESPONDERS ***

window.addEventListener ('hashchange', function () {
   B.call ('read', 'hash', window.location.hash);
});

window.addEventListener ('resize', function () {
   B.call ('change', 'dataspace');
});

window.addEventListener ('keydown', function (ev) {
   B.call ('keydown', [], ev.keyCode);
});

B.mrespond ([

   // *** SETUP ***

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

   // *** CELL ***

   ['create', 'cell', function (x) {
      B.call (x, 'post', 'new', {}, {}, function (x, error, rs) {
         if (error) return B.call (x, 'report', 'error', error);
         window.location.hash = '#/' + rs.body.name;
         B.call (x, 'set', 'dataspace', []);
      });
   }],

   ['retrieve', 'cell', function (x) {

      var cellName = window.location.hash.replace ('#/', '');

      B.call (x, 'post', 'call/' + cellName, {}, {call: '@', mute: true}, function (x, error, rs) {
         if (error) return B.call (x, 'report', 'error', error);
         B.call (x, 'set', 'dataspace', rs.body.response);
      });
   }],

   // *** SEND DATA TO SERvER ***

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

   ['send', 'put', function (x, p, v, nonMute) {
      var call = [['@', 'put', 'p'].concat (p)].concat (dale.go (v, function (v2) {
         return ['@', 'put', 'v'].concat (v2);
      }));

      B.call (x, 'send', 'call', cell.pathsToText (call), ! nonMute);
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

   // *** MOVE AROUND ***

   ['click', 'step', function (x, path, index) {
      var cursor = get (['editor', 'cursor'], [], {});

      var selected = teishi.eq (path, cursor.path) && cursor.index === index;

      B.call (x, 'send', 'put', ['editor', 'cursor'], cell.JSToPaths ({path: path, index: index, editing: selected}));

      var cursorEl = c ('input.cursor') [0];
      if (! cursorEl) return; // Might not yet be an input, will be after the redraw
      cursorEl.focus ();
      cursorEl.setSelectionRange (cursorEl.value.length, cursorEl.value.length);
   }],

   ['redraw', [], {match: function (ev, responder) {
      return ev.verb === responder.verb;
   }}, function (x) {

      var cursor = c ('.selected') [0];
      var grid = c ('.main-datagrid') [0];
      if (! cursor || ! grid) return;

      var cursorC = cursor.getBoundingClientRect ();
      var gridC   = grid.getBoundingClientRect ();

      var x = 0, y = 0, marginX = Math.round (gridC.width / 4), marginY = Math.round (gridC.height / 4);


      if      (cursorC.bottom > gridC.bottom) y = cursorC.top - marginY; // Scroll down
      else if (cursorC.top < gridC.top)       y = cursorC.top - gridC.height + marginY; // Scroll up

      if      (cursorC.right > gridC.right)   x = cursorC.left - marginX; // Scroll right
      else if (cursorC.left < gridC.left)     x = cursorC.left - gridC.width + marginX; // Scroll left

      grid.scrollTo ({
         top:  grid.scrollTop  + y,
         left: grid.scrollLeft + x,
      });
   }],

   ['keydown', [], function (x, key) {

      // If an input/textarea is being edited that is not on the datagrid, ignore the event.
      var activeElement = document.activeElement.tagName.toLowerCase ();
      // TODO; why do I need [0] here?
      if (['input', 'textarea'].includes (activeElement) && c.get (activeElement, 'class') [0] ['class'] !== 'cursor') return;

      // If there's no cursor, there's nothing to do.
      var cursor = get (['editor', 'cursor'], [], {});

      // Two modes: 1) moving around vs 2) editing

      // MOVING AROUND
      if (! ['input', 'textarea'].includes (activeElement)) {

         var paths = dale.fil (B.get ('dataspace'), undefined, function (path) {
            if (! ['dialogue', 'editor'].includes (path [0])) return path; // Don't show the dialogue or the editor paths
         });

         var pathIndex = dale.stopNot (paths, undefined, function (path, k) {
            if (teishi.eq (path, cursor.path)) return k;
         });

         // Left
         if ([37, 66, 72].includes (key)) {
            if (cursor.index === 0) return;
            var where = dale.stopNot (dale.times (pathIndex + 1, pathIndex, -1), undefined, function (k) {
               if (! paths [k - 1] || paths [k - 1] [cursor.index - 1] !== paths [k] [cursor.index - 1]) return paths [k];
            });

            return B.call (x, 'send', 'put', ['editor', 'cursor'], cell.JSToPaths ({path: where, index: cursor.index - 1}));
         }
         // Right
         if ([39, 76, 87].includes (key)) {
            if (cursor.index + 1 < cursor.path.length) return B.call (x, 'send', 'put', ['editor', 'cursor', 'index'], [cursor.index + 1]);
         }

         // Up, down
         if ([38, 75, 40, 74].includes (key)) {
            var up = [38, 75].includes (key);
            var where = dale.stopNot (dale.times (up ? pathIndex : paths.length - 1 - pathIndex, up ? pathIndex - 1 : pathIndex + 1, up ? -1 : 1), undefined, function (k) {
               if (paths [k] [cursor.index] === cursor.path [cursor.index]) return;
               if (! up) return paths [k];
               if (! paths [k - 1] || paths [k - 1] [cursor.index] !== paths [k] [cursor.index]) return paths [k];
            });

            if (where) return B.call (x, 'send', 'put', ['editor', 'cursor'], cell.JSToPaths ({path: where, index: Math.min (cursor.index, where.length - 1)}));
         }

         // Enter
         if (key === 13) return B.call (x, 'click', 'step', cursor.path, cursor.index);

         // Space: fold or unfold
         if (key === 32) {
            var fold   = get (['editor', 'fold'], [], []);

            var folded = dale.stopNot (fold, false, function (foldedPrefix) {
               if (teishi.eq (cursor.path.slice (0, foldedPrefix.length), foldedPrefix)) return foldedPrefix;
            });

            if (folded) fold = dale.fil (fold, undefined, function (foldedPrefix) {
               if (! teishi.eq (foldedPrefix, folded)) return foldedPrefix;
            });
            else fold.push (cursor.path.slice (0, cursor.index));

            return B.call (x, 'send', 'put', ['editor', 'fold'], fold.length === 0 ? [['']] : cell.JSToPaths (fold));

         }

         return;
      }

      // EDITING

      // ESC
      if (key === 27) return B.call (x, 'send', 'put', ['editor', 'cursor', 'editing'], [[0]]);
      // Enter
      if (key === 13) {
         var value = cell.toNumberIfNumber (document.activeElement.value);

         if (value === cursor.path [cursor.index]) return B.call (x, 'send', 'put', ['editor', 'cursor', 'editing'], [[0]]);

         var prefix = cursor.path.slice (0, cursor.index);
         var relevantPaths = dale.fil (B.get ('dataspace'), undefined, function (path) {
            if (path.length < prefix.length) return;
            if (! teishi.eq (path.slice (0, prefix.length), prefix)) return;
            if (cursor.path [cursor.index] !== path [cursor.index]) return path.slice (cursor.index);
            return [value].concat (path.slice (cursor.index + 1));
         });

         B.call (x, 'send', 'put', prefix, relevantPaths);
      }
      // Space: add step laterally
      if (key === 32) {

         var value = cell.toNumberIfNumber (document.activeElement.value);

         var prefix = cursor.path.slice (0, cursor.index);
         var relevantPaths = dale.fil (B.get ('dataspace'), undefined, function (path) {
            if (path.length < prefix.length) return;
            if (! teishi.eq (path.slice (0, prefix.length), prefix)) return;
            if (cursor.path [cursor.index] !== path [cursor.index]) return path.slice (cursor.index);
            return [value, ''].concat (path.slice (cursor.index + 1));
         });

         B.call (x, 'send', 'put', prefix, relevantPaths);
         // var path = cursor.path.splice (cursor.index + 1, 0, '');
         // B.call (x, 'set', 'cursor', {index: cursor.index, path: path, editing: true});
      }
   }],

   ['search', [], function (x, term) {
      B.call (x, 'send', 'put', ['editor', 'search'], [term]);
   }],

]);

// *** VIEWS ***

var views = {};

views.css = [
   ['body', {'padding-left, padding-top': 30, height: 100}],
];

views.main = function () {

   return B.view ([['dataspace'], ['call']], function (dataspace, call) {
      var dialogue = get (['dialogue'], [], []);

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
            views.cell (dataspace),
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
            B.view ('loading', function (loading) {
               return ['div', {class: 'flex flex-column w-100'}, [
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
               ]];
            }),
         ]],
      ]];
   });
}

views.datagrid = function (paths, main) {

   var search = get (['editor', 'search'], [], undefined);
   var fold   = get (['editor', 'fold'], [], []);
   var cursor = get (['editor', 'cursor'], [], {});

   return ['div', {
      class: 'w-100 overflow-x-auto code ' + (main ? 'main-datagrid' : ''),
      style: style ({
         'max-height': Math.round (window.innerHeight * 0.8) + 'px',
         'white-space': 'nowrap',
      })
   }, dale.go (paths, function (path, k) {

      var folded = dale.stopNot (fold, undefined, function (foldedPrefix) {
         if (! teishi.eq (path.slice (0, foldedPrefix.length), foldedPrefix)) return;
         if (! paths [k - 1] || ! teishi.eq (paths [k - 1].slice (0, foldedPrefix.length), foldedPrefix)) return foldedPrefix; // First path with this prefix, show the ...
         return true;
      });
      if (folded === true) return;

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

         if (folded && k + 1 > folded.length) return;

         var searchMatch = search !== undefined && search.length > 1 && (element + '').toLowerCase ().match (search.toLowerCase ());

         var abridged = k < abridge;

         if (element === '') element = '""';

         var f1rst = k === 0;

         var selected = teishi.eq (path, cursor.path) && cursor.index === k;
         var dimly = teishi.eq (path.slice (0, cursor.index + 1), cursor.path.slice (0, cursor.index + 1)) && cursor.index <= k && ! selected;

         return ['div', {
            class: 'dib ws-normal bt bl br3 pa2 mw6 ws-normal overflow-auto' + (selected ? ' selected bg-blue yellow b ' : '') + (dimly ? ' bg-green' : '') + (abridged ? ' o-20' : '') + ' pointer' + (searchMatch ? ' b underline' : ''),
            style: style ({
               'height': height
            }),
            onclick: B.ev ('click', 'step', path, k),
         }, (function () {

            if (! selected) return element;

            if (cursor.editing) return ['input', {
               class: 'cursor',
               value: element,
            }];

            if (folded) return element + ' ...';

            return element;

         }) ()];
      })];
   })];
}

views.cell = function (dataspace) {

   var search = get (['editor', 'search'], [], undefined);

   var paths = dale.fil (dataspace, undefined, function (path) {
      if (! ['dialogue', 'editor'].includes (path [0])) return path; // Don't show the dialogue or the editor paths
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

      /*
      ['input', {
         class: 'code w-50 pa3 ba br3 mb3 db center',
         onchange: B.ev ('search', [], {raw: 'this.value'}),
         oninput: B.ev ('search', [], {raw: 'this.value'}),
         value: search || '',
      }],
      */
      views.datagrid (paths, 'main')
   ]];
}

B.call ('initialize', []);

B.mount ('body', views.main);
