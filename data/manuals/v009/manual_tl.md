> **Paunawa:** Ang dokumentong ito ay nilikha at isinalin ng artificial intelligence (AI).
>
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
>
> Ang kanonikal na sanggunian ay ang **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** sa repository ng interpreter.

---

# Manwal ng Zymbol-Lang

> **Binago para sa v0.0.9 — 2026-09-07**

**Zymbol-Lang** ay isang simbolikong programming language. Walang salita sa gramatika nito — bawat konstruksiyon ay isang marka. Gumagana nang pareho sa anumang wika ng tao.

- Walang `if`, `while`, `return` — tanging `?`, `@`, `<~`
- Buong Unicode — mga identifier sa anumang wika o emoji
- Hindi umaasa sa wika ng tao — ang code ay pareho sa lahat ng lugar

**Bersyon ng interpreter**: v0.0.9 | **Saklaw ng pagsubok**: 660/666 (tatlong engine ay sumasang-ayon, 0 ang nagkakaiba)

---

## Mga Baryabol at Konstante

```zymbol
x = 10              // nababagong baryabol
PI := 3.14159       // konstante — muling pagtatalaga ay runtime error
pangalan = "Maria"
aktibo = #1         // boolean na totoo
👋 := "Kumusta"
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

`°` (degree sign, U+00B0) awtomatikong nagpapasimula ng baryabol sa neutral na halaga nito sa unang paggamit:

```zymbol
mga_numero = [3, 1, 4, 1, 5]
@ n:mga_numero {
    °kabuuan += n
}
>> kabuuan ¶              // → 14
```

> `°baryabol` (prefix) nag-angkla sa itaas ng loop — ang resulta ay nababasa pagkatapos ng `@`.
> `baryabol°` (suffix) nag-angkla sa loob ng loop — namamatay kapag natapos ang loop.

Ang pahayag na pangalan lamang ay nagbabasa ng baryabol at itinatapon ang halaga, kaya nagbababala:

```zymbol
bilang = 5
bilang
```

Ang compiler ay nagbababala tulad nito (ang mga mensahe nito ay laging Ingles):

```text
warning: this statement does nothing: 'bilang' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

Ibig sabihin: *«ang pahayag na ito ay walang ginagawa: 'bilang' ay binasa at itinapon»*.

---

## Mga Uri ng Data

| Uri | Literal | `#?` Tag | Mga Tala |
|------|---------|----------|----------|
| Integer | `42`, `-7` | `###` | Ligtas na integer: ±(2⁵³ − 1) |
| Float | `3.14`, `1.5e10` | `##.` | IEEE-754 double |
| String | `"teksto"` | `##"` | Interpolasyon: `"Kumusta {pangalan}"` |
| Char | `'A'` | `##'` | Isang Unicode code point |
| Boolean | `#1`, `#0` | `##?` | HINDI numeric — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Isang uri, sinuri |
| Idineklarang halo | `#[1, "dalawa"]` | `##[` | Kapareho ng uri ng `[…]`, hindi sinuri |
| Tuple | `(a, b)` | `##)` | Posisyonal, hindi nababago |
| Diksiyonaryo | `#(x: 1, y: 2)` | `##(` | May susi, nababago |
| Function | pinangalanang function reference | `##()` | First-class; nagpapakita `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | First-class; nagpapakita `<lambd/N>` |
| Unit | `##_` | `##_` | Kawalan — walang null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(x: 1)#? ¶          // → (##(, 1, #(x: 1))
```

Ang integer na lumalabas sa ligtas na saklaw ay nahuhuling error, hindi kailanman tahimik na pag-ikot:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "labas ng saklaw" ¶ // → labas ng saklaw
}
```

`##_` ay kung paano nagtatanong ang programa kung may nawawala:

```zymbol
wala() { }
halaga = wala()
>> (halaga == ##_) ¶     // → #1
```

---

## Output at Input

```zymbol
pangalan = "Maria"
kabuuan = 3
>> "Kumusta" ¶             // → Kumusta
>> "a=" pangalan " b=" kabuuan ¶ // → a=Maria b=3
>> kabuuan#? ¶            // → (###, 1, 3)
```

```zymbol
<< pangalan
<< "Ilagay ang iyong pangalan: " pangalan
<< ###(4) "Edad: " edad
```

**Tingnan ang hugis ng dalawang marka.** `>>` nakaturo palabas: inilalabas ang data mula sa programa. `<<` nakaturo papasok: ipinapasok ang data sa programa. Walang dapat tandaan dito — ang arrow ay nagpapakita kung saan naglalakbay ang impormasyon, at ang parehong ideya ay bumabalik sa bawat marka na naglilipat ng isang bagay.

> `¶` at `\\` ay katumbas na bagong linya. `>>` ay hindi kailanman nagdaragdag ng isa.
> Ang type specifier bago ang prompt ay nagpapatunay habang nagbabasa at muling nagtatanong hanggang ang halaga ay wasto:
> `##.` Float · `##.(T,D)` decimal · `###(N)` Integer · `##"(N)"` teksto · `##'` isang Char.

Sa pinakamataas na antas ng file, `<~` ay ang exit status ng programa:

```zymbol
>> "nagsusuri" ¶      // → nagsusuri
<~ 0
```

---

## Mga TUI Primitive

