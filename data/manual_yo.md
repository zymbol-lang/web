# Ìtọ́sọ́nà Kúkúrú Zymbol-Lang

**Zymbol-Lang** jẹ́ èdè ìṣèjáde àmì. Kò ní àwọn ọ̀rọ̀ àkọọ́lẹ̀ — ohun gbogbo jẹ́ àmì. Ó ṣiṣẹ́ bakannáà ní èdè ènìyàn èyíkéyìí.

- Kò sí àwọn ọ̀rọ̀ àkọọ́lẹ̀ (`if`, `while`, `return` kò sí — àwọn àmì nìkan `?`, `@`, `<~`)
- Unicode pípé — àwọn orúkọ ní èdè ẹ̀yọ̀ èyíkéyìí tàbí emoji 👋
- Aláìmọ̀-èdè — kóòdù náà dọ́gba ní gbogbo àwọn èdè

---

## Àwọn Ìyípadà àti Àwọn Ìdúróṣinṣin

```zymbol
x = 10              // ìyípadà (ó lè yí padà)
PI := 3.14159       // ìdúróṣinṣin — àṣìṣe bá a yí padà
orúkọ = "Àmíná"
ṣíṣẹ = #1           // ìtọ́kọ̀ ooto
👋 := "Ẹ káàbọ̀"
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

## Àwọn Iru Data

| Iru | Àpẹẹrẹ | Àmì `#?` | Àwọn Àkọ́sílẹ̀ |
|-----|--------|----------|----------------|
| Nọ́mbà Pípé | `42`, `-7` | `###` | 64-bit oní àmì |
| Nọ́mbà Ìpín | `3.14`, `1.5e10` | `##.` | Ìkọ̀wé sáyẹ́nsì gba |
| Okun | `"ẹ káàbọ̀"` | `##"` | Ìfàsẹ́wọ̀n: `"Ẹ káàbọ̀ {orúkọ}"` |
| Lẹ́tà | `'A'` | `##'` | Lẹ́tà Unicode kan ṣoṣo |
| Ìtọ́kọ̀ | `#1`, `#0` | `##?` | KÒ ṣe nọ́mbà 1 àti 0 |
| Àrègbè | `[1, 2, 3]` | `##]` | Gbogbo àwọn èròjà irú kan |
| Tuple | `(a, b)` | `##)` | Ìpò-ìpò |
| Tuple Orúkọ | `(x: 1, y: 2)` | `##)` | Wọlé pẹ̀lú orúkọ tàbí àtọ́ka |

