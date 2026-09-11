> **Penafian:** Dokumen ini telah dicipta dan diterjemah oleh kecerdasan buatan (AI).
>
> **Disclaimer:** This documentation was created with artificial intelligence (AI) assistance.
>
> Rujukan kanonikal ialah **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** dalam repositori penterjemah.

---

# Manual Zymbol-Lang

> **Disemak untuk v0.0.9 — 2026-09-07**

**Zymbol-Lang** ialah bahasa pengaturcaraan simbolik. Tiada perkataan dalam tatabahasanya — setiap binaan adalah satu tanda. Berfungsi sama dalam mana-mana bahasa manusia.

- Tiada `if`, `while`, `return` — hanya `?`, `@`, `<~`
- Unicode penuh — pengecam dalam mana-mana bahasa atau emoji
- Tidak bergantung pada bahasa manusia — kod adalah sama di mana-mana

**Versi penterjemah**: v0.0.9 | **Liputan ujian**: 660/666 (tiga enjin bersetuju, 0 menyimpang)

---

## Pemboleh Ubah dan Pemalar

```zymbol
x = 10              // pemboleh ubah boleh ubah
PI := 3.14159       // pemalar — penetapan semula ialah ralat masa jalan
nama = "Aminah"
aktif = #1          // boolean benar
👋 := "Selamat datang"
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

`°` (tanda darjah, U+00B0) secara automatik memulakan pemboleh ubah kepada nilai neutralnya pada penggunaan pertama:

```zymbol
nombor = [3, 1, 4, 1, 5]
@ n:nombor {
    °jumlah += n
}
>> jumlah ¶              // → 14
```

> `°pemboleh_ubah` (awalan) berlabuh di atas gelung — hasilnya boleh dibaca selepas `@`.
> `pemboleh_ubah°` (akhiran) berlabuh di dalam gelung — ia mati apabila gelung tamat.

Pernyataan yang hanya nama akan membaca pemboleh ubah dan membuang nilainya, jadi ia memberi amaran:

```zymbol
kiraan = 5
kiraan
```

Pengkompil memberi amaran seperti ini (mesejnya sentiasa dalam bahasa Inggeris):

```text
warning: this statement does nothing: 'kiraan' is read and discarded
  = help: remove it, or use it — `>> name ¶` to print it
```

Maksudnya: *«pernyataan ini tidak melakukan apa-apa: 'kiraan' dibaca dan dibuang»*.

---

## Jenis Data

| Jenis | Literal | Tag `#?` | Nota |
|------|---------|----------|-------|
| Integer | `42`, `-7` | `###` | Integer selamat: ±(2⁵³ − 1) |
| Float | `3.14`, `1.5e10` | `##.` | IEEE-754 berganda |
| String | `"teks"` | `##"` | Interpolasi: `"Selamat {nama}"` |
| Char | `'A'` | `##'` | Satu titik kod Unicode |
| Boolean | `#1`, `#0` | `##?` | BUKAN nombor — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Satu jenis, diperiksa |
| Campuran diisytihar | `#[1, "dua"]` | `##[` | Jenis sama dengan `[…]`, tidak diperiksa |
| Tuple | `(a, b)` | `##)` | Kedudukan, tidak boleh ubah |
| Kamus | `#(x: 1, y: 2)` | `##(` | Berdasarkan kunci, boleh ubah |
| Fungsi | rujukan fungsi bernama | `##()` | Kelas pertama; menunjukkan `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Kelas pertama; menunjukkan `<lambd/N>` |
| Unit | `##_` | `##_` | Ketidakhadiran — tiada null |

```zymbol
>> 42#? ¶               // → (###, 2, 42)
>> [1, 2, 3]#? ¶        // → (##], 3, [1, 2, 3])
>> #(x: 1)#? ¶          // → (##(, 1, #(x: 1))
```

Integer yang keluar dari julat selamat ialah ralat yang boleh ditangkap, bukan pembalutan senyap:

```zymbol
!? {
    >> (9007199254740991 + 1) ¶
} :! ##Range {
    >> "di luar julat" ¶ // → di luar julat
}
```

`##_` ialah cara program bertanya sama ada sesuatu itu tiada:

```zymbol
tiada() { }
nilai = tiada()
>> (nilai == ##_) ¶     // → #1
```

---

## Output dan Input

```zymbol
nama = "Aminah"
jumlah = 3
>> "Selamat datang" ¶             // → Selamat datang
>> "a=" nama " b=" jumlah ¶ // → a=Aminah b=3
>> jumlah#? ¶            // → (###, 1, 3)
```

```zymbol
<< nama
<< "Masukkan nama anda: " nama
<< ###(4) "Umur: " umur
```

**Lihat bentuk kedua-dua tanda ini.** `>>` menunjuk ke luar: ia mengeluarkan data dari program. `<<` menunjuk ke dalam: ia membawa data ke dalam program. Tiada apa yang perlu dihafal di sini — anak panah menunjukkan arah maklumat bergerak, dan idea yang sama kembali dalam setiap tanda yang memindahkan sesuatu.

> `¶` dan `\\` ialah baris baharu yang setara. `>>` tidak pernah menambahnya.
> Penentu jenis sebelum gesaan mengesahkan semasa membaca dan menggesa semula sehingga nilainya sah:
> `##.` Float · `##.(T,D)` perpuluhan · `###(N)` Integer · `##"(N)"` teks · `##'` satu Char.

