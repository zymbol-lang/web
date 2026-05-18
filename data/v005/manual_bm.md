> **Jatilil**i:** Nin sɛbɛnnen ye kalanbaliya (AI) dilan ani bayinɛ.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Jatilifasow ye **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** ye min bɛ ɲɛnajugukɛyɔrɔ la.

---

# Zymbol-Lang Kalanbagatira

> **Ladilannen v0.0.5 kama — 2026-05-14**

**Zymbol-Lang** yɛlɛmaɲɔgɔnnya programiw ka kan ye. Jateminw tɛ — ooti ye jatemin ye. A bɛ baara kɛ ɲɔgɔnna cogo kelen na adaman kan o adaman na.

- `if`, `while`, `return` tɛ — `?`, `@`, `<~` doroŋ
- Unicode ɲininkali — jateminw kan o kan ani emoji kan
- Kana ɲɔgɔnnya kan — koodi ye kelen ye yɔrɔ bɛɛ

**Ɲɛnajugukɛcogo saramuya**: v0.0.5 | **Fɛrɛntan dɛmɛsiri**: 436/436 (TW ↔ VM ɲɔgɔnɲɔgɔnnya)

---

## Furancalenw ani Minkɛlenw

```zymbol
x = 10              // furancalen min bɛ se ka falen
π := 3.14159        // minkɛlen — falen kɛcogo sɛgɛn daminɛ waati hakɛla ye
tɔgɔ = "Alisi"
baara = #1         // booliyan tiɲɛ
👋 := "Aw ni baara"
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

`°` (sigida jatigɛ, U+00B0) bɛ furancalen daminɛ a fanɲɛmɔgɔyako sɛbɛn na a laban waati:

```zymbol
nɔnɔw = [3, 1, 4, 1, 5]
@ n:nɔnɔw {
    °bɔli += n    // daminɛ fanɲɛmɔgɔnya 0 la min bɛ kabakuru sannikɔrɔ; bɛ dununya kɛ ni @ kɔ
}
>> bɔli ¶         // → 14
```

> `°x` (jalajali) bɛ kabakuru sannikɔrɔ — segin bɛ se ka soro ni `@` kɔ.
> `x°` (kɔfalajali) bɛ kabakuru kɔnɔ — a bɛ sa kabakuru banna.
> Tree-walker doroŋ.

---

## Datiya Wɛrɛw

| Wɛrɛ | Litɛrali | `#?` Tahi | Taamasiyɛncogo |
|------|---------|----------|---------|
| Dɔn | `42`, `-7` | `###` | 64-bit ni jatemin ye |
| Lafiɲɛ | `3.14`, `1.5e10` | `##.` | Sayansi sɛbɛn ka don |
| Kala | `"sɛbɛn"` | `##"` | Filɛli kɔnɔ: `"Aw ni baara {tɔgɔ}"` |
| Gafo | `'A'` | `##'` | Unicode gafo kelen |
| Booliyan | `#1`, `#0` | `##?` | Ni nɔnɔ tɛ — `#1 ≠ 1` |
| Jatebɔli | `[1, 2, 3]` | `##]` | Siɲɛ kelen bɛɛ |
| Tupulu | `(a, b)` | `##)` | Sigiyɔrɔ |
| Tupulu min tɔgɔ sɔrɔ | `(x: 1, y: 2)` | `##)` | Fɛrɛnw min tɔgɔ sɔrɔ |
| Baarakɛcogo | tɔgɔsɔrɔ baarakɛcogo jatilifaso | `##()` | Danbe ye foli; a bɛ jira `<funct/N>` |
| Lameda | `x -> x * 2` | `##->` | Danbe ye foli; a bɛ jira `<lambd/N>` |

```zymbol
// Wɛrɛ hakiliɲinini — a bɛ segin (wɛrɛ, nɔnɔw, hakɛ)
mɛta = 42#?
>> mɛta ¶         // → (###, 2, 42)
t = mɛta[1]
>> t ¶            // → ###
```

---

## Naani ani Donni

```zymbol
>> "Aw ni baara" ¶                       // ¶ ani \\ ka jira cɛɲi sɛbɛncogo la
>> "a=" a " b=" b ¶               // ɲɔgɔnbadɛn — hakɛ caman
>> (arr$#) ¶                      // kɔfalajali baarakɛcogow bina ( ) sɔrɔ >> kɔnɔ

>> tɔgɔ                           // kalan furancalen na (jalajali tɛ)
>> "Tɔgɔ sɛbɛn: " tɔgɔ            // ni jalajali ye
```

