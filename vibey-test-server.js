var http   = require ('http');
var h      = require ('hitit');
var dale   = require ('dale');
var teishi = require ('teishi');

var log  = teishi.l || function () {console.log.apply (console, arguments)};
var type = teishi.type || teishi.t;

var CONFIG = require ('./config.js');

// Backend integration tests for vibey-server.
// Run:   node vibey-test-server.js              (all flows)
//        node vibey-test-server.js --flow=1     (just flow 1)
//        node vibey-test-server.js --flow=3     (just flow 3)
// Assumes vibey-server is already running on localhost:5353

// *** HELPERS ***

var parseSSE = function (body) {
   if (type (body) !== 'string') body = '' + body;
   var events = [];

   dale.go (body.split (/\n\n+/), function (block) {
      var lines = block.split ('\n');
      var dataLines = dale.fil (lines, undefined, function (line) {
         if (line.indexOf ('data: ') === 0) return line.slice (6);
      });
      if (! dataLines.length) return;

      var raw = dataLines.join ('\n');
      try {
         events.push (JSON.parse (raw));
      }
      catch (error) {
         events.push ({type: 'invalid_json', raw: raw});
      }
   });

   return events;
};

var getEventsByType = function (events, eventType) {
   return dale.fil (events, undefined, function (event) {
      if (event && event.type === eventType) return event;
   });
};

var sentinelDecisions = function (toolCalls) {
   var lines = dale.fil (toolCalls || [], undefined, function (tc) {
      if (tc && tc.id) return tc.id + ': approve';
   });
   return 'əəə\n' + lines.join ('\n') + '\nəəə';
};

var sentinelAllow = function (toolName) {
   return 'əəə\nallow ' + toolName + '\nəəə';
};

var hasToolMention = function (md, toolName) {
   return md.indexOf ('Tool request: ' + toolName) !== -1 || md.indexOf ('> Tool: ' + toolName) !== -1 || md.indexOf ('"name":"' + toolName + '"') !== -1;
};

var hasApprovedMarker = function (md) {
   return md.indexOf ('Decision: approved') !== -1 || md.indexOf ('> Status: approved') !== -1;
};

var hasResultMarker = function (md) {
   return md.indexOf ('Result:') !== -1 || md.indexOf ('## Tool Result') !== -1 || md.indexOf ('tool/result/json') !== -1;
};

// Fetch a dialog's markdown via the API
var fetchDialogMarkdown = function (project, dialogId, cb) {
   var options = {
      hostname: 'localhost',
      port: 5353,
      path: '/project/' + project + '/dialog/' + dialogId,
      method: 'GET'
   };
   var req = http.request (options, function (res) {
      var body = '';
      res.on ('data', function (chunk) {body += chunk;});
      res.on ('end', function () {
         try {
            var parsed = JSON.parse (body);
            cb (null, parsed.markdown || '');
         }
         catch (e) {
            cb (new Error ('Failed to parse dialog response'));
         }
      });
   });
   req.on ('error', cb);
   req.end ();
};

// Simple HTTP GET that returns the body as a string
var httpGet = function (port, path, cb) {
   var req = http.request ({hostname: 'localhost', port: port, path: path, method: 'GET'}, function (res) {
      var body = '';
      res.on ('data', function (chunk) {body += chunk;});
      res.on ('end', function () {cb (null, res.statusCode, body);});
   });
   req.on ('error', cb);
   req.end ();
};

// *** FLOW #1: Dialog with tool calls (read + write) ***

var PROJECT = 'flow1-' + Date.now () + '-' + Math.floor (Math.random () * 100000);
var DIALOG_SLUG = 'flow1-read-vibey';

