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
| `8` | 1 Byte | colorR — Paar 1 | `00` |
| `9` | 1 Byte | colorG — Paar 1 | `00` |
| `10` | 1 Byte | colorB — Paar 1 | `ff` |
| `11` | 1 Byte | cellId — Paar 2 | `0b` |
| `12` | 1 Byte | colorR — Paar 2 | `00` |
| `13` | 1 Byte | colorG — Paar 2 | `00` |
| `14` | 1 Byte | colorB — Paar 2 | `00` |
| `...` | ... | weitere cellId/RGB-Paare | |

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
- Zelle 5 → Blau (`#0000FF`)
- Zelle 11 → Schwarz (`#000000`)

**Hex-String im QR-Code:**
```
03 04 0a 08 00 0b 02 05 00 00 ff 0b 00 00 00
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
05 00 00 ff → Zelle  5 = #0000FF (Blau)
0b 00 00 00 → Zelle 11 = #000000 (Schwarz)
```

---

## Default-Palette (UI)

Die UI bietet eine feste Palette, die in die QR-Payload als RGB-Werte geschrieben wird:

| Name | Hex-Farbe |
|---|---|
| Rot | `#FF0000` |
| Grün | `#00FF00` |
| Blau | `#0000FF` |
| Gelb | `#FFFF00` |
| Cyan | `#00FFFF` |
| Magenta | `#FF00FF` |
| Weiß | `#FFFFFF` |
| Schwarz | `#000000` |
| Orange | `#FF8000` |
| Lila | `#8000FF` |

Hinweis: Intern wird pro Zelle nur der Paletten-Index gespeichert; beim Export wird der Index auf RGB abgebildet.

---

## Limitierungen

| Feld | Max. Wert | Grund |
|---|---|---|
| `gridLength` / `gridWidth` | 255 | uint8 |
| `fieldLength` / `fieldWidth` | 255 | uint8 |
| `startId` / `finishId` | 255 | uint8 |
| Anzahl Zellen | 255 | uint8 |
| Farbkanäle `R/G/B` | 255 | uint8 |

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
