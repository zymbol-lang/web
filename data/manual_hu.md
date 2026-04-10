# Zymbol-Lang Kompakt Kézikönyv

**Zymbol-Lang** egy szimbolikus programozási nyelv. Nem használ kulcsszavakat — minden szimbólum. Ugyanúgy működik bármely emberi nyelven. Nincsenek kulcsszavak (`ha`, `ciklus`, `visszatérés` nem léteznek — csak szimbólumok: `?`, `@`, `<~`). Teljes Unicode-támogatás — azonosítók bármely nyelven vagy emojival 👋

---

## Változók és Konstansok

```zymbol
x = 10           // változó (módosítható)
PI := 3.14159    // állandó (nem módosítható — hiba újrahozzárendeléskor)
név = "Ana"
aktív = #1       // logikai igaz
👋 := "Szia"
```

### Összetett Hozzárendelés

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

---

## Adattípusok

| Típus         | Példa               | `#?` Szimbólum | Megjegyzés                          |
|---------------|---------------------|----------------|-------------------------------------|
| Egész         | `42`, `-7`          | `###`          | 64 bites előjeles                   |
| Lebegőpontos  | `3.14`, `1.5e10`    | `##.`          | Tudományos jelölés OK               |
| Karakterlánc  | `"szia"`            | `##"`          | Interpoláció: `"Szia {név}"`        |
| Karakter      | `'A'`               | `##'`          | Egy Unicode karakter                |
| Logikai       | `#1`, `#0`          | `##?`          | NEM numerikus 1 és 0                |
| Tömb          | `[1, 2, 3]`         | `##]`          | Az összes elemnek azonos típusúnak kell lennie|
| Tuple         | `(a, b)`            | `##)`          | Pozicionális                        |
| Nevesített Tuple | `(x: 1, y: 2)`   | `##)`          | Névvel vagy indexszel érhető el     |

---

## Kimenet és Bemenet

```zymbol
// Kimenet — NEM ad automatikusan sortörést
>> "Szia" ¶                             // ¶ vagy \\ explicit sortörést ad
>> "a=" a " b=" b ¶                     // több érték egymás mellé írással
>> "összeg=" összeadás(2, 3) ¶          // függvényhívás bármely pozícióban
>> (arr$#) ¶                            // postfix operátorok zárójeleket igényelnek

// Bemenet
<< név                                  // prompt nélkül — változóba olvas
<< "A neved? " név                      // prompttal
```

> `¶` vagy `\\` egyenértékű sortörésként.

---

## Operátorok

```zymbol
// Aritmetika
5 + 2    // → 7
5 - 2    // → 3
5 * 2    // → 10
5 / 2    // → 2.5
5 % 2    // → 1
5 ^ 2    // → 25   (hatványozás)

// Összehasonlítás (#1 vagy #0 értéket ad)
5 == 5   // → #1
5 != 4   // → #1
5 > 4    // → #1
5 < 4    // → #0
5 >= 5   // → #1
5 <= 4   // → #0

// Logikai
#1 && #0    // → #0   (és)
#1 || #0    // → #1   (vagy)
!#1         // → #0   (nem)
```

---

## Karakterláncok

Három érvényes forma — mindegyik a saját kontextusához:

```zymbol
név = "Ana"
szám = 25

// 1. Vessző — = vagy := hozzárendeléseknél
msg = "Szia ", név, "!"                // → Szia Ana!
TITLE := "Felhasználó: ", név

// 2. Egymás mellé írás — >> kimenetben
>> "Szia " név " te " szám " éves vagy" ¶    // → Szia Ana te 25 éves vagy

// 3. Interpoláció — bármely kontextusban
leírás = "Szia {név}, te {szám} éves vagy"   // → Szia Ana, te 25 éves vagy
```

```zymbol
// Csere — s$~~["régi":"új"]
s = "szia világ"
s = s$~~["világ":"föld"]        // → "szia föld"
s = s$~~["a":"Á":1]             // → "sziÁ föld"   első N előfordulás cseréje
```

> **Megjegyzés**: `+` csak számokhoz való. Karakterláncokkal való használata figyelmeztetést generál.

---

## Vezérlőfolyam

