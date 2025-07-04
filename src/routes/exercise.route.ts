import { Router } from 'express'
import exerciseController from '../controllers/exercise.controller'
import globalValidatorMiddleware from '../middlewares/globalValidator.middleware'
import exerciseMiddleware from '../middlewares/exercise.middleware'
import paginationMiddleware from '../middlewares/pagination.middleware'
import authMiddleware from '../middlewares/auth.middleware'
import { RolesEnum } from '../utils/enums/roles.enum'

const router = Router()

router
  .use([authMiddleware.verifyJWT])
  .get('/', [paginationMiddleware.paginate], exerciseController.findAll)
  .get('/:id', [globalValidatorMiddleware.validateObjectId], exerciseController.findById)
  .post(
    '/',
    [
      authMiddleware.authorizeRoles(RolesEnum.ADMIN, RolesEnum.SUPERADMIN),
      exerciseMiddleware.validateCreateExerciseSchema,
      exerciseMiddleware.validateExerciseExistence,
    ],
    exerciseController.create,
  )
  .patch(
    '/:id',
    [
      authMiddleware.authorizeRoles(RolesEnum.ADMIN, RolesEnum.SUPERADMIN),
      globalValidatorMiddleware.validateObjectId,
      exerciseMiddleware.validateUpdateExerciseSchema,
      exerciseMiddleware.validateExerciseExistence,
    ],
    exerciseController.update,
  )
  .delete(
    '/:id',
    [authMiddleware.authorizeRoles(RolesEnum.SUPERADMIN), globalValidatorMiddleware.validateObjectId],
    exerciseController.delete,
  )

export { router as exerciseRouter }
