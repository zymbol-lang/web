> **Isaziso:** Leli phepha ladalwa futhi lahumushwa ngobuchwepheshe bokwenziwa (AI).
>
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
>
> Incwadi eyisisekelo yi-**[GUIDE.md](https://github.com/zymbol-lang/interpreter)** esikhungweni somhumushi.

---

# Incwadi ye-Zymbol-Lang

> **Ibukeziwe kabusha ye-v0.0.9 — 2026-09-07**

**I-Zymbol-Lang** iwulimi lokuhlela lwamakhodi. Azikho izwi ohlelweni lwayo — yonke into eyakhiwe iwuphawu. Isebenza ngendlela efanayo kunoma yiluphi ulimi lomuntu.

- Azikho `if`, `while`, `return` — kuphela `?`, `@`, `<~`
- I-Unicode ephelele — izimpawu zokuhlonza kunoma yiluphi ulimi noma i-emoji
- Ayincikile olimini lomuntu — ikhodi iyafana kuyo yonke indawo

**Inguqulo yomhumushi**: v0.0.9 | **Ukuhlolwa kokuhlola**: 660/666 (iziphiceli ezintathu ziyavumelana, 0 ezehlukile)

---

## Izinto Eziguqukayo Nezingaguquki

```zymbol
x = 10              // into eguqukayo
PI := 3.14159       // into engaguquki — ukuyishintsha kabusha kuyiphutha lesikhathi sokusebenza
igama = "Thabo"
kusebenzayo = #1    // i-boolean yeqiniso
👋 := "Sawubona"
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

`°` (uphawu lwedigri, U+00B0) luqala into ngokuzenzakalela ngenani layo elingathathi hlangothi ekusetshenzisweni kokuqala:

```zymbol
izinombolo = [3, 1, 4, 1, 5]
@ n:izinombolo {
    °isamba += n
}
>> isamba ¶              // → 14
```

> `°into` (isandulela) ibambelela ngaphezu kwesikhathi — umphumela ufundeka ngemuva kwe-`@`.
> `into°` (isijobelelo) ibambelela ngaphakathi kwesikhathi — iyafa lapho isikhathi siphela.

Isitatimende esiyigama nje kuphela sifunda into bese silahla inani, ngakho siyaxwayisa:

```zymbol
isibali = 5
isibali
```

Umhlanganisi uxwayisa kanje (imiyalezo yayo ihlala ngesiNgisi):

```text
warning: this statement does nothing: 'isibali' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

Okusho ukuthi: *«lesi sitatimende akenzi lutho: 'isibali' sifundiwe futhi salahlwa»*.

---

## Izinhlobo Zedatha

| Uhlobo | Okubhaliwe | Ithegi `#?` | Amanothi |
|------|---------|----------|-------|
| Inombolo ephelele | `42`, `-7` | `###` | Inombolo ephephile: ±(2⁵³ − 1) |
| Inombolo yedesimali | `3.14`, `1.5e10` | `##.` | IEEE-754 kabili |
| Umbhalo | `"umbhalo"` | `##"` | Ukufaka: `"Sawubona {igama}"` |
| Uhlamvu | `'A'` | `##'` | Iphoyinti lekhodi elilodwa le-Unicode |
| I-boolean | `#1`, `#0` | `##?` | AKUSIYONA inombolo — `#1 ≠ 1` |
| Uhlu | `[1, 2, 3]` | `##]` | Uhlobo olulodwa, kuhloliwe |
| Ingxube emenyezelwe | `#[1, "kabili"]` | `##[` | Uhlobo olufana ne-`[…]`, akuhlolwanga |
| I-tuple | `(a, b)` | `##)` | Ngokulandelana, ayishintshi |
| Isichazamazwi | `#(x: 1, y: 2)` | `##(` | Ngokhiye, siyashintsha |
| Umsebenzi | ireferensi yomsebenzi onegama | `##()` | Ikilasi lokuqala; ikhombisa `<funct/N>` |
| I-lambda | `x -> x * 2` | `##->` | Ikilasi lokuqala; ikhombisa `<lambd/N>` |
| Iyunithi | `##_` | `##_` | Ukungabikho — akukho null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(x: 1)#? ¶          // → (##(, 1, #(x: 1))
```

Inombolo ephelele ephuma ebangeni eliphephile iyiphutha elibanjwayo, hhayi ukusonga okuthule:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "ngaphandle kwebanga" ¶ // → ngaphandle kwebanga
}
```

`##_` iyindlela uhlelo olubuza ngayo ukuthi kukhona yini okungekho:

```zymbol
lutho() { }
inani = lutho()
>> (inani == ##_) ¶     // → #1
```

---

## Okukhishwayo Nokufakwayo

```zymbol
igama = "Thabo"
isamba = 3
>> "Sawubona" ¶             // → Sawubona
>> "a=" igama " b=" isamba ¶ // → a=Thabo b=3
>> isamba#? ¶            // → (###, 1, 3)
```

```zymbol
<< igama
<< "Faka igama lakho: " igama
<< ###(4) "Iminyaka: " iminyaka
```

**Bheka ukuma kwalezi zimpawu ezimbili.** `>>` ikhomba ngaphandle: ikhipha idatha kuphrokhramu. `<<` ikhomba ngaphakathi: ingena nedatha kuphrokhramu. Akukho okumele kukhunjulwe lapha — umcibisholo ukhombisa lapho ulwazi luya khona, futhi lowo mqondo uyabuya kuwo wonke uphawu oluhambisa into.

> `¶` ne-`\\` yimigqa emisha elinganayo. `>>` ayinengezi neyodwa.
> Isicacisi sohlobo ngaphambi kombuzo siqinisekisa ngenkathi sifunda futhi siphinde sibuza kuze kube inani lifanele:
> `##.` Inombolo yedesimali · `##.(T,D)` idesimali · `###(N)` Inombolo ephelele · `##"(N)"` umbhalo · `##'` uhlamvu olulodwa.

Ezingeni eliphezulu lefayela, `<~` iyisimo sokuphuma kohlelo:

```zymbol
>> "siyahlola" ¶      // → siyahlola
<~ 0
```

---

## Izisekelo ze-TUI

Ama-opharetha wesikhombisi se-terminal ezinhlelweni ezisebenzisanayo. Iningi lawo lidinga ibhlokhi engu-`>>| { }` (isikrini esihlukile + imodi eluhlaza).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Iyasebenza"
    @~ 1000
    >>~ (2, 1) > "Kuphelile."
}
```

```zymbol
>>| {
    [imigqa, amakholomu] = >>?
    >>~ (1, 1) > "I-terminal: " imigqa " x " amakholomu
    <<| ukhiye
    >>~ (2, 1) > "Kucindezelwe: " ukhiye
}
```

Lapha ungabona ukuthi kungani izimpawu zihlangana kunokuba ziphindaphindwe. Usuwazi ukuthi `<<` ingukufaka futhi `?` ibuza ngaphandle kokuzibophezela. Uphawu olulodwa kuphela olusha:

- `|` **iyiyunithi eyodwa**, hhayi wonke umsele.

Ngalokho, womabili ama-opharetha ekhithibhodi azifundela wona:

```text
<<        |             ?
ukufaka   iyunithi eyodwa  ngaphandle kokuzibophezela

