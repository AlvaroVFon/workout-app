import { Router } from 'express'
import userController from '../controllers/user.controller'
import userMiddleware from '../middlewares/user.middleware'
import authMiddleware from '../middlewares/auth/auth.middleware'
import globalValidatorMiddleware from '../middlewares/globalValidator.middleware'
import paginationMiddleware from '../middlewares/pagination.middleware'
import { RolesEnum } from '../utils/enums/roles.enum'
const router = Router()

router
  .use([authMiddleware.verifyJWT, authMiddleware.authorizeRoles(RolesEnum.ADMIN, RolesEnum.SUPERADMIN)])
  .get('/', [paginationMiddleware.paginate], userController.findAll)
  .get('/:id', [globalValidatorMiddleware.validateObjectId], userController.findOne)
  .post('/', [userMiddleware.validateCreateUserSchemas, userMiddleware.validateUserExistence], userController.create)
  .patch(
    '/:id',
    [globalValidatorMiddleware.validateObjectId, userMiddleware.validateUpdateUserSchemas],
    userController.update,
  )
  .delete('/:id', [globalValidatorMiddleware.validateObjectId], userController.delete)

export { router as userRouter }