Mga operator ng terminal UI para sa mga interaktibong programa. Karamihan ay nangangailangan ng `>>| { }` na bloke (alternate screen + raw mode).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Tumatakbo"
    @~ 1000
    >>~ (2, 1) > "Tapos na."
}
```

```zymbol
>>| {
    [mga_linya, mga_kolumna] = >>?
    >>~ (1, 1) > "Terminal: " mga_linya " x " mga_kolumna
    <<| key
    >>~ (2, 1) > "Pinindot: " key
}
```

Dito makikita mo kung bakit ang mga marka ay nagsasama sa halip na dumami. Alam mo na na ang `<<` ay input at ang `?` ay nagtatanong nang walang pangako. Isang marka lamang ang bago:

- `|` ay **isang yunit**, hindi ang buong stream.

Sa gayon, ang dalawang keyboard operator ay nagbabasa ng kanilang sarili:

```text
<<        |             ?
input     isang yunit   walang pangako

<<|   kumuha ng ISANG key, at maghintay hanggang may isa
<<|?  tingnan kung MAY key, at magpatuloy kung wala
```

Pareho sa kabilang panig: `>>` nagpapadala, `>>!` nagpapadala **nang may lakas** (nililinis ang buong screen), habang ang `>>?` ay **nagtatanong** sa halip na magsulat (gaano kalaki ang terminal). Ang marka sa kanan ay ang nagbabago ng mode, at ito ay laging huli.

> `>>!` nililinis ang screen. `>>?` nagbabalik ng `[mga_linya, mga_kolumna]`. `@~ N` natutulog ng N millisecond.
> `<<|` nagbabasa ng isang keypress (blocking); `<<|?` nag-poll nang hindi blocking (`'\0'` kung wala).
> Ang mga arrow key ay dumarating na decoded bilang `'↑' '↓' '←' '→'`; ang ESC ay code point 27.
> Positioned output tuple: `(linya, kolumna, BKS, harap, likod)` — anumang slot ay maaaring laktawan ng kuwit (`>>~ (,,, 196) > "pula"`).
> BKS bitmask: `1`=Bold, `2`=Italic, `4`=Underline. ANSI 256-color palette (`0`=terminal default).

---

## Mga Operator

```zymbol
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (integer division)
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

> `==` ay hindi kailanman nagpipilit: `"5" == 5` ay `#0`. Ang pag-uuri ay nagpipilit: `"5" > 4` ay `#1`, at gayon din ang `"४२" > 5` — numeric text sa alinman sa 69 na script ay naghahambing bilang numero.
> Ang isang function ay katumbas lamang ng sarili nito, hindi kailanman katumbas ng isa pang function na may parehong katawan.

---

## Mga String

```zymbol
pangalan = "Maria"
n = 42
>> "Kumusta " pangalan " mayroon kang " n ¶ // → Kumusta Maria mayroon kang 42
paglalarawan = "Kumusta {pangalan}, mayroon kang {n}"
>> paglalarawan ¶              // → Kumusta Maria, mayroon kang 42
```

```zymbol
s = "Kumusta mundo"
haba = s$#                  // 13
sub = s$[1..7]             // "Kumusta"
mayroon = s$? "mundo"          // #1
mga_bahagi = "a,b,c,d"$/ ','    // [a, b, c, d]
palitan = s$~~["u":"o"]        // "Komosta mondo"
linya = "─" $* 20
```

> `+` ay para sa mga numero lamang. Para sa mga string, gumamit ng juxtaposition o interpolasyon.
> `\{` at `\}` ay literal na braces — ang escape ay simetriko.

---

## Daloy ng Kontrol

```zymbol
x = 7
? x > 100 {
    >> "malaki" ¶
} _? x > 0 {
    >> "positibo" ¶     // → positibo
} _ {
    >> "negatibo" ¶
}
```

Narito ang dalawang bagong marka, at ang pangatlo ay nagmumula sa pagsasama ng mga ito:

- `?` ay **magtanong**: nagbubukas ng kondisyon.
- `_` ay **ang hindi tinukoy**: ang sangay na natitira kapag walang tanong na tumugma.
- `_?` ay pareho nang sunud-sunod: *kung walang tumugma, magtanong muli*.

Ito ang dahilan kung bakit ang `_?` ay isinulat nang ganoon. Hindi ito isang bagong simbolo na dapat matutunan — ito ay `_` na sinusundan ng `?`, at nangangahulugan ito ng eksaktong ibig sabihin ng dalawang bahagi nito, na binasa sa pagkakasunod-sunod.

> Ang mga brace `{ }` ay **kinakailangan** kahit para sa isang pahayag.

---

## Pagtutugma

```zymbol
puntos = 85
grado = ?? puntos {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> grado ¶              // → B
```

```zymbol
temperatura = -5
estado = ?? temperatura {
    < 0  => "yelo"
    < 20 => "malamig"
    _    => "mainit"
}
>> estado ¶              // → yelo
```

Alam mo na na ang `?` ay "magtanong". **`??` ay magtanong nang maraming beses**: pagdodoble ng isang marka, saanman sa wika, ay paggawa ng maraming beses kung ano ang ginagawa ng marka nang isang beses. Isang `?` ang sumusubok ng isang kondisyon; ang `??` ay sumusubok laban sa isang listahan ng mga kaso.

Ang mga alternatibo ay sumasama sa `||`, at maaari silang maghalo ng mga uri ng pattern:

```zymbol
key = 'P'
aksyon = ?? key {
    'p' || 'P' => "i-pause"
    < 0 || > 100 => "labas ng saklaw"
    _ => "binabalewala"
}
>> aksyon ¶             // → i-pause
```

