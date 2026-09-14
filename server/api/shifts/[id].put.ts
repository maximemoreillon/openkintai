import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const { id } = getRouterParams(event);

  const currentTime = new Date();

  const where = and(
    eq(schema.shifts.id, Number(id)),
    eq(schema.shifts.user_id, user.id),
  );

  return await db
    .update(schema.shifts)
    .set({ clockOut: currentTime })
    .where(where)
    .returning();
});
