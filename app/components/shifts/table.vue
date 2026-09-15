<template>
  <v-toolbar class="px-4">
    <ShiftsDateRangePicker v-model="range" />
    <v-spacer />

    <ShiftsExportButton
      :items="items"
      :from="fromDate"
      :to="toDate"
      :label="exportLabel"
    />
  </v-toolbar>
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
        :to="`/shifts/${item.id}`"
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

const fromDate = computed(() =>
  route.query.from ? parseLocalDate(String(route.query.from)) : defaultFrom,
);

const toDate = computed(() =>
  route.query.to ? parseLocalDate(String(route.query.to)) : now,
);

const range = computed({
  get: (): [Date, Date] => [fromDate.value, toDate.value],
  set: ([from, to]: [Date, Date]) => {
    router.push({
      query: {
        ...route.query,
        from: toDateInputValue(from),
        to: toDateInputValue(to),
      },
    });
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
