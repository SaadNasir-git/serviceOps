import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const technicians = pgTable("technicians", {
    id: uuid("id").primaryKey().defaultRandom(),
    technicianId: uuid("technician_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
    skills: text("skills").array().notNull().default([]),
    properties: text("properties").array().notNull().default([]),
});