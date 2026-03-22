# Taƙaitaccen Jagoran Zymbol-Lang

**Zymbol-Lang** harshen shirye-shirye ne na alamomi. Ba ta amfani da kalmomi masu mahimmanci — komai alama ne. Tana aiki iri ɗaya a kowane harshen ɗan adam.

---

## Falsafa

- Babu kalmomi masu mahimmanci (`if`, `while`, `return` ba su wanzu — alamomi kawai `?`, `@`, `<~`)
- Unicode cikakke — sunayen masu canzawa a kowane harshe ko emoji 👋
- Ba ta dogara ga harshe — lamba ɗaya ce a dukkan harsunan duniya

---

## Masu Canzawa da Dindindin

```zymbol
adadi = 10           // mai canzawa (ana iya canji)
PI := 3.14159        // dindindin (ba za a canza ba — kuskure idan an sake sanya)
suna = "Amina"
aiki = #1            // gaskiya na Boolean
👋 := "Sannu"
```

### Sanya Hadaddun

```zymbol
x = 10    // 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 4    // 6
x %=  4   // 2
x++       // 3
x--       // 2
```

---

## Nau'ikan Bayanai

| Nau'i           | Misali              | Alama `#?` | Bayani                              |
|-----------------|---------------------|------------|-------------------------------------|
| Lamba gabaɗaya  | `42`, `-7`          | `###`      | Bits 64 tare da alama               |
| Lamba madaidaiciya | `3.14`, `1.5e10` | `##.`      | Rubutun kimiyya OK                  |
| Kirtani         | `"sannu"`           | `##"`      | Shigawa: `"Sannu {suna}"`           |
| Harafi          | `'A'`               | `##'`      | Harafi ɗaya na Unicode              |
| Boolean         | `#1`, `#0`          | `##?`      | BA lamba 1 da 0 ba                  |
| Jeri            | `[1, 2, 3]`         | `##]`      | Dukkan abubuwa nau'i ɗaya           |
| Tuple           | `(a, b)`            | `##)`      | Matsayi                             |
| Tuple mai suna  | `(x: 1, y: 2)`      | `##)`      | Shiga ta suna ko lamba              |

---

## Fitarwa da Shigarwa

```zymbol
// Fitarwa — BA ta ƙara layi sabon kai tsaye
>> "Sannu" ¶                     // ¶ ko \\ yana ba da layi sabon bayyananne
>> "a=" a " b=" b ¶              // ƙima da yawa ta hanyar jeruwa
>> "jimla=" ƙara(2, 3) ¶         // kiran ayyuka a kowane matsayi
>> (jeri$#) ¶                    // masu aiki na postfix suna buƙatar ƙaho

// Shigarwa
<< suna                          // ba tare da tambaya ba — karanta zuwa masu canzawa
<< "Sunanka? " suna              // tare da tambaya
```

> `¶` ko `\\` sun yi daidai a matsayin layi sabon.

---

## Haɗa Kirtani

Hanyoyi uku masu inganci — kowannensu don mahallinsa:

```zymbol
suna = "Amina"
shekara = 25

// 1. Waƙafi — a cikin sanya tare da = ko :=
sakwanni = "Sannu ", suna, "!"             // → Sannu Amina!
TAKEN := "Mai amfani: ", suna

// 2. Jeruwa — a cikin fitarwa >>
>> "Sannu " suna " shekarunki " shekara ¶  // → Sannu Amina shekarunki 25

// 3. Shigar da rubutu — a kowane mahallin
bayanai = "Sannu {suna}, shekarunki {shekara}"  // → Sannu Amina, shekarunki 25
```

> **Lura**: `+` don lambobi kawai. A cikin kirtani yana haifar da gargaɗi.

---

## Sarrafa Gudana

