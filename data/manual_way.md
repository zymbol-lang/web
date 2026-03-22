# Zymbol-Lang Aküjawaa

**Zymbol-Lang** süpüla aküjalin wayuunaiki. Nnojolüin tü aküjaliakat — pütchi anüikat pümüin. Wayuunaiki aküjaa süpüla tü pütchiikat.

---

## Pütchi Anüikat

- Nnojolüin aküjaliaka (`if`, `while`, `return` nnojolüin — pütchi anüikat `?`, `@`, `<~`)
- Wayuunaiki kepiain — aküjalin sünain wayuunaiki o emoji 👋
- Aküjaliaka sünain outka — tü pütchiikat sünainjee wayuunaiki

---

## Pütchi mîna Nnojolüin Paainjüin

```zymbol
x = 10           // Pütchi (achikirawaa)
PI := 3.14159    // Nnojolüin paainjüin (nnojolüin achikiraain — pütchi sünain kachon)
suulu = "Wayuu"
wanee = #1       // pütchi anüikat wanee
👋 := "Jamaya"
```

### Pütchi Jünüin

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

## Kasa Pütchi

| Kasa            | Süchiki             | Symbol `#?`  | Aküjaa                              |
|-----------------|---------------------|--------------|-------------------------------------|
| Akumajaa        | `42`, `-7`          | `###`        | 64-bit sünain                       |
| Pütchi Akumajaa | `3.14`, `1.5e10`    | `##.`        | Pütchi anüikat aküjain              |
| Pütchirua       | `"jamaya"`          | `##"`        | Aküjaa: `"Jamaya {suulu}"`          |
| Pütchi Wanee    | `'A'`               | `##'`        | Wanee pütchi unicode                |
| Pütchi Anüikat  | `#1`, `#0`          | `##?`        | NNOJOLÜIN akumajaa 1 o 0            |
| Pütchiirua      | `[1, 2, 3]`         | `##]`        | Kasa sünainjee                      |
| Tuple           | `(a, b)`            | `##)`        | Pütchi akumajaa                     |
| Tuple Suulu     | `(x: 1, y: 2)`      | `##)`        | Aküjaa sünain suulu o akumajaa      |

---

## Ayaawataa mîna Ekirajaa

```zymbol
// Ayaawataa — nnojolüin pütchi jüpüla
>> "Jamaya" ¶                       // ¶ o \\ pütchi jüpüla
>> "a=" a " b=" b ¶                 // pütchi jünüin sünain jüpüshua
>> "sümaa=" ayaawataa(2, 3) ¶       // ayaawataa sünain outka
>> (pütchiirua$#) ¶                 // postfix süpüla parantesis

// Ekirajaa
<< suulu                            // nnojolüin pütchi — ekirajaa sünain pütchi
<< "Tü suuluka? " suulu             // sünain pütchi
```

> `¶` o `\\` wayuunaiki sünain jüpüla.

---

## Pütchi Chia

Wayuu müshi sünain — wanee sünain süchikua:

```zymbol
suulu = "Wayuu"
n = 25

// 1. Comma — sünain = o :=
pütchi = "Jamaya ", suulu, "!"           // → Jamaya Wayuu!
TITULO := "Wayuu: ", suulu

// 2. Jüpüshua — sünain ayaawataa >>
>> "Jamaya " suulu " süpüla " n ¶        // → Jamaya Wayuu süpüla 25

// 3. Aküjaa — sünain outka
aküja = "Jamaya {suulu}, süpüla {n}"     // → Jamaya Wayuu, süpüla 25
```

> **Aküjaa**: `+` süpüla akumajaa pümüin. Pütchiirua sünain pütchi jüpüshua.

---

## Kasain

```zymbol
x = 7

// Wanee kasain
? x > 0 { >> "anüikat" ¶ }

// Kasain / pütchi kasain / nnojolüin
? x > 100 {
    >> "wayuu" ¶
} _? x > 0 {
    >> "anüikat" ¶
} _? x == 0 {
    >> "süchon" ¶
} _ {
    >> "nnojolüin" ¶
}
```

Pütchi `{ }` **süpüla**, wanee sünain aküjaa.

---

## Match

