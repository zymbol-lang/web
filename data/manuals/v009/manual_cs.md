> **Prohlášení o vyloučení odpovědnosti:** Tento dokument byl vytvořen a přeložen umělou inteligencí (AI).
>
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
>
> Kanonickým odkazem je **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** v repozitáři interpretu.

---

# Příručka Zymbol-Lang

> **Revize pro v0.0.9 — 2026-09-07**

**Zymbol-Lang** je symbolický programovací jazyk. V jeho gramatice nejsou žádná slova — každá konstrukce je znaménko. Funguje identicky v jakémkoli lidském jazyce.

- Žádné `if`, `while`, `return` — pouze `?`, `@`, `<~`
- Plné Unicode — identifikátory v jakémkoli jazyce nebo emoji
- Nezávislý na lidském jazyce — kód je všude stejný

**Verze interpretu**: v0.0.9 | **Pokrytí testy**: 660/666 (tři enginy souhlasí, 0 se liší)

---

## Proměnné a Konstanty

```zymbol
x = 10              // měnitelná proměnná
PI := 3.14159       // konstanta — opětovné přiřazení je chyba za běhu
jméno = "Jana"
aktivní = #1        // boolean pravda
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
x++       // 5
x--       // 4
```

`°` (znak stupně, U+00B0) automaticky inicializuje proměnnou na její neutrální hodnotu při prvním použití:

```zymbol
čísla = [3, 1, 4, 1, 5]
@ n:čísla {
    °součet += n
}
>> součet ¶              // → 14
```

> `°proměnná` (prefix) se ukotví nad smyčkou — výsledek je čitelný po `@`.
> `proměnná°` (sufix) se ukotví uvnitř smyčky — umírá, když smyčka skončí.

Příkaz, který je pouze jménem, přečte proměnnou a zahodí hodnotu, proto varuje:

```zymbol
počítadlo = 5
počítadlo
```

Kompilátor varuje takto (jeho zprávy jsou vždy v angličtině):

```text
warning: this statement does nothing: 'počítadlo' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

Tedy: *«tento příkaz nic nedělá: 'počítadlo' je přečteno a zahozeno»*.

---

## Datové Typy

| Typ | Literál | Značka `#?` | Poznámky |
|------|---------|-------------|----------|
| Celé číslo | `42`, `-7` | `###` | Bezpečné celé číslo: ±(2⁵³ − 1) |
| Desetinné číslo | `3.14`, `1.5e10` | `##.` | IEEE-754 dvojitá přesnost |
| Řetězec | `"text"` | `##"` | Interpolace: `"Ahoj {jméno}"` |
| Znak | `'A'` | `##'` | Jeden kódový bod Unicode |
| Boolean | `#1`, `#0` | `##?` | NENÍ číslo — `#1 ≠ 1` |
| Pole | `[1, 2, 3]` | `##]` | Jeden typ, kontrolováno |
| Deklarovaná směs | `#[1, "dva"]` | `##[` | Stejný typ jako `[…]`, nekontrolováno |
| N-tice | `(a, b)` | `##)` | Poziční, neměnitelná |
| Slovník | `#(x: 1, y: 2)` | `##(` | Klíčovaný, měnitelný |
| Funkce | odkaz na pojmenovanou funkci | `##()` | Prvotřídní; zobrazuje `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Prvotřídní; zobrazuje `<lambd/N>` |
| Jednotka | `##_` | `##_` | Nepřítomnost — neexistuje null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(x: 1)#? ¶          // → (##(, 1, #(x: 1))
```

Celé číslo, které opustí bezpečný rozsah, je zachytitelná chyba, nikdy tiché přetečení:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "mimo rozsah" ¶ // → mimo rozsah
}
```

`##_` je způsob, jakým se program ptá, zda něco chybí:

```zymbol
nic() { }
hodnota = nic()
>> (hodnota == ##_) ¶     // → #1
```

---

## Výstup a Vstup

```zymbol
jméno = "Jana"
součet = 3
>> "Ahoj" ¶             // → Ahoj
>> "a=" jméno " b=" součet ¶ // → a=Jana b=3
>> součet#? ¶            // → (###, 1, 3)
```

```zymbol
<< jméno
<< "Zadejte své jméno: " jméno
<< ###(4) "Věk: " věk
```

**Podívejte se na tvar obou znamének.** `>>` ukazuje ven: vynáší data z programu. `<<` ukazuje dovnitř: vnáší data do programu. Není zde nic k zapamatování — šipka ukazuje směr, kterým informace putuje, a stejná myšlenka se vrací v každém znaménku, které něco přemisťuje.

> `¶` a `\\` jsou ekvivalentní nové řádky. `>>` jej nikdy nepřidá.
> Specifikátor typu před výzvou validuje při čtení a znovu se ptá, dokud hodnota není platná:
> `##.` Desetinné číslo · `##.(T,D)` desetinné · `###(N)` Celé číslo · `##"(N)"` text · `##'` jeden Znak.

Na nejvyšší úrovni souboru je `<~` návratový kód programu:

```zymbol
>> "kontrola" ¶      // → kontrola
<~ 0
```

---

## Primitivy TUI

