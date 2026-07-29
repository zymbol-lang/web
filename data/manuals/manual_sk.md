> **Upozornenie:** Táto dokumentácia bola vytvorená a preložená umelou inteligenciou (UI).
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Príručka Zymbol-Lang

> **Revidované pre v0.0.5 — 2026-05-12**

**Zymbol-Lang** je symbolický programovací jazyk. Žiadne kľúčové slová — všetko je symbol. Funguje rovnako v každom ľudskom jazyku.

- Bez `if`, `while`, `return` — iba `?`, `@`, `<~`
- Plný Unicode — identifikátory v akomkoľvek jazyku alebo emodži
- Nezávislý od ľudského jazyka — kód je všade rovnaký

**Verzia interpretera**: v0.0.5 | **Pokrytie testami**: 436/436 (TW ↔ VM parita)

---

## Premenné a Konštanty

```zymbol
x = 10              // premenná
PI := 3.14159       // konštanta — opätovné priradenie je chyba za behu
meno = "Alica"
aktivny = #1        // logická pravda
👋 := "Ahoj"
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

`°` (znak stupňa, U+00B0) automaticky inicializuje premennú na jej neutrálnu hodnotu pri prvom použití:

```zymbol
cisla = [3, 1, 4, 1, 5]
@ n:cisla {
    °spolu += n    // auto-inicializácia na 0 nad slučkou; dostupná po @
}
>> spolu ¶         // → 14
```

> `°x` (prefix) zakotvuje nad slučkou — výsledok je dostupný po `@`.
> `x°` (postfix) zakotvuje vnútri slučky — zanikne keď slučka skončí.
> Iba tree-walker.

---

## Dátové Typy

| Typ | Literál | Tag `#?` | Poznámky |
|-----|---------|----------|---------|
| Celé | `42`, `-7` | `###` | 64-bitové so znamienko |
| Desatinné | `3.14`, `1.5e10` | `##.` | Vedecká notácia OK |
| Reťazec | `"text"` | `##"` | Interpolácia: `"Ahoj {meno}"` |
| Znak | `'A'` | `##'` | Jeden znak Unicode |
| Logické | `#1`, `#0` | `##?` | NIE je číslo — `#1 ≠ 1` |
| Pole | `[1, 2, 3]` | `##]` | Homogénne prvky |
| Ntica | `(a, b)` | `##)` | Pozičná |
| Pomenovaná Ntica | `(x: 1, y: 2)` | `##)` | Pomenované polia |
| Funkcia | pomenovaná referencia | `##()` | Prvá trieda; zobrazí `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Prvá trieda; zobrazí `<lambd/N>` |

```zymbol
// Introspekcia typu — vráti (typ, číslice, hodnota)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Výstup a Vstup

```zymbol
>> "Ahoj" ¶                       // ¶ alebo \\ pre explicitný nový riadok
>> "a=" a " b=" b ¶               // juxtapozícia — viac hodnôt
>> (pole$#) ¶                     // postfixové operátory vyžadujú ( ) v >>

<< meno                           // čítanie do premennej (bez výzvy)
<< "Zadajte meno: " meno          // s výzvou
```

> `¶` (AltGr+R na španielskej klávesnici) a `\\` sú ekvivalentné nové riadky.

---

## TUI Primitívy

Terminálové UI operátory pre interaktívne programy. Väčšina vyžaduje blok `>>| { }` (alternatívna obrazovka + surový režim).

```zymbol
>>| {
    >>!                             // vymazanie alternatívnej obrazovky
    >>~ (1, 1, 0, 10) > "Beží"     // riadok 1, stĺpec 1, fg=10 (zelená)
    @~ 1000                         // pauza 1 sekunda (1000 ms)
    >>~ (2, 1) > "Hotovo."
}
// terminál automaticky obnovený pri ukončení
```

```zymbol
// Stlačenie klávesu a veľkosť terminálu
>>| {
    [riadky, stlpce] = >>?              // dopyt na rozmery terminálu
    >>~ (1, 1) > "Terminál: " riadky " x " stlpce
    <<| klavesa                          // blokujúce čítanie klávesu
    >>~ (2, 1) > "Stlačené: " klavesa
}
```

