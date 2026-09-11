> **Panyuwunan:** Dokumen iki digawé lan diterjemahaké déning kecerdasan buatan (AI).
>
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
>
> Referensi kanonik yaiku **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** ing repositori interpreter.

---

# Manual Zymbol-Lang

> **Dideleng kanggo v0.0.9 — 2026-09-07**

**Zymbol-Lang** yaiku basa pamrograman simbolis. Ora ana tembung ing gramatika — saben konstruksi yaiku tandha. Makarya padha ing basa manungsa apa waé.

- Ora ana `if`, `while`, `return` — mung `?`, `@`, `<~`
- Unicode jangkep — pengenal ing basa apa waé utawa emoji
- Ora gumantung basa manungsa — kode padha ing ngendi waé

**Versi interpreter**: v0.0.9 | **Cakupan tes**: 660/666 (telung mesin sarujuk, 0 béda)

---

## Variabel lan Konstanta

```zymbol
x = 10              // variabel sing bisa diowahi
PI := 3.14159       // konstanta — owah manèh iku kesalahan runtime
jeneng = "Budi"
aktif = #1          // boolean bener
👋 := "Sugeng rawuh"
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

`°` (tandha derajat, U+00B0) otomatis miwiti variabel marang nilai netral nalika dienggo sepisanan:

```zymbol
angka = [3, 1, 4, 1, 5]
@ n:angka {
    °total += n
}
>> total ¶              // → 14
```

> `°variabel` (ater-ater) jangkar ing ndhuwur puteran — asil bisa diwaca sawisé `@`.
> `variabel°` (panambang) jangkar ing jero puteran — mati nalika puteran rampung.

Pratelan sing mung jeneng maca variabel lan mbuwang nilai, mula ngélingaké:

```zymbol
itung = 5
itung
```

Compiler ngélingaké kaya mengkene (pesené tansah nganggo basa Inggris):

```text
warning: this statement does nothing: 'itung' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

Tegesé: *«pratelan iki ora nindakaké apa-apa: 'itung' diwaca lan dibuwang»*.

---

## Tipe Data

| Tipe | Literal | Tag `#?` | Cathetan |
|------|---------|----------|----------|
| Wilangan bulat | `42`, `-7` | `###` | Wilangan aman: ±(2⁵³ − 1) |
| Wilangan pecahan | `3.14`, `1.5e10` | `##.` | IEEE-754 dobel |
| Tembung | `"teks"` | `##"` | Interpolasi: `"Sugeng {jeneng}"` |
| Aksara | `'A'` | `##'` | Siji titik kode Unicode |
| Boolean | `#1`, `#0` | `##?` | DUDU wilangan — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Siji tipe, dipriksa |
| Campuran katulis | `#[1, "loro"]` | `##[` | Tipe padha `[…]`, ora dipriksa |
| Tupel | `(a, b)` | `##)` | Posisional, ora bisa owah |
| Kamus | `#(x: 1, y: 2)` | `##(` | Kanthi kunci, bisa owah |
| Fungsi | rujukan fungsi kajeneng | `##()` | Kelas kapisan; nuduhaké `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Kelas kapisan; nuduhaké `<lambd/N>` |
| Unit | `##_` | `##_` | Ora ana — ora ana null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(x: 1)#? ¶          // → (##(, 1, #(x: 1))
```

Wilangan bulat sing metu saka jangkoan aman iku kesalahan sing bisa dicekel, dudu bunderan meneng:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "njaba jangkoan" ¶ // → njaba jangkoan
}
```

`##_` yaiku cara program takon apa ana sing ora ana:

```zymbol
ora_ana() { }
nilai = ora_ana()
>> (nilai == ##_) ¶     // → #1
```

---

## Output lan Input

```zymbol
jeneng = "Budi"
total = 3
>> "Sugeng rawuh" ¶             // → Sugeng rawuh
>> "a=" jeneng " b=" total ¶ // → a=Budi b=3
>> total#? ¶            // → (###, 1, 3)
```

```zymbol
<< jeneng
<< "Lebokna jenengmu: " jeneng
<< ###(4) "Umur: " umur
```

**Delengen wujudé loro tandha.** `>>` nuding metu: njupuk data metu saka program. `<<` nuding mlebu: nggawa data mlebu program. Ora ana sing kudu diéling-éling — panah nuduhaké arah informasi lumaku, lan gagasan padha bali ing saben tandha sing ngobahaké apa-apa.

> `¶` lan `\\` iku baris anyar sing padha. `>>` ora tau nambah siji.
> Penentu tipe sadurunge prompt validasi nalika maca lan takon manèh nganti nilai bener:
> `##.` Wilangan pecahan · `##.(T,D)` desimal · `###(N)` Wilangan bulat · `##"(N)" teks · `##'` siji Aksara.

Ing tingkat paling dhuwur file, `<~` iku status metu program:

```zymbol
>> "mriksa" ¶      // → mriksa
<~ 0
```

---

## Primitif TUI

