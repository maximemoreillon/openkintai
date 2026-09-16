import {
  pgTable,
  text,
  serial,
  integer,
  timestamp,
  unique,
  uniqueIndex,
  boolean,
} from "drizzle-orm/pg-core";
import { isNull } from "drizzle-orm";

export const shifts = pgTable(
  "shifts",
  {
    id: serial().primaryKey(),
    user_id: integer()
      .notNull()
      .references(() => users.id),
    clockIn: timestamp().notNull().defaultNow(),
    clockOut: timestamp(),
    notes: text(),
  },
  (table) => [
    // Enforces at most one open shift per user, closing the check-then-insert
    // race in server/api/shifts/index.post.ts (two concurrent clock-ins could
    // otherwise both pass the "no open shift" check before either commits).
    uniqueIndex("shifts_one_open_per_user")
      .on(table.user_id)
      .where(isNull(table.clockOut)),
  ],
);

export const users = pgTable(
  "users",
  {
    id: serial().primaryKey(),
    issuer: text().notNull(),
    sub: text().notNull(),
    name: text(),
    isManager: boolean().notNull().default(false),
  },
  (table) => [unique().on(table.issuer, table.sub)],
);
