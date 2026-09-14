import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  if (!id) throw new Error("Missing id");

  const userId = Number(id);

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId));

  const items = await db
    .select()
    .from(schema.shifts)
    .where(eq(schema.shifts.user_id, userId))
    .limit(10);

  return {
    user,
    items,
  };
});
