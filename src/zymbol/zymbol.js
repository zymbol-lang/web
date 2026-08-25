// SPDX-License-Identifier: AGPL-3.0-only
/*
 * Copyright (C) 2024-2026 Zymbol-Lang Team
 *
 * This file is a hand-written JavaScript port of the Rust tree-walker in
 * <https://github.com/zymbol-lang/interpreter>, and a derivative work of it.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License, version 3, as published by
 * the Free Software Foundation.
 *
 * It is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE. See the GNU Affero General Public License for more details:
 * <https://www.gnu.org/licenses/agpl-3.0.html>, or LICENSE-AGPL-3.0 in this
 * repository.
 *
 * This engine runs in the browser at zymbol-lang.org/playground.html. Section 13
 * applies: the complete corresponding source of what runs there is
 * <https://github.com/zymbol-lang/web>, and the playground says so in its own ?
 * panel.
 */

/**
 * zymbol.js — Browser interpreter for the Zymbol playground
 *
 * v0.0.4: 1-based indexing, multi-dimensional navigation (arr[i>j>k]),
 * type-cast operators (##. ### ##!), string split ($/), ConcatBuild ($++),
 * explicit lifetime end (\ var).
 *
 * v0.0.5: string repeat ($*), hot definition (°), module alias (:), sleep (@~),
 * labeled loops (@:label { } / @:label! / @:label>), TUI canvas operators
 * (>>! >>? >>~ <<| <<|? >>|), caught error values (##_(...)), hotDef scope fix.
 *
 * v0.0.6: FatArrow (=>) replaces : as match/import/export separator (already in v0.0.5 JS);
 * $~ on named tuples — integer + field-name string index (G2);
 * deep update arr[i>j]$~ val (G1, DeepUpdate node);
 * stdlib modules std/math (22 fns + PI/E) and std/random (3 fns);
 * bare import paths support slashes: <# std/math => alias;
 * native function call path in callFunc (fn.native).
 *
 * v0.0.7: stdlib std/json (decode/decode_map/encode via JSON.parse/stringify — ##Parse text is
 * engine-specific), std/net (get/post/post_json/head via fetch; optional headers arg;
 * CORS applies), std/io (per-run virtual filesystem: Map of files + Set of dirs);
 * std/db NOT available (requires ODBC). Typed input << <typespec> "prompt" var with
 * ##.(t,d) / ##. / ###(n) / ##"(n) / ##' — validates, re-prompts on invalid input.
 * Input EOF contract: inputFn returning null/undefined = EOF → runtime error, like
 * the CLI on closed stdin. Legacy << #|v| now converts numeric strings (Int/Float).
 * Checker: static undefined-function detection (E_FUNC) for bare-identifier calls,
 * mirroring zymbol-semantic type_check (the test1.zy cos() case).
 * 2026-06-12 parity sync: nested Unit in collections displays as `()` (was an
 * empty hole — Rust engines unified the same day); Checker rejects destructuring
 * into a `:=` constant (L14, E_CONST), mirroring type_check.rs.
 * 2026-07-02 parity sync: json::decode_map(text, map) — decode + recursive key
 * rename per a NamedTuple map (data-level i18n), mirroring stdlib/json.rs.
 *
 * v0.0.8: match or-patterns — p1 || p2 || p3 in a match arm, tested left to right,
 * first match wins. Alternatives combine any pattern kinds (literal, range,
 * comparison, ident, list) and are top-level only, so list elements stay
 * unambiguous. Mirrors Pattern::Or in zymbol-ast / zymbol-parser.
 * 2026-07-27 v0.0.8 distribution-parity pass (playground now runs zy-GO,
 * zy-Serpiente, zyKlingonGalaxy, Z-Tic-Tac-Toe): ##! on a Char casts to its
 * code point (data_ops.rs CastKind::ToIntTrunc); delimited juxtaposition —
 * implicit concat in call args, array/tuple elements and grouped expressions
 * (HLZ-007), not just at statement level; std/term (width/pad_left/pad_right/
 * center/truncate) added, unit-test-verified against stdlib/term.rs; open
 * start/end collection slices arr$[i..] and arr$[..j] (only arr$[i..j] parsed
 * before); comparison operators (<, >, ==, …) no longer wrongly rejected
 * inside a match arm's { block } body — the no-bare-comparison rule is for
 * the value form (pattern => expr) only, mirroring parse_match_arm_value;
 * a `<~` return inside a match arm's block no longer gets silently swallowed
 * when the match itself is a bare statement or a sub-expression (assignment
 * RHS, argument, …) — eval()'s 'Match' case now throws the arm's ZyReturn
 * signal so it unwinds to callFunc, the same mechanism $!! already used;
 * identifier continuation no longer stops at a Private-Use-Area character
 * that happens to double as a script's own digit block (e.g. Klingon pIqaD
 * CSUR reuses U+F8F0–F8F9 for both letters and digits) — mirrors
 * Lexer::is_ident_continue, which never special-cased digit blocks past the
 * first character; the string-interpolation "is this a bare identifier"
 * checker regex gained \p{So}\p{Co} (HLZ-KL-001 parity — was under-marking
 * PUA-script names as used, producing a false W_UNUSED).
 * 2026-07-28 escape sequences inside CHARACTER literals: readChar took the
 * character after the backslash verbatim, so '\n' lexed as the letter "n" —
 * a `'\n' => …` match arm never matched a real newline (and did match "n").
 * String literals were always fine, which is why this survived: it only shows
 * up where a program compares against a control character. Symptom was Enter
 * doing nothing in TUI programs in the playground (arrow keys are literal
 * glyphs, so they kept working). Escape table now mirrors Lexer::lex_char in
 * zymbol-lexer/src/literals.rs. Regression test:
 * interpreter/tests/bugs/bug_char_escape_lexing.zy (run by both engines).
 * 2026-07-28 output parameters (`<~`) across a module boundary: only eval()'s
 * 'Call' branch built the write-back list, but `alias::f(x)` parses as
 * Ident → FieldAccess → CallExpr, so every cross-module call silently dropped
 * its out-params — the callee mutated its local copy and the caller never saw
 * it. Both branches now share buildOutWriteback(). This is what made GO
 * unplayable in the browser: 盤::着手(局面<~, …, 取数<~, コウ点<~) placed stones
 * and counted captures into parameters the caller never received, so the move
 * counter advanced while the board stayed empty. Covered by
 * interpreter/tests/modules_scope/{out_param_module,mod_state_return}.zy.
 * 2026-07-28 codePointDisplayWidth is now exported, so the playground's canvas
 * renderer measures characters with this table instead of its own local
 * approximation. BrowserTUI._isWide used `cp >= 0x1F000 || FF01..FFE6`, which
 * calls ⚫/⚪ (U+26AA/U+26AB) narrow while the table correctly calls them wide:
 * the font drew each GO stone two cells wide and the renderer clipped it to
 * one, slicing every stone in half on screen. Layout and rendering must agree
 * on width or one of them is always wrong.
 * 2026-07-28 module aliases now live in their own namespace (this.moduleAliases),
 * mirroring the tree-walker's `import_aliases`, and the parser records whether a
 * field access came from `::` or `.`. Both operators built the same FieldAccess
 * node and resolved the object as an ordinary expression, so a plain variable
 * sharing an alias's name made the module unreachable: zyKlingonGalaxy imports
 * Duj and then uses that same name for the player's ship, so `duj = duj::bIj(duj,
 * …)` — every left/right move — died with "'.<name>' requires a named tuple".
 * Regression test: interpreter/tests/modules_scope/alias_shadowed_by_variable.zy.
 *
 * CLI args (><): supported — pass cliArgs array to runZymbol().
 * BashExec (<\ \>): returns high-resolution timestamp (entropy stub).
 * Not supported: shell inclusion (</ />).
 * TUI operators require a >>| { } block to activate the canvas overlay.
 *
 * 2026-08-01 numeral mode and ordering, synced with the Rust engines. An active
 * numeral mode (#d0d9#) now reaches interpolation, juxtaposition, $++ and collection
 * elements, not just bare >>; and orderValues() replaces three disagreeing comparison
 * paths with the single rule: numeric when both sides are numbers (a string counts if
 * #|…| would convert it, in any of the 69 digit scripts), lexicographic when both are
 * non-numeric text, an error when a number meets text that is not one. == still never
 * coerces. Mirrors cmp_order (VM) and compare_values (tree-walker).
 *
 * 2026-08-22 `#|c|` reads a digit from a Char, not only from a String —
 * `#|'७'|` is 7 as `#|"७"|` already was, in all 69 digit scripts, and a Char
 * that is not a digit comes back untouched (GAP-ZYB-012). `<<|` hands over a
 * Char, so this is the shape a keyboard produces.
 *
 * 2026-08-22 the decimal count of a format operator may be a NAME as well as
 * digits — `#,.n|x|`, `#.n|x|`, `#!n|x|`, `#^.n|x|` (GAP-ZYB-001). The count is
 * lexed inside the DATA_OP token, so the name is read there and the parser
 * turns it into an expression evaluated at run time. A name and not a general
 * expression, in all three engines: the `|` that opens the value is also how
 * bitwise-or is spelled, and this lexer scans the count in one pass.
 *
 * 2026-08-21 `$~` takes a whole expression as its value, juxtaposition included,
 * in all three parse paths (statement `name[i]$~ v`, nav-index postfix, and the
 * CollectionOp form). It used to take one unary operand and leave the rest of the
 * line to be parsed as a separate statement, so `d["a"]$~ "" v` assigned `""` and
 * dropped `v` in silence — same as both Rust engines did. BUG-ZYB-002.
 *
 * Parity re-measured 2026-08-09 against the v0.0.9 branch:
 *   node tests/test_runner.mjs              → 518/528, 39 skipped (irreducible)
 *   node tests/test_runner.mjs --dir examples → 208/210
 * The 10 failures are known gaps, not regressions:
 *   - arity  argument counts are not checked at all (JS PERMISSIVE — 5 tests)
 *     `for (let i = 0; i < fn.params.length; i++) def(params[i], args[i] ?? mkUnit())`
 *     fills a missing argument with Unit and drops a surplus one. That is what the
 *     register VM did until v0.0.9, when a mismatch became a semantic error fatal
 *     before execution in both Rust engines (REFERENCE.md L28) — so this engine is
 *     now the only one that runs `m::f(a, b)` against a one-parameter `f`.
 *     The whole of interpreter/tests/arity/ fails here for that one reason.
 *   - MM-4  import-time semantic gate            (JS PERMISSIVE — worse failure mode)
 *   - MM-11 leftover loop-iterator value         (JS PERMISSIVE — worse failure mode)
 *   - MM-9  root-scope constants at call depth >= 2
 *   - HLZ-005 './../' diagnostic text and error count
 *   - interpolation of a global constant prints {DIR} verbatim
 *   - HLZ-KL-001 NOT ported: is_ident_continue here rejects "'" inside an identifier,
 *     so f(mI') — ordinary tlhIngan Hol — fails to parse. The Rust rule is "any
 *     non-whitespace, non-operator character"; this lexer is narrower.
 *   - float literals are accumulated digit by digit (value + frac / div, see readNumber),
 *     so 3.14159265 prints as 3.1415926499999998. Affects EVERY float literal, not just
 *     the one example that catches it. Predates v0.0.8 — introduced with digit-script
 *     support in v0.0.4, and unnoticed until the example pool became real files.
 * The three PERMISSIVE rows produce output the CLI would have refused, and are the ones
 * to fix first — arity most of all, since it is the only gap where the other three
 * engines now agree with each other and not with this one. Detail and the per-test table: interpreter/IMPL_V008.md § E.3.
 */

// ─── Unicode digit blocks (mirrors DIGIT_BLOCKS in zymbol-lexer) ─────────────
const DIGIT_BLOCKS = [
  [0x0030,'ASCII'],[0x0660,'Arabic-Indic'],[0x06F0,'Ext. Arabic-Indic'],
  [0x07C0,'NKo'],[0x0966,'Devanagari'],[0x09E6,'Bengali'],[0x0A66,'Gurmukhi'],
  [0x0AE6,'Gujarati'],[0x0B66,'Oriya'],[0x0BE6,'Tamil'],[0x0C66,'Telugu'],
  [0x0CE6,'Kannada'],[0x0D66,'Malayalam'],[0x0DE6,'Sinhala Archaic'],
  [0x0E50,'Thai'],[0x0ED0,'Lao'],[0x0F20,'Tibetan'],[0x1040,'Myanmar'],
  [0x1090,'Myanmar Shan'],[0x17E0,'Khmer'],[0x1810,'Mongolian'],
  [0x1946,'Limbu'],[0x19D0,'New Tai Lue'],[0x1A80,'Tai Tham Hora'],
  [0x1A90,'Tai Tham Tham'],[0x1B50,'Balinese'],[0x1BB0,'Sundanese'],
  [0x1C40,'Lepcha'],[0x1C50,'Ol Chiki'],[0xA620,'Vai'],[0xA8D0,'Saurashtra'],
  [0xA900,'Kayah Li'],[0xA9D0,'Javanese'],[0xA9F0,'Myanmar Tai Laing'],
  [0xAA50,'Cham'],[0xABF0,'Meetei Mayek'],[0xF8F0,'Klingon pIqaD'],
  [0xFF10,'Fullwidth'],[0x104A0,'Osmanya'],[0x10D30,'Hanifi Rohingya'],
  [0x11066,'Brahmi'],[0x110F0,'Sora Sompeng'],[0x11136,'Chakma'],
  [0x111D0,'Sharada'],[0x112F0,'Khudawadi'],[0x11450,'Newa'],
  [0x114D0,'Tirhuta'],[0x11650,'Modi'],[0x116C0,'Takri'],[0x11730,'Ahom'],
  [0x118E0,'Warang Citi'],[0x11950,'Dives Akuru'],[0x11C50,'Bhaiksuki'],
  [0x11D50,'Masaram Gondi'],[0x11DA0,'Gunjala Gondi'],[0x11F50,'Kawi'],
  [0x16A60,'Mro'],[0x16AC0,'Tangsa'],[0x16B50,'Pahawh Hmong'],
  [0x1D7CE,'Mathematical Bold'],[0x1D7D8,'Mathematical Double-struck'],
  [0x1D7E2,'Mathematical Sans-serif'],[0x1D7EC,'Math Sans-serif Bold'],
  [0x1D7F6,'Mathematical Monospace'],[0x1E140,'Nyiakeng Puachue Hmong'],
  [0x1E2F0,'Wancho'],[0x1E4F0,'Nag Mundari'],[0x1E950,'Adlam'],
  [0x1FBF0,'Segmented/LCD'],
];

function digitValue(ch) {
  const cp = ch.codePointAt(0);
  for (const [base] of DIGIT_BLOCKS) {
    if (cp >= base && cp <= base + 9) return cp - base;
  }
  return -1;
}

function digitBlockBase(ch) {
  const cp = ch.codePointAt(0);
  for (const [base] of DIGIT_BLOCKS) {
    if (cp >= base && cp <= base + 9) return base;
  }
  return -1;
}

/** Block base of the ASCII digits — the default numeral mode. */
const ASCII_BASE = 0x0030;

// ─── Script separators (mirrors SCRIPT_SEPARATORS in zymbol-lexer) ───────────
//
// `[blockBase, decimalSeparator, thousandsSeparator]` for the scripts that
// encode their own. The admission bar is narrow and objective: Unicode itself
// must name the character a numeric separator for that script. Exactly one
// script clears it — Arabic, through U+066B ARABIC DECIMAL SEPARATOR and
// U+066C ARABIC THOUSANDS SEPARATOR — and it clears it for both of its digit
// blocks. Every other script writes ASCII `.` and `,`.
const SCRIPT_SEPARATORS = [
  [0x0660, '\u066B', '\u066C'],   // Arabic-Indic
  [0x06F0, '\u066B', '\u066C'],   // Extended Arabic-Indic (Persian, Urdu)
];

function decimalSeparator(blockBase) {
  const e = SCRIPT_SEPARATORS.find(([base]) => base === blockBase);
  return e ? e[1] : '.';
}

function thousandsSeparator(blockBase) {
  const e = SCRIPT_SEPARATORS.find(([base]) => base === blockBase);
  return e ? e[2] : ',';
}

/** ASCII `.` or any script's own — reading is script-blind, writing is not. */
function isDecimalSeparator(ch) {
  return ch === '.' || SCRIPT_SEPARATORS.some(([, dec]) => dec === ch);
}

// Rewrites one FORMATTED NUMBER into the script identified by `blockBase`:
// digits, decimal separator and thousands separator all follow the script.
//
// The argument must be a single number and nothing else — the separators are
// ordinary punctuation, so running this over composite text would rewrite marks
// that were never separators. Composite text never reaches here: a list, an
// interpolation and a concatenation each map their numbers one at a time and
// add their own commas afterwards.
function mapNumeralNumber(s, blockBase) {
  if (blockBase === ASCII_BASE) return s;
  const decimal = decimalSeparator(blockBase);
  const thousands = thousandsSeparator(blockBase);
  return [...s].map(ch => {
    if (ch >= '0' && ch <= '9') return String.fromCodePoint(blockBase + (ch.charCodeAt(0) - 0x30));
    if (ch === '.') return decimal;
    if (ch === ',') return thousands;
    return ch;
  }).join('');
}

function numeralInt(n, base)   { return mapNumeralNumber(String(Math.trunc(n)), base); }
// A float as Zymbol spells it, which is not how JavaScript spells it.
//
// Three separate disagreements with the other engines lived in `String(f)`:
//
//   · the infinities print `Infinity` / `-Infinity`, not `inf` / `-inf`;
//   · `-0` prints `0`, losing the sign the other three keep;
//   · magnitudes at or past 1e21, and below 1e-6, switch to exponent notation
//     (`1e+21`, `1e-7`) where the others always print the digits out flat.
//
// The last one is the language's call, not this engine's: `#^` is the operator
// that *asks* for scientific notation, and it already agrees in all four. So a
// plain `>>` prints digits, and anyone who wants an exponent writes `#^`.
// (`NaN` already agreed everywhere.)
function floatText(f) {
  if (Number.isNaN(f)) return 'NaN';
  if (f === Infinity) return 'inf';
  if (f === -Infinity) return '-inf';
  if (Object.is(f, -0)) return '-0';
  return expandExponent(String(f));
}

// `1e+21` → `1000000000000000000000`, `1.5e-10` → `0.00000000015`.
// The Rust engines get the same shape for free, since Rust's `{}` for f64 never
// emits an exponent; JavaScript is the only engine that needs this by hand.
// (It was written to mirror `expand_exponent` in zyml/src/value.ml, which had
// the same problem in OCaml. That engine was retired on 2026-08-17, so this is
// no longer a two-place rule — `zyq consensus` against the Rust engines is what
// holds it now.)
function expandExponent(str) {
  const ei = str.indexOf('e');
  if (ei < 0) return str;
  let mant = str.slice(0, ei);
  const ex = Number(str.slice(ei + 1));
  const neg = mant.startsWith('-');
  if (neg) mant = mant.slice(1);
  const di = mant.indexOf('.');
  const ip = di < 0 ? mant : mant.slice(0, di);
  const fp = di < 0 ? ''   : mant.slice(di + 1);
  const digits = ip + fp;
  const point = ip.length + ex;          // where the decimal point lands
  let body;
  if (point <= 0)                  body = '0.' + '0'.repeat(-point) + digits;
  else if (point >= digits.length) body = digits + '0'.repeat(point - digits.length);
  else                             body = digits.slice(0, point) + '.' + digits.slice(point);
  if (body.includes('.')) body = body.replace(/0+$/, '').replace(/\.$/, '');
  return neg ? '-' + body : body;
}
function numeralFloat(f, base) { return mapNumeralNumber(floatText(f), base); }
function numeralBool(b, base)  { return '#' + numeralInt(b ? 1 : 0, base); }

// Is this value a dictionary rather than a positional tuple?
//
// Both are `type: 'tuple'` here, and `keys` is what tells them apart: `null`
// for a positional tuple, an array for a dictionary. The array may be EMPTY —
// `#()` is the empty dictionary, and it is not the empty tuple: one takes
// `d["k"]$~ v` and the other answers "tuples are immutable" (GAP-ZYB-003).
//
// Twelve places asked this with `keys?.some(k => k)`, which reads "has at least
// one key" and therefore called the empty dictionary a tuple. One rule, one
// place.
function isDict(v) { return v?.type === 'tuple' && v.keys != null; }

// ─── Signal types ─────────────────────────────────────────────────────────────

const OUTPUT_STOP_OPS = {
  EQ: '==', NEQ: '<>', LT: '<', GT: '>', LTE: '<=', GTE: '>=',
  AND: '&&', OR: '||', PIPE: '|>',
};

class ZyReturn  { constructor(value) { this.value = value; } }
class ZyBreak    { constructor(label = null) { this.label = label; } }
class ZyContinue { constructor(label = null) { this.label = label; } }
class ZyErrorPropagate { constructor(errVal) { this.errVal = errVal; } }
class ZyError extends Error {
  constructor(msg, line) {
    super(line ? `Line ${line}: ${msg}` : msg);
    this.zyLine = line;
  }
}
class ZyRuntimeError extends ZyError {
  constructor(msg, errType = '##_', line) {
    super(msg, line);
    this.errType = errType;
  }
}
class ZyStaticError extends Error {
  constructor(msg) { super(msg); }
}

// Thin-space grouping for the execution-limit messages, so they quote the limit that was
// actually configured. They used to hardcode "50 000 steps" and "32 KB", which is what the
// defaults happen to be — a playground running a `.zyp` at 2 000 000 reported 50 000 and
// sent whoever was debugging it looking in the wrong place.
const grouped = n => (Number.isFinite(n) ? n.toLocaleString('en-US').replace(/,/g, ' ') : String(n));

// ─── Lexer ────────────────────────────────────────────────────────────────────

export class Lexer {
  constructor(src) {
    this.src = [...src];
    this.pos = 0;
    this.line = 1;
  }

  ch(offset = 0) { return this.src[this.pos + offset] ?? ''; }

  consume() {
    const c = this.src[this.pos++];
    if (c === '\n') this.line++;
    return c;
  }

  tokenize() {
    const toks = [];
    const tok = (type, value) => toks.push({ type, value, line: this.line });

    while (this.pos < this.src.length) {
      if (/[ \t\r\n]/.test(this.ch())) { this.consume(); continue; }

      // comment
      if (this.ch() === '/' && this.ch(1) === '/') {
        while (this.pos < this.src.length && this.ch() !== '\n') this.consume();
        continue;
      }
      // block comment /* ... */
      if (this.ch() === '/' && this.ch(1) === '*') {
        this.consume(); this.consume();
        while (this.pos < this.src.length) {
          if (this.ch() === '*' && this.ch(1) === '/') { this.consume(); this.consume(); break; }
          this.consume();
        }
        continue;
      }

      // # — mode-switch, booleans, cast ops, data ops, error types
      if (this.ch() === '#') {
        const c1 = this.ch(1);
        const dv1 = digitValue(c1);
        if (dv1 >= 0) {
          if (dv1 === 0) {
            const c2 = this.ch(2);
            const dv2 = digitValue(c2);
            if (dv2 === 9 && digitBlockBase(c1) === digitBlockBase(c2) && this.ch(3) === '#') {
              const base = digitBlockBase(c1);
              this.consume(); this.consume(); this.consume(); this.consume();
              tok('SET_NUMERAL_MODE', base); continue;
            }
          }
          this.consume(); this.consume();
          if (dv1 === 0) { tok('BOOL', false); continue; }
          if (dv1 === 1) { tok('BOOL', true);  continue; }
          continue;
        }
        // `#(` opens a dictionary literal (GAP-ZYB-003/004). `(a: 1)` and
        // `(1, 2)` shared the parentheses and not the semantics — the colon was
        // the whole of what told them apart, and an EMPTY dictionary could not
        // be written at all, because `()` would have to be both. `#` is the
        // meta/type mark, the same one `#[` uses to declare an array's mix.
        if (c1 === '(') {
          this.consume(); this.consume(); // consume #(
          tok('HASH_LPAREN', '#(');
          continue;
        }
        if (c1 === '#') {
          // ##. → CAST_FLOAT, ### → CAST_INT_ROUND, ##! → CAST_INT_TRUNC,
          // ##" → CAST_TEXT, ##' → CAST_CHAR (input typespecs), else ##xxx IDENT
          const c2 = this.ch(2);
          this.consume(); this.consume(); // consume ##
          if (c2 === '.') { this.consume(); tok('CAST_FLOAT',     '##.'); continue; }
          if (c2 === '#') { this.consume(); tok('CAST_INT_ROUND', '###'); continue; }
          if (c2 === '!') { this.consume(); tok('CAST_INT_TRUNC', '##!'); continue; }
          if (c2 === '"') { this.consume(); tok('CAST_TEXT',      '##"'); continue; }
          if (c2 === "'") { this.consume(); tok('CAST_CHAR',      "##'"); continue; }
          // `##_` — the Unit literal, and the "any kind" mark in `:! ##_`.
          // One token for both, because they are one reading: `_` is what is
          // not specified (GAP-ZYB-009). The lookahead keeps `##_algo` an
          // error kind, since a name may begin with an underscore.
          if (c2 === '_' && !/[A-Za-z0-9_]/.test(this.ch(1))) {
            this.consume(); tok('UNIT', '##_'); continue;
          }
          let name = '##';
          while (/[A-Za-z0-9_]/.test(this.ch())) { name += this.ch(); this.consume(); }
          tok('IDENT', name); continue;
        }
        if (c1 === '?') {
          this.consume(); this.consume();
          tok('TYPE_QUERY', '#?'); continue;
        }
        {
          let kind = null, prec = null, advance = 0, dynPrec = false;
          const readDigits = start => {
            let d = '', i = start;
            while (/[0-9]/.test(this.ch(i))) { d += this.ch(i); i++; }
            return { d, i };
          };
          // GAP-ZYB-001: the decimal count may be a NAME instead of digits —
          // `#,.n|x|`. The count is lexed as part of this token, so the name is
          // read here and handed to the parser, which turns it into an
          // expression evaluated when the program runs. For money the count is
          // configuration: it belongs to the currency, not to the source.
          const readName = start => {
            let d = '', i = start;
            while (/[\p{L}_0-9]/u.test(this.ch(i) || '')) { d += this.ch(i); i++; }
            return { d, i };
          };
          if (c1 === '|') {
            kind = 'eval'; advance = 2;
          } else if (c1 === '.') {
            const { d, i } = readDigits(2);
            if (d.length > 0 && this.ch(i) === '|') { kind = 'round'; prec = parseInt(d); advance = i + 1; }
            else {
              const n = readName(2);
              if (n.d.length > 0 && this.ch(n.i) === '|') { kind = 'round'; prec = n.d; dynPrec = true; advance = n.i + 1; }
            }
          } else if (c1 === '!') {
            const { d, i } = readDigits(2);
            if (d.length > 0 && this.ch(i) === '|') { kind = 'trunc'; prec = parseInt(d); advance = i + 1; }
            else {
              const n = readName(2);
              if (n.d.length > 0 && this.ch(n.i) === '|') { kind = 'trunc'; prec = n.d; dynPrec = true; advance = n.i + 1; }
            }
          } else if (c1 === ',') {
            const c2 = this.ch(2);
            if (c2 === '|') { kind = 'comma'; advance = 3; }
            else if (c2 === '.') {
              const { d, i } = readDigits(3);
              if (d.length > 0 && this.ch(i) === '|') { kind = 'comma_round'; prec = parseInt(d); advance = i + 1; }
              else {
                const n = readName(3);
                if (n.d.length > 0 && this.ch(n.i) === '|') { kind = 'comma_round'; prec = n.d; dynPrec = true; advance = n.i + 1; }
              }
            }
            else if (c2 === '!') {
              const { d, i } = readDigits(3);
              if (d.length > 0 && this.ch(i) === '|') { kind = 'comma_trunc'; prec = parseInt(d); advance = i + 1; }
              else {
                const n = readName(3);
                if (n.d.length > 0 && this.ch(n.i) === '|') { kind = 'comma_trunc'; prec = n.d; dynPrec = true; advance = n.i + 1; }
              }
            }
          } else if (c1 === '^') {
            const c2 = this.ch(2);
            if (c2 === '|') { kind = 'sci'; advance = 3; }
            else if (c2 === '.') {
              const { d, i } = readDigits(3);
              if (d.length > 0 && this.ch(i) === '|') { kind = 'sci_round'; prec = parseInt(d); advance = i + 1; }
              else {
                const n = readName(3);
                if (n.d.length > 0 && this.ch(n.i) === '|') { kind = 'sci_round'; prec = n.d; dynPrec = true; advance = n.i + 1; }
              }
            }
            else if (c2 === '!') {
              const { d, i } = readDigits(3);
              if (d.length > 0 && this.ch(i) === '|') { kind = 'sci_trunc'; prec = parseInt(d); advance = i + 1; }
              else {
                const n = readName(3);
                if (n.d.length > 0 && this.ch(n.i) === '|') { kind = 'sci_trunc'; prec = n.d; dynPrec = true; advance = n.i + 1; }
              }
            }
          }
          if (kind !== null) {
            for (let i = 0; i < advance; i++) this.consume();
            tok('DATA_OP', { kind, prec, dynPrec }); continue;
          }
        }
        // # followed by space/letter/dot: module block `# name {` or old-style comment
        if (c1 === ' ' || c1 === '.' || /[\p{L}_]/u.test(c1)) {
          // Lookahead: check for # [.] name { (new module block syntax)
          let _j = this.pos + 1;
          while (_j < this.src.length && (this.src[_j] === ' ' || this.src[_j] === '\t')) _j++;
          if (_j < this.src.length && this.src[_j] === '.') _j++; // optional leading dot
          const _idStart = _j;
          while (_j < this.src.length && /[\p{L}\p{M}\p{So}\p{Co}0-9_]/u.test(this.src[_j])) _j++;
          if (_j > _idStart) {
            let _k = _j;
            while (_k < this.src.length && (this.src[_k] === ' ' || this.src[_k] === '\t')) _k++;
            if (_k < this.src.length && this.src[_k] === '{') {
              this.consume(); // consume #
              tok('HASH', '#'); continue;
            }
          }
          // Old-style header: skip to EOL
          while (this.pos < this.src.length && this.src[this.pos] !== '\n') this.consume();
          continue;
        }
        // #> = export block declarator
        if (c1 === '>') { this.consume(); this.consume(); tok('EXPORT_DECL', '#>'); continue; }
        // `#[` opens a declared-mixed array literal (decision 15). It has to be
        // emitted here because the fallback below DROPS an unrecognised `#`
        // without a sound — which is why `#[…]` appeared to work in this engine
        // while being a syntax error in both Rust ones: the `#` simply vanished
        // and what ran was a plain `[…]`.
        if (c1 === '[') { this.consume(); tok('HASH', '#'); continue; }
        this.consume(); continue;
      }

      // BashExec <\ cmd \> — browser-only: captures command text, simulates common date/echo
      if (this.ch() === '<' && this.ch(1) === '\\') {
        this.consume(); this.consume(); // consume <\
        let _cmd = '';
        while (this.pos < this.src.length) {
          if (this.ch() === '\\' && this.ch(1) === '>') { this.consume(); this.consume(); break; }
          _cmd += this.consume();
        }
        tok('BASHEXEC', _cmd.trim()); continue;
      }

      // TUI operators (3-4 chars) — must come before twoMap so >> and << aren't consumed first
      if (this.ch() === '>' && this.ch(1) === '>') {
        const c2 = this.ch(2);
        if (c2 === '!') { this.consume(); this.consume(); this.consume(); tok('OUTPUT_CLEAR', '>>!'); continue; }
        if (c2 === '?') { this.consume(); this.consume(); this.consume(); tok('OUTPUT_QUERY', '>>?'); continue; }
        if (c2 === '~') { this.consume(); this.consume(); this.consume(); tok('OUTPUT_POS',   '>>~'); continue; }
        if (c2 === '|') { this.consume(); this.consume(); this.consume(); tok('OUTPUT_GATE',  '>>|'); continue; }
      }
      if (this.ch() === '<' && this.ch(1) === '<' && this.ch(2) === '|') {
        if (this.ch(3) === '?') {
          this.consume(); this.consume(); this.consume(); this.consume();
          tok('KEY_NONBLOCK', '<<|?'); continue;
        }
        this.consume(); this.consume(); this.consume();
        tok('KEY_BLOCK', '<<|'); continue;
      }

      // two-char operators
      const two = this.ch(0) + this.ch(1);
      const twoMap = {
        '>>': 'OUTPUT', '<<': 'INPUT',  '<~': 'RETURN',
        '<#': 'IMPORT',
        '@!': 'BREAK',  '@>': 'CONTINUE', '@~': 'ATSLEEP',
        '??': 'MATCH',  '_?': 'ELSEIF', ':=': 'CONST_ASSIGN',
        '..': 'RANGE',  '==': 'EQ',     '<>': 'NEQ',
        '<=': 'LTE',    '>=': 'GTE',    '&&': 'AND',
        '||': 'OR',     '++': 'INC',    '--': 'DEC',
        '+=': 'PLUS_EQ',  '-=': 'MINUS_EQ', '*=': 'TIMES_EQ',
        '/=': 'DIV_EQ',   '%=': 'MOD_EQ',   '^=': 'POW_EQ',
        '->': 'ARROW',  '=>': 'FAT_ARROW',  '|>': 'PIPE',
        '!?': 'TRY',    ':!': 'CATCH',  ':>': 'FINALLY',
        '::': 'SCOPE',
        '\\\\': 'NEWLINE_ESC',
        '><': 'CLI_ARGS',
      };
      if (twoMap[two]) {
        this.consume(); this.consume();
        tok(twoMap[two], two);
        continue;
      }

      const c = this.ch();

      if (c === '_') {
        if (/[\p{L}\p{Co}0-9_]/u.test(this.ch(1))) { this.readIdent(toks); }
        else { this.consume(); tok('ELSE', '_'); }
        continue;
      }

      if (c === '?') { this.consume(); tok('IF',     '?'); continue; }
      if (c === '@') {
        this.consume();
        if (this.ch() === ':') {
          // @:label — labeled loop, break, or continue
          this.consume();
          let label = '';
          while (/[\p{L}\p{M}\p{So}\p{Co}0-9_]/u.test(this.ch())) label += this.consume();
          if (this.ch() === '!') { this.consume(); tok('AT_BREAK', label); }
          else if (this.ch() === '>') { this.consume(); tok('AT_CONT',  label); }
          else tok('AT_LABEL', label);
        } else if (/[\p{L}\p{M}\p{So}\p{Co}_]/u.test(this.ch())) {
          // @label (legacy: label without colon)
          let label = '';
          while (/[\p{L}\p{M}\p{So}\p{Co}0-9_]/u.test(this.ch())) label += this.consume();
          tok('AT_LABEL', label);
        } else {
          tok('AT', '@');
        }
        continue;
      }
      if (c === '¶') { this.consume(); tok('PILCROW','¶'); continue; }

      // $ collection operators
      if (c === '$') {
        const a = this.ch(1), b = this.ch(2);
        if (a === '+' && b === '+')         { this.consume(); this.consume(); this.consume(); tok('DCONCATBUILD','$++'); continue; }
        if (a === '#')                      { this.consume(); this.consume();               tok('DLEN',        '$#');  continue; }
        if (a === '?' && b === '?')         { this.consume(); this.consume(); this.consume(); tok('DFINDALL',  '$??'); continue; }
        if (a === '?')                      { this.consume(); this.consume();               tok('DCONTAINS',  '$?');  continue; }
        if (a === '-' && b === '-')         { this.consume(); this.consume(); this.consume(); tok('DREMOVEALL','$--'); continue; }
        if (a === '-')                      { this.consume(); this.consume();               tok('DREMOVE',    '$-');  continue; }
        // `$+[` with no space between them is the positional insert `$+[i] val`;
        // a space makes it a plain append whose operand happens to be an array
        // literal (`grid$+ [0, 0]`). Same split the Rust lexer makes with
        // DollarPlusLBracket vs DollarPlus + LBracket — see
        // crates/zymbol-lexer/src/collection_ops.rs.
        if (a === '+' && b === '[')         { this.consume(); this.consume();               tok('DAPPEND_AT', '$+['); continue; }
        if (a === '+')                      { this.consume(); this.consume();               tok('DAPPEND',    '$+');  continue; }
        if (a === '*')                      { this.consume(); this.consume();               tok('DREPEAT',    '$*');  continue; }
        if (a === '/' )                     { this.consume(); this.consume();               tok('DSPLIT',     '$/');  continue; }
        if (a === '^' && b === '+')         { this.consume(); this.consume(); this.consume(); tok('DSORTASC', '$^+'); continue; }
        if (a === '^' && b === '-')         { this.consume(); this.consume(); this.consume(); tok('DSORTDESC','$^-'); continue; }
        if (a === '^')                      { this.consume(); this.consume();               tok('DSORT',      '$^');  continue; }
        if (a === '>')                      { this.consume(); this.consume();               tok('DMAP',       '$>');  continue; }
        if (a === '|')                      { this.consume(); this.consume();               tok('DFILTER',    '$|');  continue; }
        if (a === '<')                      { this.consume(); this.consume();               tok('DREDUCE',    '$<');  continue; }
        if (a === '~' && b === '~')         { this.consume(); this.consume(); this.consume(); tok('DREPLACE', '$~~'); continue; }
        if (a === '~')                      { this.consume(); this.consume();               tok('DUPDATE',    '$~');  continue; }
        if (a === '[')                      { this.consume();                               tok('DSLICE',     '$[');  continue; }
        if (a === '!' && b === '!')         { this.consume(); this.consume(); this.consume(); tok('DERRORPROP','$!!'); continue; }
        if (a === '!')                      { this.consume(); this.consume();               tok('DERROR',     '$!');  continue; }
        this.consume(); continue;
      }

      if (/[0-9]/.test(c) || digitValue(c) >= 0) { this.readNumber(toks); continue; }
      if (c === '"') { this.readString(toks); continue; }
      if (c === "'") { this.readChar(toks); continue; }
      if (/[\p{L}\p{M}\p{So}\p{Co}]/u.test(c)) { this.readIdent(toks); continue; }

      const single = {
        '=':'ASSIGN', '<':'LT', '>':'GT',
        '+':'PLUS',   '-':'MINUS', '*':'TIMES', '/':'DIV', '%':'MOD', '^':'POW',
        '!':'NOT',    '|':'VBAR',
        '(':'LPAREN', ')':'RPAREN', '[':'LBRACKET', ']':'RBRACKET',
        '{':'LBRACE', '}':'RBRACE',
        ',':'COMMA',  ':':'COLON', '.':'DOT', ';':'SEMI', '\\':'BACKSLASH',
      };
      // `!=` is not a Zymbol operator, and letting it through is worse than
      // refusing it: `n$| (x -> x % 2 != 0)` printed `[1, 3]#10` here, where
      // the correct program prints `[1, 3]`. The `!` was read as logical NOT
      // and the rest as two more values to juxtapose, so the answer came out
      // with a tail nobody asked for. Both Rust engines refuse it in the lexer.
      if (c === '!' && this.ch(1) === '=') {
        throw new ZyStaticError("'!=' is not a valid Zymbol operator — use '<>' for not-equal", this.line);
      }
      if (single[c]) { this.consume(); tok(single[c], c); continue; }

      this.consume();
    }

    tok('EOF', null);
    return toks;
  }

  readNumber(toks) {
    // Handle base literals: 0x (hex), 0b (binary), 0o (octal), 0d (decimal explicit)
    if (this.ch() === '0') {
      const next = this.ch(1);
      if (next === 'x' || next === 'X') {
        if (this.ch(2) === '|') { this.consume(); this.consume(); this.consume(); toks.push({ type: 'DATA_OP', value: { kind: 'base_conv', prec: 16 }, line: this.line }); return; }
        this.consume(); this.consume();
        let hex = '';
        while (/[0-9a-fA-F]/.test(this.ch())) hex += this.consume();
        toks.push({ type: 'CHAR', value: String.fromCodePoint(parseInt(hex, 16)), line: this.line }); return;
      }
      if (next === 'b' || next === 'B') {
        if (this.ch(2) === '|') { this.consume(); this.consume(); this.consume(); toks.push({ type: 'DATA_OP', value: { kind: 'base_conv', prec: 2 }, line: this.line }); return; }
        this.consume(); this.consume();
        let bin = '';
        while (this.ch() === '0' || this.ch() === '1') bin += this.consume();
        toks.push({ type: 'CHAR', value: String.fromCodePoint(parseInt(bin, 2)), line: this.line }); return;
      }
      if (next === 'o' || next === 'O') {
        if (this.ch(2) === '|') { this.consume(); this.consume(); this.consume(); toks.push({ type: 'DATA_OP', value: { kind: 'base_conv', prec: 8 }, line: this.line }); return; }
        this.consume(); this.consume();
        let oct = '';
        while (/[0-7]/.test(this.ch())) oct += this.consume();
        toks.push({ type: 'CHAR', value: String.fromCodePoint(parseInt(oct, 8)), line: this.line }); return;
      }
      if (next === 'd' || next === 'D') {
        if (this.ch(2) === '|') { this.consume(); this.consume(); this.consume(); toks.push({ type: 'DATA_OP', value: { kind: 'base_conv', prec: 10 }, line: this.line }); return; }
        this.consume(); this.consume();
        let dec = '';
        while (/[0-9]/.test(this.ch())) dec += this.consume();
        toks.push({ type: 'CHAR', value: String.fromCodePoint(parseInt(dec, 10)), line: this.line }); return;
      }
    }
    let value = 0;
    // The digits as ASCII, whatever script they were written in: a float is
    // parsed from the literal rather than assembled from its parts, because
    // `3 + 14159265/100000000` is 3.1415926499999998 while the literal
    // 3.14159265 rounds to the nearest double exactly — which is the value the
    // Rust engines read, and what `>>` then prints.
    let intText = '';
    let activeBlock = ASCII_BASE;
    while (this.pos < this.src.length) {
      const dv = digitValue(this.ch());
      if (dv < 0) break;
      if (intText === '') activeBlock = digitBlockBase(this.ch());
      value = value * 10 + dv;
      intText += String(dv);
      this.consume();
    }
    // The separator is ASCII `.` or the one the digits' own script encodes
    // (`٣٫٥`): that is what an active numeral mode writes, and a number the
    // program writes has to read back. `..` stays the range operator.
    const ownSeparator = decimalSeparator(activeBlock);
    if ((this.ch() === '.' || this.ch() === ownSeparator) && this.ch(1) !== '.') {
      this.consume();
      let fracText = '';
      while (this.pos < this.src.length) {
        const dv = digitValue(this.ch());
        if (dv < 0) break;
        fracText += String(dv);
        this.consume();
      }
      const sci = this.readExponentSuffix();
      const f = parseFloat(`${intText || '0'}.${fracText || '0'}${sci}`);
      toks.push({ type: 'FLOAT', value: f, line: this.line });
    } else {
      // `1e10` with no decimal point is a Float too, exactly as the Rust engines
      // read it (`1e10#?` is `##.`). This case used to fall through to the integer
      // branch, and `e10` was then lexed as an identifier — "undefined variable 'e10'".
      const sci = this.readExponentSuffix();
      if (sci) {
        toks.push({ type: 'FLOAT', value: parseFloat(value + sci), line: this.line });
        return;
      }
      if (!inIntRange(value))
        throw new ZyStaticError(`integer literal out of range: '${value}' (integers range from ${ZY_INT_MIN} to ${ZY_INT_MAX})`);
      toks.push({ type: 'NUM', value, line: this.line });
    }
  }

  // The `e[+-]?digits` tail of a numeric literal, or '' when there is none.
  //
  // Requires at least one digit after the `e`, so `1 e|x|` — the data operator —
  // keeps its meaning and only a real exponent is consumed.
  readExponentSuffix() {
    if (this.ch() !== 'e' && this.ch() !== 'E') return '';
    let k = 1;
    if (this.ch(k) === '+' || this.ch(k) === '-') k++;
    if (!/[0-9]/.test(this.ch(k) ?? '')) return '';
    let sci = this.consume();
    if (this.ch() === '+' || this.ch() === '-') sci += this.consume();
    while (/[0-9]/.test(this.ch())) sci += this.consume();
    return sci;
  }

  readString(toks) {
    this.consume(); // opening "
    const parts = [];
    let cur = '';
    while (this.pos < this.src.length && this.ch() !== '"') {
      if (this.ch() === '\\') {
        this.consume();
        const e = this.consume();
        // \{ and \} produce literal braces (not interpolation delimiters)
        cur += e === 'n' ? '\n' : e === 't' ? '\t' : e;
      } else if (this.ch() === '{') {
        if (cur) { parts.push({ t: 'lit', v: cur }); cur = ''; }
        this.consume();
        let depth = 1, inner = '';
        while (this.pos < this.src.length && depth > 0) {
          const ch = this.consume();
          if      (ch === '{') { depth++; inner += ch; }
          else if (ch === '}') { depth--; if (depth > 0) inner += ch; }
          else inner += ch;
        }
        // An interpolation is `{identifier}` and nothing else. Counting depth
        // meant `{{…}}` opened two levels and passed, so the doubled-brace form
        // — which is how Rust and Python spell a literal brace, and is NOT how
        // Zymbol spells it — ran here and was a syntax error in both Rust
        // engines. Zymbol's literal brace is `\{` and `\}`, symmetrically.
        if (!/^[^\s{}\[\]().,;:"'`!?@#$|&~\\+\-*/%^<>=]+$/.test(inner)) {
          throw new ZyError(
            `invalid character in string interpolation\n` +
            `help: interpolation must be {identifier} — use \\{ for a literal brace`,
            this.line);
        }
        parts.push({ t: 'expr', v: inner });
      } else if (this.ch() === '}') {
        // A `}` that closes nothing. The escape is symmetric: `\{` and `\}` are
        // the literal braces, and a bare one is an error on either side.
        //
        // Both engines accepted it, so `"\{\"n\":1}"` — the half-escaped form —
        // printed happily while the same JSON with neither escape was refused.
        // Two spellings of one string, one accepted and one not, with nothing to
        // say why.
        throw new ZyError(
          `unmatched '}' in string\n` +
          `help: the escape is symmetric — write \\} for a literal brace, ` +
          `as \\{ is for the opening one`,
          this.line);
      } else {
        cur += this.consume();
      }
    }
    if (this.pos < this.src.length) this.consume(); // closing "
    if (cur) parts.push({ t: 'lit', v: cur });
    toks.push({ type: 'STR', value: parts, line: this.line });
  }

  readChar(toks) {
    this.consume();
    let ch = '';
    if (this.ch() === '\\') {
      this.consume();
      const e = this.consume();
      // Escape table mirrors Lexer::lex_char in zymbol-lexer/src/literals.rs. This used to
      // take the character after the backslash verbatim, so '\n' lexed as the letter "n" —
      // a pattern like `'\n' => …` then silently never matched a real newline (and did match
      // the letter n). That is why Enter did nothing in TUI programs under the web
      // interpreter while working under the CLI: every arrow key is a literal glyph ('↑')
      // and was unaffected, but Enter is delivered as '\n' and fell through to the wildcard.
      ch = e === 'n' ? '\n'
         : e === 't' ? '\t'
         : e === 'r' ? '\r'
         : e === '0' ? '\0'
         : e;                 // \' \\ and anything else: the character itself
    } else {
      ch = this.consume();
    }
    if (this.ch() === "'") this.consume();
    toks.push({ type: 'CHAR', value: ch, line: this.line });
  }

  readIdent(toks) {
    let s = '';
    while (true) {
      const c = this.ch();
      if (!c) break;
      if (c === '°') break; // hot-def suffix — consumed below, not part of name
      // Mirrors Lexer::is_ident_continue: unlike the identifier-START check
      // (readNumber is tried first, at the tokenize() dispatch site), a
      // digit-block character does NOT end an identifier once it has begun —
      // some Private Use Area scripts (e.g. Klingon pIqaD/CSUR) reuse the
      // same PUA sub-range for both letters and that script's own digits, so
      // breaking here would truncate real identifiers mid-word (HLZ-KL-001-
      // adjacent parity gap, found via klingon_galaxy/HuD.zy).
      if (/[\p{L}\p{M}\p{So}\p{Co}0-9_]/u.test(c)) { s += this.consume(); continue; }
      // `'` continues an identifier once one has begun — `Lexer::is_ident_continue`
      // in Rust admits any non-whitespace, non-operator character, and the
      // apostrophe is not an operator. Klingon needs it (`mI'`, `tlhIngan Hol`),
      // and without it `_ { <~ mI' }` was read as an unterminated char literal
      // that swallowed the rest of the file.
      if (c === "'" && s.length > 0) { s += this.consume(); continue; }
      break;
    }
    const hot = this.ch() === '°';
    if (hot) this.consume();
    // `°x°` — both markers on the same name, which asks for two lifetimes at
    // once: `°x` anchors ABOVE the loop and `x°` anchors AT it, so there is
    // nothing to choose between. A prefix `°` lexes as an IDENT with an empty
    // name (the sentinel just below), so the pair is visible right here — which
    // is where both Rust engines refuse it, and this engine used to run the
    // program and print an answer.
    if (hot && s) {
      const prev = toks[toks.length - 1];
      if (prev && prev.type === 'IDENT' && prev.hot === true && prev.value === '') {
        throw new ZyStaticError(
          `ambiguous hot-definition markers on '${s}': ` +
          `use either '°${s}' (anchors above loop) or '${s}°' (anchors at loop), not both`);
      }
    }
    toks.push({ type: 'IDENT', value: s, hot, line: this.line });
  }
}

// ─── Parser ───────────────────────────────────────────────────────────────────

export class Parser {
  constructor(tokens) {
    this.toks = tokens;
    this.pos  = 0;
  }

  peek(n = 0) { return this.toks[Math.min(this.pos + n, this.toks.length - 1)]; }
  adv() {
    const t = this.toks[this.pos];
    if (this.pos < this.toks.length - 1) this.pos++;
    return t;
  }
  check(type) { return this.peek().type === type; }
  match(...types) { return types.includes(this.peek().type) ? this.adv() : null; }
  eat(type, msg) {
    if (!this.check(type))
      throw new ZyError(msg ?? `Expected ${type}, got '${this.peek().value ?? this.peek().type}'`, this.peek().line);
    return this.adv();
  }

  parse() {
    const body = this.parseStmtList();
    this.checkImportsFirst(body);
    return { type: 'Program', body };
  }

  // Imports precede every statement in an executable file.
  //
  // Both Rust engines enforce this in the parser — the loop that reads the
  // leading run of `<#` stops at the first statement, and anything after it is a
  // parse error — while this one accepted an import anywhere, because it parses
  // `Import` as an ordinary statement. `>> "antes" ¶` followed by
  // `<# std/json => js` ran here and was `unexpected token: ModuleImport` there
  // (DM-12). The rule was written in no document either, so the program that
  // broke it worked in exactly one engine and no text said which was right.
  //
  // A module file is exempt: its body is a single ModuleBlock and its own rules
  // are checked elsewhere.
  checkImportsFirst(body) {
    if (body[0]?.type === 'ModuleBlock') return;
    let seenStatement = false;
    for (const stmt of body) {
      if (stmt.type === 'Noop') continue;
      if (stmt.type === 'Import') {
        if (seenStatement)
          throw new ZyError(
            'imports must come before any statement — ' +
            'move this `<#` above the first statement in the file',
            stmt.line);
        continue;
      }
      seenStatement = true;
    }
  }

  parseStmtList() {
    const stmts = [];
    while (!this.check('EOF') && !this.check('RBRACE')) {
      const s = this.parseStmt();
      if (s) stmts.push(s);
    }
    return stmts;
  }

  parseBlock() {
    this.eat('LBRACE');
    const stmts = this.parseStmtList();
    this.eat('RBRACE');
    // A function is free in a script or part of a module — never of a block.
    // Both Rust engines refuse a declaration inside `? { }`, `@ { }` or a
    // function body, and this one ran it, so a program written in the playground
    // failed outside it (DM-23, decided 2026-08-19).
    //
    // Checked after the block is parsed rather than while: the shape is the same
    // wherever the block came from, so one place covers every block form.
    for (const s of stmts) {
      if (s?.type === 'FuncDecl') {
        throw new ZyError(
          `a function cannot be declared inside a block: '${s.name}' is free in a ` +
          `script or part of a module, not of a '?', '@' or function body`,
          s.line);
      }
    }
    return stmts;
  }

  parseModuleBlock() {
    this.adv(); // consume HASH
    let name = '';
    if (this.check('DOT')) { this.adv(); name += '.'; }
    name += this.eat('IDENT').value;
    this.eat('LBRACE');
    const body = this.parseStmtList();
    this.eat('RBRACE');
    return { type: 'ModuleBlock', name, body };
  }

  parseImport() {
    const line = this.peek().line;
    this.adv(); // consume <#
    // Parse path: ./name, ../name, ./dir/name, or string literal
    let path = '';
    if (this.check('DOT')) {
      this.adv(); this.eat('DIV'); // consume . and /
      path = './' + this.eat('IDENT').value;
      while (this.check('DIV')) { this.adv(); path += '/' + this.eat('IDENT').value; }
    } else if (this.check('RANGE')) {
      this.adv(); this.eat('DIV'); // consume .. and /
      let ups = 1;
      while (this.check('RANGE')) { this.adv(); this.eat('DIV'); ups++; }
      path = '../'.repeat(ups) + this.eat('IDENT').value;
      while (this.check('DIV')) { this.adv(); path += '/' + this.eat('IDENT').value; }
    } else if (this.check('STR')) {
      path = this.adv().value;
    } else {
      path = this.eat('IDENT').value;
      // Allow multi-segment bare paths: std/math, std/random, etc.
      while (this.check('DIV')) { this.adv(); path += '/' + this.eat('IDENT').value; }
    }
    this.eat('FAT_ARROW'); // consume =>
    const alias = this.eat('IDENT').value;
    return { type: 'Import', path, alias, line };
  }

  parseStmt() {
    const t = this.peek();

    if (t.type === 'SET_NUMERAL_MODE') { this.adv(); return { type: 'SetNumeralMode', base: t.value }; }
    if (t.type === 'IMPORT') return this.parseImport();
    if (t.type === 'EXPORT_DECL') {
      this.adv();
      const names = []; // { kind:'own'|'reexport', internal, alias?, member?, exported }
      if (this.check('LBRACE')) {
        this.adv();
        while (!this.check('RBRACE') && !this.check('EOF')) {
          if (this.check('IDENT')) {
            const first = this.adv().value;
            if (this.check('SCOPE') || this.check('DOT')) {
              // Re-export: alias::member or alias.member
              this.adv();
              const member = this.check('IDENT') ? this.adv().value : first;
              const exported = this.check('FAT_ARROW') ? (this.adv(), this.check('IDENT') ? this.adv().value : member) : member;
              names.push({ kind: 'reexport', alias: first, member, exported });
            } else {
              const exported = this.check('FAT_ARROW') ? (this.adv(), this.check('IDENT') ? this.adv().value : first) : first;
              names.push({ kind: 'own', internal: first, exported });
            }
          } else {
            this.adv();
          }
        }
        this.match('RBRACE');
      }
      return { type: 'ExportDecl', names };
    }
    if (t.type === 'OUTPUT')   return this.parseOutput();
    if (t.type === 'INPUT')    return this.parseInput();
    if (t.type === 'RETURN')   return this.parseReturn();
    if (t.type === 'BREAK')    { this.adv(); const bl = this.check('IDENT') ? this.adv().value : null; return { type: 'Break',    label: bl }; }
    if (t.type === 'CONTINUE') { this.adv(); const cl = this.check('IDENT') ? this.adv().value : null; return { type: 'Continue', label: cl }; }
    if (t.type === 'AT_BREAK') { const lbl = this.adv().value; return { type: 'Break',    label: lbl }; }
    if (t.type === 'AT_CONT')  { const lbl = this.adv().value; return { type: 'Continue', label: lbl }; }
    if (t.type === 'ATSLEEP')    { this.adv(); return { type: 'Sleep', duration: this.parseExpr() }; }
    if (t.type === 'CLI_ARGS')    { this.adv(); return { type: 'CliArgs', variable: this.eat('IDENT').value }; }
    if (t.type === 'OUTPUT_CLEAR') { this.adv(); return { type: 'ClearScreen' }; }
    if (t.type === 'OUTPUT_GATE')  return this.parseTuiBlock();
    if (t.type === 'OUTPUT_POS')   return this.parseOutputPos();
    if (t.type === 'KEY_BLOCK')    return this.parseKeyInput(true);
    if (t.type === 'KEY_NONBLOCK') return this.parseKeyInput(false);
    if (t.type === 'IF')       return this.parseIf();
    if (t.type === 'MATCH')    return { type: 'ExprStmt', expr: this.parseMatchExpr() };
    if (t.type === 'AT')       { this.adv(); return this.parseLoop(); }
    if (t.type === 'AT_LABEL') { return this.parseLabeledLoop(); }
    if (t.type === 'TRY')      return this.parseTryCatch();
    if (t.type === 'BACKSLASH') {
      this.adv();
      if (this.check('IDENT')) {
        const name = this.adv().value;
        return { type: 'LifetimeEnd', name };
      }
      return null;
    }
    if (t.type === 'LBRACKET' && this.isDestructuring()) return this.parseArrayDestruct();
    if (t.type === 'LPAREN'   && this.isDestructuring()) return this.parseTupleDestruct();
    // `#(name: n) = …` — destructuring a dictionary. The pattern is written the
    // way the literal is: `#(` says "this is a dictionary" on both sides of the
    // `=`, so a reader never has to remember that they spell it differently.
    if (t.type === 'HASH_LPAREN' && this.isDestructuring()) return this.parseTupleDestruct();
    // A statement that OPENS with a bracket or a paren and is not a
    // destructuring assignment is a mistake, and both Rust engines say so.
    // Reaching the `ExprStmt` fallthrough instead let this engine run two kinds
    // of typo that the CLI refuses:
    //
    //   ins = s$++[5:"!!!"]                    `$++` then a leftover `[…]`
    //   by_age = people$^+ (a, b -> …)         `$^+` sorts; `$^` is the one
    //                                          that takes a comparator
    //
    // In both, the parser finishes the expression early and what remains starts
    // the next statement — which is exactly the shape a stray operator makes.
    if (t.type === 'LBRACKET' || t.type === 'LPAREN' || t.type === 'HASH_LPAREN') {
      const shown = t.type === 'LBRACKET' ? '[' : (t.type === 'LPAREN' ? '(' : '#(');
      const hint = t.type === 'LBRACKET'
        ? "use '[a, b] = expr' for array destructuring"
        : (t.type === 'LPAREN'
            ? "use '(a, b) = expr' for tuple destructuring"
            : "use '#(name: n) = expr' to destructure a dictionary");
      throw new ZyStaticError(`unexpected '${shown}' at statement level — ${hint}`, t.line);
    }
    if (t.type === 'IDENT')    return this.parseIdentStmt();
    if (t.type === 'SEMI')     { this.adv(); return null; }
    if (t.type === 'PILCROW')  { this.adv(); return { type: 'Output', items: [], newline: true }; }
    if (t.type === 'HASH')     return this.parseModuleBlock();

    return { type: 'ExprStmt', expr: this.parseExpr() };
  }

  // The operators that cannot continue a `>>` argument, and are therefore a
  // mistake rather than the start of the next one. Spelled as the source writes
  // them, so the message can quote what the programmer typed.
  //
  // `<>` is Zymbol's inequality; `!=` is not an operator at all, which is why
  // `>> 1 != 2 ¶` used to print `1#12` — `1`, then `!2` negated, then `2`.
  // `>>` has a narrower grammar than the rest of the language, and this engine
  // used to ignore that: it called `parseExpr`, so `>> 1 == 1` printed `#1` here
  // and was `error: expected expression, found Eq` in both Rust engines (DM-06).
  // A program written in the playground could fail to parse outside it.
  //
  // The limit is real and has a cause: arguments are juxtaposed, so the parser
  // has to decide where one ends, and `<` and `>` are the same characters that
  // open `<#`, `<~` and close `>>|`. `parseAdditive` is exactly the Rust cut —
  // arithmetic and below, comparison and the logical operators above it — so
  // `>> (1 == 1) ¶` is the form that works, in every engine.
  parseOutput() {
    const opLine = this.adv().line;
    const items = [];
    while (!this.check('PILCROW') && !this.check('NEWLINE_ESC') &&
           !this.check('RBRACE') && !this.check('EOF')) {
      if (this.peek().line > opLine) break;
      items.push(this.parseAdditive());
      // Refusing has to be explicit. Narrowing the call alone was worse than the
      // bug: `>> 1 == 1 ¶` printed `11`, because the loop simply started a new
      // argument and the leftover `==` fell through the primary parser without a
      // sound. A silent wrong answer beats a parse error in no reading of
      // anything.
      const stray = OUTPUT_STOP_OPS[this.peek().type];
      if (stray && this.peek().line === opLine)
        throw new ZyError(
          `expected expression, found ${stray} — '>>' takes arithmetic; ` +
          `parenthesise a comparison: >> (a ${stray} b) ¶`,
          this.peek().line);
    }
    const nl = this.match('PILCROW', 'NEWLINE_ESC');
    return { type: 'Output', items, newline: !!nl, line: this.peek().line };
  }

  parseInput() {
    const line = this.peek().line;
    this.adv();
    // Optional leading typespec cast: ##. / ##.(t,d) / ### / ###(n) / ##! / ##!(n) / ##"(n) / ##'
    const cast = this.parseInputTypespec();
    let prompt = null;
    if (this.check('STR')) {
      prompt = { type: 'Literal', kind: 'str', value: this.adv().value };
    }
    // Legacy `#|variable|` numeric cast — only when no typespec was given.
    let typed = false;
    if (!cast && this.check('DATA_OP') && this.peek().value?.kind === 'eval') {
      this.adv(); typed = true;
    }
    const varTok = this.eat('IDENT');
    if (typed) this.match('VBAR'); // consume closing |
    const finalCast = cast ?? { kind: typed ? 'numeric' : 'string' };
    return { type: 'Input', prompt, varName: varTok.value, cast: finalCast, line };
  }

  // Typed-input typespec after <<:
  //   ##.(t,d) → decimal, ##. → float, ###(n)/##!(n) → int, ##"(n) → text, ##' → char
  // Returns null when the next token is not a typespec.
  parseInputTypespec() {
    const t = this.peek().type;
    if (t === 'CAST_FLOAT') {
      this.adv();
      if (this.check('LPAREN')) {
        const [total, decimals] = this.parseTwoUintArgs();
        return { kind: 'decimal', total, decimals };
      }
      return { kind: 'float' };
    }
    if (t === 'CAST_INT_ROUND' || t === 'CAST_INT_TRUNC') {
      this.adv();
      return { kind: 'int', maxDigits: this.parseOptOneUintArg() };
    }
    if (t === 'CAST_TEXT') {
      this.adv();
      return { kind: 'text', max: this.parseOptOneUintArg() };
    }
    if (t === 'CAST_CHAR') {
      this.adv();
      return { kind: 'char' };
    }
    return null;
  }

  parseOptOneUintArg() {
    if (!this.check('LPAREN')) return null;
    this.adv();
    const n = this.eat('NUM').value;
    this.eat('RPAREN');
    return n;
  }

  parseTwoUintArgs() {
    this.eat('LPAREN');
    const a = this.eat('NUM').value;
    this.eat('COMMA');
    const b = this.eat('NUM').value;
    this.eat('RPAREN');
    return [a, b];
  }

  parseReturn() {
    const opLine = this.adv().line;
    if (this.check('RBRACE') || this.check('EOF') || this.peek().line > opLine)
      return { type: 'Return', value: null };
    const items = [];
    while (!this.check('RBRACE') && !this.check('EOF') && this.peek().line === opLine) {
      items.push(this.parseExpr());
    }
    const value = items.length === 1 ? items[0] : { type: 'JuxtaConcat', items };
    return { type: 'Return', value };
  }

  parseTryCatch() {
    this.adv();
    const tryBody = this.parseBlock();
    const catches = [];
    while (this.check('CATCH')) {
      this.adv();
      // `##_` is its own token since it became the Unit literal, so the
      // wildcard is matched before the `##Kind` identifier path.
      if (this.check('UNIT')) { this.adv(); }
      const errType = (this.check('IDENT') && this.peek().value.startsWith('##'))
        ? this.adv().value : null;
      catches.push({ errType, body: this.parseBlock() });
    }
    let finallyBody = null;
    if (this.check('FINALLY')) {
      this.adv();
      finallyBody = this.parseBlock();
    }
    return { type: 'TryCatch', tryBody, catches, finallyBody };
  }

  // Like isDestructuring, but for a loop head: the pattern is followed by `:`
  // rather than by `=`.
  isLoopPattern() {
    let i = 0, depth = 0;
    const start = this.peek(0).type;
    const close = start === 'LBRACKET' ? 'RBRACKET' : 'RPAREN';
    while (this.pos + i < this.toks.length) {
      const t = this.toks[this.pos + i++];
      if (t.type === start) depth++;
      else if (t.type === close) { depth--; if (depth === 0) break; }
    }
    return this.peek(i).type === 'COLON';
  }

  isDestructuring() {
    let i = 0, depth = 0;
    const start = this.peek(0).type;
    const close = start === 'LBRACKET' ? 'RBRACKET' : 'RPAREN';
    // `#(` opens a paren as surely as `(` does, so it counts towards depth —
    // a dictionary literal nested in the pattern must not close it early.
    const opens = start === 'LBRACKET'
      ? t => t === 'LBRACKET'
      : t => t === 'LPAREN' || t === 'HASH_LPAREN';
    while (this.pos + i < this.toks.length) {
      const t = this.toks[this.pos + i++];
      if (opens(t.type)) depth++;
      else if (t.type === close) { depth--; if (depth === 0) break; }
    }
    return this.peek(i).type === 'ASSIGN';
  }

  // Two `*rest` in one pattern are ambiguous by definition: nothing says where
  // the first ends and the second begins. No engine refused the form, and each
  // invented a different split of `[a, *r, *s, z] = [1,2,3,4,5]` — `r=[2,3,4]
  // s=[5]` in the tree-walker, `r=[2,3] s=[3]` in the register VM, which returns
  // the 3 *twice*, and `r=[2,3] s=[4,5]` here. An answer that repeats an element
  // cannot be right under any reading of what a rest is (DM-17, decision 26).
  //
  // Python refuses it too: `SyntaxError: multiple starred expressions in
  // assignment`. Refusing while parsing means the static checker sees it, which
  // is where a pattern mistake belongs.
  rejectSecondRest(targets, line) {
    if (targets.some(t => t.rest))
      throw new ZyError(
        "only one '*rest' is allowed in a destructure pattern — " +
        'two rests cannot be told apart: nothing says where the first ends',
        line);
  }

  // The pattern alone, without the `= value` an assignment adds. Split out so a
  // loop head can use the very same pattern: `@ (k, v):pares` binds each element
  // exactly as `(k, v) = par` binds one.
  parseArrayDestructPattern() {
    this.adv();
    const targets = [];
    while (!this.check('RBRACKET') && !this.check('EOF')) {
      if (this.check('TIMES')) {
        const line = this.peek().line;
        this.adv();
        this.rejectSecondRest(targets, line);
        targets.push({ name: this.eat('IDENT').value, rest: true });
      } else if (this.check('ELSE')) {
        this.adv();
        targets.push({ name: '_', rest: false });
      } else {
        targets.push({ name: this.eat('IDENT').value, rest: false });
      }
      this.match('COMMA');
    }
    this.eat('RBRACKET');
    return { type: 'ArrayDestruct', targets };
  }

  parseTupleDestructPattern() {
    this.adv();
    const targets = [];
    while (!this.check('RPAREN') && !this.check('EOF')) {
      if (this.check('TIMES')) {
        const line = this.peek().line;
        this.adv();
        this.rejectSecondRest(targets, line);
        targets.push({ name: this.eat('IDENT').value, rest: true });
      } else if (this.check('ELSE')) {
        this.adv();
        targets.push({ name: '_', rest: false });
      } else {
        targets.push({ name: this.eat('IDENT').value, rest: false });
      }
      this.match('COMMA');
    }
    this.eat('RPAREN');
    return { type: 'TupleDestruct', targets };
  }

  parseArrayDestruct() {
    this.adv();
    const targets = [];
    while (!this.check('RBRACKET') && !this.check('EOF')) {
      if (this.check('TIMES')) {
        const line = this.peek().line;
        this.adv();
        this.rejectSecondRest(targets, line);
        targets.push({ name: this.eat('IDENT').value, rest: true });
      } else if (this.check('ELSE')) {
        this.adv();
        targets.push({ name: '_', rest: false });
      } else {
        targets.push({ name: this.eat('IDENT').value, rest: false });
      }
      this.match('COMMA');
    }
    this.eat('RBRACKET');
    this.eat('ASSIGN');
    return { type: 'ArrayDestruct', targets, value: this.parseExpr() };
  }

  parseTupleDestruct() {
    const isNamed = this.peek(0).type === 'HASH_LPAREN'
      || (this.peek(1).type === 'IDENT' && this.peek(2).type === 'COLON');
    this.adv();
    if (isNamed) {
      const targets = [];
      while (!this.check('RPAREN') && !this.check('EOF')) {
        const field = this.eat('IDENT').value;
        this.eat('COLON');
        const name  = this.eat('IDENT').value;
        targets.push({ field, name });
        this.match('COMMA');
      }
      this.eat('RPAREN');
      this.eat('ASSIGN');
      return { type: 'NamedDestruct', targets, value: this.parseExpr() };
    } else {
      const targets = [];
      while (!this.check('RPAREN') && !this.check('EOF')) {
        if (this.check('TIMES')) {
          const line = this.peek().line;
          this.adv();
          this.rejectSecondRest(targets, line);
          targets.push({ name: this.eat('IDENT').value, rest: true });
        } else if (this.check('ELSE')) {
          // `_` discards a position — decision 23. It already worked in the
          // ARRAY pattern and was an error here, which is an inconsistency
          // between two patterns that say the same thing (DI-16).
          this.adv();
          targets.push({ name: '_', rest: false });
        } else {
          targets.push({ name: this.eat('IDENT').value, rest: false });
        }
        this.match('COMMA');
      }
      this.eat('RPAREN');
      this.eat('ASSIGN');
      return { type: 'TupleDestruct', targets, value: this.parseExpr() };
    }
  }

  parseIf() {
    this.adv();
    const cond = this.parseExpr();
    const then = this.parseBlock();
    const elseifs = [];
    let elseBranch = null;
    while (this.check('ELSEIF')) {
      this.adv();
      elseifs.push({ cond: this.parseExpr(), body: this.parseBlock() });
    }
    if (this.check('ELSE')) {
      this.adv();
      elseBranch = this.parseBlock();
    }
    return { type: 'If', cond, then, elseifs, else: elseBranch };
  }

  parseMatchExpr() {
    this.adv();
    const expr = this.parseExpr();
    this.eat('LBRACE');
    const arms = [];
    while (!this.check('RBRACE') && !this.check('EOF')) {
      arms.push(this.parseMatchArm());
    }
    this.eat('RBRACE');
    return { type: 'Match', expr, arms };
  }

  parseMatchArm() {
    let pattern = this.parseMatchPattern();
    this.eat('FAT_ARROW');
    // The no-bare-comparison restriction (inMatchBody) only applies to the
    // value form (pattern => expr) — there it would swallow the next arm's
    // comparison pattern (e.g. "ice" < 20). A { block } body is unambiguously
    // delimited, so comparisons inside it must parse normally.
    let body;
    if (this.check('LBRACE')) {
      body = { type: 'block', stmts: this.parseBlock() };
    } else {
      this.inMatchBody = true;
      body = { type: 'expr', value: this.parseExpr() };
      this.inMatchBody = false;
    }
    return { pattern, body };
  }

  // Pattern with `||` alternatives: p1 || p2 || p3 (first match wins).
  // Alternatives are top-level only — list elements stay primary patterns.
  parseMatchPattern() {
    const first = this.parseMatchPatternPrimary();
    if (!this.check('OR')) return first;
    const alts = [first];
    while (this.match('OR')) alts.push(this.parseMatchPatternPrimary());
    return { type: 'or', alts };
  }

  parseMatchPatternPrimary() {
    let pattern;
    if (this.check('ELSE')) {
      this.adv();
      pattern = { type: 'wildcard' };
    } else if (this.check('ELSEIF')) {
      this.adv();
      pattern = { type: 'guard', cond: this.parseExpr() };
    } else if (this.check('LBRACKET')) {
      // List pattern: [a, b, *rest] or [1, "x", _]
      this.adv();
      const elems = [];
      while (!this.check('RBRACKET') && !this.check('EOF')) {
        if (this.check('TIMES')) {
          // `??` compares; it does not bind. A pattern element names a *value*
          // to compare against (`?? codigo { umbral => … }` tests `codigo`
          // against the value of `umbral`), and no pattern ever creates a name —
          // `?? [1,2,3] { [a,b,c] => a }` is `undefined variable 'a'` in every
          // engine, this one included.
          //
          // So `*x` has nothing to bind the rest to. All it could contribute is
          // "and some more elements", which is a length test written in the
          // notation of destructuring, and the length test already exists:
          // `?? xs$# { >=3 => … }`. This engine was the only one that accepted
          // the form, and it appeared to work only because an identifier inside
          // a list pattern degraded to a wildcard here (DM-26) — so `[a, *x]`
          // was measuring a named wildcard, not a rest (DM-25).
          throw new ZyError(
            "'*rest' has no meaning in a '??' pattern — a pattern compares, it " +
            'does not bind; for a length test write `?? xs$# { >=3 => … }`',
            this.peek().line);
        } else if (this.check('ELSE')) {
          this.adv();
          elems.push({ kind: 'wildcard' });
        } else if (this.check('IDENT') && (this.peek(1).type === 'COMMA' || this.peek(1).type === 'RBRACKET')) {
          elems.push({ kind: 'bind', name: this.adv().value });
        } else {
          elems.push({ kind: 'literal', expr: this.parseAdditive() });
        }
        this.match('COMMA');
      }
      this.eat('RBRACKET');
      pattern = { type: 'list', elems };
    } else if (['LT','GT','LTE','GTE','EQ','NEQ'].includes(this.peek().type)) {
      const op = this.adv().value;
      pattern = { type: 'comparison', op, value: this.parseAdditive() };
    } else {
      const left = this.parseAdditive();
      if (this.match('RANGE')) {
        pattern = { type: 'range', from: left, to: this.parseAdditive() };
      } else {
        pattern = { type: 'literal', value: left };
      }
    }
    return pattern;
  }

  parseLoop() {
    const line = this.peek().line;
    if (this.check('LBRACE')) {
      return { type: 'Loop', kind: 'infinite', label: null, line, body: this.parseBlock() };
    }
    // `@ (k, v):pares { … }` — a destructuring pattern where a single name
    // would go. It desugars to `@ __zy_par:pares { (k, v) = __zy_par; … }`,
    // reusing the foreach and the destructure unchanged, so the loop stops
    // needing a first line whose only job is to unpack.
    //
    // `@ (` is already taken — `@ (n + 1) { }` is a valid count loop — and the
    // disambiguator is the `:` after the `)`, the same scan `isDestructuring`
    // already does for `=`.
    if ((this.check('LPAREN') || this.check('LBRACKET')) && this.isLoopPattern()) {
      const pat = this.check('LBRACKET') ? this.parseArrayDestructPattern()
                                         : this.parseTupleDestructPattern();
      this.eat('COLON');
      const iterable = this.parseAdditive();
      const body = this.parseBlock();
      const tmp = '__zy_par';
      body.unshift({ ...pat, value: { type: 'Ident', name: tmp, line }, line });
      return { type: 'Loop', kind: 'foreach', label: null, var: tmp, line,
               iterable, pairs: true, body };
    }

    // @ IDENT COLON  → unlabeled range/foreach (@ var:start..end)
    if (this.check('IDENT') && this.peek(1).type === 'COLON') {
      const varName = this.adv().value;
      this.adv();
      const startExpr = this.parseAdditive();
      if (this.match('RANGE')) {
        const endExpr = this.parseAdditive();
        let stepExpr = null;
        if (this.match('COLON')) stepExpr = this.parseAdditive();
        return { type: 'Loop', kind: 'range', label: null, var: varName, line,
                 from: startExpr, to: endExpr, step: stepExpr, body: this.parseBlock() };
      }
      return { type: 'Loop', kind: 'foreach', label: null, var: varName, line,
               iterable: startExpr, body: this.parseBlock() };
    }
    const cond = this.parseExpr();
    return { type: 'Loop', kind: 'while', label: null, cond, line, body: this.parseBlock() };
  }

  parseLabeledLoop() {
    const line = this.peek().line;
    const label = this.adv().value; // consume AT_LABEL token
    if (this.check('LBRACE')) {
      return { type: 'Loop', kind: 'infinite', label, line, body: this.parseBlock() };
    }
    // @label var:start..end
    if (this.check('IDENT') && this.peek(1).type === 'COLON') {
      const varName = this.adv().value;
      this.adv(); // consume ':'
      const startExpr = this.parseAdditive();
      if (this.match('RANGE')) {
        const endExpr = this.parseAdditive();
        let stepExpr = null;
        if (this.match('COLON')) stepExpr = this.parseAdditive();
        return { type: 'Loop', kind: 'range', label, var: varName, line,
                 from: startExpr, to: endExpr, step: stepExpr, body: this.parseBlock() };
      }
      return { type: 'Loop', kind: 'foreach', label, var: varName, line,
               iterable: startExpr, body: this.parseBlock() };
    }
    // @label cond { }
    const cond = this.parseExpr();
    return { type: 'Loop', kind: 'while', label, cond, line, body: this.parseBlock() };
  }

  isFuncDecl() {
    if (this.peek(0).type !== 'IDENT' || this.peek(1).type !== 'LPAREN') return false;
    let i = 2, depth = 1;
    while (this.pos + i < this.toks.length && depth > 0) {
      const t = this.toks[this.pos + i++];
      if (t.type === 'LPAREN') depth++;
      else if (t.type === 'RPAREN') depth--;
    }
    return this.peek(i).type === 'LBRACE';
  }

  parseFuncDecl() {
    const nameTok = this.adv();
    const name = nameTok.value;
    const line = nameTok.line;
    this.eat('LPAREN');
    const params = [];
    while (!this.check('RPAREN') && !this.check('EOF')) {
      const pname = this.eat('IDENT').value;
      let isOut = false;
      if (this.match('RETURN')) isOut = true;
      params.push({ name: pname, isOut });
      this.match('COMMA');
    }
    this.eat('RPAREN');
    return { type: 'FuncDecl', name, params, body: this.parseBlock(), line };
  }

  parseIdentStmt() {
    if (this.isFuncDecl()) return this.parseFuncDecl();

    const tok0 = this.adv();
    const name = tok0.value;
    const hot  = tok0.hot ?? false;
    const line = this.peek().line;

    if (this.match('CONST_ASSIGN')) {
      return { type: 'ConstAssign', name, value: this.parseRHS(), line };
    }

    const compound = { PLUS_EQ:'+', MINUS_EQ:'-', TIMES_EQ:'*', DIV_EQ:'/', MOD_EQ:'%', POW_EQ:'^' };
    const cop = compound[this.peek().type];
    if (cop) { this.adv(); return { type: 'CompoundAssign', name, hot, op: cop, value: this.parseExpr(), line }; }

    if (this.match('INC')) return { type: 'Increment', name, hot, op: '++', line };
    if (this.match('DEC')) return { type: 'Increment', name, hot, op: '--', line };

    if (this.match('ASSIGN')) {
      return { type: 'VarAssign', name, hot, value: this.parseRHS(), line };
    }

    // subscript assign: name[idx] = val
    if (this.check('LBRACKET') && this.peek().line === this.toks[this.pos - 1].line) {
      this.adv();
      const idx = this.parseExpr();
      this.eat('RBRACKET');
      // Decision 6: the indexed assignment is withdrawn, in all three
      // collections. `=` means "this NAME now holds this value", and
      // `u["k"] = v` names nothing — it reaches inside a structure and changes a
      // part. Two different operations under one sign. Modifying is `$~`, which
      // says so.
      //
      // It could not be withdrawn until `u["k"]$~ v` worked as a statement
      // (decision 12), which landed first: prohibiting the old form while the
      // new one did nothing would have left no way to change an element at all.
      if (this.check('ASSIGN') || compound[this.peek().type]) {
        throw new ZyError(
          `indexed assignment does not exist: '${name}[…] =' is not a form of Zymbol\n` +
          `help: use '${name}[i]$~ value' to modify in place — ` +
          `'=' gives a value to a NAME, '$~' changes part of a collection`,
          line);
      }
      // `m[1][2] = 77` — chained brackets. The indexed assignment does not exist
      // at ANY depth, and nesting is navigated with `>`: `m[1>2]`. This engine
      // ran the line and changed nothing — a silent no-op, which is worse than a
      // program that does not compile, and it is the oldest red in the gate.
      //
      // Both halves belong in the message: a reader who wrote this needs the
      // notation as well as the rule.
      if (this.check('LBRACKET')) {
        let i = 0, depth = 0;
        while (this.pos + i < this.toks.length) {
          const t = this.toks[this.pos + i++];
          if (t.type === 'LBRACKET') depth++;
          else if (t.type === 'RBRACKET') { depth--; if (depth === 0 && this.toks[this.pos + i]?.type !== 'LBRACKET') break; }
        }
        const after = this.peek(i)?.type;
        if (after === 'ASSIGN' || compound[after]) {
          throw new ZyError(
            `indexed assignment does not exist: '${name}[…] =' is not a form of Zymbol\n` +
            `help: nesting is navigated with '>', so this is '${name}[i>j]$~ value' — ` +
            `'=' gives a value to a NAME, '$~' changes part of a collection`,
            line);
        }
      }
      // `name[i]$~ v` as a statement. The bracket was consumed above, so the
      // `$~` never reached the nav-index parser that builds FuncUpdate — which
      // is why this form was a silent no-op here while neither Rust engine
      // could even parse it. Build the node directly (decision 12).
      if (this.check('DUPDATE')) {
        this.adv();
        /* BUG-ZYB-002: the value is a whole expression, juxtaposition included — the
           same thing the right-hand side of `=` accepts, because `d[k]$~ v` IS an
           assignment. `parseUnary` took one operand and left the rest of the line to
           be parsed as its own statement, where a bare identifier is a statement with
           no effect and no diagnostic, so `d["a"]$~ "" v` assigned `""` and dropped
           `v` in silence. */
        const val = this.parseExprJuxt();
        const obj = { type: 'Ident', name, line: tok0.line };
        // `m[i>j]$~ v` — the deep form. `parseExpr` above read `i>j` as a
        // COMPARISON, because at statement position the bracket is consumed
        // before the nav parser ever sees it, so `m[1>2]$~ 77` indexed with the
        // boolean and raised "index out of bounds" while both Rust engines
        // navigated two levels. Rebuild the path from the comparison.
        if (idx?.type === 'BinOp' && idx.op === '>') {
          return this.editStmtOrExpr(
            { type: 'DeepUpdate', obj, path: Parser.flattenGtChain(idx), value: val }, line);
        }
        return this.editStmtOrExpr({ type: 'FuncUpdate', obj, index: idx, value: val }, line);
      }
      // `m[i>j]` at STATEMENT position, followed by anything other than `$~`:
      // `parseExpr` above read `i>j` as a COMPARISON, because the bracket is
      // consumed before the nav parser ever sees it. The `$~` branch already
      // rebuilt the path from it; every other edit fell through here with a
      // boolean for an index, so `d["n">"l"]$+ 9` raised "a navigation step is
      // a position or a key, got bool" while both Rust engines navigated two
      // levels. Same rebuild, one branch earlier.
      const spec = (idx?.type === 'BinOp' && idx.op === '>')
        ? { kind: 'path', path: Parser.flattenGtChain(idx) }
        : { kind: 'simple', index: idx };
      let left = { type: 'NavIndex', obj: { type: 'Ident', name, line: tok0.line }, spec };
      return this.editStmtOrExpr(this.parsePostfixRest(left), line);
    }

    let left = { type: 'Ident', name, hot, line: tok0.line };
    return this.editStmtOrExpr(this.parsePostfixRest(left), line);
  }

  // The editing half of the `$` family. The consulting half — `$#`, `$?`, `$[..]`,
  // `$>`, `$|`, `$<`, … — never modifies anything, so discarding its result is
  // dead code (decision 19) and not a modification.
  // `i>j>k` read as a chain of `>` comparisons, rebuilt as a navigation path.
  // Path atoms are `{kind, expr}`, the shape `parseNavContent` produces.
  static flattenGtChain(e) {
    return (e?.type === 'BinOp' && e.op === '>')
      ? [...Parser.flattenGtChain(e.left), ...Parser.flattenGtChain(e.right)]
      : [{ kind: 'index', expr: e }];
  }

  // The CONSULTING half. It always builds and never modifies, so discarding one
  // as a statement is dead code — COLLECTIONS.md § 1, decision 19. It was
  // documented and enforced nowhere: `s$~~["a":"X"]` on its own line ran and
  // changed nothing, in all three engines, with no diagnostic.
  //
  // A list rather than "everything that is not an edit", so a new operator has
  // to be classified deliberately instead of falling into a default. `$!` and
  // `$!!` are not here: propagating an error is an effect.
  static CONSULT_OPS = new Set([
    '$#', '$?', '$??', '$[i..j]', '$[i:n]', '$>', '$|', '$<', '$/', '$*', '$~~',
  ]);

  static EDIT_OPS = new Set([
    '$+', '$++', '$-', '$--', '$+[i]', '$-[i]', '$-[i..j]', '$-[i:n]',
    '$^', '$^+', '$^-',
  ]);

  // Decision 12, the rule of the result: a `$` edit whose result is the whole
  // statement modifies in place; one whose result is used builds and leaves the
  // original alone. Before it, `arr$+ 3` on its own line ran and did nothing at
  // all, with no warning (DI-01).
  //
  // It desugars to `name = <the same expression>`, which is observably identical
  // because collections assign by value and there is no aliasing (DI-04). What
  // the marker carries is the source form, and the tuple guard needs it: `t$+ 3`
  // written as a statement means "modify this tuple", and a tuple does not change.
  //
  // A receiver that is not a plain name yields no statement — `f()[1]$~ 5` would
  // modify a temporary nobody holds (decision 20).
  // The editing `$` operators, by node shape — shared by the in-place rule and
  // by the refusal of an edit that has nowhere to land.
  static isEditNode(e) {
    return (e?.type === 'CollectionOp' && Parser.EDIT_OPS.has(e.op)) ||
           e?.type === 'FuncUpdate' || e?.type === 'DeepUpdate';
  }

  editStmtOrExpr(expr, line) {
    const isEdit =
      (expr?.type === 'CollectionOp' && Parser.EDIT_OPS.has(expr.op)) ||
      expr?.type === 'FuncUpdate' || expr?.type === 'DeepUpdate';
    // In-place editing desugars to `name = <the same expression>`, and the
    // expression returns the RECEIVER it edited. That is exact only when the
    // receiver IS the name. When the receiver lives inside it — `d.x$+ 3`,
    // `d.x["y"]$~ 5` — assigning the inner collection to the outer name
    // replaces the whole thing, which was a silent data-destruction bug:
    // `d["x"]["y"]$~ 9` left `d` holding `(y: 9)` with every other key gone,
    // exit 0, no diagnostic. So a receiver with a path becomes a deep write at
    // that path, which is machinery this engine already has.
    //
    // A bracket directly after a bracket is refused: `d["x"]["y"]` is the deep
    // navigator spelled twice and `d["x">"y"]` is the form. The dot composes
    // freely — a different syntax, not a second spelling of the same one.
    const CHAINED = 'a bracket after a bracket is what the navigator is for: write `d["x">"y"]$~ value`';
    const RANGE_STEP = 'a write reaches one place, so its path has no ranges';
    const NO_NAME = 'this edits what the expression produced, and nothing holds it — assign the result to a name first';
    const flatten = (e) => {
      const steps = [];
      const go = (n) => {
        if (!n) return { err: NO_NAME };
        if (n.type === 'Ident') return n.name;
        if (n.type === 'NavIndex') {
          if (n.obj?.type === 'NavIndex') return { err: CHAINED };
          const root = go(n.obj);
          if (typeof root !== 'string') return root;
          if (n.spec.kind === 'simple') steps.push({ kind: 'index', expr: n.spec.index });
          else if (n.spec.kind === 'path') {
            for (const a of n.spec.path) {
              if (a.kind === 'range') return { err: RANGE_STEP };
              steps.push(a);
            }
          } else return { err: NO_NAME };
          return root;
        }
        if (n.type === 'FieldAccess' && !n.scoped) {
          const root = go(n.obj);
          if (typeof root !== 'string') return root;
          steps.push({ kind: 'index', key: n.field });
          return root;
        }
        return { err: NO_NAME };
      };
      const r = go(e);
      return typeof r === 'string' ? { root: r, steps } : r;
    };

    if (isEdit) {
      // `$~` keeps its final access beside the receiver rather than inside it,
      // so the bracket-after-bracket rule has to be asked here too: in
      // `d["x"]["y"]$~ 5` the node is FuncUpdate{obj: NavIndex, index}, and
      // `flatten` only ever sees the NavIndex. A key means the access was a
      // dot, which composes.
      if ((expr.type === 'FuncUpdate' && expr.key === undefined && expr.obj?.type === 'NavIndex')
          || (expr.type === 'DeepUpdate' && expr.obj?.type === 'NavIndex')) {
        throw new ZyError(`this edit has nothing to write into\nhelp: ${CHAINED}`, line);
      }
      const f = flatten(expr.obj);
      // Decision 20: an edit with nowhere to write is refused, rather than run
      // for a result nothing holds.
      if (f.err) throw new ZyError(`this edit has nothing to write into\nhelp: ${f.err}`, line);
      if (f.steps.length === 0) return { type: 'InPlaceEdit', name: f.root, expr, line };

      // The receiver is inside the name. `$~` carries its own final step, so it
      // moves onto the whole path; every other edit keeps its shape and is put
      // back where it came from.
      const obj = { type: 'Ident', name: f.root, line };
      if (expr.type === 'FuncUpdate') {
        const last = expr.key !== undefined
          ? { kind: 'index', key: expr.key }
          : { kind: 'index', expr: expr.index };
        const deep = { type: 'DeepUpdate', obj, path: [...f.steps, last], value: expr.value };
        return { type: 'InPlaceEdit', name: f.root, expr: deep, line };
      }
      if (expr.type === 'DeepUpdate') {
        const deep = { type: 'DeepUpdate', obj, path: [...f.steps, ...expr.path], value: expr.value };
        return { type: 'InPlaceEdit', name: f.root, expr: deep, line };
      }
      const deep = { type: 'DeepUpdate', obj, path: f.steps, value: expr };
      return { type: 'InPlaceEdit', name: f.root, expr: deep, line };
    }
    return { type: 'ExprStmt', expr };
  }

  // Parse an expression in a delimited position — a call argument, an array
  // element, a tuple element or a grouped expression — allowing implicit
  // concatenation there too: f(" " label(k) value)  [a " " b]  (a " " b)
  // Unlike parseRHS, a following '(' never continues the chain here: it is
  // ambiguous with a lambda, a tuple and a grouped expression (HLZ-007).
  parseExprJuxt() {
    const firstLine = this.peek().line;
    const first = this.parseExpr();
    const juxtStart = new Set(['STR', 'IDENT', 'NUM', 'FLOAT', 'CHAR', 'BOOL']);
    const items = [first];
    while (this.peek().line === firstLine && juxtStart.has(this.peek().type)) {
      items.push(this.parseExpr());
    }
    if (items.length === 1) return first;
    return { type: 'ImplicitConcat', items };
  }

  parseRHS() {
    const firstLine = this.peek().line;
    const first = this.parseExpr();
    if (this.check('COMMA')) {
      const items = [first];
      while (this.match('COMMA')) items.push(this.parseExpr());
      return { type: 'CommaJoin', items };
    }
    // Implicit string concatenation: collect multiple expressions on the same line
    const implicitExprStart = new Set(['STR','IDENT','NUM','FLOAT','CHAR','BOOL','LPAREN','LBRACKET','MINUS','NOT','CAST_FLOAT','CAST_INT_ROUND','CAST_INT_TRUNC','DATA_OP','MATCH','ELSE']);
    const items = [first];
    while (this.peek().line === firstLine && implicitExprStart.has(this.peek().type)) {
      items.push(this.parseExpr());
    }
    if (items.length === 1) return first;
    return { type: 'ImplicitConcat', items };
  }

  // ─── Expression grammar ──────────────────────────────────────────────────

  parseExpr() {
    if (this.isLambdaStart()) return this.parseLambda();
    return this.parsePipe();
  }

  isLambdaStart() {
    if (this.peek(0).type === 'IDENT' && this.peek(1).type === 'ARROW') return true;
    if (this.peek(0).type !== 'LPAREN') return false;
    let i = 1, depth = 1;
    while (depth > 0 && this.pos + i < this.toks.length) {
      const t = this.toks[this.pos + i++];
      if (t.type === 'LPAREN') depth++;
      else if (t.type === 'RPAREN') depth--;
    }
    if (this.peek(i).type === 'ARROW') return true;
    i = 1;
    while (this.pos + i < this.toks.length) {
      const t = this.toks[this.pos + i];
      if (t.type === 'ARROW') return true;
      if (t.type === 'RPAREN' || t.type === 'EOF') return false;
      if (t.type !== 'IDENT' && t.type !== 'COMMA') return false;
      i++;
    }
    return false;
  }

  parseLambda() {
    const params = [];
    let parensWrapped = false;
    if (this.check('LPAREN')) {
      this.adv();
      while (!this.check('RPAREN') && !this.check('ARROW') && !this.check('EOF')) {
        params.push(this.eat('IDENT').value);
        this.match('COMMA');
      }
      if (this.check('RPAREN')) {
        // (params) -> body form: consume ')' before '->'
        this.adv();
      } else {
        // (params -> body) form: closing ')' comes after body
        parensWrapped = true;
      }
    } else {
      params.push(this.adv().value);
    }
    this.eat('ARROW');
    const body = this.check('LBRACE')
      ? { type: 'block', stmts: this.parseBlock() }
      : { type: 'expr',  value: this.parseExpr() };
    if (parensWrapped) this.match('RPAREN');
    return { type: 'Lambda', params, body };
  }

  parsePipe() {
    let left = this.parseOr();
    while (this.match('PIPE')) {
      const rhs = this.parseOr();
      left = { type: 'Pipe', value: left, rhs };
    }
    return left;
  }

  parseOr()             { return this.parseBinLeft(['OR'],  () => this.parseAnd()); }
  parseAnd()            { return this.parseBinLeft(['AND'], () => this.parseComparison()); }
  parseComparison() {
    let left = this.parseAdditive();
    if (this.inMatchBody) return left;
    const cmp = { EQ:'==', NEQ:'<>', LT:'<', GT:'>', LTE:'<=', GTE:'>=' };
    const op  = cmp[this.peek().type];
    if (op) { this.adv(); left = { type:'BinOp', op, left, right: this.parseAdditive() }; }
    return left;
  }
  parseAdditive()       { return this.parseBinLeft(['PLUS','MINUS'], () => this.parseMultiplicative()); }
  parseMultiplicative() { return this.parseBinLeft(['TIMES','DIV','MOD'], () => this.parseExponent()); }
  // `^` is right-associative, so `2 ^ 3 ^ 2` is 2^(3^2) = 512, not (2^3)^2 = 64.
  // Recursing on the right is what makes that so; the `if` this replaced parsed
  // exactly one `^` and then failed on the second ("Expected RPAREN, got '^'").
  parseExponent() {
    const left = this.parseUnary();
    if (this.match('POW')) return { type:'BinOp', op:'^', left, right: this.parseExponent() };
    return left;
  }

  parseBinLeft(tokenTypes, sub) {
    const opMap = { OR:'||', AND:'&&', PLUS:'+', MINUS:'-', TIMES:'*', DIV:'/', MOD:'%' };
    let left = sub();
    while (tokenTypes.includes(this.peek().type)) {
      const op = opMap[this.adv().type] ?? this.toks[this.pos - 1].value;
      left = { type: 'BinOp', op, left, right: sub() };
    }
    return left;
  }

  parseUnary(noCollectionChain) {
    if (this.match('MINUS')) return { type: 'UnaryOp', op: '-', operand: this.parseUnary() };
    if (this.match('NOT'))   return { type: 'UnaryOp', op: '!', operand: this.parseUnary() };
    if (noCollectionChain && this.isLambdaStart()) return this.parseLambda();
    return noCollectionChain ? this.parsePostfixNoChain() : this.parsePostfix();
  }

  parsePostfix() {
    return this.parsePostfixRest(this.parsePrimary());
  }

  parsePostfixNoChain() {
    const primary = this.parsePrimary();
    const sameLine = () => this.peek().line === (this.toks[this.pos - 1]?.line ?? this.peek().line);
    let left = primary;
    while (true) {
      if (this.check('LBRACKET') && sameLine()) {
        this.adv(); const spec = this.parseNavContent(); this.eat('RBRACKET');
        left = { type: 'NavIndex', obj: left, spec };
      } else if (this.check('DOT') || this.check('SCOPE')) {
        // Record which operator produced this node. `::` and `.` build the same shape but
        // are not interchangeable: `alias::fn` and `alias.CONST` address the module
        // namespace, while `tuple.field` addresses a value. Collapsing them lost that
        // distinction, so a local variable sharing a module alias's name shadowed the
        // module and any `alias::fn(...)` after it failed — see eval's FieldAccess case.
        const scoped = this.check('SCOPE');
        this.adv(); const field = this.eat('IDENT').value;
        left = { type: 'FieldAccess', obj: left, field, scoped };
      } else if (this.check('LPAREN') && sameLine() && left.type === 'Ident') {
        this.adv(); const args = this.parseArgList(); this.eat('RPAREN');
        left = { type: 'Call', callee: left.name, args };
      } else if (this.check('LPAREN') && sameLine() && left.type !== 'Ident') {
        this.adv(); const args = this.parseArgList(); this.eat('RPAREN');
        left = { type: 'CallExpr', callee: left, args };
      } else break;
    }
    return left;
  }

  parsePostfixRest(left) {
    const COL_TOKENS = new Set(['DLEN','DAPPEND','DAPPEND_AT','DREMOVEALL','DREMOVE',
      'DFINDALL','DCONTAINS','DSORTASC','DSORTDESC','DSORT',
      'DMAP','DFILTER','DREDUCE','DSLICE','DERROR','DERRORPROP','DREPLACE',
      'DSPLIT','DCONCATBUILD','DREPEAT']);

    while (true) {
      const sameLine = () => this.peek().line === (this.toks[this.pos - 1]?.line ?? this.peek().line);

      if (this.check('LBRACKET') && sameLine()) {
        this.adv();
        const spec = this.parseNavContent();
        this.eat('RBRACKET');
        if ((spec.kind === 'simple' || spec.kind === 'path') && this.check('DUPDATE')) {
          this.adv();
          // See BUG-ZYB-002 above: the value is a full expression.
          const val = this.parseExprJuxt();
          if (spec.kind === 'simple') {
            // arr[i]$~ val — single-level functional update
            left = { type: 'FuncUpdate', obj: left, index: spec.index, value: val };
          } else {
            // arr[i>j]$~ val — deep functional update (G1)
            left = { type: 'DeepUpdate', obj: left, path: spec.path, value: val };
          }
        } else {
          left = { type: 'NavIndex', obj: left, spec };
        }

      } else if (this.check('DOT') || this.check('SCOPE')) {
        const scoped = this.check('SCOPE');
        this.adv();
        const field = this.eat('IDENT').value;
        // `d.k$~ v` writes exactly as `d["k"]$~ v` does. The dot is how
        // COLLECTIONS.md spells reaching a key that is an identifier, and
        // nothing ever said it could only read — the asymmetry was inherited.
        // `::` addresses a module namespace, which is not a place, so it is out.
        // Carrying the key as a plain string rather than a synthesised literal
        // node keeps it out of the checker's expression walk.
        if (!scoped && this.check('DUPDATE')) {
          this.adv();
          const val = this.parseExprJuxt();
          left = { type: 'FuncUpdate', obj: left, key: field, value: val };
        } else {
          left = { type: 'FieldAccess', obj: left, field, scoped };
        }

      } else if (this.check('LPAREN') && sameLine() && left.type === 'Ident') {
        this.adv();
        const args = this.parseArgList();
        this.eat('RPAREN');
        left = { type: 'Call', callee: left.name, args };

      } else if (this.check('LPAREN') && sameLine() && left.type !== 'Ident' && left.type !== 'Literal') {
        this.adv();
        const args = this.parseArgList();
        this.eat('RPAREN');
        left = { type: 'CallExpr', callee: left, args };

      } else if (COL_TOKENS.has(this.peek().type)) {
        left = this.parseCollectionOp(left);

      } else if (this.check('TYPE_QUERY')) {
        this.adv();
        left = { type: 'TypeMetadata', obj: left };

      } else {
        break;
      }
    }
    return left;
  }

  // ─── Navigation index parsing ─────────────────────────────────────────────

  // Called after consuming '['. Returns a spec object for NavIndex.
  parseNavContent() {
    // Structured nav: [[g1] ; [g2]] — starts with '['
    if (this.check('LBRACKET')) {
      return this.parseNavStructured();
    }

    // Parse first nav atom (uses additive, not full comparison, so '>' is nav separator)
    const firstAtom = this.parseNavAtom();

    // nav path or flat extraction?
    if (this.check('GT') || this.check('SEMI')) {
      return this.parseNavContinue(firstAtom);
    }

    // Simple subscript: single index, no nav ops
    if (firstAtom.kind === 'index') {
      return { kind: 'simple', index: firstAtom.expr };
    }
    // Single range at top level (unusual) → flat
    return { kind: 'flat', paths: [[firstAtom]] };
  }

  // Parse a nav atom: additive expr, optionally followed by '..' range
  parseNavAtom() {
    const expr = this.parseAdditive();
    if (this.match('RANGE')) {
      const to = this.parseAdditive();
      return { kind: 'range', from: expr, to };
    }
    return { kind: 'index', expr };
  }

  // Continue parsing after the first atom — GT means nav path, SEMI means flat
  parseNavContinue(firstAtom) {
    // Build first path (starting with firstAtom)
    const firstPath = [firstAtom];
    while (this.match('GT')) firstPath.push(this.parseNavAtom());

    if (!this.check('SEMI')) {
      // Single nav path
      return { kind: 'path', path: firstPath };
    }

    // Multiple paths separated by ';' — flat extraction
    const paths = [firstPath];
    while (this.match('SEMI')) {
      const path = [this.parseNavAtom()];
      while (this.match('GT')) path.push(this.parseNavAtom());
      paths.push(path);
    }
    return { kind: 'flat', paths };
  }

  // Parse structured nav: [[g1,g2] ; [g3,g4]] — already past outer '['
  parseNavStructured() {
    const groups = [];
    do {
      this.eat('LBRACKET');
      const paths = [];
      do {
        const path = [this.parseNavAtom()];
        while (this.match('GT')) path.push(this.parseNavAtom());
        paths.push(path);
      } while (this.match('COMMA'));
      this.eat('RBRACKET');
      groups.push({ paths });
    } while (this.match('SEMI'));
    return { kind: 'structured', groups };
  }

  // ─── Collection ops ───────────────────────────────────────────────────────

  parseCollectionOp(left) {
    const op = this.adv().type;

    switch (op) {
      case 'DLEN':
        return { type: 'CollectionOp', op: '$#', obj: left };

      case 'DAPPEND_AT': {
        // `$+[i] val` — the '[' was glued to the '$+', so this is the insert.
        this.eat('LBRACKET');
        const idx = this.parseExpr(); this.eat('RBRACKET');
        return { type: 'CollectionOp', op: '$+[i]', obj: left, index: idx, arg: this.parseUnary(true) };
      }

      case 'DAPPEND':
        // Use parseUnary(true) to prevent right-nesting: arr$+4$+5 → (arr$+4)$+5 not arr$+(4$+5)
        return { type: 'CollectionOp', op: '$+', obj: left, arg: this.parseUnary(true) };

      case 'DREMOVEALL':
        return { type: 'CollectionOp', op: '$--', obj: left, arg: this.parseUnary() };

      case 'DREMOVE':
        if (this.check('LBRACKET')) {
          this.adv();
          // Open-start: $-[..N]
          if (this.match('RANGE')) {
            const to = this.parseExpr(); this.eat('RBRACKET');
            return { type: 'CollectionOp', op: '$-[i..j]', obj: left, range: { from: null, to } };
          }
          const from = this.parseExpr();
          if (this.match('RANGE')) {
            // Open-end: $-[N..]  or  $-[N..M]
            const toNode = (!this.check('RBRACKET')) ? this.parseExpr() : null;
            this.eat('RBRACKET');
            return { type: 'CollectionOp', op: '$-[i..j]', obj: left, range: { from, to: toNode } };
          }
          if (this.match('COLON')) {
            // Count-based: $-[start:count]
            const count = this.parseExpr(); this.eat('RBRACKET');
            return { type: 'CollectionOp', op: '$-[i:n]', obj: left, start: from, count };
          }
          this.eat('RBRACKET');
          return { type: 'CollectionOp', op: '$-[i]', obj: left, index: from };
        }
        return { type: 'CollectionOp', op: '$-', obj: left, arg: this.parseUnary() };

      case 'DFINDALL':
        return { type: 'CollectionOp', op: '$??', obj: left, arg: this.parseUnary() };

      case 'DCONTAINS':
        return { type: 'CollectionOp', op: '$?', obj: left, arg: this.parseUnary() };

      case 'DUPDATE':
        this.eat('LBRACKET');
        { const idx = this.parseExpr(); this.eat('RBRACKET');
          // See BUG-ZYB-002 above: the value is a full expression.
          return { type: 'CollectionOp', op: '$~', obj: left, index: idx, arg: this.parseExprJuxt() }; }

      case 'DSORTASC':   return { type: 'CollectionOp', op: '$^+', obj: left };
      case 'DSORTDESC':  return { type: 'CollectionOp', op: '$^-', obj: left };
      case 'DSORT':      return { type: 'CollectionOp', op: '$^',  obj: left, arg: this.parseUnary() };

      case 'DMAP':       return { type: 'CollectionOp', op: '$>',  obj: left, arg: this.parseUnary(true) };
      case 'DFILTER':    return { type: 'CollectionOp', op: '$|',  obj: left, arg: this.parseUnary(true) };

      case 'DREDUCE':
        this.eat('LPAREN');
        { const init = this.parseExpr(); this.eat('COMMA');
          const fn   = this.parseExpr(); this.eat('RPAREN');
          return { type: 'CollectionOp', op: '$<', obj: left, init, arg: fn }; }

      case 'DSLICE':
        this.eat('LBRACKET');
        // $[start..end], $[..end] (open-start), $[start..] (open-end), $[start:count]
        { const from = this.check('RANGE') ? null : this.parseExpr();
          if (this.match('RANGE')) {
            const to = this.check('RBRACKET') ? null : this.parseExpr();
            this.eat('RBRACKET');
            return { type: 'CollectionOp', op: '$[i..j]', obj: left, range: { from, to } };
          }
          this.eat('COLON');
          const count = this.parseExpr(); this.eat('RBRACKET');
          return { type: 'CollectionOp', op: '$[i:n]', obj: left, range: { from, count } }; }

      case 'DERROR':
        return { type: 'CollectionOp', op: '$!', obj: left };

      case 'DERRORPROP':
        return { type: 'CollectionOp', op: '$!!', obj: left };

      case 'DREPLACE':
        this.eat('LBRACKET');
        { const from = this.parseExpr(); this.eat('COLON');
          const to   = this.parseExpr();
          const count = this.match('COLON') ? this.parseExpr() : null;
          this.eat('RBRACKET');
          return { type: 'CollectionOp', op: '$~~', obj: left, from, to, count }; }

      case 'DSPLIT':
        return { type: 'CollectionOp', op: '$/', obj: left, arg: this.parseUnary() };

      case 'DREPEAT':
        return { type: 'CollectionOp', op: '$*', obj: left, arg: this.parseUnary() };

      case 'DCONCATBUILD': {
        const opLine = this.toks[this.pos - 1].line;
        const items = [];
        // What can START another operand. `LBRACKET` is deliberately absent:
        // both Rust engines stop before a `[`, so `s$++[5:"!!!"]` leaves the
        // bracket at statement level and is refused there. Accepting it here
        // made this engine RUN two programs the CLI rejects — `"hola"$++[5:"!!"]`
        // printed `hola[5, !!]`, an answer nobody could get from the CLI.
        //
        // A variable holding an array is fine, in every engine: `a$++ b`. The
        // rule is about the literal, which is where a stray bracket shows up.
        const canStart = () => {
          const t = this.peek().type;
          return ['NUM','FLOAT','BOOL','CHAR','STR','IDENT','LPAREN','ELSE',
                  'CAST_FLOAT','CAST_INT_ROUND','CAST_INT_TRUNC'].includes(t);
        };
        while (this.peek().line === opLine && !this.check('PILCROW') &&
               !this.check('RBRACE') && !this.check('EOF') && canStart()) {
          items.push(this.parsePostfix());
        }
        return { type: 'CollectionOp', op: '$++', obj: left, items };
      }

      default:
        return left;
    }
  }

  parseKeyInput(blocking) {
    this.adv(); // consume <<| or <<|?
    const v = this.eat('IDENT');
    return { type: 'KeyInput', variable: v.value, blocking };
  }

  parseTuiBlock() {
    this.adv(); // consume >>|
    const body = this.parseBlock();
    return { type: 'TuiBlock', body };
  }

  parseOutputPos() {
    const opLine = this.adv().line; // consume >>~
    let slots;
    if (this.check('LPAREN')) {
      this.adv(); // consume (
      slots = [];
      while (!this.check('RPAREN') && !this.check('EOF')) {
        if (this.check('COMMA')) { slots.push(null); this.adv(); }
        else { slots.push(this.parseExpr()); if (this.check('COMMA')) this.adv(); }
        if (slots.length > 5) throw new Error('>>~ position has at most 5 slots');
      }
      this.eat('RPAREN');
    } else {
      const name = this.eat('IDENT').value;
      slots = [{ type: 'Ident', name, hot: false }]; // sentinel: variable mode
    }
    this.eat('GT'); // consume >
    const items = [];
    while (!this.check('PILCROW') && !this.check('RBRACE') &&
           !this.check('EOF') && this.peek().line === opLine) {
      items.push(this.parseExpr());
    }
    return { type: 'OutputPos', slots, items };
  }

  // Returns the arguments, with the indices written `x<~` recorded on the array
  // as `outArgs` — the call-site output mark (REFERENCE.md L36). Carried beside
  // the list rather than wrapping each argument, so every existing reader of
  // `args` keeps working unchanged.
  parseArgList() {
    const args = [];
    const outArgs = [];
    while (!this.check('RPAREN') && !this.check('EOF')) {
      args.push(this.parseExprJuxt());
      if (this.check('RETURN')) { this.adv(); outArgs.push(args.length - 1); }
      this.match('COMMA');
    }
    args.outArgs = outArgs;
    return args;
  }

  parsePrimary() {
    if (this.peek().type === 'LPAREN' && this.isLambdaStart()) return this.parseLambda();

    const t = this.peek();

    if (t.type === 'NUM')   { this.adv(); return { type: 'Literal', kind: 'int',   value: t.value }; }
    if (t.type === 'FLOAT') { this.adv(); return { type: 'Literal', kind: 'float', value: t.value }; }
    if (t.type === 'BOOL')  { this.adv(); return { type: 'Literal', kind: 'bool',  value: t.value }; }
    if (t.type === 'CHAR')  { this.adv(); return { type: 'Literal', kind: 'char',  value: t.value }; }
    if (t.type === 'STR')   { this.adv(); return { type: 'Literal', kind: 'str',   value: t.value }; }
    // `##_` — the Unit literal (GAP-ZYB-009). The evaluator already had the
    // `unit` case; the value was reachable long before it could be written.
    if (t.type === 'UNIT')  { this.adv(); return { type: 'Literal', kind: 'unit' }; }
    if (t.type === 'IDENT')        { this.adv(); return { type: 'Ident',       name: t.value, hot: t.hot ?? false, line: t.line }; }
    if (t.type === 'ELSE')         { this.adv(); return { type: 'Ident',       name: '_'      }; }
    if (t.type === 'OUTPUT_QUERY') { this.adv(); return { type: 'TerminalSize' }; }
    if (t.type === 'BASHEXEC')    { const tok = this.adv(); return { type: 'BashExec', cmd: tok.value }; }
    if (t.type === 'MATCH') { return this.parseMatchExpr(); }

    // Cast operators: ##. ### ##!
    if (t.type === 'CAST_FLOAT')     { this.adv(); return { type: 'CastOp', op: '##.', operand: this.parseUnary() }; }
    if (t.type === 'CAST_INT_ROUND') { this.adv(); return { type: 'CastOp', op: '###', operand: this.parseUnary() }; }
    if (t.type === 'CAST_INT_TRUNC') { this.adv(); return { type: 'CastOp', op: '##!', operand: this.parseUnary() }; }

    // `#[…]` — an array whose mix of element types is DECLARED (decision 15).
    // Same collection and same type as `[…]`: `#?` answers `##]` for both. What
    // changes is that the checker below does not compare the elements — and
    // that it warns when the mix turns out not to be one (decision 18).
    if (t.type === 'HASH' && this.peek(1).type === 'LBRACKET') {
      this.adv();
      const arr = this.parsePrimary();
      return { ...arr, declaredMixed: true };
    }

    if (t.type === 'LBRACKET') {
      this.adv();
      const items = [];
      const line = t.line;
      while (!this.check('RBRACKET') && !this.check('EOF')) {
        items.push(this.parseExprJuxt());
        this.match('COMMA');
      }
      this.eat('RBRACKET');
      return { type: 'Array', items, line };
    }

    // `#(…)` — dictionary literal. The mark says which of the two things the
    // parentheses open, so `#()` is the empty dictionary and no lookahead
    // decides anything. Keys may be strings as well as bare names:
    // `d["gasto.alimentación"]$~ v` always added such a key and only the
    // literal could not spell it.
    if (t.type === 'HASH_LPAREN') {
      this.adv();
      const line = t.line;
      const items = [], keys = [];
      if (this.check('RPAREN')) {
        this.adv();
        return { type: 'Tuple', items, keys, line };
      }
      for (;;) {
        if (!((this.check('IDENT') || this.check('STR')) && this.peek(1).type === 'COLON')) {
          throw new ZyStaticError(
            'expected a key in the dictionary: #(nombre: valor) or #("con.puntos": valor)',
            this.peek().line);
        }
        const keyTok = this.adv();
        if (keyTok.type === 'IDENT') {
          keys.push(keyTok.value);
        } else {
          // A string key is lexed as interpolation parts. A key is a constant,
          // so only literal parts are accepted — `#("{n}": v)` would give the
          // literal a different shape on every run.
          const parts = keyTok.value ?? [];
          if (parts.some(pt => pt.t !== 'lit')) {
            throw new ZyStaticError(
              'a dictionary key cannot interpolate — use `d[…]$~ value` to add a computed key',
              keyTok.line);
          }
          keys.push(parts.map(pt => pt.v).join(''));
        }
        this.adv(); // consume ':'
        items.push(this.parseExprJuxt());
        if (!this.match('COMMA')) break;
        if (this.check('RPAREN')) break;   // trailing comma
      }
      this.eat('RPAREN');
      return { type: 'Tuple', items, keys, line };
    }

    if (t.type === 'LPAREN') {
      this.adv();
      if (this.check('RPAREN')) { this.adv(); return { type: 'Literal', kind: 'unit' }; }

      // A dictionary is written `#(…)`. The bare form was how it was written
      // until v0.0.9, when the colon was the whole of what told `(a: 1)` from
      // `(1, 2)` — and the empty dictionary could not be written at all,
      // because `()` would have to be both. Refused rather than accepted
      // quietly: two spellings for one thing is what the mark ended.
      if (this.check('IDENT') && this.peek(1).type === 'COLON') {
        throw new ZyStaticError(
          'a dictionary is written `#(…)`: write `#(` here, as in #(nombre: valor). ' +
          'A bare `(…)` is a positional tuple, and `#()` is the empty dictionary — ' +
          'which `()` cannot be, since it would have to be the empty tuple as well',
          t.line);
      }
      const firstKey = null;
      const firstVal = this.parseExprJuxt();
      if (this.check('COMMA') || firstKey !== null) {
        const items = [firstVal];
        const keys  = [firstKey];
        while (this.match('COMMA')) {
          if (this.check('RPAREN')) break;
          let key = null;
          if (this.check('IDENT') && this.peek(1).type === 'COLON') {
            key = this.adv().value;
            this.adv();
          }
          items.push(this.parseExprJuxt());
          keys.push(key);
        }
        this.eat('RPAREN');
        const named = keys.some(k => k !== null);
        return { type: 'Tuple', items, keys: named ? keys : null };
      }
      this.eat('RPAREN');
      return firstVal;
    }

    if (t.type === 'DATA_OP') {
      this.adv();
      const arg = this.parseExpr();
      this.eat('VBAR');
      // GAP-ZYB-001: a count written as a name is kept as an expression and
      // evaluated when the program runs; a written count stays a number.
      const precExpr = t.value.dynPrec
        ? { type: 'Ident', name: String(t.value.prec), line: t.line }
        : null;
      return { type: 'DataOp', kind: t.value.kind, prec: t.value.prec, precExpr, arg };
    }

    this.adv();
    return { type: 'Literal', kind: 'unit' };
  }
}

// ─── Environment ──────────────────────────────────────────────────────────────

class Env {
  constructor(parent = null, funcBoundary = false, isModuleScope = false) {
    this.vars          = new Map();
    this.consts        = new Set();
    this.parent        = parent;
    this.funcBoundary  = funcBoundary;
    this.isModuleScope = isModuleScope;
  }

  get(name) {
    if (this.vars.has(name)) return this.vars.get(name);
    if (!this.parent) throw new ZyError(`'${name}' is undefined — did you mean '${name}°' (hot definition)?`);
    if (this.funcBoundary) {
      const v = this.parent._getFuncOnly(name);
      if (v !== undefined) return v;
      throw new ZyError(`'${name}' is undefined — did you mean '${name}°' (hot definition)?`);
    }
    if (name.startsWith('_')) {
      // _ vars can't escape block scopes — but _ names defined at module scope
      // (past any funcBoundary) are module-private and accessible from within the module.
      const v = this._findPastBoundary(name);
      if (v !== undefined) return v;
      throw new ZyRuntimeError(`cannot access underscore variable '${name}' from inner scope`, '##Scope');
    }
    return this.parent.get(name);
  }

  _findPastBoundary(name) {
    // Module scope: _ names here are module-private, accessible from within the module
    if (this.isModuleScope && this.vars.has(name)) return this.vars.get(name);
    if (this.funcBoundary) return this.parent ? this.parent._findUnrestricted(name) : undefined;
    return this.parent ? this.parent._findPastBoundary(name) : undefined;
  }

  _findUnrestricted(name) {
    if (this.vars.has(name)) return this.vars.get(name);
    return this.parent ? this.parent._findUnrestricted(name) : undefined;
  }

  _getFuncOnly(name) {
    if (this.vars.has(name)) {
      const v = this.vars.get(name);
      if (v.type === 'func' || v.type === 'module') return v;
      // Root-scope constants resolve at any call depth (MM-9, settled for the
      // Rust engines in v0.0.8): `K := 5` is readable inside a function called
      // from a function. Only constants, and only where the chain ends — a plain
      // variable still cannot be seen across a function boundary.
      if (this.consts.has(name) && !this.parent) return v;
      return undefined;
    }
    if (this.parent) return this.parent._getFuncOnly(name);
    return undefined;
  }

  set(name, value) {
    if (this.vars.has(name)) {
      if (this.consts.has(name)) throw new ZyError(`Cannot reassign constant '${name}'`);
      this.vars.set(name, value);
      return true;
    }
    if (name.startsWith('_')) return false;
    if (this.funcBoundary) return false;
    if (this.parent && this.parent.set(name, value)) return true;
    return false;
  }

  def(name, value, isConst = false) {
    this.vars.set(name, value);
    if (isConst) this.consts.add(name);
  }

  hotDef(name, value) {
    // Walk to nearest function boundary or root so hot-def vars survive loop iterations
    let scope = this;
    while (scope.parent && !scope.funcBoundary) scope = scope.parent;
    scope.vars.set(name, value);
  }

  has(name) {
    return this.vars.has(name) || (this.parent ? this.parent.has(name) : false);
  }

  destroy(name) {
    if (this.vars.has(name)) {
      this.vars.delete(name);
      this.consts.delete(name);
      return true;
    }
    if (this.parent) return this.parent.destroy(name);
    return false;
  }
}

// ─── Checker ──────────────────────────────────────────────────────────────────

function formatDiagnostic(d) {
  return `${d.severity}: ${d.message}`;
}

class Checker {
  constructor(ast) {
    this.ast         = ast;
    this.diagnostics = [];
    this.stack       = [];
    this.pendingHot  = false; // prefix hot-def sentinel (°name)
    this.funcDepth   = 0;     // >0 inside a function or lambda body — see lifetimeWarnForIterator
    this.lifetimeWarned = new Set();
    // One entry per enclosing @ loop, innermost last; null for an unlabelled
    // loop. Emptied at a function or lambda boundary, because a callee does not
    // see the caller's loops. See checkLoopControl.
    this.loopLabels  = [];
    // Argument-count tables, filled by collectArities() before any statement is
    // checked, so a call may precede the declaration it names.
    //   funcArity : local function name  → parameter count
    //   aliasPath : import alias         → module path ('std/math', './lib')
    //   reassigned: names later bound to something else, so `f(…)` is no longer
    //               known to be that function and is left unchecked
    this.funcArity  = new Map();
    //   funcOutSlots : local function name → indices of its `<~` parameters
    this.funcOutSlots = new Map();
    this.aliasPath  = new Map();
    this.reassigned = new Set();
    // alias → (function → arity) for user modules. Empty unless a caller
    // supplies it; a qualified call is left unchecked rather than guessed at,
    // exactly as TypeChecker::set_module_arities does in Rust.
    this.moduleArities = new Map();
    //   moduleOutSlots : alias → (function → indices of its `<~` parameters)
    this.moduleOutSlots = new Map();
  }

  /**
   * Argument counts, checked the way `zymbol check` has checked them since
   * v0.0.9 (crates/zymbol-semantic/src/type_check.rs).
   *
   * The browser engine had no such check, so `math::sqrt(4.0, 9.0)` printed `2`
   * in the playground and was refused outright by the CLI — the same program,
   * two answers, on the tool people reach for first.
   *
   * A variadic function (arity -1, e.g. `math::log`) accepts any count.
   */
  checkArity(name, expected, actual, line) {
    if (expected < 0 || expected === actual) return;
    this.error('E016',
      `function '${name}' expects ${expected} argument(s), but ${actual} were provided`,
      line, { name, expected, actual });
  }

  /**
   * A `<~` parameter writes its change back into the caller's variable, so the
   * argument has to be a name. An expression gives it nowhere to write and the
   * write is silently lost — `g(2 + 3)` against `g(b<~)` used to be accepted by
   * every engine (REFERENCE.md L34).
   *
   * Worded exactly as `check_output_arguments` in
   * crates/zymbol-semantic/src/type_check.rs: the two are compared by
   * web/tests/test_check.mjs.
   */
  checkOutputArgs(name, args, line) {
    const slots = this.funcOutSlots.get(name);
    if (!slots) return;
    for (const i of slots) {
      const arg = args[i];
      if (arg === undefined) continue;
      const node = arg.value ?? arg;
      if (node?.type === 'Ident') continue;
      this.error('E017',
        `argument ${i + 1} of '${name}' is an output parameter '<~' and needs a variable, not an expression`,
        line, { name, index: i + 1 });
    }
  }

  /**
   * The call site must spell `<~` on exactly the arguments the callee declares
   * as outputs (REFERENCE.md L36). The mark is redundant with the signature on
   * purpose — it states the same contract where the consequence lands — and
   * being required is what stops it drifting out of date.
   *
   * `slots` is null when the callee's signature is unknown (an unresolvable
   * module), and the call is then left alone rather than guessed at. Worded as
   * `check_out_marks` in crates/zymbol-semantic/src/type_check.rs.
   */
  checkOutMarks(name, slots, args, line) {
    if (slots === null) return;
    const marked = args.outArgs ?? [];
    for (let i = 0; i < args.length; i++) {
      const declared = slots.includes(i);
      if (declared === marked.includes(i)) continue;
      if (declared) {
        this.error('E018',
          `argument ${i + 1} of '${name}' is an output parameter and must be marked '<~' at the call site`,
          line, { name, index: i + 1 });
      } else {
        this.error('E019',
          `argument ${i + 1} of '${name}' is marked '<~' but the function does not declare it as an output parameter`,
          line, { name, index: i + 1 });
      }
    }
  }

  /** Arity of `alias::field`, or null when nothing reliable is known. */
  qualifiedArity(alias, field) {
    const path = this.aliasPath.get(alias);
    if (path === undefined) return null;
    const std = STDLIB_ARITIES.get(path);
    if (std) return std.has(field) ? std.get(field) : null;
    const user = this.moduleArities.get(alias);
    return user && user.has(field) ? user.get(field) : null;
  }

  /**
   * Walk the whole program once for declarations, before checking anything.
   *
   * Two passes' worth of information in one: what each function's arity is, and
   * which of those names are later rebound to something else. A rebound name is
   * dropped rather than checked — `f = (x) -> x` after `f(a, b) { }` means a
   * call to `f` is no longer known to reach the declaration.
   */
  collectArities(stmts) {
    if (!Array.isArray(stmts)) return;
    for (const s of stmts) {
      if (!s) continue;
      switch (s.type) {
        case 'FuncDecl': {
          this.funcArity.set(s.name, (s.params ?? []).length);
          // Which slots are `<~` outputs, so a call can be checked against them
          // (REFERENCE.md L34). Functions without one — nearly all — store nothing.
          const outs = (s.params ?? [])
            .map((p, i) => (p.isOut ? i : -1))
            .filter(i => i >= 0);
          if (outs.length) this.funcOutSlots.set(s.name, outs);
          this.collectArities(s.body);
          break;
        }
        case 'Import':
          if (s.alias && s.path) this.aliasPath.set(s.alias, s.path);
          break;
        case 'VarAssign':
        case 'ConstAssign':
          if (s.name) this.reassigned.add(s.name);
          break;
        case 'Loop':      this.collectArities(s.body); break;
        case 'TuiBlock':  this.collectArities(s.body); break;
        case 'ModuleBlock': this.collectArities(s.body); break;
        case 'If':
          this.collectArities(s.then);
          for (const b of (s.elifs ?? [])) this.collectArities(b.body ?? b.then);
          this.collectArities(s.else ?? s.elseBody);
          break;
        case 'TryCatch':
          this.collectArities(s.tryBody ?? s.try);
          for (const c of (s.catches ?? [])) this.collectArities(c.body);
          this.collectArities(s.finallyBody ?? s.finally);
          break;
        default:
          break;
      }
    }
  }

  /**
   * `@!` / `@>` and their labelled forms, checked the way `zymbol check` checks
   * them since v0.0.9 (crates/zymbol-semantic/src/loop_context.rs).
   *
   * This used to be unchecked here, and the four engines gave four different
   * answers to `@:nope!`: the Rust tree-walker unwound every enclosing loop and
   * carried on, the register VM refused to compile, zyml raised at run time,
   * and this engine unwound every loop and then terminated the program — all of
   * them silently except the VM. It is decidable statically, so it is decided
   * statically, and the branch that never runs is checked too.
   */
  checkLoopControl(stmt, sym, verb) {
    const label = stmt.label ?? null;
    if (label === null || label === '') {
      if (this.loopLabels.length === 0) {
        this.error('E014', `'${sym}' outside a loop`, stmt.line, { sym, verb });
      }
      return;
    }
    if (!this.loopLabels.includes(label)) {
      this.error('E015', `no enclosing loop is labelled '${label}'`, stmt.line, { label, sym });
    }
  }

  push(funcBoundary = false, moduleScope = false, isLoop = false) {
    this.stack.push({ vars: new Map(), funcBoundary, moduleScope, isLoop });
  }

  pop() {
    const frame = this.stack.pop();
    for (const [name, info] of frame.vars) {
      if (!info.used && !name.startsWith('_') && !info.isConst) {
        this.warn('W_UNUSED', `unused variable '${name}'`, info.line, { name });
      }
    }
  }

  define(name, line, isConst = false) {
    if (this.stack.length === 0 || !name) return;
    this.stack[this.stack.length - 1].vars.set(name, { line, isConst, used: false });
  }

  /**
   * Assignment to a name that already exists: keep the record it already has.
   *
   * `define` writes into the INNERMOST frame with `used: false`, which is right
   * for a name being introduced and wrong for one being assigned again. Two
   * false `unused variable` warnings came out of that, and neither Rust engine
   * has ever raised them:
   *
   *     c = 0                     inc(x<~) {
   *     @ 3 { c = c + 1 }             x = x + 1
   *     >> c ¶      // prints 3   }   // x's value flows back to the caller
   *
   * In the first, `c = c + 1` created a SECOND `c` inside the loop frame — a
   * shadow, in a language whose blocks do not create scope (`DI-10`) — and that
   * shadow died unused when the frame popped. In the second, the assignment
   * reset the parameter's record, throwing away the read on its own right-hand
   * side.
   *
   * So: if the name is visible, leave it alone. A variable that is assigned and
   * never read still warns, because the record from its FIRST definition is the
   * one that survives and nothing ever marks it used.
   */
  /**
   * `? 1 { … }` — a condition that is not a Bool.
   *
   * Both Rust engines warn and this one said nothing, so a program that leans on
   * an Int being truthy looked clean here and noisy on the command line
   * (`DM-05`). Only literals are decided statically, which is the same limit the
   * Rust analyser works under: it warns on a type it can infer and stays quiet
   * on `Any` or `Unknown` rather than guessing.
   *
   * The wording is the Rust one, word for word — `zyq consensus` compares text.
   */
  warnNonBoolCondition(cond, kind) {
    const name = this.staticTypeName(cond);
    if (!name) return;                       // Bool, or a type this pass cannot decide
    this.warn('W_COND_TYPE', `${kind} condition should be Bool, got ${name}`,
              cond.line ?? null, { kind, type: name });
  }

  /** The type of an expression when it is decided without inference, else null. */
  staticTypeName(e) {
    const OF = { int: 'Int', float: 'Float', str: 'String', char: 'Char' };
    if (e?.type === 'Literal') return OF[e.kind] ?? null;   // bool → null: it is fine
    if (e?.type === 'Ident' && e.name) {
      for (let i = this.stack.length - 1; i >= 0; i--) {
        const info = this.stack[i].vars.get(e.name);
        // `Bool` is what a condition is SUPPOSED to be. `noteLiteralType` records
        // it like any other so that a later `n = 1` can clear the record on
        // conflict; returning it here produced `if condition should be Bool, got
        // Bool`, which says nothing and is plainly a bug.
        if (info) return info.litType && info.litType !== 'Bool' ? info.litType : null;
        if (this.stack[i].funcBoundary && !e.name.startsWith('_')) break;
      }
    }
    return null;
  }

  /**
   * Read a variable's record WITHOUT marking it used and without diagnosing.
   *
   * `lookup` does both, which is right where a name is being read and wrong
   * where the checker is only consulting what it already knows about a type.
   */
  peekVar(name) {
    if (!name) return null;
    for (let i = this.stack.length - 1; i >= 0; i--) {
      const info = this.stack[i].vars.get(name);
      if (info) return info;
    }
    return null;
  }

  /**
   * The type of an expression, when it can be decided without inference.
   *
   * Scalar literals, an array literal whose elements agree (`[Int]`, and
   * recursively `[[Int]]`), and a variable whose last assignment was one of
   * those. `null` everywhere else — this is a checker, not a type system, and
   * saying nothing is always allowed.
   *
   * Mirrors what the Rust analyser decides statically, which is what makes the
   * two agree on which programs are refused.
   */
  staticKind(e) {
    const OF = { int: 'Int', float: 'Float', str: 'String', char: 'Char', bool: 'Bool' };
    if (!e) return null;
    if (e.type === 'Literal') return OF[e.kind] ?? null;
    if (e.type === 'Ident') {
      const info = this.peekVar(e.name);
      return info?.elemKind ? `[${info.elemKind}]` : (info?.litType ?? null);
    }
    if (e.type === 'Array') {
      const k = this.arrayElemKind(e);
      return k ? `[${k}]` : null;
    }
    return null;
  }

  /**
   * The single element type of an array literal, or `null` when it cannot be
   * decided — including when the elements disagree, which the `Array` check
   * reports separately.
   *
   * Int and Float mix freely, as they do in every arithmetic position and as
   * both Rust engines allow: `[1, 2] $+ 3.5` is not a mix.
   */
  arrayElemKind(e) {
    const items = e.items ?? e.elements ?? [];
    if (items.length === 0) return null;
    const kinds = items.map(x => this.staticKind(x));
    if (kinds.some(k => k === null)) return null;
    const norm = (k) => k.replace(/Float/g, 'Int');
    const first = kinds[0];
    return kinds.every(k => norm(k) === norm(first)) ? first : null;
  }

  noteLiteralType(name, value, line) {
    const OF = { int: 'Int', float: 'Float', str: 'String', char: 'Char', bool: 'Bool' };
    const t = value?.type === 'Literal' ? (OF[value.kind] ?? null) : null;
    for (let i = this.stack.length - 1; i >= 0; i--) {
      const info = this.stack[i].vars.get(name);
      if (!info) {
        if (this.stack[i].funcBoundary && !name.startsWith('_')) break;
        continue;
      }
      // Reassigning a literal of a different type: both Rust engines warn, and
      // this one said nothing. Only literal-to-literal is decided without
      // inference, which is the same limit the condition check works under.
      if (info.litType && t && info.litType !== t) {
        this.warn('W_TYPE_CHANGE',
          `type mismatch: '${name}' was ${info.litType} but assigned ${t}`,
          line ?? null, { name, was: info.litType, now: t });
      }
      info.litType = (info.litType === undefined || info.litType === t) ? t : null;
      // And the element type when the value is an array literal, which is what
      // lets `a = [1, 2]` then `a $+ "x"` be caught — the shape real code has.
      // Anything else clears it rather than guessing: after `a = [1,2]` then
      // `a = f()` the elements are whatever `f` returned.
      info.elemKind = (value?.type === 'Array' && !value.declaredMixed)
        ? this.arrayElemKind(value)
        : null;
      return;
    }
  }

  /**
   * Walk a `??` pattern, marking the identifiers it names as used.
   *
   * A pattern COMPARES — it never binds — so every identifier in it is a
   * variable being read. `corpus/match/13_ident_scalar.zy` records that at the
   * top level and `20_list_pattern_compares.zy` inside a list.
   */
  checkMatchPattern(p) {
    if (!p) return;
    if (p.type === 'Ident' && p.name) { this.lookup(p.name, p.line); return; }
    for (const e of (p.elems ?? p.items ?? [])) {
      if (e?.kind === 'literal') this.checkExpr(e.expr);
      else if (e?.kind === 'bind' && e.name) this.lookup(e.name, p.line);
      else if (e?.name && e.name !== '_') this.lookup(e.name, p.line);
    }
    for (const alt of (p.alts ?? [])) this.checkMatchPattern(alt);
  }

  /** Mark a name used if it is in scope; say nothing if it is not. */
  markUsedIfPresent(name) {
    for (let i = this.stack.length - 1; i >= 0; i--) {
      const info = this.stack[i].vars.get(name);
      if (info) { info.used = true; return; }
      if (this.stack[i].funcBoundary && !name.startsWith('_')) break;
    }
  }

  defineOrKeep(name, line, isConst = false) {
    if (this.stack.length === 0 || !name) return;
    if (this.has(name)) return;
    this.define(name, line, isConst);
  }

  // Mirror Env.hotDef: walk to nearest funcBoundary or root, define there
  /**
   * Define a hot variable where its marker says it lives.
   *
   * The two markers anchor in different places, which is the whole reason the
   * language has two — and why `°x°` is refused:
   *
   *   `°x`  prefix   anchors at the nearest function boundary or the root, so
   *                  it OUTLIVES the loop it was written in
   *   `x°`  postfix  anchors at the nearest enclosing `@`, so it dies when that
   *                  loop ends
   *
   * This engine walked to the boundary for both, so a postfix `x°` survived its
   * loop and a later `>> x` printed a number where both Rust engines said
   * `undefined variable 'x'`. Two loops each accumulating into their own `x°`
   * silently shared one.
   */
  hotDefine(name, line, postfix = false) {
    if (this.stack.length === 0 || !name) return;
    let i = this.stack.length - 1;
    if (postfix) {
      while (i > 0 && !this.stack[i].isLoop && !this.stack[i].funcBoundary) i--;
    } else {
      while (i > 0 && !this.stack[i].funcBoundary) i--;
    }
    this.stack[i].vars.set(name, { line, isConst: false, used: false });
  }

  /** Is this name in scope? Unlike lookup(), it does not mark it used. */
  has(name) {
    if (!name) return false;
    for (let i = this.stack.length - 1; i >= 0; i--) {
      if (this.stack[i].vars.has(name)) return true;
      if (this.stack[i].funcBoundary && !name.startsWith('_')) break;
    }
    return false;
  }

  /**
   * `zymbol check`'s "ambiguous lifetime" warning, as the CLI actually emits it.
   *
   * The message says "variable is modified inside a loop", but the binary's behaviour is
   * narrower, and this mirrors the behaviour rather than the sentence — measured against
   * zymbol 0.0.8, and matching what CHANGELOG GAP-003 describes as deliberate:
   *
   *   `@ i:1..3 { … }`               warns about `i`
   *   `@ v:arr { … }`                warns about `v`
   *   `x = 5  @ i:1..3 { x = x+i }`  warns about `i` only — not about `x`
   *   `@ x < 10 { x = x + 1 }`       says nothing: a while loop has no iterator
   *   `@ _i:1..3 { … }`              says nothing: the `_` prefix means "on purpose"
   *   `x = 0  @ x:arr { … }`         says nothing: reusing a defined name is deliberate
   *   the same range loop inside a function — says nothing
   *
   * That last one is why `funcDepth` is consulted: the CLI's def-use analysis runs over
   * the top-level control-flow graph, and a loop inside a function body is not in it.
   *
   * This is the single noisiest thing `zymbol check` says — it fires on 122 of the 216
   * programs in examples/ — which is why the playground keeps warnings behind a toggle
   * that starts off. Leaving the rule out entirely would have been quieter and wrong: the
   * playground would then disagree with the CLI on the most common diagnostic in the
   * language, and a visitor comparing the two would trust neither.
   */
  lifetimeWarnForIterator(stmt, preexisting) {
    const name = stmt.var;
    if (!name) return;                       // while / infinite loop: no iterator
    if (this.funcDepth > 0) return;
    if (name.startsWith('_')) return;
    if (preexisting) return;
    // Once per name, not once per loop. The CLI's analysis is a def-use chain *per
    // variable*, so a program that walks `i` through four separate loops is told about
    // `i` once, at the first one — measured on examples/tour/control.zy, where warning
    // per loop instead produced six warnings against the binary's three.
    if (this.lifetimeWarned.has(name)) return;
    this.lifetimeWarned.add(name);
    this.warn('W_LIFETIME', `ambiguous lifetime for '${name}'`, stmt.line, { name });
  }

  lookup(name, usageLine) {
    if (!name) return null;
    for (let i = this.stack.length - 1; i >= 0; i--) {
      const frame = this.stack[i];
      if (frame.vars.has(name)) {
        // Found — check underscore scope violation: _name cannot be read from inner scope
        // that crosses at least one non-funcBoundary scope to reach the definition
        if (name.startsWith('_') && i < this.stack.length - 1 && !frame.moduleScope) {
          const crossedNonBoundary = this.stack.slice(i + 1).some(f => !f.funcBoundary);
          if (crossedNonBoundary) {
            this.error('E_SCOPE', `cannot access underscore variable '${name}' from inner scope`, usageLine, { name });
            return { used: true, isConst: false, isScope: true }; // sentinel: suppress follow-up E_VAR
          }
        }
        frame.vars.get(name).used = true;
        return frame.vars.get(name);
      }
      if (frame.funcBoundary && !name.startsWith('_')) break;
    }
    return null;
  }

  // `params` is what makes a diagnostic translatable: the playground renders it from its
  // own catalogue keyed by `code`, and `message` stays as the English fallback for callers
  // that have no catalogue (runZymbol's own output, and any embedder).
  error(code, msg, line = null, params = null) {
    this.diagnostics.push({ severity: 'error', code, message: msg, line, params });
  }

  warn(code, msg, line = null, params = null) {
    this.diagnostics.push({ severity: 'warning', code, message: msg, line, params });
  }

  // GAP-ZYB-006: walk the statements a top-level `<~` can be reached from —
  // everything but a function body, which returns to its caller and not to the
  // operating system — and require its value to be a whole number.
  //
  // Only a literal is judged, which is what this checker can see: it has no
  // type inference, and the Rust one lets an inferred `Any` through for the
  // same reason. A wrong literal is the case worth catching and the one a
  // reader writes by mistake.
  checkTopLevelExit(stmt) {
    if (!stmt || stmt.type === 'FuncDecl') return;
    const walk = (block) => {
      if (!block) return;
      for (const st of (Array.isArray(block) ? block : block.body ?? [])) {
        this.checkTopLevelExit(st);
      }
    };
    switch (stmt.type) {
      case 'Return': {
        const v = stmt.value;
        if (v?.type === 'Literal' && v.kind !== 'int' && v.kind !== 'unit') {
          const named = { str: 'String', float: 'Float', bool: 'Bool', char: 'Char' };
          this.error(
            'E-EXIT-TYPE',
            `a top-level \`<~\` ends the program, so its value is the exit status ` +
            `and must be a whole number — this one is ${named[v.kind] ?? v.kind}`,
            stmt.line);
        } else if (v?.type === 'ArrayLit' || v?.type === 'TupleLit' || v?.type === 'NamedTuple') {
          this.error(
            'E-EXIT-TYPE',
            'a top-level `<~` ends the program, so its value is the exit status ' +
            'and must be a whole number — this one is a collection',
            stmt.line);
        }
        return;
      }
      case 'If':
        walk(stmt.then ?? stmt.thenBody);
        for (const b of stmt.elifs ?? []) walk(b.body ?? b.block);
        walk(stmt.else ?? stmt.elseBody);
        return;
      case 'Loop':   walk(stmt.body); return;
      case 'TryCatch':
        walk(stmt.tryBody ?? stmt.try);
        for (const c of stmt.catches ?? []) walk(c.body ?? c.block);
        walk(stmt.finallyBody ?? stmt.finally);
        return;
      case 'Match':
        for (const c of stmt.cases ?? []) walk(c.body ?? c.block);
        return;
      case 'TuiBlock': walk(stmt.body); return;
      default: return;
    }
  }

  _leftmostIdent(expr) {
    if (!expr) return null;
    if (expr.type === 'Ident') return expr.name || null;
    if (expr.type === 'BinOp')       return this._leftmostIdent(expr.left);
    if (expr.type === 'CollectionOp') return this._leftmostIdent(expr.obj);
    if (expr.type === 'NavIndex')     return this._leftmostIdent(expr.obj);
    if (expr.type === 'UnaryOp')      return this._leftmostIdent(expr.operand ?? expr.value);
    return null;
  }

  check() {
    this.collectArities(this.ast.body);
    this.push(false);
    for (const stmt of this.ast.body) {
      if (stmt.type === 'FuncDecl') this.define(stmt.name, stmt.line);
    }
    for (const stmt of this.ast.body) this.checkStmt(stmt);
    // GAP-ZYB-006: a `<~` at the top level ends the program, and its value is
    // the exit status the operating system receives — a whole number.
    for (const stmt of this.ast.body) this.checkTopLevelExit(stmt);
    this.pop();
    return this.diagnostics;
  }

  checkBlock(stmts) {
    if (!Array.isArray(stmts)) return;
    for (const s of stmts) {
      if (s?.type === 'FuncDecl') this.define(s.name, s.line, false);
    }
    for (const s of stmts) this.checkStmt(s);
  }

  checkStmt(stmt) {
    if (!stmt) return;
    const wasHot = this.pendingHot;
    this.pendingHot = false;

    switch (stmt.type) {

      case 'VarAssign': {
        // Prefix hot-def (°name = expr): define target before checking RHS so self-references are valid
        if (wasHot && stmt.name) {
          const info = this.lookup(stmt.name, stmt.line);
          if (!info) this.hotDefine(stmt.name, stmt.line);
        }
        this.checkExpr(stmt.value);
        // Check for reassignment of a constant
        if (stmt.name) {
          const existing = this.lookup(stmt.name, stmt.line);
          if (existing?.isConst) {
            this.error('E_CONST', `cannot reassign constant '${stmt.name}'`, stmt.line, { name: stmt.name });
            return;
          }
        }
        if (stmt.hot && wasHot) {
          // See CompoundAssign: `°x° = …` asks for two lifetimes at once.
          this.error('E_HOT_AMBIG',
            `ambiguous hot-definition markers on '${stmt.name}': ` +
            `use either '°${stmt.name}' (anchors above loop) or '${stmt.name}°' (anchors at loop), not both`,
            stmt.line, { name: stmt.name });
          return;
        }
        if (!wasHot) this.defineOrKeep(stmt.name, stmt.line, false);
        // Remember the type when the value is a literal, which is the only case
        // decided without inference — enough for `n = 1  ? n { … }`, and the
        // same limit the Rust analyser works under when it cannot infer.
        // A second assignment of a different kind clears it rather than
        // guessing, because after `n = 1` then `n = #1` the type is whichever
        // ran last and this pass does not know which.
        if (!wasHot && stmt.name) this.noteLiteralType(stmt.name, stmt.value, stmt.line);
        return;
      }

      case 'ConstAssign': {
        this.checkExpr(stmt.value);
        this.define(stmt.name, stmt.line, true);
        return;
      }

      case 'CompoundAssign': {
        // postfix hot: name° +=  → stmt.hot = true
        // prefix hot:  °name +=  → wasHot = true (from ExprStmt sentinel)
        const isHot = stmt.hot || wasHot;
        // `°x°` — both markers on the same name is ambiguous, and the two
        // anchor in DIFFERENT places: `°x` above the loop, `x°` at it. Asking
        // for both asks for two lifetimes, so there is nothing to choose.
        //
        // Both Rust engines refuse it in the lexer; this engine ran the program
        // and printed an answer, which is the shape that matters — a program
        // that works in the playground and fails when it is installed.
        if (stmt.hot && wasHot) {
          this.error('E_HOT_AMBIG',
            `ambiguous hot-definition markers on '${stmt.name}': ` +
            `use either '°${stmt.name}' (anchors above loop) or '${stmt.name}°' (anchors at loop), not both`,
            stmt.line, { name: stmt.name });
          return;
        }
        if (!isHot) {
          const info = this.lookup(stmt.name, stmt.line);
          if (!info) this.error('E_VAR', `undefined variable '${stmt.name}'`, stmt.line, { name: stmt.name });
          else if (info.isConst) this.error('E_CONST', `cannot reassign constant '${stmt.name}'`, stmt.line, { name: stmt.name });
        } else {
          const info = this.lookup(stmt.name, stmt.line);
          if (!info) this.hotDefine(stmt.name, stmt.line, stmt.hot === true);
        }
        this.checkExpr(stmt.value);
        return;
      }

      case 'Increment': {
        const isHot = stmt.hot || wasHot;
        if (!isHot) {
          const info = this.lookup(stmt.name, stmt.line);
          if (!info) this.error('E_VAR', `undefined variable '${stmt.name}'`, stmt.line, { name: stmt.name });
          else if (info.isConst) this.error('E_CONST', `cannot reassign constant '${stmt.name}'`, stmt.line, { name: stmt.name });
        } else {
          const info = this.lookup(stmt.name, stmt.line);
          if (!info) this.hotDefine(stmt.name, stmt.line);
        }
        return;
      }

      case 'IndexAssign': {
        // obj is a string (the variable name being indexed)
        const obj = stmt.obj ?? stmt.name;
        if (obj) {
          const info = this.lookup(obj, stmt.line);
          if (!info) this.error('E_VAR', `undefined variable '${obj}'`, stmt.line, { name: obj });
        }
        this.checkExpr(stmt.index);
        this.checkExpr(stmt.value);
        return;
      }

      case 'IndexedAssign': {
        const name = stmt.name ?? stmt.obj;
        if (name) {
          const info = this.lookup(name, stmt.line);
          if (!info) this.error('E_VAR', `undefined variable '${name}'`, stmt.line, { name });
        }
        for (const idx of (stmt.indices ?? [])) this.checkExpr(idx);
        this.checkExpr(stmt.value);
        return;
      }

      case 'LifetimeEnd': {
        if (stmt.name) {
          const info = this.lookup(stmt.name, stmt.line);
          if (!info) this.error('E_VAR', `undefined variable '${stmt.name}'`, stmt.line, { name: stmt.name });
          else {
            for (let i = this.stack.length - 1; i >= 0; i--) {
              if (this.stack[i].vars.has(stmt.name)) {
                this.stack[i].vars.delete(stmt.name); break;
              }
            }
          }
        }
        return;
      }

      case 'Import': {
        if (stmt.alias) this.define(stmt.alias, stmt.line, false);
        return;
      }

      case 'Output':
      case 'OutputPos': {
        // `>> x°` — the marker initializes, it does not read, so in an output
        // position it says nothing and hides the fact that `x` may not exist.
        // Both Rust engines refuse it; this engine printed `5` and carried on.
        for (const item of (stmt.items ?? [])) {
          // Both spellings: `>> x°` is a hot Ident, and `>> °x` is the
          // empty-name sentinel the prefix lexes to. Rust refuses both.
          if (item?.type === 'Ident' && item.hot === true) {
            this.error('E_HOT_OUTPUT',
              '`°` has no effect in output context — use `>> x ¶`',
              item.line ?? stmt.line, { name: item.name });
          }
        }
        for (const item of (stmt.items ?? [])) this.checkExpr(item);
        return;
      }

      case 'Input': {
        if (stmt.prompt) this.checkExpr(stmt.prompt);
        const varName = stmt.varName ?? stmt.name;
        if (varName) this.define(varName, stmt.line, false);
        return;
      }

      case 'If': {
        this.checkExpr(stmt.cond);
        this.warnNonBoolCondition(stmt.cond, 'if');
        this.push(); this.checkBlock(stmt.then); this.pop();
        for (const elif of (stmt.elseifs ?? [])) {
          this.checkExpr(elif.cond);
          this.warnNonBoolCondition(elif.cond, 'else-if');
          this.push(); this.checkBlock(elif.body ?? elif.then); this.pop();
        }
        if (stmt.else) { this.push(); this.checkBlock(stmt.else); this.pop(); }
        return;
      }

      case 'Loop': {
        // An iterator that already existed before the loop is a deliberate reuse, so the
        // lifetime warning below must not fire for it. Asked before push(), because after
        // it the name is defined either way. `lookup` would mark the outer name used, and
        // a variable that only appears as a loop's iterator is not "used" — hence has().
        const preexisting = stmt.var ? this.has(stmt.var) : false;
        // Marked as a loop so a POSTFIX `x°` can anchor here — see `hotDefine`.
        this.push(false, false, true);
        if (stmt.kind === 'foreach' || stmt.iterable || stmt.iter) {
          this.checkExpr(stmt.iterable ?? stmt.iter);
          if (stmt.var) this.define(stmt.var, stmt.line, false);
        } else if (stmt.kind === 'range' || stmt.from !== undefined) {
          this.checkExpr(stmt.from);
          this.checkExpr(stmt.to);
          if (stmt.step) this.checkExpr(stmt.step);
          if (stmt.var) this.define(stmt.var, stmt.line, false);
        } else if (stmt.cond) {
          this.checkExpr(stmt.cond);
        }
        this.lifetimeWarnForIterator(stmt, preexisting);
        this.loopLabels.push(stmt.label ?? null);
        this.checkBlock(stmt.body);
        this.loopLabels.pop();
        this.pop();
        return;
      }

      case 'CliArgs': {
        // >< name: captures CLI args into a variable
        if (stmt.variable) this.define(stmt.variable, stmt.line, false);
        return;
      }

      case 'KeyInput': {
        if (stmt.varName ?? stmt.variable) this.define(stmt.varName ?? stmt.variable, stmt.line, false);
        return;
      }

      case 'Break':
        this.checkLoopControl(stmt, '@!', 'break');
        return;

      case 'Continue':
        this.checkLoopControl(stmt, '@>', 'continue');
        return;

      // `Sleep` (@~) is deliberately absent from the two cases above: it pauses
      // execution without acting on the loop's control flow, so it carries no
      // loop requirement. Every engine has always accepted it at top level.
      case 'SetNumeralMode':
      case 'Noop':
      case 'ExportDecl':
      case 'Sleep':
      case 'ClearScreen':
        return;

      case 'ModuleBlock': {
        const allowedInModule = new Set(['ExportDecl', 'FuncDecl', 'VarAssign', 'ConstAssign', 'Import', 'Noop']);
        for (const s of (stmt.body ?? [])) {
          if (s && !allowedInModule.has(s.type))
            this.error('E013', `E013: executable statement not allowed in module body`, s.line ?? stmt.line, {});
          // A module binding is initialised with a LITERAL — a scalar, a scalar
          // with a sign, or a collection literal built only out of those. Only
          // the statement's *type* was checked here, so `x = 1 + 2` and
          // `t = json::decode(raw)` were accepted and run, while both Rust
          // engines refused to parse the module at all. The parity gate could
          // not see it: a file the other two engines reject has no golden to
          // disagree with.
          if (s && (s.type === 'VarAssign' || s.type === 'ConstAssign')
                && !Interpreter.isModuleLiteral(s.value)) {
            const what = s.type === 'ConstAssign' ? 'constant' : 'variable';
            this.error('E013',
              `E013: ${what} initializer in module must be a literal`,
              s.line ?? stmt.line, {});
          }
        }
        // And then analyse it. Only the *shape* of the body was checked here, so
        // a module function reassigning the module's own `:=` constant went
        // unreported and the module simply ran — MM-4, which the Rust engines
        // settled in v0.0.8 by giving a module the same gate as the entry file.
        // Analysed in the current frame, not a nested one: the module body *is*
        // the module's root scope, and its `_private` helpers are visible to the
        // module's own functions. Pushing a frame here put a non-boundary scope
        // between a `_name` and its use, which is exactly what the underscore
        // rule refuses.
        // `moduleScope`: a `_name` declared here is module-private, not
        // block-local, so the module's own functions may read it — the same
        // distinction `Env` makes with `isModuleScope` at run time.
        //
        // Warnings raised inside are dropped: what MM-4 asks for is the error
        // gate, and this engine's `unused variable` analysis reports a false
        // positive for a name reassigned inside a branch and then returned
        // (`nueva = dir / ? … { nueva = 1 } / <~ nueva`) — a pre-existing defect
        // that has nothing to do with modules, and that keeping would have
        // buried every module file in warnings the CLI does not raise.
        const mark = this.diagnostics.length;
        this.push(false, true);
        this.checkBlock(stmt.body ?? []);
        this.pop();
        const raised = this.diagnostics.splice(mark);
        for (const d of raised) if (d.severity !== 'warning') this.diagnostics.push(d);
        return;
      }

      case 'Match': {
        this.checkExpr(stmt.subject ?? stmt.expr);
        for (const arm of (stmt.arms ?? [])) {
          // An identifier in a pattern is a VALUE that gets compared, so it is a
          // use of that variable — at the top of the pattern and, equally,
          // inside a LIST pattern. Only the top level was looked up here, so
          // `uno = 1  ?? [1] { [uno] => … }` reported `unused variable 'uno'`
          // while both Rust engines said nothing.
          this.checkMatchPattern(arm.pattern);
          if (Array.isArray(arm.body)) { this.push(); this.checkBlock(arm.body); this.pop(); }
          else this.checkExpr(arm.body);
        }
        return;
      }

      case 'FuncDecl': {
        this.push(false); // named fns can access outer scope (module aliases, globals)
        this.funcDepth++;
        // A function body is a loop-context boundary: the caller's loops are
        // not in scope, so `f() { @! }` is an error even when every call site
        // sits inside a loop.
        const outerLoops = this.loopLabels;
        this.loopLabels = [];
        for (const p of (stmt.params ?? [])) {
          const pname = typeof p === 'string' ? p : p.name;
          if (pname) this.define(pname, stmt.line, false);
        }
        this.checkBlock(stmt.body);
        this.loopLabels = outerLoops;
        this.funcDepth--;
        this.pop();
        return;
      }

      case 'Return': {
        if (stmt.value) this.checkExpr(stmt.value);
        return;
      }

      case 'TryCatch': {
        this.push(); this.checkBlock(stmt.tryBody ?? stmt.try); this.pop();
        for (const catch_ of (stmt.catches ?? [])) {
          this.push();
          this.define('_err', stmt.line, false);
          this.checkBlock(catch_.body);
          this.pop();
        }
        const fin = stmt.finallyBody ?? stmt.finally;
        if (fin) { this.push(); this.checkBlock(fin); this.pop(); }
        return;
      }

      case 'TupleDestruct':
      case 'ArrayDestruct':
      case 'NamedDestruct': {
        this.checkExpr(stmt.value);
        for (const t of (stmt.targets ?? [])) {
          if (t.name && t.name !== '_') {
            // L14 (mirrors type_check.rs): destructuring into a `:=` constant
            // is an error, same as direct reassignment.
            const info = this.lookup(t.name, stmt.line);
            if (info?.isConst) {
              this.error('E_CONST', `cannot reassign constant '${t.name}'`, stmt.line, { name: t.name });
              continue;
            }
            this.define(t.name, stmt.line, false);
          }
        }
        return;
      }

      case 'InPlaceEdit': {
        this.checkExpr(stmt.expr);
        return;
      }

      case 'ExprStmt': {
        const expr = stmt.expr ?? stmt.value;
        // Prefix hot-def sentinel: ExprStmt with empty hot Ident (°name produces this)
        if (expr?.type === 'Ident' && expr.hot === true && expr.name === '') {
          this.pendingHot = true;
          return;
        }
        // A statement that is only a NAME does nothing (ERROR-ZYB-001). It is
        // the mechanism that made BUG-ZYB-002 silent: when a parse split in
        // two, the remainder landed in a statement with no effect and vanished.
        if (expr?.type === 'Ident' && expr.name && !expr.hot) {
          this.warn('W_NO_EFFECT',
            `this statement does nothing: '${expr.name}' is read and discarded`,
            expr.line ?? stmt.line, { name: expr.name });
        }
        // Decision 19, the other half of the rule of the result: a consulting
        // `$` builds a value, so a statement that is only one throws it away.
        // The operator is pure, so this holds even with a call inside it — the
        // call's effect still happens and the `$#` around it is still pointless.
        if (expr?.type === 'CollectionOp' && Parser.CONSULT_OPS.has(expr.op)) {
          this.warn('W_NO_EFFECT',
            `this statement does nothing: \`${expr.op}\` builds a value and it is discarded`,
            expr.line ?? stmt.line, { name: expr.op });
        }
        this.checkExpr(expr);
        return;
      }

      default:
        if (stmt.value) this.checkExpr(stmt.value);
        if (stmt.body)  this.checkBlock(stmt.body);
    }
  }

  checkExpr(expr) {
    if (!expr) return;
    switch (expr.type) {

      case 'Ident': {
        if (!expr.name) return; // empty sentinel
        if (expr.name === '_') return; // wildcard placeholder — never an error
        // hot Ident (name°): auto-initializes at function/root boundary
        if (expr.hot) {
          const info = this.lookup(expr.name, expr.line);
          if (!info) this.hotDefine(expr.name, expr.line);
          return;
        }
        const info = this.lookup(expr.name, expr.line);
        if (!info) this.error('E_VAR', `undefined variable '${expr.name}'`, expr.line, { name: expr.name });
        return;
      }

      case 'BinOp': {
        this.checkExpr(expr.left);
        this.checkExpr(expr.right);
        return;
      }

      case 'UnaryOp': {
        this.checkExpr(expr.operand ?? expr.value);
        return;
      }

      case 'CastOp': {
        this.checkExpr(expr.operand ?? expr.value ?? expr.obj);
        return;
      }

      // `x#?` — asking a value its type is a USE of it. The node was not walked
      // here, so `d = js::decode(…)  >> d#? ¶` reported `unused variable 'd'`
      // while both Rust engines said nothing: the one operator whose whole job
      // is to inspect a value did not count as reading it.
      //
      // The operand is checked like any other expression, so an undefined name
      // in it is reported. Asking a variable its type is not an exception to
      // "defined before use": decided 2026-08-19, and it makes the CLI agree
      // with the LSP, which had been flagging it all along while
      // `zymbol check` said "No errors or warnings".
      case 'TypeMetadata': {
        this.checkExpr(expr.obj ?? expr.operand ?? expr.value);
        return;
      }

      case 'Call': {
        // Mirrors zymbol-semantic type_check: a bare-identifier call must name a
        // hoisted function, a variable holding a callable, or a module alias —
        // otherwise the function does not exist (e.g. `cos(x)` without `math::cos`).
        if (typeof expr.callee === 'string' && expr.callee) {
          const info = this.lookup(expr.callee, expr.line);
          if (!info) this.error('E_FUNC', `undefined function: '${expr.callee}'`, expr.line, { name: expr.callee });
          else if (this.funcArity.has(expr.callee) && !this.reassigned.has(expr.callee)) {
            this.checkArity(expr.callee, this.funcArity.get(expr.callee),
                            (expr.args ?? []).length, expr.line);
            this.checkOutputArgs(expr.callee, expr.args ?? [], expr.line);
            // A locally declared function always has a known signature: no
            // recorded slots means it declares no output parameter.
            this.checkOutMarks(expr.callee, this.funcOutSlots.get(expr.callee) ?? [],
                               expr.args ?? [], expr.line);
          }
        } else if (expr.callee && typeof expr.callee === 'object') {
          this.checkExpr(expr.callee);
        }
        for (const a of (expr.args ?? [])) this.checkExpr(a.value ?? a);
        return;
      }

      case 'CallExpr': {
        // `alias::func(…)` arrives as a FieldAccess callee. Checked against the
        // std/ table, or against a user-module table if one was supplied.
        const callee = expr.callee ?? expr.fn;
        if (callee?.type === 'FieldAccess' && callee.obj?.type === 'Ident' && callee.field) {
          const expected = this.qualifiedArity(callee.obj.name, callee.field);
          if (expected !== null) {
            this.checkArity(`${callee.obj.name}::${callee.field}`, expected,
                            (expr.args ?? []).length, expr.line);
            // The signature is known, so the call-site mark can be checked too.
            const slots = this.moduleOutSlots.get(callee.obj.name)?.get(callee.field) ?? [];
            this.checkOutMarks(`${callee.obj.name}::${callee.field}`, slots,
                               expr.args ?? [], expr.line);
          }
        }
        this.checkExpr(callee);
        for (const a of (expr.args ?? [])) this.checkExpr(a.value ?? a);
        return;
      }

      case 'Lambda': {
        // Lambdas are closures — use funcBoundary=false so outer vars remain accessible
        this.push(false);
        this.funcDepth++;
        // Loop context does not close over, though: a `@!` in a lambda body
        // cannot break the loop the lambda was written inside, so the stack is
        // emptied here exactly as it is for a named function.
        const outerLoops = this.loopLabels;
        this.loopLabels = [];
        for (const p of (expr.params ?? [])) {
          const pname = typeof p === 'string' ? p : p.name;
          if (pname) this.define(pname, expr.line, false);
        }
        const body = expr.body;
        if (Array.isArray(body))         this.checkBlock(body);
        else if (body?.type === 'expr')  this.checkExpr(body.value);
        else if (body?.type === 'block') this.checkBlock(body.stmts ?? body.body ?? []);
        else                             this.checkExpr(body);
        this.loopLabels = outerLoops;
        this.funcDepth--;
        this.pop();
        return;
      }

      case 'Array': {
        const items = expr.items ?? expr.elements ?? [];
        for (const el of items) this.checkExpr(el);
        // Decision 15: `[…]` is homogeneous and gets checked; `#[…]` declares
        // the mix and does not. This engine checked nothing at all, so
        // `[1, "dos", 3.0]` ran here and was `array element 2 has type String`
        // in both Rust engines — a program written in the playground failed
        // outside it (DM-04).
        // `staticKind` and not a local literal-only rule: it recurses into
        // nested array literals and reads a variable's remembered type, which
        // is what the Rust analyser does. Without the recursion
        // `[[1], ["x"]]` was accepted here and `array element 2 has type
        // [String], but expected [Int]` in both Rust engines.
        const kinds = items.map(el => this.staticKind(el));
        if (kinds.length > 1 && kinds.every(k => k !== null)) {
          // Int and Float mix freely, as they do in every arithmetic position —
          // at any depth, so `[[1], [2.5]]` is not a mix either.
          const norm = (k) => k.replace(/Float/g, 'Int');
          const first = kinds[0];
          const bad = kinds.findIndex(k => norm(k) !== norm(first));
          if (bad > 0 && !expr.declaredMixed) {
            this.error('E_ARRAY_MIX',
              `array element ${bad + 1} has type ${kinds[bad]}, but expected ${first} ` +
              `(same as first element) — write \`#[…]\` if the mix is deliberate`,
              expr.line);
          } else if (bad < 0 && expr.declaredMixed) {
            // Decision 18: the escape hatch used where it is not needed.
            this.warn('W_MIX_UNNEEDED',
              `this \`#[…]\` has no mixed types: every element is ${first} — use \`[…]\``,
              expr.line);
          }
        }
        return;
      }

      case 'Tuple': {
        for (const f of (expr.items ?? expr.fields ?? [])) this.checkExpr(f.value ?? f);
        return;
      }

      case 'NavIndex': {
        this.checkExpr(expr.obj);
        const spec = expr.spec;
        if (spec?.index) this.checkExpr(spec.index);
        if (spec?.from)  this.checkExpr(spec.from);
        if (spec?.to)    this.checkExpr(spec.to);
        return;
      }

      case 'FieldAccess': {
        this.checkExpr(expr.obj);
        return;
      }

      case 'CollectionOp': {
        this.checkExpr(expr.obj);
        if (expr.arg)  this.checkExpr(expr.arg);
        if (expr.arg2) this.checkExpr(expr.arg2);
        // Putting something INTO a `[…]` keeps it homogeneous (decision 15),
        // and that is the whole edit family, not one member of it (L46).
        // Until v0.0.9 only the literal and `$+` were checked — in every engine
        // — so `$++`, `$+[i]` and `[i]$~` each turned a `[…]` heterogeneous
        // with nobody declaring it, and `#?` then answered `##[`: a list nobody
        // wrote. A `[…]` was not homogeneous, it was homogeneous when written.
        //
        // The verb matches the analyser's, because the two messages are read
        // side by side when somebody moves a program between them.
        const VERBS = { '$+': 'append', '$++': 'append', '$+[i]': 'insert', '$~': 'write' };
        const verb = VERBS[expr.op];
        if (verb) {
          const want = expr.obj?.type === 'Ident'
            ? this.peekVar(expr.obj.name)?.elemKind ?? null
            : (expr.obj?.type === 'Array' && !expr.obj.declaredMixed
                ? this.arrayElemKind(expr.obj)
                : null);
          // `$++` takes several; the others take one.
          const given = expr.op === '$++' ? (expr.items ?? []) : [expr.arg];
          const norm = (k) => k.replace(/Float/g, 'Int');
          for (const g of given) {
            const got = this.staticKind(g);
            if (want && got && norm(want) !== norm(got)) {
              this.error('E_ARRAY_MIX',
                `cannot ${verb} ${got} to [${want}]: type mismatch — ` +
                `expected element of type ${want}`,
                expr.line ?? null);
            }
          }
        }
        return;
      }

      // `arr[i]$~ v` — a node of its own, not a CollectionOp, because the
      // bracket is consumed before the `$~` is seen. It writes an element, so
      // the element has to fit (L46). The deep form `m[i>j]$~ v` is
      // `DeepUpdate` and is not decided here: the outer type says nothing about
      // what lands two levels down, which is what the analyser also concludes.
      case 'FuncUpdate': {
        this.checkExpr(expr.obj);
        if (expr.index !== undefined) this.checkExpr(expr.index);
        this.checkExpr(expr.value);
        const want = expr.obj?.type === 'Ident'
          ? this.peekVar(expr.obj.name)?.elemKind ?? null
          : null;
        const got = this.staticKind(expr.value);
        const norm = (k) => k.replace(/Float/g, 'Int');
        if (want && got && norm(want) !== norm(got)) {
          this.error('E_ARRAY_MIX',
            `cannot write ${got} to [${want}]: type mismatch — ` +
            `expected element of type ${want}`,
            expr.line ?? null);
        }
        return;
      }

      case 'Pipe': {
        this.checkExpr(expr.value);
        this.checkExpr(expr.rhs ?? expr.fn);
        return;
      }

      case 'ImplicitConcat':
      case 'JuxtaConcat':
      case 'CommaJoin': {
        const items = expr.items ?? [];
        // Prefix hot-def in expression context: °name op expr
        // Parsed as ImplicitConcat[{Ident name:'' hot:true}, <expr starting with name>]
        if (items.length >= 2 &&
            items[0]?.type === 'Ident' && items[0]?.hot === true && !items[0]?.name) {
          const hotName = this._leftmostIdent(items[1]);
          if (hotName) this.hotDefine(hotName, items[1]?.line ?? expr.line);
        }
        for (const item of items) this.checkExpr(item);
        return;
      }

      case 'TypeMetadata': {
        // #? is safe access — target may be undefined, don't emit E_VAR
        return;
      }

      case 'DataOp': {
        this.checkExpr(expr.obj ?? expr.value);
        if (expr.arg) this.checkExpr(expr.arg);
        // A computed decimal count reads a name like anything else.
        if (expr.precExpr) this.checkExpr(expr.precExpr);
        return;
      }

      case 'Match': {
        this.checkStmt(expr);
        return;
      }

      case 'Literal': {
        // String literals may embed interpolated identifier names: {varname}
        if (expr.kind === 'str' && Array.isArray(expr.value)) {
          for (const part of expr.value) {
            if (part.t === 'expr' && typeof part.v === 'string') {
              const name = part.v.trim();
              // Only look up simple identifiers (no operators/spaces). Character
              // classes mirror readIdent's lexer rule (HLZ-KL-001 parity) — a
              // narrower rule here would under-mark PUA-script (e.g. pIqaD)
              // identifiers as used, producing a false W_UNUSED.
              if (/^[\p{L}\p{M}\p{So}\p{Co}_][\p{L}\p{M}\p{So}\p{Co}0-9_]*$/u.test(name)) this.lookup(name, expr.line);
            }
          }
        }
        return;
      }

      // Terminals — nothing to check
      case 'BoolLiteral':
      case 'IntLiteral':
      case 'FloatLiteral':
      case 'StringLiteral':
      case 'CharLiteral':
      case 'Numeral':
      case 'BashExec':
      case 'CliArgs':
      case 'TerminalSize':
      case 'KeyInput':
        return;

      default:
        if (expr.left)    this.checkExpr(expr.left);
        if (expr.right)   this.checkExpr(expr.right);
        if (expr.value)   this.checkExpr(expr.value);
        if (expr.obj)     this.checkExpr(expr.obj);
        if (expr.operand) this.checkExpr(expr.operand);
    }
  }
}

// ─── Value constructors ───────────────────────────────────────────────────────

// ─── The integer range (mirrors zymbol-common/src/num.rs) ────────────────────
//
// A Zymbol integer is a *safe* integer: +-(2^53 - 1), the widest range all four
// engines hold exactly. It is the range this engine could always represent and
// the other three could not stay inside of -- `10 ^ 20` printed a correct-looking
// 100000000000000000000 here (exact only because 10^20 = 2^20 * 5^20), wrapped
// to two different values in the Rust and OCaml engines, and raised in a fourth.
// Now every engine raises, and this one has to check what it used to assume:
// past 2^53 a Number silently rounds, so `9007199254740993` printed ...992.
const ZY_INT_MAX = 9007199254740991;
const ZY_INT_MIN = -9007199254740991;
const inIntRange = v => Number.isSafeInteger(v);

// An integer result, or the overflow every engine words identically.
// Number arithmetic never wraps -- it rounds -- so a true result past 2^53 is
// always a Number past 2^53, and this check cannot be fooled by a partial
// product landing back in range the way a fixed-width accumulator can.
const intResult = (v, a, op, b) => {
  if (!inIntRange(v)) throw new ZyRuntimeError(`integer overflow: ${a} ${op} ${b}`, '##Range');
  return mkInt(v);
};

const mkInt   = v => ({ type: 'int',   v: Math.trunc(v) });
const mkFloat = v => ({ type: 'float', v });
const mkBool  = v => ({ type: 'bool',  v: !!v });
const mkStr   = v => ({ type: 'str',   v: String(v) });
const mkChar  = v => ({ type: 'char',  v: String(v) });
const mkArr   = v => ({ type: 'arr',   v });
const mkTuple = v => ({ type: 'tuple', v, keys: null });
const mkUnit  = () => ({ type: 'unit' });

// ─── Typed input validation (mirrors execute_input in zymbol-interpreter/io.rs) ─

// Human-readable description of what an input cast expects (re-prompt hints + EOF error).
function describeInputCast(cast) {
  switch (cast.kind) {
    case 'numeric': case 'float': return 'a number';
    case 'decimal': return `a number with up to ${cast.total} digits and ${cast.decimals} decimals`;
    case 'int':     return cast.maxDigits != null ? `an integer of up to ${cast.maxDigits} digits` : 'an integer';
    case 'text':    return cast.max != null ? `text of up to ${cast.max} characters` : 'text';
    case 'char':    return 'a single character';
    default:        return 'text';
  }
}

// The ASCII form of a numeric string written in any of the 69 supported digit
// scripts: "४२" → "42". Mirrors Rust `ascii_digits`. Every numeric cast goes
// through this, so a number the program rendered under an active numeral mode
// parses back exactly like its ASCII twin — an application that prints ४२ must
// also accept ४२ back.
function asciiDigits(s) {
  return [...s].map(ch => {
    const dv = digitValue(ch);
    if (dv >= 0 && !(ch >= '0' && ch <= '9')) return String(dv);
    // A script's own decimal separator reads as a decimal point, since that is
    // what an active numeral mode writes: `٤٫٧٥` and `٤.٧٥` are one number.
    // The callers still validate the whole shape with a regex, so `1٫2٫3` is
    // rejected exactly as `1.2.3` is.
    if (ch !== '.' && isDecimalSeparator(ch)) return '.';
    return ch;
  }).join('');
}

// Ordering comparison (`<`, `<=`, `>`, `>=`) — the single rule all three engines
// share (mirrors Rust `cmp_order` / `compare_values`).
//
// Numeric when *both* sides are numbers, where a string counts as a number if
// `#|…|` would convert it: digits from any of the 69 supported scripts, so
// `"४२" > "९"` compares 42 against 9 exactly as `"42" > "9"` does. Two
// The `@ <expr>` specifier is either a count (Int, handled by the caller) or a
// condition (Bool). Anything else raises with the same message and the same
// type names the Rust and OCaml engines use, so the form fails identically
// everywhere instead of each engine inventing its own truthiness.
const LOOP_TYPE_WORDS = {
  int: 'integer', float: 'float', bool: 'bool', str: 'string', char: 'char',
  arr: 'array', tuple: 'tuple', func: 'function', error: 'error', unit: 'unit',
};
function loopCond(val) {
  if (val.type === 'bool') return val.v;
  const got = LOOP_TYPE_WORDS[val.type] ?? val.type;
  throw new ZyRuntimeError(`loop expects a count or a condition, got ${got}`, '##Type');
}

// non-numeric strings compare lexicographically. A number against non-numeric
// text returns null and the caller raises.
//
// Equality (`==`) deliberately does not come through here: `"5" == 5` is false.
// No ordering at all. Not a value whose sign the operators may read: an
// ordering comparison against NaN must be false in all four directions, so the
// callers test the code itself (see ordLt/ordLe/ordGt/ordGe).
const INCOMPARABLE = 2;
const ordLt = r => r === -1;
const ordLe = r => r === -1 || r === 0;
const ordGt = r => r === 1;
const ordGe = r => r === 1 || r === 0;

function orderValues(l, r) {
  // `a < b ? -1 : a > b ? 1 : 0` answered 0 for NaN — both tests are false —
  // so `nan <= 1.0` and `nan >= 1.0` were both true.
  const cmp = (a, b) => {
    if (typeof a === 'number' && Number.isNaN(a)) return INCOMPARABLE;
    if (typeof b === 'number' && Number.isNaN(b)) return INCOMPARABLE;
    return a < b ? -1 : a > b ? 1 : 0;
  };
  const strNum = v => {
    if (v.type !== 'str') return null;
    const a = asciiDigits(v.v.trim());
    if (!/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)([eE][+-]?[0-9]+)?$/.test(a)) return null;
    return Number(a);
  };
  const isNumV = v => v.type === 'int' || v.type === 'float';

  if (isNumV(l) && isNumV(r)) return cmp(l.v, r.v);
  if (l.type === 'str' && r.type === 'str') {
    const a = strNum(l), b = strNum(r);
    if (a !== null && b !== null) return cmp(a, b);
    return cmp(l.v, r.v);
  }
  if (l.type === 'str' && isNumV(r)) { const a = strNum(l); return a === null ? null : cmp(a, r.v); }
  if (isNumV(l) && r.type === 'str') { const b = strNum(r); return b === null ? null : cmp(l.v, b); }
  if (l.type === r.type && (l.type === 'char' || l.type === 'bool')) return cmp(l.v, r.v);
  return null;
}

// Legacy `#|v|` cast: best-effort numeric parse, falls back to String (never re-prompts).
// Mirrors parse_numeric_string: int first, then float, with Unicode-digit normalization.
function parseNumericInput(s) {
  const ascii = asciiDigits(s);
  // Text that spells an integer is judged by the integer rules alone: out of
  // range it stays a String and is *not* retried as a float, which would answer
  // 9007199254740992 for "9007199254740993".
  if (/^[+-]?[0-9]+$/.test(ascii)) {
    const n = Number(ascii);
    return inIntRange(n) ? mkInt(n) : mkStr(s);
  }
  if (/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(ascii)) return mkFloat(Number(ascii));
  return mkStr(s);
}

// Validate a trimmed input line against a cast; returns the typed value or null
// (the caller re-prompts on null).
function validateInput(s, cast) {
  // The numeric casts accept digits from any script (see asciiDigits); the text
  // casts keep the line exactly as typed.
  const num = asciiDigits(s);
  switch (cast.kind) {
    case 'string':  return mkStr(s);
    case 'numeric': return parseNumericInput(s);
    case 'float':
      return /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)([eE][+-]?[0-9]+)?$/.test(num) ? mkFloat(Number(num)) : null;
    case 'decimal': {
      const body = /^[+-]/.test(num) ? num.slice(1) : num;
      if (!/^[0-9.]+$/.test(body) || (body.match(/\./g) ?? []).length > 1 || body === '.') return null;
      const [intPart, fracPart = ''] = body.split('.');
      if (fracPart.length > cast.decimals || intPart.length + fracPart.length > cast.total) return null;
      return mkFloat(Number(num));
    }
    case 'int': {
      if (!/^[+-]?[0-9]+$/.test(num)) return null;
      const digits = (num.match(/[0-9]/g) ?? []).length;
      if (cast.maxDigits != null && digits > cast.maxDigits) return null;
      const n = Number(num);
      if (!inIntRange(n)) return null;   // re-prompt: not an integer this language holds
      return mkInt(n);
    }
    case 'text': {
      if (cast.max != null && [...s].length > cast.max) return null;
      return mkStr(s);
    }
    case 'char': {
      const chars = [...s];
      return chars.length === 1 ? mkChar(chars[0]) : null;
    }
    default: return mkStr(s);
  }
}

// ─── Deep update helper (G1) ──────────────────────────────────────────────────

function deepUpdateValue(col, indices, newVal) {
  if (indices.length === 0) return newVal;
  const i   = indices[0];
  // A dictionary step addresses a KEY. Adds the key when it is not there, just
  // as the single-level `d["k"]$~ v` does; refuses a position, because a
  // positional write corrupts data rather than returning the wrong value.
  if (isDict(col)) {
    if (typeof i !== 'string')
      throw new ZyError(Interpreter.notPositionalMsg('d[n>…]$~ value', col.keys));
    const ki = col.keys.indexOf(i);
    const sub = ki < 0 ? mkUnit() : col.v[ki];
    const updatedSub = deepUpdateValue(sub, indices.slice(1), newVal);
    if (ki < 0) return { type:'tuple', v:[...col.v, updatedSub], keys:[...col.keys, i] };
    const r = [...col.v]; r[ki] = updatedSub;
    return { type:'tuple', v:r, keys:col.keys };
  }
  const len = col.v?.length ?? 0;
  if (i === 0) throw new ZyRuntimeError('Index 0 is invalid (indices start at 1)', '##Index');
  const idx = i < 0 ? len + i : i - 1;
  if (idx < 0 || idx >= len)
    throw new ZyError(`index out of bounds: index ${i} for collection of length ${len}`);
  const sub        = col.v[idx];
  const updatedSub = deepUpdateValue(sub, indices.slice(1), newVal);
  if (col.type === 'arr')   { const r = [...col.v]; r[idx] = updatedSub; return mkArr(r); }
  if (col.type === 'tuple') { const r = [...col.v]; r[idx] = updatedSub; return { type:'tuple', v:r, keys:col.keys }; }
  throw new ZyError(`deep update ($~) not supported on ${col.type}`);
}

// ─── Terminal display width (mirrors unicode-width crate, backs std/term) ────
// Width answers a screen question, not a content question: CJK ideographs,
// kana, hangul and most emoji take two columns; combining marks and control
// characters take zero. This is a practical subset of the East Asian Width /
// zero-width tables, not the full Unicode database.
const TERM_WIDE_RANGES = [
  [0x1100,0x115F],[0x231A,0x231B],[0x2329,0x232A],[0x23E9,0x23EC],[0x23F0,0x23F0],
  [0x23F3,0x23F3],[0x25FD,0x25FE],[0x2614,0x2615],[0x2648,0x2653],[0x267F,0x267F],
  [0x2693,0x2693],[0x26A1,0x26A1],[0x26AA,0x26AB],[0x26BD,0x26BE],[0x26C4,0x26C5],
  [0x26CE,0x26CE],[0x26D4,0x26D4],[0x26EA,0x26EA],[0x26F2,0x26F3],[0x26F5,0x26F5],
  [0x26FA,0x26FA],[0x26FD,0x26FD],[0x2705,0x2705],[0x270A,0x270B],[0x2728,0x2728],
  [0x274C,0x274C],[0x274E,0x274E],[0x2753,0x2755],[0x2757,0x2757],[0x2795,0x2797],
  [0x27B0,0x27B0],[0x27BF,0x27BF],[0x2B1B,0x2B1C],[0x2B50,0x2B50],[0x2B55,0x2B55],
  [0x2E80,0x303E],[0x3041,0x33FF],[0x3400,0x4DBF],[0x4E00,0x9FFF],
  [0xA000,0xA4CF],[0xA960,0xA97F],[0xAC00,0xD7A3],[0xF900,0xFAFF],
  [0xFE30,0xFE4F],[0xFF00,0xFF60],[0xFFE0,0xFFE6],
  [0x16FE0,0x16FE4],[0x16FF0,0x16FF1],[0x17000,0x18D08],[0x1AFF0,0x1B16F],
  [0x1B170,0x1B2FB],[0x1F004,0x1F004],[0x1F0CF,0x1F0CF],[0x1F18E,0x1F18E],
  [0x1F191,0x1F19A],[0x1F200,0x1F320],[0x1F32D,0x1F335],[0x1F337,0x1F37C],
  [0x1F37E,0x1F393],[0x1F3A0,0x1F3CA],[0x1F3CF,0x1F3D3],[0x1F3E0,0x1F3F0],
  [0x1F3F4,0x1F3F4],[0x1F3F8,0x1F43E],[0x1F440,0x1F440],[0x1F442,0x1F4FC],
  [0x1F4FF,0x1F53D],[0x1F54B,0x1F54E],[0x1F550,0x1F567],[0x1F57A,0x1F57A],
  [0x1F595,0x1F596],[0x1F5A4,0x1F5A4],[0x1F5FB,0x1F64F],[0x1F680,0x1F6C5],
  [0x1F6CC,0x1F6CC],[0x1F6D0,0x1F6D2],[0x1F6D5,0x1F6D7],[0x1F6DD,0x1F6DF],
  [0x1F6EB,0x1F6EC],[0x1F6F4,0x1F6FC],[0x1F7E0,0x1F7EB],[0x1F7F0,0x1F7F0],
  [0x1F90C,0x1F93A],[0x1F93C,0x1F945],[0x1F947,0x1F9FF],[0x1FA70,0x1FAFF],
  [0x20000,0x2FFFD],[0x30000,0x3FFFD],
];
const TERM_ZERO_WIDTH_RANGES = [
  [0x0300,0x036F],[0x0483,0x0489],[0x0591,0x05BD],[0x05BF,0x05BF],[0x05C1,0x05C2],
  [0x05C4,0x05C5],[0x05C7,0x05C7],[0x0610,0x061A],[0x064B,0x065F],[0x0670,0x0670],
  [0x06D6,0x06DC],[0x06DF,0x06E4],[0x06E7,0x06E8],[0x06EA,0x06ED],[0x0711,0x0711],
  [0x0730,0x074A],[0x07A6,0x07B0],[0x07EB,0x07F3],[0x0816,0x0819],[0x081B,0x0823],
  [0x0825,0x0827],[0x0829,0x082D],[0x0859,0x085B],[0x08E3,0x0902],[0x093A,0x093A],
  [0x093C,0x093C],[0x0941,0x0948],[0x094D,0x094D],[0x0951,0x0957],[0x0962,0x0963],
  [0x0981,0x0981],[0x09BC,0x09BC],[0x09C1,0x09C4],[0x09CD,0x09CD],[0x09E2,0x09E3],
  [0x200B,0x200F],[0x202A,0x202E],[0x2060,0x2064],[0x2066,0x206F],
  [0xFE00,0xFE0F],[0xFE20,0xFE2F],[0x1AB0,0x1AFF],[0x1DC0,0x1DFF],[0x20D0,0x20FF],
  [0xE0100,0xE01EF],
];

function _inTermRanges(cp, ranges) {
  for (const [lo, hi] of ranges) if (cp >= lo && cp <= hi) return true;
  return false;
}

// Exported so the playground's canvas renderer measures characters with exactly the table
// the layout engine (std/term, and therefore every program's own column arithmetic) uses.
// BrowserTUI used to carry its own one-line approximation — `cp >= 0x1F000 || FF01..FFE6` —
// which called ⚫/⚪ (U+26AA/U+26AB) narrow while this table correctly calls them wide. The
// font then drew each stone two cells wide and the renderer clipped it to one, so every
// stone on a GO board came out sliced in half. One rule, one place.
export function codePointDisplayWidth(cp) {
  if (cp === 0) return 0;
  if (cp < 0x20 || (cp >= 0x7F && cp < 0xA0)) return 0; // control characters
  if (_inTermRanges(cp, TERM_ZERO_WIDTH_RANGES)) return 0;
  if (_inTermRanges(cp, TERM_WIDE_RANGES)) return 2;
  return 1;
}

// Grapheme clusters, used only where a cut must not split one (truncate).
// Width itself sums per-code-point, mirroring UnicodeWidthStr::width(&str).
function graphemeClusters(s) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    try {
      return [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(s)].map(x => x.segment);
    } catch (_) { /* fall through to code-point split */ }
  }
  return [...s];
}

function displayWidth(s) {
  let w = 0;
  for (const ch of s) w += codePointDisplayWidth(ch.codePointAt(0));
  return w;
}

function clusterDisplayWidth(g) {
  let w = 0;
  for (const ch of g) w += codePointDisplayWidth(ch.codePointAt(0));
  return w;
}

function termPad(s, cols, onLeft) {
  const deficit = cols - displayWidth(s);
  if (deficit <= 0) return s;
  const spaces = ' '.repeat(deficit);
  return onLeft ? spaces + s : s + spaces;
}

function termCenter(s, cols) {
  const deficit = cols - displayWidth(s);
  if (deficit <= 0) return s;
  const left = Math.floor(deficit / 2);
  return ' '.repeat(left) + s + ' '.repeat(deficit - left);
}

function termTruncate(s, cols) {
  if (displayWidth(s) <= cols) return s;
  let used = 0, out = '';
  for (const g of graphemeClusters(s)) {
    const w = clusterDisplayWidth(g);
    if (used + w > cols) break;
    out += g;
    used += w;
  }
  return out;
}

// ─── std/time: the civil calendar ────────────────────────────────────────────
//
// A port of `crates/zymbol-intrinsics/src/time.rs`, function for function. The
// browser has `Date`, which could answer most of this on its own — and would
// answer it *differently* at the edges: `Date` rolls 2026-13-01 over into
// January 2027 instead of refusing it, and its month is zero-based. An engine
// that agrees with the other two only in the middle of the range is an engine
// that diverges, so the calendar is computed here too. `Date` is used for one
// thing the browser alone knows: the machine's own zone offset at an instant.
//
// Howard Hinnant's era algorithms (public domain), the same ones behind C++20's
// <chrono>: exact over the proleptic Gregorian calendar with no tables.

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR   = 60 * MS_PER_MINUTE;
const MS_PER_DAY    = 24 * MS_PER_HOUR;
const MAX_SAFE_MS   = 9007199254740991;

const floorDiv = (a, b) => Math.floor(a / b);
const floorMod = (a, b) => a - floorDiv(a, b) * b;
const truncDiv = (a, b) => Math.trunc(a / b);

function daysFromCivil(year, month, day) {
  const y = month <= 2 ? year - 1 : year;
  const era = truncDiv(y >= 0 ? y : y - 399, 400);
  const yoe = y - era * 400;
  const mp = (month + 9) % 12;
  const doy = truncDiv(153 * mp + 2, 5) + day - 1;
  const doe = yoe * 365 + truncDiv(yoe, 4) - truncDiv(yoe, 100) + doy;
  return era * 146097 + doe - 719468;
}

function civilFromDays(days) {
  const z = days + 719468;
  const era = truncDiv(z >= 0 ? z : z - 146096, 146097);
  const doe = z - era * 146097;
  const yoe = truncDiv(doe - truncDiv(doe, 1460) + truncDiv(doe, 36524) - truncDiv(doe, 146096), 365);
  const y = yoe + era * 400;
  const doy = doe - (365 * yoe + truncDiv(yoe, 4) - truncDiv(yoe, 100));
  const mp = truncDiv(5 * doy + 2, 153);
  const d = doy - truncDiv(153 * mp + 2, 5) + 1;
  const m = mp < 10 ? mp + 3 : mp - 9;
  return [m <= 2 ? y + 1 : y, m, d];
}

const isLeap = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

function daysInMonth(year, month) {
  switch (month) {
    case 1: case 3: case 5: case 7: case 8: case 10: case 12: return 31;
    case 4: case 6: case 9: case 11: return 30;
    case 2: return isLeap(year) ? 29 : 28;
    default: return 0;
  }
}

// A thrown ZyTimeError becomes a soft `##Time`; it never escapes the module.
class ZyTimeError extends Error {}
const timeFail = msg => { throw new ZyTimeError(msg); };

// Units: one spelling each, in full. Duration below a day, calendar from a day up.
const TIME_UNITS = new Map([
  ['millisecond', ['duration', 1]],
  ['second',      ['duration', MS_PER_SECOND]],
  ['minute',      ['duration', MS_PER_MINUTE]],
  ['hour',        ['duration', MS_PER_HOUR]],
  ['day',         ['days', 1]],
  ['week',        ['days', 7]],
  ['month',       ['months', 1]],
  ['year',        ['months', 12]],
]);

function parseUnit(name) {
  const u = TIME_UNITS.get(name);
  if (!u) timeFail(`unknown unit '${name}': one of millisecond, second, minute, hour, day, week, month, year`);
  return u;
}

// A zone is 'UTC', 'local', or ±HHMM. `±HH:MM` is deliberately not a second
// spelling — ±HHMM is what `%z` writes and what `date +%z` prints.
function parseZone(spec) {
  if (spec === 'UTC') return { kind: 'utc' };
  if (spec === 'local') return { kind: 'local' };
  const m = /^([+-])(\d{2})(\d{2})$/.exec(spec ?? '');
  const bad = () => timeFail(`unknown zone '${spec}': use "UTC", "local", or an offset like "+1000" or "-0400"`);
  if (!m) bad();
  const hours = Number(m[2]), minutes = Number(m[3]);
  if (hours > 23 || minutes > 59) bad();
  return { kind: 'fixed', minutes: (m[1] === '-' ? -1 : 1) * (hours * 60 + minutes) };
}

const zoneOrUtc = spec => spec == null ? { kind: 'utc' } : parseZone(spec);

/// The offset a zone means AT AN INSTANT: a zone with daylight saving is two
/// different offsets in the same year.
function offsetOf(zone, epochMs) {
  if (zone.kind === 'utc') return 0;
  if (zone.kind === 'fixed') return zone.minutes;
  const d = new Date(epochMs);
  if (Number.isNaN(d.getTime()))
    timeFail(`instant ${epochMs} is outside the range a zone can be read at`);
  return -d.getTimezoneOffset();   // getTimezoneOffset counts minutes WEST
}

function partsAt(epochMs, offsetMin) {
  const shifted = epochMs + offsetMin * MS_PER_MINUTE;
  const days = floorDiv(shifted, MS_PER_DAY);
  const inDay = floorMod(shifted, MS_PER_DAY);
  const [year, month, day] = civilFromDays(days);
  return {
    year, month, day,
    hour:        truncDiv(inDay, MS_PER_HOUR),
    minute:      truncDiv(inDay, MS_PER_MINUTE) % 60,
    second:      truncDiv(inDay, MS_PER_SECOND) % 60,
    millisecond: inDay % MS_PER_SECOND,
    weekday:     floorMod(days + 3, 7) + 1,   // 1970-01-01 was a Thursday
    offset:      offsetMin,
  };
}

function guardMs(ms) {
  if (Math.abs(ms) > MAX_SAFE_MS) timeFail('the result leaves the integer range, ±(2^53 − 1)');
  return ms;
}

function epochFromCivil(year, month, day, hour, minute, second, millisecond, offsetMin) {
  if (year < -9999 || year > 9999) timeFail(`year ${year} is outside -9999..9999`);
  if (month < 1 || month > 12) timeFail(`month ${month} is outside 1..12`);
  const last = daysInMonth(year, month);
  if (day < 1 || day > last)
    timeFail(`day ${day} is outside 1..${last} for ${year}-${String(month).padStart(2, '0')}`);
  if (hour < 0 || hour > 23) timeFail(`hour ${hour} is outside 0..23`);
  if (minute < 0 || minute > 59) timeFail(`minute ${minute} is outside 0..59`);
  if (second < 0 || second > 59) timeFail(`second ${second} is outside 0..59`);
  if (millisecond < 0 || millisecond > 999) timeFail(`millisecond ${millisecond} is outside 0..999`);
  return guardMs(daysFromCivil(year, month, day) * MS_PER_DAY
    + hour * MS_PER_HOUR + minute * MS_PER_MINUTE + second * MS_PER_SECOND + millisecond
    - offsetMin * MS_PER_MINUTE);
}

// A local reading is circular — the offset depends on the instant and the
// instant on the offset — so it is resolved twice. Around a daylight-saving
// change the second pass is what moves the answer onto the right side.
function epochFromCivilIn(year, month, day, hour, minute, second, millisecond, zone) {
  let offset;
  if (zone.kind === 'utc') offset = 0;
  else if (zone.kind === 'fixed') offset = zone.minutes;
  else offset = offsetOf(zone, epochFromCivil(year, month, day, hour, minute, second, millisecond, 0));
  let ms = epochFromCivil(year, month, day, hour, minute, second, millisecond, offset);
  if (zone.kind === 'local') {
    const corrected = offsetOf(zone, ms);
    if (corrected !== offset)
      ms = epochFromCivil(year, month, day, hour, minute, second, millisecond, corrected);
  }
  return ms;
}

function timeAdd(epochMs, count, unit, zone) {
  const [kind, per] = unit;
  if (kind === 'duration') return guardMs(epochMs + count * per);
  const p = partsAt(epochMs, offsetOf(zone, epochMs));
  if (kind === 'days') {
    const [year, month, day] = civilFromDays(daysFromCivil(p.year, p.month, p.day) + count * per);
    return epochFromCivilIn(year, month, day, p.hour, p.minute, p.second, p.millisecond, zone);
  }
  const total = p.year * 12 + (p.month - 1) + count * per;
  const year = floorDiv(total, 12);
  const month = floorMod(total, 12) + 1;
  // Clamping is what every calendar does: one month after the 31st of January
  // is the 28th of February, because there is no 31st.
  const day = Math.min(p.day, daysInMonth(year, month));
  return epochFromCivilIn(year, month, day, p.hour, p.minute, p.second, p.millisecond, zone);
}

function timeDiff(a, b, unit, zone) {
  const [kind, per] = unit;
  if (kind === 'duration') return truncDiv(a - b, per);
  const pa = partsAt(a, offsetOf(zone, a));
  const pb = partsAt(b, offsetOf(zone, b));
  if (kind === 'days')
    return truncDiv(daysFromCivil(pa.year, pa.month, pa.day) - daysFromCivil(pb.year, pb.month, pb.day), per);
  let months = (pa.year - pb.year) * 12 + (pa.month - pb.month);
  const within = p => [p.day, p.hour, p.minute, p.second, p.millisecond];
  const cmp = (x, y) => { for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] < y[i] ? -1 : 1; return 0; };
  const c = cmp(within(pa), within(pb));
  // A whole month has not passed until the day-of-month is reached.
  if (months > 0 && c < 0) months -= 1;
  else if (months < 0 && c > 0) months += 1;
  return truncDiv(months, per);
}

const pad2 = n => (n < 10 ? '0' : '') + n;
const yearText = y => y < 0 ? '-' + String(-y).padStart(4, '0') : String(y).padStart(4, '0');
const offsetText = m =>
  (m < 0 ? '-' : '+') + pad2(truncDiv(Math.abs(m), 60)) + pad2(Math.abs(m) % 60);
const dayOfYear = p => daysFromCivil(p.year, p.month, p.day) - daysFromCivil(p.year, 1, 1) + 1;

// The digits are ALWAYS ASCII, whatever numeral mode the program is in. A date
// is the one piece of text a program writes for a machine to read back, and
// `२०२६-०८-२३` is not ISO 8601. Text for a person is built from `parts`, whose
// numbers print in whatever script the mode selects.
function timeFormat(epochMs, pattern, offsetMin) {
  const p = partsAt(epochMs, offsetMin);
  let out = '';
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i];
    if (c !== '%') { out += c; continue; }
    if (i + 1 >= pattern.length) timeFail("pattern ends in a lone '%'");
    switch (pattern[++i]) {
      case 'Y': out += yearText(p.year); break;
      case 'm': out += pad2(p.month); break;
      case 'd': out += pad2(p.day); break;
      case 'H': out += pad2(p.hour); break;
      case 'M': out += pad2(p.minute); break;
      case 'S': out += pad2(p.second); break;
      case 'L': out += String(p.millisecond).padStart(3, '0'); break;
      case 'j': out += String(dayOfYear(p)).padStart(3, '0'); break;
      case 'u': out += String(p.weekday); break;
      case 'z': out += offsetText(p.offset); break;
      case 'F': out += `${yearText(p.year)}-${pad2(p.month)}-${pad2(p.day)}`; break;
      case 'T': out += `${pad2(p.hour)}:${pad2(p.minute)}:${pad2(p.second)}`; break;
      case '%': out += '%'; break;
      default:
        timeFail(`unknown pattern '%${pattern[i]}': one of %Y %m %d %H %M %S %L %j %u %z %F %T %%`);
    }
  }
  return out;
}

const isoDate = (epochMs, offsetMin) => {
  const p = partsAt(epochMs, offsetMin);
  return `${yearText(p.year)}-${pad2(p.month)}-${pad2(p.day)}`;
};

// The order `parts` builds its dictionary in, which is the order it iterates in.
const TIME_PART_NAMES = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond', 'weekday', 'offset'];

// ─── What std/ exports, and with how many arguments ──────────────────────────
//
// Mirrors `crates/zymbol-common/src/stdlib.rs`, which is the canonical list —
// the Rust engines, `zymbol check` and the LSP all read it, and it is what makes
// `math::sqrt(4.0, 9.0)` a semantic error since v0.0.9. Without a copy here the
// browser engine ran that call and printed `2`, so the playground disagreed with
// the CLI on a program the CLI refuses outright.
//
// `-1` is variadic: `math::log(8.0)` and `math::log(8.0, 2.0)` are both correct.
//
// The functions themselves are built below by `buildStdlibModule`; this table is
// only about how many arguments each takes, so adding a function means touching
// both. `web/tests/test_check.mjs` compares this table against the Rust one.
export const STDLIB_ARITIES = new Map([
  ['std/math', new Map([
    ['sqrt',1],['exp',1],['ln',1],['log',-1],['pow',2],['sin',1],['cos',1],['tan',1],
    ['asin',1],['acos',1],['atan',1],['atan2',2],['tanh',1],['sinh',1],['cosh',1],
    ['sigmoid',1],['abs',1],['max',2],['min',2],['floor',1],['ceil',1],['round',1],
  ])],
  ['std/random', new Map([['entero',2],['rango',1],['peso_f64',0]])],
  ['std/json',   new Map([['decode',1],['decode_map',2],['encode',1]])],
  ['std/io',     new Map([['read',1],['write',2],['append',2],['exists',1],['delete',1],['list',1],['mkdir',1]])],
  ['std/net',    new Map([['get',-1],['post',-1],['post_json',-1],['head',1]])],
  ['std/term',   new Map([['width',1],['pad_left',2],['pad_right',2],['center',2],['truncate',2]])],
  // Everything but `now` takes an optional trailing zone, so everything but
  // `now` is variadic.
  ['std/time',   new Map([['now',0],['today',-1],['parts',-1],['of',-1],['format',-1],['add',-1],['diff',-1]])],
  ['std/db',     new Map([
    ['connect',2],['disconnect',1],['exec',-1],['query',-1],['query_one',-1],['query_value',-1],
    ['tx',2],['begin',1],['commit',1],['rollback',1],['savepoint',2],['release',2],
    ['rollback_to',2],['exec_script',2],['table_exists',2],
  ])],
]);

// ─── The type symbols ────────────────────────────────────────────────────────
//
// Mirrors `crates/zymbol-common/src/typesym.rs`, which is the canonical table —
// ten spellings, each `##` plus one character. For the collections the rule is
// that the unmarked one takes the CLOSING delimiter and the marked one the
// OPENING one: `[…]` is `##]` and `#[…]` is `##[`, `(…)` is `##)` and `#(…)` is
// `##(`.
//
// Two kinds of answer, and the difference matters:
//
//   typeSymbolBase   what a value IS. A dictionary is `##(` everywhere a type is
//                    named, error messages included, because it really is a
//                    different type from a tuple — it carries keys, it is
//                    mutable, and `zyq consensus` compares those messages across
//                    engines to the character.
//   typeSymbol       what `#?` answers: the same, except an array whose elements
//                    are not all one type is a list, `##[`. That is NOT a type —
//                    `[…]` and `#[…]` are one type by decision 15 — it is read
//                    from what the value holds when asked. So a heterogeneous
//                    array out of `json::decode` answers `##[` with no mark
//                    anywhere, and `#[1, "dos"]$-[2]` answers `##]`, because a
//                    single Int is not a mix.
const TYPESYM = {
  INT: '###', FLOAT: '##.', STRING: '##"', CHAR: "##'", BOOL: '##?',
  ARRAY: '##]', LIST: '##[', TUPLE: '##)', DICT: '##(', UNIT: '##_',
  FUNCTION: '##()', LAMBDA: '##->',
};

const TYPESYM_BY_TAG = {
  int: TYPESYM.INT, float: TYPESYM.FLOAT, str: TYPESYM.STRING,
  char: TYPESYM.CHAR, bool: TYPESYM.BOOL, arr: TYPESYM.ARRAY,
  unit: TYPESYM.UNIT,
};

function typeSymbolBase(v) {
  if (v?.type === 'func') return v.name === '<lambda>' ? TYPESYM.LAMBDA : TYPESYM.FUNCTION;
  if (v?.type === 'tuple') return isDict(v) ? TYPESYM.DICT : TYPESYM.TUPLE;
  return TYPESYM_BY_TAG[v?.type] ?? TYPESYM.UNIT;
}

// `##]` when the elements are all one type, `##[` when they are not. The
// elements' BASE symbols are compared, so an array of arrays is uniform whatever
// those inner arrays hold: this describes one level, and two arrays are the same
// type as each other. An empty array is uniform — nothing in it can disagree.
function typeSymbol(v) {
  if (v?.type !== 'arr') return typeSymbolBase(v);
  const items = v.v ?? [];
  if (items.length === 0) return TYPESYM.ARRAY;
  const first = typeSymbolBase(items[0]);
  return items.every(x => typeSymbolBase(x) === first) ? TYPESYM.ARRAY : TYPESYM.LIST;
}

// ─── Standard library modules (std/math, std/random, std/json, std/net, std/io, std/term) ─

function buildStdlibModule(name, vfs = null) {
  const asF64 = v => v?.type === 'float' ? v.v : v?.type === 'int' ? v.v : null;
  const typeCode = typeSymbolBase;
  const typeErr = (fn, ...badArgs) => {
    const codes = (badArgs.length > 0 ? badArgs : [null])
      .map(a => `"${typeCode(a).replace(/"/g, '\\"')}"`)
      .join(', ');
    throw new ZyError(`mat::${fn}: incompatible argument type(s) [${codes}]`);
  };

  if (name === 'std/math') {
    const exports = new Map();
    const unary = (fn, f) => ({ type: 'func', name: fn, native: true, call: args => {
      const x = asF64(args[0]); if (x === null) typeErr(fn, args[0]); return mkFloat(f(x));
    }});

    exports.set('sqrt',    unary('sqrt',    x => Math.sqrt(x)));
    exports.set('exp',     unary('exp',     x => Math.exp(x)));
    exports.set('ln',      { type: 'func', name: 'ln', native: true, call: args => {
      const x = asF64(args[0]); if (x === null) typeErr('ln', args[0]);
      if (x <= 0) throw new ZyError('mat::ln: argument must be positive');
      return mkFloat(Math.log(x));
    }});
    exports.set('sin',     unary('sin',     x => Math.sin(x)));
    exports.set('cos',     unary('cos',     x => Math.cos(x)));
    exports.set('tan',     unary('tan',     x => Math.tan(x)));
    exports.set('asin',    { type: 'func', name: 'asin', native: true, call: args => {
      const x = asF64(args[0]); if (x === null) typeErr('asin', args[0]);
      if (x < -1 || x > 1) throw new ZyError('mat::asin: argument must be in [-1, 1]');
      return mkFloat(Math.asin(x));
    }});
    exports.set('acos',    { type: 'func', name: 'acos', native: true, call: args => {
      const x = asF64(args[0]); if (x === null) typeErr('acos', args[0]);
      if (x < -1 || x > 1) throw new ZyError('mat::acos: argument must be in [-1, 1]');
      return mkFloat(Math.acos(x));
    }});
    exports.set('atan',    unary('atan',    x => Math.atan(x)));
    exports.set('tanh',    unary('tanh',    x => Math.tanh(x)));
    exports.set('sinh',    unary('sinh',    x => Math.sinh(x)));
    exports.set('cosh',    unary('cosh',    x => Math.cosh(x)));
    exports.set('sigmoid', unary('sigmoid', x => 1 / (1 + Math.exp(-x))));
    exports.set('floor',   unary('floor',   x => Math.floor(x)));
    exports.set('ceil',    unary('ceil',    x => Math.ceil(x)));
    // Half away from zero, which is the rule the `###` cast in this same engine
    // already followed and the other three engines follow here. `Math.round`
    // breaks ties toward +∞ instead: it answers -2 for -2.5 where Zymbol says
    // -3, and -0 for -0.5 where Zymbol says -1.
    exports.set('round',   unary('round',   x => (x >= 0 ? Math.floor(x + 0.5) : Math.ceil(x - 0.5))));
    exports.set('abs',     { type: 'func', name: 'abs', native: true, call: args => {
      if (args[0]?.type === 'int')   return mkInt(Math.abs(args[0].v));
      const x = asF64(args[0]); if (x === null) typeErr('abs', args[0]);
      return mkFloat(Math.abs(x));
    }});
    exports.set('atan2',   { type: 'func', name: 'atan2', native: true, call: args => {
      const y = asF64(args[0]), x = asF64(args[1]);
      if (y === null || x === null) typeErr('atan2', args[0], args[1]);
      return mkFloat(Math.atan2(y, x));
    }});
    exports.set('log',     { type: 'func', name: 'log', native: true, call: args => {
      const x = asF64(args[0]); if (x === null || x <= 0) throw new ZyError('mat::log: x and base must be positive; base ≠ 1');
      if (args.length === 1) return mkFloat(Math.log(x));
      const base = asF64(args[1]);
      if (base === null || base <= 0 || base === 1) throw new ZyError('mat::log: x and base must be positive; base ≠ 1');
      return mkFloat(Math.log(x) / Math.log(base));
    }});
    exports.set('pow',     { type: 'func', name: 'pow', native: true, call: args => {
      const b = asF64(args[0]), e = asF64(args[1]);
      if (b === null || e === null) typeErr('pow', args[0], args[1]);
      return mkFloat(Math.pow(b, e));
    }});
    exports.set('max',     { type: 'func', name: 'max', native: true, call: args => {
      if (args[0]?.type === 'int' && args[1]?.type === 'int') return mkInt(Math.max(args[0].v, args[1].v));
      const a = asF64(args[0]), b = asF64(args[1]); if (a === null || b === null) typeErr('max', args[0], args[1]);
      return mkFloat(Math.max(a, b));
    }});
    exports.set('min',     { type: 'func', name: 'min', native: true, call: args => {
      if (args[0]?.type === 'int' && args[1]?.type === 'int') return mkInt(Math.min(args[0].v, args[1].v));
      const a = asF64(args[0]), b = asF64(args[1]); if (a === null || b === null) typeErr('min', args[0], args[1]);
      return mkFloat(Math.min(a, b));
    }});
    exports.set('PI', mkFloat(Math.PI));
    exports.set('E',  mkFloat(Math.E));
    return { type: 'module', exports };
  }

  if (name === 'std/random') {
    const exports = new Map();
    exports.set('entero', { type: 'func', name: 'entero', native: true, call: args => {
      if (args[0]?.type !== 'int' || args[1]?.type !== 'int' || args[1].v < args[0].v)
        throw new ZyError('random::entero: expected (###, ###) with max >= min');
      return mkInt(args[0].v + Math.floor(Math.random() * (args[1].v - args[0].v + 1)));
    }});
    exports.set('rango', { type: 'func', name: 'rango', native: true, call: args => {
      if (args[0]?.type !== 'int' || args[0].v <= 0)
        throw new ZyError('random::rango: expected positive ###');
      return mkInt(Math.floor(Math.random() * args[0].v));
    }});
    exports.set('peso_f64', { type: 'func', name: 'peso_f64', native: true, call: () =>
      mkFloat((Math.floor(Math.random() * 201) - 100) / 1000)
    });
    return { type: 'module', exports };
  }

  // std/json — mirrors stdlib/json.rs: decode/encode, soft ##Parse on malformed
  // JSON, hard error on wrong argument type. Object↔NamedTuple, null↔Unit.
  if (name === 'std/json') {
    const exports = new Map();
    const jsonToValue = j => {
      if (j === null) return mkUnit();
      if (typeof j === 'boolean') return mkBool(j);
      if (typeof j === 'number') return Number.isSafeInteger(j) ? mkInt(j) : mkFloat(j);
      if (typeof j === 'string') return mkStr(j);
      if (Array.isArray(j)) return mkArr(j.map(jsonToValue));
      return { type: 'tuple', v: Object.values(j).map(jsonToValue), keys: Object.keys(j) };
    };
    const valueToJson = v => {
      switch (v?.type) {
        case 'bool':  return v.v;
        case 'int': case 'float': return v.v;
        case 'str': case 'char':  return String(v.v);
        case 'arr':   return v.v.map(valueToJson);
        case 'tuple':
          return isDict(v)
            ? Object.fromEntries(v.v.map((item, i) => [v.keys[i], valueToJson(item)]))
            : v.v.map(valueToJson);
        default: return null; // unit, func, error
      }
    };
    exports.set('decode', { type: 'func', name: 'decode', native: true, call: args => {
      if (args[0]?.type !== 'str') throw new ZyError('json::decode: expected String');
      try { return jsonToValue(JSON.parse(args[0].v)); }
      catch (e) { return { type: 'error', errType: '##Parse', v: e.message }; }
    }});
    // decode_map — mirrors json_decode_map in stdlib/json.rs: decode + recursive
    // key rename per a NamedTuple map (data-level i18n). Unit map = plain decode.
    const buildRenameMap = map => {
      if (map == null || map.type === 'unit') return new Map();
      if (!isDict(map)) {
        throw new ZyError('json::decode_map: expected a NamedTuple map as the second argument');
      }
      const table = new Map();
      map.keys.forEach((k, i) => {
        if (k === null) return;
        const dst = map.v[i];
        if (dst?.type !== 'str') {
          throw new ZyError(`json::decode_map: map value for '${k}' must be a String (the new name)`);
        }
        table.set(k, String(dst.v));
      });
      return table;
    };
    const rekey = (value, table) => {
      if (value?.type === 'tuple') {
        const keys = value.keys?.map(k => (k !== null && table.has(k)) ? table.get(k) : k);
        return { type: 'tuple', v: value.v.map(item => rekey(item, table)), keys };
      }
      if (value?.type === 'arr') return mkArr(value.v.map(item => rekey(item, table)));
      return value;
    };
    exports.set('decode_map', { type: 'func', name: 'decode_map', native: true, call: args => {
      if (args[0]?.type !== 'str') throw new ZyError('json::decode_map: expected String as the first argument');
      const table = buildRenameMap(args[1]);
      try { return rekey(jsonToValue(JSON.parse(args[0].v)), table); }
      catch (e) { return { type: 'error', errType: '##Parse', v: e.message }; }
    }});
    exports.set('encode', { type: 'func', name: 'encode', native: true, call: args => {
      try { return mkStr(JSON.stringify(valueToJson(args[0] ?? mkUnit()))); }
      catch (e) { return { type: 'error', errType: '##Parse', v: e.message }; }
    }});
    return { type: 'module', exports };
  }

  // std/net — mirrors stdlib/net.rs over fetch(). Soft ##Network on failure
  // (incl. non-2xx, like ureq), hard error on wrong argument type. Browser
  // caveat: cross-origin requests need CORS support on the server.
  if (name === 'std/net') {
    const exports = new Map();
    const netErr = msg => ({ type: 'error', errType: '##Network', v: msg });
    const strOf  = v => v?.type === 'str' ? v.v : null;
    const parseHeaders = (arg, fname) => {
      if (arg == null || arg.type === 'unit') return [];
      const bad = () => new ZyError(`${fname}: headers must be an Array of (String, String) tuples`);
      if (arg.type !== 'arr') throw bad();
      return arg.v.map(item => {
        if (item?.type !== 'tuple' || item.v.length !== 2) throw bad();
        const k = strOf(item.v[0]), v = strOf(item.v[1]);
        if (k === null || v === null) throw bad();
        return [k, v];
      });
    };
    const request = async (url, headerPairs, contentType, body) => {
      const headers = new Headers();
      if (contentType) headers.set('Content-Type', contentType);
      for (const [k, v] of headerPairs) headers.set(k, v);
      try {
        const resp = await fetch(url, body == null
          ? { headers }
          : { method: 'POST', headers, body });
        if (!resp.ok) return netErr(`${url}: status code ${resp.status}`);
        return mkStr(await resp.text());
      } catch (e) {
        return netErr(e.message ?? String(e));
      }
    };
    exports.set('get', { type: 'func', name: 'get', native: true, call: args => {
      const url = strOf(args[0]);
      if (url === null) throw new ZyError('net::get: expected String url');
      return request(url, parseHeaders(args[1], 'net::get'), null, null);
    }});
    exports.set('post', { type: 'func', name: 'post', native: true, call: args => {
      const url = strOf(args[0]), body = strOf(args[1]);
      if (url === null || body === null) throw new ZyError('net::post: expected (String, String)');
      return request(url, parseHeaders(args[2], 'net::post'), 'text/plain', body);
    }});
    exports.set('post_json', { type: 'func', name: 'post_json', native: true, call: args => {
      const url = strOf(args[0]), body = strOf(args[1]);
      if (url === null || body === null) throw new ZyError('net::post_json: expected (String, String)');
      return request(url, parseHeaders(args[2], 'net::post_json'), 'application/json', body);
    }});
    exports.set('head', { type: 'func', name: 'head', native: true, call: async args => {
      const url = strOf(args[0]);
      if (url === null) throw new ZyError('net::head: expected String url');
      try { return mkBool((await fetch(url, { method: 'HEAD' })).ok); }
      catch { return mkBool(false); }
    }});
    return { type: 'module', exports };
  }

  // std/io — mirrors stdlib/io.rs over a per-run virtual filesystem (browser
  // has no real FS). Soft ##IO on failure, hard error on wrong argument type.
  if (name === 'std/io' && vfs) {
    const exports = new Map();
    const { files, dirs } = vfs;
    const NOENT = 'No such file or directory (os error 2)';
    const ioErr = msg => ({ type: 'error', errType: '##IO', v: msg });
    const norm  = p => p.length > 1 ? p.replace(/\/+$/, '') : p;
    const strArg = (a, msg) => {
      if (a?.type !== 'str') throw new ZyError(msg);
      return norm(a.v);
    };
    exports.set('read', { type: 'func', name: 'read', native: true, call: args => {
      const p = strArg(args[0], 'io::read: expected String path');
      return files.has(p) ? mkStr(files.get(p)) : ioErr(NOENT);
    }});
    exports.set('write', { type: 'func', name: 'write', native: true, call: args => {
      if (args[0]?.type !== 'str' || args[1]?.type !== 'str')
        throw new ZyError('io::write: expected (String, String)');
      files.set(norm(args[0].v), args[1].v);
      return mkUnit();
    }});
    exports.set('append', { type: 'func', name: 'append', native: true, call: args => {
      if (args[0]?.type !== 'str' || args[1]?.type !== 'str')
        throw new ZyError('io::append: expected (String, String)');
      const p = norm(args[0].v);
      files.set(p, (files.get(p) ?? '') + args[1].v);
      return mkUnit();
    }});
    exports.set('exists', { type: 'func', name: 'exists', native: true, call: args => {
      const p = strArg(args[0], 'io::exists: expected String path');
      return mkBool(files.has(p) || dirs.has(p));
    }});
    exports.set('delete', { type: 'func', name: 'delete', native: true, call: args => {
      const p = strArg(args[0], 'io::delete: expected String path');
      if (dirs.has(p)) {
        for (const d of [...dirs])       if (d === p || d.startsWith(p + '/')) dirs.delete(d);
        for (const f of [...files.keys()]) if (f.startsWith(p + '/')) files.delete(f);
        return mkUnit();
      }
      if (files.delete(p)) return mkUnit();
      return ioErr(NOENT);
    }});
    exports.set('list', { type: 'func', name: 'list', native: true, call: args => {
      const p = strArg(args[0], 'io::list: expected String path');
      if (!dirs.has(p)) return ioErr(NOENT);
      const names = new Set();
      for (const f of files.keys())
        if (f.startsWith(p + '/') && !f.slice(p.length + 1).includes('/'))
          names.add(f.slice(p.length + 1));
      for (const d of dirs)
        if (d.startsWith(p + '/') && !d.slice(p.length + 1).includes('/'))
          names.add(d.slice(p.length + 1));
      return mkArr([...names].map(mkStr));
    }});
    exports.set('mkdir', { type: 'func', name: 'mkdir', native: true, call: args => {
      const p = strArg(args[0], 'io::mkdir: expected String path');
      const parts = p.split('/').filter(Boolean);
      let acc = p.startsWith('/') ? '' : null;
      for (const part of parts) {
        acc = acc === null ? part : `${acc}/${part}`;
        dirs.add(acc);
      }
      return mkUnit();
    }});
    return { type: 'module', exports };
  }

  // std/term — terminal display metrics (mirrors stdlib/term.rs). Answers a
  // question about the screen, not about a string's content: split, slice,
  // replace, repeat stay language symbols and never enter this module.
  // std/time — the clock and the civil calendar. Mirrors
  // `crates/zymbol-interpreter/src/stdlib/time.rs`; the calendar itself is
  // ported above rather than delegated to `Date`, which rolls an impossible
  // date over instead of refusing it.
  //
  // A wrong argument TYPE throws (the caller's bug); a wrong VALUE — month 13,
  // an unknown zone, `%Q` — comes back as a soft `##Time`, catchable, because
  // that is data and a program reading dates from outside must be able to
  // handle it.
  if (name === 'std/time') {
    const exports = new Map();
    const timeErr = msg => ({ type: 'error', errType: '##Time', v: msg });
    // Every entry point funnels through here: anything the calendar refuses
    // becomes a soft error, and nothing else is caught.
    const soft = fn => { try { return fn(); } catch (e) {
      if (e instanceof ZyTimeError) return timeErr(e.message);
      throw e;
    }};
    const intArg = (a, msg) => { if (a?.type !== 'int') throw new ZyError(msg); return a.v; };
    const strArg = (a, msg) => { if (a?.type !== 'str') throw new ZyError(msg); return a.v; };
    // The optional trailing zone: absent, or present and text.
    const zoneArg = (args, from, msg) => {
      const a = args[from];
      if (a === undefined) return null;
      if (a.type !== 'str') throw new ZyError(msg);
      return a.v;
    };

    exports.set('now', { type: 'func', name: 'now', native: true, call: () => mkInt(Date.now()) });

    exports.set('today', { type: 'func', name: 'today', native: true, call: args => {
      const zone = zoneArg(args, 0, 'time::today: expected an optional zone String');
      return soft(() => {
        const now = Date.now();
        return mkStr(isoDate(now, offsetOf(zoneOrUtc(zone), now)));
      });
    }});

    exports.set('parts', { type: 'func', name: 'parts', native: true, call: args => {
      const msg = 'time::parts: expected (### epoch [, zone])';
      const epoch = intArg(args[0], msg);
      const zone = zoneArg(args, 1, msg);
      return soft(() => {
        const p = partsAt(epoch, offsetOf(zoneOrUtc(zone), epoch));
        return { type: 'tuple', v: TIME_PART_NAMES.map(k => mkInt(p[k])), keys: [...TIME_PART_NAMES] };
      });
    }});

    exports.set('of', { type: 'func', name: 'of', native: true, call: args => {
      const msg = 'time::of: expected (year, month, day) or (year, month, day, hour, minute, second), each ###, plus an optional zone';
      // The zone is text and every field is a number, so a trailing String is
      // the zone and nothing else can be.
      const last = args[args.length - 1];
      const hasZone = last?.type === 'str';
      const fields = hasZone ? args.slice(0, -1) : args;
      const zone = hasZone ? last.v : null;
      const n = fields.map(f => intArg(f, msg));
      return soft(() => {
        let y, mo, d, h = 0, mi = 0, sec = 0;
        if (n.length === 3) [y, mo, d] = n;
        else if (n.length === 6) [y, mo, d, h, mi, sec] = n;
        else timeFail(`expected 3 numbers (year, month, day) or 6 (…, hour, minute, second), got ${n.length}`);
        return mkInt(epochFromCivilIn(y, mo, d, h, mi, sec, 0, zoneOrUtc(zone)));
      });
    }});

    exports.set('format', { type: 'func', name: 'format', native: true, call: args => {
      const msg = 'time::format: expected (### epoch, "pattern" [, zone])';
      const epoch = intArg(args[0], msg);
      const pattern = strArg(args[1], msg);
      const zone = zoneArg(args, 2, msg);
      return soft(() => mkStr(timeFormat(epoch, pattern, offsetOf(zoneOrUtc(zone), epoch))));
    }});

    exports.set('add', { type: 'func', name: 'add', native: true, call: args => {
      const msg = 'time::add: expected (### epoch, ### count, "unit" [, zone])';
      const epoch = intArg(args[0], msg);
      const count = intArg(args[1], msg);
      const unit = strArg(args[2], msg);
      const zone = zoneArg(args, 3, msg);
      return soft(() => mkInt(timeAdd(epoch, count, parseUnit(unit), zoneOrUtc(zone))));
    }});

    exports.set('diff', { type: 'func', name: 'diff', native: true, call: args => {
      const msg = 'time::diff: expected (### a, ### b, "unit" [, zone])';
      const a = intArg(args[0], msg);
      const b = intArg(args[1], msg);
      const unit = strArg(args[2], msg);
      const zone = zoneArg(args, 3, msg);
      return soft(() => mkInt(timeDiff(a, b, parseUnit(unit), zoneOrUtc(zone))));
    }});

    return { type: 'module', exports };
  }

  if (name === 'std/term') {
    const exports = new Map();
    exports.set('width', { type: 'func', name: 'width', native: true, call: args => {
      const v = args[0];
      if (v?.type === 'str' || v?.type === 'char') return mkInt(displayWidth(v.v));
      throw new ZyError('term::width: expected a String or Char');
    }});
    exports.set('pad_left', { type: 'func', name: 'pad_left', native: true, call: args => {
      if (args[0]?.type !== 'str' || args[1]?.type !== 'int') throw new ZyError('term::pad_left: expected (String, ###)');
      return mkStr(termPad(args[0].v, args[1].v, true));
    }});
    exports.set('pad_right', { type: 'func', name: 'pad_right', native: true, call: args => {
      if (args[0]?.type !== 'str' || args[1]?.type !== 'int') throw new ZyError('term::pad_right: expected (String, ###)');
      return mkStr(termPad(args[0].v, args[1].v, false));
    }});
    exports.set('center', { type: 'func', name: 'center', native: true, call: args => {
      if (args[0]?.type !== 'str' || args[1]?.type !== 'int') throw new ZyError('term::center: expected (String, ###)');
      return mkStr(termCenter(args[0].v, args[1].v));
    }});
    exports.set('truncate', { type: 'func', name: 'truncate', native: true, call: args => {
      if (args[0]?.type !== 'str' || args[1]?.type !== 'int') throw new ZyError('term::truncate: expected (String, ###)');
      return mkStr(termTruncate(args[0].v, args[1].v));
    }});
    return { type: 'module', exports };
  }

  return null;
}

// ─── Closure capture: the names a body reads from outside itself ─────────────
//
// Mirrors `collect_refs_in_body` + `capture_only` in the tree-walker. A lambda
// takes a SNAPSHOT of those names when it is created, and each call gets a fresh
// copy of it. Three consequences, and all three used to be wrong here:
//
//   base = 1 ; l = (x -> x + base) ; base = 50
//   l(0)                     → 1, not 50: the snapshot is from creation time
//
//   cont = 0 ; esc = (x -> { cont = cont + x  <~ cont })
//   esc(5) esc(5) esc(5)     → 5 5 5, not 5 10 15: each call copies the snapshot
//   cont                     → 0: a write never escapes the call
//
// This engine kept a live reference to the defining scope instead, so it read
// through to whatever the variable held later and wrote back out through it.
// `corpus.toml` carried the divergence as "closure snapshot semantics … are not
// implemented in the browser engine" for two files; it is implemented now.
//
// The walk is generic over the AST — every node is a plain object — so a node
// shape added later is covered without being listed here. Over-collecting costs
// nothing: a name the defining scope cannot resolve is simply not captured.
function collectIdentNames(node, out) {
  if (node === null || typeof node !== 'object') return out;
  if (Array.isArray(node)) {
    for (const n of node) collectIdentNames(n, out);
    return out;
  }
  if (node.type === 'Ident' && typeof node.name === 'string') out.add(node.name);
  // A call keeps its callee as a bare STRING (`{type:'Call', callee:'f'}`), not
  // as an `Ident` node, so the walk above cannot see it. That name is read from
  // the scope exactly like any other — it is how `compose(f, g) { <~ x -> f(g(x)) }`
  // reaches its own parameters from inside the lambda it returns.
  if (node.type === 'Call' && typeof node.callee === 'string') out.add(node.callee);
  for (const k of Object.keys(node)) {
    if (k === 'type' || k === 'line') continue;
    collectIdentNames(node[k], out);
  }
  return out;
}

/**
 * Snapshot what a lambda body reads from outside itself.
 *
 * Parameters are excluded: they are bound by the call, not captured. Anything
 * the defining scope cannot resolve is skipped — a name introduced inside the
 * body, or a function, which is reached through the global scope at call time.
 */
/**
 * The next function identity. Mirrors `FnIdentity` in the tree-walker.
 *
 * A named function taken as a value is COPIED so the copy can carry its own
 * captures, and object identity would then say `f == adder` is `#0` while both
 * Rust engines say `#1` — they compare the definition, not the value built from
 * it (BUG-ZYB-012). So identity is carried explicitly and the copy keeps it.
 */
let NEXT_FN_ID = 1;
const nextFnId = () => NEXT_FN_ID++;

function captureFor(params, body, env) {
  const excluded = new Set(params.map(p => (typeof p === 'string' ? p : p?.name)));
  const names = collectIdentNames(body, new Set());
  const snap = new Map();
  for (const name of names) {
    if (excluded.has(name)) continue;
    let v;
    try { v = env.get(name); } catch { continue; }
    if (v !== undefined) snap.set(name, v);
  }
  return snap;
}

// ─── Interpreter ──────────────────────────────────────────────────────────────

export class Interpreter {
  // A module binding's initialiser must NAME a value, not compute one — the
  // module body runs nothing, which is what E013 is for.
  //
  // Mirrors `Parser::is_literal_expr` in `zymbol-parser/src/modules.rs`: a
  // scalar, a scalar carrying a sign, or a collection literal every one of
  // whose elements is itself one of those. The rule is recursive, so a
  // dictionary of dictionaries — a decoded JSON object's shape — qualifies,
  // while `json::decode(raw)` does not, at any depth.
  //
  // A parenthesised expression needs no unwrapping here: this parser returns
  // the inner value rather than a wrapper node.
  static isModuleLiteral(e) {
    if (!e) return false;
    switch (e.type) {
      case 'Literal': return true;
      case 'UnaryOp': return e.op === '-' && e.operand?.type === 'Literal';
      case 'Array':   return (e.items ?? []).every(Interpreter.isModuleLiteral);
      case 'Tuple':   return (e.items ?? []).every(Interpreter.isModuleLiteral);
      default:        return false;
    }
  }

  // Default inputFn signals EOF (null): with no input source attached, << aborts
  // like the CLI does on a closed stdin instead of looping on empty reads.
  constructor(outputFn, inputFn = async () => null, moduleResolver = null, tuiContext = null) {
    this.outputFn        = outputFn;
    this.inputFn         = inputFn;
    this.steps           = 0;
    this.maxSteps        = 50_000;
    this.maxInfiniteIter = 100_000;
    this.outputBytes     = 0;
    this.maxBytes        = 32_000;
    this.lastYield       = performance.now();
    this.numeralMode     = 0x0030;
    this.moduleResolver  = moduleResolver;
    this.moduleCache     = new Map();
    // Import aliases, kept out of the variable environment on purpose: `alias::fn(…)` must
    // keep resolving even when a plain variable later takes the same name. Mirrors the
    // tree-walker's `import_aliases`. Per interpreter, so a module's imports stay private
    // to it (each module body runs in its own Interpreter — see loadModule).
    this.moduleAliases   = new Map();
    this.tui             = tuiContext;
    this.cliArgs         = [];
    this.loadingModules  = new Set();
    // Virtual filesystem backing std/io (browser has no real FS); lives for one run.
    this.vfs             = { files: new Map(), dirs: new Set() };
  }

  async loadModule(path) {
    // Intercept stdlib modules (std/math, std/random, …)
    if (path.startsWith('std/')) {
      if (this.moduleCache.has(path)) return this.moduleCache.get(path);
      if (path === 'std/db')
        throw new ZyError(`standard library module 'std/db' is not available in the web playground (requires ODBC)`);
      const modVal = buildStdlibModule(path, this.vfs);
      if (!modVal) throw new ZyError(`standard library module '${path}' not found`);
      this.moduleCache.set(path, modVal);
      return modVal;
    }

    if (!this.moduleResolver)
      throw new ZyError(`Cannot import '${path}': no module resolver available`);

    const result = await this.moduleResolver(path);
    if (result == null || result.notFound) {
      const displayPath = result?.path ?? path;
      throw new ZyError(`module not found: ${displayPath}`);
    }
    // Use resolved absolute path as canonical key so circular-import detection
    // works even when the same file is imported via different relative paths.
    const cacheKey = (typeof result === 'object' && result.resolvedPath) ? result.resolvedPath : path;

    if (this.moduleCache.has(cacheKey)) return this.moduleCache.get(cacheKey);
    if (this.loadingModules.has(cacheKey)) {
      const modName = cacheKey.replace(/^.*\//, '').replace(/\.zy$/, '');
      throw new ZyStaticError(`E004: Circular import detected: module '${modName}' is already being loaded`);
    }
    this.loadingModules.add(cacheKey);
    const src      = typeof result === 'string' ? result : result.src;
    const childRes = typeof result === 'string' ? this.moduleResolver : result.resolver;

    const tokens = new Lexer(src).tokenize();
    const ast    = new Parser(tokens).parse();

    // A module loaded at run time passes the same analysis as the entry file
    // (MM-4, settled for the Rust engines in v0.0.8). Without this, a module
    // whose function reassigns its own `:=` constant simply ran, with the entry
    // file and the module holding different ideas of the constant's value.
    {
      const modDiags = new Checker(ast).check().filter(d => d.severity === 'error');
      if (modDiags.length) {
        const where = (typeof result === 'object' && result.displayPath) || cacheKey;
        const detail = modDiags
          .map(d => `  ${where}:${d.line ?? 0}:${d.col ?? 0}: ${d.message}` +
                    (d.help ? `\n    help: ${d.help}` : ''))
          .join('\n');
        throw new ZyStaticError(
          `failed to parse module: ${modDiags.length} semantic error(s) in '${where}'\n${detail}`);
      }
    }

    const modInterp = new Interpreter(this.outputFn, this.inputFn, childRes);
    modInterp.moduleCache    = this.moduleCache;
    modInterp.loadingModules = this.loadingModules;
    modInterp.vfs            = this.vfs; // share one virtual filesystem per run

    const modEnv = new Env(null, false, true); // isModuleScope=true
    modInterp.globalEnv = modEnv;

    // Support both old-style (bare top-level statements) and new block syntax # name { ... }
    const modBody = (ast.body.length === 1 && ast.body[0].type === 'ModuleBlock')
      ? ast.body[0].body
      : ast.body;

    // Collect exported names from ExportDecl nodes before execution
    const exportPairs = [];
    for (const s of modBody) {
      if (s.type === 'ExportDecl') for (const p of s.names) exportPairs.push(p);
    }

    await modInterp.execBlock(modBody, modEnv);

    // Bind all module-level functions to modEnv so intra-module calls work
    for (const val of modEnv.vars.values()) {
      if (val.type === 'func' && !val.closureEnv) val.closureEnv = modEnv;
    }

    // Build module value with only exported names
    const exports = new Map();
    for (const p of exportPairs) {
      if (p.kind === 'reexport') {
        // alias::member or alias.member re-export
        const aliasVal = modEnv.vars.get(p.alias);
        if (aliasVal && aliasVal.type === 'module' && aliasVal.exports.has(p.member)) {
          exports.set(p.exported, aliasVal.exports.get(p.member));
        }
      } else {
        // own export (with optional rename)
        if (modEnv.vars.has(p.internal)) exports.set(p.exported, modEnv.vars.get(p.internal));
      }
    }

    this.loadingModules.delete(cacheKey);
    const modVal = { type: 'module', exports };
    this.moduleCache.set(cacheKey, modVal);
    return modVal;
  }

  tick() {
    if (this.tui?.aborted) throw new ZyError('Program stopped.');
    if (++this.steps > this.maxSteps)
      throw new ZyError(`Execution limit reached (${grouped(this.maxSteps)} steps) — infinite loop?`);
  }

  maybeYield() {
    const now = performance.now();
    if (now - this.lastYield > 16) {
      this.lastYield = now;
      return new Promise(r => setTimeout(r, 0));
    }
  }

  emit(text) {
    this.outputBytes += text.length;
    if (this.outputBytes > this.maxBytes)
      throw new ZyError(`Output limit reached (${grouped(Math.round(this.maxBytes / 1000))} KB) — infinite loop?`);
    if (this.tui && this.tui.active) this.tui.print(text);
    else this.outputFn(text);
  }

  async run(program, filePath = null) {
    const env = new Env();
    this.globalEnv = env;
    if (program.body.length >= 1 && program.body[0].type === 'ModuleBlock') {
      const mb = program.body[0];
      const modName = mb.name; // preserve as declared (e.g. '.module' or 'matematicas')
      const pathStr = filePath ? `'${filePath}'` : `'${modName}.zy'`;
      // Use filename stem for import hint (matches CLI for mismatched names)
      const importHint = filePath
        ? filePath.replace(/^.*[/\\]/, '').replace(/\.zy$/, '')
        : modName.replace(/^\./, '');
      // Refusing to run is a failure, not output: the CLI writes this to stderr
      // and exits 1. Recorded rather than emitted so `runZymbol` can route it to
      // the error channel and report the failure to a caller that is a process.
      this.moduleRefused =
        `warning: ${pathStr} is a module file and cannot be run directly\n` +
        `  = help: module '${modName}' is meant to be imported with <# ./${importHint} => alias`;
      return;
    }
    // Hoisting: a function declared anywhere at the top level is callable from
    // anywhere at the top level, including above its own declaration.
    //
    // Architecture used to decide this instead of anybody choosing: the register
    // VM compiles the whole file before running it, so it registers every name
    // first, while this engine and the Rust tree-walker bound each name as its
    // statement executed. `>> f(2) ¶` above `f(x) { <~ x * 10 }` printed 20 under
    // `--vm` and was "undefined" in the other two — the same program, two answers
    // (DM-03). The static checker had already taken the hoisting side, so
    // `zymbol check` passed a program only one of the three engines would run.
    //
    // Top level only, matching the VM. A function declared inside a block still
    // appears when the block runs.
    for (const stmt of program.body) {
      if (stmt.type === 'FuncDecl')
        env.def(stmt.name, { type: 'func', name: stmt.name, params: stmt.params, body: stmt.body, fnId: nextFnId() });
    }
    // GAP-ZYB-006: a `<~` that reaches the top level ends the program, and its
    // value is the exit status. This engine already stopped here — the value
    // was simply dropped. There is no exit status in a browser, but there is
    // one in `tests/run_one.mjs`, which presents this engine to a shell as one
    // more command-line engine; a runner that always reports 0 is a runner that
    // lies about the contract it documents.
    const signal = await this.execBlock(program.body, env);
    if (signal instanceof ZyReturn) {
      const v = signal.value;
      this.exitCode = v?.type === 'int' ? v.v : (v?.type === 'unit' ? 0 : 1);
    }
  }

  async execBlock(stmts, env) {
    for (let i = 0; i < stmts.length; i++) {
      const stmt = stmts[i];
      // Prefix hot-def sentinel: ExprStmt{Ident{hot:true, name:''}} followed by the actual op.
      // Pre-initialize the target variable in the enclosing function/root scope.
      if (stmt.type === 'ExprStmt' &&
          stmt.expr?.type === 'Ident' && stmt.expr.hot && stmt.expr.name === '') {
        const next = stmts[i + 1];
        const targetName = this._hotTargetName(next);
        if (targetName) {
          let exists = false;
          try { env.get(targetName); exists = true; } catch (_) {}
          if (!exists) env.hotDef(targetName, this._hotNeutralForStmt(next));
        }
        continue;
      }
      const sig = await this.exec(stmt, env);
      if (sig instanceof ZyReturn || sig instanceof ZyBreak || sig instanceof ZyContinue)
        return sig;
    }
  }

  async exec(stmt, env) {
    this.tick();

    switch (stmt.type) {
      case 'Noop': return;
      case 'ExportDecl': return;
      case 'ModuleBlock': return;

      case 'Import': {
        const modVal = await this.loadModule(stmt.path);
        if (!env.set(stmt.alias, modVal)) env.def(stmt.alias, modVal);
        // Also record the alias in a namespace variables cannot reach. The tree-walker
        // keeps import aliases in their own table (`import_aliases`), so `alias::fn(…)`
        // still resolves after an ordinary variable takes the same name — which real
        // programs do: zyKlingonGalaxy imports `Duj` as `duj` and then uses `duj` for the
        // player's ship, calling `duj = duj::bIj(duj, …)` on every left/right move.
        this.moduleAliases.set(stmt.alias, modVal);
        return;
      }

      case 'SetNumeralMode': {
        this.numeralMode = stmt.base;
        return;
      }

      case 'Output': {
        for (const item of stmt.items) this.emit(this.displayOutput(await this.eval(item, env)));
        if (stmt.newline) this.emit('\n');
        return;
      }

      case 'Input': {
        // Build the prompt text once; it is re-printed on every (re-)prompt.
        const promptText = stmt.prompt ? this.display(await this.eval(stmt.prompt, env)) : null;
        const cast = stmt.cast ?? { kind: 'string' };
        while (true) {
          if (promptText !== null) this.emit(promptText);
          const line = await this.inputFn();
          // EOF contract: inputFn returns null/undefined when no more input is
          // available — no constraint can be satisfied, abort instead of looping.
          if (line == null) throw new ZyError(`end of input while waiting for ${describeInputCast(cast)}`);
          const val = validateInput(String(line).trim(), cast);
          if (val !== null) {
            if (!env.set(stmt.varName, val)) env.def(stmt.varName, val);
            return;
          }
          // Re-prompt: show what was expected, then loop and ask again.
          this.emit(`  (${describeInputCast(cast)})\n`);
        }
      }

      case 'VarAssign': {
        const val = await this.eval(stmt.value, env);
        if (!env.set(stmt.name, val)) {
          if (stmt.hot) env.hotDef(stmt.name, val);
          else env.def(stmt.name, val);
        }
        return;
      }

      case 'ConstAssign': {
        const val = await this.eval(stmt.value, env);
        env.def(stmt.name, val, true);
        return;
      }

      case 'CompoundAssign': {
        let cur;
        try { cur = env.get(stmt.name); }
        catch (e) {
          if (!stmt.hot) throw e;
          cur = (stmt.op === '*' || stmt.op === '/') ? mkInt(1) : mkInt(0);
          env.hotDef(stmt.name, cur);
        }
        const rhs = await this.eval(stmt.value, env);
        env.set(stmt.name, this.applyOp(stmt.op, cur, rhs));
        return;
      }

      case 'Increment': {
        let cur;
        try { cur = env.get(stmt.name); }
        catch (e) {
          if (!stmt.hot) throw e;
          cur = mkInt(0);
          env.hotDef(stmt.name, cur);
        }
        const one = cur.type === 'float' ? mkFloat(1) : mkInt(1);
        env.set(stmt.name, this.applyOp(stmt.op === '++' ? '+' : '-', cur, one));
        return;
      }

      case 'FuncDecl': {
        env.def(stmt.name, { type: 'func', name: stmt.name, params: stmt.params, body: stmt.body, fnId: nextFnId() });
        return;
      }

      case 'Return': {
        const val = stmt.value ? await this.eval(stmt.value, env) : mkUnit();
        return new ZyReturn(val);
      }

      case 'Break':    return new ZyBreak(stmt.label ?? null);
      case 'Continue': return new ZyContinue(stmt.label ?? null);

      case 'CliArgs':
        env.def(stmt.variable, { type: 'arr', v: this.cliArgs.map(s => mkStr(s)) });
        return;

      case 'Sleep': {
        const ms = (await this.eval(stmt.duration, env)).v;
        await new Promise(r => {
          const id = setTimeout(r, Math.max(0, Math.trunc(ms)));
          if (this.tui) this.tui._sleepCancel = () => { clearTimeout(id); r(); };
        });
        if (this.tui) this.tui._sleepCancel = null;
        return;
      }

      case 'ClearScreen':
        if (this.tui) this.tui.clear();
        return;

      case 'KeyInput': {
        const ch = stmt.blocking
          ? await (this.tui ? this.tui.readKey() : Promise.resolve('\0'))
          : (this.tui ? this.tui.pollKey() : '\0');
        const cur = { type: 'char', v: ch };
        if (!env.set(stmt.variable, cur)) env.def(stmt.variable, cur);
        return;
      }

      case 'OutputPos': {
        const { slots, items } = stmt;
        let row = null, col = null, bks = 0, fg = null, bg = null;
        if (slots.length === 1 && slots[0]?.type === 'Ident') {
          const tv = await this.eval(slots[0], env);
          const get = i => tv.v?.[i]?.v ?? null;
          row = get(0); col = get(1); bks = get(2) ?? 0; fg = get(3); bg = get(4);
        } else {
          const vals = [];
          for (const s of slots) vals.push(s ? await this.eval(s, env) : null);
          if (vals[0] != null) row = vals[0].v;
          if (vals[1] != null) col = vals[1].v;
          if (vals[2] != null) bks = vals[2].v;
          if (vals[3] != null) fg = vals[3].v;
          if (vals[4] != null) bg = vals[4].v;
        }
        const parts = [];
        for (const i of items) parts.push(await this.eval(i, env));
        const text = parts.map(v => this.displayOutput(v)).join('');
        if (this.tui) this.tui.printAt(row, col, text, bks, fg, bg);
        else this.emit(text);
        return;
      }

      case 'TuiBlock': {
        if (!this.tui) return await this.execBlock(stmt.body, new Env(env));
        // A TUI program is interactive and legitimately long-running, so the block is
        // exempt from the execution limits. Raising the ceilings is not enough: `steps`
        // and `outputBytes` are monotonic counters for the whole program, so work done
        // under the exemption used to stay on the tab and blow the restored limit on the
        // very next statement outside the block, however trivial. Snapshot the counters
        // too and put them back, so the exemption means what it says — the block's work
        // does not count against the budget outside it. Restoring rather than zeroing
        // keeps whatever was spent *before* the block on the tab, and nests correctly.
        const savedMax   = this.maxSteps;
        const savedByte  = this.maxBytes;
        const savedIter  = this.maxInfiniteIter;
        const savedSteps = this.steps;
        const savedOut   = this.outputBytes;
        this.maxSteps        = Infinity;
        this.maxBytes        = Infinity;
        this.maxInfiniteIter = Infinity;
        this.tui.enter();
        try {
          await this.execBlock(stmt.body, new Env(env));
        } finally {
          this.tui.leave();
          this.maxSteps        = savedMax;
          this.maxBytes        = savedByte;
          this.maxInfiniteIter = savedIter;
          this.steps           = savedSteps;
          this.outputBytes     = savedOut;
        }
        return;
      }

      case 'If': {
        if (this.truthy(await this.eval(stmt.cond, env))) return await this.execBlock(stmt.then, new Env(env));
        for (const ei of stmt.elseifs)
          if (this.truthy(await this.eval(ei.cond, env))) return await this.execBlock(ei.body, new Env(env));
        if (stmt.else) return await this.execBlock(stmt.else, new Env(env));
        return;
      }

      case 'Loop': return await this.execLoop(stmt, env);

      // Decision 12: the edit modifies its receiver. Evaluating the expression
      // already produces the edited collection — the operators are pure — so the
      // whole of "modify in place" is storing the result back under the same
      // name, which is exactly what assignment by value makes indistinguishable
      // from mutation (DI-04).
      case 'InPlaceEdit': {
        // A positional tuple does not change, whatever the operator.
        // Immutability is a property of the value, not of the operator, so this
        // is one check rather than an exception inside each of `$+`, `$-`, `$^`…
        let recv = null;
        try { recv = env.get(stmt.name); } catch { /* undefined: let eval report it */ }
        if (recv?.type === 'tuple' && !isDict(recv))
          throw new ZyError(
            `cannot modify tuple '${stmt.name}': tuples are immutable\n` +
            `help: use 'new = ${stmt.name}[i]$~ value' for a functional update`,
            stmt.line);
        const edited = await this.eval(stmt.expr, env);
        if (!env.set(stmt.name, edited)) env.def(stmt.name, edited);
        return;
      }

      case 'ExprStmt': {
        // A bare match statement (?? x { arm => { <~ v } }, no assignment) must
        // propagate its arm's control-flow signal (<~, @!, @>) the same way an
        // `if` block already does — going through eval() here would discard it,
        // since eval() only ever returns plain Values.
        if (stmt.expr.type === 'Match') {
          const arm = await this.selectMatchArm(stmt.expr, env);
          if (!arm) return;
          if (arm.body.type === 'block') return await this.execBlock(arm.body.stmts, new Env(env));
          await this.eval(arm.body.value, env);
          return;
        }
        await this.eval(stmt.expr, env);
        return;
      }

      case 'IndexAssign': {
        const col = env.get(stmt.obj);
        const i   = (await this.eval(stmt.index, env)).v;
        if (i === 0) throw new ZyRuntimeError('Index 0 is invalid (indices start at 1)', '##Index');
        const val = await this.eval(stmt.value, env);
        const idx = i < 0 ? col.v.length + i : i - 1;
        let updated;
        if (col.type === 'arr') {
          const r = [...col.v]; r[idx] = val; updated = mkArr(r);
        } else if (col.type === 'tuple') {
          throw new ZyError(
            `cannot modify tuple '${stmt.obj}': tuples are immutable\n` +
            `help: use 'new_var = ${stmt.obj}[${i}]$~ value' for a functional update`
          );
        } else {
          throw new ZyError(`'${stmt.obj}' is not an array`);
        }
        if (!env.set(stmt.obj, updated)) env.def(stmt.obj, updated);
        return;
      }

      case 'ArrayDestruct': {
        const arr = await this.eval(stmt.value, env);
        if (arr.type !== 'arr')
          throw new ZyError(`array pattern '[ … ]' requires an array, got ${this.destructTypeName(arr)}`);
        this.bindPositional(stmt.targets, arr.v, false, env);
        return;
      }

      case 'TupleDestruct': {
        const tup = await this.eval(stmt.value, env);
        if (tup.type !== 'tuple' || tup.keys)
          throw new ZyError(`tuple pattern '( … )' requires a tuple, got ${this.destructTypeName(tup)}`);
        this.bindPositional(stmt.targets, tup.v, true, env);
        return;
      }

      case 'NamedDestruct': {
        const tup = await this.eval(stmt.value, env);
        if (tup.type !== 'tuple' || !tup.keys)
          throw new ZyError('Named destructuring requires a named tuple');
        for (const { field, name } of stmt.targets) {
          const i = tup.keys.indexOf(field);
          if (i < 0) throw new ZyError(`Unknown field '${field}'`);
          const val = tup.v[i];
          if (!env.set(name, val)) env.def(name, val);
        }
        return;
      }

      case 'TryCatch': {
        let result;
        try {
          result = await this.execBlock(stmt.tryBody, new Env(env));
        } catch (err) {
          if (err instanceof ZyErrorPropagate) throw err; // $!! propagates through try/catch
          const errType = err.errType ?? '##_';
          const matched = stmt.catches.find(
            c => !c.errType || c.errType === errType || c.errType === '##_'
          );
          if (matched) {
            const catchEnv = new Env(env);
            const errMsg = err.message ?? String(err);
            catchEnv.def('_err', { type: 'error', errType, v: errMsg });
            result = await this.execBlock(matched.body, catchEnv);
          } else {
            throw err;
          }
        } finally {
          if (stmt.finallyBody) await this.execBlock(stmt.finallyBody, new Env(env));
        }
        return result;
      }

      case 'LifetimeEnd': {
        env.destroy(stmt.name);
        return;
      }
    }
  }


  // What an iterator leaves behind (REFERENCE.md L24, MM-11).
  //
  // The value taken is whatever the name holds at the end of the last iteration
  // that ran — not the loop's counter — because a body that writes to the iterator
  // keeps that write (`@ w:1..3 { w = 100 }` leaves 100), while never altering the
  // iteration itself: each pass re-publishes the counter into a fresh scope.
  //
  // `env.set` returns false for a name that does not exist outside the loop, which
  // is exactly the case where the iterator stays loop-local — and every engine
  // agrees on that: reading the iterator after the loop is `undefined variable`
  // in all three, refused by static analysis before anything runs.
  //
  // `DM-20` claimed the two Rust engines left it alive (`zytw 3 · zyvm 3`). It is
  // not reproducible: measured against `zymbol 0.0.9` on 2026-08-18, with the
  // pre-change binary, both answer `error: undefined variable 'i'` from
  // zymbol-semantic. The entry contradicted the *Descartadas* table of the same
  // document, which said the opposite and was right.
  publishIter(env, name, lastEnv) {
    if (!lastEnv) return;
    try { env.set(name, lastEnv.get(name)); } catch { /* iterator was destroyed */ }
  }

  async execLoop(loop, env) {
    const outer = new Env(env);
    const brk = sig => sig instanceof ZyBreak    && (sig.label === null || sig.label === loop.label);
    const cnt = sig => sig instanceof ZyContinue && (sig.label === null || sig.label === loop.label);

    if (loop.kind === 'infinite') {
      let iter = 0;
      while (true) {
        if (++iter > this.maxInfiniteIter)
          throw new ZyError(`Infinite loop limit reached (${this.maxInfiniteIter} iterations) — add @! to break`);
        this.tick();
        const sig = await this.execBlock(loop.body, new Env(outer));
        if (brk(sig)) break;
        if (cnt(sig)) continue;
        if (sig instanceof ZyReturn) return sig;
        if (sig instanceof ZyBreak) return sig;
        if (sig instanceof ZyContinue) return sig;
        await this.maybeYield();
      }
      return;
    }

    if (loop.kind === 'while') {
      const firstVal = await this.eval(loop.cond, env);
      if (firstVal.type === 'int') {
        // Times loop: repeat N times
        const n = firstVal.v;
        for (let i = 0; i < n; i++) {
          this.tick();
          const sig = await this.execBlock(loop.body, new Env(outer));
          if (brk(sig)) break;
          if (sig instanceof ZyReturn) return sig;
          if (sig instanceof ZyBreak || sig instanceof ZyContinue) return sig;
          await this.maybeYield();
        }
      } else {
        // While loop: re-evaluate condition each iteration. A specifier that is
        // neither a count nor a condition is refused rather than read through
        // truthiness — every engine used to invent a different answer for an
        // array or a float here.
        let cond = loopCond(firstVal);
        while (cond) {
          this.tick();
          const sig = await this.execBlock(loop.body, new Env(outer));
          if (brk(sig)) break;
          if (cnt(sig)) { cond = loopCond(await this.eval(loop.cond, env)); continue; }
          if (sig instanceof ZyReturn) return sig;
          if (sig instanceof ZyBreak) return sig;
          if (sig instanceof ZyContinue) return sig;
          await this.maybeYield();
          cond = loopCond(await this.eval(loop.cond, env));
        }
      }
      return;
    }

    if (loop.kind === 'range') {
      const from = (await this.eval(loop.from, env)).v;
      const to   = (await this.eval(loop.to,   env)).v;
      let step = loop.step ? (await this.eval(loop.step, env)).v : (from <= to ? 1 : -1);
      if (loop.step && from > to && step > 0) step = -step;
      if (loop.step && from < to && step < 0) step = -step;
      if (step === 0) throw new ZyError('Loop step cannot be zero');
      // The iterator does not shadow a name that already exists outside: the loop
      // writes to it, and it keeps the last value assigned — including when the
      // loop ends early through `@!` (REFERENCE.md L24, settled for the Rust
      // engines in v0.0.8). `env.set` reports false for a name that does not
      // exist, which is exactly the case where the iterator stays loop-local.
      let lastEnv = null;
      for (let i = from; step > 0 ? i <= to : i >= to; i += step) {
        this.tick();
        const iter = new Env(outer);
        iter.def(loop.var, mkInt(i));
        lastEnv = iter;
        const sig = await this.execBlock(loop.body, iter);
        if (brk(sig)) break;
        if (cnt(sig)) continue;
        if (sig instanceof ZyReturn) { this.publishIter(env, loop.var, lastEnv); return sig; }
        if (sig instanceof ZyBreak || sig instanceof ZyContinue) { this.publishIter(env, loop.var, lastEnv); return sig; }
        await this.maybeYield();
      }
      this.publishIter(env, loop.var, lastEnv);
      return;
    }

    if (loop.kind === 'foreach') {
      const it = await this.eval(loop.iterable, env);
      let items;
      if      (it.type === 'arr')   items = it.v;
      else if (it.type === 'str')   items = [...it.v].map(mkChar);
      // The pattern form asks for both halves, so a dictionary is handed over as
      // `(clave, valor)` pairs. `@ k:d` still yields keys (decision 8).
      else if (loop.pairs && isDict(it))
        items = it.keys.map((k, i) => ({ type:'tuple', v:[mkStr(k), it.v[i]], keys:null }));
      // A DICTIONARY yields its KEYS, in insertion order — `for k in d` as
      // Python spells it (decision 8). It used to yield the VALUES here, while
      // the tree-walker refused to walk one at all: three engines, two answers,
      // and neither was the decided one. With `d[k]` available the key is enough
      // to reach the value, so no destructuring pattern has to enter `@`.
      //
      // A positional tuple still yields its elements (decision 21).
      else if (isDict(it))
        items = it.keys.map(k => mkStr(k));
      else if (it.type === 'tuple') items = it.v;
      else throw new ZyError(`Cannot iterate over ${it.type}`);

      // Same rule as the range loop above: a pre-existing name keeps the last
      // element the loop bound to it.
      let lastEnv = null;
      for (const item of items) {
        this.tick();
        const iter = new Env(outer);
        iter.def(loop.var, item);
        lastEnv = iter;
        const sig = await this.execBlock(loop.body, iter);
        if (brk(sig)) break;
        if (cnt(sig)) continue;
        if (sig instanceof ZyReturn) { this.publishIter(env, loop.var, lastEnv); return sig; }
        if (sig instanceof ZyBreak || sig instanceof ZyContinue) { this.publishIter(env, loop.var, lastEnv); return sig; }
        await this.maybeYield();
      }
      this.publishIter(env, loop.var, lastEnv);
      return;
    }
  }

  async eval(expr, env) {
    this.tick();

    switch (expr.type) {
      case 'Literal':
        switch (expr.kind) {
          case 'int':   return mkInt(expr.value);
          case 'float': return mkFloat(expr.value);
          case 'bool':  return mkBool(expr.value);
          case 'char':  return mkChar(expr.value);
          case 'str':   return await this.evalStr(expr.value, env);
          case 'unit':  return mkUnit();
        }
        break;

      case 'Ident': {
        if (expr.hot) {
          try { return env.get(expr.name); }
          catch (_) { const n = mkInt(0); env.hotDef(expr.name, n); return n; }
        }
        const v = env.get(expr.name);
        // A named function read AS A VALUE captures what its body reads from
        // the scope it is being taken in, exactly as a lambda does and exactly
        // as `func_def_to_value` does in the tree-walker. A direct call does
        // not come through here — `case 'Call'` reads `env.get(expr.callee)` —
        // so calling stays isolated, which is the asymmetry the two Rust
        // engines have and this one did not.
        //
        // The copy keeps `fnId`, so `f = adder` is still the same function as
        // `adder` when compared.
        if (v?.type === 'func' && !v.native && !v.captures) {
          return { ...v, captures: captureFor(v.params ?? [], v.body, env) };
        }
        return v;
      }

      case 'TerminalSize': {
        if (!this.tui) return { type: 'tuple', v: [mkInt(24), mkInt(80)], keys: null };
        const [rows, cols] = this.tui.getSize();
        return { type: 'tuple', v: [mkInt(rows), mkInt(cols)], keys: null };
      }

      case 'BashExec': {
        const _cmd = (expr.cmd ?? '').replace(/['"]/g, ' ').trim();
        const _now = new Date();
        const _pad = n => String(n).padStart(2, '0');
        if (_cmd.includes('%Y')) return mkStr(String(_now.getFullYear()));
        if (_cmd.includes('%m')) return mkStr(_pad(_now.getMonth() + 1));
        if (_cmd.includes('%d')) return mkStr(_pad(_now.getDate()));
        if (_cmd.includes('%H')) return mkStr(_pad(_now.getHours()));
        if (_cmd.includes('%M')) return mkStr(_pad(_now.getMinutes()));
        if (_cmd.includes('%S')) return mkStr(_pad(_now.getSeconds()));
        if (_cmd.includes('%s')) return mkStr(String(Math.floor(Date.now() / 1000)));
        if (_cmd.startsWith('echo ') && !_cmd.includes('$')) return mkStr(_cmd.slice(5).trim().replace(/^['"]|['"]$/g, ''));
        // Default: nanosecond-ish timestamp for random seeds
        return mkStr(String(Date.now() * 1000000 + Math.trunc(Math.random() * 999999)));
      }

      case 'Array':
        return mkArr(await Promise.all(expr.items.map(i => this.eval(i, env))));

      case 'Tuple': {
        const items = await Promise.all(expr.items.map(i => this.eval(i, env)));
        return { type: 'tuple', v: items, keys: expr.keys ?? null };
      }

      case 'ImplicitConcat': {
        const items = expr.items ?? [];
        // Prefix hot-def sentinel in RHS: [Ident{hot:true, name:''}, <inner_expr>]
        if (items.length >= 2 &&
            items[0]?.type === 'Ident' && items[0]?.hot && items[0]?.name === '') {
          const inner = items[1];
          const hotName = this._leftmostIdentName(inner);
          if (hotName) {
            let exists = false;
            try { env.get(hotName); exists = true; } catch (_) {}
            if (!exists) env.hotDef(hotName, this._hotNeutralForExpr(inner));
          }
          return await this.eval(inner, env);
        }
        const vals = [];
        for (const item of items) vals.push(await this.eval(item, env));
        // displayOutput: implicit concatenation is display text -> numeral mode applies.
        return mkStr(vals.map(v => this.displayOutput(v)).join(''));
      }
      case 'CommaJoin': {
        const vals = await Promise.all(expr.items.map(i => this.eval(i, env)));
        return mkStr(vals.map(v => this.displayOutput(v)).join(''));
      }

      case 'BinOp': {
        if (expr.op === '&&') {
          return mkBool(this.truthy(await this.eval(expr.left, env)) &&
                        this.truthy(await this.eval(expr.right, env)));
        }
        if (expr.op === '||') {
          return mkBool(this.truthy(await this.eval(expr.left, env)) ||
                        this.truthy(await this.eval(expr.right, env)));
        }
        return this.applyOp(expr.op, await this.eval(expr.left, env), await this.eval(expr.right, env));
      }

      case 'UnaryOp': {
        const val = await this.eval(expr.operand, env);
        if (expr.op === '-')
          return val.type === 'float' ? mkFloat(-val.v) : mkInt(-val.v);
        if (expr.op === '!')
          return mkBool(!this.truthy(val));
        break;
      }

      case 'Call': {
        const fn = env.get(expr.callee);
        if (!fn || fn.type !== 'func')
          throw new ZyError(`'${expr.callee}' is not a function`);
        const args = await Promise.all(expr.args.map(a => this.eval(a, env)));
        return await this.callFunc(fn, args, this.buildOutWriteback(fn, expr, env));
      }

      case 'CallExpr': {
        const fn = await this.eval(expr.callee, env);
        if (!fn || fn.type !== 'func')
          throw new ZyError(`Expression is not a function`);
        const args = await Promise.all(expr.args.map(a => this.eval(a, env)));
        // Output parameters must be written back here too, not just in 'Call'. A module
        // call `alias::f(x)` parses as Ident(alias) → FieldAccess → CallExpr (the callee
        // is not a bare Ident), so every cross-module call landed in this branch and
        // silently dropped its `<~` out-params: the callee mutated its local copy and the
        // caller's variable never changed. That is what made GO unplayable in the browser —
        // 盤::着手(局面<~, …, 取数<~, コウ点<~) placed a stone and counted captures into
        // parameters the caller never saw, so the board stayed empty forever.
        return await this.callFunc(fn, args, this.buildOutWriteback(fn, expr, env));
      }

      case 'NavIndex': {
        const obj  = await this.eval(expr.obj, env);
        const spec = expr.spec;

        if (spec.kind === 'simple') {
          const iVal = await this.eval(spec.index, env);
          // A dictionary is addressed by KEY, and the key may be computed —
          // `d[clave]`, not just `d.nombre`. Without this the named tuple was a
          // record, not a dictionary: readable only when the program already
          // knew what it held (decision 7, DM-09). This engine used to answer an
          // empty line here, which was the worst of the three.
          //
          // The dot only reaches keys that are identifiers; the bracket reaches
          // any key, which is what JSON needs — `d["mi clave"]` cannot be
          // written any other way.
          if (iVal.type === 'str' && obj.type === 'tuple' && obj.keys) {
            const ki = obj.keys.indexOf(iVal.v);
            if (ki < 0)
              throw new ZyRuntimeError(
                Interpreter.missingKeyMsg(iVal.v, obj.keys), '##Key');
            return obj.v[ki];
          }
          // Decision 11: a dictionary is addressed by KEY, never by position.
          // In a mutable dictionary a positional index is fragile — adding a key
          // changes what sits at each position, and a program that depended on
          // `d[2]` stops being correct with nothing to say so. The POSITIONAL
          // tuple keeps `t[1]` in full: there the index is the only address
          // there is, and the size is fixed.
          if (iVal.type === 'int' && isDict(obj)) {
            const first = obj.keys.find(k => k) ?? 'clave';
            throw new ZyError(
              `a dictionary is addressed by key, not by position\n` +
              `help: use d["${first}"] — adding a key changes what sits at each position`);
          }
          return this.navGetAt(obj, iVal.v);
        }

        if (spec.kind === 'path') {
          // Single nav path — may return scalar or flat array if path has ranges
          const resolvedSteps = await this.resolveNavSteps(spec.path, env);
          return await this.evalNavPath(obj, resolvedSteps);
        }

        if (spec.kind === 'flat') {
          // Multiple nav paths — flat array result
          const results = [];
          for (const path of spec.paths) {
            const resolvedSteps = await this.resolveNavSteps(path, env);
            const val = await this.evalNavPath(obj, resolvedSteps);
            if (val.type === 'arr') results.push(...val.v);
            else results.push(val);
          }
          return mkArr(results);
        }

        if (spec.kind === 'structured') {
          if (spec.groups.length === 1) {
            // Single structured group → flat array of that group's values
            const group = spec.groups[0];
            const results = [];
            for (const path of group.paths) {
              const resolvedSteps = await this.resolveNavSteps(path, env);
              const val = await this.evalNavPath(obj, resolvedSteps);
              if (val.type === 'arr') results.push(...val.v);
              else results.push(val);
            }
            return mkArr(results);
          }
          // Multiple groups → array of arrays
          const groups = [];
          for (const group of spec.groups) {
            const results = [];
            for (const path of group.paths) {
              const resolvedSteps = await this.resolveNavSteps(path, env);
              const val = await this.evalNavPath(obj, resolvedSteps);
              if (val.type === 'arr') results.push(...val.v);
              else results.push(val);
            }
            groups.push(mkArr(results));
          }
          return mkArr(groups);
        }

        throw new ZyError(`Unknown nav spec kind: ${spec.kind}`);
      }

      case 'JuxtaConcat': {
        // displayOutput, not display: an active numeral mode has to reach every
        // path that turns a number into text, not just `>>`. A number folded
        // into a composed string used to revert to ASCII under #d0d9#.
        const parts = [];
        for (const it of expr.items) parts.push(this.displayOutput(await this.eval(it, env)));
        return mkStr(parts.join(''));
      }

      case 'Lambda': {
        const params = expr.params.map(p => ({ name: p }));
        const body = expr.body.type === 'block'
          ? expr.body.stmts
          : [{ type: 'Return', value: expr.body.value }];
        return {
          type: 'func', name: '<lambda>', params, body, fnId: nextFnId(),
          // A SNAPSHOT of what the body reads from outside, not the scope
          // itself. `closureEnv: env` held a live reference, so the lambda read
          // whatever the variable held later and wrote back out through it —
          // neither of which the Rust engines do.
          captures: captureFor(params, body, env),
        };
      }

      case 'Pipe': {
        const val = await this.eval(expr.value, env);
        const pipeEnv = new Env(env);
        pipeEnv.def('_', val);
        const result = await this.eval(expr.rhs, pipeEnv);
        if (result && result.type === 'func') return await this.callFunc(result, [val]);
        return result;
      }

      case 'FieldAccess': {
        // `alias::name` addresses the module namespace and nothing else, so resolve it
        // from the alias table rather than by evaluating `alias` as an expression. Without
        // this, an ordinary variable that happens to share an alias's name shadowed the
        // module and the call failed with a "requires a named tuple" error pointing at the
        // wrong thing entirely. `.` keeps evaluating its object normally (it must: most
        // uses are `tuple.field`) and only consults the alias table as a fallback, which is
        // what makes `alias.CONST` survive the same shadowing.
        const aliasName = expr.obj?.type === 'Ident' ? expr.obj.name : null;
        const aliasMod  = aliasName ? this.moduleAliases.get(aliasName) : undefined;

        const obj = expr.scoped && aliasMod ? aliasMod : await this.eval(expr.obj, env);
        if (obj.type === 'module') {
          if (!obj.exports.has(expr.field)) {
            const modAlias = aliasName ?? 'module';
            throw new ZyError(`module '${modAlias}' does not export function '${expr.field}'`);
          }
          return obj.exports.get(expr.field);
        }
        if (aliasMod && aliasMod.exports.has(expr.field)) return aliasMod.exports.get(expr.field);
        if (obj.type !== 'tuple' || !obj.keys)
          throw new ZyError(`'${expr.scoped ? '::' : '.'}${expr.field}' requires a named tuple`);
        const i = obj.keys.indexOf(expr.field);
        // ##Key, not ##_: an absent key is its own kind whichever way the
        // reader arrived — through the dot or through the bracket (decision 10).
        if (i < 0) throw new ZyRuntimeError(
          Interpreter.missingKeyMsg(expr.field, obj.keys),
          '##Key'
        );
        return obj.v[i];
      }

      case 'CollectionOp':
        return await this.evalCollectionOp(expr, env);

      case 'FuncUpdate': {
        const arr  = await this.eval(expr.obj, env);
        // `d.k$~ v` carries its key directly; `d[e]$~ v` evaluates one.
        const iVal = expr.key !== undefined ? mkStr(expr.key) : await this.eval(expr.index, env);
        const val  = await this.eval(expr.value, env);

        // String field name — named tuple only (G2)
        if (iVal.type === 'str') {
          if (arr.type !== 'tuple' || !arr.keys)
            throw new ZyError(`$~ string index requires a named tuple`);
          const fi = arr.keys.indexOf(iVal.v);
          // A key that is not there gets ADDED, as `d[k] = v` does in Python.
          // The array refuses the same move (decision 13) and the two are not
          // inconsistent: an array is addressed by POSITION, so writing past the
          // end leaves a hole — JavaScript's own `<3 empty items>` is what that
          // looks like — while a dictionary is addressed by KEY and has none to
          // leave. Without it, a JSON built piece by piece could not be built.
          if (fi < 0) {
            return { type: 'tuple', v: [...arr.v, val], keys: [...arr.keys, iVal.v] };
          }
          const r = [...arr.v]; r[fi] = val;
          return { type: 'tuple', v: r, keys: arr.keys };
        }

        // A positional WRITE corrupts data rather than returning the wrong
        // value: strictly worse than the positional read decision 11 withdrew.
        if (isDict(arr))
          throw new ZyError(Interpreter.notPositionalMsg('d[n]$~ value', arr.keys));

        // Integer 1-based index
        const i = iVal.v;
        if (i === 0) throw new ZyRuntimeError('Index 0 is invalid (indices start at 1)', '##Index');
        const len = arr.type === 'str' ? [...arr.v].length : (arr.v?.length ?? 0);
        const idx = i < 0 ? len + i : i - 1;
        if (idx < 0 || idx >= len)
          throw new ZyError(`index out of bounds: index ${i} for collection of length ${len}`);
        if (arr.type === 'arr')   { const r = [...arr.v]; r[idx] = val; return mkArr(r); }
        if (arr.type === 'str')   { const r = [...arr.v]; r[idx] = this.display(val); return mkStr(r.join('')); }
        if (arr.type === 'tuple') { const r = [...arr.v]; r[idx] = val; return { type:'tuple', v:r, keys:arr.keys }; }
        throw new ZyError(`$~ not supported on ${arr.type}`);
      }

      case 'DeepUpdate': {
        const root = await this.eval(expr.obj, env);
        const indices = [];
        for (const atom of expr.path) {
          if (atom.kind === 'range') throw new ZyError('deep update ($~) does not support ranges in the path');
          // A dot step carries its key directly; a bracket step has an expression.
          const iv = atom.key !== undefined ? mkStr(atom.key) : await this.eval(atom.expr, env);
          // Int → position, String → dictionary key. Same rule as the read.
          if (iv.type !== 'int' && iv.type !== 'str')
            throw new ZyError(
              `a navigation step is a position (Int) or a dictionary key (String), got ${iv.type}`);
          indices.push(iv.v);
        }
        const newVal = await this.eval(expr.value, env);
        return deepUpdateValue(root, indices, newVal);
      }

      case 'TypeMetadata': {
        // The operand is evaluated like any other expression. There used to be
        // a special case here — an identifier that `env.get` could not find
        // answered `("##_", 0, Unit)` instead of throwing — mirroring one in
        // each Rust engine. All three are gone: an undefined name is refused
        // before anything runs, so the case was unreachable, and in the Rust
        // engines it reached a NAMED FUNCTION instead and called it Unit
        // (GAP-ZYB-009 § 6, D-4). This engine never had that symptom, because
        // here a named function IS in the environment.
        return this.typeMetadata(await this.eval(expr.obj, env));
      }

      case 'Match': {
        const arm = await this.selectMatchArm(expr, env);
        if (!arm) return mkUnit();
        if (arm.body.type === 'block') {
          const sig = await this.execBlock(arm.body.stmts, new Env(env));
          if (sig === undefined) return mkUnit();
          // A control-flow signal (<~, @!, @>) inside a match arm's block must
          // unwind past this expression context to its real target (the
          // enclosing function or loop) — eval() itself can only return plain
          // Values, so throw it, mirroring how $!! (ZyErrorPropagate) already
          // unwinds through eval() to callFunc's boundary.
          throw sig;
        }
        return await this.eval(arm.body.value, env);
      }

      case 'DataOp': {
        const val = await this.eval(expr.arg, env);
        // GAP-ZYB-001: resolve a computed decimal count before anything reads
        // `expr.prec`, so every branch below sees a plain number.
        if (expr.precExpr) {
          const pv = await this.eval(expr.precExpr, env);
          if (pv.type !== 'int') {
            throw new ZyError(
              `decimal count must be a whole number, got ${pv.type}`, expr.line);
          }
          if (pv.v < 0) {
            throw new ZyError(
              `decimal count must not be negative, got ${pv.v}`, expr.line);
          }
          expr = { ...expr, prec: pv.v };
        }
        // `what` names the operation for the error message the CLI raises on a
        // non-numeric string; digits in any script parse (see asciiDigits).
        const toNum = (v, what = null) => {
          if (v.type === 'int' || v.type === 'float') return v.v;
          if (v.type === 'str') {
            const n = parseFloat(asciiDigits(v.v.trim()));
            if (!isNaN(n)) return n;
            if (what) throw new ZyError(`cannot convert string '${v.v}' to number for ${what}`, expr.line);
            return 0;
          }
          return 0;
        };
        const fmtSci = (num, prec, mode) => {
          if (num === 0) return '0e0';
          const neg = num < 0;
          const abs = Math.abs(num);
          let exp = Math.floor(Math.log10(abs));
          let mant = abs / Math.pow(10, exp);
          if (prec !== null) {
            if (mode === 'round') mant = parseFloat(mant.toFixed(prec));
            else { const f = Math.pow(10, prec); mant = Math.trunc(mant * f) / f; }
            if (mant >= 10) { mant /= 10; exp += 1; }
          }
          let mantStr = parseFloat(mant.toPrecision(15)).toString().replace(/\.?0+$/, '');
          if (prec !== null && !mantStr.includes('.')) mantStr += '.0';
          return (neg ? '-' : '') + mantStr + 'e' + exp;
        };
        switch (expr.kind) {
          case 'eval': {
            // GAP-ZYB-012: a Char reads like the one-character string it is.
            // `#|"७"|` gave 7 and `#|'७'|` gave back the glyph — the same
            // operator, the same character, two answers depending on how it had
            // been written. A Char that is not a digit comes back untouched,
            // which is what "safe conversion" already meant for a string.
            if (val.type === 'char') {
              const a = asciiDigits(val.v);
              const p = parseFloat(a);
              if (!isNaN(p) && /^[0-9]+$/.test(a)) return mkInt(p);
              return val;
            }
            if (val.type === 'str') {
              const s = val.v.trim();
              // Normalize Unicode digits to ASCII before parsing
              const ascii = asciiDigits(s);
              const p = parseFloat(ascii);
              if (!isNaN(p) && /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(ascii)) {
                if (Number.isInteger(p) && !ascii.includes('.') && !ascii.toLowerCase().includes('e')) return mkInt(p);
                return mkFloat(p);
              }
            }
            return val;
          }
          case 'round':       return mkFloat(parseFloat(toNum(val, 'rounding').toFixed(expr.prec)));
          case 'trunc': {
            const n = toNum(val, 'truncation');
            const f = Math.pow(10, expr.prec);
            return mkFloat(Math.trunc(n * f) / f);
          }
          // `#,` and `#^` write their digits in the ACTIVE numeral script, as
          // `>>` and the precision operators do. They did not: the text came
          // from `toLocaleString`/`fmtSci`, which write ASCII, so under `#०९#`
          // a program printed `१२३४५६७.८९` with `>>` and `1,234,567.89` one line
          // later with `#,` — two spellings of the digits in one output, and
          // the same in all three engines, so no consensus run could see it.
          //
          // Only the digits map; the separators pass through.
          case 'comma':       return mkStr(mapNumeralNumber(toNum(val).toLocaleString('en-US'), this.numeralMode));
          case 'comma_round': {
            const n = parseFloat(toNum(val).toFixed(expr.prec));
            return mkStr(mapNumeralNumber(n.toLocaleString('en-US', { minimumFractionDigits: expr.prec, maximumFractionDigits: expr.prec }), this.numeralMode));
          }
          case 'comma_trunc': {
            const raw = toNum(val);
            const f = Math.pow(10, expr.prec);
            const n = Math.trunc(raw * f) / f;
            return mkStr(mapNumeralNumber(n.toLocaleString('en-US', { minimumFractionDigits: expr.prec, maximumFractionDigits: expr.prec }), this.numeralMode));
          }
          case 'sci':       return mkStr(mapNumeralNumber(fmtSci(toNum(val), null, null), this.numeralMode));
          case 'sci_round': return mkStr(mapNumeralNumber(fmtSci(toNum(val), expr.prec, 'round'), this.numeralMode));
          case 'sci_trunc': return mkStr(mapNumeralNumber(fmtSci(toNum(val), expr.prec, 'trunc'), this.numeralMode));
          case 'base_conv': {
            const n = val.type === 'char' ? val.v.codePointAt(0) : Math.trunc(toNum(val));
            const base = expr.prec;
            if (base === 16) return mkStr('0x' + n.toString(16).toUpperCase().padStart(4, '0'));
            if (base === 2)  return mkStr('0b' + n.toString(2));
            if (base === 8)  return mkStr('0o' + n.toString(8));
            if (base === 10) return mkStr('0d' + n.toString(10).padStart(4, '0'));
            return val;
          }
        }
        return val;
      }

      case 'CastOp': {
        const val = await this.eval(expr.operand, env);
        // ##! also accepts a Char, casting it to its Unicode code point —
        // the only direct Char→Int route (mirrors data_ops.rs CastKind::ToIntTrunc).
        if (expr.op === '##!' && val.type === 'char') return mkInt(val.v.codePointAt(0));
        if (val.type !== 'int' && val.type !== 'float') {
          const _typeNames = { str:'String', int:'Integer', float:'Float', bool:'Bool', char:'Char', arr:'Array', tuple:'Tuple', unit:'Unit' };
          const typeName = _typeNames[val.type] ?? (val.type.charAt(0).toUpperCase() + val.type.slice(1));
          const reqSuffix = expr.op === '##!' ? ' or Char' : '';
          throw new ZyRuntimeError(`${expr.op} requires a numeric value${reqSuffix}, got ${typeName}`, '##_');
        }
        if (expr.op === '##.') return mkFloat(val.v);
        // A float with no integer form in range is a ##Range error, not the
        // nearest Number: `###1.0e300` used to answer 1e300 as an "int".
        const castInt = (n, op) => {
          if (!inIntRange(n)) throw new ZyRuntimeError(`integer overflow: ${op} cannot represent this float`, '##Range');
          return mkInt(n);
        };
        if (expr.op === '###') {
          // Round half away from zero
          const n = val.v;
          return castInt(n >= 0 ? Math.floor(n + 0.5) : Math.ceil(n - 0.5), '###');
        }
        if (expr.op === '##!') return castInt(Math.trunc(val.v), '##!');
        return val;
      }
    }

    return mkUnit();
  }

  // ─── Navigation helpers ───────────────────────────────────────────────────

  // Resolve an AST nav step array to concrete { kind, val } or { kind, from, to } steps
  async resolveNavSteps(steps, env) {
    const resolved = [];
    for (const step of steps) {
      if (step.kind === 'index') {
        const v = (await this.eval(step.expr, env)).v;
        resolved.push({ kind: 'index', val: v });
      } else {
        const from = (await this.eval(step.from, env)).v;
        const to   = (await this.eval(step.to,   env)).v;
        resolved.push({ kind: 'range', from, to });
      }
    }
    return resolved;
  }

  // Evaluate a nav path against an object; returns scalar or flat array
  async evalNavPath(obj, resolvedSteps) {
    if (resolvedSteps.length === 0) return obj;
    const [step, ...rest] = resolvedSteps;

    if (step.kind === 'index') {
      const elem = this.navGetAt(obj, step.val);
      return await this.evalNavPath(elem, rest);
    }

    // Range step — fan out
    const { from, to } = step;
    const results = [];
    for (let i = from; i <= to; i++) {
      const elem = this.navGetAt(obj, i);
      const sub = await this.evalNavPath(elem, rest);
      // Flatten one level when nested ranges produce arrays
      if (rest.length > 0 && sub.type === 'arr') results.push(...sub.v);
      else results.push(sub);
    }
    return mkArr(results);
  }

  // 1-based get with error on index 0 and out-of-bounds
  navGetAt(obj, idx) {
    // A navigation step is an ordinary expression, and its VALUE says how to
    // address: a number is a position, a string is a dictionary key. Same rule
    // as `d[clave]`, one level down, which is what makes `config[k1>k2]` work
    // with `k1 = "servidor"`.
    //
    // It has to be the value and not the spelling: a bare identifier inside
    // `[…]` is a VARIABLE, which is exactly what makes a computed key possible.
    if (isDict(obj)) {
      if (typeof idx === 'string') {
        const ki = obj.keys.indexOf(idx);
        if (ki < 0) throw new ZyRuntimeError(Interpreter.missingKeyMsg(idx, obj.keys), '##Key');
        return obj.v[ki];
      }
      throw new ZyError(Interpreter.notPositionalMsg('d[n>…]', obj.keys));
    }
    if (typeof idx === 'boolean') throw new ZyRuntimeError('Cannot use Bool as array index', '##Index');
    if (idx === 0) throw new ZyRuntimeError('index 0 is invalid — Zymbol uses 1-based indexing (use 1 for the first element, -1 for the last)', '##Index');
    if (obj.type === 'arr') {
      const i = idx < 0 ? obj.v.length + idx : idx - 1;
      if (i < 0 || i >= obj.v.length) throw new ZyRuntimeError(`array index out of bounds: index ${idx} for array of length ${obj.v.length}`, '##Index');
      return obj.v[i];
    }
    if (obj.type === 'tuple') {
      const i = idx < 0 ? obj.v.length + idx : idx - 1;
      if (i < 0 || i >= obj.v.length) throw new ZyRuntimeError(`array index out of bounds: index ${idx} for array of length ${obj.v.length}`, '##Index');
      return obj.v[i] ?? mkUnit();
    }
    if (obj.type === 'str') {
      const chars = [...obj.v];
      const i = idx < 0 ? chars.length + idx : idx - 1;
      if (i < 0 || i >= chars.length) throw new ZyRuntimeError(`array index out of bounds: index ${idx} for array of length ${chars.length}`, '##Index');
      return mkChar(chars[i]);
    }
    throw new ZyError(`Cannot subscript ${obj.type}`);
  }

  // Resolve a 1-based index to JS 0-based; 0 is clamped to 0 (for slices)
  resolve1Based(n, len) {
    if (n === 0) return 0;
    return n > 0 ? n - 1 : len + n;
  }

  // Type name as the Rust engines spell it in destructuring errors. `zyq consensus`
  // compares the message text across all four engines, so this must match
  // `value_type_name` (tree-walker) and `tw_type_name` (VM) to the character.
  destructTypeName(val) {
    return typeSymbolBase(val);
  }

  // Bind an array or positional-tuple pattern — the mirror of the tree-walker's
  // `bind_positional`. The last item absorbs whatever remains (REFERENCE.md L33):
  // Unit when nothing is left, the bare value when one is, a collection of the
  // container's own shape when several are. An explicit `*rest` opts out of
  // absorption and always binds a collection.
  bindPositional(targets, elements, isTuple, env) {
    const wrap = (vals) => isTuple ? mkTuple(vals) : mkArr(vals);
    const put = (name, val) => {
      try { if (!env.set(name, val)) env.def(name, val); }
      catch { env.destroy(name); env.def(name, val); }
    };
    const restAt = targets.findIndex(t => t.rest);
    const trailing = restAt < 0 ? 0 : targets.length - restAt - 1;
    let i = 0;

    for (let pos = 0; pos < targets.length; pos++) {
      const t = targets[pos];
      const absorbs = restAt < 0 && pos === targets.length - 1;

      if (t.rest) {
        const end = (trailing > 0 && elements.length > i + trailing)
          ? elements.length - trailing
          : elements.length;
        put(t.name, wrap(elements.slice(i, Math.max(i, end))));
        i = Math.max(i, end);
      } else if (t.name === '_') {
        // In the last position `_` absorbs the remainder without binding it.
        i = absorbs ? elements.length : i + 1;
      } else if (absorbs) {
        const rest = elements.slice(i);
        put(t.name, rest.length === 0 ? mkUnit() : rest.length === 1 ? rest[0] : wrap(rest));
        i = elements.length;
      } else {
        put(t.name, elements[i] ?? mkUnit());
        i++;
      }
    }
  }

  typeMetadata(val) {
    // An error answers with its own code (`##IO`, `##Time`, …); everything else
    // goes through the shared table, which is where `##[` and `##(` come from.
    const sym = val.type === 'error' ? (val.errType ?? TYPESYM.UNIT) : typeSymbol(val);
    let count;
    switch (val.type) {
      case 'int':   count = String(Math.abs(val.v)).length; break;
      case 'float': count = String(val.v).replace(/^-/, '').length; break;
      case 'str':   count = [...val.v].length; break;
      case 'char':  count = 1; break;
      case 'bool':  count = 1; break;
      case 'arr':   count = val.v.length; break;
      case 'tuple': count = val.v.length; break;
      case 'func':  count = val.params?.length ?? 0; break;
      default:      count = 0;
    }
    return { type: 'tuple', v: [mkStr(sym), mkInt(count), val], keys: null };
  }

  // ─── Hot-def helpers ─────────────────────────────────────────────────────────

  // Return the name of the variable targeted by a statement (for sentinel pre-init)
  _hotTargetName(stmt) {
    if (!stmt) return null;
    if (stmt.type === 'CompoundAssign' || stmt.type === 'VarAssign' || stmt.type === 'Increment')
      return stmt.name;
    if (stmt.type === 'ExprStmt' && stmt.expr?.type === 'CollectionOp')
      return stmt.expr.obj?.name ?? null;
    return null;
  }

  // Return the neutral value for the first use of a hot-def variable (2-stmt prefix form)
  _hotNeutralForStmt(stmt) {
    if (!stmt) return mkInt(0);
    if (stmt.type === 'CompoundAssign' && (stmt.op === '*' || stmt.op === '/')) return mkInt(1);
    if (stmt.type === 'ExprStmt' && stmt.expr?.type === 'CollectionOp' && stmt.expr.op === '$+')
      return mkArr([]);
    if (stmt.type === 'VarAssign' && this._exprContainsOp(stmt.value, '$+')) return mkArr([]);
    if (stmt.type === 'VarAssign') return mkStr('');
    return mkInt(0);
  }

  // Return the neutral value for the first use of a hot-def variable (RHS ImplicitConcat form)
  _hotNeutralForExpr(expr) {
    if (!expr) return mkInt(0);
    if (expr.type === 'CollectionOp' && expr.op === '$+') return mkArr([]);
    return mkInt(0);
  }

  // Walk an expression and return the leftmost Ident name
  _leftmostIdentName(expr) {
    if (!expr) return null;
    if (expr.type === 'Ident') return expr.name || null;
    if (expr.type === 'CollectionOp') return this._leftmostIdentName(expr.obj);
    if (expr.type === 'BinOp') return this._leftmostIdentName(expr.left);
    return null;
  }

  // Check if an expression tree contains a CollectionOp with the given op
  _exprContainsOp(expr, op) {
    if (!expr) return false;
    if (expr.type === 'CollectionOp' && expr.op === op) return true;
    if (expr.type === 'ImplicitConcat') return (expr.items ?? []).some(i => this._exprContainsOp(i, op));
    return false;
  }

  async evalCollectionOp(expr, env) {
    // Hot array-accumulator: arr°$+ i initializes arr to [] instead of 0
    let col;
    if (expr.op === '$+' && expr.obj?.type === 'Ident' && expr.obj?.hot) {
      let existing = null;
      try { existing = env.get(expr.obj.name); } catch (_) {}
      if (existing === null) { col = mkArr([]); env.hotDef(expr.obj.name, col); }
      else col = existing;
    } else {
      col = await this.eval(expr.obj, env);
    }
    const arg = () => this.eval(expr.arg, env);

    // 1-based index resolution for collection ops
    const resolveIdx = (n, len) => {
      if (n === 0) throw new ZyRuntimeError('Index 0 is invalid (indices start at 1)', '##Index');
      return n < 0 ? len + n : n - 1;
    };
    const idx = async () => {
      const n = (await this.eval(expr.index, env)).v;
      return resolveIdx(n, col.v.length);
    };

    const notSupported = op => { throw new ZyError(`${op} not supported on ${col.type}`); };
    const colItems = () => {
      if (col.type === 'arr')   return col.v;
      if (col.type === 'tuple') return col.v;
      if (col.type === 'str')   return [...col.v].map(mkChar);
      notSupported('collection op');
    };
    const fromStr = items => col.type === 'str'
      ? mkStr(items.map(v => this.displayOutput(v)).join(''))
      : col.type === 'tuple'
        ? { type:'tuple', v: items, keys: null }
        : mkArr(items);

    switch (expr.op) {
      case '$#': {
        if (col.type === 'arr')   return mkInt(col.v.length);
        if (col.type === 'str')   return mkInt([...col.v].length);
        if (col.type === 'tuple') return mkInt(col.v.length);
        notSupported('$#');
      }

      case '$+': {
        const v = await arg();
        if (col.type === 'arr')   return mkArr([...col.v, v]);
        if (col.type === 'str')   return mkStr(col.v + this.displayOutput(v));
        if (col.type === 'tuple') return { type:'tuple', v:[...col.v,v], keys: col.keys ? [...col.keys,null] : null };
        notSupported('$+');
      }
      case '$+[i]': {
        const i = await idx(), v = await arg();
        if (col.type === 'arr') { const r=[...col.v]; r.splice(i,0,v); return mkArr(r); }
        if (col.type === 'str') { const r=[...col.v]; r.splice(i,0,this.display(v)); return mkStr(r.join('')); }
        if (col.type === 'tuple') {
          const nv=[...col.v]; nv.splice(i,0,v);
          const nk=col.keys?[...col.keys]:null; if(nk)nk.splice(i,0,null);
          return { type:'tuple', v:nv, keys:nk };
        }
        notSupported('$+[i]');
      }

      case '$-': {
        const v = await arg();
        if (col.type === 'arr') {
          const i = col.v.findIndex(el => this.equals(el, v));
          if (i < 0) return col;
          const r = [...col.v]; r.splice(i,1); return mkArr(r);
        }
        if (col.type === 'str') {
          const c = this.display(v), i = col.v.indexOf(c);
          return i < 0 ? col : mkStr(col.v.slice(0,i) + col.v.slice(i+c.length));
        }
        if (col.type === 'tuple') {
          const i = col.v.findIndex(el => this.equals(el, v)); if (i<0) return col;
          const nv=[...col.v], nk=col.keys?[...col.keys]:null; nv.splice(i,1); if(nk)nk.splice(i,1);
          return { type:'tuple', v:nv, keys:nk };
        }
        notSupported('$-');
      }
      case '$--': {
        const v = await arg();
        if (col.type === 'arr')   return mkArr(col.v.filter(el => !this.equals(el,v)));
        if (col.type === 'str') {
          const c = this.display(v); return mkStr(col.v.split(c).join(''));
        }
        if (col.type === 'tuple') {
          const kept = col.v.map((el,i)=>({el,k:col.keys?.[i]})).filter(({el})=>!this.equals(el,v));
          return { type:'tuple', v:kept.map(x=>x.el), keys:col.keys?kept.map(x=>x.k):null };
        }
        notSupported('$--');
      }
      case '$-[i]': {
        // In a DICTIONARY the address IS the key, so `$-[…]` — which already
        // means "remove by address" for the array (`arr$-[1]`, by position) — is
        // the same operator with the same sense (decision 9). That leaves
        // `$- valor` free to keep meaning "by value" in both collections.
        // Checked before the index is resolved as a position, which is what made
        // `d$-["beta"]` delete the FIRST key here instead of the named one.
        const rawIdx = await this.eval(expr.index, env);
        if (rawIdx.type === 'str' && isDict(col)) {
          const ki = col.keys.indexOf(rawIdx.v);
          if (ki < 0)
            throw new ZyRuntimeError(Interpreter.missingKeyMsg(rawIdx.v, col.keys), '##Key');
          const nv = [...col.v], nk = [...col.keys];
          nv.splice(ki, 1); nk.splice(ki, 1);
          return { type: 'tuple', v: nv, keys: nk };
        }
        if (isDict(col))
          throw new ZyError(Interpreter.notPositionalMsg('d$-[n]', col.keys));
        const i = await idx();
        if (col.type === 'arr')   { const r=[...col.v]; r.splice(i,1); return mkArr(r); }
        if (col.type === 'str')   { const r=[...col.v]; r.splice(i,1); return mkStr(r.join('')); }
        if (col.type === 'tuple') {
          const nv=[...col.v],nk=col.keys?[...col.keys]:null; nv.splice(i,1); if(nk)nk.splice(i,1);
          return { type:'tuple', v:nv, keys:nk };
        }
        notSupported('$-[i]');
      }
      case '$-[i:n]': {
        if (isDict(col))
          throw new ZyError(Interpreter.notPositionalMsg('d$-[a..b]', col.keys));
        const sv = (await this.eval(expr.start, env)).v;
        const nv = (await this.eval(expr.count, env)).v;
        const len = col.type === 'str' ? [...col.v].length : col.v.length;
        const si = resolveIdx(sv, len);
        if (col.type === 'arr')   { const r=[...col.v]; r.splice(si, nv); return mkArr(r); }
        if (col.type === 'str')   { const r=[...col.v]; r.splice(si, nv); return mkStr(r.join('')); }
        if (col.type === 'tuple') { const r=[...col.v]; r.splice(si, nv); return { type:'tuple', v:r, keys:col.keys?[...col.keys].filter((_,i)=>i<si||i>=si+nv):null }; }
        notSupported('$-[i:n]');
      }
      case '$-[i..j]': {
        const len = col.type === 'str' ? [...col.v].length : col.v.length;
        const fv = expr.range.from ? (await this.eval(expr.range.from, env)).v : 1;
        const tv = expr.range.to   ? (await this.eval(expr.range.to,   env)).v : len;
        const fi = resolveIdx(fv, len);
        const ti = resolveIdx(tv, len);
        const count = ti - fi + 1;
        if (col.type === 'arr')   { const r=[...col.v]; r.splice(fi,count); return mkArr(r); }
        if (col.type === 'str')   { const r=[...col.v]; r.splice(fi,count); return mkStr(r.join('')); }
        if (isDict(col))
          throw new ZyError(Interpreter.notPositionalMsg('d$-[a..b]', col.keys));
        if (col.type === 'tuple') { const r=[...col.v]; r.splice(fi,count); const ks=col.keys?[...col.keys]:null; if(ks)ks.splice(fi,count); return {type:'tuple',v:r,keys:ks}; }
        notSupported('$-[i..j]');
      }

      case '$?': {
        const v = await arg();
        if (col.type === 'arr')   return mkBool(col.v.some(el=>this.equals(el,v)));
        if (col.type === 'str')   return mkBool(col.v.includes(this.display(v)));
        // On a DICTIONARY the question is about the KEY, which is what `in`
        // asks in Python and in JS. Decision 10 makes reading an absent key an
        // error, so this is what lets a dictionary built piece by piece be
        // consulted at all — without it there is no way to ask before reading.
        // Asking about a value is a different operation and would need its own
        // sign. On a POSITIONAL tuple it stays a value question: there are no
        // keys to ask about.
        if (isDict(col))
          return mkBool(col.keys.some(k => k === this.display(v)));
        if (col.type === 'tuple') return mkBool(col.v.some(el=>this.equals(el,v)));
        notSupported('$?');
      }
      case '$??': {
        const v = await arg(), target = this.display(v);
        const result = [];
        if (col.type === 'arr' || col.type === 'tuple') {
          col.v.forEach((el,i) => { if (this.equals(el,v)) result.push(mkInt(i+1)); }); // 1-based
        } else if (col.type === 'str') {
          const chars = [...col.v];
          for (let i=0; i<=chars.length-target.length; i++) {
            if (chars.slice(i,i+target.length).join('')===target) result.push(mkInt(i+1)); // 1-based
          }
        } else notSupported('$??');
        return mkArr(result);
      }

      case '$~': {
        const i=await idx(), v=await arg();
        if (col.type === 'arr')   { const r=[...col.v]; r[i]=v; return mkArr(r); }
        if (col.type === 'str')   { const r=[...col.v]; r[i]=this.display(v); return mkStr(r.join('')); }
        if (col.type === 'tuple') { const nv=[...col.v]; nv[i]=v; return {type:'tuple',v:nv,keys:col.keys}; }
        notSupported('$~');
      }

      case '$[i..j]': {
        const len = col.type === 'str' ? [...col.v].length : col.v.length;
        const fi = expr.range.from == null ? 0 : this.resolve1Based((await this.eval(expr.range.from,env)).v, len);
        const ti = expr.range.to   == null ? len : this.resolve1Based((await this.eval(expr.range.to,env)).v, len) + 1; // inclusive end
        if (col.type === 'arr')   return mkArr(col.v.slice(fi, ti));
        if (col.type === 'str')   return mkStr([...col.v].slice(fi,ti).join(''));
        if (isDict(col))
          throw new ZyError(Interpreter.notPositionalMsg('d$[a..b]', col.keys));
        if (col.type === 'tuple') return { type:'tuple', v:col.v.slice(fi,ti), keys:col.keys?col.keys.slice(fi,ti):null };
        notSupported('$[i..j]');
      }

      case '$[i:n]': {
        const fv=(await this.eval(expr.range.from,env)).v, n=(await this.eval(expr.range.count,env)).v;
        const len = col.type === 'str' ? [...col.v].length : col.v.length;
        const fi = this.resolve1Based(fv, len);
        if (col.type === 'arr')   return mkArr(col.v.slice(fi, fi+n));
        if (col.type === 'str')   return mkStr([...col.v].slice(fi,fi+n).join(''));
        if (isDict(col))
          throw new ZyError(Interpreter.notPositionalMsg('d$[a..b]', col.keys));
        if (col.type === 'tuple') return { type:'tuple', v:col.v.slice(fi,fi+n), keys:col.keys?col.keys.slice(fi,fi+n):null };
        notSupported('$[i:n]');
      }

      case '$^+': {
        if (col.type !== 'arr') notSupported('$^+');
        return mkArr([...col.v].sort((a,b)=> a.type==='str' ? a.v.localeCompare(b.v) : a.v-b.v));
      }
      case '$^-': {
        if (col.type !== 'arr') notSupported('$^-');
        return mkArr([...col.v].sort((a,b)=> a.type==='str' ? b.v.localeCompare(a.v) : b.v-a.v));
      }
      case '$^': {
        if (col.type !== 'arr') notSupported('$^');
        const cmpFn = await this.evalCallable(expr.arg, env);
        const items = [...col.v];
        for (let i = 1; i < items.length; i++) {
          for (let j = i; j > 0; j--) {
            const less = await this.callFunc(cmpFn, [items[j-1], items[j]]);
            if (!this.truthy(less)) { const tmp = items[j-1]; items[j-1] = items[j]; items[j] = tmp; }
            else break;
          }
        }
        return mkArr(items);
      }

      case '$>': {
        const fn = await this.evalCallable(expr.arg, env);
        const items = colItems();
        const mapped = await Promise.all(items.map(el => this.callFunc(fn,[el])));
        return fromStr(mapped);
      }
      case '$|': {
        const fn = await this.evalCallable(expr.arg, env);
        const items = colItems();
        const kept = [];
        for (const el of items) {
          if (this.truthy(await this.callFunc(fn,[el]))) kept.push(el);
        }
        return fromStr(kept);
      }
      case '$<': {
        const fn = await this.evalCallable(expr.arg, env);
        let acc = await this.eval(expr.init, env);
        for (const el of colItems()) acc = await this.callFunc(fn,[acc,el]);
        return acc;
      }

      case '$!':
        return mkBool(col.type === 'error');

      case '$!!': {
        if (col.type === 'error') throw new ZyErrorPropagate(col);
        return col;
      }

      case '$~~': {
        if (col.type !== 'str') notSupported('$~~');
        const from = this.display(await this.eval(expr.from, env));
        const to   = this.display(await this.eval(expr.to,   env));
        const maxN = expr.count ? (await this.eval(expr.count, env)).v : Infinity;
        let result = col.v, idx2 = 0, n = 0;
        while (n < maxN) {
          const p = result.indexOf(from, idx2);
          if (p === -1) break;
          result = result.slice(0, p) + to + result.slice(p + from.length);
          idx2 = p + to.length;
          n++;
        }
        return mkStr(result);
      }

      case '$/': {
        if (col.type !== 'str') notSupported('$/');
        const delimVal = await arg();
        const delim = this.display(delimVal);
        const parts = col.v.split(delim);
        return mkArr(parts.map(p => mkStr(p)));
      }

      case '$*': {
        const n = (await arg()).v;
        if (col.type !== 'str') notSupported('$*');
        if (n <= 0) return mkStr('');
        return mkStr(col.v.repeat(Math.trunc(n)));
      }

      case '$++': {
        const evalItems = await Promise.all(expr.items.map(i => this.eval(i, env)));
        if (col.type === 'str') {
          // displayOutput: $++ builds display text, so it follows the numeral mode.
          let result = col.v;
          for (const item of evalItems) result += this.displayOutput(item);
          return mkStr(result);
        }
        if (col.type === 'arr') {
          return mkArr([...col.v, ...evalItems]);
        }
        notSupported('$++');
      }
    }

    throw new ZyError(`Unknown collection operator: ${expr.op}`);
  }

  async evalCallable(argExpr, env) {
    const v = await this.eval(argExpr, env);
    if (v && v.type === 'func') return v;
    throw new ZyError(`Expected a function for collection operator`);
  }

  // Evaluate a Match's subject and find the first arm whose pattern matches,
  // running any pattern-binding side effects (env.def for list-pattern binds)
  // exactly once. Returns null if no arm matches.
  async selectMatchArm(matchExpr, env) {
    const val = await this.eval(matchExpr.expr, env);
    for (const arm of matchExpr.arms) {
      if (await this.matchPattern(arm.pattern, val, env)) return arm;
    }
    return null;
  }

  async matchPattern(pattern, val, env) {
    switch (pattern.type) {
      case 'wildcard': return true;
      case 'guard':    return this.truthy(await this.eval(pattern.cond, env));
      case 'or': {
        // Alternatives are tested left to right; first match wins
        for (const alt of pattern.alts) {
          if (await this.matchPattern(alt, val, env)) return true;
        }
        return false;
      }
      case 'range': {
        const from = (await this.eval(pattern.from, env)).v;
        const to   = (await this.eval(pattern.to,   env)).v;
        return val.v >= from && val.v <= to;
      }
      case 'comparison': {
        const pv = (await this.eval(pattern.value, env)).v;
        const sv = val.v;
        switch (pattern.op) {
          case '<':  return sv < pv;
          case '>':  return sv > pv;
          case '<=': return sv <= pv;
          case '>=': return sv >= pv;
          case '==': return this.equals(val, await this.eval(pattern.value, env));
          case '<>': return !this.equals(val, await this.eval(pattern.value, env));
        }
        return false;
      }
      case 'literal': {
        const pv = await this.eval(pattern.value, env);
        if (pv.type === 'arr') return pv.v.some(el => this.equals(val, el));
        return this.equals(val, pv);
      }
      case 'list': {
        // Scalar scrutinee: list pattern means "value is one of these" (membership)
        if (val.type !== 'arr') {
          for (const elem of pattern.elems) {
            if (elem.kind === 'wildcard') return true;
            if (elem.kind === 'literal' && this.equals(val, await this.eval(elem.expr, env))) return true;
          }
          return false;
        }
        const elems = pattern.elems;
        const restIdx = elems.findIndex(e => e.kind === 'rest');
        const matchElem = async (elem, arrVal) => {
          if (elem.kind === 'wildcard') return true;
          if (elem.kind === 'literal') return this.equals(arrVal, await this.eval(elem.expr, env));
          // An identifier inside a list pattern is a *value to compare*, exactly
          // as it is at the top of a pattern — not a name being created. This
          // used to `env.def(elem.name, arrVal)` and return true, i.e. match
          // anything and bind a name the arm could not even read, so
          // `?? [9,8,7] { [a, b, c] => … }` took the branch with a, b and c
          // undefined while the tree-walker refused it (DM-26).
          //
          // A pattern that matches when it should raise is the worst way to be
          // wrong: a `??` with a typo in a constant's name takes that branch
          // every time and says nothing.
          if (elem.kind === 'bind') return this.matchIdentInPattern(elem.name, arrVal, env);
          // Legacy format (name, rest)
          if (elem.rest) return true;
          if (elem.name === '_') return true;
          return this.matchIdentInPattern(elem.name, arrVal, env);
        };
        if (restIdx < 0) {
          if (val.v.length !== elems.length) return false;
          for (let i = 0; i < elems.length; i++) {
            if (!await matchElem(elems[i], val.v[i])) return false;
          }
          return true;
        }
        const minLen = elems.length - 1;
        if (val.v.length < minLen) return false;
        for (let i = 0; i < restIdx; i++) {
          if (!await matchElem(elems[i], val.v[i])) return false;
        }
        const afterRest = elems.length - restIdx - 1;
        const restElem = elems[restIdx];
        if (restElem.name && restElem.name !== '_')
          env.def(restElem.name, mkArr(val.v.slice(restIdx, val.v.length - afterRest)));
        for (let i = 0; i < afterRest; i++) {
          const elem = elems[restIdx + 1 + i];
          if (!await matchElem(elem, val.v[val.v.length - afterRest + i])) return false;
        }
        return true;
      }
    }
    return false;
  }

  /**
   * Pairs each `<~` output parameter with the caller variable that was passed to it, so
   * `callFunc` can copy the final value back after the call returns. Only a bare identifier
   * argument can receive a write-back — passing a literal or an expression to an out-param
   * has nothing to assign to, and is simply skipped (matching the tree-walker).
   *
   * Shared by the `Call` and `CallExpr` branches: both need it, and having only one of them
   * build the list is precisely the bug this helper exists to prevent recurring.
   */
  buildOutWriteback(fn, expr, env) {
    if (!fn.params?.some(p => p.isOut)) return null;
    return fn.params
      .map((p, i) => p.isOut && expr.args[i]?.type === 'Ident'
        ? { paramName: p.name, callerName: expr.args[i].name, callerEnv: env }
        : null)
      .filter(Boolean);
  }

  async callFunc(fn, args, outWriteback) {
    if (fn.native) return fn.call(args);
    // Every call gets a frame over the global scope, with `funcBoundary` set so
    // only functions are reachable past it — the isolation a direct call has
    // always had here and in both Rust engines.
    //
    // A closure's captures are COPIED into that frame, not chained to. Copying
    // is what makes a write inside die with the call: `esc(5)` three times over
    // `cont = cont + x` gives 5, 5, 5 in the Rust engines, not 5, 10, 15.
    // Chaining to a captured scope would have accumulated.
    const funcEnv = new Env(fn.closureEnv ?? this.globalEnv, fn.closureEnv == null);
    if (fn.captures) {
      for (const [name, value] of fn.captures) funcEnv.def(name, value);
    } else if (fn.body) {
      // A NAMED function called directly captures the file's variables, exactly
      // as a lambda captures the scope it was written in (ERROR-ZYB-002). The
      // values are read HERE, at the call, from the scope the function was
      // written in — the global one — and never from the caller's, which would
      // be dynamic scoping: `f` called inside `g` would see `g`'s locals.
      //
      // Copied into the frame, so a write inside dies with the call. The set of
      // names is cached on the function: the names cannot change, only what
      // they hold.
      if (!fn._freeNames) {
        fn._freeNames = [...collectIdentNames(fn.body, new Set())]
          .filter(n => !(fn.params ?? []).some(p => (p?.name ?? p) === n));
      }
      for (const name of fn._freeNames) {
        let v;
        try { v = this.globalEnv.get(name); } catch { continue; }
        if (v !== undefined && v.type !== 'func') funcEnv.def(name, v);
      }
    }
    for (let i = 0; i < fn.params.length; i++)
      funcEnv.def(fn.params[i].name, args[i] ?? mkUnit());
    let sig;
    try {
      sig = await this.execBlock(fn.body, funcEnv);
    } catch (e) {
      // $!! (ZyErrorPropagate) exits the function and returns the error value to the caller
      if (e instanceof ZyErrorPropagate) return e.errVal;
      // <~ inside a match arm, when the match is evaluated as a sub-expression
      // (not a bare statement), unwinds here as a thrown ZyReturn — see eval()'s
      // 'Match' case.
      if (e instanceof ZyReturn) return e.value;
      throw e;
    }
    // Write back output params to caller env
    if (outWriteback) {
      for (const { paramName, callerName, callerEnv } of outWriteback) {
        const val = funcEnv.vars.get(paramName);
        if (val !== undefined) callerEnv.set(callerName, val);
      }
    }
    if (sig instanceof ZyReturn) return sig.value;
    return mkUnit();
  }

  async evalStr(parts, env) {
    let s = '';
    for (const part of parts) {
      if (part.t === 'lit') {
        s += part.v;
      } else {
        try {
          const toks = new Lexer(part.v).tokenize();
          const expr = new Parser(toks).parseExpr();
          // displayOutput: "{n}" renders in the active numeral script.
          s += this.displayOutput(await this.eval(expr, env));
        } catch {
          s += `{${part.v}}`;
        }
      }
    }
    return mkStr(s);
  }

  applyOp(op, l, r) {
    const isNum = v => v.type === 'int' || v.type === 'float';
    const fmtArg = v => {
      if (v.type === 'str')   return `String("${v.v}")`;
      if (v.type === 'int')   return `Int(${v.v})`;
      if (v.type === 'float') return `Float(${v.v})`;
      if (v.type === 'bool')  return `Bool(${v.v})`;
      return `${v.type}(${String(v.v)})`;
    };

    if (op === '+' || op === '-' || op === '*' || op === '/' || op === '%' || op === '^') {
      if (!isNum(l) || !isNum(r)) {
        if (op === '+')
          throw new ZyError(`+ is arithmetic only — use juxtaposition to concatenate strings: "a" b "c"`);
        const badType = !isNum(l) ? l : r;
        const rustCap = { int:'Int', float:'Float', str:'String', bool:'Bool', arr:'Array', tuple:'Tuple' };
        this.outputFn(`warning: arithmetic operation on non-numeric type: ${rustCap[badType.type] ?? badType.type}\n\n`);
        throw new ZyError(`arithmetic requires numeric operands: ${fmtArg(l)}, ${fmtArg(r)}`);
      }
    }

    if (op === '<' || op === '>' || op === '<=' || op === '>=') {
      const ord = orderValues(l, r);
      if (ord === null) {
        const opName = { '<':'Lt', '>':'Gt', '<=':'Le', '>=':'Ge' }[op];
        const cmpName = v => ({ int:'integer', float:'float', str:'string', bool:'boolean', arr:'array', tuple:'tuple' })[v.type] ?? v.type;
        const cmpVal  = v => v.type === 'str' ? `'${v.v}'` : String(v.v);
        throw new ZyError(`cannot compare ${cmpName(l)} ${cmpVal(l)} with ${cmpName(r)} ${cmpVal(r)} using operator '${opName}'`);
      }
      switch (op) {
        case '<':  return mkBool(ordLt(ord));
        case '>':  return mkBool(ordGt(ord));
        case '<=': return mkBool(ordLe(ord));
        case '>=': return mkBool(ordGe(ord));
      }
    }

    const isFloat = l.type === 'float' || r.type === 'float';
    const mk = isFloat ? mkFloat : mkInt;
    const lv = l.v, rv = r.v;
    switch (op) {
      case '+':  return isFloat ? mkFloat(lv + rv) : intResult(lv + rv, lv, '+', rv);
      case '-':  return isFloat ? mkFloat(lv - rv) : intResult(lv - rv, lv, '-', rv);
      case '*':  return isFloat ? mkFloat(lv * rv) : intResult(lv * rv, lv, '*', rv);
      case '/':  if (rv === 0) throw new ZyRuntimeError('division by zero', '##Div');
                 return isFloat ? mkFloat(lv / rv) : mkInt(Math.trunc(lv / rv));
      case '%':  if (rv === 0) throw new ZyRuntimeError('modulo by zero', '##Div');
                 return mk(lv % rv);
      // A negative exponent is a float operation, as in every other engine;
      // this used to truncate, so `2 ^ -2` was 0 here and 0.25 there.
      case '^':  if (isFloat) return mkFloat(Math.pow(lv, rv));
                 if (rv < 0)  return mkFloat(Math.pow(lv, rv));
                 return intResult(Math.pow(lv, rv), lv, '^', rv);
      case '==': return mkBool(this.equals(l, r));
      case '<>': return mkBool(!this.equals(l, r));
      case '<':  return mkBool(lv < rv);
      case '>':  return mkBool(lv > rv);
      case '<=': return mkBool(lv <= rv);
      case '>=': return mkBool(lv >= rv);
    }
    throw new ZyError(`Unknown operator: ${op}`);
  }

  // Structural equality, recursive, and the same relation at every depth.
  //
  // Collections used to be compared with `JSON.stringify(a.v) === JSON.stringify(b.v)`,
  // which is three bugs in one line:
  //
  //   - It compares the *encoding*, not the values, so `[1] == [1.0]` was #0
  //     while `1 == 1.0` is #1: element equality was a different relation from
  //     scalar equality. Both Rust engines promote at every depth.
  //   - It reads only `v`, and a named tuple keeps its labels in `keys`, so the
  //     labels were invisible: `(x: 1, y: 2) == (a: 1, b: 2)` was #1, and so was
  //     `(1, 2) == (x: 1, y: 2)`. Neither is defensible under any reading of what
  //     a record is.
  //   - Two structurally equal values can serialize differently (key insertion
  //     order), so it could answer #0 for values it should call equal.
  //
  // What is deliberately *not* settled here: two named tuples with the same
  // labels and the same values are #1 in this engine and #0 in both Rust ones.
  // That is dictionary equality, and decisions 7-11 of
  // Divergente_ES/forma/README.md are what decides it (DM-22). This function
  // keeps whichever answer its engine already gave for that one case, so
  // implementing the dictionary does not have to undo a guess made here.
  // The test an identifier performs inside a pattern: the same dual rule the
  // scalar path uses — an array variable means containment, anything else means
  // equality — and an identifier that names nothing raises, because a pattern
  // element is a value and there is no value to compare against.
  matchIdentInPattern(name, val, env) {
    const pv = env.get(name);            // throws when the name is undefined
    if (pv.type === 'arr') return pv.v.some(el => this.equals(val, el));
    return this.equals(val, pv);
  }

  // The refusal of an absent dictionary key, spelled as the two Rust engines
  // spell it. The three used to say it four different ways — and this one said
  // the least of all through the bracket. `forma/diccionarios.zy` § 2b asked for
  // one text with the available keys in all three.
  //
  // The vocabulary is the decision too: it is a **dictionary**, not a named
  // tuple. A tuple is immutable by definition and this is not (decision 7).
  // The refusal of a positional address on a dictionary, spelled as the two Rust
  // engines spell it.
  //
  // Decision 11 withdrew `d[2]`, and the reasoning covers the whole family: in a
  // mutable dictionary a position is not a stable address, because adding a key
  // changes what sits at each one. There is no principled line between "the
  // second key" and "the first two keys", and a positional WRITE is strictly
  // worse than a positional read — it corrupts data rather than returning the
  // wrong value. This is Python's position: `dict` has no indexing and no
  // slicing, and the slice gets no key-based replacement.
  static notPositionalMsg(op, keys) {
    const k = (keys ?? []).find(x => x) ?? 'clave';
    return `a dictionary is addressed by key, not by position: \`${op}\` has no meaning here\n` +
      `help: use the key — d["${k}"], d["${k}"]$~ value, d$-["${k}"] — ` +
      `because adding a key changes what sits at each position`;
  }

  static missingKeyMsg(key, keys) {
    const avail = (keys ?? []).filter(k => k);
    return avail.length === 0
      ? `no key '${key}' in dictionary — it is empty`
      : `no key '${key}' in dictionary — available: ${avail.join(', ')}`;
  }

  equals(a, b) {
    if (a.type !== b.type) {
      if ((a.type === 'int' || a.type === 'float') &&
          (b.type === 'int' || b.type === 'float')) return a.v === b.v;
      return false;
    }
    // Two functions are equal when they are THE SAME function (BUG-ZYB-012).
    // A named function is one object, made once where it is declared, so two
    // names for it are one reference; a lambda is a fresh object per
    // evaluation, so one written twice is two closures — which is what object
    // identity says, and it says it without anything being carried around.
    //
    // Without this arm the comparison fell through to `a.v === b.v`, and a
    // function has no `v`: `undefined === undefined` made EVERY pair of
    // functions equal, a named one to a lambda included. It looked right on the
    // only case anybody had tried and was wrong on the rest, and nothing caught
    // it because no corpus file compared two functions.
    if (a.type === 'func') {
      // By the definition, not the object: a named function taken as a value is
      // a copy carrying its own captures, and `f == adder` is `#1` in both Rust
      // engines. Natives have no id and fall back to object identity.
      return (a.fnId != null || b.fnId != null) ? a.fnId === b.fnId : a === b;
    }
    if (a.type === 'arr' || a.type === 'tuple') {
      if (a.v.length !== b.v.length) return false;
      // `isDict`, not `keys.some(k => k)`: the empty dictionary has an empty
      // key array and is still a dictionary.
      const ka = a.keys ?? [], kb = b.keys ?? [];
      const aIsDict = isDict(a), bIsDict = isDict(b);
      // A positional tuple and a dictionary are different shapes even when their
      // values match.
      if (aIsDict !== bIsDict) return false;
      // Two DICTIONARIES are equal when they hold the same keys with the same
      // values. Key ORDER is not part of it: insertion order is preserved for
      // walking, as in Python's dict, but two dictionaries built in a different
      // order still hold the same thing. This engine compared position by
      // position, so `(x:1,y:2) == (y:2,x:1)` was #0 here and #1 in both Rust
      // engines (DM-22).
      if (aIsDict) {
        return ka.every((k, i) => {
          const j = kb.indexOf(k);
          return j >= 0 && this.equals(a.v[i], b.v[j]);
        });
      }
      // A positional tuple keeps position-by-position comparison.
      return a.v.every((el, i) => this.equals(el, b.v[i]));
    }
    return a.v === b.v;
  }

  truthy(val) {
    if (!val || val.type === 'unit') return false;
    if (val.type === 'bool')  return val.v;
    if (val.type === 'int' || val.type === 'float') return val.v !== 0;
    if (val.type === 'str')   return val.v.length > 0;
    return true;
  }

  display(val) {
    if (!val || val.type === 'unit') return '';
    // Standalone Unit prints as nothing, but INSIDE a collection it renders
    // as `()` — mirrors Rust `Value::to_display_string` (unified 2026-06-12).
    const nested = (v) => (v && v.type === 'unit') ? '()' : this.display(v);
    if (val.type === 'int')   return String(val.v);
    if (val.type === 'float') return floatText(val.v);
    if (val.type === 'str')  return val.v;
    if (val.type === 'char') return val.v;
    if (val.type === 'bool') return val.v ? '#1' : '#0';
    if (val.type === 'arr')  return '[' + val.v.map(nested).join(', ') + ']';
    if (val.type === 'tuple') {
      if (val.keys?.some(k => k !== null))
        return '(' + val.v.map((item, i) => `${val.keys[i]}: ${nested(item)}`).join(', ') + ')';
      return '(' + val.v.map(nested).join(', ') + ')';
    }
    if (val.type === 'func') {
      const arity = val.params?.length ?? 0;
      return val.name === '<lambda>' ? `<lambd/${arity}>` : `<funct/${arity}>`;
    }
    if (val.type === 'error') return `${val.errType ?? '##_'}(${val.v ?? ''})`;
    return String(val.v ?? val);
  }

  // Display form under the active numeral mode. The mode reaches inside
  // collections too — a number does not stop being a number by sitting in a
  // list — mirroring Rust `Value::to_display_string_in`.
  displayOutput(val) {
    const m = this.numeralMode;
    if (!val || val.type === 'unit') return '';
    if (m === ASCII_BASE) return this.display(val);
    const nested = (v) => (v && v.type === 'unit') ? '()' : this.displayOutput(v);
    if (val.type === 'int')   return numeralInt(val.v, m);
    if (val.type === 'float') return numeralFloat(val.v, m);
    if (val.type === 'bool')  return numeralBool(val.v, m);
    if (val.type === 'arr')   return '[' + val.v.map(nested).join(', ') + ']';
    if (val.type === 'tuple') {
      if (val.keys?.some(k => k !== null))
        return '(' + val.v.map((item, i) => `${val.keys[i]}: ${nested(item)}`).join(', ') + ')';
      return '(' + val.v.map(nested).join(', ') + ')';
    }
    return this.display(val);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Everything `zymbol check` would say about a program, without running a line of it.
 *
 * Returns `{ diagnostics, ast }`. A diagnostic is `{severity, code, message, line, params}`:
 * `code` and `params` are what a caller with a translation catalogue renders from, and
 * `message` is the English fallback for one without. A parse failure comes back as a
 * diagnostic like any other (code `E_PARSE`) rather than as a thrown error, because "the
 * program does not parse" is the single most useful thing to tell someone who is learning
 * the syntax, and throwing it would make it the caller's problem to catch and phrase.
 *
 * Warnings are included. Whether to *show* them is the caller's decision — the playground
 * keeps them behind a toggle, because `W_LIFETIME` alone fires on more than half of the
 * programs in examples/ (see Checker.lifetimeWarnForIterator).
 *
 * @param {string} src
 * @returns {{diagnostics: Array, ast: object|null}}
 */
/**
 * Extract `function → parameter count` from a module's source.
 *
 * The browser counterpart of `zymbol_semantic::arities_of_module_file`. Callers
 * that can resolve imports build one of these per alias and pass the lot to
 * `checkSource`, which is how a qualified call gets checked at all — the checker
 * itself has no filesystem and no resolver, so without a table it says nothing
 * rather than guessing.
 *
 * Every function declared in the file is listed, exported or not: a call to a
 * private one is already reported elsewhere, and leaving it out would silently
 * skip the arity check on a name that does resolve.
 *
 * Returns an empty Map for a source that does not parse — a broken module is
 * reported when it is imported, not by inventing arities for it here.
 */
export function moduleAritiesFrom(src) {
  const out = new Map();
  let ast;
  try {
    ast = new Parser(new Lexer(src).tokenize()).parse();
  } catch {
    return out;
  }
  const walk = stmts => {
    for (const s of (stmts ?? [])) {
      if (!s) continue;
      if (s.type === 'FuncDecl') out.set(s.name, (s.params ?? []).length);
      else if (s.type === 'ModuleBlock') walk(s.body);
    }
  };
  walk(ast.body);
  return out;
}

/**
 * Which parameter slots of each function in `src` are `<~` outputs.
 *
 * The mirror of `out_slots_of_file` in crates/zymbol-semantic/src/call_arity.rs,
 * and the table `m::f(x<~)` is checked against (REFERENCE.md L36). Functions
 * without an output parameter are left out, so an empty Map means "nothing to
 * check", not "unknown".
 */
export function moduleOutSlotsFrom(src) {
  const out = new Map();
  let ast;
  try {
    ast = new Parser(new Lexer(src).tokenize()).parse();
  } catch {
    return out;
  }
  const walk = stmts => {
    for (const s of (stmts ?? [])) {
      if (!s) continue;
      if (s.type === 'FuncDecl') {
        const slots = (s.params ?? []).map((p, i) => (p.isOut ? i : -1)).filter(i => i >= 0);
        if (slots.length) out.set(s.name, slots);
      } else if (s.type === 'ModuleBlock') walk(s.body);
    }
  };
  walk(ast.body);
  return out;
}

/**
 * Build the alias → arity-table map for every module `ast` imports directly.
 *
 * Only the caller's resolver can reach a module's source, so this is where the
 * two meet: `moduleAritiesFrom` knows how to read a module, the resolver knows
 * where it is. Direct imports only — a wrong argument count written in *this*
 * file can only name a module this file imports.
 *
 * A module that fails to resolve is skipped in silence: that is reported when
 * the import runs, with a better message than this pass could produce.
 *
 * @param {object} ast          parsed program (needs `.body`)
 * @param {Function|null} resolver  `(path, fromPath) => string | {src} | null`
 * @param {string|null} filePath
 * @returns {Promise<Map<string, Map<string, number>>>}
 */
export async function moduleAritiesFor(ast, resolver, filePath = null) {
  const out = new Map();
  if (!resolver || !ast?.body) return out;
  for (const imp of ast.body) {
    if (imp?.type !== 'Import' || !imp.alias || !imp.path) continue;
    if (imp.path.startsWith('std/')) continue;   // shipped with the engine
    try {
      const result = await resolver(imp.path, filePath);
      if (result == null || result.notFound) continue;
      const modSrc = typeof result === 'string' ? result : result.src;
      if (typeof modSrc === 'string') out.set(imp.alias, moduleAritiesFrom(modSrc));
    } catch {
      // Reported at import time; nothing useful to add here.
    }
  }
  return out;
}

/**
 * The same walk as `moduleAritiesFor`, collecting output slots instead of counts.
 * @returns {Promise<Map<string, Map<string, number[]>>>}
 */
export async function moduleOutSlotsFor(ast, resolver, filePath = null) {
  const out = new Map();
  if (!resolver || !ast?.body) return out;
  for (const imp of ast.body) {
    if (imp?.type !== 'Import' || !imp.alias || !imp.path) continue;
    if (imp.path.startsWith('std/')) continue;   // no std/ function takes an output param
    try {
      const result = await resolver(imp.path, filePath);
      if (result == null || result.notFound) continue;
      const modSrc = typeof result === 'string' ? result : result.src;
      if (typeof modSrc === 'string') {
        const slots = moduleOutSlotsFrom(modSrc);
        if (slots.size) out.set(imp.alias, slots);
      }
    } catch {
      // Reported at import time.
    }
  }
  return out;
}

/**
 * @param {string} src
 * @param {{moduleArities?: Map<string, Map<string, number>>}} [opts]
 *   `moduleArities` maps an import alias to that module's `moduleAritiesFrom`
 *   table — build it with `moduleAritiesFor` when a resolver is available.
 *   Omitted, qualified calls to user modules go unchecked; `std/` calls are
 *   checked either way, since that table ships with the engine.
 */
export function checkSource(src, opts = {}) {
  let ast = null;
  try {
    ast = new Parser(new Lexer(src).tokenize()).parse();
  } catch (e) {
    // ZyError keeps the source line in `zyLine` and prefixes the message with it; older
    // throw sites pass neither, so the prefix is the only thing left to read it from.
    const raw  = e?.message ?? String(e);
    const line = e?.zyLine ?? (/^Line (\d+): /.exec(raw)?.[1] ?? null);
    const message = raw.replace(/^Line \d+: /, '');
    return {
      ast: null,
      diagnostics: [{
        severity: 'error',
        code: 'E_PARSE',
        message,
        line: line === null ? null : Number(line),
        params: { message },
      }],
    };
  }

  let diagnostics;
  try {
    const checker = new Checker(ast);
    if (opts.moduleArities instanceof Map) checker.moduleArities = opts.moduleArities;
    if (opts.moduleOutSlots instanceof Map) checker.moduleOutSlots = opts.moduleOutSlots;
    diagnostics = checker.check();
  } catch (e) {
    // The checker walking a shape it did not expect must not look like a broken program.
    // Report nothing rather than something wrong; running the program still reports for real.
    console.warn('checkSource: analysis failed —', e?.message ?? e);
    diagnostics = [];
  }
  // A name reported as UNDEFINED must not also be reported as UNUSED.
  //
  // The two come from opposite ends of the same fact: `? #1 { v = 1 }  >> v ¶`
  // defines `v` in the block frame, which pops — so the analyser says "unused"
  // when the frame closes and "undefined" when the later line looks for it.
  // Both are about a variable the program plainly meant to use, and Rust reports
  // only the second. Saying both invites the reader to fix the wrong one.
  const quiet = new Set(
    diagnostics.filter(d => d.code === 'E_VAR' && d.params?.name).map(d => d.params.name));
  if (quiet.size > 0) {
    diagnostics = diagnostics.filter(
      d => !(d.code === 'W_UNUSED' && quiet.has(d.params?.name)));
  }
  return { ast, diagnostics };
}

/**
 * What each name in a program is, for the editor's identifier hover.
 *
 * Maps a name to every place it is introduced: `{kind, line, type, value}`, where `type`
 * and `value` are filled in only when the definition's right-hand side is a literal. A
 * name bound to a call gets `kind` and nothing else — the alternative would be guessing a
 * type, and a hover card that guesses is worse than one that stays quiet.
 *
 * Definitions are collected per name, in source order, because the lexer records a line
 * but no column: a caller resolves a hover by taking the last definition at or above the
 * hovered line. That is exact for ordinary code and wrong only under aggressive shadowing,
 * which is a limit the playground states rather than papers over.
 *
 * @param {string} src
 * @returns {Map<string, Array<{kind:string, line:number, type?:string, value?:string}>>}
 */
export function buildSymbolIndex(src) {
  const index = new Map();
  const add = (name, kind, line, extra = null) => {
    if (!name || typeof name !== 'string') return;
    if (!index.has(name)) index.set(name, []);
    index.get(name).push({ kind, line: line ?? 0, ...(extra ?? {}) });
  };

  let ast;
  try {
    ast = new Parser(new Lexer(src).tokenize()).parse();
  } catch {
    return index;   // half-typed program: no index, and the operator hover still works
  }

  /**
   * A literal right-hand side, and only a literal one, yields a type and a value to show.
   *
   * Type names are the engine's own — `Int`, `Float`, `Text` — even when the card around
   * them is in another language, so that what the hover says matches what `#?` prints.
   */
  const describe = (expr) => {
    if (!expr || typeof expr !== 'object') return null;
    switch (expr.type) {
      case 'Literal': {
        switch (expr.kind) {
          case 'int':   return { type: 'Int',   value: String(expr.value) };
          case 'float': return { type: 'Float', value: String(expr.value) };
          case 'bool':  return { type: 'Bool',  value: expr.value ? '#1' : '#0' };
          case 'char':  return { type: 'Char',  value: `'${expr.value}'` };
          case 'str': {
            // A string literal is a list of parts; it only has a showable value when none
            // of them is an interpolation, whose value depends on the run.
            const parts = expr.value;
            if (!Array.isArray(parts)) return { type: 'Text', value: JSON.stringify(String(parts)) };
            if (!parts.every(p => p?.t === 'lit')) return { type: 'Text' };
            return { type: 'Text', value: JSON.stringify(parts.map(p => p.v).join('')) };
          }
          default: return null;
        }
      }
      case 'Array': return { type: 'Array', value: `${(expr.items ?? []).length} items` };
      case 'Tuple': return { type: 'Tuple', value: `${(expr.items ?? []).length} fields` };
      case 'Lambda': {
        const n = (expr.params ?? []).length;
        return { type: 'Lambda', value: `${n} parameter${n === 1 ? '' : 's'}` };
      }
      case 'UnaryOp': {
        // `-3` parses as a negation around a literal, and reads as one to a human.
        const inner = describe(expr.operand ?? expr.value);
        if (inner && (expr.op === '-' || expr.op === 'neg')) {
          return { type: inner.type, value: `${expr.op === '-' ? '-' : ''}${inner.value}` };
        }
        return null;
      }
      default: return null;
    }
  };

  const walkBlock = (stmts) => { for (const s of stmts ?? []) walkStmt(s); };

  const walkStmt = (stmt) => {
    if (!stmt || typeof stmt !== 'object') return;
    switch (stmt.type) {
      case 'ConstAssign':
        add(stmt.name, 'const', stmt.line, describe(stmt.value));
        return;
      case 'VarAssign':
        add(stmt.name, 'var', stmt.line, describe(stmt.value));
        return;
      case 'FuncDecl': {
        const n = (stmt.params ?? []).length;
        add(stmt.name, 'func', stmt.line,
            { value: `${n} parameter${n === 1 ? '' : 's'}` });
        for (const p of (stmt.params ?? [])) {
          add(typeof p === 'string' ? p : p.name, 'param', stmt.line);
        }
        walkBlock(stmt.body);
        return;
      }
      case 'Import':
        add(stmt.alias, 'import', stmt.line, { value: stmt.path });
        return;
      case 'Loop':
        if (stmt.var) add(stmt.var, 'iterator', stmt.line);
        walkBlock(stmt.body);
        return;
      case 'CliArgs':
        add(stmt.variable, 'var', stmt.line);
        return;
      case 'KeyInput':
        add(stmt.varName ?? stmt.variable, 'var', stmt.line);
        return;
      case 'Input':
        add(stmt.name ?? stmt.variable, 'var', stmt.line);
        return;
      case 'ModuleDecl':
        add(stmt.name, 'module', stmt.line);
        walkBlock(stmt.body);
        return;
      default: {
        // Everything else only matters for the blocks it may contain.
        for (const key of ['body', 'tryBody', 'try', 'elseBody', 'else', 'thenBody', 'then']) {
          if (Array.isArray(stmt[key])) walkBlock(stmt[key]);
        }
        for (const key of ['branches', 'catches', 'arms', 'elifs']) {
          for (const b of (stmt[key] ?? [])) {
            if (Array.isArray(b?.body)) walkBlock(b.body);
          }
        }
        const fin = stmt.finallyBody ?? stmt.finally;
        if (Array.isArray(fin)) walkBlock(fin);
      }
    }
  };

  walkBlock(ast.body);
  return index;
}

export async function runZymbol(src, inputFn, onOutput, moduleResolver = null, filePath = null, tuiContext = null, cliArgs = [], opts = {}) {
  const tokens = new Lexer(src).tokenize();
  const ast    = new Parser(tokens).parse();

  // Argument counts for `alias::func(…)` need the imported module's source, so
  // the table is built here, where the resolver is, and handed to the checker.
  // Same split as Rust: `zymbol_semantic::module_arities` reads the files and
  // `TypeChecker::set_module_arities` receives the result.
  const checker = new Checker(ast);
  checker.moduleArities = await moduleAritiesFor(ast, moduleResolver, filePath);
  checker.moduleOutSlots = await moduleOutSlotsFor(ast, moduleResolver, filePath);
  const diags   = checker.check();

  // Where diagnostics go. The playground passes no `onError` and keeps today's
  // behaviour — everything in the one output panel, which is all a browser has.
  // A caller that is a process passes one and gets the CLI's split: the
  // program's output on stdout, everything the engine has to say about the
  // program on stderr. Mixing the two was ~63 of the 91 corpus divergences,
  // because the Rust engines have always kept them apart.
  const onError = typeof opts.onError === 'function' ? opts.onError : onOutput;
  // Declared out here so the exit status survives the try (GAP-ZYB-006).
  let interp = null;

  for (const d of diags) if (d.severity === 'error') onError(formatDiagnostic(d) + '\n\n');
  if (diags.some(d => d.severity === 'error'))
    return { failed: true, message: diags.find(d => d.severity === 'error').message };

  try {
    interp = new Interpreter(onOutput, inputFn, moduleResolver, tuiContext);
    interp.cliArgs = cliArgs;
    if (opts.maxSteps        != null) interp.maxSteps        = opts.maxSteps;
    if (opts.maxBytes        != null) interp.maxBytes        = opts.maxBytes;
    if (opts.maxInfiniteIter != null) interp.maxInfiniteIter = opts.maxInfiniteIter;
    await interp.run(ast, filePath);
    // A module file run directly: refused, exactly as the CLI refuses it.
    if (interp.moduleRefused) {
      onError(interp.moduleRefused);
      return { failed: true, message: interp.moduleRefused };
    }
  } catch (e) {
    // The error is written through a callback rather than rethrown because the
    // playground shows it in the output panel — an exception escaping here
    // would take the page down with it. The return value is how a caller that
    // *is* a process (tests/run_one.mjs) learns to exit non-zero: without it
    // the CLI reported success for a program the engine had refused, and
    // `zyq reject` read that as the form being accepted.
    const message = e instanceof ZyStaticError ? e.message : (e.message ?? String(e));
    onError(`Runtime error: ${message}`);
    return { failed: true, message };
  }
  // GAP-ZYB-006: the exit status a top-level `<~ n` asked for, so a caller that
  // is a process can pass it on. Undefined when the program did not ask.
  return { failed: false, exitCode: interp?.exitCode };
}
