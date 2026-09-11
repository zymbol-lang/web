> **Nkwuputa:** Edemede a ka e mepụtara ma sụgharịa site na ọgụgụ isi aka (AI).
>
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
>
> Ebe ntụaka bụ isi bụ **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** n'ime ebe nchekwa ntụgharị okwu.

---

# Akwụkwọ ntuziaka Zymbol-Lang

> **E degharịrị ya maka v0.0.9 — 2026-09-07**

**Zymbol-Lang** bụ asụsụ mmemme nke akara. Ọ dịghị okwu n'ime ụtọasụsụ ya — ihe ọ bụla e wuru bụ akara. Ọ na-arụ ọrụ otu ahụ n'asụsụ mmadụ ọ bụla.

- Ọ dịghị `if`, `while`, `return` — naanị `?`, `@`, `<~`
- Unicode zuru ezu — njirimara n'asụsụ ọ bụla ma ọ bụ emoji
- Ọ dabereghị n'asụsụ mmadụ — koodu bụ otu ihe n'ebe niile

**Ụdị ntụgharị okwu**: v0.0.9 | **Mkpesa nnwale**: 660/666 (igwe atọ kwetara, 0 dị iche)

---

## Mgbanwe na Ihe Ndị Na-adịgide

```zymbol
x = 10              // mgbanwe na-agbanwe
PI := 3.14159       // ihe na-adịgide — ịhazi ya ọzọ bụ njehie oge ọsọ
aha = "Chukwu"
nọ_na_ọrụ = #1       // boolean eziokwu
👋 := "Ndeewo"
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

`°` (akara ogo, U+00B0) na-ebido mgbanwe na uru ya na-anọpụ iche na ojiji mbụ:

```zymbol
nọmba = [3, 1, 4, 1, 5]
@ n:nọmba {
    °mkpokọta += n
}
>> mkpokọta ¶              // → 14
```

> `°mgbanwe` (prefix) na-eguzo n'elu okirikiri — arụpụta ya na-agụ mgbe `@` gasịrị.
> `mgbanwe°` (suffix) na-eguzo n'ime okirikiri — ọ na-anwụ mgbe okirikiri gwụsịrị.

Nkwupụta nke bụ naanị aha na-agụ mgbanwe ma tụfuo uru ya, ya mere ọ na-adọ aka ná ntị:

```zymbol
ọnụọgụ = 5
ọnụọgụ
```

Onye nchịkọta na-adọ aka ná ntị otu a (ozi ya bụ Bekee mgbe niile):

```text
warning: this statement does nothing: 'ọnụọgụ' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

Ya bụ: *«nkwupụta a anaghị eme ihe ọ bụla: 'ọnụọgụ' ka a gụrụ ma tụfuo ya»*.

---

## Ụdị Data

| Ụdị | Ihe edere | Mkpado `#?` | Ihe ndetu |
|------|---------|----------|-------|
| Ọnụọgụ zuru ezu | `42`, `-7` | `###` | Ọnụọgụ nchekwa: ±(2⁵³ − 1) |
| Ọnụọgụ nkewa | `3.14`, `1.5e10` | `##.` | IEEE-754 okpukpu abụọ |
| Eriri | `"ederede"` | `##"` | Ntinye: `"Ndeewo {aha}"` |
| Akwụkwọ | `'A'` | `##'` | Otu koodu ntụpọ Unicode |
| Boolean | `#1`, `#0` | `##?` | Ọ bụghị ọnụọgụ — `#1 ≠ 1` |
| Ndepụta | `[1, 2, 3]` | `##]` | Otu ụdị, e lere ya anya |
| Ngwakọta e kwuru | `#[1, "abụọ"]` | `##[` | Otu ụdị dị ka `[…]`, e leghị ya anya |
| Tuple | `(a, b)` | `##)` | Ọnọdụ, enweghị ike ịgbanwe |
| Akwụkwọ ọkọwa okwu | `#(x: 1, y: 2)` | `##(` | Site na igodo, enwere ike ịgbanwe |
| Ọrụ | nrụtụ aka ọrụ akpọrọ aha | `##()` | Klas mbụ; na-egosi `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Klas mbụ; na-egosi `<lambd/N>` |
| Nkeji | `##_` | `##_` | Enweghị — enweghị null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(x: 1)#? ¶          // → (##(, 1, #(x: 1))
```

Ọnụọgụ zuru ezu nke na-apụ na nchekwa bụ njehie enwere ike ijide, ọ bụghị mgbanwe nwayọọ:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "n'èzí nso" ¶ // → n'èzí nso
}
```

`##_` bụ ụzọ mmemme si ajụ ma ihe ọ bụla na-anọghị:

```zymbol
ihe_ọ_bụla() { }
uru = ihe_ọ_bụla()
>> (uru == ##_) ¶     // → #1
```

---

## Mwepụta na Ntinye

```zymbol
aha = "Chukwu"
mkpokọta = 3
>> "Ndeewo" ¶             // → Ndeewo
>> "a=" aha " b=" mkpokọta ¶ // → a=Chukwu b=3
>> mkpokọta#? ¶            // → (###, 1, 3)
```

```zymbol
<< aha
<< "Tinye aha gị: " aha
<< ###(4) "Afọ: " afọ
```

**Lee ụdị akara abụọ ahụ.** `>>` na-atụ aka n'èzí: ọ na-ewepụta data na mmemme. `<<` na-atụ aka n'ime: ọ na-ewebata data na mmemme. Ọ dịghị ihe ị ga-echeta ebe a — akụ na-egosi ụzọ ozi na-aga, otu echiche ahụ na-alọghachi na akara ọ bụla na-ebugharị ihe.

> `¶` na `\\` bụ ahịrị ọhụrụ hà nhata. `>>` anaghị agbakwunye otu.
> Onye na-akọwa ụdị tupu ajụjụ na-enyocha mgbe ọ na-agụ ma na-ajụ ọzọ ruo mgbe uru ahụ ziri ezi:
> `##.` Ọnụọgụ nkewa · `##.(T,D)` nkewa · `###(N)` Ọnụọgụ zuru ezu · `##"(N)"` ederede · `##'` otu Akwụkwọ.

Na ọkwa kachasị elu nke faịlụ, `<~` bụ ọnọdụ mwepụ nke mmemme:

```zymbol
>> "na-enyocha" ¶      // → na-enyocha
<~ 0
```

---

## Ihe Ndị Mbụ nke TUI

Ndị na-ahụ maka interface terminal maka mmemme na-emekọrịta ihe. Ọtụtụ chọrọ ngọngọ `>>| { }` (ihe nkiri ọzọ + ọnọdụ ọhụrụ).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Na-agba ọsọ"
    @~ 1000
    >>~ (2, 1) > "Emechara."
}
```

```zymbol
>>| {
    [ahịrị, ogidi] = >>?
    >>~ (1, 1) > "Terminal: " ahịrị " x " ogidi
    <<| igodo
    >>~ (2, 1) > "Pịa: " igodo
}
```

Ebe a ka ị pụrụ ịhụ ihe mere akara ji ejikọta kama ịba ụba. Ị maara na `<<` bụ ntinye na `?` na-ajụ n'enweghị nkwenye. Naanị otu akara dị ọhụrụ:

- `|` bụ **otu nkeji**, ọ bụghị iyi niile.

Site na nke ahụ, ndị na-ahụ maka keyboard abụọ na-agụ onwe ha:

```text
<<        |             ?
ntinye    otu nkeji     n'enweghị nkwenye

<<|   were Otu igodo, ma chere ruo mgbe otu dị
<<|?  lee ma Ọ DỊ igodo, ma gaa n'ihu ma ọ dịghị
```

Otu ihe n'akụkụ nke ọzọ: `>>` na-eziga, `>>!` na-eziga **n'ike** (na-ehichapụ ihe nkiri niile), ebe `>>?` **na-ajụ** kama ide (olebe terminal dị). Akara dị n'aka nri bụ nke na-agbanwe ọnọdụ, ọ na-abịakwa mgbe niile.

> `>>!` na-ehichapụ ihe nkiri. `>>?` na-eweghachi `[ahịrị, ogidi]`. `@~ N` na-ehi ụra N millisekọnd.
> `<<|` na-agụ otu ịpị igodo (na-egbochi); `<<|?` na-enyocha n'egbochighị (`'\0'` ma ọ dịghị).
> Igodo akụ na-abịa dị ka `'↑' '↓' '←' '→'`; ESC bụ koodu ntụpọ 27.
> Tuple mmepụta ọnọdụ: `(ahịrị, ogidi, BKS, n'ihu, azụ)` — enwere ike ịhapụ oghere ọ bụla na kọma (`>>~ (,,, 196) > "ọbara ọbara"`).
> BKS bitmask: `1`=Obi, `2`=Ọdịda, `4`=Ahịrị okpuru. Palette ANSI 256 agba (`0`=ndabara terminal).

---

## Ndị Na-ahụ Maka Ihe

```zymbol
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (nkewa ọnụọgụ zuru ezu)
r5 = a % b    // 1
r6 = a ^ b    // 1000
```

```zymbol
a = 10
b = 3
t1 = a == b    // #0
t2 = a <> b    // #1
t3 = a < b     // #0
t4 = a >= b    // #1
l1 = #1 && #0  // #0
l2 = !#1       // #0
```

> `==` anaghị amanye mgbe ọ bụla: `"5" == 5` bụ `#0`. Usoro na-amanye: `"5" > 4` bụ `#1`, na `"४२" > 5` kwa — ederede ọnụọgụ n'otu n'ime edemede 69 na-atụnyere dị ka ọnụọgụ.
> Ọrụ hà nhata naanị onwe ya, ọ dịghị mgbe hà nhata ọrụ ọzọ nwere otu ahụ.

---

## Eriri

```zymbol
aha = "Chukwu"
n = 42
>> "Ndeewo " aha " ị nwere " n ¶ // → Ndeewo Chukwu ị nwere 42
nkọwa = "Ndeewo {aha}, ị nwere {n}"
>> nkọwa ¶              // → Ndeewo Chukwu, ị nwere 42
```

```zymbol
s = "Ndeewo ụwa"
ogologo = s$#                  // 10
obere = s$[1..5]             // "Ndeew"
nwere = s$? "ụwa"          // #1
akụkụ = "a,b,c,d"$/ ','    // [a, b, c, d]
gbanwee = s$~~["o":"0"]        // "Ndeew0 ụwa"
akara = "─" $* 20
```

> `+` bụ naanị maka ọnụọgụ. Maka eriri jiri nchịkọta ma ọ bụ ntinye.
> `\{` na `\}` bụ ihe mgbochi nkịtị — mgbapụ hà nhata.

---

## Njikwa Iyi

```zymbol
x = 7
? x > 100 {
    >> "ibu" ¶
} _? x > 0 {
    >> "ziri ezi" ¶     // → ziri ezi
} _ {
    >> "ọjọọ" ¶
}
```

Ebe a ka akara abụọ dị, na nke atọ na-abịa site na ijikọ ha:

- `?` bụ **ịjụ**: ọ na-emeghe ọnọdụ.
- `_` bụ **ihe a kọwapụtaghị**: alaka fọdụrụ mgbe ọ dịghị ajụjụ dakọtara.
- `_?` bụ ha abụọ n'usoro: *ọ bụrụ na ọ dịghị ihe dakọtara, jụọ ọzọ*.

Ọ bụ ya mere e ji ede `_?` otu a. Ọ bụghị akara ọhụrụ ịmụta — ọ bụ `_` sochiri `?`, ọ pụtara kpọmkwem ihe akụkụ abụọ ya pụtara, gụọ n'usoro.

> Ihe mgbochi `{ }` bụ **ihe a chọrọ** ọ bụrụgodị na ọ bụ otu nkwupụta.

---

## Nkwekọrịta

```zymbol
akara = 85
ọkwa = ?? akara {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> ọkwa ¶              // → B
```

```zymbol
okpomọkụ = -5
ọnọdụ = ?? okpomọkụ {
    < 0  => "akpụ"
    < 20 => "oyi"
    _    => "ọkụ"
}
>> ọnọdụ ¶              // → akpụ
```

Ị maara na `?` bụ "ịjụ". **`??` bụ ịjụ ọtụtụ oge**: ime ka akara dị okpukpu abụọ n'ebe ọ bụla n'asụsụ ahụ bụ ime ọtụtụ oge ihe akara ahụ na-eme otu ugboro. Otu `?` na-anwale otu ọnọdụ; `??` na-anwale megide ndepụta ikpe.

Nhọrọ ndị ọzọ na-ejikọta na `||`, ha nwekwara ike ịgwakọta ụdị ụkpụrụ:

```zymbol
igodo = 'P'
omume = ?? igodo {
    'p' || 'P' => "kwụsị"
    < 0 || > 100 => "n'èzí nso"
    _ => "e legharịrị anya"
}
>> omume ¶             // → kwụsị
```

---

## Okirikiri

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
mkpụrụ = ["apụl", "pear", "grapes"]
@ m:mkpụrụ { >> m " " }
>> ¶                    // → apụl pear grapes
@ a:"Ndeewo" { >> a "-" }
>> ¶                    // → N-d-e-e-w-o-
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
ọnụọgụ = 0
@:mpụga {
    ọnụọgụ++
    ? ọnụọgụ >= 3 { @:mpụga! }
}
>> ọnụọgụ ¶             // → 3
```

`@` bụ akara **oge**: ihe niile na-emegharị na-ebi n'ime ya. Iji belata oge ahụ ị na-agbakwunye akara n'akụkụ ya:

- `@!` — `!` bụ **ike**: hapụ okirikiri ugbu a.
- `@>` — `>` na-akwali gaa n'ihu: gaa na gburugburu na-esote.
- `@:mpụga!` — `:` **na-ekekọta aha**, ya mere nke a na-ebipụ okirikiri *akpọrọ* mpụga, ọ bụghị nke kacha nso.

Ndị na-ahụ maka atọ, ọ dịghị nke a ga-echeta iche: ha bụ `@` gbakwunyere akara nke na-ekwu ihe ọ na-eme.

> **Onye na-akọwa bụ ọnụọgụ ma ọ bụ ọnọdụ.** `Ọnụọgụ zuru ezu` bụ ọnụọgụ, a na-enyocha ya otu ugboro — `@ 0` na-agba ahụ ugboro efu. Ihe ọ bụla ọzọ bụ ọnọdụ. Enweghị eziokwu: a jụrụ `@ []` na `@ 3.5`. Iji gafee nchịkọta jiri `@ x:ihe`; iji gụọ ya, `@ ihe$#`.

---

## Ọrụ

```zymbol
gbakwunye(a, b) { <~ a + b }
>> gbakwunye(3, 4) ¶        // → 7
```

```zymbol
factorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * factorial(n - 1)
}
>> factorial(5) ¶       // → 120
```

Ọrụ na-agụ mgbanwe faịlụ site na uru, ederede n'ime na-anọkwa n'ime:

```zymbol
oke = 100
n'ime(n) { <~ n < oke }
>> n'ime(42) ¶         // → #1
```

Akara abụọ na-agbanwe nke a, ha abụọ ka e dere **na mbinye aka na ebe ọkpụkpọ**:

```zymbol
bawanye(ọnụọgụ<~) { ọnụọgụ = ọnụọgụ + 1 }
mkpokọta = 0
bawanye(mkpokọta<~)
>> mkpokọta ¶              // → 1
```

> `p~` bụ nnomi ọrụ — ahụ nwere ike ịhazi ya ọzọ ma onye na-akpọ ya agaghị emetụta.
> `p<~` bụ paramita mmepụta — mgbanwe ahụ na-alọghachi. `bawanye(mkpokọta)` n'enweghị akara bụ njehie nghọta: nkọwa na mbinye aka enweghị ike ikewa.

---

## Lambda na Mmechi

```zymbol
okpukpu_abụọ = x -> x * 2
mkpokọta = (a, b) -> a + b
>> okpukpu_abụọ(5) ¶          // → 10
>> mkpokọta(3, 7) ¶          // → 10
```

```zymbol
kewaa = x -> {
    ? x > 0 { <~ "ziri ezi" }
    _? x < 0 { <~ "ọjọọ" }
    <~ "efu"
}
>> kewaa(-4) ¶         // → ọjọọ
```

```zymbol
ihe = 3
okpukpu_atọ = x -> x * ihe
>> okpukpu_atọ(7) ¶          // → 21
```

```zymbol
mee_ihe_nbawanye(n) { <~ x -> x + n }
gbakwunye10 = mee_ihe_nbawanye(10)
>> gbakwunye10(5) ¶           // → 15
```

Lambda nwere ike were paramita ọ bụla:

```zymbol
azịza = () -> 42
>> azịza() ¶           // → 42
```

> Lambda na-ejide mgbanwe faịlụ **mgbe e mepụtara ya**; ọrụ akpọrọ aha na-agụ ha **mgbe a kpọrọ ya**.

---

## Ndepụta

```zymbol
ndepụta = [1, 2, 3, 4, 5]
>> ndepụta[1] ¶       // → 1   ndepụta na-amalite na 1
>> ndepụta[-1] ¶      // → 5   nke ọjọọ na-agụ site na njedebe
>> ndepụta$# ¶        // → 5   ogologo
```

```zymbol
ndepụta = [1, 2, 3]
>> (ndepụta$+ 6) ¶          // → [1, 2, 3, 6]   gbakwunye
>> (ndepụta$+[2] 99) ¶      // → [1, 99, 2, 3]  tinye na ọnọdụ 2
>> (ndepụta$- 3) ¶          // → [1, 2]         wepụ ihe mbụ
>> (ndepụta$-[1]) ¶         // → [2, 3]         wepụ na ndepụta 1
>> (ndepụta$[1..2]) ¶       // → [1, 2]         bee, gụnyere akụkụ abụọ
>> (ndepụta$? 3) ¶          // → #1             nwere
```

Ha niile na-amalite na `$`, akara **nchịkọta**, ma na-aga n'ihu na akara na-ekwu ihe a na-eme n'ime ya: `#` ole, `+` gbakwunye, `-` wepụ, `?` jụọ ma ọ dị. Dị ka `??`, ime akara okpukpu abụọ pụtara ime ya nke ọma: `$?` na-ajụ *ma* uru dị, `$??` na-ajụ *ebe ole* ma weghachi ha niile.

```zymbol
ndepụta = [3, 1, 2]
>> (ndepụta$^+) ¶     // → [1, 2, 3]   nrịgo
>> (ndepụta$^-) ¶     // → [3, 2, 1]   mgbada
```

**Iwu nke arụpụta.** Otu onye na-ahụ maka, na ihe koodu gbara ya gburugburu na-eme ya na-ekpebi: ọ bụrụ na e jiri ya mee ihe, ọ **na-ewu** ma hapụ nke mbụ; ọ bụrụ na a tụfuo ya, ọ **na-agbanwe**.

```zymbol
ndepụta = [1, 2, 3]
nnomi = ndepụta[2]$~ 99
>> ndepụta ¶                // → [1, 2, 3]
>> nnomi ¶              // → [1, 99, 3]
ndepụta[2]$~ 99
>> ndepụta ¶                // → [1, 99, 3]
```

> **`=` anaghị ede n'ime nchịkọta mgbe ọ bụla.** `ndepụta[2] = 99` abụghị ụdị Zymbol — `=` na-enye **aha** uru. Ịgbanwe akụkụ nke nchịkọta bụ `$~`, na nchịkọta ọ bụla.

`[…]` nwere otu ụdị, a na-enyocha ya; ngwakọta e bu n'obi ka a **na-ekwupụta** na `#[…]`:

```zymbol
ngwakọta = #[1, "abụọ", #1]
>> ngwakọta ¶             // → [1, abụọ, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Ndepụta Ọtụtụ Akụkụ

`>` na-agbada n'ụdị a kpọkọtara. Otu ìgwè ihe mgbochi na-edozi otu ihe, n'agbanyeghị omimi ya.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   ahịrị 2, ogidi 3
>> m[-1>-1] ¶      // → 9   ahịrị ikpeazụ, ogidi ikpeazụ
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          dị larịị: dayagonal
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   ahaziri: akụkụ
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` **abụghị** ụdị Zymbol. A jụrụ ndepụta agbụ ma ọ bụ maka ịgụ ma ọ bụ maka ide — otu ìgwè ihe mgbochi maka otu nweta, na `>` bụ ihe na-aga n'etiti nzọụkwụ.

---

## Akwụkwọ Ọkọwa Okwu

Tuple nwere mpaghara akpọrọ aha bụ akwụkwọ ọkọwa okwu, site na v0.0.9 edere ya dị ka `#(…)`.

```zymbol
mmadụ = #(aha: "Chukwu", afọ: 25)
>> mmadụ.aha ¶        // → Chukwu
>> mmadụ["afọ"] ¶    // → 25
```

```zymbol
mmadụ = #(aha: "Chukwu", afọ: 25)
mpaghara = "aha"
>> mmadụ[mpaghara] ¶     // → Chukwu
```

Enwere ike ịgbanwe ya, tinye igodo, na ịgafee ya:

```zymbol
ngwa = #(pear: 4)
ngwa["apụl"]$~ 10
@ k:ngwa { >> k "=" ngwa[k] " " }
>> ¶                    // → pear=4 apụl=10
```

```zymbol
ngwa = #(pear: 4, apụl: 10)
@ (k, v):ngwa { >> k ":" v " " }
>> ¶                    // → pear:4 apụl:10
```

> `#()` bụ akwụkwọ ọkọwa okwu tọgbọ chakoo, nke `()` enweghị ike ịbụ — ọ ga-abụkwa tuple tọgbọ chakoo. `(x: 1)` gba ọtọ ka a jụrụ na ozi a: *a dictionary is written `#(…)`* — «a na-ede akwụkwọ ọkọwa okwu `#(…)`».
> A na-ezo aka na akwụkwọ ọkọwa okwu site na igodo, ọ dịghị mgbe site n'ọnọdụ, ya mere `mmadụ[1]` bụ njehie.

---

## Tuple

Tuple bụ arịa ahaziri **enweghị ike ịgbanwe** nke na-ejide ụdị uru dị iche iche.

```zymbol
ntụpọ = (10, 20)
>> ntụpọ[1] ¶           // → 10
data = (42, "Ndeewo", #1, 3.14)
>> data[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Mgbalị ọ bụla ịgbanwe tuple n'ebe ọ nọ bụ njehie, ihe ọ bụla onye na-ahụ maka ya — enweghị ike ịgbanwe bụ ihe onwunwe nke uru, ọ bụghị mwepu n'ime `$` ọ bụla.

---

## Mbibi Ụdị

```zymbol
ndepụta = [10, 20, 30, 40, 50]
[a, b, c] = ndepụta
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
ndepụta = [10, 20, 30, 40, 50]
[mbụ, *fọdụrụ] = ndepụta
>> mbụ ¶            // → 10
>> fọdụrụ ¶              // → [20, 30, 40, 50]
```

```zymbol
ntụpọ = (100, 200)
(px, py) = ntụpọ
>> px " " py ¶          // → 100 200
```

```zymbol
mmadụ = #(aha: "Ada", afọ: 25)
#(aha: n, afọ: a) = mmadụ
>> n " " a ¶            // → Ada 25
```

> Ụdị ihe mgbochi bụ nke e dere: `[…]` na-ewere ndepụta, `(…)` tuple, `#(…)` akwụkwọ ọkọwa okwu. Aha ikpeazụ **na-amịkọrọ ihe fọdụrụ**, ya mere mbibi ụdị anaghị ada na ogologo — `(a, b, c) = (1,2,3,4,5)` na-enye `c = (3,4,5)`, na `##_` mgbe ihe ọ bụla na-adịghị.

---

## Ọrụ Ọkwa Elu

```zymbol
nọmba = [1, 2, 3, 4, 5]
>> (nọmba$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (nọmba$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (nọmba$< (0, (nkpokọta, x) -> nkpokọta + x)) ¶ // → 15
```

```zymbol
nọmba = [1, 2, 3, 4, 5, 6]
okpukpu_abụọ(x) { <~ x * 2 }
ibu(x) { <~ x > 3 }
>> (nọmba$> okpukpu_abụọ) ¶    // → [2, 4, 6, 8, 10, 12]
>> (nọmba$| ibu) ¶    // → [4, 5, 6]
```

```zymbol
isi = [#(aha: "Carla", afọ: 28), #(aha: "Ada", afọ: 25)]
site_afọ = isi$^ (a, b -> a.afọ < b.afọ)
>> site_afọ[1].aha ¶     // → Ada
```

> Ọrụ akpọrọ aha na-aga HOF **n'enweghị ihe mgbochi**: `nọmba$> okpukpu_abụọ`. Ide `nọmba$> (okpukpu_abụọ)` bụ njehie nyocha, n'ihi na `(` na-emeghe lambda.

---

## Onye Na-ahụ Maka Ọkpọ

```zymbol
okpukpu_abụọ = x -> x * 2
gbakwunye = (a, b) -> a + b
inc = x -> x + 1
>> (5 |> okpukpu_abụọ(_)) ¶    // → 10
>> (10 |> gbakwunye(_, 5)) ¶  // → 15
>> (5 |> okpukpu_abụọ(_) |> inc(_)) ¶ // → 11
```

---

## Njikwa Njehie

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "nkewa site na efu" ¶  // → nkewa site na efu
} :! {
    >> "ọzọ: " _err ¶
} :> {
    >> "na-agba mgbe niile" ¶        // → na-agba mgbe niile
}
```

| Ụdị | Mgbe |
|------|------|
| `##Div` | Nkewa site na efu |
| `##Index` | Ndepụta n'èzí oke |
| `##Key` | Igodo adịghị n'akwụkwọ ọkọwa okwu |
| `##Range` | N'èzí nso ọnụọgụ zuru ezu |
| `##Type` | Ụdị ekwekọghị |
| `##Parse` | Nyocha data |
| `##IO` | Faịlụ / sistemụ |
| `##Network` | Njehie netwọk |
| `##DB` | Nchekwa data |
| `##Time` | Ụbọchị na-adịghị |
| `##_` | Njehie ọ bụla (na-ejide niile) |

