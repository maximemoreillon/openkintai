<template>
  <v-data-table :items="items" :headers="headers" class="mt-6">
    <template #top>
      <v-row justify="center" align="center">
        <v-col cols="auto">
          <v-btn
            icon="mdi-chevron-left"
            variant="flat"
            @click="changeMonth(-1)"
          />
        </v-col>
        <v-col cols="auto"> {{ year }}/{{ month }} </v-col>
        <v-col cols="auto">
          <v-btn
            icon="mdi-chevron-right"
            variant="flat"
            @click="changeMonth(1)"
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
  </v-data-table>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();

const year = defineModel<number>("year", { required: true });
const month = defineModel<number>("month", { required: true });

const props = defineProps<{
  items: any[];
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
];

function changeMonth(increment: number) {
  month.value += increment;
  if (month.value < 1) {
    month.value = 12;
    year.value--;
  } else if (month.value > 12) {
    month.value = 1;
    year.value++;
  }
  // Store in URL;
  router.push({
    query: { ...route.query, year: year.value, month: month.value },
  });
}
</script>
