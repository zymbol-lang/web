> **Q'axaj:** We tzijob'al xuk'ut la' xub'an chuqa' xujalwachij rumal nimaläj taq etzelal (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Ri k'exoj k'olib'al pa **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** pa ri ruchob'enal ri k'ewal tzij.

---

# Wuj richin Zymbol-Lang

> **Sik'ixik richin v0.0.5 — 2026-05-16**

**Zymbol-Lang** jun ch'ab'äl rub'anikil program yetzelal. Majun k'utb'al tzij — ronojel yetzelal. Ruk'wan junam pa ronojel ch'ab'äl winaq.

- Majun `if`, `while`, `return` — xe `?`, `@`, `<~`
- Nojin Unicode — etal pa ronojel ch'ab'äl chi rij emoji
- Man junam ta ki' ch'ab'äl winaq — ri code junam pa ronojel lugar

**K'ewal tzij taq wuj**: v0.0.5 | **K'ixik titz'üj**: 436/436 (junalem TW ↔ VM)

---

## K'exta'yex chuqa' Man k'exta'yex ta

```zymbol
x = 10              // k'exta'yey k'exta'n
π := 3.14159        // man k'exta'n ta — chi ya' chik jun k'exta'yex are k'ayewal pa q'uya'l
ub'i' = "Alice"
k'ulel = #1         // boolean kitzij
👋 := "Utz"
```

```zymbol
x = 10    // 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 3    // 8
x %= 3    // 2
x ^= 2    // 4
x++        // 5
x--        // 4
```

`°` (k'utb'al grado, U+00B0) rutzijoj ri k'exta'yex pa kiq'a' pa rub'eyalil rub'eyal ri nabe' k'ulmataj:

```zymbol
taqaj = [3, 1, 4, 1, 5]
@ n:taqaj {
    °ronojel += n    // rutzijoj pa kiq'a' pa 0 chila' chwaq ri lo'p; k'aslik pa' ri @
}
>> ronojel ¶         // → 14
```

> `°x` (nab'e) k'ask'om chila' chwaq ri lo'p — ri k'ulmataj nik'atzin pa' ri `@`.
> `x°` (q'ajol) k'ask'om pa ri lo'p — kämik are k'is ri lo'p.
> Xe tree-walker.

---

## Ruk'isib'al taq Yes

| Yes | Utzij | K'utb'al `#?` | Tzijon |
|------|---------|----------|---------|
| Ajilab'al | `42`, `-7` | `###` | 64-bit kik'wan k'utb'al |
| P'upuyel | `3.14`, `1.5e10` | `##.` | Kik'wan rub'eyal tzijoxik |
| Tzijoxik | `"tzij"` | `##"` | K'ask'om: `"Utz {ub'i'}"` |
| Tzij | `'A'` | `##'` | Jun Unicode tzij |
| Boolean | `#1`, `#0` | `##?` | Man ta aj — `#1 ≠ 1` |
| Sib'alaj | `[1, 2, 3]` | `##]` | Junam taq yes |
| Tuple | `(a, b)` | `##)` | K'ojlib'äl |
| Tuple kik'wan ub'i' | `(x: 1, y: 2)` | `##)` | K'ojlib'äl kik'wan ub'i' |
| B'anob'äl | k'utunel b'anob'äl kik'wan ub'i' | `##()` | Nabe' mul — k'ut `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Nabe' mul — k'ut `<lambd/N>` |

```zymbol
// Titz'üj yes — k'ut (yes, taq aj, toq'ik)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Elb'anik chuqa' Okb'anik

```zymbol
>> "Utz" ¶                       // ¶ chi rij \\ richin jun k'ak'a' mul
>> "a=" a " b=" b ¶               // chupup — q'uiy taq toq'ik
>> (arr$#) ¶                      // b'anob'äl pa' q'ajol raj ( ) pa >>

>> ub'i'                           // sik'ij pa ri k'exta'yex (majun tzijon)
>> "Tatz'ib'aj ub'i': " ub'i'            // kik'wan tzijon
```

> `¶` (AltGr+R pa tecleo español) chuqa' `\\` junam taq mul.

---

## Ruwi' TUI

B'anob'äl tzijon richin k'ulmataj k'ojlib'äl richin program kik'wan chupam. E k'i' raj `>>| { }` (wächib'äl chik + b'eyalil wach).

```zymbol
>>| {
    >>!                             // tiz'aj ri wächib'äl chik
    >>~ (1, 1, 0, 10) > "K'ulel"   // mul 1, nim 1, fg=10 (rax)
    @~ 1000                         // k'ex 1 segundo (1000 ms)
    >>~ (2, 1) > "Xk'is."
}
// terminal k'ut k'ex pa kiq'a' are k'ax
```

```zymbol
// Toq'ik tz'apib'äl chuqa' nïm terminal
>>| {
    [mul, nim] = >>?              // ta richin nïm terminal
    >>~ (1, 1) > "Terminal: " mul " x " nim
    <<| tz'apib'äl                         // sik'ij toq'ik tz'apib'äl tikir
    >>~ (2, 1) > "Atz'apo: " tz'apib'äl
}
```

> `>>!` tiz'aj wächib'äl. `>>?` k'ut `[mul, nim]`. `@~ N` warim N milisegundo.
> `<<|` sik'ij jun toq'ik tz'apib'äl (tikir); `<<|?` na'oj chik majun tikir (k'ut `'\0'` we majun).
> Tuple elb'anik pa k'ojlib'äl: `(mul, nim, BKS, fg, bg)` — apxe'al chi k'ax na'owin che' ri coma (`>>~ (,,, 196) > "kaq"`).
> BKS bitmask: `1`=k'ask'om, `2`=tz'ukul, `4`=mul chi k'a. ANSI 256 b'onil (`0`=ruwi' terminal).
> Xe tree-walker (we ta `>>!`, `>>?`, `@~`, `>>~` k'ulel pa `--vm`).

---

## B'anob'äl

```zymbol
// Ajilab'al
a = 10
b = 3
n1 = a + b    // 13
n2 = a - b    // 7
n3 = a * b    // 30
n4 = a / b    // 3  (ajilab'al k'ayesaj)
n5 = a % b    // 1
n6 = a ^ b    // 1000  (k'ask'om)

// K'amoj — ya' richin na'oj
k1 = a == b    // #0
k2 = a <> b    // #1
k3 = a < b     // #0
k4 = a <= b    // #0
k5 = a > b     // #1
k6 = a >= b    // #1

// Chomab'al
ch1 = #1 && #0    // #0
ch2 = #1 || #0    // #1
ch3 = !#1         // #0
```

---

## Tzijoxik

```zymbol
// E ka'i' b'eyalil chi junam
ubi = "Alice"
n = 42

>> "Utz " ubi " k'o " n ¶       // chupup — pa >>
tzijoxik = "Utz {ubi}, k'o {n}"     // k'ask'om — pa ronojel
```

```zymbol
s = "Utz uwächulew"
nim = s$#                  // 11
ch'utin = s$[1..5]             // "Utz u"  (1-ruk'u'x, is richin)
k'o = s$? "uwächulew"          // #1
k'ayesaj = "a,b,c,d"$/ ','   // [a, b, c, d]  (k'ayesaj rumal k'ojlib'äl)
jal = s$~~["l":"r"]        // "Utz uwächurew"
jal1 = s$~~["l":"r":1]     // "Utz uwächurew" (xe nabe' N)
mul = "─" $* 20           // "────────────────────"  (k'ex N mul)
```

> `+` xe richin taq aj. Richin tzijoxik, atzij ri `,`, chupup, chi rij k'ask'om.

---

## K'axb'al

```zymbol
x = 7

? x > 0 { >> "utz" ¶ }

? x > 100 {
    >> "nim" ¶
} _? x > 0 {
    >> "utz" ¶
} _? x == 0 {
    >> "w'uq" ¶
} _ {
    >> "man utz ta" ¶
}
```

> `{ }` **rajwataj** we ta xe jun tzijon.

---

## Junam

```zymbol
// K'oje'y
q'uya'l = 85
etama'y = ?? q'uya'l {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> etama'y ¶    // → B

// Tzijoxik
k'astaj = "kaq"
k'utb'al = ?? k'astaj {
    "kaq"   => "#FF0000"
    "rax" => "#00FF00"
    _       => "#000000"
}

// B'eyalil k'amoj
q'uqu' = -5
k'ulb'äl = ?? q'uqu' {
    < 0  => "k'is"
    < 20 => "tew"
    < 35 => "q'uqu'"
    _    => "q'uqu' rich"
}
>> k'ulb'äl ¶    // → k'is

// B'eyalil tzijon (k'ojlib'äl k'ux)
n = -3
?? n {
    0    => { >> "w'uq" ¶ }
    < 0  => { >> "man utz ta" ¶ }
    _    => { >> "utz" ¶ }
}
```

---

## K'exb'äl

```zymbol
@ i:0..4  { >> i " " }        // k'oje'y k'o:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // kik'wan b'eyal:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // chikir:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (are)

k'a = ["manzana", "pera", "uva"]
@ k:k'a { >> k ¶ }         // richin ronojel yes pa ri sib'alaj

@ t:"hello" { >> t "-" }
>> ¶                          // → h-e-l-l-o-  (richin ronojel tzij pa ri tzijoxik)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> k'ask'om
    ? i > 7 { @! }             // @! t'ukun
    >> i " "
}
>> ¶                          // → 1 3 5 7

// K'exb'äl man k'o ta ruq'is
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// K'exb'äl kik'wan ub'i' (t'ukun pa chupam)
ajil = 0
@:pa'kan {
    ajil++
    ? ajil >= 3 { @:pa'kan! }
}
>> ajil ¶                    // → 3
```

---

## B'anob'äl

```zymbol
tikon(a, b) { <~ a + b }
>> tikon(3, 4) ¶    // → 7

ajilab'al(n) {
    ? n <= 1 { <~ 1 }
    <~ n * ajilab'al(n - 1)
}
>> ajilab'al(5) ¶    // → 120
```

B'anob'äl **k'o ruwi' cho** — man nik'atzin ta k'o chi sik'ix k'exta'yex pa' kan. Atzij ri elb'anik `~` richin chi jikomal ri k'exta'yex ri k'ask'om:

```zymbol
jal(a<~, b<~) {
    are = a
    a = b
    b = are
}
x = 10
y = 20
jal(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> B'anob'äl kik'wan ub'i' **nabe' mul toq'ik** — ya' tzij: `taq aj$> ka'i'. Richin k'ask'om: `x -> b'anob'äl(x)` utz.

---

## Lambda chuqa' T'uk

```zymbol
ka'i' = x -> x * 2
tikon = (a, b) -> a + b
>> ka'i'(5) ¶    // → 10
>> tikon(3, 7) ¶  // → 10

// Lambda pa ri k'ojlib'äl
k'ut = x -> {
    ? x > 0 { <~ "utz" }
    _? x < 0 { <~ "man utz ta" }
    <~ "w'uq"
}

// T'uk — k'ul pa ri ruwi' cho pa' kan
k'ul = 3
oxi' = x -> x * k'ul
>> oxi'(7) ¶    // → 21

// B'anob'äl
nik'oj_tikon(n) { <~ x -> x + n }
tikon_la' = nik'oj_tikon(10)
>> tikon_la'(5) ¶    // → 15

// Pa ri sib'alaj
b'anob'äl = [x -> x+1, x -> x*2, x -> x*x]
>> b'anob'äl[3](5) ¶    // → 25
```

---

## Sib'alaj

Sib'alaj **nik'exta'** chuqa' k'o **junam taq yes**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — okik (1-ruk'u'x: nabe' yes)
x = arr[-1]     // 5 — k'exta'yex man utz ta (is yes)
x = arr$#       // 5 — nim (atzij (arr$#) pa >>)

arr = arr$+ 6            // tikon → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // k'ask'om pa ri 2 (1-ruk'u'x)
arr3 = arr$- 3           // t'ukur nabe' k'ulmataj
arr4 = arr$-- 3          // t'ukur ronojel
arr5 = arr$-[1]          // t'ukur pa ri 1 (nabe' yes)
arr6 = arr$-[2..3]       // t'ukur k'oje'y (1-ruk'u'x, is richin)

k'o = arr$? 3            // #1 — k'o
k'ojlib'äl = arr$?? 3           // [3] — ronojel ub'eyal (1-ruk'u'x)
ch'utin = arr$[1..3]          // [1,2,3] — ch'utin (1-ruk'u'x, is richin)
ch'utin2 = arr$[1:3]          // [1,2,3] — junam, rub'eyalil pa ajil

q'as = arr$^+             // wachib'äl q'as (xe yes ruch'ab'äl)
q'aj = arr$^-            // wachib'äl q'aj (xe yes ruch'ab'äl)

// Sib'alaj tuple kik'wan ub'i'/k'ojlib'äl — atzij $^ kik'wan lambda k'amoj
k'ul = [(ub'i': "Carla", jun: 28), (ub'i': "Ana", jun: 25), (ub'i': "Bob", jun: 30)]
pa_jun  = k'ul$^ (a, b -> a.jun < b.jun)    // pa jun q'as (<)
pa_ub'i' = k'ul$^ (a, b -> a.ub'i' > b.ub'i')   // pa ub'i' q'aj (>)
>> pa_jun[1].ub'i' ¶     // → Ana
>> pa_ub'i'[1].ub'i' ¶    // → Carla

// Chi jikomal jikib'äl yes (xe sib'alaj)
arr[1] = 99              // ya'
arr[2] += 5              // ch'aqa' chik: +=  -=  *=  /=  %=  ^=

// Jikib'äl b'anob'äl — k'ut sib'alaj k'ak'a'; ri nabe' man nik'exta' ta
arr2 = arr[2]$~ 99
```

> Ronojel b'anob'äl k'ul **sib'alaj k'ak'a'**. Ya' chik: `arr = arr$+ 4`.
> `$+` nik'atzin k'ask'om: `arr = arr$+ 5$+ 6$+ 7`. Chik b'anob'äl k'ul xe ch'aqa' chik.
> **Ub'eyal 1-ruk'u'x**: `arr[1]` yes nabe'; `arr[0]` k'ayewal.

**Rub'eyalil toq'ik** — ya' jun sib'alaj pa jun k'exta'yex chik nik'oj jun kopi:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b man jik ta
```

```zymbol
// Sib'alaj pa chupam (1-ruk'u'x ub'eyal)
ch'ut = [[1,2,3],[4,5,6],[7,8,9]]
>> ch'ut[2][3] ¶    // → 6  (mul 2, nim 3)
```

---

## K'ayesaj

```zymbol
// Sib'alaj
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[nabe', *chik] = arr         // nabe'=10  chik=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ k'ayesaj

// Tuple k'ojlib'äl
ruwach = (100, 200)
(px, py) = ruwach             // px=100  py=200

// Tuple kik'wan ub'i'
achi = (ub'i': "Ana", jun: 25, tinimit: "Madrid")
(ub'i': n, jun: a) = achi   // n="Ana"  a=25
```

---

## Tuple

Tuple e k'olb'äl e kinim **man k'exta'n ta** e nik'atzin k'o richin e k'ul taq toq'ik **e k'exta'n yes**.
K'exta'n richin sib'alaj, yes man nik'exta' ta pa' ri jikib'äl.

```zymbol
// K'ojlib'äl — yes e k'exta'n e k'o
ruwach = (10, 20)
>> ruwach[1] ¶    // → 10

yes = (42, "Utz", #1, 3.14)
>> yes[3] ¶     // → #1

// Kik'wan ub'i'
achi = (ub'i': "Alice", jun: 25)
>> achi.ub'i' ¶    // → Alice
>> achi[1] ¶      // → Alice  (ub'eyal k'ulel, 1-ruk'u'x)

// Pa chupam
k'ojlib'äl = (x: 10, y: 20)
p = (k'ojlib'äl: k'ojlib'äl, k'utb'al: "nabe'")
>> p.k'ojlib'äl.x ¶        // → 10
```

**Man k'exta'n ta** — ronojel nik'oj jikib'äl pa tuple k'ayewal:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ k'ayewal: tuple man k'exta'n ta
// t[1] += 5    // ❌ junam k'ayewal
```

Richin nik'ul toq'ik jik, atzij `$~` (jikib'äl b'anob'äl) — k'ut **tuple k'ak'a'**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← nabe' man jik ta
>> t2 ¶    // → (10, 999, 30)

// Tuple kik'wan ub'i' — tzak chik
achi = (ub'i': "Alice", jun: 25)
nim  = (ub'i': achi.ub'i', jun: 26)
>> achi.jun ¶    // → 25
>> nim.jun ¶     // → 26
```

---

## B'anob'äl ruk'u'x

```zymbol
taqaj = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

kai  = taqaj$> (x -> x * 2)                  // map  → [2,4,6…20]
kayey    = taqaj$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
ronojel    = taqaj$< (0, (kul, x) -> kul + x)     // reduce → 55

// K'ask'om pa chupam
bey1 = taqaj$| (x -> x > 3)
bey2 = bey1$> (x -> x * x)
>> bey2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// B'anob'äl kik'wan ub'i' nik'atzin tzij tzuj pa HOF
kai(x) { <~ x * 2 }
nim(x) { <~ x > 5 }
r = taqaj$> kai       // ✅ tzij chik
r = taqaj$| nim       // ✅ tzij chik
```

---

## B'anob'äl Tu'

Ri ch'akul kik'wan pa kan utzuj `_` richin nik'ul toq'ik:

```zymbol
ka'i' = x -> x * 2
tikon = (a, b) -> a + b
k'ask'om = x -> x + 1

n1 = 5 |> ka'i'(_)        // → 10
n2 = 10 |> tikon(_, 5)       // → 15
n3 = 5 |> tikon(2, _)        // → 7

// K'ask'om
n = 5 |> ka'i'(_) |> k'ask'om(_) |> ka'i'(_)
>> n ¶    // → 22  (5→10→11→22)
```

---

## K'ayewal

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "k'ayesaj rumal w'uq" ¶
} :! {
    >> "chik: " _err ¶    // _err k'ul tzij k'ayewal
} :> {
    >> "ronojel k'ulel" ¶
}
```

| Yes | Are |
|------|------|
| `##Div` | K'ayesaj rumal w'uq |
| `##IO` | Wuj / sistema |
| `##Index` | Ub'eyal pa' kan |
| `##Type` | Yes majunal |
| `##Parse` | Titz'üj yes |
| `##Network` | K'ayewal k'ask'om |
| `##_` | Ronojel k'ayewal (k'ul) |

