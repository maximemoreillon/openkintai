<template>
  <v-alert
    v-if="error"
    type="error"
    class="mb-4"
    text="Failed to load shifts. Please try refreshing the page."
  />

  <div class="mx-auto" style="max-width: 20rem">
    <v-row justify="center" class="my-12">
      <v-col cols="6">
        <ShiftsClockInButton
          @registered="refresh"
          :disabled="!!active?.shift"
        />
      </v-col>
      <v-col cols="6">
        <ShiftsClockOutButton
          :id="active?.shift?.id"
          @registered="refresh"
          :disabled="!active?.shift"
        />
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12">
        <v-btn
          prepend-icon="mdi-format-list-bulleted"
          text="Shifts"
          variant="outlined"
          :to="`/users/${user?.id}/shifts`"
          block
        />
      </v-col>
    </v-row>
    <v-row v-if="user?.isManager" justify="center">
      <v-col cols="12">
        <v-btn
          prepend-icon="mdi-account"
          text="Users"
          variant="outlined"
          to="/users"
          block
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const { user } = useUserSession();

const { data: active, refresh, error } = await useFetch("/api/shifts/active");
</script>
