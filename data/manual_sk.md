# Kompaktná Príručka Zymbol-Lang

**Zymbol-Lang** je symbolický programovací jazyk. Nepoužíva kľúčové slová — všetko je symbol. Funguje rovnako v každom ľudskom jazyku.

---

## Filozofia

- Žiadne kľúčové slová (`ak`, `slučka`, `návrat` neexistujú — iba symboly: `?`, `@`, `<~`)
- Plná podpora Unicode — identifikátory v ľubovoľnom jazyku alebo emoji 👋
- Nezávislý od ľudského jazyka — kód je identický v každom jazyku

---

## Premenné a Konštanty

```zymbol
x = 10           // premenná (meniteľná)
PI := 3.14159    // konštanta (nemenná — chyba pri opätovnom priradení)
meno = "Ana"
aktívny = #1     // logická pravda
👋 := "Ahoj, Slovenský svet!"
```

### Zložené Priradenie

```zymbol
x = 10    // 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 4    // 6
x %=  4   // 2
x++       // 3
x--       // 2
```

---

## Dátové Typy

| Typ              | Príklad             | Symbol `#?` | Poznámka                              |
|------------------|---------------------|-------------|---------------------------------------|
| Celé číslo       | `42`, `-7`          | `###`       | 64-bitové so znakom                   |
| Desatinné číslo  | `3.14`, `1.5e10`    | `##.`       | Vedecká notácia OK                    |
| Reťazec          | `"ahoj"`            | `##"`       | Interpolácia: `"Ahoj {meno}"`         |
| Znak             | `'A'`               | `##'`       | Jeden znak Unicode                    |
| Logický          | `#1`, `#0`          | `##?`       | NIE je číselné 1 a 0                  |
| Pole             | `[1, 2, 3]`         | `##]`       | Všetky prvky musia byť rovnakého typu |
| Tuple            | `(a, b)`            | `##)`       | Pozičné                               |
| Pomenovaný Tuple | `(x: 1, y: 2)`      | `##)`       | Prístup podľa mena alebo indexu       |

---

## Výstup a Vstup

```zymbol
// Výstup — NEPRIDÁVA automaticky nový riadok
>> "Ahoj, Slovenský svet!" ¶             // ¶ alebo \\ dáva explicitný nový riadok
>> "a=" a " b=" b ¶                       // viaceré hodnoty vedľa seba
>> "súčet=" add(2, 3) ¶                   // volania funkcií na ľubovoľnej pozícii
>> (arr$#) ¶                              // postfixové operátory vyžadujú závorky

// Vstup
<< meno                                   // bez výzvy — číta do premennej
<< "Tvoje meno? " meno                    // s výzvou
```

> `¶` alebo `\\` sú ekvivalentné ako nový riadok.

---

## Zreťazenie Reťazcov

Tri platné formy — každá pre svoj kontext:

```zymbol
meno = "Ana"
číslo = 25

// 1. Čiarka — v priradeniach s = alebo :=
správa = "Ahoj ", meno, "!"              // → Ahoj Ana!
TITUL := "Používateľ: ", meno

// 2. Vedľa seba — vo výstupe >>
>> "Ahoj " meno " máš " číslo " rokov" ¶    // → Ahoj Ana máš 25 rokov

// 3. Interpolácia — v ľubovoľnom kontexte
popis = "Ahoj {meno}, máš {číslo} rokov"    // → Ahoj Ana, máš 25 rokov
```

> **Poznámka**: `+` je iba pre čísla. Používanie s reťazcami generuje varovanie.

---

## Riadenie Toku

