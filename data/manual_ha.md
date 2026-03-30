# Taƙaitaccen Jagoran Zymbol-Lang

**Zymbol-Lang** harshen shirye-shirye ne na alamomi. Ba ta amfani da kalmomi masu mahimmanci — komai alama ne. Tana aiki iri ɗaya a kowane harshen ɗan adam.

- Babu kalmomi masu mahimmanci (`if`, `while`, `return` ba su wanzu — alamomi kawai `?`, `@`, `<~`)
- Unicode cikakke — sunayen masu canzawa a kowane harshe ko emoji 👋
- Ba ta dogara ga harshe — lamba ɗaya ce a dukkan harsunan duniya

---

## Masu Canzawa da Dindindin

```zymbol
x = 10              // mai canzawa (ana iya canji)
PI := 3.14159       // dindindin — kuskure idan an sake sanya
suna = "Amina"
aiki = #1           // gaskiya na Boolean
👋 := "Sannu"
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

## Nau'ikan Bayanai

| Nau'i | Misali | Alama `#?` | Bayani |
|-------|--------|------------|--------|
| Lamba gabaɗaya | `42`, `-7` | `###` | Bits 64 tare da alama |
| Lamba madaidaiciya | `3.14`, `1.5e10` | `##.` | Rubutun kimiyya OK |
| Kirtani | `"sannu"` | `##"` | Shigawa: `"Sannu {suna}"` |
| Harafi | `'A'` | `##'` | Harafi ɗaya na Unicode |
| Boolean | `#1`, `#0` | `##?` | BA lamba 1 da 0 ba |
| Jeri | `[1, 2, 3]` | `##]` | Dukkan abubuwa nau'i ɗaya |
| Tuple | `(a, b)` | `##)` | Matsayi |
| Tuple mai suna | `(x: 1, y: 2)` | `##)` | Shiga ta suna ko lamba |

