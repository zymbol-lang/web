> **Thông báo:** Tài liệu này được tạo ra với sự hỗ trợ của trí tuệ nhân tạo (AI).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
>
> Tham chiếu chính thức là **[GUIDE.md](https://github.com/zymbol-lang/interpreter)** trong kho lưu trữ bộ thông dịch.

---

# Hướng dẫn Zymbol-Lang

**Zymbol-Lang** là ngôn ngữ lập trình ký hiệu. Không có từ khóa — mọi thứ đều là ký hiệu. Hoạt động giống hệt nhau trong bất kỳ ngôn ngữ con người nào.

- Không `if`, `while`, `return` — chỉ `?`, `@`, `<~`
- Unicode đầy đủ — định danh trong bất kỳ ngôn ngữ nào hoặc biểu tượng cảm xúc
- Không phụ thuộc ngôn ngữ con người — mã nguồn giống nhau ở mọi nơi

**Phiên bản bộ thông dịch**: v0.0.4 | **Độ phủ kiểm thử**: 393/393 (tương đương TW ↔ VM)

---

## Biến và Hằng số

```zymbol
x = 10              // biến có thể thay đổi
PI := 3.14159       // hằng số — gán lại là lỗi thời gian chạy
tên = "Alice"
hoạt_động = #1      // Boolean đúng
👋 := "Xin chào"
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

## Kiểu Dữ liệu

| Kiểu | Literal | Thẻ `#?` | Ghi chú |
|------|---------|----------|---------|
| Số nguyên | `42`, `-7` | `###` | 64-bit có dấu |
| Số thực | `3.14`, `1.5e10` | `##.` | Ký hiệu khoa học được phép |
| Chuỗi | `"văn bản"` | `##"` | Nội suy: `"Xin chào {tên}"` |
| Ký tự | `'A'` | `##'` | Một ký tự Unicode |
| Boolean | `#1`, `#0` | `##?` | KHÔNG phải số — `#1 ≠ 1` |
| Mảng | `[1, 2, 3]` | `##]` | Các phần tử đồng nhất |
| Tuple | `(a, b)` | `##)` | Theo vị trí |
| Tuple có tên | `(x: 1, y: 2)` | `##)` | Trường có tên |
| Hàm | tham chiếu hàm có tên | `##()` | Hạng nhất; hiển thị `<funct/N>` |
| Lambda | `x -> x * 2` | `##->` | Hạng nhất; hiển thị `<lambd/N>` |

```zymbol
// Nội soi kiểu — trả về (kiểu, chữ số, giá trị)
meta = 42#?
>> meta ¶         // → (###, 2, 42)
t = meta[1]
>> t ¶            // → ###
```

---

## Đầu ra và Đầu vào

```zymbol
>> "Xin chào" ¶                       // ¶ hoặc \\ cho xuống dòng rõ ràng
>> "a=" a " b=" b ¶                  // juxtaposition — nhiều giá trị
>> (arr$#) ¶                         // toán tử hậu tố cần ( ) bên trong >>

<< tên                               // đọc vào biến (không có lời nhắc)
<< "Nhập tên: " tên                  // có lời nhắc
```

> `¶` (AltGr+R trên bàn phím Tây Ban Nha) và `\\` tương đương cho xuống dòng.

---

## Toán tử

```zymbol
// Số học — sử dụng phép gán; một số toán tử có đặc điểm riêng khi dùng trực tiếp trong >>
a = 10
b = 3
r1 = a + b    // 13
r2 = a - b    // 7
r3 = a * b    // 30
r4 = a / b    // 3  (chia số nguyên)
r5 = a % b    // 1
r6 = a ^ b    // 1000  (lũy thừa)

// So sánh
a == b    // #0    
a <> b    // #1    
a < b      // #0
a <= b    // #0   
a > b      // #1    
a >= b    // #1

// Logic
#1 && #0    // #0
#1 || #0    // #1
!#1         // #0
```

---

## Chuỗi

```zymbol
// Hai dạng nối chuỗi
tên = "Alice"
n = 42

>> "Xin chào " tên " bạn có " n ¶       // juxtaposition — bên trong >>
mô_tả = "Xin chào {tên}, bạn có {n}"   // nội suy — ở bất kỳ đâu
```

```zymbol
s = "Xin chào Thế giới"
độ_dài = s$#                  // 12
chuỗi_con = s$[1..5]          // "Xin c" (cơ sở-1, bao gồm cuối)
có = s$? "Thế giới"           // #1
các_phần = "a,b,c,d"$/ ','    // [a, b, c, d]  (phân tách bằng dấu phân cách)
thay_thế = s$~~["a":"o"]      // "Xin chào Thế giới"
thay_thế1 = s$~~["a":"o":1]   // "Xin chào Thế giới" (chỉ N đầu tiên)
```

> `+` chỉ dành cho số. Đối với chuỗi, hãy sử dụng `,`, juxtaposition, hoặc nội suy.

---

## Luồng Điều khiển

```zymbol
x = 7

? x > 0 { >> "dương" ¶ }

? x > 100 {
    >> "lớn" ¶
} _? x > 0 {
    >> "dương" ¶
} _? x == 0 {
    >> "không" ¶
} _ {
    >> "âm" ¶
}
```

> Dấu ngoặc nhọn `{ }` **bắt buộc** ngay cả với một câu lệnh duy nhất.

---

## Đối sánh (Match)

```zymbol
// Khoảng
điểm = 85
điểm_chữ = ?? điểm {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> điểm_chữ ¶    // → B

// Chuỗi
màu = "đỏ"
mã = ?? màu {
    "đỏ"    : "#FF0000"
    "xanh"  : "#00FF00"
    _       : "#000000"
}

// Mẫu so sánh
nhiệt_độ = -5
trạng_thái = ?? nhiệt_độ {
    < 0  : "băng"
    < 20 : "lạnh"
    < 35 : "ấm"
    _    : "nóng"
}
>> trạng_thái ¶    // → băng

// Dạng câu lệnh (khối)
?? n {
    0        : { >> "không" ¶ }
    _? n < 0 : { >> "âm" ¶ }
    _        : { >> "dương" ¶ }
}
```

---

## Vòng lặp

```zymbol
@ i:0..4  { >> i " " }        // khoảng bao gồm:  0 1 2 3 4
@ i:1..9:2 { >> i " " }       // có bước:         1 3 5 7 9
@ i:5..0:1 { >> i " " }       // ngược:           5 4 3 2 1 0

n = 1
@ n <= 64 { n *= 2 }
>> n ¶                        // → 128  (while)

trái_cây = ["táo", "lê", "nho"]
@ t:trái_cây { >> t ¶ }        // cho mỗi phần tử trong mảng

@ k:"xin chào" { >> k "-" }
>> ¶                          // → x-i-n- -c-h-à-o-  (cho mỗi ký tự trong chuỗi)

@ i:1..10 {
    ? i % 2 == 0 { @> }       // @> tiếp tục
    ? i > 7 { @! }            // @! dừng
    >> i " "
}
>> ¶                          // → 1 3 5 7

// Vòng lặp vô hạn
i = 0
@ {
    i++
    ? i >= 5 { @! }
    >> i " "
}
>> ¶                          // → 1 2 3 4

// Vòng lặp có nhãn (dừng lồng nhau)
bộ_đếm = 0
@:bên_ngoài {
    bộ_đếm++
    ? bộ_đếm >= 3 { @:bên_ngoài! }
}
>> bộ_đếm ¶                   // → 3
```

---

## Hàm

```zymbol
cộng(a, b) { <~ a + b }
>> cộng(3, 4) ¶   // → 7

giai_thừa(n) {
    ? n <= 1 { <~ 1 }
    <~ n * giai_thừa(n - 1)
}
>> giai_thừa(5) ¶    // → 120
```

Hàm có **phạm vi biệt lập** — chúng không thể đọc các biến bên ngoài. Sử dụng tham số đầu ra `<~` để sửa đổi biến của người gọi:

```zymbol
hoán_đổi(a<~, b<~) {
    tạm = a
    a = b
    b = tạm
}
x = 10
y = 20
hoán_đổi(x, y)
>> "x=" x " y=" y ¶    // → x=20 y=10
```

> Các hàm có tên là **giá trị hạng nhất** — truyền trực tiếp: `nums$> gấp_đôi`. `x -> fn(x)` cũng hợp lệ.

---

## Lambda và Bao đóng

```zymbol
gấp_đôi = x -> x * 2
cộng = (a, b) -> a + b
>> gấp_đôi(5) ¶   // → 10
>> cộng(3, 7) ¶    // → 10

// Lambda khối
phân_loại = x -> {
    ? x > 0 { <~ "dương" }
    _? x < 0 { <~ "âm" }
    <~ "không"
}

// Bao đóng — thu lại phạm vi bên ngoài
hệ_số = 3
gấp_ba = x -> x * hệ_số
>> gấp_ba(7) ¶     // → 21

// Nhà máy
tạo_bộ_cộng(n) { <~ x -> x + n }
thêm_mười = tạo_bộ_cộng(10)
>> thêm_mười(5) ¶   // → 15

// Trong mảng
toán_tử = [x -> x+1, x -> x*2, x -> x*x]
>> toán_tử[3](5) ¶   // → 25
```

---

## Mảng

Mảng **có thể thay đổi** và chứa các phần tử **cùng kiểu**.

```zymbol
mảng = [1, 2, 3, 4, 5]

mảng[1]          // 1 — truy cập (cơ sở-1: phần tử đầu tiên)
mảng[-1]         // 5 — chỉ số âm (phần tử cuối cùng)
mảng$#           // 5 — độ dài (sử dụng (mảng$#) bên trong >>)

mảng = mảng$+ 6            // thêm → [1,2,3,4,5,6]
mảng2 = mảng$+[2] 99       // chèn tại vị trí 2 (cơ sở-1)
mảng3 = mảng$- 3           // xóa lần xuất hiện đầu tiên của giá trị
mảng4 = mảng$-- 3          // xóa tất cả các lần xuất hiện
mảng5 = mảng$-[1]          // xóa tại chỉ số 1 (phần tử đầu tiên)
mảng6 = mảng$-[2..3]       // xóa khoảng (cơ sở-1, bao gồm cuối)

có = mảng$? 3              // #1 — chứa
vị_trí = mảng$?? 3         // [3] — tất cả các chỉ số của giá trị (cơ sở-1)
lát = mảng$[1..3]          // [1,2,3] — lát (cơ sở-1, bao gồm cuối)
lát2 = mảng$[1:3]          // [1,2,3] — tương tự, cú pháp dựa trên số lượng

tăng_dần = mảng$^+         // sắp xếp tăng dần (chỉ kiểu nguyên thủy)
giảm_dần = mảng$^-         // sắp xếp giảm dần (chỉ kiểu nguyên thủy)

// Mảng tuple có tên/theo vị trí — sử dụng $^ với lambda so sánh
db = [(tên: "Carla", tuổi: 28), (tên: "Ana", tuổi: 25), (tên: "Bob", tuổi: 30)]
theo_tuổi   = db$^ (a, b -> a.tuổi < b.tuổi)      // tăng dần theo tuổi (<)
theo_tên   = db$^ (a, b -> a.tên > b.tên)        // giảm dần theo tên (>)
>> theo_tuổi[1].tên ¶     // → Ana
>> theo_tên[1].tên ¶      // → Carla

// Cập nhật phần tử trực tiếp (chỉ mảng)
mảng[1] = 99              // gán
mảng[2] += 5              // kết hợp: +=  -=  *=  /=  %=  ^=

// Cập nhật hàm — trả về mảng mới; bản gốc không thay đổi
mảng2 = mảng[2]$~ 99
```

> Tất cả các toán tử tập hợp trả về **mảng mới**. Gán lại: `mảng = mảng$+ 4`.
> `$+` có thể được xâu chuỗi: `mảng = mảng$+ 5$+ 6$+ 7`. Các toán tử khác sử dụng phép gán trung gian.
> **Đánh chỉ số là cơ sở-1**: `mảng[1]` là phần tử đầu tiên; `mảng[0]` là lỗi thời gian chạy.
> `$^+` / `$^-` sắp xếp **mảng nguyên thủy** (số, chuỗi). Đối với mảng tuple, sử dụng `$^` với lambda so sánh — hướng được mã hóa trong lambda (`<` = tăng dần, `>` = giảm dần).

**Ngữ nghĩa giá trị** — gán một mảng cho một biến khác tạo ra một bản sao độc lập:

```zymbol
a = [1, 2, 3]
b = a
a[1] = 99
>> a ¶    // → [99, 2, 3]
>> b ¶    // → [1, 2, 3]   ← b không bị ảnh hưởng
```

```zymbol
// Mảng lồng nhau (đánh chỉ số cơ sở-1)
ma_trận = [[1,2,3],[4,5,6],[7,8,9]]
>> ma_trận[2][3] ¶    // → 6  (hàng 2, cột 3)
```

---

## Giải cấu trúc

```zymbol
// Mảng
mảng = [10, 20, 30, 40, 50]
[a, b, c] = mảng              // a=10  b=20  c=30
[đầu, *còn_lại] = mảng        // đầu=10  còn_lại=[20,30,40,50]
[x, _, z] = [1, 2, 3]        // _ bỏ qua

// Tuple theo vị trí
điểm = (100, 200)
(px, py) = điểm              // px=100  py=200

// Tuple có tên
người = (tên: "Ana", tuổi: 25, thành_phố: "Madrid")
(tên: t, tuổi: u) = người     // t="Ana"  u=25
```

---

## Tuple

Tuple là các container có thứ tự **không thể thay đổi** có thể chứa các giá trị **khác kiểu**.
Không giống như mảng, các phần tử không thể thay đổi sau khi tạo.

```zymbol
// Theo vị trí — cho phép kiểu hỗn hợp
điểm = (10, 20)
>> điểm[1] ¶     // → 10

dữ_liệu = (42, "xin chào", #1, 3.14)
>> dữ_liệu[3] ¶   // → #1

// Có tên
người = (tên: "Alice", tuổi: 25)
>> người.tên ¶     // → Alice
>> người[1] ¶      // → Alice  (chỉ số cũng hoạt động, cơ sở-1)

// Lồng nhau
vị_trí = (x: 10, y: 20)
p = (vị_trí: vị_trí, nhãn: "gốc")
>> p.vị_trí.x ¶     // → 10
```

**Tính không thể thay đổi** — bất kỳ nỗ lực sửa đổi phần tử tuple đều là lỗi thời gian chạy:

```zymbol
t = (10, 20, 30)
// t[1] = 99    // ❌ lỗi thời gian chạy: tuple không thể thay đổi
// t[1] += 5    // ❌ lỗi tương tự

// Tuple có tên — xây dựng lại một cách rõ ràng
người = (tên: "Alice", tuổi: 25)
lớn_hơn = (tên: người.tên, tuổi: 26)
>> người.tuổi ¶    // → 25
>> lớn_hơn.tuổi ¶  // → 26
```

Để có được giá trị đã sửa đổi, hãy sử dụng `$~` (cập nhật hàm) — trả về tuple **mới**:

```zymbol
t = (10, 20, 30)
t2 = t[2]$~ 999
>> t ¶     // → (10, 20, 30)   ← bản gốc không thay đổi
>> t2 ¶    // → (10, 999, 30)
```

---

## Hàm bậc cao

```zymbol
các_số = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

gấp_đôi = các_số$> (x -> x * 2)                  // ánh xạ → [2,4,6…20]
số_chẵn   = các_số$| (x -> x % 2 == 0)           // lọc → [2,4,6,8,10]
tổng     = các_số$< (0, (tích_lũy, x) -> tích_lũy + x) // rút gọn → 55

// Xâu chuỗi qua các bước trung gian
bước1 = các_số$| (x -> x > 3)
bước2 = bước1$> (x -> x * x)
>> bước2 ¶    // → [16, 25, 36, 49, 64, 81, 100]

// Các hàm có tên có thể được truyền trực tiếp đến hàm bậc cao
gấp_đôi(x) { <~ x * 2 }
lớn(x) { <~ x > 5 }
r = các_số$> gấp_đôi       // ✅ tham chiếu trực tiếp
r = các_số$| lớn           // ✅ tham chiếu trực tiếp
```

---

## Toán tử đường ống

Vế phải luôn yêu cầu `_` làm trình giữ chỗ cho giá trị được đưa qua đường ống:

```zymbol
gấp_đôi = x -> x * 2
cộng = (a, b) -> a + b
tăng = x -> x + 1

5 |> gấp_đôi(_)        // → 10
10 |> cộng(_, 5)       // → 15
5 |> cộng(2, _)        // → 7

// Xâu chuỗi
r = 5 |> gấp_đôi(_) |> tăng(_) |> gấp_đôi(_)
>> r ¶    // → 22  (5→10→11→22)
```

---

## Xử lý Lỗi

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "chia cho 0" ¶
} :! {
    >> "lỗi khác: " _err ¶    // _err giữ thông báo lỗi
} :> {
    >> "luôn chạy" ¶
}
```

| Kiểu | Khi nào |
|------|---------|
| `##Div` | Chia cho 0 |
| `##IO` | Tệp / hệ thống |
| `##Index` | Chỉ số ngoài giới hạn |
| `##Type` | Không khớp kiểu |
| `##Parse` | Phân tích cú pháp dữ liệu |
| `##Network` | Lỗi mạng |
| `##_` | Bất kỳ lỗi nào (bắt tất cả) |

