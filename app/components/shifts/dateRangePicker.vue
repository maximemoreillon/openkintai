<template>
  <v-menu :close-on-content-click="false">
    <template v-slot:activator="{ props: menuProps }">
      <v-text-field
        :model-value="dateRangeText"
        label="Date range"
        prepend-inner-icon="mdi-calendar"
        density="compact"
        variant="outlined"
        hide-details
        readonly
        v-bind="menuProps"
        max-width="30ch"
      />
    </template>
    <v-date-range-picker v-model="selection" />
  </v-menu>
</template>

<script setup lang="ts">
const modelValue = defineModel<[Date, Date]>({ required: true });

const dateRangeText = computed(
  () =>
    `${toDateInputValue(modelValue.value[0])} ~ ${toDateInputValue(modelValue.value[1])}`,
);

// v-date-range-picker needs its own local state to reflect an in-progress
// selection (a single clicked date) — a v-model that only ever writes back
// once both dates are picked means the first click has no visible effect,
// since the picker's own display is driven entirely by the model prop.
const selection = ref<Date[]>([...modelValue.value]);

watch(modelValue, (value) => {
  selection.value = [...value];
});

watch(selection, (value) => {
  if (!value?.[0] || !value?.[1]) return;
  modelValue.value = [value[0], value[1]];
});
</script>
