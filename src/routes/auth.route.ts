import { Router } from 'express'
import authController from '../controllers/auth.controller'
import userMiddleware from '../middlewares/user.middleware'
import authMiddleware from '../middlewares/auth.middleware'
const router = Router()

router
  .post('/login', [authMiddleware.validateLoginSchema, authMiddleware.verifyLoginBlock], authController.login)
  .post('/refresh', [authMiddleware.validateRefreshSchema], authController.refreshTokens)
  .post(
    '/signup',
    [userMiddleware.validateUserExistence, userMiddleware.validateCreateUserSchemas],
    authController.signUp,
  )
  .get('/info', [authMiddleware.verifyJWT], authController.info)
  .post('/logout', [authMiddleware.verifyJWT, authMiddleware.validateHeaderRefreshToken], authController.logout)
  .post('/forgot-password', [authMiddleware.verifyJWT])
  .post('/reset-password', [authMiddleware.verifyJWT])

export { router as authRouter }
