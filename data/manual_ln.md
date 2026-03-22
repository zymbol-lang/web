# Zymbol-Lang Mokanda ya Mokuse

**Zymbol-Lang** ezali monkɔtɔ ya programasio ya bilembo. Esalelaka te maloba ya mboto — nyonso ezali lilembo. Esalaka ndenge moko na monkɔtɔ nyonso ya bato.

---

## Makanisi

- Maloba ya mboto te (`if`, `while`, `return` ezalaka te — bilembo kaka `?`, `@`, `<~`)
- Unicode ya mobimba — bakombo na monkɔtɔ nyonso to emoji 👋
- Ebotamaki te na monkɔtɔ moko — code ezali ndenge moko na minɔkɔ nyonso

---

## Bintoko mpe Biloko Ezangi Kobongwana

```zymbol
x = 10           // bintoko (ekoki kobongwana)
PI := 3.14159    // biloko ezangi kobongwana (ekoki te kobongwana — ekolela soki obongwani)
nkombo = "Ana"
solo = #1        // solo ya booléen
👋 := "Mbote"
```

### Kotya Lisangisi

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

## Mitindo ya Makambo

| Motindo          | Ndakisa             | Lilembo `#?` | Makombo                              |
|------------------|---------------------|--------------|--------------------------------------|
| Motango mobimba  | `42`, `-7`          | `###`        | Bit 64 na elembo                     |
| Motango ya koma  | `3.14`, `1.5e10`    | `##.`        | Notation ya kisayansi ekatanaka      |
| Nsango           | `"mbote"`           | `##"`        | Interpolasio: `"Mbote {nkombo}"`     |
| Mokanda           | `'A'`               | `##'`        | Mokanda moko ya Unicode              |
| Solo ya booléen  | `#1`, `#0`          | `##?`        | EZali te motango 1 to 0              |
| Mitanda          | `[1, 2, 3]`         | `##]`        | Biloko nyonso ya motindo moko        |
| Tupeli           | `(a, b)`            | `##)`        | Na esika                             |
| Tupeli na nkombo | `(x: 1, y: 2)`      | `##)`        | Kokɔta na nkombo to index            |

---

## Koloba mpe Kozwa

```zymbol
// Koloba — etyaka te motindo ya mpe na nsuka
>> "Mbote" ¶                       // ¶ to \\ epesi motindo ya mpe
>> "a=" a " b=" b ¶                // bintoko mingi na esika moko
>> "lisangisi=" kotanga(2, 3) ¶    // binto ya misala na esika nyonso
>> (arr$#) ¶                       // binto ya nsuka esengeli parenthèse

// Kozwa
<< nkombo                          // kozwa nzela — tia na bintoko
<< "Nkombo na yo? " nkombo         // na mibeko ya kozwa
```

> `¶` to `\\` ezali ndenge moko lokola motindo ya mpe.

---

## Kokatisa Mibeko

Ndenge misato ya malamu — mokomoko na ntina na ye:

```zymbol
nkombo = "Ana"
motango = 25

// 1. Koma — na kotya na = to :=
msg = "Mbote ", nkombo, "!"                // → Mbote Ana!
TITRE := "Mosalisi: ", nkombo

// 2. Esika moko — na koloba >>
>> "Mbote " nkombo " ozali " motango ¶     // → Mbote Ana ozali 25

// 3. Interpolasio — na ntina nyonso
bosembo = "Mbote {nkombo}, ozali {motango}"    // → Mbote Ana, ozali 25
```

> **Litatoli**: `+` ezali kaka mpo na baminotango. Na mibeko, ekolela.

---

## Kotambola ya Mosala

```zymbol
x = 7

// Soki moko
? x > 0 { >> "ya likolo" ¶ }

// Soki / soki mosusu / soki te
? x > 100 {
    >> "monene" ¶
} _? x > 0 {
    >> "ya likolo" ¶
} _? x == 0 {
    >> "zéro" ¶
} _ {
    >> "ya nse" ¶
}
```