```zymbol
x = 7

// Egyszerű ha
? x > 0 { >> "pozitív" ¶ }

// ha / ha egyébként / egyébként
? x > 100 {
    >> "nagy" ¶
} _? x > 0 {
    >> "pozitív" ¶
} _? x == 0 {
    >> "nulla" ¶
} _ {
    >> "negatív" ¶
}
```

A `{ }` blokkok **kötelezőek** még egyetlen sor esetén is.

---

## Illesztés

```zymbol
// Illesztés tartományokkal
pont = 85
értékelés = ?? pont {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> értékelés ¶    // → B

// Illesztés feltételekkel (tetszőleges feltételek)
hőmérséklet = -5
állapot = ?? hőmérséklet {
    _? hőmérséklet < 0  : "jég"
    _? hőmérséklet < 20 : "hideg"
    _? hőmérséklet < 35 : "meleg"
    _                   : "forró"
}
>> állapot ¶    // → jég

// Illesztés karakterláncokkal
szín = "piros"
kód = ?? szín {
    "piros"  : "#FF0000"
    "zöld"   : "#00FF00"
    _        : "#000000"
}
>> kód ¶
```

---

## Ciklusok

```zymbol
// Befoglaló tartomány: 0..4 iterál 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Tartomány lépéssel
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Fordított tartomány
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Amíg ciklus
szám = 1
@ szám <= 64 { szám *= 2 }
>> szám ¶    // → 128

// Tömb feletti for-each
gyümölcs = ["alma", "körte", "szőlő"]
@ f:gyümölcs { >> f ¶ }

// Karakterlánc karakterei felett
@ c:"szia" { >> c "-" }
>> ¶    // → s-z-i-a-

// Kilépés és folytatás
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> folytatás
    ? i > 7 { @! }          // @! kilépés
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Függvények

```zymbol
// Deklaráció és hívás
összeadás(a, b) { <~ a + b }
>> összeadás(3, 4) ¶    // → 7

// Rekurzió
tényező(szám) {
    ? szám <= 1 { <~ 1 }
    <~ szám * tényező(szám - 1)
}
>> tényező(5) ¶    // → 120

// A függvényeknek izolált hatókörük van — nincs hozzáférés külső változókhoz
globális = 100
tesztelni() {
    x = 42    // csak helyi
    <~ x
}
>> tesztelni() ¶    // → 42
```

> **Fontos**: A megnevezett függvények `név(paraméterek){ }` nem első osztályú értékek.
> Argumentumként való átadáshoz csomagold be: `x -> függvény(x)`.

---

## Lambdák és Lezárások

```zymbol
// Egyszerű lambda (implicit visszatérés)
duplázott = x -> x * 2
összeg = (a, b) -> a + b
>> duplázott(5) ¶    // → 10
>> összeg(3, 7) ¶    // → 10

// Blokk lambda (explicit visszatérés)
osztályoz = x -> {
    ? x > 0 { <~ "pozitív" }
    _? x < 0 { <~ "negatív" }
    <~ "nulla"
}
>> osztályoz(5) ¶     // → pozitív
>> osztályoz(0) ¶     // → nulla
>> osztályoz(-5) ¶    // → negatív

// Lezárások — a lambdák rögzítik a külső hatókör változóit
faktor = 3
háromszorosára = x -> x * faktor    // rögzíti a 'faktor' változót
>> háromszorosára(7) ¶    // → 21

// Függvénygyár
összeadó_készítő(n) { <~ x -> x + n }
add10 = összeadó_készítő(10)
add20 = összeadó_készítő(20)
>> add10(5) ¶    // → 15
>> add20(5) ¶    // → 25

// Lambdák értékként: tömbben tárolva
műveletek = [x -> x+1, x -> x*2, x -> x*x]
>> műveletek[0](5) ¶    // → 6
>> műveletek[1](5) ¶    // → 10
>> műveletek[2](5) ¶    // → 25
```

---

## Tömbök

A tömbök **módosíthatók** és **azonos típusú** elemeket tartalmaznak.

```zymbol
arr = [10, 20, 30, 40, 50]

