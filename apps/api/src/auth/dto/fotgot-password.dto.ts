import { createZodDto } from "nestjs-zod";
import z from "zod";

const forgotPasswordSchema = z.object({
    email: z.email()
});

export class ForgotPasswordDto extends createZodDto(forgotPasswordSchema) { }