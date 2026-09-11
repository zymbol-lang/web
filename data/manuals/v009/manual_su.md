> **Bantahan:** Dokumén ieu dijieun sareng ditarjamahkeun ku kacerdasan jieunan (AI).
>
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
>
> Rujukan kanonik nyaéta **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** dina repositori penerjemah.

---

# Manual Zymbol-Lang

> **Dirévisi pikeun v0.0.9 — 2026-09-07**

**Zymbol-Lang** nyaéta basa pamrograman simbolis. Teu aya kecap dina tata basana — unggal konstruksi mangrupa tanda. Gawéna sarua dina basa manusa naon waé.

- Teu aya `if`, `while`, `return` — ngan `?`, `@`, `<~`
- Unicode pinuh — idéntifikasi dina basa naon waé atawa emoji
- Teu gumantung kana basa manusa — kode sarua di mana waé

**Vérsi penerjemah**: v0.0.9 | **Cakupan tés**: 660/666 (tilu mesin sapuk, 0 béda)

---

## Variabel sareng Konstanta

```zymbol
x = 10              // variabel anu bisa dirobah
PI := 3.14159       // konstanta — nangtukeun deui mangrupa kasalahan runtime
ngaran = "Asep"
aktip = #1          // boolean bener
👋 := "Sampurasun"
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

`°` (tanda darajat, U+00B0) otomatis ngamimitian variabel kana nilai nétralna dina pamakéan munggaran:

```zymbol
angka = [3, 1, 4, 1, 5]
@ n:angka {
    °jumlah += n
}
>> jumlah ¶              // → 14
```

> `°variabel` (awalan) ngalabuh di luhur gelung — hasilna bisa dibaca sanggeus `@`.
> `variabel°` (ahiran) ngalabuh di jero gelung — paéh nalika gelung réngsé.

Pernyataan anu ngan ngaran bakal maca variabel sareng miceun nilaina, jadi méré peringatan:

```zymbol
itung = 5
itung
```

Panyusun méré peringatan saperti kieu (pesenna sok dina basa Inggris):

```text
warning: this statement does nothing: 'itung' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

Hartina: *«pernyataan ieu teu ngalakukeun nanaon: 'itung' dibaca sarta dipiceun»*.

---

## Jinis Data

| Jinis | Literal | Tag `#?` | Catetan |
|------|---------|----------|-------|
| Integer | `42`, `-7` | `###` | Integer aman: ±(2⁵³ − 1) |
| Float | `3.14`, `1.5e10` | `##.` | IEEE-754 ganda |
| String | `"téks"` | `##"` | Interpolasi: `"Sampurasun {ngaran}"` |
| Char | `'A'` | `##'` | Hiji titik kodeu Unicode |
| Boolean | `#1`, `#0` | `##?` | SANÉS angka — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Hiji jinis, dipariksa |
| Campuran diébréhkeun | `#[1, "dua"]` | `##[` | Jinis sarua `[…]`, teu dipariksa |
| Tuple | `(a, b)` | `##)` | Dumasar posisi, teu bisa dirobah |
| Kamus | `#(x: 1, y: 2)` | `##(` | Dumasar konci, bisa dirobah |
| Fungsi | référénsi fungsi dingaranan | `##()` | Kelas kahiji; némbongkeun `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Kelas kahiji; némbongkeun `<lambd/N>` |
| Unit | `##_` | `##_` | Henteuna — teu aya null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(x: 1)#? ¶          // → (##(, 1, #(x: 1))
```

Integer anu kaluar tina rentang aman mangrupa kasalahan anu bisa ditéwak, sanés bungkus jempé:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "di luar rentang" ¶ // → di luar rentang
}
```

`##_` nyaéta cara program nanyakeun naha aya anu henteu:

```zymbol
euweuh() { }
nilai = euweuh()
>> (nilai == ##_) ¶     // → #1
```

---

## Kaluaran sareng Input

```zymbol
ngaran = "Asep"
jumlah = 3
>> "Sampurasun" ¶             // → Sampurasun
>> "a=" ngaran " b=" jumlah ¶ // → a=Asep b=3
>> jumlah#? ¶            // → (###, 1, 3)
```

```zymbol
<< ngaran
<< "Lebetkeun ngaran anjeun: " ngaran
<< ###(4) "Umur: " umur
```

**Tingali wangun dua tanda ieu.** `>>` nunjuk ka luar: nyokot data tina program. `<<` nunjuk ka jero: mawa data kana program. Teu aya anu kudu diapalkeun di dieu — panah némbongkeun arah inpormasi ngalih, sareng ideu anu sarua balik deui dina unggal tanda anu ngalihkeun hiji hal.

> `¶` sareng `\\` mangrupa baris anyar anu sarua. `>>` pernah nambahan hiji.
> Penentu jinis saacan panyungsi ngavalidasi nalika maca sareng nanyakeun deui nepi ka nilaina sah:
> `##.` Float · `##.(T,D)` désimal · `###(N)` Integer · `##"(N)"` téks · `##'` hiji Char.

Dina tingkat luhur hiji file, `<~` nyaéta status kaluar program:

```zymbol
>> "mariksa" ¶      // → mariksa
<~ 0
```

---

## Primitif TUI