// Hozzáférés (0-alapú index)
>> arr[0] ¶    // → 10
>> arr[2] ¶    // → 30
>> arr[-1] ¶   // → 50   negatív index

// Hossz (zárójeleket igényel >>-ben)
szám = arr$#
>> szám ¶          // → 5
>> (arr$#) ¶       // → 5

// Hozzáfűzés, eltávolítás, tartalmaz, szelet
arr = arr$+ 60               // [10, 20, 30, 40, 50, 60]
arr = arr$- 0                // index 0 eltávolítása: [20, 30, 40, 50, 60]
van = arr$? 30               // → #1
idx = arr$?? 30              // → [1]   az érték összes indexe
szelet = arr$[0..2]          // szelet [0,2): [20, 30]
darab = arr$[0:3]            // darabszám-alapú: [20, 30, 40]

// Közvetlen elemfrissítés (csak tömbök)
arr[1] = 99              // hozzárendelés
arr[0] += 5              // összetett: +=  -=  *=  /=  %=  ^=

// Funkcionális frissítés — új tömböt ad vissza; az eredeti nem változik
arr2 = arr[1]$~ 77           // → [20, 77, 40, 50, 60]

// Rendezés (primitívek)
num = [3, 1, 4, 1, 5]
növekvő  = num$^+            // → [1, 1, 3, 4, 5]
csökkenő = num$^-            // → [5, 4, 3, 1, 1]

// Tuple-ok rendezése komparátor lambdával
párok = [(2,"b"), (1,"a"), (3,"c")]
rendezett = párok$^ ((a,b) -> a[0] - b[0])    // rendezés az első elem szerint

// Egymásba ágyazott tömbök
mátrix = [[1,2],[3,4],[5,6]]
>> mátrix[1][0] ¶    // → 3

// For-each
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` **új tömböt** adnak vissza — rendelj vissza: `arr = arr$+ 4`.
> Láncolás nem lehetséges: használj két külön hozzárendelést.
> `arr$??` és `arr$[s:n]` más szintaxist használnak, mint `arr$[s..e]` — lásd Szimbólumreferencia.

**Értékszemantika** — egy tömb másik változóhoz rendelése független másolatot hoz létre:

```zymbol
a = [1, 2, 3]
b = a
a[0] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b érintetlen
```

---

## Destrukturálás

```zymbol
// Tömb destrukturálása
arr = [10, 20, 30]
[a, b, c] = arr
>> a ¶    // → 10
>> b ¶    // → 20

// Pozicionális tuple destrukturálása
pt = (3, 4)
(x, y) = pt
>> x ¶    // → 3

// Nevesített tuple destrukturálása
személy = (név: "Alice", kor: 25)
(név: n, kor: k) = személy
>> n ¶    // → Alice
>> k ¶    // → 25
```

---

## Tuple-ök

A tuple-ök **megváltoztathatatlan** rendezett tárolók, amelyek **különböző típusú** értékeket tartalmazhatnak. A tömböktől eltérően az elemek a létrehozás után nem módosíthatók.

```zymbol
// Pozicionális tuple
pont = (10, 20)
>> pont[0] ¶    // → 10
>> pont[1] ¶    // → 20

adatok = (42, "szia", #1, 3.14)
>> adatok[2] ¶     // → #1

// Nevesített tuple
személy = (név: "Alice", kor: 25)
>> személy.név ¶    // → Alice
>> személy.kor ¶    // → 25
>> személy[0] ¶     // → Alice (index is működik)

// Egymásba ágyazott
pos = (x: 3, y: 4)
p = (pos: pos, cimke: "kezdőpont")
>> p.cimke ¶    // → kezdőpont
>> p.pos.x ¶    // → 3
```

**Megváltoztathatatlanság** — bármilyen kísérlet egy tuple elem módosítására futásidejű hibát okoz:

```zymbol
t = (10, 20, 30)
// t[0] = 99    // ❌ futásidejű hiba: a tuple-ök megváltoztathatatlanok
// t[0] += 5    // ❌ ugyanaz a hiba
```

Módosított érték levezetéséhez használd a `$~` operátort (funkcionális frissítés) — **új** tuple-t ad vissza:

```zymbol
t = (10, 20, 30)
t2 = t[1]$~ 999
>> t ¶     // → (10, 20, 30)   ← az eredeti változatlan
>> t2 ¶    // → (10, 999, 30)

// Nevesített tuple — explicit újraépítés
személy = (név: "Alice", kor: 25)
idősebb = (név: személy.név, kor: 26)
>> személy.kor ¶    // → 25
>> idősebb.kor ¶    // → 26
```

---

## Magasabb Rendű Függvények

A HOF operátorok **inline lambdát** igényelnek — nem közvetlen lambda változót.

```zymbol
számok = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Leképezés ($>)
kettőzött = számok$> (x -> x * 2)
>> kettőzött ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Szűrés ($|)
páros = számok$| (x -> x % 2 == 0)
>> páros ¶    // → [2, 4, 6, 8, 10]

// Redukálás ($<) — (kezdeti érték, (acc, elem) -> kifejezés)
összesen = számok$< (0, (acc, x) -> acc + x)
>> összesen ¶    // → 55

// Nincs közvetlen láncolás — közbenső változókat használj
lépés1 = számok$| (x -> x > 5)
lépés2 = lépés1$> (x -> x * x)
>> lépés2 ¶    // → [36, 49, 64, 81, 100]
```

---

## Csővezeték-operátor

```zymbol
// |> a bal értéket _ ként adja át a jobb kifejezésnek
eredmény = 5 |> _ * 2 |> _ + 1
>> eredmény ¶    // → 11

// Láncolva alkalmazott transzformációk
szavak = ["szia", "világ"]
kimenet = szavak
    |> _$> (w -> w$#)              // leképezés hosszakra: [4, 5]
    |> _$< (0, (a,x) -> a+x)      // összegzés: 9
>> kimenet ¶    // → 9
```

---

## Hibakezelés

```zymbol
// Próba / Elkapás / Végül
!? {
    x = 10 / 0
} :! ##Div {
    >> "nullával való osztás" ¶
} :! ##IO {
    >> "IO hiba" ¶
} :! {
    >> "egyéb hiba: " _err ¶    // _err tartalmazza a hibaüzenetet
} :> {
    >> "mindig lefut" ¶
}

// Elkapás index típusnál
!? {
    arr = [1, 2, 3]
    v = arr[10]
} :! ##Index {
    >> "index határon kívül" ¶
}
```

### Hibatípusok

| Típus       | Mikor következik be        |
|-------------|----------------------------|
| `##Div`     | Nullával való osztás        |
| `##IO`      | Fájl / rendszer             |
| `##Index`   | Index határon kívül         |
| `##Type`    | Típushiba                   |
| `##Parse`   | Adatelemzési hiba           |
| `##Network` | Hálózati hibák              |
| `##_`       | Bármely hiba (mindent elfog)|

