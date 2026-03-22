# Zymbol-Lang Yama Pë

**Zymbol-Lang** yanomami yama pë thë. Yamaki pë haya — nowë pë yamaki. Yanomami yama pë kë thëpë.

---

## Thëpë Nowë

- Nowë yamaki pë haya (`? `, `@`, `<~` — nowë thëpë `if`, `while`, `return` kë haya)
- Unicode thëpë — yamaki pë nowë mîna emoji 👋
- Yanomami yama pë kë — yamaki pë nowë thëpë haya

---

## Yamaki mîna Kami Pë

```zymbol
yama = 10           // yamaki (thëpë — nowë)
MAHI := 3.14159     // kami (nowë — kami pë thëpë)
nowë = "Yanomami"
thëpë = #1          // kami nowë #1
👋 := "Kë"
```

### Kami Nowë Yamaki

```zymbol
yama = 10    // 10
yama += 5    // 15
yama -= 3    // 12
yama *= 2    // 24
yama /= 4    // 6
yama %= 4    // 2
yama++       // 3
yama--       // 2
```

---

## Nowë Yamaki

| Nowë            | Thëpë               | Kami `#?` | Yamaki pë                          |
|-----------------|---------------------|------------|------------------------------------|
| Yama            | `42`, `-7`          | `###`      | 64-bit nowë                        |
| Thëpë Yama      | `3.14`, `1.5e10`    | `##.`      | Nowë yamaki OK                     |
| Pë Nowë         | `"kë"`              | `##"`      | Yamaki pë: `"Kë {nowë}"`          |
| Mîna Pë         | `'A'`               | `##'`      | Nowë mîna Unicode                  |
| Kami            | `#1`, `#0`          | `##?`      | Haya nowë 1 mîna 0                 |
| Yamaki Pë       | `[1, 2, 3]`         | `##]`      | Nowë thëpë yamaki pë               |
| Tuple           | `(a, b)`            | `##)`      | Nowë yamaki                        |
| Nowë Tuple      | `(x: 1, y: 2)`      | `##)`      | Yamaki pë nowë mîna yama           |

---

## Poremai mîna Mahi

```zymbol
// Poremai — nowë ¶ haya thëpë
>> "Kë, Yanomami!" ¶                   // ¶ mîna \\ nowë thëpë
>> "yama=" yama " nowë=" nowë ¶        // yamaki pë thëpë nowë
>> "thëpë=" poremai(2, 3) ¶            // poremai nowë thëpë
>> (mahipë$#) ¶                        // nowë postfix kami pë

// Mahi
<< nowë                                // haya kami — yamaki
<< "Nowë pë? " nowë                    // kami thëpë
```

> `¶` mîna `\\` — nowë thëpë yamaki.

---

## Yamaki Pë

Nowë thëpë — yamaki pë mîna kami:

```zymbol
nowë = "Yanomami"
yama = 25

// 1. Kami nowë — yamaki = mîna :=
pë = "Kë, ", nowë, "!"                 // → Kë, Yanomami!
MAHI := "Nowë: ", nowë

// 2. Thëpë nowë — poremai >>
>> "Kë " nowë " yama " yama ¶          // → Kë Yanomami yama 25

// 3. Yamaki — nowë thëpë
yamaki = "Kë {nowë}, yama {yama}"      // → Kë Yanomami, yama 25
```

> **Kami**: `+` nowë yama pë. Pë nowë yamaki thëpë.

---

## Thëpë

```zymbol
yama = 7

// Nowë thëpë
? yama > 0 { >> "nowë" ¶ }

// Thëpë / nowë thëpë / kami
? yama > 100 {
    >> "mahipë" ¶
} _? yama > 0 {
    >> "nowë" ¶
} _? yama == 0 {
    >> "kami" ¶
} _ {
    >> "haya" ¶
}
```

Nowë `{ }` — **kami thëpë**, mîna nowë yamaki.

---

## Match

