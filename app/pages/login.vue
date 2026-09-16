<template>
  <v-card title="OpenKintai" max-width="20rem" class="mx-auto my-8">
    <v-card-text>
      <template v-if="loggedIn">
        <p>Logged in as {{ user.name }}!</p>
        <v-btn
          @click="clear"
          text="logout"
          block
          color="primary"
          prepend-icon="mdi-logout"
        />
      </template>
      <template v-else>
        <p>Please login to proceed</p>
        <v-btn
          text="Login"
          href="/auth/oidc"
          color="primary"
          block
          prepend-icon="mdi-login"
        />
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup>
const { loggedIn, clear, user } = useUserSession();
</script>
