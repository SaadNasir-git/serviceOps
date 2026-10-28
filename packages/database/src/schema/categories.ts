import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const categories = pgTable("category", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});