import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const rows = await db
    .select()
    .from(schema.shifts)
    .where(eq(schema.shifts.user_id, user.sub))
    .limit(10);

  return {
    items: rows,
  };
});
