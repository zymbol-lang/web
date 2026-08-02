> **Upozornenie:** Táto dokumentácia bola vytvorená s pomocou umelej inteligencie (UI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Kanonická referencia je **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** v repozitári interpretera.

---

# Príručka Zymbol-Lang

**Zymbol-Lang** je symbolický programovací jazyk. Nepoužíva kľúčové slová — všetko je symbol. Funguje identicky v každom ľudskom jazyku.

- Žiadne `if`, `while`, `return` — iba `?`, `@`, `<~`
- Plná podpora Unicode — identifikátory v akomkoľvek jazyku alebo emoji
- Nezávislý od ľudského jazyka — kód je všade identický

**Verzia interpretera**: v0.0.4 | **Pokrytie testmi**: 393/393 (TW ↔ VM parita)

---

## Premenné a Konštanty

```zymbol
x = 10              // premenná — meniteľná
PI := 3.14159       // konštanta — opätovné priradenie je chyba za behu
meno = "Alice"
aktivny = #1        // logická pravda
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

| Typ | Literál | Tag `#?` | Poznámky |
|-----|---------|----------|----------|
| Int | `42`, `-7` | `###` | 64-bitové so znamienkom |
| Float | `3.14`, `1.5e10` | `##.` | Vedecká notácia OK |
| String | `"text"` | `##"` | Interpolácia: `"Ahoj {meno}"` |
| Char | `'A'` | `##'` | Jeden znak Unicode |
| Bool | `#1`, `#0` | `##?` | NIE je číselné — `#1 ≠ 1` |
| Pole | `[1, 2, 3]` | `##]` | Homogénne prvky |
| N-tica | `(a, b)` | `##)` | Pozičná |
| Pomenovaná N-tica | `(x: 1, y: 2)` | `##)` | Pomenované polia |
| Funkcia | referencia na pomenovanú funkciu | `##()` | Prvotriedna; zobrazenie `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Prvotriedna; zobrazenie `<lambd/N>` |

```zymbol
// Introspekcia typu — vracia (typ, číslice, hodnota)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Výstup a Vstup

```zymbol
>> "Ahoj" ¶                      // ¶ alebo \\ pre explicitný nový riadok
>> "a=" a " b=" b ¶              // juxtapozícia — viac hodnôt
>> (pol$#) ¶                     // postfixové operátory vyžadujú ( ) v >>

<< meno                          // čítaj do premennej (bez výzvy)
<< "Zadaj meno: " meno           // s výzvou
```

> `¶` (AltGr+R na španielskej klávesnici) a `\\` sú ekvivalentné nové riadky.

---

## Operátory

```zymbol
// Aritmetika — používaj priradenia; niektoré operátory majú zvláštnosti priamo v >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (celočíselné delenie)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (umocňovanie)

// Porovnanie
a == b    // #0
a <> b    // #1
a < b      // #0
a <= b    // #0
a > b      // #1
a >= b     // #1

// Logika
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Reťazce

```zymbol
// Dve formy spájania
meno = "Alice"
n = 42

>> "Ahoj " meno " máš " n ¶         // juxtapozícia — v >>
popis = "Ahoj {meno}, máš {n}"      // interpolácia — všade
```

```zymbol
s = "Vitaj Svet"
dlzka = s$#                  // 10
pod = s$[1..5]               // "Vitaj"  (index od 1, koniec vrátane)
ci = s$? "Svet"              // #1
casti = "a,b,c,d"$/ ','      // [a, b, c, d]  (rozdeliť podľa oddeľovača)
zam = s$~~["a":"A"]          // nahradiť všetky
zam1 = s$~~["a":"A":1]       // nahradiť prvých N
```

> `+` je iba pre čísla. Pre reťazce používaj juxtapozíciu alebo interpoláciu.

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

> Zložené zátvorky `{ }` sú **povinné** aj pre jediný príkaz.

---

## Zhoda

```zymbol
// Rozsahy
body = 85
znamka = ?? body {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> znamka ¶    // → B

// Reťazce
farba = "cervena"
kod = ?? farba {
    "cervena"  : "#FF0000"
    "zelena"   : "#00FF00"
    _          : "#000000"
}

// Vzory porovnania
temp = -5
stav = ?? temp {
    < 0  : "ľad"
    < 20 : "chladno"
    < 35 : "teplo"
    _    : "horúco"
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
@ i:5..0:1 { >> i " " }       // dozadu:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

ovocie = ["jablko", "hruška", "hrozno"]
@ f:ovocie { >> f ¶ }         // for-each pole

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
>> pocitadlo ¶                    // → 3
```

---

## Funkcie

```zymbol
scitaj(a, b) { <~ a + b }
>> scitaj(3, 4) ¶    // → 7

faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120
```

Funkcie majú **izolovaný rozsah** — nemôžu čítať vonkajšie premenné. Používaj výstupné parametre `<~` na zmenu premenných volajúceho:

```zymbol
zamen(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
zamen(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Pomenované funkcie sú **prvotriedne hodnoty** — odovzdávaj priamo: `cisla$> zdvoj`. Obalenie: `x -> fn(x)` je tiež platné.

---

## Lambdy a Uzávery

```zymbol
zdvoj = x -> x * 2
sucet = (a, b) -> a + b
>> zdvoj(5) ¶    // → 10
>> sucet(3, 7) ¶   // → 10

// Bloková lambda
klasifikuj = x -> {
    ? x > 0 { <~ "kladné" }
    _? x < 0 { <~ "záporné" }
    <~ "nula"
}

// Uzáver — zachytáva vonkajší rozsah
koeficient = 3
trojnasobok = x -> x * koeficient
>> trojnasobok(7) ¶    // → 21

// Továreň
make_adder(n) { <~ x -> x + n }
pridaj10 = make_adder(10)
>> pridaj10(5) ¶    // → 15

// V poliach
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Polia

Polia sú **meniteľné** a uchovávajú prvky **rovnakého typu**.

```zymbol
pol = [1, 2, 3, 4, 5]

pol[1]          // 1 — prístup (index od 1: prvý prvok)
pol[-1]         // 5 — záporný index (posledný prvok)
pol$#           // 5 — dĺžka (používaj (pol$#) v >>)

pol = pol$+ 6            // pridaj → [1,2,3,4,5,6]
pol2 = pol$+[2] 99       // vlož na pozíciu 2 (index od 1)
pol3 = pol$- 3           // odober prvý výskyt hodnoty
pol4 = pol$-- 3          // odober všetky výskyty
pol5 = pol$-[1]          // odober na indexe 1 (prvý prvok)
pol6 = pol$-[2..3]       // odober rozsah (index od 1, koniec vrátane)

ci = pol$? 3             // #1 — obsahuje
poz = pol$?? 3           // [3] — všetky indexy hodnoty (index od 1)
vyrez = pol$[1..3]       // [1,2,3] — výrez (index od 1, koniec vrátane)
vyrez2 = pol$[1:3]       // [1,2,3] — rovnaké, syntaxa počítania

vzost = pol$^+           // zoradené vzostupne  (iba primitívy)
zostup = pol$^-          // zoradené zostupne   (iba primitívy)

// Polia n-tíc — používaj $^ s komparátorovkou lambdou
db = [(meno: "Carla", vek: 28), (meno: "Ana", vek: 25), (meno: "Bob", vek: 30)]
podla_veku  = db$^ (a, b -> a.vek < b.vek)
podla_mena  = db$^ (a, b -> a.meno > b.meno)
>> podla_veku[1].meno ¶     // → Ana
>> podla_mena[1].meno ¶     // → Carla

// Priama aktualizácia prvku (iba polia)
pol[1] = 99              // priraď
pol[2] += 5              // zložené: +=  -=  *=  /=  %=  ^=

// Funkcionálna aktualizácia — vracia nové pole; originál nezmenený
pol2 = pol[2]$~ 99
```

> Všetky operátory kolekcií vracajú **nové pole**. Priraď späť: `pol = pol$+ 4`.
> `$^+` / `$^-` triedia **polia primitívov** (čísla, reťazce). Pre polia n-tíc používaj `$^` s komparátorovkou lambdou.
> **Indexovanie od 1**: `pol[1]` je prvý prvok; `pol[0]` je chyba za behu.

**Hodnotová sémantika** — priradením poľa do inej premennej vzniká nezávislá kópia:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b nie je dotknuté
```

```zymbol
// Vnorené polia (indexovanie od 1)
matica = [[1,2,3],[4,5,6],[7,8,9]]
>> matica[2][3] ¶    // → 6  (riadok 2, stĺpec 3)
```

---

## Deštruktúra

```zymbol
// Pole
pol = [10, 20, 30, 40, 50]
[a, b, c] = pol              // a=10  b=20  c=30
[prvy, *zvysok] = pol        // prvy=10  zvysok=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ zahodí

// Pozičná n-tica
bod = (100, 200)
(px, py) = bod               // px=100  py=200

// Pomenovaná n-tica
osoba = (meno: "Ana", vek: 25, mesto: "Madrid")
(meno: m, vek: v) = osoba    // m="Ana"  v=25
```

---

## N-tice

N-tice sú **nemeniteľné** usporiadané kontajnery, ktoré môžu uchovávať hodnoty **rôznych typov**. Na rozdiel od polí nie je možné prvky po vytvorení meniť.

```zymbol
// Pozičná — povolené zmiešané typy
bod = (10, 20)
>> bod[1] ¶    // → 10

data = (42, "hello", #1, 3.14)
>> data[3] ¶     // → #1

// Pomenovaná
osoba = (meno: "Alice", vek: 25)
>> osoba.meno ¶    // → Alice
>> osoba[1] ¶      // → Alice  (index tiež funguje, od 1)

// Vnorená
poz = (x: 10, y: 20)
p = (poz: poz, navestie: "zaciatok")
>> p.poz.x ¶        // → 10
```

**Nemeniteľnosť** — akýkoľvek pokus o zmenu prvku n-tice je chyba za behu:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ chyba za behu: n-tice sú nemeniteľné
// t[1] += 5    // ❌ rovnaká chyba
```

Na odvodenie zmenenej hodnoty použij `$~` (funkcionálna aktualizácia) — vracia **novú** n-ticu:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← originál nezmenený
>> t2 ¶    // → (10, 999, 30)

// Pomenovaná n-tica — zrekonštruuj explicitne
osoba = (meno: "Alice", vek: 25)
starsia  = (meno: osoba.meno, vek: 26)
>> osoba.vek ¶    // → 25
>> starsia.vek ¶  // → 26
```

---

## Funkcie Vyššieho Rádu

```zymbol
cisla = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

zdvojene   = cisla$> (x -> x * 2)                // map  → [2,4,6…20]
paarne     = cisla$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
spolu      = cisla$< (0, (acc, x) -> acc + x)     // redukcia → 55

// Reťaz cez medzipremennné
krok1 = cisla$| (x -> x > 3)
krok2 = krok1$> (x -> x * x)
>> krok2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Pomenované funkcie možno odovzdávať priamo do FVR
zdvoj(x) { <~ x * 2 }
je_velke(x) { <~ x > 5 }
r = cisla$> zdvoj       // ✅ priama referencia
r = cisla$| je_velke    // ✅ priama referencia
```

---

## Operátor Rúry

Pravá strana vždy vyžaduje `_` ako zástupný symbol pre prenášanú hodnotu:

```zymbol
zdvoj = x -> x * 2
scitaj = (a, b) -> a + b
inc = x -> x + 1

5 |> zdvoj(_)        // → 10
10 |> scitaj(_, 5)   // → 15
5 |> scitaj(2, _)    // → 7

// Reťaz
r = 5 |> zdvoj(_) |> inc(_) |> zdvoj(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Obsluha Chýb

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "delenie nulou" ¶
} :! {
    >> "ostatné: " _err ¶    // _err obsahuje správu chyby
} :> {
    >> "vždy sa spustí" ¶
}
```

| Typ | Kedy |
|-----|------|
| `##Div` | Delenie nulou |
| `##IO` | Súbor / systém |
| `##Index` | Index mimo rozsah |
| `##Type` | Nezhoda typov |
| `##Parse` | Spracovanie dát |
| `##Network` | Sieťové chyby |
| `##_` | Akákoľvek chyba (catch-all) |

---

## Moduly

```zymbol
// lib/vypocty.zy — telo modulu je uzavreté v zložených zátvorkách
# vypocty {
    #> { scitaj, get_PI }

    _PI := 3.14159
    scitaj(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/vypocty <= v    // alias je povinný

>> v::scitaj(5, 3) ¶     // → 8
pi = v::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Export pod iným verejným menom
# mojalib {
    #> { _intern_scitaj <= sucet }

    _intern_scitaj(a, b) { <~ a + b }
}
```

```zymbol
<# ./mojalib <= m

>> m::sucet(3, 4) ¶    // → 7  (interné meno _intern_scitaj je skryté)
```

> **Pravidlá modulu**: iba `#>`, definície funkcií a inicializátory doslovných premenných/konštánt sú povolené vnútri `# name { }`. Spustiteľné príkazy (`>>`, `<<`, slučky atď.) spôsobujú chybu E013.

---

## Číselné Systémy

Zymbol môže zobrazovať čísla v **69 blokoch číslic Unicode** — Dévanágarí, Arabsko-Indický, Thajský, Klingon pIqaD, matematicky tučný, LCD číslice a ďalšie. Aktívny režim ovplyvňuje iba výstup `>>`; interná aritmetika je vždy binárna.

### Aktivácia systému

Zapíš číslice `0` a `9` cieľového písma medzi `#…#`:

```zymbol
#०९#    // Dévanágarí    (U+0966–U+096F)
#٠٩#    // Arabsko-Indický (U+0660–U+0669)
#๐๙#    // Thajský       (U+0E50–U+0E59)
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

// Logické hodnoty: predpona # vždy ASCII, číslica sa prispôsobuje
>> #1 ¶         // → #१   (pravda v Dévanágarí)
>> #0 ¶         // → #०   (nepravda — odlišné od ०  celočíselnej nuly)

x = 28 > 4
>> x ¶          // → #१   (výsledok porovnania sleduje aktívny režim)
```

### Natívne číslicové literály v zdrojovom kóde

Číslice ľubovoľného podporovaného systému sú platné literály — v rozsahoch, modulo, porovnaniach:

```zymbol
#٠٩#

@ i:١..١٥ {
    ? i % ١٥ == ٠ { >> "FizzBuzz" ¶ }
    _? i % ٣  == ٠ { >> "Fizz" ¶ }
    _? i % ٥  == ٠ { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Logické literály v ľubovoľnom systéme

`#` + číslica `0` alebo `1` z ľubovoľného podporovaného bloku je platný logický literál:

```zymbol
#٠٩#
aktivny = #١        // rovnaké ako #1
>> aktivny ¶        // → #١
>> (#١ && #٠) ¶     // → #٠
```

> `#` je **vždy ASCII**. `#0` (nepravda) je vždy vizuálne odlišné od `0` (celočíselná nula) v každom systéme.

---

## Dátové Operátory

```zymbol
// Pretypovanie typov
##.42         // → 42.0  (na Float)
###3.7        // → 4     (na Int, zaokrúhlenie)
##!3.7        // → 3     (na Int, skrátenie)

// Parsovanie reťazca na číslo
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (bezpečné zlyhanie, bez chyby)

// Zaokrúhlenie / skrátenie
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (zaokrúhli na 2 desatinné miesta)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (skráti)

// Formátovanie čísel
fmt = #,|1234567|  // → 1,234,567  (oddelené čiarkami)
sci = #^|12345.678|    // → 1.2345678e4  (vedecký zápis)

// Literály v rôznych základoch
a = 0x41         // → 'A'  (šestnástkový)
b = 0b01000001   // → 'A'  (binárny)
c = 0o101        // → 'A'  (osmičkový)

// Výstup s konverziou základu
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integrácia so Shelom

```zymbol
datum = <\ date +%Y-%m-%d \>      // zachytáva stdout (obsahuje \n)
>> "Dnes: " datum

subor = "data.txt"
obsah = <\ cat {subor} \>         // interpolácia v príkazoch

vysledok = </"./podskript.zy"/>   // spusti iný skript Zymbol, zachytáva výstup
>> vysledok
```

> `>\<` zachytáva argumenty CLI ako pole reťazcov (iba tree-walker).

---

## Úplný Príklad: FizzBuzz

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
| `:=` | konštanta | `$+` | pridaj (reťaziteľné) |
| `>>` | výstup | `$+[i]` | vlož na index (od 1) |
| `<<` | vstup | `$-` | odober prvý podľa hodnoty |
| `¶` / `\\` | nový riadok | `$--` | odober všetky podľa hodnoty |
| `?` | ak | `$-[i]` | odober na indexe (od 1) |
| `_?` | inak-ak | `$-[i..j]` | odober rozsah (od 1) |
| `_` | inak / zástupný znak | `$?` | obsahuje |
| `??` | zhoda | `$??` | nájdi všetky indexy (od 1) |
| `@` | slučka | `$[s..e]` | výrez (od 1) |
| `@ N { }` | slučka N krát | `$>` | mapovanie |
| `@!` | prerušenie | `$\|` | filtrovanie |
| `@>` | pokračovanie | `$<` | redukcia |
| `@:name { }` | označená slučka | `$/ delim` | rozdeliť reťazec |
| `@:name!` | prerušenie s návestím | `$++ a b c` | zostaviť zreťazenie |
| `@:name>` | pokračovanie s návestím | `pol[i>j>k]` | navigačný index |
| `->` | lambda | `pol[i] = val` | aktualizuj prvok (iba polia) |
| `pol[i] += val` | zložená aktualizácia | `pol[i]$~` | funkcionálna aktualizácia (nová kópia) |
| `$^+` | zoradiť vzostupne (primitívy) | `$^-` | zoradiť zostupne (primitívy) |
| `$^` | zoradiť s komparátorom (n-tice) | `<~` | vráť |
| `\|>` | rúra | `!?` | skús |
| `:!` | zachyť | `:>` | nakoniec |
| `#1` | pravda | `#0` | nepravda |
| `$!` | je chyba | `$!!` | propaguj chybu |
| `<#` | importuj | `#>` | exportuj |
| `#` | deklaruj modul | `::` | volanie modulu |
| `.` | prístup k poľu | `#?` | metaúdaje typu |
| `#\|..\|` | parsuj číslo | `##.` | pretypuj na Float |
| `###` | pretypuj na Int (zaokrúhlenie) | `##!` | pretypuj na Int (skrátenie) |
| `#.N\|..\|` | zaokrúhli | `#!N\|..\|` | skráti |
| `#,\|..\|` | formát s čiarkami | `#^\|..\|` | vedecký |
| `#d0d9#` | prepínač číselného režimu | `#09#` | reset na ASCII |
| `<\ ..\>` | spusti shell | `>\<` | argumenty CLI |
| `\ var` | zničiť premennú | | |

---

## História Verzií

### v0.0.4 — Indexovanie od 1, Prvotriedne Funkcie a Blokové Moduly _(apríl 2026)_

- **Zmena** Všetko indexovanie prepnuté na **od 1** — `pol[1]` je prvý prvok; `pol[0]` je chyba za behu
- **Pridané** Pomenované funkcie sú **prvotriedne hodnoty** — odovzdávaj priamo do FVR: `cisla$> zdvoj`
- **Pridané** Vyžadovaná **bloková syntax** modulu: `# name { ... }` — plochá syntax odstránená
- **Pridané** Viacrozmerné indexovanie: `pol[i>j>k]` (navigácia), `pol[p ; q]` (plochá extrakcia)
- **Pridané** Pretypovanie typov: `##.expr` (Float), `###expr` (Int zaokrúhlenie), `##!expr` (Int skrátenie)
- **Pridané** Rozdelenie reťazca: `str$/ delim` — vracia `Array(String)`
- **Pridané** Zostavenie zreťazenia: `base$++ a b c` — pripojí viac položiek
- **Pridané** Slučka N krát: `@ N { }` — opakuj presne N krát
- **Pridané** Syntax označenej slučky: `@:name { }`, `@:name!`, `@:name>` — nahrádza `@ @name` / `@! name`
- **Pridané** Pravidlá rozsahu premenných: premenné `_name` majú presný rozsah bloku; `\ var` zničí skôr
- **Pridané** Vzory porovnania v zhode: `< 0 :`, `> 5 :`, `== 42 :` atď.
- **Pridané** Chyba E013 modulu: spustiteľné príkazy v tele modulu sú zakázané
- **Opravené** `take_variable` už nepoškodzuje konštanty modulu pri spätnom zápise
- **Opravené** `alias.CONST` sa teraz správne rozlišuje; `#>` môže sa objaviť po definíciách funkcií
- **VM** Plná parita: 393/393 testov prechádza

### v0.0.3 — Číselné Systémy Unicode a Vylepšenia LSP _(apríl 2026)_

- **Pridané** 69 blokov číslic Unicode s prepínacím tokenom `#d0d9#`
- **Pridané** Logické literály v ľubovoľnom systéme — `#१` / `#०`, `#١` / `#٠` atď.
- **Pridané** Číslice Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Pridané** VM Opcode `SetNumeralMode` — plná parita s tree-walker
- **Pridané** REPL rešpektuje aktívny číselný režim v echo a zobrazovaní premenných
- **Zmenené** Booleovský výstup `>>` teraz obsahuje predponu `#` (`#0` / `#1`) vo všetkých režimoch

### v0.0.2_01 — Premenovanie Operátorov _(30. mar. 2026)_

- **Zmenené** `c|..|` → `#,|..|` a `e|..|` → `#^|..|` — konzistentné s rodinou predpôn `#`
- **Pridané** Alias exportu: opätovný export členov modulu pod iným menom

### v0.0.2 — Prepracovanie Kolekcií a Inštalátory _(24. mar. 2026)_

- **Pridané** Zjednotená rodina operátorov `$` pre polia a reťazce (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Pridané** Deštruktúra pre polia, n-tice a pomenované n-tice
- **Pridané** Záporné indexy (`pol[-1]` = posledný prvok)
- **Pridané** Natívne inštalátory — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25. mar. 2026)_

- **Pridané** Zložené priradenie `^=`
- **Opravené** Hraničné prípady aritmetiky parsera; opravy dokumentácie

### v0.0.1 — Prvé Verejné Vydanie _(22. mar. 2026)_

- Interpreter tree-walker + registrový VM (`--vm`, ~4× rýchlejší, ~95% parita)
- Všetky základné konštrukcie: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Plné identifikátory Unicode, systém modulov, lambdy, uzávery, obsluha chýb
- REPL, LSP, rozšírenie VS Code, formátovač (`zymbol fmt`)

---

_Zymbol-Lang — Symbolický. Univerzálny. Nemeniteľný._