---

## Modulok

```zymbol
// Fájl: lib/szamitas.zy
# szamitas                // deklaráció — mindig fent

#> {                      // exportok — DEFINÍCIÓK ELŐTT kell lenniük
    összeadás
    get_PI
}

_PI := 3.14159

összeadás(a, b) { <~ a + b }
get_PI() { <~ _PI }       // getter konstanshoz (szükséges kerülőút)
```

```zymbol
// Fájl: main.zy
<# ./lib/szamitas <= sz    // alias kötelező

>> sz::összeadás(5, 3) ¶   // → 8  — hívás ::-vel
pi = sz::get_PI()
>> pi ¶                     // → 3.14159
```

> **Megjegyzés**: `alias.NÉV` konstansok eléréséhez nem működik — használj getter függvényt.

---

## Számjegy Módok

A Zymbol **69 Unicode számjegyírásban** képes számokat megjeleníteni — Devanagari, Arab-Indiai, Thai, Klingon pIqaD, Matematikai Félkövér, LCD-szegmensek stb. Az aktív mód csak a `>>`-kimenetet befolyásolja; a belső aritmetika mindig bináris.

### Írás aktiválása

Írja be a célírás `0` és `9` számjegyét `#…#` közé:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arab-Indiai   (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // visszaállítás ASCII-re
```

### Kimenet és logikai értékek

```zymbol
x = 42
>> x ¶          // → 42   (ASCII alapértelmezett)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (tizedes pont mindig ASCII)
>> 1 + 2 ¶      // → ३

// Logikai értékek: # előtag mindig ASCII, számjegy alkalmazkodik
>> #1 ¶         // → #१   (igaz Devanagari-ban)
>> #0 ¶         // → #०   (hamis — eltér ०  egész szám nullától)

x = 28 > 4
>> x ¶          // → #१   (összehasonlítás eredménye követi az aktív módot)
```

### Natív számjegy-literálok a forráskódban

Bármely támogatott írás számjegyei érvényes literálok — tartományokban, modulóban, összehasonlításokban:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Logikai literálok bármely írásban

`#` + `0` vagy `1` számjegy bármely blokkból érvényes logikai literál:

```zymbol
#٠٩#
نشط = #١        // ugyanaz mint #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> A `#` **mindig ASCII**. A `#0` (hamis) minden írásban vizuálisan mindig eltér a `0`-tól (egész szám nulla).

---

## Adatoperátorok

```zymbol
// Karakterlánc értelmezése számmá
x = #|"42"|          // → 42    (egész)
y = #|"3.14"|        // → 3.14  (lebegőpontos)

// Kerekítés / csonkítás
r = #.2|3.14159|     // → 3.14   kerekítés 2 tizedesre
t = #!2|3.14159|     // → 3.14   csonkítás 2 tizedesre

// Szám formázása
s = #,|1234567.89|    // → "1,234,567.89"  ezreselválasztós formátum
e = #^|0.00042|       // → "4.2e-4"        tudományos jelölés

// Alap literálok
h = 0xFF             // → 255  hexadecimális
b = 0b1010           // → 10   bináris
o = 0o17             // → 15   oktális

// Alap konverzió
hex = 255$>>"16"     // → "FF"
bin = 10$>>"2"       // → "1010"
```

---

## Parancsértelmező Integráció

```zymbol
// Parancsértelmező parancs futtatása és kimenet elfogása
kimenet = <\ ls -la \>
>> kimenet ¶

// Interpoláció a parancsokban
könyvtár = "/tmp"
fájlok = <\ ls {könyvtár} \>

// Többsoros szkriptblokk
eredmény = </
    echo "szia"
    pwd
/>

// Kimenet átirányítása a parancsértelmezőbe (elfogás nélkül)
>< "echo szia"
```

> `><` az elfogás nélkül a parancsértelmezőbe küldi a kimenetet.

---

## Teljes Példa: FizzBuzz

```zymbol
osztályoz(szám) {
    ? szám % 15 == 0 { <~ "SziszZüm" }
    _? szám % 3  == 0 { <~ "Szisz" }
    _? szám % 5  == 0 { <~ "Züm" }
    _ { <~ szám }
}
@ i:1..20 { >> osztályoz(i) ¶ }
```

---

## Szimbólumreferencia

| Szimbólum   | Művelet              | Szimbólum    | Művelet                    |
|-------------|----------------------|--------------|----------------------------|
| `=`         | változó              | `$#`         | hossz                      |
| `:=`        | állandó              | `$+`         | hozzáfűzés (append)        |
| `>>`        | kimenet              | `$+[i]`      | beszúrás indexnél          |
| `<<`        | bemenet              | `$--`        | utolsó eltávolítása        |
| `¶`/`\`     | sortörés             | `$-[i]`      | eltávolítás indexnél       |
| `?`         | ha (if)              | `$-[i..j]`   | tartomány eltávolítása     |
| `_?`        | ha egyébként (elif)  | `$?`         | tartalmaz                  |
| `_`         | egyébként / joker    | `$??`        | összes index az értékhez   |
| `??`        | illesztés            | `$[s..e]`    | szelet                     |
| `@`         | ciklus               | `$>`         | leképezés                  |
| `@!`        | kilépés              | `$\|`        | szűrés                     |
| `@>`        | folytatás            | `$<`         | redukálás                  |
| `->`        | lambda               | `$<`         | redukálás                  |
| `arr[i] = val` | elem frissítése (csak tömbök) | `arr[i] += val` | összetett frissítés |
| `arr[i]$~`  | funkcionális frissítés (új másolat) | `$^+` | növekvő rendezés (primitívek) |
| `$^-`       | csökkenő rendezés (primitívek) | `$^` | rendezés komparátorral (tuple-ök) |
| `<~`        | visszatérés          | `!?`         | próba (try)                |
| `\|>`       | csővezeték           | `:!`         | elkapás (catch)            |
| `#1`        | igaz                 | `$!`         | hiba-e                     |
| `#0`        | hamis                | `$!!`        | hiba továbbterjesztése     |
| `:>`        | végül (finally)      | `#`          | modul deklaráció           |
| `<#`        | import               | `#>`         | export                     |
| `.`         | mezőhozzáférés       | `::`         | modul hívás                |
| `#\|..\|`   | értelmezés (parse)   | `#.N\|..\|`  | N tizedesre kerekítés      |
| `#!N\|..\|` | N tizedesre csonkítás| `#,\|..\|`    | ezreselválasztós formátum  |
| `#d0d9#` | számjegy mód kapcsoló | `#09#` | visszaállítás ASCII-re |
| `#^\|..\|`   | tudományos jelölés   | `<\ \>`      | parancsértelmező parancs   |
| `><`        | parancsértelmező kim.| `$~~[..]`    | csere a karakterláncban    |
| `[a,b]=arr` | destrukturálás       | `(x,y)=tup`  | tuple destrukturálás       |

---

*Zymbol-Lang — Szimbolikus. Univerzális. Változhatatlan.*

## Verzióelőzmények

### v0.0.3 — Unicode Számrendszerek & LSP Fejlesztések _(2026. április)_

- **Hozzáadva** 69 Unicode számjegybloкk a módváltó tokennel `#d0d9#`
- **Hozzáadva** Logikai literálok bármely írásban — `#१` / `#०`, `#١` / `#٠`, stb.
- **Hozzáadva** Klingon pIqaD számjegyek (CSUR PUA U+F8F0–U+F8F9)
- **Hozzáadva** `SetNumeralMode` VM opkód — teljes paritás a tree-walkerrel
- **Hozzáadva** A REPL tiszteletben tartja az aktív számjegy módot visszhangban és változók megjelenítésében
- **Módosítva** A booleánok `>>`-kimenete mostantól tartalmazza a `#` előtagot (`#0` / `#1`) minden módban

### v0.0.2_01 — Operátorok Átnevezése _(2026. márc. 30.)_

- **Módosítva** `c|..|` → `#,|..|` és `e|..|` → `#^|..|` — konzisztens a `#` előtag-családdal
- **Hozzáadva** Exportálási alias: modultagok újraexportálása más névvel

### v0.0.2 — Gyűjtemény API Újratervezés & Telepítők _(2026. márc. 24.)_

- **Hozzáadva** Egységesített `$` operátorcsalád tömbök és karakterláncok számára (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Hozzáadva** Destrukturálás tömbök, tuple-ok és nevesített tuple-ok számára
- **Hozzáadva** Negatív indexek (`arr[-1]` = utolsó elem)
- **Hozzáadva** Natív telepítők — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(2026. márc. 25.)_

- **Hozzáadva** Összetett hozzárendelés `^=`
- **Javítva** Aritmetikai elemző szélső esetei; dokumentációjavítások

### v0.0.1 — Első Nyilvános Kiadás _(2026. márc. 22.)_

- Tree-walker értelmező + regiszter VM (`--vm`, ~4× gyorsabb, ~95% paritás)
- Minden alapkonstrukció: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Teljes Unicode azonosítók, modulrendszer, lambdák, lezárások, hibakezelés
- REPL, LSP, VS Code bővítmény, formázó (`zymbol fmt`)

---

> **Nyilatkozat:** Ezt a dokumentációt mesterséges intelligencia (MI) hozta létre és fordította. Minden erőfeszítést megtettünk a pontosság biztosítása érdekében, de egyes fordítások vagy példák hibákat tartalmazhatnak. A hiteles referencia a [Zymbol-Lang specifikáció](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI). While every effort has been made to ensure accuracy, some translations or examples may contain errors. The canonical reference is the [Zymbol-Lang specification](https://github.com/zymbol-lang/interpreter).
