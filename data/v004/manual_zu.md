> **Isaziso:** Lo mbhalo wenziwe ngosizo lobuhlakani bokwenziwa (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Inkomba esemthethweni iyi **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** endaweni yokugcina umhumushi.

---

# Incwadi YeZymbol-Lang

**IZymbol-Lang** wulimi lwezinhlelo olungokomfanekiso. Ayikho amagama angukhiye — konke kuwuphawu. Lusebenza ngendlela efanayo kunoma yiluphi ulimi lwabantu.

- Ayikho `if`, `while`, `return` — kuphela `?`, `@`, `<~`
- I-Unicode ephelele — izichongi kunoma yiluphi ulimi noma i-emoji
- Alincikile olimini lwabantu — ikhodi iyafana yonke indawo

**Uhlobo lomhumushi**: v0.0.4 | **Ukumboza ukuhlolwa**: 393/393 (ukulingana kwe-TW ↔ VM)

---

## Izinto eziguquguqukayo nezingaguquki

```zymbol
x = 10              // into eguquguqukayo
PI := 3.14159       // engaguquki — ukwabela kabusha kuyiphutha lesikhathi sokusebenza
igama = "Alice"
isebenzayo = #1      // IBoolean eyiqiniso
👋 := "Sawubona"
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

## Izinhlobo Zedatha

| Uhlobo | Okungokoqobo | Umaki `#?` | Amanothi |
|--------|--------------|------------|----------|
| Inombolo ephelele | `42`, `-7` | `###` | I-64-bit esayiniwe |
| Indawo entantayo | `3.14`, `1.5e10` | `##.` | Ukubhalwa kwesayensi kuvunyelwe |
| Uchungechunge | `"umbhalo"` | `##"` | Ukufakwa: `"Sawubona {igama}"` |
| Uhlamvu | `'A'` | `##'` | Uhlamvu olulodwa lwe-Unicode |
| IBoolean | `#1`, `#0` | `##?` | AKUYONA inombolo — `#1 ≠ 1` |
| Uhlu | `[1, 2, 3]` | `##]` | Izinto ezifanayo |
| Ithuple | `(a, b)` | `##)` | Ngokwesimo |
| Ithuple enegama | `(x: 1, y: 2)` | `##)` | Izinkambu ezinamagama |
| Umsebenzi | isikhombiso somsebenzi onegama | `##()` | Izinga lokuqala; ikhombisa `<funct/N>` |
| I-lambda | `x -> x * 2` | `##->` | Izinga lokuqala; ikhombisa `<lambd/N>` |

```zymbol
// Ukuhlola uhlobo — ibuya (uhlobo, amadijithi, inani)
imeta = 42#?
>> imeta ¶         // → (###, 2, 42)
t = imeta[1]
>> t ¶            // → ###
```

---

## Ukukhipha nokufaka

```zymbol
>> "Sawubona" ¶                       // ¶ noma \\ komugqa omusha osobala
>> "a=" a " b=" b ¶                  // ukubeka eceleni — amanani amaningi
>> (arr$#) ¶                         // abasebenzisi be-postfix badinga ( ) ngaphakathi >>

<< igama                           // funda kusimo esiguquguqukayo (ngaphandle kwesicelo)
<< "Faka igama lakho: " igama        // ngesicelo
```

> `¶` (i-AltGr+R kukhibhodi yaseSpain) ne `\\` ziyalingana emugqeni omusha.

---

## Abasebenzisi

```zymbol
// Izibalo — sebenzisa izabelo; abasebenzisi abathile banezici eziqondile ngaphakathi >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (ukwahlukanisa inombolo ephelele)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (ukuphakamisa amandla)

// Ukuqhathanisa
a == b    // #0    
a <> b    // #1    
a < b     // #0
a <= b    // #0   
a > b     // #1    
a >= b    // #1

// Okunengqondo
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Izintambo

```zymbol
// Izinhlobo ezimbili zokuhlanganisa
igama = "Alice"
n = 42

>> "Sawubona " igama " unayo " n ¶       // ukubeka eceleni — ngaphakathi >>
incazelo = "Sawubona {igama}, unayo {n}"   // ukufakwa — noma kuphi
```

```zymbol
s = "Sawubona Mhlaba"
ubude = s$#                  // 13
ingxenye = s$[1..6]          // "Sawubo"  (isisekelo-1, ukuphela kufakiwe)
ikhona = s$? "Mhlaba"        // #1
izingcezu = "a,b,c,d"$/ ','  // [a, b, c, d]  (hlukanisa ngesihlukanisi)
okushintshiwe = s$~~["a":"o"] // "Sowubono Mhlabo"
okushintshiwe1 = s$~~["a":"o":1] // "Sowubono Mhlaba" (ama-N okuqala kuphela)
```

> `+` ingeyezinombolo kuphela. Ezingcingweni, sebenzisa `,`, ukubeka eceleni, noma ukufakwa.

---

## Ukugeleza kokulawula

```zymbol
x = 7

? x > 0 { >> "okuhle" ¶ }

? x > 100 {
    >> "khulu" ¶
} _? x > 0 {
    >> "okuhle" ¶
} _? x == 0 {
    >> "uziro" ¶
} _ {
    >> "okubi" ¶
}
```

> Amabakaki `{ }` **ayisibopho** ngisho nesitatimende esisodwa.

---

## Ukufanisa

```zymbol
// Izingxenye
amaphuzu = 85
ibanga = ?? amaphuzu {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> ibanga ¶      // → B

// Izintambo
umbala = "bomvu"
ikhodi = ?? umbala {
    "bomvu"  : "#FF0000"
    "luhlaza" : "#00FF00"
    _        : "#000000"
}

// Amaphethini okuqhathanisa
izinga lokushisa = -5
isimo = ?? izinga lokushisa {
    < 0  : "iqhwa"
    < 20 : "kubanda"
    < 35 : "kufudumele"
    _    : "kushisa"
}
>> isimo ¶       // → iqhwa

// Uhlobo lwesitatimende (amabhulokhi)
?? n {
    0        : { >> "uziro" ¶ }
    _? n < 0 : { >> "okubi" ¶ }
    _        : { >> "okuhle" ¶ }
}
```

---

## Imijikelezo

```zymbol
@ i:0..4  { >> i " " }        // ububanzi obufakiwe:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // ngesinyathelo:      1 3 5 7 9
@ i:5..0:1 { >> i " " }       // emuva:             5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (ngenkathi)

izithelo = ["ihhabhula", "ipeya", "amagilebhisi"]
@ i:izithelo { >> i ¶ }       // kuyo yonke into ohlwini

@ u:"sawubona" { >> u "-" }
>> ¶                          // → s-a-w-u-b-o-n-a-  (kuhlamvu ngalunye ochungechungeni)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> qhubeka
    ? i > 7 { @! }            // @! phula
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Umjikelezo ongapheli
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Umjikelezo onelebula (ukuphula okufakwe ngaphakathi)
isibali = 0
@:ngaphandle {
    isibali++
    ? isibali >= 3 { @:ngaphandle! }
}
>> isibali ¶                  // → 3
```

---

## Imisebenzi

```zymbol
engeza(a, b) { <~ a + b }
>> engeza(3, 4) ¶   // → 7

i-factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * i-factorial(n - 1)
}
>> i-factorial(5) ¶    // → 120
```

Imisebenzi in **ububanzi obuhlukile** — ayikwazi ukufunda izinto eziguquguqukayo zangaphandle. Sebenzisa amapharamitha okukhipha `<~>` ukuguqula izinto eziguquguqukayo zofonayo:

```zymbol
shintshanisa(a<~, b<~) {
    okwesikhashana = a
    a = b
    b = okwesikhashana
}
x = 10
y = 20
shintshanisa(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Imisebenzi enegama **ingamanani ezinga lokuqala** — thumela ngokuqondile: `izinombolo$> kabili`. `x -> fn(x)` nayo isebenza.

---

## I-lambda nokuvalwa

```zymbol
kabili = x -> x * 2
engeza = (a, b) -> a + b
>> kabili(5) ¶   // → 10
>> engeza(3, 7) ¶ // → 10

// I-lambda yebhulokhi
hlukanisa = x -> {
    ? x > 0 { <~ "okuhle" }
    _? x < 0 { <~ "okubi" }
    <~ "uziro"
}

// Ukuvalwa — kubamba ububanzi bangaphandle
isici = 3
kathathu = x -> x * isici
>> kathathu(7) ¶   // → 21

// Ifekthri
yenza-isengezi(n) { <~ x -> x + n }
engeza-ishumi = yenza-isengezi(10)
>> engeza-ishumi(5) ¶   // → 15

// Ohlwini
imisebenzi = [x -> x+1, x -> x*2, x -> x*x]
>> imisebenzi[3](5) ¶   // → 25
```

---

## Uhlu

Uhlu **luyaguquguquka** futhi luqukethe izinto **zohlobo olufanayo**.

```zymbol
uhlu = [1, 2, 3, 4, 5]

uhlu[1]          // 1 — ukufinyelela (isisekelo-1: into yokuqala)
uhlu[-1]         // 5 — inkomba engemihle (into yokugcina)
uhlu$#           // 5 — ubude (sebenzisa (uhlu$#) ngaphakathi >>)

uhlu = uhlu$+ 6            // engeza → [1,2,3,4,5,6]
uhlu2 = uhlu$+[2] 99       // faka endaweni yesi-2 (isisekelo-1)
uhlu3 = uhlu$- 3           // susa ukubonakala kokuqala kwenani
uhlu4 = uhlu$-- 3          // susa konke ukubonakala
uhlu5 = uhlu$-[1]          // susa enkombeni 1 (into yokuqala)
uhlu6 = uhlu$-[2..3]       // susa ububanzi (isisekelo-1, ukuphela kufakiwe)

ikhona = uhlu$? 3          // #1 — iqukethe
izindawo = uhlu$?? 3       // [3] — zonke izinkomba zenani (isisekelo-1)
ucezu = uhlu$[1..3]        // [1,2,3] — ucezu (isisekelo-1, ukuphela kufakiwe)
ucezu2 = uhlu$[1:3]        // [1,2,3] — okufanayo, isintaksi esekelwe enanini

ukukhuphuka = uhlu$^+      // hlela ukukhuphuka (izinto eziyisisekelo kuphela)
ukwehla = uhlu$^-          // hlela ukwehla (izinto eziyisisekelo kuphela)

// Uhlu lwamathuple anegama/ngokwesimo — sebenzisa $^ nge-lambda yokuqhathanisa
idatha = [(igama: "Carla", iminyaka: 28), (igama: "Ana", iminyaka: 25), (igama: "Bob", iminyaka: 30)]
ngokweminyaka   = idatha$^ (a, b -> a.iminyaka < b.iminyaka)   // ukukhuphuka ngokweminyaka (<)
ngokwegama   = idatha$^ (a, b -> a.igama > b.igama)         // ukwehla ngokwegama (>)
>> ngokweminyaka[1].igama ¶   // → Ana
>> ngokwegama[1].igama ¶      // → Carla

// Ukuvuselela into ngokuqondile (uhlu kuphela)
uhlu[1] = 99              // yabela
uhlu[2] += 5              // okuhlanganisiwe: +=  -=  *=  /=  %=  ^=

// Ukuvuselela okusebenzayo — ibuya uhlu olusha; okwangempela akushintshi
uhlu2 = uhlu[2]$~ 99
```

> Bonke abasebenzisi beqoqo babuyisa **uhlu olusha**. Yabela kabusha: `uhlu = uhlu$+ 4`.
> `$+` ingaxhunywa: `uhlu = uhlu$+ 5$+ 6$+ 7`. Abanye abasebenzisi basebenzisa izabelo eziphakathi.
> **Ukukhomba kuyisisekelo-1**: `uhlu[1]` iyinto yokuqala; `uhlu[0]` iyiphutha lesikhathi sokusebenza.
> `$^+` / `$^-` ihlela **uhlu lwezinto eziyisisekelo** (izinombolo, izintambo). Ehlwini lamathuple, sebenzisa $^ nge-lambda yokuqhathanisa — inkomba ifakwe kwi-lambda (`<` = ukukhuphuka, `>` = ukwehla).

**I-semantiki yenani** — ukwabela uhlu kwenye into eguquguqukayo kwakha ikhophi ezimele:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ayithintwa
```

```zymbol
// Uhlu olufakwe ngaphakathi (ukukhomba isisekelo-1)
i-matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> i-matrix[2][3] ¶    // → 6  (umugqa 2, ikholomu 3)
```

---

## Ukudiliza

```zymbol
// Uhlu
uhlu = [10, 20, 30, 40, 50]
[a, b, c] = uhlu               // a=10  b=20  c=30
[eyokuqala, *okusaliwe] = uhlu // eyokuqala=10  okusaliwe=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ iyalishaya indiva

// Ithuple ngokwesimo
iphuzu = (100, 200)
(px, py) = iphuzu             // px=100  py=200

// Ithuple enegama
umuntu = (igama: "Ana", iminyaka: 25, idolobha: "Madrid")
(igama: i, iminyaka: im) = umuntu   // i="Ana"  im=25
```

---

## Amathuple

Amathuple ayiziqukathi **ezingaguquki** ezihleliwe ezingagcina amanani **ezinhlobo ezahlukene**.
Ngokungafani nohlu, izinto azikwazi ukushintshwa ngemva kokudalwa.

```zymbol
// Ngokwesimo — izinhlobo ezixubile zivunyelwe
iphuzu = (10, 20)
>> iphuzu[1] ¶     // → 10

idatha = (42, "sawubona", #1, 3.14)
>> idatha[3] ¶      // → #1

// Enegama
umuntu = (igama: "Alice", iminyaka: 25)
>> umuntu.igama ¶    // → Alice
>> umuntu[1] ¶       // → Alice  (inkomba nayo iyasebenza, isisekelo-1)

// Efakwe ngaphakathi
indawo = (x: 10, y: 20)
p = (indawo: indawo, ilebula: "umsuka")
>> p.indawo.x ¶      // → 10
```

**Ukungaguquguquki** — noma yimuphi umzamo wokuguqula into yethuple wuyiphutha lesikhathi sokusebenza:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ iphutha lesikhathi sokusebenza: amathuple awaguquki
// t[1] += 5    // ❌ iphutha elifanayo

// Ithuple enegama — yakha kabusha ngokusobala
umuntu = (igama: "Alice", iminyaka: 25)
omkhulu = (igama: umuntu.igama, iminyaka: 26)
>> umuntu.iminyaka ¶   // → 25
>> omkhulu.iminyaka ¶  // → 26
```

Ukuze uthole inani eliguquliwe, sebenzisa `$~` (ukuvuselela okusebenzayo) — ibuya ithuple **elisha**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← okwangempela akushintshile
>> t2 ¶    // → (10, 999, 30)
```

---

## Imisebenzi Yezinga Eliphezulu

```zymbol
izinombolo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ziphindwe kabili = izinombolo$> (x -> x * 2)               // imephu → [2,4,6…20]
ezilinganayo   = izinombolo$| (x -> x % 2 == 0)          // isihlungi → [2,4,6,8,10]
ingqikithi    = izinombolo$< (0, (ukunqwabelana, x) -> ukunqwabelana + x) // yehlisa → 55

// Ukuxhuma ngokusebenzisa izinto eziphakathi
isinyathelo1 = izinombolo$| (x -> x > 3)
isinyathelo2 = isinyathelo1$> (x -> x * x)
>> isinyathelo2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Imisebenzi enegama ingathunyelwa ngokuqondile emisebenzini yezinga eliphezulu
kabili(x) { <~ x * 2 }
inkulu(x) { <~ x > 5 }
r = izinombolo$> kabili       // ✅ isikhombiso esiqondile
r = izinombolo$| inkulu       // ✅ isikhombiso esiqondile
```

---

## Umsebenzisi Wepayipi

Uhlangothi lwesokudla luhlala ludinga `_` njengesibambi sendawo senani elifakwe epayipini:

```zymbol
kabili = x -> x * 2
engeza = (a, b) -> a + b
yengeza-oyedwa = x -> x + 1

5 |> kabili(_)        // → 10
10 |> engeza(_, 5)    // → 15
5 |> engeza(2, _)     // → 7

// Okuxhunyiwe
r = 5 |> kabili(_) |> yengeza-oyedwa(_) |> kabili(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Ukuphathwa kwamaphutha

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "ukwahlukanisa ngo-zero" ¶
} :! {
    >> "elinye iphutha: " _err ¶    // _err igcina umyalezo wephutha
} :> {
    >> "ihlala isebenza" ¶
}
```

| Uhlobo | Nini |
|--------|------|
| `##Div` | Ukwahlukanisa ngo-zero |
| `##IO` | Ifayela / isistimu |
| `##Index` | Inkomba ingaphandle kwemingcele |
| `##Type` | Ukungahambisani kohlobo |
| `##Parse` | Ukuhlaziya idatha |
| `##Network` | Amaphutha enethiwekhi |
| `##_` | Noma yiliphi iphutha (libamba konke) |

---

## Amamojula

```zymbol
// lib/calc.zy — umzimba wemojuli ungaphakathi kwamabakaki
# calc {
    #> { engeza, get_PI }

    _PI := 3.14159
    engeza(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // igama lomunye liyisibopho

>> c::engeza(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶              // → 3.14159
```

```zymbol
// Khipha ngegama elihlukile lomphakathi
# umtapo_wami {
    #> { _engeza_ngaphakathi <= isamba }

    _engeza_ngaphakathi(a, b) { <~ a + b }
}
```

```zymbol
<# ./umtapo_wami <= m

>> m::isamba(3, 4) ¶    // → 7  (igama langaphakathi _engeza_ngaphakathi lifihliwe)
```

> **Imithetho yemojuli**: ngaphakathi `# igama { }`, kuphela `#>`, izincazelo zomsebenzi, neziqalisi zezinto eziguquguqukayo/ezingaguquki ezibhalwe phansi ezivunyelwe. Izitatimende ezingasebenza (`>>`, `<<`, imijikelezo, njll.) zibangela iphutha E013.

---

## Izimo Zezinombolo

I-Zymbol ingabonisa izinombolo **kumabhulokhi angama-69 wamadijithi e-Unicode** — i-Devanagari, i-Arab-Indian, i-Thai, i-Klingon pIqaD, i-Mathematical bold, izingxenye ze-LCD, nokunye. Isimo esisebenzayo sithinta okukhiphayo `>>` kuphela; izibalo zangaphakathi zihlala ziyi-binary.

### Ukwenza iskripthi sisebenze

Bhala amadijithi `0` no `9` weskripthi oqondisiwe ngaphakathi `#…#`:

```zymbol
#०९#    // i-Devanagari   (U+0966–U+096F)
#٠٩#    // i-Arab-Indian  (U+0660–U+0669)
#๐๙#    // i-Thai         (U+0E50–U+0E59)
#09#    // setha kabusha ku-ASCII
```

---

### Ukukhipha namaBoolean

```zymbol
x = 42
>> x ¶          // → 42   (i-ASCII emisiwe)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (ichashazi ledesimali lihlala liyi-ASCII)
>> 1 + 2 ¶      // → ३

// Ama-Boolean: isiqalo esihamba phambili # sihlala siyi-ASCII, idijithi iyazivumelanisa
>> #1 ¶         // → #१   (iqiniso ku-Devanagari)
>> #0 ¶         // → #०   (amanga — yehlukile ku ० inombolo ephelele uziro)

x = 28 > 4
>> x ¶          // → #१   (umphumela wokuqhathanisa ulandela isimo esisebenzayo)
```

---

## Amadijithi omdabu kukhodi yomthombo

Amadijithi anoma yisiphi iskripthi esisekelwayo angamakhoqobo avumelekile — ezingxenyeni, kumodyulo, ekuqhathaniseni:

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

### Amakhoqobo e-Boolean kunoma yisiphi iskripthi

`#` + idijithi `0` noma `1` evela kunoma yiliphi ibhulokhi iyikhoqobo le-Boolean elivumelekile:

```zymbol
#०९#
isebenzayo = #१        // kufana no #1
>> isebenzayo ¶        // → #१
>> (#१ && #०) ¶        // → #०
```

> `#` **ihlala iyi-ASCII**. `#0` (amanga) ihlala ihluke ngokubukeka ku `0` (inombolo ephelele uziro) kuzo zonke izkripthi.

---

## Abasebenzisi Bedatha

```zymbol
// Ukuguqula uhlobo
##.42         // → 42.0  (ku-Indawo entantayo)
###3.7        // → 4     (ku-Inombolo ephelele, sondeza)
##!3.7        // → 3     (ku-Inombolo ephelele, nquma)

// Hlaziya uchungechunge lube inombolo
v1 = #|"42"|      // → 42  (Inombolo ephelele)
v2 = #|"3.14"|    // → 3.14  (Indawo entantayo)
v3 = #|"abc"|     // → "abc"  (ivikelekile, alikho iphutha)

// Sondeza / nquma
i-pi = 3.14159265
sondeza-2 = #.2|i-pi|     // → 3.14  (sondeza ezindaweni ezi-2 zedesimali)
sondeza-4 = #.4|i-pi|     // → 3.1416
nquma-2 = #!2|i-pi|       // → 3.14  (nquma)

// Ukufomatha izinombolo
ifomethi = #,|1234567|   // → 1,234,567  (ehlukaniswe ngokoma)
isayensi = #^|12345.678| // → 1.2345678e4  (isayensi)

// Amakhoqobo esisekelo
a = 0x41         // → 'A'  (i-hexadecimal)
b = 0b01000001   // → 'A'  (i-binary)
c = 0o101        // → 'A'  (i-octal)

// Okukhiphayo kokuguqulwa kwesisekelo
i-hex = 0x|255|   // → "0x00FF"
i-bin = 0b|65|    // → "0b1000001"
i-oct = 0o|8|     // → "0o10"
i-dec = 0d|255|   // → "0d0255"
```

---

## Ukuhlanganiswa kweShell

```zymbol
usuku = <\ date +%Y-%m-%d \>     // ibamba i-stdout (ifaka \n ekugcineni)
>> "Namuhla: " usuku

ifayela = "idatha.txt"
okuqukethwe = <\ cat {ifayela} \>      // ukufakwa emiyalweni

okukhiphayo = </"./subscript.zy"/>    // sebenzisa esinye iskripthi seZymbol, ibamba okukhiphayo
>> okukhiphayo
```

> `><` ibamba izimpikiswano ze-CLI njengohlu lwezintambo (kumhambi wezihlahla kuphela).

---

---

## Isibonelo Esiphelele: i-FizzBuzz

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

## Isikhombiso Sezimpawu

| Uphawu | Umsebenzi | Uphawu | Umsebenzi |
|--------|-----------|--------|-----------|
| `=` | isimo esiguquguqukayo | `$#` | ubude |
| `:=` | esingaguquki | `$+` | engeza (iyaxhunyaniswa) |
| `>>` | okukhiphayo | `$+[i]` | faka enkombeni (isisekelo-1) |
| `<<` | okufakayo | `$-` | susa eyokuqala ngokwenani |
| `¶` / `\\` | umugqa omusha | `$--` | susa konke ngokwenani |
| `?` | uma | `$-[i]` | susa enkombeni (isisekelo-1) |
| `_?` | uma kungenjalo uma | `$-[i..j]` | susa ububanzi (isisekelo-1) |
| `_` | uma kungenjalo / yonke into | `$?` | iqukethe |
| `??` | fanisa | `$??` | thola zonke izinkomba (isisekelo-1) |
| `@` | umjikelezo | `$[s..e]` | ucezu (isisekelo-1) |
| `@ N { }` | umjikelezo wezikhathi ezi-N | `$>` | imephu |
| `@!` | phula | `$|` | isihlungi |
| `@>` | qhubeka | `$<` | yehlisa |
| `@:igama { }` | umjikelezo onalebula | `$/ isihlukanisi` | ukuhlukanisa uchungechunge |
| `@:igama!` | phula onalebula | `$++ a b c` | ukwakha ukuxhumanisa |
| `@:igama>` | qhubeka onalebula | `uhlu[i>j>k]` | inkomba yokuzulazula |
| `->` | i-lambda | `uhlu[i] = inani` | vuselela into (uhlu kuphela) |
| `uhlu[i] += inani` | ukuvuselela okuhlanganisiwe | `uhlu[i]$~` | ukuvuselela okusebenzayo (ikhophi entsha) |
| `$^+` | hlela ukukhuphuka (izinto eziyisisekelo) | `$^-` | hlela ukwehla (izinto eziyisisekelo) |
| `$^` | hlela ngesiqhathanisi (amathuple) | `<~` | buyisa |
| `|>` | ipayipi | `!?` | zama |
| `:!` | bamba | `:>` | ekugcineni |
| `#1` | iqiniso | `#0` | amanga |
| `$!` | yiphutha | `$!!` | sakaza iphutha |
| `<#` | ngenisa | `#>` | khipha |
| `#` | memezela imojuli | `::` | biza imojuli |
| `.` | ukufinyelela ensimini | `#?` | imethadatha yohlobo |
| `#\|..\|` | hlaziya inombolo | `##.` | guqulela ku-Indawo entantayo |
| `###` | guqulela ku-Inombolo ephelele (sondeza) | `##!` | guqulela ku-Inombolo ephelele (nquma) |
| `#.N\|..\|` | sondeza | `#!N\|..\|` | nquma |
| `#,\|..\|` | ifomethi yokoma | `#^\|..\|` | isayensi |
| `#d0d9#` | shintsha isimo sezinombolo | `#09#` | setha kabusha ku-ASCII |
| `<\ ..\>` | sebenzisa i-shell | `>\<` | izimpikiswano ze-CLI |
| `\ var` | bhujisa isimo esiguquguqukayo ngokusobala | | |

---

---

## Umlando Wezinguquko Zokukhishwa

### v0.0.4 — Ukukhomba Isisekelo-1, Imisebenzi Yezinga Lokuqala & Amabhulokhi Emojuli _(Ephreli 2026)_

- **Ukuphula** Konke ukukhomba kushintshiwe kwaba **isisekelo-1** — `uhlu[1]` iyinto yokuqala; `uhlu[0]` iyiphutha lesikhathi sokusebenza
- **Kwengezwe** Imisebenzi enegama **ingamanani ezinga lokuqala** — thumela ngokuqondile emisebenzini yezinga eliphezulu: `izinombolo$> kabili`
- **Kwengezwe** **Isintaksi yebhulokhi** yemojuli iyisibopho: `# igama { ... }` — isintaksi eyisicaba isusiwe
- **Kwengezwe** Ukukhomba izinhlaka eziningi: `uhlu[i>j>k]` (ukuzulazula), `uhlu[p ; q]` (ukukhipha okusicaba)
- **Kwengezwe** Ukuguqula uhlobo: `##.inkulumo` (Indawo entantayo), `###inkulumo` (Inombolo ephelele sondeza), `##!inkulumo` (Inombolo ephelele nquma)
- **Kwengezwe** Ukuhlukanisa uchungechunge: `uchungechunge$/ isihlukanisi` — ibuya `Array(Uchungechunge)`
- **Kwengezwe** Ukwakha ukuxhumanisa: `isisekelo$++ a b c` — engeza izinto eziningi
- **Kwengezwe** Umjikelezo wezikhathi ezi-N: `@ N { }` — phinda izikhathi ezi-N ncamashi
- **Kwengezwe** Isintaksi yemijikelezo enelebula: `@:igama { }`, `@:igama!`, `@:igama>` — ithatha indawo ka `@ @igama` / `@! igama`
- **Kwengezwe** Imithetho yobubanzi bezinto eziguquguqukayo: izinto eziguquguqukayo `_igama` zinobubanzi bebhulokhi obunembile; `\ var` ibhujisa ngokushesha
- **Kwengezwe** Amaphethini okuqhathanisa okufanisa: `< 0 :`, `> 5 :`, `== 42 :`, njll.
- **Kwengezwe** Iphutha lemojuli E013: izitatimende ezingasebenza emzimbeni wemojuli azivunyelwe
- **Kulungisiwe** `take_variable` ayisakonakalisi okungaguquki kwemojuli ngesikhathi sokubhala emuva
- **Kulungisiwe** `alias.CONST` manje isixazululwa kahle; `#>` ingavela ngemva kwezincazelo zomsebenzi
- **VM** Ukulingana okuphelele: 393/393 ukuhlolwa kuyaphumelela

### v0.0.3 — Izinhlelo Zezinombolo Ze-Unicode & Ukuthuthukiswa kwe-LSP _(Ephreli 2026)_

- **Kwengezwe** Amabhulokhi angama-69 amadijithi e-Unicode anophawu lokushintsha isimo `#d0d9#`
- **Kwengezwe** Amakhoqobo e-Boolean kunoma yisiphi iskripthi — `#१` / `#०`, `#१` / `#०`, njll.
- **Kwengezwe** Amadijithi e-Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Kwengezwe** `SetNumeralMode` i-opcode ye-VM — ukulingana okuphelele nomhambi wezihlahla
- **Kwengezwe** I-REPL iyayihlonipha isimo sezinombolo esisebenzayo ekusabeleni nasekubonisweni kwezinto eziguquguqukayo
- **Kushintshiwe** Okukhiphayo kwe-Boolean `>>` manje kufaka isiqalo esihamba phambili `#` (`#0` / `#1`) kuzo zonke izimo

### v0.0.2_01 — Ukuqanjwa Kabusha Komsebenzisi _(30 Mashi 2026)_

- **Kushintshiwe** `c|..|` → `#,|..|` ne `e|..|` → `#^|..|` — kuhambisana nomndeni wesiqalo sefomethi `#`
- **Kwengezwe** Igama elihlukile lokukhipha — khipha kabusha amalungu emojuli ngaphansi kwegama elihlukile

### v0.0.2 — Ukuklama Kabusha kwe-API Yeqoqo & Izifaki _(24 Mashi 2026)_

- **Kwengezwe** Umndeni ohlanganisiwe wabasebenzisi `$` wohluzi nezintambo (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Kwengezwe** Isabelo sokudiliza sohlu, amathuple, namathuple anegama
- **Kwengezwe** Izinkomba ezingemihle (`uhlu[-1]` = into yokugcina)
- **Kwengezwe** Izifaki zomdabu — i-Linux (deb/rpm/pkg/musl), i-macOS (Intel + Apple Silicon), i-Windows (MSI, winget)

### v0.0.1-patch _(25 Mashi 2026)_

- **Kwengezwe** Isabelo esihlanganisiwe `^=`
- **Kulungisiwe** Amacala emaphethelweni ezibalo omhlaziyi; ukulungiswa kwemibhalo

### v0.0.1 — Ukukhishwa Kokuqala Komphakathi _(22 Mashi 2026)_

- Umhumushi womhambi wezihlahla + i-VM yerejista (`--vm`, ~4× ngokushesha, ~95% ukulingana)
- Zonke izakhiwo eziyisisekelo: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Izichongi ze-Unicode eziphelele, isistimu yemojuli, ama-lambda, ukuvalwa, ukuphathwa kwamaphutha
- I-REPL, i-LSP, Isandiso se-VS Code, umfomethi (`zymbol fmt`)

---

_I-Zymbol-Lang — Engokomfanekiso. Yomhlaba wonke. Engaguquki._
