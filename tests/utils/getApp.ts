import express, { Express } from 'express'
import { configureMiddlewares } from '../../src/config/middlewares'
import { configureRoutes } from '../../src/config/routes'

export const getTestApp = async (): Promise<Express> => {
  const app = express()

  configureMiddlewares(app)
  configureRoutes(app)

  return app
}
