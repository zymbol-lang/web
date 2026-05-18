> **Upozornění:** Tato dokumentace byla vytvořena a přeložena umělou inteligencí (UI).
> 
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> 
> The canonical reference is **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** in the interpreter repository.

---

# Příručka Zymbol-Lang

> **Přezkoumáno pro v0.0.5 — 2026-05-12**

**Zymbol-Lang** je symbolický programovací jazyk. Žádná klíčová slova — vše je symbol. Funguje stejně v každém lidském jazyce.

- Žádné `if`, `while`, `return` — pouze `?`, `@`, `<~`
- Plný Unicode — identifikátory v jakémkoli jazyce nebo emodži
- Nezávislý na lidském jazyce — kód je všude stejný

**Verze interpreteru**: v0.0.5 | **Pokrytí testy**: 436/436 (TW ↔ VM parita)

---

## Proměnné a Konstanty

```zymbol
x = 10              // proměnná
PI := 3.14159       // konstanta — přiřazení způsobí chybu za běhu
jmeno = "Alice"
aktivni = #1        // logická pravda
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

`°` (znak stupně, U+00B0) automaticky inicializuje proměnnou na její neutrální hodnotu při prvním použití:

```zymbol
cisla = [3, 1, 4, 1, 5]
@ n:cisla {
    °celkem += n    // auto-inicializace na 0 před smyčkou; dostupná po @
}
>> celkem ¶         // → 14
```

> `°x` (prefix) kotví nad smyčkou — výsledek je dostupný po `@`.
> `x°` (postfix) kotví uvnitř smyčky — zanikne po skončení smyčky.
> Pouze tree-walker.

---

## Datové Typy

| Typ | Literál | Tag `#?` | Poznámky |
|-----|---------|----------|---------|
| Celé | `42`, `-7` | `###` | 64-bitové se znaménkem |
| Desetinné | `3.14`, `1.5e10` | `##.` | Vědecká notace OK |
| Řetězec | `"text"` | `##"` | Interpolace: `"Ahoj {jmeno}"` |
| Znak | `'A'` | `##'` | Jediný Unicode znak |
| Logické | `#1`, `#0` | `##?` | NENÍ číslo — `#1 ≠ 1` |
| Pole | `[1, 2, 3]` | `##]` | Homogenní prvky |
| Ntice | `(a, b)` | `##)` | Pozicní |
| Pojmenovaná Ntice | `(x: 1, y: 2)` | `##)` | Pojmenovaná pole |
| Funkce | pojmenovaná reference | `##()` | Prvotřídní; zobrazí `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Prvotřídní; zobrazí `<lambd/N>` |

```zymbol
// Introspekce typu — vrátí (typ, číslice, hodnota)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Výstup a Vstup

```zymbol
>> "Ahoj" ¶                       // ¶ nebo \\ pro explicitní nový řádek
>> "a=" a " b=" b ¶               // juxtapozice — více hodnot
>> (pole$#) ¶                     // postfixní operátory vyžadují ( ) v >>

<< jmeno                          // čtení do proměnné (bez výzvy)
<< "Zadejte jmeno: " jmeno        // s výzvou
```

> `¶` (AltGr+R na španělské klávesnici) a `\\` jsou ekvivalentní nové řádky.

---

## TUI Primitiva

Terminálové UI operátory pro interaktivní programy. Většina vyžaduje blok `>>| { }` (alternativní obrazovka + surový režim).

```zymbol
>>| {
    >>!                             // vymazání alternativní obrazovky
    >>~ (1, 1, 0, 10) > "Běží"     // řádek 1, sloupec 1, fg=10 (zelená)
    @~ 1000                         // pauza 1 sekunda (1000 ms)
    >>~ (2, 1) > "Hotovo."
}
// terminál obnoven automaticky po ukončení
```

```zymbol
// Stisk klávesy a velikost terminálu
>>| {
    [radky, sloupce] = >>?              // dotaz na rozměry terminálu
    >>~ (1, 1) > "Terminál: " radky " x " sloupce
    <<| klavesa                          // blokující čtení klávesy
    >>~ (2, 1) > "Stisknuto: " klavesa
}
```

