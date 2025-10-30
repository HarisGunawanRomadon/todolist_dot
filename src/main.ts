import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { config } from 'dotenv';
import { resolve } from 'path';
import { ValidationErrorPipe } from './common/pipes/validation-error.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  const logger: Logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationErrorPipe());

  app.enableShutdownHooks();

  app.setGlobalPrefix('api/v1');

  await app.listen(port, () => {
    console.log(`Server running on port : ${port}`);
  });
}
bootstrap();
