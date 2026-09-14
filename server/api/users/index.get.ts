export default defineEventHandler(async (event) => {
  const rows = await db.select().from(schema.users);

  return {
    items: rows,
  };
});
