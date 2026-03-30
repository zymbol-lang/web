# Příručka Zymbol-Lang

**Zymbol-Lang** je symbolický programovací jazyk. Nepoužívá klíčová slova — vše je symbol. Funguje stejně v každém lidském jazyce.

- Žádné `if`, `while`, `return` — pouze `?`, `@`, `<~`
- Plná podpora Unicode — identifikátory v libovolném jazyce nebo emoji
- Nezávislý na lidském jazyce — kód je identický v každém jazyce

---

## Proměnné a Konstanty

```zymbol
x = 10              // proměnná — měnitelná
PI := 3.14159       // konstanta — chyba při opětovném přiřazení
jméno = "Alice"
aktivní = #1        // logická pravda
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

## Datové Typy

| Typ | Literál | Tag `#?` | Poznámka |
|-----|---------|----------|----------|
| Int | `42`, `-7` | `###` | 64bitové se znaménkem |
| Float | `3.14`, `1.5e10` | `##.` | Vědecká notace OK |
| String | `"text"` | `##"` | Interpolace: `"Ahoj {jméno}"` |
| Char | `'A'` | `##'` | Jeden znak Unicode |
| Bool | `#1`, `#0` | `##?` | NENÍ číselné — `#1 ≠ 1` |
| Pole | `[1, 2, 3]` | `##]` | Homogenní prvky |
| Tuple | `(a, b)` | `##)` | Poziční |
| Pojmenovaný Tuple | `(x: 1, y: 2)` | `##)` | Pojmenovaná pole |

