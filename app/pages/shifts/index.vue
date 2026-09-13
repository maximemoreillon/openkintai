<template>
  <h2>Shifts</h2>
  <v-row justify="center">
    <v-col cols="auto">
      <ClockInButton
        @registered="refresh"
        :disabled="!!unfinishedShifts.length"
      />
    </v-col>
    <v-col cols="auto">
      <ClockOutButton
        :id="unfinishedShifts.at(-1)?.id"
        @registered="refresh"
        :disabled="!unfinishedShifts.length"
      />
    </v-col>
  </v-row>

  <h3>Last 10 shifts</h3>
  <v-data-table-server
    v-if="data"
    :items="data.items"
    :headers="headers"
    :items-length="10"
  >
    <template v-slot:item.duration="{ item }">
      {{ timeBetweenTimeStamps(item.clockIn, item.clockOut) }}
    </template>
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
  {
    key: "duration",
    title: "Duration",
  },
];

const unfinishedShifts = computed(() => {
  if (!data.value) return [];
  return data.value.items.filter((s) => !s.clockOut);
});
</script>
