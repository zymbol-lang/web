> **Averto:** Ĉi tiu dokumentaro estis kreita kaj tradukita de artefarita inteligenco (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> La kanona referenco estas **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** en la interpretilo-deponejo.

---

# Zymbol-Lang Manlibro

> **Reviziita por v0.0.5 — 2026-05-12**

**Zymbol-Lang** estas simbola programlingvo. Neniuj ŝlosilvortoj — ĉio estas simbolo. Funkcias identike en ajna homa lingvo.

- Neniu `if`, `while`, `return` — nur `?`, `@`, `<~`
- Plena Unikodo — identigaĵoj en ajna lingvo aŭ emodžio
- Homa-lingvo-sendependa — la kodo estas la sama ĉie

**Interpretila versio**: v0.0.5 | **Testkovrado**: 436/436 (TW ↔ VM pareco)

---

## Variabloj & Konstantoj

```zymbol
x = 10              // ŝanĝebla variablo
PI := 3.14159       // konstanto — redonado estas ekzekuta eraro
nomo = "Alico"
aktiva = #1         // bu-valoro vera
👋 := "Saluton"
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

`°` (gradsigno, U+00B0) aŭtomate iniciigos variablon al ĝia neŭtra valoro unuafoje:

```zymbol
numeroj = [3, 1, 4, 1, 5]
@ n:numeroj {
    °sumo += n    // aŭto-init al 0 super buklo; daŭras post @
}
>> sumo ¶         // → 14
```

> `°x` (antaŭfiksaĵo) ankras super la buklo — rezulto alireblkas post `@`.
> `x°` (postfiksaĵo) ankras en la buklo — malaperas kiam la buklo finiĝas.
> Nur arbomarŝilo.

---

## Datumtipoj

| Tipo | Literalo | `#?` etikedo | Notoj |
|------|---------|------------|-------|
| Int | `42`, `-7` | `###` | 64-bita signita |
| Float | `3.14`, `1.5e10` | `##.` | Scienca notacio akceptata |
| Ŝnuro | `"teksto"` | `##"` | Interpolo: `"Saluton {nomo}"` |
| Signo | `'A'` | `##'` | Unu Unikoda signo |
| Bu-valoro | `#1`, `#0` | `##?` | Ne nombra — `#1 ≠ 1` |
| Aro | `[1, 2, 3]` | `##]` | Homogenaj elementoj |
| Tuplo | `(a, b)` | `##)` | Pozicia |
| Nomata Tuplo | `(x: 1, y: 2)` | `##)` | Nomataj kampoj |
| Funkcio | nomata funkcio ref | `##()` | Unuaranga; montras `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Unuaranga; montras `<lambd/N>` |

```zymbol
// Tipotrarigado — liveras (tipo, ciferoj, valoro)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Eligo & Enigo

```zymbol
>> "Saluton" ¶                     // ¶ aŭ \\ por eksplicita novlinio
>> "a=" a " b=" b ¶               // apudmeto — pluraj valoroj
>> (aro$#) ¶                      // postfiksaj operatoroj bezonas ( ) en >>

<< nomo                           // legi en variablon (sen invito)
<< "Enigu vian nomon: " nomo      // kun invito
```

> `¶` (AltGr+R sur hispana klavaro) kaj `\\` estas ekvivalentaj novlinioj.

---

## TUI-Primitivoj

Terminala UI-operatoroj por interagaj programoj. La plej multaj bezonas `>>| { }` blokon (ŝanĝa ekrano + kruda reĝimo).

```zymbol
>>| {
    >>!                             // viŝi ŝanĝan ekranon
    >>~ (1, 1, 0, 10) > "Rulas"    // vico 1, kolumno 1, fg=10 (verda)
    @~ 1000                         // paŭzi 1 sekundon (1000 ms)
    >>~ (2, 1) > "Farite."
}
// terminalo restaŭrita aŭtomate ĉe eliro
```

```zymbol
// Klavpremo kaj terminala grandeco
>>| {
    [vicoj, kolumnoj] = >>?              // demandi terminalan grandecon
    >>~ (1, 1) > "Terminalo: " vicoj " x " kolumnoj
    <<| klavo                            // blokanta klavpremo
    >>~ (2, 1) > "Premita: " klavo
}
```

> `>>!` viŝas ekranon. `>>?` liveras `[vicoj, kolumnoj]`. `@~ N` dormas N milisekundojn.
> `<<|` legas unu klavpremon (blokanta); `<<|?` sondas sen blokado (liveras `'\0'` se neniu).
> Poziciigita eligo-tuplo: `(vico, kolumno, BKS, fg, bg)` — ajna fendo ellaseblas per komo (`>>~ (,,, 196) > "ruĝa"`).
> BKS bitmask: `1`=Grasa, `2`=Kursiva, `4`=Substreka. ANSI 256-kolora paleto (`0`=terminala defaŭlto).
> Nur arbomarŝilo (escepte `>>!`, `>>?`, `@~`, `>>~` kiuj ankaŭ funkcias en `--vm`).

---

## Operatoroj

```zymbol
// Aritmetiko
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (entjera divido)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (eksponentigo)

// Komparo — asigni por inspekti
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Logika
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Ŝnuroj

```zymbol
// Du kunkatenaj formoj
nomo = "Alico"
n = 42

>> "Saluton " nomo " vi havas " n ¶    // apudmeto — en >>
priskribo = "Saluton {nomo}, vi havas {n}"  // interpolo — ie ajn
```

```zymbol
s = "Saluton Mondo"
longo = s$#                  // 13
sub = s$[1..7]               // "Saluton"  (1-baza, fino inkluziva)
havas = s$? "Mondo"          // #1
partoj = "a,b,c,d"$/ ','     // [a, b, c, d]  (dividi per limsigno)
anst = s$~~["o":"O"]          // "SalutOn MOndo"
anst1 = s$~~["o":"O":1]       // "SalutOn Mondo"  (nur unua N)
linio = "─" $* 20            // "────────────────────"  (ripeti N fojojn)
```

> `+` estas nur por nombroj. Uzu `,`, apudmeton, aŭ interpolon por ŝnuroj.

---

## Kontrolfluo

```zymbol
x = 7

? x > 0 { >> "pozitiva" ¶ }

? x > 100 {
    >> "granda" ¶
} _? x > 0 {
    >> "pozitiva" ¶
} _? x == 0 {
    >> "nulo" ¶
} _ {
    >> "negativa" ¶
}
```

> `{ }` krampoj estas **bezonataj** eĉ por unu deklaro.

---

## Kongruo

```zymbol
// Rangoj
poentaro = 85
grado = ?? poentaro {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> grado ¶    // → B

// Ŝnuroj
koloro = "ruĝa"
kodo = ?? koloro {
    "ruĝa"   => "#FF0000"
    "verda"  => "#00FF00"
    _        => "#000000"
}

// Komparaj ŝablonoj
temp = -5
stato = ?? temp {
    < 0  => "glacio"
    < 20 => "malvarma"
    < 35 => "varma"
    _    => "varmega"
}
>> stato ¶    // → glacio

// Deklara formo (blokaj brakoj)
n = -3
?? n {
    0    => { >> "nulo" ¶ }
    < 0  => { >> "negativa" ¶ }
    _    => { >> "pozitiva" ¶ }
}
```

---

## Bukloj

```zymbol
@ i:0..4  { >> i " " }        // rango inkluziva:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // kun paŝo:          1 3 5 7 9
@ i:5..0:1 { >> i " " }       // malantaŭen:        5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (dum-buklo)

fruktoj = ["pomo", "piro", "vinbero"]
@ f:fruktoj { >> f ¶ }        // por-ĉiu aro

@ c:"saluton" { >> c "-" }
>> ¶                          // → s-a-l-u-t-o-n-  (por-ĉiu ŝnuro)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> daŭrigi
    ? i > 7 { @! }             // @! rompi
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Senfina buklo
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Etikedita buklo (nestita rompo)
kalkulo = 0
@:ekstera {
    kalkulo++
    ? kalkulo >= 3 { @:ekstera! }
}
>> kalkulo ¶                    // → 3
```

---

## Funkcioj

```zymbol
aldoni(a, b) { <~ a + b }
>> aldoni(3, 4) ¶    // → 7

faktorialo(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorialo(n - 1)
}
>> faktorialo(5) ¶    // → 120
```

Funkcioj havas **izolitan amplekson** — ili ne povas legi eksterajn variablojn. Uzu eligo-parametrojn `<~` por modifi vokintan variablon:

```zymbol
interŝanĝi(a<~, b<~) {
    prov = a
    a = b
    b = prov
}
x = 10
y = 20
interŝanĝi(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Nomataj funkcioj estas **unuarangaj valoroj** — pasataj rekte: `numeroj$> duobligi`. Por envolvi: `x -> fn(x)` ankaŭ validas.

---

## Lambdoj & Fermoj

```zymbol
duobligi = x -> x * 2
sumo = (a, b) -> a + b
>> duobligi(5) ¶    // → 10
>> sumo(3, 7) ¶    // → 10

// Bloka lambda
klasifiki = x -> {
    ? x > 0 { <~ "pozitiva" }
    _? x < 0 { <~ "negativa" }
    <~ "nulo"
}

// Fermo — kaptas eksteran amplekson
faktoro = 3
triobligi = x -> x * faktoro
>> triobligi(7) ¶    // → 21

// Fabriko
krei_aldoniston(n) { <~ x -> x + n }
aldoni10 = krei_aldoniston(10)
>> aldoni10(5) ¶    // → 15

// En aroj
operacioj = [x -> x+1, x -> x*2, x -> x*x]
>> operacioj[3](5) ¶    // → 25
```

---

## Aroj

Aroj estas **ŝanĝeblaj** kaj tenas elementojn de la **sama tipo**.

```zymbol
aro = [1, 2, 3, 4, 5]

x = aro[1]      // 1 — aliro (1-baza: unua elemento)
x = aro[-1]     // 5 — negativa indico (lasta elemento)
x = aro$#       // 5 — longo (uzu (aro$#) en >>)

aro = aro$+ 6            // aldoni → [1,2,3,4,5,6]
aro2 = aro$+[2] 99       // enmeti ĉe pozicio 2 (1-baza)
aro3 = aro$- 3           // forigi unuan aperon de valoro
aro4 = aro$-- 3          // forigi ĉiujn aperojn
aro5 = aro$-[1]          // forigi ĉe indico 1 (unua elemento)
aro6 = aro$-[2..3]       // forigi rangon (1-baza, fino inkluziva)

havas = aro$? 3            // #1 — enhavas
poz = aro$?? 3             // [3] — ĉiuj indicoj de valoro (1-baza)
trans = aro$[1..3]         // [1,2,3] — tranĉi (1-baza, fino inkluziva)
trans2 = aro$[1:3]         // [1,2,3] — sama, kvant-baza sintakso

supren = aro$^+             // ordigita kreskante  (nur primitivoj)
malsupren = aro$^-          // ordigita malkreskante (nur primitivoj)

// Nomataj/poziciaj tuplo-aroj — uzu $^ kun komparila lambda
bd = [(nomo: "Karla", aĝo: 28), (nomo: "Ana", aĝo: 25), (nomo: "Roberto", aĝo: 30)]
laŭ_aĝo  = bd$^ (a, b -> a.aĝo < b.aĝo)    // kreskante laŭ aĝo  (<)
laŭ_nomo = bd$^ (a, b -> a.nomo > b.nomo)   // malkreskante laŭ nomo (>)
>> laŭ_aĝo[1].nomo ¶     // → Ana
>> laŭ_nomo[1].nomo ¶    // → Roberto

// Rekta elemento-ĝisdatigo (nur aroj)
aro[1] = 99              // asigni
aro[2] += 5              // kunmeta: +=  -=  *=  /=  %=  ^=

// Funkcia ĝisdatigo — liveras novan aron; originalo neŝanĝita
aro2 = aro[2]$~ 99
```

> Ĉiuj kolekt-operatoroj liveras **novan aron**. Redonas asigni: `aro = aro$+ 4`.
> `$+` estas ĉenigebla: `aro = aro$+ 5$+ 6$+ 7`. Aliaj operatoroj uzas mez-asignojn.
> **Indicado estas 1-baza**: `aro[1]` estas la unua elemento; `aro[0]` estas ekzekuta eraro.
> `$^+` / `$^-` ordigas **primitivajn arojn** (nombroj, ŝnuroj). Por tuplo-aroj uzu `$^` kun komparila lambda — direkto estas enkodita en la lambda (`<` = kreskanta, `>` = malkreskanta).

**Valora semantiko** — asigni aron al alia variablo kreas sendependan kopion:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b estas netuŝita
```

```zymbol
// Nestitaj aroj (1-baza indicado)
matrico = [[1,2,3],[4,5,6],[7,8,9]]
>> matrico[2][3] ¶    // → 6  (vico 2, kolumno 3)
```

---

## Malstrukturado

```zymbol
// Aro
aro = [10, 20, 30, 40, 50]
[a, b, c] = aro              // a=10  b=20  c=30
[unua, *resto] = aro         // unua=10  resto=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ forĵetas

// Pozicia tuplo
punkto = (100, 200)
(px, py) = punkto             // px=100  py=200

// Nomata tuplo
persono = (nomo: "Ana", aĝo: 25, urbo: "Madrido")
(nomo: n, aĝo: a) = persono   // n="Ana"  a=25
```

---

## Tuploj

Tuploj estas **neŝanĝeblaj** ordigitaj ujoj kiuj povas teni valorojn de **malsamaj tipoj**.
Male al aroj, elementoj ne povas esti ŝanĝitaj post kreado.

```zymbol
// Pozicia — miksaj tipoj permesitaj
punkto = (10, 20)
>> punkto[1] ¶    // → 10

datumoj = (42, "saluton", #1, 3.14)
>> datumoj[3] ¶     // → #1

// Nomata
persono = (nomo: "Alico", aĝo: 25)
>> persono.nomo ¶    // → Alico
>> persono[1] ¶      // → Alico  (indico ankaŭ funkcias, 1-baza)

// Nestita
poz = (x: 10, y: 20)
p = (poz: poz, etikedo: "origino")
>> p.poz.x ¶        // → 10
```

**Neŝanĝebleco** — ajna provo modifi tuplo-elementon estas ekzekuta eraro:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ ekzekuta eraro: tuploj estas neŝanĝeblaj
// t[1] += 5    // ❌ sama eraro
```

Por derivi modifitan valoron uzu `$~` (funkcia ĝisdatigo) — liveras **novan** tuplon:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← originalo neŝanĝita
>> t2 ¶    // → (10, 999, 30)

// Nomata tuplo — rekonstrui eksplicite
persono = (nomo: "Alico", aĝo: 25)
pliaga  = (nomo: persono.nomo, aĝo: 26)
>> persono.aĝo ¶    // → 25
>> pliaga.aĝo ¶     // → 26
```

---

## Altnivelajaj Funkcioj

```zymbol
numeroj = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

duobligitaj  = numeroj$> (x -> x * 2)                // mapo  → [2,4,6…20]
paroj        = numeroj$| (x -> x % 2 == 0)           // filtrilo → [2,4,6,8,10]
sumo         = numeroj$< (0, (acc, x) -> acc + x)    // redukto → 55

// Ĉena per intermediatoj
paŝo1 = numeroj$| (x -> x > 3)
paŝo2 = paŝo1$> (x -> x * x)
>> paŝo2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Nomataj funkcioj povas esti pasataj rekte al HOF
duobligi(x) { <~ x * 2 }
estas_granda(x) { <~ x > 5 }
r = numeroj$> duobligi       // ✅ rekta referenco
r = numeroj$| estas_granda   // ✅ rekta referenco
```

---

## Tubo-Operatoro

La dekstra flanko ĉiam bezonas `_` kiel lokan valoron por la tubita valoro:

```zymbol
duobligi = x -> x * 2
aldoni = (a, b) -> a + b
pliigi = x -> x + 1

r1 = 5 |> duobligi(_)        // → 10
r2 = 10 |> aldoni(_, 5)       // → 15
r3 = 5 |> aldoni(2, _)        // → 7

// Ĉenita
r = 5 |> duobligi(_) |> pliigi(_) |> duobligi(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Eraro-Traktado

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "divido per nulo" ¶
} :! {
    >> "alia: " _err ¶    // _err enhavas la erarmesaĝon
} :> {
    >> "ĉiam ekzekutas" ¶
}
```

| Tipo | Kiam |
|------|------|
| `##Div` | Divido per nulo |
| `##IO` | Dosiero / sistemo |
| `##Index` | Indico ekster limoj |
| `##Type` | Tipodiskordo |
| `##Parse` | Datuma analizado |
| `##Network` | Ret-eraroj |
| `##_` | Ajna eraro (ĉio-kapti) |

---

## Moduloj

```zymbol
// lib/kalkulo.zy — modula korpo estas en krampoj
# kalkulo {
    #> { aldoni, akiri_PI }

    _PI := 3.14159
    aldoni(a, b) { <~ a + b }
    akiri_PI() { <~ _PI }
}
```

```zymbol
// ĉefa.zy
<# ./lib/kalkulo => k    // kromnomo bezonata

>> k::aldoni(5, 3) ¶     // → 8
pi = k::akiri_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Eksporti per malsama publika nomo
# mialibrejo {
    #> { _interna_aldono => sumo }

    _interna_aldono(a, b) { <~ a + b }
}
```

```zymbol
<# ./mialibrejo => m

>> m::sumo(3, 4) ¶    // → 7  (interna nomo _interna_aldono estas kaŝita)
```

> **Modulaj reguloj**: nur `#>`, funkciaj difinoj, kaj literalaj variablo/konstanto-iniciigoj estas permesitaj en `# nomo { }`. Plenumendaj deklaroj (`>>`, `<<`, bukloj, ktp.) levas eraron E013.

---

## Numeralaj Reĝimoj

Zymbol povas montri nombrojn en **69 Unikodaj cifera skriptoj** — Devanagari, Araba-India, Taja, Klingona pIqaD, Matematika Grasa, LCD-segmentoj, kaj pli. La aktiva reĝimo nur tuŝas `>>` eligon; interna aritmetiko estas ĉiam duuma.

### Aktivado de skripto

Skribu la `0` kaj `9` ciferon de la celata skripto enfermitaj en `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Araba-India (U+0660–U+0669)
#๐๙#    // Taja         (U+0E50–U+0E59)
#09#    // restarigi al ASCII
```

### Eligo kaj bu-valoroj

```zymbol
x = 42
>> x ¶          // → 42   (ASCII defaŭlta)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (decimala punkto ĉiam ASCII)
>> 1 + 2 ¶      // → ३

// Bu-valoroj: # prefikso ĉiam ASCII, cifero adaptiĝas
>> #1 ¶         // → #१   (vera  en Devanagari)
>> #0 ¶         // → #०   (falsa — aparta de ०  entjera nulo)

x = 28 > 4
>> x ¶          // → #१   (kompara rezulto sekvas aktivan reĝimon)
```

### Denaskaj cifera literaloj en fontokodo

Ajna subtenata skripta cifero estas valida literalo — en rangoj, modulo, komparoj:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Bu-valoraj literaloj en ajna skripto

`#` + cifero `0` aŭ `1` el ajna bloko estas valida bu-valora literalo:

```zymbol
#٠٩#
aktiva = #١        // sama al #1
>> aktiva ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` estas **ĉiam ASCII**. `#0` (falsa) estas ĉiam vide aparta de `0` (entjera nulo) en ĉiu skripto.

---

## Datumoperatoroj

```zymbol
// Tipokonvertaj ĵetoj
f = ##.42         // → 42.0  (al Float)
i = ###3.7        // → 4     (al Int, rondigi)
t = ##!3.7        // → 3     (al Int, trunki)

// Analizi ŝnuron al nombro
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (sekura malsukceso, sen eraro)

// Rondigi / Trunki
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (rondigi al 2 decimalaj lokoj)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (trunki)

// Nombra formatado
fmt = #,|1234567|      // → 1,234,567  (kome-separita)
sci = #^|12345.678|    // → 1.2345678e4  (scienca)

// Bazaj literaloj
a = 0x41         // → 'A'  (heksa)
b = 0b01000001   // → 'A'  (duuma)
c = 0o101        // → 'A'  (okuma)

// Baza konverta eligo
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Ŝelo-Integriĝo

```zymbol
dato = <\ date +%Y-%m-%d \>     // kapti stdout (kun fina \n)
>> "Hodiaŭ: " dato

dosiero = "datumoj.txt"
enhavo = <\ cat {dosiero} \>    // interpolo en komandoj

eligo = </"./subscript.zy"/>   // ekzekuti alian Zymbol-skripton, kapti eliron
>> eligo
```

> `><` kaptas CLI-argumentojn kiel ŝnuran aron (nur arbomarŝilo).

---

## Kompleta Ekzemplo: FizzBuzz

```zymbol
klasifiki(nombro) {
    ? nombro % 15 == 0 { <~ "FizzBuzz" }
    _? nombro % 3  == 0 { <~ "Fizz" }
    _? nombro % 5  == 0 { <~ "Buzz" }
    _ { <~ nombro }
}

@ i:1..20 { >> klasifiki(i) ¶ }
```

---

## Simbola Referenco

| Simbolo | Operacio | Simbolo | Operacio |
|---------|----------|---------|----------|
| `=` | variablo | `$#` | longo |
| `:=` | konstanto | `$+` | aldoni (ĉenigebla) |
| `>>` | eligo | `$+[i]` | enmeti ĉe indico (1-baza) |
| `<<` | enigo | `$-` | forigi unuan laŭ valoro |
| `¶` / `\\` | novlinio | `$--` | forigi ĉiujn laŭ valoro |
| `?` | se | `$-[i]` | forigi ĉe indico (1-baza) |
| `_?` | alie se | `$-[i..j]` | forigi rangon (1-baza) |
| `_` | alie / ĝokero | `$?` | enhavas |
| `??` | kongruo | `$??` | trovi ĉiujn indicojn (1-baza) |
| `@` | buklo | `$[s..e]` | tranĉi (1-baza) |
| `@ N { }` | N-foja buklo | `$>` | mapo |
| `@!` | rompi | `$\|` | filtrilo |
| `@>` | daŭrigi | `$<` | redukti |
| `@:nomo { }` | etikedita buklo | `$/ delim` | ŝnur-divido |
| `@:nomo!` | rompi etikedon | `$++ a b c` | kunmeta konstruo |
| `@:nomo>` | daŭrigi etikedon | `aro[i>j>k]` | navigacia indico |
| `->` | lambda | `aro[i] = val` | ĝisdatigi elementon (nur aroj) |
| `aro[i] += val` | kunmeta ĝisdatigo | `aro[i]$~` | funkcia ĝisdatigo (nova kopio) |
| `$^+` | ordigi kreskante (primitivoj) | `$^-` | ordigi malkreskante (primitivoj) |
| `$^` | ordigi per komparilo (tuploj) | `<~` | redoni |
| `\|>` | tubo | `!?` | provi |
| `:!` | kapti | `:>` | fine |
| `#1` | vera | `#0` | falsa |
| `$!` | estas eraro | `$!!` | disvastigi eraron |
| `<#` | importi | `#>` | eksporti |
| `#` | deklari modulon | `::` | modula voko |
| `.` | kampa aliro | `#?` | tipa metadatumoj |
| `#\|..\|` | analizi nombron | `##.` | ĵeti al Float |
| `###` | ĵeti al Int (rondigi) | `##!` | ĵeti al Int (trunki) |
| `#.N\|..\|` | rondigi | `#!N\|..\|` | trunki |
| `#,\|..\|` | koma formato | `#^\|..\|` | scienca |
| `#d0d9#` | cifera reĝim-ŝaltilo | `#09#` | restarigi al ASCII |
| `<\ ..\>` | ŝelo-ekzekuto | `>\<` | CLI-argumentoj |
| `\ var` | eksplicite detrui variablon | `°x` / `x°` | varma difinado (aŭto-init) |
| `>>|` | TUI-bloko (ŝanĝa ekrano) | `>>~` | poziciigita eligo |
| `>>!` | viŝi ekranon | `>>?` | demandi terminalan grandecon |
| `<<\|` | blokanta klavpremo | `<<\|?` | ne-blokanta klavpremo |
| `@~ N` | dormi N milisekundojn | `$*` | ŝnura ripeto N fojojn |

---

## Eldona Ŝanĝregistro

### v0.0.5 — TUI-Primitivoj, Varma Difinado & Ŝnura Ripeto _(Majo 2026)_

- **Rompanta** Kongrua braka limsigno: `ŝablono : rezulto` → `ŝablono => rezulto`
- **Rompanta** Importa kromnomo: `<# vojo <= kromnomo` → `<# vojo => kromnomo`
- **Rompanta** Eksporta alinomigo: `#> { fn <= pub }` → `#> { fn => pub }`
- **Aldonita** TUI-bloko `>>| { }` — ŝanĝa ekrano + kruda reĝimo; purigas ĉe eliro
- **Aldonita** Poziciigita eligo `>>~ (vico, kolumno, BKS, fg, bg) > eroj` — malplena lokoj, 256-kolora ANSI
- **Aldonita** Klava enigo `<<| var` (blokanta) kaj `<<|? var` (ne-blokanta sondado)
- **Aldonita** `>>!` viŝi ekranon, `>>?` demandi terminalan grandecon, `@~ N` dormi N milisekundojn
- **Aldonita** Varma difinado `°x` / `x°` — aŭtomate iniciigi variablon unuafoje en bukloj
- **Aldonita** Ŝnura ripeto `str $* N` — ripeti ŝnuron N fojojn
- **VM** Pareco: 436/436 testoj pasintaj

### v0.0.4 — 1-Baza Indicado, Unuarangaj Funkcioj & Modulaj Blokoj _(Aprilo 2026)_

- **Rompanta** Ĉiu indicado ŝanĝita al **1-baza** — `aro[1]` estas la unua elemento; `aro[0]` estas ekzekuta eraro
- **Aldonita** Nomataj funkcioj estas **unuarangaj valoroj** — pasataj rekte al HOF: `numeroj$> duobligi`
- **Aldonita** Modula **bloka sintakso** bezonata: `# nomo { ... }` — plata sintakso forigita
- **Aldonita** Plurdimenzia indicado: `aro[i>j>k]` (navigacia), `aro[p ; q]` (plata eltiro)
- **Aldonita** Tipokonvertaj ĵetoj: `##.expr` (Float), `###expr` (Int rondigi), `##!expr` (Int trunki)
- **Aldonita** Ŝnur-divido: `str$/ delim` — liveras `Array(String)`
- **Aldonita** Kunmeta konstruo: `bazo$++ a b c` — aldonas plurajn erojn
- **Aldonita** N-foja buklo: `@ N { }` — ripeti ekzakte N fojojn
- **Aldonita** Etikedita bukla sintakso: `@:nomo { }`, `@:nomo!`, `@:nomo>` — anstataŭas `@ @nomo` / `@! nomo`
- **Aldonita** Variablaj ampleksaj reguloj: `_nomo` variabloj havas ekzaktan blok-amplekson; `\ var` detruas frue
- **Aldonita** Kongruaj komparaj ŝablonoj: `< 0 :`, `> 5 :`, `== 42 :` ktp.
- **Aldonita** Modula E013 eraro: plenumendaj deklaroj en modula korpo estas malpermesitaj
- **Korektita** `take_variable` ne plu koruptas modulajn konstantojn ĉe reskribo
- **Korektita** `kromnomo.KONST` nun solvas ĝuste; `#>` povas aperi post funkciaj difinoj
- **VM** Plena pareco: 393/393 testoj pasintaj

### v0.0.3 — Unikodaj Numeralaj Sistemoj & LSP-Plibonigoj _(Aprilo 2026)_

- **Aldonita** 69 Unikodaj ciferaj blokoj kun reĝim-ŝaltila ĵetono `#d0d9#`
- **Aldonita** Bu-valoraj literaloj en ajna skripto — `#१` / `#०`, `#١` / `#٠`, ktp.
- **Aldonita** Klingonaj pIqaD-ciferoj (CSUR PUA U+F8F0–U+F8F9)
- **Aldonita** `SetNumeralMode` VM-opkodo — plena pareco kun arbomarŝilo
- **Aldonita** REPL respektas aktivan numeralan reĝimon en eĥo kaj variabla montrado
- **Ŝanĝita** Bu-valora `>>` eligo nun inkluzivas `#` prefikson (`#0` / `#1`) en ĉiuj reĝimoj

### v0.0.2_01 — Operatora Alinomigo _(30 Mar 2026)_

- **Ŝanĝita** `c|..|` → `#,|..|` kaj `e|..|` → `#^|..|` — konsekvenca kun `#` format-prefiksa familio
- **Aldonita** Eksporta kromnomo: re-eksporti modulanojn sub malsama nomo

### v0.0.2 — Kolekta API Redesajno & Instaliloj _(24 Mar 2026)_

- **Aldonita** Unuigita `$` operatora familio por aroj kaj ŝnuroj (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Aldonita** Malstrukturado por aroj, tuploj, kaj nomataj tuploj
- **Aldonita** Negativaj indicoj (`aro[-1]` = lasta elemento)
- **Aldonita** Denaskaj instaliloj — Linukso (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Vindozo (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Aldonita** Kunmeta asigno `^=`
- **Korektita** Analizila aritmetikaj randkazoj; dokumentaraj korektoj

### v0.0.1 — Komenca Publika Eldono _(22 Mar 2026)_

- Arbomarŝila interpretilo + registra VM (`--vm`, ~4× pli rapida, ~95% pareco)
- Ĉiuj kernaj konstruoj: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Plenaj Unikodaj identigaĵoj, modula sistemo, lambdoj, fermoj, eraro-traktado
- REPL, LSP, VS Code-etendaĵo, formatilo (`zymbol fmt`)

---

_Zymbol-Lang — Simbola. Universala. Neŝanĝebla._
