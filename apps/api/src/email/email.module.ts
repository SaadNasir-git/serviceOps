import { Module } from '@nestjs/common';
import { EmailService } from './email.service.js';
import { BullModule } from '@nestjs/bullmq';
import { Resend } from 'resend'
import { AuthEmailProcessor } from './processors/auth-email.processor.js';

@Module({
  providers: [
    EmailService,
    AuthEmailProcessor,
    {
      provide: 'RESEND_CLIENT',
      useFactory: () => {
        return new Resend(process.env.RESEND_API_KEY);
      },
    },

  ],
  imports: [
    BullModule.registerQueue({
      name: 'auth-email-queue',
    })
  ],
  exports: [EmailService]
})
export class EmailModule { }