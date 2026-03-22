# Mwongozo Mfupi wa Zymbol-Lang

**Zymbol-Lang** ni lugha ya programu ya alama. Haitumii maneno muhimu — kila kitu ni alama. Inafanya kazi sawa katika lugha yoyote ya binadamu.

---

## Falsafa

- Hakuna maneno muhimu (`if`, `while`, `return` hazipo — alama tu `?`, `@`, `<~`)
- Unicode kamili — vitambulisho katika lugha yoyote au emoji 👋
- Haitegemei lugha — msimbo ni sawa katika lugha zote

---

## Vigeuzi na Vipimo

```zymbol
x = 10           // Kigeuzí (kinachoweza kubadilishwa)
PI := 3.14159    // Kipimo (kisichobadilika — hitilafu inapokabidhiwa tena)
jina = "Ana"
hai = #1         // kweli ya kimantiki
👋 := "Habari"
```

### Uagawiaji wa Muundo

```zymbol
x = 10    // 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 4    // 6
x %=  4   // 2
x++       // 3
x--       // 2
```

---

## Aina za Data

| Aina             | Mfano               | Alama `#?` | Maelezo                              |
|------------------|---------------------|------------|--------------------------------------|
| Nambari nzima    | `42`, `-7`          | `###`      | Biti 64 zenye ishara                 |
| Nambari ya desimali | `3.14`, `1.5e10` | `##.`      | Uandishi wa kisayansi inafaa         |
| Mfuatano         | `"habari"`          | `##"`      | Uingizaji: `"Habari {jina}"`         |
| Herufi           | `'A'`               | `##'`      | Herufi moja ya Unicode               |
| Kimantiki        | `#1`, `#0`          | `##?`      | SI nambari 1 na 0                    |
| Safu             | `[1, 2, 3]`         | `##]`      | Vipengele vyote vya aina moja        |
| Tuple            | `(a, b)`            | `##)`      | Kwa nafasi                           |
| Tuple yenye jina | `(x: 1, y: 2)`      | `##)`      | Ufikiaji kwa jina au faharasa        |

---

## Matokeo na Ingizo

```zymbol
// Matokeo — HAINGIZI mstari mpya kiotomatiki
>> "Habari" ¶                    // ¶ au \\ inatoa mstari mpya wazi
>> "a=" a " b=" b ¶              // maadili mengi kwa uwekaji pamoja
>> "jumla=" jumlisha(2, 3) ¶     // miito ya vitendo katika nafasi yoyote
>> (safu$#) ¶                    // waendeshaji wa mwisho wanahitaji mabano

// Ingizo
<< jina                          // bila kauli — inasoma katika kigeuzí
<< "Jina lako? " jina            // na kauli
```

> `¶` au `\\` ni sawa kama mstari mpya.

---

## Kuunganisha Mfuatano

Njia tatu sahihi — kila moja kwa muktadha wake:

```zymbol
jina = "Ana"
n = 25

// 1. Koma — katika ukabidhiaji na = au :=
ujumbe = "Habari ", jina, "!"              // → Habari Ana!
KICHWA := "Mtumiaji: ", jina

// 2. Uwekaji pamoja — katika matokeo >>
>> "Habari " jina " una umri wa " n ¶      // → Habari Ana una umri wa 25

// 3. Uingizaji — katika muktadha wowote
maelezo = "Habari {jina}, una umri wa {n}" // → Habari Ana, una umri wa 25
```

> **Kumbuka**: `+` ni kwa nambari tu. Kwa mifuatano inatoa onyo.

---

## Udhibiti wa Mtiririko

