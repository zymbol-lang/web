# Share links — implementation plan for v0.0.9

Status: **design agreed, not implemented.** Target release: v0.0.9.

The playground can already be linked to: `playground.html?open=<path under examples/>` mounts
one catalog entry and opens one file, and the address bar is rewritten to that form on every
mount, so the URL in the bar is always a valid link (v0.0.8, `resolveDeepLink` in
[`src/playground/catalog.js`](../src/playground/catalog.js)).

What is missing is everything that turns "a URL exists" into "people share it": a control that
says *share*, a link that carries **the code the visitor wrote** and not only the example they
started from, and a preview card that does not look identical for a board game and a FizzBuzz.

## The one rule

**A share link must describe what is on screen.** If it cannot, the UI says so before the user
sends it. A button that quietly shares the pristine example when the visitor spent ten minutes
editing it is the same class of lie as calling a feature demo a "real program".

Three cases, and the popover states which one applies:

| On screen | The link carries | Label |
| --- | --- | --- |
| A clean catalog entry | `?open=<path>` | *This example* |
| An edited entry, or the visitor's own file | `?code=<payload>` | *My version* |
| Several of the visitor's own files | nothing — a URL cannot hold them | *Use ↓ Download and send the `.zyp`* |
| An edited file of a mounted package | `?open=<zyp>&code=<payload>` | *My version of \<package\>* — phase 2 |

## URL forms

```text
playground.html?open=games/classic/go.zyp        an example, by its path under examples/
playground.html?open=games/classic/go/核/盤.zy    one file of it
playground.html?example=pkg-go                   legacy: by catalog id, still resolves
playground.html?code=<base64url>                 the visitor's own code, inline
playground.html?open=<zyp>&code=<base64url>      a package plus the visitor's edits on top
```

Precedence: `code` wins over `example`; `open` + `code` together mean *mount, then apply*.
Anything unresolvable prints a diagnostic in the output panel and leaves the playground alone —
never a blank editor.

### The `?code=` payload

`base64url(deflate-raw(JSON.stringify(envelope)))`, decoded with `DecompressionStream`.

```jsonc
{
  "v": 1,
  "files": [{ "name": "prog1.zy", "code": "…" }],   // array from the start: phase 2 needs it
  "entry": "prog1.zy",                              // which file gets the tab
  "args": "10 25 7"                                 // optional, pre-fills the args… field
}
```

- **No dependency.** `CompressionStream('deflate-raw')` is the sibling of the
  `DecompressionStream` [`zyp.js`](../src/zymbol/zyp.js) already uses to read packages, so the
  browser floor does not move: Chrome 80+, Firefox 113+, Safari 16.4+. Where it is missing,
  the *My version* option is hidden and the popover says why — it does not silently fall back
  to sharing the wrong thing.
- **Size.** A loose example of 1–3 KB lands around 600–1500 characters. Warn above 2000, refuse
  above 8000 and point at ↓ Download: some chat clients and proxies truncate long URLs, and a
  truncated `?code=` is a broken link, not a shorter one.
- **`files[]` from day one** even though phase 1 only ever writes one entry. Widening a shipped
  URL format later means either a `v: 2` or links that decode to nothing.

### Safety: a shared link never runs itself

Opening a `?code=` link loads the code into the editor and **stops there**, with a note in the
output panel saying the code arrived from a link. The visitor presses ▶ Run.

The engine is a sandboxed interpreter with no disk access, so the risk is not exfiltration — it
is denial of service: the 50 000-statement cap that stops a runaway loop is deliberately
*exempt* for TUI blocks, so an autorun link containing `>>|` and an infinite loop would freeze
the tab of anyone who clicks it. Not autorunning removes the whole class.

Two more must-haves:

- **Sanitise `name`.** Take the basename, force a `.zy` suffix, reject `..` and absolute paths.
  A mounted name is a module-resolver key: `../../std/io.zy` in a shared link must not be able
  to shadow a real module for the visitor.
- **Never trust the payload's length or shape.** Decode inside a `try`, cap the decompressed
  size (say 256 KB), and treat a malformed envelope as "unknown link", not as an exception in
  the console.

The popover also says, in one line, that *the link contains your code* — a visitor pasting it
into a public chat should know that before, not after.

## The share control

Placement: next to ↓ Download / ↑ Upload in the editor header. That row is already crowded
(Run, script picker, args, Clear, Download, Upload); on narrow screens Download/Upload/Share
collapse behind a `⋯` menu.

Second entry point: a `🔗` action on the sidebar entry row, reusing the existing `sb-actions`
hover pattern (the `×` in WORKSPACE), so an example can be shared without opening it.