<<|   thatha UKHIYE OWODWA, bese ulinda kuze kube kukhona owodwa
<<|?  bheka ukuthi IKHONA yini ukhiye, bese uqhubeka uma ungekho
```

Okufanayo ngakolunye uhlangothi: `>>` iyathumela, `>>!` ithumela **ngamandla** (isusa sonke isikrini), kanti `>>?` **iyabuza** esikhundleni sokubhala (i-terminal inkulu kangakanani). Uphawu olungakwesokudla yilolo olushintsha imodi, futhi luhlala lufika ekugcineni.

> `>>!` isusa isikrini. `>>?` ibuyisela `[imigqa, amakholomu]`. `@~ N` ilala imizuzwana engu-N.
> `<<|` ifunda ukucindezelwa kokhiye okukodwa (kuyavimba); `<<|?` ihlola ngaphandle kokuvimba (`'\0'` uma kungekho).
> Izinkinobho zemicibisholo zifika zihlukaniswe njengo-`'↑' '↓' '←' '→'`; i-ESC iyikhodi yephoyinti 27.
> I-tuple yokuphuma enendawo: `(umugqa, ikholomu, BKS, phambi, ngemuva)` — noma iyiphi isikhala ingashiywa ngekhoma (`>>~ (,,, 196) > "bomvu"`).
> I-BKS bitmask: `1`=Okugqamile, `2`=Okutshekile, `4`=Umugqa ongaphansi. Iphaneli yemibala engu-ANSI 256 (`0`=okumisiwe kweterminal).

---

## Ama-opharetha

```zymbol
a = 10
b = 3
m1 = a + b    // 13
m2 = a - b    // 7
m3 = a * b    // 30
m4 = a / b    // 3  (ukwehlukanisa okuphelele)
m5 = a % b    // 1
m6 = a ^ b    // 1000
```

```zymbol
a = 10
b = 3
q1 = a == b    // #0
q2 = a <> b    // #1
q3 = a < b     // #0
q4 = a >= b    // #1
n1 = #1 && #0  // #0
n2 = !#1       // #0
```

> `==` ayiphoqi neze: `"5" == 5` yi-`#0`. Ukuhlela kuyaphoqa: `"5" > 4` yi-`#1`, futhi `"४२" > 5` nayo — umbhalo wezinombolo kunoma yimuphi koyizinhlamvu ezingama-69 uqhathaniswa njengenombolo.
> Umsebenzi ulingana nawo kuphela, awulingani nomunye umsebenzi onomzimba ofanayo.

---

## Imibhalo

```zymbol
igama = "Thabo"
n = 42
>> "Sawubona " igama " unayo " n ¶ // → Sawubona Thabo unayo 42
incazelo = "Sawubona {igama}, unayo {n}"
>> incazelo ¶              // → Sawubona Thabo, unayo 42
```

```zymbol
s = "Sawubona mhlaba"
ubude = s$#                  // 15
ingxenye = s$[1..8]             // "Sawubona"
inayo = s$? "mhlaba"          // #1
izingxenye = "a,b,c,d"$/ ','    // [a, b, c, d]
shintsha = s$~~["a":"e"]        // "Sewubone mhlebe"
umugqa = "─" $* 20
```

> `+` ingeyezinombolo kuphela. Emibhalweni sebenzisa ukuhlangana noma ukufaka.
> `\{` ne-`\}` ngamabrace angempela — ukuphunyuka kuyalingana.

---

## Ukulawulwa Kwemisebenzi

```zymbol
x = 7
? x > 100 {
    >> "kukhulu" ¶
} _? x > 0 {
    >> "kuhle" ¶     // → kuhle
} _ {
    >> "kubi" ¶
}
```

Lapha kukhona izimpawu ezimbili ezintsha, kanti eyesithathu iza ngokuzihlanganisa:

- `?` **ukubuza**: ivula isimo.
- `_` **okungacaciswanga**: igatsha elisala uma kungekho mbuzo ofanayo.
- `_?` yikho kokubili ngokulandelana: *uma kungabanga khona okufanayo, buza futhi*.

Yingakho `_?` ibhalwa kanjalo. Akusona uphawu olusha okufanele lufundwe — ingu-`_` elandelwa ngu-`?`, futhi isho ngqo lokho izingxenye zayo ezimbili ezikushoyo, uma zifundwa ngokulandelana.

> Amabrace `{ }` **ayadingeka** ngisho nasestitatimendeni esisodwa.

---

## Ukufanisa

```zymbol
amaphuzu = 85
izinga = ?? amaphuzu {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> izinga ¶              // → B
```

```zymbol
izinga_lokushisa = -5
isimo = ?? izinga_lokushisa {
    < 0  => "iqhwa"
    < 20 => "kubanda"
    _    => "kushisa"
}
>> isimo ¶              // → iqhwa
```

