Nutzer ändert Input
  → gridWidth / gridLength (ref) ändert sich
    → rectsCanvas (computed) wird neu berechnet
      → Vue rendert das Grid neu ✅

Nutzer klickt Zelle
  → openColorPicker() → Timer startet (200ms)
    → ColorPicker öffnet sich an Mausposition

Nutzer wählt Farbe + klickt
  → applyColor() → cellColors.set(id, farbe)
    → cellColors = new Map() → Reaktivität
      → rectsCanvas neu berechnet → Zelle ändert Farbe ✅

Nutzer doppelklickt Zelle
  → Timer wird abgebrochen (kein Picker)
  → cellColors.delete(id) → Zelle wird grau ✅
