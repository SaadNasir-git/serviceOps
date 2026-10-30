import { projects } from '@repo/database'
import { createInsertSchema } from 'drizzle-orm/zod'
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const projectSchema = createInsertSchema(projects, {
    dueDate: z.iso.datetime()
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    status: true,
    customerId: true
});

export class CreateProjectDto extends createZodDto(projectSchema) {};

export type Project = z.infer<typeof projectSchema>