Operátory terminálového rozhraní pro interaktivní programy. Většina vyžaduje blok `>>| { }` (alternativní obrazovka + surový režim).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Běží"
    @~ 1000
    >>~ (2, 1) > "Hotovo."
}
```

```zymbol
>>| {
    [řádky, sloupce] = >>?
    >>~ (1, 1) > "Terminál: " řádky " x " sloupce
    <<| klávesa
    >>~ (2, 1) > "Stisknuto: " klávesa
}
```

Zde vidíte, proč se znaménka kombinují, místo aby se násobila. Už víte, že `<<` je vstup a `?` se ptá bez závazku. Pouze jedno znaménko je nové:

- `|` je **jedna jednotka**, ne celý proud.

S tím se oba klávesnicové operátory čtou samy:

```text
<<        |             ?
vstup     jedna jednotka  bez závazku

<<|   vezmi JEDNU klávesu a čekej, dokud nějaká není
<<|?  podívej se, zda nějaká klávesa JE, a pokračuj, když není
```

Stejně na druhé straně: `>>` odesílá, `>>!` odesílá **silou** (vyčistí celou obrazovku), zatímco `>>?` se **ptá** místo psaní (jak velký je terminál). Znaménko vpravo je to, které mění režim, a přichází vždy jako poslední.

> `>>!` vyčistí obrazovku. `>>?` vrací `[řádky, sloupce]`. `@~ N` spí N milisekund.
> `<<|` čte jeden stisk klávesy (blokující); `<<|?` dotazuje se bez blokování (`'\0'`, pokud žádný není).
> Klávesy se šipkami přicházejí dekódované jako `'↑' '↓' '←' '→'`; ESC je kódový bod 27.
> N-tice pozicovaného výstupu: `(řádek, sloupec, BKS, popředí, pozadí)` — kterýkoli slot lze vynechat čárkou (`>>~ (,,, 196) > "červená"`).
> Bitová maska BKS: `1`=Tučné, `2`=Kurzíva, `4`=Podtržené. Paleta ANSI 256 barev (`0`=výchozí terminál).

---

## Operátory

```zymbol
a = 10
b = 3
v1 = a + b    // 13
v2 = a - b    // 7
v3 = a * b    // 30
v4 = a / b    // 3  (celočíselné dělení)
v5 = a % b    // 1
v6 = a ^ b    // 1000
```

```zymbol
a = 10
b = 3
p1 = a == b    // #0
p2 = a <> b    // #1
p3 = a < b     // #0
p4 = a >= b    // #1
l1 = #1 && #0  // #0
l2 = !#1       // #0
```

> `==` nikdy nevynucuje: `"5" == 5` je `#0`. Řazení vynucuje: `"5" > 4` je `#1` a `"४२" > 5` také — číselný text v kterémkoli ze 69 písem se porovnává jako číslo.
> Funkce je rovna pouze sama sobě, nikdy jiné funkci se stejným tělem.

---

## Řetězce

```zymbol
jméno = "Jana"
n = 42
>> "Ahoj " jméno " máš " n ¶ // → Ahoj Jana máš 42
popis = "Ahoj {jméno}, máš {n}"
>> popis ¶              // → Ahoj Jana, máš 42
```

```zymbol
s = "Ahoj světe"
délka = s$#                  // 10
podřetězec = s$[1..4]             // "Ahoj"
obsahuje = s$? "světe"          // #1
části = "a,b,c,d"$/ ','    // [a, b, c, d]
nahrazení = s$~~["o":"0"]        // "Ah0j světe"
čára = "─" $* 20
```

> `+` je pouze pro čísla. Pro řetězce použijte juxtapozici nebo interpolaci.
> `\{` a `\}` jsou doslovné složené závorky — escapování je symetrické.

---

## Řízení Toku

```zymbol
x = 7
? x > 100 {
    >> "velké" ¶
} _? x > 0 {
    >> "kladné" ¶     // → kladné
} _ {
    >> "záporné" ¶
}
```

Zde jsou dvě nová znaménka a třetí, které vzniká jejich spojením:

- `?` je **ptát se**: otevírá podmínku.
- `_` je **co nebylo určeno**: větev, která zbude, když žádná otázka neodpovídá.
- `_?` je obojí za sebou: *pokud nic neodpovídalo, zeptej se znovu*.

Proto se `_?` píše takto. Není to nový symbol k učení — je to `_` následované `?`, a znamená přesně to, co znamenají jeho dvě části čtené v pořadí.

> Složené závorky `{ }` jsou **povinné** i pro jediný příkaz.

---

## Porovnávání

```zymbol
skóre = 85
známka = ?? skóre {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> známka ¶              // → B
```

```zymbol
teplota = -5
stav = ?? teplota {
    < 0  => "led"
    < 20 => "zima"
    _    => "horko"
}
>> stav ¶              // → led
```

Už víte, že `?` je «ptát se». **`??` je ptát se mnohokrát**: zdvojení znaménka kdekoli v jazyce znamená dělat vícekrát to, co znaménko dělá jednou. Jedno `?` testuje jednu podmínku; `??` testuje proti seznamu případů.

Alternativy se spojují pomocí `||` a mohou míchat druhy vzorů:

```zymbol
klávesa = 'P'
akce = ?? klávesa {
    'p' || 'P' => "pauza"
    < 0 || > 100 => "mimo rozsah"
    _ => "ignorováno"
}
>> akce ¶             // → pauza
```

---

## Smyčky

```zymbol
@ i:1..4  { >> i " " }
>> ¶                    // → 1 2 3 4
@ i:1..9:2 { >> i " " }
>> ¶                    // → 1 3 5 7 9
@ i:5..1:1 { >> i " " }
>> ¶                    // → 5 4 3 2 1
```

```zymbol
n = 1
@ n <= 64 { n *= 2 }
>> n ¶                  // → 128
```

```zymbol
ovoce = ["jablko", "hruška", "hroznové víno"]
@ o:ovoce { >> o " " }
>> ¶                    // → jablko hruška hroznové víno
@ z:"Ahoj" { >> z "-" }
>> ¶                    // → A-h-o-j-
```

```zymbol
@ i:1..10 {
    ? i % 2 == 0 { @> }
    ? i > 7 { @! }
    >> i " "
}
>> ¶                    // → 1 3 5 7
```

```zymbol
počítadlo = 0
@:vnější {
    počítadlo++
    ? počítadlo >= 3 { @:vnější! }
}
>> počítadlo ¶             // → 3
```

`@` je znaménko **času**: vše, co se opakuje, žije v něm. Pro zkrácení tohoto času přidáte vedle znaménko:

- `@!` — `!` je **síla**: opusť smyčku hned.
- `@>` — `>` posouvá vpřed: přejdi k dalšímu kolu.
- `@:vnější!` — `:` **váže jméno**, takže toto přeruší smyčku *jménem* vnější, ne tu nejbližší.

Tři operátory a žádný se nemusel učit zvlášť: jsou to `@` plus znaménko, které už říká, co dělá.

> **Specifikátor je počet nebo podmínka.** `Celé číslo` je počet, vyhodnocený jednou — `@ 0` spustí tělo nula krát. Cokoli jiného je podmínka. Neexistuje pravdivost: `@ []` a `@ 3.5` jsou odmítnuty. Pro průchod kolekcí použijte `@ x:prvky`; pro její spočítání `@ prvky$#`.

---

## Funkce

```zymbol
sečti(a, b) { <~ a + b }
>> sečti(3, 4) ¶        // → 7
```

```zymbol
faktoriál(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktoriál(n - 1)
}
>> faktoriál(5) ¶       // → 120
```

Funkce čte proměnné souboru hodnotou a zápis uvnitř zůstává uvnitř:

```zymbol
limit = 100
uvnitř(n) { <~ n < limit }
>> uvnitř(42) ¶         // → #1
```

Dvě znaménka to mění a obě se zapisují **v signatuře a v místě volání**:

```zymbol
zvyš(počítadlo<~) { počítadlo = počítadlo + 1 }
součet = 0
zvyš(součet<~)
>> součet ¶              // → 1
```

> `p~` je pracovní kopie — tělo ji může znovu přiřadit a volající zůstává nedotčen.
> `p<~` je výstupní parametr — změna putuje zpět. `zvyš(součet)` bez znaménka je sémantická chyba: anotace a signatura se nemohou rozejít.

---

## Lambda a Uzávěry

```zymbol
zdvoj = x -> x * 2
součet = (a, b) -> a + b
>> zdvoj(5) ¶          // → 10
>> součet(3, 7) ¶          // → 10
```

```zymbol
klasifikuj = x -> {
    ? x > 0 { <~ "kladné" }
    _? x < 0 { <~ "záporné" }
    <~ "nula"
}
>> klasifikuj(-4) ¶         // → záporné
```

```zymbol
faktor = 3
ztroj = x -> x * faktor
>> ztroj(7) ¶          // → 21
```

```zymbol
vytvoř_sčítač(n) { <~ x -> x + n }
přičti10 = vytvoř_sčítač(10)
>> přičti10(5) ¶           // → 15
```

Lambda nemusí brát žádné parametry:

```zymbol
odpověď = () -> 42
>> odpověď() ¶           // → 42
```

> Lambda zachycuje proměnné souboru **při vytvoření**; pojmenovaná funkce je čte **při volání**.

---

## Pole

```zymbol
arr = [1, 2, 3, 4, 5]
>> arr[1] ¶       // → 1   indexování od 1
>> arr[-1] ¶      // → 5   záporné počítá od konce
>> arr$# ¶        // → 5   délka
```

```zymbol
arr = [1, 2, 3]
>> (arr$+ 6) ¶          // → [1, 2, 3, 6]   přidat
>> (arr$+[2] 99) ¶      // → [1, 99, 2, 3]  vložit na pozici 2
>> (arr$- 3) ¶          // → [1, 2]         odebrat první výskyt
>> (arr$-[1]) ¶         // → [2, 3]         odebrat na indexu 1
>> (arr$[1..2]) ¶       // → [1, 2]         řez, oba konce včetně
>> (arr$? 3) ¶          // → #1             obsahuje
```

