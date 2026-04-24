<template>
  <v-stage :config="stageSize">
    <v-layer>
      <v-rect :config="rectConfig" />
    </v-layer>
  </v-stage>
</template>
<script setup lang="ts">
import { Stage as VStage, Layer as VLayer, Rect as VRect } from "vue-konva";

const stageSize = {
  width: 200,
  height: 200,
};

const rectConfig = {
  x: 20,
  y: 50,
  width: 100,
  height: 100,
  fill: "red",
  shadowBlur: 10,
};
</script>
