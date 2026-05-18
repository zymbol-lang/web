> **Isixwayiso:** Lo mbhalo wenziwe futhi wahunyushwa ngobuhlakani bokufakelwa (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Inkomba esemthethweni ithi **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** enqolobaneni yomhumushi.

---

# Umhlahlandlela we-Zymbol-Lang

> **Kubuyekezwe i-v0.0.5 — 2026-05-14**

**I-Zymbol-Lang** wulimi lohlelo olungokwezimpawu. Akunamagama angukhiye — konkuyisimpawu. Isebenza ngendlela efanayo kunoma yiluphi ulimi lwesintu.

- Ayikho `if`, `while`, `return` — kuphela `?`, `@`, `<~`
- I-Unicode ephelele — izihlonzi kunoma yiluphi ulimi noma i-emoji
- Ayinciki olimini lwesintu — ikhodi iyafana yonke indawo

**Inguqulo yomhumushi**: v0.0.5 | **Ukumbozwa kokuhlola**: 436/436 (ukulingana kwe-TW ↔ VM)

---

## Okuguquguqukayo nokungaguquki

```zymbol
x = 10              // okuguquguqukayo okungashintsha
π := 3.14159        // okungaguquki — ukwabela kabusha kuyiphutha lesikhathi sokusebenza
igama = "u-Alice"
kusebenza = #1         // i-boolean eyiqiniso
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

`°` (uphawu ledigri, U+00B0) iqala okuguquguqukayo ngokuzenzakalelayo kusenani layo elingathathi hlangothi ekusetshenzisweni kokuqala:

```zymbol
izinombolo = [3, 1, 4, 1, 5]
@ n:izinombolo {
    °ingqikithi += n    // iqalwa ngokuzenzakalelayo ibe ngu-0 ngenhla komjikelezo; iyaphila ngemuva kuka-@
}
>> ingqikithi ¶         // → 14
```

> `°x` (isiqalo) simisa phezu komjikelezo — umphumela uyatholakala ngemuva kuka-`@`.
> `x°` (isijobelelo) simisa ngaphakathi komjikelezo — iyafa lapho umjikelezo uphele.
> I-tree-walker kuphela.

---

## Izinhlobo Zedatha

| Uhlobo | Ubumba | Umaka `#?` | Amanothi |
|------|---------|----------|---------|
| Inombolo ephelele | `42`, `-7` | `###` | 64-bit enophawu |
| Iphuzu elintantayo | `3.14`, `1.5e10` | `##.` | Ukubhalwa kwesayensi kuvunyelwe |
| Uchungechunge | `"umbhalo"` | `##"` | Ukufakwa: `"Sawubona {igama}"` |
| Uhlamvu | `'A'` | `##'` | Uhlamvu olulodwa lwe-Unicode |
| I-boolean | `#1`, `#0` | `##?` | Akuyona inombolo — `#1 ≠ 1` |
| Uxhaxha | `[1, 2, 3]` | `##]` | Izakhi ezifanayo |
| I-tuple | `(a, b)` | `##)` | Ngokwesimo |
| I-tuple enegama | `(x: 1, y: 2)` | `##)` | Izinkambu ezinamagama |
| Umsebenzi | inkomba yomsebenzi onamagama | `##()` | Izinga lokuqala; ikhombisa `<funct/N>` |
| I-lambda | `x -> x * 2` | `##->` | Izinga lokuqala; ikhombisa `<lambd/N>` |

```zymbol
// Ukuhlola uhlobo — kubuyisela (uhlobo, amadijithi, inani)
i_meta = 42#?
>> i_meta ¶         // → (###, 2, 42)
t = i_meta[1]
>> t ¶            // → ###
```

---

## Okukhiphayo nokufakayo

```zymbol
>> "Sawubona" ¶                       // ¶ noma \\ emgqeni omusha osobala
>> "a=" a " b=" b ¶               // ukubekana — amanani amaningi
>> (arr$#) ¶                      // izisebenzi zokulandela zidinga ( ) ku->>

>> igama                           // funda kusiguquguquki (ngaphandle kwesicelo)
>> "Faka igama: " igama            // ngesicelo
```

> `¶` (i-AltGr+R kukhibhodi yesiSpanish) no-`\\` bayimigqa emisha elinganayo.

---

## I-TUI Eyisisekelo

Izisebenzi zesixhumi esibonakalayo somugqa wezinhlelo ezisebenzisanayo. Iningi lidinga ibhulokhi `>>| { }` (isikrini esishintshayo + imodi eluhlaza).

```zymbol
>>| {
    >>!                             // sula isikrini esishintshayo
    >>~ (1, 1, 0, 10) > "Kusebenza"   // umugqa 1, ikholomu 1, fg=10 (oluhlaza)
    @~ 1000                         // ima umzuzwana ongu-1 (1000 ms)
    >>~ (2, 1) > "Sekuphelile."
}
// umugqa uyabuyiselwa ngokuzenzakalelayo uma uphuma
```

```zymbol
// Ukucindezela ukhiye nosayizi womugqa
>>| {
    [imigqa, amakholomu] = >>?              // buza ubukhulu bomugqa
    >>~ (1, 1) > "Umugqa: " imigqa " x " amakholomu
    <<| ukhiye                         // funda ukucindezela ukhiye okuvimbeleyo
    >>~ (2, 1) > "Ucindezele: " ukhiye
}
```

> `>>!` isula isikrini. `>>?` ibuyisela `[imigqa, amakholomu]`. `@~ N` ilele N imilisekeni.
> `<<|` ifunda ukucindezela ukhiye okukodwa (okuvimbeleyo); `<<|?` ihlola ngaphandle kokuvimbela (ibuyisela `'\0'` uma ingekho).
> I-tuple yokukhipha indawo: `(umugqa, ikholomu, i-BKS, fg, bg)` — noma iyiphi indawo ingashiywa ngekoma (`>>~ (,,, 196) > "okubomvu"`).
> I-BKS i-bitmask: `1`=okugqamile, `2`=okutshekile, `4`=umugqa ngaphansi. Iphaledi yombala engu-256 ye-ANSI (`0`=okumisiwe komugqa).
> I-tree-walker kuphela (ngaphandle kwe-`>>!`, `>>?`, `@~`, `>>~` ezisebenza naku-`--vm`).

---

## Izisebenzi

```zymbol
// Izibalo
a = 10
b = 3
u1 = a + b    // 13
u2 = a - b    // 7
u3 = a * b    // 30
u4 = a / b    // 3  (ukwahlukanisa kwenombolo ephelele)
u5 = a % b    // 1
u6 = a ^ b    // 1000  (ukukhuphula ngesibonakaliso)

// Ukuqhathanisa — yabela ukuze uhlole
q1 = a == b    // #0
q2 = a <> b    // #1
q3 = a < b     // #0
q4 = a <= b    // #0
q5 = a > b     // #1
q6 = a >= b    // #1

// Okunengqondo
n1 = #1 && #0    // #0
n2 = #1 || #0    // #1
n3 = !#1         // #0
```

---

## Uchungechunge

```zymbol
// Izinhlobo ezimbili zokuhlanganisa
igama = "u-Alice"
n = 42

>> "Sawubona " igama " une-" n ¶       // ukubekana — ku->>
incazelo = "Sawubona {igama}, une-{n}"     // ukufakwa — noma kuphi
```

```zymbol
s = "Sawubona mhlaba"
ubude = s$#                  // 10
ingxenye = s$[1..5]             // "Sawub"  (1-okusekelwe, ukuphela kufakiwe)
ikhona = s$? "mhlaba"          // #1
izingxenye = "a,b,c,d"$/ ','   // [a, b, c, d]  (hlukanisa ngesihlukanisi)
shintsha = s$~~["l":"r"]        // "Sawubona mhlaba"
shintsha1 = s$~~["l":"r":1]     // "Sawubona mhlaba" (ngaphandle kuka-'l')
umugqa = "─" $* 20           // "────────────────────"  (phinda N izikhathi)
```

> `+` ingeyezinombolo kuphela. Ochungechungeni, sebenzisa `,`, ukubekana, noma ukufakwa.

---

## Ukulawula Ukugeleza

```zymbol
x = 7

? x > 0 { >> "okuhle" ¶ }

? x > 100 {
    >> "okukhulu" ¶
} _? x > 0 {
    >> "okuhle" ¶
} _? x == 0 {
    >> "uziro" ¶
} _ {
    >> "okubi" ¶
}
```

> Izingodo `{ }` **ziyadingeka** ngisho nakusitatimende esisodwa.

---

## Ukufanisa

```zymbol
// Izikhawu
amaphuzu = 85
ibanga = ?? amaphuzu {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> ibanga ¶    // → B

// Ochungechunge
umbala = "obomvu"
ikhodi = ?? umbala {
    "obomvu"   => "#FF0000"
    "oluhlaza" => "#00FF00"
    _       => "#000000"
}

// Amaphethini okuqhathanisa
izinga_lokushisa = -5
isimo = ?? izinga_lokushisa {
    < 0  => "iqhwa"
    < 20 => "okubandayo"
    < 35 => "okufudumele"
    _    => "okushisayo"
}
>> isimo ¶    // → iqhwa

// Isimo sesitatimende (izingalo zebhulokhi)
n = -3
?? n {
    0    => { >> "uziro" ¶ }
    < 0  => { >> "okubi" ¶ }
    _    => { >> "okuhle" ¶ }
}
```

---

## Imijikelezo

```zymbol
@ i:0..4  { >> i " " }        // ububanzi obufakiwe:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // ngesinyathelo:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // okuhlanekezelayo:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

izithelo = ["ihluzi", "ipeya", "amagilebhisi"]
@ i:izithelo { >> i ¶ }         // kuwo wonke umsakwi kuxhaxha

@ u:"hello" { >> u "-" }
>> ¶                          // → h-e-l-l-o-  (kuwo wonke uhlamvu ochungechungeni)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> qhubeka
    ? i > 7 { @! }             // @! phula
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

// Umjikelezo onelebula (ukwephula okuhlanganisiwe)
ukubala = 0
@:ngaphandle {
    ukubala++
    ? ukubala >= 3 { @:ngaphandle! }
}
>> ukubala ¶                    // → 3
```

---

## Imisebenzi

```zymbol
engeza(a, b) { <~ a + b }
>> engeza(3, 4) ¶    // → 7

i_factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * i_factorial(n - 1)
}
>> i_factorial(5) ¶    // → 120
```

Imisebenzi inesizinda **esihlukile** — ayikwazi ukufunda okuguquguqukayo kwangaphandle. Sebenzisa imingcele yokukhipha `<~>` ukuze ushintshe okuguquguqukayo komfowunayo:

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

> Imisebenzi enamagama ingamanani **esilinganiselo sokuqala** — idlule ngqo: `izinombolo$> kabili`. Ukusonga: `x -> fn(x)` nakho kuyasebenza.

---

## Ama-Lambda nama-Closure

```zymbol
kabili = x -> x * 2
engeza = (a, b) -> a + b
>> kabili(5) ¶    // → 10
>> engeza(3, 7) ¶  // → 10

// I-lambda yebhulokhi
hlukanisa = x -> {
    ? x > 0 { <~ "okuhle" }
    _? x < 0 { <~ "okubi" }
    <~ "uziro"
}

// I-closure — ibamba isizinda sangaphandle
isici = 3
kathathu = x -> x * isici
>> kathathu(7) ¶    // → 21

// I-fekthri
umakhi_wokwengeza(n) { <~ x -> x + n }
engeza_ishumi = umakhi_·wokwengeza(10)
>> engeza_ishumi(5) ¶    // → 15

// Kuxhaxha
izisebenzi = [x -> x+1, x -> x*2, x -> x*x]
>> izisebenzi[3](5) ¶    // → 25
```

---

## Amaxhaxha

Amaxhaxha **ayashintsha** futhi aqukethe izakhi **zohlobo olufanayo**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — ukufinyelela (1-okusekelwe: isakhi sokuqala)
x = arr[-1]     // 5 — inkomba engeyinhle (isakhi sokugcina)
x = arr$#       // 5 — ubude (sebenzisa (arr$#) ku->>)

arr = arr$+ 6            // engeza → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // faka endaweni 2 (1-okusekelwe)
arr3 = arr$- 3           // susa ukwenzeka kokuqala kwenani
arr4 = arr$-- 3          // susa konke ukwenzeka
arr5 = arr$-[1]          // susa enkombeni 1 (isakhi sokuqala)
arr6 = arr$-[2..3]       // susa ububanzi (1-okusekelwe, ukuphela kufakiwe)

ikhona = arr$? 3            // #1 — iqukethe
izindawo = arr$?? 3           // [3] — zonke izinkomba zenani (1-okusekelwe)
ucezu = arr$[1..3]          // [1,2,3] — ucezu (1-okusekelwe, ukuphela kufakiwe)
ucezu2 = arr$[1:3]          // [1,2,3] — okufanayo, uhlelo lolimi olusekelwe ekubaleni

okukhuphukayo = arr$^+             // hlela okukhuphukayo (i-primitive kuphela)
okwehliyo = arr$^-            // hlela okwehliyo (i-primitive kuphela)

// Amaxhaxha e-tuple anegama/ngokwesimo — sebenzisa $^ ne-lambda yokuqhathanisa
i_database = [(igama: "u-Carla", iminyaka: 28), (igama: "u-Ana", iminyaka: 25), (igama: "u-Bob", iminyaka: 30)]
ngokweminyaka  = i_database$^ (a, b -> a.iminyaka < b.iminyaka)    // ngokweminyaka okukhuphukayo (<)
ngokwegama = i_database$^ (a, b -> a.igama > b.igama)   // ngokwegama okwehliyo (>)
>> ngokweminyaka[1].igama ¶     // → u-Ana
>> ngokwegama[1].igama ¶    // → u-Carla

// Ukubuyekeza isakhi ngqo (amaxhaxha kuphela)
arr[1] = 99              // yabela
arr[2] += 5              // okuhlanganisiwe: +=  -=  *=  /=  %=  ^=

// Ukubuyekeza okusebenzayo — kubuyisela ixhaxha elisha; okwangempela akushintshi
arr2 = arr[2]$~ 99
```

> Zonke izisebenzi zeqoqo zibuyisela **ixhaxha elisha**. Yabela kabusha: `arr = arr$+ 4`.
> `$+` ingahlanganiswa ngekhowuni: `arr = arr$+ 5$+ 6$+ 7`. Ezinye izisebenzi zisebenzisa izabelo eziphakathi.
> **Izinkomba zingu-1-okusekelwe**: `arr[1]` iyisakhi sokuqala; `arr[0]` iyiphutha lesikhathi sokusebenza.
> `$^+` / `$^-` zihlela **amaxhaxha e-primitive** (izinombolo, izintambo). Kumaxhaxha e-tuple, sebenzisa `$^` nge-lambda yokuqhathanisa — ukuqondisa kubhalwe ku-lambda (`<` = okukhuphukayo, `>` = okwehliyo).

**I-semantics yenani** — ukwabela ixhaxha komunye okuguquguqukayo kwakha ikhophi ezimele:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ayithintekile
```

```zymbol
// Amaxhaxha ashumekile (izinkomba ezi-1-okusekelwe)
i_matrix = [[1,2,3],[4,5,6],[7,8,9]]
>> i_matrix[2][3] ¶    // → 6  (umugqa 2, ikholomu 3)
```

---

## Ukuhlakazwa Kwesakhiwo

```zymbol
// Ixhaxha
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[eyokuqala, *okusele] = arr         // eyokuqala=10  okusele=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ iyalahla

// I-tuple ngokwesimo
iphuzu = (100, 200)
(px, py) = iphuzu             // px=100  py=200

// I-tuple enegama
umuntu = (igama: "u-Ana", iminyaka: 25, idolobha: "iMadrid")
(igama: n, iminyaka: i) = umuntu   // n="u-Ana"  i=25
```

---

## Ama-Tuple

Ama-tuple yiziqukathi ezihleliwe **ezingaguquki** ezingabamba amanani **ezinhlobo ezahlukene**.
Ngokungafani namaxhaxha, izakhi azikwazi ukushintshwa ngemva kokudalwa.

```zymbol
// Ngokwesimo — izinhlobo ezixubile zivunyelwe
iphuzu = (10, 20)
>> iphuzu[1] ¶    // → 10

idatha = (42, "Sawubona", #1, 3.14)
>> idatha[3] ¶     // → #1

// Enamagama
umuntu = (igama: "u-Alice", iminyaka: 25)
>> umuntu.igama ¶    // → u-Alice
>> umuntu[1] ¶      // → u-Alice  (inkomba nayo iyasebenza, 1-okusekelwe)

// Eshumekile
indawo = (x: 10, y: 20)
p = (indawo: indawo, ilebula: "umsuka")
>> p.indawo.x ¶        // → 10
```

**Ukungaguquki** — noma imuphi umzamo wokushintsha isakhi se-tuple uyiphutha lesikhathi sokusebenza:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ iphutha lesikhathi sokusebenza: ama-tuple awaguquki
// t[1] += 5    // ❌ iphutha elifanayo
```

Ukuze uthole inani elishintshiwe sebenzisa `$~` (ukubuyekeza okusebenzayo) — kubuyisela **i-tuple entsha**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← okwangempela akushintshile
>> t2 ¶    // → (10, 999, 30)

// I-tuple enegama — yakha kabusha ngokusobala
umuntu = (igama: "u-Alice", iminyaka: 25)
omdala  = (igama: umuntu.igama, iminyaka: 26)
>> umuntu.iminyaka ¶    // → 25
>> omdala.iminyaka ¶     // → 26
```

---

## Imisebenzi Yezinga Eliphezulu

```zymbol
izinombolo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

okuphindwe_kabili  = izinombolo$> (x -> x * 2)                  // map  → [2,4,6…20]
izilinganayo    = izinombolo$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
ingqikithi    = izinombolo$< (0, (umqongqozi, x) -> umqongqozi + x)     // reduce → 55

// Hlanganisa ngekhowuni ngokusebenzisa iziphakathi
isinyathelo1 = izinombolo$| (x -> x > 3)
isinyathelo2 = isinyathelo1$> (x -> x * x)
>> isinyathelo2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Imisebenzi enamagama ingadluliselwa ngqo ku-HOF
kabili(x) { <~ x * 2 }
inkulu(x) { <~ x > 5 }
r = izinombolo$> kabili       // ✅ inkomba eqondile
r = izinombolo$| inkulu       // ✅ inkomba eqondile
```

---

## Isisebenzi Sepayiphu

Uhlangothi lwesokudla luhlala ludinga `_` njengesibambi sendawo senani elipayiphuwe:

```zymbol
kabili = x -> x * 2
engeza = (a, b) -> a + b
ukhuphula = x -> x + 1

u1 = 5 |> kabili(_)        // → 10
u2 = 10 |> engeza(_, 5)       // → 15
u3 = 5 |> engeza(2, _)        // → 7

// Okuhlangene
u = 5 |> kabili(_) |> ukhuphula(_) |> kabili(_)
>> u ¶    // → 22  (5→10→11→22)
```

---

## Ukuphathwa Kwephutha

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "ukuhlukanisa ngoziro" ¶
} :! {
    >> "okunye: " _err ¶    // _err igcina umyalezo wephutha
} :> {
    >> "ihlala isebenza" ¶
}
```

| Uhlobo | Nini |
|------|------|
| `##Div` | Ukuhlukanisa ngoziro |
| `##IO` | Ifayela / isistimu |
| `##Index` | Inkomba engaphandle komkhawulo |
| `##Type` | Ukungafani kohlobo |
| `##Parse` | Ukuhlaziywa kwedatha |
| `##Network` | Amaphutha enethiwekhi |
| `##_` | Noma yiliphi iphutha (libamba konke) |

