<template>
  <v-row justify="center">
    <v-col cols="auto">
      <ShiftsClockInButton
        @registered="refresh"
        :disabled="!!unfinishedShifts.length"
      />
    </v-col>
    <v-col cols="auto">
      <ShiftsClockOutButton
        :id="unfinishedShifts.at(-1)?.id"
        @registered="refresh"
        :disabled="!unfinishedShifts.length"
      />
    </v-col>
  </v-row>

  <ShiftsTable v-if="data" :items="data.items" />
</template>

<script setup lang="ts">
const route = useRoute();

const { data, refresh } = await useFetch("/api/shifts", {
  query: computed(() => route.query),
});

const unfinishedShifts = computed(() => {
  if (!data.value) return [];
  return data.value.items.filter((s) => !s.clockOut);
});
</script>
