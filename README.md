# Point Out — Color Escape (HTML5)

Bản làm lại bằng HTML5 của game **Point Out: Color Escape Puzzle** (`com.arrow.out`),
chơi được **toàn bộ 6740 màn** trích trực tiếp từ APK gốc, đúng theo danh mục
chiến dịch mà game thật dùng (xem *Chọn đúng bộ level* bên dưới).

Không dùng framework, không cần build. Mở là chơi.

## Chơi thử

```bash
npm start          # http://localhost:5273
# hoặc
node server.js 8080
```

Mở thẳng `index.html` bằng trình duyệt cũng chạy (cần Chrome/Edge/Firefox đời mới —
dữ liệu màn được giải nén bằng `DecompressionStream`).

## Luật chơi

Mỗi mũi tên là một đường đi trên lưới, đầu mũi tên ở ô đầu tiên của đường.
Chạm vào mũi tên: nếu **tia thẳng từ đầu mũi tên tới mép bàn không bị mũi tên nào khác chắn**
thì nó trượt ra ngoài theo chính đường đi của mình. Bị chắn thì rung và báo lỗi.

Luật này được kiểm chứng bằng mô phỏng trên cả 6740 màn: **6740/6740 giải được**,
trong khi giả thuyết "tịnh tiến cả khối" chỉ giải được 1 màn.

## Chọn đúng bộ level

APK chứa **8842** asset `ArrowsOutLevelData` nhưng chỉ **6744** tên duy nhất — 2000 tên
có nhiều bản, và 1920 trong số đó là **puzzle khác hẳn nhau**, không phải bản sao.
Lấy bừa theo tên sẽ ra một bộ lai.

Thứ quyết định là 4 asset `StarLevelDataSystem` (`2kv1`, `2kv2`, `Cat3`, `Cat4`).
Mỗi cái là một danh mục, kế thừa `BaseLevelDataSystem` với ba danh sách:

| Danh sách | Nội dung |
|---|---|
| `_PreDefinedLevelsData` | **6740 mục, level_1…level_6740 đúng thứ tự — chiến dịch chính** |
| `_RotatingLevelsData` | 4740 mục (level_2001…6740) |
| `_BackUpLevelsData` | 90 mục (level_11…100) |

Bốn danh mục khác nhau ở: `2kv2` khác `2kv1` đúng **2000 slot** (màn 1–2000 — A/B test
của 2000 màn đầu, đúng như tên gọi), `Cat3` khác 1 slot, `Cat4` khác 12 slot.

Bản này dùng `_PreDefinedLevelsData` của **`2kv1`**. Kiểm chứng: màn 1 của bộ này là lưới
6×5 với 4 mũi tên — hai xanh đầu quay xuống ở hai bên, hai vàng đầu quay lên ở giữa —
**khớp từng nét với video quay từ game thật**.

## Nội dung

| | |
|---|---|
| `index.html` | toàn bộ game (render, luật chơi, âm thanh, nhạc, booster, UI) |
| `levels/` | 6740 màn, nén gzip + base64, chia 34 gói nạp dần |
| `server.js` | web server tĩnh, không phụ thuộc package nào |
| `docs/EXTRACTION.md` | cách trích dữ liệu từ APK và định dạng màn chơi |

## Booster

Bộ booster, giá, số lượng mỗi gói và màn mở khoá **lấy đúng từ asset của APK gốc**
(`BaseBooster._boosterType` neo layout: Hint=4, Eraser=5, Wand=6, GridScale=7):

| Booster | Giá | Mỗi gói | Mở ở màn | Tác dụng (mô tả gốc trong game) |
|---|---|---|---|---|
| 💡 Hint | 900 🪙 | 3 | 4 | *Highlights an arrow that can safely exit!* |
| 🔍 Grid Scale | 250 🪙 | 5 | 6 | *Displays helpful grid guide lines!* |
| 🧽 Eraser | 1400 🪙 | 3 | 8 | *Tap an Arrow to Remove!* |
| ✨ Magic Wand | 1900 🪙 | 3 | 12 | *Instantly removes a bunch of arrows!* |

Gói đầu của mỗi booster được tặng khi tới màn mở khoá.

## Giấy phép

Dự án học tập. Dữ liệu màn chơi và thiết kế thuộc về chủ sở hữu game gốc.
