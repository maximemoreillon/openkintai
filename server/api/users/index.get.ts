export default defineEventHandler(async (event) => {
  const {
    user: { isManager },
  } = event.context;

  if (!isManager)
    throw createError({
      statusCode: 403,
      statusMessage: "Only managers can do this",
    });

  return await db.select().from(schema.users);
});
