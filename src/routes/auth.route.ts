import { Router } from 'express'
import authController from '../controllers/auth.controller'
import authMiddleware from '../middlewares/auth/auth.middleware'
import authValidatorMiddleware from '../middlewares/auth/validator.middleware'
import userMiddleware from '../middlewares/user.middleware'
const router = Router()

router
  .post('/login', [authValidatorMiddleware.validateLoginSchema, authMiddleware.verifyLoginBlock], authController.login)
  .post('/refresh', [authValidatorMiddleware.validateRefreshSchema], authController.refreshTokens)
  .post(
    '/signup',
    [authValidatorMiddleware.validateSignupSchema, userMiddleware.validateUserExistence],
    authController.signUp,
  )
  .post(
    '/signup-verify/:uuid',
    [authValidatorMiddleware.validateSignupVerifySchema, authMiddleware.verifySignupVerifyBlock],
    authController.signupVerification,
  )
  .get('/info', [authMiddleware.verifyJWT], authController.info)
  .post(
    '/logout',
    [authMiddleware.verifyJWT, authValidatorMiddleware.validateHeaderRefreshToken],
    authController.logout,
  )
  .post(
    '/forgot-password',
    [authValidatorMiddleware.validateForgotPasswordSchema, authMiddleware.verifyForgotPasswordBlock],
    authController.forgotPassword,
  )
  .post(
    '/reset-password/:token',
    [
      authValidatorMiddleware.validateResetPasswordSchema,
      authMiddleware.verifyResetPasswordToken,
      authMiddleware.verifyResetPasswordBlock,
    ],
    authController.resetPassword,
  )

export { router as authRouter }