Operator antarmuka terminal kanggo program interaktif. Akèh-akèhé mbutuhaké blok `>>| { }` (layar alternatif + mode mentah).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Mlaku"
    @~ 1000
    >>~ (2, 1) > "Rampung."
}
```

```zymbol
>>| {
    [baris, kolom] = >>?
    >>~ (1, 1) > "Terminal: " baris " x " kolom
    <<| tombol
    >>~ (2, 1) > "Dipencet: " tombol
}
```

Ing kéné kowé bisa weruh ngapa tandha digabung dudu dipingaké. Kowé wis ngerti yèn `<<` iku input lan `?` takon tanpa komitmen. Mung siji tandha anyar:

- `|` iku **siji unit**, dudu kabèh aliran.

Kanthi iku, loro operator keyboard maca dhéwé:

```text
<<        |             ?
input     siji unit     tanpa komitmen

<<|   njupuk SIJI tombol, lan ngentèni nganti ana siji
<<|?  deleng apa ana tombol, lan terus yèn ora ana
```

Padha ing sisih liya: `>>` ngirim, `>>!` ngirim **kanthi peksa** (mbusak kabèh layar), déné `>>?` **takon** tinimbang nulis (sepira gedhéné terminal). Tandha ing sisih tengen iku sing ngowahi mode, lan tansah teka pungkasan.

> `>>!` mbusak layar. `>>?` mbalèkaké `[baris, kolom]`. `@~ N` turu N milidetik.
> `<<|` maca siji pencetan tombol (ngalangi); `<<|?` nliti tanpa ngalangi (`'\0'` yèn ora ana).
> Tombol panah teka didekode minangka `'↑' '↓' '←' '→'`; ESC iku titik kode 27.
> Tupel output posisional: `(baris, kolom, BKS, ngarep, mburi)` — sembarang slot bisa diilangi nganggo koma (`>>~ (,,, 196) > "abang"`).
> Masker BKS: `1`=Kandel, `2`=Miring, `4`=Garis ngisor. Palet ANSI 256 werna (`0`=standar terminal).

---

## Operator

```zymbol
a = 10
b = 3
asil1 = a + b    // 13
asil2 = a - b    // 7
asil3 = a * b    // 30
asil4 = a / b    // 3  (pambagian wilangan bulat)
asil5 = a % b    // 1
asil6 = a ^ b    // 1000
```

```zymbol
a = 10
b = 3
bandhing1 = a == b    // #0
bandhing2 = a <> b    // #1
bandhing3 = a < b     // #0
bandhing4 = a >= b    // #1
logika1 = #1 && #0  // #0
logika2 = !#1       // #0
```

> `==` ora tau meksa: `"5" == 5` iku `#0`. Urutan meksa: `"5" > 4` iku `#1`, lan `"४२" > 5` uga — teks wilangan ing salah siji saka 69 aksara mbandhingaké minangka wilangan.
> Fungsi mung padha karo awaké dhéwé, ora tau padha karo fungsi liya kanthi awak padha.

---

## Tembung

```zymbol
jeneng = "Budi"
n = 42
>> "Sugeng " jeneng " kowé duwé " n ¶ // → Sugeng Budi kowé duwé 42
katrangan = "Sugeng {jeneng}, kowé duwé {n}"
>> katrangan ¶              // → Sugeng Budi, kowé duwé 42
```

```zymbol
s = "Sugeng donya"
dawa = s$#                  // 12
sisih = s$[1..6]             // "Sugeng"
ana = s$? "donya"          // #1
bagean = "a,b,c,d"$/ ','    // [a, b, c, d]
ganti = s$~~["o":"0"]        // "Sugeng d0nya"
garis = "─" $* 20
```

> `+` mung kanggo wilangan. Kanggo tembung nganggo jejeran utawa interpolasi.
> `\{` lan `\}` iku kurung kriting literal — uwal simetris.

---

## Aliran Kontrol

```zymbol
x = 7
? x > 100 {
    >> "gedhé" ¶
} _? x > 0 {
    >> "positif" ¶     // → positif
} _ {
    >> "negatif" ¶
}
```

Ing kéné ana loro tandha anyar, lan katelu sing teka saka nggabungaké:

- `?` iku **takon**: mbukak kondisi.
- `_` iku **sing ora ditemtokaké**: cabang sing isih ana nalika ora ana pitakonan sing cocog.
- `_?` iku loro bebarengan: *yèn ora ana sing cocog, takon manèh*.

Mulané `_?` ditulis kaya ngono. Iku dudu tandha anyar kanggo disinaoni — iku `_` diterusaké `?`, lan tegesé persis apa sing dikarepaké loro bagéané, diwaca kanthi urutan.

> Kurung kriting `{ }` **wajib** sanajan mung siji pratelan.

---

## Pencocogan

```zymbol
skor = 85
biji = ?? skor {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> biji ¶              // → B
```

```zymbol
suhu = -5
kahanan = ?? suhu {
    < 0  => "es"
    < 20 => "adhem"
    _    => "panas"
}
>> kahanan ¶              // → es
```

