// *** SETUP ***

var B = window.B;

B.prod = true;
B.internal.timeout = 500;

var type = teishi.type;
var style = lith.css.style;

var parseDialogFilename = function (filename) {
   var match = (filename || '').match (/^dialog\-(.+)\-(active|waiting|done)\.md$/);
   if (! match) return null;
   return {dialogId: match [1], status: match [2]};
};

var statusIcon = function (status) {
   if (status === 'active')  return '🟢';
   if (status === 'waiting') return '🟡';
   if (status === 'done')    return '⚪';
   return '•';
};

var dialogDisplayLabel = function (filename) {
   var parsed = parseDialogFilename (filename);
   if (! parsed) return filename;

   var match = parsed.dialogId.match (/^\d{8}\-\d{6}\-(.+)$/);
   return match ? match [1] : parsed.dialogId;
};

var MODEL_OPTIONS = {
   openai: [
      {value: 'gpt-5', label: 'gpt-5'},
      {value: 'gpt-4o', label: 'gpt-4o'}
   ],
   claude: [
      {value: 'claude-sonnet-4-20250514', label: 'claude-sonnet-4-20250514'}
   ]
};

var defaultModelForProvider = function (provider) {
   provider = provider || 'openai';
   var options = MODEL_OPTIONS [provider] || [];
   return options [0] ? options [0].value : '';
};

var normalizeDocFilename = function (name) {
   name = (name || '').trim ();
   if (name === 'main.md') return 'doc-main.md';
   return name;
};

var docDisplayName = function (name) {
   return name === 'doc-main.md' ? 'main.md' : name;
};

var buildHash = function (project, tab, currentFile) {
   if (! project) return '#/projects';
   tab = tab === 'dialogs' ? 'dialogs' : 'docs';
   if (! currentFile || ! currentFile.name) return '#/project/' + encodeURIComponent (project) + '/' + tab;

   var parsed = parseDialogFilename (currentFile.name);

   if (tab === 'dialogs') {
      if (! parsed) return '#/project/' + encodeURIComponent (project) + '/dialogs';
      return '#/project/' + encodeURIComponent (project) + '/dialogs/' + encodeURIComponent (parsed.dialogId);
   }

   if (parsed) return '#/project/' + encodeURIComponent (project) + '/docs';
   return '#/project/' + encodeURIComponent (project) + '/docs/' + encodeURIComponent (docDisplayName (currentFile.name));
};

