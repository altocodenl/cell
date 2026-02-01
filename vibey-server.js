// *** SETUP ***

var CONFIG = require ('./config.js');

var fs    = require ('fs');
var Path  = require ('path');
var spawn = require ('child_process').spawn;

var dale   = require ('dale');
var teishi = require ('teishi');
var lith   = require ('lith');
var cicek  = require ('cicek');

var clog = console.log;

var type = teishi.type, eq = teishi.eq, last = teishi.last, inc = teishi.inc, reply = cicek.reply;

var stop = function (rs, rules) {
   return teishi.stop (rules, function (error) {
      reply (rs, 400, {error: error});
   }, true);
}

// *** STATE ***

var sessions = {};

// *** ROUTES ***

var routes = [

   // *** STATIC ***

   ['get', '/', reply, lith.g ([
      ['!DOCTYPE HTML'],
      ['html', [
         ['head', [
            ['meta', {name: 'viewport', content: 'width=device-width,initial-scale=1'}],
            ['meta', {charset: 'utf-8'}],
            ['title', 'vibey'],
            ['link', {rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css'}],
            ['link', {rel: 'stylesheet', href: 'https://unpkg.com/tachyons@4.12.0/css/tachyons.min.css'}],
         ]],
         ['body', [
            ['script', {src: 'https://cdn.jsdelivr.net/gh/fpereiro/gotob@434aa5a532fa0f9012743e935c4cd18eb5b3b3c5/gotoB.min.js'}],
            ['script', {src: 'https://cdn.jsdelivr.net/npm/marked/marked.min.js'}],
            ['script', {src: 'vibey-client.js'}],
         ]]
      ]]
   ])],
   ['get', 'vibey-client.js', cicek.file],

   // *** SESSIONS ***

   ['post', 'session/start', function (rq, rs) {

      if (stop (rs, [
         ['workdir', rq.body.workdir, 'string'],
      ])) return;

      var id = Date.now () + '-' + Math.random ().toString (36).slice (2, 8);

      var proc = spawn ('claude', ['-p', '--input-format', 'stream-json', '--output-format', 'stream-json', '--include-partial-messages', '--verbose'], {
         cwd: rq.body.workdir,
         env: Object.assign ({}, process.env, {
            FORCE_COLOR: '0',
         }),
         stdio: ['pipe', 'pipe', 'pipe']
      });

      sessions [id] = {
         id: id,
         workdir: rq.body.workdir,
         proc: proc,
         output: [],
         waiting: null,
         started: Date.now (),
         stdoutBuffer: '',
         stderrBuffer: ''
      };

      var session = sessions [id];

      var processBuffer = function (buffer, type) {
         var lines = buffer.split ('\n');
         // Keep the last incomplete line in the buffer
         var incomplete = lines.pop ();
         dale.go (lines, function (line) {
            if (line.trim ()) {
               session.output.push ({type: type, text: line, t: Date.now ()});
            }
         });
         return incomplete;
      };

      proc.stdout.on ('data', function (data) {
         session.stdoutBuffer += data.toString ();
         session.stdoutBuffer = processBuffer (session.stdoutBuffer, 'stdout');
         if (session.waiting) {
            var cb = session.waiting;
            session.waiting = null;
            cb ();
         }
      });

      proc.stderr.on ('data', function (data) {
         session.stderrBuffer += data.toString ();
         session.stderrBuffer = processBuffer (session.stderrBuffer, 'stderr');
         if (session.waiting) {
            var cb = session.waiting;
            session.waiting = null;
            cb ();
         }
      });

      proc.on ('close', function (code) {
         session.output.push ({type: 'exit', code: code, t: Date.now ()});
         session.closed = true;
         if (session.waiting) {
            var cb = session.waiting;
            session.waiting = null;
            cb ();
         }
      });

      proc.on ('error', function (error) {
         session.output.push ({type: 'error', error: error.message, t: Date.now ()});
         if (session.waiting) {
            var cb = session.waiting;
            session.waiting = null;
            cb ();
         }
      });

      reply (rs, 200, {id: id});
   }],

   ['post', 'session/:id/send', function (rq, rs) {

      var session = sessions [rq.data.params.id];
      if (! session) return reply (rs, 404, {error: 'Session not found'});
      if (session.closed) return reply (rs, 400, {error: 'Session is closed'});

      if (stop (rs, [
         ['message', rq.body.message, 'string'],
      ])) return;

      var jsonMessage = JSON.stringify ({
         type: 'user',
         message: {role: 'user', content: rq.body.message}
      });
      session.proc.stdin.write (jsonMessage + '\n');

      reply (rs, 200, {ok: true});
   }],

   ['get', 'session/:id/output', function (rq, rs) {

      var session = sessions [rq.data.params.id];
      if (! session) return reply (rs, 404, {error: 'Session not found'});

      var since = parseInt (rq.data.query.since) || 0;

      var output = dale.fil (session.output, undefined, function (entry, k) {
         if (k >= since) return entry;
      });

      if (output.length > 0 || session.closed) {
         return reply (rs, 200, {
            output: output,
            nextIndex: session.output.length,
            closed: session.closed
         });
      }

      // Long polling: wait for new output
      var timeout = setTimeout (function () {
         session.waiting = null;
         reply (rs, 200, {
            output: [],
            nextIndex: session.output.length,
            closed: session.closed
         });
      }, 30000);

      session.waiting = function () {
         clearTimeout (timeout);
         var output = dale.fil (session.output, undefined, function (entry, k) {
            if (k >= since) return entry;
         });
         reply (rs, 200, {
            output: output,
            nextIndex: session.output.length,
            closed: session.closed
         });
      };
   }],

   ['post', 'session/:id/stop', function (rq, rs) {

      var session = sessions [rq.data.params.id];
      if (! session) return reply (rs, 404, {error: 'Session not found'});

      if (! session.closed) {
         session.proc.kill ('SIGTERM');
      }

      reply (rs, 200, {ok: true});
   }],

   ['get', 'sessions', function (rq, rs) {
      reply (rs, 200, dale.go (sessions, function (session, id) {
         return {
            id: id,
            workdir: session.workdir,
            closed: session.closed,
            started: session.started,
            outputLength: session.output.length
         };
      }));
   }],
];

// *** SERVER ***

var notify = clog;

process.on ('uncaughtException', function (error, origin) {
   notify ({priority: 'critical', type: 'server error', error: error, stack: error.stack, origin: origin});
   process.exit (1);
});

var port = CONFIG.vibeyPort || 3001;
var server = cicek.listen ({port: port}, routes);

clog ('vibey server running on port ' + port);
