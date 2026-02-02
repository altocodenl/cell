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
var dialogs = {}; // Track interactive dialogs by filename

// *** HELPERS ***

var VIBEY_DIR = Path.join (__dirname, 'vibey');

// Ensure vibey directory exists
if (! fs.existsSync (VIBEY_DIR)) fs.mkdirSync (VIBEY_DIR);

// Validate filename: only alphanumeric, dash, underscore, dot; must end in .md
var validFilename = function (name) {
   if (! name || typeof name !== 'string') return false;
   if (! /^[a-zA-Z0-9_\-\.]+$/.test (name)) return false;
   if (! name.endsWith ('.md')) return false;
   if (name.includes ('..')) return false;
   return true;
}

// Generate dialog filename: dialog-YYYYMMDD-HHMMSS-<role>.md
var generateDialogFilename = function (role) {
   var now = new Date ();
   var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
   var timestamp = now.getUTCFullYear () +
      pad (now.getUTCMonth () + 1) +
      pad (now.getUTCDate ()) + '-' +
      pad (now.getUTCHours ()) +
      pad (now.getUTCMinutes ()) +
      pad (now.getUTCSeconds ());
   return 'dialog-' + timestamp + '-' + role + '.md';
}

// Claude-specific spawn - fully interactive
var spinClaude = function (role, prompt, dialogPath, cb) {
   var dialogFile = Path.basename (dialogPath);

   var proc = spawn ('claude', ['--input-format', 'stream-json', '--output-format', 'stream-json', '--include-partial-messages', '--verbose'], {
      cwd: VIBEY_DIR,
      env: Object.assign ({}, process.env, {FORCE_COLOR: '0'}),
      stdio: ['pipe', 'pipe', 'pipe']
   });

   var output = [];
   var stdoutBuffer = '';
   var closed = false;

   var dialog = {
      proc: proc,
      output: output,
      closed: false,
      role: role,
      prompt: prompt,
      path: dialogPath,
      started: Date.now (),
      waiting: null
   };

   dialogs [dialogFile] = dialog;

   var processBuffer = function (buffer, type) {
      var lines = buffer.split ('\n');
      var incomplete = lines.pop ();
      dale.go (lines, function (line) {
         if (line.trim ()) {
            output.push ({type: type, text: line, t: Date.now ()});
         }
      });
      return incomplete;
   };

   var updateDialogFile = function () {
      var content = '# Dialog: ' + role + '\n\n';
      content += '**Agent:** claude\n';
      content += '**Started:** ' + new Date (dialog.started).toISOString () + '\n';
      content += '**Status:** ' + (dialog.closed ? 'ended' : 'active') + '\n\n';
      content += '## Prompt\n\n' + prompt + '\n\n';
      content += '## Output\n\n';

      var textParts = [];
      dale.go (output, function (entry) {
         if (entry.type !== 'stdout') return;
         try {
            var json = JSON.parse (entry.text);
            if (json.type === 'assistant' && json.message && json.message.content) {
               dale.go (json.message.content, function (block) {
                  if (block.type === 'text') textParts.push (block.text);
                  else if (block.type === 'tool_use') textParts.push ('[Tool: ' + block.name + ']');
               });
            }
            else if (json.type === 'user' && json.message) {
               textParts.push ('\n\n**User:** ' + json.message.content + '\n\n');
            }
         }
         catch (e) {}
      });

      content += textParts.join ('') + '\n\n';
      if (dialog.closed) content += '<ENDED>\n';
      fs.writeFile (dialogPath, content, 'utf8', function () {});
   };

   proc.stdout.on ('data', function (data) {
      stdoutBuffer += data.toString ();
      stdoutBuffer = processBuffer (stdoutBuffer, 'stdout');
      updateDialogFile ();
      if (dialog.waiting) {
         var waitingCb = dialog.waiting;
         dialog.waiting = null;
         waitingCb ();
      }
   });

   proc.stderr.on ('data', function (data) {
      output.push ({type: 'stderr', text: data.toString (), t: Date.now ()});
      if (dialog.waiting) {
         var waitingCb = dialog.waiting;
         dialog.waiting = null;
         waitingCb ();
      }
   });

   proc.on ('close', function (code) {
      dialog.closed = true;
      dialog.exitCode = code;
      output.push ({type: 'exit', code: code, t: Date.now ()});
      updateDialogFile ();
      if (dialog.waiting) {
         var waitingCb = dialog.waiting;
         dialog.waiting = null;
         waitingCb ();
      }
   });

   proc.on ('error', function (error) {
      dialog.closed = true;
      output.push ({type: 'error', error: error.message, t: Date.now ()});
      updateDialogFile ();
      if (dialog.waiting) {
         var waitingCb = dialog.waiting;
         dialog.waiting = null;
         waitingCb ();
      }
      cb ('Failed to spawn claude: ' + error.message);
   });

   // Send the initial prompt as a JSON message
   var jsonMessage = JSON.stringify ({
      type: 'user',
      message: {role: 'user', content: prompt}
   });
   proc.stdin.write (jsonMessage + '\n');

   // Return immediately - dialog is now interactive
   cb (null, dialogFile);
}