Operator antarbeungeut terminal pikeun program interaktif. Kalolobaanana butuh blok `>>| { }` (layar gaganti + modeu atah).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Ngalalakon"
    @~ 1000
    >>~ (2, 1) > "Réngsé."
}
```

```zymbol
>>| {
    [baris, kolom] = >>?
    >>~ (1, 1) > "Terminal: " baris " x " kolom
    <<| kenop
    >>~ (2, 1) > "Diteken: " kenop
}
```

Di dieu anjeun tiasa ningali naha tanda ngahiji tibatan ngalikeun. Anjeun parantos terang yén `<<` téh input sareng `?` nanyakeun tanpa komitmen. Ngan hiji tanda anu anyar:

- `|` mangrupa **hiji unit**, sanés sadayana aliran.

Kalayan éta, kadua operator kibor maca sorangan:

```text
<<        |             ?
input     hiji unit     tanpa komitmen

<<|   candak HIJI kenop, sareng antosan nepi ka aya hiji
<<|?  tingali naha AYA kenop, sareng teruskeun upami teu aya
```

Sarua di sisi séjén: `>>` ngirim, `>>!` ngirim **kalayan kakuatan** (ngabersihkeun sadayana layar), sedengkeun `>>?` **nanyakeun** tibatan nulis (sabaraha gedéna terminal). Tanda di beulah katuhu nyaéta anu ngarobah modeu, sareng sok datang panungtungan.

> `>>!` ngabersihkeun layar. `>>?` mulangkeun `[baris, kolom]`. `@~ N` saré N milisédetik.
> `<<|` maca hiji tekenan kenop (meungpeuk); `<<|?` mariksa tanpa meungpeuk (`'\0'` upami teu aya).
> Kenop panah datang didekodeu salaku `'↑' '↓' '←' '→'`; ESC nyaéta titik kodeu 27.
> Tuple kaluaran diposisi: `(baris, kolom, BKS, hareup, tukang)` — slot naon waé tiasa dileungitkeun ku koma (`>>~ (,,, 196) > "beureum"`).
> Masker bit BKS: `1`=Kandel, `2`=Miring, `4`=Garis handap. Palet ANSI 256 warna (`0`=standar terminal).

---

## Operator

```zymbol
a = 10
b = 3
h1 = a + b    // 13
h2 = a - b    // 7
h3 = a * b    // 30
h4 = a / b    // 3  (pambagian integer)
h5 = a % b    // 1
h6 = a ^ b    // 1000
```

```zymbol
a = 10
b = 3
b1 = a == b    // #0
b2 = a <> b    // #1
b3 = a < b     // #0
b4 = a >= b    // #1
l1 = #1 && #0  // #0
l2 = !#1       // #0
```

> `==` pernah maksa: `"5" == 5` nyaéta `#0`. Urutan maksa: `"5" > 4` nyaéta `#1`, sareng `"४२" > 5` ogé — téks angka dina salah sahiji tina 69 aksara ngabandingkeun salaku angka.
> Fungsi ngan sarua jeung dirina sorangan, pernah sarua jeung fungsi séjén anu boga awak anu sarua.

---

## String

```zymbol
ngaran = "Asep"
n = 42
>> "Sampurasun " ngaran " anjeun boga " n ¶ // → Sampurasun Asep anjeun boga 42
katerangan = "Sampurasun {ngaran}, anjeun boga {n}"
>> katerangan ¶              // → Sampurasun Asep, anjeun boga 42
```

```zymbol
s = "Sampurasun dunya"
panjang = s$#                  // 16
sub = s$[1..7]             // "Sampura"
aya = s$? "dunya"          // #1
bagian = "a,b,c,d"$/ ','    // [a, b, c, d]
ganti = s$~~["a":"o"]        // "Sompurosun dunyo"
garis = "─" $* 20
```

> `+` pikeun angka wungkul. Pikeun string paké penjajaran atawa interpolasi.
> `\{` sareng `\}` mangrupa kurung kurawal literal — éscape simetris.

---

## Aliran Kontrol

```zymbol
x = 7
? x > 100 {
    >> "badag" ¶
} _? x > 0 {
    >> "positip" ¶     // → positip
} _ {
    >> "négatip" ¶
}
```

Di dieu aya dua tanda anyar, sareng anu katilu asalna tina ngahijikeunana:

- `?` nyaéta **nanyakeun**: muka hiji kaayaan.
- `_` nyaéta **anu henteu ditangtukeun**: cabang anu tinggaleun nalika teu aya patarosan anu cocog.
- `_?` nyaéta kadua-duana dina runtuyan: *upami teu aya anu cocog, tanyakeun deui*.

Éta sababna `_?` ditulis kitu. Éta sanés simbol anyar pikeun diajar — éta `_` dituturkeun ku `?`, sareng hartina persis naon anu dimaksud ku dua bagianna, dibaca dina urutan.

> Kurung kurawal `{ }` **wajib** sanajan pikeun hiji pernyataan.

---

## Pencocokan

```zymbol
nilai = 85
peunteun = ?? nilai {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> peunteun ¶              // → B
```

```zymbol
suhu = -5
kaayaan = ?? suhu {
    < 0  => "és"
    < 20 => "tiis"
    _    => "panas"
}
>> kaayaan ¶              // → és
```