Pada peringkat tertinggi fail, `<~` ialah status keluar program:

```zymbol
>> "menyemak" ¶      // → menyemak
<~ 0
```

---

## Primitif TUI

Operator antara muka terminal untuk program interaktif. Kebanyakannya memerlukan blok `>>| { }` (skrin ganti + mod mentah).

```zymbol
>>| {
    >>!
    >>~ (1, 1, 0, 10) > "Sedang berjalan"
    @~ 1000
    >>~ (2, 1) > "Selesai."
}
```

```zymbol
>>| {
    [baris, lajur] = >>?
    >>~ (1, 1) > "Terminal: " baris " x " lajur
    <<| kekunci
    >>~ (2, 1) > "Ditekan: " kekunci
}
```

Di sini anda boleh lihat mengapa tanda bergabung dan bukan berganda. Anda sudah tahu bahawa `<<` ialah input dan `?` bertanya tanpa komitmen. Hanya satu tanda yang baharu:

- `|` ialah **satu unit**, bukan keseluruhan aliran.

Dengan itu, kedua-dua operator papan kekunci membaca sendiri:

```text
<<        |             ?
input     satu unit     tanpa komitmen

<<|   ambil SATU kekunci, dan tunggu sehingga ada satu
<<|?  lihat sama ada ADA kekunci, dan teruskan jika tiada
```

Sama di sisi lain: `>>` menghantar, `>>!` menghantar **dengan paksa** (membersihkan seluruh skrin), manakala `>>?` **bertanya** daripada menulis (berapa besar terminal). Tanda di sebelah kanan ialah yang menukar mod, dan ia sentiasa datang terakhir.

> `>>!` membersihkan skrin. `>>?` mengembalikan `[baris, lajur]`. `@~ N` tidur N milisaat.
> `<<|` membaca satu tekanan kekunci (menyekat); `<<|?` menyiasat tanpa menyekat (`'\0'` jika tiada).
> Kekunci anak panah tiba dinyahkod sebagai `'↑' '↓' '←' '→'`; ESC ialah titik kod 27.
> Tuple output berkedudukan: `(baris, lajur, BKS, depan, belakang)` — mana-mana slot boleh ditinggalkan dengan koma (`>>~ (,,, 196) > "merah"`).
> Topeng bit BKS: `1`=Tebal, `2`=Italik, `4`=Garis bawah. Palet ANSI 256 warna (`0`=lalai terminal).

---

## Operator

```zymbol
a = 10
b = 3
h1 = a + b    // 13
h2 = a - b    // 7
h3 = a * b    // 30
h4 = a / b    // 3  (pembahagian integer)
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

> `==` tidak pernah memaksa: `"5" == 5` ialah `#0`. Susunan memaksa: `"5" > 4` ialah `#1`, dan `"४२" > 5` juga — teks angka dalam mana-mana 69 skrip membandingkan sebagai nombor.
> Fungsi hanya sama dengan dirinya sendiri, tidak pernah sama dengan fungsi lain yang mempunyai badan yang sama.

---

## String

```zymbol
nama = "Aminah"
n = 42
>> "Selamat datang " nama " anda mempunyai " n ¶ // → Selamat datang Aminah anda mempunyai 42
penerangan = "Selamat datang {nama}, anda mempunyai {n}"
>> penerangan ¶              // → Selamat datang Aminah, anda mempunyai 42
```

```zymbol
s = "Selamat dunia"
panjang = s$#                  // 13
sub = s$[1..6]             // "Selama"
ada = s$? "dunia"          // #1
bahagian = "a,b,c,d"$/ ','    // [a, b, c, d]
ganti = s$~~["a":"o"]        // "Selomot dunio"
garis = "─" $* 20
```

> `+` hanya untuk nombor. Untuk string gunakan penjajaran atau interpolasi.
> `\{` dan `\}` ialah pendakap literal — pemisahan adalah simetri.

---

## Aliran Kawalan

```zymbol
x = 7
? x > 100 {
    >> "besar" ¶
} _? x > 0 {
    >> "positif" ¶     // → positif
} _ {
    >> "negatif" ¶
}
```

Di sini terdapat dua tanda baharu, dan yang ketiga datang daripada menggabungkannya:

- `?` ialah **bertanya**: ia membuka syarat.
- `_` ialah **apa yang tidak dinyatakan**: cabang yang tinggal apabila tiada soalan yang sepadan.
- `_?` ialah kedua-duanya berturut-turut: *jika tiada yang sepadan, tanya lagi*.

Itulah sebabnya `_?` ditulis begitu. Ia bukan simbol baharu untuk dipelajari — ia `_` diikuti oleh `?`, dan ia bermaksud tepat apa yang kedua-dua bahagiannya bermakna, dibaca mengikut urutan.

> Pendakap `{ }` adalah **wajib** walaupun untuk satu pernyataan.

---

## Padanan

```zymbol
markah = 85
gred = ?? markah {
    90..100 => 'A'
    80..89  => 'B'
    _       => 'F'
}
>> gred ¶              // → B
```

```zymbol
suhu = -5
keadaan = ?? suhu {
    < 0  => "ais"
    < 20 => "sejuk"
    _    => "panas"
}
>> keadaan ¶              // → ais
```

Anda sudah tahu bahawa `?` ialah "bertanya". **`??` ialah bertanya banyak kali**: menggandakan tanda, di mana-mana dalam bahasa, ialah melakukan beberapa kali apa yang tanda lakukan sekali. Satu `?` menguji satu syarat; `??` menguji terhadap senarai kes.

