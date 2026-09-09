> **Avertissement :** Cette documentation a été créée et traduite par intelligence artificielle (IA).
>
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
>
> La référence canonique est **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** dans le dépôt de l'interpréteur.

---

# Manuel de Zymbol-Lang

> **Révisé pour v0.0.9 — 2026-09-07**

**Zymbol-Lang** est un langage de programmation symbolique. Aucun mot dans sa grammaire — chaque construction est un symbole. Fonctionne à l'identique dans toute langue humaine.

- Pas de `if`, `while`, `return` — seulement `?`, `@`, `<~`
- Unicode complet — identifiants dans n'importe quelle langue ou emoji
- Agnostique à la langue humaine — le code est le même partout

**Version de l'interpréteur** : v0.0.9 | **Couverture des tests** : 660/666 (trois moteurs d'accord, 0 divergents)

---

## Variables et Constantes

```zymbol
x = 10              // variable mutable
PI := 3.14159       // constante — la réaffectation est une erreur à l'exécution
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
x++       // 5
x--       // 4
```

`°` (signe degré, U+00B0) initialise automatiquement une variable à sa valeur neutre lors du premier usage :

```zymbol
nombres = [3, 1, 4, 1, 5]
@ n:nombres {
    °total += n
}
>> total ¶              // → 14
```

> `°var` (préfixe) ancre au‑dessus de la boucle — le résultat est lisible après `@`.
> `var°` (suffixe) ancre à l'intérieur de la boucle — meurt à la fin de la boucle.

Une instruction qui n'est qu'un nom lit la variable et jette la valeur, donc elle prévient :

```zymbol
compteur = 5
compteur
```

Le compilateur prévient ainsi (ses messages sont toujours en anglais) :

```text
warning: this statement does nothing: 'compteur' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

C'est-à-dire : *« cette instruction ne fait rien : 'compteur' est lu et ignoré »*.

---

## Types de Données

| Type | Littéral | Étiquette `#?` | Notes |
|------|----------|----------------|-------|
| Entier | `42`, `-7` | `###` | Entier sûr : ±(2⁵³ − 1) |
| Flottant | `3.14`, `1.5e10` | `##.` | Double IEEE‑754 |
| Chaîne | `"texte"` | `##"` | Interpolation : `"Bonjour {nom}"` |
| Caractère | `'A'` | `##'` | Un graphème Unicode |
| Booléen | `#1`, `#0` | `##?` | PAS numérique — `#1 ≠ 1` |
| Tableau | `[1, 2, 3]` | `##]` | Un seul type, vérifié |
| Mixte déclaré | `#[1, "deux"]` | `##[` | Même type que `[…]`, non vérifié |
| Tuple | `(a, b)` | `##)` | Positionnel, immuable |
| Dictionnaire | `#(x: 1, y: 2)` | `##(` | Par clé, mutable |
| Fonction | référence de fonction nommée | `##()` | Première classe ; affiche `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Première classe ; affiche `<lambd/N>` |
| Unité | `##_` | `##_` | Absence — il n'y a pas de null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(x: 1)#? ¶          // → (##(, 1, #(x: 1))
```

Un entier qui sort de la plage sûre est une erreur attrapable, jamais un débordement silencieux :

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "hors plage" ¶ // → hors plage
}
```

`##_` est la manière pour un programme de demander si quelque chose est absent :

```zymbol
rien() { }
valeur = rien()
>> (valeur == ##_) ¶     // → #1
```

---

## Sortie et Entrée

```zymbol
nom = "Alice"
total = 3
>> "Bonjour" ¶             // → Bonjour
>> "a=" nom " b=" total ¶ // → a=Alice b=3
>> total#? ¶            // → (###, 1, 3)
```

```zymbol
<< nom
<< "Entrez votre nom : " nom
<< ###(4) "Âge : " âge
```

**Regardez la forme des deux symboles.** `>>` pointe vers l'extérieur : il sort les données du programme. `<<` pointe vers l'intérieur : il fait entrer les données. Il n'y a rien à mémoriser ici — la flèche indique dans quel sens l'information circule, et cette même idée revient dans chaque symbole qui déplace quelque chose.

> `¶` et `\\` sont des retours à la ligne équivalents. `>>` n'en ajoute jamais.
> Un spécificateur de type avant l'invite valide pendant la lecture et reprompt jusqu'à ce que la valeur soit valide :
> `##.` Flottant · `##.(T,D)` décimal · `###(N)` Entier · `##"(N)` texte · `##'` un Caractère.

Au niveau supérieur d'un fichier, `<~` est le code de sortie du programme :

```zymbol
>> "vérification" ¶      // → vérification
<~ 0
```

---

## Primitives TUI

