<template>
  <v-btn
    prepend-icon="mdi-download"
    text="export"
    variant="outlined"
    color="primary"
    :disabled="!props.items.length"
    @click="exportCsv"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  items: any[];
  from: Date;
  to: Date;
  label?: string | null;
  shiftCount: number;
  totalMinutes: number;
  adjustedMinutes: number;
  hasBreakRules: boolean;
}>();

function escapeCsvField(field: string) {
  return `"${field.replace(/"/g, '""')}"`;
}

function exportCsv() {
  const rows = [
    ["Employee", props.label ?? ""],
    ["Period", `${toDateInputValue(props.from)} to ${toDateInputValue(props.to)}`],
    ["Shifts", String(props.shiftCount)],
    ["Total hours", formatDurationMinutes(props.totalMinutes)],
    ...(props.hasBreakRules
      ? [
          [
            "Total hours (adjusted for breaks)",
            formatDurationMinutes(props.adjustedMinutes),
          ],
        ]
      : []),
    [],
    ["Clock in", "Clock out", "Duration", "Notes"],
    ...props.items.map((item) => [
      formatTimestamp(item.clockIn),
      formatTimestamp(item.clockOut),
      timeBetweenTimeStamps(item.clockIn, item.clockOut),
      item.notes ?? "",
    ]),
  ];

  const csv = rows.map((row) => row.map(escapeCsvField).join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const label = props.label?.trim().toLowerCase().replace(/\s+/g, "-");
  const dateRange = `${toDateInputValue(props.from)}_${toDateInputValue(props.to)}`;
  const filenameParts = ["shifts", label, dateRange].filter(Boolean);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filenameParts.join("-")}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}
</script>
