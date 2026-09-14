export async function upsertUser(
  issuer: string,
  { sub, name }: { sub: string; name?: string | null },
) {
  const [user] = await db
    .insert(schema.users)
    .values({ issuer, sub, name: name ?? null })
    .onConflictDoUpdate({
      target: [schema.users.issuer, schema.users.sub],
      set: { name: name ?? null },
    })
    .returning();

  if (!user) throw new Error("Failed to upsert user");

  return user;
}
