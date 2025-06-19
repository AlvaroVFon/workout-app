import { Router } from 'express'
import userController from '../controllers/user.controller'
import userMiddleware from '../middlewares/user.middleware'
import authMiddleware from '../middlewares/auth.middleware'
import globalValidatorMiddleware from '../middlewares/globalValidator.middleware'
import { RolesEnum } from '../utils/enums/roles.enum'
const router = Router()

router
  .use([authMiddleware.verifyJWT, authMiddleware.authorizeRoles(RolesEnum.ADMIN, RolesEnum.USER)])
  .get('/', userController.findAll)
  .get('/:id', [globalValidatorMiddleware.validateObjectId], userController.findOne)
  .post('/', [userMiddleware.validateCreateUserSchemas, userMiddleware.validateUserExistence], userController.create)
  .patch(
    '/:id',
    [globalValidatorMiddleware.validateObjectId, userMiddleware.validateUpdateUserSchemas],
    userController.update,
  )
  .delete('/:id', [globalValidatorMiddleware.validateObjectId], userController.delete)

export { router as userRouter }