var flow1Sequence = [

   ['GET / serves shell', 'get', '/', {}, '', 200, function (s, rq, rs) {
      if (type (rs.body) !== 'string') return log ('Expected HTML string body');
      if (rs.body.indexOf ('vibey-client.js') === -1) return log ('HTML shell missing vibey-client.js');
      return true;
   }],

   ['Create project', 'post', 'projects', {}, {name: PROJECT}, 200, function (s, rq, rs) {
      if (type (rs.body) !== 'object' || rs.body.ok !== true) return log ('Project creation failed');
      if (rs.body.name !== PROJECT) return log ('Unexpected project name returned');
      return true;
   }],

   ['Create waiting dialog draft (openai/gpt-5)', 'post', 'project/' + PROJECT + '/dialog/new', {}, {provider: 'openai', model: 'gpt-5', slug: DIALOG_SLUG}, 200, function (s, rq, rs) {
      if (type (rs.body) !== 'object') return log ('dialog/new should return object');
      if (! rs.body.dialogId || ! rs.body.filename) return log ('dialog/new missing dialogId or filename');
      if (rs.body.provider !== 'openai') return log ('dialog/new provider mismatch');
      if (rs.body.model !== 'gpt-5') return log ('dialog/new model mismatch');
      if (! rs.body.filename.match (/^dialog\-.*\-waiting\.md$/)) return log ('dialog/new should produce waiting dialog filename');
      if (rs.body.filename.indexOf (DIALOG_SLUG) === -1) return log ('dialog/new filename missing slug');
      s.dialogId = rs.body.dialogId;
      return true;
   }],

   ['Dialogs list includes waiting dialog', 'get', 'project/' + PROJECT + '/dialogs', {}, '', 200, function (s, rq, rs) {
      if (type (rs.body) !== 'array') return log ('dialogs endpoint should return array');
      var match = dale.stopNot (rs.body, undefined, function (d) {
         if (d.dialogId === s.dialogId) return d;
      });
      if (! match) return log ('Created dialog not found in dialogs list');
      if (match.status !== 'waiting') return log ('Created dialog should be waiting');
      return true;
   }],

   ['Prompt #1: ask to read first 20 lines of vibey.md (expect run_command request)', 'put', 'project/' + PROJECT + '/dialog', {}, function (s) {
      return {
         dialogId: s.dialogId,
         prompt: 'Please read the first 20 lines of vibey.md using the run_command tool with `head -20 vibey.md`, then summarize it in 3 short bullets. You must use the tool.'
      };
   }, 200, function (s, rq, rs) {
      if (type (rs.body) !== 'string') return log ('Expected SSE text body');

      var events = parseSSE (rs.body);
      var toolRequests = getEventsByType (events, 'tool_request');
      if (! toolRequests.length) return log ('Expected tool_request event for first prompt');

      var pending = toolRequests [0].toolCalls || [];
      var runCommands = dale.fil (pending, undefined, function (tc) {
         if (tc.name === 'run_command') return tc;
      });
      if (! runCommands.length) return log ('Expected run_command in first tool request');

      s.pendingReadToolCalls = pending;
      return true;
   }],

   ['Approve first tool request + allow run_command', 'put', 'project/' + PROJECT + '/dialog', {}, function (s) {
      return {
         dialogId: s.dialogId,
         decisions: sentinelDecisions (s.pendingReadToolCalls),
         authorizations: sentinelAllow ('run_command')
      };
   }, 200, function (s, rq, rs) {
      if (type (rs.body) !== 'string') return log ('Expected SSE text response after approvals');
      var events = parseSSE (rs.body);
      if (! getEventsByType (events, 'done').length) {
         var eventTypes = dale.go (events, function (event) {return event && event.type ? event.type : 'unknown'}).join (', ');
         return log ('Missing done event after approving read tool request. Events: ' + eventTypes);
      }
      return true;
   }],

   ['Dialog markdown has time + run_command evidence', 'get', 'project/' + PROJECT + '/dialog/placeholder', {}, '', 200, function (s, rq, rs) {
      // This step uses a dummy GET to trigger; real check is via fetchDialogMarkdown in next
      return true;
   }],

   // Use dialogs list as a hook step, then fetch dialog markdown via API
   ['Verify dialog via API: time + run_command', 'get', 'project/' + PROJECT + '/dialogs', {}, '', 200, function (s, rq, rs, next) {
      fetchDialogMarkdown (PROJECT, s.dialogId, function (error, md) {
         if (error) return log ('Could not fetch dialog: ' + error.message);
         if (md.indexOf ('> Time:') === -1) return log ('Dialog markdown missing > Time metadata');
         if (! hasToolMention (md, 'run_command')) return log ('Missing run_command evidence in dialog markdown');
         if (! hasApprovedMarker (md)) return log ('run_command block is not approved in markdown');
         if (! hasResultMarker (md)) return log ('run_command block missing Result section');
         next ();
      });
   }],

   ['Prompt #2: ask to create dummy.js (expect write_file request)', 'put', 'project/' + PROJECT + '/dialog', {}, function (s) {
      return {
         dialogId: s.dialogId,
         prompt: 'Please create a file called dummy.js with the content: console.log("hello from dummy"); Use the write_file tool for this.'
      };
   }, 200, function (s, rq, rs) {
      if (type (rs.body) !== 'string') return log ('Expected SSE text body for second prompt');

      var events = parseSSE (rs.body);
      var toolRequests = getEventsByType (events, 'tool_request');
      if (! toolRequests.length) return log ('Expected tool_request event for second prompt');

      var pending = toolRequests [0].toolCalls || [];
      var writeCalls = dale.fil (pending, undefined, function (tc) {
         if (tc.name === 'write_file') return tc;
      });
      if (! writeCalls.length) return log ('Expected write_file in second tool request');

      s.pendingWriteToolCalls = writeCalls;
      return true;
   }],

   ['Approve write_file request + allow write_file', 'put', 'project/' + PROJECT + '/dialog', {}, function (s) {
      return {
         dialogId: s.dialogId,
         decisions: sentinelDecisions (s.pendingWriteToolCalls),
         authorizations: sentinelAllow ('write_file')
      };
   }, 200, function (s, rq, rs) {
      if (type (rs.body) !== 'string') return log ('Expected SSE text response after write approval');
      var events = parseSSE (rs.body);
      if (! getEventsByType (events, 'done').length) return log ('Missing done event after approving write_file request');
      return true;
   }],

   ['Verify write_file via dialog API', 'get', 'project/' + PROJECT + '/dialogs', {}, '', 200, function (s, rq, rs, next) {
      fetchDialogMarkdown (PROJECT, s.dialogId, function (error, md) {
         if (error) return log ('Could not fetch dialog: ' + error.message);
         if (! hasToolMention (md, 'write_file')) return log ('Missing write_file block in dialog markdown');
         if (! hasApprovedMarker (md)) return log ('write_file block is not approved in markdown');
         next ();
      });
   }],

   // Verify dummy.js exists by asking the agent to cat it via tool/execute
   ['Verify dummy.js via tool/execute', 'post', 'project/' + PROJECT + '/tool/execute', {}, {toolName: 'run_command', toolInput: {command: 'cat dummy.js'}}, 200, function (s, rq, rs) {
      if (type (rs.body) !== 'object' || ! rs.body.success) return log ('run_command cat dummy.js failed: ' + JSON.stringify (rs.body));
      if ((rs.body.stdout || '').indexOf ('console.log') === -1) return log ('dummy.js does not contain console.log');
      return true;
   }],

   ['Delete project', 'delete', 'projects/' + PROJECT, {}, '', 200, function (s, rq, rs) {
      if (type (rs.body) !== 'object' || rs.body.ok !== true) return log ('Project deletion failed');
      return true;
   }],

   ['Project removed from list', 'get', 'projects', {}, '', 200, function (s, rq, rs) {
      if (type (rs.body) !== 'array') return log ('projects endpoint should return array');
      var stillExists = dale.stop (rs.body, false, function (name) {
         if (name === PROJECT) return true;
      });
      if (stillExists) return log ('Project still exists after deletion');
      return true;
   }]
];

