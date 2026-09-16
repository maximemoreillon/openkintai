export function timeBetweenTimeStamps(ts1: string, ts2: string | null) {
  if (!ts2) return "";
  const startDate: Date = new Date(ts1);
  const endDate: Date = new Date(ts2);

  // Get difference in milliseconds
  const diffMs: number = Math.abs(endDate.getTime() - startDate.getTime());

  const diffHours: number = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes: number = Math.floor((diffMs / (1000 * 60)) % 60);

  return `${diffHours.toString().padStart(2, "0")}:${diffMinutes.toString().padStart(2, "0")}`;
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
