<template>
  <v-breadcrumbs :items="breadcrumbs" />

  <v-alert
    v-if="error"
    type="error"
    class="mb-4"
    text="Failed to load shift. Please try refreshing the page."
  />

  <template v-if="shift">
    <h2>Shift</h2>
    <p>
      {{ formatTimestamp(shift.clockIn) }} &ndash;
      {{ formatTimestamp(shift.clockOut) }}
    </p>

    <v-textarea v-model="shift.notes" label="Notes" class="mt-4" auto-grow />

    <v-btn text="Save" color="primary" :loading="saving" @click="save" />
  </template>

  <v-snackbar
    :text="snackbar.text"
    v-model="snackbar.show"
    :color="snackbar.color"
  />
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "vuetify/lib/components/VBreadcrumbs/VBreadcrumbs.mjs";

// The shape of a shift as returned over JSON (timestamps arrive as strings,
// not the `Date` Drizzle's own types would suggest).
type Shift = {
  id: number;
  user_id: number;
  clockIn: string;
  clockOut: string | null;
  notes: string | null;
};

const route = useRoute();
const { user: sessionUser } = useUserSession();

// Typed explicitly: `/api/shifts/${id}` also matches `/api/shifts/active.get.ts`
// by pattern, so without a generic the inferred type is a union with that
// route's response shape.
// `deep: true` because the form below edits fields on `shift` in place —
// useFetch's data is a shallowRef by Nuxt's default, which would make
// nested mutations (shift.value.notes = ...) invisible to reactivity.
const [{ data: shift, error }, { data: shiftUser }] = await Promise.all([
  useFetch<Shift>(() => `/api/shifts/${route.params.shiftId}`, {
    deep: true,
  }),
  useFetch(() => `/api/users/${route.params.id}`),
]);

const saving = ref(false);

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const userShiftsPath = `/users/${route.params.id}/shifts`;

  return [
    { title: "Home", to: "/" },
    sessionUser.value?.isManager
      ? { title: "Users", to: "/users" }
      : { title: "Users", disabled: true },
    { title: shiftUser.value?.name || "Unknown user", to: userShiftsPath },
    { title: "Shifts", to: userShiftsPath },
    {
      title: shift.value
        ? formatTimestamp(shift.value.clockIn)
        : String(route.params.shiftId),
      disabled: true,
    },
  ];
});

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
});

async function save() {
  if (!shift.value) return;

  saving.value = true;
  try {
    await $fetch<void>(`/api/shifts/${route.params.shiftId}`, {
      method: "PATCH",
      body: shift.value,
    });
    snackbar.value.color = "success";
    snackbar.value.text = "Saved";
    snackbar.value.show = true;
  } catch (error: any) {
    snackbar.value.color = "error";
    snackbar.value.text = error?.data?.statusMessage || "Error";
    snackbar.value.show = true;
  } finally {
    saving.value = false;
  }
}
</script>
