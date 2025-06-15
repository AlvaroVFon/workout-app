import { Router } from 'express'
import exerciseController from '../controllers/exercise.controller'
import globalValidatorMiddleware from '../middlewares/globalValidator.middleware'
import exerciseMiddleware from '../middlewares/exercise.middleware'

const router = Router()

router
  .get('/', exerciseController.findAll)
  .get('/:id', [globalValidatorMiddleware.validateObjectId], exerciseController.findById)
  .post('/', [exerciseMiddleware.checkCreateExerciseSchema], exerciseController.create)

export { router as exerciseRouter }
