import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, Number(id)));

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }

  return user;
});
