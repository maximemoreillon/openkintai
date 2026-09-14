<template>
  <h2>Home</h2>
  <v-row>
    <v-col cols="auto">
      <v-btn text="Register new shift" to="/shifts" color="primary" />
    </v-col>

    <v-col cols="auto" v-if="user?.isAdmin">
      <v-btn color="primary" text="Users" to="/users" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const { user } = useUserSession();
</script>
