export default defineEventHandler(async (event) => {
  const rows = await db
    .select({
      user_id: schema.shifts.user_id,
    })
    .from(schema.shifts)
    .groupBy(schema.shifts.user_id);

  return {
    items: rows,
  };
});
