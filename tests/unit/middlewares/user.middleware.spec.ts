import { Request, Response, NextFunction } from 'express'
import userMiddleware from '../../../src/middlewares/user.middleware'
import userService from '../../../src/services/user.service'
import { createUserSchema, updateUserSchema } from '../../../src/schemas/user/user.schema'
import ConflictException from '../../../src/exceptions/ConflictException'
import BadRequestException from '../../../src/exceptions/BadRequestException'

jest.mock('../../../src/services/user.service')
jest.mock('../../../src/schemas/user/user.schema')
jest.mock('../../../src/schemas/utils.schema')

describe('UserMiddleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = { body: {}, params: {} }
    res = {}
    next = jest.fn()
  })

  describe('validateUserExistence', () => {
    it('should call next with ConflictException if user exists', async () => {
      req.body = { email: 'test@example.com' }
      ;(userService.getByEmail as jest.Mock).mockResolvedValue({ id: '123' })

      await userMiddleware.validateUserExistence(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(ConflictException))
    })

    it('should call next without error if user does not exist', async () => {
      req.body = { email: 'test@example.com' }
      ;(userService.getByEmail as jest.Mock).mockResolvedValue(null)

      await userMiddleware.validateUserExistence(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith()
    })
  })

  describe('validateCreateUserSchemas', () => {
    it('should call next with BadRequestException if validation fails', async () => {
      req.body = { invalid: 'data' }
      ;(createUserSchema.validate as jest.Mock).mockReturnValue({
        error: { details: [{ message: 'Invalid data' }] },
      })

      await userMiddleware.validateCreateUserSchemas(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestException))
    })

    it('should call next without error if validation passes', async () => {
      req.body = { valid: 'data' }
      ;(createUserSchema.validate as jest.Mock).mockReturnValue({})

      await userMiddleware.validateCreateUserSchemas(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith()
    })
  })

  describe('validateUpdateUserSchemas', () => {
    it('should call next with BadRequestException if validation fails', async () => {
      req.body = { invalid: 'data' }
      ;(updateUserSchema.validate as jest.Mock).mockReturnValue({
        error: { details: [{ message: 'Invalid data' }] },
      })

      await userMiddleware.validateUpdateUserSchemas(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestException))
    })

    it('should call next without error if validation passes', async () => {
      req.body = { valid: 'data' }
      ;(updateUserSchema.validate as jest.Mock).mockReturnValue({})

      await userMiddleware.validateUpdateUserSchemas(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith()
    })
  })
})
