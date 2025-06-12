import { Express } from 'express'
import { indexRouter } from '../routes/index.route'
import { authRouter } from '../routes/auth.route'
import { roleRouter } from '../routes/role.route'
import { userRouter } from '../routes/user.route'
import { errorHandler } from '../handlers/errorHandler'

function configureRoutes(app: Express): void {
  app.use('/', indexRouter)
  app.use('/auth', authRouter)
  app.use('/roles', roleRouter)
  app.use('/users', userRouter)
  app.use(errorHandler)
}

export { configureRoutes }
