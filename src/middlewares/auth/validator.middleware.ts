import { Request, Response, NextFunction } from 'express'
import {
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  headerTokenSchema,
  resetPasswordSchema,
  stringParamSchema,
  signupVerificationSchema,
} from '../../schemas/auth/auth.schema'

import BadRequestException from '../../exceptions/BadRequestException'

class AuthValidatorMiddleware {
  async validateSignupSchema(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { error } = loginSchema.validate(req.body)

      if (error) return next(new BadRequestException(error.details[0].message))

      next()
    } catch (error) {
      next(error)
    }
  }

  validateSignupVerifySchema(req: Request, res: Response, next: NextFunction): void {
    try {
      const { error } = signupVerificationSchema.validate(req.body)
      const { error: uuidError } = stringParamSchema.validate(req.params.uuid)

      if (error) return next(new BadRequestException(error.details[0].message))
      if (uuidError) return next(new BadRequestException(uuidError.details[0].message))

      next()
    } catch (error) {
      next(error)
    }
  }

  async validateLoginSchema(req: Request, res: Response, next: NextFunction): Promise<void> {
    const data = req.body

    try {
      const { error } = loginSchema.validate(data)

      if (error) return next(new BadRequestException(error.details[0].message))

      next()
    } catch (error) {
      next(error)
    }
  }

  async validateForgotPasswordSchema(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { error } = forgotPasswordSchema.validate(req.body)

      if (error) return next(new BadRequestException(error.details[0].message))

      next()
    } catch (error) {
      next(error)
    }
  }

  async validateResetPasswordSchema(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { error } = resetPasswordSchema.validate(req.body)
      const { error: resetTokenError } = stringParamSchema.validate(req.params.token)

      if (error) return next(new BadRequestException(error.details[0].message))
      if (resetTokenError) return next(new BadRequestException(resetTokenError.details[0].message))

      next()
    } catch (error) {
      next(error)
    }
  }

  validateRefreshSchema(req: Request, res: Response, next: NextFunction): void {
    try {
      const { error } = refreshTokenSchema.validate(req.body)
      if (error) return next(new BadRequestException(error.details[0].message))

      next()
    } catch (error) {
      next(error)
    }
  }

  validateHeaderRefreshToken(req: Request, res: Response, next: NextFunction): void {
    try {
      const refreshToken = req.headers['x-refresh-token'] as string
      const { error } = headerTokenSchema.validate(refreshToken)

      if (error) return next(new BadRequestException(error.details[0].message))

      next()
    } catch (error) {
      next(error)
    }
  }
}

export default new AuthValidatorMiddleware()
