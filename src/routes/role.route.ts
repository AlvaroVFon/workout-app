import { Router } from 'express'
import roleController from '../controllers/role.controller'
import roleMiddleware from '../middlewares/role.middleware'
import globalValidatorMiddleware from '../middlewares/globalValidator.middleware'
import authMiddleware from '../middlewares/auth.middleware'
import { RolesEnum } from '../utils/enums/roles.enum'

const router = Router()

router
  .use([authMiddleware.verifyJWT, authMiddleware.authorizeRoles(RolesEnum.SUPERADMIN)])
  .get('/', roleController.findAll)
  .get('/:id', [globalValidatorMiddleware.validateObjectId], roleController.findById)
  .post('/', [roleMiddleware.checkCreateRoleSchema, roleMiddleware.verifyRoleExistance], roleController.create)
  .patch(
    '/:id',
    [
      globalValidatorMiddleware.validateObjectId,
      roleMiddleware.checkCreateRoleSchema,
      roleMiddleware.verifyRoleExistance,
    ],
    roleController.update,
  )
  .delete('/:id', [globalValidatorMiddleware.validateObjectId], roleController.delete)

export { router as roleRouter }
