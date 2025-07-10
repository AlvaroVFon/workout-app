import { NextFunction, Request, Response } from 'express'
import BadRequestException from '../../../../src/exceptions/BadRequestException'
import AuthValidatorMiddleware from '../../../../src/middlewares/auth/validator.middleware'
import {
  forgotPasswordSchema,
  loginSchema,
  stringParamSchema,
  resetPasswordSchema,
  headerTokenSchema,
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

  describe('validateSignupSchema', () => {
    it('should call next with BadRequestException if validation fails', async () => {
      ;(loginSchema.validate as jest.Mock).mockReturnValueOnce({
        error: { details: [{ message: 'Invalid data' }] },
      })

      await AuthValidatorMiddleware.validateSignupSchema(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new BadRequestException('Invalid data'))
    })

    it('should call next with no arguments if validation passes', async () => {
      ;(loginSchema.validate as jest.Mock).mockReturnValueOnce({ error: null })

      await AuthValidatorMiddleware.validateSignupSchema(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith()
    })

    it('should handle unexpected errors', async () => {
      ;(loginSchema.validate as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Unexpected error')
      })

      await AuthValidatorMiddleware.validateSignupSchema(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  describe('validateSignupVerifySchema', () => {
    it('should call next with BadRequestException if validation fails', () => {
      req.params!.uuid = 'invalidUuid'
      ;(stringParamSchema.validate as jest.Mock).mockReturnValueOnce({
        error: { details: [{ message: 'Invalid UUID' }] },
      })
      ;(loginSchema.validate as jest.Mock).mockReturnValueOnce({
        error: { details: [{ message: 'Invalid data' }] },
      })

      AuthValidatorMiddleware.validateSignupVerifySchema(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new BadRequestException('Invalid UUID'))
    })

    it('should call next with no arguments if validation passes', () => {
      req.params!.uuid = 'validUuid'
      ;(stringParamSchema.validate as jest.Mock).mockReturnValueOnce({ error: null })
      ;(loginSchema.validate as jest.Mock).mockReturnValueOnce({ error: null })

      AuthValidatorMiddleware.validateSignupVerifySchema(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith()
    })
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

  describe('validateRefreshSchema ', () => {
    it('should call next with BadRequestException if validation fails', () => {
      ;(stringParamSchema.validate as jest.Mock).mockReturnValueOnce({
        error: { details: [{ message: 'Invalid data' }] },
      })

      AuthValidatorMiddleware.validateRefreshSchema(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new BadRequestException('Invalid data'))
    })

    it('should call next with no arguments if validation passes', () => {
      ;(stringParamSchema.validate as jest.Mock).mockReturnValueOnce({ error: null })

      AuthValidatorMiddleware.validateRefreshSchema(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith()
    })
  })

  describe('validateHeaderRefreshToken', () => {
    it('should call next with BadRequestException if header is missing', () => {
      ;(headerTokenSchema.validate as jest.Mock).mockReturnValueOnce({
        error: { details: [{ message: 'Refresh token is required' }] },
      })

      req.headers = {}

      AuthValidatorMiddleware.validateHeaderRefreshToken(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new BadRequestException('Refresh token is required'))
    })

    it('should call next with no arguments if header is present', () => {
      ;(headerTokenSchema.validate as jest.Mock).mockReturnValueOnce({ error: null })
      req.headers = { 'x-refresh-token': 'validToken' }

      AuthValidatorMiddleware.validateHeaderRefreshToken(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith()
    })
  })
})
