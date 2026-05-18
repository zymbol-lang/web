> **Įspėjimas:** Ši dokumentacija buvo sukurta ir išversta dirbtinio intelekto (DI).
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Zymbol-Lang Vadovas

> **Peržiūrėta v0.0.5 versijai — 2026-05-12**

**Zymbol-Lang** yra simbolinė programavimo kalba. Be raktinių žodžių — viskas yra simbolis. Veikia vienodai bet kuria žmogaus kalba.

- Nėra `if`, `while`, `return` — tik `?`, `@`, `<~`
- Pilnas Unicode — identifikatoriai bet kuria kalba ar emodžiu
- Neutrali žmogaus kalbos atžvilgiu — kodas yra vienodas visur

**Interpretatoriaus versija**: v0.0.5 | **Testų aprėptis**: 436/436 (TW ↔ VM paritetą)

---

## Kintamieji ir konstantos

```zymbol
x = 10              // kintamasis
PI := 3.14159       // konstanta — pakartotinis priskyrimas yra vykdymo laiko klaida
vardas = "Alice"
aktyvus = #1        // Bulio tiesa
👋 := "Sveikas"
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

`°` (laipsnio ženklas, U+00B0) automatiškai inicializuoja kintamąjį į neutralią reikšmę pirmojo naudojimo metu:

```zymbol
skaiciai = [3, 1, 4, 1, 5]
@ n:skaiciai {
    °viso += n    // auto-inicializacija iki 0 virš ciklo; išlieka po @
}
>> viso ¶         // → 14
```

> `°x` (priešdėlis) inkaro virš ciklo — rezultatas pasiekiamas po `@`.
> `x°` (priesaga) inkaro ciklo viduje — dingsta, kai ciklas baigiasi.
> Tik medžio perėjimui.

---

## Duomenų tipai

| Tipas | Literalas | `#?` žymė | Pastabos |
|-------|---------|----------|---------|
| Sveikas skaičius | `42`, `-7` | `###` | 64 bitų su ženklu |
| Realusis skaičius | `3.14`, `1.5e10` | `##.` | Mokslinė notacija OK |
| Eilutė | `"tekstas"` | `##"` | Interpoliavimas: `"Sveikas {vardas}"` |
| Simbolis | `'A'` | `##'` | Vienas Unicode simbolis |
| Bulio | `#1`, `#0` | `##?` | NE skaitinis — `#1 ≠ 1` |
| Masyvas | `[1, 2, 3]` | `##]` | Homogeniniai elementai |
| Kortežas | `(a, b)` | `##)` | Pozicinis |
| Pavadintas kortežas | `(x: 1, y: 2)` | `##)` | Pavadinti laukai |
| Funkcija | pavadintos funkcijos nuoroda | `##()` | Pirmosios klasės; rodinys `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Pirmosios klasės; rodinys `<lambd/N>` |

```zymbol
// Tipo introspektija — grąžina (tipas, skaitmenys, reikšmė)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Išvestis ir įvestis

```zymbol
>> "Sveikas" ¶                      // ¶ arba \\ aiški eilutės pabaiga
>> "a=" a " b=" b ¶                // gretinimas — kelios reikšmės
>> (masyvas$#) ¶                   // postfikso operatoriai reikalauja ( ) >>

<< vardas                          // skaityti į kintamąjį (be raginimo)
<< "Įveskite vardą: " vardas       // su raginimu
```

> `¶` (AltGr+R ispanų klaviatūroje) ir `\\` yra lygiavertės eilutės pabaigos.

---

## TUI primityvai

Terminalo vartotojo sąsajos operatoriai interaktyvioms programoms. Dauguma reikalauja `>>| { }` bloko (alternatyvus ekranas + žalias režimas).

```zymbol
>>| {
    >>!                             // išvalyti alternatyvų ekraną
    >>~ (1, 1, 0, 10) > "Vykdoma"  // 1 eilutė, 1 stulpelis, fg=10 (žalia)
    @~ 1000                         // pauzė 1 sekundė (1000 ms)
    >>~ (2, 1) > "Atlikta."
}
// terminalas automatiškai atkuriamas išeinant
```

