import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Main');
  const globalPrefix = process.env.GLOBAL_PREFIX || 'api';

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:4000', // Update with your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow the HTTP methods you need
    credentials: true, // Enable cookies and credentials
  };

  app.enableCors(corsOptions);
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('RTC chat app')
    // .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(AppModule.port);

  const logString = `Listening to http://${AppModule.baseUrl}:${AppModule.port}${globalPrefix}`;
  logger.log(logString);
}

bootstrap();