```zymbol
// Typ introspekce — vrací (typ, čísla, hodnota)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Výstup a Vstup

```zymbol
>> "Ahoj" ¶                      // ¶ nebo \\ pro explicitní nový řádek
>> "a=" a " b=" b ¶               // juxtapozice — více hodnot
>> (arr$#) ¶                      // postfixové operátory vyžadují ( )

<< jméno                          // čtení do proměnné (bez výzvy)
<< "Zadejte jméno: " jméno        // s výzvou
```

> `¶` (AltGr+R na španělské klávesnici) a `\\` jsou ekvivalentní nové řádky.

---

## Operátory

```zymbol
// Aritmetika — používejte přiřazení; některé operátory mají zvláštnosti přímo v >>
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (celočíselné dělení)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (umocnění)

// Porovnání
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Logika
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Řetězce

```zymbol
// Tři formy zřetězení
jméno = "Alice"
n = 42

msg = "Ahoj ", jméno, "!"            // čárka — v přiřazeních
>> "Ahoj " jméno " máš " n ¶         // juxtapozice — v >>
desc = "Ahoj {jméno}, máš {n}"       // interpolace — kdekoliv
```

```zymbol
s = "Ahoj Světe"
len = s$#                  // 10
sub = s$[0..4]             // "Ahoj"  (konec exkluzivní)
has = s$? "Světe"          // #1
části = "a,b,c,d" / ','    // [a, b, c, d]
rep = s$~~["a":"A"]        // nahradit všechny
rep1 = s$~~["a":"A":1]     // nahradit první N
```

> `+` je pouze pro čísla. Pro řetězce použijte `,`, juxtapozici nebo interpolaci.

---

## Řízení Toku

```zymbol
x = 7

? x > 0 { >> "kladné" ¶ }

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

> Složené závorky `{ }` jsou **povinné** i pro jediný příkaz.

---

## Shoda

```zymbol
// Rozsahy
body = 85
hodnocení = ?? body {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> hodnocení ¶    // → B

// Řetězce
barva = "červená"
kód = ?? barva {
    "červená" : "#FF0000"
    "zelená"  : "#00FF00"
    _         : "#000000"
}

// Stráže
teplota = -5
stav = ?? teplota {
    _? teplota < 0  : "led"
    _? teplota < 20 : "chladno"
    _? teplota < 35 : "teplo"
    _               : "horko"
}
>> stav ¶    // → led

// Příkazová forma (blokové větve)
?? n {
    0       : { >> "nula" ¶ }
    _? n < 0: { >> "záporné" ¶ }
    _       : { >> "kladné" ¶ }
}
```

---

## Smyčky

```zymbol
@ i:0..4  { >> i " " }        // rozsah včetně:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // s krokem:        1 3 5 7 9
@ i:5..0:1 { >> i " " }       // pozpátku:        5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

ovoce = ["jablko", "hruška", "hrozno"]
@ f:ovoce { >> f ¶ }          // for-each pole

@ c:"ahoj" { >> c "-" }
>> ¶                          // → a-h-o-j-  (for-each řetězec)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> pokračovat
    ? i > 7 { @! }             // @! přerušit
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Nekonečná smyčka
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Označená smyčka (vnořené přerušení)
count = 0
@ @vnejsi {
    count++
    ? count >= 3 { @! vnejsi }
}
>> count ¶                    // → 3
```

---

## Funkce

```zymbol
přidat(a, b) { <~ a + b }
>> přidat(3, 4) ¶    // → 7

faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120
```

Funkce mají **izolovaný rozsah** — nemohou číst vnější proměnné. Pro změnu proměnných volajícího použijte výstupní parametry `<~`:

```zymbol
vyměnit(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
vyměnit(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Pojmenované funkce nejsou hodnotami první třídy. Pro předání jako argument: `x -> fn(x)`.

---

## Lambdy a Uzávěry

```zymbol
dvojnásobek = x -> x * 2
součet = (a, b) -> a + b
>> dvojnásobek(5) ¶    // → 10
>> součet(3, 7) ¶      // → 10

// Bloková lambda
klasifikovat = x -> {
    ? x > 0 { <~ "kladné" }
    _? x < 0 { <~ "záporné" }
    <~ "nula"
}

// Uzávěr — zachytí vnější rozsah
faktor = 3
trojnásobek = x -> x * faktor
>> trojnásobek(7) ¶    // → 21

// Továrna
make_adder(n) { <~ x -> x + n }
přidat10 = make_adder(10)
>> přidat10(5) ¶    // → 15

// V polích
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Pole

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — přístup (indexování od 0)
arr[-1]         // 5 — záporný index (poslední)
arr$#           // 5 — délka (použijte (arr$#) v >>)

arr = arr$+ 6            // přidat → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // vložit na index 2
arr3 = arr$- 3           // odebrat první výskyt hodnoty
arr4 = arr$-- 3          // odebrat všechny výskyty
arr5 = arr$-[0]          // odebrat na indexu
arr6 = arr$-[1..3]       // odebrat rozsah (konec exkluzivní)

has = arr$? 3            // #1 — obsahuje
pos = arr$?? 3           // [2] — všechny indexy hodnoty
sl = arr$[0..3]          // [1,2,3] — výřez (konec exkluzivní)
sl2 = arr$[0:3]          // [1,2,3] — totéž, syntaxe počtu

asc = arr$^+             // seřazeno vzestupně  (pouze primitiva)
desc = arr$^-            // seřazeno sestupně   (pouze primitiva)

// Tuple pole — použijte $^ s porovnávací lambdou
db = [(jméno: "Carla", věk: 28), (jméno: "Ana", věk: 25), (jméno: "Bob", věk: 30)]
podle_věku  = db$^ (a, b -> a.věk < b.věk)
podle_jméno = db$^ (a, b -> a.jméno > b.jméno)
>> podle_věku[0].jméno ¶     // → Ana
>> podle_jméno[0].jméno ¶    // → Carla

arr[1] = 99              // aktualizovat na místě
arr = arr[1]$~ 99        // funkční aktualizace — vrátí nové pole
```

> Všechny operátory kolekcí vrací **nové pole**. Přiřaďte zpět: `arr = arr$+ 4`.
> Operátory nelze řetězit — použijte mezilehlá přiřazení.
> `$^+` / `$^-` řadí **primitivní pole** (čísla, řetězce). Pro tuple pole použijte `$^` s porovnávací lambdou.

```zymbol
// Vnořená pole
matice = [[1,2,3],[4,5,6],[7,8,9]]
>> matice[1][2] ¶    // → 6
```

---

## Destrukturování

```zymbol
// Pole
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[první, *zbytek] = arr       // první=10  zbytek=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ zahodí

// Poziční tuple
bod = (100, 200)
(px, py) = bod               // px=100  py=200

// Pojmenovaný tuple
osoba = (jméno: "Ana", věk: 25, město: "Madrid")
(jméno: j, věk: v) = osoba  // j="Ana"  v=25
```

---

## Tuple

```zymbol
// Poziční
bod = (10, 20)
>> bod[0] ¶    // → 10

// Pojmenovaný
osoba = (jméno: "Alice", věk: 25)
>> osoba.jméno ¶    // → Alice
>> osoba[0] ¶       // → Alice  (index také funguje)

// Vnořený
pos = (x: 10, y: 20)
p = (pos: pos, popisek: "počátek")
>> p.pos.x ¶        // → 10
```

---

## Funkce Vyššího Řádu

> Operátory FVŘ vyžadují **inline lambdu** — přímé lambda proměnné nefungují.

```zymbol
čísla = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

zdvojené   = čísla$> (x -> x * 2)                // map  → [2,4,6…20]
sudá       = čísla$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
celkem     = čísla$< (0, (acc, x) -> acc + x)     // reduce → 55

// Řetěz přes mezilehlé
krok1 = čísla$| (x -> x > 3)
krok2 = krok1$> (x -> x * x)
>> krok2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Pojmenované funkce ve FVŘ — zabalit do lambdy
zdvojit(x) { <~ x * 2 }
r = čísla$> (x -> zdvojit(x))    // ✅
```

---

## Operátor Roury

Pravá strana vždy vyžaduje `_` jako zástupné místo pro předanou hodnotu:

```zymbol
zdvojit = x -> x * 2
přidat = (a, b) -> a + b
inc = x -> x + 1

5 |> zdvojit(_)       // → 10
10 |> přidat(_, 5)    // → 15
5 |> přidat(2, _)     // → 7

// Řetěz
r = 5 |> zdvojit(_) |> inc(_) |> zdvojit(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Ošetření Chyb

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dělení nulou" ¶
} :! {
    >> "jiné: " _err ¶    // _err drží chybovou zprávu
} :> {
    >> "vždy se spustí" ¶
}
```

| Typ | Kdy |
|-----|-----|
| `##Div` | Dělení nulou |
| `##IO` | Soubor / systém |
| `##Index` | Index mimo rozsah |
| `##Type` | Typová chyba |
| `##Parse` | Parsování dat |
| `##Network` | Síťové chyby |
| `##_` | Jakákoli chyba (catch-all) |

---

## Moduly

```zymbol
// lib/vypocet.zy
# vypocet

#> { přidat, get_PI }    // exporty MUSÍ být před definicemi

_PI := 3.14159
přidat(a, b) { <~ a + b }
get_PI() { <~ _PI }   // getter — přímý přístup ke konstantě přes alias není podporován
```

```zymbol
// main.zy
<# ./lib/vypocet <= v    // alias povinný

>> v::přidat(5, 3) ¶     // → 8
pi = v::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Export pod jiným veřejným jménem
# mojelib
#> { _interní_přidat <= součet }

_interní_přidat(a, b) { <~ a + b }
```

```zymbol
<# ./mojelib <= m

>> m::součet(3, 4) ¶    // → 7  (interní název _interní_přidat je skrytý)
```

---

## Datové Operátory

```zymbol
// Parsovat řetězec na číslo
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (bezpečné selhání, bez chyby)

// Zaokrouhlit / zkrátit
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (zaokrouhlit na 2 desetinná místa)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (zkrátit)

// Formátování čísel
fmt = #,|1234567|  // → 1 234 567  (oddělené mezerou)
sci = #^|12345.678|    // → 1.2345678e4  (vědecký zápis)

// Základní literály
a = 0x41         // → 'A'  (hexadecimální)
b = 0b01000001   // → 'A'  (binární)
c = 0o101        // → 'A'  (osmičkový)

// Výstup s převodem základu
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integrace Shellu

```zymbol
datum = <\ date +%Y-%m-%d \>     // zachytí stdout (včetně \n)
>> "Dnes: " datum

soubor = "data.txt"
obsah = <\ cat {soubor} \>       // interpolace v příkazech

výstup = </"./podskript.zy"/>    // spustit jiný Zymbol skript, zachytit výstup
>> výstup
```

> `><` zachytí argumenty CLI jako pole řetězců (pouze tree-walker).

---

## Úplný Příklad: FizzBuzz

```zymbol
klasifikovat(číslo) {
    ? číslo % 15 == 0 { <~ "FizzBuzz" }
    _? číslo % 3  == 0 { <~ "Fizz" }
    _? číslo % 5  == 0 { <~ "Buzz" }
    _ { <~ číslo }
}

@ i:1..20 { >> klasifikovat(i) ¶ }
```

---

## Referenční Tabulka Symbolů

| Symbol | Operace | Symbol | Operace |
|--------|---------|--------|---------|
| `=` | proměnná | `$#` | délka |
| `:=` | konstanta | `$+` | přidat |
| `>>` | výstup | `$+[i]` | vložit na index |
| `<<` | vstup | `$-` | odebrat první výskyt |
| `¶` / `\\` | nový řádek | `$--` | odebrat všechny výskyty |
| `?` | pokud | `$-[i]` | odebrat na indexu |
| `_?` | jinak-pokud | `$-[i..j]` | odebrat rozsah |
| `_` | jinak / zástupný | `$?` | obsahuje |
| `??` | shoda | `$??` | najít všechny indexy |
| `@` | smyčka | `$[s..e]` | výřez |
| `@!` | přerušení | `$>` | mapování |
| `@>` | pokračování | `$\|` | filtrování |
| `->` | lambda | `$<` | redukce |
| `$^+` | řadit vzestupně (primitiva) | `$^-` | řadit sestupně (primitiva) |
| `$^` | řadit s porovnáním (tuple) | | |
| `<~` | návrat | `!?` | zkusit |
| `\|>` | roura | `:!` | zachytit |
| `#1` | pravda | `:>` | nakonec |
| `#0` | nepravda | `$!` | je chyba |
| `<#` | importovat | `$!!` | propagovat chybu |
| `#` | deklarovat modul | `#>` | exportovat |
| `::` | volání modulu | `.` | přístup k poli |
| `#\|..\|` | parsovat číslo | `#?` | metadata typu |
| `#.N\|..\|` | zaokrouhlit | `#!N\|..\|` | zkrátit |
| `c\|..\|` | formát s oddělovačem | `e\|..\|` | vědecký |
| `<\ ..\>` | spustit shell | `><` | argumenty CLI |

---

*Zymbol-Lang — Symbolický. Univerzální. Neměnný.*

> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> The canonical reference is [MANUAL.md](https://github.com/zymbol-lang/interpreter) in the interpreter repository.
