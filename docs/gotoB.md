# gotoB: practical guide (from examples + source)

This guide is based on:
- `../gotoB/examples/*`
- `../gotoB/readme.md` (skimmed)
- `../arch/gotoB.js` (full source)

It focuses on **how to build apps with gotoB** in the same style as the examples.

---

## 1) Core mental model

gotoB apps are built around 4 primitives:

1. **`B.call`** — trigger an event (`verb`, `path`, ...args)
2. **`B.respond`** — register responder(s) for events
3. **`B.view`** — reactive DOM fragment linked to store path(s)
4. **`B.ev`** — generate DOM handler strings that call `B.call`

And one global state container:
- **`B.store`** — single source of truth

Typical flow:
- User action (`onclick`, `oninput`, etc.) -> `B.ev(...)`
- Event called via `B.call`
- One/more responders run (`B.respond` / `B.mrespond`)
- State changes (`set`/`add`/`rem`)
- `change` events emitted
- Matching `B.view` blocks redraw

---

## 2) Minimal app skeleton

```js
var dale = window.dale, teishi = window.teishi, lith = window.lith, c = window.c, B = window.B;

var app = function () {
  return B.view ('counter', function (counter) {
    counter = counter || 0;
    return ['div', [
      ['h2', 'Counter: ' + counter],
      ['button', {onclick: B.ev ('set', 'counter', counter + 1)}, 'Increment']
    ]];
  });
}

B.mount ('body', app);
```

This is exactly the pattern used across `examples.js`, `tictactoe.js`, etc.

---

## 3) Store updates: built-in data events

Most apps use these built-ins:

- `B.call ('set', path, value)`
- `B.call ('add', path, ...items)`
- `B.call ('rem', path, ...keys)`

They update `B.store` and trigger `change` events when data actually changes.

### Path conventions
- string path: `'todos'`
- array path: `['todos', 3, 'completed']`
- empty path (`[]`) means root store

### Safe reads
Use:
- `B.get ('todos', 0, 'title')`
or
- `B.get (['todos', 0, 'title'])`

Avoid deep direct access (`B.store.foo.bar`) if parents may be undefined.

### Notes that matter in practice
- `set` creates missing parents (object/array) as needed.
- `add` expects an array at target path (or creates one if target is `undefined`).
- `rem` can remove from object or array; for arrays it removes indexes.
- No-op updates won’t trigger redraws.

---

## 4) Events and responders (where app logic lives)

### Single responder
```js
B.respond ('create', 'todo', function (x) {
  var todo = prompt ('New todo?');
  if (todo) B.call (x, 'add', 'todos', todo);
});
```

### Multiple responders at once (`B.mrespond`)
Common in examples (`cart.js`, `flux.js`, `todomvc.js`, `7guis.js`):

```js
B.mrespond ([
  ['initialize', [], function (x) { ... }],
  ['load', 'data', function (x) { ... }],
  ['change', 'cart', {match: B.changeResponder}, function (x) { ... }]
]);
```

### Important: pass `x` when calling from responders
Use `B.call (x, ...)`, not just `B.call (...)`, to preserve event chain metadata in logs.

### Matching options you’ll actually use
- wildcard/regex in responder `verb` and `path`
- `priority` to control execution order
- `id` to later `B.forget (id)`
- `match` for custom matching rules

---

## 5) Reactive views with `B.view`

### One dependency
```js
B.view ('input', function (input) {
  return ['input', {value: input, oninput: B.ev ('set', 'input')}];
});
```

### Multiple dependencies
```js
B.view ([['products'], ['filter']], function (products, filter) {
  ...
});
```

### Rules (important)
From examples + source behavior:
- A `B.view` function should return **one lith element** (not a lithbag).
- Don’t manually assign `id` on the root element of a `B.view`; gotoB manages it.
- Wrap `B.view` in a function when reused (`var myView = function () { return B.view(...); }`).
- Nested views are fine; each view still needs its own real wrapper element.

---

## 6) DOM -> events with `B.ev`

Basic:
```js
onclick: B.ev ('refresh', [])
```

With argument inferred from input value:
```js
oninput: B.ev ('set', 'newTodo')
```

With raw JS expression (used a lot in examples):
```js
onkeyup: B.ev ('enter', 'new', {raw: 'event.keyCode'})
oninput: B.ev ('set', ['quantities', product.id], {raw: 'this.value'})
```

Chain multiple events from one handler:
```js
onclick: B.ev (
  ['cart', 'add', product.id, quantity],
  ['rem', 'quantities', product.id]
)
```

Practical tip: use `raw` only when needed (`event`, `this.value`, computed expressions). Prefer normal args otherwise.

---

## 7) `change` matching and `B.changeResponder`

`change` events are central for derived behavior.

In `cart.js`:
```js
['change', 'cart', {match: B.changeResponder}, function (x) {
  B.call (x, 'calculate', 'total');
}]
```

`B.changeResponder` matches subtree-related paths (not only exact equality), useful when you want reactions on nested mutations.

---

## 8) Advanced update pattern: mute updates + manual change

Seen in `7guis.js` (cells):

