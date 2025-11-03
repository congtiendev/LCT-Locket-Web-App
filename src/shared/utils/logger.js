const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Format for console (colorized and simple)
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaString = '';
    if (Object.keys(meta).length > 0) {
      metaString = ` ${JSON.stringify(meta)}`;
    }
    return `[${timestamp}] ${level}: ${message}${metaString}`;
  })
);

// Format for files (structured and readable)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let output = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

    if (stack) {
      output += `\nStack: ${stack}`;
    }

    if (Object.keys(meta).length > 0) {
      output += `\nMeta: ${JSON.stringify(meta, null, 2)}`;
    }

    return `${output}\n${'-'.repeat(80)}\n`;
  })
);

const transports = [
  new winston.transports.Console({
    format: consoleFormat,
  }),
  new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '14d',
    format: fileFormat,
  }),
  new DailyRotateFile({
    filename: 'logs/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: fileFormat,
  }),
];

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  transports,
});

module.exports = logger;
