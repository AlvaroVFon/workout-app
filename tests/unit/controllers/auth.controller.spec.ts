import { NextFunction, Request, Response } from 'express'
import AuthController from '../../../src/controllers/auth.controller'
import { UserDTO } from '../../../src/DTOs/user/user.dto'
import BadRequestException from '../../../src/exceptions/BadRequestException'
import UnauthorizedException from '../../../src/exceptions/UnauthorizedException'
import * as responseHandler from '../../../src/handlers/responseHandler'
import authService from '../../../src/services/auth.service'
import { StatusCode, StatusMessage } from '../../../src/utils/enums/httpResponses.enum'

jest.mock('../../../src/services/auth.service')
jest.mock('../../../src/services/user.service')
jest.mock('../../../src/handlers/responseHandler')

describe('AuthController', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = { body: {}, user: {}, query: {}, params: {} }
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    next = jest.fn()
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should return tokens on successful login', async () => {
      req.body = { email: 'test@example.com', password: 'password' }

      const mockUser = {
        id: '1',
        name: 'Test User',
        lastName: 'User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: { name: 'user' },
        address: '123 Test St',
        country: 'Testland',
        idDocument: '12345',
        createdAt: 123456789,
        updatedAt: 123456789,
      }

      const serviceResponse = {
        user: mockUser,
        token: 'accessToken',
        refreshToken: 'refreshToken',
      }

      const mockToPublicUser = jest.fn().mockReturnValue({
        id: '1',
        name: 'Test User',
        lastName: 'User',
        email: 'test@example.com',
        role: 'user',
        address: '123 Test St',
        country: 'Testland',
        idDocument: '12345',
        createdAt: 123456789,
        updatedAt: 123456789,
      })

      jest.spyOn(UserDTO.prototype, 'toPublicUser').mockImplementation(mockToPublicUser)
      ;(authService.login as jest.Mock).mockResolvedValue(serviceResponse)

      await AuthController.login(req as Request, res as Response, next)

      expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password')
      expect(responseHandler.responseHandler).toHaveBeenCalledWith(
        res,
        StatusCode.OK,
        StatusMessage.OK,
        expect.objectContaining({
          user: expect.any(Object),
          token: 'accessToken',
          refreshToken: 'refreshToken',
        }),
      )
    })

    it('should call next with UnauthorizedException if login fails', async () => {
      req.body = { email: 'test@example.com', password: 'wrongpassword' }
      ;(authService.login as jest.Mock).mockResolvedValue(false)

      await AuthController.login(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedException))
    })
  })

  describe('signUp', () => {
    it('should call authService.signup and return NO_CONTENT', async () => {
      req.body = { email: 'test@example.com', password: 'password123' }
      ;(authService.signup as jest.Mock).mockResolvedValue(undefined)
      jest.spyOn(responseHandler, 'responseHandler').mockImplementation((res, code, message) => {
        res.status(code)
        res.json({ message })
        return res as Response
      })

      await AuthController.signUp(req as Request, res as Response, next)

      expect(authService.signup).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(responseHandler.responseHandler).toHaveBeenCalledWith(res, StatusCode.NO_CONTENT, StatusMessage.NO_CONTENT)
      expect(res.status).toHaveBeenCalledWith(StatusCode.NO_CONTENT)
      expect(res.json).toHaveBeenCalledWith({ message: StatusMessage.NO_CONTENT })
    })

    it('should call next with error if signup throws', async () => {
      const error = new Error('Signup failed')
      jest.spyOn(authService, 'signup').mockRejectedValue(error)

      await AuthController.signUp(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('info', () => {
    it('should return user info', async () => {
      req.user = { id: 1, email: 'test@example.com' }

      await AuthController.info(req as Request, res as Response)

      expect(responseHandler.responseHandler).toHaveBeenCalledWith(res, StatusCode.OK, StatusMessage.OK, req.user)
    })
  })

  describe('refreshTokens', () => {
    it('should return new tokens when refresh token is valid', async () => {
      req.body = { refreshToken: 'validRefreshToken' }
      const newTokens = { token: 'newAccessToken', refreshToken: 'newRefreshToken' }

      ;(authService.refreshTokens as jest.Mock).mockResolvedValue(newTokens)

      await AuthController.refreshTokens(req as Request, res as Response, next)

      expect(authService.refreshTokens).toHaveBeenCalledWith('validRefreshToken')
      expect(responseHandler.responseHandler).toHaveBeenCalledWith(res, StatusCode.OK, StatusMessage.OK, newTokens)
    })

    it('should call next with UnauthorizedException when refresh token is invalid', async () => {
      req.body = { refreshToken: 'invalidRefreshToken' }
      ;(authService.refreshTokens as jest.Mock).mockResolvedValue(null)

      await AuthController.refreshTokens(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedException))
    })

    it('should call next with error when service throws error', async () => {
      req.body = { refreshToken: 'someToken' }
      const error = new Error('Service error')

      ;(authService.refreshTokens as jest.Mock).mockRejectedValue(error)

      await AuthController.refreshTokens(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('forgotPassword', () => {
    it('should return 204 on successful password recovery request', async () => {
      req.body = { email: 'test@example.com' }
      ;(authService.forgotPassword as jest.Mock).mockResolvedValue(undefined)

      await AuthController.forgotPassword(req as Request, res as Response, next)

      expect(authService.forgotPassword).toHaveBeenCalledWith('test@example.com')
      expect(responseHandler.responseHandler).toHaveBeenCalledWith(res, StatusCode.NO_CONTENT, StatusMessage.NO_CONTENT)
    })

    it('should call next with error if service throws error', async () => {
      req.body = { email: 'test@example.com' }
      const error = new Error('Service error')
      ;(authService.forgotPassword as jest.Mock).mockRejectedValue(error)

      await AuthController.forgotPassword(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('resetPassword', () => {
    it('should return 204 on successful password reset', async () => {
      req.body = { code: '123456', password: 'newPassword' }
      req.params = { token: 'validToken' }
      ;(authService.resetPassword as jest.Mock).mockResolvedValue(true)

      await AuthController.resetPassword(req as Request, res as Response, next)

      expect(authService.resetPassword).toHaveBeenCalledWith('validToken', '123456', 'newPassword')
      expect(responseHandler.responseHandler).toHaveBeenCalledWith(res, StatusCode.NO_CONTENT, StatusMessage.NO_CONTENT)
    })

    it('should throw BadRequestException if password reset fails', async () => {
      req.body = { email: 'test@example.com', code: '123456', password: 'newPassword' }
      ;(authService.resetPassword as jest.Mock).mockResolvedValue(false)

      await AuthController.resetPassword(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new BadRequestException('Invalid code or email'))
    })

    it('should call next with error if service throws error', async () => {
      req.body = { email: 'test@example.com', code: '123456', password: 'newPassword' }
      const error = new Error('Service error')
      ;(authService.resetPassword as jest.Mock).mockRejectedValue(error)

      await AuthController.resetPassword(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
