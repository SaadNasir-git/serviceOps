import { integer, numeric, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { categories } from "./categories.js";

export const projectPriorityEnum = pgEnum("project_priority", [
    "low",
    "medium",
    "high",
    "urgent",
]);

export const projectStatusEnum = pgEnum("project_status", [
    "under_review",
    "accepted",
    "rejected",
    "planning",
    "canceled",
    "in_progress",
    "completed",
]);

export const projects = pgTable("project", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    createdBy: uuid("created_by").notNull().references(() => users.id),
    customerId: uuid("customer_id").notNull().references(() => users.id),
    categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
    description: text("description"),
    priority: projectPriorityEnum("priority").notNull().default("medium"),
    status: projectStatusEnum("status").notNull().default("under_review"),
    budgetAmount: numeric("budget_amount", { precision: 12, scale: 2 }),
    currency: varchar("currency", { length: 3 }).notNull(),
    dueDate: timestamp("due_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});
