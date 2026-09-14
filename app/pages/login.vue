<template>
  <v-card
    :title="loggedIn ? 'Logout' : 'Login'"
    max-width="20rem"
    class="mx-auto"
  >
    <v-card-text>
      <template v-if="loggedIn">
        <v-row>
          <v-col>
            <v-btn
              @click="clear"
              text="logout"
              block
              color="primary"
              prepend-icon="mdi-logout"
            />
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <v-row v-if="providers?.authentik">
          <v-col>
            <v-btn
              text="Login with Authentik"
              href="/auth/authentik"
              color="primary"
              block
            />
          </v-col>
        </v-row>
        <v-row v-if="providers?.keycloak">
          <v-col>
            <v-btn
              text="Login with Keycloak"
              href="/auth/keycloak"
              color="primary"
              block
            />
          </v-col>
        </v-row>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup>
const { loggedIn, user, clear } = useUserSession();
const { data: providers } = await useFetch("/api/auth/providers");
</script>
