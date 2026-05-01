<template>
  <div style="width:400px; height:400px; overflow:auto; border:1px solid rgba(128,128,128,0.3);
              margin:16px auto; background-color:gray;">
    <div
      class="gap-2 pa-4"
      :style="`display:grid; grid-template-columns:repeat(${gridWidth},${stageSize.width}px); width:fit-content;`"
    >
      <v-stage
        v-for="cell in rectsCanvas"
        :key="cell.id"
        :config="cell.stage"
        @click="emit('cellClick', cell.id, $event)"
        @tap="emit('cellClick', cell.id, $event)"
        @dblclick="emit('cellDblclick', cell.id, $event)"
        @dbltap="emit('cellDblclick', cell.id, $event)"
      >
        <v-layer>
          <v-rect :config="cell.rect" />
          <v-text :config="cell.label" />
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Stage as VStage, Layer as VLayer, Rect as VRect, Text as VText } from "vue-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useArenaStore } from "@/stores/useArenaStore";

const { gridLength, gridWidth, cellColors, COLOR_LUT } = useArenaStore();

const stageSize = { width: 50, height: 50 };

const emit = defineEmits<{
  cellClick: [id: number, event: KonvaEventObject<MouseEvent | TouchEvent | PointerEvent>];
  cellDblclick: [id: number, event: KonvaEventObject<MouseEvent | TouchEvent | PointerEvent>];
}>();

const rectsCanvas = computed(() =>
  Array.from({ length: gridWidth.value * gridLength.value }, (_, index) => {
    const fillColor = COLOR_LUT[cellColors.value.get(index) ?? -1]?.hex ?? "#cccccc";
    return {
      id: index,
      stage: { width: stageSize.width, height: stageSize.height },
      rect: { x: 0, y: 0, width: stageSize.width, height: stageSize.height, fill: fillColor, shadowBlur: 10 },
      label: {
        x: 0, y: 0, width: stageSize.width, height: stageSize.height,
        text: String(index), align: "center", verticalAlign: "middle",
        fontSize: 12, fontStyle: "bold", fill: "#000000", listening: false,
      },
    };
  })
);
</script>