---

## Mga Loop

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
mga_prutas = ["mansanas", "peras", "ubas"]
@ p:mga_prutas { >> p " " }
>> ¶                    // → mansanas peras ubas
@ l:"Kumusta" { >> l "-" }
>> ¶                    // → K-u-m-u-s-t-a-
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
bilang = 0
@:labas {
    bilang++
    ? bilang >= 3 { @:labas! }
}
>> bilang ¶             // → 3
```

`@` ay ang marka ng **panahon**: lahat ng umuulit ay nabubuhay dito. Upang putulin ang panahong iyon, magdagdag ka ng marka sa tabi nito:

- `@!` — `!` ay **lakas**: umalis sa loop ngayon.
- `@>` — `>` nagtutulak pasulong: lumipat sa susunod na pag-ikot.
- `@:labas!` — `:` ay **nagbigkis ng pangalan**, kaya pinutol nito ang loop na *pinangalanang* labas, hindi ang pinakamalapit.

Tatlong operator, at wala sa kanila ang kailangang isaulo nang hiwalay: sila ay `@` kasama ang isang marka na nagsasabi na kung ano ang ginagawa nito.

> **Ang isang specifier ay isang bilang o isang kondisyon.** Ang isang `Integer` ay isang bilang, nasuri nang isang beses — ang `@ 0` ay nagpapatakbo ng katawan ng zero beses. Anumang iba pa ay isang kondisyon. Walang katotohanan: `@ []` at `@ 3.5` ay tinatanggihan. Upang maglakad sa isang koleksiyon, gamitin ang `@ x:mga_item`; upang bilangin ito, `@ mga_item$#`.

---

## Mga Function

```zymbol
dagdag(a, b) { <~ a + b }
>> dagdag(3, 4) ¶        // → 7
```

```zymbol
factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶       // → 120
```

Ang isang function ay nagbabasa ng mga baryabol ng file sa pamamagitan ng halaga, at ang pagsusulat sa loob ay nananatili sa loob:

```zymbol
limitasyon = 100
loob(n) { <~ n < limitasyon }
>> loob(42) ¶         // → #1
```

Dalawang marka ang nagbabago nito, at pareho silang nakasulat **sa signature at sa call site**:

```zymbol
dagdagan(bilang<~) { bilang = bilang + 1 }
kabuuan = 0
dagdagan(kabuuan<~)
>> kabuuan ¶              // → 1
```

> `p~` ay isang gumaganang kopya — ang katawan ay maaaring muling magtalaga nito at ang tumatawag ay hindi apektado.
> `p<~` ay isang output parameter — ang pagbabago ay bumabalik. Ang `dagdagan(kabuuan)` na walang marka ay isang semantikong error: ang anotasyon at ang signature ay hindi maaaring maghiwalay.

---

## Mga Lambda at Closure

```zymbol
doble = x -> x * 2
kabuuan = (a, b) -> a + b
>> doble(5) ¶          // → 10
>> kabuuan(3, 7) ¶          // → 10
```

```zymbol
uriin = x -> {
    ? x > 0 { <~ "positibo" }
    _? x < 0 { <~ "negatibo" }
    <~ "sero"
}
>> uriin(-4) ¶         // → negatibo
```

```zymbol
factor = 3
triple = x -> x * factor
>> triple(7) ¶          // → 21
```

```zymbol
gumawa_ng_pandagdag(n) { <~ x -> x + n }
dagdag10 = gumawa_ng_pandagdag(10)
>> dagdag10(5) ¶           // → 15
```

Ang lambda ay maaaring walang parameter:

```zymbol
sagot = () -> 42
>> sagot() ¶           // → 42
```

> Ang lambda ay kumukuha ng mga baryabol ng file **kapag nilikha**; ang pinangalanang function ay nagbabasa ng mga ito **kapag tinawag**.

---

## Mga Array

```zymbol
array = [1, 2, 3, 4, 5]
>> array[1] ¶       // → 1   ang index ay 1-base
>> array[-1] ¶      // → 5   negatibo ay nagbibilang mula sa dulo
>> array$# ¶        // → 5   haba
```

```zymbol
array = [1, 2, 3]
>> (array$+ 6) ¶          // → [1, 2, 3, 6]   idagdag
>> (array$+[2] 99) ¶      // → [1, 99, 2, 3]  ipasok sa posisyon 2
>> (array$- 3) ¶          // → [1, 2]         alisin ang unang pangyayari
>> (array$-[1]) ¶         // → [2, 3]         alisin sa index 1
>> (array$[1..2]) ¶       // → [1, 2]         slice, kasama ang magkabilang dulo
>> (array$? 3) ¶          // → #1             naglalaman
```

Lahat sila ay nagsisimula sa `$`, ang marka ng **koleksiyon**, at nagpapatuloy sa isang marka na nagsasabi kung ano ang ginagawa dito: `#` ilan, `+` idagdag, `-` alisin, `?` itanong kung mayroon. At tulad ng `??`, ang pagdodoble ng marka ay nangangahulugan ng paggawa nito nang lubusan: ang `$?` ay nagtatanong *kung* may halaga, ang `$??` ay nagtatanong *sa ilang lugar* at ibinabalik ang lahat.

```zymbol
array = [3, 1, 2]
>> (array$^+) ¶     // → [1, 2, 3]   pataas
>> (array$^-) ¶     // → [3, 2, 1]   pababa
```

