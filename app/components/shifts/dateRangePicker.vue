<template>
  <v-row>
    <v-col cols="auto">
      <v-date-input
        v-model="fromDate"
        label="From"
        density="compact"
        hide-details
        width="20ch"
      />
    </v-col>
    <v-col cols="auto">
      <v-date-input
        v-model="toDate"
        label="To"
        density="compact"
        hide-details
        width="20ch"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const modelValue = defineModel<[Date, Date]>({ required: true });

const fromDate = computed({
  get: () => modelValue.value[0],
  set: (value: Date) => {
    modelValue.value = [value, modelValue.value[1]];
  },
});

const toDate = computed({
  get: () => modelValue.value[1],
  set: (value: Date) => {
    modelValue.value = [modelValue.value[0], value];
  },
});
</script>
