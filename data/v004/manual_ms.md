> **Pemberitahuan:** Dokumentasi ini dihasilkan dengan bantuan kecerdasan buatan (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Rujukan kanonik ialah **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** di repositori penterjemah.

---

# Manual Zymbol-Lang

**Zymbol-Lang** ialah bahasa pengaturcaraan simbolik. Tiada kata kunci — semuanya adalah simbol. Berfungsi sama dalam mana-mana bahasa manusia.

- Tiada `if`, `while`, `return` — hanya `?`, `@`, `<~`
- Unicode penuh — pengecam dalam mana-mana bahasa atau emoji
- Agnostik bahasa manusia — kodnya sama di mana-mana

**Versi penterjemah**: v0.0.4 | **Liputan ujian**: 393/393 (pariti TW ↔ VM)

---

## Pemboleh Ubah dan Pemalar

```zymbol
x = 10              // pemboleh ubah boleh ubah
PI := 3.14159       // pemalar — penugasan semula ialah ralat masa jalan
nama = "Alice"
aktif = #1          // Boolean benar
👋 := "Halo"
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

## Jenis Data

| Jenis | Literal | Tag `#?` | Catatan |
|-------|---------|----------|---------|
| Integer | `42`, `-7` | `###` | 64-bit bertanda |
| Titik Apung | `3.14`, `1.5e10` | `##.` | Notasi saintifik dibenarkan |
| String | `"teks"` | `##"` | Interpolasi: `"Halo {nama}"` |
| Aksara | `'A'` | `##'` | Satu aksara Unicode |
| Boolean | `#1`, `#0` | `##?` | BUKAN angka — `#1 ≠ 1` |
| Tatasusunan | `[1, 2, 3]` | `##]` | Unsur homogen |
| Tuple | `(a, b)` | `##)` | Posisional |
| Tuple bernama | `(x: 1, y: 2)` | `##)` | Medan bernama |
| Fungsi | rujukan fungsi bernama | `##()` | Kelas pertama; papar `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Kelas pertama; papar `<lambd/N>` |

```zymbol
// Introspeksi jenis — kembalikan (jenis, digit, nilai)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Output dan Input

```zymbol
>> "Halo" ¶                       // ¶ atau \\ untuk baris baru eksplisit
>> "a=" a " b=" b ¶               // juxtaposisi — pelbagai nilai
>> (arr$#) ¶                      // operator postfix memerlukan ( ) dalam >>

<< nama                           // baca ke pemboleh ubah (tanpa prompt)
<< "Masukkan nama: " nama         // dengan prompt
```

> `¶` (AltGr+R pada papan kekunci Sepanyol) dan `\\` adalah setara untuk baris baru.

---

## Operator

```zymbol
// Aritmetik — gunakan penugasan; sesetengah operator mempunyai keanehan terus dalam >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (pembahagian integer)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (pemangkatan)

// Perbandingan
a == b    // #0    
a <> b    // #1    
a < b     // #0
a <= b    // #0   
a > b     // #1    
a >= b    // #1

// Logik
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## String

```zymbol
// Dua bentuk penggabungan
nama = "Alice"
n = 42

>> "Halo " nama " anda mempunyai " n ¶       // juxtaposisi — dalam >>
huraian = "Halo {nama}, anda mempunyai {n}"   // interpolasi — di mana sahaja
```

```zymbol
s = "Halo Dunia"
panjang = s$#                  // 9
sub = s$[1..4]                 // "Halo"  (asas-1, akhir termasuk)
ada = s$? "Dunia"              // #1
bahagian = "a,b,c,d"$/ ','     // [a, b, c, d]  (pisah dengan pemisah)
ganti = s$~~["a":"o"]          // "Holo Dunio"
ganti1 = s$~~["a":"o":1]       // "Holo Dunia"  (hanya N pertama)
```

> `+` hanya untuk nombor. Gunakan `,`, juxtaposisi, atau interpolasi untuk string.

---

## Aliran Kawalan

```zymbol
x = 7

? x > 0 { >> "positif" ¶ }

? x > 100 {
    >> "besar" ¶
} _? x > 0 {
    >> "positif" ¶
} _? x == 0 {
    >> "sifar" ¶
} _ {
    >> "negatif" ¶
}
```

> Pendakap kerinting `{ }` **wajib** walaupun untuk satu pernyataan.

---

## Padanan (Match)

```zymbol
// Julat
skor = 85
gred = ?? skor {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> gred ¶      // → B

// String
warna = "merah"
kod = ?? warna {
    "merah"  : "#FF0000"
    "hijau"  : "#00FF00"
    _        : "#000000"
}

// Corak perbandingan
suhu = -5
keadaan = ?? suhu {
    < 0  : "ais"
    < 20 : "sejuk"
    < 35 : "suam"
    _    : "panas"
}
>> keadaan ¶    // → ais

// Bentuk pernyataan (blok)
?? n {
    0        : { >> "sifar" ¶ }
    _? n < 0 : { >> "negatif" ¶ }
    _        : { >> "positif" ¶ }
}
```

---

## Gelung

```zymbol
@ i:0..4  { >> i " " }        // julat termasuk:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // dengan langkah:   1 3 5 7 9
@ i:5..0:1 { >> i " " }       // terbalik:        5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (selagi)

buah = ["epal", "pir", "anggur"]
@ b:buah { >> b ¶ }            // untuk setiap unsur tatasusunan

@ a:"halo" { >> a "-" }
>> ¶                          // → h-a-l-o-  (untuk setiap aksara string)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> teruskan
    ? i > 7 { @! }            // @! hentikan
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Gelung tak terhingga
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Gelung berlabel (hentian bersarang)
pembilang = 0
@:luar {
    pembilang++
    ? pembilang >= 3 { @:luar! }
}
>> pembilang ¶                // → 3
```

---

## Fungsi

```zymbol
tambah(a, b) { <~ a + b }
>> tambah(3, 4) ¶   // → 7

faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120
```

Fungsi mempunyai **skop terpencil** — mereka tidak boleh membaca pemboleh ubah luar. Gunakan parameter output `<~` untuk mengubah pemboleh ubah pemanggil:

```zymbol
tukar(a<~, b<~) {
    tmp = a
    a = b
    b = tmp
}
x = 10
y = 20
tukar(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Fungsi bernama adalah **nilai kelas pertama** — hantar terus: `nums$> ganda`. `x -> fn(x)` juga sah.

---

## Lambda dan Penutupan

```zymbol
ganda = x -> x * 2
tambah = (a, b) -> a + b
>> ganda(5) ¶    // → 10
>> tambah(3, 7) ¶ // → 10

// Lambda blok
klasifikasi = x -> {
    ? x > 0 { <~ "positif" }
    _? x < 0 { <~ "negatif" }
    <~ "sifar"
}

// Penutupan — menangkap skop luar
faktor = 3
tiga_kali = x -> x * faktor
>> tiga_kali(7) ¶    // → 21

// Kilang
buat_penambah(n) { <~ x -> x + n }
tambah10 = buat_penambah(10)
>> tambah10(5) ¶     // → 15

// Dalam tatasusunan
ops = [x -> x+1, x -> x*2, x -> x*x]
>> ops[3](5) ¶       // → 25
```

---

## Tatasusunan

Tatasusunan **boleh diubah** dan mengandungi unsur **jenis yang sama**.

```zymbol
arr = [1, 2, 3, 4, 5]

arr[1]          // 1 — akses (asas-1: unsur pertama)
arr[-1]         // 5 — indeks negatif (unsur terakhir)
arr$#           // 5 — panjang (guna (arr$#) dalam >>)

arr = arr$+ 6            // tambah → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // sisip di posisi 2 (asas-1)
arr3 = arr$- 3           // hapus kemunculan pertama nilai
arr4 = arr$-- 3          // hapus semua kemunculan
arr5 = arr$-[1]          // hapus di indeks 1 (unsur pertama)
arr6 = arr$-[2..3]       // hapus julat (asas-1, akhir termasuk)

ada = arr$? 3            // #1 — mengandungi
posisi = arr$?? 3        // [3] — semua indeks nilai (asas-1)
hirisan = arr$[1..3]     // [1,2,3] — hirisan (asas-1, akhir termasuk)
hirisan2 = arr$[1:3]     // [1,2,3] — sama, sintaks berdasarkan kiraan

naik = arr$^+            // susun menaik (primitif sahaja)
turun = arr$^-           // susun menurun (primitif sahaja)

// Tatasusunan tuple bernama/posisional — guna $^ dengan lambda perbandingan
db = [(nama: "Carla", umur: 28), (nama: "Ana", umur: 25), (nama: "Bob", umur: 30)]
mengikut_umur  = db$^ (a, b -> a.umur < b.umur)     // menaik mengikut umur (<)
mengikut_nama  = db$^ (a, b -> a.nama > b.nama)     // menurun mengikut nama (>)
>> mengikut_umur[1].nama ¶    // → Ana
>> mengikut_nama[1].nama ¶    // → Carla

// Kemas kini unsur terus (hanya tatasusunan)
arr[1] = 99              // tugaskan
arr[2] += 5              // majmuk: +=  -=  *=  /=  %=  ^=

// Kemas kini fungsional — kembalikan tatasusunan baru; asli tidak berubah
arr2 = arr[2]$~ 99
```

> Semua operator koleksi mengembalikan **tatasusunan baru**. Tugaskan semula: `arr = arr$+ 4`.
> `$+` boleh dirantai: `arr = arr$+ 5$+ 6$+ 7`. Operator lain menggunakan penugasan perantaraan.
> **Pengindeksan adalah asas-1**: `arr[1]` ialah unsur pertama; `arr[0]` ialah ralat masa jalan.
> `$^+` / `$^-` menyusun **tatasusunan primitif** (nombor, string). Untuk tatasusunan tuple guna `$^` dengan lambda perbandingan — arah dikodkan dalam lambda (`<` = menaik, `>` = menurun).

**Semantik nilai** — menugaskan tatasusunan kepada pemboleh ubah lain mencipta salinan bebas:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b tidak terjejas
```

```zymbol
// Tatasusunan bersarang (pengindeksan asas-1)
matriks = [[1,2,3],[4,5,6],[7,8,9]]
>> matriks[2][3] ¶    // → 6  (baris 2, lajur 3)
```

---

## Destrukturisasi

```zymbol
// Tatasusunan
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[pertama, *selebihnya] = arr // pertama=10  selebihnya=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ mengabaikan

// Tuple posisional
titik = (100, 200)
(px, py) = titik             // px=100  py=200

// Tuple bernama
orang = (nama: "Ana", umur: 25, bandar: "Madrid")
(nama: n, umur: u) = orang   // n="Ana"  u=25
```

---

## Tuple

Tuple ialah bekas tertib **tidak boleh diubah** yang boleh menyimpan nilai **jenis berbeza**.
Tidak seperti tatasusunan, unsur tidak boleh diubah selepas penciptaan.

```zymbol
// Posisional — jenis bercampur dibenarkan
titik = (10, 20)
>> titik[1] ¶     // → 10

data = (42, "halo", #1, 3.14)
>> data[3] ¶      // → #1

// Bernama
orang = (nama: "Alice", umur: 25)
>> orang.nama ¶    // → Alice
>> orang[1] ¶      // → Alice  (indeks juga berfungsi, asas-1)

// Bersarang
pos = (x: 10, y: 20)
p = (pos: pos, label: "asal")
>> p.pos.x ¶       // → 10
```

**Ketidakbolehuubahan** — sebarang percubaan untuk mengubah unsur tuple ialah ralat masa jalan:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ ralat masa jalan: tuple tidak boleh diubah
// t[1] += 5    // ❌ ralat yang sama

// Tuple bernama — bina semula secara eksplisit
orang = (nama: "Alice", umur: 25)
lebih_tua = (nama: orang.nama, umur: 26)
>> orang.umur ¶    // → 25
>> lebih_tua.umur ¶ // → 26
```

Untuk mendapatkan nilai yang diubah guna `$~` (kemas kini fungsional) — mengembalikan tuple **baru**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← asli tidak berubah
>> t2 ¶    // → (10, 999, 30)
```

---

## Fungsi Tertib Tinggi

```zymbol
nombor = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

digandakan = nombor$> (x -> x * 2)                 // peta → [2,4,6…20]
genap   = nombor$| (x -> x % 2 == 0)              // tapis → [2,4,6,8,10]
jumlah   = nombor$< (0, (akum, x) -> akum + x)     // reduksi → 55

// Rantai melalui perantaraan
langkah1 = nombor$| (x -> x > 3)
langkah2 = langkah1$> (x -> x * x)
>> langkah2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Fungsi bernama boleh dihantar terus ke fungsi tertib tinggi
ganda(x) { <~ x * 2 }
besar(x) { <~ x > 5 }
r = nombor$> ganda       // ✅ rujukan terus
r = nombor$| besar       // ✅ rujukan terus
```

---

## Operator Paip

Sebelah kanan sentiasa memerlukan `_` sebagai tempat letak untuk nilai yang dipaip:

```zymbol
ganda = x -> x * 2
tambah = (a, b) -> a + b
inc = x -> x + 1

5 |> ganda(_)        // → 10
10 |> tambah(_, 5)   // → 15
5 |> tambah(2, _)    // → 7

// Dirantai
r = 5 |> ganda(_) |> inc(_) |> ganda(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Pengendalian Ralat

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "pembahagian dengan sifar" ¶
} :! {
    >> "ralat lain: " _err ¶    // _err menyimpan mesej ralat
} :> {
    >> "sentiasa dijalankan" ¶
}
```

| Jenis | Bila |
|-------|------|
| `##Div` | Pembahagian dengan sifar |
| `##IO` | Fail / sistem |
| `##Index` | Indeks di luar sempadan |
| `##Type` | Ketidakpadanan jenis |
| `##Parse` | Penghuraian data |
| `##Network` | Ralat rangkaian |
| `##_` | Sebarang ralat (tangkap semua) |

---

## Modul

```zymbol
// lib/calc.zy — badan modul berada dalam pendakap kerinting
# calc {
    #> { tambah, get_PI }

    _PI := 3.14159
    tambah(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // alias wajib

>> c::tambah(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶               // → 3.14159
```

```zymbol
// Eksport dengan nama awam berbeza
# perpustakaan_saya {
    #> { _tambah_dalaman <= jumlah }

    _tambah_dalaman(a, b) { <~ a + b }
}
```

```zymbol
<# ./perpustakaan_saya <= m

>> m::jumlah(3, 4) ¶    // → 7  (nama dalaman _tambah_dalaman tersembunyi)
```

> **Peraturan modul**: hanya `#>`, definisi fungsi, dan penginisialisasi pemboleh ubah/pemalar literal dibenarkan dalam `# nama { }`. Pernyataan yang boleh dilaksanakan (`>>`, `<<`, gelung, dll.) mencetuskan ralat E013.

---

## Mod Angka

Zymbol boleh memaparkan nombor dalam **69 blok digit Unicode** — Dewanagari, Arab-India, Thai, Klingon pIqaD, Tebal Matematik, segmen LCD, dan lain-lain. Mod aktif hanya mempengaruhi output `>>`; aritmetik dalaman sentiasa perduaan.

### Mengaktifkan skrip

Tulis digit `0` dan `9` skrip sasaran di dalam `#…#`:

```zymbol
#०९#    // Dewanagari    (U+0966–U+096F)
#٠٩#    // Arab-India    (U+0660–U+0669)
#๐๙#    // Thai          (U+0E50–U+0E59)
#09#    // tetapan semula ke ASCII
```

### Output dan Boolean

```zymbol
x = 42
>> x ¶          // → 42   (lalai ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (titik perpuluhan sentiasa ASCII)
>> 1 + 2 ¶      // → ३

// Boolean: awalan # sentiasa ASCII, digit menyesuaikan
>> #1 ¶         // → #१   (benar dalam Dewanagari)
>> #0 ¶         // → #०   (palsu — berbeza daripada ० integer sifar)

x = 28 > 4
>> x ¶          // → #१   (hasil perbandingan mengikut mod aktif)
```

### Literal digit asli dalam kod sumber

Digit dari mana-mana skrip yang disokong adalah literal yang sah — dalam julat, modulo, perbandingan:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Literal Boolean dalam mana-mana skrip

`#` + digit `0` atau `1` dari mana-mana blok adalah literal Boolean yang sah:

```zymbol
#०९#
aktif = #१        // sama dengan #1
>> aktif ¶        // → #१
>> (#१ && #०) ¶   // → #०
```

> `#` **sentiasa ASCII**. `#0` (palsu) sentiasa berbeza secara visual daripada `0` (integer sifar) dalam setiap skrip.

---

## Operator Data

```zymbol
// Penukaran jenis
##.42         // → 42.0  (ke Titik Apung)
###3.7        // → 4     (ke Integer, bulatkan)
##!3.7        // → 3     (ke Integer, potong)

// Huraikan string ke nombor
v1 = #|"42"|      // → 42  (Integer)
v2 = #|"3.14"|    // → 3.14  (Titik Apung)
v3 = #|"abc"|     // → "abc"  (selamat, tiada ralat)

// Bulatkan / potong
pi = 3.14159265
b2 = #.2|pi|      // → 3.14  (bulatkan ke 2 tempat perpuluhan)
b4 = #.4|pi|      // → 3.1416
p2 = #!2|pi|      // → 3.14  (potong)

// Pemformatan nombor
fmt = #,|1234567|  // → 1,234,567  (dipisah koma)
sci = #^|12345.678| // → 1.2345678e4  (saintifik)

// Literal asas
a = 0x41         // → 'A'  (heksadesimal)
b = 0b01000001   // → 'A'  (perduaan)
c = 0o101        // → 'A'  (oktal)

// Output penukaran asas
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
dec = 0d|255|    // → "0d0255"
```

---

## Integrasi Shell

```zymbol
tarikh = <\ date +%Y-%m-%d \>     // tangkap stdout (termasuk \n di akhir)
>> "Hari ini: " tarikh

fail = "data.txt"
kandungan = <\ cat {fail} \>       // interpolasi dalam arahan

output = </"./subscript.zy"/>      // jalankan skrip Zymbol lain, tangkap output
>> output
```

> `><` menangkap argumen CLI sebagai tatasusunan string (hanya tree-walker).

---

## Contoh Lengkap: FizzBuzz

```zymbol
klasifikasi(nombor) {
    ? nombor % 15 == 0 { <~ "FizzBuzz" }
    _? nombor % 3  == 0 { <~ "Fizz" }
    _? nombor % 5  == 0 { <~ "Buzz" }
    _ { <~ nombor }
}

@ i:1..20 { >> klasifikasi(i) ¶ }
```

---

## Rujukan Simbol

| Simbol | Operasi | Simbol | Operasi |
|--------|---------|--------|---------|
| `=` | pemboleh ubah | `$#` | panjang |
| `:=` | pemalar | `$+` | tambah (boleh dirantai) |
| `>>` | output | `$+[i]` | sisip di indeks (asas-1) |
| `<<` | input | `$-` | hapus pertama berdasarkan nilai |
| `¶` / `\\` | baris baru | `$--` | hapus semua berdasarkan nilai |
| `?` | jika | `$-[i]` | hapus di indeks (asas-1) |
| `_?` | jika tidak jika | `$-[i..j]` | hapus julat (asas-1) |
| `_` | jika tidak / wildcard | `$?` | mengandungi |
| `??` | padan | `$??` | cari semua indeks (asas-1) |
| `@` | gelung | `$[s..e]` | hirisan (asas-1) |
| `@ N { }` | gelung N kali | `$>` | peta |
| `@!` | hentikan | `$|` | tapis |
| `@>` | teruskan | `$<` | reduksi |
| `@:nama { }` | gelung berlabel | `$/ pemisah` | pemisahan string |
| `@:nama!` | hentikan berlabel | `$++ a b c` | binaan penggabungan |
| `@:nama>` | teruskan berlabel | `arr[i>j>k]` | indeks navigasi |
| `->` | lambda | `arr[i] = nilai` | kemas kini unsur (hanya tatasusunan) |
| `arr[i] += nilai` | kemas kini majmuk | `arr[i]$~` | kemas kini fungsional (salinan baru) |
| `$^+` | susun menaik (primitif) | `$^-` | susun menurun (primitif) |
| `$^` | susun dengan pembanding (tuple) | `<~` | kembali |
| `|>` | paip | `!?` | cuba |
| `:!` | tangkap | `:>` | akhirnya |
| `#1` | benar | `#0` | palsu |
| `$!` | adalah ralat | `$!!` | sebarkan ralat |
| `<#` | import | `#>` | eksport |
| `#` | isytihar modul | `::` | panggil modul |
| `.` | akses medan | `#?` | metadata jenis |
| `#\|..\|` | hurai nombor | `##.` | tukar ke Titik Apung |
| `###` | tukar ke Integer (bulatkan) | `##!` | tukar ke Integer (potong) |
| `#.N\|..\|` | bulatkan | `#!N\|..\|` | potong |
| `#,\|..\|` | format koma | `#^\|..\|` | saintifik |
| `#d0d9#` | ubah mod angka | `#09#` | tetapan semula ke ASCII |
| `<\ ..\>` | jalankan shell | `>\<` | argumen CLI |
| `\ var` | musnahkan pemboleh ubah secara eksplisit | | |

---

## Log Perubahan Keluaran

### v0.0.4 — Pengindeksan Asas-1, Fungsi Kelas Pertama & Blok Modul _(April 2026)_

- **Pemecah** Semua pengindeksan ditukar kepada **asas-1** — `arr[1]` ialah unsur pertama; `arr[0]` ialah ralat masa jalan
- **Ditambah** Fungsi bernama ialah **nilai kelas pertama** — hantar terus ke fungsi tertib tinggi: `nums$> ganda`
- **Ditambah** **Sintaks blok** modul wajib: `# nama { ... }` — sintaks rata dialih keluar
- **Ditambah** Pengindeksan multidimensi: `arr[i>j>k]` (navigasi), `arr[p ; q]` (pengekstrakan rata)
- **Ditambah** Penukaran jenis: `##.ungkapan` (Titik Apung), `###ungkapan` (Integer bulatkan), `##!ungkapan` (Integer potong)
- **Ditambah** Pemisahan string: `str$/ pemisah` — kembalikan `Array(String)`
- **Ditambah** Binaan penggabungan: `asas$++ a b c` — tambah pelbagai item
- **Ditambah** Gelung N kali: `@ N { }` — ulang tepat N kali
- **Ditambah** Sintaks gelung berlabel: `@:nama { }`, `@:nama!`, `@:nama>` — menggantikan `@ @nama` / `@! nama`
- **Ditambah** Peraturan skop pemboleh ubah: pemboleh ubah `_nama` mempunyai skop blok tepat; `\ var` musnah awal
- **Ditambah** Corak perbandingan padanan: `< 0 :`, `> 5 :`, `== 42 :` dll.
- **Ditambah** Ralat modul E013: pernyataan yang boleh dilaksanakan dalam badan modul adalah dilarang
- **Diperbaiki** `take_variable` tidak lagi merosakkan pemalar modul semasa menulis semula
- **Diperbaiki** `alias.CONST` kini diselesaikan dengan betul; `#>` boleh muncul selepas definisi fungsi
- **VM** Pariti penuh: 393/393 ujian lulus

### v0.0.3 — Sistem Angka Unicode & Penambahbaikan LSP _(April 2026)_

- **Ditambah** 69 blok digit Unicode dengan token suis mod `#d0d9#`
- **Ditambah** Literal Boolean dalam mana-mana skrip — `#१` / `#०`, `#१` / `#०`, dll.
- **Ditambah** Digit Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Ditambah** Opkod VM `SetNumeralMode` — pariti penuh dengan tree-walker
- **Ditambah** REPL menghormati mod angka aktif dalam gema dan paparan pemboleh ubah
- **Diubah** Output Boolean `>>` kini merangkumi awalan `#` (`#0` / `#1`) dalam semua mod

### v0.0.2_01 — Penamaan Semula Operator _(30 Mac 2026)_

- **Diubah** `c|..|` → `#,|..|` dan `e|..|` → `#^|..|` — konsisten dengan keluarga awalan format `#`
- **Ditambah** Alias eksport: eksport semula ahli modul dengan nama berbeza

### v0.0.2 — Reka Bentuk Semula API Koleksi & Pemasang _(24 Mac 2026)_

- **Ditambah** Keluarga operator `$` bersepadu untuk tatasusunan dan string (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Ditambah** Penugasan destrukturisasi untuk tatasusunan, tuple, dan tuple bernama
- **Ditambah** Indeks negatif (`arr[-1]` = unsur terakhir)
- **Ditambah** Pemasang asli — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Mac 2026)_

- **Ditambah** Penugasan majmuk `^=`
- **Diperbaiki** Kes tepi aritmetik penghurai; pembetulan dokumentasi

### v0.0.1 — Keluaran Awam Pertama _(22 Mac 2026)_

- Penterjemah tree-walker + VM daftar (`--vm`, ~4× lebih cepat, ~95% pariti)
- Semua binaan teras: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Pengecam Unicode penuh, sistem modul, lambda, penutupan, pengendalian ralat
- REPL, LSP, sambungan VS Code, pemformat (`zymbol fmt`)

---

_Zymbol-Lang — Simbolik. Universal. Tidak Berubah._
