// SPDX-License-Identifier: AGPL-3.0-only
/**
 * symbols.js — what each symbol in the editor is, structurally.
 *
 * A visitor who opens the playground sees a program made of punctuation and has no way to
 * find out what any of it means. This is the index behind the hover help that answers that:
 * the highlighter tags every operator span with `data-h`, and the key it writes is a key in
 * SYMBOLS below.
 *
 * The split of responsibilities matters:
 *
 *   here                the token, its group, its example, and the id of its card
 *   the locale files    the prose — concept and summary, in the reader's language
 *
 * The example stays here because it is *code*: `? x > 0 { … }` reads the same in every
 * language, and Zymbol's whole point is that operators never change. Only the sentences
 * around it are translated.
 *
 * `ops` names one of the 16 concepts the landing page already translates into 111
 * languages, so a reader whose language has no full catalogue still sees `?` labelled もし
 * or si. See src/i18n/i18n.js.
 *
 * Every example is a complete snippet that `zymbol check` accepts — a card that showed
 * something the language would reject would be worse than no card, and
 * tests/test_symbols.mjs runs all of them through the real binary to keep that true.
 * The source for the operator set is REFERENCE.md §21 of the interpreter repo; REF_ROWS at
 * the bottom is the map that lets the test prove nothing in that table went unexplained.
 */

