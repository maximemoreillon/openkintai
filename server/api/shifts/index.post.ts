import { and, eq, isNull } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const [openShift] = await db
    .select()
    .from(schema.shifts)
    .where(and(eq(schema.shifts.user_id, user.id), isNull(schema.shifts.clockOut)));

  if (openShift) {
    throw createError({ statusCode: 409, statusMessage: "Already clocked in" });
  }

  const currentTime = new Date();

  return await db
    .insert(schema.shifts)
    .values({
      user_id: user.id,
      clockIn: currentTime,
    })
    .returning();
});
