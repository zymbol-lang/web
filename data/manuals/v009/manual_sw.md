> **Kanusho:** Hati hii imeundwa na kutafsiriwa na akili bandia (AI).
>
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
>
> Marejeo ya kisheria ni **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** kwenye hazina ya mkalimani.

---

# Mwongozo wa Zymbol-Lang

> **Imehaririwa kwa v0.0.9 — 2026-09-07**

**Zymbol-Lang** ni lugha ya programu ya ishara. Hakuna maneno katika sarufi yake — kila muundo ni ishara. Inafanya kazi sawa katika lugha yoyote ya binadamu.

- Hakuna `if`, `while`, `return` — tu `?`, `@`, `<~`
- Unicode kamili — vitambulishi katika lugha yoyote au emoji
- Haina tegemezi kwa lugha ya binadamu — msimbo ni sawa kila mahali

**Toleo la mkalimani**: v0.0.9 | **Ufikiaji wa majaribio**: 660/666 (injini tatu zinakubaliana, 0 zinatofautiana)

---

## Vigezo na Viwianishi

```zymbol
x = 10              // kigezo kinachobadilika
PI := 3.14159       // kiwiashiria — kukipa tena thamani ni kosa la wakati wa utekelezaji
jina = "Aisha"
anafanya = #1       // mantiki kweli
👋 := "Habari"
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

`°` (ishara ya digrii, U+00B0) huanzisha kigezo kiotomatiki kwa thamani yake isiyo na upande wakati wa matumizi ya kwanza:

```zymbol
nambari = [3, 1, 4, 1, 5]
@ n:nambari {
    °jumla += n
}
>> jumla ¶              // → 14
```

> `°kigezo` (kiambishi awali) huegesha juu ya kitanzi — matokeo yanasomeka baada ya `@`.
> `kigezo°` (kiambishi tamati) huegesha ndani ya kitanzi — hufa kitanzi kinapoisha.

Taarifa ambayo ni jina tu inasoma kigezo na kutupa thamani, kwa hivyo inaonya:

```zymbol
hesabu = 5
hesabu
```

Mkusanyaji anaonya hivi (ujumbe wake daima ni kwa Kiingereza):

```text
warning: this statement does nothing: 'hesabu' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

Yaani: *«taarifa hii haifanyi chochote: 'hesabu' imesomwa na kutupwa»*.

---

## Aina za Data

| Aina | Herufi halisi | Lebo `#?` | Maelezo |
|------|---------------|-----------|---------|
| Nambari kamili | `42`, `-7` | `###` | Nambari salama: ±(2⁵³ − 1) |
| Nambari sehemu | `3.14`, `1.5e10` | `##.` | IEEE-754 maradufu |
| Mfuatano | `"maandishi"` | `##"` | Uingizaji: `"Habari {jina}"` |
| Herufi | `'A'` | `##'` | Graphemu moja ya Unicode |
| Mantiki | `#1`, `#0` | `##?` | SI nambari — `#1 ≠ 1` |
| Safu | `[1, 2, 3]` | `##]` | Aina moja, imechunguzwa |
| Mchanganyo uliotangazwa | `#[1, "mbili"]` | `##[` | Aina sawa na `[…]`, haichunguzwi |
| Tupeli | `(a, b)` | `##)` | Ya mahali, isiyobadilika |
| Kamusi | `#(x: 1, y: 2)` | `##(` | Ya ufunguo, inayobadilika |
| Kazi | rejeleo la kazi iliyopewa jina | `##()` | Daraja la kwanza; inaonyesha `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Daraja la kwanza; inaonyesha `<lambd/N>` |
| Kitengo | `##_` | `##_` | Kutokuwepo — hakuna null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(x: 1)#? ¶          // → (##(, 1, #(x: 1))
```

Nambari kamili inayotoka nje ya safu salama ni kosa linaloweza kukamatwa, kamwe sio kufunikwa kimya:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "nje ya safu" ¶ // → nje ya safu
}
```

`##_` ni jinsi programu inavyouliza ikiwa kitu hakipo:

```zymbol
hachocho() { }
thamani = hachocho()
>> (thamani == ##_) ¶     // → #1
```

---

## Pato na Ingizo

```zymbol
jina = "Aisha"
jumla = 3
>> "Habari" ¶             // → Habari
>> "a=" jina " b=" jumla ¶ // → a=Aisha b=3
>> jumla#? ¶            // → (###, 1, 3)
```

```zymbol
<< jina
<< "Ingiza jina lako: " jina
<< ###(4) "Umri: " umri
```

**Angalia umbo la ishara mbili.** `>>` inaelekeza nje: inatoa data kutoka kwenye programu. `<<` inaelekeza ndani: inaleta data ndani ya programu. Hakuna cha kukariri hapo — mshale unaonyesha mwelekeo ambao habari inasafiri, na wazo lile lile linarejea katika kila ishara inayosonga kitu.

> `¶` na `\\` ni mistari mipya sawa. `>>` haiongezi kamwe.
> Kibainishi cha aina kabla ya kichocheo kinathibitisha wakati wa kusoma na kuomba tena hadi thamani iwe halali:
> `##.` Nambari sehemu · `##.(T,D)` desimali · `###(N)` Nambari kamili · `##"(N)` maandishi · `##'` Herufi moja.

Katika kiwango cha juu cha faili, `<~` ni hali ya kutoka kwa programu:

```zymbol
>> "inaangalia" ¶      // → inaangalia
<~ 0
```

---

## Primitive za TUI