```zymbol
// Match sünain pütchi akumajaa
akumajaa = 85
pütchi = ?? akumajaa {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> pütchi ¶    // → B

// Match sünain kasain
temp = -5
kasa = ?? temp {
    _? temp < 0  : "kachon"
    _? temp < 20 : "wayuu"
    _? temp < 35 : "anüikat"
    _            : "wanee"
}
>> kasa ¶    // → kachon

// Match sünain pütchirua
wanüiki = "wayuu"
kasa = ?? wanüiki {
    "wayuu"   : "#FF0000"
    "anüikat" : "#00FF00"
    _         : "#000000"
}
>> kasa ¶
```

---

## Naülaajaa

```zymbol
// Pütchi akumajaa: 0..4 naülaajain 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Pütchi akumajaa sünain step
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Pütchi akumajaa sünain süchon
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Naülaajaa sünain kasain (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Naülaajaa sünain pütchiirua
müsia = ["wayuu", "anüikat", "wanee"]
@ f:müsia { >> f ¶ }

// Naülaajaa sünain pütchirua
@ c:"jamaya" { >> c "-" }
>> ¶    // → j-a-m-a-y-a-

// @! mîna @>
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> naülaajain
    ? i > 7 { @! }          // @! süpüla
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Süpüla

```zymbol
// Aküjaa mîna ayaawataa
ayaawataa(a, b) { <~ a + b }
>> ayaawataa(3, 4) ¶    // → 7

// Naülaajain
süpülain(n) {
    ? n <= 1 { <~ 1 }
    <~ n * süpülain(n - 1)
}
>> süpülain(5) ¶    // → 120

// Süpüla sünainjee pütchi — nnojolüin aküjaa sünain outka
wayuu = 100
kasain() {
    x = 42    // wanee sünain
    <~ x
}
>> kasain() ¶    // → 42
```

> **Aküjaa**: Süpüla `suulu(nüchukua){ }` nnojolüin pütchi anüikat.
> Süpüla sünain nüchukua: `x -> suulu(x)`.

---

## Lambda mîna Tü

```zymbol
// Wanee lambda (pütchi anüikat jüpüla)
wayuusein = x -> x * 2
sümaa = (a, b) -> a + b
>> wayuusein(5) ¶    // → 10
>> sümaa(3, 7) ¶     // → 10

// Lambda sünain pütchi (aküjaa sünain <~)
kasain = x -> {
    ? x > 0 { <~ "anüikat" }
    _? x < 0 { <~ "nnojolüin" }
    <~ "süchon"
}
>> kasain(5) ¶     // → anüikat
>> kasain(0) ¶     // → süchon
>> kasain(-5) ¶    // → nnojolüin

// Tü — lambda sünainjee pütchi outka
wayuuka = 3
wayuusein3 = x -> x * wayuuka    // sünainjee 'wayuuka'
>> wayuusein3(7) ¶    // → 21

// Süpüla anüikat
make_wayuu(n) { <~ x -> x + n }
wayuu10 = make_wayuu(10)
>> wayuu10(5) ¶    // → 15

// Lambda sünain pütchiirua
kasas = [x -> x+1, x -> x*2, x -> x*x]
>> kasas[0](5) ¶    // → 6
>> kasas[2](5) ¶    // → 25
```

---

## Pütchiirua

```zymbol
pütchiirua = [10, 20, 30, 40, 50]

// Aküjaa (0-sünain akumajaa)
>> pütchiirua[0] ¶    // → 10

