> **Uñakipaña:** Aka yatiyaña IA (inteligencia artificial) lurasïwa.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Nayriri amtawi **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** intérprete qillqanakan utjawa.

---

# Zymbol-Lang Manual

> **Qhanañ v0.0.5 ukama — 2026-05-12**

**Zymbol-Lang** señalankiri luraña arupaki. Jan sutini — taqpach señalawa. Taqi jaqi arupa ukana ukhamaki luratarakiwa.

- Jan `if`, `while`, `return` — mä `?`, `@`, `<~`
- Taqi Unicode — suti taqi arupa utjaraki ukana
- Jaqi arupa jan wakisi — lurawi taqpacha ukhamakiwa

**Lurawi wiri**: v0.0.5 | **Yatiqawi**: 436/436 (TW ↔ VM ukhamaki)

---

## Jark'atawi ukhamaraki Thuqhuri

```zymbol
x = 10              // muyu jarka
PI := 3.14159       // thuqhuri — jan jaqukiptaña runa pantiriwa
suti = "Sonia"
luriri = #1         // cheqa luriri
👋 := "Kamisaraki"
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

`°` (U+00B0) jark'atawi nayriri yatichiña mä amtawiru:

```zymbol
jakhunaka = [3, 1, 4, 1, 5]
@ n:jakhunaka {
    °taypi += n    // 0-manta qalltiña; @ tukuyata jutaski
}
>> taypi ¶         // → 14
```

> `°x` (nayriri) muyuña patankiri jark'ata — kutt'ayaña @ tukuyata ukana.
> `x°` (tukuya) muyuña ukana jark'ata — tukuyaña @ tukuyata ukana.
> Tree-walker mä.

---

## Amtawi Yatiña

| Yatiña | Qillqa | `#?` | Amtawi |
|--------|--------|------|--------|
| Int | `42`, `-7` | `###` | 64-bit firmado |
| Float | `3.14`, `1.5e10` | `##.` | Yatiña kimüntun OK |
| Qillqa | `"arupa"` | `##"` | Mantaña: `"Kamisaraki {suti}"` |
| Mä Qillqa | `'A'` | `##'` | Maya Unicode |
| Cheqa | `#1`, `#0` | `##?` | Jan jakhu — `#1 ≠ 1` |
| Katanka | `[1, 2, 3]` | `##]` | Ukhamaki amtawi |
| Mä Juthawi | `(a, b)` | `##)` | Jakhu ukana |
| Sutichiña Juthawi | `(x: 1, y: 2)` | `##)` | Sutichiña zugumeal |
| Luraña | sutichiña luraña | `##()` | Nayriri; `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Nayriri; `<lambd/N>` |

```zymbol
// Yatiña uñakipaña — kutt'ayaña (yatiña, jakhunaka, amtawi)
amtawi = 42#?
>> amtawi ¶         // → (###, 2, 42)
t = amtawi[1]
>> t ¶            // → ###
```

---

## Apsuña ukhamaraki Mantaña

```zymbol
>> "Kamisaraki" ¶                 // ¶ utjamaraki \\ saraña satawi
>> "a=" a " b=" b ¶               // junthapiña — jisk'a amtawi
>> (arr$#) ¶                      // satawi señalanak ( ) >> ukana

<< suti                           // yatiqaña jark'atawiru (jan yatichiña)
<< "Sutixa: " suti                // yatichiña ukhamarak
```

> `¶` (AltGr+R español teclado ukana) ukhamaraki `\\` ukhamaki saraña satawi.

---

## TUI Yatiqawi

Terminal UI señalanak lurawi amparanak. Mä `>>| { }` wakisi (pantalla ukha + modo crudo).

```zymbol
>>| {
    >>!                             // pantalla chuymaña
    >>~ (1, 1, 0, 10) > "Sarañani"  // uka 1, tira 1, fg=10 (qumir)
    @~ 1000                         // saraña 1 segundo (1000 ms)
    >>~ (2, 1) > "Tukuyata."
}
// terminal kutt'ayata tukuyata sarañataki
```

```zymbol
// Señal ukhamaraki terminal lurawi
>>| {
    [lurawi, tira] = >>?            // terminal jakhunaka yatiqaña
    >>~ (1, 1) > "Terminal: " lurawi " x " tira
    <<| señal                       // señal luraña (saraña)
    >>~ (2, 1) > "Lurasïwa: " señal
}
```

> `>>!` pantalla chuymaña. `>>?` kutt'ayaña `[lurawi, tira]`. `@~ N` saraña N ms.
> `<<|` maya señal (saraña); `<<|?` jan saraña (kutt'ayaña `'\0'` jan utjañataki).
> Apsuña tuple: `(uka, tira, BKS, fg, bg)` — wali wali coma ukana (`>>~ (,,, 196) > "wila"`).
> BKS: `1`=Negrita, `2`=Cursiva, `4`=Subrayado. ANSI 256 sami (`0`=terminal nayriri).
> Tree-walker mä (jan `>>!`, `>>?`, `@~`, `>>~` `--vm` ukana luratarakiwa).

---

## Luraña Señalanak

```zymbol
// Jakhu Señalanak
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (jakhu chiqatawi)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (jakhu patankiri)

// Uñakipaña — amtawi yatiña
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Cheqa Señalanak
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Qillqanaka

```zymbol
// Paya junthapiña yatiña
suti = "Sonia"
n = 42

>> "Kamisaraki " suti " jakhu " n ¶    // junthapiña — >> ukana
arupa = "Kamisaraki {suti}, jakhu {n}"  // mantaña — taqi ukana
```

```zymbol
s = "Kamisaraki Pacha"
jakhus = s$#                // 16
wali_s = s$[1..9]           // "Kamisarak"  (1-sata, tukuya ukhumaki)
monti = s$? "Pacha"         // #1
jiskana = "a,b,c,d"$/ ','   // [a, b, c, d]  (ch'axwa ukhumak)
jayrant = s$~~["a":"A"]     // "KAmiSArAki PAchA"
jayrant1 = s$~~["a":"A":1]  // "KAmiSaraki Pacha"  (maya mä)
sara = "─" $* 20            // "────────────────────"  (N juk'ampi)
```

> `+` jakhu mä. Kümekawün `,`, junthapiña, utjaraki mantaña qillqa ukana.

---

## Qhanañ Sartaña

```zymbol
x = 7

? x > 0 { >> "wali" ¶ }

? x > 100 {
    >> "jacha" ¶
} _? x > 0 {
    >> "wali" ¶
} _? x == 0 {
    >> "cero" ¶
} _ {
    >> "jani" ¶
}
```

> `{ }` **wakisiwa** maya lurawi ukana ukhmarusa.

---

## Junthapiña

```zymbol
// Jakhu Sara
jakhu = 85
thuqhu = ?? jakhu {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> thuqhu ¶    // → B

// Qillqanaka
sami = "wila"
amtawi = ?? sami {
    "wila"  => "#FF0000"
    "qumir" => "#00FF00"
    _       => "#000000"
}

// Uñakipaña Yatiña
chiri = -5
uñchi = ?? chiri {
    < 0  => "chullumpi"
    < 20 => "chirijama"
    < 35 => "luqui"
    _    => "juntu"
}
>> uñchi ¶    // → chullumpi

// Lurawi yatiña (bloque lurawi)
n = -3
?? n {
    0    => { >> "cero" ¶ }
    < 0  => { >> "jani" ¶ }
    _    => { >> "wali" ¶ }
}
```

---

## Muyuntaña

```zymbol
@ i:0..4  { >> i " " }        // jakhu sara:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // pasunaka mä:  1 3 5 7 9
@ i:5..0:1 { >> i " " }       // kutt'ayaña:   5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (saraña)

michikas = ["manzana", "pera", "uva"]
@ f:michikas { >> f ¶ }        // @ katanka ukana

@ c:"kamisaraki" { >> c "-" }
>> ¶                           // → k-a-m-i-s-a-r-a-k-i-  (@ qillqa ukana)

@ i:1..10 {
    ? i % 2 == 0 { @> }        // @> saraña
    ? i > 7 { @! }              // @! tukuyaña
    >> i " "
}
>> ¶                           // → 1 3 5 7

// Taqi muyuña
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                           // → 1 2 3 4

// Sutichiña muyuña (patankiri tukuyaña)
jakhu_k = 0
@:nayriri {
    jakhu_k++
    ? jakhu_k >= 3 { @:nayriri! }
}
>> jakhu_k ¶                   // → 3
```

---

## Luraña

```zymbol
junta(a, b) { <~ a + b }
>> junta(3, 4) ¶    // → 7

jakhu_patank(n) {
    ? n <= 1 { <~ 1 }
    <~ n * jakhu_patank(n - 1)
}
>> jakhu_patank(5) ¶    // → 120
```

Luraña **jark'ata sara** — jan uka jark'atawi luraña uñakipaña. `<~` kümekawün:

```zymbol
jayrant(a<~, b<~) {
    ikina = a
    a = b
    b = ikina
}
x = 10
y = 20
jayrant(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Sutichiña luraña **nayriri amtawi** — mä sara: `jakhunaka$> payachta`. Mantaña: `x -> fn(x)` ukhamaki.

---

## Lambda ukhamaraki Jark'aña

```zymbol
payachta = x -> x * 2
tantawi = (a, b) -> a + b
>> payachta(5) ¶    // → 10
>> tantawi(3, 7) ¶    // → 10

// Bloque lambda
thuqhuntaña = x -> {
    ? x > 0 { <~ "wali" }
    _? x < 0 { <~ "jani" }
    <~ "cero"
}

// Jark'aña — uka sara ukana
jakhuru = 3
kimsachta = x -> x * jakhuru
>> kimsachta(7) ¶    // → 21

// Lurawi
junta_lurna(n) { <~ x -> x + n }
junta_tunka = junta_lurna(10)
>> junta_tunka(5) ¶    // → 15

// Katanka ukana
lurunak = [x -> x+1, x -> x*2, x -> x*x]
>> lurunak[3](5) ¶    // → 25
```

---

## Katankanaka

Katanka **muyu** ukhamaraki amtawi **ukhamaki yatiña** jark'atarakiwa.

```zymbol
katank = [1, 2, 3, 4, 5]

x = katank[1]      // 1 — luraña (1-sata: nayriri)
x = katank[-1]     // 5 — jani wali jakhu (tukuya)
x = katank$#       // 5 — jakhu (kümekawün (katank$#) >> ukana)

katank = katank$+ 6            // junta → [1,2,3,4,5,6]
katank2 = katank$+[2] 99       // mantaña 2 ukana (1-sata)
katank3 = katank$- 3           // apsuña nayriri
katank4 = katank$-- 3          // apsuña taqini
katank5 = katank$-[1]          // apsuña 1 jakhu ukana (nayriri)
katank6 = katank$-[2..3]       // apsuña sara (1-sata, tukuya ukhumaki)

monti = katank$? 3             // #1 — utji
taqi_k = katank$?? 3           // [3] — taqi jakhunaka (1-sata)
wali_s = katank$[1..3]         // [1,2,3] — wali (1-sata, tukuya ukhumaki)
wali_s2 = katank$[1:3]         // [1,2,3] — ukhamaki, jakhutaki yatiña

jayrant_k = katank$^+          // yatiña wali (jakhu mä)
jani_k = katank$^-             // yatiña jani (jakhu mä)

// Sutichiña katanka — kümekawün $^ lambda ukana
amtawi = [(suti: "Carla", marana: 28), (suti: "Ana", marana: 25), (suti: "Bob", marana: 30)]
marana_utt  = amtawi$^ (a, b -> a.marana < b.marana)    // wali marana (<)
suti_utt = amtawi$^ (a, b -> a.suti > b.suti)           // jani suti (>)
>> marana_utt[1].suti ¶     // → Ana
>> suti_utt[1].suti ¶       // → Carla

// Jakhu kutt'ayaña (katanka mä)
katank[1] = 99              // amtaña
katank[2] += 5              // tantawiña: +=  -=  *=  /=  %=  ^=

// Lurawi amtaña — katt'ayaña katanka; nayrir jan jaqukipta
katank2 = katank[2]$~ 99
```

> Taqi katanka señalanak kutt'ayaña **katanka juk'a**. Kutt'ayaña: `katank = katank$+ 4`.
> `$+` tantawiña: `katank = katank$+ 5$+ 6$+ 7`. Ukja señalanak amtawi ukana.
> **Jakhu 1-sata**: `katank[1]` nayriri; `katank[0]` pantiriwa.
> `$^+` / `$^-` **nayriri katanka** (jakhu, qillqa). Tuple katanka `$^` lambda ukana — sara lambda ukana (`<` = wali, `>` = jani).

**Amtawi yatiña** — katanka kutt'ayaña juk'a amtawi luratarakiwa:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b jan jaqukiptata
```

```zymbol
// Patankiri katanka (1-sata)
patana = [[1,2,3],[4,5,6],[7,8,9]]
>> patana[2][3] ¶    // → 6  (uka 2, tira 3)
```

---

## Jaqukipaña

```zymbol
// Katanka
katank = [10, 20, 30, 40, 50]
[a, b, c] = katank              // a=10  b=20  c=30
[nayriri, *juparjama] = katank  // nayriri=10  juparjama=[20,30,40,50]
[x, _, z] = [1, 2, 3]           // _ apsuña

// Mä Juthawi
puntu = (100, 200)
(px, py) = puntu               // px=100  py=200

// Sutichiña Juthawi
jaqi = (suti: "Ana", marana: 25, marka: "Tiwanaku")
(suti: n, marana: a) = jaqi    // n="Ana"  a=25
```

---

## Mä Juthawi

Mä Juthawi **jan jaqukipta** ukana amtawi **taqi yatiña** jark'atarakiwa.
Katanka jani, amtawi jan jaqukiptarakiwa tukuyata.

```zymbol
// Mä Juthawi — taqi yatiña ukhumak
puntu = (10, 20)
>> puntu[1] ¶    // → 10

amtawi = (42, "kamisaraki", #1, 3.14)
>> amtawi[3] ¶     // → #1

// Sutichiña
jaqi = (suti: "Sonia", marana: 25)
>> jaqi.suti ¶    // → Sonia
>> jaqi[1] ¶      // → Sonia  (jakhu ukhumaki, 1-sata)

// Patankiri
puntu_pos = (x: 10, y: 20)
p = (puntu: puntu_pos, suti: "nayriri")
>> p.puntu.x ¶        // → 10
```

**Jan Jaqukipaña** — amtawi kutt'ayaña runa pantiriwa:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ runa pantiri: mä juthawi jan jaqukiptatarakiwa
// t[1] += 5    // ❌ ukhamaki pantiri
```

Amtawi kutt'ayaña `$~` kümekawün (lurawi kutt'ayaña) — **mä juthawi juk'a** kutt'ayaña:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← nayrir jan jaqukiptata
>> t2 ¶    // → (10, 999, 30)

// Sutichiña juthawi — juk'ampi kutt'ayaña
jaqi = (suti: "Sonia", marana: 25)
jaqa_k  = (suti: jaqi.suti, marana: 26)
>> jaqi.marana ¶    // → 25
>> jaqa_k.marana ¶     // → 26
```

---

## Patankiri Luraña

```zymbol
jakhunaka = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

payachta_k  = jakhunaka$> (x -> x * 2)              // map  → [2,4,6…20]
wali_w      = jakhunaka$| (x -> x % 2 == 0)          // filter → [2,4,6,8,10]
taypi       = jakhunaka$< (0, (acc, x) -> acc + x)    // reduce → 55

// Tantawiña ukhumarusa
paso1 = jakhunaka$| (x -> x > 3)
paso2 = paso1$> (x -> x * x)
>> paso2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Luraña ukana mä sara
payachta(x) { <~ x * 2 }
jachawi(x) { <~ x > 5 }
r = jakhunaka$> payachta       // ✅ mä sara
r = jakhunaka$| jachawi        // ✅ mä sara
```

---

## Sartaña Señal

Tukuya mä `_` wakisi amtawi ukana:

```zymbol
payachta = x -> x * 2
junta = (a, b) -> a + b
maysaru = x -> x + 1

r1 = 5 |> payachta(_)        // → 10
r2 = 10 |> junta(_, 5)       // → 15
r3 = 5 |> junta(2, _)        // → 7

// Tantawiña
r = 5 |> payachta(_) |> maysaru(_) |> payachta(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Pantiri Uñakipaña

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "cero ukana chiqataña" ¶
} :! {
    >> "ukjama: " _err ¶    // _err pantiri arupa
} :> {
    >> "taqi sarakiwa" ¶
}
```

| Yatiña | Kunata |
|--------|--------|
| `##Div` | Cero ukana chiqataña |
| `##IO` | Qillqa / sistema |
| `##Index` | Jakhu pantiri |
| `##Type` | Yatiña pantiri |
| `##Parse` | Qillqa yatiqaña |
| `##Network` | Red pantiri |
| `##_` | Taqi pantiri (taqini) |

---

## Tantachaña

```zymbol
// lib/calc.zy — tantachaña katanka { } ukana
# calc {
    #> { junta, kuna_PI }

    _PI := 3.14159
    junta(a, b) { <~ a + b }
    kuna_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // sutichiña wakisi

>> c::junta(5, 3) ¶   // → 8
pi = c::kuna_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Apsuña qillqa sutichiña ukana
# milurawi {
    #> { _junta_ikina => tantawi }

    _junta_ikina(a, b) { <~ a + b }
}
```

```zymbol
<# ./milurawi => m

>> m::tantawi(3, 4) ¶    // → 7  (suti _junta_ikina pampachata)
```

> **Tantachaña wakisiña**: mä `#>`, luraña kimüntun, ukhamaraki qillqa jark'atawi `# suti { }` ukana. Lurawi ejecutable (`>>`, `<<`, muyuña, etc.) pantiri E013.

---

## Jakhu Yatiña

Zymbol jakhu apsuña **69 Unicode jakhu qillqa** — Devanagari, Árabe-Índico, Thai, Klingon pIqaD, Matemática Negrita, LCD, ukhamaraki. Nayriri yatiña mä `>>` apsuña ukana; jakhu kiñe binary mä.

### Qhanañ Jikxatasiri

Qillqa `0` ukhamaraki `9` yatiña `#…#` ukana:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Árabe-Índico (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // ASCII-ru kutt'ayaña
```

### Apsuña ukhamaraki Cheqanaka

```zymbol
x = 42
>> x ¶          // → 42   (ASCII nayriri)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (punto ASCII mä)
>> 1 + 2 ¶      // → ३

// Cheqa: # ASCII mä, jakhu lurawi ukana
>> #1 ¶         // → #१   (cheqa Devanagari ukana)
>> #0 ¶         // → #०   (jani — jan ukhamaki ० jakhu cero)

x = 28 > 4
>> x ¶          // → #१   (uñakipaña lurawi nayriri ukana)
```

### Jakhu Qillqa Nayriri

Taqi yatiña jakhu qillqa nayriri — sara, modulo, uñakipaña ukana:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Cheqa Qillqa Jikxatasiri

`#` + jakhu `0` utjaraki `1` taqi yatiña ukana cheqa qillqa:

```zymbol
#٠٩#
luriri = #١        // ukhamaki #1
>> luriri ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **ASCII mä**. `#0` (jani) jan ukhamaki `0` (jakhu cero) taqi yatiña ukana.

---

## Amtawi Señalanak

```zymbol
// Yatiña kutt'ayaña
f = ##.42         // → 42.0  (Float-ru)
i = ###3.7        // → 4     (Int-ru, muyt'ayaña)
t = ##!3.7        // → 3     (Int-ru, t'aqutaña)

// Qillqa-manta jakhu
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (jan pantiri)

// Muyt'ayaña / T'aqutaña
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (muyt'ayaña 2 ukana)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (t'aqutaña)

// Jakhu yatiyaña
fmt = #,|1234567|  // → 1,234,567  (coma ukana)
sci = #^|12345.678|    // → 1.2345678e4  (yatiña)

// Jakhu qillqa
a = 0x41         // → 'A'  (hexadecimal)
b = 0b01000001   // → 'A'  (binario)
c = 0o101        // → 'A'  (octal)

// Jakhu qillqa apsuña
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shell Tantachiri

```zymbol
uru = <\ date +%Y-%m-%d \>     // apsuña (tukuya \n ukhumaki)
>> "Kunauru: " uru

qillqa = "amtawi.txt"
ukana = <\ cat {qillqa} \>      // mantaña qillqa ukana

apsuña = </"./milurawi.zy"/>   // Zymbol lurawi, apsuña
>> apsuña
```

> `><` CLI arupa katanka ukana apsuña (tree-walker mä).

---

## Yatiqawi Kumpliru: FizzBuzz

```zymbol
thuqhuntaña(jakhu) {
    ? jakhu % 15 == 0 { <~ "FizzBuzz" }
    _? jakhu % 3  == 0 { <~ "Fizz" }
    _? jakhu % 5  == 0 { <~ "Buzz" }
    _ { <~ jakhu }
}

@ i:1..20 { >> thuqhuntaña(i) ¶ }
```

---

## Señal Amtawi

| Señal | Lurawi | Señal | Lurawi |
|-------|--------|-------|--------|
| `=` | jark'atawi | `$#` | jakhu |
| `:=` | thuqhuri | `$+` | junta (tantawiña) |
| `>>` | apsuña | `$+[i]` | mantaña (1-sata) |
| `<<` | mantaña | `$-` | apsuña nayriri |
| `¶` / `\\` | saraña satawi | `$--` | apsuña taqini |
| `?` | cheqa uñakipaña | `$-[i]` | apsuña jakhu ukana |
| `_?` | jan ukhamaki | `$-[i..j]` | apsuña sara |
| `_` | ukja | `$?` | utji |
| `??` | junthapiña | `$??` | taqi jakhunaka |
| `@` | muyuña | `$[s..e]` | wali |
| `@ N { }` | N muyuña | `$>` | map |
| `@!` | tukuyaña | `$\|` | yatiña |
| `@>` | saraña | `$<` | tantawiña |
| `@:name { }` | sutichiña muyuña | `$/ delim` | qillqa jaqukipaña |
| `@:name!` | sutichiña tukuyaña | `$++ a b c` | tantawiña |
| `@:name>` | sutichiña saraña | `arr[i>j>k]` | sara jakhu |
| `->` | lambda | `arr[i] = val` | jakhu kutt'ayaña |
| `arr[i] += val` | tantawiña kutt'ayaña | `arr[i]$~` | lurawi kutt'ayaña |
| `$^+` | yatiña wali | `$^-` | yatiña jani |
| `$^` | yatiña lambda ukana | `<~` | kutt'ayaña |
| `\|>` | sartaña señal | `!?` | pantiri uñakipaña |
| `:!` | pantiri katana | `:>` | taqi sarakiwa |
| `#1` | cheqa | `#0` | jani |
| `$!` | pantiri kimün | `$!!` | pantiri sartaña |
| `<#` | mantaña | `#>` | apsuña |
| `#` | tantachaña | `::` | tantachaña runa |
| `.` | sutichiña | `#?` | yatiña amtawi |
| `#\|..\|` | qillqa jakhu | `##.` | Float-ru |
| `###` | Int-ru muyt'ayaña | `##!` | Int-ru t'aqutaña |
| `#.N\|..\|` | muyt'ayaña N | `#!N\|..\|` | t'aqutaña N |
| `#,\|..\|` | coma yatiyaña | `#^\|..\|` | yatiña |
| `#d0d9#` | jakhu yatiña | `#09#` | ASCII kutt'ayaña |
| `<\ ..\>` | shell lurawi | `>\<` | CLI arupa |
| `\ var` | jark'atawi apsuña | `°x` / `x°` | nayriri jark'atawi |
| `>>|` | TUI katanka | `>>~` | sara apsuña |
| `>>!` | pantalla chuymaña | `>>?` | terminal jakhu |
| `<<\|` | señal mantaña | `<<\|?` | jan saraña señal |
| `@~ N` | saraña N ms | `$*` | qillqa N juk'ampi |

---

## Apthapiña Amtawi

### v0.0.5 — TUI Yatiqawi, Jark'atawi ukhamaraki Qillqa Kutt'ayaña _(Mayu 2026)_

- **Jan Jaqukiptaña** Junthapiña sartaña: `pattern : result` → `pattern => result`
- **Jan Jaqukiptaña** Mantaña suti: `<# sara <= suti` → `<# sara => suti`
- **Jan Jaqukiptaña** Apsuña sutiñ: `#> { fn <= pub }` → `#> { fn => pub }`
- **Mantaña** TUI `>>| { }` — pantalla ukha + modo crudo; tukuyata kutt'ayaña
- **Mantaña** Sara apsuña `>>~ (uka, tira, BKS, fg, bg) > amtawi` — wali wali, ANSI 256
- **Mantaña** Señal `<<| jark'atawi` (saraña) ukhamaraki `<<|? jark'atawi` (jan saraña)
- **Mantaña** `>>!` pantalla chuymaña, `>>?` terminal jakhu, `@~ N` saraña N ms
- **Mantaña** Nayriri jark'atawi `°x` / `x°` — nayriri amtawiru muyuña ukana
- **Mantaña** Qillqa kutt'ayaña `str $* N` — qillqa N juk'ampi
- **VM** Ukhamaki: 436/436 yatiqawi wali

### v0.0.4 — 1-Sata, Nayriri Luraña & Tantachaña _(Abril 2026)_

- **Jan Jaqukiptaña** Taqi jakhu **1-sata** — `katank[1]` nayriri; `katank[0]` pantiriwa
- **Mantaña** Sutichiña luraña **nayriri amtawi** — mä sara HOF: `jakhunaka$> payachta`
- **Mantaña** Tantachaña **katanka yatiña** wakisi: `# suti { ... }` — jan yatiña apsuñataki
- **Mantaña** Patankiri jakhu: `arr[i>j>k]` (sara), `arr[p ; q]` (apsuña)
- **Mantaña** Yatiña kutt'ayaña: `##.expr` (Float), `###expr` (Int muyt'ayaña), `##!expr` (Int t'aqutaña)
- **Mantaña** Qillqa jaqukipaña: `str$/ delim` — kutt'ayaña `Array(String)`
- **Mantaña** Tantawiña: `base$++ a b c` — juk'ampi amtawi junta
- **Mantaña** N muyuña: `@ N { }` — N juk'ampi lura
- **Mantaña** Sutichiña muyuña: `@:suti { }`, `@:suti!`, `@:suti>` — jan `@ @suti` / `@! suti`
- **Mantaña** Jark'atawi sara: `_suti` bloque ukana; `\ jark'atawi` nayriri apsuña
- **Mantaña** Junthapiña uñakipaña: `< 0 :`, `> 5 :`, `== 42 :` etc.
- **Mantaña** Tantachaña E013 pantiri: lurawi ejecutable tantachaña ukana pantiriwa
- **Kutt'ayaña** `take_variable` jan jaqukiptawi tantachaña amtawi kutt'ayaña
- **Kutt'ayaña** `alias.CONST` wali kutt'ayaña; `#>` luraña tukuyata ukana
- **VM** Ukhamaki: 393/393 yatiqawi wali

### v0.0.3 — Unicode Jakhu Yatiña & LSP Kutt'ayaña _(Abril 2026)_

- **Mantaña** 69 Unicode jakhu qillqa `#d0d9#` ukana
- **Mantaña** Cheqa qillqa taqi yatiña — `#१` / `#०`, `#١` / `#٠`, etc.
- **Mantaña** Klingon pIqaD jakhu (CSUR PUA U+F8F0–U+F8F9)
- **Mantaña** `SetNumeralMode` VM opcode — ukhamaki tree-walker ukana
- **Mantaña** REPL jakhu yatiña apsuña ukhamaraki jark'atawi ukana
- **Jaqukipaña** Cheqa `>>` apsuña `#` ukana (`#0` / `#1`) taqi yatiña

### v0.0.2_01 — Señal Sutiña _(Marzo 2026)_

- **Jaqukipaña** `c|..|` → `#,|..|` ukhamaraki `e|..|` → `#^|..|` — ukhamaki `#` amtawi
- **Mantaña** Apsuña suti: tantachaña amtawi suti ukha apsuña

### v0.0.2 — Katanka API Jaqukipaña & Instaladores _(Marzo 2026)_

- **Mantaña** `$` señal katanka ukhamaraki qillqa ukana (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Mantaña** Jaqukipaña katanka, mä juthawi, ukhamaraki sutichiña juthawi ukana
- **Mantaña** Jani wali jakhu (`katank[-1]` = tukuya)
- **Mantaña** Instaladores — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(Marzo 2026)_

- **Mantaña** Tantawiña `^=`
- **Kutt'ayaña** Parser jakhu lurawi; yatiyaña kutt'ayaña

### v0.0.1 — Nayriri Apsuña _(Marzo 2026)_

- Tree-walker lurawi + register VM (`--vm`, ~4× wali, ~95% ukhamaki)
- Taqi lurawi: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Taqi Unicode suti, tantachaña, lambda, jark'aña, pantiri uñakipaña
- REPL, LSP, VS Code, yatiyaña (`zymbol fmt`)

---

_Zymbol-Lang — Señalankiri. Taqpachani. Jan Jaqukiptawi._