---

## K'ojlib'äl

```zymbol
// lib/calc.zy — ri k'ojlib'äl k'o pa {}
# calc {
    #> { tikon, get_PI }

    _π := 3.14159
    tikon(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // ub'i' chik rajwataj

>> c::tikon(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Elb'anik kik'wan jun ub'i' chik
# mylib {
    #> { _tikon_pa_chupam => kajib'äl }

    _tikon_pa_chupam(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::kajib'äl(3, 4) ¶    // → 7  (ub'i' pa chupam _tikon_pa_chupam ew)
```

> **K'ojlib'äl taq wuj**: pa `# ub'i' { }`, xe `#>`, tz'ib'anik b'anob'äl, chuqa' rutzijoj k'exta'yex/man k'exta'n ta atzij k'o. Tzijon k'ulel (`>>`, `<<`, lo'p, etc.) k'ut k'ayewal E013.

---

## B'eyalil taq Aj

Zymbol nik'atzin k'ut taq aj pa **69 Unicode b'eyalil** — Devanagari, Arab-Indian, Thai, Klingon pIqaD, Matematiko, LCD, chuqa' chik. Ri b'eyalil k'ulel k'ax che xe `>>` elb'anik; ri ajilab'al pa chupam binary.

### Nik'atzin b'eyalil

