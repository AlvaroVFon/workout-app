import { Request, Response, NextFunction } from 'express'
import AuthMiddleware from '../../../src/middlewares/auth.middleware'
import { loginSchema } from '../../../src/schemas/auth/auth.schema'
import BadRequestException from '../../../src/exceptions/BadRequestException'
import UnauthorizedException from '../../../src/exceptions/UnauthorizedException'
import passport from '../../../src/config/passport'

jest.mock('../../../src/schemas/auth/auth.schema')
jest.mock('../../../src/config/passport')

describe('AuthMiddleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.Mock

  beforeEach(() => {
    req = { body: {} }
    res = {}
    next = jest.fn()
  })

  describe('verifyLoginSchema', () => {
    it('should call next with BadRequestException if validation fails', async () => {
      ;(loginSchema.validate as jest.Mock).mockReturnValueOnce({
        error: { details: [{ message: 'Invalid data' }] },
      })

      await AuthMiddleware.verifyLoginSchema(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new BadRequestException('Invalid data'))
    })

    it('should call next with no arguments if validation passes', async () => {
      ;(loginSchema.validate as jest.Mock).mockReturnValueOnce({ error: null })

      await AuthMiddleware.verifyLoginSchema(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith()
    })
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
})
