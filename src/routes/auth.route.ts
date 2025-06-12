import { Router } from 'express'
import authController from '../controllers/auth.controller'
import authMiddleware from '../middlewares/auth.middleware'
import userMiddleware from '../middlewares/user.middleware'
const router = Router()

router.post('/login', [authMiddleware.verifyLoginSchema], authController.login)
router.post(
  '/signup',
  [userMiddleware.validateUserExistence, userMiddleware.validateCreateUserSchemas],
  authController.signUp,
)
router.get('/info', [authMiddleware.verifyJWT], authController.info)

export { router as authRouter }
