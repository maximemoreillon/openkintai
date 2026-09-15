// Parses a "YYYY-MM-DD" date-only string as a local date rather than UTC
// (the default for `new Date(string)` on date-only ISO strings), so it lines
// up with how clockIn/clockOut are stored and compared (see CLAUDE.md's
// timezone note).
export function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year!, month! - 1, day);
}

export function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
