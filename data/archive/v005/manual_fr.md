> **Avis :** Cette documentation a été créée avec l'assistance de l'intelligence artificielle (IA).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> La référence canonique est **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** dans le dépôt de l'interprète.

---

# Manuel de Zymbol-Lang

> **Révisé pour v0.0.5 — 2026-05-12**

**Zymbol-Lang** est un langage de programmation symbolique. Aucun mot-clé — tout est un symbole. Fonctionne de manière identique dans n'importe quelle langue humaine.

- Pas de `if`, `while`, `return` — seulement `?`, `@`, `<~`
- Unicode complet — identifiants dans n'importe quelle langue ou emoji
- Agnostique quant à la langue — le code est identique partout

**Version de l'interprète** : v0.0.5 | **Couverture de test** : 436/436 (TW ↔ VM parité)

---

## Variables & Constantes

```zymbol
x = 10              // variable mutable
PI := 3.14159       // constante — réassigner est une erreur d'exécution
nom = "Alice"
actif = #1          // booléen vrai
👋 := "Bonjour"
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

`°` (signe de degré, U+00B0) auto-initialise une variable à sa valeur neutre à la première utilisation :

```zymbol
nombres = [3, 1, 4, 1, 5]
@ n:nombres {
    °total += n    // auto-init à 0 au-dessus de la boucle ; survit après @
}
>> total ¶         // → 14
```

> `°x` (préfixe) s'ancre au-dessus de la boucle — résultat accessible après `@`.
> `x°` (postfixe) s'ancre à l'intérieur de la boucle — disparaît quand la boucle se termine.
> Interprète uniquement.

---

## Types de Données

| Type | Littéral | `#?` tag | Remarques |
|------|----------|----------|-----------|
| Entier | `42`, `-7` | `###` | 64-bit signé |
| Flottant | `3.14`, `1.5e10` | `##.` | Notation scientifique OK |
| Chaîne | `"texte"` | `##"` | Interpolation : `"Bonjour {nom}"` |
| Caractère | `'A'` | `##'` | Caractère Unicode unique |
| Booléen | `#1`, `#0` | `##?` | PAS numérique — `#1 ≠ 1` |
| Tableau | `[1, 2, 3]` | `##]` | Éléments homogènes |
| Tuple | `(a, b)` | `##)` | Positionnel |
| Tuple Nommé | `(x: 1, y: 2)` | `##)` | Champs nommés |
| Fonction | Référence de fonction nommée | `##()` | Première classe ; affiche `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Première classe ; affiche `<lambd/N>` |

```zymbol
// Introspection de type — retourne (type, chiffres, valeur)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Sortie & Entrée

```zymbol
>> "Bonjour" ¶                      // ¶ ou \\ pour nouvelle ligne explicite
>> "a=" a " b=" b ¶                 // juxtaposition — valeurs multiples
>> (tableau$#) ¶                    // les opérateurs postfixes nécessitent ( ) dans >>

<< nom                              // lire dans une variable (pas d'invite)
<< "Entrez le nom : " nom           // avec invite
```

> `¶` (AltGr+R sur clavier espagnol) et `\\` sont des nouvelles lignes équivalentes.

---

## Primitives TUI

Opérateurs d'interface utilisateur de terminal pour les programmes interactifs. La plupart nécessitent un bloc `>>| { }` (écran alternatif + mode brut).

```zymbol
>>| {
    >>!                             // effacer l'écran alternatif
    >>~ (1, 1, 0, 10) > "En cours"  // ligne 1, col 1, fg=10 (vert)
    @~ 1000                         // pause 1 seconde (1000 ms)
    >>~ (2, 1) > "Fini."
}
// terminal restauré automatiquement à la sortie
```

```zymbol
// Appui sur une touche et taille du terminal
>>| {
    [lignes, cols] = >>?             // interroger les dimensions du terminal
    >>~ (1, 1) > "Terminal : " lignes " x " cols
    <<| touche                       // lecture de touche bloquée
    >>~ (2, 1) > "Appuyé : " touche
}
```

> `>>!` efface l'écran. `>>?` retourne `[lignes, cols]`. `@~ N` dort N millisecondes.
> `<<|` lit une touche (bloquée) ; `<<|?` sonde sans bloquer (retourne `'\0'` si aucune).
> Tuple de sortie positionnée : `(ligne, col, BKS, fg, bg)` — n'importe quel emplacement peut être omis avec une virgule (`>>~ (,,, 196) > "rouge"`).
> Masque BKS : `1`=Gras, `2`=Italique, `4`=Souligné. Palette ANSI 256-color (`0`=défaut du terminal).
> Interprète uniquement (sauf `>>!`, `>>?`, `@~`, `>>~` qui fonctionnent aussi en `--vm`).

