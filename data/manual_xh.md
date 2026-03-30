# Ingcaciso Emfutshane ye-Zymbol-Lang

**Zymbol-Lang** lulwimi lwekhompyutha lweempawu. Ayisebenzisi amagama angundoqo — yonke into yimpawu. Isebenza ngendlela efanayo kuyo nayiphi na ilwimi loluntu.

- Akukho magama angundoqo (`if`, `while`, `return` akakho — iimpawu kuphela `?`, `@`, `<~`)
- Unicode epheleleyo — amagama kulo naliphi na ulwimi okanye i-emoji 👋
- Ulwimi-agnostiki — ikhodi ifana kuzo zonke iilwimi

---

## Iinguqu neziConstant

```zymbol
x = 10              // inguqu (iyatshintsha)
PI := 3.14159       // constant — impazamo ukuphinda unikezele
igama = "Ana"
iyasebenza = #1     // ubunyaniso be-boolean
👋 := "Molo"
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

## Iintlobo zeData

| Uhlobo | Umzekelo | Impawu `#?` | Amanothi |
|--------|----------|-------------|----------|
| Inombolo yonke | `42`, `-7` | `###` | I-64-bit enengqinamba |
| Inombolo enxibe | `3.14`, `1.5e10` | `##.` | Uhlobo lwesayensi luyamkelwa |
| Umxholo | `"molo"` | `##"` | Ukuphinda: `"Molo {igama}"` |
| Unobumba | `'A'` | `##'` | Unobumba omnye we-Unicode |
| Ubunyaniso | `#1`, `#0` | `##?` | AYIZO iinombolo 1 no-0 |
| Uluhlu | `[1, 2, 3]` | `##]` | Zonke izinto zohlobo olufanayo |
| Tupel | `(a, b)` | `##)` | Ngomgangatho |
| Tupel enegama | `(x: 1, y: 2)` | `##)` | Ukufikelela ngegama okanye ngenombolo |

