import { createZodDto } from "nestjs-zod";
import z from "zod";

const resetPasswordSchema = z.object({
    password: z.string()
});

export class ResetPasswordDto extends createZodDto(resetPasswordSchema) { }