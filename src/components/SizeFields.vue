<template>
  <v-responsive class="m-4">
    <v-row>
        <v-number-input
        :reverse="false"
        controlVariant="split"
        label="Länge Arena"
        :hideInput="false"
        :inset="false"
        min="1"
        ></v-number-input>
        <v-number-input
        :reverse="false"
        controlVariant="split"
        label="Breite Arena"
        :hideInput="false"
        :inset="false"
        min="1"
        ></v-number-input>
    </v-row>
  </v-responsive>
</template>

<script setup>
import { ref } from 'vue';
const labelText = ref();
</script>
