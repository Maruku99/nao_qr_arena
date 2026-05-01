<template>
  <v-app>
    <v-main>
      <div class="mt-4">
        <h1 class="text-center">Nao Arena QR-Code Generator</h1>
      </div>
      <ArenaGrid />
      <QrButton />
      <v-btn
        class="m-1"
        size="small"
        icon="mdi-theme-light-dark"
        location="top right"
        position="absolute"
        @click="$vuetify.theme.cycle()"
      />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import ArenaGrid from "./components/ArenaGrid.vue";
import QrButton from "./components/QrButton.vue";
</script>
