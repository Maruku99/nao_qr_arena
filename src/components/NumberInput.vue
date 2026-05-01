<template>
  <v-responsive>
    <v-number-input
      v-model="input"
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
import { ref, watch} from 'vue';

const emit = defineEmits<{ (e: 'update:modelValue', value: number): void }>()

const input = ref(1)

watch(input, (newValue) => {
  emit('update:modelValue', newValue)
})

const props = withDefaults(
  defineProps<{
    label: string;
  }>(),
  {
    label: "label",
  },
);
</script>
