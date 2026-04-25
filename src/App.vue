<template>
  <v-app>
    <v-main>
      <ArenaHeader />
      <ArenaFieldSize/>
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
import ArenaHeader from "./components/ArenaHeader.vue";
import ArenaGrid from "./components/ArenaGrid.vue";
import ArenaFieldSize from "./components/ArenaFieldSize.vue";
import QrButton from "./components/QrButton.vue";
</script>
