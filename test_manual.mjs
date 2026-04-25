// Manual smoke-test runner for web/zymbol.js
// Usage: node test_manual.mjs

import { runZymbol } from './zymbol.js';
import { readFileSync } from 'fs';

const src = readFileSync('./data/manual_en.md', 'utf8');

// Extract all ```zymbol blocks with their surrounding heading context
const blocks = [];
const lines = src.split('\n');
let heading = '';
let inBlock = false;
let blockLines = [];

for (const line of lines) {
  if (/^#{1,3} /.test(line)) heading = line.replace(/^#+\s*/, '').trim();
  if (line.trim() === '```zymbol') { inBlock = true; blockLines = []; continue; }
  if (inBlock && line.trim() === '```') {
    blocks.push({ heading, code: blockLines.join('\n') });
    inBlock = false;
    continue;
  }
  if (inBlock) blockLines.push(line);
}

// Skip blocks that use unsupported features
const SKIP_PATTERNS = [
  /<#/,          // import
  /^#\s/m,       // module declaration
  /#>/,          // export
  /<\\/,         // shell exec
  /<\//,         // script include
  />\</,         // CLI args
  /::/,          // module call
];

// Blocks that are illustrative multi-example snippets (not self-contained programs)
// or use features not implemented in the web interpreter
const KNOWN_INCOMPLETE = [
  />> "a=" a " b=" b/,  // Output & Input — uses undefined a, b, arr
  /\?\? n \{/,           // Match — last example uses undefined n
  /0x\|/,               // Data Operators block includes base-conversion output (0x|255|) — not implemented
];

function shouldSkip(code) {
  return SKIP_PATTERNS.some(re => re.test(code));
}

// Some blocks are illustrative snippets that don't produce output or
// are just expression showcases — we run them all and only fail on thrown errors.

let passed = 0, failed = 0, skipped = 0;

for (let i = 0; i < blocks.length; i++) {
  const { heading, code } = blocks[i];
  const label = `[${i + 1}/${blocks.length}] ${heading}`;

  if (shouldSkip(code)) {
    console.log(`⬜ SKIP  ${label}`);
    skipped++;
    continue;
  }

  if (KNOWN_INCOMPLETE.some(re => re.test(code))) {
    console.log(`⚠️  KNOWN ${label} — illustrative/unimplemented`);
    skipped++;
    continue;
  }

  let output = '';
  try {
    await runZymbol(
      code,
      async () => '',          // no-op input
      (text) => { output += text; }
    );
    console.log(`✅ PASS  ${label}`);
    if (output) console.log('       >', output.replace(/\n/g, '\\n').slice(0, 120));
    passed++;
  } catch (err) {
    console.log(`❌ FAIL  ${label}`);
    console.log('       >', err.message ?? err);
    console.log('  code >', code.split('\n').filter(l => l.trim() && !l.startsWith('//')).join(' | ').slice(0, 160));
    failed++;
  }
}

console.log(`\n── Results ──`);
console.log(`  ✅ ${passed} passed   ❌ ${failed} failed   ⬜ ${skipped} skipped`);
process.exit(failed > 0 ? 1 : 0);