Alternatif bergabung dengan `||`, dan ia boleh mencampurkan jenis corak:

```zymbol
kekunci = 'P'
tindakan = ?? kekunci {
    'p' || 'P' => "jeda"
    < 0 || > 100 => "di luar julat"
    _ => "diabaikan"
}
>> tindakan ¶             // → jeda
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
buah = ["epal", "pir", "anggur"]
@ b:buah { >> b " " }
>> ¶                    // → epal pir anggur
@ a:"Selamat" { >> a "-" }
>> ¶                    // → S-e-l-a-m-a-t-
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
kiraan = 0
@:luar {
    kiraan++
    ? kiraan >= 3 { @:luar! }
}
>> kiraan ¶             // → 3
```

`@` ialah tanda **masa**: segala yang berulang hidup di dalamnya. Untuk memendekkan masa itu, anda menambah tanda di sisinya:

- `@!` — `!` ialah **paksa**: keluar dari gelung sekarang.
- `@>` — `>` menolak ke hadapan: pergi ke pusingan seterusnya.
- `@:luar!` — `:` **mengikat nama**, jadi ini memotong gelung yang *bernama* luar, bukan yang terdekat.

Tiga operator, dan tiada satu pun perlu dihafal secara berasingan: ia ialah `@` tambah satu tanda yang sudah mengatakan apa yang dilakukannya.

> **Penentu ialah kiraan atau syarat.** `Integer` ialah kiraan, dinilai sekali — `@ 0` menjalankan badan sifar kali. Apa-apa yang lain ialah syarat. Tiada kebenaran: `@ []` dan `@ 3.5` ditolak. Untuk merentasi koleksi gunakan `@ x:item`; untuk mengiranya, `@ item$#`.

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

Fungsi membaca pemboleh ubah fail mengikut nilai, dan penulisan di dalam kekal di dalam:

```zymbol
had = 100
dalam(n) { <~ n < had }
>> dalam(42) ¶         // → #1
```

Dua tanda mengubah ini, dan kedua-duanya ditulis **dalam tandatangan dan di tapak panggilan**:

```zymbol
tambah_kiraan(kiraan<~) { kiraan = kiraan + 1 }
jumlah = 0
tambah_kiraan(jumlah<~)
>> jumlah ¶              // → 1
```

> `p~` ialah salinan kerja — badan boleh menetapkannya semula dan pemanggil tidak terjejas.
> `p<~` ialah parameter output — perubahan itu kembali. `tambah_kiraan(jumlah)` tanpa tanda ialah ralat semantik: anotasi dan tandatangan tidak boleh terpisah.

---

## Lambda dan Penutupan

```zymbol
dua_kali = x -> x * 2
hasil = (a, b) -> a + b
>> dua_kali(5) ¶          // → 10
>> hasil(3, 7) ¶          // → 10
```

```zymbol
kelaskan = x -> {
    ? x > 0 { <~ "positif" }
    _? x < 0 { <~ "negatif" }
    <~ "sifar"
}
>> kelaskan(-4) ¶         // → negatif
```

```zymbol
faktor = 3
tiga_kali = x -> x * faktor
>> tiga_kali(7) ¶          // → 21
```

```zymbol
cipta_penambah(n) { <~ x -> x + n }
tambah10 = cipta_penambah(10)
>> tambah10(5) ¶           // → 15
```

Lambda boleh tidak mengambil sebarang parameter:

```zymbol
jawapan = () -> 42
>> jawapan() ¶           // → 42
```

> Lambda menangkap pemboleh ubah fail **apabila ia dicipta**; fungsi bernama membacanya **apabila ia dipanggil**.

---

## Array

```zymbol
array = [1, 2, 3, 4, 5]
>> array[1] ¶       // → 1   pengindeksan bermula dari 1
>> array[-1] ¶      // → 5   negatif mengira dari hujung
>> array$# ¶        // → 5   panjang
```

```zymbol
array = [1, 2, 3]
>> (array$+ 6) ¶          // → [1, 2, 3, 6]   tambah
>> (array$+[2] 99) ¶      // → [1, 99, 2, 3]  sisip pada kedudukan 2
>> (array$- 3) ¶          // → [1, 2]         buang kejadian pertama
>> (array$-[1]) ¶         // → [2, 3]         buang pada indeks 1
>> (array$[1..2]) ¶       // → [1, 2]         hirisan, kedua-dua hujung disertakan
>> (array$? 3) ¶          // → #1             mengandungi
```

Semuanya bermula dengan `$`, tanda **koleksi**, dan diteruskan dengan tanda yang mengatakan apa yang dilakukan di dalamnya: `#` berapa, `+` tambah, `-` buang, `?` tanya sama ada ada. Dan seperti `??`, menggandakan tanda bermakna melakukannya secara menyeluruh: `$?` bertanya *sama ada* nilai ada, `$??` bertanya *di berapa tempat* dan mengembalikan semuanya.

```zymbol
array = [3, 1, 2]
>> (array$^+) ¶     // → [1, 2, 3]   menaik
>> (array$^-) ¶     // → [3, 2, 1]   menurun
```

**Peraturan hasil.** Satu operator, dan apa yang dilakukan oleh kod di sekelilingnya akan menentukan: jika digunakan, ia **membina** dan meninggalkan asal tanpa perubahan; jika dibuang, ia **mengubah**.

