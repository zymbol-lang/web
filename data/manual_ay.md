# Zymbol-Lang Yatiqawi

**Zymbol-Lang** mayni yatiqawi arunak. Janiw aruskipawinakax utjkiti — yatiyañanakaw puni. Aymara aru arsuñatakiw mayacht'ayasipxi.

---

## Yatichtaña

- Janiw aruskipawinakax utjkiti (`if`, `while`, `return` janiw utjkiti — yatiyañanakaw puni `?`, `@`, `<~`)
- Unicodex jikxatasipxi — jakhunak mayni arunx emoji 👋 arsuñax yatipxi
- Mayni arupuniw — códigox lurawinakatan arunakaw utjxaspani

---

## Yatiyañanaka mîna Janiw Päsitinaka

```zymbol
jakhu = 10           // yatiyaña (cambiasiñax yatipxi)
PI := 3.14159        // janiw päsititi (janiw cambiasiñax yatiti — panthasinipaw utjaspa)
sutixa = "Ana"
luräwi = #1          // bool chiqani
👋 := "Kamisaraki"
```

### Yapxt'aña Yatiyaña

```zymbol
jakhu = 10    // 10
jakhu += 5    // 15
jakhu -= 3    // 12
jakhu *= 2    // 24
jakhu /= 4    // 6
jakhu %=  4   // 2
jakhu++       // 3
jakhu--       // 2
```

---

## Kasta Yatiyañanaka

| Kasta           | Uñacht'ayaña        | Yatiyaña `#?` | Yatiqawi                            |
|-----------------|---------------------|---------------|-------------------------------------|
| Jakhu           | `42`, `-7`          | `###`         | 64-bit janiw sumaskaniti            |
| Jakhu Phuqt'aña | `3.14`, `1.5e10`    | `##.`         | Cientificow yatipxi                 |
| Arunak          | `"kamisaraki"`      | `##"`         | Yuqhantasiña: `"Kamisaraki {sutixa}"` |
| Silaña          | `'A'`               | `##'`         | Mayni Unicode silaña                |
| Bool            | `#1`, `#0`          | `##?`         | JANIW 1 mîna 0 jakhuñakiti          |
| Tantachaña      | `[1, 2, 3]`         | `##]`         | Kastax kimsa jikxatasiña            |
| Tuple           | `(a, b)`            | `##)`         | Jakhu uñacht'ayasiña                |
| Sutinak Tuple   | `(x: 1, y: 2)`      | `##)`         | Sutiw mîna jakhuniw yatinipxi       |

---

## Sartaña mîna Aptaña

```zymbol
// Sartaña — JANIW ch'uwax uñacht'ayiti
>> "Kamisaraki" ¶                    // ¶ mîna \\ ch'uwa uñacht'ayasiña
>> "a=" jakhu " b=" wakisi ¶         // achikt'ayasiñaw yatipxi
>> "yapxitaña=" sartaña(2, 3) ¶      // sartawinakax mayni jaytasiñan
>> (tantachaña$#) ¶                  // postfix yatiyañanakax paréntesisaw munipxi

// Aptaña
<< sutixa                            // janiw munaskatiti — yatiyañan aptasiña
<< "Sutimax? " sutixa                // munaskatiti
```

> `¶` mîna `\\` ch'uxñaw utjxaspani ch'uwatakiw.

---

## Arunak Chiqanchaña

Kimsa yatichtawinaka — mayniw mayni jaytasiñatakiwa:

```zymbol
sutixa = "Ana"
jakhu = 25

// 1. Coma — yatiyañan = mîna :=
willkaña = "Kamisaraki ", sutixa, "!"          // → Kamisaraki Ana!
SUTIMAX := "Yatichiri: ", sutixa

// 2. Achikt'ayasiña — sartasiñan >>
>> "Kamisaraki " sutixa " juman " jakhu ¶      // → Kamisaraki Ana juman 25

// 3. Yuqhantasiña — mayni jaytasiñan
willkaña = "Kamisaraki {sutixa}, juman {jakhu}"  // → Kamisaraki Ana, juman 25
```

> **Yatichtaña**: `+` jakhunakaw puni. Arunakan warninipaw uñjaspa.

---

## Kunjamasa

```zymbol
jakhu = 7

// Mayni kunjamasa
? jakhu > 0 { >> "jila" ¶ }

// Kunjamasa / juk'a kunjamasa / janiw
? jakhu > 100 {
    >> "jach'a" ¶
} _? jakhu > 0 {
    >> "jila" ¶
} _? jakhu == 0 {
    >> "maya" ¶
} _ {
    >> "janiw" ¶
}
```

