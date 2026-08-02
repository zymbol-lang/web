# Zymbol-Lang karni poi cmalu

**Zymbol-Lang** cu selsni bangu poi se ciska le tadji be lo sampu ciska. Noda valsi cu nitcu — ro da tadji. Gi'e simsa lo prenu bangu ro da.

- Noda valsi (lo `if`, `while`, `return` cu na zasti — ka'e tadji `?`, `@`, `<~`)
- Mulno Unikodi — cmene fi ro bangu ji'a emoji 👋
- Bangu-sarcu na — lo ciska cu dunli fi ro bangu

---

## stika je stodi

```zymbol
x = 10              // stika (ka'e galfi)
PI := 3.14159       // stodi (na ka'e galfi — srera fi lo nu stika)
cmene = "Ana"
jetnu_ = #1         // jetnu bulea
👋 := "coi"
```

```zymbol
x = 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 3    // 8
x %= 3    // 2
x ^= 2    // 4
x++       // 5
x--       // 4
```

---

## klesi be lo datni

| klesi           | va'u              | tadji `#?` | notci                               |
|-----------------|-------------------|------------|-------------------------------------|
| namcu           | `42`, `-7`        | `###`      | 64-bitni                            |
| flanu namcu     | `3.14`, `1.5e10`  | `##.`      | saientifi notci OK                  |
| valsi           | `"coi"`           | `##"`      | zbasu: `"coi {cmene}"`              |
| lerfu           | `'A'`             | `##'`      | pa Unikodi lerfu                    |
| jetnu/jitfa     | `#1`, `#0`        | `##?`      | NA lo namcu 1 e 0                   |
| porsi           | `[1, 2, 3]`       | `##]`      | ro se porsi cu dunli klesi          |
| tuple           | `(a, b)`          | `##)`      | tcita                               |
| cmene tuple     | `(x: 1, y: 2)`    | `##)`      | ka'e catlu fi cmene ji'a tcita      |

```zymbol
// klesi catlu — krefu (klesi, cifni, nilji)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## cusku je ckaji

```zymbol
>> "coi, munje!" ¶                      // ¶ ji'a \\ cu cusku salpo
>> "a=" a " b=" b ¶                     // so'i valsi fi jecta
>> (arr$#) ¶                            // postfiksi cu nitcu kresa

<< cmene                                // noda cmana — tcidu fi stika
<< "do cmene ma? " cmene                // fi cmana
```

> `¶` (AltGr+R lo hispana) ji'a `\\` cu dunli fi lo salpo tadji.

---

## mekso

```zymbol
// sumji mekso — pilno stika; drata ka'e ranmi fi >>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (namcu tenfa)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (tenfa)

// cimni
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// nibli
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## lerfu valsi

```zymbol
// ci klesi — ro pa fi ri tcita
cmene = "Ana"
n = 42

notci = "coi ", cmene, "!"              // koma — fi stika
>> "coi " cmene " do namcu " n ¶        // jecta — fi cusku >>
skicu = "coi {cmene}, do namcu {n}"     // zbasu — fi ro tcita
```

```zymbol
s = "coi munje"
clani = s$#                  // 9
pagbu = s$[0..3]             // "coi"  (fanmo na ckaji)
ckaji = s$? "munje"          // #1
porsi = "a,b,c,d" / ','     // [a, b, c, d]
anst = s$~~["o":"0"]         // "c0i munj0"
anst1 = s$~~["o":"0":1]      // "c0i munje"  (pa N toi)
```

> `+` ka'e namcu. fi valsi cu cusku peske.

---

## minde be lo pluta

```zymbol
x = 7

? x > 0 { >> "zenba" ¶ }

? x > 100 {
    >> "mutce" ¶
} _? x > 0 {
    >> "zenba" ¶
} _? x == 0 {
    >> "no" ¶
} _ {
    >> "jdika" ¶
}
```

> Lo bloku `{ }` cu **nitcu**, ji'a fi pa loi.

---

## Match

```zymbol
// cmana fi porsi
noda = 85
jdice = ?? noda {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> jdice ¶    // → B

// valsi
skari = "xunre"
kodi = ?? skari {
    "xunre"  : "#FF0000"
    "crino"  : "#00FF00"
    _        : "#000000"
}

// ganse
temp = -5
stato = ?? temp {
    _? temp < 0  : "bisli"
    _? temp < 20 : "lenku"
    _? temp < 35 : "glare"
    _            : "mutce glare"
}
>> stato ¶    // → bisli

// bloku tadji
?? n {
    0        : { >> "no" ¶ }
    _? n < 0 : { >> "jdika" ¶ }
    _        : { >> "zenba" ¶ }
}
```

---

## rapli

```zymbol
@ i:0..4  { >> i " " }        // inkluzivi cmana:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // fi plana:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // bapli cmana:      5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (nandu)

grute = ["plise", "perli", "vreji"]
@ f:grute { >> f ¶ }          // ro se porsi

@ c:"coi" { >> c "-" }
>> ¶                          // → c-o-i-  (ro lerfu be valsi)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> dauno
    ? i > 7 { @! }             // @! sisti
    >> i " "
}
>> ¶                          // → 1 3 5 7

// siste rapli
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// cmene rapli (nestita sisti)
konto = 0
@ @bartu {
    konto++
    ? konto >= 3 { @! bartu }
}
>> konto ¶                    // → 3
```

---

## fancu

```zymbol
sumji(a, b) { <~ a + b }
>> sumji(3, 4) ¶    // → 7

faktori(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktori(n - 1)
}
>> faktori(5) ¶    // → 120
```

fancu cu **solji tcita** — na ka'e catlu lo bartu stika. pilno exo parametri `<~` fi galfi stika be lo vokei:

```zymbol
barti(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
barti(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> cmene fancu na se jdima. fi pase fi tcita, pilno: `x -> fn(x)`.

---

## lambda je bende

```zymbol
relkai = x -> x * 2
sumji = (a, b) -> a + b
>> relkai(5) ¶    // → 10
>> sumji(3, 7) ¶   // → 10

// bloku lambda
fancu = x -> {
    ? x > 0 { <~ "zenba" }
    _? x < 0 { <~ "jdika" }
    <~ "no"
}

// bende — lambda cu kei lo bartu stika
facto = 3
cimei = x -> x * facto
>> cimei(7) ¶    // → 21

// fancu zbasu
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// lambda fi porsi
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## porsi

Porsi cu **galfi** je ka'e — ro stika cu **pa klesi**. Porsi cu na stodi — stika ka'e galfi.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — catlu (0-bazi)
arr[-1]         // 5 — bapli tcita (fanmo)
arr$#           // 5 — clani (kresa nitcu fi >>)

arr = arr$+ 6            // jmina → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // jmina fi tcita 2
arr3 = arr$- 3           // vimcu pa nilji be valsi
arr4 = arr$-- 3          // vimcu ro nilji
arr5 = arr$-[0]          // vimcu fi tcita
arr6 = arr$-[1..3]       // vimcu cmana (fanmo na ckaji)

ckaji = arr$? 3          // #1 — ckaji
tcita = arr$?? 3         // [2] — ro tcita be valsi
pagbu = arr$[0..3]       // [1,2,3] — pagbu (fanmo na ckaji)
pagbu2 = arr$[0:3]       // [1,2,3] — sama, namcu tadji

zenba = arr$^+           // sorto zenba  (sampu toi)
jdika = arr$^-           // sorto jdika  (sampu toi)

// cmene/tcita tuple porsi — pilno $^ fi cimni lambda
db = [(cmene: "Karla", nanca: 28), (cmene: "Ana", nanca: 25), (cmene: "Bob", nanca: 30)]
fi_nanca  = db$^ (a, b -> a.nanca < b.nanca)    // zenba fi nanca  (<)
fi_cmene  = db$^ (a, b -> a.cmene > b.cmene)    // jdika fi cmene (>)
>> fi_nanca[0].cmene ¶     // → Ana
>> fi_cmene[0].cmene ¶     // → Karla

// Galfi fi tcita (porsi toi) — Direct element update (arrays only)
arr[1] = 99              // stika — assign
arr[0] += 5              // sujni galfi: +=  -=  *=  /=  %=  ^= — compound

// Fancu galfi — krefu cnino porsi; original na galfi
arr2 = arr[1]$~ 99
```

> Ro kolekto tadji cu krefu **cnino porsi**. stika: `arr = arr$+ 4`.
> Na jonta: pilno re drata stika.
> `$^+` / `$^-` sorto **sampu porsi** (namcu, valsi). fi tuple porsi pilno `$^` fi cimni lambda — direkco fi lambda (`<` = zenba, `>` = jdika).

**Valsi semantiko (Value semantics)** — Stika porsi cu krefu cnino kopio rarna:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b na galfi
```

```zymbol
// nestita porsi
matrico = [[1,2,3],[4,5,6],[7,8,9]]
>> matrico[1][2] ¶    // → 6
```

---

## vimcu pagbu

```zymbol
// porsi
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[cfari, *resto] = arr        // cfari=10  resto=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ na tcidu

// tcita tuple
punkto = (100, 200)
(px, py) = punkto            // px=100  py=200

// cmene tuple
prenu = (cmene: "Ana", nanca: 25, tcadu: "Madrido")
(cmene: n, nanca: a) = prenu  // n="Ana"  a=25
```

---

## tuple

Tuple cu **na galfi** — ka'e teni **drata klesi**. Na porsi — stika na ka'e galfi ca zbasu.

```zymbol
// tcita
punkto = (10, 20)
>> punkto[0] ¶    // → 10

datni = (42, "coi", #1, 3.14)
>> datni[2] ¶     // → #1

// cmene
prenu = (cmene: "Alice", nanca: 25)
>> prenu.cmene ¶    // → Alice
>> prenu[0] ¶       // → Alice  (tcita ji'a ka'e)

// nestita
poz = (x: 10, y: 20)
p = (poz: poz, cmene: "cfari")
>> p.poz.x ¶        // → 10
```

**Na galfi (Immutability)** — Ro nu troci galfi stika be tuple cu srera:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ srera: tuple cu na galfi
// t[0] += 5    // ❌ sama srera
```

Fi krefu galfi valsi pilno `$~` (fancu galfi) — krefu **cnino** tuple:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← original na galfi
>> t2 ¶    // → (10, 999, 30)

// Cmene tuple — zbasu naur
prenu = (cmene: "Alice", nanca: 25)
ci_prenu = (cmene: prenu.cmene, nanca: 26)
>> prenu.nanca ¶       // → 25
>> ci_prenu.nanca ¶    // → 26
```

---

## fancu poi galtu

> HOF cu nitcu **enlinia lambda** — na stika-lambda tcita.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

relkai  = nums$> (x -> x * 2)               // map  → [2,4,6…20]
relti   = nums$| (x -> x % 2 == 0)          // filter → [2,4,6,8,10]
sumji   = nums$< (0, (acc, x) -> acc + x)   // reduce → 55

// jonta fi meza stika
pazo1 = nums$| (x -> x > 3)
pazo2 = pazo1$> (x -> x * x)
>> pazo2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// cmene fancu fi HOF — envolvar fi lambda
relkai(x) { <~ x * 2 }
r = nums$> (x -> relkai(x))    // ✅
```

---

## pipe jufra

Lo dextra cu nitcu `_` fi tcita be lo pipe valsi:

```zymbol
relkai = x -> x * 2
sumji = (a, b) -> a + b
jmina = x -> x + 1

5 |> relkai(_)        // → 10
10 |> sumji(_, 5)     // → 15
5 |> sumji(2, _)      // → 7

// jonta
r = 5 |> relkai(_) |> jmina(_) |> relkai(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## fapro be lo srera

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "tenfa fi no" ¶
} :! {
    >> "drata srera: " _err ¶    // _err cu stika lo srera notci
} :> {
    >> "ro roi gasnu" ¶
}
```

| klesi       | ca gasnu                        |
|-------------|---------------------------------|
| `##Div`     | Tenfa fi no                     |
| `##IO`      | Datni / Sistemi                 |
| `##Index`   | Tcita bartu                     |
| `##Type`    | Klesi srera                     |
| `##Parse`   | Porsi srera                     |
| `##Network` | Muvdu srera                     |
| `##_`       | Ro srera (kaptu ro)             |

---

## modli

```zymbol
// datni: lib/calc.zy
# calc

#> { sumji, get_PI }    // cusku PURCI lo jarco

_PI := 3.14159
sumji(a, b) { <~ a + b }
get_PI() { <~ _PI }     // getter — direkta stodi catlu fi cmena na subtenata
```

```zymbol
// datni: main.zy
<# ./lib/calc <= c    // cmena nitcu

>> c::sumji(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// cusku fi drata cmene
# modli_mi
#> { _jbocme_sumji <= sumji }

_jbocme_sumji(a, b) { <~ a + b }
```

```zymbol
<# ./modli_mi <= m

>> m::sumji(3, 4) ¶    // → 7  (cmene _jbocme_sumji cu na jarco)
```

---

## namcu liste

Zymbol ka'e jarco namcu fo **Unicode namcu liste 69** — Devanagari, arabi-xindo, tai, klingon pIqaD, cmaci tumla, LCD je drata. zo'e liste co'a srana le `>>`-judri; namcu ke'a binary.

### liste co'a pilno

ciska le namcu `0` e `9` fo le liste fo `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // arabi-xindo   (U+0660–U+0669)
#๐๙#    // tai           (U+0E50–U+0E59)
#09#    // ASCII co'a
```

### judri e jitfa jetnu

```zymbol
x = 42
>> x ¶          // → 42   (ASCII ni'a)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (decimal ASCII)
>> 1 + 2 ¶      // → ३

// jetnu: # ASCII, namcu galfi
>> #1 ¶         // → #१
>> #0 ¶         // → #०

x = 28 > 4
>> x ¶          // → #१
```

### asli namcu fo liste

ro namcu liste literal — porsi, modulo, vreji:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### jetnu literal fo liste

`#` + namcu `0` a `1` bloc jetnu literal:

```zymbol
#٠٩#
نشط = #١
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **ASCII**. `#0` (jitfa) drata `0` (namcu nomo) ro liste.

---

## datni mekso

```zymbol
// porsi valsi fi namcu
v1 = #|"42"|      // → 42  (namcu)
v2 = #|"3.14"|    // → 3.14  (flanu namcu)
v3 = #|"abc"|     // → "abc"  (fail-safe, na srera)

// cimni / vimcu
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (cimni fi 2 ki'o)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (vimcu)

// namcu tadji
fmt = #,|1234567|      // → 1,234,567  (koma tadji)
sci = #^|12345.678|    // → 1.2345678e4  (saientifi)

// baze valsi
a = 0x41         // → 'A'  (hexadecimala)
b = 0b01000001   // → 'A'  (binara)
c = 0o101        // → 'A'  (oktala)

// baze galfi cusku
heks = 0x|255|    // → "0x00FF"
bin  = 0b|65|     // → "0b1000001"
okt  = 0o|8|      // → "0o10"
dec  = 0d|255|    // → "0d0255"
```

---

## samru gunma

```zymbol
detri = <\ date +%Y-%m-%d \>     // kei stdout (inkluzas fanmo \n)
>> "cabna: " detri

datni = "datni.txt"
nei = <\ cat {datni} \>          // zbasu fi samru

cusku = </"./selpre.zy"/>        // gasnu drata Zymbol, kei cusku
>> cusku
```

> `><` cu kei CLI tcita fi valsi porsi (arba-pedna toi).

---

## gasnu co mulno: FizzBuzz

```zymbol
fancu(namcu) {
    ? namcu % 15 == 0 { <~ "FizzBuzz" }
    _? namcu % 3  == 0 { <~ "Fizz" }
    _? namcu % 5  == 0 { <~ "Buzz" }
    _ { <~ namcu }
}

@ i:1..20 { >> fancu(i) ¶ }
```

---

## liste be lo tadji

| tadji      | gasnu              | tadji        | gasnu                   |
|------------|--------------------|--------------|-------------------------|
| `=`        | stika              | `$#`         | clani                   |
| `:=`       | stodi              | `$+`         | jmina                   |
| `>>`       | cusku              | `$+[i]`      | jmina fi tcita          |
| `<<`       | ckaji              | `$-`         | vimcu pa fi valsi       |
| `¶` / `\\` | salpo              | `$--`        | vimcu ro fi valsi       |
| `?`        | go'i               | `$-[i]`      | vimcu fi tcita          |
| `_?`       | alisego'i          | `$-[i..j]`   | vimcu cmana             |
| `_`        | alie / tcita       | `$?`         | ckaji                   |
| `??`       | match              | `$??`        | ro tcita be valsi       |
| `@`        | rapli              | `$[s..e]`    | pagbu                   |
| `@!`       | sisti (break)      | `$>`         | map                     |
| `@>`       | dauno              | `$\|`        | filter                  |
| `->`       | lambda             | `$<`         | reduce                  |
| `arr[i] = val` | galfi fi tcita (update in-place) | `arr[i] +=` | sujni galfi (compound update) |
| `arr[i]$~` | fancu galfi (functional update) | `$^+` | sorto zenba             |
| `$^-`      | sorto jdika        | `$^`         | sorto fi cimni          |
| `<~`       | krefu              | `!?`         | troci (try)             |
| `\|>`      | pipe               | `:!`         | kei (catch)             |
| `#1`       | jetnu              | `:>`         | ro roi (finally)        |
| `#0`       | jitfa              | `$!`         | srera ckaji             |
| `<#`       | ckaji modli        | `$!!`        | disvastigi srera        |
| `#`        | jarco modli        | `#>`         | cusku modli             |
| `::`       | modli vokei        | `.`          | kampo catlu             |
| `#\|..\|`  | porsi namcu        | `#?`         | klesi datni             |
| `#.N\|..\|` | cimni             | `#!N\|..\|`  | vimcu                   |
| `#,\|..\|`  | koma tadji         | `#^\|..\|`    | saientifi               |
| `#d0d9#` | liste galfi | `#09#` | ASCII co'a |
| `<\ ..\>`  | samru gasnu        | `><`         | CLI tcita               |

## versio-notci

### v0.0.3 — Unicode namcu & LSP _(abril 2026)_

- **jdika** Unicode bloc 69 token `#d0d9#`
- **jdika** jetnu literal fo liste — `#१` / `#०`, `#१` / `#٠`, e drata
- **jdika** klingon pIqaD namcu (CSUR PUA U+F8F0–U+F8F9)
- **jdika** VM opcode `SetNumeralMode` — tree-walker
- **jdika** REPL liste echo variable
- **galfi** `>>` jetnu `#` (`#0` / `#1`) liste

### v0.0.2_01 _(30 Mar 2026)_

- **galfi** `c|..|` → `#,|..|` e `e|..|` → `#^|..|`
- **jdika** export alias

### v0.0.2 _(24 Mar 2026)_

- **jdika** `$` arrays e strings (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **jdika** destructuring arrays, tuples
- **jdika** index ni'a (`arr[-1]`)
- **jdika** instali — Linux, macOS, Windows

### v0.0.1-patch _(25 Mar 2026)_

- **jdika** `^=`

### v0.0.1 _(22 Mar 2026)_

- tree-walker + register VM (`--vm`, ~4×, ~95%)
- `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- REPL, LSP, VS Code, formatter (`zymbol fmt`)

---

*Zymbol-Lang — tadji. ro prenu. na galfi.*

> **notci:** karni ca windu gi'e fukpi fi le AI (fanva makina).
> Ro nu snada cu troci, ku'i drata valsi ja gasnu ka'e srera.
> le jibni krasi cu [Zymbol-Lang notci](https://github.com/zymbol-lang/interpreter).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors. The canonical reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
