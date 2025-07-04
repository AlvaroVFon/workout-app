import { Router } from 'express'
import authController from '../controllers/auth.controller'
import authMiddleware from '../middlewares/auth.middleware'
import userMiddleware from '../middlewares/user.middleware'
const router = Router()

router
  .post('/login', [authMiddleware.validateLoginSchema], authController.login)
  .post('/refresh', [authMiddleware.validateRefreshSchema], authController.refreshTokens)
  .post(
    '/signup',
    [userMiddleware.validateUserExistence, userMiddleware.validateCreateUserSchemas],
    authController.signUp,
  )
  .get('/info', [authMiddleware.verifyJWT], authController.info)
  .post('/logout', [authMiddleware.verifyJWT, authMiddleware.validateHeaderRefreshToken], authController.logout)

export { router as authRouter }