Tatz'ib'aj taq aj `0` chuqa' `9` pa ri b'eyalil atz'etz'el pa `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arab-Indian (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // tzalij pa ASCII
```

### Elb'anik chuqa' boolean

```zymbol
x = 42
>> x ¶          // → 42   (ASCII ruwi')

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (tz'utuj decimal ronojel ASCII)
>> 1 + 2 ¶      // → ३

// Boolean: nab'e # ronojel ASCII, ri aj k'ask'om
>> #1 ¶         // → #१   (kitzij pa Devanagari)
>> #0 ¶         // → #०   (sach — man junam ta che ० ajilab'al w'uq)

x = 28 > 4
>> x ¶          // → #१   (k'amoj k'ul ruk'u'x ri b'eyalil)
```

### Taq aj atzij pa tz'ib'

Ronojel b'eyalil nik'atzin e taq aj atzij — pa k'oje'y, modulo, k'amoj:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolean atzij pa ronojel b'eyalil

`#` + aj `0` chi rij `1` k'ut atzij boolean:

```zymbol
#०९#
k'ulel = #१        // junam che #1
>> k'ulel ¶        // → #१
>> (#१ && #०) ¶ // → #०
```

> `#` **ronojel ASCII**. `#0` (sach) ronojel junam ta che `0` (ajilab'al w'uq) pa ronojel b'eyalil.

