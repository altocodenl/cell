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

var safeJsonParse = function (text, fallback) {
   try {
      return JSON.parse (text);
   }
   catch (error) {
      return fallback;
   }
};

var parseMetadata = function (markdown) {
   var metaMatch = markdown.match (/> Provider:\s*([^|]+)\|\s*Model:\s*([^\n]+)/);
   if (! metaMatch) return {};
   return {
      provider: metaMatch [1].trim (),
      model: metaMatch [2].trim ()
   };
};

var parseAuthorizations = function (markdown) {
   var authorized = {};
   var re = /^> Authorized:\s*([a-zA-Z0-9_\-]+)/gm;
   var match;
   while ((match = re.exec (markdown)) !== null) {
      authorized [match [1]] = true;
   }
   return authorized;
};

var parseToolCalls = function (text, includePositions) {
   var toolCalls = [];
   var re = /---\nTool request:\s+([^\n\[]+?)(?:\s+\[([^\]]+)\])?\n\n([\s\S]*?)\n---/g;
   var match;
   while ((match = re.exec (text)) !== null) {
      var full = match [0];
      var name = match [1].trim ();
      var id = (match [2] || '').trim ();
      var body = match [3];
      var decisionMatch = body.match (/\nDecision:\s*(approved|denied)\s*(?:\n|$)/);
      var decision = decisionMatch ? decisionMatch [1] : null;
      var decisionIndex = decisionMatch ? decisionMatch.index : -1;
      var inputPart = decisionIndex >= 0 ? body.slice (0, decisionIndex) : body;
      var inputText = inputPart.replace (/^\s+|\s+$/g, '').replace (/^    /gm, '');
      var result = null;
      var resultMatch = body.match (/\nResult:\n\n([\s\S]*)$/);
      if (resultMatch) {
         var resultText = resultMatch [1].replace (/^\s+|\s+$/g, '').replace (/^    /gm, '');
         result = safeJsonParse (resultText, resultText);
      }
      var parsedInput = safeJsonParse (inputText || '{}', {});
      var parsed = {
         id: id || null,
         name: name,
         input: parsedInput,
         decision: decision,
         result: result
      };
      if (includePositions) {
         parsed.start = match.index;
         parsed.end = match.index + full.length;
         parsed.raw = full;
      }
      toolCalls.push (parsed);
   }
   return toolCalls;
};

var buildToolBlock = function (toolCall, decision, result) {
   var block = '---\n';
   block += 'Tool request: ' + toolCall.name + ' [' + toolCall.id + ']\n\n';
   block += '    ' + JSON.stringify (toolCall.input || {}, null, 2).split ('\n').join ('\n    ') + '\n\n';
   if (decision) {
      block += 'Decision: ' + decision + '\n';
      if (decision === 'approved') {
         block += 'Result:\n\n';
         block += '    ' + JSON.stringify (result, null, 2).split ('\n').join ('\n    ') + '\n\n';
      }
      else block += '\n';
   }
   block += '---';
   return block;
};

var parseSections = function (markdown) {
   var sections = [];
   var re = /## (User|Assistant)\n\n([\s\S]*?)(?=\n## (?:User|Assistant)\n\n|$)/g;
   var match;
   while ((match = re.exec (markdown)) !== null) {
      sections.push ({
         role: match [1].toLowerCase (),
         content: match [2].replace (/\s+$/, '')
      });
   }
   return sections;
};