/** @type {Record<string, {id:string, group:string, example:string, ops?:string}>} */
export const SYMBOLS = {
  // ── Control flow ─────────────────────────────────────────────────────────────
  '?':    { id:'if',       group:'control', ops:'if',    example:'x = 5\n? x > 0 {\n    >> "positive" ¶\n}' },
  '_?':   { id:'elif',     group:'control', ops:'elif',  example:'x = -3\n? x > 0 {\n    >> "positive" ¶\n}\n_? x < 0 {\n    >> "negative" ¶\n}' },
  '_':    { id:'else',     group:'control', ops:'else',  example:'x = 0\n? x > 0 {\n    >> "positive" ¶\n}\n_ {\n    >> "zero or less" ¶\n}' },
  '??':   { id:'match',    group:'control', ops:'match', example:'n = 42\nlabel = ?? n {\n    1..9   => "small"\n    10..99 => "medium"\n    _      => "large"\n}\n>> label ¶' },
  '@':    { id:'loop',     group:'control', ops:'loop',  example:'@ i:1..3 {\n    >> i ¶\n}' },
  '@!':   { id:'break',    group:'control', example:'@ i:1..10 {\n    ? i > 3 { @! }\n    >> i ¶\n}' },
  '@>':   { id:'continue', group:'control', example:'@ i:1..5 {\n    ? i % 2 == 0 { @> }\n    >> i ¶\n}' },
  '->':   { id:'lambda',   group:'control', ops:'fn',    example:'double = x -> x * 2\n>> double(21) ¶' },
  '~':    { id:'workcopy', group:'names', example:'work(a~) {\n    a = a $+ 99\n    >> a ¶\n}\nlista = [1, 2]\nwork(lista)\n>> lista ¶' },
  '<~':   { id:'return',   group:'control', ops:'ret',   example:'double(n) {\n    <~ n * 2\n}\n>> double(21) ¶' },
  '|>':   { id:'pipe',     group:'control', example:'double = x -> x * 2\nr = 5 |> double\n>> r ¶' },
  '=>':   { id:'arrow',    group:'control', example:'>> ?? 2 {\n    1 => "one"\n    _ => "many"\n} ¶' },

  // ── Input and output ─────────────────────────────────────────────────────────
  '>>':   { id:'out',       group:'io', ops:'out',   example:'>> "Hello, World!" ¶' },
  '<<':   { id:'input',     group:'io', ops:'input', example:'<< "Your name: " name\n>> "Hi, " >> name ¶' },
  '¶':    { id:'newline',   group:'io', example:'>> "line one" ¶\n>> "line two" ¶' },
  '\\\\': { id:'newline_alt', group:'io', example:'>> "line one" \\\\\n>> "line two" \\\\' },
  '>>!':  { id:'clear',     group:'io', example:'>>!\n>> "a fresh screen" ¶' },
  '>>?':  { id:'term_size', group:'io', example:'[h, w] = >>?\n>> "rows: " >> h ¶' },
  '>>~':  { id:'out_pos',   group:'io', example:'>>~ (2, 5) > "placed text"' },
  '>>|':  { id:'tui',       group:'io', example:'>>| {\n    >>!\n    >>~ (1, 1) > "TUI mode"\n    @~ 800\n}' },
  '<<|':  { id:'key',       group:'io', example:'>>| {\n    >>~ (1, 1) > "press a key"\n    <<| k\n}' },
  '<<|?': { id:'key_nb',    group:'io', example:'>>| {\n    <<|? k\n    ? k <> "" { >>~ (1, 1) > k }\n}' },
  '@~':   { id:'sleep',     group:'io', example:'>> "wait" ¶\n@~ 500\n>> "done" ¶' },
  '><':   { id:'cli_args',  group:'io', example:'>< args\n>> "arguments: " >> args$# ¶' },

  // ── Names and values ─────────────────────────────────────────────────────────
  '=':    { id:'assign',   group:'names', ops:'var', example:'x = 5\n>> x ¶' },
  ':=':   { id:'const',    group:'names', ops:'const', example:'PI := 3.14159\n>> PI ¶' },
  '++':   { id:'incr',     group:'names', example:'x = 1\nx++\n>> x ¶' },
  '--':   { id:'decr',     group:'names', example:'x = 2\nx--\n>> x ¶' },
  '+=':   { id:'compound', group:'names', example:'x = 10\nx += 5\n>> x ¶' },
  '°':    { id:'hot',      group:'names', example:'@ n:1..4 {\n    °total += n\n}\n>> total ¶' },
  '\\':   { id:'lifetime', group:'names', example:'x = 5\n>> x ¶\n\\ x' },

  // ── Comparison and logic ─────────────────────────────────────────────────────
  '==':   { id:'eq',  group:'logic', example:'? 2 + 2 == 4 { >> "yes" ¶ }' },
  '<>':   { id:'neq', group:'logic', example:'? 3 <> 4 { >> "different" ¶ }' },
  '<':    { id:'lt',  group:'logic', example:'? 1 < 2 { >> "smaller" ¶ }' },
  '>':    { id:'gt',  group:'logic', example:'? 2 > 1 { >> "bigger" ¶ }' },
  '<=':   { id:'lte', group:'logic', example:'? 2 <= 2 { >> "at most" ¶ }' },
  '>=':   { id:'gte', group:'logic', example:'? 2 >= 2 { >> "at least" ¶ }' },
  '&&':   { id:'and', group:'logic', example:'x = 5\n? x > 0 && x < 10 { >> "in range" ¶ }' },
  '||':   { id:'or',  group:'logic', example:'x = 0\n? x == 0 || x == 1 { >> "bit" ¶ }' },
  '!':    { id:'not', group:'logic', example:'ready = #0\n? !ready { >> "not ready" ¶ }' },

  // ── Arithmetic ───────────────────────────────────────────────────────────────
  '+':    { id:'arith', group:'math', example:'>> 7 + 3 ¶\n>> 7 - 3 ¶\n>> 7 * 3 ¶\n>> 7 / 2 ¶\n>> 7 % 3 ¶\n>> 2 ^ 8 ¶' },

  // ── Collections ──────────────────────────────────────────────────────────────
  '$#':   { id:'len',        group:'coll', ops:'len', example:'arr = [10, 20, 30]\n>> arr$# ¶' },
  '$+':   { id:'append',     group:'coll', ops:'app', example:'arr = [1, 2]\narr = arr$+ 3\n>> arr ¶' },
  '$+[':  { id:'insert',     group:'coll', example:'arr = [1, 3]\narr = arr$+[2] 2\n>> arr ¶' },
  '$-':   { id:'remove',     group:'coll', ops:'rem', example:'arr = [1, 2, 3]\narr = arr$- 2\n>> arr ¶' },
  '$--':  { id:'remove_all', group:'coll', example:'arr = [1, 2, 2, 3]\narr = arr$-- 2\n>> arr ¶' },
  '$-[':  { id:'remove_at',  group:'coll', example:'arr = [1, 2, 3]\narr = arr$-[2]\n>> arr ¶' },
  '$?':   { id:'contains',   group:'coll', example:'arr = [1, 2, 3]\n? arr$? 2 { >> "found" ¶ }' },
  '$??':  { id:'find_all',   group:'coll', example:'arr = [1, 2, 1]\n>> arr$?? 1 ¶' },
  '$~':   { id:'update',     group:'coll', example:'arr = [1, 2, 3]\narr = arr[2]$~ 99\n>> arr ¶' },
  '$~~':  { id:'replace',    group:'coll', example:'>> "hello"$~~["l":"L"] ¶' },
  '$[':   { id:'slice',      group:'coll', example:'arr = [1, 2, 3, 4]\n>> arr$[2..3] ¶' },
  '$^':   { id:'sort_by',    group:'coll', example:'people = [#(name: "b", age: 30), #(name: "a", age: 25)]\n>> people$^ (p, q -> p.age < q.age) ¶' },
  '$^+':  { id:'sort_asc',   group:'coll', example:'>> [3, 1, 2]$^+ ¶' },
  '$^-':  { id:'sort_desc',  group:'coll', example:'>> [3, 1, 2]$^- ¶' },
  '$>':   { id:'map',        group:'coll', example:'>> [1, 2, 3]$> (x -> x * 2) ¶' },
  '$|':   { id:'filter',     group:'coll', example:'>> [1, 2, 3, 4]$| (x -> x % 2 == 0) ¶' },
  '$<':   { id:'reduce',     group:'coll', example:'>> [1, 2, 3]$< (0, (acc, x -> acc + x)) ¶' },
  '$/':   { id:'split',      group:'coll', example:'>> "a,b,c" $/ "," ¶' },
  '$*':   { id:'repeat',     group:'coll', example:'>> "=" $* 20 ¶' },
  '$++':  { id:'concat',     group:'coll', example:'n = 42\n>> "value=" $++ n ¶' },

  // ── Errors ───────────────────────────────────────────────────────────────────
  '!?':     { id:'try',      group:'err', ops:'try', example:'!? {\n    x = 1 / 0\n}\n:! {\n    >> "failed: " >> _err ¶\n}' },
  ':!':     { id:'catch',    group:'err', example:'!? {\n    x = 1 / 0\n}\n:! ##Div {\n    >> "division by zero" ¶\n}' },
  ':>':     { id:'finally',  group:'err', example:'!? {\n    >> "work" ¶\n}\n:> {\n    >> "always runs" ¶\n}' },
  '$!':     { id:'is_err',   group:'err', example:'safe(n) {\n    <~ 10 / n\n}\nr = safe(0)\n? r$! { >> "error" ¶ }' },
  '$!!':    { id:'prop_err', group:'err', example:'safe(n) {\n    r = 10 / n\n    ? r$! { r$!! }\n    <~ r\n}\n>> safe(2) ¶' },
  '##type': { id:'err_type', group:'err', example:'!? {\n    x = 1 / 0\n}\n:! ##Div {\n    >> "caught" ¶\n}' },

  // ── Data and formatting ──────────────────────────────────────────────────────
  '#|':    { id:'num_eval',  group:'data', example:'>> #|"42"| + 1 ¶' },
  '#.|':   { id:'round',     group:'data', example:'>> #.2|3.14159| ¶' },
  '#!|':   { id:'truncate',  group:'data', example:'>> #!2|3.14159| ¶' },
  '#,|':   { id:'comma',     group:'data', example:'>> #,|1234567| ¶' },
  '#^|':   { id:'sci',       group:'data', example:'>> #^|12345.0| ¶' },
  '#?':    { id:'type_of',   group:'data', example:'>> 42#? ¶' },
  '##.':   { id:'to_float',  group:'data', example:'>> ##.42 ¶' },
  '###':   { id:'to_int',    group:'data', example:'>> ###3.7 ¶' },
  '##!':   { id:'to_int_tr', group:'data', example:'>> ##!3.7 ¶' },
  '##"':   { id:'typed_str', group:'data', example:'<< ##"(20) "name: " n\n>> n ¶' },
  "##'":   { id:'typed_chr', group:'data', example:"<< ##' \"key: \" k\n>> k ¶" },
  '0x':    { id:'base_lit',  group:'data', example:'>> 0x41 ¶\n>> 0b1010 ¶\n>> 0o17 ¶' },
  '#1':    { id:'true',      group:'data', ops:'bool', example:'ready = #1\n? ready { >> "yes" ¶ }' },
  '#0':    { id:'false',     group:'data', ops:'bool', example:'ready = #0\n? !ready { >> "no" ¶ }' },
  '#num#': { id:'numerals',  group:'data', example:'#०९#\n>> १२३ ¶\n#09#' },

  // ── Modules ──────────────────────────────────────────────────────────────────
  '#mod': { id:'module',     group:'mod', example:'# geometry {\n    #> { area }\n    area(w, h) {\n        <~ w * h\n    }\n}' },
  '#>':   { id:'export',     group:'mod', example:'# geometry {\n    #> { area }\n    area(w, h) {\n        <~ w * h\n    }\n}' },
  '<#':   { id:'import',     group:'mod', example:'<# std/math => m\n>> m::sqrt(16) ¶' },
  '::':   { id:'mod_call',   group:'mod', example:'<# std/math => m\n>> m::sqrt(16) ¶' },
  '.':    { id:'member',     group:'mod', example:'person = #(name: "Ada", age: 36)\n>> person.name ¶' },

  // ── Shell and scripts ────────────────────────────────────────────────────────
  '<\\':  { id:'shell',      group:'shell', example:'greeting = <\\ echo hola \\>\n>> greeting ¶' },
  '</':   { id:'script',     group:'shell', example:'r = </ ./helper.zy />\n>> r ¶' },

  // ── Structure ────────────────────────────────────────────────────────────────
  '..':   { id:'range',    group:'punct', example:'@ i:1..3 {\n    >> i ¶\n}' },
  '[':    { id:'brackets', group:'punct', example:'arr = [10, 20, 30]\n>> arr[2] ¶' },
  '{':    { id:'braces',   group:'punct', example:'? #1 {\n    >> "inside a block" ¶\n}' },
  '(':    { id:'parens',   group:'punct', example:'>> (1 + 2) * 3 ¶' },
  '#(':   { id:'dict',     group:'coll',  example:'u = #(name: "Ana", age: 30)\n>> u.name ¶\n>> u["age"] ¶' },
  '#[':   { id:'mixedarr', group:'coll',  example:'>> #[1, "two", 3.0] ¶' },
  ';':    { id:'semi',     group:'punct', example:'m = [[1, 2], [3, 4]]\n>> m[1>1 ; 2>2] ¶' },
};