```zymbol
array = [1, 2, 3]
salinan = array[2]$~ 99
>> array ¶                // → [1, 2, 3]
>> salinan ¶              // → [1, 99, 3]
array[2]$~ 99
>> array ¶                // → [1, 99, 3]
```

> **`=` tidak pernah menulis ke dalam koleksi.** `array[2] = 99` bukan satu bentuk Zymbol — `=` memberi nilai kepada **NAMA**. Mengubah sebahagian koleksi ialah `$~`, dalam setiap koleksi.

`[…]` mengandungi satu jenis dan diperiksa; campuran yang disengajakan **diisytiharkan** dengan `#[…]`:

```zymbol
campuran = #[1, "dua", #1]
>> campuran ¶             // → [1, dua, #1]
>> ([1, 2] == #[1, 2]) ¶ // → #1
```

---

## Pengindeksan Berbilang Dimensi

`>` menuruni struktur bersarang. Satu kumpulan pendakap menangani satu elemen, sedalam mana pun.

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[2>3] ¶        // → 6   baris 2, lajur 3
>> m[-1>-1] ¶      // → 9   baris terakhir, lajur terakhir
```

```zymbol
m = [[1,2,3], [4,5,6], [7,8,9]]
>> m[1>1 ; 2>2 ; 3>3] ¶          // → [1, 5, 9]          rata: pepenjuru
>> m[[1>1, 1>3] ; [3>1, 3>3]] ¶  // → [[1, 3], [7, 9]]   berstruktur: sudut
```

```zymbol
m = [[1,2,3], [4,5,6]]
>> (m[1>2]$~ 99) ¶      // → [[1, 99, 3], [4, 5, 6]]
```

> `m[1][2]` **bukan** satu bentuk Zymbol. Indeks berantai ditolak untuk pembacaan dan penulisan — satu kumpulan pendakap setiap akses, dan `>` ialah apa yang pergi antara langkah.

---

## Kamus

Tuple dengan medan bernama ialah kamus, dan sejak v0.0.9 ia ditulis `#(…)`.

```zymbol
orang = #(nama: "Aminah", umur: 25)
>> orang.nama ¶        // → Aminah
>> orang["umur"] ¶    // → 25
```

```zymbol
orang = #(nama: "Aminah", umur: 25)
medan = "nama"
>> orang[medan] ¶     // → Aminah
```

Ia boleh ubah, kunci boleh ditambah, dan ia boleh dilalui:

```zymbol
stok = #(pir: 4)
stok["epal"]$~ 10
@ k:stok { >> k "=" stok[k] " " }
>> ¶                    // → pir=4 epal=10
```

```zymbol
stok = #(pir: 4, epal: 10)
@ (k, v):stok { >> k ":" v " " }
>> ¶                    // → pir:4 epal:10
```

> `#()` ialah kamus kosong, yang `()` tidak boleh jadi — ia perlu menjadi tuple kosong juga. `(x: 1)` yang telanjang ditolak dengan mesej ini: *a dictionary is written `#(…)`* — «kamus ditulis `#(…)`».
> Kamus dialamatkan dengan kunci, tidak pernah dengan kedudukan, jadi `orang[1]` ialah ralat.

---

## Tuple

Tuple ialah bekas tersusun **tidak boleh ubah** yang memegang nilai pelbagai jenis.

```zymbol
titik = (10, 20)
>> titik[1] ¶           // → 10
data = (42, "Selamat", #1, 3.14)
>> data[3] ¶            // → #1
```

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶                  // → (10, 20, 30)
>> t2 ¶                 // → (10, 999, 30)
```

> Sebarang percubaan untuk mengubah tuple di tempatnya ialah ralat, apa pun operatornya — ketidakbolehan ubah ialah sifat nilai, bukan pengecualian di dalam setiap `$`.

---

## Penguraian Struktur

```zymbol
array = [10, 20, 30, 40, 50]
[a, b, c] = array
>> a " " b " " c ¶      // → 10 20 [30, 40, 50]
```

```zymbol
array = [10, 20, 30, 40, 50]
[pertama, *baki] = array
>> pertama ¶            // → 10
>> baki ¶              // → [20, 30, 40, 50]
```

```zymbol
titik = (100, 200)
(px, py) = titik
>> px " " py ¶          // → 100 200
```

```zymbol
orang = #(nama: "Siti", umur: 25)
#(nama: n, umur: u) = orang
>> n " " u ¶            // → Siti 25
```

> Bentuk pendakap ditaip: `[…]` mengambil array, `(…)` tuple, `#(…)` kamus. Nama terakhir **menyerap baki**, jadi penguraian struktur tidak pernah gagal pada panjang — `(a, b, c) = (1,2,3,4,5)` memberi `c = (3,4,5)`, dan `##_` apabila tiada yang tinggal.

---

## Fungsi Peringkat Tinggi

```zymbol
nombor = [1, 2, 3, 4, 5]
>> (nombor$> (x -> x * 2)) ¶ // → [2, 4, 6, 8, 10]
>> (nombor$| (x -> x % 2 == 0)) ¶ // → [2, 4]
>> (nombor$< (0, (kumpul, x) -> kumpul + x)) ¶ // → 15
```

```zymbol
nombor = [1, 2, 3, 4, 5, 6]
dua_kali(x) { <~ x * 2 }
besar(x) { <~ x > 3 }
>> (nombor$> dua_kali) ¶    // → [2, 4, 6, 8, 10, 12]
>> (nombor$| besar) ¶    // → [4, 5, 6]
```