Opérateurs d'interface terminal pour les programmes interactifs. La plupart nécessitent un bloc `>>| { }` (écran alternatif + mode brut).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "En cours"
    @~ 1000
    >>~ (2, 1) > "Terminé."
}
```

```zymbol
>>| {
    [lignes, colonnes] = >>?
    >>~ (1, 1) > "Terminal : " lignes " x " colonnes
    <<| touche
    >>~ (2, 1) > "Appuyé : " touche
}
```

C'est ici que l'on voit pourquoi les symboles se combinent plutôt que de se multiplier. Vous savez déjà que `<<` est l'entrée et que `?` demande sans s'engager. Un seul symbole est nouveau :

- `|` est **une unité unique**, pas tout le flux.

Avec cela, les deux opérateurs de clavier se lisent d'eux-mêmes :

```text
<<        |             ?
entrée    une unité     sans s'engager

<<|   prend UNE touche, et attend qu'il y en ait une
<<|?  regarde s'il y a UNE touche, et continue s'il n'y en a pas
```

De même de l'autre côté : `>>` envoie, `>>!` envoie **avec force** (efface tout l'écran), tandis que `>>?` **demande** au lieu d'écrire (quelle est la taille du terminal). Le symbole de droite est celui qui change le mode, et il vient toujours en dernier.

> `>>!` efface l'écran. `>>?` renvoie `(lignes, colonnes)`. `@~ N` dort N millisecondes.
> `<<|` lit une pression de touche (bloquant) ; `<<|?` sonde sans bloquer (`'\0'` si aucune).
> Les touches de direction arrivent décodées en `'↑' '↓' '←' '→'` ; ESC est le point de code 27.
> Tuple de sortie positionnée : `(ligne, colonne, BKS, avant, arrière)` — tout emplacement peut être omis avec une virgule (`>>~ (,,, 196) > "rouge"`).
> Masque BKS : `1`=Gras, `2`=Italique, `4`=Souligné. Palette ANSI 256 couleurs (`0`=défaut terminal).

---

## Opérateurs

```zymbol
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (division entière)
r5 = a % b    // 1
r6 = a ^ b    // 1000
```

```zymbol
a = 10
b = 3
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a >= b    // #1
l1 = #1 && #0  // #0
l2 = !#1       // #0
```

> `==` ne force jamais : `"5" == 5` est `#0`. L'ordre force : `"5" > 4` est `#1`, et `"४२" > 5` aussi — le texte numérique dans l'un des 69 systèmes d'écriture se compare comme un nombre.
> Une fonction est égale seulement à elle‑même, jamais à une autre fonction ayant le même corps.

---

## Chaînes

```zymbol
nom = "Alice"
n = 42
>> "Bonjour " nom " vous avez " n ¶ // → Bonjour Alice vous avez 42
description = "Bonjour {nom}, vous avez {n}"
>> description ¶              // → Bonjour Alice, vous avez 42
```

```zymbol
s = "Bonjour le monde"
longueur = s$#                  // 16
sous = s$[1..7]             // "Bonjour"
contient = s$? "monde"          // #1
parties = "a,b,c,d"$/ ','    // [a, b, c, d]
remplacement = s$~~["o":"0"]     // "B0nj0ur le m0nde"
ligne = "─" $* 20
```

> `+` est réservé aux nombres. Pour les chaînes, utilisez la juxtaposition ou l'interpolation.
> `\{` et `\}` sont des accolades littérales — l'échappement est symétrique.

---

## Flux de Contrôle

```zymbol
x = 7
? x > 100 {
    >> "grand" ¶
} _? x > 0 {
    >> "positif" ¶     // → positif
} _ {
    >> "négatif" ¶
}
```

Deux nouveaux symboles ici, et un troisième qui vient de les combiner :

- `?` est **demander** : il ouvre une condition.
- `_` est **ce qui n'a pas été spécifié** : la branche restante quand aucune question n'a correspondu.
- `_?` est les deux à la suite : *si rien n'a correspondu, demande à nouveau*.

C'est pourquoi `_?` s'écrit ainsi. Ce n'est pas un nouveau symbole à apprendre — c'est `_` suivi de `?`, et il signifie exactement ce que ses deux parties signifient, lues dans l'ordre.

> Les accolades `{ }` sont **obligatoires** même pour une seule instruction.

---

## Correspondance (Match)

```zymbol
score = 85
grade = ?? score {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> grade ¶              // → B
```

```zymbol
température = -5
état = ?? température {
    < 0  => "glace"
    < 20 => "froid"
    _    => "chaud"
}
>> état ¶              // → glace
```

Vous connaissez déjà `?` comme « demander ». **`??` est demander plusieurs fois** : doubler un symbole, n'importe où dans le langage, c'est faire plusieurs fois ce que le symbole fait une fois. Un `?` teste une condition ; `??` teste contre une liste de cas.

Les alternatives se joignent avec `||`, et elles peuvent mélanger les types de motifs :

```zymbol
touche = 'P'
action = ?? touche {
    'p' || 'P' => "pause"
    < 0 || > 100 => "hors plage"
    _ => "ignoré"
}
>> action ¶             // → pause
```

