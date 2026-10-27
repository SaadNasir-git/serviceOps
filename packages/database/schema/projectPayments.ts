import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { milestones } from "./milestones";

export const projectPayments = pgTable("project_payment", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id),
    milestoneId: uuid("milestone_id")
        .notNull()
        .references(() => milestones.id),
    paidAt: timestamp("paid_at", { withTimezone: true }).notNull(),
});
