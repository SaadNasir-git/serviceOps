import { createZodDto } from "nestjs-zod";
import z from "zod";

const verifyOtpSchema = z.object({
    otp: z.string().length(6)
});

export class VerifyOtpDto extends createZodDto(verifyOtpSchema) {}