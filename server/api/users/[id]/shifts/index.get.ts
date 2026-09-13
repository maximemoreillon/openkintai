import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  if (!id) throw new Error("Missing id");

  const rows = await db
    .select()
    .from(schema.shifts)
    .where(eq(schema.shifts.user_id, id))
    .limit(10);

  return {
    items: rows,
  };
});
