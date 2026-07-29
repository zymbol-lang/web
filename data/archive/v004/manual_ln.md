> **Boyebisi:** Mokanda oyo esalemi na lisalisi ya mayele ya sika (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Ndakisa ya nsango ezali **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** na ebombi ya mobalisi.

---

# Mikanda ya Zymbol-Lang

**Zymbol-Lang** ezali monoko ya kompiprograma ya bilembo. Nkótá ya motó ezali te — nyonso ezali elembo. Esalaka ndenge moko na monoko nyonso ya bato.

- Ntina `if`, `while`, `return` ezali te — kaka `?`, `@`, `<~`
- Unicode mobimba — bamakani na monoko nyonso to na emoji nyonso
- Etikalaka na monoko ya bato te — kode ezali ndenge moko na bisika nyonso

**Versio ya mobalisi**: v0.0.4 | **Bobongi ya bomekano**: 393/393 (kokani TW ↔ VM)

---

## Bivarie mpi Bilellé

```zymbol
x = 10              // bivarie oyo ekoki kobongwana
PI := 3.14159       // biloko libela — kopésa lisusu ezali mbongwana ya tango ya kosala
kombo = "Alice"
mosala = #1         // Booleano solo
👋 := "Mbote"
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

---

## Bilesa ya Donnée

| Lolenge | Lilakala | Etiqeti ya `#?` | Makambo ya koyeba |
|---------|----------|-----------------|-------------------|
| Motángo molayi | `42`, `-7` | `###` | 64-bit na nzela |
| Motángo oyo ekolamaka | `3.14`, `1.5e10` | `##.` | Makomi ya siansi endimami |
| Nkómbó | `"makomi"` | `##"` | Kotisa kati: `"Mbote {kombo}"` |
| Mokanda | `'A'` | `##'` | Mokanda moko ya Unicode |
| Booleano | `#1`, `#0` | `##?` | NON motángo — `#1 ≠ 1` |
| Lilongo | `[1, 2, 3]` | `##]` | Binama ya lolenge moko |
| Napolo | `(a, b)` | `##)` | Bisika |
| Napolo na kombo | `(x: 1, y: 2)` | `##)` | Bileki oyo ezali na kombo |
| Fonksyo | likanisi ya fonksyo oyo ezali na kombo | `##()` | Etuluku ya liboso; emonisaka `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Etuluku ya liboso; emonisaka `<lambd/N>` |

```zymbol
// Boyebi ya lolenge — ekozongisa (lolenge, bamonzomi, motuya)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

---

## Ekateli mpe Bokoti

```zymbol
>> "Mbote" ¶                       // ¶ to \\ mpo na nzela ya sika ya polele
>> "a=" a " b=" b ¶               // kotya pembeni — bamotuya ebele
>> (arr$#) ¶                      // basaleli ya posfixe bali na mposa ya ( ) na kati ya >>

<< kombo                           // tanga na kati ya bivarie (sanso numéro)
<< "Koma kombo na yo: " kombo      // elongo na numéro
```

> `¶` (AltGr+R na klavie ya Espagne) mpe `\\` bazali ndenge moko mpo na nzela ya sika.

---

---

## Basaleli

```zymbol
// Molongo ya motango — sala péné; basaleli mosusu bazali na makambo ndenge moko nzoto na kati ya >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (bokabi ya motángo molayi)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (kotombola)

// Bokokanisi
a == b    // #0    
a <> b    // #1    
a < b      // #0
a <= b    // #0   
a > b      // #1    
a >= b    // #1

// Ya mayele
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Mikoló

```zymbol
// Bileko mibale ya kosangisa
kombo = "Alice"
n = 42

>> "Mbote " kombo " ozali na " n ¶       // kotya pembeni — na kati ya >>
lilimbola = "Mbote {kombo}, ozali na {n}"   // kotisa kati — bisika nyonso
```

```zymbol
s = "Mbote Mokili"
bolai = s$#                  // 11
kati = s$[1..5]              // "Mbote"  (fondasio-1, suka ezali na kati)
ezali = s$? "Mokili"         // #1
biteni = "a,b,c,d"$/ ','      // [a, b, c, d]  (kokabola na bokaboli)
ebongwana = s$~~["a":"o"]     // "Mboto Mokilo"
ebongwana1 = s$~~["a":"o":1]  // "Mboto Mokili" (N yambo kaka)
```

> `+` mpo na motángo kaka. Mpo na mikoló, salela `,`, kotya pembeni, to kotisa kati.

---

---

## Kontrole Ekelamutu

```zymbol
x = 7

? x > 0 { >> "kitoko" ¶ }

? x > 100 {
    >> "monene" ¶
} _? x > 0 {
    >> "kitoko" ¶
} _? x == 0 {
    >> "zéro" ¶
} _ {
    >> "mabe" ¶
}
```

> Bikalo ya zonzon `{ }` **ezali ya ntina** ata mpo na liloba moko.

---

---

## Kokokana

```zymbol
// Bafandi
monya = 85
noti = ?? monya {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> noti ¶      // → B

// Mikoló
lángi = "motane"
kode = ?? lángi {
    "motane"  : "#FF0000"
    "pólo"    : "#00FF00"
    _         : "#000000"
}

// Bileko ya kokokanisa
tángo ya moto = -5
etat = ?? tángo ya moto {
    < 0  : "grési"
    < 20 : "malili"
    < 35 : "moláli"
    _    : "solo"
}
>> etat ¶       // → grési

// Bolenge ya liloba (ba blocs)
?? n {
    0        : { >> "zéro" ¶ }
    _? n < 0 : { >> "mabe" ¶ }
    _        : { >> "kitoko" ¶ }
}
```

---

---

## Kobalukabuka

```zymbol
@ i:0..4  { >> i " " }        // likebisi ezali na kati:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // elongo na etape:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // ndenge misusu:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (tango)

mbuma = ["pomme", "poire", "raisin"]
@ m:mbuma { >> m ¶ }          // mpo na binama binso na lilongo

@ m:"mbote" { >> m "-" }
>> ¶                          // → m-b-o-t-e-  (mpo na mokanda moko na kati ya nkómbó)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> koba
    ? i > 7 { @! }            // @! kokata
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Kobalukabuka oyo ekoka te
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Kobalukabuka oyo ezali na nkombo (kokata oyo ekomonanaka)
motali = 0
@:ngámbo {
    motali++
    ? motali >= 3 { @:ngámbo! }
}
>> motali ¶                   // → 3
```

---

---

## Fonksyo

```zymbol
kobakisa(a, b) { <~ a + b }
>> kobakisa(3, 4) ¶   // → 7

masolo(n) {
    ? n <= 1 { <~ 1 }
    <~ n * masolo(n - 1)
}
>> masolo(5) ¶       // → 120
```

Fonksyo ezali na **esika oyo ekesenami** — ekoki kotánga bivarie ya ngámbo te. Salela paramètres ya kobima `<~>` mpo na kobongola bivarie ya mongambi:

```zymbol
kokesana(a<~, b<~) {
    ya moke = a
    a = b
    b = ya moke
}
x = 10
y = 20
kokesana(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Fonksyo oyo ezali na nkombo ezali **motuya ya etuluku ya liboso** — tinda ndenge moko: `nums$> kopisa mbala mibale`. `x -> fn(x)` mpé ezali ya solo.

---

---

## Lambda mpe Bokangami

```zymbol
kopisa mbala mibale = x -> x * 2
kobakisa = (a, b) -> a + b
>> kopisa mbala mibale(5) ¶   // → 10
>> kobakisa(3, 7) ¶       // → 10

// Bloc lambda
kokabola = x -> {
    ? x > 0 { <~ "kitoko" }
    _? x < 0 { <~ "mabe" }
    <~ "zéro"
}

// Bokangami — ezali kozwa esika ya ngámbo
elembo = 3
kopisa mbala misato = x -> x * elemo
>> kopisa mbala misato(7) ¶   // → 21

// Masano
kosala_na_bakisa(n) { <~ x -> x + n }
bakisa zomi = kosala_na_bakisa(10)
>> bakisa douze (5) ¶   // → 15

// Na kati ya lilongo
basali = [x -> x+1, x -> x*2, x -> x*x]
>> basali[3](5) ¶       // → 25
```

---

## Lilongo

Lilongo **ekoki kobongwana** mpe ezali na binama **ya lolenge moko**.

```zymbol
lilongo = [1, 2, 3, 4, 5]

lilongo[1]          // 1 — bokoti (fondasio-1: binama ya yambo)
lilongo[-1]         // 5 — index mabe (binama ya suka)
lilongo$#           // 5 — bolai (sala (lilongo$#) na kati ya >>)

lilongo = lilongo$+ 6            // bakisa → [1,2,3,4,5,6]
lilongo2 = lilongo$+[2] 99       // kotya na esika 2 (fondasio-1)
lilongo3 = lilongo$- 3           // kolongola monano ya yambo ya motuya
lilongo4 = lilongo$-- 3          // kolongola banano nyonso
lilongo5 = lilongo$-[1]          // kolongola na index 1 (binama ya yambo)
lilongo6 = lilongo$-[2..3]       // kolongola likebisi (fondasio-1, suka ezali na kati)

ezali = lilongo$? 3            // #1 — ezali na kati
bisika = lilongo$?? 3          // [3] — indexes nyonso ya motuya (fondasio-1)
etsili = lilongo$[1..3]        // [1,2,3] — etsili (fondasio-1, suka ezali na kati)
etsili2 = lilongo$[1:3]        // [1,2,3] — ndenge moko, gramere ya motango

kolela = lilongo$^+           // kolongisa kolela (basaleli ya liboso kaka)
kokita = lilongo$^-           // kolongisa kokita (basaleli ya liboso kaka)

// Lilongo ya napolo oyo ezali na kombo/esika — sala $^ elongo na lambda ya kokokanisa
data = [(kombo: "Carla", mbula: 28), (kombo: "Ana", mbula: 25), (kombo: "Bob", mbula: 30)]
na_ndimbola_ya mbula   = data$^ (a, b -> a.mbula < b.mbula)   // kolela na ndimbola ya mbula (<)
na_ndimbola_ya kombo   = data$^ (a, b -> a.kombo > b.kombo)    // kokita na ndimbola ya kombo (>)
>> na_ndimbola_ya mbula[1].kombo ¶   // → Ana
>> na_ndimbola_ya kombo[1].kombo ¶   // → Carla

// Kobongola binama nzoto (lilongo kaka)
lilongo[1] = 99              // pésa
lilongo[2] += 5              // ekomoni: +=  -=  *=  /=  %=  ^=

// Kobongola ya misala — ekozongisa lilongo ya sika; ya liboto ebongwanaka te
lilongo2 = lilongo[2]$~ 99
```

> Basaleli nyonso ya kosangisa bazali kozongisa **lilongo ya sika**. Pésa lisusu: `lilongo = lilongo$+ 4`.
> `$+` ekoki kozala na monoko: `lilongo = lilongo$+ 5$+ 6$+ 7`. Basaleli misusu basaleli bapésa ya kati na kati.
> **Index fondasio-1**: `lilongo[1]` ezali binama ya yambo; `lilongo[0]` ezali mbongwana ya tango ya kosala.
> `$^+` / `$^-` ezali kolongisa **lilongo ya liboso** (batango, bakoló). Mpo na lilongo ya napolo, sala $^ elongo na lambda ya kokokanisa — nzela ekomami na kati ya lambda (`<` = kolela, `>` = kokita).

**Ndimbola ya motuya** — kopésa lilongo na bivarie mosusu ezali kosala kopi mosusu oyo ekokani na yango te:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ebongwanaka te
```

```zymbol
// Lilongo oyo ekomonanaka (index fondasio-1)
matrice = [[1,2,3],[4,5,6],[7,8,9]]
>> matrice[2][3] ¶    // → 6  (molɔngɔ 2, nzete 3)
```

---

---

## Kosakola

```zymbol
// Lilongo
lilongo = [10, 20, 30, 40, 50]
[a, b, c] = lilongo              // a=10  b=20  c=30
[yambo, *nzela] = lilongo        // yambo=10  nzela=[20,30,40,50]
[x, _, z] = [1, 2, 3]           // _ etyambaka te

// Napolo ya esika
pole = (100, 200)
(px, py) = pole                // px=100  py=200

// Napolo oyo ezali na kombo
motu = (kombo: "Ana", mbula: 25, engumba: "Madrid")
(kombo: k, mbula: m) = motu    // k="Ana"  m=25
```

---

## Napolo

Napolo ezali ba contenele oyo **babongwanaka te** mpe bakoki kotya motuya ya **lolenge ndenge na ndenge**.
Kokani na lilongo, binama ekozongwanaka te nsima ya bokeli.

```zymbol
// Bisika — lolenge misusu endimami
pole = (10, 20)
>> pole[1] ¶     // → 10

data = (42, "mbote", #1, 3.14)
>> data[3] ¶     // → #1

// Na kombo
motu = (kombo: "Alice", mbula: 25)
>> motu.kombo ¶   // → Alice
>> motu[1] ¶      // → Alice  (index mpé esalaka, fondasio-1)

// Oyo ekomonanaka
esika = (x: 10, y: 20)
p = (esika: esika, nkombo: "ebandeli")
>> p.esika.x ¶     // → 10
```

**Kopekisa kobongwana** — komeka nyonso ya kobongola binama ya napolo ezali mbongwana ya tango ya kosala:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ mbongwana ya tango ya kosala: napolo ebongwanaka te
// t[1] += 5    // ❌ mbongwana ndenge moko

// Napolo oyo ezali na kombo — kosala lisusu polele
motu = (kombo: "Alice", mbula: 25)
monene = (kombo: motu.kombo, mbula: 26)
>> motu.mbula ¶    // → 25
>> monene.mbula ¶  // → 26
```

Mpo na kozwa motuya oyo ebongwanami, salela `$~` (kobongola ya misala) — ekozongisa napolo **ya sika**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← ya liboto ebongwanaka te
>> t2 ¶    // → (10, 999, 30)
```

---

---

## Fonksyo ya Molongo Molai

```zymbol
motángo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

bakisa mbala mibale = motángo$> (x -> x * 2)                // carte → [2,4,6…20]
páre   = motángo$| (x -> x % 2 == 0)                      // filter → [2,4,6,8,10]
molongani   = motángo$< (0, (accum, x) -> accum + x)       // réduire → 55

// Kokangisa na nzela ya kati
etape1 = motángo$| (x -> x > 3)
etape2 = etape1$> (x -> x * x)
>> etape2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Fonksyo oyo ezali na nkombo ekoki kotindama nzoto na fonksyo ya molongo molai
kopisa mbala mibale(x) { <~ x * 2 }
monene_te(x) { <~ x > 5 }
r = motángo$> kopisa mbala mibale     // ✅ likanisi nzoto
r = motángo$| monene_te              // ✅ likanisi nzoto
```

---

---

## Mosali ya pipe

Ngambo ya mobali ezali na mposa ya `_` ndenge mosangisi ya esika mpo na motuya oyo ezuami na pipe:

```zymbol
kopisa mbala mibale = x -> x * 2
kobakisa = (a, b) -> a + b
kopisa moko = x -> x + 1

5 |> kopisa mbala mibale(_)        // → 10
10 |> kobakisa(_, 5)              // → 15
5 |> kobakisa(2, _)               // → 7

// Kangisama
r = 5 |> kopisa mbala mibale(_) |> kopisa moko(_) |> kopisa mbala mibale(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

---

## Kosala na Mbongwana

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "kokabola na zéro" ¶
} :! {
    >> "mbongwana misusu: " _err ¶    // _err ezali na nsango ya mbongwana
} :> {
    >> "ekosalama ntango nyonso" ¶
}
```

| Lolenge | Ntango |
|---------|--------|
| `##Div` | Kokabola na zéro |
| `##IO` | Fichier / kompipo |
| `##Index` | Index na libanda ya ndelo |
| `##Type` | Lolenge ekokani te |
| `##Parse` | Kotánga data |
| `##Network` | Mbongwana ya réseau |
| `##_` | Mbongwana nyonso (ezali kozwa nyonso) |

---

---

## Modules

```zymbol
// lib/calc.zy — nzoto ya module ezali na kati ya bikalo ya zonzon
# calc {
    #> { kobakisa, get_PI }

    _PI := 3.14159
    kobakisa(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias ezali na ntina

>> c::kobakisa(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Kobimisa na kombo misusu ya public
# librerie na ngai {
    #> { _kobakisa_na_kati <= motuya }

    _kobakisa_na_kati(a, b) { <~ a + b }
}
```

```zymbol
<# ./librerie na ngai <= m

>> m::motuya(3, 4) ¶    // → 7  (kombo ya kati _kobakisa_na_kati ezipami)
```

> **Mibeko ya module**: na kati ya `# kombo { }`, `#>`, ndimbola ya fonksyo, mpe babandisi ya bivarie/libele ya lilakala kaka endimami. Maloba oyo ekosalama (`>>`, `<<`, kobalukabuka, wana nyonso) efulusaka mbongwana E013.

---

---

## Mode ya Motángo

Zymbol ekoki kolakisa motángo na **69 bloc ya bamonzomi ya Unicode** — Devanagari, Arab-Indic, Thai, Klingon pIqaD, Mathematical bold, ba segmente ya LCD, mpe wana nyonso. Mode oyo esalaka ekosala na ekateli ya `>>` kaka; motango ya kati ezali binaire ntango nyonso.

### Kotya mosala makomi ya nzoto

Koma bamonzomi `0` mpe `9` ya makomi oyo olingi na kati ya `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arab-Indic    (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // kozongisa na ASCII
```

---

### Ekateli mpe ba Booleano

```zymbol
x = 42
>> x ¶          // → 42   (ASCII ya liboso)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (point decimal ezali ASCII ntango nyonso)
>> 1 + 2 ¶      // → ३

// Booleano: prefixe # ezali ASCII ntango nyonso, monzomi ekomipesaka
>> #1 ¶         // → #१   (solo na Devanagari)
>> #0 ¶         // → #०   (lokuta — ekokani te na ० motángo zéro)

x = 28 > 4
>> x ¶          // → #१   (litomba ya kokokanisa ezali kolanda mode oyo esalaka)
```

---

## Bamonzomi ya liboto na kode ya source

Bamonzomi ya makomi nyonso oyo endimami ezali lilakala ya solo — na bafandi, na modulo, na bokokanisi:

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

### Lilakala ya Booleano na makomi nyonso

`#` + monzomi `0` to `1` na bloc nyonso ezali lilakala ya Booleano oyo ezali solo:

```zymbol
#०९#
mosala = #१        // ndenge moko na #1
>> mosala ¶        // → #१
>> (#१ && #०) ¶    // → #०
```

> `#` **ezali ASCII ntango nyonso**. `#0` (lokuta) ezalaka ndenge moko na miso mpe esanganaka te na `0` (motángo zéro) na makomi nyonso.

---

---

## Basaleli ya Donnée

```zymbol
// Kobongola lolenge
##.42         // → 42.0  (mpo na Motángo oyo ekolamaka)
###3.7        // → 4     (mpo na Motángo molayi, kopusola)
##!3.7        // → 3     (mpo na Motángo molayi, kokáta)

// Kotánga nkómbó mpo na motángo
v1 = #|"42"|      // → 42  (Motángo molayi)
v2 = #|"3.14"|    // → 3.14  (Motángo oyo ekolamaka)
v3 = #|"abc"|     // → "abc"  (ya limpinga, mbongwana te)

// Kopusola / kokáta
pi = 3.14159265
kopusola2 = #.2|pi|     // → 3.14  (kopusula tii na bisika 2 ya decimal)
kopusola4 = #.4|pi|     // → 3.1416
kokáta2 = #!2|pi|        // → 3.14  (kokáta)

// Komisa motángo na form
forme = #,|1234567|   // → 1,234,567  (bokeseni na virgule)
siantifi = #^|12345.678| // → 1.2345678e4  (siantifi)

// Lilakala ya fondasion
a = 0x41         // → 'A'  (hexadécimal)
b = 0b01000001   // → 'A'  (binaire)
c = 0o101        // → 'A'  (octal)

// Ekateli ya kobongola fondasion
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

---

## Kosangisa na Shell

```zymbol
liso = <\ date +%Y-%m-%d \>     // ekozwa stdout (ezali na \n na suka)
>> "Lelo: " liso

fichie = "data.txt"
nkombo na kati = <\ cat {fichie} \>       // kotisa kati na ba commandes

ekateli = </"./subscript.zy"/>      // kosalisa script Zymbol mosusu, kozwa ekateli
>> ekateli
```

> `><` ekozwa ba arguments CLI lokola lilongo ya mikoló (kaka tree-walker).

---

---

## Ndakisa ya Malamu: FizzBuzz

```zymbol
kokabola(motángo) {
    ? motángo % 15 == 0 { <~ "FizzBuzz" }
    _? motángo % 3  == 0 { <~ "Fizz" }
    _? motángo % 5  == 0 { <~ "Buzz" }
    _ { <~ motángo }
}

@ i:1..20 { >> kokabola(i) ¶ }
```

---

## Référence ya Bilembo

| Elembo | Mosala | Elembo | Mosala |
|--------|--------|--------|--------|
| `=` | bivarie | `$#` | bolai |
| `:=` | biloko libela | `$+` | basisa (ekoki kokangama) |
| `>>` | ekateli | `$+[i]` | kotya na index (fondasio-1) |
| `<<` | bokoti | `$-` | kolongola ya yambo ndenge motuya |
| `¶` / `\\` | nzela ya sika | `$--` | kolongola nyonso ndenge motuya |
| `?` | soki | `$-[i]` | kolongola na index (fondasio-1) |
| `_?` | soki te soki | `$-[i..j]` | kolongola likebisi (fondasio-1) |
| `_` | soki te / nyonso | `$?` | ezali na kati |
| `??` | kokokana | `$??` | koluka ba index nyonso (fondasio-1) |
| `@` | kobalukabuka | `$[s..e]` | etsili (fondasio-1) |
| `@ N { }` | kobalukabuka N mbala | `$>` | carte |
| `@!` | kokata | `$|` | filtre |
| `@>` | koba | `$<` | réduire |
| `@:kombo { }` | kobalukabuka na nkombo | `$/ bokaboli` | kokabola nkómbó |
| `@:kombo!` | kokata na nkombo | `$++ a b c` | kosala kangama |
| `@:kombo>` | koba na nkombo | `lilongo[i>j>k]` | index ya kotambola |
| `->` | lambda | `lilongo[i] = motuya` | kobongola binama (lilongo kaka) |
| `lilongo[i] += motuya` | kobongola ekomoni | `lilongo[i]$~` | kobongola ya misala (kopi ya sika) |
| `$^+` | kolongisa kolela (liboso) | `$^-` | kolongisa kokita (liboso) |
| `$^` | kolongisa na comparateur (napolo) | `<~` | kozongisa |
| `|>` | pipe | `!?` | komeka |
| `:!` | kozwa | `:>` | nsuka |
| `#1` | solo | `#0` | lokuta |
| `$!` | ezali mbongwana | `$!!` | ebale ya mbongwana |
| `<#` | kotya | `#>` | kobimisa |
| `#` | kobinisa module | `::` | kobenga module |
| `.` | bokoti ya esika | `#?` | métadonnée ya lolenge |
| `#\|..\|` | kotánga motángo | `##.` | kobongola mpo na Motángo oyo ekolamaka |
| `###` | kobongola mpo na Motángo molayi (kopusola) | `##!` | kobongola mpo na Motángo molayi (kokáta) |
| `#.N\|..\|` | kopusola | `#!N\|..\|` | kokáta |
| `#,\|..\|` | forme na virgule | `#^\|..\|` | siantifi |
| `#d0d9#` | kobongola mode ya motángo | `#09#` | kozongisa na ASCII |
| `<\ ..\>` | kosalisa shell | `>\<` | ba arguments ya ligne na commande |
| `\ var` | koboma bivarie polele | | |

---

---

## Journal ya Changement ya Version

### v0.0.4 — Index Fondasio-1, Fonksyo ya Etuluku ya Liboso & Bloc ya Module _(Avril 2026)_

- **Elekisi** Ba index nyonso babongwani na **fondasio-1** — `arr[1]` ezali binama ya yambo; `arr[0]` ezali mbongwana ya tango ya kosala
- **Bakisi** Fonksyo oyo ezali na nkombo ezali **motuya ya etuluku ya liboso** — tinda nzoto mpo na fonksyo ya molongo molai: `nums$> kopisa mbala mibale`
- **Bakisi** **Gramere ya bloc** ya module ezali na ntina: `# kombo { ... }` — gramere ya plate ebungisami
- **Bakisi** Index ya ba dimensions ebele: `arr[i>j>k]` (kotambola), `arr[p ; q]` (kosala plate)
- **Bakisi** Kobongola lolenge: `##.super` (Motángo oyo ekolamaka), `###super` (Motángo molayi kopusola), `##!super` (Motángo molayi kokáta)
- **Bakisi** Kokabola nkómbó: `nkómbó$/ bokaboli` — ekozongisa `Array(Nkómbó)`
- **Bakisi** Kosala kangama: `fondasio$++ a b c` — ezali kobakisa bikelamu ebele
- **Bakisi** Kobalukabuka N mbala: `@ N { }` — kozongisa mbala N kaka
- **Bakisi** Gramere ya kobalukabuka na nkombo: `@:kombo { }`, `@:kombo!`, `@:kombo>` — ekolongola `@ @kombo` / `@! kombo`
- **Bakisi** Mibeko ya esika ya bivarie: bivarie `_kombo` ezali na esika ya bloc ya solo; `\ var` ebomaka liboso
- **Bakisi** Bileko ya bokokanisi ya kokokana: `< 0 :`, `> 5 :`, `== 42 :`, wana nyonso
- **Bakisi** Mbongwana ya module E013: maloba oyo ekosalama na nzoto ya module epekisami
- **Kobongisi** `take_variable` ebebisaka lisusu biloko libela ya module tango ezali kokoma lisusu te
- **Kobongisi** `alias.CONST` sikoyo ekolongolama ndenge ya solo; `#>` ekoki komonana nsima ya ndimbola ya fonksyo
- **VM** Kokani ya nyonso: 393/393 ba test ekoki

### v0.0.3 — Ba Système ya Motángo ya Unicode & Ba Amélioration ya LSP _(Avril 2026)_

- **Bakisi** 69 bloc ya bamonzomi ya Unicode elongo na jeton ya kobongola mode `#d0d9#`
- **Bakisi** Lilakala ya Booleano na makomi nyonso — `#१` / `#०`, `#१` / `#०`, wana nyonso
- **Bakisi** Bamonzomi ya Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Bakisi** `SetNumeralMode` opcode ya VM — kokani ya nyonso na tree-walker
- **Bakisi** REPL ezali koyoka mode ya motángo oyo esalaka na echo na na elakisi ya bivarie
- **Bongoli** Ekateli ya Booleano `>>` sikoyo ezali komema prefixe `#` (`#0` / `#1`) na ba mode nyonso

### v0.0.2_01 — Kobongola Kombo ya Mosali _(30 Marsi 2026)_

- **Bongoli** `c|..|` → `#,|..|` mpe `e|..|` → `#^|..|` — kolandana na libota ya prefixe ya forme `#`
- **Bakisi** Alias ya kobimisa: kobimisa lisusu bamembres ya module na kombo misusu

### v0.0.2 — Kokesana API ya Collection & Ba Installateur _(24 Marsi 2026)_

- **Bakisi** Libota ya mosali `$` oyo esangisami mpo na lilongo mpe mikoló (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Bakisi** Pésa ya kosakola mpo na lilongo, napolo, mpe napolo oyo ezali na kombo
- **Bakisi** Ba index mabe (`arr[-1]` = binama ya suka)
- **Bakisi** Ba installateur ya liboto — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Marsi 2026)_

- **Bakisi** Pésa ekomoni `^=`
- **Kobongisi** Makambo ya ndelo ya parser; mabongisi ya mikanda

### v0.0.1 — Ekateli ya Liboso ya Public _(22 Marsi 2026)_

- Mobalisi ya tree-walker + VM ya registre (`--vm`, ~4× noki, ~95% kokani)
- Bileko nyonso ya motó: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Ba identifiants ya Unicode mobimba, système ya module, lambda, bokangami, kosala na mbongwana
- REPL, LSP, Extension ya VS Code, formateur (`zymbol fmt`)

---

_Zymbol-Lang — Elembo. Mokili mobimba. Ekobongwana te._
