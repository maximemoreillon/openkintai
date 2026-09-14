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

  <ShiftsTable
    v-if="data"
    :items="data.items"
    v-model:month="month"
    v-model:year="year"
  />
</template>

<script setup lang="ts">
const route = useRoute();

const year = ref(Number(route.query.year) || new Date().getFullYear());
const month = ref(Number(route.query.month) || new Date().getMonth() + 1);

const { data, refresh } = await useFetch("/api/shifts", {
  query: { year, month },
});

const unfinishedShifts = computed(() => {
  if (!data.value) return [];
  return data.value.items.filter((s) => !s.clockOut);
});
</script>
