#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// Regression tests for `<\ … \>` in the browser engine (src/zymbol/zymbol.js).
//
//   node tests/test_shell.mjs
//
// The browser has no shell. What it has is a short list of stand-ins, each for a
// command whose answer the page can give honestly: the clock, a literal `echo`,
// and the entropy a seed is built from. Anything else is refused.
//
// It used to answer every other command with a random nine-digit number
// (BUG-GOL-014, GoL/HALLAZGOS.md): `<\ "exit 3" \>`, `whoami`, `cat file` and
// eight `sqlite3 … 'SELECT …'` in the corpus and the example pool each got one,
// and printed or parsed it as if the command had said it. So both halves are
// tested: the stand-ins the published games seed from must keep answering, and
// a command with no stand-in must fail rather than answer.
//
// Plain Node, no npm dependency (web/ has no package.json — see CLAUDE.md).

const { runZymbol } = await import('../src/zymbol/zymbol.js');

let failures = 0;
function check(label, ok, detail = '') {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}${ok ? '' : ' :: ' + detail}`);
  if (!ok) failures++;
}
function section(n) { console.log(`\n${n}`); }

// runZymbol reports runtime failures through onOutput rather than throwing, so a
// run is judged by its transcript and by the result's `failed`.
async function run(src) {
  let out = '';
  const r = await runZymbol(src, async () => null, s => { out += s; }, null, 'test.zy');
  return { out: out.trim(), failed: !!(r && r.failed) };
}
const shell = cmd => run(`r = <\\ ${cmd} \\>\n>> r ¶\n`);

// ─── the stand-ins ────────────────────────────────────────────────────────────
section('stand-ins that must keep answering');

const today = new Date();
const pad = n => String(n).padStart(2, '0');
const iso = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

let r = await shell('"date +%Y-%m-%d"');
check('date +%Y-%m-%d gives the whole date, not the year alone', r.out === iso, r.out);
r = await shell('"date +%F"');
check('date +%F is the same date', r.out === iso, r.out);
r = await shell('"date +%N"');
check('date +%N is nine digits within the second', /^\d{9}$/.test(r.out), r.out);
r = await shell('"date +%s%6N"');
check('date +%s%6N is epoch seconds and six digits, inside the integer range',
      /^\d{16}$/.test(r.out) && Number(r.out) <= Number.MAX_SAFE_INTEGER, r.out);
r = await shell('"echo $$"');
check('echo $$ is a plausible pid', /^\d+$/.test(r.out) && Number(r.out) < 4194305, r.out);
// The exact form the published games seed from (GO, Serpiente, Chaturanga).
r = await shell(`"od -An -N2 -tu2 /dev/urandom | tr -d ' \\n'"`);
check('od … /dev/urandom | tr -d is a uint16', /^\d+$/.test(r.out) && Number(r.out) < 65536, r.out);
r = await shell('"echo hola mundo"');
check('echo of literal words', r.out === 'hola mundo', r.out);

// A seed built as the games build it must survive the arithmetic after it.
r = await run(`
_n = <\\ "date +%N" \\>
_p = <\\ "echo $$" \\>
_u = <\\ "od -An -N2 -tu2 /dev/urandom | tr -d ' \\n'" \\>
s = (#|_n| + #|_p| * 31337 + #|_u| * 65537) % 2147483647
>> (s >= 0) ¶
`);
check('a seed built from the three stand-ins stays in range', r.out === '#1' && !r.failed, r.out);

// ─── everything else is refused ───────────────────────────────────────────────
section('commands with no stand-in are refused');

for (const cmd of ['"exit 3"', '"whoami"', '"cat datos.txt"',
                   `"sqlite3 x.db 'SELECT 1;'"`, `"echo 'scale=2; 355/113' | bc"`,
                   '"date +%Q"', '"true"']) {
  r = await shell(cmd);
  check(`${cmd} fails instead of answering`,
        r.failed && r.out.includes('a shell command runs as a process, and the browser has none'),
        r.out);
}

r = await shell('"exit 3"');
check('the message names the command without its quotes',
      r.out.includes("cannot run 'exit 3'"), r.out);

console.log(failures === 0 ? '\nAll shell tests passed' : `\n${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