Anjeun parantos terang yén `?` téh "nanyakeun". **`??` nyaéta nanyakeun sababaraha kali**: ngalikeun dua tanda, di mana waé dina basa, nyaéta ngalakukeun sababaraha kali naon anu dilakukeun ku tanda sakali. Hiji `?` nguji hiji kaayaan; `??` nguji ngalawan daptar kasus.

Alternatif ngahiji sareng `||`, sareng tiasa nyampurkeun jinis pola:

```zymbol
kenop = 'P'
aksi = ?? kenop {
    'p' || 'P' => "reureuh"
    < 0 || > 100 => "di luar rentang"
    _ => "teu dipalire"
}
>> aksi ¶             // → reureuh
```

---

## Gelung

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
buah = ["apel", "pir", "anggur"]
@ b:buah { >> b " " }
>> ¶                    // → apel pir anggur
@ a:"Sampurasun" { >> a "-" }
>> ¶                    // → S-a-m-p-u-r-a-s-u-n-
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
@:luar {
    itung++
    ? itung >= 3 { @:luar! }
}
>> itung ¶             // → 3
```

`@` nyaéta tanda **waktu**: sagala anu diulang hirup di jerona. Pikeun motong waktos éta anjeun nambahan tanda di sisina:

- `@!` — `!` nyaéta **kakuatan**: kaluar tina gelung ayeuna.
- `@>` — `>` ngadorong ka hareup: pindah ka babak salajengna.
- `@:luar!` — `:` **meungkeut ngaran**, jadi ieu motong gelung anu *dingaranan* luar, sanés anu pangdeukeutna.

Tilu operator, sareng teu aya anu kudu diapalkeun misah: éta téh `@` tambah hiji tanda anu parantos nyarioskeun naon anu dilakukeunana.

> **Penentu mangrupa hitungan atawa kaayaan.** `Integer` mangrupa hitungan, dievaluasi sakali — `@ 0` ngajalankeun awak nol kali. Sagala anu sanés mangrupa kaayaan. Teu aya kabeneran: `@ []` sareng `@ 3.5` ditolak. Pikeun nyilakawan koleksi paké `@ x:item`; pikeun ngitungna, `@ item$#`.

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

Fungsi maca variabel file dumasar nilai, sareng tulisan di jerona tetep di jero:

```zymbol
wates = 100
jero(n) { <~ n < wates }
>> jero(42) ¶         // → #1
```

Dua tanda ngarobah ieu, sareng kadua-duana ditulis **dina tandatangan sareng di tempat panggero**:

```zymbol
tambah_itung(itung<~) { itung = itung + 1 }
jumlah = 0
tambah_itung(jumlah<~)
>> jumlah ¶              // → 1
```

> `p~` mangrupa salinan gawé — awak tiasa nangtukeun deui sareng anu nelepon henteu kaganggu.
> `p<~` mangrupa parameter kaluaran — parobahanana balik. `tambah_itung(jumlah)` tanpa tanda mangrupa kasalahan semantik: anotasi sareng tandatangan teu tiasa papisah.

---

## Lambda sareng Panutupan

```zymbol
dua_kali = x -> x * 2
jumlah = (a, b) -> a + b
>> dua_kali(5) ¶          // → 10
>> jumlah(3, 7) ¶          // → 10
```

```zymbol
klasifikasi = x -> {
    ? x > 0 { <~ "positip" }
    _? x < 0 { <~ "négatip" }
    <~ "nol"
}
>> klasifikasi(-4) ¶         // → négatip
```

```zymbol
faktor = 3
tilu_kali = x -> x * faktor
>> tilu_kali(7) ¶          // → 21
```

```zymbol
jienan_penambah(n) { <~ x -> x + n }
tambah10 = jienan_penambah(10)
>> tambah10(5) ¶           // → 15
```

Lambda tiasa henteu nyandak parameter nanaon:

```zymbol
waleran = () -> 42
>> waleran() ¶           // → 42
```

> Lambda nangkep variabel file **nalika dijieun**; fungsi dingaranan maca aranjeunna **nalika ditelepon**.

---

## Array

```zymbol
array = [1, 2, 3, 4, 5]
>> array[1] ¶       // → 1   indéks dimimitian ti 1
>> array[-1] ¶      // → 5   négatip ngitung ti tungtung
>> array$# ¶        // → 5   panjang
```

```zymbol
array = [1, 2, 3]
>> (array$+ 6) ¶          // → [1, 2, 3, 6]   tambah
>> (array$+[2] 99) ¶      // → [1, 99, 2, 3]  sisipkeun dina posisi 2
>> (array$- 3) ¶          // → [1, 2]         piceun kajadian kahiji
>> (array$-[1]) ¶         // → [2, 3]         piceun dina indéks 1
>> (array$[1..2]) ¶       // → [1, 2]         irisan, kadua tungtung kaasup
>> (array$? 3) ¶          // → #1             ngandung
```