---

## Opérateurs

```zymbol
// Arithmétique
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (division entière)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (exponentiation)

// Comparaison — assigner pour inspecter
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Logique
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## Chaînes

```zymbol
// Deux formes de concaténation
nom = "Alice"
n = 42

>> "Bonjour " nom " vous avez " n ¶    // juxtaposition — dans >>
desc = "Bonjour {nom}, vous avez {n}"  // interpolation — n'importe où
```

```zymbol
s = "Bonjour le monde"
len = s$#                  // 11
sub = s$[1..5]             // "Bonjour"  (1-based, fin inclusive)
has = s$? "monde"          // #1
parts = "a,b,c,d"$/ ','    // [a, b, c, d]  (diviser par séparateur)
rep = s$~~["l":"L"]        // "BonjLour Le monde"
rep1 = s$~~["l":"L":1]     // "BonjLour le monde"  (premiers N uniquement)
ligne = "─" $* 20          // "────────────────────"  (répéter N fois)
```

> `+` est uniquement pour les nombres. Utilisez `,`, juxtaposition ou interpolation pour les chaînes.

---

## Flux de Contrôle

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

> Les accolades `{ }` sont **obligatoires** même pour une seule instruction.

---

## Match

```zymbol
// Plages
note = 85
classe = ?? note {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'F'
}
>> classe ¶    // → B

// Chaînes
couleur = "rouge"
code = ?? couleur {
    "rouge"   => "#FF0000"
    "vert"    => "#00FF00"
    _         => "#000000"
}

// Motifs de comparaison
temp = -5
etat = ?? temp {
    < 0  => "glace"
    < 20 => "froid"
    < 35 => "tiède"
    _    => "chaud"
}
>> etat ¶    // → glace

// Forme d'instruction (bras de bloc)
n = -3
?? n {
    0    => { >> "zéro" ¶ }
    < 0  => { >> "négatif" ¶ }
    _    => { >> "positif" ¶ }
}
```

---

## Boucles

```zymbol
@ i:0..4  { >> i " " }        // plage inclusive :  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // avec pas :         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // inverse :          5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

fruits = ["pomme", "poire", "raisin"]
@ f:fruits { >> f ¶ }         // pour chaque élément du tableau

@ c:"bonjour" { >> c "-" }
>> ¶                          // → b-o-n-j-o-u-r-  (pour chaque caractère)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> continuer
    ? i > 7 { @! }             // @! sortir
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

// Boucle étiquetée (sortie imbriquée)
count = 0
@:outer {
    count++
    ? count >= 3 { @:outer! }
}
>> count ¶                    // → 3
```

---

## Fonctions

```zymbol
add(a, b) { <~ a + b }
>> add(3, 4) ¶    // → 7

factorielle(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorielle(n - 1)
}
>> factorielle(5) ¶    // → 120
```

Les fonctions ont une **portée isolée** — elles ne peuvent pas lire les variables externes. Utilisez les paramètres de sortie `<~` pour modifier les variables appelantes :

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

> Les fonctions nommées sont des **valeurs première classe** — passer directement : `nombres$> doubler`. Pour wrapper : `x -> fn(x)` est aussi valide.

---

## Lambdas & Closures

```zymbol
doubler = x -> x * 2
somme = (a, b) -> a + b
>> doubler(5) ¶    // → 10
>> somme(3, 7) ¶    // → 10

// Lambda de bloc
classer = x -> {
    ? x > 0 { <~ "positif" }
    _? x < 0 { <~ "négatif" }
    <~ "zéro"
}

// Closure — capture la portée externe
facteur = 3
tripler = x -> x * facteur
>> tripler(7) ¶    // → 21

// Fabrique
creer_adder(n) { <~ x -> x + n }
ajouter10 = creer_adder(10)
>> ajouter10(5) ¶    // → 15

// Dans les tableaux
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Tableaux

Les tableaux sont **mutables** et contiennent des éléments du **même type**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — accès (1-indexé : premier élément)
x = arr[-1]     // 5 — index négatif (dernier élément)
x = arr$#       // 5 — longueur (utiliser (arr$#) dans >>)

