import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { projectMilestones } from "./projectMilestones.js";

export const projectPayments = pgTable("project_payment", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id),
    projectMilestoneId: uuid("project_milestone_id")
        .notNull()
        .references(() => projectMilestones.id),
    paidAt: timestamp("paid_at", { withTimezone: true }).notNull(),
});