Všechna začínají `$`, znaménkem **kolekce**, a pokračují znaménkem, které říká, co se v ní dělá: `#` kolik, `+` přidat, `-` odebrat, `?` zeptat se, zda tam je. A stejně jako u `??`, zdvojení znaménka znamená udělat to vyčerpávajícím způsobem: `$?` se ptá, *zda* hodnota existuje, `$??` se ptá, *na kolika místech*, a vrací je všechny.

```zymbol
arr = [3, 1, 2]
>> (arr$^+) ¶     // → [1, 2, 3]   vzestupně
>> (arr$^-) ¶     // → [3, 2, 1]   sestupně
```

**Pravidlo výsledku.** Jeden operátor a to, co s ním dělá okolní kód, rozhoduje: použito — **staví** a původní nechává nedotčené; zahozeno — **mění**.

```zymbol
arr = [1, 2, 3]
kopie = arr[2]$~ 99
>> arr ¶                // → [1, 2, 3]
>> kopie ¶              // → [1, 99, 3]
arr[2]$~ 99
>> arr ¶                // → [1, 99, 3]
```

> **`=` nikdy nezapisuje do kolekce.** `arr[2] = 99` není forma Zymbolu — `=` dává hodnotu **JMÉNU**. Změna části kolekce je `$~`, v každé kolekci.

`[…]` obsahuje jeden typ a je kontrolováno; záměrná směs je **deklarována** pomocí `#[…]`:

```zymbol
směs = #[1, "dva", #1]
>> směs ¶             // → [1, dva, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Vícerozměrné Indexování

`>` sestupuje do vnořené struktury. Jedna skupina závorek adresuje jeden prvek, bez ohledu na hloubku.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   řádek 2, sloupec 3
>> m[-1>-1] ¶      // → 9   poslední řádek, poslední sloupec
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          plošně: diagonála
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   strukturovaně: rohy
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` **není** forma Zymbolu. Řetězený index je odmítnut pro čtení i zápis — jedna skupina závorek na přístup a `>` jde mezi kroky.

---

## Slovníky

N-tice s pojmenovanými poli je slovník a od v0.0.9 se píše `#(…)`.

```zymbol
osoba = #(jméno: "Jana", věk: 25)
>> osoba.jméno ¶        // → Jana
>> osoba["věk"] ¶    // → 25
```

```zymbol
osoba = #(jméno: "Jana", věk: 25)
pole = "jméno"
>> osoba[pole] ¶     // → Jana
```

Je měnitelný, klíče lze přidávat a lze jím procházet:

```zymbol
sklad = #(hruška: 4)
sklad["jablko"]$~ 10
@ k:sklad { >> k "=" sklad[k] " " }
>> ¶                    // → hruška=4 jablko=10
```

```zymbol
sklad = #(hruška: 4, jablko: 10)
@ (k, v):sklad { >> k ":" v " " }
>> ¶                    // → hruška:4 jablko:10
```

> `#()` je prázdný slovník, čímž `()` nikdy být nemohl — musel by být i prázdnou n-ticí. Holé `(x: 1)` je odmítnuto s touto zprávou: *a dictionary is written `#(…)`* — «slovník se píše `#(…)`».
> Slovník se adresuje klíčem, nikdy pozicí, takže `osoba[1]` je chyba.

---

## N-tice

N-tice jsou **neměnitelné** uspořádané kontejnery, které drží hodnoty různých typů.

```zymbol
bod = (10, 20)
>> bod[1] ¶           // → 10
data = (42, "Ahoj", #1, 3.14)
>> data[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Každý pokus změnit n-tici na místě je chyba, ať je operátor jakýkoli — neměnitelnost je vlastnost hodnoty, ne výjimka uvnitř každého `$`.

---

## Destrukce

```zymbol
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
arr = [10, 20, 30, 40, 50]
[první, *zbytek] = arr
>> první ¶            // → 10
>> zbytek ¶              // → [20, 30, 40, 50]
```

```zymbol
bod = (100, 200)
(px, py) = bod
>> px " " py ¶          // → 100 200
```

```zymbol
osoba = #(jméno: "Sára", věk: 25)
#(jméno: n, věk: v) = osoba
>> n " " v ¶            // → Sára 25
```

> Tvar závorek je typovaný: `[…]` bere pole, `(…)` n-tici, `#(…)` slovník. Poslední jméno **pohltí zbytek**, takže destrukce nikdy neselže na délku — `(a, b, c) = (1,2,3,4,5)` dá `c = (3,4,5)` a `##_`, když nic nezbývá.

---

## Funkce Vyššího Řádu

```zymbol
čísla = [1, 2, 3, 4, 5]
>> (čísla$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (čísla$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (čísla$< (0, (akum, x) -> akum + x)) ¶ // → 15
```

```zymbol
čísla = [1, 2, 3, 4, 5, 6]
zdvoj(x) { <~ x * 2 }
je_velké(x) { <~ x > 3 }
>> (čísla$> zdvoj) ¶    // → [2, 4, 6, 8, 10, 12]
>> (čísla$| je_velké) ¶    // → [4, 5, 6]
```

```zymbol
základ = [#(jméno: "Karla", věk: 28), #(jméno: "Sára", věk: 25)]
podle_věku = základ$^ (a, b -> a.věk < b.věk)
>> podle_věku[1].jméno ¶     // → Sára
```