`!` bụ akara **njehie na ike**, a na-agụkwa ya otu n'ezinụlọ abụọ: `$!` na-ajụ uru ma ọ bụ njehie; `$!!`, na akara okpukpu abụọ, na-agbasa ya elu n'ajụghị ajụ.

> Ọdịda ọba akwụkwọ ọkọlọtọ na-alọghachi dị ka **uru njehie dị nro** nke ị na-anwale na `$!` ma ọ bụ jide na `!?`, kama ịkwụsị. `$!!` na-agbasa otu n'aka onye na-akpọ.

---

## Modulu

```zymbol
# mgbako {
    #> { gbakwunye, PI }

    PI := 3.14159
    gbakwunye(a, b) { <~ a + b }
}
```

```zymbol
<# ./mgbako => m

>> m::gbakwunye(5, 3) ¶
>> m.PI ¶
```

```zymbol
# ọba_akwụkwọ_m {
    #> { gbakwunye_n'ime => mkpokọta }

    gbakwunye_n'ime(a, b) { <~ a + b }
}
```

Akara modulu abụọ bụ otu echiche, ugbu a etinyere na faịlụ: `#` bụ ọkwa **nkwupụta** — ihe ihe *bụ*, ọ bụghị uru ya — akụ na-ekwu ụzọ koodu na-aga:

```text
<#   akụ na-abanye: mbubata, weta site na faịlụ ọzọ
#>   akụ na-apụ: mbupụ, nye faịlụ ndị ọzọ
```

Akara ụzọ na-anọdụ mgbe niile n'ọnụ ọnụ nke chere ihu n'ụzọ ọ na-atụ aka. Nke a bụ otu ihe mere `<~` ji alọghachi n'aka ekpe (site na ọrụ) na `->` ji abanye n'aka nri (n'ime ahụ lambda).

> **Modulu na-ekwupụta ihe ọ na-ebupụ.** Ngọngọ `#>` bụ ihe a chọrọ — ịhapụ ya bụ **E014**, na `#> { }` bụ otu modulu si ekwu na elu ya tọgbọ chakoo. `::` na-akpọ ọrụ, `.` na-agụ ihe na-adịgide. Naanị mbubata, ngọngọ mbupụ, ihe mbido ederede na nkọwa ọrụ nwere ike ịpụta n'ahụ modulu; ihe ọ bụla nwere ike ime bụ **E013**.

---

## Ọba Akwụkwọ Ọkọlọtọ

Modulu ọdịnala, e bubatara dị ka ndị ọzọ:

| Modulu | Ọrụ |
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

>> t::width("手番") ¶            // → 4   glyph abụọ, ogidi anọ
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

ụbọchị = T::of(2026, 1, 31)
>> T::format(ụbọchị, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(ụbọchị, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` na-atụ **ogidi ngosi**, ọ bụghị mkpụrụ edemede: CJK na ọtụtụ emoji bụ ogidi 2, ya mere jiri `t::width` hazie tebụl, ọ dịghị mgbe `$#`.
> Na `std/time` otu nkeji bụ millisekọnd site na oge. Ihe na-erughị otu ụbọchị bụ ogologo oge, site n'otu ụbọchị gaa n'ihu bụ kalenda — ya mere otu ọnwa na-adaba n'otu ụbọchị nke ọnwa, e kekọtara. `ọdịiche(a, b)` bụ `a - b`, ya mere oge gara aga nke mbụ na-enye azịza ọjọọ.

---

## Ngwugwu

Otu `.zyp` na-ekekọta mmemme ọtụtụ faịlụ n'otu faịlụ ebu. Ọ bụ ebe nchekwa **isi iyi**, ọ bụghị ọnụọgụ abụọ, ya mere ọ na-agba ebe ọ bụla `zymbol` na-agba.

```bash
zymbol package oru_m/ --script main.zy -o oru_m.zyp
zymbol run oru_m.zyp
```

> Ebe nchekwa nwere manifest (`zyp.toml`) na-ekwupụta script ntinye ya na ụdị igwe ọ chọrọ. `zymbol run` na-ewepụta ya n'ime ndekọ nwa oge ma na-agba site ebe ahụ, ya mere koodu bụ ihe a na-atụfu ebe ihe script dere na-adaba na ndekọ ọrụ gị n'ezie. Ebe egwuregwu na-ebugokwa faịlụ `.zyp`.

---

## Ụdị Ọnụọgụ

Zymbol nwere ike ide ọnụọgụ n'ime **edemede ọnụọgụ Unicode 69** — Devanagari, Arab-Inglịsh, Thai, Klingon pIqaD, Mkpụrụ akwụkwọ mgbakọ na mwepụ, akụkụ LCD na ndị ọzọ. Ọnọdụ ahụ bụ nke zuru ụwa ọnụ maka usoro ma na-emetụta mmepụta; mgbako anaghị agbanwe.

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arab-Inglịsh (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // tọgharịa na ASCII
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

Ọnụọgụ sitere na edemede ọ bụla akwadoro bụ ihe edere kwesịrị ekwesị na isi iyi:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Ịgụ hà nhata — a na-aghọta ọnụọgụ n'edemede ọ bụla:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` bụ ASCII mgbe niile, ya mere `#0` na-anọgide dị iche na anya site na ọnụọgụ efu n'edemede ọ bụla.
> `#,` na `#^` na-edekwa ọnụọgụ ha n'edemede na-arụ ọrụ, ihe nkesa na-eso ya — mana ụzọ abụọ ahụ anaghị agbanwe: `,` na-achịkọta ma `.` na-ekewa, n'edemede ọ bụla.

---

## Ndị Na-ahụ Maka Data

```zymbol
f = ##.42         // gaa Ọnụọgụ nkewa
i = ###3.7        // gaa Ọnụọgụ zuru ezu, gbaa gburugburu  → 4
t = ##!3.7        // gaa Ọnụọgụ zuru ezu, bepụ  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> A na-ebipụta Ọnụọgụ nkewa dị ka ọnụọgụ, ọ dịghị mgbe dị ka ike, ma na-atụfu `.0` ikpeazụ — `##.42` na-ede `42` ma ka bụ Ọnụọgụ nkewa, dị ka `f#?` gosiri.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   nchekwa-ọdịda: na-eweghachi ntinye n'ebughị mgbanwe
>> ##!'A' ¶        // → 65    koodu ntụpọ nke Akwụkwọ
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          gbaa gburugburu ruo ọnọdụ 2
>> #!2|pi| ¶       // → 3.14          bepụ ruo ọnọdụ 2
>> #,|1234567| ¶   // → 1,234,567     ihe nkesa puku
>> #^|12345.678| ¶ // → 1.2345678e4  nrịbama sayensị
```

```zymbol
>> 0x41 ¶        // → A   hexadecimal
>> 0b01000001 ¶  // → A   ọnụọgụ abụọ
>> 0o101 ¶       // → A   octal
>> 0d65 ¶        // → A   decimal
```

> Ihe ederede ntọala dị na oke ASCII bụ **Akwụkwọ**: `0d65 == 'A'` bụ `#1`, na `0d65 == 65` bụ `#0`. Ntọala anọ niile na-asụpe otu akwụkwọ.

---

## Njikọ Shell

```zymbol
taa = <\ date +%Y-%m-%d \>
>> "Taa: " taa
```

```zymbol
mmepụta = </"./script_nta.zy"/>
>> mmepụta
```

> `<\ … \>` na-ejide stdout na stderr, na-ewepụ ahịrị ọhụrụ ikpeazụ.
> `>< args` na-ejide arụmụka ahịrị iwu dị ka ndepụta eriri.

---

## Ọmụmaatụ Zuru Ezu: FizzBuzz

```zymbol
kewaa(nọmba) {
    ? nọmba % 15 == 0 { <~ "FizzBuzz" }
    _? nọmba % 3  == 0 { <~ "Fizz" }
    _? nọmba % 5  == 0 { <~ "Buzz" }
    <~ nọmba
}

@ i:1..20 { >> kewaa(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (otu n'ahịrị ọ bụla)
```

---

## Otu Akara Si Ejikọta

Ị hụla otu ihe n'akwụkwọ a niile: **onye na-ahụ maka abụghị eserese ị ga-echeta, ọ bụ ọtụtụ akara n'usoro, nke ọ bụla na-enye aka n'echiche ya.** Ugbu a ị maara ha niile, nke a bụ ụkpụrụ zuru ezu.

Nke mbụ **ụwa anyị nọ**:

| Akara | Ụwa | Ị hụrụ ya na |
|--------|-------|----------------------------|
| `$` | nchịkọta | `$#` `$+` `$?` `$^-` |
| `@` | oge, ihe niile na-emegharị | `@!` `@>` `@~` |
| `#` | ihe ihe *bụ*, ọ bụghị uru ya | `#?` `#(…)` `<#` `#>` |
| `>>` | site na mmemme | `>>` `>>!` `>>?` |
| `<<` | banye na mmemme | `<<` `<<\|` `<<\|?` |
| `?` | jụọ, n'enweghị nkwenye | `?` `_?` `??` `$?` |
| `!` | ike, ma ọ bụ njehie | `@!` `$!` `!?` |

Ozugbo **ihe a na-eme ebe ahụ**: `+` gbakwunye, `-` wepụ, `^` usoro, `~` gbanwee, `#` gụọ, `|` otu nkeji, `:` kekọta aha.

Na iwu abụọ na-adaghị ada:

**Okpukpu abụọ nke akara na-eme ka ọ zuo oke.** `?` na-ajụ otu ugboro, `??` na-anwale ọtụtụ ikpe. `$?` na-ajụ ma uru dị, `$??` na-eweghachi ebe ọ bụla ọ dị. `!` na-akara njehie, `!!` na-agbasa ya n'ajụghị ajụ.

**Akara ọnọdụ na-abịa mgbe niile.** Mgbe `?` ma ọ bụ `!` pụtara ikwu *otu* e si eme ihe — n'egwu ma ọ bụ n'ike — ha bụ akara ikpeazụ nke onye na-ahụ maka: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:mpụga!`. Ọ dịghị arụmọrụ na-esote ha.

Ihe bara uru na-esi na ya pụta: **ngwakọta ị na-ahụtụbeghị nwere ihe ọ pụtara tupu i lelee ya.** Ọ bụrụ na `$` bụ nchịkọta na `^` bụ usoro na `-` bụ ntụgharị, mgbe ahụ `$^-` na-ahazi n'usoro ọjọọ, ọ dịghịkwa onye ga-agwa gị.

Ọ bụghị ndepụta niile na-arụ ọrụ otu ahụ, na ikwu ya dị mma karịa ime ka à ga-asị na ọ dị. Ọtụtụ ndị na-ahụ maka na-ekewa nke ọma. Isii na-ekewa mana ha pụtara karịa akụkụ ha: `!?` `:!` `:>` `|>` `::` `$++`. Na iri a ga-echeta n'isi n'ihi na ha anaghị ekewa ma ọlị: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Ịgụ ndị na-edoghị anya kama iche na ha dị ole na ole bụ ihe e bu n'obi: ha bụ ezigbo ọnụ ahịa ncheta nke asụsụ ahụ. Ebe ntụaka zuru ezu — ndepụta, homograph e kwupụtara, na iwu onye na-ahụ maka ọhụrụ ga-emezu iji dị — bụ `SYMBOLS.md`, n'ime ebe nchekwa ntụgharị okwu.

---

## Ntụaka Akara

| Akara | Ọrụ | Akara | Ọrụ |
|--------|-----------|--------|-----------|
| `=` | mgbanwe | `$#` | ogologo |
| `:=` | ihe na-adịgide | `$+` | gbakwunye |
| `>>` | mmepụta | `$+[i]` | tinye na ndepụta (site na 1) |
| `<<` | ntinye | `$-` | wepụ nke mbụ site na uru |
| `¶` / `\\` | ahịrị ọhụrụ | `$--` | wepụ niile site na uru |
| `?` | ma ọ bụrụ | `$-[i]` | wepụ na ndepụta (site na 1) |
| `_?` | ma ọ bụghị ma ọ bụrụ | `$-[i..j]` | wepụ oke (site na 1) |
| `_` | ma ọ bụghị / akara ọhụrụ | `$?` | nwere |
| `??` | nkwekọrịta | `$??` | chọta ndepụta niile (site na 1) |
| `\|\|` | ma ọ bụ-ụkpụrụ n'ime ngalaba nkwekọrịta | `$[s..e]` | bee (site na 1) |
| `@` | okirikiri | `$>` | map |
| `@ N { }` | okirikiri N ugboro | `$\|` | nyocha |
| `@!` | kwụsị | `$<` | belata |
| `@>` | gaa n'ihu | `$/ onye nkesa` | kewaa eriri |
| `@:aha { }` | okirikiri akpọrọ aha | `$++ a b c` | wuo site na njikọ |
| `@:aha!` | kwụsị aha | `$~~[p:r]` | dochie na eriri |
| `@:aha>` | gaa n'ihu aha | `$*` | megharịa eriri |
| `->` | lambda | `ndepụta[i]$~ v` | ỤDỊDỊ ụdị mmelite |
| `<~` | laghachi / paramita mmepụta | `~` | paramita nnomi ọrụ |
| `ndepụta[i>j]` | ndepụta nsọtụ | `ndepụta[p ; q]` | mwepụta dị larịị |
| `$^+` | hazie nrịgo | `$^-` | hazie mgbada |
| `$^` | hazie na onye ntụnyere | `\|>` | ọkpọ |
| `!?` | nwaa | `:!` | jide |
| `:>` | n'ikpeazụ | `$!` | njehie |
| `$!!` | gbasaa njehie | `#1` / `#0` | eziokwu / ụgha |
| `##_` | Nkeji — enweghị | `[…]` | ndepụta, otu ụdị |
| `#[…]` | ndepụta, ngwakọta e kwuru | `#(…)` | akwụkwọ ọkọwa okwu |
| `(…)` | tuple ọnọdụ | `#()` | akwụkwọ ọkọwa okwu tọgbọ chakoo |
| `<#` | mbubata | `#>` | mbupụ |
| `#` | kwupụta modulu | `::` | kpọọ modulu |
| `.` | nnweta mpaghara / ihe na-adịgide | `#?` | metadata ụdị |
| `#\|..\|` | nyochaa ọnụọgụ | `##.` | gbanwee gaa Ọnụọgụ nkewa |
| `###` | gbanwee gaa Ọnụọgụ zuru ezu (gbaa gburugburu) | `##!` | gbanwee gaa Ọnụọgụ zuru ezu (bepụ) |
| `#.N\|..\|` | gbaa gburugburu | `#!N\|..\|` | bepụ |
| `#,\|..\|` | ihe nkesa puku | `#^\|..\|` | sayensị |
| `#d0d9#` | gbanwee ọnọdụ ọnụọgụ | `#09#` | tọgharịa na ASCII |
| `<\ ..\>` | gbaa shell | `><` | arụmụka CLI |
| `\ var` | bibie mgbanwe | `°x` / `x°` | nkọwa ọkụ |
| `>>\|` | ngọngọ TUI (ihe nkiri ọzọ) | `>>~` | mmepụta ọnọdụ |
| `>>!` | hichapụ ihe nkiri | `>>?` | jụọ ogo terminal |
| `<<\|` | ịpị igodo na-egbochi | `<<\|?` | ịpị igodo na-egbochighị |
| `@~ N` | hie ụra N millisekọnd | `0d` `0x` `0o` `0b` | ihe ederede ntọala |

---

## Ndekọ Mgbanwe Mwepụta

### v0.0.9 — Nchịkọta kpebiri _(Septemba 2026)_

- **Mgbanwe** Akwụkwọ ọkọwa okwu nwere nrịbama nke ya: `#(igodo: uru)`. `(x: 1)` gba ọtọ ka a jụrụ, na `#()` bụ akwụkwọ ọkọwa okwu tọgbọ chakoo — nke `()` enweghị ike ịbụ
- **Mgbanwe** E wepụrụ ndoputa ndepụta: `ndepụta[i] = v` na ụdị ngwakọta niile. `=` na-enye **AHA** uru; ịgbanwe akụkụ nke nchịkọta bụ `$~`
- **Mgbanwe** A jụrụ ndepụta agbụ `m[i][j]` maka ịgụ na ide — `>` na-aga n'etiti nzọụkwụ
- **Mgbanwe** Modulu ga-ekwupụta ihe ọ na-ebupụ (**E014**); `#> { }` bụ otu modulu si ekwu na elu ya tọgbọ chakoo
- **Mgbanwe** Onye na-akọwa okirikiri bụ ọnụọgụ ma ọ bụ ọnọdụ — enweghị eziokwu. A jụrụ `@ []` na `@ 3.5`
- **Agbakwunyere** `##_` — ihe ederede Nkeji, na otu mmemme si ajụ ma ihe na-anọghị
- **Agbakwunyere** `#[…]` — ndepụta nke a kwupụtara ngwakọta ụdị ihe ya
- **Agbakwunyere** `#?` na-akpa nchịkọta anọ iche: `##]` `##[` `##)` `##(`
- **Agbakwunyere** `std/time` — elekere na kalenda obodo, na mpaghara na mgbako kalenda
- **Agbakwunyere** `<~>` na ọkwa kachasị elu bụ ọnọdụ mwepụ nke mmemme
- **Agbakwunyere** `@ (k, v):ụzọ abụọ` — ụkpụrụ n'isi okirikiri
- **Agbakwunyere** `#|c|` na-agụ ọnụọgụ n'otu n'ime edemede 69; `#,` na `#^` na-ede na nke na-arụ ọrụ
- **Gbanwere** `Ọnụọgụ zuru ezu` bụ ọnụọgụ nchekwa, ±(2⁵³ − 1), mechiri-ọdịda na igwe ọ bụla
- **Gbanwere** Ọrụ akpọrọ aha na-agụ mgbanwe faịlụ n'oge ọkpụkpọ, site na uru
- **Gbanwere** Nkwupụta nke na-agụ naanị aha na-adọ aka ná ntị kama ịgafe na nwayọọ
- **Igwe** 660 n'ime faịlụ corpus 666 kwetara na igwe atọ, 0 dị iche

### v0.0.8 — Nhapụ Onwe, `std/term` na Ngwugwu _(Ọgọst 2026)_

- **Agbakwunyere** Mbibi akpaaka na ojiji ikpeazụ — a naghị ahụ ya; na-ebelata naanị oke ncheta
- **Agbakwunyere** `std/term` — ọnụọgụ ngosi n'ogidi terminal
- **Agbakwunyere** `##!` na `Akwụkwọ` — koodu ntụpọ Unicode ya
- **Agbakwunyere** Ụkpụrụ ma ọ bụ na nkwekọrịta: `'p' || 'P' => …`, nhọrọ ọ bụla ụdị n'ime otu ngalaba
- **Agbakwunyere** Ngwugwu Zymbol (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Agbakwunyere** `<~>` na ebe ọkpụkpọ bụ ihe a chọrọ ebe onye a kpọrọ na-ekwupụta paramita mmepụta
- **Edoziri** Nhata sistemụ modulu na VM ndekọ

### v0.0.7 — Ọba Akwụkwọ Ọkọlọtọ Ọdịnala _(Julaị 2026)_

- **Agbakwunyere** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — ha niile nwere uru njehie dị nro
- **Agbakwunyere** Ntinye nwere ụdị/e nyochara: `<< ##.(5,2) "ọnụahịa: " p`
- **Agbakwunyere** Ndị na-ahụ maka postfix kpọmkwem na `>>` — ọ dịghị ihe mgbochi dị mkpa
- **Gbanwere** Onye nhazi mechiri-ọdịda: ọ na-ajụ ide mmepụta ọ na-enweghị ike ịgụ ọzọ

### v0.0.6 — Nnụcha na Stdlib Sayensị _(Jun 2026)_

- **Mgbanwe** `=>` na-anọchi `:` na ngalaba nkwekọrịta na `<=` na utu aha mbubata/mbupụ
- **Agbakwunyere** `std/math` na `std/random`
- **Agbakwunyere** Mmelite akwụkwọ ọkọwa okwu site na igodo: `d["k"]$~ uru`

### v0.0.5 — Ihe Ndị Mbụ TUI na Nkọwa Ọkụ _(Mee 2026)_

- **Agbakwunyere** Ngọngọ TUI `>>| { }`, mmepụta ọnọdụ `>>~`, ntinye igodo `<<|` na `<<|?`
- **Agbakwunyere** `>>!` hichapụ ihe nkiri, `>>?` ogo terminal, `@~ N` hie ụra
- **Agbakwunyere** Nkọwa ọkụ `°x` / `x°`, na megharịa eriri `$*`

### v0.0.4 — Ndepụta Malite na 1 na Ọrụ Klas Mbụ _(Eprel 2026)_

- **Mgbanwe** Ndepụta niile **malite na 1** — `ndepụta[1]` bụ ihe mbụ
- **Agbakwunyere** Ọrụ akpọrọ aha dị ka uru klas mbụ; nrịbama ngọngọ modulu `# aha { }`
- **Agbakwunyere** Ndepụta ọtụtụ akụkụ `ndepụta[i>j>k]` na mwepụta dị larịị `ndepụta[p ; q]`

### v0.0.3 — Sistemụ Ọnụọgụ Unicode _(Eprel 2026)_

- **Agbakwunyere** Ngọngọ ọnụọgụ Unicode 69 na token mgbanwe ọnọdụ `#d0d9#`
- **Agbakwunyere** Ihe ederede boolean n'edemede ọ bụla — `#१` / `#०`

### v0.0.2 — Nhazi API Nchịkọta Ọzọ _(Machi 2026)_

- **Agbakwunyere** Ezinụlọ onye na-ahụ maka `$` maka ndepụta na eriri
- **Agbakwunyere** Ndoputa mbibi ụdị, na ndepụta ọjọọ

### v0.0.1 — Mwepụta Ọha Mbụ _(Machi 2026)_

- Onye ntụgharị na-eje ije osisi + VM ndekọ (`--vm`)
- Ihe niile e wuru n'isi: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Njirimara Unicode zuru ezu, sistemụ modulu, lambda, mmechi, njikwa njehie
- REPL, LSP, ndọtị VS Code, onye nhazi (`zymbol fmt`)

---

_Zymbol-Lang — Akara. Ụwa niile. Enweghị ike ịgbanwe._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Ikike:** Edemede a nwere ikike n'okpuru [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024-2026 Ndị otu Zymbol-Lang. Ederede zuru ezu: `LICENSE-CC-BY-SA-4.0` na <https://github.com/zymbol-lang/web>. Onye ntụgharị na igwe nchọgharị (`zymbol.js`) bụ ọrụ iche, nwere ikike n'okpuru AGPL-3.0-only.
