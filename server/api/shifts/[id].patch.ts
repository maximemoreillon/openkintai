import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { id } = getRouterParams(event);
  const { notes } = await readBody(event);

  const where = user.isManager
    ? eq(schema.shifts.id, Number(id))
    : and(eq(schema.shifts.id, Number(id)), eq(schema.shifts.user_id, user.id));

  const [updated] = await db
    .update(schema.shifts)
    .set({ notes: notes ?? null })
    .where(where)
    .returning();

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: "Shift not found" });
  }

  return updated;
});
