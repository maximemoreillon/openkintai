import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const shifts = pgTable("shifts", {
  id: serial().primaryKey(),
  user_id: text().notNull(), // TODO: foreign key
  clockIn: timestamp().notNull().defaultNow(),
  clockOut: timestamp(),
});

export const users = pgTable("users", {
  sub: text().unique().primaryKey(),
  name: text(),
});