Bloques `{ }` **munapxi**, mayni lineatakiw.

---

## Match

```zymbol
// Match jakhu pampanakan
jakhu = 85
chiqancha = ?? jakhu {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> chiqancha ¶    // → B

// Match guardanakan (mayni condicionnakan)
phusuta = -5
kastan = ?? phusuta {
    _? phusuta < 0  : "chiri"
    _? phusuta < 20 : "chirinaka"
    _? phusuta < 35 : "lupi"
    _               : "jallu"
}
>> kastan ¶    // → chiri

// Match arunakan
sami = "puca"
codigon = ?? sami {
    "puca"  : "#FF0000"
    "q'umir": "#00FF00"
    _       : "#000000"
}
>> codigon ¶
```

---

## Mayacht'aña

```zymbol
// Pampanaka: 0..4 itera 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Pampa yapxt'aña
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Janiw pampa
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Condicional (while)
jakhu = 1
@ jakhu <= 64 { jakhu *= 2 }
>> jakhu ¶    // → 128

// Tantachaña maynitakit
jallunak = ["jallu", "chiri", "lupi"]
@ f:jallunak { >> f ¶ }

// Arunak sillanankan
@ c:"kamisaraki" { >> c "-" }
>> ¶    // → k-a-m-i-s-a-r-a-k-i-

// Jaqukipaña mîna Saraña
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> saraña
    ? i > 7 { @! }          // @! jaqukipaña
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Yatiqawinaka

```zymbol
// Uñacht'ayaña mîna wawxataña
yapxitaña(a, b) { <~ a + b }
>> yapxitaña(3, 4) ¶    // → 7

// Kutitaña
contaña(jakhu) {
    ? jakhu <= 1 { <~ 1 }
    <~ jakhu * contaña(jakhu - 1)
}
>> contaña(5) ¶    // → 120

// Yatiqawinakax janiw tawaña yatipxiti — janiw tawaña yatiti
wawxa = 100
luraña() {
    x = 42    // puri mayni
    <~ x
}
>> luraña() ¶    // → 42
```

> **Jach'a**: Sutinak yatiqawinaka `sutixa(params){ }` janiw jach'a yatiyañakiti.
> Pasaña munaspa: `x -> sutixa(x)`.

---

## Lambda mîna Qilqaña

```zymbol
// Mayni lambda (janiw ch'uwa kutitaña)
pàyxataña = x -> x * 2
yapxitaña = (a, b) -> a + b
>> pàyxataña(5) ¶    // → 10
>> yapxitaña(3, 7) ¶  // → 10

// Lambda bloquenakan (ch'uwa kutitaña)
kastanchaña = x -> {
    ? x > 0 { <~ "jila" }
    _? x < 0 { <~ "janiw" }
    <~ "maya"
}
>> kastanchaña(5) ¶     // → jila
>> kastanchaña(0) ¶     // → maya
>> kastanchaña(-5) ¶    // → janiw

// Qilqaña — lambdanakax tawaña yatipxi
luraña = 3
kimsa_kuti = x -> x * luraña    // luraña qilqasiwa
>> kimsa_kuti(7) ¶    // → 21

// Yatiqawi luraña
make_yapxitaña(jakhu) { <~ x -> x + jakhu }
yapxitaña10 = make_yapxitaña(10)
>> yapxitaña10(5) ¶    // → 15

// Lambdanakax yatiyañanakaw — tantachaña
lurawinaka = [x -> x+1, x -> x*2, x -> x*x]
>> lurawinaka[0](5) ¶    // → 6
>> lurawinaka[2](5) ¶    // → 25
```

---

## Tantachaña

```zymbol
tantachaña = [10, 20, 30, 40, 50]

// Yatinuña (0 jakhuniw qallantaña)
>> tantachaña[0] ¶    // → 10

