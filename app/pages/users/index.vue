<template>
  <h2>Users</h2>

  <v-list lines="one">
    <v-list-item
      v-for="user in data?.items"
      :key="user.sub"
      :title="user.name || 'Unknown user'"
      :to="`/users/${user.sub}`"
    />
  </v-list>
</template>

<script setup lang="ts">
const { data } = await useFetch("/api/users");
</script>