### On a phone: the native sheet

`navigator.canShare?.()` → `navigator.share({ title, text, url })`. One tap, and the visitor
gets WhatsApp, Telegram, Signal, Mail — whatever they actually have installed. This is the
whole of "share to IM" and it is roughly fifteen lines.

### On the desktop: a popover

- The URL in a read-only input + **Copy** (`navigator.clipboard.writeText`, falling back to
  `document.execCommand('copy')` for non-secure origins). Feedback is an inline *Copied ✓* for
  1.5 s, never an `alert`.
- Destination links, as plain `href`s that navigate away:
  `https://x.com/intent/post?text=…&url=…`, `https://wa.me/?text=…`,
  `https://t.me/share/url?url=…&text=…`, `mailto:?subject=…&body=…`.
- **No third-party SDKs, ever.** The X and Meta share widgets would put the first third-party
  code — and the first tracker — into a playground that today has exactly none. Intent URLs
  give the same result and cost nothing.

### The message writes itself

The catalog already knows the title, the description, the icon and whether the entry is a game
(group `games`), so the text is generated, not typed:

```text
game     🐍 Serpiente — Snake, written in Zymbol: no keywords, only symbols. Play it in your browser → <url>
example  Zymbol — <title>: <desc> → <url>
own code I wrote this in Zymbol — no keywords, only symbols → <url>
```

## Preview cards: one page per game

Today every shared link renders the same Open Graph card, because GitHub Pages is static and
cannot generate `og:` tags per query string. A board game and a FizzBuzz look identical in a
WhatsApp thread, which defeats the point of sharing.

The only fix available on Pages is a real page per game:

```text
g/go.html          og:title, og:description, og:image (1200×630 of the board), ▶ Play → playground.html?open=…
g/serpiente.html
g/klingon.html
games.html         the shop window: cards for all of them
```

`zymbol-lang.org/g/go` is also a better thing to say out loud than
`playground.html?open=games/classic/go.zyp`. The share control prefers the short URL whenever
the entry has a page of its own and falls back to `?open=` when it does not. New files go in
the sitemap.

## Not in scope

- **A URL shortener or a paste server.** `web/` is static, has no build step and no backend;
  keeping it that way is worth more than shorter links.
- **QR codes.** Generating one without a library is ~200 lines of matrix code. Revisit later.
- **Sharing the whole workspace.** That is what `.zyp` and ↓ Download are for.
- **Analytics on what gets shared.**

## Work breakdown

Phase 1 — the control and the canonical link:

1. `src/playground/share.js`: URL building, message templates, envelope encode/decode. No DOM,
   so it is testable in plain Node like `module-resolver.js`.
2. Share button + popover + `navigator.share()` path; `🔗` on the sidebar row.
3. Dirty-state awareness: the popover picks *This example* vs *My version* and says which.

Phase 2 — the visitor's own code:

4. `?code=` read path: decode, sanitise, mount as a user file, **no autorun**, note in output.
5. `?open=` + `?code=` combined: mount the package, then overwrite the shared file — this is
   the case "I changed the snake's speed, look".
6. Size guard and the `CompressionStream`-missing path.

Phase 3 — the cards:

7. `g/<game>.html` ×3 with their own OG tags and images, `games.html`, sitemap entries.
8. Share control prefers the short URL.

## Tests

- `tests/test_share.mjs` (new, plain Node): envelope round-trip, size guard, `name`
  sanitising (`../`, absolute paths, missing `.zy`), rejecting a malformed payload, and URL
  building for each of the three cases. `CompressionStream` exists in Node 18+, so this needs
  no browser.
- `tests/test_catalog.mjs`: extend the deep-link section so every entry that has a `g/` page is
  reachable both ways.
- The browser-level behaviour (popover, copy, no-autorun) is covered by the CDP harness used
  for the v0.0.8 hover-preview fix; if it earns a place in the repo it lands as an optional
  `tests/test_ui.mjs` that skips when `google-chrome` is not on PATH, the way
  `test_catalog.mjs --check` skips without the `zymbol` binary.

## Open questions

- Do the `g/` pages live at `g/<name>.html` or `games/<name>.html`? `g/` is shorter to say;
  `games/` matches `examples/games/`.
- Should `?code=` links be allowed to prefill the args field (they can carry `args`), or is
  that a surprise for the person opening the link?
- Is *My version of \<package\>* (phase 2, step 5) worth the extra state, or is "share the
  package link and tell them what you changed" enough for v0.0.9?
