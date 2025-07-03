import { NextFunction, Request, Response } from 'express'
import AuthController from '../../../src/controllers/auth.controller'
import { UserDTO } from '../../../src/DTOs/user/user.dto'
import UnauthorizedException from '../../../src/exceptions/UnauthorizedException'
import { responseHandler } from '../../../src/handlers/responseHandler'
import authService from '../../../src/services/auth.service'
import userService from '../../../src/services/user.service'
import { StatusCode, StatusMessage } from '../../../src/utils/enums/httpResponses.enum'

jest.mock('../../../src/services/auth.service')
jest.mock('../../../src/services/user.service')
jest.mock('../../../src/handlers/responseHandler')

describe('AuthController', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = { body: {}, user: {} }
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
      expect(responseHandler).toHaveBeenCalledWith(
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
    it('should return created user on successful sign-up', async () => {
      req.body = { email: 'test@example.com', password: 'password' }
      const user = { id: '1', email: 'test@example.com' }
      const publicUser = {
        id: '1',
        email: 'test@example.com',
        idDocument: '123456789',
        name: 'John Doe',
        role: 'admin',
      }
      ;(userService.create as jest.Mock).mockResolvedValue(user)
      jest.spyOn(UserDTO.prototype, 'toPublicUser').mockReturnValue(publicUser)

      await AuthController.signUp(req as Request, res as Response, next)

      expect(userService.create).toHaveBeenCalledWith(req.body)
      expect(responseHandler).toHaveBeenCalledWith(res, StatusCode.CREATED, StatusMessage.CREATED, publicUser)
    })

    it('should call next with error if sign-up fails', async () => {
      const error = new Error('Sign-up failed')
      ;(userService.create as jest.Mock).mockRejectedValue(error)

      await AuthController.signUp(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('info', () => {
    it('should return user info', async () => {
      req.user = { id: 1, email: 'test@example.com' }

      await AuthController.info(req as Request, res as Response)

      expect(responseHandler).toHaveBeenCalledWith(res, StatusCode.OK, StatusMessage.OK, req.user)
    })
  })

  describe('refresh', () => {
    it('should return new tokens on successful refresh', async () => {
      req.body = { refreshToken: 'validRefreshToken' }
      const tokens = { token: 'newAccessToken', refreshToken: 'newRefreshToken' }
      ;(authService.refreshToken as jest.Mock).mockResolvedValue(tokens)

      await AuthController.refresh(req as Request, res as Response, next)

      expect(authService.refreshToken).toHaveBeenCalledWith('validRefreshToken')
      expect(responseHandler).toHaveBeenCalledWith(res, StatusCode.OK, StatusMessage.OK, tokens)
    })

    it('should call next with UnauthorizedException if refresh token is invalid', async () => {
      req.body = { refreshToken: 'invalidRefreshToken' }
      ;(authService.refreshToken as jest.Mock).mockResolvedValue(null)

      await AuthController.refresh(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedException))
    })

    it('should call next with error if service throws', async () => {
      req.body = { refreshToken: 'validRefreshToken' }
      const error = new Error('Service error')
      ;(authService.refreshToken as jest.Mock).mockRejectedValue(error)

      await AuthController.refresh(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