```zymbol
x = 7

// Sauƙaƙe idan
? x > 0 { >> "tabbatacce" ¶ }

// Idan / in ba haka ba idan / in ba haka ba
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

Tubalan `{ }` **wajibi ne**, ko da layi ɗaya.

---

## Match

```zymbol
// Match tare da kewayon
maki = 85
daraja = ?? maki {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> daraja ¶    // → B

// Match tare da masu kiyaye (sharuɗɗa masu son rai)
zafi = -5
hali = ?? zafi {
    _? zafi < 0  : "kankara"
    _? zafi < 20 : "sanyi"
    _? zafi < 35 : "dumi"
    _            : "zafi"
}
>> hali ¶    // → kankara

// Match tare da kirtani
launi = "ja"
lambar = ?? launi {
    "ja"   : "#FF0000"
    "kore" : "#00FF00"
    _      : "#000000"
}
>> lambar ¶
```

---

## Madaukai

```zymbol
// Kewayo mai haɗa ƙarshe: 0..4 yana yin zagaye 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Kewayo tare da matakin
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Kewayo baya
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Yayin da (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Ga kowane abu
 'ya'yan itace = ["mangwaro", "ayaba", "lemo"]
@ f:'ya'yan itace { >> f ¶ }

// A kan haruffan kirtani
@ c:"sannu" { >> c "-" }
>> ¶    // → s-a-n-n-u-

// Katse da ci gaba
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> ci gaba
    ? i > 7 { @! }          // @! katse
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Ayyuka

```zymbol
// Sanarwa da kira
ƙara(a, b) { <~ a + b }
>> ƙara(3, 4) ¶    // → 7

// Sake-sake
lissafi(n) {
    ? n <= 1 { <~ 1 }
    <~ n * lissafi(n - 1)
}
>> lissafi(5) ¶    // → 120

// Ayyuka suna da keɓantaccen fili — ba damar shiga canjin waje ba
duniya = 100
gwaji() {
    x = 42    // na cikin gida kawai
    <~ x
}
>> gwaji() ¶    // → 42
```

> **Muhimmi**: Ayyuka masu suna `suna(params){ }` ba ƙimomi na farko ba ne.
> Don wucewa a matsayin gardama saka: `x -> suna(x)`.

---

## Lambda da Rufewa

```zymbol
// Lambda mai sauƙi (dawo da daɗaɗɗe)
ninki = x -> x * 2
jimla = (a, b) -> a + b
>> ninki(5) ¶    // → 10
>> jimla(3, 7) ¶  // → 10

// Lambda tare da tuba (dawo da bayyananne)
rarrabawa = x -> {
    ? x > 0 { <~ "tabbatacce" }
    _? x < 0 { <~ "korau" }
    <~ "sifili"
}
>> rarrabawa(5) ¶     // → tabbatacce
>> rarrabawa(0) ¶     // → sifili
>> rarrabawa(-5) ¶    // → korau

// Rufe — lambda suna kama masu canzawa na waje
ƙari = 3
sau_uku = x -> x * ƙari    // yana kama 'ƙari'
>> sau_uku(7) ¶    // → 21

// Ma'aikata na ayyuka
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambda a matsayin ƙimomi: adanawa a cikin jeri
ayyuka = [x -> x+1, x -> x*2, x -> x*x]
>> ayyuka[0](5) ¶    // → 6
>> ayyuka[2](5) ¶    // → 25
```

---

## Jeri

```zymbol
jeri = [10, 20, 30, 40, 50]

// Shiga (lamba farawa daga 0)
>> jeri[0] ¶    // → 10

// Tsawo (ana buƙatar ƙaho a >>)
n = jeri$#
>> (jeri$#) ¶    // → 5

// Ƙara, cire, ƙunsa, yanke
jeri = jeri$+ 60              // ƙara
jeri = jeri$- 0               // cire lamba 0
akwai = jeri$? 30              // → #1
yanke = jeri$[0..2]            // [20, 30]

// Sabunta abu
jeri[1] = 99

// Ga kowane abu
@ x:jeri { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` suna dawo da **sabon jeri** — sake sanya: `jeri = jeri$+ 4`.
> Ba haɗi: yi amfani da sanya biyu daban.

---

## Tuple

```zymbol
// Tuple mai suna
mutum = (suna: "Aisha", shekara: 30)
>> mutum.suna ¶    // → Aisha
>> mutum.shekara ¶  // → 30
>> mutum[0] ¶       // → Aisha (lamba ma yana aiki)
```

---

## Ayyukan Matakin Sama

Masu aiki na HOF suna buƙatar **lambda na cikin layi** — ba masu canji lambda kai tsaye ba.

```zymbol
lambobi = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
ninki = lambobi$> (x -> x * 2)
>> ninki ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
madaidaici = lambobi$| (x -> x % 2 == 0)
>> madaidaici ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (ƙimar farawa, (tattara, abu) -> magana)
jimla = lambobi$< (0, (acc, x) -> acc + x)
>> jimla ¶    // → 55
```

---

## Sarrafa Kurakurai

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "Raba da sifili" ¶
} :! ##IO {
    >> "Kuskuren IO" ¶
} :! {
    >> "wani kuskure: " _err ¶
} :> {
    >> "koyaushe yana gudana" ¶
}
```

| Nau'i       | Lokacin da yake faruwa          |
|-------------|--------------------------------|
| `##Div`     | Raba da sifili                 |
| `##IO`      | Fayil / Tsarin aiki            |
| `##Index`   | Lamba a wajen kewayon          |
| `##Type`    | Kuskuren nau'i                 |
| `##Parse`   | Kuskuren nazari                |
| `##Network` | Kuskuren hanyar sadarwa        |
| `##_`       | Kowane kuskure (kama-duka)     |

