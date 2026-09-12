import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);

  const user_id = "dummy";
  const currentTime = new Date();

  return await db
    .update(schema.shifts)
    .set({ clockOut: currentTime })
    .where(eq(schema.shifts.id, Number(id)))
    .returning();
});
