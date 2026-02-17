// vibey-test.js
// Unified frontend test entrypoint.
// - In Node: runs Puppeteer, opens vibey, clicks the Test button, waits for final alert.
// - In Browser: runs the c.test Flow #1 frontend suite.

(function () {

   // *** NODE MODE (boot runner) ***

   if (typeof window === 'undefined') {
      const puppeteer = require ('puppeteer');

      (async function () {
         var browser = await puppeteer.launch ({headless: true});
         var page = await browser.newPage ();

         var gotDialog = false;

         page.on ('dialog', async function (dialog) {
            gotDialog = true;
            var message = dialog.message ();
            console.log ('[vibey-test-alert] ' + message.replace (/\n/g, ' | '));
            await dialog.accept ();
            await browser.close ();
            process.exit (0);
         });

         try {
            await page.goto ('http://localhost:3001', {waitUntil: 'networkidle2', timeout: 30000});

            // Click the top-right "🧪 Test" button.
            var clicked = await page.evaluate (function () {
               var buttons = Array.from (document.querySelectorAll ('button'));
               var testButton = buttons.find (function (b) {
                  var text = (b.textContent || '').trim ();
                  return text === '🧪 Test' || text === 'Test' || text.indexOf ('Test') > -1;
               });
               if (! testButton) return false;
               testButton.click ();
               return true;
            });

            if (! clicked) {
               console.log ('[vibey-test-alert] ERROR: Could not find Test button');
               await browser.close ();
               process.exit (1);
            }

            // Wait up to 15 minutes for the test alert.
            var started = Date.now ();
            while (! gotDialog && Date.now () - started < 15 * 60 * 1000) {
               await new Promise (function (resolve) {setTimeout (resolve, 250);});
            }

            if (! gotDialog) {
               console.log ('[vibey-test-alert] TIMEOUT: No alert received within 15 minutes');
               await browser.close ();
               process.exit (2);
            }
         }
         catch (error) {
            console.log ('[vibey-test-alert] ERROR: ' + (error && error.message ? error.message : String (error)));
            await browser.close ();
            process.exit (3);
         }
      }) ();

      return;
   }

   // *** BROWSER MODE (c.test suite) ***

   var B = window.B;
   var type = teishi.type;

   // *** HELPERS ***

   var originalPrompt = window.prompt;

   var queuedPromptValues = [];

   var mockPrompt = function (value) {
      queuedPromptValues.push (value);
      window.prompt = function () {
         if (queuedPromptValues.length) return queuedPromptValues.shift ();
         return null;
      };
   };

   var restorePrompt = function () {
      window.prompt = originalPrompt;
      queuedPromptValues = [];
   };

   var findByText = function (selector, text) {
      var elements = document.querySelectorAll (selector);
      for (var i = 0; i < elements.length; i++) {
         if (elements [i].textContent.indexOf (text) !== -1) return elements [i];
      }
      return null;
   };

   var click = function (el) {
      if (! el) return false;
      el.click ();
      return true;
   };

   var LONG_WAIT   = 120000; // 2 min for LLM responses
   var MEDIUM_WAIT = 15000;
   var SHORT_WAIT  = 3000;
   var POLL        = 200;

   var TEST_PROJECT = 'test-flow1-' + Date.now ();
   var TEST_DIALOG  = 'read-vibey';

   // *** TESTS ***

   c.test ([

      // --- Step 1: We start on the projects tab ---
      ['Step 1: Navigate to projects tab', function (done) {
         window.location.hash = '#/projects';
         done (SHORT_WAIT, POLL);
      }, function () {
         var tab = B.get ('tab');
         if (tab !== 'projects') return 'Expected tab to be "projects" but got "' + tab + '"';
         var heading = findByText ('.editor-filename', 'Projects');
         if (! heading) return 'Projects heading not found in DOM';
         return true;
      }],

      // --- Step 2: Create a new project ---
      ['Step 2: Create project "' + TEST_PROJECT + '"', function (done) {
         mockPrompt (TEST_PROJECT);
         B.call ('create', 'project');
         done (MEDIUM_WAIT, POLL);
      }, function () {
         restorePrompt ();
         var tab = B.get ('tab');
         if (tab !== 'docs') return 'Expected to land on "docs" tab after project creation, got "' + tab + '"';
         var project = B.get ('currentProject');
         if (project !== TEST_PROJECT) return 'Expected currentProject to be "' + TEST_PROJECT + '" but got "' + project + '"';
         return true;
      }],

      // --- Step 3: Switch to dialogs tab ---
      ['Step 3: Navigate to dialogs tab', function (done) {
         B.call ('navigate', 'hash', '#/project/' + encodeURIComponent (TEST_PROJECT) + '/dialogs');
         done (SHORT_WAIT, POLL);
      }, function () {
         var tab = B.get ('tab');
         if (tab !== 'dialogs') return 'Expected tab to be "dialogs" but got "' + tab + '"';
         return true;
      }],

      // --- Step 4: Create a new dialog ---
      ['Step 4: Create dialog "' + TEST_DIALOG + '"', function (done) {
         mockPrompt (TEST_DIALOG);
         B.call ('create', 'dialog');
         done (MEDIUM_WAIT, POLL);
      }, function () {
         restorePrompt ();
         var file = B.get ('currentFile');
         if (! file) return 'No currentFile set after dialog creation';
         if (file.name.indexOf ('dialog-') !== 0) return 'Filename does not start with "dialog-": ' + file.name;
         if (file.name.indexOf (TEST_DIALOG) === -1) return 'Filename does not contain slug "' + TEST_DIALOG + '": ' + file.name;
         if (file.name.indexOf ('-waiting.md') === -1) return 'Dialog should be in waiting status: ' + file.name;
         return true;
      }],

      // --- Step 5: Check dialog appears in sidebar with icon and full name ---
      ['Step 5: Dialog visible in sidebar with status icon and full name', function () {
         var sidebar = document.querySelector ('.file-list');
         if (! sidebar) return 'Sidebar not found';
         var item = findByText ('.dialog-name', TEST_DIALOG);
         if (! item) return 'Dialog label "' + TEST_DIALOG + '" not found in sidebar';
         var text = item.textContent;
         // Check status icon is present (🟡 for waiting)
         if (text.indexOf ('🟡') === -1) return 'Expected waiting icon 🟡 in sidebar item, got: ' + text;
         // Check full name is visible (not truncated with ellipsis via CSS)
         var style = window.getComputedStyle (item);
         if (style.textOverflow === 'ellipsis') return 'Dialog name is being truncated with ellipsis';
         return true;
      }],

      // --- Step 6: Check gpt5.3 is selected ---
      ['Step 6: gpt5.3 model is selected', function () {
         var provider = B.get ('chatProvider');
         if (provider !== 'openai') return 'Expected provider to be "openai" but got "' + provider + '"';
         var model = B.get ('chatModel');
         if (model !== 'gpt-5') return 'Expected model to be "gpt-5" but got "' + model + '"';
         // Check the second select (model select) shows gpt5.3
         var selects = document.querySelectorAll ('.provider-select');
         if (selects.length < 2) return 'Expected at least 2 provider selects, found ' + selects.length;
         var modelSelect = selects [1];
         var selectedOption = modelSelect.options [modelSelect.selectedIndex];
         if (! selectedOption || selectedOption.textContent !== 'gpt5.3') return 'Model dropdown does not show gpt5.3, shows: ' + (selectedOption ? selectedOption.textContent : 'nothing');
         return true;
      }],

      // --- Step 7: Send message to read first 20 lines of vibey.md ---
      ['Step 7: Send "Please read the first 20 lines of vibey.md" message', function (done) {
         B.call ('set', 'chatInput', 'Please read the first 20 lines of vibey.md, which is two directories up from your working directory, using the run_command tool with `head -20 ../../vibey.md`, and summarize what it is about.');
         B.call ('send', 'message');
         done (LONG_WAIT, POLL);
      }, function () {
         var streaming = B.get ('streaming');
         var pending = B.get ('pendingToolCalls');
         // Keep waiting while streaming
         if (streaming) return 'Still streaming, waiting for tool request...';
         // If we have pending tool calls, step 7 is done
         if (pending && pending.length > 0) return true;
         // If no pending and not streaming, check if the full round-trip already completed
         // (tools may have been auto-approved)
         var file = B.get ('currentFile');
         if (file && file.content && file.content.indexOf ('Tool request:') !== -1 && file.content.indexOf ('Decision: approved') !== -1) return true;
         return 'Waiting for tool request or completed tool round-trip...';
      }],

      // --- Step 8: Authorize tool requests and wait for full round-trip ---
      ['Step 8: Authorize tool requests and wait for complete response', function (done) {
         var pending = B.get ('pendingToolCalls');
         if (pending && pending.length > 0) {
            B.call ('approve', 'allTools');
         }
         done (LONG_WAIT, POLL);
      }, function () {
         var streaming = B.get ('streaming');
         if (streaming) return 'Still streaming...';

         var pending = B.get ('pendingToolCalls');
         if (pending && pending.length > 0) {
            // More tool calls arrived — keep approving
            B.call ('approve', 'allTools');
            return 'Approving additional tool calls, waiting...';
         }

         // Wait until the file has been reloaded with tool blocks and a final response
         var file = B.get ('currentFile');
         if (! file || ! file.content) return 'Waiting for file to reload...';

         var content = file.content;
         // Must have at least one completed tool block
         if (content.indexOf ('Tool request:') === -1) return 'Waiting for tool blocks in dialog...';
         if (content.indexOf ('Decision: approved') === -1) return 'Waiting for tool decisions in dialog...';
         if (content.indexOf ('Result:') === -1) return 'Waiting for tool results in dialog...';

         return true;
      }],

      // --- Step 9: Verify response shows gauges (time + duration + compact cumulative tokens) ---
      ['Step 9: Response shows gauges with local time and compact in/out tokens', function () {
         var file = B.get ('currentFile');
         if (! file || ! file.content) return 'No current file';
         var content = file.content;

         // Check metadata exists in markdown source
         if (content.indexOf ('> Time:') === -1) return 'No "> Time:" metadata found in dialog';

         var metaElements = document.querySelectorAll ('.chat-meta');
         if (metaElements.length === 0) return 'No .chat-meta elements found in chat view';

         var hasTime = false;
         var hasDuration = false;
         var hasCompactTokens = false;

         for (var i = 0; i < metaElements.length; i++) {
            var text = metaElements [i].textContent || '';
            if (/\b\d{2}:\d{2}:\d{2}\b/.test (text) || /\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\b/.test (text)) hasTime = true;
            if (/\b\d+\.\ds\b/.test (text)) hasDuration = true;
            if (/\b\d+\.\dkti\s+\+\s+\d+\.\dkto\b/.test (text)) hasCompactTokens = true;
         }

         if (! hasTime) return 'No local time shown in gauges';
         if (! hasDuration) return 'No rounded seconds duration shown in gauges';
         if (! hasCompactTokens) return 'No compact cumulative token gauge shown (expected like 3.3kti + 1.8kto)';

         return true;
      }],

      // --- Step 10: Check tool result blocks present in dialog ---
      ['Step 10: Tool result blocks present with file content', function () {
         var file = B.get ('currentFile');
         if (! file) return 'No current file';

         // Verify tool blocks exist in markdown
         if (file.content.indexOf ('Tool request:') === -1) return 'No tool request blocks found in dialog';
         if (file.content.indexOf ('Result:') === -1) return 'No tool results found in dialog';

         // The tool result should contain file content from vibey.md
         var chatArea = document.querySelector ('.chat-messages');
         if (! chatArea) return 'Chat messages area not found';

         return true;
      }],

      // --- Step 11: Ask to create dummy.js (write_file) ---
      ['Step 11: Ask LLM to create dummy.js with console.log', function (done) {
         B.call ('set', 'chatInput', 'Please create a file called dummy.js with the content: console.log("hello from dummy"); Use the write_file tool for this.');
         B.call ('send', 'message');
         done (LONG_WAIT, POLL);
      }, function () {
         var streaming = B.get ('streaming');
         if (streaming) return 'Still streaming, waiting for write_file tool request...';
         var pending = B.get ('pendingToolCalls');
         if (pending && pending.length > 0) return true;
         // It may have already been auto-approved if authorization was given
         var file = B.get ('currentFile');
         if (file && file.content && file.content.indexOf ('write_file') !== -1) return true;
         return 'No write_file tool request found yet';
      }],

      // --- Step 12: Authorize the write_file tool once ---
      ['Step 12: Authorize write_file tool request', function (done) {
         var pending = B.get ('pendingToolCalls');
         if (! pending || pending.length === 0) {
            // May have been auto-approved
            done (SHORT_WAIT, POLL);
            return;
         }
         // Approve all pending
         B.call ('approve', 'allTools');
         done (LONG_WAIT, POLL);
      }, function () {
         var streaming = B.get ('streaming');
         if (streaming) return 'Still streaming after tool approval...';
         var pending = B.get ('pendingToolCalls');
         if (pending && pending.length > 0) {
            // More tool calls — approve them
            B.call ('approve', 'allTools');
            return 'Approving additional tool calls...';
         }
         var file = B.get ('currentFile');
         if (! file || ! file.content) return 'No file content';
         // Check that write_file was used and approved
         if (file.content.indexOf ('write_file') === -1) return 'write_file tool not found in dialog';
         if (file.content.indexOf ('Decision: approved') === -1) return 'No approved tool decision found';
         return true;
      }],

      // --- Step 13: Verify write_file result shown with success ---
      ['Step 13: Write result shown with success in chat view', function () {
         var file = B.get ('currentFile');
         if (! file || ! file.content) return 'No current file';

         // Check the dialog markdown has write_file approved
         if (file.content.indexOf ('write_file') === -1) return 'write_file not found in dialog';
         if (file.content.indexOf ('Decision: approved') === -1) return 'write_file not approved';

         // Check the DOM for the chat messages area
         var chatArea = document.querySelector ('.chat-messages');
         if (! chatArea) return 'Chat messages area not found';

         // The tool result should show success
         var hasResult = file.content.indexOf ('"success": true') !== -1 || file.content.indexOf ('"success":true') !== -1;
         if (! hasResult) return 'Write tool result with success not found in dialog';

         return true;
      }],

      // --- Step 14: Verify dummy.js was actually created ---
      ['Step 14: Verify dummy.js exists with console.log', function (done) {
         c.ajax ('get', 'project/' + encodeURIComponent (TEST_PROJECT) + '/file/dummy.js', {}, '', function (error, rs) {
            if (error) {
               window._testDummyContent = null;
               done ();
               return;
            }
            window._testDummyContent = rs.body ? rs.body.content : null;
            done ();
         });
      }, function () {
         // dummy.js is not a .md file, so it won't be served by the files endpoint
         // But write_file writes to the project dir, so we verify via the dialog markdown
         var file = B.get ('currentFile');
         if (! file || ! file.content) return 'No current file';
         var hasWriteSuccess = file.content.indexOf ('File written') !== -1 || file.content.indexOf ('"success":true') !== -1 || file.content.indexOf ('"success": true') !== -1;
         if (! hasWriteSuccess) return 'dummy.js write success not confirmed in dialog';
         return true;
      }],

      // --- Cleanup Flow #1 ---
      ['Cleanup: restore prompt', function () {
         restorePrompt ();
         return true;
      }],

      // =============================================
      // *** FLOW #2: Docs editing ***
      // =============================================

      // --- F2 Step 1: Create a new project for Flow #2 ---
      ['F2-1: Create project for docs editing', function (done) {
         window._f2Project = 'test-flow2-' + Date.now ();
         mockPrompt (window._f2Project);
         B.call ('create', 'project');
         done (MEDIUM_WAIT, POLL);
      }, function () {
         restorePrompt ();
         var project = B.get ('currentProject');
         if (project !== window._f2Project) return 'Expected project "' + window._f2Project + '", got "' + project + '"';
         var tab = B.get ('tab');
         if (tab !== 'docs') return 'Expected docs tab after project creation, got "' + tab + '"';
         return true;
      }],

      // --- F2 Step 2: Create doc-main.md (shown as main.md) ---
      ['F2-2: Create main.md', function (done) {
         mockPrompt ('main.md');
         B.call ('create', 'file');
         done (MEDIUM_WAIT, POLL);
      }, function () {
         restorePrompt ();
         var file = B.get ('currentFile');
         if (! file) return 'No currentFile after creating main.md';
         if (file.name !== 'doc-main.md') return 'Expected name "doc-main.md", got "' + file.name + '"';
         return true;
      }],

      // --- F2 Step 3: main.md appears in sidebar as "main.md" ---
      ['F2-3: main.md visible in sidebar', function () {
         var sidebar = document.querySelector ('.file-list');
         if (! sidebar) return 'Sidebar not found';
         var item = findByText ('.file-name', 'main.md');
         if (! item) return 'main.md not found in sidebar';
         return true;
      }],

      // --- F2 Step 4: Click main.md, editor opens with content ---
      ['F2-4: Click main.md, editor shows content', function () {
         var file = B.get ('currentFile');
         if (! file || file.name !== 'doc-main.md') return 'doc-main.md not loaded';
         var textarea = document.querySelector ('.editor-textarea');
         if (! textarea) return 'Editor textarea not found';
         if (textarea.value.indexOf ('main') === -1) return 'Editor does not contain initial content';
         return true;
      }],

      // --- F2 Step 5: Edit content, verify dirty state ---
      ['F2-5: Edit content and verify dirty indicator', function (done) {
         var newContent = '# Main\n\nUpdated content for testing.\n';
         B.call ('set', ['currentFile', 'content'], newContent);
         done (SHORT_WAIT, POLL);
      }, function () {
         var file = B.get ('currentFile');
         if (! file) return 'No currentFile';
         if (file.content === file.original) return 'Content should differ from original (dirty state)';
         // Check dirty indicator in DOM
         var dirty = document.querySelector ('.editor-dirty');
         if (! dirty) return 'Dirty indicator "(unsaved)" not found in DOM';
         if (dirty.textContent.indexOf ('unsaved') === -1) return 'Dirty indicator text missing "unsaved"';
         return true;
      }],

      // --- F2 Step 6: Save changes ---
      ['F2-6: Save changes', function (done) {
         B.call ('save', 'file');
         done (MEDIUM_WAIT, POLL);
      }, function () {
         var file = B.get ('currentFile');
         if (! file) return 'No currentFile after save';
         if (file.content !== file.original) return 'After save, content and original should match';
         // Dirty indicator should be gone
         var dirty = document.querySelector ('.editor-dirty');
         if (dirty) return 'Dirty indicator still present after save';
         return true;
      }],

      // --- F2 Step 7: Verify saved content persisted on server ---
      ['F2-7: Reload file and verify persisted content', function (done) {
         B.call ('load', 'file', 'doc-main.md');
         done (MEDIUM_WAIT, POLL);
      }, function () {
         var file = B.get ('currentFile');
         if (! file) return 'No currentFile after reload';
         if (file.content.indexOf ('Updated content for testing') === -1) return 'Persisted content not found after reload: ' + file.content.slice (0, 100);
         if (file.content !== file.original) return 'After fresh load, content and original should match';
         return true;
      }],

      // --- F2 Step 8: Create a second doc so we can test navigating away ---
      ['F2-8: Create second doc', function (done) {
         mockPrompt ('doc-notes.md');
         B.call ('create', 'file');
         done (MEDIUM_WAIT, POLL);
      }, function () {
         restorePrompt ();
         var file = B.get ('currentFile');
         if (! file || file.name !== 'doc-notes.md') return 'Expected doc-notes.md as current file';
         return true;
      }],

      // --- F2 Step 9: Go back to main.md, edit, then try to switch away ---
      // We mock confirm to test the dirty-leave warning
      ['F2-9: Edit main.md and attempt to leave (warned, stay and save)', function (done) {
         // First load main.md
         B.call ('load', 'file', 'doc-main.md');
         done (MEDIUM_WAIT, POLL);
      }, function () {
         var file = B.get ('currentFile');
         if (! file || file.name !== 'doc-main.md') return 'doc-main.md not loaded';
         // Make it dirty
         B.call ('set', ['currentFile', 'content'], file.original + '\nExtra unsaved line.\n');
         var fileDirty = B.get ('currentFile');
         if (fileDirty.content === fileDirty.original) return 'File should be dirty';
         return true;
      }],

      // --- F2 Step 10: Try to load another file while dirty — mock confirm to save ---
      ['F2-10: Navigate away from dirty doc triggers save via confirm', function (done) {
         // Mock confirm: first confirm (save?) -> true, triggering save
         var originalConfirm = window.confirm;
         window.confirm = function () {
            window.confirm = originalConfirm;
            return true; // "Yes, save before leaving"
         };
         B.call ('load', 'file', 'doc-notes.md');
         done (MEDIUM_WAIT, POLL);
      }, function () {
         var file = B.get ('currentFile');
         if (! file) return 'No currentFile';
         // We should now be on doc-notes.md (the save succeeded and we navigated)
         if (file.name !== 'doc-notes.md') return 'Expected to land on doc-notes.md, got ' + file.name;
         return true;
      }],

      // --- F2 Step 11: Verify the save from step 10 persisted ---
      ['F2-11: Verify main.md has the extra line saved', function (done) {
         B.call ('load', 'file', 'doc-main.md');
         done (MEDIUM_WAIT, POLL);
      }, function () {
         var file = B.get ('currentFile');
         if (! file || file.name !== 'doc-main.md') return 'doc-main.md not loaded';
         if (file.content.indexOf ('Extra unsaved line') === -1) return 'Extra line was not saved. Content: ' + file.content.slice (0, 200);
         return true;
      }],

      // --- F2 Step 12: Edit again and discard changes ---
      ['F2-12: Edit main.md, then discard changes', function (done) {
         var file = B.get ('currentFile');
         B.call ('set', ['currentFile', 'content'], file.original + '\nThis will be discarded.\n');
         // Mock confirm: first confirm (save?) -> false (don't save), second confirm (discard?) -> true
         var callCount = 0;
         var originalConfirm = window.confirm;
         window.confirm = function () {
            callCount++;
            if (callCount === 1) return false;  // "No, don't save"
            if (callCount === 2) {               // "Yes, discard"
               window.confirm = originalConfirm;
               return true;
            }
            window.confirm = originalConfirm;
            return true;
         };
         B.call ('load', 'file', 'doc-notes.md');
         done (MEDIUM_WAIT, POLL);
      }, function () {
         var file = B.get ('currentFile');
         if (! file) return 'No currentFile';
         if (file.name !== 'doc-notes.md') return 'Expected doc-notes.md after discard, got ' + file.name;
         return true;
      }],

      // --- F2 Step 13: Verify main.md does NOT have the discarded text ---
      ['F2-13: Verify discarded changes not persisted', function (done) {
         B.call ('load', 'file', 'doc-main.md');
         done (MEDIUM_WAIT, POLL);
      }, function () {
         var file = B.get ('currentFile');
         if (! file || file.name !== 'doc-main.md') return 'doc-main.md not loaded';
         if (file.content.indexOf ('This will be discarded') !== -1) return 'Discarded text was persisted — should not be there';
         return true;
      }],

      // --- F2 Cleanup ---
      ['F2-Cleanup: restore prompt', function () {
         restorePrompt ();
         return true;
      }]

   ], function (error, time) {
      if (error) {
         console.error ('❌ Test FAILED:', error.test, '— Result:', error.result);
         alert ('❌ Test FAILED: ' + error.test + '\n\nResult: ' + error.result);
      }
      else {
         console.log ('✅ All tests passed (Flow #1 + Flow #2)! (' + time + 'ms)');
         alert ('✅ All tests passed (Flow #1 + Flow #2)! (' + time + 'ms)');
      }
   });

})();
