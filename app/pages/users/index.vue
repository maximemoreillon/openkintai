<template>
  <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

  <h2>Users</h2>

  <v-list lines="one">
    <v-list-item
      v-for="user in data?.items"
      :key="user.id"
      :title="`${user.name || 'Unknown user'} ${user.isAdmin ? '(Admin)' : ''}`"
      :to="`/users/${user.id}/shifts`"
    />
  </v-list>
</template>

<script setup lang="ts">
const breadcrumbs = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Users",
    href: "/users",
    disabled: true,
  },
];

const { data } = await useFetch("/api/users");
</script>