Kowé wis ngerti yèn `?` iku "takon". **`??` iku takon ping pira waé**: ping pindho tandha, ing ngendi waé ing basa, yaiku nindakaké ping pira waé apa sing ditindakaké tandha sepisan. Siji `?` nguji siji kondisi; `??` nguji marang dhaptar kasus.

Alternatif digabung nganggo `||`, lan bisa nyampur jinis pola:

```zymbol
tombol = 'P'
tumindak = ?? tombol {
    'p' || 'P' => "ngendheg"
    < 0 || > 100 => "njaba jangkoan"
    _ => "dilirwakaké"
}
>> tumindak ¶             // → ngendheg
```

---

## Puteran

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
woh = ["apel", "pear", "anggur"]
@ w:woh { >> w " " }
>> ¶                    // → apel pear anggur
@ c:"Sugeng" { >> c "-" }
>> ¶                    // → S-u-g-e-n-g-
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
itung = 0
@:njaba {
    itung++
    ? itung >= 3 { @:njaba! }
}
>> itung ¶             // → 3
```

`@` iku tandha **wektu**: kabèh sing mbalèni manggon ing kono. Kanggo ngethok wektu iku kowé nambah tandha ing sandhingé:

- `@!` — `!` iku **peksa**: metu saka puteran saiki.
- `@>` — `>` nyurung maju: pindhah menyang puteran sabanjuré.
- `@:njaba!` — `:` **ngiket jeneng**, mula iki ngethok puteran sing *kajeneng* njaba, dudu sing paling cedhak.

Telung operator, lan ora ana sing kudu diéling-éling kapisah: iku `@` ditambah tandha sing wis ngomong apa sing ditindakaké.

> **Penentu iku cacah utawa kondisi.** `Wilangan bulat` iku cacah, dievaluasi sepisan — `@ 0` nglakokaké awak nol ping. Kabèh liyané iku kondisi. Ora ana kabeneran: `@ []` lan `@ 3.5` ditolak. Kanggo njelajahi kolèksi nganggo `@ x:item`; kanggo ngetung, `@ item$#`.

---

## Fungsi

```zymbol
tambah(a, b) { <~ a + b }
>> tambah(3, 4) ¶        // → 7
```

```zymbol
faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶       // → 120
```

Fungsi maca variabel file kanthi nilai, lan tulisan ing jero tetep ing jero:

```zymbol
wates = 100
ing_jero(n) { <~ n < wates }
>> ing_jero(42) ¶         // → #1
```

Loro tandha ngowahi iku, lan loro-loroné ditulis **ing tandha tangan lan ing papan panggonan panggunan**:

```zymbol
tambah_itung(itung<~) { itung = itung + 1 }
total = 0
tambah_itung(total<~)
>> total ¶              // → 1
```

> `p~` iku salinan karya — awak bisa nemtokaké manèh lan sing ngundang ora kena.
> `p<~` iku parameter output — owah-owahan bali. `tambah_itung(total)` tanpa tandha iku kesalahan semantik: anotasi lan tandha tangan ora bisa pisah.

---

## Lambda lan Penutup

```zymbol
ping_pindho = x -> x * 2
jumlah = (a, b) -> a + b
>> ping_pindho(5) ¶          // → 10
>> jumlah(3, 7) ¶          // → 10
```

```zymbol
klasifikasi = x -> {
    ? x > 0 { <~ "positif" }
    _? x < 0 { <~ "negatif" }
    <~ "nol"
}
>> klasifikasi(-4) ¶         // → negatif
```

```zymbol
faktor = 3
ping_telu = x -> x * faktor
>> ping_telu(7) ¶          // → 21
```

```zymbol
gawe_penambah(n) { <~ x -> x + n }
tambah10 = gawe_penambah(10)
>> tambah10(5) ¶           // → 15
```

Lambda bisa ora njupuk parameter babar pisan:

```zymbol
wangsulan = () -> 42
>> wangsulan() ¶           // → 42
```

> Lambda nyekel variabel file **nalika digawé**; fungsi kajeneng maca mau **nalika diundang**.

---

## Array

```zymbol
arr = [1, 2, 3, 4, 5]
>> arr[1] ¶       // → 1   indeksasi 1-basis
>> arr[-1] ¶      // → 5   negatif ngetung saka mburi
>> arr$# ¶        // → 5   dawa
```

```zymbol
arr = [1, 2, 3]
>> (arr$+ 6) ¶          // → [1, 2, 3, 6]   tambah
>> (arr$+[2] 99) ¶      // → [1, 99, 2, 3]  lebokna ing posisi 2
>> (arr$- 3) ¶          // → [1, 2]         busak kedadéyan kapisan
>> (arr$-[1]) ¶         // → [2, 3]         busak ing indeks 1
>> (arr$[1..2]) ¶       // → [1, 2]         irisan, loro pucuk kalebu
>> (arr$? 3) ¶          // → #1             ngandhut
```

