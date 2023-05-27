import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Main');
  const globalPrefix = '/api';

  app.enableCors();

  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Convert exceptions to JSON readable format
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(AppModule.port);

  const logString = `Listening to http://${AppModule.baseUrl}:${AppModule.port}${globalPrefix}`;

  logger.log(logString);
}
bootstrap();
