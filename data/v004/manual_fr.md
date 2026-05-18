> **Avertissement :** Cette documentation a été créée et traduite par intelligence artificielle (IA).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> La référence canonique est **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** dans le dépôt de l'interpréteur.

---

# Manuel Zymbol-Lang

**Zymbol-Lang** est un langage de programmation symbolique. Pas de mots-clés — tout est symbole. Fonctionne de la même façon dans toutes les langues humaines.

- Pas de `if`, `while`, `return` — seulement `?`, `@`, `<~`
- Unicode complet — identifiants dans n'importe quelle langue ou emoji
- Agnostique à la langue humaine — le code est identique dans toutes les langues

**Version de l'interpréteur** : v0.0.4 | **Couverture des tests** : 393/393 (parité TW ↔ VM)

---

## Variables et Constantes

```zymbol
x = 10              // variable mutable
PI := 3.14159       // constante — réassigner est une erreur à l'exécution
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

---

## Types de Données

| Type | Littéral | Tag `#?` | Notes |
|------|---------|----------|-------|
| Entier | `42`, `-7` | `###` | 64 bits signé |
| Flottant | `3.14`, `1.5e10` | `##.` | Notation scientifique OK |
| Chaîne | `"texte"` | `##"` | Interpolation : `"Bonjour {nom}"` |
| Caractère | `'A'` | `##'` | Un caractère Unicode |
| Booléen | `#1`, `#0` | `##?` | PAS numérique — `#1 ≠ 1` |
| Tableau | `[1, 2, 3]` | `##]` | Éléments homogènes |
| Uplet | `(a, b)` | `##)` | Positionnel |
| Uplet nommé | `(x: 1, y: 2)` | `##)` | Champs nommés |
| Fonction | référence de fonction | `##()` | Premier ordre ; affiche `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Premier ordre ; affiche `<lambd/N>` |

```zymbol
// Introspection de type — retourne (type, chiffres, valeur)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Sortie et Entrée

```zymbol
>> "Bonjour" ¶                        // ¶ ou \\ pour saut de ligne explicite
>> "a=" a " b=" b ¶                   // juxtaposition — plusieurs valeurs
>> (arr$#) ¶                          // opérateurs postfix nécessitent ( ) dans >>

<< nom                                // lire dans une variable (sans invite)
<< "Entrez votre nom : " nom          // avec invite
```

> `¶` (AltGr+R sur clavier espagnol) et `\\` sont des sauts de ligne équivalents.

---

## Opérateurs

```zymbol
// Arithmétique — utiliser des affectations ; certains opérateurs ont des particularités dans >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (division entière)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (exponentiation)

// Comparaison
a == b    // #0    
a <> b    // #1    
a < b    // #0
a <= b    // #0   
a > b     // #1    
a >= b   // #1

// Logique
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Chaînes de Caractères

```zymbol
// Deux formes de concaténation
nom = "Alice"
n = 42

>> "Bonjour " nom " tu as " n ¶        // juxtaposition — dans >>
desc = "Bonjour {nom}, tu as {n}"      // interpolation — dans tout contexte
```

```zymbol
s = "Bonjour Monde"
len = s$#                  // 13
sub = s$[1..7]             // "Bonjour"  (base 1, fin inclusive)
has = s$? "Monde"          // #1
parties = "a,b,c,d"$/ ','  // [a, b, c, d]  (séparer par délimiteur)
rep = s$~~["o":"0"]        // "B0nj0ur M0nde"
rep1 = s$~~["o":"0":1]     // "B0njour Monde"  (première occurrence seulement)
```

> `+` est réservé aux nombres. Utiliser la juxtaposition ou l'interpolation pour les chaînes.

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
score = 85
mention = ?? score {
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

// Patrons de comparaison
temp = -5
état = ?? temp {
    < 0  : "glace"
    < 20 : "froid"
    < 35 : "tiède"
    _    : "chaud"
}
>> état ¶    // → glace

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

// Boucle étiquetée (briser la boucle externe)
compte = 0
@:externe {
    compte++
    ? compte >= 3 { @:externe! }
}
>> compte ¶                   // → 3
```

---

## Fonctions

```zymbol
ajouter(a, b) { <~ a + b }
>> ajouter(3, 4) ¶    // → 7

factorielle(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorielle(n - 1)
}
>> factorielle(5) ¶    // → 120
```

Les fonctions ont une **portée isolée** — elles ne peuvent pas lire les variables extérieures. Utiliser les paramètres de sortie `<~` pour modifier les variables de l'appelant :