```zymbol
// Ìwádìí irú — ó dá (irú, iye nọ́mbà, ìye) padà
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Ìjáde àti Ìgbowọlé

```zymbol
>> "Ẹ káàbọ̀" ¶                        // ¶ tàbí \\ fún ìlà tuntun gbangba
>> "a=" a " b=" b ¶                    // ọ̀pọ̀ iye nipasẹ̀ ìjọsí
>> (àrègbè$#) ¶                        // àwọn àṣẹ postfix nílò àkámọ̀

<< orúkọ                               // láì ìbéèrè — kà sí ìyípadà
<< "Orúkọ rẹ? " orúkọ                  // pẹ̀lú ìbéèrè
```

> `¶` tàbí `\\` dọ́gba gẹ́gẹ́ bí ìlà tuntun.

---

## Awọn Olùṣiṣẹ́

```zymbol
// Àríméètíkì — lò ìpínlẹ̀; àwọn àṣẹ kan ní àwọn ìṣòro ní >> tààrà
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (ìpín nọ́mbà pípé)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (agbára)

// Ìfiwéra
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Ọ̀gọ́
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Àwọn Ọ̀rọ̀

```zymbol
// Ọ̀nà mẹ́ta ti ìsopọ̀
orúkọ = "Àmíná"
n = 42

ìkíni = "Ẹ káàbọ̀ ", orúkọ, "!"             // fọwọ́ kan — nínú ìpínlẹ̀
>> "Ẹ káàbọ̀ " orúkọ " ọjọ́orí rẹ " n ¶     // ìjọsí — nínú >>
àpèjúwe = "Ẹ káàbọ̀ {orúkọ}, ọjọ́orí {n}"   // ìfàsẹ́wọ̀n — ní ọrọ̀ èyíkéyìí
```

```zymbol
s = "Ẹ káàbọ̀ Ayé"
ìpàdé = s$#                  // 12
abẹ = s$[0..8]               // "Ẹ káàbọ̀"  (ìparí kò wọlé)
ní = s$? "Ayé"               // #1
àwọn_apá = "a,b,c,d" / ','   // [a, b, c, d]
rọ́pò = s$~~["à":"À"]         // rọ́pò gbogbo
rọ́pò1 = s$~~["à":"À":1]      // rọ́pò N àkọ́kọ́ nìkan
```

> `+` fún àwọn nọ́mbà nìkan. Lò `,`, ìjọsí, tàbí ìfàsẹ́wọ̀n fún àwọn okun.

---

## Ìdarí Ìṣàn

```zymbol
nọ́mbà = 7

? nọ́mbà > 0 { >> "rere" ¶ }

? nọ́mbà > 100 {
    >> "ńlá" ¶
} _? nọ́mbà > 0 {
    >> "rere" ¶
} _? nọ́mbà == 0 {
    >> "òdo" ¶
} _ {
    >> "odi" ¶
}
```

> Àwọn àpótí `{ }` jẹ́ **pàtàkì**, àní fún ìlà kan ṣoṣo.

---

## Match

```zymbol
// Àwọn ìwọ̀n
àmì = 85
ìdínwọ̀n = ?? àmì {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> ìdínwọ̀n ¶    // → B

// Àwọn okun
àwọ̀ = "pupa"
kóòdù = ?? àwọ̀ {
    "pupa"  : "#FF0000"
    "ewé"   : "#00FF00"
    _       : "#000000"
}

// Àwọn ìṣọ́
ìhùwàsí = -5
ipò = ?? ìhùwàsí {
    _? ìhùwàsí < 0  : "yìnyín"
    _? ìhùwàsí < 20 : "tútù"
    _? ìhùwàsí < 35 : "gbóná"
    _               : "jóná"
}
>> ipò ¶    // → yìnyín

// Fọ́ọ̀mù ọ̀rọ̀ (àwọn apá àpótí)
?? n {
    0       : { >> "òdo" ¶ }
    _? n < 0: { >> "odi" ¶ }
    _       : { >> "rere" ¶ }
}
```

---

## Àwọn Yípo

```zymbol
@ i:0..4  { >> i " " }        // ìwọ̀n àfikún: 0 1 2 3 4
@ i:1..9:2 { >> i " " }       // pẹ̀lú ìgbésọkọ̀: 1 3 5 7 9
@ i:5..0:1 { >> i " " }       // ìyípadà: 5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (nígbà tí)

àwọn èso = ["ọ̀sán", "ìbépè", "àgbàdo"]
@ è:àwọn èso { >> è ¶ }       // fún ọ̀kọ̀ọ̀kan àrègbè

@ l:"ẹ káàbọ̀" { >> l "-" }
>> ¶                          // → ẹ-k-á-à-b-ọ̀-  (fún ọ̀kọ̀ọ̀kan lẹ́tà)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> tẹ̀síwájú
    ? i > 7 { @! }             // @! dúró
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Yípo aláìní òpin
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Yípo pẹ̀lú àmì (dúró ní ìbọ̀n)
iye = 0
@ @ìta {
    iye++
    ? iye >= 3 { @! ìta }
}
>> iye ¶                      // → 3
```

---

## Àwọn Iṣẹ́

```zymbol
ìpín(a, b) { <~ a + b }
>> ìpín(3, 4) ¶    // → 7

ìpọ̀pọ̀(n) {
    ? n <= 1 { <~ 1 }
    <~ n * ìpọ̀pọ̀(n - 1)
}
>> ìpọ̀pọ̀(5) ¶    // → 120
```

Àwọn iṣẹ́ ní **ìwọ̀n ìyókúrò** — kò sí ànfàní sí àwọn ìyípadà ìta. Lò àwọn àgbékalẹ̀ ìpadàsẹ́ `<~` láti ṣe àtúnṣe àwọn ìyípadà olùpè:

```zymbol
pàárọ̀(a<~, b<~) {
    fún_ìgbà = a
    a = b
    b = fún_ìgbà
}
x = 10
y = 20
pàárọ̀(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Àwọn iṣẹ́ tó ní orúkọ kò ṣe àwọn iye pé kìíní. Láti gbé gẹ́gẹ́ bí ohun ìjiyàn: `x -> orúkọ(x)`.

---

## Lambda àti Àwọn Ìdè

```zymbol
ìlọ́po = x -> x * 2
àpapọ̀ = (a, b) -> a + b
>> ìlọ́po(5) ¶      // → 10
>> àpapọ̀(3, 7) ¶   // → 10

// Lambda pẹ̀lú àpótí
ìpínlẹ̀ = x -> {
    ? x > 0 { <~ "rere" }
    _? x < 0 { <~ "odi" }
    <~ "òdo"
}

// Àwọn Ìdè — gba àwọn ìyípadà ìta
ìpele = 3
ìlọ́po_mẹ́ta = x -> x * ìpele
>> ìlọ́po_mẹ́ta(7) ¶    // → 21

// Iṣẹ́ ìṣelọ́pọ̀
ṣe_àfikún(n) { <~ x -> x + n }
àfikún10 = ṣe_àfikún(10)
>> àfikún10(5) ¶    // → 15

// Nínú àwọn àrègbè
àwọn ìṣe = [x -> x+1, x -> x*2, x -> x*x]
>> àwọn ìṣe[2](5) ¶    // → 25
```

---

## Àwọn Àrègbè

```zymbol
àrègbè = [1, 2, 3, 4, 5]

àrègbè[0]          // 1 — ìwọlé (àtọ́ka tó bẹ̀rẹ̀ pẹ̀lú 0)
àrègbè[-1]         // 5 — àtọ́ka odi (ìkẹ̀yìn)
àrègbè$#           // 5 — ìpàdé (lò (àrègbè$#) nínú >>)

àrègbè = àrègbè$+ 6            // fikún → [1,2,3,4,5,6]
àrègbè2 = àrègbè$+[2] 99       // fi sí àtọ́ka 2
àrègbè3 = àrègbè$- 3           // yọ ìfarahàn àkọ́kọ́ ìye
àrègbè4 = àrègbè$-- 3          // yọ gbogbo ìfarahàn
àrègbè5 = àrègbè$-[0]          // yọ ní àtọ́ka
àrègbè6 = àrègbè$-[1..3]       // yọ ìwọ̀n (ìparí kò wọlé)

ní = àrègbè$? 3                 // #1 — ní
ìpò = àrègbè$?? 3              // [2] — gbogbo àtọ́ka ìye
sl = àrègbè$[0..3]             // [1,2,3] — gígé (ìparí kò wọlé)
sl2 = àrègbè$[0:3]             // [1,2,3] — síntáksì iye

gòkè = àrègbè$^+               // tíì wọlé gòkè (primitives nìkan)
sọ̀kalẹ̀ = àrègbè$^-            // tíì wọlé sọ̀kalẹ̀ (primitives nìkan)

// Àrègbè tuple — lò $^ pẹ̀lú lambda àfiwéra
àkójọ = [(orúkọ: "Carla", ọjọ́orí: 28), (orúkọ: "Ana", ọjọ́orí: 25), (orúkọ: "Bob", ọjọ́orí: 30)]
nípasẹ̀_ọjọ́orí  = àkójọ$^ (a, b -> a.ọjọ́orí < b.ọjọ́orí)    // gòkè nípasẹ̀ ọjọ́orí
nípasẹ̀_orúkọ = àkójọ$^ (a, b -> a.orúkọ > b.orúkọ)          // sọ̀kalẹ̀ nípasẹ̀ orúkọ
>> nípasẹ̀_ọjọ́orí[0].orúkọ ¶     // → Ana
>> nípasẹ̀_orúkọ[0].orúkọ ¶      // → Carla

àrègbè[1] = 99               // ìmúdójúìwọ̀n ní ààyè
àrègbè = àrègbè[1]$~ 99      // ìmúdójúìwọ̀n iṣẹ́ — dá àrègbè tuntun padà
```

> Gbogbo àwọn àṣẹ àkójọ dá **àrègbè tuntun** padà. Pínlẹ̀ tuntun: `àrègbè = àrègbè$+ 4`.
> Àwọn àṣẹ kò lè wà ní ìjọpọ̀ — lò àwọn ìpínlẹ̀ àárọ̀ meji.
> `$^+` / `$^-` tò **àwọn àrègbè primitives** (àwọn nọ́mbà, àwọn okun). Fún àwọn àrègbè tuple lò `$^` pẹ̀lú lambda àfiwéra — ìtọ́sọ́nà wà nínú lambda (`<` = gòkè, `>` = sọ̀kalẹ̀).

```zymbol
// Àwọn àrègbè tí a fi sí ara wọn
mẹ́trìkì = [[1,2,3],[4,5,6],[7,8,9]]
>> mẹ́trìkì[1][2] ¶    // → 6
```

---

## Ìfọ́kànbalẹ̀

```zymbol
// Àrègbè
àrègbè = [10, 20, 30, 40, 50]
[a, b, c] = àrègbè              // a=10  b=20  c=30
[àkọ́kọ́, *ìyókù] = àrègbè       // àkọ́kọ́=10  ìyókù=[20,30,40,50]
[x, _, z] = [1, 2, 3]            // _ sọnù

// Tuple ìpò
àmì = (100, 200)
(px, py) = àmì                  // px=100  py=200

// Tuple orúkọ
ènìyàn = (orúkọ: "Ana", ọjọ́orí: 25, ìlú: "Lagos")
(orúkọ: n, ọjọ́orí: o) = ènìyàn   // n="Ana"  o=25
```

---

## Tuple

```zymbol
// Ìpò
àmì = (10, 20)
>> àmì[0] ¶    // → 10

// Orúkọ
ènìyàn = (orúkọ: "Alice", ọjọ́orí: 25)
>> ènìyàn.orúkọ ¶    // → Alice
>> ènìyàn[0] ¶       // → Alice  (àtọ́ka tún ṣiṣẹ́)

// Tí a fi sí ara wọn
ipò = (x: 10, y: 20)
p = (ipò: ipò, àmì: "ìpilẹ̀ṣẹ̀")
>> p.ipò.x ¶         // → 10
```

---

## Àwọn Iṣẹ́ Ìpele Gíga

> Àwọn àṣẹ HOF nílò **Lambda Tààrà** — kò sí ìyípadà lambda tààrà.

```zymbol
àwọn nọ́mbà = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ìlọ́po    = àwọn nọ́mbà$> (x -> x * 2)                // map  → [2,4,6…20]
àwọn ìlọ́po_meji = àwọn nọ́mbà$| (x -> x % 2 == 0)    // filter → [2,4,6,8,10]
àpapọ̀   = àwọn nọ́mbà$< (0, (akọ, x) -> akọ + x)     // reduce → 55

// Ìjọpọ̀ nípasẹ̀ àwọn ìpínlẹ̀ àárọ̀
ìgbésẹ̀1 = àwọn nọ́mbà$| (x -> x > 3)
ìgbésẹ̀2 = ìgbésẹ̀1$> (x -> x * x)
>> ìgbésẹ̀2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Àwọn iṣẹ́ tó ní orúkọ nínú HOF — fi sínú lambda
ìlọ́po_f(x) { <~ x * 2 }
r = àwọn nọ́mbà$> (x -> ìlọ́po_f(x))    // ✅
```

---

## Olùṣiṣẹ́ Ìtọ̀nà

Ìhà ọ̀tún kọ́ nílò `_` gẹ́gẹ́ bí olùdúró fún ìye tí a gbé:

```zymbol
ìlọ́po = x -> x * 2
fikún = (a, b) -> a + b
fikún_ọ̀kan = x -> x + 1

5 |> ìlọ́po(_)           // → 10
10 |> fikún(_, 5)        // → 15
5 |> fikún(2, _)         // → 7

// Ìjọpọ̀
r = 5 |> ìlọ́po(_) |> fikún_ọ̀kan(_) |> ìlọ́po(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Ìdarí Àṣìṣe

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "ìpín pẹ̀lú òdo" ¶
} :! {
    >> "àṣìṣe mìíràn: " _err ¶    // _err dì ìpínrọ̀ àṣìṣe
} :> {
    >> "máa ń ṣiṣẹ́ nígbà gbogbo" ¶
}
```

| Irú | Nígbà tí ó ṣẹlẹ̀ |
|-----|------------------|
| `##Div` | Ìpín pẹ̀lú òdo |
| `##IO` | Fáìlì / Ètò |
| `##Index` | Àtọ́ka jọ ìwọ̀n kọjá |
| `##Type` | Àṣìṣe irú |
| `##Parse` | Àṣìṣe ìtúpalẹ̀ |
| `##Network` | Àṣìṣe nẹ́tíwọ̀ọ̀kì |
| `##_` | Àṣìṣe èyíkéyìí (catch-all) |

---

## Àwọn Ẹka

```zymbol
// lib/iṣirò.zy
# iṣirò

#> { ìpín, gba_PI }    // Àwọn ìjáde KÍ WỌLÉ àwọn ìtúmọ̀

_PI := 3.14159
ìpín(a, b) { <~ a + b }
gba_PI() { <~ _PI }
```

```zymbol
// main.zy
<# ./lib/iṣirò <= ì    // Orúkọ àfojúsùn nílò

>> ì::ìpín(5, 3) ¶  // → 8
pi = ì::gba_PI()
>> pi ¶             // → 3.14159
```

```zymbol
// Jáde pẹ̀lú orúkọ ìgbéjáde tó yàtọ̀
# ìwé_ìmọ̀
#> { _fikún_ìbílẹ̀ <= àpapọ̀ }

_fikún_ìbílẹ̀(a, b) { <~ a + b }
```

```zymbol
<# ./ìwé_ìmọ̀ <= ì

>> ì::àpapọ̀(3, 4) ¶    // → 7  (orúkọ ìbílẹ̀ _fikún_ìbílẹ̀ pamọ́)
```

---

## Àwọn Olùṣiṣẹ́ Dátà

```zymbol
// Túmọ̀ okun sí nọ́mbà
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (ìfìwé-sí, kò sí àṣìṣe)

// Yíká / gé
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (yíká sí decimal 2)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (gé)

// Ìfọ́nà nọ́mbà
fmt = #,|1234567|      // → 1,234,567  (pín pẹ̀lú kọ́mà)
sci = #^|12345.678|    // → 1.2345678e4  (sáyẹ́nsì)

// Àwọn ìtúmọ̀ ìpìlẹ̀
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Ìjáde ìyípadà ìpìlẹ̀
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Ìṣọ̀kan Shell

```zymbol
ọjọ́ = <\ date +%Y-%m-%d \>     // gba stdout (pẹ̀lú \n ìkẹ̀yìn)
>> "Òní: " ọjọ́

fáìlì = "data.txt"
àkóónú = <\ cat {fáìlì} \>     // ìfàsẹ́wọ̀n nínú àwọn àṣẹ

ìjáde = </"./ìwé_kékeré.zy"/> // ṣe ìwé Zymbol mìíràn, gba ìjáde
>> ìjáde
```

> `><` gba àwọn ìjiyàn CLI gẹ́gẹ́ bí àrègbè okun (tree-walker nìkan).

---

## Àpẹẹrẹ Pípé: FizzBuzz

```zymbol
pín(nọ́mbà) {
    ? nọ́mbà % 15 == 0 { <~ "FizzBuzz" }
    _? nọ́mbà % 3  == 0 { <~ "Fizz" }
    _? nọ́mbà % 5  == 0 { <~ "Buzz" }
    _ { <~ nọ́mbà }
}

@ i:1..20 { >> pín(i) ¶ }
```

---

## Àtọkọ Àmì

| Àmì | Ìṣe | Àmì | Ìṣe |
|-----|-----|-----|-----|
| `=` | ìyípadà | `$#` | ìpàdé |
| `:=` | ìdúróṣinṣin | `$+` | fikún |
| `>>` | ìjáde | `$+[i]` | fi sí àtọ́ka |
| `<<` | ìgbowọlé | `$-` | yọ àkọ́kọ́ nípasẹ̀ ìye |
| `¶` / `\\` | ìlà tuntun | `$--` | yọ gbogbo nípasẹ̀ ìye |
| `?` | bí (if) | `$-[i]` | yọ ní àtọ́ka |
| `_?` | bí-bẹ́ẹ̀kọ́ (elif) | `$-[i..j]` | yọ ìwọ̀n |
| `_` | bẹ́ẹ̀kọ́ / àmì-àgbádo | `$?` | ní |
| `??` | match | `$??` | wá gbogbo àtọ́ka |
| `@` | yípo | `$[s..e]` | gígé |
| `@!` | dúró (break) | `$>` | map |
| `@>` | tẹ̀síwájú (continue) | `$\|` | filter |
| `->` | lambda | `$<` | reduce |
| `$^+` | tò gòkè (primitives) | `$^-` | tò sọ̀kalẹ̀ (primitives) |
| `$^` | tò pẹ̀lú àfiwéra (tuple) | | |
| `<~` | padà (return) | `!?` | gbìyànjú (try) |
| `\|>` | pipe | `:!` | mú (catch) |
| `#1` | ooto (true) | `:>` | nígbà gbogbo (finally) |
| `#0` | irọ́ (false) | `$!` | jẹ́ àṣìṣe |
| `<#` | wọlé (import) | `$!!` | gbé àṣìṣe |
| `#` | kéde ẹka | `#>` | ṣe ìjáde (export) |
| `::` | ìpè ẹka | `.` | ìwọlé sẹ́hẹ̀ndì |
| `#\|..\|` | túmọ̀ nọ́mbà | `#?` | metadata irú |
| `#.N\|..\|` | yíká | `#!N\|..\|` | gé |
| `c\|..\|` | ìfọ́nà kọ́mà | `e\|..\|` | sáyẹ́nsì |
| `<\ ..\>` | ṣe shell | `>\<` | àwọn ìjiyàn CLI |

---

*Zymbol-Lang — Àmì. Àgbáyé. Àìyípadà.*

> **Àkọ́sílẹ̀:** Àkọsílẹ̀ yìí jẹ́ ṣíṣẹ̀dá àti ìtúmọ̀ rẹ̀ nípa ọgbọ́n àṣà ìmọ̀ (AI).
> A ti ṣe gbogbo ìgbìyànjú láti ríi dájú pé ohun tó wà nínú rẹ̀ jẹ́ òtítọ́, àmọ́ àwọn ìtúmọ̀ tàbí àwọn àpẹẹrẹ kan lè ní àwọn àṣìṣe.
> Ìtọ́kasí aláṣẹ jẹ́ [MANUAL.md](https://github.com/zymbol-lang/interpreter) nínú ilé-ìpamọ̀ olùtúmọ̀.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> The canonical reference is [MANUAL.md](https://github.com/zymbol-lang/interpreter) in the interpreter repository.
