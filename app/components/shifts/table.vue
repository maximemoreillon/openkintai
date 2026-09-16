<template>
  <v-data-table :items="items" :headers="headers" :loading="props.loading">
    <template v-slot:item.duration="{ item }">
      {{ timeBetweenTimeStamps(item.clockIn, item.clockOut) }}
    </template>

    <template v-slot:item.clockIn="{ item }">
      {{ formatTimestamp(item.clockIn) }}
    </template>

    <template v-slot:item.clockOut="{ item }">
      {{ formatTimestamp(item.clockOut) }}
    </template>

    <template v-slot:item.actions="{ item }">
      <v-btn
        icon="mdi-pencil"
        variant="text"
        size="small"
        :to="`/users/${item.user_id}/shifts/${item.id}`"
      />
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
const props = defineProps<{
  items: any[];
  loading?: boolean;
}>();

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
  {
    key: "notes",
    title: "Notes",
  },
  {
    key: "actions",
    title: "",
    sortable: false,
  },
];
</script>