```zymbol
échanger(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
échanger(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Les fonctions nommées sont des **valeurs de premier ordre** — elles peuvent être passées directement : `nums$> doubler`. L'enveloppement est aussi valide : `x -> fn(x)`.

---

## Lambdas et Fermetures

```zymbol
doubler = x -> x * 2
somme = (a, b) -> a + b
>> doubler(5) ¶    // → 10
>> somme(3, 7) ¶  // → 10

// Lambda avec bloc
classifier = x -> {
    ? x > 0 { <~ "positif" }
    _? x < 0 { <~ "négatif" }
    <~ "zéro"
}

// Fermeture — capture la portée extérieure
facteur = 3
triple = x -> x * facteur
>> triple(7) ¶    // → 21

// Fabrique
créer_ajouteur(n) { <~ x -> x + n }
ajout10 = créer_ajouteur(10)
>> ajout10(5) ¶    // → 15

// Dans des tableaux
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶    // → 25
```

---

## Tableaux

Les tableaux sont **mutables** et contiennent des éléments du **même type**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — accès (base 1 : premier élément)
arr[-1]         // 5 — indice négatif (dernier élément)
arr$#           // 5 — longueur (utiliser (arr$#) dans >>)

arr = arr$+ 6            // ajouter → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // insérer à la position 2 (base 1)
arr3 = arr$- 3           // retirer la première occurrence de la valeur
arr4 = arr$-- 3          // retirer toutes les occurrences
arr5 = arr$-[1]          // retirer à l'indice 1 (premier élément)
arr6 = arr$-[2..3]       // retirer une plage (base 1, fin inclusive)

has = arr$? 3            // #1 — contient
pos = arr$?? 3           // [3] — tous les indices de la valeur (base 1)
sl = arr$[1..3]          // [1,2,3] — tranche (base 1, fin inclusive)
sl2 = arr$[1:3]          // [1,2,3] — même résultat, syntaxe par comptage

asc = arr$^+             // trié croissant  (primitifs uniquement)
desc = arr$^-            // trié décroissant (primitifs uniquement)

// Tableaux d'uplets nommés/positionnels — utiliser $^ avec lambda comparateur
db = [(nom: "Carla", age: 28), (nom: "Ana", age: 25), (nom: "Bob", age: 30)]
par_age   = db$^ (a, b -> a.age < b.age)      // croissant par âge  (<)
par_nom   = db$^ (a, b -> a.nom > b.nom)      // décroissant par nom (>)
>> par_age[1].nom ¶     // → Ana
>> par_nom[1].nom ¶     // → Carla

// Mise à jour directe d'un élément (tableaux seulement)
arr[1] = 99              // affecter
arr[2] += 5              // composé : +=  -=  *=  /=  %=  ^=

// Mise à jour fonctionnelle — retourne un nouveau tableau ; l'original est inchangé
arr2 = arr[2]$~ 99
```

> Tous les opérateurs de collection retournent un **nouveau tableau**. Réassigner : `arr = arr$+ 4`.
> `$+` peut être enchaîné : `arr = arr$+ 5$+ 6$+ 7`. Les autres opérateurs utilisent des affectations intermédiaires.
> **Indexation base 1** : `arr[1]` est le premier élément ; `arr[0]` est une erreur à l'exécution.
> `$^+` / `$^-` trient les **tableaux de primitifs** (nombres, chaînes). Pour les tableaux d'uplets, utiliser `$^` avec un lambda comparateur — la direction est encodée dans le lambda (`<` = croissant, `>` = décroissant).

**Sémantique de valeur** — assigner un tableau à une autre variable crée une copie indépendante :

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b n'est pas affecté
```

```zymbol
// Tableaux imbriqués (indexation base 1)
matrice = [[1,2,3],[4,5,6],[7,8,9]]
>> matrice[2][3] ¶    // → 6  (ligne 2, colonne 3)
```

---

## Déstructuration

```zymbol
// Tableau
tableau = [10, 20, 30, 40, 50]
[a, b, c] = tableau              // a=10  b=20  c=30
[premier, *reste] = tableau      // premier=10  reste=[20,30,40,50]
[x, _, z] = [1, 2, 3]           // _ ignore

// Uplet positionnel
point = (100, 200)
(px, py) = point                 // px=100  py=200

// Uplet nommé
personne = (nom: "Ana", age: 25, ville: "Paris")
(nom: n, age: a) = personne      // n="Ana"  a=25
```

---

## Uplets

Les uplets sont des conteneurs ordonnés **immuables** pouvant contenir des valeurs de **types différents**.
Contrairement aux tableaux, les éléments ne peuvent pas être modifiés après la création.

```zymbol
// Positionnel — types mixtes autorisés
point = (10, 20)
>> point[1] ¶    // → 10

