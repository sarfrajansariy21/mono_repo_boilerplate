// src/main.ts
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const port = config.get<number>('port') ?? 3000;
  const prefix = config.get<string>('apiPrefix') ?? 'api/v1';
  const nodeEnv = config.get<string>('nodeEnv') ?? 'development';

  // ── Global prefix ─────────────────────────────────────────────────────
  app.setGlobalPrefix(prefix);

  // ── CORS ──────────────────────────────────────────────────────────────
  app.enableCors({
    origin: nodeEnv === 'production' ? process.env.ALLOWED_ORIGINS?.split(',') : '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ── Global Validation Pipe ────────────────────────────────────────────
  // Strips unknown properties, transforms types, validates DTOs globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Strip unknown properties
      forbidNonWhitelisted: true, // Throw on extra properties
      transform: true,           // Auto-transform to DTO types
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ── Class Serializer (respects @Exclude / @Expose) ────────────────────
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // ── Swagger (only in non-production) ─────────────────────────────────
  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('NestJS Auth API')
      .setDescription(
        'Production-level User Authentication API built with NestJS & TypeScript',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token',
        },
        'JWT-auth',
      )
      .addTag('Auth', 'Authentication endpoints')
      .addTag('Users', 'User management endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(`${prefix}/docs`, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
      },
    });

    logger.log(`📚 Swagger docs → http://localhost:${port}/${prefix}/docs`);
  }

  // ── Start server ──────────────────────────────────────────────────────
  await app.listen(port);
  logger.log(`🚀 Server running on http://localhost:${port}/${prefix}`);
  logger.log(`🌍 Environment: ${nodeEnv}`);
}

bootstrap();