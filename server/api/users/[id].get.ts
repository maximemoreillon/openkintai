import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const {
    user: { isManager },
  } = event.context;

  if (!isManager)
    throw createError({
      statusCode: 403,
      statusMessage: "Only managers can do this",
    });

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
