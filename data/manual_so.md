# Buug-yaraha Kooban ee Zymbol-Lang

**Zymbol-Lang** waa luqad barnaamij ah oo astaan ah. Ereyada muhiimka ah ma isticmaasho — wax kastaa astaan. Si isku mid ah ayey ugu shaqeysaa luqadda aadanaha kasta.

- Ereyada muhiimka ah ma jiraan (`if`, `while`, `return` ma jiraan — astaamaha kaliya `?`, `@`, `<~`)
- Unicode buuxa — magacyada kasta oo luqad ah ama emoji 👋
- Luqad-agoon — koodka wuu isku mid yahay dhammaan luqadaha

---

## Doorsoomayaasha iyo Joogta

```zymbol
x = 10              // Doorsoomaha (wax laga beddeli karo)
PI := 3.14159       // Joogta — khalad haddii dib loo qoondeeyo
magac = "Ana"
run = #1            // Boolean run
👋 := "Nabad"
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

## Noocyada Xogta

| Nooca            | Tusaale             | Astaan `#?` | Xusuus-qoryo                         |
|------------------|---------------------|-------------|--------------------------------------|
| Tiro Buuxda      | `42`, `-7`          | `###`       | 64-Bit oo calaamad leh               |
| Tiro Jajaban     | `3.14`, `1.5e10`    | `##.`       | Xisaabta sayniska OK                 |
| Xaraf-xidid      | `"nabad"`           | `##"`       | Gelinta: `"Nabad {magac}"`           |
| Xaraf Keliya     | `'A'`               | `##'`       | Xaraf Unicode ah oo keliya           |
| Boolean          | `#1`, `#0`          | `##?`       | MA aha tiroyinka 1 iyo 0             |
| Taxane           | `[1, 2, 3]`         | `##]`       | Dhammaan xubnuhu waa nooc isku mid ah|
| Tupul            | `(a, b)`            | `##)`       | Meel-meel                            |
| Tupul La Magacaabay | `(x: 1, y: 2)`  | `##)`       | Galitaanka magac ama tirsi            |