---

## Mô-đun

```zymbol
// lib/calc.zy — phần thân mô-đun nằm trong dấu ngoặc nhọn
# calc {
    #> { cộng, get_PI }

    _PI := 3.14159
    cộng(a, b) { <~ a + b }
    get_PI() { <~ _PI }
}
```

```zymbol
// main.zy
<# ./lib/calc <= c    // bí danh bắt buộc

>> c::cộng(5, 3) ¶   // → 8
pi = c::get_PI()
>> pi ¶              // → 3.14159
```

```zymbol
// Xuất với tên công khai khác
# thư_viện_của_tôi {
    #> { _cộng_bên_trong <= tổng }

    _cộng_bên_trong(a, b) { <~ a + b }
}
```

```zymbol
<# ./thư_viện_của_tôi <= m

>> m::tổng(3, 4) ¶    // → 7  (tên bên trong _cộng_bên_trong bị ẩn)
```

> **Quy tắc mô-đun**: chỉ `#>`, định nghĩa hàm và bộ khởi tạo biến/hằng literal được phép bên trong `# tên { }`. Các câu lệnh có thể thực thi (`>>`, `<<`, vòng lặp, v.v.) gây ra lỗi E013.

---

## Chế độ Số

Zymbol có thể hiển thị số trong **69 khối chữ số Unicode** — Devanagari, Ả Rập-Ấn Độ, Thái, Klingon pIqaD, Chữ đậm Toán học, các đoạn LCD, v.v. Chế độ hoạt động chỉ ảnh hưởng đến đầu ra `>>`; số học bên trong luôn là nhị phân.

