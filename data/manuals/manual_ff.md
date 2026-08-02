> **Jaaborgal:** Nde winndannde ko faamu kaŋko (AI) waɗi, firti kadi.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Tuugorgal kanonikal ngal ko **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** woni e nder repo firo.

---

# Deftere Zymbol-Lang

> **Ƴeewtaama ngam v0.0.5 — 2026-05-14**

**Zymbol-Lang** ko ɗemngal konsollungal. Alaa kelme tati — fof ko konsol. Ngal huuwirta no woori e ɗemngal aade kala.

- Alaa `if`, `while`, `return` — tan ko `?`, `@`, `<~`
- Unicode timmuka — anndirɗi e ɗemngal kala maa emoji
- Ngalaa jokkondirde e ɗemngal aade — kodu on ko gooto e kala nokku

**Firo danyngol**: v0.0.5 | **Teskorde kuutoragol**: 436/436 (anndal TW ↔ VM)

---

## Waylooji e Tablitiiɗi

```zymbol
x = 10              // wayloore waylaande
π := 3.14159        // tablitunde — jalbineede goɗɗom ko bonannde e saa'i huuwitorgo
innde = "Alisi"
golloto = #1         // boolean goonga
👋 := "Aadaama"
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

`°` (maande daraje, U+00B0) fuɗɗotoo wayloore ndee e njoyngo mum laaɓtungo e huutoreede arandeere:

```zymbol
limle = [3, 1, 4, 1, 5]
@ n:limle {
    °fotoode += n    // fuɗɗaare otomatik e 0 dow kowru; heddotoo ko caggal @
}
>> fotoode ¶         // → 14
```

> `°x` (adadu) ruttoto dow kowru — ko yaltata heen heɓetee ko caggal `@`.
> `x°` (caggaldu) ruttoto e nder kowru — maayay ko kowru on jooɗa.
> Tree-walker tun.

---

## Ndenndi Data

| Ndenndi | Kilngal | Taggu `#?` | Noteeji |
|------|---------|----------|---------|
| Limre timmunde | `42`, `-7` | `###` | 64-bit waɗnde maande |
| Limre feeñunde | `3.14`, `1.5e10` | `##.` | Binndol ganndal hokkaama |
| Kirin | `"binndannde"` | `##"` | Mittingol: `"Aadaama {innde}"` |
| Alfaa | `'A'` | `##'` | Alfaa Unicode gooto |
| Boolean | `#1`, `#0` | `##?` | Hinaa limre — `#1 ≠ 1` |
| Dawre | `[1, 2, 3]` | `##]` | Geɗe nannduɗe |
| Tuple | `(a, b)` | `##)` | Doggorgal |
| Tuple jogiiɗo innde | `(x: 1, y: 2)` | `##)` | Tulde jogiiɗe innde |
| Kuugal | tuugorgal kuugal jogiiɗo innde | `##()` | Darja arandeere; holnay `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Darja arandeere; holnay `<lambd/N>` |

```zymbol
// Ƴeewndo ndenndi — artay (ndenndi, limooje, njoyngo)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Ko yaltata e ko naatata

```zymbol
>> "Aadaama" ¶                       // ¶ maa \\ ngam fowru hesowru sewnde
>> "a=" a " b=" b ¶               // fokkondingol — njoyɗi keewɗi
>> (arr$#) ¶                      // kuutorɗe caggaldu njiɗi ( ) e nder >>

>> innde                           // jang e wayloore (ngaaɗaa neldu)
>> "Naatu innde: " innde            // e neldu
```

> `¶` (AltGr+R e dow karasi Islannaawe) e `\\` ko fowru hesowru nannduɗu.

---

## TUI Fuɗɗorɗe

Kuutorɗe ndondiko kuutaroowo terminal ngam porogaraamuuji jokkondirɗi. Ko ɓuri heewde e mayri njiɗi fulo `>>| { }` (ekran lomto + mode bonɗo).