Viendeshaji vya kiolesura cha terminal kwa programu shirikishi. Nyingi zinahitaji kizuizi `>>| { }` (skrini mbadala + hali ghafi).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Inaendesha"
    @~ 1000
    >>~ (2, 1) > "Imekamilika."
}
```

```zymbol
>>| {
    [safu, nguzo] = >>?
    >>~ (1, 1) > "Terminal: " safu " x " nguzo
    <<| kitufe
    >>~ (2, 1) > "Umebonyeza: " kitufe
}
```

Hapa unaweza kuona kwa nini ishara zinajumuishwa badala ya kuzidishwa. Tayari unajua kwamba `<<` ni ingizo na `?` inauliza bila kujitolea. Ishara moja tu ni mpya:

- `|` ni **kitengo kimoja**, si mkondo mzima.

Kwa hiyo, viendeshaji vyote viwili vya kibodi vinajisoma vyenyewe:

```text
<<        |             ?
ingizo    kitengo kimoja  bila kujitolea

<<|   chukua kitufe KIMOJA, na subiri hadi kiwe kipo
<<|?  angalia ikiwa kuna kitufe, na endelea ikiwa hakuna
```

Vivyo hivyo upande mwingine: `>>` inatuma, `>>!` inatuma **kwa nguvu** (inafuta skrini nzima), wakati `>>?` **inauliza** badala ya kuandika (terminal ni kubwa kiasi gani). Ishara iliyo upande wa kulia ndiyo inayobadilisha hali, na daima inakuja mwisho.

> `>>!` inafuta skrini. `>>?` inarudisha `(safu, nguzo)`. `@~ N` inalala kwa N millisecondi.
> `<<|` inasoma mbondezo mmoja (inazuia); `<<|?` inachunguza bila kuzuia (`'\0'` ikiwa hakuna).
> Vitufe vya mishale huja vimebainishwa kama `'↑' '↓' '←' '→'`; ESC ni nukta ya msimbo 27.
> Tupeli ya pato lililowekwa mahali: `(safu, nguzo, BKS, mbele, nyuma)` — sehemu yoyote inaweza kuachwa kwa koma (`>>~ (,,, 196) > "nyekundu"`).
> Mask ya BKS: `1`=Nzito, `2`=Mlazo, `4`=Mstari chini. Paleti ya rangi 256 ya ANSI (`0`=chaguo-msingi la terminal).

---

## Viendeshaji

```zymbol
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (mgawanyiko kamili)
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

> `==` haibadilishi kamwe: `"5" == 5` ni `#0`. Upangaji unabadilisha: `"5" > 4` ni `#1`, na `"४२" > 5` pia — maandishi ya nambari katika mwandiko wowote kati ya 69 yanalinganishwa kama nambari.
> Kazi ni sawa na yenyewe tu, kamwe si sawa na kazi nyingine yenye mwili sawa.

---

## Mifuatano

```zymbol
jina = "Aisha"
n = 42
>> "Habari " jina " una " n ¶ // → Habari Aisha una 42
maelezo = "Habari {jina}, una {n}"
>> maelezo ¶              // → Habari Aisha, una 42
```

```zymbol
s = "Habari dunia"
urefu = s$#                  // 12
kitabu = s$[1..6]             // "Habari"
ina = s$? "dunia"          // #1
sehemu = "a,b,c,d"$/ ','    // [a, b, c, d]
badilisha = s$~~["a":"o"]     // "Hobori dunia"
mstari = "─" $* 20
```

> `+` ni kwa nambari tu. Kwa mifuatano tumia ukaribu au uingizaji.
> `\{` na `\}` ni mabano halisi — kutoroka ni linganifu.

---

## Mtiririko wa Udhibiti

```zymbol
x = 7
? x > 100 {
    >> "kubwa" ¶
} _? x > 0 {
    >> "chanya" ¶     // → chanya
} _ {
    >> "hasi" ¶
}
```

Hapa kuna ishara mbili mpya, na ya tatu inayotokana na kuziweka pamoja:

- `?` ni **kuuliza**: inafungua sharti.
- `_` ni **kile ambacho hakijabainishwa**: tawi lililoachwa wakati hakuna swali lililolingana.
- `_?` ni zote mbili mfululizo: *ikiwa hakuna kilicholingana, uliza tena*.

Ndiyo sababu `_?` imeandikwa vile. Si ishara mpya ya kujifunza — ni `_` ikifuatiwa na `?`, na inamaanisha hasa kile ambavyo sehemu zake mbili zinamaanisha, zikisomwa kwa mpangilio.

> Mabano `{ }` ni **lazima** hata kwa taarifa moja.

---

## Kulinganisha

```zymbol
alama = 85
daraja = ?? alama {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> daraja ¶              // → B
```

```zymbol
joto = -5
hali = ?? joto {
    < 0  => "barafu"
    < 20 => "baridi"
    _    => "moto"
}
>> hali ¶              // → barafu
```

Tayari unajua kwamba `?` ni "kuuliza". **`??` ni kuuliza mara nyingi**: kurudisha ishara, mahali popote katika lugha, ni kufanya mara nyingi kile ishara inafanya mara moja. `?` moja inajaribu sharti; `??` inajaribu dhidi ya orodha ya kesi.

Vibadala vinaunganishwa na `||`, na vinaweza kuchanganya aina za muundo:

```zymbol
kitufe = 'P'
kitendo = ?? kitufe {
    'p' || 'P' => "simamisha"
    < 0 || > 100 => "nje ya safu"
    _ => "imepuuzwa"
}
>> kitendo ¶             // → simamisha
```

