// src/database/data-source.ts (atau lokasi Anda)
import 'dotenv/config';
import { DataSource } from 'typeorm';

// Jika dijalankan via typeorm-ts-node-commonjs, TS_NODE biasanya ter-set
const isTs = !!process.env.TS_NODE || process.env.NODE_ENV !== 'production';

// Hanya cek apakah DATABASE_URL valid (tanpa pengecualian hostname Railway)
function hasValidDatabaseUrl(url?: string): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

const useUrl = hasValidDatabaseUrl(process.env.DATABASE_URL);

const hostWhenNotUrl = process.env.DB_HOST || 'localhost';

const sslOption: false | { rejectUnauthorized: boolean } =
  process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;

export default new DataSource({
  type: 'postgres',
  ...(useUrl
    ? { url: process.env.DATABASE_URL }
    : {
        host: hostWhenNotUrl,
        port: Number(process.env.DB_PORT || 5432),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      }),
  entities: [isTs ? 'src/**/*.entity.ts' : 'dist/**/*.entity.js'],
  migrations: [isTs ? 'src/migrations/*.ts' : 'dist/migrations/*.js'],
  ssl: sslOption,
});
