import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { Resend } from 'resend';
import { render } from '@react-email/components';
import { Email } from '../templates/index.js';
import { EmailMeta, EmailRegistry } from '../templates/type.js';

type AuthJobName = keyof EmailRegistry;

export const EMAIL_META: EmailMeta = {
    url: { title: "Verify your email", preheader: "Confirm your address to get started" },
    reset: { title: "Reset your password", preheader: "Link expires in 15 minutes" },
    otp: { title: "Your login code", preheader: "Do not share this code with anyone" },
    resetWarn: { title: "Password changed", preheader: "If this wasn't you, secure your account now" },
};

@Processor('auth-email-queue', { concurrency: 25 })
export class AuthEmailProcessor extends WorkerHost {
    constructor(@Inject('RESEND_CLIENT') private readonly resend: Resend) {
        super();
    }

    async process(job: Job<EmailRegistry[AuthJobName], any, AuthJobName>): Promise<void> {
        console.log(job.name ?? 'null')
        switch (job.name) {
            case 'reset':
                return this.sendReset(job.data as EmailRegistry['reset']);
            case 'url':
                return this.sendUrl(job.data as EmailRegistry['url']);
            case 'otp':
                return this.sendOtp(job.data as EmailRegistry['otp']);
            case 'resetWarn':
                return this.sendResetWarn(job.data as EmailRegistry['resetWarn']);
        }
    }

    private async sendReset(data: EmailRegistry['reset']) {
        const meta = EMAIL_META['reset'];
        const html = await render(Email({ key: 'reset', data, ...meta }));
        await this.send(data.email, meta.title, html);
    }

    private async sendUrl(data: EmailRegistry['url']) {
        const meta = EMAIL_META['url'];
        const html = await render(Email({ key: 'url', data, ...meta }));
        await this.send(data.email, meta.title, html);
    }

    private async sendOtp(data: EmailRegistry['otp']) {
        const meta = EMAIL_META['otp'];
        const html = await render(Email({ key: 'otp', data, ...meta }));
        await this.send(data.email, meta.title, html);
    }

    private async sendResetWarn(data: EmailRegistry['resetWarn']) {
        const meta = EMAIL_META['resetWarn'];
        const html = await render(Email({ key: 'resetWarn', data, ...meta }));
        await this.send(data.email, meta.title, html);
    }

    private async send(to: string, subject: string, html: string) {
        const { error } = await this.resend.emails.send({
            from: 'eComStack <onboarding@resend.dev>',
            to,
            subject,
            html,
        });

        if (error) {
            throw new Error(`Resend error: ${error.message}`);
        }
    }
}