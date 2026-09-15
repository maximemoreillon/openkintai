<template>
  <v-btn
    prepend-icon="mdi-arrow-left"
    text="Return"
    variant="text"
    @click="goBack(router, '/')"
  />

  <v-row justify="space-between" align="center">
    <h2>Users</h2>
    <v-col cols="auto"> </v-col>
    <v-col cols="auto" v-if="userManagementUrl">
      <v-btn
        :href="userManagementUrl"
        target="_blank"
        rel="noopener noreferrer"
        text="Manage users"
        prepend-icon="mdi-open-in-new"
        variant="outlined"
      />
    </v-col>
  </v-row>

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
const router = useRouter();
const { userManagementUrl } = useRuntimeConfig().public;

const { data, error } = await useFetch("/api/users");
</script>
