<template>
  <v-row class="gap-2 pr-4 pl-4 mt-4">
    <v-col>
      <ArenaSize v-model="gridLength" label="Länge der Arena" />
    </v-col>
    <v-col> <ArenaSize v-model="gridWidth" label="Breiter der Arena" /> </v-col>
  </v-row>
  <v-row class="gap-2 pr-4 pl-4 mt-4">
    <v-col>
      <ArenaSize v-model="fieldLength" label="Länge eines Feldes" />
    </v-col>
    <v-col>
      <ArenaSize v-model="fieldWidth" label="Breiter eines Feldes" />
    </v-col>
  </v-row>
  <v-row class="gap-2 pr-4 pl-4 mt-4">
    <v-col>
      <ArenaSize v-model="startId" label="Start id" />
    </v-col>
    <v-col>
      <ArenaSize v-model="finishId" label="Ziel id" />
    </v-col>
  </v-row>
  <div class="d-flex justify-center align-center pa-4">
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
      <div
        class="gap-2 pa-4"
        :style="`
          display: grid;
          grid-template-columns: repeat(${gridWidth}, ${stageSize.width}px);
          width: fit-content;
        `"
      >
        <v-stage
          v-for="rectCanvas in rectsCanvas"
          :key="rectCanvas.id"
          :config="rectCanvas.stage"
          @click="openColorPicker(rectCanvas.id, $event)"
          @tap="openColorPicker(rectCanvas.id, $event)"
          @dblclick="setDefaultColor(rectCanvas.id, $event)"
          @dbltap="setDefaultColor(rectCanvas.id, $event)"
        >
          <v-layer>
            <v-rect :config="rectCanvas.rect" />
            <v-text :config="rectCanvas.label" />
          </v-layer>
        </v-stage>
      </div>
    </div>
  </div>

  <!-- Das div mit position:fixed bleibt exakt gleich wie vorher -->
  <div
    v-if="colorPickerOpen"
    :style="`position: fixed; top: ${pickerY}px; left: ${pickerX}px; z-index: 1000`"
  >
    <!-- Nur das hier ersetzt den v-color-picker -->
    <v-card class="pa-2">
      <div
        style="display: grid; grid-template-columns: repeat(5, 36px); gap: 6px"
      >
        <div
          v-for="c in COLOR_LUT"
          :key="c.idx"
          :title="c.name"
          :style="{
            width: '36px',
            height: '36px',
            background: c.hex,
            border:
              activeColorIdx === c.idx
                ? '3px solid white'
                : '1px solid rgba(128,128,128,0.4)',
            borderRadius: '4px',
            cursor: 'pointer',
            outline: activeColorIdx === c.idx ? '2px solid #1976d2' : 'none',
          }"
          @click.stop="applyColor(c.idx)"
        />
      </div>
    </v-card>
  </div>

  <!-- Overlay bleibt auch exakt gleich -->
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
import {
  Stage as VStage,
  Layer as VLayer,
  Rect as VRect,
  Text as VText,
} from "vue-konva";
import { useArenaStore } from "@/stores/useArenaStore";
import ArenaSize from "./NumberInput.vue";

const stageSize = {
  width: 50,
  height: 50,
};

const { gridLength, gridWidth, cellColors, fieldLength, fieldWidth, startId, finishId, COLOR_LUT } = useArenaStore();

const colorPickerOpen = ref(false);
const activeColorIdx = ref<number>(0);

const pickerX = ref(0);
const pickerY = ref(0);

const PICKER_MARGIN = 8;
const PICKER_WIDTH = 320;
const PICKER_HEIGHT = 420;

const selectedCellId = ref<number | null>(null);

let clickTimer: ReturnType<typeof setTimeout> | null = null;

function clearClickTimer() {
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;
  }
}

function getEventClientPosition(event: MouseEvent | TouchEvent | PointerEvent) {
  if ("clientX" in event && "clientY" in event) {
    return { x: event.clientX, y: event.clientY };
  }

  const touchPoint = event.touches?.[0] ?? event.changedTouches?.[0];
  if (touchPoint) {
    return { x: touchPoint.clientX, y: touchPoint.clientY };
  }

  return { x: 0, y: 0 };
}

function clampPickerPosition(x: number, y: number) {
  const maxX = Math.max(
    PICKER_MARGIN,
    window.innerWidth - PICKER_WIDTH - PICKER_MARGIN,
  );
  const maxY = Math.max(
    PICKER_MARGIN,
    window.innerHeight - PICKER_HEIGHT - PICKER_MARGIN,
  );

  return {
    x: Math.min(Math.max(x, PICKER_MARGIN), maxX),
    y: Math.min(Math.max(y, PICKER_MARGIN), maxY),
  };
}

function openColorPicker(
  id: number,
  event: KonvaEventObject<MouseEvent | TouchEvent | PointerEvent>,
) {
  clearClickTimer();

  const position = getEventClientPosition(event.evt);

  clickTimer = setTimeout(() => {
    selectedCellId.value = id;

    activeColorIdx.value = cellColors.value.get(id) ?? 0;

    const clampedPosition = clampPickerPosition(position.x, position.y);
    pickerX.value = clampedPosition.x;
    pickerY.value = clampedPosition.y;
    colorPickerOpen.value = true;
  }, 250);
}

function setDefaultColor(
  id: number,
  event: KonvaEventObject<MouseEvent | TouchEvent | PointerEvent>,
) {
  clearClickTimer();
  cellColors.value.delete(id);
  cellColors.value = new Map(cellColors.value); // Reaktivität triggern
  colorPickerOpen.value = false;
}

function applyColor(idx: number) {
  if (selectedCellId.value !== null) {
    cellColors.value.set(selectedCellId.value, idx);
    cellColors.value = new Map(cellColors.value);
  }
  colorPickerOpen.value = false;
}

const rectsCanvas = computed(() =>
  Array.from({ length: gridWidth.value * gridLength.value }, (_, index) => {
    const fillColor =
      COLOR_LUT[cellColors.value.get(index) ?? -1]?.hex ?? "#cccccc";

    return {
      id: index,
      stage: { width: stageSize.width, height: stageSize.height },
      rect: {
        x: 0,
        y: 0,
        width: stageSize.width,
        height: stageSize.height,
        fill: fillColor,
        shadowBlur: 10,
      },
      label: {
        x: 0,
        y: 0,
        width: stageSize.width,
        height: stageSize.height,
        text: String(index),
        align: "center",
        verticalAlign: "middle",
        fontSize: 12,
        fontStyle: "bold",
        fill: "#000000",
        listening: false,
      },
    };
  }),
);
</script>