Kabèh diwiwiti `$`, tandha **kolèksi**, lan diterusaké tandha sing ngomong apa sing ditindakaké ing kono: `#` pira, `+` tambah, `-` busak, `?` takon apa ana. Lan kaya `??`, ping pindho tandha tegesé nindakaké kanthi tuntas: `$?` takon *apa* ana nilai, `$??` takon *ing pira panggonan* lan mbalèkaké kabèh.

```zymbol
arr = [3, 1, 2]
>> (arr$^+) ¶     // → [1, 2, 3]   munggah
>> (arr$^-) ¶     // → [3, 2, 1]   mudhun
```

**Aturan asil.** Siji operator, lan apa sing ditindakaké kode sakubengé nemtokaké: yèn dienggo, iku **mbangun** lan ninggalaké asli; yèn dibuwang, iku **ngowahi**.

```zymbol
arr = [1, 2, 3]
salinan = arr[2]$~ 99
>> arr ¶                // → [1, 2, 3]
>> salinan ¶              // → [1, 99, 3]
arr[2]$~ 99
>> arr ¶                // → [1, 99, 3]
```

> **`=` ora tau nulis ing kolèksi.** `arr[2] = 99` dudu wujud Zymbol — `=` mènèhi nilai marang **JENENG**. Ngowahi bagéan kolèksi iku `$~`, ing saben kolèksi.

`[…]` ngandhut siji tipe lan dipriksa; campuran sing disengaja **katulis** nganggo `#[…]`:

```zymbol
campuran = #[1, "loro", #1]
>> campuran ¶             // → [1, loro, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Indeksasi Multi-dimensi

`>` mudhun ing struktur bersarang. Siji klompok kurung ngalamat siji unsur, sepira jerone.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   baris 2, kolom 3
>> m[-1>-1] ¶      // → 9   baris pungkasan, kolom pungkasan
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          rata: diagonal
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   terstruktur: pojok
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` **dudu** wujud Zymbol. Indeks rante ditolak kanggo maca lan nulis — siji klompok kurung saben aksès, lan `>` iku sing lumaku ing antaraning langkah.

---

## Kamus

Tupel kanthi lapangan kajeneng iku kamus, lan wiwit v0.0.9 ditulis `#(…)`.

```zymbol
wong = #(jeneng: "Budi", umur: 25)
>> wong.jeneng ¶        // → Budi
>> wong["umur"] ¶    // → 25
```

```zymbol
wong = #(jeneng: "Budi", umur: 25)
lapangan = "jeneng"
>> wong[lapangan] ¶     // → Budi
```

Iku bisa owah, kunci bisa ditambah, lan bisa dijelajahi:

```zymbol
stok = #(pear: 4)
stok["apel"]$~ 10
@ k:stok { >> k "=" stok[k] " " }
>> ¶                    // → pear=4 apel=10
```

```zymbol
stok = #(pear: 4, apel: 10)
@ (k, v):stok { >> k ":" v " " }
>> ¶                    // → pear:4 apel:10
```

> `#()` iku kamus kosong, sing `()` ora bisa dadi — iku kudu dadi tupel kosong uga. `(x: 1)` gundhul ditolak karo pesen iki: *a dictionary is written `#(…)`* — «kamus ditulis `#(…)`».
> Kamus dialamataké kanthi kunci, ora tau kanthi posisi, mula `wong[1]` iku kesalahan.

---

## Tupel

Tupel iku wadhah terurut **ora bisa owah** sing ngandhut nilai saka tipe béda.

```zymbol
titik = (10, 20)
>> titik[1] ¶           // → 10
data = (42, "Sugeng", #1, 3.14)
>> data[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Sembarang upaya ngowahi tupel ing panggonané iku kesalahan, operator apa waé — ora bisa owah iku properti nilai, dudu pangecualian ing saben `$`.

---

## Destrukturisasi

```zymbol
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
arr = [10, 20, 30, 40, 50]
[kapisan, *sisa] = arr
>> kapisan ¶            // → 10
>> sisa ¶              // → [20, 30, 40, 50]
```

```zymbol
titik = (100, 200)
(px, py) = titik
>> px " " py ¶          // → 100 200
```

```zymbol
wong = #(jeneng: "Ani", umur: 25)
#(jeneng: n, umur: u) = wong
>> n " " u ¶            // → Ani 25
```

> Wujud kurung iku katulis: `[…]` njupuk array, `(…)` tupel, `#(…)` kamus. Jeneng pungkasan **nyerep sisa**, mula destrukturisasi ora tau gagal amarga dawa — `(a, b, c) = (1,2,3,4,5)` mènèhi `c = (3,4,5)`, lan `##_` nalika ora ana sing isih.

---

## Fungsi Orde Dhuwur

```zymbol
angka = [1, 2, 3, 4, 5]
>> (angka$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (angka$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (angka$< (0, (akum, x) -> akum + x)) ¶ // → 15
```

```zymbol
angka = [1, 2, 3, 4, 5, 6]
ping_pindho(x) { <~ x * 2 }
gedhé(x) { <~ x > 3 }
>> (angka$> ping_pindho) ¶    // → [2, 4, 6, 8, 10, 12]
>> (angka$| gedhé) ¶    // → [4, 5, 6]
```

