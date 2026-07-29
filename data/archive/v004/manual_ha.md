> **Sanarwa:** An ƙirƙiri wannan takaddun tare da taimakon hankali na wucin gadi (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Madaidicin tunani shine **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** a cikin ma'ajiyar fassarar.

---

# Jagorar Zymbol-Lang

**Zymbol-Lang** harshe ne na shirye-shirye na alama. Babu kalmomin maɓalli — komai alama ce. Yana aiki iri ɗaya a cikin kowane harshen ɗan adam.

- Babu `if`, `while`, `return` — kawai `?`, `@`, `<~`
- Cikakken Unicode — masu ganowa a kowane harshe ko emoji
- Rashin dogaro da harshen ɗan adam — lambar tana ɗaya a ko'ina

**Sigar fassarar**: v0.0.4 | **Murfin gwaji**: 393/393 (daidaiton TW ↔ VM)

---

## Maɓallai da Tsayayyu

```zymbol
x = 10              // maɓalli mai canzawa
PI := 3.14159       // tsayayye — sake rarrabawa kuskuren lokacin aiki ne
suna = "Alice"
aiki = #1           // Boolean gaskiya
👋 := "Sannu"
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

## Nau'ukan Bayanai

| Nau'in | Zahiri | Alamar `#?` | Bayanan kula |
|--------|--------|-------------|---------------|
| Lamba | `42`, `-7` | `###` | 64-bit mai alama |
| Kada-da-ishi | `3.14`, `1.5e10` | `##.` | Rubutun kimiyya an halatta |
| Zaren | `"rubutu"` | `##"` | Tsakiyar: `"Sannu {suna}"` |
| Harafi | `'A'` | `##'` | Harafin Unicode guda ɗaya |
| Boolean | `#1`, `#0` | `##?` | BA lamba ba — `#1 ≠ 1` |
| Zane | `[1, 2, 3]` | `##]` | Abubuwa iri ɗaya |
| Tuple | `(a, b)` | `##)` | Matsayi |
| Tuple mai suna | `(x: 1, y: 2)` | `##)` | Filayen masu suna |
| Aiki | nunin aiki mai suna | `##()` | Matsayi na farko; yana nuna `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Matsayi na farko; yana nuna `<lambd/N>` |

```zymbol
// Binciken nau'in — yana mayar da (nau'in, lambobi, ƙima)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

---

## Fitarwa da Shigarwa

```zymbol
>> "Sannu" ¶                       // ¶ ko \\ don bayyanannen sabon layi
>> "a=" a " b=" b ¶               // jeri gefe-gefe — ƙimomi masu yawa
>> (arr$#) ¶                      // masu aiki postfix suna buƙatar ( ) a cikin >>

<< suna                           // karanta cikin maɓalli (ba tare da faɗakarwa ba)
<< "Shigar da suna: " suna         // tare da faɗakarwa
```

> `¶` (AltGr+R a kan maballin Sifaniyanci) da `\\` daidai suke don sabon layi.

---

## Masu aiki

```zymbol
// Lissafi — yi amfani da rarrabawa; wasu masu aiki suna da abubuwan ban mamaki kai tsaye a cikin >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (lambar rarraba)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (jumla)

// Kwatanta
a == b    // #0    
a <> b    // #1    
a < b     // #0
a <= b    // #0   
a > b     // #1    
a >= b    // #1

// Ma'ana
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Zaruru

```zymbol
// Hanyoyin haɗa biyu
suna = "Alice"
n = 42

>> "Sannu " suna " kana da " n ¶       // jeri gefe-gefe — a cikin >>
bayanin = "Sannu {suna}, kana da {n}"   // tsakiyar — a ko'ina
```

```zymbol
s = "Sannu Duniya"
tsayi = s$#                  // 11
rabi = s$[1..5]              // "Sannu"  (tushe-1, ƙarshen haɗe)
akwai = s$? "Duniya"         // #1
sassa = "a,b,c,d"$/ ','      // [a, b, c, d]  (rabuwa da mai raba)
maye = s$~~["a":"o"]         // "Sonnu Duniyo"
maye1 = s$~~["a":"o":1]      // "Sonnu Duniya"  (N na farko kawai)
```

> `+` na lambobi ne kawai. Ga zaruru, yi amfani da `,`, jeri gefe-gefe, ko tsakiyar.

---

---

## Gudanar da Kwarara

```zymbol
x = 7

? x > 0 { >> "tabbatacce" ¶ }

? x > 100 {
    >> "babba" ¶
} _? x > 0 {
    >> "tabbatacce" ¶
} _? x == 0 {
    >> "sifiri" ¶
} _ {
    >> "korau" ¶
}
```

> Ƙuɓɓugan ƙugiya `{ }` **wajibi ne** ko da don magana ɗaya.

---

---

## Daidaitawa

```zymbol
// Iyakoki
maki = 85
daraja = ?? maki {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> daraja ¶      // → B

// Zaruru
launi = "ja"
lambar = ?? launi {
    "ja"    : "#FF0000"
    "kore"  : "#00FF00"
    _       : "#000000"
}

// Sifofin kwatanta
zazzabi = -5
hali = ?? zazzabi {
    < 0  : "kankara"
    < 20 : "sanyi"
    < 35 : "dumi"
    _    : "zafi"
}
>> hali ¶        // → kankara

// Siffar magana (tubabbu)
?? n {
    0        : { >> "sifiri" ¶ }
    _? n < 0 : { >> "korau" ¶ }
    _        : { >> "tabbatacce" ¶ }
}
```

---

## Madaukai

```zymbol
@ i:0..4  { >> i " " }        // iyaka haɗe:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // tare da mataki:  1 3 5 7 9
@ i:5..0:1 { >> i " " }       // juye:       5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (yayin da)

'ya'yan itace = ["apple", "pear", "innabi"]
@ f:'ya'yan itace { >> f ¶ }        // ga kowane abu a cikin zane

@ h:"sannu" { >> h "-" }
>> ¶                          // → s-a-n-n-u-  (ga kowane harafi a cikin zaren)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> ci gaba
    ? i > 7 { @! }            // @! karye
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Madauki mara iyaka
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Madauki mai lakabi (karyewar gida)
mai ƙidaya = 0
@:waje {
    mai ƙidaya++
    ? mai ƙidaya >= 3 { @:waje! }
}
>> mai ƙidaya ¶               // → 3
```

---

## Ayyuka

```zymbol
ƙara(a, b) { <~ a + b }
>> ƙara(3, 4) ¶   // → 7

fakito'oli (n) {
    ? n <= 1 { <~ 1 }
    <~ n * fakito'oli (n - 1)
}
>> fakito'oli (5) ¶    // → 120
```

Ayyuka suna da **keɓantaccen yanki** — ba za su iya karanta maɓallan waje ba. Yi amfani da sigogin fitarwa `<~` don canza maɓallan mai kira:

```zymbol
musanya(a<~, b<~) {
    wucin gadi = a
    a = b
    b = wucin gadi
}
x = 10
y = 20
musanya(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Ayyuka masu suna **ƙididdigar matsayi na farko ne** — aika kai tsaye: `nums$> ninki biyu`. `x -> fn(x)` ma yana aiki.

---

## Lambda da Rufewa

```zymbol
ninki biyu = x -> x * 2
ƙara = (a, b) -> a + b
>> ninki biyu(5) ¶   // → 10
>> ƙara(3, 7) ¶       // → 10

// Lambda tubali
ronga = x -> {
    ? x > 0 { <~ "tabbatacce" }
    _? x < 0 { <~ "korau" }
    <~ "sifiri"
}

// Rufewa — yana kama yankin waje
matsayi = 3
ninki uku = x -> x * matsayi
>> ninki uku(7) ¶    // → 21

// Ma'aikata
ƙirƙiri_maɗaukaki(n) { <~ x -> x + n }
ƙara goma = ƙirƙiri_maɗaukaki(10)
>> ƙara goma(5) ¶    // → 15

// A cikin zane
ayyuka = [x -> x+1, x -> x*2, x -> x*x]
>> ayyuka[3](5) ¶     // → 25
```

---

## Zane-zane

Zane-zane **masu canzawa** ne kuma suna ɗauke da abubuwa **na nau'in ɗaya**.

```zymbol
zane = [1, 2, 3, 4, 5]

zane[1]          // 1 — shiga (tushe-1: abu na farko)
zane[-1]         // 5 — ma'anar korau (abu na ƙarshe)
zane$#           // 5 — tsayi (yi amfani da (zane$#) a cikin >>)

zane = zane$+ 6            // ƙara → [1,2,3,4,5,6]
zane2 = zane$+[2] 99       // saka a matsayi 2 (tushe-1)
zane3 = zane$- 3           // cire bayyanar farko na ƙimar
zane4 = zane$-- 3          // cire duk bayyanuwar
zane5 = zane$-[1]          // cire a ma'ana 1 (abu na farko)
zane6 = zane$-[2..3]       // cire iyaka (tushe-1, ƙarshen haɗe)

akwai = zane$? 3           // #1 — ya ƙunshi
wurare = zane$?? 3         // [3] — duk ma'anar ƙimar (tushe-1)
yanki = zane$[1..3]        // [1,2,3] — yanki (tushe-1, ƙarshen haɗe)
yanki2 = zane$[1:3]        // [1,2,3] — iri ɗaya, tsarin ƙidaya

hawa = zane$^+             // jeri hawa (na farko kawai)
sauka = zane$^-            // jeri sauka (na farko kawai)

// Zane-zanen tuple masu suna/matsayi — yi amfani da $^ tare da lambda kwatantawa
bayanan = [(suna: "Carla", shekaru: 28), (suna: "Ana", shekaru: 25), (suna: "Bob", shekaru: 30)]
bisa_shekaru   = bayanan$^ (a, b -> a.shekaru < b.shekaru)    // hawa bisa shekaru (<)
bisa_suna   = bayanan$^ (a, b -> a.suna > b.suna)          // sauka bisa suna (>)
>> bisa_shekaru[1].suna ¶    // → Ana
>> bisa_suna[1].suna ¶       // → Carla

// Sabunta abu kai tsaye (zane-zane kawai)
zane[1] = 99              // rarraba
zane[2] += 5              // haɗaɗɗe: +=  -=  *=  /=  %=  ^=

// Sabuntawa na aiki — yana mayar da sabon zane; asali baya canzawa
zane2 = zane[2]$~ 99
```

> Duk masu aikin tarawa suna mayar da **sabon zane**. Sake rarrabawa: `zane = zane$+ 4`.
> `$+` ana iya sarƙa shi: `zane = zane$+ 5$+ 6$+ 7`. Sauran masu aiki suna amfani da rarrabawar tsaka-tsaki.
> **Ƙididdigar ma'ana tushe-1 ce**: `zane[1]` shine abu na farko; `zane[0]` kuskuren lokacin aiki ne.
> `$^+` / `$^-` suna jera **zane-zanen farko** (lambobi, zaruru). Ga zane-zanen tuple, yi amfani da `$^` tare da lambda kwatantawa — alkibla tana cikin lambda (`<` = hawa, `>` = sauka).

**Ma'anar ƙima** — rarraba zane ga wani maɓalli yana ƙirƙirar kwafi mai zaman kanta:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b bai shafa ba
```

```zymbol
// Zane-zanen gida (ƙididdigar tushe-1)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> matrix[2][3] ¶    // → 6  (sahihi 2, ginshiƙi 3)
```

---

---

## Rushewa

```zymbol
// Zane
zane = [10, 20, 30, 40, 50]
[a, b, c] = zane              // a=10  b=20  c=30
[na farko, *saura] = zane     // na farko=10  saura=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ yayi watsi

// Tuple matsayi
aya = (100, 200)
(px, py) = aya               // px=100  py=200

// Tuple mai suna
mutum = (suna: "Ana", shekaru: 25, birni: "Madrid")
(suna: s, shekaru: sh) = mutum   // s="Ana"  sh=25
```

---

## Tuples

Tuples **ba su canzawa** akwatuna masu tsari ne waɗanda za su iya ɗaukar ƙididdiga **na nau'i daban-daban**.
Ba kamar zane-zane ba, abubuwa ba za a iya canzawa bayan ƙirƙirar su ba.

```zymbol
// Matsayi — an halatta nau'ikan gauraye
aya = (10, 20)
>> aya[1] ¶      // → 10

bayanan = (42, "sannu", #1, 3.14)
>> bayanan[3] ¶   // → #1

// Mai suna
mutum = (suna: "Alice", shekaru: 25)
>> mutum.suna ¶    // → Alice
>> mutum[1] ¶      // → Alice  (ma'ana ma tana aiki, tushe-1)

// Gida
wuri = (x: 10, y: 20)
p = (wuri: wuri, lakabi: "asali")
>> p.wuri.x ¶      // → 10
```

**Rashin canzawa** — duk wani ƙoƙari na canza abin tuple kuskuren lokacin aiki ne:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ kuskuren lokacin aiki: tuples ba su canzawa
// t[1] += 5    // ❌ kuskure iri ɗaya

// Tuple mai suna — sake ginawa a bayyane
mutum = (suna: "Alice", shekaru: 25)
babba = (suna: mutum.suna, shekaru: 26)
>> mutum.shekaru ¶   // → 25
>> babba.shekaru ¶   // → 26
```

Don samun ƙimar da aka canza, yi amfani da `$~` (sabuntawa na aiki) — yana mayar da **sabon** tuple:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← asali bai canza ba
>> t2 ¶    // → (10, 999, 30)
```

---

---

## Ayyuka Masu Matsayi Mai Girma

```zymbol
lambobi = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ninki biyu = lambobi$> (x -> x * 2)                 // taswirar → [2,4,6…20]
mamaki   = lambobi$| (x -> x % 2 == 0)            // tace → [2,4,6,8,10]
jimla   = lambobi$< (0, (tara, x) -> tara + x)     // rage → 55

// Sarka ta hanyar tsaka-tsaki
mataki1 = lambobi$| (x -> x > 3)
mataki2 = mataki1$> (x -> x * x)
>> mataki2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Ana iya aika ayyuka masu suna kai tsaye zuwa ayyuka masu matsayi mai girma
ninki biyu(x) { <~ x * 2 }
babba ne(x) { <~ x > 5 }
r = lambobi$> ninki biyu       // ✅ nunin kai tsaye
r = lambobi$| babba ne         // ✅ nunin kai tsaye
```

---

---

## Mai aikin bututu

Bangaren dama koyaushe yana buƙatar `_` azaman mai riƙe wuri don ƙimar da aka bututa:

```zymbol
ninki biyu = x -> x * 2
ƙara = (a, b) -> a + b
ƙara ɗaya = x -> x + 1

5 |> ninki biyu(_)        // → 10
10 |> ƙara(_, 5)          // → 15
5 |> ƙara(2, _)           // → 7

// Sarka
r = 5 |> ninki biyu(_) |> ƙara ɗaya(_) |> ninki biyu(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Gudanar da Kuskure

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "rarraba da sifiri" ¶
} :! {
    >> "wani kuskure: " _err ¶    // _err yana ɗauke da saƙon kuskure
} :> {
    >> "koyaushe yana aiki" ¶
}
```

| Nau'in | Yaushe |
|--------|--------|
| `##Div` | Rarraba da sifiri |
| `##IO` | Fayil / tsarin |
| `##Index` | Ma'ana a waje da iyaka |
| `##Type` | Rashin daidaiton nau'in |
| `##Parse` | Tsara bayanai |
| `##Network` | Kuskuren hanyar sadarwa |
| `##_` | Kowane kuskure (yana kama komai) |

---

## Guddo

```zymbol
// lib/calc.zy — jikin guddo yana cikin ƙuƙɓugan ƙugiya
# calc {
    #> { ƙara, get_PI }

    _PI := 3.14159
    ƙara(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // sunan mai ba da hanya wajibi ne

>> c::ƙara(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶              // → 3.14159
```

```zymbol
// Fitarwa tare da wani sunan jama'a daban
# laburarena {
    #> { _ƙara_ciki <= jimla }

    _ƙara_ciki(a, b) { <~ a + b }
}
```

```zymbol
<# ./laburarena <= m

>> m::jimla(3, 4) ¶    // → 7  (sunan ciki _ƙara_ciki yana ɓoye)
```

> **Dokokin guddo**: a cikin `# suna { }`, `#>`, ma'anar ayyuka, da masu fara maɓalli/tsayayyu na zahiri kawai aka halatta. Maganganun da za a iya aiwatarwa (`>>`, `<<`, madaukai, da sauransu) suna haifar da kuskure E013.

---

---

## Yanayin Lambobi

Zymbol na iya nuna lambobi a cikin **69 tubalan lambobi na Unicode** — Devanagari, Larabci-Indiya, Thai, Klingon pIqaD, Mathematics bold, sassan LCD, da ƙari. Yanayin aiki yana shafar fitarwar `>>` kawai; lissafin ciki koyaushe binary ne.

### Kunna rubutun

Rubuta lambobi `0` da `9` na rubutun da aka yi niyya a cikin `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Larabci-Indiya  (U+0660–U+0669)
#๐๙#    // Thai           (U+0E50–U+0E59)
#09#    // sake saiti zuwa ASCII
```

---

### Fitarwa da Boolean

```zymbol
x = 42
>> x ¶          // → 42   (tsoho ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (maki goma koyaushe ASCII)
>> 1 + 2 ¶      // → ३

// Boolean: prefix # koyaushe ASCII ne, lambobi suna daidaitawa
>> #1 ¶         // → #१   (gaskiya a Devanagari)
>> #0 ¶         // → #०   (ƙarya — ya bambanta da ० lamba sifiri)

x = 28 > 4
>> x ¶          // → #१   (sakamakon kwatanta yana bin yanayin aiki)
```

---

## Lambobi na asali a cikin lambar tushe

Lambobi na kowane rubutun da aka tallafa sune zahiri masu inganci — a cikin iyakoki, modulo, kwatance:

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

### Zahirin Boolean a kowane rubutu

`#` + lamba `0` ko `1` daga kowane tubali shine zahirin Boolean mai inganci:

```zymbol
#०९#
aiki = #१        // daidai da #1
>> aiki ¶        // → #१
>> (#१ && #०) ¶   // → #०
```

> `#` **koyaushe ASCII ne**. `#0` (ƙarya) koyaushe ya bambanta a gani da `0` (lamba sifiri) a kowane rubutu.

---

---

## Masu aikin Bayanai

```zymbol
// Canza nau'in
##.42         // → 42.0  (zuwa Kada-da-ishi)
###3.7        // → 4     (zuwa Lamba, zagaye)
##!3.7        // → 3     (zuwa Lamba, yanke)

// Tsara zaren zuwa lamba
v1 = #|"42"|      // → 42  (Lamba)
v2 = #|"3.14"|    // → 3.14  (Kada-da-ishi)
v3 = #|"abc"|     // → "abc"  (lafiya, babu kuskure)

// Zagaye / Yanke
pi = 3.14159265
zagaye2 = #.2|pi|     // → 3.14  (zagaye zuwa wurare 2 na goma)
zagaye4 = #.4|pi|     // → 3.1416
yanke2 = #!2|pi|      // → 3.14  (yanke)

// Tsara lambobi
tsari = #,|1234567|   // → 1,234,567  (rabuwa da wakafi)
kimiyya = #^|12345.678| // → 1.2345678e4  (kimiyya)

// Zahirin tushe
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Fitar da canjin tushe
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Haɗin Shell

```zymbol
kwanan wata = <\ date +%Y-%m-%d \>     // yana ɗaukar stdout (ya haɗa da \n a ƙarshe)
>> "Yau: " kwanan wata

fayil = "bayanai.txt"
abun ciki = <\ cat {fayil} \>         // tsakiyar a cikin umarni

fitarwa = </"./subscript.zy"/>        // aiwatar da wani rubutun Zymbol, ɗaukar fitarwa
>> fitarwa
```

> `><` yana ɗaukar gardamar CLI azaman zaren zane (bishiyar tafiya kawai).

---

## Cikakken Misali: FizzBuzz

```zymbol
ronga(lamba) {
    ? lamba % 15 == 0 { <~ "FizzBuzz" }
    _? lamba % 3  == 0 { <~ "Fizz" }
    _? lamba % 5  == 0 { <~ "Buzz" }
    _ { <~ lamba }
}

@ i:1..20 { >> ronga(i) ¶ }
```

---

---

## Tunani Alama

| Alama | Aiki | Alama | Aiki |
|-------|------|-------|------|
| `=` | maɓalli | `$#` | tsayi |
| `:=` | tsayayye | `$+` | ƙara (ana iya sarƙawa) |
| `>>` | fitarwa | `$+[i]` | saka a ma'ana (tushe-1) |
| `<<` | shigarwa | `$-` | cire na farko bisa ƙima |
| `¶` / `\\` | sabon layi | `$--` | cire duka bisa ƙima |
| `?` | idan | `$-[i]` | cire a ma'ana (tushe-1) |
| `_?` | in ba haka ba idan | `$-[i..j]` | cire iyaka (tushe-1) |
| `_` | in ba haka ba / daji | `$?` | ya ƙunshi |
| `??` | daidaita | `$??` | nemo duk ma'ana (tushe-1) |
| `@` | madauki | `$[s..e]` | yanki (tushe-1) |
| `@ N { }` | madauki N sau | `$>` | taswira |
| `@!` | karye | `$|` | tace |
| `@>` | ci gaba | `$<` | rage |
| `@:suna { }` | madauki mai lakabi | `$/ mai raba` | raba zaren |
| `@:suna!` | karyewar mai lakabi | `$++ a b c` | gina haɗin |
| `@:suna>` | ci gaba mai lakabi | `zane[i>j>k]` | ma'anar kewayawa |
| `->` | lambda | `zane[i] = ƙima` | sabunta abu (zane-zane kawai) |
| `zane[i] += ƙima` | sabuntawa haɗaɗɗe | `zane[i]$~` | sabuntawar aiki (kwafi sabo) |
| `$^+` | jeri hawa (na farko) | `$^-` | jeri sauka (na farko) |
| `$^` | jeri tare da mai kwatanta (tuples) | `<~` | mayarwa |
| `|>` | bututu | `!?` | gwada |
| `:!` | kama | `:>` | daga ƙarshe |
| `#1` | gaskiya | `#0` | ƙarya |
| `$!` | kuskure ne | `$!!` | yada kuskure |
| `<#` | shigo da | `#>` | fitarwa |
| `#` | ayyana guddo | `::` | kiran guddo |
| `.` | shiga filin | `#?` | metadata nau'in |
| `#\|..\|` | tsara lamba | `##.` | canza zuwa Kada-da-ishi |
| `###` | canza zuwa Lamba (zagaye) | `##!` | canza zuwa Lamba (yanke) |
| `#.N\|..\|` | zagaye | `#!N\|..\|` | yanke |
| `#,\|..\|` | tsarin wakafi | `#^\|..\|` | kimiyya |
| `#d0d9#` | canza yanayin lambobi | `#09#` | sake saiti zuwa ASCII |
| `<\ ..\>` | aiwatar da shell | `>\<` | gardamar CLI |
| `\ var` | lalata maɓalli a bayyane | | |

---

## Kundin Canje-canjen Saki

### v0.0.4 — Ƙididdigar Tushe-1, Ayyuka Masu Matsayi Na Farko & Gudda Tubabbu _(Afrilu 2026)_

- **Karya** Duk ƙididdigar ma'ana an canza zuwa **tushe-1** — `arr[1]` shine abu na farko; `arr[0]` kuskuren lokacin aiki ne
- **Ƙara** Ayyuka masu suna **ƙididdigar matsayi na farko ne** — aika kai tsaye zuwa ayyuka masu matsayi mai girma: `nums$> ninki biyu`
- **Ƙara** **Tsarin tubali** na guddo wajibi ne: `# suna { ... }` — an cire tsarin lebur
- **Ƙara** Ƙididdigar ma'ana mai girma dabam: `arr[i>j>k]` (kewayawa), `arr[p ; q]` (cirewar lebur)
- **Ƙara** Canza nau'in: `##.magana` (Kada-da-ishi), `###magana` (Lamba zagaye), `##!magana` (Lamba yanke)
- **Ƙara** Raba zaren: `zaren$/ mai raba` — yana mayar da `Array(Zaren)`
- **Ƙara** Gina haɗin: `tushe$++ a b c` — yana ƙara abubuwa da yawa
- **Ƙara** Madauki N sau: `@ N { }` — maimaita daidai N sau
- **Ƙara** Tsarin madaukai masu lakabi: `@:suna { }`, `@:suna!`, `@:suna>` — yana maye gurbin `@ @suna` / `@! suna`
- **Ƙara** Dokokin yankin maɓalli: maɓallan `_suna` suna da madaidaicin yankin tubali; `\ var` yana lalata da wuri
- **Ƙara** Sifofin kwatancen daidaitawa: `< 0 :`, `> 5 :`, `== 42 :` da sauransu
- **Ƙara** Kuskuren guddo E013: an hana maganganun da za a iya aiwatarwa a cikin jikin guddo
- **Gyara** `take_variable` baya lalata tsayayyun guddo yayin sake rubutawa
- **Gyara** `alias.CONST` yanzu yana warwarewa daidai; `#>` na iya bayyana bayan ma'anar ayyuka
- **VM** Cikakken daidaito: 393/393 gwaje-gwaje sun wuce

### v0.0.3 — Tsarin Lambobi na Unicode & Haɓakawa LSP _(Afrilu 2026)_

- **Ƙara** 69 tubalan lambobi na Unicode tare da alamar canza yanayi `#d0d9#`
- **Ƙara** Zahirin Boolean a kowane rubutu — `#१` / `#०`, `#१` / `#०`, da sauransu
- **Ƙara** Lambobin Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Ƙara** `SetNumeralMode` VM opcode — cikakken daidaito da mai tafiya bishiya
- **Ƙara** REPL yana mutunta yanayin lambobi mai aiki a cikin amsawa da nunin maɓalli
- **Canza** Boolean `>>` fitarwa yanzu ya haɗa da prefix `#` (`#0` / `#1`) a duk yanayin

### v0.0.2_01 — Sake Sunan Mai Aiki _(30 Maris 2026)_

- **Canza** `c|..|` → `#,|..|` da `e|..|` → `#^|..|` — daidai da dangin prefix tsarin `#`
- **Ƙara** Sunan mai ba da hanya na fitarwa: sake fitar da membobin guddo a ƙarƙashin wani suna daban

### v0.0.2 — Sake Zane API na Tari & Masu sakawa _(24 Maris 2026)_

- **Ƙara** dangin mai aiki `$` mai haɗaka don zane-zane da zaruru (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Ƙara** Rarraba rushewa don zane-zane, tuples, da tuples masu suna
- **Ƙara** Ma'anar korau (`arr[-1]` = abu na ƙarshe)
- **Ƙara** Masu sakawa na asali — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Maris 2026)_

- **Ƙara** Rarrabawar haɗaɗɗe `^=`
- **Gyara** Batutuwan gefen lissafin mai tsarawa; gyare-gyaren takaddun

### v0.0.1 — Farkon Fitowar Jama'a _(22 Maris 2026)_

- Mai fassarar tafiya bishiya + VM rajista (`--vm`, ~4× sauri, ~95% daidaito)
- Duk ginin tsakiya: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Cikakkun masu gano Unicode, tsarin guddo, lambdas, rufewa, gudanar da kuskure
- REPL, LSP, Tsawaita VS Code, mai tsarawa (`zymbol fmt`)

---

_Zymbol-Lang — Alama. Duniya. Ba ya canzawa._
