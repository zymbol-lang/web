# Umhlahlandlela Omfushane we-Zymbol-Lang

**Zymbol-Lang** ulimi lwekhompyutha lwezimpawu. Alusebenzisi amagama angukhiye — konke kuyimpawu. Lusebenza ngendlela efanayo kunoma yiluphi ulimi lwesintu.

- Akunamagama angukhiye (`if`, `while`, `return` awekhona — izimpawu kuphela `?`, `@`, `<~`)
- Unicode ephelele — izimpawu kunoma yiluphi ulimi noma i-emoji 👋
- Alunandlela yolimi — ikhodi ifana kuzo zonke izilimi

---

## Iziguquli neziConstant

```zymbol
x = 10              // isiguquli (shintsheka)
PI := 3.14159       // constant — iphutha uma iphinda ibekwe
igama = "Ana"
kusebenza = #1      // iqiniso lwe-boolean
👋 := "Sawubona"
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

## Izindlela Zezinombolo

I-Zymbol ingabonisa izinombolo ku**Unicode izinhlobo zenombolo ezingama-69** — Devanagari, Arabic-Indian, Thai, Klingon pIqaD, Imathematiki Enamandla, izigaba ze-LCD nenye. Indlela esebenzayo ithinta kuphela imiphumela ye-`>>`; i-arithmetic yangaphakathi ihlala iyibinary.

### Ukuvula uhlobo

Bhala inombolo `0` ne-`9` yohlobo oluqondiwe ngaphakathi kwe-`#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabic-Indic  (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // reset to ASCII
```

### Imiphumela namanani e-boolean

```zymbol
x = 42
>> x ¶          // → 42   (ASCII default)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४
>> 1 + 2 ¶      // → ३

// Boolean: # i-prefix ihlala iyiASCII, inombolo iyazilungisa
>> #1 ¶         // → #१
>> #0 ¶         // → #०

x = 28 > 4
>> x ¶          // → #१
```

### Izinombolo zekhodi yomthombo

Izinombolo zohlobo oluphina oluxhaswayo zizinhlobo ezivumelekile — ezimbaleni, modulo, uqhathaniso:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Izinhlobo ze-boolean kuwo wonke uhlobo

`#` + inombolo `0` noma `1` kwibloko liphina liyinhlobo ye-boolean evumelekile:

```zymbol
#٠٩#
نشط = #١
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` ihlala **iyiASCII**. `#0` (amanga) ihlala yahluke ngokubonakala kwi-`0` (zero yenombolo yonke) kuyo yonke indlela.

---

## Izinhlobo zeData

| Uhlobo | Isibonelo | Impawu `#?` | Amanothi |
|--------|-----------|-------------|----------|
| Inombolo yonke | `42`, `-7` | `###` | 64-bit enesimpawu |
| Inombolo enezigaba | `3.14`, `1.5e10` | `##.` | Indlela yesayensi ivumelekile |
| Uchungechunge | `"sawubona"` | `##"` | Ukufaka: `"Sawubona {igama}"` |
| Uhlamvu | `'A'` | `##'` | Uhlamvu olulodwa lwe-Unicode |
| Iqiniso | `#1`, `#0` | `##?` | AKUYONA inombolo 1 no-0 |
| Uhlu | `[1, 2, 3]` | `##]` | Zonke izinto zohlobo olufanayo |
| Tuple | `(a, b)` | `##)` | Ngendawo |
| Tuple enegama | `(x: 1, y: 2)` | `##)` | Ukufinyelela ngegama noma inkomba |

