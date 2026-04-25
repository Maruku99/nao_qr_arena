<template>
  <v-btn block @click="generateQrCode(), showQr=!showQr">QR-Code generieren</v-btn>
  <div v-if="showQr">
      <img :src="qrcode" alt="QR Code" />
      <!-- <input v-model="qrValues" /> -->
    </div>
</template>

<script setup lang="ts">
import { useArenaStore } from "@/stores/useArenaStore";
import { useQRCode } from "@vueuse/integrations/useQRCode";
import { computed, ref } from "vue";

const { gridLength, gridWidth, fieldLength, fieldWidth, cellColors } = useArenaStore();

const showQr = ref(false)

const qrValues = computed(() =>
  JSON.stringify({
    gridLength: gridLength.value,
    gridWidth: gridWidth.value,
    fieldLength: fieldLength.value,
    fieldWidth: fieldWidth.value,
    // Map kann nicht direkt korrekt in JSON serialisiert werden.
    // Wir wandeln deshalb in ein plain Object mit Zell-ID als Key um.
    cellColors: Object.fromEntries(cellColors.value)
  })
);

const qrcode = useQRCode(qrValues);

function generateQrCode() {
  console.log(gridLength.value);
  console.log(gridWidth.value);
  console.log(fieldLength.value);
  console.log(fieldWidth.value);
}
</script>