**Ang tuntunin ng resulta.** Isang operator, at kung ano ang ginagawa ng nakapaligid na code dito ang magpapasya: kung ginamit, ito ay **nagtatayo** at iniiwan ang orihinal; kung itinapon, ito ay **nagbabago**.

```zymbol
array = [1, 2, 3]
kopya = array[2]$~ 99
>> array ¶                // → [1, 2, 3]
>> kopya ¶              // → [1, 99, 3]
array[2]$~ 99
>> array ¶                // → [1, 99, 3]
```

> **Ang `=` ay hindi kailanman nagsusulat sa isang koleksiyon.** Ang `array[2] = 99` ay hindi isang anyo ng Zymbol — ang `=` ay nagbibigay ng halaga sa isang **PANGALAN**. Ang pagbabago ng bahagi ng isang koleksiyon ay `$~`, sa bawat koleksiyon.

`[…]` ay may isang uri at sinuri; ang sinadyang halo ay **idineklara** gamit ang `#[…]`:

```zymbol
halo = #[1, "dalawa", #1]
>> halo ¶             // → [1, dalawa, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Multi-dimensional na Indexing

`>` ay bumababa sa isang nested na istraktura. Isang pangkat ng bracket ang nagtutukoy sa isang elemento, gaano man kalalim.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   hilera 2, kolumna 3
>> m[-1>-1] ¶      // → 9   huling hilera, huling kolumna
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          patag: ang dayagonal
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   istrukturado: ang mga sulok
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> Ang `m[1][2]` ay **hindi** isang anyo ng Zymbol. Ang chained index ay tinatanggihan para sa pagbabasa at pagsusulat — isang pangkat ng bracket bawat pag-access, at `>` ang nasa pagitan ng mga hakbang.

---

## Mga Diksiyonaryo

Ang tuple na may mga pinangalanang field ay isang diksiyonaryo, at mula noong v0.0.9 ito ay isinulat na `#(…)`.

```zymbol
tao = #(pangalan: "Maria", edad: 25)
>> tao.pangalan ¶        // → Maria
>> tao["edad"] ¶    // → 25
```

```zymbol
tao = #(pangalan: "Maria", edad: 25)
field = "pangalan"
>> tao[field] ¶     // → Maria
```

Ito ay nababago, ang mga susi ay maaaring idagdag, at maaari itong lakarin:

```zymbol
imbak = #(peras: 4)
imbak["mansanas"]$~ 10
@ k:imbak { >> k "=" imbak[k] " " }
>> ¶                    // → peras=4 mansanas=10
```

```zymbol
imbak = #(peras: 4, mansanas: 10)
@ (k, v):imbak { >> k ":" v " " }
>> ¶                    // → peras:4 mansanas:10
```

> Ang `#()` ay ang walang laman na diksiyonaryo, na hindi maaaring maging `()` — kailangan din itong maging walang laman na tuple. Ang hubad na `(x: 1)` ay tinatanggihan kasama ang mensaheng ito: *a dictionary is written `#(…)`* — «isang diksiyonaryo ay isinusulat na `#(…)`».
> Ang isang diksiyonaryo ay tinutukoy sa pamamagitan ng susi, hindi kailanman sa pamamagitan ng posisyon, kaya ang `tao[1]` ay isang error.

---

## Mga Tuple

Ang mga tuple ay **hindi nababago** na nakaayos na lalagyan na may hawak na mga halaga ng iba't ibang uri.

```zymbol
punto = (10, 20)
>> punto[1] ¶           // → 10
data = (42, "Kumusta", #1, 3.14)
>> data[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Anumang pagtatangkang baguhin ang isang tuple sa lugar nito ay isang error, anuman ang operator — ang kawalan ng pagbabago ay isang pag-aari ng halaga, hindi isang eksepsiyon sa loob ng bawat `$`.

---

## Destructuring

```zymbol
array = [10, 20, 30, 40, 50]
[a, b, c] = array
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
array = [10, 20, 30, 40, 50]
[una, *natitira] = array
>> una ¶            // → 10
>> natitira ¶              // → [20, 30, 40, 50]
```

```zymbol
punto = (100, 200)
(px, py) = punto
>> px " " py ¶          // → 100 200
```

```zymbol
tao = #(pangalan: "Ana", edad: 25)
#(pangalan: n, edad: e) = tao
>> n " " e ¶            // → Ana 25
```

> Ang hugis ng bracket ay may uri: ang `[…]` ay tumatanggap ng array, ang `(…)` ng tuple, ang `#(…)` ng diksiyonaryo. Ang huling pangalan ay **sumisipsip ng natitira**, kaya ang destructuring ay hindi kailanman nabibigo sa haba — ang `(a, b, c) = (1,2,3,4,5)` ay nagbibigay ng `c = (3,4,5)`, at `##_` kapag wala nang natitira.

---

## Mga Higher-Order Function

```zymbol
mga_numero = [1, 2, 3, 4, 5]
>> (mga_numero$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (mga_numero$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (mga_numero$< (0, (akum, x) -> akum + x)) ¶ // → 15
```

```zymbol
mga_numero = [1, 2, 3, 4, 5, 6]
doble(x) { <~ x * 2 }
malaki(x) { <~ x > 3 }
>> (mga_numero$> doble) ¶    // → [2, 4, 6, 8, 10, 12]
>> (mga_numero$| malaki) ¶    // → [4, 5, 6]
```

