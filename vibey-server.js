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

var crypto = require ('crypto');
var http   = require ('http');

var VIBEY_DIR = Path.join (__dirname, 'vibey');

// *** CONFIG.JSON ***

var CONFIG_JSON_PATH = Path.join (VIBEY_DIR, 'config.json');

var loadConfigJson = function () {
   try {
      if (fs.existsSync (CONFIG_JSON_PATH)) return JSON.parse (fs.readFileSync (CONFIG_JSON_PATH, 'utf8'));
   }
   catch (e) {}
   return {};
};

var saveConfigJson = function (config) {
   if (! fs.existsSync (VIBEY_DIR)) fs.mkdirSync (VIBEY_DIR, {recursive: true});
   fs.writeFileSync (CONFIG_JSON_PATH, JSON.stringify (config, null, 2), 'utf8');
};

var maskApiKey = function (key) {
   if (! key || key.length < 12) return key ? '••••••••' : '';
   return key.slice (0, 7) + '••••••••' + key.slice (-4);
};

// *** PKCE ***

var base64urlEncode = function (buffer) {
   return buffer.toString ('base64').replace (/\+/g, '-').replace (/\//g, '_').replace (/=/g, '');
};

var generatePKCE = async function () {
   var verifierBytes = crypto.randomBytes (32);
   var verifier = base64urlEncode (verifierBytes);
   var challengeBuffer = crypto.createHash ('sha256').update (verifier).digest ();
   var challenge = base64urlEncode (challengeBuffer);
   return {verifier: verifier, challenge: challenge};
};

// *** OAUTH: ANTHROPIC ***

var ANTHROPIC_CLIENT_ID = Buffer.from ('OWQxYzI1MGEtZTYxYi00NGQ5LTg4ZWQtNTk0NGQxOTYyZjVl', 'base64').toString ();
var ANTHROPIC_AUTHORIZE_URL = 'https://claude.ai/oauth/authorize';
var ANTHROPIC_TOKEN_URL = 'https://console.anthropic.com/v1/oauth/token';
var ANTHROPIC_REDIRECT_URI = 'https://console.anthropic.com/oauth/code/callback';
var ANTHROPIC_SCOPES = 'org:create_api_key user:profile user:inference';

// In-flight PKCE state for Anthropic login
var anthropicPendingLogin = null;

var startAnthropicLogin = async function () {
   var pkce = await generatePKCE ();
   var params = new URLSearchParams ({
      code: 'true',
      client_id: ANTHROPIC_CLIENT_ID,
      response_type: 'code',
      redirect_uri: ANTHROPIC_REDIRECT_URI,
      scope: ANTHROPIC_SCOPES,
      code_challenge: pkce.challenge,
      code_challenge_method: 'S256',
      state: pkce.verifier
   });
   var url = ANTHROPIC_AUTHORIZE_URL + '?' + params.toString ();
   anthropicPendingLogin = {verifier: pkce.verifier};
   return url;
};

var completeAnthropicLogin = async function (authCode) {
   if (! anthropicPendingLogin) throw new Error ('No pending Anthropic login');
   var verifier = anthropicPendingLogin.verifier;
   anthropicPendingLogin = null;

   var splits = authCode.split ('#');
   var code = splits [0];
   var state = splits [1];

   var response = await fetch (ANTHROPIC_TOKEN_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify ({
         grant_type: 'authorization_code',
         client_id: ANTHROPIC_CLIENT_ID,
         code: code,
         state: state,
         redirect_uri: ANTHROPIC_REDIRECT_URI,
         code_verifier: verifier
      })
   });

   if (! response.ok) {
      var error = await response.text ();
      throw new Error ('Anthropic token exchange failed: ' + error);
   }

   var tokenData = await response.json ();
   var expiresAt = Date.now () + tokenData.expires_in * 1000 - 5 * 60 * 1000;

   var config = loadConfigJson ();
   if (! config.accounts) config.accounts = {};
   config.accounts.claudeOAuth = {
      type: 'oauth',
      access: tokenData.access_token,
      refresh: tokenData.refresh_token,
      expires: expiresAt
   };
   saveConfigJson (config);
   return {ok: true};
};

var refreshAnthropicToken = async function (cred) {
   var response = await fetch (ANTHROPIC_TOKEN_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify ({
         grant_type: 'refresh_token',
         client_id: ANTHROPIC_CLIENT_ID,
         refresh_token: cred.refresh
      })
   });

   if (! response.ok) {
      var error = await response.text ();
      throw new Error ('Anthropic token refresh failed: ' + error);
   }

   var data = await response.json ();
   return {
      access: data.access_token,
      refresh: data.refresh_token,
      expires: Date.now () + data.expires_in * 1000 - 5 * 60 * 1000
   };
};

// *** OAUTH: OPENAI CODEX ***

var OPENAI_CODEX_CLIENT_ID = 'app_EMoamEEZ73f0CkXaXp7hrann';
var OPENAI_AUTHORIZE_URL = 'https://auth.openai.com/oauth/authorize';
var OPENAI_TOKEN_URL = 'https://auth.openai.com/oauth/token';
var OPENAI_REDIRECT_URI = 'http://localhost:1455/auth/callback';
var OPENAI_SCOPE = 'openid profile email offline_access';
var OPENAI_JWT_CLAIM_PATH = 'https://api.openai.com/auth';

var openaiPendingLogin = null;

var SUCCESS_HTML = '<!doctype html><html><head><meta charset="utf-8"><title>Authentication successful</title></head><body><p>Authentication successful. Return to vibey to continue.</p></body></html>';

var decodeJwt = function (token) {
   try {
      var parts = token.split ('.');
      if (parts.length !== 3) return null;
      return JSON.parse (Buffer.from (parts [1], 'base64').toString ());
   }
   catch (e) {return null;}
};

var extractOpenAIAccountId = function (accessToken) {
   var payload = decodeJwt (accessToken);
   var auth = payload && payload [OPENAI_JWT_CLAIM_PATH];
   var accountId = auth && auth.chatgpt_account_id;
   return (type (accountId) === 'string' && accountId.length > 0) ? accountId : null;
};

var startOpenAILogin = async function () {
   var pkce = await generatePKCE ();
   var state = crypto.randomBytes (16).toString ('hex');

   var params = new URLSearchParams ({
      response_type: 'code',
      client_id: OPENAI_CODEX_CLIENT_ID,
      redirect_uri: OPENAI_REDIRECT_URI,
      scope: OPENAI_SCOPE,
      code_challenge: pkce.challenge,
      code_challenge_method: 'S256',
      state: state,
      id_token_add_organizations: 'true',
      codex_cli_simplified_flow: 'true',
      originator: 'vibey'
   });

   var url = OPENAI_AUTHORIZE_URL + '?' + params.toString ();

   // Start local callback server
   var callbackPromise = startOpenAICallbackServer (state);

   openaiPendingLogin = {
      verifier: pkce.verifier,
      state: state,
      callbackPromise: callbackPromise
   };

   return url;
};

var startOpenAICallbackServer = function (expectedState) {
   return new Promise (function (resolveOuter) {
      var lastCode = null;
      var cancelled = false;
      var server = http.createServer (function (req, res) {
         try {
            var url = new URL (req.url || '', 'http://localhost');
            if (url.pathname !== '/auth/callback') {
               res.statusCode = 404;
               res.end ('Not found');
               return;
            }
            if (url.searchParams.get ('state') !== expectedState) {
               res.statusCode = 400;
               res.end ('State mismatch');
               return;
            }
            var code = url.searchParams.get ('code');
            if (! code) {
               res.statusCode = 400;
               res.end ('Missing authorization code');
               return;
            }
            res.statusCode = 200;
            res.setHeader ('Content-Type', 'text/html; charset=utf-8');
            res.end (SUCCESS_HTML);
            lastCode = code;
         }
         catch (e) {
            res.statusCode = 500;
            res.end ('Internal error');
         }
      });

      server.listen (1455, '127.0.0.1', function () {
         resolveOuter ({
            close: function () {server.close ();},
            cancelWait: function () {cancelled = true;},
            waitForCode: function () {
               return new Promise (function (resolve) {
                  var attempts = 0;
                  var interval = setInterval (function () {
                     if (lastCode) {
                        clearInterval (interval);
                        resolve ({code: lastCode});
                     }
                     else if (cancelled || attempts > 600) {
                        clearInterval (interval);
                        resolve (null);
                     }
                     attempts++;
                  }, 100);
               });
            }
         });
      });

      server.on ('error', function () {
         resolveOuter ({
            close: function () {},
            cancelWait: function () {},
            waitForCode: function () {return Promise.resolve (null);}
         });
      });
   });
};

