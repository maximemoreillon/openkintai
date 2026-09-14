<template>
  <v-breadcrumbs :items="breadcrumbs" />
  <h2>{{ user?.name }}</h2>

  <v-alert
    v-if="userError || shiftsError"
    type="error"
    class="mb-4"
    text="Failed to load data. Please try refreshing the page."
  />

  <ShiftsTable
    v-if="shifts"
    :items="shifts"
    :loading="pending"
    :export-label="user?.name"
  />
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "vuetify/lib/components/VBreadcrumbs/VBreadcrumbs.mjs";

const route = useRoute();

const [
  { data: user, error: userError },
  { data: shifts, pending, error: shiftsError },
] = await Promise.all([
  useFetch(`/api/users/${route.params.id}`),
  useFetch(`/api/users/${route.params.id}/shifts`, {
    query: computed(() => route.query),
  }),
]);

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Users",
    to: "/users",
  },
  {
    title: user.value?.name || "Unknown user",
    disabled: true,
  },
];
</script>
