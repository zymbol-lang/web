> **Limit responsabilite:** Dokiman sa a kreye ak tradui pa entèlijans atifisyèl (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Referans kanonik la se **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** nan depo entèprèt la.

---

# Manyèl Zymbol-Lang

> **Revize pou v0.0.5 — 2026-05-16**

**Zymbol-Lang** se yon lang programasyon senbolik. Pa gen mo kle — tout bagay se yon senbol. Li fonksyone idantikman nan nenpòt lang imen.

- Pa gen `if`, `while`, `return` — sèlman `?`, `@`, `<~`
- Unicode konplè — idantifyan nan nenpòt lang oswa emoji
- Endepandan de lang imen — kòd la se menm tout kote

**Vèsyon entèprèt la**: v0.0.5 | **Kouvèti tès**: 436/436 (parite TW ↔ VM)

---

## Varyab ak Konstan

```zymbol
x = 10              // varyab ki ka chanje
π := 3.14159        // konstan — reyafekte se yon erè tan ekzekisyon
non = "Alice"
aktif = #1         // bouleyen vre
👋 := "Bonjou"
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

`°` (siy degre, U+00B0) inisyalize otomatikman yon varyab nan valè net li nan premye itilizasyon:

```zymbol
nimewo = [3, 1, 4, 1, 5]
@ n:nimewo {
    °total += n    // inisyalizasyon otomatik nan 0 anlè bouk la; siviv apre @
}
>> total ¶         // → 14
```

> `°x` (prefiks) ancre anlè bouk la — rezilta a aksesib apre `@`.
> `x°` (sifiks) ancre andedan bouk la — mouri lè bouk la fini.
> Sèlman tree-walker.

---

## Kalite Done

| Kalite | Literal | Etikèt `#?` | Nòt |
|------|---------|----------|---------|
| Nonb antye | `42`, `-7` | `###` | 64-bit siyen |
| K ap flote | `3.14`, `1.5e10` | `##.` | Notasyon syantifik pèmèt |
| Fisèl | `"tèks"` | `##"` | Entèpolasyon: `"Bonjou {non}"` |
| Karaktè | `'A'` | `##'` | Yon sèl karaktè Unicode |
| Bouleyen | `#1`, `#0` | `##?` | Pa yon nonb — `#1 ≠ 1` |
| Tablo | `[1, 2, 3]` | `##]` | Eleman omojèn |
| Tib | `(a, b)` | `##)` | Pozisyonèl |
| Tib ki gen non | `(x: 1, y: 2)` | `##)` | Chan ki gen non |
| Fonksyon | referans fonksyon ki gen non | `##()` | Premye klas; montre `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Premye klas; montre `<lambd/N>` |

```zymbol
// Entwospèksyon kalite — retounen (kalite, chif, valè)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Sòti ak Antre

```zymbol
>> "Bonjou" ¶                       // ¶ oswa \\ pou yon nouvo liy klè
>> "a=" a " b=" b ¶               // juxtapozisyon — plizyè valè
>> (arr$#) ¶                      // operatè sifiks bezwen ( ) nan >>

>> non                           // li nan varyab (san èd memwa)
>> "Antre non an: " non            // ak èd memwa
```

> `¶` (AltGr+R sou klavye Panyòl la) ak `\\` se nouvo liy ekivalan.

---

## Primitif TUI

Operatè koòdone itilizatè tèminal pou pwogram entèraktif. Pifò bezwen blòk `>>| { }` (ekran altènatif + mòd brit).

```zymbol
>>| {
    >>!                             // netwaye ekran altènatif la
    >>~ (1, 1, 0, 10) > "Ap kouri"   // liy 1, kolòn 1, fg=10 (vèt)
    @~ 1000                         // kanpe pou 1 segonn (1000 ms)
    >>~ (2, 1) > "Fini."
}
// tèminal la retabli otomatikman lè ou sòti
```

```zymbol
// Presyon kle ak gwosè tèminal
>>| {
    [liy, kolòn] = >>?              // mande dimansyon tèminal la
    >>~ (1, 1) > "Tèminal: " liy " x " kolòn
    <<| kle                         // li presyon kle bloke
    >>~ (2, 1) > "Peze: " kle
}
```

> `>>!` netwaye ekran an. `>>?` retounen `[liy, kolòn]`. `@~ N` dòmi N milisgond.
> `<<|` li yon sèl presyon kle (bloke); `<<|?` sonde san bloke (retounen `'\0'` si pa gen anyen).
> Tib sòti pozisyonèl: `(liy, kolòn, BKS, fg, bg)` — nenpòt plas ka omèt ak vigil (`>>~ (,,, 196) > "wouj"`).
> BKS mask bit: `1`=gra, `2`=italik, `4`=souliye. Palèt koulè ANSI 256 (`0`=default tèminal).
> Sèlman tree-walker (eksepte `>>!`, `>>?`, `@~`, `>>~` ki travay nan `--vm` tou).

---

## Operatè

```zymbol
// Aritmetik
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (divizyon nonb antye)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (ekspozan)

// Konparezon — afekte pou enspekte
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Lojik
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Fisèl

```zymbol
// De fòm konkatenasyon
non = "Alice"
n = 42

>> "Bonjou " non " ou gen " n ¶       // juxtapozisyon — nan >>
deskripsyon = "Bonjou {non}, ou gen {n}"     // entèpolasyon — nenpòt kote
```

```zymbol
s = "Bonjou mond"
longè = s$#                  // 11
sou = s$[1..5]             // "Bonjo"  (1-baz, fen enkli)
gen = s$? "mond"          // #1
moso = "a,b,c,d"$/ ','   // [a, b, c, d]  (divize pa delimitatè)
ranplase = s$~~["l":"r"]        // "Bonjou mond" (pa gen 'l' nan kreyòl)
ranplase1 = s$~~["l":"r":1]     // "Bonjou mond"
liy = "─" $* 20           // "────────────────────"  (repete N fwa)
```

> `+` se sèlman pou nonb. Pou fisèl, sèvi ak `,`, juxtapozisyon, oswa entèpolasyon.

---

## Kontwòl Kouran

```zymbol
x = 7

? x > 0 { >> "pozitif" ¶ }

? x > 100 {
    >> "gwo" ¶
} _? x > 0 {
    >> "pozitif" ¶
} _? x == 0 {
    >> "zewo" ¶
} _ {
    >> "negatif" ¶
}
```

> Aklòde `{ }` **obligatwa** menm pou yon sèl deklarasyon.

---

## Aliman

```zymbol
// Ranje
nòt = 85
klas = ?? nòt {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> klas ¶    // → B

// Fisèl
koulè = "wouj"
kòd = ?? koulè {
    "wouj"   => "#FF0000"
    "vèt" => "#00FF00"
    _       => "#000000"
}

// Modèl konparezon
tanperati = -5
eta = ?? tanperati {
    < 0  => "glas"
    < 20 => "frèt"
    < 35 => "tyèd"
    _    => "cho"
}
>> eta ¶    // → glas

// Fòm deklarasyon (bra blòk)
n = -3
?? n {
    0    => { >> "zewo" ¶ }
    < 0  => { >> "negatif" ¶ }
    _    => { >> "pozitif" ¶ }
}
```

---

## Boul

```zymbol
@ i:0..4  { >> i " " }        // ranje enkli:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // ak etap:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // ranvèse:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

fwi = ["pòm", "pwa", "rezen"]
@ f:fwi { >> f ¶ }         // pou chak eleman nan tablo

@ k:"hello" { >> k "-" }
>> ¶                          // → h-e-l-l-o-  (pou chak karaktè nan fisèl)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> kontinye
    ? i > 7 { @! }             // @! kraze
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Boul enfini
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Boul ki gen etikèt (kraze anbrike)
konte = 0
@:deyò {
    konte++
    ? konte >= 3 { @:deyò! }
}
>> konte ¶                    // → 3
```

---

## Fonksyon

```zymbol
ajoute(a, b) { <~ a + b }
>> ajoute(3, 4) ¶    // → 7

faktoryèl(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoryèl(n - 1)
}
>> faktoryèl(5) ¶    // → 120
```

Fonksyon yo gen **sipò izole** — yo pa ka li varyab deyò yo. Sèvi ak paramèt sòti `<~>` pou modifye varyab moun k ap rele a:

```zymbol
chanje(a<~, b<~) {
    tanporè = a
    a = b
    b = tanporè
}
x = 10
y = 20
chanje(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Fonksyon ki gen non yo se **valè premye klas** — pase dirèkteman: `nimewo$> double`. Pou vlope: `x -> fn(x)` tou valab.

---

## Lambda ak Fèmti

```zymbol
doble = x -> x * 2
ajoute = (a, b) -> a + b
>> doble(5) ¶    // → 10
>> ajoute(3, 7) ¶  // → 10

// Lambda blòk
klase = x -> {
    ? x > 0 { <~ "pozitif" }
    _? x < 0 { <~ "negatif" }
    <~ "zewo"
}

// Fèmti — kaptire sipò deyò
faktè = 3
trip = x -> x * faktè
>> trip(7) ¶    // → 21

// Faktori
fabricant_ajoute(n) { <~ x -> x + n }
ajoute_dis = fabricant_ajoute(10)
>> ajoute_dis(5) ¶    // → 15

// Nan tablo
operatè = [x -> x+1, x -> x*2, x -> x*x]
>> operatè[3](5) ¶    // → 25
```

---

## Tablo

Tablo yo **ka chanje** epi yo gen eleman **menm kalite**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — aksè (1-baz: premye eleman)
x = arr[-1]     // 5 — endèks negatif (dènye eleman)
x = arr$#       // 5 — longè (sèvi ak (arr$#) nan >>)

arr = arr$+ 6            // ajoute → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // mete nan pozisyon 2 (1-baz)
arr3 = arr$- 3           // retire premye aparisyon valè a
arr4 = arr$-- 3          // retire tout aparisyon yo
arr5 = arr$-[1]          // retire nan endèks 1 (premye eleman)
arr6 = arr$-[2..3]       // retire ranje (1-baz, fen enkli)

gen = arr$? 3            // #1 — genyen
pozisyon = arr$?? 3           // [3] — tout endèks valè a (1-baz)
tranch = arr$[1..3]          // [1,2,3] — tranch (1-baz, fen enkli)
tranch2 = arr$[1:3]          // [1,2,3] — menm, sentaks baz konte

monte = arr$^+             // ranje monte (sèlman primitif)
desann = arr$^-            // ranje desann (sèlman primitif)

// Tablo tib ki gen non/pozisyonèl — sèvi ak $^ ak lambda konparezon
baz_done = [(non: "Carla", laj: 28), (non: "Ana", laj: 25), (non: "Bob", laj: 30)]
sou_laj  = baz_done$^ (a, b -> a.laj < b.laj)    // sou laj monte (<)
sou_non = baz_done$^ (a, b -> a.non > b.non)   // sou non desann (>)
>> sou_laj[1].non ¶     // → Ana
>> sou_non[1].non ¶    // → Carla

// Mizajou eleman dirèk (sèlman tablo)
arr[1] = 99              // afekte
arr[2] += 5              // konpoze: +=  -=  *=  /=  %=  ^=

// Mizajou fonksyonèl — retounen yon nouvo tablo; orijinal la pa chanje
arr2 = arr[2]$~ 99
```

> Tout operatè koleksyon yo retounen yon **nouvo tablo**. Afekte tounen: `arr = arr$+ 4`.
> `$+` ka chèn: `arr = arr$+ 5$+ 6$+ 7`. Lòt operatè yo sèvi ak afektasyon entèmedyè.
> **Endèks se 1-baz**: `arr[1]` se premye eleman; `arr[0]` se yon erè tan ekzekisyon.
> `$^+` / `$^-` ranje **tablo primitif** (nimewo, fisèl). Pou tablo tib, sèvi ak `$^` ak lambda konparezon — direksyon an kode nan lambda a (`<` = monte, `>` = desann).

**Semantik valè** — afekte yon tablo nan yon lòt varyab kreye yon kopi endepandan:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b pa afekte
```

```zymbol
// Tablo anbrike (endèks 1-baz)
matris = [[1,2,3],[4,5,6],[7,8,9]]
>> matris[2][3] ¶    // → 6  (liy 2, kolòn 3)
```

---

## Destriktirasyon

```zymbol
// Tablo
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[premye, *rès] = arr         // premye=10  rès=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ jete

// Tib pozisyonèl
pwen = (100, 200)
(px, py) = pwen             // px=100  py=200

// Tib ki gen non
moun = (non: "Ana", laj: 25, vil: "Madrid")
(non: n, laj: l) = moun   // n="Ana"  l=25
```

---

## Tib

Tib yo se resipyan òdone **ki pa ka chanje** ki ka kenbe valè **nan diferan kalite**.
Kontrèman ak tablo, eleman yo pa ka chanje apre kreyasyon.

```zymbol
// Pozisyonèl — kalite melanje pèmèt
pwen = (10, 20)
>> pwen[1] ¶    // → 10

done = (42, "Bonjou", #1, 3.14)
>> done[3] ¶     // → #1

// Ki gen non
moun = (non: "Alice", laj: 25)
>> moun.non ¶    // → Alice
>> moun[1] ¶      // → Alice  (endèks travay tou, 1-baz)

// Anbrike
pozisyon = (x: 10, y: 20)
p = (pozisyon: pozisyon, etikèt: "orijin")
>> p.pozisyon.x ¶        // → 10
```

**Imutabilite** — nenpòt tantativ pou modifye yon eleman tib se yon erè tan ekzekisyon:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ erè tan ekzekisyon: tib yo pa ka chanje
// t[1] += 5    // ❌ menm erè
```

Pou jwenn yon valè modifye, sèvi ak `$~` (mizajou fonksyonèl) — li retounen yon **nouvo tib**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← orijinal la pa chanje
>> t2 ¶    // → (10, 999, 30)

// Tib ki gen non — rekonstwi eksplisitman
moun = (non: "Alice", laj: 25)
pi_aje  = (non: moun.non, laj: 26)
>> moun.laj ¶    // → 25
>> pi_aje.laj ¶     // → 26
```

---

## Fonksyon Òd Siperyè

```zymbol
nimewo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

double  = nimewo$> (x -> x * 2)                  // map  → [2,4,6…20]
pè    = nimewo$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total    = nimewo$< (0, (akimile, x) -> akimile + x)     // reduce → 55

// Chèn atravè entèmedyè
etap1 = nimewo$| (x -> x > 3)
etap2 = etap1$> (x -> x * x)
>> etap2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Fonksyon ki gen non yo ka pase dirèkteman nan HOF
doble(x) { <~ x * 2 }
gwo(x) { <~ x > 5 }
r = nimewo$> doble       // ✅ referans dirèk
r = nimewo$| gwo       // ✅ referans dirèk
```

---

## Operatè Tiyo

Bò dwat la toujou bezwen `_` kote rezève pou valè a ki nan tiyo:

```zymbol
doble = x -> x * 2
ajoute = (a, b) -> a + b
enkreman = x -> x + 1

r1 = 5 |> doble(_)        // → 10
r2 = 10 |> ajoute(_, 5)       // → 15
r3 = 5 |> ajoute(2, _)        // → 7

// Chèn
r = 5 |> doble(_) |> enkreman(_) |> doble(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Jesyon Erè

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "divizyon pa zewo" ¶
} :! {
    >> "lòt: " _err ¶    // _err kenbe mesaj erè a
} :> {
    >> "toujou kouri" ¶
}
```

| Kalite | Lè |
|------|------|
| `##Div` | Divizyon pa zewo |
| `##IO` | Fichye / sistèm |
| `##Index` | Endèks deyò limit |
| `##Type` | Kalite pa matche |
| `##Parse` | Dekodaj done |
| `##Network` | Erè rezo |
| `##_` | Nenpòt erè (pran-tout) |

---

## Modil

```zymbol
// lib/calc.zy — kò modil la fèmen nan aklòd
# calc {
    #> { ajoute, get_PI }

    _π := 3.14159
    ajoute(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // alyas obligatwa

>> c::ajoute(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Ekspòte ak yon non piblik diferan
# mylib {
    #> { _ajoute_entèn => sòm }

    _ajoute_entèn(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::sòm(3, 4) ¶    // → 7  (non entèn _ajoute_entèn kache)
```

> **Règ modil**: nan `# non { }`, sèlman `#>`, definisyon fonksyon, ak inisyalizatè literal varyab/konstan yo pèmèt. Deklarasyon ekzekutabl (`>>`, `<<`, bouk, elatriye) leve erè E013.

---

## Mòd Nimeral

Zymbol ka montre nimewo nan **69 ekriti chif Unicode** — Devanagari, Arab-Endyen, Thai, Klingon pIqaD, Matematik gra, segman LCD, ak plis ankò. Mòd aktif la afekte sèlman sòti `>>`; aritmetik entèn lan toujou binè.

### Aktive yon ekriti

Ekri chif `0` ak `9` nan ekriti sib la nan `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arab-Endyen (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // Reyajiste nan ASCII
```

### Sòti ak bouleyen

```zymbol
x = 42
>> x ¶          // → 42   (ASCII default)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (pwen desimal la toujou ASCII)
>> 1 + 2 ¶      // → ३

// Bouleyen: prefiks # se toujou ASCII, chif la adapte
>> #1 ¶         // → #१   (vre nan Devanagari)
>> #0 ¶         // → #०   (fo — diferan de ० nonb antye zewo)

x = 28 > 4
>> x ¶          // → #१   (rezilta konparezon an swiv mòd aktif la)
```

### Literal chif natif natal nan sous

Chif nenpòt ekriti sipòte yo se literal valab — nan ranje, modulo, konparezon:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Literal Bouleyen nan nenpòt ekriti

`#` + chif `0` oswa `1` nan nenpòt blòk se yon literal bouleyen valab:

```zymbol
#०९#
aktif = #१        // menm jan ak #1
>> aktif ¶        // → #१
>> (#१ && #०) ¶ // → #०
```

> `#` **toujou ASCII**. `#0` (fo) toujou vizyèlman diferan de `0` (nonb antye zewo) nan chak ekriti.

---

## Operatè Done

```zymbol
// Chanjman kalite
f = ##.42         // → 42.0  (nan k ap flote)
i = ###3.7        // → 4     (nan nonb antye, awondi)
t = ##!3.7        // → 3     (nan nonb antye, koupe)

// Dekode fisèl an nimewo
v1 = #|"42"|      // → 42  (nonb antye)
v2 = #|"3.14"|    // → 3.14  (k ap flote)
v3 = #|"abc"|     // → "abc"  (san danje, pa gen erè)

// Awondi / Koupe
π = 3.14159265
awondi2 = #.2|π|      // → 3.14  (awondi nan 2 plas desimal)
awondi4 = #.4|π|      // → 3.1416
koupe2 = #!2|π|      // → 3.14  (koupe)

// Fòma nimewo
fòma = #,|1234567|  // → 1,234,567  (separe ak vigil)
syantifik = #^|12345.678|    // → 1.2345678e4  (syantifik)

// Literal baz
a = 0x41         // → 'A'  (heksadesimal)
b = 0b01000001   // → 'A'  (binè)
c = 0o101        // → 'A'  (oktal)

// Sòti konvèsyon baz
heks = 0x|255|    // → "0x00FF"
binè = 0b|65|     // → "0b1000001"
oktal = 0o|8|      // → "0o10"
desimal = 0d|255|    // → "0d0255"
```

---

## Entegrasyon Shell

```zymbol
dat = <\ date +%Y-%m-%d \>     // kaptire stdout (enkli \n nan fen)
>> "Jodi a: " dat

fichye = "data.txt"
kontni = <\ cat {fichye} \>      // entèpolasyon nan kòmandman

sòti = </"./subscript.zy"/>   // egzekite yon lòt skript Zymbol, kaptire sòti
>> sòti
```

> `><` kaptire agiman CLI kòm yon tablo fisèl (sèlman tree-walker).

---

## Egzanp Konplè: FizzBuzz

```zymbol
klase(nimewo) {
    ? nimewo % 15 == 0 { <~ "FizzBuzz" }
    _? nimewo % 3  == 0 { <~ "Fizz" }
    _? nimewo % 5  == 0 { <~ "Buzz" }
    _ { <~ nimewo }
}

@ i:1..20 { >> klase(i) ¶ }
```

---

## Referans Senbòl

| Senbòl | Operasyon | Senbòl | Operasyon |
|--------|-----------|--------|-----------|
| `=` | varyab | `$#` | longè |
| `:=` | konstan | `$+` | ajoute (ka chèn) |
| `>>` | sòti | `$+[i]` | mete nan endèks (1-baz) |
| `<<` | antre | `$-` | retire premye pa valè |
| `¶` / `\\` | nouvo liy | `$--` | retire tout pa valè |
| `?` | si | `$-[i]` | retire nan endèks (1-baz) |
| `_?` | sinon-si | `$-[i..j]` | retire ranje (1-baz) |
| `_` | sinon / jokè | `$?` | genyen |
| `??` | aliman | `$??` | jwenn tout endèks (1-baz) |
| `@` | bouk | `$[s..e]` | tranch (1-baz) |
| `@ N { }` | bouk N fwa | `$>` | map |
| `@!` | kraze | `$\|` | filter |
| `@>` | kontinye | `$<` | reduce |
| `@:non { }` | bouk ki gen etikèt | `$/ delimitatè` | divize fisèl |
| `@:non!` | kraze etikèt | `$++ a b c` | konstriksyon konkatenasyon |
| `@:non>` | kontinye etikèt | `arr[i>j>k]` | endèks navigasyon |
| `->` | lambda | `arr[i] = valè` | mete ajou eleman (sèlman tablo) |
| `arr[i] += valè` | mete ajou konpoze | `arr[i]$~` | mete ajou fonksyonèl (nouvo kopi) |
| `$^+` | ranje monte (primitif) | `$^-` | ranje desann (primitif) |
| `$^` | ranje ak konparatè (tib) | `<~` | retounen |
| `\|>` | tiyo | `!?` | eseye |
| `:!` | pran | `:>` | finalman |
| `#1` | vre | `#0` | fo |
| `$!` | èske erè | `$!!` | pwopaje erè |
| `<#` | enpòte | `#>` | ekspòte |
| `#` | deklare modil | `::` | rele modil |
| `.` | aksè chan | `#?` | metadata kalite |
| `#\|..\|` | dekode nimewo | `##.` | konvèti an k ap flote |
| `###` | konvèti an nonb antye (awondi) | `##!` | konvèti an nonb antye (koupe) |
| `#.N\|..\|` | awondi | `#!N\|..\|` | koupe |
| `#,\|..\|` | fòma vigil | `#^\|..\|` | syantifik |
| `#d0d9#` | chanje mòd nimeral | `#09#` | reyajiste nan ASCII |
| `<\ ..\>` | egzekite shell | `>\<` | agiman CLI |
| `\ varyab` | detwi varyab eksplisitman | `°x` / `x°` | definisyon cho (inisyalizasyon otomatik) |
| `>>|` | blòk TUI (ekran altènatif) | `>>~` | sòti pozisyonèl |
| `>>!` | netwaye ekran | `>>?` | mande gwosè tèminal |
| `<<\|` | presyon kle bloke | `<<\|?` | sonde presyon kle san bloke |
| `@~ N` | dòmi N milisgond | `$*` | repete fisèl N fwa |

---

## Changelog Vèsyon

### v0.0.5 — Primitif TUI, Definison Cho & Repetisyon Fisèl _(Me 2026)_

- **Kraze** Separatè bra aliman: `modèl : rezilta` → `modèl => rezilta`
- **Kraze** Alyas enpòtasyon: `<# chemen <= alyas` → `<# chemen => alyas`
- **Kraze** Renonmen ekspòtasyon: `#> { fn <= piblik }` → `#> { fn => piblik }`
- **Ajoute** Blòk TUI `>>| { }` — ekran altènatif + mòd brit; netwaye lè w sòti
- **Ajoute** Sòti pozisyonèl `>>~ (liy, kolòn, BKS, fg, bg) > atik` — plas rès, koulè ANSI 256
- **Ajoute** Antre kle `<<| varyab` (bloke) ak `<<|? varyab` (sonde san bloke)
- **Ajoute** `>>!` netwaye ekran, `>>?` mande gwosè tèminal, `@~ N` dòmi N milisgond
- **Ajoute** Definison cho `°x` / `x°` — inisyalizasyon otomatik varyab nan premye itilizasyon nan bouk
- **Ajoute** Repetisyon fisèl `fisèl $* N` — repete yon fisèl N fwa
- **VM** Parite: 436/436 tès reyisi

### v0.0.4 — Endèks 1-baz, Fonksyon Premye Klas & Modil Blòk _(Avril 2026)_

- **Kraze** Tout endèks chanje nan **1-baz** — `arr[1]` se premye eleman; `arr[0]` se yon erè tan ekzekisyon
- **Ajoute** Fonksyon ki gen non yo se **valè premye klas** — pase dirèkteman nan HOF: `nimewo$> doble`
- **Ajoute** **Sentaks blòk obligatwa** pou modil: `# non { ... }` — sentaks plat retire
- **Ajoute** Endèks miltidimansyon: `arr[i>j>k]` (navigasyon), `arr[p ; q]` (ekstraksyon plat)
- **Ajoute** Chanjman kalite: `##.ekspresyon` (k ap flote), `###ekspresyon` (nonb antye awondi), `##!ekspresyon` (nonb antye koupe)
- **Ajoute** Divizyon fisèl: `fisèl$/ delimitatè` — retounen `Array(fisèl)`
- **Ajoute** Konstriksyon konkatenasyon: `baz$++ a b c` — ajoute plizyè atik
- **Ajoute** Bouk fwa: `@ N { }` — repete egzakteman N fwa
- **Ajoute** Sentaks bouk ki gen etikèt: `@:non { }`, `@:non!`, `@:non>` — ranplase `@ @non` / `@! non`
- **Ajoute** Règ sipò varyab: varyab `_non` yo gen sipò blòk egzak; `\ varyab` detwi bonè
- **Ajoute** Modèl konparezon aliman: `< 0 =>`, `> 5 =>`, `== 42 =>`, elatriye
- **Ajoute** Erè modil E013: deklarasyon ekzekutabl nan kò modil yo entèdi
- **Ranje** `alias.CONST` kounye a rezoud kòrèkteman; `#>` ka parèt apre definisyon fonksyon
- **VM** Parite konplè: 393/393 tès reyisi

### v0.0.3 — Sistèm Nimeral Unicode & Amelyorasyon LSP _(Avril 2026)_

- **Ajoute** 69 blòk chif Unicode ak mak swit mòd `#d0d9#`
- **Ajoute** Literal bouleyen nan nenpòt ekriti — `#१` / `#०`, `#१` / `#०`, elatriye
- **Ajoute** Chif Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Ajoute** Opkòd VM `SetNumeralMode` — parite konplè ak tree-walker
- **Chanje** Sòti bouleyen `>>` kounye a gen prefiks `#` (`#0` / `#1`) nan tout mòd

### v0.0.2_01 — Renonmen Operatè _(30 Mas 2026)_

- **Chanje** `c|..|` → `#,|..|` ak `e|..|` → `#^|..|` — konsistan ak fanmi prefiks `#`
- **Ajoute** Alyas ekspòtasyon: re-ekspòte manm modil anba yon non diferan

### v0.0.2 — Rekonsepsyon API Koleksyon & Enstalatè _(24 Mas 2026)_

- **Ajoute** Fanmi operatè `$` ini pou tablo ak fisèl (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Ajoute** Afektasyon destriktirasyon pou tablo, tib, ak tib ki gen non
- **Ajoute** Endèks negatif (`arr[-1]` = dènye eleman)
- **Ajoute** Enstalatè natif — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mas 2026)_

- **Ajoute** Afektasyon konpoze `^=`
- **Ranje** Ka anlè aritmetik analizè; koreksyon dokiman

### v0.0.1 — Premye Piblikasyon Piblik _(22 Mas 2026)_

- Entèprèt tree-walker + VM rejis (`--vm`, ~4× pi vit, ~95% parite)
- Tout konstriksyon debaz: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Idantifyan Unicode konplè, sistèm modil, lambda, fèmti, jesyon erè
- REPL, LSP, ekstansyon VS Code, fòma (`zymbol fmt`)

---

_Zymbol-Lang — Senbolik. Inivèsèl. Imutab._

