# Nduuzi Mkpịsị Zymbol-Lang

**Zymbol-Lang** bụ asụsụ mmemme akara. Ọ naghị eji okwu ndị isi — ihe niile bụ akara. Ọ na-arụ ọrụ otu ahụ n'asụsụ mmadụ ọ bụla.

---

## Ihe Omume Ọgụgụ

- Enweghị okwu ndị isi (`if`, `while`, `return` adịghị — ọ bụ naanị akara `?`, `@`, `<~`)
- Unicode zuru oke — atụmatụ n'asụsụ ọ bụla ma ọ bụ emoji 👋
- Asụsụ-na-asụsụ agaghị emetụta — koodu bụ otu n'asụsụ niile

---

## Ihe Ọgụgụ na Ihe Mgbagha

```zymbol
ọnụọgụ = 10           // Ihe ọgụgụ (nwere ike gbanwee)
PI := 3.14159          // Ihe mgbagha (enweghị ike gbanwee — ntụpọ na ntụgharia)
aha = "Emeka"
ọnọdụ = #1            // eziokwu boolean
👋 := "Nnọọ"
```

### Nkwupụta Ngwakọta

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

## Ụdị Data

| Ụdị             | Ihe Atụ             | Akara `#?` | Nchọkwa                             |
|-----------------|---------------------|------------|-------------------------------------|
| Nọmba Ọkè      | `42`, `-7`          | `###`      | Bit 64 nwere ihe mgbaàmà             |
| Nọmba Mgbagwọ  | `3.14`, `1.5e10`    | `##.`      | Akara sayensị dị mma                |
| Eriri           | `"nnọọ"`            | `##"`      | Ntinye: `"Nnọọ {aha}"`              |
| Mkpụrụedemede  | `'A'`               | `##'`      | Otu mkpụrụedemede Unicode           |
| Boolean         | `#1`, `#0`          | `##?`      | ABỤGHỊ nọmba 1 na 0                 |
| Usoro           | `[1, 2, 3]`         | `##]`      | Ihe niile n'ụdị otu                 |
| Tuple           | `(a, b)`            | `##)`      | Ọnọdụ                               |
| Tuple Aha       | `(x: 1, y: 2)`      | `##)`      | Enwere ike nweta n'aha ma ọ bụ index |

---

## Ntọhapụ na Ntinye

```zymbol
// Ntọhapụ — NAGHỊ etinye ahịrị ọhụrụ n'ozuzu
>> "Nnọọ" ¶                      // ¶ ma ọ bụ \\ na-eme ahịrị ọhụrụ n'ụzọ doro anya
>> "a=" ọnụọgụ " b=" ọnụọgụ2 ¶  // ọtụtụ ihe site na nkwado
>> "ngụkọta=" tinye(2, 3) ¶      // ọrụ na ọnọdụ ọ bụla
>> (usoro$#) ¶                   // ihe mgbakọ postfix chọrọ akụkọ

// Ntinye
<< aha                           // enweghị ihe ọkwa — gụọ na mgbanwe
<< "Aha gị? " aha                // nwere ihe ọkwa
```

> `¶` ma ọ bụ `\\` bụ otu ihe dị ka ahịrị ọhụrụ.

---

## Njikọ Eriri

Ụzọ atọ dị mma — nke ọ bụla maka ihe ya:

```zymbol
aha = "Emeka"
afọ = 25

// 1. Comma — na nkwupụta nwere = ma ọ bụ :=
ozi = "Nnọọ ", aha, "!"              // → Nnọọ Emeka!
ISIOKWU := "Onye ọrụ: ", aha

// 2. Nkwado — na ntọhapụ >>
>> "Nnọọ " aha " ị nwere " afọ ¶    // → Nnọọ Emeka ị nwere 25

// 3. Ntinye — na ihe ọ bụla
nkọwa = "Nnọọ {aha}, ị nwere {afọ}" // → Nnọọ Emeka, ị nwere 25
```

> **Ncheta**: `+` bụ maka nọmba naanị. Maka eriri ọ na-ewepụta ọdọ.

---

## Njikwa Ọsọ

```zymbol
x = 7

// Ọ bụrụ naanị
? x > 0 { >> "dị mma" ¶ }

// Ọ bụrụ / ọzọ bụrụ / ọzọ
? x > 100 {
    >> "nnukwu" ¶
} _? x > 0 {
    >> "dị mma" ¶
} _? x == 0 {
    >> "efu" ¶
} _ {
    >> "dị mkpa" ¶
}
```

Ngọngọ `{ }` bụ **ihe dị mkpa**, ọbụna maka ahịrị otu.

---

## Match

