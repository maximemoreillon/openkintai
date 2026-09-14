// TODO: infer
type User = { sub: string; name?: string | null; groups?: String[] };

export async function upsertUser(issuer: string, { sub, name, groups }: User) {
  const config = useRuntimeConfig();

  const isAdmin = !!groups?.includes(config.adminGroup);

  const [user] = await db
    .insert(schema.users)
    .values({ issuer, sub, name: name ?? null, isAdmin })
    .onConflictDoUpdate({
      target: [schema.users.issuer, schema.users.sub],
      set: { name: name, isAdmin },
    })
    .returning();

  if (!user) throw new Error("Failed to upsert user");

  return user;
}
