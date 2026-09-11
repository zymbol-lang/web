> **Willakuy:** Kay qillqasqata ruwarqanku hinaspa tikrarqanku inteligencia artificial (IA) yanapawaqninwan.
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> Chiqaq qillqaqa kanmi **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** nisqapi, intérprete repositorionpi.

---

# Zymbol-Lang Qillqa

> **Musuqyachisqa v0.0.9 paq — 2026-09-07**

**Zymbol-Lang** nisqaqa simbolo rimaywan ruwana simikuna kanku. Manam simikunachu grammar-ninpi — sapa ruwana huk siñalmi. Tukuy runa-simipi kaqllatataq ruwakun.

- Manam `if`, `while`, `return` nisqachu — `?`, `@`, `<~` sapallanku
- Tukuy Unicode — sutikuna imayna simipipas utaq emoji-pipas
- Manam huk runasiminmanchu wataraykun — kaqllan qillqasqaqa maypipas

**Intérprete versionnin**: v0.0.9 | **Pruebakuna tarikusqan**: 660/666 (kimsantin makinakuna kaqllata ninku, 0 mana kaqllata)

---

## Tikraqkuna hinaspa Mana Tikraqkuna

```zymbol
x = 10              // tikraq tikrayta atiq
PI := 3.14159       // mana tikraq — hukmanta churay pantaymi
suti = "Alicia"
kawsaq = #1         // chiqaq booleano
👋 := "Napaykuy"
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

`°` (grado siñal, U+00B0) huk tikraqta kikillanmanta qallarichin, ñawpaq apaykachasqanpi:

```zymbol
yupaykuna = [3, 1, 4, 1, 5]
@ n:yupaykuna {
    °tukuy += n
}
>> tukuy ¶              // → 14
```

> `°x` (ñawpaqpi) muyuymanta hawapi hark'akun — tukusqanqa `@` qhipata ñawinchakunmi.
> `x°` (qhipapi) muyuy ukhupi hark'akun — muyuy tukukuptin wañunmi.

Huk rimasqa sutillan kaq, tikraqta ñawinchan hinaspa chaninta wikch'un, chaymi ninmi:

```zymbol
yupay = 5
yupay
```

Compilador-qa ninmi:

```text
warning: this statement does nothing: 'yupay' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

---

## Willaykuna Layankuna

| Laya | Qillqasqa | `#?` siñal | Willakuykuna |
|------|---------|----------|-------|
| Yupay | `42`, `-7` | `###` | Allin yupay: ±(2⁵³ − 1) |
| Float | `3.14`, `1.5e10` | `##.` | IEEE-754 double |
| Simi | `"qillqa"` | `##"` | Ukhupi churay: `"Napaykuy {suti}"` |
| Qillqa | `'A'` | `##'` | Huk Unicode código punto |
| Bool | `#1`, `#0` | `##?` | Manam yupaychu — `#1 ≠ 1` |
| Tantasqa | `[1, 2, 3]`| `##]` | Huk laya, qhawasqa |
| Chikanniyoq tantasqa | `#[1, "iskay"]` | `##[` | Kaqllan laya `[…]` hina, mana qhawasqa |
| Churasqa | `(a, b)` | `##)` | Kitinpi churasqa, mana tikrachikuq |
| Sutichasqa | `#(x: 1, y: 2)` | `##(` | Llavinwan, tikrachikuq |
| Ruwana | sutiyoq ruwanaman rikch'ay | `##()` | Ñawpaq laya; `<funct/N>` rikhurin |
| Lambda | `x -> x * 2` | `##->` | Ñawpaq laya; `<lambd/N>` rikhurin |
| Manaima | `##_` | `##_` | Mana kasqan — mana null kanchu |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(a: 1)#? ¶          // → (##(, 1, #(a: 1))
```

Huk yupay allin karumanta lluqsiptinqa, hapiy atina pantaymi, manam upallalla tikrakunchu:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "karupi" ¶ // → karupi
}
```

`##_` nisqawanmi huk ruwana tapun imapas mana kasqanta:

```zymbol
manaima() { }
chani = manaima()
>> (chani == ##_) ¶     // → #1
```

---

## Lluqsiy hinaspa Yaykuy

```zymbol
suti = "Qoyllur"
tukuy = 3
>> "Napaykuy" ¶            // → Napaykuy
>> "a=" suti " b=" tukuy ¶ // → a=Qoyllur b=3
>> tukuy#? ¶            // → (###, 1, 3)
```

```zymbol
<< suti
<< "Sutiykita qillqay: " suti
<< ###(4) "Watayki: " wata
```

**Qhaway ima hina kasqanta iskay siñalkuna.** `>>` hawaman siqan: programamanta willayta lluqsichin. `<<` ukhuman siqan: willayta yaykuchin. Manam yuyayninchikpi hap'inanchikchu — flechaqa rikuchin maynin willay purisqanta, hinaspa kaq yuyayllataqmi sapa siñalpi kutin, imapas kuyuchiqpi.

> `¶` hinaspa `\\` kaqllan musuq siqikunam. `>>` mana ni hayk'aqpas yapanchu.
> Huk layaspec tapuy ñawpaqpiqa, ñawinchaspa qhawan hinaspa mana allinchu kaptinqa hukmanta tapullantaq:
> `##.` Float · `##.(T,D)` decimal · `###(N)` Yupay · `##"(N)` simi · `##'` huk Qillqa.

Huk qillqasqap patanpi, `<~` nisqaqa programap lluqsisqan kasqanmi:

```zymbol
>> "qhawaspa" ¶         // → qhawaspa
<~ 0
```

---

## TUI Sapallan Ruwanakuna

