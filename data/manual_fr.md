# Manuel Zymbol-Lang

**Zymbol-Lang** est un langage de programmation symbolique. Pas de mots-clés — tout est symbole. Fonctionne de la même façon dans toutes les langues humaines.

- Pas de `if`, `while`, `return` — seulement `?`, `@`, `<~`
- Unicode complet — identifiants dans n'importe quelle langue ou emoji
- Agnostique à la langue humaine — le code est identique dans toutes les langues

---

## Variables et Constantes

```zymbol
x = 10              // variable mutable
PI := 3.14159       // constante — erreur à la réassignation
nom = "Alice"
actif = #1          // booléen vrai
👋 := "Bonjour"
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

## Types de Données

| Type           | Littéral            | Tag `#?` | Notes                              |
|----------------|---------------------|----------|------------------------------------|
| Int            | `42`, `-7`          | `###`    | 64 bits signé                      |
| Float          | `3.14`, `1.5e10`    | `##.`    | Notation scientifique OK           |
| String         | `"texte"`           | `##"`    | Interpolation : `"Bonjour {nom}"`  |
| Char           | `'A'`               | `##'`    | Un caractère Unicode               |
| Bool           | `#1`, `#0`          | `##?`    | PAS numérique — `#1 ≠ 1`          |
| Array          | `[1, 2, 3]`         | `##]`    | Éléments homogènes                 |
| Tuple          | `(a, b)`            | `##)`    | Positionnel                        |
| Tuple nommé    | `(x: 1, y: 2)`      | `##)`    | Champs nommés                      |

```zymbol
// Introspection de type — retourne (type, chiffres, valeur)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[0]
>> t ¶            // → ###
```

---

## Sortie et Entrée

```zymbol
>> "Bonjour" ¶                      // ¶ ou \\ pour saut de ligne explicite
>> "a=" a " b=" b ¶                 // juxtaposition — plusieurs valeurs
>> (arr$#) ¶                        // opérateurs postfix nécessitent ( ) dans >>

<< nom                              // lire dans la variable (sans invite)
<< "Entrez votre nom : " nom        // avec invite
```

> `¶` (AltGr+R sur clavier espagnol) et `\\` sont des sauts de ligne équivalents.

---

## Opérateurs

```zymbol
// Arithmétique
a = 10
b = 3
r1 = a + b    // 13     r2 = a - b    // 7
r3 = a * b    // 30     r4 = a / b    // 3  (division entière)
r5 = a % b    // 1      r6 = a ^ b    // 1000  (puissance)

// Comparaison
a == b    // #0    a <> b    // #1    a < b    // #0
a <= b    // #0   a > b     // #1    a >= b   // #1

// Logique
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Chaînes de Caractères

```zymbol
// Trois formes de concaténation
nom = "Alice"
n = 42

msg = "Bonjour ", nom, "!"              // virgule — dans les affectations
>> "Bonjour " nom " tu as " n ¶        // juxtaposition — dans >>
desc = "Bonjour {nom}, tu as {n}"      // interpolation — partout
```

```zymbol
s = "Hello World"
len = s$#                  // 11
sub = s$[0..5]             // "Hello"  (fin exclusif)
a = s$? "World"            // #1
parties = "a,b,c,d" / ','  // [a, b, c, d]
rep = s$~~["l":"L"]        // "HeLLo WorLd"
rep1 = s$~~["l":"L":1]     // "HeLlo World"  (premiers N seulement)
```

> `+` est réservé aux nombres. Utiliser `,`, la juxtaposition ou l'interpolation pour les chaînes.

---

## Contrôle de Flux

```zymbol
x = 7

? x > 0 { >> "positif" ¶ }