// *** FLOW #2: Docs editing ***

var PROJECT2 = 'flow2-' + Date.now () + '-' + Math.floor (Math.random () * 100000);
var INITIAL_CONTENT = '# Main\n\nThis is the initial content of the project.\n';
var UPDATED_CONTENT = '# Main\n\nThis is the updated content of the project.\n\n## New section\n\nWith more detail.\n';
var SECOND_DOC = 'doc-notes.md';
var SECOND_CONTENT = '# Notes\n\nSome notes here.\n';

var flow2Sequence = [

   ['F2: Create project', 'post', 'projects', {}, {name: PROJECT2}, 200, function (s, rq, rs) {
      if (type (rs.body) !== 'object' || rs.body.ok !== true) return log ('Project creation failed');
      if (rs.body.name !== PROJECT2) return log ('Unexpected project name');
      return true;
   }],

   ['F2: Write doc-main.md with initial content', 'post', 'project/' + PROJECT2 + '/file/doc-main.md', {}, {content: INITIAL_CONTENT}, 200, function (s, rq, rs) {
      if (type (rs.body) !== 'object' || rs.body.ok !== true) return log ('File write failed');
      if (rs.body.name !== 'doc-main.md') return log ('Unexpected filename returned');
      return true;
   }],

   ['F2: Read doc-main.md returns initial content', 'get', 'project/' + PROJECT2 + '/file/doc-main.md', {}, '', 200, function (s, rq, rs) {
      if (type (rs.body) !== 'object') return log ('Expected object body');
      if (rs.body.name !== 'doc-main.md') return log ('Unexpected name: ' + rs.body.name);
      if (rs.body.content !== INITIAL_CONTENT) return log ('Content mismatch. Got: ' + JSON.stringify (rs.body.content));
      return true;
   }],

   ['F2: List files includes doc-main.md', 'get', 'project/' + PROJECT2 + '/files', {}, '', 200, function (s, rq, rs) {
      if (type (rs.body) !== 'array') return log ('Expected array');
      if (rs.body.indexOf ('doc-main.md') === -1) return log ('doc-main.md not in file list');
      return true;
   }],

   ['F2: Overwrite doc-main.md with updated content', 'post', 'project/' + PROJECT2 + '/file/doc-main.md', {}, {content: UPDATED_CONTENT}, 200, function (s, rq, rs) {
      if (type (rs.body) !== 'object' || rs.body.ok !== true) return log ('File overwrite failed');
      return true;
   }],

   ['F2: Read doc-main.md returns updated content', 'get', 'project/' + PROJECT2 + '/file/doc-main.md', {}, '', 200, function (s, rq, rs) {
      if (rs.body.content !== UPDATED_CONTENT) return log ('Updated content mismatch. Got: ' + JSON.stringify (rs.body.content));
      return true;
   }],

   ['F2: Write a second doc', 'post', 'project/' + PROJECT2 + '/file/' + SECOND_DOC, {}, {content: SECOND_CONTENT}, 200, function (s, rq, rs) {
      if (type (rs.body) !== 'object' || rs.body.ok !== true) return log ('Second file write failed');
      return true;
   }],

   ['F2: List files includes both docs', 'get', 'project/' + PROJECT2 + '/files', {}, '', 200, function (s, rq, rs) {
      if (type (rs.body) !== 'array') return log ('Expected array');
      if (rs.body.indexOf ('doc-main.md') === -1) return log ('doc-main.md missing from list');
      if (rs.body.indexOf (SECOND_DOC) === -1) return log (SECOND_DOC + ' missing from list');
      return true;
   }],

   ['F2: Read second doc', 'get', 'project/' + PROJECT2 + '/file/' + SECOND_DOC, {}, '', 200, function (s, rq, rs) {
      if (rs.body.content !== SECOND_CONTENT) return log ('Second doc content mismatch');
      return true;
   }],

   ['F2: Delete second doc', 'delete', 'project/' + PROJECT2 + '/file/' + SECOND_DOC, {}, '', 200, function (s, rq, rs) {
      if (type (rs.body) !== 'object' || rs.body.ok !== true) return log ('File deletion failed');
      return true;
   }],

   ['F2: List files no longer has second doc', 'get', 'project/' + PROJECT2 + '/files', {}, '', 200, function (s, rq, rs) {
      if (type (rs.body) !== 'array') return log ('Expected array');
      if (rs.body.indexOf (SECOND_DOC) !== -1) return log (SECOND_DOC + ' still in list after deletion');
      if (rs.body.indexOf ('doc-main.md') === -1) return log ('doc-main.md disappeared');
      return true;
   }],

   ['F2: doc-main.md still has updated content', 'get', 'project/' + PROJECT2 + '/file/doc-main.md', {}, '', 200, function (s, rq, rs) {
      if (rs.body.content !== UPDATED_CONTENT) return log ('doc-main.md content changed unexpectedly');
      return true;
   }],

   ['F2: Read nonexistent file returns 404', 'get', 'project/' + PROJECT2 + '/file/' + SECOND_DOC, {}, '', 404],

   ['F2: Write with invalid filename returns 400', 'post', 'project/' + PROJECT2 + '/file/bad..name.md', {}, {content: 'x'}, 400],

   ['F2: Write with non-md extension returns 400', 'post', 'project/' + PROJECT2 + '/file/bad.txt', {}, {content: 'x'}, 400],

   ['F2: Delete project', 'delete', 'projects/' + PROJECT2, {}, '', 200, function (s, rq, rs) {
      if (type (rs.body) !== 'object' || rs.body.ok !== true) return log ('Project deletion failed');
      return true;
   }],

   ['F2: Project removed from list', 'get', 'projects', {}, '', 200, function (s, rq, rs) {
      if (type (rs.body) !== 'array') return log ('Expected array');
      var stillExists = dale.stop (rs.body, false, function (name) {
         if (name === PROJECT2) return true;
      });
      if (stillExists) return log ('Project still exists after deletion');
      return true;
   }]
];

