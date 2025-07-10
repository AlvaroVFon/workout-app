import { Router } from 'express'
import roleController from '../controllers/role.controller'
import authMiddleware from '../middlewares/auth/auth.middleware'
import globalValidatorMiddleware from '../middlewares/globalValidator.middleware'
import roleMiddleware from '../middlewares/role.middleware'
import { RolesEnum } from '../utils/enums/roles.enum'

const router = Router()

router
  .use([authMiddleware.verifyJWT, authMiddleware.authorizeRoles(RolesEnum.SUPERADMIN)])
  .get('/', roleController.findAll)
  .get('/:id', [globalValidatorMiddleware.validateObjectId], roleController.findById)
  .post('/', [roleMiddleware.validateCreateRoleSchema, roleMiddleware.verifyRoleExistence], roleController.create)
  .patch(
    '/:id',
    [
      globalValidatorMiddleware.validateObjectId,
      roleMiddleware.validateCreateRoleSchema,
      roleMiddleware.verifyRoleExistence,
    ],
    roleController.update,
  )
  .delete('/:id', [globalValidatorMiddleware.validateObjectId], roleController.delete)

export { router as roleRouter }