---

## Vitanzi

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
matunda = ["tufaha", "pea", "zabibu"]
@ t:matunda { >> t " " }
>> ¶                    // → tufaha pea zabibu
@ c:"Habari" { >> c "-" }
>> ¶                    // → H-a-b-a-r-i-
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
hesabu = 0
@:nje {
    hesabu++
    ? hesabu >= 3 { @:nje! }
}
>> hesabu ¶             // → 3
```

`@` ni ishara ya **wakati**: kila kitu kinachojirudia kinaishi ndani yake. Ili kukata wakati huo unaongeza ishara karibu nayo:

- `@!` — `!` ni **nguvu**: ondoka kwenye kitanzi sasa.
- `@>` — `>` inasukuma mbele: nenda kwenye zamu inayofuata.
- `@:nje!` — `:` **inafunga jina**, kwa hivyo hii inakata kitanzi *kinachoitwa* nje, si cha karibu zaidi.

Viendeshaji vitatu, na hakuna kilihitaji kukaririwa tofauti: ni `@` pamoja na ishara ambayo tayari inasema inachofanya.

> **Kibainishi ni hesabu au sharti.** `Nambari kamili` ni hesabu, inatathminiwa mara moja — `@ 0` inaendesha mwili mara sifuri. Kitu kingine chochote ni sharti. Hakuna ukweli: `@ []` na `@ 3.5` zinakataliwa. Ili kupitia mkusanyiko tumia `@ x:vitu`; kuhesabu, `@ vitu$#`.

---

## Kazi

```zymbol
ongeza(a, b) { <~ a + b }
>> ongeza(3, 4) ¶        // → 7
```

```zymbol
kipaguzi(n) {
    ? n <= 1 { <~ 1 }
    <~ n * kipaguzi(n - 1)
}
>> kipaguzi(5) ¶       // → 120
```

Kazi inasoma vigezo vya faili kwa thamani, na uandishi ndani unabaki ndani:

```zymbol
kikomo = 100
ndani(n) { <~ n < kikomo }
>> ndani(42) ¶         // → #1
```

Ishara mbili zinabadilisha hilo, na zote mbili zimeandikwa **katika sahihi na mahali pa kuuita**:

```zymbol
ongeza_hesabu(hesabu<~) { hesabu = hesabu + 1 }
jumla = 0
ongeza_hesabu(jumla<~)
>> jumla ¶              // → 1
```

> `p~` ni nakala ya kazi — mwili unaweza kuipa tena thamani na mwita anaendelea kuwa sawa.
> `p<~` ni kigezo cha pato — mabadiliko yanarudi. `ongeza_hesabu(jumla)` bila ishara ni kosa la maana: ufafanuzi na sahihi haziwezi kutengana.

---

## Lambda na Vifungo

```zymbol
mara_mbili = x -> x * 2
jumlisha = (a, b) -> a + b
>> mara_mbili(5) ¶          // → 10
>> jumlisha(3, 7) ¶          // → 10
```

```zymbol
ainisha = x -> {
    ? x > 0 { <~ "chanya" }
    _? x < 0 { <~ "hasi" }
    <~ "sifuri"
}
>> ainisha(-4) ¶         // → hasi
```

```zymbol
kipengele = 3
mara_tatu = x -> x * kipengele
>> mara_tatu(7) ¶          // → 21
```

```zymbol
unda_kiongeza(n) { <~ x -> x + n }
ongeza10 = unda_kiongeza(10)
>> ongeza10(5) ¶           // → 15
```

Lambda inaweza kuchukua hakuna vigezo kabisa:

```zymbol
jibu = () -> 42
>> jibu() ¶           // → 42
```

> Lambda inakamata vigezo vya faili **wakati inaundwa**; kazi iliyopewa jina inavisoma **wakati inaitwa**.

---

## Safu

```zymbol
safu = [1, 2, 3, 4, 5]
>> safu[1] ¶       // → 1   kuorodhesha ni kwa msingi wa 1
>> safu[-1] ¶      // → 5   hasi inahesabu kutoka mwisho
>> safu$# ¶        // → 5   urefu
```

```zymbol
safu = [1, 2, 3]
>> (safu$+ 6) ¶          // → [1, 2, 3, 6]   ongeza
>> (safu$+[2] 99) ¶      // → [1, 99, 2, 3]  ingiza kwenye nafasi ya 2
>> (safu$- 3) ¶          // → [1, 2]         ondoa tukio la kwanza
>> (safu$-[1]) ¶         // → [2, 3]         ondoa kwenye faharasa 1
>> (safu$[1..2]) ¶       // → [1, 2]         kipande, ncha zote mbili zimeshirikishwa
>> (safu$? 3) ¶          // → #1             ina
```

Zote zinaanza na `$`, ishara ya **mkusanyiko**, na kuendelea na ishara inayosema kinachofanywa ndani yake: `#` ngapi, `+` ongeza, `-` ondoa, `?` uliza kama ipo. Na kama ilivyo kwa `??`, kurudisha ishara inamaanisha kuifanya kikamilifu: `$?` inauliza *kama* thamani ipo, `$??` inauliza *katika sehemu ngapi* na kuzirudisha zote.

```zymbol
safu = [3, 1, 2]
>> (safu$^+) ¶     // → [1, 2, 3]   kupanda
>> (safu$^-) ¶     // → [3, 2, 1]   kushuka
```

**Kanuni ya matokeo.** Kiendeshaji kimoja, na kile msimbo unaozunguka unachofanya nacho kinaamua: kikitumiwa, **kinajenga** na kuacha asili sawa; kikitupwa, **kinabadilisha**.

