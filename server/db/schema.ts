import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

// Idea 1: 2 record per shift
export const records = pgTable("records", {
  id: serial().primaryKey(),
  user_id: text().notNull(),
  time: timestamp().notNull().defaultNow(),
  action: text().notNull(),
});

// Idea 2: 1 record per shift
export const shifts = pgTable("shifts", {
  id: serial().primaryKey(),
  user_id: text().notNull(),
  clockIn: timestamp().notNull().defaultNow(),
  clockOut: timestamp(),
});