---

## Amamojula

```zymbol
// lib/calc.zy — umzimba wemojuli uvalwe ngezingodo
# calc {
    #> { engeza, get_PI }

    _π := 3.14159
    engeza(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // isithelo siyadingeka

>> c::engeza(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Khipha ngegama lomphakathi elihlukile
# mylib {
    #> { _engeza_yangaphakathi => isamba }

    _engeza_yangaphakathi(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::isamba(3, 4) ¶    // → 7  (igama langaphakathi _engeza_yangaphakathi lifihliwe)
```

> **Imithetho yemojuli**: ngaphakathi kwe-`# igama { }`, kuphela i-`#>`, izincazelo zomsebenzi, neziqalisi ezibumbeyo zokuguquguqukayo/okungaguquki okuvunyelwe. Izitatimende eziphathekayo (`>>`, `<<`, imijikelezo, njll.) ziphakamisa iphutha E013.

---

## Izindlela Zezinombolo

I-Zymbol ingabonisa izinombolo **ezinhlamvwini zezinombolo ezingama-69 ze-Unicode** — i-Devanagari, i-Arab-Indian, i-Thai, i-Klingon pIqaD, i-Mathematical Bold, izingxenye ze-LCD, nokunye. Imodi esebenzayo ithinta okukhiphayo `>>` kuphela; izibalo zangaphakathi zihlala zingokunambambili.

