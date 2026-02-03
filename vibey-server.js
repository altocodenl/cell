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
var OPENAI_API_KEY = process.env.OPENAI_API_KEY || CONFIG.openaiApiKey;
var OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
var OPENAI_RESPONSES_URL = process.env.OPENAI_RESPONSES_URL || 'https://api.openai.com/v1/responses';

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

var renderClaudeOutput = function (output) {
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
   return textParts.join ('');
}

var renderCodexOutput = function (output) {
   var textParts = [];
   dale.go (output, function (entry) {
      if (entry.type === 'user') {
         textParts.push ('\n\n**User:** ' + entry.text + '\n\n');
         return;
      }
      if (entry.type !== 'stdout') return;
      try {
         var json = JSON.parse (entry.text);
         if (json.type === 'assistant' && json.message && json.message.content) {
            dale.go (json.message.content, function (block) {
               if (block.type === 'text') textParts.push (block.text);
               else if (block.type === 'tool_use') textParts.push ('[Tool: ' + block.name + ']');
            });
            return;
         }
         if (json.type === 'output_text' && json.text) {
            textParts.push (json.text);
            return;
         }
         if (json.type === 'final' && json.output_text) {
            textParts.push (json.output_text);
            return;
         }
         if (json.content && typeof json.content === 'string') {
            textParts.push (json.content);
            return;
         }
         textParts.push (entry.text);
      }
      catch (e) {
         textParts.push (entry.text);
      }
   });
   return textParts.join ('');
}

var openaiTools = function () {
   return [
      {
         type: 'function',
         name: 'shell_exec',
         description: 'Run a shell command on the local machine. Requires user approval before execution.',
         parameters: {
            type: 'object',
            properties: {
               command: {type: 'string', description: 'Shell command to execute'},
               cwd: {type: 'string', description: 'Working directory (optional)'}
            },
            required: ['command'],
            additionalProperties: false
         }
      },
      {
         type: 'function',
         name: 'http_fetch',
         description: 'Perform an HTTP request. Requires user approval before execution.',
         parameters: {
            type: 'object',
            properties: {
               url: {type: 'string', description: 'URL to fetch'},
               method: {type: 'string', description: 'HTTP method, e.g., GET, POST'},
               headers: {type: 'object', description: 'Request headers'},
               body: {type: 'string', description: 'Request body'}
            },
            required: ['url'],
            additionalProperties: false
         }
      }
   ];
}

var pushSessionOutput = function (session, obj) {
   session.output.push ({type: 'stdout', text: JSON.stringify (obj), t: Date.now ()});
   if (session.waiting) {
      var cb = session.waiting;
      session.waiting = null;
      cb ();
   }
}