### Kích hoạt một hệ thống chữ viết

Viết chữ số `0` và `9` của hệ thống chữ viết mục tiêu bên trong `#…#`:

```zymbol
#०९#    // Devanagari    (U+0966–U+096F)
#٠٩#    // Ả Rập-Ấn Độ   (U+0660–U+0669)
#๐๙#    // Thái          (U+0E50–U+0E59)
#09#    // đặt lại về ASCII
```

### Đầu ra và Boolean

```zymbol
x = 42
>> x ¶          // → 42   (mặc định ASCII)

#०९#
>> x ¶          // → ४२
>> 3.14 ¶       // → ३.१४   (dấu thập phân luôn là ASCII)
>> 1 + 2 ¶      // → ३

// Boolean: tiền tố # luôn là ASCII, chữ số thích ứng
>> #1 ¶         // → #१   (đúng trong Devanagari)
>> #0 ¶         // → #०   (sai — khác biệt với ० số nguyên không)

x = 28 > 4
>> x ¶          // → #१   (kết quả so sánh tuân theo chế độ hoạt động)
```

### Literal chữ số bản địa trong mã nguồn

Các chữ số của bất kỳ hệ thống chữ viết nào được hỗ trợ đều là literal hợp lệ — trong khoảng, modulo, so sánh:

