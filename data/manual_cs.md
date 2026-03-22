# Kompaktní Příručka Zymbol-Lang

**Zymbol-Lang** je symbolický programovací jazyk. Nepoužívá klíčová slova — vše je symbol. Funguje stejně v každém lidském jazyce.

---

## Filozofie

- Žádná klíčová slova (`pokud`, `smyčka`, `návrat` neexistují — pouze symboly: `?`, `@`, `<~`)
- Plná podpora Unicode — identifikátory v libovolném jazyce nebo emoji 👋
- Nezávislý na lidském jazyce — kód je identický v každém jazyce

---

## Proměnné a Konstanty

```zymbol
x = 10           // proměnná (měnitelná)
PI := 3.14159    // konstanta (neměnná — chyba při opětovném přiřazení)
jméno = "Ana"
aktivní = #1     // logická pravda
👋 := "Ahoj, Česky mluvící světe!"
```

### Složené Přiřazení

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

## Datové Typy

| Typ           | Příklad             | Symbol `#?` | Poznámka                              |
|---------------|---------------------|-------------|---------------------------------------|
| Celé číslo    | `42`, `-7`          | `###`       | 64bitové se znaménkem                 |
| Desetinné     | `3.14`, `1.5e10`    | `##.`       | Vědecká notace OK                     |
| Řetězec       | `"ahoj"`            | `##"`       | Interpolace: `"Ahoj {jméno}"`         |
| Znak          | `'A'`               | `##'`       | Jeden znak Unicode                    |
| Logický       | `#1`, `#0`          | `##?`       | NENÍ číselné 1 a 0                    |
| Pole          | `[1, 2, 3]`         | `##]`       | Všechny prvky musí být stejného typu  |
| Tuple         | `(a, b)`            | `##)`       | Poziční                               |
| Pojmenovaný Tuple | `(x: 1, y: 2)` | `##)`       | Přístup podle názvu nebo indexu       |

---

## Výstup a Vstup

```zymbol
// Výstup — NEPŘIDÁVÁ automaticky nový řádek
>> "Ahoj, Česky mluvící světe!" ¶       // ¶ nebo \\ dává explicitní nový řádek
>> "a=" a " b=" b ¶                      // více hodnot vedle sebe
>> "součet=" add(2, 3) ¶                 // volání funkcí na libovolné pozici
>> (arr$#) ¶                             // postfixové operátory vyžadují závorky

// Vstup
<< jméno                                 // bez výzvy — čte do proměnné
<< "Tvoje jméno? " jméno                 // s výzvou
```

> `¶` nebo `\\` jsou ekvivalentní jako nový řádek.

---

## Zřetězení Řetězců

Tři platné formy — každá pro svůj kontext:

```zymbol
jméno = "Ana"
číslo = 25

// 1. Čárka — v přiřazeních s = nebo :=
zpráva = "Ahoj ", jméno, "!"            // → Ahoj Ana!
TITUL := "Uživatel: ", jméno

// 2. Vedle sebe — ve výstupu >>
>> "Ahoj " jméno " je ti " číslo " let" ¶    // → Ahoj Ana je ti 25 let

// 3. Interpolace — v libovolném kontextu
popis = "Ahoj {jméno}, je ti {číslo} let"    // → Ahoj Ana, je ti 25 let
```

> **Poznámka**: `+` je pouze pro čísla. Použití s řetězci generuje varování.

---

## Řízení Toku

```zymbol
x = 7

// Jednoduché pokud
? x > 0 { >> "kladné" ¶ }

// pokud / jinak-pokud / jinak
? x > 100 {
    >> "velké" ¶
} _? x > 0 {
    >> "kladné" ¶
} _? x == 0 {
    >> "nula" ¶
} _ {
    >> "záporné" ¶
}
```

Bloky `{ }` jsou **povinné** i pro jediný řádek.

---

## Shoda