var openaiStream = async function (session, inputItems) {
   if (! OPENAI_API_KEY) {
      pushSessionOutput (session, {type: 'error', message: 'OPENAI_API_KEY not set'});
      session.closed = true;
      return;
   }

   if (session.streaming) return;
   session.streaming = true;

   var body = {
      model: session.model || OPENAI_MODEL,
      input: inputItems,
      stream: true,
      tools: openaiTools (),
      tool_choice: 'auto'
   };

   if (session.lastResponseId) body.previous_response_id = session.lastResponseId;

   var controller = new AbortController ();
   session.abortController = controller;

   var res;
   try {
      res = await fetch (OPENAI_RESPONSES_URL, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + OPENAI_API_KEY
         },
         body: JSON.stringify (body),
         signal: controller.signal
      });
   }
   catch (e) {
      session.streaming = false;
      pushSessionOutput (session, {type: 'error', message: 'OpenAI request failed: ' + e.message});
      return;
   }

   if (! res.ok) {
      var errText = '';
      try { errText = await res.text (); } catch (e) {}
      session.streaming = false;
      pushSessionOutput (session, {type: 'error', message: 'OpenAI error: ' + res.status + ' ' + errText});
      return;
   }

   var reader = res.body.getReader ();
   var decoder = new TextDecoder ('utf-8');
   var buffer = '';

   var handleEvent = function (event) {
      if (! event || ! event.type) return;

      // Track response id when available
      if (event.response && event.response.id) session.lastResponseId = event.response.id;
      if (event.response_id) session.lastResponseId = event.response_id;

      // Track tool calls
      if (event.type === 'response.output_item.added' && event.item && event.item.type === 'function_call') {
         session.toolItems [event.item.id] = event.item.call_id || event.item.id;
         session.pendingTools [event.item.call_id || event.item.id] = {
            id: event.item.id,
            callId: event.item.call_id || event.item.id,
            name: event.item.name,
            arguments: ''
         };
      }
      if (event.type === 'response.function_call_arguments.delta') {
         var callId = session.toolItems [event.item_id] || event.call_id || event.item_id;
         var tool = session.pendingTools [callId] || {id: event.item_id, callId: callId, name: event.name, arguments: ''};
         tool.arguments = (tool.arguments || '') + (event.delta || '');
         session.pendingTools [callId] = tool;
      }
      if (event.type === 'response.function_call_arguments.done') {
         var callId = event.call_id || session.toolItems [event.item_id] || event.item_id;
         var tool = session.pendingTools [callId] || {id: event.item_id, callId: callId, name: event.name, arguments: ''};
         tool.arguments = event.arguments || tool.arguments || '';
         tool.name = event.name || tool.name;
         session.pendingTools [callId] = tool;
      }

      // Push the event through to the client
      pushSessionOutput (session, event);
   };

   var processSSE = function (chunk) {
      buffer += chunk;
      var parts = buffer.split ('\n\n');
      buffer = parts.pop ();
      dale.go (parts, function (part) {
         var lines = part.split ('\n');
         var dataLines = dale.fil (lines, undefined, function (line) {
            if (line.indexOf ('data:') === 0) return line.slice (5).trim ();
         });
         if (! dataLines.length) return;
         var data = dataLines.join ('');
         if (data === '[DONE]') return;
         try {
            var event = JSON.parse (data);
            handleEvent (event);
         }
         catch (e) {}
      });
   };

   try {
      while (true) {
         var r = await reader.read ();
         if (r.done) break;
         processSSE (decoder.decode (r.value, {stream: true}));
      }
   }
   catch (e) {
      pushSessionOutput (session, {type: 'error', message: 'OpenAI stream error: ' + e.message});
   }
   finally {
      session.streaming = false;
      session.abortController = null;
   }
}

