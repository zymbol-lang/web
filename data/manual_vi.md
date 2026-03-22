# Hướng Dẫn Nhỏ Gọn Zymbol-Lang

**Zymbol-Lang** là một ngôn ngữ lập trình biểu tượng. Nó không sử dụng từ khóa — tất cả đều là ký hiệu. Hoạt động theo cùng một cách trong bất kỳ ngôn ngữ con người nào.

---

## Triết Lý

- Không có từ khóa (`if`, `while`, `return` không tồn tại — chỉ có ký hiệu `?`, `@`, `<~`)
- Unicode đầy đủ — định danh trong bất kỳ ngôn ngữ hay emoji nào 👋
- Bất khả tri ngôn ngữ — mã nguồn giống hệt nhau trong mọi ngôn ngữ

---

## Biến và Hằng

```zymbol
x = 10           // biến (có thể thay đổi)
PI := 3.14159    // hằng số (bất biến — lỗi nếu gán lại)
tên = "An"
hoạtĐộng = #1   // boolean đúng
👋 := "Xin chào"
>> "Xin chào" ¶  // xuất lời chào
```

### Gán Hợp Nhất

```zymbol
x = 10    // 10
x += 5    // 15
x -= 3    // 12
x *= 2    // 24
x /= 4    // 6
x %=  4   // 2
x++       // 3
x--       // 2
```

---

## Kiểu Dữ Liệu

| Kiểu           | Ví dụ               | Ký hiệu `#?` | Ghi chú                              |
|----------------|---------------------|--------------|--------------------------------------|
| Số nguyên      | `42`, `-7`          | `###`        | 64 bit có dấu                        |
| Số thực        | `3.14`, `1.5e10`    | `##.`        | Ký hiệu khoa học được hỗ trợ         |
| Chuỗi          | `"xin chào"`        | `##"`        | Nội suy: `"Xin chào {tên}"`          |
| Ký tự          | `'A'`               | `##'`        | Một ký tự Unicode                    |
| Boolean        | `#1`, `#0`          | `##?`        | KHÔNG phải số 1 và 0                 |
| Mảng           | `[1, 2, 3]`         | `##]`        | Tất cả phần tử cùng kiểu             |
| Tuple          | `(a, b)`            | `##)`        | Theo vị trí                          |
| Tuple có tên   | `(x: 1, y: 2)`      | `##)`        | Truy cập theo tên hoặc chỉ số        |

---

## Xuất và Nhập

```zymbol
// Xuất — KHÔNG tự động thêm dòng mới
>> "Xin chào" ¶                  // ¶ hoặc \\ thêm dòng mới tường minh
>> "a=" a " b=" b ¶              // nhiều giá trị bằng cách đặt cạnh nhau
>> "tổng=" cộng(2, 3) ¶          // gọi hàm ở bất kỳ vị trí nào
>> (mảng$#) ¶                    // toán tử postfix cần dấu ngoặc đơn

// Nhập
<< tên                           // không có gợi ý — đọc vào biến
<< "Tên của bạn? " tên           // có gợi ý
```

> `¶` hoặc `\\` tương đương nhau như ký tự xuống dòng.

---

## Nối Chuỗi

Ba cách hợp lệ — mỗi cách dùng cho ngữ cảnh riêng:

```zymbol
tên = "An"
n = 25

// 1. Dấu phẩy — trong phép gán với = hoặc :=
lời = "Xin chào ", tên, "!"               // → Xin chào An!
TIÊU_ĐỀ := "Người dùng: ", tên

// 2. Đặt cạnh nhau — trong xuất >>
>> "Xin chào " tên " có " n " tuổi" ¶    // → Xin chào An có 25 tuổi

// 3. Nội suy — trong bất kỳ ngữ cảnh nào
mô_tả = "Xin chào {tên}, có {n} tuổi"   // → Xin chào An, có 25 tuổi
```

> **Lưu ý**: `+` chỉ dành cho số. Dùng với chuỗi sẽ tạo ra cảnh báo.

---

## Luồng Điều Khiển

```zymbol
x = 7

// Nếu đơn giản
? x > 0 { >> "dương" ¶ }

// Nếu / nếu không thì / khác
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

Các khối `{ }` là **bắt buộc** ngay cả với một dòng lệnh.

---

## Match

```zymbol
// Match với khoảng giá trị
điểm = 85
xếpLoại = ?? điểm {
    90..100 : 'A'
    80..89  : 'B'
    70..79  : 'C'
    _       : 'F'
}
>> xếpLoại ¶    // → B

// Match với guard (điều kiện tùy ý)
nhiệt = -5
trạngThái = ?? nhiệt {
    _? nhiệt < 0  : "băng"
    _? nhiệt < 20 : "lạnh"
    _? nhiệt < 35 : "ấm"
    _             : "nóng"
}
>> trạngThái ¶    // → băng

