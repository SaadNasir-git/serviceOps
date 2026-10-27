import { createInsertSchema } from 'drizzle-orm/zod'
import { users } from '@repo/database'
import z from 'zod';
import { createZodDto } from 'nestjs-zod';

const createUserSchema = createInsertSchema(users)
    .omit({ id: true })
    .extend({
        email: z.email()
    })

export class CreateUserDto extends createZodDto(createUserSchema) {}