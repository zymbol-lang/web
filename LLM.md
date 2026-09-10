# Zymbol for LLMs — zyjs, the JavaScript engine

Companion to `interpreter/LLM.md`, which is the language brief. **This document is
about the *environment*, not the language.** Everything below was executed against
`web/src/zymbol/zymbol.js` and against `zymbol 0.0.9` on 2026-08-27; the numbers are
that day's measurements, not a claim from a comment.

`zyjs` is the third engine: a hand-written JavaScript mirror of the Rust tree-walker
(`zytw`), used by the playground at `zymbol-lang.org/playground.html` and runnable
from Node with no build step and no npm dependency.

```bash
# from web/ — the engine as a command-line tool
node tests/run_one.mjs f.zy              # run one program; stdout = output, stderr = diagnostics, exit 1 on error
node tests/run_one.mjs f.zy --input i.txt   # feed it stdin from a file
node tests/test_runner.mjs               # the corpus through zytw and zyjs (delegates to zyq)
node tests/test_runner.mjs --dir examples   # the example pool, which web/ owns
```

---

## 0. The one rule: the language is the same, the environment is not

Measured today, `zyq consensus --engines zytw,zyjs` over the 661-file corpus:

```
661 files: 627 agree, 0 diverge, 34 with too few engines
did not run:  zyjs 34  ·  zytw 2
zyq reject --engines zyjs:  34 forms, 34 refused, 0 accepted
```

**Zero divergences.** Every one of the 34 files zyjs does not run is excluded by a
named rule in `zyquality/corpus.toml` with a reason, and every reason is
environmental — a shell, an ODBC driver, a real terminal, an ANSI-formatted
diagnostic. So: write Zymbol exactly as `interpreter/LLM.md` describes it. There is
no "browser dialect". `corpus.toml` is the marker of what is left; when it shrinks,
this document shrinks with it.

> **Do not trust the version-history comment at the top of `zymbol.js`.** Its
> "Parity re-measured 2026-08-09" block lists gaps that are all closed —
> permissive arity, MM-9 root constants at call depth ≥ 2, MM-11 leftover loop
> iterators, `mI'` identifiers, digit-by-digit float literals. Each was re-probed
> today against both engines and each now agrees. The comment is stale; the gate
> is not.

---

## 1. What is missing, and exactly what happens when you hit it

| Form | CLI (`zytw`) | `zyjs` | Verified behaviour |
| --- | --- | --- | --- |
| `</ ./sub.zy />` | runs the sub-script | **not lexed at all** | `error: undefined variable 'sub'` — a misleading message, not a "not supported" one |
| `<\ "cmd" \>` | real stdout+stderr | **stub** | `echo hola` → `"hola"`; `date +%Y` → the year; `%m %d %H %M %S %s` likewise; **anything else** → a 19-digit nanosecond-ish timestamp. `<\ "ls -la" \>` returns 19 characters where the CLI returns 1716 |
| `<# std/db` | ODBC | **absent** | hard `Runtime error: standard library module 'std/db' is not available in the web playground (requires ODBC)` |
| `<# std/io` | the real filesystem | **per-run in-memory VFS** | `read`/`write`/`append`/`exists`/`delete`/`list`/`mkdir` all work and agree with the CLI *within one run*; nothing reaches the disk, and the VFS dies with the run |
| `<# std/net` | reqwest | `fetch` | works. In a browser **CORS applies**; in Node it does not, but you need Node ≥ 18 for the global `fetch` |
| TUI operators | needs a real tty | **needs a `tuiContext` you supply** | see the paragraph below the table |
| `>>?` | the real terminal size | `tui.getSize()`, else `(24, 80)` | the CLI also answers `(24, 80)` with no tty, so these agree by default |
| `><` | process argv | whatever `cliArgs` you pass | `tests/run_one.mjs` passes `[]`, so `><` is always empty there. Your own host passes what it likes (§3) |
| `zymbol fmt`, `repl`, `build`, `package`, `--vm` | yes | **no** | zyjs is one engine and a checker, nothing else. There is no bytecode path and no formatter in JavaScript |
| execution limits | none | **50 000 steps / 32 KB output / 100 000 infinite-loop iterations** | the browser-tab guard. A host that is a process must lift them — see §3 |

**The TUI operators are the one row that does not fit in a table**, because four of
them contain a `|`. The CLI needs a real terminal for `>>| { }`, `>>~`, `>>!`, `<<|`
and `<<|?`, and refuses without one. zyjs needs a `tuiContext` object that you
supply. With `tuiContext = null`:

