import winston from 'winston';

const DEFAULT_FORMAT = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ level, message, timestamp, label }) => {
    return `${timestamp} - ${level.toUpperCase()} - (${label}) ${message}`;
  })
);

export const createLogger = name => {
  const newFormat = winston.format.combine(
    winston.format.label({ label: name }),
    DEFAULT_FORMAT
  );

  const logger = winston.createLogger({
    level: 'info',
    format: newFormat,
    defaultMeta: { service: name },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          newFormat,
          winston.format.colorize({ all: true })
        )
      })
    ]
  });

  return logger;
};

export default { createLogger };
