// *** SETUP ***

var CONFIG = require ('./config.js');

var fs    = require ('fs');
var Path  = require ('path');

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

// *** HELPERS ***

var VIBEY_DIR = Path.join (__dirname, 'vibey');
var SECRET = require ('./secret.js');

// API keys
var OPENAI_API_KEY = SECRET.openai;
var CLAUDE_API_KEY = SECRET.claude;

// *** MCP TOOLS ***

var exec = require ('child_process').exec;

// Tool definitions (written once, converted to both provider formats below)
var TOOLS = [
   {
      name: 'run_command',
      description: 'Run a shell command. Use for reading files (cat), listing directories (ls), HTTP requests (curl), git, and anything else the shell can do. 30s timeout.',
      input_schema: {
         type: 'object',
         properties: {
            command: {
               type: 'string',
               description: 'The shell command to execute'
            }
         },
         required: ['command']
      }
   },
   {
      name: 'write_file',
      description: 'Write content to a file, creating or overwriting it. Use this instead of shell redirects to avoid escaping issues.',
      input_schema: {
         type: 'object',
         properties: {
            path: {
               type: 'string',
               description: 'The file path to write to'
            },
            content: {
               type: 'string',
               description: 'The full content to write'
            }
         },
         required: ['path', 'content']
      }
   },
   {
      name: 'edit_file',
      description: 'Edit a file by replacing an exact string with new content. The old_string must appear exactly once in the file. Read the file first (cat) to see its contents, then specify the exact text to replace. Include enough surrounding context in old_string to make it unique.',
      input_schema: {
         type: 'object',
         properties: {
            path: {
               type: 'string',
               description: 'The file path to edit'
            },
            old_string: {
               type: 'string',
               description: 'The exact text to find (must be unique in the file)'
            },
            new_string: {
               type: 'string',
               description: 'The replacement text'
            }
         },
         required: ['path', 'old_string', 'new_string']
      }
   }
];

// Claude format: as-is
var CLAUDE_TOOLS = TOOLS;

// OpenAI format: wrapped in {type: 'function', function: {name, description, parameters}}
var OPENAI_TOOLS = dale.go (TOOLS, function (tool) {
   return {
      type: 'function',
      function: {
         name: tool.name,
         description: tool.description,
         parameters: tool.input_schema
      }
   };
});

// Store pending tool calls awaiting user approval
// {dialogId: {messages, toolCalls, provider, model, metadata}}
var pendingToolCalls = {};

// Execute a tool locally
var executeTool = function (toolName, toolInput) {
   return new Promise (function (resolve) {

      if (toolName === 'run_command') {
         exec (toolInput.command, {timeout: 30000, maxBuffer: 1024 * 1024}, function (error, stdout, stderr) {
            if (error) resolve ({success: false, error: error.message, stderr: stderr});
            else       resolve ({success: true, stdout: stdout, stderr: stderr});
         });
      }

      else if (toolName === 'write_file') {
         fs.writeFile (toolInput.path, toolInput.content, 'utf8', function (error) {
            if (error) resolve ({success: false, error: error.message});
            else       resolve ({success: true, message: 'File written: ' + toolInput.path});
         });
      }

      else if (toolName === 'edit_file') {
         fs.readFile (toolInput.path, 'utf8', function (error, content) {
            if (error) return resolve ({success: false, error: error.message});

            var count = content.split (toolInput.old_string).length - 1;

            if (count === 0) {
               resolve ({success: false, error: 'old_string not found in file'});
            }
            else if (count > 1) {
               resolve ({success: false, error: 'old_string found ' + count + ' times — must be unique. Add more surrounding context.'});
            }
            else {
               var updated = content.replace (toolInput.old_string, toolInput.new_string);
               fs.writeFile (toolInput.path, updated, 'utf8', function (error) {
                  if (error) resolve ({success: false, error: error.message});
                  else       resolve ({success: true, message: 'Edit applied to ' + toolInput.path});
               });
            }
         });
      }

      else {
         resolve ({success: false, error: 'Unknown tool: ' + toolName});
      }
   });
};

// *** LLM FUNCTIONS ***

