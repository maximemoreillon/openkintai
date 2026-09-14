<template>
  <v-btn
    icon="mdi-download"
    variant="flat"
    :disabled="!props.items.length"
    @click="exportCsv"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  items: any[];
  year: number;
  month: number;
  label?: string | null;
}>();

function escapeCsvField(field: string) {
  return `"${field.replace(/"/g, '""')}"`;
}

function exportCsv() {
  const rows = [
    ["Clock in", "Clock out", "Duration"],
    ...props.items.map((item) => [
      formatTimestamp(item.clockIn),
      formatTimestamp(item.clockOut),
      timeBetweenTimeStamps(item.clockIn, item.clockOut),
    ]),
  ];

  const csv = rows.map((row) => row.map(escapeCsvField).join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const monthStr = String(props.month).padStart(2, "0");
  const label = props.label?.trim().toLowerCase().replace(/\s+/g, "-");
  const filenameParts = ["shifts", label, `${props.year}-${monthStr}`].filter(
    Boolean,
  );

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filenameParts.join("-")}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}
</script>
