> **Okwewala:** Ebiwandiwe bino byakolebwa era byakyusibwa obwongo bwakole (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Ekyawandiikibwa ekikulu kiri **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** mu kukuŋŋaanyirizo y'omukyusizi.

---

# Ekitabo ky'Omukulu gwa Zymbol-Lang

> **Kyetongozebwa ku v0.0.5 — 2026-05-16**

**Zymbol-Lang** lulimi lw'okupulogulaamu olw'akabonero. Tewali bigambo by'ensibuko — buli kintu kabonero. Kukola nga bwe kimu mu bulimi bwonna bw'abantu.

- Tewali `if`, `while`, `return` — kyokka `?`, `@`, `<~`
- Unicode eyuwedde — obumanyiso mu lulimi olulala yenna oba emoji
- Tekyegatta ku lulimi lw'abantu — kkoodi emu buli wamu

**Enkyukakyuka y'omukyusizi**: v0.0.5 | **Okubikkibwa kw'okugezesa**: 436/436 (okwenkanakana kwa TW ↔ VM)

---

## Enkyukakyuka n'Ebitali Byakyuka

```zymbol
x = 10              // enkyukakyuka eyinza okukyuka
π := 3.14159        // ekitali kyakyuka — okuddamu okugabiza kya balaza mu kiseera ky'okudduka
erinnya = "Alice"
akola = #1         // bbulini ddala
👋 := "Nkulamusizza"
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

`°` (akabonero ak'eddiguli, U+00B0) kitandika enkyukakyuka kyokka ku mugaso gwayo ogw'omunda ku kukozesebwa kw'olubereberye:

```zymbol
enzaala = [3, 1, 4, 1, 5]
@ n:enzaala {
    °awamu += n    // kitandika kyokka ku 0 waggulu wa lupu; kiramu oluvanyuma lwa @
}
>> awamu ¶         // → 14
```

> `°x` (omumulu) gumira waggulu wa lupu — ekivaamu kiyinzika oluvanyuma lwa `@`.
> `x°` (omusitale) gumira mu lupu — kifa lupu bwe kuggwa.
> Tree-walker kyokka.

---

## Enkola z'Ebyawandiikibwa

| Enkola | Ekyawandiikibwa | Akabonero `#?` | Ebyokulabirako |
|------|---------|----------|---------|
| Kibalirampimba | `42`, `-7` | `###` | 64-bit akabonero |
| Ekiyita | `3.14`, `1.5e10` | `##.` | Okukubisa mu ngeri ya sayansi kukkirizibwa |
| Ekigambo | `"muwandiiko"` | `##"` | Okuteekamu: `"Nkulamusizza {erinnya}"` |
| Akabonero | `'A'` | `##'` | Akabonero kamu ka Unicode |
| Bbulini | `#1`, `#0` | `##?` | Si nzaala — `#1 ≠ 1` |
| Olunyiriri | `[1, 2, 3]` | `##]` | Ebintu ebirina enkola emu |
| Tuple | `(a, b)` | `##)` | Ekifo |
| Tuple erina erinnya | `(x: 1, y: 2)` | `##)` | Ensonda ezirina amannya |
| Omukolo | okulambula kw'omukolo erina erinnya | `##()` | Ekitundu ekisooka; kulaga `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Ekitundu ekisooka; kulaga `<lambd/N>` |

```zymbol
// Okukebera enkola — kiddayo (enkola, namba, omugaso)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Okuvaamu n'Okuyingiza

```zymbol
>> "Nkulamusizza" ¶                       // ¶ oba \\ ku mulongo omuggya oguli mu maaso
>> "a=" a " b=" b ¶               // okuteekamu okumpi — ebigaso bingi
>> (arr$#) ¶                      // eby'emisitale byetaaga ( ) mu >>

>> erinnya                           // soma mu nkyukakyuka (nga tewali kya kusaba)
>> "Wandiika erinnya: " erinnya            // n'ekyasaba
```

> `¶` (AltGr+R ku kiyitaganya eky'Esipanya) ne `\\` bwe mulongo omuggya omugeraageranyizibwa.

---

## Eby'omugaso bya TUI

Eby'okukozesa by'ekikolwa ky'omukozesa eri ekitundu ku puloguramu ez'okukwataganya. Ebisinga byetaaga ekifo `>>| { }` (ekituli ekirala + enkola ya kanyala).

```zymbol
>>| {
    >>!                             // nokoola ekituli ekirala
    >>~ (1, 1, 0, 10) > "Kudduka"   // olunyiriri 1, empagi 1, fg=10 (kiragala)
    @~ 1000                         // yimirira eddakiika 1 (1000 ms)
    >>~ (2, 1) > "Kamaliriza."
}
// ekitundu kiddizibwa kyokka nga wafuluma
```

```zymbol
// Okukuba akabonero n'obunene bw'ekitundu
>>| {
    [emirongo, empagi] = >>?              // baza obunene bw'ekitundu
    >>~ (1, 1) > "Ekitundu: " emirongo " x " empagi
    <<| akabonero                         // soma okukuba akabonero okuggalawo
    >>~ (2, 1) > "Okukuba: " akabonero
}
```

> `>>!` nokoola ekituli. `>>?` kiddayo `[emirongo, empagi]`. `@~ N` yeebaka N millisekondi.
> `<<|` soma okukuba akabonero okumu (oggalawo); `<<|?` wekebejja nga togalawo (kiddayo `'\0'` oba nga tekiri).
> Tuple ey'okuvaamu mu kifo: `(omulongo, empagi, BKS, fg, bg)` — ekifo kyonna kiyinza okulekebwa ng'akozesezza akakoma (`>>~ (,,, 196) > "kimyufu"`).
> BKS bitmask: `1`=kkekere, `2`=ekitengefu, `4`=omulongo wansi. Paleti y'amabala ga ANSI 256 (`0`=ekitegekwa eky'ekitundu).
> Tree-walker kyokka (okugyako `>>!`, `>>?`, `@~`, `>>~` ebikola ne mu `--vm`).

---

## Eby'okukozesa

```zymbol
// Okubala
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (okugabanya eza kibalirampimba)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (okugulumiza)

// Okugeraageranya — gabiza okukebera
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Omutwe
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Ebigambo

```zymbol
// Engeri bbiri ez'okugatta
erinnya = "Alice"
n = 42

>> "Nkulamusizza " erinnya " olina " n ¶       // okuteekamu okumpi — mu >>
okutegeeza = "Nkulamusizza {erinnya}, olina {n}"     // okuteekamu — wonna wonna
```

```zymbol
s = "Nkulamusizza ensi"
buanvu = s$#                  // 11
ekitundu = s$[1..5]             // "Nkula"  (1-omusingi, akama akasembayo akakozesebwa)
kiri = s$? "ensi"          // #1
ebitundu = "a,b,c,d"$/ ','   // [a, b, c, d]  (okugabanya ng'oyita mu kyawula)
kyusa = s$~~["l":"r"]        // "Nkulamusizza ensi"
kyusa1 = s$~~["l":"r":1]     // "Nkulamusizza ensi"  (N ezisoose zokka)
omulongo = "─" $* 20           // "────────────────────"  (okuddamu N emirundi)
```

> `+` ye ya nzaala zokka. Ku bigambo, kozesa `,`, okuteekamu okumpi, oba okuteekamu.

---

## Okutwala Okukola

```zymbol
x = 7

? x > 0 { >> "ekikulu" ¶ }

? x > 100 {
    >> "kinene" ¶
} _? x > 0 {
    >> "ekikulu" ¶
} _? x == 0 {
    >> "zero" ¶
} _ {
    >> "ekikyamu" ¶
}
```

> Eby'okukyawa `{ }` **bibeerawo** ne bw'ekiba nga kigambo kimu.

---

## Okugeraageranya

```zymbol
// Ebitundu
ebifunye = 85
ebaluwa = ?? ebifunye {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> ebaluwa ¶    // → B

// Ebigambo
langi = "kimyufu"
koodo = ?? langi {
    "kimyufu"   => "#FF0000"
    "kiragala" => "#00FF00"
    _       => "#000000"
}

// Enkola z'okugeraageranya
ebbugumu = -5
embeera = ?? ebbugumu {
    < 0  => "mumpeera"
    < 20 => "buli"
    < 35 => "bubbe"
    _    => "okyokye"
}
>> embeera ¶    // → mumpeera

// Enkola y'ekigambo (ebikono eby'ekifo)
n = -3
?? n {
    0    => { >> "zero" ¶ }
    < 0  => { >> "ekikyamu" ¶ }
    _    => { >> "ekikulu" ¶ }
}
```

---

## Loops

```zymbol
@ i:0..4  { >> i " " }        // ekitundu ekikozesebwa:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // n'ekitambiro:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // okukyusa:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (bwemala)

ebibala = ["ennyannyansi", "peya", "zabibu"]
@ b:ebibala { >> b ¶ }         // ku buli kintu mu lunyiriri

@ k:"hello" { >> k "-" }
>> ¶                          // → h-e-l-l-o-  (ku buli kabonero mu kigambo)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> endaayo
    ? i > 7 { @! }             // @! menya
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Loop etaggwa
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Loop erina akabonero (okumenya okukyawa)
okubala = 0
@:ebweru {
    okubala++
    ? okubala >= 3 { @:ebweru! }
}
>> okubala ¶                    // → 3
```

---

## Emirimu

```zymbol
okugatta(a, b) { <~ a + b }
>> okugatta(3, 4) ¶    // → 7

ekitangiriro(n) {
    ? n <= 1 { <~ 1 }
    <~ n * ekitangiriro(n - 1)
}
>> ekitangiriro(5) ¶    // → 120
```

Emirimu gina **ekifo ekyawule** — tegisobola kusoma nkyukakyuka eziwerako. Kozesa eby'okuvaamu `<~>` okukyusa nkyukakyuka z'oyo akuyita:

```zymbol
okukyusa(a<~, b<~) {
    eky'okumala = a
    a = b
    b = eky'okumala
}
x = 10
y = 20
okukyusa(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Emirimu erina amannya **bigaso by'ekitundu ekisooka** — bitume butereevu: `enzaala$> okubilamu`. Okukyawa: `x -> emirimu(x)` na kyekyo kikola.

---

## Lambda n'Okukyawa

```zymbol
okubilamu = x -> x * 2
okugatta = (a, b) -> a + b
>> okubilamu(5) ¶    // → 10
>> okugatta(3, 7) ¶  // → 10

// Lambda ey'ekifo
okugereka = x -> {
    ? x > 0 { <~ "ekikulu" }
    _? x < 0 { <~ "ekikyamu" }
    <~ "zero"
}

// Okukyawa — kukwata ekifo eky'ebweru
ekintu = 3
okusatu = x -> x * ekintu
>> okusatu(7) ¶    // → 21

// Eky'okukola
omukola_okugatta(n) { <~ x -> x + n }
okugatta_kumi = omukola_okugatta(10)
>> okugatta_kumi(5) ¶    // → 15

// Mu lunyiriri
ebikozesebwa = [x -> x+1, x -> x*2, x -> x*x]
>> ebikozesebwa[3](5) ¶    // → 25
```

---

## Olunyiriri

Olunyiriri **lusobola okukyuka** era lulina ebintu **ebya nkola emu**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — okutuukako (1-omusingi: ekintu ekisooka)
x = arr[-1]     // 5 — ekyawandiikibwa ekikyamu (ekintu ekisembayo)
x = arr$#       // 5 — obuanvu (kozesa (arr$#) mu >>)

arr = arr$+ 6            // gatta → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // teeka mu kifo 2 (1-omusingi)
arr3 = arr$- 3           // nukula okubeerawo okusooka kw'omugaso
arr4 = arr$-- 3          // nukula okubeerawo kwonna
arr5 = arr$-[1]          // nukula ku ekyawandiikibwa 1 (ekintu ekisooka)
arr6 = arr$-[2..3]       // nukula ekitundu (1-omusingi, akama akasembayo akakozesebwa)

kiri = arr$? 3            // #1 — kirimu
ebifo = arr$?? 3           // [3] — ekyawandiikibwa kyonna eky'omugaso (1-omusingi)
ekitundu = arr$[1..3]          // [1,2,3] — ekitundu (1-omusingi, akama akasembayo akakozesebwa)
ekitundu2 = arr$[1:3]          // [1,2,3 — kimu, enkola ey'omusingi gw'okubala

okulinnya = arr$^+             // tekateka okulinnya (eby'omusingi byokka)
okukka = arr$^-            // tekateka okukka (eby'omusingi byokka)

// Ennyiriri za tuple erina amanna/ekifo — kozesa $^ n'okugeraageranya lambda
ensibuko = [(erinnya: "Carla", emyaka: 28), (erinnya: "Ana", emyaka: 25), (erinnya: "Bob", emyaka: 30)]
okwemyaaka  = ensibuko$^ (a, b -> a.emyaka < b.emyaka)    // okwemyaaka okulinnya (<)
okwerya = ensibuko$^ (a, b -> a.erinnya > b.erinnya)   // okwerya okukka (>)
>> okwemyaaka[1].erinnya ¶     // → Ana
>> okwerya[1].erinnya ¶    // → Carla

// Okukyuusa ekintu butereevu (olunyiriri lwokka)
arr[1] = 99              // gabiza
arr[2] += 5              // okukola okukola: +=  -=  *=  /=  %=  ^=

// Okukyuusa okukola — kiddayo olunyiriri oluggya; olwasooka tekukyuka
arr2 = arr[2]$~ 99
```

> Ebikozesebwa by'okukuŋŋaanya byonna kiddayo **olunyiriri oluggya**. Gabiza n'emu: `arr = arr$+ 4`.
> `$+` eyinza okugattibwa: `arr = arr$+ 5$+ 6$+ 7`. Ebikozesebwa ebirala bikozesa okugabiza okwa wakati.
> **Ekyawandiikibwa 1-omusingi**: `arr[1]` ye kintu ekisooka; `arr[0]` ye balaza mu kiseera ky'okudduka.

**Okutegeera kw'omugaso** — okugabiza olunyiriri ku nkyukakyuka endala kukola kopi eyeewala:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b tekukyuka
```

```zymbol
// Ennyiriri ezikyawa (ekyawandiikibwa 1-omusingi)
ematirikisi = [[1,2,3],[4,5,6],[7,8,9]]
>> ematirikisi[2][3] ¶    // → 6  (olunyiriri 2, empagi 3)
```

---

## Okumenya Enkula

```zymbol
// Olunyiriri
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[okusooka, *ekisigale] = arr         // okusooka=10  ekisigale=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ kuvaako

// Tuple ekifo
ekifo = (100, 200)
(px, py) = ekifo             // px=100  py=200

// Tuple erina erinnya
omuntu = (erinnya: "Ana", emyaka: 25, ekibuga: "Madrid")
(erinnya: n, emyaka: e) = omuntu   // n="Ana"  e=25
```

---

## Tuple

Tuple zibye ebibya ebitondekeddwa **ebitakyukamu** ebisobola okutereka ebigaso **ebya nkola ez'enjawulo**.
Mu ngeri ey'awamu n'olunyiriri, ebintu tebisobola kukyuka oluvanyuma lw'okutondebwa.

```zymbol
// Ekifo — enkola ez'enjawulo zikkirizibwa
ekifo = (10, 20)
>> ekifo[1] ¶    // → 10

ebiwandiiko = (42, "Nkulamusizza", #1, 3.14)
>> ebiwandiiko[3] ¶     // → #1

// Erina erinnya
omuntu = (erinnya: "Alice", emyaka: 25)
>> omuntu.erinnya ¶    // → Alice
>> omuntu[1] ¶      // → Alice  (ekyawandiikibwa nakyo kikola, 1-omusingi)

// Ekikyawa
ekifo = (x: 10, y: 20)
p = (ekifo: ekifo, akabonero: "ensibuko")
>> p.ekifo.x ¶        // → 10
```

**Okutatukyuka** — okugezaako kwonna okukyusa ekintu kya tuple kya balaza mu kiseera ky'okudduka:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ balaza mu kiseera ky'okudduka: tuple tezikyuka
// t[1] += 5    // ❌ balaza y'emu
```

Okufuna omugaso ogukyusiddwa, kozesa `$~` (okukyuusa okukola) — kiddayo **tuple empya**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← eyasooka tekukyuka
>> t2 ¶    // → (10, 999, 30)

// Tuple erina erinnya — zimbulula mu ngeri ey'oluggi
omuntu = (erinnya: "Alice", emyaka: 25)
omukulu  = (erinnya: omuntu.erinnya, emyaka: 26)
>> omuntu.emyaka ¶    // → 25
>> omukulu.emyaka ¶     // → 26
```

---

## Emirimu Egy'omutendera Ogwa Waggulu

```zymbol
enzaala = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

okubilamu  = enzaala$> (x -> x * 2)                  // map  → [2,4,6…20]
ezigabanya    = enzaala$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
awamu    = enzaala$< (0, (ekuŋŋaanya, x) -> ekuŋŋaanya + x)     // reduce → 55

// Okugatta mu kifo ky'okuwakati
ekitambiro1 = enzaala$| (x -> x > 3)
ekitambiro2 = ekitambiro1$> (x -> x * x)
>> ekitambiro2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Emirimu erina amannya gisobola okutumibwa butereevu ku HOF
okubilamu(x) { <~ x * 2 }
kinene(x) { <~ x > 5 }
r = enzaala$> okubilamu       // ✅ okulambula okutereevu
r = enzaala$| kinene       // ✅ okulambula okutereevu
```

---

## Eky'okozesa eky'omuyungo

Ekipapula ekya ddyo bulijjo kyeetaaga `_` nga ekifo ky'omugaso ogugobererwa:

```zymbol
okubilamu = x -> x * 2
okugatta = (a, b) -> a + b
okwongera = x -> x + 1

r1 = 5 |> okubilamu(_)        // → 10
r2 = 10 |> okugatta(_, 5)       // → 15
r3 = 5 |> okugatta(2, _)        // → 7

// Okugatta
r = 5 |> okubilamu(_) |> okwongera(_) |> okubilamu(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Okutwala Ensobi

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "okugabanya ne zero" ¶
} :! {
    >> "ebirala: " _err ¶    // _err kuuma obubaka bw'ensobi
} :> {
    >> "bwe bwe tukola" ¶
}
```

| Enkola | Lwaki |
|------|------|
| `##Div` | Okugabanya ne zero |
| `##IO` | Fayiro / enkola |
| `##Index` | Ekyawandiikibwa ebweru w'ebitundu |
| `##Type` | Enkola teegeraaganya |
| `##Parse` | Okukubaganya ebiwandiiko |
| `##Network` | Ensobi z'omutimbagano |
| `##_` | Ensobi yonna (kukwata-byonna) |

---

## Amoodulu

```zymbol
// lib/calc.zy — omubiri gw'amoodulu guzingiddwa mu by'okukyawa
# calc {
    #> { okugatta, get_PI }

    _π := 3.14159
    okugatta(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // erinnya erirala libeerawo

>> c::okugatta(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Okuvaamu n'erinnya erirala erya wabweru
# mylib {
    #> { _okugatta_munda => awamu }

    _okugatta_munda(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::awamu(3, 4) ¶    // → 7  (erinnya erya munda _okugatta_munda likwese)
```

> **Amateeka g'amoodulu**: mu `# erinnya { }`, `#>`, okutegeera kw'emirimu, n'okutandika kw'enkyukakyuka/ebitali byakyuka eby'awandiikibwa byokka by'akkirizibwa. Ebigambo ebikola (`>>`, `<<`, loops, n'ebirala) bireeta ensobi E013.

---

## Enkola z'Enzaala

Zymbol eyinza okulaga enzaala mu **69 ekyawandiikibwa eky'enamba kya Unicode** — Devanagari, Arab-Indian, Thai, Klingon pIqaD, Mathematical Bold, ebitundu bya LCD, n'ebirala. Enkola ekola ekosa okuvaamu `>>` kwokka; okubala mu munda kwe kukola eza binary.

### Okukola ekyawandiikibwa

Wandiika ezaala `0` ne `9` z'ekyawandiikibwa ekigendererwa mu `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arab-Indian (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // komawo ku ASCII
```

### Okuvaamu n'ebya bbulini

```zymbol
x = 42
>> x ¶          // → 42   (ekitegekwa kya ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (ekitundu eky'ekitundu eky'omutindo kya ASCII bulijjo)
>> 1 + 2 ¶      // → ३

// Bbulini: eky'omumulu # kya ASCII bulijjo, enamba ekola
>> #1 ¶         // → #१   (ddala mu Devanagari)
>> #0 ¶         // → #०   (kitali — kye kyawuka ku ० ekibalirampimba zero)

x = 28 > 4
>> x ¶          // → #१   (ekivaamu mu kugeraageranya kigoberera enkola ekola)
```

### Enamba ez'awandiikibwa ez'omu nsinso mu kkoodi ey'ensibuko

Enamba z'ekyawandiikibwa kyonna eky'okuwagira ze bigambo eby'awandiikibwa eby'omugaso — mu bitundu, modulo, okugeraageranya:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Ebigambo eby'awandiikibwa ebya Bbulini mu kyawandiikibwa kyonna

`#` + enamba `0` oba `1` okuva mu kifo kyonna kya kigambo eky'awandiikibwa eky'omugaso:

```zymbol
#०९#
akola = #१        // kimu ne #1
>> akola ¶        // → #१
>> (#१ && #०) ¶ // → #०
```

> `#` **kya ASCII bulijjo**. `#0` (kitali) bulijjo kye kyawuka mu maaso ku `0` (ekibalirampimba zero) mu kyawandiikibwa kyonna.

---

## Eby'okukozesa eby'Ebyawandiikibwa

```zymbol
// Okukyusa enkola
f = ##.42         // → 42.0  (ku ekiyita)
i = ###3.7        // → 4     (ku kibalirampimba, okwebulungudza)
t = ##!3.7        // → 3     (ku kibalirampimba, okutema)

// Okukubaganya ekigambo ku nzaala
v1 = #|"42"|      // → 42  (ekibalirampimba)
v2 = #|"3.14"|    // → 3.14  (ekiyita)
v3 = #|"abc"|     // → "abc"  (bulinda, tewali nsobi)

// Okwebulungudza / okutema
π = 3.14159265
okwebulungudza2 = #.2|π|      // → 3.14  (webulungudza ku bifo 2 eby'ekitundu)
okwebulungudza4 = #.4|π|      // → 3.1416
okutema2 = #!2|π|      // → 3.14  (okutema)

// Okukola enfuga y'enamba
enfuga = #,|1234567|  // → 1,234,567  (ekyawule akakoma)
ekya sayansi = #^|12345.678|    // → 1.2345678e4  (ekya sayansi)

// Ebigambo eby'awandiikibwa eby'omusingi
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binary)
c = 0o101        // → 'A'  (octal)

// Okuvaamu okukyusa omusingi
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Okukwataganya n'Obubaka bwa Shell

```zymbol
olunaku = <\ date +%Y-%m-%d \>     // kukwata stdout (okuli \n ku nkomerero)
>> "Leero: " olunaku

fayiro = "data.txt"
ebirimu = <\ cat {fayiro} \>      // okuteekamu mu biragiro

okuvaamu = </"./subscript.zy"/>   // okukola ekyawandiikibwa ekirala ekya Zymbol, kukwata okuvaamu
>> okuvaamu
```

> `><` kukwata ebigambo bya CLI nga lunyiriri lw'ebigambo (tree-walker kwokka).

---

## Ekyokulabirako Eky'ekikunizo: FizzBuzz

```zymbol
okugereka(enzaala) {
    ? enzaala % 15 == 0 { <~ "FizzBuzz" }
    _? enzaala % 3  == 0 { <~ "Fizz" }
    _? enzaala % 5  == 0 { <~ "Buzz" }
    _ { <~ enzaala }
}

@ i:1..20 { >> okugereka(i) ¶ }
```

---

## Okulambula kw'Akabonero

| Akabonero | Omukolo | Akabonero | Omukolo |
|--------|-----------|--------|-----------|
| `=` | enkyukakyuka | `$#` | obuanvu |
| `:=` | ekitali kyakyuka | `$+` | gatta (eyinza okugattibwa) |
| `>>` | okuvaamu | `$+[i]` | teeka ku kyawandiikibwa (1-omusingi) |
| `<<` | okuyingiza | `$-` | nukula ekisooka ng'oyita mu mugaso |
| `¶` / `\\` | omulongo omuggya | `$--` | nukula byonna ng'oyita mu mugaso |
| `?` | bwe kiba | `$-[i]` | nukula ku kyawandiikibwa (1-omusingi) |
| `_?` | oba bwe kiba | `$-[i..j]` | nukula ekitundu (1-omusingi) |
| `_` | oba / akabonero ak'ensiko | `$?` | kirimu |
| `??` | okugeraageranya | `$??` | noonya ebifo byonna (1-omusingi) |
| `@` | loop | `$[s..e]` | ekitundu (1-omusingi) |
| `@ N { }` | loop N emirundi | `$>` | map |
| `@!` | menya | `$\|` | filter |
| `@>` | endaayo | `$<` | reduce |
| `@:erinnya { }` | loop erina akabonero | `$/ ekyawula` | gabula ekigambo |
| `@:erinnya!` | menya akabonero | `$++ a b c` | okuzimba okugatta |
| `@:erinnya>` | endaayo ku kabonero | `arr[i>j>k]` | ekyawandiikibwa eky'okuyita |
| `->` | lambda | `arr[i] = omugaso` | kyusa ekintu (olunyiriri lwokka) |
| `arr[i] += omugaso` | okukyusa okukola | `arr[i]$~` | okukyusa okukola (kopi empya) |
| `$^+` | tekateka okulinnya (eby'omusingi) | `$^-` | tekateka okukka (eby'omusingi) |
| `$^` | tekateka n'okugeraageranya (tuple) | `<~` | kidda |
| `\|>` | omuyungo | `!?` | gezaako |
| `:!` | kwata | `:>` | ku nkomerero |
| `#1` | ddala | `#0` | kitali |
| `$!` | kiba nsobi | `$!!` | kusindika ensobi |
| `<#` | ingiza | `#>` | fulumya |
| `#` | langa moodulu | `::` | yita moodulu |
| `.` | tuukako ku nsonda | `#?` | eby'omunda eby'enkola |
| `#\|..\|` | kubaganya enzaala | `##.` | kyusa ku ekiyita |
| `###` | kyusa ku kibalirampimba (webulungudza) | `##!` | kyusa ku kibalirampimba (tema) |
| `#.N\|..\|` | webulungudza | `#!N\|..\|` | tema |
| `#,\|..\|` | enfuga y'akakoma | `#^\|..\|` | sayansi |
| `#d0d9#` | kyusa enkola y'enamba | `#09#` | komawo ku ASCII |
| `<\ ..\>` | kola shell | `>\<` | ebigambo bya CLI |
| `\ enkyukakyuka` | zikiriza enkyukakyuka mu ngeri ey'oluggi | `°x` / `x°` | okukola okw'ekibugumu (okutandika kyokka) |
| `>>|` | ekifo kya TUI (ekituli ekirala) | `>>~` | okuvaamu mu kifo |
| `>>!` | nokoola ekituli | `>>?` | baza obunene bw'ekitundu |
| `<<\|` | okukuba akabonero okuggalawo | `<<\|?` | okwekalakaasa okukuba akabonero okutaggalawo |
| `@~ N` | yeebaka N millisekondi | `$*` | damu ekigambo N emirundi |

---

## Ebyakyuka mu Kufulumya

### v0.0.5 — Eby'omugaso bya TUI, Okukola okw'ekibugumu & Okudamu Ekigambo _(Meeza 2026)_

- **Okumenya** Ekyawula ekikono eky'okugeraageranya: `ekifaananyi : ekyavaamu` → `ekifaananyi => ekyavaamu`
- **Okumenya** Erinnya erirala ery'okuyingiza: `<# ekkubo <= erinnya erirala` → `<# ekkubo => erinnya erirala`
- **Okumenya** Okukyuusa erinnya ery'okufulumya: `#> { fn <= eri wabweru }` → `#> { fn => eri wabweru }`
- **Kyongeddwako** Ekifo kya TUI `>>| { }` — ekituli ekirala + enkola ya kanyala; nokoola nga wafuluma
- **Kyongeddwako** Okuvaamu mu kifo `>>~ (olunyiriri, empagi, BKS, fg, bg) > ebintu` — ebifo ebitono, amabala ga ANSI 256
- **Kyongeddwako** Okuyingiza akabonero `<<| enkyukakyuka` (oggalawo) ne `<<|? enkyukakyuka` (okwekalakaasa okutaggalawo)
- **Kyongeddwako** `>>!` nokoola ekituli, `>>?` baza obunene bw'ekitundu, `@~ N` yeebaka N millisekondi
- **Kyongeddwako** Okukola okw'ekibugumu `°x` / `x°` — tandika enkyukakyuka kyokka ku kukozesebwa okusooka mu loops
- **Kyongeddwako** Okudamu ekigambo `ekigambo $* N` — damu ekigambo N emirundi
- **VM** Okwenkanakana: 436/436 okwegesa kuwedde

### v0.0.4 — Ekyawandiikibwa 1-omusingi, Emirimu gy'Ekitundu Ekisooka & Amoodulu g'Ekifo _(Apuli 2026)_

- **Okumenya** Ekyawandiikibwa kyonna kyakyusibwa mu **1-omusingi** — `arr[1]` kye kintu ekisooka; `arr[0]` kya balaza mu kiseera ky'okudduka
- **Kyongeddwako** Emirimu erina amannya **bigaso by'ekitundu ekisooka** — bituma butereevu ku HOF: `enzaala$> okubilamu`
- **Kyongeddwako** **Enkola y'ekifo ebeererawo** ku moodulu: `# erinnya { ... }` — enkola ya batule yaggyibwako
- **Kyongeddwako** Ekyawandiikibwa eky'emigezo mingi: `arr[i>j>k]` (okuyita), `arr[p ; q]` (okufulumya okw'ebatule)
- **Kyongeddwako** Okukyusa enkola: `##.ekigambo` (ekiyita), `###ekigambo` (ekibalirampimba webulungudza), `##!ekigambo` (ekibalirampimba tema)
- **Kyongeddwako** Okugabanya ekigambo: `ekigambo$/ ekyawula` — kiddayo `Array(ekigambo)`
- **Kyongeddwako** Okuzimba okugatta: `omusingi$++ a b c` — gatta ebintu bingi
- **Kyongeddwako** Loop y'emirundi: `@ N { }` — damu butereevu N emirundi
- **Kyongeddwako** Enkola y'loop erina akabonero: `@:erinnya { }`, `@:erinnya!`, `@:erinnya>` — kidduka mu kifo kya `@ @erinnya` / `@! erinnya`
- **Kyongeddwako** Amateeka g'ekifo ky'enkyukakyuka: enkyukakyuka `_erinnya` zina ekifo ky'ekifo ekituufu; `\ enkyukakyuka` zikiriza
- **Kyongeddwako** Enkola z'okugeraageranya okugeraageranya: `< 0 =>`, `> 5 =>`, `== 42 =>`, n'ebirala
- **Kyongeddwako** Ensobi y'amoodulu E013: ebigambo ebikola mu mubiri gw'amoodulu tebikkirizibwa
- **Kyeddiddwako** `alias.CONST` kati kukola butereevu; `#>` kiyinza okulabika oluvanyuma lw'okutegeera kw'emirimu
- **VM** Okwenkanakana okujjudde: 393/393 okwegesa kuwedde

### v0.0.3 — Enkola z'Enzaala za Unicode & Enkulakulana za LSP _(Apuli 2026)_

- **Kyongeddwako** 69 ebitundu by'enamba za Unicode n'akabonero k'okukyusa enkola `#d0d9#`
- **Kyongeddwako** Ebigambo eby'awandiikibwa ebya Bbulini mu kyawandiikibwa kyonna — `#१` / `#०`, `#१` / `#०`, n'ebirala
- **Kyongeddwako** Enamba za Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Kyongeddwako** Opcode ya VM `SetNumeralMode` — okwenkanakana okujjudde ne tree-walker
- **Kyakyusiddwako** Okuvaamu kwa Bbulini `>>` kati kuliko eky'omumulu `#` (`#0` / `#1`) mu nkola zonna

### v0.0.2_01 — Okukyuusa Erinnya ly'Eky'okukozesa _(30 Maaki 2026)_

- **Kyakyusiddwako** `c|..|` → `#,|..|` ne `e|..|` → `#^|..|` — okwenkanakana n'amaka g'eky'omumulu `#`
- **Kyongeddwako** Erinnya erirala ery'okufulumya: fulumya n'emu ab'amoodulu mu linnya erirala

### v0.0.2 — Okukola Enkula Empya ya API y'Okukuŋŋaanya & Eby'okuteeka _(24 Maaki 2026)_

- **Kyongeddwako** Amaka g'eky'okukozesa `$` egy'omugatte g'ennyiriri n'ebigambo (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Kyongeddwako** Okugabiza okumenya enkula kw'ennyiriri, tuple, ne tuple erina amannya
- **Kyongeddwako** Ekyawandiikibwa ekikyamu (`arr[-1]` = ekintu ekisembayo)
- **Kyongeddwako** Eby'okuteeka eby'ensibuko — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Maaki 2026)_

- **Kyongeddwako** Okugabiza okukola `^=`
- **Kyeddiddwako** Ebifo eby'oku ntikko eby'okubala eby'omukubaganya; okukola bulungi ebiwandiiko

### v0.0.1 — Okufulumya Okusooka eri Bonna _(22 Maaki 2026)_

- Omukyusizi tree-walker + VM ey'okuwandiisa (`--vm`, ~4× empusampaavu, ~95% okwenkanakana)
- Enkula zonna eza msingi: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Ebyawandiikibwa bya Unicode eby'ekikunizo, enkola y'amoodulu, lambda, okukyawa, okutwala ensobi
- REPL, LSP, ekika eky'okwongerako kya VS Code, ekikola enfuga (`zymbol fmt`)

---

_Zymbol-Lang — Ekya Kabonero. Ekya Wansi Wonna. Ekitakyukamu._
