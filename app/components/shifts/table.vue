<template>
  <v-data-table :items="items" :headers="headers" class="mt-6">
    <template #top>
      <v-row justify="space-between" align="center">
        <v-col cols="auto" class="d-flex align-center">
          <v-btn
            icon="mdi-chevron-left"
            variant="flat"
            @click="changeMonth(-1)"
          />
          <span class="mx-2">{{ year }}/{{ month }}</span>
          <v-btn
            icon="mdi-chevron-right"
            variant="flat"
            @click="changeMonth(1)"
          />
        </v-col>
        <v-col cols="auto">
          <ShiftsExportButton :items="items" :year="year" :month="month" />
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
  </v-data-table>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();

const props = defineProps<{
  items: any[];
}>();

const now = new Date();
const year = computed(() => Number(route.query.year) || now.getFullYear());
const month = computed(() => Number(route.query.month) || now.getMonth() + 1);

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

function changeMonth(increment: number) {
  let newMonth = month.value + increment;
  let newYear = year.value;

  if (newMonth < 1) {
    newMonth = 12;
    newYear--;
  } else if (newMonth > 12) {
    newMonth = 1;
    newYear++;
  }

  router.push({
    query: { ...route.query, year: newYear, month: newMonth },
  });
}
</script>
