# Parma Pitya Zymbol-Lang

**Zymbol-Lang** ná tengwesta tancalima. Quetta úva — ilqua ná tengwa. Ná same ilya lambe Eruo.

---

## Nandë

- Quetti úvë (`if`, `while`, `return` ú-nar — tengwi nér `?`, `@`, `<~`)
- Unicode ilya — essë ilya lambessë, ilyë emoji 👋
- Lambe-nurtalë — tengwesta same ilya lambessin

---

## Harya ar Carna Ne'

```zymbol
x = 10           // harya (imbë)
PI := 3.14159    // carna ne' (lá imbë — raxë cé imbëa)
essë = "Ana"
naimë = #1       // vórë ná
👋 := "Namárië"
```

### Tanwë Harya

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

## Nossë Cuilë

| Nossë           | Sanyë             | Tengwa `#?` | Notë                                |
|-----------------|-------------------|-------------|-------------------------------------|
| Nótë            | `42`, `-7`        | `###`       | 64-bit sinwa                        |
| Nótë pitya      | `3.14`, `1.5e10`  | `##.`       | Notë tiuca ná                       |
| Quetta          | `"namárië"`       | `##"`       | Lúmequenta: `"Namárië {essë}"`      |
| Tengwa          | `'A'`             | `##'`       | Minë Unicode tengwa                 |
| Vórë/Lá        | `#1`, `#0`        | `##?`       | Lá nótë minë ar nul                 |
| Rimba           | `[1, 2, 3]`       | `##]`       | Ilqua nossë same                    |
| Tuple           | `(a, b)`          | `##)`       | Anwa                                |
| Essëa Tuple     | `(x: 1, y: 2)`    | `##)`       | Essë ilyë nótë                      |

---

## Quetë ar Hlara

```zymbol
// Quetë — lá tirë lúmë autë
>> "Namárië" ¶                  // ¶ ar \\ tirë lúmë autë
>> "a=" a " b=" b ¶             // rimba nótë — tanwë
>> "nótë=" carna(2, 3) ¶        // maquet ilya tanwë
>> (arr$#) ¶                    // tengwi nótë poQlu'

// Hlara
<< essë                         // ú-quenta — hlara harya
<< "Mana essëlya? " essë        // quenta
```

> `¶` ar `\\` — same lúmë autë.

---

## Quetta Boqë

Neldë nossë — ilqua tanwë:

```zymbol
essë = "Ana"
n = 25

// 1. Comma — harya = ar :=
tengwë = "Namárië ", essë, "!"           // → Namárië Ana!
ARAN := "Elda: ", essë

// 2. Tanwë — quetë >>
>> "Namárië " essë " lyen nótë " n ¶     // → Namárië Ana lyen nótë 25

// 3. Lúmequenta — ilya tanwë
quenta = "Namárië {essë}, lyen nótë {n}" // → Namárië Ana, lyen nótë 25
```

> **Notë**: `+` nótëssen. Quettassen — raxë.

---

## Nurtalë

```zymbol
x = 7

// Pitya námo
? x > 0 { >> "poldë" ¶ }

// Námo / ar-námo / ar
? x > 100 {
    >> "alta" ¶
} _? x > 0 {
    >> "poldë" ¶
} _? x == 0 {
    >> "nul" ¶
} _ {
    >> "nurwa" ¶
}
```

`{ }` — **poQlu'**, minë tengwesta.

---

## Match

```zymbol
// Match nótë
nótë2 = 85
patlh = ?? nótë2 {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> patlh ¶    // → B

// Match nurwi (ilya námo)
ringa = -5
indo = ?? ringa {
    _? ringa < 0  : "helca"
    _? ringa < 20 : "ringa"
    _? ringa < 35 : "larca"
    _             : "urwa"
}
>> indo ¶    // → helca

// Match quetti
óla = "carnë"
tengwa2 = ?? óla {
    "carnë"  : "#FF0000"
    "laicë"  : "#00FF00"
    _        : "#000000"
}
>> tengwa2 ¶
```

---

## Lúvë

```zymbol
// Naná: 0..4 — 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Nótë ar nanwë
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Luivë
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Ilya (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Ilya rimba
yávë = ["orne", "lossë", "nén"]
@ f:yávë { >> f ¶ }

// Tengwi quetta
@ c:"eldar" { >> c "-" }
>> ¶    // → e-l-d-a-r-

// Caitë ar Endë
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> endë
    ? i > 7 { @! }          // @! caitë
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Maquet

```zymbol
// Tanwë ar maquet
boqë(a, b) { <~ a + b }
>> boqë(3, 4) ¶    // → 7

// Tirë
nótëmaquet(n) {
    ? n <= 1 { <~ 1 }
    <~ n * nótëmaquet(n - 1)
}
>> nótëmaquet(5) ¶    // → 120

// Maquet — ú-tirë andunë nótë
_ilya = 100
temë() {
    x = 42    // só
    <~ x
}
>> temë() ¶    // → 42
```

> **Vórë**: Essëa maquet `essë(params){ }` — lá minë nótë.
> Hríva — yomë: `x -> essë(x)`.

---

## Lambda ar Nurta

```zymbol
// Pitya lambda (tancalë)
tatya = x -> x * 2
boqë2 = (a, b) -> a + b
>> tatya(5) ¶    // → 10
>> boqë2(3, 7) ¶  // → 10

