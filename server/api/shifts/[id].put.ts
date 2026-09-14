import { and, eq, isNull } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const { id } = getRouterParams(event);

  const currentTime = new Date();

  const where = and(
    eq(schema.shifts.id, Number(id)),
    eq(schema.shifts.user_id, user.id),
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
