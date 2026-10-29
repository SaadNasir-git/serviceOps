import z from 'zod';
import { createZodDto } from 'nestjs-zod';

const createUserSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string()
})

export class CreateUserDto extends createZodDto(createUserSchema) { }

export type createUser = z.infer<typeof createUserSchema>;