// Match với chuỗi
màu = "đỏ"
mã = ?? màu {
    "đỏ"   : "#FF0000"
    "xanh" : "#00FF00"
    _      : "#000000"
}
>> mã ¶
```

---

## Vòng Lặp

```zymbol
// Khoảng giá trị bao gồm cả hai đầu: 0..4 lặp 0,1,2,3,4
@ i:0..4 { >> i " " }
>> ¶    // → 0 1 2 3 4

// Khoảng với bước nhảy
@ i:1..9:2 { >> i " " }
>> ¶    // → 1 3 5 7 9

// Khoảng đảo ngược
@ i:5..0:1 { >> i " " }
>> ¶    // → 5 4 3 2 1 0

// While (trong khi)
n = 1
@ n <= 64 { n *= 2 }
>> n ¶    // → 128

// Duyệt từng phần tử
trái = ["táo", "lê", "nho"]
@ t:trái { >> t ¶ }

// Duyệt từng ký tự của chuỗi
@ c:"xin chào" { >> c "-" }
>> ¶    // → x-i-n- -c-h-à-o-

// Break và Continue
@ i:1..10 {
    ? i % 2 == 0 { @> }    // @> tiếp tục
    ? i > 7 { @! }          // @! dừng lại
    >> i " "
}
>> ¶    // → 1 3 5 7
```

---

## Hàm

```zymbol
// Khai báo và gọi hàm
cộng(a, b) { <~ a + b }
>> cộng(3, 4) ¶    // → 7

// Đệ quy
giai_thừa(n) {
    ? n <= 1 { <~ 1 }
    <~ n * giai_thừa(n - 1)
}
>> giai_thừa(5) ¶    // → 120

// Hàm có phạm vi biệt lập — không truy cập biến ngoài
toàn_cục = 100
kiểm_tra() {
    x = 42    // chỉ cục bộ
    <~ x
}
>> kiểm_tra() ¶    // → 42
```

> **Quan trọng**: Hàm khai báo với `tên(params){ }` không phải là giá trị hạng nhất.
> Để truyền làm đối số, hãy bọc lại: `x -> tên(x)`.

---

## Lambda và Closure

```zymbol
// Lambda đơn giản (trả về ngầm định)
gấpĐôi = x -> x * 2
tổng = (a, b) -> a + b
>> gấpĐôi(5) ¶    // → 10
>> tổng(3, 7) ¶   // → 10

// Lambda với khối (trả về tường minh)
phânLoạiSố = x -> {
    ? x > 0 { <~ "dương" }
    _? x < 0 { <~ "âm" }
    <~ "không"
}
>> phânLoạiSố(5) ¶     // → dương
>> phânLoạiSố(0) ¶     // → không
>> phânLoạiSố(-5) ¶    // → âm

// Closure — lambda bắt biến từ phạm vi ngoài
hệ_số = 3
gấpBa = x -> x * hệ_số    // bắt 'hệ_số'
>> gấpBa(7) ¶    // → 21

// Nhà máy hàm
tạo_cộng(n) { <~ x -> x + n }
cộng10 = tạo_cộng(10)
>> cộng10(5) ¶    // → 15

// Lambda như giá trị: lưu trong mảng
phép = [x -> x+1, x -> x*2, x -> x*x]
>> phép[0](5) ¶    // → 6
>> phép[2](5) ¶    // → 25
```

---

## Mảng

```zymbol
mảng = [10, 20, 30, 40, 50]

// Truy cập (chỉ số bắt đầu từ 0)
>> mảng[0] ¶    // → 10

