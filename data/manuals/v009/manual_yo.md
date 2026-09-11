> **Ìkìlọ̀:** A ṣẹ̀dá àti túmọ̀ ìwé yìí nípasẹ̀ ọgbọ́n àtọwọ́dá (AI).
>
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
>
> Ìtọ́kasí pàtàkì ni **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** nínú àpò ìtumọ̀.

---

# Ìwé Ìtọ́sọ́nà Zymbol-Lang

> **A ṣàtúnyẹ̀wò fún v0.0.9 — 2026-09-07**

**Zymbol-Lang** jẹ́ èdè ìṣèlú àmì. Kò sí ọ̀rọ̀ nínú gírámà rẹ̀ — gbogbo ìkọ́ ni àmì kan. Ó ń ṣiṣẹ́ bákan náà ní èdè ènìyàn èyíkéyìí.

- Kò sí `if`, `while`, `return` — kìkì `?`, `@`, `<~`
- Unicode kíkún — àwọn ìdánimọ̀ ní èdè èyíkéyìí tàbí emoji
- Kò gbára lé èdè ènìyàn — kóòdù jẹ́ ohun kan náà níbi gbogbo

**Ẹ̀yà ìtumọ̀**: v0.0.9 | **Ìdánwò ìbòòlù**: 660/666 (ẹ̀rọ mẹ́ta gbà, 0 yàtọ̀)

---

## Àwọn Ayípadà àti Àwọn Ìdúró

```zymbol
ayipada = 10              // ayípadà tí ó lè yípadà
PI := 3.14159       // ìdúró — ìfiránṣẹ́ padà jẹ́ àṣìṣe àkókò ìṣiṣẹ́
oruko = "Ade"
ṣiṣẹ = #1           // boolean òtítọ́
👋 := "Ẹ kú àárọ̀"
```

```zymbol
ayipada = 10    // 10
ayipada += 5    // 15
ayipada -= 3    // 12
ayipada *= 2    // 24
ayipada /= 3    // 8
ayipada %= 3    // 2
ayipada ^= 2    // 4
ayipada++       // 5
ayipada--       // 4
```

`°` (àmì ìwọ̀n, U+00B0) máa ń bẹ̀rẹ̀ ayípadà ní ìmúṣẹ́ pẹ̀lú iye àárín rẹ̀ ní ìlò àkọ́kọ́:

```zymbol
awon_nọ́mbà = [3, 1, 4, 1, 5]
@ n:awon_nọ́mbà {
    °àpapọ̀ += n
}
>> àpapọ̀ ¶              // → 14
```

> `°ayipada` (àkọ́sọ́nà) ń so mọ́ orí ìsopọ̀ — àbájáde lè kà lẹ́yìn `@`.
> `ayipada°` (àfìkún) ń so mọ́ inú ìsopọ̀ — ó kú nígbà tí ìsopọ̀ bá parí.

Ìsọ̀rọ̀ tí ó jẹ́ orúkọ nìkan yóò ka ayípadà kí ó sì sọ iye náà nù, nítorí náà ó ṣe ìkìlọ̀:

```zymbol
iṣiro = 5
iṣiro
```

Olùkọ́pọ̀ ṣe ìkìlọ̀ báyìí (àwọn ìṣẹ́ rẹ̀ jẹ́ Gẹ̀ẹ́sì nígbà gbogbo):

```text
warning: this statement does nothing: 'iṣiro' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

Ìtumọ̀: *«ìsọ̀rọ̀ yìí kò ṣe ohunkóhun: 'iṣiro' ni a kà kí a sì sọ nù»*.

---

## Àwọn Irúfẹ́ Dátà

| Irúfẹ́ | Ìkọ̀wé | Àmì `#?` | Àkíyèsí |
|------|---------|----------|---------|
| Òdìdì | `42`, `-7` | `###` | Òdìdì ààbò: ±(2⁵³ − 1) |
| Ìpín | `3.14`, `1.5e10` | `##.` | IEEE-754 ìlọ́po méjì |
| Ọ̀rọ̀ | `"ìwé"` | `##"` | Ìfiwọlé: `"Ẹ kú {oruko}"` |
| Lẹ́tà | `'A'` | `##'` | Kóòdù kókó Unicode kan |
| Boolean | `#1`, `#0` | `##?` | Kì í ṣe iye — `#1 ≠ 1` |
| Àkójọ | `[1, 2, 3]` | `##]` | Irúfẹ́ kan, a ti yẹ̀wò |
| Àdàpọ̀ tí a sọ | `#[1, "méjì"]` | `##[` | Irúfẹ́ kan náà bí `[…]`, a kò yẹ̀wò |
| Túpù | `(a, b)` | `##)` | Ipò, kò lè yípadà |
| Ìwé ìtumọ̀ | `#(x: 1, y: 2)` | `##(` | Pẹ̀lú kọ́kọ́rọ́, ó lè yípadà |
| Iṣẹ́ | ìtọ́kasí iṣẹ́ orúkọ | `##()` | Kíláàsì kìíní; fi hàn `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Kíláàsì kìíní; fi hàn `<lambd/N>` |
| Ẹyọ | `##_` | `##_` | Àìsí — kò sí null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(x: 1)#? ¶          // → (##(, 1, #(x: 1))
```

Òdìdì tí ó jáde kúrò ní ibi ààbò jẹ́ àṣìṣe tí a lè mú, kì í ṣe àgbéléwọ̀ ní ìdákẹ́jẹ́:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "ó jáde kúrò ní ibi" ¶ // → ó jáde kúrò ní ibi
}
```

`##_` ni ọ̀nà tí ètò ń fi béèrè bóyá ohun kan kò sí:

```zymbol
kò_sí_nkankan() { }
iye = kò_sí_nkankan()
>> (iye == ##_) ¶     // → #1
```

---

## Ìjáde àti Ìwọlé

```zymbol
oruko = "Ade"
àpapọ̀ = 3
>> "Ẹ kú àárọ̀" ¶             // → Ẹ kú àárọ̀
>> "a=" oruko " b=" àpapọ̀ ¶ // → a=Ade b=3
>> àpapọ̀#? ¶            // → (###, 1, 3)
```

```zymbol
<< oruko
<< "Kọ orúkọ rẹ: " oruko
<< ###(4) "Ọjọ́ orí: " ọjọ́_orí
```

**Wo ìrísí àmì méjì náà.** `>>` ń tọ́ka síta: ó ń gbé dátà jáde kúrò nínú ètò. `<<` ń tọ́ka sínú: ó ń gbé dátà wọlé sínú ètò. Kò sí ohun tí a lè há sínú ìrántí níbí — ọfà fi hàn ibi tí ìsọfúnni ń lọ, àti èròǹgbà kan náà yóò padà wá nínú gbogbo àmì tí ó bá ń gbé ohun kan.

> `¶` àti `\\` jẹ́ ìlà tuntun tí ó dọ́gba. `>>` kì í fi ọ̀kan kún.
> Ohun ìdánimọ̀ irúfẹ́ ṣáájú ìbéèrè ń ṣàyẹ̀wò nígbà kíkà, ó sì ń béèrè lẹ́ẹ̀kan si títí iye yóò fi tọ́:
> `##.` Ìpín · `##.(T,D)` ìpín · `###(N)` Òdìdì · `##"(N)"` ìwé · `##'` Lẹ́tà kan.

Ní ipele gíga ti fáìlì, `<~>` ni ipò ìjáde ètò:

```zymbol
>> "ń ṣàyẹ̀wò" ¶      // → ń ṣàyẹ̀wò
<~ 0
```

---

## Àwọn Ẹ̀yà TUI

