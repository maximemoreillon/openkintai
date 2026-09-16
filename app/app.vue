<template>
  <v-app>
    <v-app-bar>
      <template #title>
        <NuxtLink to="/" class="text-decoration-none" style="color: inherit">
          OpenKintai
        </NuxtLink>
      </template>
      <template #append>
        <ThemeToggleButton />
        <v-btn icon="mdi-logout" v-if="loggedIn" to="/login" />
      </template>
    </v-app-bar>
    <v-main>
      <v-container>
        <NuxtPage />
      </v-container>
    </v-main>
    <v-snackbar
      :text="snackbar.text"
      v-model="snackbar.show"
      :color="snackbar.color"
    />
  </v-app>
</template>
<script setup>
const { loggedIn } = useUserSession();
const { snackbar } = useSnackbar();
</script>