```zymbol
// Shoda s rozsahy
body = 85
hodnocení = ?? body {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> hodnocení ¶    // → B

// Shoda s podmínkami (libovolné podmínky)
teplota = -5
stav = ?? teplota {
    _? teplota < 0  : "led"
    _? teplota < 20 : "chladno"
    _? teplota < 35 : "teplo"
    _               : "horko"
}
>> stav ¶    // → led

// Shoda s řetězci
barva = "červená"
kód = ?? barva {
    "červená" : "#FF0000"
    "zelená"  : "#00FF00"
    _         : "#000000"
}
>> kód ¶
```

---

## Smyčky

```zymbol
// Včetný rozsah: 0..4 iteruje 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Rozsah s krokem
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Zpětný rozsah
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Smyčka while
číslo = 1
@ číslo <= 64 { číslo *= 2 }
>> číslo ¶    // → 128

// For-each přes pole
ovoce = ["jablko", "hruška", "hrozen"]
@ f:ovoce { >> f ¶ }

// Přes znaky řetězce
@ c:"ahoj" { >> c "-" }
>> ¶    // → a-h-o-j-

// Přerušení a pokračování
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> pokračování
    ? i > 7 { @! }          // @! přerušení
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Funkce

```zymbol
// Deklarace a volání
přidat(a, b) { <~ a + b }
>> přidat(3, 4) ¶    // → 7

// Rekurze
faktor(číslo) {
    ? číslo <= 1 { <~ 1 }
    <~ číslo * faktor(číslo - 1)
}
>> faktor(5) ¶    // → 120

// Funkce mají izolovaný rozsah — bez přístupu k vnějším proměnným
_globální = 100
testovat() {
    x = 42    // pouze lokální
    <~ x
}
>> testovat() ¶    // → 42
```

> **Důležité**: Pojmenované funkce `název(parametry){ }` nejsou hodnotami první třídy.
> Chcete-li předat jako argument, zabalte: `x -> funkce(x)`.

---

## Lambdy a Uzávěry

```zymbol
// Jednoduchá lambda (implicitní návrat)
zdvojený = x -> x * 2
součet = (a, b) -> a + b
>> zdvojený(5) ¶    // → 10
>> součet(3, 7) ¶   // → 10

// Bloková lambda (explicitní návrat)
klasifikuj = x -> {
    ? x > 0 { <~ "kladné" }
    _? x < 0 { <~ "záporné" }
    <~ "nula"
}
>> klasifikuj(5) ¶     // → kladné
>> klasifikuj(0) ¶     // → nula
>> klasifikuj(-5) ¶    // → záporné

// Uzávěry — lambdy zachycují proměnné z vnějšího rozsahu
faktor = 3
ztrojený = x -> x * faktor    // zachycuje 'faktor'
>> ztrojený(7) ¶    // → 21

// Továrna funkcí
vytvořit_přidávač(n) { <~ x -> x + n }
přidat10 = vytvořit_přidávač(10)
>> přidat10(5) ¶    // → 15

// Lambdy jako hodnoty: uložené v polích
operace = [x -> x+1, x -> x*2, x -> x*x]
>> operace[0](5) ¶    // → 6
>> operace[2](5) ¶    // → 25
```

---

## Pole

```zymbol
arr = [10, 20, 30, 40, 50]

// Přístup (index od 0)
>> arr[0] ¶    // → 10