```zymbol
// Match nwere ihe ndikọ
ọnụọgụ = 85
nkwupụta = ?? ọnụọgụ {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> nkwupụta ¶    // → B

// Match nwere ndọrọndọrọ (ọnọdụ ọ bụla)
okpomọkụ = -5
ọnọdụ = ?? okpomọkụ {
    _? okpomọkụ < 0  : "oyi oyi"
    _? okpomọkụ < 20 : "oyi"
    _? okpomọkụ < 35 : "dị mma"
    _                : "ọkụ"
}
>> ọnọdụ ¶    // → oyi oyi

// Match nwere eriri
agba = "ọbara ọbara"
koodu = ?? agba {
    "ọbara ọbara" : "#FF0000"
    "ọcha"        : "#00FF00"
    _             : "#000000"
}
>> koodu ¶
```

---

## Mgbagha

```zymbol
// Ihe ndikọ nwere ike: 0..4 na-agafe 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Ihe ndikọ nwere ntọhapụ
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Ihe ndikọ tụgharịa
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// N'oge (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Maka ihe ọ bụla
mkpụrụ osisi = ["ọsan", "ụdara", "ọgịrịsi"]
@ f:mkpụrụ osisi { >> f ¶ }

// N'oge mkpụrụedemede eriri
@ c:"nnọọ" { >> c "-" }
>> ¶    // → n-n-ọ-ọ-

// Kwụsị na Gaa n'ihu
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> gaa n'ihu
    ? i > 7 { @! }          // @! kwụsị
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Ọrụ

```zymbol
// Nkwupụta na ọgụgụ
tinye(a, b) { <~ a + b }
>> tinye(3, 4) ¶    // → 7

// Ntọghachi
ọnụọgụ_ikpe(n) {
    ? n <= 1 { <~ 1 }
    <~ n * ọnụọgụ_ikpe(n - 1)
}
>> ọnụọgụ_ikpe(5) ¶    // → 120

// Ọrụ nwere ogige ihe ọgụgụ ya — enweghị ike nweta ihe mpụga
zuru oke = 100
nwalee() {
    x = 42    // maka ebe a naanị
    <~ x
}
>> nwalee() ¶    // → 42
```

> **Ihe dị mkpa**: Ọrụ aha `aha(params){ }` abụghị ihe isi ụkwụ.
> Maka itinye dị ka arụmọrụ gụnye: `x -> ọrụaha(x)`.

---

## Lambda na Mkpọchi

```zymbol
// Lambda dị mfe (ntọghachi kpọmkwem)
abụọ = x -> x * 2
ngụkọta = (a, b) -> a + b
>> abụọ(5) ¶       // → 10
>> ngụkọta(3, 7) ¶  // → 10

// Lambda nwere ngọngọ (ntọghachi doro anya)
kpebie = x -> {
    ? x > 0 { <~ "dị mma" }
    _? x < 0 { <~ "dị mkpa" }
    <~ "efu"
}
>> kpebie(5) ¶      // → dị mma
>> kpebie(0) ¶      // → efu
>> kpebie(-5) ¶     // → dị mkpa

// Mkpọchi — lambda na-echekwa mgbanwe mpụga
ihe_mgbakọ = 3
atọ = x -> x * ihe_mgbakọ    // na-echekwa 'ihe_mgbakọ'
>> atọ(7) ¶    // → 21

// Ọrụ ọrụ
mee_ngụkọta(n) { <~ x -> x + n }
tinye10 = mee_ngụkọta(10)
>> tinye10(5) ¶    // → 15

// Lambda dị ka ihe: echekwaa na usoro
ọrụ ndị = [x -> x+1, x -> x*2, x -> x*x]
>> ọrụ ndị[0](5) ¶    // → 6
>> ọrụ ndị[2](5) ¶    // → 25
```

---

## Usoro

```zymbol
usoro = [10, 20, 30, 40, 50]

// Nweta (index sitere na 0)
>> usoro[0] ¶    // → 10

