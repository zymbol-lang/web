# Zymbol-Lang-ի Կոմpaktт Ուghеtsuytс

**Zymbol-Lang**-ы mek khоrhrhdanshakaн ծragramavorman lezvu e — arants himnabarerer, miayн khоrhrhdanishner. Ayn havasarapes ashkhatum e tsankatsad mardkayan lezuov.

---

## Փilisofayutyun

- Chkan himnabarerer (`if`, `while`, `return` goyutyun chunen — miayн `?`, `@`, `<~` khоrhrhdanishner)
- Unicode-i liarzhek ajaktsutyun — nuynatstsutsichner tsankatsad lezuov kam emoji 👋
- Lezvu-ankakh — kody nuynn e barjor lezunerum

---

## Փohohkhanner ev Hastatunner

```zymbol
բ = 10              // Pohokvor (karogh e pohohvel)
ՊԻ := 3.14159       // Hastatun (ankerokh — krknakin veragortsadume sgal e)
anun = "Անи"
ակտ = #1          // bulyаn chshmarе
👋 := "Barrev"
```

### Bаrd Veragortsadum

```zymbol
բ = 10    // 10
բ += 5    // 15
բ -= 3    // 12
բ *= 2    // 24
բ /= 4    // 6
բ %= 4    // 2
բ++       // 3
բ--       // 2
```

---

## Tvyalneri Tesakner

| Tesak                | Orinak              | `#?` Nishan | Tsanotutyunner                           |
|----------------------|---------------------|-------------|------------------------------------------|
| Amboghdj t'iv        | `42`, `-7`          | `###`       | 64-bit nshanоv                           |
| Loghatsak t'iv       | `3.14`, `1.5e10`    | `##.`       | Gitakan nshum ajaktsvum e                |
| Togh                 | `"barrev"`          | `##"`       | Interpolatsia: `"Barrev {anun}"`         |
| Nish                 | `'Ա'`               | `##'`       | Unicode-i mek nish                       |
| Bulyаn               | `#1`, `#0`          | `##?`       | CHEN t'ver 1 ev 0                        |
| Zandzvadd            | `[1, 2, 3]`         | `##]`       | Bolor tarrery nuynn tesaki               |
| Kortej               | `(ա, բ)`            | `##)`       | Dirakanayin                              |
| Anvanakir kortej     | `(x: 1, y: 2)`      | `##)`       | Hasaneliyutyun anvamb kam indeksov       |

---

## Yelk ev Muutk

```zymbol
// Yelk — CHEN avelatsnuм toghi yndmijum аvtomatik
>> "Բarrev, Аshkharh!" ¶             // ¶ kam \\ — batsahayt toghi yndmijum
>> "a=" ա " b=" բ ¶                  // bazmatip arzhekner juxtaposition-ov
>> "gumar=" gumar(2, 3) ¶            // funksioner tsankatsad dirkum
>> (zandzvadd$#) ¶                   // postfix oper-ner partezner en pahanjum

// Muutk
<< arzhek                            // arants artakhatsutyan — kardaghum e zhanghov
<< "Zer anunny? " anun               // artakhatsutyan het
```

> `¶` ev `\\` havasarek en orpes toghi yndmijum.

---

## Togherі Ktsum

Yerek t'uylatreli dzev — inkuruyn irakanshnutyan hamar:

```zymbol
anun = "Ani"
ն = 25

// 1. Shtaputyl (,) — = kam := veragortsadum
haghordakum = "Barrev ", anun, "!"          // → Barrev Ani!
VUJERAGRAM := "Vodzogh: ", anun

// 2. Juxtaposition — >> yelkum
>> "Barrev " anun " kez " ն ¶              // → Barrev Ani kez 25

// 3. Interpolatsia — tsankatsad kontekstum
nkarutyun = "Barrev {anun}, kez {n}"       // → Barrev Ani, kez 25
```

> **Nkatagrutyun**: `+` miayn t'veri hamar. Togheri hamar zgushagrutyun e arajanatsnum.

---

## Hosmi Karavarum

```zymbol
բ = 7

// Phart punj
? բ > 0 { >> "dartakan" ¶ }

// Etye / aylapes etye / aylapes
? բ > 100 {
    >> "mets" ¶
} _? բ > 0 {
    >> "dartakan" ¶
} _? բ == 0 {
    >> "zero" ¶
} _ {
    >> "batsasasats" ¶
}
```

`{ }` bloknery **pambatokan** en, anham mek tarriqi hamar.

---

## Hamaynknum (Match)

```zymbol
// Hamaynknum diapazoneri het
gnahatakan = 85
ardyunq = ?? gnahatakan {
    90..100 : 'Ա'
    80..89  : 'Բ'
    70..79  : 'Գ'
    _       : 'Ն'
}
>> ardyunq ¶    // → Բ

// Hamaynknum pahanjnerov (kamovor punjer)
jermastikan = -5
vichak = ?? jermastikan {
    _? jermastikan < 0  : "saruyts"
    _? jermastikan < 20 : "karak"
    _? jermastikan < 35 : "tsek"
    _                   : "shog"
}
>> vichak ¶    // → saruyts

// Hamaynknum togherі het
guyn = "kantach"
kod = ?? guyn {
    "kantach"  : "#FF0000"
    "kanach"   : "#00FF00"
    _          : "#000000"
}
>> kod ¶
```

