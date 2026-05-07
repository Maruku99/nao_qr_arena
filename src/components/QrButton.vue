<template>
  <div
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      padding: 16px;
    "
  >
    <v-btn
      @click="showQr = true"
      style="border: 1px solid rgba(128, 128, 128, 0.3)"
      >QR-Code generieren</v-btn
    >
  </div>

  <v-dialog v-model="showQr" max-width="320">
    <v-card class="d-flex flex-column align-center pa-6">
      <v-card-title class="mb-2">QR-Code</v-card-title>
      <img
        :src="qrcode"
        alt="QR Code"
        class="d-block mx-auto"
        style="width: 100%; max-width: 256px"
      />
      <v-btn class="mt-4" variant="text" @click="showQr = false"
        >Schließen</v-btn
      >
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useArenaStore } from "@/stores/useArenaStore";
import { useQRCode } from "@vueuse/integrations/useQRCode";
import { computed, ref } from "vue";

const {
  gridLength,
  gridWidth,
  fieldLength,
  fieldWidth,
  startId,
  finishId,
  cellColors,
  COLOR_LUT,
} = useArenaStore();

const showQr = ref(false);

function buildByteArray(): Uint8Array {
  const cells: Array<[number, number]> = [];
  for (let id = 0; id < cellColors.value.length; id++) {
    const idx = cellColors.value[id];
    if (idx !== undefined && idx >= 0) {
      cells.push([id, idx]);
    }
  }
  const values = [
    gridLength.value,
    gridWidth.value,
    fieldLength.value,
    fieldWidth.value,
    startId.value,
    finishId.value,
  ];

  const size = values.length + 1 + cells.length * 2; // +1 für cells.length Byte, +2 für cellId + lutIdx
  const buf = new Uint8Array(size);

  // Values schreiben (Index 0 bis values.length-1)
  for (let index = 0; index < values.length; index++) {
    buf[index] = values[index];
  }

  // Anzahl Zellen direkt nach den values
  let i = values.length;
  buf[i++] = cells.length;

  // Zell-Paare (cellId + lutIdx)
  for (const [cellId, lutIdx] of cells) {
    buf[i++] = cellId;
    buf[i++] = lutIdx;
  }

  return buf;
}

// const qrValues = computed(() => {
//   const bytes = buildByteArray();
//   return bytes.toString();
// });

const qrValues = computed(() => {
  const bytes = buildByteArray()
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
})

const qrcode = useQRCode(qrValues);
</script>