> `>>!` vymaže obrazovku. `>>?` vráti `[riadky, stlpce]`. `@~ N` spí N milisekúnd.
> `<<|` prečíta jedno stlačenie klávesu (blokujúce); `<<|?` skúša bez blokovania (vráti `'\0'` ak žiadne).
> Ntica pozičného výstupu: `(riadok, stlpec, TPS, fg, bg)` — akýkoľvek slot možno vynechať čiarkou (`>>~ (,,, 196) > "červená"`).
> Maska TPS: `1`=Tučné, `2`=Kurzíva, `4`=Podčiarknuté. ANSI 256-farebná paleta (`0`=predvolený terminál).
> Iba tree-walker (okrem `>>!`, `>>?`, `@~`, `>>~`, ktoré fungujú aj s `--vm`).

---

## Operátory

```zymbol
// Aritmetika
a = 10
b = 3
v1 = a + b    // 13
v2 = a - b    // 7
v3 = a * b    // 30
v4 = a / b    // 3  (celočíselné delenie)
v5 = a % b    // 1
v6 = a ^ b    // 1000  (umocňovanie)

// Porovnanie — priradenie na kontrolu
p1 = a == b    // #0
p2 = a <> b    // #1
p3 = a < b     // #0
p4 = a <= b    // #0
p5 = a > b     // #1
p6 = a >= b    // #1

// Logické
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Reťazce

```zymbol
// Dve formy zreťazenia
meno = "Alica"
n = 42

>> "Ahoj " meno " máš " n ¶       // juxtapozícia — v >>
popis = "Ahoj {meno}, máš {n}"    // interpolácia — kdekoľvek
```

```zymbol
s = "Ahoj Svet"
dlzka = s$#                  // 9
pod = s$[1..4]               // "Ahoj"  (1-based, koniec vrátane)
ma = s$? "Svet"              // #1
casti = "a,b,c,d"$/ ','      // [a, b, c, d]  (rozdelenie oddeľovačom)
nahr = s$~~["j":"J"]         // nahradenie
nahr1 = s$~~["j":"J":1]      // iba prvé N
riadok = "─" $* 20           // "────────────────────"  (opakovanie N krát)
```

> `+` iba pre čísla. Pre reťazce použite `,`, juxtapozíciu alebo interpoláciu.

---

## Riadenie Toku

```zymbol
x = 7

? x > 0 { >> "kladné" ¶ }