arr = arr$+ 6            // ajouter → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // insérer à la position 2 (1-based)
arr3 = arr$- 3           // supprimer la première occurrence
arr4 = arr$-- 3          // supprimer toutes les occurrences
arr5 = arr$-[1]          // supprimer à l'index 1 (premier élément)
arr6 = arr$-[2..3]       // supprimer la plage (1-based, fin inclusive)

has = arr$? 3            // #1 — contient
pos = arr$?? 3           // [3] — tous les indices de la valeur (1-based)
sl = arr$[1..3]          // [1,2,3] — slice (1-based, fin inclusive)
sl2 = arr$[1:3]          // [1,2,3] — même, syntaxe basée sur le nombre

asc = arr$^+             // trié en ordre croissant  (primitives uniquement)
desc = arr$^-            // trié en ordre décroissant (primitives uniquement)

// Tableaux de tuples nommés/positionnels — utiliser $^ avec lambda de comparateur
db = [(nom: "Carla", age: 28), (nom: "Ana", age: 25), (nom: "Bob", age: 30)]
par_age  = db$^ (a, b -> a.age < b.age)    // croissant par âge  (<)
par_nom = db$^ (a, b -> a.nom > b.nom)    // décroissant par nom (>)
>> par_age[1].nom ¶     // → Ana
>> par_nom[1].nom ¶    // → Carla

// Mise à jour directe des éléments (tableaux uniquement)
arr[1] = 99              // assigner
arr[2] += 5              // composé : +=  -=  *=  /=  %=  ^=

// Mise à jour fonctionnelle — retourne un nouveau tableau ; original inchangé
arr2 = arr[2]$~ 99
```

> Tous les opérateurs de collection retournent un **nouveau tableau**. Réassigner : `arr = arr$+ 4`.
> `$+` peut être enchaîné : `arr = arr$+ 5$+ 6$+ 7`. Les autres opérateurs utilisent des assignations intermédiaires.
> **L'indexation est basée sur 1** : `arr[1]` est le premier élément ; `arr[0]` est une erreur d'exécution.
> `$^+` / `$^-` trient les **tableaux primitifs** (nombres, chaînes). Pour les tableaux de tuples, utilisez `$^` avec une lambda de comparateur — la direction est codée dans la lambda (`<` = croissant, `>` = décroissant).

**Sémantique de valeur** — assigner un tableau à une autre variable crée une copie indépendante :

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b n'est pas affecté
```

```zymbol
// Tableaux imbriqués (indexation 1-based)
matrice = [[1,2,3],[4,5,6],[7,8,9]]
>> matrice[2][3] ¶    // → 6  (ligne 2, colonne 3)
```

---

## Destructuration

```zymbol
// Tableau
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[first, *rest] = arr         // first=10  rest=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ descarte

// Tuple positionnel
point = (100, 200)
(px, py) = point             // px=100  py=200

// Tuple nommé
personne = (nom: "Ana", age: 25, ville: "Madrid")
(nom: n, age: a) = personne   // n="Ana"  a=25
```

---

## Tuples

Les tuples sont des **conteneurs ordonnés immuables** qui peuvent contenir des valeurs de **types différents**.
Contrairement aux tableaux, les éléments ne peuvent pas être modifiés après la création.

```zymbol
// Positionnel — types mixtes autorisés
point = (10, 20)
>> point[1] ¶    // → 10

data = (42, "bonjour", #1, 3.14)
>> data[3] ¶     // → #1

// Nommé
personne = (nom: "Alice", age: 25)
>> personne.nom ¶    // → Alice
>> personne[1] ¶      // → Alice  (l'index fonctionne aussi, 1-based)

// Imbriqué
pos = (x: 10, y: 20)
p = (pos: pos, label: "origine")
>> p.pos.x ¶        // → 10
```

**Immuabilité** — toute tentative de modifier un élément de tuple est une erreur d'exécution :

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ erreur d'exécution : les tuples sont immuables
// t[1] += 5    // ❌ même erreur
```

Pour obtenir une valeur modifiée, utilisez `$~` (mise à jour fonctionnelle) — retourne un **nouveau** tuple :

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← original inchangé
>> t2 ¶    // → (10, 999, 30)

// Tuple nommé — reconstruire explicitement
personne = (nom: "Alice", age: 25)
plus_vieux  = (nom: personne.nom, age: 26)
>> personne.age ¶    // → 25
>> plus_vieux.age ¶     // → 26
```

---

## Fonctions d'Ordre Supérieur

