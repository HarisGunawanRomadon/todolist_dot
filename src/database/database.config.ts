import { registerAs } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default registerAs('database', (): PostgresConnectionOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/entities/*.entity.{ts,js}'],
    synchronize: Boolean(process.env.DB_SYNCHRONIZE),
    logging: Boolean(process.env.DB_LOGGING),
  };
});
