# Dokumentacija | Kompaktiška Zymbol-Lang vadovėlis

**Zymbol-Lang** yra simbolinė programavimo kalba. Ji nenaudoja raktažodžių — viskas yra simbolis. Ji veikia vienodai bet kurioje žmonių kalboje. Nėra raktažodžių (`jei`, `ciklas`, `grąžinimas` neegzistuoja — tik simboliai `?`, `@`, `<~`). Pilnas Unicode palaikymas — identifikatoriai bet kuria kalba ar emoji 👋

---

## Kintamieji ir Konstantos

```zymbol
x = 10           // kintamasis (keičiamas)
PI := 3.14159    // konstanta (nekeičiama — klaida pakartotinai priskiriant)
vardas = "Ana"
aktyvus = #1     // loginė reikšmė true
👋 := "Labas"
```

### Sudėtinis Priskyrimas

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

---

## Duomenų Tipai

| Tipas            | Pavyzdys            | `#?` Simbolis | Pastabos                              |
|------------------|---------------------|---------------|---------------------------------------|
| Sveikasis        | `42`, `-7`          | `###`         | 64 bitų su ženklu                     |
| Slankusis kablelis | `3.14`, `1.5e10`  | `##.`         | Mokslinis žymėjimas palaikomas        |
| Eilutė           | `"labas"`           | `##"`         | Interpolacija: `"Labas {vardas}"`     |
| Simbolis         | `'A'`               | `##'`         | Vienas Unicode simbolis               |
| Loginė           | `#1`, `#0`          | `##?`         | NE skaitinė 1 ir 0                    |
| Masyvas          | `[1, 2, 3]`         | `##]`         | Visi elementai turi būti to paties tipo|
| Tuple            | `(a, b)`            | `##)`         | Pozicinis                             |
| Pavadintas Tuple | `(x: 1, y: 2)`      | `##)`         | Prieiga pagal pavadinimą ar indeksą   |

---

## Išvestis ir Įvestis

```zymbol
// Išvestis — NEPRIDEDA automatiškai naujos eilutės
>> "Labas" ¶                          // ¶ arba \\ suteikia aiškią naują eilutę
>> "a=" a " b=" b ¶                   // kelios reikšmės su juxtapozicija
>> "suma=" sudėti(2, 3) ¶             // funkcijų iškvietimai bet kurioje vietoje
>> (arr$#) ¶                          // postfikso operatoriai reikalauja skliaustų

// Įvestis
<< vardas                             // be raginimo — skaito į kintamąjį
<< "Jūsų vardas? " vardas            // su raginimu
```

> `¶` arba `\\` yra ekvivalentai kaip nauja eilutė.

---

## Operatoriai

```zymbol
// Aritmetika
5 + 2    // → 7
5 - 2    // → 3
5 * 2    // → 10
5 / 2    // → 2.5
5 % 2    // → 1
5 ^ 2    // → 25   (kėlimas laipsniu)

// Palyginimas (grąžina #1 arba #0)
5 == 5   // → #1
5 != 4   // → #1
5 > 4    // → #1
5 < 4    // → #0
5 >= 5   // → #1
5 <= 4   // → #0

// Loginiai
#1 && #0    // → #0   (ir)
#1 || #0    // → #1   (arba)
!#1         // → #0   (ne)
```

---

## Eilutės

Trys galiojančios formos — kiekviena savo kontekstui:

```zymbol
vardas = "Ana"
skaičius = 25

// 1. Kablelis — priskyrimuose su = ar :=
žinutė = "Labas ", vardas, "!"              // → Labas Ana!
PAVADINIMAS := "Vartotojas: ", vardas

// 2. Juxtapozicija — >> išvestyje
>> "Labas " vardas " tau " skaičius ¶       // → Labas Ana tau 25

// 3. Interpolacija — bet kuriame kontekste
aprašymas = "Labas {vardas}, tau {skaičius}" // → Labas Ana, tau 25
```

```zymbol
// Pakeisti — s$~~["senas":"naujas"]
s = "labas pasauli"
s = s$~~["pasauli":"žemė"]      // → "labas žemė"
s = s$~~["a":"A":1]             // → "lAbas žemė"   pakeisti pirmuosius N atvejus
```

> **Pastaba**: `+` skirtas tik skaičiams. Naudojimas su eilutėmis generuoja įspėjimą.

---

## Valdymo Srautas