### Ukwenza isandiso sisebenze

Bhala amadijithi `0` no-`9` esandiso esiqondiwe ngaphakathi `#…#`:

```zymbol
#०९#    // i-Devanagari   (U+0966–U+096F)
#٠٩#    // i-Arab-Indian (U+0660–U+0669)
#๐๙#    // i-Thai         (U+0E50–U+0E59)
#09#    // setha kabusha ku-ASCII
```

### Okukhiphayo nama-boolean

```zymbol
x = 42
>> x ¶          // → 42   (okuzenzakalelayo kwe-ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (ichashazi ledesimali lihlala lingama-ASCII)
>> 1 + 2 ¶      // → ३

// Ama-boolean: isiqalo # ihlala ingama-ASCII, idijithi iyavumelana
>> #1 ¶         // → #१   (iqiniso ku-Devanagari)
>> #0 ¶         // → #०   (amanga — yehlukile ku-० uziro wenombolo ephelele)

x = 28 > 4
>> x ¶          // → #१   (umphumela wokuqhathanisa ulandela imodi esebenzayo)
```

### Izibumbelo zedijithi zomdabu kumthombo

Amadijithi anoma iyiphi isandiso esisekelwayo ayizibumbelo ezivumelekile — ezikhaleni, ku-modulo, ekuqhathaniseni:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Izibumbelo zama-boolean kunoma yisiphi isandiso