```zymbol
// Binciken nau'i — yana dawo da (nau'i, lambobi, ƙima)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Fitarwa da Shigarwa

```zymbol
>> "Sannu" ¶                     // ¶ ko \\ yana ba da layi sabon bayyananne
>> "a=" a " b=" b ¶              // ƙima da yawa ta hanyar jeruwa
>> (jeri$#) ¶                    // masu aiki na postfix suna buƙatar ƙaho

<< suna                          // ba tare da tambaya ba — karanta zuwa masu canzawa
<< "Sunanka? " suna              // tare da tambaya
```

> `¶` ko `\\` sun yi daidai a matsayin layi sabon.

---

## Ma'aikatan Lissafi

```zymbol
// Lissafi — yi amfani da sanya; wasu masu aiki suna da matsala a >> kai tsaye
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (raba lambobi gaba ɗaya)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (ƙarfi)

// Kwatancen
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Ma'ana
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Kirtani

```zymbol
// Hanyoyi uku na haɗawa
suna = "Amina"
n = 42

sakwanni = "Sannu ", suna, "!"            // waƙafi — a cikin sanya
>> "Sannu " suna " kana da " n ¶          // jeruwa — a cikin >>
bayanai = "Sannu {suna}, kana da {n}"    // shigar da rubutu — ko'ina
```

```zymbol
s = "Sannu Duniya"
tsawo = s$#                  // 12
sashi = s$[0..5]             // "Sannu"  (ƙarshe ba ya haɗawa)
akwai = s$? "Duniya"         // #1
sassa = "a,b,c,d" / ','      // [a, b, c, d]
maye = s$~~["a":"A"]         // "SAnnu DuniyA"
maye1 = s$~~["a":"A":1]      // "SAnnu Duniya"  (N na farko kawai)
```

> `+` don lambobi kawai. Yi amfani da `,`, jeruwa, ko shigar da rubutu don kirtani.

---

## Sarrafa Gudana

```zymbol
x = 7

? x > 0 { >> "tabbatacce" ¶ }

? x > 100 {
    >> "mai girma" ¶
} _? x > 0 {
    >> "tabbatacce" ¶
} _? x == 0 {
    >> "sifili" ¶
} _ {
    >> "korau" ¶
}
```

> Tubalan `{ }` **wajibi ne**, ko da layi ɗaya.

---

## Match

```zymbol
// Kewayon
maki = 85
daraja = ?? maki {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> daraja ¶    // → B

// Kirtani
launi = "ja"
lambar = ?? launi {
    "ja"   : "#FF0000"
    "kore" : "#00FF00"
    _      : "#000000"
}

// Masu kiyaye
zafi = -5
hali = ?? zafi {
    _? zafi < 0  : "kankara"
    _? zafi < 20 : "sanyi"
    _? zafi < 35 : "dumi"
    _            : "zafi"
}
>> hali ¶    // → kankara

// Sigar kauli (hannaye na tubali)
?? n {
    0       : { >> "sifili" ¶ }
    _? n < 0: { >> "korau" ¶ }
    _       : { >> "tabbatacce" ¶ }
}
```

---

## Madaukai

```zymbol
@ i:0..4  { >> i " " }        // kewayo mai haɗa ƙarshe: 0 1 2 3 4
@ i:1..9:2 { >> i " " }       // tare da matakin: 1 3 5 7 9
@ i:5..0:1 { >> i " " }       // baya: 5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (yayin da)

'ya'yan itace = ["mangwaro", "ayaba", "lemo"]
@ f:'ya'yan itace { >> f ¶ }  // ga kowane abu na jeri

@ c:"sannu" { >> c "-" }
>> ¶                          // → s-a-n-n-u-  (ga kowane harafi)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> ci gaba
    ? i > 7 { @! }             // @! katse
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

// Madauki mai lakabi (katse a ciki)
lissafi = 0
@ @waje {
    lissafi++
    ? lissafi >= 3 { @! waje }
}
>> lissafi ¶                  // → 3
```

---

## Ayyuka

```zymbol
ƙara(a, b) { <~ a + b }
>> ƙara(3, 4) ¶    // → 7

factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶    // → 120
```

Ayyuka suna da **keɓantaccen fili** — ba damar shiga canjin waje ba. Yi amfani da sigogi na fitarwa `<~` don canza masu canji na mai kira:

```zymbol
musanya(a<~, b<~) {
    wucin = a
    a = b
    b = wucin
}
x = 10
y = 20
musanya(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Ayyuka masu suna ba ƙimomi na farko ba ne. Don wucewa a matsayin gardama saka: `x -> suna(x)`.

---

## Lambda da Rufewa

```zymbol
ninki = x -> x * 2
jimla = (a, b) -> a + b
>> ninki(5) ¶    // → 10
>> jimla(3, 7) ¶  // → 10

// Lambda tare da tuba
rarrabawa = x -> {
    ? x > 0 { <~ "tabbatacce" }
    _? x < 0 { <~ "korau" }
    <~ "sifili"
}

// Rufe — lambda suna kama masu canzawa na waje
ƙari = 3
sau_uku = x -> x * ƙari
>> sau_uku(7) ¶    // → 21

// Ma'aikata
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// A cikin jeri
ayyuka = [x -> x+1, x -> x*2, x -> x*x]
>> ayyuka[2](5) ¶    // → 25
```

---

## Jeri

```zymbol
jeri = [1, 2, 3, 4, 5]

jeri[0]          // 1 — shiga (lamba farawa daga 0)
jeri[-1]         // 5 — lamba mara kyau (na ƙarshe)
jeri$#           // 5 — tsawo (yi amfani da (jeri$#) a >>)

jeri = jeri$+ 6            // ƙara → [1,2,3,4,5,6]
jeri2 = jeri$+[2] 99       // saka a lamba 2
jeri3 = jeri$- 3           // cire faruwar farko ta ƙima
jeri4 = jeri$-- 3          // cire dukkan faruwai
jeri5 = jeri$-[0]          // cire a lamba
jeri6 = jeri$-[1..3]       // cire kewayo (ƙarshe ba ya haɗawa)

akwai = jeri$? 3            // #1 — ƙunsa
matsayi = jeri$?? 3         // [2] — dukkan lamba na ƙima
sl = jeri$[0..3]            // [1,2,3] — yanke (ƙarshe ba ya haɗawa)
sl2 = jeri$[0:3]            // [1,2,3] — sigar adadi

hawa = jeri$^+              // an tsara hawa (primitives kawai)
saukar = jeri$^-            // an tsara saukar (primitives kawai)

// Jeri na tuple — yi amfani da $^ da lambda mai kwatanci
bayanai = [(suna: "Carla", shekara: 28), (suna: "Ana", shekara: 25), (suna: "Bob", shekara: 30)]
ta_shekara  = bayanai$^ (a, b -> a.shekara < b.shekara)    // hawa ta shekara
ta_suna = bayanai$^ (a, b -> a.suna > b.suna)              // saukar ta suna
>> ta_shekara[0].suna ¶     // → Ana
>> ta_suna[0].suna ¶        // → Carla

jeri[1] = 99               // sabunta a wurin
jeri = jeri[1]$~ 99        // sabunta na aiki — yana dawo da sabon jeri
```

> Dukkan masu aiki na tarin suna dawo da **sabon jeri**. Sake sanya: `jeri = jeri$+ 4`.
> Masu aiki ba za a iya haɗawa ba — yi amfani da sanya na kati.
> `$^+` / `$^-` suna tsara **jeri na primitives** (lambobi, kirtani). Don jeri na tuple yi amfani da `$^` da lambda mai kwatanci — alkibla tana cikin lambda (`<` = hawa, `>` = saukar).

```zymbol
// Jeri da aka saka
matris = [[1,2,3],[4,5,6],[7,8,9]]
>> matris[1][2] ¶    // → 6
```

---

## Rarrabawa

```zymbol
// Jeri
jeri = [10, 20, 30, 40, 50]
[a, b, c] = jeri              // a=10  b=20  c=30
[farko, *sauran] = jeri       // farko=10  sauran=[20,30,40,50]
[x, _, z] = [1, 2, 3]         // _ ana watsar da shi

// Tuple na matsayi
batu = (100, 200)
(px, py) = batu               // px=100  py=200

// Tuple mai suna
mutum = (suna: "Amina", shekara: 25, gari: "Kano")
(suna: s, shekara: sh) = mutum   // s="Amina"  sh=25
```

---

## Tuple

```zymbol
// Matsayi
batu = (10, 20)
>> batu[0] ¶    // → 10

// Mai suna
mutum = (suna: "Aisha", shekara: 30)
>> mutum.suna ¶    // → Aisha
>> mutum[0] ¶      // → Aisha  (lamba ma yana aiki)

// Da aka saka
matsayi = (x: 10, y: 20)
p = (matsayi: matsayi, lakabi: "asali")
>> p.matsayi.x ¶   // → 10
```

---

## Ayyukan Matakin Sama

> Masu aiki na HOF suna buƙatar **lambda na cikin layi** — ba masu canji lambda kai tsaye ba.

```zymbol
lambobi = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ninki     = lambobi$> (x -> x * 2)                // map  → [2,4,6…20]
madaidaici = lambobi$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
jimla      = lambobi$< (0, (acc, x) -> acc + x)    // reduce → 55

// Jerin ta hanyar sanya na kati
mataki1 = lambobi$| (x -> x > 3)
mataki2 = mataki1$> (x -> x * x)
>> mataki2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Ayyuka masu suna a cikin HOF — saka a lambda
ninki_f(x) { <~ x * 2 }
r = lambobi$> (x -> ninki_f(x))    // ✅
```

---

## Ma'aikacin Bututu

Bangaren dama koyaushe yana buƙatar `_` a matsayin mai zama don ƙimar da aka wuce:

```zymbol
ninki = x -> x * 2
ƙara = (a, b) -> a + b
kara_ɗaya = x -> x + 1

5 |> ninki(_)        // → 10
10 |> ƙara(_, 5)     // → 15
5 |> ƙara(2, _)      // → 7

// Jerin haɗawa
r = 5 |> ninki(_) |> kara_ɗaya(_) |> ninki(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Sarrafa Kurakurai

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "raba da sifili" ¶
} :! {
    >> "wani kuskure: " _err ¶    // _err yana riƙe da saƙon kuskure
} :> {
    >> "koyaushe yana gudana" ¶
}
```

| Nau'i | Lokacin da yake faruwa |
|-------|------------------------|
| `##Div` | Raba da sifili |
| `##IO` | Fayil / Tsarin aiki |
| `##Index` | Lamba a wajen kewayon |
| `##Type` | Kuskuren nau'i |
| `##Parse` | Kuskuren nazari |
| `##Network` | Kuskuren hanyar sadarwa |
| `##_` | Kowane kuskure (kama-duka) |

---

## Sassan

```zymbol
// lib/lissafi.zy
# lissafi

#> { ƙara, get_PI }    // Fitar KAFIN ma'anoni

_PI := 3.14159
ƙara(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// main.zy
<# ./lib/lissafi <= l    // ake buƙatar sunan laƙabi

>> l::ƙara(5, 3) ¶   // → 8
pi = l::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Fitar da sunan jama'a daban
# ɗakin karatu
#> { _ƙara_ciki <= jimla }

_ƙara_ciki(a, b) { <~ a + b }
```

```zymbol
<# ./ɗakin_karatu <= d

>> d::jimla(3, 4) ¶    // → 7  (sunan ciki _ƙara_ciki an ɓoye)
```

---

## Ma'aikatan Bayanai

```zymbol
// Canza kirtani zuwa lamba
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (lafiya, babu kuskure)

// Zagaye / yanke
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (zagaye zuwa decimal 2)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (yanke)

// Tsarin lamba
fmt = #,|1234567|      // → 1,234,567  (keɓe da waƙafi)
sci = #^|12345.678|    // → 1.2345678e4  (kimiyya)

// Tsarin asali
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Fitar canza asali
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Haɗewar Shell

```zymbol
kwanan_yau = <\ date +%Y-%m-%d \>     // yana kama stdout (yana da \n na ƙarshe)
>> "Yau: " kwanan_yau

fayil = "bayanai.txt"
abun_cikin = <\ cat {fayil} \>        // shigar da rubutu a cikin umarni

fitarwa = </"./tsarin_ƙarami.zy"/>   // gudanar da wani tsarin Zymbol, kama fitarwa
>> fitarwa
```

> `><` yana kama hujjojin CLI a matsayin jerin kirtani (tree-walker kawai).

---

## Cikakken Misali: FizzBuzz

```zymbol
rarrabawa(lamba) {
    ? lamba % 15 == 0 { <~ "FizzBuzz" }
    _? lamba % 3  == 0 { <~ "Fizz" }
    _? lamba % 5  == 0 { <~ "Buzz" }
    _ { <~ lamba }
}

@ i:1..20 { >> rarrabawa(i) ¶ }
```

---

## Nassoshi na Alamomi

| Alama | Aikin | Alama | Aikin |
|-------|-------|-------|-------|
| `=` | Mai canzawa | `$#` | Tsawo |
| `:=` | Dindindin | `$+` | Ƙara |
| `>>` | Fitarwa | `$+[i]` | Saka a lamba |
| `<<` | Shigarwa | `$-` | Cire farko ta ƙima |
| `¶` / `\\` | Layi sabon | `$--` | Cire duka ta ƙima |
| `?` | idan | `$-[i]` | Cire a lamba |
| `_?` | in ba haka ba idan | `$-[i..j]` | Cire kewayo |
| `_` | in ba haka ba / mai tsaye | `$?` | Ƙunsa |
| `??` | match | `$??` | Nemo dukkan lamba |
| `@` | Madauki | `$[s..e]` | Yanke |
| `@!` | Katse | `$>` | map |
| `@>` | Ci gaba | `$\|` | filter |
| `->` | Lambda | `$<` | reduce |
| `$^+` | tsara hawa (primitives) | `$^-` | tsara saukar (primitives) |
| `$^` | tsara da kwatanci (tuple) | | |
| `<~` | Dawo | `!?` | gwadawa |
| `\|>` | Bututu | `:!` | kama |
| `#1` | gaskiya | `:>` | koyaushe |
| `#0` | ƙarya | `$!` | shi ne kuskure |
| `<#` | Shigar | `$!!` | watsa kuskure |
| `#` | Ayyana sashe | `#>` | Fitar |
| `::` | Kiran sashe | `.` | damar sehemu |
| `#\|..\|` | canza lamba | `#?` | metadata nau'i |
| `#.N\|..\|` | zagaye | `#!N\|..\|` | yanke |
| `c\|..\|` | tsarin waƙafi | `e\|..\|` | kimiyya |
| `<\ ..\>` | gudanar shell | `>\<` | hujjojin CLI |

---

*Zymbol-Lang — Alamomi. Na Duniya. Ba ya Canzawa.*

> **Lura:** An ƙirƙiri wannan takarda kuma an fassara ta ta hanyar hankali na wucin gadi (AI).
> Ko da an yi ƙoƙari don tabbatar da daidaito, wasu fassarori ko misalai na iya ƙunsar kuskure.
> Ita ce hujjar da ta fi iko ita ce [MANUAL.md](https://github.com/zymbol-lang/interpreter) a cikin ma'ajiyar mai fassara.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> The canonical reference is [MANUAL.md](https://github.com/zymbol-lang/interpreter) in the interpreter repository.
