> **Kanusho:** Hati hii imeundwa na kutafsiriwa na akili ya bandia (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Marejeo ya kisheria ni **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** kwenye hazina ya mkalimani.

---

# Mwongozo wa Zymbol-Lang

> **Iliyokaguliwa kwa v0.0.5 — 2026-05-14**

**Zymbol-Lang** ni lugha ya programu ishara. Hakuna maneno muhimu — kila kitu ni ishara. Inafanya kazi sawa katika lugha yoyote ya binadamu.

- Hakuna `if`, `while`, `return` — `?`, `@`, `<~` pekee
- Unicode kamili — vitambulishi katika lugha yoyote au emoji
- Haitegemei lugha ya binadamu — kanuni ni sawa kila mahali

**Toleo la Mkalimani**: v0.0.5 | **Ufunikaji wa Majaribio**: 436/436 (usawa wa TW ↔ VM)

---

## Vigezo na Viasili

```zymbol
x = 10              // kigezo kinachobadilika
π := 3.14159        // kisicho-badilika — kukabidhi tena ni kosa la wakati wa utekelezaji
jina = "Alice"
amilifu = #1         // boolean kweli
👋 := "Habari"
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

`°` (alama ya shahada, U+00B0) huanzisha kigezo kiotomatiki kwa thamani yake ya upande wowote kwenye matumizi ya kwanza:

```zymbol
namba = [3, 1, 4, 1, 5]
@ n:namba {
    °jumla += n    // anza kiotomatiki hadi 0 juu ya kitanzi; huishi baada ya @
}
>> jumla ¶         // → 14
```

> `°x` (kiambishi awali) hutiwa nanga juu ya kitanzi — matokeo yanapatikana baada ya `@`.
> `x°` (kiambishi tamati) hutiwa nanga ndani ya kitanzi — hufa kitanzi kinapoisha.
> tree-walker pekee.

---

## Aina za Data

| Aina | Halisi | Lebo `#?` | Maelezo |
|------|---------|----------|---------|
| Nambari kamili | `42`, `-7` | `###` | 64-bit yenye ishara |
| Sehemu inayoelea | `3.14`, `1.5e10` | `##.` | Dokezo la kisayansi linaruhusiwa |
| Kamba | `"maandishi"` | `##"` | Uingizaji: `"Habari {jina}"` |
| Herufi | `'A'` | `##'` | Herufi moja ya Unicode |
| Boolean | `#1`, `#0` | `##?` | Si nambari — `#1 ≠ 1` |
| Safu | `[1, 2, 3]` | `##]` | Vipengee vya aina moja |
| Tuple | `(a, b)` | `##)` | Kinafasi |
| Tuple yenye jina | `(x: 1, y: 2)` | `##)` | Sehemu zenye majina |
| Kazi | rejeleo la kazi yenye jina | `##()` | Daraja la kwanza; inaonyesha `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Daraja la kwanza; inaonyesha `<lambd/N>` |

```zymbol
// Uchunguzi wa aina — hurudisha (aina, tarakimu, thamani)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Pato na Ingizo

```zymbol
>> "Habari" ¶                       // ¶ au \\ kwa mstari mpya wa wazi
>> "a=" a " b=" b ¶               // uwekaji kando — thamani nyingi
>> (arr$#) ¶                      // viambatishaji vya postfiksi vinahitaji ( ) katika >>

>> jina                           // soma kwa kigezo (bila kidokezo)
>> "Weka jina: " jina            // kwa kidokezo
```

> `¶` (AltGr+R kwenye kibodi ya Kihispania) na `\\` ni mistari mipya sawa.

---

## Primitive za TUI

Viendeshaji vya kiolesura cha mtumiaji kwenye terminal kwa programu shirikishi. Nyingi zinahitaji kizuizi `>>| { }` (skrini mbadala + hali ghafi).

```zymbol
>>| {
    >>!                             // safisha skrini mbadala
    >>~ (1, 1, 0, 10) > "Inaendesha"   // safu 1, safu wima 1, fg=10 (kijani)
    @~ 1000                         // simama kwa sekunde 1 (1000 ms)
    >>~ (2, 1) > "Imekamilika."
}
// terminal inarejeshwa kiotomatiki unapotoka
```

```zymbol
// Kubonyeza kitufe na ukubwa wa terminal
>>| {
    [safu, safu_wima] = >>?              // omba vipimo vya terminal
    >>~ (1, 1) > "Terminal: " safu " x " safu_wima
    <<| kitufe                         // soma ubonyezo wa kitufe unaozuia
    >>~ (2, 1) > "Ume bonyeza: " kitufe
}
```

> `>>!` husafisha skrini. `>>?` hurudisha `[safu, safu_wima]`. `@~ N` hulala N milisekunde.
> `<<|` husoma ubonyezo wa kitufe kimoja (unaozuia); `<<|?` hupigia kura bila kuzuia (hurudisha `'\0'` ikiwa hakuna).
> Tuple ya pato la kufuatilia nafasi: `(safu, safu_wima, BKS, fg, bg)` — sehemu yoyote inaweza kuachwa kwa koma (`>>~ (,,, 196) > "nyekundu"`).
> BKS bitmask: `1`=nene, `2`=italiki, `4`=mstari wa chini. Rangi 256 za ANSI (`0`=chaguo-msingi la terminal).
> tree-walker pekee (isipokuwa `>>!`, `>>?`, `@~`, `>>~` ambazo pia hufanya kazi kwenye `--vm`).

---

## Viendeshaji

```zymbol
// Hesabu
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (mgawanyo wa nambari kamili)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (kupandisha kwa kiwango)

// Ulinganisho — kabidhi kwa ukaguzi
u1 = a == b    // #0
u2 = a <> b    // #1
u3 = a < b     // #0
u4 = a <= b    // #0
u5 = a > b     // #1
u6 = a >= b    // #1

// Kimantiki
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Kamba

```zymbol
// Miundo miwili ya uunganisho
jina = "Alice"
n = 42

>> "Habari " jina " una " n ¶       // uwekaji kando — katika >>
maelezo = "Habari {jina}, una {n}"     // uingizaji — popote
```

```zymbol
s = "Habari dunia"
urefu = s$#                  // 11
sehemu_ndogo = s$[1..5]             // "Habar"  (1-msingi, mwisho umejumuishwa)
ina = s$? "dunia"          // #1
vipande = "a,b,c,d"$/ ','   // [a, b, c, d]  (gawanya kwa kitenganishi)
badilisha = s$~~["l":"r"]        // "Habari dunia" (hakuna 'l' kwa Kiswahili)
badilisha1 = s$~~["l":"r":1]     // "Habari dunia"
mstari = "─" $* 20           // "────────────────────"  (rudia N mara)
```

> `+` ni kwa namba tu. Kwa kamba, tumia `,`, uwekaji kando, au uingizaji.

---

## Mtiririko wa Udhibiti

```zymbol
x = 7

? x > 0 { >> "chanya" ¶ }

? x > 100 {
    >> "kubwa" ¶
} _? x > 0 {
    >> "chanya" ¶
} _? x == 0 {
    >> "sifuri" ¶
} _ {
    >> "hasi" ¶
}
```

> Mabano ya mraba `{ }` **yanahitajika** hata kwa taarifa moja.

---

## Kulinganisha

```zymbol
// Mipaka
alama = 85
daraja = ?? alama {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> daraja ¶    // → B

// Kamba
rangi = "nyekundu"
msimbo = ?? rangi {
    "nyekundu"   => "#FF0000"
    "kijani" => "#00FF00"
    _       => "#000000"
}

// Mifumo ya ulinganisho
joto = -5
hali = ?? joto {
    < 0  => "barafu"
    < 20 => "baridi"
    < 35 => "vuguvugu"
    _    => "moto"
}
>> hali ¶    // → barafu

// Muundo wa taarifa (mikono ya kizuizi)
n = -3
?? n {
    0    => { >> "sifuri" ¶ }
    < 0  => { >> "hasi" ¶ }
    _    => { >> "chanya" ¶ }
}
```

---

## Vitanzi

```zymbol
@ i:0..4  { >> i " " }        // mipaka ikiwa pamoja:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // kwa hatua:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // kinyume:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

matunda = ["tufaha", "pea", "zabibu"]
@ t:matunda { >> t ¶ }         // kwa kila kipengee kwenye safu

@ h:"hello" { >> h "-" }
>> ¶                          // → h-e-l-l-o-  (kwa kila herufi kwenye kamba)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> endelea
    ? i > 7 { @! }             // @! vunja
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Kitanzi kisicho na mwisho
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Kitanzi chenye lebo (vunja iliyowekwa ndani)
hesabu = 0
@:nje {
    hesabu++
    ? hesabu >= 3 { @:nje! }
}
>> hesabu ¶                    // → 3
```

---

## Kazi

```zymbol
ongeza(a, b) { <~ a + b }
>> ongeza(3, 4) ¶    // → 7

fakulteta(n) {
    ? n <= 1 { <~ 1 }
    <~ n * fakulteta(n - 1)
}
>> fakulteta(5) ¶    // → 120
```

Kazi zina **wigo uliotengwa** — haziwezi kusoma vigezo vya nje. Tumia vigezo vya pato `<~` ili kurekebisha vigezo vya mpigaji:

```zymbol
badilisha(a<~, b<~) {
    muda = a
    a = b
    b = muda
}
x = 10
y = 20
badilisha(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Kazi zenye majina ni **thamani za daraja la kwanza** — pitisha moja kwa moja: `namba$> mara_mbili`. Kukumbatia: `x -> fn(x)` pia ni halali.

---

## Lambda na Vifungo

```zymbol
mara_mbili = x -> x * 2
ongeza = (a, b) -> a + b
>> mara_mbili(5) ¶    // → 10
>> ongeza(3, 7) ¶  // → 10

// Lambda ya kizuizi
ainisha = x -> {
    ? x > 0 { <~ "chanya" }
    _? x < 0 { <~ "hasi" }
    <~ "sifuri"
}

// Kifungo — kinasa wigo wa nje
sababu = 3
mara_tatu = x -> x * sababu
>> mara_tatu(7) ¶    // → 21

// Kiwanda
tengeneza_kijongeza(n) { <~ x -> x + n }
ongeza_kumi = tengeneza_kijongeza(10)
>> ongeza_kumi(5) ¶    // → 15

// Katika safu
viendeshaji = [x -> x+1, x -> x*2, x -> x*x]
>> viendeshaji[3](5) ¶    // → 25
```

---

## Safu

Safu **zinaweza kubadilika** na zina vipengee vya **aina sawa**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — ufikiaji (1-msingi: kipengee cha kwanza)
x = arr[-1]     // 5 — fahirisi hasi (kipengee cha mwisho)
x = arr$#       // 5 — urefu (tumia (arr$#) katika >>)

arr = arr$+ 6            // ongeza → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // ingiza kwenye nafasi ya 2 (1-msingi)
arr3 = arr$- 3           // ondoa tukio la kwanza la thamani
arr4 = arr$-- 3          // ondoa tukio zote
arr5 = arr$-[1]          // ondoa kwenye fahirisi 1 (kipengee cha kwanza)
arr6 = arr$-[2..3]       // ondoa mipaka (1-msingi, mwisho umejumuishwa)

ina = arr$? 3            // #1 — ina
nafasi = arr$?? 3           // [3] — fahirisi zote za thamani (1-msingi)
kata = arr$[1..3]          // [1,2,3] — kata (1-msingi, mwisho umejumuishwa)
kata2 = arr$[1:3]          // [1,2,3] — sawa, sarufi ya msingi wa hesabu

kupanda = arr$^+             // panga kupanda (primitive pekee)
kushuka = arr$^-            // panga kushuka (primitive pekee)

// Safu za tuple zenye majina/nafasi — tumia $^ na lambda ya kulinganisha
db = [(jina: "Carla", umri: 28), (jina: "Ana", umri: 25), (jina: "Bob", umri: 30)]
kulingana_na_umri  = db$^ (a, b -> a.umri < b.umri)    // kulingana na umri kupanda (<)
kulingana_na_jina = db$^ (a, b -> a.jina > b.jina)   // kulingana na jina kushuka (>)
>> kulingana_na_umri[1].jina ¶     // → Ana
>> kulingana_na_jina[1].jina ¶    // → Carla

// Sasisho la moja kwa moja la kipengee (safu tu)
arr[1] = 99              // kabidhi
arr[2] += 5              // mchanganyiko: +=  -=  *=  /=  %=  ^=

// Sasisho la utendaji — hurudisha safu mpya; asili haibadilika
arr2 = arr[2]$~ 99
```

> Viendeshaji vyote vya mkusanyiko hurudisha **safu mpya**. Kabidhi nyuma: `arr = arr$+ 4`.
> `$+` inaweza kuunganishwa: `arr = arr$+ 5$+ 6$+ 7`. Viendeshaji vingine hutumia uwekaji wa kati.
> **Kuweka fahirisi ni 1-msingi**: `arr[1]` ni kipengee cha kwanza; `arr[0]` ni kosa la wakati wa utekelezaji.
> `$^+` / `$^-` hupanga **safu za primitive** (namba, kamba). Kwa safu za tuple, tumia `$^` na lambda ya kulinganisha — mwelekeo umebandikwa kwenye lambda (`<` = kupanda, `>` = kushuka).

**Semantiki ya thamani** — kukabidhi safu kwa kigezo kingine huunda nakala huru:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b haijaathiriwa
```

```zymbol
// Safu zilizowekwa ndani (uwekaji fahirisi 1-msingi)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[2][3] ¶    // → 6  (safu 2, safu wima 3)
```

---

## Uharibifu wa Muundo

```zymbol
// Safu
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[kwanza, *kilichosalia] = arr         // kwanza=10  kilichosalia=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ hutupwa mbali

// Tuple ya nafasi
nukta = (100, 200)
(px, py) = nukta             // px=100  py=200

// Tuple yenye jina
mtu = (jina: "Ana", umri: 25, mji: "Madrid")
(jina: n, umri: u) = mtu   // n="Ana"  u=25
```

---

## Tuple

Tuple ni kontena zilizopangwa **zisizobadilika** ambazo zinaweza kushikilia thamani za **aina tofauti**.
Tofauti na safu, vipengee haviwezi kubadilishwa baada ya kuumbwa.

```zymbol
// Nafasi — aina mchanganyiko zinaruhusiwa
nukta = (10, 20)
>> nukta[1] ¶    // → 10

data = (42, "Habari", #1, 3.14)
>> data[3] ¶     // → #1

// Zenye jina
mtu = (jina: "Alice", umri: 25)
>> mtu.jina ¶    // → Alice
>> mtu[1] ¶      // → Alice  (fahirisi pia inafanya kazi, 1-msingi)

// Iliyowekwa ndani
nafasi = (x: 10, y: 20)
p = (nafasi: nafasi, lebo: "asili")
>> p.nafasi.x ¶        // → 10
```

**Kutobadilika** — jaribio lolote la kurekebisha kipengee cha tuple ni kosa la wakati wa utekelezaji:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ kosa la wakati wa utekelezaji: tuple haziwezi kubadilika
// t[1] += 5    // ❌ kosa sawa
```

Ili kupata thamani iliyorekebishwa tumia `$~` (sasisho la utendaji) — hurudisha **tuple mpya**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← asili haijabadilika
>> t2 ¶    // → (10, 999, 30)

// Tuple yenye jina — jenga upya kwa uwazi
mtu = (jina: "Alice", umri: 25)
mkubwa  = (jina: mtu.jina, umri: 26)
>> mtu.umri ¶    // → 25
>> mkubwa.umri ¶     // → 26
```

---

## Kazi za Kiwango cha Juu

```zymbol
namba = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

zilizokuzwa_mara_mbili  = namba$> (x -> x * 2)                  // map  → [2,4,6…20]
zilizokamilika    = namba$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
jumla    = namba$< (0, (kikusanyaji, x) -> kikusanyaji + x)     // reduce → 55

// Unganisha kupitia wapatanishi
hatua1 = namba$| (x -> x > 3)
hatua2 = hatua1$> (x -> x * x)
>> hatua2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Kazi zenye majina zinaweza kupitishwa moja kwa moja kwa HOF
mara_mbili(x) { <~ x * 2 }
ni_kubwa(x) { <~ x > 5 }
r = namba$> mara_mbili       // ✅ rejeleo la moja kwa moja
r = namba$| ni_kubwa       // ✅ rejeleo la moja kwa moja
```

---

## Kiendeshaji cha Bomba

Upande wa kulia unahitaji kila wakati `_` kama kishikilia nafasi cha thamani iliyobombwa:

```zymbol
mara_mbili = x -> x * 2
ongeza = (a, b) -> a + b
nyongeza = x -> x + 1

r1 = 5 |> mara_mbili(_)        // → 10
r2 = 10 |> ongeza(_, 5)       // → 15
r3 = 5 |> ongeza(2, _)        // → 7

// Iliyounganishwa
r = 5 |> mara_mbili(_) |> nyongeza(_) |> mara_mbili(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Ushughulikiaji wa Makosa

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "kugawanya kwa sifuri" ¶
} :! {
    >> "nyingine: " _err ¶    // _err huhifadhi ujumbe wa makosa
} :> {
    >> "huendesha kila wakati" ¶
}
```

| Aina | Wakati |
|------|------|
| `##Div` | Kugawanya kwa sifuri |
| `##IO` | Faili / mfumo |
| `##Index` | Fahirisi nje ya mipaka |
| `##Type` | Kutolingana kwa aina |
| `##Parse` | Uchanganuzi wa data |
| `##Network` | Makosa ya mtandao |
| `##_` | Kosa lolote (linakamata vyote) |

---

## Moduli

```zymbol
// lib/calc.zy — mwili wa moduli umefungwa kwenye mabano ya mraba
# calc {
    #> { ongeza, get_PI }

    _π := 3.14159
    ongeza(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // lakabu inahitajika

>> c::ongeza(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Hamirisha kwa jina tofauti la umma
# mylib {
    #> { _ongeza_ya_ndani => jumla }

    _ongeza_ya_ndani(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::jumla(3, 4) ¶    // → 7  (jina la ndani _ongeza_ya_ndani limefichwa)
```

> **Kanuni za moduli**: ndani ya `# jina { }`, `#>`, ufafanuzi wa kazi, na waanzishaji halisi wa vigezo/viasili pekee ndio wanaruhusiwa. Taarifa zinazotekelezeka (`>>`, `<<`, vitanzi, nk.) huongeza kosa E013.

---

## Hali za Tarakimu

Zymbol inaweza kuonyesha namba katika **michoro 69 ya tarakimu za Unicode** — Devanagari, Kiarabu-Kihindi, Kithai, Klingon pIqaD, Nzito za Hisabati, sehemu za LCD, na nyinginezo. Hali inayotumika inaathiri pato la `>>` pekee; hesabu za ndani huwa za binary kila wakati.

### Kuwezesha mchoro

Andika tarakimu `0` na `9` za mchoro unaolengwa ndani ya `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Kiarabu-Kihindi (U+0660–U+0669)
#๐๙#    // Kithai         (U+0E50–U+0E59)
#09#    // weka upya kwa ASCII
```

### Pato na booleani

```zymbol
x = 42
>> x ¶          // → 42   (ASCII chaguo-msingi)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (nukta ya desimali huwa ASCII)
>> 1 + 2 ¶      // → ३

// Booleani: kiambishi awali # huwa ASCII, tarakimu hubadilika
>> #1 ¶         // → #१   (kweli kwa Devanagari)
>> #0 ¶         // → #०   (uongo — inatofautiana na ० nambari kamili sifuri)

x = 28 > 4
>> x ¶          // → #१   (matokeo ya ulinganisho hufuata hali inayotumika)
```

### Tarakimu halisi za asili katika chanzo

Tarakimu za mchoro wowote unaoauniwa ni halisi halali — katika mipaka, modulo, ulinganisho:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Halisi za boolean katika mchoro wowote

`#` + tarakimu `0` au `1` kutoka kizuizi chochote ni halisi halali ya boolean:

```zymbol
#٠٩#
amilifu = #١        // sawa na #1
>> amilifu ¶        // → #१
>> (#١ && #٠) ¶ // → #०
```

> `#` **huwa ASCII**. `#0` (uongo) huwa inatofautiana kwa macho na `0` (nambari kamili sifuri) katika kila mchoro.

---

## Viendeshaji vya Data

```zymbol
// Ugeuzaji wa aina
f = ##.42         // → 42.0  (kwa sehemu inayoelea)
i = ###3.7        // → 4     (kwa nambari kamili, zungusha)
t = ##!3.7        // → 3     (kwa nambari kamili, kata)

// Changanua kamba hadi nambari
v1 = #|"42"|      // → 42  (nambari kamili)
v2 = #|"3.14"|    // → 3.14  (sehemu inayoelea)
v3 = #|"abc"|     // → "abc"  (salama, hakuna kosa)

// Zungusha / Kata
π = 3.14159265
zungusha2 = #.2|π|      // → 3.14  (zungusha hadi sehemu 2 za desimali)
zungusha4 = #.4|π|      // → 3.1416
kata2 = #!2|π|      // → 3.14  (kata)

// Uumbizaji wa nambari
umbizo = #,|1234567|  // → 1,234,567  (iliyotengwa kwa koma)
kisayansi = #^|12345.678|    // → 1.2345678e4  (kisayansi)

// Halisi za msingi
a = 0x41         // → 'A'  (heksadesimali)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (oktali)

// Pato la ugeuzaji wa msingi
heksi = 0x|255|    // → "0x00FF"
binary = 0b|65|     // → "0b1000001"
oktali = 0o|8|      // → "0o10"
desimali = 0d|255|    // → "0d0255"
```

---

## Ushirikiano wa Shell

```zymbol
tarehe = <\ date +%Y-%m-%d \>     // kinasa stdout (kinajumuisha \n mwishoni)
>> "Leo: " tarehe

faili = "data.txt"
maudhui = <\ cat {faili} \>      // uingizaji katika amri

pato = </"./subscript.zy"/>   // tekeleza hati nyingine ya Zymbol, kinasa pato
>> pato
```

> `><` hunasa hoja za CLI kama safu ya kamba (tree-walker pekee).

---

## Mfano Kamili: FizzBuzz

```zymbol
ainisha(nambari) {
    ? nambari % 15 == 0 { <~ "FizzBuzz" }
    _? nambari % 3  == 0 { <~ "Fizz" }
    _? nambari % 5  == 0 { <~ "Buzz" }
    _ { <~ nambari }
}

@ i:1..20 { >> ainisha(i) ¶ }
```

---

## Marejeleo ya Alama

| Alama | Operesheni | Alama | Operesheni |
|--------|-----------|--------|-----------|
| `=` | kigezo | `$#` | urefu |
| `:=` | kisicho-badilika | `$+` | ongeza (inaweza kuunganishwa) |
| `>>` | pato | `$+[i]` | ingiza kwenye fahirisi (1-msingi) |
| `<<` | ingizo | `$-` | ondoa kwanza kwa thamani |
| `¶` / `\\` | mstari mpya | `$--` | ondoa zote kwa thamani |
| `?` | ikiwa | `$-[i]` | ondoa kwenye fahirisi (1-msingi) |
| `_?` | vinginevyo-ikiwa | `$-[i..j]` | ondoa mipaka (1-msingi) |
| `_` | vinginevyo / msimbo wa pori | `$?` | ina |
| `??` | linganisha | `$??` | tafuta fahirisi zote (1-msingi) |
| `@` | kitanzi | `$[s..e]` | kata (1-msingi) |
| `@ N { }` | kitanzi N mara | `$>` | map |
| `@!` | vunja | `$\|` | filter |
| `@>` | endelea | `$<` | reduce |
| `@:jina { }` | kitanzi chenye lebo | `$/ kitenganishi` | gawanya kamba |
| `@:jina!` | vunja lebo | `$++ a b c` | muundo wa kuunganisha |
| `@:jina>` | endelea lebo | `arr[i>j>k]` | fahirisi ya urambazaji |
| `->` | lambda | `arr[i] = thamani` | sasisha kipengee (safu pekee) |
| `arr[i] += thamani` | sasisho mchanganyiko | `arr[i]$~` | sasisho la utendaji (nakala mpya) |
| `$^+` | panga kupanda (primitive) | `$^-` | panga kushuka (primitive) |
| `$^` | panga kwa kikalinganishi (tuple) | `<~` | rudisha |
| `\|>` | bomba | `!?` | jaribu |
| `:!` | kamata | `:>` | hatimaye |
| `#1` | kweli | `#0` | uongo |
| `$!` | ni kosa | `$!!` | eneza kosa |
| `<#` | ingiza | `#>` | hamirisha |
| `#` | tangaza moduli | `::` | ita moduli |
| `.` | ufikiaji wa sehemu | `#?` | metadata ya aina |
| `#\|..\|` | changanua nambari | `##.` | geuza hadi sehemu inayoelea |
| `###` | geuza hadi nambari kamili (zungusha) | `##!` | geuza hadi nambari kamili (kata) |
| `#.N\|..\|` | zungusha | `#!N\|..\|` | kata |
| `#,\|..\|` | umbizo la koma | `#^\|..\|` | kisayansi |
| `#d0d9#` | badili hali ya tarakimu | `#09#` | weka upya kwa ASCII |
| `<\ ..\>` | tekeleza shell | `>\<` | hoja za CLI |
| `\ kigezo` | haribu kigezo kwa uwazi | `°x` / `x°` | ufafanuzi wa moto (anza kiotomatiki) |
| `>>|` | kizuizi cha TUI (skrini mbadala) | `>>~` | pato la kufuatilia nafasi |
| `>>!` | safisha skrini | `>>?` | omba ukubwa wa terminal |
| `<<\|` | ubonyezo wa kitufe unaozuia | `<<\|?` | upigaji kura wa ubonyezo wa kitufe usiozuia |
| `@~ N` | lala N milisekunde | `$*` | rudia kamba N mara |

---

## Historia ya Mabadiliko ya Matoleo

### v0.0.5 — Primitive za TUI, Ufafanuzi wa Moto & Kurudia Kamba _(Mei 2026)_

- **Kinachovunja** Kitenganishi cha mkono wa kulinganisha: `muundo : matokeo` → `muundo => matokeo`
- **Kinachovunja** Lakabu ya kuagiza: `<# njia <= lakabu` → `<# njia => lakabu`
- **Kinachovunja** Badilisha jina la kuhimili: `#> { fn <= ya_umma }` → `#> { fn => ya_umma }`
- **Imeongezwa** Kizuizi cha TUI `>>| { }` — skrini mbadala + hali ghafi; husafisha unapotoka
- **Imeongezwa** Pato la kufuatilia nafasi `>>~ (safu, safu_wima, BKS, fg, bg) > vipengee` — sehemu chache, rangi 256 za ANSI
- **Imeongezwa** Ingizo la kitufe `<<| kigezo` (kinachozuia) na `<<|? kigezo` (upigaji kura usiozuia)
- **Imeongezwa** `>>!` safisha skrini, `>>?` omba ukubwa wa terminal, `@~ N` lala N milisekunde
- **Imeongezwa** Ufafanuzi wa moto `°x` / `x°` — anza kigezo kiotomatiki kwenye matumizi ya kwanza katika vitanzi
- **Imeongezwa** Kurudia kamba `kamba $* N` — rudia kamba N mara
- **VM** Usawa: majaribio 436/436 yamefaulu

### v0.0.4 — Uwekaji Fahirisi 1-msingi, Kazi za Daraja la Kwanza & Moduli za Kizuizi _(Aprili 2026)_

- **Kinachovunja** Uwekaji fahirisi wote umebadilishwa kuwa **1-msingi** — `arr[1]` ni kipengee cha kwanza; `arr[0]` ni kosa la wakati wa utekelezaji
- **Imeongezwa** Kazi zenye majina ni **thamani za daraja la kwanza** — pitisha moja kwa moja kwa HOF: `namba$> mara_mbili`
- **Imeongezwa** **Sarufi ya kizuizi inahitajika** kwa moduli: `# jina { ... }` — sarufi bapa imeondolewa
- **Imeongezwa** Uwekaji fahirisi wa pande nyingi: `arr[i>j>k] (urambazaji), `arr[p ; q]` (uchimbaji bapa)
- **Imeongezwa** Ugeuzaji wa aina: `##.maneno` (sehemu inayoelea), `###maneno` (nambari kamili zungusha), `##!maneno` (nambari kamili kata)
- **Imeongezwa** Mgawanyo wa kamba: `kamba$/ kitenganishi` — hurudisha `Array(kamba)`
- **Imeongezwa** Muundo wa kuunganisha: `msingi$++ a b c` — huongeza vipengee vingi
- **Imeongezwa** Kitanzi cha idadi: `@ N { }` — rudia haswa N mara
- **Imeongezwa** Sarufi ya kitanzi chenye lebo: `@:jina { }`, `@:jina!`, `@:jina>` — inachukua nafasi ya `@ @jina` / `@! jina`
- **Imeongezwa** Kanuni za wigo wa vigezo: vigezo vya `_jina` vina wigo sahihi wa kizuizi; `\ kigezo` huharibu mapema
- **Imeongezwa** Mifumo ya ulinganisho ya kulinganisha: `< 0 =>`, `> 5 =>`, `== 42 =>` nk.
- **Imeongezwa** Kosa la moduli E013: taarifa zinazotekelezeka katika mwili wa moduli haziruhusiwi
- **Imerekebishwa** `alias.CONST` sasa inatatua kwa usahihi; `#>` inaweza kutokea baada ya ufafanuzi wa kazi
- **VM** Usawa kamili: majaribio 393/393 yamefaulu

### v0.0.3 — Mifumo ya Tarakimu ya Unicode na Maboresho ya LSP _(Aprili 2026)_

- **Imeongezwa** Vizuizi 69 vya tarakimu za Unicode vilivyo na ishara ya kubadili hali `#d0d9#`
- **Imeongezwa** Halisi za boolean katika mchoro wowote — `#१` / `#०`, `#١` / `#٠`, nk.
- **Imeongezwa** Tarakimu za Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Imeongezwa** Opcode ya VM `SetNumeralMode` — usawa kamili na tree-walker
- **Ilibadilishwa** Pato la boolean `>>` sasa linajumuisha kiambishi awali `#` (`#0` / `#1`) katika hali zote

### v0.0.2_01 — Kiendeshaji Kubadilisha Jina _(30 Machi 2026)_

- **Ilibadilishwa** `c|..|` → `#,|..|` na `e|..|` → `#^|..|` — kwa upatanifu na familia ya kiambishi awali `#`
- **Imeongezwa** Lakabu ya kuhimili: himili upya wanachama wa moduli kwa jina tofauti

### v0.0.2 — Usanifu upya wa API ya Mkusanyiko na Visakinishaji _(24 Machi 2026)_

- **Imeongezwa** Familia ya kiendeshaji `$` iliyounganishwa kwa safu na kamba (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Imeongezwa** Ukabidhi wa uharibifu wa muundo kwa safu, tuple, na tuple zenye jina
- **Imeongezwa** Fahirisi hasi (`arr[-1]` = kipengee cha mwisho)
- **Imeongezwa** Visakinishaji asili — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Machi 2026)_

- **Imeongezwa** Ukabidhi mchanganyiko `^=`
- **Imerekebishwa** Kesi za ukingo za hesabu za kichanganuzi; marekebisho ya hati

### v0.0.1 — Toleo la Kwanza la Umma _(22 Machi 2026)_

- Mkalimani wa tree-walker + VM ya rejista (`--vm`, ~4× kwa kasi, ~95% usawa)
- Miundo yote ya msingi: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Vitambulishi kamili vya Unicode, mfumo wa moduli, lambda, vifungo, ushughulikiaji wa makosa
- REPL, LSP, kiendelezi cha VS Code, umbizaji (`zymbol fmt`)

---

_Zymbol-Lang — Kishara. Ulimwenguni. Kisichobadilika._
