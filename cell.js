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
   if (Type === 'function') return v.toString ();

   // Invalid values (nan, infinity, null, undefined) are returned as empty strings
   return '';
}

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
]];

// *** BASE VIEW ***

views.base = function () {
   return ['div', [
      views.css,
      views.currentPath (),
      views.cell ()
   ]];
}

// *** CELL VIEW ***

views.currentPath = function () {
   return B.view ('currentPath', function (path) {
      return ['div', [
         ['label', {
            class: 'pointer',
            onclick: B.ev ('set', 'currentPath', [])
         }, 'Current path:'],
         ['ul', dale.go (path, function (v, k) {
            return ['li', {
               class: 'pointer',
               onclick: B.ev ('set', 'currentPath', B.get ('currentPath').slice (0, k + 1))
            }, type (v) === 'integer' ? v + 1 : v];
         })],
      ]];
   });
}

views.cell = function () {
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

   // colors: blue for numbers (also in indexes), black for strings, green for hidden nested
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
