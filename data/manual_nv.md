# Zymbol-Lang Naaltsoos

**Zymbol-Lang** łahgo saad olta' nahalinígíí. Doo ła' bizaad da — ła'í nahalin. Diné bizaad nídaaz dóó łahgo saad bee olta'.

---

## Baa Hane'

- Doo ła' bizaad da (`if`, `while`, `return` — doo hólǫ́ da — ła'í nahalin: `?`, `@`, `<~`)
- Unicode nízaad — saad olta' Diné bizaad góne' dóó emoji 👋
- Łah bił nahalin — saad olta' t'áá ałtso saad bee hane'ígíí bił nahalin

---

## Saad dóó Doo Nahalin

```zymbol
x = 10                  // saad (nályééh)
PI := 3.14159           // doo nahalin (t'áá ákódaatʼéhígíí)
naaltsoos = "Ana"
ánółt'e = #1            // #1 = #1 (nídaaz)
👋 := "Yá'át'ééh"
```

### Nályééh Łahgo

```zymbol
x = 10    // 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 4    // 6
x %= 4    // 2
x++       // 3
x--       // 2
```

---

## Saad Ádaat'éhígíí

| Ádaat'éhígíí     | Nahalin             | Symbol `#?` | Baa Hane'                           |
|------------------|---------------------|-------------|-------------------------------------|
| Namboo           | `42`, `-7`          | `###`       | 64-bit, nályééh                     |
| Namboo Nízaad    | `3.14`, `1.5e10`    | `##.`       | Łahgo namboo nahalin                |
| Naaltsoos        | `"yá'át'ééh"`       | `##"`       | Bił nahalin: `"Yá'át'ééh {saad}"`  |
| Ła' Saad         | `'A'`               | `##'`       | Ła' Unicode saad                    |
| #1/#0            | `#1`, `#0`          | `##?`       | Doo namboo da                       |
| Łah Siłtsooí     | `[1, 2, 3]`         | `##]`       | T'áá ałtso ádaat'éhígíí             |
| Tuple            | `(a, b)`            | `##)`       | Nahalin bił                         |
| Tuple Bił Nizin  | `(x: 1, y: 2)`      | `##)`       | Bizhi' dóó namboo bił               |

---

## Bił Haz'á dóó Bił Ninídá

```zymbol
// Bił haz'á — doo ¶ bił ninídá da t'áá ákót'é
>> "Yá'át'ééh" ¶                    // ¶ dóó \\ — ła'í nahalin
>> "a=" a " b=" b ¶                  // łah siłtsooí juxtaposition bił
>> "łah=" nályééh(2, 3) ¶           // olta' bił nahalin ła' bił
>> (łah$#) ¶                        // postfix — ánóołt'e bił bił

// Bił ninídá
<< saad                              // doo bizhi' da — saad bił ninídá
<< "Nízhi' dínídzaa? " saad         // bizhi' bił
```

> `¶` dóó `\\` — ła'í nahalin zis nahalin.

---

## Saad Ła' Ályaaígíí

Táá' nahalinígíí — t'áá ałtso bił nahalin:

```zymbol
saad = "Ana"
namboo = 25

// 1. Dah — = dóó := bił
hane' = "Yá'át'ééh ", saad, "!"             // → Yá'át'ééh Ana!
BIZHI' := "Diné: ", saad

// 2. Juxtaposition — >> bił
>> "Yá'át'ééh " saad " namboo " namboo ¶    // → Yá'át'ééh Ana namboo 25

// 3. Bił nahalin — ła' bił bił
bizhi' = "Yá'át'ééh {saad}, namboo {namboo}"    // → Yá'át'ééh Ana, namboo 25
```

> **Baa hane'**: `+` namboo bił nahalin. Naaltsoos bił warning bił nahalin.

---

## Haa Yit'éego

```zymbol
x = 7

// Ła' nahalin
? x > 0 { >> "nídaaz" ¶ }

// ? / _? / _
? x > 100 {
    >> "nízaad" ¶
} _? x > 0 {
    >> "nídaaz" ¶
} _? x == 0 {
    >> "t'áá áłtsé" ¶
} _ {
    >> "doo nídaaz da" ¶
}
```

