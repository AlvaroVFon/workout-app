import { Express } from 'express'
import { indexRouter } from '../routes/index.route'
import { authRouter } from '../routes/auth.route'
import { roleRouter } from '../routes/role.route'
import { userRouter } from '../routes/user.route'
import { muscleRouter } from '../routes/muscle.route'
import { errorHandler } from '../handlers/errorHandler'
import { exerciseRouter } from '../routes/exercise.route'
import { athleteRouter } from '../routes/athlete.route'

function configureRoutes(app: Express): void {
  app.use('/', indexRouter)
  app.use('/auth', authRouter)
  app.use('/roles', roleRouter)
  app.use('/users', userRouter)
  app.use('/muscles', muscleRouter)
  app.use('/exercises', exerciseRouter)
  app.use('/athletes', athleteRouter)
  app.use(errorHandler)
}

export { configureRoutes }