```zymbol
// Ukuhlola uhlobo — ibuya (uhlobo, iinombolo, ixabiso)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Umxholo nokuNgenisa

```zymbol
>> "Molo" ¶                       // ¶ okanye \\ unika umgca omtsha obhaliweyo
>> "a=" a " b=" b ¶               // izihloko ezininzi ngokubekana
>> (uluhlu$#) ¶                   // ii-operator zokugqibela zifuna izibiyeli

<< igama                          // ngaphandle kwesikhokelo — ifunda kwinguqu
<< "Igama lakho? " igama          // nesikhokelo
```

> `¶` okanye `\\` zilingana njengomgca omtsha.

---

## Abaqhubi

```zymbol
// Izibalo — sebenzisa ukumiselwa; ezinye ii-operator zinazo iingxaki ngqo ku->>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (ukwahlula kwezinombolo ezipheleleyo)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (amandla)

// Ukuthelekisa
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Ingqiqo
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Iimigca

```zymbol
// Iindlela ezintathu zokudibana
igama = "Ana"
n = 42

umyalezo = "Molo ", igama, "!"            // ikoma — kwimithetho
>> "Molo " igama " uneminyaka " n ¶       // ukubekana — ku->>
incaciso = "Molo {igama}, uneminyaka {n}" // ukuphinda — kwimeko nayiphi na
```

```zymbol
s = "Molo Hlabathi"
ubude = s$#                  // 13
ingxenye = s$[0..4]          // "Molo"  (ukuphela akufakiwe)
unayo = s$? "Hlabathi"       // #1
izahlulo = "a,b,c,d" / ','   // [a, b, c, d]
tshintsha = s$~~["o":"O"]    // tshintsha zonke
tshintsha1 = s$~~["o":"O":1] // N yokuqala kuphela
```

> `+` iyasetyenziswa kwiinombolo kuphela. Sebenzisa `,`, ukubekana, okanye ukuphinda kwizigama.

---

## uLawulo lweSikhephe

```zymbol
x = 7

? x > 0 { >> "ngenxa" ¶ }

? x > 100 {
    >> "nkulu" ¶
} _? x > 0 {
    >> "ngenxa" ¶
} _? x == 0 {
    >> "iqanda" ¶
} _ {
    >> "ngesantya" ¶
}
```

> Iibhloko `{ }` **ziyafuneka**, nangona ngokomgca omnye.

---

## Match

```zymbol
// Izikhala
inombolo = 85
uvavanyo = ?? inombolo {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> uvavanyo ¶    // → B

// Iimigca
umbala = "bomvu"
ikhodi = ?? umbala {
    "bomvu"   : "#FF0000"
    "luhlaza" : "#00FF00"
    _         : "#000000"
}

// Izikhuseli
ubushushu = -5
imeko = ?? ubushushu {
    _? ubushushu < 0  : "qabaka"
    _? ubushushu < 20 : "banda"
    _? ubushushu < 35 : "fudumele"
    _                 : "shushu"
}
>> imeko ¶    // → qabaka

// Uhlobo lwentetho (iingalo zebhloko)
?? n {
    0       : { >> "iqanda" ¶ }
    _? n < 0: { >> "ngesantya" ¶ }
    _       : { >> "ngenxa" ¶ }
}
```

---

## Izijikelezi

```zymbol
@ i:0..4  { >> i " " }        // isikhala esithe qelele: 0 1 2 3 4
@ i:1..9:2 { >> i " " }       // enyathelo: 1 3 5 7 9
@ i:5..0:1 { >> i " " }       // esibuyayo: 5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (ngelixa)

iziqhamo = ["Apile", "Umcimbi", "Igilivane"]
@ isiqhamo:iziqhamo { >> isiqhamo ¶ }  // kwinto nganye

@ u:"molo" { >> u "-" }
>> ¶                          // → m-o-l-o-  (kwinobumba nganye)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> qhubeka
    ? i > 7 { @! }             // @! yeka
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Isijikelezi esingenakuphela
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Isijikelezi segama (yeka ngaphakathi)
isibalwa = 0
@ @ngaphandle {
    isibalwa++
    ? isibalwa >= 3 { @! ngaphandle }
}
>> isibalwa ¶                 // → 3
```

---

## IiNto eziSebenzayo

```zymbol
hlela(a, b) { <~ a + b }
>> hlela(3, 4) ¶    // → 7

isixa(inombolo) {
    ? inombolo <= 1 { <~ 1 }
    <~ inombolo * isixa(inombolo - 1)
}
>> isixa(5) ¶    // → 120
```

Imisebenzi inamazwe ahlukanisiweyo — ayifikeleli iziguqu zangaphandle. Sebenzisa iipharamitha eziphuma `<~` ukuguqula iziguqu zomemezeli:

```zymbol
tshintsha(a<~, b<~) {
    ixeshana = a
    a = b
    b = ixeshana
}
x = 10
y = 20
tshintsha(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Imisebenzi enegama ayizizo izixhobo zexabiso lokuqala. Ukudlulisa njengempikiswano: `x -> igama(x)`.

---

## Lambda neziValo

```zymbol
kabini = x -> x * 2
isums = (a, b) -> a + b
>> kabini(5) ¶    // → 10
>> isums(3, 7) ¶  // → 10

// Lambda enebhloko
ukuhlela = x -> {
    ? x > 0 { <~ "ngenxa" }
    _? x < 0 { <~ "ngesantya" }
    <~ "iqanda"
}

// IziValo — athatha iziguqu zangaphandle
umlinganiselo = 3
kathathu = x -> x * umlinganiselo
>> kathathu(7) ¶    // → 21

// Ifektri yemisebenzi
yenza_umdibanisi(n) { <~ x -> x + n }
dibanisa10 = yenza_umdibanisi(10)
>> dibanisa10(5) ¶    // → 15

// Kuluhlu
imienzo = [x -> x+1, x -> x*2, x -> x*x]
>> imienzo[2](5) ¶    // → 25
```

---

## Uluhlu

```zymbol
uluhlu = [1, 2, 3, 4, 5]

uluhlu[0]          // 1 — ukufikelela (inombolo esiqalweni ngu-0)
uluhlu[-1]         // 5 — inombolo emva (yokugqibela)
uluhlu$#           // 5 — ubude (sebenzisa (uluhlu$#) ku->>)

uluhlu = uluhlu$+ 6            // ukongeza → [1,2,3,4,5,6]
uluhlu2 = uluhlu$+[2] 99       // faka kwi-inombolo 2
uluhlu3 = uluhlu$- 3           // susa ukuvela kokuqala kwexabiso
uluhlu4 = uluhlu$-- 3          // susa konke ukuvela
uluhlu5 = uluhlu$-[0]          // susa kwi-inombolo
uluhlu6 = uluhlu$-[1..3]       // susa isikhala (ukuphela akufakiwe)

kukhona = uluhlu$? 3            // #1 — uqulathe
iindawo = uluhlu$?? 3           // [2] — zonke iinombolo zexabiso
sl = uluhlu$[0..3]              // [1,2,3] — isiqephu (ukuphela akufakiwe)
sl2 = uluhlu$[0:3]              // [1,2,3] — uhlobo lwenani

enyuka = uluhlu$^+              // ihlelelwe kwe-ascending (primitives kuphela)
yehlela = uluhlu$^-             // ihlelelwe kwe-descending (primitives kuphela)

// Uluhlu lwetupel — sebenzisa $^ nelelembu lokuthelekisa
idatha = [(igama: "Carla", iminyaka: 28), (igama: "Ana", iminyaka: 25), (igama: "Bob", iminyaka: 30)]
ngeminyaka  = idatha$^ (a, b -> a.iminyaka < b.iminyaka)    // ascending ngeminyaka
negama = idatha$^ (a, b -> a.igama > b.igama)               // descending negama
>> ngeminyaka[0].igama ¶     // → Ana
>> negama[0].igama ¶         // → Carla

uluhlu[1] = 99               // buyekeza endaweni
uluhlu = uluhlu[1]$~ 99      // buyekeza ngomsebenzi — ibuya uluhlu olutsha
```

> Zonke ii-operator zokuqokelela zibuya **uluhlu olutsha**. Phinda unikezele: `uluhlu = uluhlu$+ 4`.
> Ii-operator azikwazi ukuxhomeka — sebenzisa imibophelelo emibini ehlukanisiweyo.
> `$^+` / `$^-` zihlela **izinhlu zamaprimitive** (iinombolo, imigca). Kwizinhlu zetupel sebenzisa `$^` nelelembu lokuthelekisa — inhloso ikhona kulelembu (`<` = ascending, `>` = descending).

```zymbol
// Uluhlu olufakwe phakathi
imetriksi = [[1,2,3],[4,5,6],[7,8,9]]
>> imetriksi[1][2] ¶    // → 6
```

---

## Ukuhlula

```zymbol
// Uluhlu
uluhlu = [10, 20, 30, 40, 50]
[a, b, c] = uluhlu               // a=10  b=20  c=30
[lokuqala, *elinye] = uluhlu     // lokuqala=10  elinye=[20,30,40,50]
[x, _, z] = [1, 2, 3]            // _ ilahliwe

// Tupel wendawo
iqhwelo = (100, 200)
(px, py) = iqhwelo               // px=100  py=200

// Tupel enegama
umntu = (igama: "Ana", iminyaka: 25, isixeko: "Gqeberha")
(igama: g, iminyaka: m) = umntu  // g="Ana"  m=25
```

---

## Tupel

```zymbol
// Ngomgangatho
iqhwelo = (10, 20)
>> iqhwelo[0] ¶    // → 10

// Enegama
umntu = (igama: "Alice", iminyaka: 25)
>> umntu.igama ¶    // → Alice
>> umntu[0] ¶       // → Alice  (inombolo iyasebenza nawe)

// Efakwe phakathi
indawo = (x: 10, y: 20)
p = (indawo: indawo, isihloko: "izikhala")
>> p.indawo.x ¶    // → 10
```

---

## IiNto eziSebenzayo zeNqanaba eliPhezulu

> Ii-operator ze-HOF zifuna **i-lambda ye-inline** — akukho inguqu ye-lambda ethe ngqo.

```zymbol
iinombolo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

kabini      = iinombolo$> (x -> x * 2)                // map  → [2,4,6…20]
amaphepha   = iinombolo$| (x -> x % 2 == 0)            // filter → [2,4,6,8,10]
isums       = iinombolo$< (0, (uqokeleli, x) -> uqokeleli + x)  // reduce → 55

// Ukuxhuma ngezigaba
isigaba1 = iinombolo$| (x -> x > 3)
isigaba2 = isigaba1$> (x -> x * x)
>> isigaba2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Imisebenzi enegama ku-HOF — ibiyela ku-lambda
kabini_f(x) { <~ x * 2 }
r = iinombolo$> (x -> kabini_f(x))    // ✅
```

---

## Umqhubi Wepayiphi

Uhlangothi lwesokudla luhlala ludinga `_` njengesibambelo sexabiso elidlulisiweyo:

```zymbol
kabini = x -> x * 2
dibanisa = (a, b) -> a + b
dibanisa_ibe = x -> x + 1

5 |> kabini(_)              // → 10
10 |> dibanisa(_, 5)        // → 15
5 |> dibanisa(2, _)         // → 7

// Ukuxhuma
r = 5 |> kabini(_) |> dibanisa_ibe(_) |> kabini(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## uLawulo lweNgxaki

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "ukwahlula ngo-qanda" ¶
} :! {
    >> "enye impazamo: " _err ¶    // _err ibambe umlayezo wempazamo
} :> {
    >> "ihlala isebenza" ¶
}
```

| Uhlobo | Xa kwenzeka |
|--------|-------------|
| `##Div` | Ukwahlula ngo-qanda |
| `##IO` | Ifayile / Uhlelo |
| `##Index` | Inombolo ingaphandle |
| `##Type` | Impazamo yohlobo |
| `##Parse` | Impazamo yokufunda |
| `##Network` | Impazamo yenethiwekhi |
| `##_` | Nayiphi na impazamo (catch-all) |

---

## IiModyuli

```zymbol
// lib/calc.zy
# calc

#> { hlela, fumana_PI }    // Ukuthumela NGAPHAMBI kwezinto ezichaziweyo

_PI := 3.14159
hlela(a, b) { <~ a + b }
fumana_PI() { <~ _PI }
```

```zymbol
// main.zy
<# ./lib/calc <= c    // I-alias iyafuneka

>> c::hlela(5, 3) ¶   // → 8
pi = c::fumana_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Thumela negama lomphakathi elikhethiweyo
# umtapo_wolwazi
#> { _hlela_ngaphakathi <= isums }

_hlela_ngaphakathi(a, b) { <~ a + b }
```

```zymbol
<# ./umtapo_wolwazi <= u

>> u::isums(3, 4) ¶    // → 7  (igama langaphakathi _hlela_ngaphakathi lifihlwe)
```

---

## Abaqhubi Bedata

```zymbol
// Guqula umxholo ube inombolo
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (okhuselekileyo, akukho mpazamo)

// Yenqamla / sika
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (yenqamla kwiindawo ezimbini zamadesimu)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (sika)

// Ukwakheka kwenombolo
fmt = #,|1234567|      // → 1,234,567  (yahlulwa ngekhoma)
sci = #^|12345.678|    // → 1.2345678e4  (sayensi)

// Izinombolo zomsonto
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Ukukhuphulelwa kokuguqulwa komsonto
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Ukudityaniswa kweShell

```zymbol
umhla = <\ date +%Y-%m-%d \>     // ibamba i-stdout (equkethe \n yokugqibela)
>> "Namhlanje: " umhla

ifayile = "data.txt"
okuqulethwe = <\ cat {ifayile} \>  // ukuphinda kwimiyalelo

okuphuma = </"./iskripthi_elincinci.zy"/>  // qalisa iskripthi se-Zymbol elinye, bamba okuphuma
>> okuphuma
```

> `><` ibamba iimpikiswano ze-CLI njengesohlu lwemigca (tree-walker kuphela).

---

## Umzekelo opheleleyo: FizzBuzz

```zymbol
hlela(inombolo) {
    ? inombolo % 15 == 0 { <~ "FizzBuzz" }
    _? inombolo % 3  == 0 { <~ "Fizz" }
    _? inombolo % 5  == 0 { <~ "Buzz" }
    _ { <~ inombolo }
}

@ i:1..20 { >> hlela(i) ¶ }
```

---

## Isalathisi seeMpawu

| Impawu | Umsebenzi | Impawu | Umsebenzi |
|--------|-----------|--------|-----------|
| `=` | inguqu | `$#` | ubude |
| `:=` | constant | `$+` | ukongeza |
| `>>` | ukukhipha | `$+[i]` | faka kwi-inombolo |
| `<<` | ukungena | `$-` | susa okuqala ngexabiso |
| `¶` / `\\` | umgca omtsha | `$--` | susa konke ngexabiso |
| `?` | ukuba (if) | `$-[i]` | susa kwi-inombolo |
| `_?` | ukuba enye (elif) | `$-[i..j]` | susa isikhala |
| `_` | enye / indawo | `$?` | uqulathe |
| `??` | match | `$??` | fumana zonke iinombolo |
| `@` | isijikelezi | `$[s..e]` | isiqephu |
| `@!` | yeka (break) | `$>` | map |
| `@>` | qhubeka (continue) | `$\|` | filter |
| `->` | lambda | `$<` | reduce |
| `$^+` | hlela kwe-ascending (primitives) | `$^-` | hlela kwe-descending (primitives) |
| `$^` | hlela ngokuthelekisa (tupel) | | |
| `<~` | buyela (return) | `!?` | zama (try) |
| `\|>` | payiphi | `:!` | bamba (catch) |
| `#1` | unyaniso (true) | `:>` | hlala (finally) |
| `#0` | ubuxoki (false) | `$!` | yimpazamo |
| `<#` | ngenisa (import) | `$!!` | sasa impazamo |
| `#` | xela imodyuli | `#>` | thumela (export) |
| `::` | biza imodyuli | `.` | fikelela intsimi |
| `#\|..\|` | guqula inombolo | `#?` | metadata yohlobo |
| `#.N\|..\|` | yenqamla | `#!N\|..\|` | sika |
| `c\|..\|` | ukwakheka kwekhoma | `e\|..\|` | sayensi |
| `<\ ..\>` | qalisa i-shell | `>\<` | iimpikiswano ze-CLI |

---

*Zymbol-Lang — Iimpawu. YeHlabathi. Ayitshintshi.*

> **Ingxelo:** Le ncwadi yenziwe yahunyushwa ngubuchule bobuchwephesha be-AI.
> Ngokukhulu ukuzinikela kwenziwa ukuqinisekisa ukuchaneka, kodwa amanye amagama okanye imizekelo angazinza iimpazamo.
> Isalathisi esibalulekiyo si-[MANUAL.md](https://github.com/zymbol-lang/interpreter) ku-interpreter repository.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> The canonical reference is [MANUAL.md](https://github.com/zymbol-lang/interpreter) in the interpreter repository.