Sadayana dimimitian ku `$`, tanda **koleksi**, sareng diteruskeun ku tanda anu nyarioskeun naon anu dilakukeun di jerona: `#` sabaraha, `+` tambah, `-` piceun, `?` tanyakeun naha aya. Sareng sapertos `??`, ngalikeun dua tanda hartina ngalakukeunana sacara lengkep: `$?` nanyakeun *naha* nilai aya, `$??` nanyakeun *di sabaraha tempat* sareng mulangkeun sadayana.

```zymbol
array = [3, 1, 2]
>> (array$^+) ¶     // → [1, 2, 3]   naék
>> (array$^-) ¶     // → [3, 2, 1]   turun
```

**Aturan hasilna.** Hiji operator, sareng naon anu dilakukeun ku kode di sabudeureunana anu nangtukeun: upami dianggo, éta **ngawangun** sareng ngantunkeun anu asli; upami dipiceun, éta **ngarobah**.

```zymbol
array = [1, 2, 3]
salinan = array[2]$~ 99
>> array ¶                // → [1, 2, 3]
>> salinan ¶              // → [1, 99, 3]
array[2]$~ 99
>> array ¶                // → [1, 99, 3]
```

> **`=` pernah nulis kana koleksi.** `array[2] = 99` sanés wangun Zymbol — `=` méré nilai ka **NGARAN**. Ngarobah bagian tina koleksi nyaéta `$~`, dina unggal koleksi.

`[…]` ngandung hiji jinis sareng dipariksa; campuran anu dihaja **diébréhkeun** sareng `#[…]`:

```zymbol
campuran = #[1, "dua", #1]
>> campuran ¶             // → [1, dua, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Indéks Multi-dimensi

`>` turun kana struktur bersarang. Hiji grup kurung ngébréhkeun hiji unsur, sakumaha jero na.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   baris 2, kolom 3
>> m[-1>-1] ¶      // → 9   baris panungtungan, kolom panungtungan
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          datar: diagonal
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   terstruktur: juru
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` **sanés** wangun Zymbol. Indéks berantéy ditolak pikeun maca sareng nulis — hiji grup kurung per aksés, sareng `>` nyaéta anu ngalih antara léngkah.

---

## Kamus

Tuple sareng widang dingaranan mangrupa kamus, sareng ti v0.0.9 ditulis `#(…)`.

```zymbol
jalma = #(ngaran: "Asep", umur: 25)
>> jalma.ngaran ¶        // → Asep
>> jalma["umur"] ¶    // → 25
```

```zymbol
jalma = #(ngaran: "Asep", umur: 25)
widang = "ngaran"
>> jalma[widang] ¶     // → Asep
```

Éta bisa dirobah, konci bisa ditambah, sareng bisa disilakawan:

```zymbol
stok = #(pir: 4)
stok["apel"]$~ 10
@ k:stok { >> k "=" stok[k] " " }
>> ¶                    // → pir=4 apel=10
```

```zymbol
stok = #(pir: 4, apel: 10)
@ (k, v):stok { >> k ":" v " " }
>> ¶                    // → pir:4 apel:10
```

> `#()` mangrupa kamus kosong, anu `()` teu tiasa janten — éta kedah janten tuple kosong ogé. `(x: 1)` taranjang ditolak sareng pesen ieu: *a dictionary is written `#(…)`* — «kamus ditulis `#(…)`».
> Kamus dialamatkeun ku konci, pernah ku posisi, jadi `jalma[1]` mangrupa kasalahan.

---

## Tuple

Tuple mangrupa wadah anu kasebutan **teu bisa dirobah** anu nyimpen nilai tina rupa-rupa jinis.

```zymbol
titik = (10, 20)
>> titik[1] ¶           // → 10
data = (42, "Sampurasun", #1, 3.14)
>> data[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Sagala usaha pikeun ngarobah tuple di tempatna mangrupa kasalahan, naon waé operatorna — teu bisa dirobah mangrupa sipat nilai, sanés pangecualian di jero unggal `$`.

---

## Déstrukturisasi

```zymbol
array = [10, 20, 30, 40, 50]
[a, b, c] = array
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
array = [10, 20, 30, 40, 50]
[kahiji, *sésana] = array
>> kahiji ¶            // → 10
>> sésana ¶              // → [20, 30, 40, 50]
```

```zymbol
titik = (100, 200)
(px, py) = titik
>> px " " py ¶          // → 100 200
```

```zymbol
jalma = #(ngaran: "Siti", umur: 25)
#(ngaran: n, umur: u) = jalma
>> n " " u ¶            // → Siti 25
```

> Wangun kurung ditaip: `[…]` nyandak array, `(…)` tuple, `#(…)` kamus. Ngaran panungtungan **nyerep sésana**, jadi déstrukturisasi pernah gagal dina panjang — `(a, b, c) = (1,2,3,4,5)` méré `c = (3,4,5)`, sareng `##_` nalika teu aya anu tinggaleun.

---

## Fungsi Tingkat Luhur

```zymbol
angka = [1, 2, 3, 4, 5]
>> (angka$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (angka$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (angka$< (0, (kumpul, x) -> kumpul + x)) ¶ // → 15
```

```zymbol
angka = [1, 2, 3, 4, 5, 6]
dua_kali(x) { <~ x * 2 }
badag(x) { <~ x > 3 }
>> (angka$> dua_kali) ¶    // → [2, 4, 6, 8, 10, 12]
>> (angka$| badag) ¶    // → [4, 5, 6]
```