// Délka (vyžaduje závorky v >>)
číslo = arr$#
>> (arr$#) ¶    // → 5

// Přidání, odebrání, obsahuje, výřez
arr = arr$+ 60               // přidání
arr = arr$- 0                // odebrat index 0
je = arr$? 30                // → #1
výřez = arr$[0..2]           // [20, 30]

// Aktualizace prvku
arr[1] = 99

// For-each
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` vrací **nové pole** — přiřaďte zpět: `arr = arr$+ 4`.
> Žádné řetězení: použijte dvě samostatná přiřazení.

---

## Tuple

```zymbol
// Pojmenovaný tuple
osoba = (jméno: "Alice", věk: 25)
>> osoba.jméno ¶    // → Alice
>> osoba.věk ¶      // → 25
>> osoba[0] ¶       // → Alice (index také funguje)
```

---

## Funkce Vyššího Řádu

Operátory HOF vyžadují **inline lambdu** — ne přímou proměnnou lambda.

```zymbol
čísla = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Mapování ($>)
zdvojená = čísla$> (x -> x * 2)
>> zdvojená ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filtrování ($|)
sudá = čísla$| (x -> x % 2 == 0)
>> sudá ¶    // → [2, 4, 6, 8, 10]

// Redukce ($<) — (počáteční hodnota, (acc, prvek) -> výraz)
celkem = čísla$< (0, (acc, x) -> acc + x)
>> celkem ¶    // → 55
```

---

## Ošetření Chyb

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dělení nulou" ¶
} :! ##IO {
    >> "IO chyba" ¶
} :! {
    >> "jiná chyba: " _err ¶
} :> {
    >> "vždy se spustí" ¶
}
```

| Typ         | Kdy nastane              |
|-------------|--------------------------|
| `##Div`     | Dělení nulou              |
| `##IO`      | Soubor / systém           |
| `##Index`   | Index mimo rozsah         |
| `##Type`    | Typová chyba              |
| `##Parse`   | Parsování dat             |
| `##Network` | Síťové chyby              |
| `##_`       | Jakákoli chyba (catch-all)|

---

## Moduly

```zymbol
// Soubor: lib/vypocet.zy
# vypocet

#> { přidat, get_PI }    // exporty PŘED definicemi

_PI := 3.14159
přidat(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Soubor: main.zy
<# ./lib/vypocet <= v    // alias povinný

>> v::přidat(5, 3) ¶    // → 8
pi = v::get_PI()
>> pi ¶                  // → 3.14159
```

---

## Úplný Příklad: FizzBuzz

```zymbol
klasifikuj(číslo) {
    ? číslo % 15 == 0 { <~ "ŠumBzz" }
    _? číslo % 3  == 0 { <~ "Šum" }
    _? číslo % 5  == 0 { <~ "Bzz" }
    _ { <~ číslo }
}

@ i:1..20 { >> klasifikuj(i) ¶ }
```

---

## Referenční Tabulka Symbolů

| Symbol      | Operace              | Symbol      | Operace                |
|-------------|----------------------|-------------|------------------------|
| `=`         | proměnná             | `$#`        | délka                  |
| `:=`        | konstanta            | `$+`        | přidání                |
| `>>`        | výstup               | `$-`        | odebrání (podle indexu)|
| `<<`        | vstup                | `$?`        | obsahuje               |
| `¶`/`\`     | nový řádek           | `$[s..e]`   | výřez                  |
| `?`         | pokud                | `$>`        | mapování               |
| `_?`        | jinak-pokud          | `$\|`       | filtrování             |
| `_`         | jinak / zástupný     | `$<`        | redukce                |
| `??`        | shoda                | `!?`        | pokus                  |
| `@`         | smyčka               | `:!`        | zachycení              |
| `@!`        | přerušení            | `:>`        | nakonec                |
| `@>`        | pokračování          | `$!`        | je chyba               |
| `->`        | lambda               | `$!!`       | propagace chyby        |
| `<~`        | návrat               | `#`         | deklarace modulu       |
| `\|>`       | roura                | `#>`        | export                 |
| `#1`        | pravda               | `<#`        | import                 |
| `#0`        | nepravda             | `::`        | volání modulu          |

---

*Zymbol-Lang — Symbolický. Univerzální. Neměnný.*

---

> **Upozornění:** Tato dokumentace byla vytvořena a přeložena umělou inteligencí (UI). Bylo vynaloženo veškeré úsilí k zajištění přesnosti, ale některé překlady nebo příklady mohou obsahovat chyby. Autoritativní referencí je [specifikace Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI). While every effort has been made to ensure accuracy, some translations or examples may contain errors. The canonical reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
