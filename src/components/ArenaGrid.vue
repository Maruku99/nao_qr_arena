<template>
  <v-row class="gap-2 pr-4 pl-4 mt-4">
    <v-col><ArenaSize v-model="gridLength" label="Länge der Arena" /></v-col>
    <v-col><ArenaSize v-model="gridWidth" label="Breite der Arena" /></v-col>
  </v-row>
  <v-row class="gap-2 pr-4 pl-4 mt-4">
    <v-col><ArenaSize v-model="fieldLength" label="Länge eines Feldes" /></v-col>
    <v-col><ArenaSize v-model="fieldWidth" label="Breite eines Feldes" /></v-col>
  </v-row>
  <v-row class="gap-2 pr-4 pl-4 mt-4">
    <v-col><ArenaSize v-model="startId" label="Start id" /></v-col>
    <v-col><ArenaSize v-model="finishId" label="Ziel id" /></v-col>
  </v-row>

  <div class="d-flex justify-center align-center pa-4">
    <ArenaCanvas
      @cell-click="openColorPicker"
      @cell-dblclick="setDefaultColor"
    />
  </div>

  <ColorPickerPopup
    :open="colorPickerOpen"
    :x="pickerX"
    :y="pickerY"
    :active-idx="activeColorIdx"
    @pick="applyColor"
    @close="colorPickerOpen = false"
  />
</template>

<script setup lang="ts">
import { useArenaStore } from "@/stores/useArenaStore";
import { useColorPicker } from "@/composables/useColorPicker";
import ArenaSize from "./NumberInput.vue";
import ArenaCanvas from "./ArenaCanvas.vue";
import ColorPickerPopup from "./ColorPickerPopup.vue";

const { gridLength, gridWidth, fieldLength, fieldWidth, startId, finishId } = useArenaStore();
const { colorPickerOpen, activeColorIdx, pickerX, pickerY, openColorPicker, setDefaultColor, applyColor } = useColorPicker();
</script>