```zymbol
// Klavišo paspaudimas ir terminalo dydis
>>| {
    [eilutes, stulpeliai] = >>?              // užklausti terminalo matmenis
    >>~ (1, 1) > "Terminalas: " eilutes " x " stulpeliai
    <<| klavisas                             // blokuojantis klavišo skaitymas
    >>~ (2, 1) > "Paspausti: " klavisas
}
```

> `>>!` išvalo ekraną. `>>?` grąžina `[eilutes, stulpeliai]`. `@~ N` miega N milisekundžių.
> `<<|` skaito vieną klavišo paspaudimą (blokuojantis); `<<|?` apklausia neblokuodamas (grąžina `'\0'` jei nėra).
> Pozicionuotos išvesties kortežas: `(eilute, stulpelis, BKS, fg, bg)` — bet kurią vietą galima praleisti kableliu (`>>~ (,,, 196) > "raudona"`).
> BKS bitmaska: `1`=Paryškintas, `2`=Kursyvas, `4`=Pabrauktas. ANSI 256 spalvų paletė (`0`=terminalo numatytasis).
> Tik medžio perėjimui (išskyrus `>>!`, `>>?`, `@~`, `>>~` kurie taip pat veikia `--vm`).

---

## Operatoriai

```zymbol
// Aritmetika
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (sveikas skaičių dalyba)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (kėlimas laipsniu)

// Palyginimas — priskirti patikrinimui
l1 = a == b    // #0
l2 = a <> b    // #1
l3 = a < b     // #0
l4 = a <= b    // #0
l5 = a > b     // #1
l6 = a >= b    // #1

// Loginė
g1 = #1 && #0    // #0
g2 = #1 || #0    // #1
g3 = !#1         // #0
```

---

## Eilutės

```zymbol
// Dvi sujungimo formos
vardas = "Alice"
n = 42

>> "Sveikas " vardas " tu turi " n ¶    // gretinimas — >>
aprasymas = "Sveikas {vardas}, tu turi {n}"  // interpoliavimas — bet kur
```

```zymbol
s = "Sveikas Pasauli"
ilgis = s$#                  // 15
dalis = s$[1..7]             // "Sveikas"  (1-pagrįstas, pabaiga įskaičiuota)
yra = s$? "Pasauli"          // #1
dalys = "a,b,c,d"$/ ','      // [a, b, c, d]  (padalyti pagal skyriklį)
pakeis = s$~~["a":"A"]       // "SveikoS PASAuli"
pakeis1 = s$~~["a":"A":1]    // "SveikoS Pasauli"  (tik pirmieji N)
linija = "─" $* 20           // "────────────────────"  (kartoti N kartų)
```

> `+` tik skaičiams. Naudokite `,`, gretinimą arba interpoliavimą eilutėms.

---

## Srauto valdymas

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

> `{ }` riestiniai skliaustai **privalomi** net vienai instrukcijai.

---

## Atitikties tikrinimas

```zymbol
// Diapazonai
rezultatas = 85
pazymys = ?? rezultatas {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> pazymys ¶    // → B

// Eilutės
spalva = "raudona"
kodas = ?? spalva {
    "raudona" => "#FF0000"
    "zalia"   => "#00FF00"
    _         => "#000000"
}

// Palyginimo šablonai
temperatura = -5
busena = ?? temperatura {
    < 0  => "ledas"
    < 20 => "salta"
    < 35 => "silta"
    _    => "karsta"
}
>> busena ¶    // → ledas

// Instrukcijos forma (bloko šakos)
n = -3
?? n {
    0    => { >> "nulis" ¶ }
    < 0  => { >> "neigiamas" ¶ }
    _    => { >> "teigiamas" ¶ }
}
```

---

## Ciklai

```zymbol
@ i:0..4  { >> i " " }        // diapazonas įskaičiuojant:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // su žingsniu:               1 3 5 7 9
@ i:5..0:1 { >> i " " }       // atvirkštinis:              5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

vaisiai = ["obuolys", "kriause", "vynuoge"]
@ v:vaisiai { >> v ¶ }        // for-each masyvas

@ s:"sveikas" { >> s "-" }
>> ¶                          // → s-v-e-i-k-a-s-  (for-each eilutė)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> tęsti
    ? i > 7 { @! }             // @! nutraukti
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

// Pavadintas ciklas (įdėtas nutraukimas)
skaitiklis = 0
@:isore {
    skaitiklis++
    ? skaitiklis >= 3 { @:isore! }
}
>> skaitiklis ¶                    // → 3
```

