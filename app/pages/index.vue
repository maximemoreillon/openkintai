<template>
  <v-alert
    v-if="error || activeError"
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

  <ShiftsTable v-if="data" :items="data" :loading="pending" />
</template>

<script setup lang="ts">
const route = useRoute();

const { data, refresh, pending, error } = await useFetch("/api/shifts", {
  query: computed(() => route.query),
});

const {
  data: active,
  refresh: refreshActive,
  error: activeError,
} = await useFetch("/api/shifts/active");

function onRegistered() {
  refresh();
  refreshActive();
}
</script>