---

## Boucles

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
fruits = ["pomme", "poire", "raisin"]
@ f:fruits { >> f " " }
>> ¶                    // → pomme poire raisin
@ c:"Bonjour" { >> c "-" }
>> ¶                    // → B-o-n-j-o-u-r-
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
compteur = 0
@:externe {
    compteur++
    ? compteur >= 3 { @:externe! }
}
>> compteur ¶             // → 3
```

`@` est le symbole du **temps** : tout ce qui se répète vit dedans. Pour couper ce temps, vous ajoutez un symbole à côté :

- `@!` — `!` est la **force** : quitte la boucle maintenant.
- `@>` — `>` pousse en avant : passe au tour suivant.
- `@:externe!` — `:` **lie un nom**, donc cela coupe la boucle *nommée* externe, pas la plus proche.

Trois opérateurs, et aucun n'a eu à être mémorisé séparément : ce sont `@` plus un symbole qui dit déjà ce qu'il fait.

> **Un spécificateur est un compte ou une condition.** Un `Entier` est un compte, évalué une fois — `@ 0` exécute le corps zéro fois. Tout autre chose est une condition. Il n'y a pas de véracité : `@ []` et `@ 3.5` sont refusés. Pour parcourir une collection, utilisez `@ x:éléments` ; pour la compter, `@ éléments$#`.

---

## Fonctions

```zymbol
ajouter(a, b) { <~ a + b }
>> ajouter(3, 4) ¶        // → 7
```

```zymbol
factorielle(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorielle(n - 1)
}
>> factorielle(5) ¶       // → 120
```

Une fonction lit les variables du fichier par valeur, et une écriture à l'intérieur reste à l'intérieur :

```zymbol
limite = 100
dedans(n) { <~ n < limite }
>> dedans(42) ¶         // → #1
```

Deux symboles changent cela, et les deux sont écrits **dans la signature et au site d'appel** :

```zymbol
incrémenter(compteur<~) { compteur = compteur + 1 }
total = 0
incrémenter(total<~)
>> total ¶              // → 1
```

> `p~` est une copie de travail — le corps peut la réaffecter et l'appelant reste intact.
> `p<~` est un paramètre de sortie — le changement revient. `incrémenter(total)` sans le symbole est une erreur sémantique : l'annotation et la signature ne peuvent pas diverger.

---

## Lambdas et Clôtures

```zymbol
double = x -> x * 2
somme = (a, b) -> a + b
>> double(5) ¶          // → 10
>> somme(3, 7) ¶          // → 10
```

```zymbol
classifier = x -> {
    ? x > 0 { <~ "positif" }
    _? x < 0 { <~ "négatif" }
    <~ "zéro"
}
>> classifier(-4) ¶         // → négatif
```

```zymbol
facteur = 3
triple = x -> x * facteur
>> triple(7) ¶          // → 21
```

```zymbol
crée_ajouteur(n) { <~ x -> x + n }
ajoute10 = crée_ajouteur(10)
>> ajoute10(5) ¶           // → 15
```

Une lambda peut ne prendre aucun paramètre :

```zymbol
réponse = () -> 42
>> réponse() ¶           // → 42
```

> Une lambda capture les variables du fichier **lors de sa création** ; une fonction nommée les lit **lors de son appel**.

---

## Tableaux

```zymbol
tab = [1, 2, 3, 4, 5]
>> tab[1] ¶       // → 1   l'indexation commence à 1
>> tab[-1] ¶      // → 5   le négatif compte depuis la fin
>> tab$# ¶        // → 5   longueur
```

```zymbol
tab = [1, 2, 3]
>> (tab$+ 6) ¶          // → [1, 2, 3, 6]   ajout
>> (tab$+[2] 99) ¶      // → [1, 99, 2, 3]  insertion à la position 2
>> (tab$- 3) ¶          // → [1, 2]         supprime la première occurrence
>> (tab$-[1]) ¶         // → [2, 3]         supprime à l'index 1
>> (tab$[1..2]) ¶       // → [1, 2]         tranche, les deux extrémités incluses
>> (tab$? 3) ¶          // → #1             contient
```

Ils commencent tous par `$`, le symbole de **collection**, et continuent avec un symbole indiquant ce qui y est fait : `#` combien, `+` ajouter, `-` supprimer, `?` demander si présent. Et comme avec `??`, doubler le symbole signifie le faire exhaustivement : `$?` demande *si* une valeur est présente, `$??` demande *en combien d'endroits* et les renvoie tous.

```zymbol
tab = [3, 1, 2]
>> (tab$^+) ¶     // → [1, 2, 3]   croissant
>> (tab$^-) ¶     // → [3, 2, 1]   décroissant
```

**La règle du résultat.** Un seul opérateur, et ce que le code environnant en fait décide : utilisé, il **construit** et laisse l'original intact ; ignoré, il **modifie**.