? x > 100 {
    >> "veľké" ¶
} _? x > 0 {
    >> "kladné" ¶
} _? x == 0 {
    >> "nula" ¶
} _ {
    >> "záporné" ¶
}
```

> Zložené závorky `{ }` sú **povinné** aj pre jeden príkaz.

---

## Zhoda

```zymbol
// Rozsahy
skore = 85
znamka = ?? skore {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> znamka ¶    // → B

// Reťazce
farba = "červená"
kod = ?? farba {
    "červená"  => "#FF0000"
    "zelená"   => "#00FF00"
    _          => "#000000"
}

// Vzory porovnania
teplota = -5
stav = ?? teplota {
    < 0  => "ľad"
    < 20 => "chladno"
    < 35 => "teplo"
    _    => "horúco"
}
>> stav ¶    // → ľad

// Príkazová forma (blokové vetvy)
n = -3
?? n {
    0    => { >> "nula" ¶ }
    < 0  => { >> "záporné" ¶ }
    _    => { >> "kladné" ¶ }
}
```

---

## Slučky

```zymbol
@ i:0..4  { >> i " " }        // rozsah vrátane:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // s krokom:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // dozadu:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

ovocie = ["jablko", "hruška", "hrozno"]
@ o:ovocie { >> o ¶ }         // for-each pole

@ c:"ahoj" { >> c "-" }
>> ¶                          // → a-h-o-j-  (for-each reťazec)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> pokračuj
    ? i > 7 { @! }             // @! prerušenie
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Nekonečná slučka
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Označená slučka (vnorené prerušenie)
pocitadlo = 0
@:vonkajsia {
    pocitadlo++
    ? pocitadlo >= 3 { @:vonkajsia! }
}
>> pocitadlo ¶                // → 3
```

---

## Funkcie

```zymbol
pricti(a, b) { <~ a + b }
>> pricti(3, 4) ¶    // → 7

faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120
```

Funkcie majú **izolovaný rozsah** — nemôžu čítať vonkajšie premenné. Použite výstupné parametre `<~` na zmenu premenných volajúceho:

```zymbol
vymeni(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
vymeni(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Pomenované funkcie sú **hodnoty prvej triedy** — odovzdávajte priamo: `cisla$> zdvoj`. Na obalenie: `x -> fn(x)` je tiež platné.

---

## Lambdy a Uzávery

```zymbol
zdvoj = x -> x * 2
sucet = (a, b) -> a + b
>> zdvoj(5) ¶    // → 10
>> sucet(3, 7) ¶ // → 10

// Bloková lambda
klasifikuj = x -> {
    ? x > 0 { <~ "kladné" }
    _? x < 0 { <~ "záporné" }
    <~ "nula"
}

// Uzáver — zachytí vonkajší rozsah
faktor = 3
trojnasobok = x -> x * faktor
>> trojnasobok(7) ¶    // → 21

// Továreň
vytvor_scitac(n) { <~ x -> x + n }
pricti10 = vytvor_scitac(10)
>> pricti10(5) ¶    // → 15

// V poliach
operacie = [x -> x+1, x -> x*2, x -> x*x]
>> operacie[3](5) ¶    // → 25
```

---

## Polia

Polia sú **meniteľné** a obsahujú prvky **rovnakého typu**.

```zymbol
pole = [1, 2, 3, 4, 5]

x = pole[1]      // 1 — prístup (1-based: prvý prvok)
x = pole[-1]     // 5 — záporný index (posledný prvok)
x = pole$#       // 5 — dĺžka (použite (pole$#) v >>)

pole = pole$+ 6            // pridanie → [1,2,3,4,5,6]
pole2 = pole$+[2] 99       // vloženie na pozíciu 2 (1-based)
pole3 = pole$- 3           // odstránenie prvého výskytu hodnoty
pole4 = pole$-- 3          // odstránenie všetkých výskytov
pole5 = pole$-[1]          // odstránenie na indexe 1 (prvý prvok)
pole6 = pole$-[2..3]       // odstránenie rozsahu (1-based, koniec vrátane)

ma = pole$? 3              // #1 — obsahuje
poz = pole$?? 3            // [3] — všetky indexy hodnoty (1-based)
rez = pole$[1..3]          // [1,2,3] — rez (1-based, koniec vrátane)
rez2 = pole$[1:3]          // [1,2,3] — to isté, syntax s počtom

vzost = pole$^+            // zoradené vzostupne (iba primitívy)
sest = pole$^-             // zoradené zostupne (iba primitívy)

// Polia pomenovaných/pozičných ntíc — použite $^ s lambda komparátorom
bp = [(meno: "Karla", vek: 28), (meno: "Ana", vek: 25), (meno: "Bob", vek: 30)]
podla_veku = bp$^ (a, b -> a.vek < b.vek)      // vzostupne podľa veku  (<)
podla_mena = bp$^ (a, b -> a.meno > b.meno)    // zostupne podľa mena (>)
>> podla_veku[1].meno ¶     // → Ana
>> podla_mena[1].meno ¶     // → Karla

// Priama aktualizácia prvku (iba polia)
pole[1] = 99              // priradenie
pole[2] += 5              // zložené: +=  -=  *=  /=  %=  ^=

// Funkčná aktualizácia — vráti nové pole; originál nezmenený
pole2 = pole[2]$~ 99
```

> Všetky operátory kolekcie vrátia **nové pole**. Priraďte späť: `pole = pole$+ 4`.
> `$+` možno reťaziť: `pole = pole$+ 5$+ 6$+ 7`. Ostatné operátory používajú medzipriradenia.
> **Indexovanie je 1-based**: `pole[1]` je prvý prvok; `pole[0]` je chyba za behu.
> `$^+` / `$^-` triedia **primitívne polia** (čísla, reťazce). Pre polia ntíc použite `$^` s lambda komparátorom — smer je zakódovaný v lambde (`<` = vzostupne, `>` = zostupne).

**Sémantika hodnôt** — priradenie poľa inej premennej vytvorí nezávislú kópiu:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b nie je ovplyvnené
```

```zymbol
// Vnorené polia (1-based indexovanie)
matica = [[1,2,3],[4,5,6],[7,8,9]]
>> matica[2][3] ¶    // → 6  (riadok 2, stĺpec 3)
```

---

## Deštruktúrovanie

```zymbol
// Pole
pole = [10, 20, 30, 40, 50]
[a, b, c] = pole               // a=10  b=20  c=30
[prvy, *zvysok] = pole         // prvy=10  zvysok=[20,30,40,50]
[x, _, z] = [1, 2, 3]          // _ zahodí

// Pozičná ntica
bod = (100, 200)
(bx, by) = bod                 // bx=100  by=200

// Pomenovaná ntica
osoba = (meno: "Ana", vek: 25, mesto: "Bratislava")
(meno: m, vek: v) = osoba      // m="Ana"  v=25
```

---

## Ntice

Ntice sú **nemeniteľné** usporiadané kontajnery, ktoré môžu obsahovať hodnoty **rôznych typov**.
Na rozdiel od polí nie je možné prvky po vytvorení meniť.

```zymbol
// Pozičné — povolené zmiešané typy
bod = (10, 20)
>> bod[1] ¶    // → 10

data = (42, "ahoj", #1, 3.14)
>> data[3] ¶   // → #1

// Pomenované
osoba = (meno: "Alica", vek: 25)
>> osoba.meno ¶    // → Alica
>> osoba[1] ¶      // → Alica  (index tiež funguje, 1-based)

// Vnorené
poz = (x: 10, y: 20)
p = (poz: poz, stitok: "zaciatok")
>> p.poz.x ¶       // → 10
```

**Nemeniteľnosť** — akýkoľvek pokus o zmenu prvku ntice je chyba za behu:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ chyba za behu: ntice sú nemeniteľné
// t[1] += 5    // ❌ rovnaká chyba
```

Na odvodenie zmenenej hodnoty použite `$~` (funkčná aktualizácia) — vráti **novú** nticu:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← originál nezmenený
>> t2 ¶    // → (10, 999, 30)

// Pomenovaná ntica — explicitná rekonštrukcia
osoba = (meno: "Alica", vek: 25)
starsia = (meno: osoba.meno, vek: 26)
>> osoba.vek ¶    // → 25
>> starsia.vek ¶  // → 26
```

---

## Funkcie Vyššieho Rádu

```zymbol
cisla = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

zdvojene   = cisla$> (x -> x * 2)                // map  → [2,4,6…20]
parne      = cisla$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
spolu      = cisla$< (0, (akum, x) -> akum + x)  // reduce → 55

// Reťazenie cez medzivýsledky
krok1 = cisla$| (x -> x > 3)
krok2 = krok1$> (x -> x * x)
>> krok2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Pomenované funkcie možno odovzdať priamo HOF
zdvoj(x) { <~ x * 2 }
je_velke(x) { <~ x > 5 }
v = cisla$> zdvoj      // ✅ priama referencia
v = cisla$| je_velke   // ✅ priama referencia
```

---

## Operátor Rúry

Pravá strana vždy vyžaduje `_` ako zástupný symbol pre odovzdávanú hodnotu:

```zymbol
zdvoj = x -> x * 2
pricti = (a, b) -> a + b
zvys = x -> x + 1

v1 = 5 |> zdvoj(_)         // → 10
v2 = 10 |> pricti(_, 5)    // → 15
v3 = 5 |> pricti(2, _)     // → 7

// Reťazené
v = 5 |> zdvoj(_) |> zvys(_) |> zdvoj(_)
>> v ¶    // → 22  (5→10→11→22)
```

---

## Spracovanie Chýb

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "delenie nulou" ¶
} :! {
    >> "ostatné: " _err ¶    // _err obsahuje správu o chybe
} :> {
    >> "vždy sa spustí" ¶
}
```

| Typ | Kedy |
|-----|------|
| `##Div` | Delenie nulou |
| `##IO` | Súbor / systém |
| `##Index` | Index mimo rozsahu |
| `##Type` | Nezhoda typov |
| `##Parse` | Parsovanie dát |
| `##Network` | Sieťové chyby |
| `##_` | Akákoľvek chyba (catch-all) |

---

## Moduly

```zymbol
// lib/calc.zy — telo modulu je uzavreté v zložených zátvorkách
# calc {
    #> { pricti, ziskaj_PI }

    _PI := 3.14159
    pricti(a, b) { <~ a + b }
    ziskaj_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc => k    // alias je povinný

>> k::pricti(5, 3) ¶     // → 8
pi = k::ziskaj_PI()
>> pi ¶                  // → 3.14159
```

```zymbol
// Export s iným verejným názvom
# mojalib {
    #> { _vnutorne_pricti => sucet }

    _vnutorne_pricti(a, b) { <~ a + b }
}
```

```zymbol
<# ./mojalib => m

>> m::sucet(3, 4) ¶    // → 7  (vnútorný názov _vnutorne_pricti je skrytý)
```

> **Pravidlá modulu**: iba `#>`, definície funkcií a literálne inicializátory premenných/konštánt sú povolené vnútri `# nazov { }`. Spustiteľné príkazy (`>>`, `<<`, slučky atď.) spôsobujú chybu E013.

---

## Číselné Režimy

Zymbol môže zobrazovať čísla v **69 skriptoch číslic Unicode** — Dévanágarí, Arabsko-Indický, Thajský, Klingonský pIqaD, Matematicky tučný, LCD segmenty a ďalšie. Aktívny režim ovplyvňuje iba `>>` výstup; vnútorná aritmetika je vždy binárna.

### Aktivácia skriptu

Zapíšte číslice `0` a `9` cieľového skriptu uzavreté v `#…#`:

```zymbol
#०९#    // Dévanágarí   (U+0966–U+096F)
#٠٩#    // Arabsko-Indický (U+0660–U+0669)
#๐๙#    // Thajský      (U+0E50–U+0E59)
#09#    // reset na ASCII
```

### Výstup a logické hodnoty

```zymbol
x = 42
>> x ¶          // → 42   (ASCII predvolene)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (desatinná bodka vždy ASCII)
>> 1 + 2 ¶      // → ३

// Logické: prefix # vždy ASCII, číslica sa prispôsobí
>> #1 ¶         // → #१   (pravda v Dévanágarí)
>> #0 ¶         // → #०   (nepravda — odlišné od ०  celé číslo nula)

x = 28 > 4
>> x ¶          // → #१   (výsledok porovnania sleduje aktívny režim)
```

### Natívne číselné literály v zdrojovom kóde

Číslice akéhokoľvek podporovaného skriptu sú platné literály — v rozsahoch, modulo, porovnaniach:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Logické literály v ľubovoľnom skripte

`#` + číslica `0` alebo `1` z ľubovoľného bloku je platný logický literál:

```zymbol
#٠٩#
aktivny = #١        // to isté ako #1
>> aktivny ¶        // → #١
>> (#١ && #٠) ¶     // → #٠
```

> `#` je **vždy ASCII**. `#0` (nepravda) je vždy vizuálne odlišné od `0` (celé číslo nula) v každom skripte.

---

## Dátové Operátory

```zymbol
// Konverzie typov
f = ##.42         // → 42.0  (na Desatinné)
i = ###3.7        // → 4     (na Celé, zaokrúhlenie)
t = ##!3.7        // → 3     (na Celé, skrátenie)

// Parsovanie reťazca na číslo
v1 = #|"42"|      // → 42  (Celé)
v2 = #|"3.14"|    // → 3.14  (Desatinné)
v3 = #|"abc"|     // → "abc"  (bezpečné zlyhanie, bez chyby)

// Zaokrúhľovanie / skrátenie
pi = 3.14159265
v2 = #.2|pi|      // → 3.14  (zaokrúhli na 2 desatinné miesta)
v4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (skrátenie)

// Formátovanie čísel
fmt = #,|1234567|  // → 1,234,567  (oddelené čiarkami)
ved = #^|12345.678|    // → 1.2345678e4  (vedecká notácia)

// Literály základov
a = 0x41         // → 'A'  (hexadecimálne)
b = 0b01000001   // → 'A'  (binárne)
c = 0o101        // → 'A'  (osmičkové)

// Výstup konverzie základu
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integrácia Shell

```zymbol
datum = <\ date +%Y-%m-%d \>     // zachytí stdout (vrátane záverečného \n)
>> "Dnes: " datum

subor = "data.txt"
obsah = <\ cat {subor} \>        // interpolácia v príkazoch

vystup = </"./podskript.zy"/>    // spustí iný Zymbol skript, zachytí výstup
>> vystup
```

> `><` zachytí CLI argumenty ako pole reťazcov (iba tree-walker).

---

## Kompletný Príklad: FizzBuzz

```zymbol
klasifikuj(cislo) {
    ? cislo % 15 == 0 { <~ "FizzBuzz" }
    _? cislo % 3  == 0 { <~ "Fizz" }
    _? cislo % 5  == 0 { <~ "Buzz" }
    _ { <~ cislo }
}

@ i:1..20 { >> klasifikuj(i) ¶ }
```

---

## Prehľad Symbolov

| Symbol | Operácia | Symbol | Operácia |
|--------|----------|--------|----------|
| `=` | premenná | `$#` | dĺžka |
| `:=` | konštanta | `$+` | pridanie (reťaziteľné) |
| `>>` | výstup | `$+[i]` | vloženie na index (1-based) |
| `<<` | vstup | `$-` | odstránenie prvého podľa hodnoty |
| `¶` / `\\` | nový riadok | `$--` | odstránenie všetkých podľa hodnoty |
| `?` | ak | `$-[i]` | odstránenie na indexe (1-based) |
| `_?` | inak-ak | `$-[i..j]` | odstránenie rozsahu (1-based) |
| `_` | inak / vzor | `$?` | obsahuje |
| `??` | zhoda | `$??` | nájdenie všetkých indexov (1-based) |
| `@` | slučka | `$[s..e]` | rez (1-based) |
| `@ N { }` | slučka N krát | `$>` | map |
| `@!` | prerušenie | `$\|` | filter |
| `@>` | pokračuj | `$<` | reduce |
| `@:nazov { }` | označená slučka | `$/ odd` | rozdelenie reťazca |
| `@:nazov!` | prerušenie označenej | `$++ a b c` | zreťazenie |
| `@:nazov>` | pokračuj označenou | `pole[i>j>k]` | navigačný index |
| `->` | lambda | `pole[i] = hod` | aktualizácia prvku (iba polia) |
| `pole[i] += hod` | zložená aktualizácia | `pole[i]$~` | funkčná aktualizácia (nová kópia) |
| `$^+` | triedenie vzostupne (prím.) | `$^-` | triedenie zostupne (prím.) |
| `$^` | triedenie s komparátorom (ntice) | `<~` | návrat |
| `\|>` | rúra | `!?` | pokus |
| `:!` | zachytenie | `:>` | nakoniec |
| `#1` | pravda | `#0` | nepravda |
| `$!` | je chyba | `$!!` | šírenie chyby |
| `<#` | import | `#>` | export |
| `#` | deklarácia modulu | `::` | volanie modulu |
| `.` | prístup k poľu | `#?` | metaúdaje typu |
| `#\|..\|` | parsovanie čísla | `##.` | konverzia na Desatinné |
| `###` | konverzia na Celé (zaokr.) | `##!` | konverzia na Celé (skr.) |
| `#.N\|..\|` | zaokrúhľovanie | `#!N\|..\|` | skrátenie |
| `#,\|..\|` | formát s čiarkami | `#^\|..\|` | vedecká notácia |
| `#d0d9#` | prepnutie číselného režimu | `#09#` | reset na ASCII |
| `<\ ..\>` | spustenie shell | `>\<` | CLI argumenty |
| `\ prem` | explicitné zničenie | `°x` / `x°` | horúca definícia (auto-init) |
| `>>|` | TUI blok (alt. obrazovka) | `>>~` | pozičný výstup |
| `>>!` | vymazanie obrazovky | `>>?` | dopyt na veľkosť terminálu |
| `<<\|` | blokujúca klávesa | `<<\|?` | neblokujúca klávesa |
| `@~ N` | spánok N milisekúnd | `$*` | opakovanie reťazca N krát |

---

## Protokol Zmien

### v0.0.5 — TUI Primitívy, Horúca Definícia a Opakovanie Reťazca _(máj 2026)_

- **Zmena** Oddeľovač vetvy zhody: `vzor : výsledok` → `vzor => výsledok`
- **Zmena** Alias importu: `<# cesta <= alias` → `<# cesta => alias`
- **Zmena** Premenovanie pri exporte: `#> { fn <= pub }` → `#> { fn => pub }`
- **Pridané** TUI blok `>>| { }` — alternatívna obrazovka + surový režim; vyčistí pri ukončení
- **Pridané** Pozičný výstup `>>~ (riadok, stlpec, TPS, fg, bg) > prvky` — riedke sloty, 256-farebný ANSI
- **Pridané** Vstup klávesu `<<| prem` (blokujúce) a `<<|? prem` (neblokujúce dopytovanie)
- **Pridané** `>>!` vymazanie, `>>?` dopyt na veľkosť, `@~ N` spánok N milisekúnd
- **Pridané** Horúca definícia `°x` / `x°` — auto-inicializácia pri prvom použití v slučkách
- **Pridané** Opakovanie reťazca `retazec $* N` — opakuje reťazec N krát
- **VM** Parita: 436/436 testov prechádza

### v0.0.4 — 1-Based Indexovanie, Funkcie Prvej Triedy a Bloky Modulov _(apríl 2026)_

- **Zmena** Celé indexovanie prepnuté na **1-based** — `pole[1]` je prvý prvok; `pole[0]` je chyba
- **Pridané** Pomenované funkcie sú **hodnoty prvej triedy** — odovzdávajte priamo HOF: `cisla$> zdvoj`
- **Pridané** Povinný **blokový syntaktický** tvar modulov: `# nazov { ... }` — plochý tvar odstránený
- **Pridané** Viacrozmerné indexovanie: `pole[i>j>k]` (navigácia), `pole[p ; q]` (ploché extrahovanie)
- **Pridané** Konverzie typov: `##.výr` (Desatinné), `###výr` (Celé zaokr.), `##!výr` (Celé skr.)
- **Pridané** Rozdelenie reťazca: `retazec$/ odd` — vráti `Array(String)`
- **Pridané** Zreťazenie: `zaklad$++ a b c` — pridá viac prvkov
- **Pridané** Slučka N krát: `@ N { }` — opakuje presne N krát
- **Pridané** Syntax označenej slučky: `@:nazov { }`, `@:nazov!`, `@:nazov>` — nahrádza `@ @nazov` / `@! nazov`
- **Pridané** Pravidlá rozsahu premenných: `_nazov` má presný blokový rozsah; `\ prem` zničí skoro
- **Pridané** Vzory porovnania v zhode: `< 0 :`, `> 5 :`, `== 42 :` atď.
- **Pridané** Chyba E013 modulu: spustiteľné príkazy v tele modulu sú zakázané
- **Opravené** `take_variable` už nepoškodzuje konštanty modulu pri spätnom zápise
- **Opravené** `alias.CONST` sa teraz správne rieši; `#>` sa môže objaviť po definíciách funkcií
- **VM** Plná parita: 393/393 testov prechádza

### v0.0.3 — Unicode Číselné Systémy a Vylepšenia LSP _(apríl 2026)_

- **Pridané** 69 blokov číslic Unicode s prepínacím tokenom `#d0d9#`
- **Pridané** Logické literály v ľubovoľnom skripte — `#१` / `#०`, `#١` / `#٠` atď.
- **Pridané** Klingonské číslice pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Pridané** Operačný kód VM `SetNumeralMode` — plná parita s tree-walker
- **Zmena** REPL rešpektuje aktívny číselný režim pri echo a zobrazení premenných
- **Zmena** `>>` výstup pre logické hodnoty teraz obsahuje prefix `#` (`#0` / `#1`) vo všetkých režimoch

### v0.0.2_01 — Premenovanie Operátora _(30 mar 2026)_

- **Zmena** `c|..|` → `#,|..|` a `e|..|` → `#^|..|` — konzistentné s rodinou prefixu `#`
- **Pridané** Alias exportu: opätovný export členov modulu pod iným názvom

### v0.0.2 — Prepracovanie API Kolekcií a Inštalátory _(24 mar 2026)_

- **Pridané** Unifikovaná rodina operátorov `$` pre polia a reťazce (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Pridané** Deštruktúrovanie pre polia, ntice a pomenované ntice
- **Pridané** Záporné indexy (`pole[-1]` = posledný prvok)
- **Pridané** Natívne inštalátory — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 mar 2026)_

- **Pridané** Zložené priradenie `^=`
- **Opravené** Hraničné prípady aritmetiky parsera; opravy dokumentácie

### v0.0.1 — Prvé Verejné Vydanie _(22 mar 2026)_

- Tree-walker interpret + registrový VM (`--vm`, ~4× rýchlejší, ~95% parita)
- Všetky základné konštrukty: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Plné identifikátory Unicode, modulový systém, lambdy, uzávery, spracovanie chýb
- REPL, LSP, rozšírenie VS Code, formátovač (`zymbol fmt`)

---

_Zymbol-Lang — Symbolický. Univerzálny. Nemenný._