Bilembo `{ }` **esengeli**, ata mpo na mwa mpe moko.

---

## Match

```zymbol
// Match na ntalo ya ntango
motango = 85
ndango = ?? motango {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> ndango ¶    // → B

// Match na bayard (bateyi ya lokola)
temp = -5
etat = ?? temp {
    _? temp < 0  : "Nzoto ya mayi"
    _? temp < 20 : "mpio"
    _? temp < 35 : "moto ndeke"
    _            : "moto mingi"
}
>> etat ¶    // → Nzoto ya mayi

// Match na mibeko
lango = "motane"
code = ?? lango {
    "motane"  : "#FF0000"
    "ya pɛpɛ" : "#00FF00"
    _         : "#000000"
}
>> code ¶
```

---

## Koluka Mbala Mingi

```zymbol
// Ntalo ya esika: 0..4 etambola 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Ntalo na etinda
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Ntalo ya liboso
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Tango (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Na biloko nyonso
mbuma = ["pasiflore", "mangele", "nzala"]
@ f:mbuma { >> f ¶ }

// Na mikanda ya nsango
@ c:"mbote" { >> c "-" }
>> ¶    // → m-b-o-t-e-

// Lekisa mpe Simba
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> tɔlɔlɔ
    ? i > 7 { @! }          // @! simba
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Misala

```zymbol
// Bongisa mpe benga
kotanga(a, b) { <~ a + b }
>> kotanga(3, 4) ¶    // → 7

// Mboyo
factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120

// Misala ezali na esika ya bango moko — ekoki te kokɔta na bintoko ya libanda
global = 100
koteka() {
    x = 42    // ya kati kaka
    <~ x
}
>> koteka() ¶    // → 42
```

> **Ntina**: Misala ya nkombo `nkombo(params){ }` ezali te biloko ya liboso.
> Mpo na kopesa lokola eloko: `x -> misala(x)`.

---

## Lambda mpe Bozali

```zymbol
// Lambda moke (liboso ya kozongisa)
mbala_mibale = x -> x * 2
lisangisi = (a, b) -> a + b
>> mbala_mibale(5) ¶    // → 10
>> lisangisi(3, 7) ¶    // → 10

// Lambda na block (kozongisa na bɔɔngɔ)
kopesa_ndango = x -> {
    ? x > 0 { <~ "ya likolo" }
    _? x < 0 { <~ "ya nse" }
    <~ "zéro"
}
>> kopesa_ndango(5) ¶     // → ya likolo
>> kopesa_ndango(0) ¶     // → zéro
>> kopesa_ndango(-5) ¶    // → ya nse

// Bozali — lambda ekanga bintoko ya libanda
factor = 3
mbala_tatu = x -> x * factor    // ekangaka 'factor'
>> mbala_tatu(7) ¶    // → 21

// Fabrika ya misala
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda lokola biloko: ebatelama na mitanda
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Mitanda

```zymbol
arr = [10, 20, 30, 40, 50]

// Kokɔta (index ya liboso = 0)
>> arr[0] ¶    // → 10

// Molai (parenthèse esengeli na >>)
n = arr$#
>> (arr$#) ¶    // → 5

// Kobakisa, kolongola, kozwa, kotiola
arr = arr$+ 60               // kobakisa
arr = arr$- 0                // kolongola index 0
azali = arr$? 30             // → #1
tiolo = arr$[0..2]           // [20, 30]

// Kobongisa eloko
arr[1] = 99

// Na biloko nyonso
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` ezongisaka **mitanda mipe** — kotya lisusu: `arr = arr$+ 4`.
> Kokatisa te: tosalela kotya mibale ya semba.

---

## Tupeli

```zymbol
// Tupeli na nkombo
moto = (nkombo: "Alice", mibu: 25)
>> moto.nkombo ¶    // → Alice
>> moto.mibu ¶      // → 25
>> moto[0] ¶        // → Alice (index esalaka mpe)
```

