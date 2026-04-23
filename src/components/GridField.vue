<template>
  <v-item-group multiple>
    <v-container>
      <v-row class="m-auto">
        <v-col v-for="n in 24" :key="n">
          <v-item v-slot="{ isSelected, toggle }">
            <v-card
              :color="isSelected ? 'bg-red-300' : 'bg-blue-300'"
              height="50"
              width="50"
              @click="toggle"
            >
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>
</template>

<script>

</script>