var completeOpenAILogin = async function (manualCode) {
   if (! openaiPendingLogin) throw new Error ('No pending OpenAI login');
   var verifier = openaiPendingLogin.verifier;
   var state = openaiPendingLogin.state;
   var callbackPromise = openaiPendingLogin.callbackPromise;
   openaiPendingLogin = null;

   var server = await callbackPromise;
   var code = null;

   if (manualCode) {
      // User pasted code manually
      server.cancelWait ();
      server.close ();
      var parts = manualCode.trim ().split ('#');
      code = parts [0];
      // Check for URL format
      try {
         var url = new URL (manualCode.trim ());
         code = url.searchParams.get ('code') || code;
      }
      catch (e) {}
   }
   else {
      // Wait for browser callback
      var result = await server.waitForCode ();
      server.close ();
      if (result) code = result.code;
   }

   if (! code) throw new Error ('No authorization code received');

   var response = await fetch (OPENAI_TOKEN_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams ({
         grant_type: 'authorization_code',
         client_id: OPENAI_CODEX_CLIENT_ID,
         code: code,
         code_verifier: verifier,
         redirect_uri: OPENAI_REDIRECT_URI
      })
   });

   if (! response.ok) {
      var error = await response.text ();
      throw new Error ('OpenAI token exchange failed: ' + error);
   }

   var tokenData = await response.json ();
   if (! tokenData.access_token || ! tokenData.refresh_token) throw new Error ('OpenAI token response missing fields');

   var accountId = extractOpenAIAccountId (tokenData.access_token);
   if (! accountId) throw new Error ('Failed to extract accountId from token');

   var config = loadConfigJson ();
   if (! config.accounts) config.accounts = {};
   config.accounts.openaiOAuth = {
      type: 'oauth',
      access: tokenData.access_token,
      refresh: tokenData.refresh_token,
      expires: Date.now () + tokenData.expires_in * 1000,
      accountId: accountId
   };
   saveConfigJson (config);
   return {ok: true};
};

var refreshOpenAIToken = async function (cred) {
   var response = await fetch (OPENAI_TOKEN_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams ({
         grant_type: 'refresh_token',
         refresh_token: cred.refresh,
         client_id: OPENAI_CODEX_CLIENT_ID
      })
   });

   if (! response.ok) {
      var error = await response.text ();
      throw new Error ('OpenAI token refresh failed: ' + error);
   }

   var data = await response.json ();
   if (! data.access_token || ! data.refresh_token) throw new Error ('OpenAI token refresh missing fields');

   var accountId = extractOpenAIAccountId (data.access_token);
   if (! accountId) throw new Error ('Failed to extract accountId from refreshed token');

   return {
      access: data.access_token,
      refresh: data.refresh_token,
      expires: Date.now () + data.expires_in * 1000,
      accountId: accountId
   };
};

// *** API KEY RESOLUTION (API key from config.json > OAuth token) ***

var getApiKey = async function (provider) {
   var config = loadConfigJson ();
   var accounts = config.accounts || {};

   if (provider === 'claude') {
      // 1. OAuth subscription (preferred)
      if (accounts.claudeOAuth && accounts.claudeOAuth.type === 'oauth') {
         var cred = accounts.claudeOAuth;
         if (Date.now () >= cred.expires) {
            try {
               var refreshed = await refreshAnthropicToken (cred);
               config.accounts.claudeOAuth = {type: 'oauth', access: refreshed.access, refresh: refreshed.refresh, expires: refreshed.expires};
               saveConfigJson (config);
               cred = config.accounts.claudeOAuth;
            }
            catch (e) {
               clog ('Anthropic token refresh failed:', e.message);
               return {key: '', type: 'api_key'};
            }
         }
         return {key: cred.access, type: 'oauth'};
      }
      // 2. API key fallback
      if (accounts.claude && accounts.claude.apiKey) return {key: accounts.claude.apiKey, type: 'api_key'};
      // 3. No credentials configured
      return {key: '', type: 'api_key'};
   }

   if (provider === 'openai') {
      // 1. OAuth subscription (preferred)
      if (accounts.openaiOAuth && accounts.openaiOAuth.type === 'oauth') {
         var cred = accounts.openaiOAuth;
         if (Date.now () >= cred.expires) {
            try {
               var refreshed = await refreshOpenAIToken (cred);
               config.accounts.openaiOAuth = {type: 'oauth', access: refreshed.access, refresh: refreshed.refresh, expires: refreshed.expires, accountId: refreshed.accountId};
               saveConfigJson (config);
               cred = config.accounts.openaiOAuth;
            }
            catch (e) {
               clog ('OpenAI token refresh failed:', e.message);
               return {key: '', type: 'api_key'};
            }
         }
         return {key: cred.access, type: 'oauth', accountId: cred.accountId};
      }
      // 2. API key fallback
      if (accounts.openai && accounts.openai.apiKey) return {key: accounts.openai.apiKey, type: 'api_key'};
      // 3. No credentials configured
      return {key: '', type: 'api_key'};
   }

   return {key: '', type: 'api_key'};
};

var getDocMainContent = function (projectDir) {
   var path = Path.join (projectDir, 'doc-main.md');
   if (! fs.existsSync (path)) return null;

   try {
      var content = fs.readFileSync (path, 'utf8');
      if (! content || ! content.trim ()) return null;
      return {name: 'doc-main.md', content: content.trim ()};
   }
   catch (error) {
      return null;
   }
};

var compactText = function (text, maxLines, maxChars) {
   if (type (text) !== 'string') return '';
   maxLines = maxLines || 16;
   maxChars = maxChars || 1800;

   var lines = text.split ('\n');
   var compacted = lines.slice (0, maxLines).join ('\n');
   if (compacted.length > maxChars) compacted = compacted.slice (0, maxChars);

   if (text.length > compacted.length || lines.length > maxLines) compacted = compacted.replace (/\s+$/, '') + '\n...';
   return compacted;
};

var getDocMainInjection = function (projectDir) {
   var docMain = getDocMainContent (projectDir);
   if (! docMain) return '';
   return '\n\nProject instructions (' + docMain.name + '):\n\n' + docMain.content;
};

var upsertDocMainContextBlock = function (filepath, projectDir) {
   if (! fs.existsSync (filepath)) return;

   var markdown = fs.readFileSync (filepath, 'utf8');
   var blockRe = /<!-- DOC_MAIN_CONTEXT_START -->[\s\S]*?<!-- DOC_MAIN_CONTEXT_END -->\n\n?/;
   markdown = markdown.replace (blockRe, '');

   var docMain = getDocMainContent (projectDir);
   if (! docMain) {
      fs.writeFileSync (filepath, markdown, 'utf8');
      return;
   }

   var preview = compactText (docMain.content, 12, 1200).split ('\n').join ('\n    ');
   var block = '<!-- DOC_MAIN_CONTEXT_START -->\n';
   block += '> Prompt context: ' + docMain.name + ' (' + docMain.content.length + ' chars, compacted)\n\n';
   block += '    ' + preview + '\n';
   block += '<!-- DOC_MAIN_CONTEXT_END -->\n\n';

   if (/> Started:[^\n]*\n\n/.test (markdown)) {
      markdown = markdown.replace (/(> Started:[^\n]*\n\n)/, '$1' + block);
   }
   else if (markdown.indexOf ('# Dialog\n\n') === 0) {
      markdown = '# Dialog\n\n' + block + markdown.slice (10);
   }
   else markdown = block + markdown;

   fs.writeFileSync (filepath, markdown, 'utf8');
};

var ACTIVE_STREAMS = {};

var getProjectDir = function (projectName) {
   if (type (projectName) !== 'string' || ! projectName.trim ()) throw new Error ('Invalid project name');
   projectName = projectName.trim ();
   if (projectName.includes ('..') || projectName.includes ('/') || projectName.includes ('\\')) throw new Error ('Invalid project name');

   var dir = Path.join (VIBEY_DIR, projectName);
   var normalizedRoot = Path.resolve (VIBEY_DIR) + Path.sep;
   var normalizedDir = Path.resolve (dir) + Path.sep;
   if (normalizedDir.indexOf (normalizedRoot) !== 0) throw new Error ('Invalid project name');
   return dir;
};

var ensureProjectDir = function (projectName) {
   var dir = getProjectDir (projectName);
   if (! fs.existsSync (dir)) fs.mkdirSync (dir, {recursive: true});
   return dir;
};

var getExistingProjectDir = function (projectName) {
   var dir = getProjectDir (projectName);
   if (! fs.existsSync (dir)) throw new Error ('Project not found');
   return dir;
};

var listProjects = function () {
   if (! fs.existsSync (VIBEY_DIR)) fs.mkdirSync (VIBEY_DIR, {recursive: true});
   var entries = fs.readdirSync (VIBEY_DIR, {withFileTypes: true});
   var dirs = dale.fil (entries, undefined, function (entry) {
      if (entry.isDirectory ()) return entry.name;
   });
   dirs.sort ();
   return dirs;
};

var beginActiveStream = function (dialogId) {
   var controller = new AbortController ();
   ACTIVE_STREAMS [dialogId] = {controller: controller, requestedStatus: null};
   return controller;
};

var getActiveStream = function (dialogId) {
   return ACTIVE_STREAMS [dialogId] || null;
};

