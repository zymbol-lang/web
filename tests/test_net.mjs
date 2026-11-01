#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// A time limit on a `std/net` request in the browser engine (src/zymbol/zymbol.js).
//
//   node tests/test_net.mjs
//
// ZethyCLI G1, decided by the author on 2026-10-24: `net::get(url, headers,
// seconds)`, the same after the headers of `post` and `post_json`, and
// `net::head(url, seconds)` — and, for a request that gives none, the run's own,
// `net::timeout(seconds)`, which returns the one it replaces. `0` is no limit.
// Against a server that accepts and never answers, the program comes back
// within the limit with a soft `##Network` in the words of
// `zymbol_common::net`, and goes on to its next line; before, `fetch` waited past
// two minutes. A server that answers inside the limit still gives its body. The
// Rust engines are held to the same by `zymbol-cli/tests/cli_net_timeout.rs`.
//
// Plain Node, no npm dependency (web/ has no package.json — see CLAUDE.md).

import net from 'node:net';
import http from 'node:http';

const { runZymbol } = await import('../src/zymbol/zymbol.js');

let failures = 0;
function check(label, ok, detail = '') {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}${ok ? '' : ' :: ' + detail}`);
  if (!ok) failures++;
}
function section(n) { console.log(`\n${n}`); }

async function run(src) {
  let out = '';
  const r = await runZymbol(src, async () => null, s => { out += s; }, null, 'test.zy');
  return { out: out.trim(), failed: !!(r && r.failed) };
}
const listen = server => new Promise(ok => server.listen(0, '127.0.0.1', () => ok(server.address().port)));

// Accepts every connection and never answers.
const held = [];
const mute = net.createServer(sock => held.push(sock));
const mutePort = await listen(mute);
// Answers `hola` at once.
const quick = http.createServer((req, res) => res.end('hola'));
const quickPort = await listen(quick);

section('a mute server gives a soft ##Network within the limit');
let started = Date.now();
let r = await run(`<# std/net => net
r = net::get("http://127.0.0.1:${mutePort}/", [], 1)
>> r$! " " r ¶
p = net::post_json("http://127.0.0.1:${mutePort}/", "[]", [("x-a", "b")], 0.5)
>> p$! " " p ¶
>> net::head("http://127.0.0.1:${mutePort}/", 1) ¶
>> "sigue" ¶
`);
const took = (Date.now() - started) / 1000;
check('get gives the timeout as a value', r.out.includes('#1 ##Network(timeout: no answer within 1 s)'), r.out);
check('post_json, after its headers', r.out.includes('#1 ##Network(timeout: no answer within 0.5 s)'), r.out);
check('head is #0, and the program goes on', r.out.includes('#0\nsigue') && !r.failed, r.out);
check('it came back within the limits', took < 12, `${took} s`);

section('a server inside the limit still answers');
r = await run(`<# std/net => net
>> net::get("http://127.0.0.1:${quickPort}/", [], 5) ¶
>> net::head("http://127.0.0.1:${quickPort}/", 5) ¶
>> net::get("http://127.0.0.1:${quickPort}/") ¶
`);
check('the body, #1, and the body without a limit', r.out === 'hola\n#1\nhola', r.out);

section('the run\'s own limit, and a call that overrides it');
started = Date.now();
r = await run(`<# std/net => net
>> net::timeout(1) ¶
>> net::get("http://127.0.0.1:${mutePort}/") ¶
>> net::get("http://127.0.0.1:${quickPort}/", [], 0) ¶
>> net::head("http://127.0.0.1:${mutePort}/") ¶
>> net::timeout(2.5) " " net::timeout(0) " " net::timeout(0) ¶
`);
check('timeout hands back what it replaced, and every request without its own takes it',
      r.out === '0\n##Network(timeout: no answer within 1 s)\nhola\n#0\n1 2.5 0', r.out);
check('it came back within the limit', (Date.now() - started) / 1000 < 10, '');
r = await run(`<# std/net => net\n>> net::timeout(0) ¶\n`);
check('a run starts without a limit, whatever the run before set', r.out === '0', r.out);

section('a limit that is not a number of seconds, 0 or more, is refused');
for (const v of ['-1', '"5"', '#1']) {
  r = await run(`<# std/net => net\nr = net::get("http://127.0.0.1:${quickPort}/", [], ${v})\n>> r ¶\n`);
  check(`${v} is refused`, r.failed && r.out.includes('net::get: the time limit must be a number of seconds, 0 or more'), r.out);
}
r = await run(`<# std/net => net\n>> net::timeout(-2) ¶\n`);
check('timeout(-2) is refused', r.failed && r.out.includes('net::timeout: the time limit must be a number of seconds, 0 or more'), r.out);

for (const s of held) s.destroy();
mute.close();
quick.close();
console.log(failures === 0 ? '\nAll net tests passed' : `\n${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
