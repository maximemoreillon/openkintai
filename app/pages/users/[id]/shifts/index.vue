<template>
  <h2>{{ data?.user?.name }}</h2>
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
const route = useRoute();

const { data } = await useFetch(`/api/users/${route.params.id}/shifts`);

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
</script>
