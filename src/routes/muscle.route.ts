import { Router } from 'express'
import muscleController from '../controllers/muscle.controller'
import muscleMiddleware from '../middlewares/muscle.middleware'
import globalValidatorMiddleware from '../middlewares/globalValidator.middleware'

const router = Router()

router
  .get('/', muscleController.findAll)
  .get('/:id', [globalValidatorMiddleware.validateObjectId], muscleController.findById)
  .post('/', [muscleMiddleware.checkCreateMuscleSchema], muscleController.create)
  .patch(
    '/:id',
    [globalValidatorMiddleware.validateObjectId, muscleMiddleware.checkCreateMuscleSchema],
    muscleController.update,
  )
  .delete('/:id', [globalValidatorMiddleware.validateObjectId], muscleController.delete)

export { router as muscleRouter }
