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

// *** RESPONDERS ***

B.mrespond ([

   // *** SETUP ***

   ['initialize', [], function (x) {
      B.call (x, 'set', 'tab', 'docs');
      B.call (x, 'set', 'chatProvider', 'openai');
      B.call (x, 'set', 'chatModel', 'gpt-5');
      B.call (x, 'load', 'files');
   }],

   ['report', 'error', function (x, error) {
      alert (typeof error === 'string' ? error : JSON.stringify (error));
   }],

   [/^(get|post|delete)$/, [], {match: function (ev, responder) {
      return B.r.compare (ev.verb, responder.verb);
   }}, function (x, headers, body, cb) {
      c.ajax (x.verb, x.path [0], headers, body, function (error, rs) {
         if (cb) cb (x, error, rs);
      });
   }],

   // *** FILES ***

   ['load', 'files', function (x) {
      B.call (x, 'get', 'files', {}, '', function (x, error, rs) {
         if (error) return B.call (x, 'report', 'error', 'Failed to load files');
         B.call (x, 'set', 'files', rs.body);
      });
   }],

   ['load', 'file', function (x, name) {
      B.call (x, 'set', 'loadingFile', true);
      B.call (x, 'get', 'file/' + encodeURIComponent (name), {}, '', function (x, error, rs) {
         B.call (x, 'set', 'loadingFile', false);
         if (error) return B.call (x, 'set', 'currentFile', null);
         B.call (x, 'set', 'currentFile', {
            name: rs.body.name,
            content: rs.body.content,
            original: rs.body.content
         });
      });
   }],

   ['save', 'file', function (x) {
      var file = B.get ('currentFile');
      if (! file) return;

      B.call (x, 'set', 'savingFile', true);
      B.call (x, 'post', 'file/' + encodeURIComponent (file.name), {}, {content: file.content}, function (x, error, rs) {
         B.call (x, 'set', 'savingFile', false);
         if (error) return B.call (x, 'report', 'error', 'Failed to save file');
         B.call (x, 'set', ['currentFile', 'original'], file.content);
         B.call (x, 'load', 'files');
      });
   }],

   ['create', 'file', function (x) {
      var name = prompt ('File name (must end in .md):');
      if (! name) return;
      if (! name.endsWith ('.md')) name += '.md';

      B.call (x, 'post', 'file/' + encodeURIComponent (name), {}, {content: '# ' + name.replace ('.md', '') + '\n\n'}, function (x, error, rs) {
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
      }

      B.call (x, 'delete', 'file/' + encodeURIComponent (name), {}, '', function (x, error, rs) {
         if (error) return B.call (x, 'report', 'error', 'Failed to delete file');
         B.call (x, 'load', 'files');
      });
   }],

   ['close', 'file', function (x) {
      var file = B.get ('currentFile');
      if (file && file.content !== file.original) {
         if (! confirm ('Discard unsaved changes?')) return;
      }
      B.call (x, 'set', 'currentFile', null);
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

      var provider = B.get ('chatProvider') || 'openai';
      var model = B.get ('chatModel') || defaultModelForProvider (provider);

      B.call (x, 'post', 'dialog/new', {}, {
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

      fetch ('dialog', {
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
                           alwaysAllow: false
                        };
                     });
                     B.call (x, 'set', 'pendingToolCalls', pendingTools);
                     B.call (x, 'set', 'streaming', false);
                     B.call (x, 'set', 'applyingToolDecisions', false);
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

   // Approve a pending tool request
   ['approve', 'tool', function (x, toolIndex) {
      var pendingToolCalls = B.get ('pendingToolCalls');
      if (! pendingToolCalls) return;
      B.call (x, 'set', ['pendingToolCalls', toolIndex, 'approved'], true);
   }],

   // Deny a tool call
   ['deny', 'tool', function (x, toolIndex) {
      var pendingToolCalls = B.get ('pendingToolCalls');
      if (! pendingToolCalls) return;
      B.call (x, 'set', ['pendingToolCalls', toolIndex, 'approved'], false);
   }],

   // Approve all pending tools at once
   ['approve', 'allTools', function (x) {
      var pendingToolCalls = B.get ('pendingToolCalls');
      if (! pendingToolCalls) return;
      dale.go (pendingToolCalls, function (tool, index) {
         B.call (x, 'approve', 'tool', index);
      });
   }],

   // Deny all pending tools at once
   ['deny', 'allTools', function (x) {
      var pendingToolCalls = B.get ('pendingToolCalls');
      if (! pendingToolCalls) return;
      dale.go (pendingToolCalls, function (tool, index) {
         B.call (x, 'deny', 'tool', index);
      });
   }],

   ['toggle', 'alwaysAllowTool', function (x, toolIndex) {
      var current = B.get (['pendingToolCalls', toolIndex, 'alwaysAllow']);
      B.call (x, 'set', ['pendingToolCalls', toolIndex, 'alwaysAllow'], ! current);
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

      fetch ('dialog', {
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
      'background-color': '#4b2323',
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
                     ['span', {class: 'file-name'}, name],
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
                  ['span', {class: 'editor-filename'}, currentFile.name],
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

var summarizeToolInput = function (tool) {
   var input = JSON.parse (JSON.stringify (tool.input || {}));

   if (tool.name === 'write_file' && type (input.content) === 'string') {
      input.content = '[hidden file content: ' + input.content.length + ' chars]';
   }
   if (tool.name === 'edit_file') {
      if (type (input.old_string) === 'string') input.old_string = '[hidden old_string: ' + input.old_string.length + ' chars]';
      if (type (input.new_string) === 'string') input.new_string = '[hidden new_string: ' + input.new_string.length + ' chars]';
   }

   return JSON.stringify (input, null, 2);
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
               onclick: B.ev ('approve', 'allTools')
            }, 'Approve All'],
            ['button', {
               class: 'btn-small tool-btn-deny',
               onclick: B.ev ('deny', 'allTools')
            }, 'Deny All']
         ]]
      ]],
      dale.go (pendingToolCalls, function (tool, index) {
         return ['div', {class: 'tool-request'}, [
            ['div', {class: 'tool-request-header'}, [
               ['span', {class: 'tool-name'}, tool.name],
               tool.approved === true ? ['span', {class: 'tool-status'}, 'Approved'] :
               tool.approved === false ? ['span', {class: 'tool-status'}, 'Denied'] :
               ['div', {class: 'tool-actions'}, [
                  ['button', {
                     class: 'btn-small tool-btn-approve',
                     onclick: B.ev ('approve', 'tool', index)
                  }, 'Approve'],
                  ['button', {
                     class: 'btn-small tool-btn-deny',
                     onclick: B.ev ('deny', 'tool', index)
                  }, 'Deny']
               ]]
            ]],
            ['div', {class: 'tool-input'}, summarizeToolInput (tool)],
            ['label', {style: style ({display: 'flex', gap: '0.4rem', 'align-items': 'center', 'font-size': '12px', color: '#aaa'})}, [
               ['input', {
                  type: 'checkbox',
                  checked: tool.alwaysAllow === true,
                  onchange: B.ev ('toggle', 'alwaysAllowTool', index)
               }],
               'Always allow ' + tool.name + ' in this dialog'
            ]]
         ]];
      }),
      ['div', {style: style ({display: 'flex', 'justify-content': 'flex-end', 'margin-top': '0.75rem'})}, [
         ['button', {
            class: 'primary btn-small',
            onclick: B.ev ('submit', 'toolDecisions'),
            disabled: ! allChosen || applyingToolDecisions
         }, applyingToolDecisions ? 'Applying…' : (allChosen ? 'Apply decisions' : 'Select all decisions')]
      ]]
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
                  var displayName = name.replace ('dialog-', '').replace ('.md', '');
                  return ['div', {
                     class: 'file-item' + (isActive ? ' file-item-active' : ''),
                     onclick: B.ev ('load', 'file', name)
                  }, [
                     ['span', {class: 'file-name'}, displayName],
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
               ['span', {class: 'editor-filename'}, isDialog ? currentFile.name.replace ('dialog-', '').replace ('.md', '') : 'New dialog'],
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
                  placeholder: 'Type a message... (Cmd+Enter to send)',
                  oninput: B.ev ('set', 'chatInput'),
                  onkeydown: B.ev ('keydown', 'chatInput', {raw: 'event'}),
                  disabled: streaming || hasPendingTools
               }, chatInput || ''],
               ['button', {
                  class: 'primary',
                  onclick: B.ev ('send', 'message'),
                  disabled: streaming || hasPendingTools || ! (chatInput && chatInput.trim ())
               }, streaming ? 'Sending...' : 'Send']
            ]]
         ]]
      ]];
   });
};

views.main = function () {
   return B.view ([['tab']], function (tab) {
      return ['div', {class: 'container'}, [
         ['style', views.css],

         ['div', {class: 'header'}, [
            ['h1', {style: style ({margin: 0, 'font-size': '1.5rem'})}, 'vibey'],
         ]],

         ['div', {class: 'tabs'}, [
            ['button', {
               class: 'tab' + (tab === 'dialogs' ? ' tab-active' : ''),
               onclick: B.ev ('set', 'tab', 'dialogs')
            }, 'Dialogs'],
            ['button', {
               class: 'tab' + (tab === 'docs' ? ' tab-active' : ''),
               onclick: B.ev ('set', 'tab', 'docs')
            }, 'Docs'],
         ]],

         tab === 'docs' ? views.files () : views.dialogs ()
      ]];
   });
};

// *** MOUNT ***

B.call ('initialize', []);
B.mount ('body', views.main);