```zymbol
tab = [1, 2, 3]
copie = tab[2]$~ 99
>> tab ¶                // → [1, 2, 3]
>> copie ¶              // → [1, 99, 3]
tab[2]$~ 99
>> tab ¶                // → [1, 99, 3]
```

> **`=` n'écrit jamais dans une collection.** `tab[2] = 99` n'est pas une forme de Zymbol — `=` donne une valeur à un NOM. Changer une partie d'une collection est `$~`, dans toutes les collections.

`[…]` contient un seul type et est vérifié ; un mélange délibéré est **déclaré** avec `#[…]` :

```zymbol
mixte = #[1, "deux", #1]
>> mixte ¶             // → [1, deux, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Indexation Multidimensionnelle

`>` descend dans une structure imbriquée. Un groupe de crochets adresse un élément, aussi profond soit‑il.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   ligne 2, colonne 3
>> m[-1>-1] ¶      // → 9   dernière ligne, dernière colonne
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          plat : la diagonale
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   structuré : les coins
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` **n'est pas** une forme de Zymbol. L'indexation chaînée est refusée aussi bien en lecture qu'en écriture — un groupe de crochets par accès, et `>` est ce qui va entre les étapes.

---

## Dictionnaires

Un tuple avec des champs nommés est un dictionnaire, et depuis v0.0.9 il s'écrit `#(…)`.

```zymbol
personne = #(nom: "Alice", âge: 25)
>> personne.nom ¶        // → Alice
>> personne["âge"] ¶    // → 25
```

```zymbol
personne = #(nom: "Alice", âge: 25)
champ = "nom"
>> personne[champ] ¶     // → Alice
```

Il est mutable, des clés peuvent être ajoutées, et il peut être parcouru :

```zymbol
stock = #(poire: 4)
stock["pomme"]$~ 10
@ k:stock { >> k "=" stock[k] " " }
>> ¶                    // → poire=4 pomme=10
```

```zymbol
stock = #(poire: 4, pomme: 10)
@ (k, v):stock { >> k ":" v " " }
>> ¶                    // → poire:4 pomme:10
```

> `#()` est le dictionnaire vide, ce que `()` ne pouvait pas être — il aurait dû être aussi le tuple vide. La forme nue `(x: 1)` est refusée avec ce message : *a dictionary is written `#(…)`* — « un dictionnaire s'écrit `#(…)` ».
> Un dictionnaire est adressé par clé, jamais par position, donc `personne[1]` est une erreur.

---

## Tuples

Les tuples sont des conteneurs ordonnés **immuables** qui contiennent des valeurs de types différents.

```zymbol
point = (10, 20)
>> point[1] ¶           // → 10
données = (42, "Bonjour", #1, 3.14)
>> données[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Toute tentative de modifier un tuple en place est une erreur, quel que soit l'opérateur — l'immutabilité est une propriété de la valeur, pas une exception à l'intérieur de chaque `$`.

---

## Destructuration

```zymbol
tab = [10, 20, 30, 40, 50]
[a, b, c] = tab
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
tab = [10, 20, 30, 40, 50]
[premier, *reste] = tab
>> premier ¶            // → 10
>> reste ¶              // → [20, 30, 40, 50]
```

```zymbol
point = (100, 200)
(px, py) = point
>> px " " py ¶          // → 100 200
```

```zymbol
personne = #(nom: "Anna", âge: 25)
#(nom: n, âge: a) = personne
>> n " " a ¶            // → Anna 25
```

> La forme du crochet est typée : `[…]` prend un tableau, `(…)` un tuple, `#(…)` un dictionnaire. Le dernier nom **absorbe le reste**, donc la destructuration n'échoue jamais sur la longueur — `(a, b, c) = (1,2,3,4,5)` donne `c = (3,4,5)`, et `##_` quand il ne reste rien.

---

## Fonctions d'Ordre Supérieur

```zymbol
nombres = [1, 2, 3, 4, 5]
>> (nombres$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (nombres$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (nombres$< (0, (acc, x) -> acc + x)) ¶ // → 15
```

```zymbol
nombres = [1, 2, 3, 4, 5, 6]
double(x) { <~ x * 2 }
est_grand(x) { <~ x > 3 }
>> (nombres$> double) ¶    // → [2, 4, 6, 8, 10, 12]
>> (nombres$| est_grand) ¶    // → [4, 5, 6]
```

```zymbol
base = [#(nom: "Carla", âge: 28), #(nom: "Anna", âge: 25)]
par_âge = base$^ (a, b -> a.âge < b.âge)
>> par_âge[1].nom ¶     // → Anna
```

> Une fonction nommée va à une HOF **sans parenthèses** : `nombres$> double`. Écrire `nombres$> (double)` est une erreur de syntaxe, car `(` ouvre une lambda.

---

## Opérateur Pipe

