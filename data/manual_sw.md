> **Notisi:** Hati hii imeundwa kwa usaidizi wa akili ya kujenga (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Marejeo ya kisheria ni **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** kwenye hazina ya mkalimani.

---

# Mwongozo wa Zymbol-Lang

**Zymbol-Lang** ni lugha ya programu ya kiishara. Hakuna maneno muhimu — kila kitu ni ishara. Inafanya kazi sawa katika lugha yoyote ya kibinadamu.

- Hakuna `if`, `while`, `return` — tu `?`, `@`, `<~`
- Unicode kamili — vitambulishi katika lugha yoyote au emoji
- Haijali lugha ya kibinadamu — msimbo ni sawa kila mahali

**Toleo la mkalimani**: v0.0.4 | **Ufunikaji wa majaribio**: 393/393 (usawa wa TW ↔ VM)

---

---

## Vigezo na Visawazisho

```zymbol
x = 10              // kigezo kinachobadilika
PI := 3.14159       // kisawazisho — kukabidhi upya ni hitilafu ya wakati wa utekelezaji
jina = "Alice"
tendaji = #1        // Boolean kweli
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

---

## Aina za Data

| Aina | Kimwili | Lebo `#?` | Vidokezo |
|------|---------|-----------|----------|
| Nambari kamili | `42`, `-7` | `###` | 64-bit iliyotiwa sahihi |
| Sehemu ya kuelea | `3.14`, `1.5e10` | `##.` | Dokezo la kisayansi linaruhusiwa |
| Mfuatano | `"maandishi"` | `##"` | Uingizaji: `"Habari {jina}"` |
| Herufi | `'A'` | `##'` | Herufi moja ya Unicode |
| Boolean | `#1`, `#0` | `##?` | SI nambari — `#1 ≠ 1` |
| Safu | `[1, 2, 3]` | `##]` | Vipengele vilivyo sawa |
| Tuple | `(a, b)` | `##)` | Kwa nafasi |
| Tuple yenye jina | `(x: 1, y: 2)` | `##)` | Sehemu zenye majina |
| Kazi | marejeo ya kazi yenye jina | `##()` | Daraja la kwanza; inaonyesha `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Daraja la kwanza; inaonyesha `<lambd/N>` |

```zymbol
// Uchunguzi wa aina — inarudisha (aina, tarakimu, thamani)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Pato na Ingizo

```zymbol
>> "Habari" ¶                       // ¶ au \\ kwa mstari mpya ulio wazi
>> "a=" a " b=" b ¶               // uwekaji kando — thamani nyingi
>> (arr$#) ¶                      // viendeshaji vya nyuma vinahitaji ( ) ndani ya >>

<< jina                           // soma kwenye kigezo (bila kuchochea)
<< "Weka jina lako: " jina        // kwa kuchochea
```

> `¶` (AltGr+R kwenye kibodi ya Kihispania) na `\\` ni sawa kwa mstari mpya.

---

## Viendeshaji

```zymbol
// Hesabu — tumia ukabidhi; baadhi ya viendeshaji vina sifa za moja kwa moja ndani ya >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (mgawanyiko wa nambari kamili)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (upeanaji)

// Ulinganisho
a == b    // #0    
a <> b    // #1    
a < b     // #0
a <= b    // #0   
a > b     // #1    
a >= b    // #1

// Kimantiki
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Mfuatano

```zymbol
// Aina mbili za kuunganisha
jina = "Alice"
n = 42

>> "Habari " jina " una " n ¶       // uwekaji kando — ndani ya >>
maelezo = "Habari {jina}, una {n}"   // uingizaji — popote
```

```zymbol
s = "Habari Dunia"
urefu = s$#                  // 11
kiu = s$[1..5]               // "Habr"  (msingi-1, mwisho umejumuishwa)
ipo = s$? "Dunia"            // #1
vipande = "a,b,c,d"$/ ','    // [a, b, c, d]  (gawanya kwa kitenganishi)
kilichobadilishwa = s$~~["a":"o"] // "Hobori Dunio"
kilichobadilishwa1 = s$~~["a":"o":1] // "Hobori Dunia"  (N za kwanza tu)
```

> `+` ni kwa nambari tu. Kwa mifuatano, tumia `,`, uwekaji kando, au uingizaji.

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

> Mabano ya mraba `{ }` **ni lazima** hata kwa taarifa moja.

---

## Ulinganifu

```zymbol
// Vipindi
alama = 85
daraja = ?? alama {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> daraja ¶     // → B

// Mifuatano
rangi = "nyekundu"
kodi = ?? rangi {
    "nyekundu" : "#FF0000"
    "kijani"   : "#00FF00"
    _          : "#000000"
}

// Mifumo ya ulinganisho
joto = -5
hali = ?? joto {
    < 0  : "barafu"
    < 20 : "baridi"
    < 35 : "vuguvugu"
    _    : "moto"
}
>> hali ¶       // → barafu

// Umbo la taarifa (vizuizi)
?? n {
    0        : { >> "sifuri" ¶ }
    _? n < 0 : { >> "hasi" ¶ }
    _        : { >> "chanya" ¶ }
}
```

---

## Mizunguko

```zymbol
@ i:0..4  { >> i " " }        // kipindi kilichojumuishwa:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // kwa hatua:              1 3 5 7 9
@ i:5..0:1 { >> i " " }       // kinyume:               5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (wakati)

matunda = ["tufaha", "pea", "zabibu"]
@ m:matunda { >> m ¶ }        // kwa kila kipengele katika safu

@ h:"habari" { >> h "-" }
>> ¶                          // → h-a-b-a-r-i-  (kwa kila herufi katika mfuatano)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> endelea
    ? i > 7 { @! }            // @! vunja
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Mizunguko isiyo na mwisho
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Mzunguko wenye lebo (kuvunja kwa kiota)
kaunta = 0
@:nje {
    kaunta++
    ? kaunta >= 3 { @:nje! }
}
>> kaunta ¶                   // → 3
```

---

## Kazi

```zymbol
jumuisha(a, b) { <~ a + b }
>> jumuisha(3, 4) ¶   // → 7

kipengele(n) {
    ? n <= 1 { <~ 1 }
    <~ n * kipengele(n - 1)
}
>> kipengele(5) ¶     // → 120
```

Kazi zina **wigo uliotengwa** — haziwezi kusoma vigezo vya nje. Tumia vigezo vya pato `<~` kurekebisha vigezo vya mwitaaji:

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

> Kazi zenye majina ni **thamani za daraja la kwanza** — tuma moja kwa moja: `nums$> mara mbili`. `x -> fn(x)` pia ni halali.

---

## Lambda na Kufungwa

```zymbol
mara mbili = x -> x * 2
jumuisha = (a, b) -> a + b
>> mara mbili(5) ¶   // → 10
>> jumuisha(3, 7) ¶   // → 10

// Lambda ya kizuizi
ainisha = x -> {
    ? x > 0 { <~ "chanya" }
    _? x < 0 { <~ "hasi" }
    <~ "sifuri"
}

// Kufungwa — hunasa wigo wa nje
kigezo = 3
mara tatu = x -> x * kigezo
>> mara tatu(7) ¶    // → 21

// Kiwanda
unda_kiunganishi(n) { <~ x -> x + n }
ongeza_kumi = unda_kiunganishi(10)
>> ongeza_kumi(5) ¶   // → 15

// Katika safu
viendeshaji = [x -> x+1, x -> x*2, x -> x*x]
>> viendeshaji[3](5) ¶   // → 25
```

---

## Safu

Safu **hubadilika** na zina **vipengele vya aina moja**.

```zymbol
safu = [1, 2, 3, 4, 5]

safu[1]          // 1 — ufikiaji (msingi-1: kipengele cha kwanza)
safu[-1]         // 5 — fahirisi hasi (kipengele cha mwisho)
safu$#           // 5 — urefu (tumia (safu$#) ndani ya >>)

safu = safu$+ 6            // ongeza → [1,2,3,4,5,6]
safu2 = safu$+[2] 99       // ingiza kwenye nafasi ya 2 (msingi-1)
safu3 = safu$- 3           // ondoa mwonekano wa kwanza wa thamani
safu4 = safu$-- 3          // ondoa mwonekano wote
safu5 = safu$-[1]          // ondoa kwenye fahirisi 1 (kipengele cha kwanza)
safu6 = safu$-[2..3]       // ondoa kipindi (msingi-1, mwisho umejumuishwa)

ipo = safu$? 3            // #1 — ina
nyafasi = safu$?? 3        // [3] — fahirisi zote za thamani (msingi-1)
kipande = safu$[1..3]      // [1,2,3] — kipande (msingi-1, mwisho umejumuishwa)
kipande2 = safu$[1:3]      // [1,2,3] — sawa, sintaksia ya msingi wa idadi

kupanda = safu$^+         // panga kupanda (primitive tu)
kushuka = safu$^-         // panga kushuka (primitive tu)

// Safu za tuple zenye majina/kwa nafasi — tumia $^ na lambda ya kulinganisha
db = [(jina: "Carla", umri: 28), (jina: "Ana", umri: 25), (jina: "Bob", umri: 30)]
kulingana_na_umri   = db$^ (a, b -> a.umri < b.umri)     // kupanda kulingana na umri (<)
kulingana_na_jina   = db$^ (a, b -> a.jina > b.jina)     // kushuka kulingana na jina (>)
>> kulingana_na_umri[1].jina ¶    // → Ana
>> kulingana_na_jina[1].jina ¶    // → Carla

// Sasisho la kipengele moja kwa moja (safu tu)
safu[1] = 99              // kabidhi
safu[2] += 5              // mchanganyiko: +=  -=  *=  /=  %=  ^=

// Sasisho la utendaji — inarudisha safu mpya; asili haibadiliki
safu2 = safu[2]$~ 99
```

> Viendeshaji vyote vya mkusanyiko hurudisha **safu mpya**. Kabidhi tena: `safu = safu$+ 4`.
> `$+` inaweza kuunganishwa: `safu = safu$+ 5$+ 6$+ 7`. Viendeshaji vingine hutumia ukabidhi wa kati.
> **Uorodheshaji ni msingi-1**: `safu[1]` ni kipengele cha kwanza; `safu[0]` ni hitilafu ya wakati wa utekelezaji.
> `$^+` / `$^-` hupanga **safu za primitive** (nambari, mifuatano). Kwa safu za tuple, tumia $^ na lambda ya kulinganisha — mwelekeo umeambatanishwa kwenye lambda (`<` = kupanda, `>` = kushuka).

**Semantiki ya thamani** — kukabidhi safu kwenye kigezo kingine kunaunda nakala huru:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b haijaathiriwa
```

```zymbol
// Safu zilizowekwa (uorodheshaji msingi-1)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[2][3] ¶    // → 6  (safu ya 2, safu wima ya 3)
```

---

---

## Uvunjaji

```zymbol
// Safu
safu = [10, 20, 30, 40, 50]
[a, b, c] = safu               // a=10  b=20  c=30
[ya_kwanza, *iliyobakia] = safu   // ya_kwanza=10  iliyobakia=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ inapuuza

// Tuple kwa nafasi
nukta = (100, 200)
(px, py) = nukta              // px=100  py=200

// Tuple yenye jina
mtu = (jina: "Ana", umri: 25, mji: "Madrid")
(jina: j, umri: u) = mtu      // j="Ana"  u=25
```

---

---

## Tuple

Tuple ni vyombo **visivyobadilika** vilivyopangwa ambavyo vinaweza kushikilia thamani za **aina tofauti**.
Tofauti na safu, vipengele haviwezi kubadilishwa baada ya kuumbwa.

```zymbol
// Kwa nafasi — aina mchanganyiko zinaruhusiwa
nukta = (10, 20)
>> nukta[1] ¶     // → 10

data = (42, "habari", #1, 3.14)
>> data[3] ¶      // → #1

// Yenye jina
mtu = (jina: "Alice", umri: 25)
>> mtu.jina ¶      // → Alice
>> mtu[1] ¶        // → Alice  (fahirisi pia inafanya kazi, msingi-1)

// Iliyowekwa
nafasi = (x: 10, y: 20)
p = (nafasi: nafasi, lebo: "asili")
>> p.nafasi.x ¶     // → 10
```

**Kutobadilika** — jaribio lolote la kurekebisha kipengele cha tuple ni hitilafu ya wakati wa utekelezaji:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ hitilafu ya wakati wa utekelezaji: tuple hazibadiliki
// t[1] += 5    // ❌ hitilafu sawa

// Tuple yenye jina — jenga upya kwa uwazi
mtu = (jina: "Alice", umri: 25)
mkubwa = (jina: mtu.jina, umri: 26)
>> mtu.umri ¶      // → 25
>> mkubwa.umri ¶    // → 26
```

Ili kupata thamani iliyorekebishwa, tumia `$~` (sasisho la utendaji) — inarudisha tuple **mpya**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← asili haibadiliki
>> t2 ¶    // → (10, 999, 30)
```

---

---

## Kazi za Kiwango cha Juu

```zymbol
nambari = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

iliyowekwa_mara_mbili = nambari$> (x -> x * 2)               // ramani → [2,4,6…20]
jozi   = nambari$| (x -> x % 2 == 0)                      // chujio → [2,4,6,8,10]
jumla    = nambari$< (0, (kikusanyiko, x) -> kikusanyiko + x) // punguza → 55

// Msururu kupitia kati
hatua1 = nambari$| (x -> x > 3)
hatua2 = hatua1$> (x -> x * x)
>> hatua2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Kazi zenye majina zinaweza kutumwa moja kwa moja kwenye kazi za kiwango cha juu
mara mbili(x) { <~ x * 2 }
ni_kubwa(x) { <~ x > 5 }
r = nambari$> mara mbili       // ✅ marejeo ya moja kwa moja
r = nambari$| ni_kubwa         // ✅ marejeo ya moja kwa moja
```

---

---

## Kiendeshaji cha Bomba

Upande wa kulia unahitaji kila wakati `_` kama kishikilia nafasi cha thamani iliyobomolewa:

```zymbol
mara mbili = x -> x * 2
jumuisha = (a, b) -> a + b
ongeza = x -> x + 1

5 |> mara mbili(_)        // → 10
10 |> jumuisha(_, 5)      // → 15
5 |> jumuisha(2, _)       // → 7

// Msururu
r = 5 |> mara mbili(_) |> ongeza(_) |> mara mbili(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Ushughulikiaji wa Hitilafu

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "kugawanya kwa sifuri" ¶
} :! {
    >> "hitilafu nyingine: " _err ¶    // _err inashikilia ujumbe wa hitilafu
} :> {
    >> "inatekelezwa kila wakati" ¶
}
```

| Aina | Wakati |
|------|--------|
| `##Div` | Kugawanya kwa sifuri |
| `##IO` | Faili / mfumo |
| `##Index` | Fahirisi nje ya mipaka |
| `##Type` | Aina hazilingani |
| `##Parse` | Uchambuzi wa data |
| `##Network` | Hitilafu za mtandao |
| `##_` | Hitilafu yoyote (hukamata zote) |

---

---

## Moduli

```zymbol
// lib/calc.zy — mwili wa moduli uko ndani ya mabano ya mraba
# calc {
    #> { jumuisha, get_PI }

    _PI := 3.14159
    jumuisha(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // jina la utambulisho ni lazima

>> c::jumuisha(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Safirisha kwa jina tofauti la umma
# maktaba_yangu {
    #> { _jumuisha_ndani <= jumla }

    _jumuisha_ndani(a, b) { <~ a + b }
}
```

```zymbol
<# ./maktaba_yangu <= m

>> m::jumla(3, 4) ¶    // → 7  (jina la ndani _jumuisha_ndani limefichwa)
```

> **Kanuni za moduli**: ndani ya `# jina { }`, `#>`, ufafanuzi wa kazi, na waanzilishi wa vigezo/visawazisho vya kimwili pekee ndio vinazoruhusiwa. Taarifa zinazotekelezeka (`>>`, `<<`, mizunguko, n.k.) husababisha hitilafu E013.

---

---

## Modes za Nambari

Zymbol inaweza kuonyesha nambari katika **vitalu 69 vya tarakimu za Unicode** — Devanagari, Kiarabu-Kihindi, Kithai, Klingon pIqaD, Nzito za Hisabati, sehemu za LCD, na zaidi. Mde unaotumika huathiri pato la `>>` pekee; hesabu za ndani ni za binary kila wakati.

### Kuwezesha mwandiko

Andika tarakimu `0` na `9` za mwandiko unaolengwa ndani ya `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Kiarabu-Kihindi (U+0660–U+0669)
#๐๙#    // Kithai         (U+0E50–U+0E59)
#09#    // weka upya kwa ASCII
```

---

### Pato na Boolean

```zymbol
x = 42
>> x ¶          // → 42   (msingi ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (nukta ya desimali daima ni ASCII)
>> 1 + 2 ¶      // → ३

// Boolean: kiambishi awali # daima ni ASCII, tarakimu huzoea
>> #1 ¶         // → #१   (kweli katika Devanagari)
>> #0 ¶         // → #०   (uwongo — tofauti na ० nambari kamili sifuri)

x = 28 > 4
>> x ¶          // → #१   (matokeo ya ulinganisho yanafuata mde unaotumika)
```

---

## Tarakimu asili katika msimbo wa chanzo

Tarakimu za mwandiko wowote unaoungwa mkono ni kimwili halali — katika vipindi, modulo, ulinganisho:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

---

### Kimwili cha Boolean katika mwandiko wowote

`#` + tarakimu `0` au `1` kutoka kwa kitalu chochote ni kimwili halali cha Boolean:

```zymbol
#०९#
tendaji = #१        // sawa na #1
>> tendaji ¶        // → #१
>> (#१ && #०) ¶     // → #०
```

> `#` **daima ni ASCII**. `#0` (uwongo) daima inaonekana tofauti na `0` (nambari kamili sifuri) katika kila mwandiko.

---

---

## Viendeshaji vya Data

```zymbol
// Ubadilishaji wa aina
##.42         // → 42.0  (kwa Sehemu ya kuelea)
###3.7        // → 4     (kwa Nambari kamili, zungusha)
##!3.7        // → 3     (kwa Nambari kamili, kata)

// Changanua mfuatano kuwa nambari
v1 = #|"42"|      // → 42  (Nambari kamili)
v2 = #|"3.14"|    // → 3.14  (Sehemu ya kuelea)
v3 = #|"abc"|     // → "abc"  (salama, hakuna hitilafu)

// Zungusha / kata
pi = 3.14159265
zungusha2 = #.2|pi|     // → 3.14  (zungusha hadi sehemu 2 za desimali)
zungusha4 = #.4|pi|     // → 3.1416
kata2 = #!2|pi|         // → 3.14  (kata)

// Uumbizaji wa nambari
umbizo = #,|1234567|   // → 1,234,567  (iliyotengwa kwa koma)
kisayansi = #^|12345.678| // → 1.2345678e4  (kisayansi)

// Kimwili cha msingi
a = 0x41         // → 'A'  (heksadesimali)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (oktali)

// Pato la ubadilishaji wa msingi
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

---

## Ushirikiano wa Shell

```zymbol
tarehe = <\ date +%Y-%m-%d \>     // inanasa stdout (inajumuisha \n mwishoni)
>> "Leo: " tarehe

faili = "data.txt"
maudhui = <\ cat {faili} \>        // uingizaji katika amri

pato = </"./subscript.zy"/>       // tekeleza hati nyingine ya Zymbol, nasa pato
>> pato
```

> `><` hunasa hoja za CLI kama safu ya mifuatano (safu ya mti tu).

---

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

| Alama | Operesheni | Alama | Operesheni |
|-------|-----------|-------|-----------|
| `=` | kigezo | `$#` | urefu |
| `:=` | kisawazisho | `$+` | ongeza (kuweza kuunganishwa) |
| `>>` | pato | `$+[i]` | ingiza kwenye fahirisi (msingi-1) |
| `<<` | ingizo | `$-` | ondoa ya kwanza kulingana na thamani |
| `¶` / `\\` | mstari mpya | `$--` | ondoa zote kulingana na thamani |
| `?` | ikiwa | `$-[i]` | ondoa kwenye fahirisi (msingi-1) |
| `_?` | vinginevyo ikiwa | `$-[i..j]` | ondoa kipindi (msingi-1) |
| `_` | vinginevyo / mwitu | `$?` | ina |
| `??` | linganisha | `$??` | tafuta fahirisi zote (msingi-1) |
| `@` | mzunguko | `$[s..e]` | kipande (msingi-1) |
| `@ N { }` | mzunguko wa N mara | `$>` | ramani |
| `@!` | vunja | `$|` | chujio |
| `@>` | endelea | `$<` | punguza |
| `@:jina { }` | mzunguko wenye lebo | `$/ kitenganishi` | mgawanyiko wa mfuatano |
| `@:jina!` | vunja wenye lebo | `$++ a b c` | ujenzi wa kuunganisha |
| `@:jina>` | endelea wenye lebo | `safu[i>j>k]` | fahirisi ya urambazaji |
| `->` | lambda | `safu[i] = thamani` | sasisha kipengele (safu tu) |
| `safu[i] += thamani` | sasisho la mchanganyiko | `safu[i]$~` | sasisho la utendaji (nakala mpya) |
| `$^+` | panga kupanda (primitive) | `$^-` | panga kushuka (primitive) |
| `$^` | panga kwa kilinganishi (tuple) | `<~` | rudi |
| `|>` | bomba | `!?` | jaribu |
| `:!` | kamata | `:>` | hatimaye |
| `#1` | kweli | `#0` | uwongo |
| `$!` | ni hitilafu | `$!!` | eneza hitilafu |
| `<#` | ingiza | `#>` | safirisha |
| `#` | tangaza moduli | `::` | ita moduli |
| `.` | ufikiaji wa sehemu | `#?` | metadata ya aina |
| `#\|..\|` | changanua nambari | `##.` | badilisha kuwa Sehemu ya kuelea |
| `###` | badilisha kuwa Nambari kamili (zungusha) | `##!` | badilisha kuwa Nambari kamili (kata) |
| `#.N\|..\|` | zungusha | `#!N\|..\|` | kata |
| `#,\|..\|` | umbizo la koma | `#^\|..\|` | kisayansi |
| `#d0d9#` | badilisha mode ya nambari | `#09#` | weka upya kwa ASCII |
| `<\ ..\>` | tekeleza shell | `>\<` | hoja za CLI |
| `\ var` | haribu kigezo kwa uwazi | | |

---

---

## Rekodi ya Mabadiliko ya Toleo

### v0.0.4 — Uorodheshaji Msingi-1, Kazi za Daraja la Kwanza & Vizuizi vya Moduli _(Aprili 2026)_

- **Kuvunja** Uorodheshaji wote ulibadilishwa kuwa **msingi-1** — `safu[1]` ni kipengele cha kwanza; `safu[0]` ni hitilafu ya wakati wa utekelezaji
- **Imeongezwa** Kazi zenye majina ni **thamani za daraja la kwanza** — tuma moja kwa moja kwenye kazi za kiwango cha juu: `nums$> mara mbili`
- **Imeongezwa** **Sintaksia ya kizuizi** cha moduli ni lazima: `# jina { ... }` — sintaksia bapa imeondolewa
- **Imeongezwa** Uorodheshaji wa vipimo vingi: `safu[i>j>k]` (urambazaji), `safu[p ; q]` (utoaji bapa)
- **Imeongezwa** Ubadilishaji wa aina: `##.usemi` (Sehemu ya kuelea), `###usemi` (Nambari kamili zungusha), `##!usemi` (Nambari kamili kata)
- **Imeongezwa** Mgawanyiko wa mfuatano: `mfuatano$/ kitenganishi` — hurudisha `Array(Mfuatano)`
- **Imeongezwa** Ujenzi wa kuunganisha: `msingi$++ a b c` — huongeza vipengele vingi
- **Imeongezwa** Mzunguko wa N mara: `@ N { }` — rudia mara N haswa
- **Imeongezwa** Sintaksia ya mizunguko yenye lebo: `@:jina { }`, `@:jina!`, `@:jina>` — inachukua nafasi ya `@ @jina` / `@! jina`
- **Imeongezwa** Kanuni za wigo wa vigezo: vigezo `_jina` vina wigo sahihi wa kizuizi; `\ var` huharibu mapema
- **Imeongezwa** Mifumo ya ulinganisho wa kulinganisha: `< 0 :`, `> 5 :`, `== 42 :`, n.k.
- **Imeongezwa** Hitilafu ya moduli E013: taarifa zinazotekelezeka katika mwili wa moduli zimekatazwa
- **Imerekebishwa** `take_variable` haiharibu tena visawazisho vya moduli wakati wa kuandika tena
- **Imerekebishwa** `alias.CONST` sasa inatatuliwa kwa usahihi; `#>` inaweza kuonekana baada ya ufafanuzi wa kazi
- **VM** Usawa kamili: 393/339 majaribio yanafaulu

### v0.0.3 — Mifumo ya Nambari ya Unicode & Maboresho ya LSP _(Aprili 2026)_

- **Imeongezwa** 69 vitalu vya tarakimu za Unicode na ishara ya kubadilisha mode `#d0d9#`
- **Imeongezwa** Kimwili cha Boolean katika mwandiko wowote — `#१` / `#०`, `#१` / `#०`, n.k.
- **Imeongezwa** Tarakimu za Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Imeongezwa** `SetNumeralMode` opcode ya VM — usawa kamili na mwendo-mti
- **Imeongezwa** REPL inaheshimu mode ya nambari inayotumika katika mwangwi na onyesho la vigezo
- **Imebadilishwa** Pato la Boolean `>>` sasa linajumuisha kiambishi awali `#` (`#0` / `#1`) katika mode zote

### v0.0.2_01 — Kubadilisha Jina la Kiendeshaji _(30 Machi 2026)_

- **Imebadilishwa** `c|..|` → `#,|..|` na `e|..|` → `#^|..|` — sambamba na familia ya viambishi awali vya umbizo `#`
- **Imeongezwa** Jina la utambulisho la usafirishaji — safirisha tena wanachama wa moduli kwa jina tofauti

### v0.0.2 — Usanifu Upya wa API ya Mkusanyiko & Visakinishi _(24 Machi 2026)_

- **Imeongezwa** Familia ya viendeshaji `$` iliyounganishwa kwa safu na mifuatano (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Imeongezwa** Ukabidhi wa uvunjaji kwa safu, tuple, na tuple zenye majina
- **Imeongezwa** Fahirisi hasi (`safu[-1]` = kipengele cha mwisho)
- **Imeongezwa** Visakinishi vya asili — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Machi 2026)_

- **Imeongezwa** Ukabidhi wa mchanganyiko `^=`
- **Imerekebishwa** Kesi za pembe za hesabu za kichanganuzi; masahihisho ya hati

### v0.0.1 — Toleo la Kwanza la Umma _(22 Machi 2026)_

- Mkalimani wa mwendo-mti + VM ya rejista (`--vm`, ~4× kwa kasi, ~95% usawa)
- Miundo yote ya msingi: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Vitambulishi kamili vya Unicode, mfumo wa moduli, lambda, kufungwa, ushughulikiaji wa hitilafu
- REPL, LSP, Kiendelezi cha VS Code, umbizaji (`zymbol fmt`)

---

_Zymbol-Lang — Kiishara. Kwa Ulimwengu Wote. Kisichobadilika._
