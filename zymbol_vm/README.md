# zymbol_vm/ — the web's next engine, built apart

**Status: under evaluation (branch `Zymbol_VM.js`, opened 2026-10-29).** Nothing here
is published, and nothing outside this directory was changed to build it.

`zymbol_vm.js` is a JavaScript port of the Rust register VM (`interpreter/crates/zymbol-vm`):
the same 172 instructions, the same opcode numbers, the same messages, the same `--count`.
The intent, stated by the author, is that it becomes **the only engine of the web** —
`src/zymbol/zymbol.js`, the tree-walker the playground runs today, is to go once this one
can replace it — **if, and only if, it proves viable**. Whether it does is recorded, with
the measurements, in [`VIABILITY.md`](VIABILITY.md).

## Why a separate directory

The author asked for a fully separate environment: a copy of the playground in a folder of
its own, to be moved into place if it works. So:

- this directory only **adds** files — the branch can take every later change of `main`
  without a conflict, and the current playground at the root keeps running beside the new
  one for comparison;
- the **code** is copied (`playground.html`, `src/playground/`, `src/css/playground.css`,
  `src/i18n/`, `src/zymbol/`), as of `v0.0.11` at `8a8de5a`; the **data** is the site's own,
  read one level up — the example catalog, the interface strings, the images and the fonts.
  The copy differs from the original only by a `../` in front of those paths: three data
  URLs (`catalog.js` ×2, `i18n.js`), the pIqaD fonts in `playground.css`, and the page's
  links and icons. Moving this into place is taking that `../` away again;
- `src/zymbol/zymbol.js` is here as the raw material the new engine takes from — its
  lexer, parser and checker will be needed — not as a second engine to keep.

The worktree's own playground (`/playground.html`) and this one (`/zymbol_vm/playground.html`)
can be served side by side from the worktree root, e.g. `python3 -m http.server`.
Today the copy still runs on `zymbol.js`: the VM has no compiler of its own yet.

## Layout

| Path | What it is |
|---|---|
| `src/zymbol/vm/machine.js` | The machine: Rust's `VM::exec`, instruction for instruction |
| `src/zymbol/vm/values.js` | Values, the reference count, printing, naming, comparing |
| `src/zymbol/vm/format.js` | `#,` `#^` `#.` `#!` with Rust's exact rounding |
| `src/zymbol/vm/digits.js` | The 69 digit scripts |
| `src/zymbol/vm/program.js` | A CompiledProgram into the machine's form |
| `src/zymbol/vm/isa.js` | **Generated** from Rust's `Instruction` enum — never edited by hand |
| `tools/gen_isa.mjs` | Writes `isa.js`; `--check` verifies it and every opcode label in `machine.js` |
| `tools/zyb_dump/` | Rust: a stand-in for `zymbol compile` (roadmap § 3.3), see below |
| `tools/isa_usage.mjs` | Which instructions a body of programs uses |
| `tests/run_zyb.mjs` | Run one compiled program, with the Rust CLI's output contract |
| `tests/probe.mjs` | Grade the machine against the Rust VM on the whole corpus |
| `tests/bench.mjs` | Elapsed time against the native VM and `zymbol.js` |
| `tests/bench_go.mjs` | GO's fixed-seed self-play on the three engines: same game, same `--count`, time |
| `tests/suspend.mjs` | `<<` and `@~` that have to wait, and time slices, as in a browser |

## How to run it

From this directory, with `interpreter/` and `zyquality/` checked out beside the worktree
and `zymbol` built with `--features db`:

```bash
(cd tools/zyb_dump && cargo build --release)     # once; touches nothing in interpreter/
node tools/gen_isa.mjs --check                   # isa.js and machine.js against Rust's enum
node tests/probe.mjs                             # the corpus, machine against machine
node tests/bench.mjs --runs 3 --no-zyjs          # speed; drop --no-zyjs to time zymbol.js (minutes)
tools/zyb_dump/target/release/zyb_dump x.zy -o x.json && node tests/run_zyb.mjs x.json --count
```

## The stand-in for `zymbol compile`

Until the VM has a compiler of its own, it runs what the Rust compiler produces.
`tools/zyb_dump` builds against the sibling `interpreter/` checkout (path dependencies, its
own `target/`), makes the call `zymbol run` makes — `Compiler::compile_named`, with the
`http` and `db` features the reference binary has — and writes the CompiledProgram as JSON.
JSON has no infinity and no NaN, so those three floats are written as Rust spells them.
The day `zymbol compile` exists, this directory goes.

## Rules this code keeps

- **The opcode is Rust's.** `case 17: // NegInt` is the literal V8 needs for a jump table,
  and `gen_isa.mjs --check` fails on any label that no longer names its Rust variant.
- **Clone is `retain`, drop is `release`.** The count mirrors Rust's `Rc`; `copied=` from
  `--count` is how a missed one shows, so it is compared on every file.
- **No `await` in the loop.** The machine stops by returning — for a line of input, a sleep,
  the end of a time slice — and `resume` goes on.
- AGPL-3.0-only, as `zymbol.js`: it is a port of AGPL code.
