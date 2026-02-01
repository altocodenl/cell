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
      B.call (x, 'set', 'workdir', '.');
   }],

   ['report', 'error', function (x, error) {
      alert (typeof error === 'string' ? error : JSON.stringify (error));
   }],

   [/^(get|post)$/, [], {match: function (ev, responder) {
      return B.r.compare (ev.verb, responder.verb);
   }}, function (x, headers, body, cb) {
      c.ajax (x.verb, x.path [0], headers, body, function (error, rs) {
         if (cb) cb (x, error, rs);
      });
   }],

   // *** SESSION ***

   ['start', 'session', function (x) {
      var workdir = B.get ('workdir') || '.';

      B.call (x, 'set', 'starting', true);
      B.call (x, 'post', 'session/start', {}, {workdir: workdir}, function (x, error, rs) {
         B.call (x, 'set', 'starting', false);
         if (error) return B.call (x, 'report', 'error', error.responseText || 'Failed to start session');

         B.call (x, 'set', 'session', {
            id: rs.body.id,
            output: [],
            nextIndex: 0
         });

         B.call (x, 'poll', 'output');
      });
   }],

   ['poll', 'output', function (x) {
      var session = B.get ('session');
      if (! session) return;

      B.call (x, 'get', 'session/' + session.id + '/output?since=' + session.nextIndex, {}, '', function (x, error, rs) {
         if (error) {
            console.error ('Poll error:', error);
            setTimeout (function () {
               B.call ('poll', 'output');
            }, 2000);
            return;
         }

         if (rs.body.output && rs.body.output.length > 0) {
            B.call (x, 'set', ['session', 'output'], session.output.concat (rs.body.output));
         }
         B.call (x, 'set', ['session', 'nextIndex'], rs.body.nextIndex);
         B.call (x, 'set', ['session', 'closed'], rs.body.closed);

         if (! rs.body.closed) {
            B.call (x, 'poll', 'output');
         }
      });
   }],

   ['send', 'message', function (x) {
      var session = B.get ('session');
      var message = B.get ('input') || '';

      if (! session || ! message.trim ()) return;

      // Add user message to output immediately
      var userEntry = {type: 'stdout', text: JSON.stringify ({type: 'user', message: {role: 'user', content: message}}), t: Date.now ()};
      B.call (x, 'set', ['session', 'output'], session.output.concat ([userEntry]));

      B.call (x, 'set', 'sending', true);
      B.call (x, 'set', 'input', '');

      B.call (x, 'post', 'session/' + session.id + '/send', {}, {message: message}, function (x, error, rs) {
         B.call (x, 'set', 'sending', false);
         if (error) return B.call (x, 'report', 'error', error.responseText || 'Failed to send message');
      });
   }],

   ['stop', 'session', function (x) {
      var session = B.get ('session');
      if (! session) return;

      B.call (x, 'post', 'session/' + session.id + '/stop', {}, {}, function (x, error, rs) {
         if (error) return B.call (x, 'report', 'error', error.responseText || 'Failed to stop session');
      });
   }],

   ['keydown', 'input', function (x, ev) {
      if (ev.key === 'Enter' && ! ev.shiftKey) {
         ev.preventDefault ();
         B.call (x, 'send', 'message');
      }
   }],

   ['answer', 'question', function (x, answer) {
      B.call (x, 'set', 'input', answer);
      B.call (x, 'send', 'message');
   }],

   ['focus', 'input', function (x) {
      var textarea = document.querySelector ('.message-input');
      if (textarea) textarea.focus ();
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
   ['.output', {
      flex: 1,
      'overflow-y': 'auto',
      'background-color': '#16213e',
      'border-radius': '8px',
      padding: '1rem',
      'margin-bottom': '1rem',
      'font-family': 'Monaco, Consolas, monospace',
      'font-size': '14px',
      'line-height': 1.5,
      'white-space': 'pre-wrap',
      'word-wrap': 'break-word',
   }],
   ['.output-entry', {
      'margin-bottom': '0.5rem',
   }],
   ['.output-stdout', {
      color: '#a8e6cf',
   }],
   ['.output-stderr', {
      color: '#ff8b94',
   }],
   ['.output-exit', {
      color: '#ffd93d',
      'font-style': 'italic',
   }],
   ['.output-assistant', {
      color: '#a8e6cf',
      'background-color': '#1a3a2a',
      padding: '0.75rem',
      'border-radius': '8px',
      'margin-bottom': '0.75rem',
   }],
   ['.output-user', {
      color: '#94b8ff',
      'background-color': '#1a2a3a',
      padding: '0.75rem',
      'border-radius': '8px',
      'margin-bottom': '0.75rem',
      'text-align': 'right',
   }],
   ['.output-result', {
      color: '#888',
      'border-top': '1px solid #333',
      'padding-top': '0.5rem',
      'margin-top': '0.5rem',
      'font-size': '11px',
   }],
   ['.output-streaming', {
      color: '#a8e6cf',
      'background-color': '#1a3a2a',
      padding: '0.75rem',
      'border-radius': '8px',
      'margin-bottom': '0.75rem',
      'border-left': '3px solid #27ae60',
   }],
   ['.output-thinking', {
      color: '#b8a8e6',
      'background-color': '#2a1a3a',
      padding: '0.75rem',
      'border-radius': '8px',
      'margin-bottom': '0.5rem',
      'font-style': 'italic',
      'font-size': '13px',
      'border-left': '3px solid #9b59b6',
   }],
   ['.output-status', {
      color: '#666',
      'font-size': '11px',
      'font-style': 'italic',
      'text-align': 'right',
      'margin-top': '0.25rem',
   }],
   ['.output-system', {
      color: '#888',
      'font-style': 'italic',
      'font-size': '12px',
      'margin-bottom': '0.5rem',
   }],
   ['.output-error', {
      color: '#ff8b94',
   }],
   ['.output-raw', {
      color: '#ccc',
   }],
   ['.output-entry code', {
      'background-color': '#0d1117',
      padding: '0.2rem 0.4rem',
      'border-radius': '4px',
      'font-family': 'Monaco, Consolas, monospace',
   }],
   ['.output-entry pre', {
      'background-color': '#0d1117',
      padding: '1rem',
      'border-radius': '8px',
      overflow: 'auto',
      margin: '0.5rem 0',
   }],
   ['.output-entry pre code', {
      padding: 0,
      'background-color': 'transparent',
   }],
   ['.output-entry h1, .output-entry h2, .output-entry h3', {
      'margin-top': '0.5rem',
      'margin-bottom': '0.5rem',
   }],
   ['.output-entry ul, .output-entry ol', {
      'margin-left': '1.5rem',
      'margin-top': '0.5rem',
      'margin-bottom': '0.5rem',
   }],
   ['.output-entry p', {
      margin: '0.5rem 0',
   }],
   ['.output-entry p:first-child', {
      'margin-top': 0,
   }],
   ['.output-entry p:last-child', {
      'margin-bottom': 0,
   }],
   ['.input-area', {
      display: 'flex',
      gap: '0.5rem',
   }],
   ['textarea.message-input', {
      flex: 1,
      padding: '0.75rem',
      'border-radius': '8px',
      border: 'none',
      'background-color': '#16213e',
      color: '#eee',
      'font-family': 'Monaco, Consolas, monospace',
      'font-size': '14px',
      resize: 'none',
      'min-height': '60px',
   }],
   ['textarea.message-input:focus', {
      outline: '2px solid #4a69bd',
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
   ['button.danger', {
      'background-color': '#eb4d4b',
      color: 'white',
   }],
   ['button.danger:hover', {
      'background-color': '#c0392b',
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
   ['.status', {
      padding: '0.25rem 0.75rem',
      'border-radius': '20px',
      'font-size': '12px',
   }],
   ['.status-active', {
      'background-color': '#27ae60',
      color: 'white',
   }],
   ['.status-closed', {
      'background-color': '#7f8c8d',
      color: 'white',
   }],
   ['.workdir-input', {
      padding: '0.5rem',
      'border-radius': '4px',
      border: '1px solid #4a69bd',
      'background-color': '#16213e',
      color: '#eee',
      'margin-right': '0.5rem',
      width: '300px',
   }],
   ['.question-block', {
      'background-color': '#2a1a4a',
      'border-radius': '8px',
      padding: '1rem',
      'margin-top': '1rem',
      border: '1px solid #4a69bd',
   }],
   ['.question-text', {
      'font-weight': 'bold',
      'margin-bottom': '0.75rem',
      color: '#ddd',
   }],
   ['.question-options', {
      display: 'flex',
      'flex-direction': 'column',
      gap: '0.5rem',
   }],
   ['.option-button', {
      display: 'flex',
      'flex-direction': 'column',
      'align-items': 'flex-start',
      padding: '0.75rem 1rem',
      'background-color': '#1a2a4a',
      border: '1px solid #4a69bd',
      'border-radius': '6px',
      cursor: 'pointer',
      'text-align': 'left',
      transition: 'background-color 0.2s',
   }],
   ['.option-button:hover', {
      'background-color': '#2a3a5a',
   }],
   ['.option-label', {
      'font-weight': 'bold',
      color: '#94b8ff',
   }],
   ['.option-desc', {
      'font-size': '12px',
      color: '#888',
      'margin-top': '0.25rem',
   }],
   ['.option-other', {
      'background-color': 'transparent',
      'border-style': 'dashed',
      color: '#888',
   }],
];

var parseClaudeOutput = function (entry) {
   if (entry.type === 'exit') return {type: 'system', text: '[Process exited with code ' + entry.code + ']'};
   if (entry.type === 'error') return {type: 'error', text: '[Error: ' + entry.error + ']'};
   if (entry.type === 'stderr') return {type: 'error', text: entry.text};

   var text = entry.text || '';
   try {
      var json = JSON.parse (text);

      if (json.type === 'system' && json.subtype === 'init') {
         return {type: 'system', text: 'Session started. Model: ' + json.model};
      }

      // Handle stream events for real-time updates
      if (json.type === 'stream_event' && json.event) {
         var ev = json.event;

         if (ev.type === 'message_start' && ev.message && ev.message.usage) {
            var u = ev.message.usage;
            return {type: 'status', text: 'Thinking... (input: ' + u.input_tokens + ' tokens, cached: ' + (u.cache_read_input_tokens || 0) + ')'};
         }

         if (ev.type === 'content_block_delta' && ev.delta) {
            if (ev.delta.type === 'text_delta') {
               return {type: 'delta', text: ev.delta.text};
            }
            if (ev.delta.type === 'thinking_delta') {
               return {type: 'thinking', text: ev.delta.thinking};
            }
         }

         if (ev.type === 'message_delta' && ev.usage) {
            return {type: 'status', text: '(output: ' + ev.usage.output_tokens + ' tokens)'};
         }

         return null;
      }

      if (json.type === 'assistant' && json.message && json.message.content) {
         var textParts = [];
         var questions = null;

         dale.go (json.message.content, function (block) {
            if (block.type === 'text') textParts.push (block.text);
            if (block.type === 'tool_use' && block.name === 'AskUserQuestion') {
               questions = block.input.questions;
            }
            else if (block.type === 'tool_use') {
               textParts.push ('[Using tool: ' + block.name + ']');
            }
         });

         return {type: 'assistant', text: textParts.join (''), questions: questions};
      }

      if (json.type === 'result') {
         if (json.is_error) return {type: 'error', text: 'Error: ' + json.result};
         return {type: 'result', text: json.result, cost: json.total_cost_usd, usage: json.usage};
      }

      if (json.type === 'user') {
         var content = json.message && json.message.content ? json.message.content : '';
         return {type: 'user', text: content};
      }

      return null;
   }
   catch (e) {
      if (text.trim ()) return {type: 'raw', text: text};
      return null;
   }
};

views.main = function () {
   return B.view ([['session'], ['input'], ['workdir'], ['starting'], ['sending']], function (session, input, workdir, starting, sending) {

      var outputHtml = [];
      var pendingQuestions = null;
      var streamingText = '';
      var thinkingText = '';
      var lastStatus = '';

      if (session && session.output) {
         dale.go (session.output, function (entry, index) {
            var parsed = parseClaudeOutput (entry);
            if (! parsed) return;

            // Accumulate streaming deltas
            if (parsed.type === 'delta') {
               streamingText += parsed.text;
               return;
            }

            if (parsed.type === 'thinking') {
               thinkingText += parsed.text;
               return;
            }

            if (parsed.type === 'status') {
               lastStatus = parsed.text;
               return;
            }

            // When we hit a non-delta entry, flush accumulated streaming text
            if (streamingText) {
               var html = '<div class="output-entry output-streaming">' + marked.parse (streamingText) + '</div>';
               outputHtml.push (['LITERAL', html]);
               streamingText = '';
            }
            if (thinkingText) {
               outputHtml.push (['div', {class: 'output-entry output-thinking'}, thinkingText]);
               thinkingText = '';
            }

            var cls = 'output-entry output-' + parsed.type;
            var content = parsed.text || '';

            if (parsed.type === 'result') {
               var stats = [];
               if (parsed.cost) stats.push ('Cost: $' + parsed.cost.toFixed (4));
               if (parsed.usage) {
                  stats.push ('In: ' + (parsed.usage.input_tokens || 0));
                  stats.push ('Out: ' + (parsed.usage.output_tokens || 0));
                  if (parsed.usage.cache_read_input_tokens) stats.push ('Cached: ' + parsed.usage.cache_read_input_tokens);
               }
               if (stats.length) content = '[' + stats.join (' | ') + ']';
               else content = '';
            }

            // Track questions - only from assistant messages, clear on result or user message
            if (parsed.type === 'assistant' && parsed.questions) {
               pendingQuestions = parsed.questions;
            }
            else if (parsed.type === 'result' || parsed.type === 'user') {
               pendingQuestions = null;
            }

            if (! content) return;

            // Use markdown for assistant messages
            if ((parsed.type === 'assistant' || parsed.type === 'user') && window.marked) {
               var html = '<div class="' + cls + '">' + marked.parse (content) + '</div>';
               outputHtml.push (['LITERAL', html]);
            }
            else {
               outputHtml.push (['div', {class: cls}, content]);
            }
         });

         // Flush any remaining streaming content
         if (thinkingText) {
            outputHtml.push (['div', {class: 'output-entry output-thinking'}, thinkingText]);
         }
         if (streamingText) {
            var html = '<div class="output-entry output-streaming">' + marked.parse (streamingText) + '</div>';
            outputHtml.push (['LITERAL', html]);
         }
         if (lastStatus && ! session.closed) {
            outputHtml.push (['div', {class: 'output-entry output-status'}, lastStatus]);
         }
      }

      // Render pending questions with clickable options
      var questionsHtml = [];
      if (pendingQuestions && ! session.closed) {
         dale.go (pendingQuestions, function (q) {
            questionsHtml.push (['div', {class: 'question-block'}, [
               ['div', {class: 'question-text'}, q.question],
               ['div', {class: 'question-options'}, dale.go (q.options, function (opt) {
                  return ['button', {
                     class: 'option-button',
                     onclick: B.ev ('answer', 'question', opt.label)
                  }, [
                     ['span', {class: 'option-label'}, opt.label],
                     opt.description ? ['span', {class: 'option-desc'}, opt.description] : ''
                  ]];
               })],
               ['button', {
                  class: 'option-button option-other',
                  onclick: B.ev ('focus', 'input')
               }, 'Other (type below)']
            ]]);
         });
      }

      return ['div', {class: 'container'}, [
         ['style', views.css],

         ['div', {class: 'header'}, [
            ['h1', {style: style ({margin: 0, 'font-size': '1.5rem'})}, 'vibey'],
            session ? ['div', [
               ['span', {class: 'status ' + (session.closed ? 'status-closed' : 'status-active')},
                  session.closed ? 'closed' : 'active'],
               ! session.closed ? ['button', {
                  class: 'danger',
                  style: style ({'margin-left': '0.5rem'}),
                  onclick: B.ev ('stop', 'session')
               }, 'Stop'] : ''
            ]] : ['div', [
               ['input', {
                  class: 'workdir-input',
                  placeholder: 'Working directory',
                  value: workdir || '.',
                  onchange: B.ev ('set', 'workdir'),
                  oninput: B.ev ('set', 'workdir'),
               }],
               ['button', {
                  class: 'primary',
                  onclick: B.ev ('start', 'session'),
                  disabled: starting
               }, starting ? 'Starting...' : 'Start Claude Code']
            ]]
         ]],

         ['div', {
            class: 'output',
            id: 'output',
            ondraw: function () {
               var el = document.getElementById ('output');
               if (el) el.scrollTop = el.scrollHeight;
            }
         }, outputHtml.length > 0 || questionsHtml.length > 0
            ? [outputHtml, questionsHtml]
            : ['div', {style: style ({color: '#888'})}, session ? 'Waiting for output...' : 'Start a session to begin chatting with Claude Code']],

         session && ! session.closed ? ['div', {class: 'input-area'}, [
            ['textarea', {
               class: 'message-input',
               placeholder: 'Type your message... (Enter to send, Shift+Enter for newline)',
               value: input || '',
               oninput: B.ev ('set', 'input'),
               onkeydown: B.ev ('keydown', 'input', {raw: 'event'}),
            }],
            ['button', {
               class: 'primary',
               onclick: B.ev ('send', 'message'),
               disabled: sending || ! (input && input.trim ())
            }, sending ? 'Sending...' : 'Send']
         ]] : ''
      ]];
   });
};

// *** MOUNT ***

B.call ('initialize', []);
B.mount ('body', views.main);

// Scroll output to bottom on updates
B.respond ('set', ['session', 'output'], function () {
   setTimeout (function () {
      var el = document.getElementById ('output');
      if (el) el.scrollTop = el.scrollHeight;
   }, 50);
});
