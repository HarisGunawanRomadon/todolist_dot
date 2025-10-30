import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

export class ValidationErrorPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map((error) => ({
          field: error.property,
          messages: Object.values(error.constraints ?? {}),
        }));
        return new BadRequestException({
          message: 'Validation error',
          errors: messages,
        });
      },
    });
  }
}