```zymbol
dasar = [#(ngaran: "Carla", umur: 28), #(ngaran: "Siti", umur: 25)]
dumasar_umur = dasar$^ (a, b -> a.umur < b.umur)
>> dumasar_umur[1].ngaran ¶     // → Siti
```

> Fungsi dingaranan asup ka HOF **tanpa kurung**: `angka$> dua_kali`. Nulis `angka$> (dua_kali)` mangrupa kasalahan parsing, sabab `(` muka lambda.

---

## Operator Pipa

```zymbol
dua_kali = x -> x * 2
tambah = (a, b) -> a + b
inc = x -> x + 1
>> (5 |> dua_kali(_)) ¶    // → 10
>> (10 |> tambah(_, 5)) ¶  // → 15
>> (5 |> dua_kali(_) |> inc(_)) ¶ // → 11
```

---

## Penanganan Kasalahan

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "pambagian ku nol" ¶  // → pambagian ku nol
} :! {
    >> "séjénna: " _err ¶
} :> {
    >> "sok dijalankeun" ¶        // → sok dijalankeun
}
```

| Jinis | Iraha |
|------|------|
| `##Div` | Pambagian ku nol |
| `##Index` | Indéks di luar wates |
| `##Key` | Konci teu aya dina kamus |
| `##Range` | Di luar rentang integer aman |
| `##Type` | Jinis teu cocog |
| `##Parse` | Parsing data |
| `##IO` | File / sistim |
| `##Network` | Kasalahan jaringan |
| `##DB` | Basis data |
| `##Time` | Tanggal anu teu aya |
| `##_` | Kasalahan naon waé (nyekep sadayana) |

`!` mangrupa tanda **kasalahan sareng kakuatan**, sareng dibaca sarua dina kadua kulawarga: `$!` nanyakeun ka nilai naha éta kasalahan; `$!!`, kalayan tanda ganda, nyebarkeunana ka luhur tanpa nanyakeun.

> Kagagalan pustaka standar balik salaku **nilai kasalahan lemes** anu anjeun uji sareng `$!` atanapi tangkep sareng `!?`, tibatan ngabatalkeun. `$!!` nyebarkeun hiji ka anu nelepon.

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
<# ./kalk => k

>> k::tambah(5, 3) ¶
>> k.PI ¶
```

```zymbol
# pustaka_abdi {
    #> { jero_tambah => jumlah }

    jero_tambah(a, b) { <~ a + b }
}
```

Dua tanda modul nyaéta ideu anu sarua, ayeuna dilarapkeun ka file: `#` nyaéta tingkat **ébréhan** — naon hiji hal *nyaéta*, sanés nilaina — sareng panah nyarioskeun arah anu dituju ku kode:

```text
<#   panah asup: impor, bawa ti file séjén
#>   panah kaluar: ékspor, tawarkeun ka file séjén
```

Tanda arah sok diuk di sisi anu nyanghareup ka arah anu ditunjukna. Ieu alesan anu sarua naha `<~` balik ka kénca (kaluar tina fungsi) sareng `->` asup ka katuhu (kana awak lambda).

> **Modul ngébréhkeun naon anu diéksporna.** Blok `#>` wajib — ninggalkeunana mangrupa **E014**, sareng `#> { }` nyaéta cara modul nyarios yén beungeutna kosong. `::` nyauran fungsi, `.` maca konstanta. Ngan impor, blok ékspor, panyimpenan literal sareng harti fungsi anu tiasa muncul dina awak modul; naon waé anu tiasa dilaksanakeun nyaéta **E013**.

---

## Pustaka Standar

Modul asli, diimpor sapertos anu sanés:

| Modul | Fungsi |
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

>> t::width("手番") ¶            // → 4   dua glif, opat kolom
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