> `¶` (AltGr+R ka kan Espanyiɲɛ tabali kan) ani `\\` ye jira cɛɲi ɲɔgɔnɲɔgɔnnyalen ye.

---

## TUI Labɛnw

Baarakɛcogow minnu bɛ baara kɛ terminal danfara la baarakɛcogow lakodonni la. Caman bina `>>| { }` foli (sirilen fanba + kalanɲuman cogo).

```zymbol
>>| {
    >>!                             // sirilen fanba sariya
    >>~ (1, 1, 0, 10) > "Bɛ baara kɛ"   // jira 1, kɔlɔn 1, fg=10 (binkansi)
    @~ 1000                         // 1 sekondi (1000 ms)
    >>~ (2, 1) > "A ban."
}
// terminal bɛ segin kɛ fanɲɛmɔgɔnya daminɛ waati
```

```zymbol
// Tabali kɛcogo ani terminal bonɲa
>>| {
    [jiraw, kɔlɔnw] = >>?              // terminal bonɲa lajɛ
    >>~ (1, 1) > "Terminal: " jiraw " x " kɔlɔnw
    <<| tabali                         // kalan tabali kɛcogo min bɛ dogo
    >>~ (2, 1) > "I y'a dogo: " tabali
}
```

> `>>!` bɛ sirilen sariya. `>>?` bɛ segin `[jiraw, kɔlɔnw]`. `@~ N` bɛ sunɔgɔ N milisegɔndi.
> `<<|` bɛ tabali kɛcogo kelen kalan (min bɛ dogo); `<<|?` bɛ lakodi ni dogo tɛ (a bɛ segin `'\0'` ni foyi tɛ).
> Sigiyɔrɔ naani tupulu: `(jira, kɔlɔn, BKS, fg, bg)` — yɔrɔ bɛɛ bɛ se ka bɔ ni koma ye (`>>~ (,,, 196) > "bilen"`).
> BKS bitimaski: `1`=banba, `2`=ɲɛgɛn, `4`=jiralɔ. ANSI 256 kɔlɔr palɛti (`0`=terminal cɛɲi).
> Tree-walker doroŋ (ni `>>!`, `>>?`, `@~`, `>>~` tɛ minnu bɛ baara kɛ `--vm` fana).

---

## Baarakɛcogow

```zymbol
// Jatebɔli
a = 10
b = 3
s1 = a + b    // 13
s2 = a - b    // 7
s3 = a * b    // 30
s4 = a / b    // 3  (dɔn teliman)
s5 = a % b    // 1
s6 = a ^ b    // 1000  (sinna)

// Jatigɛli — jatemin kɛ kalanba kama
j1 = a == b    // #0
j2 = a <> b    // #1
j3 = a < b     // #0
j4 = a <= b    // #0
j5 = a > b     // #1
j6 = a >= b    // #1

// Hakili
h1 = #1 && #0    // #0
h2 = #1 || #0    // #1
h3 = !#1         // #0
```

---

## Kalaw

```zymbol
// Sɔrɔcogo wɛrɛ fɛlɛ
tɔgɔ = "Alisi"
n = 42

>> "Aw ni baara " tɔgɔ " i bɛ " n ¶       // ɲɔgɔnbadɛn — >> kɔnɔ
ɲɛfɔli = "Aw ni baara {tɔgɔ}, i bɛ {n}"     // filɛli kɔnɔ — yɔrɔ bɛɛ
```

```zymbol
s = "Aw ni baara dunia"
janɲa = s$#                  // 11
cɛncɛn = s$[1..5]             // "Aw ni"  (1-natigɛ, baarada bɛ kɔnɔ)
bɛ = s$? "dunia"          // #1
cɛncɛnw = "a,b,c,d"$/ ','   // [a, b, c, d]  (teli ni cɛncɛndalali ye)
falen = s$~~["l":"r"]        // "Aw ni baara dunia" ('l' tɛ bamanankan na)
falen1 = s$~~["l":"r":1]     // "Aw ni baara dunia"
jira = "─" $* 20           // "────────────────────"  (falen N tuman)
```

> `+` ye nɔnɔw doroŋ. Kala ma, fara `,`, ɲɔgɔnbadɛn, ani filɛli kɔnɔ.

---

## Jateminɲɛgɛn

```zymbol
x = 7

? x > 0 { >> "cogɔcogo" ¶ }

? x > 100 {
    >> "ba" ¶
} _? x > 0 {
    >> "cogɔcogo" ¶
} _? x == 0 {
    >> "fɛrɛ" ¶
} _ {
    >> "ɲinincogo" ¶
}
```