> Pojmenovaná funkce jde do HOF **bez závorek**: `čísla$> zdvoj`. Napsat `čísla$> (zdvoj)` je chyba parsování, protože `(` otevírá lambdu.

---

## Operátor Trubky

```zymbol
zdvoj = x -> x * 2
přičti = (a, b) -> a + b
inc = x -> x + 1
>> (5 |> zdvoj(_)) ¶    // → 10
>> (10 |> přičti(_, 5)) ¶  // → 15
>> (5 |> zdvoj(_) |> inc(_)) ¶ // → 11
```

---

## Zpracování Chyb

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dělení nulou" ¶  // → dělení nulou
} :! {
    >> "jiné: " _err ¶
} :> {
    >> "vždy se spustí" ¶        // → vždy se spustí
}
```

| Druh | Kdy |
|------|------|
| `##Div` | Dělení nulou |
| `##Index` | Index mimo meze |
| `##Key` | Klíč chybí ve slovníku |
| `##Range` | Mimo bezpečný rozsah celých čísel |
| `##Type` | Neshoda typů |
| `##Parse` | Parsování dat |
| `##IO` | Soubor / systém |
| `##Network` | Síťové chyby |
| `##DB` | Databáze |
| `##Time` | Datum, které neexistuje |
| `##_` | Jakákoli chyba (chytá vše) |

`!` je znaménko **chyby a síly** a čte se stejně v obou rodinách: `$!` se ptá hodnoty, zda je chybou; `$!!`, se zdvojeným znaménkem, ji šíří nahoru bez ptaní.

> Selhání standardní knihovny se vracejí jako **měkké chybové hodnoty**, které testujete pomocí `$!` nebo chytáte pomocí `!?`, místo aby se program ukončil. `$!!` šíří jednu k volajícímu.

---

## Moduly

```zymbol
# kalk {
    #> { sečti, PI }

    PI := 3.14159
    sečti(a, b) { <~ a + b }
}
```

```zymbol
<# ./kalk => k

>> k::sečti(5, 3) ¶
>> k.PI ¶
```

```zymbol
# moje_knihovna {
    #> { vnitřní_sečti => součet }

    vnitřní_sečti(a, b) { <~ a + b }
}
```

Dvě znaménka modulu jsou stejná myšlenka, nyní aplikovaná na soubory: `#` je úroveň **deklarace** — co věc *je*, ne kolik stojí — a šipka říká, kterým směrem kód putuje:

```text
<#   šipka vstupuje: importovat, přinést z jiného souboru
#>   šipka vystupuje: exportovat, nabídnout jiným souborům
```

Znaménko směru vždy sedí na hraně obrácené směrem, kterým ukazuje. To je stejný důvod, proč `<~` se vrací doleva (z funkce) a `->` vstupuje doprava (do těla lambdy).

> **Modul deklaruje, co exportuje.** Blok `#>` je povinný — jeho vynechání je **E014** a `#> { }` je způsob, jakým modul říká, že jeho povrch je prázdný. `::` volá funkci, `.` čte konstantu. V těle modulu se mohou objevit pouze importy, blok exportu, literální inicializátory a definice funkcí; cokoli spustitelného je **E013**.

---

## Standardní Knihovna

Nativní moduly, importované jako každý jiný:

| Modul | Funkce |
|--------|-----------|
| `std/math` | `sqrt exp ln log pow abs ceil floor round min max sin cos tan asin acos atan atan2 sinh cosh tanh sigmoid` · `PI` `E` |
| `std/random` | `entero rango peso_f64` |
| `std/json` | `decode decode_map encode` |
| `std/io` | `read write append exists delete list mkdir` |
| `std/net` | `get post post_json head` |
| `std/db` | `connect exec query query_one tx commit rollback` … |
| `std/term` | `width pad_left pad_right center truncate` |
| `std/time` | `now today parts of format add diff` |

```zymbol
<# std/math => m

>> m::sqrt(16.0) ¶      // → 4
>> m.PI ¶               // → 3.141592653589793
```

```zymbol
<# std/term => t

>> t::width("手番") ¶            // → 4   dva glyfy, čtyři sloupce
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

den = T::of(2026, 1, 31)
>> T::format(den, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(den, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` měří **zobrazovací sloupce**, ne znaky: CJK a většina emoji mají 2 sloupce, takže tabulku rozvrhujte pomocí `t::width`, nikdy pomocí `$#`.
> V `std/time` je okamžik v milisekundách od epochy. Pod jedním dnem je to trvání, od jednoho dne výše je to kalendář — takže měsíc padne na stejný den měsíce, omezený. `rozdíl(a, b)` je `a - b`, takže dřívější okamžik první dává zápornou odpověď.

---

## Balíčky

`.zyp` zabalí program o více souborech do jednoho přenosného souboru. Je to archiv **zdrojového kódu**, ne binární soubor, takže běží kdekoli, kde běží binárka `zymbol`.

```bash
zymbol package můjprojekt/ --script main.zy -o můjprojekt.zyp
zymbol run můjprojekt.zyp
```

