<template>
  <h2>Login</h2>
  <div v-if="loggedIn">
    <p>Logged in as {{ user.sub }}</p>

    <v-btn @click="clear" text="logout" />
  </div>
  <div v-else>
    <v-btn text="Login with Authentik" href="/auth/authentik"> </v-btn>
  </div>
</template>

<script setup>
const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession();
</script>
