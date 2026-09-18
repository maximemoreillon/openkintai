<template>
  <v-breadcrumbs :items="breadcrumbs" />
  <h2>{{ user?.name || "Unknown user" }}</h2>

  <v-alert
    v-if="userError || shiftsError"
    type="error"
    class="mb-4"
    text="Failed to load data. Please try refreshing the page."
  />

  <template v-if="shifts">
    <v-row class="mb-4" align="center" justify="space-between">
      <!-- Left: date picker -->
      <v-col cols="12" lg="auto">
        <v-row align="center">
          <v-col cols="12" sm="6">
            <v-date-input
              v-model="fromDate"
              label="From"
              density="compact"
              hide-details
              variant="outlined"
              min-width="18ch"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-date-input
              v-model="toDate"
              label="To"
              density="compact"
              hide-details
              variant="outlined"
              min-width="18ch"
            />
          </v-col>
        </v-row>
      </v-col>
      <!-- Right: Summary + Export -->
      <v-col cols="12" lg="auto">
        <v-row align="center" justify="space-between">
          <v-col cols="12" sm="auto" class="text-center">
            {{ shiftCount }} shift{{ shiftCount === 1 ? "" : "s" }} ·
            {{ formatDurationMinutes(totalMinutes) }} total
            <template v-if="hasBreakRules">
              · {{ formatDurationMinutes(adjustedMinutes) }} adjusted
            </template>
          </v-col>
          <v-col cols="12" sm="auto">
            <ShiftsExportButton
              :items="shifts"
              :from="fromDate"
              :to="toDate"
              :label="user?.name"
              :shift-count="shiftCount"
              :total-minutes="totalMinutes"
              :adjusted-minutes="adjustedMinutes"
              :has-break-rules="hasBreakRules"
              block
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-data-table
      :items="shifts"
      :headers="headers"
      :loading="pending"
      items-per-page="-1"
      hide-default-footer
    >
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
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "vuetify/lib/components/VBreadcrumbs/VBreadcrumbs.mjs";

const route = useRoute();
const { user: sessionUser } = useUserSession();

const [
  { data: user, error: userError },
  { data: shifts, pending, error: shiftsError },
] = await Promise.all([
  useFetch(() => `/api/users/${route.params.id}`),
  useFetch(() => `/api/users/${route.params.id}/shifts`, {
    query: computed(() => route.query),
  }),
]);

const now = new Date();
const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1);

const dateTransform = {
  get: (value: string) => parseLocalDate(value),
  set: (value: Date) => toDateInputValue(value),
};

const fromDate = useRouteQuery("from", toDateInputValue(defaultFrom), {
  transform: dateTransform,
});

const toDate = useRouteQuery("to", toDateInputValue(now), {
  transform: dateTransform,
});

const shiftCount = computed(() => shifts.value?.length ?? 0);

const breakRules = parseBreakRules(useRuntimeConfig().public.breakRules);

const totalMinutes = computed(() =>
  (shifts.value ?? []).reduce(
    (sum, shift) => sum + durationMinutes(shift.clockIn, shift.clockOut),
    0,
  ),
);

const adjustedMinutes = computed(() =>
  totalAdjustedMinutes(shifts.value ?? [], breakRules),
);

const hasBreakRules = breakRules.length > 0;

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

const breadcrumbs = computed<BreadcrumbItem[]>(() => [
  { title: "Home", to: "/" },
  sessionUser.value?.isManager
    ? { title: "Users", to: "/users" }
    : { title: "Users", disabled: true },
  { title: user.value?.name || "Unknown user", disabled: true },
]);
</script>