/**
 * Groups, in the order a reference panel would show them. The label is translated
 * (`sym.group.<id>` in the locale files); the order is not a translatable thing.
 */
export const GROUPS = ['control', 'io', 'names', 'logic', 'math', 'coll', 'err',
                       'data', 'mod', 'shell', 'punct'];

/**
 * Every row of REFERENCE.md §21 → the card that explains it.
 *
 * The table lists *forms* as well as tokens: `arr[[p,q] ; [r,s]]` is a real thing the
 * language does, but it is five tokens, and a reader hovering the `[` cannot be told which
 * of the six bracket forms they are in. Those rows point at the card for their most
 * characteristic token, and the card covers the family. What this map exists to prevent is
 * the other failure: a row that no card mentions at all, which
 * tests/test_symbols.mjs turns into a test failure.
 *
 * Keys are the Symbol cell of the row, verbatim.
 */
export const REF_ROWS = {
  '`=`': '=',
  '`[..] =`': '[',
  '`(..) =`': '(',
  '`(n: ..) =`': '(',
  '`:=`': ':=',
  '`>>`': '>>',
  '`<<`': '<<',
  '`<< <typespec>`': '##"',
  '`@~`': '@~',
  '`>>!`': '>>!',
  '`>>?`': '>>?',
  '`>>~`': '>>~',
  '`<<|`': '<<|',
  '`<<|?`': '<<|?',
  '`>>|`': '>>|',
  '`¶` / `\\\\`': '¶',
  '`?`': '?',
  '`_?`': '_?',
  '`_`': '_',
  '`??`': '??',
  '`[p, q]`': '??',
  '`p || q`': '??',
  '`@`': '@',
  '`@!`': '@!',
  '`@>`': '@>',
  '`->`': '->',
  '`<~`': '<~',
  '`|>`': '|>',
  '`$#`': '$#',
  '`$+`': '$+',
  '`$+[i]`': '$+[',
  '`$-`': '$-',
  '`$--`': '$--',
  '`$-[i]`': '$-[',
  '`$-[i..j]`': '$-[',
  '`$-[i:n]`': '$-[',
  '`$?`': '$?',
  '`$??`': '$??',
  '~~`arr[i] = val`~~': '$~',
  '~~`arr[i] += val`~~': '$~',
  '`arr[i]$~ val`': '$~',
  '`arr[i>j]$~ val`': '$~',
  '`d["k"]$~ val`': '$~',
  '`d[k1>k2]$~ val`': '$~',
  '`d$-["k"]`': '$-[',
  '`d$? "k"`': '$?',
  '`#[…]`': '[',
  '`@ (k, v):x`': '@',
  '`arr[i>j]`': '[',
  '`arr[i>j>k]`': '[',
  '`arr[(e)>j]`': '[',
  '`arr[a>b]`': '[',
  '`arr[-1>-1]`': '[',
  '`arr[[i>j]]`': '[',
  '`arr[p ; q]`': ';',
  '`arr[[g] ; [g]]`': ';',
  '`arr[[p,q] ; [r,s]]`': ';',
  '`arr[i>r1..r2]`': ';',
  '`arr[r1..r2>j]`': ';',
  '`$[i..j]`': '$[',
  '`$[i:n]`': '$[',
  '`$^+`': '$^+',
  '`$^-`': '$^-',
  '`$^`': '$^',
  '`$>`': '$>',
  '`$|`': '$|',
  '`$<`': '$<',
  '`$~~[p:r]`': '$~~',
  '`$/`': '$/',
  '`$++`': '$++',
  '`$*`': '$*',
  '`!?`': '!?',
  '`:!`': ':!',
  '`:>`': ':>',
  '`$!`': '$!',
  '`$!!`': '$!!',
  '`#|x|`': '#|',
  '`x#?`': '#?',
  '`#.N|x|`': '#.|',
  '`#!N|x|`': '#!|',
  '`##.expr`': '##.',
  '`###expr`': '###',
  '`##!expr`': '##!',
  '`#,|x|`': '#,|',
  '`#^|x|`': '#^|',
  '`0x`, `0b`, `0o`, `0d`': '0x',
  '`#`': '#mod',
  '`#>`': '#>',
  '`<#`': '<#',
  '`=>`': '=>',
  '`::`': '::',
  '`.`': '.',
  '`<\\ cmd \\>`': '<\\',
  '`</ f.zy />`': '</',
  '`>< args`': '><',
  '`\\ var`': '\\',
  '`#1` / `#0`': '#1',
  '`#d0d9#`': '#num#',
  '`++` / `--`': '++',
  '`+=` `-=` `*=` `/=` `%=` `^=`': '+=',
  '`x°` / `°x`': '°',
};

/** The card for a `data-h` key, or null when the key has no card yet. */
export function symbolAt(key) {
  return Object.prototype.hasOwnProperty.call(SYMBOLS, key) ? SYMBOLS[key] : null;
}