---

## Funkcijos

```zymbol
sudeti(a, b) { <~ a + b }
>> sudeti(3, 4) ¶    // → 7

faktorialas(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorialas(n - 1)
}
>> faktorialas(5) ¶    // → 120
```

Funkcijos turi **izoliuotą apimtį** — jos negali skaityti išorinių kintamųjų. Naudokite išvesties parametrus `<~`, kad pakeistumėte kviečiančio kodo kintamuosius:

```zymbol
sukeisti(a<~, b<~) {
    laikinas = a
    a = b
    b = laikinas
}
x = 10
y = 20
sukeisti(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Pavadintos funkcijos yra **pirmosios klasės reikšmės** — perduokite tiesiogiai: `skaiciai$> dvigubinti`. Apvyniojimui: `x -> fn(x)` taip pat galioja.

---

## Lambdos ir uždarymai

```zymbol
dvigubinti = x -> x * 2
suma = (a, b) -> a + b
>> dvigubinti(5) ¶    // → 10
>> suma(3, 7) ¶       // → 10

// Bloko lambda
klasifikuoti = x -> {
    ? x > 0 { <~ "teigiamas" }
    _? x < 0 { <~ "neigiamas" }
    <~ "nulis"
}

// Uždarymas — fiksuoja išorinę apimtį
koeficientas = 3
trigubus = x -> x * koeficientas
>> trigubus(7) ¶    // → 21

// Gamykla
sukurti_sudetoja(n) { <~ x -> x + n }
prideti10 = sukurti_sudetoja(10)
>> prideti10(5) ¶    // → 15

// Masyvuose
veiksmai = [x -> x+1, x -> x*2, x -> x*x]
>> veiksmai[3](5) ¶    // → 25
```

---

## Masyvai

Masyvai yra **kintami** ir laiko **to paties tipo** elementus.

```zymbol
masyvas = [1, 2, 3, 4, 5]

x = masyvas[1]      // 1 — prieiga (1-pagrįstas: pirmasis elementas)
x = masyvas[-1]     // 5 — neigiamas indeksas (paskutinis elementas)
x = masyvas$#       // 5 — ilgis (naudoti (masyvas$#) >>)

masyvas = masyvas$+ 6            // pridėti → [1,2,3,4,5,6]
masyvas2 = masyvas$+[2] 99       // įterpti į 2 poziciją (1-pagrįstas)
masyvas3 = masyvas$- 3           // pašalinti pirmą reikšmės pasikartojimą
masyvas4 = masyvas$-- 3          // pašalinti visus pasikartojimus
masyvas5 = masyvas$-[1]          // pašalinti indekse 1 (pirmasis elementas)
masyvas6 = masyvas$-[2..3]       // pašalinti diapazoną (1-pagrįstas, pabaiga įskaičiuota)

yra = masyvas$? 3            // #1 — yra
poz = masyvas$?? 3           // [3] — visi reikšmės indeksai (1-pagrįstas)
dalis = masyvas$[1..3]       // [1,2,3] — dalis (1-pagrįstas, pabaiga įskaičiuota)
dalis2 = masyvas$[1:3]       // [1,2,3] — tas pats, skaičiumi pagrįsta sintaksė

did = masyvas$^+             // rikiuota didėjančiai  (tik primityvai)
mazej = masyvas$^-           // rikiuota mažėjančiai (tik primityvai)

// Pavadintos/pozicijos kortežų masyvai — naudoti $^ su lygintuvo lambda
db = [(vardas: "Carla", amzius: 28), (vardas: "Ana", amzius: 25), (vardas: "Bob", amzius: 30)]
pagal_amziu  = db$^ (a, b -> a.amzius < b.amzius)    // didėjantis pagal amžių  (<)
pagal_varda = db$^ (a, b -> a.vardas > b.vardas)     // mažėjantis pagal vardą (>)
>> pagal_amziu[1].vardas ¶     // → Ana
>> pagal_varda[1].vardas ¶    // → Carla