`#` + idijithi `0` noma `1` evela kunoma iyiphi ibhulokhi iyisibumbelo se-boolean esivumelekile:

```zymbol
#٠٩#
kusebenza = #١        // okufana ne-#1
>> kusebenza ¶        // → #१
>> (#١ && #०) ¶ // → #०
```

> `#` **ihlala ingama-ASCII**. `#0` (amanga) ihlala ihluke ngokubukeka ku-`0` (uziro wenombolo ephelele) kuzo zonke izandiso.

---

## Izisebenzi Zedatha

```zymbol
// Ukuguqulwa kohlobo
f = ##.42         // → 42.0  (kuphoyinti elintantayo)
i = ###3.7        // → 4     (enombolweni ephelele, songela)
t = ##!3.7        // → 3     (enombolweni ephelele, nquma)

// Hlaziya uchungechunge lube yinombolo
v1 = #|"42"|      // → 42  (inombolo ephelele)
v2 = #|"3.14"|    // → 3.14  (iphoyinti elintantayo)
v3 = #|"abc"|     // → "abc"  (iphephile, alikho iphutha)

// Songela / Nquma
π = 3.14159265
songela2 = #.2|π|      // → 3.14  (songela ezindaweni ezingu-2 zedesimali)
songela4 = #.4|π|      // → 3.1416
nquma2 = #!2|π|      // → 3.14  (nquma)

// Ukufomatha izinombolo
ifomathi = #,|1234567|  // → 1,234,567  (kuhlukaniswe ngokoma)
eyesayensi = #^|12345.678|    // → 1.2345678e4  (eyesayensi)

// Izibumbelo zesisekelo
a = 0x41         // → 'A'  (i-hexadecimal)
b = 0b01000001   // → 'A'  (i-binary)
c = 0o101        // → 'A'  (i-octal)

// Okukhiphayo kokuguqulwa kwesisekelo
i_hex = 0x|255|    // → "0x00FF"
i_binary = 0b|65|     // → "0b1000001"
i_octal = 0o|8|      // → "0o10"
i_decimal = 0d|255|    // → "0d0255"
```

