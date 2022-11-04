import { configure } from 'log4js'
import { logger } from '../utils/logger.util'

const loggerConfig = {
  appenders: {
    console: { type: 'stdout' },
  },
  categories: {
    default: { appenders: ['console'], level: 'debug' },
  },
}

export const LoggerConfig = () => {
  configure(loggerConfig)
}

export const startLoggerMsg = (port) => {
  logger.info(`e-travel-server is started at ${port} port.`)
}