```zymbol
>>| {
    >>!                             // ɓenndu ekran lomto
    >>~ (1, 1, 0, 10) > "Gollo"   // fowru 1, tawtugol 1, fg=10 (ko wuurɗo)
    @~ 1000                         // duro sekend gooto (1000 ms)
    >>~ (2, 1) > "Timminii."
}
// terminal artotoo ko otomatik to baddo
```

```zymbol
// Paande keyɓere e teddungal terminal
>>| {
    [fowruuji, tawtugol] = >>?              // lando teddungal terminal
    >>~ (1, 1) > "Terminal: " fowruuji " x " tawtugol
    <<| keyɓe                         // jang paande keyɓere uddaande
    >>~ (2, 1) > "Njamuɗaa: " keyɓe
}
```

> `>>!` ɓennay ekran. `>>?` artay `[fowruuji, tawtugol]`. `@~ N` ɗaayto N milisekon.
> `<<|` jangay paande keyɓere gootol (uddaande); `<<|?` ƴeewtaay ɓaawo uddugo (artay `'\0'` si alaa).
> Tuple yaltagol doggorgal: `(fowru, tawtugol, BKS, fg, bg)` — tulde kala waddi weddeede e komma (`>>~ (,,, 196) > "boɗeere"`).
> BKS bitmask: `1`=heƴƴuɗo, `2`=jillaaɗo, `4`=caraasi e les. ANSI 256 ɓaleeji palet (`0`=ko adii terminal).
> Tree-walker tun (so wonaa `>>!`, `>>?`, `@~`, `>>~` ɗe huuwirta e `--vm` kadi).

---

## Kuutorɗe

```zymbol
// Limle
a = 10
b = 3
n1 = a + b    // 13
n2 = a - b    // 7
n3 = a * b    // 30
n4 = a / b    // 3  (feccugol limre timmunde)
n5 = a % b    // 1
n6 = a ^ b    // 1000  (pow)

// Wontondiral — jalbinaa ngam ƴeewde
w1 = a == b    // #0
w2 = a <> b    // #1
w3 = a < b     // #0
w4 = a <= b    // #0
w5 = a > b     // #1
w6 = a >= b    // #1

// Ganndal
g1 = #1 && #0    // #0
g2 = #1 || #0    // #1
g3 = !#1         // #0
```

---

## Kirin

```zymbol
// Torhooke ɗiɗi fokkondirgol
innde = "Alisi"
n = 42

>> "Aadaama " innde " a woodi " n ¶       // fokkondingol — e nder >>
sifaa = "Aadaama {innde}, a woodi {n}"     // mittingol — kala to
```

```zymbol
s = "Aadaama aduna"
gazari = s$#                  // 11
cappa = s$[1..5]             // "Aadaa"  (1-ɓooynge, gaso e nder mum)
woodi = s$? "aduna"          // #1
cappi = "a,b,c,d"$/ ','   // [a, b, c, d]  (feccude e feccitor)
lomto = s$~~["a":"e"]        // "Aadaama eduna"
lomto1 = s$~~["a":"e":1]     // "Aadaama eduna"
fowru = "─" $* 20           // "────────────────────"  (litirde N laabi)
```

> `+` ko ngam limle tun. Ngam kirin, huutoru `,`, fokkondingol, maa mittingol.

---

## Laawol jeytangol

```zymbol
x = 7

? x > 0 { >> "moƴƴu" ¶ }

? x > 100 {
    >> "mawngu" ¶
} _? x > 0 {
    >> "moƴƴu" ¶
} _? x == 0 {
    >> "neno" ¶
} _ {
    >> "bonngu" ¶
}
```

> Taƴe `{ }` **njiɗaa** hay si ko ndennaa gootol.

---

## Nanondiral