```zymbol
safu = [1, 2, 3]
nakala = safu[2]$~ 99
>> safu ¶                // → [1, 2, 3]
>> nakala ¶              // → [1, 99, 3]
safu[2]$~ 99
>> safu ¶                // → [1, 99, 3]
```

> **`=` kamwe haiandiki ndani ya mkusanyiko.** `safu[2] = 99` si umbo la Zymbol — `=` inatoa thamani kwa **JINA**. Kubadilisha sehemu ya mkusanyiko ni `$~`, katika kila mkusanyiko.

`[…]` ina aina moja na inachunguzwa; mchanganyo wa makusudi **unatangazwa** kwa `#[…]`:

```zymbol
mchanganyo = #[1, "mbili", #1]
>> mchanganyo ¶             // → [1, mbili, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Uorodheshaji wa Vipimo Vingi

`>` inashuka kwenye muundo uliowekwa ndani. Kikundi kimoja cha mabano kinashughulikia kipengele kimoja, iwe kirefu kiasi gani.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   safu 2, nguzo 3
>> m[-1>-1] ¶      // → 9   safu ya mwisho, nguzo ya mwisho
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          bapa: mlalo
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   muundo: pembe
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` **si** umbo la Zymbol. Faharasa iliyounganishwa inakataliwa kwa kusoma na kuandika — kikundi kimoja cha mabano kwa kila ufikiaji, na `>` ndio kinachoenda kati ya hatua.

---

## Kamusi

Tupeli yenye sehemu zilizopewa majina ni kamusi, na tangu v0.0.9 imeandikwa `#(…)`.

```zymbol
mtu = #(jina: "Aisha", umri: 25)
>> mtu.jina ¶        // → Aisha
>> mtu["umri"] ¶    // → 25
```

```zymbol
mtu = #(jina: "Aisha", umri: 25)
sehemu = "jina"
>> mtu[sehemu] ¶     // → Aisha
```

Inabadilika, vifunguo vinaweza kuongezwa, na inaweza kupitiwa:

```zymbol
hisani = #(pea: 4)
hisani["tufaha"]$~ 10
@ k:hisani { >> k "=" hisani[k] " " }
>> ¶                    // → pea=4 tufaha=10
```

```zymbol
hisani = #(pea: 4, tufaha: 10)
@ (k, v):hisani { >> k ":" v " " }
>> ¶                    // → pea:4 tufaha:10
```

> `#()` ni kamusi tupu, ambayo `()` haikuweza kuwa — ingelazimika kuwa tupeli tupu pia. `(x: 1)` tupu inakataliwa kwa ujumbe huu: *a dictionary is written `#(…)`* — «kamusi imeandikwa `#(…)`».
> Kamusi inashughulikiwa kwa ufunguo, kamwe kwa nafasi, kwa hivyo `mtu[1]` ni kosa.

---

## Tupeli

Tupeli ni vyombo vilivyopangwa **visivyobadilika** vinavyoshikilia thamani za aina tofauti.

```zymbol
nukta = (10, 20)
>> nukta[1] ¶           // → 10
data = (42, "Habari", #1, 3.14)
>> data[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Jaribio lolote la kubadilisha tupeli mahali pake ni kosa, iwe kiendeshaji ni kipi — kutobadilika ni sifa ya thamani, si ubaguzi ndani ya kila `$`.

---

## Utenganishaji

```zymbol
safu = [10, 20, 30, 40, 50]
[a, b, c] = safu
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
safu = [10, 20, 30, 40, 50]
[kwanza, *baki] = safu
>> kwanza ¶            // → 10
>> baki ¶              // → [20, 30, 40, 50]
```

```zymbol
nukta = (100, 200)
(px, py) = nukta
>> px " " py ¶          // → 100 200
```

```zymbol
mtu = #(jina: "Ana", umri: 25)
#(jina: j, umri: u) = mtu
>> j " " u ¶            // → Ana 25
```

> Umbo la mabano limepigwa chapa: `[…]` inachukua safu, `(…)` tupeli, `#(…)` kamusi. Jina la mwisho **linachukua salio**, kwa hivyo utenganishaji haushindwi kamwe kwa urefu — `(a, b, c) = (1,2,3,4,5)` inatoa `c = (3,4,5)`, na `##_` wakati hakuna kilichobaki.

---

## Kazi za Daraja la Juu

```zymbol
nambari = [1, 2, 3, 4, 5]
>> (nambari$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (nambari$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (nambari$< (0, (jumlisha, x) -> jumlisha + x)) ¶ // → 15
```

```zymbol
nambari = [1, 2, 3, 4, 5, 6]
mara_mbili(x) { <~ x * 2 }
kubwa(x) { <~ x > 3 }
>> (nambari$> mara_mbili) ¶    // → [2, 4, 6, 8, 10, 12]
>> (nambari$| kubwa) ¶    // → [4, 5, 6]
```

```zymbol
msingi = [#(jina: "Carla", umri: 28), #(jina: "Ana", umri: 25)]
kwa_umri = msingi$^ (a, b -> a.umri < b.umri)
>> kwa_umri[1].jina ¶     // → Ana
```

> Kazi iliyopewa jina inakwenda kwa HOF **bila mabano**: `nambari$> mara_mbili`. Kuandika `nambari$> (mara_mbili)` ni kosa la kuchanganua, kwa sababu `(` inafungua lambda.

---

## Kiendeshaji cha Bomba

