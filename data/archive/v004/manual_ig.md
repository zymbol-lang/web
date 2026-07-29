> **Ọkwa:** E mere akwụkwọ ntuziaka a site n'enyemaka nke ọgụgụ isi mmadụ (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Ntụaka kpochapụrụ bụ **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** n'ime ebe nchekwa ntụgharị okwu.

---

# Akwụkwọ ntuziaka Zymbol-Lang

**Zymbol-Lang** bụ asụsụ mmemme akara. Ọ nweghị mkpụrụokwu igodo — ihe niile bụ akara. Ọ na-arụ otu ọrụ n'asụsụ mmadụ ọ bụla.

- Ọ nweghị `if`, `while`, `return` — naanị `?`, `@`, `<~`
- Unicode zuru oke — ihe nchọpụta n'asụsụ ọ bụla ma ọ bụ emoji ọ bụla
- Adịghị adabere n'asụsụ mmadụ — koodu ahụ bụ otu n'ebe niile

**Ntụgharị ụdị**: v0.0.4 | **Mkpokọta ule**: 393/393 (nha anya TW ↔ VM)

---

---

## Ndị na-agbanwe agbanwe na Ndị na-adịgide adịgide

```zymbol
x = 10              // ihe na-agbanwe agbanwe
PI := 3.14159       // ihe na-adịgide adịgide — ịkọwapụtaghachi bụ njehie oge ọrụ
aha = "Alice"
na-arụ ọrụ = #1      // Boolean eziokwu
👋 := "Nnọọ"
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

## Ụdị Data

| Ụdị | Nkịtị | Mkpado `#?` | Ihe edeturu |
|------|-------|-------------|-------------|
| Ọnụọgụ | `42`, `-7` | `###` | 64-bit nke e debanyere aha |
| Nke na-ese n'elu | `3.14`, `1.5e10` | `##.` | E kwere ka akara sayensị |
| Eriri | `"ederede"` | `##"` | Ntinye: `"Nnọọ {aha}"` |
| Mkpụrụedemede | `'A'` | `##'` | Otu mkpụrụedemede Unicode |
| Boolean | `#1`, `#0` | `##?` | Ọ bụghị ọnụọgụ — `#1 ≠ 1` |
| N'usoro | `[1, 2, 3]` | `##]` | Ihe ndị yiri otu |
| Tuple | `(a, b)` | `##)` | N'ọnọdụ |
| Tuple nwere aha | `(x: 1, y: 2)` | `##)` | Ubi nwere aha |
| Ọrụ | nrụtụ aka ọrụ nwere aha | `##()` | Ọkwa mbụ; na-egosi `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Ọkwa mbụ; na-egosi `<lambd/N>` |

```zymbol
// Nnyocha ụdị — na-eweghachi (ụdị, ọnụọgụgụ, uru)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Mmepụta na Ntinye

```zymbol
>> "Nnọọ" ¶                       // ¶ ma ọ bụ \\ maka ahịrị ọhụrụ doro anya
>> "a=" a " b=" b ¶               // ịdakọta n'akụkụ — ọtụtụ ụkpụrụ
>> (arr$#) ¶                      // ndị na-arụ ọrụ postfix chọrọ ( ) n'ime >>

<< aha                           // gụọ n'ime ihe na-agbanwe (na-enweghị nkwa)
<< "Tinye aha gị: " aha          // nwere nkwa
```

> `¶` (AltGr+R na ahụigodo Spanish) na `\\` hà nhata maka ahịrị ọhụrụ.

---

## Ndị na-arụ ọrụ

```zymbol
// Mgbakọ — jiri okenye; ụfọdụ ndị na-arụ ọrụ nwere ihe pụrụ iche ozugbo n'ime >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (nkesa ọnụọgụ)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (iku)

// Ntụnyere
a == b    // #0    
a <> b    // #1    
a < b     // #0
a <= b    // #0   
a > b     // #1    
a >= b    // #1

// Ezi uche
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Eriri

```zymbol
// Ụdị njikọ abụọ
aha = "Alice"
n = 42

