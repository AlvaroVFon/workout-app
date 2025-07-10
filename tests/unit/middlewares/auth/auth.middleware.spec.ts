import { NextFunction, Request, Response } from 'express'
import passport from '../../../../src/config/passport'
import ForbiddenException from '../../../../src/exceptions/ForbiddenException'
import UnauthorizedException from '../../../../src/exceptions/UnauthorizedException'
import AuthMiddleware from '../../../../src/middlewares/auth/auth.middleware'
import * as jwtUtils from '../../../../src/utils/jwt.utils'
import { Payload } from '../../../../src/interfaces/payload.interface'
import { TokenTypeEnum } from '../../../../src/utils/enums/token.enum'

jest.mock('../../../../src/schemas/auth/auth.schema')
jest.mock('../../../../src/config/passport')
jest.mock('../../../../src/utils/jwt.utils')

describe('AuthMiddleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.Mock

  beforeEach(() => {
    req = { body: {}, user: {}, query: {} }
    res = { locals: {} }
    next = jest.fn()
  })

  describe('verifyJWT', () => {
    it('should call next with UnauthorizedException if authentication fails', () => {
      const authenticateMock = jest.fn((strategy, options, callback) => {
        return (req: Request, res: Response, next: NextFunction) => {
          callback(new Error(), false, { message: 'Unauthorized' })
        }
      })
      ;(passport.authenticate as jest.Mock).mockImplementation(authenticateMock)

      AuthMiddleware.verifyJWT(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new UnauthorizedException())
    })

    it('should call next with no arguments if authentication succeeds', () => {
      const user = { id: 1, username: 'testuser' }
      const authenticateMock = jest.fn((strategy, options, callback) => {
        return (req: Request, res: Response, next: NextFunction) => {
          callback(null, user, undefined)
        }
      })
      ;(passport.authenticate as jest.Mock).mockImplementation(authenticateMock)

      AuthMiddleware.verifyJWT(req as Request, res as Response, next)

      expect(req.user).toEqual(user)
      expect(next).toHaveBeenCalledWith()
    })
  })

  describe('verifyResetPasswordToken', () => {
    it('should call next with UnauthorizedException if token is invalid or expired', () => {
      jest.mocked(jwtUtils.verifyToken).mockReturnValue(null)
      req.params = { token: 'invalid-token' }

      AuthMiddleware.verifyResetPasswordToken(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new UnauthorizedException('Invalid or expired reset password token.'))
    })

    it('should set userId in res.locals and call next if token is valid', () => {
      const userId = '12345'
      res.locals!.userId = userId
      const verifyTokenMock: Payload = {
        id: userId,
        email: 'test@email.com',
        name: 'Test User',
        idDocument: '123456789',
        type: TokenTypeEnum.RESET_PASSWORD,
      }
      jest.mocked(jwtUtils.verifyToken).mockReturnValue(verifyTokenMock)

      req.params = { token: 'valid-token' }

      AuthMiddleware.verifyResetPasswordToken(req as Request, res as Response, next)

      expect(res.locals!.userId).toBe(userId)
      expect(next).toHaveBeenCalledWith()
    })

    it('should call next with error if an exception occurs', () => {
      const error = new Error('Unexpected error')
      jest.mocked(jwtUtils.verifyToken).mockImplementation(() => {
        throw error
      })

      req.params = { token: 'valid-token' }
      AuthMiddleware.verifyResetPasswordToken(req as Request, res as Response, next)
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('authorizeRoles', () => {
    it('should call next with ForbiddenException if user role is not authorized', () => {
      const user = { id: 1, username: 'testuser', role: 'user' }
      req.user = user

      const middleware = AuthMiddleware.authorizeRoles('admin')

      middleware(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new ForbiddenException())
    })

    it('should call next with no arguments if user role is authorized', () => {
      const user = { id: 1, username: 'testuser', role: 'admin' }
      req.user = user

      const middleware = AuthMiddleware.authorizeRoles('admin')

      middleware(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith()
    })

    it('should call next with UnauthorizedException if user is not authenticated', () => {
      const middleware = AuthMiddleware.authorizeRoles('admin')

      middleware(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new UnauthorizedException('Access Denied'))
    })
  })
})
