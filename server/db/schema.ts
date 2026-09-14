import {
  pgTable,
  text,
  serial,
  integer,
  timestamp,
  unique,
  boolean,
} from "drizzle-orm/pg-core";

export const shifts = pgTable("shifts", {
  id: serial().primaryKey(),
  user_id: integer()
    .notNull()
    .references(() => users.id),
  clockIn: timestamp().notNull().defaultNow(),
  clockOut: timestamp(),
});

export const users = pgTable(
  "users",
  {
    id: serial().primaryKey(),
    issuer: text().notNull(),
    sub: text().notNull(),
    name: text(),
    isAdmin: boolean().notNull().default(false),
  },
  (table) => [unique().on(table.issuer, table.sub)],
);
