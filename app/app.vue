<template>
  <v-app>
    <v-app-bar title="OpenKintai">
      <template #append>
        <v-btn
          v-if="user?.isManager"
          :text="inManagement ? 'Clock in/out' : 'Management'"
          :prepend-icon="inManagement ? 'mdi-clock-outline' : 'mdi-account'"
          variant="outlined"
          :to="inManagement ? '/' : '/users'"
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

const route = useRoute();
const inManagement = computed(() => route.path.startsWith("/users"));
</script>
