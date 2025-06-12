import express, { Express } from 'express'
import passport from './passport'
import cors from 'cors'

function configureMiddlewares(app: Express) {
  app.use(express.json())
  app.use(passport.initialize())
  app.use(cors())
}

export { configureMiddlewares }
