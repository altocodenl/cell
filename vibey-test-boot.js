// vibey-test-boot.js
// Opens vibey client, clicks the "Test" button, waits for alert, prints it, exits.

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
})();
