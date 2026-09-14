<template>
  <v-app>
    <v-app-bar>
      <!-- TODO: maybe not ideal for navigation -->
      <v-app-bar-title>
        <NuxtLink to="/" class="title">OpenKintai</NuxtLink>
      </v-app-bar-title>

      <template #append>
        <v-btn
          v-if="user?.isManager"
          text="Management"
          prepend-icon="mdi-account"
          variant="outlined"
          to="/users"
        />
        <v-btn icon="mdi-logout" v-if="loggedIn" to="login" />
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

<style scoped>
.title {
  text-decoration: none;
  color: inherit;
}
</style>