> Jalakɛw `{ }` **bɛ kan ka kɛ** ni a ye laadalikɛ kelen doroŋ.

---

## Labɛnni

```zymbol
// Baaradaw
don = 85
tɔn = ?? don {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> tɔn ¶    // → B

// Kalaw
kɔlɔr = "bilen"
kode = ?? kɔlɔr {
    "bilen"   => "#FF0000"
    "binkansi" => "#00FF00"
    _       => "#000000"
}

// Jatigɛli laadalikɛcogow
funteni = -5
cogo = ?? funteni {
    < 0  => "nɛgɛ"
    < 20 => "nɛnɛ"
    < 35 => "funteni"
    _    => "funteni ba"
}
>> cogo ¶    // → nɛgɛ

// Laadalikɛ cogo (foli bulaw)
n = -3
?? n {
    0    => { >> "fɛrɛ" ¶ }
    < 0  => { >> "ɲinincogo" ¶ }
    _    => { >> "cogɔcogo" ¶ }
}
```

---

## Kabakuruw

```zymbol
@ i:0..4  { >> i " " }        // baarada bɛ kɔnɔ:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // ni cɛncɛn ye:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // kɔfɛ:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (waati)

aba = ["apuli", "peya", "lenburu"]
@ a:aba { >> a ¶ }         // ɲɔgɔn bɛɛ kelen-kelen jatebɔli kɔnɔ

@ g:"hello" { >> g "-" }
>> ¶                          // → h-e-l-l-o-  (gafo bɛɛ kala kɔnɔ)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> tɔ
    ? i > 7 { @! }             // @! kalan
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Kabakuru min tɛ baarada
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Kabakuru min tɔgɔ sɔrɔ (kalan min bɛ ɲɔgɔn kɔnɔ)
kalanw = 0
@:kan{
    kalanw++
    ? kalanw >= 3 { @:kan! }
}
>> kalanw ¶                    // → 3
```

---

## Baarakɛcogow

```zymbol
dɔn(a, b) { <~ a + b }
>> dɔn(3, 4) ¶    // → 7

faktiyɛli(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktiyɛli(n - 1)
}
>> faktiyɛli(5) ¶    // → 120
```

Baarakɛcogow bɛ **fanɲɛmɔgɔya fanba** — u tɛ se ka furancalenw kalan kan. Fara baarakɛcogo paramɛtɛriw `<~>` kama ka falen walidenw:

```zymbol
falen(a<~, b<~) {
    tuma = a
    a = b
    b = tuma
}
x = 10
y = 20
falen(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Tɔgɔsɔrɔ baarakɛcogow ye **foli jateminw** ye — jatemin bɛ se ka ci waliden ma: `nɔnɔw$> fila`. Ka falen: `x -> fn(x)` fanba bɛ se.

---

## Lamedaw ani Dalanw

```zymbol
fila = x -> x * 2
dɔn = (a, b) -> a + b
>> fila(5) ¶    // → 10
>> dɔn(3, 7) ¶  // → 10

// Foli lameda
cogocogo = x -> {
    ? x > 0 { <~ "cogɔcogo" }
    _? x < 0 { <~ "ɲinincogo" }
    <~ "fɛrɛ"
}

// Dalan — a bɛ kan faso fanɲɛmɔgɔya
jɛkulu = 3
saba = x -> x * jɛkulu
>> saba(7) ¶    // → 21

// Farikolo
dɔnbaarakɛlaw (n) { <~ x -> x + n }
dɔn_taan = dɔnbaarakɛlaw (10)
>> dɔn_taan(5) ¶    // → 15