// Tiesioginis elemento atnaujinimas (tik masyvai)
masyvas[1] = 99              // priskirti
masyvas[2] += 5              // sudėtinis: +=  -=  *=  /=  %=  ^=

// Funkcinis atnaujinimas — grąžina naują masyvą; originalas nepakitęs
masyvas2 = masyvas[2]$~ 99
```

> Visi kolekcijų operatoriai grąžina **naują masyvą**. Priskirti atgal: `masyvas = masyvas$+ 4`.
> `$+` galima sujungti grandinėle: `masyvas = masyvas$+ 5$+ 6$+ 7`. Kiti operatoriai naudoja tarpinius priskyrimus.
> **Indeksavimas yra 1-pagrįstas**: `masyvas[1]` yra pirmasis elementas; `masyvas[0]` yra vykdymo laiko klaida.
> `$^+` / `$^-` rikiuoja **primityvius masyvus** (skaičiai, eilutės). Kortežų masyvams naudoti `$^` su lygintuvo lambda — kryptis koduojama lambdoje (`<` = didėjantis, `>` = mažėjantis).

**Reikšmės semantika** — masyvo priskyrimas kitam kintamajam sukuria nepriklausomą kopiją:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b nepaveiktas
```

```zymbol
// Įdėtieji masyvai (1-pagrįstas indeksavimas)
matrica = [[1,2,3],[4,5,6],[7,8,9]]
>> matrica[2][3] ¶    // → 6  (2 eilutė, 3 stulpelis)
```

---

## Destruktūrizacija

```zymbol
// Masyvas
masyvas = [10, 20, 30, 40, 50]
[a, b, c] = masyvas              // a=10  b=20  c=30
[pirmas, *likusieji] = masyvas   // pirmas=10  likusieji=[20,30,40,50]
[x, _, z] = [1, 2, 3]            // _ išmeta

// Pozicinis kortežas
taskas = (100, 200)
(tx, ty) = taskas                // tx=100  ty=200

// Pavadintas kortežas
asmuo = (vardas: "Ana", amzius: 25, miestas: "Madridas")
(vardas: n, amzius: a) = asmuo   // n="Ana"  a=25
```

---

## Kortežai

Kortežai yra **nekintami** surikiuoti konteineriai, galintys laikyti **skirtingų tipų** reikšmes.
Skirtingai nuo masyvų, elementų negalima keisti po sukūrimo.

```zymbol
// Pozicinis — mišrūs tipai leidžiami
taskas = (10, 20)
>> taskas[1] ¶    // → 10

duomenys = (42, "sveikas", #1, 3.14)
>> duomenys[3] ¶     // → #1

// Pavadintas
asmuo = (vardas: "Alice", amzius: 25)
>> asmuo.vardas ¶    // → Alice
>> asmuo[1] ¶        // → Alice  (indeksas taip pat veikia, 1-pagrįstas)

// Įdėtas
poz = (x: 10, y: 20)
p = (poz: poz, etikete: "kilme")
>> p.poz.x ¶        // → 10
```

**Nekintamumas** — bet koks bandymas pakeisti kortežo elementą yra vykdymo laiko klaida:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ vykdymo laiko klaida: kortežai yra nekintami
// t[1] += 5    // ❌ ta pati klaida
```

Norėdami gauti pakeistą reikšmę, naudokite `$~` (funkcinis atnaujinimas) — grąžina **naują** kortežą:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← originalas nepakitęs
>> t2 ¶    // → (10, 999, 30)

// Pavadintas kortežas — atstatyti aiškiai
asmuo = (vardas: "Alice", amzius: 25)
vyresnis  = (vardas: asmuo.vardas, amzius: 26)
>> asmuo.amzius ¶    // → 25
>> vyresnis.amzius ¶ // → 26
```

---

## Aukštesnės eilės funkcijos

