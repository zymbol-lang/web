# Mwongozo Mfupi wa Zymbol-Lang

**Zymbol-Lang** ni lugha ya programu ya alama. Haitumii maneno muhimu — kila kitu ni alama. Inafanya kazi sawa katika lugha yoyote ya binadamu.

- Hakuna maneno muhimu (`if`, `while`, `return` hazipo — alama tu `?`, `@`, `<~`)
- Unicode kamili — vitambulisho katika lugha yoyote au emoji 👋
- Haitegemei lugha — msimbo ni sawa katika lugha zote

---

## Vigeuzi na Vipimo

```zymbol
x = 10              // kigeuzí (kinachoweza kubadilishwa)
PI := 3.14159       // kipimo — hitilafu inapokabidhiwa tena
jina = "Ana"
hai = #1            // kweli ya kimantiki
👋 := "Habari"
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

## Aina za Data

| Aina | Mfano | Alama `#?` | Maelezo |
|------|-------|------------|---------|
| Nambari nzima | `42`, `-7` | `###` | Biti 64 zenye ishara |
| Nambari ya desimali | `3.14`, `1.5e10` | `##.` | Uandishi wa kisayansi inafaa |
| Mfuatano | `"habari"` | `##"` | Uingizaji: `"Habari {jina}"` |
| Herufi | `'A'` | `##'` | Herufi moja ya Unicode |
| Kimantiki | `#1`, `#0` | `##?` | SI nambari 1 na 0 |
| Safu | `[1, 2, 3]` | `##]` | Vipengele vyote vya aina moja |
| Tuple | `(a, b)` | `##)` | Kwa nafasi |
| Tuple yenye jina | `(x: 1, y: 2)` | `##)` | Ufikiaji kwa jina au faharasa |