---

## B'anob'äl taq Yes

```zymbol
// K'exta'n yes
f = ##.42         // → 42.0  (pa p'upuyel)
i = ###3.7        // → 4     (pa ajilab'al, k'ask'om)
t = ##!3.7        // → 3     (pa ajilab'al, k'ayesaj)

// Titz'üj tzijoxik pa aj
v1 = #|"42"|      // → 42  (ajilab'al)
v2 = #|"3.14"|    // → 3.14  (p'upuyel)
v3 = #|"abc"|     // → "abc"  (utz, majun k'ayewal)

// K'ask'om / K'ayesaj
π = 3.14159265
k'ask'om2 = #.2|π|      // → 3.14  (k'ask'om pa 2 b'eyalil)
k'ask'om4 = #.4|π|      // → 3.1416
k'ayesaj2 = #!2|π|      // → 3.14  (k'ayesaj)

// K'utb'al aj
k'utb'al = #,|1234567|  // → 1,234,567  (coma)
tzijoxik = #^|12345.678|    // → 1.2345678e4  (tzijoxik)

// Atzij ruk'u'x
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Elb'anik k'exta'n ruk'u'x
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## K'ask'om kik'wan Shell

```zymbol
q'ij = <\ date +%Y-%m-%d \>     // k'ul stdout (k'o \n pa is)
>> "Wakami: " q'ij

wuj = "data.txt"
k'oje'y = <\ cat {wuj} \>      // k'ask'om pa taq wuj

elb'anik = </"./subscript.zy"/>   // k'ulel jun chik Zymbol, k'ul elb'anik
>> elb'anik
```

> `><` k'ul CLI taq tzij junam sib'alaj (xe tree-walker).

---

## Jun ojer tzij: FizzBuzz

```zymbol
k'ut(aj) {
    ? aj % 15 == 0 { <~ "FizzBuzz" }
    _? aj % 3  == 0 { <~ "Fizz" }
    _? aj % 5  == 0 { <~ "Buzz" }
    _ { <~ aj }
}