```zymbol
x = 7

// Jednoduché ak
? x > 0 { >> "kladné" ¶ }

// ak / inak-ak / inak
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

Bloky `{ }` sú **povinné** aj pre jediný riadok.

---

## Zhoda

```zymbol
// Zhoda s rozsahmi
body = 85
hodnotenie = ?? body {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> hodnotenie ¶    // → B

// Zhoda s podmienkami (ľubovoľné podmienky)
teplota = -5
stav = ?? teplota {
    _? teplota < 0  : "ľad"
    _? teplota < 20 : "zima"
    _? teplota < 35 : "teplo"
    _               : "horúco"
}
>> stav ¶    // → ľad

// Zhoda s reťazcami
farba = "červená"
kód = ?? farba {
    "červená" : "#FF0000"
    "zelená"  : "#00FF00"
    _         : "#000000"
}
>> kód ¶
```

---

## Slučky

```zymbol
// Vrátane rozsah: 0..4 iteruje 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Rozsah s krokom
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Spätný rozsah
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Slučka while
číslo = 1
@ číslo <= 64 { číslo *= 2 }
>> číslo ¶    // → 128

// For-each cez pole
ovocie = ["jablko", "hruška", "hrozno"]
@ f:ovocie { >> f ¶ }

// Cez znaky reťazca
@ c:"ahoj" { >> c "-" }
>> ¶    // → a-h-o-j-

// Prerušenie a pokračovanie
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> pokračovanie
    ? i > 7 { @! }          // @! prerušenie
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funkcie

```zymbol
// Deklarácia a volanie
pridať(a, b) { <~ a + b }
>> pridať(3, 4) ¶    // → 7

// Rekurzia
faktor(číslo) {
    ? číslo <= 1 { <~ 1 }
    <~ číslo * faktor(číslo - 1)
}
>> faktor(5) ¶    // → 120

// Funkcie majú izolovaný rozsah — bez prístupu k vonkajším premenným
_globálny = 100
testovať() {
    x = 42    // iba lokálne
    <~ x
}
>> testovať() ¶    // → 42
```

> **Dôležité**: Pomenované funkcie `meno(parametre){ }` nie sú hodnotami prvej triedy.
> Na odovzdanie ako argument ich zabaľte: `x -> funkcia(x)`.

---

## Lambdy a Uzávery

```zymbol
// Jednoduchá lambda (implicitný návrat)
zdvojený = x -> x * 2
súčet = (a, b) -> a + b
>> zdvojený(5) ¶    // → 10
>> súčet(3, 7) ¶    // → 10

// Bloková lambda (explicitný návrat)
klasifikuj = x -> {
    ? x > 0 { <~ "kladné" }
    _? x < 0 { <~ "záporné" }
    <~ "nula"
}
>> klasifikuj(5) ¶     // → kladné
>> klasifikuj(0) ¶     // → nula
>> klasifikuj(-5) ¶    // → záporné

// Uzávery — lambdy zachytávajú premenné z vonkajšieho rozsahu
faktor = 3
strojnásobený = x -> x * faktor    // zachytáva 'faktor'
>> strojnásobený(7) ¶    // → 21

// Továreň funkcií
vytvoriť_pridávač(n) { <~ x -> x + n }
pridať10 = vytvoriť_pridávač(10)
>> pridať10(5) ¶    // → 15

// Lambdy ako hodnoty: uložené v poliach
operácie = [x -> x+1, x -> x*2, x -> x*x]
>> operácie[0](5) ¶    // → 6
>> operácie[2](5) ¶    // → 25
```

---

## Polia

```zymbol
arr = [10, 20, 30, 40, 50]

// Prístup (index od 0)
>> arr[0] ¶    // → 10

// Dĺžka (vyžaduje závorky v >>)
číslo = arr$#
>> (arr$#) ¶    // → 5

// Pridanie, odobranie, obsahuje, výrez
arr = arr$+ 60               // pridanie
arr = arr$- 0                // odober index 0
je = arr$? 30                // → #1
výrez = arr$[0..2]           // [20, 30]

// Aktualizácia prvku
arr[1] = 99

// For-each
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` vracajú **nové pole** — priraď späť: `arr = arr$+ 4`.
> Bez reťazenia: použi dve samostatné priradenia.

---

## Tuple

```zymbol
// Pomenovaný tuple
osoba = (meno: "Alice", vek: 25)
>> osoba.meno ¶    // → Alice
>> osoba.vek ¶     // → 25
>> osoba[0] ¶      // → Alice (index tiež funguje)
```

---

## Funkcie Vyššieho Rádu

Operátory HOF vyžadujú **inline lambdu** — nie priamu premennú lambda.

```zymbol
čísla = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Mapovanie ($>)
zdvojené = čísla$> (x -> x * 2)
>> zdvojené ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filtrovanie ($|)
párne = čísla$| (x -> x % 2 == 0)
>> párne ¶    // → [2, 4, 6, 8, 10]

// Redukcia ($<) — (počiatočná hodnota, (acc, prvok) -> výraz)
spolu = čísla$< (0, (acc, x) -> acc + x)
>> spolu ¶    // → 55
```

---

## Ošetrenie Chýb

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "delenie nulou" ¶
} :! ##IO {
    >> "IO chyba" ¶
} :! {
    >> "iná chyba: " _err ¶
} :> {
    >> "vždy sa spustí" ¶
}
```

| Typ         | Kedy nastane              |
|-------------|---------------------------|
| `##Div`     | Delenie nulou              |
| `##IO`      | Súbor / systém             |
| `##Index`   | Index mimo rozsah          |
| `##Type`    | Typová chyba               |
| `##Parse`   | Parsovanie dát             |
| `##Network` | Sieťové chyby              |
| `##_`       | Akákoľvek chyba (catch-all)|

