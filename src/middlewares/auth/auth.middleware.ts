import { NextFunction, Request, Response } from 'express'
import passport from '../../config/passport'
import ForbiddenException from '../../exceptions/ForbiddenException'
import UnauthorizedException from '../../exceptions/UnauthorizedException'
import { AuthenticatedUser } from '../../interfaces/user.inteface'
import blockService from '../../services/block.service'
import userService from '../../services/user.service'
import { AttemptsEnum } from '../../utils/enums/attempts.enum'
import { verifyToken } from '../../utils/jwt.utils'
import { TokenTypeEnum } from '../../utils/enums/token.enum'

class AuthMiddleware {
  verifyJWT(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', { session: false }, (err: Error | null, user: Express.User | false) => {
      if (err || !user) return next(new UnauthorizedException())

      req.user = user

      next()
    })(req, res, next)
  }

  verifyResetPasswordToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.params.token
      const verifiedToken = verifyToken(String(token), TokenTypeEnum.RESET_PASSWORD)

      if (!verifiedToken) {
        return next(new UnauthorizedException('Invalid or expired reset password token.'))
      }

      res.locals.userId = verifiedToken.id
      next()
    } catch (error) {
      next(error)
    }
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

  async verifySignupBlock(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email } = req.body
    try {
      const user = await userService.findByEmail(email)
      if (user) return next(new ForbiddenException('User already exists.'))

      const isBlocked = await blockService.isBlocked(email, AttemptsEnum.SIGNUP)

      if (isBlocked) return next(new ForbiddenException('You are blocked from signing up.'))

      next()
    } catch (error) {
      next(error)
    }
  }

  async verifySignupVerifyBlock(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email } = req.body
    try {
      const isBlocked = await blockService.isBlocked(email, AttemptsEnum.SIGNUP_VERIFY)
      if (isBlocked) return next(new ForbiddenException('You are blocked from verifying your signup.'))
      next()
    } catch (error) {
      next(error)
    }
  }

  async verifyForgotPasswordBlock(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email } = req.body
    try {
      const user = await userService.findByEmail(email)
      if (!user) return next(new UnauthorizedException())

      const isBlocked = await blockService.isBlocked(user.id, AttemptsEnum.PASSWORD_RECOVERY)

      if (isBlocked) return next(new ForbiddenException('You are blocked from requesting a password recovery.'))

      next()
    } catch (error) {
      next(error)
    }
  }

  async verifyResetPasswordBlock(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { userId } = res.locals
    try {
      const user = await userService.findById(userId)
      if (!user) return next(new UnauthorizedException())

      const isBlocked = await blockService.isBlocked(user.id.toString(), AttemptsEnum.PASSWORD_CHANGE)

      if (isBlocked) return next(new ForbiddenException('You are blocked from changing your password.'))

      next()
    } catch (error) {
      next(error)
    }
  }
}

export default new AuthMiddleware()
