<template>
  <v-btn text="Clock out" color="red" @click="register" :loading="loading" />
</template>

<script setup lang="ts">
const props = defineProps<{
  id: number;
}>();

const emit = defineEmits(["registered"]);

const loading = ref(false);

async function register() {
  loading.value = true;
  try {
    await $fetch(`/api/shifts/${props.id}`, { method: "PUT" });
  } catch (error) {
    alert(error);
  } finally {
    loading.value = true;
    emit("registered");
  }
}
</script>