- `>>| { }` runs its body as an ordinary block — no alternate screen, no raw mode;
- `>>~` degrades to plain output, text emitted with no positioning;
- `>>!` does nothing;
- **`<<|` returns `'\0'` at once instead of blocking**, so a key-driven menu loop
  spins forever. This is the single most likely way a working program will appear to
  hang under Node. See §4.

Two things that are *not* on this list, because they agree: `std/math`, `std/random`,
`std/json`, `std/term` and `std/time` are all present and match the Rust engines
(`std/time` included — `of`/`parts`/`format`/`add`/`diff`, the calendar ported by
hand rather than delegated to `Date`, which would roll an impossible date over
instead of refusing it).

### Diagnostics: what matches to the character, and what does not

- **Runtime errors match.** `Runtime error: array index out of bounds: index 99 for
  array of length 3` — byte-identical in both.
- **Semantic errors and warnings match.** Arity (`function 'f' expects 2 argument(s),
  but 1 were provided`), undefined variable, unused variable, the range-direction
  warning — same wording, same `= help:` line.
- **Parse errors do not match.** zyjs says `Expected RBRACKET, got ':'`; the CLI says
  `unexpected '[' at statement level` with a different help line. Error *counts* can
  differ too: one malformed string gave zyjs 1 error and the CLI 2, because their
  error recovery goes different distances.
- **Layout never matches.** The CLI prints a colourised block with a source excerpt,
  a caret and a file path; zyjs prints one line plus `--> line N`. This is the whole
  `ANSI_FORMAT` exclusion class (8 corpus files). Read `d.line` as a field; never
  parse the text.

---

## 2. The gotcha that is the language's, not the engine's

`{` and `}` inside a string literal open an interpolation. Writing JSON by hand needs
both escaped, in **every** engine:

```zymbol
d = J::decode("\{\"n\": 7, \"txt\": \"ok\"\}")   // ✓
d = J::decode("{\"n\": 7}")                       // ✗ invalid character in string interpolation
```

---

## 3. Running zyjs from Node

**Requirements:** Node ≥ 18 (global `fetch` for `std/net`, `DecompressionStream` for
`.zyp`); Node ≥ 20 recommended. ESM only. **No npm install, no bundler, no build
step** — `web/` has no `package.json` on purpose. `zymbol.js` touches no browser
global (no `document`, no `window`, no `localStorage`), so it imports cleanly into
Node as-is.

### The exports you need

| Export | What it is |
| --- | --- |
| `runZymbol(src, inputFn, onOutput, moduleResolver, filePath, tuiContext, cliArgs, opts)` | run a program |
| `checkSource(src, opts)` | `zymbol check` — `{ ast, diagnostics }`, no execution |
| `moduleAritiesFor(ast, resolver, filePath)` / `moduleOutSlotsFor(…)` | build the cross-module tables `checkSource` needs when the program imports |
| `Lexer`, `Parser`, `Interpreter` | the three stages, if you need them apart |
| `buildSymbolIndex(src)` | name → definitions, for editor hover |
| `STDLIB_ARITIES`, `codePointDisplayWidth`, `digitValue`, `digitBlockBase`, `decimalSeparator` | tables the tooling shares with the engine rather than copying |

### The eight arguments

1. **`src`** — the program text.
2. **`inputFn: () => string | null`** — one line per call, **synchronous**, and
   **`null` means EOF**. Returning `''` at the end instead of `null` makes `<< name`
   succeed where the CLI reports end of input — that is a divergence you introduced,
   not one the engine has. Read all of stdin up front: the callback cannot await a
   chunk that has not arrived.
3. **`onOutput: (s) => void`** — the program's output, in fragments. `>>` never adds a
   newline, so do not add one.
4. **`moduleResolver`** — see below. `null` if the program imports nothing but `std/`.
5. **`filePath`** — used for diagnostics and for the module cache's identity. Pass the
   absolute path.
6. **`tuiContext`** — `null` unless the program uses TUI operators (§4).
7. **`cliArgs: string[]`** — what `><` answers.
8. **`opts`** — `{ onError, maxSteps, maxBytes, maxInfiniteIter }`.

### Three contracts that bite

**`runZymbol` throws on a lex or parse error.** The lexer and parser run *before* its
`try`, so a syntax error escapes as a `ZyError` rather than coming back as
`{ failed: true }`. Verified:

