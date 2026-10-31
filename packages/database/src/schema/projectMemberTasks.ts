import { integer, pgEnum, pgTable, text, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { milestoneTasks } from "./milestoneTasks.js";
import { users } from "./users.js";

export const taskStatusEnum = pgEnum("task_status", [
    "pending",
    "in_progress",
    "completed",
]);

export const projectMemberTasks = pgTable("project_member_task", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    milestoneTaskId: uuid("milestone_task_id").notNull().references(() => milestoneTasks.id, { onDelete: "cascade" }).unique(),
    assignedBy: uuid("assigned_by").notNull().references(() => users.id),
    assignedTo: uuid("assigned_to").notNull().references(() => users.id),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    status: taskStatusEnum("status").notNull().default("pending"),
    dueDate: timestamp("due_date", { withTimezone: true, mode: 'string' }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});