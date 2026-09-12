export default defineEventHandler(async (event) => {
  const currentTime = new Date();

  const user_id = "dummy";

  return await db
    .insert(schema.records)
    .values({
      user_id,
      time: currentTime,
      action: "clockIn",
    })
    .returning();
});