```zymbol
// Daaranɗe
limtooji = 85
kelme = ?? limtooji {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> kelme ¶    // → B

// Kirin
lane = "boɗeere"
koodu = ?? lane {
    "boɗeere"   => "#FF0000"
    "ko wuurɗo" => "#00FF00"
    _       => "#000000"
}

// Kubaruuji wontondiral
ɓuu = -5
nokku = ?? ɓuu {
    < 0  => "leddi"
    < 20 => "dowo"
    < 35 => "ɓuuɗi"
    _    => "weeɓtuɗi"
}
>> nokku ¶    // → leddi

// Kubarul ndennaa (ba'at fulo)
n = -3
?? n {
    0    => { >> "neno" ¶ }
    < 0  => { >> "bonngu" ¶ }
    _    => { >> "moƴƴu" ¶ }
}
```

---

## Kowruji

```zymbol
@ i:0..4  { >> i " " }        // daaraande nduurnde:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // e taƴre:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // wittugol:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

lebbe = ["pome", "peer", "soobee"]
@ l:lebbe { >> l ¶ }         // ngam geɗe kala e nder dawre

@ a:"hello" { >> a "-" }
>> ¶                          // → h-e-l-l-o-  (ngam alfaa kala e nder kirin)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> yah yeeso
    ? i > 7 { @! }             // @! buuto
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Kowru buutataa
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Kowru jogiiɗo maande (buuto jowtingol)
limro = 0
@:karo {
    limro++
    ? limro >= 3 { @:karo! }
}
>> limro ¶                    // → 3
```

---

## Kuugal

```zymbol
ɓeydu(a, b) { <~ a + b }
>> ɓeydu(3, 4) ¶    // → 7

factoriyel(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factoriyel(n - 1)
}
>> factoriyel(5) ¶    // → 120
```

Kuugal kala woodi **faynde seerndunde** — ngam waawataa jangde waylooji karo. Huutoru paramaaje yaltagol `<~>` ngam waylude waylooji noddirɗo:

```zymbol
waylude(a<~, b<~) {
    fannu = a
    a = b
    b = fannu
}
x = 10
y = 20
waylude(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Kuugal jogiiɗo innde ko **njoyɗi darja arandeere** — nelu ɗum to HAF: `limle$> ɗiɗabbir`. Ngam dariingol: `x -> fn(x)` kadi woodi huunde.

---

## Lambda e Paɗe

```zymbol
ɗiɗabbir = x -> x * 2
ɓeydu = (a, b) -> a + b
>> ɗiɗabbir(5) ¶    // → 10
>> ɓeydu(3, 7) ¶  // → 10

// Lambda fulo
feccu = x -> {
    ? x > 0 { <~ "moƴƴu" }
    _? x < 0 { <~ "bonngu" }
    <~ "neno"
}

// Paaɗe — nangi faynde karo
fannu = 3
tati = x -> x * fannu
>> tati(7) ¶    // → 21

// Fabrik
waɗoowo_ɓeydu(n) { <~ x -> x + n }
ɓeydu_sappo = waɗoowo_ɓeydu(10)
>> ɓeydu_sappo(5) ¶    // → 15

// E nder dawre
kuutorɗe = [x -> x+1, x -> x*2, x -> x*x]
>> kuutorɗe[3](5) ¶    // → 25
```

---

## Dawre

Dawre **waylate** ndee e woodi geɗe **ndenndi gootol**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — heɓtugol (1-ɓooynge: geɗal arandeere)
x = arr[-1]     // 5 — maande les (geɗal gasaru)
x = arr$#       // 5 — gazari (huutoru (arr$#) e nder >>)

arr = arr$+ 6            // ɓeydu → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // naatu e nokku 2 (1-ɓooynge)
arr3 = arr$- 3           // ittu keɓtolgol arandeere njoyngo
arr4 = arr$-- 3          // ittu keɓtogol kala
arr5 = arr$-[1]          // ittu e maande 1 (geɗal arandeere)
arr6 = arr$-[2..3]       // ittu daaraande (1-ɓooynge, gaso e nder mum)

woodi = arr$? 3            // #1 — woodi
nokkuuji = arr$?? 3           // [3] — maandeeji kala njoyngo (1-ɓooynge)
cappa = arr$[1..3]          // [1,2,3] — cappa (1-ɓooynge, gaso e nder mum)
cappa2 = arr$[1:3]          // [1,2,3] — gootal, binndol dow dow limro

yaawoowo = arr$^+             // jokku yaawoowo (tun primordial)
lootoowo = arr$^-            // jokku lootoowo (tun primordial)

// Dawre tuple jogiiɗe innde/doggorgal — huutoru $^ e lambda nanondirgol
kartol = [(innde: "Carla", duuɓi: 28), (innde: "Ana", duuɓi: 25), (innde: "Bob", duuɓi: 30)]
ngam_duuɓi  = kartol$^ (a, b -> a.duuɓi < b.duuɓi)    // ngam duuɓi yaawoowo (<)
ngam_innde = kartol$^ (a, b -> a.innde > b.innde)   // ngam innde lootoowo (>)
>> ngam_duuɓi[1].innde ¶     // → Ana
>> ngam_innde[1].innde ¶    // → Carla

// Heɓtugol geɗal jemma (dawre tun)
arr[1] = 99              // jalbina
arr[2] += 5              // coftugol: +=  -=  *=  /=  %=  ^=

// Heɓtugol kuugal — artay dawre heyre; ardiinde ndee waylaake
arr2 = arr[2]$~ 99
```