```js
B.call (x, 'mset', ['cells', 'rows'], ...);
B.call (x, 'mset', ['cells', 'refs'], {});
B.call (x, 'change', ['cells', 'rows']);
```

Use `mset/madd/mrem` when batching updates and you want to trigger redraw manually once.

Minimal patterns:

```js
// 1) Batch init
B.call (x, 'mset', ['State', 'rows'], rows);
B.call (x, 'mset', ['State', 'meta'], meta);
B.call (x, 'change', ['State', 'rows']);

// 2) Batch append
dale.go (incomingItems, function (item) {
  B.call (x, 'madd', ['Data', 'items'], item);
});
B.call (x, 'change', ['Data', 'items']);

// 3) Batch remove
dale.go (indexesToDelete, function (index) {
  B.call (x, 'mrem', ['Data', 'items'], index);
});
B.call (x, 'change', ['Data', 'items']);
```

Good for:
- large initialization
- imported datasets
- multi-step transforms where intermediate redraws are wasteful

---

## 9) Patterns copied from examples

### Tic-tac-toe (`tictactoe.js`)
- Keep board + next player in store
- On click: set board cell -> recompute winner -> set winner/next
- Simple and clean event-driven logic

### Cart (`cart.js`)
- Keep product catalog + cart + computed total in store
- Use responder chaining (`cart add` -> `change cart` -> `calculate total`)
- Nested `B.view` for per-row reactive quantities

### TodoMVC (`todomvc.js`)
- Full CRUD + filtering + editing + persistence (`localStorage`)
- URL hash event (`hash change`) updates active view
- Great reference architecture for medium-size app

### Flux challenge (`flux.js`)
- Async requests + cancellation + websocket updates
- Derived state and coordination via responders
- Good reference for non-trivial side effects

---

## 10) Under the hood (from `../arch/gotoB.js`)

The source confirms these mechanics:
- gotoB internally diffs old/new rendered structures and patches DOM.
- Redraws are queued to avoid concurrent patching conflicts.
- View listeners are attached to `change` events and resolved by view id.
- Unmount forgets responders for removed reactive nodes.

Practical takeaway: stick to the event/store/view model; avoid manual DOM edits inside reactive roots.

---

## 11) Debugging and observability

### `B.log`
gotoB keeps event/responder history in `B.log`.

Useful for:
- what fired?
- which responder matched?
- what args were passed?
- what chain triggered this?

### `B.eventlog()`
Renders a readable HTML table of the logs. Great when console output is too noisy.

### Preserve chains with `x`
Always do `B.call (x, ...)` inside responders. This makes traces much easier to follow.

### Development helper
In larger examples you can customize logging retention, e.g. capping `B.log` length.

---

## 12) Mounting, unmounting, responder lifecycle

- `B.mount (target, viewFun)` renders into `body` or selector target.
- `B.unmount (target)` clears DOM under target and forgets mounted view responders.
- `B.respond(...)` responders remain active until forgotten.
- Use `B.forget (id)` for temporary/dynamic responders.

Dynamic responder IDs are used in `7guis.js` cells to rewire formula dependencies:
- forget old dependency responders
- create new ones for current references

This is a strong pattern for graph-like reactive dependencies.

---

## 13) Common pitfalls

1. **Mutating objects returned by `B.get` directly**
   - You might bypass expected event/update flow.
   - Copy first if needed (`teishi.copy`).

2. **Calling `B.view(...)` once and reusing same node in multiple places**
   - Wrap in function and call each time.

3. **Manually editing DOM produced by reactive views**
   - Can break redraw assumptions.

4. **Forgetting to define responders before calling events**
   - Calls with no match do nothing.

5. **Not passing `x` in responder-triggered calls**
   - Harder debugging/tracing.

6. **Using root path replacement accidentally**
   - `B.call ('set', [], value)` replaces entire store.

---

## 14) Recommended way to structure a gotoB file

1. Setup globals (`dale`, `teishi`, `lith`, `c`, `B`)
2. Define pure helpers (parsers, mappers, calculators)
3. Define responders (`B.respond` / `B.mrespond`)
4. Define view functions (`B.view` inside them)
5. Initialize store (`B.call ('set', ...)` / `initialize` event)
6. Mount (`B.mount ('body', app)`)

This is the exact shape used in most examples.

---

## 15) Tiny template you can copy

```js
var dale = window.dale, teishi = window.teishi, lith = window.lith, c = window.c, B = window.B;

B.mrespond ([
  ['initialize', 'app', function (x) {
    B.call (x, 'set', 'items', []);
    B.mount ('body', app);
  }],
  ['item', 'add', function (x, title) {
    if (! title) return;
    B.call (x, 'add', 'items', {id: teishi.time (), title: title});
  }]
]);

var app = function () {
  return ['div', [
    ['button', {onclick: B.ev ('item', 'add', 'Example')}, 'Add'],
    B.view ('items', function (items) {
      items = items || [];
      return ['ul', dale.go (items, function (item) {
        return ['li', item.title];
      })];
    })
  ]];
}

B.call ('initialize', 'app');
```

---

## 16) Quick checklist before shipping