---

## Misala ya Nkoto

Binto ya HOF esengeli **lambda ya kati** — te bintoko ya lambda ya semba.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
mbala_mibale = nums$> (x -> x * 2)
>> mbala_mibale ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
ya_mibale = nums$| (x -> x % 2 == 0)
>> ya_mibale ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (ntalo ya ebandeli, (acc, eloko) -> boyebeli)
mobimba = nums$< (0, (acc, x) -> acc + x)
>> mobimba ¶    // → 55
```

---

## Kobatela Makambo ya Mabe

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Bokaboli na zéro" ¶
} :! ##IO {
    >> "Mabe ya IO" ¶
} :! {
    >> "mabe mosusu: " _err ¶
} :> {
    >> "etambola ntango nyonso" ¶
}
```

| Motindo     | Ntango ezalaka                         |
|-------------|----------------------------------------|
| `##Div`     | Bokaboli na zéro                       |
| `##IO`      | Fiche / Système                        |
| `##Index`   | Index elongi nsuka ya mitanda          |
| `##Type`    | Mabe ya motindo                        |
| `##Parse`   | Mabe ya kobengela                      |
| `##Network` | Mabe ya réseau                         |
| `##_`       | Mabe nyonso (catch-all)                |

---

## Mamoduli

```zymbol
// Fiche: lib/calc.zy
# calc

#> { kotanga, get_PI }    // Binto ya libanda LIBOSO ya bonsomi

_PI := 3.14159
kotanga(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Fiche: main.zy
<# ./lib/calc <= c    // nkombo ya mbano esengeli

>> c::kotanga(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                // → 3.14159
```

---

## Ndakisa ya Momesano: FizzBuzz

```zymbol
kotanga(nomboro) {
    ? nomboro % 15 == 0 { <~ "FiiziBuuzi" }
    _? nomboro % 3  == 0 { <~ "Fiizi" }
    _? nomboro % 5  == 0 { <~ "Buuzi" }
    _ { <~ nomboro }
}
@ i:1..20 { >> kotanga(i) ¶ }
```

---

## Kotalela Bilembo

| Lilembo  | Mosala             | Lilembo    | Mosala                |
|----------|--------------------|------------|-----------------------|
| `=`      | Bintoko            | `$#`       | Molai                 |
| `:=`     | Biloko ezangi      | `$+`       | kobakisa              |
| `>>`     | Koloba             | `$-`       | kolongola (na index)  |
| `<<`     | Kozwa              | `$?`       | azali na kati         |
| `¶`/`\`  | Motindo ya mpe     | `$[s..e]`  | Tiolo                 |
| `?`      | soki (if)          | `$>`       | map                   |
| `_?`     | soki mosusu (elif) | `$\|`      | filter                |
| `_`      | soki te / esika    | `$<`       | reduce                |
| `??`     | match              | `!?`       | luka (try)            |
| `@`      | Koluka mbala mingi | `:!`       | kanga (catch)         |
| `@!`     | simba (break)      | `:>`       | ntango nyonso (finally)|
| `@>`     | tɔlɔlɔ (continue)  | `$!`       | azali mabe            |
| `->`     | Lambda             | `$!!`      | tinda mabe            |
| `<~`     | kozongisa          | `#`        | bongisa moduli        |
| `\|>`    | Pipe               | `#>`       | longola libanda       |
| `#1`     | solo               | `<#`       | zwa moduli            |
| `#0`     | lokuta             | `::`       | benga moduli          |

---

*Zymbol-Lang — Ya Bilembo. Ya Bato Nyonso. Ezangi Kobongwana.*

---

> **Litatoli:** Mokanda oyo esalamaki mpe ekopiamaki na Mayele ya Makinini (AI).
> Misala nyonso esalamaki mpo na kotala malamu, kasi miteya misusu to ndakisa zingi mpe kolala na makambo ya mabe.
> Toli ya solo ezali [Zymbol-Lang specifications](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
