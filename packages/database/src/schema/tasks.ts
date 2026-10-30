import { integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { milestones } from "./milestones.js";
import { users } from "./users.js";

export const taskStatusEnum = pgEnum("task_status", [
    "pending",
    "in_progress",
    "completed",
]);

export const tasks = pgTable("task", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    milestoneId: uuid("milestone_id").notNull().references(() => milestones.id, { onDelete: "cascade" }),
    assignedBy: uuid("assigned_by").notNull().references(() => users.id),
    assignedTo: uuid("assigned_to").notNull().references(() => users.id),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    status: taskStatusEnum("status").notNull().default("pending"),
    dueDate: timestamp("due_date", { withTimezone: true, mode: 'string' }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});