// Ogologo (achọrọ akụkọ na >>)
n = usoro$#
>> (usoro$#) ¶    // → 5

// Tinye, wepụ, nwee, nkewa
usoro = usoro$+ 60              // tinye
usoro = usoro$- 0               // wepụ index 0
nwere = usoro$? 30              // → #1
nkewa = usoro$[0..2]            // [20, 30]

// Melite ihe
usoro[1] = 99

// Maka ihe ọ bụla
@ x:usoro { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` na-azaghachi **usoro ọhụrụ** — tinye ọzọ: `usoro = usoro$+ 4`.
> Enweghị njikọ: jiri nkwupụta abụọ dị iche iche.

---

## Tuple

```zymbol
// Tuple aha
mmadụ = (aha: "Adaeze", afọ: 25)
>> mmadụ.aha ¶    // → Adaeze
>> mmadụ.afọ ¶   // → 25
>> mmadụ[0] ¶     // → Adaeze (index na-arụ ọrụ kwa)
```

---

## Ọrụ Ọkwa Elu

Ihe mgbakọ HOF chọrọ **lambda inline** — ọ bụghị mgbanwe lambda ozugbo.

```zymbol
nọmba ndị = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
abụọ ndị = nọmba ndị$> (x -> x * 2)
>> abụọ ndị ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
ihe abụọ = nọmba ndị$| (x -> x % 2 == 0)
>> ihe abụọ ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (isi ọnụọgụ, (nchekwa, ihe) -> nkejiọgụ)
nchịkọta = nọmba ndị$< (0, (nchekwa, x) -> nchekwa + x)
>> nchịkọta ¶    // → 55
```

---

## Njikwa Mperi

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "kewaa site na efu" ¶
} :! ##IO {
    >> "mperi IO" ¶
} :! {
    >> "mperi ọzọ: " _err ¶
} :> {
    >> "na-agafe mgbe niile" ¶
}
```

| Ụdị         | Mgbe ọ na-apụta              |
|-------------|-------------------------------|
| `##Div`     | Kewaa site na efu             |
| `##IO`      | Faịlụ / sistemu               |
| `##Index`   | Index karịa oke               |
| `##Type`    | Mperi ụdị                     |
| `##Parse`   | Mperi nkewa                   |
| `##Network` | Mperi netwọk                  |
| `##_`       | Mperi ọ bụla (nwee niile)     |

---

## Ọchịchọ

```zymbol
// Faịlụ: lib/mgbakọ.zy
# mgbakọ

#> { tinye, nweta_PI }    // Mbupụ TUPU nkwupụta

_PI := 3.14159
tinye(a, b) { <~ a + b }
nweta_PI() { <~ _PI }
```

```zymbol
// Faịlụ: isi.zy
<# ./lib/mgbakọ <= m    // Alias dị mkpa

>> m::tinye(5, 3) ¶   // → 8
pi = m::nweta_PI()
>> pi ¶               // → 3.14159
```

---

## Ihe Atụ Zuru Oke: FizzBuzz

```zymbol
kewaa(nọmba) {
    ? nọmba % 15 == 0 { <~ "NtụpọỌkpọ" }
    _? nọmba % 3  == 0 { <~ "Ntụpọ" }
    _? nọmba % 5  == 0 { <~ "Ọkpọ" }
    _ { <~ nọmba }
}

@ i:1..20 { >> kewaa(i) ¶ }
```

---

## Ntụaka Akara

| Akara   | Ọrụ                  | Akara      | Ọrụ                   |
|---------|----------------------|------------|-----------------------|
| `=`     | Mgbanwe              | `$#`       | Ogologo               |
| `:=`    | Ihe mgbagha          | `$+`       | Tinye                 |
| `>>`    | Ntọhapụ              | `$-`       | Wepụ (site n'index)   |
| `<<`    | Ntinye               | `$?`       | Nwee                  |
| `¶`/`\` | Ahịrị ọhụrụ          | `$[s..e]`  | Nkewa                 |
| `?`     | Ọ bụrụ (if)          | `$>`       | map                   |
| `_?`    | Ọzọ bụrụ (elif)      | `$\|`      | filter                |
| `_`     | Ọzọ / ihe ọ bụla     | `$<`       | reduce                |
| `??`    | match                | `!?`       | Nwalee (try)          |
| `@`     | Mgbagha (loop)       | `:!`       | Nwee (catch)          |
| `@!`    | Kwụsị (break)        | `:>`       | Mgbe niile (finally)  |
| `@>`    | Gaa n'ihu (continue) | `$!`       | Bụ mperi              |
| `->`    | Lambda               | `$!!`      | Gafee mperi           |
| `<~`    | Azaghachi (return)   | `#`        | Kwupụta ọchịchọ       |
| `\|>`   | Pipe                 | `#>`       | Mbupụ                 |
| `#1`    | eziokwu              | `<#`       | Mbatinye              |
| `#0`    | ụgha                 | `::`       | Ọgụgụ ọchịchọ         |

---

*Zymbol-Lang — Akara. Ụwa nile. Enweghị Mgbanwe.*

---

> **Ncheta:** Akwụkwọ a edere ma tụgharịa ya site n'ọrụ ihe ọmụmụ arụpụta (AI).
> Anyị eme ihe niile ị ga-enwe n'aka, mana ụfọdụ ntụgharị ma ọ bụ ihe atụ nwere ike inwe njehie.
> Ntụaka bụ isi bụ [nkọwa Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
