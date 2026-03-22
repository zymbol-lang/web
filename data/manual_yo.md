# Ìtọ́sọ́nà Kúkúrú Zymbol-Lang

**Zymbol-Lang** jẹ́ èdè ìṣèjáde àmì. Kò ní àwọn ọ̀rọ̀ àkọọ́lẹ̀ — ohun gbogbo jẹ́ àmì. Ó ṣiṣẹ́ bakannáà ní èdè ènìyàn èyíkéyìí.

---

## Ìmọ̀ Ìmọ̀-ọjọ́

- Kò sí àwọn ọ̀rọ̀ àkọọ́lẹ̀ (`if`, `while`, `return` kò sí — àwọn àmì nìkan `?`, `@`, `<~`)
- Unicode pípé — àwọn orúkọ ní èdè ẹ̀yọ̀ èyíkéyìí tàbí emoji 👋
- Aláìmọ̀-èdè — kóòdù náà dọ́gba ní gbogbo àwọn èdè

---

## Àwọn Ìyípadà àti Àwọn Ìdúróṣinṣin

```zymbol
nọ́mbà = 10           // Ìyípadà (ó lè yí padà)
PI := 3.14159         // Ìdúróṣinṣin (kò lè yí padà — àṣìṣe bá a yí padà)
orúkọ = "Àmíná"
ṣíṣẹ = #1            // ìtọ́kọ̀ ooto
👋 := "Ẹ káàbọ̀"
```

### Ìpínlẹ̀ Àkópadé

```zymbol
nọ́mbà = 10    // 10
nọ́mbà += 5    // 15
nọ́mbà -= 3    // 12
nọ́mbà *= 2    // 24
nọ́mbà /= 4    // 6
nọ́mbà %= 4    // 2
nọ́mbà++       // 3
nọ́mbà--       // 2
```

---

## Àwọn Iru Data

| Iru             | Àpẹẹrẹ              | Àmì `#?`  | Àwọn Àkọ́sílẹ̀                        |
|-----------------|---------------------|-----------|---------------------------------------|
| Nọ́mbà Pípé     | `42`, `-7`          | `###`     | 64-bit oní àmì                        |
| Nọ́mbà Ìpín     | `3.14`, `1.5e10`    | `##.`     | Ìkọ̀wé sáyẹ́nsì gba                   |
| Okun            | `"ẹ káàbọ̀"`        | `##"`     | Ìfàsẹ́wọ̀n: `"Ẹ káàbọ̀ {orúkọ}"`     |
| Lẹ́tà           | `'A'`               | `##'`     | Lẹ́tà Unicode kan ṣoṣo                |
| Ìtọ́kọ̀          | `#1`, `#0`          | `##?`     | KÒ ṣe nọ́mbà 1 àti 0                  |
| Àrègbè          | `[1, 2, 3]`         | `##]`     | Gbogbo àwọn èròjà irú kan             |
| Tuple           | `(a, b)`            | `##)`     | Ìpò-ìpò                               |
| Tuple Orúkọ     | `(x: 1, y: 2)`      | `##)`     | Wọlé pẹ̀lú orúkọ tàbí àtọ́ka          |

---

## Ìjáde àti Ìgbowọlé

```zymbol
// Ìjáde — KÒ ṣe fífikún ìlà tuntun laifọwọ́yi
>> "Ẹ káàbọ̀" ¶                        // ¶ tàbí \\ fún ìlà tuntun gbangba
>> "a=" àwọn " b=" iye ¶               // ọ̀pọ̀ iye nipasẹ̀ ìjọsí
>> "àpapọ̀=" ìpín(2, 3) ¶              // àwọn ìpè iṣẹ́ ní ìpò èyíkéyìí
>> (àrègbè$#) ¶                        // àwọn àṣẹ postfix nílò àkámọ̀

// Ìgbowọlé
<< orúkọ                               // láì ìbéèrè — kà sí ìyípadà
<< "Orúkọ rẹ? " orúkọ                  // pẹ̀lú ìbéèrè
```

> `¶` tàbí `\\` dọ́gba gẹ́gẹ́ bí ìlà tuntun.

---

## Ìsopọ̀ Okun

Ọ̀nà mẹ́ta tó tọ — ọ̀kọ̀ọ̀kan fún ọrọ rẹ̀:

