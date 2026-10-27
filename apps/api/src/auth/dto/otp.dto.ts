import { createZodDto } from "nestjs-zod";
import z from "zod";

const verifyOtpSchema = z.object({
    otp: z.string().length(6)
});

export const VerifyOtpDto = createZodDto(verifyOtpSchema);