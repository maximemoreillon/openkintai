<template>
  <h2>Shifts</h2>
  <template v-if="unfinishedShifts.length">
    <ClockOutButton :id="unfinishedShifts.at(-1)!.id" @registered="refresh" />
  </template>
  <template v-else>
    <ClockInButton @registered="refresh" />
  </template>
  <h3>My last 10 shifts</h3>
  <v-data-table-server
    v-if="data"
    :items="data.items"
    :headers="headers"
    :items-length="10"
  >
  </v-data-table-server>
</template>

<script setup lang="ts">
import ClockInButton from "~/components/shifts/clockInButton.vue";
import ClockOutButton from "~/components/shifts/clockOutButton.vue";

const { data, refresh } = await useFetch("/api/shifts");

const headers = [
  {
    key: "clockIn",
    title: "Clock in ",
  },
  {
    key: "clockOut",
    title: "Clock out ",
  },
];

const unfinishedShifts = computed(() => {
  if (!data.value) return [];
  return data.value.items.filter((s) => !s.clockOut);
});
</script>
