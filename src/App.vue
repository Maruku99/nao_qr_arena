<template>
  <v-app>
    <v-main>
      <HeaderArea/>
      <SizeFields/>
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
</script>
