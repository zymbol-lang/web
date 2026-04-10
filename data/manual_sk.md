# Príručka Zymbol-Lang

**Zymbol-Lang** je symbolický programovací jazyk. Nepoužíva kľúčové slová — všetko je symbol. Funguje rovnako v každom ľudskom jazyku.

- Žiadne `if`, `while`, `return` — iba `?`, `@`, `<~`
- Plná podpora Unicode — identifikátory v ľubovoľnom jazyku alebo emoji
- Nezávislý od ľudského jazyka — kód je identický v každom jazyku

---

## Premenné a Konštanty

```zymbol
x = 10              // premenná — meniteľná
PI := 3.14159       // konštanta — chyba pri opätovnom priradení
meno = "Alice"
aktívny = #1        // logická pravda
👋 := "Ahoj"
```

```zymbol
x = 10
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

## Dátové Typy

| Typ | Literál | Tag `#?` | Poznámka |
|-----|---------|----------|----------|
| Int | `42`, `-7` | `###` | 64-bitové so znakom |
| Float | `3.14`, `1.5e10` | `##.` | Vedecká notácia OK |
| String | `"text"` | `##"` | Interpolácia: `"Ahoj {meno}"` |
| Char | `'A'` | `##'` | Jeden znak Unicode |
| Bool | `#1`, `#0` | `##?` | NIE je číselné — `#1 ≠ 1` |
| Pole | `[1, 2, 3]` | `##]` | Homogénne prvky |
| Tuple | `(a, b)` | `##)` | Pozičné |
| Pomenovaný Tuple | `(x: 1, y: 2)` | `##)` | Pomenované polia |