var parseDialogForProvider = function (markdown, provider) {
   var messages = [];
   dale.go (parseSections (markdown), function (section) {
      if (section.role === 'user') {
         var userText = section.content.trim ();
         if (userText) messages.push ({role: 'user', content: userText});
         return;
      }

      var toolCalls = parseToolCalls (section.content, false);
      var assistantText = section.content.replace (/---\nTool request:\s+[^\n\[]+?(?:\s+\[[^\]]+\])?\n\n[\s\S]*?\n---/g, '').trim ();

      if (! toolCalls.length) {
         if (assistantText) messages.push ({role: 'assistant', content: assistantText});
         return;
      }

      if (provider === 'claude') {
         var assistantContent = [];
         if (assistantText) assistantContent.push ({type: 'text', text: assistantText});
         dale.go (toolCalls, function (tc) {
            assistantContent.push ({
               type: 'tool_use',
               id: tc.id,
               name: tc.name,
               input: tc.input
            });
         });
         messages.push ({role: 'assistant', content: assistantContent});

         var decided = dale.fil (toolCalls, undefined, function (tc) {
            if (tc.decision) return tc;
         });
         if (decided.length) {
            messages.push ({role: 'user', content: dale.go (decided, function (tc) {
               return {
                  type: 'tool_result',
                  tool_use_id: tc.id,
                  content: tc.decision === 'approved' ? JSON.stringify (tc.result) : 'Denied by user'
               };
            })});
         }
      }
      else {
         messages.push ({
            role: 'assistant',
            content: assistantText || null,
            tool_calls: dale.go (toolCalls, function (tc) {
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

         dale.go (toolCalls, function (tc) {
            if (! tc.decision) return;
            messages.push ({
               role: 'tool',
               tool_call_id: tc.id,
               content: tc.decision === 'approved' ? JSON.stringify (tc.result) : 'Denied by user'
            });
         });
      }
   });
   return messages;
};

var findDialogFilename = function (dialogId) {
   var exact = 'dialog-' + dialogId + '.md';
   var exactPath = Path.join (VIBEY_DIR, exact);
   if (fs.existsSync (exactPath)) return exact;

   var files = fs.readdirSync (VIBEY_DIR);
   var prefix = 'dialog-' + dialogId + '-';
   var found = dale.stopNot (files, undefined, function (file) {
      if (file.startsWith (prefix) && file.endsWith ('.md')) return file;
   });
   return found || exact;
};

var loadDialog = function (dialogId) {
   var filename = findDialogFilename (dialogId);
   var filepath = Path.join (VIBEY_DIR, filename);
   var exists = fs.existsSync (filepath);
   var markdown = exists ? fs.readFileSync (filepath, 'utf8') : '';
   return {
      dialogId: dialogId,
      filename: filename,
      filepath: filepath,
      exists: exists,
      markdown: markdown,
      metadata: parseMetadata (markdown)
   };
};

var getGlobalAuthorizations = function () {
   var docMain = Path.join (VIBEY_DIR, 'doc-main.md');
   if (! fs.existsSync (docMain)) return [];
   var auth = parseAuthorizations (fs.readFileSync (docMain, 'utf8'));
   return Object.keys (auth);
};

var ensureDialogFile = function (dialog, provider, model) {
   if (dialog.exists) {
      if (dialog.metadata.provider && dialog.metadata.model) return;
      var content = fs.readFileSync (dialog.filepath, 'utf8');
      var headerLine = '> Provider: ' + provider + ' | Model: ' + model + '\n\n';
      if (content.startsWith ('# Dialog\n\n')) content = '# Dialog\n\n' + headerLine + content.slice (10);
      else content = '# Dialog\n\n' + headerLine + content;
      fs.writeFileSync (dialog.filepath, content, 'utf8');
      dialog.markdown = content;
      dialog.metadata = {provider: provider, model: model};
      return;
   }

   var header = '# Dialog\n\n';
   header += '> Provider: ' + provider + ' | Model: ' + model + '\n\n';
   dale.go (getGlobalAuthorizations (), function (name) {
      header += '> Authorized: ' + name + '\n';
   });
   if (header [header.length - 1] !== '\n') header += '\n';
   header += '\n';
   fs.writeFileSync (dialog.filepath, header, 'utf8');
   dialog.exists = true;
   dialog.markdown = header;
};

var appendToDialog = function (filepath, text) {
   fs.appendFileSync (filepath, text, 'utf8');
};

var writeToolDecisions = function (filepath, decisionsById) {
   var markdown = fs.readFileSync (filepath, 'utf8');
   var toolCalls = parseToolCalls (markdown, true);

   for (var i = toolCalls.length - 1; i >= 0; i--) {
      var tc = toolCalls [i];
      if (tc.decision) continue;
      var decision = decisionsById [tc.id];
      if (! decision) continue;
      var replacement = buildToolBlock (tc, decision.decision, decision.result);
      markdown = markdown.slice (0, tc.start) + replacement + markdown.slice (tc.end);
   }

   fs.writeFileSync (filepath, markdown, 'utf8');
};

var getPendingToolCalls = function (filepath) {
   if (! fs.existsSync (filepath)) return [];
   var markdown = fs.readFileSync (filepath, 'utf8');
   return dale.fil (parseToolCalls (markdown, false), undefined, function (tc) {
      if (! tc.decision) return tc;
   });
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

var appendToolCallsToAssistantSection = function (filepath, toolCalls) {
   if (! toolCalls || ! toolCalls.length) return;
   dale.go (toolCalls, function (tc) {
      appendToDialog (filepath, buildToolBlock (tc) + '\n\n');
   });
};

var runCompletion = async function (dialog, provider, model, onChunk) {
   var markdown = fs.readFileSync (dialog.filepath, 'utf8');
   var messages = parseDialogForProvider (markdown, provider);

   appendToDialog (dialog.filepath, '## Assistant\n\n');

   var writeChunk = function (chunk) {
      appendToDialog (dialog.filepath, chunk);
      if (onChunk) onChunk (chunk);
   };

   var result = provider === 'claude'
      ? await chatWithClaude (messages, model, writeChunk)
      : await chatWithOpenAI (messages, model, writeChunk);

   appendToDialog (dialog.filepath, '\n\n');
   appendToolCallsToAssistantSection (dialog.filepath, result.toolCalls);

   var authorizations = parseAuthorizations (fs.readFileSync (dialog.filepath, 'utf8'));
   var decisionsById = {};
   var autoExecuted = [];
   var pending = [];

   for (var i = 0; i < (result.toolCalls || []).length; i++) {
      var tc = result.toolCalls [i];
      if (authorizations [tc.name]) {
         var toolResult = await executeTool (tc.name, tc.input);
         decisionsById [tc.id] = {decision: 'approved', result: toolResult};
         autoExecuted.push ({id: tc.id, name: tc.name, result: toolResult});
      }
      else pending.push (tc);
   }

   if (Object.keys (decisionsById).length) writeToolDecisions (dialog.filepath, decisionsById);

   return {
      dialogId: dialog.dialogId,
      filename: dialog.filename,
      provider: provider,
      model: model,
      content: result.content,
      toolCalls: pending.length ? pending : null,
      autoExecuted: autoExecuted
   };
};

var startDialogTurn = async function (dialogId, provider, prompt, model, onChunk) {
   if (provider !== 'claude' && provider !== 'openai') {
      throw new Error ('Unknown provider: ' + provider + '. Use "claude" or "openai".');
   }

   var defaultModel = model || (provider === 'claude' ? 'claude-sonnet-4-20250514' : 'gpt-4o');
   var dialog = loadDialog (dialogId);
   ensureDialogFile (dialog, provider, defaultModel);

   appendToDialog (dialog.filepath, '## User\n\n' + prompt + '\n\n');

   return await runCompletion (dialog, provider, defaultModel, onChunk);
};

var resumeDialogTurn = async function (dialogId, decisions, authorizations, provider, model, onChunk) {
   var dialog = loadDialog (dialogId);
   if (! dialog.exists) throw new Error ('Dialog not found: ' + dialogId);

   if (authorizations && authorizations.length) {
      dale.go (authorizations, function (name) {
         appendToDialog (dialog.filepath, '> Authorized: ' + name + '\n');
      });
      appendToDialog (dialog.filepath, '\n');
   }

   var pending = getPendingToolCalls (dialog.filepath);
   if (! pending.length) throw new Error ('No pending tool calls for dialog: ' + dialogId);

   var pendingById = {};
   dale.go (pending, function (tc) {
      pendingById [tc.id] = tc;
   });

   var decisionsById = {};
   dale.go (decisions || [], function (decision) {
      var tc = pendingById [decision.id];
      if (! tc) return;
      if (decision.approved) {
         decisionsById [tc.id] = {decision: 'approved', result: null, toolCall: tc};
      }
      else {
         decisionsById [tc.id] = {decision: 'denied', result: {success: false, error: 'User denied this tool call'}, toolCall: tc};
      }
   });

   for (var i = 0; i < pending.length; i++) {
      var tc = pending [i];
      if (! decisionsById [tc.id]) continue;
      if (decisionsById [tc.id].decision !== 'approved') continue;
      decisionsById [tc.id].result = await executeTool (tc.name, tc.input);
   }

   var toWrite = {};
   dale.go (Object.keys (decisionsById), function (id) {
      toWrite [id] = {
         decision: decisionsById [id].decision,
         result: decisionsById [id].result
      };
   });
   if (Object.keys (toWrite).length) writeToolDecisions (dialog.filepath, toWrite);

   var meta = parseMetadata (fs.readFileSync (dialog.filepath, 'utf8'));
   var resolvedProvider = provider || meta.provider;
   if (resolvedProvider !== 'claude' && resolvedProvider !== 'openai') {
      throw new Error ('Unable to determine provider for dialog resume');
   }
   var resolvedModel = model || meta.model || (resolvedProvider === 'claude' ? 'claude-sonnet-4-20250514' : 'gpt-4o');
   return await runCompletion (dialog, resolvedProvider, resolvedModel, onChunk);
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
   ['post', 'dialog', async function (rq, rs) {
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
         var result = await startDialogTurn (
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

   // Resume a dialog by approving/denying tool requests by id
   ['post', 'dialog/resume', async function (rq, rs) {
      if (stop (rs, [
         ['dialogId', rq.body.dialogId, 'string'],
         ['decisions', rq.body.decisions, 'array'],
      ])) return;

      if (rq.body.authorizations !== undefined && type (rq.body.authorizations) !== 'array') {
         return reply (rs, 400, {error: 'authorizations must be an array'});
      }
      if (rq.body.provider !== undefined && (type (rq.body.provider) !== 'string' || ! inc (['claude', 'openai'], rq.body.provider))) {
         return reply (rs, 400, {error: 'provider must be claude or openai'});
      }
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
         var result = await resumeDialogTurn (
            rq.body.dialogId,
            rq.body.decisions,
            rq.body.authorizations || [],
            rq.body.provider,
            rq.body.model,
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
         clog ('Dialog resume error:', error.message);
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
   ['get', 'dialog/pending/:dialogId', function (rq, rs) {
      var dialogId = rq.data.params.dialogId;
      var dialog = loadDialog (dialogId);
      if (! dialog.exists) return reply (rs, 404, {error: 'Dialog not found'});
      var pending = getPendingToolCalls (dialog.filepath);
      if (! pending.length) {
         return reply (rs, 404, {error: 'No pending tool calls'});
      }
      reply (rs, 200, {
         dialogId: dialogId,
         toolCalls: pending
      });
   }],

   // Get dialog by ID
   ['get', 'dialog/:id', function (rq, rs) {
      var dialogId = rq.data.params.id;
      var dialog = loadDialog (dialogId);

      if (! dialog.exists) {
         return reply (rs, 404, {error: 'Dialog not found'});
      }

      fs.readFile (dialog.filepath, 'utf8', function (error, content) {
         if (error) return reply (rs, 500, {error: 'Failed to read dialog'});
         reply (rs, 200, {
            dialogId: dialogId,
            filename: dialog.filename,
            messages: parseSections (content),
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