```zymbol
mara_mbili = x -> x * 2
ongeza = (a, b) -> a + b
ongeza_moja = x -> x + 1
>> (5 |> mara_mbili(_)) ¶    // → 10
>> (10 |> ongeza(_, 5)) ¶  // → 15
>> (5 |> mara_mbili(_) |> ongeza_moja(_)) ¶ // → 11
```

---

## Kushughulikia Makosa

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "kugawanya kwa sifuri" ¶  // → kugawanya kwa sifuri
} :! {
    >> "nyingine: " _err ¶
} :> {
    >> "inakimbia kila wakati" ¶        // → inakimbia kila wakati
}
```

| Aina | Wakati |
|------|--------|
| `##Div` | Kugawanya kwa sifuri |
| `##Index` | Faharasa nje ya mipaka |
| `##Key` | Ufunguo haupo kwenye kamusi |
| `##Range` | Nje ya safu salama ya nambari kamili |
| `##Type` | Kutolingana kwa aina |
| `##Parse` | Kuchanganua data |
| `##IO` | Faili / mfumo |
| `##Network` | Makosa ya mtandao |
| `##DB` | Hifadhidata |
| `##Time` | Tarehe ambayo haipo |
| `##_` | Kosa lolote (linakamata yote) |

`!` ni ishara ya **kosa na nguvu**, na inasomwa sawa katika familia zote mbili: `$!` inauliza thamani ikiwa ni kosa; `$!!`, ikiwa ishara imerudishwa, inaeneza juu bila kuuliza.

> Kushindwa kwa maktaba ya kawaida kunarudi kama **thamani za makosa laini** ambazo unajaribu kwa `$!` au unakamata kwa `!?`, badala ya kukatisha. `$!!` inaeneza moja kwa mwita.

---

## Moduli

```zymbol
# hesabu {
    #> { ongeza, PI }

    PI := 3.14159
    ongeza(a, b) { <~ a + b }
}
```

```zymbol
<# ./hesabu => h

>> h::ongeza(5, 3) ¶
>> h.PI ¶
```

```zymbol
# maktaba_yangu {
    #> { ongeza_ndani => jumlisha }

    ongeza_ndani(a, b) { <~ a + b }
}
```

Ishara mbili za moduli ni wazo lile lile, sasa likitumika kwa faili: `#` ni kiwango cha **tamko** — kitu *ni nini*, si thamani yake — na mshale unasema mwelekeo ambao msimbo unasafiri:

```text
<#   mshale unaingia: ingiza, leta kutoka faili nyingine
#>   mshale unatoka: toa, toa kwa faili nyingine
```

Ishara ya mwelekeo daima inakaa kwenye ukingo unaoelekea mwelekeo inaonyesha. Ni sababu ile ile kwa nini `<~` inarudi kushoto (kutoka kwenye kazi) na `->` inaingia kulia (ndani ya mwili wa lambda).

> **Moduli inatangaza kile inachotoa.** Kizuizi `#>` ni lazima — kuiacha ni **E014**, na `#> { }` ni jinsi moduli inavyosema kwamba uso wake ni tupu. `::` inaita kazi, `.` inasoma kiwiashiria. Tu uingizaji, kizuizi cha kutoa, vianzilishi halisi na ufafanuzi wa kazi vinaweza kuonekana kwenye mwili wa moduli; kitu chochote kinachotekelezeka ni **E013**.

---

## Maktaba ya Kawaida

Moduli asili, zinazoingizwa kama nyingine yoyote:

| Moduli | Kazi |
|--------|------|
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

>> t::width("手番") ¶            // → 4   herufi mbili, nguzo nne
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