// Süchikua (parantesis sünain >> süpüla)
n = pütchiirua$#
>> (pütchiirua$#) ¶    // → 5

// Jünüin, süpüla, kasain, pütchi akumajaa
pütchiirua = pütchiirua$+ 60          // jünüin
pütchiirua = pütchiirua$- 0           // akumajaa 0 süpüla
kasa = pütchiirua$? 30                // → #1
pütchi = pütchiirua$[0..2]            // [20, 30]

// Pütchi achikirawaa
pütchiirua[1] = 99

// Naülaajaa sünain pütchiirua
@ x:pütchiirua { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` pütchiirua **wanee** — achikirawaa: `pütchiirua = pütchiirua$+ 4`.
> Nnojolüin jünüin: wayuu pütchi wanee sünain.

---

## Tuple

```zymbol
// Tuple sünain suulu
wayuu = (suulu: "Wayuu", akumajaa: 25)
>> wayuu.suulu ¶      // → Wayuu
>> wayuu.akumajaa ¶   // → 25
>> wayuu[0] ¶         // → Wayuu (akumajaa süpüla)
```

---

## Süpüla Nüchukua

Süpüla nüchukua süpüla **lambda inline** — nnojolüin lambda pütchi wanee.

```zymbol
akumajaat = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
wayuusein = akumajaat$> (x -> x * 2)
>> wayuusein ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
wanüikat = akumajaat$| (x -> x % 2 == 0)
>> wanüikat ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (pütchi anüikat, (acc, x) -> aküjaa)
sümaa = akumajaat$< (0, (acc, x) -> acc + x)
>> sümaa ¶    // → 55
```

---

## Nnojo

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Nnojo sünain akumajaa" ¶
} :! ##IO {
    >> "Nnojo sünain IO" ¶
} :! {
    >> "Nnojo wanee: " _err ¶
} :> {
    >> "Naülaajain wanee" ¶
}
```

| Kasa        | Wayuunaiki                        |
|-------------|-----------------------------------|
| `##Div`     | Nnojo sünain akumajaa             |
| `##IO`      | Pütchi / Kasa                     |
| `##Index`   | Akumajaa nnojolüin pütchi         |
| `##Type`    | Nnojo sünain kasa pütchi          |
| `##Parse`   | Nnojo sünain aküjaa               |
| `##Network` | Nnojo sünain wayuunaiki           |
| `##_`       | Outka nnojo (catch-all)           |

---

## Aküjaliaka

```zymbol
// Pütchi: lib/calc.zy
# calc

#> { ayaawataa, get_PI }    // Outka SÜNAIN aküjaliaka

_PI := 3.14159
ayaawataa(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Pütchi: main.zy
<# ./lib/calc <= c    // Alias süpüla

>> c::ayaawataa(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                  // → 3.14159
```

---

## Pütchi Anüikat: FizzBuzz

```zymbol
ayaawataa(nüchukua) {
    ? nüchukua % 15 == 0 { <~ "PütchiWanüiki" }
    _? nüchukua % 3  == 0 { <~ "Pütchi" }
    _? nüchukua % 5  == 0 { <~ "Wanüiki" }
    _ { <~ nüchukua }
}

@ i:1..20 { >> ayaawataa(i) ¶ }
```

---

## Pütchi Kasain

| Symbol  | Aküjaa             | Symbol     | Aküjaa                |
|---------|--------------------|------------|-----------------------|
| `=`     | Pütchi             | `$#`       | Süchikua              |
| `:=`    | Nnojolüin          | `$+`       | Jünüin                |
| `>>`    | Ayaawataa          | `$-`       | Süpüla (akumajaa)     |
| `<<`    | Ekirajaa           | `$?`       | Kasain                |
| `¶`/`\` | Pütchi Jüpüla      | `$[s..e]`  | Pütchi akumajaa       |
| `?`     | Kasain (if)        | `$>`       | map                   |
| `_?`    | Pütchi kasain      | `$\|`      | filter                |
| `_`     | Nnojolüin / outka  | `$<`       | reduce                |
| `??`    | match              | `!?`       | Nnojo kasain (try)    |
| `@`     | Naülaajaa          | `:!`       | Nnojo (catch)         |
| `@!`    | Süpüla (break)     | `:>`       | Wanee (finally)       |
| `@>`    | Naülaajain         | `$!`       | Kasa nnojo            |
| `->`    | Lambda             | `$!!`      | Nnojo jünüin          |
| `<~`    | Pütchi jüpüla      | `#`        | Aküjaliaka            |
| `\|>`   | Pipe               | `#>`       | Outka                 |
| `#1`    | Wanee              | `<#`       | Ekirajaa              |
| `#0`    | Nnojolüin          | `::`       | Aküjaliaka ayaawataa  |

---

*Zymbol-Lang — Pütchi. Wayuu. Nnojolüin Paainjüin.*

---

> **Aküjaa Wayuunaiki:** Tü aküjaliakat sünainjee inteligencia artificial (IA) aküjain.
> Ayaawataa sünain tü pütchiikat, süka wanee pütchi o aküjaa nnojolüin anüikat.
> Tü pütchi anüikat sünain [Zymbol-Lang aküjaliaka](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