Usuwazi ukuthi `?` ingukuthi "buza". **`??` ukubuza izikhathi eziningi**: ukuphinda uphawu, noma kuphi olimini, kuwukwenza izikhathi eziningi lokho uphawu olukwenza kanye. U-`?` owodwa uhlola isimo esisodwa; `??` ihlola ngokumelene nohlu lwamacala.

Ezinye izindlela zihlangana nge-`||`, futhi zingahlanganisa izinhlobo zamaphethini:

```zymbol
ukhiye = 'P'
isenzo = ?? ukhiye {
    'p' || 'P' => "misa"
    < 0 || > 100 => "ngaphandle kwebanga"
    _ => "akunakwa"
}
>> isenzo ¶             // → misa
```

---

## Izikhathi

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
izithelo = ["ihhabhula", "iperi", "amagilebhisi"]
@ t:izithelo { >> t " " }
>> ¶                    // → ihhabhula iperi amagilebhisi
@ u:"Sawubona" { >> u "-" }
>> ¶                    // → S-a-w-u-b-o-n-a-
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
isibali = 0
@:ngaphandle {
    isibali++
    ? isibali >= 3 { @:ngaphandle! }
}
>> isibali ¶             // → 3
```

`@` wuphawu **lwesikhathi**: konke okuphindaphindayo kuhlala kulo. Ukuze unqamule leso sikhathi wengeza uphawu eceleni kwalo:

- `@!` — `!` **ngamandla**: phuma esikhathini manje.
- `@>` — `>` iphushela phambili: iya emzuliswaneni olandelayo.
- `@:ngaphandle!` — `:` **ibopha igama**, ngakho lokhu kunqamula isikhathi *esibizwa* ngaphandle, hhayi esiseduze kakhulu.

Ama-opharetha amathathu, futhi akukho nelilodwa okwadingeka lwakhunjulwa ngokwehlukile: angu-`@` kanye nophawu oseluvele lusho ukuthi lwenzani.

> **Isicacisi siyinombolo noma isimo.** `Inombolo ephelele` iyinombolo, ihlolwa kanye — `@ 0` iqhuba umzimba izikhathi eziyiziro. Konke okunye kuyisimo. Akukho eqinisweni: `@ []` ne-`@ 3.5` ziyaliwa. Ukuhamba ngeqoqo sebenzisa `@ x:izinto`; ukulibala, `@ izinto$#`.

---

## Imisebenzi

```zymbol
engeza(a, b) { <~ a + b }
>> engeza(3, 4) ¶        // → 7
```

```zymbol
ifektri(n) {
    ? n <= 1 { <~ 1 }
    <~ n * ifektri(n - 1)
}
>> ifektri(5) ¶       // → 120
```

Umsebenzi ufunda izinto zefayela ngenani, futhi ukubhala ngaphakathi kuhlala ngaphakathi:

```zymbol
umkhawulo = 100
ngaphakathi(n) { <~ n < umkhawulo }
>> ngaphakathi(42) ¶         // → #1
```

Izimpawu ezimbili zishintsha lokho, futhi zombili zibhalwa **kusiginesha nasendaweni yokubiza**:

```zymbol
khulisa(isibali<~) { isibali = isibali + 1 }
isamba = 0
khulisa(isamba<~)
>> isamba ¶              // → 1
```

> `p~` iyikhophi yokusebenza — umzimba ungayishintsha futhi obizayo angathinteki.
> `p<~` iyipharamitha yokuphuma — ushintsho lubuyela emuva. `khulisa(isamba)` ngaphandle kophawu kuyiphutha lencazelo: isichasiselo nesiginesha azikwazi ukwehlukana.

---

## Ama-Lambda Nezivalo

```zymbol
kabili = x -> x * 2
isamba = (a, b) -> a + b
>> kabili(5) ¶          // → 10
>> isamba(3, 7) ¶          // → 10
```

```zymbol
hlukanisa = x -> {
    ? x > 0 { <~ "kuhle" }
    _? x < 0 { <~ "kubi" }
    <~ "iqanda"
}
>> hlukanisa(-4) ¶         // → kubi
```

```zymbol
isici = 3
kathathu = x -> x * isici
>> kathathu(7) ¶          // → 21
```

```zymbol
dala_isengezi(n) { <~ x -> x + n }
engeza10 = dala_isengezi(10)
>> engeza10(5) ¶           // → 15
```

I-lambda ingangathathi pharamitha neze:

```zymbol
impendulo = () -> 42
>> impendulo() ¶           // → 42
```

> I-lambda ibamba izinto zefayela **ngenkathi idalwa**; umsebenzi onegama uzifunda **ngenkathi ubizwa**.

---

## Amaluhlu

```zymbol
uhlu = [1, 2, 3, 4, 5]
>> uhlu[1] ¶       // → 1   ukukhombisa kuqala ku-1
>> uhlu[-1] ¶      // → 5   okubi kubala kusukela ekugcineni
>> uhlu$# ¶        // → 5   ubude
```

```zymbol
uhlu = [1, 2, 3]
>> (uhlu$+ 6) ¶          // → [1, 2, 3, 6]   engeza
>> (uhlu$+[2] 99) ¶      // → [1, 99, 2, 3]  faka endaweni yesi-2
>> (uhlu$- 3) ¶          // → [1, 2]         susa ukwenzeka kokuqala
>> (uhlu$-[1]) ¶         // → [2, 3]         susa kunkomba yesi-1
>> (uhlu$[1..2]) ¶       // → [1, 2]         qaqa, zombili iziphetho zifakiwe
>> (uhlu$? 3) ¶          // → #1             iqukethe
```

Zonke ziqala ngo-`$`, uphawu **lweqoqo**, futhi ziqhubeka ngophawu olusho ukuthi kwenzekani kulo: `#` zingaki, `+` engeza, `-` susa, `?` buza ukuthi zikhona yini. Futhi njengo-`??`, ukuphinda uphawu kusho ukuyenza ngokuphelele: `$?` ibuza *ukuthi* inani likhona yini, `$??` ibuza *ezindaweni ezingaki* futhi ibuyisele zonke.

