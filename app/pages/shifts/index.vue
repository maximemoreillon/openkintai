<template>
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

  <h2>My last 10 shifts</h2>
  <v-data-table v-if="data" :items="data.items" :headers="headers">
    <template v-slot:item.duration="{ item }">
      {{ timeBetweenTimeStamps(item.clockIn, item.clockOut) }}
    </template>

    <template v-slot:item.clockIn="{ item }">
      {{ formatTimestamp(item.clockIn) }}
    </template>

    <template v-slot:item.clockOut="{ item }">
      {{ formatTimestamp(item.clockOut) }}
    </template>
  </v-data-table>
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
