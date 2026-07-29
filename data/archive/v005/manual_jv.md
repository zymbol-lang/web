> **Panyaru:** Dokumentasi iki digawe lan diterjemahake dening intelijensi buatan (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Referensi kanonik yaiku **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** ing repositori interpreter.

---

# Manual Zymbol-Lang

> **Direvisi kanggo v0.0.5 — 2026-05-16**

**Zymbol-Lang** iku basa pemrograman simbolis. Ora ana tembung kunci — kabeh iku simbol. Kerjane padha ing saben basa manungsa.

- Ora ana `if`, `while`, `return` — mung `?`, `@`, `<~`
- Unicode lengkap — pengenal ing sembarang basa utawa emoji
- Netral marang basa manungsa — kode padha ing endi wae

**Versi interpreter**: v0.0.5 | **Jangkoan tes**: 436/436 (paritas TW ↔ VM)

---

## Variabel lan Konstanta

```zymbol
x = 10              // variabel sing bisa diganti
π := 3.14159        // konstanta — nugasake maneh iku kesalahan wektu mlaku
jeneng = "Alice"
aktif = #1         // boolean bener
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

`°` (tandha derajat, U+00B0) miwiti variabel kanthi otomatis menyang nilai netral nalika panggunaan pisanan:

```zymbol
angka = [3, 1, 4, 1, 5]
@ n:angka {
    °total += n    // miwiti otomatis dadi 0 ing ndhuwur loop; urip sawise @
}
>> total ¶         // → 14
```

> `°x` (ater-ater) jangkar ing ndhuwur loop — asil bisa diakses sawise `@`.
> `x°` (panambang) jangkar ing jero loop — mati nalika loop rampung.
> Mung tree-walker.

---

## Jinis Data

| Jinis | Literal | Tag `#?` | Cathetan |
|------|---------|----------|---------|
| Integer | `42`, `-7` | `###` | 64-bit tandha |
| Ngambang | `3.14`, `1.5e10` | `##.` | Notasi ilmiah diidini |
| String | `"teks"` | `##"` | Interpolasi: `"Halo {jeneng}"` |
| Karakter | `'A'` | `##'` | Siji karakter Unicode |
| Boolean | `#1`, `#0` | `##?` | Ora numerik — `#1 ≠ 1` |
| Array | `[1, 2, 3]` | `##]` | Unsur homogen |
| Tuple | `(a, b)` | `##)` | Posisional |
| Tuple jeneng | `(x: 1, y: 2)` | `##)` | Bidang jeneng |
| Fungsi | referensi fungsi jeneng | `##()` | Kelas kapisan; nuduhake `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Kelas kapisan; nuduhake `<lambd/N>` |

```zymbol
// Introspeksi jinis — bali (jinis, digit, nilai)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Output lan Input

```zymbol
>> "Halo" ¶                       // ¶ utawa \\ kanggo baris anyar sing jelas
>> "a=" a " b=" b ¶               // juxtaposition — pirang-pirang nilai
>> (arr$#) ¶                      // operator panambang mbutuhake ( ) ing >>

>> jeneng                           // maca menyang variabel (tanpa pituduh)
>> "Ketik jeneng: " jeneng            // karo pituduh
```

> `¶` (AltGr+R ing keyboard Spanyol) lan `\\` iku baris anyar sing padha.

---

## Primitif TUI

Operator antarmuka pangguna terminal kanggo program interaktif. Umume mbutuhake blok `>>| { }` (layar alternatif + mode mentah).

```zymbol
>>| {
    >>!                             // ngresiki layar alternatif
    >>~ (1, 1, 0, 10) > "Mlaku"    // baris 1, kolom 1, fg=10 (ijo)
    @~ 1000                         // mandeg 1 detik (1000 ms)
    >>~ (2, 1) > "Rampung."
}
// terminal dibalekake kanthi otomatis nalika metu
```

```zymbol
// Pencet tombol lan ukuran terminal
>>| {
    [baris, kolom] = >>?              // takon ukuran terminal
    >>~ (1, 1) > "Terminal: " baris " x " kolom
    <<| tombol                         // maca pencet tombol sing ngalangi
    >>~ (2, 1) > "Sampeyan mencet: " tombol
}
```

> `>>!` ngresiki layar. `>>?` bali `[baris, kolom]`. `@~ N` turu N milidetik.
> `<<|` maca siji pencet tombol (ngalangi); `<<|?` polling tanpa ngalangi (bali `'\0'` yen ora ana).
> Tuple output posisional: `(baris, kolom, BKS, fg, bg)` — slot apa wae bisa ditinggal nganggo koma (`>>~ (,,, 196) > "abang"`).
> BKS bitmask: `1`=kandel, `2`=miring, `4`=garis ngisor. Palet warna ANSI 256 (`0`=standar terminal).
> Mung tree-walker (kajaba `>>!`, `>>?`, `@~`, `>>~` sing uga bisa ing `--vm`).

---

## Operator

```zymbol
// Aritmetika
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (pembagian integer)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (eksponensiasi)

// Perbandingan — tugasake kanggo mriksa
c1 = a == b    // #0
c2 = a <> b    // #1
c3 = a < b     // #0
c4 = a <= b    // #0
c5 = a > b     // #1
c6 = a >= b    // #1

// Logika
l1 = #1 && #0    // #0
l2 = #1 || #0    // #1
l3 = !#1         // #0
```

---

## String

```zymbol
// Loro wujud konkatenasi
jeneng = "Alice"
n = 42

>> "Halo " jeneng " sampeyan duwe " n ¶       // juxtaposition — ing >>
deskripsi = "Halo {jeneng}, sampeyan duwe {n}"     // interpolasi — ing endi wae
```

```zymbol
s = "Halo donya"
dawane = s$#                  // 10
sub = s$[1..5]             // "Halo "  (1-basis, pungkasan kalebu)
ana = s$? "donya"          // #1
bagean = "a,b,c,d"$/ ','   // [a, b, c, d]  (dipisah karo pemisah)
ganti = s$~~["l":"r"]        // "Haro donya"
ganti1 = s$~~["l":"r":1]     // "Haro donya"  (mung N pisanan)
garis = "─" $* 20           // "────────────────────"  (baleni N kaping)
```

> `+` mung kanggo angka. Kanggo string, gunakake `,`, juxtaposition, utawa interpolasi.

---

## Kontrol Aliran

```zymbol
x = 7

? x > 0 { >> "positif" ¶ }

? x > 100 {
    >> "gedhe" ¶
} _? x > 0 {
    >> "positif" ¶
} _? x == 0 {
    >> "nol" ¶
} _ {
    >> "negatif" ¶
}
```

> Kurung kurawal `{ }` **wajib** sanajan mung siji pernyataan.

---

## Pencocokan

```zymbol
// Rentang
skor = 85
biji = ?? skor {
    90..100 => 'A'
    80..89  => 'B'
    70..79  => 'C'
    _       => 'D'
}
>> biji ¶    // → B

// String
warna = "abang"
kode = ?? warna {
    "abang"   => "#FF0000"
    "ijo" => "#00FF00"
    _       => "#000000"
}

// Pola perbandingan
suhu = -5
kahanan = ?? suhu {
    < 0  => "es"
    < 20 => "adhem"
    < 35 => "anget"
    _    => "panas"
}
>> kahanan ¶    // → es

// Wangun pernyataan (lengen blok)
n = -3
?? n {
    0    => { >> "nol" ¶ }
    < 0  => { >> "negatif" ¶ }
    _    => { >> "positif" ¶ }
}
```

---

## Loop

```zymbol
@ i:0..4  { >> i " " }        // rentang kalebu:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // kanthi langkah:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // mbalik:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

woh = ["apel", "pir", "anggur"]
@ w:woh { >> w ¶ }         // kanggo saben unsur ing array

@ k:"halo" { >> k "-" }
>> ¶                          // → h-a-l-o-  (kanggo saben karakter ing string)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> terusake
    ? i > 7 { @! }             // @! pedhot
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Loop tanpa wates
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Loop kanthi label (pedhot bersarang)
cacah = 0
@:njaba {
    cacah++
    ? cacah >= 3 { @:njaba! }
}
>> cacah ¶                    // → 3
```

---

## Fungsi

```zymbol
tambah(a, b) { <~ a + b }
>> tambah(3, 4) ¶    // → 7

faktorial(n) {
    ? n <= 1 { <~ 1 }
    <~ n * faktorial(n - 1)
}
>> faktorial(5) ¶    // → 120
```

Fungsi duwe **ruang lingkup terisolasi** — ora bisa maca variabel njaba. Gunakake parameter output `<~>` kanggo ngowahi variabel sing nelpon:

```zymbol
ganti(a<~, b<~) {
    sauntara = a
    a = b
    b = sauntara
}
x = 10
y = 20
ganti(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Fungsi sing dijenengi iku **nilai kelas kapisan** — langsung wenehake: `angka$> pindho`. Kanggo mbungkus: `x -> fn(x)` uga sah.

---

## Lambda lan Penutupan

```zymbol
pindho = x -> x * 2
tambah = (a, b) -> a + b
>> pindho(5) ¶    // → 10
>> tambah(3, 7) ¶  // → 10

// Lambda blok
klasifikasi = x -> {
    ? x > 0 { <~ "positif" }
    _? x < 0 { <~ "negatif" }
    <~ "nol"
}

// Penutupan — njupuk ruang lingkup njaba
faktor = 3
telu = x -> x * faktor
>> telu(7) ¶    // → 21

// Pabrik
gawe_tambah(n) { <~ x -> x + n }
tambah_sepuluh = gawe_tambah(10)
>> tambah_sepuluh(5) ¶    // → 15

// Ing array
operator = [x -> x+1, x -> x*2, x -> x*x]
>> operator[3](5) ¶    // → 25
```

---

## Array

Array **bisa diganti** lan ngemot unsur **saka jinis sing padha**.

```zymbol
arr = [1, 2, 3, 4, 5]

x = arr[1]      // 1 — akses (1-basis: unsur pisanan)
x = arr[-1]     // 5 — indeks negatif (unsur pungkasan)
x = arr$#       // 5 — dawane (gunakake (arr$#) ing >>)

arr = arr$+ 6            // tambahake → [1,2,3,4,5,6]
arr2 = arr$+[2] 99       // selipake ing posisi 2 (1-basis)
arr3 = arr$- 3           // busak kedadeyan pisanan saka nilai
arr4 = arr$-- 3          // busak kabeh kedadeyan
arr5 = arr$-[1]          // busak ing indeks 1 (unsur pisanan)
arr6 = arr$-[2..3]       // busak rentang (1-basis, pungkasan kalebu)

ana = arr$? 3            // #1 — ngemot
panggonan = arr$?? 3           // [3] — kabeh indeks saka nilai (1-basis)
iris = arr$[1..3]          // [1,2,3] — iris (1-basis, pungkasan kalebu)
iris2 = arr$[1:3]          // [1,2,3] — padha, sintaks basis cacah

minggah = arr$^+             // urut minggah (mung primitif)
mudhun = arr$^-            // urut mudhun (mung primitif)

// Array tuple jeneng/posisional — gunakake $^ karo lambda pembanding
database = [(jeneng: "Carla", umur: 28), (jeneng: "Ana", umur: 25), (jeneng: "Bob", umur: 30)]
miturut_umur  = database$^ (a, b -> a.umur < b.umur)    // miturut umur minggah (<)
miturut_jeneng = database$^ (a, b -> a.jeneng > b.jeneng)   // miturut jeneng mudhun (>)
>> miturut_umur[1].jeneng ¶     // → Ana
>> miturut_jeneng[1].jeneng ¶    // → Carla

// Nganyari unsur langsung (mung array)
arr[1] = 99              // tugasake
arr[2] += 5              // majemuk: +=  -=  *=  /=  %=  ^=

// Nganyari fungsional — bali array anyar; asline ora owah
arr2 = arr[2]$~ 99
```

> Kabeh operator koleksi bali **array anyar**. Tugasake maneh: `arr = arr$+ 4`.
> `$+` bisa dirantai: `arr = arr$+ 5$+ 6$+ 7`. Operator liyane nggunakake tugas penengah.
> **Indeksasi 1-basis**: `arr[1]` iku unsur pisanan; `arr[0]` iku kesalahan wektu mlaku.
> `$^+` / `$^-` ngurut **array primitif** (angka, string). Kanggo array tuple, gunakake `$^` karo lambda pembanding — arah dikode ing lambda (`<` = minggah, `>` = mudhun).

**Semantik nilai** — menehi array menyang variabel liya nggawe salinan independen:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b ora kena pengaruh
```

```zymbol
// Array bersarang (indeksasi 1-basis)
matriks = [[1,2,3],[4,5,6],[7,8,9]]
>> matriks[2][3] ¶    // → 6  (baris 2, kolom 3)
```

---

## Destrukturisasi

```zymbol
// Array
arr = [10, 20, 30, 40, 50]
[a, b, c] = arr              // a=10  b=20  c=30
[pisanan, *liyane] = arr         // pisanan=10  liyane=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ dibuwang

// Tuple posisional
titik = (100, 200)
(px, py) = titik             // px=100  py=200

// Tuple jeneng
wong = (jeneng: "Ana", umur: 25, kutha: "Madrid")
(jeneng: n, umur: u) = wong   // n="Ana"  u=25
```

---

## Tuple

Tuple iku wadhah sing diurutake **ora bisa diganti** sing bisa nyimpen nilai **saka jinis sing beda**.
Beda karo array, unsur ora bisa diganti sawise digawe.

```zymbol
// Posisional — jinis campuran diidini
titik = (10, 20)
>> titik[1] ¶    // → 10

data = (42, "Halo", #1, 3.14)
>> data[3] ¶     // → #1

// Jeneng
wong = (jeneng: "Alice", umur: 25)
>> wong.jeneng ¶    // → Alice
>> wong[1] ¶      // → Alice  (indeks uga bisa, 1-basis)

// Bersarang
posisi = (x: 10, y: 20)
p = (posisi: posisi, label: "asal")
>> p.posisi.x ¶        // → 10
```

**Ora bisa diganti** — upaya apa wae kanggo ngowahi unsur tuple iku kesalahan wektu mlaku:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ kesalahan wektu mlaku: tuple ora bisa diganti
// t[1] += 5    // ❌ kesalahan sing padha
```

Kanggo entuk nilai sing wis diowahi, gunakake `$~` (nganyari fungsional) — bali **tuple anyar**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← asline ora owah
>> t2 ¶    // → (10, 999, 30)

// Tuple jeneng — mbangun maneh kanthi jelas
wong = (jeneng: "Alice", umur: 25)
luwih_tua  = (jeneng: wong.jeneng, umur: 26)
>> wong.umur ¶    // → 25
>> luwih_tua.umur ¶     // → 26
```

---

## Fungsi Tingkat Dhuwur

```zymbol
angka = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

pindho  = angka$> (x -> x * 2)                  // map  → [2,4,6…20]
genap    = angka$| (x -> x % 2 == 0)           // filter → [2,4,6,8,10]
total    = angka$< (0, (akumulator, x) -> akumulator + x)     // reduce → 55

// Rantai liwat perantara
langkah1 = angka$| (x -> x > 3)
langkah2 = langkah1$> (x -> x * x)
>> langkah2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Fungsi jeneng bisa langsung diwenehake menyang HOF
pindho(x) { <~ x * 2 }
gedhe(x) { <~ x > 5 }
r = angka$> pindho       // ✅ referensi langsung
r = angka$| gedhe       // ✅ referensi langsung
```

---

## Operator Pipa

Sisih tengen tansah mbutuhake `_` minangka panggon kanggo nilai sing dialirake:

```zymbol
pindho = x -> x * 2
tambah = (a, b) -> a + b
tambah_siji = x -> x + 1

r1 = 5 |> pindho(_)        // → 10
r2 = 10 |> tambah(_, 5)       // → 15
r3 = 5 |> tambah(2, _)        // → 7

// Rantai
r = 5 |> pindho(_) |> tambah_siji(_) |> pindho(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Penanganan Kesalahan

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "dibagi nul" ¶
} :! {
    >> "liyane: " _err ¶    // _err nyimpen pesen kesalahan
} :> {
    >> "tansah mlaku" ¶
}
```

| Jinis | Kapan |
|------|------|
| `##Div` | Dibagi nul |
| `##IO` | Berkas / sistem |
| `##Index` | Indeks metu saka wates |
| `##Type` | Jinis ora cocog |
| `##Parse` | Parsing data |
| `##Network` | Kesalahan jaringan |
| `##_` | Sembarang kesalahan (nyekel kabeh) |

---

## Modul

```zymbol
// lib/calc.zy — badan modul ditutup ing kurung kurawal
# calc {
    #> { tambah, get_PI }

    _π := 3.14159
    tambah(a, b) { <~ a + b }
    get_PI() { <~ _π }
}
```

```zymbol
// main.zy
<# ./lib/calc => c    // alias dibutuhake

>> c::tambah(5, 3) ¶     // → 8
π = c::get_PI()
>> π ¶               // → 3.14159
```

```zymbol
// Ekspor nganggo jeneng publik sing beda
# mylib {
    #> { _tambah_internal => jumlah }

    _tambah_internal(a, b) { <~ a + b }
}
```

```zymbol
<# ./mylib => m

>> m::jumlah(3, 4) ¶    // → 7  (jeneng internal _tambah_internal didhelikake)
```

> **Aturan modul**: ing `# jeneng { }`, mung `#>`, definisi fungsi, lan inisialisasi literal variabel/konstanta sing diidini. Pernyataan sing bisa dieksekusi (`>>`, `<<`, loop, lsp.) nyebabake kesalahan E013.

---

## Mode Numerik

Zymbol bisa nampilake angka ing **69 aksara digit Unicode** — Devanagari, Arab-India, Thai, Klingon pIqaD, Mathematical Bold, segmen LCD, lan liya-liyane. Mode aktif mung mengaruhi output `>>`; aritmetika internal tansah biner.

### Ngaktifake aksara

Tulis digit `0` lan `9` saka aksara target ing `#…#`:

```zymbol
#०९#    // Devanagari   (U+0966–U+096F)
#٠٩#    // Arab-India (U+0660–U+0669)
#๐๙#    // Thai         (U+0E50–U+0E59)
#09#    // reset menyang ASCII
```

### Output lan boolean

```zymbol
x = 42
>> x ¶          // → 42   (standar ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (titik desimal tansah ASCII)
>> 1 + 2 ¶      // → ३

// Boolean: ater-ater # tansah ASCII, digit adaptasi
>> #1 ¶         // → #१   (bener ing Devanagari)
>> #0 ¶         // → #०   (salah — beda karo ० integer nol)

x = 28 > 4
>> x ¶          // → #१   (asil perbandingan ngetutake mode aktif)
```

### Literal digit asli ing sumber

Digit saka sembarang aksara sing didhukung iku literal sing sah — ing rentang, modulo, perbandingan:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Literal Boolean ing sembarang aksara

`#` + digit `0` utawa `1` saka sembarang blok iku literal boolean sing sah:

```zymbol
#०९#
aktif = #१        // padha karo #1
>> aktif ¶        // → #१
>> (#१ && #०) ¶ // → #०
```

> `#` **tansah ASCII**. `#0` (salah) tansah visual beda karo `0` (integer nol) ing saben aksara.

---

## Operator Data

```zymbol
// Konversi jinis
f = ##.42         // → 42.0  (menyang ngambang)
i = ###3.7        // → 4     (menyang integer, bunderake)
t = ##!3.7        // → 3     (menyang integer, potong)

// Parse string dadi angka
v1 = #|"42"|      // → 42  (integer)
v2 = #|"3.14"|    // → 3.14  (ngambang)
v3 = #|"abc"|     // → "abc"  (aman, ora ana kesalahan)

// Bunderake / Potong
π = 3.14159265
bunderake2 = #.2|π|      // → 3.14  (bunderake menyang 2 panggon desimal)
bunderake4 = #.4|π|      // → 3.1416
potong2 = #!2|π|      // → 3.14  (potong)

// Format angka
format = #,|1234567|  // → 1,234,567  (dipisah koma)
ilmiah = #^|12345.678|    // → 1.2345678e4  (ilmiah)

// Literal basis
a = 0x41         // → 'A'  (hex)
b = 0b01000001   // → 'A'  (biner)
c = 0o101        // → 'A'  (oktal)

// Output konversi basis
hex = 0x|255|    // → "0x00FF"
bin = 0b|65|     // → "0b1000001"
oct = 0o|8|      // → "0o10"
desimal = 0d|255|    // → "0d0255"
```

---

## Integrasi Shell

```zymbol
tanggal = <\ date +%Y-%m-%d \>     // njupuk stdout (kalebu \n ing pungkasan)
>> "Dina iki: " tanggal

berkas = "data.txt"
isi = <\ cat {berkas} \>      // interpolasi ing perintah

output = </"./subscript.zy"/>   // eksekusi skrip Zymbol liyane, njupuk output
>> output
```

> `><` njupuk argumen CLI minangka array string (mung tree-walker).

---

## Conto Lengkap: FizzBuzz

```zymbol
klasifikasi(angka) {
    ? angka % 15 == 0 { <~ "FizzBuzz" }
    _? angka % 3  == 0 { <~ "Fizz" }
    _? angka % 5  == 0 { <~ "Buzz" }
    _ { <~ angka }
}

@ i:1..20 { >> klasifikasi(i) ¶ }
```

---

## Referensi Simbol

| Simbol | Operasi | Simbol | Operasi |
|--------|-----------|--------|-----------|
| `=` | variabel | `$#` | dawane |
| `:=` | konstanta | `$+` | tambahake (bisa dirantai) |
| `>>` | output | `$+[i]` | selipake ing indeks (1-basis) |
| `<<` | input | `$-` | busak pisanan miturut nilai |
| `¶` / `\\` | baris anyar | `$--` | busak kabeh miturut nilai |
| `?` | yen | `$-[i]` | busak ing indeks (1-basis) |
| `_?` | liya-yen | `$-[i..j]` | busak rentang (1-basis) |
| `_` | liya / wildcard | `$?` | ngemot |
| `??` | cocok | `$??` | temokake kabeh indeks (1-basis) |
| `@` | loop | `$[s..e]` | iris (1-basis) |
| `@ N { }` | loop N kaping | `$>` | map |
| `@!` | pedhot | `$\|` | filter |
| `@>` | terusake | `$<` | reduce |
| `@:jeneng { }` | loop label | `$/ pemisah` | string dipisah |
| `@:jeneng!` | pedhot label | `$++ a b c` | bangunan konkatenasi |
| `@:jeneng>` | terusake label | `arr[i>j>k]` | indeks navigasi |
| `->` | lambda | `arr[i] = nilai` | nganyari unsur (mung array) |
| `arr[i] += nilai` | nganyari majemuk | `arr[i]$~` | nganyari fungsional (salinan anyar) |
| `$^+` | urut minggah (primitif) | `$^-` | urut mudhun (primitif) |
| `$^` | urut karo pembanding (tuple) | `<~` | bali |
| `\|>` | pipa | `!?` | coba |
| `:!` | nyekel | `:>` | pungkasane |
| `#1` | bener | `#0` | salah |
| `$!` | apa kesalahan | `$!!` | nyebarake kesalahan |
| `<#` | ngimpor | `#>` | ngekspor |
| `#` | deklarasi modul | `::` | nelpon modul |
| `.` | akses lapangan | `#?` | metadata jinis |
| `#\|..\|` | parse angka | `##.` | konversi menyang ngambang |
| `###` | konversi menyang integer (bunderake) | `##!` | konversi menyang integer (potong) |
| `#.N\|..\|` | bunderake | `#!N\|..\|` | potong |
| `#,\|..\|` | format koma | `#^\|..\|` | ilmiah |
| `#d0d9#` | ganti mode numerik | `#09#` | reset menyang ASCII |
| `<\ ..\>` | eksekusi shell | `>\<` | argumen CLI |
| `\ variabel` | rusak variabel kanthi jelas | `°x` / `x°` | definisi panas (miwiti otomatis) |
| `>>|` | blok TUI (layar alternatif) | `>>~` | output posisional |
| `>>!` | ngresiki layar | `>>?` | takon ukuran terminal |
| `<<\|` | pencet tombol ngalangi | `<<\|?` | polling pencet tombol ora ngalangi |
| `@~ N` | turu N milidetik | `$*` | baleni string N kaping |

---

## Log Perubahan Rilis

### v0.0.5 — Primitif TUI, Definisi Panas & Pengulangan String _(Mei 2026)_

- **Mbedakake** Pemisah lengen pencocokan: `pola : asil` → `pola => asil`
- **Mbedakake** Alias ngimpor: `<# path <= alias` → `<# path => alias`
- **Mbedakake** Ganti jeneng ngekspor: `#> { fn <= publik }` → `#> { fn => publik }`
- **Ditambahake** Blok TUI `>>| { }` — layar alternatif + mode mentah; ngresiki nalika metu
- **Ditambahake** Output posisional `>>~ (baris, kolom, BKS, fg, bg) > item` — slot jarang, warna ANSI 256
- **Ditambahake** Input tombol `<<| variabel` (ngalangi) lan `<<|? variabel` (polling ora ngalangi)
- **Ditambahake** `>>!` ngresiki layar, `>>?` takon ukuran terminal, `@~ N` turu N milidetik
- **Ditambahake** Definisi panas `°x` / `x°` — miwiti variabel otomatis nalika panggunaan pisanan ing loop
- **Ditambahake** Pengulangan string `string $* N` — baleni string N kaping
- **VM** Paritas: 436/436 tes lulus

### v0.0.4 — Indeksasi 1-basis, Fungsi Kelas Kapisan & Modul Blok _(April 2026)_

- **Mbedakake** Kabeh indeksasi diganti dadi **1-basis** — `arr[1]` iku unsur pisanan; `arr[0]` iku kesalahan wektu mlaku
- **Ditambahake** Fungsi jeneng iku **nilai kelas kapisan** — langsung wenehake menyang HOF: `angka$> pindho`
- **Ditambahake** **Sintaks blok wajib** kanggo modul: `# jeneng { ... }` — sintaks datar dibusak
- **Ditambahake** Indeksasi multi-dimensi: `arr[i>j>k]` (navigasi), `arr[p ; q]` (ekstraksi datar)
- **Ditambahake** Konversi jinis: `##.ekspresi` (ngambang), `###ekspresi` (integer bunderake), `##!ekspresi` (integer potong)
- **Ditambahake** Pemisahan string: `string$/ pemisah` — bali `Array(string)`
- **Ditambahake** Bangunan konkatenasi: `basis$++ a b c` — tambahake pirang-pirang item
- **Ditambahake** Loop kaping: `@ N { }` — baleni persis N kaping
- **Ditambahake** Sintaks loop label: `@:jeneng { }`, `@:jeneng!`, `@:jeneng>` — ngganti `@ @jeneng` / `@! jeneng`
- **Ditambahake** Aturan ruang lingkup variabel: variabel `_jeneng` duwe ruang lingkup blok sing tepat; `\ variabel` rusak awal
- **Ditambahake** Pola perbandingan pencocokan: `< 0 =>`, `> 5 =>`, `== 42 =>`, lsp.
- **Ditambahake** Kesalahan modul E013: pernyataan sing bisa dieksekusi ing badan modul dilarang
- **Didandani** `alias.CONST` saiki ngrampungake kanthi bener; `#>` bisa muncul sawise definisi fungsi
- **VM** Paritas lengkap: 393/393 tes lulus

### v0.0.3 — Sistem Numerik Unicode & Peningkatan LSP _(April 2026)_

- **Ditambahake** 69 blok digit Unicode kanthi token ganti mode `#d0d9#`
- **Ditambahake** Literal Boolean ing sembarang aksara — `#१` / `#०`, `#१` / `#०`, lsp.
- **Ditambahake** Digit Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Ditambahake** Opkode VM `SetNumeralMode` — paritas lengkap karo tree-walker
- **Diganti** Output Boolean `>>` saiki kalebu ater-ater `#` (`#0` / `#1`) ing kabeh mode

### v0.0.2_01 — Ganti Jeneng Operator _(30 Maret 2026)_

- **Diganti** `c|..|` → `#,|..|` lan `e|..|` → `#^|..|` — konsisten karo kulawarga ater-ater `#`
- **Ditambahake** Alias ngekspor: ngekspor maneh anggota modul kanthi jeneng sing beda

### v0.0.2 — Desain Ulang API Koleksi & Instaler _(24 Maret 2026)_

- **Ditambahake** Kulawarga operator `$` terpadu kanggo array lan string (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Ditambahake** Tugas destrukturisasi kanggo array, tuple, lan tuple jeneng
- **Ditambahake** Indeks negatif (`arr[-1]` = unsur pungkasan)
- **Ditambahake** Instaler asli — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 Maret 2026)_

- **Ditambahake** Tugas majemuk `^=`
- **Didandani** Kasus pinggiran aritmetika parser; koreksi dokumentasi

### v0.0.1 — Rilis Publik Perdana _(22 Maret 2026)_

- Interpreter tree-walker + VM register (`--vm`, ~4× luwih cepet, ~95% paritas)
- Kabeh konstruksi inti: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Pengenal Unicode lengkap, sistem modul, lambda, penutupan, penanganan kesalahan
- REPL, LSP, ekstensi VS Code, formatter (`zymbol fmt`)

---

_Zymbol-Lang — Simbolis. Universal. Ora bisa diganti._
