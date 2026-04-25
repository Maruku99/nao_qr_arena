<template>
  <v-app>
    <v-main>
      <HeaderArea />
      <v-row class="gap-2 pr-4 pl-4 mt-4">
        <v-col>
          <SizeFields label="Länge eines Feldes" />
        </v-col>
        <v-col>
          <SizeFields label="Breite eines Feldes" />
        </v-col>
      </v-row>
      <ArenaGrid/>
      <v-btn
        class="m-2"
        icon="mdi-theme-light-dark"
        location="top right"
        position="absolute"
        @click="$vuetify.theme.cycle()"
      />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import HeaderArea from "@/components/HeaderArea.vue";
import SizeFields from "./components/SizeFields.vue";
import ArenaGrid from "./components/ArenaGrid.vue";
</script>