> `>>!` vymaže obrazovku. `>>?` vrátí `[radky, sloupce]`. `@~ N` spí N milisekund.
> `<<|` přečte jeden stisk klávesy (blokující); `<<|?` zkouší bez blokování (vrátí `'\0'` pokud žádný).
> Tuple pozicovaného výstupu: `(radek, sloupec, TTP, fg, bg)` — jakýkoli slot lze vynechat čárkou (`>>~ (,,, 196) > "červená"`).
> Maska TTP: `1`=Tučné, `2`=Kurzíva, `4`=Podtržené. ANSI 256-barevná paleta (`0`=výchozí terminál).
> Pouze tree-walker (kromě `>>!`, `>>?`, `@~`, `>>~` které fungují i s `--vm`).

---

## Operátory

```zymbol
// Aritmetika
a = 10
b = 3
v1 = a + b    // 13
v2 = a - b    // 7
v3 = a * b    // 30
v4 = a / b    // 3  (celočíselné dělení)
v5 = a % b    // 1
v6 = a ^ b    // 1000  (umocňování)

// Porovnání — přiřazení pro kontrolu
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

## Řetězce

```zymbol
// Dvě formy zřetězení
jmeno = "Alice"
n = 42

>> "Ahoj " jmeno " máš " n ¶      // juxtapozice — v >>
popis = "Ahoj {jmeno}, máš {n}"   // interpolace — kdekoli
```

```zymbol
s = "Ahoj Svět"
delka = s$#                  // 9
pod = s$[1..4]               // "Ahoj"  (1-based, konec včetně)
ma = s$? "Svět"              // #1
casti = "a,b,c,d"$/ ','      // [a, b, c, d]  (rozdělení oddělovačem)
nahr = s$~~["j":"J"]         // nahrazení
nahr1 = s$~~["j":"J":1]      // pouze první N
radek = "─" $* 20            // "────────────────────"  (opakovat N krát)
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
skore = 85
znamka = ?? skore {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> znamka ¶    // → B

// Řetězce
barva = "červená"
kod = ?? barva {
    "červená" => "#FF0000"
    "zelená"  => "#00FF00"
    _         => "#000000"
}

// Vzory porovnání
teplota = -5
stav = ?? teplota {
    < 0  => "led"
    < 20 => "chladno"
    < 35 => "teplo"
    _    => "horko"
}
>> stav ¶    // → led

// Příkazová forma (blokové větve)
n = -3
?? n {
    0    => { >> "nula" ¶ }
    < 0  => { >> "záporné" ¶ }
    _    => { >> "kladné" ¶ }
}
```

---

## Smyčky

```zymbol
@ i:0..4  { >> i " " }        // rozsah včetně:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // s krokem:        1 3 5 7 9
@ i:5..0:1 { >> i " " }       // zpětně:          5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

ovoce = ["jablko", "hruška", "hrozno"]
@ o:ovoce { >> o ¶ }          // for-each pole

@ c:"ahoj" { >> c "-" }
>> ¶                          // → a-h-o-j-  (for-each řetězec)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> pokračuj
    ? i > 7 { @! }             // @! přeruš
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
pocet = 0
@:vnejsi {
    pocet++
    ? pocet >= 3 { @:vnejsi! }
}
>> pocet ¶                    // → 3
```

---

## Funkce

```zymbol
secti(a, b) { <~ a + b }
>> secti(3, 4) ¶    // → 7

faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120
```

Funkce mají **izolovaný rozsah** — nemohou číst vnější proměnné. Pro změnu proměnných volajícího použijte výstupní parametry `<~`:

```zymbol
prohod(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
prohod(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Pojmenované funkce jsou **prvotřídní hodnoty** — předávejte přímo: `cisla$> zdvoj`. Pro obalení: `x -> fn(x)` je také platné.

---

## Lambdy a Uzávěry

```zymbol
zdvoj = x -> x * 2
soucet = (a, b) -> a + b
>> zdvoj(5) ¶    // → 10
>> soucet(3, 7) ¶  // → 10

// Bloková lambda
klasifikuj = x -> {
    ? x > 0 { <~ "kladné" }
    _? x < 0 { <~ "záporné" }
    <~ "nula"
}

// Uzávěr — zachytí vnější rozsah
faktor = 3
trojnasobek = x -> x * faktor
>> trojnasobek(7) ¶    // → 21

// Továrna
vytvor_scitac(n) { <~ x -> x + n }
pricti10 = vytvor_scitac(10)
>> pricti10(5) ¶    // → 15

// V polích
operace = [x -> x+1, x -> x*2, x -> x*x]
>> operace[3](5) ¶    // → 25
```

---

## Pole

Pole jsou **proměnná** a obsahují prvky **stejného typu**.

```zymbol
pole = [1, 2, 3, 4, 5]

x = pole[1]      // 1 — přístup (1-based: první prvek)
x = pole[-1]     // 5 — záporný index (poslední prvek)
x = pole$#       // 5 — délka (použijte (pole$#) v >>)

pole = pole$+ 6            // přidání → [1,2,3,4,5,6]
pole2 = pole$+[2] 99       // vložení na pozici 2 (1-based)
pole3 = pole$- 3           // odstranění prvního výskytu hodnoty
pole4 = pole$-- 3          // odstranění všech výskytů
pole5 = pole$-[1]          // odstranění na indexu 1 (první prvek)
pole6 = pole$-[2..3]       // odstranění rozsahu (1-based, konec včetně)

ma = pole$? 3              // #1 — obsahuje
poz = pole$?? 3            // [3] — všechny indexy hodnoty (1-based)
rez = pole$[1..3]          // [1,2,3] — řez (1-based, konec včetně)
rez2 = pole$[1:3]          // [1,2,3] — totéž, syntaxe s počtem

vzest = pole$^+             // seřazeno vzestupně (pouze primitiva)
sest = pole$^-              // seřazeno sestupně (pouze primitiva)

// Pole pojmenovaných/pozičních ntic — použijte $^ s komparátorovou lambdou
db = [(jmeno: "Karla", vek: 28), (jmeno: "Ana", vek: 25), (jmeno: "Bob", vek: 30)]
podle_veku  = db$^ (a, b -> a.vek < b.vek)      // vzestupně podle věku  (<)
podle_jmena = db$^ (a, b -> a.jmeno > b.jmeno)  // sestupně podle jména (>)
>> podle_veku[1].jmeno ¶     // → Ana
>> podle_jmena[1].jmeno ¶    // → Karla

// Přímá aktualizace prvku (pouze pole)
pole[1] = 99              // přiřazení
pole[2] += 5              // složené: +=  -=  *=  /=  %=  ^=

// Funkční aktualizace — vrátí nové pole; originál beze změny
pole2 = pole[2]$~ 99
```

> Všechny operátory kolekcí vrátí **nové pole**. Přiřaďte zpět: `pole = pole$+ 4`.
> `$+` lze řetězit: `pole = pole$+ 5$+ 6$+ 7`. Ostatní operátory používají mezilehlá přiřazení.
> **Indexování je 1-based**: `pole[1]` je první prvek; `pole[0]` je chyba za běhu.
> `$^+` / `$^-` třídí **primitivní pole** (čísla, řetězce). Pro pole ntic použijte `$^` s komparátorovou lambdou — směr je zakódován v lambdě (`<` = vzestupně, `>` = sestupně).

**Sémantika hodnot** — přiřazení pole do jiné proměnné vytvoří nezávislou kopii:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b není ovlivněno
```

```zymbol
// Vnořená pole (1-based indexování)
matice = [[1,2,3],[4,5,6],[7,8,9]]
>> matice[2][3] ¶    // → 6  (řádek 2, sloupec 3)
```

---

## Destrukturování

```zymbol
// Pole
pole = [10, 20, 30, 40, 50]
[a, b, c] = pole              // a=10  b=20  c=30
[prvni, *zbytek] = pole       // prvni=10  zbytek=[20,30,40,50]
[x, _, z] = [1, 2, 3]          // _ zahazuje

// Poziční ntice
bod = (100, 200)
(bx, by) = bod                // bx=100  by=200

// Pojmenovaná ntice
osoba = (jmeno: "Ana", vek: 25, mesto: "Praha")
(jmeno: j, vek: v) = osoba    // j="Ana"  v=25
```

---

## Ntice

Ntice jsou **neměnné** uspořádané kontejnery, které mohou obsahovat hodnoty **různých typů**.
Na rozdíl od polí nelze prvky po vytvoření měnit.

```zymbol
// Poziční — povoleny smíšené typy
bod = (10, 20)
>> bod[1] ¶    // → 10

data = (42, "ahoj", #1, 3.14)
>> data[3] ¶   // → #1

// Pojmenované
osoba = (jmeno: "Alice", vek: 25)
>> osoba.jmeno ¶    // → Alice
>> osoba[1] ¶       // → Alice  (index také funguje, 1-based)

// Vnořené
poz = (x: 10, y: 20)
p = (poz: poz, stitek: "počátek")
>> p.poz.x ¶        // → 10
```

**Neměnnost** — jakýkoli pokus o změnu prvku ntice je chyba za běhu:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ chyba za běhu: ntice jsou neměnné
// t[1] += 5    // ❌ stejná chyba
```

Pro odvození změněné hodnoty použijte `$~` (funkční aktualizace) — vrátí **novou** ntici:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← originál beze změny
>> t2 ¶    // → (10, 999, 30)

// Pojmenovaná ntice — explicitní přestavba
osoba = (jmeno: "Alice", vek: 25)
starsi = (jmeno: osoba.jmeno, vek: 26)
>> osoba.vek ¶    // → 25
>> starsi.vek ¶   // → 26
```

---

## Funkce Vyššího Řádu

```zymbol
cisla = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

zdvojene  = cisla$> (x -> x * 2)                // map  → [2,4,6…20]
suda      = cisla$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
celkem    = cisla$< (0, (akum, x) -> akum + x)  // reduce → 55

// Řetězení přes mezilehlé
krok1 = cisla$| (x -> x > 3)
krok2 = krok1$> (x -> x * x)
>> krok2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Pojmenované funkce lze předat přímo HOF
zdvoj(x) { <~ x * 2 }
je_velke(x) { <~ x > 5 }
v = cisla$> zdvoj       // ✅ přímá reference
v = cisla$| je_velke    // ✅ přímá reference
```

---

## Operátor Roury

Pravá strana vždy vyžaduje `_` jako zástupný symbol pro přesměrovanou hodnotu:

```zymbol
zdvoj = x -> x * 2
pricti = (a, b) -> a + b
zvys = x -> x + 1

v1 = 5 |> zdvoj(_)         // → 10
v2 = 10 |> pricti(_, 5)    // → 15
v3 = 5 |> pricti(2, _)     // → 7

// Řetězené
v = 5 |> zdvoj(_) |> zvys(_) |> zdvoj(_)
>> v ¶    // → 22  (5→10→11→22)
```

---

## Zpracování Chyb

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dělení nulou" ¶
} :! {
    >> "ostatní: " _err ¶    // _err obsahuje chybovou zprávu
} :> {
    >> "vždy se spustí" ¶
}
```

| Typ | Kdy |
|-----|-----|
| `##Div` | Dělení nulou |
| `##IO` | Soubor / systém |
| `##Index` | Index mimo rozsah |
| `##Type` | Neshoda typů |
| `##Parse` | Parsování dat |
| `##Network` | Síťové chyby |
| `##_` | Jakákoli chyba (catch-all) |

---

## Moduly

```zymbol
// lib/calc.zy — tělo modulu je uzavřeno ve složených závorkách
# calc {
    #> { secti, ziskej_PI }

    _PI := 3.14159
    secti(a, b) { <~ a + b }
    ziskej_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc => k    // alias je povinný

>> k::secti(5, 3) ¶     // → 8
pi = k::ziskej_PI()
>> pi ¶                 // → 3.14159
```

```zymbol
// Export s jiným veřejným názvem
# mojelib {
    #> { _vnitrni_secti => soucet }

    _vnitrni_secti(a, b) { <~ a + b }
}
```

```zymbol
<# ./mojelib => m

>> m::soucet(3, 4) ¶    // → 7  (vnitřní název _vnitrni_secti je skrytý)
```

> **Pravidla modulu**: pouze `#>`, definice funkcí a literální inicializátory proměnných/konstant jsou povoleny uvnitř `# nazev { }`. Spustitelné příkazy (`>>`, `<<`, smyčky atd.) vyvolají chybu E013.

---

## Číselné Režimy

Zymbol může zobrazovat čísla v **69 Unicode číslicových skriptech** — Dévanágarí, Arabsko-Indický, Thajský, Klingonský pIqaD, Matematicky tučný, LCD segmenty a další. Aktivní režim ovlivňuje pouze výstup `>>`; vnitřní aritmetika je vždy binární.

### Aktivace skriptu

Napište číslici `0` a `9` cílového skriptu uzavřenou v `#…#`:

```zymbol
#०९#    // Dévanágarí   (U+0966–U+096F)
#٠٩#    // Arabsko-Indický (U+0660–U+0669)
#๐๙#    // Thajský      (U+0E50–U+0E59)
#09#    // reset na ASCII
```

### Výstup a logické hodnoty

```zymbol
x = 42
>> x ¶          // → 42   (ASCII výchozí)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (desetinná tečka vždy ASCII)
>> 1 + 2 ¶      // → ३

// Logické: prefix # vždy ASCII, číslice se přizpůsobí
>> #1 ¶         // → #१   (pravda v Dévanágarí)
>> #0 ¶         // → #०   (nepravda — odlišné od ०  celé číslo nula)

x = 28 > 4
>> x ¶          // → #१   (výsledek porovnání sleduje aktivní režim)
```

### Nativní číslicové literály ve zdrojovém kódu

Číslice jakéhokoli podporovaného skriptu jsou platné literály — v rozsazích, modulo, porovnáních:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Logické literály v libovolném skriptu

`#` + číslice `0` nebo `1` z libovolného bloku je platný logický literál:

```zymbol
#٠٩#
aktivni = #١        // stejné jako #1
>> aktivni ¶        // → #١
>> (#١ && #٠) ¶     // → #٠
```

> `#` je **vždy ASCII**. `#0` (nepravda) je vždy vizuálně odlišné od `0` (celé číslo nula) v každém skriptu.

---

## Datové Operátory

```zymbol
// Převody typů
f = ##.42         // → 42.0  (na Desetinné)
i = ###3.7        // → 4     (na Celé, zaokrouhlení)
t = ##!3.7        // → 3     (na Celé, zkrácení)

// Parsování řetězce na číslo
v1 = #|"42"|      // → 42  (Celé)
v2 = #|"3.14"|    // → 3.14  (Desetinné)
v3 = #|"abc"|     // → "abc"  (bezpečné selhání, bez chyby)

// Zaokrouhlení / zkrácení
pi = 3.14159265
v2 = #.2|pi|      // → 3.14  (zaokrouhlení na 2 desetinná místa)
v4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (zkrácení)

// Formátování čísel
fmt = #,|1234567|  // → 1,234,567  (oddělené čárkami)
ved = #^|12345.678|    // → 1.2345678e4  (vědecká notace)

// Literály základů
a = 0x41         // → 'A'  (hexadecimální)
b = 0b01000001   // → 'A'  (binární)
c = 0o101        // → 'A'  (osmičkové)

// Výstup převodu základu
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integrace Shell

```zymbol
datum = <\ date +%Y-%m-%d \>     // zachytí stdout (včetně závěrečného \n)
>> "Dnes: " datum

soubor = "data.txt"
obsah = <\ cat {soubor} \>       // interpolace v příkazech

vystup = </"./podskript.zy"/>    // spustí jiný Zymbol skript, zachytí výstup
>> vystup
```

> `><` zachytí CLI argumenty jako pole řetězců (pouze tree-walker).

---

## Kompletní Příklad: FizzBuzz

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

## Přehled Symbolů

| Symbol | Operace | Symbol | Operace |
|--------|---------|--------|---------|
| `=` | proměnná | `$#` | délka |
| `:=` | konstanta | `$+` | přidání (řetězitelné) |
| `>>` | výstup | `$+[i]` | vložení na index (1-based) |
| `<<` | vstup | `$-` | odstranění prvního podle hodnoty |
| `¶` / `\\` | nový řádek | `$--` | odstranění všech podle hodnoty |
| `?` | pokud | `$-[i]` | odstranění na indexu (1-based) |
| `_?` | jinak-pokud | `$-[i..j]` | odstranění rozsahu (1-based) |
| `_` | jinak / vzor | `$?` | obsahuje |
| `??` | shoda | `$??` | nalezení všech indexů (1-based) |
| `@` | smyčka | `$[s..e]` | řez (1-based) |
| `@ N { }` | smyčka N krát | `$>` | map |
| `@!` | přerušení | `$\|` | filter |
| `@>` | pokračuj | `$<` | reduce |
| `@:nazev { }` | označená smyčka | `$/ odd` | rozdělení řetězce |
| `@:nazev!` | přerušení označené | `$++ a b c` | zřetězení |
| `@:nazev>` | pokračuj označenou | `pole[i>j>k]` | navigační index |
| `->` | lambda | `pole[i] = hod` | aktualizace prvku (pouze pole) |
| `pole[i] += hod` | složená aktualizace | `pole[i]$~` | funkční aktualizace (nová kopie) |
| `$^+` | řazení vzestupně (prim.) | `$^-` | řazení sestupně (prim.) |
| `$^` | řazení s komparátorem (ntice) | `<~` | návrat |
| `\|>` | roura | `!?` | pokus |
| `:!` | zachycení | `:>` | nakonec |
| `#1` | pravda | `#0` | nepravda |
| `$!` | je chyba | `$!!` | šíření chyby |
| `<#` | import | `#>` | export |
| `#` | deklarace modulu | `::` | volání modulu |
| `.` | přístup k poli | `#?` | metadata typu |
| `#\|..\|` | parsování čísla | `##.` | převod na Desetinné |
| `###` | převod na Celé (zaokr.) | `##!` | převod na Celé (zkrác.) |
| `#.N\|..\|` | zaokrouhlení | `#!N\|..\|` | zkrácení |
| `#,\|..\|` | formát s čárkami | `#^\|..\|` | vědecká notace |
| `#d0d9#` | přepnutí číslicového režimu | `#09#` | reset na ASCII |
| `<\ ..\>` | spuštění shell | `>\<` | CLI argumenty |
| `\ prom` | explicitní zničení | `°x` / `x°` | horká definice (auto-init) |
| `>>|` | TUI blok (alt. obrazovka) | `>>~` | pozicovaný výstup |
| `>>!` | vymazání obrazovky | `>>?` | dotaz na velikost terminálu |
| `<<\|` | blokující klávesa | `<<\|?` | neblokující klávesa |
| `@~ N` | spánek N milisekund | `$*` | opakování řetězce N krát |

---

## Protokol Změn

### v0.0.5 — TUI Primitiva, Horká Definice a Opakování Řetězce _(květen 2026)_

- **Změna** Oddělovač větve shody: `vzor : výsledek` → `vzor => výsledek`
- **Změna** Alias importu: `<# cesta <= alias` → `<# cesta => alias`
- **Změna** Přejmenování při exportu: `#> { fn <= pub }` → `#> { fn => pub }`
- **Přidáno** TUI blok `>>| { }` — alternativní obrazovka + surový režim; vyčistí po ukončení
- **Přidáno** Pozicovaný výstup `>>~ (radek, sloupec, TTP, fg, bg) > prvky` — řídké sloty, 256-barevný ANSI
- **Přidáno** Vstup klávesy `<<| prom` (blokující) a `<<|? prom` (neblokující polling)
- **Přidáno** `>>!` vymazání, `>>?` dotaz na velikost, `@~ N` spánek N milisekund
- **Přidáno** Horká definice `°x` / `x°` — auto-inicializace při prvním použití ve smyčkách
- **Přidáno** Opakování řetězce `retezec $* N` — opakuje řetězec N krát
- **VM** Parita: 436/436 testů prochází

### v0.0.4 — 1-Based Indexování, Prvotřídní Funkce a Bloky Modulů _(duben 2026)_

- **Změna** Veškeré indexování přepnuto na **1-based** — `pole[1]` je první prvek; `pole[0]` je chyba
- **Přidáno** Pojmenované funkce jsou **prvotřídní hodnoty** — předávejte přímo HOF: `cisla$> zdvoj`
- **Přidáno** Povinný **blokový syntaktický** tvar modulů: `# nazev { ... }` — plochý tvar odstraněn
- **Přidáno** Vícerozměrné indexování: `pole[i>j>k]` (navigace), `pole[p ; q]` (ploché extrahování)
- **Přidáno** Převody typů: `##.výraz` (Desetinné), `###výraz` (Celé zaokr.), `##!výraz` (Celé zkrác.)
- **Přidáno** Rozdělení řetězce: `retezec$/ odd` — vrátí `Array(String)`
- **Přidáno** Zřetězení: `zaklad$++ a b c` — přidá více prvků
- **Přidáno** Smyčka N krát: `@ N { }` — opakuje přesně N krát
- **Přidáno** Syntaxe označené smyčky: `@:nazev { }`, `@:nazev!`, `@:nazev>` — nahrazuje `@ @nazev` / `@! nazev`
- **Přidáno** Pravidla rozsahu proměnných: `_nazev` má přesný blokový rozsah; `\ prom` zničí dříve
- **Přidáno** Vzory porovnání ve shodě: `< 0 :`, `> 5 :`, `== 42 :` atd.
- **Přidáno** Chyba E013 modulu: spustitelné příkazy v těle modulu jsou zakázány
- **Opraveno** `take_variable` již nepoškozuje konstanty modulu při zpětném zápisu
- **Opraveno** `alias.CONST` se nyní řeší správně; `#>` se může objevit po definicích funkcí
- **VM** Plná parita: 393/393 testů prochází

### v0.0.3 — Unicode Číslicové Systémy a Vylepšení LSP _(duben 2026)_

- **Přidáno** 69 Unicode číslicových bloků s přepínacím tokenem `#d0d9#`
- **Přidáno** Logické literály v libovolném skriptu — `#१` / `#०`, `#١` / `#٠` atd.
- **Přidáno** Klingonské pIqaD číslice (CSUR PUA U+F8F0–U+F8F9)
- **Přidáno** Operační kód VM `SetNumeralMode` — plná parita s tree-walker
- **Změna** REPL respektuje aktivní číslicový režim při ozvěně a zobrazení proměnných
- **Změna** Výstup `>>` pro logické hodnoty nyní obsahuje prefix `#` (`#0` / `#1`) ve všech režimech

### v0.0.2_01 — Přejmenování Operátoru _(30 bř 2026)_

- **Změna** `c|..|` → `#,|..|` a `e|..|` → `#^|..|` — konzistentní s rodinou prefixu `#`
- **Přidáno** Alias exportu: znovu exportovat členy modulu pod jiným názvem

### v0.0.2 — Přepracování API Kolekcí a Instalátory _(24 bř 2026)_

- **Přidáno** Unifikovaná rodina operátorů `$` pro pole a řetězce (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Přidáno** Destrukturování pro pole, ntice a pojmenované ntice
- **Přidáno** Záporné indexy (`pole[-1]` = poslední prvek)
- **Přidáno** Nativní instalátory — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 bř 2026)_

- **Přidáno** Složené přiřazení `^=`
- **Opraveno** Rohové případy aritmetiky parseru; opravy dokumentace

### v0.0.1 — Počáteční Veřejné Vydání _(22 bř 2026)_

- Tree-walker interpret + registrový VM (`--vm`, ~4× rychlejší, ~95% parita)
- Všechny základní konstrukty: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Plné Unicode identifikátory, modulový systém, lambdy, uzávěry, zpracování chyb
- REPL, LSP, rozšíření VS Code, formátovač (`zymbol fmt`)

---

_Zymbol-Lang — Symbolický. Univerzální. Neměnný._
