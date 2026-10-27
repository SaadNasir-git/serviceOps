import { createZodDto } from "nestjs-zod";
import z from "zod";

export enum LoginStrategy {
    OTP = 'otp',
    URL = 'url',
}

const loginSchema = z.object({
    email: z.email(),
    password: z.string(),
    strategy: z.enum(['otp','url']).default('url'),
    callBackUrl: z.string().startsWith('/').default('/')
})

export const LoginDto = createZodDto(loginSchema);