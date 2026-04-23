<template>
  <v-item-group multiple>
    <v-item v-slot="{ isSelected, toggle }">
      <v-card
        :color="isSelected ? 'bg-red-300' : 'bg-blue-300'"
        height="50"
        width="50"
        @click="toggle"
      >
      </v-card>
    </v-item>
  </v-item-group>
</template>

<script setup lang="ts"></script>
