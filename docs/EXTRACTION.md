# Point Out: Color Escape — kết quả phân tích APK

Nguồn: `Point+Out_+Color+Escape+Puzzle_1.8.1_APKPure.xapk`
Package `com.arrow.out`, version 1.8.1 (versionCode 298).

## Engine

- **Unity 6000.0.60f1**, scripting backend **IL2CPP** (`libil2cpp.so` 89 MB, `global-metadata.dat` v31).
- Toàn bộ dữ liệu màn chơi nằm trong `assets/bin/Data/sharedassets0.assets`
  (file bị chia thành 170 mảnh `.splitN`, phải nối lại trước khi đọc).
- Không có type tree trong build release → phải lấy layout field từ IL2CPP metadata.

## Bộ level design

**8842 object `ArrowsOutLevelData`, trong đó 6744 tên duy nhất:
`level_1` … `level_6740` (đủ, không thiếu màn nào) + 4 màn phụ
(`Level_13`, `Level_15`, `level_18_New`, `level_29_New`).**

Tất cả 6744 màn đã được parse **khớp chính xác đến từng byte cuối cùng** (0 lỗi).

Thống kê:

| | |
|---|---|
| Tổng số mũi tên | 757.521 |
| Tổng số ô đường đi | 7.355.445 |
| Trung bình | ~112 mũi tên / màn |
| Kích thước lưới | 5×5 (màn 1) → 71×68 |
| Cơ chế dùng trong data | **chỉ có `Simple`** |
| Tunnel / grid object | không có màn nào dùng |
| Màu | 52 `ArrowColorType`, 718 giá trị RGB thực tế |

Game *có code* cho các cơ chế `Twin`, `Bidirectional`, `Bomb`, `Golden`, `Tunnel`,
nhưng **không màn nào trong bộ dữ liệu đóng gói sử dụng chúng** — nhiều khả năng
chúng được bật qua remote config hoặc `ArrowsOutLevelGenerator` lúc chạy.

## Cấu trúc dữ liệu (lấy từ IL2CPP metadata)

```csharp
class ArrowsOutLevelData : BaseLevelData {   // MSKit.Level.BaseLevelData
    // --- kế thừa từ BaseLevelData, serialize trước ---
    GameType GameType;  int LevelId;  int LevelUId;  bool IsFtueLevel;
    LevelDifficultyType Difficulty;  MechanicTypes MechanicType;
    float LevelTime;  int LevelMoves;
    AllGoalsData AllGoalsData;                 // { List<GoalData> Goals } — luôn rỗng
    RewardData RewardData, SecondaryRewardData; // { CurrencyType, float Amount } = 8 byte
    // --- của riêng ArrowsOutLevelData ---
    int   XSize, YSize;
    float CameraSize;                          // luôn = -1 (auto)
    List<int> AllIndices;
    List<GridObjectLevelData> GridObjects;     // { Type, ObjectIndices, DependentArrows, Rotation }
    List<ArrowLevelData>      Arrows;
}

struct ArrowLevelData {
    ArrowDirection      Direction;   // Left=0, Right=1, Up=2, Down=3
    List<int>           Indices;     // đường đi; Indices[0] = ĐẦU mũi tên
    ArrowMechanicsData  Mechanic;    // { MechanicType, List<int> RelatedArrows, int GeneralPurposeCount }
    ArrowType           ArrowType;   // Simple=0, ThreeD=1
    Color               Color;       // 4 float RGBA
    ArrowColorType      ColorType;   // 0..51
}
```

### Hệ toạ độ

```
index = row * XSize + col        row 0 = HÀNG DƯỚI CÙNG   (Unity Y-up)
```

Xác nhận bằng video: màn 3 có mũi tên đỏ viền ngoài với đầu ở **góc dưới-trái
chỉ sang trái** — đúng như dữ liệu dự đoán khi row 0 nằm dưới.

### Luật chơi (đã kiểm chứng)

Mũi tên bay ra được **khi và chỉ khi** tia thẳng đi từ ô đầu (`Indices[0]`)
theo `Direction` đến mép bảng không bị mũi tên nào khác chắn.
Thân mũi tên trượt theo đúng đường đi của chính nó (kiểu con rắn) — nó **không**
tịnh tiến cả khối.

Kiểm chứng: mô phỏng cả hai giả thuyết trên toàn bộ 6744 màn.

| Luật | Số màn giải được |
|---|---|
| Tia từ ô đầu (rắn) | **6744 / 6744** |
| Tịnh tiến cả khối | 1 / 6744 |

## File trong thư mục này

- `levels.jsonl` (83 MB) — 1 màn / dòng, đầy đủ, `cells` là mảng index tường minh.
- `levels_compact.jsonl` (48 MB) — như trên nhưng đường đi nén thành chuỗi
  `p` gồm các ký tự `L/R/U/D` (bước đi từ ô đầu). 37 mũi tên (trên tổng 757.521)
  có đường đi bị đứt đoạn trong dữ liệu gốc → những mũi tên đó giữ `cells` tường minh.

Bảng màu chuẩn (`ArrowColorType` → RGB) — trích từ chính dữ liệu màn chơi:

| | | | |
|---|---|---|---|
| Blue `#4285f4` | Red `#c83f45` | Yellow `#ffc315` | Green `#48b06a` |
| Purple `#9869ff` | Pink `#e365b0` | Orange `#ef8314` | Peach `#ff6f61` |
| SeaGreen `#0fb2b8` | Aqua `#35d8ff` | ParrotGreen `#9ee338` | LightBrown `#8d6e3f` |
| BlueishGray `#5a6b7a` | DarkBrown `#694714` | DarkBlue `#2c5fcc` | OffWhite `#fff1c1` |
| Gray `#959595` | | | |

Mỗi màu còn có biến thể `_Dark` / `_Light`. Bản game HTML5 dùng **giá trị RGB
gốc của từng mũi tên** nên màu trùng khít với bản Unity.