```zymbol
uhlu = [3, 1, 2]
>> (uhlu$^+) ¶     // → [1, 2, 3]   okwenyukayo
>> (uhlu$^-) ¶     // → [3, 2, 1]   okwehlukayo
```

**Umthetho womphumela.** I-opharetha eyodwa, futhi lokho ikhodi ezungezile ekwenzayo kunquma: uma kusetshenzisiwe, **iyakha** futhi ishiye okokuqala kungathinteki; uma kulahliwe, **iyashintsha**.

```zymbol
uhlu = [1, 2, 3]
ikhophi = uhlu[2]$~ 99
>> uhlu ¶                // → [1, 2, 3]
>> ikhophi ¶              // → [1, 99, 3]
uhlu[2]$~ 99
>> uhlu ¶                // → [1, 99, 3]
```

> **`=` ayibhali neze eqoqweni.** `uhlu[2] = 99` akusona isimo se-Zymbol — `=` inika **IGAMA** inani. Ukushintsha ingxenye yeqoqo ngu-`$~`, kuwo wonke amaqoqo.

`[…]` iqukethe uhlobo olulodwa futhi iyahlolwa; ingxube eyenziwe ngamabomu **imenyezelwa** nge-`#[…]`:

```zymbol
ingxube = #[1, "kabili", #1]
>> ingxube ¶             // → [1, kabili, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Ukukhombisa Okuyizilinganiso Eziningi

`>` yehla iye esakhiweni esinesidleke. Iqembu elilodwa lamabrace likhomba into eyodwa, noma ijule kangakanani.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   umugqa 2, ikholomu 3
>> m[-1>-1] ¶      // → 9   umugqa wokugcina, ikholomu yokugcina
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          kucishe: idayagonali
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   kuhlelekile: amakhona
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` **akusona** isimo se-Zymbol. Inkomba elandelanayo iyaliwa kokubili ekufundeni nasekubhaleni — iqembu elilodwa lamabrace ngokufinyelela ngakunye, futhi `>` iyona ephakathi kwezinyathelo.

---

## Izichazamazwi

I-tuple enezinkambu ezinamagama iyisichazamazwi, futhi kusukela ku-v0.0.9 ibhalwa ngokuthi `#(…)`.

```zymbol
umuntu = #(igama: "Thabo", iminyaka: 25)
>> umuntu.igama ¶        // → Thabo
>> umuntu["iminyaka"] ¶    // → 25
```

```zymbol
umuntu = #(igama: "Thabo", iminyaka: 25)
inkambu = "igama"
>> umuntu[inkambu] ¶     // → Thabo
```

Iyashintsha, okhiye bangengezwa, futhi ingahanjwa:

```zymbol
impahla = #(iperi: 4)
impahla["ihhabhula"]$~ 10
@ k:impahla { >> k "=" impahla[k] " " }
>> ¶                    // → iperi=4 ihhabhula=10
```

```zymbol
impahla = #(iperi: 4, ihhabhula: 10)
@ (k, v):impahla { >> k ":" v " " }
>> ¶                    // → iperi:4 ihhabhula:10
```

> `#()` iyisichazamazwi esingenalutho, okungeyona into u-`()` ayengaba yiyo — kwakufanele kube i-tuple engenalutho futhi. `(x: 1)` enqunu iyaliwa ngalo myalezo: *a dictionary is written `#(…)`* — «isichazamazwi sibhalwa `#(…)`».
> Isichazamazwi sikhunjwa ngokhiye, hhayi ngendawo, ngakho `umuntu[1]` kuyiphutha.

---

## Ama-Tuple

Ama-tuple ayiziqukathi ezihlelekile **ezingashintshi** ezigcina amanani ezinhlobo ezahlukene.

```zymbol
iphoyinti = (10, 20)
>> iphoyinti[1] ¶           // → 10
idatha = (42, "Sawubona", #1, 3.14)
>> idatha[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Noma yimuphi umzamo wokushintsha i-tuple endaweni yayo uyiphutha, kungakhathaliseki i-opharetha — ukungashintshi kuyisici senani, hhayi ukuhlukile ngaphakathi kwe-`$` ngayinye.

---

## Ukwehlukanisa Isakhiwo

```zymbol
uhlu = [10, 20, 30, 40, 50]
[a, b, c] = uhlu
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
uhlu = [10, 20, 30, 40, 50]
[okokuqala, *okusele] = uhlu
>> okokuqala ¶            // → 10
>> okusele ¶              // → [20, 30, 40, 50]
```

```zymbol
iphoyinti = (100, 200)
(px, py) = iphoyinti
>> px " " py ¶          // → 100 200
```

```zymbol
umuntu = #(igama: "Nomvula", iminyaka: 25)
#(igama: n, iminyaka: y) = umuntu
>> n " " y ¶            // → Nomvula 25
```

> Ukuma kwamabrace kunohlobo: `[…]` ithatha uhlu, `(…)` i-tuple, `#(…)` isichazamazwi. Igama lokugcina **limunca okusele**, ngakho ukwehlukanisa isakhiwo akwehluleki ngobude — `(a, b, c) = (1,2,3,4,5)` kunika `c = (3,4,5)`, futhi `##_` uma kungasale lutho.

---

## Imisebenzi Yezinga Eliphezulu

```zymbol
izinombolo = [1, 2, 3, 4, 5]
>> (izinombolo$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (izinombolo$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (izinombolo$< (0, (isiqoqi, x) -> isiqoqi + x)) ¶ // → 15
```

```zymbol
izinombolo = [1, 2, 3, 4, 5, 6]
kabili(x) { <~ x * 2 }
kukhulu(x) { <~ x > 3 }
>> (izinombolo$> kabili) ¶    // → [2, 4, 6, 8, 10, 12]
>> (izinombolo$| kukhulu) ¶    // → [4, 5, 6]
```

```zymbol
isisekelo = [#(igama: "Karla", iminyaka: 28), #(igama: "Nomvula", iminyaka: 25)]
ngokweminyaka = isisekelo$^ (a, b -> a.iminyaka < b.iminyaka)
>> ngokweminyaka[1].igama ¶     // → Nomvula
```

