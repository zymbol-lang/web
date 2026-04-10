# Nduuzi Mkpịsị Zymbol-Lang

**Zymbol-Lang** bụ asụsụ mmemme akara. Ọ naghị eji okwu ndị isi — ihe niile bụ akara. Ọ na-arụ ọrụ otu ahụ n'asụsụ mmadụ ọ bụla.

- Enweghị okwu ndị isi (`if`, `while`, `return` adịghị — ọ bụ naanị akara `?`, `@`, `<~`)
- Unicode zuru oke — atụmatụ n'asụsụ ọ bụla ma ọ bụ emoji 👋
- Asụsụ-na-asụsụ agaghị emetụta — koodu bụ otu n'asụsụ niile

---

## Ihe Ọgụgụ na Ihe Mgbagha

```zymbol
x = 10              // ihe ọgụgụ (nwere ike gbanwee)
PI := 3.14159       // ihe mgbagha — ntụpọ na ntụgharia
aha = "Emeka"
ọnọdụ = #1         // eziokwu boolean
👋 := "Nnọọ"
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

## Ọnọdụ Ọnụọgụ

Zymbol nwere ike igosi ọnụọgụ na **ọnụọgụ Unicode 69** — Devanagari, Arabic-India, Thai, Klingon pIqaD, Mgbakọ Siri Ike, LCD ma ọzọ. Ọnọdụ dị ndụ naanị metụtara mmepụta `>>`; mgbakọ dị n'ime na-abụ naanị binary.

### Mee ka ọdịnaala arụọrụ

Dee ọnụọgụ `0` na `9` nke ọdịnaala ị chọrọ n'ime `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabic-Indic  (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // reset to ASCII
```

### Mmepụta na uru Boolean

```zymbol
x = 42
>> x ¶          // → 42   (ASCII default)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४
>> 1 + 2 ¶      // → ३

// Boolean: # na-abụ naanị ASCII, ọnụọgụ na-eme mgbanwe
>> #1 ¶         // → #१
>> #0 ¶         // → #०

x = 28 > 4
>> x ¶          // → #१
```

### Ọnụọgụ nke ọha n'ime koodu isi mmalite

Ọnụọgụ nke ọ bụla ọdịnaala a na-akwado bụ literals ziri ezi — n'ime ógbè, modulo, ntụnyere:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolean literals n'ime ọdịnaala ọ bụla

`#` + ọnụọgụ `0` ma ọ bụ `1` sitere n'ime ngọngọ ọ bụla bụ literal Boolean ziri ezi:

```zymbol
#٠٩#
نشط = #١
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` bụ **ASCII mgbe niile**. `#0` (ụgha) na-abụ naanị ihe dị iche n'anya na `0` (zero nọmba zuru oke) n'ime ọdịnaala ọ bụla.

---

## Ụdị Data

| Ụdị | Ihe Atụ | Akara `#?` | Nchọkwa |
|-----|---------|------------|---------|
| Nọmba Ọkè | `42`, `-7` | `###` | Bit 64 nwere ihe mgbaàmà |
| Nọmba Mgbagwọ | `3.14`, `1.5e10` | `##.` | Akara sayensị dị mma |
| Eriri | `"nnọọ"` | `##"` | Ntinye: `"Nnọọ {aha}"` |
| Mkpụrụedemede | `'A'` | `##'` | Otu mkpụrụedemede Unicode |
| Boolean | `#1`, `#0` | `##?` | ABỤGHỊ nọmba 1 na 0 |
| Usoro | `[1, 2, 3]` | `##]` | Ihe niile n'ụdị otu |
| Tuple | `(a, b)` | `##)` | Ọnọdụ |
| Tuple Aha | `(x: 1, y: 2)` | `##)` | Enwere ike nweta n'aha ma ọ bụ index |

```zymbol
// Nyocha ụdị — na-azaghachi (ụdị, ọnụọgụ, ọnụọgụ_uru)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Ntọhapụ na Ntinye

```zymbol
>> "Nnọọ" ¶                      // ¶ ma ọ bụ \\ na-eme ahịrị ọhụrụ n'ụzọ doro anya
>> "a=" a " b=" b ¶              // ọtụtụ ihe site na nkwado
>> (usoro$#) ¶                   // ihe mgbakọ postfix chọrọ akụkọ

<< aha                           // enweghị ihe ọkwa — gụọ na mgbanwe
<< "Aha gị? " aha                // nwere ihe ọkwa
```

> `¶` ma ọ bụ `\\` bụ otu ihe dị ka ahịrị ọhụrụ.

---

## Ndị Arụmọrụ

```zymbol
// Mgbakọ — jiri nkwupụta; ụfọdụ ihe mgbakọ nwere nsogbu ozugbo na >>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (ikewa nọmba ọkè)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (ike)

// Itule
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Mgbakọ ezigbo
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Eriri

```zymbol
// Ụzọ atọ nke njikọ
aha = "Emeka"
n = 42

ozi = "Nnọọ ", aha, "!"              // comma — na nkwupụta
>> "Nnọọ " aha " ị nwere " n ¶       // nkwado — na >>
nkọwa = "Nnọọ {aha}, ị nwere {n}"    // ntinye — ebe ọ bụla
```

```zymbol
s = "Nnọọ Ụwa"
ogologo = s$#                  // 9
akụkụ = s$[0..4]               // "Nnọọ"  (ọgwụgwụ adịghị)
nwere = s$? "Ụwa"              // #1
akụkụ_ndị = "a,b,c,d" / ','    // [a, b, c, d]
tọgharia = s$~~["ọ":"Ọ"]       // tọgharia niile
tọgharia1 = s$~~["ọ":"Ọ":1]   // naanị N nke mbụ
```

> `+` bụ maka nọmba naanị. Jiri `,`, nkwado, ma ọ bụ ntinye maka eriri.

---

## Njikwa Ọsọ

```zymbol
x = 7

? x > 0 { >> "dị mma" ¶ }

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

> Ngọngọ `{ }` bụ **ihe dị mkpa**, ọbụna maka ahịrị otu.

---

## Match

```zymbol
// Ihe ndikọ
ọnụọgụ = 85
nkwupụta = ?? ọnụọgụ {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> nkwupụta ¶    // → B

// Eriri
agba = "ọbara ọbara"
koodu = ?? agba {
    "ọbara ọbara" : "#FF0000"
    "ọcha"        : "#00FF00"
    _             : "#000000"
}

// Ndọrọndọrọ
okpomọkụ = -5
ọnọdụ = ?? okpomọkụ {
    _? okpomọkụ < 0  : "oyi oyi"
    _? okpomọkụ < 20 : "oyi"
    _? okpomọkụ < 35 : "dị mma"
    _                : "ọkụ"
}
>> ọnọdụ ¶    // → oyi oyi

// Ụdị ọrụ (akụkụ ngọngọ)
?? n {
    0       : { >> "efu" ¶ }
    _? n < 0: { >> "dị mkpa" ¶ }
    _       : { >> "dị mma" ¶ }
}
```

---

## Mgbagha

```zymbol
@ i:0..4  { >> i " " }        // ihe ndikọ nwere ike: 0 1 2 3 4
@ i:1..9:2 { >> i " " }       // nwere ntọhapụ: 1 3 5 7 9
@ i:5..0:1 { >> i " " }       // tụgharịa: 5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (n'oge)

mkpụrụ osisi = ["ọsan", "ụdara", "ọgịrịsi"]
@ f:mkpụrụ osisi { >> f ¶ }  // maka ihe ọ bụla na usoro

@ c:"nnọọ" { >> c "-" }
>> ¶                          // → n-n-ọ-ọ-  (maka mkpụrụedemede ọ bụla)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> gaa n'ihu
    ? i > 7 { @! }             // @! kwụsị
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Mgbagha enweghị njedebe
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Mgbagha nwere akara (kwụsị n'ime)
ọnụọgụ = 0
@ @mpụga {
    ọnụọgụ++
    ? ọnụọgụ >= 3 { @! mpụga }
}
>> ọnụọgụ ¶                   // → 3
```

---

## Ọrụ

```zymbol
tinye(a, b) { <~ a + b }
>> tinye(3, 4) ¶    // → 7

ọnụọgụ_ikpe(n) {
    ? n <= 1 { <~ 1 }
    <~ n * ọnụọgụ_ikpe(n - 1)
}
>> ọnụọgụ_ikpe(5) ¶    // → 120
```

Ọrụ nwere **ogige ihe ọgụgụ ya** — enweghị ike nweta ihe mpụga. Jiri ihe ngosi ntọhapụ `<~` iji gbanwee mgbanwe nke onye na-akpọ:

```zymbol
tụgharịa(a<~, b<~) {
    oge = a
    a = b
    b = oge
}
x = 10
y = 20
tụgharịa(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Ọrụ aha abụghị ihe isi ụkwụ. Maka itinye dị ka arụmọrụ gụnye: `x -> ọrụaha(x)`.

---

## Lambda na Mkpọchi

```zymbol
abụọ = x -> x * 2
ngụkọta = (a, b) -> a + b
>> abụọ(5) ¶       // → 10
>> ngụkọta(3, 7) ¶  // → 10

// Lambda nwere ngọngọ
kpebie = x -> {
    ? x > 0 { <~ "dị mma" }
    _? x < 0 { <~ "dị mkpa" }
    <~ "efu"
}

// Mkpọchi — na-echekwa mgbanwe mpụga
ihe_mgbakọ = 3
atọ = x -> x * ihe_mgbakọ
>> atọ(7) ¶    // → 21

// Ọrụ ọrụ
mee_ngụkọta(n) { <~ x -> x + n }
tinye10 = mee_ngụkọta(10)
>> tinye10(5) ¶    // → 15

// Na usoro
ọrụ ndị = [x -> x+1, x -> x*2, x -> x*x]
>> ọrụ ndị[2](5) ¶    // → 25
```

---

## Usoro

Usoro bụ **nke enwere ike gbanwee** ma na-ejide ihe nke **ụdị otu**.

```zymbol
usoro = [1, 2, 3, 4, 5]

usoro[0]          // 1 — nweta (index sitere na 0)
usoro[-1]         // 5 — index ọnụọgụ (ọgwụgwụ)
usoro$#           // 5 — ogologo (jiri (usoro$#) na >>)

usoro = usoro$+ 6            // tinye → [1,2,3,4,5,6]
usoro2 = usoro$+[2] 99       // tinye na index 2
usoro3 = usoro$- 3           // wepụ ụzọ mbụ nke ọnụọgụ
usoro4 = usoro$-- 3          // wepụ ihe niile
usoro5 = usoro$-[0]          // wepụ na index
usoro6 = usoro$-[1..3]       // wepụ ebe (ọgwụgwụ adịghị)

nwere = usoro$? 3             // #1 — nwee
ọnọdụ_ndị = usoro$?? 3       // [2] — index niile nke ọnụọgụ
sl = usoro$[0..3]             // [1,2,3] — nkewa (ọgwụgwụ adịghị)
sl2 = usoro$[0:3]             // [1,2,3] — ụdị ọnụọgụ

elu = usoro$^+                // hazie n'elu (primitives naanị)
ala = usoro$^-                // hazie n'ala (primitives naanị)

// Usoro tuple — jiri $^ na lambda itule
nchekwa = [(aha: "Carla", afọ: 28), (aha: "Ada", afọ: 25), (aha: "Bob", afọ: 30)]
site_afọ  = nchekwa$^ (a, b -> a.afọ < b.afọ)    // n'elu site n'afọ
site_aha = nchekwa$^ (a, b -> a.aha > b.aha)      // n'ala site n'aha
>> site_afọ[0].aha ¶     // → Ada
>> site_aha[0].aha ¶     // → Carla

// Melite ihe ozugbo (usoro naanị)
usoro[1] = 99              // kenye
usoro[0] += 5              // nchịkọta: +=  -=  *=  /=  %=  ^=

// Melite ọrụ — na-azaghachi usoro ọhụrụ; nke mbụ adịghịzi gbanwe
usoro2 = usoro[1]$~ 99
```

> Ihe mgbakọ nchịkọta niile na-azaghachi **usoro ọhụrụ**. Tinye ọzọ: `usoro = usoro$+ 4`.
> Enweghị njikọ — jiri nkwupụta abụọ dị iche iche.
> `$^+` / `$^-` hazie **usoro primitives** (nọmba, eriri). Maka usoro tuple jiri `$^` na lambda itule — ọnọdụ dị na lambda (`<` = n'elu, `>` = n'ala).

**Usoro nke ọnụọgụ** — ịnyefe usoro na mgbanwe ọzọ na-emepụta otu ihe dị onwe ya:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b adịghị gbanwe
```

```zymbol
// Usoro ndị edebere n'ime
mẹtriks = [[1,2,3],[4,5,6],[7,8,9]]
>> mẹtriks[1][2] ¶    // → 6
```

---

## Ikewa

```zymbol
// Usoro
usoro = [10, 20, 30, 40, 50]
[a, b, c] = usoro              // a=10  b=20  c=30
[nke_mbụ, *ndị_ọzọ] = usoro   // nke_mbụ=10  ndị_ọzọ=[20,30,40,50]
[x, _, z] = [1, 2, 3]          // _ a tụfuo ya

// Tuple ọnọdụ
ebe = (100, 200)
(px, py) = ebe                 // px=100  py=200

// Tuple aha
mmadụ = (aha: "Ada", afọ: 25, obodo: "Enugu")
(aha: a, afọ: f) = mmadụ      // a="Ada"  f=25
```

---

## Tuples

Tuples bụ ọpụpụ ndị **enweghị ike gbanwee** nke nwere ike ijide ọnụọgụ nke **ụdị dị iche iche**. N'adịghị ka usoro, enweghị ike gbanwee ihe mgbe emepụtara ya.

```zymbol
// Ọnọdụ
ebe = (10, 20)
>> ebe[0] ¶    // → 10

ihe_ọmụmụ = (42, "nnọọ", #1, 3.14)
>> ihe_ọmụmụ[2] ¶     // → #1

// Aha
mmadụ = (aha: "Adaeze", afọ: 25)
>> mmadụ.aha ¶    // → Adaeze
>> mmadụ[0] ¶     // → Adaeze  (index na-arụ ọrụ kwa)

// Edebere n'ime
ọnọdụ = (x: 10, y: 20)
p = (ọnọdụ: ọnọdụ, akara: "mmalite")
>> p.ọnọdụ.x ¶   // → 10
```

**Enweghị ike gbanwee** — ọ bụ naanị mgbalị iji gbanwee ihe tuple bụ njehie oge ọrụ:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ njehie oge ọrụ: tuples enweghị ike gbanwee
// t[0] += 5    // ❌ njehie otu ahụ
```

Iji nweta ọnụọgụ gbanweere jiri `$~` (melite ọrụ) — na-azaghachi tuple **ọhụrụ**:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← nke mbụ adịghizi gbanwe
>> t2 ¶    // → (10, 999, 30)

// Tuple aha — wughachite n'ụzọ doro anya
mmadụ = (aha: "Alice", afọ: 25)
okenye  = (aha: mmadụ.aha, afọ: 26)
>> mmadụ.afọ ¶    // → 25
>> okenye.afọ ¶      // → 26
```

---

## Ọrụ Ọkwa Elu

> Ihe mgbakọ HOF chọrọ **lambda inline** — ọ bụghị mgbanwe lambda ozugbo.

```zymbol
nọmba ndị = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

abụọ ndị  = nọmba ndị$> (x -> x * 2)                // map  → [2,4,6…20]
ihe abụọ  = nọmba ndị$| (x -> x % 2 == 0)            // filter → [2,4,6,8,10]
nchịkọta  = nọmba ndị$< (0, (nchekwa, x) -> nchekwa + x)  // reduce → 55

// Njikọ site na nkwupụta àárọ̀
nzọụkwụ1 = nọmba ndị$| (x -> x > 3)
nzọụkwụ2 = nzọụkwụ1$> (x -> x * x)
>> nzọụkwụ2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Ọrụ aha n'ime HOF — kpọchie na lambda
abụọ_f(x) { <~ x * 2 }
r = nọmba ndị$> (x -> abụọ_f(x))    // ✅
```

---

## Onye Arụmọrụ Ọwa

Akụkụ aka nri chọrọ `_` dị ka onye ọchọ maka ọnụọgụ e nyefere:

```zymbol
abụọ = x -> x * 2
tinye = (a, b) -> a + b
tinye_otu = x -> x + 1

5 |> abụọ(_)           // → 10
10 |> tinye(_, 5)      // → 15
5 |> tinye(2, _)       // → 7

// Njikọ
r = 5 |> abụọ(_) |> tinye_otu(_) |> abụọ(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Njikwa Mperi

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "kewaa site na efu" ¶
} :! {
    >> "mperi ọzọ: " _err ¶    // _err nwere ozi mperi
} :> {
    >> "na-agafe mgbe niile" ¶
}
```

| Ụdị | Mgbe ọ na-apụta |
|-----|-----------------|
| `##Div` | Kewaa site na efu |
| `##IO` | Faịlụ / sistemu |
| `##Index` | Index karịa oke |
| `##Type` | Mperi ụdị |
| `##Parse` | Mperi nkewa |
| `##Network` | Mperi netwọk |
| `##_` | Mperi ọ bụla (nwee niile) |

---

## Ọchịchọ

```zymbol
// lib/mgbakọ.zy
# mgbakọ

#> { tinye, nweta_PI }    // Mbupụ TUPU nkwupụta

_PI := 3.14159
tinye(a, b) { <~ a + b }
nweta_PI() { <~ _PI }
```

```zymbol
// isi.zy
<# ./lib/mgbakọ <= m    // Alias dị mkpa

>> m::tinye(5, 3) ¶   // → 8
pi = m::nweta_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Mbupụ nwere aha ọha dị iche
# ụlọ_akwụkwọ
#> { _tinye_ime <= ngụkọta }

_tinye_ime(a, b) { <~ a + b }
```

```zymbol
<# ./ụlọ_akwụkwọ <= u

>> u::ngụkọta(3, 4) ¶    // → 7  (aha ime _tinye_ime ezoro ezo)
```

---

## Ndị Arụmọrụ Data

```zymbol
// Tụgharịa eriri ka ọ bụrụ nọmba
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (nchebe, enweghị mperi)

// Tụọ okirikiri / bee
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (tụọ okirikiri ruo decimal 2)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (bee)

// Nhazi nọmba
fmt = #,|1234567|      // → 1,234,567  (kewaa n'ude)
sci = #^|12345.678|    // → 1.2345678e4  (sayensị)

// Ihe atụ isi
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Mmepụta ntụgharị isi
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Ntinye Shell

```zymbol
ụbọchị = <\ date +%Y-%m-%d \>     // na-achịkọta stdout (nwere \n ọgwụgwụ)
>> "Taa: " ụbọchị

faịlụ = "data.txt"
ọdịnaya = <\ cat {faịlụ} \>       // ntinye na iwu

mmepụta = </"./koodu_nta.zy"/>   // mee skript Zymbol ọzọ, chịkọta mmepụta
>> mmepụta
```

> `><` na-achịkọta arụmọrụ CLI dị ka usoro eriri (tree-walker naanị).

---

## Ihe Atụ Zuru Oke: FizzBuzz

```zymbol
kewaa(nọmba) {
    ? nọmba % 15 == 0 { <~ "FizzBuzz" }
    _? nọmba % 3  == 0 { <~ "Fizz" }
    _? nọmba % 5  == 0 { <~ "Buzz" }
    _ { <~ nọmba }
}

@ i:1..20 { >> kewaa(i) ¶ }
```

---

## Ntụaka Akara

| Akara | Ọrụ | Akara | Ọrụ |
|-------|-----|-------|-----|
| `=` | mgbanwe | `$#` | ogologo |
| `:=` | ihe mgbagha | `$+` | tinye |
| `>>` | ntọhapụ | `$+[i]` | tinye na index |
| `<<` | ntinye | `$-` | wepụ nke mbụ n'ọnụọgụ |
| `¶` / `\\` | ahịrị ọhụrụ | `$--` | wepụ niile n'ọnụọgụ |
| `?` | ọ bụrụ (if) | `$-[i]` | wepụ na index |
| `_?` | ọzọ bụrụ (elif) | `$-[i..j]` | wepụ ebe |
| `_` | ọzọ / ihe ọ bụla | `$?` | nwee |
| `??` | match | `$??` | chọta index niile |
| `@` | mgbagha (loop) | `$[s..e]` | nkewa |
| `@!` | kwụsị (break) | `$>` | map |
| `@>` | gaa n'ihu (continue) | `$\|` | filter |
| `->` | lambda | `$<` | reduce |
| `$^+` | hazie n'elu (primitives) | `$^-` | hazie n'ala (primitives) |
| `$^` | hazie n'itule (tuple) | | |
| `<~` | azaghachi (return) | `!?` | nwalee (try) |
| `\|>` | pipe | `:!` | nwee (catch) |
| `#1` | eziokwu (true) | `:>` | mgbe niile (finally) |
| `#0` | ụgha (false) | `$!` | bụ mperi |
| `<#` | mbatinye (import) | `$!!` | gafee mperi |
| `#` | kwupụta ọchịchọ | `#>` | mbupụ (export) |
| `::` | ọgụgụ ọchịchọ | `.` | nweta ubi |
| `#\|..\|` | tụgharịa nọmba | `#?` | metadata ụdị |
| `#.N\|..\|` | tụọ okirikiri | `#!N\|..\|` | bee |
| `#,\|..\|` | nhazi ude | `#^\|..\|` | sayensị |
| `#d0d9#` | mgbanwe ọnọdụ ọnụọgụ | `#09#` | laghachi na ASCII |
| `<\ ..\>` | mee shell | `>\<` | arụmọrụ CLI |

## Akụkọ Ihe Mere Eme nke Ụdị

### v0.0.3 — Unicode Sistemu Ọnụọgụ & Ndozi LSP _(Eprel 2026)_

- **Agbakwunyere** Ngọngọ ọnụọgụ Unicode 69 na token mgbanwe ọnọdụ `#d0d9#`
- **Agbakwunyere** Boolean literals n'ime ọdịnaala ọ bụla — `#१` / `#०`, `#١` / `#٠`, wdg
- **Agbakwunyere** Klingon pIqaD ọnụọgụ (CSUR PUA U+F8F0–U+F8F9)
- **Agbakwunyere** VM opcode `SetNumeralMode` — nhata zuru ezu na tree-walker
- **Agbakwunyere** REPL na-asọpụrụ ọnọdụ ọnụọgụ dị ndụ n'ime echo na igosi mgbanwe
- **Agbanwere** Mmepụta `>>` nke Boolean ugbu a gụnyere `#` (`#0` / `#1`) n'ime ọnọdụ niile

### v0.0.2_01 — Ịgbanwe Aha Ihe Arụọrụ _(30 Mar 2026)_

- **Agbanwere** `c|..|` → `#,|..|` na `e|..|` → `#^|..|` — na-agbaso ụlọ ọrụ prefix `#`
- **Agbakwunyere** Alias mwepụta: ịpụtaazị ndị otu module n'okwu ọzọ

### v0.0.2 — Atụmatụ Ọhụrụ nke API Nchịkọta & Ndị Na-etinye _(24 Mar 2026)_

- **Agbakwunyere** Ezinụlọ ihe arụọrụ `$` zikọtara maka arrays na strings (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Agbakwunyere** Destructuring maka arrays, tuples na tuples nwere aha
- **Agbakwunyere** Indexes na-adịghị mma (`arr[-1]` = ihe ikpeazụ)
- **Agbakwunyere** Ndị Na-etinye ọha — Linux (deb/rpm/pkg/musl), macOS, Windows

### v0.0.1-patch _(25 Mar 2026)_

- **Agbakwunyere** Ntinye jikọtara `^=`
- **Edoziri** Ikpu parser mgbakọ; ndozi akwụkwọ

### v0.0.1 — Ntọhapụ Ọha Mbụ _(22 Mar 2026)_

- Tree-walker interpreter + register VM (`--vm`, ~4× ọsọ ọsọ, ~95% nhata)
- Ihe arụọrụ niile bụ isi: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Unicode njirimara zuru ezu, sistemu module, lambdas, closures, njikwa mperi
- REPL, LSP, VS Code extension, formatter (`zymbol fmt`)

---

*Zymbol-Lang — Akara. Ụwa nile. Enweghị Mgbanwe.*

> **Ncheta:** Akwụkwọ a edere ma tụgharịa ya site n'ọrụ ihe ọmụmụ arụpụta (AI).
> Anyị eme ihe niile ị ga-enwe n'aka, mana ụfọdụ ntụgharị ma ọ bụ ihe atụ nwere ike inwe njehie.
> Ntụaka bụ isi bụ [MANUAL.md](https://github.com/zymbol-lang/interpreter) na ụlọ nchekwa onye ntụgharị.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> The canonical reference is [MANUAL.md](https://github.com/zymbol-lang/interpreter) in the interpreter repository.