```js
try { await runZymbol('x = [1,2', () => null, s => out += s); }
catch (e) { /* ZyError: Expected RBRACKET, got 'EOF' */ }
```

Either wrap the call, or — better, and what `tests/run_one.mjs` does — call
`checkSource` first and refuse a program that does not pass. That also gives you the
CLI's split: a program that *printed* an error and a program that *was refused* are
otherwise indistinguishable to a shell.

**Pass `onError`, or diagnostics land in the program's output.** Without it,
`onError` defaults to `onOutput` — right for the playground, which has one panel, and
wrong for a process. Mixing the two streams was ~63 of the 91 divergences the
JavaScript engine used to be blamed for.

**Lift the limits, or long-but-finite programs die.** The defaults exist to stop a
browser tab locking up and the CLI has no equivalent. Verified: a 100 000-iteration
loop returns `{ failed: true, message: "Execution limit reached (50 000 steps) —
infinite loop?" }` with the defaults and `5000050000` with the limits lifted.

```js
{ onError: s => process.stderr.write(s),
  maxSteps: Infinity, maxBytes: Infinity, maxInfiniteIter: Infinity }
```

(Inside a `>>| { }` block the engine lifts them itself and restores both the ceilings
*and* the counters afterwards, so a TUI program's work does not count against the
budget outside the block.)

### The module resolver

`(importPath) => null | { src, resolver, resolvedPath, displayPath }` — sync or
async. **The `resolver` field is the point:** it is the child resolver rooted at the
imported file's *own* directory, and returning a bare string instead means every
nested import resolves against the entry file. `resolvedPath` is the module cache's
key, so two spellings of the same file must produce the same string or the module
loads twice and its state splits.

### A complete, verified host

```js
#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
import { readFileSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { runZymbol, checkSource, moduleAritiesFor, moduleOutSlotsFor, Lexer, Parser }
  from './web/src/zymbol/zymbol.js';

const [file, ...argv] = process.argv.slice(2);
const abs = resolve(file);
const src = readFileSync(abs, 'utf8');

const makeResolver = (baseDir) => (spec) => {
  const full = resolve(baseDir, spec.endsWith('.zy') ? spec : `${spec}.zy`);
  try {
    return { src: readFileSync(full, 'utf8'),
             resolver: makeResolver(dirname(full)),
             resolvedPath: full,
             displayPath: relative(process.cwd(), full) };
  } catch { return null; }
};
const resolver = makeResolver(dirname(abs));

// stdin up front — inputFn is synchronous. Empty input is no lines at all: a
// trailing newline must not become one extra empty line.
let lines = [], cur = 0;
if (!process.stdin.isTTY) {
  let buf = ''; for await (const c of process.stdin) buf += c;
  lines = buf === '' ? [] : buf.split('\n');
  if (lines.at(-1) === '') lines.pop();
}
const inputFn = () => (cur < lines.length ? lines[cur++] : null);

// Static check first: this is what keeps "refused" and "printed an error" apart,
// and it is the only path that does not throw on a syntax error.
let arities = new Map(), outSlots = new Map();
try {
  const ast = new Parser(new Lexer(src).tokenize()).parse();
  arities  = await moduleAritiesFor(ast, resolver, abs);
  outSlots = await moduleOutSlotsFor(ast, resolver, abs);
} catch { /* reported by checkSource below */ }

const fmt = (sev, d) => {
  const [head, ...rest] = String(d.message).split('\n');
  let s = `${sev}: ${head}\n`;
  if (d.line != null) s += `  --> line ${d.line}\n`;
  for (const l of rest) s += `  ${l}\n`;
  return s;
};

const { diagnostics } = checkSource(src, { moduleArities: arities, moduleOutSlots: outSlots });
for (const d of diagnostics.filter(d => d.severity === 'warning')) process.stderr.write(fmt('warning', d));
const errors = diagnostics.filter(d => d.severity === 'error');
if (errors.length) { for (const d of errors) process.stderr.write(fmt('error', d)); process.exit(1); }

const r = await runZymbol(
  src, inputFn,
  s => process.stdout.write(s),
  resolver, abs,
  null,          // tuiContext — see §4
  argv,          // ><
  { onError: s => process.stderr.write(s),
    maxSteps: Infinity, maxBytes: Infinity, maxInfiniteIter: Infinity },
);

if (r.failed) process.exit(1);
// A top-level `<~ n` is the program's exit status.
if (typeof r.exitCode === 'number' && r.exitCode !== 0) process.exit(r.exitCode);
```