```zymbol
// Ukuhlola uhlobo — ibuya (uhlobo, izinombolo, inani)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Okukhishwayo nokufakwayo

```zymbol
>> "Sawubona" ¶                    // ¶ noma \\ unika umugqa omusha ngokucacile
>> "a=" a " b=" b ¶                // amanani amaningi ngokuhlangana
>> (uhlu$#) ¶                      // izenzo ze-postfix zidinga izibiyeli

<< igama                           // ngaphandle kwesiyaliso — funda inguquli
<< "Igama lakho? " igama           // nesiyaliso
```

> `¶` noma `\\` afana njengomugqa omusha.

---

## Izisebenzisi

```zymbol
// Izibalo — sebenzisa ukubekwa; ezinye izisebenzisi zinazo izinkinga ngqo ku->>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (ukwabela kwezinombolo eziphelele)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (amandla)

// Ukuqhathanisa
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Umqondo
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Izintambo

```zymbol
// Izindlela ezintathu zokuxhuma
igama = "Ana"
n = 42

umyalezo = "Sawubona ", igama, "!"          // ikhoma — ekubekweni
>> "Sawubona " igama " uneminyaka " n ¶     // ukuhlangana — ku->>
incazelo = "Sawubona {igama}, uneminyaka {n}"  // ukufaka — noma kuphi
```

```zymbol
s = "Sawubona Mhlaba"
ubude = s$#                  // 15
ingxenye = s$[0..8]          // "Sawubona"  (ukuphela akufakiwe)
unayo = s$? "Mhlaba"         // #1
izingxenye = "a,b,c,d" / ',' // [a, b, c, d]
guqula = s$~~["a":"A"]       // guqula zonke
guqula1 = s$~~["a":"A":1]    // N yokuqala kuphela
```

> `+` isetulengelwa izinombolo kuphela. Sebenzisa `,`, ukuhlangana, noma ukufaka kwizintambo.

---

## Ukulawula uMkhondo

```zymbol
inani = 7

? inani > 0 { >> "kuphezulu" ¶ }

? inani > 100 {
    >> "ukukhulu" ¶
} _? inani > 0 {
    >> "kuphezulu" ¶
} _? inani == 0 {
    >> "iqanda" ¶
} _ {
    >> "ngezansi" ¶
}
```

> Amabhuloko `{ }` **ayadingeka**, ngisho nomugqa owodwa.

---

## Match

```zymbol
// Izindawo
amanani = 85
isilinganiso = ?? amanani {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> isilinganiso ¶    // → B

// Izintambo
umbala = "bomvu"
ikhodi = ?? umbala {
    "bomvu"   : "#FF0000"
    "luhlaza" : "#00FF00"
    _         : "#000000"
}

// Izilindi
izinga = -5
isimo = ?? izinga {
    _? izinga < 0  : "Ubandakelo"
    _? izinga < 20 : "Kubanda"
    _? izinga < 35 : "Kushisa kancane"
    _              : "Kushisa"
}
>> isimo ¶    // → Ubandakelo

// Uhlobo lwenkulumo (izingalo zebhuloko)
?? n {
    0       : { >> "iqanda" ¶ }
    _? n < 0: { >> "ngezansi" ¶ }
    _       : { >> "kuphezulu" ¶ }
}
```

---

## Izinqubo

```zymbol
@ i:0..4  { >> i " " }        // indawo efakiwe: 0 1 2 3 4
@ i:1..9:2 { >> i " " }       // enyathelo: 1 3 5 7 9
@ i:5..0:1 { >> i " " }       // ephendukile: 5 4 3 2 1 0

inombolo = 1
@ inombolo <= 64 { inombolo *= 2 }
>> inombolo ¶                  // → 128  (ngesikhathi)

izithelo = ["Ihhabhula", "Ubhanana", "Igreyiphu"]
@ isithelo:izithelo { >> isithelo ¶ }  // ngasinye isinto

@ uhlamvu:"sawubona" { >> uhlamvu "-" }
>> ¶                           // → s-a-w-u-b-o-n-a-  (ngasinye uhlamvu)

@ i:1..10 {
    ? i % 2 == 0 { @> }        // @> qhubeka
    ? i > 7 { @! }              // @! phuma
    >> i " "
}
>> ¶                           // → 1 3 5 7

// Inqubo engenakuphela
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                           // → 1 2 3 4

// Inqubo enegama (phuma ngaphakathi)
isibalwa = 0
@ @ngaphandle {
    isibalwa++
    ? isibalwa >= 3 { @! ngaphandle }
}
>> isibalwa ¶                  // → 3
```

---

## Imisebenzi

```zymbol
hlukanisa(a, b) { <~ a + b }
>> hlukanisa(3, 4) ¶    // → 7

izinhlanzi(inombolo) {
    ? inombolo <= 1 { <~ 1 }
    <~ inombolo * izinhlanzi(inombolo - 1)
}
>> izinhlanzi(5) ¶    // → 120
```

Imisebenzi inendawo ehlukene — ayikwazi ukufinyelela iziguquli zangaphandle. Sebenzisa izinto eziphuma `<~` ukuguqula iziguquli zomemezeli:

```zymbol
shintsha(a<~, b<~) {
    isikhashana = a
    a = b
    b = isikhashana
}
x = 10
y = 20
shintsha(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Imisebenzi eyehlukene akuyona amanani angokuqala. Ukudlulisa njengempikiswano: `x -> igama(x)`.

---

## Lambda nezivalo

```zymbol
kabili = x -> x * 2
isamba = (a, b) -> a + b
>> kabili(5) ¶    // → 10
>> isamba(3, 7) ¶   // → 10

// Lambda ngebhuloko
hlela = x -> {
    ? x > 0 { <~ "kuphezulu" }
    _? x < 0 { <~ "ngezansi" }
    <~ "iqanda"
}

// Izivalo — abamba iziguquli zangaphandle
isici = 3
kathathu = x -> x * isici
>> kathathu(7) ¶    // → 21

// Umshini wezenzo
yenza_isibalo(inombolo) { <~ x -> x + inombolo }
engeza10 = yenza_isibalo(10)
>> engeza10(5) ¶    // → 15

// Ezinhlelweni
izenzo = [x -> x+1, x -> x*2, x -> x*x]
>> izenzo[2](5) ¶    // → 25
```

---

## Izinhlu

Izinhlu **ziyaguquleka** futhi zigcina izinto ze**uhlobo olufanayo**.

```zymbol
uhlu = [1, 2, 3, 4, 5]

uhlu[0]          // 1 — ukufinyelela (inkomba eqala ku-0)
uhlu[-1]         // 5 — inkomba engemva (yokugcina)
uhlu$#           // 5 — ubude (sebenzisa (uhlu$#) ku->>)

uhlu = uhlu$+ 6            // engeza → [1,2,3,4,5,6]
uhlu2 = uhlu$+[2] 99       // faka ku-inkomba 2
uhlu3 = uhlu$- 3           // susa ukuvela kokuqala kwexabiso
uhlu4 = uhlu$-- 3          // susa konke ukuvela
uhlu5 = uhlu$-[0]          // susa ku-inkomba
uhlu6 = uhlu$-[1..3]       // susa isikhala (ukuphela akufakiwe)

kukhona = uhlu$? 3          // #1 — unayo
izikhundla = uhlu$?? 3      // [2] — zonke izinkomba zexabiso
sl = uhlu$[0..3]            // [1,2,3] — isiqephu (ukuphela akufakiwe)
sl2 = uhlu$[0:3]            // [1,2,3] — uhlobo lwendawo

enyuka = uhlu$^+             // lohlelwe kwe-ascending (primitives kuphela)
yehlela = uhlu$^-            // lohlelwe kwe-descending (primitives kuphela)

// Izinhlu tuple — sebenzisa $^ nelembu lokufanisa
idatha = [(igama: "Carla", iminyaka: 28), (igama: "Ana", iminyaka: 25), (igama: "Bob", iminyaka: 30)]
ngeminyaka  = idatha$^ (a, b -> a.iminyaka < b.iminyaka)    // ascending ngeminyaka
negama = idatha$^ (a, b -> a.igama > b.igama)               // descending negama
>> ngeminyaka[0].igama ¶     // → Ana
>> negama[0].igama ¶         // → Carla

// Buyekeza into ngqo (izinhlu kuphela)
uhlu[1] = 99              // nikela
uhlu[0] += 5              // intlanganiselo: +=  -=  *=  /=  %=  ^=

// Buyekeza ngomsebenzi — ibuya uhlu olusha; owokuqala awuguquki
uhlu2 = uhlu[1]$~ 99
```

> Zonke izisebenzisi zokuqokelela zibuya **uhlu olusha**. Phinda unikezele: `uhlu = uhlu$+ 4`.
> Izisebenzisi azikwazi ukuxhomeka — sebenzisa ukubekwa okwehlukanisiweyo.
> `$^+` / `$^-` zihlela **izinhlu zamaprimitive** (izinombolo, izintambo). Kwizinhlu tuple sebenzisa `$^` nelelembu lokufanisa — inhloso ikhona kulelembu (`<` = ascending, `>` = descending).

**Izincwadi zexabiso** — ukubekwa kwenhlu kwenguquli enye kukhiqiza ikopi ezimeleyo:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ayiguquki
```

```zymbol
// Izinhlu ezifakwe phakathi
imetriksi = [[1,2,3],[4,5,6],[7,8,9]]
>> imetriksi[1][2] ¶    // → 6
```

---

## Ukuhlukana

```zymbol
// Uhlu
uhlu = [10, 20, 30, 40, 50]
[a, b, c] = uhlu               // a=10  b=20  c=30
[okuqala, *okunye] = uhlu      //okuqala=10  okunye=[20,30,40,50]
[x, _, z] = [1, 2, 3]          // _ lalahlwa

// Tuple wendawo
ikhwelo = (100, 200)
(px, py) = ikhwelo             // px=100  py=200

// Tuple enegama
umuntu = (igama: "Ana", iminyaka: 25, idolobha: "Durban")
(igama: g, iminyaka: m) = umuntu   // g="Ana"  m=25
```

---

## Tuples

I-Tuples **ayiguquleki** izindishi ezihlelelwe ezinokuqukumbela amanani **ezinhlobo ezihlukeneyo**. Hayi njengezinhlu, izinto azikwazi ukuguqulwa emva kokudaliwa.

```zymbol
// Ngendawo
ikhwelo = (10, 20)
>> ikhwelo[0] ¶    // → 10

idatha = (42, "sawubona", #1, 3.14)
>> idatha[2] ¶     // → #1

// Enegama
umuntu = (igama: "Alice", iminyaka: 25)
>> umuntu.igama ¶    // → Alice
>> umuntu[0] ¶       // → Alice  (inkomba nayo isebenza)

// Efakwe phakathi
indawo = (x: 10, y: 20)
p = (indawo: indawo, isihloko: "izikhala")
>> p.indawo.x ¶     // → 10
```

**Ukungaguquleki** — noma iyiphi imizamo yokuguqula into ye-tuple yiphutha lesikhathi sokusebenza:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ iphutha lesikhathi sokusebenza: ii-tuples aziguquleki
// t[0] += 5    // ❌ iphutha elifanayo
```

Ukufumana ixabiso eliguquliweyo sebenzisa `$~` (buyekeza ngomsebenzi) — ibuya i-tuple **entsha**:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← owokuqala awuguquki
>> t2 ¶    // → (10, 999, 30)

// I-tuple enegama — yakha ngokucacileyo
umuntu = (igama: "Alice", iminyaka: 25)
omdala  = (igama: umuntu.igama, iminyaka: 26)
>> umuntu.iminyaka ¶    // → 25
>> omdala.iminyaka ¶      // → 26
```

---

## Imisebenzi yeNqanaba eliPhezulu

> Izenzo ze-HOF zidinga **iLambda elihlangene** — akukho iguquli yeLambda ngqo.

```zymbol
izinombolo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

kabili      = izinombolo$> (x -> x * 2)                // map  → [2,4,6…20]
amaphakathi = izinombolo$| (x -> x % 2 == 0)            // filter → [2,4,6,8,10]
isamba      = izinombolo$< (0, (acc, x) -> acc + x)     // reduce → 55

// Ukuxhuma ngesigaba
isigaba1 = izinombolo$| (x -> x > 3)
isigaba2 = isigaba1$> (x -> x * x)
>> isigaba2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Imisebenzi enegama ku-HOF — ibiyela ku-lambda
kabili_f(x) { <~ x * 2 }
r = izinombolo$> (x -> kabili_f(x))    // ✅
```

---

## Umqhubi Wepayipi

Uhlangothi lwesokudla luhlala ludinga `_` njengesibambelo sexabiso elidlulisiwe:

```zymbol
kabili = x -> x * 2
engeza = (a, b) -> a + b
engeza_munye = x -> x + 1

5 |> kabili(_)            // → 10
10 |> engeza(_, 5)        // → 15
5 |> engeza(2, _)         // → 7

// Uxhuma
r = 5 |> kabili(_) |> engeza_munye(_) |> kabili(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Ukubhekana nezinkinga

```zymbol
!? {
    ixephelo = 10 / 0
} :! ##Div {
    >> "ukwabela ngeqanda" ¶
} :! {
    >> "elinye iphutha: " _err ¶    // _err ibambe umlayezo wephutha
} :> {
    >> "iyasebenza njalo" ¶
}
```

| Uhlobo | Nini kwenzeka |
|--------|---------------|
| `##Div` | Ukwabela ngeqanda |
| `##IO` | Ifayela / Uhlelo |
| `##Index` | Inkomba ingaphandle kwendawo |
| `##Type` | Iphutha lohlobo |
| `##Parse` | Iphutha lokuhlaziya |
| `##Network` | Iphutha lenethiwekhi |
| `##_` | Noma yiliphi iphutha (catch-all) |

