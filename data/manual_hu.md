# Zymbol-Lang Kompakt Kézikönyv

**Zymbol-Lang** egy szimbolikus programozási nyelv. Nem használ kulcsszavakat — minden szimbólum. Ugyanúgy működik bármely emberi nyelven.

---

## Filozófia

- Nincsenek kulcsszavak (`ha`, `ciklus`, `visszatérés` nem léteznek — csak szimbólumok: `?`, `@`, `<~`)
- Teljes Unicode-támogatás — azonosítók bármely nyelven vagy emojival 👋
- Emberi nyelvtől független — a kód minden nyelven azonos

---

## Változók és Konstansok

```zymbol
x = 10           // változó (módosítható)
PI := 3.14159    // állandó (nem módosítható — hiba újrahozzárendeléskor)
név = "Ana"
aktív = #1       // logikai igaz
👋 := "Szia, Magyar Világ!"
```

### Összetett Hozzárendelés

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

## Adattípusok

| Típus         | Példa               | `#?` Szimbólum | Megjegyzés                          |
|---------------|---------------------|----------------|-------------------------------------|
| Egész         | `42`, `-7`          | `###`          | 64 bites előjeles                   |
| Lebegőpontos  | `3.14`, `1.5e10`    | `##.`          | Tudományos jelölés OK               |
| Karakterlánc  | `"szia"`            | `##"`          | Interpoláció: `"Szia {név}"`        |
| Karakter      | `'A'`               | `##'`          | Egy Unicode karakter                |
| Logikai       | `#1`, `#0`          | `##?`          | NEM numerikus 1 és 0                |
| Tömb          | `[1, 2, 3]`         | `##]`          | Az összes elemnek azonos típusúnak kell lennie |
| Tuple         | `(a, b)`            | `##)`          | Pozicionális                        |
| Nevesített Tuple | `(x: 1, y: 2)`   | `##)`          | Névvel vagy indexszel érhető el     |

---

## Kimenet és Bemenet

```zymbol
// Kimenet — NEM ad automatikusan sortörést
>> "Szia, Magyar Világ!" ¶              // ¶ vagy \\ explicit sortörést ad
>> "a=" a " b=" b ¶                     // több érték egymás mellé írással
>> "összeg=" add(2, 3) ¶                // függvényhívás bármely pozícióban
>> (arr$#) ¶                            // postfix operátorok zárójeleket igényelnek

// Bemenet
<< név                                  // prompt nélkül — változóba olvas
<< "A neved? " név                      // prompttal
```

> `¶` vagy `\\` egyenértékű sortörésként.

---

## Karakterlánc-összefűzés

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
_globális = 100
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
háromszorosára = 3
triple = x -> x * háromszorosára    // rögzíti a 'háromszorosára' változót
>> triple(7) ¶    // → 21

// Függvénygyár
összeadó_készítő(n) { <~ x -> x + n }
add10 = összeadó_készítő(10)
>> add10(5) ¶    // → 15

// Lambdák értékként: tömbben tárolva
műveletek = [x -> x+1, x -> x*2, x -> x*x]
>> műveletek[0](5) ¶    // → 6
>> műveletek[2](5) ¶    // → 25
```

---

## Tömbök

```zymbol
arr = [10, 20, 30, 40, 50]

// Hozzáférés (0-alapú index)
>> arr[0] ¶    // → 10

// Hossz (zárójeleket igényel >>-ben)
szám = arr$#
>> (arr$#) ¶    // → 5

// Hozzáfűzés, eltávolítás, tartalmaz, szelet
arr = arr$+ 60               // hozzáfűzés
arr = arr$- 0                // index 0 eltávolítása
van = arr$? 30               // → #1
szelet = arr$[0..2]          // [20, 30]

// Elem frissítése
arr[1] = 99

// For-each
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` **új tömböt** adnak vissza — rendelj vissza: `arr = arr$+ 4`.
> Láncolás nem lehetséges: használj két külön hozzárendelést.

---

## Tuple-ök

```zymbol
// Nevesített tuple
személy = (név: "Alice", kor: 25)
>> személy.név ¶    // → Alice
>> személy.kor ¶    // → 25
>> személy[0] ¶     // → Alice (index is működik)
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
```

---

## Hibakezelés

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "nullával való osztás" ¶
} :! ##IO {
    >> "IO hiba" ¶
} :! {
    >> "egyéb hiba: " _err ¶
} :> {
    >> "mindig lefut" ¶
}
```

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
# szamitas

#> { összeadás, get_PI }    // exportok DEFINÍCIÓK ELŐTT

_PI := 3.14159
összeadás(a, b) { <~ a + b }
get_PI() { <~ _PI }
```

```zymbol
// Fájl: main.zy
<# ./lib/szamitas <= sz    // alias kötelező

>> sz::összeadás(5, 3) ¶   // → 8
pi = sz::get_PI()
>> pi ¶                     // → 3.14159
```

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

| Szimbólum   | Művelet             | Szimbólum   | Művelet               |
|-------------|---------------------|-------------|-----------------------|
| `=`         | változó             | `$#`        | hossz                 |
| `:=`        | állandó             | `$+`        | hozzáfűzés            |
| `>>`        | kimenet             | `$-`        | eltávolítás (index)   |
| `<<`        | bemenet             | `$?`        | tartalmaz             |
| `¶`/`\`     | sortörés            | `$[s..e]`   | szelet                |
| `?`         | ha                  | `$>`        | leképezés             |
| `_?`        | ha egyébként        | `$\|`       | szűrés                |
| `_`         | egyébként / joker   | `$<`        | redukálás             |
| `??`        | illesztés           | `!?`        | próba                 |
| `@`         | ciklus              | `:!`        | elkapás               |
| `@!`        | kilépés             | `:>`        | végül                 |
| `@>`        | folytatás           | `$!`        | hiba-e                |
| `->`        | lambda              | `$!!`       | hiba továbbterjesztése|
| `<~`        | visszatérés         | `#`         | modul deklaráció      |
| `\|>`       | csővezeték          | `#>`        | export                |
| `#1`        | igaz                | `<#`        | import                |
| `#0`        | hamis               | `::`        | modul hívás           |

---

*Zymbol-Lang — Szimbolikus. Univerzális. Változhatatlan.*

---

> **Nyilatkozat:** Ezt a dokumentációt mesterséges intelligencia (MI) hozta létre és fordította. Minden erőfeszítést megtettünk a pontosság biztosítása érdekében, de egyes fordítások vagy példák hibákat tartalmazhatnak. A hiteles referencia a [Zymbol-Lang specifikáció](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI). While every effort has been made to ensure accuracy, some translations or examples may contain errors. The canonical reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
