export default defineEventHandler(async (event) => {
  const currentTime = new Date();

  const user_id = "dummy";

  return await db
    .insert(schema.shifts)
    .values({
      user_id,
      clockIn: currentTime,
    })
    .returning();
});