siku = T::of(2026, 1, 31)
>> T::format(siku, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(siku, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` inapima **nguzo za onyesho**, si herufi: CJK na emoji nyingi ni nguzo 2, kwa hivyo weka jedwali kwa `t::upana`, kamwe `$#`.
> Katika `std/time` wakati ni millisecondi tangu enzi. Chini ya siku ni muda, kutoka siku na juu ni kalenda — kwa hivyo mwezi unaangukia siku ile ile ya mwezi, iliyobanwa. `tofauti(a, b)` ni `a - b`, kwa hivyo wakati wa mapema kwanza unatoa jibu hasi.

---

## Vifurushi

`.zyp` inaweka programu ya faili nyingi kwenye faili moja inayobebeka. Ni kumbukumbu ya **chanzo**, si binary, kwa hivyo inaendesha popote binary ya `zymbol` inapoendesha.

```bash
zymbol package mradi_wangu/ --script main.zy -o mradi_wangu.zyp
zymbol run mradi_wangu.zyp
```

> Kumbukumbu ina manifesto (`zyp.toml`) inayotangaza script zake za kuingia na toleo la injini inayohitaji. `zymbol run` inaiondoa kwenye saraka ya muda na kuiendesha kutoka hapo, kwa hivyo msimbo ni wa kutupwa wakati kile script inachoandika kinaanguka kwenye saraka yako halisi ya kazi. Sehemu ya kuchezea pia inapakia faili za `.zyp`.

---

## Aina za Nambari

Zymbol inaweza kuandika nambari katika **mwandiko 69 wa nambari za Unicode** — Devanagari, Kiarabu-Kihindi, Kithai, Kiklingoni pIqaD, nzito za hisabati, sehemu za LCD, na zaidi. Hali ni ya kimataifa kwa mchakato na inaathiri pato; hesabu haibadiliki.

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Kiarabu-Kihindi (U+0660–U+0669)
#๐๙#    // Kithai         (U+0E50–U+0E59)
#09#    // weka upya kwa ASCII
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

Nambari kutoka mwandiko wowote unaoungwa mkono ni halali katika chanzo:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Usomaji ni linganifu — nambari inaeleweka katika mwandiko wowote:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` daima ni ASCII, kwa hivyo `#0` inabaki tofauti kwa kuonekana kutoka kwa nambari sifuri katika kila mwandiko.
> `#,` na `#^` pia zinaandika nambari zao katika mwandiko amilifu, na vitenganishi vinafuata — lakini jozi haibadiliki kamwe: `,` inakusanya na `.` inagawanya, katika kila mwandiko.

---

## Viendeshaji vya Data

```zymbol
f = ##.42         // kwa Nambari sehemu
i = ###3.7        // kwa Nambari kamili, imezungushwa  → 4
t = ##!3.7        // kwa Nambari kamili, imekatwa  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Nambari sehemu inachapishwa kama nambari, kamwe kama kipeo, na inatupa `.0` ya mwisho — `##.42` inaandika `42` na bado ni Nambari sehemu, kama `f#?` inavyoonyesha.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   salama: inarudisha ingizo bila kubadilika
>> ##!'A' ¶        // → 65    nukta ya msimbo ya Herufi
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          zungusha hadi sehemu 2 za desimali
>> #!2|pi| ¶       // → 3.14          kata hadi sehemu 2 za desimali
>> #,|1234567| ¶   // → 1,234,567     vitenganishi vya maelfu
>> #^|12345.678| ¶ // → 1.2345678e4   nukuu ya kisayansi
```

```zymbol
>> 0x41 ¶        // → A   heksadesimali
>> 0b01000001 ¶  // → A   binary
>> 0o101 ¶       // → A   oktali
>> 0d65 ¶        // → A   desimali
```

> Herufi halisi ya msingi katika safu ya ASCII ni **herufi**: `0d65 == 'A'` ni `#1`, na `0d65 == 65` ni `#0`. Misingi yote minne inaandika herufi moja.

---

## Ujumuishaji wa Shell

```zymbol
leo = <\ date +%Y-%m-%d \>
>> "Leo: " leo
```

```zymbol
pato = </"./kifaili_ndogo.zy"/>
>> pato
```

> `<\ … \>` inakamata stdout na stderr, ikiondoa mstari mpya wa mwisho.
> `>< args` inakamata hoja za mstari wa amri kama safu ya mifuatano.

---

## Mfano Kamili: FizzBuzz

```zymbol
ainisha(nambari) {
    ? nambari % 15 == 0 { <~ "FizzBuzz" }
    _? nambari % 3  == 0 { <~ "Fizz" }
    _? nambari % 5  == 0 { <~ "Buzz" }
    <~ nambari
}

@ i:1..20 { >> ainisha(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (moja kwa kila mstari)
```

---

## Jinsi Ishara Zinavyojumuishwa

Umekuwa ukiona kitu kile kile katika mwongozo huu wote: **kiendeshaji si mchoro wa kukariri, ni ishara kadhaa mfululizo, na kila moja inachangia maana yake.** Sasa kwa kuwa unazijua zote, hapa ni muundo kamili.

Kwanza inakuja **tuko katika ulimwengu upi**:

| Ishara | Ulimwengu | Umeiona wapi |
|--------|-----------|--------------|
| `$` | mkusanyiko | `$#` `$+` `$?` `$^-` |
| `@` | wakati, kitu chochote kinachojirudia | `@!` `@>` `@~` |
| `#` | kitu *ni nini*, si thamani yake | `#?` `#(…)` `<#` `#>` |
| `>>` | nje ya programu | `>>` `>>!` `>>?` |
| `<<` | ndani ya programu | `<<` `<<\|` `<<\|?` |
| `?` | kuuliza, bila kujitolea | `?` `_?` `??` `$?` |
| `!` | nguvu, au kosa | `@!` `$!` `!?` |

Kisha inakuja **kinachofanywa hapo**: `+` ongeza, `-` ondoa, `^` panga, `~` badilisha, `#` hesabu, `|` kitengo kimoja, `:` funga jina.

Na kanuni mbili ambazo hazishindwi kamwe:

**Kurudisha ishara kunafanya iwe kamili.** `?` inauliza mara moja, `??` inajaribu kesi nyingi. `$?` inauliza ikiwa thamani ipo, `$??` inarudisha kila mahali ilipo. `!` inaashiria kosa, `!!` inaeneza bila kuuliza.

**Ishara ya hali daima inakuja mwisho.** Wakati `?` au `!` inaonekana kusema *jinsi* kitu kinavyofanywa — kwa kusita au kwa nguvu — ni ishara ya mwisho ya kiendeshaji: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:nje!`. Hakuna kamwe operesheni baada yao.

Kitu cha vitendo kinatoka katika hilo: **mchanganyo ambao hujawahi kuona tayari una maana kabla ya kuiangalia.** Ikiwa `$` ni mkusanyiko na `^` ni mpangilio na `-` ni kinyume, basi `$^-` inapanga kushuka, na hakuna mtu aliyelazimika kukuambia.

Orodha nzima haifanyi kazi hivyo, na kusema hivyo ni bora kuliko kujifanya. Viendeshaji vingi vinajitenga vizuri. Sita vinajitenga lakini vinamaanisha zaidi ya sehemu zake: `!?` `:!` `:>` `|>` `::` `$++`. Na kumi lazima vikaririwe kwa kuwa havitengani kabisa: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Kuhesabu zisizo wazi badala ya kudhani ni chache ni kwa makusudi: ndizo gharama halisi ya kukariri kwa lugha. Marejeo kamili — orodha, homografu zilizotangazwa, na kanuni ambazo kiendeshaji kipya lazima kitimize ili kuwepo — ni `SYMBOLS.md`, kwenye hazina ya mkalimani.

---

## Marejeo ya Ishara

| Ishara | Operesheni | Ishara | Operesheni |
|--------|------------|--------|------------|
| `=` | kigezo | `$#` | urefu |
| `:=` | kiwiashiria | `$+` | ongeza |
| `>>` | pato | `$+[i]` | ingiza kwenye faharasa (msingi 1) |
| `<<` | ingizo | `$-` | ondoa la kwanza kwa thamani |
| `¶` / `\\` | mstari mpya | `$--` | ondoa zote kwa thamani |
| `?` | ikiwa | `$-[i]` | ondoa kwenye faharasa (msingi 1) |
| `_?` | vinginevyo-ikiwa | `$-[i..j]` | ondoa masafa (msingi 1) |
| `_` | vinginevyo / mbadala | `$?` | ina |
| `??` | kulinganisha | `$??` | pata faharasa zote (msingi 1) |
| `\|\|` | muundo-au kwenye tawi la match | `$[s..e]` | kipande (msingi 1) |
| `@` | kitanzi | `$>` | ramani |
| `@ N { }` | kitanzi N mara | `$\|` | chuja |
| `@!` | vunja | `$<` | punguza |
| `@>` | endelea | `$/ kitenganishi` | gawanya mfuatano |
| `@:jina { }` | kitanzi chenye lebo | `$++ a b c` | jenga kwa kuunganisha |
| `@:jina!` | vunja lebo | `$~~[p:r]` | badilisha mfuatano |
| `@:jina>` | endelea lebo | `$*` | rudia mfuatano |
| `->` | lambda | `safu[i]$~ v` | UMBO PEKEE la kusasisha |
| `<~` | rudisha / kigezo cha pato | `~` | kigezo cha nakala ya kazi |
| `safu[i>j]` | faharasa ya urambazaji | `safu[p ; q]` | uchimbaji bapa |
| `$^+` | panga kupanda | `$^-` | panga kushuka |
| `$^` | panga kwa kilinganishi | `\|>` | bomba |
| `!?` | jaribu | `:!` | kamata |
| `:>` | hatimaye | `$!` | ni kosa |
| `$!!` | eneza kosa | `#1` / `#0` | kweli / si kweli |
| `##_` | Kitengo — kutokuwepo | `[…]` | safu, aina moja |
| `#[…]` | safu, mchanganyo uliotangazwa | `#(…)` | kamusi |
| `(…)` | tupeli ya mahali | `#()` | kamusi tupu |
| `<#` | ingiza | `#>` | toa |
| `#` | tangaza moduli | `::` | ita moduli |
| `.` | ufikiaji wa sehemu / kiwiashiria | `#?` | metadata ya aina |
| `#\|..\|` | changanua nambari | `##.` | badilisha kuwa Nambari sehemu |
| `###` | badilisha kuwa Nambari kamili (zungusha) | `##!` | badilisha kuwa Nambari kamili (kata) |
| `#.N\|..\|` | zungusha | `#!N\|..\|` | kata |
| `#,\|..\|` | vitenganishi vya maelfu | `#^\|..\|` | kisayansi |
| `#d0d9#` | badilisha hali ya nambari | `#09#` | weka upya kwa ASCII |
| `<\ ..\>` | tekeleza shell | `><` | hoja za CLI |
| `\ var` | haribu kigezo | `°x` / `x°` | ufafanuzi moto |
| `>>\|` | kizuizi cha TUI (skrini mbadala) | `>>~` | pato lililowekwa mahali |
| `>>!` | futa skrini | `>>?` | uliza ukubwa wa terminal |
| `<<\|` | mbondezo inayozuia | `<<\|?` | mbondezo isiyozuia |
| `@~ N` | lala N millisecondi | `0d` `0x` `0o` `0b` | herufi halisi za msingi |

---

## Historia ya Mabadiliko

### v0.0.9 — Mikusanyiko Imeamua _(Septemba 2026)_

- **Uvunjaji** Kamusi ina nukuu yake mwenyewe: `#(ufunguo: thamani)`. `(x: 1)` tupu inakataliwa, na `#()` ni kamusi tupu — ambayo `()` haikuweza kamwe kuwa
- **Uvunjaji** Ugawaji wa faharasa umeondolewa: `safu[i] = v` na aina zote za mchanganyiko. `=` inatoa thamani kwa **JINA**; kubadilisha sehemu ya mkusanyiko ni `$~`
- **Uvunjaji** Faharasa iliyounganishwa `m[i][j]` inakataliwa kwa kusoma na kuandika — `>` ndio kinachoenda kati ya hatua
- **Uvunjaji** Moduli lazima itangaze kile inachotoa (**E014**); `#> { }` ni jinsi moduli inavyosema uso wake ni tupu
- **Uvunjaji** Kibainishi cha kitanzi ni hesabu au sharti — hakuna ukweli. `@ []` na `@ 3.5` zinakataliwa
- **Imeongezwa** `##_` — herufi halisi ya Kitengo, na jinsi programu inavyouliza ikiwa kitu hakipo
- **Imeongezwa** `#[…]` — safu ambayo mchanganyiko wa aina za vipengele umetangazwa
- **Imeongezwa** `#?` inatofautisha mikusanyiko minne: `##]` `##[` `##)` `##(`
- **Imeongezwa** `std/time` — saa na kalenda ya kiraia, na maeneo ya saa na hesabu ya kalenda
- **Imeongezwa** `<~>` katika kiwango cha juu ni hali ya kutoka kwa programu
- **Imeongezwa** `@ (k, v):jozi` — muundo katika kichwa cha kitanzi
- **Imeongezwa** `#|c|` inasoma nambari katika mwandiko wowote kati ya 69; `#,` na `#^` zinaandika katika amilifu
- **Ilibadilishwa** `Nambari kamili` ni nambari kamili salama, ±(2⁵³ − 1), inafungwa wakati wa kushindwa katika kila injini
- **Ilibadilishwa** Kazi iliyopewa jina inasoma vigezo vya faili wakati wa kuitwa, kwa thamani
- **Ilibadilishwa** Taarifa inayosoma jina tu inaonya badala ya kupita kimya
- **Injini** 660 kati ya faili 666 za mkusanyiko zinakubaliana kwenye injini zote tatu, 0 zinatofautiana

### v0.0.8 — Kujiachilia, `std/term` na Vifurushi _(Agosti 2026)_

- **Imeongezwa** Uharibifu wa kiotomatiki wakati wa matumizi ya mwisho — usioonekana; unapunguza tu kumbukumbu ya kilele
- **Imeongezwa** `std/term` — vipimo vya onyesho katika nguzo za terminal
- **Imeongezwa** `##!` kwenye `Herufi` — nukta yake ya msimbo ya Unicode
- **Imeongezwa** Muundo-au katika match: `'p' || 'P' => …`, vibadala vya aina yoyote katika tawi moja
- **Imeongezwa** Vifurushi vya Zymbol (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Imeongezwa** `<~>` kwenye mahali pa kuuita ni lazima pale mwita anapotangaza kigezo cha pato
- **Imerekebishwa** Usawa wa mfumo wa moduli kwenye VM ya rejista

### v0.0.7 — Maktaba ya Kawaida Asili _(Julai 2026)_

- **Imeongezwa** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — zote zikiwa na thamani za makosa laini
- **Imeongezwa** Ingizo lililopigwa chapa/kuthibitishwa: `<< ##.(5,2) "bei: " b`
- **Imeongezwa** Viendeshaji vya kiambishi tamati moja kwa moja kwenye `>>` — hakuna mabano yanayohitajika
- **Ilibadilishwa** Kiumbizi kinachofunga wakati wa kushindwa: kinakataa kuandika pato ambalo haliwezi kusoma tena

### v0.0.6 — Uboreshaji na Maktaba ya Kisayansi _(Juni 2026)_

- **Uvunjaji** `=>` inachukua nafasi ya `:` kwenye matawi ya match na `<=` kwenye majina mbadala ya uingizaji/utoaji
- **Imeongezwa** `std/math` na `std/random`
- **Imeongezwa** Kusasisha kamusi kwa ufunguo: `d["k"]$~ thamani`

### v0.0.5 — Primitive za TUI na Ufafanuzi Moto _(Mei 2026)_

- **Imeongezwa** Kizuizi cha TUI `>>| { }`, pato lililowekwa mahali `>>~`, ingizo la kitufe `<<|` na `<<|?`
- **Imeongezwa** `>>!` futa skrini, `>>?` ukubwa wa terminal, `@~ N` lala
- **Imeongezwa** Ufafanuzi moto `°x` / `x°`, na kurudia mfuatano `$*`

### v0.0.4 — Uorodheshaji wa Msingi 1 na Kazi za Daraja la Kwanza _(Aprili 2026)_

- **Uvunjaji** Uorodheshaji wote ni **wa msingi 1** — `safu[1]` ni kipengele cha kwanza
- **Imeongezwa** Kazi zilizopewa jina kama thamani za daraja la kwanza; sintaksia ya kizuizi cha moduli `# jina { }`
- **Imeongezwa** Uorodheshaji wa vipimo vingi `safu[i>j>k]` na uchimbaji bapa `safu[p ; q]`

### v0.0.3 — Mifumo ya Nambari za Unicode _(Aprili 2026)_

- **Imeongezwa** Vizuizi 69 vya nambari za Unicode na ishara ya kubadili hali `#d0d9#`
- **Imeongezwa** Herufi halisi za mantiki katika mwandiko wowote — `#१` / `#०`

### v0.0.2 — Usanifu Upya wa API ya Mikusanyiko _(Machi 2026)_

- **Imeongezwa** Familia ya viendeshaji `$` kwa safu na mifuatano
- **Imeongezwa** Ugawaji wa utenganishaji, na faharasa hasi

### v0.0.1 — Toleo la Kwanza la Umma _(Machi 2026)_

- Mkalimani wa kutembea mti + VM ya rejista (`--vm`)
- Miundo yote ya msingi: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Vitambulishi kamili vya Unicode, mfumo wa moduli, lambda, vifungo, kushughulikia makosa
- REPL, LSP, kiendelezi cha VS Code, kiumbizi (`zymbol fmt`)

---

_Zymbol-Lang — Ishara. Ulimwenguni. Isiyobadilika._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Leseni:** mwongozo huu una leseni chini ya [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024-2026 Zymbol-Lang Team. Maandishi kamili: `LICENSE-CC-BY-SA-4.0` kwenye <https://github.com/zymbol-lang/web>. Mkalimani na injini ya kivinjari (`zymbol.js`) ni kazi tofauti, zilizo na leseni ya AGPL-3.0-only.
