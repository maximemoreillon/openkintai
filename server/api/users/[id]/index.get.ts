import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const user_id = "dummy";

  const rows = await db
    .select()
    .from(schema.shifts)
    .where(eq(schema.shifts.user_id, user_id))
    .limit(10);

  return {
    items: rows,
  };
});
