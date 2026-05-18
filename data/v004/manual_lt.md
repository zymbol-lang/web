> **Pranešimas:** Ši dokumentacija buvo sukurta naudojant dirbtinio intelekto (DI) pagalbą.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Kanoninė nuoroda yra **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** interpretatoriaus saugykloje.

---

# Zymbol-Lang Vadovas

**Zymbol-Lang** yra simbolinė programavimo kalba. Nėra raktažodžių — viskas yra simbolis. Veikia vienodai bet kuria žmogaus kalba.

- Nėra `if`, `while`, `return` — tik `?`, `@`, `<~`
- Pilnas Unicode — identifikatoriai bet kuria kalba arba emodžiais
- Nepriklausoma nuo žmogaus kalbos — kodas yra tas pats visur

**Interpretatoriaus versija**: v0.0.4 | **Testų aprėptis**: 393/393 (TW ↔ VM atitiktis)

---

## Kintamieji ir konstantos

```zymbol
x = 10              // kintamas kintamasis
PI := 3.14159       // konstanta — priskirti iš naujo yra vykdymo klaida
vardas = "Alisė"
aktyvus = #1        // Būlio tiesa
👋 := "Sveiki"
```

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

## Duomenų tipai

| Tipas | Literalas | `#?` žymė | Pastabos |
|-------|-----------|-----------|----------|
| Sveikasis | `42`, `-7` | `###` | 64 bitų su ženklu |
| Slankusis kablelis | `3.14`, `1.5e10` | `##.` | Mokslinis žymėjimas leidžiamas |
| Eilutė | `"tekstas"` | `##"` | Interpoliacija: `"Sveiki {vardas}"` |
| Simbolis | `'A'` | `##'` | Vienas Unicode simbolis |
| Būlio | `#1`, `#0` | `##?` | NĖRA skaitinis — `#1 ≠ 1` |
| Masyvas | `[1, 2, 3]` | `##]` | Homogeniški elementai |
| Kortežas | `(a, b)` | `##)` | Pozicinis |
| Pavadintas kortežas | `(x: 1, y: 2)` | `##)` | Pavadinti laukai |
| Funkcija | pavadinta funkcijos nuoroda | `##()` | Pirmos klasės; rodo `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Pirmos klasės; rodo `<lambd/N>` |

```zymbol
// Tipo introspekcija — grąžina (tipas, skaitmenys, reikšmė)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

---

## Išvestis ir įvestis

```zymbol
>> "Sveiki" ¶                       // ¶ arba \\ aiškiam eilutės lūžiui
>> "a=" a " b=" b ¶                 // gretinimas — kelios reikšmės
>> (arr$#) ¶                        // postfikso operatoriams reikia ( ) >> viduje

<< vardas                           // skaityti į kintamąjį (be klausimo)
<< "Įveskite vardą: " vardas        // su klausimu
```

> `¶` (AltGr+R ispaniškoje klaviatūroje) ir `\\` yra lygiaverčiai eilutės lūžiui.

---

## Operatoriai

```zymbol
// Aritmetika — naudokite priskyrimus; kai kurie operatoriai turi ypatybių tiesiogiai >> viduje
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (sveikųjų skaičių dalyba)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (kėlimas laipsniu)

// Palyginimas
a == b    // #0    
a <> b    // #1    
a < b     // #0
a <= b    // #0   
a > b     // #1    
a >= b    // #1

// Loginiai
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Eilutės

```zymbol
// Dvi sujungimo formos
vardas = "Alisė"
n = 42

>> "Sveiki " vardas " jūs turite " n ¶       // gretinimas — >> viduje
aprašas = "Sveiki {vardas}, jūs turite {n}"  // interpoliacija — bet kur
```

```zymbol
s = "Sveikas Pasauli"
ilgis = s$#                  // 14
dalis = s$[1..6]             // "Sveika"  (1-bazė, pabaiga įskaitant)
yra = s$? "Pasauli"          // #1
dalys = "a,b,c,d"$/ ','      // [a, b, c, d]  (skaidyti pagal skirtuką)
pakeista = s$~~["s":"z"]     // "Sveikaz Pazauzi"
pakeista1 = s$~~["s":"z":1]  // "Sveikas Pazauzi"  (tik pirmi N)
```

> `+` yra tik skaičiams. Eilutėms naudokite `,`, gretinimą arba interpoliaciją.

---

## Valdymo srautas

```zymbol
x = 7