// Lambda rimba (naná tancalë)
carna2 = x -> {
    ? x > 0 { <~ "poldë" }
    _? x < 0 { <~ "nurwa" }
    <~ "nul"
}
>> carna2(5) ¶     // → poldë
>> carna2(0) ¶     // → nul
>> carna2(-5) ¶    // → nurwa

// Nurta — lambda harya andunë nótë
tancal = 3
neldë = x -> x * tancal    // harya 'tancal'
>> neldë(7) ¶    // → 21

// Maquet tanwë
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda nótë: rimbassë
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Rimbar

```zymbol
arr = [10, 20, 30, 40, 50]

// Tirë (0 nótë)
>> arr[0] ¶    // → 10

// Rimba (poQlu' >>)
n = arr$#
>> (arr$#) ¶    // → 5

// Boqë, telë, harya, pitya
arr = arr$+ 60               // boqë
arr = arr$- 0                // telë 0
harya = arr$? 30             // → #1
pitya = arr$[0..2]           // [20, 30]

// Imbë nótë
arr[1] = 99

// Ilya nótë
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` — **cuivëa rimba** — harya: `arr = arr$+ 4`.
> Lá tanwë: tatya harya Dalo'.

---

## Tuplë

```zymbol
// Essëa tuple
Elda = (essë: "Alice", loa: 25)
>> Elda.essë ¶    // → Alice
>> Elda.loa ¶     // → 25
>> Elda[0] ¶      // → Alice (nótë ná)
```

---

## Maquet Alta

HOF — **só lambda** — lá lambda nótë.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
tatyar = nums$> (x -> x * 2)
>> tatyar ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
aicë = nums$| (x -> x % 2 == 0)
>> aicë ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (tancalë nótë, (boqë, nótë) -> moj)
ilqua = nums$< (0, (acc, x) -> acc + x)
>> ilqua ¶    // → 55
```

---

## Raxë Nurta

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "nul nótë" ¶
} :! ##IO {
    >> "IO raxë" ¶
} :! {
    >> "raxë: " _err ¶
} :> {
    >> "ilya lúmë" ¶
}
```

| Nossë       | Lúmë                           |
|-------------|--------------------------------|
| `##Div`     | Nul nótë                       |
| `##IO`      | Parma / quendë                 |
| `##Index`   | Nótë andë                      |
| `##Type`    | Nossë raxë                     |
| `##Parse`   | Tanwë raxë                     |
| `##Network` | Tengwë raxë                    |
| `##_`       | Ilya raxë                      |

---

## Tanwesta

```zymbol
// Parma: lib/calc.zy
# calc

#> { boqë, get_PI }    // Nob MINË

_PI := 3.14159
boqë(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Parma: main.zy
<# ./lib/calc <= c    // Essë poQlu'

>> c::boqë(5, 3) ¶    // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

---

## Naná Sanyë: FizzBuzz

```zymbol
carna(nótë) {
    ? nótë % 15 == 0 { <~ "CalëMorë" }
    _? nótë % 3  == 0 { <~ "Calë" }
    _? nótë % 5  == 0 { <~ "Morë" }
    _ { <~ nótë }
}

@ i:1..20 { >> carna(i) ¶ }
```

---

## Tengwi Tirë

| Tengwa   | Moj                | Tengwa     | Moj                   |
|----------|--------------------|------------|-----------------------|
| `=`      | harya              | `$#`       | rimba                 |
| `:=`     | carna ne'          | `$+`       | boqë                  |
| `>>`     | quetë              | `$-`       | telë (nótë)           |
| `<<`     | hlara              | `$?`       | harya                 |
| `¶`/`\`  | lúmë autë          | `$[s..e]`  | pitya                 |
| `?`      | námo (if)          | `$>`       | map                   |
| `_?`     | ar-námo (elif)     | `$\|`      | filter                |
| `_`      | ar / ilya          | `$<`       | reduce                |
| `??`     | match              | `!?`       | temë (try)            |
| `@`      | lúvë               | `:!`       | nurta (catch)         |
| `@!`     | caitë (break)      | `:>`       | ilya (finally)        |
| `@>`     | endë (continue)    | `$!`       | raxë ná               |
| `->`     | Lambda             | `$!!`      | raxë nob              |
| `<~`     | anna               | `#`        | tanwesta essë         |
| `\|>`    | Pipe               | `#>`       | nob                   |
| `#1`     | vórë               | `<#`       | hlara                 |
| `#0`     | lá                 | `::`       | tanwesta maquet       |

---

*Zymbol-Lang — Tengwesta. Ilya. Lá imbë.*

---

> **Notë:** Parma sina carna ar quenta AI (tancalë maquetë).
> Ilya carna ná, mal neldë quetti ar sanyë raxë haryan.
> Tancalëa parma [Zymbol-Lang tengwesta](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
