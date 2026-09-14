import { User } from "#auth-utils";

export async function upsertUser({ sub, name }: User) {
  return await db
    .insert(schema.users)
    .values({ sub, name })
    .onConflictDoUpdate({
      target: schema.users.sub,
      set: { name },
    })
    .returning();
}
