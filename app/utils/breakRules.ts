export type BreakRule = { hours: number; minutes: number };

export function parseBreakRules(raw: string | undefined | null): BreakRule[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const parts = pair.split(":");
      return { hours: Number(parts[0]), minutes: Number(parts[1]) };
    })
    .filter((rule) => !Number.isNaN(rule.hours) && !Number.isNaN(rule.minutes))
    .sort((a, b) => a.hours - b.hours);
}

export function breakMinutesForDuration(
  workedMinutes: number,
  rules: BreakRule[],
) {
  const workedHours = workedMinutes / 60;
  let breakMinutes = 0;
  for (const rule of rules) {
    if (workedHours >= rule.hours) breakMinutes = rule.minutes;
  }
  return breakMinutes;
}

export function adjustForBreaks(workedMinutes: number, rules: BreakRule[]) {
  return Math.max(0, workedMinutes - breakMinutesForDuration(workedMinutes, rules));
}

export function totalAdjustedMinutes(
  shifts: { clockIn: string; clockOut: string | null }[],
  rules: BreakRule[],
) {
  return shifts.reduce(
    (sum, shift) =>
      sum + adjustForBreaks(durationMinutes(shift.clockIn, shift.clockOut), rules),
    0,
  );
}