// *** FLOW #3: Multi-agent tictactoe — agents write code, app runs on port 4000 ***

var PROJECT3 = 'flow3-' + Date.now () + '-' + Math.floor (Math.random () * 100000);

var DOC_MAIN_F3 = [
   '# Tictactoe Project',
   '',
   'Build a simple tictactoe game for the browser using gotoB.',
   '',
   '## Architecture',
   '',
   '- `server.js` — express server on port 4000, serves static files from `__dirname`.',
   '- `index.html` — loads gotoB from CDN and `app.js`.',
   '- `app.js` — tictactoe game using gotoB (B.view, B.call, B.ev, B.store).',
   '',
   '## Agent Instructions',
   '',
   'When you receive "please start", you MUST do the following in this exact order:',
   '',
   '1. FIRST: Call the `launch_agent` tool with these exact parameters:',
   '   - provider: "openai"',
   '   - model: "gpt-5"',
   '   - prompt: "You are the backend agent for a tictactoe project. Do the following steps in order using tools:\\n1. run_command: npm init -y\\n2. run_command: npm install express\\n3. write_file server.js — a simple express server on port 4000 that serves static files from __dirname using express.static. About 10 lines.\\n4. run_command: node server.js &\\nDo all four steps. Keep server.js minimal."',
   '   - slug: "backend-agent"',
   '',
   '2. THEN: Use write_file to create `index.html`. It must:',
   '   - Have a proper HTML5 doctype and charset.',
   '   - Load gotoB from: https://cdn.jsdelivr.net/gh/fpereiro/gotob@434aa5a532fa0f9012743e935c4cd18eb5b3b3c5/gotoB.min.js',
   '   - Load dale from: https://cdn.jsdelivr.net/gh/nicedoc/dale@7f2ef0bcbeea7c2e10d7e0b7e6b12c18e5e89cfb/dale.min.js',
   '   - Load teishi from: https://cdn.jsdelivr.net/gh/fpereiro/teishi@dbfdd7131a44e29e39d68e5a4b6fb42bb6e2ee0f/teishi.min.js',
   '   - Load lith from: https://cdn.jsdelivr.net/gh/fpereiro/lith@4de7b40cae0b32dfea7f5ab891bb8d99e0abb47b/lith.min.js',
   '   - Load app.js via a script tag.',
   '   - Have a <title>Tictactoe</title>.',
   '',
   '3. THEN: Use write_file to create `app.js`. It must:',
   '   - Implement a 3x3 tictactoe grid using gotoB.',
   '   - Use `var dale = window.dale, teishi = window.teishi, lith = window.lith, c = window.c, B = window.B;` at the top.',
   '   - Store board state in B.store as an array of 9 cells (initially empty strings).',
   '   - Store current turn in B.store (X goes first).',
   '   - Alternate X and O turns on cell click.',
   '   - Detect a winner or draw and display the result.',
   '   - Mount on body with B.mount.',
   '   - Render each cell as a clickable div/button in a 3x3 grid.',
   '',
   'Do NOT skip the launch_agent call. Create each file with a separate write_file call.',
   '',
   '> Authorized: run_command',
   '> Authorized: write_file',
   '> Authorized: edit_file',
   '> Authorized: launch_agent'
].join ('\n') + '\n';