Àwọn òṣìṣẹ́ ìfojúkojú terminal fún àwọn ètò ìbáraẹnisọ̀rọ̀. Ọ̀pọ̀ jẹ́ nílò blọ́ọ̀kì `>>| { }` (ojú-ìwé mìíràn + ipò àìbójú).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Ń ṣiṣẹ́"
    @~ 1000
    >>~ (2, 1) > "Ó ti parí."
}
```

```zymbol
>>| {
    [ìlà, ọ̀wọ̀n] = >>?
    >>~ (1, 1) > "Terminal: " ìlà " x " ọ̀wọ̀n
    <<| bọ́tìnì
    >>~ (2, 1) > "A tẹ̀: " bọ́tìnì
}
```

Níbí ni ìwọ yóò ti rí ìdí tí àwọn àmì fi ń darapọ̀ dípò ìlọ́po. Ìwọ ti mọ̀ tẹ́lẹ̀ pé `<<` ni ìwọlé àti `?` ń béèrè láìdábọ̀. Àmì kan ṣoṣo ni ó tuntun:

- `|` jẹ́ **ìṣọ̀kan kan**, kì í ṣe gbogbo ìṣàn.

Pẹ̀lú ìyẹn, àwọn òṣìṣẹ́ bọ́tìnì méjèèjì ń kà ara wọn:

```text
<<        |             ?
ìwọlé     ìṣọ̀kan kan    láìdábọ̀

<<|   mú bọ́tìnì KAN, kí o sì dúró títí kan yóò fi dé
<<|?  wò bóyá bọ́tìnì wà, kí o sì tẹ̀síwájú bí kò bá sí
```

Bákan náà ní ẹ̀gbẹ́ kejì: `>>` ń fi ránṣẹ́, `>>!` ń fi ránṣẹ́ **pẹ̀lú agbára** (ó ń pa gbogbo ojú-ìwé rẹ́), nígbà tí `>>?` ń **béèrè** dípò kíkọ (báwo ni terminal ṣe tóbi). Àmì tí ó wà ní ọ̀tún ni ó ń yí ipò padà, ó sì ń wá ní ìparí nígbà gbogbo.

> `>>!` ń pa ojú-ìwé rẹ́. `>>?` ń dá `[ìlà, ọ̀wọ̀n]` padà. `@~ N` ń sùn N millisecond.
> `<<|` ń ka ìtẹ̀ bọ́tìnì kan (ìdínà); `<<|?` ń ṣàyẹ̀wò láìdínà (`'\0'` bí kò bá sí).
> Àwọn bọ́tìnì ọfà ń dé bí `'↑' '↓' '←' '→'`; ESC ni kóòdù kókó 27.
> Túpù ìjáde ipò: `(ìlà, ọ̀wọ̀n, BKS, iwájú, ẹ̀yìn)` — a lè fi kọ́mà pa ẹ̀ka èyíkéyìí (`>>~ (,,, 196) > "pupa"`).
> BKS bítì-máàsìkì: `1`=Nípọn, `2`=Yíyọ, `4`=Ìlà-ìsàlẹ̀. ANSI 256-palẹ́tì àwọ̀ (`0`=àìlóhùnwá terminal).

---

## Àwọn Òṣìṣẹ́

```zymbol
a = 10
b = 3
ès1 = a + b    // 13
ès2 = a - b    // 7
ès3 = a * b    // 30
ès4 = a / b    // 3  (ìpín òdìdì)
ès5 = a % b    // 1
ès6 = a ^ b    // 1000
```

```zymbol
a = 10
b = 3
àfiwé1 = a == b    // #0
àfiwé2 = a <> b    // #1
àfiwé3 = a < b     // #0
àfiwé4 = a >= b    // #1
ìmọ̀1 = #1 && #0  // #0
ìmọ̀2 = !#1       // #0
```

> `==` kì í fipá mú: `"5" == 5` jẹ́ `#0`. Ìtòlẹ́sẹẹsẹ ń fipá mú: `"5" > 4` jẹ́ `#1`, àti `"४२" > 5` pẹ̀lú — ọ̀rọ̀ òdìdì ní èyíkéyìí nínú àwọn ìkọ̀wé 69 ń ṣe àfiwé bí òdìdì.
> Iṣẹ́ kan jẹ́ dọ́gba pẹ̀lú ara rẹ̀ nìkan, kì í ṣe dọ́gba pẹ̀lú iṣẹ́ mìíràn tí ó ní ara kan náà.

---

## Àwọn Ọ̀rọ̀

```zymbol
oruko = "Ade"
n = 42
>> "Ẹ kú àárọ̀ " oruko " o ní " n ¶ // → Ẹ kú àárọ̀ Ade o ní 42
àpèjúwe = "Ẹ kú àárọ̀ {oruko}, o ní {n}"
>> àpèjúwe ¶              // → Ẹ kú àárọ̀ Ade, o ní 42
```

```zymbol
s = "Ẹ kú ayé"
gigun = s$#                  // 8
ìpín = s$[1..4]             // "Ẹ kú"
ní = s$? "ayé"          // #1
àwọn_ìpín = "a,b,c,d"$/ ','    // [a, b, c, d]
ìyípadà = s$~~["ẹ":"e"]        // "Ẹ kú ayé"
ìlà = "─" $* 20
```

> `+` wà fún àwọn òdìdì nìkan. Fún àwọn ọ̀rọ̀ lo ìgbékalẹ̀ tàbí ìfiwọlé.
> `\{` àti `\}` jẹ́ àkójọ ìkọ̀wé gidi — ìfàsẹ́yìn jẹ́ alábàámù.

---

## Ìṣàkóso Ìṣàn

```zymbol
a = 7
? a > 100 {
    >> "ńlá" ¶
} _? a > 0 {
    >> "ìdánilójú" ¶     // → ìdánilójú
} _ {
    >> "àìdánilójú" ¶
}
```

Níbí àmì tuntun méjì wà, àti ẹ̀kẹta tí ó wá láti ìsopọ̀ wọn:

- `?` ni **bíbéèrè**: ó ń ṣí ipò.
- `_` ni **ohun tí a kò sọ**: ẹ̀ka tí ó kù nígbà tí kò sí ìbéèrè tí ó báramu.
- `_?` ni àwọn méjèèjì lẹ́sẹẹsẹ: *bí kò bá sí ohun tí ó báramu, béèrè lẹ́ẹ̀kan si*.

Ìdí nìyí tí `_?` fi jẹ́ kíkọ báyìí. Kì í ṣe àmì tuntun láti kọ́ — `_` ni ó tẹ̀lé `?`, ó sì ń túmọ̀ sí ohun tí àwọn ẹ̀ka rẹ̀ méjèèjì ń túmọ̀ sí, ní kíkà lẹ́sẹẹsẹ.

> Àkójọ `{ }` jẹ́ **dandan** kódà fún ìsọ̀rọ̀ kan.

---

## Ìbáramu

```zymbol
ìdíyelé = 85
ìpele = ?? ìdíyelé {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> ìpele ¶              // → B
```

```zymbol
ìgbóná = -5
ipò = ?? ìgbóná {
    < 0  => "yìnyín"
    < 20 => "tútù"
    _    => "gbígbóná"
}
>> ipò ¶              // → yìnyín
```

Ìwọ ti mọ̀ tẹ́lẹ̀ pé `?` ni "bíbéèrè". **`??` ni bíbéèrè lọ́pọ̀ ìgbà**: ìlọ́po àmì kan, níbi èyíkéyìí nínú èdè, ni ṣíṣe ohun tí àmì ń ṣe lẹ́ẹ̀kan lọ́pọ̀ ìgbà. `?` kan ń dán ipò kan wò; `??` ń dán àkójọ àwọn ìṣẹ̀lẹ̀ wò.