```zymbol
nombres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

doubler  = nombres$> (x -> x * 2)                // map  → [2,4,6…20]
pairs    = nombres$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total    = nombres$< (0, (acc, x) -> acc + x)     // reduce → 55

// Chaîner via intermédiaires
step1 = nombres$| (x -> x > 3)
step2 = step1$> (x -> x * x)
>> step2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Les fonctions nommées peuvent être passées directement à HOF
double(x) { <~ x * 2 }
est_grand(x) { <~ x > 5 }
r = nombres$> double       // ✅ référence directe
r = nombres$| est_grand       // ✅ référence directe
```

---

## Opérateur Pipe

Le RHS nécessite toujours `_` comme espace réservé pour la valeur canalisée :

```zymbol
doubler = x -> x * 2
ajouter = (a, b) -> a + b
incrementer = x -> x + 1

r1 = 5 |> doubler(_)        // → 10
r2 = 10 |> ajouter(_, 5)       // → 15
r3 = 5 |> ajouter(2, _)        // → 7

// Enchaîné
r = 5 |> doubler(_) |> incrementer(_) |> doubler(_)
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
    >> "autre : " _err ¶    // _err contient le message d'erreur
} :> {
    >> "s'exécute toujours" ¶
}
```

| Type | Quand |
|------|--------|
| `##Div` | Division par zéro |
| `##IO` | Fichier / système |
| `##Index` | Index hors limites |
| `##Type` | Incompatibilité de type |
| `##Parse` | Analyse des données |
| `##Network` | Erreurs réseau |
| `##_` | Erreur quelconque (catch-all) |

---

## Modules

```zymbol
// lib/calc.zy — le corps du module est enfermé dans des accolades
# calc {
    #> { ajouter, obtenir_PI }

    _PI := 3.14159
    ajouter(a, b) { <~ a + b }
    obtenir_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // alias requis

>> c::ajouter(5, 3) ¶     // → 8
pi = c::obtenir_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Exporter avec un nom public différent
# mabibliotheque {
    #> { _internal_ajouter => somme }

    _internal_ajouter(a, b) { <~ a + b }
}
```

```zymbol
<# ./mabibliotheque => m

>> m::somme(3, 4) ¶    // → 7  (le nom interne _internal_ajouter est caché)
```

> **Règles des modules** : seuls `#>`, les définitions de fonction et les initialiseurs de variables/constantes littérales sont autorisés à l'intérieur de `# nom { }`. Les instructions exécutables (`>>`, `<<`, boucles, etc.) lèvent l'erreur E013.

---

## Modes Numériques

Zymbol peut afficher les nombres dans **69 scripts de chiffres Unicode** — Devanagari, Arabe-Indic, Thaï, Klingon pIqaD, Gras mathématique, segments LCD, et bien d'autres. Le mode actif n'affecte que la sortie `>>` ; l'arithmétique interne est toujours binaire.

### Activation d'un script

Écrivez les chiffres `0` et `9` du script cible enfermés dans `#…#` :

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arabe-Indic (U+0660–U+0669)
#๐๙#    // Thaï         (U+0E50–U+0E59)
#09#    // réinitialiser à ASCII
```

### Sortie et booléens

```zymbol
x = 42
>> x ¶          // → 42   (par défaut ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (point décimal toujours ASCII)
>> 1 + 2 ¶      // → ३

// Booléens : préfixe # toujours ASCII, chiffre s'adapte
>> #1 ¶         // → #१   (vrai en Devanagari)
>> #0 ¶         // → #०   (faux — distinct de ० zéro entier)

x = 28 > 4
>> x ¶          // → #१   (le résultat de comparaison suit le mode actif)
```

### Littéraux de chiffres natifs en source

Les chiffres de n'importe quel script supporté sont des littéraux valides — dans les plages, modulo, comparaisons :

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Littéraux booléens dans n'importe quel script

`#` + chiffre `0` ou `1` de n'importe quel bloc est un littéral booléen valide :

```zymbol
#٠٩#
نشط = #١        // identique à #1
>> نشط ¶        // → #١
>> (#१ && #٠) ¶ // → #٠
```

> `#` est **toujours ASCII**. `#0` (faux) est toujours visuellement distinct de `0` (zéro entier) dans chaque script.

---

## Opérateurs de Données

