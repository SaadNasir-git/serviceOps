import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
    {
      instrument: ObserveInstrument
    }
  );
  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET
  });
  app.useGlobalPipes(new ZodValidationPipe());
  app.setGlobalPrefix("api")
  await app.listen(process.env.PORT ?? 8080, '0.0.0.0');
}
await bootstrap();