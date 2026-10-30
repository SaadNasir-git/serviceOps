// update-profile.dto.ts
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { createSelectSchema } from 'drizzle-orm/zod';
import { users } from '@repo/database';

const updateProfileSchema = createSelectSchema(users)
  .pick({ name: true, role: true })
  .partial()
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    { message: 'At least one field must be provided' },
  );

export class UpdateProfileDto extends createZodDto(updateProfileSchema) {}
export type UpdateProfile = z.infer<typeof updateProfileSchema>;