```zymbol
x = 7

// Paprastas sąlyga
? x > 0 { >> "teigiamas" ¶ }

// sąlyga / kita-sąlyga / kita
? x > 100 {
    >> "didelis" ¶
} _? x > 0 {
    >> "teigiamas" ¶
} _? x == 0 {
    >> "nulis" ¶
} _ {
    >> "neigiamas" ¶
}
```

Blokai `{ }` yra **privalomi** net vienai eilutei.

---

## Atitikimas

```zymbol
// Atitikimas su diapazonais
taškai = 85
įvertinimas = ?? taškai {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> įvertinimas ¶    // → B

// Atitikimas su sąlygomis (savavališkos sąlygos)
temperatūra = -5
būsena = ?? temperatūra {
    _? temperatūra < 0  : "ledas"
    _? temperatūra < 20 : "šalta"
    _? temperatūra < 35 : "šilta"
    _                   : "karšta"
}
>> būsena ¶    // → ledas

// Atitikimas su eilutėmis
spalva = "raudona"
kodas = ?? spalva {
    "raudona" : "#FF0000"
    "žalia"   : "#00FF00"
    _         : "#000000"
}
>> kodas ¶
```

---

## Ciklai

```zymbol
// Įtraukiantis diapazonas: 0..4 iteruoja 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Diapazonas su žingsniu
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Atvirkštinis diapazonas
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Kol ciklas
skaičius = 1
@ skaičius <= 64 { skaičius *= 2 }
>> skaičius ¶    // → 128

// Kiekvienam masyvo elementui
vaisius = ["obuolys", "kriaušė", "vynuogė"]
@ f:vaisius { >> f ¶ }

// Per eilutės simbolius
@ c:"labas" { >> c "-" }
>> ¶    // → l-a-b-a-s-

// Pertrauka ir Tęsinys
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> tęsti
    ? i > 7 { @! }          // @! pertraukti
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funkcijos

```zymbol
// Deklaracija ir iškvietimas
sudėti(a, b) { <~ a + b }
>> sudėti(3, 4) ¶    // → 7

// Rekursija
faktorialas(skaičius) {
    ? skaičius <= 1 { <~ 1 }
    <~ skaičius * faktorialas(skaičius - 1)
}
>> faktorialas(5) ¶    // → 120

// Funkcijos turi izoliuotą apimtį — be prieigos prie išorinių kintamųjų
globalus = 100
testuoti() {
    x = 42    // tik lokalus
    <~ x
}
>> testuoti() ¶    // → 42
```

> **Svarbu**: Pavadintos funkcijos `pavadinimas(params){ }` nėra pirmosios klasės reikšmės.
> Norint perduoti kaip argumentą, apvilkite: `x -> pavadinimas(x)`.

---

## Lambdos ir Uždarai

```zymbol
// Paprasta lambda (numanomas grąžinimas)
padvigubintas = x -> x * 2
suma = (a, b) -> a + b
>> padvigubintas(5) ¶    // → 10
>> suma(3, 7) ¶          // → 10

// Bloko lambda (aiškus grąžinimas)
klasifikuok = x -> {
    ? x > 0 { <~ "teigiamas" }
    _? x < 0 { <~ "neigiamas" }
    <~ "nulis"
}
>> klasifikuok(5) ¶     // → teigiamas
>> klasifikuok(0) ¶     // → nulis
>> klasifikuok(-5) ¶    // → neigiamas

// Uždarai — lambdos fiksuoja išorinės apimties kintamuosius
faktorius = 3
patrigubintas = x -> x * faktorius    // fiksuoja 'faktorius'
>> patrigubintas(7) ¶    // → 21

// Funkcijų fabrikas
sukurti_sudėjiklį(n) { <~ x -> x + n }
pridėti10 = sukurti_sudėjiklį(10)
pridėti20 = sukurti_sudėjiklį(20)
>> pridėti10(5) ¶    // → 15
>> pridėti20(5) ¶    // → 25

// Lambdos kaip reikšmės: saugomos masyvuose
operacijos = [x -> x+1, x -> x*2, x -> x*x]
>> operacijos[0](5) ¶    // → 6
>> operacijos[1](5) ¶    // → 10
>> operacijos[2](5) ¶    // → 25
```

---

## Masyvai

Masyvai yra **keičiami** ir laiko **to paties tipo** elementus.

```zymbol
arr = [10, 20, 30, 40, 50]