// Parse markdown dialog into messages array
var parseDialog = function (markdown) {
   var messages = [];
   var lines = markdown.split ('\n');
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

// Convert messages array to markdown
var dialogToMarkdown = function (messages, metadata) {
   var md = '# Dialog\n\n';
   if (metadata) {
      md += '> Provider: ' + metadata.provider + ' | Model: ' + metadata.model + '\n\n';
   }
   dale.go (messages, function (msg) {
      var role = msg.role === 'user' ? 'User' : 'Assistant';
      md += '## ' + role + '\n\n' + msg.content + '\n\n';
   });
   return md;
};

// Load or create dialog file, returns {messages, filepath}
var loadDialog = function (dialogId) {
   var filename = 'dialog-' + dialogId + '.md';
   var filepath = Path.join (VIBEY_DIR, filename);

   if (fs.existsSync (filepath)) {
      var content = fs.readFileSync (filepath, 'utf8');
      return {messages: parseDialog (content), filepath: filepath, filename: filename};
   }
   return {messages: [], filepath: filepath, filename: filename};
};

// Save dialog to markdown file
var saveDialog = function (filepath, messages, metadata) {
   var markdown = dialogToMarkdown (messages, metadata);
   fs.writeFileSync (filepath, markdown, 'utf8');
};

// Append text to dialog file
var appendToDialog = function (filepath, text) {
   fs.appendFileSync (filepath, text);
};

// Implementation function for Claude (streaming with tool support)
var chatWithClaude = async function (messages, model, onChunk) {
   model = model || 'claude-sonnet-4-20250514';

   var requestBody = {
      model: model,
      max_tokens: 64000,
      stream: true,
      messages: messages,
      tools: CLAUDE_TOOLS,
      system: 'You are a helpful assistant with access to local system tools. When the user asks you to run commands, read files, write files, or list directories, USE the provided tools to actually execute these operations. Do not just describe what you would do - actually call the tools to perform the requested actions.'
   };

   var response = await fetch ('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'x-api-key': CLAUDE_API_KEY,
         'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify (requestBody)
   });

   if (! response.ok) {
      var error = await response.text ();
      throw new Error ('Claude API error: ' + response.status + ' - ' + error);
   }

   var fullContent = '';
   var toolCalls = [];
   var currentToolUse = null;
   var reader = response.body.getReader ();
   var decoder = new TextDecoder ();
   var buffer = '';

   while (true) {
      var result = await reader.read ();
      if (result.done) break;

      buffer += decoder.decode (result.value, {stream: true});
      var lines = buffer.split ('\n');
      buffer = lines.pop ();

      dale.go (lines, function (line) {
         if (line.startsWith ('data: ')) {
            var data = line.slice (6);
            if (data === '[DONE]') return;
            try {
               var parsed = JSON.parse (data);

               // Text content
               if (parsed.type === 'content_block_delta' && parsed.delta && parsed.delta.text) {
                  fullContent += parsed.delta.text;
                  if (onChunk) onChunk (parsed.delta.text);
               }

               // Tool use start
               if (parsed.type === 'content_block_start' && parsed.content_block && parsed.content_block.type === 'tool_use') {
                  currentToolUse = {
                     id: parsed.content_block.id,
                     name: parsed.content_block.name,
                     input: ''
                  };
               }

               // Tool use input delta
               if (parsed.type === 'content_block_delta' && parsed.delta && parsed.delta.type === 'input_json_delta') {
                  if (currentToolUse) {
                     currentToolUse.input += parsed.delta.partial_json;
                  }
               }

               // Tool use stop
               if (parsed.type === 'content_block_stop' && currentToolUse) {
                  try {
                     currentToolUse.input = JSON.parse (currentToolUse.input);
                  }
                  catch (e) {
                     currentToolUse.input = {};
                  }
                  toolCalls.push (currentToolUse);
                  currentToolUse = null;
               }
            }
            catch (e) {}
         }
      });
   }

   return {
      provider: 'claude',
      model: model,
      content: fullContent,
      toolCalls: toolCalls.length > 0 ? toolCalls : null
   };
};

