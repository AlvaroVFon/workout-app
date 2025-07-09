import { NextFunction, Request, Response } from 'express'
import passport from '../../../../src/config/passport'
import ForbiddenException from '../../../../src/exceptions/ForbiddenException'
import UnauthorizedException from '../../../../src/exceptions/UnauthorizedException'
import AuthMiddleware from '../../../../src/middlewares/auth/auth.middleware'

jest.mock('../../../../src/schemas/auth/auth.schema')
jest.mock('../../../../src/config/passport')

describe('AuthMiddleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.Mock

  beforeEach(() => {
    req = { body: {}, user: {}, query: {} }
    res = {}
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