```zymbol
orúkọ = "Àmíná"
ọjọ́orí = 25

// 1. Fọwọ́ kan — nínú àwọn ìpínlẹ̀ pẹ̀lú = tàbí :=
ìkíni = "Ẹ káàbọ̀ ", orúkọ, "!"               // → Ẹ káàbọ̀ Àmíná!
ÀKỌLÉ := "Olùmúlò: ", orúkọ

// 2. Ìjọsí — nínú ìjáde >>
>> "Ẹ káàbọ̀ " orúkọ " ọjọ́orí rẹ jẹ́ " ọjọ́orí ¶   // → Ẹ káàbọ̀ Àmíná ọjọ́orí rẹ jẹ́ 25

// 3. Ìfàsẹ́wọ̀n — ní ọrọ̀ èyíkéyìí
àpèjúwe = "Ẹ káàbọ̀ {orúkọ}, ọjọ́orí rẹ jẹ́ {ọjọ́orí}"   // → Ẹ káàbọ̀ Àmíná, ọjọ́orí rẹ jẹ́ 25
```

> **Àkọ́sílẹ̀**: `+` fún àwọn nọ́mbà nìkan. Fún àwọn okun, ìkìlọ̀ ni yóò jáde.

---

## Ìdarí Ìṣàn

```zymbol
nọ́mbà = 7

// Bí-ọ̀rọ̀ tó rọrùn
? nọ́mbà > 0 { >> "rere" ¶ }

// Bí / bí-bẹ́ẹ̀kọ́ / ìbẹ̀lẹ̀
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

Àwọn àpótí `{ }` jẹ́ **pàtàkì**, àní fún ìlà kan ṣoṣo.

---

## Match

```zymbol
// Match pẹ̀lú àwọn ìwọ̀n
àmì = 85
ìdínwọ̀n = ?? àmì {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> ìdínwọ̀n ¶    // → B

// Match pẹ̀lú àwọn ìṣọ́ (àwọn ìpele àyẹ̀wò pàtàkì)
ìhùwàsí = -5
ipò = ?? ìhùwàsí {
    _? ìhùwàsí < 0  : "yìnyín"
    _? ìhùwàsí < 20 : "tútù"
    _? ìhùwàsí < 35 : "gbóná"
    _               : "jóná"
}
>> ipò ¶    // → yìnyín

// Match pẹ̀lú àwọn okun
àwọ̀ = "pupa"
kóòdù = ?? àwọ̀ {
    "pupa"  : "#FF0000"
    "ewé"   : "#00FF00"
    _       : "#000000"
}
>> kóòdù ¶
```

---

## Àwọn Yípo

```zymbol
// Ìwọ̀n àfikún: 0..4 yípo 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Ìwọ̀n pẹ̀lú ìgbésọkọ̀
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Ìwọ̀n ìyípadà
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Nígbà tí (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Fún ọ̀kọ̀ọ̀kan
àwọn èso = ["ọ̀sán", "ìbépè", "àgbàdo"]
@ è:àwọn èso { >> è ¶ }

// Lórí àwọn lẹ́tà okun
@ l:"ẹ káàbọ̀" { >> l "-" }
>> ¶    // → ẹ-k-á-à-b-ọ̀-

// Dúró àti Tẹ̀síwájú
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> tẹ̀síwájú
    ? i > 7 { @! }          // @! dúró
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Àwọn Iṣẹ́

```zymbol
// Ìkéde àti ìpè
ìpín(a, b) { <~ a + b }
>> ìpín(3, 4) ¶    // → 7

// Àtúnpè
ìpọ̀pọ̀(n) {
    ? n <= 1 { <~ 1 }
    <~ n * ìpọ̀pọ̀(n - 1)
}
>> ìpọ̀pọ̀(5) ¶    // → 120

// Àwọn iṣẹ́ ní ìwọ̀n ìyókúrò — kò sí ànfàní sí àwọn ìyípadà ìta
àgbáyé = 100
ìdánwò() {
    x = 42    // àdéédéé ìbílẹ̀ nìkan
    <~ x
}
>> ìdánwò() ¶    // → 42
```

> **Pàtàkì**: Àwọn iṣẹ́ tó ní orúkọ `orúkọ(àwọn èròjà){ }` kò ṣe àwọn iye pé kìíní.
> Láti gbé gẹ́gẹ́ bí ohun ìjiyàn: `x -> orúkọ(x)`.

---

## Lambda àti Àwọn Ìdè

```zymbol
// Lambda tó rọrùn (ìpadàsẹ́ tó fara sin)
ìlọ́po = x -> x * 2
àpapọ̀ = (a, b) -> a + b
>> ìlọ́po(5) ¶      // → 10
>> àpapọ̀(3, 7) ¶   // → 10

// Lambda pẹ̀lú àpótí (ìpadàsẹ́ gbangba)
ìpínlẹ̀ = x -> {
    ? x > 0 { <~ "rere" }
    _? x < 0 { <~ "odi" }
    <~ "òdo"
}
>> ìpínlẹ̀(5) ¶     // → rere
>> ìpínlẹ̀(0) ¶     // → òdo
>> ìpínlẹ̀(-5) ¶    // → odi

// Àwọn Ìdè — Àwọn Lambda gba àwọn ìyípadà ìta
ìpele = 3
ìlọ́po-mẹ́ta = x -> x * ìpele    // gba 'ìpele'
>> ìlọ́po-mẹ́ta(7) ¶    // → 21

// Iṣẹ́ ìṣelọ́pọ̀
ṣe_àfikún(n) { <~ x -> x + n }
àfikún10 = ṣe_àfikún(10)
>> àfikún10(5) ¶    // → 15

// Àwọn Lambda gẹ́gẹ́ bí iye: tí a tọ́jú nínú àwọn àrègbè
àwọn ìṣe = [x -> x+1, x -> x*2, x -> x*x]
>> àwọn ìṣe[0](5) ¶    // → 6
>> àwọn ìṣe[2](5) ¶    // → 25
```

---

## Àwọn Àrègbè

```zymbol
àrègbè = [10, 20, 30, 40, 50]

// Ìwọlé (àtọ́ka tó bẹ̀rẹ̀ pẹ̀lú 0)
>> àrègbè[0] ¶    // → 10

// Ìpàdé (àkámọ̀ nílò nínú >>)
n = àrègbè$#
>> (àrègbè$#) ¶    // → 5

// Fikún, yọ, ní, gé
àrègbè = àrègbè$+ 60               // fikún
àrègbè = àrègbè$- 0                // yọ àtọ́ka 0
ní = àrègbè$? 30                   // → #1
gígé = àrègbè$[0..2]               // [20, 30]

// Mú è̩rò̩jà dára
àrègbè[1] = 99

// Fún ọ̀kọ̀ọ̀kan
@ x:àrègbè { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` dá **àrègbè tuntun** padà — ìpínlẹ̀ tuntun: `àrègbè = àrègbè$+ 4`.
> Kò sí ìjọpọ̀: àwọn ìpínlẹ̀ meji tó yàtọ̀ sí ara wọn ló yẹ kí a lò.

---

## Tuple

```zymbol
// Tuple Orúkọ
ènìyàn = (orúkọ: "Alice", ọjọ́orí: 25)
>> ènìyàn.orúkọ ¶    // → Alice
>> ènìyàn.ọjọ́orí ¶  // → 25
>> ènìyàn[0] ¶       // → Alice (àtọ́ka tún ṣiṣẹ́)
```

---

## Àwọn Iṣẹ́ Ìpele Gíga

Àwọn àṣẹ HOF nílò **Lambda Tààrà** — kò sí ìyípadà lambda tààrà.

```zymbol
àwọn nọ́mbà = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
ìlọ́po = àwọn nọ́mbà$> (x -> x * 2)
>> ìlọ́po ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
àwọn ìlọ́po-meji = àwọn nọ́mbà$| (x -> x % 2 == 0)
>> àwọn ìlọ́po-meji ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (iye àkọ́kọ́, (àkójọpọ̀, è̩rò̩jà) -> ìfihàn)
àpapọ̀ = àwọn nọ́mbà$< (0, (akọ, x) -> akọ + x)
>> àpapọ̀ ¶    // → 55
```

---

## Ìdarí Àṣìṣe

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Ìpín pẹ̀lú òdo" ¶
} :! ##IO {
    >> "Àṣìṣe IO" ¶
} :! {
    >> "àṣìṣe mìíràn: " _err ¶
} :> {
    >> "máa ń ṣiṣẹ́ nígbà gbogbo" ¶
}
```

| Irú         | Nígbà tí ó ṣẹlẹ̀                  |
|-------------|-----------------------------------|
| `##Div`     | Ìpín pẹ̀lú òdo                    |
| `##IO`      | Fáìlì / Ètò                       |
| `##Index`   | Àtọ́ka jọ ìwọ̀n kọjá              |
| `##Type`    | Àṣìṣe irú                         |
| `##Parse`   | Àṣìṣe ìtúpalẹ̀                    |
| `##Network` | Àṣìṣe nẹ́tíwọ̀ọ̀kì                |
| `##_`       | Àṣìṣe èyíkéyìí (catch-all)        |

