<template>
  <v-breadcrumbs :items="breadcrumbs" />
  <h2>Users</h2>

  <v-btn
    v-if="userManagementUrl"
    :href="userManagementUrl"
    target="_blank"
    rel="noopener noreferrer"
    text="Manage users"
    prepend-icon="mdi-open-in-new"
    variant="outlined"
    class="mb-4"
  />

  <v-alert
    v-if="error"
    type="error"
    class="mb-4"
    text="Failed to load users. Please try refreshing the page."
  />

  <v-list lines="one">
    <v-list-item
      v-for="user in data"
      :key="user.id"
      :title="user.name || 'Unknown user'"
      :to="`/users/${user.id}/shifts`"
    >
      <template #append v-if="user.isManager">
        <v-chip text="Manager" color="primary" />
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "vuetify/lib/components/VBreadcrumbs/VBreadcrumbs.mjs";

const { userManagementUrl } = useRuntimeConfig().public;

const { data, error } = await useFetch("/api/users");

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Home", to: "/" },
  { title: "Users", disabled: true },
];
</script>