> Archiv nese manifest (`zyp.toml`), který deklaruje vstupní skripty a požadovanou verzi enginu. `zymbol run` jej rozbalí do dočasného adresáře a spustí odtamtud, takže kód je na jedno použití, zatímco to, co skript zapíše, přistane ve vašem skutečném pracovním adresáři. Playground také načítá soubory `.zyp`.

---

## Číselné Režimy

Zymbol může zapisovat čísla v **69 číslicových písmech Unicode** — dévanágarí, arabsko-indické, thajské, klingonské pIqaD, matematická tučná, segmenty LCD a další. Režim je globální pro proces a ovlivňuje výstup; aritmetika se nemění.

```zymbol
#०९#    // dévanágarí   (U+0966–U+096F)
#٠٩#    // arabsko-indické (U+0660–U+0669)
#๐๙#    // thajské         (U+0E50–U+0E59)
#09#    // návrat k ASCII
```

```zymbol
x = 42
>> x ¶                  // → 42
#०९#
>> x ¶                  // → ४२
>> 3.14 ¶               // → ३.१४
>> #1 ¶                 // → #१
#09#
```

Číslice jakéhokoli podporovaného písma jsou platné literály ve zdroji:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Čtení je symetrické — číslice je chápána v jakémkoli písmu:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` je vždy ASCII, takže `#0` zůstává vizuálně odlišné od číslice nula v každém písmu.
> `#,` a `#^` také zapisují své číslice v aktivním písmu a oddělovače je následují — ale pár se nikdy neobrátí: `,` seskupuje a `.` odděluje, v každém písmu.

---

## Datové Operátory

```zymbol
f = ##.42         // na Desetinné číslo
i = ###3.7        // na Celé číslo, zaokrouhleno  → 4
t = ##!3.7        // na Celé číslo, zkráceno  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Desetinné číslo se tiskne jako číslice, nikdy jako exponent, a vypouští koncovou `.0` — `##.42` píše `42` a stále je Desetinné číslo, jak ukazuje `f#?`.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   bezpečné při selhání: vrací vstup nezměněný
>> ##!'A' ¶        // → 65    kódový bod Znaku
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          zaokrouhlit na 2 desetinná místa
>> #!2|pi| ¶       // → 3.14          zkrátit na 2 desetinná místa
>> #,|1234567| ¶   // → 1,234,567     oddělovače tisíců
>> #^|12345.678| ¶ // → 1.2345678e4   vědecká notace
```

```zymbol
>> 0x41 ¶        // → A   šestnáctkově
>> 0b01000001 ¶  // → A   dvojkově
>> 0o101 ¶       // → A   osmičkově
>> 0d65 ¶        // → A   desítkově
```

> Literál základu v rozsahu ASCII je **Znak**: `0d65 == 'A'` je `#1` a `0d65 == 65` je `#0`. Všechny čtyři základy píší stejný znak.

---

## Integrace se Shellem

```zymbol
dnes = <\ date +%Y-%m-%d \>
>> "Dnes: " dnes
```

```zymbol
výstup = </"./podskript.zy"/>
>> výstup
```

> `<\ … \>` zachycuje stdout a stderr s odstraněným koncovým novým řádkem.
> `>< args` zachycuje argumenty příkazového řádku jako pole řetězců.

---

## Úplný Příklad: FizzBuzz

```zymbol
klasifikuj(číslo) {
    ? číslo % 15 == 0 { <~ "FizzBuzz" }
    _? číslo % 3  == 0 { <~ "Fizz" }
    _? číslo % 5  == 0 { <~ "Buzz" }
    <~ číslo
}

@ i:1..20 { >> klasifikuj(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (jeden na řádek)
```

---

## Jak se Znaménka Kombinují

Viděli jste to samé po celé této příručce: **operátor není kresba k zapamatování, je to několik znamének v řadě a každé přispívá svým významem.** Nyní, když je znáte všechny, zde je úplný vzor.

Nejprve přichází **ve kterém světě jsme**:

| Znaménko | Svět | Viděli jste jej v |
|--------|-------|----------------------------|
| `$` | kolekce | `$#` `$+` `$?` `$^-` |
| `@` | čas, vše, co se opakuje | `@!` `@>` `@~` |
| `#` | co věc *je*, ne její hodnota | `#?` `#(…)` `<#` `#>` |
| `>>` | z programu ven | `>>` `>>!` `>>?` |
| `<<` | do programu | `<<` `<<\|` `<<\|?` |
| `?` | ptát se, bez závazku | `?` `_?` `??` `$?` |
| `!` | síla, nebo chyba | `@!` `$!` `!?` |

Pak přichází **co se tam dělá**: `+` přidat, `-` odebrat, `^` uspořádat, `~` upravit, `#` počítat, `|` jedna jednotka, `:` vázat jméno.

A dvě pravidla, která nikdy neselžou:

**Zdvojení znaménka jej činí vyčerpávajícím.** `?` se ptá jednou, `??` testuje mnoho případů. `$?` se ptá, zda hodnota existuje, `$??` vrací každé místo, kde je. `!` označí chybu, `!!` ji šíří bez ptaní.