Bił `{ }` — **t'áá ákót'é**, ła' nahalin bił.

---

## Match

```zymbol
// Match namboo bił
namboo = 85
ánółt'e = ?? namboo {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> ánółt'e ¶    // → B

// Match bił guard
atiin = -5
hózhó = ?? atiin {
    _? atiin < 0  : "hózhó doo"
    _? atiin < 20 : "sik'az"
    _? atiin < 35 : "deesdoi"
    _             : "iiʼni'"
}
>> hózhó ¶    // → hózhó doo

// Match naaltsoos bił
dah = "łizhin"
code = ?? dah {
    "łichíʼí" : "#FF0000"
    "dootłʼizh" : "#00FF00"
    _           : "#000000"
}
>> code ¶
```

---

## Naalyéhé

```zymbol
// 0..4 itera 0,1,2,3,4 — inclusive
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Step bił
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Nánísdzá
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// @ condition bił (while)
namboo = 1
@ namboo <= 64 { namboo *= 2 }
>> namboo ¶    // → 128

// @ item:łah bił
ch'iyáán = ["na'ahóóhai", "łóóʼ", "dibé"]
@ c:ch'iyáán { >> c ¶ }

// Naaltsoos bił
@ s:"yá'át'ééh" { >> s "-" }
>> ¶    // → y-á-'-á-t-'-é-é-h-

// @! dóó @>
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> — t'áá naalyéhé
    ? i > 7 { @! }          // @! — doo naalyéhé
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Olta'í

```zymbol
// Bił hane' dóó bił nahalin
nályééh(a, b) { <~ a + b }
>> nályééh(3, 4) ¶    // → 7

// Bił nahalin nízaad
olta'í(namboo) {
    ? namboo <= 1 { <~ 1 }
    <~ namboo * olta'í(namboo - 1)
}
>> olta'í(5) ¶    // → 120

// Olta'í — isolated scope — doo łah bił da
nízaad = 100
hózhó() {
    x = 42    // ła' bił nahalin
    <~ x
}
>> hózhó() ¶    // → 42
```

> **Baa hane'**: Olta'í `name(params){ }` doo first-class da.
> Bił nahalin: `x -> name(x)`.

---

## Lambda dóó Olta'í

```zymbol
// Lambda ła' (implicit return)
nízaad = x -> x * 2
łah = (a, b) -> a + b
>> nízaad(5) ¶    // → 10
>> łah(3, 7) ¶    // → 10

// Lambda bił { } (explicit return)
ánółt'e = x -> {
    ? x > 0 { <~ "nídaaz" }
    _? x < 0 { <~ "doo nídaaz da" }
    <~ "t'áá áłtsé"
}
>> ánółt'e(5) ¶     // → nídaaz
>> ánółt'e(0) ¶     // → t'áá áłtsé
>> ánółt'e(-5) ¶    // → doo nídaaz da

// Closure — lambda bił nahalin outer vars
ádaat'éhígíí = 3
táá' = x -> x * ádaat'éhígíí    // captures 'ádaat'éhígíí'
>> táá'(7) ¶    // → 21

// Olta'í bił lambda
make_nályééh(n) { <~ x -> x + n }
nályééh10 = make_nályééh(10)
>> nályééh10(5) ¶    // → 15

// Lambda łah siłtsooí bił
olta' = [x -> x+1, x -> x*2, x -> x*x]
>> olta'[0](5) ¶    // → 6
>> olta'[2](5) ¶    // → 25
```

---

## Łah Siłtsooí

```zymbol
łah = [10, 20, 30, 40, 50]

// Index (0 bił nahalin)
>> łah[0] ¶    // → 10