Terminal UI ruwanakuna, kuska-purisqa programakunapaq. Achkanmi `>>| { }` bloqueta munan (waqllin pantalla + qhapaq mode).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Purichkan"
    @~ 1000
    >>~ (2, 1) > "Tukusqa."
}
```

```zymbol
>>| {
    [wiñay, kinray] = >>?
    >>~ (1, 1) > "Terminal: " wiñay " x " kinray
    <<| ñitina
    >>~ (2, 1) > "Ñit'isqa: " ñitina
}
```

Kaypin rikunki imaraykutaq siñalkuna huñunakunku, manam mirachikunkuchu. Yachankiñam `<<` yaykuy kasqanta hinaspa `?` mana hap'ispa tapusqanta. Huk siñallanmi musuq:

- `|` huk sapalla unidad, manam tukuy phawaq riachu.

Chaywanmi, iskayninku teclado ruwanakuna kikillanmanta ñawinchakunku:

```text
<<        |            ?
yaykuy    huk unidad   mana hap'ispa

<<|   HUK ñitinata hap'iy, hinaspa suyay hukña kanankama
<<|?  qhaway huk ñitina KACHUN, hinaspa manaqa qatiriy
```

Kaqllantaq huk ladopi: `>>` lluqsichin, `>>!` **kallpawan** lluqsichin (tukuy pantallata chusaqyachin), hinaspa `>>?` **tapun** qillqaymanta rantinpi (hayk'a hatun terminal kasqanta). Paña ladopi siñalqa modo tikraqmi, hinaspa qhipantaqa sapa kutin.

> `>>!` pantallata chusaqyachin. `>>?` `(wiñay, kinray)` kutichin. `@~ N` N milisegundos puñun.
> `<<|` huk ñitinata ñawinchan (suyaspa); `<<|?` mana suyaspa qhawan (`'\0'` mana kaptin).
> Flecha ñitinakuna decodificasqa hamunku `'↑' '↓' '←' '→'` hina; ESC nisqaqa 27 código punto.
> Kitisqa lluqsiy churasqa: `(hilera, kinray, BKS, fg, bg)` — imapas kiti wikch'unaqa comawan wikch'un (`>>~ (,,, 196) > "puka"`).
> BKS bitmask: `1`=Kallpasqa qillqa, `2`=Kumusqa, `4`=Sirasqa. ANSI 256-color paleta (`0`=terminal kikillan).

---

## Ruwanakuna

```zymbol
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (yupay huntachiyllawan)
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

> `==` manam ni hayk'aqpas tikrachikunchu: `"5" == 5` `#0`mi. Churay laya-qa hukninmi:
> `"5" > 4` `#1`mi, hinaspa `"४२" > 5` kaqllataq — imapas 69 escritura yupayninpi qillqasqa
> yupay hina qhawasqa kanmi.
> Huk ruwanaqa pay kikillanwanlla kaqllan, manam huknin ruwanawanchu, kaqlla ukhu kaqtinpas.

---

## Simikuna

```zymbol
suti = "Qoyllur"
n = 42
>> "Napaykuy " suti " " n " watayoqmi kanki" ¶ // → Napaykuy Qoyllur 42 watayoqmi kanki
willakuy = "Napaykuy {suti}, {n} watayoq kanki"
>> willakuy ¶               // → Napaykuy Qoyllur, 42 watayoq kanki
```

```zymbol
s = "Allillanchu Pacha"
suni = s$#                  // 17
sub = s$[1..5]             // "Allil"
kan = s$? "Pacha"          // #1
t'iqrisqa = "a,b,c,d"$/ ','    // [a, b, c, d]
tikrasqa = s$~~["l":"L"]        // "ALLiLLanchu Pacha"
siqi = "─" $* 20
```

> `+` yupaykunallapaqmi. Simikunapaqqa churanakuyta utaq ukhupi churayta apaykachay.
> `\{` hinaspa `\}` kikin llaveskunam — escape-qa iskay ladopi kaqllan.

---

## Purisqan Kamachiy

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

Iskay musuq siñalkuna kaypi, hinaspa kimsakaq siñalmi, chaykunata huñuspa lluqsimuq:

- `?` nisqaqa **tapuyllam**: huk kondiсionta kichan.
- `_` nisqaqa **mana nisqa**: mana ima tapuypas tupaptin lluqsina ñan.
- `_?` nisqaqa iskayninmi qatisqa: *mana imapas tupanchu chayqa, hukmanta tapuy*.

Chaymi `_?` qillqasqa kanmi kay hinata. Manam musuq siñalchu yachana — `_`mi kanmi, `?` qatimuqniyoq, hinaspa exactamente ninmi imaynatas iskayninku ñawpaqta ninku.

> `{ }` llaveskuna **munasqam**, huk rimasqallapaqpas.

---

## Tinkuchiy

```zymbol
yupasqa = 85
qillqa = ?? yupasqa {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> qillqa ¶              // → B
```

```zymbol
temperatura = -5
kasqan = ?? temperatura {
    < 0  => "rit'i"
    < 20 => "chiri"
    _    => "quñi"
}
>> kasqan ¶              // → rit'i
```

Yachankiñam `?` nisqata "tapuy" hina. **`??` nisqaqa achka kutis tapuymi**: huk siñalta iskaychaspaqa, imaynapipas kay simipi, huk kutilla ruwananta achka kutis ruwaymi. Huk `?` huk kondiciontam qhawan; `??` qa achka kaqkunata qhawan.

Huknin ñankunaqa `||` wanku, hinaspa chikan layanpi patachikunku:

```zymbol
ñitina = 'P'
ruwasqan = ?? ñitina {
    'p' || 'P' => "samay"
    < 0 || > 100 => "karupi"
    _ => "qunqasqa"
}
>> ruwasqan ¶             // → samay
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
@ c:"Allillanchu" { >> c "-" }
>> ¶                    // → A-l-l-i-l-l-a-n-c-h-u-
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

`@` nisqaqa **pachap** siñalninmi: imapas kutin-kutin ruwakuqqa paypi kawsan. Chay pachata pisiyachinapaqqa huk siñalta patanpi churanki:

- `@!` — `!` nisqaqa **kallpam**: muyuymanta kunanmi lluqsinki.
- `@>` — `>` ñawpaqman tanqan: qatiq muyuyman phawariy.
- `@:hawa!` — `:` nisqaqa **huk sutita hap'in**, chaymi mana ñawpaq muyuytachu p'itin, hawa sutiyoqtam p'itin.

Kimsa ruwanakunam, hinaspa mana huknillanpas sapachanpi yachana kanchu: `@` kanku, huk siñalwan chayllañataq imayna ruwananta ninña.

> **Huk specifier nisqaqa yupay utaq kondicionmi.** Huk `Yupay` nisqaqa yupay huklla kutilla
> qhawasqa — `@ 0` cuerpo-taqa manam ni hayk'aqpas ruwanchu. Huknin ima kaqpas kondicionmi.
> Manam "chiqaq hina" nisqachu kan: `@ []` hinaspa `@ 3.5` mana chaskisqachu kanku. Huk
> tantasqata purinapaqqa `@ x:tantasqa` apaykachay; yupanapaqqa `@ tantasqa$#`.

---

## Ruwanakuna (Funciones)

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

Huk ruwanaqa qillqasqap tikraqninkunata chaninwan ñawinchan, hinaspa ukhupi qillqaqqa ukhullapi qhipakun:

```zymbol
kancha = 100
kanchapi(n) { <~ n < kancha }
>> kanchapi(42) ¶         // → #1
```

Iskay siñalmi chayta tikranku, hinaspa iskayninkumi qillqasqa kanku **firmapi hinaspa waqyaypi**:

```zymbol
wicharichiy(yupay<~) { yupay = yupay + 1 }
tukuy = 0
wicharichiy(tukuy<~)
>> tukuy ¶              // → 1
```

> `p~` nisqaqa llamk'ay rikch'am — cuerpo-qa hukmanta churayta atin, waqyaqtaq mana llamiy.
> `p<~` nisqaqa lluqsichiy tikraqmi — tikrasqan kutinmi. `wicharichiy(tukuy)` mana siñalniyoq
> pantaymi kanman: siñalwan firmawanqa mana t'aqakuyta atinkuchu.

---

## Lambda hinaspa Hapisqakuna

```zymbol
iskaychay = x -> x * 2
yapay = (a, b) -> a + b
>> iskaychay(5) ¶          // → 10
>> yapay(3, 7) ¶          // → 10
```

```zymbol
taqay = x -> {
    ? x > 0 { <~ "positivo" }
    _? x < 0 { <~ "negativo" }
    <~ "chusaq"
}
>> taqay(-4) ¶       // → negativo
```

```zymbol
mirachiq = 3
kimsachay = x -> x * mirachiq
>> kimsachay(7) ¶           // → 21
```

```zymbol
yapay_ruwaq(n) { <~ x -> x + n }
yapay_chunka = yapay_ruwaq(10)
>> yapay_chunka(5) ¶           // → 15
```

Huk lambda-qa manam ni huk tikraqniyoqpas kanman atin:

```zymbol
tarisqa = () -> 42
>> tarisqa() ¶           // → 42
```

> Huk lambda-qa qillqasqap tikraqninkunata **paqarichisqan pachapi** hap'in; sutiyoq ruwanataq
> waqyasqan pachapi ñawinchan.

---

## Tantasqakuna

```zymbol
tantasqa = [1, 2, 3, 4, 5]
>> tantasqa[1] ¶       // → 1   kitiqa 1manta qallarin
>> tantasqa[-1] ¶      // → 5   negativoqa tukuymanta yupan
>> tantasqa$# ¶        // → 5   suni
```

```zymbol
tantasqa = [1, 2, 3]
>> (tantasqa$+ 6) ¶          // → [1, 2, 3, 6]   tukuypi yapay
>> (tantasqa$+[2] 99) ¶      // → [1, 99, 2, 3]  2 kitipi churay
>> (tantasqa$- 3) ¶          // → [1, 2]         ñawpaq rikurisqanta qichuy
>> (tantasqa$-[1]) ¶         // → [2, 3]         1 kitipi qichuy
>> (tantasqa$[1..2]) ¶       // → [1, 2]         kuchusqa, iskayninpas kachkan
>> (tantasqa$? 3) ¶          // → #1             kanmi
```

Tukuyninmi `$` niraq qallarinku, **tantasqap** siñalnin, hinaspa huk siñalwan qatinku ima ruwakusqanta: `#` hayk'a kasqan, `+` yapay, `-` qichuy, `?` kan-chu tapuy. Hinaspa `??` hina, siñalta iskaychayqa tukuypi ruwayta niyta munan: `$?` tapun huk chani KAN-chu, `$??` tapun MAYQIN kitipi kasqanta hinaspa tukuyninta kutichin.

```zymbol
tantasqa = [3, 1, 2]
>> (tantasqa$^+) ¶     // → [1, 2, 3]   wichayman
>> (tantasqa$^-) ¶     // → [3, 2, 1]   uraykuman
```

**Tukusqanpa kamachiynin.** Huklla ruwanam, hinaspa muyuriqnin código-qa imatas paywan ruwan chaymi churan: apaykachasqa kaptinqa **ruwan** musuqta hinaspa ñawpaqta mana llamin; wikch'usqa kaptintaq **tikran**.