? x > 0 { >> "teigiamas" ¶ }

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

> `{ }` riestiniai skliaustai yra **privalomi** net ir vienam sakiniui.

---

## Atitikimas (Match)

```zymbol
// Intervalai
taškai = 85
pažymys = ?? taškai {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> pažymys ¶    // → B

// Eilutės
spalva = "raudona"
kodas = ?? spalva {
    "raudona" : "#FF0000"
    "žalia"   : "#00FF00"
    _         : "#000000"
}

// Palyginimo šablonai
temp = -5
būsena = ?? temp {
    < 0  : "ledas"
    < 20 : "šalta"
    < 35 : "šilta"
    _    : "karšta"
}
>> būsena ¶    // → ledas

// Sakinio forma (blokai)
?? n {
    0        : { >> "nulis" ¶ }
    _? n < 0 : { >> "neigiamas" ¶ }
    _        : { >> "teigiamas" ¶ }
}
```

---

## Ciklai

```zymbol
@ i:0..4  { >> i " " }        // intervalas įskaitant:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // su žingsniu:          1 3 5 7 9
@ i:5..0:1 { >> i " " }       // atvirkštinis:         5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (kol)

vaisiai = ["obuolys", "kriaušė", "vynuogė"]
@ v:vaisiai { >> v ¶ }        // kiekvienam masyvo elementui

@ r:"labas" { >> r "-" }
>> ¶                          // → l-a-b-a-s-  (kiekvienam eilutės simboliui)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> tęsti
    ? i > 7 { @! }            // @! nutraukti
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Begalinis ciklas
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Pažymėtas ciklas (įdėtas nutraukimas)
skaitiklis = 0
@:išorinis {
    skaitiklis++
    ? skaitiklis >= 3 { @:išorinis! }
}
>> skaitiklis ¶               // → 3
```

---

## Funkcijos

```zymbol
suma(a, b) { <~ a + b }
>> suma(3, 4) ¶    // → 7

faktorinė(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorinė(n - 1)
}
>> faktorinė(5) ¶    // → 120
```

Funkcijos turi **izoliuotą apimtį** — jos negali skaityti išorinių kintamųjų. Naudokite išvesties parametrus `<~`, kad pakeistumėte kvietėjo kintamuosius:

```zymbol
sukeisti(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
sukeisti(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Pavadintos funkcijos yra **pirmos klasės reikšmės** — perduokite tiesiogiai: `nums$> dvigubinti`. Taip pat galioja `x -> fn(x)`.

---

## Lambdos ir uždarumai

```zymbol
dvigubinti = x -> x * 2
suma = (a, b) -> a + b
>> dvigubinti(5) ¶   // → 10
>> suma(3, 7) ¶      // → 10

// Bloko lambda
klasifikuoti = x -> {
    ? x > 0 { <~ "teigiamas" }
    _? x < 0 { <~ "neigiamas" }
    <~ "nulis"
}

// Uždarumas — sugeria išorinę apimtį
daugiklis = 3
trigubinti = x -> x * daugiklis
>> trigubinti(7) ¶   // → 21

// Gamykla
sukurti_sumuotoją(n) { <~ x -> x + n }
pridėti10 = sukurti_sumuotoją(10)
>> pridėti10(5) ¶    // → 15

