<template>
  <v-btn
    prepend-icon="mdi-stop"
    text="Clock out"
    color="red"
    @click="register"
    :variant="props.disabled ? 'outlined' : 'elevated'"
    :loading="loading"
    :disabled="props.disabled"
    size="x-large"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  id?: number;
  disabled?: boolean;
}>();
const emit = defineEmits(["registered"]);

const { notify } = useSnackbar();

const loading = ref(false);

async function register() {
  loading.value = true;
  try {
    await $fetch(`/api/shifts/${props.id}`, { method: "PUT" });
    notify("Clocked out successfully");
  } catch (error: any) {
    notify(error?.data?.statusMessage || "Error", "error");
    console.error(error);
  } finally {
    loading.value = false;
    emit("registered");
  }
}
</script>