```zymbol
#०९#

@ i:१..१५ {
    ? i % १५ == ० { >> "FizzBuzz" ¶ }
    _? i % ३  == ० { >> "Fizz" ¶ }
    _? i % ५  == ० { >> "Buzz" ¶ }
    _ { >> i ¶ }
}
```

### Literal Boolean trong bất kỳ hệ thống chữ viết nào

`#` + chữ số `0` hoặc `1` từ bất kỳ khối nào là literal Boolean hợp lệ:

```zymbol
#०९#
hoạt_động = #१        // giống như #1
>> hoạt_động ¶        // → #१
>> (#१ && #०) ¶       // → #०
```

> `#` **luôn là ASCII**. `#0` (sai) luôn khác biệt trực quan với `0` (số nguyên không) trong mọi hệ thống chữ viết.

---

## Toán tử Dữ liệu

```zymbol
// Chuyển đổi kiểu
##.42         // → 42.0  (thành Số thực)
###3.7        // → 4     (thành Số nguyên, làm tròn)
##!3.7        // → 3     (thành Số nguyên, cắt bỏ)

// Phân tích cú pháp chuỗi thành số
v1 = #|"42"|      // → 42  (Số nguyên)
v2 = #|"3.14"|    // → 3.14  (Số thực)
v3 = #|"abc"|     // → "abc"  (an toàn, không có lỗi)

// Làm tròn / cắt bỏ
pi = 3.14159265
làm_tròn2 = #.2|pi|     // → 3.14  (làm tròn đến 2 chữ số thập phân)
làm_tròn4 = #.4|pi|     // → 3.1416
cắt_bỏ2 = #!2|pi|       // → 3.14  (cắt bỏ)

// Định dạng số
định_dạng = #,|1234567|   // → 1,234,567  (phân cách bằng dấu phẩy)
khoa_học = #^|12345.678| // → 1.2345678e4  (khoa học)

// Literal cơ số
a = 0x41         // → 'A'  (thập lục phân)
b = 0b01000001   // → 'A'  (nhị phân)
c = 0o101        // → 'A'  (bát phân)

// Đầu ra chuyển đổi cơ số
thập_lục = 0x|255|   // → "0x00FF"
nhị_phân = 0b|65|    // → "0b1000001"
bát_phân = 0o|8|     // → "0o10"
thập_phân = 0d|255|   // → "0d0255"
```

