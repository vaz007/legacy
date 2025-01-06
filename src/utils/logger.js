const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    verbose: 4, // Optional
  },
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message }) =>
        `[${timestamp}] ${level.toUpperCase()}: ${message}`,
    ),
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize()),
    }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Only errors
    new transports.File({ filename: 'logs/combined.log' }), // All levels
  ],
  level: process.env.LOG_LEVEL || 'info', // Default level
});

module.exports = logger;
