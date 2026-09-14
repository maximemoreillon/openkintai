import { and, desc, eq, gte, lt } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { year, month } = getQuery(event); // month is 1-indexed

  const now = new Date();
  const startDate = new Date(
    year ? Number(year) : now.getFullYear(),
    month ? Number(month) - 1 : now.getMonth(),
    1,
  );
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

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
