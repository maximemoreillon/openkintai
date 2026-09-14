<template>
  <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
  <h2>{{ data?.user?.name }}</h2>
  <ShiftsTable
    v-if="data"
    :items="data.items"
    v-model:month="month"
    v-model:year="year"
  />
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "vuetify/lib/components/VBreadcrumbs/VBreadcrumbs.mjs";

const route = useRoute();

const year = ref(Number(route.query.year) || new Date().getFullYear());
const month = ref(Number(route.query.month) || new Date().getMonth() + 1);

const { data } = await useFetch(`/api/users/${route.params.id}/shifts`, {
  query: { year, month },
});

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Users",
    href: "/users",
  },
  {
    title: data.value?.user?.name || "Unknown user",
    disabled: true,
    href: "#",
  },
];
</script>
