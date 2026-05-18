> **Njoftim:** Ky dokumentacion është krijuar me ndihmën e inteligjencës artificiale (IA).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Referenca kanonike është **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** në depon e interpretuesit.

---

# Manuali i Zymbol-Lang

**Zymbol-Lang** është një gjuhë programimi simbolike. Pa fjalë kyçe — gjithçka është simbol. Punon në mënyrë identike në çdo gjuhë njerëzore.

- Pa `if`, `while`, `return` — vetëm `?`, `@`, `<~`
- Unicode i plotë — identifikues në çdo gjuhë ose emoji
- Agnostike ndaj gjuhës njerëzore — kodi është i njëjtë kudo

**Versioni i interpretuesit**: v0.0.4 | **Mbulimi i testeve**: 393/393 (barazia TW ↔ VM)

---

## Variablat dhe Konstantat

```zymbol
x = 10              // variabël i ndryshueshëm
PI := 3.14159       // konstante — ricaktimi është gabim në kohë ekzekutimi
emri = "Alis"
aktiv = #1          // Boolean i vërtetë
👋 := "Përshëndetje"
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

## Llojet e të Dhënave

| Lloji | Literal | Etiketa `#?` | Shënime |
|-------|---------|--------------|---------|
| Numër i plotë | `42`, `-7` | `###` | 64-bit me shenjë |
| Pikë lundruese | `3.14`, `1.5e10` | `##.` | Shënimi shkencor i lejuar |
| Varg | `"tekst"` | `##"` | Interpolimi: `"Përshëndetje {emri}"` |
| Karakter | `'A'` | `##'` | Një karakter Unicode |
| Boolean | `#1`, `#0` | `##?` | NUK është numerik — `#1 ≠ 1` |
| Vargu | `[1, 2, 3]` | `##]` | Elemente homogjene |
| Tuple | `(a, b)` | `##)` | Pozicional |
| Tuple i emërtuar | `(x: 1, y: 2)` | `##)` | Fusha të emërtuara |
| Funksion | referencë funksioni i emërtuar | `##()` | Klasa e parë; shfaq `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Klasa e parë; shfaq `<lambd/N>` |

```zymbol
// Introspeksioni i llojit — kthen (lloji, shifrat, vlera)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Prodhimi dhe Hyrja

```zymbol
>> "Përshëndetje" ¶                       // ¶ ose \\ për rresht të ri të qartë
>> "a=" a " b=" b ¶                     // vendosja krah për krah — vlera të shumta
>> (arr$#) ¶                            // operatorët pasfiks kërkojnë ( ) brenda >>

<< emri                                 // lexo në variabël (pa kërkesë)
<< "Shkruani emrin: " emri              // me kërkesë
```

> `¶` (AltGr+R në tastierën Spanjolle) dhe `\\` janë ekuivalente për rresht të ri.

---

## Operatorët

```zymbol
// Aritmetikë — përdor caktimet; disa operatorë kanë çudira direkt brenda >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (pjestimi i numrave të plotë)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (fuqizimi)

// Krahasimi
a == b    // #0    
a <> b    // #1    
a < b     // #0
a <= b    // #0   
a > b     // #1    
a >= b    // #1

// Logjikë
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Vargjet

```zymbol
// Dy forma lidhjeje
emri = "Alis"
n = 42

>> "Përshëndetje " emri " ju keni " n ¶       // vendosja krah për krah — brenda >>
përshkrimi = "Përshëndetje {emri}, ju keni {n}"   // interpolimi — kudo
```

```zymbol
s = "Përshëndetje Botë"
gjatësia = s$#                  // 12
nën = s$[1..5]                 // "Përsh"  (baza-1, fundi i përfshirë)
ka = s$? "Botë"                // #1
pjesët = "a,b,c,d"$/ ','       // [a, b, c, d]  (nda me ndarës)
zëvendësuar = s$~~["ë":"a"]    // "Përshandetje Bota"
zëvendësuar1 = s$~~["ë":"a":1] // "Përshandetje Botë"  (vetëm N të parët)
```

> `+` është vetëm për numra. Për vargje, përdorni `,`, vendosjen krah për krah, ose interpolimin.

---

## Rrjedha e Kontrollit

```zymbol
x = 7