```zymbol
// Conversions de type
f = ##.42         // → 42.0  (vers Flottant)
i = ###3.7        // → 4     (vers Entier, arrondi)
t = ##!3.7        // → 3     (vers Entier, tronqué)

// Analyser la chaîne en nombre
v1 = #|"42"|      // → 42  (Entier)
v2 = #|"3.14"|    // → 3.14  (Flottant)
v3 = #|"abc"|     // → "abc"  (fail-safe, pas d'erreur)

// Arrondir / tronquer
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (arrondir à 2 décimales)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (tronquer)

// Formatage des nombres
fmt = #,|1234567|  // → 1,234,567  (séparé par des virgules)
sci = #^|12345.678|    // → 1.2345678e4  (scientifique)

// Littéraux de base
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (binaire)
c = 0o101        // → 'A'  (octal)

// Conversion de base vers sortie
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Intégration du Shell

```zymbol
date = <\ date +%Y-%m-%d \>     // capture stdout (inclut \n final)
>> "Aujourd'hui : " date

fichier = "data.txt"
contenu = <\ cat {fichier} \>      // interpolation dans les commandes

sortie = </"./subscript.zy"/>   // exécuter un autre script Zymbol, capturer sortie
>> sortie
```

> `><` capture les arguments CLI sous forme de tableau de chaînes (interprète uniquement).

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

| Symbole | Opération | Symbole | Opération |
|---------|-----------|---------|-----------|
| `=` | variable | `$#` | longueur |
| `:=` | constante | `$+` | ajouter (enchaînable) |
| `>>` | sortie | `$+[i]` | insérer à l'index (1-based) |
| `<<` | entrée | `$-` | supprimer première par valeur |
| `¶` / `\\` | nouvelle ligne | `$--` | supprimer tous par valeur |
| `?` | si | `$-[i]` | supprimer à l'index (1-based) |
| `_?` | sinon-si | `$-[i..j]` | supprimer plage (1-based) |
| `_` | sinon / joker | `$?` | contient |
| `??` | match | `$??` | trouver tous les indices (1-based) |
| `@` | boucle | `$[s..e]` | slice (1-based) |
| `@ N { }` | boucle N fois (N itérations) | `$>` | map |
| `@!` | sortir | `$\|` | filter |
| `@>` | continuer | `$<` | reduce |
| `@:nom { }` | boucle étiquetée | `$/ delim` | diviser chaîne |
| `@:nom!` | sortir label | `$++ a b c` | concat build |
| `@:nom>` | continuer label | `arr[i>j>k]` | index de navigation |
| `->` | lambda | `arr[i] = val` | mettre à jour élément (tableaux uniquement) |
| `arr[i] += val` | mise à jour composée | `arr[i]$~` | mise à jour fonctionnelle (nouvelle copie) |
| `$^+` | trier croissant (primitives) | `$^-` | trier décroissant (primitives) |
| `$^` | trier avec comparateur (tuples) | `<~` | retourner |
| `\|>` | pipe | `!?` | essayer |
| `:!` | attraper | `:>` | finalement |
| `#1` | vrai | `#0` | faux |
| `$!` | est erreur | `$!!` | propager erreur |
| `<#` | importer | `#>` | exporter |
| `#` | déclarer module | `::` | appel de module |
| `.` | accès champ | `#?` | métadonnées de type |
| `#\|..\|` | analyser nombre | `##.` | convertir vers Flottant |
| `###` | convertir vers Entier (arrondir) | `##!` | convertir vers Entier (tronquer) |
| `#.N\|..\|` | arrondir | `#!N\|..\|` | tronquer |
| `#,\|..\|` | format virgule | `#^\|..\|` | scientifique |
| `#d0d9#` | changement de mode numérique | `#09#` | réinitialiser à ASCII |
| `<\ ..\>` | exécution shell | `>\<` | arguments CLI |
| `\ var` | détruire explicitement variable | `°x` / `x°` | définition en caleur (auto-init) |
| `>>|` | bloc TUI (écran alt.) | `>>~` | sortie positionnée |
| `>>!` | effacer écran | `>>?` | interroger taille terminal |
| `<<\|` | appui touche bloqué | `<<\|?` | appui touche non-bloqué |
| `@~ N` | dormir N millisecondes | `$*` | répéter chaîne N fois |

---

## Changelog des Versions

### v0.0.5 — Primitives TUI, Définition en Caleur & Répétition de Chaîne _(Mai 2026)_