> Umsebenzi onegama uya ku-HOF **ngaphandle kwamabrace**: `izinombolo$> kabili`. Ukubhala `izinombolo$> (kabili)` kuyiphutha lokuhlaziya, ngoba `(` ivula i-lambda.

---

## I-opharetha Yepayipi

```zymbol
kabili = x -> x * 2
engeza = (a, b) -> a + b
inc = x -> x + 1
>> (5 |> kabili(_)) ¶    // → 10
>> (10 |> engeza(_, 5)) ¶  // → 15
>> (5 |> kabili(_) |> inc(_)) ¶ // → 11
```

---

## Ukubhekana Namaphutha

```zymbol
!? {
    a = 10 / 0
} :! ##Div {
    >> "ukwehlukanisa ngoziro" ¶  // → ukwehlukanisa ngoziro
} :! {
    >> "okunye: " _err ¶
} :> {
    >> "kuhlala kusebenza" ¶        // → kuhlala kusebenza
}
```

| Uhlobo | Nini |
|------|------|
| `##Div` | Ukwehlukanisa ngoziro |
| `##Index` | Inkomba ngaphandle kwemingcele |
| `##Key` | Ukhiye awukho esichazamazwini |
| `##Range` | Ngaphandle kwebanga lenombolo ephephile |
| `##Type` | Uhlobo aluhambisani |
| `##Parse` | Ukuhlaziya idatha |
| `##IO` | Ifayela / isistimu |
| `##Network` | Amaphutha enethiwekhi |
| `##DB` | Idathabhezi |
| `##Time` | Usuku olungekho |
| `##_` | Noma yiliphi iphutha (libamba konke) |

`!` wuphawu **lwephutha namandla**, futhi lifundwa ngendlela efanayo emindenini yomibili: `$!` ibuza inani ukuthi liyiphutha yini; `$!!`, nophawu oluphindwe kabili, ilihambisa phezulu ngaphandle kokubuza.

> Ukwehluleka komtapo ojwayelekile kubuyela njengama-**nani ephutha athambile** owahlola nge-`$!` noma uwabambe nge-`!?`, esikhundleni sokumisa uhlelo. `$!!` isakaza elilodwa kumobizi.

---

## Amamojuli

```zymbol
# ukubala {
    #> { engeza, PI }

    PI := 3.14159
    engeza(a, b) { <~ a + b }
}
```

```zymbol
<# ./ukubala => u

>> u::engeza(5, 3) ¶
>> u.PI ¶
```

```zymbol
# umtapo_wami {
    #> { engeza_ngaphakathi => isamba }

    engeza_ngaphakathi(a, b) { <~ a + b }
}
```

Izimpawu ezimbili zomojuli ziwumbono ofanayo, manje osetshenziswa emafayeleni: `#` yizinga **lesimemezelo** — lokho into *iyikho*, hhayi inani layo — futhi umcibisholo usho ukuthi ikhodi ihamba ngakuphi:

```text
<#   umcibisholo ungena: thengisa, letha kolunye ufayela
#>   umcibisholo uphuma: thumela, nikela kwabanye amafayela
```

Uphawu lwenkombandlela luhlala emaphethelweni abheke lapho lukhomba khona. Lesi yisizathu esifanayo sokuthi kungani `<~` ibuyela kwesokunxele (iphuma emsebenzini) futhi `->` ingena kwesokudla (ingena emzimbeni we-lambda).

> **Umojuli umemezela lokho okukhiphayo.** Ibhlokhi engu-`#>` iyadingeka — ukuyishiya kuyi-**E014**, futhi `#> { }` iyindlela umojuli athi ngayo ukuthi ubuso bawo abunalutho. `::` ibiza umsebenzi, `.` ifunda into engaguquki. Kuphela okungenisiwe, ibhlokhi yokuthumela, iziqalisi zangempela nezincazelo zemisebenzi ezingavela emzimbeni womojuli; noma yini engenziwa iyi-**E013**.

---

## Umtapo Ojwayelekile

Amamojuli omdabu, angeniswa njenganoma yimuphi omunye:

| Umojuli | Imisebenzi |
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

>> t::width("手番") ¶            // → 4   ama-glyph amabili, amakholomu amane
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