@ i:1..20 { >> k'ut(i) ¶ }
```

---

## K'utb'al taq K'ut

| K'utb'al | B'anob'äl | K'utb'al | B'anob'äl |
|--------|-----------|--------|-----------|
| `=` | k'exta'yex | `$#` | nim |
| `:=` | man k'exta'n ta | `$+` | tikon (nik'atzin k'ask'om) |
| `>>` | elb'anik | `$+[i]` | k'ask'om pa ub'eyal (1-ruk'u'x) |
| `<<` | okb'anik | `$-` | t'ukur nabe' rumal toq'ik |
| `¶` / `\\` | k'ak'a' mul | `$--` | t'ukur ronojel rumal toq'ik |
| `?` | we | `$-[i]` | t'ukur pa ub'eyal (1-ruk'u'x) |
| `_?` | we ta | `$-[i..j]` | t'ukur k'oje'y (1-ruk'u'x) |
| `_` | man / wildcard | `$?` | k'o |
| `??` | junam | `$??` | na'oj ronojel ub'eyal (1-ruk'u'x) |
| `@` | lo'p | `$[s..e]` | ch'utin (1-ruk'u'x) |
| `@ N { }` | lo'p N mul | `$>` | map |
| `@!` | t'ukun | `$\|` | filter |
| `@>` | k'ask'om | `$<` | reduce |
| `@:ub'i' { }` | lo'p kik'wan ub'i' | `$/ rik'in` | k'ayesaj tzijoxik |
| `@:ub'i'!` | t'ukun ub'i' | `$++ a b c` | tzak k'ask'om |
| `@:ub'i'>` | k'ask'om ub'i' | `arr[i>j>k]` | ub'eyal titz'üj |
| `->` | lambda | `arr[i] = toq'ik` | jikib'äl yes (xe sib'alaj) |
| `arr[i] += toq'ik` | jikib'äl ch'aqa' chik | `arr[i]$~` | jikib'äl b'anob'äl (k'ak'a' kopi) |
| `$^+` | wachib'äl q'as (xe ruch'ab'äl) | `$^-` | wachib'äl q'aj (xe ruch'ab'äl) |
| `$^` | wachib'äl kik'wan k'amoj (tuple) | `<~` | k'ut |
| `\|>` | tu' | `!?` | na'oj |
| `:!` | k'ul | `:>` | q'is |
| `#1` | kitzij | `#0` | sach |
| `$!` | k'ayewal | `$!!` | k'ask'om k'ayewal |
| `<#` | ok | `#>` | el |
| `#` | k'ut k'ojlib'äl | `::` | siq'ij k'ojlib'äl |
| `.` | okik pa k'ojlib'äl | `#?` | yes ch'ob |
| `#\|..\|` | titz'üj aj | `##.` | k'exta'n pa p'upuyel |
| `###` | k'exta'n pa ajilab'al (k'ask'om) | `##!` | k'exta'n pa ajilab'al (k'ayesaj) |
| `#.N\|..\|` | k'ask'om | `#!N\|..\|` | k'ayesaj |
| `#,\|..\|` | k'utb'al coma | `#^\|..\|` | tzijoxik |
| `#d0d9#` | jal b'eyalil aj | `#09#` | tzalij pa ASCII |
| `<\ ..\>` | k'ulel shell | `>\<` | CLI taq tzij |
| `\ k'exta'yex` | t'ukur k'exta'yex | `°x` / `x°` | k'utb'al q'uqu' (rutzijoj pa kiq'a') |
| `>>|` | K'ojlib'äl TUI (wächib'äl chik) | `>>~` | elb'anik pa k'ojlib'äl |
| `>>!` | tiz'aj wächib'äl | `>>?` | ta nïm terminal |
| `<<\|` | toq'ik tz'apib'äl | `<<\|?` | na'oj toq'ik tz'apib'äl man tikir ta |
| `@~ N` | warim N milisegundo | `$*` | k'ex tzijoxik N mul |

---

## K'ak'a' taq jikib'äl

### v0.0.5 — TUI, K'utb'al q'uqu' & K'ex tzijoxik _(Mey 2026)_

- **K'ayewal** K'ayesaj lo'p: `b'eyalil : k'ulmataj` → `b'eyalil => k'ulmataj`
- **K'ayewal** K'ask'om ok: `<# b'ey <= ub'i' chik` → `<# b'ey => ub'i' chik`
- **K'ayewal** Jal ub'i' el: `#> { b'anob'äl <= winaq }` → `#> { b'anob'äl => winaq }`
- **K'o** K'ojlib'äl TUI `>>| { }` — wächib'äl chik + b'eyalil wach; tiz'aj are k'ax
- **K'o** Elb'anik pa k'ojlib'äl `>>~ (mul, nim, BKS, fg, bg) > taq yes` — ch'utin, b'onil ANSI 256
- **K'o** Okb'anik tz'apib'äl `<<| k'exta'yex` (tikir) chuqa' `<<|? k'exta'yex` (na'oj man tikir ta)
- **K'o** `>>!` tiz'aj wächib'äl, `>>?` ta nïm terminal, `@~ N` warim N milisegundo
- **K'o** K'utb'al q'uqu' `°x` / `x°` — rutzijoj k'exta'yex pa kiq'a' pa nabe' k'ulmataj pa lo'p
- **K'o** K'ex tzijoxik `tzijoxik $* N` — k'ex tzijoxik N mul
- **VM** Junal: 436/436 titz'üj k'ulel

### v0.0.4 — Ub'eyal 1-ruk'u'x, B'anob'äl Ruk'u'x & K'ojlib'äl Pa K'ojlib'äl _(Abril 2026)_

- **K'ayewal** Ronojel ub'eyal jik pa **1-ruk'u'x** — `arr[1]` nabe' yes; `arr[0]` k'ayewal
- **K'o** B'anob'äl kik'wan ub'i' **nabe' mul toq'ik** — ya' tzij pa HOF: `taq aj$> ka'i'`
- **K'o** **K'ojlib'äl b'eyalil rajwataj** richin k'ojlib'äl: `# ub'i' { ... }` — b'eyalil chupup t'ukur
- **K'o** Ub'eyal q'ui mul: `arr[i>j>k]` (titz'üj), `arr[p ; q]` (elb'anik chupup)
- **K'o** K'exta'n yes: `##.tzij` (p'upuyel), `###tzij` (ajilab'al k'ask'om), `##!tzij` (ajilab'al k'ayesaj)
- **K'o** K'ayesaj tzijoxik: `tzijoxik$/ rik'in` — k'ut `Array(tzijoxik)`
- **K'o** Tzak k'ask'om: `ruwi'$++ a b c` — tikon q'uiy yes
- **K'o** Lo'p mul: `@ N { }` — k'ex N mul
- **K'o** B'eyalil lo'p kik'wan ub'i': `@:ub'i' { }`, `@:ub'i'!`, `@:ub'i'>` — tikir `@ @ub'i'` / `@! ub'i'`
- **K'o** Taq wuj ruwi' cho: `_ub'i'` k'exta'yex e k'o ruwi' cho; `\ k'exta'yex` t'ukur
- **K'o** B'eyalil k'amoj junam: `< 0 =>`, `> 5 =>`, `== 42 =>`, chuqa' chik
- **K'o** K'ayewal k'ojlib'äl E013: tzijon k'ulel pa ri k'ojlib'äl man k'o ta
- **Jikib'äl** `alias.CONST` wakami nik'atzin; `#>` nik'atzin k'ask'om pa' ri tz'ib'anik b'anob'äl
- **VM** Ronojel junal: 393/393 titz'üj k'ulel

### v0.0.3 — Unicode Aj B'eyalil & LSP Jikib'äl _(Abril 2026)_

- **K'o** 69 Unicode aj k'ojlib'äl kik'wan k'utb'al jikib'äl `#d0d9#`
- **K'o** Boolean atzij pa ronojel b'eyalil — `#१` / `#०`, `#१` / `#०`, chuqa' chik
- **K'o** Klingon pIqaD taq aj (CSUR PUA U+F8F0–U+F8F9)
- **K'o** VM opcode `SetNumeralMode` — ronojel junal kik'wan tree-walker
- **Jik** Boolean `>>` elb'anik wakami k'o nab'e `#` (`#0` / `#1`) pa ronojel b'eyalil

### v0.0.2_01 — Jal ub'i' B'anob'äl _(30 Uk'ab'al 2026)_

- **Jik** `c|..|` → `#,|..|` chuqa' `e|..|` → `#^|..|` — junam che ri nab'e `#`
- **K'o** K'ask'om elb'anik: k'ask'om chik k'ojlib'äl pa jun ub'i' chik

### v0.0.2 — Jikib'äl API K'ul & K'ask'om _(24 Uk'ab'al 2026)_

- **K'o** Junam `$` b'anob'äl pa sib'alaj chuqa' tzijoxik (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **K'o** K'ayesaj ya'ib'äl pa sib'alaj, tuple, chuqa' tuple kik'wan ub'i'
- **K'o** Ub'eyal man utz ta (`arr[-1]` = is yes)
- **K'o** K'ask'om — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Uk'ab'al 2026)_

- **K'o** Ya'ib'äl ch'aqa' chik `^=`
- **Jikib'äl** K'ayewal ajilab'al; jikib'äl taq wuj

### v0.0.1 — Nabe' Elb'anik _(22 Uk'ab'al 2026)_

- Tree-walker k'ewal tzij + VM (`--vm`, ~4× nim, ~95% junal)
- Ronojel ruwi' b'eyalil: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Ronojel Unicode etal, k'ojlib'äl, lambda, t'uk, k'ayewal
- REPL, LSP, VS Extension, k'utb'al (`zymbol fmt`)

---

_Zymbol-Lang — Etzal. Ronojel. Man K'exta'n Ta._
```