```zymbol
// Introspekcia typov — vracia (typ, číslice, hodnota)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Výstup a Vstup

```zymbol
>> "Ahoj" ¶                      // ¶ alebo \\ pre explicitný nový riadok
>> "a=" a " b=" b ¶               // juxtapozícia — viac hodnôt
>> (arr$#) ¶                      // postfixové operátory vyžadujú ( )

<< meno                           // čítanie do premennej (bez výzvy)
<< "Zadaj meno: " meno            // s výzvou
```

> `¶` (AltGr+R na španielskej klávesnici) a `\\` sú ekvivalentné nové riadky.

---

## Operátory

```zymbol
// Aritmetika — používaj priradenia; niektoré operátory majú osobitosti priamo v >>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (celočíselné delenie)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (umocnenie)

// Porovnanie
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Logika
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Reťazce

```zymbol
// Tri formy spájania
meno = "Alice"
n = 42

msg = "Ahoj ", meno, "!"            // čiarka — v priradeniach
>> "Ahoj " meno " máš " n ¶         // juxtapozícia — v >>
desc = "Ahoj {meno}, máš {n}"       // interpolácia — kdekoľvek
```

```zymbol
s = "Ahoj Svet"
len = s$#                  // 9
sub = s$[0..4]             // "Ahoj"  (koniec exkluzívny)
has = s$? "Svet"           // #1
časti = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["a":"A"]        // nahradiť všetky
rep1 = s$~~["a":"A":1]     // nahradiť prvé N
```

> `+` je iba pre čísla. Pre reťazce použi `,`, juxtapozíciu alebo interpoláciu.

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

> Zložené závorky `{ }` sú **povinné** aj pre jediný príkaz.

---

## Zhoda

```zymbol
// Rozsahy
body = 85
hodnotenie = ?? body {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> hodnotenie ¶    // → B

// Reťazce
farba = "červená"
kód = ?? farba {
    "červená" : "#FF0000"
    "zelená"  : "#00FF00"
    _         : "#000000"
}

// Strážcovia
teplota = -5
stav = ?? teplota {
    _? teplota < 0  : "ľad"
    _? teplota < 20 : "chladno"
    _? teplota < 35 : "teplo"
    _               : "horúco"
}
>> stav ¶    // → ľad

// Príkazová forma (blokové vetvy)
?? n {
    0       : { >> "nula" ¶ }
    _? n < 0: { >> "záporné" ¶ }
    _       : { >> "kladné" ¶ }
}
```

---

## Slučky

```zymbol
@ i:0..4  { >> i " " }        // rozsah vrátane:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // s krokom:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // opačne:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

ovocie = ["jablko", "hruška", "hrozno"]
@ f:ovocie { >> f ¶ }         // for-each pole

@ c:"ahoj" { >> c "-" }
>> ¶                          // → a-h-o-j-  (for-each reťazec)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> pokračovanie
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
count = 0
@ @vonkajsia {
    count++
    ? count >= 3 { @! vonkajsia }
}
>> count ¶                    // → 3
```

---

## Funkcie

```zymbol
pridať(a, b) { <~ a + b }
>> pridať(3, 4) ¶    // → 7

faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120
```

Funkcie majú **izolovaný rozsah** — nemôžu čítať vonkajšie premenné. Použite výstupné parametre `<~` na zmenu premenných volajúceho:

```zymbol
vymeniť(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
vymeniť(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Pomenované funkcie nie sú hodnotami prvej triedy. Pre predanie ako argument: `x -> fn(x)`.

---

## Lambdy a Uzávery

```zymbol
zdvojený = x -> x * 2
súčet = (a, b) -> a + b
>> zdvojený(5) ¶    // → 10
>> súčet(3, 7) ¶    // → 10

// Bloková lambda
klasifikovať = x -> {
    ? x > 0 { <~ "kladné" }
    _? x < 0 { <~ "záporné" }
    <~ "nula"
}

// Uzáver — zachytí vonkajší rozsah
faktor = 3
strojnásobený = x -> x * faktor
>> strojnásobený(7) ¶    // → 21

// Továreň
make_adder(n) { <~ x -> x + n }
pridať10 = make_adder(10)
>> pridať10(5) ¶    // → 15

// V poliach
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Polia

Polia sú **meniteľné** a obsahujú prvky **rovnakého typu**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — prístup (indexovanie od 0)
arr[-1]         // 5 — záporný index (posledný)
arr$#           // 5 — dĺžka (použite (arr$#) v >>)

arr = arr$+ 6            // pridať → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // vložiť na index 2
arr3 = arr$- 3           // odstrániť prvý výskyt hodnoty
arr4 = arr$-- 3          // odstrániť všetky výskyty
arr5 = arr$-[0]          // odstrániť na indexe
arr6 = arr$-[1..3]       // odstrániť rozsah (koniec exkluzívny)

has = arr$? 3            // #1 — obsahuje
pos = arr$?? 3           // [2] — všetky indexy hodnoty
sl = arr$[0..3]          // [1,2,3] — výrez (koniec exkluzívny)
sl2 = arr$[0:3]          // [1,2,3] — to isté, syntaxe počtu

asc = arr$^+             // zoradené vzostupne  (iba primitívy)
desc = arr$^-            // zoradené zostupne   (iba primitívy)

// Tuple polia — použite $^ s porovnávacou lambdou
db = [(meno: "Carla", vek: 28), (meno: "Ana", vek: 25), (meno: "Bob", vek: 30)]
podľa_veku  = db$^ (a, b -> a.vek < b.vek)
podľa_mena  = db$^ (a, b -> a.meno > b.meno)
>> podľa_veku[0].meno ¶     // → Ana
>> podľa_mena[0].meno ¶     // → Carla

// Priama aktualizácia prvku (iba polia)
arr[1] = 99              // priradiť
arr[0] += 5              // zložené: +=  -=  *=  /=  %=  ^=

// Funkčná aktualizácia — vráti nové pole; originál bez zmien
arr2 = arr[1]$~ 99
```

> Všetky operátory kolekcií vracajú **nové pole**. Priraď späť: `arr = arr$+ 4`.
> Operátory nemôžu byť zreťazené — použi medzipriradenia.
> `$^+` / `$^-` zoraďujú **primitívne polia** (čísla, reťazce). Pre tuple polia použi `$^` s porovnávacou lambdou.

**Hodnotová sémantika** — priradenie poľa do inej premennej vytvorí nezávislú kópiu:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b nie je ovplyvnené
```

```zymbol
// Vnorené polia
matica = [[1,2,3],[4,5,6],[7,8,9]]
>> matica[1][2] ¶    // → 6
```

---

## Destrukturalizácia

```zymbol
// Pole
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[prvý, *zvyšok] = arr        // prvý=10  zvyšok=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ zahodí

// Pozičné tuple
bod = (100, 200)
(px, py) = bod               // px=100  py=200

// Pomenované tuple
osoba = (meno: "Ana", vek: 25, mesto: "Madrid")
(meno: m, vek: v) = osoba   // m="Ana"  v=25
```

---

## Tuple

Tuple sú **nemenné** usporiadané kontajnery, ktoré môžu obsahovať hodnoty **rôznych typov**. Na rozdiel od polí nie je možné prvky po vytvorení meniť.

```zymbol
// Pozičné
bod = (10, 20)
>> bod[0] ¶    // → 10

dáta = (42, "ahoj", #1, 3.14)
>> dáta[2] ¶     // → #1

// Pomenované
osoba = (meno: "Alice", vek: 25)
>> osoba.meno ¶    // → Alice
>> osoba[0] ¶      // → Alice  (index tiež funguje)

// Vnorené
pos = (x: 10, y: 20)
p = (pos: pos, označenie: "počiatok")
>> p.pos.x ¶        // → 10
```

**Nemennosť** — akýkoľvek pokus o zmenu prvku tuple je chybou za behu:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ chyba za behu: tuple sú nemenné
// t[0] += 5    // ❌ rovnaká chyba
```

Na odvodenie zmenenej hodnoty použite `$~` (funkčná aktualizácia) — vráti **nový** tuple:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← originál bez zmien
>> t2 ¶    // → (10, 999, 30)

// Pomenovaný tuple — explicitne prestavať
osoba = (meno: "Alice", vek: 25)
staršia  = (meno: osoba.meno, vek: 26)
>> osoba.vek ¶    // → 25
>> staršia.vek ¶  // → 26
```

---

## Funkcie Vyššieho Rádu

> Operátory FVR vyžadujú **inline lambdu** — priame lambda premenné nefungujú.

```zymbol
čísla = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

zdvojené   = čísla$> (x -> x * 2)                // map  → [2,4,6…20]
párne      = čísla$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
celkom     = čísla$< (0, (acc, x) -> acc + x)     // reduce → 55

// Reťaz cez medzilehlé
krok1 = čísla$| (x -> x > 3)
krok2 = krok1$> (x -> x * x)
>> krok2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Pomenované funkcie vo FVR — zabaliť do lambdy
zdvojiť(x) { <~ x * 2 }
r = čísla$> (x -> zdvojiť(x))    // ✅
```

---

## Operátor Rúry

Pravá strana vždy vyžaduje `_` ako zástupné miesto pre predanú hodnotu:

```zymbol
zdvojiť = x -> x * 2
pridať = (a, b) -> a + b
inc = x -> x + 1

5 |> zdvojiť(_)       // → 10
10 |> pridať(_, 5)    // → 15
5 |> pridať(2, _)     // → 7

// Reťaz
r = 5 |> zdvojiť(_) |> inc(_) |> zdvojiť(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Ošetrenie Chýb

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "delenie nulou" ¶
} :! {
    >> "iné: " _err ¶    // _err drží chybovú správu
} :> {
    >> "vždy sa spustí" ¶
}
```

| Typ | Kedy |
|-----|------|
| `##Div` | Delenie nulou |
| `##IO` | Súbor / systém |
| `##Index` | Index mimo rozsah |
| `##Type` | Typová chyba |
| `##Parse` | Parsovanie dát |
| `##Network` | Sieťové chyby |
| `##_` | Akákoľvek chyba (catch-all) |

---

## Moduly

```zymbol
// lib/vypocet.zy
# vypocet

#> { pridať, get_PI }    // exporty MUSIA byť pred definíciami

_PI := 3.14159
pridať(a, b) { <~ a + b }
get_PI() { <~ _PI }   // getter — priamy prístup ku konštante cez alias nie je podporovaný
```

```zymbol
// main.zy
<# ./lib/vypocet <= v    // alias povinný

>> v::pridať(5, 3) ¶     // → 8
pi = v::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Export pod iným verejným menom
# mojalib
#> { _interné_pridať <= súčet }

_interné_pridať(a, b) { <~ a + b }
```

```zymbol
<# ./mojalib <= m

>> m::súčet(3, 4) ¶    // → 7  (interný názov _interné_pridať je skrytý)
```

---

## Číselné Režimy

Zymbol môže zobrazovať čísla v **69 Unicode číselných písmach** — Dévanágarí, Arabsko-indická, Thajská, Klingon pIqaD, Matematická tučná, LCD segmenty a ďalšie. Aktívny režim ovplyvňuje iba výstup `>>`; interná aritmetika je vždy binárna.

### Aktivácia písma

Zapíšte číslicu `0` a `9` cieľového písma uzavretú do `#…#`:

```zymbol
#०९#    // Dévanágarí      (U+0966–U+096F)
#٠٩#    // Arabsko-indická (U+0660–U+0669)
#๐๙#    // Thajská         (U+0E50–U+0E59)
#09#    // reset na ASCII
```

### Výstup a booleany

```zymbol
x = 42
>> x ¶          // → 42   (ASCII predvolené)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (desatinná bodka vždy ASCII)
>> 1 + 2 ¶      // → ३

// Booleany: predpona # vždy ASCII, číslica sa prispôsobuje
>> #1 ¶         // → #१   (pravda v Dévanágarí)
>> #0 ¶         // → #०   (nepravda — odlišné od ०  celočíselnej nuly)

x = 28 > 4
>> x ¶          // → #१   (výsledok porovnania sleduje aktívny režim)
```

### Natívne číselné literály v zdrojovom kóde

Číslice ľubovoľného podporovaného písma sú platnými literálmi — v rozsahoch, modulo, porovnaniach:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Boolovské literály v ľubovoľnom písme

`#` + číslica `0` alebo `1` z ľubovoľného bloku je platným boolovským literálom:

```zymbol
#٠٩#
نشط = #١        // to isté ako #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` je **vždy ASCII**. `#0` (nepravda) je vždy vizuálne odlišné od `0` (celočíselná nula) v každom písme.

---

## Dátové Operátory

```zymbol
// Parsovať reťazec na číslo
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (bezpečné zlyhanie, bez chyby)

// Zaokrúhliť / skrátiť
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (zaokrúhliť na 2 desatinné miesta)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (skrátiť)

// Formátovanie čísel
fmt = #,|1234567|  // → 1 234 567  (oddelené medzerou)
sci = #^|12345.678|    // → 1.2345678e4  (vedecký zápis)

// Základné literály
a = 0x41         // → 'A'  (šestnástkový)
b = 0b01000001   // → 'A'  (binárny)
c = 0o101        // → 'A'  (osmičkový)

// Výstup s prevodom základu
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integrácia Shellu

```zymbol
dátum = <\ date +%Y-%m-%d \>     // zachytí stdout (vrátane \n)
>> "Dnes: " dátum

súbor = "data.txt"
obsah = <\ cat {súbor} \>        // interpolácia v príkazoch

výstup = </"./podskript.zy"/>    // spustiť iný Zymbol skript, zachytiť výstup
>> výstup
```

> `><` zachytí argumenty CLI ako pole reťazcov (iba tree-walker).

---

## Úplný Príklad: FizzBuzz

```zymbol
klasifikovať(číslo) {
    ? číslo % 15 == 0 { <~ "FizzBuzz" }
    _? číslo % 3  == 0 { <~ "Fizz" }
    _? číslo % 5  == 0 { <~ "Buzz" }
    _ { <~ číslo }
}

@ i:1..20 { >> klasifikovať(i) ¶ }
```

---

## Referenčná Tabuľka Symbolov

| Symbol | Operácia | Symbol | Operácia |
|--------|----------|--------|----------|
| `=` | premenná | `$#` | dĺžka |
| `:=` | konštanta | `$+` | pridať |
| `>>` | výstup | `$+[i]` | vložiť na index |
| `<<` | vstup | `$-` | odstrániť prvý výskyt |
| `¶` / `\\` | nový riadok | `$--` | odstrániť všetky výskyty |
| `?` | ak | `$-[i]` | odstrániť na indexe |
| `_?` | inak-ak | `$-[i..j]` | odstrániť rozsah |
| `_` | inak / zástupný | `$?` | obsahuje |
| `??` | zhoda | `$??` | nájsť všetky indexy |
| `@` | slučka | `$[s..e]` | výrez |
| `@!` | prerušenie | `$>` | mapovanie |
| `@>` | pokračovanie | `$\|` | filtrovanie |
| `->` | lambda | `$<` | redukcia |
| `arr[i] = val` | aktualizovať prvok (iba polia) | `arr[i] += val` | zložená aktualizácia |
| `arr[i]$~` | funkčná aktualizácia (nová kópia) | `$^+` | zoradiť vzostupne (primitívy) |
| `$^-` | zoradiť zostupne (primitívy) | `$^` | zoradiť s porovnaním (tuple) |
| `<~` | návrat | `!?` | skúsiť |
| `\|>` | rúra | `:!` | zachytiť |
| `#1` | pravda | `:>` | nakoniec |
| `#0` | nepravda | `$!` | je chyba |
| `<#` | importovať | `$!!` | propagovať chybu |
| `#` | deklarovať modul | `#>` | exportovať |
| `::` | volanie modulu | `.` | prístup k poľu |
| `#\|..\|` | parsovať číslo | `#?` | metadata typu |
| `#.N\|..\|` | zaokrúhliť | `#!N\|..\|` | skrátiť |
| `#,\|..\|` | formát s oddeľovačom | `#^\|..\|` | vedecký |
| `#d0d9#` | prepínač číselného režimu | `#09#` | reset na ASCII |
| `<\ ..\>` | spustiť shell | `><` | argumenty CLI |

## História Verzií

### v0.0.3 — Unicode Číselné Sústavy & Vylepšenia LSP _(Apríl 2026)_

- **Pridané** 69 Unicode číselných blokov s prepínacím tokenom `#d0d9#`
- **Pridané** Boolovské literály v ľubovoľnom písme — `#१` / `#०`, `#١` / `#٠`, atď.
- **Pridané** Klingon pIqaD číslice (CSUR PUA U+F8F0–U+F8F9)
- **Pridané** VM opkód `SetNumeralMode` — plná parita s tree-walkerom
- **Pridané** REPL rešpektuje aktívny číselný režim pri echu a zobrazení premenných
- **Zmenené** Výstup `>>` booleanov teraz zahŕňa predponu `#` (`#0` / `#1`) vo všetkých režimoch

### v0.0.2_01 — Premenovanie Operátorov _(30 Mar 2026)_

- **Zmenené** `c|..|` → `#,|..|` a `e|..|` → `#^|..|` — konzistentné s rodinou predpôn `#`
- **Pridané** Alias exportu: znovuexportovanie členov modulu pod iným názvom

### v0.0.2 — Redesign API Kolekcií & Inštalátory _(24 Mar 2026)_

- **Pridané** Zjednotená rodina operátorov `$` pre polia a reťazce (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Pridané** Deštruktúrovanie pre polia, n-tice a pomenované n-tice
- **Pridané** Záporné indexy (`arr[-1]` = posledný prvok)
- **Pridané** Natívne inštalátory — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Pridané** Zložené priradenie `^=`
- **Opravené** Hraničné prípady aritmetického parsera; opravy dokumentácie

### v0.0.1 — Prvé Verejné Vydanie _(22 Mar 2026)_

- Tree-walker interpret + registrový VM (`--vm`, ~4× rýchlejší, ~95% parita)
- Všetky základné konštrukty: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Plné Unicode identifikátory, modulový systém, lambdy, uzávery, spracovanie chýb
- REPL, LSP, rozšírenie VS Code, formátovač (`zymbol fmt`)

---

*Zymbol-Lang — Symbolický. Univerzálny. Nemenný.*

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> The canonical reference is [MANUAL.md](https://github.com/zymbol-lang/interpreter) in the interpreter repository.