```zymbol
// Xog-raadinta nooca — waxay soo celisaa (nooc, tirsiyo, qiime)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Muujinta iyo Galinta

```zymbol
>> "Nabad" ¶                    // ¶ ama \\ waxay bixisaa xaraf-saarka cad
>> "a=" a " b=" b ¶             // qiyamyo badan oo ku xiga
>> (arr$#) ¶                    // hawlaha postfix waxay u baahan yihiin xagasha

<< magac                        // la'aanta tilmaan — akhrinta doorsoomaha
<< "Magacaaga? " magac          // tilmaan leh
```

> `¶` ama `\\` waxay u dhiganyihiin xaraf-saarka.

---

## Hawlwadeenada

```zymbol
// Xisaab — isticmaal qoondaynta; qaar ka mid ah hawlwadeenadu waxay leeyihiin dheelli-tir ku >> toosan
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (qaybinta tirada buuxda)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (awood-yeelista)

// Barbar-dhigga
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Macquul
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Xargaha

```zymbol
// Saddex qaab oo isku-xidhka ah
magac = "Ana"
n = 42

fariin = "Nabad ", magac, "!"               // xigashada — qoondaynta
>> "Nabad " magac " waxaad tahay " n ¶      // ku-xigeenka — muujinta >>
sharax = "Nabad {magac}, waxaad tahay {n}"  // gelinta — meel kastaba
```

```zymbol
s = "Nabad Adduunka"
len = s$#                  // 12
sub = s$[0..5]             // "Nabad"  (dhamaadka iska-dhaarshiis)
has = s$? "Adduunka"       // #1
parts = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["a":"A"]        // "NAbAd AdduunkA"
rep1 = s$~~["a":"A":1]     // "NAbad Adduunka"  (koowaad N kaliya)
```

> `+` waa tiroyinka keliya. Isticmaal `,`, ku-xigeenka, ama gelinta xaraf-xididka.

---

## Xukumaynta Socodka

```zymbol
x = 7

? x > 0 { >> "togan" ¶ }

? x > 100 {
    >> "weyn" ¶
} _? x > 0 {
    >> "togan" ¶
} _? x == 0 {
    >> "eber" ¶
} _ {
    >> "tirsi" ¶
}
```

> Xagashada `{ }` waa **waajib**, xitaa xariiq keliya.

---

## Match

```zymbol
// Kala-duwanaansho
dhibcood = 85
qiimaha = ?? dhibcood {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> qiimaha ¶    // → B

// Xaraf-xididyo
midab = "cas"
kood = ?? midab {
    "cas"   : "#FF0000"
    "cagaar": "#00FF00"
    _       : "#000000"
}

// Ilaaliyayaasha
heer = -5
xaalad = ?? heer {
    _? heer < 0  : "baraf"
    _? heer < 20 : "qabow"
    _? heer < 35 : "diiran"
    _            : "kulul"
}
>> xaalad ¶    // → baraf

// Qaabka bayaanka (gacmaha xagasha)
?? n {
    0       : { >> "eber" ¶ }
    _? n < 0: { >> "tirsi" ¶ }
    _       : { >> "togan" ¶ }
}
```

---

## Wareegyada

```zymbol
@ i:0..4  { >> i " " }        // kala-duwanaanshaha dhameystiran: 0 1 2 3 4
@ i:1..9:2 { >> i " " }       // tallaabo leh: 1 3 5 7 9
@ i:5..0:1 { >> i " " }       // dib-u-rogal: 5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (intay jirto)

khudaar = ["Tufaax", "Muus", "Canab"]
@ f:khudaar { >> f ¶ }

@ c:"nabad" { >> c "-" }
>> ¶                          // → n-a-b-a-d-

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> sii-wad
    ? i > 7 { @! }             // @! jooji
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Wareeg aan dhamaanayn
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Wareeg la magacaabay (joojin xidid)
count = 0
@ @outer {
    count++
    ? count >= 3 { @! outer }
}
>> count ¶                    // → 3
```

---

## Hawlaha

```zymbol
ku_dar(a, b) { <~ a + b }
>> ku_dar(3, 4) ¶    // → 7

xasaab(n) {
    ? n <= 1 { <~ 1 }
    <~ n * xasaab(n - 1)
}
>> xasaab(5) ¶    // → 120
```

Hawluhu waxay leeyihiin **xudduud gooni ah** — ma gaadaan doorsoomayaasha dibadda. Isticmaal `<~` si aad u beddesho doorsoomayaasha waciyaha:

```zymbol
bedel(a<~, b<~) {
    ku_meel_gaar = a
    a = b
    b = ku_meel_gaar
}
x = 10
y = 20
bedel(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Hawlaha la magacaabay ma ahan qiyam heer-koowaad. Si loogu gudbiyoo dood ahaan, geli: `x -> magac(x)`.

---

## Lambda iyo Xidhidka

```zymbol
laban_laab = x -> x * 2
wadarta = (a, b) -> a + b
>> laban_laab(5) ¶    // → 10
>> wadarta(3, 7) ¶    // → 10

// Lambda xagasha leh
kala_sooc = x -> {
    ? x > 0 { <~ "togan" }
    _? x < 0 { <~ "tirsi" }
    <~ "eber"
}

// Xidhidyo — Lambdas waxay qaadanaan doorsoomayaasha dibadda
qiimayn = 3
saddex_laab = x -> x * qiimayn
>> saddex_laab(7) ¶    // → 21

// Warshada hawlaha
samee_kudar(n) { <~ x -> x + n }
kudar10 = samee_kudar(10)
>> kudar10(5) ¶    // → 15

// Taxanaha
hawlaha = [x -> x+1, x -> x*2, x -> x*x]
>> hawlaha[2](5) ¶    // → 25
```

---

## Taxanayaasha

Taxanayaashu **waa la bedeli karaa** (mutable) waxayna ku jiraan curiyayaal **nooc isku mid ah**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — galitaan (tilsi aasaas-0)
arr[-1]         // 5 — tilsi taban (u dambeeya)
arr$#           // 5 — dherer (isticmaal (arr$#) ku >>)

arr = arr$+ 6            // ku-dar → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // geli tilsi 2
arr3 = arr$- 3           // ka-saar koowaad ee qiimaha
arr4 = arr$-- 3          // ka-saar dhammaan
arr5 = arr$-[0]          // ka-saar tilsiga
arr6 = arr$-[1..3]       // ka-saar kala-duwanaanshaha (dhamaadka iska-dhaarshiis)

jiraa = arr$? 3            // #1 — ku-jiraa
pos = arr$?? 3             // [2] — dhammaan tilsiyadii qiimaha
goyn = arr$[0..3]          // [1,2,3] — goynta (dhamaadka iska-dhaarshiis)
goyn2 = arr$[0:3]          // [1,2,3] — syntax tirsi-ku-saleysan

kor = arr$^+               // isku-hore (primitives kaliya)
hoos = arr$^-              // isku-dambe (primitives kaliya)

// Tupul magacaabay/meel-meel — isticmaal $^ lambda barbar-dhig leh
db = [(magac: "Carla", da: 28), (magac: "Ana", da: 25), (magac: "Bob", da: 30)]
biyo_da    = db$^ (a, b -> a.da < b.da)
biyo_magac = db$^ (a, b -> a.magac > b.magac)
>> biyo_da[0].magac ¶     // → Ana
>> biyo_magac[0].magac ¶  // → Carla

// Cusboonaysii curiyaha si toos ah (taxanayaasha kaliya)
arr[1] = 99               // qoondee
arr[0] += 5               // compound: +=  -=  *=  /=  %=  ^=

// Cusboonaysii shaqeyneed — taxane cusub soo celiya; asalka ma beddelo
arr2 = arr[1]$~ 99
```

> Dhammaan hawlwadeenada ururinta waxay soo celiyaan **taxane cusub**. Dib u qoondee: `arr = arr$+ 4`.
> Silsiladayn ma jirto — isticmaal qoondaynta dhexe.
> `$^+` / `$^-` waxay kala-saaraan **taxanaha primitive-ka**. Tupulaha isticmaal `$^` lambda barbar-dhig leh.

**Semantigga qiimaha** — u qoondaynta taxane doorsoomaha kale koobi madaxbanaan abuuraa:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ma beddelin
```

```zymbol
// Taxanaha xidid ah
matriks = [[1,2,3],[4,5,6],[7,8,9]]
>> matriks[1][2] ¶    // → 6
```

---

## Kala-saaris

```zymbol
// Taxane
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[kowaad, *indharta] = arr    // kowaad=10  indharta=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ tuuraa

// Tupul meel-meel
dhibic = (100, 200)
(px, py) = dhibic            // px=100  py=200

// Tupul la magacaabay
qof = (magac: "Ana", da: 25, magaalo: "Muqdisho")
(magac: m, da: d) = qof      // m="Ana"  d=25
```

---

## Tupulaha

Tupulahu waa weelal **aan la bedeli karin** (immutable) oo leh curiyayaal **noocyo kala duwan**. Kala duwan taxanayaasha, curiyayaasha ma beddeli karto ka dib abuurista.

```zymbol
// Meel-meel
dhibic = (10, 20)
>> dhibic[0] ¶    // → 10

xog = (42, "salaan", #1, 3.14)
>> xog[2] ¶     // → #1

// La magacaabay
qof = (magac: "Alice", da: 25)
>> qof.magac ¶    // → Alice
>> qof[0] ¶       // → Alice (tilsiga wuu shaqeeyaa sidoo kale)

// Xidid
pos = (x: 10, y: 20)
p = (pos: pos, summad: "asalka")
>> p.pos.x ¶        // → 10
```

**Aan la bedeli karin (Immutabilité)** — isku daygga beddelka curiyaha waa khalad wakhti-socodka:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ khalad wakhti-socodka: tupulaha ma beddelo
// t[0] += 5    // ❌ khalad isku mid ah
```

Isticmaal `$~` (cusboonaysii shaqeyneed) si aad u hesho qiime beddel — **tupul cusub** soo celisaa:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← asalka ma beddelin
>> t2 ¶    // → (10, 999, 30)

// Tupul magacaabay — dib u dhis si cad
qof = (magac: "Alice", da: 25)
qof2  = (magac: qof.magac, da: 26)
>> qof.da ¶    // → 25
>> qof2.da ¶   // → 26
```

---

## Hawlaha Heerka Sare

> Hawlaha HOF waxay u baahan yihiin **lambda-gooni-ah** — doorsoomaha lambda ma toos ah.

```zymbol
tirooyin = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

laban_laaban = tirooyin$> (x -> x * 2)                // map  → [2,4,6…20]
lablaab      = tirooyin$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
wadarta      = tirooyin$< (0, (acc, x) -> acc + x)     // reduce → 55

// Silsilad dhexe
tallaabo1 = tirooyin$| (x -> x > 3)
tallaabo2 = tallaabo1$> (x -> x * x)
>> tallaabo2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Hawlaha magacaabay HOF-ga — ku duub lambda
laban_laab(x) { <~ x * 2 }
r = tirooyin$> (x -> laban_laab(x))    // ✅
```

---

## Hawlwadeen Tuubada

RHS waxay u baahan tahay `_` oo ah meel-buuxiye qiimaha la gudbiyay:

```zymbol
laban_laab = x -> x * 2
ku_dar = (a, b) -> a + b
kor_u_qaad = x -> x + 1

5 |> laban_laab(_)        // → 10
10 |> ku_dar(_, 5)        // → 15
5 |> ku_dar(2, _)         // → 7

// Silsilad
r = 5 |> laban_laab(_) |> kor_u_qaad(_) |> laban_laab(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Maaraynta Khaladaadka

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "qaybinta eber" ¶
} :! {
    >> "khalad kale: " _err ¶    // _err wuxuu haysataa farriinta khaladka
} :> {
    >> "had iyo jeer waa socdaa" ¶
}
```

| Nooca       | Goorta ay dhacdo                  |
|-------------|-----------------------------------|
| `##Div`     | Qaybinta eber                     |
| `##IO`      | Faylka / Nidaamka                 |
| `##Index`   | Tilsiga ka baxsan kala-duwanaanshaha |
| `##Type`    | Khaladka nooca                    |
| `##Parse`   | Khaladka falanqaynta              |
| `##Network` | Khaladka shabakadda               |
| `##_`       | Khalad kasta (qabasho-dhammaad)   |

---

## Moduulada

```zymbol
// Faylka: lib/xisaab.zy
# xisaab

#> { ku_dar, hel_PI }    // Dhoofinta KA HOR qeybaha

_PI := 3.14159
ku_dar(a, b) { <~ a + b }
hel_PI() { <~ _PI }
```

```zymbol
// Faylka: main.zy
<# ./lib/xisaab <= x    // Magac-dhaadhicin waajib ah

>> x::ku_dar(5, 3) ¶  // → 8
pi = x::hel_PI()
>> pi ¶                // → 3.14159
```

```zymbol
// Dhoofin magac kala duwan
# mylib
#> { _internal_add <= wadarta }

_internal_add(a, b) { <~ a + b }
```

```zymbol
<# ./mylib <= m

>> m::wadarta(3, 4) ¶    // → 7  (magaca gudaha _internal_add waa qarsoodi)
```

---

## Hababka Tirooyinka

Zymbol waxay u muujin kartaa tirada **Unicode qoraalada tirooyin 69** — Devanagari, Carabi-Hindiya, Thai, Klingon pIqaD, Xisaab Adag, qaybaha LCD iyo kuwa kale. Habka firfircoon waxuu saameeyaa keliya bixinta `>>`; xisaabta gudaha waa binary mar walba.

### Hawlgalin qoraal

Ku qor tiro `0` iyo `9` ee qoraalka la rabo ee ku jira `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabic-Indic  (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // reset to ASCII
```

### Bixinta iyo qiyamka boolean

```zymbol
x = 42
>> x ¶          // → 42   (ASCII default)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४
>> 1 + 2 ¶      // → ३

// Boolean: # hore mar walba ASCII, tiro ayaa is-beddelaysa
>> #1 ¶         // → #१
>> #0 ¶         // → #०

x = 28 > 4
>> x ¶          // → #१
```

### Tirooyin asalka ah oo ku jira koodka

Tirooyin kasta oo qoraal la taageero waa literals sax ah — meelaynta, modulo, barbaraadinta:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolean literals qoraal kastaba

`#` + tiro `0` ama `1` block kasta waa literal boolean sax ah:

```zymbol
#٠٩#
نشط = #١
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` waa **mar walba ASCII**. `#0` (been) waxay mar walba muujisaa kala duwanaansho muuqaal ahaan ka `0` (eber tirada) qoraal kasta.

---

## Hawlwadeenada Xogta

```zymbol
// Xaraf-xidid u bedel tiro
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (khalad-badbaado)

// Wareejin / jaro
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (u wareejin 2 goobood)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (jaro)

// Qaabka tirada
fmt = #,|1234567|      // → 1,234,567  (comma-goynta)
sci = #^|12345.678|    // → 1.2345678e4  (saynis)

// Base literals
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Beddelka xeerada
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Dhismaha Shell

```zymbol
taariikhda = <\ date +%Y-%m-%d \>     // qaado stdout (oo ay ku jirto \n dhamaadka)
>> "Maanta: " taariikhda

faylka = "data.txt"
waxa_ku_jira = <\ cat {faylka} \>     // interpolation amarrada

output = </"./subscript.zy"/>          // fuliso qoraalka Zymbol kale, qaado output
>> output
```

> `><` waxay qaadanayaan doodaha CLI ahaan taxane string (tree-walker kaliya).

---

## Tusaale Buuxa: FizzBuzz

```zymbol
kala_sooc(tiro) {
    ? tiro % 15 == 0 { <~ "FizzBuzz" }
    _? tiro % 3  == 0 { <~ "Fizz" }
    _? tiro % 5  == 0 { <~ "Buzz" }
    _ { <~ tiro }
}

@ i:1..20 { >> kala_sooc(i) ¶ }
```

---

## Tixraaca Astaamaha

| Astaan | Hawsha | Astaan | Hawsha |
|--------|--------|--------|--------|
| `=` | Doorsoomaha | `$#` | Dhererka |
| `:=` | Joogta | `$+` | ku-dar |
| `>>` | Muujinta | `$+[i]` | geli tilsiga |
| `<<` | Galinta | `$-` | ka-saar koowaad qiimaha |
| `¶` / `\\` | Xaraf-saarka | `$--` | ka-saar dhammaan qiimaha |
| `?` | haddii (if) | `$-[i]` | ka-saar tilsiga |
| `_?` | haddii-kalena (elif) | `$-[i..j]` | ka-saar kala-duwanaanshaha |
| `_` | haddii-kale / meel-buuxin | `$?` | ku-jiraa |
| `??` | match | `$??` | dhammaan tilsiyadii |
| `@` | Wareegga | `$[s..e]` | Goynta |
| `@!` | jooji (break) | `$>` | map |
| `@>` | sii-wad (continue) | `$\|` | filter |
| `->` | Lambda | `$<` | reduce |
| `arr[i] = val` | cusboonaysii curiyaha (taxanayaasha kaliya) | `arr[i] += val` | cusboonaysii compound |
| `arr[i]$~` | cusboonaysii shaqeyneed (koobi cusub) | `$^+` | kala-saar kor (primitives) |
| `$^-` | kala-saar hoos (primitives) | `$^` | kala-saar comparator (tuples) |
| `<~` | soo-celi (return) | `!?` | isku-day (try) |
| `\|>` | Pipe | `:!` | qaado (catch) |
| `#1` | run | `:>` | had-jeer (finally) |
| `#0` | been | `$!` | khalad ma ah |
| `<#` | keeno (import) | `$!!` | khaladka gudbii |
| `#` | moduulka bayaan | `#>` | dhoofi |
| `::` | wicitaanka moduulka | `.` | galitaanka goobta |
| `#\|..\|` | tiro parse | `#?` | metadata nooca |
| `#.N\|..\|` | wareejin | `#!N\|..\|` | jaro |
| `#,\|..\|` | qaabka comma | `#^\|..\|` | saynis |
| `#d0d9#` | beddelka habka tirooyinka | `#09#` | dib u celi ASCII |
| `<\ ..\>` | shell exec | `>\<` | doodaha CLI |

## Taariikhda Noocyada

### v0.0.3 — Unicode Nidaamyada Tirooyin & Horumarinta LSP _(Abriil 2026)_

- **La daray** Block 69 Unicode ah oo tirooyin ah oo leh calaamad beddelka hababka `#d0d9#`
- **La daray** Boolean literals qoraal kastaba — `#१` / `#०`, `#١` / `#٠`, iwm
- **La daray** Klingon pIqaD tirooyin (CSUR PUA U+F8F0–U+F8F9)
- **La daray** VM opcode `SetNumeralMode` — sinnaanta buuxda ee tree-walker
- **La daray** REPL waxay xurmeysaa habka tirooyinka firfircoon ee echo iyo muujinta doorsoome
- **La beddelay** Bixinta `>>` ee boolean hadda waxay leedahay `#` hore (`#0` / `#1`) hababka oo dhan

### v0.0.2_01 — Magacaabista Hawlwadeenada _(30 Mar 2026)_

- **La beddelay** `c|..|` → `#,|..|` iyo `e|..|` → `#^|..|` — waafaqsan qoyska `#`
- **La daray** Alias dhoofin: dib u dhoofinta xubnaha module magac kale

### v0.0.2 — Dib-u-naqshadaynta API Uruurinta & Dejiyayaasha _(24 Mar 2026)_

- **La daray** Qoyska hawlwadeenada `$` midaysan arrays iyo strings (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **La daray** Destructuring arrays, tuples iyo tuples magac leh
- **La daray** Indexes taban (`arr[-1]` = curiyaha ugu danbeeya)
- **La daray** Dejiyayaasha asalka ah — Linux (deb/rpm/pkg/musl), macOS, Windows

### v0.0.1-patch _(25 Mar 2026)_

- **La daray** Xilsi isku dhafan `^=`
- **La hagaajiyay** Xaaladaha xadka parser xisaab; saxitaanka dukumeentiyada

### v0.0.1 — Sii-deynta Dadweynaha ee Ugu Horreysa _(22 Mar 2026)_

- Tree-walker interpreter + register VM (`--vm`, ~4× degdeg, ~95% sinnaanta)
- Dhammaan qaabaynta aasaasiga ah: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Unicode aqoonsiyeyaasha buuxa, nidaamka module, lambdas, xidhnaanta, maaraynta khaladaadka
- REPL, LSP, VS Code extension, formatter (`zymbol fmt`)

---

*Zymbol-Lang — Astaan. Caalami. Joogto.*

> **Ogeysiis:** Buug-yarahani waxaa sameeya oo tarjumay Garashada Macquulka ah (AI).
> Wax walba ayaa lagu dadaalay si loo hubiyo saxnaanta, laakiin tarjumaadaha qaar ama tusaalooyinka waxaa laga yaabaa inay khaladaad leeyihiin.
> Tixraaca rasmiga ah waa [Qeybinta Zymbol-Lang](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
