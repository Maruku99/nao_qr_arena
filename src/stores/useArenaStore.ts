import { ref, watch } from 'vue'

const gridLength = ref(1)
const gridWidth = ref(1)

const fieldLength = ref(1)
const fieldWidth = ref(1)

const startId = ref(0)
const finishId = ref(0)

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

const DEFAULT_COLOR_IDX = -1
const cellColors = ref<number[]>([])

function resizeCellColors(size: number) {
  const next = cellColors.value.slice(0, size)
  while (next.length < size) {
    next.push(DEFAULT_COLOR_IDX)
  }
  cellColors.value = next
}

watch([gridLength, gridWidth], ([length, width]) => {
  const size = Math.max(0, length * width)
  resizeCellColors(size)
}, { immediate: true })

export function useArenaStore() {
  return { gridLength, gridWidth, fieldLength, fieldWidth, startId, finishId, cellColors, COLOR_LUT }
}
