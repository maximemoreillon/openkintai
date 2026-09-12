<template>
  <v-btn text="Clock in" color="green" @click="register" />
</template>

<script setup lang="ts">
const loading = ref(false);

const emit = defineEmits(["registered"]);

async function register() {
  loading.value = true;
  try {
    await $fetch("/api/shifts", { method: "POST" });
  } catch (error) {
    alert(error);
  } finally {
    loading.value = true;
    emit("registered");
  }
}
</script>
