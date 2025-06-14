import { Router } from 'express'
import roleController from '../controllers/role.controller'
import roleMiddleware from '../middlewares/role.middleware'
import globalValidatorMiddleware from '../middlewares/globalValidator.middleware'

const router = Router()

router
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
