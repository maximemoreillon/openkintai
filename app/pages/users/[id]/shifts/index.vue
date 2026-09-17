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
    <v-row class="mb-4" align="center">
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
          :items="shifts"
          :from="fromDate"
          :to="toDate"
          :label="user?.name"
        />
      </v-col>
    </v-row>

    <ShiftsTable :items="shifts" :loading="pending" />
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

const breadcrumbs = computed<BreadcrumbItem[]>(() => [
  { title: "Home", to: "/" },
  sessionUser.value?.isManager
    ? { title: "Users", to: "/users" }
    : { title: "Users", disabled: true },
  { title: user.value?.name || "Unknown user", disabled: true },
]);
</script>
