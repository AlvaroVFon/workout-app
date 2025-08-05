import { Express } from 'express'
import { errorHandler } from '../handlers/errorHandler'
import { athleteRouter } from '../routes/athlete.route'
import { authRouter } from '../routes/auth.route'
import { disciplineRouter } from '../routes/discipline.route'
import { exerciseRouter } from '../routes/exercise.route'
import { indexRouter } from '../routes/index.route'
import { muscleRouter } from '../routes/muscle.route'
import { roleRouter } from '../routes/role.route'
import { trainingSessionRouter } from '../routes/trainingSession.route'
import { userRouter } from '../routes/user.route'

function configureRoutes(app: Express): void {
  app.use('/', indexRouter)
  app.use('/auth', authRouter)
  app.use('/roles', roleRouter)
  app.use('/users', userRouter)
  app.use('/muscles', muscleRouter)
  app.use('/exercises', exerciseRouter)
  app.use('/athletes', athleteRouter)
  app.use('/training-sessions', trainingSessionRouter)
  app.use('/disciplines', disciplineRouter)
  app.use(errorHandler)
}

export { configureRoutes }