var endActiveStream = function (dialogId) {
   delete ACTIVE_STREAMS [dialogId];
};

// *** MCP TOOLS ***

var exec = require ('child_process').exec;

var resolveProjectPath = function (projectDir, path) {
   if (type (path) !== 'string' || ! path.trim ()) throw new Error ('Invalid path');

   var resolved = Path.isAbsolute (path) ? Path.resolve (path) : Path.resolve (projectDir, path);
   var normalizedRoot = Path.resolve (projectDir) + Path.sep;
   if (resolved !== Path.resolve (projectDir) && (resolved + Path.sep).indexOf (normalizedRoot) !== 0 && resolved.indexOf (normalizedRoot) !== 0) {
      throw new Error ('Path escapes project directory');
   }

   return resolved;
};

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
   },
   {
      name: 'launch_agent',
      description: 'Spawn another top-level dialog. Equivalent to POST /dialog with provider, model, prompt, and optional slug.',
      input_schema: {
         type: 'object',
         properties: {
            provider: {
               type: 'string',
               description: 'claude or openai'
            },
            model: {
               type: 'string',
               description: 'Model name for the spawned agent'
            },
            prompt: {
               type: 'string',
               description: 'Initial prompt for the spawned agent'
            },
            slug: {
               type: 'string',
               description: 'Optional dialog slug'
            }
         },
         required: ['provider', 'model', 'prompt']
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
var executeTool = function (toolName, toolInput, projectName) {
   return new Promise (function (resolve) {
      var projectDir;
      try {
         projectDir = getExistingProjectDir (projectName);
      }
      catch (error) {
         return resolve ({success: false, error: error.message});
      }

      if (toolName === 'run_command') {
         exec (toolInput.command, {cwd: projectDir, timeout: 30000, maxBuffer: 1024 * 1024}, function (error, stdout, stderr) {
            if (error) resolve ({success: false, error: error.message, stderr: stderr});
            else       resolve ({success: true, stdout: stdout, stderr: stderr});
         });
      }

      else if (toolName === 'write_file') {
         var writePath;
         try {
            writePath = resolveProjectPath (projectDir, toolInput.path);
         }
         catch (error) {
            return resolve ({success: false, error: error.message});
         }

         fs.writeFile (writePath, toolInput.content, 'utf8', function (error) {
            if (error) resolve ({success: false, error: error.message});
            else       resolve ({success: true, message: 'File written: ' + toolInput.path});
         });
      }

      else if (toolName === 'edit_file') {
         var editPath;
         try {
            editPath = resolveProjectPath (projectDir, toolInput.path);
         }
         catch (error) {
            return resolve ({success: false, error: error.message});
         }

         fs.readFile (editPath, 'utf8', function (error, content) {
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
               fs.writeFile (editPath, updated, 'utf8', function (error) {
                  if (error) resolve ({success: false, error: error.message});
                  else       resolve ({success: true, message: 'Edit applied to ' + toolInput.path});
               });
            }
         });
      }

      else if (toolName === 'launch_agent') {
         if (toolInput.provider !== 'claude' && toolInput.provider !== 'openai') {
            return resolve ({success: false, error: 'launch_agent: provider must be claude or openai'});
         }
         if (type (toolInput.prompt) !== 'string' || ! toolInput.prompt.trim ()) {
            return resolve ({success: false, error: 'launch_agent: prompt is required'});
         }

         startDialogTurn (projectName, toolInput.provider, toolInput.prompt.trim (), toolInput.model, toolInput.slug, null)
            .then (function (result) {
               resolve ({
                  success: true,
                  launched: {
                     dialogId: result.dialogId,
                     filename: result.filename,
                     status: result.status,
                     provider: result.provider,
                     model: result.model
                  }
               });
            })
            .catch (function (error) {
               resolve ({success: false, error: 'launch_agent failed: ' + error.message});
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
   var lines = (markdown || '').split ('\n');
   dale.go (lines, function (line) {
      var allow = line.match (/^>\s*Authorized:\s*([a-zA-Z0-9_\-]+)/);
      if (allow) {
         authorized [allow [1]] = true;
         return;
      }
      var revoke = line.match (/^>\s*Revoked:\s*([a-zA-Z0-9_\-]+)/);
      if (revoke) delete authorized [revoke [1]];
   });
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
   var re = /## (User|Assistant)\n([\s\S]*?)(?=\n## (?:User|Assistant)\n|$)/g;
   var match;
   while ((match = re.exec (markdown)) !== null) {
      sections.push ({
         role: match [1].toLowerCase (),
         content: (match [2] || '').replace (/^\n+/, '').replace (/\s+$/, '')
      });
   }
   return sections;
};

var stripSectionMetadata = function (text) {
   var lines = (text || '').split ('\n');
   var kept = [];
   dale.go (lines, function (line) {
      if (/^>\s*Time:/.test (line)) return;
      if (/^>\s*Usage(?: cumulative)?:/.test (line)) return;
      kept.push (line);
   });
   return kept.join ('\n').trim ();
};

var parseUsageNumbers = function (usage) {
   if (! usage) return null;
   var input = usage.input_tokens;
   if (input === undefined) input = usage.prompt_tokens;
   if (input === undefined) input = usage.input;

   var output = usage.output_tokens;
   if (output === undefined) output = usage.completion_tokens;
   if (output === undefined) output = usage.output;

   if (input === undefined && output === undefined && usage.total_tokens === undefined && usage.total === undefined) return null;

   input = Number (input || 0);
   output = Number (output || 0);
   var total = usage.total_tokens !== undefined ? Number (usage.total_tokens) : (usage.total !== undefined ? Number (usage.total) : (input + output));

   return {input: input, output: output, total: total};
};

var getLastCumulativeUsage = function (filepath) {
   if (! fs.existsSync (filepath)) return {input: 0, output: 0, total: 0};
   var text = fs.readFileSync (filepath, 'utf8');
   var re = /^> Usage cumulative:\s*input=(\d+)\s+output=(\d+)\s+total=(\d+)\s*$/gm;
   var match, lastMatch = null;
   while ((match = re.exec (text)) !== null) lastMatch = match;
   if (! lastMatch) return {input: 0, output: 0, total: 0};
   return {
      input: Number (lastMatch [1] || 0),
      output: Number (lastMatch [2] || 0),
      total: Number (lastMatch [3] || 0)
   };
};

var appendUsageToAssistantSection = function (filepath, usage) {
   var normalized = parseUsageNumbers (usage);
   if (! normalized) return;

   var cumulative = getLastCumulativeUsage (filepath);
   cumulative.input += normalized.input;
   cumulative.output += normalized.output;
   cumulative.total += normalized.total;

   appendToDialog (filepath,
      '> Usage: input=' + normalized.input + ' output=' + normalized.output + ' total=' + normalized.total + '\n' +
      '> Usage cumulative: input=' + cumulative.input + ' output=' + cumulative.output + ' total=' + cumulative.total + '\n\n'
   );
};

var finalizeAssistantTime = function (filepath, startIso, endIso) {
   var marker = '> Time: ' + startIso + ' - ...';
   var replacement = '> Time: ' + startIso + ' - ' + endIso;
   var text = fs.readFileSync (filepath, 'utf8');
   var index = text.lastIndexOf (marker);
   if (index < 0) return;
   text = text.slice (0, index) + replacement + text.slice (index + marker.length);
   fs.writeFileSync (filepath, text, 'utf8');
};

var parseDialogForProvider = function (markdown, provider) {
   var messages = [];
   dale.go (parseSections (markdown), function (section) {
      if (section.role === 'user') {
         var userText = stripSectionMetadata (section.content);
         if (userText) messages.push ({role: 'user', content: userText});
         return;
      }

      var toolCalls = parseToolCalls (section.content, false);
      var assistantText = section.content.replace (/---\nTool request:\s+[^\n\[]+?(?:\s+\[[^\]]+\])?\n\n[\s\S]*?\n---/g, '');
      assistantText = stripSectionMetadata (assistantText);

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

var DIALOG_STATUSES = ['active', 'waiting', 'done'];

var pad2 = function (n) {return n < 10 ? '0' + n : '' + n;};

var formatDialogTimestamp = function () {
   var d = new Date ();
   return d.getUTCFullYear () + '' + pad2 (d.getUTCMonth () + 1) + pad2 (d.getUTCDate ()) + '-' + pad2 (d.getUTCHours ()) + pad2 (d.getUTCMinutes ()) + pad2 (d.getUTCSeconds ());
};

var slugify = function (text) {
   text = (text || 'dialog').toLowerCase ().replace (/[^a-z0-9\-]+/g, '-').replace (/\-+/g, '-').replace (/^\-+|\-+$/g, '');
   return text || 'dialog';
};

var buildDialogFilename = function (dialogId, status) {
   return 'dialog-' + dialogId + '-' + status + '.md';
};

var parseDialogFilename = function (filename) {
   var match = (filename || '').match (/^dialog\-(.+)\-(active|waiting|done)\.md$/);
   if (! match) return null;
   return {dialogId: match [1], status: match [2]};
};

var findDialogFilename = function (projectDir, dialogId) {
   var files = fs.readdirSync (projectDir);
   var prefix = 'dialog-' + dialogId + '-';
   var found = dale.stopNot (files, undefined, function (file) {
      var parsed = parseDialogFilename (file);
      if (parsed && parsed.dialogId === dialogId) return file;
   });
   return found || null;
};

var createDialogId = function (projectDir, slug) {
   var base = formatDialogTimestamp () + '-' + slugify (slug || 'dialog');
   var candidate = base;
   var counter = 2;
   while (findDialogFilename (projectDir, candidate)) {
      candidate = base + '-' + counter;
      counter++;
   }
   return candidate;
};

var loadDialog = function (projectDir, dialogId) {
   var filename = findDialogFilename (projectDir, dialogId);
   if (! filename) {
      return {
         dialogId: dialogId,
         filename: buildDialogFilename (dialogId, 'active'),
         filepath: Path.join (projectDir, buildDialogFilename (dialogId, 'active')),
         status: 'active',
         exists: false,
         markdown: '',
         metadata: {}
      };
   }

   var filepath = Path.join (projectDir, filename);
   var markdown = fs.readFileSync (filepath, 'utf8');
   var parsed = parseDialogFilename (filename) || {status: 'active'};

   return {
      dialogId: dialogId,
      filename: filename,
      filepath: filepath,
      status: parsed.status,
      exists: true,
      markdown: markdown,
      metadata: parseMetadata (markdown)
   };
};

var setDialogStatus = function (dialog, status) {
   if (! inc (DIALOG_STATUSES, status)) throw new Error ('Invalid status: ' + status);
   if (! dialog.exists) throw new Error ('Dialog not found: ' + dialog.dialogId);
   if (dialog.status === status) return dialog;

   var newFilename = buildDialogFilename (dialog.dialogId, status);
   var newPath = Path.join (Path.dirname (dialog.filepath), newFilename);
   fs.renameSync (dialog.filepath, newPath);
   dialog.filename = newFilename;
   dialog.filepath = newPath;
   dialog.status = status;
   return dialog;
};

var getGlobalAuthorizations = function (projectDir) {
   var docMain = Path.join (projectDir, 'doc-main.md');
   if (! fs.existsSync (docMain)) return [];

   var auth = parseAuthorizations (fs.readFileSync (docMain, 'utf8'));
   return Object.keys (auth);
};

var ensureDialogFile = function (dialog, provider, model, projectDir) {
   if (dialog.exists) {
      if (dialog.metadata.provider && dialog.metadata.model) {
         upsertDocMainContextBlock (dialog.filepath, projectDir);
         return;
      }
      var content = fs.readFileSync (dialog.filepath, 'utf8');
      var headerLine = '> Provider: ' + provider + ' | Model: ' + model + '\n';
      if (! /\n> Started:/.test (content)) headerLine += '> Started: ' + new Date ().toISOString () + '\n';
      headerLine += '\n';
      if (content.startsWith ('# Dialog\n\n')) content = '# Dialog\n\n' + headerLine + content.slice (10);
      else content = '# Dialog\n\n' + headerLine + content;
      fs.writeFileSync (dialog.filepath, content, 'utf8');
      upsertDocMainContextBlock (dialog.filepath, projectDir);
      dialog.markdown = fs.readFileSync (dialog.filepath, 'utf8');
      dialog.metadata = {provider: provider, model: model};
      return;
   }

   var header = '# Dialog\n\n';
   header += '> Provider: ' + provider + ' | Model: ' + model + '\n';
   header += '> Started: ' + new Date ().toISOString () + '\n\n';
   dale.go (getGlobalAuthorizations (projectDir), function (name) {
      header += '> Authorized: ' + name + '\n';
   });
   if (header [header.length - 1] !== '\n') header += '\n';
   header += '\n';
   fs.writeFileSync (dialog.filepath, header, 'utf8');
   upsertDocMainContextBlock (dialog.filepath, projectDir);
   dialog.exists = true;
   dialog.markdown = fs.readFileSync (dialog.filepath, 'utf8');
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

var parseSentinelLines = function (text) {
   if (type (text) !== 'string') return [];

   var normalized = text.replace (/\r/g, '');
   var lines = normalized.split ('\n');
   var start = -1, end = -1;

   dale.go (lines, function (line, index) {
      var trimmed = line.trim ();
      if (start === -1 && trimmed.indexOf ('əəə') === 0) {
         start = Number (index);
         return;
      }
      if (start !== -1 && end === -1 && trimmed === 'əəə') end = Number (index);
   });

   var bodyLines = lines;
   if (start !== -1 && end > start) bodyLines = lines.slice (start + 1, end);

   return dale.fil (bodyLines, undefined, function (line) {
      line = line.trim ();
      if (! line || line [0] === '#') return;
      return line;
   });
};

var parseDecisionsInput = function (decisions) {
   if (! decisions) return [];
   if (type (decisions) === 'array') return decisions;
   var parsed = [];
   dale.go (parseSentinelLines (decisions), function (line) {
      var match = line.match (/^([^:\s]+)\s*:\s*(approve|deny)$/i);
      if (! match) return;
      parsed.push ({id: match [1], approved: match [2].toLowerCase () === 'approve'});
   });
   return parsed;
};

var parseAuthorizationsInput = function (authorizations) {
   if (! authorizations) return {allow: [], deny: []};
   if (type (authorizations) === 'array') return {allow: authorizations, deny: []};

   var allow = {}, deny = {};
   dale.go (parseSentinelLines (authorizations), function (line) {
      var match = line.match (/^(allow|deny)\s+([a-zA-Z0-9_\-]+)$/i);
      if (! match) return;
      if (match [1].toLowerCase () === 'allow') allow [match [2]] = true;
      else deny [match [2]] = true;
   });
   return {allow: Object.keys (allow), deny: Object.keys (deny)};
};

var parseControlInput = function (control) {
   if (! control) return {decisions: [], authorizations: {allow: [], deny: []}};

   var decisions = [];
   var allow = {}, deny = {};

   dale.go (parseSentinelLines (control), function (line) {
      var toolDecision = line.match (/^([^:\s]+)\s+(approve|deny)$/i);
      if (toolDecision) {
         decisions.push ({id: toolDecision [1], approved: toolDecision [2].toLowerCase () === 'approve'});
         return;
      }

      var legacyDecision = line.match (/^([^:\s]+)\s*:\s*(approve|deny)$/i);
      if (legacyDecision) {
         decisions.push ({id: legacyDecision [1], approved: legacyDecision [2].toLowerCase () === 'approve'});
         return;
      }

      var authMatch = line.match (/^(allow|deny)\s+([a-zA-Z0-9_\-]+)$/i);
      if (! authMatch) return;
      if (authMatch [1].toLowerCase () === 'allow') allow [authMatch [2]] = true;
      else deny [authMatch [2]] = true;
   });

   return {
      decisions: decisions,
      authorizations: {allow: Object.keys (allow), deny: Object.keys (deny)}
   };
};

// Implementation function for Claude (streaming with tool support)
var chatWithClaude = async function (projectDir, messages, model, onChunk, abortSignal) {
   model = model || 'claude-sonnet-4-20250514';

   var systemPrompt = 'You are a helpful assistant with access to local system tools. When the user asks you to run commands, read files, write files, edit files, or spawn another agent, USE the provided tools to actually execute these operations. Do not just describe what you would do - actually call the tools to perform the requested actions.' + getDocMainInjection (projectDir);

   var requestBody = {
      model: model,
      max_tokens: 64000,
      stream: true,
      messages: messages,
      tools: CLAUDE_TOOLS,
      system: systemPrompt
   };

   var auth = await getApiKey ('claude');
   var headers = {'Content-Type': 'application/json'};

   if (auth.type === 'oauth') {
      headers ['Authorization'] = 'Bearer ' + auth.key;
      headers ['anthropic-beta'] = 'oauth-2025-04-20';
      headers ['anthropic-dangerous-direct-browser-access'] = 'true';
   }
   else {
      headers ['x-api-key'] = auth.key;
      headers ['anthropic-version'] = '2023-06-01';
   }

   var response = await fetch ('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify (requestBody),
      signal: abortSignal
   });

   if (! response.ok) {
      var error = await response.text ();
      throw new Error ('Claude API error: ' + response.status + ' - ' + error);
   }

   var fullContent = '';
   var toolCalls = [];
   var currentToolUse = null;
   var usage = null;
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

               if (parsed.usage) usage = parsed.usage;

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
      toolCalls: toolCalls.length > 0 ? toolCalls : null,
      usage: parseUsageNumbers (usage)
   };
};

var normalizeMessagesForResponsesApi = function (messages) {
   var normalized = [];

   dale.go (messages || [], function (message) {
      if (! message || type (message) !== 'object') return;

      if (message.role === 'tool') {
         var toolText = '[Tool result ' + (message.tool_call_id || 'unknown') + ']\n' + (message.content || '');
         normalized.push ({role: 'user', content: toolText});
         return;
      }

      var content = message.content;
      if (content === null || content === undefined) content = '';

      if (type (content) !== 'string') {
         try {content = JSON.stringify (content);} catch (error) {content = '' + content;}
      }

      if (message.tool_calls && message.tool_calls.length) {
         content += (content ? '\n\n' : '') + '[Assistant tool calls]\n' + dale.go (message.tool_calls, function (tc) {
            return '- ' + ((tc.function && tc.function.name) || tc.name || 'unknown') + ' id=' + (tc.id || 'unknown') + ' args=' + ((tc.function && tc.function.arguments) || tc.arguments || '{}');
         }).join ('\n');
      }

      normalized.push ({role: message.role || 'user', content: content});
   });

   return normalized;
};

// Implementation function for OpenAI (streaming with tool support)
var chatWithOpenAI = async function (projectDir, messages, model, onChunk, abortSignal) {
   model = model || 'gpt-5';

   var systemPrompt = 'You are a helpful assistant with access to local system tools. When the user asks you to run commands, read files, write files, edit files, or spawn another agent, USE the provided tools to actually execute these operations. Do not just describe what you would do - actually call the tools to perform the requested actions.' + getDocMainInjection (projectDir);

   var requestBody = {
      model: model,
      stream: true,
      stream_options: {include_usage: true},
      messages: [{
         role: 'system',
         content: systemPrompt
      }].concat (messages),
      tools: OPENAI_TOOLS
   };

   var auth = await getApiKey ('openai');
   var apiUrl = 'https://api.openai.com/v1/chat/completions';
   var headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + auth.key
   };
   var usingResponsesApi = false;

   if (auth.type === 'oauth' && auth.accountId) {
      usingResponsesApi = true;
      apiUrl = 'https://chatgpt.com/backend-api/codex/responses';
      headers ['chatgpt-account-id'] = auth.accountId;
      headers ['OpenAI-Beta'] = 'responses=experimental';
      headers ['originator'] = 'vibey';
      // Responses API uses `input` + `instructions`, not `messages`
      requestBody.instructions = systemPrompt;
      requestBody.input = normalizeMessagesForResponsesApi (messages);
      requestBody.store = false;
      // Responses API tool format: {type, name, description, parameters} (flat, not nested under `function`)
      requestBody.tools = dale.go (TOOLS, function (tool) {
         return {type: 'function', name: tool.name, description: tool.description, parameters: tool.input_schema};
      });
      delete requestBody.messages;
      delete requestBody.stream_options;
   }

   var response = await fetch (apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify (requestBody),
      signal: abortSignal
   });

   if (! response.ok) {
      var error = await response.text ();
      throw new Error ('OpenAI API error: ' + response.status + ' - ' + error);
   }

   var fullContent = '';
   var toolCalls = [];
   var toolCallsInProgress = {}; // Chat Completions stream: {index: {id, name, arguments}}
   var responseToolCalls = {};   // Responses stream: {item_id: {id, name, arguments}}
   var usage = null;
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
         if (! line.startsWith ('data: ')) return;

         var data = line.slice (6);
         if (data === '[DONE]') return;

         try {
            var parsed = JSON.parse (data);
            if (parsed.usage) usage = parsed.usage;

            if (usingResponsesApi) {
               // Text deltas
               if (parsed.type === 'response.output_text.delta' && type (parsed.delta) === 'string') {
                  fullContent += parsed.delta;
                  if (onChunk) onChunk (parsed.delta);
               }

               // Tool call scaffold
               if (parsed.type === 'response.output_item.added' && parsed.item && parsed.item.type === 'function_call') {
                  responseToolCalls [parsed.item.id] = {
                     id: parsed.item.call_id || parsed.item.id,
                     name: parsed.item.name || '',
                     arguments: parsed.item.arguments || ''
                  };
               }

               // Tool args deltas
               if (parsed.type === 'response.function_call_arguments.delta') {
                  if (! responseToolCalls [parsed.item_id]) {
                     responseToolCalls [parsed.item_id] = {id: parsed.item_id, name: '', arguments: ''};
                  }
                  responseToolCalls [parsed.item_id].arguments += parsed.delta || '';
               }

               if (parsed.type === 'response.function_call_arguments.done') {
                  if (! responseToolCalls [parsed.item_id]) {
                     responseToolCalls [parsed.item_id] = {id: parsed.item_id, name: '', arguments: ''};
                  }
                  if (type (parsed.arguments) === 'string') responseToolCalls [parsed.item_id].arguments = parsed.arguments;
               }

               // Final tool item data (name/call_id/arguments)
               if (parsed.type === 'response.output_item.done' && parsed.item && parsed.item.type === 'function_call') {
                  if (! responseToolCalls [parsed.item.id]) responseToolCalls [parsed.item.id] = {id: parsed.item.id, name: '', arguments: ''};
                  if (parsed.item.call_id) responseToolCalls [parsed.item.id].id = parsed.item.call_id;
                  if (parsed.item.name) responseToolCalls [parsed.item.id].name = parsed.item.name;
                  if (type (parsed.item.arguments) === 'string') responseToolCalls [parsed.item.id].arguments = parsed.item.arguments;
               }

               // Usage is delivered on completion for responses streams
               if (parsed.type === 'response.completed' && parsed.response && parsed.response.usage) usage = parsed.response.usage;

               return;
            }

            // Chat Completions stream format
            var delta = parsed.choices && parsed.choices [0] && parsed.choices [0].delta;
            if (! delta) return;

            if (delta.content) {
               fullContent += delta.content;
               if (onChunk) onChunk (delta.content);
            }

            if (delta.tool_calls) {
               dale.go (delta.tool_calls, function (tc) {
                  var idx = tc.index;
                  if (! toolCallsInProgress [idx]) toolCallsInProgress [idx] = {id: tc.id, name: '', arguments: ''};
                  if (tc.id) toolCallsInProgress [idx].id = tc.id;
                  if (tc.function && tc.function.name) toolCallsInProgress [idx].name += tc.function.name;
                  if (tc.function && tc.function.arguments) toolCallsInProgress [idx].arguments += tc.function.arguments;
               });
            }
         }
         catch (e) {}
      });
   }

   // Convert in-progress tool calls to final format (chat completions)
   dale.go (toolCallsInProgress, function (tc) {
      try {
         toolCalls.push ({id: tc.id, name: tc.name, input: JSON.parse (tc.arguments)});
      }
      catch (e) {
         toolCalls.push ({id: tc.id, name: tc.name, input: {}});
      }
   });

   // Convert in-progress tool calls to final format (responses API)
   dale.go (responseToolCalls, function (tc) {
      try {
         toolCalls.push ({id: tc.id, name: tc.name, input: JSON.parse (tc.arguments || '{}')});
      }
      catch (e) {
         toolCalls.push ({id: tc.id, name: tc.name, input: {}});
      }
   });

   return {
      provider: 'openai',
      model: model,
      content: fullContent,
      toolCalls: toolCalls.length > 0 ? toolCalls : null,
      usage: parseUsageNumbers (usage)
   };
};

var appendToolCallsToAssistantSection = function (filepath, toolCalls) {
   if (! toolCalls || ! toolCalls.length) return;
   dale.go (toolCalls, function (tc) {
      appendToDialog (filepath, buildToolBlock (tc) + '\n\n');
   });
};

var runCompletion = async function (projectName, dialog, provider, model, onChunk, abortSignal) {
   var projectDir = getExistingProjectDir (projectName);
   var autoExecutedAll = [];
   var lastContent = '';

   for (var round = 0; round < 8; round++) {
      upsertDocMainContextBlock (dialog.filepath, projectDir);
      var markdown = fs.readFileSync (dialog.filepath, 'utf8');
      var messages = parseDialogForProvider (markdown, provider);

      var assistantStart = new Date ().toISOString ();
      appendToDialog (dialog.filepath, '## Assistant\n> Time: ' + assistantStart + ' - ...\n\n');

      var writeChunk = function (chunk) {
         appendToDialog (dialog.filepath, chunk);
         if (onChunk) onChunk (chunk);
      };

      try {
         var result = provider === 'claude'
            ? await chatWithClaude (projectDir, messages, model, writeChunk, abortSignal)
            : await chatWithOpenAI (projectDir, messages, model, writeChunk, abortSignal);

         lastContent = result.content || '';

         appendToDialog (dialog.filepath, '\n\n');
         appendUsageToAssistantSection (dialog.filepath, result.usage);
         appendToolCallsToAssistantSection (dialog.filepath, result.toolCalls);

         var authorizations = parseAuthorizations (fs.readFileSync (dialog.filepath, 'utf8'));
         var decisionsById = {};
         var autoExecuted = [];
         var pending = [];

         for (var i = 0; i < (result.toolCalls || []).length; i++) {
            var tc = result.toolCalls [i];
            if (authorizations [tc.name]) {
               var toolResult = await executeTool (tc.name, tc.input, projectName);
               decisionsById [tc.id] = {decision: 'approved', result: toolResult};
               autoExecuted.push ({id: tc.id, name: tc.name, result: toolResult});
            }
            else pending.push (tc);
         }

         if (Object.keys (decisionsById).length) writeToolDecisions (dialog.filepath, decisionsById);
         if (autoExecuted.length) autoExecutedAll = autoExecutedAll.concat (autoExecuted);

         if (pending.length) {
            return {
               dialogId: dialog.dialogId,
               filename: dialog.filename,
               provider: provider,
               model: model,
               content: lastContent,
               toolCalls: pending,
               autoExecuted: autoExecutedAll
            };
         }

         if (! autoExecuted.length) {
            return {
               dialogId: dialog.dialogId,
               filename: dialog.filename,
               provider: provider,
               model: model,
               content: lastContent,
               toolCalls: null,
               autoExecuted: autoExecutedAll
            };
         }
      }
      finally {
         try {
            finalizeAssistantTime (dialog.filepath, assistantStart, new Date ().toISOString ());
         }
         catch (error) {}
      }
   }

   throw new Error ('Exceeded maximum auto-tool continuation rounds');
};

var createWaitingDialog = function (projectName, provider, model, slug) {
   if (provider !== 'claude' && provider !== 'openai') {
      throw new Error ('Unknown provider: ' + provider + '. Use "claude" or "openai".');
   }

   var projectDir = getExistingProjectDir (projectName);
   var defaultModel = model || (provider === 'claude' ? 'claude-sonnet-4-20250514' : 'gpt-5');
   var dialogId = createDialogId (projectDir, slug || 'dialog');
   var filename = buildDialogFilename (dialogId, 'waiting');
   var dialog = {
      dialogId: dialogId,
      filename: filename,
      filepath: Path.join (projectDir, filename),
      status: 'waiting',
      exists: false,
      markdown: '',
      metadata: {}
   };

   ensureDialogFile (dialog, provider, defaultModel, projectDir);

   return {
      dialogId: dialog.dialogId,
      filename: dialog.filename,
      status: dialog.status,
      provider: provider,
      model: defaultModel
   };
};

var startDialogTurn = async function (projectName, provider, prompt, model, slug, onChunk, abortSignal) {
   if (provider !== 'claude' && provider !== 'openai') {
      throw new Error ('Unknown provider: ' + provider + '. Use "claude" or "openai".');
   }

   var projectDir = getExistingProjectDir (projectName);
   var defaultModel = model || (provider === 'claude' ? 'claude-sonnet-4-20250514' : 'gpt-5');
   var dialogId = createDialogId (projectDir, slug);
   var dialog = {
      dialogId: dialogId,
      filename: buildDialogFilename (dialogId, 'active'),
      filepath: Path.join (projectDir, buildDialogFilename (dialogId, 'active')),
      status: 'active',
      exists: false,
      markdown: '',
      metadata: {}
   };

   ensureDialogFile (dialog, provider, defaultModel, projectDir);
   appendToDialog (dialog.filepath, '## User\n> Time: ' + new Date ().toISOString () + '\n\n' + prompt + '\n\n');

   var result = await runCompletion (projectName, dialog, provider, defaultModel, onChunk, abortSignal);
   if (result.toolCalls && result.toolCalls.length) setDialogStatus (dialog, 'waiting');
   result.filename = dialog.filename;
   result.status = dialog.status;
   return result;
};

var updateDialogTurn = async function (projectName, dialogId, status, prompt, controlInput, decisionsInput, authorizationsInput, provider, model, onChunk, abortSignal) {
   var dialog = loadDialog (getExistingProjectDir (projectName), dialogId);
   if (! dialog.exists) throw new Error ('Dialog not found: ' + dialogId);

   var control = parseControlInput (controlInput || '');

   var legacyAuthorizations = parseAuthorizationsInput (authorizationsInput || '');
   var authMap = {};
   dale.go (legacyAuthorizations.allow, function (name) {authMap [name] = 'allow';});
   dale.go (legacyAuthorizations.deny, function (name) {authMap [name] = 'deny';});
   dale.go (control.authorizations.allow, function (name) {authMap [name] = 'allow';});
   dale.go (control.authorizations.deny, function (name) {authMap [name] = 'deny';});

   var authorizations = {allow: [], deny: []};
   dale.go (authMap, function (action, name) {
      if (action === 'allow') authorizations.allow.push (name);
      if (action === 'deny') authorizations.deny.push (name);
   });

   if (authorizations.allow.length || authorizations.deny.length) {
      dale.go (authorizations.allow, function (name) {
         appendToDialog (dialog.filepath, '> Authorized: ' + name + '\n');
      });
      dale.go (authorizations.deny, function (name) {
         appendToDialog (dialog.filepath, '> Revoked: ' + name + '\n');
      });
      appendToDialog (dialog.filepath, '\n');
   }

   var decisionsMap = {};
   dale.go (parseDecisionsInput (decisionsInput || []), function (decision) {
      if (! decision || ! decision.id) return;
      decisionsMap [decision.id] = {id: decision.id, approved: decision.approved === true};
   });
   dale.go (control.decisions, function (decision) {
      if (! decision || ! decision.id) return;
      decisionsMap [decision.id] = {id: decision.id, approved: decision.approved === true};
   });
   var decisions = dale.go (decisionsMap, function (decision) {return decision;});

   var deniedAny = false;

   if (decisions.length) {
      var pending = getPendingToolCalls (dialog.filepath);
      var pendingById = {};
      dale.go (pending, function (tc) {
         pendingById [tc.id] = tc;
      });

      var decisionsById = {};
      dale.go (decisions, function (decision) {
         var tc = pendingById [decision.id];
         if (! tc) return;
         if (decision.approved) decisionsById [tc.id] = {decision: 'approved', result: null};
         else {
            deniedAny = true;
            decisionsById [tc.id] = {decision: 'denied', result: {success: false, error: 'User denied this tool call'}};
         }
      });

      for (var i = 0; i < pending.length; i++) {
         var tc = pending [i];
         if (! decisionsById [tc.id]) continue;
         if (decisionsById [tc.id].decision !== 'approved') continue;
         decisionsById [tc.id].result = await executeTool (tc.name, tc.input, projectName);
      }

      if (Object.keys (decisionsById).length) writeToolDecisions (dialog.filepath, decisionsById);
   }

   var shouldContinue = (type (prompt) === 'string' && prompt.trim ()) || decisions.length > 0;

   if (shouldContinue) {
      setDialogStatus (dialog, 'active');
      if (type (prompt) === 'string' && prompt.trim ()) {
         appendToDialog (dialog.filepath, '## User\n> Time: ' + new Date ().toISOString () + '\n\n' + prompt.trim () + '\n\n');
      }

      var meta = parseMetadata (fs.readFileSync (dialog.filepath, 'utf8'));
      var resolvedProvider = provider || meta.provider;
      if (resolvedProvider !== 'claude' && resolvedProvider !== 'openai') {
         throw new Error ('Unable to determine provider for dialog update');
      }
      var resolvedModel = model || meta.model || (resolvedProvider === 'claude' ? 'claude-sonnet-4-20250514' : 'gpt-5');
      var result = await runCompletion (projectName, dialog, resolvedProvider, resolvedModel, onChunk, abortSignal);

      if (result.toolCalls && result.toolCalls.length) setDialogStatus (dialog, 'waiting');
      else if (deniedAny) setDialogStatus (dialog, 'waiting');
      else if (status && inc (['waiting', 'done'], status)) setDialogStatus (dialog, status);

      result.filename = dialog.filename;
      result.status = dialog.status;
      return result;
   }

   if (deniedAny) setDialogStatus (dialog, 'waiting');
   else if (status && inc (['waiting', 'done'], status)) setDialogStatus (dialog, status);

   return {
      dialogId: dialog.dialogId,
      filename: dialog.filename,
      status: dialog.status,
      updated: true
   };
};

// Validate filename: only alphanumeric, dash, underscore, dot; must end in .md
var validFilename = function (name) {
   if (! name || typeof name !== 'string') return false;
   if (! name.endsWith ('.md')) return false;
   if (name.includes ('..')) return false;
   if (name.includes ('/') || name.includes ('\\')) return false;
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
   ['get', 'vibey-test-client.js', cicek.file],

   // *** ACCOUNTS ***

   ['get', 'accounts', function (rq, rs) {
      var config = loadConfigJson ();
      var accounts = config.accounts || {};
      reply (rs, 200, {
         openai: {
            apiKey: maskApiKey ((accounts.openai && accounts.openai.apiKey) || ''),
            hasKey: !! (accounts.openai && accounts.openai.apiKey)
         },
         claude: {
            apiKey: maskApiKey ((accounts.claude && accounts.claude.apiKey) || ''),
            hasKey: !! (accounts.claude && accounts.claude.apiKey)
         },
         openaiOAuth: {
            loggedIn: !! (accounts.openaiOAuth && accounts.openaiOAuth.type === 'oauth'),
            expired: accounts.openaiOAuth ? Date.now () >= (accounts.openaiOAuth.expires || 0) : false
         },
         claudeOAuth: {
            loggedIn: !! (accounts.claudeOAuth && accounts.claudeOAuth.type === 'oauth'),
            expired: accounts.claudeOAuth ? Date.now () >= (accounts.claudeOAuth.expires || 0) : false
         }
      });
   }],

   ['post', 'accounts', function (rq, rs) {
      var config = loadConfigJson ();
      if (! config.accounts) config.accounts = {};

      if (type (rq.body.openaiKey) === 'string') {
         if (! config.accounts.openai) config.accounts.openai = {};
         config.accounts.openai.apiKey = rq.body.openaiKey.trim ();
      }
      if (type (rq.body.claudeKey) === 'string') {
         if (! config.accounts.claude) config.accounts.claude = {};
         config.accounts.claude.apiKey = rq.body.claudeKey.trim ();
      }

      saveConfigJson (config);
      reply (rs, 200, {ok: true});
   }],

   // OAuth login: start flow
   ['post', 'accounts/login/:provider', async function (rq, rs) {
      var provider = rq.data.params.provider;
      try {
         if (provider === 'claude') {
            var url = await startAnthropicLogin ();
            reply (rs, 200, {url: url, flow: 'paste_code'});
         }
         else if (provider === 'openai') {
            var url = await startOpenAILogin ();
            reply (rs, 200, {url: url, flow: 'callback'});
         }
         else {
            reply (rs, 400, {error: 'Unknown provider: ' + provider});
         }
      }
      catch (error) {
         reply (rs, 500, {error: error.message});
      }
   }],

   // OAuth login: complete flow (paste code or wait for callback)
   ['post', 'accounts/login/:provider/callback', async function (rq, rs) {
      var provider = rq.data.params.provider;
      try {
         if (provider === 'claude') {
            if (type (rq.body.code) !== 'string' || ! rq.body.code.trim ()) return reply (rs, 400, {error: 'code is required'});
            var result = await completeAnthropicLogin (rq.body.code.trim ());
            reply (rs, 200, result);
         }
         else if (provider === 'openai') {
            // manualCode is optional; if not provided, waits for browser callback
            var result = await completeOpenAILogin (rq.body.code || null);
            reply (rs, 200, result);
         }
         else {
            reply (rs, 400, {error: 'Unknown provider: ' + provider});
         }
      }
      catch (error) {
         reply (rs, 500, {error: error.message});
      }
   }],

   // OAuth logout
   ['post', 'accounts/logout/:provider', function (rq, rs) {
      var provider = rq.data.params.provider;
      var config = loadConfigJson ();
      if (! config.accounts) config.accounts = {};

      if (provider === 'claude') {
         delete config.accounts.claudeOAuth;
      }
      else if (provider === 'openai') {
         delete config.accounts.openaiOAuth;
      }
      else {
         return reply (rs, 400, {error: 'Unknown provider: ' + provider});
      }

      saveConfigJson (config);
      reply (rs, 200, {ok: true});
   }],

   // *** PROJECTS ***

   ['get', 'projects', function (rq, rs) {
      try {
         reply (rs, 200, listProjects ());
      }
      catch (error) {
         reply (rs, 500, {error: error.message});
      }
   }],

   ['post', 'projects', function (rq, rs) {
      if (stop (rs, [['name', rq.body.name, 'string']])) return;
      try {
         ensureProjectDir (rq.body.name);
         reply (rs, 200, {ok: true, name: rq.body.name});
      }
      catch (error) {
         reply (rs, 400, {error: error.message});
      }
   }],

   ['delete', 'projects/:name', function (rq, rs) {
      var projectName = rq.data.params.name;
      var projectDir;

      try {
         projectDir = getProjectDir (projectName);
      }
      catch (error) {
         return reply (rs, 400, {error: error.message});
      }

      if (! fs.existsSync (projectDir)) return reply (rs, 404, {error: 'Project not found'});

      try {
         dale.go (fs.readdirSync (projectDir), function (file) {
            var parsed = parseDialogFilename (file);
            if (! parsed) return;
            var active = getActiveStream (parsed.dialogId);
            if (! active) return;
            active.requestedStatus = 'done';
            active.controller.abort ();
            endActiveStream (parsed.dialogId);
         });
      }
      catch (error) {}

      fs.rm (projectDir, {recursive: true, force: false}, function (error) {
         if (error) {
            if (error.code === 'ENOENT') return reply (rs, 404, {error: 'Project not found'});
            return reply (rs, 500, {error: 'Failed to delete project'});
         }
         reply (rs, 200, {ok: true, name: projectName});
      });
   }],

   ['post', 'project/:project/snapshot', function (rq, rs) {
      if (stop (rs, [['type', rq.body.type, 'string', {oneOf: ['zip', 'project']}]])) return;

      var projectName = rq.data.params.project;
      try {
         var projectDir = getExistingProjectDir (projectName);
         var stamp = formatDialogTimestamp ();

         if (rq.body.type === 'project') {
            var snapshotName = (rq.body.name && rq.body.name.trim ()) || ('snapshot-' + projectName + '-' + stamp);
            var snapshotDir = ensureProjectDir (snapshotName);
            fs.cpSync (projectDir, snapshotDir, {recursive: true});
            return reply (rs, 200, {ok: true, type: 'project', name: snapshotName});
         }

         var zipName = (rq.body.name && rq.body.name.trim ()) || (projectName + '-snapshot-' + stamp + '.zip');
         if (! /\.zip$/i.test (zipName)) zipName += '.zip';
         var zipPath = Path.join (projectDir, zipName);
         exec ('zip -r ' + JSON.stringify (zipPath) + ' .', {cwd: projectDir}, function (error, stdout, stderr) {
            if (error) return reply (rs, 500, {error: 'zip failed: ' + error.message, stderr: stderr});
            reply (rs, 200, {ok: true, type: 'zip', file: zipName});
         });
      }
      catch (error) {
         reply (rs, 400, {error: error.message});
      }
   }],

   // *** FILES ***

   ['get', 'project/:project/files', function (rq, rs) {
      var projectDir;
      try {projectDir = getExistingProjectDir (rq.data.params.project);} catch (error) {return reply (rs, error.message === 'Project not found' ? 404 : 400, {error: error.message});}

      fs.readdir (projectDir, function (error, files) {
         if (error) return reply (rs, 500, {error: 'Failed to read directory'});
         var mdFiles = dale.fil (files, undefined, function (file) {
            if (file.endsWith ('.md')) return file;
         });
         // Sort by modification time, most recent first
         var withStats = dale.go (mdFiles, function (file) {
            try {
               var stat = fs.statSync (Path.join (projectDir, file));
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

   ['get', 'project/:project/file/:name', function (rq, rs) {
      var name = rq.data.params.name;
      if (! validFilename (name)) return reply (rs, 400, {error: 'Invalid filename'});

      var projectDir;
      try {projectDir = getExistingProjectDir (rq.data.params.project);} catch (error) {return reply (rs, error.message === 'Project not found' ? 404 : 400, {error: error.message});}

      var filepath = Path.join (projectDir, name);
      fs.readFile (filepath, 'utf8', function (error, content) {
         if (error) {
            if (error.code === 'ENOENT') return reply (rs, 404, {error: 'File not found'});
            return reply (rs, 500, {error: 'Failed to read file'});
         }
         reply (rs, 200, {name: name, content: content});
      });
   }],

   ['post', 'project/:project/file/:name', function (rq, rs) {
      var name = rq.data.params.name;
      if (! validFilename (name)) return reply (rs, 400, {error: 'Invalid filename'});

      if (stop (rs, [
         ['content', rq.body.content, 'string'],
      ])) return;

      var projectDir;
      try {projectDir = getExistingProjectDir (rq.data.params.project);} catch (error) {return reply (rs, error.message === 'Project not found' ? 404 : 400, {error: error.message});}

      var filepath = Path.join (projectDir, name);
      fs.writeFile (filepath, rq.body.content, 'utf8', function (error) {
         if (error) return reply (rs, 500, {error: 'Failed to write file'});
         reply (rs, 200, {ok: true, name: name});
      });
   }],

   ['delete', 'project/:project/file/:name', function (rq, rs) {
      var name = rq.data.params.name;
      if (! validFilename (name)) return reply (rs, 400, {error: 'Invalid filename'});

      var projectDir;
      try {projectDir = getExistingProjectDir (rq.data.params.project);} catch (error) {return reply (rs, error.message === 'Project not found' ? 404 : 400, {error: error.message});}

      var filepath = Path.join (projectDir, name);
      fs.unlink (filepath, function (error) {
         if (error) {
            if (error.code === 'ENOENT') return reply (rs, 404, {error: 'File not found'});
            return reply (rs, 500, {error: 'Failed to delete file'});
         }
         reply (rs, 200, {ok: true});
      });
   }],

   // *** LLM ***

   // Create a waiting dialog draft
   ['post', 'project/:project/dialog/new', function (rq, rs) {
      if (stop (rs, [
         ['provider', rq.body.provider, 'string', {oneOf: ['claude', 'openai']}],
      ])) return;

      if (rq.body.model !== undefined && type (rq.body.model) !== 'string') return reply (rs, 400, {error: 'model must be a string'});
      if (rq.body.slug !== undefined && type (rq.body.slug) !== 'string') return reply (rs, 400, {error: 'slug must be a string'});

      try {
         var created = createWaitingDialog (rq.data.params.project, rq.body.provider, rq.body.model, rq.body.slug || 'dialog');
         reply (rs, 200, created);
      }
      catch (error) {
         reply (rs, 400, {error: error.message});
      }
   }],

   // Create dialog + first turn (SSE)
   ['post', 'project/:project/dialog', async function (rq, rs) {
      if (stop (rs, [
         ['provider', rq.body.provider, 'string', {oneOf: ['claude', 'openai']}],
         ['prompt', rq.body.prompt, 'string'],
      ])) return;

      if (rq.body.model !== undefined && type (rq.body.model) !== 'string') return reply (rs, 400, {error: 'model must be a string'});
      if (rq.body.slug !== undefined && type (rq.body.slug) !== 'string') return reply (rs, 400, {error: 'slug must be a string'});

      rs.writeHead (200, {
         'Content-Type': 'text/event-stream',
         'Cache-Control': 'no-cache',
         'Connection': 'keep-alive'
      });

      try {
         var result = await startDialogTurn (
            rq.data.params.project,
            rq.body.provider,
            rq.body.prompt,
            rq.body.model,
            rq.body.slug,
            function (chunk) {
               rs.write ('data: ' + JSON.stringify ({type: 'chunk', content: chunk}) + '\n\n');
            }
         );

         if (result.toolCalls) {
            rs.write ('data: ' + JSON.stringify ({type: 'tool_request', toolCalls: result.toolCalls, dialogId: result.dialogId, filename: result.filename}) + '\n\n');
         }

         rs.write ('data: ' + JSON.stringify ({type: 'done', result: result}) + '\n\n');
         rs.end ();
      }
      catch (error) {
         clog ('Chat error:', error.message);
         rs.write ('data: ' + JSON.stringify ({type: 'error', error: error.message}) + '\n\n');
         rs.end ();
      }
   }],

   // Update dialog (optional SSE when continuing)
   ['put', 'project/:project/dialog', async function (rq, rs) {
      if (stop (rs, [
         ['dialogId', rq.body.dialogId, 'string'],
      ])) return;

      if (rq.body.status !== undefined && ! inc (['waiting', 'done'], rq.body.status)) return reply (rs, 400, {error: 'status must be waiting or done'});
      if (rq.body.prompt !== undefined && type (rq.body.prompt) !== 'string') return reply (rs, 400, {error: 'prompt must be a string'});
      if (rq.body.control !== undefined && type (rq.body.control) !== 'string') return reply (rs, 400, {error: 'control must be a string'});
      if (rq.body.decisions !== undefined && type (rq.body.decisions) !== 'string' && type (rq.body.decisions) !== 'array') return reply (rs, 400, {error: 'decisions must be string or array'});
      if (rq.body.authorizations !== undefined && type (rq.body.authorizations) !== 'string' && type (rq.body.authorizations) !== 'array') return reply (rs, 400, {error: 'authorizations must be string or array'});
      if (rq.body.provider !== undefined && (type (rq.body.provider) !== 'string' || ! inc (['claude', 'openai'], rq.body.provider))) return reply (rs, 400, {error: 'provider must be claude or openai'});
      if (rq.body.model !== undefined && type (rq.body.model) !== 'string') return reply (rs, 400, {error: 'model must be a string'});

      var controlParsed = parseControlInput (rq.body.control || '');
      var hasControlDecisions = controlParsed.decisions.length > 0;
      var continues = (type (rq.body.prompt) === 'string' && rq.body.prompt.trim ()) || rq.body.decisions !== undefined || hasControlDecisions;

      if (! continues) {
         var active = getActiveStream (rq.body.dialogId);
         if (active && rq.body.status && inc (['waiting', 'done'], rq.body.status)) {
            active.requestedStatus = rq.body.status;
            active.controller.abort ();
            return reply (rs, 200, {ok: true, dialogId: rq.body.dialogId, interrupted: true, status: rq.body.status});
         }

         try {
            var result = await updateDialogTurn (rq.data.params.project, rq.body.dialogId, rq.body.status, null, rq.body.control, rq.body.decisions, rq.body.authorizations, rq.body.provider, rq.body.model, null);
            return reply (rs, 200, result);
         }
         catch (error) {
            return reply (rs, 400, {error: error.message});
         }
      }

      rs.writeHead (200, {
         'Content-Type': 'text/event-stream',
         'Cache-Control': 'no-cache',
         'Connection': 'keep-alive'
      });

      var controller = beginActiveStream (rq.body.dialogId);

      try {
         var result = await updateDialogTurn (
            rq.data.params.project,
            rq.body.dialogId,
            rq.body.status,
            rq.body.prompt,
            rq.body.control,
            rq.body.decisions,
            rq.body.authorizations,
            rq.body.provider,
            rq.body.model,
            function (chunk) {
               rs.write ('data: ' + JSON.stringify ({type: 'chunk', content: chunk}) + '\n\n');
            },
            controller.signal
         );

         if (result.toolCalls) {
            rs.write ('data: ' + JSON.stringify ({type: 'tool_request', toolCalls: result.toolCalls, dialogId: result.dialogId, filename: result.filename}) + '\n\n');
         }

         rs.write ('data: ' + JSON.stringify ({type: 'done', result: result}) + '\n\n');
         rs.end ();
      }
      catch (error) {
         if (error && error.name === 'AbortError') {
            try {
               var activeAfterAbort = getActiveStream (rq.body.dialogId);
               var requestedStatus = activeAfterAbort && activeAfterAbort.requestedStatus ? activeAfterAbort.requestedStatus : 'waiting';
               var dialogAfterAbort = loadDialog (getExistingProjectDir (rq.data.params.project), rq.body.dialogId);
               if (dialogAfterAbort.exists) setDialogStatus (dialogAfterAbort, requestedStatus);
               rs.write ('data: ' + JSON.stringify ({type: 'done', result: {dialogId: rq.body.dialogId, filename: dialogAfterAbort.filename, status: requestedStatus, interrupted: true}}) + '\n\n');
               rs.end ();
            }
            catch (interruptError) {
               rs.write ('data: ' + JSON.stringify ({type: 'error', error: interruptError.message}) + '\n\n');
               rs.end ();
            }
         }
         else {
            clog ('Dialog update error:', error.message);
            rs.write ('data: ' + JSON.stringify ({type: 'error', error: error.message}) + '\n\n');
            rs.end ();
         }
      }
      finally {
         endActiveStream (rq.body.dialogId);
      }
   }],

   // Execute a tool (called after user approves)
   ['post', 'project/:project/tool/execute', async function (rq, rs) {
      if (stop (rs, [
         ['toolName', rq.body.toolName, 'string'],
         ['toolInput', rq.body.toolInput, 'object'],
      ])) return;

      try {
         var result = await executeTool (rq.body.toolName, rq.body.toolInput, rq.data.params.project);
         reply (rs, 200, result);
      }
      catch (error) {
         clog ('Tool execution error:', error.message);
         reply (rs, 500, {success: false, error: error.message});
      }
   }],

   // Get dialog by ID
   ['get', 'project/:project/dialog/:id', function (rq, rs) {
      var dialogId = rq.data.params.id;
      var projectDir;
      try {projectDir = getExistingProjectDir (rq.data.params.project);} catch (error) {return reply (rs, error.message === 'Project not found' ? 404 : 400, {error: error.message});}
      var dialog = loadDialog (projectDir, dialogId);

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
   ['get', 'project/:project/dialogs', function (rq, rs) {
      var projectDir;
      try {projectDir = getExistingProjectDir (rq.data.params.project);} catch (error) {return reply (rs, error.message === 'Project not found' ? 404 : 400, {error: error.message});}

      fs.readdir (projectDir, function (error, files) {
         if (error) return reply (rs, 500, {error: 'Failed to read directory'});
         var dialogFiles = dale.fil (files, undefined, function (file) {
            if (file.startsWith ('dialog-') && file.endsWith ('.md')) return file;
         });
         // Sort by modification time, most recent first
         var withStats = dale.go (dialogFiles, function (file) {
            try {
               var stat = fs.statSync (Path.join (projectDir, file));
               var parsed = parseDialogFilename (file);
               if (! parsed) return null;
               return {dialogId: parsed.dialogId, status: parsed.status, filename: file, mtime: stat.mtime.getTime ()};
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
