import { createLogger, transports, format } from 'winston'
import { parameters } from '../config/parameters'

const logger = createLogger({
  level: parameters.logLevel,
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`
    }),
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
})

export default logger