usuku = T::of(2026, 1, 31)
>> T::format(usuku, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(usuku, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` ikala **amakholomu okubonisa**, hhayi izinhlamvu: i-CJK neningi lama-emoji kungamakholomu angu-2, ngakho hlela ithebula nge-`t::width`, hhayi nge-`$#`.
> Ku-`std/time` isikhathi ngumzuzwana kusukela enkathini. Ngaphansi kosuku isikhathi, kusukela osukwini kuya phezulu ikhalenda — ngakho inyanga iwela ngosuku olufanayo lwenyanga, icindezelwe. `umehluko(a, b)` yi-`a - b`, ngakho isikhathi sangaphambili uma sifakwa kuqala sinika impendulo engemihle.

---

## Amaphakethe

I-`.zyp` ihlanganisa uhlelo lwamafayela amaningi efayeleni elilodwa eliphathekayo. Iyisigcino **somthombo**, hhayi kanambambili, ngakho isebenza noma kuphi lapho i-`zymbol` inambambili isebenza khona.

```bash
zymbol package iphrojekthi_yami/ --script main.zy -o iphrojekthi_yami.zyp
zymbol run iphrojekthi_yami.zyp
```

> Isigcino siphethe imanifesti (`zyp.toml`) ememezela imibhalo yaso yokungena nenguqulo yomshini eyidingayo. `zymbol run` iyikhipha iyise kufolda yesikhashana futhi iqale ukusebenza kusukela lapho, ngakho ikhodi ilahleka kanti lokho umbhalo okubhalayo kuwela kufolda yakho yokusebenza yangempela. Indawo yokudlala nayo ilayisha amafayela e-`.zyp`.

---

## Ama-Modi Ezinombolo

I-Zymbol ingabhala izinombolo **kuzinhlamvu zama-Unicode eziyi-69 zokubhala izinombolo** — i-Devanagari, i-Arab-Indic, i-Thai, i-Klingon pIqaD, i-Mathematical Bold, izingxenye ze-LCD, nokunye. Imodi iyihlanganisa inqubo futhi ithinta okukhiphayo; izibalo azishintshi.

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arab-Indic (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // buyisela ku-ASCII
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

Izinombolo zanoma iyiphi indlela yokubhala esekelwayo ziyizibhalo ezisemthethweni kumthombo:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Ukufunda kuyalingana — inombolo iqondwa kunoma iyiphi indlela yokubhala:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` ihlala iyi-ASCII, ngakho `#0` ihlala ihlukile ngokubona kwinombolo yeziro kuzo zonke izindlela zokubhala.
> `#,` ne-`#^` nazo zibhala izinombolo zazo ngendlela esebenzayo, futhi izihlukanisi ziyazilandela — kodwa ipheya ayiphenduki neze: `,` iqoqa futhi `.` ihlukanisa, kuzo zonke izindlela zokubhala.

---

## Ama-opharetha Edatha

```zymbol
f = ##.42         // kuya ku-Inombolo yedesimali
i = ###3.7        // kuya ku-Inombolo ephelele, kusondezwe  → 4
t = ##!3.7        // kuya ku-Inombolo ephelele, kusikwe  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Inombolo yedesimali iphrintwa njengezinombolo, ayiphri ntwanga njengenkomba, futhi ilahla u-`.0` wokugcina — `##.42` ibhala `42` futhi iseyi-Inombolo yedesimali, njengoba i-`f#?` ibonisa.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   ephephile: ibuyisela okokufaka kungashintshiwe
>> ##!'A' ¶        // → 65    iphoyinti lekhodi lika-Uhlamvu
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          sondeza kumasembozo ama-2
>> #!2|pi| ¶       // → 3.14          sika kumasembozo ama-2
>> #,|1234567| ¶   // → 1,234,567     izihlukanisi zezinkulungwane
>> #^|12345.678| ¶ // → 1.2345678e4  isibhalo sesayensi
```

```zymbol
>> 0x41 ¶        // → A   isisekelo-16
>> 0b01000001 ¶  // → A   isisekelo-2
>> 0o101 ¶       // → A   isisekelo-8
>> 0d65 ¶        // → A   isisekelo-10
```

> Isibhalo sesisekelo ebangeni le-ASCII **nguHlamvu**: `0d65 == 'A'` yi-`#1`, futhi `0d65 == 65` yi-`#0`. Zonke izisekelo ezine zibhala uhlamvu olufanayo.

---

## Ukuhlanganiswa kwe-Shell

```zymbol
namuhla = <\ date +%Y-%m-%d \>
>> "Namuhla: " namuhla
```

```zymbol
okukhiphayo = </"./umbhalo_ongaphansi.zy"/>
>> okukhiphayo
```

> `<\ … \>` ibamba i-stdout ne-stderr, isuse umugqa omusha wokugcina.
> `>< args` ibamba izimpikiswano zomugqa womyalo njengohlu lwamagama.

---

## Isibonelo Esiphelele: FizzBuzz

```zymbol
hlukanisa(inombolo) {
    ? inombolo % 15 == 0 { <~ "FizzBuzz" }
    _? inombolo % 3  == 0 { <~ "Fizz" }
    _? inombolo % 5  == 0 { <~ "Buzz" }
    <~ inombolo
}

@ i:1..20 { >> hlukanisa(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (okukodwa umugqa ngamunye)
```

---

## Izimpawu Zihlangana Kanjani

Uke wabona into efanayo kuyo yonke le ncwadi: **i-opharetha ayisona isithombe okufanele sikhunjulwe, izimpawu eziningana kulandelana, futhi ngayinye inikela ngencazelo yayo.** Manje njengoba usuzazi zonke, nayi iphethini ephelele.

Okokuqala kuza **ukuthi sikumhlaba upi**:

| Uphawu | Umhlaba | Uke wayibona ku |
|--------|-------|----------------------------|
| `$` | iqoqo | `$#` `$+` `$?` `$^-` |
| `@` | isikhathi, konke okuphindaphindayo | `@!` `@>` `@~` |
| `#` | ukuthi into *iyini*, hhayi inani layo | `#?` `#(…)` `<#` `#>` |
| `>>` | ngaphandle kohlelo | `>>` `>>!` `>>?` |
| `<<` | ngaphakathi kohlelo | `<<` `<<\|` `<<\|?` |
| `?` | buza, ngaphandle kokuzibophezela | `?` `_?` `??` `$?` |
| `!` | amandla, noma iphutha | `@!` `$!` `!?` |

Kwalandela **okwenziwayo lapho**: `+` engeza, `-` susa, `^` hlela, `~` shintsha, `#` bala, `|` iyunithi eyodwa, `:` bopha igama.

Futhi imithetho emibili engahluleki neze:

**Ukuphinda uphawu kuyenza iphelele.** `?` ibuza kanye, `??` ihlola amacala amaningi. `$?` ibuza ukuthi inani likhona yini, `$??` ibuyisela yonke indawo elikhona kuyo. `!` imaka iphutha, `!!` lisakaza ngaphandle kokubuza.

**Uphawu lwemodi luhlala lufika ekugcineni.** Lapho `?` noma `!` zivela ukusho *ukuthi* into yenziwa kanjani — ngokungabaza noma ngamandla — ziwuphawu lokugcina lwe-opharetha: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:ngaphandle!`. Akukho-ke ukusebenza ngemuva kwazo.

Into esebenzayo iphuma kulokho: **inhlanganisela ongakaze uyibone isuke inencazelo ngaphambi kokuba uyibheke.** Uma `$` iyiqoqo futhi `^` iwukuhlela futhi `-` iphambene, ngakho-ke `$^-` ihlela ngokwehla, futhi akukho muntu okwadingeka akutshele.

Akulona lonke uhlu olusebenza kanjalo, futhi ukusho lokho kungcono kunokwenza sengathi kunjalo. Iningi lama-opharetha lihlukana ngokuhlanzekile. Ayisithupha ahlukana kodwa asho okungaphezu kwezingxenye zawo: `!?` `:!` `:>` `|>` `::` `$++`. Futhi ayishumi kufanele akhunjulwe ngoba awahlukani neze: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Ukubala okungacaci esikhundleni sokucabanga ukuthi kuncane kuyamabomu: yikho okuyizindleko zangempela zokukhumbula ulimi. Isithenjwa esiphelele — uhlu, ama-homograph amenyelwe, nemithetho okufanele i-opharetha entsha iyigcwalise ukuze ibe khona — siku-`SYMBOLS.md`, esikhungweni somhumushi.

---

## Isithenjwa Sezimpawu

| Uphawu | Umsebenzi | Uphawu | Umsebenzi |
|--------|-----------|--------|-----------|
| `=` | into eguqukayo | `$#` | ubude |
| `:=` | into engaguquki | `$+` | engeza |
| `>>` | okukhiphayo | `$+[i]` | faka kunkomba (kusukela ku-1) |
| `<<` | okokufaka | `$-` | susa okokuqala ngenani |
| `¶` / `\\` | umugqa omusha | `$--` | susa konke ngenani |
| `?` | uma | `$-[i]` | susa kunkomba (kusukela ku-1) |
| `_?` | uma kungenjalo | `$-[i..j]` | susa ibanga (kusukela ku-1) |
| `_` | kungenjalo / i-wildcard | `$?` | iqukethe |
| `??` | ukufanisa | `$??` | thola zonke izinkomba (kusukela ku-1) |
| `\|\|` | iphethini-ye noma egatsheni lokufanisa | `$[s..e]` | qaqa (kusukela ku-1) |
| `@` | isikhathi | `$>` | imephu |
| `@ N { }` | isikhathi izikhathi ezingu-N | `$\|` | hlunga |
| `@!` | phula | `$<` | nciphisa |
| `@>` | qhubeka | `$/ umhlukanisi` | hlukanisa umbhalo |
| `@:igama { }` | isikhathi esinelebula | `$++ a b c` | akha ngokuhlanganisa |
| `@:igama!` | phula ilebula | `$~~[p:r]` | shintsha umbhalo |
| `@:igama>` | qhubeka nelebula | `$*` | phinda umbhalo |
| `->` | i-lambda | `uhlu[i]$~ v` | IFOMU EYODWA yokuvuselela |
| `<~` | buyisela / ipharamitha yokuphuma | `~` | ipharamitha yekhophi yokusebenza |
| `uhlu[i>j]` | inkomba yokuzulazula | `uhlu[p ; q]` | ukukhipha okucishe |
| `$^+` | hlela okwenyukayo | `$^-` | hlela okwehlukayo |
| `$^` | hlela ngesiqhathanisi | `\|>` | ipayipi |
| `!?` | zama | `:!` | bamba |
| `:>` | ekugcineni | `$!` | iphutha |
| `$!!` | sakaza iphutha | `#1` / `#0` | iqiniso / amanga |
| `##_` | Iyunithi — ukungabikho | `[…]` | uhlu, uhlobo olulodwa |
| `#[…]` | uhlu, ingxube emenyezelwe | `#(…)` | isichazamazwi |
| `(…)` | i-tuple yendawo | `#()` | isichazamazwi esingenalutho |
| `<#` | thengisa | `#>` | thumela |
| `#` | memezela umojuli | `::` | bizo umojuli |
| `.` | ukufinyelela inkambu / into engaguquki | `#?` | imethadatha yohlobo |
| `#\|..\|` | hlaziya inombolo | `##.` | guqula kube Inombolo yedesimali |
| `###` | guqula kube Inombolo ephelele (sondeza) | `##!` | guqula kube Inombolo ephelele (sika) |
| `#.N\|..\|` | sondeza | `#!N\|..\|` | sika |
| `#,\|..\|` | izihlukanisi zezinkulungwane | `#^\|..\|` | isayensi |
| `#d0d9#` | shintsha imodi yezinombolo | `#09#` | buyisela ku-ASCII |
| `<\ ..\>` | sebenzisa i-shell | `><` | izimpikiswano ze-CLI |
| `\ var` | chitha into | `°x` / `x°` | incazelo eshisayo |
| `>>\|` | ibhlokhi ye-TUI (isikrini esihlukile) | `>>~` | okukhiphayo okunendawo |
| `>>!` | sula isikrini | `>>?` | buza usayizi we-terminal |
| `<<\|` | ukucindezela kokhiye okuvimba | `<<\|?` | ukucindezela kokhiye okungavimbi |
| `@~ N` | lala imizuzwana engu-N | `0d` `0x` `0o` `0b` | izibhalo zesisekelo |

---

## Ijenali Yezinguquko Zokukhishwa

### v0.0.9 — Amaqoqo anquma _(Septhemba 2026)_

- **Ukuphula** Isichazamazwi sinombhalo waso: `#(ukhiye: inani)`. `(x: 1)` enqunu iyaliwa, futhi `#()` iyisichazamazwi esingenalutho — okungeyona into u-`()` ayengaba yiyo
- **Ukuphula** Ukwabiwa kwenkomba kuhoxisiwe: `uhlu[i] = v` nazo zonke izimo ezihlanganisiwe. `=` inika **IGAMA** inani; ukushintsha ingxenye yeqoqo ngu-`$~`
- **Ukuphula** Inkomba elandelanayo `m[i][j]` iyaliwa kokubili ekufundeni nasekubhaleni — `>` iphakathi kwezinyathelo
- **Ukuphula** Umojuli kufanele umemezele lokho okukhiphayo (**E014**); `#> { }` iyindlela umojuli athi ngayo ukuthi ubuso bawo abunalutho
- **Ukuphula** Isicacisi sesikhathi siyinombolo noma isimo — akukho eqinisweni. `@ []` ne-`@ 3.5` ziyaliwa
- **Kwengezwe** `##_` — isibhalo seYunithi, nendlela uhlelo olubuza ngayo ukuthi kukhona yini okungekho
- **Kwengezwe** `#[…]` — uhlu okumenyezelwe ingxube yezinhlobo zawo
- **Kwengezwe** `#?` ihlukanisa amaqoqo amane: `##]` `##[` `##)` `##(`
- **Kwengezwe** `std/time` — iwashi nekhalenda lomphakathi, namasizinda nezibalo zekhalenda
- **Kwengezwe** `<~>` ezingeni eliphezulu iyisimo sokuphuma kohlelo
- **Kwengezwe** `@ (k, v):amapheya` — iphethini ekhanda lesikhathi
- **Kwengezwe** `#|c|` ifunda inombolo kunoma iyiphi kweziyi-69 izindlela zokubhala; `#,` ne-`#^` zibhala kweyokusebenza
- **Kushintshiwe** `Inombolo ephelele` iyinombolo ephephile, ±(2⁵³ − 1), ivaliwe-ekwehlulekeni kuyo yonke imishini
- **Kushintshiwe** Umsebenzi onegama ufunda izinto zefayela ngesikhathi sokubiza, ngenani
- **Kushintshiwe** Isitatimende esifunda kuphela igama siyaxwayisa esikhundleni sokudlula buthule
- **Imishini** 660 kwabangu-666 amafayela e-corpus ayavumelana kuyo yomithathu imishini, 0 ehlukile

### v0.0.8 — Ukuzikhulula, `std/term` namaphakethe _(Agasti 2026)_

- **Kwengezwe** Ukubhujiswa okuzenzakalelayo ekusetshenzisweni kokugcina — akubonakali; kwehlisa kuphela imemori ephezulu
- **Kwengezwe** `std/term` — izilinganiso zokubonisa kumakholomu e-terminal
- **Kwengezwe** `##!` ku-`Uhlamvu` — iphoyinti lekhodi ye-Unicode
- **Kwengezwe** Amaphethini e-noma ekufaniseni: `'p' || 'P' => …`, ezinye izindlela zanoma yiluphi uhlobo egatsheni elilodwa
- **Kwengezwe** Amaphakethe e-Zymbol (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Kwengezwe** `<~>` endaweni yokubiza kuyadingeka lapho obizwayo ememezela ipharamitha yokuphuma
- **Kulungisiwe** Ukulingana kwesistimu yamajuli ku-VM yerejista

### v0.0.7 — Umtapo Ojwayelekile Wendabuko _(Julayi 2026)_

- **Kwengezwe** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — zonke zinamanani ephutha athambile
- **Kwengezwe** Okokufaka okunohlobo/okuqinisekisiwe: `<< ##.(5,2) "intengo: " p`
- **Kwengezwe** Ama-opharetha we-postfix ngqo ku-`>>` — akudingeki amabrace
- **Kushintshiwe** Isifomethi esivaliwe-ekwehlulekeni: senqaba ukubhala okukhiphayo esingakwazi ukukufunda futhi

### v0.0.6 — Ukucwengwa nomtapo wesayensi _(Juni 2026)_

- **Ukuphula** `=>` ithatha isikhundla sika-`:` emagatsheni okufanisa no-`<=` kuma-aliases wokungenisa/ukuthumela
- **Kwengezwe** `std/math` ne-`std/random`
- **Kwengezwe** Ukuvuselela isichazamazwi ngokhiye: `d["k"]$~ inani`

### v0.0.5 — Izisekelo ze-TUI nencazelo eshisayo _(Meyi 2026)_

- **Kwengezwe** Ibhlokhi ye-TUI `>>| { }`, okukhiphayo okunendawo `>>~`, okokufaka kokhiye `<<|` ne-`<<|?`
- **Kwengezwe** `>>!` sula isikrini, `>>?` usayizi we-terminal, `@~ N` lala
- **Kwengezwe** Incazelo eshisayo `°x` / `x°`, nokuphinda umbhalo `$*`

### v0.0.4 — Inkomba eqala ku-1 nemisebenzi yekilasi lokuqala _(Ephreli 2026)_

- **Ukuphula** Konke ukukhomba **kuqala ku-1** — `uhlu[1]` into yokuqala
- **Kwengezwe** Imisebenzi enamagama njengamanani ekilasi lokuqala; isintaksi yebhlokhi yomojuli `# igama { }`
- **Kwengezwe** Ukukhomba okunezilinganiso eziningi `uhlu[i>j>k]` nokukhipha okucishe `uhlu[p ; q]`

### v0.0.3 — Izistimu zezinombolo ze-Unicode _(Ephreli 2026)_

- **Kwengezwe** Amabhlokhi angu-69 ezinombolo ze-Unicode netokheni yokushintsha imodi `#d0d9#`
- **Kwengezwe** Izibhalo ze-boolean kunoma iyiphi indlela yokubhala — `#१` / `#०`

### v0.0.2 — Ukuklama kabusha kwe-API yamaqoqo _(Mashi 2026)_

- **Kwengezwe** Umndeni wama-opharetha angu-`$` wamaluhlu nemibhalo
- **Kwengezwe** Ukwabiwa kokwehlukanisa isakhiwo, nezinkomba ezingemihle

### v0.0.1 — Ukukhishwa Kokuqala Komphakathi _(Mashi 2026)_

- Umhumushi ohamba esihlahleni + i-VM yerejista (`--vm`)
- Zonke izakhiwo eziyisisekelo: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Izimpawu zokuhlonza ze-Unicode eziphelele, isistimu yamajuli, ama-lambda, izivalo, ukubhekana namaphutha
- REPL, LSP, isandiso se-VS Code, isifomethi (`zymbol fmt`)

---

_Zymbol-Lang — Iwumqondo. Indawo yonke. Engashintshi._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Ilayisensi:** le ncwadi inelayisensi ngaphansi kwe-[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024-2026 Ithimba le-Zymbol-Lang. Umbhalo ophelele: `LICENSE-CC-BY-SA-4.0` ku-<https://github.com/zymbol-lang/web>. Umhumushi nomshini wesiphequluli (`zymbol.js`) ayimisebenzi ehlukile, enelayisensi ngaphansi kwe-AGPL-3.0-only.