```zymbol
tantasqa = [1, 2, 3]
rikcha = tantasqa[2]$~ 99
>> tantasqa ¶                // → [1, 2, 3]
>> rikcha ¶               // → [1, 99, 3]
tantasqa[2]$~ 99
>> tantasqa ¶                // → [1, 99, 3]
```

> **`=` nisqaqa manam ni hayk'aqpas huk tantasqa ukhumanchu qillqan.** `tantasqa[2] = 99`
> manam Zymbol forma-chu kanman — `=` nisqaqa huk SUTIMAN chanin qun. Huk tantasqap huk
> t'aqanta tikrayqa `$~` mi, tukuy tantasqakunapipas.

`[…]` huklla layata waqaychan hinaspa qhawasqa kanmi; munaywan chikanniyoqta **willanku** `#[…]`wan:

```zymbol
chikan = #[1, "iskay", #1]
>> chikan ¶                 // → [1, iskay, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Achka Muyuriq Kitisqa

`>` huk t'inkisqa ukhuman uraykun. Huk grupo corchete-kunam huk elementota kitin, hayk'a ukhu kaptinpas.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   2 hilera, 3 columna
>> m[-1>-1] ¶      // → 9   qhipa hilera, qhipa columna
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          pallasqa: diagonal
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   t'inkisqa: k'uchukuna
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` **manam** Zymbol forma-chu kanman. Chay t'inkisqa kiti mana chaskisqachu kanmi,
> ñawinchanapaqpas qillqanapaqpas — huklla corchete grupo sapa yaykunapaq, hinaspa `>`
> nisqaqa pasos-kuna chawpipi churakunmi.

---

## Sutichasqakuna

Huk churasqa sutiyoq campos-niyoqqa sutichasqam kanmi, hinaspa v0.0.9 watamantaqa `#(…)` hinam qillqakun.

```zymbol
runa = #(suti: "Qoyllur", wata: 25)
>> runa.suti ¶        // → Qoyllur
>> runa["wata"] ¶     // → 25
```

```zymbol
runa = #(suti: "Qoyllur", wata: 25)
llavi = "suti"
>> runa[llavi] ¶        // → Qoyllur
```

Tikrachikuqmi, llavikunata yapayta atinmi, hinaspa purichikunmi:

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

> `#()` nisqaqa ch'usaq sutichasqam, chaytaqa `()` mana atinmanchu — ch'usaq churasqapas kananmanmi karqan. Manam churasqallan `(a: 1)` mana chaskisqachu kanmi, kay ninanwan:
> *a dictionary is written `#(…)`*.
> Huk sutichasqaqa llavinwanmi kitin, manam ni hayk'aqpas kitinwanchu, chaymi `runa[1]`
> pantaymi kanman.

---

## Churasqakuna

Churasqakunaqa **mana tikrachikuq**, kitinpi churasqa, chikan layakunata hapiq kanku.

```zymbol
kiti = (10, 20)
>> kiti[1] ¶           // → 10
willaykuna = (42, "napaykuy", #1, 3.14)
>> willaykuna[3] ¶           // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Huk churasqata ukhullanpi tikrayta munayqa pantaymi kanman, ima siñalpas kaptinpas —
> mana tikrachikuqqa chanip kikinmi, manam sapa `$` ukhupi huk excepciónchu.

---

## T'aqasqa Churakuykuna

```zymbol
tantasqa = [10, 20, 30, 40, 50]
[a, b, c] = tantasqa
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
tantasqa = [10, 20, 30, 40, 50]
[ñawpaq, *puchu] = tantasqa
>> ñawpaq ¶              // → 10
>> puchu ¶              // → [20, 30, 40, 50]
```

```zymbol
kiti = (100, 200)
(px, py) = kiti
>> px " " py ¶      // → 100 200
```

```zymbol
runa = #(suti: "Kusi", wata: 25)
#(suti: n, wata: a) = runa
>> n " " a ¶            // → Kusi 25
```

> Corchete forma-qa layayoqmi: `[…]` huk tantasqata hap'in, `(…)` huk churasqata, `#(…)`
> huk sutichasqata. Qhipa sutiqa **puchuqta hap'iqmi**, chaymi t'aqasqa churakuyqa manam ni
> hayk'aq suninwan pantanchu — `(a, b, c) = (1,2,3,4,5)` ninmi `c = (3,4,5)`, hinaspa `##_`
> mana imapas puchuptin.

---

## Ruwanakuna Hatunkaray Layapi

```zymbol
yupaykuna = [1, 2, 3, 4, 5]
>> (yupaykuna$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (yupaykuna$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (yupaykuna$< (0, (acc, x) -> acc + x)) ¶ // → 15
```

```zymbol
yupaykuna = [1, 2, 3, 4, 5, 6]
iskaychay(x) { <~ x * 2 }
hatunchu(x) { <~ x > 3 }
>> (yupaykuna$> iskaychay) ¶    // → [2, 4, 6, 8, 10, 12]
>> (yupaykuna$| hatunchu) ¶    // → [4, 5, 6]
```

```zymbol
runakuna = [#(suti: "Sisa", wata: 28), #(suti: "Kusi", wata: 25)]
watanmanta = runakuna$^ (a, b -> a.wata < b.wata)
>> watanmanta[1].suti ¶     // → Kusi
```

> Huk sutiyoq ruwanaqa Hatunkaray Layaman **mana corchetesniyoqchu** riq: `yupaykuna$> iskaychay`. `yupaykuna$> (iskaychay)` qillqayqa parse pantaymi, `(` nisqaqa huk lambdata kichan chayrayku.

---

## Qatichiy Siñal

```zymbol
iskaychay = x -> x * 2
yapay = (a, b) -> a + b
wicharichiy = x -> x + 1
>> (5 |> iskaychay(_)) ¶   // → 10
>> (10 |> yapay(_, 5)) ¶  // → 15
>> (5 |> iskaychay(_) |> wicharichiy(_)) ¶ // → 11
```