```zymbol
x = 7

// Kama rahisi
? x > 0 { >> "chanya" ¶ }

// Kama / sivyo kama / sivyo
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

Vizuizi `{ }` ni **lazima**, hata kwa mstari mmoja.

---

## Match

```zymbol
// Match na masafa
alama = 85
daraja = ?? alama {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> daraja ¶    // → B

// Match na walinzi (masharti yoyote)
joto = -5
hali = ?? joto {
    _? joto < 0  : "barafu"
    _? joto < 20 : "baridi"
    _? joto < 35 : "joto"
    _            : "moto sana"
}
>> hali ¶    // → barafu

// Match na mifuatano
rangi = "nyekundu"
msimbo = ?? rangi {
    "nyekundu" : "#FF0000"
    "kijani"   : "#00FF00"
    _          : "#000000"
}
>> msimbo ¶
```

---

## Mizunguko

```zymbol
// Masafa ya kujumuisha: 0..4 inazunguka 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Masafa na hatua
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Masafa ya nyuma
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Wakati (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Kwa kila kipengele
matunda = ["embe", "ndizi", "zabibu"]
@ tunda:matunda { >> tunda ¶ }

// Juu ya herufi za mfuatano
@ h:"habari" { >> h "-" }
>> ¶    // → h-a-b-a-r-i-

// Simama na Endelea
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> endelea
    ? i > 7 { @! }          // @! simama
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Vitendo

```zymbol
// Tangazo na wito
jumlisha(a, b) { <~ a + b }
>> jumlisha(3, 4) ¶    // → 7

// Kujirudia
faktoria(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoria(n - 1)
}
>> faktoria(5) ¶    // → 120

// Vitendo vina upeo uliotengwa — havipatikani kwa vigeuzi vya nje
kimataifa = 100
jaribu() {
    x = 42    // ya ndani tu
    <~ x
}
>> jaribu() ¶    // → 42
```

> **Muhimu**: Vitendo vilivyopewa jina `jina(vigezo){ }` si maadili ya daraja la kwanza.
> Ili kupitisha kama hoja, vifunge: `x -> jina(x)`.

---

## Lambda na Kufunga

```zymbol
// Lambda rahisi (kurudi kwa kawaida)
mara_mbili = x -> x * 2
jumla = (a, b) -> a + b
>> mara_mbili(5) ¶    // → 10
>> jumla(3, 7) ¶      // → 10

// Lambda na kizuizi (kurudi kwa wazi)
panga = x -> {
    ? x > 0 { <~ "chanya" }
    _? x < 0 { <~ "hasi" }
    <~ "sifuri"
}
>> panga(5) ¶     // → chanya
>> panga(0) ¶     // → sifuri
>> panga(-5) ¶    // → hasi

// Kufunga — lambda zinakamata vigeuzi vya nje
kizidishi = 3
mara_tatu = x -> x * kizidishi    // inakamata 'kizidishi'
>> mara_tatu(7) ¶    // → 21

// Kiwanda cha vitendo
unda_mwongezaji(n) { <~ x -> x + n }
ongeza10 = unda_mwongezaji(10)
>> ongeza10(5) ¶    // → 15

// Lambda kama maadili: zimehifadhiwa katika safu
shughuli = [x -> x+1, x -> x*2, x -> x*x]
>> shughuli[0](5) ¶    // → 6
>> shughuli[2](5) ¶    // → 25
```

---

## Safu

```zymbol
safu = [10, 20, 30, 40, 50]

// Ufikiaji (faharasa kuanzia 0)
>> safu[0] ¶    // → 10

// Urefu (mabano yanahitajika katika >>)
n = safu$#
>> (safu$#) ¶    // → 5

// Ongeza, ondoa, ina, sehemu
safu = safu$+ 60               // ongeza
safu = safu$- 0                // ondoa faharasa 0
ina = safu$? 30                // → #1
sehemu = safu$[0..2]           // [20, 30]

// Sasisha kipengele
safu[1] = 99

// Kwa kila kipengele
@ x:safu { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` zinarudisha **safu mpya** — kabidhia tena: `safu = safu$+ 4`.
> Hakuna muunganiko: tumia ukabidhiaji mbili tofauti.

---

## Tuple

```zymbol
// Tuple yenye jina
mtu = (jina: "Alice", umri: 25)
>> mtu.jina ¶    // → Alice
>> mtu.umri ¶    // → 25
>> mtu[0] ¶      // → Alice (faharasa pia inafanya kazi)
```

---

## Vitendo vya Mpangilio wa Juu

Waendeshaji wa HOF wanahitaji **lambda ya ndani** — hakuna kigeuzí cha lambda moja kwa moja.

```zymbol
nambari = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Ramani ($>)
maradufu = nambari$> (x -> x * 2)
>> maradufu ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Chuja ($|)
za_pande_mbili = nambari$| (x -> x % 2 == 0)
>> za_pande_mbili ¶    // → [2, 4, 6, 8, 10]

// Punguza ($<) — (thamani_ya_awali, (mkusanyiko, kipengele) -> usemi)
jumla = nambari$< (0, (mkus, x) -> mkus + x)
>> jumla ¶    // → 55
```

---

## Kushughulikia Makosa

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Mgawanyiko kwa sifuri" ¶
} :! ##IO {
    >> "Hitilafu ya IO" ¶
} :! {
    >> "hitilafu nyingine: " _err ¶
} :> {
    >> "inafanywa daima" ¶
}
```

| Aina        | Inapotokea                        |
|-------------|-----------------------------------|
| `##Div`     | Mgawanyiko kwa sifuri             |
| `##IO`      | Faili / Mfumo                     |
| `##Index`   | Faharasa nje ya masafa            |
| `##Type`    | Hitilafu ya aina                  |
| `##Parse`   | Hitilafu ya uchambuzi             |
| `##Network` | Hitilafu ya mtandao               |
| `##_`       | Hitilafu yoyote (kamata-zote)     |

