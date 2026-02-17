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
         prompt: 'Please read the first 20 lines of vibey.md, which is two directories up from your working directory, using the run_command tool with `head -20 ../../vibey.md`, then summarize it in 3 short bullets. You must use the tool.'
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

   ['Verify dummy.js created in markdown and filesystem', 'get', 'project/' + PROJECT + '/dialogs', {}, '', 200, function (s, rq, rs) {
      try {
         var md = fs.readFileSync (getDialogFilepath (PROJECT, s.dialogId), 'utf8');
         if (! hasToolMention (md, 'write_file')) return log ('Missing write_file block in dialog markdown');
         if (! hasApprovedMarker (md)) return log ('write_file block is not approved in markdown');

         var dummyJs = fs.readFileSync (Path.join (__dirname, 'vibey', PROJECT, 'dummy.js'), 'utf8');
         if (dummyJs.indexOf ('console.log') === -1) {
            return log ('dummy.js does not contain console.log');
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

// *** FLOW #2: Docs editing ***
// Create project, write doc-main.md, read it, update it, verify updates,
// create a second doc, list files, delete the second doc, verify main intact, cleanup.

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

h.seq (
   {
      host: 'localhost',
      port: CONFIG.vibeyPort || 3001,
      timeout: 180
   },
   [flow1Sequence, flow2Sequence],
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
      log ('ALL TESTS PASSED (Flow #1 + Flow #2)');
   },
   h.stdmap
);