---

## Tích hợp Shell

```zymbol
ngày = <\ date +%Y-%m-%d \>     // chụp stdout (bao gồm \n ở cuối)
>> "Hôm nay: " ngày

tệp = "dữ_liệu.txt"
nội_dung = <\ cat {tệp} \>       // nội suy trong lệnh

đầu_ra = </"./subscript.zy"/>    // chạy một tập lệnh Zymbol khác, chụp đầu ra
>> đầu_ra
```

> `><` chụp các đối số dòng lệnh dưới dạng mảng chuỗi (chỉ dành cho tree-walker).

---

## Ví dụ Hoàn chỉnh: FizzBuzz

```zymbol
phân_loại(số) {
    ? số % 15 == 0 { <~ "FizzBuzz" }
    _? số % 3  == 0 { <~ "Fizz" }
    _? số % 5  == 0 { <~ "Buzz" }
    _ { <~ số }
}

@ i:1..20 { >> phân_loại(i) ¶ }
```

---

## Tham chiếu Ký hiệu

| Ký hiệu | Thao tác | Ký hiệu | Thao tác |
|--------|---------|--------|---------|
| `=` | biến | `$#` | độ dài |
| `:=` | hằng số | `$+` | thêm (có thể xâu chuỗi) |
| `>>` | đầu ra | `$+[i]` | chèn tại chỉ số (cơ sở-1) |
| `<<` | đầu vào | `$-` | xóa lần đầu tiên theo giá trị |
| `¶` / `\\` | dòng mới | `$--` | xóa tất cả theo giá trị |
| `?` | nếu | `$-[i]` | xóa tại chỉ số (cơ sở-1) |
| `_?` | nếu không thì nếu | `$-[i..j]` | xóa khoảng (cơ sở-1) |
| `_` | nếu không / ký tự đại diện | `$?` | chứa |
| `??` | đối sánh | `$??` | tìm tất cả chỉ số (cơ sở-1) |
| `@` | vòng lặp | `$[s..e]` | lát (cơ sở-1) |
| `@ N { }` | vòng lặp N lần | `$>` | ánh xạ |
| `@!` | dừng | `$|` | lọc |
| `@>` | tiếp tục | `$<` | rút gọn |
| `@:tên { }` | vòng lặp có nhãn | `$/ dấu_phân_cách` | phân tách chuỗi |
| `@:tên!` | dừng có nhãn | `$++ a b c` | xây dựng nối chuỗi |
| `@:tên>` | tiếp tục có nhãn | `mảng[i>j>k]` | chỉ số điều hướng |
| `->` | lambda | `mảng[i] = giá_trị` | cập nhật phần tử (chỉ mảng) |
| `mảng[i] += giá_trị` | cập nhật kết hợp | `mảng[i]$~` | cập nhật hàm (bản sao mới) |
| `$^+` | sắp xếp tăng dần (nguyên thủy) | `$^-` | sắp xếp giảm dần (nguyên thủy) |
| `$^` | sắp xếp với bộ so sánh (tuple) | `<~` | trả về |
| `|>` | đường ống | `!?` | thử |
| `:!` | bắt | `:>` | cuối cùng |
| `#1` | đúng | `#0` | sai |
| `$!` | là lỗi | `$!!` | truyền lỗi |
| `<#` | nhập | `#>` | xuất |
| `#` | khai báo mô-đun | `::` | gọi mô-đun |
| `.` | truy cập trường | `#?` | siêu dữ liệu kiểu |
| `#\|..\|` | phân tích cú pháp số | `##.` | chuyển đổi thành Số thực |
| `###` | chuyển đổi thành Số nguyên (làm tròn) | `##!` | chuyển đổi thành Số nguyên (cắt bỏ) |
| `#.N\|..\|` | làm tròn | `#!N\|..\|` | cắt bỏ |
| `#,\|..\|` | định dạng dấu phẩy | `#^\|..\|` | khoa học |
| `#d0d9#` | thay đổi chế độ số | `#09#` | đặt lại về ASCII |
| `<\ ..\>` | chạy shell | `>\<` | đối số dòng lệnh |
| `\ var` | hủy biến một cách rõ ràng | | |