---

## Ukuhlanganiswa Kwegobolondo

```zymbol
usuku = <\ date +%Y-%m-%d \>     // thwebula i-stdout (kufaka phakathi u-\n ekugcineni)
>> "Namuhla: " usuku

ifayela = "data.txt"
okuqukethwe = <\ cat {ifayela} \>      // ukufakwa emiyalweni

okukhiphayo = </"./subscript.zy"/>   // sebenzisa enye iskripthi ye-Zymbol, thwebula okukhiphayo
>> okukhiphayo
```

> `><` ithwebula izimpikiswano ze-CLI njengexhaxha lezintambo (i-tree-walker kuphela).

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

## Ireferensi Yezimpawu

| Uphawu | Umsebenzi | Uphawu | Umsebenzi |
|--------|-----------|--------|-----------|
| `=` | okuguquguqukayo | `$#` | ubude |
| `:=` | okungaguquki | `$+` | engeza (kungahlanganiswa ngekhowuni) |
| `>>` | okukhiphayo | `$+[i]` | faka enkombeni (1-okusekelwe) |
| `<<` | okufakayo | `$-` | susa eyokuqala ngenani |
| `¶` / `\\` | umugqa omusha | `$--` | susa konke ngenani |
| `?` | uma | `$-[i]` | susa enkombeni (1-okusekelwe) |
| `_?` | okunye-uma | `$-[i..j]` | susa ububanzi (1-okusekelwe) |
| `_` | okunye / i-wildcard | `$?` | iqukethe |
| `??` | fanisa | `$??` | thola zonke izinkomba (1-okusekelwe) |
| `@` | umjikelezo | `$[s..e]` | ucezu (1-okusekelwe) |
| `@ N { }` | umjikelezo N izikhathi | `$>` | map |
| `@!` | phula | `$\|` | filter |
| `@>` | qhubeka | `$<` | reduce |
| `@:igama { }` | umjikelezo onelebula | `$/ isihlukanisi` | hlukanisa uchungechunge |
| `@:igama!` | phula ilebula | `$++ a b c` | ukwakha ukuhlanganisa |
| `@:igama>` | qhubeka ilebula | `arr[i>j>k]` | inkomba yokuzulazula |
| `->` | i-lambda | `arr[i] = inani` | buyekeza isakhi (amaxhaxha kuphela) |
| `arr[i] += inani` | ukubuyekeza okuhlanganisiwe | `arr[i]$~` | ukubuyekeza okusebenzayo (ikhophi entsha) |
| `$^+` | hlela okukhuphukayo (i-primitive) | `$^-` | hlela okwehliyo (i-primitive) |
| `$^` | hlela ngesiqhathanisi (ama-tuple) | `<~` | buyisela |
| `\|>` | ipayiphu | `!?` | zama |
| `:!` | bamba | `:>` | ekugcineni |
| `#1` | iqiniso | `#0` | amanga |
| `$!` | ingabe iphutha | `$!!` | sakaza iphutha |
| `<#` | ngenisa | `#>` | khipha |
| `#` | memezela imojuli | `::` | biza imojuli |
| `.` | ukufinyelela enkambeni | `#?` | i-metadata yohlobo |
| `#\|..\|` | hlaziya inombolo | `##.` | guqula kube yiphoyinti elintantayo |
| `###` | guqula kube yinombolo ephelele (songela) | `##!` | guqula kube yinombolo ephelele (nquma) |
| `#.N\|..\|` | songela | `#!N\|..\|` | nquma |
| `#,\|..\|` | ifomathi yokoma | `#^\|..\|` | eyesayensi |
| `#d0d9#` | shintsha imodi yezinombolo | `#09#` | setha kabusha ku-ASCII |
| `<\ ..\>` | sebenzisa igobolondo | `>\<` | izimpikiswano ze-CLI |
| `\ okuguquguqukayo` | buza okuguquguqukayo ngokusobala | `°x` / `x°` | incazelo eshisayo (iqala ngokuzenzakalelayo) |
| `>>|` | ibhulokhi ye-TUI (isikrini esishintshayo) | `>>~` | okukhiphayo ngokwendawo |
| `>>!` | sula isikrini | `>>?` | buza usayizi womugqa |
| `<<\|` | ukucindezela ukhiye okuvimbeleyo | `<<\|?` | ukuhlola ukucindezela ukhiye okungavimbeli |
| `@~ N` | lala N imilisekeni | `$*` | phinda uchungechunge N izikhathi |

