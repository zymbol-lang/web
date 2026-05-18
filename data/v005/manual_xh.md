> **Isilumkiso:** Olu xwebhu lwenziwe lwaguqulelwa ngobukrelekrele bokuzenzela (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Isalathiso esisemthethweni si **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** kwindawo yokugcina yotoliki.

---

# Isikhokelo se-Zymbol-Lang

> **Siyenziwe i-v0.0.5 — 2026-05-14**

**I-Zymbol-Lang** lulwimi lwenkqubo lweesimboli. Akukho magama angundoqo — yonke into isisimboli. Isebenza ngokufanayo nakuluphi na ulwimi lomntu.

- Akukho `if`, `while`, `return` — kuphela `?`, `@`, `<~`
- I-Unicode epheleleyo — izichongi kulo naluphi na ulwimi okanye i-emoji
- Ayixhomekanga kulwimi lomntu — ikhowudi iyafana kuyo yonke indawo

**Inguqulelo yotoliki**: v0.0.5 | **Ukugubungela kovavanyo**: 436/436 (ukulingana kwe-TW ↔ VM)

---

## Izinto eziguquguqukayo nezingaguqukiyo

```zymbol
x = 10              // into eguquguqukayo eguqukayo
π := 3.14159        // engaguquki — ukwabela kwakhona yimpazamo yexesha lokusebenza
igama = "u-Alice"
isebenza = #1         // ibhulowudi eyinyani
👋 := "Mholo"
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

`°` (uphawu lwedigri, U+00B0) iqala into eguquguqukayo ngokuzenzekelayo kwixabiso layo elingathathi hlangothi ekusetyenzisweni kokuqala:

```zymbol
amanani = [3, 1, 4, 1, 5]
@ n:amanani {
    °itotali += n    // iqalwa ngokuzenzekelayo ibe ngu-0 ngaphezulu komjikelo; iyaphila emva kwe-@
}
>> itotali ¶         // → 14
```

> `°x` (isimaphambili) simisa phezu komjikelo — isiphumo siyafikeleleka emva kwe-`@`.
> `x°` (isimamva) simisa ngaphakathi komjikelo — siyafa xa umjikelo uphela.
> I-tree-walker kuphela.

---

## Iindidi Zedatha

| Udidi | I-iteral | Itheyiji `#?` | Amanqaku |
|------|---------|----------|---------|
| Inani elipheleleyo | `42`, `-7` | `###` | I-64-bit enophawu |
| Inqaku elidadayo | `3.14`, `1.5e10` | `##.` | Ubhalo lwenzululwazi luvumelekile |
| Umtya | `"umbhalo"` | `##"` | Ukufakelwa: `"Mholo {igama}"` |
| Unobumba | `'A'` | `##'` | Unobumba omnye we-Unicode |
| Ibhulowudi | `#1`, `#0` | `##?` | Asiloxabiso lwenani — `#1 ≠ 1` |
| Uluhlu | `[1, 2, 3]` | `##]` | Izinto ezifanayo |
| I-tuple | `(a, b)` | `##)` | Ngokwendawo |
| I-tuple enegama | `(x: 1, y: 2)` | `##)` | Imihlaba enegama |
| Umsebenzi | isalathiso somsebenzi onomagama | `##()` | Inqanaba lokuqala; ibonisa `<funct/N>` |
| I-lambda | `x -> x * 2` | `##->` | Inqanaba lokuqala; ibonisa `<lambd/N>` |

```zymbol
// Uvavanyo lodidi — lubuyisela (udidi, amanani, ixabiso)
imeta = 42#?
>> imeta ¶         // → (###, 2, 42)
t = imeta[1]
>> t ¶            // → ###
```

---

## Imveliso kunye negalelo

```zymbol
>> "Mholo" ¶                       // ¶ okanye \\ kumgca omtsha ocacileyo
>> "a=" a " b=" b ¶               // ukubekana — amaxabiso amaninzi
>> (arr$#) ¶                      // izisebenzi ze-postfix zifuna ( ) kwi->>

>> igama                           // funda kuguquguqukayo (ngaphandle komnxuzo)
>> "Faka igama: " igama            // ngomnxuzo
```

> `¶` (i-AltGr+R kwibhodi yezitshixo yaseSpain) kunye no-`\\` yimigca emitsha elinganayo.

---

## Ii-TUI Ezisisiseko

Izisebenzi zesihlanganisi somsebenzisi setheminali yeenkqubo ezisebenzisanayo. Uninzi lufuna ibhloko `>>| { }` (isikrini esitshintshayo + imodi ekrwada).

```zymbol
>>| {
    >>!                             // coca isikrini esitshintshayo
    >>~ (1, 1, 0, 10) > "Iyasebenza"   // umqolo 1, ikholamu 1, fg=10 (luhlaza)
    @~ 1000                         // yima umzuzwana omnye (1000 ms)
    >>~ (2, 1) > "Igqityiwe."
}
// itheminali ibuyiselwa ngokuzenzekelayo xa uphuma
```

```zymbol
// Ukucofa iqhosha kunye nobukhulu betheminali
>>| {
    [imiqolo, iikholamu] = >>?              // buza imilinganiselo yetheminali
    >>~ (1, 1) > "Itheminali: " imiqolo " x " iikholamu
    <<| iqhosha                         // funda ukucofa iqhosha okuthintelayo
    >>~ (2, 1) > "Ucofe: " iqhosha
}
```

> `>>!` icoca isikrini. `>>?` ibuyisela `[imiqolo, iikholamu]`. `@~ N` ilala i-N imilisekondi.
> `<<|` ifunda ukucofa iqhosha elinye (ukuthintela); `<<|?` ikrola ngaphandle kokuthintela (ibuyisela `'\0'` ukuba akukho).
> I-tuple yemveliso yendawo: `(umqolo, ikholamu, BKS, fg, bg)` — nasiphi na isithuba sinokushiywa ngekoma (`>>~ (,,, 196) > "bomvu"`).
> I-BKS yi-bitmask: `1`=ngqindilili, `2`=ikekela, `4`=umgca ngaphantsi. I-ANSi 256 imibala yephalethi (`0`=okumiselweyo kwitheminali).
> I-tree-walker kuphela (ngaphandle kwe-`>>!`, `>>?`, `@~`, `>>~` ezisebenza nakwi-`--vm`).

---

## Izisebenzi

```zymbol
// Izibalo
a = 10
b = 3
is1 = a + b    // 13
is2 = a - b    // 7
is3 = a * b    // 30
is4 = a / b    // 3  (ukwahlula inani elipheleleyo)
is5 = a % b    // 1
is6 = a ^ b    // 1000  (ukunyusa amandla)

// Ukuthelekisa — yabela ukuze uhlole
thelek1 = a == b    // #0
thelek2 = a <> b    // #1
thelek3 = a < b     // #0
thelek4 = a <= b    // #0
thelek5 = a > b     // #1
thelek6 = a >= b    // #1

// Ingqiqo
ingqiqo1 = #1 && #0    // #0
ingqiqo2 = #1 || #0    // #1
ingqiqo3 = !#1         // #0
```

---

## Imitya

```zymbol
// Iindidi ezimbini zokudibanisa
igama = "u-Alice"
n = 42

>> "Mholo " igama " unayo " n ¶       // ukubekana — kwi->>
inkcazo = "Mholo {igama}, unayo {n}"     // ukufakelwa — naphi na
```

```zymbol
s = "Mholo ihlabathi"
ubude = s$#                  // 11
isiqwenga = s$[1..5]             // "Mholo"  (1-isisiseko, isiphelo siqukiwe)
ikhona = s$? "ihlabathi"          // #1
iziqwenga = "a,b,c,d"$/ ','   // [a, b, c, d]  (sahlula ngesahluli)
tshintsha = s$~~["l":"r"]        // "Mholo ihlabathi" (akukho 'l' kwisiXhosa)
tshintsha1 = s$~~["l":"r":1]     // "Mholo ihlabathi"
umgca = "─" $* 20           // "────────────────────"  (phinda N izihlandlo)
```

> `+` yeyamanani kuphela. Kwimitya, sebenzisa `,`, ukubekana, okanye ukufakelwa.

---

## Ukulawula Ukuhamba

```zymbol
x = 7

? x > 0 { >> "elungileyo" ¶ }

? x > 100 {
    >> "elikhulu" ¶
} _? x > 0 {
    >> "elungileyo" ¶
} _? x == 0 {
    >> "uziro" ¶
} _ {
    >> "elibi" ¶
}
```

> Iingcango `{ }` **ziyafuneka** nokuba sisiteyitimenti esinye.

---

## Ukudibanisa

```zymbol
// Uluhlu
amanqaku = 85
ibakala = ?? amanqaku {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> ibakala ¶    // → B

// Imitya
umbala = "bomvu"
ikhowudi = ?? umbala {
    "bomvu"   => "#FF0000"
    "luhlaza" => "#00FF00"
    _       => "#000000"
}

// Iipatheni zokuthelekisa
iqondo_lobushushu = -5
imeko = ?? iqondo_lobushushu {
    < 0  => "umkhenkce"
    < 20 => "kubanda"
    < 35 => "kufudumele"
    _    => "kushushu"
}
>> imeko ¶    // → umkhenkce

// Uhlobo lwestteyitimenti (iingalo zebhloko)
n = -3
?? n {
    0    => { >> "uziro" ¶ }
    < 0  => { >> "elibi" ¶ }
    _    => { >> "elungileyo" ¶ }
}
```

---

## Imijikelo

```zymbol
@ i:0..4  { >> i " " }        // uluhlu oluqukiweyo:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // ngenyathelo:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // ngasemva:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

iziqhamo = ["iapile", "ipeyile", "idiliya"]
@ i:iziqhamo { >> i ¶ }         // kwinto nganye kuluhlu

@ u:"hello" { >> u "-" }
>> ¶                          // → h-e-l-l-o-  (kunobumba ngamnye kumtya)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> qhubeka
    ? i > 7 { @! }             // @! qhekeza
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

// Umjikelo oneleyibhile (ukuqhekeza okukwiqondo elingaphakathi)
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
dibanisa(a, b) { <~ a + b }
>> dibanisa(3, 4) ¶    // → 7

ifakthoriyeli(n) {
    ? n <= 1 { <~ 1 }
    <~ n * ifakthoriyeli(n - 1)
}
>> ifakthoriyeli(5) ¶    // → 120
```

Imisebenzi **ineendawo ezahlukileyo** — ayikwazi ukufunda izinto eziguquguqukayo zangaphandle. Sebenzisa iiparamitha zemveliso `<~>` ukuguqula izinto eziguquguqukayo zofowunayo:

```zymbol
tshintshana(a<~, b<~) {
    okwexeshana = a
    a = b
    b = okwexeshana
}
x = 10
y = 20
tshintshana(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Imisebenzi enamagama **ngamaxabiso enqanaba lokuqala** — dlulisela ngokuthe ngqo: `amanani$> kabini`. Ukusonga: `x -> fn(x)` nayo isebenza.

---

## IiLambda kunye neeClosure

```zymbol
kabini = x -> x * 2
dibanisa = (a, b) -> a + b
>> kabini(5) ¶    // → 10
>> dibanisa(3, 7) ¶  // → 10

// Ibhloko ye-lambda
hlela = x -> {
    ? x > 0 { <~ "elungileyo" }
    _? x < 0 { <~ "elibi" }
    <~ "uziro"
}

// I-closure — ibamba indawo yangaphandle
umlinganiselo = 3
kathathu = x -> x * umlinganiselo
>> kathathu(7) ¶    // → 21

// Ifektri
umenzi_wokudibanisa(n) { <~ x -> x + n }
dibanisa_ishumi = umenzi_wokudibanisa(10)
>> dibanisa_ishumi(5) ¶    // → 15

// Kuluhlu
izisebenzi = [x -> x+1, x -> x*2, x -> x*x]
>> izisebenzi[3](5) ¶    // → 25
```

---

## Uluhlu

Uluhlu **luyaguquguquka** kwaye luqulathe izinto **zodidi olunye**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — ukufikelela (1-isisiseko: into yokuqala)
x = arr[-1]     // 5 — isalathiso esingelilo (into yokugqibela)
x = arr$#       // 5 — ubude (sebenzisa (arr$#) kwi->>)

arr = arr$+ 6            // yongeza → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // faka kwindawo yesi-2 (1-isisiseko)
arr3 = arr$- 3           // susa ukwenzeka kokuqala kwexabiso
arr4 = arr$-- 3          // susa konke ukwenzeka
arr5 = arr$-[1]          // susa kwisalathiso 1 (into yokuqala)
arr6 = arr$-[2..3]       // susa uluhlu (1-isisiseko, isiphelo siqukiwe)

ikhona = arr$? 3            // #1 — iqulethe
iindawo = arr$?? 3           // [3] — zonke iisalathiso zexabiso (1-isisiseko)
isiqwenga = arr$[1..3]          // [1,2,3] — isiqwenga (1-isisiseko, isiphelo siqukiwe)
isiqwenga2 = arr$[1:3]          // [1,2,3] — okufanayo, isintaksi esisekwe ekubaleni

ukunyuka = arr$^+             // cwangcisa kunyuka (iiprimitive kuphela)
ukuhla = arr$^-            // cwangcisa kuhla (iiprimitive kuphela)

// Uluhlu lwee-tuple ezinamagama/ngokwendawo — sebenzisa $^ kunye ne-lambda yokuthelekisa
idatabase = [(igama: "u-Carla", ubudala: 28), (igama: "u-Ana", ubudala: 25), (igama: "u-Bob", ubudala: 30)]
ngokobudala  = idatabase$^ (a, b -> a.ubudala < b.ubudala)    // ngokobudala ukunyuka (<)
ngokwegama = idatabase$^ (a, b -> a.igama > b.igama)   // ngokwegama ukuhla (>)
>> ngokobudala[1].igama ¶     // → u-Ana
>> ngokwegama[1].igama ¶    // → u-Carla

// Ukuhlaziya into ngokuthe ngqo (uluhlu kuphela)
arr[1] = 99              // yabela
arr[2] += 5              // okudibeneyo: +=  -=  *=  /=  %=  ^=

// Ukuhlaziya okusebenzayo — kubuyisela uluhlu olutsha; olwangaphambili alutshintshi
arr2 = arr[2]$~ 99
```

> Zonke izisebenzi zengqokelela zibuyisela **uluhlu olutsha**. Yabela kwakhona: `arr = arr$+ 4`.
> `$+` ingadityaniswa ngekhonkco: `arr = arr$+ 5$+ 6$+ 7`. Ezinye izisebenzi zisebenzisa izabelo eziphakathi.
> **Ukubekwa kweesalathiso ngu-1-isisiseko**: `arr[1]` yinto yokuqala; `arr[0]` yimpazamo yexesha lokusebenza.
> `$^+` / `$^-` zicwangcisa **uluhlu lweeprimitive** (amanani, imitya). Kuluhlu lwee-tuple, sebenzisa `$^` nge-lambda yokuthelekisa — isalathiso sifakwe kwi-lambda (`<` = ukunyuka, `>` = ukuhla).

**I-semantics yexabiso** — ukwabela uluhlu kwenye into eguquguqukayo kwenza ikopi ezimeleyo:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ayichaphazeleki
```

```zymbol
// Uluhlu olukwiqondo elingaphakathi (ukubekwa kweesalathiso ngo-1-isisiseko)
imatrix = [[1,2,3],[4,5,6],[7,8,9]]
>> imatrix[2][3] ¶    // → 6  (umqolo 2, ikholamu 3)
```

---

## Ukuchithwa kwesakhiwo

```zymbol
// Uluhlu
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[eyokuqala, *intsalela] = arr         // eyokuqala=10  intsalela=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ iyalahla

// I-tuple ngokwendawo
inqaku = (100, 200)
(px, py) = inqaku             // px=100  py=200

// I-tuple enegama
umntu = (igama: "u-Ana", ubudala: 25, isixeko: "iMadrid")
(igama: n, ubudala: u) = umntu   // n="u-Ana"  u=25
```

---

## IiTuple

IiTuple zizikhongozeli ezicwangcisiweyo **ezingaguqukiyo** ezinokubamba amaxabiso **eentlobo ezahlukeneyo**.
Ngokungafaniyo noluhlu, izinto azinakutshintshwa emva kokudalwa.

```zymbol
// Ngokwendawo — iindidi ezixubeneyo zivumelekile
inqaku = (10, 20)
>> inqaku[1] ¶    // → 10

idatha = (42, "Mholo", #1, 3.14)
>> idatha[3] ¶     // → #1

// Enegama
umntu = (igama: "u-Alice", ubudala: 25)
>> umntu.igama ¶    // → u-Alice
>> umntu[1] ¶      // → u-Alice  (isalathiso nayo iyasebenza, 1-isisiseko)

// Ekwiqondo elingaphakathi
indawo = (x: 10, y: 20)
p = (indawo: indawo, ileyibhile: "imvelaphi")
>> p.indawo.x ¶        // → 10
```

**Ukungaguquguquki** — nayiphi na imizamo yokutshintsha into ye-tuple yimpazamo yexesha lokusebenza:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ impazamo yexesha lokusebenza: ii-tuple aziguquki
// t[1] += 5    // ❌ impazamo efanayo
```

Ukufumana ixabiso elitshintshisiweyo sebenzisa `$~` (ukuhlaziya okusebenzayo) — ibuyisela **i-tuple entsha**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← eyangaphambili ayitshintshanga
>> t2 ¶    // → (10, 999, 30)

// I-tuple enegama — yakha kwakhona ngokucacileyo
umntu = (igama: "u-Alice", ubudala: 25)
omdala  = (igama: umntu.igama, ubudala: 26)
>> umntu.ubudala ¶    // → 25
>> omdala.ubudala ¶     // → 26
```

---

## Imisebenzi yeNqanaba eliPhezulu

```zymbol
amanani = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

ukuphindwe_kabini  = amanani$> (x -> x * 2)                  // map  → [2,4,6…20]
amanani_juphu    = amanani$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
itotali    = amanani$< (0, (umqokeleli, x) -> umqokeleli + x)     // reduce → 55

// Dibanisa ngekhonkco ngokusebenzisa eziphakathi
inyathelo1 = amanani$| (x -> x > 3)
inyathelo2 = inyathelo1$> (x -> x * x)
>> inyathelo2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Imisebenzi enamagama ingadluliselwa ngokuthe ngqo kwi-HOF
kabini(x) { <~ x * 2 }
inkulu(x) { <~ x > 5 }
r = amanani$> kabini       // ✅ isalathiso esithe ngqo
r = amanani$| inkulu       // ✅ isalathiso esithe ngqo
```

---

## Isisebenzi sombhobho

Icala lasekunene lihlala lifuna `_` njengesibambi sendawo yexabiso elimbothiweyo:

```zymbol
kabini = x -> x * 2
dibanisa = (a, b) -> a + b
ukunyusa = x -> x + 1

is1 = 5 |> kabini(_)        // → 10
is2 = 10 |> dibanisa(_, 5)       // → 15
is3 = 5 |> dibanisa(2, _)        // → 7

// Okudityanisiweyo
is = 5 |> kabini(_) |> ukunyusa(_) |> kabini(_)
>> is ¶    // → 22  (5→10→11→22)
```

---

## Ukuphatha iimpazamo

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "ukwahlula ngo-zero" ¶
} :! {
    >> "ezinye: " _err ¶    // _err igcina umyalezo wempazamo
} :> {
    >> "ihlala isebenza" ¶
}
```

| Uhlobo | Xa |
|------|------|
| `##Div` | Ukwahlula ngo-zero |
| `##IO` | Ifayile / inkqubo |
| `##Index` | Isalathiso esingaphandle komda |
| `##Type` | Ukungangqinelani kohlobo |
| `##Parse` | Ukucazululwa kwedatha |
| `##Network` | Iimpazamo zothungelwano |
| `##_` | Nayiphi na impazamo (ibamba konke) |

---

## Iimodyuli

```zymbol
// lib/calc.zy — umzimba wemodyuli uvalwe ngeengcango
# calc {
    #> { dibanisa, get_PI }

    _π := 3.14159
    dibanisa(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // isiqhulo siyafuneka

>> c::dibanisa(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Khupha ngegama loluntu elahlukileyo
# mylib {
    #> { _dibanisa_yangaphakathi => isambuku }

    _dibanisa_yangaphakathi(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::isambuku(3, 4) ¶    // → 7  (igama langaphakathi _dibanisa_yangaphakathi lifihliwe)
```

> **Imigaqo yemodyuli**: ngaphakathi kwe-`# igama { }`, kuphela i-`#>`, iinkcazelo zomsebenzi, kunye neziqalisi ze-iteral eziguquguqukayo/ezingaguqukiyo ezivumelekileyo. Iiteyitimenti eziphunyezwayo (`>>`, `<<`, imijikelo, njl.) ziphakamisa impazamo E013.

---

## Iimowudi zamanani

I-Zymbol inokubonisa amanani **kwiinkcukacha zamanani ezingama-69 ze-Unicode** — i-Devanagari, i-Arab-Indian, i-Thai, i-Klingon pIqaD, i-Mathematical Bold, amacandelo e-LCD, nokunye. Imowudi esebenzayo ichaphazela imveliso `>>` kuphela; izibalo zangaphakathi zihlala ziyi-binary.

### Ukwenza iscript sisebenze

Bhala amanani `0` kunye `9` escript ekujoliswe kuyo ngaphakathi `#…#`:

```zymbol
#०९#    // i-Devanagari   (U+0966–U+096F)
#٠٩#    // i-Arab-Indian (U+0660–U+0669)
#๐๙#    // i-Thai         (U+0E50–U+0E59)
#09#    // setha ngokutsha kwi-ASCII
```

### Imveliso kunye neebhulowudi

```zymbol
x = 42
>> x ¶          // → 42   (i-ASCII emiselweyo)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (ichaphasi ledesimali ihlala iyi-ASCII)
>> 1 + 2 ¶      // → ३

// Iibhulowudi: isimaphambili # sisoloko siyi-ASCII, inani liyavumelana
>> #1 ¶         // → #१   (inyani kwi-Devanagari)
>> #0 ¶         // → #०   (ubuxoki — yahlukile ku-० inani elipheleleyo elingu-zero)

x = 28 > 4
>> x ¶          // → #१   (isiphumo sokuthelekisa silandela imowudi esebenzayo)
```

### Ii-iteral zamanani omthonyama kumthombo

Amanani ayo nayiphi na iscript exhaswayo ayizii-iteral ezisemthethweni — kuluhlu, kwi-modulo, kuthelekiso:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Ii-iteral zebhulowudi kuyo nayiphi na iscript

`#` + inani `0` okanye `1` elivela kuyo nayiphi na ibhloko liyibhulowudi esemthethweni:

```zymbol
#٠٩#
isebenza = #١        // ifana ne-#1
>> isebenza ¶        // → #१
>> (#١ && #٠) ¶ // → #०
```

> `#` **isoloko iyi-ASCII**. `#0` (ubuxoki) isoloko yahluke ngokubonakalayo ku-`0` (inani elipheleleyo u-zero) kuyo yonke iscript.

---

## Izisebenzi Zedatha

```zymbol
// Uguqulelo lodidi
f = ##.42         // → 42.0  (kwinqaku elidadayo)
i = ###3.7        // → 4     (kwinani elipheleleyo, songela)
t = ##!3.7        // → 3     (kwinani elipheleleyo, nqumla)

// Cazulula umtya ube linani
v1 = #|"42"|      // → 42  (inani elipheleleyo)
v2 = #|"3.14"|    // → 3.14  (inqaku elidadayo)
v3 = #|"abc"|     // → "abc"  (ikhuselekile, akukho mpazamo)

// Songela / Nqumla
π = 3.14159265
songela2 = #.2|π|      // → 3.14  (songela kwiindawo ezisi-2 zedesimali)
songela4 = #.4|π|      // → 3.1416
nqumla2 = #!2|π|      // → 3.14  (nqumla)

// Ukufomatha amanani
ifomathi = #,|1234567|  // → 1,234,567  (ikwahlulwe ngekoma)
yesayensi = #^|12345.678|    // → 1.2345678e4  (yesayensi)

// Ii-iteral zesiseko
a = 0x41         // → 'A'  (i-hexadecimal)
b = 0b01000001   // → 'A'  (i-binary)
c = 0o101        // → 'A'  (i-octal)

// Imveliso yoguqulelo lwesiseko
ihex = 0x|255|    // → "0x00FF"
ibinary = 0b|65|     // → "0b1000001"
ioctal = 0o|8|      // → "0o10"
idesimali = 0d|255|    // → "0d0255"
```

---

## Ukudityaniswa kweShell

```zymbol
umhla = <\ date +%Y-%m-%d \>     // ithwebula i-stdout (iquka u-\n ekupheleni)
>> "Namhlanje: " umhla

ifayile = "data.txt"
umxholo = <\ cat {ifayile} \>      // ukufakelwa kwimiyalelo

imveliso = </"./subscript.zy"/>   // sebenzisa esinye iskripthi se-Zymbol, thwebula imveliso
>> imveliso
```

> `><` ithwebula iimpikiswano ze-CLI njengoluhlu lwemitya (i-tree-walker kuphela).

---

## Umzekelo opheleleyo: i-FizzBuzz

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

## Isalathiso seSimboli

| Isimboli | Umsebenzi | Isimboli | Umsebenzi |
|--------|-----------|--------|-----------|
| `=` | into eguquguqukayo | `$#` | ubude |
| `:=` | engaguqukiyo | `$+` | yongeza (inokudityaniswa ngekhonkco) |
| `>>` | imveliso | `$+[i]` | faka kwisalathiso (1-isisiseko) |
| `<<` | igalelo | `$-` | susa eyokuqala ngexabiso |
| `¶` / `\\` | umgca omtsha | `$--` | susa konke ngexabiso |
| `?` | ukuba | `$-[i]` | susa kwisalathiso (1-isisiseko) |
| `_?` | kungenjalo-ukuba | `$-[i..j]` | susa uluhlu (1-isisiseko) |
| `_` | kungenjalo / ikhadi lasendle | `$?` | iqulethe |
| `??` | dibanisa | `$??` | fumana zonke iisalathiso (1-isisiseko) |
| `@` | umjikelo | `$[s..e]` | isiqwenga (1-isisiseko) |
| `@ N { }` | umjikelo N izihlandlo | `$>` | map |
| `@!` | qhekeza | `$\|` | filter |
| `@>` | qhubeka | `$<` | reduce |
| `@:igama { }` | umjikelo oneleyibhile | `$/ isahluli` | yahlula umtya |
| `@:igama!` | qhekeza ileyibhile | `$++ a b c` | ukwakha ukudibanisa |
| `@:igama>` | qhubeka ileyibhile | `arr[i>j>k]` | isalathiso sokukhangela |
| `->` | i-lambda | `arr[i] = ixabiso` | hlaziya into (uluhlu kuphela) |
| `arr[i] += ixabiso` | ukuhlaziya okudibeneyo | `arr[i]$~` | ukuhlaziya okusebenzayo (ikopi entsha) |
| `$^+` | cwangcisa kunyuka (iiprimitive) | `$^-` | cwangcisa kuhla (iiprimitive) |
| `$^` | cwangcisa ngomthelekisi (ii-tuple) | `<~` | buyisela |
| `\|>` | umbhobho | `!?` | zama |
| `:!` | bamba | `:>` | ekugqibeleni |
| `#1` | inyani | `#0` | ubuxoki |
| `$!` | ngaba impazamo | `$!!` | sasaza impazamo |
| `<#` | ngenisa | `#>` | khupha |
| `#` | bhengeza imodyuli | `::` | Biza imodyuli |
| `.` | ukufikelela kumhlaba | `#?` | imetadata yodidi |
| `#\|..\|` | cazulula inani | `##.` | guqulela kwinqaku elidadayo |
| `###` | guqulela kwinani elipheleleyo (songela) | `##!` | guqulela kwinani elipheleleyo (nqumla) |
| `#.N\|..\|` | songela | `#!N\|..\|` | nqumla |
| `#,\|..\|` | ifomathi yekoma | `#^\|..\|` | yesayensi |
| `#d0d9#` | tshintsha imowudi yamanani | `#09#` | setha ngokutsha kwi-ASCII |
| `<\ ..\>` | sebenzisa i-shell | `>\<` | iimpikiswano ze-CLI |
| `\ into eguquguqukayo` | tshabalalisa into eguquguqukayo ngokucacileyo | `°x` / `x°` | inkcazo eshushu (iqala ngokuzenzekelayo) |
| `>>|` | ibhloko ye-TUI (isikrini esitshintshayo) | `>>~` | imveliso yendawo |
| `>>!` | coca isikrini | `>>?` | buza ubukhulu betheminali |
| `<<\|` | ukucofa iqhosha okuthintelayo | `<<\|?` | ukukrola ukucofa iqhosha okungathinteliyo |
| `@~ N` | lala i-N imilisekondi | `$*` | phinda umtya N izihlandlo |

---

## Ingxelo yotshintsho lokukhutshwa

### v0.0.5 — Ii-TUI Ezisisiseko, iNkcazo eShushu & Ukuphindwaphindwa koMtya _(Meyi 2026)_

- **Into ephukileyo** Isahluli sengalo yokudibanisa: `ipatheni : isiphumo` → `ipatheni => isiphumo`
- **Into ephukileyo** Isiqhulo sokungenisa: `<# indlela <= isiqhulo` → `<# indlela => isiqhulo`
- **Into ephukileyo** Ukuthiywa kwakhona kokukhupha: `#> { fn <= karhulumente }` → `#> { fn => karhulumente }`
- **Yongezwe** Ibhloko ye-TUI `>>| { }` — isikrini esitshintshayo + imodi ekrwada; iyacoca xa uphuma
- **Yongezwe** Imveliso yendawo `>>~ (umqolo, ikholamu, BKS, fg, bg) > izinto` — izithuba ezinqabileyo, i-ANSI 256 imibala
- **Yongezwe** Igalelo leqhosha `<<| into eguquguqukayo` (okuthintelayo) kunye `<<|? into eguquguqukayo` (ukukrola okungathinteliyo)
- **Yongezwe** `>>!` coca isikrini, `>>?` buza ubukhulu betheminali, `@~ N` lala i-N imilisekondi
- **Yongezwe** Inkcazo eshushu `°x` / `x°` — qala into eguquguqukayo ngokuzenzekelayo ekusetyenzisweni kokuqala kwimijikelo
- **Yongezwe** Ukuphindaphinda umtya `umtya $* N` — phinda umtya N izihlandlo
- **I-VM** Ukulingana: iimvavanyo ezingama-436/436 ziphasile

### v0.0.4 — Ukubekwa kweesalathiso ngo-1-isisiseko, iMisebenzi yeNqanaba lokuQala & Iimodyuli zeBhloko _(Epreli 2026)_

- **Into ephukileyo** Konke ukubekwa kweesalathiso kuguqulelwe **kwi-1-isisiseko** — `arr[1]` yinto yokuqala; `arr[0]` yimpazamo yexesha lokusebenza
- **Yongezwe** Imisebenzi enamagama **ngamaxabiso enqanaba lokuqala** — dlulisela ngokuthe ngqo kwi-HOF: `amanani$> kabini`
- **Yongezwe** **Isintaksi yebhloko iyafuneka** kwiimodyuli: `# igama { ... }` — isintaksi ethe tyaba isusiwe
- **Yongezwe** Ukubekwa kweesalathiso ezinemilinganiselo emininzi: `arr[i>j>k]` (ukukhangela), `arr[p ; q]` (ukutsalwa okuthe tyaba)
- **Yongezwe** Uguqulelo lodidi: `##.intetho` (inqaku elidadayo), `###intetho` (inani elipheleleyo songela), `##!intetho` (inani elipheleleyo nqumla)
- **Yongezwe** Ukwahlula umtya: `umtya$/ isahluli` — ibuyisela `Array(umtya)`
- **Yongezwe** Ukwakha ukudibanisa: `isiseko$++ a b c` — yongeza izinto ezininzi
- **Yongezwe** Umjikelo wamaxesha: `@ N { }` — phinda kanye N izihlandlo
- **Yongezwe** Isintaksi yomjikelo oneleyibhile: `@:igama { }`, `@:igama!`, `@:igama>` — ithatha indawo ye-`@ @igama` / `@! igama`
- **Yongezwe** Imigaqo yendawo yokuguquguqukayo: ukuguquguqukayo `_igama` kunendawo echanekileyo yebhloko; `\ into eguquguqukayo` itshabalalisa kwangethuba
- **Yongezwe** Iipatheni zokuthelekisa zokudibanisa: `< 0 =>`, `> 5 =>`, `== 42 =>`, njl.
- **Yongezwe** Impazamo yemodyuli E013: iiteyitimenti eziphunyezwayo kumzimba wemodyuli azivumelekanga
- **Ilungisiwe** `alias.CONST` ngoku isombulula ngokuchanekileyo; `#>` ingavela emva kweenkcazelo zomsebenzi
- **I-VM** Ukulingana okupheleleyo: iimvavanyo ezingama-393/393 ziphasile

### v0.0.3 — Iinkqubo zamaNani ze-Unicode kunye nokuPhuculwa kwe-LSP _(Epreli 2026)_

- **Yongezwe** Iibhloko ezingama-69 zamanani e-Unicode ezinophawu lokutshintsha imowudi `#d0d9#`
- **Yongezwe** Ii-iteral zebhulowudi kuyo nayiphi na iscript — `#१` / `#०`, `#١` / `#٠`, njl.
- **Yongezwe** Amanani e-Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Yongezwe** I-Opcode ye-VM `SetNumeralMode` — ukulingana okupheleleyo ne-tree-walker
- **Itshintshiwe** Imveliso yebhulowudi `>>` ngoku iquka isimaphambili `#` (`#0` / `#1`) kuzo zonke iimowudi

### v0.0.2_01 — Ukuthiywa kwakhona koMsebenzi _(30 Matshi 2026)_

- **Itshintshiwe** `c|..|` → `#,|..|` kunye `e|..|` → `#^|..|` — ukuhambelana nosapho lwesimaphambili `#`
- **Yongezwe** Isiqhulo sokukhupha: khupha kwakhona amalungu emodyuli phantsi kwegama elahlukileyo

### v0.0.2 — Uyilo ngokutsha lwe-API yokuQokelela kunye neZifaki _(24 Matshi 2026)_

- **Yongezwe** Usapho oludibeneyo lomsebenzi `$` kuluhlu nakwimitya (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Yongezwe** Ukwabela ukuchithwa kwesakhiwo kuluhlu, i-tuple, kunye ne-tuple enegama
- **Yongezwe** Izalathiso ezingezizo (`arr[-1]` = into yokugqibela)
- **Yongezwe** Izifaki zomthonyama — i-Linux (deb/rpm/pkg/musl), i-macOS (Intel + Apple Silicon), i-Windows (MSI, winget)

### v0.0.1-patch _(25 Matshi 2026)_

- **Yongezwe** Ukwabela okudibeneyo `^=`
- **Ilungisiwe** Iimeko zomda wezibalo zomhluzi; ukulungiswa kwamaxwebhu

### v0.0.1 — Ukukhutshwa kokuQala koluntu _(22 Matshi 2026)_

- Umhumushi we-tree-walker + i-VM yerejista (`--vm`, ~4× ngokukhawuleza, ~95% ukulingana)
- Zonke izakhiwo ezingundoqo: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Izichongi ze-Unicode ezipheleleyo, inkqubo yemodyuli, ii-lambda, ii-closure, ukuphatha iimpazamo
- I-REPL, i-LSP, isandiso se-VS Code, ifomatha (`zymbol fmt`)

---

_I-Zymbol-Lang — Eyokomfuziselo. Yeyomhlaba wonke. Ayiguquki._
