<template>
  <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
  <h2>{{ data?.user?.name }}</h2>
  <ShiftsTable v-if="data" :items="data.items" />
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "vuetify/lib/components/VBreadcrumbs/VBreadcrumbs.mjs";

const route = useRoute();

const { data } = await useFetch(`/api/users/${route.params.id}/shifts`, {
  query: computed(() => route.query),
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
