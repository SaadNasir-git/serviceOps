import { boolean, integer, pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { projects } from "./projects.js";
import { users } from "./users.js";

export const projectMembers = pgTable("project_members", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    projectId: uuid("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    assignedBy: uuid("assigned_by")
        .notNull()
        .references(() => users.id),
    leading: boolean("leading").notNull().default(false)
}, (t) => [
    unique("project_members_project_id_user_id_unique").on(t.projectId, t.userId)
]);