#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// The two surfaces an agent can *act* through, as opposed to read:
//
//   the published skill   /.well-known/agent-skills/index.json + SKILL.md — what an agent
//                         loads to learn how to write Zymbol;
//   the browser tools     src/playground/webmcp.js — what an agent calls to run it.
//
//   node tests/test_agents.mjs
//
// Two failures are specific to this pair and invisible everywhere else:
//
//   a stale digest    edit SKILL.md, forget index.json, and every agent that verifies the
//                     SHA-256 (which is the entire point of publishing one) rejects the
//                     artifact — or worse, does not verify and trusts the wrong hash;
//   a lying skill     a code block that does not run. A language skill whose examples fail
//                     is worse than no skill: it teaches syntax that does not exist.
//
// Every ```zymbol block is executed here through the same engine the playground uses.
//
// Self-contained: plain Node, no npm dependency (web/ has no package.json — see CLAUDE.md).

import { readFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { runZymbol } from '../src/zymbol/zymbol.js';
import { registerWebMcpTools } from '../src/playground/webmcp.js';

const WEB_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const SKILLS_DIR = join(WEB_DIR, '.well-known/agent-skills');

let failures = 0;
function check(label, ok, detail = '') {
  if (!ok) {
    failures++;
    console.log(`  ✗ ${label}${detail ? `\n      ${detail}` : ''}`);
  }
}
function section(name) { console.log(`\n${name}`); }

// ─── the skills index ────────────────────────────────────────────────────────
section('agent-skills index');

// Pages runs the site through Jekyll, and Jekyll skips every path starting with a dot or
// an underscore. Without .nojekyll the whole .well-known tree is in the repository and 404
// on the site — published everywhere except where it counts.
check('.nojekyll exists, so /.well-known is served at all', existsSync(join(WEB_DIR, '.nojekyll')));

const indexPath = join(SKILLS_DIR, 'index.json');
check('index.json exists', existsSync(indexPath));
const index = JSON.parse(readFileSync(indexPath, 'utf8'));

check('declares the discovery schema',
      index.$schema === 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
      String(index.$schema));
check('has a skills array', Array.isArray(index.skills) && index.skills.length > 0);

const SITE = 'https://zymbol-lang.org/';
for (const skill of index.skills ?? []) {
  const where = `skill "${skill.name}"`;
  check(`${where}: name is lowercase alphanumeric + hyphens`, /^[a-z0-9]+(-[a-z0-9]+)*$/.test(skill.name ?? ''));
  check(`${where}: type is skill-md or archive`, ['skill-md', 'archive'].includes(skill.type));
  check(`${where}: has a description`, (skill.description ?? '').length > 20);
  check(`${where}: url is on this site`, (skill.url ?? '').startsWith(SITE), skill.url);

  // The artifact has to be a file this repository actually publishes, at the path the URL
  // claims — a skill index pointing off-site or at a 404 is a dead entry point.
  const rel = (skill.url ?? '').slice(SITE.length);
  check(`${where}: artifact is published at ${rel}`, existsSync(join(WEB_DIR, rel)));
  if (!existsSync(join(WEB_DIR, rel))) continue;

  const bytes = readFileSync(join(WEB_DIR, rel));
  const digest = `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
  check(`${where}: digest matches the artifact`, skill.digest === digest,
        `index says ${skill.digest}\n      file is   ${digest}`);
}

// ─── the skill runs ──────────────────────────────────────────────────────────
section('SKILL.md code blocks');

const skillMd = readFileSync(join(SKILLS_DIR, 'write-zymbol/SKILL.md'), 'utf8');

check('SKILL.md has frontmatter with a name', /^---\nname: [a-z0-9-]+/.test(skillMd));
check('SKILL.md states its version', /v0\.\d+\.\d+/.test(skillMd));

// Module examples are fenced as ```text on purpose: each needs its own file, so they are
// documentation rather than runnable blocks, and nothing here pretends otherwise.
const blocks = [...skillMd.matchAll(/```zymbol\n([\s\S]*?)```/g)].map(m => m[1]);
check('SKILL.md has runnable blocks', blocks.length >= 5, `${blocks.length} found`);

let ran = 0;
for (const [i, code] of blocks.entries()) {
  let out = '';
  try {
    await runZymbol(code, null, text => { out += text; });
    check(`block ${i + 1} produces output`, out.length > 0, '(ran, printed nothing)');
    ran++;
  } catch (err) {
    check(`block ${i + 1} runs`, false, `${err.message ?? err}\n      ${code.split('\n')[0]}`);
  }
}

// ─── the browser tools ───────────────────────────────────────────────────────
section('webmcp tools');

// No navigator.modelContext — the API is a Chrome origin trial, so this is the case
// almost every visitor is in, and it has to be a silent no-op rather than a thrown error
// that takes the rest of playground.js's boot down with it.
check('registers nothing where the API is absent', registerWebMcpTools({}) === null);

const registered = [];
// Node 24 exposes `navigator` as a getter-only global, so it is redefined rather than
// assigned — the browser gives the property outright.
Object.defineProperty(globalThis, 'navigator', {
  value: { modelContext: { registerTool: t => registered.push(t) } },
  configurable: true,
});

const calls = [];
const bridge = {
  runSource: async src => { calls.push(['run', src]); return 'hola\n'; },
  getEditor: () => ({ name: 'main.zy', code: '>> "hi" ¶' }),
  setEditor: src => calls.push(['set', src]),
  listExamples: q => (q === 'go' ? [{ path: 'games/classic/go.zyp', title: 'GO' }] : []),
  openExample: async p => `Opened ${p}.`,
  note: text => calls.push(['note', text]),
};

const controller = registerWebMcpTools(bridge);
check('returns an AbortController', controller instanceof AbortController);
check('registers every tool', registered.length === 5, `${registered.length} registered`);

for (const tool of registered) {
  check(`${tool.name}: has a description`, (tool.description ?? '').length > 30);
  check(`${tool.name}: has a JSON Schema`, tool.inputSchema?.type === 'object');
  check(`${tool.name}: has an execute callback`, typeof tool.execute === 'function');
  check(`${tool.name}: can be unregistered`, tool.signal === controller.signal);
}

const byName = Object.fromEntries(registered.map(t => [t.name, t]));
check('zymbol_run reaches the engine', (await byName.zymbol_run.execute({ source: '>> 1 ¶' }))
      .content[0].text === 'hola\n');
check('zymbol_run leaves the editor alone', !calls.some(([kind]) => kind === 'set'));
check('zymbol_run is visible in the output panel', calls.some(([kind]) => kind === 'note'));
check('zymbol_get_editor returns the open file',
      (await byName.zymbol_get_editor.execute({})).content[0].text.includes('main.zy'));
check('zymbol_list_examples filters',
      (await byName.zymbol_list_examples.execute({ query: 'go' })).content[0].text.includes('go.zyp'));
check('zymbol_list_examples says so when nothing matches',
      (await byName.zymbol_list_examples.execute({ query: 'zzz' })).content[0].text.includes('no example'));
check('zymbol_open_example opens by path',
      (await byName.zymbol_open_example.execute({ path: 'x.zy' })).content[0].text === 'Opened x.zy.');

// ─── summary ─────────────────────────────────────────────────────────────────
console.log(`\n${index.skills?.length ?? 0} skill(s) · ${ran}/${blocks.length} block(s) ran · ${registered.length} tool(s)`);
console.log(failures === 0 ? '\nAll agent tests passed' : `\n${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