```zymbol
skaiciai = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

dvigubinta  = skaiciai$> (x -> x * 2)                // map  → [2,4,6…20]
lyginiai    = skaiciai$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
viso        = skaiciai$< (0, (akum, x) -> akum + x)  // reduce → 55

// Grandinė per tarpinius kintamuosius
zingsnis1 = skaiciai$| (x -> x > 3)
zingsnis2 = zingsnis1$> (x -> x * x)
>> zingsnis2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Pavadintos funkcijos gali būti tiesiogiai perduotos AEF
dvigubinti(x) { <~ x * 2 }
yra_didelis(x) { <~ x > 5 }
r = skaiciai$> dvigubinti       // ✅ tiesioginė nuoroda
r = skaiciai$| yra_didelis      // ✅ tiesioginė nuoroda
```

---

## Vamzdžio operatorius

Dešinioji pusė visada reikalauja `_` kaip vietos rezervo kanalizuotai reikšmei:

```zymbol
dvigubinti = x -> x * 2
prideti = (a, b) -> a + b
padidinti = x -> x + 1

r1 = 5 |> dvigubinti(_)        // → 10
r2 = 10 |> prideti(_, 5)       // → 15
r3 = 5 |> prideti(2, _)        // → 7

// Grandinėje
r = 5 |> dvigubinti(_) |> padidinti(_) |> dvigubinti(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Klaidų tvarkymas

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dalyba iš nulio" ¶
} :! {
    >> "kita: " _err ¶    // _err laiko klaidos pranešimą
} :> {
    >> "visada vykdoma" ¶
}
```

| Tipas | Kada |
|-------|------|
| `##Div` | Dalyba iš nulio |
| `##IO` | Failas / sistema |
| `##Index` | Indeksas už ribų |
| `##Type` | Tipų neatitikimas |
| `##Parse` | Duomenų analizė |
| `##Network` | Tinklo klaidos |
| `##_` | Bet kokia klaida (pagauna viską) |

---

## Moduliai

```zymbol
// lib/skaiciavimas.zy — modulio turinys yra uždarytas riestiniuose skliaustuose
# skaiciavimas {
    #> { sudeti, gauti_PI }

    _PI := 3.14159
    sudeti(a, b) { <~ a + b }
    gauti_PI() { <~ _PI }
}
```

```zymbol
// pagrindinis.zy
<# ./lib/skaiciavimas => s    // slapyvardis privalomas

>> s::sudeti(5, 3) ¶     // → 8
pi = s::gauti_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Eksportuoti kitu vieša pavadinimu
# mano_biblioteka {
    #> { _vidine_sudotis => suma }

    _vidine_sudotis(a, b) { <~ a + b }
}
```

```zymbol
<# ./mano_biblioteka => m

>> m::suma(3, 4) ¶    // → 7  (vidinis pavadinimas _vidine_sudotis paslėptas)
```

> **Modulio taisyklės**: `# pavadinimas { }` viduje leidžiami tik `#>`, funkcijų apibrėžimai ir literaliniai kintamųjų/konstantų inicializatoriai. Vykdomos instrukcijos (`>>`, `<<`, ciklai ir kt.) sukelia klaidą E013.

---

## Skaitmenų režimai

Zymbol gali rodyti skaičius **69 Unicode skaitmenų scenarijų** — Devanagari, Arabų-Indų, Tailandų, Klingon pIqaD, matematiniu paryškintu, LCD segmentais ir daugiau. Aktyvus režimas veikia tik `>>` išvestį; vidinė aritmetika visada yra dvejetainė.

### Scenarijaus aktyvavimas

Įrašykite tikslinės scenarijaus `0` ir `9` skaitmenį, įdėtą į `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabų-Indų  (U+0660–U+0669)
#๐๙#    // Tailandų    (U+0E50–U+0E59)
#09#    // atstatyti į ASCII
```

### Išvestis ir Bulio reikšmės

```zymbol
x = 42
>> x ¶          // → 42   (ASCII numatytasis)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (dešimtainis taškas visada ASCII)
>> 1 + 2 ¶      // → ३

// Bulio: # priešdėlis visada ASCII, skaitmuo prisitaiko
>> #1 ¶         // → #१   (tiesa Devanagari)
>> #0 ¶         // → #०   (netiesa — skiriasi nuo ०  sveikojo skaičiaus nulio)

x = 28 > 4
>> x ¶          // → #१   (palyginimo rezultatas seka aktyvų režimą)
```

### Natyvūs skaitmenų literalai šaltinyje