- **Breaking** Séparateur du bras match : `motif : résultat` → `motif => résultat`
- **Breaking** Alias d'import : `<# chemin <= alias` → `<# chemin => alias`
- **Breaking** Renomage d'export : `#> { fn <= pub }` → `#> { fn => pub }`
- **Added** Bloc TUI `>>| { }` — écran alternatif + mode brut ; nettoie à la sortie
- **Added** Sortie positionnée `>>~ (ligne, col, BKS, fg, bg) > éléments` — emplacements clairsemés, palette ANSI 256-color
- **Added** Entrée clavier `<<| var` (bloqué) et `<<|? var` (sondage non-bloqué)
- **Added** `>>!` effacer écran, `>>?` interroger taille terminal, `@~ N` dormir N millisecondes
- **Added** Définition en caleur `°x` / `x°` — auto-initialiser variable à première utilisation en boucles
- **Added** Répétition de chaîne `str $* N` — répéter une chaîne N fois
- **VM** Parité : 436/436 tests passent

### v0.0.4 — Indexation 1-Based, Fonctions Première Classe & Blocs Module _(Avril 2026)_

- **Breaking** Tous les indices basculés à **1-based** — `arr[1]` est le premier élément ; `arr[0]` est une erreur d'exécution
- **Added** Les fonctions nommées sont des **valeurs première classe** — passer directement à HOF : `nombres$> doubler`
- **Added** Syntaxe de bloc de module **requise** : `# nom { ... }` — syntaxe plate supprimée
- **Added** Indexation multidimensionnelle : `arr[i>j>k]` (navigation), `arr[p ; q]` (extraction plate)
- **Added** Conversions de type : `##.expr` (Flottant), `###expr` (Entier arrondi), `##!expr` (Entier tronqué)
- **Added** Divison de chaîne : `str$/ delim` — retourne `Array(String)`
- **Added** Concat build : `base$++ a b c` — ajoute plusieurs éléments
- **Added** Boucle N fois : `@ N { }` — répéter exactement N fois
- **Added** Syntaxe de boucle étiquetée : `@:nom { }`, `@:nom!`, `@:nom>` — remplace `@ @nom` / `@! nom`
- **Added** Règles de portée des variables : les variables `_nom` ont une portée exactement du bloc ; `\ var` détruit tôt
- **Added** Motifs de comparaison match : `< 0 :`, `> 5 :`, `== 42 :` etc.
- **Added** Erreur de module E013 : les instructions exécutables dans le corps du module sont interdites
- **Fixed** `take_variable` ne corrompt plus les constantes de module sur la réécriture
- **Fixed** `alias.CONST` se résout maintenant correctement ; `#>` peut apparaître après les définitions de fonction
- **VM** Parité complète : 393/393 tests passent

### v0.0.3 — Systèmes de Chiffres Unicode & Améliorations LSP _(Avril 2026)_

- **Added** 69 blocs de chiffres Unicode avec jeton de commutation de mode `#d0d9#`
- **Added** Littéraux booléens dans n'importe quel script — `#१` / `#०`, `#١` / `#٠`, etc.
- **Added** Chiffres Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Added** Opcode de VM `SetNumeralMode` — parité complète avec l'interprète
- **Added** REPL respecte le mode numérique actif dans l'écho et l'affichage des variables
- **Changed** Sortie booléenne `>>` comprend désormais le préfixe `#` (`#0` / `#1`) dans tous les modes

### v0.0.2_01 — Renommage d'Opérateur _(30 Mars 2026)_

- **Changed** `c|..|` → `#,|..|` et `e|..|` → `#^|..|` — cohérent avec la famille de préfixes de format `#`
- **Added** Alias d'export : réexporter les membres du module sous un nom différent

### v0.0.2 — Refonte de l'API de Collection & Installateurs _(24 Mars 2026)_

- **Added** Famille d'opérateurs `$` unifiée pour les tableaux et chaînes (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Added** Assignation de destructuration pour les tableaux, tuples et tuples nommés
- **Added** Indices négatifs (`arr[-1]` = dernier élément)
- **Added** Installateurs natifs — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mars 2026)_

- **Added** Assignation composée `^=`
- **Fixed** Cas limites du analyseur arithmétique ; corrections de documentation

### v0.0.1 — Version Publique Initiale _(22 Mars 2026)_

- Interprète tree-walker + VM de registres (`--vm`, ~4× plus rapide, ~95% parité)
- Tous les construits de base : `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identifiants Unicode complets, système de modules, lambdas, closures, gestion des erreurs
- REPL, LSP, extension VS Code, formateur (`zymbol fmt`)

---

_Zymbol-Lang — Symbolique. Universel. Immuable._
