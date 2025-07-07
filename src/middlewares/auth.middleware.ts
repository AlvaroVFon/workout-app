import { NextFunction, Request, Response } from 'express'
import passport from '../config/passport'
import BadRequestException from '../exceptions/BadRequestException'
import ForbiddenException from '../exceptions/ForbiddenException'
import UnauthorizedException from '../exceptions/UnauthorizedException'
import { AuthenticatedUser } from '../interfaces/user.inteface'
import {
  forgotPasswordSchema,
  headerTokenSchema,
  loginSchema,
  refreshTokenSchema,
  resetPasswordSchema,
} from '../schemas/auth/auth.schema'
import blockService from '../services/block.service'
import userService from '../services/user.service'
import { AttemptsEnum } from '../utils/enums/attempts.enum'

class AuthMiddleware {
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

      if (error) return next(new BadRequestException(error.details[0].message))

      next()
    } catch (error) {
      next(error)
    }
  }

  verifyJWT(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', { session: false }, (err: Error | null, user: Express.User | false) => {
      if (err || !user) return next(new UnauthorizedException())

      req.user = user

      next()
    })(req, res, next)
  }

  authorizeRoles(...authorizedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as unknown as { user?: AuthenticatedUser }).user
      if (!user) return next(new UnauthorizedException())

      const isRoleAllowed = authorizedRoles.includes(user.role)

      if (!isRoleAllowed) return next(new ForbiddenException())

      next()
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

  async verifyLoginBlock(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email } = req.body
    try {
      const user = await userService.findByEmail(email)
      if (!user) return next(new UnauthorizedException())

      const isBlocked = await blockService.isBlocked(user.id.toString(), AttemptsEnum.LOGIN)

      if (isBlocked) return next(new ForbiddenException('You are blocked from logging in.'))

      next()
    } catch (error) {
      next(error)
    }
  }
}

export default new AuthMiddleware()
