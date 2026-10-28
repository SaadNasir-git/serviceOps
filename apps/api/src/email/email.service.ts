import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import type { EmailRegistry } from './templates/type.js';

type AuthJobName = keyof EmailRegistry;
type AuthJobData = EmailRegistry[AuthJobName];

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('auth-email-queue')
    private readonly queue: Queue<AuthJobData, void, AuthJobName>,
  ) {}

  async add<N extends AuthJobName>(
    name: N,
    data: EmailRegistry[N],
  ): Promise<void> {
    await this.queue.add(name, data);
  }
}