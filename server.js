// *** SETUP ***

var CONFIG = require ('./config.js');
var SECRET = require ('./secret.js');

var fs   = require ('fs');
var Path = require ('path');

var dale   = require ('dale');
var teishi = require ('teishi');
var lith   = require ('lith');
var cicek  = require ('cicek');
var hitit  = require ('hitit');

var cell   = require ('./cell.js');

var clog = console.log;

var type = teishi.type, eq = teishi.eq, last = teishi.last, inc = teishi.inc, reply = cicek.reply;

var stop = function (rs, rules) {
   return teishi.stop (rules, function (error) {
      reply (rs, 400, {error: error});
   }, true);
}


// *** PARSING LIBRARIES ***

var csv = require ('csv-parse/sync');

// *** HELPERS ***

var httpCall = function (options, cb) {
   options.apres = function (state, options, rdata) {
      cb (null, rdata);
   }
   hitit.one ({}, options, function (error) {
      if (error) cb (error);
   });
}

// *** LLM ***

var LLM = function (model, question, cb) {
   // Assume all models are OpenAI

   httpCall ({
      https: true,
      host: 'api.openai.com',
      method: 'post',
      path: 'v1/responses',
      headers: {authorization: 'Bearer ' + SECRET.openai},
      body: {model: model, temperature: 1, input: question.join ('\n')}
   }, function (error, rs) {
      if (error) return cb (error);
      cb (null, rs.body.output [0].content [0].text);
   });
}

// *** ROUTES ***