---

## Pantaykuna Hap'iy

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "chusaqwan taqasqa" ¶   // → chusaqwan taqasqa
} :! {
    >> "hukniraq: " _err ¶
} :> {
    >> "sapa kuti ruwakun" ¶        // → sapa kuti ruwakun
}
```

| Laya | Hayk'ap |
|------|------|
| `##Div` | Chusaqwan taqasqa |
| `##Index` | Kiti karupi |
| `##Key` | Llavi mana kanchu sutichasqapi |
| `##Range` | Allin yupay karumanta lluqsisqa |
| `##Type` | Laya mana tupan |
| `##Parse` | Willaykuna tikrasqapi pantay |
| `##IO` | Archivo / sistema |
| `##Network` | Red pantaykuna |
| `##DB` | Qullqa (base de datos) |
| `##Time` | Mana kaq p'unchay |
| `##_` | Ima pantaypas (tukuyta hapiq) |

`!` nisqaqa **kallpap hinaspa pantaymanta** siñalninmi, hinaspa iskayninku ayllupi kaqllatam ñawinchakun: `$!` huk chanita tapun pantay kachun; `$!!`, siñal iskaychasqawan, hawaman apachin mana tapuspa.

> Biblioteca estándar pantaykunaqa **llamp'u pantay chaninkuna** hina kutimunku, chaykunata
> `$!` nisqawan qhawaspa utaq `!?` nisqawan hap'ispa, manam wañunanpaqchu. `$!!` waqyaqman
> apachin.

---

## Moduluskuna

```zymbol
# calc {
    #> { yapay, PI }

    PI := 3.14159
    yapay(a, b) { <~ a + b }
}
```

```zymbol
<# ./calc => c

>> c::yapay(5, 3) ¶
>> c.PI ¶
```

```zymbol
# libniy {
    #> { ukhu_yapay => yapay }

    ukhu_yapay(a, b) { <~ a + b }
}
```

Iskay modulo siñalkunaqa ñawpaqmanta kaq yuyaymi, kunanqa archivo-kunapi apaykachasqa: `#` nisqaqa **willay** nivelmi — imaynas huk kaq *kasqan*, manam imay chaninnin — hinaspa flechaqa nin maynin código puriyta:

```text
<#   flecha yaykun: yaykuchiy, huk archivomanta apamuy
#>   flecha lluqsin: lluqsichiy, huknin archivokunaman qumuy
```

Huk direccion siñalqa sapa kutin rikuchisqan lado k'uchupi churakunmi. Kaqllan razonmi
`<~` lloq'e ladoman kutin (ruwanamanta lluqsin) hinaspa `->` paña ladoman yaykun (lambda
cuerpoman yaykun).

> **Huk modulomi willan ima lluqsichisqanta.** `#>` bloque munasqam kanmi — mana churayqa
> **E014**, hinaspa `#> { }` nisqawanmi huk modulo nin ima ukhunpas ch'usaq kasqanta. `::`
> huk ruwanata waqyan, `.` huk mana tikraqta ñawinchan. Modulo cuerpo ukhupi yaykuchiykunallam,
> lluqsichiy bloque, chanichasqa qallariykuna hinaspa ruwana definicionkuna kayta atinku;
> imapas ruwakuqqa **E013**mi.

---

## Biblioteca Estándar

Kikillanmanta moduluskuna, huknin hinallataq yaykuchisqa:

| Modulo | Ruwanakuna |
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

>> t::width("手番") ¶            // → 4   iskay glifos, tawa columna
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