poé = T::of(2026, 1, 31)
>> T::format(poé, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(poé, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` ngukur **kolom pintonan**, sanés karakter: CJK sareng kalolobaan emoji nyaéta 2 kolom, jadi tata tabel sareng `t::width`, pernah `$#`.
> Dina `std/time` hiji instan nyaéta milisédetik ti jaman. Kurang ti sadinten mangrupa durasi, ti sadinten ka luhur mangrupa kalénder — jadi sabulan ragrag dina poé anu sarua dina bulan, diklaim. `bédana(a, b)` nyaéta `a - b`, jadi instan anu leuwih awal heula méré waleran négatip.

---

## Pakét

`.zyp` ngabungkus program sababaraha file kana hiji file portabel. Ieu arsip **sumber**, sanés binér, jadi dijalankeun di mana waé binér `zymbol` dijalankeun.

```bash
zymbol package proyek_abdi/ --script main.zy -o proyek_abdi.zyp
zymbol run proyek_abdi.zyp
```

> Arsipna nyandak manifés (`zyp.toml`) anu ngébréhkeun skrip asupna sareng vérsi mesin anu diperyogikeun. `zymbol run` ngaékstrak kana diréktori samentara sareng ngajalankeun ti dinya, jadi kode tiasa dibuang sedengkeun naon anu ditulis ku skrip ragrag kana diréktori gawé nyata anjeun. Playground ogé ngamuat file `.zyp`.

---

## Modeu Angka

Zymbol tiasa nulis angka dina **69 aksara digit Unicode** — Devanagari, Arab-Indic, Thai, Klingon pIqaD, Kandel Matematik, ségmén LCD sareng seueur deui. Modeuna global pikeun prosés sareng mangaruhan kaluaran; aritmatika teu robah.

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arab-Indic (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // sét deui ka ASCII
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

Digit tina aksara anu dirojong naon waé mangrupa literal anu sah dina sumberna:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Maca simetris — digit kahartos dina aksara naon waé:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` sok ASCII, jadi `#0` tetep béda sacara visual tina digit nol dina unggal aksara.
> `#,` sareng `#^` ogé nulis digitna dina aksara anu aktip, sareng pamisahna nuturkeun — tapi pasanganna pernah tibalik: `,` ngalompokkeun sareng `.` ngabagi, dina unggal aksara.

---

## Operator Data

```zymbol
f = ##.42         // ka Float
i = ###3.7        // ka Integer, dibuleudkeun  → 4
t = ##!3.7        // ka Integer, dipotong  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Float dicitak salaku digit, pernah salaku éksponén, sareng miceun `.0` panungtungan — `##.42` nulis `42` sareng tetep Float, sapertos anu dipidangkeun ku `f#?`.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   gagal-aman: mulangkeun input tanpa parobahan
>> ##!'A' ¶        // → 65    titik kodeu Char
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          buleudkeun ka 2 tempat désimal
>> #!2|pi| ¶       // → 3.14          potong ka 2 tempat désimal
>> #,|1234567| ¶   // → 1,234,567     pamisah rébu
>> #^|12345.678| ¶ // → 1.2345678e4   notasi ilmiah
```

```zymbol
>> 0x41 ¶        // → A   héksadésimal
>> 0b01000001 ¶  // → A   binér
>> 0o101 ¶       // → A   oktal
>> 0d65 ¶        // → A   désimal
```

> Literal dasar dina rentang ASCII mangrupa **karakter**: `0d65 == 'A'` nyaéta `#1`, sareng `0d65 == 65` nyaéta `#0`. Opat dasar nyéjén karakter anu sarua.

---

## Integrasi Shell

```zymbol
ayeuna = <\ date +%Y-%m-%d \>
>> "Ayeuna: " ayeuna
```

```zymbol
kaluaran = </"./subskrip.zy"/>
>> kaluaran
```

> `<\ … \>` nangkep stdout sareng stderr, kalayan baris anyar panungtungan dipiceun.
> `>< args` nangkep argumén baris paréntah salaku array string.

---

## Conto Pinuh: FizzBuzz

```zymbol
klasifikasi(angka) {
    ? angka % 15 == 0 { <~ "FizzBuzz" }
    _? angka % 3  == 0 { <~ "Fizz" }
    _? angka % 5  == 0 { <~ "Buzz" }
    <~ angka
}

@ i:1..20 { >> klasifikasi(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (hiji per baris)
```

---

## Kumaha Tanda Ngahiji

Anjeun parantos ningali hal anu sarua sapanjang manual ieu: **operator sanés gambar pikeun diapalkeun, éta sababaraha tanda dina runtuyan, sareng masing-masing nyumbangkeun harti na.** Ayeuna anjeun terang sadayana, ieu pola pinuhna.

Mimitina datang **di dunya naon urang**:

| Tanda | Dunya | Anjeun ningali di |
|--------|-------|----------------------------|
| `$` | koleksi | `$#` `$+` `$?` `$^-` |
| `@` | waktu, naon waé anu diulang | `@!` `@>` `@~` |
| `#` | naon hiji hal *nyaéta*, sanés nilaina | `#?` `#(…)` `<#` `#>` |
| `>>` | kaluar tina program | `>>` `>>!` `>>?` |
| `<<` | asup kana program | `<<` `<<\|` `<<\|?` |
| `?` | nanyakeun, tanpa komitmen | `?` `_?` `??` `$?` |
| `!` | kakuatan, atanapi kasalahan | `@!` `$!` `!?` |

Tuluy datang **naon anu dilakukeun di dinya**: `+` tambah, `-` piceun, `^` urutan, `~` robah, `#` itung, `|` hiji unit, `:` meungkeut ngaran.

Sareng dua aturan anu pernah gagal:

**Ngalikeun dua tanda ngajadikeunana lengkep.** `?` nanyakeun sakali, `??` nguji sababaraha kasus. `$?` nanyakeun naha nilai aya, `$??` mulangkeun unggal tempatna. `!` nandaan kasalahan, `!!` nyebarkeunana tanpa nanyakeun.

**Tanda modeu sok datang panungtungan.** Nalika `?` atanapi `!` muncul pikeun nyarioskeun *kumaha* hiji hal dilakukeun — kalayan ragu atanapi kalayan kakuatan — aranjeunna mangrupa tanda panungtungan operator: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:luar!`. Teu aya operasi saatos aranjeunna.

Hiji hal praktis asalna ti dinya: **kombinasi anu teu acan anjeun tingali geus ngandung harti sateuacan anjeun milarianana.** Upami `$` mangrupa koleksi sareng `^` mangrupa urutan sareng `-` mangrupa tibalik, maka `$^-` nyusun turun, sareng teu aya anu kedah nyarioskeun ka anjeun.

Henteu sadayana inventaris gawéna kitu, sareng nyarioskeunana langkung saé tibatan pura-pura. Kalolobaan operator papisah beresih. Genep papisah tapi hartina leuwih ti bagian-bagianna: `!?` `:!` `:>` `|>` `::` `$++`. Sareng sapuluh kudu diapalkeun sabab henteu papisah pisan: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Ngitung anu opak tibatan nganggap yén éta sakedik mangrupa ngahaja: éta mangrupa biaya diapalkeun basa anu nyata. Rujukan pinuh — inventaris, homograf anu diébréhkeun, sareng aturan anu kudu dicumponan ku operator anyar pikeun aya — aya dina `SYMBOLS.md`, dina repositori penerjemah.

---

## Rujukan Simbol

| Simbol | Operasi | Simbol | Operasi |
|--------|-----------|--------|-----------|
| `=` | variabel | `$#` | panjang |
| `:=` | konstanta | `$+` | tambah |
| `>>` | kaluaran | `$+[i]` | sisipkeun dina indéks (ti 1) |
| `<<` | input | `$-` | piceun anu kahiji dumasar nilai |
| `¶` / `\\` | baris anyar | `$--` | piceun sadayana dumasar nilai |
| `?` | upami | `$-[i]` | piceun dina indéks (ti 1) |
| `_?` | upami sanés | `$-[i..j]` | piceun rentang (ti 1) |
| `_` | sanés / wildcard | `$?` | ngandung |
| `??` | pencocokan | `$??` | panggihan sadaya indéks (ti 1) |
| `\|\|` | pola-atawa dina cabang match | `$[s..e]` | irisan (ti 1) |
| `@` | gelung | `$>` | peta |
| `@ N { }` | gelung N kali | `$\|` | saring |
| `@!` | putus | `$<` | ngurangan |
| `@>` | teruskeun | `$/ pamisah` | pisahkeun string |
| `@:ngaran { }` | gelung dilabelan | `$++ a b c` | ngawangun ku ngahijikeun |
| `@:ngaran!` | putus label | `$~~[p:r]` | ganti dina string |
| `@:ngaran>` | teruskeun label | `$*` | balikan string |
| `->` | lambda | `array[i]$~ v` | HIJI-HIJINA wangun apdét |
| `<~` | balik / parameter kaluaran | `~` | parameter salinan gawé |
| `array[i>j]` | indéks navigasi | `array[p ; q]` | ékstraksi datar |
| `$^+` | susun naék | `$^-` | susun turun |
| `$^` | susun sareng komparator | `\|>` | pipa |
| `!?` | cobaan | `:!` | tangkep |
| `:>` | ahirna | `$!` | kasalahan |
| `$!!` | sebarkeun kasalahan | `#1` / `#0` | bener / salah |
| `##_` | Unit — henteuna | `[…]` | array, hiji jinis |
| `#[…]` | array, campuran diébréhkeun | `#(…)` | kamus |
| `(…)` | tuple dumasar posisi | `#()` | kamus kosong |
| `<#` | impor | `#>` | ékspor |
| `#` | ébréhkeun modul | `::` | panggil modul |
| `.` | aksés widang / konstanta | `#?` | metadata jinis |
| `#\|..\|` | parsing angka | `##.` | tuluykeun ka Float |
| `###` | tuluykeun ka Integer (buleud) | `##!` | tuluykeun ka Integer (potong) |
| `#.N\|..\|` | buleudkeun | `#!N\|..\|` | potong |
| `#,\|..\|` | pamisah rébu | `#^\|..\|` | ilmiah |
| `#d0d9#` | ganti modeu angka | `#09#` | sét deui ka ASCII |
| `<\ ..\>` | laksanakeun shell | `><` | argumén CLI |
| `\ var` | musnahkeun variabel | `°x` / `x°` | harti panas |
| `>>\|` | blok TUI (layar gaganti) | `>>~` | kaluaran diposisi |
| `>>!` | bersihkeun layar | `>>?` | tanyakeun ukuran terminal |
| `<<\|` | tekenan kenop meungpeuk | `<<\|?` | tekenan kenop teu meungpeuk |
| `@~ N` | saré N milisédetik | `0d` `0x` `0o` `0b` | literal dasar |

---

## Log Parobahan Kaluaran

### v0.0.9 — Koleksi Mutuskeun _(Séptémber 2026)_

- **Pegat** Kamus boga notasi sorangan: `#(konci: nilai)`. `(x: 1)` taranjang ditolak, sareng `#()` mangrupa kamus kosong — anu `()` pernah tiasa janten
- **Pegat** Panugasan indéks ditarik: `array[i] = v` sareng sadaya wangun sanyawa. `=` méré nilai ka **NGARAN**; ngarobah bagian tina koleksi nyaéta `$~`
- **Pegat** Indéks berantéy `m[i][j]` ditolak pikeun maca sareng nulis — `>` nyaéta anu ngalih antara léngkah
- **Pegat** Modul kudu ngébréhkeun naon anu diéksporna (**E014**); `#> { }` nyaéta cara modul nyarios yén beungeutna kosong
- **Pegat** Penentu gelung mangrupa hitungan atawa kaayaan — teu aya kabeneran. `@ []` sareng `@ 3.5` ditolak
- **Ditambah** `##_` — literal Unit, sareng cara program nanyakeun naha aya anu henteu
- **Ditambah** `#[…]` — array anu campuran jinis unsurna diébréhkeun
- **Ditambah** `#?` ngabédakeun opat koleksi: `##]` `##[` `##)` `##(`
- **Ditambah** `std/time` — jam sareng kalénder sipil, kalayan zona sareng aritmatika kalénder
- **Ditambah** `<~>` di tingkat luhur mangrupa status kaluar program
- **Ditambah** `@ (k, v):pasangan` — pola dina hulu gelung
- **Ditambah** `#|c|` maca digit dina salah sahiji tina 69 aksara; `#,` sareng `#^` nulis dina anu aktip
- **Dirobah** `Integer` mangrupa integer aman, ±(2⁵³ − 1), gagal-tutup dina unggal mesin
- **Dirobah** Fungsi dingaranan maca variabel file dina waktu panggero, dumasar nilai
- **Dirobah** Pernyataan anu ngan maca ngaran méré peringatan tibatan ngaliwat jempé
- **Mesin** 660 ti 666 file korpus sapuk dina tilu mesin, 0 béda

### v0.0.8 — Auto-bébas, `std/term` sareng Pakét _(Agustus 2026)_

- **Ditambah** Karuksakan otomatis dina pamakéan panungtungan — teu katingali; ngan nurunkeun mémori puncak
- **Ditambah** `std/term` — métrik pintonan dina kolom terminal
- **Ditambah** `##!` dina `Char` — titik kodeu Unicodenya
- **Ditambah** Pola atawa dina match: `'p' || 'P' => …`, alternatif naon waé jinisna dina hiji cabang
- **Ditambah** Pakét Zymbol (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Ditambah** `<~>` di tempat panggero wajib di mana anu ditelepon ngébréhkeun parameter kaluaran
- **Dilereskeun** Paritas sistim modul dina VM régister

### v0.0.7 — Pustaka Standar Asli _(Juli 2026)_

- **Ditambah** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — sadayana kalayan nilai kasalahan lemes
- **Ditambah** Input ditaip/dipariksa: `<< ##.(5,2) "harga: " p`
- **Ditambah** Operator postfix langsung dina `>>` — teu peryogi kurung
- **Dirobah** Formatter gagal-tutup: nolak nulis kaluaran anu teu tiasa dibaca deui

### v0.0.6 — Panghalusan sareng Stdlib Ilmiah _(Juni 2026)_

- **Pegat** `=>` ngaganti `:` dina cabang match sareng `<=` dina alias impor/ékspor
- **Ditambah** `std/math` sareng `std/random`
- **Ditambah** Apdét kamus dumasar konci: `d["k"]$~ nilai`

### v0.0.5 — Primitif TUI sareng Harti Panas _(Méi 2026)_

- **Ditambah** Blok TUI `>>| { }`, kaluaran diposisi `>>~`, input kenop `<<|` sareng `<<|?`
- **Ditambah** `>>!` bersihkeun layar, `>>?` ukuran terminal, `@~ N` saré
- **Ditambah** Harti panas `°x` / `x°`, sareng balikan string `$*`

### v0.0.4 — Indéks Dimimitian ti 1 sareng Fungsi Kelas Kahiji _(April 2026)_

- **Pegat** Sadaya indéks **dimimitian ti 1** — `array[1]` mangrupa unsur kahiji
- **Ditambah** Fungsi dingaranan salaku nilai kelas kahiji; sintaksis blok modul `# ngaran { }`
- **Ditambah** Indéks multi-dimensi `array[i>j>k]` sareng ékstraksi datar `array[p ; q]`

### v0.0.3 — Sistim Angka Unicode _(April 2026)_

- **Ditambah** 69 blok digit Unicode kalayan token ganti modeu `#d0d9#`
- **Ditambah** Literal boolean dina aksara naon waé — `#१` / `#०`

### v0.0.2 — Rarancang Ulang API Koleksi _(Maret 2026)_

- **Ditambah** Kulawarga operator `$` pikeun array sareng string
- **Ditambah** Panugasan déstrukturisasi, sareng indéks négatip

### v0.0.1 — Kaluaran Umum Kahiji _(Maret 2026)_

- Penerjemah leumpang tangkal + VM régister (`--vm`)
- Sadaya konstruksi inti: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Idéntifikasi Unicode pinuh, sistim modul, lambda, panutupan, penanganan kasalahan
- REPL, LSP, ekstensi VS Code, formatter (`zymbol fmt`)

---

_Zymbol-Lang — Simbolis. Universal. Teu Robah._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Lisénsi:** manual ieu dilisénsikeun dina [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024-2026 Zymbol-Lang Team. Téks pinuh: `LICENSE-CC-BY-SA-4.0` dina <https://github.com/zymbol-lang/web>. Penerjemah sareng mesin panyungsi (`zymbol.js`) mangrupa karya misah, dilisénsikeun dina AGPL-3.0-only.
