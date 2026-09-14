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
  <v-snackbar
    :text="snackbar.text"
    v-model="snackbar.show"
    :color="snackbar.color"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  id?: number;
  disabled?: boolean;
}>();
const emit = defineEmits(["registered"]);

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
});

const loading = ref(false);

async function register() {
  loading.value = true;
  try {
    await $fetch(`/api/shifts/${props.id}`, { method: "PUT" });
    snackbar.value.color = "success";
    snackbar.value.text = "Clocked out successfully";
    snackbar.value.show = true;
  } catch (error) {
    snackbar.value.color = "error";
    snackbar.value.text = "Error";
    snackbar.value.show = true;
    console.error(error);
  } finally {
    loading.value = false;
    emit("registered");
  }
}
</script>
