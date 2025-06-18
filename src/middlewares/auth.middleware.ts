import { Request, Response, NextFunction } from 'express'
import { loginSchema } from '../schemas/auth/auth.schema'
import BadRequestException from '../exceptions/BadRequestException'
import passport from '../config/passport'
import UnauthorizedException from '../exceptions/UnauthorizedException'

class AuthMiddleware {
  async verifyLoginSchema(req: Request, res: Response, next: NextFunction): Promise<void> {
    const data = req.body

    try {
      const { error } = loginSchema.validate(data)

      if (error) {
        next(new BadRequestException(error.details[0].message))
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
}

export default new AuthMiddleware()
