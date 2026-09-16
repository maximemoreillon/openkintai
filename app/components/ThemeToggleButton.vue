<template>
  <v-btn
    :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
    variant="text"
    @click="toggle"
  />
</template>

<script setup lang="ts">
import { useTheme } from "vuetify";

const vuetifyTheme = useTheme();
const themeCookie = useCookie<"light" | "dark">("theme", {
  default: () => "dark",
});

const isDark = computed(() => vuetifyTheme.global.name.value === "dark");

function toggle() {
  const next = isDark.value ? "light" : "dark";
  vuetifyTheme.global.name.value = next;
  themeCookie.value = next;
}
</script>
