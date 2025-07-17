import express, { Express } from 'express'
import passport from './passport'
import cors from 'cors'
import cookieParser from 'cookie-parser'

function configureMiddlewares(app: Express) {
  app.use(express.json())
  app.use(passport.initialize())
  app.use(cors())
  app.use(cookieParser())
}

export { configureMiddlewares }
