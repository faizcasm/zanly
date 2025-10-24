import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';
import LokiTransport from 'winston-loki';


const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: 'logs/%DATE%-combined.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d', // keep logs for 14 days
  level: 'info',
});

const errorRotateFileTransport = new transports.DailyRotateFile({
  filename: 'logs/%DATE%-error.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  level: 'error',
});

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    dailyRotateFileTransport,
    errorRotateFileTransport,
    new LokiTransport({
      host: 'http://192.168.1.9:3100', // Loki container in Docker network
      json: true,
      labels: { app: 'nodejs_app' }
    }),
  ],
});

export default logger;
