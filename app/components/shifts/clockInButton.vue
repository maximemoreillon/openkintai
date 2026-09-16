<template>
  <v-btn
    prepend-icon="mdi-play"
    text="Clock in"
    color="primary"
    @click="register"
    :disabled="props.disabled"
    :variant="props.disabled ? 'outlined' : 'elevated'"
    :loading="loading"
    size="x-large"
  />
</template>

<script setup lang="ts">
const loading = ref(false);

const props = defineProps<{
  disabled?: boolean;
}>();

const emit = defineEmits(["registered"]);

const { notify } = useSnackbar();

async function register() {
  loading.value = true;
  try {
    await $fetch("/api/shifts", { method: "POST" });
    notify("Clocked in successfully");
  } catch (error: any) {
    notify(error?.data?.statusMessage || "Error", "error");
    console.error(error);
  } finally {
    loading.value = false;
    emit("registered");
  }
}
</script>
