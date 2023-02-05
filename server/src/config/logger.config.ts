import * as winston from 'winston';

const { format, createLogger, transports } = winston;

const { combine, timestamp, label, printf } = format;

// eslint-disable-next-line @typescript-eslint/no-shadow
const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level.toUpperCase()}: ${message}`;
});

const formatDateTime = (date: Date) =>
  date
    .toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
    .toLowerCase();

export const getLogger = (name = 'App') =>
  createLogger({
    level: 'debug',
    format: combine(
      label({ label: name }),
      timestamp({
        format: () => formatDateTime(new Date()),
      }),
      format.splat(),
      customFormat,
    ),
    transports: [
      new transports.Console(),
      new transports.File({
        filename: 'logs/app-logs.log',
      }),
      new transports.File({
        level: 'error',
        filename: 'logs/errors.log',
      }),
    ],
    rejectionHandlers: [
      new transports.File({ filename: 'logs/rejections.log' }),
    ],
  });