// Implementation function for OpenAI (streaming with tool support)
var chatWithOpenAI = async function (messages, model, onChunk) {
   model = model || 'gpt-4o';

   var requestBody = {
      model: model,
      stream: true,
      messages: [{
         role: 'system',
         content: 'You are a helpful assistant with access to local system tools. When the user asks you to run commands, read files, write files, or list directories, USE the provided tools to actually execute these operations. Do not just describe what you would do - actually call the tools to perform the requested actions.'
      }].concat (messages),
      tools: OPENAI_TOOLS
   };

   var response = await fetch ('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'Authorization': 'Bearer ' + OPENAI_API_KEY
      },
      body: JSON.stringify (requestBody)
   });

   if (! response.ok) {
      var error = await response.text ();
      throw new Error ('OpenAI API error: ' + response.status + ' - ' + error);
   }

   var fullContent = '';
   var toolCalls = [];
   var toolCallsInProgress = {}; // {index: {id, name, arguments}}
   var reader = response.body.getReader ();
   var decoder = new TextDecoder ();
   var buffer = '';

   while (true) {
      var result = await reader.read ();
      if (result.done) break;

      buffer += decoder.decode (result.value, {stream: true});
      var lines = buffer.split ('\n');
      buffer = lines.pop ();

      dale.go (lines, function (line) {
         if (line.startsWith ('data: ')) {
            var data = line.slice (6);
            if (data === '[DONE]') return;
            try {
               var parsed = JSON.parse (data);
               var delta = parsed.choices && parsed.choices [0] && parsed.choices [0].delta;
               if (! delta) return;

               // Text content
               if (delta.content) {
                  fullContent += delta.content;
                  if (onChunk) onChunk (delta.content);
               }

               // Tool calls
               if (delta.tool_calls) {
                  dale.go (delta.tool_calls, function (tc) {
                     var idx = tc.index;
                     if (! toolCallsInProgress [idx]) {
                        toolCallsInProgress [idx] = {id: tc.id, name: '', arguments: ''};
                     }
                     if (tc.id) toolCallsInProgress [idx].id = tc.id;
                     if (tc.function && tc.function.name) toolCallsInProgress [idx].name += tc.function.name;
                     if (tc.function && tc.function.arguments) toolCallsInProgress [idx].arguments += tc.function.arguments;
                  });
               }
            }
            catch (e) {}
         }
      });
   }

   // Convert in-progress tool calls to final format
   dale.go (toolCallsInProgress, function (tc) {
      try {
         toolCalls.push ({
            id: tc.id,
            name: tc.name,
            input: JSON.parse (tc.arguments)
         });
      }
      catch (e) {
         toolCalls.push ({id: tc.id, name: tc.name, input: {}});
      }
   });

   return {
      provider: 'openai',
      model: model,
      content: fullContent,
      toolCalls: toolCalls.length > 0 ? toolCalls : null
   };
};

// Main function that chooses provider, manages dialog, and streams response
// dialogId: identifier for the dialog (used for filename)
// provider: 'claude' or 'openai'
// prompt: the user's message (can be null if continuing from tool results)
// model: optional model override
// onChunk: callback for streaming chunks
// useTools: whether to enable MCP tools
// existingMessages: optional messages to use instead of loading (for tool continuation)
var chat = async function (dialogId, provider, prompt, model, onChunk, existingMessages) {
   if (provider !== 'claude' && provider !== 'openai') {
      throw new Error ('Unknown provider: ' + provider + '. Use "claude" or "openai".');
   }

   // Load existing dialog or use provided messages
   var dialog = loadDialog (dialogId);
   var messages = existingMessages || dialog.messages;
   var defaultModel = model || (provider === 'claude' ? 'claude-sonnet-4-20250514' : 'gpt-4o');

   // Add user message if provided and save to file immediately
   if (prompt) {
      messages.push ({role: 'user', content: prompt});
      saveDialog (dialog.filepath, messages, {provider: provider, model: defaultModel});
   }

   // Append assistant header to file before streaming
   appendToDialog (dialog.filepath, '## Assistant\n\n');

   // Wrap onChunk to also write streaming content to file
   var wrappedOnChunk = function (chunk) {
      appendToDialog (dialog.filepath, chunk);
      if (onChunk) onChunk (chunk);
   };

   // Call appropriate provider
   var result;
   if (provider === 'claude') {
      result = await chatWithClaude (messages, model, wrappedOnChunk);
   }
   else {
      result = await chatWithOpenAI (messages, model, wrappedOnChunk);
   }

   // Close the assistant section in the file
   appendToDialog (dialog.filepath, '\n\n');

   // Add assistant response to messages (for API context)
   if (result.content) {
      messages.push ({role: 'assistant', content: result.content});
   }

   // If there are tool calls, write them to the file and store for approval
   if (result.toolCalls) {
      var toolSection = '';
      dale.go (result.toolCalls, function (tc) {
         toolSection += '---\n';
         toolSection += 'Tool request: ' + tc.name + '\n\n';
         toolSection += '    ' + JSON.stringify (tc.input, null, 2).split ('\n').join ('\n    ') + '\n\n';
      });
      toolSection += '---\n\n';
      appendToDialog (dialog.filepath, toolSection);

      pendingToolCalls [dialogId] = {
         messages: messages,
         toolCalls: result.toolCalls,
         provider: provider,
         model: result.model,
         metadata: {provider: provider, model: result.model},
         filepath: dialog.filepath,
         filename: dialog.filename,
         assistantContent: result.content
      };
   }

   return {
      dialogId: dialogId,
      filename: dialog.filename,
      provider: result.provider,
      model: result.model,
      content: result.content,
      toolCalls: result.toolCalls
   };
};

