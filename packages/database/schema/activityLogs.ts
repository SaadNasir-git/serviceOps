import { jsonb, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const activityActionEnum = pgEnum("activity_action", [
    "USER_UPDATED",
    "USER_DELETED",
    "WORK_CREATED",
    "WORK_UPDATED",
    "WORK_DELETED",
]);

export const activityLogs = pgTable("activity_log", {
    id: uuid("id").primaryKey().defaultRandom(),
    actorId: uuid("actor_id")
        .notNull()
        .references(() => users.id),
    action: activityActionEnum("action").notNull(),
    changes: jsonb("changes").$type<Record<string, { from: string; to: string }>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});