---

## Izimodyuli

```zymbol
// lib/izibalo.zy
# izibalo

#> { hlukanisa, thola_PI }    // Ukukhipha NGAPHAMBI kwezincazelo

_PI := 3.14159
hlukanisa(a, b) { <~ a + b }
thola_PI() { <~ _PI }
```

```zymbol
// main.zy
<# ./lib/izibalo <= iz    // Isithonjana sidingeka

>> iz::hlukanisa(5, 3) ¶  // → 8
pi = iz::thola_PI()
>> pi ¶                    // → 3.14159
```

```zymbol
// Khipha ngegama lomphakathi elikhethiweyo
# umtapo_wolwazi
#> { _hlukanisa_ngaphakathi <= isamba }

_hlukanisa_ngaphakathi(a, b) { <~ a + b }
```

```zymbol
<# ./umtapo_wolwazi <= u

>> u::isamba(3, 4) ¶    // → 7  (igama langaphakathi _hlukanisa_ngaphakathi lifihlwe)
```

---

## Izisebenzisi Zedata

```zymbol
// Guqula intambo ibe inombolo
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (okhuselekile, akukho phutha)

// Yenqabeza / sika
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (yenqabeza izindawo ezimbili zamadesimu)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (sika)

// Ukwakheka kwenombolo
fmt = #,|1234567|      // → 1,234,567  (ahlukaniswe ngamakhoma)
sci = #^|12345.678|    // → 1.2345678e4  (sayensi)

// Izinombolo zomsinsi
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Ukukhishwa kokuguqulwa komsinsi
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Ukuhlanganiswa kweShell

```zymbol
usuku = <\ date +%Y-%m-%d \>     // ibamba i-stdout (iqukethe \n yokugcina)
>> "Namuhla: " usuku

