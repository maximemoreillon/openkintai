import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { id } = getRouterParams(event);

  const where = user.isManager
    ? eq(schema.shifts.id, Number(id))
    : and(eq(schema.shifts.id, Number(id)), eq(schema.shifts.user_id, user.id));

  const [shift] = await db.select().from(schema.shifts).where(where);

  if (!shift) {
    throw createError({ statusCode: 404, statusMessage: "Shift not found" });
  }

  return shift;
});