// Jach'anaka (paréntesisaw >> munipxi)
jakhu = tantachaña$#
>> (tantachaña$#) ¶    // → 5

// Yapxtaña, jiwayaña, utjiñ, siq'iña
tantachaña = tantachaña$+ 60               // yapxtaña
tantachaña = tantachaña$- 0                // 0 jakhu jiwayaña
utji = tantachaña$? 30                     // → #1
siq'iña = tantachaña$[0..2]               // [20, 30]

// Jakhu cambiaña
tantachaña[1] = 99

// Maynitakit
@ x:tantachaña { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` **mayni tantachaña** kutipxi — mayacht'aña: `tantachaña = tantachaña$+ 4`.
> Janiw chiqanchasiñax yatiti: pàya cambianakaw luraña.

---

## Tuple

```zymbol
// Sutinak tuple
jaqi = (sutixa: "Alice", maranaka: 25)
>> jaqi.sutixa ¶    // → Alice
>> jaqi.maranaka ¶  // → 25
>> jaqi[0] ¶        // → Alice (jakhuniw yatipxiw)
```

---

## Nayra Yatiqawinaka

HOF yatiyañanakax **inline lambda** munipxi — janiw lambda yatiyaña chiruntita.

```zymbol
jakhunak = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
pàyxataña = jakhunak$> (x -> x * 2)
>> pàyxataña ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
pärnak = jakhunak$| (x -> x % 2 == 0)
>> pärnak ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (qalltaña jakhu, (tantaña, jakhu) -> yatiyaña)
tantanaka = jakhunak$< (0, (acc, x) -> acc + x)
>> tantanaka ¶    // → 55
```

---

## Panthasiña

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Janiw jakhuñax yatiti" ¶
} :! ##IO {
    >> "IO panthasiña" ¶
} :! {
    >> "Juk'a panthasiña: " _err ¶
} :> {
    >> "Mayniw lurasipxi" ¶
}
```

| Kasta       | Kunjamasa utjaspa              |
|-------------|--------------------------------|
| `##Div`     | Janiw jakhuñax yatiti          |
| `##IO`      | Archivo / Sistema              |
| `##Index`   | Jakhu pampan janiw utjkiti     |
| `##Type`    | Kasta panthasiña               |
| `##Parse`   | Leer panthasiña                |
| `##Network` | Red panthasiña                 |
| `##_`       | Mayni panthasiña (catch-all)   |

---

## Lurawi

```zymbol
// Archivo: lib/calc.zy
# calc

#> { yapxitaña, get_PI }    // Exportar NAYRA definicionan

_PI := 3.14159
yapxitaña(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Archivo: main.zy
<# ./lib/calc <= c    // Alias munapxi

>> c::yapxitaña(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                   // → 3.14159
```

---

## Phuqat Yatiqawi: FizzBuzz

```zymbol
sartaña(jakhu) {
    ? jakhu % 15 == 0 { <~ "PupuñaJaqaña" }
    _? jakhu % 3  == 0 { <~ "Pupuña" }
    _? jakhu % 5  == 0 { <~ "Jaqaña" }
    _ { <~ jakhu }
}

@ i:1..20 { >> sartaña(i) ¶ }
```

---

## Yatiyañanaka Uñjawi

| Yatiyaña | Luraña              | Yatiyaña   | Luraña                |
|----------|---------------------|------------|-----------------------|
| `=`      | Yatiyaña            | `$#`       | Jach'anaka            |
| `:=`     | Janiw Päsititi      | `$+`       | Yapxtaña              |
| `>>`     | Sartaña             | `$-`       | Jiwayaña (jakhuniw)   |
| `<<`     | Aptaña              | `$?`       | Utjiñ                 |
| `¶`/`\`  | Ch'uwa              | `$[s..e]`  | Siq'iña               |
| `?`      | Kunjamasa (if)      | `$>`       | map                   |
| `_?`     | Juk'a (elif)        | `$\|`      | filter                |
| `_`      | Janiw / Placeholder | `$<`       | reduce                |
| `??`     | match               | `!?`       | luraña (try)          |
| `@`      | Mayacht'aña         | `:!`       | aptaña (catch)        |
| `@!`     | Jaqukipaña (break)  | `:>`       | mayniw (finally)      |
| `@>`     | Saraña (continue)   | `$!`       | panthasiña yatinuña   |
| `->`     | Lambda              | `$!!`      | panthasiña pasaña     |
| `<~`     | Kutitaña (return)   | `#`        | Lurawi uñacht'ayaña   |
| `\|>`    | Pipe                | `#>`       | exportaña             |
| `#1`     | chiqani             | `<#`       | importaña             |
| `#0`     | janiw               | `::`       | Lurawi wawxataña      |

---

*Zymbol-Lang — Yatiyañanaka. Mayni. Janiw Pästiti.*

---

> **Yatichtaña:** Kay yatiqawixa inteligencia artificial (IA) lurasipxiwa mîna mayacht'ayasipxiwa.
> Chiqanchasiñatakix walja lurawinakaw lurasipxi, ukampis juk'a yatichtawinaka mîna uñacht'ayañanakax panthasinipaw utjaspa.
> Jach'a yatiqawixa [Zymbol-Lang yatichtawi](https://github.com/OscarEEspinozaB/zymbol-lang-web) awa.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