Àwọn ààyò ń darapọ̀ pẹ̀lú `||`, wọ́n sì lè da àwọn irúfẹ́ àwòrán pọ̀:

```zymbol
bọ́tìnì = 'P'
ìgbésẹ̀ = ?? bọ́tìnì {
    'p' || 'P' => "dúró"
    < 0 || > 100 => "jáde kúrò ní ibi"
    _ => "a kò kà á"
}
>> ìgbésẹ̀ ¶             // → dúró
```

---

## Àwọn Ìsopọ̀

```zymbol
@ i:1..4  { >> i " " }
>> ¶                    // → 1 2 3 4
@ i:1..9:2 { >> i " " }
>> ¶                    // → 1 3 5 7 9
@ i:5..1:1 { >> i " " }
>> ¶                    // → 5 4 3 2 1
```

```zymbol
n = 1
@ n <= 64 { n *= 2 }
>> n ¶                  // → 128
```

```zymbol
èso = ["èso_pípọ́n", "píà", "èso àjàrà"]
@ è:èso { >> è " " }
>> ¶                    // → èso_pípọ́n píà èso àjàrà
@ l:"Ẹ kú àárọ̀" { >> l "-" }
>> ¶                    // → Ẹ- -k-ú- -à-á-r-ọ-̀-
```

```zymbol
@ i:1..10 {
    ? i % 2 == 0 { @> }
    ? i > 7 { @! }
    >> i " "
}
>> ¶                    // → 1 3 5 7
```

```zymbol
iṣiro = 0
@:ìta {
    iṣiro++
    ? iṣiro >= 3 { @:ìta! }
}
>> iṣiro ¶             // → 3
```

`@` ni àmì **àkókò**: ohun gbogbo tí ó ń tún ṣe ń gbé inú rẹ̀. Láti gé àkókò yẹn kúrú ìwọ yóò fi àmì kún ẹ̀gbẹ́ rẹ̀:

- `@!` — `!` ni **agbára**: jáde kúrò nínú ìsopọ̀ báyìí.
- `@>` — `>` ń tì síwájú: lọ sí ìyí tí ó tẹ̀lé.
- `@:ìta!` — `:` **ń so orúkọ**, nítorí náà èyí ń gé ìsopọ̀ tí a *pè* ìta, kì í ṣe èyí tí ó súnmọ́ jù.

Òṣìṣẹ́ mẹ́ta, kò sì sí èyí tí a ní láti há sínú ìrántí lọ́tọ̀ọ̀tọ̀: `@` pẹ̀lú àmì tí ó ti sọ ohun tí ó ń ṣe.

> **Olùpinnu jẹ́ ìṣirò tàbí ipò.** `Òdìdì` jẹ́ ìṣirò, a ń ṣàyẹ̀wò rẹ̀ lẹ́ẹ̀kan — `@ 0` ń ṣiṣẹ́ ara rẹ̀ ní ọ̀fẹ́. Ohun mìíràn ni ipò. Kò sí òtítọ́: `@ []` àti `@ 3.5` ni a kọ̀. Láti rìn káàkiri àkójọ lo `@ x:àwọn_ohun`; láti kà á, `@ àwọn_ohun$#`.

---

## Àwọn Iṣẹ́

```zymbol
àfikún(a, b) { <~ a + b }
>> àfikún(3, 4) ¶        // → 7
```

```zymbol
ìlọ́po(n) {
    ? n <= 1 { <~ 1 }
    <~ n * ìlọ́po(n - 1)
}
>> ìlọ́po(5) ¶       // → 120
```

Iṣẹ́ kan ń ka àwọn ayípadà fáìlì nípasẹ̀ iye, kíkọ sínú yóò sì wà nínú:

```zymbol
ààlà = 100
nínú(n) { <~ n < ààlà }
>> nínú(42) ¶         // → #1
```

Àmì méjì ń yí èyí padà, àwọn méjèèjì ni a kọ **nínú ìbuwọ́lù àti ní ibi ìpè**:

```zymbol
ṣàfikún(iṣiro<~) { iṣiro = iṣiro + 1 }
àpapọ̀ = 0
ṣàfikún(àpapọ̀<~)
>> àpapọ̀ ¶              // → 1
```

> `p~` jẹ́ ẹ̀dà iṣẹ́ — ara rẹ̀ lè tún ṣètò rẹ̀, olùpè kò sì ní ìfarapa.
> `p<~` jẹ́ èròjà ìjáde — ìyípadà ń padà. `ṣàfikún(àpapọ̀)` láìsí àmì jẹ́ àṣìṣe ìtumọ̀: àkọsílẹ̀ àti ìbuwọ́lù kò lè pínyà.

---

## Àwọn Lambda àti Ìdìde

```zymbol
ìlọ́po_meji = x -> x * 2
àpapọ̀ = (a, b) -> a + b
>> ìlọ́po_meji(5) ¶          // → 10
>> àpapọ̀(3, 7) ¶          // → 10
```

```zymbol
ìpínpín = x -> {
    ? x > 0 { <~ "ìdánilójú" }
    _? x < 0 { <~ "àìdánilójú" }
    <~ "òdo"
}
>> ìpínpín(-4) ¶         // → àìdánilójú
```

```zymbol
ìdíwọ̀n = 3
ìlọ́po_mẹ́ta = x -> x * ìdíwọ̀n
>> ìlọ́po_mẹ́ta(7) ¶          // → 21
```

```zymbol
ṣẹ̀dá_àfikún(n) { <~ x -> x + n }
àfikún10 = ṣẹ̀dá_àfikún(10)
>> àfikún10(5) ¶           // → 15
```

Lambda kan lè má gba èròjà kankan rárá:

```zymbol
ìdáhùn = () -> 42
>> ìdáhùn() ¶           // → 42
```

> Lambda kan ń mú àwọn ayípadà fáìlì **nígbà tí a ṣẹ̀dá rẹ̀**; iṣẹ́ orúkọ ń kà wọ́n **nígbà tí a pè é**.

---

## Àwọn Àkójọ

```zymbol
àkójọ = [1, 2, 3, 4, 5]
>> àkójọ[1] ¶       // → 1   ìtọ́kasí 1-ìpìlẹ̀
>> àkójọ[-1] ¶      // → 5   ìdínwọ̀n ń kà láti ìparí
>> àkójọ$# ¶        // → 5   gígùn
```

```zymbol
àkójọ = [1, 2, 3]
>> (àkójọ$+ 6) ¶          // → [1, 2, 3, 6]   fi kún
>> (àkójọ$+[2] 99) ¶      // → [1, 99, 2, 3]  fi sínú ní ipò 2
>> (àkójọ$- 3) ¶          // → [1, 2]         yọ ìṣẹ̀lẹ̀ àkọ́kọ́ kúrò
>> (àkójọ$-[1]) ¶         // → [2, 3]         yọ ní ìtọ́kasí 1
>> (àkójọ$[1..2]) ¶       // → [1, 2]         ìpín, àwọn ìparí méjèèjì wà
>> (àkójọ$? 3) ¶          // → #1             ó ní
```

Gbogbo wọn bẹ̀rẹ̀ pẹ̀lú `$`, àmì **àkójọ**, wọ́n sì ń tẹ̀síwájú pẹ̀lú àmì tí ó sọ ohun tí a ń ṣe nínú rẹ̀: `#` mélòó, `+` fi kún, `-` yọ kúrò, `?` béèrè bóyá ó wà. Àti bíi `??`, ìlọ́po àmì túmọ̀ sí ṣíṣe rẹ̀ ní kíkún: `$?` ń béèrè *bóyá* iye kan wà, `$??` ń béèrè *ní ibi mélòó* ó sì ń dá gbogbo wọn padà.