var GOTOB_F3 = [
   '# gotoB quick reference',
   '',
   'gotoB is a client-side reactive UI framework. Load it from CDN.',
   '',
   '## Core API',
   '- `B.store` — single global state object.',
   '- `B.call(x, verb, path, value)` — trigger an event. Built-in: `set`, `add`, `rem`.',
   '- `B.view(path, fn)` — reactive view. `fn` receives value at `path`, returns lith markup.',
   '- `B.ev(verb, path, value)` — returns an event handler string for use in onclick/oninput.',
   '- `B.mount(selector, viewFunction)` — mount a view into the DOM.',
   '- `B.respond(verb, path, fn)` — register a responder for events.',
   '- `B.mrespond([...])` — register multiple responders at once.',
   '',
   '## Lith markup',
   'Views return arrays: `[tag, attrs?, children?]`.',
   'Example: `["div", {class: "board"}, [["span", "X"]]]`',
   '',
   '## Minimal example',
   '```js',
   'var dale = window.dale, B = window.B;',
   'B.mount ("body", function () {',
   '   return B.view ("board", function (board) {',
   '      board = board || [];',
   '      return ["div", dale.go (board, function (cell, i) {',
   '         return ["button", {onclick: B.ev ("set", ["board", i], "X")}, cell || ""];',
   '      })];',
   '   });',
   '});',
   '```',
   ''
].join ('\n');