Bet kurio palaikomo scenarijaus skaitmenys yra galiojantys literalai — diapazonuose, modulio, palyginimuose:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Bulio literalai bet kuriame scenarijuje

`#` + skaitmuo `0` arba `1` iš bet kurio bloko yra galiojantis Bulio literalas:

```zymbol
#٠٩#
aktyvus = #١        // tas pats kaip #1
>> aktyvus ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` yra **visada ASCII**. `#0` (netiesa) visada vizualiai skiriasi nuo `0` (sveikojo skaičiaus nulis) visais scenarijais.

---

## Duomenų operatoriai

```zymbol
// Tipo konversija
f = ##.42         // → 42.0  (į Realųjį skaičių)
i = ###3.7        // → 4     (į Sveiką skaičių, apvalinimas)
t = ##!3.7        // → 3     (į Sveiką skaičių, karpymas)

// Analizuoti eilutę kaip skaičių
v1 = #|"42"|      // → 42  (Sveikas skaičius)
v2 = #|"3.14"|    // → 3.14  (Realusis skaičius)
v3 = #|"abc"|     // → "abc"  (saugu, be klaidos)

// Apvalinti / karpyti
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (apvalinti iki 2 dešimtainių)
r4 = #.4|pi|      // → 3.1416
k2 = #!2|pi|      // → 3.14  (karpymas)

// Skaičių formatavimas
fmt = #,|1234567|  // → 1,234,567  (su kableliu atskirtas)
mok = #^|12345.678|    // → 1.2345678e4  (mokslinė notacija)

// Bazės literalai
a = 0x41         // → 'A'  (šešioliktainis)
b = 0b01000001   // → 'A'  (dvejetainis)
c = 0o101        // → 'A'  (aštuoniainis)

// Bazės konversijos išvestis
heks = 0x|255|    // → "0x00FF"
dv = 0b|65|       // → "0b1000001"
asmt = 0o|8|      // → "0o10"
des = 0d|255|     // → "0d0255"
```

---

## Apvalkalo integracija

```zymbol
data = <\ date +%Y-%m-%d \>     // fiksuoja stdout (su galiniu \n)
>> "Šiandien: " data

failas = "duomenys.txt"
turinys = <\ cat {failas} \>      // interpoliavimas komandose

isvestis = </"./poscenarijus.zy"/>   // vykdyti kitą Zymbol scenarijų, fiksuoti išvestį
>> isvestis
```

> `><` fiksuoja CLI argumentus kaip eilučių masyvą (tik medžio perėjimui).

---

## Pilnas pavyzdys: FizzBuzz

```zymbol
klasifikuoti(skaicius) {
    ? skaicius % 15 == 0 { <~ "FizzBuzz" }
    _? skaicius % 3  == 0 { <~ "Fizz" }
    _? skaicius % 5  == 0 { <~ "Buzz" }
    _ { <~ skaicius }
}

@ i:1..20 { >> klasifikuoti(i) ¶ }
```

---

## Simbolių nuoroda