---

## Umlando Wezinguquko Zokukhululwa

### v0.0.5 — I-TUI Eyisisekelo, Incazelo Eshisayo & Ukuphindwa Kochungechunge _(Meyi 2026)_

- **Okuphukayo** Isihlukanisi sengalo yokufanisa: `iphethini : umphumela` → `iphethini => umphumela`
- **Okuphukayo** Isithelo sokungenisa: `<# indlela <= isithelo` → `<# indlela => isithelo`
- **Okuphukayo** Ukuqamba kabusha ukukhipha: `#> { fn <= okomphakathi }` → `#> { fn => okomphakathi }`
- **Kungeziwe** Ibhulokhi ye-TUI `>>| { }` — isikrini esishintshayo + imodi eluhlaza; iyahlanza uma uphuma
- **Kungeziwe** Okukhiphayo ngokwendawo `>>~ (umugqa, ikholomu, i-BKS, fg, bg) > izinto` — izikhala ezingavamile, imibala engama-256 ye-ANSI
- **Kungeziwe** Ukufaka ukhiye `<<| okuguquguqukayo` (okuvimbeleyo) kanye `<<|? okuguquguqukayo` (ukuhlola okungavimbeli)
- **Kungeziwe** `>>!` sula isikrini, `>>?` buza usayizi womugqa, `@~ N` lala N imilisekeni
- **Kungeziwe** Incazelo eshisayo `°x` / `x°` — qala okuguquguqukayo ngokuzenzakalelayo ekusetshenzisweni kokuqala emijikelezweni
- **Kungeziwe** Ukuphindwa kochungechunge `uchungechunge $* N` — phinda uchungechunge N izikhathi
- **I-VM** Ukulingana: izivivinyo ezingama-436/436 ziphumelele