---

## Vikler (Loops)

```zymbol
// Yndgreli diapazon: 0..4 iteratsionem 0,1,2,3,4
@ ի:0..4 { >> ի " " }
>> ¶    // → 0 1 2 3 4

// Diapazon qaуlumov
@ ի:1..9:2 { >> ի " " }
>> ¶    // → 1 3 5 7 9

// Heros diapazon
@ ի:5..0:1 { >> ի " " }
>> ¶    // → 5 4 3 2 1 0

// Minchdev (while)
ն = 1
@ ն <= 64 { ն *= 2 }
>> ն ¶    // → 128

// Yuraqanchyur tarrerі hamar
meyvaner = ["khntsor", "tandzeni", "khaghogh"]
@ m:meyvaner { >> m ¶ }

// Toghi nishnerov
@ s:"barrev" { >> s "-" }
>> ¶    // → b-a-r-r-e-v-

// Break ev Continue
@ ի:1..10 {
    ? ի % 2 == 0 { @> }    // @> sharunakel
    ? ի > 7 { @! }          // @! kangangel
    >> ի " "
}
>> ¶    // → 1 3 5 7
```

---

## Funksioner (Functions)

```zymbol
// Hasatakum ev kanchoum
գumár(ա, բ) { <~ ա + բ }
>> գumár(3, 4) ¶    // → 7

// Rekursia
արtadriyal(ն) {
    ? ն <= 1 { <~ 1 }
    <~ ն * արtadriyal(ն - 1)
}
>> արtadriyal(5) ¶    // → 120

// Funksioner-n unin skopy — chka artakin perakneri hasaneliyutyun
globalayin = 100
փorz() {
    բ = 42    // miayn tegayin
    <~ բ
}
>> փorz() ¶    // → 42
```

> **Karevov**: Anvanakir funksioner `anun(paramner){ }` artakin dasayi tarkeri chi linum.
> Argument pes heretarum — pokhum: `x -> anun(x)`.

---

## Lamβdaner ev Amraphner

```zymbol
// Phart Lamβda (anbashtakar veradardz)
կrknakim = բ -> բ * 2
գumár = (ա, բ) -> ա + բ
>> կrknakim(5) ¶    // → 10
>> գumár(3, 7) ¶    // → 10

// Lamβda blokov (baschaytakar veradardz)
dasакargeл_arj = բ -> {
    ? բ > 0 { <~ "dartakan" }
    _? բ < 0 { <~ "batsasasats" }
    <~ "zero"
}
>> dasакargeл_arj(5) ¶     // → dartakan
>> dasакargeл_arj(0) ¶     // → zero
>> dasакargeл_arj(-5) ¶    // → batsasasats

// Amraphner — Lamβdaner gravum en artakin perakkneri
գործ = 3
eraki = բ -> բ * գործ    // gravum e 'gorcakits'
>> eraki(7) ¶    // → 21

// Funksioner gorcanich
կազմ(ն) { <~ բ -> բ + ն }
տաս = կազմ(10)
>> տաս(5) ¶    // → 15

// Lamβdaner ors arzheknerov: petakvum en zandzvadd-nerum
gortsoghutyunner = [բ -> բ+1, բ -> բ*2, բ -> բ*բ]
>> gortsoghutyunner[0](5) ¶    // → 6
>> gortsoghutyunner[2](5) ¶    // → 25
```

---

## Zandzvadder (Arrays)

```zymbol
zandzvadd = [10, 20, 30, 40, 50]

// Hasaneliyutyun (indeks zerojic)
>> zandzvadd[0] ¶    // → 10

// Yerkartutyun (partezner pambatokan >> -um)
ն = zandzvadd$#
>> (zandzvadd$#) ¶    // → 5

// Avelaсnel, hatanel, petakum, ktom
zandzvadd = zandzvadd$+ 60              // avelaсnel
zandzvadd = zandzvadd$- 0               // hatanel tarri indeksov 0
ka = zandzvadd$? 30                     // → #1
ktom = zandzvadd$[0..2]                 // [20, 30]

// Tarri tangelem
zandzvadd[1] = 99

// Yuraqanchyur zandzvadd-ov
@ բ:zandzvadd { >> բ " " }
>> ¶
```

> `$+`, `$-`, `$[..]` veradardznume **nor zandzvadd** — veragortsadrel: `zandzvadd = zandzvadd$+ 4`.
> Chi khachvum shancherov: oranel yerku ank'akh veragortsadutyun.

---

## Kortejer (Թupelner)