---

## Moduly

```zymbol
// Súbor: lib/vypocet.zy
# vypocet

#> { pridať, get_PI }    // exporty PRED definíciami

_PI := 3.14159
pridať(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Súbor: main.zy
<# ./lib/vypocet <= v    // alias povinný

>> v::pridať(5, 3) ¶    // → 8
pi = v::get_PI()
>> pi ¶                  // → 3.14159
```

---

## Úplný Príklad: FizzBuzz

```zymbol
klasifikuj(číslo) {
    ? číslo % 15 == 0 { <~ "PenaBzz" }
    _? číslo % 3  == 0 { <~ "Pena" }
    _? číslo % 5  == 0 { <~ "Bzz" }
    _ { <~ číslo }
}

@ i:1..20 { >> klasifikuj(i) ¶ }
```

---

## Referenčná Tabuľka Symbolov

| Symbol      | Operácia             | Symbol      | Operácia               |
|-------------|----------------------|-------------|------------------------|
| `=`         | premenná             | `$#`        | dĺžka                  |
| `:=`        | konštanta            | `$+`        | pridanie               |
| `>>`        | výstup               | `$-`        | odobranie (podľa indexu)|
| `<<`        | vstup                | `$?`        | obsahuje               |
| `¶`/`\`     | nový riadok          | `$[s..e]`   | výrez                  |
| `?`         | ak                   | `$>`        | mapovanie              |
| `_?`        | inak-ak              | `$\|`       | filtrovanie            |
| `_`         | inak / zástupný      | `$<`        | redukcia               |
| `??`        | zhoda                | `!?`        | pokus                  |
| `@`         | slučka               | `:!`        | zachytenie             |
| `@!`        | prerušenie           | `:>`        | nakoniec               |
| `@>`        | pokračovanie         | `$!`        | je chyba               |
| `->`        | lambda               | `$!!`       | šírenie chyby          |
| `<~`        | návrat               | `#`         | deklarácia modulu      |
| `\|>`       | rúra                 | `#>`        | export                 |
| `#1`        | pravda               | `<#`        | import                 |
| `#0`        | nepravda             | `::`        | volanie modulu         |

---

*Zymbol-Lang — Symbolický. Univerzálny. Nemenný.*

---

> **Upozornenie:** Táto dokumentácia bola vytvorená a preložená umelou inteligenciou (UI). Bolo vynaložené všetko úsilie na zabezpečenie presnosti, ale niektoré preklady alebo príklady môžu obsahovať chyby. Autoritatívnou referenciou je [špecifikácia Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI). While every effort has been made to ensure accuracy, some translations or examples may contain errors. The canonical reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