```zymbol
àkójọ = [3, 1, 2]
>> (àkójọ$^+) ¶     // → [1, 2, 3]   gòkè
>> (àkójọ$^-) ¶     // → [3, 2, 1]   sọ̀kalẹ̀
```

**Òfin àbájáde.** Òṣìṣẹ́ kan, àti ohun tí kóòdù àyíká ń ṣe pẹ̀lú rẹ̀ ni ó ń pinnu: bí a bá lò ó, ó **ń kọ́** ó sì ń fi ìpilẹ̀ sílẹ̀; bí a bá sọ nù, ó **ń yípadà**.

```zymbol
àkójọ = [1, 2, 3]
ẹ̀dà = àkójọ[2]$~ 99
>> àkójọ ¶                // → [1, 2, 3]
>> ẹ̀dà ¶              // → [1, 99, 3]
àkójọ[2]$~ 99
>> àkójọ ¶                // → [1, 99, 3]
```

> **`=` kì í kọ sínú àkójọ.** `àkójọ[2] = 99` kì í ṣe ìrísí Zymbol — `=` ń fún **orúkọ** ní iye. Yíyípadà ẹ̀ka àkójọ jẹ́ `$~`, nínú gbogbo àkójọ.

`[…]` ń gba irúfẹ́ kan, a sì ń ṣàyẹ̀wò rẹ̀; àdàpọ̀ tí a mọ̀ọ́nà ń **sọ** pẹ̀lú `#[…]`:

```zymbol
àdàpọ̀ = #[1, "méjì", #1]
>> àdàpọ̀ ¶             // → [1, méjì, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Ìtọ́kasí Ọlọ́nà-ọ̀pọ̀

`>` ń sọ̀kalẹ̀ sínú ìkọ́ tí ó wà nínú. Àkójọ àkópọ̀ kan ń darí ohun kan, bí ó ti jin tó.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   ìlà 2, ọ̀wọ̀n 3
>> m[-1>-1] ¶      // → 9   ìlà ìparí, ọ̀wọ̀n ìparí
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          pẹlẹbẹ: ìlà-ìsàlẹ̀
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   ìkọ́: àwọn igun
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` **kì í ṣe** ìrísí Zymbol. Ìtọ́kasí ẹ̀wọ̀n ni a kọ̀ fún kíkà àti kíkọ — àkójọ àkópọ̀ kan fún ìwọlé kan, àti `>` ni ó ń lọ láàrin àwọn ìgbésẹ̀.

---

## Àwọn Ìwé Ìtumọ̀

Túpù tí ó ní àwọn pápá orúkọ jẹ́ ìwé ìtumọ̀, àti láti v0.0.9 a kọ ọ́ bí `#(…)`.

```zymbol
ẹni = #(oruko: "Ade", ọjọ́_orí: 25)
>> ẹni.oruko ¶        // → Ade
>> ẹni["ọjọ́_orí"] ¶    // → 25
```

```zymbol
ẹni = #(oruko: "Ade", ọjọ́_orí: 25)
pápá = "oruko"
>> ẹni[pápá] ¶     // → Ade
```

Ó lè yípadà, a lè fi kọ́kọ́rọ́ kún, a sì lè rìn káàkiri rẹ̀:

```zymbol
ìpamọ́ = #(píà: 4)
ìpamọ́["èso_pípọ́n"]$~ 10
@ k:ìpamọ́ { >> k "=" ìpamọ́[k] " " }
>> ¶                    // → píà=4 èso_pípọ́n=10
```

```zymbol
ìpamọ́ = #(píà: 4, èso_pípọ́n: 10)
@ (k, v):ìpamọ́ { >> k ":" v " " }
>> ¶                    // → píà:4 èso_pípọ́n:10
```

> `#()` ni ìwé ìtumọ̀ òfìfo, èyí tí `()` kò lè jẹ́ — yóò ní láti jẹ́ túpù òfìfo pẹ̀lú. `(x: 1)` ìhòòhò ni a kọ̀ pẹ̀lú ìṣẹ́ yìí: *a dictionary is written `#(…)`* — «ìwé ìtumọ̀ ni a kọ `#(…)`».
> Ìwé ìtumọ̀ ni a ń darí pẹ̀lú kọ́kọ́rọ́, kì í ṣe pẹ̀lú ipò, nítorí náà `ẹni[1]` jẹ́ àṣìṣe.

---

## Àwọn Túpù

Túpù jẹ́ àwọn àpótí tí a tò lẹ́sẹẹsẹ **tí kò lè yípadà** tí ó ń di iye àwọn irúfẹ́ oríṣiríṣi mú.

```zymbol
kókó = (10, 20)
>> kókó[1] ¶           // → 10
dátà = (42, "Ẹ kú àárọ̀", #1, 3.14)
>> dátà[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Ìgbìyànjú èyíkéyìí láti yí túpù padà ní ipò rẹ̀ jẹ́ àṣìṣe, èyí tí òṣìṣẹ́ jẹ́ — àìlèyípadà jẹ́ ànímọ́ iye, kì í ṣe ìyàtọ̀ nínú `$` kọ̀ọ̀kan.

---

## Ìpínyà

```zymbol
àkójọ = [10, 20, 30, 40, 50]
[a, b, c] = àkójọ
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
àkójọ = [10, 20, 30, 40, 50]
[àkọ́kọ́, *ìyókù] = àkójọ
>> àkọ́kọ́ ¶            // → 10
>> ìyókù ¶              // → [20, 30, 40, 50]
```

```zymbol
kókó = (100, 200)
(px, py) = kókó
>> px " " py ¶          // → 100 200
```

```zymbol
ẹni = #(oruko: "Bisi", ọjọ́_orí: 25)
#(oruko: n, ọjọ́_orí: o) = ẹni
>> n " " o ¶            // → Bisi 25
```

> Ìrísí àkójọ ni ó ní irúfẹ́: `[…]` ń gba àkójọ, `(…)` túpù, `#(…)` ìwé ìtumọ̀. Orúkọ ìkẹyìn **ń gba ìyókù**, nítorí náà ìpínyà kì í kùnà lórí gígùn — `(a, b, c) = (1,2,3,4,5)` ń fún `c = (3,4,5)`, àti `##_` nígbà tí kò bá sí ohun tí ó kù.

---

## Àwọn Iṣẹ́ Ìpele Gíga

```zymbol
nọ́mbà = [1, 2, 3, 4, 5]
>> (nọ́mbà$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (nọ́mbà$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (nọ́mbà$< (0, (àkójọpọ̀, x) -> àkójọpọ̀ + x)) ¶ // → 15
```

```zymbol
nọ́mbà = [1, 2, 3, 4, 5, 6]
ìlọ́po_meji(x) { <~ x * 2 }
ńlá(x) { <~ x > 3 }
>> (nọ́mbà$> ìlọ́po_meji) ¶    // → [2, 4, 6, 8, 10, 12]
>> (nọ́mbà$| ńlá) ¶    // → [4, 5, 6]
```

```zymbol
ìpìlẹ̀ = [#(oruko: "Carla", ọjọ́_orí: 28), #(oruko: "Bisi", ọjọ́_orí: 25)]
nípasẹ̀_ọjọ́_orí = ìpìlẹ̀$^ (a, b -> a.ọjọ́_orí < b.ọjọ́_orí)
>> nípasẹ̀_ọjọ́_orí[1].oruko ¶     // → Bisi
```

> Iṣẹ́ orúkọ ń lọ sí HOF **láìsí àkójọ**: `nọ́mbà$> ìlọ́po_meji`. Kíkọ `nọ́mbà$> (ìlọ́po_meji)` jẹ́ àṣìṣe ìtúpalẹ̀, nítorí `(` ń ṣí lambda.

