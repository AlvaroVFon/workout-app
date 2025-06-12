import { Router } from 'express'
import userController from '../controllers/user.controller'
import userMiddleware from '../middlewares/user.middleware'
import authMiddleware from '../middlewares/auth.middleware'
const router = Router()

router
  .get('/', userController.findAll)
  .get('/:id', [userMiddleware.validateObjectId], userController.findOne)
  .post('/', [userMiddleware.validateCreateUserSchemas, userMiddleware.validateUserExistence], userController.create)
  .patch(
    '/:id',
    [authMiddleware.verifyJWT, userMiddleware.validateObjectId, userMiddleware.validateUpdateUserSchemas],
    userController.update,
  )
  .delete('/:id', [authMiddleware.verifyJWT, userMiddleware.validateObjectId], userController.delete)

export { router as userRouter }
