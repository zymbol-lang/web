#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
//
// highlight_spans.mjs — what the playground's highlighter leaves UNMARKED.
//
// The driver for ZyDDT's fourth surface, and it does the least it can: it
// reports facts and grades nothing. Whether an unmarked character is a finding
// is ZyDDT's question, and keeping the judgement there is what stops the same
// rule existing twice.
//
// The method is CHARTER § 4: every character the highlighter emits OUTSIDE a
// span came out of its one unmarked path. So strip the markup and look at what
// is left — do not read the file and reason about it, which is how five broken
// operators survived being read.
//
//   node tests/highlight_spans.mjs FILE.zy...
//
// Output, one line per unmarked run, tab-separated:
//
//   file<TAB>line<TAB>column<TAB>text
//
// Several files per invocation on purpose: the sweep is 456 files and node
// costs about eighty milliseconds to start, so one process per file turned a
// two-second question into over a minute — long enough that the runner's own
// smoke test timed out on it.
//
// Whitespace never counts: `>> a b ¶` separates its arguments with spaces the
// highlighter has no reason to mark, and reporting those would bury the signal
// under one entry per space in the corpus.
//
// Exit 0 whatever it finds — a driver that exits non-zero on a finding would
// make "the file has an unmarked token" indistinguishable from "the driver
// crashed", and ZyDDT reads BLOCKED and RED as different things.

import { readFileSync } from 'fs';
import { highlightCode } from '../src/playground/highlight.js';

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('usage: highlight_spans.mjs FILE.zy...');
  process.exit(2);
}

for (const file of files) {
  const html = highlightCode(readFileSync(file, 'utf8'));

  // The entities `esc()` produces, back to the characters they stand for. Order
  // matters: `&amp;` last, or `&amp;lt;` would become `<`.
  const unesc = s => s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

  // Depth 0 is outside everything, depth 1 is inside the `.hl-line` wrapper and
  // outside every token span — which is exactly the unmarked path — and 2 or more
  // is inside a token. The wrapper is not optional: `highlightCode` puts one
  // around every line, so text at depth 1 is text the tokeniser walked past.
  let depth = 0, line = 1, col = 1, i = 0;
  const found = [];
  let run = null;                    // { line, col, text } being accumulated

  const flush = () => {
    if (run && run.text.trim() !== '') found.push(run);
    run = null;
  };

  while (i < html.length) {
    if (html[i] === '<') {
      const close = html.indexOf('>', i);
      if (close < 0) break;                       // malformed: stop rather than guess
      const tag = html.slice(i, close + 1);
      flush();
      if (tag.startsWith('</')) depth -= 1;
      else if (!tag.endsWith('/>')) depth += 1;
      i = close + 1;
      continue;
    }
    const next = html.indexOf('<', i);
    const chunk = html.slice(i, next < 0 ? html.length : next);
    i = next < 0 ? html.length : next;

    for (const piece of chunk.split(/(\n)/)) {
      if (piece === '') continue;
      if (piece === '\n') { flush(); line += 1; col = 1; continue; }
      const text = unesc(piece);
      if (depth <= 1) {
        // Whitespace is not a token and never will be.
        if (text.trim() === '') { flush(); }
        else if (run) run.text += text;
        else run = { line, col, text };
      } else {
        flush();
      }
      col += text.length;
    }
  }
  flush();

  for (const r of found) {
    process.stdout.write(`${file}\t${r.line}\t${r.col}\t${r.text}\n`);
  }
}
