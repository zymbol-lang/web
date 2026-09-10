#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// Regression tests for the browser engine's execution limits (src/zymbol/zymbol.js).
//
//   node tests/test_limits.mjs
//
// The playground runs untrusted code in the user's own tab, so the engine caps steps and
// output — and exempts `>>| { }`, because a TUI program is interactive and legitimately
// long-running. The exemption used to raise the ceilings (`maxSteps`, `maxBytes`) without
// touching the monotonic counters underneath them, so every step spent inside the block
// stayed on the tab. The first statement after the block, however trivial, then blew the
// restored limit instantly. Playing GO in the browser never failed because a game never
// leaves its block; `対局.zy` returning normally (a `<~ 0` six lines after `>>| {`) did.
//
// So the boundary worth protecting has two sides, and both are tested here: work inside the
// block must not count against the budget outside it, and the budget outside must still be
// enforced. A fix that only satisfied the first would silently disarm the runaway-loop guard
// for every program containing a TUI block.
//
// Plain Node, no npm dependency (web/ has no package.json — see CLAUDE.md).

const { runZymbol } = await import('../src/zymbol/zymbol.js');

let failures = 0;
function check(label, ok, detail = '') {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}${ok ? '' : ' :: ' + detail}`);
  if (!ok) failures++;
}
function section(n) { console.log(`\n${n}`); }

// A TUI context inert enough that nothing here depends on terminal behaviour: the engine
// only needs `enter`/`leave` to bracket the block and `print` to swallow screen writes.
const fakeTui = () => ({
  active: false,
  aborted: false,
  enter() { this.active = true; },
  leave() { this.active = false; },
  clear() {},
  print() {},
  printAt() {},
  getSize() { return [24, 80]; },
  pollKey() { return '\0'; },
  async readKey() { return 'q'; },
  _sleepCancel: null,
});

// runZymbol reports runtime failures through onOutput rather than throwing, so a run is
// judged by its transcript.
async function run(src, opts, { tui = true } = {}) {
  let out = '';
  await runZymbol(src, async () => null, s => { out += s; },
                  null, 'test.zy', tui ? fakeTui() : null, [], opts);
  return out;
}
// Which counter tripped matters: a test meaning to exercise the output cap that actually
// trips the step cap proves nothing about the output cap.
const hitSteps  = out => out.includes('Execution limit reached');
const hitOutput = out => out.includes('Output limit reached');

// ─── the exemption covers the block, and stops at its edge ────────────────────
section('TUI block step exemption');

// The original repro: 2.5M steps under the exemption, then one trivial print outside it.
const afterBlock = await run(`
i = 0
>>| {
    @ i < 2500000 {
        i = i + 1
    }
}
>> "done: " i ¶
`, { maxSteps: 2_000_000, maxBytes: 2_000_000 });
check('a statement after a heavy TUI block still runs',
      afterBlock.includes('done: 2500000'), afterBlock.trim());

// The same program under the playground's *default* ceiling. The bug was never specific to
// the raised `.zyp` limits — even a generous ceiling is a few seconds of any TUI.
const afterBlockDefault = await run(`
i = 0
>>| {
    @ i < 200000 {
        i = i + 1
    }
}
>> "done" ¶
`, {});
check('and under the default ceiling too',
      afterBlockDefault.includes('done'), afterBlockDefault.trim());

// Nesting: each block snapshots the counters as it finds them, so unwinding two of them
// must land back where the outermost started rather than at zero or at the inner total.
const nested = await run(`
i = 0
>>| {
    >>| {
        @ i < 100000 { i = i + 1 }
    }
    @ i < 200000 { i = i + 1 }
}
>> "done: " i ¶
`, {});
check('nested TUI blocks unwind to the outer budget',
      nested.includes('done: 200000'), nested.trim());

// A block left through an error unwinds via `finally`, so the counters must be restored
// there too — otherwise a caught failure poisons everything downstream.
const viaThrow = await run(`
!? {
    >>| {
        i = 0
        @ i < 200000 { i = i + 1 }
        x = 10 / 0
    }
} :! {
    >> "caught" ¶
}
>> "recovered" ¶
`, {});
check('a TUI block left by an error still restores the counters',
      viaThrow.includes('recovered'), viaThrow.trim());

// ─── the limit outside the block is still armed ───────────────────────────────
section('limits outside the exemption');

const runaway = await run(`
i = 0
@ i < 2500000 {
    i = i + 1
}
>> "unreachable" ¶
`, { maxSteps: 200_000 });
check('a runaway loop outside any TUI block still trips the limit',
      hitSteps(runaway), runaway.trim());

// Restoring the snapshot rather than zeroing it is what keeps this true: pre-block work is
// still on the tab afterwards, so a TUI block cannot be used to buy a fresh budget.
const budgetReset = await run(`
i = 0
@ i < 150000 { i = i + 1 }
>>| {
    j = 0
    @ j < 500000 { j = j + 1 }
}
k = 0
@ k < 150000 { k = k + 1 }
>> "unreachable" ¶
`, { maxSteps: 200_000 });
check('a TUI block does not reset the budget spent before it',
      hitSteps(budgetReset), budgetReset.trim());

// ─── output accounting follows the same rule ──────────────────────────────────
section('TUI block output exemption');

// Inside the block, `emit` routes to the screen instead of the output pane, but it was
// still charging `outputBytes` — the same poisoning, one counter over. `maxSteps` is held
// far out of reach in both runs below so that only the output cap can be what trips.
const afterOutput = await run(`
>>| {
    i = 0
    @ i < 5000 {
        >> "0123456789" ¶
        i = i + 1
    }
}
>> "done" ¶
`, { maxBytes: 32_000, maxSteps: 5_000_000 });
check('a print after a chatty TUI block still runs',
      afterOutput.includes('done'), afterOutput.trim());

const outputRunaway = await run(`
i = 0
@ i < 5000 {
    >> "0123456789" ¶
    i = i + 1
}
`, { maxBytes: 1_000, maxSteps: 5_000_000 });
check('output outside a TUI block is still capped',
      hitOutput(outputRunaway), outputRunaway.slice(-80));

// ─── the message names the limit that was actually configured ─────────────────
section('limit messages');

// These strings used to be hardcoded to the defaults, so a run at a raised ceiling
// reported the default instead and sent whoever was debugging it looking in the wrong place.
const stepMsg = await run('i = 0\n@ i < 2500000 { i = i + 1 }\n', { maxSteps: 123_000 });
check('the step message quotes the configured ceiling',
      stepMsg.includes('123 000 steps'), stepMsg.trim());

const byteMsg = await run('i = 0\n@ i < 5000 { >> "0123456789" ¶\n i = i + 1 }\n',
                          { maxBytes: 7_000, maxSteps: 5_000_000 });
check('the output message quotes the configured ceiling',
      byteMsg.includes('7 KB'), byteMsg.slice(-80));

console.log(failures === 0 ? '\nAll limit tests passed' : `\n${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