> Kuutorɗe mottogol kala artay **dawre heyre**. Jalbina wertoo: `arr = arr$+ 4`.
> `$+` waawi waɗeede jokkel: `arr = arr$+ 5$+ 6$+ 7`. Kuutorɗe goɗɗe kuutoray jalbingol hakkunde.
> **Maande waɗingol ko 1-ɓooynge**: `arr[1]` ko geɗal arandeere; `arr[0]` ko bonannde e saa'i huuwitorgo.
> `$^+` / `$^-` jokkat **dawre primordial** (limle, kirin). Ngam dawre tuple, huutoru `$^` e lambda nanondirgol — laawol koodaa e nder lambda (`<` = yaawoowo, `>` = lootoowo).

**Semantik njoyngo** — jalbineede dawre ndee e wayloore woɗɗirende waɗay kopi jeytaare:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b meeɗaani heen
```

```zymbol
// Dawre jowtingol (maande waɗingol 1-ɓooynge)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[2][3] ¶    // → 6  (fowru 2, tawtugol 3)
```

---

## Tiggugol karallo

```zymbol
// Dawre
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[arandeere, *ɓaawo] = arr         // arandeere=10  ɓaawo=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ bugoytaa

// Tuple doggorgal
toowe = (100, 200)
(px, py) = toowe             // px=100  py=200

// Tuple jogiiɗo innde
neɗɗo = (innde: "Ana", duuɓi: 25, wuro: "Madrid")
(innde: n, duuɓi: d) = neɗɗo   // n="Ana"  d=25
```

---

## Tuple

Tuple ko **waylaaka** mottogol laɓingol waawuɗo jogde njoyɗi **ndenndi ceertuɗi**.
Si wonta dawre, geɗe ɗee waylate tama.

```zymbol
// Doggorgal — ndenndi filla fila hokkaama
toowe = (10, 20)
>> toowe[1] ¶    // → 10

