import { ref } from 'vue'

// ✅ Außerhalb von defineComponent → wird nur EINMAL erstellt
//    und von allen Komponenten geteilt
const gridLength = ref(1)
const gridWidth = ref(1)

const fieldLength = ref("")
const fieldWidth = ref("")

/*
  Map<number, string>: speichert pro Zell-ID eine Farbe.
  Beispiel: { 0 → "#FF0000", 5 → "#00FF00" }
  Zellen die nicht in der Map sind bekommen die Standardfarbe (#cccccc).
*/
const cellColors = ref(new Map<number, string>());

export function useArenaStore() {
  return { gridLength, gridWidth, fieldLength, fieldWidth, cellColors }
}
