import { Router } from 'express'
import muscleController from '../controllers/muscle.controller'
import muscleMiddleware from '../middlewares/muscle.middleware'
import globalValidatorMiddleware from '../middlewares/globalValidator.middleware'
import authMiddleware from '../middlewares/auth.middleware'
import { RolesEnum } from '../utils/enums/roles.enum'

const router = Router()

router
  .use([authMiddleware.verifyJWT, authMiddleware.authorizeRoles(RolesEnum.ADMIN, RolesEnum.SUPERADMIN)])
  .get('/', muscleController.findAll)
  .get('/:id', [globalValidatorMiddleware.validateObjectId], muscleController.findById)
  .post('/', [muscleMiddleware.validateCreateMuscleSchema], muscleController.create)
  .patch(
    '/:id',
    [globalValidatorMiddleware.validateObjectId, muscleMiddleware.validateCreateMuscleSchema],
    muscleController.update,
  )
  .delete('/:id', [globalValidatorMiddleware.validateObjectId], muscleController.delete)

export { router as muscleRouter }
