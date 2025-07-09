import { NextFunction, Request, Response } from 'express'
import BadRequestException from '../../../../src/exceptions/BadRequestException'
import AuthValidatorMiddleware from '../../../../src/middlewares/auth/validator.middleware'
import {
  forgotPasswordSchema,
  loginSchema,
  stringParamSchema,
  resetPasswordSchema,
} from '../../../../src/schemas/auth/auth.schema'

jest.mock('../../../../src/schemas/auth/auth.schema')
jest.mock('../../../../src/config/passport')

describe('AuthValidatorMiddleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.Mock

  beforeEach(() => {
    req = { body: {}, user: {}, query: {}, params: {} }
    res = {}
    next = jest.fn()
  })

  describe('validateLoginSchema', () => {
    it('should call next with BadRequestException if validation fails', async () => {
      ;(loginSchema.validate as jest.Mock).mockReturnValueOnce({
        error: { details: [{ message: 'Invalid data' }] },
      })

      await AuthValidatorMiddleware.validateLoginSchema(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new BadRequestException('Invalid data'))
    })

    it('should call next with no arguments if validation passes', async () => {
      ;(loginSchema.validate as jest.Mock).mockReturnValueOnce({ error: null })

      await AuthValidatorMiddleware.validateLoginSchema(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith()
    })
  })

  describe('validateForgotPasswordSchema', () => {
    it('should call next with BadRequestException if validation fails', async () => {
      ;(forgotPasswordSchema.validate as jest.Mock).mockReturnValueOnce({
        error: { details: [{ message: 'Invalid data' }] },
      })

      await AuthValidatorMiddleware.validateForgotPasswordSchema(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new BadRequestException('Invalid data'))
    })

    it('should call next with no arguments if validation passes', async () => {
      ;(forgotPasswordSchema.validate as jest.Mock).mockReturnValueOnce({ error: null })

      await AuthValidatorMiddleware.validateForgotPasswordSchema(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith()
    })
  })

  describe('validateResetPasswordSchema', () => {
    it('should call next with BadRequestException if validation fails', async () => {
      req.params!.token = 'invalidToken'
      ;(stringParamSchema.validate as jest.Mock).mockReturnValueOnce({})
      ;(resetPasswordSchema.validate as jest.Mock).mockReturnValueOnce({
        error: { details: [{ message: 'Invalid data' }] },
      })

      await AuthValidatorMiddleware.validateResetPasswordSchema(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new BadRequestException('Invalid data'))
    })

    it('should call next with no arguments if validation passes', async () => {
      req.params!.token = 'validToken'
      ;(stringParamSchema.validate as jest.Mock).mockReturnValueOnce({ error: null })
      ;(resetPasswordSchema.validate as jest.Mock).mockReturnValueOnce({ error: null })

      await AuthValidatorMiddleware.validateResetPasswordSchema(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith()
    })
  })
})
