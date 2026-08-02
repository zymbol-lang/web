> **xusra:** ti'e fi'e la .ai .i la'e di'u se finti gi'e se fanva fi la .ai.
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> lo krefu cu zasti bu'u la **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** poi ke'a se cpacu la .interpreter. noi gunma kiste

---

# lo cukta be la .zymbol.lang.

> **se vrici v0.0.5 — 2026-05-15**

la .zymbol.lang. cu logji .i ro valsi cu sinxa .i no krasi valsi .i ri snada ro bangu

- no valsi zo'u la .if. .e la .ynile. .e la .return. na zasti .i za'u la .? .a la .@ .a la .<~. cu zasti
- lo ro .unikuad. cu zasti .i ro cmene ku se finti ro bangu .e ro .imodji.
- lo bangu na se sukpa .i ro kisto snada zu'o noi lo kisti cu mintu

---

## lo zmadu be la .stero. be'o .e lo zmadu be la .stero. na'e zmadu

```zymbol
x = 10              // lo stero poi binxo
π := 3.14159        // lo stero noi na binxo .i lo za'ure'u tertcu'u cu fliba nu
cmene = "alis."
acti = #1         // lo jetnu
👋 := "coi"
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

la'o .°.,° zo'u poi'i lo vlina cu sinxa lo grad be lo tanxe .i ke'a se gasnu lo nu lo stero co'a se tuple fi lo nu za'ure'u pilno

```zymbol
namcu = [3, 1, 4, 1, 5]
@ n:namcu {
    °roi += n    // lo co'a se tuple cu fai 0 bu'u le zu'o .i ri jmive ba lo .@.
}
>> roi ¶         // → 14
```

> la'o .°x.,° cu se sinxa va'o lo zu'o .i lo selcmi cu se cpacu ba lo .@.
> la'o .x°.,° cu se sinxa va'o lo cnita be lo zu'o .i ri mrobi'o ca lo nu lo zu'o za'u

---

## lo drata

| drata | valsi litki | tcita .#?. | notci |
|-------|-------------|------------|-------|
| lo namcu | .42. .e .-7. | .###. | .64 bit. noi selzi'o |
| lo pruce | .3.14. .e .1.5e10. | .##.. | lo cnino notci ku curmi |
| lo gismu | ."val". | .##". | lo se snidu .i la .{cmene}. zo'u ."coi {cmene}". |
| lo lerfu | .'A'. | .##'. | lo pa .unikuad. lerfu |
| lo jetnu | .#1. .e .#0. | .##?. | na namcu .i la .#1. du la .1. na'i |
| lo liste | .[1, 2, 3]. | .##]. | lo selcmi poi mintu drata |
| lo tuple | .(a, b). | .##). | lo se stuzi |
| lo tuple poi se cmene | .(x: 1, y: 2). | .##). | lo se klani poi se cmene |
| lo fanva | lo se fanva be lo cmene | .##(). | lo drata be la .klasa pamoi. .i go'i cu cfari .<funct/N>. |
| lo lambda | .x -> x * 2. | .##->. | lo drata be la .klasa pamoi. .i go'i cu cfari .<lambd/N>. |

```zymbol
// lo se fanva be lo drata .i go'i cu se cpacu (lo drata .a lo namcu .a lo stero)
leta = 42#?
>> leta ¶         // → (###, 2, 42)
t = leta[1]
>> t ¶            // → ###
```

---

## lo se cliva .e lo se nerkla

```zymbol
>> "coi" ¶                       // lo se darsi poi ke'a se sinxa lo nu se dzipo'o
>> "a=" a " b=" b ¶               // lo se dzukla .i ro namcu
>> (arr$#) ¶                      // lo selcmi ku pilno lo .(). bu'u la .>>.

>> cmene                           // lo velcli cu cpacu lo stero
>> "do'e .i ti cmene: " cmene            // lo se nerkla
```

> la .¶. (la'o .AltGr+R. bu'u la .espanias.) .e la .\\. cu mintu

---

## lo te stu

lo se pilno be lo te stu be'o ku noi lo terbilma cu se pilno .i so'ada cu te cpedu lo lo'e bliku be la .>>| { }. .i la .skrine drata. .a la .cistce.

```zymbol
>>| {
    >>!                             // lo skrine cu se snipa
    >>~ (1, 1, 0, 10) > "ca'o"   // lo jmive 1, lo mapku 1, la .fg. cu du 10 (lo crino)
    @~ 1000                         // lo nu ce'u se zmanei .i lo 1 sek.
    >>~ (2, 1) > "fa'u"
}
// lo te stu cu se za'u
```

```zymbol
// lo kihi .e lo canlu be lo te stu
>>| {
    [jmive, mapku] = >>?              // lo te stu cu te cpedu
    >>~ (1, 1) > "te stu: " jmive " x " mapku
    <<| kihi                         // lo kihi cu se cpacu
    >>~ (2, 1) > "do'a: " kihi
}
```

> la .>>!. cu se snipa lo skrine .i la .>>?. cu se cpacu .[jmive, mapku]. .i la .@~ N. cu se zmanei N .milisek.

> la .<<|. cu se cpacu lo .ki'i. .i la .<<|?. cu se stidi lo jicmu .i la .'\0'. cu te cpacu fo lo nu no

> la .tuple. be lo te stuzi zo'u .(jmive, mapku, BKS, fg, bg). .i ro jbini cu se fi'u lo .komma. .i la .>>~ (,,, 196) > "xunre".

> la .BKS. cu se bitmask .i .1. du lo .bold. .i .2. du lo .italic. .i .4. du lo .underline. .i lo .ANSI 256. cu se sinxa .i .0. du lo te stu namcu

> lo .tree-walker. cu se pilno .i ku'i la .>>!. .e la .>>?. .e la .@~. .e la .>>~. cu se pilno vi la .--vm.

---

## lo selci'u

```zymbol
// lo namcu
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (lo te djica be lo namcu)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (lo te zenba)

// lo du'u klesi .i go'i cu se gunka lo nu te ciksi
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// lo jetnu
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## lo gismu

```zymbol
// lo ka ce'u simxu
cmene = "alis."
n = 42

>> "coi " cmene " do zvati " n ¶       // lo se dzukla .i bu'u la .>>.
sefiksi = "coi {cmene}, do zvati {n}"     // lo se snidu .i bu'u ro kampu
```

```zymbol
s = "coi lo terdi"
lo ni clani = s$#                  // 11
lo se viknu = s$[1..5]             // "coi l"  (1-za'u, lo se viknu cu se manku)
lo du'u zvati = s$? "terdi"          // #1
lo se daski = "a,b,c,d"$/ ','   // [a, b, c, d]  (lo se ciste)
lo se stika = s$~~["l":"r"]        // "coi ro terdi"
lo se stika = s$~~["l":"r":1]     // "coi r terdi"  (lo pa N cu se djica)
lo jmive = "─" $* 20           // "────────────────────"  (lo te dzukla N)
```

> la .+. cu se pilno bu'u lo namcu .i tu'a lo gismu .a lo .komma. .a lo se dzukla .a lo se snidu

---

## lo finti be lo nu se manri

```zymbol
x = 7

? x > 0 { >> "co'e" ¶ }

? x > 100 {
    >> "banli" ¶
} _? x > 0 {
    >> "co'e" ¶
} _? x == 0 {
    >> "no" ¶
} _ {
    >> "palci" ¶
}
```

> lo .{ }. cu **te nitcu** .i ki'u lo nu pa .ciksi.

---

## lo .nelci.

```zymbol
// lo namcu
pa = 85
trano = ?? pa {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> trano ¶    // → B

// lo gismu
skari = "xunre"
kode = ?? skari {
    "xunre"   => "#FF0000"
    "crino" => "#00FF00"
    _       => "#000000"
}

// lo mupli be lo du'u klesi
temci = -5
cista = ?? temci {
    < 0  => "bisymi"
    < 20 => "berta"
    < 35 => "glare"
    _    => "finti"
}
>> cista ¶    // → bisymi

// lo mupli be lo .ciksi. .i la .bliku.
n = -3
?? n {
    0    => { >> "no" ¶ }
    < 0  => { >> "palci" ¶ }
    _    => { >> "co'e" ¶ }
}
```

---

## lo .li.

```zymbol
@ i:0..4  { >> i " " }        // lo namcu cu se manku:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // lo .stapa. cu se manku:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // lo se dzukla:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (lo nu citri)

plise = ["plise", "peara", "vitis"]
@ p:plise { >> p ¶ }         // lo ro selcmi

@ c:"hello" { >> c "-" }
>> ¶                          // → h-e-l-l-o-  (lo ro lerfu)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // lo nu @> se sinxa lo nu se
    ? i > 7 { @! }             // lo nu @! se sinxa lo nu fanmo
    >> i " "
}
>> ¶                          // → 1 3 5 7

// lo li noi na fanmo
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// lo li poi se cmene .i lo se cpacu
co = 0
@:drani {
    co++
    ? co >= 3 { @:drani! }
}
>> co ¶                    // → 3
```

---

## lo fanva

```zymbol
sumji(a, b) { <~ a + b }
>> sumji(3, 4) ¶    // → 7

fahu(n) {
    ? n <= 1 { <~ 1 }
    <~ n * fahu(n - 1)
}
>> fahu(5) ¶    // → 120
```

lo fanva cu se steci lo du'u **se manri lo drata** .i na cpacu lo stero be lo drata .i ku'i lo nu se cpacu lo se cliva cu se pilno lo .<~>.

```zymbol
basti(a<~, b<~) {
    tempa = a
    a = b
    b = tempa
}
x = 10
y = 20
basti(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> lo fanva be lo cmene cu **lo drata be la .klasa pamoi.** .i se cpacu bu'u lo se selpli .i lo .x -> fn(x). cu se sinxa lo nu se ciste

---

## lo lambda .e lo .cista.

```zymbol
mentu = x -> x * 2
sumji = (a, b) -> a + b
>> mentu(5) ¶    // → 10
>> sumji(3, 7) ¶  // → 10

// lo lambda be lo bliku
vrici = x -> {
    ? x > 0 { <~ "co'e" }
    _? x < 0 { <~ "palci" }
    <~ "no"
}

// lo cista .i ke'a se cpacu lo drata be lo manri
sezga = 3
cihu = x -> x * sezga
>> cihu(7) ¶    // → 21

// lo finti
zbasu(n) { <~ x -> x + n }
sumjideka = zbasu(10)
>> sumjideka(5) ¶    // → 15

// bu'u lo liste
selcihu = [x -> x+1, x -> x*2, x -> x*x]
>> selcihu[3](5) ¶    // → 25
```

---

## lo liste

lo liste cu se stika .i ke'a cu te ckaji lo nu ro selcmi cu mintu drata

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — lo se cpacu (1-za'u: lo pa selcmi)
x = arr[-1]     // 5 — lo namcu be lo du'u noroi (lo se fanmo)
x = arr$#       // 5 — lo ni clani (lo .(arr$#). bu'u la .>>.)

arr = arr$+ 6            // lo nu zenba → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // lo nu tcita bu'u la .2. (1-za'u)
arr3 = arr$- 3           // lo nu cpacu lo pa selcmi
arr4 = arr$-- 3          // lo nu cpacu ro selcmi
arr5 = arr$-[1]          // lo nu cpacu bu'u la .1. (lo pa selcmi)
arr6 = arr$-[2..3]       // lo nu cpacu lo namcu (1-za'u, lo se viknu cu se manku)

zvati = arr$? 3            // #1 — lo du'u zvati
stuzi = arr$?? 3           // [3] — lo ro namcu (1-za'u)
viknu = arr$[1..3]          // [1,2,3] — lo se viknu (1-za'u, lo se viknu cu se manku)
viknu2 = arr$[1:3]          // [1,2,3] — lo mintu .i la se tcita cu se jicmu lo nu tcita

berta = arr$^+             // lo nu se tcita (lo se primitive)
banli = arr$^-            // lo nu se tcita (lo se primitive)

// lo liste be lo tuple poi se cmene .a lo se stuzi .i la $^ .e la lambda be lo du'u klesi
canja = [(cmene: "Carla", nanca: 28), (cmene: "Ana", nanca: 25), (cmene: "Bob", nanca: 30)]
barnananca  = canja$^ (a, b -> a.nanca < b.nanca)    // lo berta (<)
barnacmene = canja$^ (a, b -> a.cmene > b.cmene)   // lo banli (>)
>> barnananca[1].cmene ¶     // → Ana
>> barnacmene[1].cmene ¶    // → Carla

// lo nu se stika (lo liste cu se stika)
arr[1] = 99              // lo nu te cpacu
arr[2] += 5              // lo nu se stika .i la .+=. .e la .-=. .e la .*=. .e la ./. .e la .%. .e la .^=.

// lo nu se stika be lo fanva .i go'i cu se cpacu lo liste noi zasti .i lo zasti na ba se stika
arr2 = arr[2]$~ 99
```

> ro selci'u be lo gunma cu se cpacu **lo liste noi zasti** .i lo .arr = arr$+ 4. cu se gunka

> la .$+. cu se krasi .i lo .arr = arr$+ 5$+ 6$+ 7. .i drata selci'u cu pilno lo nu se stika

> **lo .index. cu du 1-za'u** .i la .arr[1]. cu du lo pa selcmi .i la .arr[0]. cu se fliba

> lo .$^+. .e la .$^-. cu se tcita **lo liste be lo .primitive.** (lo namcu .e lo gismu) .i tu'a lo liste be lo .tuple. cu pilno la .$^. .e la .lambda. be lo du'u klesi .i lo du'u .<. cu sinxa lo .berta. .i lo .>. cu sinxa lo .banli.

**lo .semantics. be lo stero** .i lo nu se cpacu liste bu'u lo stero drata cu se cpacu lo liste noi se fukpi

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b na se stika
```

```zymbol
// lo liste poi se cmpacu (lo index 1-za'u)
matci = [[1,2,3],[4,5,6],[7,8,9]]
>> matci[2][3] ¶    // → 6  (lo jmive 2, lo mapku 3)
```

---

## lo te viknu

```zymbol
// lo liste
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[pa, *drata] = arr         // pa=10  drata=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // lo _ cu se cpacu

// lo tuple be lo se stuzi
pinta = (100, 200)
(px, py) = pinta             // px=100  py=200

// lo tuple poi se cmene
remna = (cmene: "Ana", nanca: 25, tcadu: "Madrid")
(cmene: n, nanca: n) = remna   // n="Ana"  n=25
```

---

## lo .tuple.

lo .tuple. cu **na binxo** .i ke'a cu te ckaji lo nu ro selcmi cu se drata drata .i tu'a lo liste na se stika

```zymbol
// lo se stuzi .i lo drata cu curmi
pinta = (10, 20)
>> pinta[1] ¶    // → 10

datni = (42, "coi", #1, 3.14)
>> datni[3] ¶     // → #1

// lo se cmene
remna = (cmene: "alis.", nanca: 25)
>> remna.cmene ¶    // → alis.
>> remna[1] ¶      // → alis.  (lo index cu se pilno, 1-za'u)

// lo se cmpacu
stuzi = (x: 10, y: 20)
p = (stuzi: stuzi, tcita: "frati")
>> p.stuzi.x ¶        // → 10
```

**lo nu na binxo** .i ro se pilno be lo nu se stika tu'a lo .tuple. cu se fliba

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ lo .tuple. na binxo
// t[1] += 5    // ❌ lo .tuple. na binxo
```

lo .$~. cu se pilno .i go'i cu se cpacu **lo .tuple. noi zasti**

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← lo zasti na binxo
>> t2 ¶    // → (10, 999, 30)

// lo tuple poi se cmene .i go'i cu se finti
remna = (cmene: "alis.", nanca: 25)
banli  = (cmene: remna.cmene, nanca: 26)
>> remna.nanca ¶    // → 25
>> banli.nanca ¶     // → 26
```

---

## lo fanva be lo .Higher-Order.

```zymbol
namcu = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

mentu  = namcu$> (x -> x * 2)                  // lo map  → [2,4,6…20]
stero  = namcu$| (x -> x % 2 == 0)           // lo filter → [2,4,6,8,10]
roi    = namcu$< (0, (sebna, x) -> sebna + x)     // lo reduce → 55

// lo krasi .e lo krasi
stapa1 = namcu$| (x -> x > 3)
stapa2 = stapa1$> (x -> x * x)
>> stapa2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// lo fanva be lo cmene cu se cpacu bu'u lo HOF
mentu(x) { <~ x * 2 }
banli(x) { <~ x > 5 }
r = namcu$> mentu       // ✅ lo se cpacu
r = namcu$| banli       // ✅ lo se cpacu
```

---

## lo .pipe.

lo .pipe. cu te cpedu lo du'u la ._. cu se pilno

```zymbol
mentu = x -> x * 2
sumji = (a, b) -> a + b
zenba = x -> x + 1

r1 = 5 |> mentu(_)        // → 10
r2 = 10 |> sumji(_, 5)       // → 15
r3 = 5 |> sumji(2, _)        // → 7

// lo krasi
r = 5 |> mentu(_) |> zenba(_) |> mentu(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## lo .fliba.

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "lo nu se jersi lo no" ¶
} :! {
    >> "lo drata: " _err ¶    // lo ._err. cu te ckaji lo notci be lo .fliba.
} :> {
    >> "lo nu snada" ¶
}
```

| lo .fliba. | lo nu |
|------------|-------|
| `##Div` | lo nu se jersi lo no |
| `##IO` | lo te jersi .a lo te ciste |
| `##Index` | lo .index. be lo nu se jersi |
| `##Type` | lo drata .a lo drata na mintu |
| `##Parse` | lo .datni. |
| `##Network` | lo .fliba. be lo .network. |
| `##_` | lo ro .fliba. |

---

## lo .module.

```zymbol
// lo .lib/calc.zy. .i lo te tcita cu se tcita bu'u lo .{ }.
# calc {
    #> { lo .sumji., lo .get_PI. }

    lo ._π. := 3.14159
    lo .sumji.(a, b) { <~ a + b }
    lo .get_PI.() { <~ lo ._π. }
}
```

```zymbol
// lo .main.zy.
<# ./lib/calc => c    // lo .alias. cu te nitcu

>> c::lo .sumji.(5, 3) ¶     // → 8
π = c::lo .get_PI.()
>> π ¶               // → 3.14159
```

```zymbol
// lo nu se cpacu fo lo drata cmene
# mylib {
    #> { lo ._sumji. => lo .roi. }

    lo ._sumji.(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::lo .roi.(3, 4) ¶    // → 7  (lo ._sumji. cu se stu)
```

> **lo .module. .i lo te tcita** .i bu'u lo .# cmene { }. .i ro .#>. .e lo fanva .e lo stero be lo .literal. cu curmi .i lo .>>. .e lo .<<. .e lo .li. .e lo drata cu te zenba lo .fliba. E013

---

## lo .namcu. be lo .numeral.

la .zymbol.lang. cu cfari lo namcu bu'u lo **69 .Unicode. be lo .numeral.** — la .Devanagari., la .Arab-Indian., la .Thai., la .Klingon. pIqaD, la .Mathematical Bold., la .LCD., etc. lo .mode. cu se gunka bu'u la .>>. .i ku'i lo te namcu be lo .binary. cu se gunka

### lo .script. cu se gasnu

lo .script. cu se gasnu bu'u lo .#…#.

```zymbol
#०९#    // la .Devanagari.   (U+0966–U+096F)
#٠٩#    // la .Arab-Indian. (U+0660–U+0669)
#๐๙#    // la .Thai.         (U+0E50–U+0E59)
#09#    // lo .ASCII. cu se za'u
```

### lo .cliva. .e lo .jetnu.

```zymbol
x = 42
>> x ¶          // → 42   (lo .ASCII. cu se za'u)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (lo .point. decimal cu .ASCII.)
>> 1 + 2 ¶      // → ३

// lo .jetnu. .i lo .#. cu .ASCII. .i lo .numeral. cu se stika
>> #1 ¶         // → #१   (lo .jetnu. bu'u la .Devanagari.)
>> #0 ¶         // → #०   (lo .jifnu. .i drata la .०. lo .zero.)

x = 28 > 4
>> x ¶          // → #१   (lo .klesi. cu se manri fo lo .mode.)
```

### lo .numeral. be lo .literal. bu'u lo .source.

lo .numeral. be lo .script. cu se pilno — bu'u lo .range., lo .modulo., lo .klesi.:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### lo .jetnu. be lo .literal. bu'u lo .script.

`#` + lo .numeral. `0` .a `1` cu se pilno

```zymbol
#٠٩#
acti = #١        // lo #1
>> acti ¶        // → #١
>> (#١ && #٠) ¶ // → #٠
```

> `#` **lo .ASCII.** .i lo .#0. (lo .jifnu.) cu drata la .0. (lo .zero.)

---

## lo selci'u be lo .datni.

```zymbol
// lo .type. .i lo .cast.
f = ##.42         // → 42.0  (la .float.)
i = ###3.7        // → 4     (la .int., lo .round.)
t = ##!3.7        // → 3     (la .int., lo .truncate.)

// lo .parse. be lo gismu
v1 = #|"42"|      // → 42  (la .int.)
v2 = #|"3.14"|    // → 3.14  (la .float.)
v3 = #|"abc"|     // → "abc"  (lo .safe., lo .fliba. na)

// lo .round. / lo .truncate.
π = 3.14159265
r2 = #.2|π|      // → 3.14  (la .2. place decimal)
r4 = #.4|π|      // → 3.1416
t2 = #!2|π|      // → 3.14  (lo .truncate.)

// lo fanva be lo namcu
formato = #,|1234567|  // → 1,234,567  (lo komma)
saske = #^|12345.678|    // → 1.2345678e4  (lo saske)

// lo .base.
a = 0x41         // → 'A'  (lo .hex.)
b = 0b01000001   // → 'A'  (lo .binary.)
c = 0o101        // → 'A'  (lo .octal.)

// lo .base. .i lo .output.
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## lo .shell. .i lo .integrate.

```zymbol
lo .detri. = <\ date +%Y-%m-%d \>     // lo .stdout. cu se cpacu .i lo .\n. cu se manku
>> "cino: " lo .detri.

lo .file. = "data.txt"
lo .se kansa. = <\ cat {lo .file.} \>      // lo .interpolate. bu'u lo .command.

lo .cliva. = </"./subscript.zy"/>   // lo .zymbol. script .i lo .cliva. cu se cpacu
>> lo .cliva.
```

> `><` lo .argument. be lo .CLI. cu se cpacu (lo .tree-walker. cu se pilno)

---

## lo .FizzBuzz.

```zymbol
vrici(n) {
    ? n % 15 == 0 { <~ "FizzBuzz" }
    _? n % 3  == 0 { <~ "Fizz" }
    _? n % 5  == 0 { <~ "Buzz" }
    _ { <~ n }
}

@ i:1..20 { >> vrici(i) ¶ }
```

---

## lo .refs. be lo .sinxa.

| lo .sinxa. | lo .operator. | lo .sinxa. | lo .operator. |
|------------|---------------|------------|---------------|
| `=` | lo .stero. | `$#` | lo .ni clani. |
| `:=` | lo .stero. noi na binxo | `$+` | lo .se zenba. (lo .krasi.) |
| `>>` | lo .cliva. | `$+[i]` | lo .tcita. bu'u lo .index. (1-za'u) |
| `<<` | lo .nerkla. | `$-` | lo .cpacu. be lo pa selcmi |
| `¶` / `\\` | lo .dzipo'o. | `$--` | lo .cpacu. be lo ro selcmi |
| `?` | lo .ga. | `$-[i]` | lo .cpacu. bu'u lo .index. (1-za'u) |
| `_?` | lo .ga'onai. | `$-[i..j]` | lo .cpacu. bu'u lo .range. (1-za'u) |
| `_` | lo .ga'onai. / lo .wildcard. | `$?` | lo .du'u zvati |
| `??` | lo .nelci. | `$??` | lo .stuzi. be lo ro selcmi (1-za'u) |
| `@` | lo .li. | `$[s..e]` | lo .viknu. (1-za'u) |
| `@ N { }` | lo .li. be lo N | `$>` | lo .map. |
| `@!` | lo .fanmo. | `$\|` | lo .filter. |
| `@>` | lo .se. | `$<` | lo .reduce. |
| `@:cmene { }` | lo .li. poi se cmene | `$/ lo .separator.` | lo .split. |
| `@:cmene!` | lo .fanmo. be lo .label. | `$++ a b c` | lo .concat. |
| `@:cmene>` | lo .se. be lo .label. | `arr[i>j>k]` | lo .index. be lo .navigate. |
| `->` | lo .lambda. | `arr[i] = lo .stero.` | lo .stika. (lo liste cu se pilno) |
| `arr[i] += lo .stero.` | lo .stika. be lo .compound. | `arr[i]$~` | lo .stika. be lo .functional. (lo .copy. noi zasti) |
| `$^+` | lo .tcita. be lo .berta. (lo .primitive.) | `$^-` | lo .tcita. be lo .banli. (lo .primitive.) |
| `$^` | lo .tcita. be lo .comparator. (lo .tuple.) | `<~` | lo .cpacu. |
| `\|>` | lo .pipe. | `!?` | lo .try. |
| `:!` | lo .catch. | `:>` | lo .finally. |
| `#1` | lo .jetnu. | `#0` | lo .jifnu. |
| `$!` | lo .fliba. | `$!!` | lo .propagate. |
| `<#` | lo .import. | `#>` | lo .export. |
| `#` | lo .module. | `::` | lo .call. |
| `.` | lo .access. | `#?` | lo .metadata. |
| `#\|..\|` | lo .parse. | `##.` | lo .cast. la .float. |
| `###` | lo .cast. la .int. (lo .round.) | `##!` | lo .cast. la .int. (lo .truncate.) |
| `#.N\|..\|` | lo .round. | `#!N\|..\|` | lo .truncate. |
| `#,\|..\|` | lo .format. be lo .komma. | `#^\|..\|` | lo .scientific. |
| `#d0d9#` | lo .switch. be lo .numeral. | `#09#` | lo .restore. la .ASCII. |
| `<\ ..\>` | lo .shell. | `>\<` | lo .argument. be lo .CLI. |
| `\ lo .stero.` | lo .destroy. | `°x` / `x°` | lo .hot. (lo .auto.) |
| `>>|` | lo .bliku. be la .TUI. | `>>~` | lo .output. be lo .position. |
| `>>!` | lo .clear. | `>>?` | lo .query. |
| `<<\|` | lo .key. (lo .block.) | `<<\|?` | lo .poll. (lo .non-block.) |
| `@~ N` | lo .sleep. | `$*` | lo .repeat. |

---

## lo .changelog.

### v0.0.5 — lo .TUI. .e lo .hot. .e lo .repeat. _(la .mai. 2026)_

- **lo .break.** lo .separator. be lo .nelci. .i la .: . -> la .=>.
- **lo .break.** lo .alias. be lo .import. .i la .<=. -> la .=>.
- **lo .break.** lo .rename. be lo .export. .i la .<=. -> la .=>.
- **lo .add.** lo .bliku. be la .TUI. la .>>| { }.
- **lo .add.** lo .output. be lo .position. la .>>~ (jmive, mapku, BKS, fg, bg) > mekso.
- **lo .add.** lo .input. be lo .key. la .<<| lo stero. (lo .block.) .e la .<<|? lo stero. (lo .non-block.)
- **lo .add.** la .>>!. (lo .clear.), la .>>?. (lo .query.), la .@~ N. (lo .sleep.)
- **lo .add.** lo .hot. la .°x. / la .x°.
- **lo .add.** lo .repeat. la .$*.
- **lo .VM.** lo .parity. 436/436

### v0.0.4 — lo .index. (1-za'u), lo .function. (lo .first-class.), lo .module. (lo .block.) _(la .apr. 2026)_

- **lo .break.** lo .index. cu du 1-za'u .i la .arr[0]. cu fliba
- **lo .add.** lo .function. be lo .cmene. cu du lo .value. be lo .first-class.
- **lo .add.** lo .module. cu cpedu lo .block. (la .# cmene { }.)
- **lo .add.** lo .index. be lo .multi-dimension. (la .arr[i>j>k]., la .arr[p ; q].)
- **lo .add.** lo .cast. (la .##.expr. (lo .float.), la .###expr. (lo .int. .i lo .round.), la .##!expr. (lo .int. .i lo .truncate.))
- **lo .add.** lo .split. (la .$/. .i lo .Array(lo gismu).)
- **lo .add.** lo .concat. (la .$++ a b c.)
- **lo .add.** lo .li. be lo .N. (la .@ N { }.)
- **lo .add.** lo .li. poi se cmene (la .@:cmene { }., la .@:cmene!., la .@:cmene>.)
- **lo .add.** lo .scope. be lo .stero. (lo ._cmene., lo .\ stero.)
- **lo .add.** lo .pattern. be lo .nelci. (la .< 0 =>., la .> 5 =>., la .== 42 =>.)
- **lo .add.** lo .error. be lo .module. (la .E013.)
- **lo .fix.** la .alias.CONST.
- **lo .VM.** lo .parity. 393/393

### v0.0.3 — lo .Unicode. .e lo .LSP. _(la .apr. 2026)_

- **lo .add.** lo .numeral. be lo .Unicode. 69
- **lo .add.** lo .literal. be lo .boolean. bu'u lo ro script
- **lo .add.** lo .Klingon. pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **lo .add.** lo .opcode. (la .SetNumeralMode.)
- **lo .change.** lo .output. be lo .boolean. cu se sinxa lo .#. (la .#0., la .#1.)

### v0.0.2_01 — lo .rename. be lo .operator. _(la .30 mar. 2026)_

- **lo .change.** la .c|..|. -> la .#,|..|. .e la .e|..|. -> la .#^|..|.
- **lo .add.** lo .alias. be lo .export.

### v0.0.2 — lo .redesign. be lo .collection. .e lo .installer. _(la .24 mar. 2026)_

- **lo .add.** lo .family. be lo .$. (la .$#., la .$+., la .$?., la .$-., la .$[..].)
- **lo .add.** lo .destructuring.
- **lo .add.** lo .index. be lo .negative. (la .arr[-1].)
- **lo .add.** lo .installer. (la .Linux., la .macOS., la .Windows.)

### v0.0.1-patch _(la .25 mar. 2026)_

- **lo .add.** lo .compound. (la .^=.)
- **lo .fix.** lo .parser. .e lo .documentation.

### v0.0.1 — lo .first. _(la .22 mar. 2026)_

- lo .tree-walker. .e lo .VM. (la .--vm., ~4× lo .fast., ~95% lo .parity.)
- lo .core. (la .?., la .@., la .<~., la .->., la .>>., la .<<., la .¶., la .??.)
- lo .Unicode., lo .module., lo .lambda., lo .closure., lo .error.
- lo .REPL., lo .LSP., lo .extension., lo .formatter. (la .zymbol fmt.)

---

_la .zymbol.lang. — lo .sinxa. .i lo .ro bangu. .i lo .na binxo._