// Namboo (parens bił >> bił)
namboo = łah$#
>> (łah$#) ¶    // → 5

// $+ $- $? $[..]
łah = łah$+ 60              // append
łah = łah$- 0               // index 0 remove
hólǫ́ = łah$? 30             // → #1
nahalin = łah$[0..2]        // [20, 30]

// Update
łah[1] = 99

// @ bił
@ x:łah { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` **naaltsoos nályééh** — bił ninídá: `łah = łah$+ 4`.
> Doo chaining da: łah nahalin bił bił.

---

## Tuple

```zymbol
// Named tuple
diné = (bizhi': "Shizhe'é", namboo: 25)
>> diné.bizhi' ¶    // → Shizhe'é
>> diné.namboo ¶    // → 25
>> diné[0] ¶        // → Shizhe'é (index bił nahalin)
```

---

## Olta'í Nízaadígíí

HOF — **inline lambda** — doo lambda variable da.

```zymbol
nambooí = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
nízaad = nambooí$> (x -> x * 2)
>> nízaad ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
łahgo = nambooí$| (x -> x % 2 == 0)
>> łahgo ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (t'áá áłtsé, (acc, x) -> bił)
ałtso = nambooí$< (0, (acc, x) -> acc + x)
>> ałtso ¶    // → 55
```

---

## Baa Ntsídíkees

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Namboo bił doo nahalin da" ¶
} :! ##IO {
    >> "IO bił nahalin" ¶
} :! {
    >> "łahgo: " _err ¶
} :> {
    >> "t'áá ákót'é nahalin" ¶
}
```

| Ádaat'éhígíí | Haa Yit'éego                    |
|--------------|---------------------------------|
| `##Div`      | Namboo doo bił nahalin da       |
| `##IO`       | Naaltsoos / system              |
| `##Index`    | Index doo hólǫ́ da              |
| `##Type`     | Ádaat'éhígíí doo nahalin da     |
| `##Parse`    | Parsing doo nahalin da          |
| `##Network`  | Network doo nahalin da          |
| `##_`        | T'áá ałtso (catch-all)          |

---

## Olta' Binahalin

```zymbol
// Naaltsoos: lib/nályééh.zy
# nályééh

#> { łah, get_PI }    // Exports BEFORE definitions

_PI := 3.14159
łah(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Naaltsoos: main.zy
<# ./lib/nályééh <= n    // alias t'áá ákót'é

>> n::łah(5, 3) ¶    // → 8
pi = n::get_PI()
>> pi ¶              // → 3.14159
```

---

## Olta' Bił Hóló: FizzBuzz

```zymbol
nályééh(namboo) {
    ? namboo % 15 == 0 { <~ "DliʼDizí" }
    _? namboo % 3  == 0 { <~ "Dliʼ" }
    _? namboo % 5  == 0 { <~ "Dizí" }
    _ { <~ namboo }
}

@ i:1..20 { >> nályééh(i) ¶ }
```

---

## Nahalinígíí Ła'

| Symbol  | Olta'              | Symbol     | Olta'                  |
|---------|--------------------|------------|------------------------|
| `=`     | Saad               | `$#`       | Namboo                 |
| `:=`    | Doo nahalin da     | `$+`       | Append                 |
| `>>`    | Bił haz'á          | `$-`       | Remove (index bił)     |
| `<<`    | Bił ninídá         | `$?`       | Hólǫ́                   |
| `¶`/`\` | Nahalin            | `$[s..e]`  | Slice                  |
| `?`     | ? (if)             | `$>`       | Map                    |
| `_?`    | _? (else if)       | `$\|`      | Filter                 |
| `_`     | _ (else/wildcard)  | `$<`       | Reduce                 |
| `??`    | Match              | `!?`       | Try                    |
| `@`     | Naalyéhé           | `:!`       | Catch                  |
| `@!`    | @! (break)         | `:>`       | Finally                |
| `@>`    | @> (continue)      | `$!`       | Baa ntsídíkees         |
| `->`    | Lambda             | `$!!`      | Propagate              |
| `<~`    | Return             | `#`        | Module declare         |
| `\|>`   | Pipe               | `#>`       | Export                 |
| `#1`    | #1 (nídaaz)        | `<#`       | Import                 |
| `#0`    | #0 (doo nídaaz da) | `::`       | Module call            |

---

*Zymbol-Lang — Nahalinígíí. Ła'. Doo Nahalin.*

---

> **Baa hane':** Naaltsoos éí AI yee ályaa dóó naaltsoos bee hane'. T'áá ákót'é nahalin hólǫ́ lá, nídí ła' nahalin dóó nahalinígíí doo t'áá ákót'é da.
> Bił nahalin: [Zymbol-Lang Specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