```zymbol
pangkalan = [#(nama: "Carla", umur: 28), #(nama: "Siti", umur: 25)]
ikut_umur = pangkalan$^ (a, b -> a.umur < b.umur)
>> ikut_umur[1].nama ¶     // → Siti
```

> Fungsi bernama pergi ke HOF **tanpa kurungan**: `nombor$> dua_kali`. Menulis `nombor$> (dua_kali)` ialah ralat huraian, kerana `(` membuka lambda.

---

## Operator Paip

```zymbol
dua_kali = x -> x * 2
tambah = (a, b) -> a + b
inc = x -> x + 1
>> (5 |> dua_kali(_)) ¶    // → 10
>> (10 |> tambah(_, 5)) ¶  // → 15
>> (5 |> dua_kali(_) |> inc(_)) ¶ // → 11
```

---

## Pengendalian Ralat

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "pembahagian dengan sifar" ¶  // → pembahagian dengan sifar
} :! {
    >> "lain: " _err ¶
} :> {
    >> "sentiasa berjalan" ¶        // → sentiasa berjalan
}
```

| Jenis | Bila |
|------|------|
| `##Div` | Pembahagian dengan sifar |
| `##Index` | Indeks di luar sempadan |
| `##Key` | Kunci tiada dalam kamus |
| `##Range` | Di luar julat integer selamat |
| `##Type` | Ketidakpadanan jenis |
| `##Parse` | Penghuraian data |
| `##IO` | Fail / sistem |
| `##Network` | Ralat rangkaian |
| `##DB` | Pangkalan data |
| `##Time` | Tarikh yang tidak wujud |
| `##_` | Mana-mana ralat (tangkap semua) |

`!` ialah tanda **ralat dan paksa**, dan ia dibaca sama dalam kedua-dua keluarga: `$!` bertanya kepada nilai sama ada ia ralat; `$!!`, dengan tanda berganda, menyebarkannya ke atas tanpa bertanya.

> Kegagalan pustaka standard kembali sebagai **nilai ralat lembut** yang anda uji dengan `$!` atau tangkap dengan `!?`, daripada membatalkan. `$!!` menyebarkan satu kepada pemanggil.

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
# pustaka_saya {
    #> { dalaman_tambah => jumlah }

    dalaman_tambah(a, b) { <~ a + b }
}
```

Dua tanda modul ialah idea yang sama, kini digunakan pada fail: `#` ialah peringkat **pengisytiharan** — apa sesuatu itu *adalah*, bukan nilainya — dan anak panah mengatakan arah mana kod bergerak:

```text
<#   anak panah masuk: import, bawa dari fail lain
#>   anak panah keluar: eksport, tawarkan kepada fail lain
```

Tanda arah sentiasa duduk di tepi yang menghadap arah yang ditunjuknya. Ini sebab yang sama mengapa `<~` kembali ke kiri (keluar dari fungsi) dan `->` masuk ke kanan (ke dalam badan lambda).

> **Modul mengisytiharkan apa yang dieksportnya.** Blok `#>` adalah wajib — meninggalkannya ialah **E014**, dan `#> { }` ialah cara modul mengatakan permukaannya kosong. `::` memanggil fungsi, `.` membaca pemalar. Hanya import, blok eksport, penginisialisasi literal dan definisi fungsi boleh muncul dalam badan modul; apa-apa yang boleh dilaksanakan ialah **E013**.

---

## Pustaka Standard

Modul asli, diimport seperti mana-mana yang lain:

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

>> t::width("手番") ¶            // → 4   dua glif, empat lajur
>> "|" t::center("go", 8) "|" ¶ // → |   go   |
```

```zymbol
<# std/time => T

hari = T::of(2026, 1, 31)
>> T::format(hari, "%Y-%m-%d") ¶ // → 2026-01-31
>> T::format(T::add(hari, 1, "month"), "%Y-%m-%d") ¶ // → 2026-02-28
```

> `std/term` mengukur **lajur paparan**, bukan aksara: CJK dan kebanyakan emoji ialah 2 lajur, jadi susun jadual dengan `t::width`, tidak pernah `$#`.
> Dalam `std/time` satu saat ialah milisaat sejak zaman. Kurang daripada sehari ialah tempoh, dari sehari ke atas ialah kalendar — jadi sebulan jatuh pada hari yang sama dalam bulan itu, dikapit. `beza(a, b)` ialah `a - b`, jadi saat yang lebih awal dahulu memberikan jawapan negatif.

---

## Pakej

`.zyp` membungkus program berbilang fail menjadi satu fail mudah alih. Ia ialah arkib **sumber**, bukan binari, jadi ia berjalan di mana-mana binari `zymbol` berjalan.

```bash
zymbol package projek_saya/ --script main.zy -o projek_saya.zyp
zymbol run projek_saya.zyp
```

> Arkib membawa manifes (`zyp.toml`) yang mengisytiharkan skrip masuknya dan versi enjin yang diperlukan. `zymbol run` mengekstraknya ke direktori sementara dan menjalankan dari sana, jadi kod boleh dibuang manakala apa yang ditulis skrip akan jatuh ke direktori kerja sebenar anda. Playground juga memuatkan fail `.zyp`.

---

## Mod Nombor

