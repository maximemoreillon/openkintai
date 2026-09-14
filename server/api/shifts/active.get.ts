import { and, eq, isNull } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const [shift] = await db
    .select()
    .from(schema.shifts)
    .where(and(eq(schema.shifts.user_id, user.id), isNull(schema.shifts.clockOut)));

  return { shift: shift ?? null };
});
