<template>
  <h2>New shift</h2>
  <v-form @submit.prevent="submit">
    <v-row>
      <v-col cols="auto">
        <v-btn text="Clock in" color="green" type="submit"> </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn text="Clock out" color="red" type="submit" variant="outlined">
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
async function submit() {
  await $fetch("/api/records/", { method: "POST" });
}
</script>
