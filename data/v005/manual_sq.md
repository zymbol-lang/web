> **Përgjegjësia:** Ky dokumentacion është krijuar dhe përkthyer nga inteligjenca artificiale (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Referenca kanonike është **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** në depon e përkthyesit.

---

# Manuali i Zymbol-Lang

> **Rishikuar për v0.0.5 — 2026-05-14**

**Zymbol-Lang** është një gjuhë programimi simbolike. Pa fjalë kyçe — gjithçka është simbol. Punon në mënyrë identike në çdo gjuhë njerëzore.

- Pa `if`, `while`, `return` — vetëm `?`, `@`, `<~`
- Unicode i plotë — identifikues në çdo gjuhë ose emoji
- E pavarur nga gjuha njerëzore — kodi është i njëjtë kudo

**Versioni i përkthyesit**: v0.0.5 | **Mbulimi i testeve**: 436/436 (barazia TW ↔ VM)

---

## Variablat dhe Konstantet

```zymbol
x = 10              // ndryshore e ndryshueshme
π := 3.14159        // konstante — ricaktimi është gabim në kohën e ekzekutimit
emri = "Alisa"
aktiv = #1         // boolean e vërtetë
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

`°` (shenja e shkallës, U+00B0) inicializon automatikisht një ndryshore në vlerën e saj neutrale në përdorimin e parë:

```zymbol
numrat = [3, 1, 4, 1, 5]
@ n:numrat {
    °totali += n    // inicializohet automatikisht në 0 mbi lak; mbijeton pas @
}
>> totali ¶         // → 14
```

> `°x` (parashtesë) ankoron mbi lak — rezultati është i arritshëm pas `@`.
> `x°` (prapashtesë) ankoron brenda lakut — vdes kur laku përfundon.
> Vetëm tree-walker.

---

## Llojet e të Dhënave

| Lloji | Literali | Etiketa `#?` | Shënime |
|------|---------|----------|---------|
| Numër i plotë | `42`, `-7` | `###` | 64-bit me shenjë |
| Me pikë lundruese | `3.14`, `1.5e10` | `##.` | Shënimi shkencor i lejuar |
| Vargu | `"tekst"` | `##"` | Interpolimi: `"Përshëndetje {emri}"` |
| Karakteri | `'A'` | `##'` | Një karakter i vetëm Unicode |
| Boolean | `#1`, `#0` | `##?` | Jo numerik — `#1 ≠ 1` |
| Vargu | `[1, 2, 3]` | `##]` | Elemente homogjene |
| Tuple | `(a, b)` | `##)` | Pozicional |
| Tuple i emërtuar | `(x: 1, y: 2)` | `##)` | Fusha të emërtuara |
| Funksioni | referencë funksioni i emërtuar | `##()` | Klasa e parë; shfaq `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Klasa e parë; shfaq `<lambd/N>` |

```zymbol
// Introspeksioni i llojit — kthen (lloji, shifrat, vlera)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Dalja dhe Hyrja

```zymbol
>> "Përshëndetje" ¶                       // ¶ ose \\ për rresht të ri të qartë
>> "a=" a " b=" b ¶               // vendosja pranë — vlera të shumëfishta
>> (arr$#) ¶                      // operatorët prapashtesë kërkojnë ( ) në >>

>> emri                           // lexo në ndryshore (pa kërkesë)
>> "Shkruani emrin: " emri            // me kërkesë
```

> `¶` (AltGr+R në tastierën Spanjolle) dhe `\\` janë rreshta të rinj ekuivalentë.

---

## Primitivat e TUI

Operatorët e ndërfaqes së përdoruesit për programe interaktive. Shumica kërkojnë bllokun `>>| { }` (ekran alternativ + modalitet i papërpunuar).

```zymbol
>>| {
    >>!                             // pastro ekranin alternativ
    >>~ (1, 1, 0, 10) > "Duke u ekzekutuar"  // rreshti 1, kolona 1, fg=10 (jeshile)
    @~ 1000                         // ndal për 1 sekondë (1000 ms)
    >>~ (2, 1) > "U përfundua."
}
// terminali rikthehet automatikisht pas daljes
```

```zymbol
// Shtypja e tastit dhe madhësia e terminalit
>>| {
    [rreshtat, kolonat] = >>?              // pyet përmasat e terminalit
    >>~ (1, 1) > "Terminali: " rreshtat " x " kolonat
    <<| tasti                         // lexo shtypjen e tastit bllokuese
    >>~ (2, 1) > "Shtypët: " tasti
}
```

> `>>!` pastron ekranin. `>>?` kthen `[rreshtat, kolonat]`. `@~ N` fle N milisekonda.
> `<<|` lexon një shtypje të tastit (bllokuese); `<<|?` pyet pa bllokuar (kthen `'\0'` nëse nuk ka).
> Tuple e daljes së pozicionuar: `(rreshti, kolona, BKS, fg, bg)` — çdo vend mund të lihet me presje (`>>~ (,,, 196) > "kuqe"`).
> BKS maska e biteve: `1`=të trashë, `2`=të pjerrët, `4`=nënvizuar. Paleta e ngjyrave ANSI 256 (`0`=parazgjedhja e terminalit).
> Vetëm tree-walker (përveç `>>!`, `>>?`, `@~`, `>>~` që punojnë edhe në `--vm`).

---

## Operatorët

```zymbol
// Aritmetika
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (pjestimi i numrave të plotë)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (fuqizimi)

// Krahasimi — cakto për inspektim
k1 = a == b    // #0
k2 = a <> b    // #1
k3 = a < b     // #0
k4 = a <= b    // #0
k5 = a > b     // #1
k6 = a >= b    // #1

// Logjika
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Vargjet

```zymbol
// Dy forma të lidhjes
emri = "Alisa"
n = 42

>> "Përshëndetje " emri " ke " n ¶       // vendosja pranë — në >>
përshkrimi = "Përshëndetje {emri}, ke {n}"     // interpolimi — kudo
```

```zymbol
s = "Përshëndetje botë"
gjatësia = s$#                  // 11
nënvargu = s$[1..5]             // "Përsh"  (1-bazuar, fundi i përfshirë)
ka = s$? "botë"          // #1
pjesët = "a,b,c,d"$/ ','   // [a, b, c, d]  (ndahet me ndarës)
zëvendëso = s$~~["l":"r"]        // "Përshëndetje botë" (pa 'l' në shqip)
zëvendëso1 = s$~~["l":"r":1]     // "Përshëndetje botë"
vija = "─" $* 20           // "────────────────────"  (përsërit N herë)
```

> `+` është vetëm për numrat. Për vargje, përdorni `,`, vendosjen pranë, ose interpolimin.

---

## Kontrolli i Rrjedhës

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

> Kllapat `{ }` **janë të detyrueshme** edhe për një deklaratë të vetme.

---

## Përputhja

```zymbol
// Intervalet
pikët = 85
nota = ?? pikët {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> nota ¶    // → B

// Vargjet
ngjyra = "kuqe"
kodi = ?? ngjyra {
    "kuqe"   => "#FF0000"
    "jeshile" => "#00FF00"
    _       => "#000000"
}

// Modelet e krahasimit
temperatura = -5
gjendja = ?? temperatura {
    < 0  => "akull"
    < 20 => "ftohtë"
    < 35 => "ngrohtë"
    _    => "nxehtë"
}
>> gjendja ¶    // → akull

// Forma e deklaratës (krahët e bllokut)
n = -3
?? n {
    0    => { >> "zero" ¶ }
    < 0  => { >> "negativ" ¶ }
    _    => { >> "pozitiv" ¶ }
}
```

---

## Laket

```zymbol
@ i:0..4  { >> i " " }        // intervali i përfshirë:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // me hap:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // i kundërt:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

frutat = ["mollë", "dardhë", "rrush"]
@ f:frutat { >> f ¶ }         // për çdo element në varg

@ k:"hello" { >> k "-" }
>> ¶                          // → h-e-l-l-o-  (për çdo karakter në varg)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> vazhdo
    ? i > 7 { @! }             // @! thyen
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Lak i pafund
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Lak i etiketuar (thyerje e mbivendosur)
numërimi = 0
@:jashtëm {
    numërimi++
    ? numërimi >= 3 { @:jashtëm! }
}
>> numërimi ¶                    // → 3
```

---

## Funksionet

```zymbol
mbledh(a, b) { <~ a + b }
>> mbledh(3, 4) ¶    // → 7

faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120
```

Funksionet kanë **shtrirje të izoluar** — nuk mund të lexojnë ndryshoret e jashtme. Përdorni parametrat e daljes `<~>` për të modifikuar ndryshoret e thirrësit:

```zymbol
këmbe(a<~, b<~) {
    e_përkohshme = a
    a = b
    b = e_përkohshme
}
x = 10
y = 20
këmbe(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Funksionet e emërtuara janë **vlera të klasës së parë** — kalojini direkt: `numrat$> dyfisho`. Për të mbështjellë: `x -> fn(x)` është gjithashtu e vlefshme.

---

## Lambdat dhe Mbylljet

```zymbol
dyfisho = x -> x * 2
mbledh = (a, b) -> a + b
>> dyfisho(5) ¶    // → 10
>> mbledh(3, 7) ¶  // → 10

// Lambda e bllokut
klasifiko = x -> {
    ? x > 0 { <~ "pozitiv" }
    _? x < 0 { <~ "negativ" }
    <~ "zero"
}

// Mbyllja — kap shtrirjen e jashtme
faktori = 3
trifisho = x -> x * faktori
>> trifisho(7) ¶    // → 21

// Fabrika
krijues_mbledhësi(n) { <~ x -> x + n }
mbledh_dhjetë = krijues_mbledhësi(10)
>> mbledh_dhjetë(5) ¶    // → 15

// Në varg
operatorët = [x -> x+1, x -> x*2, x -> x*x]
>> operatorët[3](5) ¶    // → 25
```

---

## Vargu

Vargjet janë **të ndryshueshëm** dhe përmbajnë elemente **të të njëjtit lloj**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — qasja (1-bazuar: elementi i parë)
x = arr[-1]     // 5 — indeksi negativ (elementi i fundit)
x = arr$#       // 5 — gjatësia (përdorni (arr$#) në >>)

arr = arr$+ 6            // shto → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // fut në pozicionin 2 (1-bazuar)
arr3 = arr$- 3           // hiq ndodhjen e parë të vlerës
arr4 = arr$-- 3          // hiq të gjitha ndodhitë
arr5 = arr$-[1]          // hiq në indeksin 1 (elementi i parë)
arr6 = arr$-[2..3]       // hiq intervalin (1-bazuar, fundi i përfshirë)

ka = arr$? 3            // #1 — përmban
pozicionet = arr$?? 3           // [3] — të gjitha indekset e vlerës (1-bazuar)
fetë = arr$[1..3]          // [1,2,3] — fetë (1-bazuar, fundi i përfshirë)
fetë2 = arr$[1:3]          // [1,2,3] — e njëjta, sintaksë e bazuar në numërim

rritës = arr$^+             // rendit rritës (vetëm primitivët)
zbritës = arr$^-            // rendit zbritës (vetëm primitivët)

// Vargu i tupleve të emërtuara/pozicionale — përdorni $^ me lambda krahasuesi
baza_e_të_dhënave = [(emri: "Carla", mosha: 28), (emri: "Ana", mosha: 25), (emri: "Bob", mosha: 30)]
sipas_moshës  = baza_e_të_dhënave$^ (a, b -> a.mosha < b.mosha)    // sipas moshës rritës (<)
sipas_emrit = baza_e_të_dhënave$^ (a, b -> a.emri > b.emri)   // sipas emrit zbritës (>)
>> sipas_moshës[1].emri ¶     // → Ana
>> sipas_emrit[1].emri ¶    // → Carla

// Përditësimi i drejtpërdrejtë i elementit (vetëm vargjet)
arr[1] = 99              // cakto
arr[2] += 5              // i përbërë: +=  -=  *=  /=  %=  ^=

// Përditësimi funksional — kthen një varg të ri; origjinali mbetet i pandryshuar
arr2 = arr[2]$~ 99
```

> Të gjithë operatorët e koleksionit kthejnë një **varg të ri**. Cakto prapa: `arr = arr$+ 4`.
> `$+` mund të lidhet në zinxhir: `arr = arr$+ 5$+ 6$+ 7`. Operatorët e tjerë përdorin caktimet e ndërmjetme.
> **Indeksimi është 1-bazuar**: `arr[1]` është elementi i parë; `arr[0]` është gabim në kohën e ekzekutimit.
> `$^+` / `$^-` renditin **vargjet primitivë** (numrat, vargjet). Për vargjet e tupleve, përdorni `$^` me lambda krahasuesi — drejtimi është i koduar në lambda (`<` = rritës, `>` = zbritës).

**Semantika e vlerës** — caktimi i një vargu në një ndryshore tjetër krijon një kopje të pavarur:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b nuk ndikohet
```

```zymbol
// Vargjet e mbivendosur (indeksimi 1-bazuar)
matrica = [[1,2,3],[4,5,6],[7,8,9]]
>> matrica[2][3] ¶    // → 6  (rreshti 2, kolona 3)
```

---

## Shkatërrimi i Strukturës

```zymbol
// Vargu
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[i_pari, *pjesa_tjetër] = arr         // i_pari=10  pjesa_tjetër=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ hidhet

// Tuple pozicional
pika = (100, 200)
(px, py) = pika             // px=100  py=200

// Tuple i emërtuar
personi = (emri: "Ana", mosha: 25, qyteti: "Madrid")
(emri: n, mosha: m) = personi   // n="Ana"  m=25
```

---

## Tuple

Tuple janë kontejnerë të renditur **të pandryshueshëm** që mund të mbajnë vlera të **llojesh të ndryshme**.
Ndryshe nga vargjet, elementet nuk mund të ndryshohen pas krijimit.

```zymbol
// Pozicional — lejohen llojet e përziera
pika = (10, 20)
>> pika[1] ¶    // → 10

të_dhënat = (42, "Përshëndetje", #1, 3.14)
>> të_dhënat[3] ¶     // → #1

// I emërtuar
personi = (emri: "Alisa", mosha: 25)
>> personi.emri ¶    // → Alisa
>> personi[1] ¶      // → Alisa  (indeksi gjithashtu punon, 1-bazuar)

// I mbivendosur
pozicioni = (x: 10, y: 20)
p = (pozicioni: pozicioni, etiketa: "origjina")
>> p.pozicioni.x ¶        // → 10
```

**Pandryshueshmëria** — çdo përpjekje për të modifikuar një element të tuple është gabim në kohën e ekzekutimit:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ gabim në kohën e ekzekutimit: tuple janë të pandryshueshëm
// t[1] += 5    // ❌ i njëjti gabim
```

Për të marrë një vlerë të modifikuar përdorni `$~` (përditësimi funksional) — kthen një **tuple të ri**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← origjinali mbetet i pandryshuar
>> t2 ¶    // → (10, 999, 30)

// Tuple i emërtuar — rindërto në mënyrë të qartë
personi = (emri: "Alisa", mosha: 25)
më_i_madh  = (emri: personi.emri, mosha: 26)
>> personi.mosha ¶    // → 25
>> më_i_madh.mosha ¶     // → 26
```

---

## Funksionet e Rendit të Lartë

```zymbol
numrat = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

të_dyfishuara  = numrat$> (x -> x * 2)                  // map  → [2,4,6…20]
çiftet    = numrat$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
totali    = numrat$< (0, (akumulatori, x) -> akumulatori + x)     // reduce → 55

// Zinxhiri përmes ndërmjetësve
hapi1 = numrat$| (x -> x > 3)
hapi2 = hapi1$> (x -> x * x)
>> hapi2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Funksionet e emërtuara mund të kalojnë direkt në HOF
dyfisho(x) { <~ x * 2 }
është_i_madh(x) { <~ x > 5 }
r = numrat$> dyfisho       // ✅ referencë direkte
r = numrat$| është_i_madh       // ✅ referencë direkte
```

---

## Operatori i Tubacionit

Ana e djathtë kërkon gjithmonë `_` si vendmbajtës për vlerën e tubuar:

```zymbol
dyfisho = x -> x * 2
mbledh = (a, b) -> a + b
rrit = x -> x + 1

r1 = 5 |> dyfisho(_)        // → 10
r2 = 10 |> mbledh(_, 5)       // → 15
r3 = 5 |> mbledh(2, _)        // → 7

// Zinxhiri
r = 5 |> dyfisho(_) |> rrit(_) |> dyfisho(_)
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
    >> "të tjera: " _err ¶    // _err mban mesazhin e gabimit
} :> {
    >> "ekzekutohet gjithmonë" ¶
}
```

| Lloji | Kur |
|------|------|
| `##Div` | Pjestimi me zero |
| `##IO` | Skedar / sistem |
| `##Index` | Indeksi jashtë kufijve |
| `##Type` | Mospërputhje e llojit |
| `##Parse` | Analizimi i të dhënave |
| `##Network` | Gabime të rrjetit |
| `##_` | Çdo gabim (kap-gjithçka) |

---

## Modulet

```zymbol
// lib/calc.zy — trupi i modulit është i mbyllur në kllapa
# calc {
    #> { mbledh, get_PI }

    _π := 3.14159
    mbledh(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // pseudonimi kërkohet

>> c::mbledh(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Eksporto me një emër publik të ndryshëm
# mylib {
    #> { _mbledh_i_brendshëm => shuma }

    _mbledh_i_brendshëm(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::shuma(3, 4) ¶    // → 7  (emri i brendshëm _mbledh_i_brendshëm fshihet)
```

> **Rregullat e moduleve**: brenda `# emri { }`, lejohen vetëm `#>`, përkufizimet e funksioneve, dhe inicializuesit literalë të ndryshoreve/konstantave. Deklaratat e ekzekutueshme (`>>`, `<<`, laket, etj.) ngrenë gabimin E013.

---

## Mënyrat Numerike

Zymbol mund të shfaqë numrat në **69 shkrime shifrore Unicode** — Devanagari, Arabike-Hindi, Tajlandeze, Klingon pIqaD, Matematikë e Trashë, segmente LCD, dhe më shumë. Mënyra aktive ndikon vetëm në daljen `>>`; aritmetika e brendshme është gjithmonë binare.

### Aktivizimi i një shkrimi

Shkruani shifrat `0` dhe `9` të shkrimit të synuar brenda `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabike-Hindi (U+0660–U+0669)
#๐๙#    // Tajlandeze     (U+0E50–U+0E59)
#09#    // rivendos në ASCII
```

### Dalja dhe booleanët

```zymbol
x = 42
>> x ¶          // → 42   (parazgjedhja ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (pika dhjetore është gjithmonë ASCII)
>> 1 + 2 ¶      // → ३

// Booleanët: parashtesa # është gjithmonë ASCII, shifra përshtatet
>> #1 ¶         // → #१   (e vërtetë në Devanagari)
>> #0 ¶         // → #०   (false — dallohet nga ० zero e numrit të plotë)

x = 28 > 4
>> x ¶          // → #१   (rezultati i krahasimit ndjek mënyrën aktive)
```

### Literalët e shifrave vendase në burim

Shifrat e çdo shkrimi të mbështetur janë literalë të vlefshëm — në intervale, modulo, krahasime:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Literalët Boolean në çdo shkrim

`#` + shifra `0` ose `1` nga çdo bllok është një literal boolean i vlefshëm:

```zymbol
#٠٩#
aktiv = #١        // i njëjtë me #1
>> aktiv ¶        // → #१
>> (#١ && #٠) ¶ // → #०
```

> `#` **është gjithmonë ASCII**. `#0` (false) është gjithmonë vizualisht i dallueshëm nga `0` (zero e numrit të plotë) në çdo shkrim.

---

## Operatorët e të Dhënave

```zymbol
// Konvertimi i llojeve
f = ##.42         // → 42.0  (në pikë lundruese)
i = ###3.7        // → 4     (në numër të plotë, rrumbullakos)
t = ##!3.7        // → 3     (në numër të plotë, prerje)

// Analizo vargun në numër
v1 = #|"42"|      // → 42  (numër i plotë)
v2 = #|"3.14"|    // → 3.14  (pikë lundruese)
v3 = #|"abc"|     // → "abc"  (i sigurt, pa gabim)

// Rrumbullakos / Prit
π = 3.14159265
rrumbullakos2 = #.2|π|      // → 3.14  (rrumbullakos në 2 vende dhjetore)
rrumbullakos4 = #.4|π|      // → 3.1416
prit2 = #!2|π|      // → 3.14  (prit)

// Formatimi i numrave
formati = #,|1234567|  // → 1,234,567  (i ndarë me presje)
shkencor = #^|12345.678|    // → 1.2345678e4  (shkencor)

// Literalët e bazës
a = 0x41         // → 'A'  (heksadecimal)
b = 0b01000001   // → 'A'  (binar)
c = 0o101        // → 'A'  (oktal)

// Dalja e konvertimit të bazës
heks = 0x|255|    // → "0x00FF"
binar = 0b|65|     // → "0b1000001"
oktal = 0o|8|      // → "0o10"
decimal = 0d|255|    // → "0d0255"
```

---

## Integrimi me Shell

```zymbol
data = <\ date +%Y-%m-%d \>     // kap stdout (përfshin \n në fund)
>> "Sot: " data

skedari = "data.txt"
përmbajtja = <\ cat {skedari} \>      // interpolimi në komanda

dalja = </"./subscript.zy"/>   // ekzekuto një skript tjetër Zymbol, kap daljen
>> dalja
```

> `><` kap argumentet CLI si një varg vargjesh (vetëm tree-walker).

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
|--------|-----------|--------|-----------|
| `=` | ndryshore | `$#` | gjatësia |
| `:=` | konstante | `$+` | shto (i lidhshëm në zinxhir) |
| `>>` | dalja | `$+[i]` | fut në indeks (1-bazuar) |
| `<<` | hyrja | `$-` | hiq të parin sipas vlerës |
| `¶` / `\\` | rresht i ri | `$--` | hiq të gjithë sipas vlerës |
| `?` | nëse | `$-[i]` | hiq në indeks (1-bazuar) |
| `_?` | përndryshe-nëse | `$-[i..j]` | hiq intervalin (1-bazuar) |
| `_` | përndryshe / karakter i egër | `$?` | përmban |
| `??` | përputhje | `$??` | gjej të gjitha indekset (1-bazuar) |
| `@` | lak | `$[s..e]` | fetë (1-bazuar) |
| `@ N { }` | lak N herë | `$>` | map |
| `@!` | thyen | `$\|` | filter |
| `@>` | vazhdon | `$<` | reduce |
| `@:emri { }` | lak i etiketuar | `$/ ndarësi` | ndaj vargun |
| `@:emri!` | thyen etiketën | `$++ a b c` | ndërtim i lidhjes |
| `@:emri>` | vazhdon etiketën | `arr[i>j>k]` | indeksi i navigimit |
| `->` | lambda | `arr[i] = vlera` | përditëso elementin (vetëm vargjet) |
| `arr[i] += vlera` | përditësim i përbërë | `arr[i]$~` | përditësim funksional (kopje e re) |
| `$^+` | rendit rritës (primitivët) | `$^-` | rendit zbritës (primitivët) |
| `$^` | rendit me krahasues (tuple) | `<~` | kthe |
| `\|>` | tubacion | `!?` | provo |
| `:!` | kap | `:>` | më në fund |
| `#1` | e vërtetë | `#0` | false |
| `$!` | është gabim | `$!!` | përhap gabimin |
| `<#` | importo | `#>` | eksporto |
| `#` | deklaroj modul | `::` | thirr modul |
| `.` | qasje në fushë | `#?` | metadata e llojit |
| `#\|..\|` | analizo numrin | `##.` | konverto në pikë lundruese |
| `###` | konverto në numër të plotë (rrumbullakos) | `##!` | konverto në numër të plotë (prit) |
| `#.N\|..\|` | rrumbullakos | `#!N\|..\|` | prit |
| `#,\|..\|` | format me presje | `#^\|..\|` | shkencor |
| `#d0d9#` | ndërro mënyrën numerike | `#09#` | rivendos në ASCII |
| `<\ ..\>` | ekzekuto shell | `>\<` | argumentet CLI |
| `\ ndryshore` | shkatërro ndryshoren në mënyrë të qartë | `°x` / `x°` | përkufizim i nxehtë (auto-inicializim) |
| `>>|` | bllok TUI (ekran alternativ) | `>>~` | dalje e pozicionuar |
| `>>!` | pastro ekranin | `>>?` | pyet madhësinë e terminalit |
| `<<\|` | shtypje tasti bllokuese | `<<\|?` | pyetje e shtypjes së tastit jo-bllokuese |
| `@~ N` | fle N milisekonda | `$*` | përsërit vargun N herë |

---

## Regjistri i Ndryshimeve të Lëshimeve

### v0.0.5 — Primitivat TUI, Përkufizimi i Nxehtë & Përsëritja e Vargut _(Maj 2026)_

- **Thyes** Ndarësi i krahut të përputhjes: `modeli : rezultati` → `modeli => rezultati`
- **Thyes** Pseudonimi i importit: `<# rruga <= pseudonimi` → `<# rruga => pseudonimi`
- **Thyes** Riemërtimi i eksportit: `#> { fn <= publik }` → `#> { fn => publik }`
- **Shtuar** Blloku TUI `>>| { }` — ekran alternativ + modalitet i papërpunuar; pastron në dalje
- **Shtuar** Dalja e pozicionuar `>>~ (rreshti, kolona, BKS, fg, bg) > artikujt` — vende të rralla, ngjyrat ANSI 256
- **Shtuar** Hyrja e tastit `<<| ndryshore` (bllokuese) dhe `<<|? ndryshore` (pyetje jo-bllokuese)
- **Shtuar** `>>!` pastro ekranin, `>>?` pyet madhësinë e terminalit, `@~ N` fle N milisekonda
- **Shtuar** Përkufizimi i nxehtë `°x` / `x°` — auto-inicializimi i ndryshores në përdorimin e parë në lak
- **Shtuar** Përsëritja e vargut `vargu $* N` — përsërit një varg N herë
- **VM** Barazia: 436/436 teste të kaluara

### v0.0.4 — Indeksimi 1-bazuar, Funksionet e Klasës së Parë & Modulet e Bllokut _(Prill 2026)_

- **Thyes** I gjithë indeksimi u ndryshua në **1-bazuar** — `arr[1]` është elementi i parë; `arr[0]` është gabim në kohën e ekzekutimit
- **Shtuar** Funksionet e emërtuara janë **vlera të klasës së parë** — kalojini direkt në HOF: `numrat$> dyfisho`
- **Shtuar** **Sintaksa e bllokut e detyrueshme** për module: `# emri { ... }` — sintaksa e sheshtë u hoq
- **Shtuar** Indeksimi shumëdimensional: `arr[i>j>k]` (navigimi), `arr[p ; q]` (nxjerrja e sheshtë)
- **Shtuar** Konvertimi i llojeve: `##.shprehja` (pikë lundruese), `###shprehja` (numër i plotë rrumbullakos), `##!shprehja` (numër i plotë prit)
- **Shtuar** Ndarja e vargut: `vargu$/ ndarësi` — kthen `Array(vargu)`
- **Shtuar** Ndërtimi i lidhjes: `baza$++ a b c` — shton artikuj të shumëfishtë
- **Shtuar** Laku i herëve: `@ N { }` — përsërit saktësisht N herë
- **Shtuar** Sintaksa e lakut të etiketuar: `@:emri { }`, `@:emri!`, `@:emri>` — zëvendëson `@ @emri` / `@! emri`
- **Shtuar** Rregullat e shtrirjes së ndryshoreve: ndryshoret `_emri` kanë shtrirje të saktë blloku; `\ ndryshore` shkatërron herët
- **Shtuar** Modelet e krahasimit të përputhjes: `< 0 =>`, `> 5 =>`, `== 42 =>`, etj.
- **Shtuar** Gabimi i modulit E013: deklaratat e ekzekutueshme në trupin e modulit janë të ndaluara
- **Rregulluar** `alias.CONST` tani zgjidhet saktë; `#>` mund të shfaqet pas përkufizimeve të funksioneve
- **VM** Barazia e plotë: 393/393 teste të kaluara

### v0.0.3 — Sistemet Numerike Unicode & Përmirësimet e LSP _(Prill 2026)_

- **Shtuar** 69 blloqe shifrash Unicode me shenjën e ndërrimit të mënyrës `#d0d9#`
- **Shtuar** Literalët Boolean në çdo shkrim — `#१` / `#०`, `#१` / `#०`, etj.
- **Shtuar** Shifrat Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Shtuar** Opcode i VM `SetNumeralMode` — barazia e plotë me tree-walker
- **Ndryshuar** Dalja Boolean `>>` tani përfshin parashtesën `#` (`#0` / `#1`) në të gjitha mënyrat

### v0.0.2_01 — Riemërtimi i Operatorit _(30 Mars 2026)_

- **Ndryshuar** `c|..|` → `#,|..|` dhe `e|..|` → `#^|..|` — përputhshmëri me familjen e parashtesës `#`
- **Shtuar** Pseudonimi i eksportit: ri-eksporto anëtarët e modulit nën një emër tjetër

### v0.0.2 — Ridesajnimi i API-së së Koleksionit & Instaluesit _(24 Mars 2026)_

- **Shtuar** Familja e unifikuar e operatorëve `$` për vargjet dhe vargjet e tekstit (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Shtuar** Caktimi i shkatërrimit të strukturës për vargjet, tuple, dhe tuple të emërtuara
- **Shtuar** Indeksat negativë (`arr[-1]` = elementi i fundit)
- **Shtuar** Instaluesit vendas — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mars 2026)_

- **Shtuar** Caktimi i përbërë `^=`
- **Rregulluar** Rastet e skajeve aritmetike të analizuesit; korrigjime të dokumentacionit

### v0.0.1 — Lëshimi i Parë Publik _(22 Mars 2026)_

- Përkthyesi tree-walker + VM i regjistrave (`--vm`, ~4× më i shpejtë, ~95% barazi)
- Të gjitha konstruktet bazë: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identifikuesit e plotë Unicode, sistemi i moduleve, lambdat, mbylljet, trajtimi i gabimeve
- REPL, LSP, shtesa e VS Code, formatuesi (`zymbol fmt`)

---

_Zymbol-Lang — Simbolik. Universal. I pandryshueshëm._
