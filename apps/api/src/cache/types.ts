export interface CacheRegistry {
    "AUTH:TOKEN": { callBackUrl: string, userId: string },
    "AUTH:SESSION": { userId: string, email: string, resendCount: number, lastSentAt: number },
    "AUTH:OTP": { code: string, userId: string, tries: number },
    "AUTH:RESET": string;
}