? x > 0 { >> "pozitiv" ¶ }

? x > 100 {
    >> "i madh" ¶
} _? x > 0 {
    >> "pozitiv" ¶
} _? x == 0 {
    >> "zero" ¶
} _ {
    >> "negativ" ¶
}
```

> Kllapat kaçurrela `{ }` **janë të detyrueshme** edhe për një deklaratë të vetme.

---

## Përputhja (Match)

```zymbol
// Intervalet
pikët = 85
nota = ?? pikët {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> nota ¶       // → B

// Vargjet
ngjyra = "kuqe"
kodi = ?? ngjyra {
    "kuqe"   : "#FF0000"
    "gjelbër" : "#00FF00"
    _        : "#000000"
}

// Modelet e krahasimit
temperatura = -5
gjendja = ?? temperatura {
    < 0  : "akull"
    < 20 : "ftohtë"
    < 35 : "i ngrohtë"
    _    : "nxehtë"
}
>> gjendja ¶    // → akull

// Forma e deklaratës (blloqe)
?? n {
    0        : { >> "zero" ¶ }
    _? n < 0 : { >> "negativ" ¶ }
    _        : { >> "pozitiv" ¶ }
}
```

---

## Ciklet

```zymbol
@ i:0..4  { >> i " " }        // intervali i përfshirë:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // me hap:              1 3 5 7 9
@ i:5..0:1 { >> i " " }       // i kundërt:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (ndërsa)

frutat = ["mollë", "dardhë", "rrush"]
@ f:frutat { >> f ¶ }          // për çdo element në varg

@ k:"përshëndetje" { >> k "-" }
>> ¶                          // → p-ë-r-s-h-ë-n-d-e-t-j-e-  (për çdo karakter në varg)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> vazhdo
    ? i > 7 { @! }            // @! thyen
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Cikli i pafund
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Cikli i etiketuar (thyerje e mbivendosur)
numëruesi = 0
@:jashtëm {
    numëruesi++
    ? numëruesi >= 3 { @:jashtëm! }
}
>> numëruesi ¶                // → 3
```

---

## Funksionet

```zymbol
mbledh(a, b) { <~ a + b }
>> mbledh(3, 4) ¶   // → 7

faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120
```

Funksionet kanë **shtrirje të izoluar** — ato nuk mund të lexojnë variablat e jashtme. Përdorni parametrat e daljes `<~` për të modifikuar variablat e thirrësit:

```zymbol
këmbe(a<~, b<~) {
    përkohshëm = a
    a = b
    b = përkohshëm
}
x = 10
y = 20
këmbe(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Funksionet e emërtuara janë **vlera të klasës së parë** — dërgo direkt: `nums$> dyfish`. `x -> fn(x)` është gjithashtu i vlefshëm.

---

## Lambdat dhe Mbylljet

```zymbol
dyfish = x -> x * 2
mbledh = (a, b) -> a + b
>> dyfish(5) ¶   // → 10
>> mbledh(3, 7) ¶ // → 10

// Lambda blloku
klasifiko = x -> {
    ? x > 0 { <~ "pozitiv" }
    _? x < 0 { <~ "negativ" }
    <~ "zero"
}

// Mbyllja — kap shtrirjen e jashtme
faktori = 3
trefish = x -> x * faktori
>> trefish(7) ¶   // → 21

// Fabrika
krijo_mbledhës(n) { <~ x -> x + n }
mbledh_dhjetë = krijo_mbledhës(10)
>> mbledh_dhjetë(5) ¶   // → 15

// Në vargje
operacionet = [x -> x+1, x -> x*2, x -> x*x]
>> operacionet[3](5) ¶   // → 25
```

---

## Vargjet

Vargjet janë **të ndryshueshëm** dhe përmbajnë elemente të **të njëjtit lloj**.

```zymbol
vargu = [1, 2, 3, 4, 5]

vargu[1]          // 1 — qasje (baza-1: elementi i parë)
vargu[-1]         // 5 — indeksi negativ (elementi i fundit)
vargu$#           // 5 — gjatësia (përdorni (vargu$#) brenda >>)

vargu = vargu$+ 6            // shto → [1,2,3,4,5,6]
vargu2 = vargu$+[2] 99       // fut në pozicionin 2 (baza-1)
vargu3 = vargu$- 3           // hiq shfaqjen e parë të vlerës
vargu4 = vargu$-- 3          // hiq të gjitha shfaqjet
vargu5 = vargu$-[1]          // hiq në indeksin 1 (elementi i parë)
vargu6 = vargu$-[2..3]       // hiq intervalin (baza-1, fundi i përfshirë)

ka = vargu$? 3               // #1 — përmban
pozicionet = vargu$?? 3       // [3] — të gjitha indekset e vlerës (baza-1)
fetë = vargu$[1..3]          // [1,2,3] — fetë (baza-1, fundi i përfshirë)
fetë2 = vargu$[1:3]          // [1,2,3] — e njëjta, sintaksa e bazuar në numër

rritës = vargu$^+            // rendit rritës (vetëm primitivë)
zbritës = vargu$^-           // rendit zbritës (vetëm primitivë)

// Vargjet e tupleve të emërtuar/pozicional — përdorni $^ me lambda krahasimi
db = [(emri: "Carla", mosha: 28), (emri: "Ana", mosha: 25), (emri: "Bob", mosha: 30)]
sipas_moshës   = db$^ (a, b -> a.mosha < b.mosha)    // rritës sipas moshës (<)
sipas_emrit   = db$^ (a, b -> a.emri > b.emri)      // zbritës sipas emrit (>)
>> sipas_moshës[1].emri ¶     // → Ana
>> sipas_emrit[1].emri ¶      // → Carla

// Përditësimi i drejtpërdrejtë i elementit (vetëm vargje)
vargu[1] = 99              // cakto
vargu[2] += 5              // i përbërë: +=  -=  *=  /=  %=  ^=

// Përditësimi funksional — kthen një varg të ri; origjinali i pandryshuar
vargu2 = vargu[2]$~ 99
```

> Të gjithë operatorët e koleksionit kthejnë **një varg të ri**. Cakto përsëri: `vargu = vargu$+ 4`.
> `$+` mund të zinxhirohet: `vargu = vargu$+ 5$+ 6$+ 7`. Operatorët e tjerë përdorin caktime të ndërmjetme.
> **Indeksimi është baza-1**: `vargu[1]` është elementi i parë; `vargu[0]` është gabim në kohë ekzekutimi.
> `$^+` / `$^-` renditin **vargjet primitivë** (numrat, vargjet). Për vargjet e tupleve përdorni $^ me lambda krahasimi — drejtimi është i koduar në lambda (`<` = rritës, `>` = zbritës).

**Semantika e vlerës** — caktimi i një vargu te një variabël tjetër krijon një kopje të pavarur:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b nuk ndikohet
```

```zymbol
// Vargje të mbivendosur (indeksimi baza-1)
matrica = [[1,2,3],[4,5,6],[7,8,9]]
>> matrica[2][3] ¶    // → 6  (rreshti 2, kolona 3)
```

---

## Shkatërrimi

```zymbol
// Vargu
vargu = [10, 20, 30, 40, 50]
[a, b, c] = vargu               // a=10  b=20  c=30
[i_pari, *të_tjerët] = vargu    // i_pari=10  të_tjerët=[20,30,40,50]
[x, _, z] = [1, 2, 3]          // _ injoron

// Tuple pozicional
pika = (100, 200)
(px, py) = pika                // px=100  py=200

// Tuple i emërtuar
personi = (emri: "Ana", mosha: 25, qyteti: "Madrid")
(emri: e, mosha: m) = personi   // e="Ana"  m=25
```

---

## Tuplet

Tuple janë kontejnerë të renditur **të pandryshueshëm** që mund të mbajnë vlera të **llojеve të ndryshme**.
Ndryshe nga vargjet, elementet nuk mund të ndryshohen pas krijimit.

```zymbol
// Pozicional — lejohen llojet e përziera
pika = (10, 20)
>> pika[1] ¶     // → 10

të_dhënat = (42, "përshëndetje", #1, 3.14)
>> të_dhënat[3] ¶   // → #1

// I emërtuar
personi = (emri: "Alis", mosha: 25)
>> personi.emri ¶    // → Alis
>> personi[1] ¶      // → Alis  (indeksi gjithashtu funksionon, baza-1)

// I mbivendosur
pozicioni = (x: 10, y: 20)
p = (pozicioni: pozicioni, etiketa: "origjina")
>> p.pozicioni.x ¶    // → 10
```

**Pandryshueshmëria** — çdo përpjekje për të modifikuar një element tuple është gabim në kohë ekzekutimi:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ gabim në kohë ekzekutimi: tuple janë të pandryshueshëm
// t[1] += 5    // ❌ i njëjti gabim

// Tuple i emërtuar — rindërto në mënyrë të qartë
personi = (emri: "Alis", mosha: 25)
më_i_madh = (emri: personi.emri, mosha: 26)
>> personi.mosha ¶    // → 25
>> më_i_madh.mosha ¶  // → 26
```

Për të marrë një vlerë të modifikuar, përdorni `$~` (përditësimi funksional) — kthen një tuple **të ri**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← origjinali i pandryshuar
>> t2 ¶    // → (10, 999, 30)
```

---

## Funksionet e Rradhës së Lartë

```zymbol
numrat = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

të_dyfishuar = numrat$> (x -> x * 2)                 // hartë → [2,4,6…20]
çift   = numrat$| (x -> x % 2 == 0)                // filtër → [2,4,6,8,10]
total    = numrat$< (0, (akum, x) -> akum + x)      // zvogëlim → 55

// Zinxhiri përmes ndërmjetësve
hapi1 = numrat$| (x -> x > 3)
hapi2 = hapi1$> (x -> x * x)
>> hapi2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Funksionet e emërtuara mund të dërgohen direkt te funksionet e rendit të lartë
dyfish(x) { <~ x * 2 }
është_i_madh(x) { <~ x > 5 }
r = numrat$> dyfish       // ✅ referencë direkte
r = numrat$| është_i_madh   // ✅ referencë direkte
```

---

## Operatori i Tubacionit

Ana e djathtë kërkon gjithmonë `_` si vendmbajtës për vlerën e tubuar:

```zymbol
dyfish = x -> x * 2
mbledh = (a, b) -> a + b
rrit = x -> x + 1

5 |> dyfish(_)        // → 10
10 |> mbledh(_, 5)    // → 15
5 |> mbledh(2, _)     // → 7

// I zinxhiruar
r = 5 |> dyfish(_) |> rrit(_) |> dyfish(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Trajtimi i Gabimeve

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "pjestimi me zero" ¶
} :! {
    >> "gabim tjetër: " _err ¶    // _err mban mesazhin e gabimit
} :> {
    >> "ekzekutohet gjithmonë" ¶
}
```

| Lloji | Kur |
|-------|-----|
| `##Div` | Pjestimi me zero |
| `##IO` | Skedar / sistem |
| `##Index` | Indeksi jashtë kufijve |
| `##Type` | Mosputhje e llojit |
| `##Parse` | Interpretimi i të dhënave |
| `##Network` | Gabime të rrjetit |
| `##_` | Çdo gabim (kap të gjitha) |

---

## Modulet

```zymbol
// lib/calc.zy — trupi i modulit është brenda kllapave kaçurrela
# calc {
    #> { mbledh, get_PI }

    _PI := 3.14159
    mbledh(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // pseudonimi është i detyrueshëm

>> c::mbledh(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Eksporto me një emër publik të ndryshëm
# biblioteka_ime {
    #> { _mbledh_brendshëm <= shuma }

    _mbledh_brendshëm(a, b) { <~ a + b }
}
```

```zymbol
<# ./biblioteka_ime <= m

>> m::shuma(3, 4) ¶    // → 7  (emri i brendshëm _mbledh_brendshëm është i fshehur)
```

> **Rregullat e moduleve**: brenda `# emri { }`, lejohen vetëm `#>`, përkufizimet e funksioneve dhe inicializuesit e variablave/konstantave literale. Deklaratat e ekzekutueshme (`>>`, `<<`, ciklet, etj.) shkaktojnë gabimin E013.

---

## Mënyrat Numerike

Zymbol mund të shfaqë numrat në **69 blloqe shifrash Unicode** — Devanagari, Arabiko-Indiane, Tajlandeze, Klingon pIqaD, Trashë Matematikore, segmente LCD, dhe më shumë. Mënyra aktive ndikon vetëm në prodhimin `>>`; aritmetika e brendshme është gjithmonë binare.

### Aktivizimi i një shkrimi

Shkruani shifrat `0` dhe `9` të shkrimit të synuar brenda `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabiko-Indiane (U+0660–U+0669)
#๐๙#    // Tajlandeze     (U+0E50–U+0E59)
#09#    // rivendos në ASCII
```

### Prodhimi dhe Booleanët

```zymbol
x = 42
>> x ¶          // → 42   (parazgjedhja ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (pika dhjetore është gjithmonë ASCII)
>> 1 + 2 ¶      // → ३

// Booleanët: parashtesa # është gjithmonë ASCII, shifra përshtatet
>> #1 ¶         // → #१   (e vërtetë në Devanagari)
>> #0 ¶         // → #०   (e gabuar — e dallueshme nga ० numri i plotë zero)

x = 28 > 4
>> x ¶          // → #१   (rezultati i krahasimit ndjek mënyrën aktive)
```

---

## Literalët e shifrave vendase në kodin burimor

Shifrat e çdo shkrimi të mbështetur janë literalë të vlefshëm — në intervale, në modul, në krahasime:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Literalë Boolean në çdo shkrim

`#` + shifra `0` ose `1` nga çdo bllok është një literal Boolean i vlefshëm:

```zymbol
#०९#
aktiv = #१        // njëlloj si #1
>> aktiv ¶        // → #१
>> (#१ && #०) ¶   // → #०
```

> `#` **është gjithmonë ASCII**. `#0` (e gabuar) është gjithmonë vizualisht e dallueshme nga `0` (numri i plotë zero) në çdo shkrim.

---

## Operatorët e të Dhënave

```zymbol
// Shndërrimi i llojit
##.42         // → 42.0  (në Pikë Lundruese)
###3.7        // → 4     (në Numër të Plotë, rrumbullakos)
##!3.7        // → 3     (në Numër të Plotë, shkurto)

// Interpretimi i vargut në numër
v1 = #|"42"|      // → 42  (Numër i Plotë)
v2 = #|"3.14"|    // → 3.14  (Pikë Lundruese)
v3 = #|"abc"|     // → "abc"  (i sigurt, pa gabim)

// Rrumbullakimi / shkurtimi
pi = 3.14159265
rrumbullakos2 = #.2|pi|     // → 3.14  (rrumbullakos në 2 shifra dhjetore)
rrumbullakos4 = #.4|pi|     // → 3.1416
shkurto2 = #!2|pi|          // → 3.14  (shkurto)

// Formatimi i numrave
formati = #,|1234567|   // → 1,234,567  (i ndarë me presje)
shkencor = #^|12345.678| // → 1.2345678e4  (shkencor)

// Literalët e bazës
a = 0x41         // → 'A'  (heksadecimal)
b = 0b01000001   // → 'A'  (binar)
c = 0o101        // → 'A'  (oktal)

// Prodhimi i shndërrimit të bazës
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integrimi me Shell

```zymbol
data = <\ date +%Y-%m-%d \>     // kap stdout (përfshin \n në fund)
>> "Sot: " data

skedari = "të_dhënat.txt"
përmbajtja = <\ cat {skedari} \>    // interpolimi në komanda

prodhimi = </"./subscript.zy"/>     // ekzekuto një skriptë tjetër Zymbol, kap prodhimin
>> prodhimi
```

> `><` kap argumentet CLI si një varg vargjesh (vetëm për shëtitësin e pemëve).

---

## Shembulli i Plotë: FizzBuzz

```zymbol
klasifiko(numri) {
    ? numri % 15 == 0 { <~ "FizzBuzz" }
    _? numri % 3  == 0 { <~ "Fizz" }
    _? numri % 5  == 0 { <~ "Buzz" }
    _ { <~ numri }
}

@ i:1..20 { >> klasifiko(i) ¶ }
```

---

## Referenca e Simboleve

| Simboli | Operacioni | Simboli | Operacioni |
|---------|-----------|---------|-----------|
| `=` | variabël | `$#` | gjatësia |
| `:=` | konstante | `$+` | shto (i zinxhirueshëm) |
| `>>` | prodhim | `$+[i]` | fut në indeks (baza-1) |
| `<<` | hyrje | `$-` | hiq të parin sipas vlerës |
| `¶` / `\\` | rresht i ri | `$--` | hiq të gjithë sipas vlerës |
| `?` | nëse | `$-[i]` | hiq në indeks (baza-1) |
| `_?` | përndryshe nëse | `$-[i..j]` | hiq intervalin (baza-1) |
| `_` | përndryshe / e gjithçka | `$?` | përmban |
| `??` | përputh | `$??` | gjej të gjitha indekset (baza-1) |
| `@` | cikël | `$[s..e]` | fetë (baza-1) |
| `@ N { }` | cikël N herë | `$>` | hartë |
| `@!` | thyen | `$|` | filtër |
| `@>` | vazhdon | `$<` | zvogëlim |
| `@:emri { }` | cikël i etiketuar | `$/ ndarës` | ndarje vargu |
| `@:emri!` | thyen të etiketuarin | `$++ a b c` | ndërtim lidhjeje |
| `@:emri>` | vazhdon të etiketuarin | `vargu[i>j>k]` | indeksi i lundrimit |
| `->` | lambda | `vargu[i] = vlera` | përditëso elementin (vetëm vargje) |
| `vargu[i] += vlera` | përditësim i përbërë | `vargu[i]$~` | përditësim funksional (kopje e re) |
| `$^+` | rendit rritës (primitivë) | `$^-` | rendit zbritës (primitivë) |
| `$^` | rendit me krahasues (tuple) | `<~` | kthe |
| `|>` | tubacion | `!?` | provo |
| `:!` | kap | `:>` | më në fund |
| `#1` | e vërtetë | `#0` | e gabuar |
| `$!` | është gabim | `$!!` | përhap gabimin |
| `<#` | importo | `#>` | eksporto |
| `#` | deklaroj modul | `::` | thërres modulin |
| `.` | qasje në fushë | `#?` | metadata e llojit |
| `#\|..\|` | interpreto numrin | `##.` | shndërro në Pikë Lundruese |
| `###` | shndërro në Numër të Plotë (rrumbullakos) | `##!` | shndërro në Numër të Plotë (shkurto) |
| `#.N\|..\|` | rrumbullakos | `#!N\|..\|` | shkurto |
| `#,\|..\|` | format me presje | `#^\|..\|` | shkencor |
| `#d0d9#` | ndrysho mënyrën numerike | `#09#` | rivendos në ASCII |
| `<\ ..\>` | ekzekuto shell | `>\<` | argumentet CLI |
| `\ var` | shkatërro variablin në mënyrë të qartë | | |

---

## Regjistri i Ndryshimeve të Lëshimeve

### v0.0.4 — Indeksimi Baza-1, Funksionet e Klasës së Parë & Blloqet e Moduleve _(Prill 2026)_

- **Thyes** I gjithë indeksimi u ndryshua në **baza-1** — `vargu[1]` është elementi i parë; `vargu[0]` është gabim në kohë ekzekutimi
- **Shtuar** Funksionet e emërtuara janë **vlera të klasës së parë** — dërgo direkt te funksionet e rendit të lartë: `nums$> dyfish`
- **Shtuar** **Sintaksa e bllokut** për modulet është e detyrueshme: `# emri { ... }` — sintaksa e sheshtë u hoq
- **Shtuar** Indeksimi shumëdimensional: `vargu[i>j>k]` (lundrimi), `vargu[p ; q]` (nxjerrja e sheshtë)
- **Shtuar** Shndërrimi i llojit: `##.shprehje` (Pikë Lundruese), `###shprehje` (Numër i Plotë rrumbullakos), `##!shprehje` (Numër i Plotë shkurto)
- **Shtuar** Ndarja e vargut: `vargu$/ ndarës` — kthen `Array(Varg)`
- **Shtuar** Ndërtimi i lidhjes: `baza$++ a b c` — shton disa elementë
- **Shtuar** Cikli N herë: `@ N { }` — përsërit saktësisht N herë
- **Shtuar** Sintaksa e cikleve të etiketuara: `@:emri { }`, `@:emri!`, `@:emri>` — zëvendëson `@ @emri` / `@! emri`
- **Shtuar** Rregullat e shtrirjes së variablave: variablat `_emri` kanë shtrirje të saktë blloku; `\ var` shkatërron herët
- **Shtuar** Modelet e krahasimit të përputhjes: `< 0 :`, `> 5 :`, `== 42 :`, etj.
- **Shtuar** Gabimi i modulit E013: deklaratat e ekzekutueshme në trupin e modulit janë të ndaluara
- **Rregulluar** `take_variable` nuk i prish më konstantat e modulit gjatë rivëshkrimit
- **Rregulluar** `alias.CONST` tani zgjidhet saktë; `#>` mund të shfaqet pas përkufizimeve të funksioneve
- **VM** Barazi e plotë: 393/339 teste kalojnë

### v0.0.3 — Sistemet Numerike Unicode & Përmirësimet LSP _(Prill 2026)_

- **Shtuar** 69 blloqe shifrash Unicode me tokenin e ndërrimit të mënyrës `#d0d9#`
- **Shtuar** Literalë Boolean në çdo shkrim — `#१` / `#०`, `#१` / `#०`, etj.
- **Shtuar** Shifrat Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Shtuar** Opkodi `SetNumeralMode` i VM — barazi e plotë me shëtitësin e pemëve
- **Shtuar** REPL respekton mënyrën numerike aktive në jehonë dhe shfaqjen e variablave
- **Ndryshuar** Prodhimi Boolean `>>` tani përfshin parashtesën `#` (`#0` / `#1`) në të gjitha mënyrat

### v0.0.2_01 — Riemërtimi i Operatorit _(30 Mars 2026)_

- **Ndryshuar** `c|..|` → `#,|..|` dhe `e|..|` → `#^|..|` — në përputhje me familjen e parashtesave të formatit `#`
- **Shtuar** Pseudonimi i eksportit — ri-eksporto anëtarët e modulit nën një emër tjetër

### v0.0.2 — Ridesignimi i API-së së Koleksionit & Instaluesit _(24 Mars 2026)_

- **Shtuar** Familja e unifikuar e operatorëve `$` për vargjet dhe vargjet e tekstit (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Shtuar** Caktimi i shkatërrimit për vargje, tuple dhe tuple të emërtuar
- **Shtuar** Indekset negative (`vargu[-1]` = elementi i fundit)
- **Shtuar** Instaluesit vendas — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mars 2026)_

- **Shtuar** Caktimi i përbërë `^=`
- **Rregulluar** Rastet e skajeve aritmetike të interpretuesit; korrigjime të dokumentacionit

### v0.0.1 — Lëshimi i Parë Publik _(22 Mars 2026)_

- Interpretuesi shëtitës i pemëve + VM i regjistrave (`--vm`, ~4× më i shpejtë, ~95% barazi)
- Të gjitha konstruktet kryesore: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identifikues të plotë Unicode, sistem modulesh, lambda, mbyllje, trajtim gabimesh
- REPL, LSP, Zgjerim për VS Code, formatues (`zymbol fmt`)

---

_Zymbol-Lang — Simbolike. Universale. E pandryshueshme._