```zymbol
// Uchunguzi wa aina — inarudisha (aina, tarakimu, thamani)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Matokeo na Ingizo

```zymbol
>> "Habari" ¶                     // ¶ au \\ kwa mstari mpya wazi
>> "a=" a " b=" b ¶               // maadili mengi kwa uwekaji pamoja
>> (safu$#) ¶                     // waendeshaji wa mwisho wanahitaji mabano

<< jina                           // bila kauli — inasoma katika kigeuzí
<< "Jina lako? " jina             // na kauli
```

> `¶` (AltGr+R kwenye kibodi ya Kihispania) na `\\` ni sawa kama mstari mpya.

---

## Waendeshaji

```zymbol
// Hisabati — tumia ukabidhiaji; baadhi ya waendeshaji wana matatizo moja kwa moja katika >>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (mgawanyiko wa nambari nzima)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (nguvu)

// Ulinganishaji
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Kimantiki
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Mifuatano

```zymbol
// Njia tatu za kuunganisha
jina = "Ana"
n = 42

ujumbe = "Habari ", jina, "!"            // koma — katika ukabidhiaji
>> "Habari " jina " una " n ¶            // uwekaji pamoja — katika >>
maelezo = "Habari {jina}, una {n}"       // uingizaji — popote
```

```zymbol
s = "Habari Dunia"
urefu = s$#                  // 13
sehemu = s$[0..6]            // "Habari"  (mwisho haufikiiwi)
ina = s$? "Dunia"            // #1
sehemu_ndogo = "a,b,c,d" / ','    // [a, b, c, d]
badilisha = s$~~["a":"A"]         // "HAbAri DuniA"
badilisha1 = s$~~["a":"A":1]      // "HAbari Dunia"  (N ya kwanza tu)
```

> `+` ni kwa nambari tu. Tumia `,`, uwekaji pamoja, au uingizaji kwa mifuatano.

---

## Udhibiti wa Mtiririko

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

> Vizuizi `{ }` ni **lazima**, hata kwa mstari mmoja.

---

## Match

```zymbol
// Masafa
alama = 85
daraja = ?? alama {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> daraja ¶    // → B

// Mifuatano
rangi = "nyekundu"
msimbo = ?? rangi {
    "nyekundu" : "#FF0000"
    "kijani"   : "#00FF00"
    _          : "#000000"
}

// Walinzi
joto = -5
hali = ?? joto {
    _? joto < 0  : "barafu"
    _? joto < 20 : "baridi"
    _? joto < 35 : "joto"
    _            : "moto sana"
}
>> hali ¶    // → barafu

// Fomu ya kauli (mikono ya kizuizi)
?? n {
    0       : { >> "sifuri" ¶ }
    _? n < 0: { >> "hasi" ¶ }
    _       : { >> "chanya" ¶ }
}
```

---

## Mizunguko

```zymbol
@ i:0..4  { >> i " " }        // masafa ya kujumuisha: 0 1 2 3 4
@ i:1..9:2 { >> i " " }       // na hatua: 1 3 5 7 9
@ i:5..0:1 { >> i " " }       // nyuma: 5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (wakati)

matunda = ["embe", "ndizi", "zabibu"]
@ tunda:matunda { >> tunda ¶ }  // kwa kila kipengele cha safu

@ h:"habari" { >> h "-" }
>> ¶                          // → h-a-b-a-r-i-  (kwa kila herufi)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> endelea
    ? i > 7 { @! }             // @! simama
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Mzunguko usio na mwisho
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Mzunguko wenye lebo (simama ndani)
hesabu = 0
@ @nje {
    hesabu++
    ? hesabu >= 3 { @! nje }
}
>> hesabu ¶                   // → 3
```

---

## Vitendo

```zymbol
jumlisha(a, b) { <~ a + b }
>> jumlisha(3, 4) ¶    // → 7

faktoria(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoria(n - 1)
}
>> faktoria(5) ¶    // → 120
```

Vitendo vina **upeo uliotengwa** — havipatikani kwa vigeuzi vya nje. Tumia vigezo vya matokeo `<~` kubadilisha vigeuzi vya mwito:

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

> Vitendo vilivyopewa jina si maadili ya daraja la kwanza. Ili kupitisha kama hoja, vifunge: `x -> jina(x)`.

---

## Lambda na Kufunga

```zymbol
mara_mbili = x -> x * 2
jumla = (a, b) -> a + b
>> mara_mbili(5) ¶    // → 10
>> jumla(3, 7) ¶      // → 10

// Lambda na kizuizi
panga = x -> {
    ? x > 0 { <~ "chanya" }
    _? x < 0 { <~ "hasi" }
    <~ "sifuri"
}

// Kufunga — inakamata upeo wa nje
kizidishi = 3
mara_tatu = x -> x * kizidishi
>> mara_tatu(7) ¶    // → 21

// Kiwanda
unda_mwongezaji(n) { <~ x -> x + n }
ongeza10 = unda_mwongezaji(10)
>> ongeza10(5) ¶    // → 15

// Katika safu
shughuli = [x -> x+1, x -> x*2, x -> x*x]
>> shughuli[2](5) ¶    // → 25
```

---

## Safu

Safu ni **zinazobadilika** na hushikilia vipengele vya **aina moja**.

```zymbol
safu = [1, 2, 3, 4, 5]

safu[0]          // 1 — ufikiaji (faharasa kuanzia 0)
safu[-1]         // 5 — faharasa hasi (ya mwisho)
safu$#           // 5 — urefu (tumia (safu$#) katika >>)

safu = safu$+ 6            // ongeza → [1,2,3,4,5,6]
safu2 = safu$+[2] 99       // ingiza kwenye faharasa 2
safu3 = safu$- 3           // ondoa tukio la kwanza la thamani
safu4 = safu$-- 3          // ondoa matukio yote
safu5 = safu$-[0]          // ondoa kwenye faharasa
safu6 = safu$-[1..3]       // ondoa masafa (mwisho haujumuishwi)

ina = safu$? 3             // #1 — ina
nafasi = safu$?? 3         // [2] — faharasa zote za thamani
sl = safu$[0..3]           // [1,2,3] — sehemu (mwisho haujumuishwi)
sl2 = safu$[0:3]           // [1,2,3] — sintaksia ya idadi

panda = safu$^+            // imepangwa kupanda  (primitives tu)
shuka = safu$^-            // imepangwa kushuka  (primitives tu)

// Safu za tuple — tumia $^ na lambda ya ulinganishaji
hifadhidata = [(jina: "Carla", umri: 28), (jina: "Ana", umri: 25), (jina: "Bob", umri: 30)]
kwa_umri  = hifadhidata$^ (a, b -> a.umri < b.umri)    // kupanda kwa umri
kwa_jina = hifadhidata$^ (a, b -> a.jina > b.jina)     // kushuka kwa jina
>> kwa_umri[0].jina ¶     // → Ana
>> kwa_jina[0].jina ¶     // → Carla

// Sasisha kipengele moja kwa moja (safu tu)
safu[1] = 99              // kabidhia
safu[0] += 5              // kiwanja: +=  -=  *=  /=  %=  ^=

// Sasisha kwa kazi — inarudisha safu mpya; asili haibadiliki
safu2 = safu[1]$~ 99
```

> Waendeshaji wote wa mkusanyiko wanrudisha **safu mpya**. Kabidhia tena: `safu = safu$+ 4`.
> Waendeshaji haiwezekani kuunganishwa — tumia ukabidhiaji wa kati.
> `$^+` / `$^-` zinapanga **safu za primitives** (nambari, mifuatano). Kwa safu za tuple tumia `$^` na lambda ya ulinganishaji — mwelekeo umewekwa kwenye lambda (`<` = kupanda, `>` = kushuka).

**Semantiki ya thamani** — kukabidhia safu kwa kigeuzí kingine kunaunda nakala huru:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b haiathiriki
```

```zymbol
// Safu zilizowekwa ndani
matris = [[1,2,3],[4,5,6],[7,8,9]]
>> matris[1][2] ¶    // → 6
```

---

## Kuvunjilia

```zymbol
// Safu
safu = [10, 20, 30, 40, 50]
[a, b, c] = safu              // a=10  b=20  c=30
[kwanza, *mengine] = safu     // kwanza=10  mengine=[20,30,40,50]
[x, _, z] = [1, 2, 3]         // _ inatupwa

// Tuple kwa nafasi
pointi = (100, 200)
(px, py) = pointi             // px=100  py=200

// Tuple yenye jina
mtu = (jina: "Ana", umri: 25, mji: "Nairobi")
(jina: j, umri: u) = mtu     // j="Ana"  u=25
```

---

## Tuple

Tuple ni vyombo vilivyopangwa **visivyobadilika** ambavyo vinaweza kushikilia thamani za **aina tofauti**. Tofauti na safu, vipengele haviwezi kubadilishwa baada ya kuundwa.

```zymbol
// Kwa nafasi
pointi = (10, 20)
>> pointi[0] ¶    // → 10

data = (42, "habari", #1, 3.14)
>> data[2] ¶     // → #1

// Yenye jina
mtu = (jina: "Alice", umri: 25)
>> mtu.jina ¶    // → Alice
>> mtu[0] ¶      // → Alice  (faharasa pia inafanya kazi)

// Iliyowekwa ndani
nafasi = (x: 10, y: 20)
p = (nafasi: nafasi, lebo: "asili")
>> p.nafasi.x ¶  // → 10
```

**Kutobadilika** — jaribio lolote la kubadilisha kipengele cha tuple ni kosa la wakati wa utekelezaji:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ kosa la wakati wa utekelezaji: tuple hazibadiliki
// t[0] += 5    // ❌ kosa lilo lilo
```

Ili kupata thamani iliyobadilishwa tumia `$~` (sasisha kwa kazi) — inarudisha tuple **mpya**:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← asili haibadiliki
>> t2 ¶    // → (10, 999, 30)

// Tuple yenye jina — jenga upya wazi
mtu = (jina: "Alice", umri: 25)
mkubwa  = (jina: mtu.jina, umri: 26)
>> mtu.umri ¶    // → 25
>> mkubwa.umri ¶      // → 26
```

---

## Vitendo vya Mpangilio wa Juu

> Waendeshaji wa HOF wanahitaji **lambda ya ndani** — hakuna kigeuzí cha lambda moja kwa moja.

```zymbol
nambari = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

maradufu  = nambari$> (x -> x * 2)                // ramani  → [2,4,6…20]
za_pande  = nambari$| (x -> x % 2 == 0)           // chuja → [2,4,6,8,10]
jumla     = nambari$< (0, (mkus, x) -> mkus + x)   // punguza → 55

// Mnyororo kupitia ukabidhiaji wa kati
hatua1 = nambari$| (x -> x > 3)
hatua2 = hatua1$> (x -> x * x)
>> hatua2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Vitendo vilivyopewa jina ndani ya HOF — vifunge kwenye lambda
mara_mbili(x) { <~ x * 2 }
r = nambari$> (x -> mara_mbili(x))    // ✅
```

---

## Mwendeshaji wa Bomba

Upande wa kulia daima unahitaji `_` kama nafasi ya thamani iliyopitishwa:

```zymbol
mara_mbili = x -> x * 2
ongeza = (a, b) -> a + b
ongeza_moja = x -> x + 1

5 |> mara_mbili(_)        // → 10
10 |> ongeza(_, 5)        // → 15
5 |> ongeza(2, _)         // → 7

// Mnyororo
r = 5 |> mara_mbili(_) |> ongeza_moja(_) |> mara_mbili(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Kushughulikia Makosa

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "mgawanyiko kwa sifuri" ¶
} :! {
    >> "hitilafu nyingine: " _err ¶    // _err ina ujumbe wa hitilafu
} :> {
    >> "inafanywa daima" ¶
}
```

| Aina | Inapotokea |
|------|------------|
| `##Div` | Mgawanyiko kwa sifuri |
| `##IO` | Faili / Mfumo |
| `##Index` | Faharasa nje ya masafa |
| `##Type` | Hitilafu ya aina |
| `##Parse` | Hitilafu ya uchambuzi |
| `##Network` | Hitilafu ya mtandao |
| `##_` | Hitilafu yoyote (kamata-zote) |

---

## Moduli

```zymbol
// lib/hisabati.zy
# hisabati

#> { jumlisha, pata_PI }    // usafirishaji KABLA ya ufafanuzi

_PI := 3.14159
jumlisha(a, b) { <~ a + b }
pata_PI() { <~ _PI }   // kifuatiliaji — ufikiaji wa moja kwa moja wa kipimo kupitia jina la utambulisho hauko
```

```zymbol
// kuu.zy
<# ./lib/hisabati <= h    // jina la utambulisho linahitajika

>> h::jumlisha(5, 3) ¶     // → 8
pi = h::pata_PI()
>> pi ¶                    // → 3.14159
```

```zymbol
// Safirisha kwa jina tofauti la umma
# maktaba
#> { _jumlisha_ndani <= jumla }

_jumlisha_ndani(a, b) { <~ a + b }
```

```zymbol
<# ./maktaba <= m

>> m::jumla(3, 4) ¶    // → 7  (jina la ndani _jumlisha_ndani limefichwa)
```

---

## Hali za Nambari

Zymbol inaweza kuonyesha nambari katika **mifumo ya tarakimu ya Unicode 69** — Devanagari, Kiarabu-Kihindi, Kithai, Klingon pIqaD, Hisabati Nzito, sehemu za LCD na zaidi. Hali inayofanya kazi inaathiri tu matokeo ya `>>`; hesabu ya ndani ni binary daima.

### Kuwezesha mfumo wa tarakimu

Andika tarakimu `0` na `9` za mfumo unaolengwa ndani ya `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabic-Indic  (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // reset to ASCII
```

### Matokeo na thamani za boolean

```zymbol
x = 42
>> x ¶          // → 42   (ASCII default)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४
>> 1 + 2 ¶      // → ३

// Boolean: # awali daima ASCII, tarakimu inabadilika
>> #1 ¶         // → #१
>> #0 ¶         // → #०

x = 28 > 4
>> x ¶          // → #१
```

### Tarakimu za asili katika msimbo chanzo

Tarakimu za mfumo wowote unaotumika ni vigeu halali — katika masafa, modulo, ulinganisho:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Vigeu vya boolean katika mfumo wowote

`#` + tarakimu `0` au `1` kutoka kizuizi chochote ni kigeu cha boolean halali:

```zymbol
#٠٩#
نشط = #١
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` ni **ASCII daima**. `#0` (uwongo) daima tofauti kwa macho na `0` (sifuri nzima) katika kila mfumo.

---

## Waendeshaji wa Data

```zymbol
// Geuza mfuatano kuwa nambari
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (salama, bila hitilafu)

// Pinda / kata
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (pinda hadi desimali 2)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (kata)

// Umbizo wa nambari
fmt = #,|1234567|      // → 1,234,567  (tenganisha kwa koma)
sci = #^|12345.678|    // → 1.2345678e4  (kisayansi)

// Vigeuzi vya msingi
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Matokeo ya ubadilishaji wa msingi
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Ujumuishaji wa Shell

```zymbol
tarehe = <\ date +%Y-%m-%d \>     // inakamata stdout (ikiwa na \n ya mwisho)
>> "Leo: " tarehe

faili = "data.txt"
maudhui = <\ cat {faili} \>       // uingizaji katika amri

matokeo = </"./msimbo_mdogo.zy"/> // tekeleza skripti nyingine ya Zymbol, kamata matokeo
>> matokeo
```

> `><` inakamata hoja za CLI kama safu ya mfuatano (tree-walker tu).

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

## Marejeo ya Alama

| Alama | Shughuli | Alama | Shughuli |
|-------|----------|-------|----------|
| `=` | kigeuzí | `$#` | urefu |
| `:=` | kipimo | `$+` | ongeza |
| `>>` | matokeo | `$+[i]` | ingiza kwenye faharasa |
| `<<` | ingizo | `$-` | ondoa kwanza kwa thamani |
| `¶` / `\\` | mstari mpya | `$--` | ondoa yote kwa thamani |
| `?` | kama | `$-[i]` | ondoa kwenye faharasa |
| `_?` | sivyo kama | `$-[i..j]` | ondoa masafa |
| `_` | sivyo / kishikio | `$?` | ina |
| `??` | match | `$??` | tafuta faharasa zote |
| `@` | mzunguko | `$[s..e]` | sehemu |
| `@!` | simama | `$>` | ramani |
| `@>` | endelea | `$\|` | chuja |
| `->` | lambda | `$<` | punguza |
| `safu[i] = val` | sasisha kipengele (safu tu) | `safu[i] += val` | sasisha kiwanja |
| `safu[i]$~` | sasisha kwa kazi (nakala mpya) | `$^+` | panga kupanda (primitives) |
| `$^-` | panga kushuka (primitives) | `$^` | panga na ulinganishaji (tuple) |
| `<~` | rudisha | `!?` | jaribu |
| `\|>` | bomba | `:!` | kamata |
| `#1` | kweli | `:>` | daima |
| `#0` | uongo | `$!` | ni hitilafu |
| `<#` | ingiza | `$!!` | sambaza hitilafu |
| `#` | tangaza moduli | `#>` | safirisha |
| `::` | wito wa moduli | `.` | ufikiaji wa sehemu |
| `#\|..\|` | geuza nambari | `#?` | metadata ya aina |
| `#.N\|..\|` | pinda | `#!N\|..\|` | kata |
| `#,\|..\|` | umbizo wa koma | `#^\|..\|` | kisayansi |
| `#d0d9#` | kubadilisha hali ya nambari | `#09#` | rejesha ASCII |
| `<\ ..\>` | tekeleza shell | `>\<` | hoja za CLI |

## Historia ya Matoleo

### v0.0.3 — Mifumo ya Nambari ya Unicode & Maboresho ya LSP _(Aprili 2026)_

- **Imeongezwa** Vizuizi 69 vya tarakimu vya Unicode na ishara ya kubadilisha hali `#d0d9#`
- **Imeongezwa** Vigeu vya boolean katika mfumo wowote — `#१` / `#०`, `#١` / `#٠`, n.k.
- **Imeongezwa** Tarakimu za Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Imeongezwa** VM opcode `SetNumeralMode` — usawa kamili na tree-walker
- **Imeongezwa** REPL inazingatia hali ya nambari inayofanya kazi katika mwangwi na uonyeshaji wa vigeu
- **Imebadilishwa** Matokeo ya `>>` ya boolean sasa yanajumuisha kiambishi awali `#` (`#0` / `#1`) katika hali zote

### v0.0.2_01 — Kubadilisha Majina ya Waendeshaji _(30 Mar 2026)_

- **Imebadilishwa** `c|..|` → `#,|..|` na `e|..|` → `#^|..|` — sawa na familia ya kiambishi `#`
- **Imeongezwa** Alias ya usafirishaji: kusafirisha tena wanachama wa moduli kwa jina tofauti

### v0.0.2 — Kubuni Upya API ya Makusanyiko & Vifaa vya Usakinishaji _(24 Mar 2026)_

- **Imeongezwa** Familia ya waendeshaji `$` iliyounganishwa kwa arrays na nyuzi (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Imeongezwa** Uharibifu kwa arrays, tuples na tuples zenye majina
- **Imeongezwa** Vipengele hasi (`arr[-1]` = kipengele cha mwisho)
- **Imeongezwa** Vifaa vya usakinishaji vya asili — Linux (deb/rpm/pkg/musl), macOS, Windows

### v0.0.1-patch _(25 Mar 2026)_

- **Imeongezwa** Ugawaji wa pamoja `^=`
- **Imerekebishwa** Kesi za mipaka ya parser ya hisabati; marekebisho ya nyaraka

### v0.0.1 — Kutolewa kwa Umma kwa Mara ya Kwanza _(22 Mar 2026)_

- Tree-walker interpreter + register VM (`--vm`, ~4× kwa kasi, ~95% usawa)
- Muundo wote wa msingi: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Vitambulisho kamili vya Unicode, mfumo wa moduli, lambdas, mafungo, kushughulikia makosa
- REPL, LSP, kiendelezi cha VS Code, mfumo wa muundo (`zymbol fmt`)

---

*Zymbol-Lang — Alama. Ya Ulimwengu. Haibadiliki.*

> **Kumbuka:** Nyaraka hizi ziliundwa na kutafsiriwa na akili bandia (AI).
> Juhudi zote zimefanywa kuhakikisha usahihi, lakini baadhi ya tafsiri au mifano inaweza kuwa na makosa.
> Marejeo ya mamlaka ni [MANUAL.md](https://github.com/zymbol-lang/interpreter) katika hazina ya mtafsiri.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> The canonical reference is [MANUAL.md](https://github.com/zymbol-lang/interpreter) in the interpreter repository.
