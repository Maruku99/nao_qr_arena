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
import { useArenaStore } from "@/stores/useArenaStore"
import { useQRCode } from "@vueuse/integrations/useQRCode"
import { computed, ref } from "vue"

const { gridLength, gridWidth, fieldLength, fieldWidth, cellColors } = useArenaStore()
const showQr = ref(false)

function buildByteArray(): Uint8Array {
  const flBytes = new TextEncoder().encode(fieldLength.value)
  const fwBytes = new TextEncoder().encode(fieldWidth.value)
  const cells = Array.from(cellColors.value.entries())

  // Format:
  // [0]      gridLength      uint8
  // [1]      gridWidth       uint8
  // [2]      len(fieldLength) uint8
  // [3..N]   fieldLength     UTF-8
  // [N+1]    len(fieldWidth)  uint8
  // [N+2..M] fieldWidth      UTF-8
  // [M+1]    Anzahl Zellen   uint8
  // [M+2..]  pairs [cellId, colorIdx] je 2 Byte

  const size = 1 + 1 + 1 + flBytes.length + 1 + fwBytes.length + 1 + cells.length * 2
  const buf  = new Uint8Array(size)
  let i = 0

  buf[i++] = gridLength.value
  buf[i++] = gridWidth.value
  buf[i++] = flBytes.length
  buf.set(flBytes, i);  i += flBytes.length
  buf[i++] = fwBytes.length
  buf.set(fwBytes, i);  i += fwBytes.length
  buf[i++] = cells.length
  for (const [cellId, colorIdx] of cells) {
    buf[i++] = cellId
    buf[i++] = colorIdx
  }
  return buf
}

// useQRCode braucht einen String → Base64 ist sauberste Option
// NAO-Seite: import base64; data = base64.b64decode(qr_string)
const qrValues = computed(() => {
  const bytes  = buildByteArray()
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
})

const qrcode = useQRCode(qrValues)
</script>
