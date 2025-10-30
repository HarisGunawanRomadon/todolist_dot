import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ConfigModule, ConfigType } from '@nestjs/config';
import databaseConfig from './database.config';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      inject: [databaseConfig.KEY],
      useFactory: (db: ConfigType<typeof databaseConfig>) => ({
        ...db,
      }),
    }),
  ],
  exports: [],
})
export class DatabaseModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async onModuleInit() {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
        this.logger.info('Database connection established successfully.');
      } else {
        this.logger.info('Database connection already initialized.');
      }

      const opts = this.dataSource.options as PostgresConnectionOptions;
      this.logger.debug(`Connected to: ${opts.database ?? 'unknown'}`);
      this.logger.debug(`Host: ${opts.host ?? 'unknown'}`);
    } catch (e) {
      this.logger.error('Failed to connect to database', e);
      throw e;
    }
  }

  async onModuleDestroy() {
    try {
      if (this.dataSource.isInitialized) {
        await this.dataSource.destroy();
        this.logger.info('Database connection closed gracefully.');
      }
    } catch (e) {
      this.logger.error('Error closing database connection', e);
    }
  }
}
