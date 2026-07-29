export const EXAMPLES = {
  'Output >>': [
    { title: 'Hello, Zymbol-Lang!', code: '>> "Hello, Zymbol-Lang!" ¶' },
    { title: 'Hello World',   code: '>> "Hello, World!" ¶' },
    { title: 'Multi-value',   code: 'name = "Alice"\n>> "Hello, " name "!" ¶' },
    { title: 'Numbers',       code: 'x = 10\ny = 3\n>> x " + " y " = " x + y ¶' },
    { title: 'Blank line',    code: '>> "line 1" ¶\n>> ¶\n>> "line 3" ¶' },
  ],
  'Input <<': [
    { title: 'Read input',    code: '<< "Your name: " name\n>> "Hi, " name "!" ¶' },
    { title: 'Two inputs',    code: '<< "First: " a\n<< "Second: " b\n>> a " and " b ¶' },
  ],
  'Variables': [
    { title: 'Types',         code: 'n = 123\nf = 123.45\nactive = #1\noff = #0\n>> n ¶\n>> f ¶\n>> active ¶\n>> off ¶' },
    { title: 'Constant',      code: 'PI := 3.14159\nradius = 5\n>> "area = " PI * radius ^ 2 ¶' },
    { title: 'Interpolation', code: 'name = "Zymbol"\nversion = 2\n>> "Welcome to {name} v{version}!" ¶' },
    { title: 'Compound ops',  code: 'x = 10\nx += 5\nx *= 2\nx--\n>> x ¶' },
  ],
  'Collections': [
    { title: 'Array',         code: 'arr = [10, 20, 30]\n>> arr ¶\n>> arr[0] ¶\n>> arr[-1] ¶\n\n// Arrays are mutable\narr[1] = 99\narr[0] += 5\n>> arr ¶' },
    { title: 'Array: value semantics', code: '// Assigning an array creates an independent copy\na = [1, 2, 3]\nb = a\na[0] = 99\n>> a ¶    // [99, 2, 3]\n>> b ¶    // [1, 2, 3]  ← b unaffected' },
    { title: 'Tuple',         code: '// Tuples are immutable — elements cannot be changed\nt = (10, "hello", #1)\n>> t ¶\n>> t[0] ¶\n>> t[1] ¶\n\n// Use $~ for a functional update (returns new tuple)\nt2 = t[0]$~ 99\n>> t ¶     // original unchanged\n>> t2 ¶    // new tuple' },
    { title: 'Named tuple',   code: 'pt = (x: 3, y: 7)\n>> pt ¶\n>> pt[0] " " pt[1] ¶' },
    { title: 'Field access .', code: 'pt = (x: 3, y: 7)\n>> pt.x ¶\n>> pt.y ¶\nperson = (name: "Alice", age: 30)\n>> person.name " is " person.age ¶' },
    { title: 'Nested .field', code: 'p = (pos: (x: 5, y: 8), label: "origin")\n>> p.pos.x ¶\n>> p.pos.y ¶\n>> p.label ¶' },
    { title: 'String tuple',  code: 'words = ("hello", "world", "!")\n>> words ¶' },
    { title: '$# length',     code: 'arr = [10, 20, 30]\n>> arr$# ¶\n>> "hello"$# ¶\n>> (1,2,3,4)$# ¶' },
    { title: '$+ append',     code: 'arr = [1, 2, 3]\narr = arr$+ 4\narr = arr$+ 5\n>> arr ¶' },
    { title: '$+[i] insert',  code: 'arr = [10, 20, 30]\narr = arr$+[1] 99\n>> arr ¶' },
    { title: '$- remove',     code: 'arr = [10, 20, 30, 20, 40]\narr = arr$- 20\n>> arr ¶\narr = arr$-- 10\n>> arr ¶' },
    { title: '$-[i] remove at',code:'arr = [10, 20, 30, 40]\narr = arr$-[0]\n>> arr ¶\narr = arr$-[1..2]\n>> arr ¶' },
    { title: '$? contains',   code: 'arr = [1, 2, 3, 4, 5]\n>> arr$? 3 ¶\n>> arr$? 9 ¶\n>> "hello"$? \'l\' ¶' },
    { title: '$?? find all',  code: 'arr = [20, 10, 20, 30, 20]\n>> arr$?? 20 ¶\n>> "hello"$?? \'l\' ¶' },
    { title: 'arr[i] update',  code: 'arr = [10, 20, 30]\narr[1] = 99       // direct update\narr[0] += 5       // compound: += -= *= /= %= ^=\n>> arr ¶\n\n// Functional update — returns new array\narr2 = arr[2]$~ 0\n>> arr ¶     // original unchanged\n>> arr2 ¶    // new array' },
    { title: '$[i..j] slice', code: 'arr = [10, 20, 30, 40, 50]\n>> arr$[1..3] ¶\n>> "hello world"$[6..10] ¶' },
    { title: '$^+ sort',      code: 'nums = [3, 1, 4, 1, 5, 9, 2, 6]\n>> nums$^+ ¶\n>> nums$^- ¶' },
    { title: '$> map',        code: 'double(x) { <~ x * 2 }\narr = [1, 2, 3, 4, 5]\n>> arr$> double ¶' },
    { title: '$| filter',     code: 'even(x) { <~ x % 2 == 0 }\narr = [1, 2, 3, 4, 5, 6]\n>> arr$| even ¶' },
    { title: '$< reduce',     code: 'add(a, b) { <~ a + b }\narr = [1, 2, 3, 4, 5]\n>> arr$< (0, add) ¶' },
  ],
  'Control ?': [
    { title: 'If / else',     code: 'x = 7\n? x > 0 {\n    >> "positive" ¶\n} _ {\n    >> "not positive" ¶\n}' },
    { title: 'If / _? / _',  code: 'x = 0\n? x > 0 {\n    >> "positive" ¶\n} _? x == 0 {\n    >> "zero" ¶\n} _ {\n    >> "negative" ¶\n}' },
    { title: 'Nested',        code: 'a = 5\nb = 3\n? a > b {\n    ? a > 10 {\n        >> "big" ¶\n    } _ {\n        >> "a wins" ¶\n    }\n} _ {\n    >> "b wins" ¶\n}' },
  ],
  'Match ??': [
    { title: 'Ranges',        code: 'score = 85\ngrade = ?? score {\n    90..100 : "A"\n    80..89  : "B"\n    70..79  : "C"\n    60..69  : "D"\n    _       : "F"\n}\n>> "grade: " grade ¶' },
    { title: 'Strings',       code: 'color = "red"\ncode = ?? color {\n    "red"   : "#FF0000"\n    "green" : "#00FF00"\n    "blue"  : "#0000FF"\n    _       : "#000000"\n}\n>> code ¶' },
    { title: 'Guard _?',      code: 'temp = -5\nstate = ?? temp {\n    _? temp < 0  : "ice"\n    _? temp < 20 : "cold"\n    _? temp < 35 : "warm"\n    _            : "hot"\n}\n>> state ¶' },
  ],
  'Loops @': [
    { title: 'Range 1..5',    code: '@ i:1..5 {\n    >> i " "\n}\n>> ¶' },
    { title: 'Range + step',  code: '@ i:1..9:2 {\n    >> i " "\n}\n>> ¶' },
    { title: 'While',         code: 'n = 1\n@ n <= 100 {\n    n *= 2\n}\n>> n ¶' },
    { title: 'Foreach array', code: 'fruits = ["apple", "pear", "grape"]\n@ fruit:fruits {\n    >> "- " fruit ¶\n}' },
    { title: 'Foreach string',code: '@ c:"hello" {\n    >> c "-"\n}\n>> ¶' },
    { title: 'Break @!',      code: 'i = 0\n@ {\n    i++\n    ? i >= 5 { @! }\n    >> i " "\n}\n>> ¶' },
    { title: 'Infinite (safe)',code: '// @ without a break → hits the 50k-step limit\n// The interpreter stops it automatically.\n@ {\n    >> "Zymbol-lang " ¶\n}' },
    { title: 'Continue @>',  code: '@ i:1..10 {\n    ? i % 2 == 0 { @> }\n    ? i > 7 { @! }\n    >> i " "\n}\n>> ¶' },
  ],
  'Functions': [
    { title: 'Basic',         code: 'add(a, b) { <~ a + b }\n>> add(3, 4) ¶' },
    { title: 'Factorial',     code: 'factorial(n) {\n    ? n <= 1 { <~ 1 }\n    <~ n * factorial(n - 1)\n}\n>> factorial(5) ¶\n>> factorial(10) ¶' },
    { title: 'Greet',         code: 'greet(name) {\n    >> "Hello, " name "!" ¶\n}\ngreet("World")\ngreet("Zymbol")' },
    { title: 'Max',           code: 'max(a, b) {\n    ? a >= b { <~ a }\n    <~ b\n}\n>> max(7, 3) ¶\n>> max(2, 9) ¶' },
    { title: 'Fibonacci',     code: 'fib(n) {\n    ? n <= 1 { <~ n }\n    <~ fib(n - 1) + fib(n - 2)\n}\n@ i:0..9 {\n    >> fib(i) " "\n}\n>> ¶' },
    { title: 'Fn → Fn call',  code: 'square(n) { <~ n * n }\nsum_of_squares(a, b) {\n    // functions can call other functions\n    <~ square(a) + square(b)\n}\n>> sum_of_squares(3, 4) ¶' },
    { title: 'Scope isolation',code: '// Functions are fully isolated:\n// globals are NOT visible inside functions.\nx = 100\n\nno_global_access(val) {\n    // x is not visible here — pass everything as params\n    <~ val * 2\n}\n\n>> no_global_access(5) ¶\n>> x ¶  // x unchanged: 100' },
    { title: 'Block vs fn scope', code: 'total = 0\n\n@ i:1..5 {\n    // loop vars are local to block\n    partial = i * i\n    total = total + partial   // total visible: outer var\n}\n\n// partial is gone, total persists\n>> "total: " total ¶\n\nsquare(n) { <~ n * n }\n>> square(6) ¶\n// total is not visible inside square' },
  ],
  'Lambdas ->': [
    { title: 'Basic lambda',   code: 'double = x -> x * 2\n>> double(5) ¶\n>> double(12) ¶' },
    { title: 'Multi-param',    code: 'add = (a, b) -> a + b\n>> add(3, 4) ¶\n>> add(10, 20) ¶' },
    { title: 'Block body',     code: 'clamp = (v, lo, hi) -> {\n    ? v < lo { <~ lo }\n    ? v > hi { <~ hi }\n    <~ v\n}\n>> clamp(5, 1, 10) ¶\n>> clamp(-3, 0, 100) ¶\n>> clamp(150, 0, 100) ¶' },
    { title: '$> with lambda 1', code: 'nums = [1, 2, 3, 4, 5]\n>> nums$> (x -> x * x) ¶' },
    { title: '$| with lambda 2', code: 'nums = [1, 2, 3, 4, 5, 6]\n>> nums$| (x -> x % 2 == 0) ¶' },
    { title: '$< with lambda 3', code: 'nums = [1, 2, 3, 4, 5]\n>> nums$< (0, (acc, x) -> acc + x) ¶' },
    { title: 'Closure',        code: 'make_adder(n) {\n    <~ x -> x + n\n}\nadd5  = make_adder(5)\nadd10 = make_adder(10)\n>> add5(3) ¶\n>> add10(3) ¶' },
    { title: 'Pipe |>',        code: 'double = x -> x * 2\ninc    = x -> x + 1\nresult = 5 |> double(_) |> inc(_)\n>> result ¶' },
    { title: 'Pipe w/ args',   code: 'add = (a, b) -> a + b\n>> 10 |> add(_, 5) ¶\n>> 3  |> add(7, _) ¶' },
    { title: 'Chain pipeline', code: 'nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nresult = nums\n    $| (x -> x % 2 == 0)\n    $> (x -> x * x)\n>> result ¶' },
  ],
  'Destructuring': [
    { title: 'Array basic',    code: '[a, b, c] = [10, 20, 30]\n>> a ¶\n>> b ¶\n>> c ¶' },
    { title: 'Array rest *',   code: '[first, *rest] = [1, 2, 3, 4, 5]\n>> first ¶\n>> rest ¶' },
    { title: 'Skip with _',    code: '[x, _, z] = [10, 99, 30]\n>> x ¶\n>> z ¶' },
    { title: 'Tuple positional',code: '(x, y) = (42, 99)\n>> x ¶\n>> y ¶' },
    { title: 'Named fields',   code: 'pt = (x: 5, y: 9)\n(x: px, y: py) = pt\n>> px ¶\n>> py ¶' },
    { title: 'Swap values',    code: 'a = 1\nb = 2\n[a, b] = [b, a]\n>> a ¶\n>> b ¶' },
    { title: 'From function',  code: 'pair(a, b) { <~ [a * 2, b * 2] }\n[x, y] = pair(3, 7)\n>> x ¶\n>> y ¶' },
  ],
  'Error !?': [
    { title: 'Basic try',      code: '!? {\n    >> "try block" ¶\n} :! {\n    >> "catch block" ¶\n} :> {\n    >> "finally block" ¶\n}' },
    { title: 'Catch error',    code: 'arr = [1, 2, 3]\n!? {\n    x = arr[100]\n    >> "no error" ¶\n} :! {\n    >> "caught index error" ¶\n} :> {\n    >> "cleanup done" ¶\n}' },
    { title: 'Division ##Div', code: '!? {\n    result = 10 / 0\n    >> result ¶\n} :! ##Div {\n    >> "division by zero!" ¶\n}' },
    { title: 'Typed catches',  code: 'arr = [1]\n!? {\n    x = arr[50]\n} :! ##IO {\n    >> "io error" ¶\n} :! ##Network {\n    >> "network error" ¶\n} :! {\n    >> "other error: " _err ¶\n}\n>> "done" ¶' },
    { title: 'Finally always', code: '!? {\n    >> "try" ¶\n    x = 1 / 0\n} :! {\n    >> "catch" ¶\n} :> {\n    >> "finally — always runs" ¶\n}' },
    { title: 'Error check $!', code: 'x = 42\n? x$! {\n    >> "x is error" ¶\n} _ {\n    >> "x is not error" ¶\n}' },
  ],
  'Numerals 🔢': [
    { title: 'Mode switch intro',
      code: '// Numeral mode switch — same value, four scripts\n\nx = 42\n>> "ASCII:      " x ¶\n\n#०९#\n>> "Devanagari: " x ¶\n\n#๐๙#\n>> "Thai:       " x ¶\n\n#𝟎𝟗#\n>> "Math Bold:  " x ¶\n\n#09#  // reset\n>> "ASCII again: " x ¶' },

    { title: 'Booleans in scripts',
      code: '// Booleans output with # prefix + active script digit\n\na = 42\nb = 10\n\n// ASCII (default)\n>> a > b ¶      // → #1\n>> b > a ¶      // → #0\n\n#०९#  // Devanagari\n>> a > b ¶      // → #१\n>> b > a ¶      // → #०\n\n#๐๙#  // Thai\n>> a > b ¶      // → #๑\n>> b > a ¶      // → #๐\n\n#09#            // reset' },

    { title: 'Math Bold 𝟎𝟏𝟐',
      code: '// Numerals: Mathematical Bold (U+1D7CE\u2013U+1D7D7)\n// Loop and output in bold digit style.\n\n>> "Mathematical Bold numerals:" ¶\n\n#𝟎𝟗#\n\n@ i:𝟏..𝟏𝟓 {\n    >> i " "\n}\n>> ¶\n\n// Boolean output in bold:\n>> 𝟓 > 𝟑 ¶\n>> 𝟑 > 𝟓 ¶\n\n#09#  // reset to ASCII' },

    { title: 'LCD 🯰🯱🯲',
      code: '// Numerals: Segmented/LCD (U+1FBF0\u2013U+1FBF9)\n// Classic 7-segment display style.\n\n>> "LCD display mode:" ¶\n\n#🯰🯹#\n\n@ i:🯱..🯹 {\n    >> i " "\n}\n>> ¶\n\n// Arithmetic:\n>> 🯳 + 🯴 ¶\n>> 🯹 * 🯹 ¶\n\n#09#  // reset to ASCII' },
  ],
  'RosettaStone 🪨': [
    { title: '🌍 Emoji',  code: '// FizzBuzz — 🌍 Universal Emoji\n// Identifiers: emojis. Operators: always symbolic. Output: emojis.\n\n>> "👋🌍✨" ¶\n\n🎯(🔢) {\n    ? 🔢 % 15 == 0 { <~ "🫧🐝" }\n    _? 🔢 % 3  == 0 { <~ "🫧" }\n    _? 🔢 % 5  == 0 { <~ "🐝" }\n    _ { <~ 🔢 }\n}\n\n@ i:1..15 {\n    >> 🎯(i) ¶\n}' },
    { title: 'English',   code: '// FizzBuzz — English\n// Identifiers in English. Operators always symbolic.\n\n>> "Hello, English-speaking World!" ¶\n\nclassify(number) {\n    ? number % 15 == 0 { <~ "FizzBuzz" }\n    _? number % 3  == 0 { <~ "Fizz" }\n    _? number % 5  == 0 { <~ "Buzz" }\n    _ { <~ number }\n}\n\n@ i:1..15 {\n    >> classify(i) ¶\n}' },
    { title: 'Español',   code: '// FizzBuzz — Español\n// Identificadores en español. Operadores siempre simbólicos.\n\n>> "¡Hola, Mundo Hispanohablante!" ¶\n\nclasificar(número) {\n    ? número % 15 == 0 { <~ "BurbujaZumbido" }\n    _? número % 3  == 0 { <~ "Burbuja" }\n    _? número % 5  == 0 { <~ "Zumbido" }\n    _ { <~ número }\n}\n\n@ i:1..15 {\n    >> clasificar(i) ¶\n}' },
    { title: '한국어 — Korean',     code: '// FizzBuzz — 한국어\n// 식별자는 한국어로. 연산자는 항상 기호.\n\n>> "안녕하세요, 한국어 세계!" ¶\n\n분류(숫자) {\n    ? 숫자 % 15 == 0 { <~ "쉬익붕붕" }\n    _? 숫자 % 3  == 0 { <~ "쉬익" }\n    _? 숫자 % 5  == 0 { <~ "붕붕" }\n    _ { <~ 숫자 }\n}\n\n@ 이:1..15 {\n    >> 분류(이) ¶\n}' },
    { title: 'Ελληνικά — Greek', code: '// FizzBuzz — Ελληνικά\n// Αναγνωριστικά στα ελληνικά. Τελεστές πάντα συμβολικοί.\n\n>> "Γεια σου, ελληνόφωνε κόσμε!" ¶\n\nταξινόμηση(αριθμός) {\n    ? αριθμός % 15 == 0 { <~ "ΑφρόςΒόμβος" }\n    _? αριθμός % 3  == 0 { <~ "Αφρός" }\n    _? αριθμός % 5  == 0 { <~ "Βόμβος" }\n    _ { <~ αριθμός }\n}\n\n@ ι:1..15 {\n    >> ταξινόμηση(ι) ¶\n}' },
    { title: 'العربية — Arabic',  code: '// FizzBuzz — العربية\n// المعرّفات بالعربية. الأرقام عربية-هندية (٠–٩).\n\n>> "مرحباً، عالم ناطق بالعربية!" ¶\n\n#٠٩#\n\nتصنيف(عدد) {\n    ? عدد % ١٥ == ٠ { <~ "فقاعةطنين" }\n    _? عدد % ٣  == ٠ { <~ "فقاعة" }\n    _? عدد % ٥  == ٠ { <~ "طنين" }\n    _ { <~ عدد }\n}\n\n@ ن:١..١٥ {\n    >> تصنيف(ن) ¶\n}' },
    { title: '中文 — Chinese',     code: '// FizzBuzz — 中文（普通话）\n// 标识符用中文。运算符始终是符号。\n\n>> "你好，中文世界！" ¶\n\n分类(数字) {\n    ? 数字 % 15 == 0 { <~ "嘶嘶嗡嗡" }\n    _? 数字 % 3  == 0 { <~ "嘶嘶" }\n    _? 数字 % 5  == 0 { <~ "嗡嗡" }\n    _ { <~ 数字 }\n}\n\n@ 数:1..15 {\n    >> 分类(数) ¶\n}' },
    { title: 'हिन्दी — Hindi',  code: '// FizzBuzz — हिन्दी\n// पहचानकर्ता हिन्दी में। अंक देवनागरी (०–९)।\n\n>> "नमस्ते, हिन्दी भाषी दुनिया!" ¶\n\n#०९#\n\nवर्गीकरण(संख्या) {\n    ? संख्या % १५ == ० { <~ "बुलबुलाभनभन" }\n    _? संख्या % ३  == ० { <~ "बुलबुला" }\n    _? संख्या % ५  == ० { <~ "भनभन" }\n    _ { <~ संख्या }\n}\n\n@ न:१..१५ {\n    >> वर्गीकरण(न) ¶\n}' },
    { title: '日本語 — Japanese',   code: '// FizzBuzz — 日本語\n// 識別子はひらがなで。演算子は常にシンボル。\n\n>> "こんにちは、日本語の世界！" ¶\n\nぶんるい(かず) {\n    ? かず % 15 == 0 { <~ "シュワブーン" }\n    _? かず % 3  == 0 { <~ "シュワ" }\n    _? かず % 5  == 0 { <~ "ブーン" }\n    _ { <~ かず }\n}\n\n@ い:1..15 {\n    >> ぶんるい(い) ¶\n}' },
    { title: 'Русский — Russian', code: '// FizzBuzz — Русский\n// Идентификаторы на русском. Операторы всегда символьные.\n\n>> "Привет, русскоязычный мир!" ¶\n\nтип(число) {\n    ? число % 15 == 0 { <~ "ШипЖуж" }\n    _? число % 3  == 0 { <~ "Шип" }\n    _? число % 5  == 0 { <~ "Жуж" }\n    _ { <~ число }\n}\n\n@ и:1..15 {\n    >> тип(и) ¶\n}' },
    { title: 'עברית — Hebrew',   code: '// FizzBuzz — עברית\n// מזהים בעברית. אופרטורים תמיד סמליים.\n\n>> "שלום, עולם דובר עברית!" ¶\n\nסיווג(מספר) {\n    ? מספר % 15 == 0 { <~ "בועהזמזום" }\n    _? מספר % 3  == 0 { <~ "בועה" }\n    _? מספר % 5  == 0 { <~ "זמזום" }\n    _ { <~ מספר }\n}\n\n@ נ:1..15 {\n    >> סיווג(נ) ¶\n}' },
    { title: 'ภาษาไทย — Thai', code: '// FizzBuzz — ภาษาไทย\n// ตัวระบุเป็นภาษาไทย ตัวเลขไทย (๐–๙).\n\n>> "สวัสดี โลกที่พูดภาษาไทย!" ¶\n\n#๐๙#\n\nจำแนก(จำนวน) {\n    ? จำนวน % ๑๕ == ๐ { <~ "ฟองวิ้ง" }\n    _? จำนวน % ๓  == ๐ { <~ "ฟอง" }\n    _? จำนวน % ๕  == ๐ { <~ "วิ้ง" }\n    _ { <~ จำนวน }\n}\n\n@ น:๑..๑๕ {\n    >> จำแนก(น) ¶\n}' },
    { title: 'ქართული — Georgian', code: '// FizzBuzz — ქართული\n// იდენტიფიკატორები ქართულად. ოპერატორები ყოველთვის სიმბოლური.\n\n>> "გამარჯობა, სამყარო!" ¶\n\nდახარისხება(რიცხვი) {\n    ? რიცხვი % 15 == 0 { <~ "ბუშტიჟრჟოლა" }\n    _? რიცხვი % 3  == 0 { <~ "ბუშტი" }\n    _? რიცხვი % 5  == 0 { <~ "ჟრჟოლა" }\n    _ { <~ რიცხვი }\n}\n\n@ ი:1..15 {\n    >> დახარისხება(ი) ¶\n}' },
    { title: 'Հայերեն — Armenian', code: '// FizzBuzz — Հայերեն\n// Նույնացուցիչներ հայերենով։ Օպերատորները միշտ խորհրդանշական։\n\n>> "Բարև, Աշխարհ!" ¶\n\nդասակարգել(թիվ) {\n    ? թիվ % 15 == 0 { <~ "ՊղպջակԲզզոց" }\n    _? թիվ % 3  == 0 { <~ "Պղպջակ" }\n    _? թիվ % 5  == 0 { <~ "Բզզոց" }\n    _ { <~ թիվ }\n}\n\n@ ն:1..15 {\n    >> դասակարգել(ն) ¶\n}' },
    { title: 'বাংলা — Bengali',   code: '// FizzBuzz — বাংলা\n// বাংলায় পরিচয়কারক। অঙ্ক বাংলা (০–৯)।\n\n>> "নমস্কার, বাংলাভাষী বিশ্ব!" ¶\n\n#০৯#\n\nশ্রেণীবিভাগ(সংখ্যা) {\n    ? সংখ্যা % ১৫ == ০ { <~ "বুদবুদভনভন" }\n    _? সংখ্যা % ৩  == ০ { <~ "বুদবুদ" }\n    _? সংখ্যা % ৫  == ০ { <~ "ভনভন" }\n    _ { <~ সংখ্যা }\n}\n\n@ ন:১..১৫ {\n    >> শ্রেণীবিভাগ(ন) ¶\n}' },
    { title: 'தமிழ் — Tamil',  code: '// FizzBuzz — தமிழ்\n// தமிழில் அடையாளங்காட்டிகள். இயக்கிகள் எப்போதும் குறியீட்டு.\n\n>> "வணக்கம், உலகம்!" ¶\n\nவகைப்படுத்து(எண்) {\n    ? எண் % 15 == 0 { <~ "குமிழ்சத்தம்" }\n    _? எண் % 3  == 0 { <~ "குமிழ்" }\n    _? எண் % 5  == 0 { <~ "சத்தம்" }\n    _ { <~ எண் }\n}\n\n@ ந:1..15 {\n    >> வகைப்படுத்து(ந) ¶\n}' },
    { title: 'አማርኛ — Amharic',  code: '// FizzBuzz — አማርኛ\n// መለያዎች በአማርኛ። ኦፕሬተሮች ሁልጊዜ ምሳሌያዊ።\n\n>> "ሰላም፣ አማርኛ ተናጋሪ ዓለም!" ¶\n\nምደባ(ቁጥር) {\n    ? ቁጥር % 15 == 0 { <~ "ቡርቡርዝምዝም" }\n    _? ቁጥር % 3  == 0 { <~ "ቡርቡር" }\n    _? ቁጥር % 5  == 0 { <~ "ዝምዝም" }\n    _ { <~ ቁጥር }\n}\n\n@ ን:1..15 {\n    >> ምደባ(ን) ¶\n}' },

    { title: 'தமிழ் ௦-௯ — Tamil 2',
      code: '// FizzBuzz — தமிழ் + Tamil numerals (௦-௯)\n// Loop range, modulo checks, and output all use Tamil digits.\n\n>> "வணக்கம், தமிழ் உலகம்!" ¶\n\n#௦௯#\n\nவகைப்படுத்தல்(எண்) {\n    ? எண் % ௧௫ == ௦ { <~ "குமிழிசலசலப்பு" }\n    _? எண் % ௩  == ௦ { <~ "குமிழி" }\n    _? எண் % ௫  == ௦ { <~ "சலசலப்பு" }\n    _ { <~ எண் }\n}\n\n@ ந:௧..௧௫ {\n    >> வகைப்படுத்தல்(ந) ¶\n}' },

    { title: 'తెలుగు — Telugu',
      code: '// FizzBuzz — తెలుగు + Telugu numerals (౦-౯)\n// Loop range, modulo checks, and output all use Telugu digits.\n\n>> "నమస్కారం, తెలుగు ప్రపంచం!" ¶\n\n#౦౯#\n\nవర్గీకరణ(సంఖ్య) {\n    ? సంఖ్య % ౧౫ == ౦ { <~ "బుడగగుయ్యి" }\n    _? సంఖ్య % ౩  == ౦ { <~ "బుడగ" }\n    _? సంఖ్య % ౫  == ౦ { <~ "గుయ్యి" }\n    _ { <~ సంఖ్య }\n}\n\n@ న:౧..౧౫ {\n    >> వర్గీకరణ(న) ¶\n}' },

    { title: 'ਪੰਜਾਬੀ — Gurmukhi',
      code: '// FizzBuzz — ਪੰਜਾਬੀ + Gurmukhi numerals (੦-੯)\n// Loop range, modulo checks, and output all use Gurmukhi digits.\n\n>> "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਪੰਜਾਬੀ ਦੁਨੀਆ!" ¶\n\n#੦੯#\n\nਵਰਗੀਕਰਨ(ਸੰਖਿਆ) {\n    ? ਸੰਖਿਆ % ੧੫ == ੦ { <~ "ਬੁਲਬੁਲਾਗੂੰਜ" }\n    _? ਸੰਖਿਆ % ੩  == ੦ { <~ "ਬੁਲਬੁਲਾ" }\n    _? ਸੰਖਿਆ % ੫  == ੦ { <~ "ਗੂੰਜ" }\n    _ { <~ ਸੰਖਿਆ }\n}\n\n@ ਨ:੧..੧੫ {\n    >> ਵਰਗੀਕਰਨ(ਨ) ¶\n}' },

    { title: 'မြန်မာ — Myanmar',
      code: '// FizzBuzz — မြန်မာ + Myanmar numerals (၀-၉)\n// Loop range, modulo checks, and output all use Myanmar digits.\n\n>> "မင်္ဂလာပါ မြန်မာဘာသာပြောသူများ!" ¶\n\n#၀၉#\n\nခွဲခြားသတ်မှတ်(နံပါတ်) {\n    ? နံပါတ် % ၁၅ == ၀ { <~ "ဖုပ်ဗုန်း" }\n    _? နံပါတ် % ၃  == ၀ { <~ "ဖုပ်" }\n    _? နံပါတ် % ၅  == ၀ { <~ "ဗုန်း" }\n    _ { <~ နံပါတ် }\n}\n\n@ ည:၁..၁၅ {\n    >> ခွဲခြားသတ်မှတ်(ည) ¶\n}' },

    { title: ' — Klingon pIqaD',
      code: "// FizzBuzz \u2014 \uf8e4\uf8d7\uf8dc\uf8d0\uf8db \uf8de\uf8d7\uf8df\uf8d0\uf8d3\n// pIqaD digits: CSUR PUA U+F8F0\u2013U+F8F9\n// pIqaD letters: CSUR PUA U+F8D0\u2013U+F8EF\n// Requires a pIqaD font (e.g. pIqaD-qolqoS) to render visually.\n\n#\uf8f0\uf8f9#\n\n>> \"\uf8db\uf8e5\uf8df\uf8db\uf8d4\uf8d6\" \u00b6\n\n\uf8e7\uf8d7\uf8e6(\uf8da\uf8d7\uf8e9) {\n    ? \uf8da\uf8d7\uf8e9 % \uf8f1\uf8f5 == 0 { <~ \"\uf8e0\uf8d0\uf8de\uf8d9\uf8d0\uf8e9\uf8d6\uf8dd\uf8d6\" }\n    _? \uf8da\uf8d7\uf8e9 % \uf8f3  == 0 { <~ \"\uf8e0\uf8d0\uf8de\uf8d9\uf8d0\uf8e9\" }\n    _? \uf8da\uf8d7\uf8e9 % \uf8f5  == 0 { <~ \"\uf8d6\uf8dd\uf8d6\" }\n    _ { <~ \uf8da\uf8d7\uf8e9 }\n}\n\n@ \uf8d3:\uf8f1..\uf8f1\uf8f5 {\n    >> \uf8e7\uf8d7\uf8e6(\uf8d3) \u00b6\n}" },
  ],

  'Modules <#': [
    {
      title: 'Matemáticas',
      files: [
        {
          name: 'matematicas.zy',
          code:
`# matematicas {
    #> { sumar, restar, multiplicar, dividir, potencia, factorial, PI }

    PI := 3.14159265

    sumar(a, b)       { <~ a + b }
    restar(a, b)      { <~ a - b }
    multiplicar(a, b) { <~ a * b }
    dividir(a, b)     { <~ a / b }
    potencia(b, e)    { <~ b ^ e }

    factorial(n) {
        ? n <= 1 { <~ 1 }
        <~ n * factorial(n - 1)
    }
}`
        },
        {
          name: 'calculadora.zy',
          code:
`<# ./matematicas => mat

>> "=== Módulos en Zymbol ===" ¶
¶

>> "Aritmética básica:" ¶
>> "  15 + 8  = " mat::sumar(15, 8) ¶
>> "  15 − 8  = " mat::restar(15, 8) ¶
>> "  6 × 7   = " mat::multiplicar(6, 7) ¶
>> "  22 / 7  = " mat::dividir(22, 7) ¶
¶

>> "  PI = " mat.PI ¶
¶

>> "Factoriales 1..8:" ¶
@ n:1..8 {
    >> "  " n "! = " mat::factorial(n) ¶
}
¶

>> "Potencias de 2:" ¶
@ i:0..5 {
    exp = i + 1
    >> "  2^" exp " = " mat::potencia(2, exp) ¶
}`
        },
      ],
    },
    {
      title: 'i18n — Ελληνικά',
      files: [
        {
          name: 'module.zy',
          code:
`# module {
    #> {
        sumar
        restar
        multiplicar
        dividir
        PI
        E
    }

    PI := 3.14159
    E  := 2.71828

    sumar(a, b)        { <~ a + b }
    restar(a, b)       { <~ a - b }
    multiplicar(a, b)  { <~ a * b }
    dividir(a, b)      { <~ a / b }
}`
        },
        {
          name: 'ελληνικά.zy',
          code:
`# ελληνικά {
    <# ./module => mat

    #> {
        mat::sumar       => προσθέτω
        mat::restar      => αφαιρώ
        mat::multiplicar => πολλαπλασιάζω
        mat::dividir     => διαιρώ
        mat.PI           => ΠΙ
        mat.E            <= Ε
    }
}`
        },
        {
          name: 'Ελληνική_εφαρμογή.zy',
          code:
`<# ./ελληνικά : μαθ

αποτέλεσμα = μαθ::προσθέτω(10, 5)
διαφορά    = μαθ::αφαιρώ(10, 5)
γινόμενο   = μαθ::πολλαπλασιάζω(10, 5)
διαίρεση   = μαθ::διαιρώ(10, 5)
πι_τιμή    = μαθ.ΠΙ
ε_τιμή     = μαθ.Ε

>> "Άθροισμα: " αποτέλεσμα ¶
>> "Διαφορά: "  διαφορά    ¶
>> "Γινόμενο: " γινόμενο   ¶
>> "Διαίρεση: " διαίρεση   ¶
>> "Πι: "       πι_τιμή    ¶
>> "Ε: "        ε_τιμή     ¶`
        },
      ],
    },
    {
      title: 'i18n — עִברִית',
      files: [
        {
          name: 'module.zy',
          code:
`# module {
    #> {
        sumar
        restar
        multiplicar
        dividir
        PI
        E
    }

    PI := 3.14159
    E  := 2.71828

    sumar(a, b)        { <~ a + b }
    restar(a, b)       { <~ a - b }
    multiplicar(a, b)  { <~ a * b }
    dividir(a, b)      { <~ a / b }
}`
        },
        {
          name: 'עִברִית.zy',
          code:
`# עִברִית {
    <# ./module => mat

    #> {
        mat::sumar       => חיבור
        mat::restar      => חיסור
        mat::multiplicar => כפל
        mat::dividir     => חילוק
        mat.PI           => פאי
        mat.E            <= אי
    }
}`
        },
        {
          name: 'אפליקציית_מתמטיקה.zy',
          code:
`<# ./עִברִית : מתמטיקה

תוצאה   = מתמטיקה::חיבור(10, 5)
הפרש    = מתמטיקה::חיסור(10, 5)
מכפלה   = מתמטיקה::כפל(10, 5)
חלוקה   = מתמטיקה::חילוק(10, 5)
ערך_פאי = מתמטיקה.פאי
ערך_אי  = מתמטיקה.אי

>> "סכום: "  תוצאה   ¶
>> "הפרש: "  הפרש    ¶
>> "מכפלה: " מכפלה   ¶
>> "חלוקה: " חלוקה   ¶
>> "פאי: "   ערך_פאי ¶
>> "אי: "    ערך_אי  ¶`
        },
      ],
    },
    {
      title: 'i18n — 中文',
      files: [
        {
          name: 'module.zy',
          code:
`# module {
    #> {
        sumar
        restar
        multiplicar
        dividir
        PI
        E
    }

    PI := 3.14159
    E  := 2.71828

    sumar(a, b)        { <~ a + b }
    restar(a, b)       { <~ a - b }
    multiplicar(a, b)  { <~ a * b }
    dividir(a, b)      { <~ a / b }
}`
        },
        {
          name: '中文.zy',
          code:
`# 中文 {
    <# ./module => mat

    #> {
        mat::sumar       => 相加
        mat::restar      => 相减
        mat::multiplicar => 相乘
        mat::dividir     => 相除
        mat.PI           => 圆周率
        mat.E            <= 自然常数
    }
}`
        },
        {
          name: '中文_应用.zy',
          code:
`<# ./中文 : 数学

结果   = 数学::相加(10, 5)
差值   = 数学::相减(10, 5)
乘积   = 数学::相乘(10, 5)
商值   = 数学::相除(10, 5)
圆周率 = 数学.圆周率
自然数 = 数学.自然常数

>> "和：" 结果   ¶
>> "差：" 差值   ¶
>> "积：" 乘积   ¶
>> "商：" 商值   ¶
>> "π：" 圆周率 ¶
>> "e：" 自然数 ¶`
        },
      ],
    },
    {
      title: 'i18n — 한국인',
      files: [
        {
          name: 'module.zy',
          code:
`# module {
    #> {
        sumar
        restar
        multiplicar
        dividir
        PI
        E
    }

    PI := 3.14159
    E  := 2.71828

    sumar(a, b)        { <~ a + b }
    restar(a, b)       { <~ a - b }
    multiplicar(a, b)  { <~ a * b }
    dividir(a, b)      { <~ a / b }
}`
        },
        {
          name: '한국인.zy',
          code:
`# 한국인 {
    <# ./module => mat

    #> {
        mat::sumar       => 더하다
        mat::restar      => 빼다
        mat::multiplicar => 곱하다
        mat::dividir     => 나누다
        mat.PI           => 파이
        mat.E            <= 이
    }
}`
        },
        {
          name: '한국_앱.zy',
          code:
`<# ./한국인 : 수학

결과    = 수학::더하다(10, 5)
차이    = 수학::빼다(10, 5)
곱셈    = 수학::곱하다(10, 5)
나눗셈  = 수학::나누다(10, 5)
원주율  = 수학.파이
자연상수 = 수학.이

>> "합계: "    결과     ¶
>> "차이: "    차이     ¶
>> "곱셈: "    곱셈     ¶
>> "나눗셈: "  나눗셈   ¶
>> "파이: "    원주율   ¶
>> "자연상수: " 자연상수 ¶`
        },
      ],
    },
  ],

  'TUI >>|': [
    {
      title: 'Hola TUI',
      code:
`>>| {
    [filas, cols] = >>?
    >>~ (1, 1) > "Canvas TUI activo"
    >>~ (2, 1) > "Tamaño: " filas " filas × " cols " cols"
    >>~ (4, 1, 1, 10, 0) > "NEGRITA VERDE"
    >>~ (5, 1, 2, 11, 0) > "CURSIVA CIAN"
    >>~ (6, 1, 4, 12, 0) > "SUBRAYADO ROJO"
    >>~ (8, 1) > "Presiona una tecla para salir..."
    <<| k
    >>~ (9, 1) > "Tecla: " k
    @~ 1000
}`,
    },
    {
      title: 'Serpiente',
      files: [
        {
          name: 'logica.zy',
          code:
`// Serpiente — lógica del juego: movimiento, colisiones, spawn de comida
// AN = ancho interior del tablero, AL = alto interior del tablero
// Aleatorio: LCG (Numerical Recipes) implementado en Zymbol puro.
# logica {
    #> { lcg_sig, rango_aleatorio, fruta_aleatoria, nueva_dir, nueva_comida, tick_comida, mover }

    // Avanza la semilla un paso: LCG Numerical Recipes
    lcg_sig(semilla) {
        <~ (1664525 * semilla + 1013904223) % 2147483647
    }

    // Entero aleatorio en [min, max] — retorna (valor, semilla_siguiente)
    rango_aleatorio(semilla, min, max) {
        sig = lcg_sig(semilla)
        val = sig % (max - min + 1) + min
        <~ (val, sig)
    }

    // Emoji de fruta aleatorio — retorna (emoji, semilla_siguiente)
    fruta_aleatoria(semilla) {
        frutas = ["🍎", "🍊", "🍋", "🍇", "🍓", "🫐", "🍑", "🥝", "🍒", "🍉"]
        [ind, s1] = rango_aleatorio(semilla, 1, 10)
        <~ (frutas[ind], s1)
    }

    // Genera posición de comida sin superponerse con la serpiente
    nueva_comida(serpiente, AN, AL, semilla) {
        [r, s1] = rango_aleatorio(semilla, 2, AL + 1)
        [c, s2] = rango_aleatorio(s1,     2, AN)
        pos = (r, c)
        ? _en_serpiente(serpiente, pos) {
            [r, s1] = rango_aleatorio(s2, 2, AL + 1)
            [c, s2] = rango_aleatorio(s1, 2, AN)
            pos = (r, c)
        }
        <~ (pos, s2)
    }

    // Genera nueva comida y fruta solo si comio=#1
    tick_comida(comio, serpiente, AN, AL, semilla, comida, fruta) {
        ? !comio { <~ (comida, fruta, semilla) }
        [npos, s1] = nueva_comida(serpiente, AN, AL, semilla)
        [nfru, s2] = fruta_aleatoria(s1)
        <~ (npos, nfru, s2)
    }

    // Mapea tecla cruda a dirección interna
    nueva_dir(tecla, dir) {
        nueva = dir
        ? tecla == 'w' || tecla == '↑' { nueva = '↑' }
        ? tecla == 's' || tecla == '↓' { nueva = '↓' }
        ? tecla == 'a' || tecla == '←' { nueva = '←' }
        ? tecla == 'd' || tecla == '→' { nueva = '→' }
        inverso = #0
        ? dir == '↑' && nueva == '↓' { inverso = #1 }
        ? dir == '↓' && nueva == '↑' { inverso = #1 }
        ? dir == '←' && nueva == '→' { inverso = #1 }
        ? dir == '→' && nueva == '←' { inverso = #1 }
        ? inverso { <~ dir }
        <~ nueva
    }

    _en_serpiente(serpiente, pos) {
        i = 1
        @ i <= serpiente$# {
            ? serpiente[i] == pos { <~ #1 }
            i++
        }
        <~ #0
    }

    // Avanza la serpiente un paso
    // crecer=#1 → hay crecimiento diferido del tick anterior (cola se queda)
    // Retorna (vivo, serpiente, puntos, comio)
    mover(serpiente, dir, comida, puntos, AN, AL, crecer) {
        [fr_cab, fc_cab] = serpiente[1]
        nf = fr_cab
        nc = fc_cab
        ? dir == '↑' { nf = fr_cab - 1 }
        ? dir == '↓' { nf = fr_cab + 1 }
        ? dir == '←' { nc = fc_cab - 1 }
        ? dir == '→' { nc = fc_cab + 1 }
        cab = (nf, nc)
        ? nf < 2 || nf > AL+1 || nc < 2 || nc > AN+1 {
            <~ (#0, serpiente, puntos, #0)
        }
        [fr_com, fc_com] = comida
        comio = cab == comida || cab == (fr_com, fc_com + 1)
        lon = serpiente$#
        limite = lon - 1
        ? crecer { limite = lon }
        i = 1
        @ i <= limite {
            ? serpiente[i] == cab { <~ (#0, serpiente, puntos, #0) }
            i++
        }
        serpiente = serpiente$+[1] cab
        ? comio { puntos = puntos + 1 }
        ? !crecer { serpiente = serpiente$-[-1] }
        <~ (#1, serpiente, puntos, comio)
    }
}`,
        },
        {
          name: 'dibujo.zy',
          code:
`// Serpiente — renderizado: tablero, serpiente, comida, marcador, pantallas
# dibujo {
    #> { menu_velocidad, dibujar_inicio, dibujar, fin_juego, pausa }

    BORDE  := 8
    VERDE  := 10
    CABEZA := 2
    COMIDA := 11
    ROJO   := 9
    TEXTO  := 15

    _linea_h(n) { <~ "─" $* n }

    _dir_hacia(origen, destino) {
        [or, oc] = origen
        [dr, dc] = destino
        ? dc > oc { <~ 'R' }
        ? dc < oc { <~ 'L' }
        ? dr < or { <~ 'U' }
        <~ 'D'
    }

    _char_cabeza(cab, cuerpo) {
        d = _dir_hacia(cuerpo, cab)
        ? d == 'R' { <~ "▶" }
        ? d == 'L' { <~ "◀" }
        ? d == 'U' { <~ "▲" }
        <~ "▼"
    }

    _char_cuerpo(ant, pos, sig) {
        da = _dir_hacia(pos, ant)
        ds = _dir_hacia(pos, sig)
        ? (da == 'R' && ds == 'L') || (da == 'L' && ds == 'R') { <~ "─" }
        ? (da == 'U' && ds == 'D') || (da == 'D' && ds == 'U') { <~ "│" }
        ? (da == 'R' && ds == 'D') || (da == 'D' && ds == 'R') { <~ "╭" }
        ? (da == 'L' && ds == 'D') || (da == 'D' && ds == 'L') { <~ "╮" }
        ? (da == 'R' && ds == 'U') || (da == 'U' && ds == 'R') { <~ "╰" }
        <~ "╯"
    }

    _char_cola(penultimo, cola) {
        d = _dir_hacia(penultimo, cola)
        ? d == 'R' || d == 'L' { <~ "─" }
        <~ "│"
    }

    _marcador(puntos, AN) {
        col_m = AN / 2 - 7
        >>~ (1, col_m, 0,      8) > "┤"
        >>~ (1, col_m + 1, 0, 14) > " ✦ PUNTOS "
        >>~ (1, col_m + 10, 0, 11) > puntos
        >>~ (1, col_m + 12, 0, 14) > " ✦ "
        >>~ (1, col_m + 15, 0,  8) > "├"
    }

    menu_velocidad(AN, AL) {
        >>!
        fila_c = AL / 2 - 5
        col_c  = AN / 2 - 15
        sel = 1

        @:sel {
            >>~ (fila_c,    col_c, 0, TEXTO) > "╭──────────────────────────────╮"
            >>~ (fila_c+1,  col_c, 0, TEXTO) > "│        Z Y M B O L           │"
            >>~ (fila_c+2,  col_c, 0, TEXTO) > "│      S E R P I E N T E       │"
            >>~ (fila_c+3,  col_c, 0, TEXTO) > "├──────────────────────────────┤"
            >>~ (fila_c+4,  col_c, 0, TEXTO) > "│   Elige tu velocidad:        │"
            >>~ (fila_c+5,  col_c, 0, TEXTO) > "│                              │"
            >>~ (fila_c+6,  col_c, 0, 15)  > "│   [1]  Lento      160 ms     │"
            >>~ (fila_c+7,  col_c, 0, 15)  > "│   [2]  Normal     130 ms     │"
            >>~ (fila_c+8,  col_c, 0, 15)  > "│   [3]  Rápido     100 ms     │"
            >>~ (fila_c+9,  col_c, 0,  9)  > "│   [4]  Infernal    70 ms     │"
            >>~ (fila_c+10, col_c, 0, 201) > "│   [5]  Demencial   40 ms     │ "
            >>~ (fila_c+11, col_c, 0, TEXTO) > "╰──────────────────────────────╯"
            ? sel == 1 { >>~ (fila_c+6,  col_c, 0, 10) > "│ ► [1]  Lento      160 ms     │" }
            ? sel == 2 { >>~ (fila_c+7,  col_c, 0, 10) > "│ ► [2]  Normal     130 ms     │" }
            ? sel == 3 { >>~ (fila_c+8,  col_c, 0, 10) > "│ ► [3]  Rápido     100 ms     │" }
            ? sel == 4 { >>~ (fila_c+9,  col_c, 0, 10) > "│ ► [4]  Infernal    70 ms     │" }
            ? sel == 5 { >>~ (fila_c+10, col_c, 0, 10) > "│ ► [5]  Demencial   40 ms     │" }
            <<| tecla
            ? tecla == '1' { <~ 160 }
            ? tecla == '2' { <~ 130 }
            ? tecla == '3' { <~ 100 }
            ? tecla == '4' { <~ 70  }
            ? tecla == '5' { <~ 40  }
            ? tecla == '\n' {
                ? sel == 1 { <~ 160 }
                ? sel == 2 { <~ 130 }
                ? sel == 3 { <~ 100 }
                ? sel == 4 { <~ 70  }
                ? sel == 5 { <~ 40  }
            }
            sel = _mover_sel(tecla, sel, 5)
        }
    }

    _ayuda(AN, AL) {
        >>!
        fila_c = AL / 2 - 7
        col_c  = AN / 2 - 15
        >>~ (fila_c,    col_c, 0, 2)  > "╭──────────────────────────────╮"
        >>~ (fila_c+1,  col_c, 0, 2)  > "│         A Y U D A            │"
        >>~ (fila_c+2,  col_c, 0, 2)  > "├──────────────────────────────┤"
        >>~ (fila_c+3,  col_c, 0, 11) > "│  Movimiento:                 │"
        >>~ (fila_c+4,  col_c, 0, 15) > "│    W / ↑   — arriba          │"
        >>~ (fila_c+5,  col_c, 0, 15) > "│    S / ↓   — abajo           │"
        >>~ (fila_c+6,  col_c, 0, 15) > "│    A / ←   — izquierda       │"
        >>~ (fila_c+7,  col_c, 0, 15) > "│    D / →   — derecha         │"
        >>~ (fila_c+8,  col_c, 0, 11) > "│  En partida:                 │"
        >>~ (fila_c+9,  col_c, 0, 15) > "│    Q       — salir           │"
        >>~ (fila_c+10, col_c, 0, 15) > "│    P       — pausar          │"
        >>~ (fila_c+11, col_c, 0, 11) > "│  Al comer: la serpiente crece│"
        >>~ (fila_c+12, col_c, 0, 15) > "│  por la cola en el siguiente │"
        >>~ (fila_c+13, col_c, 0, 15) > "│  tick de reloj.              │"
        >>~ (fila_c+14, col_c, 0, 2)  > "╰──────────────────────────────╯"
        >>~ (fila_c+16, col_c, 0, 0)  > "Presiona cualquier tecla..."
        <<| _tecla_cualquiera
    }

    pausa(AN, AL) {
        fila_c = AL / 2 - 2
        col_c  = AN / 2 - 10
        >>~ (fila_c,   col_c, 0, TEXTO) > "╭───────────────────╮"
        >>~ (fila_c+1, col_c, 0, TEXTO) > "│                   │"
        >>~ (fila_c+2, col_c, 0, TEXTO) > "│    P A U S A      │"
        >>~ (fila_c+3, col_c, 0, TEXTO) > "│                   │"
        >>~ (fila_c+4, col_c, 0, TEXTO) > "│  [P]  continuar   │"
        >>~ (fila_c+5, col_c, 0, TEXTO) > "╰───────────────────╯"
        @:espera {
            <<| tecla
            ? tecla == 'p' || tecla == 'P' { @:espera! }
        }
    }

    dibujar_inicio(serpiente, comida, fruta, puntos, AN, AL) {
        >>!
        >>~ (1, 1, 0, BORDE) > "╭" _linea_h(AN) "╮"
        >>~ (AL + 2, 1, 0, BORDE) > "╰" _linea_h(AN) "╯"
        fila = 2
        @ fila <= AL + 1 {
            >>~ (fila, 1, 0, BORDE) > "│"
            >>~ (fila, AN + 2, 0, BORDE) > "│"
            fila++
        }
        _marcador(puntos, AN)
        [fy, fx] = comida
        >>~ (fy, fx, 0, COMIDA) > fruta
        [hy, hx] = serpiente[1]
        >>~ (hy, hx, 0, CABEZA) > _char_cabeza(serpiente[1], serpiente[2])
        lon = serpiente$#
        i = 2
        @ i < lon {
            [sy, sx] = serpiente[i]
            >>~ (sy, sx, 0, VERDE) > _char_cuerpo(serpiente[i-1], serpiente[i], serpiente[i+1])
            i++
        }
        [ty, tx] = serpiente[lon]
        >>~ (ty, tx, 0, VERDE) > _char_cola(serpiente[lon-1], serpiente[lon])
    }

    dibujar(serpiente, cola_vieja, crecer, comio, comida_vieja, comida, fruta, puntos, AN, AL, pos_arroba) {
        [fy_cab, fx_cab] = serpiente[1]

        ? comio {
            [fvy, fvx] = comida_vieja
            >>~ (fvy, fvx, 0, 0) > "  "
            ? serpiente$# >= 3 {
                [py2, px2] = serpiente[2]
                >>~ (py2, px2, 0, 10) > _char_cuerpo(serpiente[1], serpiente[2], serpiente[3])
            }
            [ty, tx] = cola_vieja
            >>~ (ty, tx, 0, 0) > " "
            lon = serpiente$#
            [nty, ntx] = serpiente[lon]
            >>~ (nty, ntx, 0, 10) > _char_cola(serpiente[lon-1], serpiente[lon])
            [fy, fx] = comida
            >>~ (fy, fx, 0, 11) > fruta
        }

        ? crecer {
            [ay, ax] = pos_arroba
            >>~ (ay, ax, 0, 11) > "@"
        }

        ? !comio && !crecer {
            ? serpiente$# >= 3 {
                [py2, px2] = serpiente[2]
                >>~ (py2, px2, 0, 10) > _char_cuerpo(serpiente[1], serpiente[2], serpiente[3])
            }
            [ty, tx] = cola_vieja
            >>~ (ty, tx, 0, 0) > " "
            lon = serpiente$#
            [nty, ntx] = serpiente[lon]
            >>~ (nty, ntx, 0, 10) > _char_cola(serpiente[lon-1], serpiente[lon])
        }

        >>~ (fy_cab, fx_cab, 0, 2) > _char_cabeza(serpiente[1], serpiente[2])
        _marcador(puntos, AN)
    }

    _mover_sel(tecla, sel, max) {
        ? tecla == '↑' { ? sel > 1 { <~ sel - 1 } <~ max }
        ? tecla == '↓' { ? sel < max { <~ sel + 1 } <~ 1 }
        <~ sel
    }

    fin_juego(puntos, AN, AL) {
        fila_c = AL / 2 - 4
        col_c  = AN / 2 - 10
        sel = 1
        @:menu {
            >>!
            >>~ (fila_c,   col_c, 0, ROJO)  > "╭───────────────────╮"
            >>~ (fila_c+1, col_c, 0, ROJO)  > "│     J U E G O     │"
            >>~ (fila_c+2, col_c, 0, ROJO)  > "│   T E R M I N Ó   │"
            >>~ (fila_c+3, col_c, 0, ROJO)  > "╰───────────────────╯"
            >>~ (fila_c+5, col_c, 0, TEXTO) > "Puntaje final: " puntos "  "
            >>~ (fila_c+7, col_c, 0, 15) > "  Nuevo juego   "
            >>~ (fila_c+8, col_c, 0, 15) > "  Salir         "
            >>~ (fila_c+9, col_c, 0, 15) > "  Ayuda         "
            ? sel == 1 { >>~ (fila_c+7, col_c, 0, 10) > "► Nuevo juego   " }
            ? sel == 2 { >>~ (fila_c+8, col_c, 0, 10) > "► Salir         " }
            ? sel == 3 { >>~ (fila_c+9, col_c, 0, 10) > "► Ayuda         " }
            <<| tecla
            ? tecla == 'n' || tecla == 'N' { <~ 'n' }
            ? tecla == 's' || tecla == 'S' { <~ 's' }
            ? tecla == 'a' || tecla == 'A' { _ayuda(AN, AL) }
            ? tecla == '\n' {
                ? sel == 1 { <~ 'n' }
                ? sel == 2 { <~ 's' }
                ? sel == 3 { _ayuda(AN, AL) }
            }
            sel = _mover_sel(tecla, sel, 3)
        }
    }
}`,
        },
        {
          name: 'serpiente.zy',
          code:
`// Serpiente — juego clásico de serpiente en la terminal
// Controles: WASD o flechas — Q para salir — P para pausar

<# ./logica => l
<# ./dibujo => d

[filas, cols] = >>?
AN = cols  - 2
AL = filas - 2

fila_c = AL / 2 + 1
col_c  = AN / 2 + 1
ult_filas = filas
ult_cols  = cols

_ns  = <\\ "date +%N" \\>
_pid = <\\ "echo $$" \\>
_rnd = <\\ "od -An -N2 -tu2 /dev/urandom | tr -d ' \\n'" \\>
semilla = (#|_ns| + #|_pid| * 31337 + #|_rnd| * 65537) % 2147483647

>>| {
    retardo = d::menu_velocidad(AN, AL)

    @:main {
        serpiente = [(fila_c, col_c), (fila_c, col_c-1), (fila_c, col_c-2)]
        dir       = '→'
        puntos    = 0
        pendiente = #0

        [comida, semilla] = l::nueva_comida(serpiente, AN, AL, semilla)
        [fruta,  semilla] = l::fruta_aleatoria(semilla)

        d::dibujar_inicio(serpiente, comida, fruta, puntos, AN, AL)

        @:game {
            <<|? tecla

            [filas_act, cols_act] = >>?
            ? filas_act <> ult_filas || cols_act <> ult_cols {
                AN = cols_act - 2
                AL = filas_act - 2
                fila_c = AL / 2 + 1
                col_c  = AN / 2 + 1
                ult_filas = filas_act
                ult_cols  = cols_act
                @:main>
            }

            ? tecla == 'q' || tecla == 'Q' { @:game! }

            ? tecla == 'p' || tecla == 'P' {
                d::pausa(AN, AL)
                d::dibujar_inicio(serpiente, comida, fruta, puntos, AN, AL)
            }

            ? tecla <> '\\0' {
                dir = l::nueva_dir(tecla, dir)
            }

            cola_vieja   = serpiente[serpiente$#]
            comida_vieja = comida

            crecer = pendiente <> #0

            [vivo, serpiente, puntos, comio] = l::mover(serpiente, dir, comida, puntos, AN, AL, crecer)

            [comida, fruta, semilla] = l::tick_comida(comio, serpiente, AN, AL, semilla, comida, fruta)

            pos_arroba = pendiente
            ? crecer { pendiente = #0 }
            ? comio  { pendiente = serpiente[1] }

            ? !vivo { @:game! }

            d::dibujar(serpiente, cola_vieja, crecer, comio, comida_vieja, comida, fruta, puntos, AN, AL, pos_arroba)
            @~ retardo
        }

        accion = d::fin_juego(puntos, AN, AL)
        ? accion == 's' { @:main! }
    }
}`,
        },
      ],
    },
  ],

  'ARGS ><': [
    {
      title: 'Contador de args',
      args: 'hola mundo "tercer argumento"',
      code:
`>< args

>> "Argumentos recibidos: " args$# ¶

@ i:1..args$#:1 {
    >> "  [" i "] " args[i] ¶
}

? args$# == 0 {
    >> "— sin argumentos —" ¶
}`,
    },
    {
      title: 'Suma de números',
      args: '10 25 7 3',
      code:
`>< args

? args$# == 0 {
    >> "Uso: suma n1 n2 n3 ..." ¶
    <~ ()
}

total° = 0
@ i:1..args$#:1 {
    total° += #|args[i]|
}

>> "Suma de " args$# " números: " total ¶`,
    },
    {
      title: 'Saludo personalizado',
      args: 'Rakzo',
      code:
`>< args

nombre = ?? args {
    [] : "mundo"
    _  : args[1]
}
>> "¡Hola, " nombre "!" ¶`,
    },
  ],

  'SHELL <\\': [
    {
      title: 'Fecha y hora',
      code:
`// En CLI: ejecuta los comandos reales del sistema
// En el playground: devuelve un timestamp (nanosegundos desde epoch)

anio  = <\\ "date +%Y" \\>
mes   = <\\ "date +%m" \\>
dia   = <\\ "date +%d" \\>
hora  = <\\ "date +%H" \\>
min   = <\\ "date +%M" \\>
seg   = <\\ "date +%S" \\>

>> "Fecha : " anio "-" mes "-" dia ¶
>> "Hora  : " hora ":" min ":" seg ¶`,
    },
    {
      title: 'Semilla aleatoria',
      code:
`// <\\ cmd \\> devuelve un timestamp de alta resolución en el playground
// útil como semilla para generadores de números pseudoaleatorios

_ns  = <\\ "date +%N" \\>
_pid = <\\ "echo $$" \\>

semilla = (#|_ns| + #|_pid| * 31337) % 2147483647

// LCG — generador pseudoaleatorio
lcg(s) { <~ (1664525 * s + 1013904223) % 2147483647 }

s1 = lcg(semilla)
s2 = lcg(s1)
s3 = lcg(s2)

>> "Semilla inicial: " semilla ¶
>> "r1 = " s1 % 100 ¶
>> "r2 = " s2 % 100 ¶
>> "r3 = " s3 % 100 ¶`,
    },
    {
      title: 'Timestamp como ID',
      code:
`// Usar <\\ \\'> como fuente de entropía para IDs únicos

_t = <\\ "date +%N" \\>

id_sesion = #|_t| % 999999 + 100000

>> "ID de sesión: " id_sesion ¶
>> "Generado a las: " _t ¶`,
    },
  ],
};