```zymbol
double = x -> x * 2
ajoute = (a, b) -> a + b
inc = x -> x + 1
>> (5 |> double(_)) ¶    // → 10
>> (10 |> ajoute(_, 5)) ¶  // → 15
>> (5 |> double(_) |> inc(_)) ¶ // → 11
```

---

## Gestion des Erreurs

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "division par zéro" ¶  // → division par zéro
} :! {
    >> "autre : " _err ¶
} :> {
    >> "toujours exécuté" ¶        // → toujours exécuté
}
```

| Type | Quand |
|------|-------|
| `##Div` | Division par zéro |
| `##Index` | Index hors bornes |
| `##Key` | Clé absente d'un dictionnaire |
| `##Range` | Hors de la plage entière sûre |
| `##Type` | Incompatibilité de type |
| `##Parse` | Analyse de données |
| `##IO` | Fichier / système |
| `##Network` | Erreurs réseau |
| `##DB` | Base de données |
| `##Time` | Une date qui n'existe pas |
| `##_` | Toute erreur (attrape‑tout) |

`!` est le symbole de **l'erreur et de la force**, et il se lit de la même manière dans les deux familles : `$!` demande à une valeur si elle est une erreur ; `$!!`, avec le symbole doublé, la propage vers le haut sans demander.

> Les échecs de la bibliothèque standard reviennent sous forme de **valeurs d'erreur souples** que vous testez avec `$!` ou attrapez avec `!?`, plutôt que d'avorter. `$!!` en propage un à l'appelant.

---

## Modules

```zymbol
# calc {
    #> { ajouter, PI }

    PI := 3.14159
    ajouter(a, b) { <~ a + b }
}
```

```zymbol
<# ./calc => c

>> c::ajouter(5, 3) ¶
>> c.PI ¶
```

```zymbol
# mabiblio {
    #> { ajoute_interne => somme }

    ajoute_interne(a, b) { <~ a + b }
}
```

Les deux symboles de module sont la même idée, maintenant appliquée aux fichiers : `#` est le niveau de **déclaration** — ce qu'une chose *est*, pas sa valeur — et la flèche indique dans quel sens le code voyage :

```text
<#   la flèche entre : importer, apporter depuis un autre fichier
#>   la flèche sort : exporter, offrir à d'autres fichiers
```

Un symbole de direction se place toujours sur le bord faisant face à la direction vers laquelle il pointe. C'est la même raison pour laquelle `<~` retourne vers la gauche (sort de la fonction) et `->` entre vers la droite (dans le corps de la lambda).

> **Un module déclare ce qu'il exporte.** Le bloc `#>` est obligatoire — l'omettre est **E014**, et `#> { }` est la manière pour un module de dire que sa surface est vide. `::` appelle une fonction, `.` lit une constante. Seuls les imports, le bloc d'exportation, les initialiseurs littéraux et les définitions de fonction peuvent apparaître dans un corps de module ; tout ce qui est exécutable est **E013**.

---

## Bibliothèque Standard

Modules natifs, importés comme n'importe quel autre :

| Module | Fonctions |
|--------|-----------|
| `std/math` | `sqrt exp ln log pow abs ceil floor round min max sin cos tan` · `PI` `E` |
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

>> t::width("手番") ¶              // → 4   deux glyphes, quatre colonnes
>> "|" t::center("go", 8) "|" ¶  // → |   go   |
```

```zymbol
<# std/time => T