---

## Moduli

```zymbol
// Faili: lib/hisabati.zy
# hisabati

#> { jumlisha, pata_PI }    // Usafirishaji KABLA ya ufafanuzi

_PI := 3.14159
jumlisha(a, b) { <~ a + b }
pata_PI() { <~ _PI }
```

```zymbol
// Faili: kuu.zy
<# ./lib/hisabati <= h    // Jina la utambulisho linahitajika

>> h::jumlisha(5, 3) ¶    // → 8
pi = h::pata_PI()
>> pi ¶                   // → 3.14159
```

---

## Mfano Kamili: FizzBuzz

```zymbol
ainisha(nambari) {
    ? nambari % 15 == 0 { <~ "PovuVuu" }
    _? nambari % 3  == 0 { <~ "Povu" }
    _? nambari % 5  == 0 { <~ "Vuu" }
    _ { <~ nambari }
}

@ i:1..20 { >> ainisha(i) ¶ }
```

---

## Marejeo ya Alama

| Alama   | Shughuli            | Alama      | Shughuli               |
|---------|---------------------|------------|------------------------|
| `=`     | Kigeuzí             | `$#`       | Urefu                  |
| `:=`    | Kipimo              | `$+`       | ongeza                 |
| `>>`    | Matokeo             | `$-`       | ondoa (kwa faharasa)   |
| `<<`    | Ingizo              | `$?`       | ina                    |
| `¶`/`\` | Mstari mpya         | `$[s..e]`  | Sehemu                 |
| `?`     | kama (if)           | `$>`       | ramani (map)           |
| `_?`    | sivyo kama (elif)   | `$\|`      | chuja (filter)         |
| `_`     | sivyo / kishikio    | `$<`       | punguza (reduce)       |
| `??`    | match               | `!?`       | jaribu (try)           |
| `@`     | Mzunguko            | `:!`       | kamata (catch)         |
| `@!`    | simama (break)      | `:>`       | daima (finally)        |
| `@>`    | endelea (continue)  | `$!`       | ni hitilafu            |
| `->`    | Lambda              | `$!!`      | sambaza hitilafu       |
| `<~`    | rudisha (return)    | `#`        | tangaza moduli         |
| `\|>`   | Bomba (pipe)        | `#>`       | safirisha (export)     |
| `#1`    | kweli               | `<#`       | ingiza (import)        |
| `#0`    | uongo               | `::`       | wito wa moduli         |

---

*Zymbol-Lang — Alama. Ya Ulimwengu. Haibadiliki.*

---

> **Kumbuka:** Nyaraka hizi ziliundwa na kutafsiriwa na akili bandia (AI).
> Juhudi zote zimefanywa kuhakikisha usahihi, lakini baadhi ya tafsiri au mifano inaweza kuwa na makosa.
> Marejeo ya mamlaka ni [Vipimo vya Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
