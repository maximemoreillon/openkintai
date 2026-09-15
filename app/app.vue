<template>
  <v-app>
    <v-app-bar>
      <template #title>
        <NuxtLink to="/" class="text-decoration-none" style="color: inherit">
          OpenKintai
        </NuxtLink>
      </template>
      <template #append>
        <v-btn
          v-if="user?.isManager"
          text="Users"
          prepend-icon="mdi-account"
          variant="outlined"
          to="/users"
        />
        <v-btn icon="mdi-logout" v-if="loggedIn" to="/login" />
      </template>
    </v-app-bar>
    <v-main>
      <v-container>
        <NuxtPage />
      </v-container>
    </v-main>
  </v-app>
</template>
<script setup>
const { loggedIn, user } = useUserSession();
</script>
