# zymbol_vm/ — the web's next engine, built apart

**Status: the playground's default engine from v0.0.11 (decided 2026-10-30), on branch
`Zymbol_VM.js`, opened 2026-10-29, until it is merged for the release.**

`zymbol_vm.js` is a JavaScript port of the Rust register VM (`interpreter/crates/zymbol-vm`):
the same 172 instructions, the same opcode numbers, the same messages, the same `--count` —
and of its compiler (`interpreter/crates/zymbol-compiler`), which builds, for every program
of the corpus, the example pool and the applications, the bytecode the Rust compiler builds.
The intent, stated by the author, is that it becomes **the only engine of the web**; until
then the tree-walker, `src/zymbol/zymbol.js`, stays selectable. The evidence that it is
viable is in [`VIABILITY.md`](VIABILITY.md).

## Where it lives now

It was built apart, in a copy of the playground inside this directory, as the author asked.
On 2026-10-30 the author decided that it ships in **v0.0.11 as the playground's default
engine**, with the tree-walker one click away, entering the release by merging this branch.
So the engine moved to the site's own `src/zymbol/` (`zymbol_vm.js`, `vm/`), the copy of the
playground was removed, and the site's playground gained the VM · TW picker. What stays here
is the workbench: the tools, the tests that hold the engine to Rust, and the three documents.
`src/zymbol/zymbol.js` is one file for both engines — the parser and checker the VM uses are
its own.

## Layout

Engine paths are relative to the site's root (`../`), tools and tests to this directory.

| Path | What it is |
|---|---|
| `src/zymbol/zymbol_vm.js` | The engine's face: `compileSource`, `runAsync`, and `runZymbolVM` with `runZymbol`'s signature |
| `src/zymbol/vm/rustast.js` | zymbol.js's AST into the shape of zymbol-ast's |
| `src/zymbol/vm/compiler.js` | The compiler: zymbol-compiler, function for function |
| `src/zymbol/vm/lastuse.js` | zymbol-semantic's last-use analysis, which the compiler calls |
| `src/zymbol/vm/modhost.js` | Rust's path rules for modules, and reading one |
| `src/zymbol/vm/stdlib.js` | std/json, io, net, time, term: zymbol.js's, reached through a value bridge |
| `src/zymbol/vm/machine.js` | The machine: Rust's `VM::exec`, instruction for instruction |
| `src/zymbol/vm/values.js` | Values, the reference count, printing, naming, comparing |
| `src/zymbol/vm/format.js` | `#,` `#^` `#.` `#!` with Rust's exact rounding |
| `src/zymbol/vm/digits.js` | The 69 digit scripts |
| `src/zymbol/vm/program.js` | A CompiledProgram into the machine's form |
| `src/zymbol/vm/isa.js` | **Generated** from Rust's `Instruction` enum — never edited by hand |
| `tools/gen_isa.mjs` | Writes `isa.js`; `--check` verifies it and every opcode label in `machine.js` |
| `tools/zyb_dump/` | Rust: the reference compiler's output, as JSON (`--ast`: its parser's tree) |
| `tools/rast.mjs` | Reads `zyb_dump --ast` back into objects |
| `tools/serve.mjs` | Serves the worktree on the local network, caching off |
| `tests/ast_diff.mjs` | rustast.js against Rust's parser, node for node |
| `tests/compile_diff.mjs` | compiler.js against Rust's compiler, instruction for instruction |
| `../tests/run_one_vm.mjs` | The engine on the command line, as the page has it: zyquality's `zyjsvm` |
| `tests/browser_run.mjs` | The playground in headless Chrome: run examples, compare the two engines |
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
node tests/ast_diff.mjs                          # the parser's tree against Rust's
node tests/compile_diff.mjs                      # the compiler against Rust's (also: ../examples, ../../GO …)
node ../tests/run_one_vm.mjs x.zy                # compile and run, as the playground does
node tools/serve.mjs                             # then tests/browser_run.mjs --compare --all
```

The gate, with zymbol_vm.js in the browser engine's place:

```bash
cd ../../zyquality
./zyq consensus                                   # zytw, zyvm, zyjs (TW) and zyjsvm (this engine)
ZYJSVM_HARNESS=$PWD/../Zymbol_VM.js/tests/run_one_vm.mjs ./zyq expect --engines zyjsvm   # before the merge
```

## The reference compiler: `zyb_dump`

zymbol_vm.js compiles on its own; `tools/zyb_dump` is what it is measured against.
It builds against the sibling `interpreter/` checkout (path dependencies, its
own `target/`), makes the call `zymbol run` makes — `Compiler::compile_named`, with the
`http` and `db` features the reference binary has — and writes the CompiledProgram as JSON.
JSON has no infinity and no NaN, so those three floats are written as Rust spells them.
The two Rust defects the port found (HALLAZGOS.md, BUG-VMJS-004 and -005) are corrected
in both compilers since v0.0.11, so the comparison needs no mode of its own.

## Rules this code keeps

- **The opcode is Rust's.** `case 17: // NegInt` is the literal V8 needs for a jump table,
  and `gen_isa.mjs --check` fails on any label that no longer names its Rust variant.
- **Clone is `retain`, drop is `release`.** The count mirrors Rust's `Rc`; `copied=` from
  `--count` is how a missed one shows, so it is compared on every file.
- **No `await` in the loop.** The machine stops by returning — for a line of input, a sleep,
  the end of a time slice — and `resume` goes on.
- AGPL-3.0-only, as `zymbol.js`: it is a port of AGPL code.