---

## Lịch sử thay đổi Phiên bản

### v0.0.4 — Đánh chỉ số Cơ sở-1, Hàm Hạng nhất & Khối Mô-đun _(Tháng 4 năm 2026)_

- **Phá vỡ tương thích** Tất cả đánh chỉ số được chuyển sang **cơ sở-1** — `arr[1]` là phần tử đầu tiên; `arr[0]` là lỗi thời gian chạy
- **Đã thêm** Các hàm có tên là **giá trị hạng nhất** — truyền trực tiếp đến hàm bậc cao: `nums$> gấp_đôi`
- **Đã thêm** **Cú pháp khối** cho mô-đun bắt buộc: `# tên { ... }` — cú pháp phẳng đã bị loại bỏ
- **Đã thêm** Đánh chỉ số đa chiều: `arr[i>j>k]` (điều hướng), `arr[p ; q]` (trích xuất phẳng)
- **Đã thêm** Chuyển đổi kiểu: `##.biểu_thức` (Số thực), `###biểu_thức` (Số nguyên làm tròn), `##!biểu_thức` (Số nguyên cắt bỏ)
- **Đã thêm** Phân tách chuỗi: `str$/ dấu_phân_cách` — trả về `Array(Chuỗi)`
- **Đã thêm** Xây dựng nối chuỗi: `cơ_sở$++ a b c` — thêm nhiều mục
- **Đã thêm** Vòng lặp N lần: `@ N { }` — lặp lại chính xác N lần
- **Đã thêm** Cú pháp vòng lặp có nhãn: `@:tên { }`, `@:tên!`, `@:tên>` — thay thế `@ @tên` / `@! tên`
- **Đã thêm** Quy tắc phạm vi biến: biến `_tên` có phạm vi khối chính xác; `\ var` hủy sớm
- **Đã thêm** Mẫu so sánh đối sánh: `< 0 :`, `> 5 :`, `== 42 :`, v.v.
- **Đã thêm** Lỗi mô-đun E013: các câu lệnh có thể thực thi trong phần thân mô-đun bị cấm
- **Đã sửa** `take_variable` không còn làm hỏng hằng số mô-đun khi ghi lại
- **Đã sửa** `alias.CONST` hiện được giải quyết chính xác; `#>` có thể xuất hiện sau định nghĩa hàm
- **VM** Tương đương hoàn toàn: 393/393 bài kiểm tra đạt