// Masyvuose
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶       // → 25
```

---

## Masyvai

Masyvai yra **kintami** ir turi **to paties tipo** elementus.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — prieiga (1-bazė: pirmasis elementas)
arr[-1]         // 5 — neigiamas indeksas (paskutinis elementas)
arr$#           // 5 — ilgis (naudokite (arr$#) >> viduje)

arr = arr$+ 6            // pridėti → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // įterpti į 2 poziciją (1-bazė)
arr3 = arr$- 3           // pašalinti pirmą reikšmės pasikartojimą
arr4 = arr$-- 3          // pašalinti visus pasikartojimus
arr5 = arr$-[1]          // pašalinti indekse 1 (pirmasis elementas)
arr6 = arr$-[2..3]       // pašalinti intervalą (1-bazė, pabaiga įskaitant)

yra = arr$? 3            // #1 — turi
pozicijos = arr$?? 3     // [3] — visi reikšmės indeksai (1-bazė)
gabalas = arr$[1..3]     // [1,2,3] — atkarpa (1-bazė, pabaiga įskaitant)
gabalas2 = arr$[1:3]     // [1,2,3] — tas pats, kiekio sintaksė

didėjantis = arr$^+      // rikiuoti didėjančiai (tik primityvai)
mažėjantis = arr$^-      // rikiuoti mažėjančiai (tik primityvai)

// Pavadintų/pozicinių kortežų masyvai — naudokite $^ su palyginimo lambda
db = [(vardas: "Karla", amžius: 28), (vardas: "Ana", amžius: 25), (vardas: "Bobas", amžius: 30)]
pagal_amžių   = db$^ (a, b -> a.amžius < b.amžius)    // didėjantis pagal amžių (<)
pagal_vardą   = db$^ (a, b -> a.vardas > b.vardas)   // mažėjantis pagal vardą (>)
>> pagal_amžių[1].vardas ¶    // → Ana
>> pagal_vardą[1].vardas ¶    // → Karla

// Tiesioginė elemento atnaujinimas (tik masyvai)
arr[1] = 99              // priskirti
arr[2] += 5              // sudėtinis: +=  -=  *=  /=  %=  ^=

// Funkcinis atnaujinimas — grąžina naują masyvą; originalas nepakitęs
arr2 = arr[2]$~ 99
```

> Visi rinkinių operatoriai grąžina **naują masyvą**. Priskirkite atgal: `arr = arr$+ 4`.
> `$+` gali būti grandininis: `arr = arr$+ 5$+ 6$+ 7`. Kiti operatoriai naudoja tarpinius priskyrimus.
> **Indeksavimas yra 1-bazė**: `arr[1]` yra pirmasis elementas; `arr[0]` yra vykdymo klaida.
> `$^+` / `$^-` rikiuoja **primityvius masyvus** (skaičius, eilutes). Kortežų masyvams naudokite `$^` su palyginimo lambda — kryptis yra užkoduota lambdoje (`<` = didėjanti, `>` = mažėjanti).

**Reikšmės semantika** — masyvo priskyrimas kitam kintamajam sukuria nepriklausomą kopiją:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b nėra paveiktas
```

```zymbol
// Įdėti masyvai (1-bazė indeksavimas)
matrica = [[1,2,3],[4,5,6],[7,8,9]]
>> matrica[2][3] ¶    // → 6  (2 eilutė, 3 stulpelis)
```

---

## Destruktūrizavimas

```zymbol
// Masyvas
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[pirmas, *likę] = arr        // pirmas=10  likę=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ atmeta

// Pozicinis kortežas
taškas = (100, 200)
(px, py) = taškas            // px=100  py=200

// Pavadintas kortežas
asmuo = (vardas: "Ana", amžius: 25, miestas: "Madridas")
(vardas: v, amžius: a) = asmuo   // v="Ana"  a=25
```

---

## Kortežai

Kortežai yra **nekintami** sutvarkyti konteineriai, kurie gali turėti **skirtingų tipų** reikšmes.
Skirtingai nei masyvai, elementai negali būti pakeisti po sukūrimo.

```zymbol
// Pozicinis — mišrūs tipai leidžiami
taškas = (10, 20)
>> taškas[1] ¶    // → 10