// Continue a dialog after tool results are submitted
var continueWithToolResults = async function (dialogId, toolResults, onChunk) {
   var pending = pendingToolCalls [dialogId];
   if (! pending) {
      throw new Error ('No pending tool calls for dialog: ' + dialogId);
   }

   // Write tool decisions and results to the dialog file
   var decisionText = '## User\n\nTool results:\n\n';
   dale.go (pending.toolCalls, function (tc, k) {
      var tr = toolResults [k];
      if (tr && tr.error) {
         decisionText += '**' + tc.name + ':** Denied\n\n';
      }
      else {
         decisionText += '**' + tc.name + ':** Approved\n\n';
         if (tr && tr.result) {
            decisionText += '    ' + JSON.stringify (tr.result, null, 2).split ('\n').join ('\n    ') + '\n\n';
         }
      }
   });
   appendToDialog (pending.filepath, decisionText);

   var messages = pending.messages.slice (); // Copy
   var provider = pending.provider;
   var model = pending.model;

   // Build the messages with tool results based on provider format
   if (provider === 'claude') {
      // For Claude: assistant message with tool_use blocks, then user message with tool_result blocks
      // Remove the plain text assistant message we added earlier (if any)
      if (messages.length > 0 && messages [messages.length - 1].role === 'assistant') {
         messages.pop ();
      }

      // Add assistant message with tool_use content
      var assistantContent = [];
      if (pending.assistantContent) {
         assistantContent.push ({type: 'text', text: pending.assistantContent});
      }
      dale.go (pending.toolCalls, function (tc) {
         assistantContent.push ({
            type: 'tool_use',
            id: tc.id,
            name: tc.name,
            input: tc.input
         });
      });
      messages.push ({role: 'assistant', content: assistantContent});

      // Add user message with tool_result blocks
      var toolResultContent = [];
      dale.go (toolResults, function (tr) {
         toolResultContent.push ({
            type: 'tool_result',
            tool_use_id: tr.id,
            content: tr.error ? ('Error: ' + tr.error) : JSON.stringify (tr.result)
         });
      });
      messages.push ({role: 'user', content: toolResultContent});
   }
   else {
      // For OpenAI: assistant message with tool_calls, then tool role messages
      // Remove the plain text assistant message we added earlier (if any)
      if (messages.length > 0 && messages [messages.length - 1].role === 'assistant') {
         messages.pop ();
      }

      // Add assistant message with tool_calls
      messages.push ({
         role: 'assistant',
         content: pending.assistantContent || null,
         tool_calls: dale.go (pending.toolCalls, function (tc) {
            return {
               id: tc.id,
               type: 'function',
               function: {
                  name: tc.name,
                  arguments: JSON.stringify (tc.input)
               }
            };
         })
      });

      // Add tool result messages
      dale.go (toolResults, function (tr) {
         messages.push ({
            role: 'tool',
            tool_call_id: tr.id,
            content: tr.error ? ('Error: ' + tr.error) : JSON.stringify (tr.result)
         });
      });
   }

   // Clear pending
   delete pendingToolCalls [dialogId];

   // Continue the conversation
   var result = await chat (dialogId, provider, null, model, onChunk, messages);
   return result;
};

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

   // *** LLM ***

   // Streaming chat endpoint using Server-Sent Events
   ['post', 'chat', async function (rq, rs) {
      if (stop (rs, [
         ['dialogId', rq.body.dialogId, 'string'],
         ['provider', rq.body.provider, 'string', {oneOf: ['claude', 'openai']}],
         ['prompt', rq.body.prompt, 'string'],
      ])) return;

      if (rq.body.model !== undefined && type (rq.body.model) !== 'string') {
         return reply (rs, 400, {error: 'model must be a string'});
      }

      // Set up SSE headers
      rs.writeHead (200, {
         'Content-Type': 'text/event-stream',
         'Cache-Control': 'no-cache',
         'Connection': 'keep-alive'
      });

      try {
         var result = await chat (
            rq.body.dialogId,
            rq.body.provider,
            rq.body.prompt,
            rq.body.model,
            function (chunk) {
               // Send each chunk as an SSE event
               rs.write ('data: ' + JSON.stringify ({type: 'chunk', content: chunk}) + '\n\n');
            }
         );

         // If there are tool calls, send them for approval
         if (result.toolCalls) {
            rs.write ('data: ' + JSON.stringify ({type: 'tool_request', toolCalls: result.toolCalls, content: result.content}) + '\n\n');
         }

         // Send final message with full result
         rs.write ('data: ' + JSON.stringify ({type: 'done', result: result}) + '\n\n');
         rs.end ();
      }
      catch (error) {
         clog ('Chat error:', error.message);
         rs.write ('data: ' + JSON.stringify ({type: 'error', error: error.message}) + '\n\n');
         rs.end ();
      }
   }],

   // Submit tool results after user approval
   ['post', 'chat/tool-result', async function (rq, rs) {
      if (stop (rs, [
         ['dialogId', rq.body.dialogId, 'string'],
         ['toolResults', rq.body.toolResults, 'array'],
      ])) return;

      // Set up SSE headers
      rs.writeHead (200, {
         'Content-Type': 'text/event-stream',
         'Cache-Control': 'no-cache',
         'Connection': 'keep-alive'
      });

      try {
         var result = await continueWithToolResults (
            rq.body.dialogId,
            rq.body.toolResults,
            function (chunk) {
               rs.write ('data: ' + JSON.stringify ({type: 'chunk', content: chunk}) + '\n\n');
            }
         );

         // If there are more tool calls, send them for approval
         if (result.toolCalls) {
            rs.write ('data: ' + JSON.stringify ({type: 'tool_request', toolCalls: result.toolCalls, content: result.content}) + '\n\n');
         }

         rs.write ('data: ' + JSON.stringify ({type: 'done', result: result}) + '\n\n');
         rs.end ();
      }
      catch (error) {
         clog ('Tool result error:', error.message);
         rs.write ('data: ' + JSON.stringify ({type: 'error', error: error.message}) + '\n\n');
         rs.end ();
      }
   }],

   // Execute a tool (called after user approves)
   ['post', 'tool/execute', async function (rq, rs) {
      if (stop (rs, [
         ['toolName', rq.body.toolName, 'string'],
         ['toolInput', rq.body.toolInput, 'object'],
      ])) return;

      try {
         var result = await executeTool (rq.body.toolName, rq.body.toolInput);
         reply (rs, 200, result);
      }
      catch (error) {
         clog ('Tool execution error:', error.message);
         reply (rs, 500, {success: false, error: error.message});
      }
   }],

   // Get pending tool calls for a dialog
   ['get', 'chat/pending/:dialogId', function (rq, rs) {
      var dialogId = rq.data.params.dialogId;
      var pending = pendingToolCalls [dialogId];
      if (! pending) {
         return reply (rs, 404, {error: 'No pending tool calls'});
      }
      reply (rs, 200, {
         dialogId: dialogId,
         toolCalls: pending.toolCalls,
         assistantContent: pending.assistantContent
      });
   }],

   // Get dialog by ID
   ['get', 'dialog/:id', function (rq, rs) {
      var dialogId = rq.data.params.id;
      var dialog = loadDialog (dialogId);

      if (dialog.messages.length === 0 && ! fs.existsSync (dialog.filepath)) {
         return reply (rs, 404, {error: 'Dialog not found'});
      }

      fs.readFile (dialog.filepath, 'utf8', function (error, content) {
         if (error) return reply (rs, 500, {error: 'Failed to read dialog'});
         reply (rs, 200, {
            dialogId: dialogId,
            filename: dialog.filename,
            messages: dialog.messages,
            markdown: content
         });
      });
   }],

   // List all dialogs
   ['get', 'dialogs', function (rq, rs) {
      fs.readdir (VIBEY_DIR, function (error, files) {
         if (error) return reply (rs, 500, {error: 'Failed to read directory'});
         var dialogFiles = dale.fil (files, undefined, function (file) {
            if (file.startsWith ('dialog-') && file.endsWith ('.md')) return file;
         });
         // Sort by modification time, most recent first
         var withStats = dale.go (dialogFiles, function (file) {
            try {
               var stat = fs.statSync (Path.join (VIBEY_DIR, file));
               var dialogId = file.replace ('dialog-', '').replace ('.md', '');
               return {dialogId: dialogId, filename: file, mtime: stat.mtime.getTime ()};
            }
            catch (e) {
               return null;
            }
         });
         withStats = dale.fil (withStats, undefined, function (f) { return f; });
         withStats.sort (function (a, b) { return b.mtime - a.mtime; });
         reply (rs, 200, withStats);
      });
   }],
];

// *** SERVER ***

process.on ('uncaughtException', function (error, origin) {
   clog ({priority: 'critical', type: 'server error', error: error, stack: error.stack, origin: origin});
   process.exit (1);
});

var port = CONFIG.vibeyPort || 3001;
cicek.listen ({port: port}, routes);

clog ('vibey server running on port ' + port);