// Độ dài (cần dấu ngoặc đơn trong >>)
n = mảng$#
>> (mảng$#) ¶    // → 5

// Thêm, xóa, kiểm tra, cắt
mảng = mảng$+ 60               // thêm phần tử
mảng = mảng$- 0                // xóa chỉ số 0
có = mảng$? 30                  // → #1
đoạn = mảng$[0..2]             // [20, 30]

// Cập nhật phần tử
mảng[1] = 99

// Duyệt từng phần tử
@ x:mảng { >> x " " }
>> ¶
```

> `$+`, `$-`, `$[..]` trả về **mảng mới** — gán lại: `mảng = mảng$+ 4`.
> Không thể nối chuỗi toán tử: dùng hai phép gán riêng biệt.

---

## Tuple

```zymbol
// Tuple có tên
người = (tên: "Alice", tuổi: 25)
>> người.tên ¶    // → Alice
>> người.tuổi ¶   // → 25
>> người[0] ¶     // → Alice (chỉ số cũng hoạt động)
```

---

## Hàm Bậc Cao

Các toán tử HOF yêu cầu **lambda inline** — không phải biến lambda trực tiếp.

```zymbol
số = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Map ($>)
gấpĐôi = số$> (x -> x * 2)
>> gấpĐôi ¶    // → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// Filter ($|)
chẵn = số$| (x -> x % 2 == 0)
>> chẵn ¶    // → [2, 4, 6, 8, 10]

// Reduce ($<) — (giá_trị_đầu, (tích_lũy, phần_tử) -> biểu_thức)
tổng = số$< (0, (acc, x) -> acc + x)
>> tổng ¶    // → 55
```

---

## Xử Lý Lỗi

```zymbol
!? {
    x = 10 / 0
} :! ##Div {
    >> "chia cho không" ¶
} :! ##IO {
    >> "lỗi IO" ¶
} :! {
    >> "lỗi khác: " _err ¶
} :> {
    >> "luôn chạy" ¶
}
```

| Kiểu        | Khi xảy ra                    |
|-------------|-------------------------------|
| `##Div`     | Chia cho không                |
| `##IO`      | Tệp / hệ thống                |
| `##Index`   | Chỉ số ngoài giới hạn         |
| `##Type`    | Lỗi kiểu dữ liệu              |
| `##Parse`   | Lỗi phân tích cú pháp         |
| `##Network` | Lỗi mạng                      |
| `##_`       | Bất kỳ lỗi nào (catch-all)    |

---

## Mô-đun

```zymbol
// Tệp: lib/tính.zy
# tính

#> { cộng, lấy_PI }    // xuất TRƯỚC các định nghĩa

_PI := 3.14159
cộng(a, b) { <~ a + b }
lấy_PI() { <~ _PI }
```

```zymbol
// Tệp: main.zy
<# ./lib/tính <= t    // bí danh bắt buộc

>> t::cộng(5, 3) ¶    // → 8
pi = t::lấy_PI()
>> pi ¶               // → 3.14159
```

---

## Ví Dụ Hoàn Chỉnh: FizzBuzz

```zymbol
phânLoại(số) {
    ? số % 15 == 0 { <~ "XìVù" }
    _? số % 3  == 0 { <~ "Xì" }
    _? số % 5  == 0 { <~ "Vù" }
    _ { <~ số }
}

@ i:1..20 { >> phânLoại(i) ¶ }
```

---

## Tham Chiếu Ký Hiệu

| Ký hiệu  | Thao tác              | Ký hiệu    | Thao tác               |
|----------|-----------------------|------------|------------------------|
| `=`      | biến                  | `$#`       | độ dài                 |
| `:=`     | hằng số               | `$+`       | thêm vào               |
| `>>`     | xuất                  | `$-`       | xóa (theo chỉ số)      |
| `<<`     | nhập                  | `$?`       | kiểm tra có chứa       |
| `¶`/`\`  | xuống dòng            | `$[s..e]`  | cắt mảng/chuỗi         |
| `?`      | nếu (if)              | `$>`       | map                    |
| `_?`     | nếu không thì (elif)  | `$\|`      | filter                 |
| `_`      | khác / wildcard       | `$<`       | reduce                 |
| `??`     | match                 | `!?`       | thử (try)              |
| `@`      | vòng lặp              | `:!`       | bắt lỗi (catch)        |
| `@!`     | dừng (break)          | `:>`       | luôn chạy (finally)    |
| `@>`     | tiếp tục (continue)   | `$!`       | là lỗi                 |
| `->`     | lambda                | `$!!`      | lan truyền lỗi         |
| `<~`     | trả về (return)       | `#`        | khai báo mô-đun        |
| `\|>`    | pipe                  | `#>`       | xuất khẩu              |
| `#1`     | đúng (true)           | `<#`       | nhập khẩu              |
| `#0`     | sai (false)           | `::`       | gọi mô-đun             |

---

*Zymbol-Lang — Biểu Tượng. Phổ Quát. Bất Biến.*

---

> **Cảnh báo:** Tài liệu này được tạo và dịch bởi trí tuệ nhân tạo (AI).
> Mọi nỗ lực đã được thực hiện để đảm bảo độ chính xác, nhưng một số bản dịch hoặc ví dụ có thể chứa lỗi.
> Tài liệu tham chiếu chính thức là [đặc tả Zymbol-Lang](https://github.com/OscarEEspinozaB/zymbol-lang-web).
>
> **Disclaimer:** This documentation was created and translated by artificial intelligence (AI).
> While every effort has been made to ensure accuracy, some translations or examples may contain errors.
> The canonical reference is the [Zymbol-Lang specification](https://github.com/OscarEEspinozaB/zymbol-lang-web).