```
$ echo "Ana" | node zyrun.mjs main.zy uno dos
hola Ana, add=5 PI=3.14 args=[uno, dos]
$ echo $?        # from a top-level `<~ 3`
3
```

`tests/run_one.mjs` is this host, fully commented, and is what
`zyquality/engines.toml` invokes as the `zyjs` engine. Read it before writing your
own; every comment in it marks a divergence somebody already paid for.

---

## 4. The TUI context

The engine calls exactly these, and nothing else:

| Member | When | If absent |
| --- | --- | --- |
| `active` (bool) | every `>>` — `true` routes output to `print()` instead of `onOutput` | keep it `false` in a process: ordinary output belongs on stdout |
| `aborted` (bool) | checked every step | set it `true` to stop a runaway program with `Program stopped.` |
| `enter()` / `leave()` | entering/leaving a TUI block (`>>` + pipe + `{ }`) | — |
| `clear()` | `>>!` | nothing happens |
| `printAt(row, col, text, bks, fg, bg)` | `>>~` | text is emitted unpositioned |
| `print(text)` | `>>` while `active` | — |
| `getSize()` → `[rows, cols]` | `>>?` | `(24, 80)` |
| `readKey()` → `Promise<string>` | blocking key read | **returns `'\0'` at once — an input loop spins** |
| `pollKey()` → `string` | polling key read | `'\0'` |
| `_sleepCancel` (written by the engine) | `@~ ms` | set to a canceller during the sleep; leave the slot alone unless you want to interrupt it |

Arrow keys arrive **already decoded** as the single characters `'↑' '↓' '←' '→'`;
Enter is `'\n'`, Escape is code point 27. Do not hand `readKey` a raw escape
sequence.

This is where Node beats the CLI: `zymbol run` needs a real terminal and dies with
`failed to enable raw mode: No such device or address (os error 6)` under a pipe,
while zyjs with an ANSI context writes the escape sequences to a pipe and runs a
whole TUI program headless. `tests/run_one.mjs`'s `ansiTui` is the reference —
with one caveat worth knowing: **its colour mapping is an approximation.** It emits
`\x1b[${30 + fg}m`, while the Rust engine uses crossterm's `Color::AnsiValue(n)`,
i.e. `\x1b[38;5;{n}m`. They agree only for `fg`/`bg` in 0–7. The `manual/tui/` corpus
files are excluded for zyjs, so the gate does not catch this; if you need faithful
colour, write `38;5;{n}` in your own context.

---

## 5. Running a `.zyp` package from Node

`src/zymbol/zyp.js` reads the ZIP by hand (central directory,
`DecompressionStream('deflate-raw')`) and `src/zymbol/module-resolver.js` turns the
extracted file map into a resolver. Both work unmodified in Node ≥ 18.

```js
import { readZyp }     from './web/src/zymbol/zyp.js';
import { makeResolver } from './web/src/zymbol/module-resolver.js';
import { runZymbol }   from './web/src/zymbol/zymbol.js';

const buf = readFileSync(process.argv[2]);
const { manifest, files } = await readZyp(
  buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

// manifest.scripts — plural, and paths are already src-relative:
//   [{ name: 'go', path: 'go.zy', default: true }, { name: '囲碁', path: '囲碁.zy' }, …]
// files — Map('go.zy' → src, '核/盤.zy' → src, …), no 'src/' prefix.
const entry = manifest.scripts.find(s => s.default) ?? manifest.scripts[0];
const dir   = entry.path.includes('/') ? entry.path.slice(0, entry.path.lastIndexOf('/')) : '';

await runZymbol(
  files.get(entry.path), () => null, s => process.stdout.write(s),
  makeResolver(p => files.get(p), dir), entry.path,
  myTuiContext, [],
  { onError: s => process.stderr.write(s),
    maxSteps: Infinity, maxBytes: Infinity, maxInfiniteIter: Infinity });
```

Verified against `examples/games/classic/go.zyp`: all four language entry points are
listed, the 8-file source tree resolves, and the game's opening menu renders. It then
loops forever — because `tuiContext` was `null` and `<<|` never blocks. That is §4,
not a bug.

`manifest.package.mode` (`"vm"` for the games) is a *hint for the CLI*. zyjs has one
engine; ignore it.

---

## 6. Static checking without running — a linter in six lines

```js
const { diagnostics } = checkSource(readFileSync(f, 'utf8'));
for (const d of diagnostics)
  console.log(`${d.severity} ${d.code} line ${d.line}: ${d.message}`);
```

