var fs     = require ('fs');
var Path   = require ('path');
var h      = require ('hitit');
var dale   = require ('dale');
var teishi = require ('teishi');

var log  = teishi.l || function () {console.log.apply (console, arguments)};
var type = teishi.type || teishi.t;

var CONFIG = require ('./config.js');

// Flow #1-focused backend integration test for vibey-server.
// Run: node vibey-server-test.js
// Assumes vibey-server is already running on localhost:CONFIG.vibeyPort.

var PROJECT = 'flow1-' + Date.now () + '-' + Math.floor (Math.random () * 100000);
var DIALOG_SLUG = 'flow1-read-vibey';

var ROOT_VIBEY_MD_PATH = Path.join (__dirname, 'vibey.md');
var ROOT_VIBEY_SERVER_JS_PATH = Path.join (__dirname, 'vibey-server.js');

var getDialogFilepath = function (projectName, dialogId) {
   var projectDir = Path.join (__dirname, 'vibey', projectName);
   var prefix = 'dialog-' + dialogId + '-';
   var files = fs.readdirSync (projectDir);
   var match = dale.stopNot (files, undefined, function (file) {
      if (file.indexOf (prefix) === 0 && file.match (/\.(md)$/)) return file;
   });
   if (! match) throw new Error ('Dialog file not found for id: ' + dialogId);
   return Path.join (projectDir, match);
};

var seedProjectFiles = function (projectName) {
   var projectDir = Path.join (__dirname, 'vibey', projectName);
   if (! fs.existsSync (projectDir)) throw new Error ('Project directory not found: ' + projectDir);

   fs.writeFileSync (Path.join (projectDir, 'vibey.md'), fs.readFileSync (ROOT_VIBEY_MD_PATH, 'utf8'), 'utf8');
   fs.writeFileSync (Path.join (projectDir, 'vibey-server.js'), fs.readFileSync (ROOT_VIBEY_SERVER_JS_PATH, 'utf8'), 'utf8');
};

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

   ['Seed project with vibey.md and vibey-server.js', 'get', 'projects', {}, '', 200, function (s, rq, rs) {
      try {
         seedProjectFiles (PROJECT);
      }
      catch (error) {
         return log ('Failed to seed project files: ' + error.message);
      }
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

   ['Prompt #1: ask to read vibey.md (expect run_command request)', 'put', 'project/' + PROJECT + '/dialog', {}, function (s) {
      return {
         dialogId: s.dialogId,
         prompt: 'Please read vibey.md using the run_command tool with `cat vibey.md`, then summarize it in 3 short bullets. You must use the tool.'
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

   ['Dialog markdown has time + run_command evidence', 'get', 'project/' + PROJECT + '/dialogs', {}, '', 200, function (s, rq, rs) {
      try {
         var md = fs.readFileSync (getDialogFilepath (PROJECT, s.dialogId), 'utf8');
         if (md.indexOf ('> Time:') === -1) return log ('Dialog markdown missing > Time metadata');
         if (! hasToolMention (md, 'run_command')) return log ('Missing run_command evidence in dialog markdown');
         if (! hasApprovedMarker (md)) return log ('run_command block is not approved in markdown');
         if (! hasResultMarker (md)) return log ('run_command block missing Result section');
      }
      catch (error) {
         return log ('Could not read dialog markdown: ' + error.message);
      }
      return true;
   }],

   ['Prompt #2: ask to add console.log at top of vibey-server.js', 'put', 'project/' + PROJECT + '/dialog', {}, function (s) {
      return {
         dialogId: s.dialogId,
         prompt: 'Please add exactly one line as the first line of vibey-server.js: console.log("vibey-server starting"); Use edit_file for this change.'
      };
   }, 200, function (s, rq, rs) {
      if (type (rs.body) !== 'string') return log ('Expected SSE text body for second prompt');

      var events = parseSSE (rs.body);
      var toolRequests = getEventsByType (events, 'tool_request');
      if (! toolRequests.length) return log ('Expected tool_request event for second prompt');

      var pending = toolRequests [0].toolCalls || [];
      var editCalls = dale.fil (pending, undefined, function (tc) {
         if (tc.name === 'edit_file') return tc;
      });
      if (! editCalls.length) return log ('Expected edit_file in second tool request');

      s.pendingEditToolCalls = editCalls;
      return true;
   }],

   ['Approve edit_file request + allow edit_file', 'put', 'project/' + PROJECT + '/dialog', {}, function (s) {
      return {
         dialogId: s.dialogId,
         decisions: sentinelDecisions (s.pendingEditToolCalls),
         authorizations: sentinelAllow ('edit_file')
      };
   }, 200, function (s, rq, rs) {
      if (type (rs.body) !== 'string') return log ('Expected SSE text response after edit approval');
      var events = parseSSE (rs.body);
      if (! getEventsByType (events, 'done').length) return log ('Missing done event after approving edit_file request');
      return true;
   }],

   ['Verify edit applied in markdown and filesystem', 'get', 'project/' + PROJECT + '/dialogs', {}, '', 200, function (s, rq, rs) {
      try {
         var md = fs.readFileSync (getDialogFilepath (PROJECT, s.dialogId), 'utf8');
         if (! hasToolMention (md, 'edit_file')) return log ('Missing edit_file block in dialog markdown');
         if (! hasApprovedMarker (md)) return log ('edit_file block is not approved in markdown');

         var projectVibeyServer = fs.readFileSync (Path.join (__dirname, 'vibey', PROJECT, 'vibey-server.js'), 'utf8');
         if (projectVibeyServer.indexOf ('console.log("vibey-server starting");') !== 0) {
            return log ('console.log was not inserted as first line in project vibey-server.js');
         }
      }
      catch (error) {
         return log ('Verification failed: ' + error.message);
      }
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

h.seq (
   {
      host: 'localhost',
      port: CONFIG.vibeyPort || 3001,
      timeout: 180
   },
   [flow1Sequence],
   function (error) {
      if (error) {
         try {
            if (error.request && type (error.request.body) === 'string') {
               error.request.body = error.request.body.slice (0, 1200) + (error.request.body.length > 1200 ? '... OMITTING REMAINDER' : '');
            }
         }
         catch (e) {}
         return console.log ('VIBEY FLOW #1 TEST FAILED:', error);
      }
      log ('VIBEY FLOW #1 TEST PASSED');
   },
   h.stdmap
);
