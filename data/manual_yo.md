> **Ìfitóléni:** Ìwé ìmọ̀ yíi ni a ṣe pẹ̀lú ìrànwọ́ ọpọlọ àbòbò (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Ìtókasí ti ó tọ́ ni **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** nínú ibi ìpamọ́ atumọ̀.

---

# Ìwé ìtọ́ni ti Zymbol-Lang

**Zymbol-Lang** jẹ́ èdè ìṣèto àmì kan. Kò sí àwọn ọ̀rọ ọ̀rọ̀ — ohun gbogbo jẹ́ àmì. Ó ń ṣiṣẹ́ bakanna nínú èdè ènìyàn èyìkeyi.

- Kò sí `if`, `while`, `return` — nikan `?`, `@`, `<~`
- Unicode ní ìkikun — àwọn ìdámú ninú èdè eyikeyi tàbí emoji
- Ó dàgbere sí èdè ènìyàn — kóọ̀dú naá jẹ́ kanna ní gbogbo ibi

**Ẹ̀ya atumọ̀**: v0.0.4 | **Ìbìdí ìdánwò**: 393/393 (ìgbá ti TW ↔ VM)

---

---

## Àwọn oniyipada àti Iduróṣínṣin

```zymbol
x = 10              // oniyipadá tó lè yí padà
PI := 3.14159       // iduróṣínṣin — fífa fun ni tuntun jẹ́ aṣìṣe àkọ́ọ̀lé
orúkọ = "Aliisi"
ṣiṣẹ = #1           // Boolian òtitó
👋 := "Kààbò"
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

## Àwọn irú Data

| Irú | Litáli | Àmì `#?` | Àkíyesí |
|------|--------|-----------|-----------|
| Nòmbá òdó | `42`, `-7` | `###` | 64-bit ti a fi ẹ̀mí sí |
| Nòmbá lílefòfò | `3.14`, `1.5e10` | `##.` | Ìkọsìlẹ̀ ìmọ̀ ìjọnlọ ti yọ̀ndà |
| Òkún | `"ọ̀rọ̀"` | `##"` | Ifísí: `"Kààbò {orúkọ}"` |
| Lẹ́tà | `'A'` | `##'` | Lẹ́tà Unicode kan ṣoṣo |
| Boolian | `#1`, `#0` | `##?` | KÒ jẹ́ nòmbá — `#1 ≠ 1` |
| Ẹ̀kọ́ | `[1, 2, 3]` | `##]` | Àwọn ohun ti o jọra |
| Túpù | `(a, b)` | `##)` | Nípò |
| Túpù ti a sọ lorúkọ | `(x: 1, y: 2)` | `##)` | Àwọn aaye ti wọn ni oorúkọ |
| Ìṣé | ìtókasí ìṣé ti a sọ lorúkọ | `##()` | Ipele kíní; ó fi hàn `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Ipele kíní; ó fi hàn `<lambd/N>` |

```zymbol
// Ayẹwo irú — ó padà (irú, àwọn nòmbá, iye)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Àwùjò àti Ìgbáwọlé

```zymbol
>> "Kààbò" ¶                       // ¶ tàbí \\ fun ìlà tuntun ti ó yéyé
>> "a=" a " b=" b ¶               // ìfí sí èbé — àwọn iye púpọ̀
>> (arr$#) ¶                      // àwọn òṣìṣẹ́ lórúkọ ní ìgbéyìn nílò ( ) nínú >>

<< orúkọ                           // kà sínú oniyipada (láìsí ìbéèrè)
<< "Tẹ orúkọ sí: " orúkọ         // pẹ̀lú ìbéèrè
```

> `¶` (AltGr+R lórí keyboard Sípéènì) àti `\\` jẹ́ ìgbá fun ìlà tuntun.

---

## Òṣìṣẹ́

```zymbol
// Ìṣìrò — lo àwọn àfífun; àwọn òṣìṣẹ́ kan ní àwọn ẹ̀yà tààrà nínú >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (pínpín nòmbá òdó)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (igbéga)

// Láfiwé
a == b    // #0    
a <> b    // #1    
a < b     // #0
a <= b    // #0   
a > b     // #1    
a >= b    // #1

// Ọgbọ́n
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Àwọn Òkún

```zymbol
// Àwọn ọ̀nà méjì ti ìṣọ̀kan
orúkọ = "Aliisi"
n = 42

>> "Kààbò " orúkọ " o ni " n ¶       // ìfí sí èbé — nínú >>
àlàyé = "Kààbò {orúkọ}, o ni {n}"   // ifísí — níbi eyikeyi
```

```zymbol
s = "Kààbò Aye"
igígùn = s$#                  // 9
abẹ́ = s$[1..4]                // "Kàà"  (ìpilò-1, ìpèkun nínú)
wà = s$? "Aye"                // #1
àwọn ìhà = "a,b,c,d"$/ ','  // [a, b, c, d]  (pinpin pẹ̀lú àlàyà)
rópò = s$~~["a":"o"]         // "Kòòbò Ayo"
rópò1 = s$~~["a":"o":1]      // "Kòòbò Aye" (N àkọ́kọ́ nikan)
```

> `+` jẹ́ fun àwọn nòmbá nikan. Fun àwọn òkún, lo `,`, ìfí sí èbé, tàbí ifísí.

---

---

## Ìṣàkóso Ìṣàn

```zymbol
x = 7

? x > 0 { >> "ọmọlúwàbí" ¶ }

? x > 100 {
    >> "tóbi" ¶
} _? x > 0 {
    >> "ọmọlúwàbí" ¶
} _? x == 0 {
    >> "odo" ¶
} _ {
    >> "ọ̀dọ̀" ¶
}
```

> Àwọn àmì ìhà `{ }` **jẹ́ díndá** páápáá fun ọ̀rọ̀ kan ṣoṣo.

---

---

## Ìbámu

```zymbol
// Àwọn àlà
ìdímú = 85
ìpele = ?? ìdímú {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> ìpele ¶      // → B

// Àwọn òkún
àwò = "púpà"
kọ́ọ̀dú = ?? àwò {
    "púpà"  : "#FF0000"
    "àwò éwé" : "#00FF00"
    _        : "#000000"
}

// Àwọn ìlanà láfiwé
ọra = -5
ìdúró = ?? ọra {
    < 0  : "yinyin"
    < 20 : "tùtù"
    < 35 : "gbéérún"
    _    : "gboná"
}
>> ìdúró ¶     // → yinyin

// Ọ̀nà ìlànà (àwọn bulọ́ọ̀ki)
?? n {
    0        : { >> "odo" ¶ }
    _? n < 0 : { >> "ọ̀dọ̀" ¶ }
    _        : { >> "ọmọlúwàbí" ¶ }
}
```

---

## Àwọn Ìyípò

```zymbol
@ i:0..4  { >> i " " }        // àlà ti ó nínú:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // pẹ̀lú ìgbésẹ̀:    1 3 5 7 9
@ i:5..0:1 { >> i " " }       // ìdàpò:          5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (nigbà ti)

àwọn èso = ["àpù", "péà", "èso àjàrà"]
@ e:àwọn èso { >> e ¶ }        // fun ohun kòòkan nínú ẹ̀kọ́

@ k:"kààbò" { >> k "-" }
>> ¶                          // → k-a-̀-à-b-o-̀-  (fun lẹ́tà kòòkan nínú òkún)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> tèsiwájú
    ? i > 7 { @! }            // @! bú
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Ìyípò aláìpin
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Ìyípò ti o ní àmì (bú ìkọra-ara)
onkà = 0
@:ìta {
    onkà++
    ? onkà >= 3 { @:ìta! }
}
>> onkà ¶                     // → 3
```

---

---

## Àwọn Ìṣé

```zymbol
fìkún(a, b) { <~ a + b }
>> fìkún(3, 4) ¶   // → 7

faktoriyali(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoriyali(n - 1)
}
>> faktoriyali(5) ¶    // → 120
```

Àwọn ìṣé ní **àyikà ìyàsọ̀tọ̀** — wọn kò lè ka àwọn oniyipada ìta. Lo àwọn paramita èèjò `ìṣèjè` `<~>` láti ṣàtúnṣe àwọn oniyipada olùpè:

```zymbol
pààrò(a<~, b<~) {
    ìgbàdíẹ̀ = a
    a = b
    b = ìgbàdíẹ̀
}
x = 10
y = 20
pààrò(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Àwọn ìṣé ti a sọ lorúkọ **jẹ́ àwọn iye ipele kíní** — fì ránṣẹ́ ní tààrà: `àwọn nòmbá$> ìlọ́po méjì`. `x -> fn(x)` tún wọ́.

---

---

## Lambda àti Àtiọ̀ràn

```zymbol
ìlọ́po méjì = x -> x * 2
fìkún = (a, b) -> a + b
>> ìlọ́po méjì(5) ¶   // → 10
>> fìkún(3, 7) ¶      // → 10

// Bulọ́ọ̀ki lambda
ìpín = x -> {
    ? x > 0 { <~ "ọmọlúwàbí" }
    _? x < 0 { <~ "ọ̀dọ̀" }
    <~ "odo"
}

// Àtiọ̀ràn — ó mú àyikà ìta
ohun ọ̀pọ̀ = 3
ìlọ́po mẹ́ta = x -> x * ohun ọ̀pọ̀
>> ìlọ́po mẹ́ta(7) ¶    // → 21

// Ìlé ìṣé
ṣẹ̀dá_àrópò(n) { <~ x -> x + n }
fìkún-ẹ̀wá = ṣẹ̀dá_àrópò(10)
>> fìkún-ẹ̀wá(5) ¶     // → 15

// Nínú ẹ̀kọ́
àwọn ìṣé = [x -> x+1, x -> x*2, x -> x*x]
>> àwọn ìṣé[3](5) ¶    // → 25
```

---

## Àwọn Ẹ̀kọ́

Àwọn ẹ̀kọ́ **lè yí padà** ati pé wọn ní àwọn ohun **ti irú kanna**.

```zymbol
ẹ̀kọ́ = [1, 2, 3, 4, 5]

ẹ̀kọ́[1]          // 1 — ìwádé (ìpilò-1: ohun àkọ́kọ́)
ẹ̀kọ́[-1]         // 5 — àmì òdì (ohun ìkẹyìn)
ẹ̀kọ́$#           // 5 — gígí (lo (ẹ̀kọ́$#) nínú >>)

ẹ̀kọ́ = ẹ̀kọ́$+ 6            // fìkún → [1,2,3,4,5,6]
ẹ̀kọ́2 = ẹ̀kọ́$+[2] 99       // físí sí ipò 2 (ìpilò-1)
ẹ̀kọ́3 = ẹ̀kọ́$- 3           // yọ ìfarahè àkọ́kọ́ ti iye
ẹ̀kọ́4 = ẹ̀kọ́$-- 3          // yọ gbogbo ìfarahè
ẹ̀kọ́5 = ẹ̀kọ́$-[1]          // yọ ní àmì 1 (ohun àkọ́kọ́)
ẹ̀kọ́6 = ẹ̀kọ́$-[2..3]       // yọ àlà (ìpilò-1, ìpèkun nínú)

wà = ẹ̀kọ́$? 3            // #1 — nínú
àwọn ipò = ẹ̀kọ́$?? 3     // [3] — gbogbo àwọn àmì ti iye (ìpilò-1)
ìgéré = ẹ̀kọ́$[1..3]      // [1,2,3] — ìgéré (ìpilò-1, ìpèkun nínú)
ìgéré2 = ẹ̀kọ́$[1:3]      // [1,2,3] — kanna, síntaksì ti o da lórí ìyè

ìgun = ẹ̀kọ́$^+          // tò ìgun (àwọn àkọ́bẹ̀rẹ̀ nikan)
ìsọ̀kalẹ̀ = ẹ̀kọ́$^-          // tò ìsọ̀kalẹ̀ (àwọn àkọ́bẹ̀rẹ̀ nikan)

// Àwọn ẹ̀kọ́ túpù ti o ni orúkọ/ipô — lo $^ pẹ̀lú lambda láfiwé
data = [(orúkọ: "Káálà", ọdún: 28), (orúkọ: "Ana", ọdún: 25), (orúkọ: "Bọbọ", ọdún: 30)]
nípa_ọdún   = data$^ (a, b -> a.ọdún < b.ọdún)     // ìgun nípa ọdún (<)
nípa_orúkọ   = data$^ (a, b -> a.orúkọ > b.orúkọ)   // ìsọ̀kalẹ̀ nípa orúkọ (>)
>> nípa_ọdún[1].orúkọ ¶    // → Ana
>> nípa_orúkọ[1].orúkọ ¶   // → Káálà

// Ìmúdojún ohun tààrà (àwọn ẹ̀kọ́ nikan)
ẹ̀kọ́[1] = 99              // àfífun
ẹ̀kọ́[2] += 5              // àkápò: +=  -=  *=  /=  %=  ^=

// Ìmúdojún ìṣé — ó padà ẹ̀kọ́ tuntun; àkọ́kọ́ kò yí padà
ẹ̀kọ́2 = ẹ̀kọ́[2]$~ 99
```

> Gbogbo àwọn òṣìṣẹ́ àkojọpò padà **ẹ̀kọ́ tuntun**. Fi fun láì: `ẹ̀kọ́ = ẹ̀kọ́$+ 4`.
> `$+` lè di ṣísopọ̀: `ẹ̀kọ́ = ẹ̀kọ́$+ 5$+ 6$+ 7`. Àwọn òṣìṣẹ́ mìírà lo àwọn àfífun àgbedemeji.
> **Àmì ìtọ́ka si ìpilò-1**: `ẹ̀kọ́[1]` ni ohun àkọ́kọ́; `ẹ̀kọ́[0]` jẹ́ aṣìṣe àkọ́ọ̀lé.

> `$^+` / `$^-` ń tò **àwọn ẹ̀kọ́ àkọ́bẹ̀rẹ̀** (àwọn nòmbá, àwọn òkún). Fun àwọn ẹ̀kọ́ túpù, lo $^ pẹ̀lú lambda láfiwé — ìtònisọ́ǹsì jẹ́ aìfìwé nínú lambda (`<` = ìgun, `>` = ìsọ̀kalẹ̀).

**Ìtúmọ iye** — fífun ẹ̀kọ́ sí oniyipada mìírà ń ṣẹ̀dá ẹ̀dà òminira:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b kò nípa
```

```zymbol
// Àwọn ẹ̀kọ́ ìkọra-ara (àmì ìtọ́ka si ìpilò-1)
mátírísí = [[1,2,3],[4,5,6],[7,8,9]]
>> mátírísí[2][3] ¶    // → 6  (ìlà 2, ìwé 3)
```

---

## Ìtúkàlẹ̀

```zymbol
// Ẹ̀kọ́
ẹ̀kọ́ = [10, 20, 30, 40, 50]
[a, b, c] = ẹ̀kọ́               // a=10  b=20  c=30
[àkọ́kọ́, *àyọ̀kù] = ẹ̀kọ́     // àkọ́kọ́=10  àyọ̀kù=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ ń fí silẹ̀

// Túpù ìpò
ojúami = (100, 200)
(px, py) = ojúami             // px=100  py=200

// Túpù ti a sọ lorúkọ
ènìyàn = (orúkọ: "Ana", ọdún: 25, ìlú: "Madrid")
(orúkọ: o, ọdún: ọd) = ènìyàn   // o="Ana"  ọd=25
```

---

## Àwọn Túpù

Àwọn túpù jẹ́ àwọn àpò ìtólẹ̀ **ti kò lè yí padà** ti o lè di àwọn iye **ti àwọn irú ọ̀tọ̀ọ̀tọ̀** mú.
Bí ìyàtọ̀ sí àwọn ẹ̀kọ́, àwọn ohun kò lè yí padà lẹ́yìn ìṣẹ̀dá.

```zymbol
// Nípò — àwọn irú àdarapọ̀ ti yọ̀ndà
ojúami = (10, 20)
>> ojúami[1] ¶     // → 10

data = (42, "kààbò", #1, 3.14)
>> data[3] ¶       // → #1

// Ti a sọ lorúkọ
ènìyàn = (orúkọ: "Aliisi", ọdún: 25)
>> ènìyàn.orúkọ ¶   // → Aliisi
>> ènìyàn[1] ¶      // → Aliisi  (àmì ìtọ́ka tún ń ṣiṣẹ́, ìpilò-1)

// Ìkọra-ara
ipò = (x: 10, y: 20)
p = (ipò: ipò, àmì: "ìpilẹ̀ṣẹ̀")
>> p.ipò.x ¶        // → 10
```

**Àìyípadà** — ìgbíyànjú èyè keyi lati ṣàtúnṣe ohun túpù jẹ́ aṣìṣe àkọ́ọ̀lé:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ aṣìṣe àkọ́ọ̀lé: àwọn túpù kò lè yí padà
// t[1] += 5    // ❌ aṣìṣe kanna

// Túpù ti a sọ lorúkọ — ṣe ìmọ̀lẹ̀ tún
ènìyàn = (orúkọ: "Aliisi", ọdún: 25)
tóbi = (orúkọ: ènìyàn.orúkọ, ọdún: 26)
>> ènìyàn.ọdún ¶    // → 25
>> tóbi.ọdún ¶       // → 26
```

Láti gba iye ti o ṣàtúnṣe, lo `$~` (ìmúdojún ìṣé) — ó padà túpù **tuntun**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← àkọ́kọ́ kò yí padà
>> t2 ¶    // → (10, 999, 30)
```

---

---

## Àwọn Ìṣé Ipele Gíga

```zymbol
àwọn nòmbá = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ìlọ́po-méjì = àwọn nòmbá$> (x -> x * 2)                // máàpù → [2,4,6…20]
àwọn ìbọ̀   = àwọn nòmbá$| (x -> x % 2 == 0)          // àlẹ̀yọ → [2,4,6,8,10]
àpapọ̀    = àwọn nòmbá$< (0, (ìṣùjò, x) -> ìṣùjò + x) // ìdínkù → 55

// Ìsopọ̀ nípa àwọn àgbedemeji
ìpele1 = àwọn nòmbá$| (x -> x > 3)
ìpele2 = ìpele1$> (x -> x * x)
>> ìpele2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Àwọn ìṣé ti a sọ lorúkọ lè fì ránṣẹ́ ní tààrà si àwọn ìṣé ipele gíga
ìlọ́po méjì(x) { <~ x * 2 }
ó tóbi(x) { <~ x > 5 }
r = àwọn nòmbá$> ìlọ́po méjì       // ✅ ìtókasí tààrà
r = àwọn nòmbá$| ó tóbi        // ✅ ìtókasí tààrà
```

---

---

## Òṣìṣẹ́ Àrò

Ọwọ́ ọ̀tún ń bèèrè `_` nígbà gbogbo bí aayè for ohun ti o wá ní àrò:

```zymbol
ìlọ́po méjì = x -> x * 2
fìkún = (a, b) -> a + b
fìkún-ọ̀kan = x -> x + 1

5 |> ìlọ́po méjì(_)        // → 10
10 |> fìkún(_, 5)         // → 15
5 |> fìkún(2, _)          // → 7

// Ìsopọ̀
r = 5 |> ìlọ́po méjì(_) |> fìkún-ọ̀kan(_) |> ìlọ́po méjì(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Ìmú Mú Aṣìṣe

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "pínpín pàtàpàtà pàtàpàtà" ¶
} :! {
    >> "aṣìṣe mìírà: " _err ¶    // _err ń di ìpè aṣìṣe mú
} :> {
    >> "ó ń ṣiṣẹ́ nígbà gbogbo" ¶
}
```

| Irú | Ìgbà |
|------|-------|
| `##Div` | Pínpín pàtàpàtà pàtàpàtà |
| `##IO` | Fáìlì / ètò |
| `##Index` | Àmì ìtọ́ka si ìta àlà |
| `##Type` | Aìbámu irú |
| `##Parse` | Àtúpalẹ̀ data |
| `##Network` | Àṣìṣe náẹ́tiwọ́ọ̀kì |
| `##_` | Àṣìṣe eyikeyi (mú gbogbo) |

---

---

## Àwọn Module

```zymbol
// lib/calc.zy — ara module wà láàrin àwọn àmì ìhà ìkọra-ara
# calc {
    #> { fìkún, get_PI }

    _PI := 3.14159
    fìkún(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // àmì àwarọ rẹ̀ jẹ́ díndá

>> c::fìkún(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶              // → 3.14159
```

```zymbol
// Fítádé pẹ̀lú orúkọ ìta mìírà
# ìkàwè_mi {
    #> { _fìkún_inú <= àpapọ̀ }

    _fìkún_inú(a, b) { <~ a + b }
}
```

```zymbol
<# ./ìkàwè_mi <= m

>> m::àpapọ̀(3, 4) ¶    // → 7  (orúkọ inú _fìkún_inú ti farasin)
```

> **Àwọn òfin module**: nínú `# orúkọ { }`, `#>`, àwọn àlàyé ìṣé, ati àwọn ìpilẹ̀ṣẹ̀ oniyipadà/iduróṣínṣin litáli nikan ni a yọ̀ndà. Àwọn lànà ti o lè mú ṣiṣẹ́ (`>>`, `<<`, ìyípò, bẹẹbẹẹ) ń fa aṣìṣe E013.

---

---

## Àwọn Ipo Nòmbá

Zymbol lè fi àwọn nòmbá hàn ní **àwọn bulọ́ọ̀ki àmì nòmbá Unicode 69** — Devanagari, Larubawa-India, Tailandi, Klingon pIqaD, Mathematical bold, àwọn apá LCD, ati ìyoku. Ipo ti o ń ṣiṣẹ́ ń kan àwùjò `>>` nikan; ìṣìrò inú jẹ́ alápà méjì nígbà gbogbo.

### Mú ìṣìlẹ̀ ṣiṣẹ́

Ko àmì nòmbá `0` ati `9` ti ìṣìlẹ̀ ète sí inú `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Larubawa-India (U+0660–U+0669)
#๐๙#    // Tailandi      (U+0E50–U+0E59)
#09#    // tún ṣeto si ASCII
```

---

### Àwùjò ati Boolian

```zymbol
x = 42
>> x ¶          // → 42   (ASCII àiyàfi)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (àmì èèjò ń jẹ́ ASCII nígbà gbogbo)
>> 1 + 2 ¶      // → ३

// Boolian: àmì ìṣájú # jẹ́ ASCII nígbà gbogbo, àmì nòmbá ń bára mú
>> #1 ¶         // → #१   (òtitó ní Devanagari)
>> #0 ¶         // → #०   (ìró — yàtọ̀ si ० nòmbá òdó)

x = 28 > 4
>> x ¶          // → #१   (àbájáde láfiwé ń tẹ̀lé ipo ti o ń ṣiṣẹ́)
```

---

## Àwọn litáli àmì nòmbá ìbílẹ̀ nínú kóọ̀dú orísun

Àmì nòmbá ìṣìlẹ̀ kankan ti o ni àtilyẹ́wo jẹ́ litáli tó wọ́ — nínú àwọn àlà, nínú modulo, nínú àwọn láfiwé:

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

### Àwọn litáli Boolian nínú ìṣìlẹ̀ eyikeyi

`#` + àmì nòmbá `0` tàbí `1` láti bulọ́ọ̀ki eyikeyi jẹ́ litáli Boolian tó wọ́:

```zymbol
#०९#
ṣiṣẹ = #१        // bakanna bi #1
>> ṣiṣẹ ¶         // → #१
>> (#१ && #०) ¶   // → #०
```

> `#` **jẹ́ ASCII nígbà gbogbo**. `#0` (ìró) nígbà gbogbo yàtọ̀ ní ojú si `0` (nòmbá òdó) nínú ìṣìlẹ̀ kọ̀ọ̀kan.

---

---

## Àwọn Òṣìṣẹ́ Data

```zymbol
// Ìyípadà irú
##.42         // → 42.0  (si Lilefòfò)
###3.7        // → 4     (si Nòmbá òdó, yípò)
##!3.7        // → 3     (si Nòmbá òdó, ìgégé)

// Ṣìṣàtúpalẹ̀ òkún si nòmbá
v1 = #|"42"|      // → 42  (Nòmbá òdó)
v2 = #|"3.14"|    // → 3.14  (Lilefòfò)
v3 = #|"abc"|     // → "abc"  (ailewu, kò sí aṣìṣe)

// Yípò / ìgégé
pi = 3.14159265
yípò2 = #.2|pi|     // → 3.14  (yípò si àwọn ipò èèjò 2)
yípò4 = #.4|pi|     // → 3.1416
ìgégé2 = #!2|pi|    // → 3.14  (ìgégé)

// Ọ̀nà ìṣeto nòmbá
ọ̀nà = #,|1234567|   // → 1,234,567  (ti a ya sí ọ̀tọ̀ nípa àmì àáyè)
ìmọ̀ = #^|12345.678| // → 1.2345678e4  (ìmọ̀)

// Àwọn litáli ìpilò
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (alápà méjì)
c = 0o101        // → 'A'  (ókùta)

// Àwùjò ìyípadà ìpilò
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

---

## Ìfìkarà Shell

```zymbol
ọjọ́ = <\ date +%Y-%m-%d \>     // ń mu stdout (nínú \n ní ìkẹyìn)
>> "Lónìí: " ọjọ́

fáìlì = "data.txt"
ohun inú = <\ cat {fáìlì} \>     // ifísí nínú àwọn pàṣẹ

àwùjò = </"./subscript.zy"/>   // ṣiṣẹ́ ìwé Zymbol mìírà, mu àwùjò
>> àwùjò
```

> `><` ń mu àwọn aríyànjì CLI gégé bi ẹ̀kọ́ òkún (mọ ni ẹni ti o ń rìn igi nikan).

---

---

## Àpérè Ìkikun: FizzBuzz

```zymbol
ìpín(nòmbá) {
    ? nòmbá % 15 == 0 { <~ "FizzBuzz" }
    _? nòmbá % 3  == 0 { <~ "Fizz" }
    _? nòmbá % 5  == 0 { <~ "Buzz" }
    _ { <~ nòmbá }
}

@ i:1..20 { >> ìpín(i) ¶ }
```

---

## Ìtókasí Àmì

| Àmì | Ìṣé | Àmì | Ìṣé |
|------|------|------|------|
| `=` | oniyipada | `$#` | gígí |
| `:=` | iduróṣínṣin | `$+` | fìkún (lè ṣọpọ̀) |
| `>>` | àwùjò | `$+[i]` | físí ní àmì ìtọ́ka àtọ̀ (ìpilò-1) |
| `<<` | ìgbáwọlé | `$-` | yọ àkọ́kọ́ nípa iye |
| `¶` / `\\` | ìlà tuntun | `$--` | yọ gbogbo nípa iye |
| `?` | bí | `$-[i]` | yọ ní àmì ìtọ́ka (ìpilò-1) |
| `_?` | bí kò ṣe bí | `$-[i..j]` | yọ àlà (ìpilò-1) |
| `_` | bí kò ṣe / ìgbà gbogbo | `$?` | nínú |
| `??` | ìbámu | `$??` | wá gbogbo àwọn àmì ìtọ́ka (ìpilò-1) |
| `@` | ìyípò | `$[s..e]` | ìgéré (ìpilò-1) |
| `@ N { }` | ìyípò ìyè N | `$>` | máàpù |
| `@!` | bú | `$|` | àlẹ̀yọ |
| `@>` | tèsiwájú | `$<` | ìdínkù |
| `@:orúkọ { }` | ìyípò ti o ní àmì | `$/ àlàyà` | pínpín òkún |
| `@:orúkọ!` | bú ti o ní àmì | `$++ a b c` | ì̀ṣọ́pọ̀ ìkọ́lé |
| `@:orúkọ>` | tèsiwájú ti o ní àmì | `ẹ̀kọ́[i>j>k]` | àmì ìtọ́ka ìlàrìn |
| `->` | lambda | `ẹ̀kọ́[i] = iye` | ṣàtúnṣe ohun (àwọn ẹ̀kọ́ nikan) |
| `ẹ̀kọ́[i] += iye` | ìmúdojún ìṣọ̀kan | `ẹ̀kọ́[i]$~` | ìmúdojún ìṣé (ẹ̀dà tuntun) |
| `$^+` | tò ìgun (àkọ́bẹ̀rẹ̀) | `$^-` | tò ìsọ̀kalẹ̀ (àkọ́bẹ̀rẹ̀) |
| `$^` | tò pẹ̀lú àfìwé (àwọn túpù) | `<~` | padà |
| `|>` | àrò | `!?` | gbíyànjú |
| `:!` | mú | `:>` | níkẹyìn |
| `#1` | òtitó | `#0` | ìró |
| `$!` | jẹ́ aṣìṣe | `$!!` | tánká aṣìṣe |
| `<#` | gbe wọlé | `#>` | fítádé |
| `#` | ṣe àlàyé module | `::` | pe module |
| `.` | ìwádé aaye | `#?` | ìtọ́kasí ìjẹ́ irú |
| `#\|..\|` | ṣàtúpalẹ̀ nòmbá | `##.` | yí padà si Lilefòfò |
| `###` | yí padà si Nòmbá òdó (yípò) | `##!` | yí padà si Nòmbá òdó (ìgégé) |
| `#.N\|..\|` | yípò | `#!N\|..\|` | ìgégé |
| `#,\|..\|` | ọ̀nà àmì àáyè | `#^\|..\|` | ìmọ̀ |
| `#d0d9#` | yí ipo nòmbá padà | `#09#` | tún ṣeto si ASCII |
| `<\ ..\>` | ṣiṣẹ́ shell | `>\<` | àwọn aríyànjì CLI |
| `\ var` | pa oniyipada run tú | | |

---

---

## Àkọọ́lẹ́ Àwọn Ìyípadà ìtújade

### v0.0.4 — Ìtọ́ka si Ìpilò-1, Àwọn Ìṣé Ipele Kíní & Àwọn Bulọ́ọ̀ki Module _(Kẹsán 2026)_

- **Bú** Gbogbo àmì ìtọ́ka si ni a yí padà si **ìpilò-1** — `ẹ̀kọ́[1]` ni ohun àkọ́kọ́; `ẹ̀kọ́[0]` jẹ́ aṣìṣe àkọ́ọ̀lé
- **Fìkún** Àwọn ìṣé ti a sọ lorúkọ **jẹ́ àwọn iye ipele kíní** — fì ránṣẹ́ ní tààrà si àwọn ìṣé ipele gíga: `àwọn nòmbá$> ìlọ́po méjì`
- **Fìkún** **Síntaksì bulọ́ọ̀ki** module jẹ́ díndá — `# orúkọ { ... }` — síntaksì ìpẹ̀tẹ́ ni a yóọ̀
- **Fìkún** Ìtọ́ka si ìwọ̀n púpọ̀: `ẹ̀kọ́[i>j>k]` (ìlàrìn), `ẹ̀kọ́[p ; q]` (ìfádá ìpẹ̀tẹ́)
- **Fìkún** Ìyípadà irú: `##.ọ̀rọ̀` (Lilefòfò), `###ọ̀rọ̀` (Nòmbá òdó yípò), `##!ọ̀rọ̀` (Nòmbá òdó ìgégé)
- **Fìkún** Pínpín òkún: `òkún$/ àlàyà` — ó padà `Array(Òkún)`
- **Fìkún** Ì̀ṣọ́pọ̀ ìkọ́lé: `ìpilò$++ a b c` — ó fi kún àwọn ohun púpọ̀
- **Fìkún** Ìyípò àwọn N ìyè: `@ N { }` — tún ṣe ní kàkà N nígbà
- **Fìkún** Síntaksì àwọn ìyípò ti o ní àmì: `@:orúkọ { }`, `@:orúkọ!`, `@:orúkọ>` — rópò `@ @orúkọ` / `@! orúkọ`
- **Fìkún** Àwọn òfin àyìkà oniyipada: àwọn oniyipada `_orúkọ` ní àyikà bulọ́ọ̀ki ti o pèye; `\ var` pa ní kutukutu
- **Fìkún** Àwọn ìlanà láfiwé ìbámu: `< 0 :`, `> 5 :`, `== 42 :`, bẹẹbẹẹ
- **Fìkún** Aṣìṣe module E013: àwọn ìlànà ti o lè mú ṣiṣẹ́ nínú ara module ti fàṣẹ̀
- **Ṣàtúnṣe** `take_variable` kò bá àwọn iduróṣínṣin module jé mó nigbà ti o ń ṣìwé sẹ́yìn
- **Ṣàtúnṣe** `alias.CONST` nígbà yíi ń yàn ní ìtàn; `#>` lè fi ara hàn lẹ́yìn àwọn àlàyé ìṣé
- **VM** Ìgbá pipe: 393/393 àwọn ìdánwò koja

### v0.0.3 — Àwọn Ètò Nòmbá Unicode & Àwọn Ìmúdara LSP _(Kẹsán 2026)_

- **Fìkún** Àwọn bulọ́ọ̀ki àmì nòmbá 69 pẹ̀lú àmì yípadà ipo `#d0d9#`
- **Fìkún** Àwọn litáli Boolian nínú ìṣìlẹ̀ eyikeyi — `#१` / `#०`, `#१` / `#०`, bẹẹbẹẹ
- **Fìkún** Àwọn àmì nòmbá Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Fìkún** `SetNumeralMode` opcode VM — ìgbá pipe pẹ̀lú ẹni ti ń rìn igi
- **Fìkún** REPL ń bòwò fun ipo nòmbá ti o ń ṣiṣẹ́ ní ìwòn-ọ̀rọ̀ ati ìfihàn oniyipada
- **Yí padà** Àwùjò Boolian `>>` nígbà yíi ní àmì ìṣájú `#` (`#0` / `#1`) ní gbogbo àwọn ipo

### v0.0.2_01 — Àtúnlórúkọ Òṣìṣẹ́ _(30 Òkùdu 2026)_

- **Yí padà** `c|..|` → `#,|..|` ati `e|..|` → `#^|..|` — ìbámu pẹ̀lú ìlà àwọn àmì ìṣájú ọ̀nà `#`
- **Fìkún** Àmì àwarọ fitádé — ṣe fítádé àwọn ọmọ ẹgbẹ module lábí orúkọ mìírà

### v0.0.2 — Àtúntò API Àkojọpò & Àwọn àtùnfi sí _(24 Òkùdu 2026)_

- **Fìkún** Ìlà òṣìṣẹ́ `$` ìṣọ̀kan fún àwọn ẹ̀kọ́ ati òkún (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Fìkún** Àfífun ìtúkàlẹ̀ fún àwọn ẹ̀kọ́, àwọn túpù, ati àwọn túpù ti a sọ lorúkọ
- **Fìkún** Àwọn àmì ìtọ́ka òdì (`ẹ̀kọ́[-1]` = ohun ìkẹyìn)
- **Fìkún** Àwọn àtùnfi sí ìbílẹ̀ — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Òkùdu 2026)_

- **Fìkún** Àfífun ìṣọ̀kan `^=`
- **Ṣàtúnṣe** Àwọn ìgbànúla ìṣìrò atúpalẹ̀; àwọn àtúnṣìwé ìwé ìmọ̀

### v0.0.1 — Ìtújade Àkókó fẹ̀nùkán _(22 Òkùdu 2026)_

- Atúpalẹ̀ ẹni ti ń rìn igi + VM ìkọ-sílẹ̀ (`--vm`, ~4× yára, ~95% ìgbá)
- Gbogbo àwọn ìkọ́lé àríku: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Àwọn ìdámú Unicode ní ìkikun, ètò module, àwọn lambda, àtiọ̀ràn, ìmú mú aṣìṣe
- REPL, LSP, Àtèlé VS Code, ọ̀nà ìṣeto (`zymbol fmt`)

---

_Zymbol-Lang — Àmì. Ìkákẹ̀. Ti kò lè yí padà._
