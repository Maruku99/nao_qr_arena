import { ref } from 'vue'

// ✅ Außerhalb von defineComponent → wird nur EINMAL erstellt
//    und von allen Komponenten geteilt
const gridLength = ref(1)
const gridWidth = ref(1)

const fieldLength = ref("")
const fieldWidth = ref("")

export function useArenaStore() {
  return { gridLength, gridWidth, fieldLength, fieldWidth }
}
