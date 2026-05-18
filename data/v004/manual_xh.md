> **Isaziso:** Olu xwebhu lwenziwe ngoncedo lwengqondo eyenziweyo (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Isalathiso esisemthethweni yi **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** kwindawo yokugcina itoliki.

---

# Isikhokelo seZymbol-Lang

**Zymbol-Lang** lulwimi lwenkqubo olusemqondweni. Akukho magama angundoqo — yonke into luphawu. Lusebenza ngendlela efanayo kulo naluphi na ulwimi lomntu.

- Akukho `if`, `while`, `return` — kuphela `?`, `@`, `<~`
- Unicode epheleleyo — izichongi kulo naluphi na ulwimi okanye i-emoji
- Ayixhomekanga kulwimi lomntu — ikhowudi iyafana kuyo yonke indawo

**Uguqulelo lwetoliki**: v0.0.4 | **Ukugubungela uvavanyo**: 393/393 (ukulingana kweTW ↔ VM)

---

---

## Izinto eziguquguqukayo neziZinzileyo

```zymbol
x = 10              // into eguquguqukayo eguqukayo
PI := 3.14159       // into ezingaguqukiyo — ukwabela kwakhona yimpazamo yexesha lokusebenza
igama = "Alice"
isebenzayo = #1      // Boolean eyinyani
👋 := "Molo"
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

## Iindidi Zedatha

| Uhlobo | Ubhalo oluqhelekileyo | Ithegi `#?` | Amanqaku |
|--------|------------------------|-------------|----------|
| Inani elipheleleyo | `42`, `-7` | `###` | 64-bit esayiniweyo |
| Inani elidadayo | `3.14`, `1.5e10` | `##.` | Ubhalo lwenzululwazi luvumelekile |
| Umtya | `"umbhalo"` | `##"` | Ukufakelwa: `"Molo {igama}"` |
| Uhambo | `'A'` | `##'` | Uhambo olunye lweUnicode |
| Boolean | `#1`, `#0` | `##?` | ASIngamanani — `#1 ≠ 1` |
| Uluhlu | `[1, 2, 3]` | `##]` | Izinto ezifanayo |
| Ityuphu | `(a, b)` | `##)` | Ngokwendawo |
| Ityuphu enegama | `(x: 1, y: 2)` | `##)` | Amasimi anegama |
| Umsebenzi | isalathiso somsebenzi onedigama | `##()` | Inqanaba lokuqala; ibonisa `<funct/N>` |
| Iambda | `x -> x * 2` | `##->` | Inqanaba lokuqala; ibonisa `<lambd/N>` |

```zymbol
// Uhlolo lobuchule — ibuyisela (uhlobo, amanani, ixabiso)
imeta = 42#?
>> imeta ¶         // → (###, 2, 42)
t = imeta[1]
>> t ¶            // → ###
```

---

---

## Imveliso kunye neNgeniso

```zymbol
>> "Molo" ¶                       // ¶ okanye \\ kumgca omtsha ocacileyo
>> "a=" a " b=" b ¶               // ukubeka ecaleni — amaxabiso amaninzi
>> (arr$#) ¶                      // abasebenzi be-postfix bafuna ( ) ngaphakathi >>

<< igama                           // funda kwinto eguquguqukayo (ngaphandle kwesicelo)
<< "Faka igama lakho: " igama      // ngesicelo
```

> `¶` (AltGr+R kwibhodi yezitshixo yaseSpain) kunye `\\` ziyafana kumgca omtsha.

---

## Abasebenzi

```zymbol
// Izibalo — sebenzisa izabelo; abasebenzi abathile banezinto ezingaqhelekanga ngokuthe ngqo ngaphakathi >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (ukwahlulahlula inani elipheleleyo)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (ukunyusela amandla)

// Ukuthelekisa
a == b    // #0    
a <> b    // #1    
a < b     // #0
a <= b    // #0   
a > b     // #1    
a >= b    // #1

// Ingqiqo
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Imitya

```zymbol
// Iindlela ezimbini zokudibanisa
igama = "Alice"
n = 42

>> "Molo " igama " unayo " n ¶       // ukubeka ecaleni — ngaphakathi >>
inkcazo = "Molo {igama}, unayo {n}"   // ukufakelwa — naphi na
```

```zymbol
s = "Molo Lizwe"
ubude = s$#                  // 9
isahluko = s$[1..4]          // "Molo"  (isiseko-1, isiphelo siqukiwe)
ikhona = s$? "Lizwe"         // #1
iziqwenga = "a,b,c,d"$/ ','  // [a, b, c, d]  (sahlula ngesahluli)
itshintshiwe = s$~~["a":"o"] // "Molo Lizwo"
itshintshiwe1 = s$~~["a":"o":1] // "Molo Lizwo" (ii-N zokuqala kuphela)
```

> `+` yeyamanani kuphela. Kwimitya, sebenzisa `,`, ukubeka ecaleni, okanye ukufakelwa.

---

---

## Ukuhamba kolawulo

```zymbol
x = 7

? x > 0 { >> "ulungile" ¶ }

? x > 100 {
    >> "ikhulu" ¶
} _? x > 0 {
    >> "ulungile" ¶
} _? x == 0 {
    >> "uziro" ¶
} _ {
    >> "ugwenxa" ¶
}
```

> Iibrachethi ezigobileyo `{ }` **ziyanyanzeleka** nokuba kwingxelo enye.

---

---

## Ukudibanisa (Match)

```zymbol
// Imida
amanqaku = 85
ibakala = ?? amanqaku {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> ibakala ¶     // → B

// Imitya
umbala = "bomvu"
ikhowudi = ?? umbala {
    "bomvu"  : "#FF0000"
    "luhlaza" : "#00FF00"
    _        : "#000000"
}

// Iipatheni zokuthelekisa
ubushushu = -5
imeko = ?? ubushushu {
    < 0  : "umkhenkce"
    < 20 : "ingqele"
    < 35 : "kufudumele"
    _    : "kushushu"
}
>> imeko ¶       // → umkhenkce

// Uhlobo lwengxelo (iibhloko)
?? n {
    0        : { >> "uziro" ¶ }
    _? n < 0 : { >> "ugwenxa" ¶ }
    _        : { >> "ulungile" ¶ }
}
```

---

## Imijikelo

```zymbol
@ i:0..4  { >> i " " }        // umda obandakanyiweyo:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // ngenyathelo:          1 3 5 7 9
@ i:5..0:1 { >> i " " }       // umva:                 5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (ngoxa)

iziqhamo = ["apile", "ipeyile", "umdiliya"]
@ i:iziqhamo { >> i ¶ }       // kwinto nganye kuluhlu

@ u:"molo" { >> u "-" }
>> ¶                          // → m-o-l-o-  (kuhambo ngalunye kumtya)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> qhubeka
    ? i > 7 { @! }            // @! yaphula
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Umjikelo ongapheliyo
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Umjikelo oneleyibhile (ukwaphula okuzinzileyo)
isibali = 0
@:ngaphandle {
    isibali++
    ? isibali >= 3 { @:ngaphandle! }
}
>> isibali ¶                  // → 3
```

---

---

## Imisebenzi

```zymbol
dibanisa(a, b) { <~ a + b }
>> dibanisa(3, 4) ¶   // → 7

i-factor(n) {
    ? n <= 1 { <~ 1 }
    <~ n * i-factor(n - 1)
}
>> i-factor(5) ¶      // → 120
```

Imisebenzi in **umda owahlukileyo** — ayikwazi ukufunda izinto ezigugileyo zangaphandle. Sebenzisa iiparamitha zemveliso `<~>` ukuguqula izinto eziguquguqukayo zomenzi wefoni:

```zymbol
tshintshana(a<~, b<~) {
    okwethutyana = a
    a = b
    b = okwethutyana
}
x = 10
y = 20
tshintshana(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Imisebenzi enegama **ngamaxabiso enqanaba lokuqala** — thumela ngokuthe ngqo: `amanani$> phinda kabini`. `x -> fn(x)` nayo isebenza.

---

---

## Iambda kunye nokuValwa

```zymbol
phinda kabini = x -> x * 2
dibanisa = (a, b) -> a + b
>> phinda kabini(5) ¶   // → 10
>> dibanisa(3, 7) ¶     // → 10

// Ibhloko yeambda
hlela = x -> {
    ? x > 0 { <~ "ulungile" }
    _? x < 0 { <~ "ugwenxa" }
    <~ "uziro"
}

// Ukuvalwa — ibamba umda wangaphandle
into = 3
phinda kathathu = x -> x * into
>> phinda kathathu(7) ¶   // → 21

// Umzi-mveliso
yenza-isidityanisi(n) { <~ x -> x + n }
dibanisa-ishumi = yenza-isidityanisi(10)
>> dibanisa-ishumi(5) ¶    // → 15

// Kuluhlu
imisebenzi = [x -> x+1, x -> x*2, x -> x*x]
>> imisebenzi[3](5) ¶      // → 25
```

---

## Uluhlu

Uluhlu **luyaguquguquka** kwaye luqulethe izinto **zohlobo olufanayo**.

```zymbol
uluhlu = [1, 2, 3, 4, 5]

uluhlu[1]          // 1 — ukufikelela (isiseko-1: into yokuqala)
uluhlu[-1]         // 5 — isalathiso esingalunganga (into yokugqibela)
uluhlu$#           // 5 — ubude (sebenzisa (uluhlu$#) ngaphakathi >>)

uluhlu = uluhlu$+ 6            // dibanisa → [1,2,3,4,5,6]
uluhlu2 = uluhlu$+[2] 99       // faka kwindawo yesi-2 (isiseko-1)
uluhlu3 = uluhlu$- 3           // susa ukubonakala kokuqala kwexabiso
uluhlu4 = uluhlu$-- 3          // susa konke ukubonakala
uluhlu5 = uluhlu$-[1]          // susa kwisalathiso 1 (into yokuqala)
uluhlu6 = uluhlu$-[2..3]       // susa umda (isiseko-1, isiphelo siqukiwe)

ikhona = uluhlu$? 3            // #1 — inayo
izikhundla = uluhlu$?? 3       // [3] — zonke izalathiso zexabiso (isiseko-1)
isiqwenga = uluhlu$[1..3]      // [1,2,3] — isiqwenga (isiseko-1, isiphelo siqukiwe)
isiqwenga2 = uluhlu$[1:3]      // [1,2,3] — kuyafana, isintaksi esekwe kwinani

ukunyuka = uluhlu$^+           // cwangcisa ukunyuka (izinto ezisisiseko kuphela)
ukuhla = uluhlu$^-             // cwangcisa ukuhla (izinto ezisisiseko kuphela)

// Uluhlu lweetyuphu ezinamagama/ngokwendawo — sebenzisa $^ ngeambda yokuthelekisa
idatha = [(igama: "Carla", iminyaka: 28), (igama: "Ana", iminyaka: 25), (igama: "Bob", iminyaka: 30)]
ngokweminyaka   = idatha$^ (a, b -> a.iminyaka < b.iminyaka)   // ukunyuka ngokweminyaka (<)
ngokwegama   = idatha$^ (a, b -> a.igama > b.igama)         // ukuhla ngokwegama (>)
>> ngokweminyaka[1].igama ¶   // → Ana
>> ngokwegama[1].igama ¶      // → Carla

// Uhlaziyo oluthe ngqo lwento (uluhlu kuphela)
uluhlu[1] = 99              // yabela
uluhlu[2] += 5              // oludityanisiweyo: +=  -=  *=  /=  %=  ^=

// Uhlaziyo olusebenzayo — ibuyisela uluhlu olutsha; eyokuqala ayitshintshi
uluhlu2 = uluhlu[2]$~ 99
```

> Bonke abasebenzi bengqokelela babuyisela **uluhlu olutsha**. Yabela kwakhona: `uluhlu = uluhlu$+ 4`.
> `$+` ingadityaniswa: `uluhlu = uluhlu$+ 5$+ 6$+ 7`. Abanye abasebenzi basebenzisa izabelo eziphakathi.
> **Isalathiso sisiseko-1**: `uluhlu[1]` yinto yokuqala; `uluhlu[0]` yimpazamo yexesha lokusebenza.
> `$^+` / `$^-` icwangcisa **uluhlu lwezinto ezisisiseko** (amanani, imitya). Kuluhlu lweetyuphu, sebenzisa $^ ngeambda yokuthelekisa — isalathiso sifakwe kwiiambda (`<` = ukunyuka, `>` = ukuhla).

**Isemantiki yexabiso** — ukwabela uluhlu kwenye into eguquguqukayo kudala ikopi ezimeleyo:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ayichaphazelekanga
```

```zymbol
// Uluhlu oluzinzileyo (isalathiso sisiseko-1)
imatrix = [[1,2,3],[4,5,6],[7,8,9]]
>> imatrix[2][3] ¶    // → 6  (umqolo 2, ikholamu 3)
```

---

---

## Ukuqhawulwa

```zymbol
// Uluhlu
uluhlu = [10, 20, 30, 40, 50]
[a, b, c] = uluhlu               // a=10  b=20  c=30
[eyokuqala, *intsalela] = uluhlu // eyokuqala=10  intsalela=[20,30,40,50]
[x, _, z] = [1, 2, 3]          // _ iyayikhangela

// Ityuphu ngokwendawo
inqaku = (100, 200)
(px, py) = inqaku              // px=100  py=200

// Ityuphu enegama
umntu = (igama: "Ana", iminyaka: 25, isixeko: "Madrid")
(igama: i, iminyaka: im) = umntu   // i="Ana"  im=25
```

---

## Iityuphu

Iityuphu zizikhongozeli **ezingagungqiyo** ezilandelelaneyo ezinokugcina amaxabiso **eendidi ezahlukeneyo**.
Ngokwahlukileyo kuluhlu, izinto azinakuguqulwa emva kokudalwa.

```zymbol
// Ngokwendawo — iindidi ezixubeneyo zivumelekile
inqaku = (10, 20)
>> inqaku[1] ¶     // → 10

idatha = (42, "molo", #1, 3.14)
>> idatha[3] ¶      // → #1

// Enegama
umntu = (igama: "Alice", iminyaka: 25)
>> umntu.igama ¶     // → Alice
>> umntu[1] ¶        // → Alice  (isalathiso nayo iyasebenza, isiseko-1)

// Ezizinzileyo
indawo = (x: 10, y: 20)
p = (indawo: indawo, ileyibhile: "imvelaphi")
>> p.indawo.x ¶      // → 10
```

**Ukungaguquguquki** — nayiphi na imizamo yokuguqula into yetyuphu yimpazamo yexesha lokusebenza:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ impazamo yexesha lokusebenza: iityuphu aziguquki
// t[1] += 5    // ❌ impazamo efanayo

// Ityuphu enegama — yakha kwakhona ngokucacileyo
umntu = (igama: "Alice", iminyaka: 25)
ukhulu = (igama: umntu.igama, iminyaka: 26)
>> umntu.iminyaka ¶   // → 25
>> ukhulu.iminyaka ¶  // → 26
```

Ukufumana ixabiso eligqibeleleyo, sebenzisa `$~` (uhlaziyo olusebenzayo) — ibuyisela ityuphu **entsha**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← eyokuqala ayitshintshanga
>> t2 ¶    // → (10, 999, 30)
```

---

---

## Imisebenzi yenqanaba eliphezulu

```zymbol
amanani = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ziphindwe kabini = amanani$> (x -> x * 2)               // imephu → [2,4,6…20]
amanani-juu   = amanani$| (x -> x % 2 == 0)            // isihluzi → [2,4,6,8,10]
izonke    = amanani$< (0, (uqokelelo, x) -> uqokelelo + x) // ukunciphisa → 55

// Ukudibanisa ngeendlela eziphakathi
inyathelo1 = amanani$| (x -> x > 3)
inyathelo2 = inyathelo1$> (x -> x * x)
>> inyathelo2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Imisebenzi enegama ingathunyelwa ngokuthe ngqo kwimisebenzi yenqanaba eliphezulu
phinda kabini(x) { <~ x * 2 }
ngaba ikhulu(x) { <~ x > 5 }
r = amanani$> phinda kabini       // ✅ isalathiso esithe ngqo
r = amanani$| ngaba ikhulu        // ✅ isalathiso esithe ngqo
```

---

---

## Umsebenzi wombhobho

Icala lasekunene lihlala lifuna `_` njengendawo yokubamba yexabiso elibhobhileyo:

```zymbol
phinda kabini = x -> x * 2
dibanisa = (a, b) -> a + b
yongeza = x -> x + 1

5 |> phinda kabini(_)        // → 10
10 |> dibanisa(_, 5)         // → 15
5 |> dibanisa(2, _)          // → 7

// Ukudityaniswa
r = 5 |> phinda kabini(_) |> yongeza(_) |> phinda kabini(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Ukuphathwa kweempazamo

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "ukwahlulahlula ngo-zero" ¶
} :! {
    >> "enye impazamo: " _err ¶    // _err igcina umyalezo wempazamo
} :> {
    >> "ihlala isebenza" ¶
}
```

| Uhlobo | Nini |
|--------|------|
| `##Div` | Ukwahlulahlula ngo-zero |
| `##IO` | Ifayile / inkqubo |
| `##Index` | Isalathiso ngaphandle kwemida |
| `##Type` | Ukungangqinelani kohlobo |
| `##Parse` | Ukuhlalutya idatha |
| `##Network` | Iimpazamo zenethiwekhi |
| `##_` | Nayiphi na impazamo (ibamba zonke) |

---

---

## Iimodyuli

```zymbol
// lib/calc.zy — umzimba wemodyuli ungaphakathi kwebhrakethi
# calc {
    #> { dibanisa, get_PI }

    _PI := 3.14159
    dibanisa(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // isiteketiso siyanyanzeleka

>> c::dibanisa(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Thumela ngegama elahlukileyo loluntu
# ilayibrari_yam {
    #> { _dibanisa_ngaphakathi <= isishwankathelo }

    _dibanisa_ngaphakathi(a, b) { <~ a + b }
}
```

```zymbol
<# ./ilayibrari_yam <= m

>> m::isishwankathelo(3, 4) ¶    // → 7  (igama langaphakathi _dibanisa_ngaphakathi lifihliwe)
```

> **Imigaqo yemodyuli**: ngaphakathi `# igama { }`, kuphela `#>`, iinkcazelo zomsebenzi, kunye neziqalisi zezinto eziguquguqukayo/ezingaguqukiyo eziqhelekileyo zivumelekile. Iinkcazo eziphunyezwayo (`>>`, `<<`, imijikelo, njl.) zibangela impazamo E013.

---

---

## Iimowudi zamanani

IZymbol ingabonisa amanani **kwiibhloko ezingama-69 zedijithi zeUnicode** — i-Devanagari, isiArabhu-Indiya, isiThai, i-Klingon pIqaD, iMathematika enobunkunkqele, amacandelo e-LCD, nokunye. Imowudi esebenzayo ichaphazela kuphela imveliso `>>`; izibalo zangaphakathi zihlala ziyi-binary.

### Ukusebenzisa iskripthi

Bhala iidijithi `0` kunye `9` zescript ekujoliswe kuyo ngaphakathi `#…#`:

```zymbol
#०९#    // i-Devanagari   (U+0966–U+096F)
#٠٩#    // isiArabhu-Indiya (U+0660–U+0669)
#๐๙#    // isiThai        (U+0E50–U+0E59)
#09#    // setha kwakhona kwi-ASCII
```

---

### Imveliso kunye neeBoolean

```zymbol
x = 42
>> x ¶          // → 42   (i-ASCII emiselweyo)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (ichaphaza lokwahlulahlula lihlala liyi-ASCII)
>> 1 + 2 ¶      // → ३

// IiBoolean: isimaphambili # sihlala siyi-ASCII, idijithi iyazilungisa
>> #1 ¶         // → #१   (inyani kwi-Devanagari)
>> #0 ¶         // → #०   (ubuxoki — yahlukile ku ० inani elipheleleyo uziro)

x = 28 > 4
>> x ¶          // → #१   (isiphumo sokuthelekisa silandela imowudi esebenzayo)
```

---

## Iidijithi zemveli kwikhowudi yemvelaphi

Iidijithi zayo nayiphi na iskripthi exhaswayo zizibhalo ezisemthethweni — kwimida, kwimodyuli, ekuthelekisweni:

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

### Izibhalo eziqhelekileyo zeBoolean kuyo nayiphi na iskripthi

`#` + idijithi `0` okanye `1` kuyo nayiphi na ibhloko sisibhalo esisemthethweni seBoolean:

```zymbol
#०९#
isebenzayo = #१        // iyafana ne #1
>> isebenzayo ¶        // → #१
>> (#१ && #०) ¶        // → #०
```

> `#` **siyi-ASCII ngamaxesha onke**. `#0` (ubuxoki) sihlala sahluke ngokubonakalayo ku `0` (inani elipheleleyo uziro) kuyo yonke iskripthi.

---

---

## Abasebenzi beDatha

```zymbol
// Uguqulo lohlobo
##.42         // → 42.0  (kwiDada)
###3.7        // → 4     (kwiNani elipheleleyo, songela)
##!3.7        // → 3     (kwiNani elipheleleyo, sika)

// Hlalutya umtya ube linani
v1 = #|"42"|      // → 42  (Inani elipheleleyo)
v2 = #|"3.14"|    // → 3.14  (Idada)
v3 = #|"abc"|     // → "abc"  (ikhuselekile, akukho mpazamo)

// Songela / sika
i-pi = 3.14159265
songe i-2 = #.2|i-pi|     // → 3.14  (songela kwiindawo ezi-2 zokwahlulahlula)
songe i-4 = #.4|i-pi|     // → 3.1416
sika i-2 = #!2|i-pi|       // → 3.14  (sika)

// Ukufomatha amanani
ifomathi = #,|1234567|   // → 1,234,567  (yahlulwe ngekoma)
inzululwazi = #^|12345.678| // → 1.2345678e4  (inzululwazi)

// Izibhalo eziqhelekileyo zesiseko
a = 0x41         // → 'A'  (i-hexadecimal)
b = 0b01000001   // → 'A'  (i-binary)
c = 0o101        // → 'A'  (i-octal)

// Imveliso yoguqulo lwesiseko
i-hex = 0x|255|   // → "0x00FF"
i-bin = 0b|65|    // → "0b1000001"
i-oct = 0o|8|     // → "0o10"
i-dec = 0d|255|   // → "0d0255"
```

---

---

## Ukudityaniswa kweShell

```zymbol
umhla = <\ date +%Y-%m-%d \>     // ibamba i-stdout (iquka \n ekugqibeleni)
>> "Namhlanje: " umhla

ifayile = "idatha.txt"
umxholo = <\ cat {ifayile} \>      // ukufakelwa kwimiyalelo

imveliso = </"./subscript.zy"/>    // sebenzisa esinye iskripthi seZymbol, ibambe imveliso
>> imveliso
```

> `><` ibamba iimpikiswano zeCLI njengoluhlu lwemitya (kuphela kumhambi womthi).

---

---

## Umzekelo opheleleyo: FizzBuzz

```zymbol
hlela(inani) {
    ? inani % 15 == 0 { <~ "FizzBuzz" }
    _? inani % 3  == 0 { <~ "Fizz" }
    _? inani % 5  == 0 { <~ "Buzz" }
    _ { <~ inani }
}

@ i:1..20 { >> hlela(i) ¶ }
```

---

---

## Isalathiso seMpawu

| Uphawu | Umsebenzi | Uphawu | Umsebenzi |
|--------|-----------|--------|-----------|
| `=` | into eguquguqukayo | `$#` | ubude |
| `:=` | into ezingaguqukiyo | `$+` | dibanisa (iyadityaniswa) |
| `>>` | imveliso | `$+[i]` | faka kwisalathiso (isiseko-1) |
| `<<` | ingeniso | `$-` | susa eyokuqala ngokwexabiso |
| `¶` / `\\` | umgca omtsha | `$--` | susa zonke ngokwexabiso |
| `?` | ukuba | `$-[i]` | susa kwisalathiso (isiseko-1) |
| `_?` | ukungenjalo ukuba | `$-[i..j]` | susa umda (isiseko-1) |
| `_` | ukungenjalo / i-wildcard | `$?` | inayo |
| `??` | dibanisa | `$??` | fumana zonke izalathiso (isiseko-1) |
| `@` | umjikelo | `$[s..e]` | isiqwenga (isiseko-1) |
| `@ N { }` | umjikelo wama-N amaxesha | `$>` | imephu |
| `@!` | yaphula | `$|` | isihluzi |
| `@>` | qhubeka | `$<` | nciphisa |
| `@:igama { }` | umjikelo oneleyibhile | `$/ isahluli` | ukwahlulahlula umtya |
| `@:igama!` | yaphula eneleyibhile | `$++ a b c` | ukwakha ukudibanisa |
| `@:igama>` | qhubeka eneleyibhile | `uluhlu[i>j>k]` | isalathiso sokukhangela |
| `->` | iambda | `uluhlu[i] = ixabiso` | hlaziya into (uluhlu kuphela) |
| `uluhlu[i] += ixabiso` | uhlaziyo oludityanisiweyo | `uluhlu[i]$~` | uhlaziyo olusebenzayo (ikopi entsha) |
| `$^+` | cwangcisa ukunyuka (izinto ezisisiseko) | `$^-` | cwangcisa ukuhla (izinto ezisisiseko) |
| `$^` | cwangcisa ngesithelekisi (iityuphu) | `<~` | buyisela |
| `|>` | umbhobho | `!?` | zama |
| `:!` | bamba | `:>` | ekugqibeleni |
| `#1` | inyani | `#0` | ubuxoki |
| `$!` | yimpazamo | `$!!` | sasaza impazamo |
| `<#` | ngenisa | `#>` | thumela |
| `#` | chaza imodyuli | `::` | bniza imodyuli |
| `.` | ukufikelela kwindawo | `#?` | imethadatha yohlobo |
| `#\|..\|` | hlalutya inani | `##.` | guqula kwiDada |
| `###` | guqula kwiNani elipheleleyo (songela) | `##!` | guqula kwiNani elipheleleyo (sika) |
| `#.N\|..\|` | songela | `#!N\|..\|` | sika |
| `#,\|..\|` | ifomathi yekoma | `#^\|..\|` | inzululwazi |
| `#d0d9#` | tshintsha imowudi yamanani | `#09#` | setha kwakhona kwi-ASCII |
| `<\ ..\>` | sebenzisa ishell | `>\<` | iimpikiswano zeCLI |
| `\ var` | tshabalalisa into eguquguqukayo ngokucacileyo | | |

---

---

## Ingxelo yoTshintsho loKhupho

### v0.0.4 — Isalathiso sesiSeko-1, Imisebenzi yeNqanaba lokuQala & Iibhloko zeModyuli _(Epreli 2026)_

- **Ukwaphula** Zonke izalathiso zatshintshwa zaba **sisiseko-1** — `uluhlu[1]` yinto yokuqala; `uluhlu[0]` yimpazamo yexesha lokusebenza
- **Yongezwe** Imisebenzi enegama **ngamaxabiso enqanaba lokuqala** — thumela ngokuthe ngqo kwimisebenzi yenqanaba eliphezulu: `amanani$> phinda kabini`
- **Yongezwe** **Isintaksi yebhloko** yemodyuli iyanyanzeleka: `# igama { ... }` — isintaksi ethe tyaba isusiwe
- **Yongezwe** Isalathiso esinemilinganiselo emininzi: `uluhlu[i>j>k]` (ukukhangela), `uluhlu[p ; q]` (ukutsalwa okuthe tyaba)
- **Yongezwe** Uguqulo lohlobo: `##.intetho` (Idada), `###intetho` (Inani elipheleleyo songela), `##!intetho` (Inani elipheleleyo sika)
- **Yongezwe** Ukwahlulahlula umtya: `umtya$/ isahluli` — ibuyisela `Array(Umtya)`
- **Yongezwe** Ukwakha ukudibanisa: `isiseko$++ a b c` — yongeza izinto ezininzi
- **Yongezwe** Umjikelo wama-N amaxesha: `@ N { }` — phinda-phinda amaxesha N kanye
- **Yongezwe** Isintaksi yemijikelo eneleyibhile: `@:igama { }`, `@:igama!`, `@:igama>` — ithatha indawo ye `@ @igama` / `@! igama`
- **Yongezwe** Imigaqo yomda wento eguquguqukayo: izinto eziguquguqukayo `_igama` zinomda webhloko ochanekileyo; `\ var` itshabalalisa kwangoko
- **Yongezwe** Iipatheni zokuthelekisa zokudibanisa: `< 0 :`, `> 5 :`, `== 42 :`, njl.
- **Yongezwe** Impazamo yemodyuli E013: iinkcazo eziphunyezwayo kumzimba wemodyuli azivumelekanga
- **Yilungisiwe** `take_variable` ayisakonakalisi izinto ezingaguqukiyo zemodyuli ngexesha lokubhala umva
- **Yilungisiwe** `alias.CONST` ngoku isonjululwa ngokuchanekileyo; `#>` ingabonakala emva kweenkcazelo zomsebenzi
- **VM** Ukulingana okupheleleyo: iimvavanyo ezingama-393/393 ziyaphumelela

### v0.0.3 — Iinkqubo zeDijithi zeUnicode kunye nokuPhuculwa kweLSP _(Epreli 2026)_

- **Yongezwe** Iibhloko ezingama-69 zedijithi zeUnicode ezinophawu lokutshintsha imowudi `#d0d9#`
- **Yongezwe** Izibhalo eziqhelekileyo zeBoolean kuyo nayiphi na iskripthi — `#१` / `#०`, `#१` / `#०`, njl.
- **Yongezwe** Iidijithi zeKlingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Yongezwe** `SetNumeralMode` i-opcode yeVM — ukulingana okupheleleyo nomhambi womthi
- **Yongezwe** I-REPL iyayihlonipha imowudi yamanani esebenzayo kwi-echo kunye nokuboniswa kwezinto eziguquguqukayo
- **Itshintshiwe** Imveliso yeBoolean `>>` ngoku ibandakanya isimaphambili `#` (`#0` / `#1`) kuzo zonke iimowudi

### v0.0.2_01 — Ukubizwa ngokutsha komsebenzi _(30 Matshi 2026)_

- **Itshintshiwe** `c|..|` → `#,|..|` kunye `e|..|` → `#^|..|` — ingqinelana nosapho lwesimaphambili sefomathi `#`
- **Yongezwe** Isiteketiso sokuthumela — thumela kwakhona amalungu emodyuli phantsi kwegama elahlukileyo

### v0.0.2 — Uyilo loTshintsho lwe-API yokuQokelela & abaFakeli _(24 Matshi 2026)_

- **Yongezwe** Usapho olumanyanisiweyo lomsebenzi `$` woluhlu kunye nemitya (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Yongezwe** Isabelo sokudiliza kuluhlu, iityuphu, kunye neetyuphu ezinamagama
- **Yongezwe** Izalathiso ezingalunganga (`uluhlu[-1]` = into yokugqibela)
- **Yongezwe** Abafakeli bomthonyama — iLinux (deb/rpm/pkg/musl), i-macOS (Intel + Apple Silicon), iWindows (MSI, winget)

### v0.0.1-patch _(25 Matshi 2026)_

- **Yongezwe** Isabelo esidityanisiweyo `^=`
- **Yilungisiwe** Iimeko ezisecaleni zezibalo zomhlalutyi; uhlengahlengiso loxwebhu

### v0.0.1 — Ukuphuma kokuQala koLuntu _(22 Matshi 2026)_

- Itoliki yomhambi womthi + i-VM yerejista (`--vm`, ~4× ngokukhawuleza, ~95% ukulingana)
- Zonke izakhiwo ezingundoqo: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Izichongi zeUnicode ezipheleleyo, inkqubo yemodyuli, iiambda, ukuvalwa, ukuphathwa kwempazamo
- I-REPL, i-LSP, ulwandiso lwe-VS Code, umbhali wefomathi (`zymbol fmt`)

---

_Zymbol-Lang — Isimboli. Jikelele. Ayiguquki._