var readHashTarget = function (hashValue) {
   var rawHash = hashValue !== undefined ? hashValue : (window.location.hash || '');
   var raw = rawHash.replace (/^#\/?/, '');
   if (! raw) return {project: null, tab: 'projects', target: null};

   var parts = raw.split ('/');
   if (parts [0] === 'project' && parts [1]) {
      var project = decodeURIComponent (parts [1]);
      var tab = parts [2] === 'dialogs' ? 'dialogs' : (parts [2] === 'docs' ? 'docs' : 'docs');
      var target = parts [3] ? decodeURIComponent (parts [3]) : null;
      if (tab === 'docs' && target) target = normalizeDocFilename (target);
      return {project: project, tab: tab, target: target};
   }

   return {project: null, tab: 'projects', target: null};
};

var projectPath = function (project, tail) {
   return 'project/' + encodeURIComponent (project) + '/' + tail;
};

var isDirtyDoc = function (file) {
   return file && ! file.name.startsWith ('dialog-') && file.content !== file.original;
};

var isSameDocTarget = function (parsed, file, currentProject) {
   return parsed && parsed.tab === 'docs' && parsed.target && file && parsed.project === currentProject && normalizeDocFilename (parsed.target) === file.name;
};

// *** RESPONDERS ***

B.mrespond ([

   // *** SETUP ***

   ['initialize', [], function (x) {
      B.call (x, 'set', 'tab', 'projects');
      B.call (x, 'set', 'chatProvider', 'openai');
      B.call (x, 'set', 'chatModel', 'gpt-5');
      B.call (x, 'load', 'projects');
      B.call (x, 'read', 'hash');
   }],

   ['read', 'hash', function (x) {
      var parsed = readHashTarget ();
      var currentFile = B.get ('currentFile');
      var leavingDirtyDoc = isDirtyDoc (currentFile) && ! isSameDocTarget (parsed, currentFile, B.get ('currentProject'));

      var applyParsed = function () {
         B.call (x, 'set', 'tab', parsed.tab);
         B.call (x, 'set', 'currentProject', parsed.project);
         B.call (x, 'set', 'hashTarget', parsed);
         if (! parsed.project || ! parsed.target) B.call (x, 'set', 'currentFile', null);
         if (parsed.project) B.call (x, 'load', 'files', parsed.project);
         B.call (x, 'apply', 'hashTarget');
      };

      if (! leavingDirtyDoc) return applyParsed ();

      B.call (x, 'confirm', 'leaveCurrentDoc', applyParsed, function () {
         var backHash = buildHash (B.get ('currentProject'), B.get ('tab') || 'docs', B.get ('currentFile'));
         if (window.location.hash !== backHash) window.location.hash = backHash;
      });
   }],

   ['write', 'hash', function (x) {
      var tab = B.get ('tab') || 'projects';
      var currentFile = B.get ('currentFile');
      var next = buildHash (B.get ('currentProject'), tab, currentFile);
      if (window.location.hash !== next) window.location.hash = next;
   }],

   ['navigate', 'hash', function (x, hash) {
      var parsed = readHashTarget (hash);
      var currentFile = B.get ('currentFile');
      var leavingDirtyDoc = isDirtyDoc (currentFile) && ! isSameDocTarget (parsed, currentFile, B.get ('currentProject'));

      var go = function () {
         if (window.location.hash !== hash) window.location.hash = hash;
         else B.call (x, 'read', 'hash');
      };

      if (! leavingDirtyDoc) return go ();
      B.call (x, 'confirm', 'leaveCurrentDoc', go);
   }],

   ['apply', 'hashTarget', function (x) {
      var parsed = B.get ('hashTarget');
      var files = B.get ('files') || [];
      if (! parsed || ! parsed.target || ! files.length) return;

      if (parsed.tab === 'dialogs') {
         var wanted = dale.stopNot (files, undefined, function (file) {
            var p = parseDialogFilename (file);
            if (p && p.dialogId === parsed.target) return file;
         });
         if (wanted) {
            B.call (x, 'set', 'hashTarget', null);
            return B.call (x, 'load', 'file', wanted);
         }
         return;
      }

      if (inc (files, parsed.target)) {
         B.call (x, 'set', 'hashTarget', null);
         return B.call (x, 'load', 'file', parsed.target);
      }
   }],


   ['report', 'error', function (x, error) {
      alert (typeof error === 'string' ? error : JSON.stringify (error));
   }],

   ['confirm', 'leaveCurrentDoc', function (x, onContinue, onCancel) {
      var currentFile = B.get ('currentFile');
      if (! isDirtyDoc (currentFile)) return onContinue && onContinue ();

      var name = docDisplayName (currentFile.name);
      var save = confirm ('You have unsaved changes in ' + name + '. Save before leaving?');

      if (save) {
         return B.call (x, 'save', 'file', function (x, ok) {
            if (ok) onContinue && onContinue ();
            else onCancel && onCancel ();
         });
      }

      var discard = confirm ('Discard unsaved changes in ' + name + '?');
      if (discard) return onContinue && onContinue ();
      if (onCancel) onCancel ();
   }],

   [/^(get|post|delete)$/, [], {match: function (ev, responder) {
      return B.r.compare (ev.verb, responder.verb);
   }}, function (x, headers, body, cb) {
      c.ajax (x.verb, x.path [0], headers, body, function (error, rs) {
         if (cb) cb (x, error, rs);
      });
   }],

   // *** PROJECTS ***

   ['load', 'projects', function (x) {
      B.call (x, 'get', 'projects', {}, '', function (x, error, rs) {
         if (error) return B.call (x, 'report', 'error', 'Failed to load projects');
         B.call (x, 'set', 'projects', rs.body || []);
      });
   }],

   ['create', 'project', function (x) {
      var name = prompt ('Project name:');
      if (! name || ! name.trim ()) return;
      B.call (x, 'post', 'projects', {}, {name: name.trim ()}, function (x, error, rs) {
         if (error) return B.call (x, 'report', 'error', 'Failed to create project');
         B.call (x, 'load', 'projects');
         B.call (x, 'navigate', 'hash', '#/project/' + encodeURIComponent (name.trim ()) + '/docs');
      });
   }],

   ['snapshot', 'project', function (x, type) {
      var project = B.get ('currentProject');
      if (! project) return;
      B.call (x, 'post', projectPath (project, 'snapshot'), {}, {type: type}, function (x, error, rs) {
         if (error) return B.call (x, 'report', 'error', 'Failed to create snapshot');
         B.call (x, 'load', 'projects');
         alert (type === 'zip' ? ('Zip created: ' + rs.body.file) : ('Project snapshot created: ' + rs.body.name));
      });
   }],

   // *** FILES ***

   ['load', 'files', function (x, project) {
      project = project || B.get ('currentProject');
      if (! project) return B.call (x, 'set', 'files', []);

      B.call (x, 'get', projectPath (project, 'files'), {}, '', function (x, error, rs) {
         if (error) return B.call (x, 'report', 'error', 'Failed to load files');
         B.call (x, 'set', 'files', rs.body);
         B.call (x, 'apply', 'hashTarget');
      });
   }],

   ['load', 'file', function (x, name) {
      var currentFile = B.get ('currentFile');
      var project = B.get ('currentProject');
      if (! project) return;
      var proceed = function () {
         B.call (x, 'set', 'loadingFile', true);
         B.call (x, 'get', projectPath (project, 'file/' + encodeURIComponent (name)), {}, '', function (x, error, rs) {
            B.call (x, 'set', 'loadingFile', false);
            if (error) {
               B.call (x, 'set', 'currentFile', null);
               return B.call (x, 'write', 'hash');
            }
            B.call (x, 'set', 'currentFile', {
               name: rs.body.name,
               content: rs.body.content,
               original: rs.body.content
            });
            B.call (x, 'set', 'tab', rs.body.name.startsWith ('dialog-') ? 'dialogs' : 'docs');
            B.call (x, 'write', 'hash');
         });
      };

      if (isDirtyDoc (currentFile) && currentFile.name !== name) {
         return B.call (x, 'confirm', 'leaveCurrentDoc', proceed);
      }

      proceed ();
   }],

   ['save', 'file', function (x, cb) {
      var file = B.get ('currentFile');
      if (! file) {
         if (cb) cb (x, false);
         return;
      }

      var project = B.get ('currentProject');
      if (! project) return;

      B.call (x, 'set', 'savingFile', true);
      B.call (x, 'post', projectPath (project, 'file/' + encodeURIComponent (file.name)), {}, {content: file.content}, function (x, error, rs) {
         B.call (x, 'set', 'savingFile', false);
         if (error) {
            B.call (x, 'report', 'error', 'Failed to save file');
            if (cb) cb (x, false);
            return;
         }
         B.call (x, 'set', ['currentFile', 'original'], file.content);
         B.call (x, 'load', 'files');
         if (cb) cb (x, true);
      });
   }],

   ['create', 'file', function (x) {
      var name = prompt ('File name (must end in .md):');
      if (! name) return;
      if (! name.endsWith ('.md')) name += '.md';
      name = normalizeDocFilename (name);

      var project = B.get ('currentProject');
      if (! project) return;

      B.call (x, 'post', projectPath (project, 'file/' + encodeURIComponent (name)), {}, {content: '# ' + docDisplayName (name).replace ('.md', '') + '\n\n'}, function (x, error, rs) {
         if (error) return B.call (x, 'report', 'error', 'Failed to create file');
         B.call (x, 'load', 'files');
         B.call (x, 'load', 'file', name);
      });
   }],

   ['delete', 'file', function (x, name) {
      if (! confirm ('Delete ' + name + '?')) return;

      var currentFile = B.get ('currentFile');
      if (currentFile && currentFile.name === name) {
         B.call (x, 'set', 'currentFile', null);
         B.call (x, 'write', 'hash');
      }

      var project = B.get ('currentProject');
      if (! project) return;

      B.call (x, 'delete', projectPath (project, 'file/' + encodeURIComponent (name)), {}, '', function (x, error, rs) {
         if (error) return B.call (x, 'report', 'error', 'Failed to delete file');
         B.call (x, 'load', 'files');
      });
   }],

   ['close', 'file', function (x) {
      var proceed = function () {
         B.call (x, 'set', 'currentFile', null);
         B.call (x, 'write', 'hash');
      };

      if (isDirtyDoc (B.get ('currentFile'))) return B.call (x, 'confirm', 'leaveCurrentDoc', proceed);
      proceed ();
   }],

   ['keydown', 'editor', function (x, ev) {
      // Cmd/Ctrl+S to save
      if ((ev.metaKey || ev.ctrlKey) && ev.key === 's') {
         ev.preventDefault ();
         B.call (x, 'save', 'file');
      }
   }],

   // *** DIALOGS ***

   ['create', 'dialog', function (x) {
      var name = prompt ('Dialog name:');
      if (! name || ! name.trim ()) return;

      var project = B.get ('currentProject');
      if (! project) return;

      var provider = B.get ('chatProvider') || 'openai';
      var model = B.get ('chatModel') || defaultModelForProvider (provider);

      B.call (x, 'post', projectPath (project, 'dialog/new'), {}, {
         provider: provider,
         model: model,
         slug: name.trim ()
      }, function (x, error, rs) {
         if (error) return B.call (x, 'report', 'error', 'Failed to create dialog');

         B.call (x, 'set', 'pendingToolCalls', null);
         B.call (x, 'set', 'streaming', false);
         B.call (x, 'set', 'applyingToolDecisions', false);
         B.call (x, 'set', 'streamingContent', '');
         B.call (x, 'set', 'optimisticUserMessage', null);
         B.call (x, 'set', 'chatInput', '');

         B.call (x, 'load', 'files');
         if (rs && rs.body && rs.body.filename) B.call (x, 'load', 'file', rs.body.filename);
      });
   }],

   ['change', 'chatProvider', function (x, provider) {
      B.call (x, 'set', 'chatProvider', provider);
      var model = B.get ('chatModel');
      var allowed = dale.stopNot ((MODEL_OPTIONS [provider] || []), undefined, function (option) {
         if (option.value === model) return true;
      });
      if (! allowed) B.call (x, 'set', 'chatModel', defaultModelForProvider (provider));
   }],

   ['send', 'message', function (x) {
      var file = B.get ('currentFile');
      var input = B.get ('chatInput');
      var project = B.get ('currentProject');
      if (! project) return;
      var provider = B.get ('chatProvider') || 'openai';
      var model = B.get ('chatModel') || defaultModelForProvider (provider);
      if (! input || ! input.trim ()) return;

      var originalInput = input.trim ();

      B.call (x, 'set', 'streaming', true);
      B.call (x, 'set', 'applyingToolDecisions', false);
      B.call (x, 'set', 'streamingContent', '');
      B.call (x, 'set', 'pendingToolCalls', null);
      B.call (x, 'set', 'optimisticUserMessage', originalInput);
      B.call (x, 'set', 'chatInput', '');
      var inputNode = document.querySelector ('.chat-input');
      if (inputNode) inputNode.value = '';

      var parsed = file && parseDialogFilename (file.name);
      var method = parsed ? 'PUT' : 'POST';
      var payload = parsed
         ? {
            dialogId: parsed.dialogId,
            provider: provider,
            prompt: originalInput,
            model: model || undefined
         }
         : {
            provider: provider,
            prompt: originalInput,
            model: model || undefined
         };

      fetch (projectPath (project, 'dialog'), {
         method: method,
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify (payload)
      }).then (function (response) {
         B.call (x, 'process', 'stream', response, file ? file.name : null, originalInput);
      }).catch (function (err) {
         B.call (x, 'report', 'error', 'Failed to send: ' + err.message);
         B.call (x, 'set', 'streaming', false);
         B.call (x, 'set', 'applyingToolDecisions', false);
         B.call (x, 'set', 'optimisticUserMessage', null);
         B.call (x, 'set', 'chatInput', originalInput);
      });
   }],

   // Process stream response (SSE or JSON fallback)
   ['process', 'stream', function (x, response, filename, originalInput) {
      var targetFilename = filename;
      var contentType = (response.headers && response.headers.get ('content-type')) || '';

      var finalize = function () {
         var pendingCalls = B.get ('pendingToolCalls');
         B.call (x, 'set', 'streaming', false);
         B.call (x, 'set', 'applyingToolDecisions', false);
         B.call (x, 'set', 'optimisticUserMessage', null);
         if (targetFilename) B.call (x, 'load', 'file', targetFilename);
         B.call (x, 'load', 'files');
         if (! pendingCalls || pendingCalls.length === 0) B.call (x, 'set', 'pendingToolCalls', null);
      };

      if (! response.ok) {
         return response.text ().then (function (text) {
            B.call (x, 'report', 'error', 'Request failed: ' + response.status + ' ' + text);
            B.call (x, 'set', 'streaming', false);
            B.call (x, 'set', 'applyingToolDecisions', false);
            B.call (x, 'set', 'optimisticUserMessage', null);
            if (originalInput) B.call (x, 'set', 'chatInput', originalInput);
         });
      }

      if (contentType.indexOf ('text/event-stream') === -1 || ! response.body) {
         return response.json ().then (function (data) {
            if (data && data.filename) targetFilename = data.filename;
            finalize ();
         }).catch (function () {
            finalize ();
         });
      }

      var reader = response.body.getReader ();
      var decoder = new TextDecoder ();
      var buffer = '';

      function read () {
         reader.read ().then (function (result) {
            if (result.done) return finalize ();

            buffer += decoder.decode (result.value, {stream: true});
            var lines = buffer.split ('\n');
            buffer = lines.pop ();

            dale.go (lines, function (line) {
               if (! line.startsWith ('data: ')) return;

               try {
                  var data = JSON.parse (line.slice (6));
                  if (data.type === 'chunk') {
                     var current = B.get ('streamingContent') || '';
                     B.call (x, 'set', 'streamingContent', current + data.content);
                  }
                  else if (data.type === 'tool_request') {
                     if (data.filename) targetFilename = data.filename;
                     var pendingTools = dale.go (data.toolCalls || [], function (tool) {
                        return {
                           id: tool.id,
                           name: tool.name,
                           input: tool.input,
                           approved: null,
                           alwaysAllow: false,
                           expanded: false,
                           diffExpanded: false
                        };
                     });
                     B.call (x, 'set', 'pendingToolCalls', pendingTools);
                     B.call (x, 'set', 'streaming', false);
                     B.call (x, 'set', 'applyingToolDecisions', false);
                     if (targetFilename) B.call (x, 'load', 'file', targetFilename);
                  }
                  else if (data.type === 'done') {
                     if (data.result && data.result.filename) targetFilename = data.result.filename;
                  }
                  else if (data.type === 'error') {
                     B.call (x, 'report', 'error', data.error);
                     B.call (x, 'set', 'streaming', false);
                     B.call (x, 'set', 'applyingToolDecisions', false);
                     B.call (x, 'set', 'optimisticUserMessage', null);
                     if (originalInput) B.call (x, 'set', 'chatInput', originalInput);
                  }
               }
               catch (e) {}
            });

            read ();
         }).catch (function (error) {
            B.call (x, 'report', 'error', 'Stream error: ' + error.message);
            B.call (x, 'set', 'streaming', false);
            B.call (x, 'set', 'applyingToolDecisions', false);
            B.call (x, 'set', 'optimisticUserMessage', null);
            if (originalInput) B.call (x, 'set', 'chatInput', originalInput);
         });
      }

      read ();
   }],

   ['maybe', 'submitToolDecisions', function (x) {
      if (B.get ('applyingToolDecisions')) return;
      var pendingToolCalls = B.get ('pendingToolCalls');
      if (! pendingToolCalls || ! pendingToolCalls.length) return;

      var allChosen = dale.stop (pendingToolCalls, false, function (tool) {
         return tool.approved === true || tool.approved === false;
      });
      if (allChosen !== false) B.call (x, 'submit', 'toolDecisions');
   }],

   // Approve a pending tool request
   ['approve', 'tool', function (x, toolIndex) {
      var pendingToolCalls = B.get ('pendingToolCalls');
      if (! pendingToolCalls) return;
      B.call (x, 'set', ['pendingToolCalls', toolIndex, 'approved'], true);
      B.call (x, 'maybe', 'submitToolDecisions');
   }],

   // Deny a tool call
   ['deny', 'tool', function (x, toolIndex) {
      var pendingToolCalls = B.get ('pendingToolCalls');
      if (! pendingToolCalls) return;
      B.call (x, 'set', ['pendingToolCalls', toolIndex, 'approved'], false);
      B.call (x, 'maybe', 'submitToolDecisions');
   }],

   // Approve all pending tools at once
   ['approve', 'allTools', function (x) {
      var pendingToolCalls = B.get ('pendingToolCalls');
      if (! pendingToolCalls) return;
      dale.go (pendingToolCalls, function (tool, index) {
         B.call (x, 'set', ['pendingToolCalls', index, 'approved'], true);
      });
      B.call (x, 'maybe', 'submitToolDecisions');
   }],

   ['toggle', 'alwaysAllowTool', function (x, toolIndex) {
      var current = B.get (['pendingToolCalls', toolIndex, 'alwaysAllow']);
      B.call (x, 'set', ['pendingToolCalls', toolIndex, 'alwaysAllow'], ! current);
   }],

   ['toggle', 'toolInputExpanded', function (x, toolIndex) {
      var current = B.get (['pendingToolCalls', toolIndex, 'expanded']);
      B.call (x, 'set', ['pendingToolCalls', toolIndex, 'expanded'], ! current);
   }],

   ['toggle', 'toolDiffExpanded', function (x, toolIndex) {
      var current = B.get (['pendingToolCalls', toolIndex, 'diffExpanded']);
      B.call (x, 'set', ['pendingToolCalls', toolIndex, 'diffExpanded'], ! current);
   }],

   // Submit tool decisions to PUT /dialog
   ['submit', 'toolDecisions', function (x) {
      var pendingToolCalls = B.get ('pendingToolCalls');
      var file = B.get ('currentFile');
      if (! pendingToolCalls || ! file) return;

      var parsed = parseDialogFilename (file.name);
      if (! parsed) return B.call (x, 'report', 'error', 'Current file is not a statused dialog');

      var allChosen = dale.stop (pendingToolCalls, false, function (tool) {
         return tool.approved === true || tool.approved === false;
      });
      if (allChosen === false) return B.call (x, 'report', 'error', 'Approve or deny each tool request first');

      var decisionsLines = dale.go (pendingToolCalls, function (tool) {
         return tool.id + ': ' + (tool.approved === true ? 'approve' : 'deny');
      });
      var decisions = 'əəə\n' + decisionsLines.join ('\n') + '\nəəə';

      var authorizationsMap = {};
      dale.go (pendingToolCalls, function (tool) {
         if (tool.approved === true && tool.alwaysAllow) authorizationsMap [tool.name] = true;
      });
      var authLines = dale.go (Object.keys (authorizationsMap), function (name) {return 'allow ' + name;});
      var authorizations = authLines.length ? ('əəə\n' + authLines.join ('\n') + '\nəəə') : undefined;

      B.call (x, 'set', 'streaming', true);
      B.call (x, 'set', 'applyingToolDecisions', true);
      B.call (x, 'set', 'streamingContent', '');
      B.call (x, 'set', 'pendingToolCalls', null);

      fetch (projectPath (B.get ('currentProject'), 'dialog'), {
         method: 'PUT',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify ({
            dialogId: parsed.dialogId,
            decisions: decisions,
            authorizations: authorizations
         })
      }).then (function (response) {
         B.call (x, 'process', 'stream', response, file.name, null);
      }).catch (function (err) {
         B.call (x, 'report', 'error', 'Failed to submit tool results: ' + err.message);
         B.call (x, 'set', 'streaming', false);
         B.call (x, 'set', 'applyingToolDecisions', false);
      });
   }],

   ['stop', 'dialog', function (x) {
      var file = B.get ('currentFile');
      var parsed = file && parseDialogFilename (file.name);
      if (! parsed) return;

      fetch (projectPath (B.get ('currentProject'), 'dialog'), {
         method: 'PUT',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify ({
            dialogId: parsed.dialogId,
            status: 'waiting'
         })
      }).then (function (response) {
         if (! response.ok) return response.text ().then (function (text) {throw new Error (text || ('HTTP ' + response.status));});
         return response.json ().then (function () {
            B.call (x, 'set', 'streaming', false);
            B.call (x, 'set', 'applyingToolDecisions', false);
            B.call (x, 'set', 'streamingContent', '');
            B.call (x, 'set', 'optimisticUserMessage', null);

            fetch (projectPath (B.get ('currentProject'), 'dialogs')).then (function (rs) {
               if (! rs.ok) return null;
               return rs.json ();
            }).then (function (dialogs) {
               B.call (x, 'load', 'files');
               var found = dale.stopNot (dialogs || [], undefined, function (item) {
                  if (item.dialogId === parsed.dialogId) return item.filename;
               });
               if (found) B.call (x, 'load', 'file', found);
            }).catch (function () {
               B.call (x, 'load', 'files');
            });
         });
      }).catch (function (error) {
         B.call (x, 'report', 'error', 'Failed to stop dialog: ' + error.message);
      });
   }],

   ['keydown', 'chatInput', function (x, ev) {
      if ((ev.metaKey || ev.ctrlKey) && ev.key === 'Enter') {
         ev.preventDefault ();
         B.call (x, 'send', 'message');
      }
   }],
]);

// *** VIEWS ***

var views = {};

views.css = [
   ['body', {
      'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: 0,
      padding: 0,
      'background-color': '#1a1a2e',
      color: '#eee',
      height: '100vh',
   }],
   ['.container', {
      display: 'flex',
      'flex-direction': 'column',
      height: '100vh',
      'max-width': '1200px',
      margin: '0 auto',
      padding: '1rem',
   }],
   ['button', {
      padding: '0.75rem 1.5rem',
      'border-radius': '8px',
      border: 'none',
      cursor: 'pointer',
      'font-weight': 'bold',
      transition: 'background-color 0.2s',
   }],
   ['button.primary', {
      'background-color': '#4a69bd',
      color: 'white',
   }],
   ['button.primary:hover', {
      'background-color': '#1e3799',
   }],
   ['button:disabled', {
      opacity: 0.5,
      cursor: 'not-allowed',
   }],
   ['.header', {
      display: 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
      'margin-bottom': '1rem',
   }],
   // Tabs
   ['.tabs', {
      display: 'flex',
      gap: '0.5rem',
      'margin-bottom': '1rem',
   }],
   ['.tab', {
      padding: '0.5rem 1rem',
      'border-radius': '8px 8px 0 0',
      border: 'none',
      cursor: 'pointer',
      'background-color': '#16213e',
      color: '#888',
      'font-weight': 'bold',
      transition: 'all 0.2s',
   }],
   ['.tab:hover', {
      'background-color': '#1a2a4a',
      color: '#aaa',
   }],
   ['.tab-active', {
      'background-color': '#4a69bd',
      color: 'white',
   }],
   ['.tab-active:hover', {
      'background-color': '#4a69bd',
      color: 'white',
   }],
   // Files view
   ['.files-container', {
      display: 'flex',
      flex: 1,
      gap: '1rem',
      'min-height': 0,
   }],
   ['.file-list', {
      width: '250px',
      'background-color': '#16213e',
      'border-radius': '8px',
      padding: '1rem',
      'overflow-y': 'auto',
   }],
   ['.file-list-header', {
      display: 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
      'margin-bottom': '0.75rem',
      'padding-bottom': '0.5rem',
      'border-bottom': '1px solid #333',
   }],
   ['.file-list-title', {
      'font-weight': 'bold',
      color: '#888',
      'font-size': '12px',
      'text-transform': 'uppercase',
   }],
   ['.file-item', {
      padding: '0.5rem 0.75rem',
      'border-radius': '4px',
      cursor: 'pointer',
      display: 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
      'margin-bottom': '0.25rem',
      transition: 'background-color 0.2s',
   }],
   ['.file-item:hover', {
      'background-color': '#1a2a4a',
   }],
   ['.file-item-active', {
      'background-color': '#4a69bd',
   }],
   ['.file-item-active:hover', {
      'background-color': '#4a69bd',
   }],
   ['.file-name', {
      'white-space': 'nowrap',
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
   }],
   ['.dialog-name', {
      flex: 1,
      'white-space': 'normal',
      overflow: 'visible',
      'text-overflow': 'clip',
      'word-break': 'break-word',
      'line-height': 1.3,
      'padding-right': '0.5rem'
   }],
   ['.file-delete', {
      opacity: 0,
      color: '#ff8b94',
      cursor: 'pointer',
      padding: '0.25rem',
      transition: 'opacity 0.2s',
   }],
   ['.file-item:hover .file-delete', {
      opacity: 1,
   }],
   ['.btn-small', {
      padding: '0.25rem 0.5rem',
      'font-size': '12px',
   }],
   // Editor
   ['.editor-container', {
      flex: 1,
      display: 'flex',
      'flex-direction': 'column',
      'min-width': 0,
   }],
   ['.editor-header', {
      display: 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
      'margin-bottom': '0.5rem',
   }],
   ['.editor-filename', {
      'font-weight': 'bold',
      color: '#94b8ff',
   }],
   ['.editor-dirty', {
      color: '#ffd93d',
      'margin-left': '0.5rem',
   }],
   ['.editor-actions', {
      display: 'flex',
      gap: '0.5rem',
   }],
   ['.editor-textarea', {
      flex: 1,
      width: '100%',
      padding: '1rem',
      'border-radius': '8px',
      border: 'none',
      'background-color': '#16213e',
      color: '#eee',
      'font-family': 'Monaco, Consolas, monospace',
      'font-size': '14px',
      'line-height': 1.6,
      resize: 'none',
   }],
   ['.editor-textarea:focus', {
      outline: '2px solid #4a69bd',
   }],
   ['.editor-empty', {
      flex: 1,
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      color: '#888',
      'background-color': '#16213e',
      'border-radius': '8px',
   }],
   // Dialogs
   ['.chat-container', {
      flex: 1,
      display: 'flex',
      'flex-direction': 'column',
      'min-width': 0,
   }],
   ['.chat-messages', {
      flex: 1,
      'overflow-y': 'auto',
      padding: '1rem',
      'background-color': '#16213e',
      'border-radius': '8px 8px 0 0',
   }],
   ['.chat-message', {
      'margin-bottom': '1rem',
      padding: '0.75rem 1rem',
      'border-radius': '8px',
      'max-width': '85%',
   }],
   ['.chat-user', {
      'background-color': '#1f4d35',
      'margin-left': 'auto',
   }],
   ['.chat-assistant', {
      'background-color': '#3d2b5a',
   }],
   ['.chat-role', {
      'font-size': '11px',
      'text-transform': 'uppercase',
      color: '#888',
      'margin-bottom': '0.25rem',
      display: 'flex',
      'justify-content': 'space-between',
      gap: '0.75rem'
   }],
   ['.chat-meta', {
      'text-transform': 'none',
      'font-size': '11px',
      color: '#9aa4bf'
   }],
   ['.chat-content', {
      'white-space': 'pre-wrap',
      'word-wrap': 'break-word',
   }],
   ['.chat-input-area', {
      display: 'flex',
      gap: '0.5rem',
      padding: '0.5rem',
      'background-color': '#16213e',
      'border-radius': '0 0 8px 8px',
      'border-top': '1px solid #333',
   }],
   ['.chat-input', {
      flex: 1,
      padding: '0.75rem',
      'border-radius': '8px',
      border: 'none',
      'background-color': '#1a1a2e',
      color: '#eee',
      'font-family': 'inherit',
      'font-size': '14px',
      resize: 'none',
   }],
   ['.chat-input:focus', {
      outline: '2px solid #4a69bd',
   }],
   ['.provider-select', {
      padding: '0.5rem',
      'border-radius': '8px',
      border: 'none',
      'background-color': '#1a1a2e',
      color: '#eee',
   }],
   // Tool calls
   ['.tool-requests', {
      'background-color': '#2a2a4e',
      'border-radius': '8px',
      padding: '1rem',
      'margin-bottom': '0.5rem',
      border: '2px solid #f0ad4e',
   }],
   ['.tool-requests-header', {
      display: 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
      'margin-bottom': '0.75rem',
      'padding-bottom': '0.5rem',
      'border-bottom': '1px solid #444',
   }],
   ['.tool-requests-title', {
      'font-weight': 'bold',
      color: '#f0ad4e',
   }],
   ['.tool-request', {
      'background-color': '#1a1a2e',
      'border-radius': '6px',
      padding: '0.75rem',
      'margin-bottom': '0.5rem',
   }],
   ['.tool-request-header', {
      display: 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
      'margin-bottom': '0.5rem',
   }],
   ['.tool-name', {
      'font-weight': 'bold',
      color: '#94b8ff',
   }],
   ['.tool-input', {
      'font-family': 'Monaco, Consolas, monospace',
      'font-size': '12px',
      'background-color': '#0d0d1a',
      padding: '0.5rem',
      'border-radius': '4px',
      'white-space': 'pre-wrap',
      'word-break': 'break-all',
      'max-height': '150px',
      'overflow-y': 'auto',
      'margin-bottom': '0.5rem',
   }],
   ['.tool-input-expanded', {
      'max-height': 'none',
   }],
   ['.tool-diff', {
      'font-family': 'Monaco, Consolas, monospace',
      'font-size': '12px',
      'background-color': '#0d0d1a',
      padding: '0.5rem',
      'border-radius': '4px',
      'white-space': 'pre-wrap',
      'word-break': 'break-word',
      'margin-bottom': '0.5rem',
      border: '1px solid #2f2f4a'
   }],
   ['.tool-diff-line', {
      color: '#a0aec0'
   }],
   ['.tool-diff-add', {
      color: '#6ad48a'
   }],
   ['.tool-diff-del', {
      color: '#ff8b94'
   }],
   ['.tool-diff-skip', {
      color: '#8d93ab',
      'font-style': 'italic'
   }],
   ['.tool-actions', {
      display: 'flex',
      gap: '0.5rem',
   }],
   ['.tool-btn-approve', {
      'background-color': '#27ae60',
      color: 'white',
   }],
   ['.tool-btn-approve:hover', {
      'background-color': '#219a52',
   }],
   ['.tool-btn-deny', {
      'background-color': '#e74c3c',
      color: 'white',
   }],
   ['.tool-btn-deny:hover', {
      'background-color': '#c0392b',
   }],
   ['.tool-status', {
      'font-size': '12px',
      color: '#888',
      'font-style': 'italic',
   }],
   ['.tool-result', {
      'font-family': 'Monaco, Consolas, monospace',
      'font-size': '11px',
      'background-color': '#0d0d1a',
      padding: '0.5rem',
      'border-radius': '4px',
      'white-space': 'pre-wrap',
      'word-break': 'break-all',
      'max-height': '100px',
      'overflow-y': 'auto',
      color: '#7fba00',
   }],
   ['.tool-result-error', {
      color: '#e74c3c',
   }],
];

views.files = function () {
   return B.view ([['files'], ['currentFile'], ['loadingFile'], ['savingFile']], function (files, currentFile, loadingFile, savingFile) {
      var docFiles = dale.fil (files || [], undefined, function (name) {
         if (! name.startsWith ('dialog-')) return name;
      });
      var isDirty = currentFile && currentFile.content !== currentFile.original;

      return ['div', {class: 'files-container'}, [
         // File list sidebar
         ['div', {class: 'file-list'}, [
            ['div', {class: 'file-list-header'}, [
               ['span', {class: 'file-list-title'}, 'Docs'],
               ['button', {class: 'primary btn-small', onclick: B.ev ('create', 'file')}, '+ New']
            ]],
            docFiles && docFiles.length > 0
               ? dale.go (docFiles, function (name) {
                  var isActive = currentFile && currentFile.name === name;
                  return ['div', {
                     class: 'file-item' + (isActive ? ' file-item-active' : ''),
                     onclick: B.ev ('load', 'file', name)
                  }, [
                     ['span', {class: 'file-name'}, docDisplayName (name)],
                     ['span', {
                        class: 'file-delete',
                        onclick: B.ev ('delete', 'file', name, {stopPropagation: true})
                     }, '×']
                  ]];
               })
               : ['div', {style: style ({color: '#666', 'font-size': '13px'})}, 'No docs yet']
         ]],
         // Editor
         ['div', {class: 'editor-container'}, currentFile ? [
            ['div', {class: 'editor-header'}, [
               ['div', [
                  ['span', {class: 'editor-filename'}, docDisplayName (currentFile.name)],
                  isDirty ? ['span', {class: 'editor-dirty'}, '(unsaved)'] : ''
               ]],
               ['div', {class: 'editor-actions'}, [
                  ['button', {
                     class: 'primary btn-small',
                     onclick: B.ev ('save', 'file'),
                     disabled: savingFile || ! isDirty
                  }, savingFile ? 'Saving...' : 'Save'],
                  ['button', {
                     class: 'btn-small',
                     style: style ({'background-color': '#444'}),
                     onclick: B.ev ('close', 'file')
                  }, 'Close']
               ]]
            ]],
            ['textarea', {
               class: 'editor-textarea',
               oninput: B.ev ('set', ['currentFile', 'content']),
               onkeydown: B.ev ('keydown', 'editor', {raw: 'event'})
            }, currentFile.content]
         ] : ['div', {class: 'editor-empty'}, loadingFile ? 'Loading...' : 'Select a doc to edit']]
      ]];
   });
};

// Parse markdown dialog into messages
var parseDialogContent = function (content) {
   if (! content) return [];

   var parseSection = function (role, lines) {
      var time = null, usage = null, usageCumulative = null;
      var body = [];

      dale.go (lines, function (line) {
         var mTime = line.match (/^>\s*Time:\s*(.+)$/);
         if (mTime) {
            time = mTime [1].trim ();
            return;
         }

         var mUsage = line.match (/^>\s*Usage:\s*input=(\d+)\s+output=(\d+)\s+total=(\d+)\s*$/);
         if (mUsage) {
            usage = {input: Number (mUsage [1]), output: Number (mUsage [2]), total: Number (mUsage [3])};
            return;
         }

         var mUsageCum = line.match (/^>\s*Usage cumulative:\s*input=(\d+)\s+output=(\d+)\s+total=(\d+)\s*$/);
         if (mUsageCum) {
            usageCumulative = {input: Number (mUsageCum [1]), output: Number (mUsageCum [2]), total: Number (mUsageCum [3])};
            return;
         }

         body.push (line);
      });

      var cleaned = body.join ('\n').replace (/^\n+/, '').replace (/\s+$/, '');
      if (! cleaned) return null;

      return {
         role: role,
         content: cleaned,
         time: time,
         usage: usage,
         usageCumulative: usageCumulative
      };
   };

   var messages = [];
   var lines = content.split ('\n');
   var currentRole = null;
   var currentLines = [];

   var flush = function () {
      if (! currentRole) return;
      var parsed = parseSection (currentRole, currentLines);
      if (parsed) messages.push (parsed);
   };

   dale.go (lines, function (line) {
      if (line.startsWith ('## User')) {
         flush ();
         currentRole = 'user';
         currentLines = [];
      }
      else if (line.startsWith ('## Assistant')) {
         flush ();
         currentRole = 'assistant';
         currentLines = [];
      }
      else if (currentRole) currentLines.push (line);
   });

   flush ();
   return messages;
};

var summarizeToolInput = function (tool, expanded) {
   var input = JSON.parse (JSON.stringify (tool.input || {}));

   if (tool.name === 'write_file' && type (input.content) === 'string') {
      input.content = '[hidden file content: ' + input.content.length + ' chars]';
   }
   if (tool.name === 'edit_file') {
      if (type (input.old_string) === 'string') input.old_string = '[hidden old_string: ' + input.old_string.length + ' chars]';
      if (type (input.new_string) === 'string') input.new_string = '[hidden new_string: ' + input.new_string.length + ' chars]';
   }

   var full = JSON.stringify (input, null, 2);

   var maxChars = 180;
   var maxLines = 6;
   var lines = full.split ('\n');
   var isLong = full.length > maxChars || lines.length > maxLines;

   if (expanded || ! isLong) return {text: full, isLong: isLong};

   var shortLines = lines.slice (0, maxLines).join ('\n');
   if (shortLines.length > maxChars) shortLines = shortLines.slice (0, maxChars);
   shortLines = shortLines.replace (/\s+$/, '') + '\n...';

   return {text: shortLines, isLong: true};
};

var buildEditDiff = function (oldText, newText) {
   oldText = type (oldText) === 'string' ? oldText : '';
   newText = type (newText) === 'string' ? newText : '';

   var a = oldText.split ('\n');
   var b = newText.split ('\n');

   var n = a.length, m = b.length;
   var dp = [];
   for (var i = 0; i <= n; i++) {
      dp [i] = [];
      for (var j = 0; j <= m; j++) dp [i][j] = 0;
   }

   for (i = n - 1; i >= 0; i--) {
      for (j = m - 1; j >= 0; j--) {
         if (a [i] === b [j]) dp [i][j] = dp [i + 1][j + 1] + 1;
         else dp [i][j] = Math.max (dp [i + 1][j], dp [i][j + 1]);
      }
   }

   var lines = [];
   i = 0; j = 0;
   while (i < n && j < m) {
      if (a [i] === b [j]) {
         lines.push ({type: 'context', text: '  ' + a [i]});
         i++; j++;
      }
      else if (dp [i + 1][j] >= dp [i][j + 1]) {
         lines.push ({type: 'del', text: '- ' + a [i]});
         i++;
      }
      else {
         lines.push ({type: 'add', text: '+ ' + b [j]});
         j++;
      }
   }
   while (i < n) lines.push ({type: 'del', text: '- ' + a [i++]});
   while (j < m) lines.push ({type: 'add', text: '+ ' + b [j++]});

   return lines;
};

var compactDiffLines = function (lines, full, contextLines) {
   contextLines = contextLines || 3;
   if (full) return {lines: lines, compacted: false};

   var include = [];
   for (var i = 0; i < lines.length; i++) include [i] = false;

   var changed = false;
   for (i = 0; i < lines.length; i++) {
      if (lines [i].type === 'add' || lines [i].type === 'del') {
         changed = true;
         var start = Math.max (0, i - contextLines);
         var end = Math.min (lines.length - 1, i + contextLines);
         for (var k = start; k <= end; k++) include [k] = true;
      }
   }

   if (! changed) return {lines: lines.slice (0, Math.min (lines.length, 2 * contextLines + 1)), compacted: lines.length > (2 * contextLines + 1)};

   var out = [];
   var compacted = false;
   i = 0;
   while (i < lines.length) {
      if (include [i]) {
         out.push (lines [i]);
         i++;
         continue;
      }

      var startGap = i;
      while (i < lines.length && ! include [i]) i++;
      var gap = i - startGap;
      if (gap > 0) {
         compacted = true;
         out.push ({type: 'skip', text: '… ' + gap + ' unchanged line' + (gap === 1 ? '' : 's') + ' hidden'});
      }
   }

   return {lines: out, compacted: compacted};
};

var renderEditDiff = function (tool, index, applyingToolDecisions) {
   var input = tool.input || {};
   var oldText = type (input.old_string) === 'string' ? input.old_string : '';
   var newText = type (input.new_string) === 'string' ? input.new_string : '';

   var rawLines = buildEditDiff (oldText, newText);
   var compactView = compactDiffLines (rawLines, false, 3);
   var display = tool.diffExpanded === true ? compactDiffLines (rawLines, true, 3) : compactView;

   return ['div', [
      ['div', {class: 'tool-input'}, JSON.stringify ({path: input.path || ''}, null, 2)],
      ['div', {class: 'tool-diff'}, dale.go (display.lines, function (line) {
         var cls = 'tool-diff-line';
         if (line.type === 'add') cls += ' tool-diff-add';
         else if (line.type === 'del') cls += ' tool-diff-del';
         else if (line.type === 'skip') cls += ' tool-diff-skip';
         return ['div', {class: cls}, line.text];
      })],
      compactView.compacted ? ['div', {style: style ({display: 'flex', 'justify-content': 'flex-end', 'margin-bottom': '0.4rem'})}, [
         ['button', {
            class: 'btn-small',
            style: style ({'background-color': '#3a3a5f', color: '#c9d4ff'}),
            onclick: B.ev ('toggle', 'toolDiffExpanded', index),
            disabled: applyingToolDecisions
         }, tool.diffExpanded === true ? 'Show compact diff' : 'Show full diff']
      ]] : ''
   ]];
};

// Render tool request UI
views.toolRequests = function (pendingToolCalls, applyingToolDecisions) {
   if (! pendingToolCalls || pendingToolCalls.length === 0) return '';

   var allChosen = dale.stop (pendingToolCalls, false, function (tool) {
      return tool.approved === true || tool.approved === false;
   }) !== false;

   return ['div', {class: 'tool-requests'}, [
      ['div', {class: 'tool-requests-header'}, [
         ['span', {class: 'tool-requests-title'}, 'Tool Requests (' + pendingToolCalls.length + ')'],
         ['div', {style: style ({display: 'flex', gap: '0.5rem'})}, [
            ['button', {
               class: 'btn-small tool-btn-approve',
               onclick: B.ev ('approve', 'allTools'),
               disabled: applyingToolDecisions
            }, 'Approve All']
         ]]
      ]],
      dale.go (pendingToolCalls, function (tool, index) {
         var inputSummary = summarizeToolInput (tool, tool.expanded === true);
         var inputUI = tool.name === 'edit_file'
            ? renderEditDiff (tool, index, applyingToolDecisions)
            : ['div', [
               ['div', {class: 'tool-input' + (tool.expanded === true ? ' tool-input-expanded' : '')}, inputSummary.text],
               inputSummary.isLong ? ['div', {style: style ({display: 'flex', 'justify-content': 'flex-end', 'margin-bottom': '0.4rem'})}, [
                  ['button', {
                     class: 'btn-small',
                     style: style ({'background-color': '#3a3a5f', color: '#c9d4ff'}),
                     onclick: B.ev ('toggle', 'toolInputExpanded', index),
                     disabled: applyingToolDecisions
                  }, tool.expanded === true ? 'Collapse' : 'Expand']
               ]] : ''
            ]];

         return ['div', {class: 'tool-request'}, [
            ['div', {class: 'tool-request-header'}, [
               ['span', {class: 'tool-name'}, tool.name],
               tool.approved === true ? ['span', {class: 'tool-status'}, 'Approved'] :
               tool.approved === false ? ['span', {class: 'tool-status'}, 'Denied'] :
               ['div', {class: 'tool-actions'}, [
                  ['button', {
                     class: 'btn-small tool-btn-approve',
                     onclick: B.ev ('approve', 'tool', index),
                     disabled: applyingToolDecisions
                  }, 'Approve'],
                  ['button', {
                     class: 'btn-small tool-btn-deny',
                     onclick: B.ev ('deny', 'tool', index),
                     disabled: applyingToolDecisions
                  }, 'Deny']
               ]]
            ]],
            inputUI,
            ['label', {style: style ({display: 'flex', gap: '0.4rem', 'align-items': 'center', 'font-size': '12px', color: '#aaa'})}, [
               ['input', {
                  type: 'checkbox',
                  checked: tool.alwaysAllow === true,
                  onchange: B.ev ('toggle', 'alwaysAllowTool', index),
                  disabled: applyingToolDecisions
               }],
               'Always allow ' + tool.name + ' in this dialog'
            ]]
         ]];
      }),
      ['div', {style: style ({display: 'flex', 'justify-content': 'flex-end', 'margin-top': '0.75rem', color: '#9aa4bf', 'font-size': '12px'})},
         applyingToolDecisions ? 'Applying decisions…' : (allChosen ? 'Decisions selected. Sending…' : 'Approve or deny each tool request')
      ]
   ]];
};

views.dialogs = function () {
   return B.view ([['files'], ['currentFile'], ['loadingFile'], ['chatInput'], ['chatProvider'], ['chatModel'], ['streaming'], ['streamingContent'], ['pendingToolCalls'], ['optimisticUserMessage'], ['applyingToolDecisions']], function (files, currentFile, loadingFile, chatInput, chatProvider, chatModel, streaming, streamingContent, pendingToolCalls, optimisticUserMessage, applyingToolDecisions) {

      var dialogFiles = dale.fil (files, undefined, function (f) {
         if (f.startsWith ('dialog-')) return f;
      });

      var isDialog = currentFile && currentFile.name.startsWith ('dialog-');
      var messages = isDialog ? parseDialogContent (currentFile.content) : [];

      var hasPendingTools = pendingToolCalls && pendingToolCalls.length > 0;

      return ['div', {class: 'files-container'}, [
         // Dialog list sidebar
         ['div', {class: 'file-list'}, [
            ['div', {class: 'file-list-header'}, [
               ['span', {class: 'file-list-title'}, 'Dialogs'],
               ['button', {class: 'primary btn-small', onclick: B.ev ('create', 'dialog')}, '+ New']
            ]],
            dialogFiles && dialogFiles.length > 0
               ? dale.go (dialogFiles, function (name) {
                  var isActive = currentFile && currentFile.name === name;
                  var parsedDialog = parseDialogFilename (name) || {status: null};
                  var displayName = dialogDisplayLabel (name);
                  return ['div', {
                     class: 'file-item' + (isActive ? ' file-item-active' : ''),
                     onclick: B.ev ('load', 'file', name)
                  }, [
                     ['span', {class: 'dialog-name'}, statusIcon (parsedDialog.status) + ' ' + displayName],
                     ['span', {
                        class: 'file-delete',
                        onclick: B.ev ('delete', 'file', name, {stopPropagation: true})
                     }, '×']
                  ]];
               })
               : ['div', {style: style ({color: '#666', 'font-size': '13px'})}, 'No dialogs yet']
         ]],
         // Chat area
         ['div', {class: 'chat-container'}, [
            ['div', {class: 'editor-header'}, [
               ['span', {class: 'editor-filename'}, isDialog ? (statusIcon ((parseDialogFilename (currentFile.name) || {}).status) + ' ' + dialogDisplayLabel (currentFile.name)) : 'New dialog'],
               isDialog ? ['button', {
                  class: 'btn-small',
                  style: style ({'background-color': '#444'}),
                  onclick: B.ev ('close', 'file')
               }, 'Close'] : ''
            ]],
            ['div', {class: 'chat-messages'}, [
               messages.length ? dale.go (messages, function (msg) {
                  var meta = [];
                  if (msg.time) meta.push (msg.time);
                  if (msg.usage) meta.push ('tokens: ' + msg.usage.total + ' (in ' + msg.usage.input + ' / out ' + msg.usage.output + ')');
                  if (msg.usageCumulative) meta.push ('cumulative: ' + msg.usageCumulative.total);

                  return ['div', {class: 'chat-message chat-' + msg.role}, [
                     ['div', {class: 'chat-role'}, [
                        ['span', msg.role],
                        meta.length ? ['span', {class: 'chat-meta'}, meta.join (' · ')] : ''
                     ]],
                     ['div', {class: 'chat-content'}, msg.content]
                  ]];
               }) : ['div', {style: style ({color: '#666', 'font-size': '13px'})}, loadingFile ? 'Loading...' : 'Start typing below to begin a new dialog'],
               optimisticUserMessage ? ['div', {class: 'chat-message chat-user'}, [
                  ['div', {class: 'chat-role'}, 'user'],
                  ['div', {class: 'chat-content'}, optimisticUserMessage]
               ]] : '',
               streaming && streamingContent ? ['div', {class: 'chat-message chat-assistant'}, [
                  ['div', {class: 'chat-role'}, 'assistant'],
                  ['div', {class: 'chat-content'}, streamingContent + '▊']
               ]] : ''
            ]],
            // Tool requests panel
            views.toolRequests (pendingToolCalls, applyingToolDecisions),
            // Input area
            ['div', {class: 'chat-input-area'}, [
               ['select', {
                  class: 'provider-select',
                  onchange: B.ev ('change', 'chatProvider'),
                  disabled: streaming || hasPendingTools
               }, [
                  ['option', {value: 'openai', selected: (chatProvider || 'openai') === 'openai'}, 'OpenAI'],
                  ['option', {value: 'claude', selected: chatProvider === 'claude'}, 'Claude']
               ]],
               ['select', {
                  class: 'provider-select',
                  onchange: B.ev ('set', 'chatModel'),
                  disabled: streaming || hasPendingTools
               }, dale.go (MODEL_OPTIONS [chatProvider || 'openai'] || [], function (option) {
                  return ['option', {value: option.value, selected: (chatModel || defaultModelForProvider (chatProvider || 'openai')) === option.value}, option.label];
               })],
               ['textarea', {
                  class: 'chat-input',
                  rows: 2,
                  value: chatInput || '',
                  placeholder: 'Type a message... (Cmd+Enter to send)',
                  oninput: B.ev ('set', 'chatInput'),
                  onkeydown: B.ev ('keydown', 'chatInput', {raw: 'event'}),
                  disabled: streaming || hasPendingTools
               }, ''],
               ['button', {
                  class: 'primary',
                  onclick: B.ev ('send', 'message'),
                  disabled: streaming || hasPendingTools || ! (chatInput && chatInput.trim ())
               }, streaming ? 'Sending...' : 'Send'],
               (streaming && isDialog) ? ['button', {
                  style: style ({'background-color': '#e67e22', color: 'white'}),
                  onclick: B.ev ('stop', 'dialog')
               }, 'Stop'] : ''
            ]]
         ]]
      ]];
   });
};

views.projects = function () {
   return B.view ([['projects']], function (projects) {
      return ['div', {class: 'editor-empty'}, [
         ['div', {style: style ({width: '100%', 'max-width': '640px'})}, [
            ['div', {class: 'editor-header'}, [
               ['span', {class: 'editor-filename'}, 'Projects'],
               ['button', {class: 'primary btn-small', onclick: B.ev ('create', 'project')}, '+ New project']
            ]],
            (projects && projects.length)
               ? ['div', {class: 'file-list', style: style ({width: '100%'})}, dale.go (projects, function (name) {
                  return ['div', {
                     class: 'file-item',
                     onclick: B.ev ('navigate', 'hash', '#/project/' + encodeURIComponent (name) + '/docs')
                  }, [
                     ['span', {class: 'file-name'}, name]
                  ]];
               })]
               : ['div', {style: style ({color: '#888'})}, 'No projects yet']
         ]]
      ]];
   });
};

views.main = function () {
   return B.view ([['tab'], ['currentProject']], function (tab, currentProject) {
      return ['div', {class: 'container'}, [
         ['style', views.css],

         ['div', {class: 'header'}, [
            ['h1', {style: style ({margin: 0, 'font-size': '1.5rem'})}, 'vibey'],
            currentProject ? ['div', {style: style ({display: 'flex', gap: '0.5rem'})}, [
               ['span', {style: style ({color: '#9aa4bf'})}, currentProject],
               ['button', {class: 'btn-small', onclick: B.ev ('snapshot', 'project', 'project')}, 'Snapshot project'],
               ['button', {class: 'btn-small', onclick: B.ev ('snapshot', 'project', 'zip')}, 'Export zip'],
               ['button', {class: 'btn-small', onclick: B.ev ('navigate', 'hash', '#/projects')}, 'Projects']
            ]] : ''
         ]],

         currentProject ? ['div', {class: 'tabs'}, [
            ['button', {
               class: 'tab' + (tab === 'dialogs' ? ' tab-active' : ''),
               onclick: B.ev ('navigate', 'hash', '#/project/' + encodeURIComponent (currentProject) + '/dialogs')
            }, 'Dialogs'],
            ['button', {
               class: 'tab' + (tab === 'docs' ? ' tab-active' : ''),
               onclick: B.ev ('navigate', 'hash', '#/project/' + encodeURIComponent (currentProject) + '/docs')
            }, 'Docs'],
         ]] : '',

         ! currentProject || tab === 'projects' ? views.projects () : (tab === 'docs' ? views.files () : views.dialogs ())
      ]];
   });
};

// *** MOUNT ***

window.addEventListener ('hashchange', function () {
   B.call ('read', 'hash');
});

B.call ('initialize', []);
B.mount ('body', views.main);
