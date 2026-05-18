> **Nkwuputa:** Emere ma tụgharịa akwụkwọ a site na ọgụgụ isi mmadụ (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Ntụzị aka bụ isi dị na **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** n'ime ebe nchekwa ntụgharị.

---

# Akwụkwọ ntuziaka Zymbol-Lang

> **Tụlegharịrị maka v0.0.5 — 2026-05-14**

**Zymbol-Lang** bụ asụsụ mmemme akara. Ọ nweghị mkpụrụokwu igodo — ihe niile bụ akara. Ọ na-arụ otu ọrụ n'asụsụ mmadụ ọ bụla.

- Enweghị `if`, `while`, `return` — naanị `?`, `@`, `<~`
- Unicode zuru ezu — ihe njirimara n'asụsụ ọ bụla ma ọ bụ emoji
- Anaghị adabere n'asụsụ mmadụ — koodu ahụ bụ otu n'ebe niile

**Ụdị ntụgharị**: v0.0.5 | **Mkpuchi ule**: 436/436 (nha nha TW ↔ VM)

---

## Ihe na-agbanwe agbanwe na ihe na-adịgide adịgide

```zymbol
x = 10              // ihe na-agbanwe agbanwe
π := 3.14159        // ihe na-adịgide adịgide — ịkekọrịta ọzọ bụ njehie oge ọrụ
aha = "Alice"
na_arụ_ọrụ = #1         // boolean eziokwu
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

`°` (akara ogo, U+00B0) na-amalite ihe na-agbanwe agbanwe na uru ya na-anọpụ iche na mbido mbụ:

```zymbol
ọnụọgụ = [3, 1, 4, 1, 5]
@ n:ọnụọgụ {
    °ngụkọta += n    // malite na-akpaghị aka na 0 n'elu loop; na-adị ndụ mgbe @ gasịrị
}
>> ngụkọta ¶         // → 14
```

> `°x` (ihe mgbado) na-agbado n'elu loop — ihe ga-esi na ya pụta dị irè mgbe `@` gasịrị.
> `x°` (ihe nsonye) na-agbado n'ime loop — na-anwụ mgbe loop kwụsịrị.
> Naanị tree-walker.

---

## Ụdị Data

| Ụdị | Akpụrụ akpụrụ | Mkpado `#?` | Ihe ndetu |
|------|---------|----------|---------|
| Ọnụọgụ zuru ezu | `42`, `-7` | `###` | 64-bit nwere akara |
| Ọnụọgụ na-ese n'elu | `3.14`, `1.5e10` | `##.` | E kwere ka ndekọ sayensị |
| Eriri | `"ederede"` | `##"` | Ntinye: `"Nnọọ {aha}"` |
| Mkpụrụedemede | `'A'` | `##'` | Otu mkpụrụedemede Unicode |
| Boolean | `#1`, `#0` | `##?` | Ọ bụghị ọnụọgụ — `#1 ≠ 1` |
| N'usoro | `[1, 2, 3]` | `##]` | Ihe ndị yiri otu |
| Tuple | `(a, b)` | `##)` | N'ọnọdụ |
| Tuple nwere aha | `(x: 1, y: 2)` | `##)` | Ubi ndị nwere aha |
| Ọrụ | nrụtụ aka ọrụ nwere aha | `##()` | Ọkwa mbụ; na-egosi `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Ọkwa mbụ; na-egosi `<lambd/N>` |

```zymbol
// Nnyocha ụdị — na-eweghachi (ụdị, ọnụọgụ, uru)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Mmepụta na Ntinye

```zymbol
>> "Nnọọ" ¶                       // ¶ ma ọ bụ \\ maka ahịrị ọhụrụ doro anya
>> "a=" a " b=" b ¶               // itinye n'akụkụ — ọtụtụ ụkpụrụ
>> (arr$#) ¶                      // ndị ọrụ postfix chọrọ ( ) na >>

>> aha                           // gụọ n'ime ihe na-agbanwe agbanwe (enweghị nkọwa)
>> "Tinye aha: " aha            // nwere nkọwa
```

> `¶` (AltGr+R na ahụigodo Spanish) na `\\` bụ ahịrị ọhụrụ ha nhata.

---

## Ihe Ndị Bụ Isi nke TUI

Ndị ọrụ ihuenyo onye ọrụ ọnụ ọnụ maka mmemme mmekọrịta. Ọtụtụ chọrọ ngọngọ `>>| { }` (ihuenyo ọzọ + ọnọdụ crude).

```zymbol
>>| {
    >>!                             // kpochapụ ihuenyo ọzọ
    >>~ (1, 1, 0, 10) > "Na-agba ọsọ"   // ahịrị 1, kọlụm 1, fg=10 (acha ndụ ndụ)
    @~ 1000                         // kwụsịtụ maka sekọnd 1 (1000 ms)
    >>~ (2, 1) > "Emechara."
}
// eweghachiri ọnụ ọnụ na-akpaghị aka mgbe ịpụsịrị
```

```zymbol
// Ịpị igodo na nha ọnụ ọnụ
>>| {
    [ahịrị, kọlụm] = >>?              // jụọ akụkụ ọnụ ọnụ
    >>~ (1, 1) > "Ọnụ ọnụ: " ahịrị " x " kọlụm
    <<| igodo                         // gụọ ịpị igodo na-egbochi
    >>~ (2, 1) > "Ịpịrị: " igodo
}
```

> `>>!` na-ekpochapụ ihuenyo. `>>?` na-eweghachi `[ahịrị, kọlụm]`. `@~ N` na-ehi ụra N milisekọnd.
> `<<|` na-agụ otu ịpị igodo (na-egbochi); `<<|?` na-enyocha na-egbochighị (na-eweghachi `'\0'` ma ọ bụrụ na ọ nweghị).
> Tuple mmepụta ọnọdụ: `(ahịrị, kọlụm, BKS, fg, bg)` — enwere ike ịhapụ oghere ọ bụla site na kọma (`>>~ (,,, 196) > "acha ọbara ọbara"`).
> BKS bitmask: `1`=okwute, `2`=ntanye, `4`=akara ala. ANSI 256 agba pallet (`0`=ndabara ọnụ ọnụ).
> Naanị tree-walker (ewezuga `>>!`, `>>?`, `@~`, `>>~` ndị na-arụkwa ọrụ na `--vm`).

---

## Ndị Ọrụ

```zymbol
// Mgbakọ
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (nkewa ọnụọgụ zuru ezu)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (ịkpọ elu ike)

// Ntụnyere — kenye maka nyocha
nt1 = a == b    // #0
nt2 = a <> b    // #1
nt3 = a < b     // #0
nt4 = a <= b    // #0
nt5 = a > b     // #1
nt6 = a >= b    // #1

// Ezi uche
ez1 = #1 && #0    // #0
ez2 = #1 || #0    // #1
ez3 = !#1         // #0
```

---

## Eriri

```zymbol
// Ụdị njikọ abụọ
aha = "Alice"
n = 42

>> "Nnọọ " aha " ị nwere " n ¶       // itinye n'akụkụ — na >>
nkọwa = "Nnọọ {aha}, ị nwere {n}"     // ntinye — ebe ọ bụla
```

```zymbol
s = "Nnọọ ụwa"
ogologo = s$#                  // 10
mpempe = s$[1..5]             // "Nnọọ"  (1-ndabere, nsonye gụnyere)
dị = s$? "ụwa"          // #1
iberibe = "a,b,c,d"$/ ','   // [a, b, c, d]  (kewaa site na nkewa)
dochie = s$~~["l":"r"]        // "Nnọọ ụwa" (enweghị 'l' na Igbo)
dochie1 = s$~~["l":"r":1]     // "Nnọọ ụwa"
ahịrị = "─" $* 20           // "────────────────────"  (megharịa N ugboro)
```

> `+` bụ naanị maka ọnụọgụ. Maka eriri, jiri `,`, itinye n'akụkụ, ma ọ bụ ntinye.

---

## Njikwa Ọsọ

```zymbol
x = 7

? x > 0 { >> "ezigbo" ¶ }

? x > 100 {
    >> "nnukwu" ¶
} _? x > 0 {
    >> "ezigbo" ¶
} _? x == 0 {
    >> "efu" ¶
} _ {
    >> "ọjọọ" ¶
}
```

> Ihe nkwụsị `{ }` **dị mkpa** ọbụlagodi maka otu nkwupụta.

---

## Dakọrịta

```zymbol
// Oke
akara = 85
ọkwa = ?? akara {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> ọkwa ¶    // → B

// Eriri
agba = "ọbara ọbara"
koodu = ?? agba {
    "ọbara ọbara"   => "#FF0000"
    "acha ndụ ndụ" => "#00FF00"
    _       => "#000000"
}

// Ụkpụrụ ntụnyere
okpomọkụ = -5
ọnọdụ = ?? okpomọkụ {
    < 0  => "akpụrụ mmiri"
    < 20 => "oyi"
    < 35 => "ekpo ọkụ"
    _    => "ọkụ"
}
>> ọnọdụ ¶    // → akpụrụ mmiri

// Ụdị nkwupụta (ogwe ngọngọ)
n = -3
?? n {
    0    => { >> "efu" ¶ }
    < 0  => { >> "ọjọọ" ¶ }
    _    => { >> "ezigbo" ¶ }
}
```

---

## Loops

```zymbol
@ i:0..4  { >> i " " }        // oke gụnyere:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // na nzọụkwụ:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // azụ azụ:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

mkpụrụ = ["apụl", "ubere", "mkpụrụ vaịn"]
@ m:mkpụrụ { >> m ¶ }         // maka ihe ọ bụla n'usoro

@ k:"hello" { >> k "-" }
>> ¶                          // → h-e-l-l-o-  (maka mkpụrụedemede ọ bụla n' eriri)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> gaa n'ihu
    ? i > 7 { @! }             // @! mebie
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Loop na-adịghị agwụ agwụ
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Loop nwere akara (mgbawa akwụnyere)
ngụ = 0
@:mpụta {
    ngụ++
    ? ngụ >= 3 { @:mpụta! }
}
>> ngụ ¶                    // → 3
```

---

## Ọrụ

```zymbol
gbakọnye(a, b) { <~ a + b }
>> gbakọnye(3, 4) ¶    // → 7

faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120
```

Ọrụ nwere **mpaghara dịpụrụ adịpụ** — ha enweghị ike ịgụ ihe ndị na-agbanwe agbanwe n'èzí. Jiri paramita mmepụta `<~>` iji gbanwee ihe ndị na-agbanwe agbanwe nke onye na-akpọ:

```zymbol
gbanwee(a<~, b<~) {
    nwa_oge = a
    a = b
    b = nwa_oge
}
x = 10
y = 20
gbanwee(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Ọrụ ndị nwere aha bụ **ụkpụrụ ọkwa mbụ** — nyefee ozugbo: `ọnụọgụ$> okpukpu_abụọ`. Iji kechie: `x -> fn(x)` na-arụkwa ọrụ.

---

## Lambda na Mmechi

```zymbol
okpukpu_abụọ = x -> x * 2
gbakọnye = (a, b) -> a + b
>> okpukpu_abụọ(5) ¶    // → 10
>> gbakọnye(3, 7) ¶  // → 10

// Lambda ngọngọ
kewaa = x -> {
    ? x > 0 { <~ "ezigbo" }
    _? x < 0 { <~ "ọjọọ" }
    <~ "efu"
}

// Mmechi — na-ejide mpaghara mpụta
ihe_ịba_ụba = 3
okpukpu_ato = x -> x * ihe_ịba_ụba
>> okpukpu_ato(7) ¶    // → 21

// Ụlọ ọrụ mmepụta
onye_mepụta_mgbakọnye(n) { <~ x -> x + n }
gbakọnye_iri = onye_mepụta_mgbakọnye(10)
>> gbakọnye_iri(5) ¶    // → 15

// N'usoro
ndị_ọrụ = [x -> x+1, x -> x*2, x -> x*x]
>> ndị_ọrụ[3](5) ¶    // → 25
```

---

## N'usoro

N'usoro **na-agbanwe agbanwe** ma nweekwa ihe **nke otu ụdị**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — ịnweta (1-ndabere: ihe mbụ)
x = arr[-1]     // 5 — ntụnye aka na-adịghị mma (ihe ikpeazụ)
x = arr$#       // 5 — ogologo (jiri (arr$#) na >>)

arr = arr$+ 6            // tinye → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // fanye n'ọnọdụ 2 (1-ndabere)
arr3 = arr$- 3           // wepụ ihe omume mbụ nke uru
arr4 = arr$-- 3          // wepụ ihe omume niile
arr5 = arr$-[1]          // wepụ na ntụnye aka 1 (ihe mbụ)
arr6 = arr$-[2..3]       // wepụ oke (1-ndabere, nsonye gụnyere)

dị = arr$? 3            // #1 — nwere
ebe = arr$?? 3           // [3] — ntụnye aka niile nke uru (1-ndabere)
iberibe = arr$[1..3]          // [1,2,3] — iberibe (1-ndabere, nsonye gụnyere)
iberibe2 = arr$[1:3]          // [1,2,3] — otu, ụtọ asụsụ dabere na ọnụọgụ

arịgo = arr$^+             // hazị arịgo (naanị ndị oge ochie)
agbada = arr$^-            // hazị agbada (naanị ndị oge ochie)

// N'usoro tuple nwere aha/ọnọdụ — jiri $^ na lambda ntụnyere
ọdụ_data = [(aha: "Carla", afọ: 28), (aha: "Ana", afọ: 25), (aha: "Bob", afọ: 30)]
dabere_na_afọ  = ọdụ_data$^ (a, b -> a.afọ < b.afọ)    // dabere na afọ arịgo (<)
dabere_na_aha = ọdụ_data$^ (a, b -> a.aha > b.aha)   // dabere na aha agbada (>)
>> dabere_na_afọ[1].aha ¶     // → Ana
>> dabere_na_aha[1].aha ¶    // → Carla

// Mmelite ihe ozugbo (naanị n'usoro)
arr[1] = 99              // kenye
arr[2] += 5              // ngwakọta: +=  -=  *=  /=  %=  ^=

// Mmelite arụ ọrụ — na-eweghachi n'usoro ọhụrụ; nke mbụ agbanweghị
arr2 = arr[2]$~ 99
```

> Ndị ọrụ mkpokọta niile na-eweghachi **n'usoro ọhụrụ**. Kenyeghachi: `arr = arr$+ 4`.
> Enwere ike ịgbụ `$+` ụdọ: `arr = arr$+ 5$+ 6$+ 7`. Ndị ọrụ ndị ọzọ na-eji ọrụ kenye etiti.
> **Ntinye aka bụ 1-ndabere**: `arr[1]` bụ ihe mbụ; `arr[0]` bụ njehie oge ọrụ.
> `$^+` / `$^-` na-ahazi **n'usoro nke oge ochie** (ọnụọgụ, eriri). Maka n'usoro tuple, jiri `$^` na lambda ntụnyere — ntụzịaka etinyere koodu na lambda (`<` = arịgo, `>` = agbada).

**Semantics uru** — ikenye n'usoro nye ihe na-agbanwe agbanwe ọzọ na-emepụta nnomi nweere onwe ya:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b emetụtaghị
```

```zymbol
// N'usoro agbakwunyere (ntinye aka 1-ndabere)
matriks = [[1,2,3],[4,5,6],[7,8,9]]
>> matriks[2][3] ¶    // → 6  (ahịrị 2, kọlụm 3)
```

---

## Ịkwasa Ihe Owuwu

```zymbol
// N'usoro
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[nke_mbụ, *ihe_fọdụrụ] = arr         // nke_mbụ=10  ihe_fọdụrụ=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ na-atụfu

// Tuple ọnọdụ
isi = (100, 200)
(px, py) = isi             // px=100  py=200

// Tuple nwere aha
onye = (aha: "Ana", afọ: 25, obodo: "Madrid")
(aha: n, afọ: a) = onye   // n="Ana"  a=25
```

---

## Tuple

Tuple bụ ihe eji echekwa ihe n'usoro **nke na-adịghị agbanwe agbanwe** nke nwere ike ijide ụkpụrụ **nke ụdị dị iche iche**.
N'adịghị ka n'usoro, a pụghị ịgbanwe ihe mgbe emechara ha.

```zymbol
// Ọnọdụ — a na-anabata ụdị ngwakọta
isi = (10, 20)
>> isi[1] ¶    // → 10

data = (42, "Nnọọ", #1, 3.14)
>> data[3] ¶     // → #1

// Nwere aha
onye = (aha: "Alice", afọ: 25)
>> onye.aha ¶    // → Alice
>> onye[1] ¶      // → Alice  (ntụnye aka na-arụkwa ọrụ, 1-ndabere)

// Agbakwunyere
ọnọdụ = (x: 10, y: 20)
p = (ọnọdụ: ọnọdụ, mkpado: "mmalite")
>> p.ọnọdụ.x ¶        // → 10
```

**Enweghị mgbanwe** — mgbalị ọ bụla iji gbanwee ihe tuple bụ njehie oge ọrụ:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ njehie oge ọrụ: tuple anaghị agbanwe agbanwe
// t[1] += 5    // ❌ otu njehie ahụ
```

Iji nweta uru agbanweela jiri `$~` (mmelite arụ ọrụ) — na-eweghachi **tuple ọhụrụ**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← nke mbụ agbanweghị
>> t2 ¶    // → (10, 999, 30)

// Tuple nwere aha — wughachi nke ọma
onye = (aha: "Alice", afọ: 25)
toro_eto  = (aha: onye.aha, afọ: 26)
>> onye.afọ ¶    // → 25
>> toro_eto.afọ ¶     // → 26
```

---

## Ọrụ Ọkwa Dị Elu

```zymbol
ọnụọgụ = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

okpukpu_abụọ  = ọnụọgụ$> (x -> x * 2)                  // map  → [2,4,6…20]
ọbụna    = ọnụọgụ$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
ngụkọta    = ọnụọgụ$< (0, (okachikọta, x) -> okachikọta + x)     // reduce → 55

// Gbụ ụdọ site na ndị etiti
nzọụkwụ1 = ọnụọgụ$| (x -> x > 3)
nzọụkwụ2 = nzọụkwụ1$> (x -> x * x)
>> nzọụkwụ2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Enwere ike ibunye ọrụ ndị nwere aha ozugbo na HOF
okpukpu_abụọ(x) { <~ x * 2 }
nnukwu(x) { <~ x > 5 }
r = ọnụọgụ$> okpukpu_abụọ       // ✅ nrụtụ aka ozugbo
r = ọnụọgụ$| nnukwu       // ✅ nrụtụ aka ozugbo
```

---

## Ọrụ Ọkpọkọ

Akụkụ aka nri na-achọ mgbe niile `_` dị ka onye njide ohere maka uru a tụbara:

```zymbol
okpukpu_abụọ = x -> x * 2
gbakọnye = (a, b) -> a + b
ịbawanye = x -> x + 1

r1 = 5 |> okpukpu_abụọ(_)        // → 10
r2 = 10 |> gbakọnye(_, 5)       // → 15
r3 = 5 |> gbakọnye(2, _)        // → 7

// Agbụ ụdọ
r = 5 |> okpukpu_abụọ(_) |> ịbawanye(_) |> okpukpu_abụọ(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Njikwa Njehie

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "nkewa site na efu" ¶
} :! {
    >> "ndị ọzọ: " _err ¶    // _err na-ejide ozi njehie
} :> {
    >> "na-agba ọsọ mgbe niile" ¶
}
```

| Ụdị | Mgbe |
|------|------|
| `##Div` | Nkewa site na efu |
| `##IO` | Faịlụ / usoro |
| `##Index` | Ntụnye aka karịrị oke |
| `##Type` | Ụdị ekwekọghị |
| `##Parse` | Ntụgharị data |
| `##Network` | Njehie netwọk |
| `##_` | Njehie ọ bụla (jide-ihe niile) |

---

## Modul

```zymbol
// lib/calc.zy — a na-ekechi ahụ modul n'ime ihe nkwụsị
# calc {
    #> { gbakọnye, get_PI }

    _π := 3.14159
    gbakọnye(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // aha ọzọ dị mkpa

>> c::gbakọnye(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Bupụta na aha ọhaneze dị iche
# mylib {
    #> { _gbakọnye_nke_ime => mkpokọta }

    _gbakọnye_nke_ime(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::mkpokọta(3, 4) ¶    // → 7  (aha ime _gbakọnye_nke_ime ezoro ezo)
```

> **Iwu modul**: n'ime `# aha { }`, naanị `#>`, nkọwa ọrụ, na ndị mbido ihe na-agbanwe agbanwe/na-adịgide adịgide ka anabata. Nkwupụta ndị a ga-eme (`>>`, `<<`, loops, wdg) na-ebute njehie E013.

---

## Ụdị Ọnụọgụ

Zymbol nwere ike igosipụta ọnụọgụ na **ọdịdị ọnụọgụ Unicode iri isii na itoolu** — Devanagari, Arab-India, Thai, Klingon pIqaD, Mathematical Bold, ngalaba LCD, na ndị ọzọ. Ụdị na-arụ ọrụ na-emetụta naanị mmepụta `>>`; mgbakọ dị n'ime na-abụkarị ọnụọgụ abụọ.

### Ịme akwụkwọ edemede rụọ ọrụ

Dee ọnụọgụ `0` na `9` nke akwụkwọ edemede ezubere iche n'ime `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arab-India (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // tọgharịa na ASCII
```

### Mmepụta na booleans

```zymbol
x = 42
>> x ¶          // → 42   (ndabara ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (ntụpọ ntụpọ ntụpọ bụ ASCII mgbe niile)
>> 1 + 2 ¶      // → ३

// Booleans: ihe mgbado # bụ ASCII mgbe niile, ọnụọgụ na-eme mgbanwe
>> #1 ¶         // → #१   (eziokwu na Devanagari)
>> #0 ¶         // → #०   (ụgha — dị iche na ० ọnụọgụ zuru ezu efu)

x = 28 > 4
>> x ¶          // → #१   (nsonaazụ ntụnyere na-agbaso ụdị na-arụ ọrụ)
```

### Ọnụọgụ akpụrụ akpụrụ nke ala na isi mmalite

Ọnụọgụ nke akwụkwọ edemede ọ bụla akwadoro bụ ụkpụrụ akpụrụ akpụrụ n'ụzọ ziri ezi — n'oke, na modulo, na ntụnyere:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Ụkpụrụ Boolean n'akwụkwọ edemede ọ bụla

`#` + ọnụọgụ `0` ma ọ bụ `1` sitere na ngọngọ ọ bụla bụ ụkpụrụ boolean ziri ezi:

```zymbol
#٠٩#
na_arụ_ọrụ = #١        // otu ihe ahụ dị ka #1
>> na_arụ_ọrụ ¶        // → #१
>> (#१ && #०) ¶ // → #०
```

> `#` **bụ ASCII mgbe niile**. `#0` (ụgha) na-adị iche n'anya site na `0` (ọnụọgụ zuru ezu efu) mgbe niile n'akwụkwọ edemede ọ bụla.

---

## Ndị Ọrụ Data

```zymbol
// Ntughari ụdị
f = ##.42         // → 42.0  (gaa na n'elu mmiri)
i = ###3.7        // → 4     (gaa na ọnụọgụ zuru ezu, gbakọọ)
t = ##!3.7        // → 3     (gaa na ọnụọgụ zuru ezu, bepụ)

// Tụgharịa eriri ka ọ bụrụ ọnụọgụ
v1 = #|"42"|      // → 42  (ọnụọgụ zuru ezu)
v2 = #|"3.14"|    // → 3.14  (n'elu mmiri)
v3 = #|"abc"|     // → "abc"  (dị mma, enweghị njehie)

// Gbakọọ / bepụ
π = 3.14159265
gbakọta2 = #.2|π|      // → 3.14  (gbakọta ruo ebe ntụpọ ntụpọ 2)
gbakọta4 = #.4|π|      // → 3.1416
bepụ2 = #!2|π|      // → 3.14  (bepụ)

// Ịhazi ọnụọgụ
nhazi = #,|1234567|  // → 1,234,567  (kewara site na kọma)
sayensị = #^|12345.678|    // → 1.2345678e4  (sayensị)

// Ụkpụrụ ntọala
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (ọnụọgụ abụọ)
c = 0o101        // → 'A'  (ọnụọgụ asatọ)

// Mmepụta ntụgharị ntọala
hex = 0x|255|    // → "0x00FF"
ọnụọgụ_abụọ = 0b|65|     // → "0b1000001"
ọnụọgụ_asatọ = 0o|8|      // → "0o10"
ntụpọ = 0d|255|    // → "0d0255"
```

---

## Njikọ Shea

```zymbol
ụbọchị = <\ date +%Y-%m-%d \>     // na-eweghara stdout (gụnyere \n na njedebe)
>> "Taa: " ụbọchị

faịlụ = "data.txt"
ọdịnaya = <\ cat {faịlụ} \>      // ntinye na iwu

mmepụta = </"./subscript.zy"/>   // mee ọzọ edemede Zymbol ọzọ, weghara mmepụta
>> mmepụta
```

> `><` na-eweghara arụmụka CLI dịka n'usoro eriri (naanị tree-walker).

---

## Ihe Nlereanya Zuru Oke: FizzBuzz

```zymbol
kewaa(ọnụọgụ) {
    ? ọnụọgụ % 15 == 0 { <~ "FizzBuzz" }
    _? ọnụọgụ % 3  == 0 { <~ "Fizz" }
    _? ọnụọgụ % 5  == 0 { <~ "Buzz" }
    _ { <~ ọnụọgụ }
}

@ i:1..20 { >> kewaa(i) ¶ }
```

---

## Ntụzịaka Akara

| Akara | Ọrụ | Akara | Ọrụ |
|--------|-----------|--------|-----------|
| `=` | ihe na-agbanwe agbanwe | `$#` | ogologo |
| `:=` | ihe na-adịgide adịgide | `$+` | tinye (enwere ike ịgbụ ụdọ) |
| `>>` | mmepụta | `$+[i]` | fanye na ntụnye aka (1-ndabere) |
| `<<` | ntinye | `$-` | wepụ nke mbụ site na uru |
| `¶` / `\\` | ahịrị ọhụrụ | `$--` | wepụ ihe niile site na uru |
| `?` | ọ bụrụ | `$-[i]` | wepụ na ntụnye aka (1-ndabere) |
| `_?` | ma ọ bụghị-ọ bụrụ | `$-[i..j]` | wepụ oke (1-ndabere) |
| `_` | ma ọ bụghị / kaadị ọhịa | `$?` | nwere |
| `??` | dakọrịta | `$??` | chọta ntụnye aka niile (1-ndabere) |
| `@` | loop | `$[s..e]` | iberibe (1-ndabere) |
| `@ N { }` | loop N ugboro | `$>` | map |
| `@!` | mebie | `$\|` | filter |
| `@>` | gaa n'ihu | `$<` | reduce |
| `@:aha { }` | loop nwere akara | `$/ ihe_nkewa` | kewaa eriri |
| `@:aha!` | mebie akara | `$++ a b c` | iwu njikọ |
| `@:aha>` | gaa n'ihu akara | `arr[i>j>k]` | ntụnye aka ịnyagharị |
| `->` | lambda | `arr[i] = uru` | melite ihe (naanị n'usoro) |
| `arr[i] += uru` | mmelite ngwakọta | `arr[i]$~` | mmelite arụ ọrụ (nnomi ọhụrụ) |
| `$^+` | hazị arịgo (ndị oge ochie) | `$^-` | hazị agbada (ndị oge ochie) |
| `$^` | hazị na onye ntụnyere (tuple) | `<~` | weghachi |
| `\|>` | ọkpọkọ | `!?` | nwaa |
| `:!` | jide | `:>` | n'ikpeazụ |
| `#1` | eziokwu | `#0` | ụgha |
| `$!` | ọ bụ njehie | `$!!` | gbasaa njehie |
| `<#` | bubata | `#>` | bupụta |
| `#` | kwupụta modul | `::` | kpọọ modul |
| `.` | ịnweta ubi | `#?` | metadata ụdị |
| `#\|..\|` | tụgharịa ọnụọgụ | `##.` | tụgharịa gaa n'elu mmiri |
| `###` | tụgharịa gaa ọnụọgụ zuru ezu (gbakọọ) | `##!` | tụgharịa gaa ọnụọgụ zuru ezu (bepụ) |
| `#.N\|..\|` | gbakọọ | `#!N\|..\|` | bepụ |
| `#,\|..\|` | nhazi kọma | `#^\|..\|` | sayensị |
| `#d0d9#` | gbanwee ụdị ọnụọgụ | `#09#` | tọgharịa na ASCII |
| `<\ ..\>` | mee shea | `>\<` | arụmụka CLI |
| `\ ihe_na-agbanwe_agbanwe` | bibie ihe na-agbanwe agbanwe nke ọma | `°x` / `x°` | nkọwa na-ekpo ọkụ (malite na-akpaghị aka) |
| `>>|` | ngọngọ TUI (ihenyo ọzọ) | `>>~` | mmepụta ọnọdụ |
| `>>!` | kpochapụ ihuenyo | `>>?` | jụọ nha ọnụ ọnụ |
| `<<\|` | ịpị igodo na-egbochi | `<<\|?` | nyocha ịpị igodo na-adịghị egbochi |
| `@~ N` | hie ụra N milisekọnd | `$*` | megharịa eriri N ugboro |

---

## Ndekọ Mgbanwe Mwepụta

### v0.0.5 — Ihe Ndị Bụ Isi nke TUI, Nkọwa Na-ekpo Ọkụ & Ịmegharị Eriri _(Mee 2026)_

- **Ihe na-agbaji** Ihe nkewa ogwe dakọrịtara: `ụkpụrụ : nsonaazụ` → `ụkpụrụ => nsonaazụ`
- **Ihe na-agbaji** Aha ọzọ mbubata: `<# ụzọ <= aha_ọzọ` → `<# ụzọ => aha_ọzọ`
- **Ihe na-agbaji** Ịmegharị aha mbupụta: `#> { fn <= ọha }` → `#> { fn => ọha }`
- **Agbakwunyere** Ngọngọ TUI `>>| { }` — ihuenyo ọzọ + ọnọdụ crude; na-ehicha mgbe ịpụsịrị
- **Agbakwunyere** Mmepụta ọnọdụ `>>~ (ahịrị, kọlụm, BKS, fg, bg) > ihe` — oghere ndị na-adịghị ahụkebe, ANSI 256 agba
- **Agbakwunyere** Ntinye igodo `<<| ihe_na-agbanwe_agbanwe` (na-egbochi) na `<<|? ihe_na-agbanwe_agbanwe` (nyocha na-adịghị egbochi)
- **Agbakwunyere** `>>!` kpochapụ ihuenyo, `>>?` jụọ nha ọnụ ọnụ, `@~ N` hie ụra N milisekọnd
- **Agbakwunyere** Nkọwa na-ekpo ọkụ `°x` / `x°` — malite ihe na-agbanwe agbanwe na-akpaghị aka na mbido mbụ na loops
- **Agbakwunyere** Ịmegharị eriri `eriri $* N` — megharịa eriri N ugboro
- **VM** Nha nha: ule 436/436 gafere

### v0.0.4 — Ntinye Aka 1-ndabere, Ọrụ Ọkwa Mbụ & Modul Ngọngọ _(Eprel 2026)_

- **Ihe na-agbaji** E gbanwere ntụnye aka niile ka ọ bụrụ **1-ndabere** — `arr[1]` bụ ihe mbụ; `arr[0]` bụ njehie oge ọrụ
- **Agbakwunyere** Ọrụ ndị nwere aha bụ **ụkpụrụ ọkwa mbụ** — nyefee ozugbo na HOF: `ọnụọgụ$> okpukpu_abụọ`
- **Agbakwunyere** **Ụtọ asụsụ ngọngọ dị mkpa** maka modul: `# aha { ... }` — wepụrụ ụtọ asụsụ dị larịị
- **Agbakwunyere** Ntinye aka n'akụkụ ọtụtụ: `arr[i>j>k]` (ịnyagharị), `arr[p ; q]` (mwepụta dị larịị)
- **Agbakwunyere** Ntughari ụdị: `##.okwu` (n'elu mmiri), `###okwu` (ọnụọgụ zuru ezu gbakọọ), `##!okwu` (ọnụọgụ zuru ezu bepụ)
- **Agbakwunyere** Nkewa eriri: `eriri$/ ihe_nkewa` — na-eweghachi `Array(eriri)`
- **Agbakwunyere** Iwu njikọ: `ntọala$++ a b c` — na-agbakwụnye ọtụtụ ihe
- **Agbakwunyere** Loop oge: `@ N { }` — megharịa kpọmkwem N ugboro
- **Agbakwunyere** Ụtọ asụsụ loop nwere akara: `@:aha { }`, `@:aha!`, `@:aha>` — dochie `@ @aha` / `@! aha`
- **Agbakwunyere** Iwu mpaghara ihe na-agbanwe agbanwe: ihe na-agbanwe agbanwe `_aha` nwere mpaghara ngọngọ ziri ezi; `\ ihe_na-agbanwe_agbanwe` na-ebibi n'oge
- **Agbakwunyere** Ụkpụrụ ntụnyere dakọrịtara: `< 0 =>`, `> 5 =>`, `== 42 =>`, wdg
- **Agbakwunyere** Njehie modul E013: nkwupụta ndị a ga-eme n'ime ahụ modul amachibidoro
- **Edoziri** `alias.CONST` na-edozi nke ọma ugbu a; `#>` nwere ike ịpụta mgbe nkọwa ọrụ gasịrị
- **VM** Nha nha zuru oke: ule 393/393 gafere

### v0.0.3 — Usoro Ọnụọgụ Unicode & Nkwalite LSP _(Eprel 2026)_

- **Agbakwunyere** Ngọngọ ọnụọgụ Unicode iri isii na itoolu nwere akara ngbanwe ụdị `#d0d9#`
- **Agbakwunyere** Ụkpụrụ Boolean n'akwụkwọ edemede ọ bụla — `#१` / `#०`, `#१` / `#०`, wdg
- **Agbakwunyere** Ọnụọgụ Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Agbakwunyere** Opcode VM `SetNumeralMode` — nha nha zuru oke na tree-walker
- **Gbanwere** Mmepụta boolean `>>` ugbu a na-agụnye ihe mgbado `#` (`#0` / `#1`) n'ụdị niile

### v0.0.2_01 — Ịmegharị Aha Ọrụ _(30 Maachị 2026)_

- **Gbanwere** `c|..|` → `#,|..|` na `e|..|` → `#^|..|` — ka ọ dakọrịta na ezinụlọ ihe mgbado `#`
- **Agbakwunyere** Aha ọzọ mbupụta: bupụtaghachi ndị otu modul n'okpuru aha dị iche

### v0.0.2 — Nhazigharị API Mkpokọta & Ndị nrụnye _(24 Maachị 2026)_

- **Agbakwunyere** Ezinaụlọ ọrụ `$` jikọtara ọnụ maka n'usoro na eriri (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Agbakwunyere** Ikenye ịkwasa ihe owuwu maka n'usoro, tuple, na tuple nwere aha
- **Agbakwunyere** Ntụnye aka na-adịghị mma (`arr[-1]` = ihe ikpeazụ)
- **Agbakwunyere** Ndị nrụnye ala — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Maachị 2026)_

- **Agbakwunyere** Ikenye ngwakọta `^=`
- **Edoziri** Okwu oke mgbakọ nke onye ntụgharị; ndozi akwụkwọ

### v0.0.1 — Mwepụta Ọhaneze Mbụ _(22 Maachị 2026)_

- Ntụgharị tree-walker + VM ndekọ (`--vm`, ~4× ngwa ngwa, ~95% nha nha)
- Ihe owuwu isi niile: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Ihe njirimara Unicode zuru ezu, usoro modul, lambda, mmechi, njikwa njehie
- REPL, LSP, ndọtị VS Code, onye nhazi (`zymbol fmt`)

---

_Zymbol-Lang — Nke akara. Nke ụwa niile. Nke na-adịghị agbanwe agbanwe._
