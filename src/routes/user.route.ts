import { Router } from 'express'
import userController from '../controllers/user.controller'
import userMiddleware from '../middlewares/user.middleware'
import authMiddleware from '../middlewares/auth.middleware'
import globalValidatorMiddleware from '../middlewares/globalValidator.middleware'
const router = Router()

router
  .get('/', userController.findAll)
  .get('/:id', [globalValidatorMiddleware.validateObjectId], userController.findOne)
  .post('/', [userMiddleware.validateCreateUserSchemas, userMiddleware.validateUserExistence], userController.create)
  .patch(
    '/:id',
    [authMiddleware.verifyJWT, globalValidatorMiddleware.validateObjectId, userMiddleware.validateUpdateUserSchemas],
    userController.update,
  )
  .delete('/:id', [authMiddleware.verifyJWT, globalValidatorMiddleware.validateObjectId], userController.delete)

export { router as userRouter }
