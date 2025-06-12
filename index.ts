import Server from './src/models/Server'
import express, { Express } from 'express'
import { parameters } from './src/config/parameters'
import { configureRoutes } from './src/config/routes'
import { configureMiddlewares } from './src/config/middlewares'
import { connectDatabase } from './src/config/db'
import { connectCache } from './src/config/cache'
import logger from './src/utils/logger'

const { port } = parameters
const app: Express = express()

async function main() {
  try {
    const server = new Server(port, app, configureMiddlewares, configureRoutes, connectDatabase, connectCache)
    server.start()
  } catch (error) {
    logger.error('Error starting server', error)
  }
}

main()