```zymbol
// Match nowë yamaki
yama = 85
thëpë = ?? yama {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> thëpë ¶    // → B

// Match kami nowë
pë = -5
kami = ?? pë {
    _? pë < 0  : "nowë kami"
    _? pë < 20 : "haya"
    _? pë < 35 : "thëpë"
    _           : "mahipë"
}
>> kami ¶    // → nowë kami

// Match pë nowë
yamaki = "kë"
nowë = ?? yamaki {
    "kë"    : "#FF0000"
    "thëpë" : "#00FF00"
    _        : "#000000"
}
>> nowë ¶
```

---

## Yama

```zymbol
// Nowë yamaki: 0..4 → 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Yamaki kami nowë
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Haya yamaki
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Thëpë (while)
yama = 1
@ yama <= 64 { yama *= 2 }
>> yama ¶    // → 128

// Nowë yamaki pë
mahipë = ["kë", "thëpë", "nowë"]
@ pë:mahipë { >> pë ¶ }

// Yamaki pë nowë
@ mîna:"kë" { >> mîna "-" }
>> ¶    // → k-ë-

// Kami mîna Nowë
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> nowë
    ? i > 7 { @! }          // @! kami
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Poremai Thëpë

```zymbol
// Nowë mîna thëpë
poremai(mahi, nowë) { <~ mahi + nowë }
>> poremai(3, 4) ¶    // → 7

// Yamaki
kami(yama) {
    ? yama <= 1 { <~ 1 }
    <~ yama * kami(yama - 1)
}
>> kami(5) ¶    // → 120

// Poremai thëpë nowë — haya yamaki
thëpë = 100
nowë_kami() {
    yama = 42    // yamaki thëpë
    <~ yama
}
>> nowë_kami() ¶    // → 42
```

> **Kami**: Poremai `nowë(mahi){ }` haya nowë yamaki.
> Yamaki thëpë: `yama -> nowë(yama)`.

---

## Lambda mîna Nowë

```zymbol
// Lambda nowë (thëpë yamaki)
thëpë = yama -> yama * 2
kami = (mahi, nowë) -> mahi + nowë
>> thëpë(5) ¶    // → 10
>> kami(3, 7) ¶  // → 10

// Lambda kami nowë (yamaki thëpë)
nowë_kami = yama -> {
    ? yama > 0 { <~ "nowë" }
    _? yama < 0 { <~ "haya" }
    <~ "kami"
}
>> nowë_kami(5) ¶     // → nowë
>> nowë_kami(0) ¶     // → kami
>> nowë_kami(-5) ¶    // → haya

// Yamaki nowë — lambda kami thëpë
mahi = 3
thëpë_kami = yama -> yama * mahi    // kami 'mahi'
>> thëpë_kami(7) ¶    // → 21

// Poremai yamaki
make_kami(yama) { <~ mîna -> mîna + yama }
kami10 = make_kami(10)
>> kami10(5) ¶    // → 15

// Lambda nowë: yamaki pë
mahi_pë = [yama -> yama+1, yama -> yama*2, yama -> yama*yama]
>> mahi_pë[0](5) ¶    // → 6
>> mahi_pë[2](5) ¶    // → 25
```

---

## Mahipë

```zymbol
mahipë = [10, 20, 30, 40, 50]

// Yamaki (0-nowë)
>> mahipë[0] ¶    // → 10