---

## Òṣìṣẹ́ Páìpù

```zymbol
ìlọ́po_meji = x -> x * 2
àfikún = (a, b) -> a + b
ìdìkan = x -> x + 1
>> (5 |> ìlọ́po_meji(_)) ¶    // → 10
>> (10 |> àfikún(_, 5)) ¶  // → 15
>> (5 |> ìlọ́po_meji(_) |> ìdìkan(_)) ¶ // → 11
```

---

## Ìmúṣẹ́ Àṣìṣe

```zymbol
!? {
    a = 10 / 0
} :! ##Div {
    >> "ìpín pẹ̀lú òdo" ¶  // → ìpín pẹ̀lú òdo
} :! {
    >> "òmíràn: " _err ¶
} :> {
    >> "ń ṣiṣẹ́ nígbà gbogbo" ¶        // → ń ṣiṣẹ́ nígbà gbogbo
}
```

| Irúfẹ́ | Nígbà tí |
|------|---------|
| `##Div` | Ìpín pẹ̀lú òdo |
| `##Index` | Ìtọ́kasí jáde kúrò ní ààlà |
| `##Key` | Kọ́kọ́rọ́ kò sí nínú ìwé ìtumọ̀ |
| `##Range` | Jáde kúrò níbi òdìdì ààbò |
| `##Type` | Irúfẹ́ kò báramu |
| `##Parse` | Ìtúpalẹ̀ dátà |
| `##IO` | Fáìlì / ètò |
| `##Network` | Àwọn àṣìṣe nẹ́tíwọ́kì |
| `##DB` | Ìpamọ́ dátà |
| `##Time` | Ọjọ́ tí kò sí |
| `##_` | Àṣìṣe èyíkéyìí (mú gbogbo) |

`!` ni àmì **àṣìṣe àti agbára**, a sì ń kà á bákan náà nínú àwọn ìdílé méjèèjì: `$!` ń béèrè lọ́wọ́ iye bóyá àṣìṣe ni; `$!!`, pẹ̀lú àmì ìlọ́po, ń tàn án ká láìbéèrè.

> Àwọn ìkùnà ilé-ìkàwé ìbòòlù ń padà bí **iye àṣìṣe rírọ̀** tí ìwọ ń dán wò pẹ̀lú `$!` tàbí mú pẹ̀lú `!?`, dípò fífòpiná. `$!!` ń tàn ọ̀kan ká sí olùpè.

---

## Àwọn Mọ́dúlù

```zymbol
# ìṣirò {
    #> { àfikún, PI }

    PI := 3.14159
    àfikún(a, b) { <~ a + b }
}
```

```zymbol
<# ./ìṣirò => ì

>> ì::àfikún(5, 3) ¶
>> ì.PI ¶
```

```zymbol
# ilé_ìkàwé_mi {
    #> { àfikún_inú => àpapọ̀ }

    àfikún_inú(a, b) { <~ a + b }
}
```

Àmì mọ́dúlù méjèèjì jẹ́ èròǹgbà kan náà, ní báyìí a fi wọ́n sí orí àwọn fáìlì: `#` ni ipele **ìkéde** — ohun tí nkan *jẹ́*, kì í ṣe iye rẹ̀ — ọfà sì ń sọ ìtọ́sọ́nà tí kóòdù ń gbà:

```text
<#   ọfà ń wọlé: gbé wọlé, mú wá láti fáìlì mìíràn
#>   ọfà ń jáde: gbé jáde, fi fún àwọn fáìlì mìíràn
```

Àmì ìtọ́sọ́nà ń jókòó ní ẹ̀gbẹ́ tí ó kọjú sí ibi tí ó ń tọ́ka sí nígbà gbogbo. Ìdí kan náà ni `<~` fi ń padà sí òsì (kúrò nínú iṣẹ́) àti `->` fi ń wọlé sí ọ̀tún (sínú ara lambda).

> **Mọ́dúlù ń sọ ohun tí ó ń gbé jáde.** Blọ́ọ̀kì `#>` jẹ́ dandan — pípa á tì jẹ́ **E014**, àti `#> { }` ni ọ̀nà tí mọ́dúlù ń fi sọ pé ojú rẹ̀ òfìfo ni. `::` ń pè iṣẹ́, `.` ń ka ìdúró. Kìkì àwọn ìgbéwọlé, blọ́ọ̀kì ìgbéjáde, àwọn ìpilẹ̀ ìkọ̀wé àti àwọn ìtumọ̀ iṣẹ́ ni ó lè farahàn nínú ara mọ́dúlù; ohun èyíkéyìí tí a lè ṣiṣẹ́ jẹ́ **E013**.

---

## Ilé-Ìkàwé Ìbòòlù

Àwọn mọ́dúlù àbínibí, a ń gbé wọn wọlé bíi èyíkéyìí mìíràn:

| Mọ́dúlù | Àwọn iṣẹ́ |
|--------|-----------|
| `std/math` | `sqrt exp ln log pow abs ceil floor round min max sin cos tan asin acos atan atan2 sinh cosh tanh sigmoid` · `PI` `E` |
| `std/random` | `entero rango peso_f64` |
| `std/json` | `decode decode_map encode` |
| `std/io` | `read write append exists delete list mkdir` |
| `std/net` | `get post post_json head` |
| `std/db` | `connect exec query query_one tx commit rollback` … |
| `std/term` | `width pad_left pad_right center truncate` |
| `std/time` | `now today parts of format add diff` |

```zymbol
<# std/math => m

>> m::sqrt(16.0) ¶      // → 4
>> m.PI ¶               // → 3.141592653589793
```

```zymbol
<# std/term => t

>> t::width("手番") ¶            // → 4   glyph méjì, ọ̀wọ̀n mẹ́rin
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

ọjọ́ = T::of(2026, 1, 31)
>> T::format(ọjọ́, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(ọjọ́, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` ń díwọ̀n **àwọn ọ̀wọ̀n ìfihàn**, kì í ṣe àwọn lẹ́tà: CJK àti ọ̀pọ̀ emoji jẹ́ ọ̀wọ̀n 2, nítorí náà fi `t::width` ṣètò tábìlì, kì í ṣe `$#`.
> Nínú `std/time` àkókò kan jẹ́ millisecond láti ìbẹ̀rẹ̀. Kékeré ju ọjọ́ kan ni àkókò, láti ọjọ́ kan lọ ni kàlẹ́ńdà — nítorí náà oṣù kan ń ṣubú ní ọjọ́ kan náà nínú oṣù, a fi ká. `ìyàtọ̀(a, b)` jẹ́ `a - b`, nítorí náà àkókò tí ó ti kọjá ní àkọ́kọ́ ń fún ìdáhùn ìdínwọ̀n.

---

## Àwọn Àkópọ̀

`.zyp` ń so ètò ọ̀pọ̀-fáìlì pọ̀ sí fáìlì kan tí a lè gbé káàkiri. Ó jẹ́ àkójọ **orísun**, kì í ṣe bínárì, nítorí náà ó ń ṣiṣẹ́ níbi èyíkéyìí tí bínárì `zymbol` ń ṣiṣẹ́.

```bash
zymbol package iṣẹ́_mi/ --script main.zy -o iṣẹ́_mi.zyp
zymbol run iṣẹ́_mi.zyp
```

> Àkójọ náà ń gbé ìwé-àkọsílẹ̀ (`zyp.toml`) tí ó ń sọ àwọn ìkọ̀wé ìwọlé rẹ̀ àti ẹ̀yà ẹ̀rọ tí ó nílò. `zymbol run` ń yọ ọ́ jáde sínú àpò ìgba-àkókò kan, ó sì ń ṣiṣẹ́ láti ibẹ̀, nítorí náà kóòdù jẹ́ ohun tí a lè sọ nù nígbà tí ohun tí ìkọ̀wé ń kọ ń ṣubú sínú àpò iṣẹ́ gidi rẹ. Ilé-ìṣeré pẹ̀lú ń gbé àwọn fáìlì `.zyp` wọlé.