`d.code` is stable (`E_PARSE`, `E_VAR`, `E_FUNC`, `E_CONST`, `W_UNUSED`, `E013`, …);
`d.message` and its `= help:` continuation lines are not a parsing surface. A program
that imports needs `moduleArities`/`moduleOutSlots` passed in, or cross-module calls
go unchecked — `checkSource` has no resolver of its own by design.

---

## 7. Testing what you wrote

ZyQuality is the point of record for all three engines; `web/`'s scripts are wrappers
over it (see the root `CLAUDE.md`).

```bash
# from zyquality/ — is zyjs still the same language as Rust?
./zyq consensus --engines zytw,zyjs
./zyq reject --engines zyjs
./zyq show corpus/path/x.zy          # what each engine said about one file

# from web/ — the same question through this repo's wrapper, plus what web/ owns
node tests/test_runner.mjs
node tests/test_runner.mjs --dir examples
node tests/test_check.mjs            # the checker against `zymbol check`
node tests/test_zyp.mjs              # .zyp reader + module resolver
node tests/test_catalog.mjs          # example pool integrity
node tests/test_markdown.mjs         # every page's Markdown twin
node tests/test_licenses.mjs         # AGPL on sources, CC BY-SA on manuals
node tests/test_agents.mjs           # the published skill, and every ```zymbol block in it
```

A file zyjs genuinely cannot run gets a rule in `zyquality/corpus.toml` — with a
`reason`, which is required. **Never** add one to make a red gate green: an exclusion
whose reason nobody wrote down is indistinguishable from a bug somebody hid.

---

## 8. Editing the engine itself

- **No build step.** Edit `src/zymbol/zymbol.js` and reload the browser, or re-run
  the Node host. Do not introduce a bundler.
- **Adding an operator touches three places**, in this order: the lexer's `$` / `@` /
  `twoMap` block, an AST-shape case in the parser, and a `case` in `execStmt` or
  `evalCollectionOp` / `eval`.
- **It is a mirror.** The Rust tree-walker is the original; a behaviour question is
  answered by reading `crates/zymbol-interpreter/` and by running `zyq consensus`,
  not by deciding here.
- **Licence header.** A new `.js`/`.mjs` under `src/`, `worker/` or `tests/` needs
  `// SPDX-License-Identifier: AGPL-3.0-only` as its first line — `zymbol.js` is a
  derivative of the AGPL Rust engine, and `tests/test_licenses.mjs` enforces it.
- **Editing a page means editing its Markdown twin in the same commit**
  (`install.html` ↔ `install.md`). `tests/test_markdown.mjs` fails otherwise.
- **The internal architecture** (tokens as plain objects, the `Env` linked-list scope,
  the fully-`async` interpreter, `moduleAliases` kept out of the variable environment)
  is in the root `CLAUDE.md` under "Web Interpreter".

---

## 9. Reference program

Runs under `node tests/run_one.mjs` and under `zymbol run` with **byte-identical
output** — verified. The only difference in the two transcripts is the warning's
location line (`--> line 14` vs `--> ref.zy:14:6`), which is §1's `ANSI_FORMAT`.

```zymbol
<# std/math => M
<# std/json => J
<# std/io   => io

MAX := 12

clasificar(n) {
    ? n % 15 == 0 { <~ "FizzBuzz" }
    _? n % 3 == 0 { <~ "Fizz" }
    _? n % 5 == 0 { <~ "Buzz" }
    <~ n
}

@ _i:1..MAX { >> clasificar(_i) " " }
>> ¶

nums = [3, 1, 4, 1, 5]
>> (nums$^+) " " (nums$> (x -> x * 2)) " " (nums$< (0, (a,x) -> a + x)) ¶
>> "raiz=" M::sqrt(2.0) ¶

d = J::decode("\{\"n\": 7, \"txt\": \"ok\"\}")
>> "json: " d.n " " d.txt ¶

io::write("/tmp/nota.txt", "linea 1\n")
io::append("/tmp/nota.txt", "linea 2")
>> io::read("/tmp/nota.txt") ¶

!? { _v = nums[99] } :! ##Index { >> "fuera de rango" ¶ }
```

```
1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz
[1, 1, 3, 4, 5] [6, 2, 8, 2, 10] 14
raiz=1.4142135623730951
json: 7 ok
linea 1
linea 2
fuera de rango
```

Under the CLI that `/tmp/nota.txt` is a real file. Under zyjs it never existed —
which is the whole of §1 in one line.