>> "Nnọọ " aha " ị nwere " n ¶       // ịdakọta n'akụkụ — n'ime >>
nkọwa = "Nnọọ {aha}, ị nwere {n}"   // ntinye — ebe ọ bụla
```

```zymbol
s = "Nnọọ Ụwa"
ogologo = s$#                  // 8
obere = s$[1..4]               // "Nnọọ"  (ntọala-1, gụnyere njedebe)
nwere = s$? "Ụwa"              // #1
akụkụ = "a,b,c,d"$/ ','        // [a, b, c, d]  (kewaa site na nkesa)
dochie = s$~~["ọ":"a"]          // "Nnaa Ụwa"
dochie1 = s$~~["ọ":"a":1]       // "Nnaa Ụwa"  (naanị N mbụ)
```

> `+` bụ maka ọnụọgụ naanị. Maka eriri, jiri `,`, ịdakọta n'akụkụ, ma ọ bụ ntinye.

---

## Ịchịkwa Ọsọ

```zymbol
x = 7

? x > 0 { >> "nke na-adịghị mma" ¶ }

? x > 100 {
    >> "nnukwu" ¶
} _? x > 0 {
    >> "nke na-adịghị mma" ¶
} _? x == 0 {
    >> "eFu" ¶
} _ {
    >> "nke na-adịghị mma" ¶
}
```

> Ihe nrịgo `{ }` **bụ iwu** ọbụna maka otu nkwupụta.

---

## Dakọrịta

```zymbol
// Oke
akara = 85
ọkwa = ?? akara {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> ọkwa ¶       // → B

// Eriri
agba = "ọbara ọbara"
koodu = ?? agba {
    "ọbara ọbara" : "#FF0000"
    "akwụkwọ ndụ"  : "#00FF00"
    _             : "#000000"
}

// Ụkpụrụ ntụnyere
okpomọkụ = -5
ọnọdụ = ?? okpomọkụ {
    < 0  : "akpụrụ"
    < 20 : "oyi"
    < 35 : "ekpo ọkụ"
    _    : "ọkụ"
}
>> ọnọdụ ¶       // → akpụrụ

// Ụdị nkwupụta (ngọngọ)
?? n {
    0        : { >> "eFu" ¶ }
    _? n < 0 : { >> "nke na-adịghị mma" ¶ }
    _        : { >> "nke na-adịghị mma" ¶ }
}
```

---

## Loops

```zymbol
@ i:0..4  { >> i " " }        // oke gụnyere:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // tinyere nzọ:  1 3 5 7 9
@ i:5..0:1 { >> i " " }       // ọzọ:         5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (mgbe)

mkpụrụ = ["apụl", "ube", "mkpụrụ vaịn"]
@ m:mkpụrụ { >> m ¶ }         // maka ihe ọ bụla n'usoro

@ i:"nnọọ" { >> i "-" }
>> ¶                          // → n-n-ọ-ọ-  (maka mkpụrụedemede ọ bụla n'ime eriri)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> gaa n'ihu
    ? i > 7 { @! }            // @! mebie
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Loop ebighị ebi
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Loop nwere akara (nbibi agbakwunyere)
ngụta = 0
@:mpụta {
    ngụta++
    ? ngụta >= 3 { @:mpụta! }
}
>> ngụta ¶                    // → 3
```

---

## Ọrụ

```zymbol
gbakọta(a, b) { <~ a + b }
>> gbakọta(3, 4) ¶   // → 7

akụkụ(n) {
    ? n <= 1 { <~ 1 }
    <~ n * akụkụ(n - 1)
}
>> akụkụ(5) ¶        // → 120
```

Ọrụ nwere **ókèala dịpụrụ adịpụ** — ha enweghị ike ịgụ ihe ndị na-agbanwe n'èzí. Jiri paramita mmepụta `<~` iji gbanwee ihe ndị na-agbanwe nke onye na-akpọ:

```zymbol
gbanwere(a<~, b<~) {
    nwa oge = a
    a = b
    b = nwa oge
}
x = 10
y = 20
gbanwere(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Ọrụ nwere aha bụ **uru ọkwa mbụ** — zipụ ozugbo: `nums$> okpukpu abụọ`. `x -> fn(x)` dịkwa irè.

---

## Lambda na mmechi

```zymbol
okpukpu abụọ = x -> x * 2
gbakọta = (a, b) -> a + b
>> okpukpu abụọ(5) ¶   // → 10
>> gbakọta(3, 7) ¶      // → 10

// Ngọngọ lambda
nkewa = x -> {
    ? x > 0 { <~ "nke na-adịghị mma" }
    _? x < 0 { <~ "nke na-adịghị mma" }
    <~ "eFu"
}

// Mmechi — na-ejide ókèala mpụta
ihe = 3
okpukpu atọ = x -> x * ihe
>> okpukpu atọ(7) ¶    // → 21

// Ụlọ ọrụ
mepụta_onye_na-agbakọta(n) { <~ x -> x + n }
tinye_iri = mepụta_onye_na-agbakọta(10)
>> tinye_iri(5) ¶       // → 15

// N'ime usoro
ọrụ = [x -> x+1, x -> x*2, x -> x*x]
>> ọrụ[3](5) ¶         // → 25
```

---

## Usoro

Usoro **na-agbanwe agbanwe** ma nwee ihe **nke otu ụdị**.

```zymbol
usoro = [1, 2, 3, 4, 5]

usoro[1]          // 1 — ịnweta (ntọala-1: ihe mbụ)
usoro[-1]         // 5 — ntụpọ na-adịghị mma (ihe ikpeazụ)
usoro$#           // 5 — ogologo (jiri (usoro$#) n'ime >>)

usoro = usoro$+ 6            // tinye → [1,2,3,4,5,6]
usoro2 = usoro$+[2] 99       // tinye na ọnọdụ 2 (ntọala-1)
usoro3 = usoro$- 3           // wepụ ọpụpụ mbụ nke uru
usoro4 = usoro$-- 3          // wepụ ọpụpụ niile
usoro5 = usoro$-[1]          // wepụ na ntụpọ 1 (ihe mbụ)
usoro6 = usoro$-[2..3]       // wepụ oke (ntọala-1, gụnyere njedebe)

nwere = usoro$? 3            // #1 — nwere
ọnọdụ = usoro$?? 3           // [3] — ntụpọ niile nke uru (ntọala-1)
iberibe = usoro$[1..3]       // [1,2,3] — iberibe (ntọala-1, gụnyere njedebe)
iberibe2 = usoro$[1:3]       // [1,2,3] — otu, ụtọasụsụ dabere na ọnụọgụ

arịgo = usoro$^+             // họrọ arịgo (naanị ndị mbụ)
arịda = usoro$^-             // họrọ arịda (naanị ndị mbụ)

// Usoro tuple nwere aha/ọnọdụ — jiri $^ tinyere lambda ntụnyere
data = [(aha: "Carla", afọ: 28), (aha: "Ana", afọ: 25), (aha: "Bob", afọ: 30)]
dabere_afọ   = data$^ (a, b -> a.afọ < b.afọ)      // arịgo dabere na afọ (<)
dabere_aha   = data$^ (a, b -> a.aha > b.aha)      // arịda dabere na aha (>)
>> dabere_afọ[1].aha ¶     // → Ana
>> dabere_aha[1].aha ¶     // → Carla

// Mm elu ihe ozugbo (naanị usoro)
usoro[1] = 99              // kenyere
usoro[2] += 5              // ngwakọta: +=  -=  *=  /=  %=  ^=

// Mm elu ọrụ — na-eweghachi usoro ọhụrụ; nke mbụ agbanweghị
usoro2 = usoro[2]$~ 99
```

> Ndị na-arụ ọrụ mkpokọta niile na-eweghachi **usoro ọhụrụ**. Kenyeghachi: `usoro = usoro$+ 4`.
> Enwere ike ijikọ `$+` n'usoro: `usoro = usoro$+ 5$+ 6$+ 7`. Ndị na-arụ ọrụ ndị ọzọ na-eji okenye etiti.
> **Ntụpọ ntọala-1 bụ**: `usoro[1]` bụ ihe mbụ; `usoro[0]` bụ njehie oge ọrụ.
> `$^+` / `$^-` na-ahọrọ **usoro ndị mbụ** (ọnụọgụ, eriri). Maka usoro tuple, jiri `$^` tinyere lambda ntụnyere — a na-etinye ntụziaka n'ime lambda (`<` = arịgo, `>` = arịda).

**Nkọwa uru** — ikenye usoro n'ime ihe na-agbanwe ọzọ na-emepụta oyiri nọọrọ onwe ya:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b emetụtaghị
```

```zymbol
// Usoro agbakwunyere (ntụpọ ntọala-1)
matriks = [[1,2,3],[4,5,6],[7,8,9]]
>> matriks[2][3] ¶    // → 6  (ahịrị 2, kọlụm 3)
```

---

## Mbibi

```zymbol
// Usoro
usoro = [10, 20, 30, 40, 50]
[a, b, c] = usoro              // a=10  b=20  c=30
[nke mbụ, *ndị ọzọ] = usoro    // nke mbụ=10  ndị ọzọ=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ na-eleghara

// Tuple ọnọdụ
isi = (100, 200)
(px, py) = isi               // px=100  py=200

// Tuple nwere aha
mmadụ = (aha: "Ana", afọ: 25, obodo: "Madrid")
(aha: a, afọ: ị) = mmadụ     // a="Ana" ị=25
```

---

## Tuple

Tuple bụ akpa **na-agbanweghị agbanwe** nke nwere ike ijide ụkpụrụ **nke ụdị dị iche iche**.
N'adịghị ka usoro, enweghị ike ịgbanwe ihe mgbe emechara ha.

```zymbol
// Ọnọdụ — enyere ụdị agwakọta
isi = (10, 20)
>> isi[1] ¶      // → 10

data = (42, "nnọọ", #1, 3.14)
>> data[3] ¶     // → #1

// Nwere aha
mmadụ = (aha: "Alice", afọ: 25)
>> mmadụ.aha ¶    // → Alice
>> mmadụ[1] ¶     // → Alice  (ntụpọ na-arụkwa ọrụ, ntọala-1)

// Agbakwunyere
ọnọdụ = (x: 10, y: 20)
p = (ọnọdụ: ọnọdụ, mkpado: "mmalite")
>> p.ọnọdụ.x ¶     // → 10
```

**Enweghị mgbanwe** — mgbalị ọ bụla ịgbanwe ihe tuple bụ njehie oge ọrụ:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ njehie oge ọrụ: tuple anaghị agbanwe agbanwe
// t[1] += 5    // ❌ otu njehie

// Tuple nwere aha — wughachi n'ụzọ doro anya
mmadụ = (aha: "Alice", afọ: 25)
nke ka ibu = (aha: mmadụ.aha, afọ: 26)
>> mmadụ.afọ ¶     // → 25
>> nke ka ibu.afọ ¶ // → 26
```

Iji nweta uru agbanweela, jiri `$~` (mm elu ọrụ) — na-eweghachi tuple **ọhụrụ**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← nke mbụ agbanweghị
>> t2 ¶    // → (10, 999, 30)
```

---

## Ọrụ Ọkwa Dị Elu

```zymbol
ọnụọgụ = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

okpukpu abụọ = ọnụọgụ$> (x -> x * 2)                 // map → [2,4,6…20]
ọbọ   = ọnụọgụ$| (x -> x % 2 == 0)                // nzacha → [2,4,6,8,10]
ngụkọta   = ọnụọgụ$< (0, (mkpokọta, x) -> mkpokọta + x) // mbelata → 55

// Jikọọ site na ndị etiti
nzọ1 = ọnụọgụ$| (x -> x > 3)
nzọ2 = nzọ1$> (x -> x * x)
>> nzọ2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Enwere ike izipu ọrụ nwere aha ozugbo na ọrụ ọkwa dị elu
okpukpu abụọ(x) { <~ x * 2 }
ọ bụ nnukwu(x) { <~ x > 5 }
r = ọnụọgụ$> okpukpu abụọ       // ✅ nrụtụ aka ozugbo
r = ọnụọgụ$| ọ bụ nnukwu       // ✅ nrụtụ aka ozugbo
```

---

## Ọrụ Pọọpụ

Akụkụ aka nri na-achọkarị `_` dị ka ebe nchekwa maka uru a na-etinye n'ọkpọkpọ:

```zymbol
okpukpu abụọ = x -> x * 2
gbakọta = (a, b) -> a + b
tinye otu = x -> x + 1

5 |> okpukpu abụọ(_)        // → 10
10 |> gbakọta(_, 5)         // → 15
5 |> gbakọta(2, _)          // → 7

// Ejikọtara
r = 5 |> okpukpu abụọ(_) |> tinye otu(_) |> okpukpu abụọ(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Njikwa Njehie

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "kewa site na efu" ¶
} :! {
    >> "njehie ọzọ: " _err ¶    // _err na-ejide ozi njehie
} :> {
    >> "na-agba ọsọ mgbe niile" ¶
}
```

| Ụdị | Mgbe |
|------|------|
| `##Div` | Kewa site na efu |
| `##IO` | Faịlụ / usoro |
| `##Index` | Ntụpọ karịrị oke |
| `##Type` | Ụdị ekwekọghị |
| `##Parse` | Ntụgharị data |
| `##Network` | Njehie netwọkụ |
| `##_` | Njehie ọ bụla (na-ejide ihe niile) |

---

## Modul

```zymbol
// lib/calc.zy — ahụ modul dị n'ime ihe nrịgo
# calc {
    #> { gbakọta, get_PI }

    _PI := 3.14159
    gbakọta(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // aha njirimara dị mkpa

>> c::gbakọta(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶              // → 3.14159
```

```zymbol // Ibupụta ya na aha ọhanezu dị iche
# ọbá akwụkwọ m {
    #> { _gbakọta_n'ime <= ngụkọta }

    _gbakọta_n'ime(a, b) { <~ a + b }
}
```

```zymbol
<# ./ọbá akwụkwọ m <= m

>> m::ngụkọta(3, 4) ¶    // → 7  (aha n'ime _gbakọta_n'ime zoro ezo)
```

> **Iwu modul**: n'ime `# aha { }`, naanị `#>`, nkọwa ọrụ, na ndị mbido ihe na-agbanwe/na-adịgide adịgide ka ekwenyere. Nkwupụta ndị enwere ike ime (`>>`, `<<`, loops, wdg) na-ebute njehie E013.

---

## Ụdị Ọnụọgụ

Zymbol nwere ike igosipụta ọnụọgụ na **69 ngọngọ ọnụọgụ Unicode** — Devanagari, Arabic-Indic, Thai, Klingon pIqaD, Mathematical bold, ngalaba LCD, na ndị ọzọ. Ụdị ọrụ na-emetụta mmepụta `>>` naanị; mgbakọ n'ime bụ ọnụọgụ abụọ mgbe niile.

### Ịgbalite edemede

Dee ọnụọgụ `0` na `9` nke edemede e lekwasịrị anya n'ime `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabic-Indic   (U+0660–U+0669)
#๐๙#    // Thai           (U+0E50–U+0E59)
#09#    // tọgharịa na ASCII
```

---

### Mmepụta na Boolean

```zymbol
x = 42
>> x ¶          // → 42   (ndabara ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (ntụpọ ntụpọ bụ ASCII mgbe niile)
>> 1 + 2 ¶      // → ३

// Boolean: prefix # bụ ASCII mgbe niile, ọnụọgụ na-eme mgbanwe
>> #1 ¶         // → #१   (eziokwu na Devanagari)
>> #0 ¶         // → #०   (ụgha — dị iche na ० ọnụọgụ efu)

x = 28 > 4
>> x ¶          // → #१   (nsonaazụ ntụnyere na-agbaso ụdị ọrụ)
```

---

## Ọnụọgụ nkịtị na koodu isi mmalite

Ọnụọgụ nke edemede ọ bụla akwadoro bụ nkịtị dị irè — n'ime oke, modulo, ntụnyere:

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

### Nkịtị Boolean n'edemede ọ bụla

`#` + ọnụọgụ `0` ma ọ bụ `1` site na ngọngọ ọ bụla bụ nkịtị Boolean dị irè:

```zymbol
#०९#
na-arụ ọrụ = #१        // otu ihe na #1
>> na-arụ ọrụ ¶        // → #१
>> (#१ && #०) ¶        // → #०
```

> `#` **bụ ASCII mgbe niile**. `#0` (ụgha) na-adị iche n'anya mgbe niile na `0` (ọnụọgụ efu) n'edemede ọ bụla.

---

---

## Ndị na-arụ ọrụ Data

```zymbol
// Ntugharị ụdị
##.42         // → 42.0  (gaa Nke na-ese n'elu)
###3.7        // → 4     (gaa Ọnụọgụ, gbakọọ)
##!3.7        // → 3     (gaa Ọnụọgụ, belata)

// Tụgharịa eriri ka ọ bụrụ ọnụọgụ
v1 = #|"42"|      // → 42  (Ọnụọgụ)
v2 = #|"3.14"|    // → 3.14  (Nke na-ese n'elu)
v3 = #|"abc"|     // → "abc"  (dị mma, enweghị njehie)

// Gbakọọ / belata
pai = 3.14159265
gbakọọ2 = #.2|pai|     // → 3.14  (gbakọọ ruo ebe ntụpọ 2)
gbakọọ4 = #.4|pai|     // → 3.1416
belata2 = #!2|pai|      // → 3.14  (belata)

// Ịhazi ọnụọgụ
ụdị = #,|1234567|   // → 1,234,567  (kewara site na kọma)
sayensị = #^|12345.678| // → 1.2345678e4  (sayensị)

// Nkịtị ntọala
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (ọnụọgụ abụọ)
c = 0o101        // → 'A'  (octal)

// Mmepụta ntụgharị ntọala
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Njikọ Shell

```zymbol
ụbọchị = <\ date +%Y-%m-%d \>     // na-ejide stdout (gụnyere \n na njedebe)
>> "Taa: " ụbọchị

faịlụ = "data.txt"
ọdịnaya = <\ cat {faịlụ} \>       // ntinye n'ime iwu

mmepụta = </"./subscript.zy"/>     // gbaa script Zymbol ọzọ, jide mmepụta
>> mmepụta
```

> `><` na-ejide arụmụka CLI dị ka usoro eriri (naanị onye na-aga osisi).

---

## Ihe Nlereanya Zuru Oke: FizzBuzz

```zymbol
nkewa(ọnụọgụ) {
    ? ọnụọgụ % 15 == 0 { <~ "FizzBuzz" }
    _? ọnụọgụ % 3  == 0 { <~ "Fizz" }
    _? ọnụọgụ % 5  == 0 { <~ "Buzz" }
    _ { <~ ọnụọgụ }
}

@ i:1..20 { >> nkewa(i) ¶ }
```

---

## Ntụaka Akara

| Akara | Ọrụ | Akara | Ọrụ |
|-------|-----|-------|-----|
| `=` | ihe na-agbanwe | `$#` | ogologo |
| `:=` | ihe na-adịgide | `$+` | tinye (enwere ike ijikọ) |
| `>>` | mmepụta | `$+[i]` | tinye na ntụpọ (ntọala-1) |
| `<<` | ntinye | `$-` | wepụ nke mbụ dabere na uru |
| `¶` / `\\` | ahịrị ọhụrụ | `$--` | wepụ ihe niile dabere na uru |
| `?` | ọ bụrụ | `$-[i]` | wepụ na ntụpọ (ntọala-1) |
| `_?` | ma ọ bụghị ọ bụrụ | `$-[i..j]` | wepụ oke (ntọala-1) |
| `_` | ma ọ bụghị / anụ ọhịa | `$?` | nwere |
| `??` | dakọrịta | `$??` | chọta ntụpọ niile (ntọala-1) |
| `@` | loop | `$[s..e]` | iberibe (ntọala-1) |
| `@ N { }` | loop ugboro N | `$>` | map |
| `@!` | mebie | `$|` | nzacha |
| `@>` | gaa n'ihu | `$<` | mbelata |
| `@:aha { }` | loop nwere akara | `$/ nkesa` | nkewa eriri |
| `@:aha!` | nbibi nwere akara | `$++ a b c` | wuo njikọ |
| `@:aha>` | gaa n'ihu nwere akara | `usoro[i>j>k]` | ntụpọ igodo |
| `->` | lambda | `usoro[i] = uru` | melite ihe (naanị usoro) |
| `usoro[i] += uru` | mm elu ngwakọta | `usoro[i]$~` | mm elu ọrụ (oyiri ọhụrụ) |
| `$^+` | họrọ arịgo (ndị mbụ) | `$^-` | họrọ arịda (ndị mbụ) |
| `$^` | họrọ ya na onye ntụnyere (tuple) | `<~` | weghachi |
| `|>` | pọọpụ | `!?` | nwaa |
| `:!` | jide | `:>` | n'ikpeazụ |
| `#1` | eziokwu | `#0` | ụgha |
| `$!` | bụ njehie | `$!!` | gbasaa njehie |
| `<#` | bubata | `#>` | mbupụ |
| `#` | kwupụta modul | `::` | kpọọ modul |
| `.` | ịnweta ubi | `#?` | metadata ụdị |
| `#\|..\|` | tụgharịa ọnụọgụ | `##.` | tụgharịa gaa Nke na-ese n'elu |
| `###` | tụgharịa gaa Ọnụọgụ (gbakọọ) | `##!` | tụgharịa gaa Ọnụọgụ (belata) |
| `#.N\|..\|` | gbakọọ | `#!N\|..\|` | belata |
| `#,\|..\|` | ụdị kọma | `#^\|..\|` | sayensị |
| `#d0d9#` | gbanwee ụdị ọnụọgụ | `#09#` | tọgharịa na ASCII |
| `<\ ..\>` | gbaa shell | `>\<` | arụmụka CLI |
| `\ var` | bibie ihe na-agbanwe n'ụzọ doro anya | | |

---

## Ndekọ Mgbanwe Mwepụta

### v0.0.4 — Ntụpọ Ntọala-1, Ọrụ Ọkwa Mbụ & Ngọngọ Modul _(Eprel 2026)_

- **Na-agbaji** A gbanwere ntụpọ niile ka ọ bụrụ **ntọala-1** — `arr[1]` bụ ihe mbụ; `arr[0]` bụ njehie oge ọrụ
- **Agbakwunyere** Ọrụ nwere aha bụ **uru ọkwa mbụ** — zipụ ozugbo gaa ọrụ ọkwa dị elu: `nums$> okpukpu abụọ`
- **Agbakwunyere** **Ụtọasụsụ ngọngọ** modul dị mkpa: `# aha { ... }` — ewepụrụ ụtọasụsụ ewepụghị ihe
- **Agbakwunyere** Ntụpọ akụkụ dị iche iche: `arr[i>j>k]` (igodo), `arr[p ; q]` (mwepụ ewepụghị ihe)
- **Agbakwunyere** Ntugharị ụdị: `##.okwu` (Nke na-ese n'elu), `###okwu` (Ọnụọgụ gbakọọ), `##!okwu` (Ọnụọgụ belata)
- **Agbakwunyere** Nkewa eriri: `eriri$/ nkesa` — na-eweghachi `Array(Eriri)`
- **Agbakwunyere** Wuo njikọ: `ntọala$++ a b c` — na-agbakwunye ọtụtụ ihe
- **Agbakwunyere** Loop ugboro N: `@ N { }` — kwugharịa kpọmkwem ugboro N
- **Agbakwunyere** Ụtọasụsụ loops nwere akara: `@:aha { }`, `@:aha!`, `@:aha>` — nọchiri `@ @aha` / `@! aha`
- **Agbakwunyere** Iwu ókèala ihe na-agbanwe: ihe na-agbanwe `_aha` nwere oke ngọngọ kpọmkwem; `\ var` na-ebibi n'oge
- **Agbakwunyere** Ụkpụrụ ntụnyere dakọrịtara: `< 0 :`, `> 5 :`, `== 42 :` wdg
- **Agbakwunyere** Njehie modul E013: amachibidoro nkwupụta enwere ike ime n'ime ahụ modul
- **Emeziri** `take_variable` anaghị emebi ihe ndị na-adịgide adịgide modul mgbe ọ na-edeghachi azụ
- **Emeziri** `alias.CONST` na-edozi nke ọma ugbu a; `#>` nwere ike ịpụta mgbe nkọwa ọrụ gasịrị
- **VM** Nha anya zuru oke: 393/393 ule gafere

### v0.0.3 — Sistemu Ọnụọgụ Unicode & Nkwalite LSP _(Eprel 2026)_

- **Agbakwunyere** 69 ngọngọ ọnụọgụ Unicode tinyere mkpado ntụgharị ụdị `#d0d9#`
- **Agbakwunyere** Nkịtị Boolean n'edemede ọ bụla — `#१` / `#०`, `#१` / `#०`, wdg
- **Agbakwunyere** Ọnụọgụ Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Agbakwunyere** `SetNumeralMode` VM opcode — nha anya zuru oke na onye na-aga osisi
- **Agbakwunyere** REPL na-asọpụrụ ụdị ọnụọgụ na-arụ ọrụ na nkwughachi na ngosi ihe na-agbanwe
- **Gbanwere** Boolean `>>` mmepụta ugbu a na-agụnye prefix `#` (`#0` / `#1`) n'ụdị niile

### v0.0.2_01 — Renaming Ọrụ _(30 Maachị 2026)_

- **Gbanwere** `c|..|` → `#,|..|` na `e|..|` → `#^|..|` — kwekọrọ na ezinụlọ prefix ụdị `#`
- **Agbakwunyere** Aha njirimara mbupụ — bupụghachi ndị otu modul n'okpuru aha dị iche

### v0.0.2 — Nhazigharị API Nchịkọta & Ndị nrụnye _(24 Maachị 2026)_

- **Agbakwunyere** Ezinụlọ ọrụ `$` jikọtara ọnụ maka usoro na eriri (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Agbakwunyere** Okenye mbibi maka usoro, tuple, na tuple nwere aha
- **Agbakwunyere** Ntụpọ na-adịghị mma (`arr[-1]` = ihe ikpeazụ)
- **Agbakwunyere** Ndị nrụnye ala — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Maachị 2026)_

- **Agbakwunyere** Okenye ngwakọta `^=`
- **Emeziri** Ikpe n'akụkụ mgbakọ nke onye ntụgharị; mmezi akwụkwọ ntuziaka

### v0.0.1 — Mwepụta Ọhaneze Mbụ _(22 Maachị 2026)_

- Onye ntụgharị onye na-aga osisi + VM ndebanye aha (`--vm`, ~4× ọsọ ọsọ, ~95% nha anya)
- Ihe owuwu isi niile: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Ndị nchọpụta Unicode zuru oke, sistemu modul, lambda, mmechi, njikwa njehie
- REPL, LSP, Mgbatị VS Code, onye nhazi (`zymbol fmt`)

---

_Zymbol-Lang — Akara. Eluigwe na ala. Na-agbanweghị agbanwe._
