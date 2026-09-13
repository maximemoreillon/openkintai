export function timeBetweenTimeStamps(ts1: string, ts2: string | null) {
  if (!ts2) return "";
  const startDate: Date = new Date(ts1);
  const endDate: Date = new Date(ts2);

  // Get difference in milliseconds
  const diffMs: number = Math.abs(endDate.getTime() - startDate.getTime());

  // Convert milliseconds to larger units
  // const diffDays: number = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours: number = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const diffMinutes: number = Math.floor((diffMs / (1000 * 60)) % 60);

  return `${diffHours.toString().padStart(2, "0")}:${diffMinutes.toString().padStart(2, "0")}`;
}
