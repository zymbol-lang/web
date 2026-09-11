> **Yuyaychay:** Kay willakuyqa artificial intelligence (AI) yanapayninwan ruwasqa hinaspa tikrasqa karqan.
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> Kikin rikuna qillqaqa **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** kachkan, intérprete repositoriopi.

---

# Zymbol-Lang Yachana Qillqa

> **Allichasqa v0.0.9 -paq — 2026-09-07**

**Zymbol-Lang** unanchakunawan llamk'ana rimaymi. Gramatikanpi mana simikunachu kan — sapa ima ruwaymi huk unancha. Tukuy runasimipi kikillantataq llamk'an.

- Mana `if`, `while`, `return`chu kan — `?`, `@`, `<~` -lla
- Hunt'a Unicode — sutikuna ima rimaypipas, emoji-pipas
- Mana huk runasimillapichu — kodigoqa maypipas kikillanmi

**Intérprete versiyunnin**: v0.0.9 | **Pruebakuna hunt'an**: 660/666 (kimsa motorkuna kikinchasqa, 0 mana kikinchu)

---

## Variables & Mana Tikraqkuna

```zymbol
x = 10              // tikraq variable
PI := 3.14159       // mana tikraq — kutin churay runtime pantaymi
suti = "Alice"
kawsaq = #1         // bool chiqapmi
👋 := "Rimaykullayki"
```

```zymbol
x = 10    // 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 3    // 8
x %= 3    // 2
x ^= 2    // 4
x++       // 5
x--       // 4
```

`°` (unancha grado, U+00B0) huk variableta pisqan kawsayninman kutichin, ñawpaq apaykachasqanpi:

```zymbol
yupaykuna = [3, 1, 4, 1, 5]
@ n:yupaykuna {
    °tantasqa += n
}
>> tantasqa ¶              // → 14
```

> `°x` (ñawpaqta churasqa) muyuy hawanpi hap'ikun — kutichisqanqa muyuy qhepapi ñawinchayta atin.
> `x°` (qhepata churasqa) muyuy ukhullanpi hap'ikun — muyuy tukukuqtin wañun.

Huk nisqa sutillam kaqtin, variableta ñawinchan hinaspa chaninninta wischun; chayrayku willakun:

```zymbol
yupasqa = 5
yupasqa
```

Compiladorqa kayta willan:

```text
warning: kay nisqaqa mana imatapas ruwanchu: 'yupasqa' ñawinchasqa hinaspa wischusqa
  = help: qichuy, utaq allinta apaykachay — `>> suti ¶` qillqanapaq
```

---

## Chaninkunap Laya

| Laya | Qillqasqan | `#?` unancha | Willay |
|------|---------|----------|-------|
| Int | `42`, `-7` | `###` | Yupay chiqan: ±(2⁵³ − 1) |
| Float | `3.14`, `1.5e10` | `##.` | IEEE-754 iskay pachak |
| Qillqa | `"text"` | `##"` | Interpolación: `"Hello {suti}"` |
| Char | `'A'` | `##'` | Huk Unicode código puntu |
| Bool | `#1`, `#0` | `##?` | MANA yupaychu — `#1 ≠ 1` |
| Huñu | `[1, 2, 3]` | `##]` | Hukllan laya, qhawasqa |
| Chaqrusqa willasqa | `#[1, "two"]` | `##[` | `[…]` -wan kikin laya, mana qhawasqa |
| Tupla | `(a, b)` | `##)` | Churasqan hina, mana tikraq |
| Diccionario | `#(x: 1, y: 2)` | `##(` | Sutiyuq, tikraq |
| Ruwana | sutiyuq ruwanaman rikuna | `##()` | Ñawpaq laya; rikch'akun `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Ñawpaq laya; rikch'akun `<lambd/N>` |
| Ch'usaq | `##_` | `##_` | Mana kaynin — manapuni null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(a: 1)#? ¶          // → (##(, 1, #(a: 1))
```

Huk yupay chiqan rangomanta lluqsiqtinqa, hap'ina pantaymi kachkan, manapunitaq ch'inllamanta muyuqchu:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "rangomanta lluqsisqa" ¶ // → rangomanta lluqsisqa
}
```

`##_` nisqawanmi huk ruwana ima ch'usaq kasqanta tapukun:

```zymbol
ch'usaq() { }
chanin = ch'usaq()
>> (chanin == ##_) ¶     // → #1
```

---

## Lluqsiy & Haykuy

```zymbol
suti = "Alice"
tantasqa = 3
>> "Rimaykullayki" ¶            // → Rimaykullayki
>> "a=" suti " b=" tantasqa ¶ // → a=Alice b=3
>> tantasqa#? ¶            // → (###, 1, 3)
```

```zymbol
<< suti
<< "Sutiykita qillqay: " suti
<< ###(4) "Hayk'a watayuqmi kanki: " watan
```

**Iskay unanchakunap rikch'ayninta qhaway.** `>>` hawaman rikuchin: programamanta datota lluqsichin. `<<` ukhuman rikuchin: datota haykuchin. Mana imatapas yuyayman apana tiyanchu — wach'iqa willakuyllan mayqin ladoman purisqanta rikuchin, chay yuyaytaq kutinmi tukuy imatapas kuyuchiq unanchapi.

> `¶` `\\`-wan kikillan mosoq lineapaq. `>>` manapuni hukta yapanchu.
> Huk laya-willay tapuy ñawpaqinpi, ñawinchaspa qhawan hinaspa kutin-kutin tapun chiqan kama:
> `##.` Float · `##.(T,D)` decimal · `###(N)` Int · `##"(N)` qillqa · `##'` huk Char.

Qillqap ñawpaq nivelninpi, `<~` ruwanap lluqsiy chaninnin kachkan:

```zymbol
>> "Qhawachkan" ¶         // → Qhawachkan
<~ 0
```

---

## TUI Kikin Unanchakuna