### v0.0.4 — Izinkomba Ezi-1-okusekelwe, Imisebenzi Yezinga Lokuqala & Amamojula Ebhulokhi _(Ephreli 2026)_

- **Okuphukayo** Zonke izinkomba zishintshiwe zaba **ngezi-1-okusekelwe** — `arr[1]` iyisakhi sokuqala; `arr[0]` iyiphutha lesikhathi sokusebenza
- **Kungeziwe** Imisebenzi enamagama ingamanani **ezinga lokuqala** — dlulisela ngqo ku-HOF: `izinombolo$> kabili`
- **Kungeziwe** **Uhlelo lolimi lwebhulokhi oluyidingekayo** lwamamojula: `# igama { ... }` — uhlelo lolimi oluyisicaba lususiwe
- **Kungeziwe** Izinkomba zobukhulu obuningi: `arr[i>j>k]` (ukuzulazula), `arr[p ; q]` (ukukhipha okuyisicaba)
- **Kungeziwe** Ukuguqulwa kohlobo: `##.inkulumo` (iphoyinti elintantayo), `###inkulumo` (inombolo ephelele songela), `##!inkulumo` (inombolo ephelele nquma)
- **Kungeziwe** Ukuhlukanisa uchungechunge: `uchungechunge$/ isihlukanisi` — ibuyisela `Array(uchungechunge)`
- **Kungeziwe** Ukwakha ukuhlanganisa: `isisekelo$++ a b c` — engeza izinto eziningi
- **Kungeziwe** Umjikelezo wezikhathi: `@ N { }` — phinda kabili N izikhathi
- **Kungeziwe** Uhlelo lolimi lomjikelezo onelebula: `@:igama { }`, `@:igama!`, `@:igama>` — ithatha indawo ye-`@ @igama` / `@! igama`
- **Kungeziwe** Imithetho yesizinda sokuguquguqukayo: okuguquguqukayo `_igama` kunesizinda sebhulokhi esinembe; `\ okuguquguqukayo` kubhujiswa ngaphambi kwesikhathi
- **Kungeziwe** Amaphethini okuqhathanisa okufanisa: `< 0 =>`, `> 5 =>`, `== 42 =>`, njll.
- **Kungeziwe** Iphutha lemojuli E013: izitatimende eziphathekayo emzimbeni wemojuli zinqatshelwe
- **Kulungisiwe** I-`alias.CONST` manje ixazulula kahle; `#>` ingavela ngemva kwezincazelo zomsebenzi
- **I-VM** Ukulingana okuphelele: izivivinyo ezingama-393/393 ziphumelele