jour = T::of(2026, 1, 31)
>> T::format(jour, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(jour, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` mesure les **colonnes d'affichage**, pas les caractères : CJK et la plupart des emojis font 2 colonnes, donc disposez un tableau avec `t::width`, jamais `$#`.
> Dans `std/time`, un instant est en millisecondes depuis l'époque. En dessous d'un jour c'est une durée, à partir d'un jour c'est calendaire — donc un mois tombe le même jour du mois, ajusté. `diff(a, b)` est `a - b`, donc le premier instant en premier donne une réponse négative.

---

## Paquets

Un `.zyp` regroupe un programme multi‑fichiers en un seul fichier portable. C'est une archive de **source**, pas un binaire, donc il s'exécute partout où un binaire `zymbol` s'exécute.

```bash
zymbol package monprojet/ --script main.zy -o monprojet.zyp
zymbol run monprojet.zyp
```

> L'archive contient un manifeste (`zyp.toml`) déclarant ses scripts d'entrée et la version du moteur dont elle a besoin. `zymbol run` l'extrait dans un répertoire temporaire et l'exécute depuis là, donc le code est jetable tandis que ce que le script écrit atterrit dans votre répertoire de travail réel. Le playground charge aussi les fichiers `.zyp`.

---

## Modes Numériques

Zymbol peut écrire des nombres dans **69 systèmes d'écriture numériques Unicode** — devanagari, arabo‑indien, thaï, pIqaD klingon, gras mathématique, segments LCD, et plus encore. Le mode est global au processus et affecte la sortie ; l'arithmétique est inchangée.

```zymbol
#०९#    // devanagari   (U+0966–U+096F)
#٠٩#    // arabo-indien (U+0660–U+0669)
#๐๙#    // thaï         (U+0E50–U+0E59)
#09#    // réinitialisation à ASCII
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

Les chiffres de tout système d'écriture pris en charge sont des littéraux valides dans le code source :

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

La lecture est symétrique — un chiffre est compris dans tout système d'écriture :

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` est toujours ASCII, donc `#0` reste visuellement distinct du chiffre zéro dans chaque système d'écriture.
> `#,` et `#^` écrivent aussi leurs chiffres dans le système actif, et les séparateurs le suivent — mais la paire ne s'inverse jamais : `,` groupe et `.` divise, dans chaque système d'écriture.

---

## Opérateurs de Données

```zymbol
f = ##.42         // en Flottant
i = ###3.7        // en Entier, arrondi  → 4
t = ##!3.7        // en Entier, tronqué  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Un Flottant s'imprime en chiffres, jamais en exposant, et abandonne le `.0` final — `##.42` écrit `42` et reste un Flottant, comme le montre `f#?`.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   sécurisé : renvoie l'entrée inchangée
>> ##!'A' ¶        // → 65    le point de code d'un caractère
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          arrondi à 2 décimales
>> #!2|pi| ¶       // → 3.14          tronqué à 2 décimales
>> #,|1234567| ¶   // → 1,234,567     séparateurs de milliers
>> #^|12345.678| ¶ // → 1.2345678e4   notation scientifique
```

```zymbol
>> 0x41 ¶        // → A   hexadécimal
>> 0b01000001 ¶  // → A   binaire
>> 0o101 ¶       // → A   octal
>> 0d65 ¶        // → A   décimal
```

> Un littéral de base dans la plage ASCII est un **caractère** : `0d65 == 'A'` est `#1`, et `0d65 == 65` est `#0`. Les quatre bases écrivent le même caractère.

---

## Intégration Shell

```zymbol
aujourdhui = <\ date +%Y-%m-%d \>
>> "Aujourd'hui : " aujourdhui
```

```zymbol
sortie = </"./sous_script.zy"/>
>> sortie
```

> `<\ … \>` capture stdout et stderr, en supprimant le saut de ligne final.
> `>< args` capture les arguments de la ligne de commande comme un tableau de chaînes.

---

## Exemple Complet : FizzBuzz

```zymbol
classifier(nombre) {
    ? nombre % 15 == 0 { <~ "FizzBuzz" }
    _? nombre % 3  == 0 { <~ "Fizz" }
    _? nombre % 5  == 0 { <~ "Buzz" }
    <~ nombre
}

@ i:1..20 { >> classifier(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (un par ligne)
```

---

## Comment les Symboles se Combinent

Vous avez vu la même chose tout au long de ce manuel : **un opérateur n'est pas un dessin à mémoriser, c'est plusieurs symboles mis à la suite, et chacun apporte son sens.** Maintenant que vous les connaissez tous, voici le schéma complet.

D'abord vient **dans quel monde nous sommes** :

| Symbole | Monde | Vous l'avez vu dans |
|---------|-------|---------------------|
| `$` | une collection | `$#` `$+` `$?` `$^-` |
| `@` | le temps, tout ce qui se répète | `@!` `@>` `@~` |
| `#` | ce qu'une chose *est*, pas sa valeur | `#?` `#(…)` `<#` `#>` |
| `>>` | hors du programme | `>>` `>>!` `>>?` |
| `<<` | dans le programme | `<<` `<<\|` `<<\|?` |
| `?` | demander, sans s'engager | `?` `_?` `??` `$?` |
| `!` | force, ou erreur | `@!` `$!` `!?` |

Puis vient **ce qui y est fait** : `+` ajouter, `-` supprimer, `^` ordonner, `~` modifier, `#` compter, `|` une unité unique, `:` lier un nom.

Et deux règles qui ne faillissent jamais :

**Doubler un symbole le rend exhaustif.** `?` demande une fois, `??` teste plusieurs cas. `$?` demande si une valeur est présente, `$??` renvoie chaque endroit où elle se trouve. `!` signale une erreur, `!!` la propage sans demander.

**Le symbole de mode vient toujours en dernier.** Quand `?` ou `!` apparaît pour dire *comment* quelque chose est fait — de manière hésitante ou forcée — ce sont les derniers symboles de l'opérateur : `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:externe!`. Il n'y a jamais d'opération après eux.

Il en découle quelque chose de pratique : **une combinaison que vous n'avez jamais vue a déjà du sens avant que vous ne la cherchiez.** Si `$` est collection et `^` est ordre et `-` est inversé, alors `$^-` trie en ordre décroissant, et personne n'a eu à vous le dire.

Toute la liste ne fonctionne pas ainsi, et le dire vaut mieux que de faire semblant. La plupart des opérateurs se décomposent proprement. Six se décomposent mais signifient plus que leurs parties : `!?` `:!` `:>` `|>` `::` `$++`. Et dix doivent être appris par cœur parce qu'ils ne se décomposent pas du tout : `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Compter les opaques plutôt que de supposer qu'ils sont peu nombreux est délibéré : c'est le coût réel de mémorisation du langage. La référence complète — l'inventaire, les homographes déclarés, et les règles qu'un nouvel opérateur doit satisfaire pour exister — est `SYMBOLS.md`, dans le dépôt de l'interpréteur.

---

## Référence des Symboles

| Symbole | Opération | Symbole | Opération |
|---------|-----------|---------|-----------|
| `=` | variable | `$#` | longueur |
| `:=` | constante | `$+` | ajouter |
| `>>` | sortie | `$+[i]` | insérer à l'index (1‑basé) |
| `<<` | entrée | `$-` | supprimer la première occurrence par valeur |
| `¶` / `\\` | nouvelle ligne | `$--` | supprimer toutes les occurrences par valeur |
| `?` | si | `$-[i]` | supprimer à l'index (1‑basé) |
| `_?` | sinon‑si | `$-[i..j]` | supprimer la plage (1‑basé) |
| `_` | sinon / joker | `$?` | contient |
| `??` | correspondance | `$??` | trouver tous les index (1‑basé) |
| `\|\|` | ou‑motif dans une branche de match | `$[s..e]` | tranche (1‑basé) |
| `@` | boucle | `$>` | mapper |
| `@ N { }` | boucle N fois | `$\|` | filtrer |
| `@!` | casser | `$<` | réduire |
| `@>` | continuer | `$/ délim` | diviser la chaîne |
| `@:nom { }` | boucle étiquetée | `$++ a b c` | construire par concaténation |
| `@:nom!` | casser l'étiquette | `$~~[p:r]` | remplacer dans la chaîne |
| `@:nom>` | continuer l'étiquette | `$*` | répéter la chaîne |
| `->` | lambda | `tab[i]$~ v` | LA forme de mise à jour |
| `<~` | retour / paramètre de sortie | `~` | paramètre de copie de travail |
| `tab[i>j]` | index de navigation | `tab[p ; q]` | extraction plate |
| `$^+` | tri croissant | `$^-` | tri décroissant |
| `$^` | tri avec comparateur | `\|>` | pipe |
| `!?` | essayer | `:!` | attraper |
| `:>` | finalement | `$!` | est‑ce une erreur |
| `$!!` | propager l'erreur | `#1` / `#0` | vrai / faux |
| `##_` | Unité — absence | `[…]` | tableau, un seul type |
| `#[…]` | tableau, mixte déclaré | `#(…)` | dictionnaire |
| `(…)` | tuple positionnel | `#()` | dictionnaire vide |
| `<#` | importer | `#>` | exporter |
| `#` | déclarer un module | `::` | appeler un module |
| `.` | accès champ / constante | `#?` | métadonnées de type |
| `#\|..\|` | analyser un nombre | `##.` | convertir en Flottant |
| `###` | convertir en Entier (arrondi) | `##!` | convertir en Entier (tronqué) |
| `#.N\|..\|` | arrondir | `#!N\|..\|` | tronquer |
| `#,\|..\|` | séparateurs de milliers | `#^\|..\|` | scientifique |
| `#d0d9#` | changer le mode numérique | `#09#` | réinitialisation à ASCII |
| `<\ ..\>` | exécuter un shell | `><` | arguments CLI |
| `\ var` | détruire une variable | `°x` / `x°` | définition chaude |
| `>>\|` | bloc TUI (écran alternatif) | `>>~` | sortie positionnée |
| `>>!` | effacer l'écran | `>>?` | interroger la taille du terminal |
| `<<\|` | pression de touche bloquante | `<<\|?` | pression de touche non bloquante |
| `@~ N` | dormir N millisecondes | `0d` `0x` `0o` `0b` | littéraux de base |

---

## Journal des Modifications

### v0.0.9 — Les Collections Décident _(septembre 2026)_

- **Rupture** Le dictionnaire a sa propre notation : `#(clé: valeur)`. La forme nue `(x: 1)` est refusée, et `#()` est le dictionnaire vide — ce que `()` ne pouvait jamais être
- **Rupture** L'affectation indexée est retirée : `tab[i] = v` et toutes ses formes composées. `=` donne une valeur à un NOM ; changer une partie d'une collection est `$~`
- **Rupture** L'indexation chaînée `m[i][j]` est refusée en lecture comme en écriture — `>` est ce qui va entre les étapes
- **Rupture** Un module doit déclarer ce qu'il exporte (**E014**) ; `#> { }` dit que la surface est vide
- **Rupture** Un spécificateur de boucle est un compte ou une condition — pas de véracité. `@ []` et `@ 3.5` sont refusés
- **Ajouté** `##_` — le littéral Unité, et comment un programme demande si quelque chose est absent
- **Ajouté** `#[…]` — un tableau dont le mélange de types d'éléments est déclaré
- **Ajouté** `#?` distingue les quatre collections : `##]` `##[` `##)` `##(`
- **Ajouté** `std/time` — l'horloge et le calendrier civil, avec fuseaux horaires et arithmétique calendaire
- **Ajouté** Un `<~>` au niveau supérieur est le code de sortie du programme
- **Ajouté** `@ (k, v):paires` — un motif dans l'en‑tête de boucle
- **Ajouté** `#|c|` lit un chiffre dans l'un des 69 systèmes d'écriture ; `#,` et `#^` écrivent dans le système actif
- **Modifié** `Entier` est un entier sûr, ±(2⁵³ − 1), fermé en cas d'échec dans chaque moteur
- **Modifié** Une fonction nommée lit les variables du fichier au moment de l'appel, par valeur
- **Modifié** Une instruction qui ne lit qu'un nom avertit au lieu de passer en silence
- **Moteurs** 660 des 666 fichiers du corpus sont d'accord sur les trois moteurs, 0 divergents

### v0.0.8 — Auto‑libération, `std/term` et Paquets _(août 2026)_

- **Ajouté** Destruction automatique au dernier usage — invisible ; abaisse seulement le pic de mémoire
- **Ajouté** `std/term` — métriques d'affichage en colonnes terminal
- **Ajouté** `##!` sur un `Caractère` — son point de code Unicode
- **Ajouté** Motifs ou dans le match : `'p' || 'P' => …`, des alternatives de toute nature dans une branche
- **Ajouté** Paquets Zymbol (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Ajouté** `<~` au site d'appel est obligatoire lorsque le callee déclare un paramètre de sortie
- **Corrigé** Parité du système de modules dans la VM à registres

### v0.0.7 — Bibliothèque Standard Native _(juillet 2026)_

- **Ajouté** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — tous avec des valeurs d'erreur souples
- **Ajouté** Entrée typée/validée : `<< ##.(5,2) "prix : " p`
- **Ajouté** Opérateurs postfixés directement dans `>>` — pas de parenthèses nécessaires
- **Modifié** Formateur fermé en cas d'échec : il refuse d'écrire une sortie qu'il ne peut pas relire

### v0.0.6 — Raffinement et Bibliothèque Scientifique _(juin 2026)_

- **Rupture** `=>` remplace `:` dans les branches de match et `<=` dans les alias d'import/export
- **Ajouté** `std/math` et `std/random`
- **Ajouté** Mise à jour de dictionnaire par clé : `d["k"]$~ valeur`

### v0.0.5 — Primitives TUI et Définition Chaude _(mai 2026)_

- **Ajouté** Bloc TUI `>>| { }`, sortie positionnée `>>~`, entrée clavier `<<|` et `<<|?`
- **Ajouté** `>>!` effacer l'écran, `>>?` taille du terminal, `@~ N` dormir
- **Ajouté** Définition chaude `°x` / `x°`, et répétition de chaîne `$*`

### v0.0.4 — Indexation 1‑basée et Fonctions de Première Classe _(avril 2026)_

- **Rupture** Toute indexation est **1‑basée** — `tab[1]` est le premier élément
- **Ajouté** Fonctions nommées comme valeurs de première classe ; syntaxe de bloc module `# nom { }`
- **Ajouté** Indexation multidimensionnelle `tab[i>j>k]` et extraction plate `tab[p ; q]`

### v0.0.3 — Systèmes Numériques Unicode _(avril 2026)_

- **Ajouté** 69 blocs de chiffres Unicode avec le jeton de changement de mode `#d0d9#`
- **Ajouté** Littéraux booléens dans tout système d'écriture — `#१` / `#०`

### v0.0.2 — Refonte de l'API des Collections _(mars 2026)_

- **Ajouté** La famille d'opérateurs `$` pour les tableaux et les chaînes
- **Ajouté** Destructuration, et indices négatifs

### v0.0.1 — Première Version Publique _(mars 2026)_

- Interpréteur arborescent + VM à registres (`--vm`)
- Toutes les constructions de base : `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Identifiants Unicode complets, système de modules, lambdas, clôtures, gestion d'erreurs
- REPL, LSP, extension VS Code, formateur (`zymbol fmt`)

---

_Zymbol-Lang — Symbolique. Universel. Immuable._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Licence :** ce manuel est sous licence [CC BY‑SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024‑2026 Zymbol‑Lang Team. Texte complet : `LICENSE-CC-BY-SA-4.0` dans <https://github.com/zymbol-lang/web>. L'interpréteur et le moteur navigateur (`zymbol.js`) sont des œuvres séparées, sous licence AGPL-3.0-only.