### v0.0.3 — Hệ thống Số Unicode & Cải thiện LSP _(Tháng 4 năm 2026)_

- **Đã thêm** 69 khối chữ số Unicode với mã thông báo chuyển đổi chế độ `#d0d9#`
- **Đã thêm** Literal Boolean trong bất kỳ hệ thống chữ viết nào — `#१` / `#०`, `#१` / `#०`, v.v.
- **Đã thêm** Chữ số Klingon pIqaD (CSUR PUA U+F8F0–U+F8F9)
- **Đã thêm** Mã lệnh VM `SetNumeralMode` — tương đương hoàn toàn với tree-walker
- **Đã thêm** REPL tôn trọng chế độ số hoạt động trong echo và hiển thị biến
- **Đã thay đổi** Đầu ra Boolean `>>` hiện bao gồm tiền tố `#` (`#0` / `#1`) trong tất cả các chế độ

### v0.0.2_01 — Đổi tên Toán tử _(30 tháng 3 năm 2026)_

- **Đã thay đổi** `c|..|` → `#,|..|` và `e|..|` → `#^|..|` — nhất quán với họ tiền tố định dạng `#`
- **Đã thêm** Bí danh xuất khẩu: xuất lại các thành viên mô-đun dưới một tên khác

### v0.0.2 — Thiết kế lại API Bộ sưu tập & Bộ cài đặt _(24 tháng 3 năm 2026)_

