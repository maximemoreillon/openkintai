<template>
  <v-alert
    v-if="activeError"
    type="error"
    class="mb-4"
    text="Failed to load shifts. Please try refreshing the page."
  />

  <v-row justify="center" class="my-4">
    <v-col cols="auto">
      <ShiftsClockInButton
        @registered="onRegistered"
        :disabled="!!active?.shift"
      />
    </v-col>
    <v-col cols="auto">
      <ShiftsClockOutButton
        :id="active?.shift?.id"
        @registered="onRegistered"
        :disabled="!active?.shift"
      />
    </v-col>
  </v-row>

  <v-row justify="center">
    <v-col cols="auto">
      <v-btn
        prepend-icon="mdi-format-list-bulleted"
        text="My shifts"
        variant="outlined"
        color="primary"
        :to="`/users/${user?.id}/shifts`"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const { user } = useUserSession();

const {
  data: active,
  refresh: refreshActive,
  error: activeError,
} = await useFetch("/api/shifts/active");

function onRegistered() {
  refreshActive();
}
</script>