duomenys = (42, "sveiki", #1, 3.14)
>> duomenys[3] ¶  // → #1

// Pavadintas
asmuo = (vardas: "Alisė", amžius: 25)
>> asmuo.vardas ¶    // → Alisė
>> asmuo[1] ¶        // → Alisė  (indeksas taip pat veikia, 1-bazė)

// Įdėtas
poz = (x: 10, y: 20)
p = (poz: poz, etiketė: "pradžia")
>> p.poz.x ¶         // → 10
```

**Nekintamumas** — bet koks bandymas pakeisti kortežo elementą yra vykdymo klaida:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ vykdymo klaida: kortežai yra nekintami
// t[1] += 5    // ❌ ta pati klaida
```

Norėdami gauti pakeistą reikšmę, naudokite `$~` (funkcinis atnaujinimas) — grąžina **naują** kortežą:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← originalas nepakitęs
>> t2 ¶    // → (10, 999, 30)

// Pavadintas kortežas — sukurkite iš naujo aiškiai
asmuo = (vardas: "Alisė", amžius: 25)
vyresnis = (vardas: asmuo.vardas, amžius: 26)
>> asmuo.amžius ¶    // → 25
>> vyresnis.amžius ¶ // → 26
```

---

## Aukštesnės eilės funkcijos

```zymbol
skaičiai = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

dvigubi    = skaičiai$> (x -> x * 2)               // žemėlapis → [2,4,6…20]
lyginiai   = skaičiai$| (x -> x % 2 == 0)          // filtras → [2,4,6,8,10]
viso       = skaičiai$< (0, (acc, x) -> acc + x)   // redukcija → 55

// Grandinė naudojant tarpinius veiksmus
žingsnis1 = skaičiai$| (x -> x > 3)
žingsnis2 = žingsnis1$> (x -> x * x)
>> žingsnis2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Pavadintos funkcijos gali būti perduodamos tiesiogiai AEF
dvigubinti(x) { <~ x * 2 }
yra_didelis(x) { <~ x > 5 }
r = skaičiai$> dvigubinti       // ✅ tiesioginė nuoroda
r = skaičiai$| yra_didelis      // ✅ tiesioginė nuoroda
```

---

## Pipe operatorius

Dešinėje pusėje visada reikia `_` kaip vietos rezervavimo perduodamai reikšmei:

```zymbol
dvigubinti = x -> x * 2
suma = (a, b) -> a + b
inc = x -> x + 1

5 |> dvigubinti(_)        // → 10
10 |> suma(_, 5)          // → 15
5 |> suma(2, _)           // → 7

// Grandininė
r = 5 |> dvigubinti(_) |> inc(_) |> dvigubinti(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Klaidų valdymas

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dalyba iš nulio" ¶
} :! {
    >> "kita klaida: " _err ¶    // _err turi klaidos pranešimą
} :> {
    >> "visada vykdoma" ¶
}
```

| Tipas | Kada |
|-------|------|
| `##Div` | Dalyba iš nulio |
| `##IO` | Failas / sistema |
| `##Index` | Indeksas už ribų |
| `##Type` | Tipų nesuderinamumas |
| `##Parse` | Duomenų analizė |
| `##Network` | Tinklo klaidos |
| `##_` | Bet kokia klaida (sugauna visas) |

---

## Moduliai

```zymbol
// lib/calc.zy — modulio turinys yra riestiniuose skliaustuose
# calc {
    #> { suma, get_PI }

    _PI := 3.14159
    suma(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // pseudonimas privalomas

>> c::suma(5, 3) ¶    // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Eksportuoti su kitu viešu pavadinimu
# mano_biblioteka {
    #> { _vidinė_suma <= sum }

    _vidinė_suma(a, b) { <~ a + b }
}
```

```zymbol
<# ./mano_biblioteka <= m

>> m::sum(3, 4) ¶    // → 7  (vidinis pavadinimas _vidinė_suma yra paslėptas)
```

> **Modulių taisyklės**: `# pavadinimas { }` viduje leidžiami tik `#>`, funkcijų apibrėžimai ir literalų kintamųjų/konstantų inicializatoriai. Vykdomieji sakiniai (`>>`, `<<`, ciklai ir kt.) sukelia klaidą E013.

---

## Skaitmenų režimai

Zymbol gali rodyti skaičius **69 Unicode skaitmenų blokuose** — Devanagari, Arabų-Indų, Tajų, Klingonų pIqaD, Matematinis paryškinimas, LCD segmentai ir kt. Aktyvus režimas veikia tik `>>` išvestį; vidinė aritmetika visada yra dvejetainė.

### Režimo aktyvavimas

Įrašykite tikslo rašto `0` ir `9` skaitmenis tarp `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabų-Indų    (U+0660–U+0669)
#๐๙#    // Tajų          (U+0E50–U+0E59)
#09#    // atstatyti į ASCII
```

### Išvestis ir Būlio reikšmės

```zymbol
x = 42
>> x ¶          // → 42   (ASCII numatytoji)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (dešimtainis taškas visada ASCII)
>> 1 + 2 ¶      // → ३

// Būlio reikšmės: # priešdėlis visada ASCII, skaitmuo prisitaiko
>> #1 ¶         // → #१   (tiesa Devanagari)
>> #0 ¶         // → #०   (klaidinga — skiriasi nuo ० sveikojo skaičiaus nulio)

x = 28 > 4
>> x ¶          // → #१   (palyginimo rezultatas seka aktyvų režimą)
```

### Natūralūs skaitmenų literalai šaltinio kode

Bet kurio palaikomo rašto skaitmenys yra galiojantys literalai — intervaluose, modulyje, palyginimuose:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Būlio literalai bet kuriame rašte

`#` + skaitmuo `0` arba `1` iš bet kurio bloko yra galiojantis Būlio literalas:

```zymbol
#٠٩#
aktyvus = #١        // tas pats kaip #1
>> aktyvus ¶        // → #١
>> (#١ && #٠) ¶     // → #٠
```

> `#` **visada yra ASCII**. `#0` (klaidinga) visada yra vizualiai atskiriamas nuo `0` (sveikojo skaičiaus nulio) kiekviename rašte.

---

## Duomenų operatoriai

```zymbol
// Tipo konvertavimas
##.42         // → 42.0  (į Slankųjį)
###3.7        // → 4     (į Sveikąjį, apvalinti)
##!3.7        // → 3     (į Sveikąjį, trunkuoti)

// Analizuoti eilutę į skaičių
v1 = #|"42"|      // → 42  (Sveikasis)
v2 = #|"3.14"|    // → 3.14  (Slankusis)
v3 = #|"abc"|     // → "abc"  (saugus, be klaidos)

// Apvalinti / trunkuoti
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (apvalinti iki 2 dešimtainių)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (trunkuoti)

// Skaičių formatavimas
fmt = #,|1234567|   // → 1,234,567  (kableliais atskirtas)
sci = #^|12345.678| // → 1.2345678e4  (mokslinis)

// Pagrindų literalai
a = 0x41         // → 'A'  (šešioliktainis)
b = 0b01000001   // → 'A'  (dvejetainis)
c = 0o101        // → 'A'  (aštuntainis)

// Pagrindo konvertavimo išvestis
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integracija su apvalkalu

```zymbol
data = <\ date +%Y-%m-%d \>     // užfiksuoja stdout (įtraukia \n gale)
>> "Šiandien: " data

failas = "duomenys.txt"
turinys = <\ cat {failas} \>    // interpoliacija komandose

išvestis = </"./subscript.zy"/>  // vykdyti kitą Zymbol scenarijų, užfiksuoti išvestį
>> išvestis
```

> `><` užfiksuoja CLI argumentus kaip eilučių masyvą (tik medžio vaikštytojui).

---

---

## Pilnas pavyzdys: FizzBuzz

```zymbol
klasifikuoti(skaičius) {
    ? skaičius % 15 == 0 { <~ "FizzBuzz" }
    _? skaičius % 3  == 0 { <~ "Fizz" }
    _? skaičius % 5  == 0 { <~ "Buzz" }
    _ { <~ skaičius }
}

@ i:1..20 { >> klasifikuoti(i) ¶ }
```

---

## Simbolių nuoroda

| Simbolis | Operacija | Simbolis | Operacija |
|----------|-----------|----------|-----------|
| `=` | kintamasis | `$#` | ilgis |
| `:=` | konstanta | `$+` | pridėti (grandininis) |
| `>>` | išvestis | `$+[i]` | įterpti indekse (1-bazė) |
| `<<` | įvestis | `$-` | pašalinti pirmą pagal reikšmę |
| `¶` / `\\` | eilutės lūžis | `$--` | pašalinti visus pagal reikšmę |
| `?` | jei | `$-[i]` | pašalinti indekse (1-bazė) |
| `_?` | kitaip jei | `$-[i..j]` | pašalinti intervalą (1-bazė) |
| `_` | kitaip / pakaitos simbolis | `$?` | turi |
| `??` | atitikimas | `$??` | rasti visus indeksus (1-bazė) |
| `@` | ciklas | `$[s..e]` | atkarpa (1-bazė) |
| `@ N { }` | N kartų ciklas | `$>` | žemėlapis |
| `@!` | nutraukti | `$|` | filtras |
| `@>` | tęsti | `$<` | redukcija |
| `@:pavadinimas { }` | pažymėtas ciklas | `$/ skir` | eilutės skaidymas |
| `@:pavadinimas!` | nutraukti pažymėtą | `$++ a b c` | konkatenacijos sudarymas |
| `@:pavadinimas>` | tęsti pažymėtą | `arr[i>j>k]` | navigacijos indeksas |
| `->` | lambda | `arr[i] = reikš` | atnaujinti elementą (tik masyvai) |
| `arr[i] += reikš` | sudėtinis atnaujinimas | `arr[i]$~` | funkcinis atnaujinimas (nauja kopija) |
| `$^+` | rikiuoti didėjančiai (primityvai) | `$^-` | rikiuoti mažėjančiai (primityvai) |
| `$^` | rikiuoti su lyginimu (kortežai) | `<~` | grąžinti |
| `|>` | pipe | `!?` | bandyti |
| `:!` | sugauti | `:>` | pagaliau |
| `#1` | tiesa | `#0` | klaidinga |
| `$!` | yra klaida | `$!!` | skleisti klaidą |
| `<#` | importuoti | `#>` | eksportuoti |
| `#` | deklaruoti modulį | `::` | iškviesti modulį |
| `.` | prieiga prie lauko | `#?` | tipo metaduomenys |
| `#|..|` | analizuoti skaičių | `##.` | konvertuoti į Slankųjį |
| `###` | konvertuoti į Sveikąjį (apvalinti) | `##!` | konvertuoti į Sveikąjį (trunkuoti) |
| `#.N|..|` | apvalinti | `#!N|..|` | trunkuoti |
| `#,|..|` | kablelio formatas | `#^|..|` | mokslinis |
| `#d0d9#` | skaitmenų režimo keitimas | `#09#` | atstatyti į ASCII |
| `<\ ..\>` | apvalkalo vykdymas | `>\<` | CLI argumentai |
| `\ var` | sunaikinti kintamąjį aiškiai | | |

---

## Leidimų pakeitimų žurnalas

### v0.0.4 — 1-bazė indeksavimas, Pirmos klasės funkcijos ir Modulių blokai _(2026 m. balandis)_

- **Laužantis** Visas indeksavimas pakeistas į **1-bazę** — `arr[1]` yra pirmasis elementas; `arr[0]` yra vykdymo klaida
- **Pridėta** Pavadintos funkcijos yra **pirmos klasės reikšmės** — perduokite tiesiogiai AEF: `nums$> dvigubinti`
- **Pridėta** Modulių **bloko sintaksė privaloma**: `# pavadinimas { ... }` — plokščia sintaksė pašalinta
- **Pridėta** Daugiamatis indeksavimas: `arr[i>j>k]` (navigacija), `arr[p ; q]` (plokščias ištraukimas)
- **Pridėta** Tipo konvertavimas: `##.išraiška` (Slankusis), `###išraiška` (Sveikasis apvalinti), `##!išraiška` (Sveikasis trunkuoti)
- **Pridėta** Eilutės skaidymas: `str$/ skir` — grąžina `Array(Eilutė)`
- **Pridėta** Konkatenacijos sudarymas: `bazė$++ a b c` — prideda kelis elementus
- **Pridėta** N kartų ciklas: `@ N { }` — pakartoti tiksliai N kartų
- **Pridėta** Pažymėtų ciklų sintaksė: `@:pavadinimas { }`, `@:pavadinimas!`, `@:pavadinimas>` — pakeičia `@ @pavadinimas` / `@! pavadinimas`
- **Pridėtos** Kintamųjų apimties taisyklės: `_pavadinimas` kintamieji turi tikslią bloko apimtį; `\ var` sunaikina anksti
- **Pridėti** Atitikimo palyginimo šablonai: `< 0 :`, `> 5 :`, `== 42 :` ir kt.
- **Pridėta** Modulių E013 klaida: vykdomieji sakiniai modulio turinyje yra uždrausti
- **Pataisyta** `take_variable` nebegadina modulio konstantų įrašant atgal
- **Pataisyta** `alias.KONSTANTA` dabar sprendžiama teisingai; `#>` gali pasirodyti po funkcijų apibrėžimų
- **VM** Pilna atitiktis: 393/393 testų išlaikyta

### v0.0.3 — Unicode skaitmenų sistemos ir LSP patobulinimai _(2026 m. balandis)_

- **Pridėta** 69 Unicode skaitmenų blokai su režimo keitimo žymele `#d0d9#`
- **Pridėti** Būlio literalai bet kuriame rašte — `#१` / `#०`, `#١` / `#٠`, kt.
- **Pridėti** Klingonų pIqaD skaitmenys (CSUR PUA U+F8F0–U+F8F9)
- **Pridėtas** `SetNumeralMode` VM opkodas — pilna atitiktis su medžio vaikštytoju
- **Pridėta** REPL gerbia aktyvų skaitmenų režimą aidoje ir kintamųjų rodyme
- **Pakeista** Būlio `>>` išvestis dabar įtraukia `#` priešdėlį (`#0` / `#1`) visais režimais

### v0.0.2_01 — Operatoriaus pervadinimas _(2026 m. kovo 30 d.)_

- **Pakeista** `c|..|` → `#,|..|` ir `e|..|` → `#^|..|` — nuoseklu su `#` formato priešdėlio šeima
- **Pridėtas** Eksporto pseudonimas: re-eksportuoti modulio narius skirtingu pavadinimu

### v0.0.2 — Rinkinių API pertvarkymas ir diegimo programos _(2026 m. kovo 24 d.)_

- **Pridėta** Vieninga `$` operatorių šeima masyvams ir eilutėms (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Pridėtas** Destruktūrizavimo priskyrimas masyvams, kortežams ir pavadintiems kortežams
- **Pridėti** Neigiami indeksai (`arr[-1]` = paskutinis elementas)
- **Pridėtos** Natyvios diegimo programos — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(2026 m. kovo 25 d.)_

- **Pridėtas** Sudėtinis priskyrimas `^=`
- **Pataisyti** Analizatoriaus aritmetikos kraštiniai atvejai; dokumentacijos pataisymai

### v0.0.1 — Pirmasis viešas leidimas _(2026 m. kovo 22 d.)_

- Medžio vaikštytojo interpretatorius + registrų VM (`--vm`, ~4× greitesnis, ~95% atitiktis)
- Visos pagrindinės struktūros: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Pilnas Unicode identifikatoriai, modulių sistema, lambdos, uždarumai, klaidų valdymas
- REPL, LSP, VS Code plėtinys, formatuotojas (`zymbol fmt`)

---

_Zymbol-Lang — Simbolinė. Universali. Nekintama._
