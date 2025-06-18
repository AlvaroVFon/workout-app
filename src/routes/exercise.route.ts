import { Router } from 'express'
import exerciseController from '../controllers/exercise.controller'
import globalValidatorMiddleware from '../middlewares/globalValidator.middleware'
import exerciseMiddleware from '../middlewares/exercise.middleware'

const router = Router()

router
  .get('/', exerciseController.findAll)
  .get('/:id', [globalValidatorMiddleware.validateObjectId], exerciseController.findById)
  .post(
    '/',
    [exerciseMiddleware.checkCreateExerciseSchema, exerciseMiddleware.verifyExerciseExistance],
    exerciseController.create,
  )
  .patch(
    '/:id',
    [
      globalValidatorMiddleware.validateObjectId,
      exerciseMiddleware.checkUpdateExerciseSchema,
      exerciseMiddleware.verifyExerciseExistance,
    ],
    exerciseController.update,
  )
  .delete('/:id', [globalValidatorMiddleware.validateObjectId], exerciseController.delete)

export { router as exerciseRouter }