| Simbolis | Operacija | Simbolis | Operacija |
|---------|----------|---------|----------|
| `=` | kintamasis | `$#` | ilgis |
| `:=` | konstanta | `$+` | pridėti (grandinėjamas) |
| `>>` | išvestis | `$+[i]` | įterpti į indeksą (1-pagrįstas) |
| `<<` | įvestis | `$-` | pašalinti pirmą pagal reikšmę |
| `¶` / `\\` | eilutės pabaiga | `$--` | pašalinti visus pagal reikšmę |
| `?` | if | `$-[i]` | pašalinti pagal indeksą (1-pagrįstas) |
| `_?` | else-if | `$-[i..j]` | pašalinti diapazoną (1-pagrįstas) |
| `_` | else / pakaitalas | `$?` | yra |
| `??` | atitikties tikrinimas | `$??` | rasti visus indeksus (1-pagrįstas) |
| `@` | ciklas | `$[s..e]` | dalis (1-pagrįstas) |
| `@ N { }` | ciklas N kartų | `$>` | map |
| `@!` | nutraukti | `$\|` | filter |
| `@>` | tęsti | `$<` | reduce |
| `@:pav { }` | pavadintas ciklas | `$/ skyriklis` | eilutės padalijimas |
| `@:pav!` | nutraukti žymę | `$++ a b c` | sujungimo kūrimas |
| `@:pav>` | tęsti žymę | `masyvas[i>j>k]` | navigacinis indeksas |
| `->` | lambda | `masyvas[i] = r` | atnaujinti elementą (tik masyvai) |
| `masyvas[i] += r` | sudėtinis atnaujinimas | `masyvas[i]$~` | funkcinis atnaujinimas (nauja kopija) |
| `$^+` | rikiuoti didėjančiai (primityvai) | `$^-` | rikiuoti mažėjančiai (primityvai) |
| `$^` | rikiuoti su lygintuve (kortežai) | `<~` | grąžinti |
| `\|>` | vamzdis | `!?` | bandyti |
| `:!` | pagauti | `:>` | galų gale |
| `#1` | tiesa | `#0` | netiesa |
| `$!` | yra klaida | `$!!` | skleisti klaidą |
| `<#` | importuoti | `#>` | eksportuoti |
| `#` | deklaruoti modulį | `::` | modulio iškvietimas |
| `.` | lauko prieiga | `#?` | tipo metaduomenys |
| `#\|..\|` | analizuoti skaičių | `##.` | konvertuoti į Realųjį |
| `###` | konvertuoti į Sveiką (apv.) | `##!` | konvertuoti į Sveiką (karp.) |
| `#.N\|..\|` | apvalinti | `#!N\|..\|` | karpyti |
| `#,\|..\|` | kablelio formatas | `#^\|..\|` | mokslinė notacija |
| `#d0d9#` | skaitmenų režimo jungiklis | `#09#` | atstatyti į ASCII |
| `<\ ..\>` | apvalkalo vykdymas | `>\<` | CLI argumentai |
| `\ kint` | aiškiai sunaikinti kintamąjį | `°x` / `x°` | karštas apibrėžimas (auto-inicializacija) |
| `>>|` | TUI blokas (alt-ekranas) | `>>~` | pozicionuota išvestis |
| `>>!` | valyti ekraną | `>>?` | užklausti terminalo dydį |
| `<<\|` | blokuojantis klavišo paspaudimas | `<<\|?` | neblokuojantis klavišo paspaudimas |
| `@~ N` | miegoti N milisekundžių | `$*` | kartoti eilutę N kartų |

---

## Pakeitimų žurnalas

### v0.0.5 — TUI primityvai, karštas apibrėžimas ir eilutės kartojimas _(Gegužė 2026)_

- **Laužianti** Atitikties šakos skirtuvas: `šablonas : rezultatas` → `šablonas => rezultatas`
- **Laužianti** Importo slapyvardis: `<# kelias <= slapyvardis` → `<# kelias => slapyvardis`
- **Laužianti** Eksporto pervadinimas: `#> { fn <= vies }` → `#> { fn => vies }`
- **Pridėta** TUI blokas `>>| { }` — alternatyvus ekranas + žalias režimas; valymas išeinant
- **Pridėta** Pozicionuota išvestis `>>~ (eilute, stulpelis, BKS, fg, bg) > elementai` — reta vieta, 256 spalvų ANSI
- **Pridėta** Klavišų įvestis `<<| kintamasis` (blokuojantis) ir `<<|? kintamasis` (neblokuojantis apklausa)
- **Pridėta** `>>!` valyti ekraną, `>>?` užklausti terminalo dydį, `@~ N` miegoti N milisekundžių
- **Pridėta** Karštas apibrėžimas `°x` / `x°` — auto-inicializuoja kintamąjį pirmojo naudojimo cikle metu
- **Pridėta** Eilutės kartojimas `eilute $* N` — kartoti eilutę N kartų
- **VM** Paritetas: 436/436 testų praeina

### v0.0.4 — 1-pagrįstas indeksavimas, pirmosios klasės funkcijos ir modulių blokai _(Balandis 2026)_