---

## Àwọn Ipò Òdìdì

Zymbol lè kọ àwọn òdìdì ní **69 ìkọ̀wé òdìdì Unicode** — Devanagari, Lárúbáwá-Índíà, Thai, Klingon pIqaD, Ìkọ̀wé Ìṣirò Nípọn, àwọn ẹ̀ka LCD, àti bẹ́ẹ̀ bẹ́ẹ̀ lọ. Ipò náà jẹ́ àgbáyé fún ìlànà, ó sì ń nípa lórí ìjáde; ìṣirò kò yípadà.

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Lárúbáwá-Índíà (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // padà sí ASCII
```

```zymbol
a = 42
>> a ¶                  // → 42
#०९#
>> a ¶                  // → ४२
>> 3.14 ¶               // → ३.१४
>> #1 ¶                 // → #१
#09#
```

Àwọn òdìdì láti ìkọ̀wé èyíkéyìí tí a ṣe àtìlẹ́yìn jẹ́ ìkọ̀wé gidi nínú orísun:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Kíkà jẹ́ alábàámù — a ń lóye òdìdì ní ìkọ̀wé èyíkéyìí:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` jẹ́ ASCII nígbà gbogbo, nítorí náà `#0` ń wà ní ìyàtọ̀ ojú pẹ̀lú òdìdì òdo ní ìkọ̀wé gbogbo.
> `#,` àti `#^` pẹ̀lú ń kọ àwọn òdìdì wọn ní ìkọ̀wé tí ń ṣiṣẹ́, àwọn ìpínyà sì ń tẹ̀lé e — ṣùgbọ́n tọ̀wọ́tọ̀wọ́ kì í yí padà: `,` ń ṣàkójọ àti `.` ń pín, ní ìkọ̀wé gbogbo.

---

## Àwọn Òṣìṣẹ́ Dátà

```zymbol
f = ##.42         // sí Ìpín
i = ###3.7        // sí Òdìdì, yí ká  → 4
t = ##!3.7        // sí Òdìdì, gé  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Ìpín ń tẹ̀ jáde bí àwọn òdìdì, kì í ṣe bí ìlọ́po, ó sì ń fi `.0` ìkẹyìn sílẹ̀ — `##.42` ń kọ `42` ó sì ṣì jẹ́ Ìpín, bí `f#?` ti fi hàn.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   ààbò-ìkùnà: ó ń dá ìwọlé padà láìyípadà
>> ##!'A' ¶        // → 65    kóòdù kókó Lẹ́tà kan
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          yí ká sí 2 ìpín
>> #!2|pi| ¶       // → 3.14          gé sí 2 ìpín
>> #,|1234567| ¶   // → 1,234,567     àwọn ìpínyà ẹgbẹ̀rún
>> #^|12345.678| ¶ // → 1.2345678e4   ìkọ̀wé ìmọ̀ ẹ̀rọ
```

```zymbol
>> 0x41 ¶        // → A   ẹ̀ẹ̀dógún
>> 0b01000001 ¶  // → A   èjì
>> 0o101 ¶       // → A   ẹ̀jọ
>> 0d65 ¶        // → A   ẹ̀wá
```

> Ìkọ̀wé ìpìlẹ̀ nínú ààlà ASCII jẹ́ **Lẹ́tà**: `0d65 == 'A'` jẹ́ `#1`, àti `0d65 == 65` jẹ́ `#0`. Àwọn ìpìlẹ̀ mẹ́rin ń kọ lẹ́tà kan náà.

---

## Ìsopọ̀ Shell

```zymbol
òní = <\ date +%Y-%m-%d \>
>> "Òní: " òní
```

```zymbol
ìjáde = </"./ìkọ̀wé_kékeré.zy"/>
>> ìjáde
```

> `<\ … \>` ń mú stdout àti stderr, ó ń yọ ìlà tuntun ìkẹyìn kúrò.
> `>< args` ń mú àwọn èròjà ìlà ìpàsẹ bí àkójọ ọ̀rọ̀.

---

## Àpẹẹrẹ Kíkún: FizzBuzz

```zymbol
ìpínpín(òdìdì) {
    ? òdìdì % 15 == 0 { <~ "FizzBuzz" }
    _? òdìdì % 3  == 0 { <~ "Fizz" }
    _? òdìdì % 5  == 0 { <~ "Buzz" }
    <~ òdìdì
}

@ i:1..20 { >> ìpínpín(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (ọ̀kan ní ìlà kọ̀ọ̀kan)
```

---

## Bí Àwọn Àmì Ṣe Ń Darapọ̀

Ìwọ ti ń rí ohun kan náà jálẹ̀ ìwé yìí: **òṣìṣẹ́ kì í ṣe àwòrán láti há sínú ìrántí, ó jẹ́ àwọn àmì mélòó kan ní ìlà kan, kọ̀ọ̀kan sì ń fi ìtumọ̀ rẹ̀ kún.** Ní báyìí tí ìwọ ti mọ̀ gbogbo wọn, èyí ni àpẹẹrẹ kíkún.

Ní àkọ́kọ́ **ayé tí a wà**:

| Àmì | Ayé | Ìwọ rí i ní |
|------|-----|-----------|
| `$` | àkójọ | `$#` `$+` `$?` `$^-` |
| `@` | àkókò, ohun tí ó ń tún ṣe | `@!` `@>` `@~` |
| `#` | ohun tí nkan *jẹ́*, kì í ṣe iye rẹ̀ | `#?` `#(…)` `<#` `#>` |
| `>>` | jáde kúrò nínú ètò | `>>` `>>!` `>>?` |
| `<<` | wọlé sínú ètò | `<<` `<<\|` `<<\|?` |
| `?` | béèrè, láìdábọ̀ | `?` `_?` `??` `$?` |
| `!` | agbára, tàbí àṣìṣe | `@!` `$!` `!?` |

Lẹ́yìn náà **ohun tí a ń ṣe níbẹ̀**: `+` fi kún, `-` yọ kúrò, `^` tò, `~` yípadà, `#` kà, `|` ìṣọ̀kan kan, `:` so orúkọ.

Àti òfin méjì tí kì í kùnà:

**Ìlọ́po àmì ń jẹ́ kí ó kíkún.** `?` ń béèrè lẹ́ẹ̀kan, `??` ń dán ọ̀pọ̀ ìṣẹ̀lẹ̀ wò. `$?` ń béèrè bóyá iye kan wà, `$??` ń dá gbogbo ibi tí ó wà padà. `!` ń fi àṣìṣe hàn, `!!` ń tàn án ká láìbéèrè.

**Àmì ipò ń wá ní ìparí nígbà gbogbo.** Nígbà tí `?` tàbí `!` bá farahàn láti sọ *bí* ohun kan ṣe ń ṣẹlẹ̀ — pẹ̀lú ìṣiyèméjì tàbí pẹ̀lú agbára — wọ́n jẹ́ àmì ìkẹyìn ti òṣìṣẹ́: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:ìta!`. Kò sí ìṣiṣẹ́ lẹ́yìn wọn rárá.

Ohun tí ó wúlò kan ń jáde láti ibẹ̀: **àkópọ̀ tí ìwọ kò tíì rí rí, ti ní ìtumọ̀ kí ìwọ tó wá a.** Bí `$` bá jẹ́ àkójọ àti `^` jẹ́ ìtò àti `-` jẹ́ ìyípadà, nígbà náà `$^-` ń tò ní ìsọ̀kalẹ̀, kò sì sí ẹni tí ó ní láti sọ fún ọ.

Kì í ṣe gbogbo àkọsílẹ̀ ni ó ń ṣiṣẹ́ báyìí, ó sì dára láti sọ bẹ́ẹ̀ ju ṣíṣe bí ẹni pé ó ṣe. Ọ̀pọ̀ àwọn òṣìṣẹ́ ń pínyà dáadáa. Mẹ́fà ń pínyà ṣùgbọ́n wọ́n ń túmọ̀ sí ju àwọn ẹ̀ka wọn lọ: `!?` `:!` `:>` `|>` `::` `$++`. Àti mẹ́wàá ni a ní láti há sínú ìrántí nítorí wọn kì í pínyà rárá: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Kíkà àwọn tí ó ṣókùnkùn dípò rò pé wọ́n kéré jẹ́ ìmọ̀ọ́mọ̀: wọ́n ni iye ìrántí gidi ti èdè. Ìtọ́kasí kíkún — àkọsílẹ̀, àwọn homograph tí a sọ, àti àwọn òfin tí òṣìṣẹ́ tuntun gbọ́dọ̀ mú ṣẹ láti wà — wà nínú `SYMBOLS.md`, nínú àpò ìtumọ̀.

---

## Ìtọ́kasí Àmì

| Àmì | Ìṣiṣẹ́ | Àmì | Ìṣiṣẹ́ |
|--------|-----------|--------|-----------|
| `=` | ayípadà | `$#` | gígùn |
| `:=` | ìdúró | `$+` | fi kún |
| `>>` | ìjáde | `$+[i]` | fi sínú ní ìtọ́kasí (1-ìpìlẹ̀) |
| `<<` | ìwọlé | `$-` | yọ àkọ́kọ́ kúrò nípasẹ̀ iye |
| `¶` / `\\` | ìlà tuntun | `$--` | yọ gbogbo kúrò nípasẹ̀ iye |
| `?` | bí | `$-[i]` | yọ ní ìtọ́kasí (1-ìpìlẹ̀) |
| `_?` | bí bẹ́ẹ̀ kọ́ | `$-[i..j]` | yọ ààlà (1-ìpìlẹ̀) |
| `_` | bí bẹ́ẹ̀ kọ́ / àmì-àìsí | `$?` | ní |
| `??` | ìbáramu | `$??` | wá gbogbo ìtọ́kasí (1-ìpìlẹ̀) |
| `\|\|` | tàbí-àwòrán nínú ẹ̀ka ìbáramu | `$[s..e]` | ìpín (1-ìpìlẹ̀) |
| `@` | ìsopọ̀ | `$>` | àwòrán |
| `@ N { }` | ìsopọ̀ N ìgbà | `$\|` | ṣe àṣẹ̀ |
| `@!` | dáwọ́ | `$<` | dín |
| `@>` | tẹ̀síwájú | `$/ àpín` | pín ọ̀rọ̀ |
| `@:orúkọ { }` | ìsopọ̀ àmì-orúkọ | `$++ a b c` | kọ́ nípasẹ̀ ìsopọ̀ |
| `@:orúkọ!` | dáwọ́ àmì-orúkọ | `$~~[p:r]` | rọ́pò ọ̀rọ̀ |
| `@:orúkọ>` | tẹ̀síwájú àmì-orúkọ | `$*` | tún ọ̀rọ̀ ṣe |
| `->` | lambda | `àkójọ[i]$~ v` | Ọ̀NÀ ìmúdójúìwọ̀n kan ṣoṣo |
| `<~` | padà / èròjà ìjáde | `~` | èròjà ẹ̀dà iṣẹ́ |
| `àkójọ[i>j]` | ìtọ́kasí ìrìnàjò | `àkójọ[p ; q]` | ìyọ pẹlẹbẹ |
| `$^+` | tò gòkè | `$^-` | tò sọ̀kalẹ̀ |
| `$^` | tò pẹ̀lú òṣìṣẹ́ àfiwé | `\|>` | páìpù |
| `!?` | gbìyànjú | `:!` | mú |
| `:>` | ní ìparí | `$!` | àṣìṣe ni |
| `$!!` | tàn àṣìṣe ká | `#1` / `#0` | òtítọ́ / irọ́ |
| `##_` | Ẹyọ — àìsí | `[…]` | àkójọ, irúfẹ́ kan |
| `#[…]` | àkójọ, àdàpọ̀ tí a sọ | `#(…)` | ìwé ìtumọ̀ |
| `(…)` | túpù ipò | `#()` | ìwé ìtumọ̀ òfìfo |
| `<#` | gbé wọlé | `#>` | gbé jáde |
| `#` | sọ mọ́dúlù | `::` | pè mọ́dúlù |
| `.` | ìwọlé pápá / ìdúró | `#?` | ìsọfúnni-ẹ̀yà irúfẹ́ |
| `#\|..\|` | túpalẹ̀ òdìdì | `##.` | yípadà sí Ìpín |
| `###` | yípadà sí Òdìdì (yí ká) | `##!` | yípadà sí Òdìdì (gé) |
| `#.N\|..\|` | yí ká | `#!N\|..\|` | gé |
| `#,\|..\|` | àwọn ìpínyà ẹgbẹ̀rún | `#^\|..\|` | ìmọ̀ ẹ̀rọ |
| `#d0d9#` | yí ipò òdìdì padà | `#09#` | padà sí ASCII |
| `<\ ..\>` | ṣiṣẹ́ shell | `><` | èròjà CLI |
| `\ var` | pa ayípadà | `°x` / `x°` | ìtumọ̀ gbígbóná |
| `>>\|` | blọ́ọ̀kì TUI (ojú-ìwé mìíràn) | `>>~` | ìjáde ipò |
| `>>!` | pa ojú-ìwé | `>>?` | béèrè ìwọ̀n terminal |
| `<<\|` | ìtẹ̀ bọ́tìnì ìdínà | `<<\|?` | ìtẹ̀ bọ́tìnì àìdínà |
| `@~ N` | sùn N millisecond | `0d` `0x` `0o` `0b` | ìkọ̀wé ìpìlẹ̀ |

---

## Àkọsílẹ̀ Àwọn Ìyípadà Ẹ̀yà

### v0.0.9 — Àwọn Àkójọ Pinnu _(Oṣù Kẹsán 2026)_

- **Ìparí** Ìwé ìtumọ̀ ní àmì tirẹ̀: `#(kọ́kọ́rọ́: iye)`. `(x: 1)` ìhòòhò ni a kọ̀, àti `#()` ni ìwé ìtumọ̀ òfìfo — èyí tí `()` kò lè jẹ́ rí
- **Ìparí** Ìfiránṣẹ́ ìtọ́kasí ni a fagi lé: `àkójọ[i] = v` àti gbogbo ìrísí àdàpọ̀. `=` ń fún **orúkọ** ní iye; yíyípadà ẹ̀ka àkójọ jẹ́ `$~`
- **Ìparí** Ìtọ́kasí ẹ̀wọ̀n `m[i][j]` ni a kọ̀ fún kíkà àti kíkọ — `>` ni ó ń lọ láàrin àwọn ìgbésẹ̀
- **Ìparí** Mọ́dúlù gbọ́dọ̀ sọ ohun tí ó ń gbé jáde (**E014**); `#> { }` ni ọ̀nà tí mọ́dúlù ń fi sọ pé ojú rẹ̀ òfìfo ni
- **Ìparí** Olùpinnu ìsopọ̀ jẹ́ ìṣirò tàbí ipò — kò sí òtítọ́. `@ []` àti `@ 3.5` ni a kọ̀
- **Ìfikún** `##_` — ìkọ̀wé Ẹyọ, àti bí ètò ṣe ń béèrè bóyá ohun kan kò sí
- **Ìfikún** `#[…]` — àkójọ tí a ti sọ àdàpọ̀ irúfẹ́ àwọn ẹ̀ka rẹ̀
- **Ìfikún** `#?` ń yà àwọn àkójọ mẹ́rin sọ́tọ̀: `##]` `##[` `##)` `##(`
- **Ìfikún** `std/time` — aago àti kàlẹ́ńdà aráàlú, pẹ̀lú àwọn agbègbè àti ìṣirò kàlẹ́ńdà
- **Ìfikún** `<~>` ní ipele gíga ni ipò ìjáde ètò
- **Ìfikún** `@ (k, v):àwọn_tọ̀wọ́` — àwòrán nínú orí ìsopọ̀
- **Ìfikún** `#|c|` ń ka òdìdì ní èyíkéyìí nínú àwọn ìkọ̀wé 69; `#,` àti `#^` ń kọ nínú èyí tí ń ṣiṣẹ́
- **Ìyípadà** `Òdìdì` jẹ́ òdìdì ààbò, ±(2⁵³ − 1), tí ó ń pa nígbà ìkùnà nínú ẹ̀rọ gbogbo
- **Ìyípadà** Iṣẹ́ orúkọ ń ka àwọn ayípadà fáìlì ní àkókò ìpè, nípasẹ̀ iye
- **Ìyípadà** Ìsọ̀rọ̀ tí ó ń ka orúkọ nìkan ń kìlọ̀ dípò kí ó kọjá ní ìdákẹ́jẹ́
- **Àwọn Ẹ̀rọ** 660 nínú àwọn fáìlì kọ́pọ̀sì 666 gbà ní ẹ̀rọ mẹ́ta, 0 yàtọ̀

### v0.0.8 — Ìdáǹdè Aṣesewá, `std/term` àti Àwọn Àkópọ̀ _(Oṣù Kẹjọ 2026)_

- **Ìfikún** Ìparun aṣesewá ní ìlò ìkẹyìn — àìrí; ó ń dín ìrántí tí ó ga jùlọ kù
- **Ìfikún** `std/term` — àwọn ìdíwọ̀n ìfihàn ní àwọn ọ̀wọ̀n terminal
- **Ìfikún** `##!` lórí `Lẹ́tà` — kóòdù kókó Unicode rẹ̀
- **Ìfikún** Àwòrán tàbí nínú ìbáramu: `'p' || 'P' => …`, ààyò irúfẹ́ èyíkéyìí nínú ẹ̀ka kan
- **Ìfikún** Àwọn àkópọ̀ Zymbol (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Ìfikún** `<~>` ní ibi ìpè jẹ́ dandan níbi tí ẹni tí a pè sọ èròjà ìjáde
- **Ìtúnṣe** Ìbáramu ẹ̀rọ mọ́dúlù nínú VM àkọsílẹ̀

### v0.0.7 — Ilé-Ìkàwé Ìbòòlù Àbínibí _(Oṣù Keje 2026)_

- **Ìfikún** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — gbogbo wọn pẹ̀lú àwọn iye àṣìṣe rírọ̀
- **Ìfikún** Ìwọlé tí a fi irúfẹ́ ṣe/ṣàyẹ̀wò: `<< ##.(5,2) "owó: " p`
- **Ìfikún** Àwọn òṣìṣẹ́ ìkẹyìn tààrà nínú `>>` — kò nílò àkójọ
- **Ìyípadà** Olùṣètò tí ó ń pa nígbà ìkùnà: ó ń kọ̀ láti kọ ìjáde tí kò lè kà lẹ́ẹ̀kan si

### v0.0.6 — Ìmúdára àti Ilé-Ìkàwé Ìmọ̀ Ẹ̀rọ _(Oṣù Kẹfà 2026)_

- **Ìparí** `=>` ń rọ́pò `:` nínú àwọn ẹ̀ka ìbáramu àti `<=` nínú àwọn orúkọ ìgbéwọlé/ìgbéjáde
- **Ìfikún** `std/math` àti `std/random`
- **Ìfikún** Ìmúdójúìwọ̀n ìwé ìtumọ̀ nípasẹ̀ kọ́kọ́rọ́: `d["k"]$~ iye`

### v0.0.5 — Àwọn Ẹ̀yà TUI àti Ìtumọ̀ Gbígbóná _(Oṣù Kàrún 2026)_

- **Ìfikún** Blọ́ọ̀kì TUI `>>| { }`, ìjáde ipò `>>~`, ìwọlé bọ́tìnì `<<|` àti `<<|?`
- **Ìfikún** `>>!` pa ojú-ìwé, `>>?` ìwọ̀n terminal, `@~ N` sùn
- **Ìfikún** Ìtumọ̀ gbígbóná `°x` / `x°`, àti ìtún ọ̀rọ̀ ṣe `$*`

### v0.0.4 — Ìtọ́kasí 1-Ìpìlẹ̀ àti Àwọn Iṣẹ́ Kíláàsì Kìíní _(Oṣù Kẹrin 2026)_

- **Ìparí** Gbogbo ìtọ́kasí jẹ́ **1-ìpìlẹ̀** — `àkójọ[1]` ni ẹ̀ka àkọ́kọ́
- **Ìfikún** Àwọn iṣẹ́ orúkọ bí iye kíláàsì kìíní; àmì blọ́ọ̀kì mọ́dúlù `# orúkọ { }`
- **Ìfikún** Ìtọ́kasí ọlọ́nà-ọ̀pọ̀ `àkójọ[i>j>k]` àti ìyọ pẹlẹbẹ `àkójọ[p ; q]`

### v0.0.3 — Àwọn Ẹ̀rọ Òdìdì Unicode _(Oṣù Kẹrin 2026)_

- **Ìfikún** Àwọn blọ́ọ̀kì òdìdì Unicode 69 pẹ̀lú àmì ìyípadà ipò `#d0d9#`
- **Ìfikún** Ìkọ̀wé boolean ní ìkọ̀wé èyíkéyìí — `#१` / `#०`

### v0.0.2 — Àtúnṣe API Àkójọ _(Oṣù Kẹta 2026)_

- **Ìfikún** Ìdílé òṣìṣẹ́ `$` fún àwọn àkójọ àti ọ̀rọ̀
- **Ìfikún** Ìfiránṣẹ́ ìpínyà, àti àwọn ìtọ́kasí ìdínwọ̀n

### v0.0.1 — Ìtẹ̀jáde Ìbòòlù Àkọ́kọ́ _(Oṣù Kẹta 2026)_

- Olùtumọ̀ ìrìn-igi + VM àkọsílẹ̀ (`--vm`)
- Gbogbo àwọn ìkọ́ pàtàkì: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Àwọn ìdánimọ̀ Unicode kíkún, ẹ̀rọ mọ́dúlù, lambda, ìdìde, ìmúṣẹ́ àṣìṣe
- REPL, LSP, ìfàsẹ́yìn VS Code, olùṣètò (`zymbol fmt`)

---

_Zymbol-Lang — Àmì. Àgbáyé. Àìyípadà._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Ìwé-Àṣẹ:** Ìwé yìí wà lábẹ́ [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024-2026 Ẹgbẹ́ Zymbol-Lang. Ọ̀rọ̀ kíkún: `LICENSE-CC-BY-SA-4.0` ní <https://github.com/zymbol-lang/web>. Olùtumọ̀ àti ẹ̀rọ aṣàwákiri (`zymbol.js`) jẹ́ iṣẹ́ ọ̀tọ̀ọ̀tọ̀, tí wọ́n wà lábẹ́ AGPL-3.0-only.
