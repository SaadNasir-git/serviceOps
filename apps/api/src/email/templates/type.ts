export interface EmailRegistry {
    "url": { email: string; verifyUrl: string, expiresIn?: string };
    "reset": { email: string; forgotPasswordUrl: string, expiresIn?: string };
    "otp": { email: string; code: string, expiresIn?: string };
    "resetWarn": { email: string, expiresIn?: string };
}

export type EmailTemplateRegistry = {
    [K in keyof EmailRegistry]: Omit<EmailRegistry[K], "email"> & { email?: string };
};

export interface EmailMeta {
    url: { title: string; preheader: string };
    reset: { title: string; preheader: string };
    otp: { title: string; preheader: string };
    resetWarn: { title: string; preheader: string };
}