### v0.0.3 — Izinhlelo Zezinombolo Ze-Unicode & Ukuthuthukiswa Kwe-LSP _(Ephreli 2026)_

- **Kungeziwe** Amabhulokhi angama-69 wamadijithi e-Unicode anophawu lokushintsha imodi `#d0d9#`
- **Kungeziwe** Izibumbelo zama-boolean kunoma yisiphi isandiso — `#१` / `#०`, `#१` / `#०`, njll.
- **Kungeziwe** Amadijithi e-Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Kungeziwe** I-Opcode ye-VM `SetNumeralMode` — ukulingana okuphelele ne-tree-walker
- **Kushintshiwe** Okukhiphayo kwe-boolean `>>` manje kufaka phakathi isiqalo `#` (`#0` / `#1`) kuzo zonke izindlela

### v0.0.2_01 — Ukuqamba Kabusha Komenzi _(30 Mashi 2026)_

- **Kushintshiwe** `c|..|` → `#,|..|` kanye `e|..|` → `#^|..|` — ukuvumelana nomndeni wesiqalo `#`
- **Kungeziwe** Isithelo sokukhipha: khipha kabusha amalungu emojuli ngaphansi kwegama elihlukile

### v0.0.2 — Ukuklanywa Kabusha Kwe-API Yeqoqo & Izifaki _(24 Mashi 2026)_

- **Kungeziwe** Umndeni womsebenzi `$` ohlanganisiwe wamaxhaxha nezintambo (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Kungeziwe** Ukwabela ukuhlakazwa kwesakhiwo samaxhaxha, ama-tuple, nama-tuple anegama
- **Kungeziwe** Izinkomba ezingezinhle (`arr[-1]` = isakhi sokugcina)
- **Kungeziwe** Izifaki zomdabu — i-Linux (deb/rpm/pkg/musl), i-macOS (Intel + Apple Silicon), i-Windows (MSI, winget)

### v0.0.1-patch _(25 Mashi 2026)_

- **Kungeziwe** Ukwabela okuhlanganisiwe `^=`
- **Kulungisiwe** Amacala emaphethelweni ezibalo omhlaziyi; ukulungiswa kwemibhalo

### v0.0.1 — Ukukhululwa Kokuqala Komphakathi _(22 Mashi 2026)_

- Umhumushi we-tree-walker + i-VM yokubhalisa (`--vm`, ~4× ngokushesha, ~95% ukulingana)
- Zonke izakhiwo eziyisisekelo: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Izihlonzi ze-Unicode eziphelele, isistimu yemojuli, ama-lambda, ama-closure, ukuphathwa kwephutha
- I-REPL, i-LSP, isandiso se-VS Code, ifomatha (`zymbol fmt`)

---

_I-Zymbol-Lang — Ingokwezimpawu. Yomhlaba wonke. Ayiguquki._
