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

  try {
    return await db
      .insert(schema.shifts)
      .values({
        user_id: user.id,
        clockIn: currentTime,
      })
      .returning();
  } catch (error: any) {
    // Closes the race between the check above and this insert: the
    // shifts_one_open_per_user partial unique index (see schema.ts) rejects
    // a second concurrent clock-in at the DB level.
    if (error?.code === "23505") {
      throw createError({ statusCode: 409, statusMessage: "Already clocked in" });
    }
    throw error;
  }
});