data = (42, "Aadaama", #1, 3.14)
>> data[3] ¶     // → #1

// jogiiɗo innde
neɗɗo = (innde: "Alisi", duuɓi: 25)
>> neɗɗo.innde ¶    // → Alisi
>> neɗɗo[1] ¶      // → Alisi  (maande kadi huuwirta, 1-ɓooynge)

// jowtingol
nokku = (x: 10, y: 20)
p = (nokku: nokku, maande: "fuɗɗoode")
>> p.nokku.x ¶        // → 10
```

**Waylaake** — kaaɗel kala e waylude geɗal tuple ko bonannde e saa'i huuwitorgo:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ bonannde e saa'i huuwitorgo: tuple waylate tama
// t[1] += 5    // ❌ bonannde gootal
```

Ko heɓugol njoyngo waylaangol, huutoru `$~` (heɓtugol kuugal) — artay **tuple heyre**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← ardiinde waylaaka
>> t2 ¶    // → (10, 999, 30)

// Tuple jogiiɗo innde — tigga birni
neɗɗo = (innde: "Alisi", duuɓi: 25)
mawɗo  = (innde: neɗɗo.innde, duuɓi: 26)
>> neɗɗo.duuɓi ¶    // → 25
>> mawɗo.duuɓi ¶     // → 26
```

---

## Kuugal darja toowɗo

```zymbol
limle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ɗiɗaɓiraa  = limle$> (x -> x * 2)                  // map  → [2,4,6…20]
fofon    = limle$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
fotoode    = limle$< (0, (mottowo, x) -> mottowo + x)     // reduce → 55

// Jokkel rewrude e hakkule
taƴre1 = limle$| (x -> x > 3)
taƴre2 = taƴre1$> (x -> x * x)
>> taƴre2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Kuugal jogiiɗo innde waawi neldeede to HAF
ɗiɗabbir(x) { <~ x * 2 }
mawngu(x) { <~ x > 5 }
r = limle$> ɗiɗabbir       // ✅ tuugorgol jemma
r = limle$| mawngu       // ✅ tuugorgol jemma
```

---

## Kuutorol poppi

Nder suudu jeytu ndun noodi `_` ngam jooɗorde njoyngo poppaaɗo:

```zymbol
ɗiɗabbir = x -> x * 2
ɓeydu = (a, b) -> a + b
peeɗe = x -> x + 1

n1 = 5 |> ɗiɗabbir(_)        // → 10
n2 = 10 |> ɓeydu(_, 5)       // → 15
n3 = 5 |> ɓeydu(2, _)        // → 7

// Jokkel
n = 5 |> ɗiɗabbir(_) |> peeɗe(_) |> ɗiɗabbir(_)
>> n ¶    // → 22  (5→10→11→22)
```

---

## Jogingol bonanndeeji

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "feccugol e neno" ¶
} :! {
    >> "goɗɗum: " _err ¶    // _err jogii ko bonannde ndee
} :> {
    >> "duroo ko huuwirta" ¶
}
```

| Ndenndi | Saa'i |
|------|------|
| `##Div` | Feccugol e neno |
| `##IO` | Failu / sistema |
| `##Index` | Maande yaasi daaraande |
| `##Type` | Ndenndi nanndaani |
| `##Parse` | Feccugol data |
| `##Network` | Bonanndeeji jokkorɗi |
| `##_` | Bonannde kala (nangi-fof) |

---

## Module

```zymbol
// lib/calc.zy — mawɗo module junngo e nder taƴe
# calc {
    #> { ɓeydu, get_PI }

    _π := 3.14159
    ɓeydu(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // innde woɗɗunde njiɗaa

>> c::ɓeydu(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Yaltin ɗum e innde renndo wootere
# mylib {
    #> { _ɓeydu_nder => fotoode }

    _ɓeydu_nder(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::fotoode(3, 4) ¶    // → 7  (innde nder _ɓeydu_nder suuɗii)
```

> **Laawɗe module**: e nder `# innde { }`, tan ko `#>`, binndol kuugal, e fuɗɗooji wayloore/tablitunde kilngal hokkaama. Ndennaaji waaweteeɗi huuwirde (`>>`, `<<`, kowruji, nj.) mbaumitay bonannde E013.

---

## Mode limooje

Zymbol waawi holnude limooje e **daaranɗe limooje Unicode 69** — Devanagari, Arab-Hindi, Thai, Klingon pIqaD, Tiiɗugol Limle, taƴe LCD, e woɗɗum. Mode huuwortooɗo oo kaaƴa ko e yaltagol `>>` tan; limle nder, nden ko binary duro.

### Huuwtinde binndol

Winndu limooje `0` e `9` binndol ngol e nder `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arab-Hindi (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // ɓeydu to ASCII
```

### Yaltagol e boole

```zymbol
x = 42
>> x ¶          // → 42   (ko adii ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (toowe desimal ko duro ASCII)
>> 1 + 2 ¶      // → ३

// Boole: adadu # ko duro ASCII, limoore ndee nanndinirta
>> #1 ¶         // → #१   (goonga e Devanagari)
>> #0 ¶         // → #०   (fenaande — ceertu e ० limre timmunde neno)

x = 28 > 4
>> x ¶          // → #१   (ko yaltata e wontondiral ko mode huuwortooɗo on jokki)
```

### Limooje kilngal e nder ɗaɓɓude

Limooje binndol kala ballitaangol ko kilngal huunde — e nder daaranɗe, modulo, wontondire:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Kilngal boolean e binndol kala

`#` + limoore `0` maa `1` iwrunde e fulo kala ko kilngal boolean huunde:

```zymbol
#٠٩#
golloto = #١        // nanndi e #1
>> golloto ¶        // → #१
>> (#१ && #०) ¶ // → #०
```

> `#` **ko duro ASCII**. `#0` (fenaande) duro ceertu e `0` (limre timmunde neno) e binndol kala.

---

## Kuutorɗe Data

```zymbol
// Waylude ndenndi
f = ##.42         // → 42.0  (to feeñunde)
i = ###3.7        // → 4     (to limre timmunde, poondir)
t = ##!3.7        // → 3     (to limre timmunde, ittu)

// Feccu kirin to limre
v1 = #|"42"|      // → 42  (limre timmunde)
v2 = #|"3.14"|    // → 3.14  (feeñunde)
v3 = #|"abc"|     // → "abc"  (hakkilo, alaa bonannde)

// Poondir / Ittu
π = 3.14159265
poondir2 = #.2|π|      // → 3.14  (poondir e nokkuuji 2 desimal)
poondir4 = #.4|π|      // → 3.1416
ittu2 = #!2|π|      // → 3.14  (ittu)

// Formatting limooje
format = #,|1234567|  // → 1,234,567  (komma-feccugol)
ganndal = #^|12345.678|    // → 1.2345678e4  (ganndal)

// Kilngal lesdi
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Yaltagol waylude lesdi
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Hawrugol e shell

```zymbol
ñalawma = <\ date +%Y-%m-%d \>     // nangi stdout (yana e \n e gaso)
>> "Hannde: " ñalawma

failu = "data.txt"
ko_e_maa = <\ cat {failu} \>      // mittingol e nder yamirooje

ko_yalti = </"./subscript.zy"/>   // huuwtu skript Zymbol woɗɗum, nangi ko yalti
>> ko_yalti
```

> `><` nangi CLI aruje e dawre kirin (tree-walker tun).

---

## Firo timmungo: FizzBuzz

```zymbol
feccu(limre) {
    ? limre % 15 == 0 { <~ "FizzBuzz" }
    _? limre % 3  == 0 { <~ "Fizz" }
    _? limre % 5  == 0 { <~ "Buzz" }
    _ { <~ limre }
}

@ i:1..20 { >> feccu(i) ¶ }
```

---

## Tuugorgol maande

| Maande | Kuugal | Maande | Kuugal |
|--------|-----------|--------|-----------|
| `=` | wayloore | `$#` | gazari |
| `:=` | tablitunde | `$+` | ɓeydu (waawaa jokkeede) |
| `>>` | ko yaltata | `$+[i]` | naatu e maande (1-ɓooynge) |
| `<<` | ko naatata | `$-` | ittu arandeere ndee e njoyngo |
| `¶` / `\\` | fowru hesowru | `$--` | ittu kala e njoyngo |
| `?` | si | `$-[i]` | ittu e maande (1-ɓooynge) |
| `_?` | wotaano-si | `$-[i..j]` | ittu daaraande (1-ɓooynge) |
| `_` | wotaano / wildcard | `$?` | woodi |
| `??` | nanondiral | `$??` | yiytu maandeeji kala (1-ɓooynge) |
| `@` | kowru | `$[s..e]` | cappa (1-ɓooynge) |
| `@ N { }` | kowru N laabi | `$>` | map |
| `@!` | buuto | `$\|` | filter |
| `@>` | yah yeeso | `$<` | reduce |
| `@:innde { }` | kowru jogiiɗo maande | `$/ feccitor` | feccu kirin |
| `@:innde!` | buuto maande | `$++ a b c` | mahngo fokkondirgol |
| `@:innde>` | yah yeeso maande | `arr[i>j>k]` | maande kewtiro |
| `->` | lambda | `arr[i] = njoyngo` | heɓtugol geɗal (dawre tun) |
| `arr[i] += njoyngo` | heɓtugol coftugol | `arr[i]$~` | heɓtugol kuugal (kopi heyre) |
| `$^+` | jokku yaawoowo (primordial) | `$^-` | jokku lootoowo (primordial) |
| `$^` | jokku e nanondirɗo (tuple) | `<~` | artu |
| `\|>` | poppi | `!?` | ɓido |
| `:!` | nangu | `:>` | ɓaawo jooni |
| `#1` | goonga | `#0` | fenaande |
| `$!` | e bonannde | `$!!` | ɓeytu bonannde |
| `<#` | naatu | `#>` | yaltu |
| `#` | anndin module | `::` | noddu module |
| `.` | heɓtugol tulgol | `#?` | metadata ndenndi |
| `#\|..\|` | feccu limre | `##.` | waylu to feeñunde |
| `###` | waylu to limre timmunde (poondir) | `##!` | waylu to limre timmunde (ittu) |
| `#.N\|..\|` | poondir | `#!N\|..\|` | ittu |
| `#,\|..\|` | format komma | `#^\|..\|` | ganndal |
| `#d0d9#` | waylu mode limooje | `#09#` | ɓeydu to ASCII |
| `<\ ..\>` | huuwtu shell | `>\<` | CLI aruje |
| `\ wayloore` | maha wayloore birni | `°x` / `x°` | binndol ɓuuɓngol (fuɗɗoode otomatik) |
| `>>|` | fulo TUI (ekran lomto) | `>>~` | yaltagol doggorgal |
| `>>!` | ɓennu ekran | `>>?` | lando teddungal terminal |
| `<<\|` | paande keyɓere uddaande | `<<\|?` | ƴeewto paande keyɓere ɓaawo uddugo |
| `@~ N` | ɗaayto N milisekon | `$*` | litirde kirin N laabi |

---

## Bayyinaangu waylitugol jeytangol

### v0.0.5 — TUI Fuɗɗorɗe, Binndol Ɓuuɓngol & Litirde Kirin _(Me 2026)_

- **Bonngu** Feccitor ba'at nanondiral: `kubaru : ko yalti` → `kubaru => ko yalti`
- **Bonngu** Innde woɗɗunde naatugol: `<# laawol <= innde_woɗɗunde` → `<# laawol => innde_woɗɗunde`
- **Bonngu** Waylude innde yaltugol: `#> { fn <= renndo }` → `#> { fn => renndo }`
- **Ɗeydaama** Fulo TUI `>>| { }` — ekran lomto + mode bonɗo; ɓennay to baddo
- **Ɗeydaama** Yaltagol doggorgal `>>~ (fowru, tawtugol, BKS, fg, bg) > geɗe` — tulde seeƴuɗe, 256 ɓaleeji ANSI
- **Ɗeydaama** Naatugol keyɓe `<<| wayloore` (uddaande) e `<<|? wayloore` (ƴeewto ɓaawo uddugo)
- **Ɗeydaama** `>>!` ɓennu ekran, `>>?` lando teddungal terminal, `@~ N` ɗaayto N milisekon
- **Ɗeydaama** Binndol ɓuuɓngol `°x` / `x°` — fuɗɗoode wayloore otomatik e huutoreede arandeere e nder kowruji
- **Ɗeydaama** Litirde kirin `kirin $* N` — litirde kirin N laabi
- **VM** Anndal: 436/436 teskooji njaha

### v0.0.4 — Maande Waɗingol 1-ɓooynge, Kuugal Darja Arandeere & Module Fulooji _(Avril 2026)_

- **Bonngu** Maande waɗingol kala waylaama to **1-ɓooynge** — `arr[1]` ko geɗal arandeere; `arr[0]` ko bonannde e saa'i huuwitorgo
- **Ɗeydaama** Kuugal jogiiɗo innde ko **njoyɗi darja arandeere** — nelu ɗum to HAF: `limle$> ɗiɗabbir`
- **Ɗeydaama** **Binndol fulo njiɗaa** ngam module: `# innde { ... }` — binndol nelngol ittaama
- **Ɗeydaama** Maande waɗingol keewngal: `arr[i>j>k]` (kewtiro), `arr[p ; q]` (momtugol nelngol)
- **Ɗeydaama** Waylude ndenndi: `##.ɗemngal` (feeñunde), `###ɗemngal` (limre timmunde poondir), `##!ɗemngal` (limre timmunde ittu)
- **Ɗeydaama** Feccugol kirin: `kirin$/ feccitor` — artay `Array(kirin)`
- **Ɗeydaama** Mahngo fokkondirgol: `ɓooynge$++ a b c` — ɓeydu geɗe keewɗe
- **Ɗeydaama** Kowru laabi: `@ N { }` — litirde N laabi
- **Ɗeydaama** Binndol kowru jogiiɗo maande: `@:innde { }`, `@:innde!`, `@:innde>` — lomto `@ @innde` / `@! innde`
- **Ɗeydaama** Laawɗe faynde wayloore: waylooje `_innde` woodi faynde fulo ɓurngo; `\ wayloore` mahaa ko adii
- **Ɗeydaama** Kubaruuji wontondiral nanondiral: `< 0 =>`, `> 5 =>`, `== 42 =>`, nj.
- **Ɗeydaama** Bonannde module E013: ndennaaji waaweteeɗi huuwirde e nder mawɗo module haraama
- **Ɓeydaama** `alias.CONST` jooni nawrato ko goonga; `#>` waawi feeñde caggal binndol kuugal
- **VM** Anndal timmungal: 393/393 teskooji njaha

### v0.0.3 — Daaranɗe Limooje Unicode & Ɓeydagol LSP _(Avril 2026)_

- **Ɗeydaama** Fulooji limooje Unicode 69 e maande waylude mode `#d0d9#`
- **Ɗeydaama** Kilngal boolean e binndol kala — `#१` / `#०`, `#١` / `#٠`, nj.
- **Ɗeydaama** Limooje Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Ɗeydaama** Opcode VM `SetNumeralMode` — anndal timmungal e tree-walker
- **Waylaama** Yaltagol boolean `>>` jooni ina waɗi adadu `#` (`#0` / `#1`) e mode kala

### v0.0.2_01 — Waylude Innde Kuutorol _(30 Mars 2026)_

- **Waylaama** `c|..|` → `#,|..|` e `e|..|` → `#^|..|` — nanondiral e gorɗo adadu `#`
- **Ɗeydaama** Innde woɗɗunde yaltugol: yaltin module jeytaare e innde woɗɗunde

### v0.0.2 — Ɓayyinoore API mottogol & Ɗeydugol _(24 Mars 2026)_

- **Ɗeydaama** Gorɗo kuutorol `$` jokkondirɗo ngam dawre e kirin (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Ɗeydaama** Jalbingol tiggugol karallo ngam dawre, tuple, e tuple jogiiɗi innde
- **Ɗeydaama** Maande les (`arr[-1]` = geɗal gasaru)
- **Ɗeydaama** Ɗeydugol kosam — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mars 2026)_

- **Ɗeydaama** Jalbingol coftugol `^=`
- **Ɓeydaama** Keso limle feccinoowo; Ɓeydogol winndiyanke

### v0.0.1 — Jeytangol arandeere renndo _(22 Mars 2026)_

- Firo tree-walker + VM binndol (`--vm`, ~4× docci, ~95% anndal)
- Mahdiiji kala jeytiiɗi: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Anndirɗi Unicode timmuka, sistema module, lambda, paɗe, jogingol bonanndeeji
- REPL, LSP, ɓeydagol VS Code, format (zymbol fmt)

---

_Zymbol-Lang — Konsol. Winndereyankeewo. Waylaaka._