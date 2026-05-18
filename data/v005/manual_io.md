> **Prizindiko:** Ica dokumento kreesis e tradukesis per artifical inteligenteso (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> La kanonala refero esas **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** en la interpreso-deponeyo.

---

# Manualo di Zymbol-Lang

> **Revizita por v0.0.5 — 2026-05-15**

**Zymbol-Lang** esas simbola programifo-linguo. Nula komandovorti — omno esas simbolo. Ol funcionas idente en omna homala linguo.

- Nula `if`, `while`, `return` — nur `?`, `@`, `<~`
- Plena Unicode — identifikivi en irga linguo o emoji
- Homala-linguo agnostika — la kodexo esas sama omnaloke

**Interpreso-versiono**: v0.0.5 | **Testo-kovrado**: 436/436 (paritato TW ↔ VM)

---

## Variabli e Konstantaji

```zymbol
x = 10              // chanjebla variablo
π := 3.14159        // konstanto — riatribuaco esas eroro dum exekuto
nomo = "Alice"
aktiva = #1         // booleana vera
👋 := "Saluto"
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

`°` (grado-simbolo, U+00B0) iniciatas variablo automate a lua neutra valoro ye l'unesma uzo:

```zymbol
nombri = [3, 1, 4, 1, 5]
@ n:nombri {
    °totalo += n    // automata iniciado a 0 super la buklo; transvivas pos @
}
>> totalo ¶         // → 14
```

> `°x` (prefixo) ankras super la buklo — rezulto esas acesebla pos `@`.
> `x°` (sufixo) ankras interne la buklo — mortas kande la buklo finas.
> Nur tree-walker.

---

## Data-tipi

| Tipo | Literalo | Etiketo `#?` | Noti |
|------|---------|----------|---------|
| Integro | `42`, `-7` | `###` | 64-bita signizita |
| Flotacanta | `3.14`, `1.5e10` | `##.` | Ciencala notaciono permisesas |
| Kordono | `"texto"` | `##"` | Interpolado: `"Saluto {nomo}"` |
| Karaktero | `'A'` | `##'` | Singla Unicode-karaktero |
| Booleana | `#1`, `#0` | `##?` | Ne nombrala — `#1 ≠ 1` |
| Aro | `[1, 2, 3]` | `##]` | Homogena elementi |
| Tupelo | `(a, b)` | `##)` | Pozicionala |
| Nomizita tupelo | `(x: 1, y: 2)` | `##)` | Nomizita agri |
| Funciono | refero di nomizita funciono | `##()` | Unesma-klasa; montras `<funct/N>` |
| Lambdao | `x -> x * 2` | `##->` | Unesma-klasa; montras `<lambd/N>` |

```zymbol
// Tipo-introspektado — retrodonas (tipo, cifri, valoro)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Produkturo e Eniro

```zymbol
>> "Saluto" ¶                       // ¶ o \\ por explikita nova lineo
>> "a=" a " b=" b ¶               // apoziciono — multa valori
>> (arr$#) ¶                      // sufixala operatori bezonas ( ) en >>

>> nomo                           // lektas aden variablo (sen prompto)
>> "Skribez nomo: " nomo            // kun prompto
```

> `¶` (AltGr+R sur Hispaniana klavaro) e `\\` esas equivalanta novi linei.

---

## TUI Primitivi

Terminalo-uzero-interfacala operatori por interaktiva programi. La maxim multa bezonas bloko `>>| { }` (alternativa skreno + kruda modo).

```zymbol
>>| {
    >>!                             // clean alternativa skreno
    >>~ (1, 1, 0, 10) > "Kuras"    // lineo 1, kolumno 1, fg=10 (verda)
    @~ 1000                         // pauzar 1 sekundo (1000 ms)
    >>~ (2, 1) > "Finis."
}
// terminalo restauresas automate ye ekireyo
```

```zymbol
// Klavopreso e terminalala grandeso
>>| {
    [linei, kolumni] = >>?              // questionas dimensioni di terminalo
    >>~ (1, 1) > "Terminalo: " linei " x " kolumni
    <<| klavo                         // lektas blokanta klavopreso
    >>~ (2, 1) > "Prenis: " klavo
}
```

> `>>!` cleans skreno. `>>?` retrodonas `[linei, kolumni]`. `@~ N` dormas N milisekundi.
> `<<|` lektas un klavopreso (blokanta); `<<|?` sonder blokado (retrodonas `'\0'` se nula).
> Pozicionala produkturo tupelo: `(lineo, kolumno, BKS, fg, bg)` — irga fako povas esar omisita per komo (`>>~ (,,, 196) > "reda"`).
> BKS bit-masko: `1`=grasa, `2`=kursiva, `4`=sublineo. ANSI 256-koloro paleto (`0`=terminalala predefinita).
> Nur tree-walker (cepte `>>!`, `>>?`, `@~`, `>>~` qui anke funcionas en `--vm`).

---

## Operatori

```zymbol
// Aritmetiko
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (integrala divido)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (exponantigo)

// Komparo — atribuez por inspektar
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Logikala
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Kordoni

```zymbol
// Du formi di konkateno
nomo = "Alice"
n = 42

>> "Saluto " nomo " vu havas " n ¶       // apoziciono — en >>
deskripto = "Saluto {nomo}, vu havas {n}"     // interpolado — irgaloke
```

```zymbol
s = "Saluto mondo"
longeso = s$#                  // 11
sub = s$[1..5]             // "Salut"  (1-bazala, fino inkluzita)
havas = s$? "mondo"          // #1
parti = "a,b,c,d"$/ ','   // [a, b, c, d]  (dividar per separilo)
remplas = s$~~["l":"r"]        // "Sarruto mondo"
remplas1 = s$~~["l":"r":1]     // "Saruto mondo"  (nur l'unesma N)
lineo = "─" $* 20           // "────────────────────"  (repetar N-foye)
```

> `+` esas nur por nombri. Por kordoni, uzas `,`, apoziciono, o interpolado.

---

## Kontrolo-fluxo

```zymbol
x = 7

? x > 0 { >> "pozitiva" ¶ }

? x > 100 {
    >> "granda" ¶
} _? x > 0 {
    >> "pozitiva" ¶
} _? x == 0 {
    >> "zero" ¶
} _ {
    >> "negativa" ¶
}
```

> Kramponi `{ }` **esas obliga** mem por singla deklaro.

---

## Koncilio

```zymbol
// Limiti
skoro = 85
grado = ?? skoro {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> grado ¶    // → B

// Kordoni
koloro = "reda"
kodexo = ?? koloro {
    "reda"   => "#FF0000"
    "verda" => "#00FF00"
    _       => "#000000"
}

// Kompara modeli
temperaturo = -5
stato = ?? temperaturo {
    < 0  => "glacio"
    < 20 => "kolda"
    < 35 => "varma"
    _    => "varmega"
}
>> stato ¶    // → glacio

// Formo di deklaro (blokala braki)
n = -3
?? n {
    0    => { >> "zero" ¶ }
    < 0  => { >> "negativa" ¶ }
    _    => { >> "pozitiva" ¶ }
}
```

---

## Bukli

```zymbol
@ i:0..4  { >> i " " }        // limito inkluzita:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // kun paso:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // inversa:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

frukti = ["pomo", "piro", "vito"]
@ f:frukti { >> f ¶ }         // singla elemento en aro

@ k:"hello" { >> k "-" }
>> ¶                          // → h-e-l-l-o-  (singla karaktero en kordono)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> durigar
    ? i > 7 { @! }             // @! ruptar
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

// Etiketizita buklo (inkrustita ruptado)
kontilo = 0
@:extera {
    kontilo++
    ? kontilo >= 3 { @:extera! }
}
>> kontilo ¶                    // → 3
```

---

## Funcioni

```zymbol
adicar(a, b) { <~ a + b }
>> adicar(3, 4) ¶    // → 7

faktorialo(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorialo(n - 1)
}
>> faktorialo(5) ¶    // → 120
```

Funcioni havas **izolita skopo** — li ne povas lektar extera variabli. Uzez produkturo-parametri `<~>` por modifikar la variabli dil chanto:

```zymbol
intershangez(a<~, b<~) {
    temp = a
    a = b
    b = temp
}
x = 10
y = 20
intershangez(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Nomizita funcioni esas **unesma-klasa valori** — sendez direte: `nombri$> duopligar`. Por invelopar: `x -> fn(x)` esas anke valida.

---

## Lambdai e Klozi

```zymbol
duopligar = x -> x * 2
adicar = (a, b) -> a + b
>> duopligar(5) ¶    // → 10
>> adicar(3, 7) ¶  // → 10

// Blokala lambdao
klasifikar = x -> {
    ? x > 0 { <~ "pozitiva" }
    _? x < 0 { <~ "negativa" }
    <~ "zero"
}

// Klozo — kaptas extera skopo
faktoro = 3
triopligar = x -> x * faktoro
>> triopligar(7) ¶    // → 21

// Fabrikerio
krear_adicanto(n) { <~ x -> x + n }
adicar_dek = krear_adicanto(10)
>> adicar_dek(5) ¶    // → 15

// En aro
operatori = [x -> x+1, x -> x*2, x -> x*x]
>> operatori[3](5) ¶    // → 25
```

---

## Aro

Ari esas **changebla** e kontenas elementi **di sama tipo**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — aceso (1-bazala: unesma elemento)
x = arr[-1]     // 5 — negativa indico (lasta elemento)
x = arr$#       // 5 — longeso (uzar (arr$#) en >>)

arr = arr$+ 6            // adjuntar → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // insertar ye poziciono 2 (1-bazala)
arr3 = arr$- 3           // forigar l'unesma evento di valoro
arr4 = arr$-- 3          // forigar omna eventi
arr5 = arr$-[1]          // forigar ye indico 1 (unesma elemento)
arr6 = arr$-[2..3]       // forigar limito (1-bazala, fino inkluzita)

havas = arr$? 3            // #1 — kontenas
pozicioni = arr$?? 3           // [3] — omna indici di valoro (1-bazala)
 segmento = arr$[1..3]          // [1,2,3] — segmento (1-bazala, fino inkluzita)
 segmento2 = arr$[1:3]          // [1,2,3] — sama, kontado-bazala sintaxo

acensanta = arr$^+             // ordinigar acensante (nur primitivi)
decensanta = arr$^-            // ordinigar decensante (nur primitivi)

// Ari di nomizita/pozicionala tupeli — uzez $^ kun komparanta lambdao
bazeyo = [(nomo: "Carla", evo: 28), (nomo: "Ana", evo: 25), (nomo: "Bob", evo: 30)]
segun_evo  = bazeyo$^ (a, b -> a.evo < b.evo)    // segun evo acensante (<)
segun_nomo = bazeyo$^ (a, b -> a.nomo > b.nomo)   // segun nomo decensante (>)
>> segun_evo[1].nomo ¶     // → Ana
>> segun_nomo[1].nomo ¶    // → Carla

// Direta elemento-atributado (nur ari)
arr[1] = 99              // atribuar
arr[2] += 5              // kompozita: +=  -=  *=  /=  %=  ^=

// Funcionala aktualigo — retro donas nova aro; originalo ne modifikas
arr2 = arr[2]$~ 99
```

> Omna kolektado-operatori retro donas **nova aro**. Atribuez retro: `arr = arr$+ 4`.
> `$+` povas esar katenizita: `arr = arr$+ 5$+ 6$+ 7`. Altra operatori uzas intermeza atribui.
> **Indicizado esas 1-bazala**: `arr[1]` esas l'unesma elemento; `arr[0]` esas eroro dum exekuto.
> `$^+` / `$^-` ordinigas **primitiva ari** (nombri, kordoni). Por tupel-ari, uzez `$^` kun komparanta lambdao — la direciono enkodexas en la lambdao (`<` = acensanta, `>` = decensanta).

**Valoro-semantiko** — atribuado di aro ad altra variablo kreas nedependanta kopiuro:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ne influesas
```

```zymbol
// Inkrustita ari (1-bazala indicizado)
matrico = [[1,2,3],[4,5,6],[7,8,9]]
>> matrico[2][3] ¶    // → 6  (lineo 2, kolumno 3)
```

---

## Destrukturo

```zymbol
// Aro
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[unesma, *restanta] = arr         // unesma=10  restanta=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ forjettas

// Pozicionala tupelo
punto = (100, 200)
(px, py) = punto             // px=100  py=200

// Nomizita tupelo
persono = (nomo: "Ana", evo: 25, urbo: "Madrid")
(nomo: n, evo: e) = persono   // n="Ana"  e=25
```

---

## Tupeli

Tupeli esas **nechangebla** ordizita kontenanti qui povas tenar valori **di diferanta tipi**.
Kontraste ari, elementi ne povas chanjar post kreado.

```zymbol
// Pozicionala — mixita tipi permisesas
punto = (10, 20)
>> punto[1] ¶    // → 10

dati = (42, "Saluto", #1, 3.14)
>> dati[3] ¶     // → #1

// Nomizita
persono = (nomo: "Alice", evo: 25)
>> persono.nomo ¶    // → Alice
>> persono[1] ¶      // → Alice  (indico anke funcionas, 1-bazala)

// Inkrustita
loko = (x: 10, y: 20)
p = (loko: loko, etiketo: "originalo")
>> p.loko.x ¶        // → 10
```

**Nechangebleco** — irga probo modifikar tupel-elemento esas eroro dum exekuto:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ eroro dum exekuto: tupeli esas nechangebla
// t[1] += 5    // ❌ sama eroro
```

Por obtenar modifikita valoro, uzez `$~` (funcionala aktualigo) — retro donas **nova tupelo**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← originalo ne modifikas
>> t2 ¶    // → (10, 999, 30)

// Nomizita tupelo — rikonstruktez explicite
persono = (nomo: "Alice", evo: 25)
plu_olda  = (nomo: persono.nomo, evo: 26)
>> persono.evo ¶    // → 25
>> plu_olda.evo ¶     // → 26
```

---

## Superiora-ordinala Funcioni

```zymbol
nombri = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

duopligita  = nombri$> (x -> x * 2)                  // map  → [2,4,6…20]
para    = nombri$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
totalo    = nombri$< (0, (akumulatoro, x) -> akumulatoro + x)     // reduce → 55

// Katenizar tra intermezaji
etapo1 = nombri$| (x -> x > 3)
etapo2 = etapo1$> (x -> x * x)
>> etapo2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Nomizita funcioni povas esar sendita direte a HOF
duopligar(x) { <~ x * 2 }
esas_granda(x) { <~ x > 5 }
r = nombri$> duopligar       // ✅ direta refero
r = nombri$| esas_granda       // ✅ direta refero
```

---

## Pip-operatoro

La dextra latero sempre bezonas `_` kom lokizilo por la pip-izita valoro:

```zymbol
duopligar = x -> x * 2
adicar = (a, b) -> a + b
inkrementar = x -> x + 1

r1 = 5 |> duopligar(_)        // → 10
r2 = 10 |> adicar(_, 5)       // → 15
r3 = 5 |> adicar(2, _)        // → 7

// Katenizita
r = 5 |> duopligar(_) |> inkrementar(_) |> duopligar(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Eroro-manjo

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "divido per zero" ¶
} :! {
    >> "altra: " _err ¶    // _err tenas l'eroro-mesajo
} :> {
    >> "always exekutas" ¶
}
```

| Tipo | Kande |
|------|------|
| `##Div` | Divido per zero |
| `##IO` | Arkivo / sistemo |
| `##Index` | Indico extera limito |
| `##Type` | Tipo-nekonkordo |
| `##Parse` | Data-parsado |
| `##Network` | Reto-erori |
| `##_` | Irga eroro (kaptas omna) |

---

## Moduli

```zymbol
// lib/calc.zy — modulo korpo inkluzesas en kramponi
# calc {
    #> { adicar, get_PI }

    _π := 3.14159
    adicar(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // aliaso necesa

>> c::adicar(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Exportar per diferanta publika nomo
# mylib {
    #> { _interna_adicar => sumo }

    _interna_adicar(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::sumo(3, 4) ¶    // → 7  (interna nomo _interna_adicar celas)
```

> **Modulo-reguli**: en `# nomo { }`, nur `#>`, funciono-defini, e literala variablo/konstanto inicieri permisesas. Exekutebla deklari (`>>`, `<<`, bukli, kc.) levas eroro E013.

---

## Numerala Modi

Zymbol povas montrar nombri en **69 Unicode-cifrala skripti** — Devanagari, Arab-Indiana, Thai, Klingon pIqaD, Matematika Grasa, LCD-segmenti, e plu. L'aktiva modo influas nur `>>` produkturo; interna aritmetiko esas sempre binara.

### Aktivigar skripto

Skribez la cifri `0` e `9` di la skripto skopo en `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arab-Indiana (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // restaurar a ASCII
```

### Produkturo e booleani

```zymbol
x = 42
>> x ¶          // → 42   (ASCII predefinita)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (decimala punto sempre ASCII)
>> 1 + 2 ¶      // → ३

// Booleani: prefixo # sempre ASCII, cifro adaptas
>> #1 ¶         // → #१   (vera en Devanagari)
>> #0 ¶         // → #०   (falsa — distingas de ० integra zero)

x = 28 > 4
>> x ¶          // → #१   (komparo rezulto sequas l'aktiva modo)
```

### Natura cifrala literali en fonto

Cifri di irga skripto sustenata esas valida literali — en limiti, modulo, kompari:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Booleana literali en irga skripto

`#` + cifro `0` o `1` de irga bloko esas valida booleana literalo:

```zymbol
#٠٩#
aktiva = #١        // sama kam #1
>> aktiva ¶        // → #१
>> (#१ && #०) ¶ // → #०
```

> `#` **esas sempre ASCII**. `#0` (falsa) esas sempre vide diferanta de `0` (integrala zero) en omna skripto.

---

## Data-operatori

```zymbol
// Tipo-konverto
f = ##.42         // → 42.0  (ad flotacanta)
i = ###3.7        // → 4     (ad integro, rondigar)
t = ##!3.7        // → 3     (ad integro, trunkar)

// Parsar kordono a nombro
v1 = #|"42"|      // → 42  (integro)
v2 = #|"3.14"|    // → 3.14  (flotacanta)
v3 = #|"abc"|     // → "abc"  (sekura, nula eroro)

// Rondigar / Trunkar
π = 3.14159265
rondigita2 = #.2|π|      // → 3.14  (rondigar a 2 decimala loki)
rondigita4 = #.4|π|      // → 3.1416
trunkita2 = #!2|π|      // → 3.14  (trunkar)

// Nombro-formato
formato = #,|1234567|  // → 1,234,567  (komo-separita)
ciencala = #^|12345.678|    // → 1.2345678e4  (ciencala)

// Bazala literali
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binara)
c = 0o101        // → 'A'  (oktala)

// Bazala konverto-produkturo
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
okt = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Shelo-integro

```zymbol
dato = <\ date +%Y-%m-%d \>     // kaptas stdout (inkluzas \n ye fino)
>> "Hodie: " dato

arkivo = "data.txt"
kontenajo = <\ cat {arkivo} \>      // interpolado en komandi

produkturo = </"./subscript.zy"/>   // exekutar altra Zymbol-skripto, kaptar produkturo
>> produkturo
```

> `><` kaptas CLI argumenti kom kordono-aro (nur tree-walker).

---

## Kompleta exemplo: FizzBuzz

```zymbol
klasifikar(nombro) {
    ? nombro % 15 == 0 { <~ "FizzBuzz" }
    _? nombro % 3  == 0 { <~ "Fizz" }
    _? nombro % 5  == 0 { <~ "Buzz" }
    _ { <~ nombro }
}

@ i:1..20 { >> klasifikar(i) ¶ }
```

---

## Simbolo-refero

| Simbolo | Operaco | Simbolo | Operaco |
|--------|-----------|--------|-----------|
| `=` | variablo | `$#` | longeso |
| `:=` | konstanto | `$+` | adjuntar (katenizebla) |
| `>>` | produkturo | `$+[i]` | insertar ye indico (1-bazala) |
| `<<` | eniro | `$-` | forigar l'unesma per valoro |
| `¶` / `\\` | nova lineo | `$--` | forigar omna per valoro |
| `?` | se | `$-[i]` | forigar ye indico (1-bazala) |
| `_?` | altre-se | `$-[i..j]` | forigar limito (1-bazala) |
| `_` | altre / wildcard | `$?` | kontenas |
| `??` | konkordigo | `$??` | trovar omna indici (1-bazala) |
| `@` | buklo | `$[s..e]` | segmento (1-bazala) |
| `@ N { }` | buklo N-foye | `$>` | map |
| `@!` | ruptar | `$\|` | filter |
| `@>` | durigar | `$<` | reduce |
| `@:nomo { }` | etiketizita buklo | `$/ separilo` | dividar kordono |
| `@:nomo!` | ruptar etiketo | `$++ a b c` | konkateno-konstruktado |
| `@:nomo>` | durigar etiketo | `arr[i>j>k]` | navigado-indico |
| `->` | lambdao | `arr[i] = valoro` | aktualigar elemento (nur ari) |
| `arr[i] += valoro` | kompozita aktualigo | `arr[i]$~` | funcionala aktualigo (nova kopiuro) |
| `$^+` | ordinigar acensante (primitivi) | `$^-` | ordinigar decensante (primitivi) |
| `$^` | ordinigar kun komparatoro (tupeli) | `<~` | retro donar |
| `\|>` | pipo | `!?` | probar |
| `:!` | kaptar | `:>` | fine |
| `#1` | vera | `#0` | falsa |
| `$!` | esas eroro | `$!!` | propagar eroro |
| `<#` | importacar | `#>` | exportacar |
| `#` | deklarar modulo | `::` | vokar modulo |
| `.` | agro-aceso | `#?` | tipo-metadonaji |
| `#\|..\|` | parsar nombro | `##.` | konvertar ad flotacanta |
| `###` | konvertar ad integro (rondigar) | `##!` | konvertar ad integro (trunkar) |
| `#.N\|..\|` | rondigar | `#!N\|..\|` | trunkar |
| `#,\|..\|` | komo-formato | `#^\|..\|` | ciencala |
| `#d0d9#` | swichar numerala modo | `#09#` | restaurar a ASCII |
| `<\ ..\>` | exekutar shelo | `>\<` | CLI argumenti |
| `\ variablo` | destruktar variablo explicite | `°x` / `x°` | varma defino (auto-iniciado) |
| `>>|` | TUI-bloko (alternativa skreno) | `>>~` | pozicionala produkturo |
| `>>!` | cleanar skreno | `>>?` | questionar terminala grandeso |
| `<<\|` | blokanta klavopreso | `<<\|?` | sondar klavopreso senbloke |
| `@~ N` | dormar N milisekundi | `$*` | repetar kordono N-foye |

---

## Versiono-liberigo-changelogo

### v0.0.5 — TUI primitivi, varma defino e kordono-repeto _(Mayo 2026)_

- **Rompa** Konkordigo-brako separilo: `modelo : rezulto` → `modelo => rezulto`
- **Rompa** Importaco-aliaso: `<# voyo <= aliaso` → `<# voyo => aliaso`
- **Rompa** Exportaco-renomizo: `#> { fn <= publika }` → `#> { fn => publika }`
- **Adjuntita** TUI-bloko `>>| { }` — alternativa skreno + kruda modo; netigas ye ekireyo
- **Adjuntita** Pozicionala produkturo `>>~ (lineo, kolumno, BKS, fg, bg) > objekti` — sparse faki, ANSI 256 koloro
- **Adjuntita** Klavo-eniro `<<| variablo` (blokanta) e `<<|? variablo` (senbloka sondado)
- **Adjuntita** `>>!` cleanar skreno, `>>?` questionar terminala grandeso, `@~ N` dormar N milisekundi
- **Adjuntita** Varma defino `°x` / `x°` — auto-iniciar variablo che unesma uzo en bukli
- **Adjuntita** Kordono-repeto `kordono $* N` — repetar kordono N-foye
- **VM** Paritato: 436/436 testi pasas

### v0.0.4 — 1-bazala indicizado, unesma-klasa funcioni e blokala moduli _(Aprilo 2026)_

- **Rompa** Omna indicizado chanjesas a **1-bazala** — `arr[1]` esas l'unesma elemento; `arr[0]` esas eroro dum exekuto
- **Adjuntita** Nomizita funcioni esas **unesma-klasa valori** — sendez direte a HOF: `nombri$> duopligar`
- **Adjuntita** **Blokala sintaxo obligas** por moduli: `# nomo { ... }` — plata sintaxo forigita
- **Adjuntita** Plur-dimensiona indicizado: `arr[i>j>k]` (navigado), `arr[p ; q]` (plata ekstraktado)
- **Adjuntita** Tipo-konverto: `##.expr` (flotacanta), `###expr` (integro rondigar), `##!expr` (integro trunkar)
- **Adjuntita** Kordono-divido: `kordono$/ separilo` — retro donas `Array(kordono)`
- **Adjuntita** Konkateno-konstruktado: `bazo$++ a b c` — adjuntar multa objekti
- **Adjuntita** Tempala buklo: `@ N { }` — repetar exakte N-foye
- **Adjuntita** Etiketizita buklo-sintaxo: `@:nomo { }`, `@:nomo!`, `@:nomo>` — remplasas `@ @nomo` / `@! nomo`
- **Adjuntita** Variablo-skopo reguli: variabli `_nomo` havas exakta bloko-skopo; `\ variablo` destruktas frua
- **Adjuntita** Konkordigo-kompara modeli: `< 0 =>`, `> 5 =>`, `== 42 =>`, kc.
- **Adjuntita** Modulo E013 eroro: exekutebla deklari en modulo korpo esas proskriptita
- **Reparata** `alias.CONST` nun solvas korekte; `#>` povas aparar pos funciono-defini
- **VM** Plena paritato: 393/393 testi pasas

### v0.0.3 — Unicode numerala sistemi e LSP plubonigi _(Aprilo 2026)_

- **Adjuntita** 69 Unicode-cifrala bloki kun modo-switchanta simbolo `#d0d9#`
- **Adjuntita** Booleana literali en irga skripto — `#१` / `#०`, `#१` / `#०`, kc.
- **Adjuntita** Klingon pIqaD cifri (CSUR PUA U+F8F0–U+F8F9)
- **Adjuntita** VM opkodo `SetNumeralMode` — plena paritato kun tree-walker
- **Modifikita** Booleana `>>` produkturo nun inkluzas prefixo `#` (`#0` / `#1`) en omna modi

### v0.0.2_01 — Operatoro-renomizo _(30 marto 2026)_

- **Modifikita** `c|..|` → `#,|..|` e `e|..|` → `#^|..|` — kohera kun la prefixo-familio `#`
- **Adjuntita** Exportaco-aliaso: ri-exportacar modulo-membri sub altra nomo

### v0.0.2 — Kolektado-API ridesigno ed instalizeri _(24 marto 2026)_

- **Adjuntita** Unigita `$` operatoro-familio por ari e kordoni (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Adjuntita** Destrukturo-atribuado por ari, tupeli, e nomizita tupeli
- **Adjuntita** Negativa indici (`arr[-1]` = lasta elemento)
- **Adjuntita** Natura instalizeri — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 marto 2026)_

- **Adjuntita** Kompozita atribuado `^=`
- **Reparata** Parsero-aritmetiko-limito-kazi; dokumentizo-korekti

### v0.0.1 — Unesma publika liberigo _(22 marto 2026)_

- Tree-walker interpretero + registro VM (`--vm`, ~4x plu rapida, ~95% paritato)
- Omna kerna konstrukturi: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Plena Unicode identifikivi, modulo-sistemo, lambdai, klozi, eroro-manjo
- REPL, LSP, VS Code extenso, formato (zymbol fmt)

---

_Zymbol-Lang — Simbola. Universala. Nefanchebla._
