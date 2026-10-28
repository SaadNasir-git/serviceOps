import { integer, numeric, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { projectMilestones } from "./projectMilestones.js";

export const milestoneStatusEnum = pgEnum("milestone_status", [
    "pending",
    "in_progress",
    "completed",
]);

export const milestones = pgTable("milestones", {
    id: uuid("id").primaryKey().defaultRandom(),
    projectMilestoneId: uuid("project_milestone_id")
        .notNull()
        .references(() => projectMilestones.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    status: milestoneStatusEnum("status").notNull().default("pending"),
    sequence: integer("sequence").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
});