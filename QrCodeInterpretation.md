# NAO QR-Code Byte-Protokoll

## Byte-Reihenfolge

| Offset | Größe | Inhalt | Beispiel |
|--------|-------|--------|---------|
| `0` | 1 Byte | `gridLength` | `03` |
| `1` | 1 Byte | `gridWidth` | `04` |
| `2` | 1 Byte | `fieldLength` | `0a` |
| `3` | 1 Byte | `fieldWidth` | `08` |
| `4` | 1 Byte | `startId` | `00` |
| `5` | 1 Byte | `finishId` | `0b` |
| `6` | 1 Byte | Anzahl der gefärbten Zellen | `02` |
| `7` | 1 Byte | cellId — Paar 1 | `05` |
| `8` | 1 Byte | lutIdx — Paar 1 | `02` |
| `9` | 1 Byte | cellId — Paar 2 | `0b` |
| `10` | 1 Byte | lutIdx — Paar 2 | `07` |
| `...` | ... | weitere cellId/LUT-Paare | |

> Zellen die **keine** Farbe haben (Standardgrau) werden **nicht** übertragen.
> Nur explizit eingefärbte Zellen landen als Paar im Byte-Array.

---

## Konkretes Hex-Beispiel

**Eingabe:**
- `gridLength = 3`
- `gridWidth = 4`
- `fieldLength = 10`
- `fieldWidth = 8`
- `startId = 0`
- `finishId = 11`
- Zelle 5 → Blau (LUT-Index 2)
- Zelle 11 → Hindernis (LUT-Index 7)

**Hex-String im QR-Code:**
```
03 04 0a 08 00 0b 02 05 02 0b 07
```

**Annotiert:**
```
03        → gridLength = 3
04        → gridWidth  = 4
0a        → fieldLength = 10
08        → fieldWidth  = 8
00        → startId = 0
0b        → finishId = 11
02        → 2 Zellen sind eingefärbt
05 02     → Zelle 5 = LUT-Index 2 (Blau)
0b 07     → Zelle 11 = LUT-Index 7 (Hindernis)
```

---

## COLOR_LUT (Farb-Lookup-Tabelle)

| Index | Name      | Farbe   |
|-------|-----------|---------|
| 0     | Rot       | #FF0000 |
| 1     | Grün      | #00FF00 |
| 2     | Blau      | #0000FF |
| 3     | Gelb      | #FFFF00 |
| 4     | Cyan      | #00FFFF |
| 5     | Magenta   | #FF00FF |
| 6     | Weiß      | #FFFFFF |
| 7     | Violet    | #9D3368 |
| 8     | Orange    | #FF8000 |
| 9     | Lila      | #8000FF |
| 10    | Hindernis | #000000 |

Hinweis: Index 10 repräsentiert Hindernisse auf dem Spielfeld.

---

## Limitierungen

| Feld | Max. Wert | Grund |
|---|---|---|
| `gridLength` / `gridWidth` | 255 | uint8 |
| `fieldLength` / `fieldWidth` | 255 | uint8 |
| `startId` / `finishId` | 255 | uint8 |
| Anzahl Zellen | 255 | uint8 |
| `cellId` | 255 | uint8 |
| `lutIdx` | 255 | uint8 |

> Bei Arenen über 255×255 Felder müssten `gridLength`/`gridWidth`
> auf **uint16** (2 Byte, Big-Endian) umgestellt werden.

---

## Encoding

Der Byte-Array wird als **Hex-String** in den QR-Code kodiert:
1 Byte → 2 Hex-Zeichen, z.B. `0b` = Dezimal 11.

### Frontend (TypeScript)
```ts
Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
```

### C++ dekodieren
```cpp
std::vector<uint8_t> hexDecode(const std::string& hex) {
    std::vector<uint8_t> out;
    out.reserve(hex.size() / 2);
    for (size_t i = 0; i + 1 < hex.size(); i += 2) {
        out.push_back(std::stoul(hex.substr(i, 2), nullptr, 16));
    }
    return out;
}
```

### C++ LUT-Nutzung
```cpp
// LUT-Array für Farben
static const uint32_t COLOR_LUT[] = {
    0xFF0000, // 0: Rot
    0x00FF00, // 1: Grün
    0x0000FF, // 2: Blau
    0xFFFF00, // 3: Gelb
    0x00FFFF, // 4: Cyan
    0xFF00FF, // 5: Magenta
    0xFFFFFF, // 6: Weiß
    0x9D3368, // 7: Violet
    0xFF8000, // 8: Orange
    0x8000FF, // 9: Lila
    0x000000, // 10: Hindernis
};

uint32_t color = COLOR_LUT[lutIdx];
uint8_t r = (color >> 16) & 0xFF;
uint8_t g = (color >> 8) & 0xFF;
uint8_t b = color & 0xFF;
```