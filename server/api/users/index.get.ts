export default defineEventHandler(async (event) => {
  return await db.select().from(schema.users);
});