```zymbol
base = [#(pangalan: "Carla", edad: 28), #(pangalan: "Ana", edad: 25)]
ayon_sa_edad = base$^ (a, b -> a.edad < b.edad)
>> ayon_sa_edad[1].pangalan ¶     // → Ana
```

> Ang isang pinangalanang function ay pumupunta sa HOF **nang walang panaklong**: `mga_numero$> doble`. Ang pagsusulat ng `mga_numero$> (doble)` ay isang parse error, dahil ang `(` ay nagbubukas ng isang lambda.

---

## Pipe Operator

```zymbol
doble = x -> x * 2
dagdag = (a, b) -> a + b
inc = x -> x + 1
>> (5 |> doble(_)) ¶    // → 10
>> (10 |> dagdag(_, 5)) ¶  // → 15
>> (5 |> doble(_) |> inc(_)) ¶ // → 11
```

---

## Paghawak ng Error

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dibisyon sa zero" ¶  // → dibisyon sa zero
} :! {
    >> "iba pa: " _err ¶
} :> {
    >> "laging tumatakbo" ¶        // → laging tumatakbo
}
```

| Uri | Kailan |
|------|--------|
| `##Div` | Dibisyon sa zero |
| `##Index` | Index sa labas ng hangganan |
| `##Key` | Susi na wala sa diksiyonaryo |
| `##Range` | Sa labas ng ligtas na saklaw ng integer |
| `##Type` | Hindi tugma ang uri |
| `##Parse` | Pag-parse ng data |
| `##IO` | File / system |
| `##Network` | Mga error sa network |
| `##DB` | Database |
| `##Time` | Isang petsa na hindi umiiral |
| `##_` | Anumang error (catch-all) |

Ang `!` ay ang marka ng **error at lakas**, at binabasa ito nang pareho sa dalawang pamilya: ang `$!` ay nagtatanong sa isang halaga kung ito ay isang error; ang `$!!`, na may dobleng marka, ay nagpapadala nito pataas nang hindi nagtatanong.

> Ang mga pagkabigo ng standard library ay bumabalik bilang **malambot na error values** na sinusuri mo gamit ang `$!` o hinuhuli gamit ang `!?`, sa halip na mag-abort. Ang `$!!` ay nagpapadala ng isa sa tumatawag.

---

## Mga Module

```zymbol
# calc {
    #> { dagdag, PI }

    PI := 3.14159
    dagdag(a, b) { <~ a + b }
}
```

```zymbol
<# ./calc => c

>> c::dagdag(5, 3) ¶
>> c.PI ¶
```

```zymbol
# aking_lib {
    #> { panloob_na_dagdag => kabuuan }

    panloob_na_dagdag(a, b) { <~ a + b }
}
```

Ang dalawang marka ng module ay ang parehong ideya, ngayon ay inilalapat sa mga file: ang `#` ay ang antas ng **deklarasyon** — kung ano ang isang bagay, hindi ang halaga nito — at ang arrow ay nagsasabi kung aling direksiyon naglalakbay ang code:

```text
<#   ang arrow ay pumapasok: mag-import, kumuha mula sa ibang file
#>   ang arrow ay lumalabas: mag-export, mag-alok sa ibang mga file
```

Ang marka ng direksiyon ay laging nakaupo sa gilid na nakaharap sa direksiyon na itinuturo nito. Ito ang parehong dahilan kung bakit ang `<~` ay bumalik sa kaliwa (labas ng function) at ang `->` ay pumasok sa kanan (sa katawan ng lambda).

> **Ang isang module ay nagdedeklara ng iniluluwas nito.** Ang `#>` block ay kinakailangan — ang pag-alis nito ay **E014**, at ang `#> { }` ay kung paano sinasabi ng isang module na ang ibabaw nito ay walang laman. Ang `::` ay tumatawag ng function, ang `.` ay nagbabasa ng konstante. Tanging mga import, ang export block, literal na initializer at mga kahulugan ng function ang maaaring lumitaw sa katawan ng module; anumang maipapatupad ay **E013**.

---

## Standard Library

Mga native na module, na-import tulad ng iba pa:

| Module | Mga Function |
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

>> t::width("手番") ¶            // → 4   dalawang glyph, apat na kolumna
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

