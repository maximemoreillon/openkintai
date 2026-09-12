export default defineEventHandler(async (event) => {
  const user_id = "dummy";

  const rows = await db.select().from(schema.shifts).limit(10);

  return {
    items: rows,
  };
});