ifayela = "data.txt"
okuqukethwe = <\ cat {ifayela} \>  // ukufaka emikhakhazeni

okuphuma = </"./iscriptlencane.zy"/>  // qalisa iskripthi se-Zymbol elinye, bamba okuphuma
>> okuphuma
```

> `><` ibamba izimpikiswano ze-CLI njengesoluhlu lwezintambo (tree-walker kuphela).

---

## Isibonelo Esiphelele: FizzBuzz

```zymbol
hlukanisa(inombolo) {
    ? inombolo % 15 == 0 { <~ "FizzBuzz" }
    _? inombolo % 3  == 0 { <~ "Fizz" }
    _? inombolo % 5  == 0 { <~ "Buzz" }
    _ { <~ inombolo }
}

@ i:1..20 { >> hlukanisa(i) ¶ }
```

---

## Isigcawu sezimpawu

| Impawu | Umsebenzi | Impawu | Umsebenzi |
|--------|-----------|--------|-----------|
| `=` | isiguquli | `$#` | ubude |
| `:=` | constant | `$+` | engeza |
| `>>` | okukhishwayo | `$+[i]` | faka ku-inkomba |
| `<<` | ukufakwayo | `$-` | susa okuqala ngexabiso |
| `¶` / `\\` | umugqa omusha | `$--` | susa konke ngexabiso |
| `?` | uma (if) | `$-[i]` | susa ku-inkomba |
| `_?` | uma-futhi (elif) | `$-[i..j]` | susa isikhala |
| `_` | ngenye / indawo | `$?` | unayo |
| `??` | match | `$??` | thola zonke izinkomba |
| `@` | inqubo (loop) | `$[s..e]` | isiqephu |
| `@!` | phuma (break) | `$>` | map |
| `@>` | qhubeka (continue) | `$\|` | filter |
| `->` | lambda | `$<` | reduce |
| `uhlu[i] = val` | buyekeza into (izinhlu kuphela) | `uhlu[i] += val` | buyekeza intlanganiselo |
| `uhlu[i]$~` | buyekeza ngomsebenzi (ikopi entsha) | `$^+` | hlela kwe-ascending (primitives) |
| `$^-` | hlela kwe-descending (primitives) | `$^` | hlela ngokufanisa (tuple) |
| `<~` | buyela (return) | `!?` | zama (try) |
| `\|>` | payipi | `:!` | bamba (catch) |
| `#1` | iqiniso (true) | `:>` | njalo (finally) |
| `#0` | amanga (false) | `$!` | yiphutha |
| `<#` | ngenisa (import) | `$!!` | dlulisa iphutha |
| `#` | memezela imodyuli | `#>` | khipha (export) |
| `::` | shaya imodyuli | `.` | finyelela insimu |
| `#\|..\|` | guqula inombolo | `#?` | metadata yohlobo |
| `#.N\|..\|` | yenqabeza | `#!N\|..\|` | sika |
| `#,\|..\|` | ukwakheka kwamakhoma | `#^\|..\|` | sayensi |
| `#d0d9#` | ukushintsha indlela yezinombolo | `#09#` | buyisela kwi-ASCII |
| `<\ ..\>` | qalisa i-shell | `>\<` | izimpikiswano ze-CLI |