? x > 100 {
    >> "grand" ¶
} _? x > 0 {
    >> "positif" ¶
} _? x == 0 {
    >> "zéro" ¶
} _ {
    >> "négatif" ¶
}
```

> Les blocs `{ }` sont **obligatoires** même pour une seule instruction.

---

## Match

```zymbol
// Intervalles
note = 85
mention = ?? note {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> mention ¶    // → B

// Chaînes
couleur = "rouge"
code = ?? couleur {
    "rouge" : "#FF0000"
    "vert"  : "#00FF00"
    _       : "#000000"
}

// Gardes
temp = -5
etat = ?? temp {
    _? temp < 0  : "glace"
    _? temp < 20 : "froid"
    _? temp < 35 : "chaud"
    _            : "brûlant"
}
>> etat ¶    // → glace

// Forme instruction (branches bloc)
?? n {
    0        : { >> "zéro" ¶ }
    _? n < 0 : { >> "négatif" ¶ }
    _        : { >> "positif" ¶ }
}
```

---

## Boucles

```zymbol
@ i:0..4  { >> i " " }        // intervalle inclusif :  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // avec pas :              1 3 5 7 9
@ i:5..0:1 { >> i " " }       // inversé :               5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

fruits = ["pomme", "poire", "raisin"]
@ f:fruits { >> f ¶ }         // pour chaque élément

@ c:"bonjour" { >> c "-" }
>> ¶                          // → b-o-n-j-o-u-r-  (sur les caractères)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> continuer
    ? i > 7 { @! }             // @! arrêter
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Boucle infinie
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Boucle étiquetée (break imbriqué)
compte = 0
@ @externe {
    compte++
    ? compte >= 3 { @! externe }
}
>> compte ¶                   // → 3
```

---

## Fonctions

```zymbol
additionner(a, b) { <~ a + b }
>> additionner(3, 4) ¶    // → 7

factorielle(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorielle(n - 1)
}
>> factorielle(5) ¶    // → 120
```

Les fonctions ont une **portée isolée** — elles ne peuvent pas lire les variables extérieures. Utiliser les paramètres de sortie `<~` pour modifier les variables de l'appelant :

```zymbol
echanger(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
echanger(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Les fonctions nommées ne sont pas des valeurs de première classe. Pour les passer en argument, envelopper : `x -> fn(x)`.

---

## Lambdas et Fermetures

```zymbol
double = x -> x * 2
somme = (a, b) -> a + b
>> double(5) ¶    // → 10
>> somme(3, 7) ¶  // → 10

// Lambda avec bloc
classer = x -> {
    ? x > 0 { <~ "positif" }
    _? x < 0 { <~ "négatif" }
    <~ "zéro"
}

// Fermeture — capture la portée extérieure
facteur = 3
triple = x -> x * facteur
>> triple(7) ¶    // → 21

// Fabrique
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Dans des tableaux
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[2](5) ¶    // → 25
```

---

## Tableaux

```zymbol
arr = [1, 2, 3, 4, 5]

arr[0]          // 1 — accès (base 0)
arr[-1]         // 5 — indice négatif (dernier)
arr$#           // 5 — longueur (utiliser (arr$#) dans >>)

arr = arr$+ 6            // ajouter → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // insérer à l'indice 2
arr3 = arr$- 3           // retirer la première occurrence de la valeur
arr4 = arr$-- 3          // retirer toutes les occurrences
arr5 = arr$-[0]          // retirer à l'indice
arr6 = arr$-[1..3]       // retirer une plage (fin exclusive)

a = arr$? 3              // #1 — contient
pos = arr$?? 3           // [2] — tous les indices de la valeur
sl = arr$[0..3]          // [1,2,3] — tranche (fin exclusive)
sl2 = arr$[0:3]          // [1,2,3] — même, syntaxe par comptage

asc = arr$^+             // trié croissant  (primitifs uniquement)
desc = arr$^-            // trié décroissant (primitifs uniquement)

// Tableaux de tuples nommés/positionnels — utiliser $^ avec lambda comparateur
db = [(nom: "Carla", age: 28), (nom: "Ana", age: 25), (nom: "Bob", age: 30)]
par_age  = db$^ (a, b -> a.age < b.age)    // croissant par âge  (<)
par_nom  = db$^ (a, b -> a.nom > b.nom)    // décroissant par nom (>)
>> par_age[0].nom ¶     // → Ana
>> par_nom[0].nom ¶     // → Carla

arr[1] = 99              // mise à jour en place
arr = arr[1]$~ 99        // mise à jour fonctionnelle — retourne nouveau tableau
```

> Tous les opérateurs de collection retournent un **nouveau tableau**. Réassigner : `arr = arr$+ 4`.
> Les opérateurs ne peuvent pas être enchaînés — utiliser des affectations intermédiaires.
> `$^+` / `$^-` trient les **tableaux de primitifs** (nombres, chaînes). Pour les tableaux de tuples, utiliser `$^` avec un lambda comparateur — la direction est encodée dans le lambda (`<` = croissant, `>` = décroissant).

```zymbol
// Tableaux imbriqués
matrice = [[1,2,3],[4,5,6],[7,8,9]]
>> matrice[1][2] ¶    // → 6
```

---

## Déstructuration

```zymbol
// Tableau
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[premier, *reste] = arr      // premier=10  reste=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ ignore

// Tuple positionnel
point = (100, 200)
(px, py) = point             // px=100  py=200

// Tuple nommé
personne = (nom: "Ana", age: 25, ville: "Paris")
(nom: n, age: a) = personne   // n="Ana"  a=25
```

---

## Tuples

```zymbol
// Positionnel
point = (10, 20)
>> point[0] ¶    // → 10

// Nommé
personne = (nom: "Alice", age: 25)
>> personne.nom ¶    // → Alice
>> personne[0] ¶     // → Alice  (l'indice fonctionne aussi)

// Imbriqué
pos = (x: 10, y: 20)
p = (pos: pos, etiquette: "origine")
>> p.pos.x ¶        // → 10
```

---

## Fonctions d'Ordre Supérieur

> Les opérateurs HOF nécessitent un **lambda inline** — les variables lambda ne peuvent pas être passées directement.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

doubles  = nums$> (x -> x * 2)                // map  → [2,4,6…20]
pairs    = nums$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total    = nums$< (0, (acc, x) -> acc + x)     // reduce → 55

// Enchaîner via intermédiaires
etape1 = nums$| (x -> x > 3)
etape2 = etape1$> (x -> x * x)
>> etape2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Fonctions nommées dans HOF — envelopper dans un lambda
doubler(x) { <~ x * 2 }
r = nums$> (x -> doubler(x))    // ✅
```

---

## Opérateur Pipe

Le membre droit nécessite toujours `_` comme espace réservé pour la valeur transmise :

```zymbol
double = x -> x * 2
additionner = (a, b) -> a + b
inc = x -> x + 1

5 |> double(_)           // → 10
10 |> additionner(_, 5)  // → 15
5 |> additionner(2, _)   // → 7

// Enchaîné
r = 5 |> double(_) |> inc(_) |> double(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Gestion des Erreurs

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "division par zéro" ¶
} :! {
    >> "autre erreur : " _err ¶    // _err contient le message d'erreur
} :> {
    >> "s'exécute toujours" ¶
}
```

| Type        | Quand                       |
|-------------|----------------------------|
| `##Div`     | Division par zéro           |
| `##IO`      | Fichier / système           |
| `##Index`   | Indice hors limites         |
| `##Type`    | Erreur de type              |
| `##Parse`   | Erreur de parsing           |
| `##Network` | Erreurs réseau              |
| `##_`       | Toute erreur (catch-all)    |

---

## Modules

```zymbol
// Fichier : lib/calc.zy
# calc

#> { additionner, get_PI }    // exports AVANT les définitions

_PI := 3.14159
additionner(a, b) { <~ a + b }
get_PI() { <~ _PI }   // getter — accès direct à la constante via alias non supporté
```

```zymbol
// Fichier : main.zy
<# ./lib/calc <= c    // alias obligatoire

>> c::additionner(5, 3) ¶     // → 8
pi = c::get_PI()
>> pi ¶                        // → 3.14159
```

```zymbol
// Export avec un nom public différent
# malib
#> { _additionner_interne <= somme }

_additionner_interne(a, b) { <~ a + b }
```

```zymbol
<# ./malib <= m

>> m::somme(3, 4) ¶    // → 7  (nom interne _additionner_interne est caché)
```

---

## Opérateurs de Données

```zymbol
// Convertir une chaîne en nombre
v1 = #|"42"|      // → 42  (Int)
v2 = #|"3.14"|    // → 3.14  (Float)
v3 = #|"abc"|     // → "abc"  (sans erreur)

// Arrondir / tronquer
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (arrondir à 2 décimales)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (tronquer)

// Formatage des nombres
fmt = #,|1234567|      // → 1,234,567  (séparateur de milliers)
sci = #^|12345.678|    // → 1.2345678e4  (scientifique)

// Littéraux de base
a = 0x41         // → 'A'  (hexadécimal)
b = 0b01000001   // → 'A'  (binaire)
c = 0o101        // → 'A'  (octal)

// Conversion de base
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Intégration Shell

```zymbol
date = <\ date +%Y-%m-%d \>     // capture stdout (inclut le \n final)
>> "Aujourd'hui : " date

fichier = "data.txt"
contenu = <\ cat {fichier} \>   // interpolation dans les commandes

sortie = </"./script.zy"/>      // exécuter un autre script Zymbol, capturer la sortie
>> sortie
```

> `><` capture les arguments CLI comme tableau de chaînes (tree-walker uniquement).

---

## Exemple Complet : FizzBuzz

```zymbol
classer(nombre) {
    ? nombre % 15 == 0 { <~ "FizzBuzz" }
    _? nombre % 3  == 0 { <~ "Fizz" }
    _? nombre % 5  == 0 { <~ "Buzz" }
    _ { <~ nombre }
}

@ i:1..20 { >> classer(i) ¶ }
```

---

## Référence des Symboles

| Symbole   | Opération                           | Symbole       | Opération                      |
|-----------|-------------------------------------|---------------|-------------------------------|
| `=`       | variable                            | `$#`          | longueur                      |
| `:=`      | constante                           | `$+`          | ajouter                       |
| `>>`      | sortie                              | `$+[i]`       | insérer à l'indice            |
| `<<`      | entrée                              | `$-`          | retirer première occurrence   |
| `¶`/`\\`  | saut de ligne                       | `$--`         | retirer toutes les occurrences|
| `?`       | si (if)                             | `$-[i]`       | retirer à l'indice            |
| `_?`      | sinon si (elif)                     | `$-[i..j]`    | retirer une plage             |
| `_`       | sinon / joker                       | `$?`          | contient                      |
| `??`      | match                               | `$??`         | tous les indices de la valeur |
| `@`       | boucle                              | `$[s..e]`     | tranche                       |
| `@!`      | arrêter (break)                     | `$>`          | map                           |
| `@>`      | continuer                           | `$\|`         | filter                        |
| `->`      | lambda                              | `$<`          | reduce                        |
| `$^+`     | trier croissant (primitifs)         | `$^-`         | trier décroissant             |
| `$^`      | trier avec lambda comparateur       |               |                               |
| `<~`      | retourner (return)                  | `!?`          | essayer (try)                 |
| `\|>`     | pipe                                | `:!`          | attraper (catch)              |
| `#1`      | vrai                                | `:>`          | toujours (finally)            |
| `#0`      | faux                                | `$!`          | est erreur                    |
| `<#`      | importer                            | `$!!`         | propager erreur               |
| `#`       | déclarer module                     | `#>`          | exporter                      |
| `::`      | appel de module                     | `.`           | accès au champ                |
| `#\|..\|` | parser un nombre                   | `#?`          | métadonnées de type           |
| `#.N\|..\|` | arrondir                         | `#!N\|..\|`   | tronquer                      |
| `c\|..\|` | format virgule                     | `e\|..\|`     | scientifique                  |
| `<\ ..\>` | exécution shell                    | `>\<`         | arguments CLI                 |

---

> **Avertissement :** Cette documentation a été créée et traduite par intelligence artificielle (IA).
> Tous les efforts ont été faits pour garantir l'exactitude, mais certaines traductions ou exemples peuvent contenir des erreurs.
> La référence canonique est la [spécification Zymbol-Lang](https://github.com/zymbol-lang/interpreter).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
