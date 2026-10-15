import { and, eq, isNull } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = event.context;

  // Managers clocking out on behalf of someone may not be at the office
  if (!user.isManager) await assertClockNetwork(event);

  const { id } = getRouterParams(event);

  const currentTime = new Date();

  // Managers can clock out anyone's open shift, e.g. an employee who forgot
  const where = and(
    eq(schema.shifts.id, Number(id)),
    user.isManager ? undefined : eq(schema.shifts.user_id, user.id),
    isNull(schema.shifts.clockOut),
  );

  const updated = await db
    .update(schema.shifts)
    .set({ clockOut: currentTime })
    .where(where)
    .returning();

  if (updated.length === 0) {
    throw createError({ statusCode: 409, statusMessage: "Shift is not open" });
  }

  return updated;
});