```zymbol
basis = [#(jeneng: "Carla", umur: 28), #(jeneng: "Ani", umur: 25)]
miturut_umur = basis$^ (a, b -> a.umur < b.umur)
>> miturut_umur[1].jeneng ¶     // → Ani
```

> Fungsi kajeneng menyang HOF **tanpa kurung**: `angka$> ping_pindho`. Nulis `angka$> (ping_pindho)` iku kesalahan parsing, amarga `(` mbukak lambda.

---

## Operator Pipa

```zymbol
ping_pindho = x -> x * 2
tambah = (a, b) -> a + b
tambah_siji = x -> x + 1
>> (5 |> ping_pindho(_)) ¶    // → 10
>> (10 |> tambah(_, 5)) ¶  // → 15
>> (5 |> ping_pindho(_) |> tambah_siji(_)) ¶ // → 11
```

---

## Penanganan Kesalahan

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "pambagian karo nol" ¶  // → pambagian karo nol
} :! {
    >> "liya: " _err ¶
} :> {
    >> "tansah mlaku" ¶        // → tansah mlaku
}
```

| Jinis | Nalika |
|------|------|
| `##Div` | Pambagian karo nol |
| `##Index` | Indeks njaba wates |
| `##Key` | Kunci ora ana ing kamus |
| `##Range` | Njaba jangkoan wilangan aman |
| `##Type` | Tipe ora cocog |
| `##Parse` | Parsing data |
| `##IO` | File / sistem |
| `##Network` | Kesalahan jaringan |
| `##DB` | Basis data |
| `##Time` | Tanggal sing ora ana |
| `##_` | Sembarang kesalahan (nyekel kabèh) |

`!` iku tandha **kesalahan lan peksa**, lan diwaca padha ing loro kulawarga: `$!` takon nilai apa iku kesalahan; `$!!`, kanthi tandha ping pindho, nyebaraké munggah tanpa takon.

> Gagal pustaka standar bali minangka **nilai kesalahan alus** sing kowé uji nganggo `$!` utawa cekel nganggo `!?`, tinimbang mbatalaké. `$!!` nyebaraké siji menyang sing ngundang.

---

## Modul

```zymbol
# kalk {
    #> { tambah, PI }

    PI := 3.14159
    tambah(a, b) { <~ a + b }
}
```

```zymbol
<# ./kalk => c

>> c::tambah(5, 3) ¶
>> c.PI ¶
```

```zymbol
# pustaka_ku {
    #> { tambah_jero => jumlah }

    tambah_jero(a, b) { <~ a + b }
}
```

Loro tandha modul iku gagasan padha, saiki ditrapaké ing file: `#` iku tingkat **pranyatan** — apa sing *dadi*, dudu nilai — lan panah ngomong arah kode lumaku:

```text
<#   panah mlebu: impor, njupuk saka file liya
#>   panah metu: ekspor, mènèhi marang file liya
```

Tandha arah tansah lungguh ing pinggir sing madhep arah sing ditunjuk. Iki alesan padha `<~` bali ngiwa (metu saka fungsi) lan `->` mlebu nengen (menyang awak lambda).

> **Modul nyatakaké apa sing diekspor.** Blok `#>` wajib — ngilangaké iku **E014**, lan `#> { }` iku cara modul ngomong yèn lumahé kosong. `::` ngundang fungsi, `.` maca konstanta. Mung impor, blok ekspor, wiwitan literal lan definisi fungsi bisa katon ing awak modul; apa waé sing bisa dieksekusi iku **E013**.

---

## Pustaka Standar

Modul asli, diimpor kaya liyané:

| Modul | Fungsi |
|-------|--------|
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

>> t::width("手番") ¶            // → 4   loro glyph, papat kolom
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

