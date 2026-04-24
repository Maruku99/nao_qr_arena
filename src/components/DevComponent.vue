<template>
  <v-row class="gap-2 pr-4 pl-4 mt-4">
    <v-col>
      <SizeFields v-model="gridLength" label="Länge der Arena" />
    </v-col>
    <v-col>
      <SizeFields v-model="gridWidth" label="Breiter der Arena" />
    </v-col>
  </v-row>

  <div
    class="gap-2 w-fit m-4"
    :style="`display: grid; grid-template-columns: repeat(${gridWidth}, ${stageSize.width}px)`"
  >
    <v-stage
      v-for="rectCanvas in rectsCanvas"
      :key="rectCanvas.id"
      :config="rectCanvas.stage"
      @click="openColorPicker(rectCanvas.id, $event)"
      @dblclick="setDefaultColor(rectCanvas.id, $event)"
    >
      <v-layer>
        <v-rect :config="rectCanvas.rect" />
      </v-layer>
    </v-stage>
  </div>
  <!-- ✅ Floating Color Picker, positioniert an der Klick-Stelle -->
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

  <!-- ✅ Klick außerhalb schließt den Picker -->
  <div
    v-if="colorPickerOpen"
    style="position: fixed; inset: 0; z-index: 999"
    @click="colorPickerOpen = false"
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { KonvaEventObject } from "konva/lib/Node";
import { Stage as VStage, Layer as VLayer, Rect as VRect } from "vue-konva";
import SizeFields from "./SizeFields.vue";

const stageSize = {
  width: 100,
  height: 100,
};

const gridLength = ref(1);
const gridWidth = ref(1);
const colorPickerOpen = ref(false);
const activeColor = ref("#FF0000");
const pickerX = ref(0);
const pickerY = ref(0);
const selectedCellId = ref<number | null>(null);

const cellColors = ref(new Map<number, string>());

let clickTimer: ReturnType<typeof setTimeout> | null = null;

function openColorPicker(id: number, event: KonvaEventObject<MouseEvent>) {
  clickTimer = setTimeout(() => {
    selectedCellId.value = id;
    activeColor.value = cellColors.value.get(id) ?? "#FF0000";
    pickerX.value = event.evt.clientX; // ✅ kein TS-Fehler mehr
    pickerY.value = event.evt.clientY / 2;
    colorPickerOpen.value = true;
  }, 200);
}

function setDefaultColor(id: number, event: KonvaEventObject<MouseEvent>) {
  if (clickTimer) clearTimeout(clickTimer);
  cellColors.value.delete(id);
  cellColors.value = new Map(cellColors.value);
  colorPickerOpen.value = false;
}

function applyColor() {
  if (selectedCellId.value !== null) {
    cellColors.value.set(selectedCellId.value, activeColor.value);
    cellColors.value = new Map(cellColors.value);
  }
  colorPickerOpen.value = false;
}

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
