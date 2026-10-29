import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { cleanupOpenApiDoc, ZodValidationPipe } from 'nestjs-zod';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
    { instrument: ObserveInstrument },
  );

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });

  app.useGlobalPipes(new ZodValidationPipe());
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('My Fastify API')
    .setDescription('API documentation with Fastify and Zod')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const sanitizedDocument = cleanupOpenApiDoc(document);
  SwaggerModule.setup('api/docs', app, sanitizedDocument);

  await app.listen(process.env.PORT ?? 8080, '0.0.0.0');
}

await bootstrap();