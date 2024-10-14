// *** SETUP ***

var dale = window.dale, teishi = window.teishi, lith = window.lith, c = window.c, B = window.B;
var type = teishi.type, clog = teishi.clog, eq = teishi.eq, last = teishi.last, inc = teishi.inc, media = lith.css.media, style = lith.css.style;

// *** HELPERS ***

var isNumber = function (v) {
   return inc (['integer', 'float'], type (v));
}

var toFourData = function (v) {
   var Type = type (v);
   if (inc (['integer', 'float', 'string'], Type)) return v;
   if (Type === 'array') return dale.go (v, toFourData);
   if (Type === 'object') return dale.obj (v, function (v, k) {
      return [k, toFourData (v)];
   });
   if (Type === 'boolean') return v ? 1 : 0;
   if (Type === 'date') return v.getTime ();
   if (Type === 'regex') return v.toString ();
   if (Type === 'function') return v.toString ().slice (0, 1000);

   // Invalid values (nan, infinity, null, undefined) are returned as empty strings
   return '';
}

// data is fourdata
// stringify: number-like texts (either values or keys in objects), values with spaces or values with double quotes, or empty strings
// increment list keys by 1
// sort object keys alphabetically
// returns all paths with no abbreviations
var pather = function (data, query, path, output) {

   data = toFourData (data);

   var text = function (t) {
      return (t.length === 0 || t.match (/[\s"]/) || t.match (/^-?\d/)) ? JSON.stringify (t) : t;
   }

   if (! output) output = [];
   if (! path) path = [];

   if (teishi.simple (data)) {
      if (type (data) === 'string') output.push ([...path, text (data)]);
      else output.push ([...path, data + '']);
   }
   else {
      if (query !== undefined) {
         if (! JSON.stringify (data).match (query + '')) return;
      }
      if (type (data) === 'object') data = dale.obj (dale.keys (data).sort (), function (k) {
         return [k, data [k]];
      });
      dale.go (data, function (v, k) {
         if (type (data) === 'object') k = text (k);
         else k = k + 1;
         pather (v, query, [...path, k + ''], output);
      });
   }
   return output;
}

// only print nonrepeated
var apather = function (data, query) {
   var lastPrinted = [];
   var output = [];
   dale.go (pather (data, query), function (path) {
      // Chop off extra length in lastPrinted
      lastPrinted = lastPrinted.slice (0, path.length);

      var toPrint = [];
      dale.go (path, function (v, k) {
         if (lastPrinted [k] === v) return toPrint [k] = dale.go (dale.times (v.length), function () {return ' '}).join ('');
         lastPrinted [k] = v;
         toPrint [k] = v;
      });
      output.push (toPrint.join (' '));
      //console.log (toPrint.join (' '));
   });
   return output;
}

window.apather = apather;

// *** LISTENERS ***

B.mrespond ([

   // *** GENERAL LISTENERS ***

   ['initialize', [], {burn: true}, function (x) {
      B.call (x, 'load', []);
      B.mount ('body', views.base);
   }],

   // *** PERSISTENCE ***

   ['load', [], function (x) {
      B.call (x, 'set', 'data', teishi.parse (localStorage.getItem ('cell')) || {});
   }],

   ['save', [], function (x) {
      localStorage.setItem ('cell', JSON.stringify (B.get ('data')));
   }],

   ['change', 'data', {match: B.changeResponder}, function (x) {
      B.call (x, 'save', []);
   }],

   ['reset', [], function (x) {
      B.call (x, 'set', 'data', {});
   }],

   ['call', [], function (x) {
      B.call.apply (teishi.copy (arguments));
   }],
]);

// *** VIEWS ***

var views = {};

// *** CSS ***

views.css = ['style', [
   ['body', {
      'font-size': '16px',
   }],
   ['table', {
      width: 1,
      'border-collapse': 'collapse',
      'font-family': 'monospace',
   }],
   ['th, td', {
      'padding': '8px 12px',
      'border': '1px solid #ddd',
      'text-align': 'left'
   }],
   ['th', {
      'font-weight': 'bold',
      'background-color': '#f2f2f2',
   }],
   ['tr:nth-child(even)', {
      'background-color': '#f9f9f9',
   }],
   ['tr:hover', {
      'background-color': '#f1f1f1'
   }],
   ['.number', {
      color: 'dodgerblue'
   }],
   ['.pointer', {
      cursor: 'pointer'
   }],
   ['textarea.output', {
     width: '90vw',
     height: '90vh',
     'background-color': '#1e1e1e',
     color: '#ffffff',
     border: 'none',
     padding: 10,
     'font-family': 'monospace',
     reisze: 'none'
   }],
]];

// *** BASE VIEW ***

views.base = function () {
   return ['div', [
      views.css,
      views.cell (),
      views.query ()
   ]];
}

// *** CELL VIEW ***

views.cell = function () {
   return B.view ([['data'], ['query']], function (data, query) {
      clog (query);
      return ['textarea', {class: 'output'}, apather (data, query).join ('\n')];
   });
}

views.query = function () {
   return B.view ('query', function (query) {
      if (query === undefined) query = '';
      return ['input', {
         oninput: B.ev ('set', 'query'),
         onchange: B.ev ('set', 'query'),
         value: query
      }];
   });
}

views.cellTable = function () {
   var alwaysRight = false;

   // data is fourdata
   var cell = function (data, path, rightOrDown) {

      var Type = type (data);
      if (teishi.inc (['integer', 'float'], Type)) return ['span', {class: 'number'}, data];
      if (Type === 'string') return ['span', {class: 'text'}, data];
      var columns = dale.keys (data);
      if (rightOrDown === 'right') return ['table', [
         ['tr', dale.go (dale.keys (data), function (key) {
            return ['th', {
               class: 'pointer',
               onclick: B.ev ('set', 'currentPath', [...path, key]),
            }, cell (Type === 'array' ? key + 1 : key, [...path, key], alwaysRight ? 'right' : 'down')];
         })],
         ['tr', dale.go (data, function (value, key) {
            return ['td', cell (value, [...path, key], alwaysRight ? 'right' : 'down')];
         })],
      ]];
      if (rightOrDown === 'down') return ['table', dale.go (data, function (value, key) {
         return ['tr', [
            ['th', {
               class: 'pointer',
               onclick: B.ev ('set', 'currentPath', [...path, key]),
            }, cell (Type === 'array' ? key + 1 : key, [...path, key], 'right')],
            ['td', cell (value, [...path, key], 'right')],
         ]];
      })];
   }

   return B.view ([['data'], ['currentPath']], function (data, currentPath) {
      currentPath = currentPath || [];
      var data = B.get (['data', ...currentPath]);
      return cell (data, [], 'right');
   });
}

/*
   return B.view ([['data'], ['state', 'invalidTextarea']], function (data, invalid) {
      return ['div', [
         ['div', {class: 'cells'}, makeCell (data)],
         ['br'], ['br'],
         ['textarea', {
            style: invalid ? style ({'background-color': 'palevioletred'}) : '',
            rows: 30,
            cols: 100,
            oninput:  B.ev ('update', 'textarea', {raw: 'this.value'}),
            onchange: B.ev ('update', 'textarea', {raw: 'this.value'})
         }, JSON.stringify (data, null, '   ')]
      ]];
   });
}
*/

B.call ('initialize', []);