- **Đã thêm** Họ toán tử `$` thống nhất cho mảng và chuỗi (`$#`, `$+`, `$?`, `$-`, `$[..]`)
- **Đã thêm** Gán giải cấu trúc cho mảng, tuple và tuple có tên
- **Đã thêm** Chỉ số âm (`arr[-1]` = phần tử cuối cùng)
- **Đã thêm** Bộ cài đặt gốc — Linux (deb/rpm/pkg/musl), macOS (Intel + Apple Silicon), Windows (MSI, winget)

### v0.0.1-patch _(25 tháng 3 năm 2026)_

- **Đã thêm** Gán kết hợp `^=`
- **Đã sửa** Các trường hợp biên số học của bộ phân tích cú pháp; sửa lỗi tài liệu

### v0.0.1 — Bản phát hành Công khai Đầu tiên _(22 tháng 3 năm 2026)_

- Bộ thông dịch tree-walker + VM thanh ghi (`--vm`, nhanh hơn ~4×, tương đương ~95%)
- Tất cả cấu trúc cốt lõi: `?` `@` `<~` `->` `>>` `<<` `¶` `??`
- Định danh Unicode đầy đủ, hệ thống mô-đun, lambda, bao đóng, xử lý lỗi
- REPL, LSP, phần mở rộng VS Code, bộ định dạng (`zymbol fmt`)

---

_Zymbol-Lang — Ký hiệu. Phổ quát. Không thể thay đổi._
