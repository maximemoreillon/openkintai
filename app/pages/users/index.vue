<template>
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
      :title="`${user.name || 'Unknown user'} ${user.isManager ? '(Manager)' : ''}`"
      :to="`/users/${user.id}/shifts`"
    />
  </v-list>
</template>

<script setup lang="ts">
const { userManagementUrl } = useRuntimeConfig().public;

const { data, error } = await useFetch("/api/users");
</script>