- **Laužianti** Visas indeksavimas perjungtas į **1-pagrįstą** — `masyvas[1]` yra pirmasis elementas; `masyvas[0]` yra vykdymo laiko klaida
- **Pridėta** Pavadintos funkcijos yra **pirmosios klasės reikšmės** — perduokite tiesiogiai AEF: `skaiciai$> dvigubinti`
- **Pridėta** Modulio **bloko sintaksė** privaloma: `# pavadinimas { ... }` — plokščia sintaksė pašalinta
- **Pridėta** Daugiamačius indeksavimas: `masyvas[i>j>k]` (navigacija), `masyvas[p ; q]` (plokščias ištraukimas)
- **Pridėta** Tipo konversija: `##.išraiška` (Realusis), `###išraiška` (Sveikas apvalinimas), `##!išraiška` (Sveikas karpymas)
- **Pridėta** Eilutės padalijimas: `eilute$/ skyriklis` — grąžina `Array(String)`
- **Pridėta** Sujungimo kūrimas: `bazė$++ a b c` — prideda kelis elementus
- **Pridėta** N kartų ciklas: `@ N { }` — kartoti tiksliai N kartų
- **Pridėta** Pavadinto ciklo sintaksė: `@:pav { }`, `@:pav!`, `@:pav>` — pakeičia `@ @pav` / `@! pav`
- **Pridėta** Kintamųjų apimties taisyklės: `_pav` kintamieji turi tikslią bloko apimtį; `\ kint` naikina anksčiau
- **Pridėta** Atitikties palyginimo šablonai: `< 0 :`, `> 5 :`, `== 42 :` ir kt.
- **Pridėta** Modulio E013 klaida: vykdomos instrukcijos modulio turinyje yra draudžiamos
- **Ištaisyta** `take_variable` nebegadina modulio konstantų atgalinio rašymo metu
- **Ištaisyta** `slapyvardis.KONSTANTA` dabar teisingai išsprendžiama; `#>` gali pasirodyti po funkcijų apibrėžimų
- **VM** Pilnas paritetas: 393/393 testų praeina

### v0.0.3 — Unicode skaitmenų sistemos ir LSP patobulinimai _(Balandis 2026)_

- **Pridėta** 69 Unicode skaitmenų blokai su režimo perjungimo žetonu `#d0d9#`
- **Pridėta** Bulio literalai bet kuriame scenarijuje — `#१` / `#०`, `#١` / `#٠` ir kt.
- **Pridėta** Klingon pIqaD skaitmenys (CSUR PUA U+F8F0–U+F8F9)
- **Pridėta** VM operacinis kodas `SetNumeralMode` — pilnas paritetas su medžio perėjimu
- **Pridėta** REPL gerbia aktyvų skaitmenų režimą aido ir kintamųjų rodinys
- **Pakeista** Bulio `>>` išvestis dabar apima `#` priešdėlį (`#0` / `#1`) visuose režimuose

### v0.0.2_01 — Operatoriaus pervadinimas _(30 Kov 2026)_

- **Pakeista** `c|..|` → `#,|..|` ir `e|..|` → `#^|..|` — nuoseklus su `#` formato priešdėlio šeima
- **Pridėta** Eksporto slapyvardis: pakartotinai eksportuoti modulio narius kitu pavadinimu

### v0.0.2 — Kolekcijos API pertvarkymas ir diegimo programos _(24 Kov 2026)_

- **Pridėta** Unifikuota `$` operatorių šeima masyvams ir eilutėms (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Pridėta** Destruktūrizacijos priskyrimas masyvams, kortežams ir pavadinti kortežams
- **Pridėta** Neigiami indeksai (`masyvas[-1]` = paskutinis elementas)
- **Pridėta** Natyvios diegimo programos — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Kov 2026)_

- **Pridėta** Sudėtinis priskyrimas `^=`
- **Ištaisyta** Analizatoriaus aritmetikos kraštutiniai atvejai; dokumentacijos pataisymai

### v0.0.1 — Pirmasis viešas leidimas _(22 Kov 2026)_

- Medžio perėjimo interpretatorius + registrų VM (`--vm`, ~4× greičiau, ~95% paritetas)
- Visos pagrindinės konstrukcijos: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Pilni Unicode identifikatoriai, modulių sistema, lambdos, uždarymai, klaidų tvarkymas
- REPL, LSP, VS Code plėtinys, formatuotojas (`zymbol fmt`)

---

_Zymbol-Lang — Simbolinė. Universali. Nekintama._
