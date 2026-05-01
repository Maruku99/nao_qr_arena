<template>
  <template v-if="open">
    <div :style="`position:fixed; top:${y}px; left:${x}px; z-index:1000`">
      <v-card class="pa-2">
        <div style="display:grid; grid-template-columns:repeat(5,36px); gap:6px">
          <div
            v-for="c in COLOR_LUT"
            :key="c.idx"
            :title="c.name"
            :style="{
              width:'36px', height:'36px', background:c.hex, borderRadius:'4px', cursor:'pointer',
              border: activeIdx === c.idx ? '3px solid white' : '1px solid rgba(128,128,128,0.4)',
              outline: activeIdx === c.idx ? '2px solid #1976d2' : 'none',
            }"
            @click.stop="emit('pick', c.idx)"
          />
        </div>
      </v-card>
    </div>
    <div style="position:fixed; inset:0; z-index:999" @click="emit('close')" />
  </template>
</template>

<script setup lang="ts">
import { useArenaStore } from "@/stores/useArenaStore";
const { COLOR_LUT } = useArenaStore();

defineProps<{ open: boolean; x: number; y: number; activeIdx: number }>();
const emit = defineEmits<{ pick: [idx: number]; close: [] }>();
</script>