araw = T::of(2026, 1, 31)
>> T::format(araw, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(araw, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> Ang `std/term` ay sumusukat ng **mga kolumna ng display**, hindi mga character: ang CJK at karamihan ng emoji ay 2 kolumna, kaya mag-layout ng talahanayan gamit ang `t::width`, hindi kailanman `$#`.
> Sa `std/time` ang isang instant ay millisecond mula sa epoch. Mas mababa sa isang araw ay tagal, mula sa isang araw pataas ay kalendaryo — kaya ang isang buwan ay bumagsak sa parehong araw ng buwan, na-clamp. Ang `diff(a, b)` ay `a - b`, kaya ang mas maagang instant na una ay nagbibigay ng negatibong sagot.

---

## Mga Package

Ang isang `.zyp` ay nagbubuklod ng multi-file na programa sa isang portable na file. Ito ay isang archive ng **source**, hindi binary, kaya tumatakbo ito saanman tumatakbo ang isang `zymbol` binary.

```bash
zymbol package aking_proyekto/ --script main.zy -o aking_proyekto.zyp
zymbol run aking_proyekto.zyp
```

> Ang archive ay may dalang manifest (`zyp.toml`) na nagdedeklara ng mga entry script nito at ang bersyon ng engine na kailangan nito. Ang `zymbol run` ay nag-extract nito sa isang temporaryong direktoryo at tumatakbo mula doon, kaya ang code ay disposable habang ang isinusulat ng script ay bumabagsak sa iyong tunay na working directory. Ang playground ay naglo-load din ng mga `.zyp` na file.

---

## Mga Numeral Mode

Ang Zymbol ay maaaring magsulat ng mga numero sa **69 Unicode digit scripts** — Devanagari, Arabic-Indic, Thai, Klingon pIqaD, Mathematical Bold, LCD segments, at higit pa. Ang mode ay global sa proseso at nakakaapekto sa output; ang aritmetika ay hindi nagbabago.

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabic-Indic (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // i-reset sa ASCII
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

Ang mga digit ng anumang sinusuportahang script ay wastong literal sa source:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Ang pagbabasa ay simetriko — ang isang digit ay nauunawaan sa anumang script:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> Ang `#` ay laging ASCII, kaya ang `#0` ay nananatiling biswal na naiiba mula sa digit na zero sa bawat script.
> Ang `#,` at `#^` ay nagsusulat din ng kanilang mga digit sa aktibong script, at ang mga separator ay sumusunod dito — ngunit ang pares ay hindi kailanman bumabaligtad: ang `,` ay nagpangkat at ang `.` ay naghahati, sa bawat script.

---

## Mga Operator ng Data

```zymbol
f = ##.42         // sa Float
i = ###3.7        // sa Integer, ni-round  → 4
t = ##!3.7        // sa Integer, ni-truncate  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Ang isang Float ay nagpi-print bilang mga digit, hindi kailanman bilang exponent, at inaalis ang trailing na `.0` — ang `##.42` ay nagsusulat ng `42` at isa pa ring Float, tulad ng ipinapakita ng `f#?`.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   fail-safe: ibinabalik ang input nang hindi nagbabago
>> ##!'A' ¶        // → 65    code point ng isang Char
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          i-round sa 2 decimal
>> #!2|pi| ¶       // → 3.14          i-truncate sa 2 decimal
>> #,|1234567| ¶   // → 1,234,567     thousands separator
>> #^|12345.678| ¶ // → 1.2345678e4   scientific notation
```

```zymbol
>> 0x41 ¶        // → A   hex
>> 0b01000001 ¶  // → A   binary
>> 0o101 ¶       // → A   octal
>> 0d65 ¶        // → A   decimal
```

> Ang base literal sa ASCII range ay isang **character**: `0d65 == 'A'` ay `#1`, at `0d65 == 65` ay `#0`. Lahat ng apat na base ay nagbaybay ng parehong character.

---

## Integrasyon sa Shell

```zymbol
ngayon = <\ date +%Y-%m-%d \>
>> "Ngayon: " ngayon
```

```zymbol
output = </"./subscript.zy"/>
>> output
```

> Ang `<\ … \>` ay kumukuha ng stdout at stderr, na inaalis ang trailing na newline.
> Ang `>< args` ay kumukuha ng mga argumento ng command-line bilang isang string array.

---

## Kumpletong Halimbawa: FizzBuzz

```zymbol
uriin(numero) {
    ? numero % 15 == 0 { <~ "FizzBuzz" }
    _? numero % 3  == 0 { <~ "Fizz" }
    _? numero % 5  == 0 { <~ "Buzz" }
    <~ numero
}

@ i:1..20 { >> uriin(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (isa bawat linya)
```

---

## Paano Nagsasama ang mga Marka

Nakita mo ang parehong bagay sa buong manwal na ito: **ang isang operator ay hindi isang guhit na dapat isaulo, ito ay ilang mga marka sa isang hilera, at ang bawat isa ay nag-aambag ng kahulugan nito.** Ngayon na alam mo na ang lahat ng ito, narito ang buong pattern.

Una ay **kung saan tayo naroroon**:

| Marka | Mundo | Nakita mo ito sa |
|-------|-------|------------------|
| `$` | isang koleksiyon | `$#` `$+` `$?` `$^-` |
| `@` | oras, anumang umuulit | `@!` `@>` `@~` |
| `#` | kung ano ang isang bagay, hindi ang halaga nito | `#?` `#(…)` `<#` `#>` |
| `>>` | palabas ng programa | `>>` `>>!` `>>?` |
| `<<` | papasok sa programa | `<<` `<<\|` `<<\|?` |
| `?` | magtanong, nang walang pangako | `?` `_?` `??` `$?` |
| `!` | lakas, o error | `@!` `$!` `!?` |

Pagkatapos ay **kung ano ang ginagawa doon**: `+` idagdag, `-` alisin, `^` ayusin, `~` baguhin, `#` bilangin, `|` isang yunit, `:` itali ang pangalan.

At dalawang tuntunin na hindi kailanman nabibigo:

**Ang pagdodoble ng isang marka ay ginagawa itong lubusan.** Ang `?` ay nagtatanong nang isang beses, ang `??` ay sumusubok ng maraming kaso. Ang `$?` ay nagtatanong kung may halaga, ang `$??` ay ibinabalik ang bawat lugar kung saan ito naroroon. Ang `!` ay nagmamarka ng error, ang `!!` ay nagpapadala nito nang hindi nagtatanong.

**Ang mode marka ay laging huli.** Kapag ang `?` o `!` ay lumitaw upang sabihin *kung paano* ginagawa ang isang bagay — nag-aatubili o mapilit — sila ang huling marka ng operator: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:labas!`. Walang operasyon pagkatapos nila.

Isang praktikal na bagay ang lumalabas mula doon: **isang kombinasyon na hindi mo pa nakita ay may katuturan na bago mo pa ito tingnan.** Kung ang `$` ay koleksiyon at ang `^` ay pagkakasunod-sunod at ang `-` ay baligtad, kung gayon ang `$^-` ay nag-uuri pababa, at walang kailangang magsabi sa iyo.

Hindi lahat ng imbentaryo ay gumagana nang ganoon, at ang pagsasabi nito ay mas mabuti kaysa magpanggap. Karamihan sa mga operator ay naghihiwalay nang malinis. Anim ang naghihiwalay ngunit higit pa sa mga bahagi nito ang ibig sabihin: `!?` `:!` `:>` `|>` `::` `$++`. At sampu ang kailangang isaulo dahil hindi sila naghihiwalay: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Ang pagbilang ng mga opaque sa halip na ipalagay na kakaunti sila ay sinasadya: sila ang tunay na halaga ng pagsasaulo ng wika. Ang buong sanggunian — ang imbentaryo, ang mga idineklarang homograph, at ang mga tuntunin na dapat matugunan ng isang bagong operator upang umiral — ay ang `SYMBOLS.md`, sa repository ng interpreter.

---

## Sanggunian ng Simbolo

| Simbolo | Operasyon | Simbolo | Operasyon |
|--------|-----------|--------|-----------|
| `=` | baryabol | `$#` | haba |
| `:=` | konstante | `$+` | idagdag |
| `>>` | output | `$+[i]` | ipasok sa index (1-base) |
| `<<` | input | `$-` | alisin ang una sa pamamagitan ng halaga |
| `¶` / `\\` | bagong linya | `$--` | alisin ang lahat sa pamamagitan ng halaga |
| `?` | kung | `$-[i]` | alisin sa index (1-base) |
| `_?` | kung hindi | `$-[i..j]` | alisin ang saklaw (1-base) |
| `_` | kung hindi / wildcard | `$?` | naglalaman |
| `??` | pagtutugma | `$??` | hanapin ang lahat ng index (1-base) |
| `\|\|` | o-pattern sa match arm | `$[s..e]` | slice (1-base) |
| `@` | loop | `$>` | mapa |
| `@ N { }` | loop N beses | `$\|` | filter |
| `@!` | putulin | `$<` | bawasan |
| `@>` | magpatuloy | `$/ delimiter` | hatiin ang string |
| `@:pangalan { }` | may label na loop | `$++ a b c` | bumuo sa pamamagitan ng concat |
| `@:pangalan!` | putulin ang label | `$~~[p:r]` | palitan ang string |
| `@:pangalan>` | magpatuloy sa label | `$*` | ulitin ang string |
| `->` | lambda | `arr[i]$~ v` | ANG nag-iisang update form |
| `<~` | return / output param | `~` | working-copy param |
| `arr[i>j]` | navigation index | `arr[p ; q]` | flat extraction |
| `$^+` | ayusin pataas | `$^-` | ayusin pababa |
| `$^` | ayusin gamit ang comparator | `\|>` | pipe |
| `!?` | subukan | `:!` | huwag |
| `:>` | sa wakas | `$!` | error ba |
| `$!!` | ipadala ang error | `#1` / `#0` | totoo / hindi totoo |
| `##_` | Unit — kawalan | `[…]` | array, isang uri |
| `#[…]` | array, idineklarang halo | `#(…)` | diksiyonaryo |
| `(…)` | posisyonal na tuple | `#()` | walang laman na diksiyonaryo |
| `<#` | mag-import | `#>` | mag-export |
| `#` | magdeklara ng module | `::` | tumawag ng module |
| `.` | field / constant access | `#?` | type metadata |
| `#\|..\|` | i-parse ang numero | `##.` | i-cast sa Float |
| `###` | i-cast sa Integer (round) | `##!` | i-cast sa Integer (truncate) |
| `#.N\|..\|` | i-round | `#!N\|..\|` | i-truncate |
| `#,\|..\|` | thousands separator | `#^\|..\|` | scientific |
| `#d0d9#` | numeral mode switch | `#09#` | i-reset sa ASCII |
| `<\ ..\>` | shell exec | `><` | CLI args |
| `\ var` | sirain ang baryabol | `°x` / `x°` | hot definition |
| `>>\|` | TUI block (alt screen) | `>>~` | positioned output |
| `>>!` | i-clear ang screen | `>>?` | i-query ang terminal size |
| `<<\|` | blocking keypress | `<<\|?` | non-blocking keypress |
| `@~ N` | matulog ng N milliseconds | `0d` `0x` `0o` `0b` | base literals |

---

## Talaan ng mga Pagbabago sa Release

### v0.0.9 — Nagpasya ang mga Koleksiyon _(Setyembre 2026)_

- **Breaking** Ang diksiyonaryo ay may sariling notasyon: `#(susi: halaga)`. Ang hubad na `(x: 1)` ay tinatanggihan, at ang `#()` ay ang walang laman na diksiyonaryo — na hindi kailanman maaaring maging `()`
- **Breaking** Ang indexed assignment ay binawi: `arr[i] = v` at lahat ng compound form. Ang `=` ay nagbibigay ng halaga sa isang **PANGALAN**; ang pagbabago ng bahagi ng isang koleksiyon ay `$~`
- **Breaking** Ang chained index `m[i][j]` ay tinatanggihan para sa pagbabasa at pagsusulat — `>` ang nasa pagitan ng mga hakbang
- **Breaking** Ang isang module ay dapat magdeklara ng iniluluwas nito (**E014**); ang `#> { }` ay kung paano sinasabi ng isang module na walang laman ang ibabaw nito
- **Breaking** Ang isang loop specifier ay isang bilang o isang kondisyon — walang katotohanan. Ang `@ []` at `@ 3.5` ay tinatanggihan
- **Idinagdag** `##_` — ang Unit literal, at kung paano nagtatanong ang programa kung may nawawala
- **Idinagdag** `#[…]` — isang array na ang halo ng mga uri ng elemento ay idineklara
- **Idinagdag** `#?` ay nagkikita sa apat na koleksiyon: `##]` `##[` `##)` `##(`
- **Idinagdag** `std/time` — ang orasan at ang kalendaryong sibil, na may mga timezone at aritmetika ng kalendaryo
- **Idinagdag** Ang isang top-level na `<~` ay ang exit status ng programa
- **Idinagdag** `@ (k, v):mga_pares` — isang pattern sa loop head
- **Idinagdag** Ang `#|c|` ay nagbabasa ng digit sa alinman sa 69 na script; ang `#,` at `#^` ay nagsusulat sa aktibo
- **Binago** Ang `Integer` ay isang ligtas na integer, ±(2⁵³ − 1), fail-closed sa bawat engine
- **Binago** Ang isang pinangalanang function ay nagbabasa ng mga baryabol ng file sa oras ng pagtawag, sa pamamagitan ng halaga
- **Binago** Ang isang pahayag na nagbabasa lamang ng pangalan ay nagbababala sa halip na tahimik na dumaan
- **Mga Engine** 660 sa 666 na file ng corpus ay sumasang-ayon sa lahat ng tatlong engine, 0 ang nagkakaiba

### v0.0.8 — Auto-Free, `std/term` at Mga Package _(Agosto 2026)_

- **Idinagdag** Awtomatikong pagkasira sa huling paggamit — hindi nakikita; binababa lamang ang peak memory
- **Idinagdag** `std/term` — mga sukatan ng display sa mga kolumna ng terminal
- **Idinagdag** `##!` sa isang `Char` — ang Unicode code point nito
- **Idinagdag** Match o-patterns: `'p' || 'P' => …`, mga alternatibo ng anumang uri sa isang arm
- **Idinagdag** Zymbol Packages (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Idinagdag** Ang `<~` sa call site ay kinakailangan saanman ang callee ay nagdedeklara ng output parameter
- **Naayos** Parity ng module-system sa register VM

### v0.0.7 — Native Standard Library _(Hulyo 2026)_

- **Idinagdag** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — lahat ay may malambot na error values
- **Idinagdag** Typed/validated input: `<< ##.(5,2) "presyo: " p`
- **Idinagdag** Postfix operators nang direkta sa `>>` — hindi kailangan ng panaklong
- **Binago** Fail-closed formatter: tumatanggi itong magsulat ng output na hindi nito maaaring basahin muli

### v0.0.6 — Pagpipino at Scientific Stdlib _(Hunyo 2026)_

- **Breaking** Ang `=>` ay pumapalit sa `:` sa match arms at `<=` sa import/export aliases
- **Idinagdag** `std/math` at `std/random`
- **Idinagdag** Pag-update ng diksiyonaryo sa pamamagitan ng susi: `d["k"]$~ halaga`

### v0.0.5 — TUI Primitive at Hot Definition _(Mayo 2026)_

- **Idinagdag** TUI block `>>| { }`, positioned output `>>~`, key input `<<|` at `<<|?`
- **Idinagdag** `>>!` i-clear ang screen, `>>?` terminal size, `@~ N` matulog
- **Idinagdag** Hot definition `°x` / `x°`, at string repeat `$*`

### v0.0.4 — 1-Based Indexing at First-Class Function _(Abril 2026)_

- **Breaking** Lahat ng indexing ay **1-based** — ang `arr[1]` ay ang unang elemento
- **Idinagdag** Mga pinangalanang function bilang first-class values; module block syntax `# pangalan { }`
- **Idinagdag** Multi-dimensional indexing `arr[i>j>k]` at flat extraction `arr[p ; q]`

### v0.0.3 — Unicode Numeral Systems _(Abril 2026)_

- **Idinagdag** 69 na Unicode digit blocks na may mode-switch token `#d0d9#`
- **Idinagdag** Boolean literals sa anumang script — `#१` / `#०`

### v0.0.2 — Redesign ng Collection API _(Marso 2026)_

- **Idinagdag** Ang `$` operator family para sa mga array at string
- **Idinagdag** Destructuring assignment, at mga negatibong index

### v0.0.1 — Unang Pampublikong Release _(Marso 2026)_

- Tree-walker interpreter + register VM (`--vm`)
- Lahat ng core constructs: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Buong Unicode identifiers, module system, lambda, closure, paghawak ng error
- REPL, LSP, VS Code extension, formatter (`zymbol fmt`)

---

_Zymbol-Lang — Simboliko. Pangkalahatan. Hindi Nababago._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Lisensya:** ang manwal na ito ay lisensiyado sa ilalim ng [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024-2026 Zymbol-Lang Team. Buong teksto: `LICENSE-CC-BY-SA-4.0` sa <https://github.com/zymbol-lang/web>. Ang interpreter at ang browser engine (`zymbol.js`) ay magkahiwalay na mga gawa, lisensiyado sa ilalim ng AGPL-3.0-only.
