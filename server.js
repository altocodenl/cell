// *** SETUP ***

var CONFIG = require ('./config.js');
var SECRET = require ('./secret.js');

var fs = require ('fs');
var path = require ('path');

var dale   = require ('dale');
var teishi = require ('teishi');
var lith   = require ('lith');
var cicek  = require ('cicek');
var hitit  = require ('hitit');

var clog = console.log;

var type = teishi.type, eq = teishi.eq, last = teishi.last, inc = teishi.inc, reply = cicek.reply;

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
            ['script', {src: 'https://cdn.jsdelivr.net/gh/fpereiro/gotob@d599867a327a74d3c53aa518f507820161bb4ac8/gotoB.min.js'}],
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

   ['get', 'project/:id', function (rq, rs) {

      fs.readFile (Path.join ('cells', rq.data.params [0]), 'utf8', function (error, dataspace) {
         if (error && error.code === 'ENOENT') return reply (rs, 404);
         if (error) return reply (rs, 500, {error: error});
         reply (rs, 200, dataspace);
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
