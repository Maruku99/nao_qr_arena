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

const { gridLength, gridWidth, fieldLength, fieldWidth, cellColors } =
  useArenaStore();

const showQr = ref(false);

const qrValues = computed(() =>
  JSON.stringify({
    gridLength: gridLength.value,
    gridWidth: gridWidth.value,
    fieldLength: fieldLength.value,
    fieldWidth: fieldWidth.value,
    // Map kann nicht direkt korrekt in JSON serialisiert werden.
    // Wir wandeln deshalb in ein plain Object mit Zell-ID als Key um.
    cellColors: Object.fromEntries(cellColors.value),
  }),
);

const qrcode = useQRCode(qrValues);
</script>
