import { ref } from 'vue'

// ✅ Außerhalb von defineComponent → wird nur EINMAL erstellt
//    und von allen Komponenten geteilt
const gridLength = ref(1)
const gridWidth = ref(1)

const fieldLength = ref("")
const fieldWidth = ref("")

const COLOR_LUT = [
  { idx: 0, name: 'Rot',     hex: '#FF0000' },
  { idx: 1, name: 'Grün',    hex: '#00FF00' },
  { idx: 2, name: 'Blau',    hex: '#0000FF' },
  { idx: 3, name: 'Gelb',    hex: '#FFFF00' },
  { idx: 4, name: 'Cyan',    hex: '#00FFFF' },
  { idx: 5, name: 'Magenta', hex: '#FF00FF' },
  { idx: 6, name: 'Weiß',    hex: '#FFFFFF' },
  { idx: 7, name: 'Schwarz', hex: '#000000' },
  { idx: 8, name: 'Orange',  hex: '#FF8000' },
  { idx: 9, name: 'Lila',    hex: '#8000FF' },
]

const cellColors = ref(new Map<number, number>())

export function useArenaStore() {
  return { gridLength, gridWidth, fieldLength, fieldWidth, cellColors, COLOR_LUT }
}