- [ ] No direct state mutations bypassing events
- [ ] `B.call (x, ...)` used inside responders
- [ ] `B.view` roots have no manual `id`
- [ ] Event names/paths are consistent and grep-friendly
- [ ] Expensive multi-updates batched with `mset/madd/mrem` + explicit `change`
- [ ] `B.eventlog()` reviewed for odd event storms
- [ ] `B.unmount`/`B.forget` used where dynamic views/responders exist

This checklist catches most real gotoB bugs early.

---

## 17) Gems from `../acpic/client.js` rfuns

A few patterns in `../acpic/client.js` are especially reusable. I’m including tiny templates so an LLM (or human) can copy the shape safely.

### 1) Transport responder as an app-level gateway

Instead of spreading `c.ajax` calls everywhere, `acpic` centralizes HTTP in one responder:

```js
[/^(get|post)$/, [], {match: H.matchVerb}, function (x, headers, body, cb) {
  // inject csrf for post, measure timings, handle auth expiry,
  // retry selected transient failures, then call cb
}]
```

Minimal template:

```js
B.respond (/^(get|post)$/, [], {match: H.matchVerb}, function (x, headers, body, cb) {
  headers = headers || {};
  body = body || {};

  if (x.verb === 'post') body.csrf = B.get ('Data', 'csrf');

  c.ajax (x.verb, x.path [0], headers, body, function (error, rs) {
    if (error && error.status === 403) return B.call (x, 'goto', 'page', 'login');
    if (cb) cb (x, error, rs);
  });
});

// usage from other responders
B.call (x, 'post', 'query', {}, {tags: []}, function (x, error, rs) {
  if (! error) B.call (x, 'set', ['Data', 'pivs'], rs.body.pivs);
});
```

Why this is great:
- one place for auth token injection
- one place for retry policy
- one place for status/timing logging
- responders that use HTTP stay very small

### 2) Stale-request protection with monotonic token

In `query pivs`, each request stores a timestamp token in state, and response handlers ignore stale responses:

```js
var t = Date.now ();
B.call (x, 'set', ['State', 'querying'], {t: t, options: options});
...
if (t !== B.get ('State', 'querying', 't')) {
  querying.options.retry = true;
  return B.call (x, 'query', 'pivs', querying.options);
}
```

Minimal template:

```js
B.respond ('search', 'run', function (x, q) {
  var req = Date.now ();
  B.call (x, 'set', ['State', 'searchReq'], req);

  c.ajax ('get', 'search?q=' + encodeURIComponent (q), {}, '', function (error, rs) {
    if (req !== B.get ('State', 'searchReq')) return; // stale response
    if (error) return B.call (x, 'snackbar', 'red', 'Search failed');
    B.call (x, 'set', ['Data', 'results'], rs.body.results);
  });
});
```

This is excellent for rapid filter/search UIs where older responses can arrive late.

### 3) Batch updates + one explicit `change`

For expensive multi-item operations (e.g. shift-select ranges), `acpic` does direct/mute state writes and emits one `change` event.

Minimal template:

```js
B.respond ('select', 'range', function (x, ids) {
  dale.go (ids, function (id) {
    B.call (x, 'mset', ['State', 'selected', id], true);
  });
  B.call (x, 'change', ['State', 'selected']);
});
```

Result: same correctness, fewer redraws.

### 4) URL <-> state synchronization as responders

`acpic` treats URL parsing/serialization as events:
- `change State.queryURL` decodes URL and updates query state
- `update queryURL` serializes query state back to hash

Minimal template:

```js
B.respond ('change', ['State', 'queryURL'], function (x) {
  var encoded = B.get ('State', 'queryURL');
  if (! encoded) return;
  try {
    var query = JSON.parse (decodeURIComponent (atob (encoded)));
    B.call (x, 'set', ['State', 'query'], query);
  }
  catch (e) {
    B.call (x, 'snackbar', 'red', 'Invalid URL query');
  }
});

B.respond ('update', 'queryURL', function (x) {
  var query = B.get ('State', 'query');
  var encoded = btoa (encodeURIComponent (JSON.stringify (query)));
  history.replaceState (undefined, undefined, '#/pics/' + encoded);
  B.call (x, 'set', ['State', 'queryURL'], encoded);
});
```

This keeps deep-linking logic explicit and testable, instead of hidden in ad-hoc code.

### 5) Snackbar lifecycle hygiene

`clear snackbar` first cancels existing timeout, then removes state; `snackbar` always goes through this path before setting a new one.

Minimal template:

```js
B.respond ('clear', 'snackbar', function (x) {
  var s = B.get ('State', 'snackbar');
  if (s && s.timeout) clearTimeout (s.timeout);
  B.call (x, 'rem', 'State', 'snackbar');
});

B.respond ('snackbar', 'green', function (x, msg) {
  B.call (x, 'clear', 'snackbar');
  var timeout = setTimeout (function () {
    B.call (x, 'rem', 'State', 'snackbar');
  }, 3000);
  B.call (x, 'set', ['State', 'snackbar'], {color: '#04E762', message: msg, timeout: timeout});
});
```

This prevents stacked timers and UI race conditions when many notifications fire quickly.