// Fire-and-forget: start a dialog via POST (SSE), read just enough to confirm it started, then abort.
var fireDialog = function (project, dialogId, prompt, cb) {
   var options = {
      hostname: 'localhost',
      port: CONFIG.vibeyPort || 5353,
      path: '/project/' + project + '/dialog',
      method: 'PUT',
      headers: {'Content-Type': 'application/json'}
   };
   var body = JSON.stringify ({dialogId: dialogId, prompt: prompt});
   var req = http.request (options, function (res) {
      var got = '';
      res.on ('data', function (chunk) {
         got += chunk;
         // As soon as we see the first SSE chunk event, we know the LLM started. Abort — let it run in background.
         if (got.indexOf ('"type":"chunk"') !== -1 || got.indexOf ('"type":"error"') !== -1) {
            req.destroy ();
            if (got.indexOf ('"type":"error"') !== -1) return cb (new Error ('SSE error: ' + got.slice (0, 500)));
            cb (null);
         }
      });
      res.on ('end', function () {cb (null);});
   });
   req.on ('error', function (err) {
      // ECONNRESET is expected since we abort
      if (err.code === 'ECONNRESET') return;
   });
   req.write (body);
   req.end ();
};

// Poll until a condition is met, with timeout
var pollUntil = function (checkFn, intervalMs, maxMs, cb) {
   var elapsed = 0;
   var tick = function () {
      checkFn (function (done, error) {
         if (error) return cb (error);
         if (done) return cb (null);
         elapsed += intervalMs;
         if (elapsed >= maxMs) return cb (new Error ('Poll timed out after ' + (maxMs / 1000) + 's'));
         setTimeout (tick, intervalMs);
      });
   };
   tick ();
};

