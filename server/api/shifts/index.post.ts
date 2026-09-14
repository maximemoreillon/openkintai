export default defineEventHandler(async (event) => {
  const currentTime = new Date();

  const { user } = await requireUserSession(event);

  return await db
    .insert(schema.shifts)
    .values({
      user_id: user.id,
      clockIn: currentTime,
    })
    .returning();
});