punchay = T::of(2026, 1, 31)
>> T::format(punchay, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(punchay, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` nisqaqa **pantalla columna-kunata** yupan, manam qillqakunatachu: CJK hinaspa
> achka emoji-kuna iskay columnata hap'inku, chaymi huk tabla-taqa `t::width` nisqawan
> churay, manam `$#` nisqawanchu.
> `std/time` nisqapi huk instante-qa milisegundos época-manta patamanmi. Huk p'unchaymanta
> uraqa duracionmi, p'unchaymantaqa hawaqa calendariom — chaymi huk killa kaqlla p'unchaypi
> uraykun, ajustasqa. `diff(a, b)` nisqaqa `a - b` mi, chaymi ñawpaq instanteqa negativo
> kutichinta ñawpaqta qun.

---

## Llamk'anakuna (Paquetes)

Huk `.zyp` nisqaqa achka archivo-yoq programata huk sapallan, apayta atina archivopi
huñun. Huk **qallariy código** archivom, manam binariochu, chaymi maypipas `zymbol`
binario purichkaptin phawan.

```bash
zymbol package llamkaniy/ --script main.zy -o llamkaniy.zyp
zymbol run llamkaniy.zyp
```

> Llamk'anaqa huk manifiesto apan (`zyp.toml`), qallariy guionninkunata hinaspa
> munasqan motor versionninta willan. `zymbol run` nisqaqa huk temporal directoriaman
> orqhon hinaspa chaymantam phawan, chaymi códigoqa wikch'unallam, ichaqa programa
> qillqasqanqa kikinniykip llamk'ay directoriapi kanmi. Playground-pas `.zyp` archivokunata
> apaykachan.

---

## Yupay Escritura Modo-kuna

Zymbol-qa yupaykunata qillqayta atinmi **69 Unicode escritura yupaypi** — Devanagari, Arabe-Indica, Thai, Klingon pIqaD, Matemática Negrita, LCD segmentos, hinaspa aswanpas. Modo-qa procesop tukuyninpaq kanmi hinaspa lluqsiyman ruwan; yupay-ruwayqa manam tikrakunchu.

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabe-Indica (U+0660–U+0669)
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

Imayna escritura yupaypas allin qillqasqam kanmi qallariy códigopi:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Ñawinchayqa iskay ladomantam: huk yupayqa imayna escriturapipas hap'isqa kanmi:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` nisqaqa ASCII-llam, chaymi `#0` sapa escriturapi yupay chusaqmanta rikch'anayninpi t'aqasqa qhipakun.
> `#,` hinaspa `#^` nisqakunaqa yupayninkunata apaykachasqan escriturapi qillqanku, hinaspa
> t'aqaqkunaqa qatinku — ichaqa iskaynin mana ni hayk'aqpas tikrakunchu: `,` huñun hinaspa
> `.` t'aqan, imayna escriturapipas.

---

## Willaykuna Ruwanankuna

```zymbol
f = ##.42         // Float-man tikray
i = ###3.7        // Yupayman tikray, muyuchisqa    → 4
t = ##!3.7        // Yupayman tikray, kuchusqa  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Huk Float-qa yupaykunata rikuchin, manam ni hayk'aqpas exponentetachu, hinaspa qhipa
> `.0` wikch'un — `##.42` `42` qillqan, hinaspa Float kasqallanpuni, imayna `f#?` rikuchisqan hina.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   mana pantaq: yaykusqanta kikillanta kutichin
>> ##!'A' ¶        // → 65    huk Qillqap código puntonmi
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          iskay decimalman muyuchiy
>> #!2|pi| ¶       // → 3.14          iskay decimalman kuchuy
>> #,|1234567| ¶   // → 1,234,567     waranqapi taqasqa
>> #^|12345.678| ¶ // → 1.2345678e4   zientifika notacion
```

```zymbol
>> 0x41 ¶        // → A   hexadecimal
>> 0b01000001 ¶  // → A   binario
>> 0o101 ¶       // → A   octal
>> 0d65 ¶        // → A   decimal
```

> Huk base literal ASCII kitipi kaptinqa **huk qillqam**: `0d65 == 'A'` `#1`mi, hinaspa
> `0d65 == 65` `#0`mi. Tukuy tawa base-kunapas kaqlla qillqata willanku.

---

## Shell Ukhupi Yaykuchiy

```zymbol
kunan = <\ date +%Y-%m-%d \>
>> "Kunan p'unchay: " kunan
```

```zymbol
lluqsisqa = </"./huchuyqillqa.zy"/>
>> lluqsisqa
```

> `<\ … \>` nisqaqa stdout hinaspa stderr-ta hap'in, qhipa musuq siqi wikch'usqa.
> `>< args` nisqaqa kamachiy simikunata huk simi tantasqa hina hap'in.

---

## Tukusqan Rikuchiy: FizzBuzz

```zymbol
taqay(yupay) {
    ? yupay % 15 == 0 { <~ "FizzBuzz" }
    _? yupay % 3  == 0 { <~ "Fizz" }
    _? yupay % 5  == 0 { <~ "Buzz" }
    <~ yupay
}

@ i:1..20 { >> taqay(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (sapa hukmi huk lineapi)
```

---

## Imayna Siñalkuna Huñunakunku

Kay qillqasqa tukuyninpi kaqllatam qhawarqanki: **huk ruwanaqa manam yuyanapaq dibujochu, iskay utaq aswan siñalmi huk qatipi, hinaspa sapallanmi yuyayninta churamun.** Kunanqa tukuyninkuta yachankiñam, kaymi tukuy patrón.

Ñawpaqtaqa hamun **mayqin pachapi kasqanchik**:

| Siñal | Pacha | Maypi rikurqanki |
|------|-------|---------------|
| `$` | huk tantasqa | `$#` `$+` `$?` `$^-` |
| `@` | pacha, imapas kutin-kutin ruwakuq | `@!` `@>` `@~` |
| `#` | ima huk kaq *kasqan*, manam imay chaninnin | `#?` `#(…)` `<#` `#>` |
| `>>` | programamanta lluqsiy | `>>` `>>!` `>>?` |
| `<<` | programaman yaykuy | `<<` `<<\|` `<<\|?` |
| `?` | tapuy, mana hap'ispa | `?` `_?` `??` `$?` |
| `!` | kallpa, utaq pantay | `@!` `$!` `!?` |

Chaymantataqmi hamun **ima ruwakusqan chaypi**: `+` yapay, `-` qichuy, `^` churay, `~` tikray, `#` yupay, `|` huk sapalla unidad, `:` huk sutita hap'iy.

Iskay kamachiykunam ni hayk'aq pantankuchu:

**Huk siñalta iskaychayqa tukuyta ruwayta ninmi.** `?` huklla kutis tapun, `??` achka kaqkunata qhawan. `$?` tapun huk chani KAN-chu, `$??` tukuy kitikunata kutichin. `!` huk pantayta rikuchin, `!!` mana tapuspa hawaman apachin.

**Modo siñalqa sapa kutin qhipapi kanmi.** `?` utaq `!` nisqakuna rikuchiptin *imaynatas* ruwakusqanta — tapuspa utaq kallpawan — paykunam ruwanap qhipa siñalnin: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:hawa!`. Ni hayk'aqpas huk ruwanaqa paykunap qhipanpi kanchu.

Chaymantam huk allin yachaynin lluqsimun: **huk t'inkiyta manaraq rikusqayki ñataqmi entiendekunña, mana buscanaykipaq.** `$` tantasqa kaptin hinaspa `^` churay kaptin hinaspa `-` uraykuq kaptinqa, `$^-` uraykuman churanmi, hinaspa mana pipas willasunkichu.

Manam tukuy inventarioqa kay hinallachu ruwakun, hinaspa chayta niyqa aswan allinmi. Achkan ruwanakunam allinta t'aqakunku. Suqtan t'aqakunku ichaqa t'aqanku patanmanta aswan yuyayniyoq: `!?` `:!` `:>` `|>` `::` `$++`. Hinaspa chunkam sunqumanta yachana kanku, mana ni hayk'aqpas t'aqakunkuchu: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Chusaq kaqkunata yupayqa, aswan pisi kasqanta yuyayllamanta aswan allinmi: paykunam
> kay simip qillqana chaninnin. Tukuy inventario — inventario, willasqa homógrafo-kuna,
> hinaspa huk musuq ruwana kanapaq hunt'anan kamachiykuna — `SYMBOLS.md` nisqapi kanmi,
> intérprete repositoriopi.

---

## Siñalkuna Willay

| Siñal | Ruwana | Siñal | Ruwana |
|--------|-----------|--------|-----------|
| `=` | tikraq | `$#` | suni |
| `:=` | mana tikraq | `$+` | yapay |
| `>>` | lluqsiy | `$+[i]` | kitipi churay (1manta) |
| `<<` | yaykuy | `$-` | ñawpaq rikurisqanta qichuy |
| `¶` / `\\` | musuq siqi | `$--` | tukuyninta qichuy |
| `?` | tapuy | `$-[i]` | kitipi qichuy (1manta) |
| `_?` | mana chayqa tapuy | `$-[i..j]` | kiti-kunata qichuy (1manta) |
| `_` | mana nisqa | `$?` | kanmi tapuy |
| `??` | achka tapuy | `$??` | tukuy kitikunata tariy (1manta) |
| `\|\|` | utaq patrón tinkuypi | `$[s..e]` | kuchusqa (1manta) |
| `@` | muyuy | `$>` | tikray sapankunapi |
| `@ N { }` | N kutis muyuy | `$\|` | akllay |
| `@!` | sayachiy | `$<` | huñuy |
| `@>` | qatiy | `$/ t'aqaq` | simi t'aqay |
| `@:suti { }` | sutichasqa muyuy | `$++ a b c` | huñuspa ruway |
| `@:suti!` | sutichasqa sayachiy | `$~~[p:r]` | simipi tikray |
| `@:suti>` | sutichasqa qatiy | `$*` | simi kutiy |
| `->` | lambda | `tantasqa[i]$~ v` | HUKLLA tikray forma |
| `<~` | kutichiy | `~` | llamk'ay rikcha tikraq |
| `tantasqa[i>j]` | kitipi puriy | `tantasqa[p ; q]` | pallasqa |
| `$^+` | churay wichayman | `$^-` | churay uraykuman |
| `$^` | churay comparadorwan | `\|>` | qatichiy |
| `!?` | kallpachakuy | `:!` | hap'iy |
| `:>` | tukuypi | `$!` | pantachu |
| `$!!` | pantayta apachiy | `#1` / `#0` | chiqaq / llulla |
| `##_` | manaima — mana kasqan | `[…]` | tantasqa, huk laya |
| `#[…]` | tantasqa, chikanniyoq | `#(…)` | sutichasqa |
| `(…)` | kitinpi churasqa | `#()` | ch'usaq sutichasqa |
| `<#` | yaykuchiy | `#>` | lluqsichiy |
| `#` | modulo willay | `::` | modulo waqyay |
| `.` | hapiy (campo / mana tikraq) | `#?` | laya willay |
| `#\|..\|` | yupayta ñawinchay | `##.` | Float-man tikray |
| `###` | Yupayman tikray (muyuchisqa) | `##!` | Yupayman tikray (kuchusqa) |
| `#.N\|..\|` | muyuchiy | `#!N\|..\|` | kuchuy |
| `#,\|..\|` | waranqapi taqasqa | `#^\|..\|` | zientifika |
| `#d0d9#` | yupay escritura tikray | `#09#` | ASCII-man kutichiy |
| `<\ ..\>` | shell kamachiy | `><` | CLI simikuna |
| `\ var` | tikraqta wañuchiy | `°x` / `x°` | quñi tikraq |
| `>>\|` | pantalla lluqsiy (bloque) | `>>~` | kitisqa lluqsiy |
| `>>!` | pantallata chusaqyachiy | `>>?` | terminal suninta tapuy |
| `<<\|` | ñitina suyay | `<<\|?` | ñitina mana suyaspa tapuy |
| `@~ N` | N milisegundos puñuy | `0d` `0x` `0o` `0b` | base literal-kuna |

---

## Lluqsichisqakunap Willaynin

### v0.0.9 — Sutichasqakuna Kamachisqa _(setiembre 2026)_

- **T'ikraq** Sutichasqaqa payllan qillqayniyoqmi: `#(llavi: chani)`. `(a: 1)` churasqallan mana chaskisqachu, hinaspa `#()` ch'usaq sutichasqam — chaytaqa `()` mana ni hayk'aqpas atinmanchu
- **T'ikraq** Kitisqa churayqa wikch'usqam: `tantasqa[i] = v` hinaspa tukuy compuesto formankuna. `=` huk SUTIMAN chanita qun; huk tantasqap t'aqanta tikrayqa `$~` mi
- **T'ikraq** T'inkisqa kiti `m[i][j]` mana chaskisqachu ñawinchanapaqpas qillqanapaqpas — `>` nisqaqa pasos chawpipi churakun
- **T'ikraq** Huk moduloqa ima lluqsichisqanta willananmi (**E014**); `#> { }` nin ukhun ch'usaq kasqanta
- **T'ikraq** Huk muyuy specifier-qa yupay utaq kondicionmi — manam "chiqaq hina" kanchu. `@ []` hinaspa `@ 3.5` mana chaskisqachu
- **Yapasqa** `##_` — Manaima literal, hinaspa imaynatas huk programa tapun imapas mana kasqanta
- **Yapasqa** `#[…]` — huk tantasqa, elementonkunap chikan layan willasqa
- **Yapasqa** `#?` nisqaqa tawa tantasqakunata t'aqan: `##]` `##[` `##)` `##(`
- **Yapasqa** `std/time` — pacha hinaspa calendario, zonaskunawan hinaspa calendario yupaywan
- **Yapasqa** Archivo patapi `<~` programap lluqsisqan kasqanmi
- **Yapasqa** `@ (k, v):pares` — huk patrón muyuy umapi
- **Yapasqa** `#|c|` ñawinchan huk yupayta imayna 69 escriturapipas; `#,` hinaspa `#^` qillqanku paykunapta apaykachasqan escriturapi
- **Tikrasqa** `Yupay` nisqaqa allin yupaymi, ±(2⁵³ − 1), tukuy makinakunapi wañunanpaq
- **Tikrasqa** Huk sutiyoq ruwanaqa archivop tikraqninkunata waqyasqan pachapi ñawinchan, chaninwan
- **Tikrasqa** Huk rimasqa sutillan ñawinchaq willakunmi, manam upallallachu pasan
- **Motorkuna** 666 corpus archivomanta 660 kimsantin motorpi kaqllata ninku, 0 mana kaqllata

### v0.0.8 — Kikillanmanta Kacharichiy, `std/term` hinaspa Llamk'anakuna _(agosto 2026)_

- **Yapasqa** Kikillanmanta wañuchiy qhipa apaykachasqanpi — mana rikhurikuq; peak memoria pisillata uraykuchin
- **Yapasqa** `std/term` — terminal columnas-pi tupuykuna
- **Yapasqa** `##!` huk `Qillqa`pi — Unicode código puntonin
- **Yapasqa** Tinkuy o-patrón-kuna: `'p' || 'P' => …`, imayna laya kaqpas huk umapi
- **Yapasqa** Zymbol Llamk'anakuna (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Yapasqa** `<~` waqyay kitipi munasqam maypi callee-qa huk lluqsichiy tikraqta willan chaypi
- **Allinchasqa** Modulo sistema kaqllan register VM-pi

### v0.0.7 — Kikin Biblioteca Estándar _(julio 2026)_

- **Yapasqa** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — tukuyninku llamp'u pantay chaninkunawan
- **Yapasqa** Layayoq/qhawasqa yaykuchiy: `<< ##.(5,2) "chaninnin: " p`
- **Yapasqa** Postfix ruwanakuna kikillanpi `>>` ukhupi — mana corchetes munasqachu
- **Tikrasqa** Fail-closed formateador: mana ñawinchayta atina lluqsiyta qillqayta mana munanchu

### v0.0.6 — Allinchay hinaspa Cientifica Biblioteca _(junio 2026)_

- **T'ikraq** `=>` `:` rantinpi churan tinkuy umakunapi hinaspa `<=` yaykuchiy/lluqsichiy sutikunapi
- **Yapasqa** `std/math` hinaspa `std/random`
- **Yapasqa** Sutichasqa tikray llavinwan: `d["k"]$~ chani`

### v0.0.5 — TUI Sapallan Ruwanakuna hinaspa Quñi Tikraq _(mayo 2026)_

- **Yapasqa** TUI bloque `>>| { }`, kitisqa lluqsiy `>>~`, ñitina yaykuchiy `<<|` hinaspa `<<|?`
- **Yapasqa** `>>!` pantallata chusaqyachiy, `>>?` terminal suni, `@~ N` puñuy
- **Yapasqa** Quñi tikraq `°x` / `x°`, hinaspa simi kutiy `$*`

### v0.0.4 — 1manta Kitisqa hinaspa Ñawpaq Laya Ruwanakuna _(abril 2026)_

- **T'ikraq** Tukuy kitisqaqa **1manta** qallarin — `tantasqa[1]` ñawpaq elementom
- **Yapasqa** Sutiyoq ruwanakuna ñawpaq layapi chaninkuna hina; modulo bloque forma `# suti { }`
- **Yapasqa** Achka muyuriq kitisqa `tantasqa[i>j>k]` hinaspa pallasqa `tantasqa[p ; q]`

### v0.0.3 — Unicode Yupay Sistemakuna _(abril 2026)_

- **Yapasqa** 69 Unicode yupay bloque-kuna, modo-tikray siñalwan `#d0d9#`
- **Yapasqa** Booleano literal-kuna imayna escriturapipas — `#१` / `#०`

### v0.0.2 — Tantasqakuna API Musuqyachiy _(marzo 2026)_

- **Yapasqa** `$` ruwana ayllu tantasqakunapaq hinaspa simikunapaq
- **Yapasqa** T'aqasqa churakuy, hinaspa negativo kitikuna

### v0.0.1 — Ñawpaq Publico Lluqsichiy _(marzo 2026)_

- Tree-walker intérprete + register VM (`--vm`)
- Tukuy ukhu ruwanakuna: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Tukuy Unicode sutikuna, modulo sistema, lambdakuna, hapisqakuna, pantay hap'iy
- REPL, LSP, VS Code extension, formateador (`zymbol fmt`)

---

_Zymbol-Lang — Simbolico. Tukuypaq. Mana Tikrachikuq._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Licencia:** kay qillqasqaqa [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) nisqawan licenciasqam — © 2024-2026 Zymbol-Lang Team. Tukuy qillqa: `LICENSE-CC-BY-SA-4.0` kaypi <https://github.com/zymbol-lang/web>. Intérprete hinaspa navegador motor (`zymbol.js`) t'aqasqa llamk'aykunam, AGPL-3.0-only licenciasqa.