données = (42, "bonjour", #1, 3.14)
>> données[3] ¶     // → #1

// Nommé
personne = (nom: "Alice", age: 25)
>> personne.nom ¶    // → Alice
>> personne[1] ¶     // → Alice  (l'indice fonctionne aussi, base 1)

// Imbriqué
pos = (x: 10, y: 20)
p = (pos: pos, étiquette: "origine")
>> p.pos.x ¶        // → 10
```

**Immuabilité** — toute tentative de modifier un élément d'un uplet est une erreur à l'exécution :

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ erreur à l'exécution : les uplets sont immuables
// t[1] += 5    // ❌ même erreur
```

Pour dériver une valeur modifiée, utiliser `$~` (mise à jour fonctionnelle) — retourne un **nouvel** uplet :

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← original inchangé
>> t2 ¶    // → (10, 999, 30)

// Uplet nommé — reconstruire explicitement
personne = (nom: "Alice", age: 25)
plus_âgé  = (nom: personne.nom, age: 26)
>> personne.age ¶    // → 25
>> plus_âgé.age ¶    // → 26
```

---

## Fonctions d'Ordre Supérieur

```zymbol
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

doublés  = nums$> (x -> x * 2)                  // map   → [2,4,6…20]
pairs    = nums$| (x -> x % 2 == 0)             // filter → [2,4,6,8,10]
total    = nums$< (0, (acc, x) -> acc + x)       // reduce → 55

// Enchaîner via variables intermédiaires
étape1 = nums$| (x -> x > 3)
étape2 = étape1$> (x -> x * x)
>> étape2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Les fonctions nommées peuvent être passées directement aux HOF
doubler(x) { <~ x * 2 }
est_grand(x) { <~ x > 5 }
r = nums$> doubler       // ✅ référence directe
r = nums$| est_grand     // ✅ référence directe
```

---

## Opérateur Pipe

Le membre droit nécessite toujours `_` comme espace réservé pour la valeur transmise :

```zymbol
doubler = x -> x * 2
ajouter = (a, b) -> a + b
inc = x -> x + 1

5 |> doubler(_)        // → 10
10 |> ajouter(_, 5)    // → 15
5 |> ajouter(2, _)     // → 7

// Enchaîné
r = 5 |> doubler(_) |> inc(_) |> doubler(_)
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

| Type | Quand |
|------|-------|
| `##Div` | Division par zéro |
| `##IO` | Fichier / système |
| `##Index` | Indice hors limites |
| `##Type` | Erreur de type |
| `##Parse` | Erreur de parsing |
| `##Network` | Erreurs réseau |
| `##_` | Toute erreur (catch-all) |

---

## Modules

```zymbol
// lib/calc.zy — le corps du module est entre accolades
# calc {
    #> { ajouter, get_PI }

    _PI := 3.14159
    ajouter(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias obligatoire

>> c::ajouter(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶                 // → 3.14159
```

```zymbol
// Exporter avec un nom public différent
# malib {
    #> { _ajouter_interne <= somme }

    _ajouter_interne(a, b) { <~ a + b }
}
```

```zymbol
<# ./malib <= m

>> m::somme(3, 4) ¶    // → 7  (nom interne _ajouter_interne est caché)
```

> **Règles des modules** : seuls `#>`, les définitions de fonctions et les initialisateurs littéraux sont autorisés dans `# nom { }`. Les instructions exécutables (`>>`, `<<`, boucles, etc.) génèrent l'erreur E013.

---

## Modes Numériques

Zymbol peut afficher les nombres dans **69 systèmes de chiffres Unicode** — Devanagari, Arabe-Indic, Thaï, Klingon pIqaD, Gras Mathématique, affichages LCD, et plus. Le mode actif n'affecte que la sortie `>>` ; l'arithmétique interne est toujours binaire.

### Activer un système

Écrivez le chiffre `0` et le chiffre `9` du système cible encadrés dans `#…#` :

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Arabe-Indic   (U+0660–U+0669)
#๐๙#    // Thaï          (U+0E50–U+0E59)
#09#    // réinitialiser en ASCII
```

### Sortie et booléens

```zymbol
x = 42
>> x ¶          // → 42   (ASCII par défaut)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (point décimal toujours ASCII)
>> 1 + 2 ¶      // → ३

// Booléens : préfixe # toujours ASCII, chiffre s'adapte
>> #1 ¶         // → #१   (vrai en Devanagari)
>> #0 ¶         // → #०   (faux — distinct de ०  zéro entier)

x = 28 > 4
>> x ¶          // → #१   (résultat de comparaison suit le mode actif)
```

### Littéraux natifs dans le code source

Les chiffres de tout système supporté sont des littéraux valides — dans les intervalles, modulo, comparaisons :

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Littéraux booléens dans n'importe quel système

`#` + chiffre `0` ou `1` de n'importe quel bloc supporté est un littéral booléen valide :

```zymbol
#٠٩#
نشط = #١        // identique à #1
>> نشط ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` est **toujours ASCII**. `#0` (faux) est toujours visuellement distinct de `0` (zéro entier) dans chaque système.

---

## Opérateurs de Données

```zymbol
// Conversion de types
##.42         // → 42.0  (vers Flottant)
###3.7        // → 4     (vers Entier, arrondi)
##!3.7        // → 3     (vers Entier, troncature)

// Parser une chaîne en nombre
v1 = #|"42"|      // → 42  (Entier)
v2 = #|"3.14"|    // → 3.14  (Flottant)
v3 = #|"abc"|     // → "abc"  (sans erreur, retourne l'original)

// Arrondir / tronquer
pi = 3.14159265
r2 = #.2|pi|      // → 3.14  (arrondir à 2 décimales)
r4 = #.4|pi|      // → 3.1416
t2 = #!2|pi|      // → 3.14  (tronquer)

// Format numérique
fmt = #,|1234567|      // → 1,234,567  (séparateur de milliers)
sci = #^|12345.678|    // → 1.2345678e4  (notation scientifique)

// Littéraux en autres bases
a = 0x41         // → 'A'  (hexadécimal → caractère)
b = 0b01000001   // → 'A'  (binaire → caractère)
c = 0o101        // → 'A'  (octal → caractère)

// Conversion vers représentation en base
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Intégration Shell

```zymbol
date_jour = <\ date +%Y-%m-%d \>    // capture stdout (inclut le \n final)
>> "Aujourd'hui : " date_jour

fichier = "données.txt"
contenu = <\ cat {fichier} \>       // interpolation dans les commandes

sortie = </"./sous-script.zy"/>     // exécuter un autre script Zymbol, capturer la sortie
>> sortie
```

> `><` capture les arguments CLI comme tableau de chaînes (tree-walker uniquement).

---

## Exemple Complet : FizzBuzz

```zymbol
classifier(nombre) {
    ? nombre % 15 == 0 { <~ "FizzBuzz" }
    _? nombre % 3  == 0 { <~ "Fizz" }
    _? nombre % 5  == 0 { <~ "Buzz" }
    _ { <~ nombre }
}

@ i:1..20 { >> classifier(i) ¶ }
```

---

## Référence des Symboles

| Symbole | Opération | Symbole | Opération |
|---------|-----------|---------|-----------|
| `=` | variable | `$#` | longueur |
| `:=` | constante | `$+` | ajouter (enchaînable) |
| `>>` | sortie | `$+[i]` | insérer à l'indice (base 1) |
| `<<` | entrée | `$-` | retirer 1ère occurrence |
| `¶` / `\\` | saut de ligne | `$--` | retirer toutes les occurrences |
| `?` | si (if) | `$-[i]` | retirer à l'indice (base 1) |
| `_?` | sinon si (elif) | `$-[i..j]` | retirer une plage (base 1) |
| `_` | sinon / joker | `$?` | contient |
| `??` | match | `$??` | tous les indices de la valeur (base 1) |
| `@` | boucle | `$[s..e]` | tranche (base 1) |
| `@ N { }` | boucle N fois | `$>` | map |
| `@!` | arrêter (break) | `$\|` | filter |
| `@>` | continuer | `$<` | reduce |
| `@:nom { }` | boucle étiquetée | `$/ delim` | séparer chaîne |
| `@:nom!` | briser étiquette | `$++ a b c` | concat build |
| `@:nom>` | continuer étiquette | `arr[i>j>k]` | navigation d'indice |
| `->` | lambda | `arr[i] = val` | mettre à jour élément (tableaux seulement) |
| `arr[i] += val` | mise à jour composée | `arr[i]$~` | mise à jour fonctionnelle (nouvelle copie) |
| `$^+` | trier croissant (primitifs) | `$^-` | trier décroissant (primitifs) |
| `$^` | trier avec comparateur (uplets) | `<~` | retourner (return) |
| `\|>` | pipe | `!?` | essayer (try) |
| `:!` | attraper (catch) | `:>` | toujours (finally) |
| `#1` | vrai | `#0` | faux |
| `$!` | est erreur | `$!!` | propager erreur |
| `<#` | importer | `#>` | exporter |
| `#` | déclarer module | `::` | appel de module |
| `.` | accès au champ | `#?` | métadonnées de type |
| `#\|..\|` | parser un nombre | `##.` | convertir vers Flottant |
| `###` | convertir vers Entier (arrondi) | `##!` | convertir vers Entier (troncature) |
| `#.N\|..\|` | arrondir | `#!N\|..\|` | tronquer |
| `#,\|..\|` | format virgules | `#^\|..\|` | notation scientifique |
| `#d0d9#` | changement de système numérique | `#09#` | réinitialiser en ASCII |
| `<\ ..\>` | exécution shell | `>\<` | arguments CLI |
| `\ var` | détruire variable explicitement | | |

---

## Historique des Versions

### v0.0.4 — Indexation Base 1, Fonctions de Premier Ordre & Modules avec Blocs _(Avril 2026)_

- **Rupture** Indexation changée en **base 1** — `arr[1]` est le premier élément ; `arr[0]` est une erreur à l'exécution
- **Ajouté** Les fonctions nommées sont des **valeurs de premier ordre** — les passer directement aux HOF : `nums$> doubler`
- **Ajouté** **Syntaxe de bloc obligatoire** dans les modules : `# nom { ... }` — syntaxe plate supprimée
- **Ajouté** Indexation multidimensionnelle : `arr[i>j>k]` (navigation), `arr[p ; q]` (extraction plate)
- **Ajouté** Conversion de types : `##.expr` (Flottant), `###expr` (Entier arrondi), `##!expr` (Entier troncature)
- **Ajouté** Séparation de chaîne : `str$/ delim` — retourne `Tableau(Chaîne)`
- **Ajouté** Concat build : `base$++ a b c` — ajoute plusieurs éléments
- **Ajouté** Boucle N fois : `@ N { }` — exécute exactement N itérations
- **Ajouté** Syntaxe de boucles étiquetées : `@:nom { }`, `@:nom!`, `@:nom>` — remplace `@ @nom` / `@! nom`
- **Ajouté** Règles de portée des variables : `_nom` a une portée exacte de bloc ; `\ var` détruit en avance
- **Ajouté** Patrons de comparaison dans match : `< 0 :`, `> 5 :`, `== 42 :`, etc.
- **Ajouté** Erreur E013 dans les modules : les instructions exécutables dans le corps d'un module sont invalides
- **Corrigé** `take_variable` ne corrompt plus les constantes de module lors de la réécriture
- **Corrigé** `alias.CONST` se résout correctement ; `#>` peut apparaître après les définitions de fonctions
- **VM** Parité totale : 393/393 tests passent

### v0.0.3 — Systèmes Numériques Unicode & Améliorations LSP _(Avril 2026)_

- **Ajouté** 69 blocs de chiffres Unicode avec le jeton de commutation `#d0d9#`
- **Ajouté** Littéraux booléens dans n'importe quel système — `#१` / `#०`, `#١` / `#٠`, etc.
- **Ajouté** Chiffres Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Ajouté** Opcode VM `SetNumeralMode` — parité complète avec le tree-walker
- **Ajouté** Le REPL respecte le mode numérique actif dans l'écho et l'affichage des variables
- **Modifié** La sortie `>>` des booléens inclut désormais le préfixe `#` (`#0` / `#1`) dans tous les modes

### v0.0.2_01 — Renommage d'Opérateurs _(30 Mar 2026)_

- **Modifié** `c|..|` → `#,|..|` et `e|..|` → `#^|..|` — cohérent avec la famille de préfixes `#`
- **Ajouté** Alias d'export : réexporter des membres de module sous un nom différent

### v0.0.2 — Refonte de l'API Collections & Installateurs _(24 Mar 2026)_

- **Ajouté** Famille d'opérateurs `$` unifiée pour tableaux et chaînes (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Ajouté** Déstructuration pour tableaux, uplets et uplets nommés
- **Ajouté** Indices négatifs (`arr[-1]` = dernier élément)
- **Ajouté** Installateurs natifs — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mar 2026)_

- **Ajouté** Affectation composée `^=`
- **Corrigé** Cas limites du parseur arithmétique ; corrections de documentation

### v0.0.1 — Version Publique Initiale _(22 Mar 2026)_

- Interprète tree-walker + VM à registres (`--vm`, ~4× plus rapide, ~95% de parité)
- Toutes les constructions de base : `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identifiants Unicode complets, système de modules, lambdas, fermetures, gestion d'erreurs
- REPL, LSP, extension VS Code, formateur (`zymbol fmt`)

---

_Zymbol-Lang — Symbolique. Universel. Immuable._