**Znaménko režimu přichází vždy jako poslední.** Když se `?` nebo `!` objeví, aby řekly, *jak* se něco dělá — váhavě nebo silou — jsou posledním znaménkem operátoru: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:vnější!`. Nikdy po nich nenásleduje operace.

Z toho plyne něco praktického: **kombinace, kterou jste nikdy neviděli, už má smysl, než se na ni podíváte.** Pokud `$` je kolekce a `^` je pořadí a `-` je opak, pak `$^-` řadí sestupně a nikdo vám to nemusel říkat.

Ne celý inventář funguje takto a říci to je lepší než předstírat. Většina operátorů se čistě rozpadá. Šest se rozpadá, ale znamená víc než své části: `!?` `:!` `:>` `|>` `::` `$++`. A deset se musí naučit nazpaměť, protože se vůbec nerozpadají: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Počítat neprůhledné, místo abychom předpokládali, že jich je málo, je záměrné: jsou skutečnou cenou zapamatování jazyka. Úplný odkaz — inventář, deklarované homografy a pravidla, která musí nový operátor splnit, aby existoval — je `SYMBOLS.md` v repozitáři interpretu.

---

## Odkaz na Symboly

| Symbol | Operace | Symbol | Operace |
|--------|-----------|--------|-----------|
| `=` | proměnná | `$#` | délka |
| `:=` | konstanta | `$+` | přidat |
| `>>` | výstup | `$+[i]` | vložit na index (od 1) |
| `<<` | vstup | `$-` | odebrat první podle hodnoty |
| `¶` / `\\` | nový řádek | `$--` | odebrat vše podle hodnoty |
| `?` | pokud | `$-[i]` | odebrat na indexu (od 1) |
| `_?` | jinak-pokud | `$-[i..j]` | odebrat rozsah (od 1) |
| `_` | jinak / zástupný znak | `$?` | obsahuje |
| `??` | porovnání | `$??` | najít všechny indexy (od 1) |
| `\|\|` | nebo-vzor ve větvi porovnání | `$[s..e]` | řez (od 1) |
| `@` | smyčka | `$>` | mapovat |
| `@ N { }` | smyčka N krát | `$\|` | filtrovat |
| `@!` | přerušit | `$<` | redukovat |
| `@>` | pokračovat | `$/ oddělovač` | rozdělit řetězec |
| `@:jméno { }` | smyčka s nálepkou | `$++ a b c` | postavit zřetězením |
| `@:jméno!` | přerušit nálepku | `$~~[p:r]` | nahradit v řetězci |
| `@:jméno>` | pokračovat nálepkou | `$*` | opakovat řetězec |
| `->` | lambda | `arr[i]$~ v` | JEDINÁ forma aktualizace |
| `<~` | návrat / výstupní parametr | `~` | parametr pracovní kopie |
| `arr[i>j]` | navigační index | `arr[p ; q]` | plochá extrakce |
| `$^+` | řadit vzestupně | `$^-` | řadit sestupně |
| `$^` | řadit s komparátorem | `\|>` | trubka |
| `!?` | zkusit | `:!` | chytit |
| `:>` | nakonec | `$!` | je chyba |
| `$!!` | šířit chybu | `#1` / `#0` | pravda / nepravda |
| `##_` | Jednotka — nepřítomnost | `[…]` | pole, jeden typ |
| `#[…]` | pole, deklarovaná směs | `#(…)` | slovník |
| `(…)` | poziční n-tice | `#()` | prázdný slovník |
| `<#` | importovat | `#>` | exportovat |
| `#` | deklarovat modul | `::` | volat modul |
| `.` | přístup k poli / konstantě | `#?` | metadata typu |
| `#\|..\|` | parsovat číslo | `##.` | převést na Desetinné číslo |
| `###` | převést na Celé číslo (zaokrouhlit) | `##!` | převést na Celé číslo (zkrátit) |
| `#.N\|..\|` | zaokrouhlit | `#!N\|..\|` | zkrátit |
| `#,\|..\|` | oddělovače tisíců | `#^\|..\|` | vědecké |
| `#d0d9#` | přepnout číselný režim | `#09#` | návrat k ASCII |
| `<\ ..\>` | spustit shell | `><` | argumenty CLI |
| `\ var` | zničit proměnnou | `°x` / `x°` | horká definice |
| `>>\|` | blok TUI (alternativní obrazovka) | `>>~` | pozicovaný výstup |
| `>>!` | vyčistit obrazovku | `>>?` | dotaz na velikost terminálu |
| `<<\|` | blokující stisk klávesy | `<<\|?` | neblokující stisk klávesy |
| `@~ N` | spát N milisekund | `0d` `0x` `0o` `0b` | literály základu |

---

## Protokol Změn Vydání

### v0.0.9 — Kolekce Rozhodly _(září 2026)_