// Jatebɔli kɔnɔ
baarakɛcogow = [x -> x+1, x -> x*2, x -> x*x]
>> baarakɛcogow[3](5) ¶    // → 25
```

---

## Jatebɔliw

Jatebɔliw bɛ **se ka falen** ani u bɛ **siɲɛ kelen** ye.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — soro (1-natigɛ: siɲɛ foli)
x = arr[-1]     // 5 — jatemin ɲɛnincogo (siɲɛ laban)
x = arr$#       // 5 — janɲa (kɛ (arr$#) >> kɔnɔ)

arr = arr$+ 6            // fara → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // dɔn sigi 2 la (1-natigɛ)
arr3 = arr$- 3           // bɔ hakɛ foli
arr4 = arr$-- 3          // bɔ hakɛw bɛɛ
arr5 = arr$-[1]          // bɔ jatemin 1 la (siɲɛ foli)
arr6 = arr$-[2..3]       // bɔ baarada (1-natigɛ, baarada bɛ kɔnɔ)

bɛ = arr$? 3            // #1 — a bɛ kɔnɔ
yɔrɔw = arr$?? 3           // [3] — jateminw bɛɛ hakɛ (1-natigɛ)
cɛncɛn = arr$[1..3]          // [1,2,3] — cɛncɛn (1-natigɛ, baarada bɛ kɔnɔ)
cɛncɛn2 = arr$[1:3]          // [1,2,3] — kelen, kalanw-natigɛ sɔrɔcogo

tɛgɛ = arr$^+             // falen tɛgɛ (labɛnw doroŋ)
duguma = arr$^-            // falen duguma (labɛnw doroŋ)

// Tupulu tɔgɔsɔrɔ/sigiyɔrɔ jatebɔliw — kɛ $^ ni lameda jatigɛli ye
database = [(tɔgɔ: "Carla", san: 28), (tɔgɔ: "Ana", san: 25), (tɔgɔ: "Bob", san: 30)]
ni_san  = database$^ (a, b -> a.san < b.san)    // ni san tɛgɛ (<)
ni_tɔgɔ = database$^ (a, b -> a.tɔgɔ > b.tɔgɔ)   // ni tɔgɔ duguma (>)
>> ni_san[1].tɔgɔ ¶     // → Ana
>> ni_tɔgɔ[1].tɔgɔ ¶    // → Carla

// Siɲɛ falen jatemin (jatebɔliw doroŋ)
arr[1] = 99              // jatemin
arr[2] += 5              // fara: +=  -=  *=  /=  %=  ^=

// Baarakɛcogɔ falen — a bɛ jatebɔli kura segin; foli tɛ falen
arr2 = arr[2]$~ 99
```

> Jatemin baarakɛcogow bɛɛ bɛ **jatebɔli kura** segin. Jatemin kɔfɛ: `arr = arr$+ 4`.
> `$+` bɛ se ka kɛ cɛn: `arr = arr$+ 5$+ 6$+ 7`. Baarakɛcogow tɛcɛ bɛ baara kɛ jatemin cɛcɛnw.
> **Jatemin kɛcogo ye 1-natigɛ**: `arr[1]` ye siɲɛ foli; `arr[0]` ye daminɛ waati hakɛla.
> `$^+` / `$^-` bɛ **labɛn jatebɔliw** (nɔnɔw, kalaw) falen. Tupulu jatebɔliw ma, kɛ `$^` ni lameda jatigɛli ye — jan bɛ sɛbɛn lameda kɔnɔ (`<` = tɛgɛ, `>` = duguma).

**Hakɛ jatemin cogo** — jatebɔli jatemin furancalen wɛrɛ ma bɛ kɔpi kura dilan:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b tɛ falen
```

```zymbol
// Jatebɔliw minnu bɛ ɲɔgɔn kɔnɔ (1-natigɛ jatemin kɛcogo)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[2][3] ¶    // → 6  (jira 2, kɔlɔn 3)
```

---

## Kunnafoni Kalanw

```zymbol
// Jatebɔli
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[foli, *wɛrɛ] = arr         // foli=10  wɛrɛ=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ bɛ bɔ

// Tupulu sigiyɔrɔ
bɔli = (100, 200)
(px, py) = bɔli             // px=100  py=200

// Tupulu tɔgɔsɔrɔ
mogɔ = (tɔgɔ: "Ana", san: 25, dugukolo: "Madrid")
(tɔgɔ: n, san: s) = mogɔ   // n="Ana"  s=25
```

---

## Tupulu

Tupulu ye **min tɛ se ka falen** sɛbɛnw minnu bɛ se ka hakɛ caman **wɛrɛ caman** sɔrɔ.
Jatebɔliw fanba ma, siɲɛ tɛ se ka falen nata kɔ.

```zymbol
// Sigiyɔrɔ — wɛrɛw bɛ se ka kɛɲɔgɔn
bɔli = (10, 20)
>> bɔli[1] ¶    // → 10

