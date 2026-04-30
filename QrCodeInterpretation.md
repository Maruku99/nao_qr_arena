# NAO QR-Code Byte-Protokoll

## Byte-Reihenfolge

| Offset | Größe | Inhalt | Beispiel |
|--------|-------|--------|---------|
| `0` | 1 Byte | `gridLength` | `03` |
| `1` | 1 Byte | `gridWidth` | `04` |
| `2` | 1 Byte | Länge des `fieldLength`-Strings | `02` |
| `3..N` | N Byte | `fieldLength` als UTF-8 | `31 30` → `"10"` |
| `N+1` | 1 Byte | Länge des `fieldWidth`-Strings | `01` |
| `N+2..M` | M Byte | `fieldWidth` als UTF-8 | `38` → `"8"` |
| `M+1` | 1 Byte | Anzahl der gefärbten Zellen | `02` |
| `M+2` | 1 Byte | cellId — Paar 1 | `05` |
| `M+3` | 1 Byte | colorIdx — Paar 1 | `02` → Blau |
| `M+4` | 1 Byte | cellId — Paar 2 | `0b` |
| `M+5` | 1 Byte | colorIdx — Paar 2 | `07` → Schwarz |
| `...` | ... | weitere cellId/colorIdx-Paare | |

> Zellen die **keine** Farbe haben (Standardgrau) werden **nicht** übertragen.
> Nur explizit eingefärbte Zellen landen als Paar im Byte-Array.

---

## Konkretes Hex-Beispiel

**Eingabe:**
- `gridLength = 3`
- `gridWidth = 4`
- `fieldLength = "10"`
- `fieldWidth = "8"`
- Zelle 5 → Blau (idx 2)
- Zelle 11 → Schwarz (idx 7)

**Hex-String im QR-Code:**
```
03 04 02 31 30 01 38 02 05 02 0b 07
```

**Annotiert:**
```
03        → gridLength = 3
04        → gridWidth  = 4
02        → fieldLength hat 2 Zeichen
31 30     → "10"
01        → fieldWidth hat 1 Zeichen
38        → "8"
02        → 2 Zellen sind eingefärbt
05 02     → Zelle  5 = colorIdx 2 (Blau)
0b 07     → Zelle 11 = colorIdx 7 (Schwarz)
```

---

## Farb-Lookup-Table (LUT)

| Index (Byte) | Name | Hex-Farbe |
|:---:|---|---|
| `0` | Rot | `#FF0000` |
| `1` | Grün | `#00FF00` |
| `2` | Blau | `#0000FF` |
| `3` | Gelb | `#FFFF00` |
| `4` | Cyan | `#00FFFF` |
| `5` | Magenta | `#FF00FF` |
| `6` | Weiß | `#FFFFFF` |
| `7` | Schwarz | `#000000` |
| `8` | Orange | `#FF8000` |
| `9` | Lila | `#8000FF` |

---

## Limitierungen

| Feld | Max. Wert | Grund |
|---|---|---|
| `gridLength` / `gridWidth` | 255 | uint8 |
| `fieldLength` / `fieldWidth` String | 255 Zeichen | Längenbyte ist uint8 |
| Anzahl Zellen | 255 | uint8 |
| colorIdx | 9 | LUT hat 10 Einträge (0–9) |

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
