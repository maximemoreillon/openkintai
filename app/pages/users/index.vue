<template>
  <h2>Users</h2>

  <v-list lines="one">
    <v-list-item
      v-for="item in data?.items"
      :key="item.user_id"
      :title="item.user_id"
      :to="`/users/${item.user_id}`"
    />
  </v-list>
</template>

<script setup lang="ts">
const { data } = await useFetch("/api/users");
</script>
