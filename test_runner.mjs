#!/usr/bin/env node
// Parity test runner: compares zymbol CLI vs web interpreter (zymbol.js)
// Usage: node test_runner.mjs [--dir path] [--filter pattern] [--show-pass]

import { readFileSync, readdirSync, statSync } from 'fs';
import { execSync } from 'child_process';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

// ─── Args ─────────────────────────────────────────────────────────────────────
const args     = process.argv.slice(2);
const dirArg   = args.find((_, i) => args[i-1] === '--dir');
const filterArg= args.find((_, i) => args[i-1] === '--filter');
const showPass = args.includes('--show-pass');
const TEST_ROOT = resolve(dirArg ?? join(__dir, '../interpreter/tests'));

// ─── Import interpreter ───────────────────────────────────────────────────────
const { runZymbol } = await import('./zymbol.js');

// ─── Collect .zy files ────────────────────────────────────────────────────────
function collectFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st   = statSync(full);
    if (st.isDirectory()) results.push(...collectFiles(full));
    else if (entry.endsWith('.zy')) results.push(full);
  }
  return results.sort();
}

const allFiles = collectFiles(TEST_ROOT)
  .filter(f => !filterArg || f.includes(filterArg));

// ─── Run one file with CLI ────────────────────────────────────────────────────
function runCLI(file) {
  try {
    return execSync(`zymbol run "${file}"`, {
      timeout: 8000,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch (e) {
    return (e.stdout ?? '') + (e.stderr ?? '');
  }
}

// ─── Run one file with web interpreter ───────────────────────────────────────
function makeModuleResolver(baseDir) {
  return async (importPath) => {
    try {
      const absPath = resolve(baseDir, importPath + '.zy');
      const src = readFileSync(absPath, 'utf8');
      return { src, resolver: makeModuleResolver(dirname(absPath)) };
    } catch {
      return null;
    }
  };
}

async function runWeb(file, src) {
  let out = '';
  try {
    await runZymbol(src, async () => '', text => { out += text; }, makeModuleResolver(dirname(resolve(file))), file);
  } catch (e) {
    out += `[ERROR] ${e.message ?? e}`;
  }
  return out;
}

// ─── Normalize output for comparison ─────────────────────────────────────────
function normalize(s) {
  return s
    .replace(/\r\n/g, '\n')   // CRLF → LF
    .replace(/\r/g, '\n')
    .trimEnd()                 // trailing newline differences
    .replace(/\t/g, '    ');   // tabs → spaces
}

// ─── Main ─────────────────────────────────────────────────────────────────────
let passed = 0, failed = 0, errors = 0;
const failList = [];

console.log(`\nRunning ${allFiles.length} test(s) from ${TEST_ROOT}\n`);

for (const file of allFiles) {
  const src     = readFileSync(file, 'utf8');
  const relPath = file.replace(TEST_ROOT + '/', '');

  const cliOut  = normalize(runCLI(file));
  const webOut  = normalize(await runWeb(file, src));

  if (cliOut === webOut) {
    passed++;
    if (showPass) console.log(`  ✓  ${relPath}`);
  } else {
    failed++;
    failList.push({ relPath, cliOut, webOut });
    console.log(`  ✗  ${relPath}`);

    // Show first diff
    const cliLines = cliOut.split('\n');
    const webLines = webOut.split('\n');
    const maxLines = Math.max(cliLines.length, webLines.length);
    let diffShown  = 0;
    for (let i = 0; i < maxLines && diffShown < 6; i++) {
      const c = cliLines[i] ?? '<missing>';
      const w = webLines[i] ?? '<missing>';
      if (c !== w) {
        if (diffShown === 0) console.log('     --- first diff ---');
        console.log(`     L${i+1} CLI: ${JSON.stringify(c)}`);
        console.log(`     L${i+1} WEB: ${JSON.stringify(w)}`);
        diffShown++;
      }
    }
    if (cliLines.length !== webLines.length)
      console.log(`     (CLI: ${cliLines.length} lines, WEB: ${webLines.length} lines)`);
    console.log();
  }
}

// ─── Summary ──────────────────────────────────────────────────────────────────
const total = passed + failed;
const pct   = total ? Math.round(passed / total * 100) : 0;
console.log('─'.repeat(60));
console.log(`  Passed : ${passed} / ${total}  (${pct}%)`);
console.log(`  Failed : ${failed}`);
console.log('─'.repeat(60));

process.exit(failed > 0 ? 1 : 0);