var routes = [

   // *** STATIC ***

   ['get', '/', reply, lith.g ([
      ['!DOCTYPE HTML'],
      ['html', [
         ['head', [
            ['meta', {name: 'viewport', content: 'width=device-width,initial-scale=1'}],
            ['meta', {charset: 'utf-8'}],
            ['title', 'cell'],
            ['link', {rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css'}],
            ['link', {rel: 'stylesheet', href: 'https://unpkg.com/tachyons@4.12.0/css/tachyons.min.css'}],
         ]],
         ['body', [
            ['script', {src: 'https://cdn.jsdelivr.net/gh/fpereiro/gotob@434aa5a532fa0f9012743e935c4cd18eb5b3b3c5/gotoB.min.js'}],
            dale.go (['cell.js', 'editor.js'], function (v) {
               return ['script', {src: v}];
            }),
         ]]
      ]]
   ])],
   ['get', ['cell.js', 'editor.js'], cicek.file],

   // *** PROJECTS ***

   ['post', 'new', function (rq, rs) {

      var makeName = function () {
         var nouns = ['apple', 'car', 'house', 'dog', 'book', 'tree', 'river', 'chair', 'city', 'garden', 'bird', 'phone', 'table', 'computer', 'mountain', 'ocean', 'school', 'friend', 'cat', 'window'];

         var name = [];
         while (name.length < 3) {
            var nextNoun = nouns [Math.round (Math.random () * nouns.length - 1)];
            if (! teishi.inc (name, nextNoun)) name.push (nextNoun);
         }
         return name.join ('-');
      }

      fs.readdir ('cells', function (error, cells) {
         if (error) return reply (rs, 500, {error: error});

         var name = makeName ();

         while (teishi.inc (cells, name)) {
            name = makeName ();
         }

         reply (rs, 200, {name: name});
      });
   }],

   ['post', 'call/:id', function (rq, rs) {

      if (stop (rs, [
         ['id', rq.data.params.id, /^[a-z]+-[a-z]+-[a-z]+$/, teishi.test.match],
         ['call', rq.body.call, ['string', 'object'], 'oneOf'],
         ['mute', rq.body.mute, [undefined, true, false], 'oneOf', teishi.test.equal],
      ])) return;

      var path = Path.join ('cells', rq.data.params.id);

      fs.readFile (path, 'utf8', function (error, dataspace) {

         if (error && error.code !== 'ENOENT') return reply (rs, 500, {error: error});
         if (error) dataspace = '';

         dataspace = cell.textToPaths (dataspace);

         if (dataspace.error) {
            notify ({priority: 'important', type: 'parse error', error: dataspace.error, id: rq.data.params.id});
            return reply (rs, 500, {error: 'Parse error'});
         }

         var get = function () {return dataspace}
         var put = function (Dataspace) {
            dataspace = Dataspace;
            fs.writeFileSync (path, cell.pathsToText (dataspace), 'utf8');
         }

         if (type (rq.body.call) === 'object') rq.body.call = cell.JSToPaths (rq.body.call);

         var response = cell.call (rq.body.call, get, put);
         var dialogue = cell.call ('@ dialogue', get, put);

         var length = dialogue.length ? teishi.last (dialogue) [0] : 0;

         // Note that even if the call is not valid, we still store it in the dialogue!
         if (! rq.body.mute) {
            cell.put ([
               ['p', 'dialogue', length + 1, 'from'],
               ['v', 'user'],
            ], [], get, put, true);
            cell.put ([
               ['p', 'dialogue', length + 1, 'to'],
               ['v', 'cell'],
            ], [], get, put, true);
            cell.put ([
               ['p', 'dialogue', length + 1, '@'],
               ['v', rq.body.call],
            ], [], get, put, true);
            if (response.length) cell.put ([
               ['p', 'dialogue', length + 1, '='],
               ...dale.go (response, function (v) {
                  return ['v', ...v];
               }),
            ], [], get, put, true);
         }

         reply (rs, 200, {response: response});
      });
   }],

   ['post', 'file/:id', function (rq, rs) {
      if (stop (rs, [
         ['id', rq.data.params.id, /^[a-z]+-[a-z]+-[a-z]+$/, teishi.test.match],
         ['file', rq.body.file, 'string'],
         ['name', rq.body.name, 'string'],
         ['mime', rq.body.mime, 'string']
      ])) return;

      var plainParse = function (text, format) {
         if (format === 'json') {
            var json = teishi.parse (text);
            if (json) return json;
         }

         if (format === 'csv') {
            return csv.parse (text, {columns: true, skip_empty_lines: true});
         }

         var detabler = function (separator) {

            var lines = text.split (/\r?\n/);

            if (! lines [0].match (separator)) return;

            var output = [];
            dale.obj (lines, function (v, k) {
               if (k === 0) return;
               output.push (dale.obj (v.split ('\t'), function (v2, k2) {
                  return [lines [0].split ('\t') [k2], cell.toNumberIfNumber (v2)];
               }))
            });
            return output;
         }

         var table = detabler ('\t');
         if (table) return table;

         var table = detabler (',');
         if (table) return table;

         return text;
      }

      LLM ('gpt-4o', [
         'Hi! I need two things: 1) a good name for this data; 2) for you to tell me what format you think it is (csv, xls, json, something else?).',
         'Please make your response a JSON of the shape {name: "...", format: "..."}',
         'I am only giving you the first 5k of the data',
         'Thanks!',
         rq.body.file.slice (0, 5000)
      ], function (error, res) {
         if (error) return reply (rs, 500, {error: error});
         var parsed = res.replace (/^```json/, '').replace (/```$/, '');
         if (teishi.parse (parsed) === false) return reply (rs, 500, {error: 'LLM did not give us JSON', res: res});
         parsed = JSON.parse (parsed);
         if (type (parsed.name) !== 'string' || type (parsed.format) !== 'string') return reply (rs, 500, {error: 'LLM did not give us the JSON we wanted', res: res});

         httpCall ({
            https: false,
            host: 'localhost',
            port: CONFIG.port,
            method: 'post',
            path: 'call/' + rq.data.params.id,
            body: {
               call: cell.pathsToText (cell.JSToPaths ({'@': {'put': {
                  p: parsed.name,
                  v: plainParse (rq.body.file, parsed.format.toLowerCase ()),
               }}})),
               mute: true,
            }
         }, function (error, RS) {
            if (error) return reply (rs, error.code ? error.code : 500, {error: error.body || error});
            reply (rs, 200);
         });
      });
   }],
];

// *** SERVER ***

var notify = clog;

process.on ('uncaughtException', function (error, origin) {
   notify ({priority: 'critical', type: 'server error', error: error, stack: error.stack, origin: origin});
   process.exit (1);
});

var server = cicek.listen ({port: CONFIG.port}, routes);