---

## Sassan

```zymbol
// Fayil: lib/lissafi.zy
# lissafi

#> { ƙara, get_PI }    // Fitar KAFIN ma'anoni

_PI := 3.14159
ƙara(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Fayil: main.zy
<# ./lib/lissafi <= l    // ake buƙatar sunan laƙabi

>> l::ƙara(5, 3) ¶   // → 8
pi = l::get_PI()
>> pi ¶               // → 3.14159
```

---

## Cikakken Misali: FizzBuzz

```zymbol
rarrabawa(lamba) {
    ? lamba % 15 == 0 { <~ "KumfaVuvuu" }
    _? lamba % 3  == 0 { <~ "Kumfa" }
    _? lamba % 5  == 0 { <~ "Vuvuu" }
    _ { <~ lamba }
}

@ i:1..20 { >> rarrabawa(i) ¶ }
```

---

## Nassoshi na Alamomi

| Alama   | Aikin              | Alama      | Aikin                 |
|---------|--------------------|------------|-----------------------|
| `=`     | Mai canzawa        | `$#`       | Tsawo                 |
| `:=`    | Dindindin          | `$+`       | Ƙara                  |
| `>>`    | Fitarwa            | `$-`       | Cire (ta lamba)       |
| `<<`    | Shigarwa           | `$?`       | Ƙunsa                 |
| `¶`/`\` | Layi sabon         | `$[s..e]`  | Yanke                 |
| `?`     | idan (if)          | `$>`       | map                   |
| `_?`    | in ba haka ba idan | `$\|`      | filter                |
| `_`     | in ba haka ba / mai tsaye | `$<` | reduce             |
| `??`    | match              | `!?`       | gwadawa (try)         |
| `@`     | Madauki            | `:!`       | kama (catch)          |
| `@!`    | Katse (break)      | `:>`       | koyaushe (finally)    |
| `@>`    | Ci gaba (continue) | `$!`       | shi ne kuskure        |
| `->`    | Lambda             | `$!!`      | watsa kuskure         |
| `<~`    | Dawo               | `#`        | Ayyana sashe          |
| `\|>`   | Bututu (pipe)      | `#>`       | Fitar              |
| `#1`    | gaskiya            | `<#`       | Shigar              |
| `#0`    | ƙarya              | `::`       | Kiran sashe           |

---

*Zymbol-Lang — Alamomi. Na Duniya. Ba ya Canzawa.*

---

> **Lura:** An ƙirƙiri wannan takarda kuma an fassara ta ta hanyar hankali na wucin gadi (AI).
> Ko da an yi ƙoƙari don tabbatar da daidaito, wasu fassarori ko misalai na iya ƙunsar kuskure.
> Ita ce hujjar da ta fi iko ita ce [ƙayyadaddun Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The authoritative reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
