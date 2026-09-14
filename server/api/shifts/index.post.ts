export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const currentTime = new Date();

  return await db
    .insert(schema.shifts)
    .values({
      user_id: user.id,
      clockIn: currentTime,
    })
    .returning();
});