// Codex-specific spawn
var spinCodex = function (role, prompt, dialogPath, cb) {
   var proc = spawn ('codex', ['--quiet', '--prompt', prompt], {
      cwd: VIBEY_DIR,
      env: Object.assign ({}, process.env, {FORCE_COLOR: '0'}),
      stdio: ['pipe', 'pipe', 'pipe']
   });

   var buffer = '';

   proc.stdout.on ('data', function (data) {
      buffer += data.toString ();
   });

   proc.stderr.on ('data', function (data) {
      buffer += '[stderr] ' + data.toString ();
   });

   proc.on ('close', function (code) {
      cb (null, buffer, code);
   });

   proc.on ('error', function (error) {
      cb ('Failed to spawn codex: ' + error.message);
   });

   proc.stdin.end ();
}

// General spin function: agent is 'claude' or 'codex', role is 'main' or 'worker'
// Returns the dialog filename. For claude, spawns an interactive dialog.
var spinAgent = function (agent, role, prompt, cb) {
   var dialogFile = generateDialogFilename (role);
   var dialogPath = Path.join (VIBEY_DIR, dialogFile);

   if (agent === 'claude') {
      // Claude is fully interactive - it handles its own dialog file
      spinClaude (role, prompt, dialogPath, cb);
   }
   else if (agent === 'codex') {
      // Codex remains non-interactive for now
      var initialContent = '# Dialog: ' + role + '\n\n';
      initialContent += '**Agent:** ' + agent + '\n';
      initialContent += '**Started:** ' + new Date ().toISOString () + '\n\n';
      initialContent += '## Prompt\n\n' + prompt + '\n\n';
      initialContent += '## Output\n\n*Running...*\n';
      fs.writeFileSync (dialogPath, initialContent, 'utf8');

      spinCodex (role, prompt, dialogPath, function (error, output, code) {
         if (error) return cb (error);

         var content = '# Dialog: ' + role + '\n\n';
         content += '**Agent:** ' + agent + '\n';
         content += '**Started:** ' + new Date ().toISOString () + '\n';
         content += '**Exit code:** ' + code + '\n\n';
         content += '## Prompt\n\n' + prompt + '\n\n';
         content += '## Output\n\n```\n' + output + '\n```\n\n';
         content += '<ENDED>\n';
         fs.writeFile (dialogPath, content, 'utf8', function () {});
      });

      cb (null, dialogFile);
   }
   else {
      cb ('Unknown agent: ' + agent);
   }
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

   // *** FILES ***

   ['get', 'files', function (rq, rs) {
      fs.readdir (VIBEY_DIR, function (error, files) {
         if (error) return reply (rs, 500, {error: 'Failed to read directory'});
         var mdFiles = dale.fil (files, undefined, function (file) {
            if (file.endsWith ('.md')) return file;
         });
         // Sort by modification time, most recent first
         var withStats = dale.go (mdFiles, function (file) {
            try {
               var stat = fs.statSync (Path.join (VIBEY_DIR, file));
               return {name: file, mtime: stat.mtime.getTime ()};
            }
            catch (e) {
               return {name: file, mtime: 0};
            }
         });
         withStats.sort (function (a, b) { return b.mtime - a.mtime; });
         reply (rs, 200, dale.go (withStats, function (f) { return f.name; }));
      });
   }],

   ['get', 'file/:name', function (rq, rs) {
      var name = rq.data.params.name;
      if (! validFilename (name)) return reply (rs, 400, {error: 'Invalid filename'});

      var filepath = Path.join (VIBEY_DIR, name);
      fs.readFile (filepath, 'utf8', function (error, content) {
         if (error) {
            if (error.code === 'ENOENT') return reply (rs, 404, {error: 'File not found'});
            return reply (rs, 500, {error: 'Failed to read file'});
         }
         reply (rs, 200, {name: name, content: content});
      });
   }],

   ['post', 'file/:name', function (rq, rs) {
      var name = rq.data.params.name;
      if (! validFilename (name)) return reply (rs, 400, {error: 'Invalid filename'});

      if (stop (rs, [
         ['content', rq.body.content, 'string'],
      ])) return;

      var filepath = Path.join (VIBEY_DIR, name);
      fs.writeFile (filepath, rq.body.content, 'utf8', function (error) {
         if (error) return reply (rs, 500, {error: 'Failed to write file'});
         reply (rs, 200, {ok: true, name: name});
      });
   }],

   ['delete', 'file/:name', function (rq, rs) {
      var name = rq.data.params.name;
      if (! validFilename (name)) return reply (rs, 400, {error: 'Invalid filename'});

      var filepath = Path.join (VIBEY_DIR, name);
      fs.unlink (filepath, function (error) {
         if (error) {
            if (error.code === 'ENOENT') return reply (rs, 404, {error: 'File not found'});
            return reply (rs, 500, {error: 'Failed to delete file'});
         }
         reply (rs, 200, {ok: true});
      });
   }],

   // *** SESSIONS ***

   ['post', 'session/start', function (rq, rs) {

      if (stop (rs, [
         ['workdir', rq.body.workdir, 'string'],
      ])) return;

      var id = Date.now () + '-' + Math.random ().toString (36).slice (2, 8);

      var proc = spawn ('claude', ['--input-format', 'stream-json', '--output-format', 'stream-json', '--include-partial-messages', '--verbose'], {
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

      var jsonMessage;
      if (rq.body.toolUseId) {
         // Send as tool_result for AskUserQuestion responses
         jsonMessage = JSON.stringify ({
            type: 'tool_result',
            tool_use_id: rq.body.toolUseId,
            content: rq.body.message
         });
      }
      else {
         jsonMessage = JSON.stringify ({
            type: 'user',
            message: {role: 'user', content: rq.body.message}
         });
      }
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

   // *** DIALOGS (interactive) ***

   ['get', 'dialogs', function (rq, rs) {
      reply (rs, 200, dale.go (dialogs, function (dialog, filename) {
         return {
            filename: filename,
            role: dialog.role,
            closed: dialog.closed,
            started: dialog.started,
            outputLength: dialog.output.length
         };
      }));
   }],

   ['get', 'dialog/:filename/output', function (rq, rs) {
      var filename = rq.data.params.filename;
      var dialog = dialogs [filename];
      if (! dialog) return reply (rs, 404, {error: 'Dialog not found'});

      var since = parseInt (rq.data.query.since) || 0;

      var output = dale.fil (dialog.output, undefined, function (entry, k) {
         if (k >= since) return entry;
      });

      if (output.length > 0 || dialog.closed) {
         return reply (rs, 200, {
            output: output,
            nextIndex: dialog.output.length,
            closed: dialog.closed
         });
      }

      // Long polling: wait for new output
      var timeout = setTimeout (function () {
         dialog.waiting = null;
         reply (rs, 200, {
            output: [],
            nextIndex: dialog.output.length,
            closed: dialog.closed
         });
      }, 30000);

      dialog.waiting = function () {
         clearTimeout (timeout);
         var output = dale.fil (dialog.output, undefined, function (entry, k) {
            if (k >= since) return entry;
         });
         reply (rs, 200, {
            output: output,
            nextIndex: dialog.output.length,
            closed: dialog.closed
         });
      };
   }],

   ['post', 'dialog/:filename/send', function (rq, rs) {
      var filename = rq.data.params.filename;
      var dialog = dialogs [filename];
      if (! dialog) return reply (rs, 404, {error: 'Dialog not found'});
      if (dialog.closed) return reply (rs, 400, {error: 'Dialog is closed'});

      if (stop (rs, [
         ['message', rq.body.message, 'string'],
      ])) return;

      var jsonMessage;
      if (rq.body.toolUseId) {
         // Send as tool_result for AskUserQuestion responses
         jsonMessage = JSON.stringify ({
            type: 'tool_result',
            tool_use_id: rq.body.toolUseId,
            content: rq.body.message
         });
      }
      else {
         jsonMessage = JSON.stringify ({
            type: 'user',
            message: {role: 'user', content: rq.body.message}
         });
      }
      dialog.proc.stdin.write (jsonMessage + '\n');

      reply (rs, 200, {ok: true});
   }],

   ['post', 'dialog/:filename/stop', function (rq, rs) {
      var filename = rq.data.params.filename;
      var dialog = dialogs [filename];
      if (! dialog) return reply (rs, 404, {error: 'Dialog not found'});

      if (! dialog.closed) {
         dialog.proc.kill ('SIGTERM');
      }

      reply (rs, 200, {ok: true});
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

// *** MAIN AGENT LOOP ***

var spinMain = function () {
   var rulesPath = Path.join (VIBEY_DIR, 'rules.md');
   fs.readFile (rulesPath, 'utf8', function (error, rules) {
      if (error) {
         if (error.code !== 'ENOENT') clog ('Error reading rules.md:', error);
         return;
      }
      spinAgent ('claude', 'main', rules, function (error, dialogFile) {
         if (error) clog ('Error spinning main agent:', error);
         else clog ('Spun main agent:', dialogFile);
      });
   });
};

setInterval (spinMain, 5000);
clog ('Main agent loop started (every 5s)');
