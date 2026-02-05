// *** SETUP ***

var B = window.B;

B.prod = true;
B.internal.timeout = 500;

var type = teishi.type;
var style = lith.css.style;

// *** RESPONDERS ***

B.mrespond ([

   // *** SETUP ***

   ['initialize', [], function (x) {
      B.call (x, 'set', 'tab', 'files');
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
         if (error) return B.call (x, 'report', 'error', 'Failed to load file');
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

      B.call (x, 'delete', 'file/' + encodeURIComponent (name), {}, '', function (x, error, rs) {
         if (error) return B.call (x, 'report', 'error', 'Failed to delete file');
         var currentFile = B.get ('currentFile');
         if (currentFile && currentFile.name === name) {
            B.call (x, 'set', 'currentFile', null);
         }
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
      var name = prompt ('Dialog name (e.g., test-claude-1):');
      if (! name) return;
      name = 'dialog-' + name.replace (/[^a-zA-Z0-9\-_]/g, '-').toLowerCase () + '.md';

      B.call (x, 'post', 'file/' + encodeURIComponent (name), {}, {content: '# Dialog\n\n'}, function (x, error, rs) {
         if (error) return B.call (x, 'report', 'error', 'Failed to create dialog');
         B.call (x, 'load', 'files');
         B.call (x, 'load', 'file', name);
      });
   }],

   ['send', 'message', function (x) {
      var file = B.get ('currentFile');
      var input = B.get ('chatInput');
      var provider = B.get ('chatProvider') || 'claude';
      var model = B.get ('chatModel') || '';
      var useTools = B.get ('useTools') === true;

      if (! file || ! input || ! input.trim ()) return;

      var originalInput = input.trim ();
      var dialogId = file.name.replace ('dialog-', '').replace ('.md', '');

      B.call (x, 'set', 'streaming', true);
      B.call (x, 'set', 'streamingContent', '');
      B.call (x, 'set', 'pendingToolCalls', null);
      B.call (x, 'set', 'chatInput', '');

      fetch ('chat', {
         method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify ({
            dialogId: dialogId,
            provider: provider,
            prompt: originalInput,
            model: model || undefined,
            useTools: useTools
         })
      }).then (function (response) {
         B.call (x, 'process', 'stream', response, file.name, originalInput);
      }).catch (function (err) {
         B.call (x, 'report', 'error', 'Failed to send: ' + err.message);
         B.call (x, 'set', 'streaming', false);
         B.call (x, 'set', 'chatInput', originalInput);
      });
   }],

   // Process SSE stream from chat or tool-result endpoints
   ['process', 'stream', function (x, response, filename, originalInput) {
      var reader = response.body.getReader ();
      var decoder = new TextDecoder ();
      var buffer = '';

      function read () {
         reader.read ().then (function (result) {
            if (result.done) {
               var pendingCalls = B.get ('pendingToolCalls');
               // Only mark streaming done if no pending tool calls
               if (! pendingCalls || pendingCalls.length === 0) {
                  B.call (x, 'set', 'streaming', false);
                  B.call (x, 'load', 'file', filename);
                  B.call (x, 'load', 'files');
               }
               return;
            }

            buffer += decoder.decode (result.value, {stream: true});
            var lines = buffer.split ('\n');
            buffer = lines.pop ();

            dale.go (lines, function (line) {
               if (line.startsWith ('data: ')) {
                  try {
                     var data = JSON.parse (line.slice (6));
                     if (data.type === 'chunk') {
                        var current = B.get ('streamingContent') || '';
                        B.call (x, 'set', 'streamingContent', current + data.content);
                     }
                     else if (data.type === 'tool_request') {
                        // Store pending tool calls for user approval
                        B.call (x, 'set', 'pendingToolCalls', data.toolCalls);
                        B.call (x, 'set', 'streaming', false);
                     }
                     else if (data.type === 'error') {
                        B.call (x, 'report', 'error', data.error);
                        B.call (x, 'set', 'streaming', false);
                        if (originalInput) B.call (x, 'set', 'chatInput', originalInput);
                     }
                  }
                  catch (e) {}
               }
            });

            read ();
         });
      }

      read ();
   }],

   // Approve a tool call - execute it
   ['approve', 'tool', function (x, toolIndex) {
      var pendingToolCalls = B.get ('pendingToolCalls');
      var file = B.get ('currentFile');
      if (! pendingToolCalls || ! file) return;

      var tool = pendingToolCalls [toolIndex];

      // Mark this tool as executing
      B.call (x, 'set', ['pendingToolCalls', toolIndex, 'executing'], true);

      // Execute the tool
      fetch ('tool/execute', {
         method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify ({
            toolName: tool.name,
            toolInput: tool.input
         })
      }).then (function (response) {
         return response.json ();
      }).then (function (result) {
         // Store the result on the tool
         B.call (x, 'set', ['pendingToolCalls', toolIndex, 'result'], result);
         B.call (x, 'set', ['pendingToolCalls', toolIndex, 'executing'], false);
         B.call (x, 'set', ['pendingToolCalls', toolIndex, 'done'], true);

         // Check if all tools are done
         B.call (x, 'check', 'allToolsDone');
      }).catch (function (err) {
         B.call (x, 'set', ['pendingToolCalls', toolIndex, 'result'], {success: false, error: err.message});
         B.call (x, 'set', ['pendingToolCalls', toolIndex, 'executing'], false);
         B.call (x, 'set', ['pendingToolCalls', toolIndex, 'done'], true);
         B.call (x, 'check', 'allToolsDone');
      });
   }],

   // Deny a tool call
   ['deny', 'tool', function (x, toolIndex) {
      var pendingToolCalls = B.get ('pendingToolCalls');
      if (! pendingToolCalls) return;

      B.call (x, 'set', ['pendingToolCalls', toolIndex, 'result'], {success: false, error: 'User denied this tool call'});
      B.call (x, 'set', ['pendingToolCalls', toolIndex, 'done'], true);
      B.call (x, 'set', ['pendingToolCalls', toolIndex, 'denied'], true);

      B.call (x, 'check', 'allToolsDone');
   }],

   // Approve all pending tools at once
   ['approve', 'allTools', function (x) {
      var pendingToolCalls = B.get ('pendingToolCalls');
      if (! pendingToolCalls) return;

      dale.go (pendingToolCalls, function (tool, index) {
         if (! tool.done && ! tool.executing) {
            B.call (x, 'approve', 'tool', index);
         }
      });
   }],

   // Deny all pending tools at once
   ['deny', 'allTools', function (x) {
      var pendingToolCalls = B.get ('pendingToolCalls');
      if (! pendingToolCalls) return;

      dale.go (pendingToolCalls, function (tool, index) {
         if (! tool.done && ! tool.executing) {
            B.call (x, 'deny', 'tool', index);
         }
      });
   }],

   // Check if all tools are done and submit results
   ['check', 'allToolsDone', function (x) {
      var pendingToolCalls = B.get ('pendingToolCalls');
      var file = B.get ('currentFile');
      if (! pendingToolCalls || ! file) return;

      var allDone = dale.stop (pendingToolCalls, false, function (tool) {
         return tool.done === true;
      });

      if (allDone === false) return; // Not all done yet

      // All tools are done, submit results
      var dialogId = file.name.replace ('dialog-', '').replace ('.md', '');
      var toolResults = dale.go (pendingToolCalls, function (tool) {
         return {
            id: tool.id,
            result: tool.result,
            error: tool.denied ? 'User denied this tool call' : (tool.result && ! tool.result.success ? tool.result.error : null)
         };
      });

      B.call (x, 'set', 'pendingToolCalls', null);
      B.call (x, 'set', 'streaming', true);
      B.call (x, 'set', 'streamingContent', '');

      fetch ('chat/tool-result', {
         method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify ({
            dialogId: dialogId,
            toolResults: toolResults
         })
      }).then (function (response) {
         B.call (x, 'process', 'stream', response, file.name, null);
      }).catch (function (err) {
         B.call (x, 'report', 'error', 'Failed to submit tool results: ' + err.message);
         B.call (x, 'set', 'streaming', false);
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
      'background-color': '#4a69bd',
      'margin-left': 'auto',
   }],
   ['.chat-assistant', {
      'background-color': '#2d3748',
   }],
   ['.chat-role', {
      'font-size': '11px',
      'text-transform': 'uppercase',
      color: '#888',
      'margin-bottom': '0.25rem',
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
   ['.checkbox-label', {
      display: 'flex',
      'align-items': 'center',
      gap: '0.25rem',
      'font-size': '12px',
      color: '#888',
      cursor: 'pointer',
   }],
   ['.checkbox-label input', {
      cursor: 'pointer',
   }],
];

views.files = function () {
   return B.view ([['files'], ['currentFile'], ['loadingFile'], ['savingFile']], function (files, currentFile, loadingFile, savingFile) {
      var isDirty = currentFile && currentFile.content !== currentFile.original;

      return ['div', {class: 'files-container'}, [
         // File list sidebar
         ['div', {class: 'file-list'}, [
            ['div', {class: 'file-list-header'}, [
               ['span', {class: 'file-list-title'}, 'Files'],
               ['button', {class: 'primary btn-small', onclick: B.ev ('create', 'file')}, '+ New']
            ]],
            files && files.length > 0
               ? dale.go (files, function (name) {
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
               : ['div', {style: style ({color: '#666', 'font-size': '13px'})}, 'No files yet']
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
         ] : ['div', {class: 'editor-empty'}, loadingFile ? 'Loading...' : 'Select a file to edit']]
      ]];
   });
};

// Parse markdown dialog into messages
var parseDialogContent = function (content) {
   if (! content) return [];
   var messages = [];
   var lines = content.split ('\n');
   var currentRole = null;
   var currentContent = [];

   dale.go (lines, function (line) {
      if (line.startsWith ('## User')) {
         if (currentRole && currentContent.join ('').trim ()) messages.push ({role: currentRole, content: currentContent.join ('\n').trim ()});
         currentRole = 'user';
         currentContent = [];
      }
      else if (line.startsWith ('## Assistant')) {
         if (currentRole && currentContent.join ('').trim ()) messages.push ({role: currentRole, content: currentContent.join ('\n').trim ()});
         currentRole = 'assistant';
         currentContent = [];
      }
      else if (currentRole) {
         currentContent.push (line);
      }
   });

   if (currentRole && currentContent.join ('').trim ()) {
      messages.push ({role: currentRole, content: currentContent.join ('\n').trim ()});
   }

   return messages;
};

// Render tool request UI
views.toolRequests = function (pendingToolCalls) {
   if (! pendingToolCalls || pendingToolCalls.length === 0) return '';

   var allDone = dale.stop (pendingToolCalls, false, function (tool) {
      return tool.done === true;
   }) !== false;

   var anyPending = dale.stop (pendingToolCalls, true, function (tool) {
      return ! tool.done && ! tool.executing;
   });

   return ['div', {class: 'tool-requests'}, [
      ['div', {class: 'tool-requests-header'}, [
         ['span', {class: 'tool-requests-title'}, 'Tool Requests (' + pendingToolCalls.length + ')'],
         anyPending ? ['div', {style: style ({display: 'flex', gap: '0.5rem'})}, [
            ['button', {
               class: 'btn-small tool-btn-approve',
               onclick: B.ev ('approve', 'allTools')
            }, 'Approve All'],
            ['button', {
               class: 'btn-small tool-btn-deny',
               onclick: B.ev ('deny', 'allTools')
            }, 'Deny All']
         ]] : ''
      ]],
      dale.go (pendingToolCalls, function (tool, index) {
         return ['div', {class: 'tool-request'}, [
            ['div', {class: 'tool-request-header'}, [
               ['span', {class: 'tool-name'}, tool.name],
               tool.executing ? ['span', {class: 'tool-status'}, 'Executing...'] :
               tool.done ? ['span', {class: 'tool-status'}, tool.denied ? 'Denied' : 'Done'] :
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
            ['div', {class: 'tool-input'}, JSON.stringify (tool.input, null, 2)],
            tool.result ? ['div', {class: 'tool-result' + (tool.result.success === false ? ' tool-result-error' : '')},
               JSON.stringify (tool.result, null, 2)
            ] : ''
         ]];
      })
   ]];
};

views.dialogs = function () {
   return B.view ([['files'], ['currentFile'], ['loadingFile'], ['chatInput'], ['chatProvider'], ['streaming'], ['streamingContent'], ['pendingToolCalls'], ['useTools']], function (files, currentFile, loadingFile, chatInput, chatProvider, streaming, streamingContent, pendingToolCalls, useTools) {

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
         ['div', {class: 'chat-container'}, isDialog ? [
            ['div', {class: 'editor-header'}, [
               ['span', {class: 'editor-filename'}, currentFile.name.replace ('dialog-', '').replace ('.md', '')],
               ['button', {
                  class: 'btn-small',
                  style: style ({'background-color': '#444'}),
                  onclick: B.ev ('close', 'file')
               }, 'Close']
            ]],
            ['div', {class: 'chat-messages'}, [
               dale.go (messages, function (msg) {
                  return ['div', {class: 'chat-message chat-' + msg.role}, [
                     ['div', {class: 'chat-role'}, msg.role],
                     ['div', {class: 'chat-content'}, msg.content]
                  ]];
               }),
               streaming && streamingContent ? ['div', {class: 'chat-message chat-assistant'}, [
                  ['div', {class: 'chat-role'}, 'assistant'],
                  ['div', {class: 'chat-content'}, streamingContent + '▊']
               ]] : ''
            ]],
            // Tool requests panel
            views.toolRequests (pendingToolCalls),
            // Input area
            ['div', {class: 'chat-input-area'}, [
               ['select', {
                  class: 'provider-select',
                  onchange: B.ev ('set', 'chatProvider'),
                  disabled: streaming || hasPendingTools
               }, [
                  ['option', {value: 'claude', selected: (chatProvider || 'claude') === 'claude'}, 'Claude'],
                  ['option', {value: 'openai', selected: chatProvider === 'openai'}, 'OpenAI']
               ]],
               ['label', {class: 'checkbox-label'}, [
                  ['input', {
                     type: 'checkbox',
                     checked: useTools === true,
                     onchange: B.ev ('set', 'useTools', ! B.get ('useTools')),
                     disabled: streaming || hasPendingTools
                  }],
                  'MCP Tools'
               ]],
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
         ] : ['div', {class: 'editor-empty'}, loadingFile ? 'Loading...' : 'Select a dialog or create one']]
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
               class: 'tab' + (tab === 'files' ? ' tab-active' : ''),
               onclick: B.ev ('set', 'tab', 'files')
            }, 'Files'],
         ]],

         tab === 'files' ? views.files () : views.dialogs ()
      ]];
   });
};

// *** MOUNT ***

B.call ('initialize', []);
B.mount ('body', views.main);
