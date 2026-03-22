# Manuel Compact de Zymbol-Lang

**Zymbol-Lang** est un langage de programmation symbolique. Il n'utilise pas de mots-clés — tout est symbole. Il fonctionne de la même façon dans toutes les langues humaines.

---

## Philosophie

- Pas de mots-clés (`if`, `while`, `return` n'existent pas — seulement les symboles `?`, `@`, `<~`)
- Unicode complet — identifiants dans n'importe quelle langue ou emoji 👋
- Agnostique à la langue humaine — le code est identique dans toutes les langues

---

## Variables et Constantes

```zymbol
x = 10           // variable (mutable)
PI := 3.14159    // constante (immuable — erreur si réassignée)
nom = "Ana"
actif = #1       // booléen vrai
👋 := "Bonjour"
```

### Affectation Composée

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

## Types de Données

| Type           | Exemple             | Symbole `#?` | Notes                               |
|----------------|---------------------|--------------|-------------------------------------|
| Entier         | `42`, `-7`          | `###`        | 64 bits signé                       |
| Flottant       | `3.14`, `1.5e10`    | `##.`        | Notation scientifique OK            |
| Chaîne         | `"bonjour"`         | `##"`        | Interpolation : `"Bonjour {nom}"`   |
| Caractère      | `'A'`               | `##'`        | Un caractère Unicode                |
| Booléen        | `#1`, `#0`          | `##?`        | PAS les numériques 1 et 0           |
| Tableau        | `[1, 2, 3]`         | `##]`        | Tous les éléments du même type      |
| Tuple          | `(a, b)`            | `##)`        | Positionnel                         |
| Tuple nommé    | `(x: 1, y: 2)`      | `##)`        | Accès par nom ou indice             |

---

## Sortie et Entrée

```zymbol
// Sortie — N'ajoute PAS de saut de ligne automatiquement
>> "Bonjour" ¶                    // ¶ ou \\ donne un saut de ligne explicite
>> "a=" a " b=" b ¶               // plusieurs valeurs par juxtaposition
>> "somme=" additionner(2, 3) ¶   // appels de fonctions en toute position
>> (arr$#) ¶                      // les opérateurs postfix nécessitent des parenthèses

// Entrée
<< nom                            // sans invite — lit dans la variable
<< "Votre nom ? " nom             // avec invite
```

> `¶` ou `\\` sont équivalents comme saut de ligne.

---

## Concaténation de Chaînes

Trois formes valides — chacune pour son contexte :

```zymbol
nom = "Ana"
n = 25

// 1. Virgule — dans les affectations avec = ou :=
msg = "Bonjour ", nom, " !"             // → Bonjour Ana !
TITRE := "Utilisateur : ", nom

// 2. Juxtaposition — dans la sortie >>
>> "Bonjour " nom " tu as " n " ans" ¶  // → Bonjour Ana tu as 25 ans

// 3. Interpolation — dans tout contexte
desc = "Bonjour {nom}, tu as {n} ans"   // → Bonjour Ana, tu as 25 ans
```

> **Note** : `+` est réservé aux nombres. L'utiliser avec des chaînes génère un avertissement.

---

## Contrôle de Flux

```zymbol
x = 7

// Si simple
? x > 0 { >> "positif" ¶ }

// Si / sinon si / sinon
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

Les blocs `{ }` sont **obligatoires** même pour une seule ligne.

---

## Match

```zymbol
// Match avec intervalles
note = 85
mention = ?? note {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> mention ¶    // → B

// Match avec gardes (conditions arbitraires)
temp = -5
etat = ?? temp {
    _? temp < 0  : "glace"
    _? temp < 20 : "froid"
    _? temp < 35 : "chaud"
    _            : "brûlant"
}
>> etat ¶    // → glace

// Match avec chaînes
couleur = "rouge"
code = ?? couleur {
    "rouge" : "#FF0000"
    "vert"  : "#00FF00"
    _       : "#000000"
}
>> code ¶
```

---

## Boucles

```zymbol
// Intervalle inclusif : 0..4 itère 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Intervalle avec pas
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Intervalle inverse
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// Tant que (while)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Pour chaque élément
fruits = ["pomme", "poire", "raisin"]
@ f:fruits { >> f ¶ }

// Sur les caractères d'une chaîne
@ c:"bonjour" { >> c "-" }
>> ¶    // → b-o-n-j-o-u-r-

// Break et Continue
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> continuer
    ? i > 7 { @! }          // @! arrêter
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Fonctions

```zymbol
// Déclaration et appel
additionner(a, b) { <~ a + b }
>> additionner(3, 4) ¶    // → 7

// Récursion
factorielle(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorielle(n - 1)
}
>> factorielle(5) ¶    // → 120

// Les fonctions ont une portée isolée — pas d'accès aux variables externes
global = 100
tester() {
    x = 42    // local uniquement
    <~ x
}
>> tester() ¶    // → 42
```

> **Important** : Les fonctions nommées `nom(params){ }` ne sont pas des valeurs de première classe.
> Pour les passer en argument, envelopper : `x -> nom(x)`.

---

## Lambdas et Fermetures

```zymbol
// Lambda simple (retour implicite)
double = x -> x * 2
somme = (a, b) -> a + b
>> double(5) ¶    // → 10
>> somme(3, 7) ¶  // → 10

// Lambda avec bloc (retour explicite)
classer = x -> {
    ? x > 0 { <~ "positif" }
    _? x < 0 { <~ "négatif" }
    <~ "zéro"
}
>> classer(5) ¶     // → positif
>> classer(0) ¶     // → zéro
>> classer(-5) ¶    // → négatif

// Fermetures — les lambdas capturent les variables externes
facteur = 3
triple = x -> x * facteur    // capture 'facteur'
>> triple(7) ¶    // → 21

// Fabrique de fonctions
make_adder(n) { <~ x -> x + n }
add10 = make_adder(10)
>> add10(5) ¶    // → 15

// Lambdas comme valeurs : stockées dans des tableaux
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[0](5) ¶    // → 6
>> ops[2](5) ¶    // → 25
```

---

## Tableaux

```zymbol
arr = [10, 20, 30, 40, 50]

// Accès (indice 0-base)
>> arr[0] ¶    // → 10

// Longueur (parenthèses requises dans >>)
n = arr$#
>> (arr$#) ¶    // → 5

// Ajouter, retirer, contient, tranche
arr = arr$+ 60               // ajouter
arr = arr$- 0                // retirer l'indice 0
contient = arr$? 30          // → #1
tranche = arr$[0..2]         // [20, 30]

// Mettre à jour un élément
arr[1] = 99

// Pour chaque élément
@ x:arr { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` retournent un **nouveau tableau** — réassigner : `arr = arr$+ 4`.
> Pas d'enchaînement : utiliser deux affectations séparées.

---

## Tuples

```zymbol
// Tuple nommé
personne = (nom: "Alice", age: 25)
>> personne.nom ¶    // → Alice
>> personne.age ¶    // → 25
>> personne[0] ¶     // → Alice (l'indice fonctionne aussi)
```

---

## Fonctions d'Ordre Supérieur

Les opérateurs HOF nécessitent une **lambda inline** — pas de variable lambda directe.

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
doubles = nums$> (x -> x * 2)
>> doubles ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
pairs = nums$| (x -> x % 2 == 0)
>> pairs ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (valeur_initiale, (accumulateur, élément) -> expr)
total = nums$< (0, (acc, x) -> acc + x)
>> total ¶    // → 55
```

---

## Gestion des Erreurs

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "division par zéro" ¶
} :! ##IO {
    >> "erreur IO" ¶
} :! {
    >> "autre erreur : " _err ¶
} :> {
    >> "s'exécute toujours" ¶
}
```

| Type        | Quand cela se produit       |
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
get_PI() { <~ _PI }
```

```zymbol
// Fichier : main.zy
<# ./lib/calc <= c    // alias obligatoire

>> c::additionner(5, 3) ¶  // → 8
pi = c::get_PI()
>> pi ¶                    // → 3.14159
```

---

## Exemple Complet : FizzBuzz

```zymbol
classer(nombre) {
    ? nombre % 15 == 0 { <~ "BulleZzz" }
    _? nombre % 3  == 0 { <~ "Bulle" }
    _? nombre % 5  == 0 { <~ "Bzz" }
    _ { <~ nombre }
}

@ i:1..20 { >> classer(i) ¶ }
```

---

## Référence des Symboles

| Symbole | Opération         | Symbole    | Opération           |
|---------|-------------------|------------|---------------------|
| `=`     | variable          | `$#`       | longueur            |
| `:=`    | constante         | `$+`       | ajouter             |
| `>>`    | sortie            | `$-`       | retirer (par indice)|
| `<<`    | entrée            | `$?`       | contient            |
| `¶`/`\` | saut de ligne     | `$[s..e]`  | tranche             |
| `?`     | si (if)           | `$>`       | map                 |
| `_?`    | sinon si (elif)   | `$\|`      | filter              |
| `_`     | sinon / joker     | `$<`       | reduce              |
| `??`    | match             | `!?`       | essayer (try)       |
| `@`     | boucle            | `:!`       | attraper (catch)    |
| `@!`    | arrêter (break)   | `:>`       | toujours (finally)  |
| `@>`    | continuer         | `$!`       | est erreur          |
| `->`    | lambda            | `$!!`      | propager erreur     |
| `<~`    | retourner         | `#`        | déclarer module     |
| `\|>`   | pipe              | `#>`       | exporter            |
| `#1`    | vrai              | `<#`       | importer            |
| `#0`    | faux              | `::`       | appel de module     |

---

*Zymbol-Lang — Symbolique. Universel. Immuable.*

---

> **Avertissement :** Cette documentation a été créée et traduite par intelligence artificielle (IA).
> Tous les efforts ont été faits pour garantir l'exactitude, mais certaines traductions ou exemples peuvent contenir des erreurs.
> La référence canonique est la [spécification Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
