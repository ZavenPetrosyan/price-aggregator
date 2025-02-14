import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import * as dotenv from 'dotenv';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(helmet());
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('PriceGenerator APIs')
    .setDescription('API documentation for PriceGenerator')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter user JWT token',
        in: 'header',
      },
      'User-JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`🚀 Service is running on http://localhost:${PORT}`);
}

bootstrap();