Zymbol boleh menulis nombor dalam **69 skrip digit Unicode** — Devanagari, Arab-Indic, Thai, Klingon pIqaD, Tebal Matematik, segmen LCD dan banyak lagi. Mod adalah global kepada proses dan mempengaruhi output; aritmetik tidak berubah.

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arab-Indic (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // tetapkan semula kepada ASCII
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

Digit mana-mana skrip yang disokong ialah literal yang sah dalam sumber:

```zymbol
#०९#
@ i:१..५ { >> i " " }
>> ¶                    // → १ २ ३ ४ ५
#09#
```

Pembacaan adalah simetri — digit difahami dalam mana-mana skrip:

```zymbol
>> #|"४२"| ¶            // → 42
>> #|'७'| ¶             // → 7
```

> `#` sentiasa ASCII, jadi `#0` kekal berbeza secara visual daripada digit sifar dalam setiap skrip.
> `#,` dan `#^` juga menulis digit mereka dalam skrip aktif, dan pemisah mengikutinya — tetapi pasangan itu tidak pernah terbalik: `,` mengelompokkan dan `.` membahagi, dalam setiap skrip.

---

## Operator Data

```zymbol
f = ##.42         // ke Float
i = ###3.7        // ke Integer, dibundarkan  → 4
t = ##!3.7        // ke Integer, dipotong  → 3
>> f " " i " " t ¶      // → 42 4 3
>> f#? ¶                // → (##., 2, 42)
```

> Float dicetak sebagai digit, tidak pernah sebagai eksponen, dan membuang `.0` di hujung — `##.42` menulis `42` dan masih Float, seperti yang ditunjukkan oleh `f#?`.

```zymbol
>> #|"42"| ¶       // → 42
>> #|"abc"| ¶      // → abc   selamat-gagal: mengembalikan input tanpa perubahan
>> ##!'A' ¶        // → 65    titik kod Char
```

```zymbol
pi = 3.14159265
>> #.2|pi| ¶       // → 3.14          bundarkan ke 2 tempat perpuluhan
>> #!2|pi| ¶       // → 3.14          potong ke 2 tempat perpuluhan
>> #,|1234567| ¶   // → 1,234,567     pemisah ribuan
>> #^|12345.678| ¶ // → 1.2345678e4   tatatanda saintifik
```

```zymbol
>> 0x41 ¶        // → A   perenam belasan
>> 0b01000001 ¶  // → A   perduaan
>> 0o101 ¶       // → A   perlapanan
>> 0d65 ¶        // → A   perpuluhan
```

> Literal asas dalam julat ASCII ialah **aksara**: `0d65 == 'A'` ialah `#1`, dan `0d65 == 65` ialah `#0`. Keempat-empat asas mengeja aksara yang sama.

---

## Integrasi Shell

```zymbol
hari_ini = <\ date +%Y-%m-%d \>
>> "Hari ini: " hari_ini
```

```zymbol
output = </"./subskrip.zy"/>
>> output
```

> `<\ … \>` menangkap stdout dan stderr, dengan baris baharu di hujung dibuang.
> `>< args` menangkap argumen baris arahan sebagai array string.

---

## Contoh Penuh: FizzBuzz

```zymbol
kelaskan(nombor) {
    ? nombor % 15 == 0 { <~ "FizzBuzz" }
    _? nombor % 3  == 0 { <~ "Fizz" }
    _? nombor % 5  == 0 { <~ "Buzz" }
    <~ nombor
}

@ i:1..20 { >> kelaskan(i) ¶ }
// → 1 · 2 · Fizz · 4 · Buzz · Fizz · 7 · 8 · Fizz · Buzz · 11 · Fizz · 13 · 14 ·
//   FizzBuzz · 16 · 17 · Fizz · 19 · Buzz   (satu setiap baris)
```

---

## Bagaimana Tanda Bergabung

Anda telah melihat perkara yang sama sepanjang manual ini: **operator bukan lukisan untuk dihafal, ia ialah beberapa tanda berturut-turut, dan setiap satu menyumbang maknanya.** Sekarang setelah anda tahu semuanya, inilah corak penuhnya.

Pertama datang **dunia mana kita berada**:

| Tanda | Dunia | Anda melihatnya dalam |
|--------|-------|----------------------------|
| `$` | koleksi | `$#` `$+` `$?` `$^-` |
| `@` | masa, apa-apa yang berulang | `@!` `@>` `@~` |
| `#` | apa sesuatu *adalah*, bukan nilainya | `#?` `#(…)` `<#` `#>` |
| `>>` | keluar dari program | `>>` `>>!` `>>?` |
| `<<` | masuk ke program | `<<` `<<\|` `<<\|?` |
| `?` | bertanya, tanpa komitmen | `?` `_?` `??` `$?` |
| `!` | paksa, atau ralat | `@!` `$!` `!?` |

Kemudian datang **apa yang dilakukan di sana**: `+` tambah, `-` buang, `^` susun, `~` ubah suai, `#` kira, `|` satu unit, `:` ikat nama.

Dan dua peraturan yang tidak pernah gagal:

**Menggandakan tanda menjadikannya menyeluruh.** `?` bertanya sekali, `??` menguji banyak kes. `$?` bertanya sama ada nilai itu ada, `$??` mengembalikan setiap tempat ia berada. `!` menandakan ralat, `!!` menyebarkannya tanpa bertanya.

**Tanda mod sentiasa datang terakhir.** Apabila `?` atau `!` muncul untuk mengatakan *bagaimana* sesuatu dilakukan — dengan ragu-ragu atau dengan paksa — mereka ialah tanda terakhir operator: `$??`, `$!!`, `<<|?`, `@!`, `##!`, `>>!`, `>>?`, `@:luar!`. Tidak pernah ada operasi selepas mereka.

Satu perkara praktikal terhasil daripada itu: **gabungan yang tidak pernah anda lihat sudah masuk akal sebelum anda mencarinya.** Jika `$` ialah koleksi dan `^` ialah susunan dan `-` ialah terbalik, maka `$^-` menyusun menurun, dan tiada siapa perlu memberitahu anda.

Tidak semua inventori berfungsi begitu, dan mengatakan demikian lebih baik daripada berpura-pura. Kebanyakan operator berpecah dengan bersih. Enam berpecah tetapi bermakna lebih daripada bahagiannya: `!?` `:!` `:>` `|>` `::` `$++`. Dan sepuluh perlu dihafal kerana ia tidak berpecah sama sekali: `¶` `><` `#1` `#0` `0x` `0b` `0o` `0d` `###` `°`.

> Mengira yang legap daripada menganggap ia sedikit adalah sengaja: ia ialah kos hafalan sebenar bahasa itu. Rujukan penuh — inventori, homograf yang diisytiharkan, dan peraturan yang perlu dipatuhi oleh operator baharu untuk wujud — ada dalam `SYMBOLS.md`, dalam repositori penterjemah.

---

## Rujukan Simbol

| Simbol | Operasi | Simbol | Operasi |
|--------|-----------|--------|-----------|
| `=` | pemboleh ubah | `$#` | panjang |
| `:=` | pemalar | `$+` | tambah |
| `>>` | output | `$+[i]` | sisip pada indeks (bermula 1) |
| `<<` | input | `$-` | buang yang pertama mengikut nilai |
| `¶` / `\\` | baris baharu | `$--` | buang semua mengikut nilai |
| `?` | jika | `$-[i]` | buang pada indeks (bermula 1) |
| `_?` | jika tidak | `$-[i..j]` | buang julat (bermula 1) |
| `_` | jika tidak / kad bebas | `$?` | mengandungi |
| `??` | padanan | `$??` | cari semua indeks (bermula 1) |
| `\|\|` | corak atau dalam cabang padanan | `$[s..e]` | hirisan (bermula 1) |
| `@` | gelung | `$>` | peta |
| `@ N { }` | gelung N kali | `$\|` | tapis |
| `@!` | putus | `$<` | kurangkan |
| `@>` | teruskan | `$/ pemisah` | pisah string |
| `@:nama { }` | gelung berlabel | `$++ a b c` | bina melalui gabungan |
| `@:nama!` | putus label | `$~~[p:r]` | ganti dalam string |
| `@:nama>` | teruskan label | `$*` | ulang string |
| `->` | lambda | `array[i]$~ v` | SATU-SATUNYA bentuk kemas kini |
| `<~` | kembali / parameter output | `~` | parameter salinan kerja |
| `array[i>j]` | indeks navigasi | `array[p ; q]` | pengekstrakan rata |
| `$^+` | susun menaik | `$^-` | susun menurun |
| `$^` | susun dengan pembanding | `\|>` | paip |
| `!?` | cuba | `:!` | tangkap |
| `:>` | akhirnya | `$!` | ralat ke |
| `$!!` | sebarkan ralat | `#1` / `#0` | benar / palsu |
| `##_` | Unit — ketidakhadiran | `[…]` | array, satu jenis |
| `#[…]` | array, campuran diisytihar | `#(…)` | kamus |
| `(…)` | tuple berkedudukan | `#()` | kamus kosong |
| `<#` | import | `#>` | eksport |
| `#` | isytihar modul | `::` | panggil modul |
| `.` | akses medan / pemalar | `#?` | metadata jenis |
| `#\|..\|` | hurai nombor | `##.` | tukar ke Float |
| `###` | tukar ke Integer (bundar) | `##!` | tukar ke Integer (potong) |
| `#.N\|..\|` | bundar | `#!N\|..\|` | potong |
| `#,\|..\|` | pemisah ribuan | `#^\|..\|` | saintifik |
| `#d0d9#` | tukar mod nombor | `#09#` | tetapkan semula ke ASCII |
| `<\ ..\>` | laksana shell | `><` | argumen CLI |
| `\ var` | musnahkan pemboleh ubah | `°x` / `x°` | definisi panas |
| `>>\|` | blok TUI (skrin ganti) | `>>~` | output berkedudukan |
| `>>!` | bersihkan skrin | `>>?` | tanya saiz terminal |
| `<<\|` | tekanan kekunci menyekat | `<<\|?` | tekanan kekunci tidak menyekat |
| `@~ N` | tidur N milisaat | `0d` `0x` `0o` `0b` | literal asas |

---

## Log Perubahan Keluaran

### v0.0.9 — Koleksi Memutuskan _(September 2026)_

- **Pemecahan** Kamus mempunyai tatatanda sendiri: `#(kunci: nilai)`. `(x: 1)` yang telanjang ditolak, dan `#()` ialah kamus kosong — yang `()` tidak pernah boleh jadi
- **Pemecahan** Penetapan berindeks ditarik balik: `array[i] = v` dan semua bentuk majmuk. `=` memberi nilai kepada **NAMA**; mengubah sebahagian koleksi ialah `$~`
- **Pemecahan** Indeks berantai `m[i][j]` ditolak untuk pembacaan dan penulisan — `>` ialah apa yang pergi antara langkah
- **Pemecahan** Modul mesti mengisytiharkan apa yang dieksportnya (**E014**); `#> { }` ialah cara modul mengatakan permukaannya kosong
- **Pemecahan** Penentu gelung ialah kiraan atau syarat — tiada kebenaran. `@ []` dan `@ 3.5` ditolak
- **Ditambah** `##_` — literal Unit, dan cara program bertanya sama ada sesuatu itu tiada
- **Ditambah** `#[…]` — array yang campuran jenis elemennya diisytiharkan
- **Ditambah** `#?` membezakan empat koleksi: `##]` `##[` `##)` `##(`
- **Ditambah** `std/time` — jam dan kalendar sivil, dengan zon dan aritmetik kalendar
- **Ditambah** `<~>` di peringkat tertinggi ialah status keluar program
- **Ditambah** `@ (k, v):pasangan` — corak dalam kepala gelung
- **Ditambah** `#|c|` membaca digit dalam mana-mana 69 skrip; `#,` dan `#^` menulis dalam yang aktif
- **Diubah** `Integer` ialah integer selamat, ±(2⁵³ − 1), gagal-tertutup dalam setiap enjin
- **Diubah** Fungsi bernama membaca pemboleh ubah fail pada masa panggilan, mengikut nilai
- **Diubah** Pernyataan yang hanya membaca nama memberi amaran daripada berlalu dengan senyap
- **Enjin** 660 daripada 666 fail korpus bersetuju dalam ketiga-tiga enjin, 0 menyimpang

### v0.0.8 — Auto-bebas, `std/term` dan Pakej _(Ogos 2026)_

- **Ditambah** Pemusnahan automatik pada penggunaan terakhir — tidak kelihatan; hanya mengurangkan memori puncak
- **Ditambah** `std/term` — metrik paparan dalam lajur terminal
- **Ditambah** `##!` pada `Char` — titik kod Unicodenya
- **Ditambah** Corak atau dalam padanan: `'p' || 'P' => …`, alternatif apa-apa jenis dalam satu cabang
- **Ditambah** Pakej Zymbol (`.zyp`) — `zymbol package` / `zymbol run pkg.zyp`
- **Ditambah** `<~>` di tapak panggilan adalah wajib di mana callee mengisytiharkan parameter output
- **Dibaiki** Pariti sistem modul dalam VM daftar

### v0.0.7 — Pustaka Standard Asli _(Julai 2026)_

- **Ditambah** `std/json`, `std/io`, `std/net`, `std/db` (ODBC) — semua dengan nilai ralat lembut
- **Ditambah** Input bertaip/disahkan: `<< ##.(5,2) "harga: " p`
- **Ditambah** Operator postfix terus dalam `>>` — tiada kurungan diperlukan
- **Diubah** Pemformat gagal-tertutup: ia enggan menulis output yang tidak boleh dibaca semula

### v0.0.6 — Penghalusan dan Stdlib Saintifik _(Jun 2026)_

- **Pemecahan** `=>` menggantikan `:` dalam cabang padanan dan `<=` dalam alias import/eksport
- **Ditambah** `std/math` dan `std/random`
- **Ditambah** Kemas kini kamus mengikut kunci: `d["k"]$~ nilai`

### v0.0.5 — Primitif TUI dan Definisi Panas _(Mei 2026)_

- **Ditambah** Blok TUI `>>| { }`, output berkedudukan `>>~`, input kekunci `<<|` dan `<<|?`
- **Ditambah** `>>!` bersihkan skrin, `>>?` saiz terminal, `@~ N` tidur
- **Ditambah** Definisi panas `°x` / `x°`, dan ulangan string `$*`

### v0.0.4 — Pengindeksan Bermula 1 dan Fungsi Kelas Pertama _(April 2026)_

- **Pemecahan** Semua pengindeksan **bermula 1** — `array[1]` ialah elemen pertama
- **Ditambah** Fungsi bernama sebagai nilai kelas pertama; sintaks blok modul `# nama { }`
- **Ditambah** Pengindeksan berbilang dimensi `array[i>j>k]` dan pengekstrakan rata `array[p ; q]`

### v0.0.3 — Sistem Nombor Unicode _(April 2026)_

- **Ditambah** 69 blok digit Unicode dengan token tukar mod `#d0d9#`
- **Ditambah** Literal boolean dalam mana-mana skrip — `#१` / `#०`

### v0.0.2 — Reka Semula API Koleksi _(Mac 2026)_

- **Ditambah** Keluarga operator `$` untuk array dan string
- **Ditambah** Penetapan penguraian struktur, dan indeks negatif

### v0.0.1 — Keluaran Awam Pertama _(Mac 2026)_

- Penterjemah pejalan pokok + VM daftar (`--vm`)
- Semua binaan teras: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Pengecam Unicode penuh, sistem modul, lambda, penutupan, pengendalian ralat
- REPL, LSP, sambungan VS Code, pemformat (`zymbol fmt`)

---

_Zymbol-Lang — Simbolik. Universal. Tidak Berubah._

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

---

**Lesen:** manual ini dilesenkan di bawah [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — © 2024-2026 Zymbol-Lang Team. Teks penuh: `LICENSE-CC-BY-SA-4.0` dalam <https://github.com/zymbol-lang/web>. Penterjemah dan enjin pelayar (`zymbol.js`) ialah karya berasingan, dilesenkan di bawah AGPL-3.0-only.
