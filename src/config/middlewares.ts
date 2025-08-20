import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Express } from 'express'
import { parameters } from './parameters'
import passport from './passport'
import helmet from 'helmet'
import { limiter } from '../middlewares/rateLimit.middleware'

function configureMiddlewares(app: Express) {
  app.use(express.json())
  app.use(passport.initialize())
  app.use(
    cors({
      origin: parameters.frontUrl,
      credentials: true,
    }),
  )
  app.use(cookieParser())
  app.use(helmet())
  app.use(limiter)
}

export { configureMiddlewares }
