> **Upozornění:** Tato dokumentace byla vytvořena a přeložena umělou inteligencí (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Kanonická reference je **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** v repozitáři interpretru.

---

# Příručka Zymbol-Lang

**Zymbol-Lang** je symbolický programovací jazyk. Žádná klíčová slova — vše je symbol. Funguje stejně v každém lidském jazyce.

- Žádné `if`, `while`, `return` — pouze `?`, `@`, `<~`
- Plná podpora Unicode — identifikátory v libovolném jazyce nebo emoji
- Nezávislý na lidském jazyce — kód je identický v každém jazyce

**Verze interpretru**: v0.0.4 | **Pokrytí testy**: 393/393 (TW ↔ VM parita)

---

## Proměnné a Konstanty

```zymbol
x = 10              // měnitelná proměnná
PI := 3.14159       // konstanta — opětovné přiřazení je chyba za běhu
jméno = "Alžběta"
aktivní = #1        // booleovská pravda
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

---

## Datové Typy

| Typ | Literál | Tag `#?` | Poznámky |
|-----|---------|----------|----------|
| Int | `42`, `-7` | `###` | 64bitové se znaménkem |
| Float | `3.14`, `1.5e10` | `##.` | Vědecká notace OK |
| String | `"text"` | `##"` | Interpolace: `"Ahoj {jméno}"` |
| Char | `'A'` | `##'` | Jeden znak Unicode |
| Bool | `#1`, `#0` | `##?` | NENÍ číselné — `#1 ≠ 1` |
| Pole | `[1, 2, 3]` | `##]` | Homogenní prvky |
| Tuple | `(a, b)` | `##)` | Poziční |
| Pojmenovaný Tuple | `(x: 1, y: 2)` | `##)` | Pojmenovaná pole |
| Funkce | ref. pojmenované funkce | `##()` | Hodnota první třídy; zobrazení `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Hodnota první třídy; zobrazení `<lambd/N>` |

```zymbol
// Typ introspekce — vrací (typ, číslice, hodnota)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Výstup a Vstup

```zymbol
>> "Ahoj" ¶                      // ¶ nebo \\ pro explicitní nový řádek
>> "a=" a " b=" b ¶               // juxtapozice — více hodnot
>> (arr$#) ¶                      // postfixové operátory vyžadují ( ) v >>

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
r1 = a + b    // 13     
r2 = a - b    // 7
r3 = a * b    // 30     
r4 = a / b    // 3  (celočíselné dělení)
r5 = a % b    // 1      
r6 = a ^ b    // 1000  (umocnění)

// Porovnání
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

## Řetězce

```zymbol
// Dvě formy zřetězení
jméno = "Alžběta"
n = 42

>> "Ahoj " jméno " máš " n ¶         // juxtapozice — v >>
popis = "Ahoj {jméno}, máš {n}"      // interpolace — kdekoliv
```

```zymbol
s = "Ahoj Světe"
délka = s$#                  // 10
část = s$[1..4]              // "Ahoj"  (1-based, konec inkluzivní)
obsahuje = s$? "Světe"       // #1
části = "a,b,c,d"$/ ','      // [a, b, c, d]  (rozdělení oddělovačem)
nahr = s$~~["o":"O"]         // "AhOj Světe"
nahr1 = s$~~["o":"O":1]      // "AhOj Světe"  (pouze první N)
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

// Vzory porovnání
teplota = -5
stav = ?? teplota {
    < 0  : "led"
    < 20 : "chladno"
    < 35 : "teplo"
    _    : "horko"
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
počet = 0
@:vnější {
    počet++
    ? počet >= 3 { @:vnější! }
}
>> počet ¶                    // → 3
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

> Pojmenované funkce jsou **hodnotami první třídy** — předat přímo: `čísla$> zdvojit`. Pro zabalení: `x -> fn(x)` je také platné.

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
>> ops[3](5) ¶    // → 25
```

---

## Pole

Pole jsou **měnitelná** a obsahují prvky **stejného typu**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — přístup (indexování od 1: první prvek)
arr[-1]         // 5 — záporný index (poslední prvek)
arr$#           // 5 — délka (použijte (arr$#) v >>)

arr = arr$+ 6            // přidat → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // vložit na pozici 2 (1-based)
arr3 = arr$- 3           // odebrat první výskyt hodnoty
arr4 = arr$-- 3          // odebrat všechny výskyty
arr5 = arr$-[1]          // odebrat na indexu 1 (první prvek)
arr6 = arr$-[2..3]       // odebrat rozsah (1-based, konec inkluzivní)

has = arr$? 3            // #1 — obsahuje
pos = arr$?? 3           // [3] — všechny indexy hodnoty (1-based)
sl = arr$[1..3]          // [1,2,3] — výřez (1-based, konec inkluzivní)
sl2 = arr$[1:3]          // [1,2,3] — totéž, syntaxe počtu

asc = arr$^+             // seřazeno vzestupně  (pouze primitiva)
desc = arr$^-            // seřazeno sestupně   (pouze primitiva)

// Tuple pole — použijte $^ s porovnávací lambdou
db = [(jméno: "Carla", věk: 28), (jméno: "Ana", věk: 25), (jméno: "Bob", věk: 30)]
podle_věku  = db$^ (a, b -> a.věk < b.věk)    // vzestupně podle věku (<)
podle_jméno = db$^ (a, b -> a.jméno > b.jméno)  // sestupně podle jména (>)
>> podle_věku[1].jméno ¶     // → Ana
>> podle_jméno[1].jméno ¶    // → Carla

// Přímá aktualizace prvku (pouze pole)
arr[1] = 99              // přiřadit
arr[2] += 5              // složené: +=  -=  *=  /=  %=  ^=

// Funkční aktualizace — vrátí nové pole; originál beze změny
arr2 = arr[2]$~ 99
```

> Všechny operátory kolekcí vrací **nové pole**. Přiřaďte zpět: `arr = arr$+ 4`.
> `$+` lze řetězit: `arr = arr$+ 5$+ 6$+ 7`. Ostatní operátory používají mezilehlá přiřazení.
> **Indexování je 1-based**: `arr[1]` je první prvek; `arr[0]` je chyba za běhu.
> `$^+` / `$^-` řadí **primitivní pole** (čísla, řetězce). Pro tuple pole použijte `$^` s porovnávací lambdou — směr je zakódován v lambdě (`<` = vzestupně, `>` = sestupně).

**Hodnotová sémantika** — přiřazení pole do jiné proměnné vytvoří nezávislou kopii:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b není ovlivněno
```

```zymbol
// Vnořená pole (indexování od 1)
matice = [[1,2,3],[4,5,6],[7,8,9]]
>> matice[2][3] ¶    // → 6  (řádek 2, sloupec 3)
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
(jméno: n, věk: a) = osoba  // n="Ana"  a=25
```

---

## Tuple

Tuple jsou **neměnné** uspořádané kontejnery, které mohou obsahovat hodnoty **různých typů**.
Na rozdíl od polí nelze prvky po vytvoření měnit.

```zymbol
// Poziční — povoleny smíšené typy
bod = (10, 20)
>> bod[1] ¶    // → 10

data = (42, "ahoj", #1, 3.14)
>> data[3] ¶     // → #1

// Pojmenovaný
osoba = (jméno: "Alice", věk: 25)
>> osoba.jméno ¶    // → Alice
>> osoba[1] ¶       // → Alice  (index také funguje, 1-based)

// Vnořený
pos = (x: 10, y: 20)
p = (pos: pos, popisek: "počátek")
>> p.pos.x ¶        // → 10
```

**Neměnnost** — jakýkoli pokus o změnu prvku tuple je chybou za běhu:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ chyba za běhu: tuple jsou neměnné
// t[1] += 5    // ❌ stejná chyba
```

Pro odvození změněné hodnoty použijte `$~` (funkční aktualizace) — vrátí **nový** tuple:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← originál beze změny
>> t2 ¶    // → (10, 999, 30)

// Pojmenovaný tuple — explicitně přestavět
osoba = (jméno: "Alice", věk: 25)
starší  = (jméno: osoba.jméno, věk: 26)
>> osoba.věk ¶    // → 25
>> starší.věk ¶   // → 26
```

---

## Funkce Vyššího Řádu

```zymbol
čísla = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

zdvojené   = čísla$> (x -> x * 2)                // map  → [2,4,6…20]
sudá       = čísla$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
celkem     = čísla$< (0, (acc, x) -> acc + x)     // reduce → 55

// Řetěz přes mezilehlé
krok1 = čísla$| (x -> x > 3)
krok2 = krok1$> (x -> x * x)
>> krok2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Pojmenované funkce lze předat přímo do FVŘ
zdvojit(x) { <~ x * 2 }
velké(x) { <~ x > 5 }
r = čísla$> zdvojit       // ✅ přímá reference
r = čísla$| velké         // ✅ přímá reference
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
// lib/vypocet.zy — tělo modulu je uzavřeno ve složených závorkách
# vypocet {
    #> { přidat, get_PI }

    _PI := 3.14159
    přidat(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
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
# mojelib {
    #> { _interní_přidat <= součet }

    _interní_přidat(a, b) { <~ a + b }
}
```

```zymbol
<# ./mojelib <= m

>> m::součet(3, 4) ¶    // → 7  (interní název _interní_přidat je skrytý)
```

> **Pravidla modulů**: uvnitř `# název { }` jsou povoleny pouze `#>`, definice funkcí a doslovné inicializátory proměnných/konstant. Spustitelné příkazy (`>>`, `<<`, smyčky atd.) způsobí chybu E013.

---

## Číselné Módy

Zymbol může zobrazovat čísla v **69 Unicode číselných písmech** — Dévanágarí, Arabsko-indická, Thajská, Klingon pIqaD, Matematická tučná, LCD segmenty a další. Aktivní mód ovlivňuje pouze výstup `>>`; interní aritmetika je vždy binární.

### Aktivace písma

Zapište číslici `0` a `9` cílového písma uzavřenou do `#…#`:

```zymbol
#०९#    // Dévanágarí      (U+0966–U+096F)
#٠٩#    // Arabsko-indická (U+0660–U+0669)
#๐๙#    // Thajská         (U+0E50–U+0E59)
#09#    // reset na ASCII
```

### Výstup a booleany

```zymbol
x = 42
>> x ¶          // → 42   (ASCII výchozí)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (desetinná tečka vždy ASCII)
>> 1 + 2 ¶      // → ३

// Booleany: předpona # vždy ASCII, číslice se přizpůsobuje
>> #1 ¶         // → #१   (pravda v Dévanágarí)
>> #0 ¶         // → #०   (nepravda — odlišné od ०  celočíselné nuly)

x = 28 > 4
>> x ¶          // → #१   (výsledek porovnání sleduje aktivní mód)
```

### Nativní číselné literály ve zdrojovém kódu

Číslice libovolného podporovaného písma jsou platnými literály — v rozsazích, modulo, porovnáních:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Booleovské literály v libovolném písmu

`#` + číslice `0` nebo `1` z libovolného bloku je platným booleovským literálem:

```zymbol
#٠٩#
نشط = #١        // totéž jako #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` je **vždy ASCII**. `#0` (nepravda) je vždy vizuálně odlišné od `0` (celočíselná nula) v každém písmu.

---

## Datové Operátory

```zymbol
// Konverze typů
##.42         // → 42.0  (na Float)
###3.7        // → 4     (na Int, zaokrouhlení)
##!3.7        // → 3     (na Int, zkrácení)

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
fmt = #,|1234567|  // → 1,234,567  (oddělené čárkou)
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
| `:=` | konstanta | `$+` | přidat (lze řetězit) |
| `>>` | výstup | `$+[i]` | vložit na index (1-based) |
| `<<` | vstup | `$-` | odebrat první výskyt hodnoty |
| `¶` / `\\` | nový řádek | `$--` | odebrat všechny výskyty |
| `?` | pokud | `$-[i]` | odebrat na indexu (1-based) |
| `_?` | jinak-pokud | `$-[i..j]` | odebrat rozsah (1-based) |
| `_` | jinak / zástupný | `$?` | obsahuje |
| `??` | shoda | `$??` | najít všechny indexy (1-based) |
| `@` | smyčka | `$[s..e]` | výřez (1-based) |
| `@ N { }` | smyčka N-krát | `$>` | mapování |
| `@!` | přerušení | `$\|` | filtrování |
| `@>` | pokračování | `$<` | redukce |
| `@:název { }` | označená smyčka | `$/ oddělovač` | rozdělení řetězce |
| `@:název!` | přerušit označenou | `$++ a b c` | zřetězení více položek |
| `@:název>` | pokračovat označenou | `arr[i>j>k]` | navigační index |
| `->` | lambda | `arr[i] = val` | aktualizovat prvek (pouze pole) |
| `arr[i] += val` | složená aktualizace | `arr[i]$~` | funkční aktualizace (nová kopie) |
| `$^+` | řadit vzestupně (primitiva) | `$^-` | řadit sestupně (primitiva) |
| `$^` | řadit s porovnáním (tuple) | `<~` | návrat |
| `\|>` | roura | `!?` | zkusit |
| `:!` | zachytit | `:>` | nakonec |
| `#1` | pravda | `#0` | nepravda |
| `$!` | je chyba | `$!!` | propagovat chybu |
| `<#` | importovat | `#>` | exportovat |
| `#` | deklarovat modul | `::` | volání modulu |
| `.` | přístup k poli | `#?` | metadata typu |
| `#\|..\|` | parsovat číslo | `##.` | přetypovat na Float |
| `###` | přetypovat na Int (zaokrouhlení) | `##!` | přetypovat na Int (zkrácení) |
| `#.N\|..\|` | zaokrouhlit | `#!N\|..\|` | zkrátit |
| `#,\|..\|` | formát s čárkou | `#^\|..\|` | vědecký |
| `#d0d9#` | přepnutí číselného módu | `#09#` | reset na ASCII |
| `<\ ..\>` | spustit shell | `>\<` | argumenty CLI |
| `\ proměnná` | explicitní zničení proměnné | | |

---

## Historie Verzí

### v0.0.4 — Indexování od 1, Funkce první třídy & Blokové moduly _(Duben 2026)_

- **Rozbíjející** Veškeré indexování přepnuto na **1-based** — `arr[1]` je první prvek; `arr[0]` je chyba za běhu
- **Přidáno** Pojmenované funkce jsou **hodnotami první třídy** — předat přímo do FVŘ: `čísla$> zdvojit`
- **Přidáno** **Bloková syntaxe modulů** povinná: `# název { ... }` — plochá syntaxe odstraněna
- **Přidáno** Vícerozměrné indexování: `arr[i>j>k]` (navigace), `arr[p ; q]` (ploché extrahování)
- **Přidáno** Konverze typů: `##.výraz` (Float), `###výraz` (Int zaokrouhlení), `##!výraz` (Int zkrácení)
- **Přidáno** Rozdělení řetězce: `řetězec$/ oddělovač` — vrátí `Array(String)`
- **Přidáno** Zřetězení více položek: `základ$++ a b c` — přidá více prvků
- **Přidáno** Smyčka N-krát: `@ N { }` — opakovat přesně N-krát
- **Přidáno** Syntaxe označené smyčky: `@:název { }`, `@:název!`, `@:název>` — nahrazuje `@ @název` / `@! název`
- **Přidáno** Pravidla rozsahu proměnných: proměnné `_název` mají přesný blokový rozsah; `\ proměnná` zničí předčasně
- **Přidáno** Vzory porovnání ve shodě: `< 0 :`, `> 5 :`, `== 42 :` atd.
- **Přidáno** Chyba modulu E013: spustitelné příkazy v těle modulu jsou zakázány
- **Opraveno** `take_variable` již nepoškozuje konstanty modulu při zpětzápisu
- **Opraveno** `alias.KONSTANTA` se nyní správně rozlišuje; `#>` může být za definicemi funkcí
- **VM** Plná parita: 393/393 testů prošlo

### v0.0.3 — Unicode Číselné Soustavy & Vylepšení LSP _(Duben 2026)_

- **Přidáno** 69 Unicode číselných bloků s přepínacím tokenem `#d0d9#`
- **Přidáno** Booleovské literály v libovolném písmu — `#१` / `#०`, `#١` / `#٠`, atd.
- **Přidáno** Klingon pIqaD číslice (CSUR PUA U+F8F0–U+F8F9)
- **Přidáno** VM opkód `SetNumeralMode` — plná parita s tree-walkerem
- **Přidáno** REPL respektuje aktivní číselný mód při echu a zobrazení proměnných
- **Změněno** Výstup `>>` booleanů nyní zahrnuje předponu `#` (`#0` / `#1`) ve všech módech

### v0.0.2_01 — Přejmenování Operátorů _(30 Mar 2026)_

- **Změněno** `c|..|` → `#,|..|` a `e|..|` → `#^|..|` — konzistentní s rodinou předpon `#`
- **Přidáno** Alias exportu: znovuexportování členů modulu pod jiným názvem

### v0.0.2 — Redesign API Kolekcí & Instalátory _(24 Mar 2026)_

- **Přidáno** Sjednocená rodina operátorů `$` pro pole a řetězce (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Přidáno** Destrukturování pro pole, tuple a pojmenované tuple
- **Přidáno** Záporné indexy (`arr[-1]` = poslední prvek)
- **Přidáno** Nativní instalátory — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Přidáno** Složené přiřazení `^=`
- **Opraveno** Hraniční případy aritmetického parseru; opravy dokumentace

### v0.0.1 — První Veřejné Vydání _(22 Mar 2026)_

- Tree-walker interpret + registrový VM (`--vm`, ~4× rychlejší, ~95% parita)
- Všechny základní konstrukce: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Plné Unicode identifikátory, modulový systém, lambdy, uzávěry, zpracování chyb
- REPL, LSP, rozšíření VS Code, formátovač (`zymbol fmt`)

---

_Zymbol-Lang — Symbolický. Univerzální. Neměnný._