var runTool = function (session, tool, cb) {
   if (! tool || ! tool.name) return cb ('Unknown tool');
   var args = {};
   try { args = JSON.parse (tool.arguments || '{}'); }
   catch (e) { return cb ('Invalid tool arguments JSON'); }

   if (tool.name === 'shell_exec') {
      if (! args.command || typeof args.command !== 'string') return cb ('Missing command');
      var cwd = typeof args.cwd === 'string' ? args.cwd : session.workdir;
      var proc = spawn (args.command, [], {cwd: cwd, shell: true});
      var stdout = '';
      var stderr = '';
      var done = false;

      var finish = function (code) {
         if (done) return;
         done = true;
         cb (null, {
            exitCode: code,
            stdout: stdout,
            stderr: stderr
         });
      };

      proc.stdout.on ('data', function (d) { stdout += d.toString (); });
      proc.stderr.on ('data', function (d) { stderr += d.toString (); });
      proc.on ('error', function (e) { cb ('Command failed: ' + e.message); });
      proc.on ('close', function (code) { finish (code); });
      return;
   }

   if (tool.name === 'http_fetch') {
      if (! args.url || typeof args.url !== 'string') return cb ('Missing url');
      var method = typeof args.method === 'string' ? args.method : 'GET';
      var headers = args.headers && typeof args.headers === 'object' ? args.headers : {};
      var body = typeof args.body === 'string' ? args.body : undefined;
      fetch (args.url, {method: method, headers: headers, body: body}).then (function (res) {
         return res.text ().then (function (text) {
            cb (null, {
               status: res.status,
               statusText: res.statusText,
               headers: Object.fromEntries (res.headers.entries ()),
               body: text
            });
         });
      }).catch (function (e) {
         cb ('Fetch failed: ' + e.message);
      });
      return;
   }

   cb ('Unsupported tool: ' + tool.name);
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
      agent: 'claude',
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
      content += renderClaudeOutput (output) + '\n\n';
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
   var dialogFile = Path.basename (dialogPath);

   var proc = spawn ('codex', ['exec', '--json', prompt], {
      cwd: VIBEY_DIR,
      env: Object.assign ({}, process.env, {FORCE_COLOR: '0'}),
      stdio: ['pipe', 'pipe', 'pipe']
   });

   var output = [];
   var stdoutBuffer = '';

   var dialog = {
      proc: proc,
      output: output,
      closed: false,
      agent: 'codex',
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
      content += '**Agent:** codex\n';
      content += '**Started:** ' + new Date (dialog.started).toISOString () + '\n';
      content += '**Status:** ' + (dialog.closed ? 'ended' : 'active') + '\n\n';
      content += '## Prompt\n\n' + prompt + '\n\n';
      content += '## Output\n\n';
      content += renderCodexOutput (output) + '\n\n';
      if (dialog.closed) content += '<ENDED>\n';
      fs.writeFile (dialogPath, content, 'utf8', function () {});
   };
   dialog.updateDialogFile = updateDialogFile;

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
      cb ('Failed to spawn codex: ' + error.message);
   });

   cb (null, dialogFile);
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
      // Codex is now streamed into the dialog file similarly to Claude
      spinCodex (role, prompt, dialogPath, cb);
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

      var agent = rq.body.agent || 'claude';

      if (agent === 'openai') {
         sessions [id] = {
            id: id,
            type: 'openai',
            workdir: rq.body.workdir,
            model: rq.body.model || OPENAI_MODEL,
            output: [],
            waiting: null,
            started: Date.now (),
            streaming: false,
            lastResponseId: null,
            pendingTools: {},
            toolItems: {},
            abortController: null
         };
         return reply (rs, 200, {id: id});
      }

      var proc = spawn ('claude', ['--input-format', 'stream-json', '--output-format', 'stream-json', '--include-partial-messages', '--verbose'], {
         cwd: rq.body.workdir,
         env: Object.assign ({}, process.env, {
            FORCE_COLOR: '0',
         }),
         stdio: ['pipe', 'pipe', 'pipe']
      });

      sessions [id] = {
         id: id,
         type: 'claude',
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

      if (session.type === 'openai') {
         if (session.streaming) return reply (rs, 429, {error: 'Session is busy'});

         if (rq.body.toolUseId) {
            var tool = session.pendingTools [rq.body.toolUseId];
            if (! tool) return reply (rs, 400, {error: 'Unknown tool call'});

            var decision = rq.body.message;
            if (decision === 'Reject') {
               openaiStream (session, [{
                  type: 'function_call_output',
                  call_id: rq.body.toolUseId,
                  output: JSON.stringify ({error: 'rejected_by_user'})
               }]);
               return reply (rs, 200, {ok: true});
            }

            if (decision === 'Approve') {
               return runTool (session, tool, function (error, result) {
                  var output = error ? {error: error} : result;
                  openaiStream (session, [{
                     type: 'function_call_output',
                     call_id: rq.body.toolUseId,
                     output: JSON.stringify (output)
                  }]);
                  reply (rs, 200, {ok: true});
               });
            }

            return reply (rs, 400, {error: 'Unknown decision'});
         }

         openaiStream (session, [{type: 'input_text', text: rq.body.message}]);
         return reply (rs, 200, {ok: true});
      }

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
         if (session.type === 'openai') {
            if (session.abortController) session.abortController.abort ();
            session.closed = true;
         }
         else if (session.proc) {
            session.proc.kill ('SIGTERM');
         }
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

      if (dialog.agent === 'claude') {
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
      }
      else if (dialog.agent === 'codex') {
         dialog.output.push ({type: 'user', text: rq.body.message, t: Date.now ()});
         if (dialog.updateDialogFile) dialog.updateDialogFile ();
         dialog.proc.stdin.write (rq.body.message + '\n');
      }
      else {
         return reply (rs, 400, {error: 'Dialog does not support input'});
      }

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

//setInterval (spinMain, 5000);
clog ('Main agent loop started (every 5s)');