## Umlando Wezinguqulo

### v0.0.3 — Unicode Izinhlobo Zenombolo & Ukuphuculwa kwe-LSP _(Ephreli 2026)_

- **Yengezwa** Amabloko angama-69 e-Unicode enombolo ngetoken yokushintsha indlela `#d0d9#`
- **Yengezwa** Izinhlobo ze-boolean kuwo wonke uhlobo — `#१` / `#०`, `#١` / `#٠`, njll
- **Yengezwa** Izinombolo ze-Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Yengezwa** I-VM opcode `SetNumeralMode` — ukulingana okugcwele ne-tree-walker
- **Yengezwa** I-REPL ihlonela indlela yezinombolo esebenzayo kwi-echo nakubonisa iziguquli
- **Ilungisiwe** Imiphumela ye-`>>` ye-boolean manje ibandakanya `#` i-prefix (`#0` / `#1`) kuzo zonke izindlela

### v0.0.2_01 — Ukuphinda Igama Lezixhobo _(30 Mar 2026)_

- **Ilungisiwe** `c|..|` → `#,|..|` ne-`e|..|` → `#^|..|` — ngokuhambelana nosapho lwe-`#`
- **Yengezwa** I-alias yokuthumela: ukuthumela kwakhona amalungu emoduli ngegama elikhethiwe

