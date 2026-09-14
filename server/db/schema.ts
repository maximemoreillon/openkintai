import {
  pgTable,
  text,
  serial,
  integer,
  timestamp,
  unique,
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
  },
  (table) => [unique().on(table.issuer, table.sub)],
);