```zymbol
// Anvanakir kortej
անձ = (anun: "Alisa", hasak: 25)
>> անձ.anun ¶     // → Alisa
>> անձ.hasak ¶    // → 25
>> անձ[0] ¶       // → Alisa (indeksov el ashkhatum e)
```

---

## Bardzr Karqi Funksioner (HOF)

HOF оperatornery pahanjum en **enkamats Lamβda** — vocch ugrakan Lamβda-perakner:

```zymbol
թvner = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
կrknakinert = թvner$> (բ -> բ * 2)
>> կrknakinert ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
zuig = թvner$| (բ -> բ % 2 == 0)
>> zuig ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (skzbnakan arzhek, (akkumulyator, tarr) -> artatahaytutyun)
yndameny = թvner$< (0, (akk, բ) -> akk + բ)
>> yndameny ¶    // → 55
```

---

## Sgalneri Mshakutyun (Error Handling)

```zymbol
!? {
    բ = 10 / 0
} :! ##Div {
    >> "bazhanоumn zero-ov" ¶
} :! ##IO {
    >> "mutk-yelk sgal" ¶
} :! {
    >> "ayl sgal: " _err ¶
} :> {
    >> "misht gortsvum e" ¶
}
```

| Tesakavor    | Yerp e arajanatsnum                       |
|--------------|-------------------------------------------|
| `##Div`      | Bazhanоumn zeroy vra                      |
| `##IO`       | Fail / hamakarg                           |
| `##Index`    | Indeksn diapazonits durs                  |
| `##Type`     | Tesakayin sgal                            |
| `##Parse`    | Verclutsmayin sgal                        |
| `##Network`  | Tsarkayayin sgal                          |
| `##_`        | Tsankatsad sgal (universaland catch)      |

---

## Modulner (Modules)

```zymbol
// Fail: lib/hisvabl.zy
# hisvabl

#> { գumár, get_PI }    // Eksportel SKZBNAKIN sarhmanutyunnery

_PI := 3.14159
գumár(ա, բ) { <~ ա + բ }
get_PI() { <~ _PI }
```

```zymbol
// Fail: main.zy
<# ./lib/hisvabl <= h    // Klanumy pambatokan e

>> h::գumár(5, 3) ¶  // → 8
pi = h::get_PI()
>> pi ¶              // → 3.14159
```

---

## Amboghj Оrinakn: FizzBuzz

```zymbol
// FizzBuzz — Հayererеn
// Հayererеn nuynatstsutsichner. Оperatornery misht khоrhrhdanshakanner en.

>> "Բarrev, Аshkharh!" ¶

դасакарgeл(թиv) {
    ? թиv % 15 == 0 { <~ "ՊghpjakԲzzots" }
    _? թиv % 3  == 0 { <~ "Պghpjak" }
    _? թиv % 5  == 0 { <~ "Բzzots" }
    _ { <~ թиv }
}

@ ի:1..20 { >> դасакарgeл(ի) ¶ }
```

---

## Nishanneri Teghanuts (Symbols Reference)

| Nishan       | Gortsoghutyun               | Nishan      | Gortsoghutyun                   |
|--------------|-----------------------------|-------------|----------------------------------|
| `=`          | Pohokvor                    | `$#`        | Yerkartutyun                     |
| `:=`         | Hastatum                    | `$+`        | Avelaсnel                        |
| `>>`         | Yelk                        | `$-`        | Hatanel (indeksov)               |
| `<<`         | Muutk                       | `$?`        | Petakum                          |
| `¶`/`\`      | Toghi yndmijum              | `$[n..k]`   | Ktom                             |
| `?`          | etye (if)                   | `$>`        | map                              |
| `_?`         | aylapes etye (elif)         | `$\|`       | filter                           |
| `_`          | aylapes / takhavar          | `$<`        | reduce                           |
| `??`         | hamaynknum (match)          | `!?`        | karoghakanum (try)               |
| `@`          | vikl (loop)                 | `:!`        | bkhosum (catch)                  |
| `@!`         | kangangel (break)           | `:>`        | misht (finally)                  |
| `@>`         | sharunakel (continue)       | `$!`        | sgal e                           |
| `->`         | Lamβda                      | `$!!`       | sgaly tararachel                 |
| `<~`         | veradardzel (return)        | `#`         | modul hasatarel                  |
| `\|>`        | khoughakvarum (pipe)        | `#>`        | eksportel                        |
| `#1`         | chshmare (true)             | `<#`        | importel                         |
| `#0`         | kegh (false)                | `::`        | moduli kanchoum                  |

---

*Zymbol-Lang — Khоrhrhdanshakayin. Hamashkharhayin. Ankerpeli.*

---

> **Zgushatruyun:** Sa vavagragutyunn steghtsvats ev t'argmanyel e arhakayin intelekti (AI) karoghutyamb.
> Chshmarutyany apahоvelu hamar karatsvel en bolor hoghadzery, sakayn orosh t'argmanutyunner kam orinaknеr kan petakum sgalnеr.
> Kanonakan hghorzoumov е [Zymbol-Lang specifikatsian](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> For authoritative reference, consult the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