dina = T::of(2026, 1, 31)
>> T::format(dina, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(dina, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` ngukur **kolom tampilan**, dudu aksara: CJK lan akèh emoji iku 2 kolom, mula tata tabel nganggo `t::width`, ora tau `$#`.
> Ing `std/time` wayah iku milidetik saka jaman. Ing ngisor sedina iku durasi, saka sedina munggah iku kalèndher — mula sasi tiba ing dina padha ing sasi, diklem. `béda(a, b)` iku `a - b`, mula wayah sing luwih awal dhisik mènèhi wangsulan negatif.

---

## Paket

`.zyp` mbungkus program multi-file dadi siji file portabel. Iku arsip **sumber**, dudu biner, mula lumaku ing ngendi waé biner `zymbol` lumaku.

```bash
zymbol package proyek_ku/ --script main.zy -o proyek_ku.zyp
zymbol run proyek_ku.zyp
```

> Arsip ngandhut manifest (`zyp.toml`) sing nyatakaké skrip entri lan versi mesin sing dibutuhaké. `zymbol run` ngéktrak menyang direktori sementara lan lumaku saka kono, mula kode bisa dibuwang déné apa sing ditulis skrip tiba ing direktori kerja nyata. Playground uga mbukak file `.zyp`.

---

## Mode Wilangan

Zymbol bisa nulis wilangan ing **69 aksara wilangan Unicode** — Devanagari, Arab-India, Thailand, Klingon pIqaD, Kandel Matematika, segmen LCD, lan liya-liyané. Mode iku global kanggo proses lan mengaruhi output; aritmetika ora owah.

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arab-India (U+0660–U+0669)
#๐๙#    // Thailand     (U+0E50–U+0E59)
#09#    // bali menyang ASCII
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

Wilangan saka aksara sing didhukung iku literal sah ing sumber:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Maca simetris — wilangan dimangertèni ing aksara apa waé:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` tansah ASCII, mula `#0` tetep béda visual saka wilangan nol ing saben aksara.
> `#,` lan `#^` uga nulis wilangané ing aksara aktif, lan pemisah ngetutaké — nanging pasangan ora tau kuwalik: `,` nglompokaké lan `.` misahaké, ing saben aksara.

---

## Operator Data

```zymbol
f = ##.42         // menyang Wilangan pecahan
i = ###3.7        // menyang Wilangan bulat, dibunderaké  → 4
t = ##!3.7        // menyang Wilangan bulat, dipotong  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Wilangan pecahan dicithak minangka angka, ora tau minangka eksponen, lan ngeculaké `.0` pungkasan — `##.42` nulis `42` lan tetep Wilangan pecahan, kaya `f#?` nuduhaké.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   aman-gagal: mbalèkaké input tanpa owah
>> ##!'A' ¶        // → 65    titik kode Aksara
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          bunder menyang 2 desimal
>> #!2|pi| ¶       // → 3.14          potong menyang 2 desimal
>> #,|1234567| ¶   // → 1,234,567     pemisah éwonan
>> #^|12345.678| ¶ // → 1.2345678e4   notasi ilmiah
```

```zymbol
>> 0x41 ¶        // → A   heksadesimal
>> 0b01000001 ¶  // → A   biner
>> 0o101 ¶       // → A   oktal
>> 0d65 ¶        // → A   desimal
```

> Literal basis ing jangkoan ASCII iku **Aksara**: `0d65 == 'A'` iku `#1`, lan `0d65 == 65` iku `#0`. Papat basis nulis aksara padha.

---

## Integrasi Shell

```zymbol
dina_iki = <\ date +%Y-%m-%d \>
>> "Dina iki: " dina_iki
```

```zymbol
output = </"./sub_skrip.zy"/>
>> output
```

> `<\ … \>` nyekel stdout lan stderr, ngilangaké baris anyar pungkasan.
> `>< args` nyekel argumen baris perintah minangka array tembung.

---

## Conto Jangkep: FizzBuzz

```zymbol
klasifikasi(angka) {
    ? angka % 15 == 0 { <~ "FizzBuzz" }
    _? angka % 3  == 0 { <~ "Fizz" }
    _? angka % 5  == 0 { <~ "Buzz" }
    <~ angka
}

@ i:1..20 { >> klasifikasi(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (siji saben baris)
```

---

## Carané Tandha Gabung

Kowé wis weruh bab padha ing saindhenging manual iki: **operator dudu gambar kanggo diéling-éling, iku sawetara tandha ing saurutan, lan saben mènèhi tegesé.** Saiki kowé wis ngerti kabèh, iki pola jangkep.

Kapisan teka **kita ana ing donya endi**:

| Tandha | Donya | Kowé weruh ing |
|--------|-------|---------------|
| `$` | kolèksi | `$#` `$+` `$?` `$^-` |
| `@` | wektu, apa waé sing mbalèni | `@!` `@>` `@~` |
| `#` | apa sing *dadi*, dudu nilai | `#?` `#(…)` `<#` `#>` |
| `>>` | metu saka program | `>>` `>>!` `>>?` |
| `<<` | mlebu program | `<<` `<<\|` `<<\|?` |
| `?` | takon, tanpa komitmen | `?` `_?` `??` `$?` |
| `!` | peksa, utawa kesalahan | `@!` `$!` `!?` |

Banjur teka **apa sing ditindakaké ing kono**: `+` tambah, `-` busak, `^` urutan, `~` owah, `#` itung, `|` siji unit, `:` iket jeneng.

Lan loro aturan sing ora tau gagal:

**Ping pindho tandha ndadèkaké tuntas.** `?` takon sepisan, `??` nguji akèh kasus. `$?` takon apa nilai ana, `$??` mbalèkaké saben panggonan. `!` nandhani kesalahan, `!!` nyebaraké tanpa takon.

**Tandha mode tansah teka pungkasan.** Nalika `?` utawa `!` katon kanggo ngomong *kepriyé* apa sing ditindakaké — kanthi ragu utawa peksa — iku tandha pungkasan operator: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:njaba!`. Ora ana operasi sawisé iku.

Saka iku metu bab praktis: **kombinasi sing durung tau kowé weruh wis ana tegesé sadurunge kowé nggolèki.** Yèn `$` kolèksi lan `^` urutan lan `-` kuwalik, banjur `$^-` ngurutaké mudhun, lan ora ana sing kudu ngomong.

Ora kabèh inventaris makarya kaya ngono, lan ngomong iku luwih apik tinimbang pura-pura. Akèh operator bubar kanthi resik. Enem bubar nanging tegesé luwih saka bagéané: `!?` `:!` `:>` `|>` `::` `$++`. Lan sepuluh kudu diéling-éling amarga ora bubar babar pisan: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Ngetung sing ora cetha tinimbang nganggep sithik iku sengaja: iku biaya éling-éling nyata basa. Referensi jangkep — inventaris, homograf sing katulis, lan aturan sing kudu dituruti operator anyar supaya ana — ana ing `SYMBOLS.md`, ing repositori interpreter.

---

## Referensi Tandha

| Tandha | Operasi | Tandha | Operasi |
|--------|---------|--------|---------|
| `=` | variabel | `$#` | dawa |
| `:=` | konstanta | `$+` | tambah |
| `>>` | output | `$+[i]` | lebokna ing indeks (1-basis) |
| `<<` | input | `$-` | busak kapisan kanthi nilai |
| `¶` / `\\` | baris anyar | `$--` | busak kabèh kanthi nilai |
| `?` | yèn | `$-[i]` | busak ing indeks (1-basis) |
| `_?` | yèn-ora | `$-[i..j]` | busak jangkoan (1-basis) |
| `_` | yèn-ora / wildcard | `$?` | ngandhut |
| `??` | pencocogan | `$??` | golèki kabèh indeks (1-basis) |
| `\|\|` | pola-utawa ing cabang match | `$[s..e]` | irisan (1-basis) |
| `@` | puteran | `$>` | peta |
| `@ N { }` | puteran N ping | `$\|` | saring |
| `@!` | putus | `$<` | nyuda |
| `@>` | terus | `$/ pemisah` | pisah tembung |
| `@:jeneng { }` | puteran kajeneng | `$++ a b c` | bangun kanthi nyambung |
| `@:jeneng!` | putus jeneng | `$~~[p:r]` | ganti tembung |
| `@:jeneng>` | terus jeneng | `$*` | balèni tembung |
| `->` | lambda | `arr[i]$~ v` | WUJUD panganyaran |
| `<~` | bali / parameter output | `~` | parameter salinan karya |
| `arr[i>j]` | indeks navigasi | `arr[p ; q]` | èkstraksi rata |
| `$^+` | urut munggah | `$^-` | urut mudhun |
| `$^` | urut karo pembanding | `\|>` | pipa |
| `!?` | coba | `:!` | cekel |
| `:>` | pungkasané | `$!` | apa kesalahan |
| `$!!` | sebaraké kesalahan | `#1` / `#0` | bener / salah |
| `##_` | Unit — ora ana | `[…]` | array, siji tipe |
| `#[…]` | array, campuran katulis | `#(…)` | kamus |
| `(…)` | tupel posisional | `#()` | kamus kosong |
| `<#` | impor | `#>` | ekspor |
| `#` | nyatakaké modul | `::` | undang modul |
| `.` | aksès lapangan / konstanta | `#?` | metadata tipe |
| `#\|..\|` | parsing wilangan | `##.` | owahi menyang Wilangan pecahan |
| `###` | owahi menyang Wilangan bulat (bunder) | `##!` | owahi menyang Wilangan bulat (potong) |
| `#.N\|..\|` | bunder | `#!N\|..\|` | potong |
| `#,\|..\|` | pemisah éwonan | `#^\|..\|` | ilmiah |
| `#d0d9#` | ganti mode wilangan | `#09#` | bali menyang ASCII |
| `<\ ..\>` | lakokaké shell | `><` | argumen CLI |
| `\ var` | rusak variabel | `°x` / `x°` | definisi panas |
| `>>\|` | blok TUI (layar alternatif) | `>>~` | output posisional |
| `>>!` | busak layar | `>>?` | takon ukuran terminal |
| `<<\|` | pencetan tombol ngalangi | `<<\|?` | pencetan tombol ora ngalangi |
| `@~ N` | turu N milidetik | `0d` `0x` `0o` `0b` | literal basis |

---

## Cathetan Owah-owahan

### v0.0.9 — Kolèksi Mutusaké _(September 2026)_

- **Ngrusak** Kamus duwé notasi dhéwé: `#(kunci: nilai)`. `(x: 1)` gundhul ditolak, lan `#()` iku kamus kosong — sing `()` ora bisa dadi
- **Ngrusak** Penugasan indeks ditarik: `arr[i] = v` lan kabèh wujud gabungan. `=` mènèhi nilai marang **JENENG**; ngowahi bagéan kolèksi iku `$~`
- **Ngrusak** Indeks rante `m[i][j]` ditolak kanggo maca lan nulis — `>` iku sing lumaku ing antaraning langkah
- **Ngrusak** Modul kudu nyatakaké apa sing diekspor (**E014**); `#> { }` iku cara modul ngomong yèn lumahé kosong
- **Ngrusak** Penentu puteran iku cacah utawa kondisi — ora ana kabeneran. `@ []` lan `@ 3.5` ditolak
- **Ditambah** `##_` — literal Unit, lan cara program takon apa ana sing ora ana
- **Ditambah** `#[…]` — array sing campuran tipe unsaré katulis
- **Ditambah** `#?` mbédakaké papat kolèksi: `##]` `##[` `##)` `##(`
- **Ditambah** `std/time` — jam lan kalèndher sipil, kanthi zona lan aritmetika kalèndher
- **Ditambah** `<~>` ing tingkat paling dhuwur iku status metu program
- **Ditambah** `@ (k, v):pasangan` — pola ing sirah puteran
- **Ditambah** `#|c|` maca wilangan ing salah siji saka 69 aksara; `#,` lan `#^` nulis ing aksara aktif
- **Diowahi** `Wilangan bulat` iku wilangan aman, ±(2⁵³ − 1), tutup-gagal ing saben mesin
- **Diowahi** Fungsi kajeneng maca variabel file nalika diundang, kanthi nilai
- **Diowahi** Pratelan sing mung maca jeneng ngélingaké tinimbang liwat meneng
- **Mesin** 660 saka 666 file korpus sarujuk ing telung mesin, 0 béda

### v0.0.8 — Auto-mbebasaké, `std/term` lan Paket _(Agustus 2026)_

- **Ditambah** Pangrusakan otomatis nalika dienggo pungkasan — ora katon; mung nyuda memori puncak
- **Ditambah** `std/term` — metrik tampilan ing kolom terminal
- **Ditambah** `##!` ing `Aksara` — titik kode Unicode
- **Ditambah** Pola-utawa ing match: `'p' || 'P' => …`, alternatif saka jinis apa waé ing siji cabang
- **Ditambah** Paket Zymbol (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Ditambah** `<~>` ing papan panggunan wajib nalika sing diundang nyatakaké parameter output
- **Didandani** Paritas sistem modul ing VM register

### v0.0.7 — Pustaka Standar Asli _(Juli 2026)_

- **Ditambah** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — kabèh kanthi nilai kesalahan alus
- **Ditambah** Input katulis/diverifikasi: `<< ##.(5,2) "regi: " p`
- **Ditambah** Operator panambang langsung ing `>>` — ora perlu kurung
- **Diowahi** Formatter tutup-gagal: nolak nulis output sing ora bisa diwaca manèh

### v0.0.6 — Panyempurnaan lan Pustaka Ilmiah _(Juni 2026)_

- **Ngrusak** `=>` ngganti `:` ing cabang match lan `<=` ing alias impor/ekspor
- **Ditambah** `std/math` lan `std/random`
- **Ditambah** Panganyaran kamus kanthi kunci: `d["k"]$~ nilai`

### v0.0.5 — Primitif TUI lan Definisi Panas _(Mei 2026)_

- **Ditambah** Blok TUI `>>| { }`, output posisional `>>~`, input tombol `<<|` lan `<<|?`
- **Ditambah** `>>!` busak layar, `>>?` ukuran terminal, `@~ N` turu
- **Ditambah** Definisi panas `°x` / `x°`, lan balèni tembung `$*`

### v0.0.4 — Indeksasi 1-basis lan Fungsi Kelas Kapisan _(April 2026)_

- **Ngrusak** Kabèh indeksasi **1-basis** — `arr[1]` iku unsur kapisan
- **Ditambah** Fungsi kajeneng minangka nilai kelas kapisan; sintaksis blok modul `# jeneng { }`
- **Ditambah** Indeksasi multi-dimensi `arr[i>j>k]` lan èkstraksi rata `arr[p ; q]`

### v0.0.3 — Sistem Wilangan Unicode _(April 2026)_

- **Ditambah** 69 blok wilangan Unicode kanthi token ganti mode `#d0d9#`
- **Ditambah** Literal boolean ing aksara apa waé — `#१` / `#०`

### v0.0.2 — Desain Ulang API Kolèksi _(Maret 2026)_

- **Ditambah** Kulawarga operator `$` kanggo array lan tembung
- **Ditambah** Penugasan destrukturisasi, lan indeks negatif

### v0.0.1 — Rilis Publik Kapisan _(Maret 2026)_

- Interpreter mlaku wit + VM register (`--vm`)
- Kabèh konstruksi inti: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Pengenal Unicode jangkep, sistem modul, lambda, penutup, penanganan kesalahan
- REPL, LSP, ekstensi VS Code, formatter (`zymbol fmt`)

---

_Zymbol-Lang — Simbolis. Universal. Ora Bisa Owah._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Lisensi:** manual iki dilisensi miturut [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024-2026 Zymbol-Lang Team. Teks jangkep: `LICENSE-CC-BY-SA-4.0` ing <https://github.com/zymbol-lang/web>. Interpreter lan mesin browser (`zymbol.js`) iku karya kapisah, dilisensi miturut AGPL-3.0-only.
