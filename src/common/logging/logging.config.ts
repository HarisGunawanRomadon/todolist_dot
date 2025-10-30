import * as winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'info';
};

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ level, message, timestamp }) => {
    return `[${String(timestamp)}] [${level}] : ${String(message)} `;
  }),
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
];

export const loggingConfig = {
  level: level(),
  levels,
  format,
  transports,
};
