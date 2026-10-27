import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const projectMilestoneStatusEnum = pgEnum(
    "project_milestone_status",
    ["draft", "pending_admin", "pending_customer", "approved", "rejected"],
);

export const projectMilestones = pgTable("project_milestone", {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
    status: projectMilestoneStatusEnum("status").notNull().default("draft"),
    customerReason: text("customer_reason"),
    adminReason: text("admin_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});