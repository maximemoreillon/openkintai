export async function upsertUser(
  issuer: string,
  { sub, name }: { sub: string; name: string },
) {
  const [user] = await db
    .insert(schema.users)
    .values({ issuer, sub, name })
    .onConflictDoUpdate({
      target: [schema.users.issuer, schema.users.sub],
      set: { name },
    })
    .returning();

  if (!user) throw new Error("Failed to upsert user");

  return user;
}
