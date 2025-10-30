import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { loggingConfig } from './logging/logging.config';

@Module({
  imports: [WinstonModule.forRoot(loggingConfig)],
  exports: [WinstonModule],
})
export class CommonModule {}
