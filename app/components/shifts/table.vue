<template>
  <v-data-table :items="items" :headers="headers" :loading="props.loading">
    <template #top>
      <v-row class="pa-2" align="center">
        <v-col cols="12" sm="auto">
          <v-date-input
            v-model="fromDate"
            label="From"
            density="compact"
            hide-details
            variant="outlined"
            min-width="18ch"
          />
        </v-col>
        <v-col cols="12" sm="auto">
          <v-date-input
            v-model="toDate"
            label="To"
            density="compact"
            hide-details
            variant="outlined"
            min-width="18ch"
          />
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <ShiftsExportButton
            :items="items"
            :from="fromDate"
            :to="toDate"
            :label="exportLabel"
          />
        </v-col>
      </v-row>
    </template>
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
const router = useRouter();
const route = useRoute();

const props = defineProps<{
  items: any[];
  loading?: boolean;
  exportLabel?: string | null;
}>();

const now = new Date();
const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1);

const fromDate = computed({
  get: () =>
    route.query.from ? parseLocalDate(String(route.query.from)) : defaultFrom,
  set: (value: Date) => {
    router.push({ query: { ...route.query, from: toDateInputValue(value) } });
  },
});

const toDate = computed({
  get: () => (route.query.to ? parseLocalDate(String(route.query.to)) : now),
  set: (value: Date) => {
    router.push({ query: { ...route.query, to: toDateInputValue(value) } });
  },
});

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