- **Zlomová** Slovník má vlastní notaci: `#(klíč: hodnota)`. Holé `(x: 1)` je odmítnuto a `#()` je prázdný slovník — což `()` nikdy nemohl být
- **Zlomová** Indexované přiřazení staženo: `arr[i] = v` a všechny složené formy. `=` dává hodnotu **JMÉNU**; změna části kolekce je `$~`
- **Zlomová** Řetězený index `m[i][j]` je odmítnut pro čtení i zápis — `>` jde mezi kroky
- **Zlomová** Modul musí deklarovat, co exportuje (**E014**); `#> { }` je způsob, jakým modul říká, že jeho povrch je prázdný
- **Zlomová** Specifikátor smyčky je počet nebo podmínka — žádná pravdivost. `@ []` a `@ 3.5` jsou odmítnuty
- **Přidáno** `##_` — literál Jednotky a způsob, jakým se program ptá, zda něco chybí
- **Přidáno** `#[…]` — pole, jehož směs typů prvků je deklarována
- **Přidáno** `#?` rozlišuje čtyři kolekce: `##]` `##[` `##)` `##(`
- **Přidáno** `std/time` — hodiny a občanský kalendář, s pásmy a kalendářní aritmetikou
- **Přidáno** Nejvyšší úroveň `<~>` je návratový kód programu
- **Přidáno** `@ (k, v):páry` — vzor v hlavičce smyčky
- **Přidáno** `#|c|` čte číslici v kterémkoli ze 69 písem; `#,` a `#^` píší v aktivním
- **Změněno** `Celé číslo` je bezpečné celé číslo, ±(2⁵³ − 1), selhání-zavřeno v každém enginu
- **Změněno** Pojmenovaná funkce čte proměnné souboru v době volání, hodnotou
- **Změněno** Příkaz, který čte jen jméno, varuje místo aby prošel tiše
- **Enginy** 660 z 666 souborů korpusu souhlasí ve všech třech enginech, 0 se liší

### v0.0.8 — Automatické Uvolnění, `std/term` a Balíčky _(srpen 2026)_

- **Přidáno** Automatická destrukce při posledním použití — neviditelné; snižuje jen špičkovou paměť
- **Přidáno** `std/term` — metriky zobrazení ve sloupcích terminálu
- **Přidáno** `##!` na `Znaku` — jeho kódový bod Unicode
- **Přidáno** Vzory nebo v porovnání: `'p' || 'P' => …`, alternativy jakéhokoli druhu v jedné větvi
- **Přidáno** Balíčky Zymbol (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Přidáno** `<~>` v místě volání je povinné, kde volaný deklaruje výstupní parametr
- **Opraveno** Parita systému modulů v registrovém VM

### v0.0.7 — Nativní Standardní Knihovna _(červenec 2026)_

- **Přidáno** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — všechny s měkkými chybovými hodnotami
- **Přidáno** Typovaný/validovaný vstup: `<< ##.(5,2) "cena: " p`
- **Přidáno** Postfixové operátory přímo v `>>` — bez závorek
- **Změněno** Formátovač zavřený při selhání: odmítá zapsat výstup, který nedokáže znovu přečíst

### v0.0.6 — Vylepšení a Vědecká Stdlib _(červen 2026)_

- **Zlomová** `=>` nahrazuje `:` ve větvích porovnání a `<=` v aliastech importu/exportu
- **Přidáno** `std/math` a `std/random`
- **Přidáno** Aktualizace slovníku podle klíče: `d["k"]$~ hodnota`

### v0.0.5 — Primitivy TUI a Horká Definice _(květen 2026)_

- **Přidáno** Blok TUI `>>| { }`, pozicovaný výstup `>>~`, vstup z kláves `<<|` a `<<|?`
- **Přidáno** `>>!` vyčistit obrazovku, `>>?` velikost terminálu, `@~ N` spát
- **Přidáno** Horká definice `°x` / `x°` a opakování řetězce `$*`

### v0.0.4 — Indexování od 1 a Prvotřídní Funkce _(duben 2026)_

- **Zlomová** Všechno indexování je **od 1** — `arr[1]` je první prvek
- **Přidáno** Pojmenované funkce jako prvotřídní hodnoty; syntaxe bloku modulu `# jméno { }`
- **Přidáno** Vícerozměrné indexování `arr[i>j>k]` a plochá extrakce `arr[p ; q]`

### v0.0.3 — Číselné Systémy Unicode _(duben 2026)_

- **Přidáno** 69 bloků číslic Unicode s tokenem přepnutí režimu `#d0d9#`
- **Přidáno** Boolean literály v jakémkoli písmu — `#१` / `#०`

### v0.0.2 — Redesign API Kolekcí _(březen 2026)_

- **Přidáno** Rodina operátorů `$` pro pole a řetězce
- **Přidáno** Destrukční přiřazení a záporné indexy

### v0.0.1 — První Veřejné Vydání _(březen 2026)_

- Interpret procházející strom + registrový VM (`--vm`)
- Všechny základní konstrukce: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Plné identifikátory Unicode, systém modulů, lambdy, uzávěry, zpracování chyb
- REPL, LSP, rozšíření VS Code, formátovač (`zymbol fmt`)

---

_Zymbol-Lang — Symbolický. Univerzální. Neměnný._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Licence:** tato příručka je licencována pod [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024-2026 Tým Zymbol-Lang. Úplné znění: `LICENSE-CC-BY-SA-4.0` v <https://github.com/zymbol-lang/web>. Interpret a prohlížečový engine (`zymbol.js`) jsou samostatná díla, licencovaná pod AGPL-3.0-only.
