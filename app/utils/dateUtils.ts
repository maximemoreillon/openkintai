export function durationMinutes(ts1: string, ts2: string | null) {
  if (!ts2) return 0;
  const startDate: Date = new Date(ts1);
  const endDate: Date = new Date(ts2);
  return Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60);
}

export function formatDurationMinutes(totalMinutes: number) {
  const hours: number = Math.floor(totalMinutes / 60);
  const minutes: number = Math.floor(totalMinutes % 60);
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export function timeBetweenTimeStamps(ts1: string, ts2: string | null) {
  if (!ts2) return "";
  return formatDurationMinutes(durationMinutes(ts1, ts2));
}

export function formatTimestamp(ts: string | null) {
  if (!ts) return "";
  const { locale } = useRuntimeConfig().public;
  return new Date(ts).toLocaleString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
