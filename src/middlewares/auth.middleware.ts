import { Request, Response, NextFunction } from 'express'
import { loginSchema } from '../schemas/auth/auth.schema'
import BadRequestException from '../exceptions/BadRequestException'
import passport from '../config/passport'
import UnauthorizedException from '../exceptions/UnauthorizedException'
import { AuthenticatedUser } from '../interfaces/user.inteface'
import ForbiddenException from '../exceptions/ForbiddenException'

class AuthMiddleware {
  async verifyLoginSchema(req: Request, res: Response, next: NextFunction): Promise<void> {
    const data = req.body

    try {
      const { error } = loginSchema.validate(data)

      if (error) {
        return next(new BadRequestException(error.details[0].message))
      }
    } catch (error) {
      next(error)
    }

    next()
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
}

export default new AuthMiddleware()
