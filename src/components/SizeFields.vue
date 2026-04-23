<template>
  <v-responsive>
    <v-number-input
      :reverse="false"
      controlVariant="split"
      :label="props.label"
      :hideInput="false"
      :inset="false"
      :min="1"
    ></v-number-input>
  </v-responsive>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string;
  }>(),
  {
    label: "label",
  },
);
</script>
