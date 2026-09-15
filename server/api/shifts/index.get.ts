import { and, desc, eq, gte, lt } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { from, to } = getQuery(event);

  const now = new Date();
  const startDate = from
    ? parseLocalDate(String(from))
    : new Date(now.getFullYear(), now.getMonth(), 1);

  const endDate = to ? parseLocalDate(String(to)) : new Date(now);
  endDate.setDate(endDate.getDate() + 1);

  const where = and(
    gte(schema.shifts.clockIn, startDate),
    lt(schema.shifts.clockIn, endDate),
    eq(schema.shifts.user_id, user.id),
  );

  return await db
    .select()
    .from(schema.shifts)
    .where(where)
    .orderBy(desc(schema.shifts.clockIn));
});
