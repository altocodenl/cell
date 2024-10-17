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
      var line = [...path, type (data) === 'string' ? text (data) : data + ''];
      if (query !== undefined) {
         if (! JSON.stringify (line).match (new RegExp (query, 'i'))) return;
      }
      output.push (line);
   }
   else {
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
var apather = function (data, dotMode, query) {
   var lastPrinted = [];
   var output = [];
   dale.go (pather (data, query), function (path) {
      // Chop off extra length in lastPrinted
      lastPrinted = lastPrinted.slice (0, path.length);

      var toPrint = [];
      dale.go (path, function (v, k) {
         if (lastPrinted [k] === v) return toPrint [k] = dale.go (dale.times (v.length), function () {return ' '}).join ('');
         lastPrinted [k] = v;
         if (! dotMode) toPrint [k] = v;
         else {
            toPrint [k] = v.match (/^\d+$/) && k + 1 < path.length ? '.' : v;
         }
         lastPrinted = lastPrinted.slice (0, k + 1); // Reprint things from the first difference.
      });
      output.push (toPrint.join (' '));
   });
   return output;
}

// *** LISTENERS ***

B.mrespond ([

   // *** GENERAL LISTENERS ***

   ['initialize', [], {burn: true}, function (x) {
      B.call (x, 'load', []);
      B.call (x, 'set', 'dotMode', true);
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

   ['input', 'data', function (x, data) {
      window.che = eval (data);
      // eval is necessary if we're pasting JS literals that are not JSON
      B.call ('set', 'data', teishi.parse (data) || eval (data));
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
   ['.left', {
      float: 'left',
      'margin-left': 30,
      width: '40vw',
   }],
   ['textarea.output', {
      width: '98vw',
      'white-space': 'nowrap',
      height: '80vh',
      'background-color': '#1e1e1e',
      color: '#ffffff',
      border: 'none',
      padding: 10,
      'font-family': 'monospace',
      resize: 'none'
   }],
]];

// *** BASE VIEW ***

views.base = function () {
   return ['div', [
      views.css,
      views.cell (),
      views.input (),
      views.query (),
   ]];
}

// *** VIEWS ***

views.cell = function () {
   return B.view ([['data'], ['dotMode'], ['query']], function (data, dotMode, query) {
      var value = apather (data, dotMode, query).join ('\n');
      return ['div', [
         ['textarea', {
            class: 'output',
            value: value
         }, value]
      ]];
   });
}

views.query = function () {
   return B.view ([['query'], ['dotMode']], function (query, dotMode) {
      if (query === undefined) query = '';
      return ['div', {class: 'left'}, [
         ['h3', 'Query'],
         ['textarea', {
            oninput: B.ev ('set', 'query'),
            onchange: B.ev ('set', 'query'),
            value: query
         }],
         ['input', {
            type: 'checkbox',
            checked: 0,
            onclick: B.ev ('set', 'dotMode', ! dotMode)
         }],
         ['label', ' dot mode']
      ]];
   });
}

views.input = function () {
   return B.view ('rawData', function (rawData) {
      return ['div', {class: 'left'}, [
         ['h3', 'Input'],
         ['textarea', {
            onchange: B.ev ('input', 'data'),
         }]
      ]];
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

// *** INITIALIZATION ***

B.call ('initialize', []);
