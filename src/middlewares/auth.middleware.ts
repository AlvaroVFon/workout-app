import { Request, Response, NextFunction } from 'express'
import { loginSchema } from '../schemas/auth/auth.schema'
import BadRequestException from '../exceptions/BadRequestException'
import passport from '../config/passport'
import UnauthorizedException from '../exceptions/UnauthorizedException'
import { AuthenticatedRequest } from '../interfaces/authenticatedRequest.interface'
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
    passport.authenticate(
      'jwt',
      { session: false },
      (err: Error | null, user: Express.User | false, info: { message?: string } | undefined) => {
        if (err || !user) return next(new UnauthorizedException())

        req.user = user

        next()
      },
    )(req, res, next)
  }

  authorizeRoles(...authorizedRoles: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (!req.user) return next(new UnauthorizedException())

      const user: AuthenticatedUser = req.user

      const isRoleAllowed = authorizedRoles.includes(user.role.name)
      if (!isRoleAllowed) throw new ForbiddenException()

      next()
    }
  }
}

export default new AuthMiddleware()
