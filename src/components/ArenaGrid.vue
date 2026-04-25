<template>
  <!--
    v-row / v-col: Vuetify Grid-System (basiert auf CSS Flexbox)
    Teilt die Zeile in gleich breite Spalten auf.
    gap-2, pr-4, pl-4, mt-4 = Vuetify Spacing-Klassen (je 4px × Zahl)
  -->
  <v-row class="gap-2 pr-4 pl-4 mt-4">
    <v-col>
      <!--
        SizeFields: eigene Komponente (./SizeFields.vue)
        v-model="gridLength" → nutzt defineEmits('update:modelValue')
        Wenn der Nutzer die Zahl ändert, wird gridLength hier aktualisiert.
        Das löst automatisch eine Neuberechnung von rectsCanvas aus (computed).
      -->
      <ArenaSize v-model="gridLength" label="Länge der Arena" />
    </v-col>
    <v-col>
      <ArenaSize v-model="gridWidth" label="Breiter der Arena" />
    </v-col>
  </v-row>

  <!--
    Äußerer Wrapper: zentriert den scrollbaren Bereich auf der Seite.
    d-flex        → display: flex
    justify-center → horizontale Zentrierung
    align-center  → vertikale Zentrierung
    pa-4          → padding rundherum
  -->
  <div class="d-flex justify-center align-center pa-4">
    <!--
      Scrollbares Fenster:
      - Feste Größe (400×400px) damit es nicht endlos wächst
      - overflow: auto → Scrollbars erscheinen NUR wenn der Inhalt größer ist
      - margin: 16px auto → zentriert den Block horizontal im Flex-Container
      - border + border-radius → optischer Rahmen
    -->
    <div
      style="
        width: 400px;
        height: 400px;
        overflow: auto;
        border: 1px solid rgba(128, 128, 128, 0.3);
        margin: 16px auto;
        background-color: gray;
      "
    >
      <!--
        Das eigentliche Grid:
        display: grid → CSS Grid Layout
        grid-template-columns: repeat(${gridWidth}, ${stageSize.width}px)
          → erstellt so viele Spalten wie gridWidth angibt,
            jede Spalte ist stageSize.width (50px) breit.
          Beispiel: gridWidth=3 → "repeat(3, 50px)" → 3 Spalten à 50px

        width: fit-content → der Grid-Container ist nur so breit wie sein Inhalt.
          Wichtig damit overflow: auto im Parent korrekt scrollt!
          Ohne das würde der Grid auf 400px gequetscht werden.

        gap-2 → 8px Abstand zwischen den Zellen (Vuetify Klasse)
        pa-4  → 16px Innenabstand
      -->
      <div
        class="gap-2 pa-4"
        :style="`
          display: grid;
          grid-template-columns: repeat(${gridWidth}, ${stageSize.width}px);
          width: fit-content;
        `"
      >
        <!--
          v-for: iteriert über rectsCanvas (computed Array).
          Für jede Zelle wird eine v-stage gerendert.

          :key → Vue braucht einen eindeutigen Key pro Element
                 um das DOM effizient zu aktualisieren (Virtual DOM Diffing).

          :config → übergibt Breite/Höhe an Konva (Canvas-Größe)

          @click → Konva-Event (KonvaEventObject<MouseEvent>)
                   öffnet den ColorPicker nach 200ms Verzögerung

          @dblclick → Konva-Event, setzt Zellfarbe zurück auf Default.
                      Bricht außerdem den click-Timer ab damit der
                      ColorPicker nicht aus versehen aufgeht.
        -->
        <v-stage
          v-for="rectCanvas in rectsCanvas"
          :key="rectCanvas.id"
          :config="rectCanvas.stage"
          @click="openColorPicker(rectCanvas.id, $event)"
          @dblclick="setDefaultColor(rectCanvas.id, $event)"
        >
          <!--
            v-layer: Konva-Layer, nötig als Zwischenschicht zwischen
            Stage und den eigentlichen Shapes (Rect, Circle, etc.)
            Man kann mehrere Layer übereinander legen (z.B. für UI vs. Inhalt)
          -->
          <v-layer>
            <!--
              v-rect: zeichnet ein Rechteck auf den Canvas.
              :config enthält: x, y, width, height, fill, shadowBlur
              fill kommt aus cellColors Map → ändert sich per Klick
            -->
            <v-rect :config="rectCanvas.rect" />
          </v-layer>
        </v-stage>
      </div>
    </div>
  </div>

  <!--
    Floating ColorPicker:
    Wird nur angezeigt wenn colorPickerOpen = true.
    position: fixed → relativ zum Browserfenster, nicht zum Dokument.
                      Scrollt NICHT mit der Seite mit.
    top/left kommen aus pickerY/pickerX → werden beim Klick gesetzt
              auf event.evt.clientX/Y (Mausposition im Browserfenster)
    z-index: 1000 → liegt über allem anderen (außer dem Overlay darunter)

    @click="applyColor" → Klick irgendwo auf den Picker übernimmt die Farbe.
    show-swatches → zeigt vordefinierte Farbfelder zur schnellen Auswahl
    mode="hex" → Standardmodus ist Hex-Eingabe (#FF0000)
  -->
  <div
    v-if="colorPickerOpen"
    :style="`position: fixed; top: ${pickerY}px; left: ${pickerX}px; z-index: 1000`"
  >
    <v-card>
      <v-color-picker
        show-swatches
        v-model="activeColor"
        mode="hex"
        @click="applyColor"
      />
    </v-card>
  </div>

  <!--
    Unsichtbares Overlay:
    Liegt unter dem ColorPicker (z-index: 999) aber über allem anderen.
    Fängt jeden Klick AUSSERHALB des Pickers ab → schließt ihn.
    inset: 0 = top/right/bottom/left alle 0 → deckt den ganzen Viewport ab.
  -->
  <div
    v-if="colorPickerOpen"
    style="position: fixed; inset: 0; z-index: 999"
    @click="colorPickerOpen = false"
  />
</template>
<!--
#MARK: Script:
 -->
<script setup lang="ts">
import { ref, computed } from "vue";
import type { KonvaEventObject } from "konva/lib/Node";
import { Stage as VStage, Layer as VLayer, Rect as VRect } from "vue-konva";
import { useArenaStore } from '@/stores/useArenaStore'
import ArenaSize from "./ArenaSize.vue";

/*
  stageSize: feste Größe jeder einzelnen Zelle in Pixeln.
  Keine ref() nötig da sich dieser Wert nie ändert.
*/
const stageSize = {
  width: 50,
  height: 50,
};

/*
  ref(): macht eine Variable reaktiv.
  → Wenn sich der Wert ändert, rendert Vue automatisch neu.
  gridLength = Anzahl der Zeilen (nach unten)
  gridWidth  = Anzahl der Spalten (nach rechts)
*/
const { gridLength, gridWidth } = useArenaStore()

// Steuert ob der ColorPicker sichtbar ist
const colorPickerOpen = ref(false);

// Aktuell gewählte Farbe im ColorPicker (v-model des Pickers)
const activeColor = ref("#FF0000");

// Position des ColorPickers im Browserfenster (Mausposition beim Klick)
const pickerX = ref(0);
const pickerY = ref(0);

// Welche Zelle gerade zum Färben ausgewählt ist
const selectedCellId = ref<number | null>(null);

/*
  Map<number, string>: speichert pro Zell-ID eine Farbe.
  Beispiel: { 0 → "#FF0000", 5 → "#00FF00" }
  Zellen die nicht in der Map sind bekommen die Standardfarbe (#cccccc).
*/
const cellColors = ref(new Map<number, string>());

/*
  clickTimer: wird gebraucht um Einfach- und Doppelklick zu trennen.
  Problem: Ein Doppelklick feuert immer erst 2× @click, dann @dblclick.
  Lösung: @click wartet 200ms bevor er reagiert.
           Kommt in dieser Zeit @dblclick → Timer wird abgebrochen.
  ReturnType<typeof setTimeout>: der korrekte TypeScript-Typ für Timer-IDs
*/
let clickTimer: ReturnType<typeof setTimeout> | null = null;

/*
  openColorPicker: wird bei Einfachklick auf eine Zelle aufgerufen.

  KonvaEventObject<MouseEvent>: Konva-spezifischer Event-Typ.
  .evt → das rohe Browser-MouseEvent (mit clientX/Y)
  Direkt event.clientX würde nicht funktionieren da Konva das Event wrапpt!
*/
function openColorPicker(id: number, event: KonvaEventObject<MouseEvent>) {
  clickTimer = setTimeout(() => {
    selectedCellId.value = id;

    // Aktuelle Farbe der Zelle vorladen (falls sie schon eine hat)
    activeColor.value = cellColors.value.get(id) ?? "#FF0000";

    // Picker direkt an der Mausposition öffnen
    pickerX.value = event.evt.clientX;
    pickerY.value = event.evt.clientY / 2; // /2 wegen Layout-Offset
    colorPickerOpen.value = true;
  }, 200); // 200ms warten → gibt Doppelklick Zeit den Timer abzubrechen
}

/*
  setDefaultColor: wird bei Doppelklick aufgerufen.
  Löscht die Farbe der Zelle aus der Map → Zelle wird wieder grau.

  clearTimeout: bricht den pending @click-Timer ab
                damit der ColorPicker nicht versehentlich aufgeht.

  new Map(cellColors.value): erstellt eine neue Map-Instanz.
  Nötig weil Vue Änderungen INNERHALB einer Map/Set nicht automatisch erkennt!
  Eine neue Instanz zuzuweisen triggert die Reaktivität.
*/
function setDefaultColor(id: number, event: KonvaEventObject<MouseEvent>) {
  if (clickTimer) clearTimeout(clickTimer);
  cellColors.value.delete(id);
  cellColors.value = new Map(cellColors.value); // Reaktivität triggern
  colorPickerOpen.value = false;
}

/*
  applyColor: übernimmt die im Picker gewählte Farbe für die ausgewählte Zelle.
  Wird bei Klick auf den ColorPicker aufgerufen.
*/
function applyColor() {
  if (selectedCellId.value !== null) {
    cellColors.value.set(selectedCellId.value, activeColor.value);
    cellColors.value = new Map(cellColors.value); // Reaktivität triggern
  }
  colorPickerOpen.value = false;
}

/*
  computed(): berechnet rectsCanvas neu sobald sich eine abhängige
  reactive Variable ändert (gridWidth, gridLength, cellColors).

  Array.from({ length: X }): erstellt ein Array mit X Elementen.
  (_, index): _ = der Wert (hier immer undefined, wird ignoriert)
               index = die aktuelle Position (0, 1, 2, ...)

  Das Ergebnis: ein Array von Objekten mit:
  - id: eindeutige ID der Zelle
  - stage: Konva Stage-Konfiguration (Canvas-Größe)
  - rect: Konva Rect-Konfiguration (Position, Größe, Farbe, Schatten)

  fill: cellColors.value.get(index) ?? "#cccccc"
    → Hat die Zelle eine Farbe in der Map? → nimm sie
    → Sonst → Standardfarbe grau (#cccccc)
    ?? = Nullish Coalescing Operator (wie || aber nur für null/undefined)
*/
const rectsCanvas = computed(() =>
  Array.from({ length: gridWidth.value * gridLength.value }, (_, index) => ({
    id: index,
    stage: { width: stageSize.width, height: stageSize.height },
    rect: {
      x: 0,
      y: 0,
      width: stageSize.width,
      height: stageSize.height,
      fill: cellColors.value.get(index) ?? "#cccccc",
      shadowBlur: 10,
    },
  })),
);
</script>