Kay unanchakunaqa terminal-pi rijch'arisqa programakunapaq kanku. Aswanninqa `>>| { }` bloketa munan (huk kaq pantalla + qallariy modo).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Llamk'achkan"
    @~ 1000
    >>~ (2, 1) > "Tukusqa."
}
```

```zymbol
>>| {
    [patakuna, kolumnakuna] = >>?
    >>~ (1, 1) > "Terminal: " patakuna " x " kolumnakuna
    <<| tecla
    >>~ (2, 1) > "Nit'isqa: " tecla
}
```

Kaypim rikunki imaraykuchus unanchakuna tinkunku, manataq mirarinkuchu. `<<` haykuy kasqanta ña yachanki, `?` -taq tapuy kasqanta, mana kikinchaspa. Huklla unanchan musuq:

- `|` **huklla kaqmi**, manataq tukuy phawaqchu.

Chaywan, iskay teclapaq unanchakuna kikillanmanta ñawinchakunku:

```text
<<        |            ?
haykuy    huklla kaq   mana kikinchaspa

<<|   HUK teclata hap'iy, hasta kanankama suyay
<<|?  qhaway teclachus kachkan, mana kaqtinqa qatiy
```

Kikillantaq hukñiqinpi: `>>` lluqsichin, `>>!` **sinchita** lluqsichin (tukuy pantallata pichan), `>>?`-taq qillqaspa rantinpi **tapun** (hayk'a hatunchus terminal kasqanta). Paña ladopi kaq unanchaqa modota tikraq, chaymi wiñaypaq qhepapi rin.

> `>>!` pantallata pichan. `>>?` kutichin `(patakuna, kolumnakuna)`. `@~ N` N millisegundota puñun.
> `<<|` huk teclata ñawinchan (suyaspa); `<<|?` mana suyaspa qhawan (`'\0'` mana kaqtin).
> Flecha teclakuna hamunku ñawinchasqaña `'↑' '↓' '←' '→'` hina; ESC-qa 27 kaq código puntumi.
> Churasqan lluqsichiy tupla: `(row, col, BKS, fg, bg)` — sapanka p'akiqa comawan saqinapaq atin (`>>~ (,,, 196) > "puka"`).
> BKS bitmask: `1`=Sinchi qillqa, `2`=Wistu qillqa, `4`=Sirasqa. ANSI 256-color pantalla (`0`=terminal kikin).

---

## Llamk'aq Unanchakuna

```zymbol
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (hunt'a yupaykama rakiy)
r5 = a % b    // 1
r6 = a ^ b    // 1000
```

```zymbol
a = 10
b = 3
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a >= b    // #1
l1 = #1 && #0  // #0
l2 = !#1       // #0
```

> `==` manapunim tikranchu: `"5" == 5` lla `#0`. Ichaqa ñawpaqchaykunaqa tikranmi: `"5" > 4` lla `#1`,
> chaynallataq `"४२" > 5` lla `#1` — 69 yupay-qillqa layakunamanta hukpi qillqasqa yupayqa yupayhina tinkuchisqa kan.
> Huk ruwanaqa payllawanmi kikin, manapunitaq kikin ukhuyuq waq ruwanawanqa kikinchu.

---

## Qillqa

```zymbol
suti = "Alice"
n = 42
>> "Rimaykullayki " suti " charinki " n ¶ // → Rimaykullayki Alice charinki 42
desc = "Rimaykullayki {suti}, charinki {n}"
>> desc ¶               // → Rimaykullayki Alice, charinki 42
```

```zymbol
s = "Allin Pacha"
len = s$#                  // 11
sub = s$[1..5]             // "Allin"
has = s$? "Pacha"          // #1
parts = "a,b,c,d"$/ ','    // [a, b, c, d]
rep = s$~~["l":"L"]        // "ALLin Pacha"
line = "─" $* 20
```

> `+` yupaykunallapaqmi. Qillqakunapaqqa kuska churasqawan utaq interpolaciónwan apaykachay.
> `\{` `\}`-wanqa kikin `{` `}`-tam qillqanki — pantachiyqa kikinchasqa.

---

## Ñan Akllay

```zymbol
x = 7
? x > 100 {
    >> "hatun" ¶
} _? x > 0 {
    >> "positivo" ¶     // → positivo
} _ {
    >> "negativo" ¶
}
```

Iskay unanchakuna musuq kaypi, hinaspa kimsa ñiqin, iskayninta huñuspa lluqsimun:

- `?` **tapuymi**: huk kunisyunta kichan.
- `_` **mana nisqa kasqanmi**: mayqin tapuy mana tinkuqtin, chay ramaman rin.
- `_?` iskayninmi hukllapi: *mana imapas tinkuqtinqa, kutin tapuy*.

Chayrayku `_?` hinata qillqasqa kachkan. Manam huk musuq unanchachu yachanapaq — `_`-mi `?`-wan qatichisqa, hinaspa exactamente iskay t'aqasqankuna niyta munasqanta niyta munan, ñawpaqmanta qatispa.

> `{ }` unanchakunaqa **obligatoriomi** kanku, huk sapalla nisqapaqpas.

---

## Tinkuchiy

```zymbol
chanin = 85
laya = ?? chanin {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> laya ¶              // → B
```

```zymbol
temperatura = -5
kaqnin = ?? temperatura {
    < 0  => "chullunku"
    < 20 => "chiri"
    _    => "q'uñi"
}
>> kaqnin ¶              // → chullunku
```

Ña yachanki `?` "tapuy" kasqanta. **`??`-qa askha kutita tapuymi**: mayqin unanchapipas iskay kutichisqaqa, huk kutilla ruwasqanta askha kutiman apan. Huk `?`-lla huk kunisyunta qhawan; `??`-taq askha casospi qhawan.

Akllanakuna `||`-wan huñukunku, hinaspa rikch'ay laya-kunata chaqrukuyta atinku:

```zymbol
tecla = 'P'
akllasqa = ?? tecla {
    'p' || 'P' => "samay"
    < 0 || > 100 => "rangomanta lluqsisqa"
    _ => "qunqasqa"
}
>> akllasqa ¶             // → samay
```

---

## Muyuykuna

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
rurukuna = ["manzana", "pera", "uva"]
@ r:rurukuna { >> r " " }
>> ¶                    // → manzana pera uva
@ c:"allin" { >> c "-" }
>> ¶                    // → a-l-l-i-n-
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
yupay = 0
@:hawa {
    yupay++
    ? yupay >= 3 { @:hawa! }
}
>> yupay ¶              // → 3
```

`@` **pacha** unanchanmi: tukuy kutin-kutin ruwasqaqa kaypi kawsan. Chay pachata pisiyachinaykipaqqa, huk unanchata kinraynin yapanki:

- `@!` — `!` **sinchi**mi: muyuymanta kunanpacha lluqsiy.
- `@>` — `>` ñawpaqman tanqan: qatiq kutiman phawariy.
- `@:hawa!` — `:` **suti watun**, chayrayku *hawa* sutiyuq muyuyta sayachin, manataq aswan qayllatachu.

Kimsa unanchakunam, mana sapanka yuyayman apanapaqchu: paykunaqa `@` + huk unancha, ima ruwasqanta ñam nichkanña.

> **Huk especificadorqa yupaymi utaq kunisyunmi.** `Int`-qa huk yupaymi, hukllata qhawasqa — `@ 0` ukhunta manapuni ruwanchu. Waqniraqqa kunisyunmi. Manapuni truthiness kanchu: `@ []` ch'usaqtaq `@ 3.5` mana chaskisqachu. Huk huñuta purinaykipaqqa `@ x:items` apaykachay; yupanaykipaqtaq, `@ items$#`.

---

## Ruwanakuna

```zymbol
yapay(a, b) { <~ a + b }
>> yapay(3, 4) ¶          // → 7
```

```zymbol
factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶       // → 120
```

Huk ruwanaqa qillqap variablenkunata chaninnillanta ñawinchan, hinaspa ukhupi qillqasqaqa ukhullapitaq qhipakun:

```zymbol
tukukuy = 100
ukhupi(n) { <~ n < tukukuy }
>> ukhupi(42) ¶         // → #1
```

Iskay unancha chayta tikranku, hinaspa iskayninku qillqakunku **firmapipas waqyay kaqpipas**:

```zymbol
yapachiy(yupay<~) { yupay = yupay + 1 }
tantasqa = 0
yapachiy(tantasqa<~)
>> tantasqa ¶              // → 1
```

> `p~` huk llamk'ay kopyam — ukhunqa kutin churayta atin, waqyaqtaq mana llamkasqachu qhipan.
> `p<~` huk lluqsiy parámetrom — tikrasqan kutin ripun. `yapachiy(tantasqa)` unanchawan mana kaqtinqa
> huk semántico pantaymi: unanchasqa firmawantaq mana t'aqakuyta atinkuchu.

---

## Lambda & Hap'iykuna

```zymbol
iskaychay = x -> x * 2
tantay = (a, b) -> a + b
>> iskaychay(5) ¶          // → 10
>> tantay(3, 7) ¶          // → 10
```

```zymbol
layanchay = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "cero"
}
>> layanchay(-4) ¶       // → negativo
```

```zymbol
factor = 3
kimsachay = x -> x * factor
>> kimsachay(7) ¶          // → 21
```

```zymbol
yapayruwaq(n) { <~ x -> x + n }
chunkayapaq = yapayruwaq(10)
>> chunkayapaq(5) ¶           // → 15
```

Huk lambdaqa manapunim parámetrota munanchu:

```zymbol
kutichiy = () -> 42
>> kutichiy() ¶           // → 42
```

> Huk lambdaqa qillqap variablenkunata **paqarichisqan pachapi** hap'in; sutiyuq ruwanataq
> **waqyasqan pachapi** ñawinchan.

---

## Huñusqakuna

```zymbol
huñu = [1, 2, 3, 4, 5]
>> huñu[1] ¶       // → 1   qillqasqan 1-manta qallarin
>> huñu[-1] ¶      // → 5   negativoqa tukukuymanta yupan
>> huñu$# ¶        // → 5   hunt'an
```

```zymbol
huñu = [1, 2, 3]
>> (huñu$+ 6) ¶          // → [1, 2, 3, 6]   yapay
>> (huñu$+[2] 99) ¶      // → [1, 99, 2, 3]  2 kaqpi churay
>> (huñu$- 3) ¶          // → [1, 2]         ñawpaq tinkusqanta qichuy
>> (huñu$-[1]) ¶         // → [2, 3]         1 kaqpi qichuy
>> (huñu$[1..2]) ¶       // → [1, 2]         t'ipiy, iskay puntankunapiwan
>> (huñu$? 3) ¶          // → #1             tarikun
```

Llapankumi `$`-wan qallarin, **huñu** unanchawan, hinaspa qatinku huk unanchawan ima ukhupi ruwasqanta willaq: `#` hayk'a kasqanta, `+` yapay, `-` qichuy, `?` kachkanchus tapuy. Hinaspa `??` hina, unancha iskay kutichisqaqa llapallanta ruwayta niyta munan: `$?` huk chanin kachkanchus tapun, `$??` mayqin kaqkunapichus tapun hinaspa llapanta kutichin.

```zymbol
huñu = [3, 1, 2]
>> (huñu$^+) ¶     // → [1, 2, 3]   wichaq
>> (huñu$^-) ¶     // → [3, 2, 1]   uraykuq
```

**Lluqsisqanpa kamachiynin.** Hukllan unanchan, muyuriq códigoqa ima ruwasqanwanmi kamachin: apaykachasqa kaqtinqa, **ruwan mosoqta** hinaspa ñawpaq kaqta mana llamk'anchu; wischusqa kaqtinqa, **tikran**.

```zymbol
huñu = [1, 2, 3]
kopya = huñu[2]$~ 99
>> huñu ¶                // → [1, 2, 3]
>> kopya ¶               // → [1, 99, 3]
huñu[2]$~ 99
>> huñu ¶                // → [1, 99, 3]
```

> **`=` manapunim huk huñuman qillqanchu.** `huñu[2] = 99` mana Zymbol-pa forma-nchu — `=`-qa huk SUTIMAN
> chaninta qun. Huk huñup t'aqanta tikrayqa `$~`-mi, llapan huñukunapipas.

`[…]`-qa hukllan layata hap'in, qhawasqataq kachkan; yachasqawan chaqrusqataq `#[…]`-wan **willakun**:

```zymbol
allin = #[1, "iskay", #1]
>> allin ¶                 // → [1, iskay, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Achka Kitipi Rikuna

`>` ukhu-ukhupi kaq ruwasqa hukchapi purin. Sapa `[…]` kaqmi huklla elementuman chayan, hayk'a ukhupi kachkaptinpas.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   fila 2, columna 3
>> m[-1>-1] ¶      // → 9   qhepa fila, qhepa columna
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          pampa: diagonal
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   churasqa: k'uchukuna
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` **manam** Zymbol-pa formanchu. Iskay kutipi qatisqa `[…]`-qa mana chaskisqachu, ñawinchanapaqpas
> qillqanapaqpas — sapa chayanapaq huk `[…]`-lla, `>`-taq t'aqasqankunap chawpinpi rin.

---

## Diccionariokuna

Huk tupla sutiyuq campokunayuqqa diccionariomi, v0.0.9-manta pacha `#(…)`-wan qillqasqa.

```zymbol
runa = #(suti: "Alice", watan: 25)
>> runa.suti ¶        // → Alice
>> runa["watan"] ¶ // → 25
```

```zymbol
runa = #(suti: "Alice", watan: 25)
akllasqa = "suti"
>> runa[akllasqa] ¶       // → Alice
```

Tikraqmi, sutichasqakunata yapayta atinchik, hinaspa muyuyta atinchik:

```zymbol
qullqa = #(pera: 4)
qullqa["manzana"]$~ 10
@ k:qullqa { >> k "=" qullqa[k] " " }
>> ¶                    // → pera=4 manzana=10
```

```zymbol
qullqa = #(pera: 4, manzana: 10)
@ (k, v):qullqa { >> k ":" v " " }
>> ¶                    // → pera:4 manzana:10
```

> `#()` ch'usaq diccionariomi, `()`-taq mana chayta atinmanchu — ch'usaq tuplapas kananmi tiyan.
> Sapallan `(a: 1)`-qa mana chaskisqachu, kay willaywan: *huk diccionarioqa `#(…)`-wan qillqakun*.
> Huk diccionarioqa sutichasqanwanmi tarikun, manapunitaq kaqnin lugarninwanchu, chayrayku `runa[1]`-qa pantaymi.

---

## Tuplakuna

Tuplakunaqa **mana tikraq** churasqan hina huñukunam, hukniraq layayuq chaninkunata hap'iq.

```zymbol
punto = (10, 20)
>> punto[1] ¶           // → 10
willaykuna = (42, "rimaykullayki", #1, 3.14)
>> willaykuna[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Imaymana yanqata tikrayta munay hukchallapi, ima unancha kaptinpas, pantaymi —
> mana tikraq kayqa chaninpa kaqninmi, manataq sapa `$` ukhupi huk excepciónchu.

---

## T'aqay

```zymbol
huñu = [10, 20, 30, 40, 50]
[a, b, c] = huñu
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
huñu = [10, 20, 30, 40, 50]
[ñawpaq, *puchu] = huñu
>> ñawpaq ¶              // → 10
>> puchu ¶               // → [20, 30, 40, 50]
```

```zymbol
punto = (100, 200)
(px, py) = punto
>> px " " py ¶          // → 100 200
```

```zymbol
runa = #(suti: "Ana", watan: 25)
#(suti: n, watan: a) = runa
>> n " " a ¶            // → Ana 25
```

> Imaynatachus qillqasqa, chaymi layanta rikuchin: `[…]`-qa hukllan huñuta hap'in, `(…)`-qa tuplata, `#(…)`-taq diccionariota.
> Qhepa sutiqa **puchuta millp'un**, chayrayku t'aqayqa manapunim hunt'anpi pantanchu —
> `(a, b, c) = (1,2,3,4,5)` qunmi `c = (3,4,5)`, ch'usaqtaq mana imapas qhipakuqtin.

---

## Hatun-Ñiqi Ruwanakuna

```zymbol
yupaykuna = [1, 2, 3, 4, 5]
>> (yupaykuna$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (yupaykuna$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (yupaykuna$< (0, (huñusqa, x) -> huñusqa + x)) ¶ // → 15
```

```zymbol
yupaykuna = [1, 2, 3, 4, 5, 6]
iskaychay(x) { <~ x * 2 }
hatunchu(x) { <~ x > 3 }
>> (yupaykuna$> iskaychay) ¶    // → [2, 4, 6, 8, 10, 12]
>> (yupaykuna$| hatunchu) ¶    // → [4, 5, 6]
```

```zymbol
willaykuna = [#(suti: "Carla", watan: 28), #(suti: "Ana", watan: 25)]
watanmanta = willaykuna$^ (a, b -> a.watan < b.watan)
>> watanmanta[1].suti ¶     // → Ana
```

> Huk sutiyuq ruwanaqa hatun-ñiqi ruwanaman **mana paréntesisniyuqchu** rin: `yupaykuna$> iskaychay`.
> `yupaykuna$> (iskaychay)` qillqayqa huk pantaymi ñawinchaypi, `(` -qa huk lambdata kichaqtin.

---

## Pipa Unancha

```zymbol
iskaychay = x -> x * 2
yapay = (a, b) -> a + b
hukyapay = x -> x + 1
>> (5 |> iskaychay(_)) ¶   // → 10
>> (10 |> yapay(_, 5)) ¶  // → 15
>> (5 |> iskaychay(_) |> hukyapay(_)) ¶ // → 11
```

---

## Pantaykunata Hap'iy

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "cerowan rakisqa" ¶   // → cerowan rakisqa
} :! {
    >> "waqniraq: " _err ¶
} :> {
    >> "tukuy kutipi ruwakun" ¶        // → tukuy kutipi ruwakun
}
```

| Laya | Hayk'aq |
|------|------|
| `##Div` | Cerowan rakisqa |
| `##Index` | Índice mana chaypi |
| `##Key` | Sutichasqa mana diccionariopi |
| `##Range` | Rangomanta lluqsisqa yupay |
| `##Type` | Mana kikin laya |
| `##Parse` | Datota ñawinchay pantay |
| `##IO` | Archivo / sistema |
| `##Network` | Redpi pantay |
| `##DB` | Base de datos |
| `##Time` | Mana kaq p'unchay |
| `##_` | Imaymana pantay (llapanta hap'iq) |

`!` **pantay hinaspa sinchi** unanchanmi, hinaspa iskay familia-pipas kikillantam ñawinchakun: `$!` huk chaninmanta pantaychus kasqanta tapun; `$!!`-taq, unancha iskay kutichisqawan, mana tapuspa hawaman apan.

> Kikin-bibliotecap pantayninkunaqa **llampu pantay chaninkunahina** kutimun, `$!`-wan qhawanaykipaq
> utaq `!?`-wan hap'inaykipaq, manataq wañuchinapaqchu. `$!!`-qa waqyaqman apan.

---

## Módulokuna

```zymbol
# yupay {
    #> { yapay, PI }

    PI := 3.14159
    yapay(a, b) { <~ a + b }
}
```

```zymbol
<# ./yupay => y

>> y::yapay(5, 3) ¶
>> y.PI ¶
```

```zymbol
# yachaywasi {
    #> { ukhuyapay => tantay }

    ukhuyapay(a, b) { <~ a + b }
}
```

Iskay módulo unanchakunaqa kaqllan yuyaymi, kunanqa qillqakunapi apaykachasqa: `#`-qa **kasqanmanta** willay ñiqinmi — ima kasqanta, manataq hayk'a chaninniyuq kasqantachu — hinaspa wach'iqa willakuy mayqin ladoman purisqanta willan:

```text
<#   wach'iqa haykun: haykuchiy, waq qillqamanta apamuy
#>   wach'iqa lluqsin: lluqsichiy, waq qillqakunaman quy
```

Huk unanchaqa wiñaypaq k'uchunpi tiyan, rikuchisqanman qhawaspa. Chayraykutaqmi `<~` lloq'e ladoman kutin (ruwanamanta lluqsispa) hinaspa `->` paña ladoman haykun (lambdap ukhunman).

> **Huk móduloqa willanmi imata lluqsichisqanta.** `#>` bloke **obligatoriomi** — mana churaqtinqa
> **E014**mi, `#> { }`-taq hinata huk módulo willan hawa-rikch'ayninqa ch'usaq kasqanta. `::`-qa huk ruwanata waqyan,
> `.`-taq huk mana tikraqta ñawinchan. Haykuchiykunallam, lluqsichiy bloke, literal-kunawan qallarichiykuna, ruwana-willaykunallam
> módulo ukhunpi rikhurinman; ima ruwakuq kaqpas **E013**mi.

---

## Kikin Biblioteca

Kikin módulokuna, waqkunahina haykuchisqa:

| Módulo | Ruwanakuna |
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

>> t::width("手番") ¶            // → 4   iskay simi-unancha, tawa kolumna
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

day = T::of(2026, 1, 31)
>> T::format(day, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(day, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term`-qa **rikuchiy kolumnakunata** tupun, manataq letrakunatachu: CJK-kuna hinaspa aswan emoji-kunaqa iskay kolumnayuqmi,
> chayrayku huk cuadrota `t::width`-wan ruray, manapunitaq `$#`-wanchu.
> `std/time`-pi huk kikin ratoqa epoch-manta pacha millisegundokunam. Huk p'unchawmanta uraqqa duraciónmi, huk
> p'unchawmanta hawaqqa calendariom — chayrayku huk killaqa kikin p'unchay killapi chayan, hark'asqa. `diff(a, b)`-qa
> `a - b`-mi, chayrayku ñawpaq kikin ratoqa negativo kutichinman.

---

## Q'ipikuna

Huk `.zyp`-qa askha qillqayuq programata hukllan apakuq archivoman q'ipin. **Fuente**pa archivonmi, manataq binariochu, chayrayku maypipas `zymbol` binario purisqanpi purin.

```bash
zymbol package myproject/ --script main.zy -o myproject.zyp
zymbol run myproject.zyp
```

> Archivoqa huk manifiestota (`zyp.toml`) apan, imaynachus qallariy script-ninkunata hinaspa
> munasqan motor versiónta willaspa. `zymbol run`-qa huk ratopaq carpetaman horqhospa chaymantam purichin,
> chayrayku códigoqa wischunapaqmi, ichaqa scriptniyki qillqasqanqa kikin llamk'ana carpetaykipi qhipakun.
> Playgroundpas `.zyp` archivokunata cargan.
> Playground sumak `.zyp` rimay.

---

## Yupay Qillqa Modo

Zymbol-qa yupaykunata qillqayta atin **69 Unicode yupay-qillqa layakunapi** — Devanagari, Arabic-Indic, Thai, Klingon pIqaD, Yupay Sinchi Qillqa, LCD t'aqasqan, hinaspa aswanta. Modoqa procesop llapan ukhunpi kikillanmi, lluqsichiyta llamk'achin; yupay-ruwayqa mana tikrasqachu.

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabic-Indic (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // ASCII-man kutichiy
```

```zymbol
x = 42
>> x ¶                  // → 42
#०९#
>> x ¶                  // → ४२
>> 3.14 ¶               // → ३.१४
>> #1 ¶                 // → #१
#09#
```

Imayna atisqa layap yupaynkunapas literal-mi qillqaypi:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Ñawinchayqa kikillanmi iskay ladomanta — huk yupayqa imaymana layapipas hamut'asqa kanmi:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#`-qa wiñaypaq ASCII-mi, chayrayku `#0`-qa tukuy layapi cero yupaymanta rikch'aypi t'aqasqa qhipan.
> `#,` `#^`-pas kawsaq layapi yupaynkunata qillqanku, hinaspa rakiqkunapas chaytam qatin —
> ichaqa iskayninqa manapunim tikrakunchu: `,`-qa huñun, `.`-taq rakin, tukuy layapipas.

---

## Chanin Unanchakuna

```zymbol
f = ##.42         // Float-man
i = ###3.7        // Int-man, redondeasqa    → 4
t = ##!3.7        // Int-man, khuchusqa  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Huk Floatqa yupay-qillqakunawan lluqsin, manapunitaq exponentehinachu, hinaspa qhepa `.0`-ta wischun —
> `##.42`-qa `42`-ta qillqan, Float kaspallantaq, `f#?`-pi rikhurisqan hina.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   mana pantaq: haykuchisqanta mana tikraspa kutichin
>> ##!'A' ¶        // → 65    huk Char-pa código puntun
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          iskay decimalman redondeay
>> #!2|pi| ¶       // → 3.14          iskay decimalman khuchuy
>> #,|1234567| ¶   // → 1,234,567     waranqa rakiqkuna
>> #^|12345.678| ¶ // → 1.2345678e4   científico qillqay
```

```zymbol
>> 0x41 ¶        // → A   hex
>> 0b01000001 ¶  // → A   binario
>> 0o101 ¶       // → A   octal
>> 0d65 ¶        // → A   decimal
```

> Huk base literal ASCII rangopi kaqqa **huk Char**mi: `0d65 == 'A'` lla `#1`, hinaspa
> `0d65 == 65` lla `#0`. Tawa basekunapas kikin Char-tam qillqanku.

---

## Shell Tinkuy

```zymbol
kunanpunchaw = <\ date +%Y-%m-%d \>
>> "Kunan punchaw: " kunanpunchaw
```

```zymbol
lluqsisqa = </"./subscript.zy"/>
>> lluqsisqa
```

> `<\ … \>`-qa stdout-ta stderrtawan hap'in, qhepa mosoq lineata qichuspa.
> `>< args`-qa CLI-p rimasqankunata huk qillqa-huñuman hap'in.

---

## Hunt'a Ejemplo: FizzBuzz

```zymbol
layanchay(yupay) {
    ? yupay % 15 == 0 { <~ "FizzBuzz" }
    _? yupay % 3  == 0 { <~ "Fizz" }
    _? yupay % 5  == 0 { <~ "Buzz" }
    <~ yupay
}

@ i:1..20 { >> layanchay(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (sapa mit'a huk linea)
```

---

## Imaynatas Unanchakuna Tinkunku

Kay yachana qillqa tukuyninpi kikin imatam rikuchkanki: **huk unanchaqa mana huk siq'i
yuyayman apananpaqchu, aswanpas askha unanchakunam hukllapi churasqa, sapankataq yuyayninwan
yapan.** Kunanqa llapanta yachaspaykiña, kaypim tukuy patrón.

Ñawpaqta hamun **mayqin pachapichus kachkanchik**:

| Unancha | Pacha | Maypim rikurqanki |
|------|-------|---------------|
| `$` | huk huñu | `$#` `$+` `$?` `$^-` |
| `@` | pacha, kutin-kutin ruwasqa | `@!` `@>` `@~` |
| `#` | ima *kasqan*, manapuni hayk'a chaninniyuq kasqanchu | `#?` `#(…)` `<#` `#>` |
| `>>` | ruwanamanta lluqsiy | `>>` `>>!` `>>?` |
| `<<` | ruwanaman haykuy | `<<` `<<\|` `<<\|?` |
| `?` | tapuy, mana kikinchaspa | `?` `_?` `??` `$?` |
| `!` | sinchi, utaq pantay | `@!` `$!` `!?` |

Chaymantataq hamun **imachus chaypi ruwakun**: `+` yapay, `-` qichuy, `^` allichay, `~` tikray,
`#` yupay, `|` huklla kaq, `:` suti watuy.

Hinaspa iskay kamachiykuna manapuni pantaqchu:

**Huk unancha iskay kutichisqaqa llapallantam ruwan.** `?` hukllata tapun, `??`-taq askha
casoskunata qhawan. `$?` huk chanin kachkanchus tapun, `$??`-taq llapan kachkan-kaqninkunata
kutichin. `!` pantayta rikuchin, `!!`-taq mana tapuspa hawaman apan.

**Modo unanchaqa wiñaypaq qhepapi hamun.** `?` utaq `!` rikhurispa *imaynatachus* ima
ruwakusqanta nisqaqa — manaraq allinta utaq sinchita — unanchap qhepa kaqninmi: `$??`, `$!!`,
`<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:hawa!`. Paykunap qhepanpiqa manapunim huk ruwaypas kanchu.

Chaymantam huk allin ruway lluqsimun: **manaraq rikusqayki tinkusqaqa ñam yuyayniyuqña,
manaraq maskhaspayki.** `$` huñu kaptin, `^` allichay kaptin, `-`-taq tikrasqa kaptinqa,
`$^-`-qa uraykuqta allichanmi, manam pipas willasunkichu.

Manataq llapan inventarioqa hinachu llamk'an, hinaspa chayta niyqa aswan allinmi ima pantasqata
rikuchiymanta. Aswan unanchakunaqa sut'inta t'aqakunku. Suqta t'aqakunku ichaqa
t'aqasqankunamanta aswanta niyta munanku: `!?` `:!` `:>` `|>` `::` `$++`. Chunkataq sunquwan
yachana, manapunim ni imaynapipas t'aqakunkuchu: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###`
`°`.

> Mana rikch'akuq unanchakunata yupayqa yachasqa ruwaymi, aswan pisillachu nispa yuyaymanta
> aswan allin — paykunam rimaypa chaninchasqa yuyayman apana costonqa. Hunt'a rikuna qillqa —
> inventario, willakusqa hukkaqlla-rikch'ay unanchakuna, hinaspa huk musuq unanchapaq
> kamachiykuna — `SYMBOLS.md`-pim, intérprete repositoriopi.

---

## Unanchakunap Rikuchaynin

| Unancha | Ruwasqan | Unancha | Ruwasqan |
|--------|-----------|--------|-----------|
| `=` | variable | `$#` | hunt'an |
| `:=` | mana tikraq | `$+` | yapay |
| `>>` | lluqsiy | `$+[i]` | índicepi churay (1-manta) |
| `<<` | haykuy | `$-` | chaninwan ñawpaqta qichuy |
| `¶` / `\\` | mosoq linea | `$--` | chaninwan llapanta qichuy |
| `?` | kunisyun | `$-[i]` | índicepi qichuy (1-manta) |
| `_?` | waqniraq kunisyun | `$-[i..j]` | rangopi qichuy (1-manta) |
| `_` | hukniraq / wildcard | `$?` | tarikun |
| `??` | tinkuchiy | `$??` | llapan índicekunata tariy (1-manta) |
| `\|\|` | utaq-akllay huk casopi | `$[s..e]` | t'ipiy (1-manta) |
| `@` | muyuy | `$>` | tukuchiy |
| `@ N { }` | N kutipi muyuy | `$\|` | akllay |
| `@!` | sayachiy | `$<` | huñuy |
| `@>` | qatiy | `$/ delim` | qillqa t'aqay |
| `@:suti { }` | sutiyuq muyuy | `$++ a b c` | tantay |
| `@:suti!` | sutiyuq sayachiy | `$~~[p:r]` | qillqapi tikray |
| `@:suti>` | sutiyuq qatiy | `$*` | qillqa mirachiy |
| `->` | lambda | `arr[i]$~ v` | hukllan tikrana forma |
| `<~` | kutiy / lluqsiy parámetro | `~` | llamk'ay kopya parámetro |
| `arr[i>j]` | puriq índice | `arr[p ; q]` | pampa horqhoy |
| `$^+` | wichaqta allichay | `$^-` | uraykuqta allichay |
| `$^` | comparadorwan allichay | `\|>` | pipa |
| `!?` | watiqay | `:!` | hap'iy |
| `:>` | puchukaypi | `$!` | pantaychus |
| `$!!` | pantayta hawaman apay | `#1` / `#0` | chiqap / llulla |
| `##_` | Ch'usaq — mana kaynin | `[…]` | huñu, hukllan laya |
| `#[…]` | huñu, chaqrusqa willasqa | `#(…)` | diccionario |
| `(…)` | churasqan tupla | `#()` | ch'usaq diccionario |
| `<#` | haykuchiy | `#>` | lluqsichiy |
| `#` | módulota willay | `::` | módulota waqyay |
| `.` | campo / mana tikraqta ñawinchay | `#?` | layap willaynin |
| `#\|..\|` | yupayta ñawinchay | `##.` | Float-man tikray |
| `###` | Int-man tikray (redondeasqa) | `##!` | Int-man tikray (khuchusqa) |
| `#.N\|..\|` | redondeay | `#!N\|..\|` | khuchuy |
| `#,\|..\|` | waranqa rakiqkuna | `#^\|..\|` | científico qillqay |
| `#d0d9#` | yupay modota tikray | `#09#` | ASCII-man kutichiy |
| `<\ ..\>` | shell ruray | `><` | CLI rimasqan |
| `\ var` | variableta wañuchiy | `°x` / `x°` | q'uñi kaynin |
| `>>\|` | TUI bloke (huk kaq pantalla) | `>>~` | churasqan lluqsichiy |
| `>>!` | pantallata pichay | `>>?` | terminalta tupuy |
| `<<\|` | suyaspa tecla | `<<\|?` | mana suyaspa tecla |
| `@~ N` | N millisegundota puñuy | `0d` `0x` `0o` `0b` | base literalkuna |

---

## Musuqchay Willay

### v0.0.9 — Huñukuna Akllasqaña _(Setiembre 2026)_

- **T'unichiq** Diccionarioqa kikin qillqayniyuqmi: `#(sutichasqa: chanin)`. Sapallan `(a: 1)`-qa mana chaskisqachu, `#()`-taq ch'usaq diccionariom — manam `()` chayta atinmanchu
- **T'unichiq** Índicewan qillqayqa qichusqa: `huñu[i] = v` hinaspa llapan compuesto formankunapas. `=`-qa huk SUTIMAN chaninta qun; huk huñup t'aqanta tikrayqa `$~`-mi
- **T'unichiq** Qatisqa índice `m[i][j]`-qa mana chaskisqachu ñawinchanapaqpas qillqanapaqpas — `>`-mi t'aqasqankunap chawpinpi rin
- **T'unichiq** Huk móduloqa willananmi imata lluqsichisqanta (**E014**); `#> { }`-qa ch'usaq hawa-rikch'ayninta willan
- **T'unichiq** Muyuyp especificadorninqa yupaymi utaq kunisyunmi — manapuni truthiness. `@ []` hinaspa `@ 3.5`-qa mana chaskisqachu
- **Yapasqa** `##_` — Ch'usaq literal, hinaspa imaynatas huk ruwana ima ch'usaq kasqanta tapukun
- **Yapasqa** `#[…]` — huk huñu, ima elementonkunap layan chaqrusqa willasqa
- **Yapasqa** `#?`-qa tawa huñukunata t'aqarichin: `##]` `##[` `##)` `##(`
- **Yapasqa** `std/time` — relojwan calendariowan, zonankunawan hinaspa calendario-ruwaywan
- **Yapasqa** Qillqap ñawpaq nivelninpi `<~`-qa ruwanap lluqsiy chaninnin
- **Yapasqa** `@ (k, v):pairs` — huk rikch'ay muyuyp umanpi
- **Yapasqa** `#|c|`-qa huk yupayta 69 layamanta ima layapipas ñawinchan; `#,` `#^`-taq kawsaq layapi qillqanku
- **Tikrasqa** `Int`-qa huk yupay chiqanmi, ±(2⁵³ − 1), tukuy motorpi hark'asqa
- **Tikrasqa** Huk sutiyuq ruwanaqa qillqap variablenkunata waqyasqan pachapi, chaninnillanta, ñawinchan
- **Tikrasqa** Huk nisqa sutillata ñawinchaqqa alvertencia rikuchin, manataq ch'inlla pasananpaqchu
- **Motorkuna** 666 corpus qillqamanta 660-qa kimsa motorpi kikinchasqam, 0 mana kikinchu

### v0.0.8 — Kikillan Qichuy, `std/term` & Q'ipikuna _(Agosto 2026)_

- **Yapasqa** Kikillan wañuchiy qhepa apaykachaypi — mana rikhuriq; hukllan aswan hatun memoriata pisiyachin
- **Yapasqa** `std/term` — rikuchiy tupuykuna terminal kolumnakunapi
- **Yapasqa** `##!` huk `Char`-pi — Unicode código puntun
- **Yapasqa** Tinkuchiypi utaq-rikch'aykuna: `'p' || 'P' => …`, imayna layapas akllanakuna huk casollapi
- **Yapasqa** Zymbol Q'ipikuna (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Yapasqa** `<~` waqyay kaqpiqa obligatoriomi, maypichus waqyasqa ruwanaqa huk lluqsiy parámetrota willan
- **Allichasqa** Módulo-sistemap kikinchaynin register VM-pi

### v0.0.7 — Kikin Biblioteca _(Julio 2026)_

- **Yapasqa** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — llapanku llampu pantay chaninkunawan
- **Yapasqa** Layayuq/qhawasqa haykuy: `<< ##.(5,2) "chanin: " p`
- **Yapasqa** Postfix unanchakuna kikin `>>`-pi — manapunim paréntesis munanchu
- **Tikrasqa** Hark'asqa formateador: mana chaskinchu qillqayta, mana kutin ñawinchayta atisqanta

### v0.0.6 — Allichay & Yachay Biblioteca _(Junio 2026)_

- **T'unichiq** `=>`-qa `:`-ta rantin tinkuchiy casoskunapi, hinaspa `<=`-ta haykuchiy/lluqsichiy sutichaykunapi
- **Yapasqa** `std/math` hinaspa `std/random`
- **Yapasqa** Diccionariota sutichasqanwan tikray: `d["k"]$~ chanin`

### v0.0.5 — TUI Kikin Unanchakuna & Q'uñi Kaynin _(Mayo 2026)_

- **Yapasqa** TUI bloke `>>| { }`, churasqan lluqsichiy `>>~`, tecla haykuy `<<|` hinaspa `<<|?`
- **Yapasqa** `>>!` pantallata pichay, `>>?` terminal tupuy, `@~ N` puñuy
- **Yapasqa** Q'uñi kaynin `°x` / `x°`, hinaspa qillqa mirachiy `$*`

### v0.0.4 — 1-Manta Índice & Ñawpaq Laya Ruwanakuna _(Abril 2026)_

- **T'unichiq** Llapan índiceqa **1-mantam** — `huñu[1]`-qa ñawpaq elementonmi
- **Yapasqa** Sutiyuq ruwanakuna ñawpaq laya chaninkunahina; módulo bloke qillqay `# suti { }`
- **Yapasqa** Achka kitipi índice `huñu[i>j>k]` hinaspa pampa horqhoy `huñu[p ; q]`

### v0.0.3 — Unicode Yupay Sistemankuna _(Abril 2026)_

- **Yapasqa** 69 Unicode yupay-qillqa bloke, `#d0d9#` modo-tikray token-ninwan
- **Yapasqa** Bool literalkuna imayna layapipas — `#१` / `#०`

### v0.0.2 — Huñup API Musuqmanta Ruwasqa _(Marzo 2026)_

- **Yapasqa** `$` unancha ayllu huñukunapaq qillqakunapaqwan
- **Yapasqa** T'aqay qillqay, hinaspa negativo índicekuna

### v0.0.1 — Qallariy Kikin Lluqsisqa _(Marzo 2026)_

- Sach'a-puriq intérprete + register VM (`--vm`)
- Llapan kikin ruwasqankuna: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Hunt'a Unicode sutikuna, módulo sistema, lambdakuna, hap'iykuna, pantaykunata hap'iy
- REPL, LSP, VS Code yapasqa, formateador (`zymbol fmt`)

---

_Zymbol-Lang — Unanchawan. Tukuy Pachapaq. Mana Tikraq._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Licencia:** kay yachana qillqaqa [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) ukhupi licenciasqam — © 2024-2026 Zymbol-Lang Team. Hunt'a qillqa: `LICENSE-CC-BY-SA-4.0` <https://github.com/zymbol-lang/web>-pi. Intérpreteqa hinaspa navegador motorpas (`zymbol.js`) hukniraq llamk'aykunam, AGPL-3.0-only ukhupi licenciasqa.
