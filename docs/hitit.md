# LLM-Readable Instructive: Backend Testing with `hitit`

Use this as a strict blueprint for writing backend integration tests in projects that use `hitit`, following the style in:
`/Volumes/now/now/denk/hack/arch/IP/questplay-rfid-proxy-server/test/test.js`

---

## 1) Goal

Create **sequential HTTP integration tests** that:
- hit real endpoints,
- validate status codes,
- validate response bodies/headers,
- share state across steps,
- cover auth + CRUD + edge cases + cleanup,
- stop on first failure with useful error output.

---

## 2) Required modules pattern

```js
var fs     = require ('fs');      // optional, for temp files (CSV import/export tests)
var h      = require ('hitit');   // test runner / request sequencer
var dale   = require ('dale');    // helper loops/maps
var teishi = require ('teishi');  // type checks, deep equality, logging
var log    = teishi.l, type = teishi.t;

var CONFIG = require ('../config.js');
```

Use `CONFIG` for host/port/auth settings so tests are environment-driven.

---

## 3) Test case shape (core contract)

Each step is usually an array:

```js
[
  description,   // string
  method,        // 'get' | 'post' | 'put' | 'delete'
  path,          // endpoint path like 'db', 'auth/login', '/'
  headers,       // object
  body,          // string/object/array/function(state)->body
  expectedCode,  // number (HTTP status)
  validator      // optional function(state, request, response, next)
]
```

### Important details
- `validator` returns `true` for success, or returns `log('reason')`/`false` for failure.
- `body` can be a function that reads shared `state`.
- `validator` may be async by using `next` (call `setTimeout(next, ms)` when needed).

---

## 4) Shared state usage

`hitit` sequence state allows passing values between steps.

Common patterns:
- Save session cookie after login:
  ```js
  state.headers = {cookie: response.headers.cookie};
  ```
- Save baseline lists before mutations:
  ```js
  state.allDevices = response.body;
  ```
- Save IDs for later cleanup:
  ```js
  state.queueId = ...;
  ```

Use random IDs to avoid collisions:
```js
var deviceId = Math.random () + '';
var sequenceId = Math.random () + '';
var tokenId = 'token' + Math.random ();
```

---

## 5) Organize tests into semantic blocks

Follow this structure (as in the guide file):

1. **Unauthenticated behavior** (`403` for protected routes, `200` for public assets)
2. **Cookie auth flow** (signup/login/logout/double logout)
3. **CRUD validation blocks** (device, sequence, serverpath)
4. **Route-specific behavior** (echo route, transforms like `@R`, `@SUCCESS`, `@TIME`, `@IP`)
5. **Error/queue behavior** (pre-step errors vs post-step errors)
6. **Import/export tests** (JSON + CSV)
7. **Users/auth token tests**
8. **Cleanup** (delete created resources and verify state restored)
9. **404 check** for unknown routes

This makes failures easy to localize.

---

## 6) Validation style to replicate

Use strict body/type assertions in validators:

```js
if (type (rs.body) !== 'array') return log ('body must be array');
if (! teishi.eq (rs.body, expected)) return log ('invalid response body');
if (! response.headers.cookie) return false;
```

Check both:
- protocol-level correctness (status/header),
- domain correctness (business invariants).

---

## 7) Dynamic request bodies

For steps depending on prior responses/state:

```js
['delete queue', 'post', 'db', {}, function (s) {
  return {head: {verb: 'delete', path: ['queue', s.queueId]}};
}, 200]
```

This pattern is preferred over hardcoding.

---

## 8) Async assertions and delayed effects

When testing background/post-runner behavior, validate after a small delay:

```js
function (s, rq, rs, next) {
  setTimeout (next, 100);
}
```

Use this for eventual consistency checks (queues, post hooks, delayed mutations).

---

## 9) Run all blocks with one `h.seq`

```js
h.seq(
  {
    host: CONFIG.host,
    port: CONFIG.port,
    https: CONFIG.https !== undefined,
    rejectUnauthorized: CONFIG.rejectUnauthorized,
    timeout: 2
  },
  [
    suite1,
    suite2,
  ],
  function (error) {
    if (error) {
      error.request.body = error.request.body.slice (0, 1000) + (error.request.body.length > 1000 ? '... OMITTING REMAINDER' : '');
      return console.log ('FINISHED WITH AN ERROR:', error);
    }
    log ('ALL TESTS FINISHED SUCCESSFULLY!');
  },
  h.stdmap
);
```

Key points:
- Keep all blocks in one orchestrated sequence.
- Fail fast.
- Print compact but useful diagnostics.

---

## 10) Backend test checklist (LLM execution checklist)

When generating new tests, ensure all are present:

- [ ] protected routes deny unauthenticated requests
- [ ] login/signup/logout lifecycle tested
- [ ] invalid payloads return correct `4xx`
- [ ] valid payloads mutate state correctly
- [ ] reads after writes verify persisted values
- [ ] conflict behavior (`409`) tested
- [ ] internal transforms/placeholders tested (`@R`, `@SUCCESS`, etc.)
- [ ] pre-step and post-step error semantics tested
- [ ] queueing/retry side effects tested
- [ ] import/export roundtrip tested
- [ ] cleanup restores initial state
- [ ] unknown route returns `404`

---

## 11) Minimal template to copy

```js
var h = require ('hitit');
var teishi = require ('teishi');
var type = teishi.t, log = teishi.l;
var CONFIG = require ('../config');

var id = Math.random () + '';

var tests = [
  ['create item invalid', 'post', 'db', {}, {head: {verb: 'post', path: ['item', id]}, body: {}}, 400],
  ['create item valid', 'post', 'db', {}, {head: {verb: 'post', path: ['item', id]}, body: {id: id, value: 1}}, 200],
  ['get item', 'post', 'db', {}, {head: {verb: 'get', path: ['item', id]}}, 200, function (s, rq, rs) {
    if (type (rs.body) !== 'object' || rs.body.body.value !== 1) return log ('item value mismatch');
    return true;
  }],
  ['delete item', 'post', 'db', {}, {head: {verb: 'delete', path: ['item', id]}}, 200]
];

h.seq({host: CONFIG.host, port: CONFIG.port}, [tests], function (error) {
  if (error) return console.log ('FINISHED WITH AN ERROR:', error);
  log ('ALL TESTS FINISHED SUCCESSFULLY!');
}, h.stdmap);
```

---

## 12) Style rules to keep

- Prefer many small explicit steps over giant validators.
- Use descriptive step names (they become your failure report).
- Always verify both negative and positive paths.
- Always include cleanup.
- Use random IDs to avoid flaky parallel runs.
- Keep assertions deterministic and specific.
