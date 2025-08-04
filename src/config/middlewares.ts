import express, { Express } from 'express'
import passport from './passport'
import cors from 'cors'
import { parameters } from './parameters'

function configureMiddlewares(app: Express) {
  app.use(express.json())
  app.use(passport.initialize())
  app.use(
    cors({
      origin: parameters.frontUrl,
      credentials: true,
    }),
  )
}

export { configureMiddlewares }