---

## Àwọn Ẹka

```zymbol
// Fáìlì: lib/iṣirò.zy
# iṣirò

#> { ìpín, gba_PI }    // Àwọn ìjáde KÍ WỌLÉ àwọn ìtúmọ̀

_PI := 3.14159
ìpín(a, b) { <~ a + b }
gba_PI() { <~ _PI }
```

```zymbol
// Fáìlì: main.zy
<# ./lib/iṣirò <= ì    // Orúkọ àfojúsùn nílò

>> ì::ìpín(5, 3) ¶  // → 8
pi = ì::gba_PI()
>> pi ¶             // → 3.14159
```

---

## Àpẹẹrẹ Pípé: FizzBuzz

```zymbol
ìpín(nọ́mbà) {
    ? nọ́mbà % 15 == 0 { <~ "FọnGún" }
    _? nọ́mbà % 3  == 0 { <~ "Fọn" }
    _? nọ́mbà % 5  == 0 { <~ "Gún" }
    _ { <~ nọ́mbà }
}

@ i:1..20 { >> ìpín(i) ¶ }
```

---

## Àtọkọ Àmì

| Àmì     | Ìṣe                   | Àmì        | Ìṣe                       |
|---------|-----------------------|------------|---------------------------|
| `=`     | Ìyípadà               | `$#`       | Ìpàdé                     |
| `:=`    | Ìdúróṣinṣin           | `$+`       | fikún                     |
| `>>`    | Ìjáde                 | `$-`       | yọ (pẹ̀lú àtọ́ka)          |
| `<<`    | Ìgbowọlé              | `$?`       | ní                         |
| `¶`/`\` | Ìlà tuntun            | `$[s..e]`  | gígé                       |
| `?`     | bí (if)               | `$>`       | map                        |
| `_?`    | bí-bẹ́ẹ̀kọ́ (elif)     | `$\|`      | filter                     |
| `_`     | bẹ́ẹ̀kọ́ / àmì-àgbádo  | `$<`       | reduce                     |
| `??`    | match                 | `!?`       | gbìyànjú (try)             |
| `@`     | Yípo                  | `:!`       | mú (catch)                 |
| `@!`    | dúró (break)          | `:>`       | nígbà gbogbo (finally)     |
| `@>`    | tẹ̀síwájú (continue)  | `$!`       | jẹ́ àṣìṣe                  |
| `->`    | Lambda                | `$!!`      | gbé àṣìṣe                  |
| `<~`    | padà (return)         | `#`        | kéde ẹka                   |
| `\|>`   | Pipe                  | `#>`       | ṣe ìjáde                   |
| `#1`    | ooto                  | `<#`       | wọlé                        |
| `#0`    | irọ́                  | `::`       | ìpè ẹka                    |

---

*Zymbol-Lang — Àmì. Àgbáyé. Àìyípadà.*

---

> **Àkọ́sílẹ̀:** Àkọsílẹ̀ yìí jẹ́ ṣíṣẹ̀dá àti ìtúmọ̀ rẹ̀ nípa ọgbọ́n àṣà ìmọ̀ (AI).
> A ti ṣe gbogbo ìgbìyànjú láti ríi dájú pé ohun tó wà nínú rẹ̀ jẹ́ òtítọ́, àmọ́ àwọn ìtúmọ̀ tàbí àwọn àpẹẹrẹ kan lè ní àwọn àṣìṣe.
> Ìtọ́kasí aláṣẹ jẹ́ [àpèjúwe Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