datiyaw = (42, "Aw ni baara", #1, 3.14)
>> datiyaw[3] ¶     // → #1

// Tɔgɔsɔrɔ
mogɔ = (tɔgɔ: "Alisi", san: 25)
>> mogɔ.tɔgɔ ¶    // → Alisi
>> mogɔ[1] ¶      // → Alisi  (jatemin fana bɛ baara kɛ, 1-natigɛ)

// minnu bɛ ɲɔgɔn kɔnɔ
yɔrɔ = (x: 10, y: 20)
p = (yɔrɔ: yɔrɔ, tahi: "damina")
>> p.yɔrɔ.x ¶        // → 10
```

**Tɛ se ka falen** — tupulu siɲɛ kɛcogo bɛɛ ye daminɛ waati hakɛla:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ daminɛ waati hakɛla: tupulu tɛ se ka falen
// t[1] += 5    // ❌ kelen hakɛla
```

Ka sɔrɔ hakɛ min falen, kɛ `$~` (baarakɛcogɔ falen) — a bɛ **tupulu kura** segin:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← foli tɛ falen
>> t2 ¶    // → (10, 999, 30)

// Tupulu tɔgɔsɔrɔ — dilan kɔrɔbɔra cogo la
mogɔ = (tɔgɔ: "Alisi", san: 25)
dɔnfan  = (tɔgɔ: mogɔ.tɔgɔ, san: 26)
>> mogɔ.san ¶    // → 25
>> dɔnfan.san ¶     // → 26
```

---

## Kɔrɔnbaarakɛcogow

```zymbol
nɔnɔw = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

fila_kɛlenw  = nɔnɔw$> (x -> x * 2)                  // map  → [2,4,6…20]
nɔnɔw_fɔlɔw    = nɔnɔw$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
bɔli    = nɔnɔw$< (0, (jɛkulu, x) -> jɛkulu + x)     // reduce → 55

// Kɛ cɛn ni cɛcɛnw ye
cɛncɛn1 = nɔnɔw$| (x -> x > 3)
cɛncɛn2 = cɛncɛn1$> (x -> x * x)
>> cɛncɛn2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Tɔgɔsɔrɔ baarakɛcogow bɛ se ka ci waliden ma HOF
fila(x) { <~ x * 2 }
ba(x) { <~ x > 5 }
r = nɔnɔw$> fila       // ✅ fanba jatemin
r = nɔnɔw$| ba       // ✅ fanba jatemin
```

---

## Pipi Baarakɛcogo

Bɔfɛ bilen bɛ kan `_` sɔrɔ ni hakɛ min bɛ pipi:

```zymbol
fila = x -> x * 2
dɔn = (a, b) -> a + b
ɲɛ = x -> x + 1

s1 = 5 |> fila(_)        // → 10
s2 = 10 |> dɔn(_, 5)       // → 15
s3 = 5 |> dɔn(2, _)        // → 7

// Cɛn
s = 5 |> fila(_) |> ɲɛ(_) |> fila(_)
>> s ¶    // → 22  (5→10→11→22)
```

---

## Hakɛla Jatigɛli

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "teli ni fɛrɛ" ¶
} :! {
    >> "wɛrɛw: " _err ¶    // _err bɛ hakɛla ladili
} :> {
    >> "kabakuru bɛ baara kɛ" ¶
}
```

| Wɛrɛ | Waati |
|------|------|
| `##Div` | Teli ni fɛrɛ |
| `##IO` | Fayili / cikuruyɔrɔ |
| `##Index` | Jatemin min bɛ baarada kan |
| `##Type` | Wɛrɛ ɲɔgɔnɲɔgɔnnya tɛ |
| `##Parse` | Datiya kalan |
| `##Network` | Rɛzo hakɛlaw |
| `##_` | Hakɛla o hakɛla (bɛɛ minɛ) |

---

## Mojuluw

```zymbol
// lib/calc.zy — mojulu bagan bɛ jalakɛ kɔnɔ
# calc {
    #> { dɔn, get_PI }

    _π := 3.14159
    dɔn(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // tɔgɔ wɛrɛ bɛ kan

>> c::dɔn(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Naani ni tɔgɔ wɛrɛ ye
# mylib {
    #> { _dɔn_kɔnɔ => bɔli }

    _dɔn_kɔnɔ(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::bɔli(3, 4) ¶    // → 7  (tɔgɔ kɔnɔ _dɔn_kɔnɔ bɛ dogo)
```

> **Mojulu sariyaw**: `# tɔgɔ { }` kɔnɔ, `#>`, baarakɛcogo kalanw, ani litɛrali furancalen/minkɛlen daminɛw doroŋ bɛ se. Laadalikɛw minnu bɛ se ka kɛ (`>>`, `<<`, kabakuruw, ww.) bɛ hakɛla E013 daminɛ.

---

## Nɔnɔ Cogo

Zymbol bɛ se ka nɔnɔw jira **Unicode nɔnɔ sɛbɛnw 69 la** — Dewanagari, Laramu-Hindi, Tayilandi, Klingon pIqaD, Jatebɔli Banba, LCD cɛncɛnw, ani wɛrɛw. Cogo min bɛ baara kɛ a bɛ `>>` naani doroŋ; nɔnɔw jatebɔli kɔnɔ bɛ binary kɛ kabakuru.

### Sɛbɛn daminɛ

Sɛbɛn `0` ani `9` sɛbɛn `#…#` kɔnɔ:

```zymbol
#०९#    // Dewanagari   (U+0966–U+096F)
#٠٩#    // Laramu-Hindi (U+0660–U+0669)
#๐๙#    // Tayilandi     (U+0E50–U+0E59)
#09#    // segin ASCII ma
```

### Naani ani booliyanw

```zymbol
x = 42
>> x ¶          // → 42   (ASCII foli)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (nɔnɔbilen yɔrɔ ye ASCII doroŋ)
>> 1 + 2 ¶      // → ३

// Booliyanw: jalajali # ye ASCII doroŋ, nɔnɔ bɛ falen
>> #1 ¶         // → #१   (tiɲɛ Dewanagari la)
>> #0 ¶         // → #०   (fana — a bɛ ɲɔgɔnɲɔgɔnni ० dɔn fɛrɛ)

x = 28 > 4
>> x ¶          // → #१   (jatigɛli segin bɛ cogo min bɛ baara kɛ)
```

### Nɔnɔ litɛraliw ka kan

Sɛbɛn o sɛbɛn min bɛ dɛmɛ, a nɔnɔw ye litɛraliw ye — baaradaw, modulo, jatigɛliw:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Booliyan litɛraliw sɛbɛn o sɛbɛn la

`#` + nɔnɔ `0` ani `1` ye booliyan litɛrali min bɛ se:

```zymbol
#٠٩#
baara = #١        // min bɛ ɲɔgɔnni #1
>> baara ¶        // → #१
>> (#१ && #०) ¶ // → #०
```

> `#` **ye ASCII doroŋ**. `#0` (fana) bɛ ɲɔgɔnɲɔgɔnni `0` (dɔn fɛrɛ) sɛbɛn o sɛbɛn la.

---

## Datiya Baarakɛcogow

```zymbol
// Wɛrɛ falen
f = ##.42         // → 42.0  (kɛ lafiɲɛ)
i = ###3.7        // → 4     (kɛ dɔn, kili)
t = ##!3.7        // → 3     (kɛ dɔn, bɔ)

// Kala falen nɔnɔ ma
v1 = #|"42"|      // → 42  (dɔn)
v2 = #|"3.14"|    // → 3.14  (lafiɲɛ)
v3 = #|"abc"|     // → "abc"  (hakɛla tɛ)

// Kili / Bɔ
π = 3.14159265
kili2 = #.2|π|      // → 3.14  (kili lafiɲɛyɔrɔ 2 la)
kili4 = #.4|π|      // → 3.1416
bɔ2 = #!2|π|      // → 3.14  (bɔ)

// Nɔnɔ sɛbɛn
sɛbɛn = #,|1234567|  // → 1,234,567  (koma bɛ min teli)
sayansi = #^|12345.678|    // → 1.2345678e4  (sayansi)

// Jatigɛ litɛraliw
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Jatigɛ falen naani
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Sheli Jɛkulu

```zymbol
don = <\ date +%Y-%m-%d \>     // stdout (ni \n bɛ min baarada)
>> "Bi: " don

fayili = "data.txt"
kɔnɔ = <\ cat {fayili} \>      // filɛli kɔnɔ

naani = </"./subscript.zy"/>   // Zymbol sɛbɛn wɛrɛ baara, naani
>> naani
```

> `><` bɛ CLI kumaw minɛ kala jatebɔli la (tree-walker doroŋ).

---

## Labɛn Fana: FizzBuzz

```zymbol
cogocogo(nɔnɔ) {
    ? nɔnɔ % 15 == 0 { <~ "FizzBuzz" }
    _? nɔnɔ % 3  == 0 { <~ "Fizz" }
    _? nɔnɔ % 5  == 0 { <~ "Buzz" }
    _ { <~ nɔnɔ }
}

@ i:1..20 { >> cogocogo(i) ¶ }
```

---

## Jatigɛ Jatemin

| Jatemin | Baarakɛcogo | Jatemin | Baarakɛcogo |
|--------|-----------|--------|-----------|
| `=` | furancalen | `$#` | janɲa |
| `:=` | minkɛlen | `$+` | fara (bɛ se ka cɛn) |
| `>>` | naani | `$+[i]` | dɔn jatemin la (1-natigɛ) |
| `<<` | donni | `$-` | bɔ foli ni hakɛ ye |
| `¶` / `\\` | jira cɛɲi | `$--` | bɔ bɛɛ ni hakɛ ye |
| `?` | ni | `$-[i]` | bɔ jatemin la (1-natigɛ) |
| `_?` | ni tɛ-ni | `$-[i..j]` | bɔ baarada (1-natigɛ) |
| `_` | ni tɛ / wildcard | `$?` | bɛ kɔnɔ |
| `??` | labɛn | `$??` | jatemin bɛɛ (1-natigɛ) |
| `@` | kabakuru | `$[s..e]` | cɛncɛn (1-natigɛ) |
| `@ N { }` | kabakuru N tuman | `$>` | map |
| `@!` | kalan | `$\|` | filter |
| `@>` | tɔ | `$<` | reduce |
| `@:tɔgɔ { }` | kabakuru min tɔgɔ sɔrɔ | `$/ teli` | kala teli |
| `@:tɔgɔ!` | kalan tɔgɔ | `$++ a b c` | falen dilan |
| `@:tɔgɔ>` | tɔ tɔgɔ | `arr[i>j>k]` | jatemin min bɛ ɲɛtaga la |
| `->` | lameda | `arr[i] = hakɛ` | siɲɛ falen (jatebɔliw doroŋ) |
| `arr[i] += hakɛ` | falen fara | `arr[i]$~` | falen baarakɛcogɔ (kɔpi kura) |
| `$^+` | falen tɛgɛ (labɛnw) | `$^-` | falen duguma (labɛnw) |
| `$^` | falen ni jatigɛli (tupulu) | `<~` | segin |
| `\|>` | pipi | `!?` | kɛ |
| `:!` | minɛ | `:>` | laban |
| `#1` | tiɲɛ | `#0` | fana |
| `$!` | hakɛla wa | `$!!` | hakɛla minɛ |
| `<#` | don | `#>` | naani |
| `#` | mojulu jira | `::` | mojulu wele |
| `.` | fɛrɛ soro | `#?` | wɛrɛ dati |
| `#\|..\|` | nɔnɔ kalan | `##.` | kɛ lafiɲɛ |
| `###` | kɛ dɔn (kili) | `##!` | kɛ dɔn (bɔ) |
| `#.N\|..\|` | kili | `#!N\|..\|` | bɔ |
| `#,\|..\|` | koma sɛbɛn | `#^\|..\|` | sayansi |
| `#d0d9#` | nɔnɔ cogo falen | `#09#` | segin ASCII ma |
| `<\ ..\>` | sheli baara | `>\<` | CLI kumaw |
| `\ furancalen` | furancalen bɔ | `°x` / `x°` | falen (kɛ fanɲɛmɔgɔnya) |
| `>>|` | TUI foli (sirilen fanba) | `>>~` | sigiyɔrɔ naani |
| `>>!` | sirilen sariya | `>>?` | terminal bonɲa lajɛ |
| `<<\|` | tabali kɛcogo min bɛ dogo | `<<\|?` | tabali kɛcogo min tɛ dogo |
| `@~ N` | sunɔgɔ N milisegɔndi | `$*` | kala falen N tuman |

---

## Fason Baara Kɛcogo

### v0.0.5 — TUI Labɛnw, Falen & Kala Falen _(Mɛ 2026)_

- **Bɔn** Labɛn bulateli: `cogo : segin` → `cogo => segin`
- **Bɔn** Donni tɔgɔ wɛrɛ: `<# sira <= tɔgɔ_wɛrɛ` → `<# sira => tɔgɔ_wɛrɛ`
- **Bɔn** Naani tɔgɔ falen: `#> { fn <= jɛkulu }` → `#> { fn => jɛkulu }`
- **A don** TUI foli `>>| { }` — sirilen fanba + kalanɲuman cogo; a bɛ sariya nata kɔ
- **A don** Sigiyɔrɔ naani `>>~ (jira, kɔlɔn, BKS, fg, bg) > fɛnw` — yɔrɔw, ANSI 256 kɔlɔr
- **A don** Tabali donni `<<| furancalen` (min bɛ dogo) ani `<<|? furancalen` (min tɛ dogo)
- **A don** `>>!` sirilen sariya, `>>?` terminal bonɲa lajɛ, `@~ N` sunɔgɔ N milisegɔndi
- **A don** Falen `°x` / `x°` — furancalen daminɛ fanɲɛmɔgɔnya kabakuru laban waati
- **A don** Kala falen `kala $* N` — kala falen N tuman
- **VM** Ɲɔgɔnɲɔgɔnnya: fɛrɛntan 436/436 bɛ baara kɛ

### v0.0.4 — Jatemin 1-natigɛ, Baarakɛcogow Foli & Mojulu Foli _(Awirili 2026)_

- **Bɔn** Jatemin bɛɛ falen **1-natigɛ** — `arr[1]` ye siɲɛ foli; `arr[0]` ye daminɛ waati hakɛla
- **A don** Tɔgɔsɔrɔ baarakɛcogow ye **foli hakɛw** — ci waliden ma HOF: `nɔnɔw$> fila`
- **A don** **Foli sɔrɔcogo ka kan** mojulu ma: `# tɔgɔ { ... }` — sɔrɔcogo min tɛ foli a bɔra
- **A don** Jatemin caman: `arr[i>j>k]` (ɲɛtaga), `arr[p ; q]` (foli)
- **A don** Wɛrɛ falen: `##.kuma` (lafiɲɛ), `###kuma` (dɔn kili), `##!kuma` (dɔn bɔ)
- **A don** Kala teli: `kala$/ teli` — a bɛ segin `Array(kala)`
- **A don** Falen dilan: `natigɛ$++ a b c` — a bɛ fɛn caman fara
- **A don** Kabakuru tuman: `@ N { }` — falen N tuman
- **A don** Kabakuru tɔgɔsɔrɔ sɔrɔcogo: `@:tɔgɔ { }`, `@:tɔgɔ!`, `@:tɔgɔ>` — a bɛ falen `@ @tɔgɔ` / `@! tɔgɔ`
- **A don** Furancalen fanɲɛmɔgɔya sariyaw: furancalen `_tɔgɔ` bɛ fanɲɛmɔgɔya foli kɛnɛ; `\ furancalen` bɔ daminɛ
- **A don** Labɛn jatigɛli cogo: `< 0 =>`, `> 5 =>`, `== 42 =>`, ww.
- **A don** Mojulu E013 hakɛla: laadalikɛ minnu bɛ se ka kɛ mojulu bagan kɔnɔ tɛ se
- **A laban** `alias.CONST` bɛ se ka kɛ sisan; `#>` bɛ se ka kɛ baarakɛcogo kalanw kɔ
- **VM** Ɲɔgɔnɲɔgɔnnya bɛɛ: fɛrɛntan 393/393 bɛ baara kɛ

### v0.0.3 — Unicode Nɔnɔ Cogo & LSP Labɛnw _(Awirili 2026)_

- **A don** Unicode nɔnɔ foli 69 ni cogo falen `#d0d9#`
- **A don** Booliyan litɛraliw sɛbɛn o sɛbɛn la — `#१` / `#०`, `#१` / `#०`, ww.
- **A don** Klingon pIqaD nɔnɔw (CSUR PUA U+F8F0–U+F8F9)
- **A don** VM baarakɛcogo `SetNumeralMode` — ɲɔgɔnɲɔgɔnnya bee ni tree-walker
- **Falen** Booliyan `>>` naani bɛ `#` jalajali sisan (`#0` / `#1`) cogo bɛɛ

### v0.0.2_01 — Baarakɛcogo Tɔgɔ Falen _(30 Marsi 2026)_

- **Falen** `c|..|` → `#,|..|` ani `e|..|` → `#^|..|` — ka ɲɔgɔnɲɔgɔn ni jalajali `#` sigida
- **A don** Naani tɔgɔ wɛrɛ: mojulu sigida minɛ ni tɔgɔ wɛrɛ

### v0.0.2 — Jɛkulu API Labɛn ani Donni _(24 Marsi 2026)_

- **A don** `$` baarakɛcogow kelen na jatebɔliw ani kalaw ma (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **A don** Kunnafoni kalanw jatemin jatebɔliw, tupulu, ani tupulu tɔgɔsɔrɔ ma
- **A don** Jatemin ɲinincogo (`arr[-1]` = siɲɛ laban)
- **A don** Donni kɛcogo — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Marsi 2026)_

- **A don** Jatemin falen `^=`
- **Laban** Kalandilaw jatebɔli hakɛ; sɛbɛnw laban

### v0.0.1 — Fason Baara Kɛcogo Fol _(22 Marsi 2026)_

- Tree-walker ɲɛnajugukɛcogo + VM (`--vm`, ~4× ka gɛlɛn, ~95% ɲɔgɔnɲɔgɔnnya)
- Labɛnw bɛɛ: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Unicode jateminw bɛɛ, mojulu cikuruyɔrɔ, lamedaw, dalanw, hakɛla jatigɛli
- REPL, LSP, VS Code farikolo, sɛbɛn (`zymbol fmt`)

---

_Zymbol-Lang — Jatemin. Dunuɲa. Min tɛ falen._
