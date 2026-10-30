import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { CacheService } from './cache/cache.service.js';
import { UserModule } from './user/user.module.js';
import KeyvValkey from '@keyv/valkey';
import { CacheModule } from './cache/cache.module.js';
import { CacheModule as CacheManager } from '@nestjs/cache-manager';
import { DrizzleModule } from '@nestjs/drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
import { BullModule } from '@nestjs/bullmq';
import { EmailModule } from './email/email.module.js';
import { ProjectModule } from './project/project.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DrizzleModule.forRoot({
      drizzle,
      connection: process.env.DATABASE_URL!,
    }),
    CacheManager.register({
      isGlobal: true,
      stores: new KeyvValkey(process.env.VALKEY_URI!)
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    AuthModule,
    CacheModule,
    UserModule,
    EmailModule,
    ProjectModule
  ],
  controllers: [AppController],
  providers: [AppService, CacheService]
})
export class AppModule { }