// Nowë (kami pë >>)
yama = mahipë$#
>> (mahipë$#) ¶    // → 5

// Kami, haya, thëpë, nowë yamaki
mahipë = mahipë$+ 60              // kami
mahipë = mahipë$- 0               // haya yama 0
thëpë = mahipë$? 30               // → #1
nowë_yamaki = mahipë$[0..2]       // [20, 30]

// Yamaki nowë
mahipë[1] = 99

// Nowë yamaki pë
@ yama:mahipë { >> yama " " }
>> ¶
```

> `$+`, `$-`, `$[..]` — **nowë mahipë** thëpë — yamaki: `mahipë = mahipë$+ 4`.
> Haya kami: nowë yamaki thëpë.

---

## Tuple

```zymbol
// Nowë Tuple
yanomami = (nowë: "Alice", yama: 25)
>> yanomami.nowë ¶    // → Alice
>> yanomami.yama ¶    // → 25
>> yanomami[0] ¶      // → Alice (yamaki thëpë)
```

---

## Urihipë Poremai

Nowë thëpë — **lambda kami** — haya nowë yamaki.

```zymbol
yama_pë = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
thëpë_pë = yama_pë$> (yama -> yama * 2)
>> thëpë_pë ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
nowë_pë = yama_pë$| (yama -> yama % 2 == 0)
>> nowë_pë ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (kami, (nowë, yama) -> thëpë)
kami_pë = yama_pë$< (0, (nowë, yama) -> nowë + yama)
>> kami_pë ¶    // → 55
```

---

## Kami

```zymbol
!? {
    yama = 10 / 0
} :! ##Div {
    >> "Kami nowë haya" ¶
} :! ##IO {
    >> "Kami IO" ¶
} :! {
    >> "Kami thëpë: " _err ¶
} :> {
    >> "Nowë kami thëpë" ¶
}
```

| Nowë        | Kami thëpë                      |
|-------------|----------------------------------|
| `##Div`     | Kami nowë haya                   |
| `##IO`      | Yamaki / Thëpë                   |
| `##Index`   | Yama haya nowë                   |
| `##Type`    | Kami nowë thëpë                  |
| `##Parse`   | Yamaki kami                      |
| `##Network` | Nowë yamaki kami                 |
| `##_`       | Nowë kami thëpë (catch-all)      |

---

## Yamaki Nowë

```zymbol
// Yamaki: lib/kami.zy
# kami

#> { poremai, get_MAHI }    // Nowë thëpë HAYA yamaki

_MAHI := 3.14159
poremai(mahi, nowë) { <~ mahi + nowë }
get_MAHI() { <~ _MAHI }
```

```zymbol
// Yamaki: nowë.zy
<# ./lib/kami <= k    // Kami nowë

>> k::poremai(5, 3) ¶  // → 8
mahi = k::get_MAHI()
>> mahi ¶               // → 3.14159
```

---

## Thëpë Yama: FizzBuzz

```zymbol
poremai(mahi) {
    ? mahi % 15 == 0 { <~ "HuuReha" }
    _? mahi % 3  == 0 { <~ "Huu" }
    _? mahi % 5  == 0 { <~ "Reha" }
    _ { <~ mahi }
}

@ i:1..20 { >> poremai(i) ¶ }
```

---

## Nowë Pë Yamaki

| Kami    | Thëpë              | Kami       | Thëpë                 |
|---------|--------------------|------------|-----------------------|
| `=`     | Yamaki             | `$#`       | Nowë                  |
| `:=`    | Kami               | `$+`       | Kami nowë             |
| `>>`    | Poremai            | `$-`       | Haya (yama)           |
| `<<`    | Mahi               | `$?`       | Thëpë nowë            |
| `¶`/`\` | Nowë thëpë         | `$[s..e]`  | Yamaki nowë           |
| `?`     | Thëpë (if)         | `$>`       | map                   |
| `_?`    | Nowë thëpë (elif)  | `$\|`      | filter                |
| `_`     | Kami / nowë yamaki | `$<`       | reduce                |
| `??`    | match              | `!?`       | Kami thëpë (try)      |
| `@`     | Yama               | `:!`       | Nowë kami (catch)     |
| `@!`    | Kami (break)       | `:>`       | Nowë (finally)        |
| `@>`    | Thëpë (continue)   | `$!`       | Kami thëpë            |
| `->`    | Lambda             | `$!!`      | Kami nowë             |
| `<~`    | Yamaki (return)    | `#`        | Nowë yamaki           |
| `\|>`   | Pipe               | `#>`       | Poremai               |
| `#1`    | Kami thëpë         | `<#`       | Mahi                  |
| `#0`    | Haya               | `::`       | Nowë poremai          |

---

*Zymbol-Lang — Nowë. Thëpë. Kami Pë.*

---

> **Kami pë:** Yamaki nowë pë thëpë AI (nowë kami) mîna thëpë. Nowë yamaki kami pë thëpë, mîna kami nowë thëpë.
> Nowë kami thëpë [Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
