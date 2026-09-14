import { and, eq, gte, lt } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const { year, month } = getQuery(event); // month is 1-indexed

  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing id" });

  const userId = Number(id);

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
    eq(schema.shifts.user_id, userId),
  );

  return await db.select().from(schema.shifts).where(where);
});