var flow3Sequence = [

   ['F3: Create project', 'post', 'projects', {}, {name: PROJECT3}, 200, function (s, rq, rs) {
      if (type (rs.body) !== 'object' || rs.body.ok !== true) return log ('Project creation failed');
      return true;
   }],

   ['F3: Write doc-main.md', 'post', 'project/' + PROJECT3 + '/file/doc-main.md', {}, {content: DOC_MAIN_F3}, 200, function (s, rq, rs) {
      if (type (rs.body) !== 'object' || rs.body.ok !== true) return log ('File write failed');
      return true;
   }],

   ['F3: Write doc-gotob.md', 'post', 'project/' + PROJECT3 + '/file/doc-gotob.md', {}, {content: GOTOB_F3}, 200, function (s, rq, rs) {
      if (type (rs.body) !== 'object' || rs.body.ok !== true) return log ('File write failed');
      return true;
   }],

   ['F3: Create waiting dialog (orchestrator)', 'post', 'project/' + PROJECT3 + '/dialog/new', {}, {provider: 'openai', model: 'gpt-5', slug: 'orchestrator'}, 200, function (s, rq, rs) {
      if (type (rs.body) !== 'object') return log ('dialog/new should return object');
      if (! rs.body.dialogId || ! rs.body.filename) return log ('missing dialogId or filename');
      s.f3DialogId = rs.body.dialogId;
      return true;
   }],

   ['F3: Verify dialog inherited all 4 global authorizations', 'get', 'project/' + PROJECT3 + '/dialogs', {}, '', 200, function (s, rq, rs, next) {
      fetchDialogMarkdown (PROJECT3, s.f3DialogId, function (error, md) {
         if (error) return log ('Could not fetch dialog: ' + error.message);
         var tools = ['run_command', 'write_file', 'edit_file', 'launch_agent'];
         for (var i = 0; i < tools.length; i++) {
            if (md.indexOf ('> Authorized: ' + tools [i]) === -1) return log ('Dialog missing inherited ' + tools [i] + ' authorization');
         }
         next ();
      });
   }],

   // Fire the dialog and don't block — let agents work in background
   ['F3: Fire "please start" (non-blocking)', 'get', 'project/' + PROJECT3 + '/dialogs', {}, '', 200, function (s, rq, rs, next) {
      fireDialog (PROJECT3, s.f3DialogId, 'please start', function (error) {
         if (error) return log ('Failed to fire dialog: ' + error.message);
         next ();
      });
   }],

   // Poll until at least 2 dialogs exist (orchestrator spawned a backend agent)
   ['F3: Poll until spawned agent appears', 'get', 'project/' + PROJECT3 + '/dialogs', {}, '', 200, function (s, rq, rs, next) {
      pollUntil (function (done) {
         httpGet (CONFIG.vibeyPort || 5353, '/project/' + PROJECT3 + '/dialogs', function (error, status, body) {
            if (error || status !== 200) return done (false);
            try {
               var dialogs = JSON.parse (body);
               if (dialogs.length >= 2) return done (true);
            }
            catch (e) {}
            done (false);
         });
      }, 5000, 180000, function (error) {
         if (error) return log ('Spawned agent never appeared: ' + error.message);
         next ();
      });
   }],

   // Poll until the tictactoe app is reachable on port 4000 (inside container via tool/execute)
   ['F3: Poll until app serves on port 4000', 'get', 'project/' + PROJECT3 + '/dialogs', {}, '', 200, function (s, rq, rs, next) {
      pollUntil (function (done) {
         var reqBody = JSON.stringify ({toolName: 'run_command', toolInput: {command: 'curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/'}});
         var options = {
            hostname: 'localhost',
            port: CONFIG.vibeyPort || 5353,
            path: '/project/' + PROJECT3 + '/tool/execute',
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength (reqBody)}
         };
         var req = http.request (options, function (res) {
            var body = '';
            res.on ('data', function (chunk) {body += chunk;});
            res.on ('end', function () {
               try {
                  var parsed = JSON.parse (body);
                  if (parsed.success && (parsed.stdout || '').indexOf ('200') !== -1) return done (true);
               }
               catch (e) {}
               done (false);
            });
         });
         req.on ('error', function () {done (false);});
         req.write (reqBody);
         req.end ();
      }, 5000, 300000, function (error) {
         if (error) return log ('App never started on port 4000: ' + error.message);
         next ();
      });
   }],

   // Now verify the content of each file via tool/execute
   ['F3: server.js has express content', 'post', 'project/' + PROJECT3 + '/tool/execute', {}, {toolName: 'run_command', toolInput: {command: 'cat server.js'}}, 200, function (s, rq, rs) {
      if (! rs.body || ! rs.body.success) return log ('cat server.js failed: ' + JSON.stringify (rs.body));
      var out = rs.body.stdout || '';
      if (out.indexOf ('express') === -1) return log ('server.js missing "express"');
      if (out.indexOf ('4000') === -1) return log ('server.js missing port 4000');
      if (out.indexOf ('listen') === -1 && out.indexOf ('createServer') === -1) return log ('server.js missing listen/createServer');
      return true;
   }],

   ['F3: index.html has gotoB + app.js', 'post', 'project/' + PROJECT3 + '/tool/execute', {}, {toolName: 'run_command', toolInput: {command: 'cat index.html'}}, 200, function (s, rq, rs) {
      if (! rs.body || ! rs.body.success) return log ('cat index.html failed: ' + JSON.stringify (rs.body));
      var out = (rs.body.stdout || '').toLowerCase ();
      if (out.indexOf ('gotob') === -1) return log ('index.html missing gotoB reference');
      if (out.indexOf ('app.js') === -1) return log ('index.html missing app.js reference');
      return true;
   }],

   ['F3: app.js has tictactoe gotoB code', 'post', 'project/' + PROJECT3 + '/tool/execute', {}, {toolName: 'run_command', toolInput: {command: 'cat app.js'}}, 200, function (s, rq, rs) {
      if (! rs.body || ! rs.body.success) return log ('cat app.js failed: ' + JSON.stringify (rs.body));
      var out = rs.body.stdout || '';
      if (out.indexOf ('B.') === -1) return log ('app.js missing gotoB usage (no B. references)');
      var hasBoardLogic = out.indexOf ('board') !== -1 || out.indexOf ('cell') !== -1 || out.indexOf ('grid') !== -1;
      if (! hasBoardLogic) return log ('app.js missing board/cell/grid logic');
      return true;
   }],

   // Verify dialogs: at least 2, parent has launch_agent evidence
   ['F3: At least 2 dialogs with launch_agent evidence', 'get', 'project/' + PROJECT3 + '/dialogs', {}, '', 200, function (s, rq, rs, next) {
      if (type (rs.body) !== 'array') return log ('Expected array');
      if (rs.body.length < 2) return log ('Expected at least 2 dialogs, got ' + rs.body.length);

      var parent = dale.stopNot (rs.body, undefined, function (d) {if (d.dialogId === s.f3DialogId) return d;});
      if (! parent) return log ('Parent dialog not found');

      fetchDialogMarkdown (PROJECT3, s.f3DialogId, function (error, md) {
         if (error) return log ('Could not fetch parent dialog: ' + error.message);
         if (! hasToolMention (md, 'launch_agent')) return log ('Parent missing launch_agent evidence');
         if (! hasApprovedMarker (md)) return log ('Parent tools not approved');
         next ();
      });
   }],

   // Expose port 4000 to host and verify from outside the container
   ['F3: Expose port 4000 to host', 'post', 'project/' + PROJECT3 + '/ports', {}, {port: 4000}, 200, function (s, rq, rs) {
      if (! rs.body) return log ('Empty response from ports endpoint');
      s.f3HostPort = rs.body.hostPort || rs.body.containerPort || 4000;
      return true;
   }],

   ['F3: Tictactoe serves from host port', 'get', 'project/' + PROJECT3 + '/dialogs', {}, '', 200, function (s, rq, rs, next) {
      var attempts = 0;
      var tryFetch = function () {
         httpGet (s.f3HostPort, '/', function (error, status, body) {
            if (error || status !== 200) {
               attempts++;
               if (attempts < 10) return setTimeout (tryFetch, 1000);
               return log ('App not responding on host port ' + s.f3HostPort + ' after 10 attempts');
            }
            var lower = (body || '').toLowerCase ();
            if (lower.indexOf ('gotob') === -1) return log ('Served page missing gotoB');
            if (lower.indexOf ('app.js') === -1) return log ('Served page missing app.js');
            if (lower.indexOf ('tictactoe') === -1) return log ('Served page missing tictactoe title');
            next ();
         });
      };
      setTimeout (tryFetch, 2000);
   }],

   ['F3: Delete project (cleanup)', 'delete', 'projects/' + PROJECT3, {}, '', 200, function (s, rq, rs) {
      if (type (rs.body) !== 'object' || rs.body.ok !== true) return log ('Project deletion failed');
      return true;
   }],

   ['F3: Project removed from list', 'get', 'projects', {}, '', 200, function (s, rq, rs) {
      if (type (rs.body) !== 'array') return log ('Expected array');
      var stillExists = dale.stop (rs.body, false, function (name) {if (name === PROJECT3) return true;});
      if (stillExists) return log ('Project still exists after deletion');
      return true;
   }]
];

// *** RUNNER ***

var allFlows = {1: flow1Sequence, 2: flow2Sequence, 3: flow3Sequence};

var requestedFlows = [];
dale.go (process.argv.slice (2), function (arg) {
   var match = arg.match (/^--flow=(\d+)$/);
   if (match) requestedFlows.push (Number (match [1]));
});

if (! requestedFlows.length) requestedFlows = [1, 2, 3];

var sequences = dale.go (requestedFlows, function (n) {return allFlows [n];});
var label = 'Flow #' + requestedFlows.join (' + Flow #');

h.seq (
   {
      host: 'localhost',
      port: 5353,
      timeout: 300
   },
   sequences,
   function (error) {
      if (error) {
         try {
            if (error.request && type (error.request.body) === 'string') {
               error.request.body = error.request.body.slice (0, 1200) + (error.request.body.length > 1200 ? '... OMITTING REMAINDER' : '');
            }
         }
         catch (e) {}
         return console.log ('VIBEY TEST FAILED:', error);
      }
      log ('ALL TESTS PASSED (' + label + ')');
   },
   h.stdmap
);
