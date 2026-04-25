<template>
  <v-responsive>
    <v-row class="gap-2 pr-4 pl-4 mt-4">
      <v-col>
        <v-text-field
          v-model="fieldLength"
          hide-details="auto"
          label="Länge eines Feldes in cm"
          clearable
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="fieldWidth"
          hide-details="auto"
          label="Breite eines Feldes in cm"
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
  </v-responsive>
</template>

<script setup lang="ts">
import { useArenaStore } from "@/stores/useArenaStore";

const { fieldLength, fieldWidth } = useArenaStore();

</script>
