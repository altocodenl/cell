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
      path: 'v1/responses',
      method: 'post',
      headers: {authorization: 'Bearer ' + SECRET.openai},
      body: {model: model, temperature: 1, input: question}
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
            dale.go (['cell.js', 'client.js'], function (v) {
               return ['script', {src: v}];
            }),
         ]]
      ]]
   ])],
   ['get', ['client.js', 'cell.js'], cicek.file],

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
         ['id', rq.data.params.id, /^[a-z]+-[a-z]+-[a-z]+$/, teishi.test.match]
      ])) return;

      var path = Path.join ('cells', rq.data.params.id);

      fs.readFile (path, 'utf8', function (error, dataspace) {

         if (error && error.code !== 'ENOENT') return reply (rs, 500, {error: error});
         if (error) dataspace = '';

         dataspace = cell.parser (dataspace);

         var get = function () {return dataspace}
         var put = function (dataspace) {
            fs.writeFileSync (path, cell.pathsToText (dataspace), 'utf8');
         }

         var response = cell.call (rq.body.call, get, put);
         var dialogue = cell.call ('@ dialogue', get, put);
         var length = dialogue.length ? teishi.last (dialogue) [0] : 0;

         // Note that even if the call is not valid, we still store it in the dialogue!
         cell.put ([
            [1, 'dialogue', length + 1, 'from'],
            [2, 'user'],
            [3, 'dialogue', length + 1, 'message'],
            [4, rq.body.call],
            [5, 'dialogue', length + 2, 'from'],
            [6, 'cell'],
            [7, 'dialogue', length + 2, 'message'],
            ...dale.go (response, function (v) {
               return [8, ...v];
            }),
         ], get, put, true);

         reply (rs, 200, {response: response});
      });
   }],

];

// LLM ('gpt-4o', 'Hi, can you give me an JS array with single quotes with twenty random (but common) English nouns?', console.log);

// *** SERVER ***

var notify = clog;

process.on ('uncaughtException', function (error, origin) {
   notify ({priority: 'critical', type: 'server error', error: error, stack: error.stack, origin: origin});
   process.exit (1);
});

var server = cicek.listen ({port: CONFIG.port}, routes);
