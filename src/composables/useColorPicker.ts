// composables/useColorPicker.ts
import { ref } from "vue";
import type { KonvaEventObject } from "konva/lib/Node";
import { useArenaStore } from "@/stores/useArenaStore";

const PICKER_MARGIN = 8;
const PICKER_WIDTH = 320;
const PICKER_HEIGHT = 420;

export function useColorPicker() {
  const { cellColors, COLOR_LUT } = useArenaStore();

  const colorPickerOpen = ref(false);
  const activeColorIdx = ref(0);
  const pickerX = ref(0);
  const pickerY = ref(0);
  const selectedCellId = ref<number | null>(null);

  let clickTimer: ReturnType<typeof setTimeout> | null = null;

  function clearClickTimer() {
    if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; }
  }

  function getEventClientPosition(event: MouseEvent | TouchEvent | PointerEvent) {
    if ("clientX" in event) return { x: event.clientX, y: event.clientY };
    const t = event.touches?.[0] ?? event.changedTouches?.[0];
    return t ? { x: t.clientX, y: t.clientY } : { x: 0, y: 0 };
  }

  function clampPickerPosition(x: number, y: number) {
    const maxX = Math.max(PICKER_MARGIN, window.innerWidth - PICKER_WIDTH - PICKER_MARGIN);
    const maxY = Math.max(PICKER_MARGIN, window.innerHeight - PICKER_HEIGHT - PICKER_MARGIN);
    return {
      x: Math.min(Math.max(x, PICKER_MARGIN), maxX),
      y: Math.min(Math.max(y, PICKER_MARGIN), maxY),
    };
  }

  function openColorPicker(id: number, event: KonvaEventObject<MouseEvent | TouchEvent | PointerEvent>) {
    clearClickTimer();
    const pos = getEventClientPosition(event.evt);
    clickTimer = setTimeout(() => {
      selectedCellId.value = id;
      const storedIdx = cellColors.value[id] ?? -1;
      activeColorIdx.value = storedIdx >= 0 ? storedIdx : 0;
      const clamped = clampPickerPosition(pos.x, pos.y);
      pickerX.value = clamped.x;
      pickerY.value = clamped.y;
      colorPickerOpen.value = true;
    }, 250);
  }

  function setDefaultColor(id: number, _event: KonvaEventObject<MouseEvent | TouchEvent | PointerEvent>) {
    clearClickTimer();
    cellColors.value[id] = -1;
    cellColors.value = [...cellColors.value];
    colorPickerOpen.value = false;
  }

  function applyColor(idx: number) {
    if (selectedCellId.value !== null) {
      if (COLOR_LUT[idx]) {
        cellColors.value[selectedCellId.value] = idx;
        cellColors.value = [...cellColors.value];
      }
    }
    colorPickerOpen.value = false;
  }

  return {
    colorPickerOpen, activeColorIdx, pickerX, pickerY,
    openColorPicker, setDefaultColor, applyColor,
  };
}