// Prieiga (0 pagrįstas indeksas)
>> arr[0] ¶    // → 10
>> arr[2] ¶    // → 30
>> arr[-1] ¶   // → 50   neigiamas indeksas

// Ilgis (reikalauja skliaustų >>)
skaičius = arr$#
>> skaičius ¶      // → 5
>> (arr$#) ¶       // → 5

// Pridėti, pašalinti, yra, pjūvis
arr = arr$+ 60               // [10, 20, 30, 40, 50, 60]
arr = arr$- 0                // indekso 0 pašalinimas: [20, 30, 40, 50, 60]
yra = arr$? 30               // → #1
idx = arr$?? 30              // → [1]   visi indeksai reikšmei
pjūvis = arr$[0..2]          // pjūvis [0,2): [20, 30]
skaičius_pjūvis = arr$[0:3]  // skaičiumi pagrįstas: [20, 30, 40]

// Tiesioginis elemento atnaujinimas (tik masyvai)
arr[1] = 99              // priskirti
arr[0] += 5              // sudėtinis: +=  -=  *=  /=  %=  ^=

// Funkcinis atnaujinimas — grąžina naują masyvą; originalas nepakitęs
arr2 = arr[1]$~ 77           // → [20, 77, 40, 50, 60]

// Rūšiuoti (primityvai)
num = [3, 1, 4, 1, 5]
didėjantis  = num$^+         // → [1, 1, 3, 4, 5]
mažėjantis  = num$^-         // → [5, 4, 3, 1, 1]

// Rūšiuoti tuples su komparatoriaus lambda
poros = [(2,"b"), (1,"a"), (3,"c")]
surūšiuota = poros$^ ((a,b) -> a[0] - b[0])    // rūšiuoti pagal pirmą elementą

// Įdėtiniai masyvai
matrica = [[1,2],[3,4],[5,6]]
>> matrica[1][0] ¶    // → 3

// Kiekvienam elementui
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` grąžina **naują masyvą** — priskirkite atgal: `arr = arr$+ 4`.
> Negalima grandinėti: naudokite du atskirus priskyrimus.
> `arr$??` ir `arr$[s:n]` naudoja kitokią sintaksę nei `arr$[s..e]` — žr. Simbolių Nuoroda.

**Reikšmių semantika** — priskiriant masyvą kitam kintamajam sukuriama nepriklausoma kopija:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b nepaveiktas
```

---

## Destrukturizacija

```zymbol
// Masyvo destrukturizacija
arr = [10, 20, 30]
[a, b, c] = arr
>> a ¶    // → 10
>> b ¶    // → 20

// Pozicinio tuple destrukturizacija
pt = (3, 4)
(x, y) = pt
>> x ¶    // → 3

// Pavadinto tuple destrukturizacija
asmuo = (vardas: "Alice", amžius: 25)
(vardas: v, amžius: am) = asmuo
>> v ¶     // → Alice
>> am ¶    // → 25
```

---

## Tuplai

Tuplai yra **nekintami** tvarkomi konteineriai, galintys laikyti **skirtingų tipų** reikšmes. Skirtingai nuo masyvų, elementų po sukūrimo keisti negalima.

```zymbol
// Pozicinis tuple
taškas = (10, 20)
>> taškas[0] ¶    // → 10
>> taškas[1] ¶    // → 20

duomenys = (42, "labas", #1, 3.14)
>> duomenys[2] ¶     // → #1

// Pavadintas tuple
asmuo = (vardas: "Alice", amžius: 25)
>> asmuo.vardas ¶    // → Alice
>> asmuo.amžius ¶    // → 25
>> asmuo[0] ¶        // → Alice (indeksas taip pat veikia)

// Įdėtinis
pos = (x: 3, y: 4)
p = (pos: pos, etiketė: "pradžia")
>> p.etiketė ¶    // → pradžia
>> p.pos.x ¶      // → 3
```

**Nekintamumas** — bet koks bandymas pakeisti tuple elementą yra vykdymo klaida:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ vykdymo klaida: tuplai yra nekintami
// t[0] += 5    // ❌ ta pati klaida
```

Norėdami gauti pakeistą reikšmę, naudokite `$~` (funkcinis atnaujinimas) — grąžina **naują** tuplą:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← originalas nepakitęs
>> t2 ¶    // → (10, 999, 30)

// Pavadintas tuple — rekonstruokite eksplicitiškai
asmuo = (vardas: "Alice", amžius: 25)
vyresnis = (vardas: asmuo.vardas, amžius: 26)
>> asmuo.amžius ¶    // → 25
>> vyresnis.amžius ¶ // → 26
```

---

## Aukštesnės Eilės Funkcijos

HOF operatoriai reikalauja **įterptinės lambdos** — ne tiesioginio lambda kintamojo.

```zymbol
skaičiai = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Žemėlapis ($>)
padvigubinti = skaičiai$> (x -> x * 2)
>> padvigubinti ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filtravimas ($|)
lyginiai = skaičiai$| (x -> x % 2 == 0)
>> lyginiai ¶    // → [2, 4, 6, 8, 10]

// Redukcija ($<) — (pradinė reikšmė, (acc, elem) -> išraiška)
iš_viso = skaičiai$< (0, (acc, x) -> acc + x)
>> iš_viso ¶    // → 55

// Negalima tiesiogiai grandinėti — naudokite tarpines reikšmes
žingsnis1 = skaičiai$| (x -> x > 5)
žingsnis2 = žingsnis1$> (x -> x * x)
>> žingsnis2 ¶    // → [36, 49, 64, 81, 100]
```

---

## Vamzdžio Operatorius

```zymbol
// |> perduoda kairę reikšmę kaip _ dešinėje išraiškoje
rezultatas = 5 |> _ * 2 |> _ + 1
>> rezultatas ¶    // → 11

// Grandinės transformacijos
žodžiai = ["labas", "pasauli"]
išvestis = žodžiai
    |> _$> (w -> w$#)              // žemėlapis į ilgius: [5, 6]
    |> _$< (0, (a,x) -> a+x)      // sumavimas: 11
>> išvestis ¶    // → 11
```

---

## Klaidų Tvarkymas

```zymbol
// Bandyti / Pagauti / Galų Gale
!? {
    x = 10 / 0
} :! ##Div {
    >> "dalyba iš nulio" ¶
} :! ##IO {
    >> "I/V klaida" ¶
} :! {
    >> "kita klaida: " _err ¶    // _err turi klaidos pranešimą
} :> {
    >> "visada vykdoma" ¶
}

// Gaudymas pagal indekso tipą
!? {
    arr = [1, 2, 3]
    v = arr[10]
} :! ##Index {
    >> "indeksas už ribų" ¶
}
```

### Klaidų Tipai

| Tipas       | Kada įvyksta             |
|-------------|--------------------------|
| `##Div`     | Dalyba iš nulio          |
| `##IO`      | Failas / sistema         |
| `##Index`   | Indeksas už ribų         |
| `##Type`    | Tipo klaida              |
| `##Parse`   | Duomenų analizė          |
| `##Network` | Tinklo klaidos           |
| `##_`       | Bet kuri klaida          |

---

## Moduliai

```zymbol
// Failas: lib/calc.zy
# calc                    // deklaracija — visada viršuje

#> {                      // eksportai — TURI būti prieš apibrėžimus
    sudėti
    get_PI
}

_PI := 3.14159

sudėti(a, b) { <~ a + b }
get_PI() { <~ _PI }       // getter konstantai (reikalingas apėjimas)
```

```zymbol
// Failas: main.zy
<# ./lib/calc <= c         // slapyvardis privalomas

>> c::sudėti(5, 3) ¶       // → 8  — iškvietimas su ::
pi = c::get_PI()
>> pi ¶                    // → 3.14159
```

> **Pastaba**: `alias.PAVADINIMAS` konstantoms neveikia — naudokite getter funkciją.

---

## Skaitmeniniai Režimai

Zymbol gali rodyti skaičius **69 „Unicode" skaitmenų raštais** — Devanagari, Arabų-Indų, Tajų, Klingon pIqaD, Matematinis Pusjuodis, LCD segmentai ir kt. Aktyvus režimas veikia tik `>>`-išvestį; vidinė aritmetika visada yra dvejetainė.

### Rašto aktyvavimas

Parašykite tikslinio rašto skaitmenį `0` ir `9`, uždarytu į `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabų-Indų    (U+0660–U+0669)
#๐๙#    // Tajų          (U+0E50–U+0E59)
#09#    // atkurti ASCII
```

### Išvestis ir loginės reikšmės

```zymbol
x = 42
>> x ¶          // → 42   (ASCII numatytasis)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (dešimtainis taškas visada ASCII)
>> 1 + 2 ¶      // → ३

// Loginės: # priešdėlis visada ASCII, skaitmuo prisitaiko
>> #1 ¶         // → #१   (tiesa Devanagari)
>> #0 ¶         // → #०   (netiesa — skiriasi nuo ०  sveikas skaičius nulis)

x = 28 > 4
>> x ¶          // → #१   (palyginimo rezultatas seka aktyvų režimą)
```

### Vietiniai skaitmenų literalai šaltinio kode

Bet kurio palaikomo rašto skaitmenys yra galiojantys literalai — diapazonuose, modulo, palyginimuose:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Loginiai literalai bet kuriame rašte

`#` + skaitmuo `0` arba `1` iš bet kurio bloko yra galiojantis loginis literalas:

```zymbol
#٠٩#
نشط = #١        // tas pats kaip #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` yra **visada ASCII**. `#0` (netiesa) visada vizualiai skiriasi nuo `0` (sveikas skaičius nulis) kiekviename rašte.

---

## Duomenų Operatoriai

```zymbol
// Analizuoti eilutę į skaičių
x = #|"42"|          // → 42    (sveikasis)
y = #|"3.14"|        // → 3.14  (slankusis kablelis)

// Apvalinti / sutrumpinti
r = #.2|3.14159|     // → 3.14   apvalinti iki 2 skaičių po kablelio
t = #!2|3.14159|     // → 3.14   sutrumpinti iki 2 skaičių po kablelio

// Formatuoti skaičių
s = #,|1234567.89|    // → "1,234,567.89"  kablelių formatas
e = #^|0.00042|       // → "4.2e-4"        mokslinis žymėjimas

// Pagrindo literalai
h = 0xFF             // → 255  šešioliktainis
b = 0b1010           // → 10   dvejetainis
o = 0o17             // → 15   aštuonetainis

// Pagrindo konversija
hex = 255$>>"16"     // → "FF"
bin = 10$>>"2"       // → "1010"
```

---

## Apvalkalo Integracija

```zymbol
// Paleisti apvalkalo komandą ir užfiksuoti išvestį
išvestis = <\ ls -la \>
>> išvestis ¶

// Interpolacija komandose
katalogas = "/tmp"
failai = <\ ls {katalogas} \>

// Daugiaeilis scenarijaus blokas
rezultatas = </
    echo "labas"
    pwd
/>

// Nukreipti išvestį į apvalkalą (be fiksavimo)
>< "echo labas"
```

> `><` siunčia išvestį į apvalkalą jos nefiksuodamas.

---

## Pilnas Pavyzdys: FizzBuzz

```zymbol
klasifikuok(skaičius) {
    ? skaičius % 15 == 0 { <~ "ŠnypšDūz" }
    _? skaičius % 3  == 0 { <~ "Šnypš" }
    _? skaičius % 5  == 0 { <~ "Dūz" }
    _ { <~ skaičius }
}
@ i:1..20 { >> klasifikuok(i) ¶ }
```

---

## Simbolių Nuoroda

| Simbolis    | Operacija            | Simbolis     | Operacija                  |
|-------------|----------------------|--------------|----------------------------|
| `=`         | kintamasis           | `$#`         | ilgis                      |
| `:=`        | konstanta            | `$+`         | pridėjimas (append)        |
| `>>`        | išvestis             | `$+[i]`      | įterpimas indekse          |
| `<<`        | įvestis              | `$--`        | paskutinio šalinimas       |
| `¶`/`\`     | nauja eilutė         | `$-[i]`      | šalinimas indekse          |
| `?`         | jei (if)             | `$-[i..j]`   | diapazono šalinimas        |
| `_?`        | kita-jei (elif)      | `$?`         | yra                        |
| `_`         | kita / universalus   | `$??`        | visi indeksai reikšmei     |
| `??`        | atitikimas           | `$[s..e]`    | pjūvis                     |
| `@`         | ciklas               | `$>`         | žemėlapis                  |
| `@!`        | pertraukti           | `$\|`        | filtravimas                |
| `@>`        | tęsti                | `$<`         | redukcija                  |
| `->`        | lambda               | `$<`         | redukcija                  |
| `arr[i] = val` | atnaujinti elementą (tik masyvai) | `arr[i] += val` | sudėtinis atnaujinimas |
| `arr[i]$~`  | funkcinis atnaujinimas (nauja kopija) | `$^+` | rūšiuoti didėjančiai (primityviems) |
| `$^-`       | rūšiuoti mažėjančiai (primityviems) | `$^` | rūšiuoti komparatoriumi (tuple) |
| `<~`        | grąžinti             | `!?`         | bandyti (try)              |
| `\|>`       | vamzdis              | `:!`         | pagauti (catch)            |
| `#1`        | tiesa                | `$!`         | yra klaida                 |
| `#0`        | netiesa              | `$!!`        | skleisti klaidą            |
| `:>`        | galų gale (finally)  | `#`          | deklaruoti modulį          |
| `<#`        | importuoti           | `#>`         | eksportuoti                |
| `.`         | lauko prieiga        | `::`         | modulio iškvietimas        |
| `#\|..\|`   | analizuoti (parse)   | `#.N\|..\|`  | apvalinti N skaičių        |
| `#!N\|..\|` | sutrumpinti N sk.    | `#,\|..\|`    | kablelių formatas          |
| `#d0d9#` | skaitmeninio režimo perjungiklis | `#09#` | atkurti ASCII |
| `#^\|..\|`   | mokslinis žym.       | `<\ \>`      | apvalkalo komanda          |
| `><`        | apvalkalo išvestis   | `$~~[..]`    | pakeisti eilutėje          |
| `[a,b]=arr` | destrukturizacija    | `(x,y)=tup`  | tuple destrukturizacija    |

---

*Zymbol-Lang — Simbolinis. Universalus. Nekintamas.*

## Versijų Istorija

### v0.0.3 — „Unicode" Skaičių Sistemos & LSP Patobulinimai _(2026 m. balandis)_

- **Pridėta** 69 „Unicode" skaitmenų blokai su režimo perjungimo žetonu `#d0d9#`
- **Pridėta** Loginiai literalai bet kuriame rašte — `#१` / `#०`, `#١` / `#٠` ir kt.
- **Pridėta** Klingon pIqaD skaitmenys (CSUR PUA U+F8F0–U+F8F9)
- **Pridėta** VM opkodas `SetNumeralMode` — visiškas paritetą su tree-walker
- **Pridėta** REPL gerbia aktyvų skaitmeninį režimą aidint ir rodant kintamuosius
- **Pakeista** `>>` loginių reikšmių išvestis dabar apima priešdėlį `#` (`#0` / `#1`) visuose režimuose

### v0.0.2_01 — Operatorių Pervadinimas _(2026 m. kovo 30 d.)_

- **Pakeista** `c|..|` → `#,|..|` ir `e|..|` → `#^|..|` — nuoseklu su priešdėlio `#` šeima
- **Pridėta** Eksporto pseudonimas: modulio narių reeksportavimas kitu pavadinimu

### v0.0.2 — Kolekcijų API Pertvarkymas & Diegėjai _(2026 m. kovo 24 d.)_

- **Pridėta** Bendroji `$` operatorių šeima masyvams ir eilutėms (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Pridėta** Destruktūrizavimas masyvams, kortežams ir įvardintiems kortežams
- **Pridėta** Neigiami indeksai (`arr[-1]` = paskutinis elementas)
- **Pridėta** Vietiniai diegėjai — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(2026 m. kovo 25 d.)_

- **Pridėta** Sudėtinis priskyrimas `^=`
- **Pataisyta** Aritmetinio analizatoriaus kraštiniai atvejai; dokumentacijos pataisymai

### v0.0.1 — Pirmasis Viešas Leidimas _(2026 m. kovo 22 d.)_

- Tree-walker interpretatorius + registro VM (`--vm`, ~4× greitesnis, ~95% paritetą)
- Visi pagrindiniai konstruktai: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Pilni „Unicode" identifikatoriai, modulių sistema, lambdos, uždaros, klaidų tvarkymas
- REPL, LSP, VS Code plėtinys, formatuotuvas (`zymbol fmt`)

---

**Pastaba:** Ši dokumentacija buvo sukurta ir išversta dirbtinio intelekto (DI). Buvo dedamos visos pastangos užtikrinti tikslumą, tačiau kai kurie vertimai ar pavyzdžiai gali turėti klaidų. Autoritetinga nuoroda yra [Zymbol-Lang specifikacija](https://github.com/zymbol-lang/interpreter).

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The canonical reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