### v0.0.2 — Ukwakhiwa Kabusha kwe-API Yemiqoqo & Amaseti Okufaka _(24 Mar 2026)_

- **Yengezwa** Usapho lwezixhobo `$` oluhlanganisiwe kwamarrays namagama (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Yengezwa** Ukuqhekeza kwamarrays, amatuples namatuples anegama
- **Yengezwa** Amaziso amahle (`arr[-1]` = into yokugcina)
- **Yengezwa** Amaseti okufaka omthombo — Linux (deb/rpm/pkg/musl), macOS, Windows

### v0.0.1-patch _(25 Mar 2026)_

- **Yengezwa** Ukufakwa okuhlanganisiwe `^=`
- **Ilungisiwe** Imeko yomda we-parser yezibalo; ukulungiswa kwamaxwebhu

### v0.0.1 — Ukukhishwa Kokuqala Kokulawuleka _(22 Mar 2026)_

- Tree-walker interpreter + register VM (`--vm`, ~4× ngokukhawuleza, ~95% ukulingana)
- Zonke izakhiwo zesiseko: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Izichazi ze-Unicode ezigcwele, inkqubo yemoduli, lambda, ukuvalwa, ukulawula amaphutha
- REPL, LSP, i-VS Code extension, formatter (`zymbol fmt`)

---

*Zymbol-Lang — Izimpawu. Umhlaba wonke. Ayiguquki.*

> **Isixwayiso:** Lo mhlahlandlela wenziwa futhi waguqulelwa yi-artificial intelligence (AI).
> Yize kwenziwe yonke imizamo yokwenza izinto zicace, ezinye izinguqulo noma izibonelo zingaba neziphosiso.
> Incwadi ebalulekile yolimi i-[MANUAL.md](https://github.com/zymbol-lang/interpreter) ku-interpreter repository.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> The canonical reference is [MANUAL.md](https://github.com/zymbol-lang/interpreter) in the interpreter repository.
