<template>
  <v-btn
    text="Clock in"
    color="green"
    @click="register"
    :disabled="props.disabled"
    :variant="props.disabled ? 'outlined' : 'elevated'"
    :loading="loading"
  />
  <v-snackbar
    :text="snackbar.text"
    v-model="snackbar.show"
    :color="snackbar.color"
  />
</template>

<script setup lang="ts">
const loading = ref(false);

const props = defineProps<{
  disabled?: boolean;
}>();

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
});

const emit = defineEmits(["registered"]);

async function register() {
  loading.value = true;
  try {
    await $fetch("/api/shifts", { method: "POST" });
    snackbar.value.color = "success";
    snackbar.value.text = "Clocked in successfully";
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
